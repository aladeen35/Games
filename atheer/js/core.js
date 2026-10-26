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
   أدوات رسم أيقونات القائمة بأسلوب «لعبة ثلاثية الأبعاد» لامعة
   (خلفية متدرّجة غنية + موضوع مكتنز بحافة بيضاء وظل ناعم)
   ===================================================================== */
const IK = {
  TAU: Math.PI * 2,
  canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h || w; return c; },
  /** خلفية متدرّجة شعاعية من الأعلى، مع أشعة خفيفة وفقاعات ضوء */
  bg(c, s, stops, o = {}) {
    const g = c.createRadialGradient(s * .5, s * .28, s * .04, s * .5, s * .5, s * .86);
    stops.forEach((col, i) => g.addColorStop(i / (stops.length - 1), col));
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    if (o.rays !== false) {
      c.save(); c.translate(s * .5, s * (o.ry || .42)); c.fillStyle = `rgba(255,255,255,${o.rays || .1})`;
      const n = 14; for (let i = 0; i < n; i++) { c.rotate(this.TAU / n); c.beginPath(); c.moveTo(0, 0); c.lineTo(-s * .09, -s); c.lineTo(s * .09, -s); c.closePath(); c.fill(); }
      c.restore();
    }
    if (o.dots !== false) {
      let sd = o.seed || 3; const r = () => (sd = (sd * 9301 + 49297) % 233280) / 233280;
      for (let i = 0; i < 7; i++) { c.fillStyle = `rgba(255,255,255,${.12 + r() * .2})`; c.beginPath(); c.arc(r() * s, r() * s, s * (.015 + r() * .035), 0, this.TAU); c.fill(); }
    }
  },
  /** ظل بيضاوي ناعم تحت الموضوع */
  shadow(c, x, y, w, h, a = .28) {
    const g = c.createRadialGradient(x, y, 0, x, y, w);
    g.addColorStop(0, `rgba(30,10,60,${a})`); g.addColorStop(1, 'rgba(30,10,60,0)');
    c.save(); c.translate(x, y); c.scale(1, h / w); c.translate(-x, -y); c.fillStyle = g; c.beginPath(); c.arc(x, y, w, 0, this.TAU); c.fill(); c.restore();
  },
  /** نجمة بريق رباعية */
  sparkle(c, x, y, r, col = '#fff') {
    c.save(); c.translate(x, y); c.fillStyle = col; c.beginPath();
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; c.quadraticCurveTo(Math.cos(a + Math.PI / 4) * r * .18, Math.sin(a + Math.PI / 4) * r * .18, Math.cos(a + Math.PI / 2) * r, Math.sin(a + Math.PI / 2) * r); }
    c.closePath(); c.fill(); c.restore();
  },
  /** غيمة منفوخة بظل سفلي */
  cloud(c, x, y, w, col = '#fff', shade = 'rgba(160,180,230,.45)') {
    const puff = () => { c.beginPath(); c.arc(x + w * .22, y, w * .2, 0, this.TAU); c.arc(x + w * .45, y - w * .12, w * .26, 0, this.TAU); c.arc(x + w * .72, y - w * .02, w * .2, 0, this.TAU); c.roundRect(x + w * .05, y - w * .04, w * .9, w * .2, w * .1); c.fill(); };
    c.save(); c.fillStyle = shade; c.translate(0, w * .05); puff(); c.restore();
    c.fillStyle = col; puff();
  },
  /** يرسم الموضوع في طبقة منفصلة ثم يضيف حوله حافة بيضاء سميكة وظلًا ناعمًا (شكل الملصق/اللعبة) */
  sticker(c, s, draw, o = {}) {
    const k = 2, W = Math.ceil(s * k), line = (o.line == null ? 4.5 : o.line) * k;
    const a = this.canvas(W), ac = a.getContext('2d'); ac.scale(k, k);
    try { draw(ac); } catch (e) { console.warn(e); }
    if (line > 0) {
      const ol = this.canvas(W), oc = ol.getContext('2d');
      for (let i = 0; i < 16; i++) { const t = i / 16 * this.TAU; oc.drawImage(a, Math.cos(t) * line, Math.sin(t) * line); }
      oc.globalCompositeOperation = 'source-in'; oc.fillStyle = o.col || '#fff'; oc.fillRect(0, 0, W, W);
      c.save(); c.shadowColor = o.shadow || 'rgba(40,10,70,.35)'; c.shadowBlur = o.blur || 10; c.shadowOffsetY = o.dy == null ? 5 : o.dy;
      c.drawImage(ol, 0, 0, s, s); c.restore();
    } else {
      c.save(); c.shadowColor = o.shadow || 'rgba(40,10,70,.35)'; c.shadowBlur = o.blur || 10; c.shadowOffsetY = o.dy == null ? 5 : o.dy; c.drawImage(a, 0, 0, s, s); c.restore();
    }
    c.drawImage(a, 0, 0, s, s);
    // لمعة علوية خفيفة فوق الموضوع وحده
    if (o.gloss !== false) {
      const gl = this.canvas(W), gc = gl.getContext('2d'); gc.drawImage(a, 0, 0);
      gc.globalCompositeOperation = 'source-atop';
      const g = gc.createLinearGradient(0, 0, 0, W); g.addColorStop(0, 'rgba(255,255,255,.28)'); g.addColorStop(.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.08)');
      gc.fillStyle = g; gc.fillRect(0, 0, W, W);
      gc.globalCompositeOperation = 'destination-in'; gc.drawImage(a, 0, 0);
      c.drawImage(gl, 0, 0, s, s);
    }
  },
  /** تلة/أرضية مستديرة في أسفل الأيقونة */
  ground(c, s, y, top, bot) {
    const g = c.createLinearGradient(0, y, 0, s); g.addColorStop(0, top); g.addColorStop(1, bot);
    c.fillStyle = g; c.beginPath(); c.ellipse(s * .5, y + s * .5, s * .9, s * .5, 0, 0, this.TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(s * .5, y + s * .5, s * .9, s * .5, 0, Math.PI * 1.3, Math.PI * 1.7); c.lineTo(s * .5, y + s * .06); c.fill();
  }
};

/* =====================================================================
   المؤثرات الصوتية (مولّدة بالكامل داخل التطبيق)
   ===================================================================== */
/* ---------- الأصوات المسجّلة ---------- */
const Voice = {
  idx: null, bufs: {}, srcs: [], seq: 0,
  norm(t, lang) {
    t = String(t).replace(/[\u064B-\u0652\u0670\u0640]/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه');
    t = t.replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
    return lang === 'en' ? t.toLowerCase() : t;
  },
  /* فهرس: النص المطبَّع ← المقاطع (قد يكون هناك مقطعان مؤنث/مذكر لنفس النص) */
  index(lang) {
    // الفهرس يتغيّر مع الطفل الحالي إن كانت هناك تسجيلات شخصية خاصة به
    const sig = MyVoice.on && MyVoice.map.size ? 'my:' + (App.profile ? App.profile.id : '') + ':' + MyVoice.ver : '-';
    if (!this.idx || this.idxSig !== sig) {
      this.idxSig = sig;
      this.idx = { ar: new Map(), en: new Map() }; this.maxW = { ar: 1, en: 1 };
      const V = window.VOICE || {};
      const add = (lg, id, plain) => {
        if (/^harakat_[a-z]+_(a|u|i|aa|uu|ii|s|an|un|in)$/.test(id)) return; // مقاطع الحركات تُشغَّل بمعرّفها مباشرة
        const k = this.norm(plain, lg); if (!k) return;
        if (!this.idx[lg].has(k)) this.idx[lg].set(k, []);
        const l = this.idx[lg].get(k); if (!l.includes(id)) l.push(id);
        this.maxW[lg] = Math.max(this.maxW[lg], k.split(' ').length);
      };
      for (const lg of ['ar', 'en']) for (const [id, plain] of Object.entries(V[lg] || {})) add(lg, id, plain);
      // عبارات سجّلها الأهل بأصواتهم ولا يوجد لها مقطع جاهز
      if (sig !== '-') for (const r of MyVoice.map.values()) if ((!r.kid || (App.profile && r.kid === App.profile.id)) && r.lang in this.idx) add(r.lang, r.id, r.plain);
    }
    return this.idx[lang];
  },
  pick(list) {
    if (list.length === 1) return list[0];
    const g = App.g('_f', '_m');
    return list.find(id => id.endsWith(g)) || list[0];
  },
  /* تقسيم الجملة إلى أطول عبارات مسجّلة؛ يعيد null إن بقي جزء بلا تسجيل */
  find(text, lang = 'ar') {
    const ix = this.index(lang); if (!ix || !ix.size) return null;
    const w = this.norm(text, lang).split(' ').filter(Boolean); if (!w.length) return null;
    const out = []; let i = 0;
    while (i < w.length) {
      let hit = null;
      for (let n = Math.min(this.maxW[lang], w.length - i); n > 0 && !hit; n--) {
        const l = ix.get(w.slice(i, i + n).join(' ')); if (l) hit = [l, n];
      }
      if (!hit) return null;
      out.push(this.pick(hit[0])); i += hit[1];
    }
    return out;
  },
  /** الأولوية: تسجيل شخصي (للطفل ثم للجميع) ← المقطع الجاهز */
  async load(lang, id) {
    const my = MyVoice.find(lang, id);
    const k = my ? 'my:' + my.key + ':' + my.t : lang + '/' + id;
    if (!this.bufs[k]) this.bufs[k] = (my ? my.blob.arrayBuffer() : fetch('voice/' + k + '.mp3').then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); }))
      .then(a => new Promise((ok, no) => Sound.ac(true).decodeAudioData(a, ok, no))).catch(e => { delete this.bufs[k]; throw e; });
    return this.bufs[k];
  },
  stop() { this.seq++; this.srcs.forEach(s => { try { s.stop(); } catch (e) {} }); this.srcs = []; },
  async play(ids, lang) {
    this.stop(); const my = this.seq;
    try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
    const ac = Sound.ac(true); if (!ac) return;
    let bufs;
    try { bufs = await Promise.all(ids.map(id => this.load(lang, id))); } catch (e) { return; }
    if (my !== this.seq) return;
    let t = ac.currentTime + .02;
    for (const b of bufs) {
      const s = ac.createBufferSource(); s.buffer = b;
      const g = ac.createGain(); g.gain.value = 1; s.connect(g); g.connect(ac.destination);
      s.start(t); t += Math.max(.05, b.duration - .06) + .04; this.srcs.push(s);
    }
  }
};

