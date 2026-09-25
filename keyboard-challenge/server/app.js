// خادم HTTP: ملفات الواجهة الثابتة + واجهة JSON على المسار /api/<الإجراء>
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { openDatabase } from './db.js';
import { createHandlers, ApiError } from './api.js';
import { SESSION_COOKIE, parseCookies, sessionCookie, findSessionUser } from './auth.js';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy':
    "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'self' http: https:; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
};

const MAX_BODY = 16 * 1024;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '600',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { ...SECURITY_HEADERS, ...headers });
  res.end(body);
}

function sendJson(res, status, data, headers = {}) {
  send(res, status, JSON.stringify(data), { 'Content-Type': MIME['.json'], 'Cache-Control': 'no-store', ...headers });
}

function readBody(req) {
  return new Promise((ok, bad) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { bad(new ApiError(413, 'tooLarge', 'الطلب كبير جدًا')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => ok(Buffer.concat(chunks).toString('utf8')));
    req.on('error', bad);
  });
}

/**
 * ينشئ خادم اللعبة. الخيارات:
 *  - dbPath: مسار ملف SQLite (افتراضيًا في الذاكرة)
 *  - staticDirs: خريطة [بادئة المسار، المجلد]
 *  - now: دالة الوقت (للاختبارات)
 */
export function createApp({
  dbPath = ':memory:',
  staticDirs = [['/shared/', join(ROOT, 'shared')], ['/', join(ROOT, 'public')]],
  now = () => Date.now(),
} = {}) {
  const db = openDatabase(dbPath);
  const presence = new Map();
  const handlers = createHandlers({ db, presence });

  async function handleApi(req, res, name) {
    // تطبيق أندرويد يعمل من نطاق مختلف ويستخدم رمز Bearer بدل الكوكي، لذلك نسمح بـ CORS بلا كوكيز.
    if (req.method === 'OPTIONS') return send(res, 204, '', CORS_HEADERS);
    if (req.method !== 'POST') return sendJson(res, 405, { error: { code: 'method', message: 'استخدم POST' } });
    if (!Object.prototype.hasOwnProperty.call(handlers, name)) {
      return sendJson(res, 404, { error: { code: 'unknown', message: 'إجراء غير معروف' } }, CORS_HEADERS);
    }
    // طلبات JSON فقط: تمنع إرسال النماذج من مواقع أخرى (حماية CSRF مع SameSite).
    if (!String(req.headers['content-type'] || '').startsWith('application/json')) {
      return sendJson(res, 415, { error: { code: 'contentType', message: 'المحتوى يجب أن يكون JSON' } }, CORS_HEADERS);
    }
    const cookies = parseCookies(req.headers.cookie);
    const t = now();
    const bearer = /^Bearer\s+([A-Za-z0-9_-]{20,100})$/.exec(String(req.headers.authorization || ''));
    const sessionToken = bearer ? bearer[1] : cookies[SESSION_COOKIE] || null;
    const secure = req.headers['x-forwarded-proto'] === 'https' || req.socket.encrypted === true;
    const outHeaders = { ...CORS_HEADERS };
    const ctx = {
      now: t,
      sessionToken,
      user: findSessionUser(db, sessionToken, t),
      body: {},
      setSession: ({ token }) => { outHeaders['Set-Cookie'] = sessionCookie(token, { secure }); },
      clearSession: () => { outHeaders['Set-Cookie'] = sessionCookie('', { secure, maxAge: 0 }); },
    };
    try {
      const raw = await readBody(req);
      if (raw) {
        try { ctx.body = JSON.parse(raw); } catch { throw new ApiError(400, 'badJson', 'JSON غير صالح'); }
        if (!ctx.body || typeof ctx.body !== 'object' || Array.isArray(ctx.body)) ctx.body = {};
      }
      const data = handlers[name](ctx);
      sendJson(res, 200, data, outHeaders);
    } catch (err) {
      if (err instanceof ApiError) {
        sendJson(res, err.status, { error: { code: err.code, message: err.message } }, outHeaders);
      } else {
        console.error(`[api ${name}]`, err);
        sendJson(res, 500, { error: { code: 'internal', message: 'حصل خطأ في الخادم، جرب مرة ثانية' } }, CORS_HEADERS);
      }
    }
  }

  async function handleStatic(req, res, pathname) {
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method Not Allowed');
    for (const [prefix, dir] of staticDirs) {
      if (!pathname.startsWith(prefix)) continue;
      let rel = pathname.slice(prefix.length);
      if (rel === '' || rel.endsWith('/')) rel += 'index.html';
      const file = normalize(join(dir, rel));
      if (!file.startsWith(dir + sep) && file !== dir) return send(res, 403, 'Forbidden');
      try {
        const st = await stat(file);
        if (!st.isFile()) continue;
        const body = await readFile(file);
        const type = MIME[extname(file)] || 'application/octet-stream';
        const cache = /\.(webp|png|woff2)$/.test(file) ? 'public, max-age=604800' : 'no-cache';
        return send(res, 200, req.method === 'HEAD' ? '' : body, { 'Content-Type': type, 'Cache-Control': cache });
      } catch {
        // جرّب المجلد التالي
      }
    }
    send(res, 404, 'Not Found', { 'Content-Type': 'text/plain; charset=utf-8' });
  }

  const server = createServer((req, res) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    } catch {
      return send(res, 400, 'Bad Request');
    }
    if (pathname.startsWith('/api/')) return handleApi(req, res, pathname.slice(5));
    return handleStatic(req, res, pathname);
  });

  server.on('close', () => db.close());
  return { server, db };
}
