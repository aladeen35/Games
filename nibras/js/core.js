/* =====================================================================
   نبراس — النواة: التخزين المحلي، ملفات المتعلّمين، الإتقان والمراجعة المتباعدة،
   نقاط الخبرة والشارات، الأصوات والنطق، وحدود وقت الاستخدام.
   كل البيانات تبقى على الجهاز (لا خادم في هذا الإصدار).
   ===================================================================== */
'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const DAY = 86400000;

/* ---------------- التخزين ---------------- */
N.KEY = 'nibras:v1';
N.DB = {
  data: null,
  load() {
    let d = null;
    try { d = JSON.parse(localStorage.getItem(N.KEY)); } catch (e) {}
    this.data = Object.assign({
      settings: { lang: null, font: 'n', contrast: false, motion: false, sfx: true, read: 'auto' },
      parent: { unlockAll: false, allowTimer: false, limit: 0, extra: {} },
      kids: [], cur: null, prog: {}
    }, d || {});
    return this.data;
  },
  _t: null,
  save() { clearTimeout(this._t); this._t = setTimeout(() => this.flush(), 250); },
  flush() { try { localStorage.setItem(N.KEY, JSON.stringify(this.data)); } catch (e) {} },
  wipe() { try { localStorage.removeItem(N.KEY); } catch (e) {} this.load(); }
};

/* ---------------- المتعلّمون ---------------- */
N.Kids = {
  get cur() { const d = N.DB.data; return d.kids.find(k => k.id === d.cur) || d.kids[0] || null; },
  add(name, av, grade) {
    const k = { id: uid(), name: name.trim().slice(0, 20), av, grade, xp: 0, coins: 0, owned: [], created: Date.now() };
    N.DB.data.kids.push(k); N.DB.data.cur = k.id; N.DB.save(); return k;
  },
  remove(id) {
    const d = N.DB.data; d.kids = d.kids.filter(k => k.id !== id); delete d.prog[id];
    if (d.cur === id) d.cur = d.kids[0] ? d.kids[0].id : null; N.DB.save();
  },
  select(id) { N.DB.data.cur = id; N.DB.save(); },
  prog(kid) {
    kid = kid || this.cur; if (!kid) return null;
    const P = N.DB.data.prog;
    return P[kid.id] || (P[kid.id] = { lessons: {}, skills: {}, wrong: [], daily: null, days: [], minutes: {}, reviews: 0, attempts: [], badges: [], best: {} });
  },
  stage(kid) { kid = kid || this.cur; const g = kid && N.C.gradeById[kid.grade]; return g ? g.stage : 'pri'; }
};

/* ---------------- الإتقان والمراجعة المتباعدة ----------------
   الإتقان لا يُمنح من محاولة واحدة: أول جلسة ممتازة تعطي «قريبة من الإتقان» فقط،
   ويحتاج «متقنة» جلستين ناجحتين على الأقل. فواصل المراجعة: يوم ← 3 أيام ← أسبوع ← أسبوعان ← شهر. */
N.Mastery = {
  INTERVALS: [1, 3, 7, 14, 30],
  COLORS: { none: '#AEB5C2', learn: '#3E8ED0', support: '#D9605A', near: '#E0A800', mastered: '#2FA84F', review: '#F28C28' },
  update(prog, skillId, ratio) {
    const now = Date.now();
    const s = prog.skills[skillId] || { score: 0, sessions: 0, iv: 0 };
    const before = this.state(s);
    s.score = s.sessions ? s.score * 0.5 + ratio * 0.5 : ratio * 0.75;
    s.sessions++;
    s.iv = ratio >= 0.8 ? Math.min(s.iv + (s.sessions > 1 ? 1 : 0), this.INTERVALS.length - 1) : 0;
    s.due = now + this.INTERVALS[s.iv] * DAY;
    s.last = now;
    prog.skills[skillId] = s;
    return { before, after: this.state(s) };
  },
  state(s) {
    if (!s || !s.sessions) return 'none';
    if (Date.now() > s.due && s.score >= 0.6) return 'review';
    if (s.score >= 0.85 && s.sessions >= 2) return 'mastered';
    if (s.score >= 0.7) return 'near';
    if (s.score < 0.5 && s.sessions >= 2) return 'support';
    return 'learn';
  },
  label(st) { return N.t('m_' + st); },
  badge(st) { return `<span class="mbadge" style="background:${this.COLORS[st]}">${esc(this.label(st))}</span>`; },
  due(prog) {
    const now = Date.now();
    return Object.keys(prog.skills).filter(id => { const s = prog.skills[id]; return now > s.due || this.state(s) === 'support'; });
  }
};
/* اسم المهارة من الدروس */
N.skillName = id => { const l = N.C.lessons.find(l => l.skill[0] === id); return l ? l.skill[1] : id; };
N.skillLesson = id => N.C.lessons.find(l => l.skill[0] === id);

