/* خادم «البشري للتكنولوجيا» — Cloudflare Worker + KV
   يحفظ الكتالوج والاقتراحات وكلمة مرور المطوّر، فتظهر تعديلات صفحة المطوّر لكل الزوّار.
   مفاتيح KV:
     catalog      → { settings, apps }        (يُنشأ عند أول حفظ؛ قبله يستخدم الموقع data/catalog.json)
     auth         → { salt, iter, hash }      (PBKDF2-SHA256)
     secret       → مفتاح توقيع الجلسات (يتجدّد عند تغيير كلمة المرور)
     s:<id>       → اقتراح واحد
     rl:<ip>      → حدّ الإرسال (5 اقتراحات/10 دقائق) */

const TOKEN_TTL = 7 * 24 * 3600; // أسبوع
const MAX_BODY = 4 * 1024 * 1024;

export default {
  async fetch(req, env) {
    const cors = corsHeaders(req, env);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    try {
      const res = await route(req, env);
      for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
      return res;
    } catch (e) {
      const status = e.status || 500;
      return json({ error: status === 500 && !e.status ? 'خطأ داخلي في الخادم' : e.message }, status, cors);
    }
  }
};

async function route(req, env) {
  const url = new URL(req.url);
  const p = url.pathname.replace(/\/+$/, '');
  const m = req.method;
  const KV = env.BUSHRA_KV;

  /* صفحة فحص: افتح رابط الخادم مباشرة لترى حالته */
  if ((p === '' || p === '/api') && m === 'GET') {
    return json({
      ok: !!KV,
      service: 'Al-Bushra Technology API',
      kv: KV ? 'مربوط ✓' : 'غير مربوط ✗ — أضف ربط KV باسم BUSHRA_KV من Settings ← Bindings',
      password: KV ? ((await KV.get('auth')) ? 'معيّنة ✓' : 'لم تُعيَّن بعد — افتح صفحة المطوّر') : '—',
      setupKey: env.SETUP_KEY ? 'مفعّل ✓' : 'غير مفعّل'
    });
  }
  if (!KV) throw httpErr(500, 'مخزن BUSHRA_KV غير مربوط بالخادم');

  /* ---------- عام ---------- */
  if (p === '/api/catalog' && m === 'GET') {
    const catalog = (await KV.get('catalog', 'json')) || {};
    const suggestions = (await listSuggestions(KV)).map(({ contact, ...s }) => s);
    const apps = catalog.apps ? catalog.apps.filter((a) => a.visible !== false) : null;
    return json({ settings: catalog.settings || null, apps, suggestions });
  }

  if (p === '/api/suggestions' && m === 'POST') {
    const ip = req.headers.get('CF-Connecting-IP') || 'anon';
    const rlKey = 'rl:' + ip;
    const n = parseInt((await KV.get(rlKey)) || '0', 10);
    if (n >= 5) throw httpErr(429, 'أرسلت اقتراحات كثيرة، حاول بعد قليل');
    await KV.put(rlKey, String(n + 1), { expirationTtl: 600 });
    const b = await body(req);
    const s = {
      id: Date.now().toString(36) + rand(4),
      name: str(b.name, 60),
      contact: str(b.contact, 120),
      appId: str(b.appId, 60),
      message: str(b.message, 1500),
      date: new Date().toISOString(),
      reply: '', replyDate: '', hidden: false, read: false
    };
    if (s.message.length < 3) throw httpErr(400, 'اكتب اقتراحك أولًا');
    await KV.put('s:' + s.id, JSON.stringify(s));
    return json({ ok: true });
  }

  /* ---------- كلمة المرور ---------- */
  if (p === '/api/auth/status' && m === 'GET') {
    return json({ hasPassword: !!(await KV.get('auth')) });
  }

  if (p === '/api/auth/setup' && m === 'POST') {
    if (await KV.get('auth')) throw httpErr(409, 'كلمة المرور معيّنة مسبقًا');
    const b = await body(req);
    // حماية اختيارية: إن ضُبط SETUP_KEY في الخادم فيجب إرساله (?key=) عند أول تعيين
    if (env.SETUP_KEY && url.searchParams.get('key') !== env.SETUP_KEY) throw httpErr(403, 'مفتاح الإعداد غير صحيح');
    checkPw(b.password);
    await KV.put('auth', JSON.stringify(await makeHash(b.password)));
    await KV.put('secret', rand(32));
    return json({ token: await issueToken(KV) });
  }

  if (p === '/api/auth/login' && m === 'POST') {
    const ip = req.headers.get('CF-Connecting-IP') || 'anon';
    const lk = 'lf:' + ip;
    const fails = parseInt((await KV.get(lk)) || '0', 10);
    if (fails >= 8) throw httpErr(429, 'محاولات كثيرة، انتظر 15 دقيقة');
    const b = await body(req);
    const rec = await KV.get('auth', 'json');
    if (!rec || !(await verify(String(b.password || ''), rec))) {
      await KV.put(lk, String(fails + 1), { expirationTtl: 900 });
      throw httpErr(401, 'كلمة المرور غير صحيحة');
    }
    return json({ token: await issueToken(KV) });
  }

  /* ---------- المطوّر ---------- */
  if (p.startsWith('/api/admin/')) {
    await requireAuth(req, KV);

    if (p === '/api/admin/data' && m === 'GET') {
      const catalog = (await KV.get('catalog', 'json')) || {};
      return json({ settings: catalog.settings || null, apps: catalog.apps || null, suggestions: await listSuggestions(KV, true) });
    }
    if (p === '/api/admin/apps' && m === 'PUT') {
      const b = await body(req);
      if (!Array.isArray(b.apps)) throw httpErr(400, 'قائمة التطبيقات مفقودة');
      const catalog = (await KV.get('catalog', 'json')) || {};
      catalog.apps = b.apps.slice(0, 300).map(cleanApp);
      await KV.put('catalog', JSON.stringify(catalog));
      return json({ ok: true });
    }
    if (p === '/api/admin/settings' && m === 'PUT') {
      const b = await body(req);
      const s = b.settings || {};
      const catalog = (await KV.get('catalog', 'json')) || {};
      catalog.settings = {};
      for (const k of ['siteName', 'siteNameEn', 'tagline', 'about', 'dedication', 'contactEmail']) catalog.settings[k] = str(s[k], k === 'about' ? 2000 : 200);
      await KV.put('catalog', JSON.stringify(catalog));
      return json({ ok: true });
    }
    const sm = p.match(/^\/api\/admin\/suggestions\/([A-Za-z0-9_-]{1,40})$/);
    if (sm) {
      const key = 's:' + sm[1];
      const s = await KV.get(key, 'json');
      if (!s) throw httpErr(404, 'الاقتراح غير موجود');
      if (m === 'DELETE') { await KV.delete(key); return json({ ok: true }); }
      if (m === 'PATCH') {
        const b = await body(req);
        if ('reply' in b) { s.reply = str(b.reply, 1500); s.replyDate = s.reply ? new Date().toISOString() : ''; }
        if ('hidden' in b) s.hidden = !!b.hidden;
        if ('read' in b) s.read = !!b.read;
        await KV.put(key, JSON.stringify(s));
        return json({ ok: true });
      }
    }
    if (p === '/api/admin/password' && m === 'POST') {
      const b = await body(req);
      const rec = await KV.get('auth', 'json');
      if (!(await verify(String(b.oldPassword || ''), rec))) throw httpErr(401, 'كلمة المرور الحالية غير صحيحة');
      checkPw(b.newPassword);
      await KV.put('auth', JSON.stringify(await makeHash(b.newPassword)));
      await KV.put('secret', rand(32)); // يُلغي كل الجلسات القديمة
      return json({ token: await issueToken(KV) });
    }
  }

  throw httpErr(404, 'غير موجود');
}

