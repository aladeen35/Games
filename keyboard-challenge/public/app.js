// تحدي الـ Keyboard مع أبو جنان — منطق اللعبة والشاشات
import {
  DIFFICULTIES, DEFAULT_DIFFICULTY, SYNC_INTERVAL_MS, COUNTDOWN_MS, TypingTracker, roundSeconds,
  computeWpm, trackPosition, botCharsPerSecond, clamp, normalizeRoomCode, isValidRoomCode, weekStartUTC,
} from './shared/game.js';
import { CATEGORIES, KINDS, MIX, getText, allTextIds, textCount, categoryMeta, kindMeta } from './shared/texts/index.js';
import { api, isApp, hasServer, getServerUrl, setServerUrl } from './api.js';
import { sfx, unlockAudio, isSoundOn, setSound } from './audio.js';
import { buildKeyboard, highlightNext, flashKey } from './keyboard.js';
import { Sprite, probePoses } from './sprite.js';
import { bt } from './bt.js';

const $ = (id) => document.getElementById(id);
const isTouch = isApp || window.matchMedia?.('(pointer: coarse)').matches || false;
document.body.classList.toggle('touch', isTouch);

const el = {
  topbar: $('topbar'), backBtn: $('backBtn'), topbarTitle: $('topbarTitle'),
  online: $('online'), onlineCount: $('onlineCount'), soundBtn: $('soundBtn'), soundIcon: $('soundIcon'), settingsBtn: $('settingsBtn'),
  introBtn: $('introBtn'), homeGreeting: $('homeGreeting'), btMenuHint: $('btMenuHint'),
  catCards: $('catCards'), kindCards: $('kindCards'), levelChips: $('levelChips'), levelHint: $('levelHint'),
  setupTitle: $('setupTitle'), setupGo: $('setupGo'),
  quitBtn: $('quitBtn'), hudCat: $('hudCat'), hudKind: $('hudKind'), timer: $('timer'), wpm: $('wpm'), accuracy: $('accuracy'),
  timebar: $('timebar'), lanes: $('lanes'), coachBubble: $('coachBubble'),
  textTitle: $('textTitle'), textProgress: $('textProgress'), phraseWrap: $('phraseWrap'), phrase: $('phrase'), textSource: $('textSource'),
  textCard: $('textCard'), input: $('input'), currentChar: $('currentChar'), statusLine: $('statusLine'), vkb: $('vkb'),
  countdown: $('countdown'), countdownNum: $('countdownNum'),
  resultTitle: $('resultTitle'), resultSub: $('resultSub'), resultBadge: $('resultBadge'),
  resWpm: $('resWpm'), resAcc: $('resAcc'), resTime: $('resTime'), resPlace: $('resPlace'), resRanking: $('resRanking'), resSave: $('resSave'),
  againBtn: $('againBtn'), changeBtn: $('changeBtn'), resLoginBtn: $('resLoginBtn'), homeBtn: $('homeBtn'),
  syncStatus: $('syncStatus'), onlineGate: $('onlineGate'), onlineGateMsg: $('onlineGateMsg'), gateLoginBtn: $('gateLoginBtn'), gateSettingsBtn: $('gateSettingsBtn'),
  roomLobby: $('roomLobby'), createRoomBtn: $('createRoomBtn'), joinForm: $('joinForm'), joinCode: $('joinCode'),
  roomPanel: $('roomPanel'), roomCode: $('roomCode'), copyCodeBtn: $('copyCodeBtn'), copyLinkBtn: $('copyLinkBtn'), roomMeta: $('roomMeta'),
  players: $('players'), roomStartBtn: $('roomStartBtn'), roomRematchBtn: $('roomRematchBtn'), leaveRoomBtn: $('leaveRoomBtn'),
  btUnavailable: $('btUnavailable'), btMain: $('btMain'), btChoose: $('btChoose'), btHostBtn: $('btHostBtn'), btJoinBtn: $('btJoinBtn'),
  btHostPanel: $('btHostPanel'), btHostStatus: $('btHostStatus'), btPlayers: $('btPlayers'), btStartBtn: $('btStartBtn'), btStopBtn: $('btStopBtn'),
  btJoinPanel: $('btJoinPanel'), btJoinStatus: $('btJoinStatus'), btDevices: $('btDevices'), btScanBtn: $('btScanBtn'), btLeaveBtn: $('btLeaveBtn'),
  boardTabs: $('boardTabs'), boardWeek: $('boardWeek'), boardList: $('boardList'), boardEmpty: $('boardEmpty'),
  settingsDialog: $('settingsDialog'), menuAccount: $('menuAccount'), nickInput: $('nickInput'), soundToggle: $('soundToggle'),
  serverField: $('serverField'), serverInput: $('serverInput'), settingsSave: $('settingsSave'),
  authDialog: $('authDialog'), tabLogin: $('tabLogin'), tabRegister: $('tabRegister'), loginForm: $('loginForm'), registerForm: $('registerForm'), authError: $('authError'),
  toast: $('toast'),
};

const BOTS = [
  { id: 'bot1', name: 'ود البلد', color: '#5BD6A7' },
  { id: 'bot2', name: 'بت النيل', color: '#E58A74' },
  { id: 'bot3', name: 'حاج السرعة', color: '#8CC4EE' },
];
const PLAYER_COLORS = ['#EFC477', '#5BD6A7', '#E58A74', '#8CC4EE', '#C9A7F2', '#F2A7C8', '#A7E0F2', '#F2D7A7'];
const COACH_LINES = {
  run: ['يلا يا بطل!', 'واصل!', 'كدا تمام!', 'أصابعك ذهب!'],
  error: ['صحّح الغلط!', 'امسح وارجع!', 'على مهلك!'],
  near: ['قربت! شد حيلك', 'النهاية قدامك!', 'آخر شوية!'],
  won: ['أسرع زول!'],
  lost: ['المرة الجاية!'],
};

// ───────────── التخزين المحلي ─────────────
const local = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* تجاهل */ } },
};

// ───────────── الحالة ─────────────
const S = {
  user: null,
  serverUp: false,
  prefs: { category: MIX, kind: 'short', difficulty: DEFAULT_DIFFICULTY, nick: '', ...local.get('kb-prefs', {}) },
  setupPurpose: 'solo',
  screen: 'intro',
  history: [],
  race: null,
  room: null,
  pendingFinish: null,
  pollTimer: 0,
  syncDown: false,
  bt: null,           // { role, peers: Map, myId, hostName }
};
const savePrefs = () => local.set('kb-prefs', S.prefs);
const nick = () => (S.user?.displayName || S.prefs.nick || 'أبو جنان').slice(0, 24);

let clientId = '';
try {
  clientId = sessionStorage.getItem('kb-client') || '';
  if (!clientId) { clientId = crypto.randomUUID(); sessionStorage.setItem('kb-client', clientId); }
} catch { clientId = Math.random().toString(36).slice(2); }

// ───────────── أدوات ─────────────
let toastTimer = 0;
function toast(msg, warn = false) {
  el.toast.textContent = msg;
  el.toast.classList.toggle('warn', warn);
  el.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.toast.classList.remove('show'), 3000);
}
function setStatus(msg, kind = '') {
  el.statusLine.textContent = msg;
  el.statusLine.className = `status-line ${kind}`.trim();
}
const fmtClock = (ms) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return s >= 60 ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : String(s);
};
const fmtSeconds = (ms) => (Math.max(0, ms) / 1000).toFixed(1);
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

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

function watchAsset(img) {
  const wrap = img.closest('.asset');
  const broken = () => wrap?.classList.add('broken');
  img.addEventListener('error', broken, { once: true });
  if (img.complete && img.naturalWidth === 0) broken();
}

