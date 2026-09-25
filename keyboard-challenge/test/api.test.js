import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../server/app.js';
import { getPhrase, DIFFICULTIES } from '../shared/game.js';

let clock = Date.parse('2026-09-23T12:00:00Z'); // أربعاء
let server;
let base;

before(async () => {
  ({ server } = createApp({ now: () => clock }));
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise((r) => { server.closeAllConnections(); server.close(r); }));

function client() {
  let cookie = '';
  return async (name, body = {}) => {
    const res = await fetch(`${base}/api/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
      body: JSON.stringify(body),
    });
    const set = res.headers.get('set-cookie');
    if (set) cookie = set.split(';')[0];
    const data = await res.json();
    return { status: res.status, ...data };
  };
}

const alice = client();
const bob = client();
const guest = client();

test('الصفحة والملفات المشتركة تُخدم', async () => {
  const html = await fetch(`${base}/`);
  assert.equal(html.status, 200);
  assert.match(await html.text(), /تحدي الـ Keyboard/);
  const js = await fetch(`${base}/shared/game.js`);
  assert.equal(js.status, 200);
  assert.match(js.headers.get('content-type'), /javascript/);
  const bad = await fetch(`${base}/..%2F..%2Fpackage.json`);
  assert.notEqual(bad.status, 200);
});

test('التسجيل والدخول', async () => {
  let r = await alice('auth.register', { username: 'abujinan', displayName: 'أبو جنان', password: 'secret123' });
  assert.equal(r.status, 200);
  assert.equal(r.user.displayName, 'أبو جنان');
  r = await bob('auth.register', { username: 'abujinan', displayName: 'تاني', password: 'secret123' });
  assert.equal(r.status, 409);
  r = await bob('auth.register', { username: 'wad_nile', displayName: 'ود النيل', password: 'secret456' });
  assert.equal(r.status, 200);
  r = await guest('auth.login', { username: 'abujinan', password: 'wrong' });
  assert.equal(r.status, 401);
  r = await alice('auth.me');
  assert.equal(r.user.username, 'abujinan');
  r = await guest('auth.me');
  assert.equal(r.user, null);
});

test('الإجراءات المحمية تحتاج تسجيل دخول', async () => {
  const r = await guest('room.create', { difficulty: 'medium' });
  assert.equal(r.status, 401);
  assert.match(r.error.message, /سجّل الدخول/);
});

test('دورة غرفة كاملة: إنشاء، انضمام، بدء، تقدم، إنهاء', async () => {
  let r = await alice('room.create', { difficulty: 'medium' });
  assert.equal(r.status, 200);
  const code = r.room.code;
  assert.match(code, /^[A-Z0-9]{5}$/);
  assert.equal(r.room.status, 'waiting');
  assert.equal(r.players.length, 1);
  assert.ok(r.room.isHost);

  r = await guest('room.state', { code });
  assert.equal(r.status, 401);
  r = await bob('room.state', { code });
  assert.equal(r.status, 403);

  r = await bob('room.join', { code: code.toLowerCase() });
  assert.equal(r.status, 200);
  assert.equal(r.players.length, 2);
  assert.equal(r.room.isHost, false);

  r = await bob('room.start', { code });
  assert.equal(r.status, 403);

  r = await alice('room.start', { code });
  assert.equal(r.room.status, 'racing');
  const phrase = getPhrase('medium', r.room.phraseIndex);
  const len = [...phrase].length;

  clock += 5000;
  r = await bob('room.progress', { code, progress: 40, wpm: 50, accuracy: 97 });
  const bobRow = r.players.find((p) => p.isMe);
  assert.equal(bobRow.progress, 40);
  assert.equal(bobRow.accuracy, 97);

  // نسبة تقدم مرفوضة فوق 99 أثناء السباق
  r = await bob('room.progress', { code, progress: 100, wpm: 999, accuracy: 100 });
  assert.equal(r.players.find((p) => p.isMe).progress, 99);
  assert.ok(r.players.find((p) => p.isMe).wpm <= 220);

  // زمن أطول من زمن الخادم → مرفوض
  r = await alice('room.finish', { code, elapsedMs: 60000, accuracy: 98 });
  assert.equal(r.status, 422);

  clock += 7000;
  r = await alice('room.finish', { code, elapsedMs: 12000, accuracy: 98 });
  assert.equal(r.status, 200);
  assert.ok(r.saved);
  assert.equal(r.wpm, Math.round((len / 5) / (12000 / 60000)));
  assert.equal(r.players.find((p) => p.isMe).place, 1);

  r = await alice('room.finish', { code, elapsedMs: 12000, accuracy: 98 });
  assert.ok(r.already);

  clock += 3000;
  r = await bob('room.finish', { code, elapsedMs: 15000, accuracy: 90 });
  assert.ok(r.saved);
  assert.equal(r.room.status, 'finished');
  assert.equal(r.players.find((p) => p.isMe).place, 2);

  // لا انضمام لغرفة منتهية
  const carol = client();
  await carol('auth.register', { username: 'carol', displayName: 'كارول', password: 'secret789' });
  r = await carol('room.join', { code });
  assert.equal(r.status, 410);
  assert.equal(r.error.message, 'هذه الجولة انتهت، أنشئ غرفة جديدة');
});

test('غرفة غير موجودة', async () => {
  const r = await alice('room.join', { code: 'ZZZZ9' });
  assert.equal(r.status, 404);
  assert.equal(r.error.message, 'الغرفة غير موجودة، راجع الكود وجرب مرة ثانية');
});

test('الغرفة تنتهي تلقائيًا بعد انتهاء الوقت', async () => {
  let r = await alice('room.create', { difficulty: 'easy' });
  const code = r.room.code;
  await alice('room.start', { code });
  clock += (DIFFICULTIES.easy.seconds + 11) * 1000;
  r = await alice('room.state', { code });
  assert.equal(r.room.status, 'finished');
});

test('جولة فردية محفوظة، ونتيجة مستحيلة مرفوضة', async () => {
  let r = await alice('round.start', { difficulty: 'rocket', phraseIndex: 0 });
  const { roundId } = r;
  clock += 20000;
  r = await alice('round.finish', { roundId, elapsedMs: 19000, accuracy: 99 });
  assert.equal(r.status, 200);
  assert.ok(r.saved);
  r = await alice('round.finish', { roundId, elapsedMs: 19000, accuracy: 99 });
  assert.equal(r.status, 409);

  r = await alice('round.start', { difficulty: 'rocket', phraseIndex: 0 });
  clock += 1000;
  r = await alice('round.finish', { roundId: r.roundId, elapsedMs: 300, accuracy: 100 });
  assert.equal(r.status, 422);

  r = await guest('round.start', { difficulty: 'easy' });
  assert.equal(r.status, 401);
});

test('لوحة الترتيب الأسبوعية: أفضل نتيجة لكل لاعب وفلتر المستوى', async () => {
  let r = await guest('leaderboard.weekly', {});
  assert.equal(r.status, 200);
  const names = r.results.map((x) => x.displayName);
  assert.equal(new Set(names).size, names.length);
  assert.ok(names.includes('أبو جنان'));
  assert.ok(names.includes('ود النيل'));
  for (let i = 1; i < r.results.length; i++) assert.ok(r.results[i - 1].wpm >= r.results[i].wpm);

  r = await guest('leaderboard.weekly', { difficulty: 'rocket' });
  assert.deepEqual(r.results.map((x) => x.displayName), ['أبو جنان']);
  assert.equal(r.results[0].difficulty, 'rocket');

  // الأسبوع التالي يبدأ فارغًا
  clock = Date.parse('2026-09-28T00:00:01Z');
  r = await guest('leaderboard.weekly', {});
  assert.equal(r.results.length, 0);
});

test('طلبات غير JSON مرفوضة', async () => {
  const res = await fetch(`${base}/api/auth.me`, { method: 'POST', body: 'x', headers: { 'Content-Type': 'text/plain' } });
  assert.equal(res.status, 415);
});

test('الخروج ينهي الجلسة', async () => {
  await bob('auth.logout');
  const r = await bob('auth.me');
  assert.equal(r.user, null);
});
