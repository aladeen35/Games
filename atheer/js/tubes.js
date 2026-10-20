/* =====================================================================
   أنابيب الألوان — لعبة فرز السوائل الملوّنة بين الأنابيب الزجاجية
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'tubes', TAU = Math.PI * 2, CAP = 4, NLV = 60;
  const FONT = "'Baloo Bhaijaan 2',system-ui,sans-serif";

  /* ---------- الألوان: [أساسي، فاتح، غامق] ---------- */
  const COLS = [
    ['#F2384C', '#FF9AA4', '#B0142A'], // أحمر
    ['#FFCE1F', '#FFF29A', '#D99300'], // أصفر
    ['#2F6BF0', '#8DB6FF', '#173CA8'], // أزرق
    ['#34C35A', '#9CF2B0', '#1A8034'], // أخضر
    ['#9A4DEB', '#D3A8FF', '#6421AD'], // بنفسجي
    ['#FF861C', '#FFC587', '#CC5600'], // برتقالي
    ['#FF5CB6', '#FFB8DF', '#CC2984'], // وردي
    ['#37CCEE', '#AEF2FF', '#0B8DB0'], // سماوي
    ['#93572C', '#D29B68', '#5A3113'], // بني
    ['#A9B2C3', '#EEF2F8', '#6A7488']  // فضي
  ];

  /* ---------- أدوات ---------- */
  const ease = k => 1 - Math.pow(1 - k, 3);
  const easeIO = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
  const backOut = k => { const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
  const lerp = (a, b, k) => a + (b - a) * k;
  function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  /* =====================================================================
     المنطق والحلّال (A* موزون مع حد للعُقد)
     ===================================================================== */
  const clone = st => st.map(t => t.slice());
  const keyOf = st => st.map(t => t.join('')).sort().join('|');
  const topRun = a => { if (!a.length) return 0; const c = a[a.length - 1]; let k = 1; while (k < a.length && a[a.length - 1 - k] === c) k++; return k; };
  const isDone = a => a.length === CAP && topRun(a) === CAP;
  const solved = st => st.every(a => !a.length || isDone(a));
  function segs(t) { let s = 0; for (let i = 0; i < t.length; i++) if (!i || t[i] !== t[i - 1]) s++; return s; }
  function hOf(st, nc) { let s = 0; for (const t of st) s += segs(t); return s - nc; }
  /** كمية الصبّ الممكنة من a إلى b (0 = غير مسموح) */
  function pourAmt(st, i, j) {
    if (i === j) return 0;
    const a = st[i], b = st[j];
    if (!a || !b || !a.length || b.length >= CAP) return 0;
    if (b.length && b[b.length - 1] !== a[a.length - 1]) return 0;
    return Math.min(topRun(a), CAP - b.length);
  }
  /** الحركات المفيدة فقط (للحلّال والتلميح) */
  function movesOf(st) {
    const res = [];
    for (let i = 0; i < st.length; i++) {
      const a = st[i]; if (!a.length) continue;
      const c = a[a.length - 1], k = topRun(a);
      if (k === CAP) continue;
      const uni = k === a.length; let fe = -1;
      for (let j = 0; j < st.length; j++) {
        if (j === i) continue; const b = st[j]; if (b.length >= CAP) continue;
        if (!b.length) { if (!uni && fe < 0) fe = j; continue; }
        if (b[b.length - 1] !== c) continue;
        res.push([i, j, Math.min(k, CAP - b.length)]);
      }
      if (fe >= 0) res.push([i, fe, k]);
    }
    return res;
  }
  function applyMv(st, m) { const n = clone(st); for (let q = 0; q < m[2]; q++) n[m[1]].push(n[m[0]].pop()); return n; }
  function solve(start, limit, w) {
    const nc = new Set(start.flat()).size;
    const h0 = hOf(start, nc); if (!h0) return [];
    const nodes = [{ st: start, g: 0, p: -1, m: null }], seen = new Map([[keyOf(start), 0]]);
    const heap = [[w * h0, 0]];
    const lt = (a, b) => a[0] < b[0] || (a[0] === b[0] && a[1] > b[1]);
    const push = e => { heap.push(e); let i = heap.length - 1; while (i) { const p = (i - 1) >> 1; if (!lt(e, heap[p])) break; heap[i] = heap[p]; i = p; } heap[i] = e; };
    const pop = () => {
      const top = heap[0], e = heap.pop();
      if (heap.length) {
        let i = 0; const n = heap.length;
        for (;;) { const l = 2 * i + 1, r = l + 1; let m = i, best = e; if (l < n && lt(heap[l], best)) { m = l; best = heap[l]; } if (r < n && lt(heap[r], best)) { m = r; best = heap[r]; } if (m === i) break; heap[i] = heap[m]; i = m; }
        heap[i] = e;
      }
      return top;
    };
    while (heap.length) {
      const ni = pop()[1], nd = nodes[ni];
      if (nodes.length > limit) return null;
      for (const m of movesOf(nd.st)) {
        const ns = applyMv(nd.st, m), k = keyOf(ns), g = nd.g + 1;
        if (seen.has(k) && seen.get(k) <= g) continue;
        seen.set(k, g);
        const h = hOf(ns, nc);
        nodes.push({ st: ns, g, p: ni, m });
        if (!h) { const path = []; let i = nodes.length - 1; while (nodes[i].p >= 0) { path.push(nodes[i].m); i = nodes[i].p; } return path.reverse(); }
        push([g + w * h, nodes.length - 1]);
      }
    }
    return null;
  }

  /* ---------- المستويات: مولّدة ببذرة ثابتة ومُتحقَّق من قابليتها للحل ---------- */
  function lvCfg(n) {
    const colors = Math.min(10, 3 + Math.floor((n - 1) * 8 / NLV));
    const empty = n >= 18 && n % 3 === 0 && colors <= 8 ? 1 : 2;
    return { colors, empty };
  }
  const lvCache = {};
  function genLevel(n) {
    if (lvCache[n]) return lvCache[n];
    const { colors, empty: e0 } = lvCfg(n), rng = mulberry(n * 7919 + 101);
    const make = () => {
      const pool = []; for (let c = 0; c < colors; c++) for (let k = 0; k < CAP; k++) pool.push(c);
      for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
      const st = []; for (let i = 0; i < colors; i++) st.push(pool.slice(i * CAP, i * CAP + CAP));
      return st;
    };
    for (const empty of e0 === 1 ? [1, 2] : [2]) {
      for (let att = 0; att < (empty === 1 ? 30 : 80); att++) {
        const st = make();
        if (st.some(t => topRun(t) >= 3)) continue; // لا أنابيب شبه جاهزة
        for (let e = 0; e < empty; e++) st.push([]);
        let sol = solve(st, 40000, 1.2) || solve(st, 40000, 1.8);
        if (!sol) continue;
        if (sol.length < colors + 2) continue; // سهل أكثر من اللازم
        return (lvCache[n] = { tubes: st, par: sol.length, colors, empty });
      }
    }
    const st = make(); st.push([], []);
    const sol = solve(st, 80000, 2);
    return (lvCache[n] = { tubes: st, par: sol ? sol.length : colors * 3, colors, empty: 2 });
  }
  const star3 = L => L.par + 2;
  function starsFor(L, mv, extra) {
    let s = mv <= star3(L) ? 3 : mv <= Math.round(L.par * 1.35) + 4 ? 2 : 1;
    if (extra) s = Math.min(s, 2);
    return s;
  }
  const loadProg = () => { const p = store.get('tubesProg', null) || {}; return { unlocked: Math.max(1, p.unlocked || 1), stars: p.stars || {}, best: p.best || {} }; };

  /* =====================================================================
     هندسة الأنبوب ورسمه
     ===================================================================== */
  const geoCache = {};
  function geo(tw) {
    const key = Math.round(tw * 10); if (geoCache[key]) return geoCache[key];
    const wall = tw * .085, a = tw / 2 - wall, lh = tw * .8, Lb = 4 * lh + tw * .5, y0 = tw * .05;
    const R = tw / 2, cy = Lb - a;
    const pts = [[-a, y0], [-a, cy]];
    for (let i = 1; i < 16; i++) { const t = Math.PI - Math.PI * i / 16; pts.push([Math.cos(t) * a, cy + Math.sin(t) * a]); }
    pts.push([a, cy], [a, y0]);
    const inner = new Path2D(); inner.moveTo(-a, y0); inner.lineTo(-a, cy); inner.arc(0, cy, a, Math.PI, 0, true); inner.lineTo(a, y0); inner.closePath();
    const outer = new Path2D(); outer.moveTo(-R, 0); outer.lineTo(-R, cy); outer.arc(0, cy, R, Math.PI, 0, true); outer.lineTo(R, 0); outer.closePath();
    return (geoCache[key] = { tw, wall, a, lh, Lb, y0, R, cy, pts, inner, outer, bottom: cy + R, grads: {} });
  }
  function clipArea(pts, nx, ny, d) {
    const out = [], n = pts.length;
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[(i + 1) % n], vp = p[0] * nx + p[1] * ny - d, vq = q[0] * nx + q[1] * ny - d;
      if (vp >= 0) out.push(p);
      if ((vp >= 0) !== (vq >= 0)) { const t = vp / (vp - vq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
    }
    let A = 0; for (let i = 0; i < out.length; i++) { const p = out[i], q = out[(i + 1) % out.length]; A += p[0] * q[1] - q[0] * p[1]; }
    return Math.abs(A) / 2;
  }
  /** المسافة d (على الاتجاه العمودي في العالم) لسطح سائل بارتفاع H طبقة، مع ميل th */
  function levelD(G, H, th) {
    const du = G.Lb - H * G.lh;
    if (Math.abs(th) < 1e-3) return du;
    const target = clipArea(G.pts, 0, 1, du), nx = Math.sin(th), ny = Math.cos(th);
    let lo = Infinity, hi = -Infinity;
    for (const p of G.pts) { const v = p[0] * nx + p[1] * ny; lo = Math.min(lo, v); hi = Math.max(hi, v); }
    for (let i = 0; i < 20; i++) { const m = (lo + hi) / 2; if (clipArea(G.pts, nx, ny, m) > target) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  function liqGrad(c, G, ci) {
    const k = ci + ':' + (c === ctx ? 'm' : 'o');
    if (c === ctx && G.grads[k]) return G.grads[k];
    const [m, l, d] = COLS[ci], a = G.a;
    const g = c.createLinearGradient(-a, 0, a, 0);
    g.addColorStop(0, d); g.addColorStop(.22, m); g.addColorStop(.42, l); g.addColorStop(.55, m); g.addColorStop(.86, m); g.addColorStop(1, d);
    if (c === ctx) G.grads[k] = g;
    return g;
  }
  function symbol(c, k, s) {
    c.beginPath();
    switch (k) {
      case 0: c.arc(0, 0, s * .5, 0, TAU); break;
      case 1: c.moveTo(0, -s * .55); c.lineTo(s * .55, s * .42); c.lineTo(-s * .55, s * .42); c.closePath(); break;
      case 2: c.rect(-s * .42, -s * .42, s * .84, s * .84); break;
      case 3: c.moveTo(0, -s * .6); c.lineTo(s * .45, 0); c.lineTo(0, s * .6); c.lineTo(-s * .45, 0); c.closePath(); break;
      case 4: for (let i = 0; i < 10; i++) { const r = i % 2 ? s * .25 : s * .6, t = -Math.PI / 2 + i * Math.PI / 5; c.lineTo(Math.cos(t) * r, Math.sin(t) * r); } c.closePath(); break;
      case 5: c.moveTo(0, s * .5); c.bezierCurveTo(-s * .8, -s * .05, -s * .35, -s * .7, 0, -s * .25); c.bezierCurveTo(s * .35, -s * .7, s * .8, -s * .05, 0, s * .5); break;
      case 6: c.rect(-s * .15, -s * .55, s * .3, s * 1.1); c.rect(-s * .55, -s * .15, s * 1.1, s * .3); break;
      case 7: c.arc(0, 0, s * .52, 0, TAU); c.arc(0, 0, s * .26, 0, TAU, true); break;
      case 8: c.moveTo(0, -s * .62); c.bezierCurveTo(s * .2, -s * .3, s * .48, -s * .05, s * .48, s * .2); c.arc(0, s * .2, s * .48, 0, Math.PI); c.bezierCurveTo(-s * .48, -s * .05, -s * .2, -s * .3, 0, -s * .62); break;
      default: for (let i = 0; i < 6; i++) { const t = i * Math.PI / 3; c.lineTo(Math.cos(t) * s * .52, Math.sin(t) * s * .52); } c.closePath();
    }
    c.fill('evenodd'); c.stroke();
  }
  /** منطقة تحت خط أفقي في العالم، بإحداثيات الأنبوب المحلية */
  function belowPath(c, G, d, th, wave, phase) {
    const nx = Math.sin(th), ny = Math.cos(th), tx = ny, ty = -nx, S = G.tw * 5, B = G.tw * 9;
    const px = nx * d, py = ny * d;
    c.beginPath();
    const N = wave ? 40 : 1;
    for (let i = 0; i <= N; i++) {
      const s = -S + 2 * S * i / N, o = wave ? wave * Math.sin(s / G.tw * 5.2 + phase) : 0;
      const x = px + tx * s + nx * o, y = py + ty * s + ny * o;
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.lineTo(px + tx * S + nx * B, py + ty * S + ny * B); c.lineTo(px - tx * S + nx * B, py - ty * S + ny * B); c.closePath();
  }
  function lineAt(c, G, d, th, wave, phase) {
    const nx = Math.sin(th), ny = Math.cos(th), tx = ny, ty = -nx, S = G.tw * 5, px = nx * d, py = ny * d;
    c.beginPath();
    for (let i = 0; i <= 40; i++) {
      const s = -S + 2 * S * i / 40, o = wave ? wave * Math.sin(s / G.tw * 5.2 + phase) : 0;
      const x = px + tx * s + nx * o, y = py + ty * s + ny * o; i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
  }
  /**
   * يرسم أنبوبًا. o: {x,y: موضع فوهة الأنبوب, th: الميل, layers:[{c,h}], wave, phase, glow, cork(0..1|null), sym, bubbles, scale}
   */
  function drawTube(c, G, o) {
    const tw = G.tw, a = G.a;
    c.save(); c.translate(o.x, o.y); c.rotate(o.th || 0);
    if (o.scale && o.scale !== 1) c.scale(o.scale, o.scale);
    // توهج الاختيار/التلميح
    if (o.glow) {
      c.save(); c.globalAlpha = o.glow.a; c.strokeStyle = o.glow.c; c.lineWidth = tw * .26; c.lineJoin = 'round';
      c.shadowColor = o.glow.c; c.shadowBlur = tw * .5; c.stroke(G.outer); c.restore();
    }
    // الزجاج الخلفي
    let g = c.createLinearGradient(-G.R, 0, G.R, 0);
    g.addColorStop(0, 'rgba(200,225,245,.55)'); g.addColorStop(.5, 'rgba(255,255,255,.28)'); g.addColorStop(1, 'rgba(190,215,240,.5)');
    c.fillStyle = g; c.fill(G.outer);
    // السائل
    const th = o.th || 0, L = o.layers;
    if (L && L.length) {
      c.save(); c.clip(G.inner);
      let tot = 0; const cum = L.map(l => (tot += l.h));
      for (let i = L.length - 1; i >= 0; i--) {
        if (L[i].h <= .001) continue;
        const d = levelD(G, cum[i], th), top = i === L.length - 1;
        belowPath(c, G, d, th, top ? o.wave || 0 : 0, o.phase || 0);
        c.fillStyle = liqGrad(c, G, L[i].c); c.fill();
        if (top) { // لمعة السطح
          c.save(); c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = tw * .06; lineAt(c, G, d + tw * .035, th, o.wave || 0, o.phase || 0); c.stroke();
          c.globalAlpha = .35; c.strokeStyle = COLS[L[i].c][1]; c.lineWidth = tw * .12; lineAt(c, G, d + tw * .12, th, o.wave || 0, o.phase || 0); c.stroke(); c.restore();
        } else {
          c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = tw * .035; lineAt(c, G, d + tw * .02, th, 0, 0); c.stroke();
        }
      }
      // فقاعات
      if (o.bubbles && Math.abs(th) < .2) {
        for (const b of o.bubbles) {
          if (b.h > tot - .08) continue;
          const y = G.Lb - b.h * G.lh, x = b.x * a * (1 - Math.max(0, (y - G.cy) / a) * .5);
          c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.arc(x, y, b.r, 0, TAU); c.fill();
          c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.arc(x - b.r * .35, y - b.r * .35, b.r * .35, 0, TAU); c.fill();
        }
      }
      // رموز لعمى الألوان
      if (o.sym && Math.abs(th) < .05) {
        let h0 = 0;
        c.fillStyle = 'rgba(255,255,255,.92)'; c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = tw * .03;
        for (const l of L) {
          if (l.h > .55) { c.save(); c.translate(0, G.Lb - (h0 + l.h / 2) * G.lh + (h0 === 0 ? -tw * .06 : 0)); symbol(c, l.c, tw * .34); c.restore(); }
          h0 += l.h;
        }
      }
      c.restore();
    }
    // انعكاسات الزجاج الأمامية
    g = c.createLinearGradient(0, G.y0, 0, G.cy);
    g.addColorStop(0, 'rgba(255,255,255,.85)'); g.addColorStop(.6, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,.08)');
    c.fillStyle = g; c.beginPath(); c.roundRect(-a * .78, tw * .28, tw * .13, G.cy - tw * .3, tw * .07); c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.roundRect(a * .55, tw * .4, tw * .06, G.cy * .55, tw * .03); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = tw * .05; c.lineCap = 'round';
    c.beginPath(); c.arc(0, G.cy, a * .72, Math.PI * .62, Math.PI * .86); c.stroke();
    // الحواف
    c.lineWidth = tw * .07; c.strokeStyle = 'rgba(255,255,255,.9)'; c.stroke(G.outer);
    c.lineWidth = tw * .028; c.strokeStyle = 'rgba(70,95,140,.45)'; c.stroke(G.outer);
    // الحافة العلوية
    g = c.createLinearGradient(0, -tw * .1, 0, tw * .12); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#C9DDF2');
    c.fillStyle = g; c.beginPath(); c.roundRect(-tw * .6, -tw * .09, tw * 1.2, tw * .19, tw * .095); c.fill();
    c.lineWidth = tw * .025; c.strokeStyle = 'rgba(70,95,140,.45)'; c.stroke();
    // السدادة الفلّينية
    if (o.cork != null) {
      const k = o.cork, yo = k < 1 ? -tw * 1.6 * (1 - ease(Math.min(1, k * 1.25))) + (k > .8 ? Math.sin((k - .8) * 5 * Math.PI) * tw * .06 : 0) : 0;
      const sq = k > .8 && k < 1 ? 1 + Math.sin((k - .8) * 5 * Math.PI) * .12 : 1;
      c.save(); c.translate(0, yo - tw * .02); c.scale(sq, 1 / sq);
      c.beginPath(); c.moveTo(-tw * .34, -tw * .36); c.lineTo(tw * .34, -tw * .36); c.lineTo(tw * .27, tw * .2); c.lineTo(-tw * .27, tw * .2); c.closePath();
      g = c.createLinearGradient(-tw * .34, 0, tw * .34, 0); g.addColorStop(0, '#A86A35'); g.addColorStop(.35, '#E6B07A'); g.addColorStop(1, '#94592B');
      c.fillStyle = g; c.fill(); c.lineWidth = tw * .03; c.strokeStyle = '#7A4520'; c.stroke();
      c.fillStyle = '#F2C795'; c.beginPath(); c.ellipse(0, -tw * .36, tw * .34, tw * .09, 0, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = 'rgba(110,60,25,.5)';
      [[-.15, -.1], [.1, .02], [-.05, .1], [.18, -.2], [-.2, .08]].forEach(([x, y]) => { c.beginPath(); c.arc(x * tw, y * tw, tw * .025, 0, TAU); c.fill(); });
      c.restore();
    }
    c.restore();
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #tubes{background:#E9F6F4;overflow:hidden}
  #tubes canvas.tc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #tubes .bar{gap:6px;padding-left:10px;padding-right:10px}
  #tubes .ib{color:#2B7A8C}
  #tubes .chip{color:#2F5E6E;min-width:56px;padding:3px 9px}
  #tubes .chip b{color:#1F8FA6;font-size:18px}
  #tubes .ctl{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:center;gap:10px;z-index:5;padding:8px 10px max(12px,env(safe-area-inset-bottom))}
  #tubes .cb{position:relative;width:60px;height:60px;border-radius:20px;background:linear-gradient(#FFFFFF,#EAF4FB);color:#2F5E6E;display:flex;flex-direction:column;align-items:center;justify-content:center;
    box-shadow:0 4px 0 #B7D3E3,0 8px 14px rgba(40,90,120,.15);font-weight:800;line-height:1;gap:3px}
  #tubes .cb i{font-style:normal;font-size:24px;line-height:1}
  #tubes .cb small{font-size:11px;font-weight:800;opacity:.8}
  #tubes .cb:active{transform:translateY(3px);box-shadow:0 1px 0 #B7D3E3}
  #tubes .cb[disabled]{opacity:.4}
  #tubes .cb.on{background:linear-gradient(#DDF7EE,#B9EBDB);box-shadow:0 4px 0 #7FCBB2}
  #tubes .cb.pulse{animation:tbPulse .55s ease-in-out 4}
  @keyframes tbPulse{50%{transform:scale(1.14);box-shadow:0 4px 0 #F2B53C,0 0 0 6px rgba(255,200,60,.45)}}
  #tubes .cb .cnt{position:absolute;top:-6px;left:-6px;min-width:20px;height:20px;border-radius:10px;background:#FF7AA8;color:#fff;font-size:12px;font-weight:900;display:grid;place-items:center;padding:0 4px;box-shadow:0 0 0 2px #fff}
  #tubes .panel{border-color:#CDEFE6;box-shadow:0 8px 0 #9ED8C8,0 20px 40px rgba(30,80,90,.3);color:#2F5E6E}
  #tubes .panel h3{color:#1F8FA6}
  #tubes .btn{background:linear-gradient(#5FD3C0,#2FB5A8);box-shadow:0 4px 0 #1E8A80}
  #tubes .btn.alt{background:#fff;color:#2B8A99;box-shadow:0 4px 0 #A9DCD2;border-color:#D4F0EA}
  #tubes .overlay{background:rgba(30,70,90,.35)}
  #tubes .lvp{width:min(94vw,440px);max-height:88vh;overflow-y:auto;touch-action:pan-y;background:linear-gradient(#F7FFFD,#EEF2FF)}
  #tubes .lvg{display:grid;grid-template-columns:repeat(5,1fr);gap:16px 8px;margin:12px 2px 16px}
  #tubes .lvb{position:relative;aspect-ratio:1;border-radius:50% 50% 46% 46%;color:#fff;font-weight:900;display:flex;align-items:center;justify-content:center;font-size:20px;
    background:linear-gradient(180deg,rgba(255,255,255,.7) 0 34%,var(--c) 34% 100%);box-shadow:inset 0 0 0 3px rgba(255,255,255,.9),0 0 0 2px var(--d),0 4px 0 var(--d),0 6px 10px rgba(30,80,90,.18);
    text-shadow:0 2px 0 rgba(0,0,0,.28)}
  #tubes .lvb::before{content:'';position:absolute;left:20%;top:14%;width:16%;height:50%;border-radius:8px;background:rgba(255,255,255,.55)}
  #tubes .lvb:active{transform:translateY(3px)}
  #tubes .lvb .s{position:absolute;bottom:-11px;font-size:11px;letter-spacing:-2px;line-height:1;text-shadow:none}
  #tubes .lvb .s i{font-style:normal}
  #tubes .lvb .s i.off{filter:grayscale(1);opacity:.35}
  #tubes .lvb.cur{outline:3px dashed #1FA9B8;outline-offset:4px}
  #tubes .lvb.lock{--c:#D5DEE4 !important;--d:#B2C0CA !important;color:#8797A3;text-shadow:none}
  #tubes .lvb.lock::after{content:'🔒';position:absolute;top:-6px;right:-4px;font-size:15px}
  #tubes .intro{position:absolute;left:0;right:0;top:38%;display:flex;justify-content:center;pointer-events:none;z-index:6;opacity:0}
  #tubes .intro.on{animation:tbIntro 2.1s ease forwards}
  #tubes .intro div{background:linear-gradient(#fff,#F0FBF8);border:4px solid #BDEBDF;border-radius:26px;padding:10px 26px;text-align:center;box-shadow:0 8px 0 #9ED8C8,0 14px 30px rgba(30,80,90,.25);color:#2F5E6E;max-width:86vw}
  #tubes .intro b{display:block;font-size:26px;color:#1F8FA6;line-height:1.2}
  #tubes .intro span{font-size:16px;font-weight:700}
  @keyframes tbIntro{0%{opacity:0;transform:scale(.5)}12%{opacity:1;transform:scale(1.06)}18%{transform:scale(1)}80%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-30px)}}
  #tubes .tip{position:absolute;left:0;right:0;display:flex;justify-content:center;pointer-events:none;z-index:6;opacity:0;transition:opacity .35s}
  #tubes .tip.on{opacity:1}
  #tubes .tip span{background:rgba(255,255,255,.95);color:#2F5E6E;font-weight:800;font-size:15px;border-radius:99px;padding:6px 16px;box-shadow:0 4px 12px rgba(30,80,90,.18);border:2px solid #CDEFE6;max-width:90vw;text-align:center}
  #tubes .wmv{font-size:17px;font-weight:800;margin:2px 0 4px}
  `);
  const root = App.section(ID, `
    <canvas class="tc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🗺️</button>
      <span class="grow"></span>
      <div class="chip"><small>المستوى</small><b class="cLv">1</b></div>
      <div class="chip"><small>الحركات</small><b class="cMv">0</b></div>
      <div class="chip"><small>⭐⭐⭐</small><b class="cPar">≤ 0</b></div>
    </div>
    <div class="ctl">
      <button class="cb" data-c="undo" aria-label="تراجع"><i>↶</i><small>تراجع</small></button>
      <button class="cb" data-c="restart" aria-label="إعادة"><i>🔄</i><small>إعادة</small></button>
      <button class="cb" data-c="extra" aria-label="أنبوب إضافي"><i>➕</i><small>أنبوب</small><span class="cnt">1</span></button>
      <button class="cb" data-c="hint" aria-label="تلميح"><i>💡</i><small>تلميح</small></button>
      <button class="cb" data-c="sym" aria-label="رموز الألوان"><i>🔣</i><small>رموز</small></button>
    </div>
    <div class="intro"><div><b class="iT"></b><span class="iG"></span></div></div>
    <div class="tip"><span></span></div>
    <div class="overlay" id="tbLv"><div class="panel lvp"><h3>🧪 مستويات الأنابيب</h3><div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="tbWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><div class="wmv"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🗺️ المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.tc'), bar = root.querySelector('.bar'), ctlEl = root.querySelector('.ctl');
  const lvOv = root.querySelector('#tbLv'), winOv = root.querySelector('#tbWin');
  const introEl = root.querySelector('.intro'), tipEl = root.querySelector('.tip');
  const btn = k => ctlEl.querySelector(`[data-c="${k}"]`);

  /* ---------- الحالة ---------- */
  let ctx = null, W = 0, H = 0, dpr = 1, bgLayer = null, G = null, rows = [];
  let raf = 0, last = 0, T = 0, running = false, paused = false, speed = 1;
  let lvl = 1, L = null, st = [], hist = [], moves = 0, extraUsed = false, sym = false, won = false;
  let tv = [], sel = -1, anim = null, queued = -1, hint = null, kb = -1, kbOn = false, tipT = 0;
  let parts = [], timers = [], shakeS = 0;

  const later = (t, fn) => timers.push({ t, fn });
  const anyOv = () => lvOv.classList.contains('on') || winOv.classList.contains('on');

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const rr = root.getBoundingClientRect();
    const top = bar.getBoundingClientRect().bottom - rr.top + 4;
    const bot = rr.bottom - ctlEl.getBoundingClientRect().top + 40;
    const aw = Math.min(W - 16, 900), ah = Math.max(120, H - top - bot);
    const n = st.length;
    let best = null;
    for (let r = 1; r <= 3; r++) {
      const per = Math.ceil(n / r);
      const tw = Math.min(aw / (per * 1.55), ah / (r * 5.25), 76);
      if (!best || tw > best.tw * 1.06) best = { r, per, tw };
    }
    const tw = Math.max(18, best.tw); G = geo(tw);
    const rowH = tw * 5.25, total = rowH * best.r, y0 = top + (ah - total) / 2;
    rows = [];
    let idx = 0;
    for (let r = 0; r < best.r; r++) {
      const cnt = Math.min(Math.ceil((n - idx) / (best.r - r)), n - idx), sw = Math.min(tw * 1.55, aw / cnt);
      const x0 = W / 2 - sw * cnt / 2, my = y0 + r * rowH + tw * .9;
      const row = { y: my, base: my + G.bottom, x0, x1: x0 + sw * cnt, sw, items: [] };
      for (let q = 0; q < cnt; q++, idx++) {
        const t = tv[idx]; t.hx = x0 + sw * (q + .5); t.hy = my; t.sw = sw; t.row = r;
        if (t.x == null) { t.x = t.hx; t.y = t.hy; }
        row.items.push(idx);
      }
      rows.push(row);
    }
    introEl.style.top = (y0 + total / 2 - 50) + 'px';
    tipEl.style.top = Math.min(H - bot + 2, rows[rows.length - 1].base + tw * .5) + 'px';
    drawBg();
  }
  function drawBg() {
    bgLayer = document.createElement('canvas'); bgLayer.width = Math.round(W * dpr); bgLayer.height = Math.round(H * dpr);
    const c = bgLayer.getContext('2d'); c.scale(dpr, dpr);
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#DDF4F0'); g.addColorStop(.55, '#EEF1FF'); g.addColorStop(1, '#F6E9F6');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // بلاط المختبر الناعم
    c.strokeStyle = 'rgba(120,170,190,.10)'; c.lineWidth = 1;
    const s = 46;
    for (let x = (W / 2) % s; x < W; x += s) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    for (let y = 0; y < H; y += s) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    // ضوء نافذة
    g = c.createRadialGradient(W * .8, H * .08, 10, W * .8, H * .08, Math.max(W, H) * .7);
    g.addColorStop(0, 'rgba(255,255,240,.75)'); g.addColorStop(1, 'rgba(255,255,240,0)'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    // دوائر ضبابية
    const rng = mulberry(77);
    for (let i = 0; i < 16; i++) {
      const x = rng() * W, y = rng() * H, r = 20 + rng() * 70, col = ['#BFF0E2', '#D9CCFF', '#FFD3E8', '#FFF0B8'][i % 4];
      g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col + 'AA'); g.addColorStop(1, col + '00'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    }
    // جزيئات زخرفية
    c.strokeStyle = 'rgba(90,150,170,.13)'; c.fillStyle = 'rgba(90,150,170,.13)'; c.lineWidth = 2;
    const mol = (x, y, k) => {
      const p = [[0, 0], [k, -k * .6], [k * 2, 0], [k, k * .9]];
      c.save(); c.translate(x, y);
      c.beginPath(); c.moveTo(p[0][0], p[0][1]); c.lineTo(p[1][0], p[1][1]); c.lineTo(p[2][0], p[2][1]); c.moveTo(p[1][0], p[1][1]); c.lineTo(p[3][0], p[3][1]); c.stroke();
      p.forEach(([a, b], i) => { c.beginPath(); c.arc(a, b, i === 1 ? k * .32 : k * .22, 0, TAU); c.fill(); });
      c.restore();
    };
    mol(W * .06, H * .2, 18); mol(W * .82, H * .9, 16); mol(W * .1, H * .86, 12);
    // الرفوف
    for (const r of rows) {
      const tw = G.tw, x0 = Math.max(6, r.x0 - tw * .35), x1 = Math.min(W - 6, r.x1 + tw * .35), y = r.base - tw * .02, h = tw * .24;
      c.fillStyle = 'rgba(60,110,130,.12)'; c.beginPath(); c.ellipse((x0 + x1) / 2, y + h + tw * .18, (x1 - x0) / 2, tw * .14, 0, 0, TAU); c.fill();
      g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.35, '#F4EBDD'); g.addColorStop(1, '#D9C3A5');
      c.fillStyle = g; c.beginPath(); c.roundRect(x0, y, x1 - x0, h, h / 2); c.fill();
      c.strokeStyle = 'rgba(150,115,80,.35)'; c.lineWidth = 1.5; c.stroke();
      c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.roundRect(x0 + h * .5, y + 2, x1 - x0 - h, h * .22, h * .11); c.fill();
    }
  }

  /* ---------- بدء مستوى ---------- */
  function mkTV(i, delay) { return { x: null, y: null, hx: 0, hy: 0, sw: 0, row: 0, lift: 0, liftV: 0, shake: 0, bounce: 0, agit: 0, phase: rand(0, TAU), cork: null, bubbles: [], bt: rand(0, 1.5), enter: -delay, pop: 0 }; }
  function startLevel(n) {
    lvl = clamp(n, 1, NLV); L = genLevel(lvl);
    st = clone(L.tubes); hist = []; moves = 0; extraUsed = false; won = false;
    sel = -1; anim = null; queued = -1; hint = null; parts = []; timers = []; kb = -1;
    tv = st.map((_, i) => mkTV(i, i * .05));
    winOv.classList.remove('on'); lvOv.classList.remove('on'); tip('', 0);
    layout(); paintUI();
    root.querySelector('.iT').textContent = `المستوى ${lvl}`;
    root.querySelector('.iG').textContent = `🧪 ${L.colors} ألوان · ${App.g('رتّبي', 'رتّب')} كل لون في أنبوب`;
    introEl.classList.remove('on'); void introEl.offsetWidth; introEl.classList.add('on');
    Sound.whoosh();
  }
  function paintUI() {
    root.querySelector('.cLv').textContent = lvl;
    root.querySelector('.cMv').textContent = moves;
    root.querySelector('.cPar').textContent = '≤ ' + star3(L);
    btn('undo').disabled = !hist.length;
    btn('extra').disabled = extraUsed;
    btn('extra').querySelector('.cnt').style.display = extraUsed ? 'none' : '';
    btn('sym').classList.toggle('on', sym);
  }
  function tip(text, dur) {
    const s = tipEl.querySelector('span');
    if (!text) { tipEl.classList.remove('on'); tipT = 0; return; }
    s.textContent = text; tipEl.classList.add('on'); tipT = dur || 3;
  }

  /* ---------- اللعب ---------- */
  function segments(arr) {
    const out = [];
    for (const c of arr) { const t = out[out.length - 1]; if (t && t.c === c) t.h++; else out.push({ c, h: 1 }); }
    return out;
  }
  function tap(i) {
    if (won || anyOv() || paused) return;
    if (anim) { queued = i; return; }
    hint = null;
    const t = tv[i]; if (!t || t.enter < 1) return;
    if (sel < 0) {
      const a = st[i];
      if (!a.length || isDone(a)) { t.shake = 1; Sound.tone(300, .08, 'sine', .08, -60); vibrate(10); return; }
      sel = i; t.agit = 1; Sound.tone(520, .09, 'sine', .11, 260); vibrate(8);
      return;
    }
    if (i === sel) { sel = -1; Sound.tone(460, .08, 'sine', .09, -140); return; }
    const amt = pourAmt(st, sel, i);
    if (!amt) {
      t.shake = 1; tv[sel].shake = .6; Sound.error(); vibrate(30);
      const a = st[i];
      if (a.length >= CAP) tip(App.g('هذا الأنبوب ممتلئ!', 'هذا الأنبوب ممتلئ!') + ' 🙅', 1.8);
      else tip(App.g('اسكبي', 'اسكب') + ' على اللون نفسه أو في أنبوب فارغ 💧', 2);
      sel = -1; return;
    }
    pour(sel, i, amt);
  }
  function pour(s, d, amt) {
    hist.push(clone(st));
    const color = st[s][st[s].length - 1];
    for (let q = 0; q < amt; q++) st[d].push(st[s].pop());
    moves++; sel = -1; tip('', 0);
    const ts = tv[s], td = tv[d], reach = G.bottom * .95 + G.tw * .3;
    let side = ts.hx < td.hx ? -1 : 1;
    if (side > 0 && td.hx + reach > W) side = -1; else if (side < 0 && td.hx - reach < 0) side = 1;
    const remain = st[s].length, before = remain + amt, R = Math.PI / 180;
    const th0 = (-side) * (50 + (4 - before) * 9) * R, th1 = (-side) * Math.min(86, 68 + (4 - remain) * 6) * R;
    anim = { s, d, c: color, amt, t: 0, side, th0, th1, T1: .22, T2: .22 + .2 + .13 * amt, T3: .22 + .2 + .13 * amt + .24, fromX: ts.x, fromY: ts.y - ts.lift, dBefore: st[d].length - amt };
    // أصوات الصبّ: قرقرة متصاعدة
    const base = 260 + anim.dBefore * 70;
    for (let q = 0; q < amt * 2; q++) Sound.tone(base + q * 45 + rand(-10, 10), .08, 'sine', .12, 160, anim.T1 + .04 + q * (anim.T2 - anim.T1) / (amt * 2 + .5));
    Sound.noise(anim.T2 - anim.T1, 500, 1500, .045, 1.5, anim.T1);
    paintUI();
  }
  function srcPose(A) {
    const ts = tv[A.s], td = tv[A.d], t = A.t, a = G.a;
    let th, k;
    if (t < A.T1) { k = easeIO(t / A.T1); th = A.th0 * k; }
    else if (t < A.T2) { k = 1; th = lerp(A.th0, A.th1, easeIO((t - A.T1) / (A.T2 - A.T1))); }
    else { k = 1 - easeIO(Math.min(1, (t - A.T2) / (A.T3 - A.T2))); th = A.th1 * k; }
    // نقطة الشفة فوق فوهة الهدف
    const lipX = td.hx + A.side * G.tw * .14, lipY = td.hy - G.tw * .45;
    const sx = Math.sign(th) || -A.side, lx = a * sx;
    const px = lipX - lx * Math.cos(th), py = lipY - lx * Math.sin(th);
    const homeX = t < A.T2 ? A.fromX : ts.hx, homeY = t < A.T2 ? A.fromY : ts.hy;
    return { x: lerp(homeX, px, k), y: lerp(homeY, py, k), th, lipX, lipY, k };
  }
  function pourProgress(A) { return A.t < A.T1 ? 0 : A.t >= A.T2 ? 1 : easeIO((A.t - A.T1) / (A.T2 - A.T1)); }
  function finishPour(A) {
    const td = tv[A.d], ts = tv[A.s];
    ts.x = ts.hx; ts.y = ts.hy; ts.lift = 0; ts.liftV = 0;
    td.bounce = 1; td.agit = 1;
    if (isDone(st[A.d])) completeTube(A.d);
    if (solved(st)) { winSeq(); return; }
    if (!movesOf(st).length) tip(App.g('لا توجد حركات! جرّبي التراجع ↶', 'لا توجد حركات! جرّب التراجع ↶') + (extraUsed ? '' : ' أو أنبوبًا إضافيًا ➕'), 4);
  }
  function completeTube(i) {
    const t = tv[i]; t.cork = 0;
    later(.3, () => {
      Sound.pop(); vibrate(15);
      [1047, 1319, 1568, 2093].forEach((f, q) => Sound.tone(f, .22, 'triangle', .09, 0, .05 + q * .07));
      const col = COLS[st[i][0] != null ? st[i][0] : 0];
      for (let q = 0; q < 18; q++) {
        const ang = rand(0, TAU), sp = rand(60, 200);
        parts.push({ k: 'spark', x: t.x, y: t.y - G.tw * .3, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 60, life: 0, max: rand(.5, .9), sz: rand(.1, .2) * G.tw, c: q % 3 ? '#FFFFFF' : col[0], rot: rand(0, TAU) });
      }
    });
  }
  function winSeq() {
    won = true; sel = -1; hint = null;
    const pr = loadProg(), s = starsFor(L, moves, extraUsed), prev = pr.stars[lvl] || 0;
    if (s > prev) pr.stars[lvl] = s;
    if (!pr.best[lvl] || moves < pr.best[lvl]) pr.best[lvl] = moves;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(NLV, lvl + 1);
    store.set('tubesProg', pr);
    const maxDone = Math.max(...Object.keys(pr.stars).map(Number));
    later(.9, () => {
      Sound.win();
      tv.forEach((t, i) => later(i * .06, () => { t.bounce = 1.4; t.agit = 1; }));
      for (let i = 0; i < 140; i++) parts.push({ k: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(90, 260), rot: rand(0, TAU), vr: rand(-8, 8), life: 0, max: 4, sz: rand(6, 11), c: COLS[i % 10][0] });
      App.achieve('tubes_first');
      if (maxDone >= 10) App.achieve('tubes_10');
      if (maxDone >= 30) App.achieve('tubes_30');
    });
    later(2, () => {
      if (App.current !== ID) return;
      const titles = [App.g('أحسنتِ!', 'أحسنت!'), App.g('رائعة!', 'رائع!'), App.g('مذهلة!', 'مذهل!'), App.g('عبقرية صغيرة!', 'عبقري صغير!')];
      root.querySelector('.wT').textContent = titles[s] || titles[0];
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(q => `<span class="${q <= s ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wmv').textContent = `${moves} حركة · هدف 3 نجوم ≤ ${star3(L)}`;
      root.querySelector('.wP').textContent = extraUsed && s === 2 ? 'الأنبوب الإضافي يجعل الحد الأقصى نجمتين ⭐⭐' : s < 3 ? App.g('حاولي بحركات أقل لتحصلي على 3 نجوم', 'حاول بحركات أقل لتحصل على 3 نجوم') : App.g('حللتِه بأقل الحركات! 🧪', 'حللته بأقل الحركات! 🧪');
      root.querySelector('[data-a="next"]').style.display = lvl < NLV ? '' : 'none';
      winOv.classList.add('on');
      if (s > prev) later(.5, () => App.addStars(s - prev));
      if (lvl === NLV) App.toast(App.g('أنهيتِ كل المستويات! 🏆', 'أنهيت كل المستويات! 🏆'));
    });
  }
  function undo() {
    if (won || anyOv()) return;
    if (anim) return;
    if (!hist.length) { Sound.error(); return; }
    st = hist.pop(); sel = -1; hint = null; tip('', 0);
    st.forEach((a, i) => { tv[i].agit = 1; if (!isDone(a)) tv[i].cork = null; else if (tv[i].cork == null) tv[i].cork = 1; });
    Sound.tone(600, .12, 'sine', .1, -300); Sound.slide(); vibrate(8);
    paintUI();
  }
  function restart() {
    if (anyOv()) return;
    Sound.whoosh();
    st = clone(L.tubes); hist = []; moves = 0; extraUsed = false; won = false; sel = -1; anim = null; queued = -1; hint = null; timers = []; parts = [];
    tv = st.map((_, i) => mkTV(i, i * .04));
    tip('', 0); layout(); paintUI();
  }
  function addExtra() {
    if (won || anyOv() || anim) return;
    if (extraUsed) { Sound.error(); App.toast('الأنبوب الإضافي مرة واحدة لكل مستوى'); return; }
    extraUsed = true; st.push([]); hist.forEach(h => h.push([]));
    const t = mkTV(st.length - 1, 0); t.enter = 0; t.pop = 1; tv.push(t);
    layout(); t.x = t.hx; t.y = t.hy;
    Sound.pop(); Sound.tone(700, .2, 'triangle', .1, 400, .05); vibrate(12);
    tip('', 0); paintUI();
  }
  function doHint() {
    if (won || anyOv() || anim) return;
    const path = solve(st, 15000, 1.6);
    if (path && path.length) {
      const [s, d] = path[0]; hint = { s, d, t: 0 }; sel = -1;
      Sound.tone(880, .1, 'sine', .1, 0); Sound.tone(1175, .14, 'sine', .08, 0, .08);
      tip(App.g('اسكبي من الأنبوب المضيء ⬇️ إلى المتوهّج', 'اسكب من الأنبوب المضيء ⬇️ إلى المتوهّج'), 3);
    } else if (path) { /* محلولة */ }
    else {
      Sound.error();
      const b = extraUsed ? btn('undo') : btn('extra');
      b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse');
      tip(extraUsed ? App.g('تراجعي بضع خطوات ↶ ثم حاولي من جديد', 'تراجع بضع خطوات ↶ ثم حاول من جديد') : App.g('أضيفي أنبوبًا فارغًا ➕ أو تراجعي ↶', 'أضف أنبوبًا فارغًا ➕ أو تراجع ↶'), 3.5);
    }
  }
  function control(k) {
    if (k === 'undo') undo();
    else if (k === 'restart') restart();
    else if (k === 'extra') addExtra();
    else if (k === 'hint') doHint();
    else if (k === 'sym') { sym = !sym; store.set('tubesSym', sym); Sound.tap(); paintUI(); }
  }
  ctlEl.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', () => { if (App.current === ID && !paused) control(b.dataset.c); }));

  /* ---------- المستويات ---------- */
  function openLevels() {
    const pr = loadProg(), g = root.querySelector('.lvg');
    g.innerHTML = Array.from({ length: NLV }, (_, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked, k = COLS[i % 10];
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" style="--c:${k[0]};--d:${k[2]}" data-l="${n}" aria-label="المستوى ${n}">
        ${n}<span class="s">${lock ? '' : [1, 2, 3].map(q => `<i class="${q <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    g.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
    const cur = g.querySelector('.cur'); if (cur) setTimeout(() => cur.scrollIntoView({ block: 'center' }), 30);
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

  /* ---------- الإدخال ---------- */
  function tubeAt(x, y) {
    let bi = -1, bd = Infinity;
    tv.forEach((t, i) => {
      if (Math.abs(x - t.hx) > t.sw / 2) return;
      const y0 = t.hy - G.tw * 1.2, y1 = t.hy + G.bottom + G.tw * .4;
      if (y < y0 || y > y1) return;
      const d = Math.abs(x - t.hx); if (d < bd) { bd = d; bi = i; }
    });
    return bi;
  }
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused) return;
    const rc = cv.getBoundingClientRect(), i = tubeAt(e.clientX - rc.left, e.clientY - rc.top);
    kbOn = false;
    if (i < 0) { if (sel >= 0 && !anim) { sel = -1; Sound.tone(460, .08, 'sine', .09, -140); } return; }
    tap(i);
  });
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < NLV ? 'next' : 'levels'); return; }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? act('close') : openLevels(); return; }
    if (anyOv() || paused) return;
    const n = st.length;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); kbOn = true; kb = kb < 0 ? 0 : (kb + (e.key === 'ArrowRight' ? 1 : -1) + n) % n; Sound.tone(700, .03, 'sine', .05); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); kbOn = true; if (kb < 0) kb = 0;
      const r = tv[kb].row + (e.key === 'ArrowDown' ? 1 : -1);
      if (rows[r]) { let bi = rows[r].items[0], bd = Infinity; rows[r].items.forEach(j => { const d = Math.abs(tv[j].hx - tv[kb].hx); if (d < bd) { bd = d; bi = j; } }); kb = bi; Sound.tone(700, .03, 'sine', .05); }
    }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); kbOn = true; if (kb < 0) kb = 0; tap(kb); }
    else if (/^[0-9]$/.test(e.key)) { const i = e.key === '0' ? 9 : +e.key - 1; if (i < n) { kb = i; tap(i); } }
    else if (e.key === 'z' || e.key === 'Z' || e.key === 'Backspace') { e.preventDefault(); undo(); }
    else if (e.key === 'r' || e.key === 'R') restart();
    else if (e.key === 'h' || e.key === 'H') doHint();
    else if (e.key === 'e' || e.key === 'E' || e.key === '+') addExtra();
    else if (e.key === 'Escape' && sel >= 0) sel = -1;
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    for (let i = timers.length - 1; i >= 0; i--) { const t = timers[i]; t.t -= dt; if (t.t <= 0) { timers.splice(i, 1); t.fn(); } }
    if (tipT > 0) { tipT -= dt; if (tipT <= 0) tip('', 0); }
    if (hint) { hint.t += dt; if (hint.t > 4) hint = null; }
    const tw = G.tw;
    tv.forEach((t, i) => {
      if (t.enter < 1) t.enter = Math.min(1, t.enter + dt * 2.6);
      t.x += (t.hx - t.x) * Math.min(1, dt * 12); t.y += (t.hy - t.y) * Math.min(1, dt * 12);
      const target = sel === i ? tw * .62 : 0;
      t.liftV += ((target - t.lift) * 260 - t.liftV * 20) * dt; t.lift += t.liftV * dt;
      if (t.shake > 0) t.shake = Math.max(0, t.shake - dt * 2.4);
      if (t.bounce > 0) t.bounce = Math.max(0, t.bounce - dt * 2.2);
      if (t.pop > 0) t.pop = Math.max(0, t.pop - dt * 2.5);
      t.agit = Math.max(0, t.agit - dt * .9);
      t.phase += dt * (3 + t.agit * 8);
      if (t.cork != null && t.cork < 1) t.cork = Math.min(1, t.cork + dt * 1.6);
      // فقاعات
      const lv = st[i].length;
      t.bt -= dt;
      if (lv && t.bt <= 0 && t.bubbles.length < 5) { t.bt = rand(.5, 1.8); t.bubbles.push({ x: rand(-.6, .6), h: rand(0, .4), r: rand(.03, .065) * tw, v: rand(.5, 1.1) }); }
      for (let q = t.bubbles.length - 1; q >= 0; q--) { const b = t.bubbles[q]; b.h += b.v * dt; b.x += Math.sin(T * 4 + q) * dt * .2; if (b.h > lv + .1) t.bubbles.splice(q, 1); }
    });
    if (anim) {
      const A = anim; A.t += dt;
      const p = pourProgress(A);
      if (A.t > A.T1 && A.t < A.T2) {
        tv[A.d].agit = Math.max(tv[A.d].agit, .9);
        if (Math.random() < dt * 30) {
          const td = tv[A.d], surf = td.hy + G.Lb - (A.dBefore + A.amt * p) * G.lh;
          parts.push({ k: 'drop', x: td.hx + rand(-.15, .15) * tw, y: surf, vx: rand(-60, 60), vy: rand(-140, -60), life: 0, max: rand(.25, .45), sz: rand(.04, .08) * tw, c: COLS[A.c][0] });
        }
        if (Math.random() < dt * 8) tv[A.d].bubbles.push({ x: rand(-.6, .6), h: rand(0, .3), r: rand(.03, .06) * tw, v: rand(1, 1.8) });
      }
      if (A.t >= A.T3) { anim = null; finishPour(A); if (queued >= 0 && !won) { const q = queued; queued = -1; tap(q); } }
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.life += dt;
      if (q.life > q.max) { parts.splice(i, 1); continue; }
      if (q.k === 'conf') { q.vy = Math.min(q.vy + 120 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; q.rot += q.vr * dt; }
      else if (q.k === 'drop') q.vy += 900 * dt;
      else { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 120 * dt; q.rot += dt * 4; }
      q.x += q.vx * dt; q.y += q.vy * dt;
    }
  }

  /* ---------- الرسم ---------- */
  function tubeLayers(i) {
    const L0 = segments(st[i]), A = anim;
    if (!A) return L0;
    const p = pourProgress(A);
    if (i === A.s) {
      const rem = A.amt * (1 - p);
      if (rem > .001) { const t = L0[L0.length - 1]; if (t && t.c === A.c) t.h += rem; else L0.push({ c: A.c, h: rem }); }
    } else if (i === A.d) {
      const t = L0[L0.length - 1]; t.h -= A.amt * (1 - p); if (t.h <= .001) L0.pop();
    }
    return L0;
  }
  function tubeOpts(i) {
    const t = tv[i], tw = G.tw;
    const sh = t.shake > 0 ? Math.sin(t.shake * 26) * t.shake * tw * .14 : 0;
    const bo = t.bounce > 0 ? -Math.abs(Math.sin(t.bounce * Math.PI * 1.5)) * t.bounce * tw * .18 : 0;
    const en = t.enter < 0 ? 0 : backOut(Math.min(1, t.enter));
    const k = clamp(t.lift / (tw * .62), 0, 1.2);
    const o = {
      x: t.x + sh, y: t.y - t.lift + bo - (1 - en) * tw * 2.5, th: sel === i ? Math.sin(T * 5) * .05 - .09 * k : 0,
      layers: tubeLayers(i), wave: tw * (.025 + t.agit * .07), phase: t.phase, sym, bubbles: t.bubbles,
      cork: t.cork, scale: t.pop > 0 ? 1 + Math.sin(t.pop * Math.PI) * .2 : 1, alpha: Math.max(0, Math.min(1, t.enter * 3))
    };
    if (sel === i) o.glow = { c: '#FFE36E', a: .7 };
    if (hint && (hint.s === i || hint.d === i)) o.glow = { c: hint.s === i ? '#FFD54A' : '#5EF0C0', a: .45 + .4 * Math.sin(hint.t * 8) ** 2 };
    if (kbOn && kb === i && !o.glow) o.glow = { c: '#7CC8FF', a: .6 };
    return o;
  }
  function render() {
    if (!ctx || !G) return;
    const c = ctx, tw = G.tw;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.drawImage(bgLayer, 0, 0, W, H);
    // ظلال على الرف
    tv.forEach((t, i) => {
      if (anim && anim.s === i) return;
      const k = clamp(t.lift / (tw * .62), 0, 1.3), base = rows[t.row].base;
      c.fillStyle = `rgba(40,80,100,${.2 - k * .1})`; c.beginPath(); c.ellipse(t.x, base + tw * .04, tw * (.42 - k * .1), tw * .09, 0, 0, TAU); c.fill();
    });
    const order = tv.map((_, i) => i).filter(i => !anim || i !== anim.s);
    for (const i of order) {
      const o = tubeOpts(i);
      if (o.alpha < 1) { c.save(); c.globalAlpha = o.alpha; drawTube(c, G, o); c.restore(); } else drawTube(c, G, o);
    }
    // سهم التلميح
    if (hint) {
      const t = tv[hint.s], y = t.y - t.lift - tw * .75 + Math.sin(hint.t * 7) * tw * .12;
      c.save(); c.translate(t.x, y); c.fillStyle = '#FFB300'; c.strokeStyle = '#fff'; c.lineWidth = 3; c.lineJoin = 'round';
      c.beginPath(); c.moveTo(-tw * .22, -tw * .32); c.lineTo(tw * .22, -tw * .32); c.lineTo(tw * .22, -tw * .05); c.lineTo(tw * .36, -tw * .05); c.lineTo(0, tw * .3); c.lineTo(-tw * .36, -tw * .05); c.lineTo(-tw * .22, -tw * .05); c.closePath();
      c.stroke(); c.fill(); c.restore();
    }
    if (anim) {
      const A = anim, pose = srcPose(A), p = pourProgress(A);
      // تيار السائل
      if (A.t > A.T1 - .02 && A.t < A.T2 + .04) {
        const td = tv[A.d], surf = td.hy + G.Lb - (A.dBefore + A.amt * p) * G.lh;
        const fade = A.t > A.T2 ? 1 - (A.t - A.T2) / .04 : Math.min(1, (A.t - A.T1 + .02) / .06);
        const wdt = tw * .2 * fade * (1 - p * .35), x0 = pose.lipX, y0 = pose.lipY + tw * .02;
        const col = COLS[A.c];
        const g = c.createLinearGradient(x0 - wdt, 0, x0 + wdt, 0); g.addColorStop(0, col[2]); g.addColorStop(.4, col[1]); g.addColorStop(1, col[0]);
        c.fillStyle = g; c.beginPath(); c.moveTo(x0 - wdt * .7, y0);
        const N = 10;
        for (let q = 0; q <= N; q++) { const y = lerp(y0, surf, q / N), wb = Math.sin(T * 30 + q) * tw * .02; c.lineTo(x0 - wdt / 2 * (1 - q / N * .3) + wb - (q ? 0 : wdt * .2) * (1 - q / N), y); }
        for (let q = N; q >= 0; q--) { const y = lerp(y0, surf, q / N), wb = Math.sin(T * 30 + q) * tw * .02; c.lineTo(x0 + wdt / 2 * (1 - q / N * .3) + wb, y); }
        c.closePath(); c.fill();
        c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(x0 - wdt * .15, y0 + tw * .1, wdt * .12, Math.max(0, surf - y0 - tw * .2));
      }
      const o = { x: pose.x, y: pose.y, th: pose.th, layers: tubeLayers(A.s), wave: tw * .05, phase: tv[A.s].phase, sym, bubbles: null, cork: null };
      drawTube(c, G, o);
    }
    // الجسيمات
    for (const q of parts) {
      const a = 1 - q.life / q.max;
      c.save(); c.translate(q.x, q.y);
      if (q.k === 'conf') { c.globalAlpha = Math.min(1, a * 3); c.rotate(q.rot); c.fillStyle = q.c; c.fillRect(-q.sz / 2, -q.sz / 4, q.sz, q.sz / 2); }
      else if (q.k === 'drop') { c.globalAlpha = a; c.fillStyle = q.c; c.beginPath(); c.arc(0, 0, q.sz, 0, TAU); c.fill(); }
      else {
        c.globalAlpha = a; c.rotate(q.rot); c.fillStyle = q.c; c.beginPath();
        for (let i = 0; i < 8; i++) { const r = i % 2 ? q.sz * .35 : q.sz, t = i * Math.PI / 4; c.lineTo(Math.cos(t) * r, Math.sin(t) * r); }
        c.closePath(); c.fill();
      }
      c.restore();
    }
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
    if (App.current !== ID || !L) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    IK.bg(c, s, ['#D9FFF6', '#62DCC6', '#13A08F'], { seed: 13 });
    const Gi = geo(s * .22);
    const tubesI = [
      { x: .28, L: [{ c: 2, h: 1 }, { c: 0, h: 1 }, { c: 1, h: 2 }], th: -.08 },
      { x: .5, L: [{ c: 3, h: 4 }], th: 0, cork: 1 },
      { x: .72, L: [{ c: 4, h: 1 }, { c: 6, h: 1 }, { c: 2, h: 1 }], th: .08 }
    ];
    const sc = (s * .66) / Gi.bottom;
    IK.shadow(c, s * .5, s * .86, s * .4, s * .05, .3);
    IK.sticker(c, s, c => {
      c.fillStyle = '#F2D3A4'; c.beginPath(); c.roundRect(s * .1, s * .8, s * .8, s * .07, s * .035); c.fill();
      c.fillStyle = '#D9A866'; c.fillRect(s * .12, s * .845, s * .76, s * .02);
      for (const t of tubesI) {
        c.save(); c.translate(s * t.x, s * .805 - Gi.bottom * sc); c.scale(sc, sc);
        drawTube(c, Gi, { x: 0, y: 0, th: t.th, layers: t.L, wave: Gi.tw * .03, phase: t.x * 9, cork: t.cork || null });
        c.restore();
      }
    });
    IK.sparkle(c, s * .14, s * .2, 9); IK.sparkle(c, s * .87, s * .16, 7);
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'أنابيب الألوان', icon2: '🧪', isNew: true, music: 'tubes',
    desc: () => App.g('اسكبي الألوان حتى يصير كل أنبوب بلون واحد', 'اسكب الألوان حتى يصير كل أنبوب بلون واحد'),
    help: () => [
      '👆 ' + App.g('المسي', 'المس') + ' أنبوبًا لترفعه، ثم ' + App.g('المسي', 'المس') + ' أنبوبًا آخر لتسكب فيه',
      '💧 يمكنك السكب فقط على اللون نفسه أو في أنبوب فارغ، وكل أنبوب يتسع لـ4 طبقات',
      '🧪 ' + App.g('رتّبي', 'رتّب') + ' كل لون في أنبوب واحد ليُغلق بسدادة ويفوز المستوى',
      '↶ تراجع بلا حدود، 💡 تلميح لحركة مفيدة، ➕ أنبوب إضافي مرة واحدة (يجعل الحد نجمتين)',
      '⭐ ' + App.g('أنهي', 'أنهِ') + ' المستوى بعدد قليل من الحركات لتحصل على 3 نجوم، و🔣 تُظهر رموزًا تميّز الألوان'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 المستوى ${Math.max(...ks)} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false; sym = !!store.get('tubesSym', false);
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, NLV));
      render(); startLoop();
    },
    leave() {
      stopLoop(); timers = []; anim = null; sel = -1; hint = null; queued = -1;
      winOv.classList.remove('on'); lvOv.classList.remove('on'); introEl.classList.remove('on'); tip('', 0);
    },
    pause() { paused = true; },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      if (sel >= 0) { sel = -1; return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() { return { lvl, moves, st: clone(st), par: L.par, sel, anim: !!anim, won, extraUsed, colors: L.colors, empty: L.empty }; },
    _tap(i) { tap(i); },
    _solve() { return solve(st, 40000, 1.2); },
    _start(n) { startLevel(n); },
    _speed(n) { speed = n; },
    _gen(n) { return genLevel(n); },
    _pos(i) { return { x: tv[i].hx, y: tv[i].hy + G.Lb * .6 }; }
  });
})();
