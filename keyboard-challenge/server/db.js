// قاعدة البيانات: SQLite المدمجة في Node (node:sqlite) — بلا اعتماديات خارجية.
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const SCHEMA = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE COLLATE NOCASE,
  displayName   TEXT NOT NULL,
  passwordHash  TEXT NOT NULL,
  createdAt     INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  tokenHash  TEXT PRIMARY KEY,
  userId     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  createdAt  INTEGER NOT NULL,
  expiresAt  INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS game_rooms (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  code         TEXT NOT NULL UNIQUE,
  difficulty   TEXT NOT NULL,
  pool         TEXT NOT NULL,
  textId       TEXT NOT NULL,
  round        INTEGER NOT NULL DEFAULT 1,
  status       TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting','racing','finished')),
  createdBy    INTEGER NOT NULL REFERENCES users(id),
  createdAt    INTEGER NOT NULL,
  startedAt    INTEGER,
  finishedAt   INTEGER
);

CREATE TABLE IF NOT EXISTS room_players (
  roomId       INTEGER NOT NULL REFERENCES game_rooms(id) ON DELETE CASCADE,
  userId       INTEGER NOT NULL REFERENCES users(id),
  displayName  TEXT NOT NULL,
  progress     INTEGER NOT NULL DEFAULT 0,
  wpm          INTEGER NOT NULL DEFAULT 0,
  accuracy     INTEGER NOT NULL DEFAULT 100,
  joinedAt     INTEGER NOT NULL,
  lastSeenAt   INTEGER NOT NULL,
  finishedAt   INTEGER,
  PRIMARY KEY (roomId, userId)
);

-- جولات فردية يبدأها الخادم حتى يتحقق من زمن النتيجة.
CREATE TABLE IF NOT EXISTS solo_rounds (
  id           TEXT PRIMARY KEY,
  userId       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  difficulty   TEXT NOT NULL,
  textId       TEXT NOT NULL,
  startedAt    INTEGER NOT NULL,
  usedAt       INTEGER
);

CREATE TABLE IF NOT EXISTS game_results (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  userId       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  displayName  TEXT NOT NULL,
  difficulty   TEXT NOT NULL,
  textId       TEXT NOT NULL,
  category     TEXT NOT NULL,
  kind         TEXT NOT NULL,
  wpm          INTEGER NOT NULL CHECK (wpm BETWEEN 0 AND 999),
  accuracy     INTEGER NOT NULL CHECK (accuracy BETWEEN 0 AND 100),
  roomId       INTEGER REFERENCES game_rooms(id) ON DELETE SET NULL,
  completedAt  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_results_week ON game_results (completedAt, kind);
CREATE INDEX IF NOT EXISTS idx_results_user ON game_results (userId, completedAt);
CREATE INDEX IF NOT EXISTS idx_sessions_exp ON sessions (expiresAt);
`;

const SCHEMA_VERSION = 2;

/** الإصدار 2 يربط الجولات بمعرّف النص بدل رقم الجملة: تُعاد جداول اللعب وتبقى الحسابات. */
function migrate(db) {
  const { user_version: v } = db.prepare('PRAGMA user_version').get();
  const hasRooms = db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'game_rooms'").get();
  if (hasRooms && v < 2) {
    db.exec('DROP TABLE IF EXISTS room_players; DROP TABLE IF EXISTS game_results; DROP TABLE IF EXISTS solo_rounds; DROP TABLE IF EXISTS game_rooms;');
  }
}

export function openDatabase(path = ':memory:') {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  if (path !== ':memory:') db.exec('PRAGMA journal_mode = WAL;');
  migrate(db);
  db.exec(SCHEMA);
  db.exec(`PRAGMA user_version = ${SCHEMA_VERSION}`);
  return db;
}

/** تنفيذ دالة داخل معاملة واحدة. */
export function tx(db, fn) {
  db.exec('BEGIN IMMEDIATE');
  try {
    const out = fn();
    db.exec('COMMIT');
    return out;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
}
