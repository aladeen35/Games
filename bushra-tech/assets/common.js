/* أدوات مشتركة بين الصفحة العامة ولوحة المطوّر */
(function () {
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // يقبل روابط http(s) والمسارات النسبية وصور data:image فقط
  function safeUrl(u, allowData) {
    u = String(u || '').trim();
    if (!u) return '';
    if (/^https?:\/\//i.test(u)) return u;
    if (allowData && /^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,/i.test(u)) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u) || u.startsWith('//')) return '';
    return u;
  }

  const CATEGORIES = { apps: 'تطبيقات', games: 'ألعاب', kids: 'للأطفال', tools: 'أدوات' };

  const I = (d) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const ICONS = {
    open: I('<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5"/>'),
    download: I('<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>'),
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.6 2.3 13.4 12l-8.8 9.7A1.4 1.4 0 0 1 4 20.6V3.4c0-.4.2-.8.6-1.1Zm10 8.5 2.5-2.5L6.7 2.4Zm0 2.4-7.9 8.6 10.4-5.9Zm3.7-4.2-2.7 3 2.7 3 2.8-1.6a1.6 1.6 0 0 0 0-2.8Z"/></svg>',
    edit: I('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'),
    trash: I('<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/>'),
    up: I('<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>'),
    down: I('<path d="M12 5v14"/><path d="M5 12l7 7 7-7"/>'),
    plus: I('<path d="M12 5v14"/><path d="M5 12h14"/>'),
    eye: I('<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
    eyeOff: I('<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6 0 10 7 10 7a17 17 0 0 1-3.2 3.9M6.1 6.1C3.6 7.8 2 12 2 12s4 7 10 7c1.6 0 3-.4 4.3-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>'),
    lock: I('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>')
  };

  function logoHtml(app, cls) {
    const src = safeUrl(app.logo, true);
    if (src) return '<img class="' + (cls || 'logo') + '" src="' + esc(src) + '" alt="شعار ' + esc(app.name) + '" loading="lazy">';
    return '<div class="' + (cls || 'logo') + ' ph" aria-hidden="true">' + esc((app.name || '؟').trim().charAt(0)) + '</div>';
  }

  function fmtDate(iso) {
    if (!iso) return '';
    try { return new Date(iso).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { return iso.slice(0, 10); }
  }

  function showMsg(el, text, ok) {
    el.textContent = text;
    el.className = 'msg show ' + (ok ? 'ok' : 'err');
  }

  window.BT = { esc, safeUrl, CATEGORIES, ICONS, logoHtml, fmtDate, showMsg };
})();
