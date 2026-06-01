# CrackGate.in — Launch Checklist

Everything below is what **you** need to do before going live. The codebase is
production-ready as a static site; the items here are external dependencies
(domains, payment gateways, OAuth) and a few security upgrades that require a
backend.

---

## 1. Things only YOU can do (blockers for launch)

### 1.1 Domain & hosting
- [ ] Buy `crackgate.in` (or your final domain) from a registrar (GoDaddy/Namecheap/BigRock).
- [ ] Create a Netlify account → drag-drop this folder or connect the GitHub repo.
- [ ] Point the domain at Netlify (Netlify auto-provisions a free Let's Encrypt cert).
- [ ] In Netlify → **Site settings → Domain management**: add `crackgate.in` and `www.crackgate.in`, set HTTPS to "Force redirect".
- [ ] Verify the security headers are live: open https://securityheaders.com and test your URL. Target = A or A+.

### 1.2 Google OAuth (Sign-in with Google)
The login/signup buttons reference `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` — Google sign-in will NOT work until you replace this.
- [ ] Go to https://console.cloud.google.com → Create project → APIs & Services → **OAuth consent screen** (external, brand name "CrackGate").
- [ ] Credentials → Create OAuth Client ID → Web application.
- [ ] Authorised JavaScript origins: `https://crackgate.in`, `https://www.crackgate.in`, `http://localhost:8080` (dev).
- [ ] Authorised redirect URIs: same as above.
- [ ] Copy the client ID into `assets/js/auth.js` → constant `GOOGLE_CLIENT_ID` (top of file).

### 1.3 Razorpay (paid plans)
Pricing page links to `pages/pricing.html`. Payment is currently a stub.
- [ ] Sign up at https://razorpay.com → KYC → activate live mode.
- [ ] Create plans (Pro Monthly ₹299, Premium Quarterly ₹999, etc.) in dashboard.
- [ ] In pricing flow, replace the stub "buy" button with Razorpay Checkout snippet:
      `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>`
      then `new Razorpay({key: 'rzp_live_xxx', amount: 29900, ...}).open()`.
- [ ] **Critical:** server-side webhook is required so a paid user's `plan` is upgraded reliably.
      Without a backend, a user can edit localStorage and self-upgrade. See section 3.

### 1.4 Contact & legal
- [ ] Buy a real support inbox (Google Workspace, Zoho Mail): `support@crackgate.in`, `hello@crackgate.in`, `grievance@crackgate.in`, `legal@crackgate.in`, `billing@crackgate.in` — referenced across pages.
- [ ] Update `pages/contact.html` and `pages/privacy.html`, `pages/terms.html`, `pages/refund.html` with your **real** company name, registered address (currently "Bengaluru, Karnataka"), and CIN/GST number if registered.
- [ ] Have a lawyer review the legal pages before going live (templates are reasonable but generic).

### 1.5 Replace placeholder content
- [ ] `pages/toppers.html` — testimonials are illustrative. Either remove or replace with real students (with written consent).
- [ ] `pages/about.html` — team cards are placeholders.
- [ ] `assets/js/mocks-data.js` & `assets/js/pyq-data.js` — questions are GATE-pattern but original.
      Have a subject-matter expert (mining faculty) review for technical accuracy.

---

## 2. Things you should do soon (recommended, not blockers)

### 2.1 Analytics & monitoring
- [ ] Google Analytics 4 — add `<script>` snippet to all pages (or just `index.html` head and remove `'unsafe-inline'` later).
- [ ] Google Search Console — verify ownership, submit `sitemap.xml`.
- [ ] Sentry.io (free tier) — add for JS error tracking.
- [ ] Uptime monitoring — UptimeRobot free tier pings every 5 min.

### 2.2 Transactional email
When you add a backend, wire up:
- [ ] Welcome email on signup
- [ ] Receipt on payment
- [ ] Result email after each mock (PDF report)
Use Resend, Postmark, or AWS SES (~₹0.10 / email).

### 2.3 Social proof & marketing
- [ ] Create Instagram / YouTube / Telegram for daily MCQs.
- [ ] Update social URLs in `assets/js/auth.js` → footer section (currently `#`).
- [ ] Add an Open Graph **image** (1200×630 PNG). Right now `og:image` is the SVG favicon — replace with a real banner.

---

## 3. Critical security limitations (FIX BEFORE REAL PAYMENTS)

The current site is a **static prototype**. All user data lives in the
browser's localStorage. This is fine for a demo or beta launch, but for real
paid customers you MUST move to a backend.

### 3.1 Known issues to address
| Issue | Severity | Recommended fix |
|-------|----------|-----------------|
| Passwords stored with `btoa()` (base64, NOT encrypted) in localStorage | 🔴 Critical | Move auth to Supabase / Firebase / Auth0 (free tiers exist). OR remove password auth entirely and force Google-only sign-in. |
| `ADMIN_CODE` is hardcoded in `auth.js` (visible to anyone who reads JS) | 🔴 Critical | Move admin panel behind a real backend with proper RBAC. |
| Plan upgrades can be tampered with via DevTools (`localStorage.cg_user`) | 🔴 Critical | Validate plan server-side via Razorpay webhook. |
| User data lost when browser cache is cleared | 🟡 High | Move `cg_users`, `cg_attempts`, `cg_activity` to a database. |
| No rate-limiting on signup | 🟡 Medium | Add hCaptcha or Cloudflare Turnstile (free). |
| No email verification on signup | 🟡 Medium | Supabase / Firebase Auth handles this out-of-the-box. |

### 3.2 Recommended backend stack (cheapest path)
- **Supabase** (free tier: 50 K monthly active users, 500 MB DB) — handles auth, DB, storage, edge functions. Drop-in JS SDK.
- **Cloudflare Workers** for Razorpay webhook (free 100K req/day).
- **Netlify Functions** if you prefer staying on one platform.

Migration is ~1-2 weeks of work. Until then, communicate clearly on
`pages/privacy.html` that data is local to the device (already noted).

---

## 4. Pre-launch QA checklist

Test on at least Chrome (desktop + mobile), Firefox, Safari.

### Functionality
- [ ] Sign up with email → land on dashboard
- [ ] Logout → log back in → dashboard remembers attempts
- [ ] Take Mock 01 (free) → submit → see report with charts
- [ ] Open a PYQ year → run timer → submit → see solution
- [ ] Admin panel (`/pages/admin.html`, code `CRACKGATE-ADMIN-2026`) → export Excel
- [ ] Cookie banner appears on first visit, disappears after "Accept"
- [ ] User menu → "Delete my data" wipes everything
- [ ] 404: visit `/garbage-url` → see branded 404 page
- [ ] Resize browser to 360px wide — no horizontal scroll on any page
- [ ] Keyboard tab through homepage — focus ring visible on every link/button
- [ ] Skip-link works (Tab once on any page → "Skip to main content")

### Performance
- [ ] Lighthouse score ≥ 90 on Performance, Accessibility, Best Practices, SEO.
      Run from Chrome DevTools → Lighthouse → Mobile.
- [ ] securityheaders.com grade ≥ A.
- [ ] ssllabs.com grade ≥ A.

### Content
- [ ] Spell-check every page (use Grammarly browser extension).
- [ ] Verify ALL links in nav + footer go somewhere real (no `#`).
- [ ] All emails on contact page are deliverable.
- [ ] Pricing matches your actual Razorpay plans.

---

## 5. What's already done (no action needed)

✅ 19 HTML pages, fully responsive
✅ NTA-style live exam portal for PYQ (10 years, 2016–2025)
✅ 10 full-length mocks + SWOT analytics + Chart.js dashboard
✅ Excel export of attempts (xlsx)
✅ Tight CSP, HSTS, X-Frame-Options, Permissions-Policy via `netlify.toml`
✅ Long-cache headers for `/assets/*`, must-revalidate for HTML
✅ Open redirect protection (`CG.safeNext()`)
✅ XSS-safe rendering helper (`CG.esc()`)
✅ GDPR "delete my data" in user menu
✅ Cookie consent banner (`assets/js/cookies.js`)
✅ Legal: Privacy, Terms, Refund, FAQ, Contact, About pages
✅ Skip-to-content link + `:focus-visible` rings (WCAG 2.1 AA)
✅ `robots.txt`, `sitemap.xml`, `favicon.svg`, branded `404.html`
✅ Open Graph + Twitter Card + JSON-LD on homepage
✅ Mock 01 Q5 answer bug fixed (eigenvalue MCQ)
✅ Login/signup buttons disable + show loading state on submit

---

## 6. Quick deploy

```bash
# install netlify CLI once
npm i -g netlify-cli

# from repo root
netlify login
netlify init       # connect to your site
netlify deploy --prod
```

That's it. Email me anything that breaks.

— Generated by GitHub Copilot · 2026
