/* =====================================================================
   حلويات <اسم اللاعب> — مطابقة ثلاث حلويات بأسلوب مصقول
   لوحة 8×8، ستة أنواع حلوى، حلويات خاصة (مخططة، مغلّفة، قنبلة ألوان)
   ودمجها، جيلي وكرز، 24 مستوى بنجوم، اندفاع السكر في النهاية.
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'candy', TAU = Math.PI * 2, N = 8;
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';
  /* لون أساسي، داكن، فاتح */
  const COL = [
    ['#FF3D5E', '#B0102F', '#FFB8C6'], // حبة جيلي حمراء
    ['#FF9326', '#C24F00', '#FFD9AE'], // معيّن برتقالي
    ['#FFD21F', '#CC8F00', '#FFF4B0'], // نجمة ليمون صفراء
    ['#3FD45C', '#13873A', '#C6F7CF'], // مربع علكة أخضر
    ['#2E9BFF', '#0D55C2', '#BEE2FF'], // قطرة زرقاء
    ['#A65CFF', '#6223BD', '#E5CCFF']  // قرص بنفسجي ملتف
  ];
  const CNAME = ['الحمراء', 'البرتقالية', 'الصفراء', 'الخضراء', 'الزرقاء', 'البنفسجية'];

  /* ---------- المستويات ----------
     الخريطة: '.' خلية، 'x' فراغ، 'j' جيلي، 'J' جيلي مزدوج */
  const M = {
    jc: ['........', '........', '..jjjj..', '..jjjj..', '..jjjj..', '..jjjj..', '........', '........'],
    corners: ['xx....xx', 'x......x', '........', '........', '........', '........', 'x......x', 'xx....xx'],
    jcorn: ['xxjjjjxx', 'xjjjjjjx', 'jj....jj', 'j......j', 'j......j', 'jj....jj', 'xjjjjjjx', 'xxjjjjxx'],
    jfull: ['jjjjjjjj', 'jjjjjjjj', 'jjjjjjjj', 'jjjjjjjj', 'jjjjjjjj', 'jjjjjjjj', 'jjjjjjjj', 'jjjjjjjj'],
    jx: ['jj....jj', 'jjj..jjj', '.jjjjjj.', '..jjjj..', '..jjjj..', '.jjjjjj.', 'jjj..jjj', 'jj....jj'],
    hour: ['........', 'x......x', 'xx....xx', 'xxx..xxx', 'xxx..xxx', 'xx....xx', 'x......x', '........'],
    cross: ['xx....xx', 'xx....xx', '........', '........', '........', '........', 'xx....xx', 'xx....xx'],
    jJ: ['........', '.jjjjjj.', '.jJJJJj.', '.jJ..Jj.', '.jJ..Jj.', '.jJJJJj.', '.jjjjjj.', '........'],
    jbot: ['........', '........', '........', '........', 'jjjjjjjj', 'jjjjjjjj', 'JJJJJJJJ', 'JJJJJJJJ'],
    ring: ['x......x', '........', '..xjjx..', '..jJJj..', '..jJJj..', '..xjjx..', '........', 'x......x'],
    jside: ['jj....jj', 'jj....jj', 'jj....jj', 'jj....jj', 'jj....jj', 'jj....jj', 'jj....jj', 'jj....jj'],
    jJfull: ['JJJJJJJJ', 'JjjjjjjJ', 'Jj....jJ', 'Jj....jJ', 'Jj....jJ', 'Jj....jJ', 'JjjjjjjJ', 'JJJJJJJJ'],
    diam: ['xxx..xxx', 'xx....xx', 'x......x', '........', '........', 'x......x', 'xx....xx', 'xxx..xxx'],
    pillars: ['........', '.x....x.', '.x....x.', '........', '........', '.x....x.', '.x....x.', '........'],
    jhour: ['jjjjjjjj', 'xjjjjjjx', 'xxjjjjxx', 'xxx..xxx', 'xxx..xxx', 'xxjjjjxx', 'xjjjjjjx', 'jjjjjjjj']
  };
  const LEVELS = [
    { moves: 16, colors: 5, goals: [{ k: 'score', n: 2500 }], stars: [2500, 4500, 6500] },
    { moves: 18, colors: 5, goals: [{ k: 'c', t: 0, n: 18 }], stars: [0, 4000, 6000] },
    { moves: 20, colors: 5, goals: [{ k: 'jelly' }], map: M.jc, stars: [0, 4500, 6500] },
    { moves: 20, colors: 5, goals: [{ k: 'c', t: 4, n: 16 }, { k: 'c', t: 2, n: 16 }], stars: [0, 5000, 7500] },
    { moves: 18, colors: 5, goals: [{ k: 'score', n: 3500 }], map: M.corners, stars: [3500, 5500, 7500] },
    { moves: 24, colors: 5, goals: [{ k: 'ing', n: 2 }], ingMax: 1, stars: [0, 5000, 7500] },
    { moves: 22, colors: 5, goals: [{ k: 'jelly' }], map: M.jcorn, stars: [0, 6000, 9000] },
    { moves: 20, colors: 6, goals: [{ k: 'score', n: 3500 }], stars: [3500, 5500, 8000] },
    { moves: 24, colors: 6, goals: [{ k: 'c', t: 0, n: 15 }, { k: 'c', t: 3, n: 15 }, { k: 'c', t: 5, n: 15 }], stars: [0, 5500, 8500] },
    { moves: 32, colors: 5, goals: [{ k: 'jelly' }], map: M.jfull, stars: [0, 8000, 12000] },
    { moves: 24, colors: 5, goals: [{ k: 'ing', n: 3 }], ingMax: 2, map: M.hour, stars: [0, 6000, 9000] },
    { moves: 28, colors: 5, goals: [{ k: 'jelly' }], map: M.jJ, stars: [0, 7000, 10000] },
    { moves: 22, colors: 6, goals: [{ k: 'score', n: 3500 }], map: M.cross, stars: [5000, 7500, 10000] },
    { moves: 30, colors: 5, goals: [{ k: 'jelly' }, { k: 'c', t: 1, n: 20 }], map: M.jx, stars: [0, 7500, 11000] },
    { moves: 32, colors: 5, goals: [{ k: 'ing', n: 2 }, { k: 'jelly' }], ingMax: 1, map: M.jbot, stars: [0, 8000, 12000] },
    { moves: 26, colors: 6, goals: [{ k: 'c', t: 4, n: 20 }, { k: 'c', t: 2, n: 20 }], map: M.pillars, stars: [0, 7000, 10000] },
    { moves: 24, colors: 6, goals: [{ k: 'jelly' }], map: M.ring, stars: [0, 7000, 10000] },
    { moves: 24, colors: 6, goals: [{ k: 'score', n: 4000 }], map: M.diam, stars: [6000, 8500, 11500] },
    { moves: 28, colors: 6, goals: [{ k: 'ing', n: 3 }], ingMax: 2, map: M.corners, stars: [0, 7500, 11000] },
    { moves: 38, colors: 5, goals: [{ k: 'jelly' }], map: M.jJfull, stars: [0, 9000, 13000] },
    { moves: 26, colors: 6, goals: [{ k: 'c', t: 0, n: 22 }, { k: 'c', t: 1, n: 22 }, { k: 'c', t: 5, n: 22 }], stars: [0, 8000, 11500] },
    { moves: 36, colors: 6, goals: [{ k: 'jelly' }, { k: 'ing', n: 2 }], ingMax: 1, map: M.jside, stars: [0, 8500, 12500] },
    { moves: 26, colors: 6, goals: [{ k: 'score', n: 4500 }], map: M.hour, stars: [8000, 11000, 14000] },
    { moves: 38, colors: 6, goals: [{ k: 'jelly' }, { k: 'c', t: 3, n: 22 }], map: M.jhour, stars: [0, 10000, 14000] }
  ];

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  };
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const hexA = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})`; };
  const loadProg = () => { const p = store.get('candyProg', null) || {}; return { unlocked: Math.max(1, p.unlocked || 1), stars: p.stars || {}, best: p.best || {} }; };
  function shuffleArr(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  /* ---------- رسم الحلوى ---------- */
  function roundPoly(c, pts, rad) {
    const n = pts.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const m0 = mid(pts[n - 1], pts[0]); c.moveTo(m0[0], m0[1]);
    for (let i = 0; i < n; i++) { const p = pts[i], m = mid(p, pts[(i + 1) % n]); c.arcTo(p[0], p[1], m[0], m[1], rad); }
    c.closePath();
  }
  function shapePath(c, t, r) {
    c.beginPath();
    switch (t) {
      case 0: c.ellipse(0, 0, r * .95, r * .64, -.6, 0, TAU); break;
      case 1: roundPoly(c, [[0, -r * .98], [r * .9, 0], [0, r * .98], [-r * .9, 0]], r * .26); break;
      case 2: { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, R = i % 2 ? r * .5 : r * 1.0; p.push([Math.cos(a) * R, Math.sin(a) * R + r * .07]); } roundPoly(c, p, r * .13); break; }
      case 3: c.roundRect(-r * .8, -r * .8, r * 1.6, r * 1.6, r * .32); break;
      case 4:
        c.moveTo(0, -r * .98);
        c.bezierCurveTo(r * .22, -r * .62, r * .76, -r * .2, r * .76, r * .24);
        c.arc(0, r * .24, r * .76, 0, Math.PI, false);
        c.bezierCurveTo(-r * .76, -r * .2, -r * .22, -r * .62, 0, -r * .98);
        c.closePath(); break;
      default: c.arc(0, 0, r * .88, 0, TAU);
    }
  }
  function gloss(c, r, x0, y0, rx, ry, rot, a) {
    c.save(); c.translate(x0, y0); c.rotate(rot); c.scale(1, ry / rx);
    const g = c.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(.6, `rgba(255,255,255,${a * .45})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, rx, 0, TAU); c.fill(); c.restore();
  }
  function drawCandy(c, t, sp, r) {
    if (sp === 'c') return drawBomb(c, r);
    if (sp === 'ing') return drawCherry(c, r);
    const k = COL[t];
    c.save();
    if (sp === 'w') { drawWrapper(c, t, r); c.scale(.7, .7); }
    // ظل
    c.save(); c.shadowColor = 'rgba(90,20,60,.38)'; c.shadowBlur = r * .22; c.shadowOffsetY = r * .12;
    shapePath(c, t, r); c.fillStyle = k[1]; c.fill(); c.restore();
    // الجسم
    const g = c.createRadialGradient(-r * .32, -r * .4, r * .05, 0, 0, r * 1.15);
    g.addColorStop(0, k[2]); g.addColorStop(.42, k[0]); g.addColorStop(1, k[1]);
    shapePath(c, t, r); c.fillStyle = g; c.fill();
    c.save(); shapePath(c, t, r); c.clip();
    if (t === 5) { // دوامة
      c.strokeStyle = 'rgba(255,255,255,.42)'; c.lineWidth = r * .16; c.lineCap = 'round'; c.beginPath();
      for (let a = 0; a < 4.6 * Math.PI; a += .12) { const rr = r * .86 * a / (4.6 * Math.PI); c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
      c.stroke();
    } else if (t === 3) { // سكّر على العلكة
      const R = rng(41); c.fillStyle = 'rgba(255,255,255,.55)';
      for (let i = 0; i < 16; i++) { c.beginPath(); c.arc((R() - .5) * r * 1.4, (R() - .5) * r * 1.4, r * (.03 + R() * .03), 0, TAU); c.fill(); }
    } else if (t === 1) { // وجه داخلي
      c.fillStyle = 'rgba(255,240,200,.25)'; c.beginPath(); roundPoly(c, [[0, -r * .55], [r * .5, 0], [0, r * .55], [-r * .5, 0]], r * .12); c.fill();
    }
    if (sp === 'h' || sp === 'v') {
      c.save(); if (sp === 'v') c.rotate(Math.PI / 2);
      for (let y = -r * 1.1; y < r * 1.1; y += r * .38) {
        c.fillStyle = 'rgba(255,255,255,.9)'; c.fillRect(-r * 1.2, y, r * 2.4, r * .15);
        c.fillStyle = hexA(k[1], .35); c.fillRect(-r * 1.2, y + r * .15, r * 2.4, r * .04);
      }
      c.restore();
    }
    // حافة داخلية داكنة
    for (let i = 0; i < 4; i++) { c.lineWidth = r * (.55 - i * .12); c.strokeStyle = hexA(k[1], .1); shapePath(c, t, r); c.stroke(); }
    // ضوء منعكس سفلي
    const g2 = c.createRadialGradient(r * .15, r * .7, 0, r * .15, r * .7, r * .7);
    g2.addColorStop(0, hexA(k[2], .55)); g2.addColorStop(1, hexA(k[2], 0));
    c.fillStyle = g2; c.fillRect(-r * 1.2, -r * 1.2, r * 2.4, r * 2.4);
    c.restore();
    gloss(c, r, -r * .3, -r * .4, r * .42, r * .2, -.55, .9);
    c.fillStyle = 'rgba(255,255,255,.95)'; c.beginPath(); c.ellipse(-r * .42, -r * .44, r * .09, r * .05, -.6, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.arc(r * .38, r * .3, r * .05, 0, TAU); c.fill();
    shapePath(c, t, r); c.lineWidth = r * .05; c.strokeStyle = hexA(k[1], .55); c.stroke();
    c.restore();
  }
  function drawWrapper(c, t, r) {
    const k = COL[t];
    c.save(); c.shadowColor = 'rgba(90,20,60,.3)'; c.shadowBlur = r * .2; c.shadowOffsetY = r * .1;
    for (const s of [-1, 1]) { // أطراف ملتوية
      c.beginPath(); c.moveTo(s * r * .55, 0); c.lineTo(s * r * 1.02, -r * .5); c.quadraticCurveTo(s * r * .9, 0, s * r * 1.02, r * .5); c.closePath();
      const g = c.createLinearGradient(0, -r * .5, 0, r * .5); g.addColorStop(0, k[2]); g.addColorStop(.5, k[0]); g.addColorStop(1, k[1]);
      c.fillStyle = g; c.fill();
    }
    c.restore();
    for (const s of [-1, 1]) {
      c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = r * .05;
      c.beginPath(); c.moveTo(s * r * .62, -r * .05); c.lineTo(s * r * .95, -r * .38); c.moveTo(s * r * .62, r * .05); c.lineTo(s * r * .95, r * .38); c.stroke();
    }
    // غلاف شفاف
    c.beginPath(); c.roundRect(-r * .7, -r * .7, r * 1.4, r * 1.4, r * .3);
    const g = c.createLinearGradient(-r, -r, r, r); g.addColorStop(0, hexA(k[2], .85)); g.addColorStop(.5, hexA(k[0], .55)); g.addColorStop(1, hexA(k[1], .8));
    c.fillStyle = g; c.fill(); c.lineWidth = r * .06; c.strokeStyle = 'rgba(255,255,255,.75)'; c.stroke();
    c.save(); c.beginPath(); c.roundRect(-r * .7, -r * .7, r * 1.4, r * 1.4, r * .3); c.clip();
    c.fillStyle = 'rgba(255,255,255,.35)';
    for (let i = -3; i <= 3; i++) { c.save(); c.rotate(.785); c.fillRect(i * r * .38 - r * .06, -r * 1.2, r * .12, r * 2.4); c.restore(); }
    c.restore();
  }
  function drawBomb(c, r) {
    c.save(); c.shadowColor = 'rgba(60,20,10,.45)'; c.shadowBlur = r * .25; c.shadowOffsetY = r * .12;
    c.fillStyle = '#3A1A0A'; c.beginPath(); c.arc(0, 0, r * .86, 0, TAU); c.fill(); c.restore();
    const g = c.createRadialGradient(-r * .3, -r * .35, r * .05, 0, 0, r * .9);
    g.addColorStop(0, '#B07A52'); g.addColorStop(.45, '#6A3518'); g.addColorStop(1, '#2C1205');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, r * .86, 0, TAU); c.fill();
    const R = rng(9);
    for (let i = 0; i < 22; i++) {
      const a = R() * TAU, d = Math.sqrt(R()) * r * .7;
      c.save(); c.translate(Math.cos(a) * d, Math.sin(a) * d); c.rotate(R() * TAU);
      c.fillStyle = COL[i % 6][0]; c.beginPath(); c.roundRect(-r * .11, -r * .04, r * .22, r * .08, r * .04); c.fill();
      c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(-r * .08, -r * .03, r * .14, r * .02);
      c.restore();
    }
    gloss(c, r, -r * .3, -r * .42, r * .4, r * .18, -.5, .6);
  }
  function drawCherry(c, r) {
    c.save();
    c.strokeStyle = '#4E7A1E'; c.lineWidth = r * .09; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-r * .3, r * .0); c.quadraticCurveTo(-r * .15, -r * .55, r * .12, -r * .85); c.stroke();
    c.beginPath(); c.moveTo(r * .36, -r * .08); c.quadraticCurveTo(r * .3, -r * .5, r * .12, -r * .85); c.stroke();
    c.save(); c.translate(r * .38, -r * .78); c.rotate(-.4);
    const lg = c.createLinearGradient(0, -r * .14, 0, r * .14); lg.addColorStop(0, '#9BE36A'); lg.addColorStop(1, '#3E9A2A');
    c.fillStyle = lg; c.beginPath(); c.ellipse(0, 0, r * .3, r * .13, 0, 0, TAU); c.fill(); c.restore();
    for (const [x, y, rr] of [[-r * .34, r * .32, r * .44], [r * .38, r * .24, r * .41]]) {
      c.save(); c.shadowColor = 'rgba(90,10,20,.4)'; c.shadowBlur = r * .2; c.shadowOffsetY = r * .1;
      const g = c.createRadialGradient(x - rr * .35, y - rr * .4, rr * .05, x, y, rr);
      g.addColorStop(0, '#FF9AA6'); g.addColorStop(.45, '#E8132E'); g.addColorStop(1, '#8A0718');
      c.fillStyle = g; c.beginPath(); c.arc(x, y, rr, 0, TAU); c.fill(); c.restore();
      gloss(c, rr, x - rr * .32, y - rr * .38, rr * .38, rr * .2, -.6, .9);
    }
    c.restore();
  }
  function drawLolly(c, x, y, R, rot) {
    c.save(); c.translate(x, y); c.rotate(rot || 0);
    c.fillStyle = '#FFFFFF'; c.strokeStyle = '#F2C6DA'; c.lineWidth = R * .04;
    c.beginPath(); c.roundRect(-R * .07, 0, R * .14, R * 2.4, R * .07); c.fill(); c.stroke();
    c.save(); c.beginPath(); c.roundRect(-R * .07, 0, R * .14, R * 2.4, R * .07); c.clip();
    c.fillStyle = '#FF7CB8'; for (let i = 0; i < 12; i++) { c.save(); c.translate(0, i * R * .25); c.rotate(-.6); c.fillRect(-R * .3, 0, R * .6, R * .06); c.restore(); }
    c.restore();
    const g = c.createRadialGradient(-R * .3, -R * .35, R * .05, 0, 0, R);
    g.addColorStop(0, '#FFE0F0'); g.addColorStop(.5, '#FF6FB5'); g.addColorStop(1, '#C2307A');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill();
    c.save(); c.beginPath(); c.arc(0, 0, R, 0, TAU); c.clip();
    const cols = ['#FFFFFF', '#FFE45C', '#7FE3FF'];
    for (let j = 0; j < 3; j++) {
      c.strokeStyle = cols[j]; c.globalAlpha = .75; c.lineWidth = R * .14; c.lineCap = 'round'; c.beginPath();
      for (let a = 0; a < 5 * Math.PI; a += .1) { const rr = R * a / (5 * Math.PI); const aa = a + j * TAU / 3; c.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr); }
      c.stroke();
    }
    c.restore(); c.globalAlpha = 1;
    gloss(c, R, -R * .35, -R * .4, R * .45, R * .2, -.6, .85);
    c.restore();
  }

  /* ---------- الواجهة ---------- */
  App.css(`
  #candy{background:#FFDDF0;overflow:hidden}
  #candy canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #candy .bar{gap:6px;padding-left:10px;padding-right:10px}
  #candy .ib{color:#D6247A}
  #candy .chip{color:#8A1F5A;min-width:52px;padding:3px 8px}
  #candy .chip b{color:#E0217F;font-size:17px}
  #candy .chip.low b{color:#F0263A;animation:cdPulse .7s infinite}
  @keyframes cdPulse{50%{opacity:.45}}
  #candy .panel{border-color:#FFD1EA;box-shadow:0 8px 0 #FF9CCB,0 20px 40px rgba(120,20,80,.3);color:#7A1F4E}
  #candy .panel h3{color:#E0217F}
  #candy .btn{background:linear-gradient(#FF7BBE,#FF4FA3);box-shadow:0 4px 0 #C81E72}
  #candy .btn.alt{background:#fff;color:#D6247A;box-shadow:0 4px 0 #FFB3D4;border-color:#FFD6E8}
  #candy .overlay{background:rgba(110,30,90,.35)}
  #candy .lvp{width:min(94vw,440px);max-height:88vh;overflow-y:auto;touch-action:pan-y;background:linear-gradient(#FFF5FB,#F4ECFF)}
  #candy .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:12px 10px;margin:12px 4px 14px}
  #candy .lvb{position:relative;aspect-ratio:1;border-radius:50%;color:#fff;font-weight:900;display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:radial-gradient(circle at 35% 30%,var(--l) 0,var(--c) 45%,var(--d) 100%);box-shadow:0 4px 0 var(--d),0 6px 10px rgba(120,20,80,.2),inset 0 -4px 6px rgba(0,0,0,.12);
    text-shadow:0 2px 0 rgba(0,0,0,.25)}
  #candy .lvb::before{content:'';position:absolute;left:18%;top:12%;width:36%;height:18%;border-radius:50%;background:rgba(255,255,255,.55);transform:rotate(-30deg)}
  #candy .lvb:active{transform:translateY(3px)}
  #candy .lvb .n{font-size:22px;line-height:1}
  #candy .lvb .g{font-size:12px;line-height:1;margin-top:1px}
  #candy .lvb .s{position:absolute;bottom:-9px;font-size:12px;letter-spacing:-2px;line-height:1;text-shadow:none}
  #candy .lvb .s i{font-style:normal}
  #candy .lvb .s i.off{filter:grayscale(1);opacity:.35}
  #candy .lvb.cur{outline:3px dashed #FF4FA3;outline-offset:3px}
  #candy .lvb.lock{--c:#D9CFE0 !important;--d:#B5A8C0 !important;--l:#F2ECF6 !important;color:#8E7FA0;text-shadow:none}
  #candy .lvb.lock .g{display:none}
  #candy .lvb.lock::after{content:'🔒';position:absolute;bottom:-4px;font-size:16px}
  #candy .intro{position:absolute;left:0;right:0;top:40%;display:flex;justify-content:center;pointer-events:none;z-index:6;opacity:0}
  #candy .intro.on{animation:cdIntro 2.3s ease forwards}
  #candy .intro div{background:linear-gradient(#fff,#FFF0F8);border:4px solid #FFC2E2;border-radius:26px;padding:10px 24px;text-align:center;box-shadow:0 8px 0 #FF9CCB,0 14px 30px rgba(120,20,80,.3);color:#7A1F4E;max-width:86vw}
  #candy .intro b{display:block;font-size:26px;color:#E0217F;line-height:1.2}
  #candy .intro span{font-size:16px;font-weight:700}
  @keyframes cdIntro{0%{opacity:0;transform:scale(.5)}12%{opacity:1;transform:scale(1.06)}18%{transform:scale(1)}82%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-30px)}}
  #candy .wsc{font-size:20px;font-weight:800;margin:2px 0 10px}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🗺️</button>
      <span class="grow"></span>
      <div class="chip"><small>المستوى</small><b class="cLv">1</b></div>
      <div class="chip cMvC"><small>الحركات</small><b class="cMv">0</b></div>
      <div class="chip"><small>النقاط</small><b class="cSc">0</b></div>
    </div>
    <div class="intro"><div><b class="iT"></b><span class="iG"></span></div></div>
    <div class="overlay" id="cdLv"><div class="panel lvp"><h3>🗺️ طريق الحلوى</h3><div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="cdWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><div class="wsc"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🗺️ المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>
    <div class="overlay" id="cdFail"><div class="panel">
      <h3>${'نفدت الحركات! 🍬'}</h3><div class="big" style="font-size:54px">😢</div><p class="fP"></p>
      <button class="btn" data-a="again">🔄 إعادة</button><br>
      <button class="btn alt" data-a="levels">🗺️ المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const bar = root.querySelector('.bar');
  const lvOv = root.querySelector('#cdLv'), winOv = root.querySelector('#cdWin'), failOv = root.querySelector('#cdFail');
  const introEl = root.querySelector('.intro');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, cs = 48, bx = 0, by = 0, gp = { x: 0, y: 0, w: 0, h: 0 };
  let bgLayer = null, sprites = {}, raf = 0, last = 0, T = 0, running = false, paused = false, speed = 1;
  let lvl = 1, L = null, grid = [], hole = [], jelly = [], moves = 0, score = 0, gcount = [0, 0, 0, 0, 0, 0], jellyLeft = 0, ingDone = 0, ingSpawned = 0;
  let busy = false, over = false, gen = 0, sel = null, drag = null, hintMove = null, idleT = 0, kb = null, kbOn = false;
  let pops = [], parts = [], beams = [], rings = [], bolts = [], texts = [], timers = [], waiters = [], flyers = [], jpops = [];
  let shake = 0, uid = 0, landSnd = 0, popSnd = 0, goalPos = [], shownScore = 0, rushing = false, winTimer = 0;

  const mkC = (t, sp = '') => ({ id: ++uid, t, sp, x: 0, y: 0, tr: 0, vy: 0, fall: false, tw: null, sq: 0, sqv: 0, born: 0, armed: false, fired: false });
  const valid = (r, c) => r >= 0 && r < N && c >= 0 && c < N && !hole[r][c];
  const colorOf = cd => cd && cd.sp !== 'c' && cd.sp !== 'ing' ? cd.t : -1;
  const isSW = cd => cd && (cd.sp === 'h' || cd.sp === 'v' || cd.sp === 'w');
  const randColor = () => Math.floor(Math.random() * L.colors);
  const wait = s => new Promise(res => timers.push({ t: s, res }));
  const until = fn => new Promise(res => waiters.push({ fn, res }));
  const cellX = c => bx + (c + .5) * cs, cellY = r => by + (r + .5) * cs;

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const top = bar.getBoundingClientRect().bottom - root.getBoundingClientRect().top + 6;
    const gpH = 74, gap = 12, bottomPad = 14;
    const availW = Math.min(W - 18, 640), availH = H - top - gpH - gap - bottomPad;
    cs = Math.max(26, Math.floor(Math.min(availW / N, availH / N, 72)));
    const bw = cs * N; bx = Math.round((W - bw) / 2);
    const total = gpH + gap + bw, extra = Math.max(0, H - top - bottomPad - total);
    const y0 = top + extra * .32;
    gp = { x: bx, y: y0, w: bw, h: gpH };
    by = Math.round(y0 + gpH + gap);
    sprites = {};
    introEl.style.top = (by + bw / 2 - 50) + 'px';
    buildBg();
  }
  function sprite(t, sp) {
    const key = sp === 'c' || sp === 'ing' ? sp : t + sp;
    let s = sprites[key];
    if (!s) {
      const sz = cs * 1.3, P = Math.ceil(sz * dpr);
      s = mk(P, P); const x = s.getContext('2d'); x.translate(P / 2, P / 2); x.scale(dpr, dpr);
      drawCandy(x, t, sp, cs * .43); s.sz = sz; sprites[key] = s;
    }
    return s;
  }

  /* ---------- الخلفية واللوحة ---------- */
  function cloud(x, cx, cy, s, a) {
    x.fillStyle = `rgba(255,255,255,${a})`;
    [[-.5, .1, .35], [-.15, -.15, .45], [.3, -.05, .4], [.6, .15, .28]].forEach(([dx, dy, r]) => { x.beginPath(); x.arc(cx + dx * s, cy + dy * s, r * s, 0, TAU); x.fill(); });
    x.beginPath(); x.roundRect(cx - .8 * s, cy, 1.6 * s, .45 * s, .22 * s); x.fill();
  }
  function buildBg() {
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    let g = x.createLinearGradient(0, 0, W * .3, H);
    g.addColorStop(0, '#FFD3EC'); g.addColorStop(.45, '#EBD8FF'); g.addColorStop(1, '#C6F4E4');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (const [px, py, pr, col] of [[.15, .2, .5, 'rgba(255,255,255,.45)'], [.9, .55, .45, 'rgba(255,190,230,.4)'], [.3, .9, .5, 'rgba(180,255,230,.45)']]) {
      const rg = x.createRadialGradient(W * px, H * py, 0, W * px, H * py, Math.max(W, H) * pr);
      rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = rg; x.fillRect(0, 0, W, H);
    }
    const R = rng(13);
    for (let i = 0; i < Math.ceil(W / 160) + 2; i++) cloud(x, R() * W, 40 + R() * H * .35, 34 + R() * 30, .55 + R() * .3);
    // تلال حلوى
    const hill = (yb, amp, col, fro, ph) => {
      x.beginPath(); x.moveTo(0, H);
      for (let xx = 0; xx <= W + 20; xx += 20) x.lineTo(xx, yb - Math.sin(xx * .008 + ph) * amp - Math.sin(xx * .021 + ph * 2) * amp * .35);
      x.lineTo(W, H); x.closePath(); x.fillStyle = col; x.fill();
      x.beginPath();
      for (let xx = 0; xx <= W + 20; xx += 20) x.lineTo(xx, yb - Math.sin(xx * .008 + ph) * amp - Math.sin(xx * .021 + ph * 2) * amp * .35);
      x.strokeStyle = fro; x.lineWidth = 7; x.lineJoin = 'round'; x.stroke();
    };
    hill(H * .82, 24, '#FFB5D8', 'rgba(255,255,255,.75)', 1);
    // أشجار المصاصات
    const LR = clamp(Math.min(W, H) * .07, 22, 44), bw0 = cs * N, below = H - (by + bw0 + 12), side = bx - 12;
    const lol = [];
    if (side > LR * 2.4) lol.push([side / 2, H * .62, 1.1], [W - side / 2, H * .58, 1.2], [side * .3, H * .84, .75], [W - side * .28, H * .86, .8]);
    if (below > LR * 2.2) {
      const y0 = by + bw0 + 12 + LR * 1.2;
      lol.push([W * .12, y0 + below * .15, 1], [W * .88, y0 + below * .05, 1.1], [W * .32, y0 + below * .45, .75], [W * .7, y0 + below * .5, .8]);
    }
    for (const [px, py, s] of lol) drawLolly(x, px, py, LR * s, (px / W - .5) * .5);
    hill(H * .92, 16, '#A9EBD2', 'rgba(255,255,255,.8)', 3);
    // رشّات ملونة
    for (let i = 0; i < W * H / 9000; i++) {
      x.save(); x.translate(R() * W, R() * H); x.rotate(R() * TAU); x.globalAlpha = .5;
      x.fillStyle = COL[i % 6][0]; x.beginPath(); x.roundRect(-5, -1.6, 10, 3.2, 1.6); x.fill(); x.restore();
    }
    // لوح زجاجي مُصقّع
    const bw = cs * N, pad = Math.max(5, cs * .14);
    const path = new Path2D();
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!hole[r] || !hole[r][c]) path.roundRect(bx + c * cs - pad, by + r * cs - pad, cs + pad * 2, cs + pad * 2, pad * 2);
    const snap = mk(bgLayer.width, bgLayer.height); snap.getContext('2d').drawImage(bgLayer, 0, 0);
    const m = mk(bgLayer.width, bgLayer.height), mx = m.getContext('2d'); mx.setTransform(dpr, 0, 0, dpr, 0, 0);
    mx.fillStyle = '#fff'; mx.fill(path);
    x.save(); x.shadowColor = 'rgba(150,40,110,.35)'; x.shadowBlur = 24; x.shadowOffsetY = 10; x.globalAlpha = .9;
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(m, 0, 0); x.restore();
    x.save(); x.clip(path); x.filter = 'blur(10px)'; x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(snap, 0, 0); x.restore();
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.save(); x.clip(path);
    g = x.createLinearGradient(0, by, 0, by + bw); g.addColorStop(0, 'rgba(255,255,255,.62)'); g.addColorStop(1, 'rgba(255,240,250,.45)');
    x.fillStyle = g; x.fillRect(bx - pad, by - pad, bw + pad * 2, bw + pad * 2);
    x.restore();
    // حواف
    x.save(); x.globalAlpha = .7; x.lineWidth = 2; x.strokeStyle = '#fff';
    const mo = mk(bgLayer.width, bgLayer.height), mox = mo.getContext('2d'); mox.setTransform(dpr, 0, 0, dpr, 0, 0);
    mox.lineWidth = 5; mox.strokeStyle = 'rgba(255,255,255,.95)'; mox.stroke(path); mox.globalCompositeOperation = 'destination-out'; mox.fill(path);
    x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(mo, 0, 0); x.restore();
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    // خلايا مربعات
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      if (hole[r] && hole[r][c]) continue;
      x.fillStyle = (r + c) % 2 ? 'rgba(255,255,255,.55)' : 'rgba(236,200,255,.38)';
      x.beginPath(); x.roundRect(bx + c * cs + 1.5, by + r * cs + 1.5, cs - 3, cs - 3, cs * .16); x.fill();
    }
  }

  /* ---------- المطابقة ---------- */
  function matchAt(r, c) {
    const t = colorOf(grid[r][c]); if (t < 0) return false;
    let a = c, b = c; while (a > 0 && colorOf(grid[r][a - 1]) === t) a--; while (b < N - 1 && colorOf(grid[r][b + 1]) === t) b++;
    if (b - a >= 2) return true;
    a = r; b = r; while (a > 0 && colorOf(grid[a - 1][c]) === t) a--; while (b < N - 1 && colorOf(grid[b + 1][c]) === t) b++;
    return b - a >= 2;
  }
  function findGroups() {
    const runs = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N;) {
      const t = colorOf(grid[r][c]); let e = c + 1;
      if (t >= 0) { while (e < N && colorOf(grid[r][e]) === t) e++; if (e - c >= 3) runs.push({ dir: 'h', t, cells: Array.from({ length: e - c }, (_, i) => [r, c + i]) }); }
      c = e;
    }
    for (let c = 0; c < N; c++) for (let r = 0; r < N;) {
      const t = colorOf(grid[r][c]); let e = r + 1;
      if (t >= 0) { while (e < N && colorOf(grid[e][c]) === t) e++; if (e - r >= 3) runs.push({ dir: 'v', t, cells: Array.from({ length: e - r }, (_, i) => [r + i, c]) }); }
      r = e;
    }
    let groups = [];
    for (const run of runs) {
      const keys = run.cells.map(([r, c]) => r * N + c);
      const hit = groups.filter(g => g.t === run.t && keys.some(k => g.keys.has(k)));
      const ng = { t: run.t, keys: new Set(keys), runs: [run] };
      for (const g of hit) { g.keys.forEach(k => ng.keys.add(k)); ng.runs.push(...g.runs); }
      groups = groups.filter(g => !hit.includes(g)); groups.push(ng);
    }
    return groups;
  }
  function findMoves() {
    const res = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      if (!valid(r, c) || !grid[r][c]) continue;
      for (const [dr, dc] of [[0, 1], [1, 0]]) {
        const r2 = r + dr, c2 = c + dc;
        if (!valid(r2, c2) || !grid[r2][c2]) continue;
        const A = grid[r][c], B = grid[r2][c2];
        if (A.sp === 'ing' && B.sp === 'ing') continue;
        if ((A.sp === 'c' && B.sp !== 'ing') || (B.sp === 'c' && A.sp !== 'ing') || (isSW(A) && isSW(B))) { res.push([[r, c], [r2, c2]]); continue; }
        grid[r][c] = B; grid[r2][c2] = A;
        if (matchAt(r, c) || matchAt(r2, c2)) res.push([[r, c], [r2, c2]]);
        grid[r][c] = A; grid[r2][c2] = B;
      }
    }
    return res;
  }

  /* ---------- المستوى ---------- */
  function fillBoard() {
    for (let tries = 0; tries < 50; tries++) {
      grid = [];
      for (let r = 0; r < N; r++) {
        grid.push([]);
        for (let c = 0; c < N; c++) {
          if (hole[r][c]) { grid[r].push(null); continue; }
          let t, k = 0;
          do t = randColor(); while (k++ < 30 && ((c >= 2 && colorOf(grid[r][c - 1]) === t && colorOf(grid[r][c - 2]) === t) || (r >= 2 && colorOf(grid[r - 1][c]) === t && colorOf(grid[r - 2][c]) === t)));
          const cd = mkC(t); cd.x = c; cd.y = r; cd.tr = r; grid[r].push(cd);
        }
      }
      if (findMoves().length >= 3 && !findGroups().length) return;
    }
  }
  const goalOf = k => L.goals.find(g => g.k === k);
  function startLevel(n) {
    gen++; timers = []; waiters = [];
    clearTimeout(winTimer);
    lvl = clamp(n, 1, LEVELS.length); L = LEVELS[lvl - 1];
    winOv.classList.remove('on'); failOv.classList.remove('on'); lvOv.classList.remove('on');
    hole = []; jelly = []; jellyLeft = 0;
    for (let r = 0; r < N; r++) {
      hole.push([]); jelly.push([]);
      for (let c = 0; c < N; c++) {
        const ch = L.map ? L.map[r][c] : '.';
        hole[r].push(ch === 'x'); const j = ch === 'j' ? 1 : ch === 'J' ? 2 : 0;
        jelly[r].push(j); if (j) jellyLeft++;
      }
    }
    moves = L.moves; score = 0; shownScore = 0; gcount = [0, 0, 0, 0, 0, 0]; ingDone = 0; ingSpawned = 0;
    over = false; busy = true; sel = null; drag = null; hintMove = null; idleT = 0; rushing = false;
    pops = []; parts = []; beams = []; rings = []; bolts = []; texts = []; flyers = []; jpops = [];
    fillBoard();
    const ig = goalOf('ing');
    if (ig) {
      const cols = shuffleArr([...Array(N).keys()]);
      let placed = 0;
      for (const c of cols) {
        if (placed >= Math.min(L.ingMax || 1, ig.n)) break;
        for (let r = 2; r < N; r++) if (valid(r, c)) { const cd = mkC(-1, 'ing'); cd.x = c; cd.y = r; cd.tr = r; grid[r][c] = cd; placed++; ingSpawned++; break; }
      }
    }
    layout();
    // دخول الحلوى من الأعلى
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const cd = grid[r][c]; if (!cd) continue; cd.y = r - N - 1 - (N - r) * .35 - c * .12; cd.tr = r; cd.fall = true; cd.vy = 0; }
    const g = gen;
    until(() => !anyFalling()).then(() => { if (g === gen) { busy = false; idleT = 0; } });
    updChips();
    root.querySelector('.iT').textContent = `المستوى ${lvl}`;
    root.querySelector('.iG').textContent = goalText();
    introEl.classList.remove('on'); void introEl.offsetWidth; introEl.classList.add('on');
    Sound.whoosh();
  }
  function goalText() {
    return L.goals.map(g => {
      if (g.k === 'score') return `${App.g('اجمعي', 'اجمع')} ${g.n} نقطة 🎯`;
      if (g.k === 'c') return `${App.g('اجمعي', 'اجمع')} ${g.n} من الحلوى ${CNAME[g.t]}`;
      if (g.k === 'jelly') return `${App.g('أزيلي', 'أزِل')} كل الجيلي الوردي`;
      return `${App.g('أنزلي', 'أنزِل')} ${g.n} كرز إلى الأسفل 🍒`;
    }).join(' و');
  }
  function goalDone(g) {
    if (g.k === 'score') return score >= g.n;
    if (g.k === 'c') return gcount[g.t] >= g.n;
    if (g.k === 'jelly') return jellyLeft <= 0;
    return ingDone >= g.n;
  }
  const goalsMet = () => L.goals.every(goalDone);
  function updChips() {
    root.querySelector('.cLv').textContent = lvl;
    root.querySelector('.cMv').textContent = moves;
    root.querySelector('.cMvC').classList.toggle('low', moves <= 5 && !over && !rushing);
  }
  function anyFalling() {
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const cd = grid[r][c]; if (cd && (cd.fall || cd.tw)) return true; }
    return false;
  }

  /* ---------- المؤثرات ---------- */
  function word(text, col) { texts.push({ text, x: bx + cs * N / 2, y: by + cs * N * .42, t: 0, life: 1.3, size: Math.min(64, cs * 1.25), big: true, col: col || '#FF3D9A' }); }
  function ftext(text, x, y, col) { texts.push({ text, x, y, t: 0, life: .95, size: Math.max(16, cs * .42), col }); }
  function burst(x, y, col, n = 10) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU), v = rand(80, 280) * cs / 48;
      parts.push({ k: i % 3 ? 'shard' : 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, rot: rand(0, TAU), vr: rand(-9, 9), age: 0, life: rand(.45, .8), s: rand(3, 7) * cs / 48, c: i % 3 ? col : '#FFFFFF' });
    }
  }
  function tween(cd, c, r, d) { cd.tw = { fx: cd.x, fy: cd.y, tx: c, ty: r, t: 0, d }; }

  /* ---------- الإزالة ---------- */
  function mostCommon() {
    const n = [0, 0, 0, 0, 0, 0];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const t = colorOf(grid[r][c]); if (t >= 0) n[t]++; }
    let b = 0; for (let i = 1; i < 6; i++) if (n[i] > n[b]) b = i; return b;
  }
  async function clearCells(list, opts = {}) {
    const g = gen, mult = opts.mult || 1;
    const map = new Map(), q = [], keep = new Set();
    const add = (r, c, d) => { if (!valid(r, c)) return; const k = r * N + c; if (map.has(k) && map.get(k) <= d) return; map.set(k, d); q.push([r, c, d]); };
    list.forEach(([r, c, d]) => add(r, c, d || 0));
    let fx = { s: 0, w: 0, c: 0 };
    while (q.length) {
      const [r, c, d] = q.shift(), cd = grid[r][c];
      if (!cd || cd.fired || !cd.sp || cd.sp === 'ing') continue;
      cd.fired = true;
      if (cd.sp === 'h' || cd.sp === 'v') {
        beams.push({ dir: cd.sp, r, c, t: -d, col: COL[cd.t][0] }); fx.s++;
        for (let i = 0; i < N; i++) cd.sp === 'h' ? add(r, i, d + Math.abs(i - c) * .035 + .03) : add(i, c, d + Math.abs(i - r) * .035 + .03);
      } else if (cd.sp === 'w') {
        const R = cd.big ? 2 : 1;
        rings.push({ x: cellX(c), y: cellY(r), t: -d, life: .5, R: cs * (R + 1.2), col: COL[cd.t][0] }); fx.w++;
        for (let dr = -R; dr <= R; dr++) for (let dc = -R; dc <= R; dc++) if (dr || dc) add(r + dr, c + dc, d + .06);
        if (!cd.armed) keep.add(cd);
      } else if (cd.sp === 'c') {
        const t = opts.colorT != null ? opts.colorT : mostCommon(); fx.c++;
        for (let rr = 0; rr < N; rr++) for (let cc = 0; cc < N; cc++) if (colorOf(grid[rr][cc]) === t) {
          const dd = d + .08 + Math.hypot(rr - r, cc - c) * .03; add(rr, cc, dd);
          bolts.push({ x1: cellX(c), y1: cellY(r), x2: cellX(cc), y2: cellY(rr), t: -d, life: .5 + dd - d, col: COL[t][0] });
        }
      }
    }
    if (fx.s) { Sound.whoosh(); Sound.tone(900, .25, 'triangle', .08, -500); }
    if (fx.w) { Sound.boom(); shake = Math.max(shake, 7); vibrate(30); }
    if (fx.c) { [523, 784, 1047, 1568].forEach((f, i) => Sound.tone(f, .2, 'sine', .1, 200, i * .05)); shake = Math.max(shake, 5); }
    let maxD = 0, pts = 0, sx = 0, sy = 0, cnt = 0;
    for (const [k, d] of map) {
      const r = k / N | 0, c = k % N; maxD = Math.max(maxD, d);
      if (jelly[r][c] > 0) {
        jelly[r][c]--; if (!jelly[r][c]) jellyLeft--;
        jpops.push({ r, c, t: -d, dbl: jelly[r][c] > 0 }); pts += 100;
      }
      const cd = grid[r][c];
      if (!cd || cd.sp === 'ing' || keep.has(cd)) continue;
      grid[r][c] = null;
      pops.push({ cd, x: cd.x, y: cd.y, t: -d });
      if (cd.t >= 0 && cd.sp !== 'c') {
        gcount[cd.t]++;
        const gi = L.goals.findIndex(gg => gg.k === 'c' && gg.t === cd.t);
        if (gi >= 0 && gcount[cd.t] <= L.goals[gi].n && flyers.length < 40) flyers.push({ spr: [cd.t, ''], x: cellX(c), y: cellY(r), gi, t: -d - .15, d: .55 });
      }
      const p = (opts.match && opts.match.has(k) ? 30 : 60) * mult;
      pts += p; sx += cellX(c); sy += cellY(r); cnt++;
    }
    keep.forEach(cd => { cd.armed = true; cd.fired = false; });
    for (const s of opts.create || []) {
      if (grid[s.r][s.c]) continue;
      const n = mkC(s.t, s.sp); n.x = s.c; n.y = s.r; n.tr = s.r; n.born = 1; grid[s.r][s.c] = n;
      pts += s.sp === 'c' ? 300 : s.sp === 'w' ? 200 : 120;
    }
    score += pts;
    if (pts && !opts.match && cnt) ftext('+' + pts, sx / cnt, sy / cnt, '#FFFFFF');
    else if (pts && opts.match && opts.label) for (const lb of opts.label) ftext('+' + lb.p * mult, lb.x, lb.y, lb.col);
    await wait(maxD + .26);
    if (g !== gen) return;
  }
  async function clearMatches(groups, swapCells, cascade) {
    const list = [], create = [], match = new Set(), label = [];
    for (const gr of groups) {
      const maxLen = Math.max(...gr.runs.map(r => r.cells.length));
      const hasH = gr.runs.some(r => r.dir === 'h'), hasV = gr.runs.some(r => r.dir === 'v');
      let sp = '';
      if (maxLen >= 5) sp = 'c'; else if (hasH && hasV) sp = 'w'; else if (maxLen === 4) sp = gr.runs[0].dir === 'h' ? 'v' : 'h';
      let pos = null;
      if (sp) {
        if (swapCells) for (const [r, c] of swapCells) if (gr.keys.has(r * N + c)) { pos = [r, c]; break; }
        if (!pos && sp === 'w') {
          const hk = new Set(); gr.runs.filter(r => r.dir === 'h').forEach(r => r.cells.forEach(([a, b]) => hk.add(a * N + b)));
          for (const run of gr.runs) if (run.dir === 'v') for (const [a, b] of run.cells) if (hk.has(a * N + b)) { pos = [a, b]; break; }
        }
        if (!pos) { const run = gr.runs.reduce((a, b) => b.cells.length > a.cells.length ? b : a); pos = run.cells[Math.floor(run.cells.length / 2)]; }
        create.push({ r: pos[0], c: pos[1], t: gr.t, sp });
      }
      let sx = 0, sy = 0;
      gr.keys.forEach(k => { const r = k / N | 0, c = k % N; list.push([r, c, 0]); match.add(k); sx += cellX(c); sy += cellY(r); });
      label.push({ p: gr.keys.size * 30 + (sp ? (sp === 'c' ? 300 : sp === 'w' ? 200 : 120) : 0), x: sx / gr.keys.size, y: sy / gr.keys.size, col: COL[gr.t][0] });
    }
    const f = 440 * Math.pow(1.122, Math.min(cascade - 1, 12));
    Sound.tone(f, .14, 'sine', .16, f * .4); Sound.tone(f * 1.5, .16, 'triangle', .06, 0, .04); Sound.noise(.06, 2000, 3500, .05, 2);
    if (create.length) {
      Sound.star(); vibrate(20);
      if (!rushing) App.achieve('candy_special');
    }
    if (cascade >= 2) {
      const ws = ['حلو!', 'رائع!', 'مذهل!', 'خيالي!', 'لذيذ جدًا!'];
      word(ws[Math.min(cascade - 2, ws.length - 1)], ['#FF3D9A', '#9B4DFF', '#FF8A1F', '#1FA8FF', '#2BC46A'][(cascade - 2) % 5]);
    }
    await clearCells(list, { mult: cascade, create, match, label });
  }

  /* ---------- الجاذبية ---------- */
  async function gravity() {
    const g = gen;
    let ingNow = 0;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (grid[r][c] && grid[r][c].sp === 'ing') ingNow++;
    const ig = goalOf('ing');
    let wantIng = ig && ingSpawned < ig.n && ingNow < (L.ingMax || 1) && ingDone + ingNow < ig.n;
    const cols = shuffleArr([...Array(N).keys()]);
    for (const c of cols) {
      const rows = []; for (let r = N - 1; r >= 0; r--) if (!hole[r][c]) rows.push(r);
      const cds = []; for (const r of rows) if (grid[r][c]) cds.push(grid[r][c]);
      rows.forEach(r => { grid[r][c] = null; });
      cds.forEach((cd, i) => { const r = rows[i]; grid[r][c] = cd; cd.tr = r; if (cd.y < r - .001) cd.fall = true; });
      for (let i = cds.length, k = 0; i < rows.length; i++, k++) {
        const r = rows[i];
        let cd;
        if (wantIng && i === rows.length - 1) { cd = mkC(-1, 'ing'); wantIng = false; ingSpawned++; }
        else cd = mkC(randColor());
        cd.x = c; cd.y = -1 - k; cd.tr = r; cd.fall = true; cd.vy = rand(0, .5);
        grid[r][c] = cd;
      }
    }
    await until(() => !anyFalling());
    if (g !== gen) return;
    await wait(.03);
  }
  function collectIng() {
    let n = 0;
    for (let c = 0; c < N; c++) {
      let r = N - 1; while (r >= 0 && hole[r][c]) r--;
      if (r < 0) continue;
      const cd = grid[r][c];
      if (cd && cd.sp === 'ing') {
        grid[r][c] = null; ingDone++; n++; score += 500;
        const gi = L.goals.findIndex(g => g.k === 'ing');
        flyers.push({ spr: [-1, 'ing'], x: cellX(c), y: cellY(r), gi, t: 0, d: .7, big: true });
        burst(cellX(c), cellY(r), '#FF3D5E', 16); ftext('+500', cellX(c), cellY(r) - cs * .4, '#FF3D5E');
        Sound.star(); vibrate(25);
      }
    }
    return n;
  }
  async function resolveLoop(swapCells) {
    const g = gen; let cascade = 0;
    for (let guard = 0; guard < 80; guard++) {
      const armed = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const cd = grid[r][c]; if (cd && cd.armed && !cd.fired) armed.push([r, c, 0]); }
      if (armed.length) { await clearCells(armed, { mult: Math.max(1, cascade) }); if (g !== gen) return; await gravity(); if (g !== gen) return; continue; }
      if (collectIng()) { await wait(.2); if (g !== gen) return; await gravity(); if (g !== gen) return; continue; }
      const groups = findGroups();
      if (!groups.length) break;
      cascade++;
      await clearMatches(groups, swapCells, cascade); if (g !== gen) return;
      swapCells = null;
      await gravity(); if (g !== gen) return;
    }
  }

  /* ---------- التبديل ---------- */
  async function trySwap(a, b) {
    if (busy || over) return;
    if (!valid(a[0], a[1]) || !valid(b[0], b[1])) return;
    const A = grid[a[0]][a[1]], B = grid[b[0]][b[1]]; if (!A || !B) return;
    busy = true; const g = gen; hintMove = null; idleT = 0; sel = null;
    Sound.slide(); Sound.tone(520, .07, 'sine', .08, 200);
    grid[a[0]][a[1]] = B; grid[b[0]][b[1]] = A;
    tween(A, b[1], b[0], .17); tween(B, a[1], a[0], .17);
    await wait(.18); if (g !== gen) return;
    let combo = null;
    if ((A.sp === 'c' || B.sp === 'c') && A.sp !== 'ing' && B.sp !== 'ing') combo = 'c';
    else if (isSW(A) && isSW(B)) combo = 's';
    if (!combo && !matchAt(a[0], a[1]) && !matchAt(b[0], b[1]) && A.sp !== 'ing' && B.sp !== 'ing') {
      Sound.error(); vibrate(15);
      grid[a[0]][a[1]] = A; grid[b[0]][b[1]] = B;
      tween(A, a[1], a[0], .2); tween(B, b[1], b[0], .2); A.sq = -.12; B.sq = -.12;
      await wait(.21); if (g !== gen) return;
      busy = false; return;
    }
    moves--; updChips();
    if (combo) await doCombo(A, B, a, b);
    if (g !== gen) return;
    await resolveLoop([a, b]);
    if (g !== gen) return;
    await afterMove(g);
  }
  async function doCombo(A, B, pa, pb) {
    // بعد التبديل: A في pb و B في pa
    const g = gen; let list = [];
    const all = (fn) => { for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (valid(r, c)) fn(r, c); };
    A.fired = B.fired = true;
    if (A.sp === 'c' && B.sp === 'c') {
      word('مذهل!', '#9B4DFF'); shake = 10; Sound.boom();
      all((r, c) => list.push([r, c, .1 + Math.hypot(r - pb[0], c - pb[1]) * .05]));
      rings.push({ x: cellX(pb[1]), y: cellY(pb[0]), t: 0, life: .8, R: cs * N, col: '#FFFFFF' });
    } else if (A.sp === 'c' || B.sp === 'c') {
      const bomb = A.sp === 'c' ? A : B, other = bomb === A ? B : A;
      const bp = bomb === A ? pb : pa, op = bomb === A ? pa : pb, t = other.t;
      if (isSW(other)) {
        word('رائع!', '#FF8A1F');
        const conv = [];
        all((r, c) => { const cd = grid[r][c]; if (cd && cd !== other && colorOf(cd) === t && !cd.sp) conv.push([r, c]); });
        conv.forEach(([r, c], i) => {
          const cd = grid[r][c]; cd.sp = other.sp === 'w' ? 'w' : (Math.random() < .5 ? 'h' : 'v'); cd.born = 1;
          bolts.push({ x1: cellX(bp[1]), y1: cellY(bp[0]), x2: cellX(c), y2: cellY(r), t: -i * .03, life: .5, col: COL[t][0] });
        });
        Sound.star();
        await wait(.6); if (g !== gen) return;
        other.fired = false;
        list = conv.map(([r, c], i) => [r, c, i * .06]); list.push([op[0], op[1], 0], [bp[0], bp[1], 0]);
      } else {
        all((r, c) => { if (colorOf(grid[r][c]) === t) { const d = .1 + Math.hypot(r - bp[0], c - bp[1]) * .03; list.push([r, c, d]); bolts.push({ x1: cellX(bp[1]), y1: cellY(bp[0]), x2: cellX(c), y2: cellY(r), t: 0, life: .5 + d, col: COL[t][0] }); } });
        list.push([bp[0], bp[1], 0]);
        [523, 784, 1047, 1568].forEach((f, i) => Sound.tone(f, .2, 'sine', .1, 200, i * .05)); shake = 5;
      }
    } else {
      const [r0, c0] = pb, s = [A.sp, B.sp];
      const nw = s.filter(x => x === 'w').length;
      if (nw === 0) { // مخطّطة + مخطّطة = صليب
        word('رائع!', '#1FA8FF');
        beams.push({ dir: 'h', r: r0, c: c0, t: 0, col: COL[A.t][0] }, { dir: 'v', r: r0, c: c0, t: 0, col: COL[B.t][0] });
        for (let i = 0; i < N; i++) { list.push([r0, i, Math.abs(i - c0) * .035], [i, c0, Math.abs(i - r0) * .035]); }
        Sound.whoosh();
      } else if (nw === 1) { // مخطّطة + مغلّفة = صليب عريض
        word('مذهل!', '#FF3D9A'); shake = 8;
        for (let k = -1; k <= 1; k++) {
          beams.push({ dir: 'h', r: r0 + k, c: c0, t: 0, col: COL[A.t][0], w: 1 }, { dir: 'v', r: r0, c: c0 + k, t: 0, col: COL[B.t][0], w: 1 });
          for (let i = 0; i < N; i++) list.push([r0 + k, i, Math.abs(i - c0) * .035], [i, c0 + k, Math.abs(i - r0) * .035]);
        }
        Sound.whoosh(); Sound.boom();
      } else { // مغلّفة + مغلّفة = انفجار 5×5
        word('بووم!', '#FF8A1F'); shake = 12; Sound.boom();
        rings.push({ x: cellX(c0), y: cellY(r0), t: 0, life: .6, R: cs * 3.5, col: '#FFB347' });
        for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) list.push([r0 + dr, c0 + dc, .05]);
      }
      list.push([pa[0], pa[1], 0], [pb[0], pb[1], 0]);
    }
    await clearCells(list, { mult: 1, colorT: undefined });
    if (g !== gen) return;
    await gravity();
  }
  async function afterMove(g) {
    if (goalsMet()) { await sugarRush(g); if (g !== gen) return; win(); return; }
    if (moves <= 0) { fail(); return; }
    if (!findMoves().length) { await shuffleBoard(); if (g !== gen) return; }
    busy = false; idleT = 0;
  }
  async function shuffleBoard() {
    const g = gen;
    word(App.g('لنخلط!', 'لنخلط!'), '#9B4DFF'); Sound.whoosh();
    const pos = [], cds = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const cd = grid[r][c]; if (cd && cd.sp !== 'ing') { pos.push([r, c]); cds.push(cd); } }
    for (let tries = 0; tries < 300; tries++) {
      shuffleArr(cds);
      pos.forEach(([r, c], i) => { grid[r][c] = cds[i]; });
      if (!findGroups().length && findMoves().length) break;
      if (tries > 150) cds.forEach(cd => { if (!cd.sp) cd.t = randColor(); });
    }
    await wait(.5); if (g !== gen) return;
    pos.forEach(([r, c]) => { const cd = grid[r][c]; tween(cd, c, r, .55); });
    await wait(.6);
  }
  async function sugarRush(g) {
    rushing = true; updChips();
    await wait(.35); if (g !== gen) return;
    word(App.g('اندفاع السكر!', 'اندفاع السكر!'), '#FF3D9A');
    Sound.win();
    await wait(.6); if (g !== gen) return;
    const n = Math.min(moves, 15);
    for (let i = 0; i < n; i++) {
      const cand = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const cd = grid[r][c]; if (cd && !cd.sp) cand.push([r, c]); }
      if (!cand.length) break;
      const [r, c] = cand[Math.floor(Math.random() * cand.length)], cd = grid[r][c];
      cd.sp = Math.random() < .5 ? 'h' : 'v'; cd.born = 1;
      moves--; score += 200; updChips();
      burst(cellX(c), cellY(r), COL[cd.t][0], 8); ftext('+200', cellX(c), cellY(r) - cs * .3, '#FFFFFF');
      Sound.tone(600 + i * 60, .1, 'sine', .12, 300);
      await wait(.12); if (g !== gen) return;
    }
    if (moves > 0) { score += moves * 200; moves = 0; updChips(); }
    await wait(.3); if (g !== gen) return;
    for (let k = 0; k < 8; k++) {
      const sp = [];
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const cd = grid[r][c]; if (cd && cd.sp && cd.sp !== 'ing') sp.push([r, c, sp.length * .05]); }
      if (!sp.length) break;
      await clearCells(sp, { mult: 1 }); if (g !== gen) return;
      await gravity(); if (g !== gen) return;
      await resolveLoop(null); if (g !== gen) return;
    }
    await wait(.4);
    rushing = false;
  }

  /* ---------- الفوز والخسارة ---------- */
  function starsFor(s) { const st = L.stars; return s >= st[2] ? 3 : s >= st[1] ? 2 : 1; }
  function win() {
    over = true; busy = true; updChips();
    const pr = loadProg(), stars = starsFor(score), prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    const prevBest = pr.best[lvl] || 0;
    if (score > prevBest) pr.best[lvl] = score;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('candyProg', pr);
    for (let i = 0; i < 150; i++) parts.push({ k: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 260), rot: rand(0, TAU), vr: rand(-8, 8),
      life: rand(2.5, 4), age: 0, s: rand(6, 11), c: COL[i % 6][0] });
    Sound.win(); vibrate(30);
    winTimer = setTimeout(() => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنت!') + ' 🍭';
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wsc').textContent = `🍬 ${score} نقطة`;
      root.querySelector('.wP').textContent = (score > prevBest && prevBest ? '🎉 رقم قياسي جديد! ' : '') + `أفضل نتيجة: ${Math.max(score, prevBest)}`;
      root.querySelector('#cdWin [data-a="next"]').style.display = lvl < LEVELS.length ? '' : 'none';
      winOv.classList.add('on');
      App.speak(App.g('أحسنتِ!', 'أحسنت!'));
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('candy_first');
      if (lvl >= 10) App.achieve('candy_lvl10');
    }, 900);
  }
  function fail() {
    over = true; busy = true; updChips();
    Sound.lose(); vibrate(40);
    const left = L.goals.filter(g => !goalDone(g)).map(g => {
      if (g.k === 'score') return `ينقصك ${g.n - score} نقطة`;
      if (g.k === 'c') return `بقي ${g.n - gcount[g.t]} من الحلوى ${CNAME[g.t]}`;
      if (g.k === 'jelly') return `بقي ${jellyLeft} جيلي`;
      return `بقي ${g.n - ingDone} كرز`;
    }).join(' · ');
    winTimer = setTimeout(() => {
      if (App.current !== ID) return;
      root.querySelector('.fP').textContent = left + ' — ' + App.g('حاولي مرة أخرى!', 'حاول مرة أخرى!');
      failOv.classList.add('on');
    }, 700);
  }
  function openLevels() {
    const pr = loadProg(), g = root.querySelector('.lvg');
    const gi = { score: '🎯', c: '🍬', jelly: '🟪', ing: '🍒' };
    g.innerHTML = LEVELS.map((Lv, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked, k = COL[i % 6];
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" style="--c:${k[0]};--d:${k[1]};--l:${k[2]}" data-l="${n}" aria-label="المستوى ${n}">
        <span class="n">${n}</span><span class="g">${Lv.goals.map(x => gi[x.k]).join('')}</span>
        <span class="s">${lock ? '' : [1, 2, 3].map(q => `<i class="${q <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    g.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); failOv.classList.remove('on'); lvOv.classList.add('on');
    const cur = g.querySelector('.cur'); if (cur) setTimeout(() => cur.scrollIntoView({ block: 'center' }), 30);
  }
  function act(a) {
    Sound.tap();
    if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
    else if (a === 'close') { lvOv.classList.remove('on'); if (over) (goalsMet() ? winOv : failOv).classList.add('on'); }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });

  /* ---------- الإدخال ---------- */
  const overlayOn = () => lvOv.classList.contains('on') || winOv.classList.contains('on') || failOv.classList.contains('on');
  function cellAt(e) {
    const rc = cv.getBoundingClientRect(), x = e.clientX - rc.left, y = e.clientY - rc.top;
    const c = Math.floor((x - bx) / cs), r = Math.floor((y - by) / cs);
    return valid(r, c) ? [r, c] : null;
  }
  const adj = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused || busy || over || overlayOn()) return;
    kbOn = false; idleT = 0; hintMove = null;
    const p = cellAt(e); if (!p || !grid[p[0]][p[1]]) { sel = null; return; }
    if (sel && adj(sel, p)) { const s = sel; sel = null; trySwap(s, p); return; }
    sel = p; drag = { p, x: e.clientX, y: e.clientY, id: e.pointerId };
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    Sound.tap(); const cd = grid[p[0]][p[1]]; cd.sq = -.1;
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.hypot(dx, dy) < cs * .32) return;
    const p = drag.p; drag = null;
    const q = Math.abs(dx) > Math.abs(dy) ? [p[0], p[1] + Math.sign(dx)] : [p[0] + Math.sign(dy), p[1]];
    sel = null;
    if (valid(q[0], q[1]) && grid[q[0]][q[1]]) trySwap(p, q); else { Sound.error(); }
  });
  const endDrag = e => { if (drag && e.pointerId === drag.id) drag = null; };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < LEVELS.length ? 'next' : 'levels'); return; }
    if (failOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act('again'); return; }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? act('close') : openLevels(); return; }
    if (busy || over || overlayOn() || paused) return;
    const D = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
    if (!kb) kb = [3, 3];
    if (D) {
      e.preventDefault(); kbOn = true; idleT = 0;
      if (sel) { const q = [sel[0] + D[0], sel[1] + D[1]], s = sel; sel = null; if (valid(q[0], q[1])) { kb = q; trySwap(s, q); } return; }
      const q = [clamp(kb[0] + D[0], 0, N - 1), clamp(kb[1] + D[1], 0, N - 1)]; kb = q; Sound.tone(700, .03, 'sine', .05);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); kbOn = true;
      if (sel) sel = null; else if (valid(kb[0], kb[1]) && grid[kb[0]][kb[1]]) { sel = kb.slice(); Sound.tap(); }
    }
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    for (let i = timers.length - 1; i >= 0; i--) { const t = timers[i]; t.t -= dt; if (t.t <= 0) { timers.splice(i, 1); t.res(); } }
    landSnd = 0; popSnd = 0;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const cd = grid[r] && grid[r][c]; if (!cd) continue;
      if (cd.tw) {
        const w = cd.tw; w.t += dt; const e = ease.inOut(Math.min(1, w.t / w.d));
        cd.x = w.fx + (w.tx - w.fx) * e; cd.y = w.fy + (w.ty - w.fy) * e;
        if (w.t >= w.d) { cd.x = w.tx; cd.y = w.ty; cd.tw = null; }
      } else if (cd.fall) {
        cd.vy = Math.min(cd.vy + 60 * dt, 18); cd.y += cd.vy * dt; cd.x = c;
        if (cd.y >= cd.tr) {
          cd.y = cd.tr; cd.sqv = -Math.min(cd.vy, 14) * .1; cd.vy = 0; cd.fall = false;
          if (landSnd++ === 0 && cd.y >= 0) Sound.tone(rand(180, 230), .06, 'sine', .05, -60);
        }
      }
      cd.sqv += (-cd.sq * 420 - cd.sqv * 16) * dt; cd.sq += cd.sqv * dt;
      if (cd.born > 0) cd.born = Math.max(0, cd.born - dt * 3.2);
    }
    for (let i = waiters.length - 1; i >= 0; i--) { const w = waiters[i]; if (w.fn()) { waiters.splice(i, 1); w.res(); } }
    for (let i = pops.length - 1; i >= 0; i--) {
      const p = pops[i], was = p.t; p.t += dt;
      if (was < 0 && p.t >= 0) {
        const cd = p.cd, col = cd.sp === 'c' ? '#8B4A22' : COL[cd.t] ? COL[cd.t][0] : '#FF3D5E';
        burst(bx + (p.x + .5) * cs, by + (p.y + .5) * cs, col, cd.sp ? 14 : 8);
        if (popSnd++ < 2) Sound.noise(.05, 1800 + rand(0, 1500), 3200, .04, 2);
      }
      if (p.t > .3) pops.splice(i, 1);
    }
    for (let i = jpops.length - 1; i >= 0; i--) { jpops[i].t += dt; if (jpops[i].t > .5) jpops.splice(i, 1); }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.k === 'conf') { q.vy = Math.min(q.vy + 120 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; }
      else { q.vx *= 1 - dt * 2.5; q.vy = q.vy * (1 - dt * 2.5) + 520 * dt; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
    }
    for (const arr of [beams, rings, bolts]) for (let i = arr.length - 1; i >= 0; i--) { const b = arr[i]; b.t += dt; if (b.t > (b.life || .45)) arr.splice(i, 1); }
    for (let i = texts.length - 1; i >= 0; i--) { const t = texts[i]; t.t += dt; if (t.t > t.life) texts.splice(i, 1); }
    for (let i = flyers.length - 1; i >= 0; i--) { const f = flyers[i]; f.t += dt; if (f.t > f.d) { flyers.splice(i, 1); if (Math.random() < .5) Sound.tone(1200, .05, 'sine', .05); } }
    shake = Math.max(0, shake - dt * 20);
    shownScore += (score - shownScore) * Math.min(1, dt * 8);
    if (Math.abs(score - shownScore) < 1) shownScore = score;
    const sc = Math.round(shownScore), el = root.querySelector('.cSc'); if (el.textContent !== String(sc)) el.textContent = sc;
    if (!busy && !over && !paused && !overlayOn()) {
      idleT += dt;
      if (idleT > 5 && !hintMove) { const mv = findMoves(); if (mv.length) hintMove = mv[Math.floor(Math.random() * mv.length)]; }
    }
  }

  /* ---------- الرسم ---------- */
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  function drawJelly() {
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const j = jelly[r][c]; if (!j || hole[r][c]) continue;
      const x = bx + c * cs + 2.5, y = by + r * cs + 2.5, s = cs - 5;
      const g = ctx.createLinearGradient(x, y, x, y + s);
      if (j >= 2) { g.addColorStop(0, 'rgba(255,90,170,.9)'); g.addColorStop(1, 'rgba(214,36,122,.9)'); }
      else { g.addColorStop(0, 'rgba(255,170,215,.85)'); g.addColorStop(1, 'rgba(255,110,185,.8)'); }
      ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x, y, s, s, cs * .2); ctx.fill();
      ctx.lineWidth = j >= 2 ? 2.5 : 1.5; ctx.strokeStyle = j >= 2 ? 'rgba(255,255,255,.85)' : 'rgba(255,255,255,.6)'; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.roundRect(x + s * .12, y + s * .08, s * .5, s * .13, s * .07); ctx.fill();
    }
    for (const p of jpops) {
      if (p.t < 0) continue;
      const k = p.t / .5, x = bx + (p.c + .5) * cs, y = by + (p.r + .5) * cs;
      ctx.save(); ctx.globalAlpha = 1 - k; ctx.translate(x, y); ctx.scale(1 + k * .5, 1 + k * .5);
      ctx.fillStyle = 'rgba(255,140,200,.7)'; ctx.beginPath(); ctx.roundRect(-cs * .45, -cs * .45, cs * .9, cs * .9, cs * .2); ctx.fill(); ctx.restore();
    }
  }
  function drawCd(cd, extra) {
    const spr = sprite(cd.t, cd.sp), s = spr.sz;
    const px = bx + (cd.x + .5) * cs, py = by + (cd.y + .5) * cs;
    let sc = cd.born > 0 ? ease.outBack(1 - cd.born) : 1;
    sc *= extra || 1;
    const sy = 1 + cd.sq, sx = 1 - cd.sq * .7;
    ctx.save(); ctx.translate(px, py + cs * .42); ctx.scale(sx * sc, sy * sc); ctx.translate(0, -cs * .42);
    if (cd.wig) ctx.rotate(cd.wig);
    if (cd.armed) { const k = .5 + .5 * Math.sin(T * 14); ctx.shadowColor = '#FFF27A'; ctx.shadowBlur = 10 + k * 14; ctx.rotate(Math.sin(T * 30) * .06); }
    if (cd.sp === 'c') ctx.rotate(T * .8);
    ctx.drawImage(spr, -s / 2, -s / 2, s, s);
    ctx.restore();
  }
  function drawGoals() {
    const p = gp;
    ctx.save();
    ctx.shadowColor = 'rgba(150,40,110,.25)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5;
    let g = ctx.createLinearGradient(0, p.y, 0, p.y + p.h); g.addColorStop(0, 'rgba(255,255,255,.92)'); g.addColorStop(1, 'rgba(255,238,248,.88)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(p.x, p.y, p.w, p.h, 22); ctx.fill(); ctx.restore();
    ctx.lineWidth = 2.5; ctx.strokeStyle = '#FFC2E2'; ctx.beginPath(); ctx.roundRect(p.x + 1, p.y + 1, p.w - 2, p.h - 2, 21); ctx.stroke();
    // الحركات
    const mr = 25, mx = p.x + p.w - 14 - mr, my = p.y + p.h / 2 - 4;
    g = ctx.createRadialGradient(mx - 8, my - 10, 2, mx, my, mr);
    const low = moves <= 5 && !over && !rushing;
    g.addColorStop(0, low ? '#FFB0B8' : '#FFC7E6'); g.addColorStop(1, low ? '#F0263A' : '#E0217F');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, mr * (low ? 1 + Math.sin(T * 8) * .04 : 1), 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.ellipse(mx - 7, my - 12, 10, 5, -.4, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.direction = 'ltr'; ctx.font = `900 22px ${FONT}`; ctx.fillText(moves, mx, my + 1); ctx.direction = 'rtl';
    ctx.fillStyle = '#9A2A66'; ctx.font = `700 11px ${FONT}`; ctx.fillText('حركات', mx, p.y + p.h - 8);
    // الأهداف
    const gx0 = p.x + 12, gx1 = mx - mr - 12, n = L.goals.length, iw = (gx1 - gx0) / n;
    goalPos = [];
    L.goals.forEach((gl, i) => {
      const cx = gx1 - iw * (i + .5), cy = p.y + p.h * .4;
      const isz = Math.min(34, p.h * .5);
      goalPos[i] = [cx - iw * .18, cy];
      const ix = cx - Math.min(iw * .2, 24);
      if (gl.k === 'c') { const s = sprite(gl.t, ''); const z = isz * 1.3; ctx.drawImage(s, ix - z / 2, cy - z / 2, z, z); }
      else if (gl.k === 'ing') { const s = sprite(-1, 'ing'); const z = isz * 1.3; ctx.drawImage(s, ix - z / 2, cy - z / 2, z, z); }
      else if (gl.k === 'jelly') {
        const z = isz * .85; const jg = ctx.createLinearGradient(0, cy - z / 2, 0, cy + z / 2); jg.addColorStop(0, '#FFA9D6'); jg.addColorStop(1, '#FF5FAE');
        ctx.fillStyle = jg; ctx.beginPath(); ctx.roundRect(ix - z / 2, cy - z / 2, z, z, z * .25); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.roundRect(ix - z * .35, cy - z * .4, z * .5, z * .14, z * .07); ctx.fill();
      } else {
        ctx.save(); ctx.translate(ix, cy);
        [['#FF3D5E', .48], ['#fff', .34], ['#FF3D5E', .2]].forEach(([c2, rr]) => { ctx.fillStyle = c2; ctx.beginPath(); ctx.arc(0, 0, isz * rr * 1.05, 0, TAU); ctx.fill(); });
        ctx.restore();
      }
      const done = goalDone(gl);
      let txt;
      if (gl.k === 'score') txt = String(gl.n);
      else if (gl.k === 'c') txt = `${Math.max(0, gl.n - gcount[gl.t])}`;
      else if (gl.k === 'jelly') txt = `${Math.max(0, jellyLeft)}`;
      else txt = `${Math.max(0, gl.n - ingDone)}`;
      const tx = ix + isz * .62 + 4;
      if (done) {
        ctx.fillStyle = '#2BC46A'; ctx.beginPath(); ctx.arc(tx + 9, cy, 10, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(tx + 4, cy); ctx.lineTo(tx + 8, cy + 4); ctx.lineTo(tx + 14, cy - 4); ctx.stroke();
      } else {
        ctx.textAlign = 'left'; ctx.direction = 'ltr'; ctx.fillStyle = '#7A1F4E'; ctx.font = `900 ${gl.k === 'score' && iw < 110 ? 15 : 19}px ${FONT}`; ctx.fillText(txt, tx, cy + 1); ctx.direction = 'rtl';
      }
    });
    // مقياس النجوم
    const st = L.stars, max = st[2] * 1.08, bx0 = gx0, bw0 = gx1 - gx0, byy = p.y + p.h - 15, bh = 8;
    ctx.fillStyle = 'rgba(200,120,170,.22)'; ctx.beginPath(); ctx.roundRect(bx0, byy, bw0, bh, 4); ctx.fill();
    const fw = bw0 * clamp(shownScore / max, 0, 1);
    if (fw > 1) {
      g = ctx.createLinearGradient(bx0 + bw0, 0, bx0, 0); g.addColorStop(0, '#FFD84A'); g.addColorStop(1, '#FF4FA3');
      ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(bx0 + bw0 - fw, byy, fw, bh, 4); ctx.fill();
    }
    st.forEach((v, i) => {
      if (!v && i === 0) return;
      const sx = bx0 + bw0 - bw0 * v / max, on = shownScore >= v;
      ctx.save(); ctx.translate(sx, byy + bh / 2);
      ctx.fillStyle = on ? '#FFC531' : '#E7D3E0'; ctx.strokeStyle = on ? '#E89B0C' : '#C9AFC0'; ctx.lineWidth = 1.5;
      starPath(ctx, 8 + (on ? Math.max(0, 1 - (shownScore - v) / 400) * 0 : 0)); ctx.fill(); ctx.stroke(); ctx.restore();
    });
  }
  function render() {
    ctx.save();
    ctx.fillStyle = '#FFDDF0'; ctx.fillRect(0, 0, W, H);
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    if (shake > 0) ctx.translate(rand(-shake, shake) * .6, rand(-shake, shake) * .6);
    drawJelly();
    // تحديد / مؤشر لوحة المفاتيح
    const mark = (p, col, dash) => {
      ctx.save(); ctx.lineWidth = 3; ctx.strokeStyle = col; if (dash) ctx.setLineDash([6, 4]);
      ctx.shadowColor = col; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.roundRect(bx + p[1] * cs + 2, by + p[0] * cs + 2, cs - 4, cs - 4, cs * .2); ctx.stroke(); ctx.restore();
    };
    if (sel) { ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.roundRect(bx + sel[1] * cs + 2, by + sel[0] * cs + 2, cs - 4, cs - 4, cs * .2); ctx.fill(); mark(sel, '#FF4FA3'); }
    if (kbOn && kb && !busy) mark(kb, '#9B4DFF', true);
    // الحلوى
    ctx.save(); ctx.beginPath(); ctx.rect(bx - cs, by - 4, cs * (N + 2), cs * N + cs); ctx.clip();
    const hintIds = new Set();
    if (hintMove && !busy) hintMove.forEach(([r, c]) => { const cd = grid[r][c]; if (cd) hintIds.add(cd.id); });
    const env = Math.max(0, Math.sin(T * 3.2));
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const cd = grid[r][c]; if (!cd) continue;
      cd.wig = hintIds.has(cd.id) ? Math.sin(T * 22) * .16 * env : 0;
      const isSel = sel && sel[0] === r && sel[1] === c;
      drawCd(cd, isSel ? 1.08 + Math.sin(T * 8) * .03 : hintIds.has(cd.id) ? 1 + env * .06 : 1);
    }
    ctx.restore();
    // فرقعات
    for (const p of pops) {
      const spr = sprite(p.cd.t, p.cd.sp), s = spr.sz;
      const px = bx + (p.x + .5) * cs, py = by + (p.y + .5) * cs;
      ctx.save(); ctx.translate(px, py);
      if (p.t < 0) { ctx.drawImage(spr, -s / 2, -s / 2, s, s); ctx.restore(); continue; }
      const k = p.t / .3, sc = k < .35 ? 1 + .35 * (k / .35) : 1.35 * (1 - (k - .35) / .65);
      ctx.globalAlpha = clamp(1.6 - k * 1.6, 0, 1); ctx.scale(sc, sc);
      ctx.drawImage(spr, -s / 2, -s / 2, s, s); ctx.restore();
    }
    // أشعة
    ctx.save(); ctx.beginPath(); ctx.rect(bx - 4, by - 4, cs * N + 8, cs * N + 8); ctx.clip();
    for (const b of beams) {
      if (b.t < 0) continue;
      const k = b.t / .45, ext = Math.min(1, k * 4) * cs * N, a = 1 - k, th = cs * (b.w ? .7 : .55) * (1 - k * .5);
      ctx.save(); ctx.globalAlpha = a; ctx.translate(cellX(b.c), cellY(b.r)); if (b.dir === 'v') ctx.rotate(Math.PI / 2);
      const gg = ctx.createLinearGradient(0, -th / 2, 0, th / 2);
      gg.addColorStop(0, hexA(b.col, 0)); gg.addColorStop(.3, hexA(b.col, .9)); gg.addColorStop(.5, '#FFFFFF'); gg.addColorStop(.7, hexA(b.col, .9)); gg.addColorStop(1, hexA(b.col, 0));
      ctx.fillStyle = gg; ctx.fillRect(-ext, -th / 2, ext * 2, th);
      ctx.restore();
    }
    ctx.restore();
    for (const rg of rings) {
      if (rg.t < 0) continue;
      const k = rg.t / rg.life;
      ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = rg.col; ctx.lineWidth = 10 * (1 - k) + 2; ctx.shadowColor = '#fff'; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(rg.x, rg.y, rg.R * ease.outCubic(k), 0, TAU); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,240,' + (.35 * (1 - k)) + ')'; ctx.fill(); ctx.restore();
    }
    for (const b of bolts) {
      if (b.t < 0) continue;
      const k = b.t / b.life;
      ctx.save(); ctx.globalAlpha = Math.min(1, (1 - k) * 2); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.shadowColor = b.col; ctx.shadowBlur = 10; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(b.x1, b.y1);
      const segs = 7; for (let i = 1; i < segs; i++) { const f = i / segs; ctx.lineTo(b.x1 + (b.x2 - b.x1) * f + rand(-6, 6), b.y1 + (b.y2 - b.y1) * f + rand(-6, 6)); }
      ctx.lineTo(b.x2, b.y2); ctx.stroke(); ctx.restore();
    }
    for (const q of parts) {
      const a = 1 - q.age / q.life;
      ctx.save(); ctx.globalAlpha = q.k === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillStyle = q.c;
      if (q.k === 'spark') { starPath(ctx, q.s * (.7 + a * .6)); ctx.fill(); }
      else if (q.k === 'shard') { ctx.beginPath(); ctx.ellipse(0, 0, q.s, q.s * .6, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.arc(-q.s * .3, -q.s * .2, q.s * .25, 0, TAU); ctx.fill(); }
      else { ctx.scale(1, Math.cos(q.age * 9 + q.rot)); ctx.fillRect(-q.s / 2, -q.s * .3, q.s, q.s * .6); }
      ctx.restore();
    }
    ctx.restore();
    drawGoals();
    // طائرات نحو الأهداف
    for (const f of flyers) {
      if (f.t < 0 || !goalPos[f.gi]) continue;
      const k = ease.inOut(Math.min(1, f.t / f.d)), [tx, ty] = goalPos[f.gi];
      const x = f.x + (tx - f.x) * k, y = f.y + (ty - f.y) * k - Math.sin(k * Math.PI) * cs * 1.5;
      const spr = sprite(f.spr[0], f.spr[1]), s = spr.sz * (1 - k * .5) * (f.big ? 1.2 : .8);
      ctx.drawImage(spr, x - s / 2, y - s / 2, s, s);
    }
    // نصوص عائمة
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
    for (const t of texts) {
      const k = t.t / t.life;
      ctx.save();
      if (t.big) {
        const sc = k < .15 ? ease.outBack(k / .15) : 1, a = k > .75 ? 1 - (k - .75) / .25 : 1;
        ctx.globalAlpha = a; ctx.translate(t.x, t.y - k * 20); ctx.scale(sc, sc); ctx.rotate(-.06);
        ctx.font = `900 ${t.size}px ${FONT}`;
        ctx.lineWidth = t.size * .2; ctx.strokeStyle = '#fff'; ctx.shadowColor = 'rgba(120,20,80,.4)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4; ctx.strokeText(t.text, 0, 0);
        ctx.shadowColor = 'transparent';
        const gg = ctx.createLinearGradient(0, -t.size / 2, 0, t.size / 2); gg.addColorStop(0, '#FFE36B'); gg.addColorStop(.35, t.col); gg.addColorStop(1, t.col);
        ctx.fillStyle = gg; ctx.fillText(t.text, 0, 0);
      } else {
        ctx.globalAlpha = k > .6 ? 1 - (k - .6) / .4 : 1; ctx.translate(t.x, t.y - k * cs * .9); ctx.direction = 'ltr';
        ctx.font = `900 ${t.size}px ${FONT}`; ctx.lineWidth = 4; ctx.strokeStyle = t.col === '#FFFFFF' ? '#E0217F' : '#fff'; ctx.strokeText(t.text, 0, 0);
        ctx.fillStyle = t.col; ctx.fillText(t.text, 0, 0);
      }
      ctx.restore();
    }
  }
  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
    if (paused || document.hidden) return;
    for (let i = 0; i < speed; i++) update(dt);
    render();
  }
  function startLoop() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stopLoop() { running = false; cancelAnimationFrame(raf); }
  let resizeT = 0;
  window.addEventListener('resize', () => {
    if (App.current !== ID || !L) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); if (!running) render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createLinearGradient(0, 0, s, s); g.addColorStop(0, '#FFD3EC'); g.addColorStop(.5, '#EBD8FF'); g.addColorStop(1, '#C6F4E4');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    cloud(c, s * .25, s * .2, s * .14, .8);
    drawLolly(c, s * .64, s * .34, s * .2, .35);
    const put = (t, sp, x, y, r, rot) => { c.save(); c.translate(x, y); c.rotate(rot); drawCandy(c, t, sp, r); c.restore(); };
    put(4, '', s * .26, s * .56, s * .14, -.2);
    put(5, 'w', s * .44, s * .8, s * .16, .1);
    put(0, '', s * .76, s * .74, s * .15, .3);
    put(2, '', s * .2, s * .82, s * .12, -.3);
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, get title() { return 'حلويات ' + (App.profile ? App.profile.name : ''); }, icon2: '🍬', isNew: true, music: 'candy',
    desc: () => App.g('طابقي ثلاث حلويات أو أكثر', 'طابق ثلاث حلويات أو أكثر'),
    help: () => [
      '👆 ' + App.g('اسحبي', 'اسحب') + ' حلوى نحو جارتها لتبديلهما، ' + App.g('وطابقي', 'وطابق') + ' 3 من اللون نفسه',
      '🎯 ' + App.g('حقّقي', 'حقّق') + ' هدف المستوى قبل أن تنفد الحركات: نقاط، أو جمع ألوان، أو إزالة الجيلي، أو إنزال الكرز 🍒',
      '🍭 مطابقة 4 تصنع حلوى مخطّطة، وشكل L أو T يصنع حلوى مغلّفة، ومطابقة 5 تصنع قنبلة الألوان!',
      '💥 ' + App.g('بدّلي', 'بدّل') + ' حلويين خاصتين معًا لانفجار أكبر',
      '⭐ الحركات المتبقية تتحول إلى اندفاع السكر ونقاط إضافية ونجوم أكثر'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 المستوى ${Math.max(...ks)} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, LEVELS.length));
      render(); startLoop();
    },
    leave() {
      stopLoop(); gen++; timers = []; waiters = []; clearTimeout(winTimer); drag = null; sel = null;
      winOv.classList.remove('on'); failOv.classList.remove('on'); lvOv.classList.remove('on'); introEl.classList.remove('on');
    },
    pause() { paused = true; drag = null; },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() { return { lvl, moves, score, busy, over, goals: L.goals.map(goalDone), cs, bx, by, gcount, jellyLeft, ingDone }; },
    _speed(n) { speed = n; },
    _moves() { return findMoves(); },
    _swap(a, b) { return trySwap(a, b); },
    _start(n) { startLevel(n); },
    _best() {
      let best = null, bs = -1;
      for (const m of findMoves()) {
        const [a, b] = m, A = grid[a[0]][a[1]], B = grid[b[0]][b[1]];
        let v = Math.random() * .5;
        if (A.sp === 'c' || B.sp === 'c' || (isSW(A) && isSW(B))) v += 40;
        else {
          grid[a[0]][a[1]] = B; grid[b[0]][b[1]] = A;
          for (const gr of findGroups()) {
            v += gr.keys.size + (gr.keys.size >= 4 ? 8 : 0);
            gr.keys.forEach(k => { const r = k / N | 0, c = k % N; if (jelly[r][c]) v += 2.5; const gc = L.goals.find(x => x.k === 'c' && x.t === gr.t && gcount[gr.t] < x.n); if (gc) v += .8;
              for (let rr = 0; rr < r; rr++) if (grid[rr][c] && grid[rr][c].sp === 'ing') v += 4; });
          }
          grid[a[0]][a[1]] = A; grid[b[0]][b[1]] = B;
        }
        if (v > bs) { bs = v; best = m; }
      }
      if (bs < 5) for (let r = 0; r < N - 1; r++) for (let c = 0; c < N; c++) if (grid[r][c] && grid[r][c].sp === 'ing' && valid(r + 1, c) && grid[r + 1][c]) return [[r, c], [r + 1, c]];
      return best;
    },
    _set(r, c, t, sp) { const cd = mkC(t, sp); cd.x = c; cd.y = r; cd.tr = r; grid[r][c] = cd; }
  });
})();