/* ---------------- الشارات ---------------- */
N.BADGES = [
  { id: 'letters', ic: 'alphabet-blocks', e: '🔤', name: { ar: 'مستكشف الحروف', en: 'Letter Explorer' }, d: { ar: 'أكمل 3 دروس في اللغة العربية', en: 'Finish 3 Arabic lessons' }, ok: p => N.countDone(p, l => l.subject === 'ar') >= 3 },
  { id: 'numbers', ic: 'abacus', e: '🔢', name: { ar: 'صديق الأعداد', en: 'Friend of Numbers' }, d: { ar: 'أكمل 3 دروس في الرياضيات', en: 'Finish 3 maths lessons' }, ok: p => N.countDone(p, l => l.subject === 'math') >= 3 },
  { id: 'reader', ic: 'book-open-star', e: '📚', name: { ar: 'القارئ المتميز', en: 'Star Reader' }, d: { ar: 'احصل على 3 نجوم في 3 دروس', en: 'Get 3 stars in 3 lessons' }, ok: p => Object.values(p.lessons).filter(x => x.stars >= 3).length >= 3 },
  { id: 'scientist', ic: 'microscope', e: '🔬', name: { ar: 'العالِم الصغير', en: 'Little Scientist' }, d: { ar: 'أكمل درسين في العلوم', en: 'Finish 2 science lessons' }, ok: p => N.countDone(p, l => l.subject === 'sci') >= 2 },
  { id: 'maps', ic: 'map', e: '🗺️', name: { ar: 'خبير الخرائط', en: 'Map Expert' }, d: { ar: 'أكمل درسًا في التاريخ والجغرافيا', en: 'Finish a geography lesson' }, ok: p => N.countDone(p, l => l.subject === 'soc') >= 1 },
  { id: 'review', ic: 'sync', e: '🔁', name: { ar: 'بطل المراجعة', en: 'Review Hero' }, d: { ar: 'أكمل 3 جلسات مراجعة', en: 'Complete 3 review sessions' }, ok: p => p.reviews >= 3 },
  { id: 'week', ic: 'calendar', e: '📅', name: { ar: 'مثابر الأسبوع', en: 'Steady Learner' }, d: { ar: 'تعلّم في 5 أيام مختلفة خلال أسبوع', en: 'Learn on 5 different days in a week' },
    ok: p => p.days.filter(d => Date.now() - new Date(d).getTime() < 7 * DAY).length >= 5 }
];
N.countDone = (p, f) => Object.keys(p.lessons).filter(id => N.C.lessonById[id] && f(N.C.lessonById[id])).length;
N.checkBadges = function (prog) {
  const got = [];
  N.BADGES.forEach(b => { if (!prog.badges.includes(b.id) && b.ok(prog)) { prog.badges.push(b.id); got.push(b); } });
  return got;
};

/* ---------------- المتجر (عناصر تجميلية فقط بنقاط اللعب — لا مشتريات حقيقية) ---------------- */
N.AVATARS = [
  { e: '🦁', p: 0 }, { e: '🐪', p: 0 }, { e: '🦒', p: 0 }, { e: '🐢', p: 0 }, { e: '🦉', p: 0 }, { e: '🐬', p: 0 },
  { e: '🐘', p: 0 }, { e: '🦅', p: 0 },
  { e: '🚀', p: 100 }, { e: '🤖', p: 150 }, { e: '🦄', p: 200 }, { e: '🐉', p: 250 }, { e: '🧑‍🚀', p: 300 }, { e: '🧑‍🔬', p: 300 }, { e: '👑', p: 400 }, { e: '🌟', p: 500 }
];

/* ---------------- الإعدادات المرئية ---------------- */
/* تقليل الحركة: من إعداد التطبيق أو من إعداد الهاتف (prefers-reduced-motion) */
N.motionReduced = function () {
  try { if (N.DB.data && N.DB.data.settings.motion) return true; return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
};
try { matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => N.applySettings()); } catch (e) {}
N.applySettings = function () {
  const s = N.DB.data.settings, H = document.documentElement;
  N.lang = s.lang || 'ar';
  H.lang = N.lang; H.dir = N.lang === 'ar' ? 'rtl' : 'ltr';
  H.dataset.font = s.font; H.dataset.contrast = s.contrast ? 'high' : ''; H.dataset.motion = N.motionReduced() ? 'reduce' : '';
  const kid = N.Kids.cur; H.dataset.stage = kid ? N.Kids.stage(kid) : 'pri';
  document.title = N.t('appName');
};
N.readAloud = function () {
  const s = N.DB.data.settings.read;
  if (s === 'on') return true; if (s === 'off') return false;
  const kid = N.Kids.cur; return !!kid && ['kg', 'g1', 'g2'].includes(kid.grade);
};

