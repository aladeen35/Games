/* =====================================================================
   الدودة الجائعة — دودة صغيرة بتاج ذهبي تأكل الفواكه وتكبر
   حركة ناعمة على شبكة، ثلاثة أوضاع: كلاسيكي، بلا جدران، مغامرة (15 مرحلة)
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'snake', TAU = Math.PI * 2, N = 15;
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';
  const SPEEDS = [4.2, 6, 8.4];
  const D = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
  const BODY = [
    ['#FFB0B0', '#EF4F5F'], ['#FFD199', '#F08C1E'], ['#FFF09A', '#EDB40C'], ['#B8F59A', '#3FB43A'],
    ['#A8DEFF', '#2D8FE0'], ['#D6BFFF', '#7B4FE0'], ['#FFC2E2', '#E2509A']
  ];
  const FRUITS = ['apple', 'strawberry', 'banana', 'grapes', 'melon'];
  const FRUIT_EMO = ['🍎', '🍓', '🍌', '🍇', '🍉'];

  /* ---------- خرائط المغامرة (15×15) ----------
     '.' عشب، '#' صخرة، '*' شجيرة، 'S' رأس الدودة (تتجه يمينًا وجسمها إلى اليسار) */
  const E = '...............';
  const MAPS = [
    { t: 5, s: 4.0, m: [E, E, E, E, E, E, E, '...S...........', E, E, E, E, E, E, E] },
    { t: 6, s: 4.1, m: [E, E, '..**.......**..', '..*.........*..', E, E, E, '...S...........', E, E, E, '..*.........*..', '..**.......**..', E, E] },
    { t: 7, s: 4.2, m: [E, E, E, '....#######....', E, E, E, '...S...........', E, E, E, '....#######....', E, E, E] },
    { t: 8, s: 4.3, m: [E, E, E, '.......#.......', '.......#.......', '.......*.......', '.......#.......', '...##*###*##...', '.......#.......', '.......*.......', '.......#.......', E, '..S............', E, E] },
    { t: 9, s: 4.4, m: [E, '.****.....****.', '.*...........*.', '.*...........*.', E, E, E, '...S...........', E, E, E, '.*...........*.', '.*...........*.', '.****.....****.', E] },
    { t: 10, s: 4.5, m: [E, E, E, '...#...#...#...', E, '...S...........', E, '...*...*...*...', E, E, E, '...#...#...#...', E, E, E] },
    { t: 10, s: 4.6, m: [E, '.....#...#.....', '.....#...#.....', '.....*...*.....', '.....#...#.....', '.....#...#.....', E, '..S............', E, '.....#...#.....', '.....#...#.....', '.....*...*.....', '.....#...#.....', '.....#...#.....', E] },
    { t: 11, s: 4.7, m: [E, E, E, E, '....###.###....', '....#.....#....', '....*.....*....', '..S............', '....*.....*....', '....#.....#....', '....###.###....', E, E, E, E] },
    { t: 12, s: 4.8, m: [E, E, '..*.........*..', '...*.......*...', '....*.....*....', E, E, '...S...........', E, E, '....*.....*....', '...*.......*...', '..*.........*..', E, E] },
    { t: 12, s: 4.9, m: [E, E, E, '..*.........*..', '######...######', E, E, '...S...........', E, E, '######...######', '..*.........*..', E, E, E] },
    { t: 13, s: 5.0, m: [E, E, '...#.......#...', '...#.......#...', '...*.......*...', '...#.......#...', '...#.......#...', '...#..***..#...', '...#.......#...', '...#.......#...', '...*.......*...', '...#.......#...', '...#.......#...', '.....S.........', E] },
    { t: 14, s: 5.1, m: [E, '...S...........', E, '.........######', E, E, '######*........', E, E, '........*######', E, E, '######.........', E, E] },
    { t: 15, s: 5.2, m: [E, '.*...........*.', E, '...####.####...', '...#.......#...', '...*.......*...', '...#.......#...', '..S............', '...#.......#...', '...*.......*...', '...#.......#...', '...####.####...', E, '.*...........*.', E] },
    { t: 16, s: 5.3, m: ['....#.....*....', '.*.......#.....', '......*......#.', '..#.........*..', '.........#.....', '.....*.........', E, '...S........*..', '.#......#......', '.........*..#..', '...*...........', '.......#....*..', '.#.*.......#...', '......*........', '..........#....'] },
    { t: 18, s: 5.5, m: [E, E, E, '....**...**....', '...*..*.*..*...', '...*...*...*...', '...*.......*...', '....*.....*....', '.....*...*.....', '......*.*......', '.......*.......', E, '...S...........', E, E] }
  ];

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const outBack = t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const loadProg = () => { const p = store.get('snakeProg', null) || {}; return { unlocked: Math.max(1, p.unlocked || 1), stars: p.stars || {} }; };
  const fmtT = s => { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  function parseMap(def) {
    const g = [], st = { x: 3, y: 7 };
    for (let y = 0; y < N; y++) { g.push([]); for (let x = 0; x < N; x++) { const ch = (def[y] || E)[x] || '.'; g[y].push(ch === '#' ? 1 : ch === '*' ? 2 : 0); if (ch === 'S') { st.x = x; st.y = y; } } }
    return { g, st };
  }

  /* ---------- رسم الفواكه (مركزها 0،0 ونصف قطرها r) ---------- */
  function drawFruit(c, type, r, gold) {
    c.save(); c.lineJoin = 'round'; c.lineCap = 'round';
    const ol = Math.max(1, r * .08);
    const rg = (stops, x = -r * .35, y = -r * .4) => { const g = c.createRadialGradient(x, y, r * .05, 0, 0, r * 1.05); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; };
    const shine = (x, y, w, h, a = -.6, al = .8) => { c.fillStyle = `rgba(255,255,255,${al})`; c.beginPath(); c.ellipse(x, y, w, h, a, 0, TAU); c.fill(); };
    if (type === 'apple') {
      c.beginPath();
      c.moveTo(0, -r * .58);
      c.bezierCurveTo(r * .5, -r * 1.0, r * 1.1, -r * .55, r * .95, r * .15);
      c.bezierCurveTo(r * .85, r * .8, r * .35, r * 1.0, 0, r * .85);
      c.bezierCurveTo(-r * .35, r * 1.0, -r * .85, r * .8, -r * .95, r * .15);
      c.bezierCurveTo(-r * 1.1, -r * .55, -r * .5, -r * 1.0, 0, -r * .58);
      c.fillStyle = gold ? rg(['#FFFBD0', '#FFD43B', '#D98E00']) : rg(['#FFB0A0', '#F03E3E', '#A51E28']); c.fill();
      c.strokeStyle = gold ? '#B87400' : '#8E1622'; c.lineWidth = ol; c.stroke();
      c.strokeStyle = '#7A4A1E'; c.lineWidth = r * .13; c.beginPath(); c.moveTo(0, -r * .5); c.quadraticCurveTo(r * .02, -r * .85, r * .16, -r * 1.02); c.stroke();
      c.save(); c.translate(r * .38, -r * .82); c.rotate(-.5);
      const lg = c.createLinearGradient(0, -r * .2, 0, r * .2); lg.addColorStop(0, '#9BE36B'); lg.addColorStop(1, '#2F9E44');
      c.fillStyle = lg; c.beginPath(); c.ellipse(0, 0, r * .32, r * .15, 0, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(20,90,30,.6)'; c.lineWidth = ol * .8; c.stroke(); c.restore();
      shine(-r * .45, -r * .25, r * .2, r * .11);
    } else if (type === 'strawberry') {
      c.beginPath();
      c.moveTo(0, r * .98);
      c.bezierCurveTo(-r * .6, r * .72, -r * 1.02, -r * .1, -r * .78, -r * .5);
      c.bezierCurveTo(-r * .5, -r * .86, r * .5, -r * .86, r * .78, -r * .5);
      c.bezierCurveTo(r * 1.02, -r * .1, r * .6, r * .72, 0, r * .98);
      c.fillStyle = rg(['#FFA3A8', '#F2334A', '#A8122B']); c.fill();
      c.strokeStyle = '#8E0F25'; c.lineWidth = ol; c.stroke();
      c.fillStyle = '#FFE680';
      for (const [x, y] of [[-.45, -.25], [0, -.3], [.45, -.25], [-.25, .1], [.25, .1], [-.55, .12], [.55, .12], [0, .42], [-.28, .55], [.28, .55], [0, .75]]) { c.beginPath(); c.ellipse(x * r, y * r, r * .05, r * .08, 0, 0, TAU); c.fill(); }
      c.fillStyle = '#3FB43A'; c.strokeStyle = '#1F7A2A'; c.lineWidth = ol * .8;
      c.beginPath();
      for (let i = 0; i < 5; i++) { const a = Math.PI + i * Math.PI / 4; c.lineTo(Math.cos(a) * r * .55, -r * .62 + Math.sin(a) * r * .3 + r * .12); c.lineTo(Math.cos(a + Math.PI / 8) * r * .18, -r * .62 + Math.sin(a + Math.PI / 8) * r * .1); }
      c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = '#2F8A2B'; c.lineWidth = r * .1; c.beginPath(); c.moveTo(0, -r * .7); c.lineTo(r * .05, -r * .98); c.stroke();
      shine(-r * .4, -r * .2, r * .15, r * .08);
    } else if (type === 'banana') {
      c.rotate(-.15);
      c.beginPath();
      c.moveTo(-r * .72, -r * .62);
      c.quadraticCurveTo(-r * .62, r * .98, r * .95, r * .3);
      c.quadraticCurveTo(-r * .05, r * .45, -r * .45, -r * .66);
      c.closePath();
      const g = c.createLinearGradient(-r * .5, -r * .5, r * .5, r * .7); g.addColorStop(0, '#FFF6B8'); g.addColorStop(.5, '#FFD43B'); g.addColorStop(1, '#E2A10A');
      c.fillStyle = g; c.fill(); c.strokeStyle = '#A8730A'; c.lineWidth = ol; c.stroke();
      c.strokeStyle = 'rgba(200,140,10,.6)'; c.lineWidth = ol; c.beginPath(); c.moveTo(-r * .58, -r * .4); c.quadraticCurveTo(-r * .35, r * .55, r * .7, r * .38); c.stroke();
      c.fillStyle = '#6B4A1A'; c.beginPath(); c.roundRect(-r * .76, -r * .86, r * .22, r * .3, r * .05); c.fill();
      c.beginPath(); c.arc(r * .92, r * .3, r * .07, 0, TAU); c.fill();
      shine(-r * .5, -r * .05, r * .07, r * .2, .2, .7);
    } else if (type === 'grapes') {
      c.strokeStyle = '#6B4A1A'; c.lineWidth = r * .1; c.beginPath(); c.moveTo(0, -r * .55); c.quadraticCurveTo(r * .05, -r * .85, r * .2, -r * .98); c.stroke();
      c.save(); c.translate(-r * .32, -r * .78); c.rotate(.5); c.fillStyle = '#4CBF4A'; c.beginPath(); c.ellipse(0, 0, r * .3, r * .15, 0, 0, TAU); c.fill(); c.restore();
      const pts = [[-.42, -.32], [0, -.38], [.42, -.32], [-.22, .04], [.22, .04], [-.55, .02], [.55, .02], [0, .38], [-.3, .38], [.3, .38], [0, .72]];
      const gr = r * .28;
      for (const [x, y] of pts.slice().sort((a, b) => a[1] - b[1])) {
        const g = c.createRadialGradient(x * r - gr * .35, y * r - gr * .4, gr * .1, x * r, y * r, gr);
        g.addColorStop(0, '#E2CCFF'); g.addColorStop(.5, '#9A63F0'); g.addColorStop(1, '#5826AE');
        c.fillStyle = g; c.beginPath(); c.arc(x * r, y * r, gr, 0, TAU); c.fill();
        c.strokeStyle = 'rgba(60,20,120,.5)'; c.lineWidth = ol * .7; c.stroke();
        c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(x * r - gr * .35, y * r - gr * .35, gr * .2, 0, TAU); c.fill();
      }
    } else if (type === 'melon') {
      c.translate(0, -r * .15); c.rotate(.12);
      c.beginPath(); c.arc(0, 0, r * .98, 0, Math.PI); c.closePath();
      c.fillStyle = '#2F9E44'; c.fill(); c.strokeStyle = '#1D6B2C'; c.lineWidth = ol; c.stroke();
      c.beginPath(); c.arc(0, 0, r * .86, 0, Math.PI); c.closePath(); c.fillStyle = '#E8FFD8'; c.fill();
      c.beginPath(); c.arc(0, 0, r * .78, 0, Math.PI); c.closePath();
      const g = c.createRadialGradient(0, -r * .1, r * .1, 0, 0, r * .8); g.addColorStop(0, '#FF8FA0'); g.addColorStop(1, '#F03E5A');
      c.fillStyle = g; c.fill();
      c.fillStyle = '#2B1B1B';
      for (const [x, y] of [[-.4, .2], [0, .25], [.4, .2], [-.2, .48], [.2, .48]]) { c.beginPath(); c.ellipse(x * r, y * r, r * .05, r * .09, x * .8, 0, TAU); c.fill(); }
      c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(-r * .4, r * .08, r * .2, r * .05, .2, 0, TAU); c.fill();
    }
    c.restore();
  }

  /* ---------- رسم الدودة ---------- */
  function drawSeg(c, x, y, r, col) {
    const g = c.createRadialGradient(x - r * .35, y - r * .45, r * .1, x, y, r * 1.05);
    g.addColorStop(0, '#fff'); g.addColorStop(.25, col[0]); g.addColorStop(1, col[1]);
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(40,30,60,.22)'; c.lineWidth = Math.max(1, r * .1); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(x - r * .3, y - r * .42, r * .3, r * .15, -.5, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.arc(x + r * .32, y + r * .2, r * .13, 0, TAU); c.fill();
  }
  function drawFeet(c, x, y, r, ph) {
    c.fillStyle = '#3A6B22';
    for (const s of [-1, 1]) { const k = Math.sin(ph + s) * r * .12; c.beginPath(); c.ellipse(x + s * r * .45 + k, y + r * .84, r * .2, r * .14, 0, 0, TAU); c.fill(); }
  }
  /* o: lx,ly اتجاه النظر، blink، mouth، happy، dizzy، t، tilt */
  function drawHead(c, x, y, R, o) {
    c.save(); c.translate(x, y);
    // قرنا الاستشعار
    c.lineCap = 'round';
    for (const s of [-1, 1]) {
      const w = Math.sin(o.t * 4.5 + s * 1.3) * R * .1;
      c.strokeStyle = '#2E7D32'; c.lineWidth = Math.max(1.2, R * .09);
      c.beginPath(); c.moveTo(s * R * .38, -R * .72); c.quadraticCurveTo(s * R * .62 + w, -R * 1.2, s * R * .86 + w, -R * 1.28); c.stroke();
      const g = c.createRadialGradient(s * R * .86 + w - R * .05, -R * 1.33, 1, s * R * .86 + w, -R * 1.28, R * .16);
      g.addColorStop(0, '#FFE1F0'); g.addColorStop(1, '#FF4FA3');
      c.fillStyle = g; c.beginPath(); c.arc(s * R * .86 + w, -R * 1.28, R * .15, 0, TAU); c.fill();
    }
    // الرأس
    let g = c.createRadialGradient(-R * .35, -R * .45, R * .1, 0, 0, R * 1.05);
    g.addColorStop(0, '#E9FFD0'); g.addColorStop(.35, '#8FE35C'); g.addColorStop(1, '#3E9F2C');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(25,80,20,.4)'; c.lineWidth = Math.max(1, R * .07); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(-R * .42, -R * .52, R * .26, R * .12, -.6, 0, TAU); c.fill();
    // التاج
    c.save(); c.translate(0, -R * .82); c.rotate(o.tilt || 0);
    const cw = R * .92, chh = R * .55;
    c.beginPath();
    c.moveTo(-cw / 2, 0); c.lineTo(-cw / 2, -chh * .55); c.lineTo(-cw * .28, -chh * .25); c.lineTo(0, -chh); c.lineTo(cw * .28, -chh * .25); c.lineTo(cw / 2, -chh * .55); c.lineTo(cw / 2, 0); c.closePath();
    g = c.createLinearGradient(0, -chh, 0, 0); g.addColorStop(0, '#FFF6B0'); g.addColorStop(.5, '#FFCF33'); g.addColorStop(1, '#E39200');
    c.fillStyle = g; c.fill(); c.strokeStyle = '#B06F00'; c.lineWidth = Math.max(1, R * .06); c.lineJoin = 'round'; c.stroke();
    c.fillStyle = '#FFE680'; for (const xx of [-cw / 2, 0, cw / 2]) { c.beginPath(); c.arc(xx, xx ? -chh * .58 : -chh * 1.02, R * .07, 0, TAU); c.fill(); }
    c.fillStyle = '#FF3D6E'; c.beginPath(); c.arc(0, -chh * .25, R * .09, 0, TAU); c.fill();
    c.fillStyle = '#3BA0FF'; c.beginPath(); c.arc(-cw * .3, -chh * .12, R * .06, 0, TAU); c.arc(cw * .3, -chh * .12, R * .06, 0, TAU); c.fill();
    c.restore();
    // الوجه
    c.translate((o.lx || 0) * R * .12, (o.ly || 0) * R * .1);
    c.fillStyle = 'rgba(255,110,140,.45)';
    c.beginPath(); c.ellipse(-R * .6, R * .22, R * .17, R * .11, 0, 0, TAU); c.ellipse(R * .6, R * .22, R * .17, R * .11, 0, 0, TAU); c.fill();
    const ex = R * .34, ey = -R * .12, er = R * .27;
    c.strokeStyle = '#1E2A16'; c.lineWidth = Math.max(1.4, R * .09);
    for (const s of [-1, 1]) {
      const cx = s * ex;
      if (o.dizzy) {
        c.save(); c.translate(cx, ey); c.rotate(o.t * 8 * s);
        c.beginPath(); for (let a = 0; a < TAU * 1.8; a += .3) { const rr = er * .1 + a / (TAU * 1.8) * er * .8; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
        c.lineWidth = Math.max(1, R * .07); c.stroke(); c.restore();
      } else if (o.happy > .3) {
        c.beginPath(); c.arc(cx, ey + er * .35, er * .62, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
      } else {
        const bl = clamp(o.blink || 0, 0, 1);
        if (bl > .85) { c.beginPath(); c.moveTo(cx - er * .7, ey); c.quadraticCurveTo(cx, ey + er * .35, cx + er * .7, ey); c.stroke(); continue; }
        c.fillStyle = '#fff'; c.beginPath(); c.ellipse(cx, ey, er, er * 1.15 * (1 - bl), 0, 0, TAU); c.fill();
        c.lineWidth = Math.max(1, R * .05); c.strokeStyle = 'rgba(30,50,20,.5)'; c.stroke(); c.strokeStyle = '#1E2A16'; c.lineWidth = Math.max(1.4, R * .09);
        c.save(); c.beginPath(); c.ellipse(cx, ey, er, er * 1.15 * (1 - bl), 0, 0, TAU); c.clip();
        const px = cx + (o.lx || 0) * er * .38, py = ey + (o.ly || 0) * er * .38;
        c.fillStyle = '#1E1B2E'; c.beginPath(); c.arc(px, py, er * .58, 0, TAU); c.fill();
        c.fillStyle = '#fff'; c.beginPath(); c.arc(px - er * .2, py - er * .24, er * .2, 0, TAU); c.fill();
        c.beginPath(); c.arc(px + er * .18, py + er * .2, er * .08, 0, TAU); c.fill();
        c.restore();
      }
    }
    // الفم
    const my = R * .42;
    if (o.dizzy) {
      c.lineWidth = Math.max(1.2, R * .07); c.beginPath();
      for (let i = 0; i <= 8; i++) { const xx = -R * .28 + i * R * .07; c.lineTo(xx, my + Math.sin(i * 1.6 + o.t * 6) * R * .05); }
      c.stroke();
    } else if (o.happy > .3) {
      c.beginPath(); c.moveTo(-R * .32, my - R * .06); c.quadraticCurveTo(0, my + R * .42, R * .32, my - R * .06); c.closePath();
      c.fillStyle = '#7A1F2B'; c.fill(); c.lineWidth = Math.max(1, R * .06); c.stroke();
      c.save(); c.clip(); c.fillStyle = '#FF7A9A'; c.beginPath(); c.ellipse(0, my + R * .28, R * .17, R * .12, 0, 0, TAU); c.fill(); c.restore();
    } else if ((o.mouth || 0) > .08) {
      const m = o.mouth;
      c.fillStyle = '#7A1F2B'; c.beginPath(); c.ellipse(0, my + R * .02, R * (.14 + m * .1), R * (.06 + m * .2), 0, 0, TAU); c.fill();
      c.lineWidth = Math.max(1, R * .06); c.stroke();
      c.save(); c.clip(); c.fillStyle = '#FF7A9A'; c.beginPath(); c.ellipse(0, my + R * (.08 + m * .16), R * .14, R * .09, 0, 0, TAU); c.fill(); c.restore();
    } else {
      c.lineWidth = Math.max(1.2, R * .08); c.beginPath(); c.arc(0, my - R * .14, R * .2, Math.PI * .2, Math.PI * .8); c.stroke();
    }
    c.restore();
  }

  /* ---------- الواجهة ---------- */
  App.css(`
  #snake{background:#BDEB8E;overflow:hidden}
  #snake canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #snake .ib{color:#2F8A2B}
  #snake .chip{color:#2C6B1F;min-width:74px}
  #snake .chip b{color:#E8590C}
  #snake .panel{border-color:#D8F5BF;box-shadow:0 8px 0 #8CCB5E,0 20px 40px rgba(20,60,10,.3);color:#2C5A1A}
  #snake .panel h3{color:#2F9E44}
  #snake .panel .big{color:#E8590C}
  #snake .btn{background:#FF8A3D;box-shadow:0 4px 0 #D9600F}
  #snake .btn:active{box-shadow:0 1px 0 #D9600F}
  #snake .btn.alt{background:#fff;color:#2F9E44;box-shadow:0 4px 0 #B7E39A;border-color:#D8F5BF}
  #snake .overlay{background:rgba(25,70,20,.38)}
  #snake .dpad{position:absolute;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);direction:ltr;z-index:4;gap:5px}
  #snake .dpad button{border-radius:30%;background:linear-gradient(#FFC27A,#FF8A3D 70%);box-shadow:0 5px 0 #D9600F,0 9px 14px rgba(40,80,20,.25),inset 0 3px 0 rgba(255,255,255,.55);display:grid;place-items:center;touch-action:none;transition:transform .06s}
  #snake .dpad button.on{transform:translateY(4px) scale(.96);box-shadow:0 1px 0 #D9600F,0 3px 6px rgba(40,80,20,.25),inset 0 3px 0 rgba(255,255,255,.55);background:linear-gradient(#FFB45E,#F47A2A 70%)}
  #snake .dpad svg{width:50%;height:50%;filter:drop-shadow(0 2px 0 rgba(160,60,0,.45))}
  #snake .dpad .mid{border-radius:50%;background:radial-gradient(circle at 40% 35%,#F4FFE9,#BFEA9C);box-shadow:inset 0 -3px 0 rgba(60,120,30,.2),0 3px 0 rgba(60,120,30,.25);display:grid;place-items:center;font-size:24px;margin:14%}
  #snake .u{grid-area:1/2}#snake .l{grid-area:2/1}#snake .mid{grid-area:2/2}#snake .r{grid-area:2/3}#snake .d{grid-area:3/2}
  #snake .hint{top:auto}
  #snake .hint span{background:rgba(255,255,255,.92);color:#2C6B1F;box-shadow:0 2px 8px rgba(30,90,20,.2);display:inline-block;animation:snkBob 1.4s ease-in-out infinite}
  @keyframes snkBob{50%{transform:translateY(-4px)}}
  #snake .mp{width:min(94vw,400px);max-height:90vh;overflow-y:auto;touch-action:pan-y;background:linear-gradient(#FFFFFF,#F2FFE6)}
  #snake .mp h3{font-size:27px}
  #snake .modes{display:grid;gap:10px;margin:12px 0 10px}
  #snake .mb{display:flex;align-items:center;gap:12px;padding:10px 14px;border-radius:22px;background:linear-gradient(#F7FFEF,#DDF7C6);box-shadow:0 5px 0 #A6D97F;text-align:right;color:#2C5A1A;border:2px solid #fff}
  #snake .mb:active{transform:translateY(3px);box-shadow:0 2px 0 #A6D97F}
  #snake .mb .e{font-size:34px;width:52px;height:52px;flex:0 0 52px;border-radius:50%;display:grid;place-items:center;background:#fff;box-shadow:0 3px 0 rgba(60,120,30,.18)}
  #snake .mb b{display:block;font-size:20px;line-height:1.2}
  #snake .mb small{display:block;font-size:13px;opacity:.75}
  #snake .mb .mbest{margin-inline-start:auto;font-size:13px;font-weight:800;color:#E8590C;white-space:nowrap}
  #snake .spd{display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;font-weight:800}
  #snake .sg{display:flex;background:#E3F7D2;border-radius:99px;padding:3px;gap:3px}
  #snake .sg button{padding:6px 12px;border-radius:99px;font-weight:800;font-size:15px;background:transparent;color:#2C5A1A}
  #snake .sg button.on{background:#2F9E44;color:#fff;box-shadow:0 2px 0 #1D6B2C}
  #snake .lvp{width:min(94vw,430px);max-height:88vh;overflow-y:auto;touch-action:pan-y;background:linear-gradient(#FFFFFF,#F2FFE6)}
  #snake .lvg{display:grid;grid-template-columns:repeat(5,1fr);gap:9px;margin:10px 0 12px}
  #snake .lvb{position:relative;aspect-ratio:1;border-radius:20px;background:linear-gradient(#C9F5A6,#8FDB62);box-shadow:0 4px 0 #5DAA3A,inset 0 2px 0 rgba(255,255,255,.6);
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#24531A;font-weight:900;padding:2px}
  #snake .lvb:active{transform:translateY(3px);box-shadow:0 1px 0 #5DAA3A}
  #snake .lvb .n{font-size:12px;position:absolute;top:2px;right:7px;opacity:.75}
  #snake .lvb .e{font-size:24px;line-height:1.1}
  #snake .lvb .s{font-size:10px;letter-spacing:-1px;line-height:1;height:11px}
  #snake .lvb .s i{font-style:normal}
  #snake .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #snake .lvb.cur{outline:3px solid #FF8A3D;outline-offset:2px}
  #snake .lvb.lock{background:linear-gradient(#E3EBDA,#C9D6BC);box-shadow:0 4px 0 #A3B396;color:#7d8a70}
  #snake .lvb.lock .e{filter:grayscale(1);opacity:.35;font-size:20px}
  #snake .lvb.lock::after{content:'🔒';position:absolute;font-size:17px;bottom:3px}
  #snake .newrec{display:inline-block;background:#FFE066;color:#8A5A00;border-radius:99px;padding:2px 12px;font-weight:900;animation:pop .5s cubic-bezier(.3,1.6,.6,1)}
  `);
  const arrow = rot => `<svg viewBox="0 0 24 24" style="transform:rotate(${rot}deg)"><path d="M12 4 L21 15 Q22 17 20 17 L4 17 Q2 17 3 15 Z" fill="#fff" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>`;
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية" data-aen="Home">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة" data-aen="Help">❓</button>
      <button class="ib pbtn" aria-label="إيقاف مؤقت" data-aen="Pause">⏸️</button>
      <span class="grow"></span>
      <div class="chip"><small class="c1L">النقاط</small><b class="c1">0</b></div>
      <div class="chip"><small class="c2L">الأفضل</small><b class="c2">0</b></div>
    </div>
    <div class="dpad">
      <button class="u" data-d="up" aria-label="أعلى" data-aen="Up">${arrow(0)}</button>
      <button class="l" data-d="left" aria-label="يسار" data-aen="Left">${arrow(-90)}</button>
      <div class="mid">🐛</div>
      <button class="r" data-d="right" aria-label="يمين" data-aen="Right">${arrow(90)}</button>
      <button class="d" data-d="down" aria-label="أسفل" data-aen="Down">${arrow(180)}</button>
    </div>
    <div class="hint"><span class="hintT"></span></div>
    <div class="overlay" id="snMode"><div class="panel mp">
      <h3 data-en="🐛 The Hungry Worm">🐛 الدودة الجائعة</h3>
      <p class="mT" style="margin:0"></p>
      <div class="modes">
        <button class="mb" data-m="classic"><span class="e">🧱</span><div><b data-en="Classic">كلاسيكي</b><small class="mS1"></small></div><span class="mbest" data-b="classic"></span></button>
        <button class="mb" data-m="wrap"><span class="e">🌀</span><div><b data-en="No walls">بلا جدران</b><small class="mS2"></small></div><span class="mbest" data-b="wrap"></span></button>
        <button class="mb" data-m="adv"><span class="e">🗺️</span><div><b data-en="Adventure">مغامرة</b><small data-en="15 fun levels with rocks and bushes">15 مرحلة ممتعة بالصخور والشجيرات</small></div><span class="mbest" data-b="adv"></span></button>
      </div>
      <div class="spd"><span data-en="⚡ Speed">⚡ السرعة</span><div class="sg">
        <button data-s="0" data-en="🐢 Slow">🐢 بطيء</button><button data-s="1" data-en="🐇 Normal">🐇 عادي</button><button data-s="2" data-en="🚀 Fast">🚀 سريع</button></div></div>
    </div></div>
    <div class="overlay" id="snLv"><div class="panel lvp"><h3 data-en="🗺️ Adventure">🗺️ المغامرة</h3><div class="lvg"></div>
      <button class="btn alt" data-a="modes" data-en="↩️ Back">↩️ رجوع</button></div></div>
    <div class="overlay" id="snPause"><div class="panel">
      <h3 data-en="⏸️ Break">⏸️ استراحة</h3><p class="pP"></p>
      <button class="btn" data-a="resume" data-en="▶️ Continue">▶️ متابعة</button><br>
      <button class="btn alt" data-a="again" data-en="🔄 Restart">🔄 من جديد</button><button class="btn alt" data-a="modes" data-en="🎮 Modes">🎮 الأوضاع</button>
    </div></div>
    <div class="overlay" id="snOver"><div class="panel">
      <h3 class="oT"></h3><div class="big oB"></div><p class="oP"></p>
      <button class="btn" data-a="again" data-en="🔄 Try again">🔄 مرة أخرى</button><br>
      <button class="btn alt oM" data-a="modes" data-en="🎮 Modes">🎮 الأوضاع</button><button class="btn alt oL" data-a="levels" data-en="🗺️ Levels">🗺️ المراحل</button><button class="btn alt home" aria-label="الرئيسية" data-aen="Home">🏠</button>
    </div></div>
    <div class="overlay" id="snWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next" data-en="Next ▶️">التالي ▶️</button><br>
      <button class="btn alt" data-a="again" aria-label="إعادة" data-aen="Replay">🔄</button><button class="btn alt" data-a="levels" data-en="🗺️ Levels">🗺️ المراحل</button><button class="btn alt home" aria-label="الرئيسية" data-aen="Home">🏠</button>
    </div></div>`);
  /* نصوص الواجهة الثابتة: data-en للنص و data-aen للوصف (aria/title) */
  function i18n() {
    root.querySelectorAll('[data-en]').forEach(el => { if (el.dataset.ar == null) el.dataset.ar = el.textContent; el.textContent = App.t(el.dataset.ar, el.dataset.en); });
    root.querySelectorAll('[data-aen]').forEach(el => {
      if (el.dataset.aar == null) el.dataset.aar = el.getAttribute('aria-label') || el.title || '';
      const v = App.t(el.dataset.aar, el.dataset.aen); if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', v); if (el.title) el.title = v;
    });
  }
  let overPaint = null, winPaint = null;
  const hintText = () => '👆 ' + App.t(App.g('اسحبي أو اضغطي سهمًا للبدء', 'اسحب أو اضغط سهمًا للبدء'), 'Swipe or press an arrow to start');
  const q = s => root.querySelector(s);
  const cv = q('canvas.sc'), bar = q('.bar'), dpad = q('.dpad');
  const hintEl = q('.hint'), hintT = q('.hintT');
  const modeOv = q('#snMode'), lvOv = q('#snLv'), pauseOv = q('#snPause'), overOv = q('#snOver'), winOv = q('#snWin');
  const OVS = [modeOv, lvOv, pauseOv, overOv, winOv];
  const anyOv = () => OVS.some(o => o.classList.contains('on'));
  const showOv = o => { OVS.forEach(x => x.classList.toggle('on', x === o)); };

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, cell = 24, bx = 0, by = 0, bs = 0, bgLayer = null, fruitCache = {};
  let raf = 0, last = 0, T = 0, running = false, sheetPaused = false;
  let mode = 'classic', spdIdx = 0, lvl = 1, map = null, reach = null;
  let body = [], prev = [], dir = D.right, queue = [], grow = 0, acc = 0, speed = 4;
  let state = 'ready', score = 0, fruits = 0, runTime = 0, stateT = 0, eatenSinceGold = 0;
  let foods = [], parts = [], pops = [], rings = [], swallow = [];
  let face = { blink: 0, blinkIn: 2, mouth: 0, happy: 0, lx: 1, ly: 0 };
  let shake = 0, overTimer = 0, lastChip = '', target = 0, hintShown = false;

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const top = bar.getBoundingClientRect().bottom + 6, padB = 14;
    const portrait = W / H < 1.1;
    let dp;
    if (portrait) {
      dp = clamp(Math.round(H * .27), 150, 230);
      const availH = H - top - padB - dp - 12;
      const s = Math.min(W - 20, availH, 640);
      cell = Math.floor(s / N); bs = cell * N;
      bx = Math.round((W - bs) / 2);
      by = Math.round(top + Math.max(0, (availH - bs) * .35));
      const dy = by + bs + Math.max(12, (H - padB - (by + bs) - dp) / 2);
      Object.assign(dpad.style, { width: dp + 'px', height: dp + 'px', left: Math.round((W - dp) / 2) + 'px', top: Math.round(dy) + 'px' });
    } else {
      dp = clamp(Math.round(H * .36), 150, 240);
      const s = Math.min(H - top - padB, W - dp * 2 - 60);
      cell = Math.floor(s / N); bs = cell * N;
      bx = Math.round((W - bs) / 2); by = Math.round(top + (H - top - padB - bs) / 2);
      const sx = bx + bs, room = W - sx;
      Object.assign(dpad.style, { width: dp + 'px', height: dp + 'px', left: Math.round(sx + (room - dp) / 2) + 'px', top: Math.round(by + bs - dp - 10) + 'px' });
    }
    hintEl.style.top = (by + bs - 46) + 'px';
    fruitCache = {};
    buildBg();
  }

  /* الطبقة الثابتة: الحديقة + اللوح + السياج + الصخور والشجيرات */
  function buildBg() {
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    let g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#D9F7B4'); g.addColorStop(1, '#A9E07A');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const R = rng(42);
    // عشب وأزهار حول اللوح
    for (let i = 0; i < W * H / 900; i++) {
      const px = R() * W, py = R() * H;
      x.strokeStyle = `rgba(60,140,40,${.15 + R() * .2})`; x.lineWidth = 1.5; x.lineCap = 'round';
      x.beginPath(); x.moveTo(px, py); x.lineTo(px - 2, py - 6); x.moveTo(px + 2, py); x.lineTo(px + 3, py - 7); x.stroke();
    }
    const fcols = ['#FF7EB9', '#FFD43B', '#FFFFFF', '#B197FC', '#FF8A65', '#74C0FC'];
    for (let i = 0; i < W * H / 5000; i++) {
      const px = R() * W, py = R() * H, s = 3 + R() * 4;
      if (px > bx - 20 && px < bx + bs + 20 && py > by - 20 && py < by + bs + 20) continue;
      x.fillStyle = fcols[i % fcols.length];
      for (let k = 0; k < 5; k++) { const a = k * TAU / 5 + R(); x.beginPath(); x.arc(px + Math.cos(a) * s, py + Math.sin(a) * s, s * .75, 0, TAU); x.fill(); }
      x.fillStyle = '#FFB300'; x.beginPath(); x.arc(px, py, s * .6, 0, TAU); x.fill();
    }
    const rad = Math.max(10, cell * .6), walls = mode !== 'wrap';
    // ظل اللوح
    x.save(); x.shadowColor = 'rgba(30,80,20,.35)'; x.shadowBlur = 20; x.shadowOffsetY = 10;
    x.fillStyle = '#7CC94C'; x.beginPath(); x.roundRect(bx, by, bs, bs, rad); x.fill(); x.restore();
    // رقعة العشب
    x.save(); x.beginPath(); x.roundRect(bx, by, bs, bs, rad); x.clip();
    for (let yy = 0; yy < N; yy++) for (let xx = 0; xx < N; xx++) {
      x.fillStyle = (xx + yy) % 2 ? '#93D45B' : '#A2DE69'; x.fillRect(bx + xx * cell, by + yy * cell, cell, cell);
    }
    const R2 = rng(7 + lvl * 13 + (mode === 'wrap' ? 99 : 0));
    for (let i = 0; i < N * N * .9; i++) {
      const px = bx + R2() * bs, py = by + R2() * bs;
      x.strokeStyle = 'rgba(50,120,30,.18)'; x.lineWidth = 1.2;
      x.beginPath(); x.moveTo(px, py); x.lineTo(px - 1.5, py - cell * .2); x.moveTo(px + 2, py); x.lineTo(px + 2.5, py - cell * .22); x.stroke();
    }
    for (let i = 0; i < 9; i++) { // أزهار صغيرة باهتة على العشب
      const px = bx + (R2() * N | 0) * cell + cell / 2, py = by + (R2() * N | 0) * cell + cell / 2, s = cell * .1;
      x.globalAlpha = .55; x.fillStyle = i % 2 ? '#fff' : '#FFE3F0';
      for (let k = 0; k < 5; k++) { const a = k * TAU / 5; x.beginPath(); x.arc(px + Math.cos(a) * s, py + Math.sin(a) * s, s * .8, 0, TAU); x.fill(); }
      x.fillStyle = '#FFD43B'; x.beginPath(); x.arc(px, py, s * .6, 0, TAU); x.fill(); x.globalAlpha = 1;
    }
    g = x.createLinearGradient(bx, by, bx + bs, by + bs); g.addColorStop(0, 'rgba(255,255,230,.22)'); g.addColorStop(.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(20,70,10,.12)');
    x.fillStyle = g; x.fillRect(bx, by, bs, bs);
    // العوائق
    if (map) for (let yy = 0; yy < N; yy++) for (let xx = 0; xx < N; xx++) {
      const v = map[yy][xx]; if (!v) continue;
      const cx = bx + xx * cell + cell / 2, cy = by + yy * cell + cell / 2;
      if (v === 1) drawRock(x, cx, cy, cell, xx * 31 + yy * 17); else drawBush(x, cx, cy, cell, xx * 13 + yy * 29);
    }
    x.restore();
    // الإطار
    if (walls) {
      const fw = Math.max(6, cell * .34);
      x.save(); x.shadowColor = 'rgba(70,35,5,.35)'; x.shadowBlur = 6; x.shadowOffsetY = 3;
      x.lineWidth = fw; x.strokeStyle = '#B9773A'; x.beginPath(); x.roundRect(bx - fw / 2, by - fw / 2, bs + fw, bs + fw, rad + fw / 2); x.stroke(); x.restore();
      g = x.createLinearGradient(0, by - fw, 0, by + bs + fw); g.addColorStop(0, '#E8A85E'); g.addColorStop(1, '#C27E3C');
      x.lineWidth = fw - 2; x.strokeStyle = g; x.beginPath(); x.roundRect(bx - fw / 2, by - fw / 2, bs + fw, bs + fw, rad + fw / 2); x.stroke();
      x.lineWidth = 1.5; x.strokeStyle = 'rgba(255,230,180,.7)'; x.beginPath(); x.roundRect(bx - fw + 2, by - fw + 2, bs + fw * 2 - 4, bs + fw * 2 - 4, rad + fw - 2); x.stroke();
      // أعمدة السياج
      const post = (px, py) => {
        const pg = x.createRadialGradient(px - fw * .2, py - fw * .25, 1, px, py, fw * .8);
        pg.addColorStop(0, '#FFD9A0'); pg.addColorStop(1, '#9C5C22');
        x.fillStyle = pg; x.beginPath(); x.roundRect(px - fw * .62, py - fw * .62, fw * 1.24, fw * 1.24, fw * .35); x.fill();
        x.strokeStyle = 'rgba(90,45,10,.5)'; x.lineWidth = 1; x.stroke();
      };
      const o = -fw / 2;
      for (let i = 1; i < N; i += 3) { const p = i * cell + cell / 2; post(bx + p, by + o); post(bx + p, by + bs - o); post(bx + o, by + p); post(bx + bs - o, by + p); }
    } else {
      x.save(); x.setLineDash([cell * .35, cell * .3]); x.lineCap = 'round';
      x.shadowColor = 'rgba(120,220,255,.9)'; x.shadowBlur = 10;
      x.lineWidth = 4; x.strokeStyle = 'rgba(210,245,255,.95)'; x.beginPath(); x.roundRect(bx - 3, by - 3, bs + 6, bs + 6, rad + 3); x.stroke();
      x.restore();
      x.fillStyle = 'rgba(255,255,255,.75)'; x.font = `900 ${Math.max(12, cell * .55)}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle';
      for (const [px, py] of [[bx + bs / 2, by - 12], [bx + bs / 2, by + bs + 12]]) x.fillText('⇅', px, py);
    }
  }
  function drawRock(x, cx, cy, s, seed) {
    const R = rng(seed + 5), r = s * .46;
    x.fillStyle = 'rgba(30,60,20,.25)'; x.beginPath(); x.ellipse(cx + 1, cy + r * .55, r * .95, r * .4, 0, 0, TAU); x.fill();
    x.beginPath();
    const n = 9;
    for (let i = 0; i < n; i++) { const a = i * TAU / n, rr = r * (.8 + R() * .2); x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .88); }
    x.closePath();
    const g = x.createRadialGradient(cx - r * .35, cy - r * .4, r * .1, cx, cy, r * 1.1);
    g.addColorStop(0, '#EEF1F5'); g.addColorStop(.45, '#AEB6C2'); g.addColorStop(1, '#6A7382');
    x.fillStyle = g; x.fill(); x.strokeStyle = 'rgba(60,65,80,.6)'; x.lineWidth = 1.2; x.lineJoin = 'round'; x.stroke();
    x.strokeStyle = 'rgba(70,75,90,.45)'; x.beginPath(); x.moveTo(cx + r * .1, cy - r * .2); x.lineTo(cx + r * .3, cy + r * .1); x.lineTo(cx + r * .2, cy + r * .35); x.stroke();
    x.fillStyle = 'rgba(110,190,80,.75)'; x.beginPath(); x.ellipse(cx - r * .3, cy + r * .45, r * .3, r * .12, 0, 0, TAU); x.fill();
    x.fillStyle = 'rgba(255,255,255,.6)'; x.beginPath(); x.ellipse(cx - r * .35, cy - r * .42, r * .2, r * .09, -.5, 0, TAU); x.fill();
  }
  function drawBush(x, cx, cy, s, seed) {
    const R = rng(seed + 9), r = s * .5;
    x.fillStyle = 'rgba(20,60,10,.28)'; x.beginPath(); x.ellipse(cx + 1, cy + r * .6, r * .95, r * .35, 0, 0, TAU); x.fill();
    const blobs = [[-.45, .15, .5], [.45, .15, .5], [0, .25, .52], [-.22, -.25, .5], [.25, -.25, .48], [0, -.05, .55]];
    for (const [ox, oy, rr] of blobs) {
      const px = cx + ox * r, py = cy + oy * r, br = rr * r;
      const g = x.createRadialGradient(px - br * .35, py - br * .45, br * .1, px, py, br);
      g.addColorStop(0, '#9BE870'); g.addColorStop(.6, '#4DB33A'); g.addColorStop(1, '#2A7A26');
      x.fillStyle = g; x.beginPath(); x.arc(px, py, br, 0, TAU); x.fill();
    }
    const fc = ['#FF5C8A', '#FFFFFF', '#FFD43B'][Math.floor(R() * 3)];
    for (let i = 0; i < 3; i++) {
      const px = cx + (R() - .5) * r * 1.1, py = cy + (R() - .5) * r * .9;
      x.fillStyle = fc; x.beginPath(); x.arc(px, py, Math.max(1.5, r * .1), 0, TAU); x.fill();
      x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.arc(px - r * .03, py - r * .03, Math.max(.6, r * .035), 0, TAU); x.fill();
    }
  }
  function fruitImg(type, gold) {
    const k = type + (gold ? 'G' : '') + cell + '_' + dpr;
    if (fruitCache[k]) return fruitCache[k];
    const S = Math.ceil(cell * 1.5 * dpr), c = mk(S, S), x = c.getContext('2d');
    x.translate(S / 2, S / 2); x.scale(dpr, dpr);
    drawFruit(x, type, cell * .42, gold);
    return (fruitCache[k] = c);
  }

  /* ---------- اللعب ---------- */
  function modeName(m) { return m === 'classic' ? App.t('كلاسيكي', 'Classic') : m === 'wrap' ? App.t('بلا جدران', 'No walls') : App.t('مغامرة', 'Adventure'); }
  function bestOf(m) { return store.get('snakeBest_' + m, 0); }
  function startGame(m, level) {
    mode = m;
    clearTimeout(overTimer);
    if (m === 'adv') {
      lvl = clamp(level || 1, 1, MAPS.length);
      const p = parseMap(MAPS[lvl - 1].m); map = p.g; target = MAPS[lvl - 1].t; speed = MAPS[lvl - 1].s;
      initSnake(p.st);
    } else {
      map = parseMap([]).g; target = 0; speed = SPEEDS[spdIdx];
      initSnake({ x: 4, y: 7 });
    }
    computeReach();
    score = 0; fruits = 0; runTime = 0; eatenSinceGold = 0;
    foods = []; parts = []; pops = []; rings = []; swallow = [];
    face.happy = 0; face.mouth = 0; shake = 0;
    state = 'ready'; stateT = 0;
    layout();
    spawnFood(false);
    showOv(null);
    hintT.textContent = hintText();
    hintEl.style.opacity = 1;
    lastChip = ''; updChips();
    Sound.whoosh();
  }
  function initSnake(st) {
    body = [{ x: st.x, y: st.y }, { x: st.x - 1, y: st.y }, { x: st.x - 2, y: st.y }];
    prev = body.map(p => ({ ...p })); dir = D.right; queue = []; grow = 0; acc = 0;
    face.lx = 1; face.ly = 0;
  }
  function computeReach() {
    reach = Array.from({ length: N }, () => Array(N).fill(false));
    const st = [body[0]]; reach[body[0].y][body[0].x] = true;
    while (st.length) {
      const c = st.pop();
      for (const d of [D.up, D.down, D.left, D.right]) {
        let nx = c.x + d[0], ny = c.y + d[1];
        if (mode === 'wrap') { nx = (nx + N) % N; ny = (ny + N) % N; }
        if (nx < 0 || ny < 0 || nx >= N || ny >= N || reach[ny][nx] || map[ny][nx]) continue;
        reach[ny][nx] = true; st.push({ x: nx, y: ny });
      }
    }
  }
  function spawnFood(gold) {
    const free = [];
    const h = body[0];
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      if (!reach[y][x] || map[y][x]) continue;
      if (body.some(b => b.x === x && b.y === y) || foods.some(f => f.x === x && f.y === y && !f.eaten)) continue;
      free.push({ x, y, d: Math.abs(x - h.x) + Math.abs(y - h.y) });
    }
    if (!free.length) return false;
    const far = free.filter(c => c.d >= 3), pool = far.length ? far : free;
    const c = pool[Math.floor(Math.random() * pool.length)];
    foods.push({ x: c.x, y: c.y, type: gold ? 'apple' : FRUITS[Math.floor(Math.random() * FRUITS.length)], gold, age: 0, life: gold ? 7 : Infinity, eaten: false, ph: Math.random() * TAU });
    if (gold) { Sound.star(); rings.push({ x: px(c.x), y: py(c.y), age: 0, life: .6, c: '#FFE066' }); }
    return true;
  }
  const px = gx => bx + gx * cell + cell / 2, py = gy => by + gy * cell + cell / 2;

  function turn(name) {
    if (App.current !== ID || sheetPaused || anyOv()) return;
    if (state !== 'ready' && state !== 'play') return;
    const d = D[name];
    const lastD = queue.length ? queue[queue.length - 1] : dir;
    if (d === lastD || (d[0] === -lastD[0] && d[1] === -lastD[1])) {
      if (state === 'ready' && d !== lastD) { shake = Math.max(shake, 2); Sound.tone(260, .08, 'sine', .06); }
      if (state === 'ready' && d === lastD) begin();
      return;
    }
    if (queue.length >= 2) return;
    queue.push(d);
    if (state === 'ready') begin();
    Sound.tone(state === 'play' ? 760 : 640, .035, 'sine', .035);
  }
  function begin() {
    state = 'play'; stateT = 0; acc = .999; // أول خطوة فورًا
    hintEl.style.opacity = 0; hintShown = true;
  }
  function step() {
    if (queue.length) dir = queue.shift();
    const h = body[0];
    let nx = h.x + dir[0], ny = h.y + dir[1];
    if (mode === 'wrap') { nx = (nx + N) % N; ny = (ny + N) % N; }
    const out = nx < 0 || ny < 0 || nx >= N || ny >= N;
    const hitSelf = !out && body.some((b, i) => b.x === nx && b.y === ny && !(i === body.length - 1 && grow === 0));
    if (out || map[ny][nx] || hitSelf) { crash(); return; }
    prev = body.map(p => ({ ...p }));
    body.unshift({ x: nx, y: ny });
    if (grow > 0) grow--; else body.pop();
    swallow.forEach(s => s.i++);
    const f = foods.find(f => !f.eaten && f.x === nx && f.y === ny);
    if (f) eat(f);
  }
  function eat(f) {
    f.eaten = true; f.eatT = 0; f.fx = 0;
    grow += 1; fruits++;
    const pts = f.gold ? 50 : 10;
    score += pts;
    swallow.push({ i: 0 });
    f.pts = pts;
    if (f.gold) { App.achieve('snake_gold'); eatenSinceGold = 0; }
    else {
      eatenSinceGold++;
      if (!foods.some(o => o.gold && !o.eaten) && fruits >= 3 && (Math.random() < .2 || eatenSinceGold >= 9)) spawnFood(true);
    }
    if (fruits >= 10) App.achieve('snake_10');
    if (body.length + grow >= 30) App.achieve('snake_30');
    if (mode !== 'adv') speed = Math.min(SPEEDS[spdIdx] + 1.6, speed + .05);
    if (mode === 'adv' && fruits >= target) { win(); return; }
    if (!f.gold && !foods.some(o => !o.gold && !o.eaten)) {
      if (!spawnFood(false) && mode !== 'adv') { full(); }
    }
    updChips();
  }
  /* مؤثرات الأكل تُنفّذ لحظة وصول الرأس بصريًا */
  function eatFx(f) {
    const x = px(f.x), y = py(f.y);
    const col = f.gold ? '#FFD43B' : { apple: '#F03E3E', strawberry: '#F2334A', banana: '#FFD43B', grapes: '#9A63F0', melon: '#FF6B81' }[f.type];
    for (let i = 0; i < (f.gold ? 26 : 14); i++) {
      const a = rand(0, TAU), v = rand(60, f.gold ? 240 : 170);
      parts.push({ t: i % 3 === 0 || f.gold ? 'star' : 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, life: rand(.4, .8), age: 0, s: rand(2.5, 5) * cell / 24, c: i % 2 ? col : (f.gold ? '#FFF6B0' : '#FFFFFF'), rot: rand(0, TAU), vr: rand(-6, 6) });
    }
    rings.push({ x, y, age: 0, life: .4, c: f.gold ? '#FFE066' : '#FFFFFF' });
    pops.push({ x, y: y - cell * .3, txt: '+' + f.pts, age: 0, gold: f.gold });
    face.happy = .45;
    const p = 1 + Math.min(fruits, 20) * .03;
    Sound.noise(.07, 1800, 600, .12, 2); Sound.tone(260 * p, .09, 'square', .07, -120); Sound.tone(520 * p, .1, 'sine', .1, 240, .05);
    if (f.gold) { Sound.star(); vibrate(25); } else vibrate(10);
  }
  function crash() {
    state = 'dead'; stateT = 0; queue = [];
    prev = body.map(p => ({ ...p })); acc = 0;
    shake = 8; vibrate(40);
    Sound.thud(); Sound.boom();
    const x = px(body[0].x), y = py(body[0].y);
    for (let i = 0; i < 16; i++) { const a = rand(0, TAU), v = rand(60, 160); parts.push({ t: 'star', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 50, life: rand(.5, .9), age: 0, s: rand(3, 6) * cell / 24, c: i % 2 ? '#FFE066' : '#FFFFFF', rot: 0, vr: rand(-6, 6) }); }
    overTimer = setTimeout(() => { if (App.current === ID) gameOver(false); }, 1300);
  }
  function full() { state = 'won'; stateT = 0; Sound.win(); confetti(); overTimer = setTimeout(() => { if (App.current === ID) gameOver(true); }, 1300); }
  function finishRewards() { if (fruits >= 10) App.addStars(Math.floor(fruits / 10)); }
  function gameOver(filled) {
    if (mode === 'adv') {
      Sound.lose();
      (overPaint = () => {
        q('.oT').textContent = App.t(App.g('أوه! حاولي مرة أخرى', 'أوه! حاول مرة أخرى'), 'Oh! Try again') + ' 💫';
        q('.oB').textContent = `🍎 ${fruits}/${target}`;
        q('.oP').textContent = App.t(`المرحلة ${lvl} · ` + App.g('اجمعي', 'اجمع') + ` ${target} فواكه للفوز`, `Level ${lvl} · Collect ${target} fruits to win`);
      })();
      q('.oM').style.display = 'none'; q('.oL').style.display = '';
      finishRewards();
      showOv(overOv); return;
    }
    const key = 'snakeBest_' + mode, prevBest = store.get(key, 0), rec = score > prevBest;
    if (rec) store.set(key, score);
    filled ? Sound.win() : (rec && score > 0 ? Sound.win() : Sound.lose());
    (overPaint = () => {
      q('.oT').textContent = filled ? App.t('رائع! امتلأت الحديقة 🎉', 'Great! The garden is full 🎉') : App.t('أوه! اصطدمت الدودة 💫', 'Oh! The worm bumped 💫');
      q('.oB').textContent = score;
      q('.oP').innerHTML = (rec && score > 0 ? `<span class="newrec">${App.t('🏆 رقم قياسي جديد!', '🏆 New record!')}</span><br>` : App.t(`🏆 أفضل نتيجة: ${Math.max(prevBest, score)}<br>`, `🏆 Best score: ${Math.max(prevBest, score)}<br>`)) +
        App.t(`${App.g('أكلتِ', 'أكلتَ')} ${fruits} ${fruits === 1 ? 'فاكهة' : 'فواكه'} · طول الدودة ${body.length}`, `You ate ${fruits} ${fruits === 1 ? 'fruit' : 'fruits'} · Worm length ${body.length}`);
    })();
    q('.oM').style.display = ''; q('.oL').style.display = 'none';
    showOv(overOv);
    if (rec && score > 0) confetti();
    finishRewards();
    updChips();
  }
  function win() {
    state = 'won'; stateT = 0; face.happy = 2;
    Sound.win(); vibrate(30); confetti();
    const L = MAPS[lvl - 1], par = L.t * 9 / L.s + 6;
    const stars = runTime <= par ? 3 : runTime <= par * 1.6 ? 2 : 1;
    const pr = loadProg(), prevS = pr.stars[lvl] || 0;
    if (stars > prevS) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(MAPS.length, lvl + 1);
    store.set('snakeProg', pr);
    updChips();
    overTimer = setTimeout(() => {
      if (App.current !== ID) return;
      (winPaint = () => {
        q('.wT').textContent = App.t(App.g('أحسنتِ!', 'أحسنت!'), 'Well done!') + ' 🎉';
        q('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
        q('.wP').textContent = App.t(`${App.g('أنهيتِ', 'أنهيتَ')} المرحلة ${lvl} في ⏱️ ${fmtT(runTime)}` + (stars < 3 ? ` · ${App.g('أسرعي لتحصلي', 'أسرع لتحصل')} على 3 نجوم` : ' 🚀'),
          `You finished level ${lvl} in ⏱️ ${fmtT(runTime)}` + (stars < 3 ? ' · Go faster to get 3 stars' : ' 🚀'));
      })();
      q('[data-a="next"]').style.display = lvl < MAPS.length ? '' : 'none';
      showOv(winOv);
      if (App.lang === 'en') App.speak('Well done!', 'en'); else App.speak(App.g('أحسنتِ!', 'أحسنت!'));
      const n = Math.max(0, stars - prevS) + Math.floor(fruits / 10);
      if (n) App.addStars(n);
    }, 1200);
  }
  function confetti() {
    for (let i = 0; i < 120; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 260), rot: rand(0, TAU), vr: rand(-8, 8),
      life: rand(2.5, 4), age: 0, s: rand(6, 11), c: ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9'][i % 6] });
  }
  function updChips() {
    let a, b, la, lb;
    if (mode === 'adv') { la = App.t('الفواكه', 'Fruits'); a = `${fruits}/${target}`; lb = App.t('الوقت', 'Time'); b = fmtT(runTime); }
    else { la = App.t('النقاط', 'Score'); a = score; lb = App.t('الأفضل', 'Best'); b = Math.max(bestOf(mode), score); }
    const k = [la, a, lb, b].join('|'); if (k === lastChip) return; lastChip = k;
    q('.c1L').textContent = la; q('.c1').textContent = a; q('.c2L').textContent = lb; q('.c2').textContent = b;
  }

  /* ---------- القوائم ---------- */
  function modesText() {
    q('.mT').textContent = App.t(App.g('اختاري طريقة اللعب', 'اختر طريقة اللعب'), 'Choose how to play');
    q('.mS1').textContent = App.t(App.g('احذري الجدران والذيل!', 'احذر الجدران والذيل!'), 'Watch out for the walls and the tail!');
    q('.mS2').textContent = App.t(App.g('اعبري من جهة إلى الجهة الأخرى', 'اعبر من جهة إلى الجهة الأخرى'), 'Go through one side to the other');
  }
  function openModes() {
    clearTimeout(overTimer);
    modesText();
    for (const m of ['classic', 'wrap']) { const b = bestOf(m); q(`[data-b="${m}"]`).textContent = b ? '🏆 ' + b : ''; }
    const pr = loadProg(), st = Object.values(pr.stars).reduce((a, n) => a + n, 0);
    q('[data-b="adv"]').textContent = st ? '⭐ ' + st : '';
    root.querySelectorAll('.sg button').forEach(b => b.classList.toggle('on', +b.dataset.s === spdIdx));
    showOv(modeOv);
  }
  function openLevels() {
    const pr = loadProg(), g = q('.lvg');
    g.innerHTML = MAPS.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl && mode === 'adv' ? ' cur' : ''}" data-l="${n}" aria-label="${App.t('المرحلة', 'Level')} ${n}"><span class="n">${n}</span><span class="e">${FRUIT_EMO[i % 5]}</span>
        <span class="s">${lock ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    g.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); store.set('snakeMode', 'adv'); startGame('adv', n);
    });
    showOv(lvOv);
  }
  function pauseText() { q('.pP').textContent = mode === 'adv' ? App.t(`المرحلة ${lvl} · 🍎 ${fruits}/${target}`, `Level ${lvl} · 🍎 ${fruits}/${target}`) : App.t(`${modeName(mode)} · النقاط ${score}`, `${modeName(mode)} · Score ${score}`); }
  function setPause(on) {
    if (on) {
      if (state !== 'play' && state !== 'ready') return;
      pauseText();
      showOv(pauseOv);
    } else { pauseOv.classList.remove('on'); last = performance.now(); }
  }
  function act(a) {
    Sound.tap();
    if (a === 'again') startGame(mode, lvl);
    else if (a === 'next') startGame('adv', lvl + 1);
    else if (a === 'levels') openLevels();
    else if (a === 'modes') openModes();
    else if (a === 'resume') setPause(false);
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelectorAll('.mb').forEach(b => b.addEventListener('click', () => {
    Sound.tap(); const m = b.dataset.m;
    if (m === 'adv') openLevels(); else { store.set('snakeMode', m); startGame(m); }
  }));
  root.querySelectorAll('.sg button').forEach(b => b.addEventListener('click', () => {
    Sound.tap(); spdIdx = +b.dataset.s; store.set('snakeSpeed', spdIdx);
    root.querySelectorAll('.sg button').forEach(x => x.classList.toggle('on', x === b));
  }));
  q('.pbtn').addEventListener('click', () => { Sound.tap(); if (pauseOv.classList.contains('on')) setPause(false); else if (!anyOv()) setPause(true); });

  /* ---------- الإدخال ---------- */
  dpad.querySelectorAll('[data-d]').forEach(b => {
    b.addEventListener('pointerdown', e => { e.preventDefault(); b.classList.add('on'); turn(b.dataset.d); });
    const up = () => b.classList.remove('on');
    b.addEventListener('pointerup', up); b.addEventListener('pointerleave', up); b.addEventListener('pointercancel', up);
  });
  let sw = null;
  root.addEventListener('pointerdown', e => {
    if (App.current !== ID || e.target.closest('.bar,.dpad,.overlay')) return;
    sw = { id: e.pointerId, x: e.clientX, y: e.clientY };
  });
  root.addEventListener('pointermove', e => {
    if (!sw || e.pointerId !== sw.id) return;
    const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) return;
    turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
    sw.x = e.clientX; sw.y = e.clientY;
  });
  const swEnd = e => { if (sw && e.pointerId === sw.id) sw = null; };
  root.addEventListener('pointerup', swEnd); root.addEventListener('pointercancel', swEnd);
  const KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (KEYS[e.key] && !anyOv()) { e.preventDefault(); turn(KEYS[e.key]); return; }
    if (e.key === ' ' || e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
      e.preventDefault();
      if (pauseOv.classList.contains('on')) setPause(false); else if (!anyOv()) setPause(true);
      return;
    }
    if (e.key === 'Enter') {
      if (overOv.classList.contains('on')) act('again');
      else if (winOv.classList.contains('on')) act(lvl < MAPS.length ? 'next' : 'levels');
    }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && App.current === ID && state === 'play' && !anyOv()) setPause(true); });

  /* ---------- التحديث ---------- */
  const frozen = () => sheetPaused || pauseOv.classList.contains('on') || document.hidden;
  function update(dt) {
    T += dt; stateT += dt;
    // الوجه
    face.blinkIn -= dt;
    if (face.blinkIn < 0) { face.blink = Math.min(1, face.blink + dt * 14); if (face.blinkIn < -.14) { face.blinkIn = rand(1.8, 4.5); } }
    else face.blink = Math.max(0, face.blink - dt * 10);
    face.happy = Math.max(0, face.happy - dt);
    if (state === 'play' && !frozen()) {
      runTime += dt;
      acc += dt * speed;
      let guard = 0;
      while (acc >= 1 && state === 'play' && guard++ < 3) { acc -= 1; step(); }
      if (state !== 'play') acc = 0;
    }
    // اتجاه النظر وفتح الفم
    let tx = dir[0], ty = dir[1];
    if (state === 'ready') { tx = Math.sin(T * .9) * .6; ty = Math.cos(T * 1.3) * .3; }
    face.lx += (tx - face.lx) * Math.min(1, dt * 10); face.ly += (ty - face.ly) * Math.min(1, dt * 10);
    const hv = headV();
    let near = 0;
    for (const f of foods) {
      if (f.eaten) continue;
      let dx = f.x - hv.x, dy = f.y - hv.y;
      if (mode === 'wrap') { dx -= N * Math.round(dx / N); dy -= N * Math.round(dy / N); }
      const d = Math.hypot(dx, dy), dot = (dx * dir[0] + dy * dir[1]) / (d || 1);
      if (d < 2.6 && dot > .5) near = Math.max(near, 1 - d / 2.6 + .3);
    }
    if (state !== 'play') near = 0;
    face.mouth += (clamp(near, 0, 1) - face.mouth) * Math.min(1, dt * 12);
    // الفواكه
    for (let i = foods.length - 1; i >= 0; i--) {
      const f = foods[i]; f.age += dt;
      if (f.eaten) {
        if (state === 'play' || state === 'won' || state === 'dead') f.eatT += dt * speed;
        if (f.eatT >= .55 && !f.fx) { f.fx = 1; eatFx(f); }
        if (f.eatT >= .9) foods.splice(i, 1);
      } else if (f.gold && state === 'play' && !frozen() && f.age > f.life) {
        foods.splice(i, 1); Sound.poof();
        for (let k = 0; k < 10; k++) { const a = rand(0, TAU); parts.push({ t: 'dot', x: px(f.x), y: py(f.y), vx: Math.cos(a) * 60, vy: Math.sin(a) * 60, life: .5, age: 0, s: 3, c: '#FFE8A0', rot: 0, vr: 0 }); }
      }
    }
    if (state === 'play' && !frozen() && foods.some(f => f.gold && !f.eaten) && Math.random() < dt * 8) {
      const f = foods.find(f => f.gold && !f.eaten), a = rand(0, TAU), r = cell * rand(.3, .7);
      parts.push({ t: 'star', x: px(f.x) + Math.cos(a) * r, y: py(f.y) + Math.sin(a) * r, vx: 0, vy: -20, life: .6, age: 0, s: rand(2, 4) * cell / 24, c: '#FFF3A0', rot: 0, vr: 3, g: 0 });
    }
    swallow = swallow.filter(s => s.i < body.length + 1);
    // الجسيمات
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.age += dt;
      if (p.age > p.life) { parts.splice(i, 1); continue; }
      if (p.t === 'conf') { p.vy = Math.min(p.vy + 120 * dt, 260); p.vx += Math.sin(T * 3 + i) * 40 * dt; }
      else if (p.g !== 0) { p.vx *= 1 - dt * 3; p.vy = p.vy * (1 - dt * 3) + 240 * dt; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    }
    for (let i = pops.length - 1; i >= 0; i--) { pops[i].age += dt; if (pops[i].age > 1) pops.splice(i, 1); }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    shake = Math.max(0, shake - dt * 20);
    if (mode === 'adv' && state === 'play') updChips();
  }

  /* ---------- الرسم ---------- */
  const wrapD = d => mode === 'wrap' ? d - N * Math.round(d / N) : d;
  function headV() {
    const t = state === 'play' ? clamp(acc, 0, 1) : (state === 'ready' ? 0 : 1);
    if (state !== 'play') return { x: body[0].x, y: body[0].y };
    return { x: prev[0].x + wrapD(body[0].x - prev[0].x) * t, y: prev[0].y + wrapD(body[0].y - prev[0].y) * t };
  }
  /* نقاط الجسم الافتراضية (بدون التفاف) ثم عيّنات على طول المسار */
  function snakePath() {
    let src;
    if (state === 'play') {
      const t = clamp(acc, 0, 1);
      src = [{ x: prev[0].x + wrapD(body[0].x - prev[0].x) * t, y: prev[0].y + wrapD(body[0].y - prev[0].y) * t }, ...prev];
    } else src = body.slice();
    const pts = [src[0]];
    for (let k = 1; k < src.length; k++) pts.push({ x: pts[k - 1].x + wrapD(src[k].x - src[k - 1].x), y: pts[k - 1].y + wrapD(src[k].y - src[k - 1].y) });
    // أطوال تراكمية
    const cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    const at = d => {
      d = Math.min(d, cum[cum.length - 1]);
      let i = 1; while (i < cum.length - 1 && cum[i] < d) i++;
      const seg = cum[i] - cum[i - 1] || 1, k = clamp((d - cum[i - 1]) / seg, 0, 1);
      return pts.length > 1 ? { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k } : pts[0];
    };
    return { at, len: body.length };
  }
  function drawSnake() {
    const P = snakePath(), n = P.len;
    const segs = []; for (let i = 0; i < n; i++) segs.push(P.at(i));
    const dense = []; for (let d = 0; d <= n - 1 + 1e-6; d += .25) dense.push(P.at(d));
    // نسخ للالتفاف
    let offs = [[0, 0]];
    if (mode === 'wrap') {
      let mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
      for (const s of segs) { mnx = Math.min(mnx, s.x); mxx = Math.max(mxx, s.x); mny = Math.min(mny, s.y); mxy = Math.max(mxy, s.y); }
      const ox = [0], oy = [0];
      if (mnx < .5) ox.push(N); if (mxx > N - 1.5) ox.push(-N);
      if (mny < .5) oy.push(N); if (mxy > N - 1.5) oy.push(-N);
      offs = []; for (const a of ox) for (const b of oy) offs.push([a, b]);
      ctx.save(); ctx.beginPath(); ctx.roundRect(bx, by, bs, bs, Math.max(10, cell * .6)); ctx.clip();
    }
    let bump = 0;
    if (state === 'dead') bump = Math.sin(Math.min(1, stateT * 5) * Math.PI) * .28;
    const rBase = cell * .47;
    for (const [ox, oy] of offs) {
      const X = p => bx + (p.x + ox + .5) * cell, Y = p => by + (p.y + oy + .5) * cell;
      // ظل
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(30,70,20,.25)'; ctx.lineWidth = rBase * 1.9;
      ctx.beginPath(); dense.forEach((p, i) => i ? ctx.lineTo(X(p) + 2, Y(p) + rBase * .45) : ctx.moveTo(X(p) + 2, Y(p) + rBase * .45)); ctx.stroke();
      ctx.strokeStyle = 'rgba(70,40,90,.35)'; ctx.lineWidth = rBase * 1.5;
      ctx.beginPath(); dense.forEach((p, i) => i ? ctx.lineTo(X(p), Y(p)) : ctx.moveTo(X(p), Y(p))); ctx.stroke();
      ctx.restore();
      // أرجل
      const ph = state === 'play' ? acc * TAU : T * 2;
      for (let i = n - 1; i >= 1; i--) { const s = segs[i], r = segR(i, n, rBase); drawFeet(ctx, X(s), Y(s), r, ph + i * 1.3); }
      // القطع
      for (let i = n - 1; i >= 1; i--) {
        const s = segs[i]; let r = segR(i, n, rBase);
        for (const w of swallow) { const d = Math.abs(w.i + (state === 'play' ? acc : 0) - i); if (d < 1) r *= 1 + .28 * (1 - d); }
        r *= 1 + Math.sin(T * 5 - i * .7) * .03;
        if (state === 'dead' && Math.floor(stateT * 8) % 2 === 0 && stateT < 1) { ctx.globalAlpha = .75; }
        drawSeg(ctx, X(s), Y(s), r, BODY[(i - 1) % BODY.length]);
        ctx.globalAlpha = 1;
      }
      // الرأس
      const h = segs[0];
      const hx = X(h) + dir[0] * bump * cell, hy = Y(h) + dir[1] * bump * cell;
      const sq = face.happy > 0 ? Math.sin(face.happy * 14) * .06 : 0;
      ctx.save(); ctx.translate(hx, hy); ctx.scale(1 + sq, 1 - sq);
      drawHead(ctx, 0, 0, cell * .7, { lx: face.lx, ly: face.ly, blink: face.blink, mouth: face.mouth, happy: state === 'won' ? 1 : face.happy, dizzy: state === 'dead', t: T, tilt: Math.sin(T * 2) * .08 });
      ctx.restore();
      if (state === 'dead') { // نجوم الدوخة
        for (let k = 0; k < 3; k++) {
          const a = T * 4 + k * TAU / 3;
          ctx.save(); ctx.translate(hx + Math.cos(a) * cell * .8, hy - cell * 1.2 + Math.sin(a) * cell * .22);
          ctx.fillStyle = '#FFD43B'; ctx.strokeStyle = '#E8590C'; ctx.lineWidth = 1; starPath(ctx, cell * .16); ctx.fill(); ctx.stroke(); ctx.restore();
        }
      }
    }
    if (mode === 'wrap') ctx.restore();
  }
  const segR = (i, n, r) => r * (1 - .3 * Math.pow(i / Math.max(n - 1, 1), 1.5));

  function drawFoods() {
    for (const f of foods) {
      let x = px(f.x), y = py(f.y), s = 1;
      if (f.eaten) {
        const k = clamp(f.eatT / .55, 0, 1);
        const hv = headV();
        s = 1 - k * .8;
        const hx = bx + (hv.x + .5) * cell, hy = by + (hv.y + .5) * cell;
        x += (hx - x) * k * .5; y += (hy - y) * k * .5;
        if (f.fx) continue;
      } else {
        const a = clamp(f.age / .35, 0, 1);
        s = outBack(a) * (1 + Math.sin(T * 3 + f.ph) * .04);
      }
      if (f.gold && !f.eaten) {
        const left = f.life - f.age;
        if (left < 2 && Math.floor(f.age * 8) % 2 === 0) s *= .9;
        // توهج
        const g = ctx.createRadialGradient(x, y, 1, x, y, cell * .95);
        g.addColorStop(0, 'rgba(255,240,150,.85)'); g.addColorStop(1, 'rgba(255,220,80,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, cell * .95, 0, TAU); ctx.fill();
        // مؤقت دائري
        ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = Math.max(2, cell * .09); ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(x, y, cell * .62, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(left / f.life, 0, 1)); ctx.stroke();
      }
      // ظل
      ctx.fillStyle = 'rgba(30,70,20,.25)'; ctx.beginPath(); ctx.ellipse(x, y + cell * .36, cell * .3 * s, cell * .09 * s, 0, 0, TAU); ctx.fill();
      const img = fruitImg(f.type, f.gold), sz = cell * 1.5 * s;
      const bob = f.eaten ? 0 : Math.sin(T * 3 + f.ph) * cell * .04;
      ctx.drawImage(img, x - sz / 2, y - sz / 2 + bob - cell * .04, sz, sz);
      if (f.gold && !f.eaten) {
        for (let k = 0; k < 2; k++) {
          const a = T * 1.5 + k * Math.PI;
          ctx.save(); ctx.translate(x + Math.cos(a) * cell * .45, y - cell * .3 + Math.sin(a) * cell * .2); ctx.rotate(T * 2);
          ctx.fillStyle = '#FFFBE0'; starPath(ctx, cell * (.1 + .04 * Math.sin(T * 6 + k))); ctx.fill(); ctx.restore();
        }
      }
    }
  }
  function render() {
    ctx.save();
    ctx.fillStyle = '#BDEB8E'; ctx.fillRect(0, 0, W, H);
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    drawFoods();
    if (body.length) drawSnake();
    for (const r of rings) {
      const t = r.age / r.life;
      ctx.save(); ctx.globalAlpha = 1 - t; ctx.strokeStyle = r.c; ctx.lineWidth = 5 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, cell * (.4 + t * .9), 0, TAU); ctx.stroke(); ctx.restore();
    }
    for (const p of parts) {
      const a = 1 - p.age / p.life;
      ctx.save(); ctx.globalAlpha = p.t === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
      if (p.t === 'star') { starPath(ctx, p.s * (.6 + a * .6)); ctx.fill(); }
      else if (p.t === 'dot') { ctx.beginPath(); ctx.arc(0, 0, p.s * a + .8, 0, TAU); ctx.fill(); }
      else { ctx.scale(1, Math.cos(p.age * 9 + p.rot)); ctx.fillRect(-p.s / 2, -p.s * .3, p.s, p.s * .6); }
      ctx.restore();
    }
    for (const p of pops) {
      const t = p.age, a = t < .7 ? 1 : 1 - (t - .7) / .3, s = t < .15 ? outBack(t / .15) : 1;
      ctx.save(); ctx.globalAlpha = clamp(a, 0, 1); ctx.translate(p.x, p.y - t * cell * 1.3); ctx.scale(s, s);
      ctx.font = `900 ${Math.max(18, cell * (p.gold ? 1 : .8))}px ${FONT}`; ctx.direction = 'ltr'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.lineJoin = 'round'; ctx.strokeText(p.txt, 0, 0);
      ctx.fillStyle = p.gold ? '#E89B0C' : '#E8590C'; ctx.fillText(p.txt, 0, 0);
      ctx.restore();
    }
    ctx.restore();
  }
  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
    if (sheetPaused || document.hidden) return;
    update(pauseOv.classList.contains('on') ? 0 : dt); render();
  }
  function startLoop() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stopLoop() { running = false; cancelAnimationFrame(raf); }
  let resizeT = 0;
  window.addEventListener('resize', () => {
    if (App.current !== ID) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    IK.bg(c, s, ['#E9FFC8', '#9BE05C', '#4FA82A'], { seed: 14 });
    for (const [x, y, col] of [[.14, .17, '#FF7EB9'], [.88, .12, '#FFFFFF'], [.1, .9, '#FFD43B']]) {
      c.fillStyle = col; for (let k = 0; k < 5; k++) { const a = k * TAU / 5; c.beginPath(); c.arc(x * s + Math.cos(a) * 5, y * s + Math.sin(a) * 5, 4.2, 0, TAU); c.fill(); }
      c.fillStyle = '#FFB300'; c.beginPath(); c.arc(x * s, y * s, 3, 0, TAU); c.fill();
    }
    IK.shadow(c, s * .5, s * .86, s * .4, s * .06, .25);
    IK.sticker(c, s, c => {
      c.save(); c.translate(s * .78, s * .72); drawFruit(c, 'apple', s * .16); c.restore();
      const segs = [[.16, .78], [.27, .74], [.37, .66], [.44, .55]], r = s * .095;
      segs.forEach(([x, y], i) => drawFeet(c, x * s, y * s, r * (.8 + i * .07), i));
      segs.forEach(([x, y], i) => drawSeg(c, x * s, y * s, r * (.8 + i * .07), BODY[(3 - i + 7) % 7]));
      drawHead(c, s * .52, s * .4, s * .18, { lx: .7, ly: .4, blink: 0, mouth: .8, happy: 0, t: 1.2, tilt: -.12 });
    });
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'الدودة الجائعة', titleEn: 'Hungry Worm', icon2: '🐛', isNew: false, music: 'snake',
    desc: () => App.g('ساعدي الدودة لتأكل الفواكه وتكبر', 'ساعد الدودة لتأكل الفواكه وتكبر'),
    descEn: () => 'Help the worm eat fruit and grow',
    helpEn: () => [
      '👆 Swipe anywhere with your finger, or use the buttons and arrows to steer the worm',
      '🍎 Every fruit makes the worm longer and gives you 10 points',
      '✨ The golden fruit disappears fast… hurry to it to win 50 points!',
      '🧱 Don\'t bump into the fence, the rocks, the bushes or the worm\'s tail',
      '🗺️ In Adventure, collect the fruits you need to finish the level — the faster you are, the more stars ⭐'
    ],
    help: () => [
      '👆 ' + App.g('اسحبي', 'اسحب') + ' بإصبعك في أي مكان، أو ' + App.g('استخدمي', 'استخدم') + ' الأزرار والأسهم لتوجيه الدودة',
      '🍎 كل فاكهة تجعل الدودة أطول وتمنحك 10 نقاط',
      '✨ الفاكهة الذهبية تختفي بسرعة… ' + App.g('أسرعي', 'أسرع') + ' إليها لتربح 50 نقطة!',
      '🧱 لا ' + App.g('تصطدمي', 'تصطدم') + ' بالسياج أو الصخور أو الشجيرات أو بذيل الدودة',
      '🗺️ في المغامرة ' + App.g('اجمعي', 'اجمع') + ' الفواكه المطلوبة لتنهي المرحلة، وكلما ' + App.g('أسرعتِ', 'أسرعتَ') + ' زادت النجوم ⭐'
    ],
    icon,
    best() {
      const b = Math.max(store.get('snakeBest_classic', 0), store.get('snakeBest_wrap', 0));
      if (b) return App.t('🏆 أفضل نتيجة: ', '🏆 Best score: ') + b;
      const pr = loadProg(), ks = Object.keys(pr.stars).filter(k => pr.stars[k]);
      return ks.length ? App.t('🏆 المرحلة ', '🏆 Level ') + Math.max(...ks.map(Number)) : '';
    },
    onLang() {
      i18n(); modesText(); hintT.textContent = hintText(); lastChip = ''; updChips();
      if (overOv.classList.contains('on') && overPaint) overPaint();
      if (winOv.classList.contains('on') && winPaint) winPaint();
      if (pauseOv.classList.contains('on')) pauseText();
      if (lvOv.classList.contains('on')) openLevels();
    },
    enter() {
      i18n();
      sheetPaused = false;
      spdIdx = clamp(store.get('snakeSpeed', 0) | 0, 0, 2);
      mode = store.get('snakeMode', 'classic');
      if (!['classic', 'wrap', 'adv'].includes(mode)) mode = 'classic';
      // لوح تجريبي خلف نافذة الأوضاع
      const m = mode; startGame(m === 'adv' ? 'classic' : m); mode = m;
      hintEl.style.opacity = 0;
      openModes();
      render(); startLoop();
    },
    leave() { stopLoop(); clearTimeout(overTimer); sw = null; OVS.forEach(o => o.classList.remove('on')); },
    pause() { sheetPaused = true; },
    resume() { sheetPaused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { openModes(); return true; }
      if (pauseOv.classList.contains('on')) { setPause(false); return true; }
      if (!anyOv() && (state === 'play' || state === 'ready')) { setPause(true); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() { return { mode, lvl, state, score, fruits, len: body.length, head: body[0], body, map, dir, queue: queue.length, foods: foods.map(f => ({ x: f.x, y: f.y, gold: f.gold })), speed, cell, bx, by }; }
  });
})();
