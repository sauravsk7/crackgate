/* CrackGate — lightweight cookie/storage-consent banner.
   Renders only if cg_consent is not yet recorded. */
(function () {
  if (localStorage.getItem('cg_consent')) return;
  const el = document.createElement('div');
  el.className = 'cookie-banner';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Cookie consent');
  el.innerHTML = `
    <div class="cookie-text">
      We use cookies &amp; local storage to keep you signed in, save your test
      progress and improve the platform. See our
      <a href="/pages/privacy.html">Privacy Policy</a>.
    </div>
    <div class="cookie-actions">
      <button class="btn btn-ghost" id="cookieReject">Essential only</button>
      <button class="btn btn-primary" id="cookieAccept">Accept all</button>
    </div>`;
  document.body.appendChild(el);
  const close = (choice) => {
    localStorage.setItem('cg_consent', JSON.stringify({ choice, ts: Date.now() }));
    el.remove();
  };
  document.getElementById('cookieAccept').onclick = () => close('all');
  document.getElementById('cookieReject').onclick = () => close('essential');
})();
