// إجراءات الخادم: الحسابات، الغرف، الجولات الفردية، ولوحة الترتيب الأسبوعية.
import { randomBytes, randomInt } from 'node:crypto';
import {
  isDifficulty, clamp, computeWpm, weekStartUTC, MAX_WPM, COUNTDOWN_MS, roundSeconds,
  ROOM_CODE_ALPHABET, ROOM_CODE_LENGTH, normalizeRoomCode, isValidRoomCode,
} from '../shared/game.js';
import { getText, randomTextId, isCategory, isKind, MIX } from '../shared/texts/index.js';
import { tx } from './db.js';
import { hashPassword, verifyPassword, createSession, deleteSession } from './auth.js';

export class ApiError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const MESSAGES = {
  unauthorized: 'سجّل الدخول أولًا عشان تلعب في الغرف وتحفظ نتيجتك',
  roomNotFound: 'الغرفة غير موجودة، راجع الكود وجرب مرة ثانية',
  roomFinished: 'هذه الجولة انتهت، أنشئ غرفة جديدة',
  notMember: 'أنت لست عضوًا في هذه الغرفة، انضم بالكود أولًا',
  notHost: 'منشئ الغرفة فقط يستطيع بدء الجولة',
  notRacing: 'الجولة لم تبدأ بعد أو انتهت',
  alreadyRacing: 'الجولة بدأت بالفعل',
  notFinished: 'الجولة الحالية لم تنته بعد',
  roomFull: 'الغرفة مكتملة (8 لاعبين)',
  badInput: 'البيانات المرسلة غير صحيحة',
  badDifficulty: 'مستوى الصعوبة غير معروف',
  badText: 'النص المطلوب غير موجود',
  badPool: 'الفئة أو نوع النص غير معروف',
  usernameTaken: 'اسم المستخدم محجوز، اختر اسمًا آخر',
  badLogin: 'اسم المستخدم أو كلمة المرور غير صحيحة',
  badUsername: 'اسم المستخدم من 3 إلى 20 حرفًا لاتينيًا أو رقمًا أو _',
  badDisplayName: 'الاسم الظاهر من 2 إلى 24 حرفًا',
  badPassword: 'كلمة المرور 6 أحرف على الأقل',
  suspicious: 'النتيجة غير منطقية ولم تُحفظ',
  roundUsed: 'هذه الجولة سُجلت نتيجتها من قبل',
  roundNotFound: 'الجولة غير موجودة',
  tooMany: 'طلبات كثيرة، استنى شوية وجرب تاني',
};

const ACTIVE_MS = 8000;              // اللاعب غير نشط بعد 8 ثوانٍ بلا تحديث
const HOST_HANDOFF_MS = 20000;       // نقل الملكية إذا غاب المنشئ قبل البدء
const ROUND_GRACE_MS = 10000;        // مهلة إضافية قبل إنهاء الغرفة تلقائيًا
const CLOCK_TOLERANCE_MS = 1500;     // فرق مسموح بين زمن الواجهة والخادم
const RESULTS_PER_MINUTE = 8;
const MAX_PLAYERS = 8;

const fail = (status, code) => { throw new ApiError(status, code, MESSAGES[code]); };

function requireUser(ctx) {
  if (!ctx.user) fail(401, 'unauthorized');
  return ctx.user;
}

function requireDifficulty(d) {
  if (!isDifficulty(d)) fail(400, 'badDifficulty');
  return d;
}

function requireText(textId) {
  const t = getText(textId);
  if (!t) fail(400, 'badText');
  return t;
}

function toInt(v, lo, hi) {
  const n = Number(v);
  if (!Number.isFinite(n)) fail(400, 'badInput');
  return clamp(Math.round(n), lo, hi);
}

function publicUser(u) {
  return u ? { id: u.id, username: u.username, displayName: u.displayName } : null;
}

const textLength = (t) => [...t.text].length;

/** أقصر زمن ممكن منطقيًا لكتابة النص. */
function minPlausibleMs(len) {
  return ((len / 5) / MAX_WPM) * 60000;
}

/** يتحقق من زمن الإكمال ويحسب WPM على الخادم بدل الاعتماد على الواجهة. */
function verifyFinish({ text, clientElapsedMs, serverElapsedMs }) {
  const len = textLength(text);
  const elapsed = Number(clientElapsedMs);
  if (!Number.isFinite(elapsed) || elapsed <= 0) fail(400, 'badInput');
  if (elapsed < minPlausibleMs(len)) fail(422, 'suspicious');
  if (elapsed > serverElapsedMs + CLOCK_TOLERANCE_MS) fail(422, 'suspicious');
  return clamp(computeWpm(len, elapsed), 0, MAX_WPM);
}

