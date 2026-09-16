/* ============================================================
   عدّاد الزيارات — دالة Netlify بلا أي حزم خارجية
   ------------------------------------------------------------
   المسار:  /api/visits?m=hit|ping|health&sid=<معرّف الجلسة>
   الرد  :  { ok, total, online, countries:[{code,n}] }

   التخزين في Netlify Blobs عبر واجهته المباشرة (بلا npm install)،
   فتبقى الأرقام بعد كل رفع جديد للموقع.

   الاستمرار من آخر رقم:
     عند أول تشغيل فقط، إن كان المخزن فارغاً، تبدأ الأرقام من SEED أدناه
     أو من متغيّري البيئة VISITS_SEED_TOTAL و VISITS_SEED_COUNTRIES.
     بعدها لا يُستخدم SEED إطلاقاً ولا يُعاد الصفر أبداً.
   ============================================================ */

/* عدّل هذين السطرين مرة واحدة بآخر أرقام ظاهرة في الموقع الحالي،
   أو اضبطهما من إعدادات Netlify كمتغيّري بيئة. */
const SEED = {
  total: 0,                       // إجمالي الزيارات السابق
  countries: {}                   // مثال: { "SD": 9000, "SA": 1200 }
};

const STORE = "visits";
const KEY = "state";
const ONLINE_WINDOW_MS = 5 * 60 * 1000;   // يُعدّ متصلاً من نشط خلال 5 دقائق
const MAX_SESSIONS = 5000;                // سقف حجم سجل الجلسات

/* ---------- الوصول إلى Netlify Blobs بلا حزم ---------- */
function blobsContext() {
  const raw = process.env.NETLIFY_BLOBS_CONTEXT;
  if (!raw) return null;
  try {
    const c = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    const base = c.edgeURL || c.url || c.apiURL;
    if (!base || !c.token || !c.siteID) return null;
    return { base, token: c.token, site: c.siteID };
  } catch {
    return null;
  }
}

function blobURL(ctx) {
  return `${ctx.base}/${ctx.site}/${STORE}/${KEY}`;
}

async function loadState(ctx) {
  if (!ctx) return null;
  const r = await fetch(blobURL(ctx), { headers: { authorization: `Bearer ${ctx.token}` } });
  if (r.status === 404) return {};
  if (!r.ok) throw new Error(`blobs read ${r.status}`);
  const text = await r.text();
  if (!text) return {};
  try { return JSON.parse(text); } catch { return {}; }
}

async function saveState(ctx, state) {
  if (!ctx) return;
  const r = await fetch(blobURL(ctx), {
    method: "PUT",
    headers: { authorization: `Bearer ${ctx.token}`, "content-type": "application/json" },
    body: JSON.stringify(state)
  });
  if (!r.ok) throw new Error(`blobs write ${r.status}`);
}

/* ---------- احتياطي في الذاكرة إذا تعذّر التخزين ---------- */
globalThis.__visitsMemory = globalThis.__visitsMemory || null;

/* ---------- تحديد الدولة ---------- */
function countryOf(req, context) {
  const fromCtx = context?.geo?.country?.code;
  if (fromCtx) return String(fromCtx).toUpperCase();
  const h = req.headers.get("x-nf-geo");
  if (h) {
    try {
      const g = JSON.parse(Buffer.from(h, "base64").toString("utf8"));
      if (g?.country?.code) return String(g.country.code).toUpperCase();
    } catch { /* تجاهل */ }
  }
  const cf = req.headers.get("x-country") || req.headers.get("cf-ipcountry");
  return cf ? String(cf).toUpperCase() : "ZZ";
}

/* ---------- تهيئة الحالة من البذرة مرة واحدة ---------- */
function seeded() {
  const envTotal = parseInt(process.env.VISITS_SEED_TOTAL || "", 10);
  let envCountries = null;
  try {
    if (process.env.VISITS_SEED_COUNTRIES) envCountries = JSON.parse(process.env.VISITS_SEED_COUNTRIES);
  } catch { /* تجاهل */ }
  return {
    total: Number.isFinite(envTotal) ? envTotal : (SEED.total || 0),
    countries: envCountries && typeof envCountries === "object" ? { ...envCountries } : { ...SEED.countries },
    sessions: {},
    seededAt: new Date().toISOString()
  };
}

function normalize(state) {
  return {
    total: Number.isFinite(state?.total) ? state.total : 0,
    countries: state?.countries && typeof state.countries === "object" ? state.countries : {},
    sessions: state?.sessions && typeof state.sessions === "object" ? state.sessions : {},
    seededAt: state?.seededAt || null
  };
}

function shape(state, extra) {
  const now = Date.now();
  let online = 0;
  for (const t of Object.values(state.sessions)) if (now - t < ONLINE_WINDOW_MS) online++;
  const countries = Object.entries(state.countries)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([code, n]) => ({ code, n }));
  return { ok: true, total: state.total, online: Math.max(online, 1), countries, ...extra };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*"
    }
  });
}

/* ---------- الدالة ---------- */
export default async (req, context) => {
  const url = new URL(req.url);
  const mode = (url.searchParams.get("m") || "ping").toLowerCase();
  const sid = (url.searchParams.get("sid") || "").slice(0, 32) || "anon";
  const ctx = blobsContext();

  if (mode === "health") {
    return json({ ok: true, storage: ctx ? "netlify-blobs" : "memory-only", store: STORE, key: KEY });
  }

  let state, persisted = true;
  try {
    const raw = await loadState(ctx);
    state = raw && Object.keys(raw).length ? normalize(raw) : seeded();
  } catch {
    /* تعذّرت القراءة: لا نعرض رقماً مغلوطاً.
       نكمل من نسخة الذاكرة إن كانت قراءة سابقة نجحت في هذه العملية،
       وإلا نُرجع ok:false فيُخفي الموقع الصندوق بدل إظهار عدّاد مصفَّر. */
    if (!globalThis.__visitsMemory) {
      return json({ ok: false, error: "storage-unavailable" }, 503);
    }
    persisted = false;
    state = normalize(globalThis.__visitsMemory);
  }

  const now = Date.now();
  const known = Object.prototype.hasOwnProperty.call(state.sessions, sid);

  /* زيارة جديدة تُحتسب مرة واحدة لكل جلسة */
  if (mode === "hit" && !known) {
    state.total += 1;
    const code = countryOf(req, context);
    state.countries[code] = (state.countries[code] || 0) + 1;
  }
  state.sessions[sid] = now;

  /* تنظيف الجلسات القديمة */
  for (const [k, t] of Object.entries(state.sessions)) {
    if (now - t > ONLINE_WINDOW_MS) delete state.sessions[k];
  }
  const keys = Object.keys(state.sessions);
  if (keys.length > MAX_SESSIONS) {
    keys.sort((a, b) => state.sessions[a] - state.sessions[b])
        .slice(0, keys.length - MAX_SESSIONS)
        .forEach((k) => delete state.sessions[k]);
  }

  /* نحتفظ دائماً بنسخة في الذاكرة لتكون احتياطياً لو تعطّل المخزن لاحقاً */
  globalThis.__visitsMemory = state;

  try {
    if (persisted) await saveState(ctx, state);
  } catch {
    persisted = false;
  }

  return json(shape(state, persisted ? undefined : { persisted: false }));
};

export const config = { path: "/api/visits" };
