// تحدي الـ Keyboard مع أبو جنان — منطق الواجهة
import {
  DIFFICULTIES, DEFAULT_DIFFICULTY, SYNC_INTERVAL_MS, TypingTracker, getPhrase, pickPhraseIndex,
  computeWpm, trackPosition, botCharsPerSecond, clamp, normalizeRoomCode, isValidRoomCode, weekStartUTC,
} from './shared/game.js';
import { sfx, unlockAudio, isSoundOn, setSound } from './audio.js';
import { buildKeyboard, highlightNext, flashKey } from './keyboard.js';

const $ = (id) => document.getElementById(id);
const el = {
  online: $('online'), onlineCount: $('onlineCount'), soundBtn: $('soundBtn'), soundIcon: $('soundIcon'), menuBtn: $('menuBtn'),
  roundName: $('roundName'), levels: $('levels'), levelHint: $('levelHint'), startBtn: $('startBtn'),
  lanes: $('lanes'), trackCaption: $('trackCaption'),
  timer: $('timer'), wpm: $('wpm'), accuracy: $('accuracy'), currentChar: $('currentChar'),
  phrase: $('phrase'), timebar: $('timebar'), input: $('input'), statusLine: $('statusLine'), vkb: $('vkb'), kbDetails: $('kbDetails'),
  syncStatus: $('syncStatus'), roomLobby: $('roomLobby'), roomPanel: $('roomPanel'), roomAuthNote: $('roomAuthNote'),
  createRoomBtn: $('createRoomBtn'), joinForm: $('joinForm'), joinCode: $('joinCode'),
  roomCode: $('roomCode'), copyCodeBtn: $('copyCodeBtn'), copyLinkBtn: $('copyLinkBtn'), roomLevel: $('roomLevel'), roomStatus: $('roomStatus'),
  players: $('players'), roomStartBtn: $('roomStartBtn'), leaveRoomBtn: $('leaveRoomBtn'),
  boardFilter: $('boardFilter'), boardBody: $('boardBody'), boardEmpty: $('boardEmpty'), boardWeek: $('boardWeek'),
  resultDialog: $('resultDialog'), resultTitle: $('resultTitle'), resultSub: $('resultSub'),
  resWpm: $('resWpm'), resAcc: $('resAcc'), resTime: $('resTime'), resPlace: $('resPlace'), resSave: $('resSave'),
  againBtn: $('againBtn'), levelBtn: $('levelBtn'), resLoginBtn: $('resLoginBtn'),
  authDialog: $('authDialog'), tabLogin: $('tabLogin'), tabRegister: $('tabRegister'),
  loginForm: $('loginForm'), registerForm: $('registerForm'), authError: $('authError'),
  menuDialog: $('menuDialog'), menuAccount: $('menuAccount'), toast: $('toast'),
};

const ROUND_NAMES = { easy: 'جولة المقرن', medium: 'جولة شارع النيل', rocket: 'جولة كبري توتي' };
const BOTS = [
  { id: 'bot1', name: 'ود البلد', color: '#5BD6A7' },
  { id: 'bot2', name: 'بت النيل', color: '#E58A74' },
  { id: 'bot3', name: 'حاج السرعة', color: '#8CC4EE' },
];
const PLAYER_COLORS = ['#EFC477', '#5BD6A7', '#E58A74', '#8CC4EE', '#C9A7F2', '#F2A7C8', '#A7E0F2', '#F2D7A7'];

// ───────────── الحالة ─────────────
const S = {
  user: null,
  serverUp: false,
  difficulty: DEFAULT_DIFFICULTY,
  phraseIndex: 0,
  tracker: null,
  // idle | running | finished | timeout | waiting (في انتظار بدء الغرفة)
  status: 'idle',
  startPerf: 0,
  elapsed: 0,
  bots: [],
  roundReq: null,
  room: null,          // { code, view }
  pendingFinish: null, // نتيجة غرفة لم تصل للخادم بعد
  pollTimer: 0,
  syncDown: false,
  lastResult: null,
};

let clientId = '';
try {
  clientId = sessionStorage.getItem('kb-client') || '';
  if (!clientId) { clientId = crypto.randomUUID(); sessionStorage.setItem('kb-client', clientId); }
} catch { clientId = Math.random().toString(36).slice(2); }

// ───────────── الاتصال بالخادم ─────────────
class ApiFailure extends Error {
  constructor(message, { status = 0, code = 'offline', offline = false } = {}) {
    super(message);
    this.status = status; this.code = code; this.offline = offline;
  }
}

