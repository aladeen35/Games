/* الصفحة العامة: عرض المنتجات، التصفية، الاقتراحات وردود المطوّر */
(function () {
  const { esc, safeUrl, CATEGORIES, ICONS, logoHtml, fmtDate, showMsg } = window.BT;
  const S = window.BushraStore;
  const $ = (id) => document.getElementById(id);
  let apps = [];
  let cat = 'all';

  function applySettings(s) {
    document.querySelectorAll('[data-set]').forEach((el) => {
      const v = s[el.dataset.set];
      if (v) el.textContent = v;
    });
    if (s.siteName) document.title = s.siteName + (s.siteNameEn ? ' — ' + s.siteNameEn : '');
    const c = $('contactLine');
    if (s.contactEmail) {
      c.hidden = false;
      c.innerHTML = 'للتواصل: <a href="mailto:' + esc(s.contactEmail) + '">' + esc(s.contactEmail) + '</a>';
    }
  }

  function buttons(a) {
    const url = safeUrl(a.url), apk = safeUrl(a.apkUrl), play = safeUrl(a.playUrl);
    const btns = [];
    if (play) btns.push('<a class="btn btn-play" href="' + esc(play) + '" target="_blank" rel="noopener">' + ICONS.play + 'Google Play</a>');
    if (url) btns.push('<a class="btn btn-primary" href="' + esc(url) + '" target="_blank" rel="noopener">' + ICONS.open + 'افتح</a>');
    if (apk) btns.push('<a class="btn btn-gold" href="' + esc(apk) + '" rel="noopener">' + ICONS.download + 'تحميل APK</a>');
    if (!btns.length) btns.push('<span class="btn btn-ghost" aria-disabled="true">قريبًا</span>');
    return btns.join('');
  }

  function card(a) {
    const tags = ['<span class="tag">' + esc(CATEGORIES[a.category] || 'أخرى') + '</span>'];
    if (a.badge) tags.push('<span class="tag gold">' + esc(a.badge) + '</span>');
    return '<article class="card' + (a.featured ? ' featured' : '') + (a.isNew ? ' is-new' : '') + '">' +
      (a.isNew ? '<span class="ribbon">جديد</span>' : '') +
      '<div class="head">' + logoHtml(a) + '<div><h3>' + esc(a.name) + '</h3><div class="tags">' + tags.join('') + '</div></div></div>' +
      '<p class="desc">' + esc(a.description) + '</p>' +
      '<button type="button" class="more" hidden>المزيد</button>' +
      '<div class="actions">' + buttons(a) + '</div></article>';
  }

  // «المزيد» يظهر فقط للوصف الذي قُصّ فعلًا
  function markLong(root) {
    root.querySelectorAll('.card').forEach((c) => {
      const d = c.querySelector('.desc');
      c.querySelector('.more').hidden = d.scrollHeight <= d.clientHeight + 2;
    });
  }

  function renderNew() {
    const list = apps.filter((a) => a.isNew);
    $('new').hidden = !list.length;
    $('newNav').hidden = !list.length;
    $('newCount').textContent = list.length ? list.length + ' ' + (list.length > 10 ? 'منتجًا' : 'منتجات') + ' جديدة' : '';
    $('newRail').innerHTML = list.map((a) =>
      '<article class="new-card">' + logoHtml(a, 'logo big') +
      '<div class="nc-body"><h3>' + esc(a.name) + '</h3>' +
      (a.badge ? '<span class="tag gold">' + esc(a.badge) + '</span>' : '') +
      '<p>' + esc(a.description) + '</p>' +
      '<div class="actions">' + buttons(a) + '</div></div></article>').join('');
  }

  function render() {
    const q = $('q').value.trim().toLowerCase();
    const list = apps.filter((a) => (cat === 'all' || a.category === cat) &&
      (!q || (a.name + ' ' + a.description).toLowerCase().includes(q)));
    $('grid').innerHTML = list.map(card).join('');
    $('empty').hidden = list.length > 0;
    $('prodCount').textContent = list.length + ' من ' + apps.length;
    markLong($('grid'));
  }

  function renderChips() {
    const used = Object.keys(CATEGORIES).filter((k) => apps.some((a) => a.category === k));
    const all = [['all', 'الكل']].concat(used.map((k) => [k, CATEGORIES[k]]));
    const n = (k) => (k === 'all' ? apps.length : apps.filter((a) => a.category === k).length);
    $('chips').innerHTML = all.map(([k, t]) => '<button type="button" class="chip" data-cat="' + k + '" aria-pressed="' + (k === cat) + '">' + t + ' <span class="n">' + n(k) + '</span></button>').join('');
  }

  function renderStats() {
    const games = apps.filter((a) => a.category === 'games' || a.category === 'kids').length;
    const apks = apps.filter((a) => a.apkUrl || a.playUrl).length;
    $('stats').innerHTML = [
      [apps.length, 'منتج'], [games, 'لعبة'], [apks, 'للتنزيل']
    ].map(([n, t]) => '<div class="stat"><b>' + n + '</b><span>' + t + '</span></div>').join('');
  }

  function renderReplies(list) {
    if (!list.length) return;
    const names = Object.fromEntries(apps.map((a) => [a.id, a.name]));
    $('replies').innerHTML = list.map((s) =>
      '<div class="sugg"><div class="who">' + esc(s.name || 'زائر') +
      ' <span>· ' + esc(fmtDate(s.date)) + (s.appId && names[s.appId] ? ' · ' + esc(names[s.appId]) : '') + '</span></div>' +
      '<p class="q">' + esc(s.message) + '</p>' +
      '<div class="a"><b>ردّ المطوّر</b>' + esc(s.reply) + '</div></div>').join('');
  }

  $('chips').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    cat = b.dataset.cat;
    renderChips();
    render();
  });
  $('q').addEventListener('input', render);
  $('grid').addEventListener('click', (e) => {
    const b = e.target.closest('.more');
    if (!b) return;
    const open = b.closest('.card').classList.toggle('open');
    b.textContent = open ? 'أقل' : 'المزيد';
  });
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => markLong($('grid')), 150); });

  const toTop = $('toTop');
  addEventListener('scroll', () => { toTop.classList.toggle('show', scrollY > 900); }, { passive: true });
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  $('suggForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const box = $('sMsgBox');
    const btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true;
    try {
      await S.addSuggestion({ name: $('sName').value, contact: $('sContact').value, appId: $('sApp').value, message: $('sMsg').value });
      e.target.reset();
      showMsg(box, 'شكرًا لك! وصل اقتراحك وسنردّ عليه قريبًا بإذن الله.', true);
    } catch (err) {
      showMsg(box, err.message, false);
    } finally {
      btn.disabled = false;
    }
  });

  $('yr').textContent = new Date().getFullYear();

  S.getPublic().then((d) => {
    apps = d.apps.slice().sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    applySettings(d.settings);
    renderNew();
    renderChips();
    renderStats();
    render();
    $('sApp').insertAdjacentHTML('beforeend', apps.map((a) => '<option value="' + esc(a.id) + '">' + esc(a.name) + '</option>').join(''));
    renderReplies(d.suggestions);
  }).catch((err) => {
    $('grid').innerHTML = '<div class="empty">تعذّر تحميل المنتجات: ' + esc(err.message) + '</div>';
  });
})();