/* ---------- تسجيلات الأهل/الطفل الشخصية (IndexedDB) ----------
   كل تسجيل: { key: 'ar/<id>' أو 'ar/<id>@<kidId>', id, lang, plain, kid|null, blob (WAV), t } */
const MyVoice = {
  db: null, map: new Map(), ver: 0, ready: null,
  get on() { return gstore.get('myvoice', true); },
  open() {
    if (!this.ready) this.ready = new Promise(ok => {
      try {
        const r = indexedDB.open('atheer-voice', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('rec', { keyPath: 'key' });
        r.onsuccess = () => { this.db = r.result; ok(this.db); };
        r.onerror = r.onblocked = () => ok(null);
      } catch (e) { ok(null); }
    });
    return this.ready;
  },
  tx(mode, fn) {
    return new Promise(ok => {
      try { const t = this.db.transaction('rec', mode), q = fn(t.objectStore('rec')); t.oncomplete = () => ok(q ? q.result : true); t.onerror = t.onabort = () => ok(null); }
      catch (e) { ok(null); }
    });
  },
  async load() {
    if (!(await this.open())) return;
    const all = await this.tx('readonly', st => st.getAll()) || [];
    this.map = new Map(all.map(r => [r.key, r])); this.changed();
  },
  key(lang, id, kid) { return lang + '/' + id + (kid ? '@' + kid : ''); },
  /** التسجيل المناسب للطفل الحالي: الخاص به أولًا ثم المشترك */
  find(lang, id) {
    if (!this.map.size || !this.on) return null;
    const kid = App.profile && App.profile.id;
    return (kid && this.map.get(this.key(lang, id, kid))) || this.map.get(this.key(lang, id)) || null;
  },
  async save(rec) {
    if (!(await this.open())) return false;
    const ok = await this.tx('readwrite', st => st.put(rec));
    if (ok) { this.map.set(rec.key, rec); this.changed(); }
    return !!ok;
  },
  async remove(key) {
    if (!(await this.open())) return;
    await this.tx('readwrite', st => st.delete(key)); this.map.delete(key); this.changed();
  },
  /** حذف تسجيلات طفل حُذف */
  async removeKid(kid) { for (const k of [...this.map.keys()]) if (k.endsWith('@' + kid)) await this.remove(k); },
  changed() { this.ver++; Voice.idx = null; for (const k in Voice.bufs) if (k.startsWith('my:')) delete Voice.bufs[k]; }
};

/* ---------- صوت الجهاز (TTS) عند غياب أي تسجيل ----------
   التفضيلات في gstore('tts') = { ar: { voice, rate, pitch }, en: {...} }.
   في أندرويد يحفظها التطبيق الأصلي أيضًا ويطبّقها على محرّك النطق. */
const Tts = {
  DEF: { rate: .9, pitch: 1.1 },
  pref(lang) { return { ...this.DEF, ...((gstore.get('tts', {}) || {})[lang] || {}) }; },
  setPref(lang, p) {
    const all = gstore.get('tts', {}) || {}; all[lang] = { ...this.pref(lang), ...p }; gstore.set('tts', all);
    const b = window.AndroidBridge; const q = all[lang];
    try { if (b && b.ttsSet) b.ttsSet(lang, q.voice || '', +q.rate, +q.pitch); } catch (e) {}
  },
  /** تقييم الصوت: عربي سعودي/مصري، أصوات Google، الجودة العالية، الشبكة، والأصوات الأنثوية (أقرب لصوت الأطفال) */
  score(v, lang) {
    const L = String(v.lang || '').toLowerCase().replace('_', '-');
    if (!L.startsWith(lang) || v.notInstalled) return -1;
    let s = 1;
    if (lang === 'ar' ? /^ar-(sa|eg|xa|ae)/.test(L) : /^en-(us|gb)/.test(L)) s += 3;
    if (/google/i.test(v.name) || /-x-/.test(v.name)) s += 4;
    if (v.network || v.localService === false) s += 2;
    if (v.quality) s += v.quality / 200;
    if (/female|woman|laila|hoda|zeina|salma|maryam|mariam|amira|samantha|aria|jenny|zira|-x-arc|-x-sfg|-x-tpc/i.test(v.name)) s += 1;
    return s;
  },
  best(list, lang) { let b = null, bs = 0; for (const v of list) { const sc = this.score(v, lang); if (sc > bs) { bs = sc; b = v; } } return b; },
  webVoices() { try { return window.speechSynthesis ? speechSynthesis.getVoices() : []; } catch (e) { return []; } },
  /** صوت المتصفّح المختار (أو الأفضل تلقائيًا) */
  webVoice(lang) {
    const vs = this.webVoices(), name = this.pref(lang).voice;
    return (name && vs.find(v => v.name === name)) || this.best(vs, lang);
  },
  /** أصوات أندرويد (من الجسر) */
  androidVoices(lang) { try { return JSON.parse(AndroidBridge.ttsVoices(lang) || '[]'); } catch (e) { return []; } },
  get android() { return !!(window.AndroidBridge && AndroidBridge.ttsVoices); }
};

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
   الحركة (GSAP): كل شيء اختياري — إن لم يُحمَّل GSAP أو طلب الجهاز
   تقليل الحركة، يعمل التطبيق كما هو بلا حركات.
   نحرّك transform و opacity فقط كي تبقى خفيفة على الهواتف الضعيفة.
   ===================================================================== */
const Fx = {
  ok: false, reduce: false, intro: null,
  init() {
    const G = window.gsap; if (!G) return;
    try { G.registerPlugin(...[window.Flip, window.CustomEase, window.Physics2DPlugin, window.MotionPathPlugin, window.Draggable].filter(Boolean)); } catch (e) {}
    this.ok = true;
    document.documentElement.classList.add('gs');
    G.defaults({ duration: .4, ease: 'power2.out' });
    G.matchMedia().add({ reduce: '(prefers-reduced-motion: reduce)', full: '(prefers-reduced-motion: no-preference)' }, ctx => {
      this.reduce = !!ctx.conditions.reduce;
      if (!this.reduce) G.to('#logo', { y: -7, rotation: -1.5, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 }); // تمايل الشعار
    });
  },
  /** هل نحرّك؟ */
  get on() { return this.ok && !this.reduce; },
  /** دخول الشاشة الرئيسية أول مرة */
  menuIntro() {
    if (!this.on) return;
    const G = gsap, vh = innerHeight;
    const cards = [...document.querySelectorAll('#cards .gh, #cards .card')].filter(c => c.getBoundingClientRect().top < vh).slice(0, 14);
    const C = 'transform,opacity,visibility';
    this.intro = G.timeline({ defaults: { ease: 'back.out(1.7)' }, onComplete: () => { this.intro = null; } })
      .fromTo('.topbar > *', { y: -34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: .05, duration: .45, clearProps: C })
      .fromTo('#logo', { scale: .3, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .7, ease: 'back.out(1.5)' }, .05)
      .fromTo('#hello, #sub', { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: .08, duration: .4, ease: 'power2.out', clearProps: C }, .3)
      .fromTo('#kids .kid', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, stagger: .07, duration: .5, clearProps: C }, .38)
      .fromTo('#cats button', { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: .03, duration: .3, clearProps: C }, .5)
      .fromTo(cards, { y: 46, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: .045, duration: .55, ease: 'power3.out', clearProps: C }, .55);
  },
  /** إنهاء الدخول فورًا قبل إعادة بناء القائمة */
  finishIntro() { if (this.intro) { this.intro.progress(1); this.intro = null; } },
  /** ظهور البطاقات الظاهرة بعد تبديل الطفل */
  cardsIn() {
    if (!this.on) return;
    const vh = innerHeight, cards = [...document.querySelectorAll('#cards .card')].filter(c => { const r = c.getBoundingClientRect(); return r.bottom > 0 && r.top < vh; }).slice(0, 10);
    gsap.fromTo(cards, { y: 18, autoAlpha: 0, scale: .94 }, { y: 0, autoAlpha: 1, scale: 1, stagger: .035, duration: .4, ease: 'back.out(1.6)', clearProps: 'transform,opacity,visibility' });
  },
  /** ضغط بطاقة: انضغاط ثم ارتداد مطاطي */
  press(el) { if (this.on) gsap.to(el, { y: 5, scaleX: 1.03, scaleY: .95, duration: .1, ease: 'power2.out', overwrite: 'auto' }); },
  release(el) { if (this.ok) gsap.to(el, { y: 0, scaleX: 1, scaleY: 1, duration: this.reduce ? 0 : .55, ease: 'elastic.out(1,0.45)', overwrite: 'auto' }); },
  /** ظهور الشاشة الجديدة (شفافية فقط، كي لا تتأثر قياسات الألعاب) */
  screenIn(el) {
    if (!this.on || !el) return;
    gsap.killTweensOf(el);
    gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: .28, ease: 'power1.out', clearProps: 'opacity,visibility' });
  },
  /** ستارة دائرية بلون اللعبة تخرج من البطاقة، ثم تُفتح اللعبة تحتها */
  curtain(card, color, icon, done) {
    const c = $('#curtain');
    if (!this.on || !c || !card) { done(); return; }
    const r = card.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const R = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) + 20;
    c.innerHTML = ''; c.style.width = c.style.height = 2 * R + 'px';
    c.style.background = `radial-gradient(circle, ${App.shade(color, .55)} 0, ${color} 55%, ${App.shade(color, -.15)} 100%)`;
    if (icon) { const cv = IK.canvas(240); cv.getContext('2d').drawImage(icon, 0, 0); c.appendChild(cv); }
    const cv = c.firstChild;
    gsap.killTweensOf([c, cv]);
    const tl = gsap.timeline();
    tl.set(c, { x: cx - R, y: cy - R, scale: 0, autoAlpha: 1 })
      .to(c, { scale: 1, duration: .42, ease: 'power2.in' });
    if (cv) tl.fromTo(cv, { scale: .4, rotation: -20 }, { scale: 1, rotation: 0, duration: .45, ease: 'back.out(2)' }, .12);
    tl.add(() => done())
      .to(c, { autoAlpha: 0, duration: .32, ease: 'power1.out' }, '+=.08');
    if (cv) tl.to(cv, { scale: 1.25, duration: .32, ease: 'power1.in' }, '<');
  },
  /** نجوم صغيرة تتطاير من نقطة (Physics2D) */
  burst(x, y, n = 8, chars = ['⭐', '✨', '💖']) {
    if (!this.on || !window.Physics2DPlugin) return;
    const L = $('#fxl'); if (!L) return;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i'); s.textContent = chars[i % chars.length]; L.appendChild(s);
      gsap.set(s, { x: x - 11, y: y - 14, scale: rand(.7, 1.2) });
      gsap.to(s, { physics2D: { velocity: rand(220, 420), angle: rand(200, 340), gravity: 700 }, rotation: rand(-200, 200), duration: 1.1, ease: 'none', onComplete: () => s.remove() });
      gsap.to(s, { autoAlpha: 0, duration: .35, delay: .75 });
    }
  },
  /** ظهور نافذة لعبة (overlay) ولوحتها ونجومها */
  overlayIn(o) {
    if (!this.on) return;
    const p = o.querySelector('.panel'), st = o.querySelectorAll('.stars3 > *');
    gsap.killTweensOf([o, p, ...st].filter(Boolean));
    const tl = gsap.timeline();
    tl.fromTo(o, { autoAlpha: 0 }, { autoAlpha: 1, duration: .25, ease: 'power1.out', clearProps: 'opacity,visibility' });
    if (p) tl.fromTo(p, { scale: .55, y: 40, autoAlpha: 0 }, { scale: 1, y: 0, autoAlpha: 1, duration: .5, ease: 'back.out(1.7)', clearProps: 'transform,opacity,visibility' }, .05);
    if (st.length) tl.fromTo(st, { scale: 0, rotation: -45 }, { scale: 1, rotation: 0, duration: .55, stagger: .14, ease: 'back.out(3)', clearProps: 'transform' }, .3);
  }
};

