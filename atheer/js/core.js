/* =====================================================================
   ألعاب أثير وبشرى (ونسخها الأخرى) — النواة المشتركة
   ملفات اللاعبين، الثيمات، الأصوات والموسيقى، النجوم والمتجر،
   الإنجازات، الهدية اليومية، التعليمات، والتنقّل بين الشاشات.
   ===================================================================== */
'use strict';

/* دعم roundRect في المتصفحات القديمة */
if (!CanvasRenderingContext2D.prototype.roundRect) CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) { r = Math.min(+r || 0, w / 2, h / 2); this.moveTo(x + r, y); this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r); this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r); this.closePath(); return this; };

const $ = s => document.querySelector(s);
const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* تخزين عام (إعدادات الجهاز) */
const gstore = {
  get(k, d) { try { const v = localStorage.getItem('app:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('app:' + k, JSON.stringify(v)); } catch (e) {} }
};
/* تخزين خاص باللاعب الحالي: كل لاعب له نتائجه ونجومه ومشترياته */
const store = {
  key(k) { return (App.profile ? App.profile.id : App.PROFILES[0].id) + ':' + k; },
  get(k, d) { try { const v = localStorage.getItem(this.key(k)); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(this.key(k), JSON.stringify(v)); } catch (e) {} }
};

/* إطار كانفاس بكثافة البكسل الصحيحة */
function fitCanvas(cv) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  const w = cv.clientWidth, h = cv.clientHeight;
  cv.width = Math.max(1, Math.round(w * dpr)); cv.height = Math.max(1, Math.round(h * dpr));
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h, dpr };
}
function vibrate(ms) { if (!gstore.get('vib', true)) return; try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} }

/* =====================================================================
   المؤثرات الصوتية (مولّدة بالكامل داخل التطبيق)
   ===================================================================== */
const Sound = {
  ctx: null,
  get on() { return gstore.get('sfx', true); },
  ac(force) {
    if (!force && !this.on && !Music.on) return null;
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },
  sfx() { return this.on ? this.ac() : null; },
  tone(freq, dur = .12, type = 'sine', vol = .18, slide = 0, delay = 0) {
    const c = this.sfx(); if (!c) return;
    const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq + slide), t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01);
    g.gain.exponentialRampToValueAtTime(.0005, t + dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + .02);
  },
  noise(dur, f1, f2, vol = .2, q = 8, delay = 0) {
    const c = this.sfx(); if (!c) return;
    const t = c.currentTime + delay, len = Math.ceil(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const s = c.createBufferSource(); s.buffer = buf;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q;
    bp.frequency.setValueAtTime(f1, t); bp.frequency.linearRampToValueAtTime(f2, t + dur);
    const g = c.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .015);
    g.gain.setValueAtTime(vol, t + dur * .8); g.gain.linearRampToValueAtTime(0, t + dur);
    s.connect(bp).connect(g).connect(c.destination); s.start(t); s.stop(t + dur + .02);
  },
  /* صرير الطباشير */
  squeak(dur = .35, delay = 0) {
    const c = this.sfx(); if (!c) return;
    this.noise(dur, 2600, 3400, .07, 3, delay);
    const t = c.currentTime + delay, o = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
    o.type = 'sawtooth'; o.frequency.value = rand(2300, 2900);
    lfo.frequency.value = rand(28, 45); lg.gain.value = 140; lfo.connect(lg).connect(o.frequency);
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3000; bp.Q.value = 6;
    g.gain.setValueAtTime(0, t);
    for (let k = 0; k < 4; k++) { const a = t + dur * k / 4; g.gain.linearRampToValueAtTime(rand(.02, .05), a + .02); g.gain.linearRampToValueAtTime(.004, a + dur / 4); }
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(bp).connect(g).connect(c.destination); o.start(t); lfo.start(t); o.stop(t + dur + .05); lfo.stop(t + dur + .05);
  },
  jump() { this.tone(420, .14, 'sine', .14, 380); },
  spring() { this.tone(300, .3, 'triangle', .18, 900); this.tone(600, .25, 'sine', .08, 900, .05); },
  poof() { this.noise(.25, 900, 300, .15, 1.5); },
  fall() { this.tone(600, .7, 'triangle', .16, -480); },
  star() { [880, 1175, 1568].forEach((f, i) => this.tone(f, .14, 'sine', .12, 0, i * .06)); },
  slide() { this.noise(.08, 500, 1200, .05, 2); },
  merge(level) { const f = 260 * Math.pow(1.12, level); this.tone(f, .18, 'sine', .16, f * .5); this.tone(f * 1.5, .2, 'triangle', .06, 0, .03); },
  win() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, .22, 'triangle', .15, 0, i * .11)); },
  lose() { [392, 330, 262].forEach((f, i) => this.tone(f, .3, 'triangle', .14, 0, i * .16)); },
  tap() { this.tone(660, .06, 'sine', .1); },
  pop() { this.tone(rand(700, 900), .09, 'sine', .14, 500); this.noise(.05, 2000, 3000, .05, 2); },
  thud() { this.tone(140, .12, 'sine', .2, -60); },
  coin() { this.tone(988, .07, 'square', .06); this.tone(1319, .18, 'square', .06, 0, .07); },
  erase() { this.noise(.6, 400, 900, .12, .8); },
  boom() { this.noise(.5, 600, 80, .3, .7); this.tone(90, .4, 'sine', .25, -50); },
  whoosh() { this.noise(.35, 300, 2400, .12, 1.2); },
  error() { this.tone(220, .18, 'square', .06, -40); }
};