/* ---------- مساعدات ---------- */
async function listSuggestions(KV, all) {
  const out = [];
  let cursor;
  do {
    const r = await KV.list({ prefix: 's:', cursor });
    const vals = await Promise.all(r.keys.map((k) => KV.get(k.name, 'json')));
    for (const v of vals) if (v && (all || (v.reply && !v.hidden))) out.push(v);
    cursor = r.list_complete ? null : r.cursor;
  } while (cursor);
  return out.sort((a, b) => b.date.localeCompare(a.date));
}

function cleanApp(a) {
  const url = (u, data) => {
    u = str(u, data ? 400000 : 1000);
    if (!u) return '';
    if (/^https?:\/\//i.test(u)) return u;
    if (data && /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(u)) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u) || u.startsWith('//')) return '';
    return u; // مسار نسبي مثل assets/logos/x.webp
  };
  return {
    id: str(a.id, 60) || rand(6),
    name: str(a.name, 80),
    category: ['apps', 'games', 'kids', 'tools'].includes(a.category) ? a.category : 'apps',
    description: str(a.description, 600),
    logo: url(a.logo, true),
    url: url(a.url),
    apkUrl: url(a.apkUrl),
    playUrl: url(a.playUrl),
    badge: str(a.badge, 30),
    featured: !!a.featured,
    visible: a.visible !== false
  };
}

const str = (v, n) => String(v == null ? '' : v).trim().slice(0, n);
const rand = (n) => [...crypto.getRandomValues(new Uint8Array(n))].map((b) => b.toString(16).padStart(2, '0')).join('');
const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

function httpErr(status, message) { const e = new Error(message); e.status = status; return e; }
function checkPw(pw) { if (typeof pw !== 'string' || pw.length < 6) throw httpErr(400, 'كلمة المرور يجب ألا تقل عن 6 أحرف'); }

async function body(req) {
  const len = parseInt(req.headers.get('Content-Length') || '0', 10);
  if (len > MAX_BODY) throw httpErr(413, 'البيانات كبيرة جدًا');
  try { return (await req.json()) || {}; } catch (e) { throw httpErr(400, 'طلب غير صالح'); }
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', ...headers } });
}

function corsHeaders(req, env) {
  const origin = req.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGINS || '*').split(',').map((s) => s.trim());
  const ok = allowed.includes('*') ? '*' : allowed.includes(origin) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin': ok,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
}

async function pbkdf2(pw, salt, iter) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveBits']);
  return b64(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, key, 256));
}
async function makeHash(pw) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { salt: b64(salt), iter: 100000, hash: await pbkdf2(pw, salt, 100000) };
}
async function verify(pw, rec) {
  if (!rec) return false;
  const h = await pbkdf2(pw, unb64(rec.salt), rec.iter);
  return timingSafeEqual(h, rec.hash);
}
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function hmac(KV, msg) {
  const secret = await KV.get('secret');
  if (!secret) throw httpErr(401, 'انتهت الجلسة');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg))).replace(/[+/=]/g, (c) => ({ '+': '-', '/': '_', '=': '' }[c]));
}
async function issueToken(KV) {
  const exp = String(Math.floor(Date.now() / 1000) + TOKEN_TTL);
  return exp + '.' + (await hmac(KV, exp));
}
async function requireAuth(req, KV) {
  const t = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  const [exp, sig] = t.split('.');
  if (!exp || !sig || parseInt(exp, 10) < Date.now() / 1000) throw httpErr(401, 'انتهت الجلسة، سجّل الدخول من جديد');
  if (!timingSafeEqual(await hmac(KV, exp), sig)) throw httpErr(401, 'جلسة غير صالحة');
}
