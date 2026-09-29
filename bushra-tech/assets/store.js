/* طبقة البيانات — تعمل بوضعين:
   - cloud: عبر Cloudflare Worker (config.js → apiBase) فتظهر التعديلات والاقتراحات لكل الزوّار.
   - local: بلا خادم؛ الكتالوج من data/catalog.json وتعديلات المطوّر والاقتراحات تُحفظ في هذا المتصفح. */
(function () {
  const API = ((window.BUSHRA_CONFIG || {}).apiBase || '').replace(/\/+$/, '');
  const MODE = API ? 'cloud' : 'local';
  const K = { state: 'bt.state.v1', auth: 'bt.auth.v1', session: 'bt.session.v1', token: 'bt.token.v1' };

  const ls = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  const ss = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { sessionStorage.removeItem(k); } catch (e) {} }
  };

  let fileCache = null;
  async function loadFile() {
    if (fileCache) return clone(fileCache);
    const r = await fetch('data/catalog.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error('تعذّر تحميل ملف الكتالوج');
    fileCache = await r.json();
    return clone(fileCache);
  }
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  function publicView(state) {
    return {
      settings: state.settings || {},
      apps: (state.apps || []).filter((a) => a.visible !== false),
      suggestions: (state.suggestions || [])
        .filter((s) => s.reply && !s.hidden)
        .map(({ contact, ...rest }) => rest)
        .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    };
  }

  /* ---------- كلمة المرور (PBKDF2) ---------- */
  const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  async function pbkdf2(password, saltBytes, iter) {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations: iter }, key, 256);
    return b64(bits);
  }
  async function makeHash(password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iter = 100000;
    return { salt: b64(salt), iter, hash: await pbkdf2(password, salt, iter) };
  }
  async function checkHash(password, rec) {
    return rec && (await pbkdf2(password, unb64(rec.salt), rec.iter)) === rec.hash;
  }
  function validatePassword(pw) {
    if (typeof pw !== 'string' || pw.length < 6) throw new Error('كلمة المرور يجب ألا تقل عن 6 أحرف');
  }

  /* ---------- الوضع المحلي ---------- */
  async function localState() {
    let st = ls.get(K.state);
    if (!st) {
      st = await loadFile();
      st.suggestions = st.suggestions || [];
    }
    return st;
  }
  function saveLocal(st) {
    if (!ls.set(K.state, st)) throw new Error('تعذّر الحفظ في المتصفح — قد تكون المساحة ممتلئة (صور كبيرة؟)');
  }
  const localApi = {
    async getPublic() { return publicView(await localState()); },
    async addSuggestion(s) {
      const st = await localState();
      st.suggestions.push(normalizeSuggestion(s));
      saveLocal(st);
    },
    async authStatus() { return { hasPassword: !!ls.get(K.auth) }; },
    async setupPassword(pw) {
      validatePassword(pw);
      if (ls.get(K.auth)) throw new Error('كلمة المرور معيّنة مسبقًا');
      ls.set(K.auth, await makeHash(pw));
      ss.set(K.session, '1');
    },
    async login(pw) {
      if (!(await checkHash(pw, ls.get(K.auth)))) throw new Error('كلمة المرور غير صحيحة');
      ss.set(K.session, '1');
    },
    logout() { ss.del(K.session); },
    isLoggedIn() { return ss.get(K.session) === '1'; },
    async changePassword(oldPw, newPw) {
      validatePassword(newPw);
      if (!(await checkHash(oldPw, ls.get(K.auth)))) throw new Error('كلمة المرور الحالية غير صحيحة');
      ls.set(K.auth, await makeHash(newPw));
    },
    async getAdmin() { return await localState(); },
    async saveApps(apps) { const st = await localState(); st.apps = apps; saveLocal(st); },
    async saveSettings(settings) { const st = await localState(); st.settings = settings; saveLocal(st); },
    async updateSuggestion(id, patch) {
      const st = await localState();
      const s = st.suggestions.find((x) => x.id === id);
      if (s) Object.assign(s, patch);
      saveLocal(st);
    },
    async deleteSuggestion(id) {
      const st = await localState();
      st.suggestions = st.suggestions.filter((x) => x.id !== id);
      saveLocal(st);
    },
    async resetToFile() {
      const st = await localState();
      fileCache = null;
      const f = await loadFile();
      st.apps = f.apps;
      st.settings = f.settings;
      saveLocal(st);
    }
  };

  /* ---------- وضع الخادم ---------- */
  async function call(path, opts = {}) {
    const headers = { 'Content-Type': 'application/json' };
    const t = ss.get(K.token);
    if (t) headers.Authorization = 'Bearer ' + t;
    const r = await fetch(API + path, {
      method: opts.method || 'GET',
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined
    });
    let data = null;
    try { data = await r.json(); } catch (e) {}
    if (r.status === 401 && t) { ss.del(K.token); }
    if (!r.ok) throw new Error((data && data.error) || 'خطأ في الاتصال بالخادم (' + r.status + ')');
    return data;
  }
  async function withFileDefaults(state) {
    if (state.apps && state.settings) return state;
    const f = await loadFile();
    return { ...state, apps: state.apps || f.apps, settings: state.settings || f.settings };
  }
  const cloudApi = {
    async getPublic() {
      try {
        return publicView(await withFileDefaults(await call('/api/catalog')));
      } catch (e) {
        // الخادم لا يستجيب: اعرض الكتالوج من الملف حتى لا تتعطل الصفحة
        console.warn('API unavailable, using data/catalog.json', e);
        return publicView(await loadFile());
      }
    },
    async addSuggestion(s) { await call('/api/suggestions', { method: 'POST', body: normalizeSuggestion(s) }); },
    async authStatus() { return call('/api/auth/status'); },
    async setupPassword(pw) {
      validatePassword(pw);
      // إن كان الخادم محميًا بـ SETUP_KEY: افتح admin.html?key=المفتاح عند أول تعيين
      const key = new URLSearchParams(location.search).get('key');
      const r = await call('/api/auth/setup' + (key ? '?key=' + encodeURIComponent(key) : ''), { method: 'POST', body: { password: pw } });
      ss.set(K.token, r.token);
    },
    async login(pw) {
      const r = await call('/api/auth/login', { method: 'POST', body: { password: pw } });
      ss.set(K.token, r.token);
    },
    logout() { ss.del(K.token); },
    isLoggedIn() { return !!ss.get(K.token); },
    async changePassword(oldPw, newPw) {
      validatePassword(newPw);
      const r = await call('/api/admin/password', { method: 'POST', body: { oldPassword: oldPw, newPassword: newPw } });
      ss.set(K.token, r.token);
    },
    async getAdmin() { return withFileDefaults(await call('/api/admin/data')); },
    async saveApps(apps) { await call('/api/admin/apps', { method: 'PUT', body: { apps } }); },
    async saveSettings(settings) { await call('/api/admin/settings', { method: 'PUT', body: { settings } }); },
    async updateSuggestion(id, patch) { await call('/api/admin/suggestions/' + encodeURIComponent(id), { method: 'PATCH', body: patch }); },
    async deleteSuggestion(id) { await call('/api/admin/suggestions/' + encodeURIComponent(id), { method: 'DELETE' }); },
    async resetToFile() {
      const f = await loadFile();
      await this.saveApps(f.apps);
      await this.saveSettings(f.settings);
    }
  };

  function normalizeSuggestion(s) {
    const cut = (v, n) => String(v || '').trim().slice(0, n);
    const out = {
      id: uid(),
      name: cut(s.name, 60),
      contact: cut(s.contact, 120),
      appId: cut(s.appId, 60),
      message: cut(s.message, 1500),
      date: new Date().toISOString(),
      reply: '', replyDate: '', hidden: false, read: false
    };
    if (out.message.length < 3) throw new Error('اكتب اقتراحك أولًا');
    return out;
  }

  window.BushraStore = Object.assign(MODE === 'cloud' ? cloudApi : localApi, { mode: MODE, loadFile, uid });
})();
