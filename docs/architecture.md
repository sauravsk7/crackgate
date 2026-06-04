# CrackGate — Production Architecture (AWS)

Target: **200 users**, **~$32/mo**, **p95 page load < 1.5s** for Indian users,
**zero-downtime deploys**, no AWS-only lock-in beyond EC2/RDS endpoints.

## High-level diagram

```mermaid
flowchart TB
  user(["👤 User in Delhi/Bengaluru"])
  cf["☁️ Cloudflare DNS<br/>(free, DDoS L3/L4)"]
  cfront["⚡ CloudFront<br/>(Mumbai · Delhi · Hyderabad edges)<br/>TLS, brotli, HTTP/3<br/>cache: /_next/static, fonts, images"]

  subgraph vpc["VPC ap-south-1"]
    subgraph public_subnet["Public subnet"]
      ec2["🟢 EC2 t4g.small · Elastic IP<br/>Ubuntu 22.04 · 30 GB gp3"]
    end
    subgraph private_subnet["Private subnet"]
      rds["🗄️ RDS db.t4g.micro<br/>Postgres 16 · 20 GB gp3<br/>7-day PITR · daily snapshots"]
    end
  end

  subgraph ec2_stack["docker compose on EC2"]
    caddy["🔐 Caddy 2<br/>:80 / :443 · auto-TLS"]
    web["⚛️ Next.js 15 standalone<br/>:3000"]
    pgb["🔄 pgbouncer<br/>:5432 transaction pool"]
  end

  s3_uploads["📦 S3 crackgate-uploads<br/>(private · presigned URLs)"]
  s3_backups["📦 S3 crackgate-backups<br/>(lifecycle 30d → Glacier)"]
  ecr["📚 ECR<br/>crackgate-web:latest"]
  sm["🔑 Secrets Manager<br/>DB url · Auth secret · Razorpay"]
  cw["📊 CloudWatch<br/>logs · metrics · alarms"]
  route53["🌐 Route 53<br/>health checks → SNS SMS"]

  gha[" GitHub Actions<br/>build · push · deploy"]

  user --> cf
  cf --> cfront
  cfront -- cache miss --> ec2
  ec2 --> caddy
  caddy --> web
  web --> pgb
  pgb --> rds
  ec2 -.IAM role.-> s3_uploads
  ec2 -.IAM role.-> s3_backups
  ec2 -.IAM role.-> sm
  ec2 -.awslogs driver.-> cw
  ec2 -. pull on deploy .-> ecr
  gha -- push image --> ecr
  gha -- ssh deploy --> ec2
  route53 -.30s ping.-> cfront

  classDef aws fill:#fff,stroke:#FF9900,stroke-width:2px,color:#000
  classDef compute fill:#E8F4FD,stroke:#0366d6,color:#000
  classDef data fill:#FFF4E5,stroke:#FF9900,color:#000
  class cfront,ec2,ecr,sm,cw,route53,s3_uploads,s3_backups aws
  class caddy,web,pgb compute
  class rds data
```

## Request lifecycle

```mermaid
sequenceDiagram
  autonumber
  participant U as User browser
  participant CF as Cloudflare DNS
  participant CFR as CloudFront edge
  participant CAD as Caddy (EC2)
  participant N as Next.js
  participant PB as pgbouncer
  participant RDS as RDS Postgres

  U->>CF: DNS query crackgate.in
  CF-->>U: A → CloudFront IP
  U->>CFR: HTTPS GET /dashboard
  Note over CFR: TLS terminates at Indian edge<br/>(~15ms RTT)
  CFR->>CAD: cache miss → origin
  CAD->>N: reverse_proxy :3000
  N->>N: auth() → read JWT cookie
  N->>PB: Prisma SELECT user
  PB->>RDS: pooled SQL
  RDS-->>PB: rows
  PB-->>N: rows
  N-->>CAD: HTML + RSC payload
  CAD-->>CFR: 200 OK
  CFR-->>U: HTML (total ~150-250ms)
  Note over U,CFR: subsequent /_next/static/* served<br/>from edge — origin not touched
```

## Deploy pipeline

```mermaid
flowchart LR
  push["git push origin main"] --> gha
  gha["GitHub Actions"] --> b1["1. npm ci + lint + typecheck"]
  b1 --> b2["2. docker buildx --platform linux/arm64<br/>tag: sha-<short>"]
  b2 --> b3["3. push to ECR"]
  b3 --> b4["4. ssh deploy@ec2:<br/>docker compose pull web<br/>docker compose up -d --no-deps web"]
  b4 --> b5["5. exec prisma migrate deploy<br/>(via DIRECT_URL bypassing pgbouncer)"]
  b5 --> b6["6. healthcheck /api/healthz<br/>rollback on fail"]
```

## Why each component exists

