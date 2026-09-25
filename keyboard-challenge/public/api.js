// الاتصال بخادم اللعب: نفس الموقع بالكوكي، أو خادم خارجي (تطبيق أندرويد) برمز Bearer.

const SERVER_KEY = 'kb-server';
const TOKEN_KEY = 'kb-token';

const store = {
  get(k) { try { return localStorage.getItem(k) || ''; } catch { return ''; } },
  set(k, v) { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch { /* تجاهل */ } },
};

export const isApp = typeof window.AndroidBT !== 'undefined' || location.hostname === 'appassets.androidplatform.net';

export function getServerUrl() {
  const saved = store.get(SERVER_KEY);
  return (saved || window.KB_CONFIG?.serverUrl || '').trim().replace(/\/+$/, '');
}

export function setServerUrl(url) {
  store.set(SERVER_KEY, String(url || '').trim().replace(/\/+$/, ''));
  store.set(TOKEN_KEY, '');
}

/** هل يوجد خادم يمكن الاتصال به؟ في التطبيق يلزم عنوان صريح. */
export function hasServer() {
  return !isApp || !!getServerUrl();
}

function apiBase() {
  const s = getServerUrl();
  return s ? `${s}/api/` : './api/';
}

const crossOrigin = () => {
  const s = getServerUrl();
  if (!s) return false;
  try { return new URL(s).origin !== location.origin; } catch { return true; }
};

export class ApiFailure extends Error {
  constructor(message, { status = 0, code = 'offline', offline = false } = {}) {
    super(message);
    this.status = status; this.code = code; this.offline = offline;
  }
}

export async function api(name, body = {}) {
  if (!hasServer()) throw new ApiFailure('لم يُحدَّد عنوان خادم اللعب بعد', { offline: true, code: 'noServer' });
  const headers = { 'Content-Type': 'application/json' };
  const token = store.get(TOKEN_KEY);
  if (crossOrigin() && token) headers.Authorization = `Bearer ${token}`;
  let res;
  try {
    res = await fetch(apiBase() + name, {
      method: 'POST', headers, body: JSON.stringify(body),
      credentials: crossOrigin() ? 'omit' : 'same-origin',
    });
  } catch {
    throw new ApiFailure('الخادم غير متاح حاليًا', { offline: true });
  }
  let data = null;
  try { data = await res.json(); } catch { /* ليس JSON: استضافة ثابتة بلا خادم */ }
  if (!res.ok || !data) {
    if (!data?.error) throw new ApiFailure('الخادم غير متاح حاليًا', { status: res.status, offline: true });
    throw new ApiFailure(data.error.message, { status: res.status, code: data.error.code });
  }
  if (data.token && crossOrigin()) store.set(TOKEN_KEY, data.token);
  if (name === 'auth.logout') store.set(TOKEN_KEY, '');
  return data;
}
