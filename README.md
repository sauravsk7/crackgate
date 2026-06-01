# CrackGate.in 🛠️⛏️

India's #1 dedicated GATE preparation platform for **Mining Engineering (MN)** aspirants targeting **M.Tech admissions and PSU jobs** (Coal India, NMDC, NTPC, ONGC, GAIL, HZL).

> Built as a static site — deployable to Netlify / Vercel / GitHub Pages / Cloudflare Pages in one click. No backend required.

## ✨ Features

- 🎯 **10 full-length Mock Tests** on the **GATE 2025 pattern** (20 questions × 60 min each, ~200 original questions).
- 📚 **10-year Previous Year Question bank** (2016–2025) with detailed step-by-step solutions.
- 📊 **SWOT Analytics** after every test — radar chart, subject-wise bar graph, personalized study plan.
- 🆓 **Free first Mock** — no signup required.
- 🔐 **Google Sign-In** for subsequent mocks & paid plans.
- 💳 **3-tier pricing**: Free / ₹499 Subject Mastery / ₹999 Premium All-Access.
- 📈 **Personal dashboard** — score trend, cumulative subject mastery, history.
- 📱 Mobile-responsive, accessible, fast.

## 📁 Structure

```
crackgate/
├── index.html                  # Landing page (MadeEasy-style)
├── pages/
│   ├── test-series.html        # List of 10 mocks
│   ├── mock.html               # Test-taking engine (timer + palette)
│   ├── result.html             # SWOT + Chart.js analytics + review
│   ├── pyq.html                # 10-year PYQ filter
│   ├── pricing.html            # Plans + payment stub
│   ├── study-material.html     # Subject-wise PDFs (paywalled)
│   ├── login.html              # Google Sign-In
│   └── dashboard.html          # User progress + history
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── auth.js             # Nav/Footer + Google auth + plan/paywall
│       ├── mocks-data.js       # 10 mock tests (200+ questions)
│       ├── pyq-data.js         # 10 years PYQ bank
│       ├── mock-engine.js      # Test-taking UI (timer, palette, save)
│       └── result.js           # SWOT logic + Chart.js radar/bar
├── netlify.toml
└── README.md
```

## 🚀 Local development

```bash
cd crackgate
python3 -m http.server 8080
# open http://localhost:8080
```

Any static file server works (`npx serve`, `live-server`, etc.).

## 🌐 Deploy to crackgate.in

### Option A — Netlify (recommended)
1. Push to a GitHub repo.
2. New site → "Import from Git" → select repo.
3. Settings → Domain → add `crackgate.in` + add A/CNAME records at your registrar.
4. HTTPS auto-provisioned via Let's Encrypt.

### Option B — Vercel
```bash
npx vercel
# follow prompts; add custom domain crackgate.in
```

### Option C — Cloudflare Pages
1. Pages → connect repo → root output `.`.
2. Custom domain → `crackgate.in`.

## 🔑 Configure Google Sign-In

1. Go to https://console.cloud.google.com → APIs & Services → Credentials.
2. Create **OAuth 2.0 Client ID** (type: Web).
3. Add authorized JavaScript origins: `https://crackgate.in` (and `http://localhost:8080` for dev).
4. Copy the Client ID into [`assets/js/auth.js`](assets/js/auth.js#L5):
   ```js
   const GOOGLE_CLIENT_ID = "1234567890-abcdef.apps.googleusercontent.com";
   ```
5. Until then a dev "Continue with Google" stub button lets you test the flow.

## 💳 Activate payments (Razorpay)

Replace the demo `buy()` in [`pages/pricing.html`](pages/pricing.html) with the Razorpay checkout snippet:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
function buy(plan, amount) {
  const opts = {
    key: "rzp_live_XXXX",                 // your key
    amount: amount * 100,                 // paise
    currency: "INR",
    name: "CrackGate.in",
    description: plan + " plan (1 year)",
    handler: (resp) => { CG.setPlan(plan); location.href = '/pages/dashboard.html'; },
    prefill: { email: CG.getUser()?.email }
  };
  new Razorpay(opts).open();
}
</script>
```

For server-side payment verification, add a small Cloud Function / Netlify Function that validates the Razorpay signature and writes the plan to a Firestore/Supabase DB.

## 📝 Adding more questions

- Mocks: edit [`assets/js/mocks-data.js`](assets/js/mocks-data.js).
- PYQs: edit [`assets/js/pyq-data.js`](assets/js/pyq-data.js).

Each question schema:
```js
{ subject: "Mine Ventilation", type: "MCQ" | "MSQ" | "NAT", marks: 1 | 2,
  stem: "Question text…",
  options: ["A","B","C","D"],          // MCQ/MSQ only
  answer: 2,                            // index for MCQ; array for MSQ; number for NAT
  tolerance: 0.01,                      // NAT only
  solution: "Step-by-step explanation." }
```

## 🛣️ Roadmap (post-launch)

- [ ] Server-side persistence (Firebase/Supabase) for attempt history across devices.
- [ ] All-India rank / percentile leaderboard.
- [ ] Video solutions (YouTube unlisted embeds).
- [ ] Email digest (weekly progress + SWOT).
- [ ] PWA install (offline practice).
- [ ] Hindi UI.

## ⚖️ Disclaimer

GATE® is a registered trademark of IIT/IISc. CrackGate.in is an independent prep platform and is not affiliated with IIT/IISc.
All practice questions are original and authored by the CrackGate team based on the latest GATE syllabus.

---

© CrackGate.in
