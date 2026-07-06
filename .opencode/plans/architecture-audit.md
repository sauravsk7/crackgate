# Architecture & Cost Optimization Roadmap — crackgate.in

**Date:** 2026-07-06  
**Auditor:** Site Audit & Optimization Coordinator  
**Sub-agents:** Frontend Performance Engineer, Senior Backend & DBA, FinOps Architect, SRE

---

## 🔴 Critical

| # | Domain | Finding | File:Line | Action | Est. Impact |
|---|--------|---------|-----------|--------|-------------|
| C1 | **DBA** | No DB connection pooling — bare Prisma on `db.t4g.micro` (~40 max conns) — `DATABASE_URL` lacks `?connection_limit=` | `.env.example:12`, `packages/database/src/index.ts` | Add `?connection_limit=10&pool_timeout=10` | Prevents "too many connections" outage at scale |
| C2 | **DBA** | Missing indexes: `OtpCode[ip,createdAt]`, `OtpCode[expiresAt]`, `Activity[type,userId,createdAt]`, `Payment[status,createdAt]` — full table scans on login, dashboard, admin queries | `schema.prisma:117,137,234,237` | Add 4 composite indexes | Table scans → index scans, OTP/login path optimized |
| C3 | **SRE/DBA** | Weekly digest + WhatsApp sends are **synchronous sequential** — no job queue, no Redis. Digest blocks event loop for minutes; webhook fires-and-forgets without retry | `cron/weekly-digest/route.ts:59-149`, `lib/whatsapp.ts` | Deploy BullMQ + Redis; move sends + digest to async workers with retry + DLQ | Prevents timeouts, adds reliability to payments & notifications |
| C4 | **SRE/DBA** | Razorpay webhook lacks idempotency — retries could double-credit user upgrades | `api/razorpay/webhook/route.ts:12-106` | Add `if (payment.status === "captured") return` guard; store `event_id` for dedup | Prevents double-credit on webhook retries |
| C5 | **DBA/SRE** | No rate limiting on 5+ POST mutations: `/api/attempts`, `/api/practice/attempt`, `/api/newsletter/subscribe`, `/api/razorpay/order`, `/api/whatsapp/otp/send` | All route.ts files for those endpoints | Add IP/user rate-limiting via middleware token bucket or Cloudflare WAF | Prevents DB flood / abuse / OTP spam |
| C6 | **Frontend/DBA** | `auth()` + JWT callback hits DB on **every request** — blocks static caching of 15+ public pages. Middleware runs on ALL routes including `/faq`, `/blog`, `/pricing` | `middleware.ts:22-23`, `lib/auth.ts:112-116`, `layout.tsx:47` | Embed `plan`/`role` in JWT; narrow middleware matcher to `["/dashboard/*","/settings/*","/admin/*"]` | 30-50% compute reduction |

---

## 🟡 High