| Component | Role | What breaks without it |
|---|---|---|
| **Cloudflare DNS** | Resolve `crackgate.in` to CloudFront. Free DDoS L3/L4 shield. | Site goes down during DNS-level attacks |
| **CloudFront** | TLS termination at Indian edges, cache `/_next/static`, brotli, HTTP/3 | p95 +600ms latency, all egress hits origin |
| **EC2 t4g.small** | Runs `docker compose` with Caddy + Next.js + pgbouncer | No app server |
| **Caddy** | Auto Let's Encrypt cert, reverse proxy, HSTS, rate-limit | Manual cert renewal, no HTTP/3 |
| **Next.js (standalone)** | Server components, server actions, NextAuth, API routes | No app |
| **pgbouncer** | Multiplex 200 client conns → 20 RDS conns | "too many connections" 500s on bursts |
| **RDS Postgres** | Source of truth: users, attempts, payments, NextAuth sessions | Total data loss potential |
| **S3 uploads** | User PDFs via presigned URLs — bytes bypass EC2 | EBS fills up, app slows |
| **S3 backups** | Nightly `pg_dump.sql.gz` with 30-day → Glacier lifecycle | RDS PITR + manual snapshots only — no off-engine recovery |
| **ECR** | Private Docker registry for the prod image | Slow deploys (build on box), no rollback to prior image |
| **Secrets Manager** | Stores `DATABASE_URL`, `AUTH_SECRET`, Razorpay keys | Secrets sit in `.env` on disk |
| **CloudWatch** | Logs via `awslogs` driver, EC2/RDS metrics, alarms | Blind to outages until users complain |
| **Route 53** | Health check `/api/healthz` every 30s → SNS SMS | No proactive outage detection |

## Capacity check (200 users)

| Resource | Limit | Expected peak | Headroom |
|---|---|---|---|
| EC2 CPU | 2 vCPU | ~5% (Next.js handles ~200 req/s) | 20× |
| EC2 RAM | 2 GB | ~900 MB (web + Caddy + pgbouncer + Docker overhead) | 2.2× |
| EBS IOPS | 3000 baseline | <50 | 60× |
| RDS connections | 85 | 20 (via pgbouncer) | 4× |
| RDS storage | 20 GB | <2 GB | 10× |
| CloudFront free tier | 1 TB egress | ~30 GB | 33× |
| CloudWatch free tier | 5 GB logs | ~1 GB | 5× |

**Verdict**: stack runs at <10% utilization. You're buying margin and reliability, not capacity.

## Cost — $32/mo itemized

| Item | $/mo | Notes |
|---|---|---|
| EC2 t4g.small on-demand | 14 | drops to ~$10 with 1-yr RI |
| 30 GB gp3 EBS | 2.40 | |
| RDS db.t4g.micro Postgres 16 | 13 | single-AZ |
| RDS backups (under DB size) | 0 | free up to DB size |
| CloudFront | ~1 | within free tier most months |
| Route 53 hosted zone | 0.50 | |
| Secrets Manager (3 secrets) | 1.20 | $0.40/each |
| S3 uploads + backups (~10 GB) | 0.50 | Standard + Glacier lifecycle |
| Data transfer out (~30 GB) | ~1 | most absorbed by CloudFront cache |
| CloudWatch logs | 0–1 | 5 GB free |
| **Total** | **~$32** | **~6 months on $200 credits** |

With 1-year EC2 RI + 3-year RDS RI applied: **~$24/mo → ~8 months runway**.

## Scaling triggers

| Trigger | Action | Cost delta |
|---|---|---|
| 1,000 DAU | RDS retention → 14 days | $0 |
| 2,000 DAU | EC2 → t4g.medium | +$7 |
| 5,000 DAU | 2× EC2 + ALB + multi-AZ RDS | +$45 |
| 10,000 DAU | ECS Fargate + RDS Proxy | +$80 |
| Enterprise pilot | WAF + GuardDuty + AWS Backup | +$15 |

No re-architecture: same Docker image runs on ECS, same Prisma schema on Aurora.

## Related files

- [Dockerfile](../Dockerfile) — multi-stage build, ARM64-compatible
- [docker-compose.aws.yml](../docker-compose.aws.yml) — production stack for EC2 (pgbouncer + ECR pull + awslogs + nightly backup)
- [docker-compose.yml](../docker-compose.yml) — Contabo / single-host variant (Postgres in-compose)
- [Caddyfile](../Caddyfile) — reverse proxy, TLS, security headers
- [infra/lib/data-stack.ts](../infra/lib/data-stack.ts) — CDK for Aurora Serverless v2 (future scale target, not in use yet)
- [apps/web/src/app/api/healthz/route.ts](../apps/web/src/app/api/healthz/route.ts) — Route 53 + Caddy health probe
