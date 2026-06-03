# Deploying CrackGate to Contabo (Mumbai)

End-to-end guide to ship **crackgate.in** on a single Contabo Cloud VPS 10
(Mumbai region) with Docker Compose, Caddy auto-HTTPS, and Cloudflare CDN.

> **Cost summary:** ~₹520/mo VPS + €4.50 one-time setup fee + your domain.
> Capacity: comfortably handles 200 concurrent users with headroom.

---

## 0. What you need before you start

- [ ] A SSH public key on your laptop (`cat ~/.ssh/id_ed25519.pub`)
- [ ] Domain **crackgate.in** in a registrar (you have this)
- [ ] A free [Cloudflare](https://cloudflare.com) account
- [ ] Razorpay LIVE API keys
- [ ] Google OAuth Client (Web) with redirect `https://crackgate.in/api/auth/callback/google`

---

## 1. Buy the VPS

1. Go to <https://contabo.com/en/vps/cloud-vps/> → **Cloud VPS 10**.
2. Region: **Asia (India / Mumbai)**.
3. OS: **Ubuntu 22.04 LTS**.
4. Add your SSH key during checkout (or use a strong root password and add the key later).
5. Pay (you'll be charged ₹520 + ~€4.50 setup). VPS provisioning takes 5–30 min.
6. Note the **IPv4 address** Contabo emails you.

---

## 2. DNS — Cloudflare in front

1. Add **crackgate.in** to Cloudflare → it gives you 2 nameservers.
2. Update nameservers at your registrar to those two.
3. In Cloudflare DNS, add:
   | Type | Name | Content        | Proxy   |
   |------|------|----------------|---------|
   | A    | @    | `<vps-ip>`     | **DNS only (grey cloud)** — initially |
   | A    | www  | `<vps-ip>`     | **DNS only (grey cloud)** — initially |
4. Wait for propagation (`dig crackgate.in +short` should return the VPS IP).
   > We keep proxy OFF for the first deploy so Caddy can fetch a Let's Encrypt cert via HTTP-01.
   > Re-enable proxy ("orange cloud") after the cert is issued — see §7.

---

## 3. Bootstrap the VPS (one-time)

SSH in as root:

```bash
ssh root@<vps-ip>
```

Run the bootstrap script. Replace `<your-ssh-pubkey>` with the contents of your
local `~/.ssh/id_ed25519.pub`:

```bash
export DEPLOY_USER=deploy
export SSH_PUBKEY="ssh-ed25519 AAAA... you@laptop"
curl -fsSL https://raw.githubusercontent.com/ydvikasiitkgp-arch/crackgate/main/scripts/vps-bootstrap.sh | bash
```

This installs Docker + Compose, creates a non-root `deploy` user, hardens SSH,
enables UFW + fail2ban, and clones the repo into `/home/deploy/crackgate`.

Disconnect and reconnect as `deploy`:

```bash
exit
ssh deploy@<vps-ip>
```

---

## 4. Configure production secrets

```bash
cd ~/crackgate
cp .env.production.example .env.production
nano .env.production
```

Required values:

| Key                          | How to get it                                   |
|------------------------------|-------------------------------------------------|
| `POSTGRES_PASSWORD`          | `openssl rand -hex 32` — **hex only**, no `+/=@:#` (URL-safe) |
| `AUTH_SECRET`                | `openssl rand -base64 48`                       |
| `AUTH_URL`                   | `https://crackgate.in`                          |
| `ACME_EMAIL`                 | Your email (for Let's Encrypt expiry notices)   |
| `GOOGLE_CLIENT_ID/SECRET`    | Google Cloud Console → OAuth 2.0 Client         |
| `RAZORPAY_KEY_ID/SECRET`     | Razorpay Dashboard → Settings → API Keys (LIVE) |
| `RAZORPAY_WEBHOOK_SECRET`    | When you register the webhook (§6)              |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID`| Same as `RAZORPAY_KEY_ID` — baked into client bundle at build time |

> ⚠️ **`NEXT_PUBLIC_*` are build-time, not runtime.** Changing any
> `NEXT_PUBLIC_*` value requires rebuilding the web image:
> `docker compose --env-file .env.production build web && docker compose --env-file .env.production up -d`.
> Running `restart` alone will NOT pick up the change.

Lock down the file:

```bash
chmod 600 .env.production
```

---

## 5. First deploy

```bash
./scripts/deploy.sh
```

This will:

1. `git pull` (no-op the first time)
2. Build the `web` image (~3–5 min on first build)
3. Start `db`, `web`, `caddy`
4. Wait for the health check at `/api/healthz`

Verify:

```bash
curl -fsS http://<vps-ip>/api/healthz   # via Caddy on port 80 (redirects to 443 once cert is issued)
docker compose logs -f caddy            # watch Caddy obtain the LE cert
docker compose logs -f web              # watch Next.js boot
```

Within ~30 s of DNS resolving, `https://crackgate.in` should be live with a
valid TLS certificate.

---

## 6. Hook up Razorpay webhook

1. Razorpay Dashboard → Webhooks → **Add New Webhook**
2. URL: `https://crackgate.in/api/razorpay/webhook`
3. Secret: generate a strong random string, paste it into Razorpay **and** into
   `RAZORPAY_WEBHOOK_SECRET` in `.env.production`.
4. Events: `payment.captured`, `payment.failed`, `order.paid`, `subscription.*`
5. Re-deploy: `./scripts/deploy.sh`
6. Use Razorpay's "Send test event" button to confirm 200 OK.

---

## 7. Turn on Cloudflare proxy (recommended)

Once the LE cert is issued and the site works on grey-cloud:

1. Cloudflare → DNS → flip both A records to **Proxied (orange cloud)**.
2. Cloudflare → SSL/TLS → set mode to **Full (strict)** — required so Cloudflare
   actually validates Caddy's cert.
3. (Optional) Cloudflare → Rules → enable:
   - **Always Use HTTPS**
   - **Auto Minify** (CSS/JS only — leave HTML alone, Next.js handles it)
   - **Brotli** compression
   - **HSTS** with `max-age=31536000; includeSubDomains`
4. Cloudflare → Security → set Bot Fight Mode + WAF managed rules ON.

You now have a free global CDN, DDoS protection, and analytics in front of Caddy.

---

## 8. Backups (nightly)

```bash
crontab -e
```

Add:

```cron
0 3 * * * /home/deploy/crackgate/scripts/backup.sh >> /home/deploy/backup.log 2>&1
```

Local backups land in `/home/deploy/backups/`. To also push off-box (recommended),
install `rclone`, configure a [Cloudflare R2](https://developers.cloudflare.com/r2/)
bucket, then set in `.env.production`:

```bash
RCLONE_REMOTE=r2:crackgate-backups
```

R2 free tier (10 GB + 1 M ops/mo) is enough for years of dumps.

---

## 9. Day-2 operations

| Task                 | Command                                                              |
|----------------------|----------------------------------------------------------------------|
| Tail logs            | `docker compose logs -f web`                                         |
| Restart web only     | `docker compose restart web`                                         |
| Apply code changes   | `./scripts/deploy.sh`                                                |
| Manual DB shell      | `docker compose exec db psql -U crackgate`                           |
| Prisma Studio (SSH tunnel) | `ssh -L 5555:127.0.0.1:5555 deploy@<vps-ip>` then in another terminal `docker compose exec web npx prisma studio --schema=./packages/database/prisma/schema.prisma` |
| One-off backup       | `./scripts/backup.sh`                                                |
| Restore from backup  | `gunzip -c backup.sql.gz \| docker compose exec -T db psql -U crackgate crackgate` |
| Upgrade Docker images| `docker compose pull && docker compose up -d`                        |

---

## 10. Capacity guardrails

Cloud VPS 10 (3 vCPU / 8 GB / 75 GB NVMe / 32 TB transfer) easily handles:

- **200 concurrent users** doing test/quiz traffic (~500–1 000 req/s)
- ~50 GB of static asset bandwidth/month (Cloudflare caches the rest)
- Postgres up to ~10 M rows comfortably

When you hit ~70 % sustained CPU or RAM (check `htop`), upgrade in-place to
Cloud VPS 20 from the Contabo control panel — same IP, ~5 min reboot.

---

## 11. Rollback

```bash
git log --oneline -10                 # find a known-good commit SHA
git checkout <sha>
docker compose --env-file .env.production build web
docker compose --env-file .env.production up -d
```

Schema rollback: restore the most recent good `pg_dump` (see §8).

---

That's it. Welcome to production. 🚀