| # | Domain | Finding | File:Line | Action | Est. Impact |
|---|--------|---------|-----------|--------|-------------|
| H1 | **FinOps** | Cloudflare DNS-only (proxied OFF) — no CDN caching, no DDoS protection, all traffic hits EC2 directly | `GO_LIVE.md:128` | Flip Cloudflare A records to proxied (orange cloud); SSL to Full (Strict) | 50-80% bandwidth savings, ~$20-40/mo |
| H2 | **Frontend** | 36 `force-dynamic` pages + 2 contradictory `force-dynamic` + `generateStaticParams`. Zero ISR usage — 100% server hit rate for content pages | `learn/[slug]/page.tsx:9,60`, `study/[slug]/page.tsx:8,62`, `gate/[subject]/layout.tsx:5,7`, 30+ more | Replace with `revalidate: 3600` on content pages; keep `force-dynamic` only for user-personalized routes | 30-50% compute reduction |
| H3 | **Frontend** | `recharts` (~220KB) + `katex` (~70KB CSS) + `framer-motion` (~35KB) eagerly imported globally — zero `next/dynamic` usage anywhere | `components/admin-charts.tsx:9`, `components/score-trend-chart.tsx:3`, `components/math-text.tsx:14`, `layout.tsx:4` | Wrap heavy components in `dynamic(() => import(...), { ssr: false })`; move KaTeX CSS out of root layout | ~300KB client JS reduction |
| H4 | **Frontend** | GA4 uses raw `<script async>` — blocks LCP; no `next/script` `strategy="lazyOnload"` anywhere | `layout.tsx:60-65` | Replace with `<Script src="..." strategy="lazyOnload" />` | Better LCP score |
| H5 | **Frontend/DBA** | 31+ GET API routes + OG image endpoint — zero `Cache-Control` headers. No browser/CDN caching for any static/list data | All GET route.ts files, `api/og/route.tsx` | Add `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400` to cacheable endpoints | 50%+ DB load reduction |
| H6 | **Frontend** | Dashboard double-fetches (SSR + client `useEffect`); 22 `useEffect`+`fetch` patterns; `@tanstack/react-query` unused | `dashboard/page.tsx`, multiple components | Adopt React Query with `staleTime: 60s`; pass dashboard data as props | ~50% less client fetching |
| H7 | **SRE** | No `error.tsx` or `loading.tsx` at any route segment — unhandled errors blow up entire layout; white flashes on navigation | All `app/*` route segments | Add `error.tsx` + `loading.tsx` to every route group | Production stability |
| H8 | **Frontend** | PostHog provider imports `posthog-js` (~30KB) server-side — `typeof window === "undefined"` guard doesn't prevent bundling | `components/posthog-provider.tsx:46` | Wrap in `dynamic(() => import(...), { ssr: false })` at layout level | Server bundle reduction |
| H9 | **SRE** | No `viewport` export in root layout — mobile viewport defaults to browser auto-scaling | `layout.tsx` (missing) | Add `export const viewport: Viewport = { width: 'device-width', initialScale: 1 }` | Mobile UX |
| H10 | **SRE** | 12+ route.ts files lack try/catch — DB crash returns raw 500 HTML. No root `error.tsx` | Multiple API route.ts files | Wrap all handlers in try/catch with structured error response | Production stability |
| H11 | **SRE** | CSV export builds entire file in-memory — OOM risk on 20K+ attempt rows | `api/admin/export/route.ts:28-146` | Use streaming `Transform`/`Readable` piped to `NextResponse` | Stability at scale |
| H12 | **SRE** | No `AbortSignal.timeout` on external HTTP calls (WhatsApp, Razorpay) — upstream hangs freeze the process | `lib/whatsapp.ts:22`, `api/razorpay/order/route.ts:36` | Add `AbortSignal.timeout(5000)` to all `fetch()` calls | Prevents hung connections |
| H13 | **DBA** | Unbounded `findMany()` — percentile pulls 50K rows, admin overview aggregates run full table scans | `attempts/percentile/route.ts:55`, `admin/overview/route.ts:98-101` | Add `take` + cursor pagination; precompute percentiles into cache table | Prevents OOM at scale |
| H14 | **FinOps** | Staging EC2 auto-stops but EIP remains allocated — $2.06/mo for stopped-instance IP | `infra-tf/staging/compute.tf:54-62` | Release EIP on stop, reallocate on start | ~$2/mo savings |
| H15 | **DBA/FinOps** | `UpiPayment.adminNote` unbounded `String`; `Activity.payload` unbounded `Json` — no TTL cleanup on Activity | `schema.prisma`, Activity model | Add `@db.VarChar(280)` on notes; archive Activity > 1 year to S3 Glacier | Storage cost control |

---

## 🟢 Medium

| # | Domain | Finding | File:Line | Action |
|---|--------|---------|-----------|--------|
| M1 | **Frontend** | `typescript: { ignoreBuildErrors: true }` in next.config — type bugs ship to production | `next.config.ts:12` | Fix readonly-to-mutable type issues; remove flag |
| M2 | **Frontend** | No skeleton loaders on async components — dashboard charts pop in causing CLS | All dashboard chart components | Add `loading.tsx`; skeleton placeholders with explicit `min-h` |
| M3 | **Frontend** | Mobile: touch targets not enforced (48x48px min); CLS from dynamic chart heights | Various components | Audit interactive elements; set explicit `min-h` on dynamic containers |
| M4 | **DBA** | POST `/api/attempts` echoes back `answersJson` (user just uploaded it) | `api/attempts/route.ts` | `.select()` exclude `answersJson` from response |
| M5 | **FinOps** | `nodemailer` + `@types/nodemailer` installed but never used | `package.json` | Remove dependency |
| M6 | **FinOps** | Orphaned `pnpm-lock.yaml` (using npm) — 110K lines, 5MB repo bloat | Root directory | Delete file; add to `.gitignore` |
| M7 | **SRE** | Sentry `tracesSampleRate: 0.1` hardcoded — no env override for cost control | `sentry.*.config.ts` files | Read from `process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.1"` |
| M8 | **DBA** | Admin overview route makes 15+ separate DB queries | `admin/overview/route.ts` | Combine into batch query; cache with 5-min TTL |
| M9 | **DBA** | `OtpCode` grows unbounded — no TTL cleanup (every OTP send creates a row forever) | `schema.prisma:228-240` | Add weekly cleanup cron for rows > 7 days old |
| M10 | **SRE** | Webhook handler uses `as` type assertion (no Zod validation) on Razorpay payload | `api/razorpay/webhook/route.ts:26-35` | Validate with Zod for type safety |
| M11 | **SRE** | Cron auth uses plain string compare (no `timingSafeEqual`) | `cron/weekly-digest/route.ts:27-32` | Use `crypto.timingSafeEqual` |
| M12 | **SRE** | CSP `form-action 'self'` may break Razorpay checkout form | `next.config.ts:46` | Verify; add `https://api.razorpay.com` to `form-action` if needed |
| M13 | **Frontend** | 48 `"use client"` directives — high ratio, some could be server components with client islands | 46 in `components/`, 2 in `app/` | Audit: `share-on-whatsapp`, `newsletter-form`, `subject-chip-grid` could be server with progressive enhancement |
| M14 | **FinOps** | No WebP/AVIF image formats in next.config — 25-35% bandwidth savings missed | `next.config.ts:22-27` | Add `images: { formats: ["image/avif", "image/webp"] }` |
| M15 | **FinOps** | Staging shares prod RDS — load tests degrade prod | `STAGING.md:15-26` | Accept tradeoff; revisit when budget allows ($15/mo for isolation) |

