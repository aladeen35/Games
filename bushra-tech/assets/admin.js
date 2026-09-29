/* لوحة المطوّر: كلمة المرور، إدارة التطبيقات، الردّ على الاقتراحات، الإعدادات */
(function () {
  const { esc, safeUrl, CATEGORIES, ICONS, logoHtml, fmtDate, showMsg } = window.BT;
  const S = window.BushraStore;
  const $ = (id) => document.getElementById(id);
  let state = null;
  let editing = null; // id التطبيق قيد التعديل أو null للإضافة

  /* ---------- الدخول ---------- */
  async function initAuth() {
    if (S.isLoggedIn()) {
      try { return await openDash(); } catch (e) { S.logout(); }
    }
    let status;
    try { status = await S.authStatus(); } catch (e) {
      $('auth').hidden = false;
      showMsg($('authMsg'), 'تعذّر الاتصال بالخادم: ' + e.message, false);
      return;
    }
    const first = !status.hasPassword;
    $('auth').hidden = false;
    $('authTitle').textContent = first ? 'مرحبًا! أنشئ كلمة مرور المطوّر' : 'دخول المطوّر';
    $('authHint').textContent = first
      ? 'هذه أول جلسة — اختر كلمة مرور (6 أحرف على الأقل). ستُطلب منك في كل دخول لاحق. احفظها جيدًا.'
      : '';
    $('pw2Wrap').hidden = !first;
    $('pw').autocomplete = first ? 'new-password' : 'current-password';
    $('authBtn').textContent = first ? 'إنشاء كلمة المرور والدخول' : 'دخول';
    $('pw').focus();

    $('authForm').onsubmit = async (e) => {
      e.preventDefault();
      const pw = $('pw').value;
      $('authBtn').disabled = true;
      try {
        if (first) {
          if (pw !== $('pw2').value) throw new Error('كلمتا المرور غير متطابقتين');
          await S.setupPassword(pw);
        } else {
          await S.login(pw);
        }
        $('auth').hidden = true;
        await openDash();
      } catch (err) {
        showMsg($('authMsg'), err.message, false);
      } finally {
        $('authBtn').disabled = false;
      }
    };
  }

  async function openDash() {
    state = await S.getAdmin();
    state.apps = state.apps || [];
    state.suggestions = state.suggestions || [];
    state.settings = state.settings || {};
    $('dash').hidden = false;
    $('logout').hidden = false;
    $('modeBanner').innerHTML = S.mode === 'cloud'
      ? '<div class="banner">متصل بالخادم — كل تعديل يظهر فورًا لجميع الزوّار.</div>'
      : '<div class="banner warn"><b>الوضع المحلي:</b> لم يُربط الموقع بخادم بعد، لذا تُحفظ تعديلاتك والاقتراحات في هذا المتصفح فقط. لنشرها للجميع: اربط خادم Cloudflare (انظر README)، أو صدّر JSON من «الإعدادات» وارفعه مكان <code>data/catalog.json</code>.</div>';
    renderApps();
    renderSugg();
    fillSettings();
  }

  $('logout').addEventListener('click', (e) => { e.preventDefault(); S.logout(); location.reload(); });

  /* ---------- التبويبات ---------- */
  document.querySelector('.tabs').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-tab]');
    if (!b) return;
    document.querySelectorAll('.tabs button').forEach((x) => x.setAttribute('aria-selected', x === b));
    document.querySelectorAll('[data-pane]').forEach((p) => { p.hidden = p.dataset.pane !== b.dataset.tab; });
  });

  /* ---------- التطبيقات ---------- */
  async function saveApps() {
    try { await S.saveApps(state.apps); }
    catch (e) { alert('لم يُحفظ التغيير: ' + e.message); }
  }

  function renderApps() {
    const vis = state.apps.filter((a) => a.visible !== false).length;
    $('appsCount').textContent = '(' + vis + ' ظاهر من ' + state.apps.length + ')';
    $('appList').innerHTML = state.apps.map((a, i) => {
      const links = [a.url && 'رابط', a.playUrl && 'Google Play', a.apkUrl && 'APK'].filter(Boolean).join(' · ') || 'بلا روابط';
      return '<div class="admin-app' + (a.visible === false ? ' off' : '') + '" data-id="' + esc(a.id) + '">' +
        logoHtml(a) +
        '<div><div class="t">' + esc(a.name) + (a.featured ? ' ⭐' : '') + '</div><div class="s">' + esc(CATEGORIES[a.category] || '') + ' · ' + esc(links) + '</div></div>' +
        '<div class="ops">' +
          '<label class="switch" title="إظهار/إخفاء"><input type="checkbox" data-op="toggle"' + (a.visible !== false ? ' checked' : '') + ' aria-label="إظهار ' + esc(a.name) + '"><span></span></label>' +
          '<button class="icon-btn" data-op="up" title="لأعلى"' + (i === 0 ? ' disabled' : '') + '>' + ICONS.up + '</button>' +
          '<button class="icon-btn" data-op="down" title="لأسفل"' + (i === state.apps.length - 1 ? ' disabled' : '') + '>' + ICONS.down + '</button>' +
          '<button class="icon-btn" data-op="edit" title="تعديل">' + ICONS.edit + '</button>' +
          '<button class="icon-btn" data-op="del" title="حذف" style="color:var(--no)">' + ICONS.trash + '</button>' +
        '</div></div>';
    }).join('') || '<p class="hint">لا توجد تطبيقات بعد.</p>';
  }

  $('appList').addEventListener('click', async (e) => {
    const el = e.target.closest('[data-op]');
    if (!el || el.dataset.op === 'toggle') return;
    const id = el.closest('.admin-app').dataset.id;
    const i = state.apps.findIndex((a) => a.id === id);
    const op = el.dataset.op;
    if (op === 'edit') return openDlg(state.apps[i]);
    if (op === 'del') {
      if (!confirm('حذف «' + state.apps[i].name + '» نهائيًا؟ (يمكنك إخفاؤه بدل الحذف)')) return;
      state.apps.splice(i, 1);
    }
    if (op === 'up' && i > 0) [state.apps[i - 1], state.apps[i]] = [state.apps[i], state.apps[i - 1]];
    if (op === 'down' && i < state.apps.length - 1) [state.apps[i + 1], state.apps[i]] = [state.apps[i], state.apps[i + 1]];
    renderApps();
    await saveApps();
  });
  $('appList').addEventListener('change', async (e) => {
    if (e.target.dataset.op !== 'toggle') return;
    const id = e.target.closest('.admin-app').dataset.id;
    const a = state.apps.find((x) => x.id === id);
    a.visible = e.target.checked;
    renderApps();
    await saveApps();
  });

  /* نافذة الإضافة والتعديل */
  const F = { name: 'fName', category: 'fCat', badge: 'fBadge', description: 'fDesc', logo: 'fLogo', url: 'fUrl', playUrl: 'fPlay', apkUrl: 'fApk' };
  function previewLogo() { $('fLogoPrev').innerHTML = logoHtml({ name: $('fName').value, logo: $('fLogo').value }); }
  function openDlg(app) {
    editing = app ? app.id : null;
    $('dlgTitle').textContent = app ? 'تعديل: ' + app.name : 'إضافة تطبيق';
    for (const k in F) $(F[k]).value = (app && app[k]) || (k === 'category' ? 'apps' : '');
    $('fVisible').checked = app ? app.visible !== false : true;
    $('fFeatured').checked = !!(app && app.featured);
    $('dlgMsg').className = 'msg';
    previewLogo();
    $('appDlg').showModal();
  }
  $('addApp').addEventListener('click', () => openDlg(null));
  $('fLogo').addEventListener('input', previewLogo);
  $('fName').addEventListener('input', previewLogo);
  $('fLogoFile').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try { $('fLogo').value = await resizeImage(f, 256); previewLogo(); }
    catch (err) { showMsg($('dlgMsg'), 'تعذّرت قراءة الصورة', false); }
    e.target.value = '';
  });

  $('appForm').addEventListener('submit', async (e) => {
    if (!e.submitter || e.submitter.value !== 'save') return; // الإلغاء يغلق النافذة
    e.preventDefault();
    const d = {};
    for (const k in F) d[k] = $(F[k]).value.trim();
    if (!d.name) return showMsg($('dlgMsg'), 'الاسم مطلوب', false);
    for (const k of ['url', 'playUrl', 'apkUrl']) {
      if (d[k] && !/^https?:\/\//i.test(d[k]) && !safeUrl(d[k])) return showMsg($('dlgMsg'), 'رابط غير صالح: ' + d[k], false);
    }
    if (d.logo && !safeUrl(d.logo, true)) return showMsg($('dlgMsg'), 'رابط الشعار غير صالح', false);
    d.visible = $('fVisible').checked;
    d.featured = $('fFeatured').checked;
    if (editing) Object.assign(state.apps.find((a) => a.id === editing), d);
    else state.apps.unshift(Object.assign({ id: S.uid() }, d));
    $('dlgSave').disabled = true;
    try {
      await S.saveApps(state.apps);
      $('appDlg').close();
      renderApps();
    } catch (err) {
      showMsg($('dlgMsg'), 'لم يُحفظ: ' + err.message, false);
    } finally {
      $('dlgSave').disabled = false;
    }
  });

  function resizeImage(file, max) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        const r = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * r); c.height = Math.round(img.height * r);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        let out = c.toDataURL('image/webp', 0.85);
        if (!out.startsWith('data:image/webp')) out = c.toDataURL('image/png');
        resolve(out);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('bad image')); };
      img.src = url;
    });
  }

  /* ---------- الاقتراحات ---------- */
  function renderSugg() {
    const unread = state.suggestions.filter((s) => !s.read).length;
    $('unread').hidden = !unread;
    $('unread').textContent = unread;
    const f = $('suggFilter').value;
    const names = Object.fromEntries(state.apps.map((a) => [a.id, a.name]));
    const list = state.suggestions
      .filter((s) => f === 'all' || (f === 'unread' && !s.read) || (f === 'noreply' && !s.reply) || (f === 'replied' && s.reply) || (f === 'hidden' && s.hidden))
      .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    $('suggList').innerHTML = list.map((s) =>
      '<div class="adm-sugg' + (s.read ? '' : ' unread') + '" data-id="' + esc(s.id) + '">' +
        '<div class="meta"><b style="color:var(--navy-700)">' + esc(s.name || 'زائر') + '</b>' +
          (s.contact ? '<span dir="ltr">' + esc(s.contact) + '</span>' : '') +
          '<span>' + esc(fmtDate(s.date)) + '</span>' +
          '<span>' + esc(s.appId ? (names[s.appId] || s.appId) : 'اقتراح عام') + '</span>' +
          (s.hidden ? '<span style="color:var(--no)">مخفي</span>' : '') +
          (s.reply ? '<span style="color:var(--ok)">تمّ الردّ ' + esc(fmtDate(s.replyDate)) + '</span>' : '') +
        '</div>' +
        '<div class="body">' + esc(s.message) + '</div>' +
        '<textarea class="input" data-reply placeholder="اكتب ردّك…" style="min-height:70px">' + esc(s.reply || '') + '</textarea>' +
        '<div class="actions" style="margin-top:8px">' +
          '<button class="btn btn-primary" data-op="reply">' + (s.reply ? 'تحديث الردّ' : 'نشر الردّ') + '</button>' +
          (s.read ? '' : '<button class="btn btn-ghost" data-op="read">تمييز كمقروء</button>') +
          '<button class="btn btn-ghost" data-op="hide">' + (s.hidden ? 'إظهار في الموقع' : 'إخفاء من الموقع') + '</button>' +
          '<button class="btn btn-danger" data-op="del">حذف</button>' +
        '</div></div>').join('') || '<p class="hint">لا توجد اقتراحات هنا.</p>';
  }
  $('suggFilter').addEventListener('change', renderSugg);
  $('suggList').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-op]');
    if (!b) return;
    const box = b.closest('.adm-sugg');
    const s = state.suggestions.find((x) => x.id === box.dataset.id);
    const op = b.dataset.op;
    let patch = null;
    if (op === 'reply') {
      const reply = box.querySelector('[data-reply]').value.trim().slice(0, 1500);
      patch = { reply, replyDate: reply ? new Date().toISOString() : '', read: true };
    }
    if (op === 'read') patch = { read: true };
    if (op === 'hide') patch = { hidden: !s.hidden };
    b.disabled = true;
    try {
      if (op === 'del') {
        if (!confirm('حذف هذا الاقتراح نهائيًا؟')) { b.disabled = false; return; }
        await S.deleteSuggestion(s.id);
        state.suggestions = state.suggestions.filter((x) => x.id !== s.id);
      } else {
        await S.updateSuggestion(s.id, patch);
        Object.assign(s, patch);
      }
      renderSugg();
    } catch (err) {
      alert('تعذّر الحفظ: ' + err.message);
      b.disabled = false;
    }
  });

  /* ---------- الإعدادات ---------- */
  function fillSettings() {
    document.querySelectorAll('#setForm [data-k]').forEach((el) => { el.value = state.settings[el.dataset.k] || ''; });
  }
  $('setForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const s = Object.assign({}, state.settings);
    document.querySelectorAll('#setForm [data-k]').forEach((el) => { s[el.dataset.k] = el.value.trim(); });
    try { await S.saveSettings(s); state.settings = s; showMsg($('setMsg'), 'تمّ الحفظ', true); }
    catch (err) { showMsg($('setMsg'), err.message, false); }
  });
  $('pwForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      if ($('newPw').value !== $('newPw2').value) throw new Error('كلمتا المرور الجديدتان غير متطابقتين');
      await S.changePassword($('oldPw').value, $('newPw').value);
      e.target.reset();
      showMsg($('pwMsg'), 'تمّ تغيير كلمة المرور', true);
    } catch (err) { showMsg($('pwMsg'), err.message, false); }
  });

  $('exportBtn').addEventListener('click', () => {
    const data = { settings: state.settings, apps: state.apps, suggestions: state.suggestions };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'catalog.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  $('importFile').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
      const d = JSON.parse(await f.text());
      if (!Array.isArray(d.apps)) throw new Error('الملف لا يحتوي على قائمة تطبيقات');
      if (!confirm('سيُستبدل كتالوج التطبيقات والنصوص الحالية بمحتوى الملف. متابعة؟')) return;
      await S.saveApps(d.apps);
      if (d.settings) await S.saveSettings(d.settings);
      await openDash();
      showMsg($('bkMsg'), 'تمّ الاستيراد', true);
    } catch (err) { showMsg($('bkMsg'), 'فشل الاستيراد: ' + err.message, false); }
  });
  $('resetBtn').addEventListener('click', async () => {
    if (!confirm('استعادة التطبيقات والنصوص من ملف data/catalog.json؟ ستضيع تعديلاتك الحالية على التطبيقات.')) return;
    try {
      await S.resetToFile(); // الاقتراحات تبقى كما هي
      await openDash();
      showMsg($('bkMsg'), 'تمّت الاستعادة من الملف', true);
    } catch (err) { showMsg($('bkMsg'), err.message, false); }
  });

  initAuth();
})();