function confetti() {
  if (reducedMotion()) return;
  const box = document.createElement('div');
  box.className = 'confetti';
  const colors = ['#EFC477', '#5BD6A7', '#D9634D', '#8CC4EE', '#F6EEDC'];
  for (let i = 0; i < 50; i++) {
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

/** اختيار عشوائي كامل: كيس خلط يمر على كل النصوص قبل أي تكرار. */
function drawText(category, kind) {
  const key = `kb-bag:${category}:${kind}`;
  let bag = local.get(key, []);
  const valid = new Set(allTextIds(category, kind));
  bag = bag.filter((id) => valid.has(id));
  if (!bag.length) {
    bag = [...valid];
    for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; }
  }
  const id = bag.pop();
  local.set(key, bag);
  return id;
}

// ───────────── الشخصية ─────────────
const sprites = {};
document.querySelectorAll('img[data-sprite]').forEach((img) => { sprites[img.dataset.sprite] = new Sprite(img); });

// ───────────── التنقل بين الشاشات ─────────────
const TITLES = {
  home: 'الرئيسية', setup: 'جهّز جولتك', online: 'أونلاين', bt: 'بلوتوث', board: 'ترتيب الأسبوع', howto: 'طريقة اللعب', result: 'النتيجة',
};

function go(screen, { push = true } = {}) {
  if (screen === S.screen) return;
  if (push && S.screen !== 'intro' && S.screen !== 'game') S.history.push(S.screen);
  S.screen = screen;
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.dataset.screen === screen));
  el.topbar.hidden = screen === 'intro' || screen === 'game';
  el.backBtn.hidden = screen === 'home';
  el.topbarTitle.textContent = TITLES[screen] || '';
  if (screen !== 'game') window.scrollTo(0, 0);
  if (screen === 'home') renderHome();
  if (screen === 'setup') renderSetup();
  if (screen === 'online') renderOnline();
  if (screen === 'bt') renderBt();
  if (screen === 'board') loadBoard();
  fitViewport();
}

function back() {
  if (S.screen === 'game') { quitRace(); return; }
  if (S.screen === 'result') { goAfterResult(); return; }
  const prev = S.history.pop();
  go(prev || 'home', { push: false });
}

/** زر الرجوع في أندرويد. */
window.__androidBack = () => {
  const open = document.querySelector('dialog[open]');
  if (open) { open.close(); return 'handled'; }
  if (S.screen === 'home' || S.screen === 'intro') return 'exit';
  back();
  return 'handled';
};

// ───────────── الرئيسية ─────────────
function renderHome() {
  sprites.home?.set('run');
  el.homeGreeting.textContent = S.user
    ? `أهلًا ${S.user.displayName}! اختار طريقة اللعب وخلي أبو جنان يقود السباق.`
    : 'اختار طريقة اللعب وخلي أبو جنان يقود السباق.';
  el.btMenuHint.textContent = bt.available ? 'جهازين قريبين بدون إنترنت' : 'متاح في تطبيق أندرويد';
}

// ───────────── شاشة الإعداد ─────────────
function pickCard({ id, icon, label, desc, count, checked, onPick, group }) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'pick';
  b.setAttribute('role', 'radio');
  b.setAttribute('aria-checked', String(checked));
  b.dataset.id = id;
  b.dataset.group = group;
  const i = document.createElement('span'); i.className = 'pick-icon'; i.textContent = icon;
  const t = document.createElement('b'); t.textContent = label;
  const d = document.createElement('small'); d.textContent = desc;
  b.append(i, t, d);
  if (count) { const c = document.createElement('span'); c.className = 'pick-count'; c.textContent = count; b.append(c); }
  b.addEventListener('click', () => { unlockAudio(); onPick(id); sfx.correct(); });
  return b;
}

function renderSetup() {
  el.setupTitle.textContent = { solo: '🏁 جولة فردية', room: '🌐 غرفة جديدة', bt: '📶 جولة بلوتوث' }[S.setupPurpose];
  el.setupGo.textContent = S.setupPurpose === 'room' ? 'أنشئ الغرفة ➕' : 'يلا نبدأ 🏁';
  const p = S.prefs;
  el.catCards.textContent = '';
  const cats = [...CATEGORIES, { id: MIX, icon: '🎲', label: 'عشوائي', desc: 'نص من أي كاتوجري' }];
  for (const c of cats) {
    el.catCards.append(pickCard({
      ...c, group: 'cat', checked: p.category === c.id,
      count: c.id === MIX ? '' : `${KINDS.reduce((n, k) => n + textCount(c.id, k.id), 0)} نص`,
      onPick: (id) => { p.category = id; savePrefs(); renderSetup(); },
    }));
  }
  el.kindCards.textContent = '';
  for (const k of KINDS) {
    el.kindCards.append(pickCard({
      ...k, group: 'kind', checked: p.kind === k.id,
      onPick: (id) => { p.kind = id; savePrefs(); renderSetup(); },
    }));
  }
  el.levelChips.textContent = '';
  for (const d of Object.values(DIFFICULTIES)) {
    const c = document.createElement('button');
    c.type = 'button';
    c.className = 'chip';
    c.setAttribute('role', 'radio');
    c.setAttribute('aria-checked', String(p.difficulty === d.id));
    c.textContent = `${d.icon} ${d.label}`;
    c.addEventListener('click', () => { p.difficulty = d.id; savePrefs(); renderSetup(); });
    el.levelChips.append(c);
  }
  el.levelHint.textContent = DIFFICULTIES[p.difficulty].hint;
}

async function setupGo() {
  unlockAudio();
  const { category, kind, difficulty } = S.prefs;
  if (S.setupPurpose === 'solo') {
    startSolo();
  } else if (S.setupPurpose === 'room') {
    await createRoom();
  } else if (S.setupPurpose === 'bt') {
    btHostStart(drawText(category, kind), difficulty);
  }
}