---

## 🔵 Low (Track)

| # | Domain | Finding | File:Line |
|---|--------|---------|-----------|
| L1 | Frontend | `/public/brand/*.jpg` (~150KB) — appear unused | `public/brand/` |
| L2 | Frontend | `hero-carousel.tsx` uses `framer-motion` for inline SVG animations — 926 lines | `components/hero-carousel.tsx:83-108` |
| L3 | Frontend | `psu-cil-hero.tsx` duplicates `ChevronLeft`/`ChevronRight` as inline SVGs (could use `lucide-react`) | `components/psu-cil-hero.tsx:176-189` |
| L4 | Frontend | OG API endpoint missing `Cache-Control` — each social share re-renders 1200×630 PNG | `api/og/route.tsx` |
| L5 | Frontend | Missing OG metadata on gated pages (login, dashboard, settings) | `login/page.tsx`, `dashboard/page.tsx`, etc. |
| L6 | DBA | `Entitlement.expiry` nullable — no default expiry for time-unlimited grants | `schema.prisma:82` |
| L7 | DBA | No `DATABASE_URL` validation — silent fallback to empty string | `packages/database/src/index.ts:11-14` |
| L8 | SRE | Health check only does `SELECT 1` — doesn't test Razorpay/WhatsApp/Sentry reachability | `api/healthz/route.ts:7-14` |
| L9 | SRE | GA fires without consent — potential GDPR/DPDPA issue | `layout.tsx:58-67` |
| L10 | SRE | No CAPTCHA (Turnstile/hCaptcha) on OTP send form | `api/whatsapp/otp/send/route.ts` |
| L11 | FinOps | Empty `/public/tools/` directory copied into Docker image | `public/tools/` |
| L12 | FinOps | CloudWatch log retention inconsistent (30d EC2 vs 14d web) | `infra-tf/storage.tf:169-183` |

---

## Executive Summary

This is a well-structured early-stage monorepo. The audit identified **6 critical, 15 high, 15 medium, and 12 low** items across four domains.

### Quick Wins (zero code changes, high impact)

| Action | Est. Impact |
|--------|-------------|
| Enable Cloudflare proxy (orange cloud) | 50-80% bandwidth savings, ~$20-40/mo |
| Change middleware matcher to 3 prefixes | 20-30% compute reduction |
| Delete `pnpm-lock.yaml` + `nodemailer` deps | 5MB repo bloat reduction |

### Sprint 1: Stability (~2 days)

| Priority | Domain | Action |
|----------|--------|--------|
| 1 | DBA | Add `?connection_limit=10` to DATABASE_URL |
| 2 | DBA | Add 4 composite indexes to Prisma schema |
| 3 | Frontend | Add `viewport` export to root layout |
| 4 | Frontend | Replace raw `<script>` GA with `<Script strategy="lazyOnload">` |
| 5 | SRE | Add `error.tsx` + `loading.tsx` to all route groups |
| 6 | SRE | Wrap all API routes in try/catch with structured responses |
| 7 | DBA/SRE | Add rate limiting middleware to POST endpoints |
| 8 | DBA | Add `take` + cursor pagination to unbounded `findMany()` calls |

### Sprint 2: Performance (~3 days)

| Priority | Domain | Action |
|----------|--------|--------|
| 1 | Frontend | Replace `force-dynamic` with `revalidate: 3600` on content pages |
| 2 | Frontend | `next/dynamic` + `ssr: false` for recharts, katex, framer-motion |
| 3 | Frontend | Add `Cache-Control` headers to GET endpoints + OG API |
| 4 | SRE | Add `AbortSignal.timeout` to all external HTTP calls |
| 5 | SRE | Embed plan/role in JWT; split layout into static + auth-aware |
| 6 | Frontend | Wrap PostHogProvider in `dynamic(..., { ssr: false })` |
| 7 | DBA | Precompute percentiles into cache table |

### Sprint 3: Scale (~5 days)

| Priority | Domain | Action |
|----------|--------|--------|
| 1 | SRE | Deploy BullMQ + Redis; move weekly digest + WhatsApp to workers |
| 2 | SRE | Razorpay webhook idempotency guard + Zod validation |
| 3 | Frontend | Adopt React Query; refactor dashboard double-fetch |
| 4 | SRE | CSV export streaming (not in-memory) |
| 5 | DBA | Activity archival to S3 Glacier for rows > 1 year |
| 6 | DBA | OTP code cleanup cron (delete > 7 days) |

### Backlog

All Low items + remaining Medium items that were deprioritized.

**Estimated impact after all sprints:** ~50-60% compute reduction, ~80% bandwidth savings, ~$20-40/mo cost savings, zero additional infra cost.
