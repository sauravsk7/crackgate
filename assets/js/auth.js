/* CrackGate — shared layout & auth helpers
   Note: Replace GOOGLE_CLIENT_ID with your real OAuth client id from
   https://console.cloud.google.com (Authorized origin: https://crackgate.in)
*/
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

const CG = {
  // ---------- Safety helpers ----------
  /** HTML-escape any user-supplied string before injecting into innerHTML. */
  esc(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },
  /** Only allow same-origin relative paths starting with '/' for redirects. */
  safeNext(raw, fallback = '/pages/dashboard.html') {
    try {
      if (!raw) return fallback;
      const decoded = decodeURIComponent(raw);
      if (!/^\/[^/\\]/.test(decoded)) return fallback;
      if (decoded.toLowerCase().includes('javascript:')) return fallback;
      return decoded;
    } catch { return fallback; }
  },
  /** GDPR: erase every CrackGate key from local storage. */
  nukeLocalData() {
    ['cg_user','cg_users','cg_creds','cg_attempts','cg_activity','cg_consent']
      .forEach(k => localStorage.removeItem(k));
    sessionStorage.removeItem('cg_admin');
  },
  // ---------- Auth ----------
  getUser() {
    try { return JSON.parse(localStorage.getItem('cg_user') || 'null'); }
    catch { return null; }
  },
  setUser(u) { localStorage.setItem('cg_user', JSON.stringify(u)); },
  logout() { localStorage.removeItem('cg_user'); location.href = '/index.html'; },

  // Mock login (for local dev when no Google client id is configured)
  mockLogin(email = 'student@crackgate.in', name = 'GATE Aspirant') {
    const u = { name, email, picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e3a8a&color=fff`, plan: 'free', loggedAt: Date.now() };
    this.setUser(u);
    this.registerUser(u, { source: 'dev' });
    this.logActivity('login', { method: 'dev' });
    return this.getUser();
  },

  // ---------- User registry (signups) ----------
  getAllUsers() {
    try { return JSON.parse(localStorage.getItem('cg_users') || '[]'); }
    catch { return []; }
  },
  registerUser(profile, meta = {}) {
    const users = this.getAllUsers();
    const idx = users.findIndex(u => (u.email || '').toLowerCase() === (profile.email || '').toLowerCase());
    const now = Date.now();
    if (idx >= 0) {
      users[idx].lastLoginAt = now;
      users[idx].loginCount = (users[idx].loginCount || 1) + 1;
      // never downgrade a paid plan via login event
      if (!users[idx].plan || users[idx].plan === 'free') users[idx].plan = profile.plan || users[idx].plan || 'free';
    } else {
      users.push({
        id: 'u_' + now.toString(36) + Math.random().toString(36).slice(2,6),
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        targetYear: profile.targetYear || '',
        currentStatus: profile.currentStatus || '',
        source: meta.source || 'signup',
        plan: profile.plan || 'free',
        picture: profile.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'U')}&background=1e3a8a&color=fff`,
        signedUpAt: now,
        lastLoginAt: now,
        loginCount: 1
      });
    }
    localStorage.setItem('cg_users', JSON.stringify(users));
    // Optional: POST to a remote endpoint (Google Sheet / Formspree / serverless)
    // window.CG_REMOTE_HOOK && fetch(CG_REMOTE_HOOK, { method:'POST', body: JSON.stringify(users[users.length-1]) });
  },
  signup({ name, email, phone, targetYear, currentStatus, password }) {
    if (!name || !email) throw new Error('Name and email are required');
    const profile = { name, email, phone, targetYear, currentStatus, plan: 'free' };
    profile.picture = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1e3a8a&color=fff`;
    profile.loggedAt = Date.now();
    this.setUser(profile);
    this.registerUser(profile, { source: 'email' });
    // simple hash store (NOT for production — use a real backend with bcrypt)
    if (password) {
      const creds = JSON.parse(localStorage.getItem('cg_creds') || '{}');
      creds[email.toLowerCase()] = btoa(password);
      localStorage.setItem('cg_creds', JSON.stringify(creds));
    }
    this.logActivity('signup', { source: 'email' });
    return profile;
  },
  emailLogin(email, password) {
    const creds = JSON.parse(localStorage.getItem('cg_creds') || '{}');
    const stored = creds[(email || '').toLowerCase()];
    if (!stored) throw new Error('No account found for this email. Please sign up first.');
    if (stored !== btoa(password || '')) throw new Error('Incorrect password.');
    const u = this.getAllUsers().find(x => (x.email || '').toLowerCase() === email.toLowerCase());
    if (!u) throw new Error('User record missing.');
    u.loggedAt = Date.now();
    this.setUser(u);
    this.registerUser(u, { source: 'email-login' });
    this.logActivity('login', { method: 'email' });
    return u;
  },

  // ---------- Activity log ----------
  logActivity(type, data = {}) {
    const u = this.getUser();
    const log = JSON.parse(localStorage.getItem('cg_activity') || '[]');
    log.push({ ts: Date.now(), email: u?.email || 'anonymous', type, ...data });
    localStorage.setItem('cg_activity', JSON.stringify(log.slice(-2000))); // keep last 2k events
  },
  getActivity() {
    return JSON.parse(localStorage.getItem('cg_activity') || '[]');
  },

  // ---------- Admin ----------
  ADMIN_CODE: 'CRACKGATE-ADMIN-2026',  // change me in production
  isAdmin() { return sessionStorage.getItem('cg_admin') === '1'; },
  adminLogin(code) {
    if (code === this.ADMIN_CODE) { sessionStorage.setItem('cg_admin', '1'); return true; }
    return false;
  },
  adminLogout() { sessionStorage.removeItem('cg_admin'); },

  decodeJwt(token) {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(json);
  },

  initGoogle(buttonContainerId, onSuccess) {
    if (!window.google || GOOGLE_CLIENT_ID.startsWith('YOUR_')) {
      // Fallback dev button
      const el = document.getElementById(buttonContainerId);
      if (el) {
        el.innerHTML = `<button class="g-btn" onclick="CG.mockLogin();location.href='/pages/dashboard.html'">
          <img src="https://www.google.com/favicon.ico" alt=""/> Continue with Google (dev)</button>
          <p style="font-size:12px;color:#94a3b8;margin-top:14px">Configure GOOGLE_CLIENT_ID in assets/js/auth.js for real OAuth.</p>`;
      }
      return;
    }
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: (resp) => {
        const profile = CG.decodeJwt(resp.credential);
        const u = { name: profile.name, email: profile.email, picture: profile.picture, plan: CG.getUser()?.plan || 'free', loggedAt: Date.now() };
        CG.setUser(u);
        CG.registerUser(u, { source: 'google' });
        CG.logActivity('login', { method: 'google' });
        onSuccess ? onSuccess(u) : (location.href = '/pages/dashboard.html');
      }
    });
    google.accounts.id.renderButton(document.getElementById(buttonContainerId), { theme: 'outline', size: 'large', width: 320, text: 'continue_with' });
  },

  requireLogin(returnTo) {
    if (!this.getUser()) {
      const url = returnTo ? `?next=${encodeURIComponent(returnTo)}` : '';
      location.href = '/pages/login.html' + url;
      return false;
    }
    return true;
  },

  // ---------- Plan / Paywall ----------
  setPlan(plan) {
    const u = this.getUser() || this.mockLogin();
    u.plan = plan;
    this.setUser(u);
    // sync plan into registry
    const users = this.getAllUsers();
    const idx = users.findIndex(x => x.email === u.email);
    if (idx >= 0) { users[idx].plan = plan; users[idx].planUpdatedAt = Date.now(); localStorage.setItem('cg_users', JSON.stringify(users)); }
    this.logActivity('plan_change', { plan });
  },
  hasAccess(testTier) {
    const user = this.getUser();
    // tier: 'free' | 'subject' | 'premium'
    if (testTier === 'free') return true;
    if (!user) return false;
    if (user.plan === 'premium') return true;
    if (user.plan === 'subject' && testTier === 'subject') return true;
    return false;
  },

  // ---------- Attempts ----------
  saveAttempt(mockId, attempt) {
    const all = JSON.parse(localStorage.getItem('cg_attempts') || '{}');
    all[mockId] = attempt;
    localStorage.setItem('cg_attempts', JSON.stringify(all));
    this.logActivity('mock_submit', {
      mockId, mockTitle: attempt.mockTitle,
      scored: attempt.scored, totalMarks: attempt.totalMarks,
      correct: attempt.correct, wrong: attempt.wrong, skipped: attempt.skipped
    });
  },
  getAttempt(mockId) {
    const all = JSON.parse(localStorage.getItem('cg_attempts') || '{}');
    return all[mockId] || null;
  },
  allAttempts() {
    return JSON.parse(localStorage.getItem('cg_attempts') || '{}');
  },

  // ---------- Layout ----------
  renderNav(active = '') {
    const u = this.getUser();
    const adminLink = this.isAdmin() ? `<a href="/pages/admin.html" class="${active==='admin'?'active':''}" style="color:#b45309">⚙️ Admin</a>` : '';
    const planLabel = u ? (u.plan === 'premium' ? '⭐ Premium' : u.plan === 'subject' ? '🥈 Subject' : '🆓 Free') : '';
    const planClass = u ? (u.plan === 'free' ? 'free' : u.plan) : '';
    const right = u
      ? `<a href="/pages/dashboard.html" class="${active==='dashboard'?'active':''}">Dashboard</a>
         ${adminLink}
         <div class="user-chip" onclick="document.getElementById('userMenu').classList.toggle('show')">
           <img src="${u.picture}" alt="" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(u.name||'U')}&background=1e3a8a&color=fff'"/>
           <div class="user-chip-text">
             <b>${(u.name||'User').split(' ')[0]}</b>
             <span class="plan-badge ${planClass}">${planLabel}</span>
           </div>
           <span style="color:#94a3b8;font-size:12px">▾</span>
           <div class="user-menu" id="userMenu">
             <div class="user-menu-head">
               <img src="${u.picture}" alt=""/>
               <div>
                 <div style="font-weight:700">${u.name||''}</div>
                 <div style="font-size:12px;color:#64748b">${u.email||''}</div>
                 <span class="plan-badge ${planClass}" style="margin-top:6px;display:inline-block">${planLabel} Member</span>
               </div>
             </div>
             <a href="/pages/dashboard.html">📊 My Dashboard</a>
             <a href="/pages/test-series.html">📝 Test Series</a>
             <a href="/pages/pricing.html">${u.plan === 'premium' ? '💎 Manage Plan' : '⬆️ Upgrade Plan'}</a>
             <a href="/pages/privacy.html">🔒 Privacy</a>
             <hr/>
             <a href="#" onclick="if(confirm('Delete all your CrackGate data from this browser? This cannot be undone.')){CG.nukeLocalData();location.href='/';}return false">🗑️ Delete my data</a>
             <a href="#" onclick="CG.logout();return false">🚪 Logout</a>
           </div>
         </div>`
      : `<a href="/pages/login.html" class="btn btn-ghost">Login</a>
         <a href="/pages/signup.html" class="btn btn-primary">Sign Up Free</a>`;
    return `
    <a href="#main" class="skip-link">Skip to main content</a>
    <nav class="nav" aria-label="Primary">
      <div class="nav-inner">
        <a class="brand" href="/index.html">
          <span class="logo">CG</span> CrackGate<span style="color:var(--accent)">.in</span>
        </a>
        <button class="hamburger" onclick="document.getElementById('navLinks').classList.toggle('show')">☰</button>
        <div class="nav-links" id="navLinks">
          <a href="/index.html" class="${active==='home'?'active':''}">Home</a>
          <a href="/pages/test-series.html" class="${active==='tests'?'active':''}">Test Series</a>
          <a href="/pages/pyq.html" class="${active==='pyq'?'active':''}">PYQs</a>
          <a href="/pages/study-material.html" class="${active==='study'?'active':''}">Study Material</a>
          <a href="/pages/resources.html" class="${active==='resources'?'active':''}">Resources</a>
          <a href="/pages/toppers.html" class="${active==='toppers'?'active':''}">Toppers</a>
          <a href="/pages/pricing.html" class="${active==='pricing'?'active':''}">Pricing</a>
          ${right}
        </div>
      </div>
    </nav>`;
  },

  renderFooter() {
    return `
    <footer class="footer">
      <div class="footer-inner">
        <div>
          <div class="brand" style="color:#fff">
            <span class="logo">CG</span> CrackGate<span style="color:var(--accent)">.in</span>
          </div>
          <p style="font-size:14px;margin-top:14px;line-height:1.7">India's dedicated platform for GATE Mining Engineering (MN) aspirants — M.Tech admissions and PSU recruitment. Built by toppers, for toppers.</p>
        </div>
        <div>
          <h4>Product</h4>
          <a href="/pages/test-series.html">Mock Tests</a>
          <a href="/pages/pyq.html">PYQ (10 yrs)</a>
          <a href="/pages/study-material.html">Study Material</a>
          <a href="/pages/pricing.html">Pricing</a>
        </div>
        <div>
          <h4>Resources</h4>
          <a href="/pages/resources.html">Free Resources Hub</a>
          <a href="/pages/resources.html#pattern">Exam Pattern</a>
          <a href="/pages/resources.html#cutoffs">PSU Cut-offs</a>
          <a href="/pages/resources.html#calendar">GATE 2026 Calendar</a>
          <a href="/pages/toppers.html">Toppers' Corner</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="/pages/about.html">About Us</a>
          <a href="/pages/contact.html">Contact</a>
          <a href="/pages/faq.html">FAQ</a>
          <a href="/pages/privacy.html">Privacy Policy</a>
          <a href="/pages/terms.html">Terms of Service</a>
          <a href="/pages/refund.html">Refund Policy</a>
        </div>
      </div>
      <div class="footer-bottom">© ${new Date().getFullYear()} CrackGate.in — All rights reserved. GATE® is a registered trademark of IIT/IISc.</div>
    </footer>`;
  },

  mountLayout(active) {
    document.getElementById('nav-root')?.insertAdjacentHTML('afterbegin', this.renderNav(active));
    document.getElementById('footer-root')?.insertAdjacentHTML('afterbegin', this.renderFooter());
    // close user dropdown on outside click
    document.addEventListener('click', (e) => {
      const chip = e.target.closest('.user-chip');
      const menu = document.getElementById('userMenu');
      if (menu && !chip) menu.classList.remove('show');
    });
  }
};

window.CG = CG;