async function api(name, body = {}) {
  let res;
  try {
    res = await fetch(`./api/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiFailure('الخادم غير متاح حاليًا', { offline: true });
  }
  let data = null;
  try { data = await res.json(); } catch { /* ليس JSON: غالبًا استضافة ثابتة بلا خادم */ }
  if (!res.ok || !data) {
    if (!data?.error) throw new ApiFailure('الخادم غير متاح حاليًا', { status: res.status, offline: true });
    throw new ApiFailure(data.error.message, { status: res.status, code: data.error.code });
  }
  return data;
}

// ───────────── أدوات عامة ─────────────
let toastTimer = 0;
function toast(msg, warn = false) {
  el.toast.textContent = msg;
  el.toast.classList.toggle('warn', warn);
  el.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('show'), 3200);
}

function setStatus(msg, kind = '') {
  el.statusLine.textContent = msg;
  el.statusLine.className = `status-line ${kind}`.trim();
}

function fmtSeconds(ms) {
  return (Math.max(0, ms) / 1000).toFixed(1);
}

const rtf = typeof Intl !== 'undefined' && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat('ar', { numeric: 'auto' }) : null;
function relTime(ts) {
  const diff = (ts - Date.now()) / 1000;
  const abs = Math.abs(diff);
  if (!rtf) return new Date(ts).toLocaleString('ar');
  if (abs < 60) return rtf.format(Math.round(diff), 'second');
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  return rtf.format(Math.round(diff / 86400), 'day');
}

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

/** الأصول الفنية: عند فشل التحميل يظهر بديل نصي ولا تتوقف اللعبة. */
function watchAsset(img) {
  const wrap = img.closest('.asset');
  const broken = () => wrap?.classList.add('broken');
  img.addEventListener('error', broken, { once: true });
  if (img.complete && img.naturalWidth === 0) broken();
}

function confetti() {
  if (prefersReducedMotion()) return;
  const box = document.createElement('div');
  box.className = 'confetti';
  const colors = ['#EFC477', '#5BD6A7', '#D9634D', '#8CC4EE', '#F6EEDC'];
  for (let i = 0; i < 46; i++) {
    const c = document.createElement('i');
    c.style.left = `${Math.random() * 100}%`;
    c.style.background = colors[i % colors.length];
    c.style.setProperty('--d', `${1.3 + Math.random() * 1.3}s`);
    c.style.setProperty('--dx', `${(Math.random() - 0.5) * 220}px`);
    c.style.setProperty('--r', `${360 + Math.random() * 720}deg`);
    c.style.animationDelay = `${Math.random() * 0.35}s`;
    box.append(c);
  }
  document.body.append(box);
  setTimeout(() => box.remove(), 3200);
}

// ───────────── المضمار ─────────────
const SVG_NS = 'http://www.w3.org/2000/svg';

function botSvg(color) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 64 64');
  svg.setAttribute('class', 'bot-svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = `
    <g class="leg-b"><path d="M32 46 L27 61" stroke="#4A2C1A" stroke-width="5" stroke-linecap="round"/></g>
    <g class="leg-a"><path d="M32 46 L38 61" stroke="#5B3822" stroke-width="5" stroke-linecap="round"/></g>
    <path d="M21 23 Q32 18 43 23 L47 52 Q32 56 17 52 Z" fill="#F3E4C6"/>
    <path d="M17 48 Q32 53 47 48 L47 52 Q32 56 17 52 Z" fill="${color}"/>
    <path d="M24 23 L28 40 L36 40 L40 23 Q32 20 24 23 Z" fill="${color}" opacity="0.9"/>
    <path d="M26 28 L13 35" stroke="#8A5A3C" stroke-width="5" stroke-linecap="round"/>
    <rect x="5" y="31" width="14" height="8" rx="2" fill="#16273A" stroke="#EFC477" stroke-width="1.5"/>
    <circle cx="30" cy="13" r="9" fill="#8A5A3C"/>
    <path d="M21.5 11 Q30 1 38.5 11 Z" fill="#FFFFFF"/>
    <rect x="23" y="12" width="6" height="3.5" rx="1" fill="none" stroke="#111" stroke-width="1.3"/>
  `;
  return svg;
}

function runnerFigure(isMe, color) {
  const body = document.createElement('div');
  body.className = 'runner-body';
  if (isMe) {
    const img = document.createElement('img');
    img.src = 'assets/abu-jinan-runner.webp';
    img.alt = '';
    img.width = 36; img.height = 58;
    img.addEventListener('error', () => img.replaceWith(botSvg('#EFC477')), { once: true });
    body.append(img);
  } else {
    body.append(botSvg(color));
  }
  return body;
}

const laneNodes = new Map(); // id → { li, runner, pct }

function currentRacers() {
  const me = S.tracker ? S.tracker.progress : 0;
  const moving = S.status === 'running';
  if (S.room) {
    const players = S.room.view?.players ?? [];
    return players.map((p, i) => ({
      id: `u${p.userId}`,
      name: p.isMe ? `${p.displayName} (أنت)` : p.displayName,
      progress: p.isMe ? (p.finished ? 1 : me) : p.progress / 100,
      isMe: p.isMe,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length],
      moving: moving && !p.finished && p.active,
      inactive: !p.active,
      done: p.finished || (p.isMe && S.status === 'finished'),
    }));
  }
  return [
    { id: 'me', name: S.user ? `${S.user.displayName} (أنت)` : 'أبو جنان (أنت)', progress: me, isMe: true, moving, done: S.status === 'finished' },
    ...S.bots.map((b) => ({
      id: b.id, name: b.name, color: b.color, progress: b.progress,
      moving: moving && b.progress < 1 && !b.paused, done: b.progress >= 1,
    })),
  ];
}

function renderLanes() {
  const racers = currentRacers();
  const seen = new Set();
  el.lanes.classList.toggle('compact', racers.length > 4);
  racers.forEach((r, i) => {
    seen.add(r.id);
    let node = laneNodes.get(r.id);
    if (!node) {
      const li = document.createElement('li');
      li.className = 'lane';
      const inner = document.createElement('div');
      inner.className = 'lane-inner';
      const runner = document.createElement('div');
      runner.className = 'runner';
      const tag = document.createElement('span');
      tag.className = 'runner-tag';
      const name = document.createElement('span');
      const pct = document.createElement('b');
      tag.append(name, pct);
      const shadow = document.createElement('div');
      shadow.className = 'runner-shadow';
      runner.append(tag, runnerFigure(r.isMe, r.color), shadow);
      inner.append(runner);
      li.append(inner);
      node = { li, runner, name, pct, isMe: r.isMe };
      laneNodes.set(r.id, node);
    }
    if (el.lanes.children[i] !== node.li) el.lanes.insertBefore(node.li, el.lanes.children[i] ?? null);
    node.name.textContent = r.name;
    node.pct.textContent = `${Math.round(r.progress * 100)}%`;
    node.runner.style.setProperty('--x', trackPosition(r.progress).toFixed(4));
    node.runner.classList.toggle('me', !!r.isMe);
    node.runner.classList.toggle('moving', !!r.moving);
    node.runner.classList.toggle('done', !!r.done);
    node.runner.classList.toggle('inactive', !!r.inactive);
    node.li.setAttribute('aria-label', `${r.name}: ${Math.round(r.progress * 100)}%`);
  });
  for (const [id, node] of laneNodes) {
    if (!seen.has(id)) { node.li.remove(); laneNodes.delete(id); }
  }
}

// ───────────── الجملة والكتابة ─────────────
let phraseSpans = [];

function renderPhrase() {
  el.phrase.textContent = '';
  el.phrase.classList.remove('placeholder');
  phraseSpans = S.tracker.chars.map((ch) => {
    const s = document.createElement('span');
    s.className = ch === ' ' ? 'ch space' : 'ch';
    s.textContent = ch;
    el.phrase.append(s);
    return s;
  });
  el.phrase.setAttribute('aria-label', `الجملة: ${S.tracker.phrase}`);
}

function renderTyping() {
  const t = S.tracker;
  const states = t.states();
  states.forEach((st, i) => {
    const s = phraseSpans[i];
    const base = s.classList.contains('space') ? 'ch space' : 'ch';
    const cls = st === 'pending' ? base : `${base} ${st}`;
    if (s.className !== cls) s.className = cls;
  });
  const hasError = t.prefix < [...t.value].length;
  el.input.classList.toggle('has-error', hasError);
  const typing = S.status === 'idle' || S.status === 'running';
  let next = null;
  if (typing) next = hasError ? '\b' : t.chars[[...t.value].length] ?? null;
  el.currentChar.textContent = next == null ? '—' : next === '\b' ? '⌫' : next === ' ' ? 'مسافة' : next;
  highlightNext(next, kb.shiftEls);
  el.accuracy.textContent = `${t.accuracy}%`;
  el.accuracy.classList.toggle('low', t.accuracy < 85);
}

function roundSeconds() {
  return S.room?.view ? S.room.view.room.seconds : DIFFICULTIES[S.difficulty].seconds;
}

function renderClock() {
  const total = roundSeconds() * 1000;
  const left = S.status === 'running' ? total - S.elapsed : S.status === 'idle' || S.status === 'waiting' ? total : total - S.elapsed;
  el.timer.textContent = Math.ceil(Math.max(0, left) / 1000);
  el.timer.classList.toggle('low', S.status === 'running' && left < 10000);
  el.timebar.style.transform = `scaleX(${clamp(left / total, 0, 1)})`;
  el.wpm.textContent = S.tracker ? S.tracker.wpm(S.elapsed) : 0;
}

function renderControls() {
  const inRoom = !!S.room;
  const running = S.status === 'running';
  el.startBtn.hidden = inRoom;
  el.startBtn.textContent = running ? 'إيقاف الجولة' : S.status === 'idle' ? 'ابدأ الجولة' : 'جولة جديدة';
  el.startBtn.classList.toggle('is-stop', running);
  const canType = S.status === 'running' || (S.status === 'idle' && !inRoom);
  el.input.disabled = !canType;
  el.input.placeholder = S.status === 'waiting' ? 'في انتظار منشئ الغرفة يبدأ الجولة…'
    : S.status === 'timeout' ? 'انتهى الوقت — ابدأ جولة جديدة'
      : S.status === 'finished' ? 'أحسنت! ابدأ جولة جديدة'
        : 'اضغط هنا وابدأ الكتابة…';
  el.levels.classList.toggle('locked', inRoom);
  for (const r of el.levels.querySelectorAll('input')) {
    r.disabled = inRoom;
    r.checked = r.value === S.difficulty;
  }
  el.roundName.textContent = ROUND_NAMES[S.difficulty];
  const d = DIFFICULTIES[S.difficulty];
  el.levelHint.textContent = `${d.hint} · ${d.seconds} ثانية`;
  el.trackCaption.textContent = inRoom
    ? `غرفة ${S.room.code} · الاتجاه: من اليمين إلى اليسار ←`
    : 'الاتجاه: من اليمين إلى اليسار ← · المنافسون الآليون جاهزين';
}

function renderAll() {
  renderTyping();
  renderClock();
  renderControls();
  renderLanes();
}

/** تجهيز جولة جديدة (بدون تشغيل المؤقت). */
function prepareRound({ phraseIndex, keepPhrase = false } = {}) {
  cancelAnimationFrame(rafId);
  if (!keepPhrase) S.phraseIndex = phraseIndex ?? pickPhraseIndex(S.difficulty, S.phraseIndex);
  S.tracker = new TypingTracker(getPhrase(S.difficulty, S.phraseIndex));
  S.status = S.room && S.room.view?.room.status !== 'racing' ? 'waiting' : 'idle';
  S.elapsed = 0;
  S.roundReq = null;
  S.bots = BOTS.map((b) => ({ ...b, chars: 0, progress: 0, finishAt: null, paused: false, pauseLeft: 0 }));
  el.input.value = '';
  el.input.maxLength = S.tracker.chars.length;
  renderPhrase();
  setStatus(S.status === 'waiting' ? 'في انتظار بدء الجولة من منشئ الغرفة.' : 'جاهز؟ ابدأ الكتابة والمؤقت يشتغل مع أول حرف.');
  renderAll();
}

let rafId = 0;
let lastFrame = 0;

function startRound({ offsetMs = 0 } = {}) {
  if (S.status === 'running') return;
  unlockAudio();
  S.status = 'running';
  S.startPerf = performance.now() - offsetMs;
  S.elapsed = offsetMs;
  lastFrame = performance.now();
  const len = S.tracker.chars.length;
  S.bots.forEach((b) => {
    b.cps = botCharsPerSecond(S.difficulty);
    b.delay = 0.35 + Math.random() * 0.9;
    b.len = len;
  });
  if (!S.room && S.user && S.serverUp) {
    S.roundReq = api('round.start', { difficulty: S.difficulty, phraseIndex: S.phraseIndex }).catch(() => null);
  }
  sfx.start();
  setStatus('يلا! كل حرف صحيح بيقدّمك خطوة.');
  renderControls();
  rafId = requestAnimationFrame(frame);
}

function stepBots(dt) {
  const t = S.elapsed / 1000;
  for (const b of S.bots) {
    if (b.progress >= 1 || t < b.delay) continue;
    if (b.paused) {
      b.pauseLeft -= dt;
      if (b.pauseLeft <= 0) b.paused = false;
      continue;
    }
    // تذبذب بسيط في السرعة مع توقفات قصيرة تحاكي أخطاء الكتابة.
    if (Math.random() < dt * 0.35) { b.paused = true; b.pauseLeft = 0.25 + Math.random() * 0.5; continue; }
    b.chars += dt * b.cps * (0.8 + Math.random() * 0.4) * 1.08;
    b.progress = clamp(b.chars / b.len, 0, 1);
    if (b.progress >= 1 && b.finishAt == null) b.finishAt = S.elapsed;
  }
}

function frame(now) {
  if (S.status !== 'running') return;
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  lastFrame = now;
  S.elapsed = now - S.startPerf;
  if (!S.room) stepBots(dt);
  if (S.elapsed >= roundSeconds() * 1000) {
    S.elapsed = roundSeconds() * 1000;
    timeUp();
    return;
  }
  renderClock();
  renderLanes();
  rafId = requestAnimationFrame(frame);
}

function stopRound() {
  cancelAnimationFrame(rafId);
  prepareRound({ keepPhrase: true });
  setStatus('وقّفت الجولة. ابدأ تاني متى ما جهزت.');
}

function newRound() {
  prepareRound();
  el.input.focus({ preventScroll: true });
}

function timeUp() {
  cancelAnimationFrame(rafId);
  S.status = 'timeout';
  sfx.timeout();
  setStatus('انتهى الوقت! النتيجة ما بتتسجل إلا لو اكتملت الجملة.', 'warn');
  renderAll();
  showResult({ completed: false });
}

function finishRound() {
  cancelAnimationFrame(rafId);
  S.elapsed = performance.now() - S.startPerf;
  S.status = 'finished';
  const elapsedMs = Math.round(S.elapsed);
  const wpm = computeWpm(S.tracker.chars.length, elapsedMs);
  const accuracy = S.tracker.accuracy;
  let place = null;
  let total = null;
  if (!S.room) {
    total = S.bots.length + 1;
    place = 1 + S.bots.filter((b) => b.finishAt != null && b.finishAt <= elapsedMs).length;
  }
  S.lastResult = { wpm, accuracy, elapsedMs, place, total };
  setStatus('وصلت خط النهاية! 🎉', 'ok');
  renderAll();
  if (place === 1) { sfx.win(); confetti(); } else sfx.complete();
  showResult({ completed: true });
  if (S.room) {
    S.pendingFinish = { code: S.room.code, elapsedMs, accuracy };
    flushRoomFinish();
  } else {
    saveSolo(elapsedMs, accuracy);
  }
}

async function saveSolo(elapsedMs, accuracy) {
  if (!S.user) {
    setSaveLine('سجّل الدخول عشان نتيجتك تدخل ترتيب الأسبوع.', 'warn', true);
    return;
  }
  setSaveLine('جاري حفظ النتيجة…');
  const round = await S.roundReq;
  if (!round) { setSaveLine('تعذر الحفظ: الخادم غير متاح الآن. نتيجتك محفوظة في الشاشة فقط.', 'warn'); return; }
  try {
    const r = await api('round.finish', { roundId: round.roundId, elapsedMs, accuracy });
    setSaveLine(`✔ اتحفظت نتيجتك في ترتيب الأسبوع (${r.wpm} WPM).`, 'ok');
    loadBoard();
  } catch (err) {
    setSaveLine(`لم تُحفظ النتيجة: ${err.message}`, 'warn');
  }
}

function setSaveLine(msg, kind = '', showLogin = false) {
  el.resSave.textContent = msg;
  el.resSave.className = `save-line ${kind}`.trim();
  el.resLoginBtn.hidden = !showLogin;
}

function showResult({ completed }) {
  const r = completed ? S.lastResult : {
    wpm: S.tracker.wpm(S.elapsed), accuracy: S.tracker.accuracy, elapsedMs: S.elapsed, place: null, total: null,
  };
  el.resultTitle.textContent = completed ? (r.place === 1 ? 'أسرع زول في السباق! 🏆' : 'وصلت خط النهاية! 🎉') : 'انتهى الوقت ⏱️';
  el.resultSub.textContent = completed
    ? `«${S.tracker.phrase}»`
    : `كتبت ${Math.round(S.tracker.progress * 100)}% من الجملة. جرّب تاني وخليك مركز!`;
  el.resWpm.textContent = r.wpm;
  el.resAcc.textContent = `${r.accuracy}%`;
  el.resTime.textContent = `${fmtSeconds(r.elapsedMs)} ث`;
  el.resPlace.textContent = r.place ? `${r.place}/${r.total}` : '—';
  el.againBtn.textContent = S.room ? 'جولة فردية جديدة' : 'جولة جديدة';
  el.levelBtn.hidden = !!S.room;
  if (completed) setSaveLine(S.room ? 'جاري إرسال النتيجة للغرفة…' : '');
  else setSaveLine('النتيجة ما اتسجلت لأن الجملة ما اكتملت.', 'warn');
  if (!el.resultDialog.open) el.resultDialog.showModal();
}

function onInput() {
  if (!S.tracker) return;
  const canType = S.status === 'running' || (S.status === 'idle' && !S.room);
  if (!canType) { el.input.value = S.tracker.value; return; }
  if (S.status === 'idle') startRound();
  const events = S.tracker.update(el.input.value);
  if (el.input.value !== S.tracker.value) el.input.value = S.tracker.value;
  let bad = false;
  for (const ev of events) {
    flashKey(ev.ch, ev.ok);
    if (!ev.ok) bad = true;
  }
  if (events.length) {
    if (bad) {
      sfx.wrong();
      if (!prefersReducedMotion()) {
        el.input.classList.remove('shake');
        void el.input.offsetWidth;
        el.input.classList.add('shake');
      }
    } else sfx.correct();
  }
  renderTyping();
  renderLanes();
  if (S.tracker.done) finishRound();
}

// ───────────── الغرف ─────────────
function renderRoomCard() {
  const inRoom = !!S.room;
  el.roomLobby.hidden = inRoom;
  el.roomPanel.hidden = !inRoom;
  el.createRoomBtn.disabled = !S.serverUp;
  el.joinForm.querySelector('button').disabled = !S.serverUp;
  if (!inRoom) {
    if (!S.serverUp) {
      el.roomAuthNote.textContent = 'الغرف تحتاج اتصال بالخادم، وهو غير متاح الآن. اللعب الفردي شغال عادي.';
      setSync('فردي', '');
    } else if (!S.user) {
      el.roomAuthNote.textContent = 'اللعب الجماعي يحتاج تسجيل الدخول عشان نربط النتيجة بحسابك. سجّل الدخول ثم أنشئ غرفة أو انضم بكود.';
      setSync('فردي', '');
    } else {
      el.roomAuthNote.textContent = `أهلًا ${S.user.displayName}! أنشئ غرفة وأرسل الكود لأصحابك، أو انضم بكود صاحبك.`;
      setSync('فردي', '');
    }
    return;
  }
  const v = S.room.view;
  el.roomCode.textContent = S.room.code;
  const statusText = { waiting: 'في الانتظار', racing: 'السباق شغال', finished: 'انتهت الجولة' }[v.room.status];
  el.roomLevel.textContent = `المستوى: ${DIFFICULTIES[v.room.difficulty].label}`;
  el.roomStatus.textContent = `${statusText} · ${v.players.length} لاعب`;
  el.roomStartBtn.hidden = !(v.room.isHost && v.room.status === 'waiting');
  el.players.textContent = '';
  v.players.forEach((p, i) => {
    const li = document.createElement('li');
    li.className = `player${p.isMe ? ' me' : ''}`;
    const av = document.createElement('span');
    av.className = 'player-avatar';
    av.style.background = PLAYER_COLORS[i % PLAYER_COLORS.length];
    av.textContent = [...p.displayName][0] || '؟';
    const name = document.createElement('span');
    name.className = 'player-name';
    name.textContent = p.displayName;
    const badges = [];
    if (p.isHost) badges.push('👑 المنشئ');
    if (p.isMe) badges.push('أنت');
    if (!p.active) badges.push('غير نشط');
    if (p.place) badges.push(`المركز ${p.place}`);
    if (badges.length) {
      const sm = document.createElement('small');
      sm.textContent = badges.join(' · ');
      name.append(sm);
    }
    const stats = document.createElement('span');
    stats.className = 'player-stats';
    const progress = p.isMe && S.tracker && S.status === 'running' ? Math.round(S.tracker.progress * 100) : p.progress;
    const strong = document.createElement('strong');
    strong.textContent = `${progress}%`;
    stats.append(strong, document.createElement('br'), `${p.wpm} WPM · ${p.accuracy}%`);
    const bar = document.createElement('span');
    bar.className = 'player-bar';
    const fill = document.createElement('span');
    fill.style.width = `${progress}%`;
    bar.append(fill);
    li.append(av, name, stats, bar);
    el.players.append(li);
  });
}

function setSync(text, kind) {
  el.syncStatus.textContent = text;
  el.syncStatus.className = `sync ${kind}`.trim();
}

function setRoomUrl(code) {
  try {
    const url = new URL(location.href);
    if (code) url.searchParams.set('room', code); else url.searchParams.delete('room');
    history.replaceState(null, '', url);
  } catch { /* تجاهل */ }
}

function inviteLink(code) {
  const url = new URL(location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('room', code);
  return url.toString();
}

function enterRoom(view) {
  const first = !S.room || S.room.code !== view.room.code;
  S.room = { code: view.room.code, view };
  S.difficulty = view.room.difficulty;
  S.pendingFinish = null;
  if (el.resultDialog.open) el.resultDialog.close('room');
  prepareRound({ phraseIndex: view.room.phraseIndex });
  if (first) sfx.join();
  setRoomUrl(view.room.code);
  handleRoomView(view);
  schedulePoll(0);
}

function handleRoomView(view) {
  if (!S.room) return;
  S.room.view = view;
  const r = view.room;
  if (r.phraseIndex !== S.phraseIndex || r.difficulty !== S.difficulty) {
    S.difficulty = r.difficulty;
    prepareRound({ phraseIndex: r.phraseIndex });
  }
  const me = view.players.find((p) => p.isMe);
  if (r.status === 'racing' && (S.status === 'waiting' || S.status === 'idle') && !me?.finished) {
    // مزامنة بداية المؤقت مع وقت بدء الجولة على الخادم.
    const offset = clamp(view.serverNow - r.startedAt, 0, r.seconds * 1000);
    startRound({ offsetMs: offset });
    el.input.focus({ preventScroll: true });
    toast('بدأ السباق! 🏁');
  } else if (r.status === 'finished' && S.status === 'running') {
    timeUp();
  } else if (r.status === 'finished' && S.status === 'waiting') {
    S.status = 'timeout';
    setStatus('انتهت جولة هذه الغرفة. أنشئ غرفة جديدة للعب مرة ثانية.', 'warn');
  }
  if (me?.place && S.lastResult && S.status === 'finished') {
    S.lastResult.place = me.place;
    S.lastResult.total = view.players.length;
    el.resPlace.textContent = `${me.place}/${view.players.length}`;
  }
  renderRoomCard();
  renderControls();
  renderLanes();
}

async function flushRoomFinish() {
  const pf = S.pendingFinish;
  if (!pf || !S.room || S.room.code !== pf.code) return;
  try {
    const res = await api('room.finish', pf);
    S.pendingFinish = null;
    const me = res.players.find((p) => p.isMe);
    if (res.saved) {
      setSaveLine(`✔ اتحفظت نتيجتك (${res.wpm} WPM)${me?.place ? ` — المركز ${me.place}` : ''}.`, 'ok');
      if (me?.place === 1) { sfx.win(); confetti(); el.resultTitle.textContent = 'أسرع زول في السباق! 🏆'; }
    }
    handleRoomView(res);
    loadBoard();
  } catch (err) {
    if (err.offline) {
      setSaveLine('الخادم مقطوع مؤقتًا — حنعيد إرسال نتيجتك تلقائيًا.', 'warn');
    } else {
      S.pendingFinish = null;
      setSaveLine(`لم تُحفظ النتيجة: ${err.message}`, 'warn');
    }
  }
}

function schedulePoll(delay = SYNC_INTERVAL_MS) {
  clearTimeout(S.pollTimer);
  if (!S.room) return;
  S.pollTimer = setTimeout(pollRoom, delay);
}

async function pollRoom() {
  if (!S.room) return;
  const code = S.room.code;
  try {
    if (S.pendingFinish) await flushRoomFinish();
    let view;
    if (S.status === 'running') {
      const t = S.tracker;
      view = await api('room.progress', {
        code,
        progress: Math.min(99, Math.floor(t.progress * 100)),
        wpm: t.wpm(S.elapsed),
        accuracy: t.accuracy,
      });
    } else {
      view = await api('room.state', { code });
    }
    if (!S.room || S.room.code !== code) return;
    if (S.syncDown) toast('رجع الاتصال بالخادم ✔');
    S.syncDown = false;
    setSync('متزامن ●', 'live');
    handleRoomView(view);
  } catch (err) {
    if (!S.room || S.room.code !== code) return;
    if (err.offline) {
      S.syncDown = true;
      setSync('التزامن متوقف مؤقتًا', 'down');
      setStatus('التزامن مع الغرفة غير متاح مؤقتًا — كمّل كتابة، حنرسل تقدمك أول ما يرجع الاتصال.', 'warn');
    } else if (err.status === 401) {
      S.user = null;
      leaveRoom({ silent: true });
      toast(err.message, true);
      return;
    } else if (err.status === 403 || err.status === 404) {
      leaveRoom({ silent: true });
      toast(err.message, true);
      return;
    }
  }
  schedulePoll();
}

function leaveRoom({ silent = false } = {}) {
  if (!S.room) return;
  const code = S.room.code;
  clearTimeout(S.pollTimer);
  if (!silent) api('room.leave', { code }).catch(() => {});
  S.room = null;
  S.pendingFinish = null;
  setRoomUrl(null);
  laneNodes.forEach((n) => n.li.remove());
  laneNodes.clear();
  prepareRound();
  renderRoomCard();
}

async function createRoom() {
  unlockAudio();
  if (!S.user) { openAuth('login', 'سجّل الدخول أولًا عشان تنشئ غرفة.'); return; }
  el.createRoomBtn.disabled = true;
  try {
    const view = await api('room.create', { difficulty: S.difficulty });
    enterRoom(view);
    toast(`اتنشأت الغرفة ${view.room.code} — أرسل الكود لأصحابك`);
  } catch (err) {
    handleProtectedError(err);
  } finally {
    el.createRoomBtn.disabled = !S.serverUp;
  }
}

async function joinRoom(rawCode) {
  unlockAudio();
  const code = normalizeRoomCode(rawCode);
  if (!S.user) { openAuth('login', 'سجّل الدخول أولًا عشان تنضم للغرفة.'); S.pendingJoin = code; return; }
  if (!isValidRoomCode(code)) { toast('الغرفة غير موجودة، راجع الكود وجرب مرة ثانية', true); return; }
  try {
    const view = await api('room.join', { code });
    enterRoom(view);
    toast(`انضميت للغرفة ${code} 👋`);
  } catch (err) {
    handleProtectedError(err);
    setRoomUrl(null);
  }
}

async function startRoomRace() {
  if (!S.room) return;
  el.roomStartBtn.disabled = true;
  try {
    const view = await api('room.start', { code: S.room.code });
    handleRoomView(view);
  } catch (err) {
    handleProtectedError(err);
  } finally {
    el.roomStartBtn.disabled = false;
  }
}

function handleProtectedError(err) {
  if (err.status === 401) { S.user = null; renderAccount(); openAuth('login', err.message); return; }
  toast(err.message, true);
}

async function copyText(text, okMsg) {
  try {
    await navigator.clipboard.writeText(text);
    toast(okMsg);
  } catch {
    toast(`انسخ يدويًا: ${text}`);
  }
}

// ───────────── لوحة الترتيب ─────────────
async function loadBoard() {
  const filter = el.boardFilter.value;
  try {
    const data = await api('leaderboard.weekly', { difficulty: filter });
    el.boardBody.textContent = '';
    const ws = new Date(data.weekStart);
    el.boardWeek.textContent = `من الإثنين ${ws.toLocaleDateString('ar', { day: 'numeric', month: 'long', timeZone: 'UTC' })} · 00:00 UTC — أفضل نتيجة لكل لاعب`;
    for (const r of data.results) {
      const tr = document.createElement('tr');
      if (r.isMe) tr.className = 'me';
      const cells = [
        ['rank', r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : r.rank],
        ['name', r.displayName],
        ['', r.wpm],
        ['', `${r.accuracy}%`],
        ['', DIFFICULTIES[r.difficulty]?.label ?? r.difficulty],
        ['when', relTime(r.completedAt)],
      ];
      for (const [cls, val] of cells) {
        const td = document.createElement('td');
        if (cls) td.className = cls;
        td.textContent = String(val);
        tr.append(td);
      }
      el.boardBody.append(tr);
    }
    el.boardEmpty.hidden = data.results.length > 0;
    el.boardEmpty.textContent = 'ما في نتائج هذا الأسبوع لسه — كن أول واحد في اللوحة!';
  } catch (err) {
    el.boardBody.textContent = '';
    el.boardEmpty.hidden = false;
    el.boardEmpty.textContent = err.offline ? 'لوحة الترتيب غير متاحة: الخادم غير متصل.' : err.message;
    el.boardWeek.textContent = `الأسبوع يبدأ الإثنين ${weekStartUTC().toISOString().slice(0, 10)} · 00:00 UTC`;
  }
}

// ───────────── الحساب ─────────────
function renderAccount() {
  el.menuAccount.textContent = '';
  if (S.user) {
    const p = document.createElement('p');
    p.textContent = `مرحبًا، ${S.user.displayName} `;
    const u = document.createElement('span');
    u.className = 'muted';
    u.dir = 'ltr';
    u.textContent = `@${S.user.username}`;
    p.append(u);
    const out = document.createElement('button');
    out.type = 'button';
    out.className = 'btn btn-ghost';
    out.textContent = 'تسجيل الخروج';
    out.addEventListener('click', logout);
    el.menuAccount.append(p, out);
  } else {
    const p = document.createElement('p');
    p.textContent = S.serverUp
      ? 'سجّل الدخول عشان تلعب في الغرف وتدخل ترتيب الأسبوع.'
      : 'الخادم غير متاح الآن — اللعب الفردي شغال بدون حساب.';
    el.menuAccount.append(p);
    if (S.serverUp) {
      const row = document.createElement('div');
      row.className = 'room-actions';
      const login = document.createElement('button');
      login.type = 'button'; login.className = 'btn btn-primary'; login.textContent = 'تسجيل الدخول';
      login.addEventListener('click', () => { el.menuDialog.close(); openAuth('login'); });
      const reg = document.createElement('button');
      reg.type = 'button'; reg.className = 'btn btn-ghost'; reg.textContent = 'حساب جديد';
      reg.addEventListener('click', () => { el.menuDialog.close(); openAuth('register'); });
      row.append(login, reg);
      el.menuAccount.append(row);
    }
  }
  renderRoomCard();
}

function openAuth(tab = 'login', note = '') {
  if (!S.serverUp) { toast('الخادم غير متاح الآن، جرّب بعد شوية.', true); return; }
  selectTab(tab);
  el.authError.textContent = note;
  if (!el.authDialog.open) el.authDialog.showModal();
  (tab === 'login' ? el.loginForm : el.registerForm).querySelector('input')?.focus();
}

function selectTab(tab) {
  const login = tab === 'login';
  el.tabLogin.setAttribute('aria-selected', String(login));
  el.tabRegister.setAttribute('aria-selected', String(!login));
  el.loginForm.hidden = !login;
  el.registerForm.hidden = login;
}

async function submitAuth(form, action) {
  const fd = new FormData(form);
  const body = Object.fromEntries(fd.entries());
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true;
  el.authError.textContent = '';
  try {
    const { user } = await api(action, body);
    S.user = user;
    form.reset();
    el.authDialog.close();
    toast(`أهلًا ${user.displayName}! 👋`);
    renderAccount();
    renderLanes();
    loadBoard();
    if (S.pendingJoin) { const c = S.pendingJoin; S.pendingJoin = null; joinRoom(c); }
  } catch (err) {
    el.authError.textContent = err.message;
  } finally {
    btn.disabled = false;
  }
}

async function logout() {
  try { await api('auth.logout'); } catch { /* تجاهل */ }
  leaveRoom({ silent: true });
  S.user = null;
  el.menuDialog.close();
  renderAccount();
  renderLanes();
  loadBoard();
  toast('سجّلت الخروج. نشوفك قريب!');
}

async function refreshAuth() {
  try {
    const { user } = await api('auth.me');
    S.serverUp = true;
    S.user = user;
  } catch {
    S.serverUp = false;
    S.user = null;
  }
  renderAccount();
  renderLanes();
}

async function ping() {
  try {
    const { online } = await api('presence.ping', { clientId });
    el.onlineCount.textContent = online;
    el.online.classList.remove('offline');
    if (!S.serverUp) { await refreshAuth(); loadBoard(); }
  } catch {
    el.onlineCount.textContent = '—';
    el.online.classList.add('offline');
  }
}

// ───────────── الصوت ─────────────
function renderSound() {
  const on = isSoundOn();
  el.soundIcon.textContent = on ? '🔊' : '🔇';
  el.soundBtn.setAttribute('aria-pressed', String(on));
  el.soundBtn.setAttribute('aria-label', on ? 'كتم الصوت' : 'تشغيل الصوت');
}

// ───────────── الربط ─────────────
const kb = buildKeyboard(el.vkb, ({ ch, back }) => {
  if (el.input.disabled) return;
  el.input.value = back ? [...el.input.value].slice(0, -1).join('') : el.input.value + ch;
  onInput();
});

function bind() {
  document.querySelectorAll('.asset img').forEach(watchAsset);
  document.addEventListener('pointerdown', unlockAudio, { once: true, capture: true });
  document.addEventListener('keydown', unlockAudio, { once: true, capture: true });

  el.input.addEventListener('input', onInput);
  el.input.addEventListener('paste', (e) => { e.preventDefault(); toast('اللصق ممنوع — اكتبها بإيدك 😄', true); });
  el.input.addEventListener('drop', (e) => e.preventDefault());

  el.startBtn.addEventListener('click', () => {
    if (S.status === 'running') stopRound();
    else if (S.status === 'idle') { startRound(); el.input.focus({ preventScroll: true }); }
    else newRound();
  });

  el.levels.addEventListener('change', (e) => {
    if (S.room || !e.target.matches('input[name=level]')) return;
    S.difficulty = e.target.value;
    prepareRound({ phraseIndex: pickPhraseIndex(S.difficulty) });
  });

  document.addEventListener('keydown', (e) => {
    if (document.querySelector('dialog[open]')) return;
    if (e.key === 'Escape' && S.status === 'running' && !S.room) { stopRound(); }
    else if (e.key === 'Enter' && (S.status === 'finished' || S.status === 'timeout') && !S.room) { e.preventDefault(); newRound(); }
  });

  el.soundBtn.addEventListener('click', () => { setSound(!isSoundOn()); renderSound(); if (isSoundOn()) sfx.join(); });
  el.menuBtn.addEventListener('click', () => { renderAccount(); el.menuDialog.showModal(); });

  for (const d of [el.authDialog, el.menuDialog]) {
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  }
  el.tabLogin.addEventListener('click', () => selectTab('login'));
  el.tabRegister.addEventListener('click', () => selectTab('register'));
  el.loginForm.addEventListener('submit', (e) => { e.preventDefault(); submitAuth(el.loginForm, 'auth.login'); });
  el.registerForm.addEventListener('submit', (e) => { e.preventDefault(); submitAuth(el.registerForm, 'auth.register'); });

  el.resultDialog.addEventListener('close', () => {
    const v = el.resultDialog.returnValue;
    el.resultDialog.returnValue = '';
    if (v === 'again') {
      if (S.room && S.status !== 'running') leaveRoom();
      else if (!S.room) newRound();
    } else if (v === 'level') {
      prepareRound();
      el.levels.querySelector('input:checked')?.focus();
      el.levels.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
    } else if (v === 'login') {
      openAuth('login');
    }
  });

  el.createRoomBtn.addEventListener('click', createRoom);
  el.joinForm.addEventListener('submit', (e) => { e.preventDefault(); joinRoom(el.joinCode.value); });
  el.joinCode.addEventListener('input', () => { el.joinCode.value = normalizeRoomCode(el.joinCode.value); });
  el.roomStartBtn.addEventListener('click', startRoomRace);
  el.leaveRoomBtn.addEventListener('click', () => { leaveRoom(); toast('غادرت الغرفة'); });
  el.copyCodeBtn.addEventListener('click', () => S.room && copyText(S.room.code, 'اتنسخ الكود ✔'));
  el.copyLinkBtn.addEventListener('click', () => S.room && copyText(inviteLink(S.room.code), 'اتنسخ رابط الدعوة ✔'));
  el.boardFilter.addEventListener('change', loadBoard);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) { ping(); if (S.room) schedulePoll(0); }
  });
}

async function init() {
  bind();
  renderSound();
  if (window.matchMedia?.('(max-width: 720px)').matches) el.kbDetails.open = false;
  prepareRound({ phraseIndex: pickPhraseIndex(S.difficulty) });
  await refreshAuth();
  ping();
  setInterval(ping, 20000);
  loadBoard();
  setInterval(() => { if (!document.hidden) loadBoard(); }, 60000);

  const invite = new URLSearchParams(location.search).get('room');
  if (invite) {
    if (!S.serverUp) toast('رابط الدعوة يحتاج الخادم، وهو غير متاح الآن.', true);
    else joinRoom(invite);
  }
}

init();
