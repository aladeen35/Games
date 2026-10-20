/* =====================================================================
   أكمل النمط — خرزات لامعة على خيط: أكمل النمط فيلبس البطريق العقد ويرقص
   (ثنائية اللغة: أسماء الألوان والأشكال والفواكه بالعربية أو الإنجليزية)
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'pattern';
  const TAU = Math.PI * 2;
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const FONT = '"Baloo Bhaijaan 2",system-ui,"Segoe UI",Tahoma,sans-serif';
  const ROUNDS = 4;

  /* ---------- الكلمات التعليمية (عربي / إنجليزي) ---------- */
  const COLS = {
    red:    { ar: 'أحمر',   en: 'Red',    c: ['#FF4D5A', '#FFB1B6', '#B81E2D'] },
    orange: { ar: 'برتقالي', en: 'Orange', c: ['#FF9524', '#FFD199', '#C25500'] },
    yellow: { ar: 'أصفر',   en: 'Yellow', c: ['#FFD02B', '#FFF3A6', '#CF9200'] },
    green:  { ar: 'أخضر',   en: 'Green',  c: ['#3FC954', '#B4F5BC', '#14853A'] },
    blue:   { ar: 'أزرق',   en: 'Blue',   c: ['#3A86FF', '#B3D3FF', '#1648B8'] },
    purple: { ar: 'بنفسجي', en: 'Purple', c: ['#9A5BF5', '#DCC7FF', '#5A27BA'] },
    pink:   { ar: 'وردي',   en: 'Pink',   c: ['#FF66B2', '#FFC7E3', '#C82A7C'] }
  };
  const SHAPES = {
    circle:   { ar: 'دائرة', en: 'Circle' },
    square:   { ar: 'مربع',  en: 'Square' },
    triangle: { ar: 'مثلث',  en: 'Triangle' },
    star:     { ar: 'نجمة',  en: 'Star' },
    heart:    { ar: 'قلب',   en: 'Heart' },
    rhombus:  { ar: 'معين',  en: 'Diamond' }
  };
  const FRUITS = {
    '🍎': { ar: 'تفاحة',   en: 'Apple',      c: '#FF4D5A' },
    '🍌': { ar: 'موزة',    en: 'Banana',     c: '#FFD02B' },
    '🍇': { ar: 'عنب',     en: 'Grapes',     c: '#9A5BF5' },
    '🍓': { ar: 'فراولة',  en: 'Strawberry', c: '#FF4D5A' },
    '🍊': { ar: 'برتقالة', en: 'Orange',     c: '#FF9524' },
    '🍋': { ar: 'ليمونة',  en: 'Lemon',      c: '#FFD02B' },
    '🍉': { ar: 'بطيخ',    en: 'Watermelon', c: '#3FC954' },
    '🍒': { ar: 'كرز',     en: 'Cherries',   c: '#FF4D5A' },
    '🍐': { ar: 'كمثرى',   en: 'Pear',       c: '#3FC954' },
    '🥝': { ar: 'كيوي',    en: 'Kiwi',       c: '#3FC954' },
    '🍑': { ar: 'خوخ',     en: 'Peach',      c: '#FF9524' }
  };
  const SIZES = {
    s: { ar: 'صغير',  en: 'Small',  k: .6 },
    m: { ar: 'متوسط', en: 'Medium', k: .8 },
    l: { ar: 'كبير',  en: 'Big',    k: 1.04 },
    n: { k: .94 }
  };

  /* ---------- المستويات ---------- */
  const LEVELS = [
    { ic: '🔴', k: 'bead',  pats: ['AB'],                 b: [1, 1], opts: 2 },
    { ic: '🟡', k: 'bead',  pats: ['AB'],                 b: [1, 2], opts: 3 },
    { ic: '🟢', k: 'bead',  pats: ['AAB'],                b: [1, 2], opts: 3 },
    { ic: '🔵', k: 'bead',  pats: ['ABB'],                b: [1, 2], opts: 3 },
    { ic: '🟣', k: 'bead',  pats: ['ABC'],                b: [1, 2], opts: 3 },
    { ic: '🧱', k: 'block', pats: ['AB', 'AAB'],          b: [1, 2], opts: 3 },
    { ic: '🟧', k: 'block', pats: ['ABC', 'ABB'],         b: [2, 2], opts: 4 },
    { ic: '🍓', k: 'fruit', pats: ['AB', 'AAB'],          b: [1, 2], opts: 3 },
    { ic: '🍌', k: 'fruit', pats: ['ABC', 'ABB'],         b: [2, 2], opts: 4 },
    { ic: '⭐', k: 'shape', pats: ['AB', 'ABC'],          b: [1, 2], opts: 3 },
    { ic: '⚪', k: 'size',  pats: ['AB', 'AAB', 'ABB'],   b: [1, 2], opts: 3 },
    { ic: '📈', k: 'grow',  pats: ['ABC'],                b: [1, 2], opts: 3 },
    { ic: '🧿', k: 'bead',  pats: ['AABB', 'ABAC'],       b: [2, 2], opts: 4, mid: true },
    { ic: '🔷', k: 'shape', pats: ['AABB', 'ABCD', 'ABB'], b: [2, 3], opts: 4, mid: true },
    { ic: '🍒', k: 'fruit', pats: ['ABCD', 'AABB'],       b: [2, 3], opts: 4, mid: true },
    { ic: '🎨', k: 'mix',   pats: ['AB', 'ABC', 'AAB'],   b: [2, 3], opts: 4, mid: true },
    { ic: '🏆', k: 'any',   pats: ['ABCD', 'AABB', 'ABAC', 'ABBC'], b: [2, 3], opts: 4, mid: true }
  ];

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h == null ? w : h)); return c; };
  const hex2 = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; };
  const mix = (a, b, t) => { const A = hex2(a), B = hex2(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); };
  const rgba = (h, a) => { const [r, g, b] = hex2(h); return `rgba(${r},${g},${b},${a})`; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const RESF = () => Math.min(3, Math.max(1, window.devicePixelRatio || 1));
  const AR_D = '٠١٢٣٤٥٦٧٨٩';
  let lang = 'ar';
  const num = n => lang === 'ar' ? String(n).replace(/\d/g, d => AR_D[d]) : String(n);
  const loadProg = () => { const p = store.get('patternProg', null) || {}; return { unlocked: Math.max(1, p.unlocked || 1), stars: p.stars || {} }; };

  /* صورة الإيموجي متمركزة بدقّة داخل مربع ضلعه size (بكسلات الدقة res) */
  function emojiCanvas(e, size, res) {
    const P = 2 * Math.ceil(size * .75 * res), c = mk(P, P), x = c.getContext('2d');
    x.direction = 'ltr'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    let fs = size * res;
    x.font = `${fs}px ${EMOJI_FONT}`;
    let m = x.measureText(e);
    const bw = m2 => (m2.actualBoundingBoxLeft || 0) + (m2.actualBoundingBoxRight || m2.width), bh = m2 => (m2.actualBoundingBoxAscent || fs * .8) + (m2.actualBoundingBoxDescent || fs * .2);
    fs *= Math.min(1.4, size * res / Math.max(bw(m), bh(m), 1));
    x.font = `${fs}px ${EMOJI_FONT}`; m = x.measureText(e);
    const L = m.actualBoundingBoxLeft || 0, R = m.actualBoundingBoxRight || m.width;
    const A = m.actualBoundingBoxAscent || fs * .8, D = m.actualBoundingBoxDescent || fs * .2;
    x.fillText(e, Math.round((P - (L + R)) / 2 + L), Math.round((P - (A + D)) / 2 + A));
    return c;
  }
  /* هل يرسم الجهاز هذا الإيموجي بالألوان؟ (الأجهزة القديمة تعرض مربعًا فارغًا) */
  const emoOK = new Map();
  function emojiOK(e) {
    if (emoOK.has(e)) return emoOK.get(e);
    let ok = true;
    try {
      const c = mk(40, 40), x = c.getContext('2d', { willReadFrequently: true });
      x.font = `30px ${EMOJI_FONT}`; x.textBaseline = 'middle'; x.textAlign = 'center'; x.fillText(e, 20, 21);
      const d = x.getImageData(0, 0, 40, 40).data; let col = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 60) { const mx = Math.max(d[i], d[i + 1], d[i + 2]), mn = Math.min(d[i], d[i + 1], d[i + 2]); if (mx - mn > 40) col++; }
      ok = col > 25;
    } catch (er) { ok = true; }
    emoOK.set(e, ok); return ok;
  }

  /* ---------- العناصر ---------- */
  const ikey = it => it.k + '|' + (it.col || '') + '|' + (it.shp || '') + '|' + (it.emo || '') + '|' + (it.sz || 'n');
  const same = (a, b) => ikey(a) === ikey(b);
  const szk = it => SIZES[it.sz || 'n'].k;
  function nameOf(it) {
    if (it.k === 'fruit') return FRUITS[it.emo][lang];
    if (it.k === 'shape') return SHAPES[it.shp][lang];
    const c = COLS[it.col][lang];
    if (it.sz && it.sz !== 'n') {
      if (it.solo) return SIZES[it.sz][lang];
      return lang === 'ar' ? c + ' ' + SIZES[it.sz].ar : SIZES[it.sz].en + ' ' + c;
    }
    return c;
  }
  const colorOf = it => it.k === 'fruit' ? FRUITS[it.emo].c : COLS[it.col].c[0];

  /* ---------- رسم القطع (خرزة / مكعب / شكل / فاكهة) ---------- */
  function paintBead(x, col, r, res) {
    const [b, l, d] = COLS[col].c, rx = r * 1.05, ry = r * .97;
    x.save(); x.shadowColor = 'rgba(40,20,90,.34)'; x.shadowBlur = r * .3 * res; x.shadowOffsetY = r * .14 * res;
    x.fillStyle = d; x.beginPath(); x.ellipse(0, 0, rx, ry, 0, 0, TAU); x.fill(); x.restore();
    let g = x.createRadialGradient(-r * .34, -r * .4, r * .04, -r * .08, -r * .08, r * 1.2);
    g.addColorStop(0, mix(l, '#ffffff', .45)); g.addColorStop(.22, l); g.addColorStop(.52, b); g.addColorStop(.86, mix(b, d, .6)); g.addColorStop(1, d);
    x.fillStyle = g; x.beginPath(); x.ellipse(0, 0, rx, ry, 0, 0, TAU); x.fill();
    x.save(); x.beginPath(); x.ellipse(0, 0, rx, ry, 0, 0, TAU); x.clip();
    g = x.createRadialGradient(r * .22, r * 1.08, 0, r * .22, r * 1.08, r * .8);
    g.addColorStop(0, rgba(l, .8)); g.addColorStop(1, rgba(l, 0)); x.fillStyle = g; x.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4);
    // نفق الخيط على الجانبين
    for (const s of [-1, 1]) { x.fillStyle = rgba(d, .45); x.beginPath(); x.ellipse(s * rx * .97, 0, r * .07, r * .15, 0, 0, TAU); x.fill(); }
    x.restore();
    x.save(); x.translate(-r * .36, -r * .45); x.rotate(-.6);
    g = x.createRadialGradient(0, 0, 0, 0, 0, r * .36); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.55, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.scale(1, .56); x.fillStyle = g; x.beginPath(); x.arc(0, 0, r * .36, 0, TAU); x.fill(); x.restore();
    x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); x.ellipse(-r * .42, -r * .5, r * .11, r * .065, -.6, 0, TAU); x.fill();
    x.fillStyle = 'rgba(255,255,255,.5)'; x.beginPath(); x.arc(r * .46, r * .34, r * .06, 0, TAU); x.fill();
    x.lineWidth = Math.max(.8, r * .035); x.strokeStyle = rgba(d, .5); x.beginPath(); x.ellipse(0, 0, rx, ry, 0, 0, TAU); x.stroke();
  }
  function paintBlock(x, col, r, res) {
    const [b, l, d] = COLS[col].c, a = r * 1.46, dp = r * .3, rad = a * .2;
    const fx = -a / 2 - dp * .45, fy = -a / 2 + dp * .45;
    const eg = x.createLinearGradient(0, fy - dp, 0, fy + a);
    eg.addColorStop(0, mix(l, '#ffffff', .25)); eg.addColorStop(.22, mix(b, l, .35)); eg.addColorStop(1, mix(d, '#000000', .18));
    x.save(); x.shadowColor = 'rgba(40,20,90,.34)'; x.shadowBlur = r * .3 * res; x.shadowOffsetY = r * .14 * res;
    x.fillStyle = eg; x.beginPath(); x.roundRect(fx + dp, fy - dp, a, a, rad); x.fill(); x.restore();
    const st = Math.max(4, Math.ceil(dp * res * 1.4));
    x.fillStyle = eg;
    for (let i = st; i > 0; i--) { const o = dp * i / st; x.beginPath(); x.roundRect(fx + o, fy - o, a, a, rad); x.fill(); }
    let g = x.createLinearGradient(fx, fy, fx + a * .4, fy + a);
    g.addColorStop(0, mix(b, l, .6)); g.addColorStop(.45, b); g.addColorStop(1, mix(b, d, .5));
    x.fillStyle = g; x.beginPath(); x.roundRect(fx, fy, a, a, rad); x.fill();
    x.lineWidth = a * .045; x.strokeStyle = 'rgba(255,255,255,.38)'; x.beginPath(); x.roundRect(fx + a * .09, fy + a * .09, a * .82, a * .82, rad * .6); x.stroke();
    x.strokeStyle = rgba(d, .25); x.beginPath(); x.roundRect(fx + a * .09, fy + a * .11, a * .82, a * .82, rad * .6); x.stroke();
    const hx = fx + a / 2, hy = fy + a / 2;
    x.fillStyle = rgba(d, .6); x.beginPath(); x.arc(hx, hy, a * .11, 0, TAU); x.fill();
    x.fillStyle = rgba(l, .7); x.beginPath(); x.arc(hx, hy + a * .02, a * .11, .15 * Math.PI, .85 * Math.PI); x.fill();
    x.fillStyle = 'rgba(255,255,255,.75)'; x.beginPath(); x.roundRect(fx + a * .15, fy + a * .13, a * .34, a * .085, a * .042); x.fill();
    x.fillStyle = 'rgba(255,255,255,.6)'; x.beginPath(); x.arc(fx + a * .58, fy + a * .17, a * .04, 0, TAU); x.fill();
    x.lineWidth = Math.max(.8, r * .03); x.strokeStyle = rgba(d, .5); x.beginPath(); x.roundRect(fx, fy, a, a, rad); x.stroke();
  }
  function rpoly(x, pts, rad) {
    const n = pts.length, s = [(pts[n - 1][0] + pts[0][0]) / 2, (pts[n - 1][1] + pts[0][1]) / 2];
    x.moveTo(s[0], s[1]);
    for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; x.arcTo(p[0], p[1], q[0], q[1], rad); }
    x.closePath();
  }
  function shapePath(x, k, r) {
    x.beginPath();
    switch (k) {
      case 'circle': x.arc(0, 0, r * .9, 0, TAU); break;
      case 'square': x.roundRect(-r * .78, -r * .78, r * 1.56, r * 1.56, r * .22); break;
      case 'triangle': rpoly(x, [[0, -r * .92], [r * .98, r * .74], [-r * .98, r * .74]], r * .2); break;
      case 'rhombus': rpoly(x, [[0, -r * .98], [r * .74, 0], [0, r * .98], [-r * .74, 0]], r * .14); break;
      case 'star': {
        const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, R = i % 2 ? r * .48 : r * .98; pts.push([Math.cos(a) * R, Math.sin(a) * R + r * .06]); }
        rpoly(x, pts, r * .1); break;
      }
      case 'heart':
        x.moveTo(0, r * .84);
        x.bezierCurveTo(-r * 1.3, r * .02, -r * .66, -r * 1.06, 0, -r * .46);
        x.bezierCurveTo(r * .66, -r * 1.06, r * 1.3, r * .02, 0, r * .84);
        x.closePath(); break;
    }
  }
  function paintShape(x, shp, col, r, res) {
    const [b, l, d] = COLS[col].c, dd = r * .2;
    x.save(); x.shadowColor = 'rgba(40,20,90,.34)'; x.shadowBlur = r * .28 * res; x.shadowOffsetY = r * .12 * res;
    x.translate(0, dd); x.fillStyle = mix(d, '#000000', .12); shapePath(x, shp, r); x.fill(); x.restore();
    const st = Math.max(4, Math.ceil(dd * res));
    for (let i = st; i > 0; i--) { x.save(); x.translate(0, dd * i / st); x.fillStyle = i > st / 2 ? mix(d, '#000000', .08) : d; shapePath(x, shp, r); x.fill(); x.restore(); }
    let g = x.createRadialGradient(-r * .3, -r * .42, r * .04, 0, 0, r * 1.15);
    g.addColorStop(0, mix(l, '#ffffff', .4)); g.addColorStop(.3, l); g.addColorStop(.62, b); g.addColorStop(1, mix(b, d, .55));
    x.fillStyle = g; shapePath(x, shp, r); x.fill();
    x.save(); shapePath(x, shp, r); x.clip();
    x.lineWidth = r * .16; x.strokeStyle = 'rgba(255,255,255,.32)'; x.translate(0, r * .04); shapePath(x, shp, r); x.stroke(); x.restore();
    x.save(); x.translate(-r * .3, -r * .38); x.rotate(-.6);
    g = x.createRadialGradient(0, 0, 0, 0, 0, r * .3); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.scale(1, .55); x.fillStyle = g; x.beginPath(); x.arc(0, 0, r * .3, 0, TAU); x.fill(); x.restore();
    x.lineWidth = Math.max(.8, r * .035); x.strokeStyle = rgba(d, .55); shapePath(x, shp, r); x.stroke();
  }
  function paintFruit(x, emo, r, res) {
    const e = emojiCanvas(emo, r * 2.05, res);
    x.save(); x.shadowColor = 'rgba(40,20,90,.32)'; x.shadowBlur = r * .26 * res; x.shadowOffsetY = r * .12 * res;
    x.drawImage(e, -e.width / 2 / res, -e.height / 2 / res, e.width / res, e.height / res); x.restore();
  }
  /* صور مخبوزة مسبقًا بدقة عالية (حتى 3x) مع مقاسات ثابتة لتجنّب إعادة الخَبز أثناء الحركة */
  const BUCKETS = [10, 13, 16, 20, 24, 29, 35, 42, 50, 60, 72, 86];
  const SPR = new Map();
  function sprite(it, r) {
    const res = RESF(), rb = BUCKETS.find(v => v >= r) || BUCKETS[BUCKETS.length - 1];
    const key = ikey(it) + '|' + rb + '|' + res;
    let s = SPR.get(key); if (s) return s;
    const half = rb * 1.55, P = Math.ceil(half * 2 * res), c = mk(P, P), x = c.getContext('2d');
    x.setTransform(res, 0, 0, res, P / 2, P / 2);
    try {
      if (it.k === 'bead') paintBead(x, it.col, rb, res);
      else if (it.k === 'block') paintBlock(x, it.col, rb, res);
      else if (it.k === 'shape') paintShape(x, it.shp, it.col, rb, res);
      else paintFruit(x, it.emo, rb, res);
    } catch (er) { console.warn(er); }
    s = { c, half: P / 2 / res, rb };
    if (SPR.size > 400) SPR.clear();
    SPR.set(key, s); return s;
  }
  function drawItem(c, it, x, y, r, rot, sx, sy) {
    const s = sprite(it, r), k = r / s.rb, h = s.half * k;
    c.save(); c.translate(x, y); if (rot) c.rotate(rot); if (sx) c.scale(sx, sy);
    c.drawImage(s.c, -h, -h, h * 2, h * 2); c.restore();
  }

  /* ---------- البطريق ---------- */
  function drawPenguin(c, P, t) {
    const s = P.s;
    const hop = P.hop || 0;
    const sh = 1 - Math.min(.5, hop / s * 2.2);
    c.save(); c.fillStyle = 'rgba(70,60,140,.2)'; c.beginPath(); c.ellipse(P.x, P.y, s * .36 * sh, s * .065 * sh, 0, 0, TAU); c.fill(); c.restore();
    c.save(); c.translate(P.x, P.y - hop); c.rotate(P.tilt || 0); c.scale(P.sqx || 1, P.sqy || 1);
    // الأقدام
    for (const sd of [-1, 1]) {
      const lift = sd < 0 ? (P.footL || 0) : (P.footR || 0);
      c.save(); c.translate(sd * s * .13, -s * .02 - lift * s); c.rotate(sd * .12);
      const g = c.createLinearGradient(0, -s * .05, 0, s * .05); g.addColorStop(0, '#FFC04D'); g.addColorStop(1, '#F07A10');
      c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, s * .11, s * .045, 0, 0, TAU); c.fill(); c.restore();
    }
    // الجناحان
    for (const sd of [-1, 1]) {
      const fl = sd < 0 ? (P.flapL || 0) : (P.flapR || 0);
      c.save(); c.translate(sd * s * .3, -s * .55); c.rotate(sd * (.32 + fl));
      const g = c.createLinearGradient(-s * .08, 0, s * .08, 0); g.addColorStop(0, '#3A4AA2'); g.addColorStop(1, '#1E2768');
      c.fillStyle = g; c.beginPath(); c.ellipse(0, s * .15, s * .075, s * .2, 0, 0, TAU); c.fill(); c.restore();
    }
    // الجسم
    let g = c.createRadialGradient(-s * .12, -s * .74, s * .04, 0, -s * .45, s * .56);
    g.addColorStop(0, '#5D6FD0'); g.addColorStop(.45, '#33429A'); g.addColorStop(1, '#1A2158');
    c.fillStyle = g; c.beginPath(); c.ellipse(0, -s * .46, s * .35, s * .45, 0, 0, TAU); c.fill();
    c.save(); c.beginPath(); c.ellipse(0, -s * .46, s * .35, s * .45, 0, 0, TAU); c.clip();
    g = c.createRadialGradient(s * .34, -s * .32, 0, s * .34, -s * .32, s * .26); g.addColorStop(0, 'rgba(150,175,255,.45)'); g.addColorStop(1, 'rgba(150,175,255,0)');
    c.fillStyle = g; c.fillRect(-s, -s, s * 2, s); c.restore();
    // خصلة الرأس
    c.fillStyle = '#26307A'; c.beginPath(); c.moveTo(-s * .03, -s * .9); c.quadraticCurveTo(s * .02, -s * 1.0, s * .09, -s * .97); c.quadraticCurveTo(s * .03, -s * .95, s * .04, -s * .89); c.fill();
    // البطن والوجه
    g = c.createLinearGradient(0, -s * .66, 0, -s * .04); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#E7E9FA');
    c.fillStyle = g; c.beginPath(); c.ellipse(0, -s * .33, s * .25, s * .29, 0, 0, TAU); c.fill();
    c.beginPath(); c.arc(-s * .1, -s * .64, s * .135, 0, TAU); c.arc(s * .1, -s * .64, s * .135, 0, TAU); c.fill();
    c.beginPath(); c.ellipse(0, -s * .56, s * .2, s * .12, 0, 0, TAU); c.fill();
    // الخدود
    c.fillStyle = 'rgba(255,128,170,.55)';
    for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * s * .185, -s * .565, s * .045, s * .027, 0, 0, TAU); c.fill(); }
    // العيون
    const lx = (P.lookX || 0) * s * .018, ly = (P.lookY || 0) * s * .014;
    for (const sd of [-1, 1]) {
      const ex = sd * s * .1, ey = -s * .655;
      if (P.happy) {
        c.strokeStyle = '#1B1E3C'; c.lineWidth = s * .024; c.lineCap = 'round';
        c.beginPath(); c.arc(ex, ey + s * .025, s * .045, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
      } else {
        const bl = P.blink || 1;
        c.fillStyle = '#1B1E3C'; c.beginPath(); c.ellipse(ex + lx, ey + ly, s * .052, s * .064 * bl, 0, 0, TAU); c.fill();
        if (bl > .5) {
          c.fillStyle = '#fff'; c.beginPath(); c.arc(ex + lx - s * .016, ey + ly - s * .022, s * .019, 0, TAU); c.fill();
          c.beginPath(); c.arc(ex + lx + s * .017, ey + ly + s * .02, s * .008, 0, TAU); c.fill();
        }
        if (P.sad) { c.strokeStyle = '#1B1E3C'; c.lineWidth = s * .015; c.lineCap = 'round'; c.beginPath(); c.moveTo(ex - sd * s * .05, ey - s * .1); c.lineTo(ex + sd * s * .03, ey - s * .085); c.stroke(); }
      }
    }
    // المنقار
    g = c.createLinearGradient(0, -s * .62, 0, -s * .52); g.addColorStop(0, '#FFC24A'); g.addColorStop(1, '#F07A10');
    c.fillStyle = g; c.beginPath(); c.moveTo(-s * .055, -s * .598);
    c.quadraticCurveTo(0, -s * .64, s * .055, -s * .598); c.quadraticCurveTo(s * .015, -s * .53, 0, -s * .522); c.quadraticCurveTo(-s * .015, -s * .53, -s * .055, -s * .598); c.fill();
    if (P.happy) { c.fillStyle = '#E8475F'; c.beginPath(); c.ellipse(0, -s * .515, s * .025, s * .016, 0, 0, TAU); c.fill(); }
    // العقد
    if (P.neck && P.neck.length) drawNecklace(c, P.neck, s, 1);
    c.restore();
  }
  function neckGeom(n, s, rtl) {
    const cy = -s * .5, rx = s * .27, ry = s * .1, a0 = .1 * Math.PI, a1 = .9 * Math.PI;
    const len = (a1 - a0) * Math.sqrt((rx * rx + ry * ry) / 2);
    const rs = Math.min(s * .05, len / (Math.max(1, n) * 2.05));
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? .5 : i / (n - 1), a = rtl ? a0 + (a1 - a0) * t : a1 - (a1 - a0) * t;
      pts.push({ x: Math.cos(a) * rx, y: cy + Math.sin(a) * ry });
    }
    return { pts, rs, cy, rx, ry };
  }
  function drawNecklace(c, neck, s, alpha) {
    const g0 = neck.geom;
    c.save(); c.globalAlpha = alpha;
    c.strokeStyle = '#F4E3C3'; c.lineWidth = Math.max(1.4, s * .012);
    c.beginPath(); c.ellipse(0, g0.cy, g0.rx * 1.02, g0.ry * 1.05, 0, -.05, Math.PI + .05); c.stroke();
    neck.forEach((q, i) => drawItem(c, q.it, g0.pts[i].x, g0.pts[i].y, g0.rs * szk(q.it) / .94));
    c.restore();
  }

  /* ---------- الواجهة ---------- */
  App.css(`
  #pattern{background:#E7E3FF;overflow:hidden}
  #pattern canvas.pc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #pattern .ib{color:#6A4BC4}
  #pattern .ib.snd{color:#7A3E00}
  #pattern .lvbtn .cnt{background:#7B5CF0}
  #pattern .lang{display:flex;background:linear-gradient(180deg,#fff,#F3F0FB);border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;
    box-shadow:0 4px 0 rgba(60,30,90,.2),0 7px 12px rgba(60,30,90,.18)}
  #pattern .lang button{min-width:58px;padding:5px 12px;border-radius:99px;font-weight:900;font-size:17px;background:transparent;color:#6A4BC4;line-height:1.25;transition:transform .14s var(--press)}
  #pattern .lang button.on{background:linear-gradient(180deg,#B39CFF,#7B5CF0 70%);color:#fff;box-shadow:0 3px 0 #5134C4,inset 0 2px 0 rgba(255,255,255,.35);text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #pattern .lang button:active{transform:scale(.93)}
  #pattern .foot{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:10px;z-index:5;pointer-events:none;
    padding:4px max(14px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left))}
  #pattern .foot > *{pointer-events:auto}
  #pattern .say{width:58px;height:58px;flex:0 0 58px;font-size:27px}
  #pattern .prog{display:flex;gap:6px;background:rgba(255,255,255,.92);padding:8px 12px;border-radius:99px;border:3px solid #fff;direction:ltr;
    box-shadow:0 4px 0 rgba(60,30,90,.14),0 7px 12px rgba(60,30,90,.12)}
  #pattern .prog i{width:30px;height:13px;border-radius:99px;background:#DCD7EE;box-shadow:inset 0 2px 0 rgba(0,0,0,.08);transition:background .3s}
  #pattern .prog i.on{background:linear-gradient(#FFC660,#FF9124);box-shadow:0 2px 0 #D06A00,inset 0 2px 0 rgba(255,255,255,.45)}
  #pattern .prog i.cur{animation:ptcur 1.1s ease-in-out infinite}
  @keyframes ptcur{50%{background:#BFB3EC;transform:scaleY(1.2)}}
  #pattern .hint{top:auto}
  #pattern .hint span{background:#fff;color:#5B3FB8;border:3px solid #D6CCFF;box-shadow:0 3px 0 #B9A9F5}
  #pattern .panel{border-color:#D6CCFF;box-shadow:0 10px 0 #9A82F2,0 24px 44px rgba(40,10,90,.32),inset 0 0 0 3px #fff;color:#3E2A86;background:linear-gradient(180deg,#fff 0%,#fff 70%,#F3EFFF 100%)}
  #pattern .panel h3{color:#6A45E0;text-shadow:0 3px 0 #E3DBFF}
  #pattern .btn{background:linear-gradient(180deg,#B39CFF 0%,#8B6CF6 55%,#7350E8 100%);box-shadow:0 5px 0 #5134C4,0 9px 14px rgba(81,52,196,.3);text-shadow:0 2px 0 rgba(40,0,120,.25)}
  #pattern .btn:active{box-shadow:0 1px 0 #5134C4}
  #pattern .btn.alt{background:linear-gradient(180deg,#fff,#F5F2FF);color:#6A45E0;box-shadow:0 5px 0 #D6CCFF,0 8px 12px rgba(81,52,196,.14);border-color:#E6DFFF;text-shadow:none}
  #pattern .overlay{background:radial-gradient(circle at 50% 45%,rgba(60,30,140,.25),rgba(30,15,80,.5))}
  #pattern .lvp{width:min(94vw,440px);max-height:86vh;overflow-y:auto;touch-action:pan-y}
  #pattern .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:10px 0 12px}
  #pattern .lvb{position:relative;aspect-ratio:1;border-radius:22px;background:linear-gradient(180deg,#fff,#F1EDFF);border:3px solid #CDBFFF;box-shadow:0 5px 0 #A993F5,inset 0 2px 0 #fff;
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#4B2FA8;font-weight:900;padding:2px;transition:transform .14s var(--press)}
  #pattern .lvb:active{transform:translateY(3px) scale(1.04,.94);box-shadow:0 1px 0 #A993F5}
  #pattern .lvb .n{font-size:14px;position:absolute;top:2px;right:8px;opacity:.8}
  #pattern .lvb .e{font-size:27px;line-height:1.15}
  #pattern .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:12px}
  #pattern .lvb .s i{font-style:normal}
  #pattern .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #pattern .lvb.cur{border-color:#FF9124;box-shadow:0 5px 0 #D06A00,inset 0 2px 0 #fff}
  #pattern .lvb.lock{background:linear-gradient(#ECE9F5,#DAD5EA);border-color:#D0CBE0;box-shadow:0 5px 0 #B9B3CC;color:#8A84A0}
  #pattern .lvb.lock .e{filter:grayscale(1);opacity:.35;font-size:22px}
  #pattern .lvb.lock::after{content:'🔒';position:absolute;font-size:19px;bottom:3px}
  `);
  const root = App.section(ID, `
    <canvas class="pc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🔢<span class="cnt">1</span></button>
      <span class="grow"></span>
      <div class="lang" role="group" aria-label="لغة الكلمات"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="hint"><span class="hintT"></span></div>
    <div class="foot">
      <button class="ib snd say" aria-label="استمع إلى النمط">🔊</button>
      <span class="grow"></span>
      <div class="prog"></div>
    </div>
    <div class="overlay" id="ptLv"><div class="panel lvp"><h3>🔢 المستويات</h3><div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="ptWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.pc');
  const bar = root.querySelector('.bar'), foot = root.querySelector('.foot');
  const hintEl = root.querySelector('.hint'), hintT = root.querySelector('.hintT');
  const lvOv = root.querySelector('#ptLv'), winOv = root.querySelector('#ptWin');
  const progEl = root.querySelector('.prog');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, portrait = true;
  let bgLayer = null, scene = null, strR = null, trayR = null, card = null, strCard = null;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, ri = 0, mistakes = 0, phase = 'play', phaseT = 0;
  let cur = null, slots = [], choices = [], flyers = [], parts = [], rings = [], bubbles = [], flakes = [];
  let drag = null, shake = 0, R = 30, CR = 34, tq = [], wear = null, dance = 0, hintOn = false;
  let geo = null; // هندسة الخيط
  const PG = { x: 0, y: 0, s: 120, hop: 0, tilt: 0, sqx: 1, sqy: 1, flapL: 0, flapR: 0, blink: 1, happy: 0, sad: 0, lookX: 0, lookY: 0, neck: null, jump: 0, vy: 0, blinkT: 2, shakeT: 0 };
  const rtl = () => lang === 'ar';
  const later = (sec, fn) => tq.push({ t: sec, fn });

  /* ---------- التخطيط ---------- */
  function bestGrid(n, w, h) {
    let best = { cols: 1, rows: n, cell: 0 };
    for (let cols = 1; cols <= n; cols++) {
      const rows = Math.ceil(n / cols), cell = Math.min(w / cols, h / rows * 1.1);
      if (cell > best.cell + .5) best = { cols, rows, cell };
    }
    return best;
  }
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const top = bar.getBoundingClientRect().bottom + 2;
    const bottom = foot.getBoundingClientRect().top - 2;
    const avail = bottom - top;
    portrait = W / H < 1.1;
    if (portrait) {
      const cw = Math.min(W - 20, 640), x0 = (W - cw) / 2;
      const sh = Math.round(avail * .39), stH = Math.round(avail * .25);
      scene = { x: x0, y: top, w: cw, h: sh };
      strR = { x: x0, y: top + sh, w: cw, h: stH };
      trayR = { x: x0, y: top + sh + stH, w: cw, h: avail - sh - stH };
      PG.s = Math.min(sh * .8, 230); PG.x = W / 2; PG.y = scene.y + sh - 6;
    } else {
      const aw = Math.min(W - 28, 1180), x0 = (W - aw) / 2, lw = Math.round(aw * .32);
      scene = { x: x0, y: top, w: lw, h: avail };
      const rx = x0 + lw + 10, rw = aw - lw - 10;
      strR = { x: rx, y: top, w: rw, h: Math.round(avail * .44) };
      trayR = { x: rx, y: top + strR.h, w: rw, h: avail - strR.h };
      PG.s = Math.min(avail * .62, lw * 1.05, 330); PG.x = x0 + lw / 2; PG.y = top + avail * .88;
    }
    strCard = { x: strR.x + 4, y: strR.y + 6, w: strR.w - 8, h: strR.h - 18 };
    card = { x: trayR.x + 4, y: trayR.y + 12, w: trayR.w - 8, h: trayR.h - 22 };
    hintEl.style.top = (card.y - 17) + 'px';
    hintEl.style.left = card.x + 'px'; hintEl.style.right = (W - card.x - card.w) + 'px';
    buildBg();
    if (cur) placeRound();
  }
  /* مواقع الخرزات على الخيط (منحنى متدلٍّ) ومواقع الخيارات في الصينية */
  function placeRound() {
    const n = slots.length;
    const x0 = strCard.x + 34, x1 = strCard.x + strCard.w - 34, dx = (x1 - x0) / n;
    R = Math.max(12, Math.min(dx * .47 / 1.05, strCard.h * .3, 46));
    const yTop = strCard.y + strCard.h * .36, sag = Math.min(strCard.h * .28, (x1 - x0) * .07);
    geo = { x0, x1, yTop, sag };
    slots.forEach((sl, i) => {
      const xx = rtl() ? x1 - dx * (i + .5) : x0 + dx * (i + .5);
      const t = (xx - x0) / (x1 - x0);
      sl.x = xx; sl.y = yTop + sag * (1 - Math.pow(2 * t - 1, 2));
      sl.rot = Math.atan(-sag * 4 * (2 * t - 1) / (x1 - x0)) * (sl.it.k === 'block' ? 1 : 0);
    });
    const m = choices.length, inner = { x: card.x + 16, y: card.y + 16, w: card.w - 32, h: card.h - 30 };
    const gr = bestGrid(m, inner.w, inner.h);
    CR = Math.max(16, Math.min(gr.cell * .36, inner.h / gr.rows * .36, 58));
    const cw = inner.w / gr.cols, ch = inner.h / gr.rows;
    choices.forEach((c, i) => {
      const row = Math.floor(i / gr.cols), inRow = row === gr.rows - 1 ? m - row * gr.cols : gr.cols, col = i % gr.cols;
      const off = (gr.cols - inRow) * cw / 2;
      const cxp = inner.x + off + (col + .5) * cw;
      c.x = rtl() ? inner.x + inner.w - (cxp - inner.x) : cxp; c.y = inner.y + (row + .5) * ch;
      c.r = CR * szk(c.it) / 1.04;
    });
    // البطريق: نقاط العقد
    if (PG.neck) PG.neck.geom = neckGeom(PG.neck.length, PG.s, rtl());
  }

  /* ---------- الخلفية الثابتة ---------- */
  function tree(x, cx, by, h, seed) {
    x.fillStyle = '#9C6B43'; x.beginPath(); x.roundRect(cx - h * .05, by - h * .16, h * .1, h * .17, h * .03); x.fill();
    const tiers = 3;
    for (let i = 0; i < tiers; i++) {
      const tb = by - h * .12 - i * h * .26, w = h * (.5 - i * .1), th = h * .42;
      const g = x.createLinearGradient(cx - w, 0, cx + w, 0); g.addColorStop(0, '#6FE0C4'); g.addColorStop(.55, '#2FB79C'); g.addColorStop(1, '#1D8E7B');
      x.save(); x.shadowColor = 'rgba(20,80,70,.25)'; x.shadowBlur = 6 * dpr; x.shadowOffsetY = 3 * dpr;
      x.fillStyle = g; x.beginPath(); rpoly(x, [[cx, tb - th], [cx + w, tb], [cx - w, tb]], h * .08); x.fill(); x.restore();
      x.fillStyle = 'rgba(255,255,255,.22)'; x.beginPath(); rpoly(x, [[cx, tb - th + h * .03], [cx - w * .15, tb - th * .35], [cx - w * .75, tb - h * .02]], h * .05); x.fill();
    }
  }
  function cardRect(x, r, col, dark, rad) {
    x.save(); x.shadowColor = 'rgba(60,40,120,.28)'; x.shadowBlur = 16 * dpr; x.shadowOffsetY = 8 * dpr;
    x.fillStyle = dark; x.beginPath(); x.roundRect(r.x, r.y + 7, r.w, r.h, rad); x.fill(); x.restore();
    x.fillStyle = dark; x.beginPath(); x.roundRect(r.x, r.y + 7, r.w, r.h, rad); x.fill();
    x.fillStyle = col; x.beginPath(); x.roundRect(r.x, r.y, r.w, r.h, rad); x.fill();
    const g = x.createLinearGradient(0, r.y, 0, r.y + r.h); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#FBF8FF');
    x.fillStyle = g; x.beginPath(); x.roundRect(r.x + 6, r.y + 6, r.w - 12, r.h - 12, rad - 6); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 2; x.beginPath(); x.roundRect(r.x + 2.5, r.y + 2.5, r.w - 5, r.h - 5, rad - 2); x.stroke();
  }
  function buildBg() {
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const hz = portrait ? scene.y + scene.h * .52 : scene.y + scene.h * .5;
    let g = x.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, '#B7AEFF'); g.addColorStop(.6, '#D9D3FF'); g.addColorStop(1, '#F1EEFF');
    x.fillStyle = g; x.fillRect(0, 0, W, hz + 2);
    g = x.createRadialGradient(W * .82, 0, 0, W * .82, 0, Math.max(W, H) * .5); g.addColorStop(0, 'rgba(255,255,255,.75)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, W, hz);
    const R0 = rng(31);
    for (let i = 0; i < 4; i++) IK.cloud(x, R0() * W - 40, 40 + R0() * Math.max(30, hz - 120), 90 + R0() * 80, 'rgba(255,255,255,.85)', 'rgba(170,160,235,.35)');
    // جبال بعيدة
    x.fillStyle = '#E2DEFA';
    x.beginPath(); x.moveTo(0, hz);
    for (let xx = 0; xx <= W + 40; xx += 40) x.lineTo(xx, hz - 30 - Math.abs(Math.sin(xx * .006 + 1)) * 50);
    x.lineTo(W, hz); x.fill();
    // أشجار خلفية
    const R1 = rng(7), nT = Math.ceil(W / 70);
    for (let i = 0; i < nT; i++) { const cx = (i + R1() * .6) * W / nT; tree(x, cx, hz + 4, 50 + R1() * 40, i); }
    // الثلج
    g = x.createLinearGradient(0, hz, 0, H); g.addColorStop(0, '#FAFBFF'); g.addColorStop(.4, '#EDEEFC'); g.addColorStop(1, '#DCDDF6');
    x.fillStyle = g; x.beginPath(); x.moveTo(0, hz + 10);
    for (let xx = 0; xx <= W + 30; xx += 30) x.quadraticCurveTo(xx - 15, hz - 4 + Math.sin(xx * .02) * 4, xx, hz + 6);
    x.lineTo(W, H); x.lineTo(0, H); x.fill();
    // كوخ ثلجي
    const ix = portrait ? Math.max(scene.x + 50, PG.x - PG.s * .95) : scene.x + scene.w * .2, iy = portrait ? hz + 18 : PG.y - PG.s * .02, ir = portrait ? Math.min(70, scene.h * .26) : Math.min(110, scene.w * .26);
    x.save(); x.shadowColor = 'rgba(90,80,170,.25)'; x.shadowBlur = 10 * dpr; x.shadowOffsetY = 4 * dpr;
    g = x.createLinearGradient(0, iy - ir, 0, iy); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#D8DBF5');
    x.fillStyle = g; x.beginPath(); x.ellipse(ix, iy, ir, ir * .78, 0, Math.PI, 0); x.closePath(); x.fill(); x.restore();
    x.save(); x.beginPath(); x.ellipse(ix, iy, ir, ir * .78, 0, Math.PI, 0); x.closePath(); x.clip();
    x.strokeStyle = 'rgba(150,150,210,.35)'; x.lineWidth = 1.5;
    for (let k = 1; k < 4; k++) { const yy = iy - ir * .78 * k / 4; x.beginPath(); x.moveTo(ix - ir, yy); x.lineTo(ix + ir, yy); x.stroke();
      for (let j = -4; j <= 4; j++) { const xx = ix + j * ir * .32 + (k % 2) * ir * .16; x.beginPath(); x.moveTo(xx, yy); x.lineTo(xx, yy + ir * .78 / 4); x.stroke(); } }
    x.restore();
    x.fillStyle = '#5B5A9A'; x.beginPath(); x.ellipse(ix + ir * .3, iy, ir * .24, ir * .32, 0, Math.PI, 0); x.fill();
    // كتل ثلج صغيرة
    const R2 = rng(13);
    for (let i = 0; i < 8; i++) { const sx = R2() * W, sy = hz + 20 + R2() * (H - hz - 20); x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.ellipse(sx, sy, 20 + R2() * 30, 6 + R2() * 5, 0, 0, TAU); x.fill(); }
    // البطاقات
    cardRect(x, strCard, '#B9A6FF', '#8C72EE', 28);
    cardRect(x, card, '#FFC560', '#E89520', 28);
    // نقاط زخرفية داخل بطاقة الصينية
    x.fillStyle = 'rgba(255,190,90,.12)';
    for (let yy = card.y + 22; yy < card.y + card.h - 12; yy += 18) for (let xx = card.x + 22 + ((yy / 18 | 0) % 2) * 9; xx < card.x + card.w - 14; xx += 18) { x.beginPath(); x.arc(xx, yy, 2.2, 0, TAU); x.fill(); }
  }

  /* ---------- إنشاء الجولات ---------- */
  function fruitsOK() { return Object.keys(FRUITS).filter(emojiOK); }
  function poolFor(kind, U) {
    const cols = shuffle(Object.keys(COLS));
    if (kind === 'bead' || kind === 'block') return { units: cols.slice(0, U).map(c => ({ k: kind, col: c })), dis: cols.slice(U).map(c => ({ k: kind, col: c })) };
    if (kind === 'fruit') { const fs = shuffle(fruitsOK()); return { units: fs.slice(0, U).map(e => ({ k: 'fruit', emo: e })), dis: fs.slice(U).map(e => ({ k: 'fruit', emo: e })) }; }
    if (kind === 'shape') { const ss = shuffle(Object.keys(SHAPES)); return { units: ss.slice(0, U).map((s, i) => ({ k: 'shape', shp: s, col: cols[i] })), dis: ss.slice(U).map((s, i) => ({ k: 'shape', shp: s, col: cols[(U + i) % cols.length] })) }; }
    if (kind === 'size') {
      const c = cols[0], szs = U === 2 ? shuffle(['s', 'l']) : shuffle(['s', 'm', 'l']);
      return { units: szs.map(z => ({ k: 'bead', col: c, sz: z, solo: true })), dis: ['s', 'm', 'l'].filter(z => !szs.includes(z)).map(z => ({ k: 'bead', col: c, sz: z, solo: true })) };
    }
    if (kind === 'grow') {
      const c = cols[0], ord = Math.random() < .55 ? ['s', 'm', 'l'] : ['l', 'm', 's'];
      return { units: ord.map(z => ({ k: 'bead', col: c, sz: z, solo: true })), dis: [] };
    }
    // mix: لون + حجم معًا
    const units = cols.slice(0, U).map((c, i) => ({ k: 'bead', col: c, sz: i % 2 ? 's' : 'l' }));
    return { units, dis: units.map(u => ({ k: 'bead', col: u.col, sz: u.sz === 's' ? 'l' : 's' })).concat(cols.slice(U).map(c => ({ k: 'bead', col: c, sz: 'l' }))) };
  }
  function makeRound(L) {
    const kind = L.k === 'any' ? pick(['bead', 'block', 'fruit', 'shape']) : L.k;
    let pat = pick(L.pats);
    const letters = [...new Set(pat)], U = letters.length;
    const pool = poolFor(kind, U);
    const len = pat.length;
    let reps = len === 2 ? (Math.random() < .5 ? 3 : 4) : len === 3 ? (Math.random() < .45 ? 3 : 2) : 2;
    let n = len * reps;
    if (n < 9 && Math.random() < .35) n++;
    n = Math.min(n, 10);
    const seq = Array.from({ length: n }, (_, i) => pool.units[letters.indexOf(pat[i % len])]);
    const nb = Math.min(n - len, L.b[0] + Math.floor(Math.random() * (L.b[1] - L.b[0] + 1)));
    let blanks;
    if (L.mid) {
      const cand = shuffle(Array.from({ length: n - len }, (_, i) => i + len));
      blanks = cand.slice(0, nb);
      if (!blanks.includes(n - 1) && Math.random() < .5) blanks[0] = n - 1;
      blanks = [...new Set(blanks)];
    } else blanks = Array.from({ length: nb }, (_, i) => n - nb + i);
    // الخيارات: كل ما يلزم للفراغات + بقية عناصر النمط + مشتّتات
    const opts = [];
    const add = it => { if (it && !opts.some(o => same(o, it))) opts.push(it); };
    blanks.forEach(i => add(seq[i]));
    pool.units.forEach(add);
    shuffle(pool.dis.slice()).forEach(it => { if (opts.length < L.opts) add(it); });
    while (opts.length > Math.max(L.opts, new Set(blanks.map(i => ikey(seq[i]))).size)) {
      const k = opts.findIndex(o => !blanks.some(i => same(seq[i], o))); if (k < 0) break; opts.splice(k, 1);
    }
    return { kind, pat, seq, blanks, opts: shuffle(opts) };
  }

  /* ---------- تدفّق اللعب ---------- */
  function startLevel(n) {
    lvl = clamp(n, 1, LEVELS.length);
    tq = []; winOv.classList.remove('on'); lvOv.classList.remove('on');
    ri = 0; mistakes = 0; parts = []; rings = []; bubbles = []; flyers = []; drag = null; wear = null;
    root.querySelector('.lvbtn .cnt').textContent = num(lvl);
    startRound();
    hintOn = true;
    hintT.textContent = '👆 ' + App.g('اسحبي', 'اسحب') + ' ما يُكمل النمط إلى الفراغ';
    hintEl.style.opacity = 1;
    later(.5, () => App.speak(App.g('أكملي النمط', 'أكمل النمط')));
  }
  function startRound() {
    cur = makeRound(LEVELS[lvl - 1]);
    slots = cur.seq.map((it, i) => ({ it, blank: cur.blanks.includes(i), filled: false, pend: false, pop: 0, flash: 0, errs: 0, x: 0, y: 0, rot: 0 }));
    choices = cur.opts.map((it, i) => ({ it, x: 0, y: 0, r: 30, pop: 0, hint: 0, a: -i * .07 }));
    placeRound();
    phase = 'intro'; phaseT = 0;
    Sound.whoosh();
    paintProg();
  }
  function paintProg() {
    progEl.innerHTML = Array.from({ length: ROUNDS }, (_, i) => `<i class="${i < ri ? 'on' : i === ri && phase !== 'won' ? 'cur' : ''}"></i>`).join('');
  }
  function sayPattern() {
    if (!cur) return;
    const words = [];
    for (const sl of slots) { if (sl.blank && !sl.filled) break; words.push(nameOf(sl.it)); }
    if (!words.length) return;
    App.speak(words.join(lang === 'ar' ? '، ' : ', '), lang);
    // ومضة على الخرزات بالترتيب
    let k = 0;
    for (const sl of slots) { if (sl.blank && !sl.filled) break; const s2 = sl; later(.1 + k * .42, () => { s2.pop = Math.max(s2.pop, .7); }); k++; }
  }
  function speakItem(it) { App.speak(nameOf(it), lang); }
  function bubble(text, x, y, col) { bubbles = bubbles.filter(b => b.age < b.life * .6); bubbles.push({ text, x, y, col, age: 0, life: 1.5 }); }

  function roundDone() {
    phase = 'wait';
    later(.5, beginWear);
  }
  function beginWear() {
    const n = slots.length, gm = neckGeom(n, PG.s, rtl());
    if (PG.neck) { const g0 = PG.neck.geom; sparkle(PG.x, PG.y + g0.cy, '#fff', 10); Sound.poof(); }
    PG.neck = null;
    wear = { t: 0, gm, items: slots.map((sl, i) => ({ it: sl.it, fx: sl.x, fy: sl.y, fr: R * szk(sl.it), tx: PG.x + gm.pts[i].x, ty: PG.y + gm.pts[i].y, tr: gm.rs * szk(sl.it) / .94, x: sl.x, y: sl.y, r: R })) };
    wear.items.forEach((q, i) => Sound.tone(520 * Math.pow(1.06, i), .1, 'sine', .08, 200, i * .06));
    Sound.whoosh();
    phase = 'wear';
  }
  function endWear() {
    const neck = wear.items.map(q => ({ it: q.it })); neck.geom = wear.gm;
    PG.neck = neck; wear = null;
    phase = 'dance'; dance = 0;
    Sound.win(); vibrate(25);
    App.speak(App.g('أحسنتِ!', 'أحسنت!'));
    for (let i = 0; i < 90; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .3, -10), vx: rand(-60, 60), vy: rand(80, 240), rot: rand(0, TAU), vr: rand(-8, 8), life: rand(2.2, 3.4), age: 0, s: rand(6, 11), c: ['#FF4D5A', '#FFD02B', '#3A86FF', '#3FC954', '#9A5BF5', '#FF66B2'][i % 6] });
    later(2.5, endDance);
  }
  function endDance() {
    ri++;
    if (ri >= ROUNDS) { levelWin(); return; }
    startRound();
  }
  function levelWin() {
    phase = 'won'; paintProg();
    const pr = loadProg();
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('patternProg', pr);
    later(.4, () => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنت!') + ' 🐧🎉';
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wP').textContent = App.g('أنهيتِ', 'أنهيتَ') + ` المستوى ${num(lvl)}` + (mistakes ? ` · الأخطاء: ${num(mistakes)}` : ' دون أي خطأ! 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < LEVELS.length ? '' : 'none';
      winOv.classList.add('on');
      Sound.star();
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('pattern_first');
      if (!mistakes) App.achieve('pattern_perfect');
      if (LEVELS.every((_, i) => pr.stars[i + 1])) App.achieve('pattern_all');
    });
  }
  function openLevels() {
    const pr = loadProg();
    const g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}"><span class="n">${num(n)}</span><span class="e">${L.ic}</span>
        <span class="s">${lock ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    g.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
  }
  function act(a) {
    Sound.tap();
    if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
    else if (a === 'close') { lvOv.classList.remove('on'); if (phase === 'won') winOv.classList.add('on'); }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });
  root.querySelector('.say').addEventListener('click', () => { Sound.tap(); sayPattern(); });
  function paintLang() { root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang)); }
  root.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === lang) return;
    Sound.tap(); lang = b.dataset.l; store.set('pattern:lang', lang); paintLang();
    root.querySelector('.lvbtn .cnt').textContent = num(lvl);
    if (drag) cancelDrag();
    placeRound(); sayPattern();
  }));

  /* ---------- الجسيمات ---------- */
  function sparkle(x, y, col, n = 16) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU), v = rand(80, 250);
      parts.push({ t: i % 3 ? 'star' : 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .9), age: 0, s: rand(5, 10), c: i % 2 ? '#FFE26B' : col });
    }
    rings.push({ x, y, age: 0, life: .45, c: col, r: R });
  }
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  const blocked = () => App.current !== ID || paused || winOv.classList.contains('on') || lvOv.classList.contains('on');
  function inPenguin(m) { const dx = (m.x - PG.x) / (PG.s * .38), dy = (m.y - (PG.y - PG.s * .47)) / (PG.s * .5); return dx * dx + dy * dy < 1; }
  cv.addEventListener('pointerdown', e => {
    if (blocked() || drag) return;
    const m = pos(e);
    if (phase === 'play') {
      const c = choices.find(c => c.a >= 1 && Math.hypot(c.x - m.x, c.y - m.y) < Math.max(CR * 1.2, 30));
      if (c) {
        try { cv.setPointerCapture(e.pointerId); } catch (er) {}
        drag = { c, it: c.it, id: e.pointerId, x: c.x, y: c.y, r: c.r, ox: c.x - m.x, oy: c.y - m.y, tx: c.x, ty: c.y, sx: m.x, sy: m.y, moved: false, t0: performance.now(), touch: e.pointerType !== 'mouse', vx: 0, lastX: m.x, rot: 0 };
        c.pop = .5; Sound.tone(520, .08, 'sine', .1, 260); vibrate(10);
        return;
      }
    }
    const sl = slots.find(s => (!s.blank || s.filled) && Math.hypot(s.x - m.x, s.y - m.y) < Math.max(R * 1.05, 22));
    if (sl && (phase === 'play' || phase === 'intro')) { sl.pop = 1; Sound.pop(); speakItem(sl.it); bubble(nameOf(sl.it), sl.x, sl.y - R * 1.5, colorOf(sl.it)); return; }
    if (inPenguin(m)) {
      if (PG.jump <= 0) { PG.jump = .01; PG.vy = -PG.s * 3.2; }
      Sound.squeak(.3); App.speak(lang === 'ar' ? 'بطريق' : 'Penguin', lang);
      bubble(lang === 'ar' ? 'بطريق' : 'Penguin', PG.x, PG.y - PG.s * 1.08, '#3A4AA2');
    }
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const m = pos(e);
    if (!drag.moved && Math.hypot(m.x - drag.sx, m.y - drag.sy) > 8) { drag.moved = true; if (hintOn) { hintOn = false; hintEl.style.opacity = 0; } }
    drag.tx = m.x + drag.ox; drag.ty = m.y + drag.oy - (drag.touch && drag.moved ? 26 : 0);
    drag.vx = drag.vx * .6 + (m.x - drag.lastX) * .4; drag.lastX = m.x;
  });
  function nearestSlot(x, y) {
    let best = null, bd = Math.max(R * 1.75, 44);
    for (const sl of slots) if (sl.blank && !sl.filled && !sl.pend) { const d = Math.hypot(sl.x - x, sl.y - y); if (d < bd) { bd = d; best = sl; } }
    return best;
  }
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (!d.moved && performance.now() - d.t0 < 400) {
      d.c.pop = 1; Sound.pop(); speakItem(d.it); bubble(nameOf(d.it), d.c.x, d.c.y - d.c.r - 22, colorOf(d.it));
      return;
    }
    drop(d.it, d.x, d.y, d.r, d.c);
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', e => { if (drag && e.pointerId === drag.id) cancelDrag(); });
  function cancelDrag() { const d = drag; drag = null; if (d) flyers.push({ it: d.it, fx: d.x, fy: d.y, tx: d.c.x, ty: d.c.y, r0: d.r, r1: d.c.r, t: 0, dur: .3, mode: 'back', c: d.c }); }
  function drop(it, x, y, r, c) {
    const sl = nearestSlot(x, y);
    if (!sl) { Sound.slide(); flyers.push({ it, fx: x, fy: y, tx: c.x, ty: c.y, r0: r, r1: c.r, t: 0, dur: .32, mode: 'back', c }); return; }
    if (same(sl.it, it)) {
      sl.pend = true;
      flyers.push({ it, fx: x, fy: y, tx: sl.x, ty: sl.y, r0: r, r1: R * szk(it), t: 0, dur: .2, mode: 'place', sl });
    } else {
      mistakes++; sl.errs++; sl.flash = 1;
      Sound.error(); vibrate(35); shake = Math.max(shake, 4);
      PG.sad = .9; PG.shakeT = .6;
      if (sl.errs >= 2) choices.forEach(ch => { if (same(ch.it, sl.it)) ch.hint = 3.5; });
      App.speak(App.g('حاولي مرة أخرى', 'حاول مرة أخرى'));
      flyers.push({ it, fx: x, fy: y, tx: c.x, ty: c.y, r0: r, r1: c.r, t: 0, dur: .5, mode: 'back', c, wob: 1 });
    }
  }
  function placed(sl) {
    sl.filled = true; sl.pend = false; sl.pop = 1;
    Sound.thud(); Sound.pop(); vibrate(20);
    sparkle(sl.x, sl.y, colorOf(sl.it));
    speakItem(sl.it); bubble(nameOf(sl.it), sl.x, sl.y - R * 1.6, colorOf(sl.it));
    PG.happy = .9; if (PG.jump <= 0) { PG.jump = .01; PG.vy = -PG.s * 2.2; }
    choices.forEach(ch => { ch.hint = 0; });
    if (slots.every(s => !s.blank || s.filled)) roundDone();
  }
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < LEVELS.length ? 'next' : 'levels'); return; }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? act('close') : openLevels(); return; }
    if (blocked() || phase !== 'play' || drag) return;
    const k = parseInt(e.key, 10);
    if (k >= 1 && k <= choices.length) {
      const c = choices[k - 1], sl = slots.find(s => s.blank && !s.filled && !s.pend);
      if (sl) { if (hintOn) { hintOn = false; hintEl.style.opacity = 0; } drop(c.it, sl.x, sl.y, c.r, c); }
    } else if (e.key === 's' || e.key === 'S') sayPattern();
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt; phaseT += dt;
    for (let i = tq.length - 1; i >= 0; i--) { const q = tq[i]; q.t -= dt; if (q.t <= 0) { tq.splice(i, 1); q.fn(); } }
    if (phase === 'intro' && phaseT > .55) phase = 'play';
    const k = 1 - Math.exp(-dt * 26);
    for (const c of choices) { c.a = Math.min(1, c.a + dt / .35); c.pop = Math.max(0, c.pop - dt * 2.4); if (c.hint > 0) c.hint = Math.max(0, c.hint - dt); }
    for (const s of slots) { s.pop = Math.max(0, s.pop - dt * 2.4); s.flash = Math.max(0, s.flash - dt * 1.6); }
    if (drag) {
      drag.x += (drag.tx - drag.x) * k; drag.y += (drag.ty - drag.y) * k;
      const tr = drag.moved ? R * szk(drag.it) * 1.12 : drag.c.r * 1.1;
      drag.r += (tr - drag.r) * k * .5;
      drag.rot += (clamp(drag.vx * .02, -.3, .3) - drag.rot) * k * .5;
    }
    for (let i = flyers.length - 1; i >= 0; i--) {
      const f = flyers[i]; f.t += dt / f.dur;
      if (f.t >= 1) {
        flyers.splice(i, 1);
        if (f.mode === 'place') placed(f.sl); else f.c.pop = .6;
      }
    }
    if (wear) { wear.t += dt; if (wear.t > .75 + wear.items.length * .06) endWear(); }
    // البطريق
    PG.happy = Math.max(0, PG.happy - dt); PG.sad = Math.max(0, PG.sad - dt); PG.shakeT = Math.max(0, PG.shakeT - dt);
    PG.blinkT -= dt; if (PG.blinkT < -.13) PG.blinkT = rand(2, 4.5);
    PG.blink = PG.blinkT < 0 ? .12 : 1;
    if (PG.jump > 0) {
      PG.vy += PG.s * 14 * dt; PG.jump += -PG.vy * dt;
      if (PG.jump <= 0) { PG.jump = 0; PG.vy = 0; PG.land = 1; }
    }
    PG.land = Math.max(0, (PG.land || 0) - dt * 4);
    let hop = PG.jump, tilt = 0, sqx = 1 + Math.sin(T * 2.4) * .012, sqy = 1 - Math.sin(T * 2.4) * .012, flapL = Math.sin(T * 1.7) * .05, flapR = -flapL, fL = 0, fR = 0;
    if (phase === 'dance') {
      dance += dt; const ph = dance * Math.PI * 2.6;
      hop = Math.abs(Math.sin(ph)) * PG.s * .13;
      tilt = Math.sin(ph) * .2;
      const land = 1 - Math.abs(Math.sin(ph));
      sqx = 1 + land * .1; sqy = 1 - land * .1;
      flapL = .9 + Math.sin(dance * 18) * .55; flapR = .9 + Math.sin(dance * 18 + 1.4) * .55;
      fL = Math.max(0, Math.sin(ph)) * .05; fR = Math.max(0, -Math.sin(ph)) * .05;
      if (Math.random() < dt * 6) { const sd = Math.random() < .5 ? -1 : 1; parts.push({ t: 'note', x: PG.x + sd * PG.s * .4, y: PG.y - PG.s * .9, vx: sd * rand(10, 40), vy: rand(-90, -60), rot: 0, vr: 0, life: 1.4, age: 0, s: rand(18, 26), c: pick(['#7B5CF0', '#FF66B2', '#3A86FF', '#FF9524']), ch: pick(['♪', '♫', '♥']) }); }
    } else if (PG.land > 0) { sqx = 1 + PG.land * .08; sqy = 1 - PG.land * .08; }
    if (PG.shakeT > 0) tilt += Math.sin(PG.shakeT * 30) * .08 * PG.shakeT;
    if (PG.happy > 0 && phase !== 'dance') { flapL = .6 + Math.sin(T * 20) * .3; flapR = flapL; }
    PG.hop = hop; PG.tilt = tilt; PG.sqx = sqx; PG.sqy = sqy; PG.flapL = flapL; PG.flapR = flapR; PG.footL = fL; PG.footR = fR;
    // النظر
    let tx = 0, ty = .6;
    if (drag) { tx = drag.x - PG.x; ty = drag.y - (PG.y - PG.s * .65); }
    const dl = Math.hypot(tx, ty) || 1; PG.lookX += (tx / dl - PG.lookX) * k * .3; PG.lookY += (ty / dl - PG.lookY) * k * .3;
    // الجسيمات
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.t === 'conf') { q.vy = Math.min(q.vy + 120 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; }
      else if (q.t === 'note') { q.vx += Math.sin(T * 4 + i) * 30 * dt; }
      else { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 300 * dt; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    for (let i = bubbles.length - 1; i >= 0; i--) { bubbles[i].age += dt; if (bubbles[i].age > bubbles[i].life) bubbles.splice(i, 1); }
    // ندف الثلج
    if (flakes.length < 26) flakes.push({ x: rand(0, W), y: rand(-20, H * .5), v: rand(14, 30), s: rand(1.5, 3.6), ph: rand(0, TAU) });
    for (const f of flakes) { f.y += f.v * dt; f.x += Math.sin(T * .8 + f.ph) * 12 * dt; if (f.y > H + 10) { f.y = -10; f.x = rand(0, W); } }
    shake = Math.max(0, shake - dt * 18);
  }

  /* ---------- الرسم ---------- */
  function strY(x) { const t = (x - geo.x0) / (geo.x1 - geo.x0); return geo.yTop + geo.sag * (1 - Math.pow(2 * t - 1, 2)); }
  function drawString(off) {
    const a = geo.x0 - 22, b = geo.x1 + 22;
    ctx.save(); ctx.translate(off, 0);
    ctx.lineCap = 'round';
    ctx.beginPath(); for (let xx = a; xx <= b; xx += 6) { const yy = strY(xx); xx === a ? ctx.moveTo(xx, yy) : ctx.lineTo(xx, yy); } ctx.lineTo(b, strY(b));
    ctx.strokeStyle = '#B98A55'; ctx.lineWidth = Math.max(4, R * .2); ctx.stroke();
    ctx.strokeStyle = '#F2D7A8'; ctx.lineWidth = Math.max(2, R * .1); ctx.setLineDash([R * .22, R * .16]); ctx.stroke(); ctx.setLineDash([]);
    // عقدتان خشبيتان في الطرفين
    for (const ex of [a, b]) {
      const ey = strY(ex), rr = Math.max(7, R * .36);
      const g = ctx.createRadialGradient(ex - rr * .35, ey - rr * .4, rr * .1, ex, ey, rr);
      g.addColorStop(0, '#FFE2B0'); g.addColorStop(.5, '#E0A15C'); g.addColorStop(1, '#A8662A');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ex, ey, rr, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  function drawSlot(sl, off) {
    const hov = drag && drag.moved ? clamp(1 - Math.hypot(drag.x - sl.x, drag.y - sl.y) / (R * 2.2), 0, 1) : 0;
    const pulse = 1 + Math.sin(T * 4 + sl.x * .05) * .05 + hov * .12;
    const r = R * .9 * pulse;
    ctx.save(); ctx.translate(sl.x + off, sl.y);
    if (sl.flash > 0) ctx.translate(Math.sin(T * 50) * 4 * sl.flash, 0);
    ctx.fillStyle = hov > .05 ? `rgba(255,236,120,${.35 + hov * .5})` : 'rgba(255,255,255,.75)';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fill();
    ctx.setLineDash([r * .42, r * .26]); ctx.lineDashOffset = -T * 14;
    ctx.lineWidth = Math.max(2.5, R * .1); ctx.strokeStyle = sl.flash > 0 ? `rgba(255,70,80,${.5 + sl.flash * .5})` : hov > .05 ? '#FFB020' : '#9C86F5';
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = sl.flash > 0 ? '#FF4D5A' : '#9C86F5'; ctx.font = `900 ${Math.round(R * .9)}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.globalAlpha = .75; ctx.fillText('?', 0, R * .06);
    ctx.restore();
  }
  function drawChoice(c) {
    if (c.a <= 0) return;
    const e = ease.outBack(Math.min(1, c.a));
    const pad = CR * 1.18;
    ctx.save(); ctx.translate(c.x, c.y);
    const hb = c.hint > 0 ? .5 + .5 * Math.sin(T * 9) : 0;
    ctx.scale(e, e);
    // قاعدة دائرية ناعمة
    let g = ctx.createRadialGradient(0, -pad * .2, pad * .2, 0, 0, pad);
    g.addColorStop(0, '#FFF9EE'); g.addColorStop(1, '#FFE6BD');
    ctx.fillStyle = 'rgba(232,149,32,.28)'; ctx.beginPath(); ctx.ellipse(0, pad * .12, pad, pad * .96, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, pad, 0, TAU); ctx.fill();
    if (hb > 0) { ctx.lineWidth = 5; ctx.strokeStyle = `rgba(255,200,40,${.4 + hb * .6})`; ctx.beginPath(); ctx.arc(0, 0, pad + 3, 0, TAU); ctx.stroke(); }
    const sq = Math.sin((1 - c.pop) * Math.PI * 3) * c.pop * .14;
    const held = drag && drag.c === c;
    drawItem(ctx, c.it, 0, Math.sin(T * 2 + c.x) * 1.5 - hb * 4, c.r, 0, 1 + sq, 1 - sq);
    if (held) { ctx.globalAlpha = .45; ctx.fillStyle = '#FFE6BD'; ctx.beginPath(); ctx.arc(0, 0, pad * .92, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; }
    ctx.restore();
  }
  function render() {
    ctx.save();
    ctx.fillStyle = '#E7E3FF'; ctx.fillRect(0, 0, W, H);
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    // ثلج يتساقط (فوق المشهد فقط)
    ctx.fillStyle = 'rgba(255,255,255,.85)';
    for (const f of flakes) {
      if (portrait ? f.y > strCard.y : (f.x > scene.x + scene.w)) continue;
      ctx.beginPath(); ctx.arc(f.x, f.y, f.s, 0, TAU); ctx.fill();
    }
    drawPenguin(ctx, PG, T);
    // الخيط والخرزات
    let off = 0;
    if (phase === 'intro') off = (rtl() ? 1 : -1) * -W * (1 - ease.outCubic(Math.min(1, phaseT / .5)));
    if (phase !== 'wear' && phase !== 'dance' && geo) {
      drawString(off);
      for (const sl of slots) {
        if (sl.blank && !sl.filled) { drawSlot(sl, off); continue; }
        const sq = Math.sin((1 - sl.pop) * Math.PI * 3) * sl.pop * .16;
        drawItem(ctx, sl.it, sl.x + off, sl.y - sl.pop * 4, R * szk(sl.it), sl.rot, 1 + sq, 1 - sq);
      }
    } else if (phase === 'dance' && geo) {
      // الخيط الجديد ينتظر خارج الشاشة؛ نرسم عقدتين فقط
    }
    if (wear) {
      const pts = wear.items.map((q, i) => {
        const t = clamp((wear.t - i * .06) / .7, 0, 1), e = ease.inOut(t);
        q.x = q.fx + (q.tx - q.fx) * e; q.y = q.fy + (q.ty - q.fy) * e - Math.sin(Math.PI * t) * PG.s * .35; q.r = q.fr + (q.tr - q.fr) * e;
        return q;
      });
      ctx.strokeStyle = '#F4E3C3'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)); ctx.stroke();
      for (const q of pts) drawItem(ctx, q.it, q.x, q.y, q.r);
    }
    // الصينية
    if (phase !== 'wear' && phase !== 'dance') for (const c of choices) drawChoice(c);
    // القطع الطائرة
    for (const f of flyers) {
      const t = Math.min(1, f.t), e = f.mode === 'place' ? ease.outCubic(t) : ease.outBack(t);
      const x = f.fx + (f.tx - f.fx) * e, y = f.fy + (f.ty - f.fy) * e, r = f.r0 + (f.r1 - f.r0) * Math.min(1, e);
      drawItem(ctx, f.it, x, y, r, f.wob ? Math.sin(t * 30) * .3 * (1 - t) : 0);
    }
    if (drag) {
      ctx.save(); ctx.globalAlpha = .25; ctx.fillStyle = '#3A2A80'; ctx.beginPath(); ctx.ellipse(drag.x + 6, drag.y + drag.r * 1.1, drag.r * .9, drag.r * .3, 0, 0, TAU); ctx.fill(); ctx.restore();
      drawItem(ctx, drag.it, drag.x, drag.y, drag.r, drag.rot);
    }
    for (const r of rings) {
      const t = r.age / r.life;
      ctx.save(); ctx.globalAlpha = 1 - t; ctx.strokeStyle = '#FFF4B0'; ctx.lineWidth = 6 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r * (1 + t * 1.1), 0, TAU); ctx.stroke(); ctx.restore();
    }
    for (const q of parts) {
      const a = 1 - q.age / q.life;
      ctx.save(); ctx.globalAlpha = q.t === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillStyle = q.c;
      if (q.t === 'star') { starPath(ctx, q.s * (.6 + a * .5)); ctx.fill(); }
      else if (q.t === 'dot') { ctx.beginPath(); ctx.arc(0, 0, q.s * .45 * a + 1, 0, TAU); ctx.fill(); }
      else if (q.t === 'note') { ctx.font = `900 ${q.s}px ${FONT}`; ctx.textAlign = 'center'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.strokeText(q.ch, 0, 0); ctx.fillText(q.ch, 0, 0); }
      else { ctx.scale(1, Math.cos(q.age * 9 + q.rot)); ctx.fillRect(-q.s / 2, -q.s * .3, q.s, q.s * .6); }
      ctx.restore();
    }
    // فقاعات الكلمات
    for (const b of bubbles) {
      const t = b.age / b.life, sc = t < .15 ? ease.outBack(t / .15) : 1, al = t > .75 ? 1 - (t - .75) / .25 : 1;
      ctx.save(); ctx.globalAlpha = al; ctx.translate(clamp(b.x, 60, W - 60), b.y - t * 14); ctx.scale(sc, sc);
      ctx.font = `900 20px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.direction = lang === 'ar' ? 'rtl' : 'ltr';
      const w = ctx.measureText(b.text).width + 30, h = 38;
      ctx.fillStyle = 'rgba(60,30,120,.18)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2 + 4, w, h, h / 2); ctx.fill();
      ctx.fillStyle = b.col; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(-w / 2 + 3.5, -h / 2 + 3.5, w - 7, h - 7, h / 2 - 3.5); ctx.fill();
      ctx.fillStyle = '#3E2A86'; ctx.fillText(b.text, 0, 2);
      ctx.restore();
    }
    ctx.restore();
  }
  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
    if (paused || document.hidden) return;
    update(dt); render();
  }
  function startLoop() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stopLoop() { running = false; cancelAnimationFrame(raf); }
  let resizeT = 0;
  window.addEventListener('resize', () => {
    if (App.current !== ID) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); if (!running) render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    IK.bg(c, s, ['#E9E4FF', '#B7A8FF', '#7B5CF0'], { seed: 12, rays: .08 });
    // ثلج
    c.fillStyle = '#F6F7FF'; c.beginPath(); c.ellipse(s * .5, s * 1.02, s * .8, s * .3, 0, 0, TAU); c.fill();
    // عقد على خيط
    const cols = ['red', 'yellow', 'blue', 'red', 'yellow', 'blue'];
    c.strokeStyle = '#B98A55'; c.lineWidth = 3; c.beginPath();
    for (let i = 0; i <= 20; i++) { const t = i / 20, x = s * .08 + t * s * .84, y = s * .2 + Math.sin(t * Math.PI) * s * .12; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
    cols.forEach((col, i) => {
      const t = (i + .5) / 6, x = s * .08 + t * s * .84, y = s * .2 + Math.sin(t * Math.PI) * s * .12;
      c.save(); c.translate(x, y); paintBead(c, col, s * .062, 1.6); c.restore();
    });
    drawPenguin(c, { x: s * .5, y: s * .97, s: s * .6, blink: 1, happy: 1, flapL: .5, flapR: .5,
      neck: Object.assign([{ it: { k: 'bead', col: 'red' } }, { it: { k: 'bead', col: 'yellow' } }, { it: { k: 'bead', col: 'blue' } }, { it: { k: 'bead', col: 'red' } }, { it: { k: 'bead', col: 'yellow' } }], { geom: neckGeom(5, s * .6, true) }) }, 0);
    IK.sparkle(c, s * .84, s * .48, s * .06); IK.sparkle(c, s * .16, s * .5, s * .045);
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'أكمل النمط', icon2: '📿', isNew: true, music: 'shapes',
    desc: () => App.g('أكملي العقد ليرقص البطريق', 'أكمل العقد ليرقص البطريق'),
    help: () => [
      '📿 ' + App.g('انظري', 'انظر') + ' إلى الخرزات على الخيط: إنها تتكرّر بنمط!',
      '👆 ' + App.g('اسحبي', 'اسحب') + ' الخرزة المناسبة من الصندوق إلى مكان علامة ❓',
      '🐧 ' + App.g('أكملي', 'أكمل') + ' العقد فيلبسه البطريق ويرقص فرحًا',
      '🔤 زر «عربي / English» يغيّر لغة أسماء الألوان والأشكال والفواكه',
      '🔊 الزر الأصفر يقرأ ' + App.g('لكِ', 'لك') + ' النمط، و' + App.g('المسي', 'المس') + ' أي خرزة ' + App.g('لتسمعي', 'لتسمع') + ' اسمها'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 المستوى ${Math.max(...ks)} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      lang = store.get('pattern:lang', 'ar') === 'en' ? 'en' : 'ar';
      paintLang();
      PG.neck = null;
      layout();
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, LEVELS.length));
      render();
      startLoop();
    },
    leave() { stopLoop(); tq = []; drag = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (drag) cancelDrag(); },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() { return { lvl, ri, phase, mistakes, R, CR, lang, slots: slots.map(s => ({ key: ikey(s.it), name: nameOf(s.it), blank: s.blank, filled: s.filled, x: s.x, y: s.y })), choices: choices.map(c => ({ key: ikey(c.it), x: c.x, y: c.y })) }; }
  });
})();
