// الحسابات والجلسات: كلمات مرور مشفّرة بـ scrypt وجلسات بكوكي HttpOnly.
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';

export const SESSION_COOKIE = 'kb_session';
export const SESSION_DAYS = 30;

export function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32);
  return `${salt.toString('base64url')}:${hash.toString('base64url')}`;
}

export function verifyPassword(password, stored) {
  const [saltB64, hashB64] = String(stored).split(':');
  if (!saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, 'base64url');
  const actual = scryptSync(password, Buffer.from(saltB64, 'base64url'), expected.length);
  return timingSafeEqual(expected, actual);
}

const sha256 = (s) => createHash('sha256').update(s).digest('base64url');

export function createSession(db, userId, now) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = now + SESSION_DAYS * 86400_000;
  db.prepare('INSERT INTO sessions (tokenHash, userId, createdAt, expiresAt) VALUES (?, ?, ?, ?)')
    .run(sha256(token), userId, now, expiresAt);
  return { token, expiresAt };
}

export function findSessionUser(db, token, now) {
  if (!token) return null;
  const row = db.prepare(`
    SELECT u.id, u.username, u.displayName FROM sessions s
    JOIN users u ON u.id = s.userId
    WHERE s.tokenHash = ? AND s.expiresAt > ?`).get(sha256(token), now);
  return row ? { id: row.id, username: row.username, displayName: row.displayName } : null;
}

export function deleteSession(db, token) {
  if (token) db.prepare('DELETE FROM sessions WHERE tokenHash = ?').run(sha256(token));
}

export function parseCookies(header = '') {
  const out = {};
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    if (k) out[k] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function sessionCookie(token, { secure = false, maxAge = SESSION_DAYS * 86400 } = {}) {
  const parts = [`${SESSION_COOKIE}=${token}`, 'Path=/', 'HttpOnly', 'SameSite=Lax', `Max-Age=${maxAge}`];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}
