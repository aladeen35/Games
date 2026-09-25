// جسر البلوتوث مع تطبيق أندرويد (window.AndroidBT) — اتصال RFCOMM مباشر بين الأجهزة.
// الأحداث القادمة من جافا تصل عبر window.__btEvent(type, json).

const native = typeof window.AndroidBT !== 'undefined' ? window.AndroidBT : null;
const handlers = new Map();

window.__btEvent = (type, payload) => {
  let data = {};
  try { data = payload ? JSON.parse(payload) : {}; } catch { data = { raw: payload }; }
  for (const fn of handlers.get(type) || []) {
    try { fn(data); } catch (e) { console.error('[bt]', type, e); }
  }
};

export const bt = {
  available: !!native,

  on(type, fn) {
    if (!handlers.has(type)) handlers.set(type, new Set());
    handlers.get(type).add(fn);
    return () => handlers.get(type).delete(fn);
  },

  /** يطلب الأذونات ويشغّل البلوتوث. يعيد وعدًا بـ { ok, reason }. */
  ready() {
    if (!native) return Promise.resolve({ ok: false, reason: 'unsupported' });
    return new Promise((resolve) => {
      const off = bt.on('ready', (d) => { off(); resolve(d); });
      native.ensureReady();
    });
  },

  host(name) { native?.host(String(name || 'أبو جنان')); },
  stopHost() { native?.stopHost(); },
  paired() {
    try { return JSON.parse(native?.paired() || '[]'); } catch { return []; }
  },
  scan() { native?.scan(); },
  connect(address) { native?.connect(String(address)); },
  send(id, msg) { native?.send(String(id), JSON.stringify(msg)); },
  broadcast(msg) { native?.broadcast(JSON.stringify(msg)); },
  close() { native?.close(); },
};
