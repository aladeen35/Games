/* =====================================================================
   اللوح السحري — نسخة رقمية من لوح الكتابة LCD الحقيقي
   إطار أزرق، شاشة سوداء لامعة، خطوط تتوهّج بألوان قوس قزح حسب موضعها،
   وزر 🗑️ يمسح اللوح بومضة. رسم حر + تتبّع الحروف والأرقام والأشكال
   + ارسم ما تسمع + صِل النقاط. ثنائي اللغة (عربي / English).
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'magicpad';
  const TAU = Math.PI * 2;
  const FONT_NAME = '"Baloo Bhaijaan 2"';
  const FONT = `${FONT_NAME},system-ui,"Segoe UI",Tahoma,sans-serif`;
  const GS = () => window.gsap || null;

  /* ---------- البيانات ---------- */
  const AR_LETTERS = [['ا', 'ألف'], ['ب', 'باء'], ['ت', 'تاء'], ['ث', 'ثاء'], ['ج', 'جيم'], ['ح', 'حاء'], ['خ', 'خاء'], ['د', 'دال'],
    ['ذ', 'ذال'], ['ر', 'راء'], ['ز', 'زاي'], ['س', 'سين'], ['ش', 'شين'], ['ص', 'صاد'], ['ض', 'ضاد'], ['ط', 'طاء'], ['ظ', 'ظاء'],
    ['ع', 'عين'], ['غ', 'غين'], ['ف', 'فاء'], ['ق', 'قاف'], ['ك', 'كاف'], ['ل', 'لام'], ['م', 'ميم'], ['ن', 'نون'], ['ه', 'هاء'],
    ['و', 'واو'], ['ي', 'ياء']];
  const AR_DIG = '٠١٢٣٤٥٦٧٨٩';
  const AR_NUM = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const EN_NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

  /* أشكال وخطوط ما قبل الكتابة (في صندوق 100 وحدة) */
  const dense = (pts, step = 1.2) => {
    const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
      for (let k = 1; k <= n; k++) out.push([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]);
    }
    return out;
  };
  const rtl = (pts, on) => on ? pts : pts.map(([x, y]) => [100 - x, y]);
  const SHAPES = [
    { id: 'circle', ar: 'دائرة', en: 'Circle', w: 100, h: 100, mk: () => { const p = []; for (let i = 0; i <= 90; i++) { const a = -Math.PI / 2 - i / 90 * TAU; p.push([50 + 40 * Math.cos(a), 50 + 40 * Math.sin(a)]); } return [p]; } },
    { id: 'square', ar: 'مربع', en: 'Square', w: 100, h: 100, mk: () => [dense([[14, 14], [14, 86], [86, 86], [86, 14], [14, 14]])] },
    { id: 'triangle', ar: 'مثلث', en: 'Triangle', w: 100, h: 100, mk: () => [dense([[50, 10], [11, 84], [89, 84], [50, 10]])] },
    { id: 'star', ar: 'نجمة', en: 'Star', w: 100, h: 100, mk: () => { const P = k => [50 + 44 * Math.cos(-Math.PI / 2 + k * TAU / 5), 55 + 44 * Math.sin(-Math.PI / 2 + k * TAU / 5)]; return [dense([0, 3, 1, 4, 2, 0].map(P))]; } },
    { id: 'heart', ar: 'قلب', en: 'Heart', w: 100, h: 100, mk: () => {
      const half = sg => { const p = []; for (let i = 0; i <= 60; i++) { const t = i / 60 * Math.PI, x = sg * 16 * Math.pow(Math.sin(t), 3), y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)); p.push([50 + x * 2.65, 52 + (y - 2.5) * 2.65]); } return p; };
      return [half(-1), half(1)];
    } },
    { id: 'line', ar: 'خط مستقيم', en: 'Straight line', w: 100, h: 44, line: true, mk: ar => [rtl(dense([[8, 22], [92, 22]]), !ar).reverse()] },
    { id: 'zigzag', ar: 'خط متعرج', en: 'Zigzag line', w: 100, h: 56, line: true, mk: ar => [rtl(dense([[8, 14], [22, 42], [36, 14], [50, 42], [64, 14], [78, 42], [92, 14]]), !ar).reverse()] },
    { id: 'wave', ar: 'خط متموج', en: 'Wavy line', w: 100, h: 56, line: true, mk: ar => { const p = []; for (let i = 0; i <= 120; i++) { const t = i / 120; p.push([8 + 84 * t, 28 - 15 * Math.sin(t * TAU * 2)]); } return [rtl(p, !ar).reverse()]; } },
    { id: 'spiral', ar: 'خط حلزوني', en: 'Spiral', w: 100, h: 100, mk: ar => { const p = []; for (let i = 0; i <= 200; i++) { const t = i / 200, a = t * TAU * 2.6 * (ar ? -1 : 1) - Math.PI / 2; p.push([50 + (4 + 38 * t) * Math.cos(a), 50 + (4 + 38 * t) * Math.sin(a)]); } return [p]; } }
  ];
  // تصحيح: الخطوط في الوضع العربي تبدأ من اليمين
  SHAPES.forEach(s => { if (s.line) { const f = s.mk; s.mk = ar => { const r = f(ar); return r.map(p => (ar ? (p[0][0] < p[p.length - 1][0] ? p.reverse() : p) : (p[0][0] > p[p.length - 1][0] ? p.reverse() : p))); }; } });

  /* صوَر صِل النقاط (صندوق 100) */
  const PICS = [
    { id: 'star', ar: 'نجمة', en: 'Star', closed: true, dots: (() => { const a = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 19 : 46, t = -Math.PI / 2 + i * Math.PI / 5; a.push([50 + r * Math.cos(t), 54 + r * Math.sin(t)]); } return a; })(), col: ['#FFE45C', '#FFB020'] },
    { id: 'heart', ar: 'قلب', en: 'Heart', closed: true, dots: (() => { const a = []; for (let i = 0; i < 14; i++) { const t = i / 14 * TAU, x = 16 * Math.pow(Math.sin(t), 3), y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)); a.push([50 + x * 2.7, 50 + (y - 2.5) * 2.7]); } return a; })(), col: ['#FF7BA9', '#E8235B'] },
    { id: 'fish', ar: 'سمكة', en: 'Fish', closed: true, dots: [[8, 50], [18, 36], [32, 28], [48, 26], [62, 32], [72, 42], [90, 26], [86, 50], [90, 74], [72, 58], [62, 68], [48, 74], [32, 72], [18, 64]], col: ['#FFB347', '#FF7A1A'] },
    { id: 'boat', ar: 'قارب', en: 'Boat', closed: true, dots: [[10, 66], [47, 66], [47, 8], [82, 60], [53, 60], [53, 66], [90, 66], [76, 86], [24, 86]], col: ['#8BD3FF', '#2F8CF0'] },
    { id: 'kite', ar: 'طائرة ورقية', en: 'Kite', closed: true, dots: [[50, 4], [65, 20], [80, 36], [65, 54], [50, 72], [35, 54], [20, 36], [35, 20]], col: ['#B48CFF', '#7048E8'] },
    { id: 'rocket', ar: 'صاروخ', en: 'Rocket', closed: true, dots: [[50, 4], [61, 16], [66, 34], [66, 60], [80, 74], [80, 88], [64, 80], [36, 80], [20, 88], [20, 74], [34, 60], [34, 34], [39, 16]], col: ['#F5F7FF', '#B9C6E8'] },
    { id: 'umbrella', ar: 'مظلة', en: 'Umbrella', closed: false, dots: [[6, 50], [12, 32], [26, 17], [50, 10], [74, 17], [88, 32], [94, 50], [78, 46], [64, 50], [53, 46], [53, 82], [46, 90], [39, 84]], col: ['#FF6B8B', '#D6336C'] },
    { id: 'apple', ar: 'تفاحة', en: 'Apple', closed: true, dots: [[50, 24], [62, 15], [78, 16], [90, 30], [90, 52], [82, 72], [67, 88], [50, 84], [33, 88], [18, 72], [10, 52], [10, 30], [22, 16], [38, 15]], col: ['#FF6B6B', '#C92A2A'] },
    { id: 'balloon', ar: 'بالون', en: 'Balloon', closed: true, dots: [[50, 5], [67, 9], [79, 22], [82, 40], [75, 57], [60, 70], [55, 76], [45, 76], [40, 70], [25, 57], [18, 40], [21, 22], [33, 9]], col: ['#63E6BE', '#0CA678'] },
    { id: 'car', ar: 'سيارة', en: 'Car', closed: true, dots: [[6, 72], [6, 54], [20, 50], [32, 32], [66, 32], [78, 50], [94, 54], [94, 72]], col: ['#FF8787', '#E03131'] }
  ];

  const MODES = [
    { id: 'free', icon: '🎨', col: '#FF6FA8', t: () => 'رسم حر', d: () => App.g('ارسمي ما تحبّين', 'ارسم ما تحبّ') },
    { id: 'ar', icon: 'ب', col: '#F2484B', t: () => 'الحروف العربية', d: () => 'ا ← ي' },
    { id: 'en', icon: 'Aa', col: '#4263EB', t: () => 'الحروف الإنجليزية', d: () => 'A–Z  a–z' },
    { id: 'num', icon: '١٢٣', col: '#12B886', t: () => 'الأرقام', d: () => lang === 'ar' ? '٠ ← ٩' : '0 – 9' },
    { id: 'shp', icon: '⭐', col: '#F59F00', t: () => 'أشكال وخطوط', d: () => 'دائرة، نجمة، خط متعرج…' },
    { id: 'hear', icon: '👂', col: '#AE3EC9', t: () => App.g('اسمعي وارسمي', 'اسمع وارسم'), d: () => App.g('ارسمي ما تسمعينه', 'ارسم ما تسمعه') },
    { id: 'dots', icon: '🔢', col: '#1098AD', t: () => 'صِل النقاط', d: () => 'صورة مخفية تظهر!' }
  ];
  const HEAR_ROUNDS = 5;
  const GAL_MAX = 12;

  /* ---------- الحالة ---------- */
  let root, bgc, scr, cg, cw, ci, cf, xg, xw, xi, xf, trashBtn, toolsEl, barEl, lvEl, resEl;
  let W = 0, H = 0, DPR = 1, D = null, S = { x: 0, y: 0, w: 100, h: 100, r: 10 }, scrRect = null;
  let lang = 'ar', prog = null, view = 'levels', mode = null, idx = 0;
  let strokes = [], cur = null, pid = null, freeKeep = null;
  let gradInk = null, gradGlow = null;
  let raf = 0, running = false, paused = false, lastT = 0, idleT = 0;
  let parts = [], trail = [], wipeFx = null, flashA = 0, stylusAt = null;
  let T = null;           // حالة التتبّع
  let DT = null;          // حالة صِل النقاط
  let HR = null;          // حالة اسمع وارسم
  let busy = false, token = 0;

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const dg = n => lang === 'ar' ? String(n).replace(/\d/g, d => AR_DIG[d]) : String(n);
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const praiseAr = () => App.g('أحسنتِ!', 'أحسنت!');
  function say(ar, en) { if (lang === 'en' && en != null) App.speak(en, 'en'); else App.speak(ar); }
  const EASE = {
    none: t => t, 'power1.out': t => 1 - (1 - t) * (1 - t), 'power2.out': t => 1 - Math.pow(1 - t, 3), 'power2.in': t => t * t * t,
    'power2.inOut': t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, 'sine.inOut': t => -(Math.cos(Math.PI * t) - 1) / 2,
    'back.out': t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  };
  /** تحريك قيم رقمية: GSAP إن وُجد، وإلا محرّك صغير بديل */
  function tween(obj, vars) {
    const g = GS(); if (g) return g.to(obj, vars);
    const dur = (vars.duration == null ? .5 : vars.duration) * 1000, delay = (vars.delay || 0) * 1000, from = {}, to = {};
    for (const k in vars) if (typeof vars[k] === 'number' && !['duration', 'delay'].includes(k)) { from[k] = obj[k]; to[k] = vars[k]; }
    const ez = EASE[String(vars.ease || 'power2.out').replace(/\(.*\)/, '')] || EASE['power2.out'];
    let t0 = null, dead = false;
    const step = ts => {
      if (dead) return; if (t0 === null) t0 = ts + delay;
      const t = Math.min(1, Math.max(0, (ts - t0) / Math.max(1, dur))), e = ez(t);
      for (const k in to) obj[k] = from[k] + (to[k] - from[k]) * e;
      if (vars.onUpdate) vars.onUpdate(); if (t < 1) requestAnimationFrame(step); else if (vars.onComplete) vars.onComplete();
    };
    requestAnimationFrame(step); return { kill() { dead = true; } };
  }
  /** تحريك عناصر الواجهة بـ GSAP فقط (الشكل النهائي صحيح بدونه) */
  function uiFrom(el, vars) { const g = GS(); if (g && el) g.from(el, vars); }
  function uiTo(el, vars) { const g = GS(); if (g && el) g.to(el, vars); }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }

  /* ---------- التقدّم ---------- */
  function loadProg() {
    const p = store.get('magicpadProg', null) || {};
    ['ar', 'en', 'num', 'shp', 'dots'].forEach(k => { if (!p[k] || typeof p[k] !== 'object') p[k] = {}; });
    p.hear = p.hear || 0; p.saves = p.saves || 0;
    return p;
  }
  const saveProg = () => store.set('magicpadProg', prog);

  /* ---------- عناصر كل مستوى ---------- */
  function itemsOf(m) {
    if (m === 'ar') return AR_LETTERS.map(([c, n]) => ({ key: c, label: c, kind: 'glyph', text: c, alpha: 'ar', ar: n, en: null, sayAr: n }));
    if (m === 'en') { const a = []; for (let i = 0; i < 26; i++) { const C = String.fromCharCode(65 + i), l = C.toLowerCase(); a.push({ key: C, label: C, kind: 'glyph', text: C, alpha: 'en', en: C }, { key: l, label: l, kind: 'glyph', text: l, alpha: 'en', en: C }); } return a; }
    if (m === 'num') { const a = []; for (let i = 0; i < 10; i++) { const ch = lang === 'ar' ? AR_DIG[i] : String(i); a.push({ key: ch, label: ch, kind: ch === '٠' ? 'zero' : 'glyph', text: ch, alpha: 'num', ar: AR_NUM[i], en: EN_NUM[i], n: i }); } return a; }
    if (m === 'shp') return SHAPES.map(s => ({ key: s.id, label: lang === 'ar' ? s.ar : s.en, kind: 'shape', shape: s, ar: s.ar, en: s.en }));
    if (m === 'dots') return PICS.map(p => ({ key: p.id, label: lang === 'ar' ? p.ar : p.en, kind: 'pic', pic: p, ar: p.ar, en: p.en }));
    return [];
  }
  function sayItem(it) {
    if (!it) return;
    if (mode === 'ar') App.speak(it.ar);
    else if (mode === 'en') App.speak(it.en, 'en');
    else say(it.ar, it.en);
  }
  function modeStars(m) {
    if (m === 'hear') return { got: prog.hear, max: 3 };
    if (m === 'free') return null;
    const its = itemsOf(m), p = prog[m];
    return { got: its.reduce((a, it) => a + (p[it.key] || 0), 0), max: its.length * 3 };
  }
  function totalStars() { return ['ar', 'en', 'num', 'shp', 'dots'].reduce((a, m) => a + Object.values(prog[m]).reduce((x, y) => x + y, 0), 0) + (prog.hear || 0); }

  /* =====================================================================
     تحليل شكل الحرف/الرقم من الخط نفسه (مأخوذ من لعبة «حروفي»):
     قناع → هيكل → خطوط كتابة مرتّبة
     ===================================================================== */
  const cache = {};
  let fontReady = false, fontWaiting = null;
  function ensureFont() {
    if (fontReady) return Promise.resolve();
    if (fontWaiting) return fontWaiting;
    const p = (document.fonts && document.fonts.load)
      ? Promise.all([document.fonts.load(`800 100px ${FONT_NAME}`, 'بأA'), document.fonts.load(`800 100px ${FONT_NAME}`, 'a1')]).catch(() => {})
      : Promise.resolve();
    fontWaiting = Promise.race([p, new Promise(r => setTimeout(r, 2500))]).then(() => { fontReady = true; });
    return fontWaiting;
  }
  function chamfer(src, w, h, target) {
    // مسافة كل بكسل إلى أقرب بكسل قيمته = target
    const INF = 1e9, d = new Float32Array(w * h), D = 1.4142;
    for (let i = 0; i < w * h; i++) d[i] = src[i] === target ? 0 : INF;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x; let v = d[i]; if (!v) continue;
      if (x > 0) v = Math.min(v, d[i - 1] + 1);
      if (y > 0) { v = Math.min(v, d[i - w] + 1); if (x > 0) v = Math.min(v, d[i - w - 1] + D); if (x < w - 1) v = Math.min(v, d[i - w + 1] + D); }
      d[i] = v;
    }
    for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x; let v = d[i]; if (!v) continue;
      if (x < w - 1) v = Math.min(v, d[i + 1] + 1);
      if (y < h - 1) { v = Math.min(v, d[i + w] + 1); if (x < w - 1) v = Math.min(v, d[i + w + 1] + D); if (x > 0) v = Math.min(v, d[i + w - 1] + D); }
      d[i] = v;
    }
    return d;
  }
  function thin(m, w, h) {
    const img = m.slice(), del = []; let changed = true, guard = 0;
    while (changed && guard++ < 200) {
      changed = false;
      for (let pass = 0; pass < 2; pass++) {
        del.length = 0;
        for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
          const i = y * w + x; if (!img[i]) continue;
          const p2 = img[i - w], p3 = img[i - w + 1], p4 = img[i + 1], p5 = img[i + w + 1], p6 = img[i + w], p7 = img[i + w - 1], p8 = img[i - 1], p9 = img[i - w - 1];
          const B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9; if (B < 2 || B > 6) continue;
          const A = (!p2 && p3 ? 1 : 0) + (!p3 && p4 ? 1 : 0) + (!p4 && p5 ? 1 : 0) + (!p5 && p6 ? 1 : 0) + (!p6 && p7 ? 1 : 0) + (!p7 && p8 ? 1 : 0) + (!p8 && p9 ? 1 : 0) + (!p9 && p2 ? 1 : 0);
          if (A !== 1) continue;
          if (pass === 0) { if (p2 && p4 && p6) continue; if (p4 && p6 && p8) continue; }
          else { if (p2 && p4 && p8) continue; if (p2 && p6 && p8) continue; }
          del.push(i);
        }
        for (const i of del) img[i] = 0;
        if (del.length) changed = true;
      }
    }
    return img;
  }
  const N8 = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
  function buildStrokes(sk, w, h, sw, comp, comps, alpha) {
    const N = w * h, CN = new Int8Array(N);
    const on = (x, y) => x >= 0 && y >= 0 && x < w && y < h && sk[y * w + x];
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x; if (!sk[i]) continue;
      let t = 0; for (let n = 0; n < 8; n++) { const a = on(x + N8[n][0], y + N8[n][1]), b = on(x + N8[(n + 1) % 8][0], y + N8[(n + 1) % 8][1]); if (!a && b) t++; }
      let deg = 0; for (const [dx, dy] of N8) if (on(x + dx, y + dy)) deg++;
      CN[i] = deg === 0 ? 0 : t;
    }
    const isNode = i => sk[i] && CN[i] !== 2;
    // تجميع بكسلات العُقد المتجاورة
    const cl = new Int32Array(N).fill(-1), nodes = [];
    for (let i = 0; i < N; i++) {
      if (!isNode(i) || cl[i] >= 0) continue;
      const id = nodes.length, q = [i], px = []; cl[i] = id;
      while (q.length) { const j = q.pop(); px.push(j); const x = j % w, y = (j / w) | 0; if (CN[j] < 3) continue; for (const [dx, dy] of N8) { const n = j + dy * w + dx; if (isNode(n) && CN[n] >= 3 && cl[n] < 0) { cl[n] = id; q.push(n); } } }
      let sx = 0, sy = 0; px.forEach(j => { sx += j % w; sy += (j / w) | 0; });
      nodes.push({ id, x: sx / px.length, y: sy / px.length, end: px.length === 1 && CN[i] === 1, edges: [] });
    }
    const visited = new Uint8Array(N), edges = [], seen = new Set();
    const nbrs = j => { const x = j % w, y = (j / w) | 0, a = [], b = []; for (let n = 0; n < 8; n++) { const [dx, dy] = N8[n]; if (on(x + dx, y + dy)) (n % 2 ? b : a).push(j + dy * w + dx); } return a.concat(b); };
    const P = j => [j % w, (j / w) | 0];
    for (let i = 0; i < N; i++) {
      if (!isNode(i)) continue;
      for (const nb of nbrs(i)) {
        if (isNode(nb)) {
          if (cl[nb] !== cl[i]) { const kk = Math.min(cl[i], cl[nb]) + ':' + Math.max(cl[i], cl[nb]); if (!seen.has(kk)) { seen.add(kk); edges.push({ a: cl[i], b: cl[nb], pts: [P(i), P(nb)] }); } }
          continue;
        }
        if (visited[nb]) continue;
        const path = [P(i), P(nb)]; visited[nb] = 1; let prev = i, cur = nb, end = -1;
        for (let g = 0; g < 5000; g++) {
          const ns = nbrs(cur).filter(q => q !== prev);
          const nn = ns.find(q => isNode(q) && !(cl[q] === cl[i] && path.length < 4));
          if (nn !== undefined) { path.push(P(nn)); end = cl[nn]; break; }
          const nx = ns.find(q => !visited[q] && !isNode(q));
          if (nx === undefined) break;
          visited[nx] = 1; path.push(P(nx)); prev = cur; cur = nx;
        }
        edges.push({ a: cl[i], b: end, pts: path });
      }
    }
    // حلقات مغلقة بلا عُقد (مثل O)
    for (let i = 0; i < N; i++) {
      if (!sk[i] || visited[i] || isNode(i)) continue;
      const path = [P(i)]; visited[i] = 1; let cur = i;
      for (let g = 0; g < 5000; g++) { const nx = nbrs(cur).find(q => !visited[q] && !isNode(q)); if (nx === undefined) break; visited[nx] = 1; path.push(P(nx)); cur = nx; }
      if (path.length > 8) { path.push(path[0]); edges.push({ a: -1, b: -1, pts: path, loop: true }); }
    }
    // دمج التقاطعات المتلاصقة (مثل وسط X)
    const par = nodes.map((_, i) => i), fnd = i => par[i] === i ? i : (par[i] = fnd(par[i]));
    edges.forEach(e => { e.len = plen(e.pts); if (e.a >= 0 && e.b >= 0 && e.a !== e.b && !nodes[e.a].end && !nodes[e.b].end && e.len < sw * .6) { par[fnd(e.b)] = fnd(e.a); e.dead = true; } });
    edges.forEach(e => { if (e.a >= 0) e.a = fnd(e.a); if (e.b >= 0) e.b = fnd(e.b); });
    // إزالة الزوائد القصيرة
    edges.forEach((e, k) => { e.k = k; if (e.dead) return; if (e.a >= 0) nodes[e.a].edges.push(e); if (e.b >= 0 && e.b !== e.a) nodes[e.b].edges.push(e); });
    const alive = e => !e.dead;
    let pruned = true, rounds = 0;
    while (pruned && rounds++ < 3) {
      pruned = false;
      edges.forEach(e => {
        if (e.dead) return;
        const A = e.a >= 0 ? nodes[e.a] : null, B = e.b >= 0 ? nodes[e.b] : null;
        const degA = A ? A.edges.filter(alive).length : 0, degB = B ? B.edges.filter(alive).length : 0;
        const spur = (degA === 1 && degB >= 3) || (degB === 1 && degA >= 3);
        if ((spur && e.len < sw * .85) || e.len < 2.5) { e.dead = true; pruned = true; }
      });
    }
    let live = edges.filter(alive);
    // تنعيم
    live.forEach(e => { e.pts = smooth(e.pts, e.loop); e.len = plen(e.pts); });
    live = live.filter(e => e.len > sw * .3);
    // بناء الخطوط بالمشي عبر العُقد بأقل انعطاف
    const left = new Set(live);
    const score = (x, y) => alpha === 'ar' ? y - x * .55 : y * 1.0 + x * .45;
    const strokes = [];
    const degOf = n => n < 0 ? 0 : nodes[n].edges.filter(e => left.has(e)).length;
    while (left.size) {
      let best = null;
      left.forEach(e => {
        if (e.loop) return;
        [[e.a, false], [e.b, true]].forEach(([n, rev]) => {
          const d = degOf(n), p = rev ? e.pts[e.pts.length - 1] : e.pts[0];
          const s = score(p[0], p[1]) + (d === 1 || n < 0 ? 0 : 1000);
          if (!best || s < best.s) best = { e, rev, s, n };
        });
      });
      let pts;
      if (!best) {
        const e = [...left][0]; left.delete(e);
        pts = e.pts.slice(0, -1);
        let ti = 0; pts.forEach((p, i) => { if (p[1] < pts[ti][1]) ti = i; });
        pts = pts.slice(ti).concat(pts.slice(0, ti)); pts.push(pts[0]);
        if (pts[Math.min(5, pts.length - 1)][0] > pts[0][0]) pts.reverse();
        strokes.push({ pts, comp: comp[(Math.round(pts[0][1]) * w + Math.round(pts[0][0]))] });
        continue;
      }
      let e = best.e; left.delete(e); const fromJ = best.n >= 0 && nodes[best.n].edges.filter(alive).length > 1;
      pts = best.rev ? e.pts.slice().reverse() : e.pts.slice();
      let node = best.rev ? e.a : e.b;
      for (let g = 0; g < 20 && node >= 0; g++) {
        const cand = nodes[node].edges.filter(x => left.has(x));
        if (!cand.length) break;
        const L = pts.length, q = pts[Math.max(0, L - 10)], inA = Math.atan2(pts[L - 1][1] - q[1], pts[L - 1][0] - q[0]);
        let pick = null;
        cand.forEach(x => {
          const fw = x.a === node, o = fw ? x.pts : x.pts.slice().reverse();
          const r = o[Math.min(9, o.length - 1)], outA = Math.atan2(r[1] - o[0][1], r[0] - o[0][0]);
          let t = Math.abs(outA - inA); if (t > Math.PI) t = TAU - t;
          if (!pick || t < pick.t) pick = { x, o, t, nx: fw ? x.b : x.a };
        });
        if (pick.t > 1.35) break;
        left.delete(pick.x); pts = pts.concat(pick.o.slice(1)); node = pick.nx;
      }
      strokes.push({ pts, j: fromJ, comp: comp[(Math.round(pts[0][1]) * w + Math.round(pts[0][0]))] });
    }
    strokes.forEach(s => { s.len = plen(s.pts); });
    return strokes.filter(s => s.len > (s.j ? sw * 1.3 : sw * .5));
  }
  function plen(p) { let l = 0; for (let i = 1; i < p.length; i++) l += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return l; }
  function smooth(p, loop) {
    if (p.length < 5) return p.map(q => [q[0], q[1]]);
    let a = p.map(q => [q[0], q[1]]);
    for (let it = 0; it < 3; it++) {
      const b = a.map(q => [q[0], q[1]]);
      for (let i = 1; i < a.length - 1; i++) { b[i][0] = (a[i - 1][0] + a[i][0] * 2 + a[i + 1][0]) / 4; b[i][1] = (a[i - 1][1] + a[i][1] * 2 + a[i + 1][1]) / 4; }
      a = b;
    }
    // إعادة أخذ العيّنات بخطوة ثابتة
    const out = [a[0]], st = 2; let acc = 0;
    for (let i = 1; i < a.length; i++) { acc += Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]); if (acc >= st) { out.push(a[i]); acc = 0; } }
    if (out[out.length - 1] !== a[a.length - 1]) out.push(a[a.length - 1]);
    return out;
  }
  function orderStrokes(strokes, comps, alpha) {
    const compX = c => (comps[c] ? comps[c].x0 : 0);
    strokes.sort((A, B) => {
      if (A.dot !== B.dot) return A.dot ? 1 : -1;
      const a = A.dot ? [A.x, A.y] : A.pts[0], b = B.dot ? [B.x, B.y] : B.pts[0];
      if (alpha === 'en') {
        const ca = compX(A.comp), cb = compX(B.comp);
        if (Math.abs(ca - cb) > 20 && A.comp !== B.comp) return ca - cb;
        if (!A.dot && A.j !== B.j) return A.j ? 1 : -1;
        return (a[1] + a[0] * .3) - (b[1] + b[0] * .3);
      }
      return (a[1] - a[0] * .6) - (b[1] - b[0] * .6);
    });
  }

  let enM = null;
  function enMetrics(F) {
    if (enM) return enM;
    const c = mk(400, 400), x = c.getContext('2d', { willReadFrequently: true });
    x.font = `800 ${F}px ${FONT}`; x.textBaseline = 'alphabetic'; x.direction = 'ltr';
    const rows = t => { x.clearRect(0, 0, 400, 400); x.fillText(t, 40, 300); const d = x.getImageData(0, 0, 400, 400).data; let a = 1e9, b = -1; for (let y = 0; y < 400; y++) for (let xx = 0; xx < 400; xx++) if (d[(y * 400 + xx) * 4 + 3] > 100) { if (y < a) a = y; if (y > b) b = y; break; } return [300 - a, b - 300]; };
    const cap = rows('H')[0], xh = rows('x')[0], asc = Math.max(rows('b')[0], rows('l')[0], cap), desc = Math.max(rows('g')[1], rows('y')[1], rows('p')[1]);
    enM = { cap, xh, asc, desc };
    return enM;
  }
  function analyzeGlyph(text, alpha) {
    const key = alpha + ':' + text;
    if (cache[key]) return cache[key];
    const F = 200, BX = 160, BY = 300;
    const c1 = mk(640, 460), x1 = c1.getContext('2d', { willReadFrequently: true });
    x1.font = `800 ${F}px ${FONT}`; x1.direction = 'ltr'; x1.textAlign = 'left'; x1.textBaseline = 'alphabetic';
    x1.fillStyle = '#000'; x1.fillText(text, BX, BY);
    let d = x1.getImageData(0, 0, c1.width, c1.height).data;
    let bx0 = 1e9, by0 = 1e9, bx1 = -1, by1 = -1;
    for (let y = 0; y < c1.height; y++) for (let x = 0; x < c1.width; x++) if (d[(y * c1.width + x) * 4 + 3] > 100) { if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y; }
    if (bx1 < 0) { bx0 = 0; by0 = 0; bx1 = 100; by1 = 100; }
    let fy0 = by0, fy1 = by1, lines = null;
    if (alpha === 'en') { const m = enMetrics(F); fy0 = Math.min(by0, BY - m.asc); fy1 = Math.max(by1, BY + m.desc); }
    const bw = bx1 - bx0 + 1, bh = fy1 - fy0 + 1;
    const k = alpha === 'en' ? 190 / bh : 160 / Math.max(bw, bh), pad = 14;
    const gw = Math.ceil(bw * k + pad * 2), gh = Math.ceil(bh * k + pad * 2);
    const tx = pad - bx0 * k, ty = pad - fy0 * k;
    if (alpha === 'en') { const m = enMetrics(F); lines = { base: BY * k + ty, cap: (BY - m.cap) * k + ty, xh: (BY - m.xh) * k + ty }; }
    const c2 = mk(gw, gh), x2 = c2.getContext('2d', { willReadFrequently: true });
    x2.translate(tx, ty); x2.scale(k, k);
    x2.font = `800 ${F}px ${FONT}`; x2.direction = 'ltr'; x2.textAlign = 'left'; x2.textBaseline = 'alphabetic'; x2.fillStyle = '#000';
    x2.fillText(text, BX, BY);
    d = x2.getImageData(0, 0, gw, gh).data;
    const N = gw * gh, mask = new Uint8Array(N);
    for (let i = 0; i < N; i++) mask[i] = d[i * 4 + 3] > 110 ? 1 : 0;
    for (let x = 0; x < gw; x++) { mask[x] = 0; mask[N - 1 - x] = 0; }
    for (let y = 0; y < gh; y++) { mask[y * gw] = 0; mask[y * gw + gw - 1] = 0; }
    const inD = chamfer(mask, gw, gh, 0);
    const comp = new Int32Array(N).fill(-1), comps = [];
    for (let i = 0; i < N; i++) {
      if (!mask[i] || comp[i] >= 0) continue;
      const id = comps.length, q = [i]; comp[i] = id; let a = 0, sx = 0, sy = 0, x0 = 1e9, y0 = 1e9, xx1 = -1, yy1 = -1;
      while (q.length) {
        const j = q.pop(), x = j % gw, y = (j / gw) | 0; a++; sx += x; sy += y;
        if (x < x0) x0 = x; if (x > xx1) xx1 = x; if (y < y0) y0 = y; if (y > yy1) yy1 = y;
        for (const [dx, dy] of N8) { const n = j + dy * gw + dx; if (mask[n] && comp[n] < 0) { comp[n] = id; q.push(n); } }
      }
      comps.push({ id, a, cx: sx / a, cy: sy / a, w: xx1 - x0 + 1, h: yy1 - y0 + 1, x0 });
    }
    const refH = alpha === 'en' ? (by1 - by0 + 1) * k : Math.max(bw, bh) * k;
    comps.forEach(c => { c.dot = Math.max(c.w, c.h) < refH * .3 && c.a > 6 && c.w / c.h < 2.4 && c.h / c.w < 2.4; c.tiny = c.a <= 6; });
    let sk = thin(mask, gw, gh);
    for (let i = 0; i < N; i++) if (sk[i] && (comps[comp[i]].dot || comps[comp[i]].tiny)) sk[i] = 0;
    const depths = []; for (let i = 0; i < N; i++) if (sk[i]) depths.push(inD[i]);
    depths.sort((a, b) => a - b);
    const sw = Math.max(6, (depths.length ? depths[(depths.length / 2) | 0] : 8) * 2);
    const ord = alpha === 'ar' ? 'ar' : 'en';
    const st = buildStrokes(sk, gw, gh, sw, comp, comps, ord);
    comps.filter(c => c.dot).forEach(c => st.push({ dot: true, x: c.cx, y: c.cy, r: Math.max(c.w, c.h) / 2, comp: c.id, len: 0 }));
    orderStrokes(st, comps, ord);
    const r = { w: gw, h: gh, sw, strokes: st.map(s => s.dot ? { dot: true, x: s.x, y: s.y, r: s.r } : { pts: s.pts }), mask: c2, lines };
    cache[key] = r;
    return r;
  }
  /** شكل هندسي عام لأي عنصر: {w,h,sw,strokes,mask?,lines?} */
  function geomOf(it) {
    if (it.kind === 'glyph') return analyzeGlyph(it.text, it.alpha);
    if (it.kind === 'zero') return { w: 100, h: 100, sw: 16, strokes: [{ dot: true, x: 50, y: 50, r: 9 }], diamond: true };
    if (it.kind === 'shape') {
      const k = 'shp:' + it.shape.id + ':' + lang; if (cache[k]) return cache[k];
      return (cache[k] = { w: it.shape.w, h: it.shape.h, sw: 9, strokes: it.shape.mk(lang === 'ar').map(p => ({ pts: p })) });
    }
    return null;
  }

  /* =====================================================================
     رسم الجهاز (الإطار الأزرق، الشاشة، فتحة القلم…)
     ===================================================================== */
  function devGeom(x, y, w, h) {
    const s = Math.min(w, h), r = s * .075, rim = Math.max(3, s * .034), top = s * .115, bot = s * .165, m = s * .04;
    const bz = { x: x + rim, y: y + top, w: w - 2 * rim, h: h - top - rim, r: r * .62 };
    const Sx = { x: bz.x + m, y: bz.y + m * .85, w: bz.w - 2 * m, h: bz.h - m * .85 - bot, r: Math.max(4, s * .028) };
    const by = Sx.y + Sx.h, bh = bz.y + bz.h - by;
    const tr = { x: x + w / 2, y: by + bh * .5, r: Math.max(8, Math.min(bh * .3, 30)) };
    const bw = Math.min(Sx.w * .25, 118), bH = Math.min(bh * .34, 34);
    const badge = { x: Sx.x + Sx.w - bw - Sx.w * .02, y: by + bh * .5 - bH / 2, w: bw, h: bH };
    const slot = { cx: x + w / 2, cy: y + top * .5, w: w * .6, h: top * .44 };
    return { x, y, w, h, s, r, rim, top, bz, S: Sx, tr, badge, slot };
  }
  function drawDevice(c, G, o = {}) {
    const { x, y, w, h, r, s } = G;
    // ظل ناعم تحت الجهاز
    c.save(); c.shadowColor = 'rgba(70,20,40,.42)'; c.shadowBlur = s * .09; c.shadowOffsetY = s * .035;
    c.fillStyle = '#2A44C8'; rr(c, x, y, w, h, r); c.fill(); c.restore();
    // البلاستيك الأزرق
    let g = c.createLinearGradient(x, y, x + w * .4, y + h);
    g.addColorStop(0, '#5C7BFF'); g.addColorStop(.35, '#3557E8'); g.addColorStop(1, '#2238B4');
    c.fillStyle = g; rr(c, x, y, w, h, r); c.fill();
    c.save(); rr(c, x, y, w, h, r); c.clip();
    g = c.createRadialGradient(x + w * .2, y + h * .05, 0, x + w * .2, y + h * .05, s * .9);
    g.addColorStop(0, 'rgba(255,255,255,.28)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(x, y, w, h);
    c.lineWidth = Math.max(1.5, s * .008); c.strokeStyle = 'rgba(255,255,255,.45)'; rr(c, x + c.lineWidth, y + c.lineWidth, w - c.lineWidth * 2, h - c.lineWidth * 2, r * .92); c.stroke();
    c.lineWidth = Math.max(2, s * .012); c.strokeStyle = 'rgba(10,20,90,.45)'; rr(c, x, y, w, h, r); c.stroke();
    c.restore();
    // ثقوب التعليق وبراغي صغيرة
    const T = G.top;
    [x + w * .075, x + w * .925].forEach(hx => {
      const hy = y + T * .48, rx = Math.max(2, T * .1), ry = Math.max(3, T * .16);
      c.fillStyle = 'rgba(25,20,60,.7)'; c.beginPath(); c.ellipse(hx, hy, rx, ry, 0, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = Math.max(1, s * .004); c.beginPath(); c.ellipse(hx, hy + 1, rx, ry, 0, .2, Math.PI - .2); c.stroke();
    });
    if (!o.mini) [x + w * .16, x + w * .84].forEach(sx => {
      const sy = y + T * .5, sr = Math.max(2, T * .075);
      const sg = c.createRadialGradient(sx - sr * .3, sy - sr * .3, 0, sx, sy, sr); sg.addColorStop(0, '#DDE3F5'); sg.addColorStop(1, '#7F8BB5');
      c.fillStyle = sg; c.beginPath(); c.arc(sx, sy, sr, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(40,50,90,.7)'; c.lineWidth = Math.max(1, sr * .25); c.beginPath(); c.moveTo(sx - sr * .6, sy + sr * .2); c.lineTo(sx + sr * .6, sy - sr * .2); c.stroke();
    });
    // فتحة القلم والقلم داخلها
    const sl = G.slot, sx0 = sl.cx - sl.w / 2, sy0 = sl.cy - sl.h / 2;
    g = c.createLinearGradient(0, sy0, 0, sy0 + sl.h); g.addColorStop(0, '#16248A'); g.addColorStop(1, '#2D47CF');
    c.fillStyle = g; rr(c, sx0, sy0, sl.w, sl.h, sl.h / 2); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.3)'; c.lineWidth = Math.max(1, s * .004); c.beginPath(); c.moveTo(sx0 + sl.h / 2, sy0 + sl.h + 1); c.lineTo(sx0 + sl.w - sl.h / 2, sy0 + sl.h + 1); c.stroke();
    if (!o.noPen) drawPen(c, sx0 + sl.h * .45, sl.cy, sl.w - sl.h * .9, sl.h * .62);
    // نافذة الإصبع في منتصف الفتحة
    c.fillStyle = 'rgba(70,100,255,.55)'; rr(c, sl.cx - sl.w * .14, sy0 + sl.h * .52, sl.w * .28, sl.h * .62, sl.h * .25); c.fill();
    // الإطار الأسود
    const bz = G.bz;
    g = c.createLinearGradient(0, bz.y, 0, bz.y + bz.h); g.addColorStop(0, '#1B1D22'); g.addColorStop(1, '#0C0D10');
    c.fillStyle = g; rr(c, bz.x, bz.y, bz.w, bz.h, bz.r); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.09)'; c.lineWidth = 1.2; rr(c, bz.x + .6, bz.y + .6, bz.w - 1.2, bz.h - 1.2, bz.r); c.stroke();
    // الشاشة
    const Sx = G.S;
    c.save(); c.shadowColor = 'rgba(255,255,255,.08)'; c.shadowBlur = 2; c.shadowOffsetY = 1;
    g = c.createRadialGradient(Sx.x + Sx.w * .5, Sx.y + Sx.h * .45, 0, Sx.x + Sx.w * .5, Sx.y + Sx.h * .5, Math.max(Sx.w, Sx.h) * .75);
    g.addColorStop(0, '#141920'); g.addColorStop(1, '#07090C');
    c.fillStyle = g; rr(c, Sx.x, Sx.y, Sx.w, Sx.h, Sx.r); c.fill(); c.restore();
    c.strokeStyle = 'rgba(0,0,0,.8)'; c.lineWidth = 2; rr(c, Sx.x - 1, Sx.y - 1, Sx.w + 2, Sx.h + 2, Sx.r + 1); c.stroke();
    // زر المسح (في المصغّرات فقط؛ في اللعبة هو زر حقيقي)
    if (o.mini) {
      const t = G.tr; c.strokeStyle = '#E8ECF5'; c.lineWidth = Math.max(1, t.r * .14); c.beginPath(); c.arc(t.x, t.y, t.r * .8, 0, TAU); c.stroke();
      c.fillStyle = '#E8ECF5'; c.fillRect(t.x - t.r * .28, t.y - t.r * .3, t.r * .56, t.r * .62);
    }
    // شارة LCD
    const b = G.badge;
    if (b.w > 20) {
      g = c.createLinearGradient(0, b.y, 0, b.y + b.h); g.addColorStop(0, '#F4F7FF'); g.addColorStop(1, '#C9D6FA');
      c.fillStyle = '#3557E8'; rr(c, b.x - 2, b.y - 2, b.w + 4, b.h + 4, b.h * .3); c.fill();
      c.fillStyle = g; rr(c, b.x, b.y, b.w, b.h, b.h * .25); c.fill();
      c.fillStyle = '#1E36B0'; c.textBaseline = 'middle'; c.direction = 'ltr'; c.textAlign = 'left';
      const fs = b.h * .62; c.font = `900 ${fs}px Arial,${FONT}`;
      const tw = c.measureText('LCD').width; c.font = `700 ${fs * .7}px Arial,${FONT}`; const tw2 = c.measureText(' pad').width;
      let tx = b.x + (b.w - tw - tw2) / 2; c.font = `900 ${fs}px Arial,${FONT}`; c.fillText('LCD', tx, b.y + b.h * .54);
      c.fillStyle = '#4C6BE8'; c.font = `700 ${fs * .7}px Arial,${FONT}`; c.fillText(' pad', tx + tw, b.y + b.h * .58);
    }
  }
  function drawPen(c, x, cy, len, th) {
    c.save();
    // جسم القلم
    let g = c.createLinearGradient(0, cy - th / 2, 0, cy + th / 2); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.5, '#DCE4FF'); g.addColorStop(1, '#9AAAE0');
    const tip = th * 1.4;
    c.fillStyle = g; rr(c, x + tip, cy - th / 2, len - tip, th, th / 2); c.fill();
    // الرأس المخروطي
    c.fillStyle = '#C7CCDA'; c.beginPath(); c.moveTo(x + tip + 1, cy - th / 2); c.lineTo(x + th * .15, cy - th * .08); c.lineTo(x + th * .15, cy + th * .08); c.lineTo(x + tip + 1, cy + th / 2); c.closePath(); c.fill();
    c.fillStyle = '#5A6070'; c.beginPath(); c.arc(x + th * .18, cy, th * .12, 0, TAU); c.fill();
    // الغطاء والمشبك
    g = c.createLinearGradient(0, cy - th / 2, 0, cy + th / 2); g.addColorStop(0, '#7FA0FF'); g.addColorStop(1, '#2B45C8');
    c.fillStyle = g; rr(c, x + len - len * .2, cy - th / 2, len * .2, th, th / 2); c.fill();
    c.fillStyle = 'rgba(255,255,255,.75)'; rr(c, x + tip + th * .4, cy - th * .32, len * .5, th * .16, th * .08); c.fill();
    c.restore();
  }
  /** تدرّج قوس قزح حسب الموضع، مثل لوح LCD الحقيقي */
  function rainbow(c, x0, y0, x1, y1, a = 1) {
    const g = c.createLinearGradient(x0, y0, x1, y1);
    const st = [[0, '#6CF7A0'], [.18, '#B5F55C'], [.34, '#FFE55A'], [.48, '#FFB067'], [.6, '#FF8FB8'], [.72, '#6FE0FF'], [.86, '#5E8DFF'], [1, '#A47CFF']];
    st.forEach(([p, col]) => g.addColorStop(p, col));
    return g;
  }

  /* ---------- خلفية المشهد (سجّادة ناعمة بزخارف ملتفّة مثل الصورة) ---------- */
  let curls = null;
  function drawScene() {
    const c = bgc.getContext('2d');
    bgc.width = Math.round(W * DPR); bgc.height = Math.round(H * DPR); c.setTransform(DPR, 0, 0, DPR, 0, 0);
    let g = c.createLinearGradient(0, 0, W * .3, H);
    g.addColorStop(0, '#F7CFC4'); g.addColorStop(.55, '#EFB7AE'); g.addColorStop(1, '#E3A39C');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    if (!curls) { let sd = 7; const r = () => (sd = (sd * 9301 + 49297) % 233280) / 233280; curls = []; for (let i = 0; i < 60; i++) curls.push([r(), r(), .6 + r() * .8, r() * TAU, r() < .5 ? 1 : -1]); }
    c.save(); c.lineCap = 'round';
    const cell = Math.max(W, H);
    curls.forEach(([u, v, k, a0, dir]) => {
      const cx = u * W, cy = v * H, R = cell * .07 * k;
      c.strokeStyle = 'rgba(255,240,215,.42)'; c.lineWidth = R * .16;
      c.beginPath();
      for (let i = 0; i <= 40; i++) { const t = i / 40, a = a0 + dir * t * TAU * 1.15, rad = R * (1 - t * .78); const px = cx + Math.cos(a) * rad, py = cy + Math.sin(a) * rad; i ? c.lineTo(px, py) : c.moveTo(px, py); }
      c.stroke();
      c.fillStyle = 'rgba(255,240,215,.35)'; c.beginPath(); c.ellipse(cx + Math.cos(a0) * R * 1.25, cy + Math.sin(a0) * R * 1.25, R * .28, R * .12, a0 + 1.2, 0, TAU); c.fill();
    });
    c.restore();
    g = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .3, W / 2, H / 2, Math.max(W, H) * .8);
    g.addColorStop(0, 'rgba(120,40,40,0)'); g.addColorStop(1, 'rgba(120,40,40,.22)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    if (D) drawDevice(c, D);
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #magicpad{overflow:hidden;background:#EFB7AE;color:#1E2A6B}
  #magicpad canvas{display:block}
  #magicpad .bgc{position:absolute;inset:0;width:100%;height:100%}
  #magicpad .scr{position:absolute;overflow:hidden;touch-action:none;cursor:crosshair}
  #magicpad .scr canvas{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
  #magicpad .scr canvas.cf{pointer-events:auto;touch-action:none}
  #magicpad .scr .cw{filter:blur(6px);opacity:.75;mix-blend-mode:screen}
  #magicpad .scr .gloss{position:absolute;inset:0;pointer-events:none;border-radius:inherit;
    background:linear-gradient(116deg,rgba(255,255,255,.085) 0%,rgba(255,255,255,.035) 30%,rgba(255,255,255,0) 30.4%,rgba(255,255,255,0) 72%,rgba(255,255,255,.03) 72.4%,rgba(255,255,255,0) 86%);
    box-shadow:inset 0 2px 10px rgba(0,0,0,.75),inset 0 0 0 1px rgba(255,255,255,.04)}
  #magicpad .trash{position:absolute;border-radius:50%;background:radial-gradient(circle at 50% 35%,#24272E,#0B0C0F 70%);border:2.5px solid #E9EDF6;
    display:grid;place-items:center;box-shadow:0 0 0 3px #08090B,0 3px 6px rgba(0,0,0,.6),inset 0 2px 3px rgba(255,255,255,.12);transition:transform .14s var(--press);z-index:4;padding:0}
  #magicpad .trash svg{width:56%;height:56%}
  #magicpad .trash:active{transform:scale(.88)}
  #magicpad .trash.glow{animation:mpTrash 1.2s ease-in-out infinite}
  @keyframes mpTrash{50%{box-shadow:0 0 0 3px #08090B,0 0 18px 4px rgba(120,255,190,.7)}}
  #magicpad .bar{z-index:8}
  #magicpad .ib{color:#2445C8}
  #magicpad .ttl{min-width:80px;max-width:42vw;color:#1E2A6B}
  #magicpad .ttl b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:18px}
  #magicpad .lang{display:flex;background:rgba(255,255,255,.95);border-radius:99px;padding:3px;gap:2px;box-shadow:0 4px 0 rgba(60,30,90,.16),0 7px 12px rgba(60,30,90,.14);border:2px solid #fff}
  #magicpad .lang button{height:36px;border-radius:99px;font-weight:900;font-size:14px;color:#6D7DB8;background:transparent;padding:0 10px;line-height:1}
  #magicpad .lang button[data-l=en]{font-family:Arial,var(--font);direction:ltr}
  #magicpad .lang button.on{background:linear-gradient(#6C8BF2,#3A55C4);color:#fff;box-shadow:0 3px 0 #263C91,inset 0 2px 0 rgba(255,255,255,.35)}
  #magicpad .segp{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:4px;z-index:7;width:min(70vw,360px);height:12px;padding:2px;border-radius:99px;background:rgba(255,255,255,.75);box-shadow:0 2px 0 rgba(120,40,60,.15)}
  #magicpad .segp i{flex:1;border-radius:99px;background:rgba(30,42,107,.12);transition:background .3s}
  #magicpad .segp i.on{background:linear-gradient(90deg,#6CF7A0,#FFE55A,#6FE0FF)}
  #magicpad .segp i.cur{background:rgba(255,200,60,.55)}
  #magicpad .tools{position:absolute;left:0;right:0;bottom:0;z-index:6;display:flex;justify-content:center;align-items:center;gap:9px;padding:6px 10px max(10px,env(safe-area-inset-bottom))}
  #magicpad .tb2{position:relative;width:52px;height:52px;flex:0 0 52px;border-radius:50%;font-size:23px;display:grid;place-items:center;color:#2445C8;font-weight:900;
    background:linear-gradient(180deg,#fff 0%,#fff 55%,#E7ECFB 100%);border:3px solid #fff;box-shadow:0 5px 0 #8EA2E8,0 8px 14px rgba(40,30,90,.25);transition:transform .14s var(--press),box-shadow .14s}
  #magicpad .tb2:active{transform:translateY(4px) scale(1.06,.9);box-shadow:0 1px 0 #8EA2E8}
  #magicpad .tb2[disabled]{opacity:.45;filter:grayscale(.6)}
  #magicpad .tb2.blue{background:linear-gradient(180deg,#8FA8FF,#4E6CF0 60%,#3550D6);color:#fff;border-color:#DCE4FF;box-shadow:0 5px 0 #2236A6,0 8px 14px rgba(34,54,166,.35)}
  #magicpad .tb2.yellow{background:linear-gradient(180deg,#FFE680,#FFC531 60%,#F2A90F);border-color:#FFF4C4;color:#7A3E00;box-shadow:0 5px 0 #D98A00,0 8px 14px rgba(217,138,0,.3)}
  #magicpad .tb2.green{background:linear-gradient(180deg,#8CF0A8,#2FC468 60%,#1FA352);border-color:#DFFFE8;color:#fff;box-shadow:0 5px 0 #157A3A,0 8px 14px rgba(21,122,58,.3);width:64px;flex-basis:64px;border-radius:26px}
  #magicpad .tb2.pink{background:linear-gradient(180deg,#FFA3C8,#FF5FA0 60%,#E83E86);border-color:#FFE0EE;color:#fff;box-shadow:0 5px 0 #B32366,0 8px 14px rgba(179,35,102,.3)}
  #magicpad .tb2 .cnt{position:absolute;bottom:-5px;left:-5px;min-width:21px;height:21px;border-radius:11px;background:#FF4FA3;color:#fff;font-size:12px;font-weight:900;display:grid;place-items:center;padding:0 4px;box-shadow:0 0 0 2px #fff}
  #magicpad .tb2 .cnt:empty{display:none}
  #magicpad .tb2.pulse{animation:mpPulse .9s ease-in-out infinite alternate}
  @keyframes mpPulse{to{transform:scale(1.1);box-shadow:0 5px 0 #157A3A,0 0 22px rgba(80,255,140,.8)}}
  #magicpad .msg{position:absolute;left:0;right:0;z-index:7;text-align:center;pointer-events:none;opacity:0;transition:opacity .35s}
  #magicpad .msg.on{opacity:1}
  #magicpad .msg span{display:inline-block;background:rgba(255,255,255,.95);color:#2445C8;font-weight:900;font-size:16px;padding:5px 16px;border-radius:99px;box-shadow:0 3px 0 rgba(36,69,200,.25),0 6px 14px rgba(0,0,0,.18);max-width:92vw}
  #magicpad .res{position:absolute;left:50%;z-index:9;transform:translateX(-50%);width:min(92vw,360px);display:none;align-items:center;gap:10px;padding:10px 12px;border-radius:26px;background:#fff;border:4px solid #C9D6FF;box-shadow:0 6px 0 #4E6CF0,0 14px 26px rgba(0,0,0,.3)}
  #magicpad .res.on{display:flex}
  #magicpad .res .rt{flex:1;text-align:center;line-height:1.2}
  #magicpad .res .rt b{display:block;font-size:20px;color:#2445C8}
  #magicpad .res .rt .st{font-size:26px;letter-spacing:2px}
  #magicpad .res .rt .st .off{filter:grayscale(1);opacity:.3}
  #magicpad .res .btn{margin:0;padding:9px 16px;font-size:17px}
  /* اختيار المستوى */
  #magicpad .lv{position:absolute;inset:0;z-index:6;overflow-y:auto;overflow-x:hidden;touch-action:pan-y;display:none;
    background:radial-gradient(120% 60% at 50% 0%,#FFE9E1 0,#F7CFC4 45%,#EFB7AE 100%);padding:calc(max(10px,env(safe-area-inset-top)) + 58px) 14px max(20px,env(safe-area-inset-bottom))}
  #magicpad.inlv .lv{display:block}
  #magicpad.inlv .tools,#magicpad.inlv .ttl,#magicpad.inlv .segp,#magicpad.inlv .msg{display:none}
  #magicpad .lvw{max-width:980px;margin:0 auto;display:flex;flex-direction:column;align-items:center}
  #magicpad .lvh{display:flex;align-items:center;gap:12px;margin:0 0 12px}
  #magicpad .lvh canvas{width:74px;height:96px;filter:drop-shadow(0 6px 8px rgba(80,20,40,.3));transform:rotate(-8deg)}
  #magicpad .lvh h1{margin:0;font-size:clamp(30px,8.5vw,44px);font-weight:900;color:#2445C8;line-height:1.1;
    text-shadow:0 2px 0 #fff,2px 0 0 #fff,-2px 0 0 #fff,0 -2px 0 #fff,2px 2px 0 #fff,-2px 2px 0 #fff,2px -2px 0 #fff,-2px -2px 0 #fff,0 7px 0 rgba(36,69,200,.25)}
  #magicpad .lvh p{margin:2px 0 0;font-weight:800;opacity:.75;font-size:15px}
  #magicpad .cards{width:100%;display:grid;grid-template-columns:repeat(2,1fr);gap:16px 12px}
  @media (min-width:720px){#magicpad .cards{grid-template-columns:repeat(4,1fr);gap:20px 16px}}
  #magicpad .card{--a:#4263EB;position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 8px 10px;border-radius:28px;background:linear-gradient(180deg,#fff 0,#fff 65%,#F3F6FF 100%);
    border:4px solid var(--a);box-shadow:0 7px 0 color-mix(in srgb,var(--a) 70%,#000),0 14px 20px rgba(40,20,80,.18);color:#1E2A6B;transition:transform .16s var(--press),box-shadow .16s;will-change:transform}
  #magicpad .card:active{transform:translateY(6px) scale(1.03,.95);box-shadow:0 1px 0 color-mix(in srgb,var(--a) 70%,#000)}
  #magicpad .card canvas{width:100%;max-width:170px;aspect-ratio:1.25;height:auto}
  #magicpad .card h2{margin:4px 0 0;font-size:18px;font-weight:900;line-height:1.2;color:color-mix(in srgb,var(--a) 80%,#000)}
  #magicpad .card p{margin:0;font-size:12.5px;opacity:.7;font-weight:700}
  #magicpad .card .sb{margin-top:4px;font-size:13px;font-weight:900;color:#7A4A00;background:#FFF1C2;border-radius:99px;padding:0 10px;line-height:24px}
  #magicpad .card .num{position:absolute;top:-10px;right:-6px;width:32px;height:32px;border-radius:50%;background:var(--a);color:#fff;font-weight:900;display:grid;place-items:center;border:3px solid #fff;box-shadow:0 3px 0 rgba(0,0,0,.2);font-size:16px}
  /* النوافذ */
  #magicpad .overlay{background:radial-gradient(circle at 50% 45%,rgba(20,30,90,.25),rgba(10,15,50,.55))}
  #magicpad .panel{border-color:#C9D6FF;box-shadow:0 10px 0 #4E6CF0,0 24px 44px rgba(10,15,60,.35),inset 0 0 0 3px #fff;background:linear-gradient(180deg,#fff 0%,#fff 70%,#F1F4FF 100%);color:#1E2A6B}
  #magicpad .panel h3{color:#2445C8;text-shadow:0 3px 0 #DCE4FF}
  #magicpad .btn{background:linear-gradient(180deg,#8FA8FF 0%,#4E6CF0 55%,#3550D6 100%);box-shadow:0 5px 0 #2236A6,0 9px 14px rgba(34,54,166,.3);text-shadow:0 2px 0 rgba(10,20,90,.25)}
  #magicpad .btn:active{box-shadow:0 1px 0 #2236A6}
  #magicpad .btn.alt{background:linear-gradient(180deg,#fff,#F1F4FF);color:#2445C8;box-shadow:0 5px 0 #C9D6FF,0 8px 12px rgba(34,54,166,.16);border-color:#DCE4FF;text-shadow:none}
  #magicpad .lcdbox{margin:6px auto 4px;width:150px;height:120px;border-radius:20px;background:#0B0E12;border:7px solid #3557E8;box-shadow:inset 0 2px 10px #000,0 5px 0 #2238B4;display:grid;place-items:center;overflow:hidden}
  #magicpad .lcdbox canvas{width:100%;height:100%}
  #magicpad .wide{width:min(94vw,520px);max-height:88vh;overflow-y:auto;touch-action:pan-y;padding:18px 12px 14px}
  #magicpad .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(58px,1fr));gap:8px;margin:6px 0 12px}
  #magicpad .it{position:relative;aspect-ratio:1;border-radius:16px;background:#10141A;border:3px solid #3557E8;color:#BFF5C8;font-weight:900;font-size:26px;display:grid;place-items:center;padding:0;line-height:1;box-shadow:0 4px 0 #2238B4}
  #magicpad .it.sm{font-size:13px}
  #magicpad .it.cur{outline:3px solid #FFC531;outline-offset:2px}
  #magicpad .it i{position:absolute;bottom:-9px;left:0;right:0;font-style:normal;font-size:11px;letter-spacing:-1px;filter:drop-shadow(0 1px 1px rgba(0,0,0,.4))}
  #magicpad .it:active{transform:scale(.93)}
  #magicpad .gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;margin:6px 0 12px}
  #magicpad .th{padding:6px;border-radius:18px;background:linear-gradient(#5C7BFF,#2238B4);box-shadow:0 5px 0 #18288A;border:0}
  #magicpad .th img{display:block;width:100%;border-radius:10px;background:#0B0E12}
  #magicpad .th:active{transform:scale(.95)}
  #magicpad .empty{opacity:.7;font-weight:800;margin:20px 0}
  #magicpad .bigimg{display:block;width:100%;border-radius:16px;border:8px solid #3557E8;box-shadow:0 6px 0 #2238B4;background:#0B0E12;margin:4px 0 12px}
  `);

  const TRASH_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#EEF1F8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"/><path d="M9 6V4h6v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 10v7M14 10v7"/></svg>`;
  root = App.section(ID, `
    <canvas class="bgc"></canvas>
    <div class="scr"><canvas class="cg"></canvas><canvas class="cw"></canvas><canvas class="ci"></canvas><canvas class="cf"></canvas><div class="gloss"></div></div>
    <button class="trash" aria-label="مسح اللوح">${TRASH_SVG}</button>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <div class="chip ttl"><small></small><b></b></div>
      <span class="grow"></span>
      <div class="lang" role="group" aria-label="اللغة"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="segp"></div>
    <div class="msg"><span></span></div>
    <div class="tools"></div>
    <div class="res"></div>
    <div class="lv"><div class="lvw">
      <div class="lvh"><canvas width="148" height="192"></canvas><div><h1>اللوح السحري</h1><p class="lvs"></p></div></div>
      <div class="cards"></div>
    </div></div>
    <div class="overlay ov-win"><div class="panel"></div></div>
    <div class="overlay ov-pick"><div class="panel wide"></div></div>
    <div class="overlay ov-gal"><div class="panel wide"></div></div>
  `);
  bgc = root.querySelector('.bgc'); scr = root.querySelector('.scr');
  cg = root.querySelector('.cg'); cw = root.querySelector('.cw'); ci = root.querySelector('.ci'); cf = root.querySelector('.cf');
  trashBtn = root.querySelector('.trash'); toolsEl = root.querySelector('.tools'); barEl = root.querySelector('.bar'); lvEl = root.querySelector('.lv'); resEl = root.querySelector('.res');
  const ovWin = root.querySelector('.ov-win'), ovPick = root.querySelector('.ov-pick'), ovGal = root.querySelector('.ov-gal');
  const msgEl = root.querySelector('.msg'), segEl = root.querySelector('.segp'), ttlEl = root.querySelector('.ttl');

  let msgTimer = 0;
  function msg(text, ms = 2600) {
    msgEl.querySelector('span').textContent = text; msgEl.classList.add('on');
    clearTimeout(msgTimer); msgTimer = setTimeout(() => msgEl.classList.remove('on'), ms);
  }
  function setTitle(small, big) { ttlEl.querySelector('small').textContent = small; ttlEl.querySelector('b').textContent = big; }
  function setSeg(n, done, curI = -1) {
    if (!n) { segEl.style.display = 'none'; return; }
    segEl.style.display = '';
    if (segEl.children.length !== n) segEl.innerHTML = '<i></i>'.repeat(n);
    [...segEl.children].forEach((e, i) => { e.className = i < done ? 'on' : i === curI ? 'cur' : ''; });
  }

  /* ---------- أدوات أسفل الشاشة ---------- */
  const TOOLSET = {
    free: [['lv', '🗂️', '', 'المستويات'], ['undo', '↩️', '', 'تراجع'], ['save', '💾', 'pink', 'حفظ في المعرض'], ['gal', '🖼️', 'blue', 'المعرض']],
    trace: [['lv', '🗂️', '', 'المستويات'], ['undo', '↩️', '', 'تراجع'], ['prev', '▶', 'blue', 'السابق'], ['say', '🔊', 'yellow', 'استمع'], ['next', '◀', 'blue', 'التالي'], ['grid', '🔢', '', 'كل العناصر']],
    hear: [['lv', '🗂️', '', 'المستويات'], ['undo', '↩️', '', 'تراجع'], ['say', '🔊', 'yellow', 'استمع'], ['check', '✔️', 'green', 'انتهيت']]
  };
  function buildTools() {
    const set = mode === 'free' ? TOOLSET.free : mode === 'hear' ? TOOLSET.hear : TOOLSET.trace;
    // في الواجهة العربية (من اليمين لليسار): «التالي» يشير إلى اليسار
    toolsEl.innerHTML = set.map(([a, ic, cls, lab]) => `<button class="tb2 ${cls}" data-a="${a}" aria-label="${lab}">${ic}${a === 'gal' ? '<span class="cnt"></span>' : ''}</button>`).join('');
    toolsEl.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { if (busy && b.dataset.a !== 'lv') return; Sound.tap(); act(b.dataset.a); });
    paintGalCount();
    uiFrom(toolsEl.children, { y: 30, scale: .6, autoAlpha: 0, duration: .45, stagger: .05, ease: 'back.out(2)' });
  }
  function paintGalCount() { const c = toolsEl.querySelector('.cnt'); if (c) c.textContent = store.get('magicpadGallery', []).length || ''; }
  function act(a) {
    if (a === 'lv') { showLevels(); return; }
    if (a === 'undo') { undo(); return; }
    if (a === 'save') { saveDrawing(); return; }
    if (a === 'gal') { openGallery(); return; }
    if (a === 'say') { sayCurrent(); return; }
    if (a === 'next') { gotoItem(idx + 1); return; }
    if (a === 'prev') { gotoItem(idx - 1); return; }
    if (a === 'grid') { openPicker(); return; }
    if (a === 'check') { hearCheck(); return; }
  }
  function sayCurrent() {
    if (mode === 'hear') { hearPrompt(); return; }
    if (mode === 'dots') { if (DT && DT.done) sayItem(DT.it); else say(App.g('صِلي النقاط', 'صِل النقاط'), 'Connect the dots'); return; }
    if (T) sayItem(T.it);
  }

  /* =====================================================================
     التخطيط وأحجام الكانفاس
     ===================================================================== */
  function layout() {
    W = root.clientWidth; H = root.clientHeight; if (!W || !H) return;
    DPR = Math.min(window.devicePixelRatio || 1, 3);
    const topH = barEl.offsetHeight + 18, botH = toolsEl.offsetHeight || 70;
    segEl.style.top = (barEl.offsetHeight + 2) + 'px';
    const aT = topH + 4, aH = Math.max(200, H - botH - aT - 8), aW = W - 16;
    let dw, dh;
    if (aW / aH < 1.05) { dw = Math.min(aW, aH * .8, 620); dh = Math.min(aH, dw / .6); }
    else { dh = Math.min(aH, 680); dw = Math.min(aW, dh * 1.5, 1100); }
    D = devGeom(Math.round((W - dw) / 2), Math.round(aT + (aH - dh) / 2), Math.round(dw), Math.round(dh));
    const old = { w: S.w, h: S.h };
    S = D.S;
    Object.assign(scr.style, { left: S.x + 'px', top: S.y + 'px', width: S.w + 'px', height: S.h + 'px', borderRadius: S.r + 'px' });
    const t = D.tr; Object.assign(trashBtn.style, { left: (t.x - t.r) + 'px', top: (t.y - t.r) + 'px', width: t.r * 2 + 'px', height: t.r * 2 + 'px' });
    resEl.style.bottom = (botH + 8) + 'px';
    msgEl.style.top = (S.y + 10) + 'px';
    drawScene();
    [cg, ci, cf].forEach(c => { c.width = Math.round(S.w * DPR); c.height = Math.round(S.h * DPR); c.getContext('2d').setTransform(DPR, 0, 0, DPR, 0, 0); });
    cw.width = Math.round(S.w); cw.height = Math.round(S.h);
    xg = cg.getContext('2d'); xi = ci.getContext('2d'); xf = cf.getContext('2d'); xw = cw.getContext('2d');
    gradInk = rainbow(xi, 0, 0, S.w * .45, S.h);
    gradGlow = rainbow(xw, 0, 0, S.w * .45, S.h);
    scrRect = scr.getBoundingClientRect();
    return old;
  }
  function onResize() {
    if (App.current !== ID || view !== 'pad') return;
    const old = layout(); if (!old) return;
    if (mode === 'free' || mode === 'hear') {
      const k = Math.min(S.w / old.w, S.h / old.h);
      if (isFinite(k) && k > 0) strokes.forEach(s => s.pts.forEach(p => { p.x *= k; p.y *= k; p.w *= k; }));
      if (mode === 'hear' && HR && HR.checked) { HR.checked = false; resEl.classList.remove('on'); }
      redrawInk();
    } else if (mode === 'dots') { startDots(true); }
    else if (T) startItem(idx, true);
  }

  /* =====================================================================
     الحبر: خطوط ناعمة متغيّرة السُّمك بألوان قوس قزح وتوهّج
     ===================================================================== */
  function segPath(c, p, i, last) {
    c.beginPath();
    if (i === 0) { c.arc(p[0].x, p[0].y, p[0].w / 2, 0, TAU); return 'dot'; }
    if (i === 1) { c.moveTo(p[0].x, p[0].y); c.lineTo((p[0].x + p[1].x) / 2, (p[0].y + p[1].y) / 2); }
    else {
      const a = p[i - 2], b = p[i - 1], cc = p[i];
      c.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2); c.quadraticCurveTo(b.x, b.y, (b.x + cc.x) / 2, (b.y + cc.y) / 2);
    }
    if (last) c.lineTo(p[i].x, p[i].y);
    return 'line';
  }
  function drawSeg(p, i, last) {
    const w = i === 0 ? p[0].w : p[Math.max(0, i - 1)].w;
    for (const [c, grad, mul] of [[xw, gradGlow, 2.3], [xi, gradInk, 1]]) {
      const t = segPath(c, p, i, last);
      if (t === 'dot') { c.fillStyle = grad; c.beginPath(); c.arc(p[0].x, p[0].y, p[0].w * mul / 2, 0, TAU); c.fill(); }
      else { c.strokeStyle = grad; c.lineWidth = w * mul; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke(); }
    }
  }
  function renderStroke(s) {
    const p = s.pts; if (!p.length) return;
    drawSeg(p, 0, p.length === 1);
    for (let i = 1; i < p.length; i++) drawSeg(p, i, i === p.length - 1 && s.done);
  }
  function clearInk() { xi.clearRect(0, 0, S.w, S.h); xw.clearRect(0, 0, S.w, S.h); }
  function redrawInk() {
    clearInk();
    if (mode === 'dots') { drawDotLines(); return; }
    strokes.forEach(renderStroke);
  }

  /* ---------- الإدخال ---------- */
  function local(e) { return { x: e.clientX - scrRect.left, y: e.clientY - scrRect.top }; }
  function baseWidth() {
    if (T) return T.inkW;
    return clamp(Math.min(S.w, S.h) * .014, 3.5, 8);
  }
  function addPoint(e, first) {
    const q = local(e), t = e.timeStamp || performance.now(), p = cur.pts, bw = baseWidth();
    let w;
    if (first) w = bw * .85;
    else {
      const l = p[p.length - 1], d = Math.hypot(q.x - l.x, q.y - l.y);
      if (d < .9) return false;
      const dt = Math.max(1, t - cur.t), v = d / dt;
      const target = e.pointerType === 'pen' && e.pressure > 0 ? bw * (.45 + e.pressure * 1.1) : bw * clamp(1.28 - v * .32, .6, 1.28);
      w = l.w + (target - l.w) * .28;
    }
    cur.t = t;
    const pt = { x: q.x, y: q.y, w };
    p.push(pt);
    cur.len += p.length > 1 ? Math.hypot(pt.x - p[p.length - 2].x, pt.y - p[p.length - 2].y) : 0;
    return true;
  }
  function onDown(e) {
    if (paused || busy || view !== 'pad' || pid !== null) return;
    if (mode === 'hear' && HR && HR.checked) return;
    e.preventDefault();
    pid = e.pointerId; try { cf.setPointerCapture(pid); } catch (er) {}
    scrRect = scr.getBoundingClientRect();
    idleT = 0;
    cur = { pts: [], t: 0, len: 0, done: false };
    addPoint(e, true);
    stylusAt = local(e);
    if (mode === 'dots') { trail.push({ x: stylusAt.x, y: stylusAt.y, a: 1 }); dotsTouch(stylusAt); return; }
    strokes.push(cur);
    drawSeg(cur.pts, 0, false);
    if (T) traceFeed(cur.pts[0]);
  }
  function onMove(e) {
    if (e.pointerId !== pid || !cur) return;
    e.preventDefault();
    const evs = (e.getCoalescedEvents && e.getCoalescedEvents()) || [];
    const list = evs.length ? evs : [e];
    for (const ev of list) {
      if (mode === 'dots') { const q = local(ev); trail.push({ x: q.x, y: q.y, a: 1 }); dotsTouch(q); continue; }
      if (addPoint(ev, false)) { const p = cur.pts; drawSeg(p, p.length - 1, false); if (T) traceFeed(p[p.length - 1]); }
    }
    stylusAt = local(e);
  }
  function onUp(e) {
    if (e.pointerId !== pid) return;
    pid = null; stylusAt = null;
    const s = cur; cur = null; if (!s) return;
    if (mode === 'dots') return;
    s.done = true;
    if (s.pts.length > 1) { const p = s.pts; drawSeg(p, p.length - 1, true); }
    if (T) traceEnd();
    if (mode === 'hear') paintHearTools();
  }
  cf.addEventListener('pointerdown', onDown);
  cf.addEventListener('pointermove', onMove);
  cf.addEventListener('pointerup', onUp);
  cf.addEventListener('pointercancel', onUp);
  cf.addEventListener('lostpointercapture', e => { if (e.pointerId === pid) onUp(e); });

  function undo() {
    if (wipeFx) return;
    if (mode === 'dots') {
      if (!DT || DT.done || DT.n <= 0) { Sound.error(); return; }
      DT.n--; Sound.slide(); redrawInk(); drawDotsGuide(); setSeg(DT.pic.dots.length, DT.n); return;
    }
    if (mode === 'hear' && HR && HR.checked) return;
    if (!strokes.length) { Sound.error(); return; }
    strokes.pop(); Sound.slide(); redrawInk();
    if (T) { traceRecount(); drawGuide(); }
    if (mode === 'hear') paintHearTools();
  }

  /* ---------- زر المسح: ومضة ساطعة تجتاح الشاشة ---------- */
  function wipe(after, quiet) {
    if (wipeFx) return;
    if (!quiet) { Sound.noise(.35, 600, 2400, .09, .9); Sound.tone(1250, .18, 'sine', .05, 600); vibrate(18); }
    trashBtn.classList.remove('glow');
    wipeFx = { p: 0 };
    const snapI = mk(ci.width, ci.height), snapW = mk(cw.width, cw.height);
    snapI.getContext('2d').drawImage(ci, 0, 0); snapW.getContext('2d').drawImage(cw, 0, 0);
    wipeFx.snapI = snapI; wipeFx.snapW = snapW;
    tween(wipeFx, {
      p: 1, duration: .5, ease: 'power2.inOut',
      onUpdate: () => {
        // ما فوق حافة الومضة يُمسح، وما تحتها يبقى
        const edge = wipeFx.p * (S.h * 1.3) - S.h * .15;
        xi.clearRect(0, 0, S.w, S.h); xw.clearRect(0, 0, S.w, S.h);
        if (edge < S.h) {
          const y0 = Math.max(0, edge);
          xi.save(); xi.setTransform(1, 0, 0, 1, 0, 0); xi.drawImage(snapI, 0, y0 * DPR, snapI.width, snapI.height - y0 * DPR, 0, y0 * DPR, snapI.width, snapI.height - y0 * DPR); xi.restore();
          xw.drawImage(snapW, 0, y0, snapW.width, snapW.height - y0, 0, y0, snapW.width, snapW.height - y0);
        }
      },
      onComplete: () => {
        wipeFx = null; flashA = .38;
        clearInk(); if (after) after();
      }
    });
    ensureLoop();
  }
  // ومضة نهائية بسيطة (تعمل مع GSAP وبدونه)
  function flashDecay(dt) { if (flashA > 0) flashA = Math.max(0, flashA - dt * 1.2); }

  /* =====================================================================
     التتبّع: الحروف، الأرقام، الأشكال
     ===================================================================== */
  function layoutGeom(geom, frac = .82) {
    const aw = S.w * frac, ah = S.h * (geom.lines ? .86 : .78);
    let s = Math.min(aw / geom.w, ah / geom.h);
    s = Math.min(s, (Math.min(S.w, S.h) * .9) / Math.max(geom.w, geom.h) * (geom.lines ? 1.4 : 1));
    const ox = (S.w - geom.w * s) / 2, oy = (S.h - geom.h * s) / 2;
    return { s, ox, oy, X: x => ox + x * s, Y: y => oy + y * s };
  }
  function resample(pts, step) {
    const out = [pts[0]]; let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      let [x0, y0] = pts[i - 1]; const [x1, y1] = pts[i]; let d = Math.hypot(x1 - x0, y1 - y0);
      while (acc + d >= step) { const t = (step - acc) / d; x0 = x0 + (x1 - x0) * t; y0 = y0 + (y1 - y0) * t; out.push([x0, y0]); d = Math.hypot(x1 - x0, y1 - y0); acc = 0; }
      acc += d;
    }
    const l = pts[pts.length - 1], o = out[out.length - 1]; if (Math.hypot(l[0] - o[0], l[1] - o[1]) > step * .3) out.push(l);
    return out;
  }
  function buildTrace(it, geom) {
    const L = layoutGeom(geom), swS = geom.sw * L.s;
    const inkW = clamp(swS * .45, 7, 22), tol = clamp(swS * .5 + 6, 16, 40);
    const st = geom.strokes.map(s => {
      if (s.dot) return { dot: true, x: L.X(s.x), y: L.Y(s.y), r: Math.max(6, s.r * L.s), samples: [{ x: L.X(s.x), y: L.Y(s.y), cov: 0 }], len: 0 };
      const pts = resample(s.pts.map(([x, y]) => [L.X(x), L.Y(y)]), 5);
      let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      return { pts, len, samples: pts.map(([x, y]) => ({ x, y, cov: 0 })) };
    });
    const pathLen = st.reduce((a, s) => a + (s.dot ? 30 : s.len), 0);
    return { it, geom, L, swS, inkW, tol, st, pathLen, done: st.map(() => 0), near: 0, total: 0, inkLen: 0, finished: false, failN: 0 };
  }
  function traceFeed(p) {
    if (!T || T.finished) return;
    const tol2 = T.tol * T.tol, ntol2 = (T.tol * 1.15) ** 2;
    let near = false, changed = false;
    T.st.forEach((s, si) => {
      const rr2 = s.dot ? (s.r + T.tol) ** 2 : tol2;
      for (const q of s.samples) {
        const d2 = (q.x - p.x) ** 2 + (q.y - p.y) ** 2;
        if (d2 < (s.dot ? rr2 : ntol2)) near = true;
        if (!q.cov && d2 < rr2) { q.cov = 1; changed = true; }
      }
    });
    T.total++; if (near) T.near++;
    if (changed) {
      T.st.forEach((s, si) => {
        if (T.done[si]) return;
        const c = s.samples.filter(q => q.cov).length / s.samples.length;
        if (c >= (s.dot ? 1 : .84)) {
          T.done[si] = 1; Sound.pop(); vibrate(8);
          const e = s.dot ? [s.x, s.y] : s.pts[s.pts.length - 1];
          burst(e[0], e[1], 10, 1);
          drawGuide(); paintSeg();
        }
      });
    }
  }
  function traceRecount() {
    T.st.forEach(s => s.samples.forEach(q => { q.cov = 0; })); T.done = T.st.map(() => 0); T.near = 0; T.total = 0; T.inkLen = 0;
    const save = T.finished; T.finished = false;
    const snd = Sound.pop; Sound.pop = () => {}; const bu = burst; burstOff = true;
    strokes.forEach(s => { T.inkLen += s.len; s.pts.forEach(p => traceFeed(p)); });
    Sound.pop = snd; burstOff = false; T.finished = save;
    paintSeg();
  }
  let burstOff = false;
  function traceCoverage() { let c = 0, n = 0; T.st.forEach(s => s.samples.forEach(q => { n++; if (q.cov) c++; })); return n ? c / n : 0; }
  function tracePrecision() { return T.total ? T.near / T.total : 0; }
  function paintSeg() { if (T) { const d = T.done.reduce((a, b) => a + b, 0); setSeg(T.st.length, d, T.done.indexOf(0)); } }
  function traceEnd() {
    if (!T || T.finished) return;
    T.inkLen = strokes.reduce((a, s) => a + s.len, 0);
    const allDone = T.done.every(Boolean), prec = tracePrecision();
    const over = T.inkLen > T.pathLen * 2.4 + 200;
    if (allDone && prec >= .62 && !over) { traceSuccess(); return; }
    const scribble = over || (T.inkLen > T.pathLen * 1.2 && T.total > 40 && prec < .45);
    if (scribble) traceFail();
    else if (T.done.indexOf(0) >= 0 && strokes.length >= 1) idleT = 0;
  }
  function traceFail() {
    T.finished = true; T.failN++;
    Sound.error(); vibrate(30);
    App.speak(App.g('حاولي مرة أخرى', 'حاول مرة أخرى'));
    msg(App.g('على الخط المنقّط يا بطلة ✏️ حاولي مرة أخرى', 'على الخط المنقّط يا بطل ✏️ حاول مرة أخرى'));
    busy = true;
    setTimeout(() => wipe(() => { busy = false; strokes = []; T.finished = false; traceRecount(); drawGuide(); }), 650);
  }
  function traceSuccess() {
    T.finished = true; busy = true;
    const cov = traceCoverage(), prec = tracePrecision();
    const stars = prec >= .85 && cov >= .9 ? 3 : prec >= .72 ? 2 : 1;
    const p = prog[mode], old = p[T.it.key] || 0;
    if (stars > old) { p[T.it.key] = stars; saveProg(); App.addStars(stars - old); }
    App.achieve('magicpad_first'); checkAch();
    Sound.win(); vibrate([20, 40, 20]);
    // بريق على طول المسار
    T.st.forEach((s, k) => { const pts = s.dot ? [[s.x, s.y]] : s.pts; for (let i = 0; i < pts.length; i += 6) setTimeout(() => burst(pts[i][0], pts[i][1], 2, .8), k * 140 + i * 6); });
    glowPulse();
    const it = T.it;
    setTimeout(() => {
      if (mode === 'ar') App.speak(it.ar + ' ' + praiseAr());
      else if (mode === 'en') App.speak(it.en + '! Well done!', 'en');
      else say(it.ar + ' ' + praiseAr(), it.en + '! Well done!');
    }, 250);
    setTimeout(() => showWin(stars, it), 1300);
  }
  function glowPulse() {
    const g = GS();
    if (g) g.fromTo(cw, { opacity: 1 }, { opacity: .75, duration: 1.1, ease: 'sine.inOut', clearProps: 'opacity' });
  }

  /* ---------- رسم الدليل: الحرف الباهت، النقاط، الأسهم، أرقام البداية ---------- */
  let ghostCache = null;
  function drawGuide() {
    const c = xg; c.clearRect(0, 0, S.w, S.h);
    if (!T) return;
    const { geom, L } = T;
    // خطوط الكتابة الإنجليزية
    if (geom.lines) {
      c.save(); c.lineWidth = 1.5;
      [[geom.lines.cap, false], [geom.lines.xh, true], [geom.lines.base, false]].forEach(([y, dash]) => {
        c.strokeStyle = dash ? 'rgba(130,170,255,.28)' : 'rgba(130,170,255,.36)'; c.setLineDash(dash ? [10, 9] : []);
        c.beginPath(); c.moveTo(S.w * .06, L.Y(y)); c.lineTo(S.w * .94, L.Y(y)); c.stroke();
      });
      c.restore();
    }
    // الشكل الباهت
    c.save();
    if (geom.mask) {
      if (!ghostCache || ghostCache.key !== geom) {
        const g = mk(geom.w, geom.h), gx = g.getContext('2d'); gx.drawImage(geom.mask, 0, 0); gx.globalCompositeOperation = 'source-in'; gx.fillStyle = '#fff'; gx.fillRect(0, 0, geom.w, geom.h);
        ghostCache = { key: geom, c: g };
      }
      c.globalAlpha = .11; c.imageSmoothingQuality = 'high';
      c.drawImage(ghostCache.c, L.ox, L.oy, geom.w * L.s, geom.h * L.s);
    } else if (geom.diamond) {
      c.globalAlpha = .12; c.fillStyle = '#fff'; const s0 = T.st[0];
      c.beginPath(); c.moveTo(s0.x, s0.y - s0.r * 1.6); c.lineTo(s0.x + s0.r * 1.2, s0.y); c.lineTo(s0.x, s0.y + s0.r * 1.6); c.lineTo(s0.x - s0.r * 1.2, s0.y); c.closePath(); c.fill();
    } else {
      c.globalAlpha = .11; c.strokeStyle = '#fff'; c.lineWidth = T.swS * 1.15; c.lineCap = 'round'; c.lineJoin = 'round';
      T.st.forEach(s => { if (s.dot) return; c.beginPath(); s.pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); });
    }
    c.restore();
    const curI = T.done.indexOf(0);
    // النقاط المنقّطة والأسهم
    T.st.forEach((s, si) => {
      const fin = T.done[si], isCur = si === curI;
      if (s.dot) {
        c.save(); c.setLineDash([4, 4]); c.lineWidth = 2.2; c.strokeStyle = fin ? 'rgba(108,247,160,.4)' : isCur ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.45)';
        c.beginPath(); c.arc(s.x, s.y, s.r + 3, 0, TAU); c.stroke(); c.restore();
        return;
      }
      const dotR = fin ? 1.6 : isCur ? 2.8 : 2.2;
      c.fillStyle = fin ? 'rgba(108,247,160,.35)' : isCur ? 'rgba(255,255,255,.92)' : 'rgba(255,255,255,.42)';
      let acc = 0;
      for (let i = 0; i < s.pts.length; i++) {
        if (i) acc += Math.hypot(s.pts[i][0] - s.pts[i - 1][0], s.pts[i][1] - s.pts[i - 1][1]);
        if (i === 0 || acc >= 12) { acc = 0; c.beginPath(); c.arc(s.pts[i][0], s.pts[i][1], dotR, 0, TAU); c.fill(); }
      }
      if (!fin) {
        // أسهم اتجاه الكتابة
        c.save(); c.strokeStyle = isCur ? '#FFE45C' : 'rgba(255,228,92,.35)'; c.lineWidth = isCur ? 3.2 : 2.4; c.lineCap = 'round'; c.lineJoin = 'round';
        const gap = Math.max(55, s.len / 5); let d = 0;
        for (let i = 1; i < s.pts.length; i++) {
          d += Math.hypot(s.pts[i][0] - s.pts[i - 1][0], s.pts[i][1] - s.pts[i - 1][1]);
          if (d >= gap && i < s.pts.length - 4) {
            d = 0;
            const a = s.pts[Math.max(0, i - 2)], b = s.pts[Math.min(s.pts.length - 1, i + 2)], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
            const [x, y] = s.pts[i], k = isCur ? 8 : 6, off = T.swS * .55 + 6, nx = -Math.sin(ang) * off, ny = Math.cos(ang) * off;
            c.beginPath(); c.moveTo(x + nx - Math.cos(ang - .6) * k, y + ny - Math.sin(ang - .6) * k); c.lineTo(x + nx, y + ny); c.lineTo(x + nx - Math.cos(ang + .6) * k, y + ny - Math.sin(ang + .6) * k); c.stroke();
          }
        }
        c.restore();
      }
    });
    // أرقام البداية
    T.st.forEach((s, si) => {
      if (T.done[si]) return;
      const isCur = si === curI, [x, y] = s.dot ? [s.x + s.r + 16, s.y - s.r - 10] : s.pts[0], r = isCur ? 14 : 11;
      c.save();
      c.shadowColor = isCur ? 'rgba(80,255,150,.8)' : 'transparent'; c.shadowBlur = isCur ? 12 : 0;
      c.fillStyle = isCur ? '#2FD27A' : 'rgba(255,255,255,.2)'; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.restore();
      c.strokeStyle = isCur ? '#fff' : 'rgba(255,255,255,.55)'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
      c.fillStyle = '#fff'; c.font = `900 ${r * 1.2}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
      c.fillText(dg(si + 1), x, y + r * .08);
    });
  }

  /* ---------- الانتقال بين العناصر ---------- */
  function gotoItem(i) {
    const its = itemsOf(mode); if (!its.length) return;
    i = (i + its.length) % its.length;
    if (mode === 'dots') { idx = i; startDots(); return; }
    if (strokes.length) { busy = true; wipe(() => { busy = false; startItem(i); }, true); }
    else startItem(i);
  }
  async function startItem(i, keepQuiet) {
    const my = ++token;
    idx = i; store.set('magicpadIdx:' + mode, i);
    const its = itemsOf(mode), it = its[i];
    strokes = []; clearInk(); resEl.classList.remove('on');
    setTitle(`${MODES.find(m => m.id === mode).t()}  ${dg(i + 1)}/${dg(its.length)}`, it.label);
    await ensureFont();
    if (my !== token) return;
    const geom = geomOf(it);
    T = buildTrace(it, geom); busy = false; idleT = 0;
    drawGuide(); paintSeg();
    if (!keepQuiet) setTimeout(() => { if (my === token) sayItem(it); }, 200);
    const g = GS();
    if (g) g.fromTo(cg, { opacity: 0, scale: .92 }, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(1.6)', clearProps: 'all' });
    ensureLoop();
  }

  /* =====================================================================
     صِل النقاط
     ===================================================================== */
  function startDots(keep) {
    const its = itemsOf('dots'), it = its[idx], pic = it.pic;
    store.set('magicpadIdx:dots', idx);
    T = null; strokes = []; trail = []; resEl.classList.remove('on');
    const L = layoutGeom({ w: 100, h: 100 }, .8);
    const keepN = keep && DT && DT.it.key === it.key ? DT.n : 0, keepDone = keep && DT && DT.it.key === it.key && DT.done;
    DT = { it, pic, L, P: pic.dots.map(([x, y]) => [L.X(x), L.Y(y)]), n: keepN, done: keepDone, reveal: keepDone ? 1 : 0, hitR: clamp(L.s * 100 * .055, 18, 30) };
    setTitle(`صِل النقاط  ${dg(idx + 1)}/${dg(its.length)}`, keepDone ? it.label : '؟');
    setSeg(pic.dots.length + (pic.closed ? 1 : 0), DT.n);
    redrawInk(); drawDotsGuide();
    if (!keep) {
      setTimeout(() => say(App.g('صِلي النقاط', 'صِل النقاط'), 'Connect the dots'), 200);
      const g = GS(); if (g) g.fromTo(cg, { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(1.6)', clearProps: 'all' });
    }
    ensureLoop();
  }
  function dotsTarget() { const n = DT.pic.dots.length; return DT.n < n ? DT.n : (DT.pic.closed && DT.n === n ? 0 : -1); }
  function dotsTouch(q) {
    if (!DT || DT.done || busy) return;
    const ti = dotsTarget(); if (ti < 0) return;
    const [x, y] = DT.P[ti];
    if ((q.x - x) ** 2 + (q.y - y) ** 2 > DT.hitR ** 2) return;
    // وصل نقطة جديدة
    DT.n++;
    const step = DT.n;
    Sound.tone(392 * Math.pow(2, Math.min(step, 24) / 12), .16, 'triangle', .14); vibrate(8);
    burst(x, y, 8, .9);
    if (DT.n > 1) drawDotLine(DT.n - 1);
    drawDotsGuide();
    setSeg(DT.pic.dots.length + (DT.pic.closed ? 1 : 0), DT.n);
    const total = DT.pic.dots.length + (DT.pic.closed ? 1 : 0);
    if (DT.n >= total) { dotsDone(); return; }
    if (DT.n < DT.pic.dots.length) say(numWord(ti + 1, 'ar'), numWord(ti + 1, 'en'));
  }
  const AR_NUMS = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر', 'عشرون'];
  const EN_NUMS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  const numWord = (n, l) => (l === 'en' ? EN_NUMS : AR_NUMS)[n] || String(n);
  function drawDotLine(k) {
    // خط مستقيم بين النقطة k-1 والنقطة k (بأسلوب حبر اللوح)
    const n = DT.pic.dots.length, a = DT.P[(k - 1) % n], b = DT.P[k % n];
    const w = clamp(DT.L.s * 100 * .016, 5, 10), pts = [];
    const steps = Math.max(2, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4));
    for (let i = 0; i <= steps; i++) pts.push({ x: a[0] + (b[0] - a[0]) * i / steps, y: a[1] + (b[1] - a[1]) * i / steps, w });
    renderStroke({ pts, done: true });
  }
  function drawDotLines() { if (!DT) return; for (let k = 1; k < DT.n; k++) drawDotLine(k); }
  function drawDotsGuide() {
    const c = xg; c.clearRect(0, 0, S.w, S.h); if (!DT) return;
    if (DT.reveal > 0) drawPic(c, DT, DT.reveal);
    if (DT.done) return;
    const ti = dotsTarget(), r = clamp(DT.L.s * 100 * .016, 4, 7);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
    // مركز الشكل لتوجيه الأرقام للخارج
    let cx = 0, cy = 0; DT.P.forEach(([x, y]) => { cx += x; cy += y; }); cx /= DT.P.length; cy /= DT.P.length;
    DT.P.forEach(([x, y], i) => {
      const reached = i < DT.n, isNext = i === ti;
      c.fillStyle = reached ? '#6CF7A0' : isNext ? '#FFE45C' : 'rgba(255,255,255,.85)';
      c.beginPath(); c.arc(x, y, isNext ? r * 1.35 : r, 0, TAU); c.fill();
      const a = Math.atan2(y - cy, x - cx), off = r + 13, lx = x + Math.cos(a) * off, ly = y + Math.sin(a) * off;
      c.font = `900 ${isNext ? 17 : 14}px ${FONT}`;
      c.fillStyle = reached ? 'rgba(108,247,160,.55)' : isNext ? '#FFE45C' : 'rgba(255,255,255,.7)';
      c.fillText(dg(i + 1), lx, ly + 1);
    });
  }
  function dotsDone() {
    DT.done = true; busy = true;
    const p = prog.dots, old = p[DT.it.key] || 0;
    if (old < 3) { p[DT.it.key] = 3; saveProg(); App.addStars(3 - old); }
    App.achieve('magicpad_first'); checkAch();
    Sound.win(); vibrate([20, 40, 20]);
    setTitle(`صِل النقاط  ${dg(idx + 1)}/${dg(PICS.length)}`, DT.it.label);
    const o = { r: 0 };
    tween(o, { r: 1, duration: .9, ease: 'back.out(1.4)', onUpdate: () => { DT.reveal = o.r; drawDotsGuide(); }, onComplete: () => { DT.reveal = 1; drawDotsGuide(); } });
    DT.P.forEach(([x, y], i) => setTimeout(() => burst(x, y, 6, 1), i * 40));
    setTimeout(() => say(DT.it.ar + ' ' + praiseAr(), DT.it.en + '! Well done!'), 450);
    setTimeout(() => showWin(3, DT.it), 1700);
  }
  /* الصورة الملوّنة التي تظهر بعد وصل النقاط */
  function drawPic(c, dt, t) {
    const { pic, L } = dt, k = L.s;
    c.save();
    const cx = L.X(50), cy = L.Y(50), sc = .85 + .15 * Math.min(1, t);
    c.globalAlpha = clamp(t, 0, 1);
    c.translate(cx, cy); c.scale(sc, sc); c.translate(-cx, -cy);
    c.translate(L.ox, L.oy); c.scale(k, k);
    const poly = () => { c.beginPath(); pic.dots.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); if (pic.closed) c.closePath(); };
    const grad = (a, b) => { const g = c.createLinearGradient(0, 0, 0, 100); g.addColorStop(0, a); g.addColorStop(1, b); return g; };
    c.lineJoin = 'round'; c.lineCap = 'round';
    c.shadowColor = 'rgba(255,255,255,.25)'; c.shadowBlur = 8;
    const id = pic.id;
    if (id === 'boat') {
      c.fillStyle = grad('#FFFFFF', '#CFE3FF'); c.beginPath(); c.moveTo(47, 66); c.lineTo(47, 8); c.lineTo(82, 60); c.lineTo(53, 60); c.lineTo(53, 66); c.closePath(); c.fill();
      c.fillStyle = grad('#FF8A5B', '#D9480F'); c.beginPath(); c.moveTo(10, 66); c.lineTo(90, 66); c.lineTo(76, 86); c.lineTo(24, 86); c.closePath(); c.fill();
      c.fillStyle = '#7A3E1D'; c.fillRect(47, 8, 6, 58);
      c.strokeStyle = 'rgba(111,224,255,.8)'; c.lineWidth = 2.5; c.beginPath(); for (let x = 4; x <= 96; x += 2) c.lineTo(x, 92 + Math.sin(x * .35) * 2); c.stroke();
    } else if (id === 'umbrella') {
      const cols = ['#FF6B8B', '#FFD43B', '#4DABF7', '#69DB7C'];
      c.save(); c.beginPath(); c.moveTo(6, 50); pic.dots.slice(0, 7).forEach(([x, y]) => c.lineTo(x, y)); c.lineTo(78, 46); c.lineTo(64, 50); c.lineTo(50, 46); c.lineTo(36, 50); c.lineTo(22, 46); c.closePath(); c.clip();
      cols.forEach((col, i) => { c.fillStyle = col; c.fillRect(6 + i * 22, 0, 22, 60); }); c.restore();
      c.strokeStyle = '#8B5A2B'; c.lineWidth = 3.5; c.beginPath(); c.moveTo(53, 46); c.lineTo(53, 82); c.quadraticCurveTo(53, 90, 46, 90); c.quadraticCurveTo(39, 90, 39, 84); c.stroke();
    } else if (id === 'kite') {
      const [t0, , rr0, , b0, , l0] = pic.dots;
      [['#FF6B8B', [t0, rr0]], ['#FFD43B', [rr0, b0]], ['#4DABF7', [b0, l0]], ['#69DB7C', [l0, t0]]].forEach(([col, [a, b]]) => { c.fillStyle = col; c.beginPath(); c.moveTo(50, 38); c.lineTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.closePath(); c.fill(); });
      c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(50, 72); c.bezierCurveTo(40, 82, 62, 88, 52, 98); c.stroke();
      [[46, 80, '#FF6B8B'], [56, 88, '#4DABF7'], [50, 96, '#FFD43B']].forEach(([x, y, col]) => { c.fillStyle = col; c.beginPath(); c.moveTo(x - 4, y - 3); c.lineTo(x + 4, y + 3); c.lineTo(x + 4, y - 3); c.lineTo(x - 4, y + 3); c.closePath(); c.fill(); });
    } else if (id === 'rocket') {
      poly(); c.fillStyle = grad('#FFFFFF', '#AEBBDD'); c.fill();
      c.fillStyle = '#FF5A5F'; c.beginPath(); c.moveTo(50, 4); c.lineTo(61, 16); c.lineTo(39, 16); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(34, 60); c.lineTo(20, 74); c.lineTo(20, 88); c.lineTo(36, 80); c.closePath(); c.fill(); c.beginPath(); c.moveTo(66, 60); c.lineTo(80, 74); c.lineTo(80, 88); c.lineTo(64, 80); c.closePath(); c.fill();
      c.fillStyle = '#4DABF7'; c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.arc(50, 36, 8, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#FFB020'; c.beginPath(); c.moveTo(40, 80); c.quadraticCurveTo(50, 104, 60, 80); c.closePath(); c.fill();
      c.fillStyle = '#FFE45C'; c.beginPath(); c.moveTo(45, 80); c.quadraticCurveTo(50, 94, 55, 80); c.closePath(); c.fill();
    } else if (id === 'car') {
      poly(); c.fillStyle = grad('#FF8787', '#C92A2A'); c.fill();
      c.fillStyle = '#A5D8FF'; c.beginPath(); c.moveTo(35, 36); c.lineTo(48, 36); c.lineTo(48, 50); c.lineTo(26, 50); c.closePath(); c.fill(); c.beginPath(); c.moveTo(52, 36); c.lineTo(64, 36); c.lineTo(73, 50); c.lineTo(52, 50); c.closePath(); c.fill();
      [[26, 74], [74, 74]].forEach(([x, y]) => { c.fillStyle = '#222'; c.beginPath(); c.arc(x, y, 10, 0, TAU); c.fill(); c.fillStyle = '#CED4DA'; c.beginPath(); c.arc(x, y, 4.5, 0, TAU); c.fill(); });
      c.fillStyle = '#FFE45C'; c.beginPath(); c.arc(90, 60, 3, 0, TAU); c.fill();
    } else {
      poly(); c.fillStyle = grad(pic.col[0], pic.col[1]); c.fill();
      c.shadowBlur = 0;
      if (id === 'fish') { c.fillStyle = '#fff'; c.beginPath(); c.arc(24, 44, 5, 0, TAU); c.fill(); c.fillStyle = '#222'; c.beginPath(); c.arc(23, 44, 2.5, 0, TAU); c.fill(); c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 2; [44, 52, 60].forEach(x => { c.beginPath(); c.arc(x, 50, 10, -1, 1); c.stroke(); }); }
      if (id === 'apple') { c.strokeStyle = '#7A4A1D'; c.lineWidth = 3.5; c.beginPath(); c.moveTo(50, 24); c.quadraticCurveTo(50, 12, 56, 5); c.stroke(); c.fillStyle = '#51CF66'; c.beginPath(); c.ellipse(62, 10, 9, 4.5, -.5, 0, TAU); c.fill(); }
      if (id === 'balloon') { c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(50, 76); c.bezierCurveTo(44, 84, 58, 90, 50, 99); c.stroke(); }
      if (id === 'star') { c.fillStyle = '#7A4A00'; c.beginPath(); c.arc(43, 52, 2.6, 0, TAU); c.arc(57, 52, 2.6, 0, TAU); c.fill(); c.strokeStyle = '#7A4A00'; c.lineWidth = 2; c.beginPath(); c.arc(50, 57, 5, .3, Math.PI - .3); c.stroke(); }
      // لمعة
      c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.ellipse(36, 30, 8, 4, -.6, 0, TAU); c.fill();
    }
    c.restore();
  }

  /* =====================================================================
     اسمع وارسم
     ===================================================================== */
  function hearPool() {
    const a = SHAPES.slice(0, 5).map(s => ({ key: s.id, label: lang === 'ar' ? s.ar : s.en, kind: 'shape', shape: s, ar: s.ar, en: s.en }));
    for (let i = 1; i <= 9; i++) { const ch = lang === 'ar' ? AR_DIG[i] : String(i); a.push({ key: 'n' + i, label: ch, kind: 'glyph', text: ch, alpha: 'num', ar: AR_NUM[i], en: EN_NUM[i], isNum: true }); }
    return a;
  }
  function startHear() {
    T = null; DT = null;
    const pool = shuffle(hearPool()), shapes = pool.filter(p => p.kind === 'shape').slice(0, 3), nums = pool.filter(p => p.isNum).slice(0, HEAR_ROUNDS - 3);
    HR = { list: shuffle(shapes.concat(nums)), r: 0, scores: [], checked: false };
    hearRound();
  }
  function hearRound() {
    strokes = []; clearInk(); xg.clearRect(0, 0, S.w, S.h); HR.checked = false; resEl.classList.remove('on');
    setTitle(MODES[5].t(), `👂 ${dg(HR.r + 1)}/${dg(HEAR_ROUNDS)}`);
    setSeg(HEAR_ROUNDS, HR.r, HR.r);
    drawEar();
    paintHearTools();
    setTimeout(hearPrompt, 350);
    ensureLoop();
  }
  function drawEar() {
    const c = xg; c.clearRect(0, 0, S.w, S.h);
    c.save(); c.globalAlpha = .13; c.font = `${Math.min(S.w, S.h) * .32}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`;
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('👂', S.w / 2, S.h / 2); c.restore();
  }
  function hearPrompt() {
    if (!HR) return;
    const it = HR.list[HR.r];
    const b = toolsEl.querySelector('[data-a=say]'); if (b) uiFrom(b, { scale: 1.35, duration: .5, ease: 'elastic.out(1,.4)', clearProps: 'transform' });
    say(App.g('ارسمي', 'ارسم') + ' ' + it.ar, 'Draw ' + it.en);
    msg((lang === 'ar' ? '👂 ' + App.g('اسمعي وارسمي', 'اسمع وارسم') : '👂 Listen and draw'), 2200);
  }
  function paintHearTools() {
    const b = toolsEl.querySelector('[data-a=check]'); if (!b) return;
    b.disabled = !strokes.length || (HR && HR.checked);
    b.classList.toggle('pulse', !!strokes.length && !(HR && HR.checked));
  }
  function modelPts(geom) {
    const out = [];
    geom.strokes.forEach(s => {
      if (s.dot) { for (let i = 0; i < 8; i++) out.push([s.x + Math.cos(i / 8 * TAU) * s.r, s.y + Math.sin(i / 8 * TAU) * s.r]); return; }
      resample(s.pts, Math.max(geom.w, geom.h) / 70).forEach(p => out.push(p));
    });
    return out;
  }
  function norm(pts) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    pts.forEach(([x, y]) => { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; });
    const s = Math.max(x1 - x0, y1 - y0, 1e-6), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    return { pts: pts.map(([x, y]) => [(x - cx) / s, (y - cy) / s]), cx, cy, s, bw: x1 - x0, bh: y1 - y0 };
  }
  function meanDist(A, B) { let t = 0; for (const a of A) { let m = 1e9; for (const b of B) { const d = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2; if (d < m) m = d; } t += Math.sqrt(m); } return t / A.length; }
  function shapeScore(childPts, model) {
    const step = Math.max(1, Math.floor(childPts.length / 260));
    const C = norm(childPts.filter((_, i) => i % step === 0)), M = norm(model);
    const d1 = meanDist(C.pts, M.pts), d2 = meanDist(M.pts, C.pts);
    const d = .45 * Math.min(d1, d2) + .55 * Math.max(d1, d2);
    return { score: clamp(1 - (d - .03) / .14, 0, 1), C, M, d1, d2 };
  }
  async function hearCheck() {
    if (!HR || HR.checked || !strokes.length || busy) return;
    HR.checked = true; paintHearTools();
    await ensureFont();
    const it = HR.list[HR.r], geom = geomOf(it), model = modelPts(geom);
    const pts = []; strokes.forEach(s => s.pts.forEach(p => pts.push([p.x, p.y])));
    const R = shapeScore(pts, model);
    const stars = R.score >= .7 ? 3 : R.score >= .5 ? 2 : R.score >= .3 ? 1 : 0;
    HR.scores.push(stars);
    // رسم النموذج فوق رسم الطفل
    const mStrokes = geom.strokes.map(s => s.dot ? { dot: true, x: s.x, y: s.y, r: s.r } : { pts: s.pts });
    const sc = R.C.s / R.M.s, mcx = R.M.cx, mcy = R.M.cy;
    const X = x => R.C.cx + (x - mcx) * sc, Y = y => R.C.cy + (y - mcy) * sc;
    const o = { t: 0 };
    tween(o, { t: 1, duration: 1.1, ease: 'power1.out', onUpdate: () => drawModel(mStrokes, X, Y, o.t, sc), onComplete: () => drawModel(mStrokes, X, Y, 1, sc) });
    if (stars) { Sound.star(); burst(R.C.cx, R.C.cy, 16, 1.2); } else Sound.error();
    setTimeout(() => {
      if (stars >= 2) say(it.ar + ' ' + praiseAr(), it.en + '! Well done!');
      else if (stars === 1) say(it.ar, it.en);
      else say(App.g('حاولي مرة أخرى', 'حاول مرة أخرى'), 'Try again!');
    }, 300);
    const last = HR.r >= HEAR_ROUNDS - 1;
    resEl.innerHTML = `<div class="rt"><b>${lang === 'en' && !it.isNum ? `<span dir="ltr">${it.en}</span>` : it.label}</b><div class="st">${[0, 1, 2].map(i => `<span class="${i < stars ? '' : 'off'}">⭐</span>`).join('')}</div></div>
      ${stars ? '' : `<button class="btn alt" data-r="again">🔁</button>`}<button class="btn" data-r="next">${last ? '🏁' : 'التالي ◀'}</button>`;
    resEl.classList.add('on');
    uiFrom(resEl, { y: 40, autoAlpha: 0, duration: .45, ease: 'back.out(1.8)' });
    resEl.querySelectorAll('[data-r]').forEach(b => b.onclick = () => {
      Sound.tap();
      if (b.dataset.r === 'again') { HR.scores.pop(); hearRound(); return; }
      HR.r++; if (HR.r >= HEAR_ROUNDS) hearEnd(); else hearRound();
    });
  }
  function drawModel(ms, X, Y, t, sc) {
    const c = xg; c.clearRect(0, 0, S.w, S.h);
    c.save(); c.strokeStyle = 'rgba(255,255,255,.92)'; c.lineWidth = 4; c.lineCap = 'round'; c.lineJoin = 'round'; c.setLineDash([2, 9]);
    c.shadowColor = 'rgba(255,255,255,.9)'; c.shadowBlur = 10;
    const total = ms.reduce((a, s) => a + (s.dot ? 1 : s.pts.length), 0); let budget = total * t;
    ms.forEach(s => {
      if (budget <= 0) return;
      if (s.dot) { c.beginPath(); c.arc(X(s.x), Y(s.y), Math.max(4, s.r * sc), 0, TAU); c.stroke(); budget--; return; }
      const n = Math.min(s.pts.length, Math.ceil(budget)); budget -= s.pts.length;
      c.beginPath(); for (let i = 0; i < n; i++) { const [x, y] = s.pts[i]; i ? c.lineTo(X(x), Y(y)) : c.moveTo(X(x), Y(y)); } c.stroke();
    });
    c.restore();
  }
  function hearEnd() {
    resEl.classList.remove('on');
    const sum = HR.scores.reduce((a, b) => a + b, 0), avg = sum / HEAR_ROUNDS;
    const stars = avg >= 2.3 ? 3 : avg >= 1.5 ? 2 : avg >= .6 ? 1 : 0;
    if (stars > prog.hear) { App.addStars(stars - prog.hear); prog.hear = stars; saveProg(); }
    if (stars) { App.achieve('magicpad_first'); checkAch(); }
    Sound.win();
    showWin(stars, null, true);
  }

  /* =====================================================================
     الرسم الحر: حفظ في المعرض
     ===================================================================== */
  function saveDrawing() {
    if (!strokes.length) { Sound.error(); msg(App.g('ارسمي شيئًا أولًا ✏️', 'ارسم شيئًا أولًا ✏️')); return; }
    const tw = 220, th = Math.round(tw * S.h / S.w), c = mk(tw, th), x = c.getContext('2d');
    x.fillStyle = '#0B0E12'; x.fillRect(0, 0, tw, th);
    x.filter = 'blur(3px)'; x.globalAlpha = .7; x.globalCompositeOperation = 'lighter'; x.drawImage(cw, 0, 0, tw, th);
    x.filter = 'none'; x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.drawImage(ci, 0, 0, tw, th);
    let img; try { img = c.toDataURL('image/jpeg', .82); } catch (e) { return; }
    const gal = store.get('magicpadGallery', []);
    gal.push({ t: Date.now(), img });
    let dropped = false; while (gal.length > GAL_MAX) { gal.shift(); dropped = true; }
    store.set('magicpadGallery', gal);
    prog.saves++; saveProg();
    Sound.star(); vibrate(15);
    msg(dropped ? 'حُفظت الرسمة 🖼️ (حُذفت أقدم رسمة)' : 'حُفظت الرسمة في المعرض 🖼️');
    if (strokes.length >= 3 && prog.saves <= 20) App.addStars(1);
    App.achieve('magicpad_first'); if (prog.saves >= 5) App.achieve('magicpad_artist');
    paintGalCount();
    // صورة مصغّرة تطير إلى زر المعرض
    const gb = toolsEl.querySelector('[data-a=gal]'), g = GS();
    if (gb && g) {
      const fl = document.createElement('img'); fl.src = img; const br = gb.getBoundingClientRect();
      Object.assign(fl.style, { position: 'fixed', left: S.x + 'px', top: S.y + 'px', width: S.w + 'px', borderRadius: '14px', zIndex: 30, pointerEvents: 'none', boxShadow: '0 10px 30px rgba(0,0,0,.4)' });
      root.appendChild(fl);
      g.to(fl, { left: br.left + 4, top: br.top + 4, width: br.width - 8, opacity: .3, duration: .6, ease: 'power2.in', onComplete: () => { fl.remove(); g.fromTo(gb, { scale: 1.35 }, { scale: 1, duration: .5, ease: 'elastic.out(1,.4)', clearProps: 'transform' }); } });
    }
  }
  function openGallery() {
    const gal = store.get('magicpadGallery', []);
    const p = ovGal.querySelector('.panel');
    p.innerHTML = `<h3>🖼️ ${App.g('معرض رسوماتك', 'معرض رسوماتك')}</h3>
      ${gal.length ? `<div class="gal">${gal.slice().reverse().map((g, i) => `<button class="th" data-i="${gal.length - 1 - i}"><img src="${g.img}" alt="رسمة"></button>`).join('')}</div>` : `<p class="empty">لا توجد رسومات بعد.<br>${App.g('ارسمي ثم اضغطي', 'ارسم ثم اضغط')} 💾</p>`}
      <button class="btn" data-x="close">رجوع</button>`;
    p.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { Sound.tap(); viewArt(+b.dataset.i); });
    p.querySelector('[data-x=close]').onclick = () => { Sound.tap(); closeOv(ovGal); };
    openOv(ovGal);
    uiFrom(p.querySelectorAll('.th'), { scale: .5, autoAlpha: 0, duration: .35, stagger: .04, ease: 'back.out(2)' });
  }
  function viewArt(i) {
    const gal = store.get('magicpadGallery', []), g = gal[i]; if (!g) return;
    const p = ovGal.querySelector('.panel');
    p.innerHTML = `<img class="bigimg" src="${g.img}" alt="رسمة">
      <button class="btn alt" data-x="del">🗑️ حذف</button><button class="btn" data-x="back">رجوع</button>`;
    let armed = false;
    p.querySelector('[data-x=del]').onclick = e => {
      Sound.tap();
      if (!armed) { armed = true; e.currentTarget.textContent = 'اضغط مرة أخرى للحذف'; return; }
      gal.splice(i, 1); store.set('magicpadGallery', gal); Sound.poof(); paintGalCount(); openGallery();
    };
    p.querySelector('[data-x=back]').onclick = () => { Sound.tap(); openGallery(); };
  }

  /* =====================================================================
     النوافذ
     ===================================================================== */
  function openOv(o) { o.classList.add('on'); uiFrom(o.querySelector('.panel'), { scale: .6, autoAlpha: 0, duration: .45, ease: 'back.out(1.8)' }); }
  function closeOv(o) { o.classList.remove('on'); }
  function anyOv() { return [ovWin, ovPick, ovGal].find(o => o.classList.contains('on')); }
  function showWin(stars, it, isHear) {
    const p = ovWin.querySelector('.panel');
    const titles = [App.g('أحسنتِ!', 'أحسنت!'), 'رائع! 🌟', App.g('ممتازة!', 'ممتاز!'), 'يا سلام! ✨'];
    const lastItem = !isHear && idx >= itemsOf(mode).length - 1;
    p.innerHTML = `<h3>${isHear && !stars ? App.g('حاولي مرة أخرى', 'حاول مرة أخرى') : titles[(Math.random() * titles.length) | 0]}</h3>
      <div class="lcdbox"><canvas width="300" height="240"></canvas></div>
      <div class="stars3">${[0, 1, 2].map(i => `<span class="${i < stars ? '' : 'off'}">⭐</span>`).join('')}</div>
      ${isHear ? `<p>${dg(HR.scores.reduce((a, b) => a + b, 0))} / ${dg(HEAR_ROUNDS * 3)} ⭐</p>` : ''}
      <div>${isHear ? `<button class="btn" data-w="again">🔁 ${App.g('العبي مجددًا', 'العب مجددًا')}</button>` : `<button class="btn" data-w="next">${lastItem ? '🏁 المستويات' : 'التالي ◀'}</button><button class="btn alt" data-w="again">🔁</button>`}
      <button class="btn alt" data-w="lv">🗂️</button></div>`;
    // صورة من اللوح نفسه
    const pc = p.querySelector('canvas'), x = pc.getContext('2d');
    if (isHear) { x.font = '150px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(stars ? '🏆' : '👂', 150, 128); }
    else {
      const k = Math.min(300 / S.w, 240 / S.h), ow = S.w * k, oh = S.h * k, ox = (300 - ow) / 2, oy = (240 - oh) / 2;
      x.globalAlpha = .5; x.drawImage(cg, ox, oy, ow, oh); x.globalAlpha = 1;
      x.filter = 'blur(4px)'; x.globalCompositeOperation = 'lighter'; x.drawImage(cw, ox, oy, ow, oh); x.filter = 'none'; x.globalCompositeOperation = 'source-over';
      x.drawImage(ci, ox, oy, ow, oh);
    }
    p.querySelectorAll('[data-w]').forEach(b => b.onclick = () => {
      Sound.tap(); closeOv(ovWin); busy = false;
      const w = b.dataset.w;
      if (w === 'lv') { showLevels(); return; }
      if (isHear) { startHear(); return; }
      if (w === 'next') { if (lastItem) { showLevels(); return; } gotoItem(idx + 1); }
      else if (mode === 'dots') startDots(); else startItem(idx);
    });
    openOv(ovWin);
  }
  function openPicker() {
    const its = itemsOf(mode), pr = prog[mode] || {};
    const p = ovPick.querySelector('.panel');
    const small = mode === 'shp' || mode === 'dots';
    p.innerHTML = `<h3>${MODES.find(m => m.id === mode).t()}</h3>
      <div class="grid" ${mode === 'en' ? 'dir="ltr"' : ''}>${its.map((it, i) => `<button class="it ${small ? 'sm' : ''} ${i === idx ? 'cur' : ''}" data-i="${i}" ${mode === 'en' || (lang === 'en' && small) ? 'dir="ltr"' : ''}>${mode === 'dots' && !pr[it.key] ? '❔' : it.label}<i>${pr[it.key] ? '⭐'.repeat(pr[it.key]) : ''}</i></button>`).join('')}</div>
      <button class="btn alt" data-x="close">رجوع</button>`;
    p.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { Sound.tap(); closeOv(ovPick); gotoItem(+b.dataset.i); });
    p.querySelector('[data-x=close]').onclick = () => { Sound.tap(); closeOv(ovPick); };
    openOv(ovPick);
  }

  /* =====================================================================
     اختيار المستوى
     ===================================================================== */
  function drawMini(c, w, h, m) {
    c.clearRect(0, 0, w, h);
    const G = devGeom(w * .06, h * .05, w * .88, h * .88);
    drawDevice(c, G, { mini: true, noPen: false });
    const Sx = G.S;
    c.save(); rr(c, Sx.x, Sx.y, Sx.w, Sx.h, Sx.r); c.clip();
    const grad = rainbow(c, Sx.x, Sx.y, Sx.x + Sx.w * .45, Sx.y + Sx.h);
    c.shadowColor = 'rgba(150,255,200,.8)'; c.shadowBlur = 8; c.fillStyle = grad; c.strokeStyle = grad; c.lineCap = 'round'; c.lineJoin = 'round';
    const cx = Sx.x + Sx.w / 2, cy = Sx.y + Sx.h / 2, u = Math.min(Sx.w, Sx.h);
    c.textAlign = 'center'; c.textBaseline = 'middle';
    const txt = (t, size, dir = 'rtl') => { c.direction = dir; c.font = `900 ${u * size}px ${FONT}`; c.fillText(t, cx, cy + u * .04); };
    c.lineWidth = u * .045;
    if (m === 'free') {
      c.beginPath(); c.arc(cx - u * .28, cy - u * .18, u * .14, 0, TAU); c.stroke();
      for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; c.beginPath(); c.moveTo(cx - u * .28 + Math.cos(a) * u * .2, cy - u * .18 + Math.sin(a) * u * .2); c.lineTo(cx - u * .28 + Math.cos(a) * u * .26, cy - u * .18 + Math.sin(a) * u * .26); c.stroke(); }
      c.beginPath(); c.moveTo(Sx.x + u * .1, cy + u * .32); for (let x = 0; x <= 1; x += .05) c.lineTo(Sx.x + u * .1 + x * (Sx.w - u * .2), cy + u * .28 - Math.sin(x * 9) * u * .07); c.stroke();
      c.beginPath(); c.moveTo(cx + u * .12, cy + u * .12); c.lineTo(cx + u * .34, cy - u * .1); c.lineTo(cx + u * .56, cy + u * .12); c.stroke();
    } else if (m === 'ar') txt('أ ب', .58);
    else if (m === 'en') txt('Aa', .62, 'ltr');
    else if (m === 'num') txt(lang === 'ar' ? '١٢٣' : '123', .52, 'ltr');
    else if (m === 'shp') {
      c.beginPath(); c.arc(cx - u * .45, cy - u * .1, u * .17, 0, TAU); c.stroke();
      c.beginPath(); c.moveTo(cx, cy - u * .3); c.lineTo(cx - u * .17, cy + u * .05); c.lineTo(cx + u * .17, cy + u * .05); c.closePath(); c.stroke();
      c.beginPath(); c.rect(cx + u * .3, cy - u * .26, u * .32, u * .32); c.stroke();
      c.beginPath(); for (let x = 0; x <= 1.001; x += .1) c.lineTo(cx - u * .7 + x * u * 1.4, cy + u * .3 + (Math.round(x * 10) % 2 ? -1 : 1) * u * .07); c.stroke();
    } else if (m === 'hear') {
      c.shadowBlur = 0; c.font = `${u * .42}px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif`; c.fillText('👂', cx - u * .3, cy);
      c.shadowBlur = 8; c.beginPath(); c.arc(cx + u * .32, cy, u * .2, 0, TAU); c.stroke();
      c.beginPath(); for (let i = 0; i < 3; i++) { c.moveTo(cx - u * .02 + i * u * .06, cy - u * .1); c.arc(cx - u * .05, cy, u * .1 + i * u * .06, -.6, .6); } c.lineWidth = u * .025; c.stroke();
    } else if (m === 'dots') {
      const P = PICS[0].dots; c.shadowBlur = 4;
      c.beginPath(); P.slice(0, 6).forEach(([x, y], i) => { const px = cx + (x - 50) * u * .0085, py = cy + (y - 54) * u * .0085; i ? c.lineTo(px, py) : c.moveTo(px, py); }); c.stroke();
      c.fillStyle = '#fff'; P.forEach(([x, y]) => { c.beginPath(); c.arc(cx + (x - 50) * u * .0085, cy + (y - 54) * u * .0085, u * .028, 0, TAU); c.fill(); });
    }
    c.restore();
    // لمعة الشاشة
    c.save(); rr(c, Sx.x, Sx.y, Sx.w, Sx.h, Sx.r); c.clip();
    c.fillStyle = 'rgba(255,255,255,.07)'; c.beginPath(); c.moveTo(Sx.x, Sx.y); c.lineTo(Sx.x + Sx.w * .55, Sx.y); c.lineTo(Sx.x + Sx.w * .2, Sx.y + Sx.h); c.lineTo(Sx.x, Sx.y + Sx.h); c.closePath(); c.fill();
    c.restore();
  }
  function showLevels() {
    token++; busy = false; view = 'levels'; mode = null; T = null; DT = null; HR = null;
    if (pid !== null) { pid = null; cur = null; }
    root.classList.add('inlv');
    resEl.classList.remove('on'); [ovWin, ovPick, ovGal].forEach(closeOv);
    const cards = root.querySelector('.cards');
    cards.innerHTML = MODES.map((m, i) => {
      const st = modeStars(m.id);
      const sb = m.id === 'free' ? `🖼️ ${dg(store.get('magicpadGallery', []).length)}` : m.id === 'hear' ? [0, 1, 2].map(k => k < prog.hear ? '⭐' : '☆').join('') : `⭐ ${dg(st.got)}/${dg(st.max)}`;
      return `<button class="card" data-m="${m.id}" style="--a:${m.col}"><span class="num">${dg(i + 1)}</span><canvas width="340" height="272"></canvas><h2>${m.t()}</h2><p>${m.d()}</p><span class="sb">${sb}</span></button>`;
    }).join('');
    cards.querySelectorAll('canvas').forEach((cv, i) => { const x = cv.getContext('2d'); try { drawMini(x, cv.width, cv.height, MODES[i].id); } catch (e) { console.warn(e); } });
    cards.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { Sound.tap(); openMode(b.dataset.m); });
    root.querySelector('.lvs').textContent = `⭐ ${dg(totalStars())}  ·  ${App.g('ارسمي وتعلّمي', 'ارسم وتعلّم')} ✏️`;
    const hc = root.querySelector('.lvh canvas'), hx = hc.getContext('2d'); hx.clearRect(0, 0, 148, 192);
    const G = devGeom(8, 8, 132, 176); drawDevice(hx, G, { mini: true });
    hx.save(); rr(hx, G.S.x, G.S.y, G.S.w, G.S.h, G.S.r); hx.clip(); const gr = rainbow(hx, G.S.x, G.S.y, G.S.x + 40, G.S.y + G.S.h);
    hx.strokeStyle = gr; hx.lineWidth = 5; hx.lineCap = 'round'; hx.shadowColor = '#9ff'; hx.shadowBlur = 6;
    hx.beginPath(); for (let i = 0; i <= 60; i++) { const t = i / 60 * TAU * 1.6; hx.lineTo(G.S.x + G.S.w / 2 + Math.cos(t) * (10 + i * .55), G.S.y + G.S.h / 2 + Math.sin(t) * (10 + i * .55)); } hx.stroke(); hx.restore();
    lvEl.scrollTop = 0;
    uiFrom(cards.children, { y: 40, scale: .85, autoAlpha: 0, duration: .5, stagger: .06, ease: 'back.out(1.7)' });
    stopLoop();
  }
  function openMode(m) {
    mode = m; view = 'pad'; root.classList.remove('inlv');
    buildTools();
    layout();
    T = null; DT = null; HR = null; strokes = []; clearInk(); xg.clearRect(0, 0, S.w, S.h); xf.clearRect(0, 0, S.w, S.h);
    trashBtn.classList.remove('glow');
    if (m === 'free') {
      setTitle('رسم حر', '🎨 ' + App.g('ارسمي!', 'ارسم!')); setSeg(0);
      if (freeKeep) { strokes = freeKeep; redrawInk(); }
      freeKeep = strokes;
      msg(App.g('ارسمي بإصبعك ✏️ و🗑️ يمسح اللوح', 'ارسم بإصبعك ✏️ و🗑️ يمسح اللوح'));
    } else if (m === 'hear') startHear();
    else {
      const its = itemsOf(m);
      let i = store.get('magicpadIdx:' + m, -1);
      if (!(i >= 0 && i < its.length)) { i = its.findIndex(it => !(prog[m] || {})[it.key]); if (i < 0) i = 0; }
      idx = i;
      if (m === 'dots') startDots(); else startItem(i);
    }
    ensureLoop();
  }

  /* =====================================================================
     الجزيئات وحلقة الرسم
     ===================================================================== */
  const SPARK = ['#6CF7A0', '#FFE55A', '#FF8FB8', '#6FE0FF', '#A47CFF', '#FFFFFF'];
  function burst(x, y, n, sp = 1) {
    if (burstOff) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU, v = (40 + Math.random() * 120) * sp;
      parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, life: 0, max: .5 + Math.random() * .5, r: 2 + Math.random() * 4, col: SPARK[(Math.random() * SPARK.length) | 0], rot: Math.random() * TAU });
    }
    if (parts.length > 400) parts.splice(0, parts.length - 400);
    ensureLoop();
  }
  function sparkle(c, x, y, r) {
    c.beginPath();
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2; c.quadraticCurveTo(Math.cos(a + Math.PI / 4) * r * .2 + x, Math.sin(a + Math.PI / 4) * r * .2 + y, Math.cos(a + Math.PI / 2) * r + x, Math.sin(a + Math.PI / 2) * r + y); }
    c.closePath(); c.fill();
  }
  function ensureLoop() { if (!running && App.current === ID && view === 'pad') { running = true; lastT = performance.now(); raf = requestAnimationFrame(frame); } }
  function stopLoop() { running = false; cancelAnimationFrame(raf); }
  function frame(now) {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
    if (paused || document.hidden) return;
    idleT += dt;
    flashDecay(dt);
    const c = xf; c.clearRect(0, 0, S.w, S.h);
    // نبض نقطة البداية + مذنّب يرشد إلى الاتجاه عند الخمول
    if (T && !T.finished && !busy) {
      const ci2 = T.done.indexOf(0), s = T.st[ci2];
      if (s) {
        const [x, y] = s.dot ? [s.x, s.y] : s.pts[0], pulse = (now / 900) % 1;
        c.strokeStyle = `rgba(80,255,150,${.8 * (1 - pulse)})`; c.lineWidth = 3; c.beginPath(); c.arc(x, y, (s.dot ? s.r + 6 : 14) + pulse * 18, 0, TAU); c.stroke();
        if (idleT > 2.2 && !s.dot && pid === null) {
          const sp = 230, L = s.len, tt = ((idleT - 2.2) * sp) % (L + 160);
          if (tt <= L) {
            for (let k = 0; k < 10; k++) {
              const d = tt - k * 7; if (d < 0) break;
              const pi = Math.min(s.pts.length - 1, Math.round(d / 5)), [px, py] = s.pts[pi];
              c.fillStyle = `rgba(255,240,140,${.85 * (1 - k / 10)})`; c.beginPath(); c.arc(px, py, (T.inkW * .55 + 3) * (1 - k / 14), 0, TAU); c.fill();
            }
          }
        }
      }
    }
    // صِل النقاط: هالة حول النقطة التالية + أثر الإصبع
    if (DT && !DT.done) {
      const ti = dotsTarget();
      if (ti >= 0) {
        const [x, y] = DT.P[ti], pulse = (now / 800) % 1;
        c.strokeStyle = `rgba(255,228,92,${.9 * (1 - pulse)})`; c.lineWidth = 3; c.beginPath(); c.arc(x, y, 8 + pulse * 20, 0, TAU); c.stroke();
        if (DT.n > 0 && pid !== null && stylusAt) {
          const [ax, ay] = DT.P[(DT.n - 1) % DT.P.length];
          c.save(); c.setLineDash([6, 8]); c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(ax, ay); c.lineTo(stylusAt.x, stylusAt.y); c.stroke(); c.restore();
        }
      }
      for (let i = trail.length - 1; i >= 0; i--) { const t = trail[i]; t.a -= dt * 3; if (t.a <= 0) trail.splice(i, 1); }
      if (trail.length > 1) {
        c.lineCap = 'round'; c.lineJoin = 'round';
        for (let i = 1; i < trail.length; i++) { const a = trail[i - 1], b = trail[i]; c.strokeStyle = `rgba(200,255,230,${b.a * .5})`; c.lineWidth = 6 * b.a; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
      }
    }
    // جزيئات البريق
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.life += dt; if (p.life >= p.max) { parts.splice(i, 1); continue; }
      p.vy += 260 * dt; p.vx *= .98; p.x += p.vx * dt; p.y += p.vy * dt;
      const k = 1 - p.life / p.max; c.globalAlpha = k; c.fillStyle = p.col; sparkle(c, p.x, p.y, p.r * (0.6 + k));
    }
    c.globalAlpha = 1;
    // ومضة المسح
    if (wipeFx) {
      const edge = wipeFx.p * (S.h * 1.3) - S.h * .15, bh = S.h * .3;
      const g = c.createLinearGradient(0, edge - bh, 0, edge + bh * .35);
      g.addColorStop(0, 'rgba(120,255,200,0)'); g.addColorStop(.55, 'rgba(160,255,215,.25)'); g.addColorStop(.86, 'rgba(235,255,245,.75)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.fillRect(0, edge - bh, S.w, bh * 1.35);
      c.fillStyle = 'rgba(150,255,210,.07)'; c.fillRect(0, 0, S.w, Math.max(0, edge - bh));
    }
    if (flashA > 0) { c.fillStyle = `rgba(190,255,225,${flashA})`; c.fillRect(0, 0, S.w, S.h); }
    // رأس القلم المتوهّج أثناء الرسم
    if (stylusAt && pid !== null && mode !== 'dots') {
      const g = c.createRadialGradient(stylusAt.x, stylusAt.y, 0, stylusAt.x, stylusAt.y, 16);
      g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(stylusAt.x, stylusAt.y, 16, 0, TAU); c.fill();
    }
    // تلميح زر المسح عند امتلاء اللوح في الرسم الحر
    if (mode === 'free' && strokes.length > 25 && !trashBtn.classList.contains('glow')) trashBtn.classList.add('glow');
  }

  /* ---------- الإنجازات ---------- */
  function checkAch() {
    const all = m => itemsOfAll(m).every(k => (prog[m] || {})[k]);
    if (all('ar')) App.achieve('magicpad_letters');
    if (all('en')) App.achieve('magicpad_abc');
    if (all('dots')) App.achieve('magicpad_dots');
    const numsDone = AR_DIG.split('').every(k => prog.num[k]) || '0123456789'.split('').every(k => prog.num[k]);
    if (numsDone) App.achieve('magicpad_numbers');
    if (all('ar') && all('en') && all('shp') && all('dots') && numsDone && prog.hear > 0) App.achieve('magicpad_all');
  }
  function itemsOfAll(m) {
    if (m === 'ar') return AR_LETTERS.map(a => a[0]);
    if (m === 'en') { const a = []; for (let i = 0; i < 26; i++) { const C = String.fromCharCode(65 + i); a.push(C, C.toLowerCase()); } return a; }
    if (m === 'shp') return SHAPES.map(s => s.id);
    if (m === 'dots') return PICS.map(p => p.id);
    return [];
  }

  /* ---------- اللغة ---------- */
  function paintLang() { root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang)); }
  root.querySelectorAll('.lang button').forEach(b => b.onclick = () => {
    const l = b.dataset.l; if (l === lang) return;
    lang = l; store.set('magicpadLang', l); Sound.tap(); paintLang();
    uiFrom(b, { scale: 1.25, duration: .4, ease: 'back.out(3)' });
    if (view === 'levels') { showLevels(); return; }
    // تحديث الأرقام والأسماء في المستوى الحالي
    if (mode === 'num' || mode === 'shp' || mode === 'ar' || mode === 'en') { if (mode === 'num' || mode === 'shp') startItem(idx); else { drawGuide(); if (T) setTitle(`${MODES.find(m => m.id === mode).t()}  ${dg(idx + 1)}/${dg(itemsOf(mode).length)}`, T.it.label); } }
    else if (mode === 'dots') startDots(true);
    else if (mode === 'hear') startHear();
  });

  trashBtn.onclick = () => {
    if (view !== 'pad' || busy || wipeFx) return;
    if (mode === 'hear' && HR && HR.checked) { hearRound(); return; }
    if (mode === 'dots') { if (DT && !DT.done) wipe(() => { DT.n = 0; trail = []; drawDotsGuide(); setSeg(DT.pic.dots.length + (DT.pic.closed ? 1 : 0), 0); }); return; }
    if (T && T.finished) return;
    wipe(() => {
      strokes = []; if (mode === 'free') freeKeep = strokes;
      if (T) { traceRecount(); drawGuide(); }
      if (mode === 'hear') paintHearTools();
    });
  };

  window.addEventListener('resize', () => { if (App.current === ID) { clearTimeout(onResize.t); onResize.t = setTimeout(onResize, 120); } });
  window.addEventListener('keydown', e => {
    if (App.current !== ID || paused || view !== 'pad' || anyOv()) return;
    if ((e.key === 'z' && (e.ctrlKey || e.metaKey)) || e.key === 'Backspace') { e.preventDefault(); undo(); }
    else if (e.key === 'Delete') trashBtn.click();
    else if (e.key === ' ') { e.preventDefault(); sayCurrent(); }
    else if (mode !== 'free' && mode !== 'hear' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { if (!busy) gotoItem(idx + (e.key === 'ArrowLeft' ? 1 : -1)); }
    else if (mode === 'hear' && e.key === 'Enter') hearCheck();
  });

  /* =====================================================================
     التسجيل
     ===================================================================== */
  App.register({
    id: ID, title: 'اللوح السحري', icon2: '✏️', isNew: true,
    desc: () => App.g('ارسمي وتتبّعي الحروف على لوح LCD سحري', 'ارسم وتتبّع الحروف على لوح LCD سحري'),
    music: 'letters',
    help: () => [
      `✏️ ${App.g('ارسمي بإصبعك على اللوح', 'ارسم بإصبعك على اللوح')}، والخطوط تتوهّج بألوان قوس قزح مثل اللوح الحقيقي!`,
      '🗑️ زر السلة يمسح اللوح كله بومضة، و↩️ يمسح آخر خط فقط',
      `🔤 ${App.g('تتبّعي', 'تتبّع')} الحروف والأرقام والأشكال من الدائرة الخضراء ① مع اتجاه الأسهم`,
      `👂 ${App.g('اسمعي ثم ارسمي', 'اسمع ثم ارسم')}، و🔢 ${App.g('صِلي', 'صِل')} النقاط بالترتيب لتظهر صورة مخفية`,
      '🌐 اختر اللغة من الأعلى: عربي / English'
    ],
    icon(c, s) {
      IK.bg(c, s, ['#9EE0FF', '#4C8DFF', '#2443C2'], { seed: 11 });
      IK.sticker(c, s, x => {
        x.save(); x.translate(s * .5, s * .52); x.rotate(-.12); x.translate(-s * .5, -s * .52);
        const G = devGeom(s * .22, s * .1, s * .56, s * .8); drawDevice(x, G, { mini: true });
        const Sx = G.S; x.save(); rr(x, Sx.x, Sx.y, Sx.w, Sx.h, Sx.r); x.clip();
        const gr = rainbow(x, Sx.x, Sx.y, Sx.x + Sx.w * .5, Sx.y + Sx.h);
        x.strokeStyle = gr; x.lineWidth = s * .03; x.lineCap = 'round'; x.lineJoin = 'round'; x.shadowColor = 'rgba(160,255,210,.9)'; x.shadowBlur = 6;
        const cx = Sx.x + Sx.w / 2, cy = Sx.y + Sx.h * .45, k = Sx.w * .026;
        x.beginPath(); for (let i = 0; i <= 40; i++) { const t = i / 40 * TAU, hx = 16 * Math.pow(Math.sin(t), 3), hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)); i ? x.lineTo(cx + hx * k, cy + hy * k) : x.moveTo(cx + hx * k, cy + hy * k); } x.stroke();
        x.beginPath(); x.moveTo(Sx.x + Sx.w * .12, Sx.y + Sx.h * .86); for (let i = 0; i <= 20; i++) x.lineTo(Sx.x + Sx.w * (.12 + i * .038), Sx.y + Sx.h * (.86 - Math.sin(i * .9) * .05)); x.stroke();
        x.restore(); x.restore();
        // القلم
        x.save(); x.translate(s * .8, s * .62); x.rotate(-1.1); drawPen(x, -s * .26, 0, s * .52, s * .07); x.restore();
      }, { line: 4 });
    },
    best() { try { const p = loadProg(), n = ['ar', 'en', 'num', 'shp', 'dots'].reduce((a, m) => a + Object.values(p[m]).reduce((x, y) => x + y, 0), 0) + (p.hear || 0); return n ? `⭐ ${n}` : ''; } catch (e) { return ''; } },
    enter() {
      lang = store.get('magicpadLang', 'ar') === 'en' ? 'en' : 'ar'; paintLang();
      prog = loadProg(); paused = false; busy = false; freeKeep = null;
      ensureFont();
      showLevels();
    },
    leave() { stopLoop(); token++; pid = null; cur = null; busy = false; if (window.gsap) gsap.killTweensOf(cg); [ovWin, ovPick, ovGal].forEach(closeOv); },
    /** للاختبار الآلي فقط: مسارات الدليل الحالية بإحداثيات الشاشة */
    _dbg() { const r = scr.getBoundingClientRect(); return { x: r.left, y: r.top, w: S.w, h: S.h, mode, idx, view, tol: T && T.tol, st: T && T.st.map(s => s.dot ? { dot: 1, x: s.x, y: s.y } : { pts: s.pts }), dots: DT && DT.P, prog }; },
    pause() { paused = true; },
    resume() { paused = false; lastT = performance.now(); },
    back() {
      const o = anyOv(); if (o) { closeOv(o); busy = false; if (o === ovWin) { if (mode === 'hear') showLevels(); } return true; }
      if (view === 'pad') { showLevels(); return true; }
      return false;
    }
  });
})();