/* =====================================================================
   الموسيقى الخلفية: مُسلسِل خفيف يولّد لحنًا هادئًا لكل لعبة
   ===================================================================== */
const Music = {
  get on() { return gstore.get('music', true); },
  timer: null, gain: null, step: 0, next: 0, track: null, name: null,
  TRACKS: {
    menu:    { bpm: 96,  root: 72, scale: [0, 2, 4, 7, 9],      wave: 'triangle', seed: 3, chords: [0, 5, 3, 4] },
    sky:     { bpm: 108, root: 74, scale: [0, 2, 4, 7, 9],      wave: 'sine',     seed: 7, chords: [0, 3, 4, 0] },
    space:   { bpm: 76,  root: 69, scale: [0, 2, 3, 7, 8],      wave: 'sine',     seed: 11, chords: [0, 5, 3, 4], pad: true },
    class:   { bpm: 100, root: 67, scale: [0, 2, 4, 5, 7, 9],   wave: 'square',   seed: 5, chords: [0, 3, 4, 0], soft: true },
    blocks:  { bpm: 126, root: 69, scale: [0, 2, 3, 5, 7, 8, 11], wave: 'square', seed: 19, chords: [0, 5, 3, 4], soft: true },
    bubbles: { bpm: 112, root: 76, scale: [0, 2, 4, 7, 9],      wave: 'triangle', seed: 23, chords: [0, 3, 5, 4] },
    balls:   { bpm: 118, root: 71, scale: [0, 2, 4, 7, 9],      wave: 'triangle', seed: 29, chords: [0, 4, 5, 3] },
    candy:   { bpm: 116, root: 74, scale: [0, 2, 4, 7, 9],      wave: 'triangle', seed: 37, chords: [0, 5, 3, 4] },
    shapes:  { bpm: 92,  root: 72, scale: [0, 2, 4, 5, 7, 9],   wave: 'sine',     seed: 31, chords: [0, 3, 4, 0] },
    memory:  { bpm: 98,  root: 72, scale: [0, 2, 4, 7, 9],      wave: 'triangle', seed: 41, chords: [0, 3, 4, 0] },
    tubes:   { bpm: 84,  root: 69, scale: [0, 2, 4, 7, 9],      wave: 'sine',     seed: 43, chords: [0, 5, 3, 4], pad: true },
    snake:   { bpm: 124, root: 74, scale: [0, 2, 4, 7, 9],      wave: 'square',   seed: 47, chords: [0, 4, 5, 3], soft: true },
    slide:   { bpm: 90,  root: 71, scale: [0, 2, 4, 5, 7, 9],   wave: 'triangle', seed: 53, chords: [0, 3, 4, 0] },
    butterfly: { bpm: 110, root: 76, scale: [0, 2, 4, 7, 9],    wave: 'sine',     seed: 59, chords: [0, 3, 5, 4] },
    letters: { bpm: 92,  root: 72, scale: [0, 2, 4, 5, 7, 9],   wave: 'triangle', seed: 61, chords: [0, 3, 4, 0] },
    numbers: { bpm: 100, root: 74, scale: [0, 2, 4, 7, 9],      wave: 'triangle', seed: 67, chords: [0, 5, 3, 4] },
    maze:    { bpm: 96,  root: 69, scale: [0, 2, 3, 7, 8],      wave: 'sine',     seed: 71, chords: [0, 5, 3, 4] },
    diff:    { bpm: 88,  root: 71, scale: [0, 2, 4, 7, 9],      wave: 'sine',     seed: 73, chords: [0, 3, 4, 0], pad: true },
    taxi:    { bpm: 132, root: 74, scale: [0, 2, 4, 7, 9],      wave: 'square',   seed: 79, chords: [0, 4, 5, 3], soft: true },
    cake:    { bpm: 96,  root: 76, scale: [0, 2, 4, 7, 9],      wave: 'triangle', seed: 83, chords: [0, 3, 4, 0] }
  },
  play(name) {
    if (this.name === name && this.timer) return;
    this.stop(); this.name = name;
    if (!this.on || !this.TRACKS[name]) return;
    const c = Sound.ac(true); if (!c) return;
    const tr = this.TRACKS[name];
    // لحن من 32 خطوة مولّد من بذرة ثابتة كي يتكرر نفس اللحن في كل مرة
    let seed = tr.seed * 9973; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    let idx = 2; const mel = [];
    for (let i = 0; i < 32; i++) {
      if (i % 8 === 0 || rnd() < .7) { idx = clamp(idx + Math.round((rnd() - .5) * 4), 0, tr.scale.length * 2 - 1); mel.push(idx); }
      else mel.push(-1);
    }
    this.track = { ...tr, mel };
    this.gain = c.createGain(); this.gain.gain.value = 0; this.gain.connect(c.destination);
    this.gain.gain.linearRampToValueAtTime(tr.soft ? .045 : .07, c.currentTime + 1.2);
    this.step = 0; this.next = c.currentTime + .1;
    this.timer = setInterval(() => this.tick(), 40);
  },
  note(midi, t, dur, type, vol) {
    const c = Sound.ctx, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(g).connect(this.gain); o.start(t); o.stop(t + dur + .05);
  },
  tick() {
    const c = Sound.ctx; if (!c || !this.track) return;
    if (c.state === 'suspended') return;
    const tr = this.track, spb = 60 / tr.bpm / 2; // ثُمن نغمة
    while (this.next < c.currentTime + .2) {
      const i = this.step % 32, m = tr.mel[i];
      const deg = n => { const L = tr.scale.length; return tr.root + tr.scale[((n % L) + L) % L] + 12 * Math.floor(n / L); };
      if (m >= 0) this.note(deg(m), this.next, spb * 1.8, tr.wave, tr.wave === 'square' ? .25 : .5);
      if (i % 8 === 0) { // باص وتآلف
        const ch = tr.chords[(this.step / 8 | 0) % tr.chords.length];
        this.note(tr.root - 24 + tr.scale[ch % tr.scale.length], this.next, spb * 7, 'sine', .6);
        if (tr.pad) { this.note(tr.root - 12 + tr.scale[ch % tr.scale.length], this.next, spb * 8, 'sine', .25); this.note(tr.root - 12 + tr.scale[(ch + 2) % tr.scale.length], this.next, spb * 8, 'sine', .2); }
      }
      if (i % 4 === 2 && !tr.pad) this.note(tr.root + 12 + tr.scale[(i / 4 | 0) % tr.scale.length], this.next, spb * .5, 'sine', .08);
      this.next += spb; this.step++;
    }
  },
  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    if (this.gain && Sound.ctx) { const g = this.gain, t = Sound.ctx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + .4); setTimeout(() => g.disconnect(), 600); }
    this.gain = null; this.track = null; this.name = null;
  }
};

