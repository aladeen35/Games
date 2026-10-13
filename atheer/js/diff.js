/* =====================================================================
   ابحث عن الاختلافات — صورتان متشابهتان بينهما 5 فروق
   الصور تُرسم برمجيًا من وصف المشهد؛ الصورة «ب» هي المشهد نفسه مع 5 تغييرات
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'diff';
  const TAU = Math.PI * 2;
  const PW = 400, PH = 300;          // أبعاد الصورة المنطقية
  const NDIFF = 5, HINTS = 2;
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  };
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const fmtT = s => { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

  /* ---------- أدوات الرسم ---------- */
  function G(x, x0, y0, x1, y1, ...st) { const g = x.createLinearGradient(x0, y0, x1, y1); st.forEach((c, i) => g.addColorStop(i / (st.length - 1), c)); return g; }
  function RG(x, cx, cy, r0, r1, ...st) { const g = x.createRadialGradient(cx, cy, r0, cx, cy, r1); st.forEach((c, i) => g.addColorStop(i / (st.length - 1), c)); return g; }
  function circ(x, cx, cy, r, f) { x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fillStyle = f; x.fill(); }
  function ell(x, cx, cy, rx, ry, rot, f) { x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, TAU); x.fillStyle = f; x.fill(); }
  function rr(x, X, Y, w, h, r, f) { x.beginPath(); x.roundRect(X, Y, w, h, r); x.fillStyle = f; x.fill(); }
  function poly(x, pts, f) { x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); x.fillStyle = f; x.fill(); }
  function starPath(x, cx, cy, r, rot = 0, inner = .45, n = 5) { x.beginPath(); for (let i = 0; i < n * 2; i++) { const a = rot - Math.PI / 2 + i * Math.PI / n, r2 = i % 2 ? r * inner : r; x.lineTo(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2); } x.closePath(); }
  const ST = 'rgba(45,25,50,.5)';
  /* حدّ خارجي فقط: نرسم خطًا سميكًا ثم نملأ فوقه */
  function of(x, fill, w = .1) { x.lineJoin = 'round'; x.lineWidth = w; x.strokeStyle = ST; x.stroke(); x.fillStyle = fill; x.fill(); }
  function ln(x, w, col) { x.lineWidth = w; x.strokeStyle = col; x.lineCap = 'round'; x.lineJoin = 'round'; x.stroke(); }
  function shade(hex, k) {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = n >> 8 & 255, b = n & 255;
    const t = k < 0 ? 0 : 255, p = Math.abs(k);
    r = Math.round(r + (t - r) * p); g = Math.round(g + (t - g) * p); b = Math.round(b + (t - b) * p);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }
  /* ألوان قابلة للتغيير (دائرة ألوان: نختار لونًا بعيدًا ليكون الفرق واضحًا) */
  const PAL = ['#F0473E', '#FF8F1F', '#FFD23A', '#3CC55E', '#3D8BFF', '#9B5DE5', '#FF6FB5'];
  const pc = o => PAL[o.c == null ? 0 : o.c];
  function altColor(o, kd) {
    const cur = o.c == null ? 0 : o.c, N = PAL.length;
    const pool = (kd.pal || PAL.map((_, i) => i)).filter(i => { const d = Math.abs(i - cur); return Math.min(d, N - d) >= 2; });
    return pool[Math.floor(Math.random() * pool.length)];
  }
  function cloudPath(x, s = 1) {
    const P = [[-.62, .14, .36], [-.3, -.16, .46], [.12, -.3, .54], [.52, -.06, .42], [.8, .16, .3], [.2, .14, .44], [-.18, .16, .42]];
    x.beginPath(); for (const [a, b, r] of P) { x.moveTo(a * s + r * s, b * s); x.arc(a * s, b * s, r * s, 0, TAU); }
  }

  /* ---------- الإيموجي (مخزنة كصور) ---------- */
  const emoCache = {};
  function emojiCanvas(e, px) {
    px = Math.max(8, Math.round(px / 4) * 4);
    const key = e + '|' + px; if (emoCache[key]) return emoCache[key];
    const P = Math.ceil(px * 1.5), c = mk(P, P), x = c.getContext('2d');
    let fs = px;
    x.font = `${fs}px ${EMOJI_FONT}`;
    let m = x.measureText(e);
    const w = (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || m.width), h = (m.actualBoundingBoxAscent || fs * .8) + (m.actualBoundingBoxDescent || fs * .2);
    fs *= Math.min(1.25, px / Math.max(w, h, 1)); x.font = `${fs}px ${EMOJI_FONT}`; m = x.measureText(e);
    const L = m.actualBoundingBoxLeft || m.width / 2, R = m.actualBoundingBoxRight || m.width / 2;
    const A = m.actualBoundingBoxAscent || fs * .8, D = m.actualBoundingBoxDescent || fs * .2;
    x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.fillText(e, P / 2 + (L - R) / 2, P / 2 + (A - D) / 2);
    return (emoCache[key] = c);
  }

  /* =====================================================================
     مكتبة العناصر: كل عنصر يُرسم في إحداثيات وحدة تقريبًا [-1,1]
     d: أنواع الفروق المسموحة  m=اختفاء  c=لون  s=حجم  f=انعكاس  (v=تحريك إن حُدّد)
     gnd: عنصر على الأرض (له ظل وقاعدته عند y=1)
     ===================================================================== */
  const K = {};
  let bakePx = 1;   // عدد البكسلات الفعلية لكل وحدة صورة أثناء الرسم
  function def(name, o) { K[name] = Object.assign({ r: 1, d: 'ms', gnd: 0, pal: null }, o); }

  def('e', { d: 'msf', draw(x, o) { const im = emojiCanvas(o.e, o.s * 2 * bakePx); x.drawImage(im, -1.5, -1.5, 3, 3); } });

  def('tree', { d: 'msc', gnd: 1, pal: [1, 2, 3, 6], draw(x, o) {
    const c = PAL[o.c == null ? 3 : o.c];
    x.beginPath(); x.moveTo(-.14, 1); x.lineTo(-.09, .05); x.lineTo(.09, .05); x.lineTo(.14, 1); x.closePath(); of(x, G(x, -.14, 0, .14, 0, '#7A4A28', '#B07A45', '#7A4A28'), .08);
    x.beginPath(); for (const [a, b, r] of [[-.45, -.1, .4], [.45, -.08, .4], [0, -.5, .48], [-.22, -.2, .45], [.22, -.28, .44], [0, -.02, .4]]) { x.moveTo(a + r, b); x.arc(a, b, r, 0, TAU); }
    of(x, RG(x, -.25, -.6, .05, 1.1, shade(c, .45), c, shade(c, -.35)), .1);
    x.globalAlpha = .35; ell(x, -.25, -.55, .16, .09, -.5, '#fff'); x.globalAlpha = 1;
    if (o.fr) for (const [a, b] of [[-.4, -.15], [.3, -.3], [.05, -.6], [.45, .05], [-.1, .1], [-.5, -.45]]) { circ(x, a, b, .085, '#E53935'); circ(x, a - .025, b - .03, .025, '#fff'); }
  } });
  def('pine', { d: 'ms', gnd: 1, draw(x, o) {
    rr(x, -.1, .65, .2, .35, .03, '#7A4A28');
    for (let i = 0; i < 3; i++) {
      const y0 = -1 + i * .48, w = .45 + i * .2;
      x.beginPath(); x.moveTo(0, y0); x.lineTo(w, y0 + .75); x.quadraticCurveTo(0, y0 + .66, -w, y0 + .75); x.closePath();
      of(x, G(x, -w, 0, w, 0, '#2E9E5A', '#1F7A44'), .08);
      if (o.snow) { x.beginPath(); x.moveTo(0, y0); x.lineTo(w * .5, y0 + .38); x.quadraticCurveTo(w * .25, y0 + .3, 0, y0 + .4); x.quadraticCurveTo(-w * .25, y0 + .3, -w * .5, y0 + .38); x.closePath(); x.fillStyle = '#fff'; x.fill(); }
    }
  } });
  def('bush', { d: 'ms', gnd: 1, draw(x, o) {
    x.beginPath(); for (const [a, b, r] of [[-.55, .45, .45], [.55, .45, .45], [0, .15, .6], [-.25, .5, .5], [.3, .5, .5]]) { x.moveTo(a + r, b); x.arc(a, b, r, 0, TAU); }
    of(x, RG(x, -.2, 0, .1, 1, '#8EE07A', '#4CAF50', '#2E7D32'), .1);
    for (const [a, b] of [[-.4, .3], [.2, .05], [.5, .45], [-.05, .55]]) circ(x, a, b, .09, o.b || '#FF7AA8');
  } });
  def('flower', { d: 'mcs', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(0, 1); x.quadraticCurveTo(.15, .3, 0, -.25); ln(x, .14, '#3E9B47');
    ell(x, .22, .5, .25, .1, -.5, '#5BBE5F'); ell(x, -.2, .7, .22, .09, .5, '#5BBE5F');
    x.save(); x.translate(0, -.35);
    for (let i = 0; i < 6; i++) { x.save(); x.rotate(i * TAU / 6); x.beginPath(); x.ellipse(0, -.32, .2, .32, 0, 0, TAU); of(x, G(x, 0, -.6, 0, 0, shade(c, .4), c), .07); x.restore(); }
    circ(x, 0, 0, .2, RG(x, -.05, -.05, 0, .2, '#FFF3A0', '#FFB300'));
    x.restore();
  } });
  def('cloud', { d: 'ms', draw(x, o) {
    cloudPath(x); x.fillStyle = 'rgba(80,110,160,.18)'; x.save(); x.translate(.05, .1); x.fill(); x.restore();
    cloudPath(x); x.fillStyle = G(x, 0, -.8, 0, .6, '#FFFFFF', '#FFFFFF', o.dark ? '#AFC0D8' : '#DCE9FF'); x.fill();
    if (o.dark) { cloudPath(x); x.fillStyle = 'rgba(90,100,130,.45)'; x.fill(); }
  } });
  def('sun', { d: 'ms', draw(x, o) {
    circ(x, 0, 0, 2, RG(x, 0, 0, .6, 2, 'rgba(255,240,150,.7)', 'rgba(255,240,150,0)'));
    x.fillStyle = '#FFD23F';
    for (let i = 0; i < 12; i++) { x.save(); x.rotate(i * TAU / 12); x.beginPath(); x.moveTo(-.16, -1.1); x.lineTo(0, -1.5); x.lineTo(.16, -1.1); x.closePath(); x.fill(); x.restore(); }
    x.beginPath(); x.arc(0, 0, 1, 0, TAU); of(x, RG(x, -.3, -.3, .1, 1.1, '#FFF8C4', '#FFD84A', '#FFB52E'), .06);
    x.beginPath(); x.arc(-.34, -.1, .13, Math.PI * 1.1, Math.PI * 1.9); x.moveTo(.47, -.1); x.arc(.34, -.1, .13, Math.PI * 1.1, Math.PI * 1.9); ln(x, .09, '#B5651D');
    x.beginPath(); x.arc(0, .08, .38, .2 * Math.PI, .8 * Math.PI); ln(x, .09, '#B5651D');
    circ(x, -.58, .2, .14, 'rgba(255,120,90,.45)'); circ(x, .58, .2, .14, 'rgba(255,120,90,.45)');
  } });
  def('balloon', { d: 'mcs', draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(0, .3); x.quadraticCurveTo(.2, .6, -.05, 1); ln(x, .04, 'rgba(60,60,60,.7)');
    x.beginPath(); x.ellipse(0, -.35, .5, .62, 0, 0, TAU); of(x, RG(x, -.18, -.6, .05, .75, shade(c, .55), c, shade(c, -.3)), .07);
    poly(x, [[0, .25], [-.1, .36], [.1, .36]], shade(c, -.2));
    ell(x, -.2, -.6, .1, .18, -.4, 'rgba(255,255,255,.7)');
  } });
  def('kite', { d: 'mcf', draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(0, .3); x.bezierCurveTo(.4, .55, -.3, .75, .15, 1); ln(x, .04, '#555');
    for (const [a, b] of [[.18, .55], [-.02, .78]]) { poly(x, [[a, b], [a - .12, b - .08], [a - .12, b + .08]], PAL[(o.c + 3) % 7]); }
    x.save(); x.rotate(.25);
    x.beginPath(); x.moveTo(0, -.75); x.lineTo(.5, -.15); x.lineTo(0, .35); x.lineTo(-.5, -.15); x.closePath(); of(x, c, .08);
    poly(x, [[0, -.75], [.5, -.15], [0, -.15]], shade(c, .35)); poly(x, [[0, .35], [-.5, -.15], [0, -.15]], shade(c, -.25));
    x.beginPath(); x.moveTo(0, -.75); x.lineTo(0, .35); x.moveTo(-.5, -.15); x.lineTo(.5, -.15); ln(x, .03, 'rgba(255,255,255,.8)');
    x.restore();
  } });
  def('bird', { d: 'mcf', draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.ellipse(0, 0, .7, .45, 0, 0, TAU); of(x, RG(x, .1, -.2, .05, .8, shade(c, .4), c), .08);
    poly(x, [[-.6, -.05], [-1, -.3], [-.95, .2]], shade(c, -.2));
    circ(x, .5, -.25, .32, shade(c, .15));
    poly(x, [[.78, -.3], [1.05, -.2], [.78, -.12]], '#FFB300');
    circ(x, .58, -.32, .08, '#222'); circ(x, .6, -.35, .03, '#fff');
    x.beginPath(); x.moveTo(-.2, -.1); x.quadraticCurveTo(-.1, -.9, .25, -.75); x.quadraticCurveTo(.15, -.3, .2, -.05); x.closePath(); of(x, shade(c, -.15), .07);
  } });
  def('ball', { d: 'mcs', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.arc(0, 0, 1, 0, TAU); of(x, '#fff', .1);
    x.save(); x.beginPath(); x.arc(0, 0, 1, 0, TAU); x.clip();
    for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, 1, i * TAU / 3 - .5, i * TAU / 3 + .55); x.closePath(); x.fillStyle = i === 1 ? PAL[2] : c; x.fill(); }
    circ(x, 0, 0, 1, RG(x, -.35, -.4, .05, 1.1, 'rgba(255,255,255,.5)', 'rgba(255,255,255,0)', 'rgba(0,0,0,.25)'));
    x.restore(); circ(x, 0, 0, .14, '#fff');
  } });
  def('bench', { d: 'mc', gnd: 1, draw(x, o) {
    const c = pc(o);
    for (const a of [-.8, .7]) { rr(x, a, .1, .12, .9, .03, '#555'); }
    for (const [y0, h] of [[-.55, .2], [-.28, .2], [.1, .18]]) { x.beginPath(); x.roundRect(-1, y0, 2, h, .06); of(x, G(x, 0, y0, 0, y0 + h, shade(c, .3), c), .07); }
    rr(x, -.9, -.6, .1, .75, .03, '#666'); rr(x, .8, -.6, .1, .75, .03, '#666');
  } });
  def('butterfly', { d: 'mcs', draw(x, o) {
    const c = pc(o);
    for (const k of [-1, 1]) {
      x.beginPath(); x.ellipse(k * .45, -.3, .45, .5, k * .4, 0, TAU); of(x, RG(x, k * .45, -.3, .05, .5, shade(c, .5), c), .07);
      x.beginPath(); x.ellipse(k * .35, .35, .32, .36, -k * .4, 0, TAU); of(x, shade(c, -.1), .07);
      circ(x, k * .5, -.35, .13, 'rgba(255,255,255,.75)');
    }
    ell(x, 0, 0, .1, .6, 0, '#3A2A3A');
    x.beginPath(); x.moveTo(0, -.55); x.quadraticCurveTo(-.15, -.9, -.3, -.95); x.moveTo(0, -.55); x.quadraticCurveTo(.15, -.9, .3, -.95); ln(x, .05, '#3A2A3A');
  } });
  def('umbrella', { d: 'mcf', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.save(); x.rotate(.18);
    rr(x, -.04, -.6, .08, 1.62, .03, '#8D6E63');
    x.beginPath(); x.moveTo(-1, -.35); x.quadraticCurveTo(0, -1.45, 1, -.35);
    for (let i = 0; i < 5; i++) x.quadraticCurveTo(.8 - i * .4, -.5, .6 - i * .4, -.35);
    x.closePath(); of(x, c, .08);
    x.save(); x.clip();
    for (let i = 0; i < 5; i += 2) { x.beginPath(); x.moveTo(0, -1.1); x.lineTo(-1 + i * .4, -.3); x.lineTo(-.6 + i * .4, -.3); x.closePath(); x.fillStyle = '#fff'; x.fill(); }
    x.restore(); x.restore();
  } });
  def('bucket', { d: 'mcs', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(-.6, -.3); x.lineTo(.6, -.3); x.lineTo(.45, 1); x.lineTo(-.45, 1); x.closePath(); of(x, G(x, -.6, 0, .6, 0, shade(c, .35), c, shade(c, -.25)), .08);
    x.beginPath(); x.arc(0, -.3, .6, Math.PI, 0); ln(x, .06, '#555');
    ell(x, 0, -.3, .6, .12, 0, shade(c, -.35));
    x.save(); x.translate(.75, .1); x.rotate(.35); rr(x, -.05, -.9, .1, .9, .03, '#FFB300'); x.beginPath(); x.ellipse(0, .15, .22, .3, 0, 0, TAU); of(x, '#FFB300', .06); x.restore();
  } });
  def('castle', { d: 'ms', gnd: 1, draw(x, o) {
    const s1 = '#F6D58E', s2 = '#D9A85B';
    x.beginPath(); x.rect(-.9, -.1, 1.8, 1.1); of(x, G(x, 0, -.1, 0, 1, s1, s2), .07);
    for (const a of [-.9, .5]) { x.beginPath(); x.rect(a, -.6, .4, .6); of(x, G(x, 0, -.6, 0, 0, s1, s2), .07); for (let k = 0; k < 2; k++) rr(x, a + k * .25, -.72, .15, .14, .02, s1); }
    x.beginPath(); x.rect(-.25, -.75, .5, .7); of(x, G(x, 0, -.75, 0, 0, s1, s2), .07);
    x.beginPath(); x.moveTo(0, -.75); x.lineTo(0, -1.1); ln(x, .04, '#6D4C41'); poly(x, [[0, -1.1], [.35, -1], [0, -.9]], '#F0473E');
    x.beginPath(); x.arc(0, 1, .25, Math.PI, 0); x.fillStyle = '#9C7340'; x.fill();
  } });
  def('boat', { d: 'mcf', draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(-1, .3); x.lineTo(1, .3); x.lineTo(.7, .75); x.lineTo(-.75, .75); x.closePath(); of(x, G(x, 0, .3, 0, .75, '#B5683A', '#7B3F1E'), .08);
    rr(x, -.03, -1, .06, 1.3, .02, '#6D4C41');
    x.beginPath(); x.moveTo(.06, -.95); x.quadraticCurveTo(.7, -.3, .8, .2); x.lineTo(.06, .2); x.closePath(); of(x, G(x, 0, -1, .8, 0, shade(c, .5), c), .07);
    x.beginPath(); x.moveTo(-.06, -.7); x.lineTo(-.6, .2); x.lineTo(-.06, .2); x.closePath(); of(x, '#FFFFFF', .07);
    x.beginPath(); x.moveTo(-1.1, .78); x.quadraticCurveTo(-.5, .68, 0, .78); x.quadraticCurveTo(.5, .88, 1.1, .78); ln(x, .07, 'rgba(255,255,255,.8)');
  } });
  def('shell', { d: 'ms', gnd: 1, draw(x, o) {
    x.beginPath(); x.moveTo(0, .8); x.lineTo(-.9, -.1); x.quadraticCurveTo(0, -1.2, .9, -.1); x.closePath(); of(x, G(x, 0, -1, 0, .8, '#FFE0EC', '#FF9FBF'), .08);
    x.beginPath(); for (const a of [-.6, -.3, 0, .3, .6]) { x.moveTo(0, .8); x.lineTo(a, -.5 - (.3 - Math.abs(a) * .3)); } ln(x, .05, 'rgba(200,80,120,.6)');
  } });
  def('starfish', { d: 'mcs', gnd: 1, draw(x, o) {
    const c = pc(o); starPath(x, 0, 0, 1, .2, .45); of(x, RG(x, -.2, -.2, .05, 1, shade(c, .4), c, shade(c, -.2)), .08);
    for (let i = 0; i < 5; i++) { const a = .2 - Math.PI / 2 + i * TAU / 5; circ(x, Math.cos(a) * .5, Math.sin(a) * .5, .07, 'rgba(255,255,255,.7)'); }
  } });
  def('palm', { d: 'msf', gnd: 1, draw(x, o) {
    x.beginPath(); x.moveTo(-.12, 1); x.quadraticCurveTo(-.05, 0, .3, -.6); x.lineTo(.42, -.55); x.quadraticCurveTo(.1, 0, .12, 1); x.closePath(); of(x, G(x, -.2, 0, .2, 0, '#A0703F', '#C99558', '#8A5A33'), .07);
    for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(.2 + i * .07, .35 - i * .18); x.lineTo(.18 + i * .07 + .2, .35 - i * .18); ln(x, .03, 'rgba(90,50,20,.5)'); }
    for (const [a, l] of [[-2.8, .9], [-2.2, .85], [-1.5, .8], [-.8, .85], [-.2, .9], [.3, .7]]) {
      x.save(); x.translate(.36, -.6); x.rotate(a);
      x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(l * .5, -.28, l, .1); x.quadraticCurveTo(l * .5, .05, 0, 0); of(x, G(x, 0, 0, l, 0, '#5CCB5F', '#2E8B3E'), .06);
      x.restore();
    }
    for (const [a, b] of [[.25, -.5], [.45, -.48], [.36, -.4]]) circ(x, a, b, .09, '#7B4A23');
  } });
  def('house', { d: 'mc', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.rect(-.8, -.2, 1.6, 1.2); of(x, G(x, -.8, 0, .8, 0, shade(c, .35), shade(c, .15)), .08);
    x.beginPath(); x.moveTo(-1, -.15); x.lineTo(0, -1); x.lineTo(1, -.15); x.closePath(); of(x, G(x, 0, -1, 0, -.15, '#C0504D', '#8E2F2B'), .08);
    if (o.snow) { x.beginPath(); x.moveTo(-1.02, -.15); x.lineTo(0, -1.04); x.lineTo(1.02, -.15); x.quadraticCurveTo(.7, -.05, .5, -.3); x.quadraticCurveTo(.2, -.1, 0, -.35); x.quadraticCurveTo(-.4, -.1, -.6, -.3); x.quadraticCurveTo(-.8, -.05, -1.02, -.15); x.fillStyle = '#fff'; x.fill(); }
    x.beginPath(); x.roundRect(-.2, .35, .4, .65, [.2, .2, 0, 0]); of(x, '#7B4A23', .06); circ(x, .1, .7, .04, '#FFD54F');
    for (const a of [-.62, .3]) { x.beginPath(); x.rect(a, .05, .32, .3); of(x, o.lit ? '#FFE680' : '#BFE6FF', .06); x.beginPath(); x.moveTo(a + .16, .05); x.lineTo(a + .16, .35); x.moveTo(a, .2); x.lineTo(a + .32, .2); ln(x, .04, '#fff'); }
    if (o.chim) { x.beginPath(); x.rect(.4, -.85, .2, .35); of(x, '#8D6E63', .06); }
  } });
  def('barn', { d: 'c', gnd: 1, pal: [0, 3, 4, 5], draw(x, o) {
    const c = PAL[o.c == null ? 0 : o.c];
    x.beginPath(); x.moveTo(-1, 1); x.lineTo(-1, -.25); x.lineTo(-.6, -.75); x.lineTo(0, -1); x.lineTo(.6, -.75); x.lineTo(1, -.25); x.lineTo(1, 1); x.closePath(); of(x, G(x, -1, 0, 1, 0, shade(c, .15), shade(c, -.15)), .08);
    x.beginPath(); x.moveTo(-1.05, -.22); x.lineTo(-.62, -.8); x.lineTo(0, -1.06); x.lineTo(.62, -.8); x.lineTo(1.05, -.22); ln(x, .1, '#F4F4F4');
    x.beginPath(); x.rect(-.4, .2, .8, .8); of(x, shade(c, -.1), .06);
    x.beginPath(); x.rect(-.4, .2, .8, .8); x.moveTo(-.4, .2); x.lineTo(.4, 1); x.moveTo(.4, .2); x.lineTo(-.4, 1); x.moveTo(0, .2); x.lineTo(0, 1); ln(x, .06, '#F4F4F4');
    x.beginPath(); x.rect(-.2, -.55, .4, .35); of(x, '#FFE9A8', .06);
  } });
  def('hay', { d: 'ms', gnd: 1, draw(x, o) {
    x.beginPath(); x.moveTo(-1, 1); x.quadraticCurveTo(-1, -.8, 0, -.8); x.quadraticCurveTo(1, -.8, 1, 1); x.closePath(); of(x, G(x, 0, -.8, 0, 1, '#FFE27A', '#E6B030'), .08);
    x.beginPath(); for (let i = 0; i < 9; i++) { const a = -.8 + i * .2; x.moveTo(a, .9); x.lineTo(a + .05, -.2 - Math.cos(a) * .4); } ln(x, .04, 'rgba(170,110,20,.5)');
  } });
  def('pumpkin', { d: 'ms', gnd: 1, draw(x, o) {
    for (const [a, w] of [[-.45, .45], [.45, .45], [0, .5]]) { x.beginPath(); x.ellipse(a, .2, w, .75, 0, 0, TAU); of(x, RG(x, a - .1, 0, .05, .8, '#FFC266', '#FF8F1F', '#D9620B'), .07); }
    rr(x, -.08, -.75, .16, .25, .04, '#5D8A2E');
  } });
  def('fish', { d: 'mcsf', draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(-.55, 0); x.lineTo(-1, -.45); x.quadraticCurveTo(-.85, 0, -1, .45); x.closePath(); of(x, shade(c, -.15), .07);
    x.beginPath(); x.ellipse(0, 0, .65, .48, 0, 0, TAU); of(x, RG(x, .2, -.2, .05, .7, shade(c, .5), c, shade(c, -.2)), .08);
    x.save(); x.beginPath(); x.ellipse(0, 0, .65, .48, 0, 0, TAU); x.clip();
    for (const a of [-.25, .05]) { x.fillStyle = 'rgba(255,255,255,.75)'; x.fillRect(a, -.5, .1, 1); } x.restore();
    poly(x, [[-.05, -.45], [.25, -.75], [.3, -.4]], shade(c, -.1));
    circ(x, .38, -.1, .12, '#fff'); circ(x, .41, -.1, .07, '#222');
    x.beginPath(); x.arc(.52, .12, .08, .3, 2); ln(x, .04, '#5A2A2A');
  } });
  def('weed', { d: 'ms', gnd: 1, draw(x, o) {
    for (const [a, h, cl] of [[-.3, 1.9, '#2FA36B'], [.1, 2, '#3CC57E'], [.4, 1.6, '#28925E']]) {
      x.beginPath(); x.moveTo(a, 1);
      for (let t = 0; t <= 1; t += .1) x.lineTo(a + Math.sin(t * 9 + a * 5) * .18, 1 - t * h);
      ln(x, .2, cl);
    }
  } });
  def('coral', { d: 'mcs', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(0, 1); x.lineTo(0, 0); x.lineTo(-.5, -.5); x.lineTo(-.6, -.95); x.moveTo(0, 0); x.lineTo(.45, -.4); x.lineTo(.6, -.9); x.moveTo(-.25, -.25); x.lineTo(-.1, -.8); x.moveTo(.45, -.4); x.lineTo(.85, -.55); x.moveTo(-.5, -.5); x.lineTo(-.85, -.6);
    ln(x, .3, ST); ln(x, .22, c);
    for (const [a, b] of [[-.6, -.95], [.6, -.9], [-.1, -.8], [.85, -.55], [-.85, -.6]]) circ(x, a, b, .14, shade(c, .3));
  } });
  def('bubbles', { d: 'm', draw(x, o) {
    for (const [a, b, r] of [[0, .5, .4], [.3, -.2, .28], [-.15, -.7, .22]]) {
      x.beginPath(); x.arc(a, b, r, 0, TAU); x.fillStyle = 'rgba(220,250,255,.25)'; x.fill(); ln(x, .07, 'rgba(255,255,255,.85)');
      circ(x, a - r * .35, b - r * .35, r * .22, 'rgba(255,255,255,.9)');
    }
  } });
  def('chest', { d: 'ms', gnd: 1, draw(x, o) {
    x.beginPath(); x.rect(-.9, -.1, 1.8, 1.1); of(x, G(x, 0, -.1, 0, 1, '#A8692E', '#6D3E14'), .08);
    x.beginPath(); x.moveTo(-.9, -.1); x.quadraticCurveTo(-.9, -.8, 0, -.8); x.quadraticCurveTo(.9, -.8, .9, -.1); x.closePath(); of(x, G(x, 0, -.8, 0, -.1, '#C78642', '#8A5320'), .08);
    for (const a of [-.6, .5]) rr(x, a, -.75, .12, 1.75, .02, '#E8B931');
    x.beginPath(); x.rect(-.15, -.25, .3, .35); of(x, '#FFD54A', .05); circ(x, 0, -.08, .05, '#5D3A12');
    for (const [a, b] of [[-.3, -.85], [.1, -.92], [.35, -.82]]) circ(x, a, b, .12, '#FFE04A');
  } });
  def('rock', { d: 'ms', gnd: 1, draw(x, o) {
    x.beginPath(); x.moveTo(-1, 1); x.quadraticCurveTo(-1, -.3, -.3, -.55); x.quadraticCurveTo(.4, -.8, .8, -.1); x.quadraticCurveTo(1.1, .4, 1, 1); x.closePath();
    of(x, G(x, -.5, -.6, .5, 1, o.g || '#B5B2C2', '#7E7A90'), .08);
    ell(x, -.3, -.2, .25, .1, -.4, 'rgba(255,255,255,.35)');
  } });
  def('planet', { d: 'mcs', draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.ellipse(0, 0, 1.3, .32, -.35, Math.PI, TAU); ln(x, .14, shade(c, .5));
    x.beginPath(); x.arc(0, 0, .75, 0, TAU); of(x, RG(x, -.25, -.3, .05, .9, shade(c, .5), c, shade(c, -.4)), .07);
    x.save(); x.beginPath(); x.arc(0, 0, .75, 0, TAU); x.clip(); x.globalAlpha = .25; for (const b of [-.35, .1, .45]) { x.fillStyle = '#fff'; x.fillRect(-1, b, 2, .1); } x.restore();
    x.beginPath(); x.ellipse(0, 0, 1.3, .32, -.35, 0, Math.PI); ln(x, .14, shade(c, .5));
  } });
  def('rocket', { d: 'mcf', draw(x, o) {
    const c = pc(o);
    x.save(); x.rotate(.35);
    x.beginPath(); x.moveTo(-.18, .7); x.quadraticCurveTo(0, 1.3, .18, .7); x.closePath(); x.fillStyle = G(x, 0, .7, 0, 1.3, '#FFF27A', '#FF8F1F', 'rgba(255,80,0,0)'); x.fill();
    for (const k of [-1, 1]) { x.beginPath(); x.moveTo(k * .3, .2); x.lineTo(k * .6, .8); x.lineTo(k * .25, .7); x.closePath(); of(x, c, .07); }
    x.beginPath(); x.moveTo(0, -1); x.bezierCurveTo(.5, -.6, .4, .4, .28, .72); x.lineTo(-.28, .72); x.bezierCurveTo(-.4, .4, -.5, -.6, 0, -1); x.closePath(); of(x, G(x, -.4, 0, .4, 0, '#C9D4E6', '#FFFFFF', '#B3BFD4'), .07);
    x.beginPath(); x.moveTo(0, -1); x.bezierCurveTo(.25, -.82, .33, -.65, .36, -.55); x.lineTo(-.36, -.55); x.bezierCurveTo(-.33, -.65, -.25, -.82, 0, -1); x.closePath(); x.fillStyle = c; x.fill();
    x.beginPath(); x.arc(0, -.15, .2, 0, TAU); of(x, RG(x, -.06, -.2, .02, .2, '#E8F7FF', '#58B4F0'), .08);
    x.restore();
  } });
  def('ufo', { d: 'mcs', draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.ellipse(0, -.2, .45, .45, 0, Math.PI, TAU); of(x, 'rgba(180,240,255,.85)', .07);
    circ(x, 0, -.3, .16, '#7BE36B'); circ(x, -.06, -.33, .04, '#222'); circ(x, .06, -.33, .04, '#222');
    x.beginPath(); x.ellipse(0, 0, 1, .32, 0, 0, TAU); of(x, G(x, 0, -.3, 0, .3, shade(c, .4), c, shade(c, -.3)), .08);
    for (let i = -2; i <= 2; i++) circ(x, i * .38, .05, .08, i % 2 ? '#FFF27A' : '#fff');
    x.beginPath(); x.moveTo(-.3, .3); x.lineTo(-.6, 1); x.lineTo(.6, 1); x.lineTo(.3, .3); x.closePath(); x.fillStyle = 'rgba(255,255,170,.25)'; x.fill();
  } });
  def('moon', { d: 'msf', draw(x, o) {
    circ(x, 0, 0, 1.6, RG(x, 0, 0, .5, 1.6, 'rgba(255,250,200,.45)', 'rgba(255,250,200,0)'));
    x.beginPath(); x.arc(0, 0, 1, Math.PI * .35, Math.PI * 1.65); x.arc(.45, -.2, .78, Math.PI * 1.45, Math.PI * .55, true); x.closePath();
    of(x, RG(x, -.4, -.3, .1, 1, '#FFFBE0', '#FFE680', '#F2C94C'), .06);
    circ(x, -.55, .2, .12, 'rgba(210,170,60,.35)'); circ(x, -.3, .55, .08, 'rgba(210,170,60,.35)');
  } });
  def('star', { d: 'mcs', draw(x, o) {
    const c = pc(o);
    starPath(x, 0, 0, 1.1, 0, .48); of(x, RG(x, -.2, -.3, .05, 1.1, shade(c, .6), c, shade(c, -.2)), .1);
    circ(x, -.2, -.1, .09, '#3A2A2A'); circ(x, .2, -.1, .09, '#3A2A2A');
    x.beginPath(); x.arc(0, .05, .2, .3, Math.PI - .3); ln(x, .06, '#3A2A2A');
  } });
  def('comet', { d: 'mf', draw(x, o) {
    x.beginPath(); x.moveTo(.5, -.35); x.quadraticCurveTo(-.4, -.4, -1.2, .6); x.quadraticCurveTo(-.2, .15, .5, .35); x.closePath(); x.fillStyle = G(x, .5, 0, -1.2, .6, 'rgba(255,240,170,.95)', 'rgba(255,150,220,0)'); x.fill();
    x.beginPath(); x.arc(.55, 0, .35, 0, TAU); of(x, RG(x, .45, -.1, .02, .35, '#FFFFFF', '#FFE680', '#FFB52E'), .06);
  } });
  def('bed', { d: 'cf', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.roundRect(-1, -.75, .22, 1.75, .1); of(x, G(x, -1, 0, -.78, 0, '#C68A55', '#9A6236'), .07);
    x.beginPath(); x.roundRect(.85, -.2, .18, 1.2, .08); of(x, G(x, .85, 0, 1.03, 0, '#C68A55', '#9A6236'), .07);
    x.beginPath(); x.rect(-.8, .25, 1.68, .45); of(x, '#B07A45', .07);
    x.beginPath(); x.roundRect(-.75, -.05, .5, .3, .14); of(x, '#FFFFFF', .06);
    x.beginPath(); x.moveTo(-.4, .1); x.quadraticCurveTo(-.3, -.15, .2, -.05); x.quadraticCurveTo(.7, -.1, .9, .05); x.lineTo(.92, .55); x.lineTo(-.4, .55); x.closePath();
    of(x, G(x, 0, -.1, 0, .55, shade(c, .35), c), .07);
    x.beginPath(); for (const a of [-.1, .3, .7]) { x.moveTo(a, .05); x.lineTo(a, .5); } ln(x, .04, 'rgba(255,255,255,.55)');
  } });
  def('lamp', { d: 'mc', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.ellipse(0, .9, .45, .12, 0, 0, TAU); of(x, '#8D6E63', .06);
    rr(x, -.05, -.2, .1, 1.1, .03, '#A1887F');
    circ(x, 0, -.45, .9, RG(x, 0, -.45, .1, .9, 'rgba(255,240,170,.5)', 'rgba(255,240,170,0)'));
    x.beginPath(); x.moveTo(-.3, -.95); x.lineTo(.3, -.95); x.lineTo(.6, -.2); x.lineTo(-.6, -.2); x.closePath(); of(x, G(x, -.6, 0, .6, 0, shade(c, .2), shade(c, .45), c), .07);
  } });
  def('frame', { d: 'mc', draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.rect(-1, -.75, 2, 1.5); of(x, G(x, -1, -.75, 1, .75, shade(c, .3), c, shade(c, -.25)), .08);
    x.fillStyle = G(x, 0, -.6, 0, .6, '#BFE8FF', '#E6F7FF'); x.fillRect(-.82, -.58, 1.64, 1.16);
    poly(x, [[-.82, .58], [-.3, -.2], [.1, .25], [.4, -.05], [.82, .4], [.82, .58]], '#5DBB63');
    circ(x, .45, -.3, .14, '#FFD23A');
  } });
  def('rug', { d: 'c', draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.ellipse(0, 0, 1, .4, 0, 0, TAU); of(x, c, .06);
    x.beginPath(); x.ellipse(0, 0, .75, .28, 0, 0, TAU); ln(x, .06, 'rgba(255,255,255,.7)');
    x.beginPath(); x.ellipse(0, 0, .45, .16, 0, 0, TAU); x.fillStyle = shade(c, .4); x.fill();
  } });
  def('books', { d: 'mc', gnd: 1, draw(x, o) {
    const c = pc(o);
    const B = [[-.85, .45, 1.7, .55, c], [-.7, -.05, 1.45, .5, '#4FA3E0'], [-.8, -.5, 1.55, .45, '#7BC86C']];
    for (const [a, b, w, h, cl] of B) { x.beginPath(); x.roundRect(a, b, w, h, .06); of(x, cl, .07); x.fillStyle = '#FFF8E8'; x.fillRect(a + w - .15, b + .08, .1, h - .16); x.fillStyle = 'rgba(255,255,255,.4)'; x.fillRect(a + .15, b + h * .4, w * .5, .07); }
  } });
  def('clock', { d: 'mc', draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.arc(0, 0, 1, 0, TAU); of(x, G(x, -1, -1, 1, 1, shade(c, .3), c), .08);
    circ(x, 0, 0, .78, '#FFFDF5');
    for (let i = 0; i < 12; i++) { const a = i * TAU / 12; circ(x, Math.sin(a) * .62, -Math.cos(a) * .62, i % 3 ? .04 : .07, '#555'); }
    x.beginPath(); x.moveTo(0, 0); x.lineTo(.35, -.2); x.moveTo(0, 0); x.lineTo(-.05, -.55); ln(x, .08, '#333'); circ(x, 0, 0, .07, '#E53935');
  } });
  def('window', { d: 'c', draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.rect(-.8, -.9, 1.6, 1.6); of(x, '#FFFFFF', .1);
    x.fillStyle = o.night ? G(x, 0, -.8, 0, .6, '#1E2A6B', '#4B3C8F') : G(x, 0, -.8, 0, .6, '#7EC8FF', '#D8F0FF'); x.fillRect(-.7, -.8, 1.4, 1.4);
    if (o.night) { circ(x, .3, -.4, .18, '#FFF3A8'); circ(x, .38, -.46, .16, '#2A2F78'); for (const [a, b] of [[-.4, -.5], [-.2, -.1], [.1, .2], [-.5, .3]]) circ(x, a, b, .03, '#fff'); }
    else { x.save(); x.translate(-.3, -.35); x.scale(.35, .35); cloudPath(x); x.fillStyle = '#fff'; x.fill(); x.restore(); }
    x.beginPath(); x.moveTo(0, -.8); x.lineTo(0, .6); x.moveTo(-.7, -.1); x.lineTo(.7, -.1); ln(x, .08, '#fff');
    for (const k of [-1, 1]) { x.beginPath(); x.moveTo(k * .95, -1); x.quadraticCurveTo(k * .55, -.2, k * .85, .85); x.lineTo(k * 1.05, .85); x.lineTo(k * 1.05, -1); x.closePath(); of(x, G(x, k * .6, 0, k * 1.05, 0, shade(c, .3), c), .06); }
    rr(x, -1.1, -1.08, 2.2, .14, .05, '#8D6E63');
  } });
  def('pot', { d: 'mc', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.roundRect(-.8, -.3, 1.6, 1.3, [.05, .05, .35, .35]); of(x, G(x, -.8, 0, .8, 0, shade(c, .3), c, shade(c, -.3)), .08);
    rr(x, -.9, -.42, 1.8, .18, .08, shade(c, -.2)); rr(x, -1.15, -.15, .3, .14, .06, '#444'); rr(x, .85, -.15, .3, .14, .06, '#444');
    x.beginPath(); x.moveTo(-.3, -.6); x.quadraticCurveTo(-.4, -.9, -.2, -1.1); x.moveTo(.15, -.6); x.quadraticCurveTo(.05, -.9, .25, -1.1); ln(x, .06, 'rgba(255,255,255,.75)');
  } });
  def('kettle', { d: 'mcf', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(.55, .2); x.quadraticCurveTo(.95, .05, 1.05, -.4); x.lineTo(.9, -.42); x.quadraticCurveTo(.8, -.05, .5, -.1); of(x, c, .07);
    x.beginPath(); x.arc(0, -.25, .45, Math.PI * 1.05, Math.PI * 1.95); ln(x, .1, '#444');
    x.beginPath(); x.moveTo(-.7, 1); x.quadraticCurveTo(-.8, -.2, 0, -.3); x.quadraticCurveTo(.8, -.2, .7, 1); x.closePath(); of(x, G(x, -.7, 0, .7, 0, shade(c, .35), c, shade(c, -.3)), .08);
    circ(x, 0, -.32, .1, '#444'); ell(x, -.35, .2, .1, .25, .2, 'rgba(255,255,255,.5)');
  } });
  def('cup', { d: 'mcs', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.arc(.6, .1, .3, -1.3, 1.3); ln(x, .14, shade(c, -.2));
    x.beginPath(); x.moveTo(-.65, -.4); x.lineTo(.65, -.4); x.lineTo(.5, 1); x.lineTo(-.5, 1); x.closePath(); of(x, G(x, -.65, 0, .65, 0, shade(c, .35), c), .08);
    ell(x, 0, -.4, .65, .12, 0, '#6D3E14'); circ(x, 0, .3, .18, '#fff');
  } });
  def('plant', { d: 'mcs', gnd: 1, draw(x, o) {
    const c = pc(o);
    for (const [a, r] of [[-1.1, .55], [-.5, .65], [0, .7], [.5, .65], [1.1, .55]]) { x.save(); x.translate(0, .1); x.rotate(a * .7); x.beginPath(); x.ellipse(0, -r, .2, r, 0, 0, TAU); of(x, G(x, 0, -2 * r, 0, 0, '#7BD86C', '#2E9E5A'), .06); x.restore(); }
    x.beginPath(); x.moveTo(-.5, .1); x.lineTo(.5, .1); x.lineTo(.38, 1); x.lineTo(-.38, 1); x.closePath(); of(x, G(x, -.5, 0, .5, 0, shade(c, .3), c), .07);
    rr(x, -.56, .05, 1.12, .18, .05, shade(c, -.15));
  } });
  def('fridge', { d: 'c', gnd: 1, pal: [0, 2, 3, 4, 6], draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.roundRect(-.6, -1, 1.2, 2, .12); of(x, G(x, -.6, 0, .6, 0, shade(c, .55), shade(c, .3)), .08);
    x.beginPath(); x.moveTo(-.6, -.3); x.lineTo(.6, -.3); ln(x, .05, ST);
    rr(x, .38, -.75, .08, .3, .04, '#888'); rr(x, .38, -.15, .08, .45, .04, '#888');
    circ(x, -.25, -.65, .09, '#F0473E'); circ(x, -.1, .1, .09, '#3D8BFF'); rr(x, -.4, .3, .3, .2, .03, '#FFF');
  } });
  def('desk', { d: 'c', gnd: 1, draw(x, o) {
    const c = pc(o);
    rr(x, -.9, -.1, .12, 1.1, .03, '#777'); rr(x, .78, -.1, .12, 1.1, .03, '#777');
    x.beginPath(); x.roundRect(-1, -.3, 2, .25, .06); of(x, G(x, 0, -.3, 0, -.05, shade(c, .3), c), .07);
    x.beginPath(); x.rect(-.8, -.05, 1.6, .35); of(x, shade(c, -.2), .06);
  } });
  def('chair', { d: 'mcf', gnd: 1, draw(x, o) {
    const c = pc(o);
    rr(x, -.6, .05, .1, .95, .03, '#666'); rr(x, .5, .05, .1, .95, .03, '#666'); rr(x, .5, -1, .1, 1, .03, '#666');
    x.beginPath(); x.roundRect(-.7, -.05, 1.35, .2, .06); of(x, c, .07);
    x.beginPath(); x.roundRect(.1, -1, .55, .6, .1); of(x, G(x, 0, -1, 0, -.4, shade(c, .35), c), .07);
  } });
  def('pencils', { d: 'mc', gnd: 1, draw(x, o) {
    const c = pc(o);
    for (const [a, r, cl] of [[-.25, -.25, '#F0473E'], [0, 0, '#3D8BFF'], [.25, .25, '#FFD23A']]) {
      x.save(); x.translate(a, 0); x.rotate(r); rr(x, -.08, -1, .16, 1.1, .02, cl); poly(x, [[-.08, -1], [.08, -1], [0, -1.22]], '#F5D0A0'); x.restore();
    }
    x.beginPath(); x.moveTo(-.55, -.2); x.lineTo(.55, -.2); x.lineTo(.45, 1); x.lineTo(-.45, 1); x.closePath(); of(x, G(x, -.55, 0, .55, 0, shade(c, .35), c), .08);
  } });
  def('cake', { d: 's', gnd: 1, draw(x, o) {
    x.beginPath(); x.ellipse(0, .95, 1.1, .15, 0, 0, TAU); of(x, '#EEE', .05);
    x.beginPath(); x.roundRect(-.9, .2, 1.8, .75, .1); of(x, G(x, 0, .2, 0, .95, '#FFC2DA', '#F58AB3'), .07);
    x.beginPath(); x.roundRect(-.65, -.35, 1.3, .6, .1); of(x, G(x, 0, -.35, 0, .25, '#FFF1C9', '#F5CF7A'), .07);
    x.beginPath(); x.moveTo(-.9, .3); for (let i = 0; i <= 6; i++) x.quadraticCurveTo(-.9 + i * .3 - .15, .5, -.9 + i * .3, .3); ln(x, .1, '#fff');
    for (const a of [-.35, 0, .35]) { rr(x, a - .05, -.75, .1, .4, .03, '#7ED0FF'); ell(x, a, -.85, .07, .12, 0, '#FFB300'); }
  } });
  def('gift', { d: 'mcs', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.rect(-.8, -.3, 1.6, 1.3); of(x, G(x, -.8, 0, .8, 0, shade(c, .3), c), .08);
    x.beginPath(); x.rect(-.9, -.55, 1.8, .3); of(x, shade(c, .15), .07);
    x.fillStyle = '#FFE14A'; x.fillRect(-.12, -.55, .24, 1.55);
    for (const k of [-1, 1]) { x.beginPath(); x.ellipse(k * .25, -.72, .28, .16, k * .5, 0, TAU); of(x, '#FFE14A', .06); }
  } });
  def('phat', { d: 'mc', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(0, -.9); x.lineTo(.6, 1); x.lineTo(-.6, 1); x.closePath(); of(x, G(x, -.6, 0, .6, 0, shade(c, .35), c), .08);
    for (const [a, b] of [[-.1, -.2], [.15, .3], [-.25, .6], [.3, .8]]) circ(x, a, b, .08, '#fff');
    circ(x, 0, -.95, .18, '#FFE14A');
  } });
  def('cupcake', { d: 'mcs', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(-.6, .1); x.lineTo(.6, .1); x.lineTo(.45, 1); x.lineTo(-.45, 1); x.closePath(); of(x, '#8CD3F5', .07);
    x.beginPath(); for (const a of [-.3, 0, .3]) { x.moveTo(a, .15); x.lineTo(a * .8, .95); } ln(x, .04, 'rgba(255,255,255,.7)');
    x.beginPath(); x.moveTo(-.7, .15); x.quadraticCurveTo(-.8, -.3, -.3, -.4); x.quadraticCurveTo(0, -.9, .3, -.4); x.quadraticCurveTo(.8, -.3, .7, .15); x.closePath(); of(x, G(x, 0, -.9, 0, .15, shade(c, .5), c), .07);
    circ(x, 0, -.75, .14, '#E53935'); for (const [a, b, cl] of [[-.35, -.1, '#FFE14A'], [.2, -.2, '#fff'], [.4, 0, '#7BE36B']]) rr(x, a, b, .12, .05, .02, cl);
  } });
  def('building', { d: 'c', gnd: 1, pal: [0, 1, 2, 3, 4, 5], draw(x, o) {
    const c = pc(o), h = o.h || 1;
    x.beginPath(); x.rect(-1, -h, 2, 1 + h); of(x, G(x, -1, 0, 1, 0, shade(c, .35), shade(c, .1)), .07);
    rr(x, -1.08, -h - .1, 2.16, .14, .03, shade(c, -.3));
    for (let yy = -h + .15; yy < .55; yy += .42) for (const a of [-.7, -.15, .4]) { x.beginPath(); x.rect(a, yy, .3, .26); of(x, ((a * 10 + yy * 7) | 0) % 3 ? '#BFE6FF' : '#FFE9A0', .05); }
    x.beginPath(); x.rect(-.2, .55, .4, .45); of(x, '#6D4C41', .05);
  } });
  def('car', { d: 'mcf', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(-1, .55); x.lineTo(-1, .1); x.quadraticCurveTo(-.9, -.05, -.55, -.08); x.lineTo(-.35, -.5); x.lineTo(.35, -.5); x.lineTo(.6, -.08); x.quadraticCurveTo(1, 0, 1, .3); x.lineTo(1, .55); x.closePath();
    of(x, G(x, 0, -.5, 0, .55, shade(c, .4), c, shade(c, -.2)), .08);
    poly(x, [[-.28, -.42], [-.03, -.42], [-.03, -.1], [-.45, -.1]], '#CFEFFF'); poly(x, [[.05, -.42], [.3, -.42], [.5, -.1], [.05, -.1]], '#CFEFFF');
    circ(x, .92, .15, .07, '#FFF27A'); rr(x, -1.02, .12, .1, .12, .02, '#F0473E');
    for (const a of [-.55, .55]) { x.beginPath(); x.arc(a, .6, .28, 0, TAU); of(x, '#333', .06); circ(x, a, .6, .12, '#CCC'); }
  } });
  def('bus', { d: 'cf', gnd: 1, pal: [0, 2, 3, 4], draw(x, o) {
    const c = PAL[o.c == null ? 2 : o.c];
    x.beginPath(); x.roundRect(-1, -.7, 2, 1.3, .15); of(x, G(x, 0, -.7, 0, .6, shade(c, .3), c), .08);
    for (let i = 0; i < 4; i++) rr(x, -.88 + i * .42, -.55, .32, .35, .04, '#CFEFFF');
    rr(x, .78, -.55, .16, .7, .04, '#CFEFFF'); x.fillStyle = 'rgba(0,0,0,.2)'; x.fillRect(-1, .05, 2, .08);
    for (const a of [-.6, .55]) { x.beginPath(); x.arc(a, .62, .25, 0, TAU); of(x, '#333', .06); circ(x, a, .62, .1, '#CCC'); }
  } });
  def('tlight', { d: 'mc', gnd: 1, pal: [0, 2, 3], draw(x, o) {
    const on = o.c == null ? 0 : o.c;
    rr(x, -.07, -.2, .14, 1.2, .03, '#555');
    x.beginPath(); x.roundRect(-.3, -1, .6, 1.05, .12); of(x, '#3A3A44', .06);
    [[0, -.8], [2, -.47], [3, -.14]].forEach(([k, y]) => { circ(x, 0, y, .13, k === on ? PAL[k] : 'rgba(255,255,255,.15)'); if (k === on) circ(x, 0, y, .3, RG(x, 0, y, .05, .3, PAL[k] + 'AA', PAL[k] + '00')); });
  } });
  def('lamppost', { d: 'm', gnd: 1, draw(x, o) {
    rr(x, -.06, -.7, .12, 1.7, .03, '#3F4A5A'); rr(x, -.2, .85, .4, .15, .04, '#3F4A5A');
    circ(x, 0, -.85, .5, RG(x, 0, -.85, .05, .5, 'rgba(255,240,170,.6)', 'rgba(255,240,170,0)'));
    x.beginPath(); x.moveTo(-.2, -.7); x.lineTo(.2, -.7); x.lineTo(.25, -1); x.lineTo(-.25, -1); x.closePath(); of(x, '#FFE680', .06);
    poly(x, [[-.32, -1], [.32, -1], [0, -1.2]], '#3F4A5A');
  } });
  def('tent', { d: 'mc', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(0, -1); x.lineTo(1.05, 1); x.lineTo(-1.05, 1); x.closePath(); of(x, G(x, -1, 0, 1, 0, shade(c, .3), c, shade(c, -.25)), .08);
    poly(x, [[0, -.4], [.35, 1], [-.35, 1]], '#3A2A20');
    x.beginPath(); x.moveTo(0, -.4); x.lineTo(.42, 1); x.lineTo(.6, 1); x.closePath(); x.fillStyle = shade(c, .45); x.fill();
    x.beginPath(); x.moveTo(0, -1); x.lineTo(0, -1.2); ln(x, .05, '#6D4C41'); poly(x, [[0, -1.2], [.3, -1.12], [0, -1.04]], '#FFD23A');
  } });
  def('fire', { d: 'ms', gnd: 1, draw(x, o) {
    circ(x, 0, .2, 1.1, RG(x, 0, .2, .1, 1.1, 'rgba(255,200,80,.55)', 'rgba(255,160,40,0)'));
    for (const [r, a] of [[.5, -.5], [-.5, .5]]) { x.save(); x.translate(0, .82); x.rotate(a); rr(x, -.75, -.1, 1.5, .2, .1, '#7B4A23'); x.restore(); }
    x.beginPath(); x.moveTo(-.5, .75); x.quadraticCurveTo(-.6, .1, -.2, -.3); x.quadraticCurveTo(-.1, .05, 0, -1); x.quadraticCurveTo(.3, -.3, .25, -.1); x.quadraticCurveTo(.5, -.2, .4, -.45); x.quadraticCurveTo(.75, .1, .5, .75); x.closePath();
    x.fillStyle = G(x, 0, -1, 0, .75, '#FFE14A', '#FF8F1F', '#F0473E'); x.fill();
    x.beginPath(); x.moveTo(-.2, .75); x.quadraticCurveTo(-.25, .2, 0, -.2); x.quadraticCurveTo(.3, .3, .2, .75); x.closePath(); x.fillStyle = '#FFF3A0'; x.fill();
  } });
  def('log', { d: 'm', gnd: 1, draw(x, o) {
    x.beginPath(); x.roundRect(-1, -.35, 2, .7, .35); of(x, G(x, 0, -.35, 0, .35, '#B07A45', '#7B4A23'), .07);
    x.beginPath(); x.ellipse(.82, 0, .18, .33, 0, 0, TAU); of(x, '#E8C08A', .05);
    x.beginPath(); x.ellipse(.82, 0, .08, .16, 0, 0, TAU); ln(x, .03, '#A0703F');
  } });
  def('mush', { d: 'mcs', gnd: 1, pal: [0, 1, 4, 5, 6], draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(-.25, 1); x.quadraticCurveTo(-.3, .3, -.2, -.05); x.lineTo(.2, -.05); x.quadraticCurveTo(.3, .3, .25, 1); x.closePath(); of(x, '#FFF5E6', .07);
    x.beginPath(); x.moveTo(-.9, .05); x.quadraticCurveTo(-.9, -.9, 0, -.9); x.quadraticCurveTo(.9, -.9, .9, .05); x.closePath(); of(x, G(x, 0, -.9, 0, .05, shade(c, .3), c), .07);
    for (const [a, b, r] of [[-.45, -.3, .13], [.1, -.6, .15], [.45, -.2, .12], [-.05, -.15, .1]]) circ(x, a, b, r, '#fff');
  } });
  def('lantern', { d: 'ms', gnd: 1, draw(x, o) {
    circ(x, 0, 0, 1.1, RG(x, 0, 0, .1, 1.1, 'rgba(255,230,120,.6)', 'rgba(255,230,120,0)'));
    x.beginPath(); x.arc(0, -.75, .25, Math.PI, 0); ln(x, .07, '#444');
    x.beginPath(); x.roundRect(-.4, -.7, .8, 1.6, .15); of(x, 'rgba(255,240,170,.9)', .07);
    rr(x, -.45, -.75, .9, .2, .05, '#555'); rr(x, -.45, .8, .9, .2, .05, '#555');
    ell(x, 0, .15, .12, .25, 0, '#FF8F1F');
  } });
  def('snowman', { d: 'mcf', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(-.4, .1); x.lineTo(-.85, -.35); x.moveTo(.4, .05); x.lineTo(.9, .2); x.lineTo(1.05, .05); ln(x, .07, '#6D4C41');
    x.beginPath(); x.arc(0, .5, .52, 0, TAU); of(x, RG(x, -.2, .3, .05, .55, '#fff', '#DCE9F5'), .07);
    x.beginPath(); x.arc(0, -.25, .38, 0, TAU); of(x, RG(x, -.15, -.4, .05, .4, '#fff', '#DCE9F5'), .07);
    x.beginPath(); x.roundRect(-.4, .02, .8, .14, .06); of(x, c, .05); rr(x, .12, .05, .14, .4, .05, c);
    circ(x, -.13, -.32, .05, '#222'); circ(x, .13, -.32, .05, '#222'); poly(x, [[0, -.24], [.35, -.18], [0, -.15]], '#FF8F1F');
    rr(x, -.3, -.66, .6, .1, .03, '#333'); rr(x, -.2, -1, .4, .38, .04, '#333');
    for (const b of [.4, .6]) circ(x, 0, b, .05, '#333');
  } });
  def('sled', { d: 'mcf', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(-1, .75); x.lineTo(.7, .75); x.quadraticCurveTo(1.05, .75, 1, .4); ln(x, .1, '#555');
    for (const a of [-.6, .3]) rr(x, a, .25, .08, .5, .02, '#555');
    x.beginPath(); x.roundRect(-.9, -.05, 1.7, .35, .08); of(x, G(x, 0, -.05, 0, .3, shade(c, .3), c), .07);
  } });
  def('flake', { d: 'm', draw(x, o) {
    x.beginPath(); for (let i = 0; i < 6; i++) { const a = i * TAU / 6, cx = Math.cos(a), cy = Math.sin(a); x.moveTo(0, 0); x.lineTo(cx, cy); x.moveTo(cx * .55, cy * .55); x.lineTo(cx * .55 + Math.cos(a + .8) * .3, cy * .55 + Math.sin(a + .8) * .3); x.moveTo(cx * .55, cy * .55); x.lineTo(cx * .55 + Math.cos(a - .8) * .3, cy * .55 + Math.sin(a - .8) * .3); }
    ln(x, .22, 'rgba(120,160,210,.6)'); ln(x, .12, '#fff');
  } });
  def('jar', { d: 'mc', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.roundRect(-.7, -.6, 1.4, 1.6, .25); x.fillStyle = 'rgba(220,245,255,.55)'; x.fill();
    x.save(); x.clip(); const R = rng(7);
    for (let i = 0; i < 16; i++) circ(x, -.55 + R() * 1.1, -.1 + R() * 1, .17, i % 3 ? c : shade(c, .45)); x.restore();
    x.beginPath(); x.roundRect(-.7, -.6, 1.4, 1.6, .25); ln(x, .07, 'rgba(90,120,150,.6)');
    x.beginPath(); x.roundRect(-.55, -.85, 1.1, .28, .08); of(x, shade(c, -.2), .07);
    ell(x, -.4, -.1, .08, .3, 0, 'rgba(255,255,255,.7)');
  } });
  def('lolli', { d: 'mcs', draw(x, o) {
    const c = pc(o);
    rr(x, -.05, 0, .1, 1, .03, '#F5F0E8');
    x.beginPath(); x.arc(0, -.35, .62, 0, TAU); of(x, '#fff', .08);
    x.beginPath(); for (let t = 0; t < 14; t += .2) { const r = t * .043; x.lineTo(Math.cos(t) * r, -.35 + Math.sin(t) * r); } ln(x, .16, c);
  } });
  def('puddle', { d: 'ms', draw(x, o) {
    x.beginPath(); x.ellipse(0, 0, 1, .32, 0, 0, TAU); of(x, G(x, 0, -.3, 0, .3, '#9FD4F5', '#5BA8DF'), .06);
    x.beginPath(); x.ellipse(-.1, 0, .45, .12, 0, 0, TAU); ln(x, .05, 'rgba(255,255,255,.7)');
  } });
  def('slide', { d: 'c', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(-.95, 1); x.lineTo(-.95, -.8); x.moveTo(-.55, 1); x.lineTo(-.55, -.8); ln(x, .1, '#5A6070');
    x.beginPath(); for (let i = 0; i < 5; i++) { x.moveTo(-.95, .8 - i * .35); x.lineTo(-.55, .8 - i * .35); } ln(x, .07, '#5A6070');
    x.beginPath(); x.moveTo(-.55, -.8); x.quadraticCurveTo(.2, -.6, .45, .4); x.quadraticCurveTo(.6, .9, 1.05, .95); x.lineTo(1.05, .75); x.quadraticCurveTo(.75, .7, .68, .35); x.quadraticCurveTo(.4, -.85, -.55, -1); x.closePath();
    of(x, G(x, -.5, -1, 1, 1, shade(c, .4), c), .07);
    x.beginPath(); x.roundRect(-1.05, -.95, .6, .18, .05); of(x, shade(c, -.2), .06);
  } });
  def('swing', { d: 'c', gnd: 1, draw(x, o) {
    const c = pc(o);
    x.beginPath(); x.moveTo(-1, 1); x.lineTo(-.75, -1); x.lineTo(.75, -1); x.lineTo(1, 1); ln(x, .12, '#5A6070');
    x.beginPath(); x.moveTo(-.25, -1); x.lineTo(-.25, .35); x.moveTo(.25, -1); x.lineTo(.25, .35); ln(x, .04, '#777');
    x.beginPath(); x.roundRect(-.38, .32, .76, .14, .05); of(x, c, .06);
  } });
  def('seesaw', { d: 'mcf', gnd: 1, draw(x, o) {
    const c = pc(o);
    poly(x, [[0, .35], [.3, 1], [-.3, 1]], '#5A6070');
    x.save(); x.translate(0, .35); x.rotate(-.22); x.beginPath(); x.roundRect(-1.05, -.12, 2.1, .2, .08); of(x, G(x, 0, -.12, 0, .08, shade(c, .3), c), .07);
    for (const k of [-.85, .85]) rr(x, k - .04, -.4, .08, .3, .03, '#5A6070'); x.restore();
  } });
  def('sandbox', { d: 'ms', gnd: 1, draw(x, o) {
    x.beginPath(); x.moveTo(-1, .2); x.lineTo(1, .2); x.lineTo(.9, 1); x.lineTo(-.9, 1); x.closePath(); of(x, '#C0814A', .07);
    x.beginPath(); x.ellipse(0, .2, 1, .25, 0, 0, TAU); x.fillStyle = '#F6D58E'; x.fill();
    x.beginPath(); x.ellipse(.2, .05, .35, .2, 0, Math.PI, TAU); x.fillStyle = '#E8C07A'; x.fill();
  } });
  def('board', { d: '', draw(x, o) {
    x.beginPath(); x.rect(-1, -.62, 2, 1.24); of(x, '#B07A45', .08);
    x.fillStyle = G(x, 0, -.55, 0, .55, '#2F6B4F', '#245840'); x.fillRect(-.92, -.54, 1.84, 1.08);
    x.font = '900 .26px sans-serif'; x.fillStyle = 'rgba(255,255,255,.85)'; x.textAlign = 'center'; x.fillText('أ ب ت', -.35, -.15); x.fillText('1 + 2 = 3', .35, .25);
    x.beginPath(); x.arc(.45, -.22, .13, 0, TAU); ln(x, .04, '#FFE680');
    rr(x, -.9, .54, 1.8, .07, .02, '#8D6E63');
  } });

  /* مدى كل نوع لمنطقة الفرق: cy إزاحة المركز، r نصف القطر (بوحدات الحجم) */
  const EXT = { umbrella: [-.45, 1.1], castle: [-.05, 1.1], balloon: [-.2, .85], flower: [-.25, .85], palm: [-.15, 1.15], lamppost: [-.2, 1],
    tlight: [-.45, .75], sun: [0, 1.4], moon: [0, 1.05], planet: [0, 1.2], cloud: [0, 1.1], bubbles: [0, .95], snowman: [0, 1.05], rocket: [0, 1.05],
    pencils: [-.1, 1.1], sandbox: [.55, 1], puddle: [0, 1], rug: [0, 1], bed: [0, 1.05], cake: [0, 1.05], tent: [0, 1.05], lantern: [0, .9], lolli: [-.2, .9] };
  K.e.d = 'ms';
  K.tree.dc = 3; K.bus.dc = 2;

  /* ---------- خلفيات ---------- */
  function sky(x, h, c1, c2) { x.fillStyle = G(x, 0, 0, 0, h, c1, c2); x.fillRect(0, 0, PW, h + 4); }
  function hill(x, y, amp, fr, ph, fill) {
    x.beginPath(); x.moveTo(0, PH);
    for (let xx = 0; xx <= PW; xx += 8) x.lineTo(xx, y + Math.sin(xx * fr + ph) * amp + Math.sin(xx * fr * 2.3 + ph * 1.7) * amp * .3);
    x.lineTo(PW, PH); x.closePath(); x.fillStyle = fill; x.fill();
  }
  function ground(x, y, c1, c2) { x.fillStyle = G(x, 0, y, 0, PH, c1, c2); x.fillRect(0, y, PW, PH - y); }
  function tufts(x, y0, y1, col, R, n = 40) {
    x.strokeStyle = col; x.lineWidth = 1.4; x.lineCap = 'round';
    for (let i = 0; i < n; i++) { const tx = R() * PW, ty = y0 + R() * (y1 - y0); x.beginPath(); x.moveTo(tx - 3, ty); x.lineTo(tx - 4.5, ty - 5); x.moveTo(tx, ty); x.lineTo(tx, ty - 7); x.moveTo(tx + 3, ty); x.lineTo(tx + 4.5, ty - 5); x.stroke(); }
  }
  function silTrees(x, y, col, R, n = 9) {
    x.fillStyle = col; x.beginPath();
    for (let i = 0; i < n; i++) { const tx = (i + R() * .6) * PW / (n - 1), r = 14 + R() * 14; x.moveTo(tx + r, y - r * .6); x.arc(tx, y - r * .6, r, 0, TAU); x.rect(tx - 3, y - r * .6, 6, r); }
    x.fill();
  }
  function wall(x, y, c1, c2) { x.fillStyle = G(x, 0, 0, 0, y, c1, c2); x.fillRect(0, 0, PW, y); }
  function stripes(x, y, col, w = 22) { x.fillStyle = col; for (let i = 0; i < PW; i += w * 2) x.fillRect(i, 0, w, y); }
  function planks(x, y, c1, c2, line) {
    x.fillStyle = G(x, 0, y, 0, PH, c1, c2); x.fillRect(0, y, PW, PH - y);
    x.strokeStyle = line; x.lineWidth = 1;
    for (let yy = y + 14, k = 0; yy < PH; yy += 16, k++) { x.beginPath(); x.moveTo(0, yy); x.lineTo(PW, yy); x.stroke(); for (let xx = (k % 2) * 40; xx < PW; xx += 80) { x.beginPath(); x.moveTo(xx, yy - 16); x.lineTo(xx, yy); x.stroke(); } }
    x.fillStyle = 'rgba(0,0,0,.12)'; x.fillRect(0, y, PW, 4);
  }
  function fence(x, y, h, col) {
    x.fillStyle = col; x.strokeStyle = 'rgba(80,40,10,.45)'; x.lineWidth = 1;
    x.fillRect(0, y - h * .75, PW, 5); x.fillRect(0, y - h * .35, PW, 5);
    for (let xx = 6; xx < PW; xx += 22) { x.beginPath(); x.moveTo(xx, y); x.lineTo(xx, y - h + 4); x.lineTo(xx + 4, y - h); x.lineTo(xx + 8, y - h + 4); x.lineTo(xx + 8, y); x.closePath(); x.fill(); x.stroke(); }
  }
  function dotsStars(x, R, n, h = PH) { for (let i = 0; i < n; i++) { x.globalAlpha = .4 + R() * .6; circ(x, R() * PW, R() * h, .6 + R() * 1.4, '#fff'); } x.globalAlpha = 1; }
  function shelfB(x, x0, x1, y) { rr(x, x0, y, x1 - x0, 7, 2, '#B07A45'); x.fillStyle = 'rgba(0,0,0,.12)'; x.fillRect(x0 + 2, y + 7, x1 - x0 - 4, 4); }

  /* ---------- المشاهد ----------
     العنصر: [نوع، x، y، حجم، خيارات]  — y للعناصر الأرضية هو خط القاعدة
     add: عناصر قد تُضاف إلى الصورة الثانية فقط */
  const A = (e, x, y, s, o) => ['e', x, y, s, Object.assign({ e, d: 'msf' }, o)];
  const E = (e, x, y, s, o) => ['e', x, y, s, Object.assign({ e }, o)];
  const SCENES = [
    { t: 'الحديقة', ic: '🌳', bg(x, R) {
        sky(x, 200, '#74C2FF', '#E3F5FF'); hill(x, 160, 12, .018, 1, '#B4E39A'); hill(x, 182, 10, .012, 3, '#93D474');
        ground(x, 196, '#82D45E', '#4FA83A');
        x.beginPath(); x.moveTo(150, PH); x.quadraticCurveTo(190, 250, 230, 232); x.quadraticCurveTo(300, 205, 320, 196); x.lineTo(340, 196); x.quadraticCurveTo(320, 215, 270, 240); x.quadraticCurveTo(225, 265, 230, PH); x.closePath(); x.fillStyle = '#F2D59A'; x.fill();
        tufts(x, 205, 300, 'rgba(40,120,40,.5)', R, 50);
      },
      it: [['sun', 345, 45, 20], ['cloud', 80, 50, 28, { v: [50, 0] }], ['cloud', 220, 35, 22, { v: [-40, 8] }],
        ['tree', 55, 215, 52, { c: 3 }], ['tree', 335, 210, 46, { c: 3, fr: 1 }], ['bush', 385, 232, 22], ['bush', 140, 214, 18],
        ['bench', 205, 236, 30, { c: 1 }], ['flower', 30, 278, 12, { c: 0 }], ['flower', 70, 292, 12, { c: 5 }], ['flower', 368, 288, 12, { c: 2 }], ['flower', 325, 272, 11, { c: 6 }],
        ['balloon', 120, 110, 16, { c: 0, v: [0, -25] }], ['kite', 268, 88, 20, { c: 4, v: [40, 0] }], ['bird', 165, 58, 11, { c: 4, v: [-40, 10] }],
        ['ball', 270, 288, 13, { c: 0, v: [-45, 0] }], ['butterfly', 125, 172, 9, { c: 6, v: [30, -15] }], A('🐕', 105, 262, 18)],
      add: [A('🐿️', 300, 228, 13), ['flower', 165, 292, 12, { c: 2 }], ['balloon', 245, 125, 14, { c: 2 }], ['bird', 300, 42, 10, { c: 0 }], ['butterfly', 45, 140, 8, { c: 2 }]] },

    { t: 'غرفة النوم', ic: '🛏️', bg(x, R) {
        wall(x, 215, '#FFE6F0', '#FFD3E4'); stripes(x, 215, 'rgba(255,255,255,.35)', 18);
        planks(x, 215, '#E2AE74', '#C58A4F', 'rgba(110,60,20,.25)');
        rr(x, 290, 200, 80, 60, 6, '#C68A55'); rr(x, 296, 210, 68, 18, 4, '#B07A45'); rr(x, 296, 233, 68, 18, 4, '#B07A45'); circ(x, 330, 219, 2.5, '#FFD54F'); circ(x, 330, 242, 2.5, '#FFD54F');
        shelfB(x, 20, 125, 150);
      },
      it: [['window', 300, 90, 40, { c: 4, night: 1 }], ['frame', 120, 72, 30, { c: 1 }], ['clock', 215, 55, 20, { c: 3 }],
        ['rug', 245, 275, 55, { c: 5 }], ['bed', 140, 262, 75, { c: 4 }], ['lamp', 345, 200, 28, { c: 2 }],
        A('🧸', 195, 188, 16), E('🚀', 230, 258, 13, { d: 'msf' }), ['ball', 380, 288, 11, { c: 2, v: [-30, 0] }], ['books', 30, 296, 15, { c: 0 }],
        ['plant', 45, 150, 16, { c: 6 }], A('🦖', 98, 136, 13)],
      add: [['balloon', 255, 150, 14, { c: 0 }], ['star', 40, 40, 11, { c: 2 }], A('🐱', 385, 250, 15), ['books', 110, 296, 14, { c: 3 }], E('🎨', 310, 288, 11)] },

    { t: 'الشاطئ', ic: '🏖️', bg(x, R) {
        sky(x, 135, '#5EBDFF', '#D6F2FF');
        x.fillStyle = G(x, 0, 120, 0, 195, '#1E8ED6', '#7FD3F0'); x.fillRect(0, 120, PW, 80);
        x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 1.5; for (let i = 0; i < 14; i++) { const wx = R() * PW, wy = 130 + R() * 55; x.beginPath(); x.arc(wx, wy, 6, Math.PI * 1.15, Math.PI * 1.85); x.stroke(); }
        x.beginPath(); x.moveTo(0, 195); x.quadraticCurveTo(100, 180, 200, 192); x.quadraticCurveTo(300, 204, PW, 186); x.lineTo(PW, PH); x.lineTo(0, PH); x.closePath(); x.fillStyle = G(x, 0, 185, 0, PH, '#FBE6B0', '#EBC37A'); x.fill();
        x.beginPath(); x.moveTo(0, 195); x.quadraticCurveTo(100, 180, 200, 192); x.quadraticCurveTo(300, 204, PW, 186); x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 3; x.stroke();
        for (let i = 0; i < 60; i++) circ(x, R() * PW, 200 + R() * 100, .8, 'rgba(160,110,40,.35)');
      },
      it: [['sun', 60, 42, 20], ['cloud', 250, 42, 24, { v: [50, 0] }], ['bird', 170, 62, 9, { c: 4, v: [-30, 10] }], ['boat', 300, 145, 26, { c: 0, v: [-50, 0] }],
        ['palm', 360, 232, 60], ['umbrella', 120, 252, 42, { c: 0 }], ['castle', 232, 268, 26], ['bucket', 292, 280, 14, { c: 4 }],
        ['shell', 55, 288, 10], ['starfish', 175, 285, 11, { c: 1 }], A('🦀', 342, 272, 14), ['ball', 200, 222, 13, { c: 6, v: [40, 0] }]],
      add: [A('🐢', 40, 240, 14), ['starfish', 382, 290, 9, { c: 5 }], A('🐬', 200, 150, 16), ['bird', 330, 60, 9, { c: 0 }], ['shell', 270, 222, 8]] },

    { t: 'المزرعة', ic: '🐄', bg(x, R) {
        sky(x, 190, '#82D0FF', '#EAF8FF'); hill(x, 150, 14, .015, 2, '#B9E39C');
        ground(x, 176, '#A3D86E', '#6BB84A'); fence(x, 205, 26, '#E7C38E');
        tufts(x, 210, 300, 'rgba(50,120,30,.45)', R, 45);
      },
      it: [['sun', 345, 40, 18], ['cloud', 100, 42, 26, { v: [60, 0] }], ['barn', 300, 200, 55, { c: 0 }], ['tree', 60, 205, 45, { c: 3, fr: 1 }],
        ['hay', 180, 218, 22], ['pumpkin', 380, 285, 13], A('🐄', 135, 250, 26), A('🐑', 235, 255, 20), A('🐔', 305, 268, 15), A('🐖', 55, 275, 18),
        ['bird', 205, 70, 10, { c: 0, v: [40, 10] }], ['flower', 25, 296, 11, { c: 6 }]],
      add: [A('🐓', 352, 240, 14), A('🐐', 175, 285, 15), ['pumpkin', 255, 294, 10], A('🐕', 380, 215, 13), ['butterfly', 120, 140, 8, { c: 2 }]] },

    { t: 'تحت البحر', ic: '🐠', bg(x, R) {
        sky(x, PH, '#43CFF0', '#11559E');
        x.save(); x.globalAlpha = .15; for (let i = 0; i < 5; i++) { const rx = 40 + i * 85; poly(x, [[rx, 0], [rx + 30, 0], [rx - 30 + i * 8, 260], [rx - 70 + i * 8, 260]], '#fff'); } x.restore();
        x.beginPath(); x.moveTo(0, 250); for (let xx = 0; xx <= PW; xx += 20) x.lineTo(xx, 236 + Math.sin(xx * .03) * 8 - (R() * 10)); x.lineTo(PW, PH); x.lineTo(0, PH); x.fillStyle = '#2B6A9A'; x.fill();
        x.beginPath(); x.moveTo(0, PH); x.lineTo(0, 268); x.quadraticCurveTo(200, 250, PW, 270); x.lineTo(PW, PH); x.fillStyle = G(x, 0, 255, 0, PH, '#F1DC9E', '#D9B66A'); x.fill();
        for (let i = 0; i < 20; i++) { x.beginPath(); x.arc(R() * PW, R() * 230, 1 + R() * 3, 0, TAU); x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1; x.stroke(); }
      },
      it: [['fish', 90, 80, 22, { c: 1, v: [40, 0] }], ['fish', 290, 60, 18, { c: 2 }], ['fish', 220, 140, 20, { c: 6, v: [-40, 0] }], ['fish', 335, 180, 14, { c: 4 }],
        ['weed', 35, 296, 40], ['weed', 365, 296, 45], ['coral', 140, 292, 30, { c: 0 }], ['coral', 262, 294, 26, { c: 5 }], ['chest', 318, 292, 26],
        A('🐙', 200, 228, 22), A('🐢', 70, 178, 22), ['starfish', 92, 290, 11, { c: 2 }], ['bubbles', 160, 60, 16], ['rock', 205, 296, 18]],
      add: [A('🦀', 240, 284, 11), ['fish', 140, 205, 12, { c: 3 }], ['bubbles', 378, 100, 14], A('🐡', 375, 240, 14), ['starfish', 30, 230, 9, { c: 6 }]] },

    { t: 'الفضاء', ic: '🚀', bg(x, R) {
        sky(x, PH, '#0B1640', '#2A1B5E');
        circ(x, 260, 120, 160, RG(x, 260, 120, 10, 160, 'rgba(255,110,200,.28)', 'rgba(255,110,200,0)'));
        circ(x, 90, 230, 120, RG(x, 90, 230, 10, 120, 'rgba(90,200,255,.22)', 'rgba(90,200,255,0)'));
        dotsStars(x, R, 110);
      },
      it: [['planet', 80, 70, 30, { c: 1 }], ['planet', 330, 222, 32, { c: 4 }], ['moon', 335, 58, 24], ['rocket', 195, 140, 45, { c: 0 }],
        ['ufo', 90, 200, 30, { c: 3, v: [30, -20] }], ['star', 262, 40, 12, { c: 2 }], ['star', 40, 140, 10, { c: 6 }], ['comet', 150, 45, 18],
        A('🧑‍🚀', 275, 145, 24), E('🛰️', 365, 135, 15, { d: 'msf' }), A('👽', 200, 262, 18)],
      add: [['star', 140, 250, 11, { c: 2 }], ['planet', 40, 262, 16, { c: 5 }], ['ufo', 270, 262, 17, { c: 6 }], ['star', 380, 290, 8, { c: 3 }], ['comet', 240, 95, 13]] },

    { t: 'المطبخ', ic: '🍳', bg(x, R) {
        wall(x, 205, '#FFF6E0', '#FFEBC4');
        x.strokeStyle = 'rgba(200,160,90,.25)'; x.lineWidth = 1; for (let yy = 0; yy < 205; yy += 25) { x.beginPath(); x.moveTo(0, yy); x.lineTo(PW, yy); x.stroke(); } for (let xx = 0; xx < PW; xx += 25) { x.beginPath(); x.moveTo(xx, 0); x.lineTo(xx, 205); x.stroke(); }
        for (let xx = 0, k = 0; xx < PW; xx += 25, k++) for (let yy = 262, j = 0; yy < PH; yy += 20, j++) { x.fillStyle = (k + j) % 2 ? '#F4F0F8' : '#B7C3E8'; x.fillRect(xx, yy, 25, 20); }
        rr(x, 0, 205, 315, 12, 3, '#D8DDE6'); x.fillStyle = G(x, 0, 217, 0, 262, '#F2A85E', '#D9853E'); x.fillRect(0, 217, 315, 45);
        for (let i = 0; i < 4; i++) { x.strokeStyle = 'rgba(120,60,20,.4)'; x.strokeRect(6 + i * 77, 222, 70, 36); rr(x, 34 + i * 77, 236, 14, 4, 2, '#7B4A23'); }
        shelfB(x, 25, 135, 122);
      },
      it: [['window', 205, 82, 40, { c: 0 }], ['fridge', 357, 300, 72, { c: 4 }], ['clock', 60, 48, 18, { c: 4 }],
        ['pot', 120, 205, 22, { c: 0 }], ['kettle', 232, 205, 20, { c: 4 }], ['cup', 282, 205, 10, { c: 6 }], ['plant', 30, 205, 17, { c: 1 }], E('🍎', 175, 195, 10),
        ['cup', 52, 122, 9, { c: 3 }], ['cup', 82, 122, 9, { c: 2 }], E('🍯', 115, 110, 11), A('🐈', 70, 280, 18)],
      add: [E('🍌', 300, 183, 10), A('🐁', 250, 284, 11), E('🧀', 152, 196, 9), ['flower', 268, 110, 9, { c: 6 }], E('🥕', 200, 280, 10)] },

    { t: 'الفصل', ic: '🏫', bg(x, R) {
        wall(x, 220, '#E3F2FF', '#CFE6FA'); planks(x, 220, '#F1D2A2', '#DDB680', 'rgba(140,90,40,.2)');
        x.fillStyle = 'rgba(255,255,255,.4)'; x.fillRect(0, 150, PW, 4);
      },
      it: [['board', 200, 72, 85], ['clock', 352, 42, 18, { c: 0 }], ['desk', 92, 255, 50, { c: 4 }], ['chair', 168, 266, 26, { c: 3 }], ['desk', 300, 258, 50, { c: 1 }],
        ['books', 278, 193, 14, { c: 0 }], ['pencils', 328, 193, 12, { c: 5 }], E('🌍', 72, 178, 16, { d: 'msf' }), A('🎒', 378, 280, 17), E('🍎', 112, 182, 10),
        ['star', 32, 45, 12, { c: 2 }], ['plant', 28, 222, 16, { c: 6 }]],
      add: [['ball', 228, 288, 11, { c: 4 }], E('✏️', 200, 285, 10, { d: 'msf' }), A('🦉', 370, 110, 14), ['frame', 40, 110, 18, { c: 3 }], E('🎨', 140, 290, 11)] },

    { t: 'عيد الميلاد', ic: '🎂', bg(x, R) {
        wall(x, 250, '#FFEAF6', '#FFD6EC');
        for (let i = 0; i < 40; i++) circ(x, R() * PW, R() * 200, 3, 'rgba(255,255,255,.6)');
        x.beginPath(); x.moveTo(0, 18); x.quadraticCurveTo(200, 48, PW, 18); x.strokeStyle = '#B07A45'; x.lineWidth = 1.5; x.stroke();
        for (let i = 0; i < 14; i++) { const t = (i + .5) / 14, px = t * PW, py = 18 + 4 * 30 * t * (1 - t); poly(x, [[px - 10, py], [px + 10, py], [px, py + 18]], PAL[i % 7]); }
        planks(x, 250, '#E9C08E', '#D3A26A', 'rgba(120,70,20,.2)');
        x.fillStyle = '#FFFFFF'; x.fillRect(50, 200, 300, 45);
        x.beginPath(); for (let i = 0; i <= 12; i++) x.arc(50 + i * 25 + 12.5, 245, 12.5, 0, Math.PI); x.fillStyle = '#fff'; x.fill();
        x.fillStyle = 'rgba(255,111,181,.25)'; for (let i = 0; i < 12; i++) x.fillRect(58 + i * 25, 200, 8, 45);
        rr(x, 45, 195, 310, 8, 3, '#F7F0FF');
      },
      it: [['cake', 200, 197, 40], ['gift', 30, 292, 20, { c: 4 }], ['gift', 380, 292, 16, { c: 0 }], ['balloon', 55, 90, 20, { c: 0, v: [0, -15] }], ['balloon', 98, 72, 18, { c: 2 }],
        ['balloon', 340, 82, 20, { c: 4 }], ['balloon', 298, 102, 16, { c: 6 }], ['phat', 290, 197, 18, { c: 5 }], ['cupcake', 118, 197, 14, { c: 6 }], ['cupcake', 255, 197, 12, { c: 3 }],
        A('🐶', 330, 272, 18), E('🧃', 150, 186, 10)],
      add: [E('🎉', 200, 62, 15, { d: 'msf' }), ['balloon', 245, 60, 15, { c: 3 }], A('🐱', 80, 270, 15), ['cupcake', 330, 197, 11, { c: 2 }], ['gift', 210, 292, 13, { c: 5 }]] },

    { t: 'شارع المدينة', ic: '🏙️', bg(x, R) {
        sky(x, 205, '#9FDBFF', '#F0FAFF');
        x.fillStyle = '#C3D4EA'; for (let i = 0; i < 12; i++) { const bw = 25 + R() * 25, bh = 40 + R() * 70; x.fillRect(i * 35 - 10, 200 - bh, bw, bh); }
        rr(x, 0, 200, PW, 28, 0, '#DAD5CC'); x.fillStyle = 'rgba(0,0,0,.08)'; for (let xx = 0; xx < PW; xx += 30) x.fillRect(xx, 200, 2, 28);
        x.fillStyle = G(x, 0, 228, 0, PH, '#5B5F6E', '#474A57'); x.fillRect(0, 228, PW, PH - 228);
        x.fillStyle = '#FFFFFF'; for (let xx = 10; xx < PW; xx += 50) x.fillRect(xx, 262, 26, 4);
        x.fillStyle = '#9A9488'; x.fillRect(0, 226, PW, 3);
      },
      it: [['building', 60, 200, 42, { c: 4, h: 1.8 }], ['building', 170, 200, 38, { c: 1, h: 2.5 }], ['building', 292, 200, 44, { c: 3, h: 1.4 }], ['tree', 382, 212, 30],
        ['tlight', 238, 222, 30, { c: 0 }], ['lamppost', 120, 224, 32], ['car', 95, 278, 32, { c: 0, v: [40, 0] }], ['bus', 292, 288, 46, { c: 2 }],
        ['sun', 362, 38, 15], ['cloud', 120, 32, 20, { v: [40, 0] }], ['bird', 240, 46, 9, { c: 4, v: [-30, 10] }]],
      add: [E('🚲', 200, 214, 12, { d: 'msf' }), A('🐕', 28, 214, 12), ['balloon', 350, 122, 13, { c: 6 }], ['car', 205, 286, 20, { c: 4 }], ['bird', 30, 60, 8, { c: 0 }]] },

    { t: 'مخيم الغابة', ic: '🏕️', bg(x, R) {
        sky(x, 200, '#22336F', '#F59A82'); dotsStars(x, R, 40, 110);
        silTrees(x, 190, '#3A4E78', R, 11); hill(x, 196, 6, .02, 1, '#355E44');
        ground(x, 205, '#3F7D4B', '#2A5735'); tufts(x, 212, 300, 'rgba(120,200,120,.35)', R, 40);
      },
      it: [['moon', 330, 50, 20], ['star', 62, 40, 8, { c: 2 }], ['star', 200, 30, 8, { c: 2 }], ['pine', 40, 228, 62], ['pine', 362, 220, 55], ['pine', 112, 205, 40],
        ['tent', 238, 245, 48, { c: 1 }], ['fire', 150, 275, 24], ['log', 88, 288, 20], ['mush', 322, 284, 14, { c: 0 }], ['lantern', 300, 238, 12],
        A('🦉', 112, 125, 14), A('🐇', 372, 272, 16), A('🦊', 40, 268, 18)],
      add: [A('🦔', 205, 288, 12), ['mush', 262, 292, 10, { c: 4 }], ['star', 130, 58, 8, { c: 6 }], A('🐿️', 380, 200, 12), ['lantern', 190, 235, 10]] },

    { t: 'قرية الثلج', ic: '⛄', bg(x, R) {
        sky(x, 200, '#9EC2F0', '#EAF3FF'); hill(x, 165, 14, .015, 2, '#F2F7FF'); hill(x, 195, 10, .02, 4, '#E4EEFA');
        ground(x, 210, '#FFFFFF', '#DCE8F6');
        for (let i = 0; i < 70; i++) circ(x, R() * PW, R() * PH, .8 + R() * 1.6, 'rgba(255,255,255,.9)');
      },
      it: [['house', 92, 202, 45, { c: 0, snow: 1, chim: 1 }], ['house', 300, 198, 50, { c: 4, snow: 1, lit: 1 }], ['pine', 198, 210, 40, { snow: 1 }], ['pine', 382, 232, 35, { snow: 1 }],
        ['snowman', 200, 282, 40, { c: 0 }], ['sled', 90, 286, 26, { c: 4 }], ['flake', 50, 60, 10], ['flake', 300, 42, 12], A('🐧', 335, 272, 18),
        ['bird', 150, 62, 10, { c: 0, v: [40, 10] }], ['cloud', 225, 40, 22]],
      add: [['flake', 150, 120, 10], A('🐇', 262, 284, 12), ['bird', 360, 72, 9, { c: 6 }], A('🦊', 30, 255, 14), ['star', 380, 25, 8, { c: 2 }]] },

    { t: 'متجر الحلوى', ic: '🍭', bg(x, R) {
        wall(x, 235, '#FFE4F0', '#FFD0E4'); stripes(x, 235, 'rgba(255,255,255,.45)', 14);
        shelfB(x, 15, 385, 100); shelfB(x, 15, 385, 172);
        x.fillStyle = G(x, 0, 235, 0, PH, '#FF8DBE', '#E2558F'); x.fillRect(0, 235, PW, PH - 235);
        rr(x, 0, 230, PW, 9, 2, '#FFF3F8');
        x.fillStyle = 'rgba(255,255,255,.3)'; for (let i = 0; i < 8; i++) { x.beginPath(); x.arc(25 + i * 50, 270, 14, 0, TAU); x.fill(); }
      },
      it: [['jar', 50, 100, 26, { c: 0 }], ['jar', 130, 100, 24, { c: 3 }], ['jar', 212, 100, 26, { c: 4 }], ['jar', 292, 100, 24, { c: 2 }], E('🍩', 358, 86, 13),
        ['lolli', 50, 148, 18, { c: 6 }], ['lolli', 95, 148, 18, { c: 4 }], ['cupcake', 168, 172, 16, { c: 5 }], ['cupcake', 220, 172, 16, { c: 1 }], E('🍫', 290, 156, 13, { d: 'msf' }), E('🍬', 350, 158, 12, { d: 'msf' }),
        ['cake', 330, 228, 26], E('🍦', 70, 216, 13), E('🍪', 165, 222, 11), ['clock', 200, 32, 16, { c: 4 }]],
      add: [E('🍓', 250, 222, 11), E('🍡', 120, 216, 11, { d: 'msf' }), ['star', 40, 32, 10, { c: 2 }], ['balloon', 360, 40, 13, { c: 3 }], E('🍒', 255, 158, 11)] },

    { t: 'حديقة الحيوانات', ic: '🦁', bg(x, R) {
        sky(x, 200, '#8BD3FF', '#ECF9FF'); silTrees(x, 190, '#9ED49A', R, 10);
        ground(x, 190, '#B6DF7E', '#7CBF4E');
        x.beginPath(); x.moveTo(170, PH); x.quadraticCurveTo(200, 240, 260, 215); x.lineTo(300, 215); x.quadraticCurveTo(250, 250, 250, PH); x.closePath(); x.fillStyle = '#EED9A6'; x.fill();
        tufts(x, 200, 300, 'rgba(60,130,40,.45)', R, 40);
      },
      it: [['tree', 50, 205, 45], ['palm', 362, 205, 50], A('🦒', 128, 168, 36), A('🐘', 238, 222, 32), A('🦁', 330, 244, 24), A('🐒', 52, 128, 14),
        A('🦓', 160, 255, 22), ['balloon', 300, 108, 15, { c: 0, v: [0, -20] }], ['sun', 200, 38, 17], ['cloud', 88, 40, 24, { v: [40, 0] }], ['bird', 280, 58, 10, { c: 4 }],
        ['rock', 228, 290, 18], A('🐧', 40, 278, 16)],
      add: [A('🐢', 300, 286, 12), A('🦩', 100, 280, 14), ['balloon', 205, 105, 13, { c: 3 }], ['butterfly', 230, 150, 9, { c: 2 }], A('🦜', 375, 120, 12)] },

    { t: 'يوم ممطر', ic: '🌧️', bg(x, R) {
        sky(x, 205, '#8EA6C4', '#D4DEEA');
        x.save(); x.globalAlpha = .35; ['#F0473E', '#FF8F1F', '#FFD23A', '#3CC55E', '#3D8BFF', '#9B5DE5'].forEach((c, i) => { x.beginPath(); x.arc(220, 230, 170 - i * 7, Math.PI, TAU); x.strokeStyle = c; x.lineWidth = 7; x.stroke(); }); x.restore();
        ground(x, 200, '#86B86C', '#5C8F4E'); tufts(x, 210, 300, 'rgba(40,90,40,.45)', R, 40);
        x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 1.2; for (let i = 0; i < 90; i++) { const rx = R() * PW, ry = R() * PH; x.beginPath(); x.moveTo(rx, ry); x.lineTo(rx - 3, ry + 9); x.stroke(); }
      },
      it: [['cloud', 80, 45, 34, { dark: 1 }], ['cloud', 285, 40, 36, { dark: 1 }], ['house', 335, 205, 48, { c: 1 }], ['umbrella', 160, 252, 38, { c: 0 }],
        A('🐸', 70, 272, 18), ['puddle', 228, 286, 38], ['puddle', 365, 288, 24], A('🐌', 290, 262, 13), ['flower', 28, 252, 12, { c: 6 }], ['flower', 118, 268, 12, { c: 2 }],
        A('🦆', 222, 274, 14), ['tree', 40, 210, 32]],
      add: [E('🐞', 120, 230, 9, { d: 'msf' }), ['flower', 262, 245, 11, { c: 0 }], ['mush', 178, 292, 11, { c: 0 }], A('🐦', 330, 140, 11), ['puddle', 100, 294, 18]] },

    { t: 'الملعب', ic: '🛝', bg(x, R) {
        sky(x, 200, '#7FCBFF', '#E6F6FF'); silTrees(x, 192, '#A7DB93', R, 9);
        ground(x, 190, '#8DD064', '#5DAA3F');
        x.beginPath(); x.ellipse(200, 268, 210, 45, 0, 0, TAU); x.fillStyle = 'rgba(255,170,110,.45)'; x.fill();
        tufts(x, 200, 300, 'rgba(40,110,30,.45)', R, 30);
      },
      it: [['slide', 88, 250, 55, { c: 0 }], ['swing', 262, 242, 50, { c: 4 }], ['seesaw', 172, 284, 32, { c: 3 }], ['sandbox', 340, 290, 36], ['bucket', 338, 274, 9, { c: 0 }],
        ['ball', 232, 290, 11, { c: 5, v: [-30, 0] }], ['kite', 330, 68, 22, { c: 6, v: [-40, 10] }], ['sun', 60, 40, 18], ['cloud', 200, 40, 26, { v: [-50, 0] }],
        ['tree', 378, 205, 34], ['bird', 262, 102, 10, { c: 2 }], A('🐕', 28, 282, 16), ['balloon', 150, 118, 15, { c: 2 }]],
      add: [A('🐈', 300, 200, 12), ['butterfly', 200, 160, 9, { c: 0 }], A('🐿️', 390, 260, 11), ['flower', 120, 290, 11, { c: 6 }], ['balloon', 30, 120, 13, { c: 4 }]] }
  ];

  /* =====================================================================
     بناء الصورتين واختيار الفروق
     ===================================================================== */
  function mkObj(sp) {
    const [k, x, y, s0, op] = sp, kd = K[k];
    const s = s0 < 16 ? Math.min(16, s0 * 1.2) : s0;   // تكبير العناصر الصغيرة لعيون الأطفال
    const o = Object.assign({ k, x, y, s, f: false }, op || {});
    if (o.c == null) o.c = kd.dc != null ? kd.dc : 0;
    if (kd.gnd) { o.base = y; o.y = y - s; }
    return o;
  }
  function ext(o) {
    if (o.k === 'building') { const h = o.h || 1; return { cx: o.x, cy: o.y + o.s * (1 - h) / 2, r: o.s * Math.max(1, (1 + h) / 2) }; }
    const e = EXT[o.k] || [0, 1];
    return { cx: o.x, cy: o.y + e[0] * o.s, r: e[1] * o.s };
  }
  function region(t, a, b) {
    if (t === 'v') {
      const p = ext(a), q = ext(b), d = Math.hypot(p.cx - q.cx, p.cy - q.cy);
      return { cx: (p.cx + q.cx) / 2, cy: (p.cy + q.cy) / 2, r: d / 2 + Math.max(p.r, q.r) };
    }
    if (t === 's') { const p = ext(a), q = ext(b); return p.r > q.r ? p : q; }
    return ext(a || b);
  }
  function buildPuzzle(sc) {
    const A0 = sc.it.map(mkObj);
    const cands = [];
    A0.forEach((o, i) => { let d = o.d != null ? o.d : K[o.k].d; if (o.v) d += 'v'; const er = ext(o).r; for (const t of d) if (er >= 11 || t === 'm' || t === 'v') cands.push({ t, i }); });
    (sc.add || []).forEach(sp => cands.push({ t: 'a', sp }));
    shuffle(cands);
    const B0 = A0.map(o => Object.assign({}, o));
    const chosen = [], usedI = new Set(), cnt = {};
    for (const pass of [0, 1, 2]) {
      for (const c of cands) {
        if (chosen.length >= NDIFF) break;
        if (c.used || (c.i != null && usedI.has(c.i))) continue;
        if (pass === 0 && (cnt[c.t] || 0) >= 2) continue;          // تنويع أنواع الفروق
        const a = c.i != null ? A0[c.i] : null;
        let b = a ? Object.assign({}, a) : mkObj(c.sp);
        if (c.t === 'c') b.c = altColor(a, K[a.k]);
        else if (c.t === 'f') b.f = !a.f;
        else if (c.t === 'v') { b.x += a.v[0]; b.y += a.v[1]; }
        else if (c.t === 's') {
          const f = a.s > 30 ? .62 : a.s < 13 ? 1.55 : (Math.random() < .5 ? .62 : 1.5);
          b.s = a.s * f; if (K[a.k].gnd) b.y = a.base - b.s;
        }
        const rg = region(c.t, a, c.t === 'm' ? null : b);
        if (c.t === 'm') Object.assign(rg, ext(a));
        const ok = chosen.every(d => Math.hypot(d.cx - rg.cx, d.cy - rg.cy) > (pass === 2 ? .5 : .85) * (d.r + rg.r) + 6);
        if (!ok) continue;
        if (rg.cx - rg.r * .3 < 0 || rg.cx + rg.r * .3 > PW || rg.cy + rg.r * .3 < 0 || rg.cy - rg.r * .3 > PH) continue;
        c.used = true;
        if (c.i != null) { usedI.add(c.i); if (c.t === 'm') B0[c.i] = null; else B0[c.i] = b; }
        else B0.push(b);
        cnt[c.t] = (cnt[c.t] || 0) + 1;
        chosen.push({ t: c.t, cx: rg.cx, cy: rg.cy, r: Math.max(rg.r, 12), found: false, ft: 0 });
      }
    }
    let pa = A0, pb = B0.filter(Boolean);
    if (Math.random() < .5) [pa, pb] = [pb, pa];
    return { a: pa, b: pb, diffs: chosen };
  }

  /* ---------- رسم صورة كاملة ---------- */
  function paint(x, sc, objs, k, seed) {
    x.save(); x.scale(k, k); bakePx = k;
    x.beginPath(); x.rect(0, 0, PW, PH); x.clip();
    sc.bg(x, rng(seed));
    for (const o of objs) {
      const kd = K[o.k];
      x.save(); x.translate(o.x, o.y);
      if (kd.gnd) { x.save(); x.scale(o.s, o.s); ell(x, 0, 1, .8, .13, 0, 'rgba(30,30,50,.16)'); x.restore(); }
      if (o.f) x.scale(-1, 1);
      x.scale(o.s, o.s);
      kd.draw(x, o);
      x.restore();
    }
    x.restore();
  }
  function bakePic(sc, objs, w, seed) {
    const c = mk(w * dpr, w * PH / PW * dpr), x = c.getContext('2d');
    paint(x, sc, objs, w * dpr / PW, seed);
    return c;
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  const loadProg = () => { const p = store.get('diffProg', null) || {}; return { unlocked: clamp(p.unlocked || 1, 1, SCENES.length), stars: p.stars || {}, best: p.best || {} }; };
  function chime() { [784, 988, 1175, 1568].forEach((f, i) => Sound.tone(f, .28, 'sine', .1, 0, i * .07)); Sound.tone(2093, .4, 'triangle', .04, 0, .3); }

  App.css(`
  #diff{background:#2E8FC9;overflow:hidden}
  #diff canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #diff .ib{color:#1C6FA8}
  #diff .ib.hbtn{position:relative}
  #diff .ib.hbtn.off{opacity:.5;filter:grayscale(.8)}
  #diff .chip{color:#1D4F7A;min-width:56px;padding:3px 9px}
  #diff .chip b{color:#E2558F;display:inline-block}
  #diff .chip.bump b{animation:pop .4s cubic-bezier(.3,1.8,.6,1)}
  #diff .panel{border-color:#D6EEFF;box-shadow:0 8px 0 #9FCDEB,0 20px 40px rgba(10,50,90,.35);color:#1D4F7A}
  #diff .panel h3{color:#E2558F}
  #diff .btn{background:linear-gradient(#FFB648,#FF8A1F);box-shadow:0 4px 0 #C25E00}
  #diff .btn.alt{background:#fff;color:#1C6FA8;box-shadow:0 4px 0 #BBDDF3;border-color:#D6EEFF}
  #diff .btn:active{box-shadow:0 1px 0 #C25E00}
  #diff .overlay{background:rgba(10,40,80,.45)}
  #diff .lvp{width:min(94vw,560px);max-height:90vh;overflow-y:auto;touch-action:pan-y;background:linear-gradient(#FFFFFF,#EEF7FF)}
  #diff .lvg{display:grid;grid-template-columns:repeat(3,1fr);gap:12px 9px;margin:10px 2px 12px}
  @media (min-width:600px){#diff .lvg{grid-template-columns:repeat(4,1fr)}}
  #diff .lvb{position:relative;border-radius:14px;color:#1D4F7A;font-weight:900;display:flex;flex-direction:column;align-items:stretch;gap:2px;
    background:#fff;border:3px solid #fff;box-shadow:0 0 0 2px #9FCDEB,0 4px 0 2px #9FCDEB,0 6px 10px rgba(10,50,90,.2);padding:3px 3px 4px}
  #diff .lvb:active{transform:translateY(3px)}
  #diff .lvb canvas{width:100%;aspect-ratio:4/3;border-radius:10px;display:block;background:#DDEFFF}
  #diff .lvb .n{position:absolute;top:6px;right:7px;font-size:12px;background:rgba(255,255,255,.9);border-radius:99px;min-width:20px;padding:0 5px;line-height:20px}
  #diff .lvb .t{font-size:12px;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #diff .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:12px}
  #diff .lvb .s i{font-style:normal}
  #diff .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #diff .lvb.cur{outline:3px dashed #FF8A1F;outline-offset:3px}
  #diff .lvb.lock canvas{filter:grayscale(1) blur(1.5px);opacity:.45}
  #diff .lvb.lock::after{content:'🔒';position:absolute;font-size:26px;top:22%;left:50%;transform:translateX(-50%)}
  #diff .lvb.lock .s{visibility:hidden}
  #diff .hint{bottom:max(8px,env(safe-area-inset-bottom))}
  #diff .hint span{background:rgba(255,255,255,.92);color:#1D4F7A;box-shadow:0 2px 8px rgba(10,50,90,.2);display:inline-block;max-width:92vw}
  #diff .res{display:flex;justify-content:center;gap:10px;margin:6px 0 12px;flex-wrap:wrap}
  #diff .res div{background:#EAF5FF;border-radius:16px;padding:4px 12px;font-weight:800;font-size:14px}
  #diff .res b{display:block;font-size:22px;color:#E2558F}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="الصور">🖼️</button>
      <button class="ib hbtn" aria-label="تلميح">🔍<span class="cnt">2</span></button>
      <span class="grow"></span>
      <div class="chip cFC"><small>الفروق</small><b class="cF">0/5</b></div>
      <div class="chip"><small>الوقت</small><b class="cT">0:00</b></div>
    </div>
    <div class="hint"><span class="hintT"></span></div>
    <div class="overlay" id="dfLv"><div class="panel lvp"><h3>🖼️ الصور</h3>
      <div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="dfEnd"><div class="panel endp"></div></div>`);
  const cv = root.querySelector('canvas.sc'), bar = root.querySelector('.bar');
  const hintEl = root.querySelector('.hint'), hintT = root.querySelector('.hintT');
  const lvOv = root.querySelector('#dfLv'), endOv = root.querySelector('#dfEnd'), endP = root.querySelector('.endp');
  const hBtn = root.querySelector('.hbtn'), hCnt = hBtn.querySelector('.cnt');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, pics = [], kS = 1, bgLayer = null, imgA = null, imgB = null;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, sc = SCENES[0], puz = null, seed = 1, phase = 'play';
  let elapsed = 0, mistakes = 0, hintsLeft = HINTS, cool = 0, coolMark = null, lastSec = -1;
  let marks = [], hintD = null, hintT0 = 0, parts = [], rings = [], winT = -1, hintTimer = 0, shake = 0, events = [];
  const thumbs = {};

  function later(t, fn) { events.push({ t, fn }); }

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const top = bar.getBoundingClientRect().bottom + 8, bottom = H - 34;
    const aw = Math.min(W - 16, 1400), ah = bottom - top, gap = 14, fp = 6;
    const asp = PH / PW;
    const st = Math.min(aw - fp * 2, ((ah - gap) / 2 - fp * 2) / asp);            // فوق بعض
    const sd = Math.min((aw - gap) / 2 - fp * 2, (ah - fp * 2) / asp);            // جنبًا إلى جنب
    const stacked = st >= sd;
    const pw = Math.floor(Math.min(stacked ? st : sd, 720)), ph = Math.round(pw * asp);
    kS = pw / PW;
    if (stacked) {
      const tot = ph * 2 + gap + fp * 4, y0 = top + (ah - tot) / 2 + fp, x0 = (W - pw) / 2;
      pics = [{ x: x0, y: y0, w: pw, h: ph }, { x: x0, y: y0 + ph + fp * 2 + gap, w: pw, h: ph }];
    } else {
      const tot = pw * 2 + gap + fp * 4, x0 = (W - tot) / 2 + fp, y0 = top + (ah - ph) / 2;
      // الأولى على اليمين (اتجاه القراءة العربي)
      pics = [{ x: x0 + pw + fp * 2 + gap, y: y0, w: pw, h: ph }, { x: x0, y: y0, w: pw, h: ph }];
    }
    pics.forEach(p => { p.fp = fp; });
    buildBg();
    bakePics();
  }
  function bakePics() { if (!puz) return; imgA = bakePic(sc, puz.a, pics[0].w, seed); imgB = bakePic(sc, puz.b, pics[0].w, seed); }
  function buildBg() {
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.fillStyle = G(x, 0, 0, 0, H, '#2E8FC9', '#56B9D9', '#8FDCCB'); x.fillRect(0, 0, W, H);
    const R = rng(77);
    for (let i = 0; i < 18; i++) { const bx = R() * W, by = R() * H, br = 20 + R() * 80; circ(x, bx, by, br, RG(x, bx, by, 0, br, 'rgba(255,255,255,.16)', 'rgba(255,255,255,0)')); }
    x.strokeStyle = 'rgba(255,255,255,.13)'; x.lineWidth = 3;
    for (let i = 0; i < 14; i++) {
      const mx = R() * W, my = R() * H, mr = 8 + R() * 10;
      x.beginPath(); x.arc(mx, my, mr, 0, TAU); x.moveTo(mx + mr * .7, my + mr * .7); x.lineTo(mx + mr * 1.6, my + mr * 1.6); x.stroke();
    }
    for (const p of pics) {
      const fp = p.fp;
      x.save(); x.shadowColor = 'rgba(10,40,80,.4)'; x.shadowBlur = 18; x.shadowOffsetY = 7;
      rr(x, p.x - fp, p.y - fp, p.w + fp * 2, p.h + fp * 2, 16, '#FFFFFF'); x.restore();
      x.strokeStyle = '#FFD36B'; x.lineWidth = 2; x.beginPath(); x.roundRect(p.x - fp + 2.5, p.y - fp + 2.5, p.w + fp * 2 - 5, p.h + fp * 2 - 5, 14); x.stroke();
    }
  }

  /* ---------- المستويات ---------- */
  function startLevel(n) {
    lvl = clamp(n, 1, SCENES.length); sc = SCENES[lvl - 1];
    lvOv.classList.remove('on'); endOv.classList.remove('on');
    seed = lvl * 131 + 7;
    puz = buildPuzzle(sc);
    elapsed = 0; mistakes = 0; hintsLeft = HINTS; cool = 0; coolMark = null; lastSec = -1;
    marks = []; hintD = null; parts = []; rings = []; winT = -1; shake = 0; events = [];
    phase = 'play';
    layout(); updChips();
    Sound.whoosh();
    const pr = loadProg();
    showHint(!pr.stars[lvl] && lvl <= 2 ? '👆 ' + App.g('المسي', 'المس') + ' كل شيء مختلف بين الصورتين — هناك 5 فروق!' : '🔎 ' + lvl + '. ' + sc.t + ': ' + App.g('ابحثي', 'ابحث') + ' عن 5 فروق', 6);
  }
  function showHint(t, dur) { hintT.textContent = t; hintEl.style.opacity = t ? 1 : 0; hintTimer = t ? dur : 0; }
  function nFound() { return puz ? puz.diffs.filter(d => d.found).length : 0; }
  function updChips(bump) {
    root.querySelector('.cF').textContent = nFound() + '/' + NDIFF;
    root.querySelector('.cT').textContent = fmtT(elapsed);
    hCnt.textContent = hintsLeft; hBtn.classList.toggle('off', hintsLeft <= 0);
    if (bump) { const c = root.querySelector('.cFC'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
  }
  function thumb(i) {
    if (!thumbs[i]) {
      const s = SCENES[i], c = mk(PW * .5 * 2, PH * .5 * 2), x = c.getContext('2d');
      paint(x, s, s.it.map(mkObj), 1, (i + 1) * 131 + 7);
      thumbs[i] = c;
    }
    return thumbs[i];
  }
  function openLevels() {
    const pr = loadProg();
    const g = root.querySelector('.lvg');
    g.innerHTML = SCENES.map((s, i) => {
      const n = i + 1, st = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="الصورة ${n}">
        <canvas></canvas><span class="n">${n}</span><span class="t">${s.ic} ${s.t}</span>
        <span class="s">${[1, 2, 3].map(k => `<i class="${k <= st ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    g.querySelectorAll('[data-l]').forEach(b => {
      const i = +b.dataset.l - 1, c = b.querySelector('canvas'), t = thumb(i);
      c.width = t.width; c.height = t.height; c.getContext('2d').drawImage(t, 0, 0);
      b.onclick = () => {
        const n = +b.dataset.l;
        if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
        Sound.tap(); startLevel(n);
      };
    });
    endOv.classList.remove('on'); lvOv.classList.add('on');
    const cur = g.querySelector('.cur'); if (cur) setTimeout(() => cur.scrollIntoView({ block: 'center' }), 30);
  }

  /* ---------- اللعب ---------- */
  function toPic(px, py) {
    for (let i = 0; i < pics.length; i++) {
      const p = pics[i];
      if (px >= p.x - 4 && px <= p.x + p.w + 4 && py >= p.y - 4 && py <= p.y + p.h + 4) return { i, u: clamp((px - p.x) / kS, 0, PW), v: clamp((py - p.y) / kS, 0, PH) };
    }
    return null;
  }
  function tap(px, py) {
    if (phase !== 'play' || paused) return;
    const h = toPic(px, py); if (!h) return;
    if (cool > 0) { if (coolMark) coolMark.wob = 1; Sound.tone(500, .05, 'sine', .04); return; }
    const near = d => Math.hypot(d.cx - h.u, d.cy - h.v) <= Math.max(d.r, 16) + 10;
    let best = null, bd = 1e9;
    for (const d of puz.diffs) { const dd = Math.hypot(d.cx - h.u, d.cy - h.v) - d.r; if (near(d) && dd < bd) { bd = dd; best = d; } }
    if (best && best.found) { Sound.pop(); return; }
    if (best) {
      best.found = true; best.ft = 0;
      if (hintD === best) hintD = null;
      for (const p of pics) { const X = p.x + best.cx * kS, Y = p.y + best.cy * kS; sparkle(X, Y); rings.push({ x: X, y: Y, r: best.r * kS, age: 0, life: .55 }); }
      chime(); vibrate(20); updChips(true);
      const n = nFound();
      if (n >= NDIFF) win();
      else if (hintTimer > 0) hintTimer = Math.min(hintTimer, .5);
      if (n === 3) floatTxt(App.g('رائعة! 🌟', 'رائع! 🌟'), h);
      return;
    }
    mistakes++;
    coolMark = { pic: h.i, u: h.u, v: h.v, age: 0, wob: 0 };
    marks.push(coolMark);
    cool = 2;
    Sound.tone(330, .14, 'sine', .07, -60); Sound.tone(262, .2, 'sine', .05, -40, .08); vibrate(12);
  }
  let floats = [];
  function floatTxt(t, h) { floats.push({ t, i: h.i, u: h.u, v: h.v, age: 0 }); }
  function useHint() {
    if (phase !== 'play' || paused) return;
    if (hintsLeft <= 0) { Sound.error(); hBtn.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
    if (hintD && !hintD.found) return;
    const left = puz.diffs.filter(d => !d.found); if (!left.length) return;
    hintD = left[Math.floor(Math.random() * left.length)]; hintT0 = T;
    hintsLeft--; updChips();
    Sound.whoosh(); Sound.tone(880, .2, 'sine', .07, 300, .05);
    later(4, () => { if (hintD && T - hintT0 >= 3.9) hintD = null; });
  }
  hBtn.addEventListener('click', () => { if (App.current === ID) useHint(); });

  function starsFor() { let s = 3; if (elapsed > 60) s--; if (elapsed > 120) s--; if (mistakes > 3) s--; return Math.max(1, s); }
  function win() {
    phase = 'won'; winT = 0; hintD = null; cool = 0;
    later(.35, () => { confetti(); Sound.win(); vibrate(30); App.speak(App.g('أحسنتِ!', 'أحسنت!')); });
    const pr = loadProg();
    const stars = starsFor(), prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (!pr.best[lvl] || elapsed < pr.best[lvl]) pr.best[lvl] = Math.round(elapsed);
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(SCENES.length, lvl + 1);
    store.set('diffProg', pr);
    const fast = elapsed < 30;
    const all = SCENES.every((_, i) => pr.stars[i + 1]);
    later(1.7, () => {
      if (App.current !== ID) return;
      endP.innerHTML = `<h3>${App.g('أحسنتِ!', 'أحسنت!')} 🎉</h3>
        <div class="stars3">${[1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('')}</div>
        <div class="res"><div>الوقت<b>${fmtT(elapsed)}</b></div><div>الأخطاء<b>${mistakes}</b></div></div>
        <p>${fast ? 'عين النسر! ⚡' : stars === 3 ? App.g('محقّقة رائعة! 🕵️‍♀️', 'محقّق رائع! 🕵️') : App.g('أسرعي', 'أسرع') + ' وبأخطاء أقل ' + App.g('لتحصلي', 'لتحصل') + ' على 3 نجوم'}</p>
        ${lvl < SCENES.length ? '<button class="btn" data-a="next">الصورة التالية ▶️</button><br>' : '<p>🏆 ' + App.g('أنهيتِ', 'أنهيتَ') + ' كل الصور!</p>'}
        <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🖼️ الصور</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>`;
      bindEnd(); endOv.classList.add('on');
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('diff_first');
      if (fast) App.achieve('diff_fast');
      if (all) App.achieve('diff_all');
    });
  }
  function bindEnd() { endP.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a))); }
  function act(a) {
    Sound.tap();
    if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
    else if (a === 'close') { lvOv.classList.remove('on'); if (phase === 'won' && endP.innerHTML) endOv.classList.add('on'); }
  }
  root.querySelector('[data-a="close"]').addEventListener('click', () => act('close'));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });

  /* ---------- الجسيمات ---------- */
  function sparkle(x, y) {
    for (let i = 0; i < 14; i++) {
      const a = rand(0, TAU), v = rand(60, 200);
      parts.push({ t: i % 3 ? 'star' : 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .9), age: 0, s: rand(4, 8), c: i % 2 ? '#FFE26B' : '#4CF08A' });
    }
  }
  function confetti() {
    for (let i = 0; i < 160; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 260), rot: rand(0, TAU), vr: rand(-8, 8),
      life: rand(2.5, 4), age: 0, s: rand(6, 11), c: ['#FF5C8A', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF9F43'][i % 6] });
  }

  /* ---------- الإدخال ---------- */
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused || lvOv.classList.contains('on') || endOv.classList.contains('on')) return;
    const r = cv.getBoundingClientRect(); tap(e.clientX - r.left, e.clientY - r.top);
  });
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (endOv.classList.contains('on')) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const b = endP.querySelector('.btn:not(.alt)'); if (b) act(b.dataset.a); }
      return;
    }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? act('close') : openLevels(); return; }
    if ((e.key === 'h' || e.key === 'H' || e.key === '?') && !lvOv.classList.contains('on')) useHint();
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    for (let i = 0; i < events.length; i++) { const ev = events[i]; ev.t -= dt; if (ev.t <= 0) { events.splice(i--, 1); ev.fn(); } }
    if (phase === 'play') {
      elapsed += dt;
      const s = Math.floor(elapsed); if (s !== lastSec) { lastSec = s; root.querySelector('.cT').textContent = fmtT(elapsed); }
    }
    if (cool > 0) { cool = Math.max(0, cool - dt); if (!cool) coolMark = null; }
    for (let i = marks.length - 1; i >= 0; i--) { const m = marks[i]; m.age += dt; m.wob = Math.max(0, m.wob - dt * 3); if (m.age > 2.6) marks.splice(i, 1); }
    if (puz) for (const d of puz.diffs) if (d.found) d.ft += dt;
    if (winT >= 0) winT += dt;
    if (hintTimer > 0) { hintTimer -= dt; if (hintTimer <= 0) hintEl.style.opacity = 0; }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.t === 'conf') { q.vy = Math.min(q.vy + 120 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; }
      else { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 300 * dt; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    for (let i = floats.length - 1; i >= 0; i--) { floats[i].age += dt; if (floats[i].age > 1.4) floats.splice(i, 1); }
    shake = Math.max(0, shake - dt * 16);
  }

  /* ---------- الرسم ---------- */
  function drawMagnifier(X, Y, r) {
    const a = T * 4, s = 1 + Math.sin(a) * .12;
    ctx.save(); ctx.translate(X, Y); ctx.scale(s, s);
    circ(ctx, 0, 0, r * 1.5, RG(ctx, 0, 0, r * .6, r * 1.5, 'rgba(255,240,120,.55)', 'rgba(255,240,120,0)'));
    ctx.save(); ctx.translate(r * .72, r * .72); ctx.rotate(Math.PI / 4);
    rr(ctx, -r * .14, 0, r * .28, r * .95, r * .1, '#8A4B14'); rr(ctx, -r * .1, r * .04, r * .08, r * .85, r * .04, 'rgba(255,255,255,.35)'); ctx.restore();
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.fillStyle = 'rgba(220,245,255,.22)'; ctx.fill();
    ctx.lineWidth = Math.max(4, r * .18); ctx.strokeStyle = '#FFB300'; ctx.stroke();
    ctx.lineWidth = Math.max(1.5, r * .05); ctx.strokeStyle = '#FFF3B0'; ctx.beginPath(); ctx.arc(0, 0, r * .92, Math.PI * 1.1, Math.PI * 1.6); ctx.stroke();
    ctx.restore();
  }
  function drawOverlay(p, idx) {
    ctx.save(); ctx.beginPath(); ctx.roundRect(p.x, p.y, p.w, p.h, 8); ctx.clip();
    ctx.drawImage(idx ? imgB : imgA, p.x, p.y, p.w, p.h);
    if (cool > 0) { ctx.fillStyle = `rgba(255,255,255,${.22 * Math.min(1, cool * 2)})`; ctx.fillRect(p.x, p.y, p.w, p.h); }
    // الدوائر حول الفروق المكتشفة
    for (const d of puz.diffs) {
      if (!d.found) continue;
      const X = p.x + d.cx * kS, Y = p.y + d.cy * kS, r = Math.max(14, (d.r + 4) * kS);
      const t = Math.min(1, d.ft / .4), e = ease.outCubic(t), pop = 1 + Math.sin(Math.min(1, d.ft / .5) * Math.PI) * .12;
      ctx.save(); ctx.translate(X, Y); ctx.scale(pop, pop);
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(0, 0, r, -Math.PI / 2, -Math.PI / 2 + e * TAU);
      ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.stroke();
      ctx.lineWidth = 4; ctx.strokeStyle = '#18C24A'; ctx.stroke();
      ctx.restore();
    }
    // علامات الخطأ
    for (const m of marks) {
      if (m.pic !== idx) continue;
      const X = p.x + m.u * kS, Y = p.y + m.v * kS, a = m.age < 2 ? 1 : 1 - (m.age - 2) / .6;
      const s = 9 * ease.outBack(Math.min(1, m.age / .25));
      ctx.save(); ctx.globalAlpha = Math.max(0, a); ctx.translate(X + Math.sin(T * 50) * 3 * m.wob, Y);
      ctx.beginPath(); ctx.moveTo(-s, -s); ctx.lineTo(s, s); ctx.moveTo(s, -s); ctx.lineTo(-s, s); ctx.lineCap = 'round';
      ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.lineWidth = 3.5; ctx.strokeStyle = '#F0473E'; ctx.stroke();
      if (m === coolMark && cool > 0) {
        ctx.beginPath(); ctx.arc(0, 0, 17, -Math.PI / 2, -Math.PI / 2 + TAU * cool / 2); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(240,71,62,.7)'; ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();
    // التلميح
    if (hintD && !hintD.found) drawMagnifier(p.x + hintD.cx * kS, p.y + hintD.cy * kS, Math.max(16, (hintD.r + 6) * kS));
    // توهج الفوز
    if (winT >= 0) {
      const g = .5 + .5 * Math.sin(winT * 5), fp = p.fp;
      ctx.save(); ctx.shadowColor = '#FFE45C'; ctx.shadowBlur = 18 + g * 18; ctx.lineWidth = 5; ctx.strokeStyle = `rgba(255,226,90,${.65 + g * .35})`;
      ctx.beginPath(); ctx.roundRect(p.x - fp, p.y - fp, p.w + fp * 2, p.h + fp * 2, 16); ctx.stroke(); ctx.restore();
      if (winT < 1.2) { ctx.save(); ctx.globalAlpha = (1 - winT / 1.2) * .5; ctx.fillStyle = '#FFFBE0'; ctx.beginPath(); ctx.roundRect(p.x, p.y, p.w, p.h, 8); ctx.fill(); ctx.restore(); }
    }
  }
  function render() {
    if (!ctx) return;
    ctx.save();
    ctx.fillStyle = '#2E8FC9'; ctx.fillRect(0, 0, W, H);
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    if (puz && imgA) pics.forEach((p, i) => drawOverlay(p, i));
    for (const r of rings) {
      const t = r.age / r.life;
      ctx.save(); ctx.globalAlpha = 1 - t; ctx.strokeStyle = '#B6FFC9'; ctx.lineWidth = 5 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r + 8 + t * 26, 0, TAU); ctx.stroke(); ctx.restore();
    }
    for (const f of floats) {
      const p = pics[f.i], a = f.age < 1 ? 1 : 1 - (f.age - 1) / .4, fs = clamp(W * .05, 18, 28);
      ctx.save(); ctx.globalAlpha = a; ctx.font = `900 ${fs}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const X = clamp(p.x + f.u * kS, p.x + 70, p.x + p.w - 70), Y = p.y + f.v * kS - 30 - f.age * 30;
      ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.strokeText(f.t, X, Y); ctx.fillStyle = '#E2558F'; ctx.fillText(f.t, X, Y); ctx.restore();
    }
    for (const q of parts) {
      const a = 1 - q.age / q.life;
      ctx.save(); ctx.globalAlpha = q.t === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillStyle = q.c;
      if (q.t === 'star') { starPath(ctx, 0, 0, q.s * (.6 + a * .5)); ctx.fill(); }
      else if (q.t === 'dot') { ctx.beginPath(); ctx.arc(0, 0, q.s * .45 * a + 1, 0, TAU); ctx.fill(); }
      else { ctx.scale(1, Math.cos(q.age * 9 + q.rot)); ctx.fillRect(-q.s / 2, -q.s * .3, q.s, q.s * .6); }
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
    if (App.current !== ID || !puz) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); render(); }, 60);
  });

  /* ---------- أيقونة القائمة: صورتان صغيرتان وعدسة مكبّرة ---------- */
  function icon(c, s) {
    c.fillStyle = G(c, 0, 0, 0, s, '#3AA0D8', '#8FDCCB'); c.fillRect(0, 0, s, s);
    for (let i = 0; i < 6; i++) circ(c, s * [.12, .88, .2, .8, .5, .1][i], s * [.15, .2, .88, .85, .08, .55][i], s * .03, 'rgba(255,255,255,.35)');
    const sc0 = SCENES[0], fw = s * .4, fh = fw * PH / PW;
    const frame = (cx, cy, rot, objs) => {
      c.save(); c.translate(cx, cy); c.rotate(rot);
      c.save(); c.shadowColor = 'rgba(10,40,80,.4)'; c.shadowBlur = 6; c.shadowOffsetY = 3; rr(c, -fw / 2 - 4, -fh / 2 - 4, fw + 8, fh + 8, 6, '#fff'); c.restore();
      c.save(); c.translate(-fw / 2, -fh / 2); c.beginPath(); c.rect(0, 0, fw, fh); c.clip();
      const old = dpr; paint(c, sc0, objs, fw / PW, 138); dpr = old;
      c.restore(); c.restore();
    };
    const base = sc0.it.map(mkObj), alt = base.map(o => Object.assign({}, o));
    alt[3].c = 1; alt.splice(12, 1);
    frame(s * .3, s * .4, -.12, base);
    frame(s * .68, s * .6, .1, alt);
    // العدسة
    const mx = s * .56, my = s * .44, r = s * .17;
    c.save(); c.translate(mx, my);
    c.save(); c.translate(r * .72, r * .72); c.rotate(-Math.PI / 4);
    c.shadowColor = 'rgba(0,0,0,.3)'; c.shadowBlur = 4; rr(c, -r * .17, 0, r * .34, r * 1.15, r * .12, '#8A4B14'); c.restore();
    c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fillStyle = 'rgba(220,245,255,.35)'; c.fill();
    c.lineWidth = r * .22; c.strokeStyle = '#FFB300'; c.stroke();
    c.lineWidth = r * .07; c.strokeStyle = '#FFF3B0'; c.beginPath(); c.arc(0, 0, r * .86, Math.PI * 1.1, Math.PI * 1.6); c.stroke();
    c.restore();
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'ابحث عن الاختلافات', icon2: '🔍', isNew: true, music: 'diff',
    desc: () => App.g('ابحثي عن 5 فروق بين الصورتين', 'ابحث عن 5 فروق بين الصورتين'),
    help: () => [
      '👀 ' + App.g('قارني', 'قارن') + ' الصورتين جيدًا: بينهما 5 فروق بالضبط',
      '👆 ' + App.g('المسي', 'المس') + ' مكان الفرق في أي صورة لتظهر عليه دائرة خضراء ✅',
      '❌ اللمسة الخاطئة توقف اللعب ثانيتين، ' + App.g('فركّزي', 'فركّز') + ' قبل اللمس!',
      '🔍 زر العدسة يدلّك على فرق واحد (مرّتان في كل صورة)',
      '⭐ ' + App.g('أسرعي', 'أسرع') + ' وبأخطاء أقل لتربح 3 نجوم وتفتح صورًا جديدة 🖼️'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 الصورة ${Math.max(...ks)} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, SCENES.length));
      render(); startLoop();
    },
    leave() { stopLoop(); events = []; lvOv.classList.remove('on'); endOv.classList.remove('on'); },
    pause() { paused = true; },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() { return { lvl, phase, elapsed, mistakes, hintsLeft, cool, pics, kS, diffs: puz ? puz.diffs.map(d => ({ t: d.t, cx: d.cx, cy: d.cy, r: d.r, found: d.found })) : [] }; },
    _setTime(t) { elapsed = t; },
    _start(n) { startLevel(n); }
  });
})();