function startSolo() {
  const { category, kind, difficulty } = S.prefs;
  beginRace({ mode: 'solo', textId: drawText(category, kind), difficulty, delayMs: COUNTDOWN_MS });
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
    <rect x="23" y="12" width="6" height="3.5" rx="1" fill="none" stroke="#111" stroke-width="1.3"/>`;
  return svg;
}

const laneNodes = new Map();
let meLaneSprite = null;

function racers() {
  const r = S.race;
  if (!r) return [];
  const me = r.tracker.progress;
  const running = r.status === 'running';
  if (r.mode === 'room') {
    return (S.room?.view?.players ?? []).map((p, i) => ({
      id: `u${p.userId}`, name: p.isMe ? `${p.displayName} (أنت)` : p.displayName, isMe: p.isMe,
      progress: p.isMe ? (r.status === 'finished' ? 1 : me) : p.progress / 100,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length], moving: running && !p.finished && p.active, inactive: !p.active, done: p.finished,
    }));
  }
  if (r.mode === 'bt') {
    return btPlayersList().map((p, i) => ({
      id: `b${p.id}`, name: p.isMe ? `${p.name} (أنت)` : p.name, isMe: p.isMe,
      progress: p.isMe ? (r.status === 'finished' ? 1 : me) : p.progress,
      color: PLAYER_COLORS[i % PLAYER_COLORS.length], moving: running && !p.finished, done: p.finished,
    }));
  }
  return [
    { id: 'me', name: `${nick()} (أنت)`, progress: me, isMe: true, moving: running, done: r.status === 'finished' },
    ...r.bots.map((b) => ({ id: b.id, name: b.name, color: b.color, progress: b.progress, moving: running && b.progress < 1 && !b.paused, done: b.progress >= 1 })),
  ];
}

function renderLanes() {
  const list = racers();
  const seen = new Set();
  el.lanes.classList.toggle('compact', list.length > 4);
  list.forEach((r, i) => {
    seen.add(r.id);
    let node = laneNodes.get(r.id);
    if (!node || node.isMe !== !!r.isMe) {
      node?.li.remove();
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
      const body = document.createElement('div');
      body.className = 'runner-body';
      if (r.isMe) {
        const img = document.createElement('img');
        img.className = 'sprite';
        img.alt = '';
        img.src = 'assets/abu-jinan-runner.webp';
        body.append(img);
        meLaneSprite?.destroy();
        meLaneSprite = new Sprite(img);
      } else {
        body.append(botSvg(r.color));
      }
      const shadow = document.createElement('div');
      shadow.className = 'runner-shadow';
      runner.append(tag, body, shadow);
      inner.append(runner);
      li.append(inner);
      node = { li, runner, name, pct, isMe: !!r.isMe };
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
  });
  for (const [id, node] of laneNodes) if (!seen.has(id)) { node.li.remove(); laneNodes.delete(id); }
}

function clearLanes() {
  laneNodes.forEach((n) => n.li.remove());
  laneNodes.clear();
  meLaneSprite?.destroy();
  meLaneSprite = null;
}

// ───────────── محرك السباق ─────────────
let phraseSpans = [];
let rafId = 0;
let lastFrame = 0;

/**
 * يبدأ سباقًا جديدًا. delayMs: الزمن حتى الانطلاق (سالب = بدأ السباق منذ مدة).
 */
function beginRace({ mode, textId, difficulty, delayMs = COUNTDOWN_MS, round = null }) {
  const text = getText(textId);
  if (!text) { toast('تعذر تحميل النص', true); return; }
  cancelAnimationFrame(rafId);
  clearLanes();
  const len = [...text.text].length;
  const seconds = roundSeconds(len, difficulty);
  S.race = {
    mode, text, difficulty, seconds, round,
    tracker: new TypingTracker(text.text),
    committed: 0,
    status: 'countdown',
    startPerf: performance.now() + delayMs,
    elapsed: 0,
    lastErrorAt: -1e9,
    bots: mode === 'solo' ? BOTS.map((b) => ({
      ...b, chars: 0, progress: 0, finishAt: null, paused: false, pauseLeft: 0,
      cps: botCharsPerSecond(difficulty), delay: 0.35 + Math.random() * 0.9,
    })) : [],
    roundReq: null,
    result: null,
    goShownUntil: 0,
    lastBtSend: 0,
  };
  el.hudCat.textContent = `${categoryMeta(text.category).icon} ${categoryMeta(text.category).short}`;
  el.hudKind.textContent = `${kindMeta(text.kind).label} · ${DIFFICULTIES[difficulty].label}`;
  el.textTitle.hidden = !text.title;
  el.textTitle.textContent = text.title;
  el.textSource.hidden = !text.source;
  el.textSource.textContent = text.source ? `المصدر: ${text.source}` : '';
  el.input.value = '';
  el.input.classList.remove('has-error');
  renderPhrase();
  go('game');
  renderTyping();
  renderClock();
  renderLanes();
  setStatus('استعد…');
  sprites.coach?.set('run', { paused: true });
  meLaneSprite?.set('run', { paused: true });
  el.coachBubble.textContent = 'استعد!';
  // التركيز داخل تفاعل المستخدم حتى يفتح كيبورد الهاتف أثناء العد التنازلي.
  el.input.focus({ preventScroll: true });
  lastFrame = performance.now();
  rafId = requestAnimationFrame(frame);
}

function renderPhrase() {
  el.phrase.textContent = '';
  const frag = document.createDocumentFragment();
  phraseSpans = S.race.tracker.chars.map((ch) => {
    const s = document.createElement('span');
    s.className = ch === ' ' ? 'ch space' : 'ch';
    s.textContent = ch;
    frag.append(s);
    return s;
  });
  el.phrase.append(frag);
  el.phraseWrap.scrollTop = 0;
}

function currentIndex() {
  const t = S.race.tracker;
  return Math.min([...t.value].length, t.chars.length - 1);
}

function renderTyping() {
  const r = S.race;
  if (!r) return;
  const t = r.tracker;
  const states = t.states();
  for (let i = 0; i < states.length; i++) {
    const s = phraseSpans[i];
    const base = t.chars[i] === ' ' ? 'ch space' : 'ch';
    const cls = states[i] === 'pending' ? base : `${base} ${states[i]}`;
    if (s.className !== cls) s.className = cls;
  }
  const typedLen = [...t.value].length;
  const hasError = t.prefix < typedLen;
  el.input.classList.toggle('has-error', hasError);
  const typing = r.status === 'running';
  let next = null;
  if (typing) next = hasError ? '\b' : t.chars[typedLen] ?? null;
  el.currentChar.textContent = next == null ? '—' : next === '\b' ? '⌫' : next === ' ' ? '␣' : next;
  if (!isTouch) highlightNext(next, kb?.shiftEls);
  el.accuracy.textContent = `${t.accuracy}%`;
  el.accuracy.classList.toggle('low', t.accuracy < 85);
  el.textProgress.textContent = `${Math.round(t.progress * 100)}%`;
  keepCurrentVisible();
}

/** يحافظ على الحرف الحالي ظاهرًا داخل صندوق النص الطويل. */
function keepCurrentVisible() {
  const span = phraseSpans[currentIndex()];
  if (!span) return;
  const wrap = el.phraseWrap;
  const top = span.offsetTop - el.phrase.offsetTop;
  const line = span.offsetHeight || 30;
  if (top < wrap.scrollTop || top + line > wrap.scrollTop + wrap.clientHeight) {
    wrap.scrollTop = Math.max(0, top - line);
  }
}

function renderClock() {
  const r = S.race;
  const total = r.seconds * 1000;
  const left = r.status === 'countdown' ? total : total - r.elapsed;
  el.timer.textContent = fmtClock(left);
  el.timer.classList.toggle('low', r.status === 'running' && left < 10000);
  el.timebar.style.transform = `scaleX(${clamp(left / total, 0, 1)})`;
  el.wpm.textContent = r.tracker.wpm(r.elapsed);
}

function poseFor(r) {
  if (r.status === 'finished') return r.result?.place === 1 ? 'won' : 'lost';
  if (r.status === 'timeout') return 'lost';
  const t = r.tracker;
  const hasError = t.prefix < [...t.value].length || performance.now() - r.lastErrorAt < 600;
  if (hasError) return 'error';
  if (t.progress >= 0.8) return 'near';
  return 'run';
}

let coachPose = '';
function renderPose() {
  const r = S.race;
  const pose = poseFor(r);
  sprites.coach?.set(pose);
  meLaneSprite?.set(pose);
  if (pose !== coachPose) {
    coachPose = pose;
    el.coachBubble.textContent = pick(COACH_LINES[pose]);
  }
}

function frame(now) {
  const r = S.race;
  if (!r || S.screen !== 'game') return;
  const dt = Math.min(0.1, (now - lastFrame) / 1000);
  lastFrame = now;

  if (r.status === 'countdown') {
    const left = r.startPerf - now;
    if (left > 0) {
      el.countdown.hidden = false;
      const n = String(Math.ceil(left / 1000));
      if (el.countdownNum.textContent !== n) {
        el.countdownNum.textContent = n;
        el.countdownNum.className = '';
        void el.countdownNum.offsetWidth;
        sfx.correct();
      }
      rafId = requestAnimationFrame(frame);
      return;
    }
    goRunning(now);
  }

  if (r.goShownUntil && now > r.goShownUntil) { el.countdown.hidden = true; r.goShownUntil = 0; }

  if (r.status === 'running') {
    r.elapsed = now - r.startPerf;
    if (r.mode === 'solo') stepBots(dt);
    if (r.mode === 'bt') btTick(now);
    if (r.elapsed >= r.seconds * 1000) {
      r.elapsed = r.seconds * 1000;
      timeUp();
      return;
    }
    renderClock();
    renderLanes();
    renderPose();
    rafId = requestAnimationFrame(frame);
  }
}

function goRunning(now) {
  const r = S.race;
  r.status = 'running';
  r.elapsed = now - r.startPerf;
  el.countdownNum.textContent = 'انطلق!';
  el.countdownNum.className = 'go';
  el.countdown.hidden = false;
  r.goShownUntil = now + 700;
  sfx.start();
  setStatus('كل كلمة صحيحة بالمسافة بتفضّي الخانة للكلمة الجاية.');
  el.input.value = '';
  if (r.mode === 'solo' && S.user && S.serverUp) {
    r.roundReq = api('round.start', { textId: r.text.id, difficulty: r.difficulty }).catch(() => null);
  }
  renderTyping();
  renderPose();
}

function stepBots(dt) {
  const r = S.race;
  const t = r.elapsed / 1000;
  const len = r.tracker.chars.length;
  for (const b of r.bots) {
    if (b.progress >= 1 || t < b.delay) continue;
    if (b.paused) { b.pauseLeft -= dt; if (b.pauseLeft <= 0) b.paused = false; continue; }
    if (Math.random() < dt * 0.35) { b.paused = true; b.pauseLeft = 0.25 + Math.random() * 0.5; continue; }
    b.chars += dt * b.cps * (0.8 + Math.random() * 0.4) * 1.08;
    b.progress = clamp(b.chars / len, 0, 1);
    if (b.progress >= 1 && b.finishAt == null) b.finishAt = r.elapsed;
  }
}

/** إدخال كلمة بكلمة: الخانة تحتوي ما بعد آخر كلمة مكتملة صحيحة فقط. */
function onInput() {
  const r = S.race;
  if (!r) return;
  if (r.status !== 'running') { el.input.value = ''; return; }
  const t = r.tracker;
  const committedText = t.chars.slice(0, r.committed).join('');
  const events = t.update(committedText + el.input.value);
  // تقديم نقطة الالتزام إلى ما بعد آخر مسافة داخل الجزء الصحيح.
  const prefix = t.prefix;
  let commit = r.committed;
  for (let i = prefix - 1; i >= r.committed; i--) {
    if (t.chars[i] === ' ') { commit = i + 1; break; }
  }
  if (prefix === t.chars.length) commit = prefix;
  r.committed = commit;
  const rest = [...t.value].slice(commit).join('');
  if (el.input.value !== rest) el.input.value = rest;

  let bad = false;
  for (const ev of events) {
    if (!isTouch) flashKey(ev.ch, ev.ok);
    if (!ev.ok) bad = true;
  }
  if (events.length) {
    if (bad) {
      r.lastErrorAt = performance.now();
      sfx.wrong();
      if (navigator.vibrate) try { navigator.vibrate(25); } catch { /* تجاهل */ }
      if (!reducedMotion()) { el.input.classList.remove('shake'); void el.input.offsetWidth; el.input.classList.add('shake'); }
    } else sfx.correct();
  }
  renderTyping();
  renderLanes();
  renderPose();
  if (t.done) finishRace();
}

function place() {
  const r = S.race;
  const elapsed = r.result.elapsedMs;
  if (r.mode === 'solo') {
    return { place: 1 + r.bots.filter((b) => b.finishAt != null && b.finishAt <= elapsed).length, total: r.bots.length + 1 };
  }
  return { place: null, total: null };
}

function finishRace() {
  const r = S.race;
  cancelAnimationFrame(rafId);
  r.elapsed = performance.now() - r.startPerf;
  r.status = 'finished';
  const elapsedMs = Math.round(r.elapsed);
  r.result = { wpm: computeWpm(r.tracker.chars.length, elapsedMs), accuracy: r.tracker.accuracy, elapsedMs, completed: true };
  Object.assign(r.result, place());
  el.input.blur();
  showResult();
  if (r.mode === 'solo') saveSolo();
  else if (r.mode === 'room') { S.pendingFinish = { code: S.room.code, elapsedMs, accuracy: r.result.accuracy, round: r.round }; flushRoomFinish(); }
  else if (r.mode === 'bt') btFinishMine();
  celebrate();
}

function timeUp() {
  const r = S.race;
  cancelAnimationFrame(rafId);
  r.status = 'timeout';
  r.result = { wpm: r.tracker.wpm(r.elapsed), accuracy: r.tracker.accuracy, elapsedMs: r.elapsed, completed: false, place: null, total: null };
  el.input.blur();
  sfx.timeout();
  if (r.mode === 'bt') btFinishMine();
  showResult();
}

function celebrate() {
  const r = S.race;
  if (r.result.place === 1) { sfx.win(); confetti(); } else sfx.complete();
}

function quitRace() {
  const r = S.race;
  cancelAnimationFrame(rafId);
  el.countdown.hidden = true;
  el.input.blur();
  if (r && r.mode === 'bt' && S.bt?.role === 'guest' && r.status === 'running') {
    bt.broadcast({ t: 'finish', dnf: true });
  }
  if (r) r.status = 'quit';
  if (r?.mode === 'room') go('online', { push: false });
  else if (r?.mode === 'bt') go('bt', { push: false });
  else go('setup', { push: false });
}

// ───────────── النتيجة ─────────────
function showResult() {
  const r = S.race;
  const res = r.result;
  go('result', { push: false });
  updateResult();
  el.resultSub.textContent = res.completed
    ? `${categoryMeta(r.text.category).icon} ${categoryMeta(r.text.category).short} · ${kindMeta(r.text.kind).label}`
    : `كتبت ${Math.round(r.tracker.progress * 100)}% من النص. جرّب تاني وخليك مركز!`;
  el.resWpm.textContent = res.wpm;
  el.resAcc.textContent = `${res.accuracy}%`;
  el.resTime.textContent = `${fmtSeconds(res.elapsedMs)} ث`;
  el.againBtn.textContent = r.mode === 'room' ? 'رجوع للغرفة' : r.mode === 'bt' ? 'رجوع لغرفة البلوتوث' : 'جولة ثانية';
  el.changeBtn.hidden = r.mode !== 'solo';
  el.resLoginBtn.hidden = true;
  if (!res.completed) setSaveLine('النتيجة ما اتسجلت لأن النص ما اكتمل.', 'warn');
  else if (r.mode === 'bt') setSaveLine('جولة البلوتوث لا تدخل ترتيب الأسبوع.', '');
  else setSaveLine(r.mode === 'room' ? 'جاري إرسال النتيجة للغرفة…' : '');
  el.againBtn.focus({ preventScroll: true });
}

/** يحدّث المركز والترتيب والوضعية (قد يصل المركز لاحقًا من الغرفة أو المضيف). */
function updateResult() {
  const r = S.race;
  if (!r?.result) return;
  const res = r.result;
  const won = res.completed && res.place === 1;
  const pose = won ? 'won' : 'lost';
  sprites.result?.set(pose);
  el.resultBadge.textContent = won ? '🏆' : res.completed ? '🏅' : '⏱️';
  el.resultTitle.textContent = !res.completed ? 'انتهى الوقت!'
    : won ? 'أسرع زول في السباق! 🏆'
      : res.place ? `وصلت في المركز ${res.place}` : 'وصلت خط النهاية! 🎉';
  el.resPlace.textContent = res.place ? `${res.place}/${res.total}` : '—';
  const list = racers().map((x) => ({ ...x }));
  el.resRanking.textContent = '';
  if (list.length > 1) {
    list.sort((a, b) => b.progress - a.progress);
    for (const x of list) {
      const li = document.createElement('li');
      if (x.isMe) li.className = 'me';
      const n = document.createElement('span'); n.textContent = x.name;
      const p = document.createElement('span'); p.textContent = `${Math.round(x.progress * 100)}%`;
      li.append(n, p);
      el.resRanking.append(li);
    }
  }
}

function setSaveLine(msg, kind = '', showLogin = false) {
  el.resSave.textContent = msg;
  el.resSave.className = `save-line ${kind}`.trim();
  el.resLoginBtn.hidden = !showLogin;
}

async function saveSolo() {
  const r = S.race;
  if (!S.user) {
    setSaveLine(S.serverUp ? 'سجّل الدخول عشان نتيجتك تدخل ترتيب الأسبوع.' : 'اللعب بدون خادم: النتيجة ما بتدخل ترتيب الأسبوع.', 'warn', S.serverUp);
    return;
  }
  setSaveLine('جاري حفظ النتيجة…');
  const round = await r.roundReq;
  if (!round) { setSaveLine('تعذر الحفظ: الخادم غير متاح الآن.', 'warn'); return; }
  try {
    const res = await api('round.finish', { roundId: round.roundId, elapsedMs: r.result.elapsedMs, accuracy: r.result.accuracy });
    setSaveLine(`✔ اتحفظت نتيجتك في ترتيب الأسبوع (${res.wpm} WPM).`, 'ok');
  } catch (err) {
    setSaveLine(`لم تُحفظ النتيجة: ${err.message}`, 'warn');
  }
}

function goAfterResult() {
  const mode = S.race?.mode;
  if (mode === 'room') go('online', { push: false });
  else if (mode === 'bt') go('bt', { push: false });
  else go('home', { push: false });
}

// ───────────── الغرف أونلاين ─────────────
function setSync(text, kind = '') {
  el.syncStatus.textContent = text;
  el.syncStatus.className = `sync ${kind}`.trim();
}

function renderOnline() {
  const inRoom = !!S.room;
  const gate = !hasServer() ? 'noServer' : !S.serverUp ? 'down' : !S.user ? 'login' : null;
  el.onlineGate.hidden = !gate || inRoom;
  el.roomLobby.hidden = !!gate || inRoom;
  el.roomPanel.hidden = !inRoom;
  el.gateLoginBtn.hidden = gate !== 'login';
  el.gateSettingsBtn.hidden = !(gate === 'noServer' || (gate === 'down' && isApp));
  el.onlineGateMsg.textContent = {
    noServer: 'اللعب الأونلاين يحتاج خادم. اكتب عنوان الخادم في الإعدادات.',
    down: 'الخادم غير متاح الآن. اللعب الفردي شغال عادي، وجرّب الأونلاين بعد شوية.',
    login: 'اللعب الجماعي يحتاج تسجيل الدخول عشان نربط النتيجة بحسابك.',
  }[gate] || '';
  if (!inRoom) { setSync(S.serverUp ? 'متصل بالخادم' : 'غير متصل', S.serverUp ? 'live' : 'down'); return; }
  const v = S.room.view;
  const r = v.room;
  el.roomCode.textContent = S.room.code;
  const status = { waiting: 'في الانتظار', racing: 'السباق شغال', finished: 'انتهت الجولة' }[r.status];
  const cat = r.pool === MIX ? '🎲 عشوائي' : `${categoryMeta(r.pool).icon} ${categoryMeta(r.pool).short}`;
  el.roomMeta.textContent = `${cat} · ${kindMeta(r.kind).label} · ${DIFFICULTIES[r.difficulty].label} · الجولة ${r.round} · ${status}`;
  el.roomStartBtn.hidden = !(r.isHost && r.status === 'waiting');
  el.roomRematchBtn.hidden = !(r.isHost && r.status === 'finished');
  renderPlayerList(el.players, v.players.map((p) => ({
    name: p.displayName, isMe: p.isMe, isHost: p.isHost, active: p.active, place: p.place,
    progress: p.progress, wpm: p.wpm, accuracy: p.accuracy,
  })));
}

function renderPlayerList(ul, list) {
  ul.textContent = '';
  list.forEach((p, i) => {
    const li = document.createElement('li');
    li.className = `player${p.isMe ? ' me' : ''}`;
    const av = document.createElement('span');
    av.className = 'player-avatar';
    av.style.background = PLAYER_COLORS[i % PLAYER_COLORS.length];
    av.textContent = [...p.name][0] || '؟';
    const name = document.createElement('span');
    name.className = 'player-name';
    name.textContent = p.name;
    const badges = [];
    if (p.isHost) badges.push('👑');
    if (p.isMe) badges.push('أنت');
    if (p.active === false) badges.push('غير نشط');
    if (p.place) badges.push(`المركز ${p.place}`);
    if (badges.length) { const sm = document.createElement('small'); sm.textContent = badges.join(' · '); name.append(sm); }
    const stats = document.createElement('span');
    stats.className = 'player-stats';
    const strong = document.createElement('strong');
    strong.textContent = `${Math.round(p.progress)}%`;
    stats.append(strong, document.createElement('br'), `${p.wpm ?? 0} WPM · ${p.accuracy ?? 100}%`);
    li.append(av, name, stats);
    ul.append(li);
  });
}

function setRoomUrl(code) {
  if (isApp) return;
  try {
    const url = new URL(location.href);
    if (code) url.searchParams.set('room', code); else url.searchParams.delete('room');
    history.replaceState(null, '', url);
  } catch { /* تجاهل */ }
}

function inviteLink(code) {
  const base = getServerUrl() || `${location.origin}${location.pathname}`;
  const url = new URL(base.endsWith('/') || base.includes('.html') ? base : `${base}/`);
  url.search = '';
  url.searchParams.set('room', code);
  return url.toString();
}

function enterRoom(view) {
  const first = !S.room || S.room.code !== view.room.code;
  S.room = { code: view.room.code, view, racedRound: 0 };
  if (first) { sfx.join(); S.pendingFinish = null; }
  setRoomUrl(view.room.code);
  handleRoomView(view);
  go('online');
  schedulePoll(SYNC_INTERVAL_MS);
}

function handleRoomView(view) {
  if (!S.room) return;
  S.room.view = view;
  const r = view.room;
  const me = view.players.find((p) => p.isMe);
  const race = S.race?.mode === 'room' ? S.race : null;
  if (r.status === 'racing' && S.room.racedRound !== r.round && !me?.finished) {
    S.room.racedRound = r.round;
    const delay = r.startedAt - view.serverNow;
    if (delay < -(r.seconds * 1000 - 3000)) return; // الجولة شارفت على نهايتها
    beginRace({ mode: 'room', textId: r.textId, difficulty: r.difficulty, delayMs: delay, round: r.round });
    toast(delay > 0 ? 'استعد! السباق بيبدأ 🏁' : 'السباق شغال — الحق! 🏁');
  } else if (r.status === 'finished' && race && (race.status === 'running' || race.status === 'countdown') && race.round === r.round) {
    timeUp();
  }
  if (race?.result && race.round === r.round && me?.place) {
    race.result.place = me.place;
    race.result.total = view.players.length;
  }
  if (S.screen === 'result') updateResult();
  if (S.screen === 'online') renderOnline();
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
      if (me?.place === 1 && S.race?.result && S.race.result.place !== 1) { sfx.win(); confetti(); }
    }
    handleRoomView(res);
  } catch (err) {
    if (err.offline) setSaveLine('الخادم مقطوع مؤقتًا — حنعيد إرسال نتيجتك تلقائيًا.', 'warn');
    else { S.pendingFinish = null; setSaveLine(`لم تُحفظ النتيجة: ${err.message}`, 'warn'); }
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
    const r = S.race;
    if (r?.mode === 'room' && r.status === 'running') {
      view = await api('room.progress', {
        code, progress: Math.min(99, Math.floor(r.tracker.progress * 100)), wpm: r.tracker.wpm(r.elapsed), accuracy: r.tracker.accuracy,
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
      if (S.screen === 'game') setStatus('التزامن متوقف مؤقتًا — كمّل كتابة، حنرسل تقدمك أول ما يرجع الاتصال.', 'warn');
    } else if ([401, 403, 404].includes(err.status)) {
      if (err.status === 401) S.user = null;
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
  if (S.race?.mode === 'room' && S.screen === 'game') { cancelAnimationFrame(rafId); go('online', { push: false }); }
  renderOnline();
}

async function createRoom() {
  if (!S.user) { openAuth('login', 'سجّل الدخول أولًا عشان تنشئ غرفة.'); return; }
  el.setupGo.disabled = true;
  try {
    const { category, kind, difficulty } = S.prefs;
    const view = await api('room.create', { category, kind, difficulty });
    S.history = ['home'];
    enterRoom(view);
    toast(`اتنشأت الغرفة ${view.room.code} — أرسل الكود لأصحابك`);
  } catch (err) {
    handleProtectedError(err);
  } finally {
    el.setupGo.disabled = false;
  }
}

async function joinRoom(rawCode) {
  const code = normalizeRoomCode(rawCode);
  if (!S.user) { S.pendingJoin = code; openAuth('login', 'سجّل الدخول أولًا عشان تنضم للغرفة.'); return; }
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

async function roomAction(name) {
  if (!S.room) return;
  try {
    const view = await api(name, { code: S.room.code });
    handleRoomView(view);
    renderOnline();
  } catch (err) {
    handleProtectedError(err);
  }
}

function handleProtectedError(err) {
  if (err.status === 401) { S.user = null; openAuth('login', err.message); return; }
  toast(err.message, true);
}

async function copyText(text, okMsg) {
  try { await navigator.clipboard.writeText(text); toast(okMsg); } catch { toast(`انسخ يدويًا: ${text}`); }
}

// ───────────── البلوتوث ─────────────
function renderBt() {
  el.btUnavailable.hidden = bt.available;
  el.btMain.hidden = !bt.available;
  if (!bt.available) return;
  const role = S.bt?.role;
  el.btChoose.hidden = !!role;
  el.btHostPanel.hidden = role !== 'host';
  el.btJoinPanel.hidden = role !== 'guest';
  if (role === 'host') {
    const n = S.bt.peers.size;
    el.btHostStatus.textContent = n ? `متصل معك ${n} لاعب. اختار النص وابدأ متى ما جهزتوا.` : 'جهازك ظاهر للأجهزة القريبة… في انتظار اللاعبين.';
    el.btStartBtn.disabled = n === 0;
    renderPlayerList(el.btPlayers, btPlayersList().map((p) => ({ ...p, progress: p.progress * 100, isHost: p.id === 'host' })));
  }
  if (role === 'guest') {
    if (S.bt.connected) {
      el.btJoinStatus.textContent = `متصل بـ ${S.bt.hostName || 'المضيف'} ✔ في انتظار بدء الجولة…`;
      el.btDevices.hidden = true;
      el.btScanBtn.hidden = true;
      renderPlayerList(el.btPlayers, []);
    } else {
      el.btDevices.hidden = false;
      el.btScanBtn.hidden = false;
      renderDevices();
    }
  }
}

function btPlayersList() {
  const b = S.bt;
  if (!b) return [];
  if (b.role === 'host') {
    const me = S.race?.mode === 'bt' ? S.race : null;
    return [
      { id: 'host', name: nick(), isMe: true, progress: me ? me.tracker.progress : 0, wpm: me ? me.tracker.wpm(me.elapsed) : 0, accuracy: me ? me.tracker.accuracy : 100, finished: b.hostFinish != null, place: b.hostPlace ?? null },
      ...[...b.peers.values()].map((p) => ({ ...p, isMe: false })),
    ];
  }
  return (b.players || []).map((p) => ({ ...p, isMe: p.id === b.myId }));
}

const btDevices = new Map();
function renderDevices() {
  el.btDevices.textContent = '';
  if (!btDevices.size) {
    const li = document.createElement('li');
    li.className = 'muted';
    li.textContent = 'ما في أجهزة لسه. اقرن الجهازين من إعدادات البلوتوث أو اضغط «ابحث عن أجهزة».';
    el.btDevices.append(li);
    return;
  }
  for (const d of btDevices.values()) {
    const li = document.createElement('li');
    const b = document.createElement('button');
    b.type = 'button';
    const n = document.createElement('span'); n.textContent = `📱 ${d.name || 'جهاز'}`;
    const a = document.createElement('small'); a.textContent = d.paired ? 'مقترن' : d.address;
    b.append(n, a);
    b.addEventListener('click', () => {
      el.btJoinStatus.textContent = `جاري الاتصال بـ ${d.name || d.address}…`;
      S.bt.hostName = d.name;
      bt.connect(d.address);
    });
    li.append(b);
    el.btDevices.append(li);
  }
}

async function btBegin(role) {
  unlockAudio();
  const res = await bt.ready();
  if (!res.ok) {
    toast(res.reason === 'denied' ? 'لازم تسمح بأذونات البلوتوث عشان تلعب' : res.reason === 'off' ? 'شغّل البلوتوث وجرب تاني' : 'البلوتوث غير متاح في هذا الجهاز', true);
    return;
  }
  S.bt = { role, peers: new Map(), players: [], myId: role === 'host' ? 'host' : null, connected: false, hostFinish: null };
  if (role === 'host') {
    bt.host(nick());
  } else {
    btDevices.clear();
    for (const d of bt.paired()) btDevices.set(d.address, { ...d, paired: true });
  }
  renderBt();
}

function btStop() {
  bt.close();
  S.bt = null;
  renderBt();
}

function btHostStart(textId, difficulty) {
  const b = S.bt;
  if (!b || b.role !== 'host') return;
  b.hostFinish = null;
  b.hostPlace = null;
  b.round = (b.round || 0) + 1;
  for (const p of b.peers.values()) Object.assign(p, { progress: 0, wpm: 0, accuracy: 100, finished: false, finishMs: null, place: null, dnf: false });
  const delay = COUNTDOWN_MS + 500;
  bt.broadcast({ t: 'start', textId, difficulty, delay, round: b.round });
  beginRace({ mode: 'bt', textId, difficulty, delayMs: delay, round: b.round });
}

function btState() {
  const b = S.bt;
  const list = btPlayersList().map((p) => ({ id: p.id, name: p.name, progress: p.progress, wpm: p.wpm, accuracy: p.accuracy, finished: p.finished, place: p.place ?? null }));
  return { t: 'state', round: b.round, players: list };
}

/** يُستدعى كل إطار أثناء سباق البلوتوث: إرسال التقدم أربع مرات في الثانية. */
function btTick(now) {
  const r = S.race;
  const b = S.bt;
  if (!b || now - r.lastBtSend < 250) return;
  r.lastBtSend = now;
  if (b.role === 'host') {
    btAssignPlaces();
    bt.broadcast(btState());
  } else {
    bt.broadcast({ t: 'progress', round: r.round, progress: r.tracker.progress, wpm: r.tracker.wpm(r.elapsed), accuracy: r.tracker.accuracy });
  }
}

function btAssignPlaces() {
  const b = S.bt;
  const finishers = [];
  if (b.hostFinish != null) finishers.push({ ref: b, key: 'hostPlace', ms: b.hostFinish });
  for (const p of b.peers.values()) if (p.finished && !p.dnf) finishers.push({ ref: p, key: 'place', ms: p.finishMs });
  finishers.sort((x, y) => x.ms - y.ms).forEach((f, i) => { f.ref[f.key] = i + 1; });
}

function btFinishMine() {
  const r = S.race;
  const b = S.bt;
  if (!b) return;
  if (b.role === 'host') {
    if (r.result.completed) b.hostFinish = r.result.elapsedMs;
    btAssignPlaces();
    if (r.result.completed) { r.result.place = b.hostPlace; r.result.total = b.peers.size + 1; }
    bt.broadcast(btState());
    updateResult();
  } else {
    bt.broadcast({ t: 'finish', round: r.round, completed: r.result.completed, elapsedMs: r.result.elapsedMs, wpm: r.result.wpm, accuracy: r.result.accuracy });
  }
}

function bindBt() {
  if (!bt.available) return;
  bt.on('hosting', () => { el.btHostStatus.textContent = 'جهازك ظاهر للأجهزة القريبة… في انتظار اللاعبين.'; });
  bt.on('device', (d) => { if (S.bt?.role === 'guest') { btDevices.set(d.address, { ...btDevices.get(d.address), ...d }); renderDevices(); } });
  bt.on('scanDone', () => { el.btScanBtn.disabled = false; el.btScanBtn.textContent = '🔍 ابحث عن أجهزة'; });
  bt.on('error', (d) => { toast(d.message || 'حصل خطأ في البلوتوث', true); if (S.bt?.role === 'guest' && !S.bt.connected) el.btJoinStatus.textContent = 'تعذر الاتصال. تأكد أن صاحبك فتح الغرفة وجرب تاني.'; });
  bt.on('connected', (d) => {
    const b = S.bt;
    if (!b) return;
    sfx.join();
    if (b.role === 'host') {
      b.peers.set(d.id, { id: d.id, name: d.name || 'لاعب', progress: 0, wpm: 0, accuracy: 100, finished: false });
    } else {
      b.connected = true;
      b.hostId = d.id;
      bt.broadcast({ t: 'join', name: nick() });
    }
    renderBt();
  });
  bt.on('disconnected', (d) => {
    const b = S.bt;
    if (!b) return;
    if (b.role === 'host') {
      const p = b.peers.get(d.id);
      b.peers.delete(d.id);
      if (p) toast(`${p.name} خرج من الغرفة`);
      bt.broadcast({ t: 'lobby', players: btPlayersList().map(({ id, name }) => ({ id, name })) });
    } else {
      toast('انقطع الاتصال بالمضيف', true);
      S.bt = { ...b, connected: false, role: 'guest' };
      if (S.screen === 'game' && S.race?.mode === 'bt') quitRace();
    }
    renderBt();
  });
  bt.on('message', ({ id, data }) => {
    let m;
    try { m = typeof data === 'string' ? JSON.parse(data) : data; } catch { return; }
    const b = S.bt;
    if (!b || !m) return;
    if (b.role === 'host') {
      const p = b.peers.get(id);
      if (!p) return;
      if (m.t === 'join') {
        p.name = String(m.name || 'لاعب').slice(0, 24);
        bt.send(id, { t: 'welcome', id, hostName: nick() });
        bt.broadcast({ t: 'lobby', players: btPlayersList().map(({ id: pid, name }) => ({ id: pid, name })) });
        toast(`${p.name} انضم 👋`);
      } else if (m.t === 'progress' && m.round === b.round && !p.finished) {
        Object.assign(p, { progress: clamp(Number(m.progress) || 0, 0, 0.99), wpm: clamp(Number(m.wpm) || 0, 0, 999), accuracy: clamp(Number(m.accuracy) || 0, 0, 100) });
      } else if (m.t === 'finish' && !p.finished) {
        const elapsed = Number(m.elapsedMs) || 0;
        Object.assign(p, { finished: true, dnf: !m.completed, finishMs: elapsed, progress: m.completed ? 1 : p.progress, wpm: clamp(Number(m.wpm) || 0, 0, 999), accuracy: clamp(Number(m.accuracy) || 0, 0, 100) });
        btAssignPlaces();
        bt.broadcast(btState());
      }
      if (S.screen === 'bt') renderBt();
      if (S.screen === 'result') updateResult();
    } else {
      if (m.t === 'welcome') { b.myId = m.id; b.hostName = m.hostName; renderBt(); }
      else if (m.t === 'lobby') { b.players = m.players; renderBt(); }
      else if (m.t === 'start') {
        b.players = [];
        beginRace({ mode: 'bt', textId: m.textId, difficulty: m.difficulty, delayMs: Number(m.delay) || COUNTDOWN_MS, round: m.round });
      } else if (m.t === 'state') {
        b.players = m.players || [];
        const mine = b.players.find((p) => p.id === b.myId);
        if (S.race?.mode === 'bt' && S.race.result && mine?.place && S.race.result.completed) {
          S.race.result.place = mine.place;
          S.race.result.total = b.players.length;
        }
        if (S.screen === 'result') updateResult();
      }
    }
  });
}

// ───────────── لوحة الترتيب ─────────────
let boardKind = 'all';
async function loadBoard() {
  el.boardList.textContent = '';
  el.boardEmpty.hidden = true;
  try {
    const data = await api('leaderboard.weekly', { kind: boardKind });
    const ws = new Date(data.weekStart);
    el.boardWeek.textContent = `من الإثنين ${ws.toLocaleDateString('ar', { day: 'numeric', month: 'long', timeZone: 'UTC' })} · 00:00 UTC — أفضل نتيجة لكل لاعب`;
    for (const r of data.results) {
      const li = document.createElement('li');
      if (r.isMe) li.className = 'me';
      const rank = document.createElement('span');
      rank.className = 'rank';
      rank.textContent = ['🥇', '🥈', '🥉'][r.rank - 1] || r.rank;
      const who = document.createElement('span');
      who.className = 'who';
      const n = document.createElement('b'); n.textContent = r.displayName;
      const m = document.createElement('small');
      m.textContent = `${categoryMeta(r.category)?.icon ?? ''} ${kindMeta(r.kind)?.label ?? ''} · ${DIFFICULTIES[r.difficulty]?.label ?? ''} · ${relTime(r.completedAt)}`;
      who.append(n, m);
      const score = document.createElement('span');
      score.className = 'score';
      const w = document.createElement('b'); w.textContent = r.wpm;
      const a = document.createElement('small'); a.textContent = `WPM · ${r.accuracy}%`;
      score.append(w, a);
      li.append(rank, who, score);
      el.boardList.append(li);
    }
    el.boardEmpty.hidden = data.results.length > 0;
    el.boardEmpty.textContent = 'ما في نتائج هذا الأسبوع لسه — كن أول واحد في اللوحة! 🏁';
  } catch (err) {
    el.boardEmpty.hidden = false;
    el.boardEmpty.textContent = err.offline ? 'لوحة الترتيب تحتاج اتصال بالخادم.' : err.message;
    el.boardWeek.textContent = `الأسبوع يبدأ الإثنين ${weekStartUTC().toISOString().slice(0, 10)} · 00:00 UTC`;
  }
}

// ───────────── الحساب والإعدادات ─────────────
function renderAccount() {
  el.menuAccount.textContent = '';
  if (S.user) {
    const p = document.createElement('p');
    p.textContent = `مرحبًا، ${S.user.displayName} `;
    const u = document.createElement('span'); u.className = 'muted'; u.dir = 'ltr'; u.textContent = `@${S.user.username}`;
    p.append(u);
    const out = document.createElement('button');
    out.type = 'button'; out.className = 'btn btn-ghost btn-sm'; out.textContent = 'تسجيل الخروج';
    out.addEventListener('click', logout);
    el.menuAccount.append(p, out);
  } else {
    const p = document.createElement('p');
    p.textContent = S.serverUp ? 'سجّل الدخول عشان تلعب في الغرف وتدخل ترتيب الأسبوع.' : 'غير متصل بالخادم — اللعب الفردي والبلوتوث شغالين بدون حساب.';
    el.menuAccount.append(p);
    if (S.serverUp) {
      const row = document.createElement('div'); row.className = 'row';
      const login = document.createElement('button'); login.type = 'button'; login.className = 'btn btn-sand btn-sm'; login.textContent = 'تسجيل الدخول';
      login.addEventListener('click', () => { el.settingsDialog.close(); openAuth('login'); });
      const reg = document.createElement('button'); reg.type = 'button'; reg.className = 'btn btn-ghost btn-sm'; reg.textContent = 'حساب جديد';
      reg.addEventListener('click', () => { el.settingsDialog.close(); openAuth('register'); });
      row.append(login, reg);
      el.menuAccount.append(row);
    }
  }
}

function openSettings() {
  renderAccount();
  el.nickInput.value = S.prefs.nick || '';
  el.soundToggle.checked = isSoundOn();
  el.serverInput.value = getServerUrl();
  el.serverField.hidden = !isApp && !getServerUrl();
  el.settingsDialog.showModal();
}

async function saveSettings() {
  S.prefs.nick = el.nickInput.value.trim().slice(0, 24);
  savePrefs();
  setSound(el.soundToggle.checked);
  renderSound();
  const url = el.serverInput.value.trim();
  if (url !== getServerUrl()) {
    if (url && !/^https?:\/\/[^\s]+$/i.test(url)) { toast('عنوان الخادم لازم يبدأ بـ http:// أو https://', true); return; }
    setServerUrl(url);
    S.user = null;
    await refreshAuth();
    toast(S.serverUp ? 'اتصلنا بالخادم ✔' : 'تعذر الاتصال بهذا الخادم', !S.serverUp);
  }
  el.settingsDialog.close();
  if (S.screen === 'online') renderOnline();
  if (S.screen === 'home') renderHome();
}

function openAuth(tab = 'login', note = '') {
  if (!S.serverUp) { toast('الخادم غير متاح الآن.', true); return; }
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
  const body = Object.fromEntries(new FormData(form).entries());
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true;
  el.authError.textContent = '';
  try {
    const { user } = await api(action, body);
    S.user = user;
    form.reset();
    el.authDialog.close();
    toast(`أهلًا ${user.displayName}! 👋`);
    if (S.screen === 'online') renderOnline();
    if (S.screen === 'home') renderHome();
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
  el.settingsDialog.close();
  toast('سجّلت الخروج. نشوفك قريب!');
  if (S.screen === 'online') renderOnline();
  if (S.screen === 'home') renderHome();
}

async function refreshAuth() {
  if (!hasServer()) { S.serverUp = false; S.user = null; return; }
  try {
    const { user } = await api('auth.me');
    S.serverUp = true;
    S.user = user;
  } catch {
    S.serverUp = false;
    S.user = null;
  }
}

async function ping() {
  if (!hasServer()) { el.online.classList.add('offline'); el.onlineCount.textContent = '—'; return; }
  try {
    const { online } = await api('presence.ping', { clientId });
    el.onlineCount.textContent = online;
    el.online.classList.remove('offline');
    if (!S.serverUp) { await refreshAuth(); if (S.screen === 'online') renderOnline(); }
  } catch {
    el.onlineCount.textContent = '—';
    el.online.classList.add('offline');
  }
}

function renderSound() {
  const on = isSoundOn();
  el.soundIcon.textContent = on ? '🔊' : '🔇';
  el.soundBtn.setAttribute('aria-pressed', String(on));
  el.soundBtn.setAttribute('aria-label', on ? 'كتم الصوت' : 'تشغيل الصوت');
}

// ───────────── ملاءمة الشاشة مع كيبورد الهاتف ─────────────
let fullHeight = window.innerHeight;
function fitViewport() {
  const vv = window.visualViewport;
  const h = Math.round(vv ? vv.height : window.innerHeight);
  const focused = document.activeElement === el.input;
  if (!focused || h > fullHeight) fullHeight = Math.max(h, window.innerHeight);
  document.documentElement.style.setProperty('--app-h', `${h}px`);
  const kbOpen = isTouch && focused && fullHeight - h > 120;
  document.body.classList.toggle('kb-open', kbOpen);
  const game = document.querySelector('.screen-game');
  if (isTouch && S.screen === 'game' && vv) game.style.transform = `translateY(${Math.round(vv.offsetTop)}px)`;
  else game.style.transform = '';
  if (S.race && S.screen === 'game') keepCurrentVisible();
}

// ───────────── الربط ─────────────
const kb = isTouch ? null : buildKeyboard(el.vkb, ({ ch, back: isBack }) => {
  if (S.race?.status !== 'running') return;
  el.input.value = isBack ? [...el.input.value].slice(0, -1).join('') : el.input.value + ch;
  onInput();
});

function bind() {
  document.querySelectorAll('.asset img').forEach(watchAsset);
  document.addEventListener('pointerdown', unlockAudio, { once: true, capture: true });
  document.addEventListener('keydown', unlockAudio, { once: true, capture: true });

  el.introBtn.addEventListener('click', () => { unlockAudio(); sfx.join(); go('home', { push: false }); });
  el.backBtn.addEventListener('click', back);
  el.soundBtn.addEventListener('click', () => { setSound(!isSoundOn()); renderSound(); if (isSoundOn()) sfx.join(); });
  el.settingsBtn.addEventListener('click', openSettings);
  el.settingsSave.addEventListener('click', saveSettings);

  document.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
    unlockAudio();
    const to = b.dataset.go;
    if (to === 'solo') { S.setupPurpose = 'solo'; go('setup'); } else go(to);
  }));
  el.setupGo.addEventListener('click', setupGo);

  el.input.addEventListener('input', onInput);
  el.input.addEventListener('paste', (e) => { e.preventDefault(); toast('اللصق ممنوع — اكتبها بإيدك 😄', true); });
  el.input.addEventListener('drop', (e) => e.preventDefault());
  el.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') e.preventDefault(); });
  el.input.addEventListener('focus', () => setTimeout(fitViewport, 50));
  el.input.addEventListener('blur', () => setTimeout(fitViewport, 50));
  el.textCard.addEventListener('click', () => el.input.focus({ preventScroll: true }));
  el.quitBtn.addEventListener('click', quitRace);

  el.againBtn.addEventListener('click', () => {
    const mode = S.race?.mode;
    if (mode === 'solo') startSolo(); else goAfterResult();
  });
  el.changeBtn.addEventListener('click', () => { S.setupPurpose = 'solo'; S.history = ['home']; go('setup', { push: false }); });
  el.homeBtn.addEventListener('click', () => { S.history = []; go('home', { push: false }); });
  el.resLoginBtn.addEventListener('click', () => openAuth('login'));

  document.addEventListener('keydown', (e) => {
    if (document.querySelector('dialog[open]')) return;
    if (e.key === 'Escape' && S.screen === 'game') quitRace();
    else if (e.key === 'Enter' && S.screen === 'result' && document.activeElement?.tagName !== 'BUTTON') { e.preventDefault(); el.againBtn.click(); }
  });

  for (const d of [el.authDialog, el.settingsDialog]) {
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  }
  el.tabLogin.addEventListener('click', () => selectTab('login'));
  el.tabRegister.addEventListener('click', () => selectTab('register'));
  el.loginForm.addEventListener('submit', (e) => { e.preventDefault(); submitAuth(el.loginForm, 'auth.login'); });
  el.registerForm.addEventListener('submit', (e) => { e.preventDefault(); submitAuth(el.registerForm, 'auth.register'); });

  el.gateLoginBtn.addEventListener('click', () => openAuth('login'));
  el.gateSettingsBtn.addEventListener('click', openSettings);
  el.createRoomBtn.addEventListener('click', () => {
    if (!S.user) { openAuth('login', 'سجّل الدخول أولًا عشان تنشئ غرفة.'); return; }
    S.setupPurpose = 'room'; go('setup');
  });
  el.joinForm.addEventListener('submit', (e) => { e.preventDefault(); joinRoom(el.joinCode.value); });
  el.joinCode.addEventListener('input', () => { el.joinCode.value = normalizeRoomCode(el.joinCode.value); });
  el.roomStartBtn.addEventListener('click', () => roomAction('room.start'));
  el.roomRematchBtn.addEventListener('click', () => roomAction('room.rematch'));
  el.leaveRoomBtn.addEventListener('click', () => { leaveRoom(); toast('غادرت الغرفة'); });
  el.copyCodeBtn.addEventListener('click', () => S.room && copyText(S.room.code, 'اتنسخ الكود ✔'));
  el.copyLinkBtn.addEventListener('click', () => S.room && copyText(inviteLink(S.room.code), 'اتنسخ رابط الدعوة ✔'));

  el.btHostBtn.addEventListener('click', () => btBegin('host'));
  el.btJoinBtn.addEventListener('click', () => btBegin('guest'));
  el.btStopBtn.addEventListener('click', btStop);
  el.btLeaveBtn.addEventListener('click', btStop);
  el.btStartBtn.addEventListener('click', () => { S.setupPurpose = 'bt'; go('setup'); });
  el.btScanBtn.addEventListener('click', () => { el.btScanBtn.disabled = true; el.btScanBtn.textContent = 'جاري البحث…'; bt.scan(); });
  bindBt();

  el.boardTabs.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-kind]');
    if (!b) return;
    boardKind = b.dataset.kind;
    el.boardTabs.querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    loadBoard();
  });

  window.visualViewport?.addEventListener('resize', fitViewport);
  window.visualViewport?.addEventListener('scroll', fitViewport);
  window.addEventListener('resize', fitViewport);
  window.addEventListener('orientationchange', () => { fullHeight = 0; setTimeout(fitViewport, 300); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { ping(); if (S.room) schedulePoll(0); } });
}

async function init() {
  bind();
  renderSound();
  fitViewport();
  probePoses();
  sprites.intro?.set('run');
  const invite = new URLSearchParams(location.search).get('room');
  await refreshAuth();
  ping();
  setInterval(ping, 20000);
  if (invite) {
    go('home', { push: false });
    go('online');
    if (!S.serverUp) toast('رابط الدعوة يحتاج الخادم، وهو غير متاح الآن.', true);
    else joinRoom(invite);
  }
}

init();