/* =====================================================================
   التطبيق
   ===================================================================== */
const App = {
  games: {}, order: [], current: 'menu', profile: null, customLogo: false,
  EDITION: window.EDITION,
  PROFILES: window.EDITION.profiles,
  shop: [], shopCats: {
    hero: { title: 'أبطال فارس السحاب', icon: '🛡️' },
    xo:   { title: 'رموز إكس أو', icon: '✏️' },
    ball: { title: 'كرات مطر الكرات', icon: '⚽' }
  },
  ACH: [
    { id: 'jump_100',    g: 'jump',    i: '☁️', t: 'أول قفزات',        d: 'الوصول إلى ارتفاع 100 م' },
    { id: 'jump_castle', g: 'jump',    i: '🏰', t: 'زائر القلعة',       d: 'الوصول إلى ارتفاع 1500 م' },
    { id: 'jump_space',  g: 'jump',    i: '🚀', t: 'إلى الفضاء',        d: 'الوصول إلى ارتفاع 3000 م' },
    { id: 'jump_rocket', g: 'jump',    i: '🔥', t: 'انطلاقة صاروخية',  d: 'استخدام الصاروخ' },
    { id: 'cosmos_moon', g: 'cosmos',  i: '🌕', t: 'صانع الأقمار',      d: 'صنع قمر (32)' },
    { id: 'cosmos_planet', g: 'cosmos', i: '🌍', t: 'كوكب أزرق',        d: 'صنع كوكب أزرق (128)' },
    { id: 'cosmos_sun',  g: 'cosmos',  i: '☀️', t: 'الشمس المتوهّجة',  d: 'صنع شمس (2048)' },
    { id: 'cosmos_timed', g: 'cosmos', i: '⏱️', t: 'سباق الزمن',        d: '2000 نقطة في وضع التحدي الزمني' },
    { id: 'xo_draw',     g: 'chalk',   i: '🤝', t: 'ندّ للذكاء',        d: 'التعادل مع الذكاء الذي لا يُقهر' },
    { id: 'xo_win5',     g: 'chalk',   i: '✏️', t: 'خمسة انتصارات',     d: 'الفوز 5 مرات على الذكاء' },
    { id: 'xo_ultimate', g: 'chalk',   i: '🧠', t: 'العبقري',           d: 'الفوز في إكس أو الخارقة' },
    { id: 'xo_series',   g: 'chalk',   i: '🏆', t: 'بطل السلسلة',       d: 'الفوز بسلسلة الأفضل من 5' },
    { id: 'blocks_line', g: 'blocks',  i: '🧱', t: 'أول صف',            d: 'إكمال أول صف في قلعة المكعبات' },
    { id: 'blocks_four', g: 'blocks',  i: '💥', t: 'رباعية!',            d: 'إزالة 4 صفوف دفعة واحدة' },
    { id: 'blocks_lvl5', g: 'blocks',  i: '🏯', t: 'باني القلاع',        d: 'الوصول إلى المستوى 5' },
    { id: 'bub_first',   g: 'bubbles', i: '🫧', t: 'أول مرحلة',          d: 'إنهاء أول مرحلة في مدفع الفقاعات' },
    { id: 'bub_drop',    g: 'bubbles', i: '🌧️', t: 'شلال فقاعات',       d: 'إسقاط 10 فقاعات بطلقة واحدة' },
    { id: 'bub_lvl10',   g: 'bubbles', i: '🐣', t: 'منقذ الحيوانات',    d: 'إنهاء المرحلة 10' },
    { id: 'balls_10',    g: 'balls',   i: '⚽', t: 'رامي الكرات',        d: 'الوصول إلى الجولة 10' },
    { id: 'balls_30',    g: 'balls',   i: '🌟', t: 'نجم الملعب',         d: 'الوصول إلى الجولة 30' },
    { id: 'balls_combo', g: 'balls',   i: '🎯', t: 'رمية خارقة',         d: 'كسر 5 مربعات برمية واحدة' },
    { id: 'shapes_first', g: 'shapes', i: '🔷', t: 'أول لغز',            d: 'إنهاء أول مستوى في مطابقة الأشكال' },
    { id: 'shapes_perfect', g: 'shapes', i: '💯', t: 'بلا أخطاء',        d: 'إنهاء مستوى دون أي خطأ' },
    { id: 'shapes_all',  g: 'shapes',  i: '🎓', t: 'خبير الأشكال',       d: 'إنهاء كل مستويات مطابقة الأشكال' },
    { id: 'candy_first', g: 'candy',   i: '🍬', t: 'أول حلوى',            d: 'إنهاء أول مستوى في لعبة الحلويات' },
    { id: 'candy_special', g: 'candy', i: '🍭', t: 'حلوى خارقة',          d: 'صنع حلوى خاصة بمطابقة 4 أو 5' },
    { id: 'candy_lvl10', g: 'candy',   i: '🎂', t: 'نجم الحلويات',       d: 'إنهاء المستوى 10' },
    { id: 'mem_first',   g: 'memory',  i: '🃏', t: 'ذاكرة قوية',          d: 'إنهاء أول لوحة في بطاقات الذاكرة' },
    { id: 'mem_perfect', g: 'memory',  i: '🧠', t: 'ذاكرة حديدية',        d: 'إنهاء لوحة بأخطاء قليلة جدًا' },
    { id: 'mem_big',     g: 'memory',  i: '🎴', t: 'اللوحة الكبيرة',      d: 'إنهاء لوحة من 12 زوجًا' },
    { id: 'tubes_first', g: 'tubes',   i: '🧪', t: 'أول فرز',             d: 'إنهاء أول مستوى في أنابيب الألوان' },
    { id: 'tubes_10',    g: 'tubes',   i: '🌈', t: 'خبير الألوان',        d: 'إنهاء المستوى 10' },
    { id: 'tubes_30',    g: 'tubes',   i: '⚗️', t: 'كيميائي صغير',        d: 'إنهاء المستوى 30' },
    { id: 'snake_10',    g: 'snake',   i: '🐛', t: 'دودة جائعة',          d: 'أكل 10 فواكه في جولة واحدة' },
    { id: 'snake_30',    g: 'snake',   i: '🐍', t: 'دودة عملاقة',         d: 'الوصول إلى طول 30' },
    { id: 'snake_gold',  g: 'snake',   i: '🍏', t: 'التفاحة الذهبية',     d: 'أكل فاكهة ذهبية' },
    { id: 'slide_first', g: 'slide',   i: '🧩', t: 'أول لغز',             d: 'حل أول لغز صور منزلقة' },
    { id: 'slide_4',     g: 'slide',   i: '🖼️', t: 'محترف الألغاز',      d: 'حل لغز 4×4' },
    { id: 'slide_fast',  g: 'slide',   i: '⚡', t: 'سريع جدًا',            d: 'حل لغز 3×3 في أقل من دقيقة' },
    { id: 'bfly_first',  g: 'butterfly', i: '🦋', t: 'صياد الفراشات',     d: 'إنهاء أول جولة في صيد الفراشات' },
    { id: 'bfly_50',     g: 'butterfly', i: '🌼', t: 'عين الصقر',         d: 'صيد 50 فراشة صحيحة' },
    { id: 'bfly_lvl10',  g: 'butterfly', i: '🌈', t: 'خبير الألوان',      d: 'الوصول إلى المستوى 10' },
    { id: 'let_first',   g: 'letters', i: '✍️', t: 'أول حرف',             d: 'تتبّع أول حرف' },
    { id: 'let_ar',      g: 'letters', i: '🔤', t: 'الحروف العربية',     d: 'تتبّع الحروف العربية الـ28 كلها' },
    { id: 'let_en',      g: 'letters', i: '🅰️', t: 'ABC',                d: 'تتبّع الحروف الإنجليزية الـ26 كلها' },
    { id: 'num_first',   g: 'numbers', i: '🔢', t: 'أول عدّ',            d: 'إنهاء أول مستوى في أرقام وعدّ' },
    { id: 'num_add',     g: 'numbers', i: '➕', t: 'بطل الجمع',          d: 'حل 20 مسألة جمع' },
    { id: 'num_all',     g: 'numbers', i: '🧮', t: 'عبقري الأرقام',      d: 'إنهاء كل مستويات الأرقام' },
    { id: 'maze_first',  g: 'maze',    i: '🧭', t: 'أول متاهة',          d: 'حل أول متاهة' },
    { id: 'maze_10',     g: 'maze',    i: '🗺️', t: 'مستكشف',             d: 'حل 10 متاهات' },
    { id: 'maze_big',    g: 'maze',    i: '🏆', t: 'سيد المتاهات',       d: 'حل أكبر متاهة' },
    { id: 'diff_first',  g: 'diff',    i: '🔍', t: 'عين حادة',            d: 'إيجاد كل الفروق في أول صورة' },
    { id: 'diff_fast',   g: 'diff',    i: '⚡', t: 'محقق سريع',           d: 'إيجاد 5 فروق في أقل من 30 ثانية' },
    { id: 'diff_all',    g: 'diff',    i: '🕵️', t: 'المحقق الكبير',      d: 'إنهاء كل صور الاختلافات' },
    { id: 'taxi_first',  g: 'taxi',    i: '🚕', t: 'أول توصيلة',          d: 'توصيل أول راكب' },
    { id: 'taxi_10',     g: 'taxi',    i: '🧍', t: 'سائق محترف',         d: 'توصيل 10 ركاب في جولة واحدة' },
    { id: 'taxi_far',    g: 'taxi',    i: '🛣️', t: 'طريق طويل',          d: 'قطع 3000 متر في جولة واحدة' },
    { id: 'cake_first',  g: 'cake',    i: '🎂', t: 'أول كعكة',           d: 'تزيين أول كعكة' },
    { id: 'cake_order',  g: 'cake',    i: '📋', t: 'طاهٍ ماهر',           d: 'إنجاز 10 طلبات للزبائن' },
    { id: 'cake_artist', g: 'cake',    i: '🎨', t: 'فنان الكريمة',       d: 'رسم 20 خطًا بالكريمة على كعكة واحدة' },
    { id: 'daily_3',     g: '',        i: '🎁', t: 'وفاء يومي',          d: 'فتح الهدية اليومية 3 أيام متتالية' },
    { id: 'shop_first',  g: '',        i: '🛍️', t: 'أول مشتريات',       d: 'شراء أول عنصر من المتجر' },
    { id: 'all_games',   g: '',        i: '🎮', t: 'مستكشف الألعاب',     d: 'تجربة الألعاب السبع كلها' }
  ],

  /* ---------- أدوات عامة للألعاب ---------- */
  get theme() { return document.documentElement.dataset.theme; },
  /** نص بصيغة المؤنث أو المذكر حسب ثيم اللاعب */
  g(fem, masc) { return this.theme === 'boys' ? masc : fem; },
  css(text) { const s = document.createElement('style'); s.textContent = text; document.head.appendChild(s); },
  section(id, html) {
    const s = document.createElement('section'); s.id = id; s.className = 'screen'; s.innerHTML = html;
    document.body.insertBefore(s, $('#sheetWrap')); return s;
  },
  register(def) { this.games[def.id] = def; this.order.push(def.id); },
  shopItem(it) { this.shop.push(it); },
  equipped(cat) { const def = this.shop.find(i => i.cat === cat && !i.price); return store.get('eq:' + cat, def ? def.id : null); },
  owns(id) { const it = this.shop.find(i => i.id === id); return !it || !it.price || store.get('own', []).includes(id); },
  stars() { return store.get('stars', 0); },
  addStars(n, why) {
    if (!n) return;
    store.set('stars', Math.max(0, this.stars() + n));
    this.paintStars();
    if (n > 0) { this.toast(`+${n} ⭐${why ? ' ' + why : ''}`); Sound.coin(); }
  },
  achieve(id) {
    const a = this.ACH.find(x => x.id === id); if (!a) return;
    const got = store.get('ach', []); if (got.includes(id)) return;
    got.push(id); store.set('ach', got);
    setTimeout(() => { this.toast(`🏆 إنجاز جديد: ${a.t}`); Sound.win(); this.addStars(10); }, 300);
  },
  hasAch(id) { return store.get('ach', []).includes(id); },
  toast(text) {
    const t = document.createElement('div'); t.className = 'tst'; t.textContent = text;
    $('#toasts').appendChild(t); setTimeout(() => t.remove(), 2700);
  },
  speak(text) {
    if (!gstore.get('sfx', true)) return;
    try {
      if (window.AndroidBridge && AndroidBridge.speak) { AndroidBridge.speak(text); return; }
      if (window.speechSynthesis) {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text); u.lang = 'ar-SA'; u.rate = .9; u.pitch = 1.15;
        const v = speechSynthesis.getVoices().find(v => /^ar/i.test(v.lang)); if (v) u.voice = v;
        speechSynthesis.speak(u);
      }
    } catch (e) {}
  },

  /* ---------- التنقّل ---------- */
  show(id) {
    const prev = this.games[this.current];
    if (prev && prev.leave) prev.leave();
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
    this.current = id;
    const g = this.games[id];
    if (g) {
      const played = store.get('played', []);
      if (!played.includes(id)) { played.push(id); store.set('played', played); if (played.length >= this.order.length) this.achieve('all_games'); }
      Music.play(g.music || 'menu');
      if (g.enter) g.enter();
      if (!store.get('help:' + id, false)) { store.set('help:' + id, true); setTimeout(() => this.help(id), 250); }
    } else {
      Music.play('menu');
      this.renderMenu();
    }
    try { history.replaceState(null, '', id === 'menu' ? location.pathname : '#' + id); } catch (e) {}
  },
  /** زر الرجوع (أندرويد / Esc): يغلق النافذة أولًا، ثم يعود للقائمة، ثم يخرج */
  back() {
    if ($('#sheetWrap').classList.contains('on')) { this.closeSheet(); return 'ok'; }
    const g = this.games[this.current];
    if (g) { if (g.back && g.back()) return 'ok'; this.show('menu'); return 'ok'; }
    return 'exit';
  },

  /* ---------- النوافذ العامة ---------- */
  sheetClose: null,
  openSheet(html, onClose) {
    const g = this.games[this.current];
    if (g && g.pause && !$('#sheetWrap').classList.contains('on')) g.pause();
    $('#sheet').innerHTML = `<button class="close" aria-label="إغلاق">✕</button>` + html;
    $('#sheetWrap').classList.add('on');
    $('#sheet').scrollTop = 0;
    $('#sheet .close').onclick = () => { Sound.tap(); this.closeSheet(); };
    this.sheetClose = onClose || null;
    return $('#sheet');
  },
  closeSheet() {
    $('#sheetWrap').classList.remove('on');
    const cb = this.sheetClose; this.sheetClose = null; if (cb) cb();
    const g = this.games[this.current];
    if (g && g.resume) g.resume();
    if (this.current === 'menu') this.renderMenu();
  },
  help(id) {
    const g = this.games[id]; if (!g) return;
    const lines = typeof g.help === 'function' ? g.help() : g.help;
    const s = this.openSheet(`<h3>${g.icon2 || '❓'} ${g.title}</h3><ul class="helpl">${lines.map(l => `<li>${l}</li>`).join('')}</ul>
      <div class="center"><button class="tbtn" id="hGo">${this.g('هيا نلعب!', 'هيا نلعب!')} ▶️</button></div>`);
    s.querySelector('#hGo').onclick = () => { Sound.tap(); this.closeSheet(); };
  },
  settings() {
    const P = this.profile, th = this.theme;
    const seg = (key, opts, val) => `<div class="seg" data-k="${key}">${opts.map(([v, l]) => `<button data-v="${v}" class="${String(v) === String(val) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    const s = this.openSheet(`<h3>⚙️ الإعدادات</h3>
      <div class="row"><span class="lbl">👤 اللاعب</span>${seg('player', this.PROFILES.map(p => [p.id, p.name]), P.id)}</div>
      <div class="row"><span class="lbl">🎨 الثيم</span>${seg('theme', [['girls', '👑 بناتي'], ['boys', '🚀 ولادي']], th)}</div>
      <div class="row"><span class="lbl">🔊 المؤثرات</span>${seg('sfx', [[true, 'تشغيل'], [false, 'إيقاف']], gstore.get('sfx', true))}</div>
      <div class="row"><span class="lbl">🎵 الموسيقى</span>${seg('music', [[true, 'تشغيل'], [false, 'إيقاف']], gstore.get('music', true))}</div>
      <div class="row"><span class="lbl">📳 الاهتزاز</span>${seg('vib', [[true, 'تشغيل'], [false, 'إيقاف']], gstore.get('vib', true))}</div>
      <div class="row"><span class="lbl">🔠 حجم الخط</span>${seg('font', [['normal', 'عادي'], ['large', 'كبير']], gstore.get('font', 'normal'))}</div>
      <div class="row"><span class="lbl">🗑️ بيانات ${P.name}</span><button class="tbtn alt" id="sReset" style="font-size:14px;padding:6px 14px">مسح النتائج</button></div>
      <p class="center" style="font-size:12px;opacity:.6;margin:8px 0 0">الثيم يغيّر شكل القائمة فقط، ولا يغيّر الألعاب.</p>`);
    s.querySelectorAll('.seg').forEach(sg => sg.querySelectorAll('button').forEach(b => b.onclick = () => {
      const k = sg.dataset.k, raw = b.dataset.v, v = raw === 'true' ? true : raw === 'false' ? false : raw;
      Sound.tap();
      if (k === 'player') { this.setProfile(v); return; }
      if (k === 'theme') { store.set('theme', v); this.applyTheme(); }
      else if (k === 'font') { gstore.set('font', v); document.documentElement.dataset.font = v; }
      else { gstore.set(k, v); if (k === 'music') { if (v) { const g = this.games[this.current]; Music.play(g ? g.music : 'menu'); } else Music.stop(); } }
      this.settings();
    }));
    let armed = false;
    s.querySelector('#sReset').onclick = e => {
      if (!armed) { armed = true; e.target.textContent = 'اضغط مرة أخرى للتأكيد'; return; }
      const keep = ['theme'];
      Object.keys(localStorage).filter(k => k.startsWith(P.id + ':') && !keep.includes(k.slice(P.id.length + 1))).forEach(k => localStorage.removeItem(k));
      this.toast('تم مسح بيانات ' + P.name); this.closeSheet();
    };
  },
  shopSheet(cat) {
    const cats = Object.keys(this.shopCats).filter(c => this.shop.some(i => i.cat === c));
    cat = cat || cats[0];
    const items = this.shop.filter(i => i.cat === cat), eq = this.equipped(cat), stars = this.stars();
    const s = this.openSheet(`<h3>🛍️ المتجر <small style="font-size:16px;color:var(--t-accent-d)">⭐ ${stars}</small></h3>
      <div class="tabs seg" style="display:flex;justify-content:center">${cats.map(c => `<button data-c="${c}" class="${c === cat ? 'on' : ''}">${this.shopCats[c].icon} ${this.shopCats[c].title}</button>`).join('')}</div>
      <div class="items">${items.map(i => {
        const own = this.owns(i.id), isEq = eq === i.id;
        const btn = isEq ? `<button class="eqb" disabled>✔️ مختار</button>` : own ? `<button class="eqb" data-eq="${i.id}">اختيار</button>` :
          `<button data-buy="${i.id}" class="${stars < i.price ? 'no' : ''}">شراء</button>`;
        return `<div class="item ${isEq ? 'eq' : ''}"><canvas width="168" height="168" data-p="${i.id}"></canvas><b>${i.name}</b><span class="price">${own ? (i.price ? 'تملكه' : 'مجاني') : '⭐ ' + i.price}</span>${btn}</div>`;
      }).join('')}</div>
      <p class="center" style="font-size:13px;opacity:.7;margin:10px 0 0">اجمع النجوم باللعب والإنجازات والهدية اليومية ⭐</p>`);
    s.querySelectorAll('.tabs button').forEach(b => b.onclick = () => { Sound.tap(); this.shopSheet(b.dataset.c); });
    s.querySelectorAll('canvas[data-p]').forEach(cv => { const it = this.shop.find(i => i.id === cv.dataset.p); const c = cv.getContext('2d'); c.scale(2, 2); try { it.draw(c, 84); } catch (e) { console.warn(e); } });
    s.querySelectorAll('[data-eq]').forEach(b => b.onclick = () => { Sound.tap(); store.set('eq:' + cat, b.dataset.eq); this.shopSheet(cat); });
    s.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => {
      const it = this.shop.find(i => i.id === b.dataset.buy);
      if (this.stars() < it.price) { Sound.error(); this.toast(`تحتاج ${it.price - this.stars()} ⭐ أخرى`); return; }
      this.addStars(-it.price); const own = store.get('own', []); own.push(it.id); store.set('own', own);
      store.set('eq:' + cat, it.id); Sound.win(); this.toast(`🎉 ${it.name} أصبح لك!`); this.achieve('shop_first'); this.shopSheet(cat);
    });
  },
  achSheet() {
    const got = store.get('ach', []);
    const s = this.openSheet(`<h3>🏆 الإنجازات (${got.length}/${this.ACH.length})</h3>` + this.ACH.map(a =>
      `<div class="ach ${got.includes(a.id) ? '' : 'lock'}"><span class="ai">${a.i}</span><div><b>${a.t}</b><small>${a.d}</small></div><span class="ok">${got.includes(a.id) ? '✅' : '🔒'}</span></div>`).join('') +
      `<p class="center" style="font-size:13px;opacity:.7">كل إنجاز يمنحك 10 ⭐</p>`);
  },
  today() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); },
  daily() {
    const st = store.get('daily', { last: '', streak: 0 });
    if (st.last === this.today()) { this.toast('عُد غدًا لهدية جديدة 🎁'); return; }
    const y = new Date(Date.now() - 864e5), yk = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
    st.streak = st.last === yk ? st.streak + 1 : 1; st.last = this.today(); store.set('daily', st);
    const n = 5 + 2 * Math.min(st.streak - 1, 5);
    const s = this.openSheet(`<h3>🎁 هدية اليوم</h3><div class="center" style="font-size:70px;animation:pop .5s">⭐</div>
      <p class="center" style="font-size:22px;font-weight:800;margin:4px 0">+${n} نجمة</p>
      <p class="center">${st.streak > 1 ? `🔥 ${st.streak} أيام متتالية!` : 'عُد غدًا لهدية أكبر'}</p>
      <div class="center"><button class="tbtn" id="dOk">رائع! 💖</button></div>`);
    s.querySelector('#dOk').onclick = () => { Sound.tap(); this.closeSheet(); };
    this.addStars(n); Sound.win();
    if (st.streak >= 3) this.achieve('daily_3');
    this.paintGift();
  },

  /* ---------- اللاعبون والثيمات ---------- */
  setProfile(id) {
    const p = this.PROFILES.find(p => p.id === id) || this.PROFILES[0];
    this.profile = p; gstore.set('profile', p.id);
    if (!store.get('theme', null)) {
      if (p.theme) store.set('theme', p.theme);
      else { this.applyTheme(); this.themePicker(); return; }
    }
    this.applyTheme();
    if ($('#sheetWrap').classList.contains('on')) this.closeSheet(); else this.renderMenu();
  },
  themePicker() {
    const s = this.openSheet(`<h3>أهلًا يا ${this.profile.name}! 👋</h3><p class="center" style="margin:0">اختر الثيم الذي تحبّه</p>
      <div class="themes"><button class="g" data-t="girls"><span>👑</span>بناتي</button><button class="b" data-t="boys"><span>🚀</span>ولادي</button></div>
      <p class="center" style="font-size:12px;opacity:.6;margin:0">يمكنك تغييره لاحقًا من الإعدادات ⚙️</p>`,
      () => { if (!store.get('theme', null)) { store.set('theme', 'girls'); this.applyTheme(); } });
    s.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { Sound.tap(); store.set('theme', b.dataset.t); this.applyTheme(); this.closeSheet(); });
  },
  applyTheme() {
    const th = store.get('theme', this.profile.theme || 'girls');
    document.documentElement.dataset.theme = th;
    const meta = document.querySelector('meta[name=theme-color]'); if (meta) meta.content = th === 'boys' ? '#2E86F5' : '#FF4FA3';
    this.renderMenu();
  },
  logo() {
    const P = this.profile, boys = this.theme === 'boys';
    if (!this.customLogo) return `<img src="logo.jpg" alt="${this.EDITION.names}">`; // الشعار المشترك للتطبيق
    const main = boys ? '#2E86F5' : '#FF4FA3', bg = boys ? '#E4F1FF' : '#FFE8F2', edge = boys ? '#8CC0FF' : '#FFB3D4';
    const deco = boys ? [['🚀', 34, 52, 30, -20], ['⭐', 160, 40, 22, 0], ['🪐', 166, 150, 28, 0], ['⚽', 30, 158, 24, 0], ['🦖', 100, 182, 22, 0]]
                      : [['👑', 52, 50, 30, -15], ['💖', 160, 42, 22, 0], ['🌸', 166, 152, 28, 0], ['⭐', 30, 156, 20, 0], ['🎀', 100, 184, 22, 0]];
    return `<svg viewBox="0 0 200 200" aria-label="${P.name}">
      <circle cx="100" cy="100" r="98" fill="${bg}"/>
      <circle cx="100" cy="100" r="86" fill="none" stroke="${edge}" stroke-width="3" stroke-dasharray="7 6"/>
      ${deco.map(([e, x, y, s, r]) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" dominant-baseline="middle" transform="rotate(${r} ${x} ${y})">${e}</text>`).join('')}
      <text x="100" y="108" text-anchor="middle" dominant-baseline="middle" font-family="Baloo Bhaijaan 2,system-ui" font-weight="900" font-size="${P.name.length > 3 ? 58 : 66}"
        fill="${main}" stroke="#fff" stroke-width="10" paint-order="stroke" stroke-linejoin="round">${P.name}</text>
    </svg>`;
  },
  paintStars() { const n = $('#mStarsN'); if (n) n.textContent = this.stars(); },
  paintGift() { const st = store.get('daily', { last: '' }); $('#mGift').classList.toggle('done', st.last === this.today()); },
  renderMenu() {
    if (!this.profile) return;
    const P = this.profile;
    $('#players').innerHTML = this.PROFILES.map(p => `<button class="pl ${p.id === P.id ? 'on' : ''}" data-p="${p.id}"><span class="av">${p.av || '⭐'}</span>${p.name}</button>`).join('');
    $('#players').querySelectorAll('[data-p]').forEach(b => b.onclick = () => { if (b.dataset.p !== P.id) { Sound.tap(); this.setProfile(b.dataset.p); } });
    $('#logo').innerHTML = this.logo();
    $('#hello').textContent = `أهلًا يا ${P.name}! ${this.theme === 'boys' ? '🚀' : '👑'}`;
    $('#sub').textContent = this.g('اختاري لعبتك المفضّلة', 'اختر لعبتك المفضّلة');
    const played = store.get('played', []);
    $('#cards').innerHTML = this.order.map(id => {
      const g = this.games[id]; let best = '';
      try { best = g.best ? g.best() || '' : ''; } catch (e) {}
      return `<button class="card" data-go="${id}">${g.isNew && !played.includes(id) ? '<span class="newtag">جديدة</span>' : ''}
        <div class="ic"><canvas width="168" height="168" data-ic="${id}"></canvas></div>
        <h2>${g.title}</h2><p>${typeof g.desc === 'function' ? g.desc() : g.desc}</p><div class="best">${best}</div></button>`;
    }).join('');
    $('#cards').querySelectorAll('canvas[data-ic]').forEach(cv => {
      const c = cv.getContext('2d'); c.scale(168 / 152, 168 / 152);
      try { this.games[cv.dataset.ic].icon(c, 152); } catch (e) { console.warn(e); }
    });
    $('#cards').querySelectorAll('[data-go]').forEach(b => b.onclick = () => { Sound.tap(); this.show(b.dataset.go); });
    $('#mAchN').textContent = store.get('ach', []).length || '';
    this.paintStars(); this.paintGift();
  },

  boot() {
    document.documentElement.dataset.font = gstore.get('font', 'normal');
    document.title = this.EDITION.title;
    const foot = $('#foot'); if (foot) foot.innerHTML = `صُنعت بحب لـ${this.EDITION.names} 💕<div class="brand"><img src="img/albushra.jpg" alt="البشرى تكنولوجي"><b>من إنتاج البشرى تكنولوجي</b></div>`;
    $('#mSettings').onclick = () => { Sound.tap(); this.settings(); };
    $('#mShop').onclick = () => { Sound.tap(); this.shopSheet(); };
    $('#mAch').onclick = () => { Sound.tap(); this.achSheet(); };
    $('#mGift').onclick = () => { Sound.tap(); this.daily(); };
    $('#mStars').onclick = () => { Sound.tap(); this.shopSheet(); };
    $('#sheetWrap').addEventListener('pointerdown', e => { if (e.target.id === 'sheetWrap') { Sound.tap(); this.closeSheet(); } });
    document.addEventListener('click', e => {
      const h = e.target.closest('.home'); if (h) { Sound.tap(); this.show('menu'); return; }
      const q = e.target.closest('.helpbtn'); if (q) { Sound.tap(); this.help(this.current); }
    });
    window.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#sheetWrap').classList.contains('on')) { e.stopImmediatePropagation(); this.closeSheet(); } }, true);
    // أول لمسة تفتح الصوت (سياسة المتصفحات)
    const unlock = () => { Sound.ac(true); if (Music.on && !Music.timer) { const g = this.games[this.current]; Music.name = null; Music.play(g ? g.music : 'menu'); } };
    window.addEventListener('pointerdown', unlock, { once: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { if (Sound.ctx) Sound.ctx.suspend(); }
      else if (Sound.ctx) Sound.ctx.resume();
    });
    this.setProfile(gstore.get('profile', this.PROFILES[0].id));
    if (document.fonts) document.fonts.ready.then(() => this.renderMenu());
    const start = location.hash.slice(1);
    if (this.games[start]) this.show(start);
    window.addEventListener('popstate', () => { if (this.current !== 'menu') this.show('menu'); });
    window.__androidBack = () => this.back();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
    }
  }
};
