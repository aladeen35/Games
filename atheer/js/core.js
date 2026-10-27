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
  /** تبديل اللغة: المحتوى ينزلق في اتجاه القراءة القديم ويعود من جهة الاتجاه الجديد، والمفتاح يقفز */
  langSwap(l, apply) {
    const G = gsap, W = '.menu-wrap > :not(.topbar)', dx = l === 'en' ? 1 : -1;
    this.finishIntro();
    if (this.swap) this.swap.progress(1);
    const pill = $('#mLang');
    if (pill) G.fromTo(pill, { scale: .86 }, { scale: 1, duration: .6, ease: 'elastic.out(1.1,0.4)', clearProps: 'transform' });
    this.swap = G.timeline({ onComplete: () => { this.swap = null; } })
      .to(W, { x: 40 * dx, autoAlpha: 0, duration: .18, ease: 'power2.in', stagger: .02 })
      .add(() => { apply(); G.set('.menu-wrap > :not(.topbar)', { x: -40 * dx, autoAlpha: 0 }); })
      .to('.menu-wrap > :not(.topbar)', { x: 0, autoAlpha: 1, duration: .45, ease: 'back.out(1.5)', stagger: .03, clearProps: 'transform,opacity,visibility' })
      .fromTo('#hello', { scale: .85 }, { scale: 1, duration: .6, ease: 'elastic.out(1,0.45)', clearProps: 'transform' }, '<.05');
  },
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
    hero: { title: 'أبطال فارس السحاب', te: 'Cloud Knight heroes', icon: '🛡️' },
    xo:   { title: 'رموز إكس أو', te: 'X-O symbols', icon: '✏️' },
    ball: { title: 'كرات مطر الكرات', te: 'Ball Rain balls', icon: '⚽' }
  },
  /** أسماء عناصر المتجر بالإنجليزية (العناصر تُسجَّل في ملفات الألعاب بأسماء عربية) */
  SHOP_EN: {
    hero_knight: 'Knight', hero_princess: 'Princess', hero_bunny: 'Bunny', hero_cat: 'Kitty', hero_astro: 'Astronaut',
    xo_classic: 'X and O', xo_hearts: 'Heart & Star', xo_sun: 'Sun & Moon', xo_pets: 'Cat & Bunny',
    ball_white: 'White ball', ball_rainbow: 'Rainbow ball', ball_soccer: 'Soccer ball', ball_star: 'Shiny star', ball_gold: 'Golden ball'
  },
  itemName(it) { return this.lang === 'en' ? it.nameEn || this.SHOP_EN[it.id] || it.name : it.name; },
  ACH: [
    { id: 'jump_100',    g: 'jump',    i: '☁️', t: 'أول قفزات',        d: 'الوصول إلى ارتفاع 100 م', te: "First Jumps", de: "Reach 100 m high" },
    { id: 'jump_castle', g: 'jump',    i: '🏰', t: 'زائر القلعة',       d: 'الوصول إلى ارتفاع 1500 م', te: "Castle Visitor", de: "Reach 1500 m high" },
    { id: 'jump_space',  g: 'jump',    i: '🚀', t: 'إلى الفضاء',        d: 'الوصول إلى ارتفاع 3000 م', te: "Into Space", de: "Reach 3000 m high" },
    { id: 'jump_rocket', g: 'jump',    i: '🔥', t: 'انطلاقة صاروخية',  d: 'استخدام الصاروخ', te: "Rocket Launch", de: "Use the rocket" },
    { id: 'cosmos_moon', g: 'cosmos',  i: '🌕', t: 'صانع الأقمار',      d: 'صنع قمر (32)', te: "Moon Maker", de: "Make a moon (32)" },
    { id: 'cosmos_planet', g: 'cosmos', i: '🌍', t: 'كوكب أزرق',        d: 'صنع كوكب أزرق (128)', te: "Blue Planet", de: "Make a blue planet (128)" },
    { id: 'cosmos_sun',  g: 'cosmos',  i: '☀️', t: 'الشمس المتوهّجة',  d: 'صنع شمس (2048)', te: "Shining Sun", de: "Make a sun (2048)" },
    { id: 'cosmos_timed', g: 'cosmos', i: '⏱️', t: 'سباق الزمن',        d: '2000 نقطة في وضع التحدي الزمني', te: "Time Race", de: "Score 2000 in timed mode" },
    { id: 'xo_draw',     g: 'chalk',   i: '🤝', t: 'ندّ للذكاء',        d: 'التعادل مع الذكاء الذي لا يُقهر', te: "A Match for AI", de: "Draw against the unbeatable AI" },
    { id: 'xo_win5',     g: 'chalk',   i: '✏️', t: 'خمسة انتصارات',     d: 'الفوز 5 مرات على الذكاء', te: "Five Wins", de: "Beat the AI 5 times" },
    { id: 'xo_ultimate', g: 'chalk',   i: '🧠', t: 'العبقري',           d: 'الفوز في إكس أو الخارقة', te: "Genius", de: "Win Ultimate Tic-Tac-Toe" },
    { id: 'xo_series',   g: 'chalk',   i: '🏆', t: 'بطل السلسلة',       d: 'الفوز بسلسلة الأفضل من 5', te: "Series Champion", de: "Win a best-of-5 series" },
    { id: 'blocks_line', g: 'blocks',  i: '🧱', t: 'أول صف',            d: 'إكمال أول صف في قلعة المكعبات', te: "First Line", de: "Clear your first line in Block Castle" },
    { id: 'blocks_four', g: 'blocks',  i: '💥', t: 'رباعية!',            d: 'إزالة 4 صفوف دفعة واحدة', te: "Four in One!", de: "Clear 4 lines at once" },
    { id: 'blocks_lvl5', g: 'blocks',  i: '🏯', t: 'باني القلاع',        d: 'الوصول إلى المستوى 5', te: "Castle Builder", de: "Reach level 5" },
    { id: 'bub_first',   g: 'bubbles', i: '🫧', t: 'أول مرحلة',          d: 'إنهاء أول مرحلة في مدفع الفقاعات', te: "First Stage", de: "Finish the first Bubble Shooter stage" },
    { id: 'bub_drop',    g: 'bubbles', i: '🌧️', t: 'شلال فقاعات',       d: 'إسقاط 10 فقاعات بطلقة واحدة', te: "Bubble Waterfall", de: "Drop 10 bubbles with one shot" },
    { id: 'bub_lvl10',   g: 'bubbles', i: '🐣', t: 'منقذ الحيوانات',    d: 'إنهاء المرحلة 10', te: "Animal Rescuer", de: "Finish stage 10" },
    { id: 'balls_10',    g: 'balls',   i: '⚽', t: 'رامي الكرات',        d: 'الوصول إلى الجولة 10', te: "Ball Thrower", de: "Reach round 10" },
    { id: 'balls_30',    g: 'balls',   i: '🌟', t: 'نجم الملعب',         d: 'الوصول إلى الجولة 30', te: "Star Player", de: "Reach round 30" },
    { id: 'balls_combo', g: 'balls',   i: '🎯', t: 'رمية خارقة',         d: 'كسر 5 مربعات برمية واحدة', te: "Super Shot", de: "Break 5 blocks with one throw" },
    { id: 'shapes_first', g: 'shapes', i: '🔷', t: 'أول لغز',            d: 'إنهاء أول مستوى في مطابقة الأشكال', te: "First Puzzle", de: "Finish the first Shape Match level" },
    { id: 'shapes_perfect', g: 'shapes', i: '💯', t: 'بلا أخطاء',        d: 'إنهاء مستوى دون أي خطأ', te: "No Mistakes", de: "Finish a level with no mistakes" },
    { id: 'shapes_all',  g: 'shapes',  i: '🎓', t: 'خبير الأشكال',       d: 'إنهاء كل مستويات مطابقة الأشكال', te: "Shape Expert", de: "Finish every Shape Match level" },
    { id: 'candy_first', g: 'candy',   i: '🍬', t: 'أول حلوى',            d: 'إنهاء أول مستوى في لعبة الحلويات', te: "First Candy", de: "Finish the first candy level" },
    { id: 'candy_special', g: 'candy', i: '🍭', t: 'حلوى خارقة',          d: 'صنع حلوى خاصة بمطابقة 4 أو 5', te: "Super Candy", de: "Make a special candy with 4 or 5 in a row" },
    { id: 'candy_lvl10', g: 'candy',   i: '🎂', t: 'نجم الحلويات',       d: 'إنهاء المستوى 10', te: "Candy Star", de: "Finish level 10" },
    { id: 'mem_first',   g: 'memory',  i: '🃏', t: 'ذاكرة قوية',          d: 'إنهاء أول لوحة في بطاقات الذاكرة', te: "Strong Memory", de: "Finish your first memory board" },
    { id: 'mem_perfect', g: 'memory',  i: '🧠', t: 'ذاكرة حديدية',        d: 'إنهاء لوحة بأخطاء قليلة جدًا', te: "Iron Memory", de: "Finish a board with very few mistakes" },
    { id: 'mem_big',     g: 'memory',  i: '🎴', t: 'اللوحة الكبيرة',      d: 'إنهاء لوحة من 12 زوجًا', te: "The Big Board", de: "Finish a 12-pair board" },
    { id: 'tubes_first', g: 'tubes',   i: '🧪', t: 'أول فرز',             d: 'إنهاء أول مستوى في أنابيب الألوان', te: "First Sort", de: "Finish the first Color Tubes level" },
    { id: 'tubes_10',    g: 'tubes',   i: '🌈', t: 'خبير الألوان',        d: 'إنهاء المستوى 10', te: "Color Expert", de: "Finish level 10" },
    { id: 'tubes_30',    g: 'tubes',   i: '⚗️', t: 'كيميائي صغير',        d: 'إنهاء المستوى 30', te: "Little Chemist", de: "Finish level 30" },
    { id: 'snake_10',    g: 'snake',   i: '🐛', t: 'دودة جائعة',          d: 'أكل 10 فواكه في جولة واحدة', te: "Hungry Worm", de: "Eat 10 fruits in one round" },
    { id: 'snake_30',    g: 'snake',   i: '🐍', t: 'دودة عملاقة',         d: 'الوصول إلى طول 30', te: "Giant Worm", de: "Reach length 30" },
    { id: 'snake_gold',  g: 'snake',   i: '🍏', t: 'التفاحة الذهبية',     d: 'أكل فاكهة ذهبية', te: "Golden Apple", de: "Eat a golden fruit" },
    { id: 'slide_first', g: 'slide',   i: '🧩', t: 'أول لغز',             d: 'حل أول لغز صور منزلقة', te: "First Puzzle", de: "Solve your first sliding picture" },
    { id: 'slide_4',     g: 'slide',   i: '🖼️', t: 'محترف الألغاز',      d: 'حل لغز 4×4', te: "Puzzle Pro", de: "Solve a 4×4 puzzle" },
    { id: 'slide_fast',  g: 'slide',   i: '⚡', t: 'سريع جدًا',            d: 'حل لغز 3×3 في أقل من دقيقة', te: "Super Fast", de: "Solve a 3×3 puzzle in under a minute" },
    { id: 'bfly_first',  g: 'butterfly', i: '🦋', t: 'صياد الفراشات',     d: 'إنهاء أول جولة في صيد الفراشات', te: "Butterfly Catcher", de: "Finish your first butterfly round" },
    { id: 'bfly_50',     g: 'butterfly', i: '🌼', t: 'عين الصقر',         d: 'صيد 50 فراشة صحيحة', te: "Hawk Eye", de: "Catch 50 right butterflies" },
    { id: 'bfly_lvl10',  g: 'butterfly', i: '🌈', t: 'خبير الألوان',      d: 'الوصول إلى المستوى 10', te: "Color Expert", de: "Reach level 10" },
    { id: 'let_first',   g: 'letters', i: '✍️', t: 'أول حرف',             d: 'تتبّع أول حرف', te: "First Letter", de: "Trace your first letter" },
    { id: 'let_ar',      g: 'letters', i: '🔤', t: 'الحروف العربية',     d: 'تتبّع الحروف العربية الـ28 كلها', te: "Arabic Letters", de: "Trace all 28 Arabic letters" },
    { id: 'let_en',      g: 'letters', i: '🅰️', t: 'ABC',                d: 'تتبّع الحروف الإنجليزية الـ26 كلها', te: "ABC", de: "Trace all 26 English letters" },
    { id: 'num_first',   g: 'numbers', i: '🔢', t: 'أول عدّ',            d: 'إنهاء أول مستوى في أرقام وعدّ', te: "First Count", de: "Finish the first Numbers level" },
    { id: 'num_add',     g: 'numbers', i: '➕', t: 'بطل الجمع',          d: 'حل 20 مسألة جمع', te: "Adding Hero", de: "Solve 20 addition problems" },
    { id: 'num_all',     g: 'numbers', i: '🧮', t: 'عبقري الأرقام',      d: 'إنهاء كل مستويات الأرقام', te: "Number Genius", de: "Finish every Numbers level" },
    { id: 'maze_first',  g: 'maze',    i: '🧭', t: 'أول متاهة',          d: 'حل أول متاهة', te: "First Maze", de: "Solve your first maze" },
    { id: 'maze_10',     g: 'maze',    i: '🗺️', t: 'مستكشف',             d: 'حل 10 متاهات', te: "Explorer", de: "Solve 10 mazes" },
    { id: 'maze_big',    g: 'maze',    i: '🏆', t: 'سيد المتاهات',       d: 'حل أكبر متاهة', te: "Maze Master", de: "Solve the biggest maze" },
    { id: 'diff_first',  g: 'diff',    i: '🔍', t: 'عين حادة',            d: 'إيجاد كل الفروق في أول صورة', te: "Sharp Eye", de: "Find all differences in the first picture" },
    { id: 'diff_fast',   g: 'diff',    i: '⚡', t: 'محقق سريع',           d: 'إيجاد 5 فروق في أقل من 30 ثانية', te: "Speedy Detective", de: "Find 5 differences in under 30 seconds" },
    { id: 'diff_all',    g: 'diff',    i: '🕵️', t: 'المحقق الكبير',      d: 'إنهاء كل صور الاختلافات', te: "Great Detective", de: "Finish every difference picture" },
    { id: 'taxi_first',  g: 'taxi',    i: '🚕', t: 'أول توصيلة',          d: 'توصيل أول راكب', te: "First Ride", de: "Drop off your first passenger" },
    { id: 'taxi_10',     g: 'taxi',    i: '🧍', t: 'سائق محترف',         d: 'توصيل 10 ركاب في جولة واحدة', te: "Pro Driver", de: "Drop off 10 passengers in one round" },
    { id: 'taxi_far',    g: 'taxi',    i: '🛣️', t: 'طريق طويل',          d: 'قطع 3000 متر في جولة واحدة', te: "Long Road", de: "Drive 3000 m in one round" },
    { id: 'cake_first',  g: 'cake',    i: '🎂', t: 'أول كعكة',           d: 'تزيين أول كعكة', te: "First Cake", de: "Decorate your first cake" },
    { id: 'cake_order',  g: 'cake',    i: '📋', t: 'طاهٍ ماهر',           d: 'إنجاز 10 طلبات للزبائن', te: "Skilled Baker", de: "Complete 10 customer orders" },
    { id: 'cake_artist', g: 'cake',    i: '🎨', t: 'فنان الكريمة',       d: 'رسم 20 خطًا بالكريمة على كعكة واحدة', te: "Cream Artist", de: "Draw 20 cream lines on one cake" },
    { id: 'harakat_first', g: 'harakat', i: '🏎️', t: 'أول سباق', d: 'إنهاء أول سباق حركات', te: "First Race", de: "Finish your first vowel race" },
    { id: 'harakat_perfect', g: 'harakat', i: '💯', t: 'سباق مثالي', d: '10 من 10 في سباق واحد', te: "Perfect Race", de: "10 out of 10 in one race" },
    { id: 'harakat_gems', g: 'harakat', i: '💎', t: 'جامع الألماس', d: 'جمع 100 ماسة', te: "Gem Collector", de: "Collect 100 gems" },
    { id: 'harakat_mix', g: 'harakat', i: '🔤', t: 'خبير الحروف', d: 'إنهاء مستوى خلط الحروف', te: "Letter Expert", de: "Finish the mixed letters level" },
    { id: 'harakat_short_all', g: 'harakat', i: '🏁', t: 'بطل الحركات', d: 'إنهاء كل مستويات الفتحة والضمة والكسرة', te: "Vowel Champion", de: "Finish every fatha, damma and kasra level" },
    { id: 'tower_first', g: 'tower', i: '🏙️', t: 'أول برج', d: 'بناء أول برج', te: "First Tower", de: "Build your first tower" },
    { id: 'tower_20', g: 'tower', i: '🔢', t: 'عدّاد العشرين', d: 'إنهاء مستوى حتى العشرين', te: "Counting to 20", de: "Finish a level up to twenty" },
    { id: 'tower_all', g: 'tower', i: '👷', t: 'مهندس الأبراج', d: 'إنهاء كل مستويات البرج', te: "Tower Engineer", de: "Finish every tower level" },
    { id: 'penguins_first', g: 'penguins', i: '🐧', t: 'أول مستوى بطاريق', d: 'إنهاء أول مستوى', te: "First Penguin Level", de: "Finish the first level" },
    { id: 'penguins_all', g: 'penguins', i: '👑', t: 'ملك البطاريق', d: 'نجوم في كل المستويات', te: "Penguin King", de: "Get stars on every level" },
    { id: 'penguins_ten', g: 'penguins', i: '🔟', t: 'عشرة بطاريق مرتّبة', d: 'ترتيب 10 بطاريق من أول محاولة', te: "Ten Penguins in Line", de: "Order 10 penguins on the first try" },
    { id: 'penguins_en', g: 'penguins', i: '🇬🇧', t: 'الأرقام بالإنجليزية', d: 'إنهاء مستوى بالإنجليزية', te: "Numbers in English", de: "Finish a level in English" },
    { id: 'numpuzzle_first', g: 'numpuzzle', i: '🔢', t: 'أول لغز أرقام', d: 'إنهاء أول لغز', te: "First Number Puzzle", de: "Finish your first puzzle" },
    { id: 'numpuzzle_perfect', g: 'numpuzzle', i: '✨', t: 'لغز أرقام بلا أخطاء', d: 'إنهاء لغز بلا أخطاء', te: "Perfect Number Puzzle", de: "Finish a puzzle with no mistakes" },
    { id: 'numpuzzle_all', g: 'numpuzzle', i: '🏆', t: 'بطل ألغاز الأرقام', d: 'إنهاء كل المستويات', te: "Number Puzzle Champ", de: "Finish every level" },
    { id: 'arpuzzle_first', g: 'arpuzzle', i: '🔤', t: 'أول لغز حروف', d: 'إنهاء أول لغز', te: "First Letter Puzzle", de: "Finish your first puzzle" },
    { id: 'arpuzzle_perfect', g: 'arpuzzle', i: '✨', t: 'لغز حروف بلا أخطاء', d: 'إنهاء لغز بلا أخطاء', te: "Perfect Letter Puzzle", de: "Finish a puzzle with no mistakes" },
    { id: 'arpuzzle_all', g: 'arpuzzle', i: '🏆', t: 'بطل الحروف العربية', d: 'إنهاء كل المستويات', te: "Arabic Letters Champ", de: "Finish every level" },
    { id: 'enpuzzle_first', g: 'enpuzzle', i: '🔠', t: 'أول لغز ABC', d: 'إنهاء أول لغز', te: "First ABC Puzzle", de: "Finish your first puzzle" },
    { id: 'enpuzzle_perfect', g: 'enpuzzle', i: '✨', t: 'لغز ABC بلا أخطاء', d: 'إنهاء لغز بلا أخطاء', te: "Perfect ABC Puzzle", de: "Finish a puzzle with no mistakes" },
    { id: 'enpuzzle_all', g: 'enpuzzle', i: '🏆', t: 'بطل الحروف الإنجليزية', d: 'إنهاء كل المستويات', te: "English Letters Champ", de: "Finish every level" },
    { id: 'sudanmap_first', g: 'sudanmap', i: '🗺️', t: 'أول خريطة للسودان', d: 'إكمال أول خريطة', te: "First Sudan Map", de: "Complete your first map" },
    { id: 'sudanmap_perfect', g: 'sudanmap', i: '🎯', t: 'خريطة بلا أخطاء', d: 'إكمال الخريطة كاملة بلا أخطاء', te: "Perfect Map", de: "Complete the whole map with no mistakes" },
    { id: 'sudanmap_quiz', g: 'sudanmap', i: '📍', t: 'أعرف ولايات السودان', d: '10 من 10 في سؤال الولايات', te: "I Know Sudan's States", de: "10 out of 10 in the states quiz" },
    { id: 'sudanmap_landmarks', g: 'sudanmap', i: '🏛️', t: 'مستكشف المعالم', d: '10 من 10 في سؤال المعالم', te: "Landmark Explorer", de: "10 out of 10 in the landmarks quiz" },
    { id: 'sudanmap_en', g: 'sudanmap', i: '🇬🇧', t: 'السودان بالإنجليزية', d: 'إنهاء أي وضع بالإنجليزية', te: "Sudan in English", de: "Finish any mode in English" },
    { id: 'pattern_first', g: 'pattern', i: '📿', t: 'أول نمط', d: 'إنهاء أول مستوى', te: "First Pattern", de: "Finish the first level" },
    { id: 'pattern_perfect', g: 'pattern', i: '✨', t: 'نمط بلا أخطاء', d: 'إنهاء مستوى بلا أخطاء', te: "Perfect Pattern", de: "Finish a level with no mistakes" },
    { id: 'pattern_all', g: 'pattern', i: '🏆', t: 'سيد الأنماط', d: 'إنهاء كل المستويات', te: "Pattern Master", de: "Finish every level" },
    { id: 'shadows_first', g: 'shadows', i: '👤', t: 'أول ظل', d: 'إنهاء أول مستوى', te: "First Shadow", de: "Finish the first level" },
    { id: 'shadows_perfect', g: 'shadows', i: '🦅', t: 'عين الصقر', d: 'إنهاء مستوى بلا أخطاء', te: "Hawk Eye", de: "Finish a level with no mistakes" },
    { id: 'shadows_all', g: 'shadows', i: '🏆', t: 'خبير الظلال', d: 'إنهاء كل المستويات', te: "Shadow Expert", de: "Finish every level" },
    { id: 'balance_first', g: 'balance', i: '⚖️', t: 'أول ميزان', d: 'إنهاء أول مستوى', te: "First Balance", de: "Finish the first level" },
    { id: 'balance_perfect', g: 'balance', i: '🎯', t: 'ميزان دقيق', d: 'إنهاء مستوى بلا أخطاء', te: "Spot-On Balance", de: "Finish a level with no mistakes" },
    { id: 'balance_all', g: 'balance', i: '🏆', t: 'خبير الموازين', d: 'نجوم في كل المستويات', te: "Balance Expert", de: "Get stars on every level" },
    { id: 'fractions_first', g: 'fractions', i: '🧁', t: 'أول كسر', d: 'إنهاء أول مستوى', te: "First Fraction", de: "Finish the first level" },
    { id: 'fractions_all', g: 'fractions', i: '🏆', t: 'خبير الكسور', d: 'نجوم في كل المستويات', te: "Fraction Expert", de: "Get stars on every level" },
    { id: 'wordtrain_first', g: 'wordtrain', i: '🚂', t: 'أول قطار', d: 'إكمال أول كلمة', te: "First Train", de: "Complete your first word" },
    { id: 'wordtrain_50', g: 'wordtrain', i: '🚃', t: '٥٠ كلمة في القطار', d: 'إكمال 50 كلمة', te: "50 Words on the Train", de: "Complete 50 words" },
    { id: 'wordtrain_ar', g: 'wordtrain', i: '🔤', t: 'كل قطارات العربي', d: 'إنهاء كل مستويات العربي', te: "All Arabic Trains", de: "Finish every Arabic level" },
    { id: 'wordtrain_en', g: 'wordtrain', i: '🔠', t: 'كل قطارات الإنجليزي', d: 'إنهاء كل مستويات الإنجليزي', te: "All English Trains", de: "Finish every English level" },
    { id: 'opposites_first', g: 'opposites', i: '🔀', t: 'عرفت الأضداد', d: 'إنهاء أول مستوى', te: "I Know Opposites", de: "Finish the first level" },
    { id: 'opposites_memory', g: 'opposites', i: '🧠', t: 'ذاكرة الأضداد', d: 'إنهاء مستوى في وضع الذاكرة', te: "Opposites Memory", de: "Finish a level in memory mode" },
    { id: 'opposites_all', g: 'opposites', i: '🏆', t: 'بطل الأضداد', d: 'إنهاء كل المستويات', te: "Opposites Champion", de: "Finish every level" },
    { id: 'mothers_first', g: 'mothers', i: '🐄', t: 'أول لقاء', d: 'إعادة أول صغير إلى أمه', te: "First Reunion", de: "Bring the first baby back to its mother" },
    { id: 'mothers_ears', g: 'mothers', i: '👂', t: 'أذن ذهبية', d: 'معرفة الحيوانات من أصواتها', te: "Golden Ears", de: "Know the animals by their sounds" },
    { id: 'mothers_all', g: 'mothers', i: '🏆', t: 'صديق الحيوانات', d: 'إنهاء كل المستويات', te: "Animal Friend", de: "Finish every level" },
    { id: 'duas_first', g: 'duas', i: '🤲', t: 'أول دعاء', d: 'اختيار أول دعاء صحيح', te: "First Dua", de: "Pick your first correct dua" },
    { id: 'duas_learn', g: 'duas', i: '📖', t: 'أتعلّم أدعيتي', d: 'الاستماع إلى كل الأدعية', te: "Learning My Duas", de: "Listen to every dua" },
    { id: 'duas_all', g: 'duas', i: '🌙', t: 'حافظ الأدعية', d: 'إنهاء كل المستويات', te: "Dua Keeper", de: "Finish every level" },
    { id: 'pegs_first', g: 'pegs', i: '🪵', t: 'أول تركيبة', d: 'إكمال أول مستوى', te: "First Build", de: "Complete the first level" },
    { id: 'pegs_tower', g: 'pegs', i: '🗼', t: 'برج الأشكال', d: 'تكديس 3 أشكال على مجموعة واحدة', te: "Shape Tower", de: "Stack 3 shapes on one peg set" },
    { id: 'pegs_add', g: 'pegs', i: '➕', t: 'جمع الأوتاد', d: 'إكمال مستوى الجمع', te: "Peg Adding", de: "Complete the adding level" },
    { id: 'pegs_all', g: 'pegs', i: '🏅', t: 'نجّار الأوتاد', d: 'إكمال المستويات السبعة', te: "Peg Carpenter", de: "Complete all seven levels" },
    { id: 'magicpad_first', g: 'magicpad', i: '✏️', t: 'أول رسمة', d: 'أول تتبّع أو رسمة محفوظة', te: "First Drawing", de: "Your first trace or saved drawing" },
    { id: 'magicpad_letters', g: 'magicpad', i: '🔤', t: 'الحروف العربية على اللوح', d: 'تتبّع الحروف العربية كلها', te: "Arabic Letters on the Pad", de: "Trace all the Arabic letters" },
    { id: 'magicpad_abc', g: 'magicpad', i: '🔠', t: 'ABC على اللوح', d: 'تتبّع الحروف الإنجليزية كلها', te: "ABC on the Pad", de: "Trace all the English letters" },
    { id: 'magicpad_numbers', g: 'magicpad', i: '🔢', t: 'أرقامي', d: 'تتبّع الأرقام كلها', te: "My Numbers", de: "Trace all the numbers" },
    { id: 'magicpad_dots', g: 'magicpad', i: '🖼️', t: 'صائد الصور', d: 'إكمال صور توصيل النقاط', te: "Picture Hunter", de: "Complete the dot-to-dot pictures" },
    { id: 'magicpad_artist', g: 'magicpad', i: '🎨', t: 'فنان صغير', d: 'حفظ 5 رسمات', te: "Little Artist", de: "Save 5 drawings" },
    { id: 'magicpad_all', g: 'magicpad', i: '🏆', t: 'سيد اللوح السحري', d: 'إكمال كل أوضاع اللوح', te: "Magic Pad Master", de: "Complete every pad mode" },
    { id: 'rings_first', g: 'rings', i: '🌈', t: 'أول هرم', d: 'إكمال أول مستوى', te: "First Pyramid", de: "Complete the first level" },
    { id: 'rings_rainbow', g: 'rings', i: '🎨', t: 'هرم قوس قزح', d: 'ترتيب الألوان كلها', te: "Rainbow Pyramid", de: "Order all the colors" },
    { id: 'rings_all', g: 'rings', i: '🏆', t: 'بطل الحلقات', d: 'إكمال كل المستويات', te: "Ring Champion", de: "Complete every level" },
    { id: 'woodblocks_first', g: 'woodblocks', i: '🧱', t: 'أول بناء', d: 'بناء أول نموذج', te: "First Build", de: "Build your first model" },
    { id: 'woodblocks_free', g: 'woodblocks', i: '🏗️', t: 'مهندس حر', d: 'حفظ بناء حر', te: "Free Builder", de: "Save a free build" },
    { id: 'woodblocks_pyramids', g: 'woodblocks', i: '🔺', t: 'أهرامات البجراوية', d: 'بناء الأهرامات', te: "Bajrawiya Pyramids", de: "Build the pyramids" },
    { id: 'woodblocks_all', g: 'woodblocks', i: '🏆', t: 'بنّاء ماهر', d: 'إكمال كل النماذج', te: "Master Builder", de: "Complete every model" },
    { id: 'abacus_first', g: 'abacus', i: '🧮', t: 'أول عدّ بالخرز', d: 'إكمال أول مستوى', te: "First Bead Count", de: "Complete the first level" },
    { id: 'abacus_en', g: 'abacus', i: '🇬🇧', t: 'العدّاد بالإنجليزية', d: 'إكمال مستوى بالإنجليزية', te: "Abacus in English", de: "Complete a level in English" },
    { id: 'abacus_hundred', g: 'abacus', i: '💯', t: 'عرضتُ المئة', d: 'عرض العدد 100', te: "I Showed 100", de: "Show the number 100" },
    { id: 'abacus_all', g: 'abacus', i: '🏆', t: 'بطل عدّاد الخرز', d: 'إكمال كل المستويات', te: "Abacus Champion", de: "Complete every level" },
    { id: 'piggybank_first', g: 'piggybank', i: '🐷', t: 'حصّالتي الأولى', d: 'إكمال أول مستوى', te: "My First Piggy Bank", de: "Complete the first level" },
    { id: 'piggybank_shop', g: 'piggybank', i: '🛒', t: 'أول شراء من الدكّان', d: 'الدفع في الدكّان', te: "First Shop Purchase", de: "Pay at the shop" },
    { id: 'piggybank_saver', g: 'piggybank', i: '💰', t: 'جمعتُ ثمن اللعبة', d: 'إكمال مستوى الادّخار', te: "Saved for the Toy", de: "Complete the saving level" },
    { id: 'piggybank_both', g: 'piggybank', i: '💱', t: 'بالجنيه والريال', d: 'اللعب بالعملتين', te: "Pounds and Riyals", de: "Play with both currencies" },
    { id: 'piggybank_en', g: 'piggybank', i: '🇬🇧', t: 'النقود بالإنجليزية', d: 'إكمال مستوى بالإنجليزية', te: "Money in English", de: "Complete a level in English" },
    { id: 'piggybank_all', g: 'piggybank', i: '🏆', t: 'بطل الحصّالة', d: 'إكمال كل المستويات', te: "Piggy Bank Champion", de: "Complete every level" },
    { id: 'locks_first', g: 'locks', i: '🔑', t: 'فاتح الأقفال', d: 'فتح أول باب', te: "Lock Opener", de: "Open the first door" },
    { id: 'locks_numbers', g: 'locks', i: '🔢', t: 'مفاتيح الأرقام', d: 'إكمال مستوى الأرقام', te: "Number Keys", de: "Complete the numbers level" },
    { id: 'locks_perfect', g: 'locks', i: '✨', t: 'بلا أخطاء', d: 'فتح 4 أبواب بلا أخطاء', te: "No Mistakes", de: "Open 4 doors with no mistakes" },
    { id: 'locks_all', g: 'locks', i: '🏆', t: 'سيد المفاتيح', d: 'إكمال كل المستويات', te: "Key Master", de: "Complete every level" },
    { id: 'traffic_first', g: 'traffic', i: '🚦', t: 'صديق الإشارة', d: 'إكمال أول مستوى', te: "Traffic Light Friend", de: "Complete the first level" },
    { id: 'traffic_driver', g: 'traffic', i: '🚗', t: 'سائق ماهر', d: 'مستوى قيادة بلا أخطاء', te: "Skilled Driver", de: "A driving level with no mistakes" },
    { id: 'traffic_signs', g: 'traffic', i: '🛑', t: 'خبير الإشارات', d: 'إكمال اختبار الإشارات', te: "Sign Expert", de: "Complete the signs quiz" },
    { id: 'traffic_home', g: 'traffic', i: '🏠', t: 'آمن في البيت', d: 'إكمال سلامة البيت', te: "Safe at Home", de: "Complete home safety" },
    { id: 'traffic_all', g: 'traffic', i: '🏆', t: 'بطل السلامة المرورية', d: 'إكمال كل المستويات', te: "Road Safety Hero", de: "Complete every level" },
    { id: 'body_first', g: 'body', i: '🧒', t: 'أول جسم', d: 'إكمال أول مستوى', te: "First Body", de: "Complete the first level" },
    { id: 'body_senses', g: 'body', i: '👃', t: 'الحواس الخمس', d: 'مستوى الحواس بلا أخطاء', te: "The Five Senses", de: "The senses level with no mistakes" },
    { id: 'body_dress', g: 'body', i: '👒', t: 'ألبسني', d: 'إكمال مستوى التلبيس', te: "Dress Me Up", de: "Complete the dressing level" },
    { id: 'body_explorer', g: 'body', i: '🔍', t: 'مستكشف الجسم', d: 'لمس كل أجزاء الجسم', te: "Body Explorer", de: "Touch every body part" },
    { id: 'body_all', g: 'body', i: '🏆', t: 'خبير الجسم', d: 'إكمال كل المستويات', te: "Body Expert", de: "Complete every level" },
    { id: 'jobs_first', g: 'jobs', i: '👩‍⚕️', t: 'أول مهنة', d: 'إكمال أول مستوى', te: "First Job", de: "Complete the first level" },
    { id: 'jobs_riddles', g: 'jobs', i: '❓', t: 'حلّال الألغاز', d: 'مستوى «من أنا؟» بلا أخطاء', te: "Riddle Solver", de: "The \"Who am I?\" level with no mistakes" },
    { id: 'jobs_dress', g: 'jobs', i: '👷', t: 'مصمّم الأزياء', d: 'إكمال مستوى التلبيس', te: "Costume Designer", de: "Complete the dressing level" },
    { id: 'jobs_meet_all', g: 'jobs', i: '🤝', t: 'صديق كل المهن', d: 'التعرّف على المهن العشرين', te: "Friend of Every Job", de: "Meet all twenty jobs" },
    { id: 'jobs_all', g: 'jobs', i: '🏆', t: 'خبير المهن', d: 'إكمال كل المستويات', te: "Jobs Expert", de: "Complete every level" },
    { id: 'seasons_first', g: 'seasons', i: '🌤️', t: 'أول فصل', d: 'إكمال أول مستوى', te: "First Season", de: "Complete the first level" },
    { id: 'seasons_haboob', g: 'seasons', i: '🌪️', t: 'جاهز للهبوب', d: 'التلبيس للهبوب', te: "Ready for the Haboob", de: "Dress up for the dust storm" },
    { id: 'seasons_reporter', g: 'seasons', i: '📺', t: 'مذيع النشرة الجوية', d: 'نشرة جوية بلا أخطاء', te: "Weather Reporter", de: "A weather report with no mistakes" },
    { id: 'seasons_play', g: 'seasons', i: '🎨', t: 'صانع الطقس', d: 'تجربة 10 أجواء', te: "Weather Maker", de: "Try 10 kinds of weather" },
    { id: 'seasons_all', g: 'seasons', i: '🏆', t: 'خبير الفصول', d: 'إكمال كل المستويات', te: "Seasons Expert", de: "Complete every level" },
    { id: 'lifecycle_first', g: 'lifecycle', i: '🌱', t: 'أول دورة', d: 'إكمال أول مستوى', te: "First Cycle", de: "Complete the first level" },
    { id: 'lifecycle_gardener', g: 'lifecycle', i: '🪴', t: 'المزارع الصغير', d: 'زرع نبتة حتى تثمر', te: "Little Farmer", de: "Grow a plant until it bears fruit" },
    { id: 'lifecycle_water', g: 'lifecycle', i: '💧', t: 'دورة الماء', d: 'ترتيب دورة الماء', te: "The Water Cycle", de: "Put the water cycle in order" },
    { id: 'lifecycle_all', g: 'lifecycle', i: '🏆', t: 'خبير دورات الحياة', d: 'إكمال كل المستويات', te: "Life Cycle Expert", de: "Complete every level" },
    { id: 'wudu_first', g: 'wudu', i: '🕌', t: 'أول خطوة', d: 'إكمال أول مستوى', te: "First Step", de: "Complete the first level" },
    { id: 'wudu_wudu', g: 'wudu', i: '💧', t: 'أتقنتُ الوضوء', d: 'إكمال تعلّم الوضوء', te: "I Mastered Wudu", de: "Finish learning wudu" },
    { id: 'wudu_prayer', g: 'wudu', i: '🕌', t: 'أتعلّم صلاتي', d: 'إكمال تعلّم الصلاة', te: "Learning My Prayer", de: "Finish learning the prayer" },
    { id: 'wudu_times', g: 'wudu', i: '🌅', t: 'الصلوات الخمس', d: 'إكمال أوقات الصلاة', te: "The Five Prayers", de: "Complete the prayer times" },
    { id: 'wudu_all', g: 'wudu', i: '🌟', t: 'نجم الوضوء والصلاة', d: 'إكمال كل المستويات', te: "Wudu & Prayer Star", de: "Complete every level" },
    { id: 'stories_first', g: 'stories', i: '📖', t: 'أول نهاية', d: 'الوصول لأول نهاية', te: "First Ending", de: "Reach your first ending" },
    { id: 'stories_six', g: 'stories', i: '📚', t: 'قارئ القصص', d: 'إكمال القصص الست', te: "Story Reader", de: "Finish all six stories" },
    { id: 'stories_all', g: 'stories', i: '🏆', t: 'كل النهايات', d: 'اكتشاف كل النهايات', te: "Every Ending", de: "Discover every ending" },
    { id: 'daily_3',     g: '',        i: '🎁', t: 'وفاء يومي',          d: 'فتح الهدية اليومية 3 أيام متتالية', te: "Daily Loyalty", de: "Open the daily gift 3 days in a row" },
    { id: 'shop_first',  g: '',        i: '🛍️', t: 'أول مشتريات',       d: 'شراء أول عنصر من المتجر', te: "First Purchase", de: "Buy your first item from the shop" },
    { id: 'all_games',   g: '',        i: '🎮', t: 'مستكشف الألعاب',     d: 'تجربة كل الألعاب', te: "Game Explorer", de: "Try every game" }
  ],

  /* ---------- أقسام القائمة: كل لعبة ← قسم (المجهولة تذهب إلى آخر القائمة) ---------- */
  CATS: [
    { id: 'lang',  t: 'لغة وحروف',     s: 'لغة وحروف',  te: 'Letters & Words',  se: 'Letters',  i: '🔤', c: '#F2484B' },
    { id: 'math',  t: 'أرقام وحساب',   s: 'أرقام وحساب', te: 'Numbers & Math',  se: 'Math',     i: '🔢', c: '#2F8CF0' },
    { id: 'brain', t: 'ذكاء وتفكير',   s: 'ذكاء وتفكير', te: 'Thinking & Puzzles', se: 'Puzzles', i: '🧠', c: '#8B5CF6' },
    { id: 'sci',   t: 'علوم ومعرفة',   s: 'علوم ومعرفة', te: 'Science & World', se: 'Science',  i: '🌍', c: '#1FB37A' },
    { id: 'values', t: 'قيم وآداب',    s: 'قيم وآداب',  te: 'Values & Manners', se: 'Values',   i: '🕌', c: '#14A3A0' },
    { id: 'fun',   t: 'مغامرة وحركة',  s: 'مغامرة وحركة', te: 'Action & Adventure', se: 'Action', i: '🎮', c: '#FF8A1F' },
    { id: 'art',   t: 'إبداع',          s: 'إبداع',       te: 'Creativity',      se: 'Create',   i: '🎨', c: '#F0609E' },
    { id: 'more',  t: 'ألعاب أخرى',     s: 'أخرى',        te: 'More Games',      se: 'More',     i: '✨', c: '#2E9BE6' }
  ],
  CAT_OF: {
    letters: 'lang', harakat: 'lang', wordtrain: 'lang', arpuzzle: 'lang', enpuzzle: 'lang', opposites: 'lang',
    numbers: 'math', tower: 'math', penguins: 'math', numpuzzle: 'math', balance: 'math', fractions: 'math', pegs: 'math', abacus: 'math', piggybank: 'math',
    shapes: 'brain', rings: 'brain', woodblocks: 'brain', locks: 'brain', pattern: 'brain', shadows: 'brain', memory: 'brain', maze: 'brain', diff: 'brain', tubes: 'brain', slide: 'brain', cosmos: 'brain', chalk: 'brain',
    mothers: 'sci', sudanmap: 'sci', butterfly: 'sci', body: 'sci', jobs: 'sci', seasons: 'sci', lifecycle: 'sci',
    duas: 'values', wudu: 'values', stories: 'values', traffic: 'values',
    jump: 'fun', taxi: 'fun', snake: 'fun', blocks: 'fun', bubbles: 'fun', balls: 'fun', candy: 'fun',
    cake: 'art', magicpad: 'art'
  },
  /** لون مميّز لبطاقة كل لعبة */
  ACCENT: {
    pegs: '#C98A4B', magicpad: '#3B5BDB', rings: '#E8590C', woodblocks: '#B5722E', abacus: '#E8862A', piggybank: '#F0609E', locks: '#F07F12', traffic: '#2E86F5', body: '#FF7A59', jobs: '#4263EB', seasons: '#1C7ED6', lifecycle: '#2F9E44', wudu: '#1098AD', stories: '#AE3EC9',
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
  /* ---------- اللغة العامة للتطبيق (عربي / English) ----------
     App.lang: 'ar' | 'en' (محفوظة لكل الجهاز). App.t(ar, en) يعيد النص حسب اللغة.
     الألعاب التي فيها مفتاح لغة خاص تتبع App.lang افتراضيًا، وعند تغييرها تُستدعى دالة اللعبة onLang(lang). */
  get lang() { return gstore.get('lang', 'ar') === 'en' ? 'en' : 'ar'; },
  t(ar, en) { return this.lang === 'en' && en != null ? en : ar; },
  /** لغة محتوى اللعبة: اختيار اللعبة الخاص إن وُجد وإلا لغة التطبيق */
  gameLang(id) { const v = store.get(id + 'Lang', null); return v === 'en' || v === 'ar' ? v : this.lang; },
  setLang(l) {
    l = l === 'en' ? 'en' : 'ar'; gstore.set('lang', l);
    /* لغة المحتوى في كل الألعاب تتبع اختيار الواجهة الجديد */
    try { Object.keys(localStorage).forEach(k => { if (/Lang$/.test(k) && !/^app:/.test(k)) localStorage.removeItem(k); }); } catch (e) {}
    const apply = () => {
      this.applyLang();
      const g = this.games[this.current]; if (g && g.onLang) { try { g.onLang(l); } catch (e) {} }
      if (this.current === 'menu' || !g) this.renderMenu();
    };
    // في القائمة (دون نافذة مفتوحة): تنزلق الواجهة خارجًا ثم تعود من الجهة الأخرى باللغة الجديدة
    if (this.current === 'menu' && Fx.on && !$('#sheetWrap').classList.contains('on')) Fx.langSwap(l, apply);
    else apply();
  },
  applyLang() {
    const l = this.lang, H = document.documentElement;
    H.lang = l; H.dir = l === 'en' ? 'ltr' : 'rtl'; H.dataset.lang = l;
    document.title = this.t(this.EDITION.title, this.EDITION.titleEn);
    const lab = { mSettings: ['الإعدادات', 'Settings'], mShop: ['المتجر', 'Shop'], mAch: ['الإنجازات', 'Achievements'], mGift: ['الهدية اليومية', 'Daily gift'], mStars: ['نجومي', 'My stars'], kids: ['الأطفال', 'Kids'], cats: ['أقسام الألعاب', 'Game categories'], mLang: ['اللغة', 'Language'] };
    for (const id in lab) { const el = document.getElementById(id); if (el) el.setAttribute('aria-label', this.t(...lab[id])); }
    document.querySelectorAll('#mLang [data-l]').forEach(b => { const on = b.dataset.l === l; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    const foot = $('#foot');
    if (foot) foot.innerHTML = this.t(`صُنعت بحب لـ${this.esc(this.EDITION.names)} 💕`, `Made with love for ${this.esc(this.EDITION.namesEn || this.EDITION.names)} 💕`) +
      `<div class="brand"><img src="img/albushra.jpg" alt="${this.t('البشرى تكنولوجي', 'Al-Bushra Technology')}"><b>${this.t('من إنتاج البشرى تكنولوجي', 'By Al-Bushra Technology')}</b></div>`;
  },
  /** عنوان اللعبة ووصفها وتعليماتها باللغة الحالية (العربي احتياطًا) */
  gTitle(g) { return this.lang === 'en' && g.titleEn ? g.titleEn : g.title; },
  gDesc(g) {
    const pick = d => typeof d === 'function' ? d() : d || '';
    if (this.lang === 'en' && g.descEn) { try { return pick(g.descEn); } catch (e) {} }
    return pick(g.desc);
  },
  gHelp(g) {
    const pick = h => typeof h === 'function' ? h() : h || [];
    if (this.lang === 'en' && g.helpEn) { try { const l = pick(g.helpEn); if (l && l.length) return l; } catch (e) {} }
    return pick(g.help);
  },
  /** اسم الطفل: أطفال النسخة الأصليون لهم اسم إنجليزي ما دام اسمهم العربي لم يتغيّر */
  kidName(k) {
    if (!k) return '';
    if (this.lang === 'en') { const p = (this.EDITION.profiles || []).find(p => p.id === k.id); if (p && p.en && p.name === k.name) return p.en; }
    return k.name;
  },
  /** عدد بأرقام عربية مشرقية في العربية وغربية في الإنجليزية */
  num(n) { return this.lang === 'en' ? String(n) : String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]); },
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
    setTimeout(() => { this.toast(this.t(`🏆 إنجاز جديد: ${a.t}`, `🏆 New achievement: ${a.te || a.t}`), 'ach'); Sound.win(); this.addStars(10); }, 300);
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
    $('#sheet').innerHTML = `<button class="close" aria-label="${this.t('إغلاق', 'Close')}">✕</button>` + html;
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
    let lines = []; try { lines = this.gHelp(g) || []; } catch (e) {}
    const s = this.openSheet(`<h3>${g.icon2 || '❓'} ${this.gTitle(g)}</h3><ul class="helpl">${lines.map(l => `<li>${l}</li>`).join('')}</ul>
      <div class="center"><button class="tbtn" id="hGo">${this.t('هيا نلعب!', "Let's play!")} ▶️</button></div>`);
    s.querySelector('#hGo').onclick = () => { Sound.tap(); this.closeSheet(); };
  },
  settings() {
    const P = this.profile, th = this.theme;
    const seg = (key, opts, val) => `<div class="seg" data-k="${key}">${opts.map(([v, l]) => `<button data-v="${v}" class="${String(v) === String(val) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    const T = (a, e) => this.t(a, e), on = [true, T('تشغيل', 'On')], off = [false, T('إيقاف', 'Off')], nm = this.esc(this.kidName(P));
    const s = this.openSheet(`<h3>⚙️ ${T('الإعدادات', 'Settings')}</h3>
      <div class="row"><span class="lbl">🌐 ${T('اللغة', 'Language')}</span><div class="seg" data-k="lang"><button data-v="ar" lang="ar" class="${this.lang === 'ar' ? 'on' : ''}">عربي</button><button data-v="en" lang="en" class="${this.lang === 'en' ? 'on' : ''}">English</button></div></div>
      <div class="row"><span class="lbl">👤 ${T(this.g('اللاعبة', 'اللاعب'), 'Player')}</span><div class="kchips">${this.PROFILES.map(k => `<button class="kchip ${k.id === P.id ? 'on' : ''}" data-kid="${k.id}"><span class="mini">${this.kidFace(k)}</span>${this.esc(this.kidName(k))}</button>`).join('')}</div>
        <div style="display:flex;gap:6px;width:100%;justify-content:center;flex-wrap:wrap"><button class="tbtn alt sm" id="sEdit">✏️ ${T('تعديل ' + nm, 'Edit ' + nm)}</button><button class="tbtn alt sm" id="sAdd">➕ ${T('طفل جديد', 'New child')}</button></div></div>
      <div class="row"><span class="lbl">🎨 ${T('الثيم', 'Theme')}</span>${seg('theme', [['girls', T('👑 بناتي', '👑 Girly')], ['boys', T('🚀 ولادي', '🚀 Boyish')]], th)}</div>
      <div class="row"><span class="lbl">🔊 ${T('المؤثرات', 'Sound effects')}</span>${seg('sfx', [on, off], gstore.get('sfx', true))}</div>
      <div class="row"><span class="lbl">🎵 ${T('الموسيقى', 'Music')}</span>${seg('music', [on, off], gstore.get('music', true))}</div>
      <div class="row"><span class="lbl">📳 ${T('الاهتزاز', 'Vibration')}</span>${seg('vib', [on, off], gstore.get('vib', true))}</div>
      <div class="row"><span class="lbl">🎙️ ${T('أصوات التطبيق', 'App voices')}</span><button class="tbtn alt sm" id="sStudio">🎙️ ${T('سجّل الأصوات', 'Record voices')}</button><button class="tbtn alt sm" id="sTts">🗣️ ${T('صوت الجهاز', 'Device voice')}</button></div>
      <div class="row"><span class="lbl">🔠 ${T('حجم الخط', 'Text size')}</span>${seg('font', [['normal', T('عادي', 'Normal')], ['large', T('كبير', 'Large')]], gstore.get('font', 'normal'))}</div>
      <div class="row"><span class="lbl">🗑️ ${T('بيانات ' + nm, nm + "'s data")}</span><button class="tbtn alt" id="sReset" style="font-size:14px;padding:6px 14px">${T('مسح النتائج', 'Clear scores')}</button></div>
      <p class="center" style="font-size:12px;opacity:.6;margin:8px 0 0">${T('الثيم يغيّر شكل القائمة فقط، ولا يغيّر الألعاب.', 'The theme changes the menu look only, not the games.')}</p>`);
    s.querySelectorAll('[data-kid]').forEach(b => b.onclick = () => { Sound.tap(); if (b.dataset.kid !== P.id) { this.closeSheet(); this.switchKid(b.dataset.kid); } });
    s.querySelector('#sEdit').onclick = () => { Sound.tap(); this.kidForm(P); };
    s.querySelector('#sAdd').onclick = () => { Sound.tap(); this.kidForm(null); };
    s.querySelector('#sStudio').onclick = () => { Sound.tap(); this.lazy(['voice/phrases.js', 'js/studio.js']).then(() => Studio.open()).catch(() => this.toast(T('تعذّر فتح الاستوديو', "Couldn't open the studio"))); };
    s.querySelector('#sTts').onclick = () => { Sound.tap(); this.lazy(['js/studio.js']).then(() => Studio.tts()).catch(() => this.toast(T('تعذّر الفتح', "Couldn't open it"))); };
    s.querySelectorAll('.seg').forEach(sg => sg.querySelectorAll('button').forEach(b => b.onclick = () => {
      const k = sg.dataset.k, raw = b.dataset.v, v = raw === 'true' ? true : raw === 'false' ? false : raw;
      Sound.tap();
      if (k === 'lang') { if (v !== this.lang) this.setLang(v); }
      else if (k === 'theme') { P.theme = v; this.saveKids(); store.set('theme', v); this.applyTheme(); }
      else if (k === 'font') { gstore.set('font', v); document.documentElement.dataset.font = v; }
      else { gstore.set(k, v); if (k === 'music') { if (v) { const g = this.games[this.current]; Music.play(g ? g.music : 'menu'); } else Music.stop(); } }
      this.settings();
    }));
    let armed = false;
    s.querySelector('#sReset').onclick = e => {
      if (!armed) { armed = true; e.target.textContent = T('اضغط مرة أخرى للتأكيد', 'Tap again to confirm'); return; }
      const keep = ['theme'];
      Object.keys(localStorage).filter(k => k.startsWith(P.id + ':') && !keep.includes(k.slice(P.id.length + 1))).forEach(k => localStorage.removeItem(k));
      this.toast(T('تم مسح بيانات ' + P.name, this.kidName(P) + "'s data was cleared")); this.closeSheet();
    };
  },
  shopSheet(cat) {
    const cats = Object.keys(this.shopCats).filter(c => this.shop.some(i => i.cat === c));
    cat = cat || cats[0];
    const items = this.shop.filter(i => i.cat === cat), eq = this.equipped(cat), stars = this.stars();
    const T = (a, e) => this.t(a, e);
    const s = this.openSheet(`<h3>🛍️ ${T('المتجر', 'Shop')} <small style="font-size:16px;color:var(--t-accent-d)">⭐ ${stars}</small></h3>
      <div class="tabs seg" style="display:flex;justify-content:center">${cats.map(c => `<button data-c="${c}" class="${c === cat ? 'on' : ''}">${this.shopCats[c].icon} ${T(this.shopCats[c].title, this.shopCats[c].te)}</button>`).join('')}</div>
      <div class="items">${items.map(i => {
        const own = this.owns(i.id), isEq = eq === i.id;
        const btn = isEq ? `<button class="eqb" disabled>✔️ ${T('مختار', 'Chosen')}</button>` : own ? `<button class="eqb" data-eq="${i.id}">${T('اختيار', 'Choose')}</button>` :
          `<button data-buy="${i.id}" class="${stars < i.price ? 'no' : ''}">${T('شراء', 'Buy')}</button>`;
        return `<div class="item ${isEq ? 'eq' : ''}"><canvas width="168" height="168" data-p="${i.id}"></canvas><b>${this.itemName(i)}</b><span class="price">${own ? (i.price ? T('تملكه', 'Yours') : T('مجاني', 'Free')) : '⭐ ' + i.price}</span>${btn}</div>`;
      }).join('')}</div>
      <p class="center" style="font-size:13px;opacity:.7;margin:10px 0 0">${T('اجمع النجوم باللعب والإنجازات والهدية اليومية', 'Collect stars by playing, earning achievements and opening the daily gift')} ⭐</p>`);
    s.querySelectorAll('.tabs button').forEach(b => b.onclick = () => { Sound.tap(); this.shopSheet(b.dataset.c); });
    s.querySelectorAll('canvas[data-p]').forEach(cv => { const it = this.shop.find(i => i.id === cv.dataset.p); const c = cv.getContext('2d'); c.scale(2, 2); try { it.draw(c, 84); } catch (e) { console.warn(e); } });
    s.querySelectorAll('[data-eq]').forEach(b => b.onclick = () => { Sound.tap(); store.set('eq:' + cat, b.dataset.eq); this.shopSheet(cat); });
    s.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => {
      const it = this.shop.find(i => i.id === b.dataset.buy);
      if (this.stars() < it.price) { Sound.error(); this.toast(T(`تحتاج ${it.price - this.stars()} ⭐ أخرى`, `You need ${it.price - this.stars()} more ⭐`)); return; }
      this.addStars(-it.price); const own = store.get('own', []); own.push(it.id); store.set('own', own);
      store.set('eq:' + cat, it.id); Sound.win(); this.toast(T(`🎉 ${it.name} أصبح لك!`, `🎉 The ${this.itemName(it)} is yours!`)); this.achieve('shop_first'); this.shopSheet(cat);
    });
  },
  achSheet() {
    const got = store.get('ach', []);
    const en = this.lang === 'en';
    this.openSheet(`<h3>🏆 ${this.t('الإنجازات', 'Achievements')} (${got.length}/${this.ACH.length})</h3>` + this.ACH.map(a =>
      `<div class="ach ${got.includes(a.id) ? '' : 'lock'}"><span class="ai">${a.i}</span><div><b>${en && a.te || a.t}</b><small>${en && a.de || a.d}</small></div><span class="ok">${got.includes(a.id) ? '✅' : '🔒'}</span></div>`).join('') +
      `<p class="center" style="font-size:13px;opacity:.7">${this.t('كل إنجاز يمنحك 10 ⭐', 'Every achievement gives you 10 ⭐')}</p>`);
  },
  today() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); },
  daily() {
    const st = store.get('daily', { last: '', streak: 0 });
    if (st.last === this.today()) { this.toast(this.t('عُد غدًا لهدية جديدة 🎁', 'Come back tomorrow for a new gift 🎁')); return; }
    const y = new Date(Date.now() - 864e5), yk = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
    st.streak = st.last === yk ? st.streak + 1 : 1; st.last = this.today(); store.set('daily', st);
    const n = 5 + 2 * Math.min(st.streak - 1, 5);
    const T = (a, e) => this.t(a, e);
    const s = this.openSheet(`<h3>🎁 ${T('هدية اليوم', "Today's gift")}</h3><div class="center" id="dStar" style="font-size:70px;${Fx.ok ? '' : 'animation:pop .5s'}">⭐</div>
      <p class="center" style="font-size:22px;font-weight:800;margin:4px 0">+${n} ${T('نجمة', 'stars')}</p>
      <p class="center">${st.streak > 1 ? T(`🔥 ${st.streak} أيام متتالية!`, `🔥 ${st.streak} days in a row!`) : T('عُد غدًا لهدية أكبر', 'Come back tomorrow for a bigger gift')}</p>
      <div class="center"><button class="tbtn" id="dOk">${T('رائع!', 'Awesome!')} 💖</button></div>`);
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
    /* دمج النسخ في تطبيق واحد: أضف أطفال النسخة غير الموجودين مرة واحدة فقط (ولا تُرجع طفلًا حذفه الأهل) */
    const merged = gstore.get('kidsMerged', []);
    let added = false;
    (this.EDITION.profiles || []).forEach(p => {
      if (merged.includes(p.id)) return;
      merged.push(p.id);
      if (!kids.some(k => k.id === p.id)) {
        const gender = p.gender || (p.theme === 'boys' ? 'boy' : 'girl');
        kids.push({ id: p.id, name: p.name, gender, theme: p.theme || (gender === 'boy' ? 'boys' : 'girls'), av: p.av || '⭐', age: null, photo: null });
        added = true;
      }
    });
    gstore.set('kidsMerged', merged);
    if (added) gstore.set('kids', kids);
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
    const T = (a, e) => this.t(a, e);
    const s = this.openSheet(`<h3>${isNew ? '➕ ' + T('طفل جديد', 'New child') : '✏️ ' + T('تعديل ', 'Edit ') + this.esc(this.kidName(kid))}</h3>
      <div class="kf-top"><div class="kf-av" id="kfAv"></div>
        <div class="kf-pb">
          <label class="pbtn">📷 ${T('التقاط صورة', 'Take a photo')}<input type="file" accept="image/*" capture="user" data-ph></label>
          <label class="pbtn">🖼️ ${T('من المعرض', 'From gallery')}<input type="file" accept="image/*" data-ph></label>
          <button class="pbtn" id="kfNoPh">✖ ${T('بلا صورة', 'No photo')}</button>
        </div></div>
      <div class="kf-l">✍️ ${T('الاسم', 'Name')}</div>
      <input class="kf-in" id="kfName" maxlength="16" autocomplete="off" enterkeyhint="done" dir="auto" placeholder="${T('اكتب اسم الطفل', "Type the child's name")}" value="${this.esc(d.name)}">
      <div class="kf-l">👶 ${T('بنت أم ولد؟', 'Girl or boy?')}</div>
      <div class="kf-g" id="kfG"><button class="g" data-g="girl"><span>👧</span>${T('بنت', 'Girl')}</button><button class="b" data-g="boy"><span>👦</span>${T('ولد', 'Boy')}</button></div>
      <div class="kf-l">🎂 ${T('العمر', 'Age')} <small>${T('(اختياري)', '(optional)')}</small></div>
      <div class="seg kf-age" id="kfAge">${[['', '—'], ...[3, 4, 5, 6, 7, 8].map(n => [n, n])].map(([v, l]) => `<button data-a="${v}">${l}</button>`).join('')}</div>
      <div class="kf-l">🎨 ${T('شكل التطبيق', 'App look')}</div>
      <div class="themes" id="kfT" style="margin:0"><button class="g" data-t="girls"><span>👑</span>${T('بناتي', 'Girly')}</button><button class="b" data-t="boys"><span>🚀</span>${T('ولادي', 'Boyish')}</button></div>
      <div class="kf-l">😊 ${T('الرمز', 'Icon')} <small>${T('(يظهر إن لم توجد صورة)', '(shown when there is no photo)')}</small></div>
      <div class="kf-emo" id="kfE">${this.KID_EMOJI.map(e => `<button data-e="${e}">${e}</button>`).join('')}</div>
      <div class="kf-act"><button class="tbtn" id="kfSave">✔️ ${isNew ? T('إضافة', 'Add') : T('حفظ', 'Save')}</button>
        ${!isNew && this.PROFILES.length > 1 ? `<button class="tbtn danger sm" id="kfDel">🗑️ ${T('حذف', 'Delete')}</button>` : ''}</div>`);
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
      catch (e) { Sound.error(); this.toast(T('تعذّر فتح هذه الصورة', "Couldn't open this photo")); }
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
      if (!d.name) { need(nameIn, T('اكتب اسم الطفل أولًا ✍️', "Type the child's name first ✍️")); nameIn.focus(); return; }
      if (!d.gender) { need(s.querySelector('#kfG'), T('اختر: بنت أم ولد؟', 'Choose: girl or boy?')); return; }
      if (!d.theme) d.theme = d.gender === 'boy' ? 'boys' : 'girls';
      if (!d.av) d.av = d.gender === 'boy' ? '🚀' : '👑';
      let k = kid, before = kid ? { ...kid } : null;
      if (isNew) { k = { id: 'k' + Date.now().toString(36) + Math.floor(Math.random() * 1e3).toString(36) }; this.PROFILES.push(k); }
      Object.assign(k, { name: d.name, gender: d.gender, theme: d.theme, av: d.av, age: d.age || null, photo: d.photo || null });
      if (!this.saveKids()) { // لا مساحة: نحفظ بلا صورة
        k.photo = null;
        if (!this.saveKids()) { if (isNew) this.PROFILES.pop(); else Object.assign(k, before); Sound.error(); this.toast(T('لا توجد مساحة كافية للحفظ', 'Not enough space to save')); return; }
        this.toast(T('حُفظ بلا صورة (لا توجد مساحة كافية)', 'Saved without the photo (not enough space)'));
      }
      Sound.win(); gstore.set('kidsTip', true);
      if (isNew) { this.closeSheet(); this.switchKid(k.id); this.toast(T(`أهلًا ${k.name}! 🎉`, `Welcome, ${k.name}! 🎉`)); }
      else { this.iconCache.clear(); this.closeSheet(); if (k === this.profile) this.applyTheme(); }
    };
    const del = s.querySelector('#kfDel');
    if (del) del.onclick = () => { Sound.tap(); this.kidDelete(kid); };
    if (isNew) setTimeout(() => { try { nameIn.focus({ preventScroll: true }); } catch (e) {} }, 450);
  },
  /** تأكيد حذف طفل ثم حذف كل مفاتيحه */
  kidDelete(kid) {
    const T = (a, e) => this.t(a, e), nm = this.esc(this.kidName(kid));
    const s = this.openSheet(`<h3>${T(`حذف ${nm}؟`, `Delete ${nm}?`)}</h3>
      <div class="kf-top"><div class="kf-av">${this.kidFace(kid)}</div></div>
      <p class="center" style="font-size:17px;font-weight:700;margin:14px 0 4px">${T(`سيُحذف ${nm} مع كل ${kid.gender === 'boy' ? 'نجومه ونتائجه' : 'نجومها ونتائجها'} من هذا الجهاز، ولا يمكن التراجع.`,
        `${nm} and all ${kid.gender === 'boy' ? 'his' : 'her'} stars and scores will be deleted from this device. This can't be undone.`)}</p>
      <div class="kf-act"><button class="tbtn danger" id="kdYes">🗑️ ${T('نعم، احذف', 'Yes, delete')}</button><button class="tbtn alt" id="kdNo">${T('لا، تراجع', 'No, go back')}</button></div>`);
    s.querySelector('#kdNo').onclick = () => { Sound.tap(); this.kidForm(kid); };
    s.querySelector('#kdYes').onclick = () => {
      const i = this.PROFILES.indexOf(kid); if (i < 0 || this.PROFILES.length < 2) { this.closeSheet(); return; }
      Object.keys(localStorage).filter(k => k.startsWith(kid.id + ':')).forEach(k => localStorage.removeItem(k));
      this.PROFILES.splice(i, 1); this.saveKids(); MyVoice.removeKid(kid.id);
      Sound.poof(); this.toast(T(`تم حذف ${kid.name}`, `${this.kidName(kid)} was deleted`));
      if (this.profile === kid) this.setProfile(this.PROFILES[0].id); else this.closeSheet();
    };
  },
  logo() {
    const P = this.profile, boys = this.theme === 'boys';
    if (!this.customLogo) return `<img src="logo.jpg" alt="${this.esc(this.t(this.EDITION.title, this.EDITION.titleEn))}">`; // الشعار المشترك للتطبيق
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
    const sig = this.lang + '|' + this.PROFILES.map(k => [k.id, k.name, k.gender, k.av, k.photo ? k.photo.length : 0].join(',')).join('|');
    if (box.dataset.sig !== sig) {
      box.dataset.sig = sig;
      box.innerHTML = this.PROFILES.map(k => `<button class="kid" data-k="${this.esc(k.id)}" data-g="${k.gender}" aria-label="${this.esc(this.kidName(k))}">
          <span class="kav">${this.kidFace(k)}<i class="ked" title="${this.t('تعديل', 'Edit')}">✏️</i></span><b>${this.esc(this.kidName(k))}</b></button>`).join('') +
        `<button class="kid add" data-add="1" aria-label="${this.t('إضافة طفل', 'Add a child')}"><span class="kav">＋</span><b>${this.t('إضافة طفل', 'Add child')}</b></button>`;
    }
    box.querySelectorAll('.kid[data-k]').forEach(b => b.classList.toggle('on', b.dataset.k === P.id));
    const tip = $('#ktip');
    if (tip) tip.textContent = gstore.get('kidsTip', false) ? '' : this.t(this.g('👆 اختاري اسمك، أو أضيفي طفلًا جديدًا', '👆 اختر اسمك، أو أضف طفلًا جديدًا'), '👆 Pick your name, or add a new child');
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
    const emo = this.theme === 'boys' ? '🚀' : '👑';
    $('#hello').textContent = this.t(`أهلًا يا ${P.name}! ${emo}`, `Hi, ${this.kidName(P)}! ${emo}`);
    $('#sub').textContent = this.t(this.g('اختاري لعبتك المفضّلة', 'اختر لعبتك المفضّلة'), 'Pick your favourite game');
    const played = store.get('played', []);
    const catIds = this.CATS.map(c => c.id);
    const groups = this.CATS.map(c => ({ ...c, ids: this.order.filter(id => (catIds.includes(this.CAT_OF[id]) ? this.CAT_OF[id] : 'more') === c.id).sort((x, y) => this.catRank(x) - this.catRank(y)) })).filter(g => g.ids.length);
    const cv = c => `--c:${c.c};--cd:${this.shade(c.c, -.22)};--cl:${this.shade(c.c, .3)}`;
    const card = id => {
      const g = this.games[id], A = this.accent(id); let best = '', desc = '';
      try { best = g.best ? g.best() || '' : ''; } catch (e) {}
      try { desc = this.gDesc(g); } catch (e) {}
      return `<button class="card" data-go="${id}" style="--a:${A.a};--ad:${A.ad};--al:${A.al}">${g.isNew && !played.includes(id) ? `<span class="newtag">${this.t('جديدة', 'New')}</span>` : ''}
        <div class="ic"><canvas width="240" height="240" data-ic="${id}"></canvas></div>
        <h2>${this.gTitle(g)}</h2><p>${desc}</p><div class="best">${best}</div></button>`;
    };
    const en = this.lang === 'en';
    $('#cats').innerHTML = groups.length > 1 ? groups.map(c => `<button data-cat="${c.id}" style="${cv(c)}">${c.i} ${en ? c.se || c.te : c.s || c.t}</button>`).join('') : '';
    $('#cards').innerHTML = groups.map(c => `<section class="grp" id="grp-${c.id}" style="${cv(c)}">
      <h2 class="gh"><span class="gi">${c.i}</span>${en ? c.te : c.t}<small>${c.ids.length}</small></h2>
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
    this.applyLang();
    document.querySelectorAll('#mLang [data-l]').forEach(b => b.onclick = e => {
      e.stopPropagation(); Sound.tap(); vibrate(15);
      if (b.dataset.l !== this.lang) this.setLang(b.dataset.l);
      else if (Fx.on) gsap.fromTo(b, { scale: .85 }, { scale: 1, duration: .5, ease: 'elastic.out(1,0.4)', clearProps: 'transform' });
    });
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
    else if (window.Splash && Splash.active) Splash.onEnd(() => Fx.menuIntro());
    else Fx.menuIntro();
    if (window.Splash) Splash.ready();
    window.addEventListener('popstate', () => { if (this.current !== 'menu') this.show('menu'); });
    window.__androidBack = () => this.back();
    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
    }
  }
};