/* =====================================================================
   التطبيق
   ===================================================================== */
const App = {
  games: {}, order: [], current: 'menu', profile: null, customLogo: false,
  EDITION: window.EDITION,
  /** أسماء أصحاب الصور العائلية img/photos/p1..p7 (بالترتيب) */
  PHOTO_NAMES: ['العم علاء الدين', 'كوتي', 'ريلا', 'العمة إيثار', 'البشرى', 'جنان', 'العم ضياء'],
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
    { id: 'harakat_first', g: 'harakat', i: '🏎️', t: 'أول سباق', d: 'إنهاء أول سباق حركات' },
    { id: 'harakat_perfect', g: 'harakat', i: '💯', t: 'سباق مثالي', d: '10 من 10 في سباق واحد' },
    { id: 'harakat_gems', g: 'harakat', i: '💎', t: 'جامع الألماس', d: 'جمع 100 ماسة' },
    { id: 'harakat_mix', g: 'harakat', i: '🔤', t: 'خبير الحروف', d: 'إنهاء مستوى خلط الحروف' },
    { id: 'harakat_short_all', g: 'harakat', i: '🏁', t: 'بطل الحركات', d: 'إنهاء كل مستويات الفتحة والضمة والكسرة' },
    { id: 'tower_first', g: 'tower', i: '🏙️', t: 'أول برج', d: 'بناء أول برج' },
    { id: 'tower_20', g: 'tower', i: '🔢', t: 'عدّاد العشرين', d: 'إنهاء مستوى حتى العشرين' },
    { id: 'tower_all', g: 'tower', i: '👷', t: 'مهندس الأبراج', d: 'إنهاء كل مستويات البرج' },
    { id: 'penguins_first', g: 'penguins', i: '🐧', t: 'أول مستوى بطاريق', d: 'إنهاء أول مستوى' },
    { id: 'penguins_all', g: 'penguins', i: '👑', t: 'ملك البطاريق', d: 'نجوم في كل المستويات' },
    { id: 'penguins_ten', g: 'penguins', i: '🔟', t: 'عشرة بطاريق مرتّبة', d: 'ترتيب 10 بطاريق من أول محاولة' },
    { id: 'penguins_en', g: 'penguins', i: '🇬🇧', t: 'الأرقام بالإنجليزية', d: 'إنهاء مستوى بالإنجليزية' },
    { id: 'numpuzzle_first', g: 'numpuzzle', i: '🔢', t: 'أول لغز أرقام', d: 'إنهاء أول لغز' },
    { id: 'numpuzzle_perfect', g: 'numpuzzle', i: '✨', t: 'لغز أرقام بلا أخطاء', d: 'إنهاء لغز بلا أخطاء' },
    { id: 'numpuzzle_all', g: 'numpuzzle', i: '🏆', t: 'بطل ألغاز الأرقام', d: 'إنهاء كل المستويات' },
    { id: 'arpuzzle_first', g: 'arpuzzle', i: '🔤', t: 'أول لغز حروف', d: 'إنهاء أول لغز' },
    { id: 'arpuzzle_perfect', g: 'arpuzzle', i: '✨', t: 'لغز حروف بلا أخطاء', d: 'إنهاء لغز بلا أخطاء' },
    { id: 'arpuzzle_all', g: 'arpuzzle', i: '🏆', t: 'بطل الحروف العربية', d: 'إنهاء كل المستويات' },
    { id: 'enpuzzle_first', g: 'enpuzzle', i: '🔠', t: 'أول لغز ABC', d: 'إنهاء أول لغز' },
    { id: 'enpuzzle_perfect', g: 'enpuzzle', i: '✨', t: 'لغز ABC بلا أخطاء', d: 'إنهاء لغز بلا أخطاء' },
    { id: 'enpuzzle_all', g: 'enpuzzle', i: '🏆', t: 'بطل الحروف الإنجليزية', d: 'إنهاء كل المستويات' },
    { id: 'sudanmap_first', g: 'sudanmap', i: '🗺️', t: 'أول خريطة للسودان', d: 'إكمال أول خريطة' },
    { id: 'sudanmap_perfect', g: 'sudanmap', i: '🎯', t: 'خريطة بلا أخطاء', d: 'إكمال الخريطة كاملة بلا أخطاء' },
    { id: 'sudanmap_quiz', g: 'sudanmap', i: '📍', t: 'أعرف ولايات السودان', d: '10 من 10 في سؤال الولايات' },
    { id: 'sudanmap_landmarks', g: 'sudanmap', i: '🏛️', t: 'مستكشف المعالم', d: '10 من 10 في سؤال المعالم' },
    { id: 'sudanmap_en', g: 'sudanmap', i: '🇬🇧', t: 'السودان بالإنجليزية', d: 'إنهاء أي وضع بالإنجليزية' },
    { id: 'pattern_first', g: 'pattern', i: '📿', t: 'أول نمط', d: 'إنهاء أول مستوى' },
    { id: 'pattern_perfect', g: 'pattern', i: '✨', t: 'نمط بلا أخطاء', d: 'إنهاء مستوى بلا أخطاء' },
    { id: 'pattern_all', g: 'pattern', i: '🏆', t: 'سيد الأنماط', d: 'إنهاء كل المستويات' },
    { id: 'shadows_first', g: 'shadows', i: '👤', t: 'أول ظل', d: 'إنهاء أول مستوى' },
    { id: 'shadows_perfect', g: 'shadows', i: '🦅', t: 'عين الصقر', d: 'إنهاء مستوى بلا أخطاء' },
    { id: 'shadows_all', g: 'shadows', i: '🏆', t: 'خبير الظلال', d: 'إنهاء كل المستويات' },
    { id: 'balance_first', g: 'balance', i: '⚖️', t: 'أول ميزان', d: 'إنهاء أول مستوى' },
    { id: 'balance_perfect', g: 'balance', i: '🎯', t: 'ميزان دقيق', d: 'إنهاء مستوى بلا أخطاء' },
    { id: 'balance_all', g: 'balance', i: '🏆', t: 'خبير الموازين', d: 'نجوم في كل المستويات' },
    { id: 'fractions_first', g: 'fractions', i: '🧁', t: 'أول كسر', d: 'إنهاء أول مستوى' },
    { id: 'fractions_all', g: 'fractions', i: '🏆', t: 'خبير الكسور', d: 'نجوم في كل المستويات' },
    { id: 'wordtrain_first', g: 'wordtrain', i: '🚂', t: 'أول قطار', d: 'إكمال أول كلمة' },
    { id: 'wordtrain_50', g: 'wordtrain', i: '🚃', t: '٥٠ كلمة في القطار', d: 'إكمال 50 كلمة' },
    { id: 'wordtrain_ar', g: 'wordtrain', i: '🔤', t: 'كل قطارات العربي', d: 'إنهاء كل مستويات العربي' },
    { id: 'wordtrain_en', g: 'wordtrain', i: '🔠', t: 'كل قطارات الإنجليزي', d: 'إنهاء كل مستويات الإنجليزي' },
    { id: 'opposites_first', g: 'opposites', i: '🔀', t: 'عرفت الأضداد', d: 'إنهاء أول مستوى' },
    { id: 'opposites_memory', g: 'opposites', i: '🧠', t: 'ذاكرة الأضداد', d: 'إنهاء مستوى في وضع الذاكرة' },
    { id: 'opposites_all', g: 'opposites', i: '🏆', t: 'بطل الأضداد', d: 'إنهاء كل المستويات' },
    { id: 'mothers_first', g: 'mothers', i: '🐄', t: 'أول لقاء', d: 'إعادة أول صغير إلى أمه' },
    { id: 'mothers_ears', g: 'mothers', i: '👂', t: 'أذن ذهبية', d: 'معرفة الحيوانات من أصواتها' },
    { id: 'mothers_all', g: 'mothers', i: '🏆', t: 'صديق الحيوانات', d: 'إنهاء كل المستويات' },
    { id: 'duas_first', g: 'duas', i: '🤲', t: 'أول دعاء', d: 'اختيار أول دعاء صحيح' },
    { id: 'duas_learn', g: 'duas', i: '📖', t: 'أتعلّم أدعيتي', d: 'الاستماع إلى كل الأدعية' },
    { id: 'duas_all', g: 'duas', i: '🌙', t: 'حافظ الأدعية', d: 'إنهاء كل المستويات' },
    { id: 'daily_3',     g: '',        i: '🎁', t: 'وفاء يومي',          d: 'فتح الهدية اليومية 3 أيام متتالية' },
    { id: 'shop_first',  g: '',        i: '🛍️', t: 'أول مشتريات',       d: 'شراء أول عنصر من المتجر' },
    { id: 'all_games',   g: '',        i: '🎮', t: 'مستكشف الألعاب',     d: 'تجربة كل الألعاب' }
  ],

  /* ---------- أقسام القائمة: كل لعبة ← قسم (المجهولة تذهب إلى آخر القائمة) ---------- */
  CATS: [
    { id: 'lang',  t: 'لغة وحروف',     s: 'لغة وحروف',  i: '🔤', c: '#F2484B' },
    { id: 'math',  t: 'أرقام وحساب',   s: 'أرقام وحساب', i: '🔢', c: '#2F8CF0' },
    { id: 'brain', t: 'ذكاء وتفكير',   s: 'ذكاء وتفكير', i: '🧠', c: '#8B5CF6' },
    { id: 'sci',   t: 'علوم ومعرفة',   s: 'علوم ومعرفة', i: '🌍', c: '#1FB37A' },
    { id: 'values', t: 'قيم وآداب',    s: 'قيم وآداب',  i: '🕌', c: '#14A3A0' },
    { id: 'fun',   t: 'مغامرة وحركة',  s: 'مغامرة وحركة', i: '🎮', c: '#FF8A1F' },
    { id: 'art',   t: 'إبداع',          s: 'إبداع',       i: '🎨', c: '#F0609E' },
    { id: 'more',  t: 'ألعاب أخرى',     s: 'أخرى',        i: '✨', c: '#2E9BE6' }
  ],
  CAT_OF: {
    letters: 'lang', harakat: 'lang', wordtrain: 'lang', arpuzzle: 'lang', enpuzzle: 'lang', opposites: 'lang',
    numbers: 'math', tower: 'math', penguins: 'math', numpuzzle: 'math', balance: 'math', fractions: 'math',
    shapes: 'brain', pattern: 'brain', shadows: 'brain', memory: 'brain', maze: 'brain', diff: 'brain', tubes: 'brain', slide: 'brain', cosmos: 'brain', chalk: 'brain',
    mothers: 'sci', sudanmap: 'sci', butterfly: 'sci',
    duas: 'values',
    jump: 'fun', taxi: 'fun', snake: 'fun', blocks: 'fun', bubbles: 'fun', balls: 'fun', candy: 'fun',
    cake: 'art'
  },
  /** لون مميّز لبطاقة كل لعبة */
  ACCENT: {
    jump: '#3D9BFF', cosmos: '#6A4BDB', chalk: '#27A06A', blocks: '#FF9A1F', bubbles: '#1FB4E8', balls: '#8E44E0', shapes: '#E8772E',
    candy: '#FF4F9A', memory: '#9A6BFF', tubes: '#14B3A0', snake: '#5DB52F', slide: '#F2A007', butterfly: '#FF6F91', letters: '#F2484B',
    numbers: '#2F8CF0', maze: '#45A84A', diff: '#1E9BD7', taxi: '#F7B500', cake: '#F0609E',
    harakat: '#7E57C2', tower: '#FF7A1A', penguins: '#3A6FD8', numpuzzle: '#00A3A3', arpuzzle: '#E64980', enpuzzle: '#4263EB',
    wordtrain: '#E8590C', opposites: '#D6336C', balance: '#0CA678', fractions: '#F06595', pattern: '#7048E8', shadows: '#495EB8',
    mothers: '#37B24D', sudanmap: '#1C7ED6', duas: '#12B886'
  },
  shade(hex, f) { // f>0 تفتيح نحو الأبيض، f<0 تغميق
    const n = parseInt(hex.slice(1), 16), ch = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.round(f > 0 ? v + (255 - v) * f : v * (1 + f)));
    return '#' + ch.map(v => v.toString(16).padStart(2, '0')).join('');
  },
  accent(id) {
    let a = this.ACCENT[id];
    if (!a) { const P = ['#FF6F91', '#3D9BFF', '#1FB37A', '#FF9A1F', '#8E44E0', '#14B3A0']; let h = 0; for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0; a = P[h % P.length]; }
    return { a, ad: this.shade(a, -.25), al: this.shade(a, .78) };
  },
  /** ترتيب اللعبة داخل قسمها كما في CAT_OF */
  catRank(id) { const i = Object.keys(this.CAT_OF).indexOf(id); return i < 0 ? 1e9 : i; },
  iconCache: new Map(),

  /* ---------- أدوات عامة للألعاب ---------- */
  get theme() { return document.documentElement.dataset.theme; },
  /** نص بصيغة المؤنث أو المذكر حسب نوع الطفل (بنت/ولد)، وإلا فحسب الثيم */
  g(fem, masc) {
    const gd = this.profile && this.profile.gender;
    if (gd) return gd === 'boy' ? masc : fem;
    return this.theme === 'boys' ? masc : fem;
  },
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
    if (n > 0) { this.toast(`+${n} ⭐${why ? ' ' + why : ''}`, 'star'); Sound.coin(); }
  },
  achieve(id) {
    const a = this.ACH.find(x => x.id === id); if (!a) return;
    const got = store.get('ach', []); if (got.includes(id)) return;
    got.push(id); store.set('ach', got);
    setTimeout(() => { this.toast(`🏆 إنجاز جديد: ${a.t}`, 'ach'); Sound.win(); this.addStars(10); }, 300);
  },
  hasAch(id) { return store.get('ach', []).includes(id); },
  toast(text, kind) {
    const t = document.createElement('div'); t.className = 'tst' + (kind ? ' ' + kind : ''); t.textContent = text;
    $('#toasts').appendChild(t);
    if (!Fx.on) { setTimeout(() => t.remove(), 2700); return; }
    const tl = gsap.timeline({ onComplete: () => t.remove() });
    tl.fromTo(t, { y: -20, scale: .5, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: .5, ease: 'back.out(2.2)' });
    if (kind === 'ach') {
      tl.fromTo(t, { rotation: -7 }, { rotation: 0, duration: .8, ease: 'elastic.out(1.2,0.3)' }, 0)
        .add(() => { const r = t.getBoundingClientRect(); Fx.burst(r.left + r.width / 2, r.top + r.height / 2, 10, ['⭐', '🏆', '✨']); }, .15);
    } else if (kind === 'star') {
      tl.add(() => { const r = t.getBoundingClientRect(); Fx.burst(r.left + r.width / 2, r.top + r.height / 2, 5, ['⭐', '✨']); }, .1);
    }
    tl.to(t, { y: -12, autoAlpha: 0, duration: .35, ease: 'power1.in' }, '+=1.9');
  },
  /* النطق: يُفضَّل الصوت المسجَّل (voice/ar و voice/en)، وتُركَّب الجمل من مقاطع،
     وإن لم يتوفّر مقطع لجزء من الجملة نرجع إلى محرّك النطق في الجهاز */
  speak(text, lang = 'ar') {
    if (!gstore.get('sfx', true)) return;
    const ids = Voice.find(text, lang);
    if (ids) { Voice.play(ids, lang); return; }
    Voice.stop();
    try {
      if (lang === 'en') {
        if (window.AndroidBridge && (AndroidBridge.speakEn || AndroidBridge.speak)) { (AndroidBridge.speakEn ? AndroidBridge.speakEn(text) : AndroidBridge.speak(text)); return; }
      } else if (window.AndroidBridge && AndroidBridge.speak) { AndroidBridge.speak(text); return; }
      if (window.speechSynthesis) {
        speechSynthesis.cancel();
        const P = Tts.pref(lang), u = new SpeechSynthesisUtterance(text);
        u.lang = lang === 'en' ? 'en-US' : 'ar-SA'; u.rate = +P.rate || .9; u.pitch = +P.pitch || 1.1;
        const v = Tts.webVoice(lang); if (v) { u.voice = v; u.lang = v.lang; }
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
    if (!this.noFade) Fx.screenIn($('#' + id));
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
      if (prev && Fx.on) { Fx.cardsIn(); gsap.from('#logo, #kids .kid.on .kav', { scale: .8, duration: .5, ease: 'back.out(2)' }); }
    }
    try { history.replaceState(null, '', id === 'menu' ? location.pathname : '#' + id); } catch (e) {}
  },
  /** فتح لعبة من بطاقتها: ستارة بلون اللعبة ثم الانتقال */
  openGame(id, card) {
    if (this.opening) return;
    if (!Fx.on || !card) { this.show(id); return; }
    this.opening = true;
    const icon = [...this.iconCache.entries()].find(([k]) => k.startsWith(id + '|'));
    Fx.curtain(card, this.accent(id).a, icon && icon[1], () => {
      this.noFade = true;
      try { this.show(id); } finally { this.noFade = false; this.opening = false; }
    });
    setTimeout(() => { this.opening = false; }, 1500);
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
    const g = this.games[this.current], W = $('#sheetWrap'), wasOn = W.classList.contains('on');
    if (g && g.pause && !wasOn) g.pause();
    if (Fx.ok) { gsap.killTweensOf([W, $('#sheet')]); gsap.set([W, $('#sheet')], { clearProps: 'transform,opacity,visibility' }); }
    W.classList.remove('closing');
    $('#sheet').innerHTML = `<button class="close" aria-label="إغلاق">✕</button>` + html;
    W.classList.add('on');
    if (!wasOn && Fx.on) {
      gsap.fromTo(W, { autoAlpha: 0 }, { autoAlpha: 1, duration: .22, ease: 'power1.out', clearProps: 'opacity,visibility' });
      gsap.fromTo('#sheet', { scale: .6, y: 50, autoAlpha: 0 }, { scale: 1, y: 0, autoAlpha: 1, duration: .5, ease: 'back.out(1.6)', clearProps: 'transform,opacity,visibility' });
    }
    $('#sheet').scrollTop = 0;
    $('#sheet .close').onclick = () => { Sound.tap(); this.closeSheet(); };
    this.sheetClose = onClose || null;
    return $('#sheet');
  },
  closeSheet() {
    const W = $('#sheetWrap');
    if (W.classList.contains('on') && Fx.on) {
      W.classList.add('closing');
      gsap.killTweensOf([W, $('#sheet')]);
      gsap.to('#sheet', { scale: .85, y: 30, autoAlpha: 0, duration: .2, ease: 'power2.in' });
      gsap.to(W, { autoAlpha: 0, duration: .22, ease: 'power1.in', onComplete: () => { W.classList.remove('closing'); gsap.set([W, $('#sheet')], { clearProps: 'transform,opacity,visibility' }); } });
    }
    W.classList.remove('on');
    const cb = this.sheetClose; this.sheetClose = null; if (cb) cb();
    const g = this.games[this.current];
    if (g && g.resume) g.resume();
    if (this.current === 'menu') this.renderMenu();
  },
  /** تحميل سكربت عند الحاجة فقط */
  lazy(srcs) {
    this._lazy = this._lazy || {};
    return Promise.all(srcs.map(src => this._lazy[src] || (this._lazy[src] = new Promise((ok, no) => {
      const sc = document.createElement('script'); sc.src = src; sc.onload = ok; sc.onerror = () => { delete this._lazy[src]; no(); }; document.head.appendChild(sc);
    }))));
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
      <div class="row"><span class="lbl">👤 ${this.g('اللاعبة', 'اللاعب')}</span><div class="kchips">${this.PROFILES.map(k => `<button class="kchip ${k.id === P.id ? 'on' : ''}" data-kid="${k.id}"><span class="mini">${this.kidFace(k)}</span>${this.esc(k.name)}</button>`).join('')}</div>
        <div style="display:flex;gap:6px;width:100%;justify-content:center"><button class="tbtn alt sm" id="sEdit">✏️ تعديل ${this.esc(P.name)}</button><button class="tbtn alt sm" id="sAdd">➕ طفل جديد</button></div></div>
      <div class="row"><span class="lbl">🎨 الثيم</span>${seg('theme', [['girls', '👑 بناتي'], ['boys', '🚀 ولادي']], th)}</div>
      <div class="row"><span class="lbl">🔊 المؤثرات</span>${seg('sfx', [[true, 'تشغيل'], [false, 'إيقاف']], gstore.get('sfx', true))}</div>
      <div class="row"><span class="lbl">🎵 الموسيقى</span>${seg('music', [[true, 'تشغيل'], [false, 'إيقاف']], gstore.get('music', true))}</div>
      <div class="row"><span class="lbl">📳 الاهتزاز</span>${seg('vib', [[true, 'تشغيل'], [false, 'إيقاف']], gstore.get('vib', true))}</div>
      <div class="row"><span class="lbl">🎙️ أصوات التطبيق</span><button class="tbtn alt sm" id="sStudio">🎙️ سجّل الأصوات</button><button class="tbtn alt sm" id="sTts">🗣️ صوت الجهاز</button></div>
      <div class="row"><span class="lbl">🔠 حجم الخط</span>${seg('font', [['normal', 'عادي'], ['large', 'كبير']], gstore.get('font', 'normal'))}</div>
      <div class="row"><span class="lbl">🗑️ بيانات ${this.esc(P.name)}</span><button class="tbtn alt" id="sReset" style="font-size:14px;padding:6px 14px">مسح النتائج</button></div>
      <p class="center" style="font-size:12px;opacity:.6;margin:8px 0 0">الثيم يغيّر شكل القائمة فقط، ولا يغيّر الألعاب.</p>`);
    s.querySelectorAll('[data-kid]').forEach(b => b.onclick = () => { Sound.tap(); if (b.dataset.kid !== P.id) { this.closeSheet(); this.switchKid(b.dataset.kid); } });
    s.querySelector('#sEdit').onclick = () => { Sound.tap(); this.kidForm(P); };
    s.querySelector('#sAdd').onclick = () => { Sound.tap(); this.kidForm(null); };
    s.querySelector('#sStudio').onclick = () => { Sound.tap(); this.lazy(['voice/phrases.js', 'js/studio.js']).then(() => Studio.open()).catch(() => this.toast('تعذّر فتح الاستوديو')); };
    s.querySelector('#sTts').onclick = () => { Sound.tap(); this.lazy(['js/studio.js']).then(() => Studio.tts()).catch(() => this.toast('تعذّر الفتح')); };
    s.querySelectorAll('.seg').forEach(sg => sg.querySelectorAll('button').forEach(b => b.onclick = () => {
      const k = sg.dataset.k, raw = b.dataset.v, v = raw === 'true' ? true : raw === 'false' ? false : raw;
      Sound.tap();
      if (k === 'theme') { P.theme = v; this.saveKids(); store.set('theme', v); this.applyTheme(); }
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
    const s = this.openSheet(`<h3>🎁 هدية اليوم</h3><div class="center" id="dStar" style="font-size:70px;${Fx.ok ? '' : 'animation:pop .5s'}">⭐</div>
      <p class="center" style="font-size:22px;font-weight:800;margin:4px 0">+${n} نجمة</p>
      <p class="center">${st.streak > 1 ? `🔥 ${st.streak} أيام متتالية!` : 'عُد غدًا لهدية أكبر'}</p>
      <div class="center"><button class="tbtn" id="dOk">رائع! 💖</button></div>`);
    s.querySelector('#dOk').onclick = () => { Sound.tap(); this.closeSheet(); };
    if (Fx.on) gsap.fromTo('#dStar', { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: .9, delay: .15, ease: 'elastic.out(1,0.45)' });
    this.addStars(n); Sound.win();
    if (st.streak >= 3) this.achieve('daily_3');
    this.paintGift();
  },

  /* ---------- الأطفال (ملفات اللاعبين) والثيمات ----------
     القائمة محفوظة في gstore('kids')، وكل طفل: { id, name, gender:'girl'|'boy', theme, av, age, photo }.
     نتائج كل طفل في store بمفتاح يبدأ بـ «<id>:» كما كانت دائمًا، لذا لا يضيع أي تقدّم قديم. */
  KID_EMOJI: ['👑', '⭐', '🦄', '🌸', '🦋', '🐰', '🐱', '🍓', '🌈', '🎀', '🚀', '🦖', '🚗', '⚽', '🦁', '🐯', '🐼', '🐶', '🤖', '🦊'],
  esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); },
  /** تحميل قائمة الأطفال؛ أول تشغيل: تُبنى من ملفات النسخة بنفس المعرّفات القديمة */
  loadKids() {
    let kids = gstore.get('kids', null);
    if (Array.isArray(kids)) kids = kids.filter(k => k && k.id && k.name);
    if (!Array.isArray(kids) || !kids.length) {
      kids = (this.EDITION.profiles || []).map(p => {
        let old = null; try { old = JSON.parse(localStorage.getItem(p.id + ':theme')); } catch (e) {}
        const gender = p.gender || (p.theme === 'boys' ? 'boy' : 'girl');
        const theme = old === 'boys' || old === 'girls' ? old : (p.theme || (gender === 'boy' ? 'boys' : 'girls'));
        return { id: p.id, name: p.name, gender, theme, av: p.av || '⭐', age: null, photo: null };
      });
      if (!kids.length) kids = [{ id: 'kid1', name: 'بطلي', gender: 'girl', theme: 'girls', av: '⭐', age: null, photo: null }];
      gstore.set('kids', kids);
    }
    kids.forEach(k => { if (k.gender !== 'boy') k.gender = 'girl'; if (k.theme !== 'boys') k.theme = 'girls'; });
    this.PROFILES = kids;
  },
  /** حفظ القائمة؛ يعيد false إن امتلأت مساحة التخزين */
  saveKids() {
    try { localStorage.setItem('app:kids', JSON.stringify(this.PROFILES)); return true; } catch (e) { return false; }
  },
  kidFace(k) { return k.photo ? `<img src="${k.photo}" alt="">` : this.esc(k.av || '⭐'); },
  setProfile(id) {
    const p = this.PROFILES.find(p => p.id === id) || this.PROFILES[0];
    this.profile = p; gstore.set('profile', p.id);
    this.applyTheme();
    if ($('#sheetWrap').classList.contains('on')) this.closeSheet();
  },
  /** تبديل الطفل من الشاشة الرئيسية مع حركة Flip */
  switchKid(id, from) {
    if (!this.profile || id === this.profile.id) return;
    gstore.set('kidsTip', true);
    const flip = Fx.on && window.Flip;
    const st = flip ? Flip.getState('#kids .kav, #kids b') : null;
    Fx.finishIntro();
    this.setProfile(id);
    this.kidIntoView(true);
    if (!Fx.on) return;
    if (st) Flip.from(st, { duration: .55, ease: 'back.out(1.4)', scale: true });
    const av = $(`#kids .kid[data-k="${CSS.escape(id)}"] .kav`);
    if (av) {
      gsap.fromTo(av, { rotation: -14 }, { rotation: 0, duration: .9, ease: 'elastic.out(1.1,0.35)' });
      const r = av.getBoundingClientRect();
      gsap.fromTo('#ripple', { x: r.left + r.width / 2, y: r.top + r.height / 2, scale: .2, autoAlpha: .95 }, { scale: 9, autoAlpha: 0, duration: .9, ease: 'power2.out' });
      Fx.burst(r.left + r.width / 2, r.top + r.height / 2, 6, this.profile.gender === 'boy' ? ['⭐', '🚀', '✨'] : ['⭐', '💖', '✨']);
    }
    gsap.fromTo('#hello', { y: -14, scale: .85, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: .5, ease: 'back.out(2)' });
    gsap.fromTo('#sub', { autoAlpha: 0 }, { autoAlpha: 1, duration: .4, delay: .1 });
    Fx.cardsIn();
  },
  applyTheme() {
    const th = (this.profile && this.profile.theme) || 'girls';
    document.documentElement.dataset.theme = th;
    const meta = document.querySelector('meta[name=theme-color]'); if (meta) meta.content = th === 'boys' ? '#2E86F5' : '#FF4FA3';
    this.renderMenu();
  },
  /** تصغير الصورة إلى مربع ~256px بصيغة JPEG (يُقصّ من الوسط، وأعلى قليلًا في الصور الطولية حيث الوجه) */
  async readPhoto(file) {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
      const w = img.naturalWidth, h = img.naturalHeight, side = Math.min(w, h);
      if (!side) throw new Error('empty');
      const sx = (w - side) / 2, sy = h > w ? (h - side) * .3 : (h - side) / 2, S = 256;
      let src = img, sxx = sx, syy = sy, ss = side;
      if (side > S * 3) { // تصغير على مرحلتين لصورة أنعم
        const mid = IK.canvas(S * 2), mc = mid.getContext('2d'); mc.imageSmoothingQuality = 'high';
        mc.drawImage(img, sx, sy, side, side, 0, 0, S * 2, S * 2); src = mid; sxx = syy = 0; ss = S * 2;
      }
      const c = IK.canvas(S), x = c.getContext('2d'); x.imageSmoothingQuality = 'high';
      x.fillStyle = '#fff'; x.fillRect(0, 0, S, S); x.drawImage(src, sxx, syy, ss, ss, 0, 0, S, S);
      return c.toDataURL('image/jpeg', .82);
    } finally { URL.revokeObjectURL(url); }
  },
  /** نموذج إضافة طفل أو تعديله */
  kidForm(kid) {
    const isNew = !kid;
    const d = kid ? { ...kid } : { name: '', gender: '', theme: '', av: '', age: null, photo: null };
    let themeTouched = !isNew;
    const s = this.openSheet(`<h3>${isNew ? '➕ طفل جديد' : '✏️ تعديل ' + this.esc(kid.name)}</h3>
      <div class="kf-top"><div class="kf-av" id="kfAv"></div>
        <div class="kf-pb">
          <label class="pbtn">📷 التقاط صورة<input type="file" accept="image/*" capture="user" data-ph></label>
          <label class="pbtn">🖼️ من المعرض<input type="file" accept="image/*" data-ph></label>
          <button class="pbtn" id="kfNoPh">✖ بلا صورة</button>
        </div></div>
      <div class="kf-l">✍️ الاسم</div>
      <input class="kf-in" id="kfName" maxlength="16" autocomplete="off" enterkeyhint="done" placeholder="اكتب اسم الطفل" value="${this.esc(d.name)}">
      <div class="kf-l">👶 بنت أم ولد؟</div>
      <div class="kf-g" id="kfG"><button class="g" data-g="girl"><span>👧</span>بنت</button><button class="b" data-g="boy"><span>👦</span>ولد</button></div>
      <div class="kf-l">🎂 العمر <small>(اختياري)</small></div>
      <div class="seg kf-age" id="kfAge">${[['', '—'], ...[3, 4, 5, 6, 7, 8].map(n => [n, n])].map(([v, l]) => `<button data-a="${v}">${l}</button>`).join('')}</div>
      <div class="kf-l">🎨 شكل التطبيق</div>
      <div class="themes" id="kfT" style="margin:0"><button class="g" data-t="girls"><span>👑</span>بناتي</button><button class="b" data-t="boys"><span>🚀</span>ولادي</button></div>
      <div class="kf-l">😊 الرمز <small>(يظهر إن لم توجد صورة)</small></div>
      <div class="kf-emo" id="kfE">${this.KID_EMOJI.map(e => `<button data-e="${e}">${e}</button>`).join('')}</div>
      <div class="kf-act"><button class="tbtn" id="kfSave">${isNew ? '✔️ إضافة' : '✔️ حفظ'}</button>
        ${!isNew && this.PROFILES.length > 1 ? '<button class="tbtn danger sm" id="kfDel">🗑️ حذف</button>' : ''}</div>`);
    const paint = () => {
      const emo = d.av || (d.gender === 'boy' ? '🚀' : d.gender === 'girl' ? '👑' : '🙂');
      s.querySelector('#kfAv').innerHTML = d.photo ? `<img src="${d.photo}" alt="">` : emo;
      s.querySelector('#kfNoPh').style.display = d.photo ? '' : 'none';
      s.querySelectorAll('[data-g]').forEach(b => b.classList.toggle('on', b.dataset.g === d.gender));
      s.querySelectorAll('[data-t]').forEach(b => b.classList.toggle('on', b.dataset.t === d.theme));
      s.querySelectorAll('[data-a]').forEach(b => b.classList.toggle('on', String(d.age || '') === b.dataset.a));
      s.querySelectorAll('[data-e]').forEach(b => b.classList.toggle('on', b.dataset.e === d.av));
    };
    const popAv = () => { if (Fx.on) gsap.fromTo('#kfAv', { scale: .7 }, { scale: 1, duration: .6, ease: 'elastic.out(1,0.4)' }); };
    paint();
    s.querySelectorAll('[data-g]').forEach(b => b.onclick = () => {
      Sound.tap(); d.gender = b.dataset.g;
      if (!themeTouched) d.theme = d.gender === 'boy' ? 'boys' : 'girls';
      paint(); if (Fx.on) gsap.fromTo(b, { scale: .9 }, { scale: 1, duration: .5, ease: 'back.out(3)', clearProps: 'transform' });
    });
    s.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { Sound.tap(); d.theme = b.dataset.t; themeTouched = true; paint(); });
    s.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { Sound.tap(); d.age = b.dataset.a ? +b.dataset.a : null; paint(); });
    s.querySelectorAll('[data-e]').forEach(b => b.onclick = () => { Sound.tap(); d.av = b.dataset.e; if (d.photo) d.photo = null; paint(); popAv(); });
    s.querySelector('#kfNoPh').onclick = () => { Sound.tap(); d.photo = null; paint(); popAv(); };
    s.querySelectorAll('input[data-ph]').forEach(inp => inp.onchange = async () => {
      const f = inp.files && inp.files[0]; inp.value = ''; if (!f) return;
      const lb = inp.parentElement; lb.classList.add('busy');
      try { d.photo = await this.readPhoto(f); Sound.pop(); paint(); popAv(); }
      catch (e) { Sound.error(); this.toast('تعذّر فتح هذه الصورة'); }
      finally { lb.classList.remove('busy'); }
    });
    const nameIn = s.querySelector('#kfName');
    nameIn.addEventListener('keydown', e => { if (e.key === 'Enter') nameIn.blur(); });
    const need = (el, msg) => {
      Sound.error(); this.toast(msg);
      if (Fx.on) gsap.fromTo(el, { x: -10 }, { x: 0, duration: .6, ease: 'elastic.out(1.2,0.2)', clearProps: 'transform' });
    };
    s.querySelector('#kfSave').onclick = () => {
      d.name = nameIn.value.replace(/\s+/g, ' ').trim().slice(0, 16);
      if (!d.name) { need(nameIn, 'اكتب اسم الطفل أولًا ✍️'); nameIn.focus(); return; }
      if (!d.gender) { need(s.querySelector('#kfG'), 'اختر: بنت أم ولد؟'); return; }
      if (!d.theme) d.theme = d.gender === 'boy' ? 'boys' : 'girls';
      if (!d.av) d.av = d.gender === 'boy' ? '🚀' : '👑';
      let k = kid, before = kid ? { ...kid } : null;
      if (isNew) { k = { id: 'k' + Date.now().toString(36) + Math.floor(Math.random() * 1e3).toString(36) }; this.PROFILES.push(k); }
      Object.assign(k, { name: d.name, gender: d.gender, theme: d.theme, av: d.av, age: d.age || null, photo: d.photo || null });
      if (!this.saveKids()) { // لا مساحة: نحفظ بلا صورة
        k.photo = null;
        if (!this.saveKids()) { if (isNew) this.PROFILES.pop(); else Object.assign(k, before); Sound.error(); this.toast('لا توجد مساحة كافية للحفظ'); return; }
        this.toast('حُفظ بلا صورة (لا توجد مساحة كافية)');
      }
      Sound.win(); gstore.set('kidsTip', true);
      if (isNew) { this.closeSheet(); this.switchKid(k.id); this.toast(`أهلًا ${k.name}! 🎉`); }
      else { this.iconCache.clear(); this.closeSheet(); if (k === this.profile) this.applyTheme(); }
    };
    const del = s.querySelector('#kfDel');
    if (del) del.onclick = () => { Sound.tap(); this.kidDelete(kid); };
    if (isNew) setTimeout(() => { try { nameIn.focus({ preventScroll: true }); } catch (e) {} }, 450);
  },
  /** تأكيد حذف طفل ثم حذف كل مفاتيحه */
  kidDelete(kid) {
    const s = this.openSheet(`<h3>حذف ${this.esc(kid.name)}؟</h3>
      <div class="kf-top"><div class="kf-av">${this.kidFace(kid)}</div></div>
      <p class="center" style="font-size:17px;font-weight:700;margin:14px 0 4px">سيُحذف ${this.esc(kid.name)} مع كل ${kid.gender === 'boy' ? 'نجومه ونتائجه' : 'نجومها ونتائجها'} من هذا الجهاز، ولا يمكن التراجع.</p>
      <div class="kf-act"><button class="tbtn danger" id="kdYes">🗑️ نعم، احذف</button><button class="tbtn alt" id="kdNo">لا، تراجع</button></div>`);
    s.querySelector('#kdNo').onclick = () => { Sound.tap(); this.kidForm(kid); };
    s.querySelector('#kdYes').onclick = () => {
      const i = this.PROFILES.indexOf(kid); if (i < 0 || this.PROFILES.length < 2) { this.closeSheet(); return; }
      Object.keys(localStorage).filter(k => k.startsWith(kid.id + ':')).forEach(k => localStorage.removeItem(k));
      this.PROFILES.splice(i, 1); this.saveKids(); MyVoice.removeKid(kid.id);
      Sound.poof(); this.toast(`تم حذف ${kid.name}`);
      if (this.profile === kid) this.setProfile(this.PROFILES[0].id); else this.closeSheet();
    };
  },
  logo() {
    const P = this.profile, boys = this.theme === 'boys';
    if (!this.customLogo) return `<img src="logo.jpg" alt="${this.EDITION.names}">`; // الشعار المشترك للتطبيق
    const main = boys ? '#2E86F5' : '#FF4FA3', bg = boys ? '#E4F1FF' : '#FFE8F2', edge = boys ? '#8CC0FF' : '#FFB3D4';
    const deco = boys ? [['🚀', 34, 52, 30, -20], ['⭐', 160, 40, 22, 0], ['🪐', 166, 150, 28, 0], ['⚽', 30, 158, 24, 0], ['🦖', 100, 182, 22, 0]]
                      : [['👑', 52, 50, 30, -15], ['💖', 160, 42, 22, 0], ['🌸', 166, 152, 28, 0], ['⭐', 30, 156, 20, 0], ['🎀', 100, 184, 22, 0]];
    return `<svg viewBox="0 0 200 200" aria-label="${this.esc(P.name)}">
      <circle cx="100" cy="100" r="98" fill="${bg}"/>
      <circle cx="100" cy="100" r="86" fill="none" stroke="${edge}" stroke-width="3" stroke-dasharray="7 6"/>
      ${deco.map(([e, x, y, s, r]) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" dominant-baseline="middle" transform="rotate(${r} ${x} ${y})">${e}</text>`).join('')}
      <text x="100" y="108" text-anchor="middle" dominant-baseline="middle" font-family="Baloo Bhaijaan 2,system-ui" font-weight="900" font-size="${P.name.length > 3 ? 58 : 66}"
        fill="${main}" stroke="#fff" stroke-width="10" paint-order="stroke" stroke-linejoin="round">${this.esc(P.name)}</text>
    </svg>`;
  },
  paintStars() {
    const n = $('#mStarsN'); if (!n) return;
    const v = this.stars(), up = this.lastStars != null && this.lastStars.id === (this.profile && this.profile.id) && v > this.lastStars.v;
    n.textContent = v; this.lastStars = { id: this.profile && this.profile.id, v };
    if (up && this.current === 'menu' && Fx.on) gsap.fromTo('#mStars', { scale: 1.35 }, { scale: 1, duration: .7, ease: 'elastic.out(1,0.35)', clearProps: 'transform' });
  },
  /** صف الأطفال: يُبنى من جديد فقط إن تغيّرت القائمة، وإلا تتبدّل علامة النشط (كي يعمل Flip) */
  renderKids() {
    const box = $('#kids'); if (!box) return;
    const P = this.profile;
    const sig = this.PROFILES.map(k => [k.id, k.name, k.gender, k.av, k.photo ? k.photo.length : 0].join(',')).join('|');
    if (box.dataset.sig !== sig) {
      box.dataset.sig = sig;
      box.innerHTML = this.PROFILES.map(k => `<button class="kid" data-k="${this.esc(k.id)}" data-g="${k.gender}" aria-label="${this.esc(k.name)}">
          <span class="kav">${this.kidFace(k)}<i class="ked" title="تعديل">✏️</i></span><b>${this.esc(k.name)}</b></button>`).join('') +
        `<button class="kid add" data-add="1" aria-label="إضافة طفل"><span class="kav">＋</span><b>إضافة طفل</b></button>`;
    }
    box.querySelectorAll('.kid[data-k]').forEach(b => b.classList.toggle('on', b.dataset.k === P.id));
    const tip = $('#ktip');
    if (tip) tip.textContent = gstore.get('kidsTip', false) ? '' : this.g('👆 اختاري اسمك، أو أضيفي طفلًا جديدًا', '👆 اختر اسمك، أو أضف طفلًا جديدًا');
  },
  /** إظهار الطفل النشط إن كان الصف أعرض من الشاشة */
  kidIntoView(smooth) {
    const box = $('#kids'), a = box && box.querySelector('.kid.on');
    if (!a || box.scrollWidth <= box.clientWidth + 2) return;
    const r = a.getBoundingClientRect(), b = box.getBoundingClientRect();
    box.scrollBy({ left: (r.left + r.width / 2) - (b.left + b.width / 2), behavior: smooth && !Fx.reduce ? 'smooth' : 'auto' });
  },
  /** لمس صف الأطفال: نقرة = تبديل، ضغطة طويلة أو ✏️ = تعديل */
  bindKids() {
    const box = $('#kids'); let timer = 0, long = false, sx = 0, sy = 0;
    const cancel = () => { clearTimeout(timer); timer = 0; };
    box.addEventListener('contextmenu', e => e.preventDefault());
    box.addEventListener('pointerdown', e => {
      const b = e.target.closest('.kid[data-k]'); long = false; cancel(); if (!b) return;
      sx = e.clientX; sy = e.clientY;
      timer = setTimeout(() => {
        long = true; timer = 0; vibrate(30); Sound.tap();
        const k = this.PROFILES.find(k => k.id === b.dataset.k); if (k) this.kidForm(k);
      }, 550);
    });
    box.addEventListener('pointermove', e => { if (timer && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) cancel(); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => box.addEventListener(t, cancel));
    box.addEventListener('click', e => {
      if (long) { long = false; return; }
      const b = e.target.closest('.kid'); if (!b) return;
      Sound.tap();
      if (b.dataset.add) { this.kidForm(null); return; }
      const k = this.PROFILES.find(k => k.id === b.dataset.k); if (!k) return;
      if (e.target.closest('.ked') || k === this.profile) {
        if (e.target.closest('.ked')) { this.kidForm(k); return; }
        if (Fx.on) gsap.fromTo(b.querySelector('.kav'), { rotation: -10, scale: 1.08 }, { rotation: 0, scale: 1, duration: .8, ease: 'elastic.out(1.1,0.35)' });
        return;
      }
      this.switchKid(k.id, b);
    });
  },
  /** رسم أيقونات البطاقات (من الذاكرة المؤقتة إن وُجدت) */
  paintIcons() {
    const P = this.profile; if (!P) return;
    const eqKey = ['hero', 'xo', 'ball'].map(k => this.equipped(k)).join('|') + '|' + P.id + '|' + P.name;
    $('#cards').querySelectorAll('canvas[data-ic]').forEach(cv => {
      const id = cv.dataset.ic, key = id + '|' + eqKey, c = cv.getContext('2d');
      let img = this.iconCache.get(key);
      if (!img) {
        img = IK.canvas(240); const ic = img.getContext('2d'); ic.scale(240 / 152, 240 / 152);
        ic.save(); try { this.games[id].icon(ic, 152); } catch (e) { console.warn(e); } ic.restore();
        this.iconCache.set(key, img);
      }
      c.clearRect(0, 0, 240, 240); c.drawImage(img, 0, 0);
    });
  },
  paintGift() { const st = store.get('daily', { last: '' }); $('#mGift').classList.toggle('done', st.last === this.today()); },
  renderMenu() {
    if (!this.profile) return;
    const P = this.profile;
    Fx.finishIntro();
    this.renderKids();
    if (this.customLogo || !$('#logo').firstChild) $('#logo').innerHTML = this.logo(); // الشعار ثابت لا يُعاد رسمه
    $('#hello').textContent = `أهلًا يا ${P.name}! ${this.theme === 'boys' ? '🚀' : '👑'}`;
    $('#sub').textContent = this.g('اختاري لعبتك المفضّلة', 'اختر لعبتك المفضّلة');
    const played = store.get('played', []);
    const catIds = this.CATS.map(c => c.id);
    const groups = this.CATS.map(c => ({ ...c, ids: this.order.filter(id => (catIds.includes(this.CAT_OF[id]) ? this.CAT_OF[id] : 'more') === c.id).sort((x, y) => this.catRank(x) - this.catRank(y)) })).filter(g => g.ids.length);
    const cv = c => `--c:${c.c};--cd:${this.shade(c.c, -.22)};--cl:${this.shade(c.c, .3)}`;
    const card = id => {
      const g = this.games[id], A = this.accent(id); let best = '', desc = '';
      try { best = g.best ? g.best() || '' : ''; } catch (e) {}
      try { desc = typeof g.desc === 'function' ? g.desc() : g.desc || ''; } catch (e) {}
      return `<button class="card" data-go="${id}" style="--a:${A.a};--ad:${A.ad};--al:${A.al}">${g.isNew && !played.includes(id) ? '<span class="newtag">جديدة</span>' : ''}
        <div class="ic"><canvas width="240" height="240" data-ic="${id}"></canvas></div>
        <h2>${g.title}</h2><p>${desc}</p><div class="best">${best}</div></button>`;
    };
    $('#cats').innerHTML = groups.length > 1 ? groups.map(c => `<button data-cat="${c.id}" style="${cv(c)}">${c.i} ${c.s || c.t}</button>`).join('') : '';
    $('#cards').innerHTML = groups.map(c => `<section class="grp" id="grp-${c.id}" style="${cv(c)}">
      <h2 class="gh"><span class="gi">${c.i}</span>${c.t}<small>${c.ids.length}</small></h2>
      <div class="cards">${c.ids.map(card).join('')}</div></section>`).join('');
    $('#cats').querySelectorAll('[data-cat]').forEach(b => b.onclick = () => {
      Sound.tap(); const el = $('#grp-' + b.dataset.cat); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    this.paintIcons();
    $('#cards').querySelectorAll('[data-go]').forEach(b => b.onclick = () => { Sound.tap(); this.openGame(b.dataset.go, b); });
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
    Fx.init();
    this.loadKids();
    MyVoice.load();
    try { if (window.speechSynthesis) speechSynthesis.getVoices(); } catch (e) {} // يبدأ تحميل قائمة الأصوات
    this.bindKids();
    // ضغط البطاقات بحركة مطاطية (GSAP)
    let pressed = null;
    const up = () => { if (pressed) { Fx.release(pressed); pressed = null; } };
    $('#cards').addEventListener('pointerdown', e => { const c = e.target.closest('.card'); if (c) { up(); pressed = c; Fx.press(c); } });
    ['pointerup', 'pointercancel'].forEach(t => window.addEventListener(t, up));
    this.setProfile(gstore.get('profile', this.PROFILES[0].id));
    this.kidIntoView(false);
    if (document.fonts) document.fonts.ready.then(() => { this.iconCache.clear(); this.paintIcons(); });
    // نوافذ الألعاب: حركة ظهور اللوحة والنجوم بـ GSAP
    if (Fx.ok && window.MutationObserver) {
      const mo = new MutationObserver(rs => rs.forEach(r => {
        const o = r.target, on = o.classList.contains('on');
        if (on && !o._fxOn) Fx.overlayIn(o);
        o._fxOn = on;
      }));
      document.querySelectorAll('.overlay').forEach(o => { o.dataset.fx = '1'; o._fxOn = o.classList.contains('on'); mo.observe(o, { attributes: true, attributeFilter: ['class'] }); });
    }
    const start = location.hash.slice(1);
    if (this.games[start]) this.show(start);
    else Fx.menuIntro();
    window.addEventListener('popstate', () => { if (this.current !== 'menu') this.show('menu'); });
    window.__androidBack = () => this.back();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
    }
  }
};