function checkRateLimit(db, userId, now) {
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM game_results WHERE userId = ? AND completedAt > ?')
    .get(userId, now - 60000);
  if (n >= RESULTS_PER_MINUTE) fail(429, 'tooMany');
}

function insertResult(db, { user, difficulty, text, wpm, accuracy, roomId = null, now }) {
  db.prepare(`INSERT INTO game_results (userId, displayName, difficulty, textId, category, kind, wpm, accuracy, roomId, completedAt)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(user.id, user.displayName, difficulty, text.id, text.category, text.kind,
      clamp(wpm, 0, 999), clamp(accuracy, 0, 100), roomId, now);
}

/** «الفئة:النوع» أو «mix:النوع». */
function parsePool(category, kind) {
  const cat = category ?? MIX;
  if ((cat !== MIX && !isCategory(cat)) || !isKind(kind)) fail(400, 'badPool');
  return `${cat}:${kind}`;
}

function textFromPool(pool) {
  const [cat, kind] = pool.split(':');
  return randomTextId(cat, kind);
}

// ───────────── الغرف ─────────────

function newRoomCode(db) {
  const exists = db.prepare('SELECT 1 FROM game_rooms WHERE code = ?');
  for (let attempt = 0; attempt < 50; attempt++) {
    let code = '';
    for (let i = 0; i < ROOM_CODE_LENGTH; i++) code += ROOM_CODE_ALPHABET[randomInt(ROOM_CODE_ALPHABET.length)];
    if (!exists.get(code)) return code;
  }
  throw new ApiError(500, 'internal', 'تعذر إنشاء كود للغرفة');
}

function loadRoom(db, rawCode) {
  const code = normalizeRoomCode(rawCode);
  if (!isValidRoomCode(code)) fail(404, 'roomNotFound');
  const room = db.prepare('SELECT * FROM game_rooms WHERE code = ?').get(code);
  if (!room) fail(404, 'roomNotFound');
  return room;
}

function loadMember(db, room, userId) {
  return db.prepare('SELECT * FROM room_players WHERE roomId = ? AND userId = ?').get(room.id, userId);
}

function requireMember(db, room, user) {
  const p = loadMember(db, room, user.id);
  if (!p) fail(403, 'notMember');
  return p;
}

function touch(db, room, userId, now) {
  db.prepare('UPDATE room_players SET lastSeenAt = ? WHERE roomId = ? AND userId = ?').run(now, room.id, userId);
}

const roomSeconds = (room) => roundSeconds(textLength(getText(room.textId)), room.difficulty);

/** صيانة كسولة: إنهاء الجولة المنتهية ونقل ملكية الغرفة إن غاب منشئها. */
function maintainRoom(db, room, now) {
  const players = db.prepare('SELECT * FROM room_players WHERE roomId = ? ORDER BY joinedAt, userId').all(room.id);
  if (room.status === 'racing') {
    const limit = room.startedAt + roomSeconds(room) * 1000 + ROUND_GRACE_MS;
    const allDone = players.length > 0 && players.every((p) => p.finishedAt != null);
    if (allDone || now > limit) {
      db.prepare("UPDATE game_rooms SET status = 'finished', finishedAt = ? WHERE id = ?").run(now, room.id);
      room.status = 'finished';
      room.finishedAt = now;
    }
  }
  if (room.status !== 'racing') {
    const host = players.find((p) => p.userId === room.createdBy);
    if (!host || now - host.lastSeenAt > HOST_HANDOFF_MS) {
      const heir = players.find((p) => p.userId !== room.createdBy && now - p.lastSeenAt <= ACTIVE_MS);
      if (heir) {
        db.prepare('UPDATE game_rooms SET createdBy = ? WHERE id = ?').run(heir.userId, room.id);
        room.createdBy = heir.userId;
      }
    }
  }
  return players;
}

function roomView(db, room, user, now) {
  const players = maintainRoom(db, room, now);
  const finishers = players.filter((p) => p.finishedAt != null).sort((a, b) => a.finishedAt - b.finishedAt);
  const [poolCat, kind] = room.pool.split(':');
  return {
    room: {
      code: room.code,
      difficulty: room.difficulty,
      pool: poolCat,
      kind,
      textId: room.textId,
      round: room.round,
      status: room.status,
      isHost: room.createdBy === user.id,
      startedAt: room.startedAt,
      finishedAt: room.finishedAt,
      seconds: roomSeconds(room),
    },
    serverNow: now,
    players: players.map((p) => ({
      userId: p.userId,
      displayName: p.displayName,
      progress: p.progress,
      wpm: p.wpm,
      accuracy: p.accuracy,
      isHost: p.userId === room.createdBy,
      isMe: p.userId === user.id,
      active: now - p.lastSeenAt <= ACTIVE_MS,
      finished: p.finishedAt != null,
      place: p.finishedAt != null ? finishers.indexOf(p) + 1 : null,
    })),
  };
}

function addPlayer(db, room, user, now) {
  db.prepare(`INSERT INTO room_players (roomId, userId, displayName, joinedAt, lastSeenAt)
              VALUES (?, ?, ?, ?, ?)
              ON CONFLICT (roomId, userId) DO UPDATE SET lastSeenAt = excluded.lastSeenAt`)
    .run(room.id, user.id, user.displayName, now, now);
}

// ───────────── الإجراءات ─────────────

export function createHandlers({ db, presence }) {
  function login(ctx, user) {
    const session = createSession(db, user.id, ctx.now);
    ctx.setSession(session);
    return { user: publicUser(user), token: session.token };
  }

  return {
    // الحسابات
    'auth.me': (ctx) => ({ user: publicUser(ctx.user) }),

    'auth.register': (ctx) => {
      const username = String(ctx.body.username ?? '').trim();
      const displayName = String(ctx.body.displayName ?? '').trim().replace(/\s+/g, ' ');
      const password = String(ctx.body.password ?? '');
      if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) fail(400, 'badUsername');
      const dnLen = [...displayName].length;
      if (dnLen < 2 || dnLen > 24 || /[<>]/.test(displayName)) fail(400, 'badDisplayName');
      if (password.length < 6 || password.length > 200) fail(400, 'badPassword');
      if (db.prepare('SELECT 1 FROM users WHERE username = ?').get(username)) fail(409, 'usernameTaken');
      const { lastInsertRowid } = db.prepare(
        'INSERT INTO users (username, displayName, passwordHash, createdAt) VALUES (?, ?, ?, ?)',
      ).run(username, displayName, hashPassword(password), ctx.now);
      return login(ctx, { id: Number(lastInsertRowid), username, displayName });
    },

    'auth.login': (ctx) => {
      const username = String(ctx.body.username ?? '').trim();
      const password = String(ctx.body.password ?? '');
      const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
      if (!row || !verifyPassword(password, row.passwordHash)) fail(401, 'badLogin');
      return login(ctx, row);
    },

    'auth.logout': (ctx) => {
      deleteSession(db, ctx.sessionToken);
      ctx.clearSession();
      return { ok: true };
    },

    // الحضور: عدد اللاعبين الأونلاين
    'presence.ping': (ctx) => {
      const id = String(ctx.body.clientId ?? '').slice(0, 64);
      if (id) presence.set(id, ctx.now);
      for (const [k, t] of presence) if (ctx.now - t > 45000) presence.delete(k);
      return { online: Math.max(presence.size, 1) };
    },

    // الغرف
    'room.create': (ctx) => {
      const user = requireUser(ctx);
      const difficulty = requireDifficulty(ctx.body.difficulty ?? 'medium');
      const pool = parsePool(ctx.body.category, ctx.body.kind ?? 'short');
      return tx(db, () => {
        const code = newRoomCode(db);
        const { lastInsertRowid } = db.prepare(
          'INSERT INTO game_rooms (code, difficulty, pool, textId, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
        ).run(code, difficulty, pool, textFromPool(pool), user.id, ctx.now);
        const room = db.prepare('SELECT * FROM game_rooms WHERE id = ?').get(lastInsertRowid);
        addPlayer(db, room, user, ctx.now);
        return roomView(db, room, user, ctx.now);
      });
    },

    'room.join': (ctx) => {
      const user = requireUser(ctx);
      return tx(db, () => {
        const room = loadRoom(db, ctx.body.code);
        maintainRoom(db, room, ctx.now);
        const existing = loadMember(db, room, user.id);
        if (room.status === 'finished' && !existing) fail(410, 'roomFinished');
        if (!existing) {
          const { n } = db.prepare('SELECT COUNT(*) AS n FROM room_players WHERE roomId = ?').get(room.id);
          if (n >= MAX_PLAYERS) fail(409, 'roomFull');
        }
        addPlayer(db, room, user, ctx.now);
        return roomView(db, room, user, ctx.now);
      });
    },

    'room.leave': (ctx) => {
      const user = requireUser(ctx);
      return tx(db, () => {
        const room = loadRoom(db, ctx.body.code);
        const me = loadMember(db, room, user.id);
        if (me && room.status !== 'racing') {
          db.prepare('DELETE FROM room_players WHERE roomId = ? AND userId = ?').run(room.id, user.id);
          if (room.createdBy === user.id) {
            const heir = db.prepare('SELECT userId FROM room_players WHERE roomId = ? ORDER BY joinedAt LIMIT 1').get(room.id);
            if (heir) db.prepare('UPDATE game_rooms SET createdBy = ? WHERE id = ?').run(heir.userId, room.id);
            else db.prepare("UPDATE game_rooms SET status = 'finished', finishedAt = ? WHERE id = ?").run(ctx.now, room.id);
          }
        }
        return { ok: true };
      });
    },

    'room.state': (ctx) => {
      const user = requireUser(ctx);
      return tx(db, () => {
        const room = loadRoom(db, ctx.body.code);
        requireMember(db, room, user);
        touch(db, room, user.id, ctx.now);
        return roomView(db, room, user, ctx.now);
      });
    },

    'room.start': (ctx) => {
      const user = requireUser(ctx);
      return tx(db, () => {
        const room = loadRoom(db, ctx.body.code);
        requireMember(db, room, user);
        maintainRoom(db, room, ctx.now);
        if (room.createdBy !== user.id) fail(403, 'notHost');
        if (room.status === 'finished') fail(410, 'roomFinished');
        if (room.status === 'racing') fail(409, 'alreadyRacing');
        // تبدأ الجولة بعد عد تنازلي موحّد لكل اللاعبين.
        const startedAt = ctx.now + COUNTDOWN_MS;
        db.prepare("UPDATE game_rooms SET status = 'racing', startedAt = ? WHERE id = ?").run(startedAt, room.id);
        db.prepare('UPDATE room_players SET progress = 0, wpm = 0, accuracy = 100, finishedAt = NULL WHERE roomId = ?').run(room.id);
        room.status = 'racing';
        room.startedAt = startedAt;
        touch(db, room, user.id, ctx.now);
        return roomView(db, room, user, ctx.now);
      });
    },

    /** جولة جديدة في نفس الغرفة بنص جديد من نفس الفئة (للمنشئ بعد نهاية الجولة). */
    'room.rematch': (ctx) => {
      const user = requireUser(ctx);
      return tx(db, () => {
        const room = loadRoom(db, ctx.body.code);
        requireMember(db, room, user);
        maintainRoom(db, room, ctx.now);
        if (room.createdBy !== user.id) fail(403, 'notHost');
        if (room.status !== 'finished') fail(409, 'notFinished');
        let textId = textFromPool(room.pool);
        for (let i = 0; i < 5 && textId === room.textId; i++) textId = textFromPool(room.pool);
        db.prepare("UPDATE game_rooms SET status = 'waiting', textId = ?, round = round + 1, startedAt = NULL, finishedAt = NULL WHERE id = ?")
          .run(textId, room.id);
        db.prepare('UPDATE room_players SET progress = 0, wpm = 0, accuracy = 100, finishedAt = NULL WHERE roomId = ?').run(room.id);
        Object.assign(room, { status: 'waiting', textId, round: room.round + 1, startedAt: null, finishedAt: null });
        touch(db, room, user.id, ctx.now);
        return roomView(db, room, user, ctx.now);
      });
    },

    'room.progress': (ctx) => {
      const user = requireUser(ctx);
      return tx(db, () => {
        const room = loadRoom(db, ctx.body.code);
        const me = requireMember(db, room, user);
        maintainRoom(db, room, ctx.now);
        if (room.status === 'racing' && me.finishedAt == null && ctx.now >= room.startedAt) {
          const progress = toInt(ctx.body.progress, 0, 99);
          const accuracy = toInt(ctx.body.accuracy ?? 100, 0, 100);
          // حد أعلى للسرعة بناءً على زمن الخادم منذ بدء الجولة.
          const len = textLength(getText(room.textId));
          const serverCap = computeWpm((progress / 100) * len, Math.max(ctx.now - room.startedAt, 1000) - CLOCK_TOLERANCE_MS);
          const wpm = Math.min(toInt(ctx.body.wpm ?? 0, 0, MAX_WPM), Math.max(serverCap, 0) || MAX_WPM);
          db.prepare('UPDATE room_players SET progress = ?, wpm = ?, accuracy = ?, lastSeenAt = ? WHERE roomId = ? AND userId = ?')
            .run(progress, wpm, accuracy, ctx.now, room.id, user.id);
        } else {
          touch(db, room, user.id, ctx.now);
        }
        return roomView(db, room, user, ctx.now);
      });
    },

    'room.finish': (ctx) => {
      const user = requireUser(ctx);
      return tx(db, () => {
        const room = loadRoom(db, ctx.body.code);
        const me = requireMember(db, room, user);
        if (me.finishedAt != null) return { ...roomView(db, room, user, ctx.now), saved: false, already: true };
        if (room.status !== 'racing' || (ctx.body.round != null && Number(ctx.body.round) !== room.round)) fail(409, 'notRacing');
        const text = getText(room.textId);
        const wpm = verifyFinish({ text, clientElapsedMs: ctx.body.elapsedMs, serverElapsedMs: ctx.now - room.startedAt });
        const accuracy = toInt(ctx.body.accuracy ?? 100, 0, 100);
        db.prepare('UPDATE room_players SET progress = 100, wpm = ?, accuracy = ?, finishedAt = ?, lastSeenAt = ? WHERE roomId = ? AND userId = ?')
          .run(wpm, accuracy, ctx.now, ctx.now, room.id, user.id);
        checkRateLimit(db, user.id, ctx.now);
        insertResult(db, { user, difficulty: room.difficulty, text, wpm, accuracy, roomId: room.id, now: ctx.now });
        return { ...roomView(db, room, user, ctx.now), saved: true, wpm, accuracy };
      });
    },

    // الجولات الفردية لحسابات مسجلة
    'round.start': (ctx) => {
      const user = requireUser(ctx);
      const difficulty = requireDifficulty(ctx.body.difficulty ?? 'medium');
      const text = requireText(ctx.body.textId);
      const id = randomBytes(12).toString('base64url');
      db.prepare('DELETE FROM solo_rounds WHERE startedAt < ?').run(ctx.now - 3 * 3600_000);
      db.prepare('INSERT INTO solo_rounds (id, userId, difficulty, textId, startedAt) VALUES (?, ?, ?, ?, ?)')
        .run(id, user.id, difficulty, text.id, ctx.now);
      return { roundId: id, serverNow: ctx.now };
    },

    'round.finish': (ctx) => {
      const user = requireUser(ctx);
      return tx(db, () => {
        const round = db.prepare('SELECT * FROM solo_rounds WHERE id = ? AND userId = ?').get(String(ctx.body.roundId ?? ''), user.id);
        if (!round) fail(404, 'roundNotFound');
        if (round.usedAt != null) fail(409, 'roundUsed');
        const text = getText(round.textId);
        const limitMs = roundSeconds(textLength(text), round.difficulty) * 1000;
        const wpm = verifyFinish({
          text,
          clientElapsedMs: Math.min(Number(ctx.body.elapsedMs), limitMs + CLOCK_TOLERANCE_MS),
          serverElapsedMs: ctx.now - round.startedAt,
        });
        const accuracy = toInt(ctx.body.accuracy ?? 100, 0, 100);
        checkRateLimit(db, user.id, ctx.now);
        db.prepare('UPDATE solo_rounds SET usedAt = ? WHERE id = ?').run(ctx.now, round.id);
        insertResult(db, { user, difficulty: round.difficulty, text, wpm, accuracy, now: ctx.now });
        return { saved: true, wpm, accuracy };
      });
    },

    // لوحة الترتيب: أفضل نتيجة لكل لاعب هذا الأسبوع، أعلى عشر، مع فلتر نوع النص
    'leaderboard.weekly': (ctx) => {
      const since = weekStartUTC(new Date(ctx.now)).getTime();
      const f = ctx.body.kind;
      const kind = f && f !== 'all' ? (isKind(f) ? f : fail(400, 'badPool')) : null;
      const rows = db.prepare(`
        WITH ranked AS (
          SELECT r.*, ROW_NUMBER() OVER (
            PARTITION BY r.userId ORDER BY r.wpm DESC, r.accuracy DESC, r.completedAt ASC, r.id ASC
          ) AS rn
          FROM game_results r
          WHERE r.completedAt >= ? AND (? IS NULL OR r.kind = ?)
        )
        SELECT userId, displayName, wpm, accuracy, difficulty, category, kind, completedAt FROM ranked
        WHERE rn = 1
        ORDER BY wpm DESC, accuracy DESC, completedAt ASC
        LIMIT 10`).all(since, kind, kind);
      return {
        weekStart: since,
        results: rows.map((r, i) => ({ rank: i + 1, ...r, isMe: ctx.user ? r.userId === ctx.user.id : false })),
      };
    },
  };
}
