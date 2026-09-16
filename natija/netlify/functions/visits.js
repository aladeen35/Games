/* ============================================================
   عدّاد الزيارات — دالة Netlify
   ------------------------------------------------------------
   مكتوبة بصيغة CommonJS الكلاسيكية (exports.handler) وهي أوسع الصيغ
   توافقاً: تعمل مع الرفع اليدوي بالسحب والإفلات ومع الربط بمستودع،
   وبلا أي حزم خارجية ولا npm install.

   المسار:  /api/visits?m=hit|ping|health&sid=<معرّف الجلسة>
   الرد  :  { ok, total, online, countries:[{code,n}] }

   التخزين في Netlify Blobs عبر واجهته المباشرة، وهو مستقل عن ملفات
   الموقع، فالأرقام لا تتصفّر عند رفع نسخة جديدة.

   الاستمرار من آخر رقم:
     عند أول تشغيل فقط، والمخزن فارغ، تبدأ الأرقام من SEED أدناه أو من
     متغيّري البيئة VISITS_SEED_TOTAL و VISITS_SEED_COUNTRIES.
     بعدها لا تُستخدم البذرة إطلاقاً ولا يُعاد الصفر أبداً.
   ============================================================ */

/* ⬇⬇ عدّل هذين السطرين مرة واحدة بآخر أرقام ظاهرة في موقعك الحالي ⬇⬇ */
var SEED = {
  total: 0,                       // آخر إجمالي زيارات ظاهر
  countries: {}                   // مثال: { "SD": 9000, "SA": 1200 }
};
/* ⬆⬆ أو اضبطهما من إعدادات Netlify كمتغيّري بيئة ⬆⬆ */

var STORE = "visits";
var KEY = "state";
var ONLINE_WINDOW_MS = 5 * 60 * 1000;   // يُعدّ متصلاً من نشط خلال 5 دقائق
var MAX_SESSIONS = 5000;                // سقف حجم سجل الجلسات

/* ---------- الوصول إلى Netlify Blobs بلا حزم ---------- */
function blobsContext() {
  var raw = process.env.NETLIFY_BLOBS_CONTEXT;
  if (!raw) return null;
  try {
    var c = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
    var base = c.edgeURL || c.url || c.apiURL;
    if (!base || !c.token || !c.siteID) return null;
    return { base: base, token: c.token, site: c.siteID };
  } catch (e) {
    return null;
  }
}

function blobURL(ctx) {
  return ctx.base + "/" + ctx.site + "/" + STORE + "/" + KEY;
}

function loadState(ctx) {
  if (!ctx) return Promise.reject(new Error("no-blobs"));
  return fetch(blobURL(ctx), { headers: { authorization: "Bearer " + ctx.token } })
    .then(function (r) {
      if (r.status === 404) return {};
      if (!r.ok) throw new Error("blobs read " + r.status);
      return r.text().then(function (t) {
        if (!t) return {};
        try { return JSON.parse(t); } catch (e) { return {}; }
      });
    });
}

function saveState(ctx, state) {
  if (!ctx) return Promise.resolve();
  return fetch(blobURL(ctx), {
    method: "PUT",
    headers: { authorization: "Bearer " + ctx.token, "content-type": "application/json" },
    body: JSON.stringify(state)
  }).then(function (r) {
    if (!r.ok) throw new Error("blobs write " + r.status);
  });
}

/* ---------- تحديد الدولة ---------- */
function countryOf(event, context) {
  var geo = context && context.clientContext && context.clientContext.geo;
  if (geo && geo.country && geo.country.code) return String(geo.country.code).toUpperCase();

  var headers = (event && event.headers) || {};
  var raw = headers["x-nf-geo"] || headers["X-NF-Geo"];
  if (raw) {
    try {
      var g = JSON.parse(Buffer.from(raw, "base64").toString("utf8"));
      if (g && g.country && g.country.code) return String(g.country.code).toUpperCase();
    } catch (e) { /* تجاهل */ }
  }
  var cc = headers["x-country"] || headers["cf-ipcountry"];
  return cc ? String(cc).toUpperCase() : "ZZ";
}

