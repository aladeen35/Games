/* =====================================================================
   المتاهة — أوصل الشخصية إلى هدفها عبر متاهات تكبر تدريجيًا
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'maze', TAU = Math.PI * 2, NLV = 40;

  /* ---------- أدوات ---------- */
  const ease = k => 1 - Math.pow(1 - k, 3);
  const backOut = k => { const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
  function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const pick = (rng, a) => a[Math.floor(rng() * a.length)];
  const fmtT = s => { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

  /* ---------- الاتجاهات: [dx, dy, بت الفتحة, بت الجهة المقابلة] (شمال، شرق، جنوب، غرب) ---------- */
  const DIRS = [[0, -1, 1, 4], [1, 0, 2, 8], [0, 1, 4, 1], [-1, 0, 8, 2]];
  const openCnt = b => (b & 1) + (b >> 1 & 1) + (b >> 2 & 1) + (b >> 3 & 1);

  /* =====================================================================
     العوالم: تتبدل كل 8 مستويات
     ===================================================================== */
  const THEMES = [
    { key: 'garden', name: 'الحديقة', ch: 'الأرنب', goal: 'الجزرة', nameEn: 'The Garden', chEn: 'the rabbit', goalEn: 'the carrot', em: '🐰', gem: '🥕', wall: 'hedge',
      bg: ['#BDE8FF', '#E3F6C9', '#97D277'], floor: ['#F6E9C6', '#EAD8A6'], frame: ['#8A5A32', '#5E3B1E'],
      trail: '#FF8A2A', trail2: '#FFD7A3', puff: ['#E3CC93', '#CDB277', '#A5D987'], ui: ['#3E9B3A', '#2A6B24', '#EAF8DD'],
      conf: ['#FF8A2A', '#7AD15A', '#FFD84D', '#FF7FB0', '#FFFFFF'] },
    { key: 'sea', name: 'البحر', ch: 'السمكة', goal: 'الصدفة', nameEn: 'The Sea', chEn: 'the fish', goalEn: 'the shell', em: '🐠', gem: '🐚', wall: 'coral',
      bg: ['#56C7F0', '#1C83C2', '#0C4A86'], floor: ['#FBEBC2', '#F0D89E'], frame: ['#2A8FB8', '#145F86'],
      trail: '#22B8F0', trail2: '#B8F0FF', puff: ['#FFFFFF', '#CFF4FF', '#9EE6FF'], ui: ['#1C8FCB', '#0E5E8E', '#E2F6FF'],
      conf: ['#FF7A6B', '#FFD84D', '#4FE0D2', '#FFFFFF', '#C77DDB'] },
    { key: 'space', name: 'الفضاء', ch: 'الصاروخ', goal: 'الكوكب', nameEn: 'Space', chEn: 'the rocket', goalEn: 'the planet', em: '🚀', gem: '🪐', wall: 'neon',
      bg: ['#0B0830', '#1D1352', '#3A1C6E'], floor: ['#16123E', '#100C30'], frame: ['#3B2D86', '#22195A'],
      trail: '#FFE14D', trail2: '#FFF7C2', puff: ['#FFB13B', '#FF6A3D', '#FFE14D'], ui: ['#7A5CFF', '#4A33B8', '#ECE6FF'],
      conf: ['#3EF2FF', '#FF5BE0', '#FFE14D', '#FFFFFF', '#7CFF8A'] },
    { key: 'candy', name: 'أرض الحلوى', ch: 'الطفل', goal: 'الكعكة', nameEn: 'Candy Land', chEn: 'the child', goalEn: 'the cake', em: '🧒', gem: '🎂', wall: 'candy',
      bg: ['#FFD2EA', '#FFEAF5', '#FFC6E0'], floor: ['#FFF4FA', '#FFE4F1'], frame: ['#FF8CC0', '#D9578F'],
      trail: '#4FB8FF', trail2: '#C9EBFF', puff: ['#FF4F7B', '#3CC8A0', '#7C6CFF', '#FFD24D'], ui: ['#FF5FA2', '#C93676', '#FFE8F3'],
      conf: ['#FF4F7B', '#3CC8A0', '#7C6CFF', '#FFD24D', '#FFFFFF'] },
    { key: 'castle', name: 'القلعة', ch: 'الفارس', goal: 'التاج', nameEn: 'The Castle', chEn: 'the knight', goalEn: 'the crown', em: '🛡️', gem: '👑', wall: 'stone',
      bg: ['#B9C6E8', '#9AA3CF', '#6F6A9C'], floor: ['#E8E0CE', '#D9CFB8'], frame: ['#6B6F86', '#45485C'],
      trail: '#E8475F', trail2: '#FFC2CB', puff: ['#D8D0BE', '#B9B09C', '#EDE6D6'], ui: ['#6A63B5', '#433C85', '#EEECFA'],
      conf: ['#FFC531', '#E8475F', '#6A63B5', '#FFFFFF', '#4FC3F7'] }
  ];
  const themeOf = n => THEMES[Math.floor((n - 1) / 8) % THEMES.length];

  /* =====================================================================
     توليد المتاهة (ببذرة ثابتة لكل مستوى)
     ===================================================================== */
  function dims(n) { const t = Math.pow((n - 1) / (NLV - 1), 1.05); return [Math.round(4 + 14 * t), Math.round(4 + 22 * t)]; }
  const inside = (M, x, y) => x >= 0 && y >= 0 && x < M.C && y < M.R;
  function carve(C, R, rng, algo) {
    const g = new Uint8Array(C * R), ok = (x, y) => x >= 0 && y >= 0 && x < C && y < R;
    if (algo === 'prim') {
      const inM = new Uint8Array(C * R), inF = new Uint8Array(C * R), fr = [];
      const add = (x, y) => { for (const d of DIRS) { const nx = x + d[0], ny = y + d[1]; if (!ok(nx, ny)) continue; const k = ny * C + nx; if (!inM[k] && !inF[k]) { inF[k] = 1; fr.push(k); } } };
      const s = Math.floor(rng() * C * R); inM[s] = 1; add(s % C, s / C | 0);
      while (fr.length) {
        const i = Math.floor(rng() * fr.length), k = fr[i]; fr[i] = fr[fr.length - 1]; fr.pop();
        const x = k % C, y = k / C | 0, opts = [];
        DIRS.forEach((d, di) => { const nx = x + d[0], ny = y + d[1]; if (ok(nx, ny) && inM[ny * C + nx]) opts.push(di); });
        const d = DIRS[pick(rng, opts)];
        g[k] |= d[2]; g[(y + d[1]) * C + x + d[0]] |= d[3]; inM[k] = 1; add(x, y);
      }
    } else {
      const vis = new Uint8Array(C * R), s0 = Math.floor(rng() * C * R), st = [s0]; vis[s0] = 1;
      let prev = -1;
      while (st.length) {
        const k = st[st.length - 1], x = k % C, y = k / C | 0, opts = [];
        DIRS.forEach((d, di) => { const nx = x + d[0], ny = y + d[1]; if (ok(nx, ny) && !vis[ny * C + nx]) opts.push(di); });
        if (!opts.length) { st.pop(); prev = -1; continue; }
        // ميل خفيف للممرات المستقيمة (أسهل للصغار)
        const di = opts.includes(prev) && rng() < .3 ? prev : pick(rng, opts), d = DIRS[di], nk = (y + d[1]) * C + x + d[0];
        g[k] |= d[2]; g[nk] |= d[3]; vis[nk] = 1; st.push(nk); prev = di;
      }
    }
    return g;
  }
  /** بحث بالعرض من مصادر متعددة */
  function bfs(M, srcs, maxD) {
    const { C, R, g } = M, N = C * R, dist = new Int32Array(N).fill(-1), prev = new Int32Array(N).fill(-1), q = new Int32Array(N);
    let h = 0, t = 0;
    for (const s of srcs) { if (dist[s] < 0) { dist[s] = 0; q[t++] = s; } }
    while (h < t) {
      const k = q[h++], x = k % C, y = k / C | 0;
      if (maxD != null && dist[k] >= maxD) continue;
      for (const d of DIRS) {
        if (!(g[k] & d[2])) continue;
        const nk = (y + d[1]) * C + x + d[0];
        if (dist[nk] < 0) { dist[nk] = dist[k] + 1; prev[nk] = k; q[t++] = nk; }
      }
    }
    return { dist, prev };
  }
  function pathTo(b, from, to) {
    if (b.dist[to] < 0) return null;
    const p = []; let k = to; while (k !== from && k >= 0) { p.push(k); k = b.prev[k]; }
    return p.reverse();
  }
  const lvCache = {};
  function genLevel(n, land) {
    const key = n + (land ? 'L' : 'P'); if (lvCache[key]) return lvCache[key];
    let [C, R] = dims(n); if (land) [C, R] = [R, C];
    const rng = mulberry(n * 7919 + (land ? 4441 : 0) + 17);
    const g = carve(C, R, rng, n % 3 === 0 ? 'prim' : 'dfs');
    const M = { C, R, g, n };
    // بضع حلقات في المتاهات الكبيرة حتى يكون هناك أكثر من طريق
    if (n >= 10) {
      let k = Math.floor(C * R * .025);
      for (let tries = 0; k > 0 && tries < 400; tries++) {
        const x = Math.floor(rng() * C), y = Math.floor(rng() * R), d = DIRS[rng() < .5 ? 1 : 2];
        const nx = x + d[0], ny = y + d[1]; if (!inside(M, nx, ny)) continue;
        const i = y * C + x; if (g[i] & d[2]) continue;
        if (openCnt(g[i]) >= 3 || openCnt(g[ny * C + nx]) >= 3) continue;
        g[i] |= d[2]; g[ny * C + nx] |= d[3]; k--;
      }
    }
    M.start = C - 1; // تبدأ الشخصية أعلى اليمين
    /* الهدف دائمًا في «آخر» المتاهة: أبعد طريق مسدود عن البداية.
       بما أنه طريق مسدود فلا يقع خلفه أي شيء، فكل النجوم يمكن الوصول إليها قبل الهدف. */
    const b0 = bfs(M, [M.start]);
    let far = (R - 1) * C, fd = -1;
    for (let i = 0; i < C * R; i++) if (i !== M.start && openCnt(g[i]) === 1 && b0.dist[i] > fd) { fd = b0.dist[i]; far = i; }
    M.goal = far;
    M.sol = [M.start].concat(pathTo(b0, M.start, M.goal));
    // النجوم في الطرق المسدودة
    const bp = bfs(M, M.sol), cand = [];
    for (let i = 0; i < C * R; i++) if (i !== M.start && i !== M.goal && openCnt(g[i]) === 1 && bp.dist[i] > 0) cand.push(i);
    const want = n === 1 ? 1 : n < 4 ? 2 : 3, cap = 3 + n / 5;
    const sc = new Map(cand.map(i => [i, Math.min(bp.dist[i], cap) + rng() * 2]));
    cand.sort((a, b) => sc.get(b) - sc.get(a));
    const stars = [], md = (a, b) => Math.abs(a % C - b % C) + Math.abs((a / C | 0) - (b / C | 0));
    for (const minSep of [(C + R) / 3, (C + R) / 6, 0]) {
      for (const i of cand) { if (stars.length >= want) break; if (stars.includes(i) || stars.some(s => md(s, i) < minSep)) continue; stars.push(i); }
    }
    M.stars = stars;
    const detour = stars.reduce((a, s) => a + 2 * bp.dist[s], 0);
    M.par = Math.round((M.sol.length - 1 + detour) * .55 + 5 + stars.length * 1.5);
    M.hints = n <= 20 ? 2 : 3;
    return (lvCache[key] = M);
  }
  function wallRuns(M) {
    const { C, R, g } = M, H = [], V = [], deg = new Uint8Array((C + 1) * (R + 1));
    for (let y = 0; y <= R; y++) {
      let s = -1;
      for (let x = 0; x <= C; x++) {
        const w = x < C && (y === 0 || y === R || !(g[y * C + x] & 1));
        if (w && s < 0) s = x;
        if (!w && s >= 0) { H.push([s, x, y]); s = -1; }
      }
    }
    for (let x = 0; x <= C; x++) {
      let s = -1;
      for (let y = 0; y <= R; y++) {
        const w = y < R && (x === 0 || x === C || !(g[y * C + x] & 8));
        if (w && s < 0) s = y;
        if (!w && s >= 0) { V.push([s, y, x]); s = -1; }
      }
    }
    const W1 = C + 1;
    for (const [s, e, y] of H) for (let x = s; x < e; x++) { deg[y * W1 + x] |= 2; deg[y * W1 + x + 1] |= 8; }
    for (const [s, e, x] of V) for (let y = s; y < e; y++) { deg[y * W1 + x] |= 4; deg[(y + 1) * W1 + x] |= 1; }
    // كل جزء: [x0,y0,طول,أفقي؟] بوحدات الخلايا
    const runs = H.map(([s, e, y]) => [s, y, e - s, 1]).concat(V.map(([s, e, x]) => [x, s, e - s, 0]));
    return { runs, deg, W1 };
  }

  /* =====================================================================
     رسم الجدران حسب العالم
     ===================================================================== */
  function drawWalls(c, M, S, ox, oy, style, seed) {
    const rng = mulberry(seed), { runs, deg, W1 } = wallRuns(M);
    const wt = clamp(S * .27, 3, 15);
    const P = new Path2D();
    for (const [x, y, L, h] of runs) { P.moveTo(ox + x * S, oy + y * S); P.lineTo(ox + (x + (h ? L : 0)) * S, oy + (y + (h ? 0 : L)) * S); }
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    const local = (r, fn) => { const [x, y, L, h] = r; c.save(); c.translate(ox + x * S, oy + y * S); if (!h) c.rotate(Math.PI / 2); fn(L * S); c.restore(); };
    const samples = (step, fn) => {
      for (const [x, y, L, h] of runs) {
        const len = L * S, n = Math.max(1, Math.round(len / step));
        for (let i = 0; i <= n; i++) { const d = len * i / n; fn(ox + x * S + (h ? d : 0), oy + y * S + (h ? 0 : d), h); }
      }
    };
    // ظل عام
    c.save(); c.translate(wt * .12, wt * .38); c.strokeStyle = style === 'neon' ? 'rgba(0,0,0,.45)' : 'rgba(30,20,40,.25)'; c.lineWidth = wt * 1.08; c.stroke(P); c.restore();
    if (style === 'hedge') {
      c.strokeStyle = '#2A6A22'; c.lineWidth = wt; c.stroke(P);
      const greens = ['#2F7A27', '#3B9233', '#47A23C', '#57B248', '#348A2C'];
      samples(wt * .4, (x, y, h) => {
        for (let k = 0; k < 2; k++) {
          const px = x + (h ? rand2(rng, wt * .2) : rand2(rng, wt * .26)), py = y + (h ? rand2(rng, wt * .26) : rand2(rng, wt * .2));
          c.fillStyle = pick(rng, greens); c.beginPath(); c.arc(px, py, wt * (.2 + rng() * .13), 0, TAU); c.fill();
        }
      });
      c.fillStyle = 'rgba(160,230,120,.55)';
      samples(wt * .55, (x, y) => { c.beginPath(); c.arc(x - wt * .12 + rand2(rng, wt * .1), y - wt * .2 + rand2(rng, wt * .08), wt * (.08 + rng() * .07), 0, TAU); c.fill(); });
      samples(wt * 2.2, (x, y) => {
        if (rng() > .22) return;
        const col = pick(rng, ['#FFFFFF', '#FF9CC8', '#FFE066', '#C9A6FF']), r = wt * .13;
        c.fillStyle = col;
        for (let i = 0; i < 5; i++) { const a = i * TAU / 5; c.beginPath(); c.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, r * .8, 0, TAU); c.fill(); }
        c.fillStyle = '#FFC531'; c.beginPath(); c.arc(x, y, r * .6, 0, TAU); c.fill();
      });
    } else if (style === 'coral') {
      const pals = [['#FF7A6B', '#FFB4A2', '#D9483A'], ['#FF9F43', '#FFD29A', '#D2701A'], ['#C77DDB', '#EBC0F7', '#9045AE'], ['#FF6FA8', '#FFC2DA', '#C93E78']];
      for (const r of runs) {
        const pl = pick(rng, pals);
        local(r, len => {
          c.strokeStyle = pl[2]; c.lineWidth = wt; c.beginPath(); c.moveTo(0, 0); c.lineTo(len, 0); c.stroke();
          c.strokeStyle = pl[0]; c.lineWidth = wt * .8; c.beginPath(); c.moveTo(0, -wt * .06); c.lineTo(len, -wt * .06); c.stroke();
          const n = Math.max(2, Math.round(len / (wt * .55)));
          for (let i = 0; i <= n; i++) {
            const d = len * i / n, side = i % 2 ? 1 : -1;
            c.fillStyle = pl[0]; c.beginPath(); c.arc(d, side * wt * .3, wt * (.2 + rng() * .1), 0, TAU); c.fill();
            c.fillStyle = pl[1]; c.beginPath(); c.arc(d - wt * .05, side * wt * .3 - wt * .06, wt * .08, 0, TAU); c.fill();
          }
          c.fillStyle = 'rgba(255,255,255,.75)';
          for (let i = 0; i < n; i++) { c.beginPath(); c.arc(len * (i + .5) / n, rand2(rng, wt * .15), wt * .055, 0, TAU); c.fill(); }
        });
      }
    } else if (style === 'neon') {
      const col = M.n % 2 ? '#3EF2FF' : '#FF5BE0';
      c.strokeStyle = '#0B0826'; c.lineWidth = wt * 1.02; c.stroke(P);
      c.strokeStyle = 'rgba(255,255,255,.08)'; c.lineWidth = wt * .8; c.stroke(P);
      c.shadowColor = col; c.shadowBlur = wt * 1.6; c.strokeStyle = col; c.lineWidth = wt * .4; c.stroke(P); c.stroke(P);
      c.shadowBlur = 0; c.strokeStyle = 'rgba(255,255,255,.92)'; c.lineWidth = Math.max(1, wt * .13); c.stroke(P);
    } else if (style === 'candy') {
      const stripes = ['#FF4F7B', '#2FBF95', '#7C6CFF', '#FF9F2E'];
      for (const r of runs) {
        const sc = pick(rng, stripes);
        local(r, len => {
          c.beginPath(); c.roundRect(-wt * .5, -wt * .5, len + wt, wt, wt * .5);
          const g = c.createLinearGradient(0, -wt * .5, 0, wt * .5); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.7, '#FFF3F7'); g.addColorStop(1, '#F1CFDC');
          c.fillStyle = g; c.fill();
          c.save(); c.clip();
          c.fillStyle = sc;
          for (let x = -wt * 1.5; x < len + wt * 1.5; x += wt * 1.15) { c.beginPath(); c.moveTo(x, -wt * .6); c.lineTo(x + wt * .45, -wt * .6); c.lineTo(x + wt * .05, wt * .6); c.lineTo(x - wt * .4, wt * .6); c.closePath(); c.fill(); }
          c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(-wt * .5, -wt * .33, len + wt, wt * .16);
          c.fillStyle = 'rgba(120,20,60,.12)'; c.fillRect(-wt * .5, wt * .22, len + wt, wt * .3);
          c.restore();
          c.strokeStyle = 'rgba(160,40,90,.3)'; c.lineWidth = Math.max(1, wt * .07); c.beginPath(); c.roundRect(-wt * .5, -wt * .5, len + wt, wt, wt * .5); c.stroke();
        });
      }
      const gums = ['#FF4F7B', '#2FBF95', '#7C6CFF', '#FFC531', '#3EB7FF'];
      for (let y = 0; y <= M.R; y++) for (let x = 0; x <= M.C; x++) {
        const d = deg[y * W1 + x]; if (!d || d === 10 || d === 5) continue;
        const px = ox + x * S, py = oy + y * S, r = wt * .66, col = pick(rng, gums);
        const g = c.createRadialGradient(px - r * .35, py - r * .4, r * .1, px, py, r);
        g.addColorStop(0, '#FFFFFF'); g.addColorStop(.25, col); g.addColorStop(1, shade(col, -.25));
        c.fillStyle = g; c.beginPath(); c.arc(px, py, r, 0, TAU); c.fill();
      }
    } else { // stone
      const greys = ['#A5A7B6', '#9497A8', '#ADAAB8', '#9C9EAE', '#B4B2BE'];
      for (const r of runs) {
        local(r, len => {
          const th = wt * 1.05, x0 = -wt * .5, x1 = len + wt * .5, bl = Math.max(wt * 1.2, S * .45);
          let x = x0 - rng() * bl * .5;
          while (x < x1) {
            const a = Math.max(x0, x), b = Math.min(x1, x + bl * (.8 + rng() * .5));
            const col = pick(rng, greys), g = c.createLinearGradient(0, -th / 2, 0, th / 2);
            g.addColorStop(0, shade(col, .18)); g.addColorStop(1, shade(col, -.18));
            c.fillStyle = g; c.beginPath(); c.roundRect(a + .6, -th / 2, b - a - 1.2, th, Math.min(3, th * .2)); c.fill();
            x = b;
          }
          c.strokeStyle = 'rgba(50,50,70,.45)'; c.lineWidth = Math.max(1, wt * .08); c.strokeRect(x0, -th / 2, x1 - x0, th);
          c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x0, -th / 2, x1 - x0, Math.max(1, th * .14));
        });
      }
      for (let y = 0; y <= M.R; y++) for (let x = 0; x <= M.C; x++) {
        const d = deg[y * W1 + x]; if (!d || d === 10 || d === 5) continue;
        const px = ox + x * S, py = oy + y * S, s = wt * 1.45;
        c.fillStyle = '#6E7084'; c.beginPath(); c.roundRect(px - s / 2, py - s / 2, s, s, s * .18); c.fill();
        c.fillStyle = '#8E90A4'; c.beginPath(); c.roundRect(px - s * .4, py - s * .48, s * .8, s * .6, s * .14); c.fill();
        c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(px - s * .34, py - s * .44, s * .68, Math.max(1, s * .1));
      }
    }
    c.restore();
  }
  function rand2(rng, a) { return (rng() * 2 - 1) * a; }
  function shade(hex, k) {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = n >> 8 & 255, b = n & 255;
    if (k > 0) { r += (255 - r) * k; g += (255 - g) * k; b += (255 - b) * k; } else { r *= 1 + k; g *= 1 + k; b *= 1 + k; }
    return `rgb(${r | 0},${g | 0},${b | 0})`;
  }

  /* ---------- الأرضية والخلفية ---------- */
  function drawFloor(c, M, S, ox, oy, T, seed) {
    const rng = mulberry(seed + 5), w = M.C * S, h = M.R * S, wt = clamp(S * .27, 3, 15);
    // الإطار
    const pad = wt * 1.1 + Math.max(4, S * .12);
    c.save();
    c.fillStyle = 'rgba(20,20,40,.25)'; c.beginPath(); c.roundRect(ox - pad + 3, oy - pad + 8, w + pad * 2, h + pad * 2, pad * 1.2); c.fill();
    let g = c.createLinearGradient(0, oy - pad, 0, oy + h + pad); g.addColorStop(0, T.frame[0]); g.addColorStop(1, T.frame[1]);
    c.fillStyle = g; c.beginPath(); c.roundRect(ox - pad, oy - pad, w + pad * 2, h + pad * 2, pad * 1.2); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.3)'; c.lineWidth = 2; c.stroke();
    g = c.createLinearGradient(0, oy, 0, oy + h); g.addColorStop(0, T.floor[0]); g.addColorStop(1, T.floor[1]);
    c.fillStyle = g; c.beginPath(); c.roundRect(ox - wt * .5, oy - wt * .5, w + wt, h + wt, wt * .6); c.fill();
    c.beginPath(); c.rect(ox, oy, w, h); c.clip();
    const k = T.key;
    if (k === 'garden') {
      for (let i = 0; i < M.C * M.R * 3; i++) { c.fillStyle = rng() < .5 ? 'rgba(170,130,70,.18)' : 'rgba(255,255,255,.35)'; c.beginPath(); c.arc(ox + rng() * w, oy + rng() * h, S * (.02 + rng() * .035), 0, TAU); c.fill(); }
      c.strokeStyle = 'rgba(110,170,70,.5)'; c.lineWidth = Math.max(1, S * .03);
      for (let i = 0; i < M.C * M.R * .6; i++) { const x = ox + rng() * w, y = oy + rng() * h, s = S * .1; c.beginPath(); c.moveTo(x - s * .6, y - s); c.lineTo(x, y); c.lineTo(x + s * .6, y - s); c.moveTo(x, y); c.lineTo(x, y - s * 1.2); c.stroke(); }
    } else if (k === 'sea') {
      c.strokeStyle = 'rgba(200,160,90,.28)'; c.lineWidth = Math.max(1, S * .04);
      for (let y = oy + S * .3; y < oy + h; y += S * .55) { c.beginPath(); for (let x = ox; x <= ox + w; x += 6) { const yy = y + Math.sin(x / (S * .5) + y) * S * .08; x === ox ? c.moveTo(x, yy) : c.lineTo(x, yy); } c.stroke(); }
      for (let i = 0; i < M.C * M.R * .5; i++) { const x = ox + rng() * w, y = oy + rng() * h; g = c.createRadialGradient(x, y, 0, x, y, S * .9); g.addColorStop(0, 'rgba(255,255,255,.28)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(x - S, y - S, S * 2, S * 2); }
    } else if (k === 'space') {
      c.strokeStyle = 'rgba(120,100,255,.13)'; c.lineWidth = 1;
      for (let x = 0; x <= M.C; x++) { c.beginPath(); c.moveTo(ox + x * S, oy); c.lineTo(ox + x * S, oy + h); c.stroke(); }
      for (let y = 0; y <= M.R; y++) { c.beginPath(); c.moveTo(ox, oy + y * S); c.lineTo(ox + w, oy + y * S); c.stroke(); }
      for (let i = 0; i < M.C * M.R * 1.5; i++) { c.fillStyle = `rgba(255,255,255,${.2 + rng() * .6})`; c.beginPath(); c.arc(ox + rng() * w, oy + rng() * h, rng() * 1.3 + .3, 0, TAU); c.fill(); }
      for (let i = 0; i < 3; i++) { const x = ox + rng() * w, y = oy + rng() * h, r = Math.max(w, h) * .35; g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, i % 2 ? 'rgba(255,80,200,.14)' : 'rgba(60,200,255,.12)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(ox, oy, w, h); }
    } else if (k === 'candy') {
      c.fillStyle = 'rgba(255,170,210,.22)';
      for (let y = 0; y < M.R * 2; y++) for (let x = 0; x < M.C * 2; x++) if ((x + y) % 2) c.fillRect(ox + x * S / 2, oy + y * S / 2, S / 2, S / 2);
      const sp = ['#FF4F7B', '#2FBF95', '#7C6CFF', '#FFC531', '#3EB7FF'];
      c.lineCap = 'round'; c.lineWidth = Math.max(1.5, S * .045);
      for (let i = 0; i < M.C * M.R * 1.4; i++) { const x = ox + rng() * w, y = oy + rng() * h, a = rng() * TAU, l = S * .07; c.strokeStyle = pick(rng, sp); c.globalAlpha = .55; c.beginPath(); c.moveTo(x - Math.cos(a) * l, y - Math.sin(a) * l); c.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); c.stroke(); }
      c.globalAlpha = 1;
    } else {
      c.strokeStyle = 'rgba(120,105,80,.3)'; c.lineWidth = Math.max(1, S * .03);
      for (let y = 0; y < M.R * 2; y++) {
        const off = (y % 2) * S * .35;
        c.beginPath(); c.moveTo(ox, oy + y * S / 2); c.lineTo(ox + w, oy + y * S / 2); c.stroke();
        for (let x = -1; x < M.C * 1.5 + 1; x++) { const xx = ox + off + x * S * .7; c.beginPath(); c.moveTo(xx, oy + y * S / 2); c.lineTo(xx, oy + (y + 1) * S / 2); c.stroke(); }
      }
      for (let i = 0; i < M.C * M.R; i++) { c.fillStyle = `rgba(${rng() < .5 ? '255,255,255' : '140,120,90'},${.08 + rng() * .1})`; c.fillRect(ox + rng() * w, oy + rng() * h, S * .35, S * .25); }
    }
    c.restore();
  }
  function drawBackground(c, W, H, T, seed) {
    const rng = mulberry(seed + 99);
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, T.bg[0]); g.addColorStop(.55, T.bg[1]); g.addColorStop(1, T.bg[2]);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    const k = T.key;
    if (k === 'garden') {
      c.fillStyle = 'rgba(255,255,255,.85)';
      for (let i = 0; i < 4; i++) { const x = rng() * W, y = rng() * H * .3, s = 18 + rng() * 22; [[0, 0, 1], [s, -s * .3, .8], [s * 1.9, 0, .9], [s * .9, s * .25, .9]].forEach(([a, b, r]) => { c.beginPath(); c.arc(x + a, y + b, s * r, 0, TAU); c.fill(); }); }
      for (let i = 0; i < 30; i++) { const x = rng() * W, y = H * .45 + rng() * H * .55, col = pick(rng, ['#FF8FC0', '#FFFFFF', '#FFE066', '#B79CFF']), r = 3 + rng() * 3; c.fillStyle = col; for (let q = 0; q < 5; q++) { const a = q * TAU / 5; c.beginPath(); c.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, r * .75, 0, TAU); c.fill(); } c.fillStyle = '#FFB020'; c.beginPath(); c.arc(x, y, r * .55, 0, TAU); c.fill(); }
    } else if (k === 'sea') {
      c.save(); c.globalAlpha = .13; c.fillStyle = '#FFFFFF';
      for (let i = 0; i < 5; i++) { const x = rng() * W; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 40 + rng() * 40, 0); c.lineTo(x + 160 + rng() * 80, H); c.lineTo(x + 60, H); c.closePath(); c.fill(); }
      c.restore();
      c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 1.5;
      for (let i = 0; i < 26; i++) { const x = rng() * W, y = rng() * H, r = 2 + rng() * 6; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke(); }
      for (let i = 0; i < 9; i++) {
        const x = rng() * W, hh = 50 + rng() * 90; c.strokeStyle = pick(rng, ['#2FA86A', '#3CC27A', '#1E8C5A']); c.lineWidth = 6; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x, H); for (let q = 1; q <= 8; q++) c.lineTo(x + Math.sin(q * 1.2 + i) * 8, H - hh * q / 8); c.stroke();
      }
    } else if (k === 'space') {
      for (let i = 0; i < 160; i++) { c.fillStyle = `rgba(255,255,255,${.25 + rng() * .7})`; c.beginPath(); c.arc(rng() * W, rng() * H, rng() * 1.6 + .2, 0, TAU); c.fill(); }
      for (let i = 0; i < 3; i++) { const x = rng() * W, y = rng() * H, r = 120 + rng() * 160; g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, pick(rng, ['rgba(255,80,200,.25)', 'rgba(60,200,255,.22)', 'rgba(140,90,255,.25)'])); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H); }
      const px = W * .88, py = H * .14, pr = 26; g = c.createRadialGradient(px - 8, py - 8, 2, px, py, pr); g.addColorStop(0, '#FFC27A'); g.addColorStop(1, '#C2410C'); c.fillStyle = g; c.beginPath(); c.arc(px, py, pr, 0, TAU); c.fill();
    } else if (k === 'candy') {
      for (let i = 0; i < 40; i++) { c.fillStyle = pick(rng, ['rgba(255,255,255,.7)', 'rgba(255,150,200,.35)', 'rgba(150,220,255,.4)']); c.beginPath(); c.arc(rng() * W, rng() * H, 4 + rng() * 10, 0, TAU); c.fill(); }
      for (let i = 0; i < 5; i++) {
        const x = rng() * W, y = H * .2 + rng() * H * .8, r = 14 + rng() * 10;
        c.strokeStyle = '#fff'; c.lineWidth = 4; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + r * 2.4); c.stroke();
        c.fillStyle = pick(rng, ['#FF6FA8', '#7C6CFF', '#2FBF95']); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
        c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 3; c.beginPath(); for (let a = 0; a < 12; a += .2) { const rr = r * a / 12; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.stroke();
      }
    } else {
      c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 2;
      for (let y = 0; y < H; y += 28) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); for (let x = (y / 28 % 2) * 30; x < W; x += 60) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 28); c.stroke(); } }
      for (const [bx, col] of [[W * .06, '#E8475F'], [W * .94, '#4F7BE8']]) {
        if (W < 500) continue;
        c.fillStyle = col; c.beginPath(); c.moveTo(bx - 22, 60); c.lineTo(bx + 22, 60); c.lineTo(bx + 22, 190); c.lineTo(bx, 172); c.lineTo(bx - 22, 190); c.closePath(); c.fill();
        c.fillStyle = '#FFC531'; c.beginPath(); c.arc(bx, 110, 9, 0, TAU); c.fill();
      }
    }
  }

  /* =====================================================================
     الشخصيات والأهداف (مرسومة بالكامل)
     ===================================================================== */
  const ell = (c, x, y, rx, ry, rot) => { c.beginPath(); c.ellipse(x, y, rx, ry, rot || 0, 0, TAU); };
  function eyes(c, r, x, y, sp, blink, size) {
    const s = size || .1;
    for (const q of [-1, 1]) {
      c.save(); c.translate(x + q * sp, y); c.scale(1, blink);
      c.fillStyle = '#2A1F2E'; ell(c, 0, 0, r * s, r * s * 1.2); c.fill();
      c.fillStyle = '#fff'; ell(c, -r * s * .3, -r * s * .45, r * s * .38, r * s * .38); c.fill();
      c.restore();
    }
  }
  function drawBunny(c, r, o) {
    const f = o.face * r * .06, ew = Math.sin(o.t * 3) * .07;
    for (const s of [-1, 1]) {
      c.save(); c.translate(s * r * .26, -r * .55); c.rotate(s * (.2 + ew * s) + (o.moving ? -o.face * .12 : 0));
      c.fillStyle = '#FFFFFF'; c.strokeStyle = '#CDBFD4'; c.lineWidth = r * .06; ell(c, 0, -r * .42, r * .19, r * .48); c.fill(); c.stroke();
      c.fillStyle = '#FFB3CF'; ell(c, 0, -r * .4, r * .09, r * .33); c.fill(); c.restore();
    }
    let g = c.createRadialGradient(-r * .2, r * .2, r * .1, 0, r * .45, r * .6); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#E6DBEC');
    c.fillStyle = g; c.strokeStyle = '#CDBFD4'; c.lineWidth = r * .06;
    ell(c, 0, r * .45, r * .5, r * .42); c.fill(); c.stroke();
    c.fillStyle = '#FFFFFF'; ell(c, -r * .25, r * .82, r * .17, r * .1); c.fill(); c.stroke(); ell(c, r * .25, r * .82, r * .17, r * .1); c.fill(); c.stroke();
    g = c.createRadialGradient(-r * .2, -r * .35, r * .05, 0, -r * .1, r * .6); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#ECE2F0');
    c.fillStyle = g; c.beginPath(); c.arc(0, -r * .1, r * .52, 0, TAU); c.fill(); c.stroke();
    eyes(c, r, f, -r * .16, r * .2, o.blink);
    c.fillStyle = 'rgba(255,130,170,.45)'; ell(c, -r * .32 + f, r * .05, r * .11, r * .07); c.fill(); ell(c, r * .32 + f, r * .05, r * .11, r * .07); c.fill();
    c.fillStyle = '#FF7FA8'; c.beginPath(); c.moveTo(f - r * .07, -r * .02); c.lineTo(f + r * .07, -r * .02); c.lineTo(f, r * .06); c.closePath(); c.fill();
    c.strokeStyle = '#8A5A6A'; c.lineWidth = r * .04; c.lineCap = 'round';
    c.beginPath(); c.moveTo(f, r * .06); c.quadraticCurveTo(f - r * .06, r * .14, f - r * .11, r * .1); c.moveTo(f, r * .06); c.quadraticCurveTo(f + r * .06, r * .14, f + r * .11, r * .1); c.stroke();
  }
  function drawFish(c, r, o) {
    const wag = Math.sin(o.t * (o.moving ? 16 : 6)) * .35;
    c.save(); c.scale(o.face, 1);
    c.save(); c.translate(-r * .5, 0); c.rotate(wag);
    c.fillStyle = '#FF7A1A'; c.strokeStyle = '#3A1E10'; c.lineWidth = r * .06;
    c.beginPath(); c.moveTo(r * .05, 0); c.lineTo(-r * .42, -r * .38); c.quadraticCurveTo(-r * .3, 0, -r * .42, r * .38); c.closePath(); c.fill(); c.stroke();
    c.restore();
    c.fillStyle = '#FF8F2E'; c.beginPath(); c.moveTo(-r * .1, -r * .36); c.quadraticCurveTo(r * .05, -r * .72, r * .3, -r * .34); c.closePath(); c.fill(); c.stroke();
    const g = c.createLinearGradient(0, -r * .45, 0, r * .45); g.addColorStop(0, '#FFA03C'); g.addColorStop(1, '#F2600C');
    c.fillStyle = g; ell(c, 0, 0, r * .62, r * .43); c.fill();
    c.save(); ell(c, 0, 0, r * .62, r * .43); c.clip();
    for (const x of [-.28, .18]) { c.fillStyle = '#FFFFFF'; c.fillRect(x * r, -r * .5, r * .16, r); c.strokeStyle = '#3A1E10'; c.lineWidth = r * .04; c.strokeRect(x * r, -r * .6, r * .16, r * 1.2); }
    c.fillStyle = 'rgba(255,255,255,.3)'; ell(c, r * .05, -r * .22, r * .4, r * .1); c.fill();
    c.restore();
    c.strokeStyle = '#3A1E10'; c.lineWidth = r * .06; ell(c, 0, 0, r * .62, r * .43); c.stroke();
    c.fillStyle = '#FF8F2E'; ell(c, -r * .02, r * .2, r * .14, r * .08, .5 + wag * .5); c.fill(); c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(r * .36, -r * .07, r * .13, 0, TAU); c.fill();
    c.save(); c.translate(r * .39, -r * .07); c.scale(1, o.blink); c.fillStyle = '#1A1020'; c.beginPath(); c.arc(0, 0, r * .075, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(-r * .025, -r * .03, r * .028, 0, TAU); c.fill(); c.restore();
    c.strokeStyle = '#3A1E10'; c.lineWidth = r * .04; c.beginPath(); c.arc(r * .48, r * .1, r * .07, .2, 1.6); c.stroke();
    c.restore();
  }
  function drawRocket(c, r, o) {
    c.save(); c.rotate(o.ang);
    const fl = (o.moving ? 1 : .45) * (1 + Math.sin(o.t * 40) * .15);
    let g = c.createLinearGradient(-r * .5, 0, -r * .5 - r * .7 * fl, 0); g.addColorStop(0, '#FFF7C2'); g.addColorStop(.4, '#FFB13B'); g.addColorStop(1, 'rgba(255,80,40,0)');
    c.fillStyle = g; c.beginPath(); c.moveTo(-r * .45, -r * .17); c.quadraticCurveTo(-r * .5 - r * .75 * fl, 0, -r * .45, r * .17); c.closePath(); c.fill();
    c.fillStyle = '#E8384F'; c.strokeStyle = '#4A1030'; c.lineWidth = r * .05;
    for (const s of [-1, 1]) { c.beginPath(); c.moveTo(-r * .15, s * r * .2); c.lineTo(-r * .52, s * r * .5); c.lineTo(-r * .48, s * r * .14); c.closePath(); c.fill(); c.stroke(); }
    g = c.createLinearGradient(0, -r * .3, 0, r * .3); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.6, '#E2E6F4'); g.addColorStop(1, '#AEB4CC');
    c.fillStyle = g; c.beginPath(); c.moveTo(-r * .48, -r * .24); c.lineTo(r * .2, -r * .26); c.quadraticCurveTo(r * .62, -r * .2, r * .72, 0); c.quadraticCurveTo(r * .62, r * .2, r * .2, r * .26); c.lineTo(-r * .48, r * .24); c.closePath(); c.fill(); c.stroke();
    c.save(); c.clip(); c.fillStyle = '#E8384F'; c.fillRect(r * .42, -r * .4, r * .4, r * .8); c.restore();
    c.beginPath(); c.moveTo(-r * .48, -r * .24); c.lineTo(r * .2, -r * .26); c.quadraticCurveTo(r * .62, -r * .2, r * .72, 0); c.quadraticCurveTo(r * .62, r * .2, r * .2, r * .26); c.lineTo(-r * .48, r * .24); c.closePath(); c.stroke();
    c.fillStyle = '#7FD8FF'; c.strokeStyle = '#4A5070'; c.lineWidth = r * .06; c.beginPath(); c.arc(r * .1, 0, r * .13, 0, TAU); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.arc(r * .06, -r * .04, r * .04, 0, TAU); c.fill();
    c.restore();
  }
  function drawKid(c, r, o) {
    const boy = App.theme === 'boys', f = o.face * r * .05;
    c.fillStyle = boy ? '#4F8DF5' : '#FF6FA8'; c.strokeStyle = '#5A3044'; c.lineWidth = r * .05;
    c.beginPath(); c.moveTo(-r * .38, r * .85); c.quadraticCurveTo(-r * .4, r * .3, 0, r * .28); c.quadraticCurveTo(r * .4, r * .3, r * .38, r * .85); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#FFFFFF'; c.beginPath(); c.arc(0, r * .55, r * .06, 0, TAU); c.fill();
    if (!boy) { // ضفيرتان
      c.fillStyle = '#6B3A1E';
      for (const s of [-1, 1]) { ell(c, s * r * .52, -r * .05, r * .15, r * .24, s * .3); c.fill(); c.stroke(); c.fillStyle = '#FF4F7B'; c.beginPath(); c.arc(s * r * .45, -r * .3, r * .09, 0, TAU); c.fill(); c.fillStyle = '#6B3A1E'; }
    }
    const g = c.createRadialGradient(-r * .15, -r * .3, r * .05, 0, -r * .15, r * .5); g.addColorStop(0, '#FFE3CC'); g.addColorStop(1, '#F6C29C');
    c.fillStyle = g; c.beginPath(); c.arc(0, -r * .15, r * .45, 0, TAU); c.fill(); c.stroke();
    if (boy) {
      c.fillStyle = '#2F6BF0'; c.beginPath(); c.arc(0, -r * .28, r * .44, Math.PI * 1.02, Math.PI * 1.98); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.ellipse(o.face * r * .32, -r * .3, r * .3, r * .08, 0, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#FFC531'; c.beginPath(); c.arc(0, -r * .62, r * .06, 0, TAU); c.fill();
    } else {
      c.fillStyle = '#6B3A1E'; c.beginPath(); c.arc(0, -r * .2, r * .46, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(r * .1, -r * .42, -r * .42, -r * .3); c.closePath(); c.fill();
    }
    eyes(c, r, f, -r * .12, r * .17, o.blink, .085);
    c.fillStyle = 'rgba(255,110,140,.4)'; ell(c, -r * .26 + f, 0, r * .08, r * .05); c.fill(); ell(c, r * .26 + f, 0, r * .08, r * .05); c.fill();
    c.strokeStyle = '#8A3A3A'; c.lineWidth = r * .045; c.lineCap = 'round'; c.beginPath(); c.arc(f, r * .0, r * .12, .3, Math.PI - .3); c.stroke();
  }
  function drawKnight(c, r, o) {
    const f = o.face * r * .05;
    c.fillStyle = '#3F6FD8'; c.strokeStyle = '#2A2E44'; c.lineWidth = r * .05;
    c.beginPath(); c.moveTo(-r * .4, r * .85); c.lineTo(-r * .36, r * .3); c.lineTo(r * .36, r * .3); c.lineTo(r * .4, r * .85); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#FFC531'; c.beginPath(); c.moveTo(0, r * .42); c.lineTo(r * .1, r * .58); c.lineTo(0, r * .74); c.lineTo(-r * .1, r * .58); c.closePath(); c.fill();
    // ريشة
    const sw = Math.sin(o.t * 4) * .15;
    c.save(); c.translate(0, -r * .6); c.rotate(sw - o.face * .2); c.fillStyle = '#E8475F'; ell(c, 0, -r * .2, r * .12, r * .28, 0); c.fill(); c.stroke(); c.restore();
    let g = c.createLinearGradient(-r * .45, 0, r * .45, 0); g.addColorStop(0, '#8C93AA'); g.addColorStop(.35, '#F2F4FA'); g.addColorStop(1, '#7A8098');
    c.fillStyle = g; c.beginPath(); c.moveTo(-r * .42, r * .2); c.lineTo(-r * .42, -r * .2); c.arc(0, -r * .2, r * .42, Math.PI, 0); c.lineTo(r * .42, r * .2); c.quadraticCurveTo(0, r * .34, -r * .42, r * .2); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#2A2E44'; c.beginPath(); c.roundRect(-r * .3 + f, -r * .2, r * .6, r * .14, r * .07); c.fill();
    c.save(); c.translate(f, -r * .13); c.scale(1, o.blink);
    c.fillStyle = '#9EE6FF'; c.beginPath(); c.arc(-r * .14, 0, r * .045, 0, TAU); c.arc(r * .14, 0, r * .045, 0, TAU); c.fill(); c.restore();
    c.strokeStyle = 'rgba(42,46,68,.5)'; c.lineWidth = r * .03; for (const y of [.04, .12]) { c.beginPath(); c.moveTo(-r * .12 + f, y * r); c.lineTo(r * .12 + f, y * r); c.stroke(); }
  }
  const CHARS = { garden: drawBunny, sea: drawFish, space: drawRocket, candy: drawKid, castle: drawKnight };

  function drawCarrot(c, r, t) {
    c.save(); c.rotate(-.5);
    c.fillStyle = '#3BAA3A'; c.strokeStyle = '#1F6A22'; c.lineWidth = r * .05;
    for (const a of [-.5, 0, .5]) { c.save(); c.translate(0, -r * .5); c.rotate(a + Math.sin(t * 3 + a) * .08); ell(c, 0, -r * .22, r * .09, r * .26); c.fill(); c.stroke(); c.restore(); }
    const g = c.createLinearGradient(-r * .25, 0, r * .25, 0); g.addColorStop(0, '#FFA94D'); g.addColorStop(.5, '#FF8A1F'); g.addColorStop(1, '#E06A00');
    c.fillStyle = g; c.strokeStyle = '#B04F00'; c.beginPath(); c.moveTo(-r * .26, -r * .5); c.quadraticCurveTo(0, -r * .62, r * .26, -r * .5); c.quadraticCurveTo(r * .2, r * .2, 0, r * .75); c.quadraticCurveTo(-r * .2, r * .2, -r * .26, -r * .5); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(160,70,0,.6)'; for (const y of [-.25, 0, .25]) { c.beginPath(); c.moveTo(-r * .17, y * r); c.lineTo(-r * .05, y * r + r * .03); c.stroke(); c.beginPath(); c.moveTo(r * .15, y * r + r * .12); c.lineTo(r * .05, y * r + r * .14); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,.45)'; ell(c, -r * .1, -r * .2, r * .04, r * .2); c.fill();
    c.restore();
  }
  function drawShell(c, r) {
    const g = c.createRadialGradient(0, r * .5, r * .1, 0, r * .2, r * .8); g.addColorStop(0, '#FFE5EE'); g.addColorStop(1, '#FF8FB4');
    c.fillStyle = g; c.strokeStyle = '#C24A78'; c.lineWidth = r * .05;
    c.beginPath(); c.moveTo(0, r * .55);
    for (let i = 0; i <= 7; i++) { const a = Math.PI + i * Math.PI / 7, x = Math.cos(a) * r * .7, y = r * .1 + Math.sin(a) * r * .65; c.quadraticCurveTo(Math.cos(a - .2) * r * .78, r * .1 + Math.sin(a - .2) * r * .73, x, y); }
    c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(194,74,120,.55)'; for (let i = 1; i < 7; i++) { const a = Math.PI + i * Math.PI / 7; c.beginPath(); c.moveTo(0, r * .5); c.lineTo(Math.cos(a) * r * .62, r * .1 + Math.sin(a) * r * .58); c.stroke(); }
    c.fillStyle = '#FF8FB4'; c.beginPath(); c.roundRect(-r * .2, r * .45, r * .4, r * .2, r * .06); c.fill(); c.stroke();
    const p = c.createRadialGradient(-r * .05, r * .05, 0, 0, r * .1, r * .16); p.addColorStop(0, '#FFFFFF'); p.addColorStop(1, '#D8D0F0');
    c.fillStyle = p; c.beginPath(); c.arc(0, r * .12, r * .14, 0, TAU); c.fill();
  }
  function drawPlanet(c, r, t) {
    c.save(); c.rotate(-.35);
    c.strokeStyle = '#FFD27A'; c.lineWidth = r * .1; ell(c, 0, 0, r * .85, r * .22); c.stroke();
    const g = c.createRadialGradient(-r * .2, -r * .25, r * .05, 0, 0, r * .55); g.addColorStop(0, '#C9A6FF'); g.addColorStop(.6, '#8A5CF0'); g.addColorStop(1, '#4E2AA8');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, r * .52, 0, TAU); c.fill();
    c.save(); c.beginPath(); c.arc(0, 0, r * .52, 0, TAU); c.clip(); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(-r, -r * .18, r * 2, r * .1); c.fillRect(-r, r * .12, r * 2, r * .08); c.restore();
    c.strokeStyle = '#FFE7A8'; c.lineWidth = r * .1; c.beginPath(); c.ellipse(0, 0, r * .85, r * .22, 0, 0, Math.PI); c.stroke();
    c.restore();
    c.fillStyle = '#fff'; const tw = .5 + .5 * Math.sin(t * 5); c.globalAlpha = tw; star(c, r * .6, -r * .55, r * .12, r * .05); c.fill(); c.globalAlpha = 1;
  }
  function drawCake(c, r, t) {
    c.strokeStyle = '#8A3A5A'; c.lineWidth = r * .05;
    c.fillStyle = '#FFFFFF'; ell(c, 0, r * .62, r * .7, r * .12); c.fill(); c.stroke();
    c.fillStyle = '#F7C08A'; c.beginPath(); c.roundRect(-r * .58, r * .1, r * 1.16, r * .5, r * .08); c.fill(); c.stroke();
    c.fillStyle = '#FF8FC0'; c.beginPath(); c.moveTo(-r * .58, r * .22); for (let i = 0; i <= 6; i++) c.quadraticCurveTo(-r * .58 + (i - .5) * r * 1.16 / 6, r * .4, -r * .58 + i * r * 1.16 / 6, r * .22); c.lineTo(r * .58, r * .1); c.lineTo(-r * .58, r * .1); c.closePath(); c.fill();
    c.fillStyle = '#FFE4F0'; c.beginPath(); c.roundRect(-r * .38, -r * .22, r * .76, r * .34, r * .07); c.fill(); c.stroke();
    c.fillStyle = '#E2306A'; c.beginPath(); c.arc(0, -r * .3, r * .1, 0, TAU); c.fill();
    c.fillStyle = '#7CC8FF'; c.fillRect(r * .18, -r * .58, r * .07, r * .36);
    const fl = 1 + Math.sin(t * 14) * .15; c.fillStyle = '#FFB020'; ell(c, r * .215, -r * .66, r * .06, r * .1 * fl); c.fill(); c.fillStyle = '#FFF2A0'; ell(c, r * .215, -r * .64, r * .03, r * .05 * fl); c.fill();
    const sp = ['#3CC8A0', '#7C6CFF', '#FFC531']; for (let i = 0; i < 6; i++) { c.fillStyle = sp[i % 3]; c.fillRect(-r * .3 + i * r * .11, -r * .12 + (i % 2) * r * .1, r * .06, r * .03); }
  }
  function drawCrown(c, r, t) {
    const g = c.createLinearGradient(0, -r * .5, 0, r * .4); g.addColorStop(0, '#FFE680'); g.addColorStop(.5, '#FFC531'); g.addColorStop(1, '#D98E00');
    c.fillStyle = g; c.strokeStyle = '#8A5A00'; c.lineWidth = r * .05;
    c.beginPath(); c.moveTo(-r * .6, r * .4); c.lineTo(-r * .66, -r * .3); c.lineTo(-r * .3, 0); c.lineTo(0, -r * .5); c.lineTo(r * .3, 0); c.lineTo(r * .66, -r * .3); c.lineTo(r * .6, r * .4); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = '#E8B000'; c.beginPath(); c.roundRect(-r * .62, r * .22, r * 1.24, r * .2, r * .05); c.fill(); c.stroke();
    for (const [x, col] of [[-.35, '#E8475F'], [0, '#4FC3F7'], [.35, '#3CC87A']]) { c.fillStyle = col; c.beginPath(); c.arc(x * r, r * .32, r * .07, 0, TAU); c.fill(); }
    c.fillStyle = '#FFFFFF'; for (const [x, y] of [[-.66, -.3], [0, -.5], [.66, -.3]]) { c.beginPath(); c.arc(x * r, y * r, r * .07, 0, TAU); c.fill(); }
    c.globalAlpha = .5 + .5 * Math.sin(t * 4); c.fillStyle = '#fff'; star(c, -r * .2, -r * .05, r * .1, r * .04); c.fill(); c.globalAlpha = 1;
  }
  const GOALS = { garden: drawCarrot, sea: drawShell, space: drawPlanet, candy: drawCake, castle: drawCrown };
  function star(c, x, y, R, r) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r : R; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } c.closePath(); }
  function drawStarItem(c, r, t) {
    const sx = Math.cos(t * 2.4);
    c.save(); c.scale(Math.abs(sx) * .8 + .2, 1);
    const g = c.createRadialGradient(-r * .15, -r * .2, r * .05, 0, 0, r); g.addColorStop(0, '#FFF6B0'); g.addColorStop(.5, '#FFD23F'); g.addColorStop(1, '#F2A100');
    c.fillStyle = g; c.strokeStyle = '#C47A00'; c.lineWidth = r * .1; c.lineJoin = 'round';
    star(c, 0, 0, r, r * .45); c.fill(); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.7)'; ell(c, -r * .2, -r * .25, r * .12, r * .2, -.5); c.fill();
    c.restore();
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #maze{background:#CFEFC0;overflow:hidden;--a:#3E9B3A;--d:#2A6B24;--l:#EAF8DD}
  #maze canvas.mc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #maze .bar{gap:6px;padding-left:10px;padding-right:10px}
  #maze .ib{color:var(--d)}
  #maze .chip{color:var(--d);min-width:54px;padding:3px 9px}
  #maze .chip b{color:var(--a);font-size:18px}
  #maze .ctl{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:center;align-items:center;gap:14px;z-index:5;padding:6px 10px max(10px,env(safe-area-inset-bottom));direction:ltr;pointer-events:none}
  #maze .ctl>*{pointer-events:auto}
  #maze .pad{display:grid;grid-template-columns:repeat(3,50px);grid-template-rows:repeat(2,46px);gap:5px}
  #maze .pad .u{grid-column:2;grid-row:1}
  #maze .pad .l{grid-column:1;grid-row:2}
  #maze .pad .dn{grid-column:2;grid-row:2}
  #maze .pad .r{grid-column:3;grid-row:2}
  #maze .ab{width:50px;height:46px;border-radius:16px;background:linear-gradient(#FFFFFF,var(--l));color:var(--a);font-size:22px;font-weight:900;display:grid;place-items:center;
    box-shadow:0 4px 0 var(--d),0 7px 12px rgba(0,0,0,.18);line-height:1}
  #maze .ab:active,#maze .ab.on{transform:translateY(3px);box-shadow:0 1px 0 var(--d)}
  #maze .cb{position:relative;width:58px;height:58px;border-radius:20px;background:linear-gradient(#FFFFFF,var(--l));color:var(--d);display:flex;flex-direction:column;align-items:center;justify-content:center;
    box-shadow:0 4px 0 var(--d),0 7px 12px rgba(0,0,0,.18);font-weight:800;line-height:1;gap:3px}
  #maze .cb i{font-style:normal;font-size:23px;line-height:1}
  #maze .cb small{font-size:11px;font-weight:800;opacity:.85}
  #maze .cb:active{transform:translateY(3px);box-shadow:0 1px 0 var(--d)}
  #maze .cb[disabled]{opacity:.45}
  #maze .cb .cnt{position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;border-radius:10px;background:#FF5F8F;color:#fff;font-size:12px;font-weight:900;display:grid;place-items:center;padding:0 4px;box-shadow:0 0 0 2px #fff}
  #maze .panel{border-color:var(--l);box-shadow:0 8px 0 var(--d),0 20px 40px rgba(0,0,0,.3);color:var(--d)}
  #maze .panel h3{color:var(--a)}
  #maze .btn{background:linear-gradient(#FFFFFF33,#00000010),var(--a);box-shadow:0 4px 0 var(--d)}
  #maze .btn.alt{background:#fff;color:var(--d);box-shadow:0 4px 0 var(--l);border-color:var(--l)}
  #maze .overlay{background:rgba(20,30,50,.4)}
  #maze .lvp{width:min(94vw,460px);max-height:88vh;overflow-y:auto;touch-action:pan-y}
  #maze .wh{display:flex;align-items:center;gap:8px;margin:14px 2px 2px;font-weight:800;font-size:15px;color:var(--d)}
  #maze .wh::after{content:'';flex:1;height:2px;background:repeating-linear-gradient(90deg,var(--l) 0 6px,transparent 6px 10px)}
  #maze .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:16px 10px;margin:8px 2px 6px}
  #maze .lvb{position:relative;aspect-ratio:1;border-radius:22px;color:#fff;font-weight:900;display:flex;align-items:center;justify-content:center;font-size:21px;
    background:linear-gradient(160deg,rgba(255,255,255,.35),rgba(255,255,255,0) 50%),var(--c);box-shadow:inset 0 -5px 0 rgba(0,0,0,.15),0 4px 0 var(--k),0 6px 10px rgba(0,0,0,.15);text-shadow:0 2px 0 rgba(0,0,0,.25)}
  #maze .lvb em{position:absolute;top:2px;left:5px;font-size:13px;font-style:normal;text-shadow:none}
  #maze .lvb:active{transform:translateY(3px)}
  #maze .lvb .s{position:absolute;bottom:-11px;font-size:12px;letter-spacing:-2px;line-height:1;text-shadow:none}
  #maze .lvb .s i{font-style:normal}
  #maze .lvb .s i.off{filter:grayscale(1);opacity:.35}
  #maze .lvb.cur{outline:3px dashed var(--a);outline-offset:4px}
  #maze .lvb.lock{--c:#D5DBE2 !important;--k:#B2BCC7 !important;color:#8795A3;text-shadow:none}
  #maze .lvb.lock::after{content:'🔒';position:absolute;top:-7px;right:-5px;font-size:15px}
  #maze .intro{position:absolute;left:0;right:0;top:38%;display:flex;justify-content:center;pointer-events:none;z-index:6;opacity:0}
  #maze .intro.on{animation:mzIntro 2.3s ease forwards}
  #maze .intro div{background:linear-gradient(#fff,var(--l));border:4px solid #fff;border-radius:26px;padding:10px 24px;text-align:center;box-shadow:0 8px 0 var(--d),0 14px 30px rgba(0,0,0,.25);color:var(--d);max-width:88vw}
  #maze .intro b{display:block;font-size:26px;color:var(--a);line-height:1.25}
  #maze .intro span{font-size:16px;font-weight:700}
  @keyframes mzIntro{0%{opacity:0;transform:scale(.5)}12%{opacity:1;transform:scale(1.06)}18%{transform:scale(1)}80%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-30px)}}
  #maze .tip{position:absolute;left:0;right:0;display:flex;justify-content:center;pointer-events:none;z-index:6;opacity:0;transition:opacity .35s}
  #maze .tip.on{opacity:1}
  #maze .tip span{background:rgba(255,255,255,.95);color:var(--d);font-weight:800;font-size:15px;border-radius:99px;padding:6px 16px;box-shadow:0 4px 12px rgba(0,0,0,.2);border:2px solid var(--l);max-width:90vw;text-align:center}
  #maze .wInfo{display:flex;justify-content:center;gap:10px;margin:4px 0 6px;flex-wrap:wrap}
  #maze .wInfo span{background:var(--l);border-radius:14px;padding:4px 12px;font-weight:800;font-size:16px}
  #maze .wInfo span.ok{box-shadow:inset 0 0 0 2px var(--a)}
  @media (min-aspect-ratio:5/4) and (min-width:700px){#maze .ctl{left:auto;right:max(16px,env(safe-area-inset-right));top:50%;bottom:auto;transform:translateY(-50%);flex-direction:column;padding:0;gap:18px}}
  @media (max-height:600px){#maze .pad{grid-template-columns:repeat(3,44px);grid-template-rows:repeat(2,40px)}#maze .ab{width:44px;height:40px;font-size:19px}#maze .cb{width:50px;height:50px}}
  `);
  const root = App.section(ID, `
    <canvas class="mc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🗺️</button>
      <span class="grow"></span>
      <div class="chip"><small data-ar="المستوى" data-en="Level">المستوى</small><b class="cLv">1</b></div>
      <div class="chip"><small data-ar="⏱ الوقت" data-en="⏱ Time">⏱ الوقت</small><b class="cTm">0:00</b></div>
      <div class="chip"><small data-ar="النجوم" data-en="Stars">النجوم</small><b class="cSt">0/3</b></div>
    </div>
    <div class="ctl">
      <button class="cb" data-c="hint" aria-label="تلميح"><i>💡</i><small data-ar="تلميح" data-en="Hint">تلميح</small><span class="cnt">2</span></button>
      <div class="pad">
        <button class="ab u" data-d="0" aria-label="أعلى">▲</button>
        <button class="ab l" data-d="3" aria-label="يسار">◀</button>
        <button class="ab dn" data-d="2" aria-label="أسفل">▼</button>
        <button class="ab r" data-d="1" aria-label="يمين">▶</button>
      </div>
      <button class="cb" data-c="restart" aria-label="إعادة"><i>🔄</i><small data-ar="إعادة" data-en="Restart">إعادة</small></button>
    </div>
    <div class="intro"><div><b class="iT"></b><span class="iG"></span></div></div>
    <div class="tip"><span></span></div>
    <div class="overlay" id="mzLv"><div class="panel lvp"><h3 data-ar="🧭 مستويات المتاهة" data-en="🧭 Maze levels">🧭 مستويات المتاهة</h3><div class="lvw"></div>
      <button class="btn alt" data-a="close" data-ar="✕ إغلاق" data-en="✕ Close">✕ إغلاق</button></div></div>
    <div class="overlay" id="mzWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><div class="wInfo"></div><p class="wP"></p>
      <button class="btn" data-a="next" data-ar="التالي ▶️" data-en="Next ▶️">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels" data-ar="🗺️ المستويات" data-en="🗺️ Levels">🗺️ المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.mc'), bar = root.querySelector('.bar'), ctlEl = root.querySelector('.ctl');
  const lvOv = root.querySelector('#mzLv'), winOv = root.querySelector('#mzWin');
  const introEl = root.querySelector('.intro'), tipEl = root.querySelector('.tip');
  const hintBtn = ctlEl.querySelector('[data-c="hint"]');
  const isEn = () => App.gameLang(ID) === 'en';
  function relabel() {
    root.querySelectorAll('[data-ar]').forEach(el => { el.textContent = App.t(el.dataset.ar, el.dataset.en); });
    [['.home', 'الرئيسية', 'Home'], ['.helpbtn', 'مساعدة', 'Help'], ['.lvbtn', 'المستويات', 'Levels'], ['[data-c="hint"]', 'تلميح', 'Hint'], ['[data-c="restart"]', 'إعادة', 'Restart'],
      ['.ab.u', 'أعلى', 'Up'], ['.ab.l', 'يسار', 'Left'], ['.ab.dn', 'أسفل', 'Down'], ['.ab.r', 'يمين', 'Right']].forEach(([q, a, e]) => root.querySelectorAll(q).forEach(b => b.setAttribute('aria-label', App.t(a, e))));
  }
  function paintIntro() {
    if (isEn()) {
      root.querySelector('.iT').textContent = `${TH.em} Level ${lvl}`;
      root.querySelector('.iG').textContent = `Take ${TH.chEn} to ${TH.goalEn} ${TH.gem}`;
    } else {
      root.querySelector('.iT').textContent = `${TH.em} المستوى ${lvl}`;
      root.querySelector('.iG').textContent = `${App.g('أوصلي', 'أوصل')} ${chName()} إلى ${TH.goal} ${TH.gem}`;
    }
  }
  let winInfo = null;
  function fillWin() {
    if (!winInfo) return;
    const { s, allSt, el } = winInfo;
    const titles = [App.g('أحسنتِ!', 'أحسنت!'), App.g('أحسنتِ!', 'أحسنت!'), App.g('رائعة!', 'رائع!'), App.g('بطلة المتاهات!', 'بطل المتاهات!')];
    const titlesEn = ['Well done!', 'Well done!', 'Great!', 'Maze champion!'];
    root.querySelector('.wT').textContent = `${TH.gem} ${App.t(titles[s], titlesEn[s])}`;
    root.querySelector('.wP').textContent = s === 3 ? App.t(App.g('جمعتِ كل النجوم وكنتِ سريعة! 🏆', 'جمعت كل النجوم وكنت سريعًا! 🏆'), 'You got all the stars and you were fast! 🏆')
      : !allSt ? App.t(App.g(`اجمعي كل النجوم المخبأة في الطرق المسدودة ⭐`, `اجمع كل النجوم المخبأة في الطرق المسدودة ⭐`), 'Collect all the stars hidden in the dead ends ⭐')
        : App.t(App.g(`حاولي الوصول خلال ${fmtT(M.par)} لنجمة السرعة ⏱`, `حاول الوصول خلال ${fmtT(M.par)} لنجمة السرعة ⏱`), `Try to get there within ${fmtT(M.par)} for the speed star ⏱`);
  }

  /* ---------- الحالة ---------- */
  let ctx = null, W = 0, H = 0, dpr = 1, floorL = null, wallL = null;
  let raf = 0, last = 0, T = 0, running = false, paused = false, speed = 1;
  let lvl = 1, land = false, M = null, TH = THEMES[0], S = 20, ox = 0, oy = 0;
  let pos = 0, queue = [], vis = { x: 0, y: 0 }, mv = null, trail = [], face = 1, ang = 0, hop = 0, squash = 0, shakeC = 0;
  let got = [], hintsLeft = 2, hint = null, elapsed = 0, started = false, won = false, winT = 0, blinkT = 2, blink = 1;
  let parts = [], timers = [], shakeS = 0, tipT = 0, goalPop = 0, stepSnd = 0;

  const later = (t, fn) => timers.push({ t, fn });
  const anyOv = () => lvOv.classList.contains('on') || winOv.classList.contains('on');
  const cx = k => ox + (k % M.C + .5) * S, cy = k => oy + ((k / M.C | 0) + .5) * S;
  const loadProg = () => { const p = store.get('mazeProg', null) || {}; return { unlocked: Math.max(1, p.unlocked || 1), stars: p.stars || {}, best: p.best || {} }; };

  /* ---------- التخطيط ---------- */
  function area() {
    const rr = root.getBoundingClientRect();
    const top = bar.getBoundingClientRect().bottom - rr.top + 10;
    const cr = ctlEl.getBoundingClientRect();
    if (cr.height > cr.width) return { top, aw: Math.min(W - 2 * (cr.width + 30), 1100), ah: Math.max(120, H - top - 14) };
    const bot = rr.bottom - cr.top + 12;
    return { top, aw: Math.min(W - 30, 1100), ah: Math.max(120, H - top - bot) };
  }
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const a = area();
    S = Math.max(8, Math.floor(Math.min((a.aw - 16) / M.C, (a.ah - 16) / M.R, 74)));
    ox = Math.round((W - M.C * S) / 2); oy = Math.round(a.top + (a.ah - M.R * S) / 2);
    floorL = mkLayer(); const fc = floorL.getContext('2d'); fc.scale(dpr, dpr);
    drawBackground(fc, W, H, TH, lvl); drawFloor(fc, M, S, ox, oy, TH, lvl);
    // علامة البداية
    const sx = cx(M.start), sy = cy(M.start);
    fc.fillStyle = 'rgba(255,255,255,.45)'; fc.beginPath(); fc.arc(sx, sy, S * .38, 0, TAU); fc.fill();
    fc.strokeStyle = 'rgba(255,255,255,.8)'; fc.setLineDash([S * .1, S * .08]); fc.lineWidth = Math.max(1.5, S * .05); fc.stroke(); fc.setLineDash([]);
    wallL = mkLayer(); const wc = wallL.getContext('2d'); wc.scale(dpr, dpr);
    drawWalls(wc, M, S, ox, oy, TH.wall, lvl * 31 + 7);
    introEl.style.top = (oy + M.R * S / 2 - 50) + 'px';
    tipEl.style.top = Math.max(a.top - 4, oy - S * .3 - 34) + 'px';
    if (!mv) { vis.x = cx(pos); vis.y = cy(pos); }
    else { const k = (S / mv.S); vis.x = ox + (vis.x - mv.ox) * k; vis.y = oy + (vis.y - mv.oy) * k; mv.S = S; mv.ox = ox; mv.oy = oy; }
  }
  function mkLayer() { const l = document.createElement('canvas'); l.width = Math.round(W * dpr); l.height = Math.round(H * dpr); return l; }

  /* ---------- بدء مستوى ---------- */
  function startLevel(n) {
    lvl = clamp(n, 1, NLV); TH = themeOf(lvl);
    const f = fitCanvas(cv); W = f.w; H = f.h;
    const a = area(); land = a.aw / a.ah > 1.15;
    M = genLevel(lvl, land);
    root.style.setProperty('--a', TH.ui[0]); root.style.setProperty('--d', TH.ui[1]); root.style.setProperty('--l', TH.ui[2]);
    root.style.background = TH.bg[1];
    pos = M.start; queue = []; mv = null; trail = [M.start]; face = -1; ang = Math.PI; hop = 0; squash = 0; shakeC = 0;
    got = []; hintsLeft = M.hints; hint = null; elapsed = 0; started = false; won = false; winT = 0; goalPop = 0;
    parts = []; timers = [];
    winOv.classList.remove('on'); lvOv.classList.remove('on'); tip('', 0);
    layout(); paintUI();
    paintIntro();
    introEl.classList.remove('on'); void introEl.offsetWidth; introEl.classList.add('on');
    Sound.whoosh();
  }
  const chName = () => TH.key === 'candy' ? App.g('الطفلة', 'الطفل') : TH.ch;
  function paintUI() {
    root.querySelector('.cLv').textContent = lvl;
    root.querySelector('.cTm').textContent = fmtT(elapsed);
    root.querySelector('.cSt').textContent = `${got.length}/${M.stars.length}`;
    hintBtn.querySelector('.cnt').textContent = hintsLeft;
    hintBtn.disabled = !hintsLeft;
  }
  function tip(text, dur) {
    if (!text) { tipEl.classList.remove('on'); tipT = 0; return; }
    tipEl.querySelector('span').textContent = text; tipEl.classList.add('on'); tipT = dur || 3;
  }

  /* ---------- الحركة ---------- */
  const logical = () => queue.length ? queue[queue.length - 1] : (mv ? mv.to : pos);
  function enqueue(cells) {
    if (!cells || !cells.length || won) return;
    for (const k of cells) queue.push(k);
    if (!started) { started = true; }
  }
  function truncate() { queue = []; }
  function canGo(k, di) { return !!(M.g[k] & DIRS[di][2]); }
  function step(k, di) { return k + DIRS[di][0] + DIRS[di][1] * M.C; }
  function runDir(di) {
    if (won || anyOv() || paused) return;
    truncate(); hint = null;
    let k = logical();
    if (!canGo(k, di)) { bump(di); return; }
    const out = []; let d = di;
    for (let i = 0; i < 400; i++) {
      k = step(k, d); out.push(k);
      if (k === M.goal || (M.stars.includes(k) && !got.includes(k))) break;
      const b = M.g[k]; if (openCnt(b) !== 2) break;
      const back = (d + 2) % 4; let nd = -1;
      for (let q = 0; q < 4; q++) if (q !== back && (b & DIRS[q][2])) nd = q;
      d = nd;
    }
    enqueue(out);
  }
  function bump(di) {
    shakeC = 1; ctlDir(di);
    Sound.tone(170, .09, 'sine', .14, -50); vibrate(15);
    const k = logical(), x = cx(k) + DIRS[di][0] * S * .45, y = cy(k) + DIRS[di][1] * S * .45;
    for (let i = 0; i < 5; i++) parts.push({ k: 'dust', x, y, vx: rand(-40, 40) - DIRS[di][0] * 30, vy: rand(-40, 40) - DIRS[di][1] * 30, life: 0, max: .35, sz: S * rand(.06, .11), c: TH.puff[i % TH.puff.length] });
  }
  function ctlDir(di) { const b = ctlEl.querySelector(`[data-d="${di}"]`); if (b) { b.classList.add('on'); setTimeout(() => b.classList.remove('on'), 110); } }
  function beginMove() {
    const to = queue.shift();
    const back = trail.length >= 2 && trail[trail.length - 2] === to;
    if (back) trail.pop();
    const dx = (to % M.C) - (pos % M.C), dy = (to / M.C | 0) - (pos / M.C | 0);
    if (dx) face = dx > 0 ? 1 : -1;
    ang = Math.atan2(dy, dx);
    mv = { from: pos, to, back, S, ox, oy };
  }
  function arrive(k, back) {
    pos = k;
    if (!back) trail.push(k);
    stepSnd++;
    const qn = queue.length;
    if (qn < 3 || stepSnd % 2 === 0) Sound.tone(back ? 420 : 520 + (stepSnd % 4) * 40, .05, 'sine', .05, 60);
    const px = cx(k), py = cy(k);
    for (let i = 0; i < 2; i++) parts.push(puff(px, py + S * .25));
    const si = M.stars.indexOf(k);
    if (si >= 0 && !got.includes(k)) collect(k);
    if (k === M.goal) winSeq();
  }
  function puff(x, y) {
    if (TH.key === 'sea') return { k: 'bub', x: x + rand(-S * .2, S * .2), y: y - S * .2, vx: rand(-8, 8), vy: rand(-50, -25), life: 0, max: rand(.6, 1), sz: S * rand(.05, .09), c: '#fff' };
    if (TH.key === 'space') { const a = ang + Math.PI + rand(-.4, .4); return { k: 'dust', x: vis.x - Math.cos(ang) * S * .3, y: vis.y - Math.sin(ang) * S * .3, vx: Math.cos(a) * 70, vy: Math.sin(a) * 70, life: 0, max: .35, sz: S * rand(.05, .09), c: pick(Math.random, TH.puff) }; }
    return { k: 'dust', x: x + rand(-S * .15, S * .15), y, vx: rand(-30, 30), vy: rand(-30, -8), life: 0, max: rand(.3, .5), sz: S * rand(.05, .09), c: pick(Math.random, TH.puff) };
  }
  function collect(k) {
    got.push(k); paintUI();
    Sound.star(); vibrate(20);
    const x = cx(k), y = cy(k);
    for (let i = 0; i < 18; i++) { const a = rand(0, TAU), sp = rand(60, 200); parts.push({ k: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rand(.5, .9), sz: S * rand(.12, .2), c: i % 3 ? '#FFD23F' : '#FFFFFF', rot: rand(0, TAU) }); }
    parts.push({ k: 'ring', x, y, life: 0, max: .5, sz: S * .9, c: '#FFD23F' });
    const fx = cx(k), fy = cy(k);
    parts.push({ k: 'fly', x: fx, y: fy, life: 0, max: .8, sz: S * .3, c: '#FFD23F' });
    if (got.length === M.stars.length) tip(App.t(App.g('جمعتِ كل النجوم! ⭐', 'جمعت كل النجوم! ⭐'), 'You got all the stars! ⭐'), 2);
  }
  function bfsPath(from, to, maxD) {
    if (from === to) return [];
    const b = bfs(M, [from], maxD); return pathTo(b, from, to);
  }

  /* ---------- الفوز ---------- */
  function rating() {
    let s = 1;
    if (got.length === M.stars.length) s++;
    if (elapsed <= M.par) s++;
    return s;
  }
  function winSeq() {
    if (won) return;
    won = true; queue = []; hint = null; winT = 0; goalPop = 1; shakeS = .25;
    const pr = loadProg(), s = rating(), prev = pr.stars[lvl] || 0;
    if (s > prev) pr.stars[lvl] = s;
    if (!pr.best[lvl] || elapsed < pr.best[lvl]) pr.best[lvl] = Math.round(elapsed * 10) / 10;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(NLV, lvl + 1);
    store.set('mazeProg', pr);
    const solvedN = Object.keys(pr.stars).filter(k => pr.stars[k] > 0).length;
    Sound.win(); vibrate(40);
    if (isEn()) App.speak('Well done!', 'en'); else App.speak(App.g('أحسنتِ!', 'أحسنت!'));
    const gx = cx(M.goal), gy = cy(M.goal);
    for (let i = 0; i < 30; i++) { const a = rand(0, TAU), sp = rand(80, 260); parts.push({ k: 'spark', x: gx, y: gy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0, max: rand(.6, 1.1), sz: S * rand(.15, .25), c: pick(Math.random, TH.conf), rot: rand(0, TAU) }); }
    later(.35, () => { for (let i = 0; i < 150; i++) parts.push({ k: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(90, 260), rot: rand(0, TAU), vr: rand(-8, 8), life: 0, max: 4, sz: rand(6, 11), c: TH.conf[i % TH.conf.length] }); });
    later(.6, () => {
      App.achieve('maze_first');
      if (solvedN >= 10) App.achieve('maze_10');
      if (lvl === NLV) App.achieve('maze_big');
    });
    later(1.7, () => {
      if (App.current !== ID) return;
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(q => `<span class="${q <= s ? '' : 'off'}">⭐</span>`).join('');
      const allSt = got.length === M.stars.length, fast = elapsed <= M.par;
      root.querySelector('.wInfo').innerHTML = `<span class="${fast ? 'ok' : ''}">⏱ ${fmtT(elapsed)}</span><span class="${allSt ? 'ok' : ''}">⭐ ${got.length}/${M.stars.length}</span>`;
      winInfo = { s, allSt }; fillWin();
      root.querySelector('[data-a="next"]').style.display = lvl < NLV ? '' : 'none';
      winOv.classList.add('on');
      if (s > prev) later(.5, () => App.addStars(s - prev));
      if (lvl === NLV) App.toast(App.t(App.g('أنهيتِ كل المتاهات! 🏆', 'أنهيت كل المتاهات! 🏆'), 'You finished all the mazes! 🏆'));
    });
  }

  /* ---------- الأزرار ---------- */
  function doHint() {
    if (won || anyOv() || paused) return;
    if (hintsLeft <= 0) { Sound.error(); tip(App.t(App.g('انتهت التلميحات في هذا المستوى، أنتِ تستطيعين! 💪', 'انتهت التلميحات في هذا المستوى، أنت تستطيع! 💪'), 'No more hints in this level, you can do it! 💪'), 2.5); return; }
    hintsLeft--; paintUI();
    const from = mv ? mv.to : pos, p = bfsPath(from, M.goal);
    hint = { path: [from].concat(p || []), t: 0 };
    Sound.tone(880, .1, 'sine', .1, 0); Sound.tone(1175, .14, 'sine', .08, 0, .08); Sound.tone(1568, .18, 'sine', .07, 0, .16);
  }
  function restart() {
    if (anyOv() && !winOv.classList.contains('on')) return;
    Sound.tap(); startLevel(lvl);
  }
  ctlEl.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => {
    if (App.current !== ID || paused) return;
    b.dataset.c === 'hint' ? doHint() : restart();
  }));
  ctlEl.querySelectorAll('[data-d]').forEach(b => b.addEventListener('pointerdown', e => {
    e.preventDefault(); if (App.current !== ID || paused) return; runDir(+b.dataset.d);
  }));

  /* ---------- المستويات ---------- */
  function openLevels() {
    const pr = loadProg(), w = root.querySelector('.lvw');
    let html = '';
    for (let z = 0; z < NLV / 8; z++) {
      const Tz = THEMES[z % THEMES.length];
      html += `<div class="wh">${Tz.em} ${isEn() ? Tz.nameEn : Tz.name}</div><div class="lvg">`;
      for (let i = 0; i < 8; i++) {
        const n = z * 8 + i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
        html += `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" style="--c:${Tz.ui[0]};--k:${Tz.ui[1]}" data-l="${n}" aria-label="${App.t('المستوى', 'Level')} ${n}">
          ${lock ? '' : `<em>${Tz.gem}</em>`}${n}<span class="s">${lock ? '' : [1, 2, 3].map(q => `<i class="${q <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
      }
      html += '</div>';
    }
    w.innerHTML = html;
    w.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
    const cur = w.querySelector('.cur'); if (cur) setTimeout(() => cur.scrollIntoView({ block: 'center' }), 30);
  }
  function act(a) {
    Sound.tap();
    if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
    else if (a === 'close') { lvOv.classList.remove('on'); if (won) winOv.classList.add('on'); }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });

  /* ---------- الإدخال: السحب على الممرات، السحب السريع، المفاتيح ---------- */
  let ptr = null, tipShown = false;
  const toCell = (x, y) => { const gx = Math.floor((x - ox) / S), gy = Math.floor((y - oy) / S); return inside(M, gx, gy) ? gy * M.C + gx : -1; };
  function dragTo(x, y) {
    const gx = clamp(Math.floor((x - ox) / S), 0, M.C - 1), gy = clamp(Math.floor((y - oy) / S), 0, M.R - 1), k = gy * M.C + gx;
    const from = logical(); if (k === from) return;
    const man = Math.abs(gx - from % M.C) + Math.abs(gy - (from / M.C | 0));
    if (man > 6) return;
    const p = bfsPath(from, k, Math.min(10, man + 4));
    if (p) { hint = null; enqueue(p); }
  }
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused || won || anyOv() || !M) return;
    const rc = cv.getBoundingClientRect(), x = e.clientX - rc.left, y = e.clientY - rc.top;
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    const lk = logical(), near = Math.hypot(x - cx(lk), y - cy(lk)) < S * 1.3 || Math.hypot(x - vis.x, y - vis.y) < S * 1.3;
    if (near) { ptr = { id: e.pointerId, mode: 'drag' }; truncate(); dragTo(x, y); }
    else ptr = { id: e.pointerId, mode: 'swipe', ax: x, ay: y, x0: x, y0: y, moved: false };
  });
  cv.addEventListener('pointermove', e => {
    if (!ptr || e.pointerId !== ptr.id || paused || won) return;
    const rc = cv.getBoundingClientRect(), x = e.clientX - rc.left, y = e.clientY - rc.top;
    if (ptr.mode === 'drag') { dragTo(x, y); return; }
    const dx = x - ptr.ax, dy = y - ptr.ay, th = Math.max(22, S * .6);
    if (Math.hypot(dx, dy) > th) {
      const di = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0);
      if (di !== ptr.di || Math.hypot(x - ptr.x0, y - ptr.y0) > th * 3) { runDir(di); ptr.di = di; ptr.x0 = x; ptr.y0 = y; }
      ptr.ax = x; ptr.ay = y; ptr.moved = true;
    }
  });
  const endPtr = e => {
    if (!ptr || e.pointerId !== ptr.id) return;
    if (ptr.mode === 'swipe' && !ptr.moved && !won && !anyOv()) {
      const rc = cv.getBoundingClientRect(), k = toCell(e.clientX - rc.left, e.clientY - rc.top);
      const p = k >= 0 ? bfsPath(logical(), k, 3) : null;
      if (p && p.length) { truncate(); enqueue(p); }
      else if (!tipShown && k >= 0) { tipShown = true; tip(App.t(App.g('اسحبي الشخصية بإصبعك في الممرات 👆', 'اسحب الشخصية بإصبعك في الممرات 👆'), 'Drag the character along the paths with your finger 👆'), 2.5); }
    }
    ptr = null;
  };
  cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', endPtr);
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < NLV ? 'next' : 'levels'); return; }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? act('close') : openLevels(); return; }
    if (anyOv() || paused) return;
    const map = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3, w: 0, d: 1, s: 2, a: 3, W: 0, D: 1, S: 2, A: 3 };
    if (e.key in map) { e.preventDefault(); if (!e.repeat || !queue.length) { runDir(map[e.key]); ctlDir(map[e.key]); } }
    else if (e.key === 'h' || e.key === 'H') doHint();
    else if (e.key === 'r' || e.key === 'R') restart();
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    for (let i = timers.length - 1; i >= 0; i--) { const t = timers[i]; t.t -= dt; if (t.t <= 0) { timers.splice(i, 1); t.fn(); } }
    if (tipT > 0) { tipT -= dt; if (tipT <= 0) tip('', 0); }
    if (hint) { hint.t += dt; if (hint.t > 2) hint = null; }
    if (started && !won) {
      const before = Math.floor(elapsed); elapsed += dt;
      if (Math.floor(elapsed) !== before) root.querySelector('.cTm').textContent = fmtT(elapsed);
    }
    if (won) winT += dt;
    // حركة الشخصية
    if (!mv && queue.length && !won) beginMove();
    if (mv) {
      const tx = cx(mv.to), ty = cy(mv.to), spd = S * Math.min(26, 8.5 + queue.length * 1.8);
      const dx = tx - vis.x, dy = ty - vis.y, d = Math.hypot(dx, dy), s = spd * dt;
      hop += s / S * Math.PI;
      if (d <= s) { vis.x = tx; vis.y = ty; const m = mv; mv = null; arrive(m.to, m.back); if (!won && queue.length) beginMove(); }
      else { vis.x += dx / d * s; vis.y += dy / d * s; }
    } else hop = 0;
    if (shakeC > 0) shakeC = Math.max(0, shakeC - dt * 4);
    if (goalPop > 0) goalPop = Math.max(0, goalPop - dt * 1.5);
    if (shakeS > 0) shakeS = Math.max(0, shakeS - dt);
    blinkT -= dt; if (blinkT <= 0) { blinkT = rand(2, 4.5); blink = 0; }
    blink = Math.min(1, blink + dt * 7);
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.life += dt;
      if (q.life > q.max) { parts.splice(i, 1); continue; }
      if (q.k === 'conf') { q.vy = Math.min(q.vy + 120 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; q.rot += q.vr * dt; }
      else if (q.k === 'bub') { q.vx += Math.sin(T * 6 + i) * 30 * dt; }
      else if (q.k === 'spark') { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 120 * dt; q.rot += dt * 4; }
      else if (q.k === 'dust') { q.vx *= 1 - dt * 4; q.vy *= 1 - dt * 4; }
      if (q.vx != null) { q.x += q.vx * dt; q.y += q.vy * dt; }
    }
  }

  /* ---------- الرسم ---------- */
  function trailPath(c) {
    c.beginPath();
    trail.forEach((k, i) => { const x = cx(k), y = cy(k); i ? c.lineTo(x, y) : c.moveTo(x, y); });
    c.lineTo(vis.x, vis.y);
  }
  function render() {
    if (!ctx || !M) return;
    const c = ctx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (shakeS > 0) c.translate(Math.sin(T * 60) * shakeS * 10, Math.cos(T * 50) * shakeS * 6);
    c.drawImage(floorL, 0, 0, W, H);
    // المسار الملوّن
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    trailPath(c);
    c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = S * .38; c.save(); c.translate(0, S * .05); c.stroke(); c.restore();
    c.strokeStyle = TH.trail; c.lineWidth = S * .32; c.stroke();
    c.strokeStyle = TH.trail2; c.lineWidth = S * .1; c.globalAlpha = .8; c.setLineDash([S * .18, S * .22]); c.lineDashOffset = -T * S * .8; c.stroke();
    c.restore();
    // التلميح
    if (hint && hint.path.length > 1) {
      const t = hint.t, a = t < .2 ? t / .2 : t > 1.6 ? Math.max(0, (2 - t) / .4) : 1;
      c.save(); c.globalAlpha = a; c.lineCap = 'round'; c.lineJoin = 'round';
      c.beginPath(); hint.path.forEach((k, i) => { const x = cx(k), y = cy(k); i ? c.lineTo(x, y) : c.moveTo(vis.x, vis.y); });
      c.shadowColor = '#FFF59A'; c.shadowBlur = S * .6; c.strokeStyle = 'rgba(255,240,120,.55)'; c.lineWidth = S * .42; c.stroke(); c.shadowBlur = 0;
      c.strokeStyle = '#FFFFFF'; c.lineWidth = S * .14; c.setLineDash([S * .05, S * .3]); c.lineDashOffset = -t * S * 4; c.stroke();
      c.restore();
    }
    // النجوم
    M.stars.forEach((k, i) => {
      if (got.includes(k)) return;
      const x = cx(k), y = cy(k) + Math.sin(T * 3 + i) * S * .06, r = S * .3;
      const g = c.createRadialGradient(x, y, 0, x, y, S * .55); g.addColorStop(0, 'rgba(255,230,120,.55)'); g.addColorStop(1, 'rgba(255,230,120,0)');
      c.fillStyle = g; c.fillRect(x - S * .6, y - S * .6, S * 1.2, S * 1.2);
      c.save(); c.translate(x, y); drawStarItem(c, r, T + i); c.restore();
    });
    // الهدف
    {
      const x = cx(M.goal), y = cy(M.goal), r = S * .42;
      const pul = .5 + .5 * Math.sin(T * 4);
      const g = c.createRadialGradient(x, y, 0, x, y, S * .75); g.addColorStop(0, `rgba(255,255,200,${.5 + pul * .3})`); g.addColorStop(1, 'rgba(255,255,200,0)');
      c.fillStyle = g; c.fillRect(x - S, y - S, S * 2, S * 2);
      c.save(); c.translate(x, y + Math.sin(T * 2.5) * S * .04);
      const sc = 1 + (goalPop > 0 ? Math.sin(goalPop * Math.PI * 3) * goalPop * .35 : Math.sin(T * 4) * .04);
      c.scale(sc, sc);
      if (!won || winT < .4) GOALS[TH.key](c, r, T);
      c.restore();
      if (!won) { c.save(); c.strokeStyle = `rgba(255,255,255,${.4 + pul * .4})`; c.lineWidth = Math.max(1.5, S * .05); c.setLineDash([S * .12, S * .1]); c.lineDashOffset = T * 8; c.beginPath(); c.arc(x, y, S * .44, 0, TAU); c.stroke(); c.restore(); }
    }
    c.drawImage(wallL, 0, 0, W, H);
    // الشخصية
    drawChar(c);
    // الجسيمات
    for (const q of parts) {
      const a = 1 - q.life / q.max;
      c.save(); c.translate(q.x, q.y);
      if (q.k === 'conf') { c.globalAlpha = Math.min(1, a * 3); c.rotate(q.rot); c.fillStyle = q.c; c.fillRect(-q.sz / 2, -q.sz / 4, q.sz, q.sz / 2); }
      else if (q.k === 'dust') { c.globalAlpha = a * .8; c.fillStyle = q.c; c.beginPath(); c.arc(0, 0, q.sz * (1.5 - a * .5), 0, TAU); c.fill(); }
      else if (q.k === 'bub') { c.globalAlpha = a; c.strokeStyle = '#fff'; c.lineWidth = 1.2; c.beginPath(); c.arc(0, 0, q.sz, 0, TAU); c.stroke(); c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(-q.sz * .3, -q.sz * .3, q.sz * .3, 0, TAU); c.fill(); }
      else if (q.k === 'ring') { c.globalAlpha = a; c.strokeStyle = q.c; c.lineWidth = 3 * a + 1; c.beginPath(); c.arc(0, 0, q.sz * (1 - a * .6), 0, TAU); c.stroke(); }
      else if (q.k === 'fly') { const k = ease(q.life / q.max); c.translate(0, -k * S * 1.4); c.globalAlpha = a; c.font = `900 ${Math.max(12, S * .45)}px system-ui,sans-serif`; c.textAlign = 'center'; c.fillStyle = '#FFB300'; c.strokeStyle = '#fff'; c.lineWidth = 3; c.strokeText('+⭐', 0, 0); c.fillText('+⭐', 0, 0); }
      else { c.globalAlpha = a; c.rotate(q.rot); c.fillStyle = q.c; star(c, 0, 0, q.sz, q.sz * .45); c.fill(); }
      c.restore();
    }
  }
  function drawChar(c) {
    const r = S * .44, moving = !!mv;
    let x = vis.x, y = vis.y;
    if (shakeC > 0) x += Math.sin(shakeC * 30) * shakeC * S * .08;
    let jy = 0, sx = 1, sy = 1;
    const front = TH.key !== 'sea' && TH.key !== 'space';
    if (won) { const k = Math.min(1, winT / .5); jy = -Math.abs(Math.sin(winT * 7)) * S * .35 * (winT < 2.5 ? 1 : 0); sx = 1 + Math.sin(winT * 14) * .06 * k; sy = 2 - sx; }
    else if (moving && front) { jy = -Math.abs(Math.sin(hop)) * S * .14; const q = Math.cos(hop * 2) * .07; sx = 1 + q; sy = 1 - q; }
    else { const b = Math.sin(T * 3) * .03; sx = 1 - b; sy = 1 + b; }
    // ظل
    c.fillStyle = TH.key === 'space' ? 'rgba(0,0,0,.35)' : 'rgba(30,30,50,.22)';
    c.beginPath(); c.ellipse(x, y + r * .78, r * (.55 + jy / S * .5), r * .16, 0, 0, TAU); c.fill();
    c.save(); c.translate(x, y + jy + r * .1); c.scale(sx, sy); c.translate(0, -r * .1);
    if (TH.key === 'sea') c.translate(0, Math.sin(T * 3) * S * .04);
    const o = { t: T, face, moving: moving || won, blink, ang: TH.key === 'space' ? smoothAng() : 0 };
    CHARS[TH.key](c, r, o);
    c.restore();
  }
  let curAng = Math.PI;
  function smoothAng() {
    let d = ang - curAng; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU;
    curAng += d * .25; return curAng;
  }
  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
    if (paused || document.hidden) return;
    if (speed < 1) update(dt * speed); else for (let i = 0; i < speed; i++) update(dt);
    render();
  }
  function startLoop() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stopLoop() { running = false; cancelAnimationFrame(raf); }
  let resizeT = 0;
  window.addEventListener('resize', () => {
    if (App.current !== ID || !M) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); render(); }, 60);
  });

  /* ---------- أيقونة القائمة: متاهة شجيرات صغيرة مع أرنب وجزرة ---------- */
  function icon(c, s) {
    IK.bg(c, s, ['#E8FFD6', '#8ED86A', '#3E9E3A'], { seed: 19 });
    const Mi = { C: 4, R: 4, n: 1, g: new Uint8Array([2 | 4, 8 | 2, 8 | 2, 8 | 4, 1 | 4, 2 | 4, 8, 1 | 4, 1 | 4, 1 | 2, 8 | 4, 1 | 4, 1 | 2, 8 | 2, 1 | 8 | 2, 1 | 8]) };
    const S0 = s * .17, o0 = (s - S0 * 4) / 2;
    IK.sticker(c, s, c => {
      const wg = c.createLinearGradient(0, o0, 0, o0 + S0 * 4); wg.addColorStop(0, '#A86E3C'); wg.addColorStop(1, '#7A4F2A'); c.fillStyle = wg; c.beginPath(); c.roundRect(o0 - S0 * .3, o0 - S0 * .3, S0 * 4.6, S0 * 4.6, S0 * .5); c.fill();
      c.fillStyle = '#F6E9C6'; c.fillRect(o0, o0, S0 * 4, S0 * 4);
      c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.strokeStyle = '#FF8A2A'; c.lineWidth = S0 * .3; c.setLineDash([S0 * .02, S0 * .45]);
      c.beginPath(); [[3, 0], [3, 1], [3, 2], [2, 2]].forEach(([x, y], i) => { const px = o0 + (x + .5) * S0, py = o0 + (y + .5) * S0; i ? c.lineTo(px, py) : c.moveTo(px, py); }); c.stroke(); c.restore();
      drawWalls(c, Mi, S0, o0, o0, 'hedge', 12);
      c.save(); c.translate(o0 + .5 * S0, o0 + 3.5 * S0); drawCarrot(c, S0 * .55, 0); c.restore();
      c.save(); c.translate(o0 + 2.5 * S0, o0 + 2.45 * S0); drawBunny(c, S0 * .6, { t: 0, face: -1, moving: false, blink: 1 }); c.restore();
    });
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'المتاهة', icon2: '🧭', isNew: false, music: 'maze',
    titleEn: 'The Maze',
    desc: () => App.g('أوصلي الأرنب إلى الجزرة عبر متاهات تكبر وتكبر', 'أوصل الأرنب إلى الجزرة عبر متاهات تكبر وتكبر'),
    descEn: () => 'Take the rabbit to the carrot through bigger and bigger mazes',
    helpEn: () => [
      '👆 Drag the character with your finger along the paths, and it leaves a colorful line behind',
      '↔️ Swipe quickly anywhere or use the arrows ⬅️⬆️ to run the character to the next turn',
      '⭐ Stars are hidden in the dead ends, collect them all!',
      '🏆 One star for arriving, one for collecting all the stars, and one for speed',
      '💡 A hint shows the way for two seconds (only a few in each level), and every 8 levels is a new world 🌍'
    ],
    help: () => [
      '👆 ' + App.g('اسحبي', 'اسحب') + ' الشخصية بإصبعك داخل الممرات، فتترك خلفها خطًا ملوّنًا',
      '↔️ ' + App.g('اسحبي', 'اسحب') + ' سريعًا في أي مكان أو ' + App.g('استعملي', 'استعمل') + ' الأسهم ⬅️⬆️ لتجري الشخصية حتى أول مفترق',
      '⭐ في الطرق المسدودة نجوم مخبأة، ' + App.g('اجمعيها', 'اجمعها') + ' كلها!',
      '🏆 نجمة للوصول، ونجمة لجمع كل النجوم، ونجمة للسرعة',
      '💡 التلميح يُظهر الطريق لثانيتين (عدد محدود في كل مستوى)، وكل 8 مستويات عالم جديد 🌍'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 ${App.t('المتاهة', 'Maze')} ${Math.max(...ks)} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false; relabel();
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, NLV));
      render(); startLoop();
    },
    onLang() {
      relabel(); paintIntro(); fillWin();
      if (lvOv.classList.contains('on')) openLevels();
      tip('', 0); tipEl.querySelector('span').textContent = '';
    },
    leave() {
      stopLoop(); timers = []; queue = []; ptr = null; hint = null;
      winOv.classList.remove('on'); lvOv.classList.remove('on'); introEl.classList.remove('on'); tip('', 0);
    },
    pause() { paused = true; ptr = null; },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() { return { lvl, land, C: M.C, R: M.R, pos, start: M.start, goal: M.goal, stars: M.stars.slice(), got: got.slice(), won, elapsed, par: M.par, hintsLeft, trail: trail.length, queue: queue.length + (mv ? 1 : 0), S, ox, oy, sol: M.sol.slice() }; },
    _start(n) { startLevel(n); },
    _speed(n) { speed = n; },
    _gen(n, l) { return genLevel(n, l); },
    _run(d) { runDir(d); },
    _xy(k) { return { x: cx(k), y: cy(k) }; }
  });
})();