/* ---------------- الأصوات (مولّدة داخل التطبيق) ---------------- */
N.Sound = {
  ctx: null,
  ac() {
    if (!N.DB.data.settings.sfx) return null;
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },
  tone(f, dur = .12, type = 'sine', vol = .15, slide = 0, delay = 0) {
    const c = this.ac(); if (!c) return;
    const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, f + slide), t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0005, t + dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + .03);
  },
  tap() { this.tone(660, .06, 'sine', .08); },
  noise(dur, f1, f2, vol = .12, q = 3, delay = 0) {   // نقرة ضجيج مرشّحة (من أثير)
    const c = this.ac(); if (!c) return;
    const t = c.currentTime + delay, len = Math.ceil(c.sampleRate * dur), buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = buf; const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q;
    bp.frequency.setValueAtTime(f1, t); bp.frequency.linearRampToValueAtTime(f2, t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(vol, t); g.gain.linearRampToValueAtTime(0, t + dur);
    s.connect(bp).connect(g).connect(c.destination); s.start(t); s.stop(t + dur + .02);
  },
  pop() { this.tone(700 + Math.random() * 200, .09, 'sine', .14, 500); this.noise(.05, 2000, 3000, .06, 2); },
  match(level) { const f = 330 * Math.pow(1.12, Math.min(level, 8)); this.tone(f, .16, 'sine', .14, f * .5); this.tone(f * 1.5, .2, 'triangle', .06, 0, .04); [880, 1175, 1568].forEach((x, i) => this.tone(x, .12, 'sine', .07, 0, .08 + i * .05)); },
  ok() { [660, 880, 1175].forEach((f, i) => this.tone(f, .14, 'triangle', .12, 0, i * .07)); },
  soft() { this.tone(330, .16, 'sine', .08, -60); },   // صوت هادئ غير مُحبِط عند الخطأ
  place() { this.tone(520, .07, 'sine', .08, 120); },
  found() { [784, 988, 1319].forEach((f, i) => this.tone(f, .16, 'sine', .11, 0, i * .06)); },
  win() { [523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, .24, 'triangle', .13, 0, i * .11)); },
  star(i) { this.tone(880 + i * 220, .2, 'sine', .12, 200); }
};

/* ---------------- النطق ---------------- */
N.speak = function (text, lang) {
  if (!text) return;
  lang = lang || 'ar';
  try {
    if (window.AndroidBridge && AndroidBridge.speakLang) { AndroidBridge.speakLang(String(text), lang); return; }
    if (window.speechSynthesis) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = lang === 'en' ? 'en-US' : 'ar-SA'; u.rate = lang === 'en' ? .85 : .9;
      const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith(lang)); if (v) u.voice = v;
      speechSynthesis.speak(u);
    }
  } catch (e) {}
};

/* ---------------- رسائل عائمة واحتفال ---------------- */
N.toast = function (text) {
  const t = document.createElement('div'); t.className = 'tst'; t.textContent = text;
  $('#toasts').appendChild(t); setTimeout(() => t.remove(), 2900);
};
N.confetti = function (n = 90) {
  if (N.motionReduced()) return;
  const cv = $('#fx'), dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cols = ['#12A5A0', '#F5B700', '#F28C28', '#2FA84F', '#5B6BD6', '#D9608F'];
  const ps = Array.from({ length: n }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 120, y: innerHeight * .35, vx: (Math.random() - .5) * 12, vy: -Math.random() * 12 - 4, r: 4 + Math.random() * 5, c: cols[Math.floor(Math.random() * cols.length)], a: Math.random() * 6, va: (Math.random() - .5) * .3 }));
  let f = 0;
  (function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .35; p.vx *= .99; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore(); });
    if (++f < 150) requestAnimationFrame(loop); else ctx.clearRect(0, 0, innerWidth, innerHeight);
  })();
};

/* ---------------- وقت الاستخدام ---------------- */
N.Time = {
  start() {
    setInterval(() => {
      if (document.hidden) return;
      const kid = N.Kids.cur; if (!kid) return;
      const p = N.Kids.prog(kid), d = today();
      p.minutes[d] = Math.round(((p.minutes[d] || 0) + 0.25) * 100) / 100;
      N.DB.save();
    }, 15000);
  },
  minutes(kid) { const p = N.Kids.prog(kid); return Math.floor(p ? (p.minutes[today()] || 0) : 0); },
  over(kid) {
    kid = kid || N.Kids.cur; if (!kid) return false;
    const par = N.DB.data.parent; if (!par.limit) return false;
    const extra = (par.extra && par.extra[kid.id + ':' + today()]) || 0;
    return this.minutes(kid) >= par.limit + extra;
  }
};