/* ---------- البذرة والتطبيع ---------- */
function seeded() {
  var envTotal = parseInt(process.env.VISITS_SEED_TOTAL || "", 10);
  var envCountries = null;
  try {
    if (process.env.VISITS_SEED_COUNTRIES) envCountries = JSON.parse(process.env.VISITS_SEED_COUNTRIES);
  } catch (e) { /* تجاهل */ }
  var countries = {};
  var src = (envCountries && typeof envCountries === "object") ? envCountries : SEED.countries;
  for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k)) countries[k] = src[k];
  return {
    total: isFinite(envTotal) ? envTotal : (SEED.total || 0),
    countries: countries,
    sessions: {},
    seededAt: new Date().toISOString()
  };
}

function normalize(state) {
  return {
    total: state && isFinite(state.total) ? state.total : 0,
    countries: state && state.countries && typeof state.countries === "object" ? state.countries : {},
    sessions: state && state.sessions && typeof state.sessions === "object" ? state.sessions : {},
    seededAt: (state && state.seededAt) || null
  };
}

function shape(state, extra) {
  var now = Date.now(), online = 0, k;
  for (k in state.sessions) if (now - state.sessions[k] < ONLINE_WINDOW_MS) online++;
  var countries = [];
  for (k in state.countries) if (state.countries[k] > 0) countries.push({ code: k, n: state.countries[k] });
  countries.sort(function (a, b) { return b.n - a.n; });
  var out = { ok: true, total: state.total, online: Math.max(online, 1), countries: countries };
  if (extra) for (k in extra) out[k] = extra[k];
  return out;
}

function reply(body, status) {
  return {
    statusCode: status || 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*"
    },
    body: JSON.stringify(body)
  };
}

/* ---------- الدالة ---------- */
exports.handler = function (event, context) {
  var params = (event && event.queryStringParameters) || {};
  var mode = String(params.m || "ping").toLowerCase();
  var sid = String(params.sid || "").slice(0, 32) || "anon";
  var ctx = blobsContext();

  if (mode === "health") {
    return Promise.resolve(reply({
      ok: true, storage: ctx ? "netlify-blobs" : "memory-only", store: STORE, key: KEY
    }));
  }

  var persisted = true;

  return loadState(ctx)
    .then(function (raw) {
      return raw && Object.keys(raw).length ? normalize(raw) : seeded();
    })
    .catch(function () {
      /* تعذّرت القراءة: لا نعرض رقماً مغلوطاً.
         نكمل من نسخة الذاكرة إن نجحت قراءة سابقة في هذه العملية،
         وإلا نُرجع ok:false فيُخفي الموقع الصندوق بدل عدّاد مصفَّر. */
      persisted = false;
      if (!global.__visitsMemory) return null;
      return normalize(global.__visitsMemory);
    })
    .then(function (state) {
      if (!state) return reply({ ok: false, error: "storage-unavailable" }, 503);

      var now = Date.now();
      var known = Object.prototype.hasOwnProperty.call(state.sessions, sid);

      /* الزيارة تُحتسب مرة واحدة لكل جلسة */
      if (mode === "hit" && !known) {
        state.total += 1;
        var code = countryOf(event, context);
        state.countries[code] = (state.countries[code] || 0) + 1;
      }
      state.sessions[sid] = now;

      /* تنظيف الجلسات القديمة */
      var keys = [], k;
      for (k in state.sessions) {
        if (now - state.sessions[k] > ONLINE_WINDOW_MS) delete state.sessions[k];
        else keys.push(k);
      }
      if (keys.length > MAX_SESSIONS) {
        keys.sort(function (a, b) { return state.sessions[a] - state.sessions[b]; });
        keys.slice(0, keys.length - MAX_SESSIONS).forEach(function (x) { delete state.sessions[x]; });
      }

      /* نسخة في الذاكرة احتياطاً لو تعطّل المخزن لاحقاً */
      global.__visitsMemory = state;

      if (!persisted) return reply(shape(state, { persisted: false }));

      return saveState(ctx, state)
        .then(function () { return reply(shape(state)); })
        .catch(function () { return reply(shape(state, { persisted: false })); });
    });
};
