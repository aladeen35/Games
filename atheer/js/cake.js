/* =====================================================================
   زينة الكيك — صمّم كعكتك: الشكل والطبقات، النكهة، صبّ الكريمة،
   الرسم بكيس الكريمة، الإضافات والشموع، ثم احتفال وصورة للحفظ.
   وضعان: «حر» و«طلبات» (15 طلبًا لزبائن لطفاء)، ومعرض لآخر الكعكات.
   كل الرسم بالكانفاس (منظور ثلاثي الأبعاد مزيّف، بلا مكتبات).
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'cake', TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';
  const EMO = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const TILT = .42, NS = 192;

  /* ---------- البيانات ---------- */
  const SHAPES = [
    { id: 'round', n: 'دائرية', s: 'دائرية' },
    { id: 'square', n: 'مربعة', s: 'مربعة' },
    { id: 'heart', n: 'قلب', s: 'على شكل قلب' },
    { id: 'star', n: 'نجمة', s: 'على شكل نجمة' }
  ];
  const FLAV = {
    vanilla: { n: 'فانيليا', s: 'بالفانيليا', side: '#F4CF83', crust: '#E2AA58' },
    choco: { n: 'شوكولاتة', s: 'بالشوكولاتة', side: '#7E4A2A', crust: '#5E3219' },
    straw: { n: 'فراولة', s: 'بالفراولة', side: '#F7A2B6', crust: '#E07C96' },
    rainbow: { n: 'قوس قزح', s: 'بألوان قوس قزح', side: '#FFE066', crust: '#F0C77A', layers: ['#B98CFF', '#6BB8FF', '#7BE08A', '#FFE066', '#FFA94D', '#FF6B7A'] }
  };
  const FLAV_IDS = ['vanilla', 'choco', 'straw', 'rainbow'];
  const FROST = [
    { id: 'white', n: 'بيضاء', c: '#FFFBF4', coat: '#F4E5D2' },
    { id: 'pink', n: 'وردية', c: '#FF7FB8' },
    { id: 'choco', n: 'بالشوكولاتة', c: '#5E3018', coat: '#B98560' },
    { id: 'red', n: 'حمراء', c: '#F2405A' },
    { id: 'purple', n: 'بنفسجية', c: '#A982FF' },
    { id: 'mint', n: 'بالنعناع', c: '#5FD6A8' },
    { id: 'blue', n: 'زرقاء', c: '#5DB8FF' },
    { id: 'yellow', n: 'صفراء', c: '#FFD447' },
    { id: 'caramel', n: 'بالكراميل', c: '#D98F3A' }
  ];
  FROST.forEach(f => { if (!f.coat) f.coat = mixHex(f.c, '#FFF6EC', .58); });
  const CREAM = ['#FFFDF8', '#FF9CCB', '#7A4426', '#FFE27A', '#8FD0FF', '#86E3BE', '#C7A6FF', '#FF6B81'];
  const TIPS = [
    { id: 'star', n: 'وردة', r: .066, gap: .068 },
    { id: 'dot', n: 'نقاط', r: .043, gap: .1 },
    { id: 'ruffle', n: 'كشكشة', r: .062, gap: .03 },
    { id: 'swirl', n: 'دوّامة', r: .08, gap: .15 }
  ];
  /* e: نصف عرض صندوق الرسم بوحدة الكعكة (نقطة التلامس عند 1.6e من الأعلى) */
  const TOPS = [
    { id: 'cherry', n: 'كرز', e: .2, nv: 1 },
    { id: 'straw', n: 'فراولة', e: .16, nv: 1 },
    { id: 'blue', n: 'توت', e: .07, nv: 1 },
    { id: 'choc', n: 'شوكولاتة', e: .12, nv: 3 },
    { id: 'spr', n: 'رشّات', e: .1, nv: 1 },
    { id: 'mac', n: 'ماكرون', e: .1, nv: 5 },
    { id: 'candy', n: 'حلوى', e: .11, nv: 4 },
    { id: 'lolly', n: 'مصاصة', e: .2, nv: 3 },
    { id: 'flower', n: 'وردة', e: .1, nv: 5 },
    { id: 'heart', n: 'قلب', e: .1, nv: 3 },
    { id: 'star', n: 'نجمة', e: .1, nv: 3 },
    { id: 'candle', n: 'شمعة', e: .2, nv: 5 },
    { id: 'plq', n: 'لوحة', e: .3, nv: 1 }
  ];
  const TOP = Object.fromEntries(TOPS.map(t => [t.id, t]));
  const SPR_COLS = ['#FF4F8B', '#FFD23F', '#3ED1A0', '#4FA8FF', '#B07CFF', '#FF8A3D', '#FFFFFF'];
  const STEPS = [
    { i: '🎂', n: 'الشكل' }, { i: '🍰', n: 'الكيك' }, { i: '🍯', n: 'الكريمة' },
    { i: '🧁', n: 'التزيين' }, { i: '🍒', n: 'الإضافات' }, { i: '🎉', n: 'تم!' }
  ];
  /* الطلبات: shape, tiers, flavor, frost, pipe (عدد خطوط الكريمة), items */
  const ORDERS = [
    { who: '🧒', flavor: 'choco', frost: 'pink', items: { cherry: 3 } },
    { who: '🐰', flavor: 'vanilla', frost: 'white', items: { straw: 3 } },
    { who: '👧', shape: 'heart', frost: 'pink', items: { heart: 2 } },
    { who: '🐻', flavor: 'straw', frost: 'white', pipe: 1, items: { cherry: 1 } },
    { who: '🐼', tiers: 2, frost: 'blue', items: { candle: 3 } },
    { who: '🦊', shape: 'square', flavor: 'choco', frost: 'choco', items: { choc: 4, spr: 1 } },
    { who: '🐱', shape: 'star', frost: 'yellow', items: { star: 3, candle: 1 } },
    { who: '🦄', flavor: 'rainbow', frost: 'white', items: { spr: 1, lolly: 1 } },
    { who: '🐨', tiers: 2, frost: 'mint', pipe: 2, items: { flower: 4 } },
    { who: '👵', shape: 'heart', flavor: 'straw', frost: 'red', items: { straw: 4, plq: 1 } },
    { who: '🐯', tiers: 3, frost: 'purple', items: { mac: 3, candle: 3 } },
    { who: '🐶', flavor: 'choco', frost: 'caramel', pipe: 3, items: { blue: 5, choc: 2 } },
    { who: '🐸', shape: 'square', tiers: 2, frost: 'pink', items: { candy: 4, heart: 2, candle: 4 } },
    { who: '🦁', shape: 'star', flavor: 'rainbow', frost: 'blue', items: { star: 4, spr: 1, plq: 1 } },
    { who: '👑', tiers: 3, flavor: 'choco', frost: 'white', pipe: 3, items: { cherry: 5, mac: 2, candle: 5, plq: 1 } }
  ];

  /* ---------- أدوات ---------- */
  function rgbOf(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
  function mixHex(a, b, t) { const A = rgbOf(a), B = rgbOf(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
  const SHC = new Map();
  function shade(h, f) {
    f = Math.round(clamp(f, -1, 1) * 60) / 60;
    const key = h + f; let s = SHC.get(key);
    if (!s) { const c = rgbOf(h), t = f > 0 ? 255 : 0, k = Math.abs(f); s = `rgb(${c.map(v => Math.round(v + (t - v) * k)).join(',')})`; SHC.set(key, s); }
    return s;
  }
  const rgba = (h, a) => { const c = rgbOf(h); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const easeBack = t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const cl01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const ri = n => Math.floor(Math.random() * n);
  function starPath(c, r, ri2 = .45, n = 5) {
    c.beginPath();
    for (let i = 0; i < n * 2; i++) { const a = -Math.PI / 2 + i * Math.PI / n, R = i % 2 ? r * ri2 : r; c.lineTo(Math.cos(a) * R, Math.sin(a) * R); }
    c.closePath();
  }
  function heartPath(c, s) {
    c.beginPath(); c.moveTo(0, s * .35);
    c.bezierCurveTo(-s * 1.1, -s * .3, -s * .55, -s * 1.05, 0, -s * .5);
    c.bezierCurveTo(s * .55, -s * 1.05, s * 1.1, -s * .3, 0, s * .35); c.closePath();
  }

  /* ---------- أشكال الكعكة (جدول نصف القطر حسب الزاوية) ---------- */
  const COSA = new Float32Array(NS), SINA = new Float32Array(NS);
  for (let k = 0; k < NS; k++) { COSA[k] = Math.cos(k / NS * TAU); SINA[k] = Math.sin(k / NS * TAU); }
  function rayTable(poly) {
    const t = new Float32Array(NS);
    for (let k = 0; k < NS; k++) {
      const dx = COSA[k], dz = SINA[k]; let best = 0;
      for (let i = 0; i < poly.length; i++) {
        const p = poly[i], q = poly[(i + 1) % poly.length], ex = q[0] - p[0], ez = q[1] - p[1];
        const den = dx * ez - dz * ex; if (Math.abs(den) < 1e-9) continue;
        const tt = (p[0] * ez - p[1] * ex) / den, s = (p[0] * dz - p[1] * dx) / den;
        if (s >= 0 && s <= 1 && tt > best) best = tt;
      }
      t[k] = best;
    }
    return t;
  }
  const SHP = {
    round: new Float32Array(NS).fill(1),
    square: Float32Array.from({ length: NS }, (_, k) => .9 * Math.pow(Math.pow(Math.abs(COSA[k]), 7) + Math.pow(Math.abs(SINA[k]), 7), -1 / 7)),
    star: Float32Array.from({ length: NS }, (_, k) => { const a = k / NS * TAU; return .64 + .4 * Math.pow((1 + Math.cos(5 * (a - Math.PI / 2))) / 2, 1.7); }),
    heart: (() => {
      const p = [];
      for (let i = 0; i < 400; i++) {
        const t = i / 400 * TAU, X = 16 * Math.pow(Math.sin(t), 3), Y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        p.push([X / 16 * 1.04, -(Y + 2.4) / 14.4]);
      }
      return rayTable(p);
    })()
  };
  function rAt(shape, a) {
    const tab = SHP[shape]; a = ((a % TAU) + TAU) % TAU;
    const f = a / TAU * NS, i = Math.floor(f) % NS, j = (i + 1) % NS, u = f - Math.floor(f);
    return tab[i] * (1 - u) + tab[j] * u;
  }
  const inside = (shape, x, z, R) => Math.hypot(x, z) <= R * rAt(shape, Math.atan2(z, x));
  function clampIn(shape, x, z, R) {
    const d = Math.hypot(x, z), m = R * rAt(shape, Math.atan2(z, x));
    if (d <= m || d < 1e-6) return [x, z];
    return [x / d * m, z / d * m];
  }

  /* ---------- الهندسة ---------- */
  const TR = [1, .7, .46], TH = [.58, .48, .4], BASE = .035;
  function tiersGeo(n) {
    let y = BASE; const g = [];
    for (let i = 0; i < n; i++) { g.push({ R: TR[i], y0: y, y1: y + TH[i] }); y += TH[i]; }
    return g;
  }
  const px = (V, x) => V.cx + x * V.S;
  const py = (V, y, z) => V.by - y * V.S + z * V.S * TILT;
  function frame(V, shape, R) {
    const tab = SHP[shape], c = Math.cos(V.th), s = Math.sin(V.th);
    const X = new Float32Array(NS), Z = new Float32Array(NS), NX = new Float32Array(NS), NZ = new Float32Array(NS);
    for (let k = 0; k < NS; k++) { const ux = tab[k] * COSA[k] * R, uz = tab[k] * SINA[k] * R; X[k] = ux * c - uz * s; Z[k] = ux * s + uz * c; }
    const front = [];
    for (let k = 0; k < NS; k++) {
      const k1 = (k + 1) % NS, dx = X[k1] - X[k], dz = Z[k1] - Z[k], l = Math.hypot(dx, dz) || 1;
      NX[k] = dz / l; NZ[k] = -dx / l;
      if (NZ[k] > -.02) front.push(k);
    }
    front.sort((a, b) => (Z[a] + Z[(a + 1) % NS]) - (Z[b] + Z[(b + 1) % NS]));
    return { X, Z, NX, NZ, front, R, shape };
  }
  const lightOf = (F, k) => F.NX[k] * -.55 + F.NZ[k] * .835;
  function sideBand(c, V, F, topY, botY, col, base = -.3, amp = .42, path) {
    const tf = typeof topY === 'function', bf = typeof botY === 'function';
    c.lineWidth = .9; c.lineJoin = 'round';
    for (const k of F.front) {
      const k1 = (k + 1) % NS, l = lightOf(F, k);
      let f = base + amp * cl01((l + .25) / 1.25); if (l > .9) f += (l - .9) * 2.2;
      const t0 = tf ? topY(k) : topY, t1 = tf ? topY(k1) : topY, b0 = bf ? botY(k) : botY, b1 = bf ? botY(k1) : botY;
      const ax = px(V, F.X[k]), bx = px(V, F.X[k1]);
      c.fillStyle = c.strokeStyle = shade(col, f);
      c.beginPath(); c.moveTo(ax, py(V, t0, F.Z[k])); c.lineTo(bx, py(V, t1, F.Z[k1])); c.lineTo(bx, py(V, b1, F.Z[k1])); c.lineTo(ax, py(V, b0, F.Z[k])); c.closePath();
      c.fill(); c.stroke();
      if (path) { path.moveTo(ax, py(V, t0, F.Z[k]) - .5); path.lineTo(bx, py(V, t1, F.Z[k1]) - .5); path.lineTo(bx, py(V, b1, F.Z[k1]) + .5); path.lineTo(ax, py(V, b0, F.Z[k]) + .5); path.closePath(); }
    }
  }
  function sidePath(V, F, y1, y0, p) {
    for (const k of F.front) {
      const k1 = (k + 1) % NS, ax = px(V, F.X[k]), bx = px(V, F.X[k1]);
      p.moveTo(ax, py(V, y1, F.Z[k]) - .5); p.lineTo(bx, py(V, y1, F.Z[k1]) - .5); p.lineTo(bx, py(V, y0, F.Z[k1]) + .5); p.lineTo(ax, py(V, y0, F.Z[k]) + .5); p.closePath();
    }
    return p;
  }
  function topPath(V, F, y, sc = 1) {
    const p = new Path2D();
    for (let k = 0; k < NS; k++) { const x = F.X[k] * sc, z = F.Z[k] * sc; k ? p.lineTo(px(V, x), py(V, y, z)) : p.moveTo(px(V, x), py(V, y, z)); }
    p.closePath(); return p;
  }
  /* تقطيرات الكريمة: مواضع ثابتة لكل طبقة */
  const DRIPS = [0, 1, 2].map(ti => {
    const R = rng(91 + ti * 17), n = 15 + ti * 0, out = [];
    for (let j = 0; j < n; j++) out.push({ k: (j + .15 + R() * .7) / n * NS, w: 1.5 + R() * 1.6, L: .25 + R() * .75 });
    return out;
  });
  function dripDepth(ti, k, band, Lmax, kk) {
    let d = 0;
    for (const dr of DRIPS[ti]) {
      let u = Math.abs(k - dr.k); if (u > NS / 2) u = NS - u; u /= dr.w;
      if (u < 1) d = Math.max(d, dr.L * Lmax * kk * Math.pow(1 - u * u, .35));
      else if (u < 1.9) d = Math.max(d, dr.L * Lmax * kk * .12 * (1.9 - u) / .9);
    }
    return band + d;
  }

  /* ---------- رسم طبقة الكعكة ---------- */
  function drawTier(c, V, g, F, ck, ti, T) {
    const h = g.y1 - g.y0, fl = FLAV[ck.flavor], S = V.S;
    const sp = new Path2D();
    // جسم الكيك (عارٍ)
    if (fl.layers) {
      const n = fl.layers.length;
      sidePath(V, F, g.y1, g.y0, sp);
      for (let j = 0; j < n; j++) sideBand(c, V, F, g.y1 - h * j / n, g.y1 - h * (j + 1) / n, fl.layers[j], -.28, .42);
      for (let j = 1; j < n; j++) sideBand(c, V, F, g.y1 - h * j / n + .008, g.y1 - h * j / n - .008, '#FFF6E8', -.2, .3);
    } else {
      sideBand(c, V, F, g.y1, g.y0, fl.side, -.3, .42, sp);
      for (const f of [.36, .7]) sideBand(c, V, F, g.y1 - h * f + .022, g.y1 - h * f - .022, '#FFF4E2', -.22, .32);
    }
    // تظليل عمودي
    const cx = V.cx, top = py(V, g.y1, -g.R * 1.1), bot = py(V, g.y0, g.R * 1.1);
    c.save(); c.clip(sp);
    let gr = c.createLinearGradient(0, py(V, g.y1, 0), 0, py(V, g.y0, g.R));
    gr.addColorStop(0, 'rgba(255,255,255,.14)'); gr.addColorStop(.45, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(70,20,10,.26)');
    c.fillStyle = gr; c.fillRect(cx - g.R * S * 1.6, top, g.R * S * 3.2, bot - top + 4);
    c.restore();
    // الكريمة
    const fr = ck.frost >= 0 ? FROST[ck.frost] : null, p = fr ? ck.pour : 0;
    const k1 = easeOut(cl01(p / .38)), k2 = easeOut(cl01((p - .2) / .55)), k3 = easeOut(cl01((p - .32) / .68));
    const band = .055, Lmax = Math.max(.05, h - band - .07), lip = fr ? .014 * k1 : 0;
    if (fr && k2 > 0) {
      sideBand(c, V, F, g.y1, k => Math.max(g.y0, g.y1 - (h + .03) * k2 + (k2 < 1 ? .025 * Math.sin(k * .55 + ti) * (1 - k2) : 0)), fr.coat, -.3, .44);
      c.save(); c.clip(sp);
      gr = c.createLinearGradient(0, py(V, g.y1, 0), 0, py(V, g.y0, g.R));
      gr.addColorStop(0, 'rgba(255,255,255,.1)'); gr.addColorStop(.5, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(90,30,30,.18)');
      c.fillStyle = gr; c.fillRect(cx - g.R * S * 1.6, top, g.R * S * 3.2, bot - top + 4);
      c.restore();
    }
    if (fr && k1 > .7) {
      const kk = cl01((k1 - .7) / .3);
      sideBand(c, V, F, g.y1 + lip, k => g.y1 - dripDepth(ti, k, band * kk, Lmax, k3), fr.c, -.26, .5);
      // نهايات التقطير
      if (k3 > .05) {
        for (const dr of DRIPS[ti]) {
          const k = Math.round(dr.k) % NS; if (F.NZ[k] < .12) continue;
          const k1b = (k + 1) % NS, seg = Math.hypot(F.X[k1b] - F.X[k], F.Z[k1b] - F.Z[k]);
          const rr = dr.w * seg * S * .62 * Math.sqrt(F.NZ[k]);
          const xx = px(V, F.X[k]), yy = py(V, g.y1 - band - dr.L * Lmax * k3, F.Z[k]) - rr * .35;
          const l = lightOf(F, k), f = -.26 + .5 * cl01((l + .25) / 1.25);
          const bg2 = c.createRadialGradient(xx - rr * .35, yy - rr * .3, rr * .1, xx, yy, rr * 1.1);
          bg2.addColorStop(0, shade(fr.c, f + .25)); bg2.addColorStop(1, shade(fr.c, f - .08));
          c.fillStyle = bg2; c.beginPath(); c.ellipse(xx, yy, rr, rr * 1.08, 0, 0, TAU); c.fill();
          c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(xx - rr * .35, yy - rr * .25, rr * .22, rr * .32, -.3, 0, TAU); c.fill();
          // لمعة طولية على التقطيرة
          c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = Math.max(1, rr * .25); c.lineCap = 'round';
          c.beginPath(); c.moveTo(xx - rr * .45, py(V, g.y1 - band * .6, F.Z[k])); c.lineTo(xx - rr * .45, yy - rr * .6); c.stroke();
        }
      }
      // لمعة الحافة
      c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = Math.max(1, S * .012); c.lineCap = 'round';
      c.beginPath();
      for (const k of F.front) { if (F.NZ[k] < .1) continue; const kb = (k + 1) % NS; c.moveTo(px(V, F.X[k]), py(V, g.y1 - band * .35, F.Z[k])); c.lineTo(px(V, F.X[kb]), py(V, g.y1 - band * .35, F.Z[kb])); }
      c.stroke();
    }
    // السطح العلوي
    const tp = topPath(V, F, g.y1);
    // نرسم السطح بالتدرج داخل مسقط مُحوَّل
    const fillTop = (path, col, light) => {
      c.save(); c.clip(path);
      c.translate(V.cx, py(V, g.y1, 0)); c.scale(1, TILT);
      const q = c.createRadialGradient(-g.R * S * .35, -g.R * S * .4, 0, -g.R * S * .1, 0, g.R * S * 1.25);
      q.addColorStop(0, shade(col, light)); q.addColorStop(.6, col); q.addColorStop(1, shade(col, -.16));
      c.fillStyle = q; c.fillRect(-g.R * S * 1.4, -g.R * S * 1.4, g.R * S * 2.8, g.R * S * 2.8);
      c.restore();
    };
    fillTop(tp, fl.layers ? fl.crust : fl.crust, .2);
    if (!fr || k1 < 1) { // ملمس الكيك المخبوز
      c.save(); c.clip(tp); const R = rng(7 + ti); c.fillStyle = 'rgba(120,60,20,.12)';
      for (let i = 0; i < 26; i++) { const a = R() * TAU, d = Math.sqrt(R()) * g.R * .9; c.beginPath(); c.ellipse(px(V, Math.cos(a) * d), py(V, g.y1, Math.sin(a) * d), S * .02, S * .01, 0, 0, TAU); c.fill(); }
      c.restore();
    }
    if (fr && k1 > 0) {
      const gp = topPath(V, F, g.y1 + lip, k1);
      fillTop(gp, fr.c, .3);
      // لمعان
      c.save(); c.clip(gp); c.translate(V.cx, py(V, g.y1, 0)); c.scale(1, TILT);
      const q = c.createRadialGradient(-g.R * S * .32, -g.R * S * .42, 0, -g.R * S * .32, -g.R * S * .42, g.R * S * .7);
      q.addColorStop(0, 'rgba(255,255,255,.55)'); q.addColorStop(.5, 'rgba(255,255,255,.15)'); q.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = q; c.fillRect(-g.R * S * 1.4, -g.R * S * 1.4, g.R * S * 2.8, g.R * S * 2.8);
      c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.ellipse(-g.R * S * .45, -g.R * S * .5, g.R * S * .16, g.R * S * .05, -.5, 0, TAU); c.fill();
      c.restore();
      if (k1 >= 1) { c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = Math.max(1, S * .008); c.stroke(gp); }
    } else {
      c.strokeStyle = rgba(fl.crust, .6); c.lineWidth = Math.max(1, S * .008); c.stroke(tp);
    }
  }
  /* ظل الطبقة على ما تحتها */
  function footShadow(c, V, F, y, sc) {
    const p = topPath(V, F, y, sc);
    c.save(); c.shadowColor = 'rgba(80,25,30,.4)'; c.shadowBlur = V.S * .1; c.shadowOffsetY = V.S * .02;
    c.fillStyle = 'rgba(80,25,30,.35)'; c.fill(p); c.restore();
  }

  /* ---------- الحامل ---------- */
  function drawStand(c, V, kind) {
    const S = V.S, cx = V.cx, RP = 1.25;
    const el = (y, r, z = 0) => [cx, py(V, y, z), r * S, r * S * TILT];
    if (kind !== 'plate') {
      // ظل على الطاولة
      let [x, y, rx, ry] = el(-.47, .9);
      let g = c.createRadialGradient(x, y, 0, x, y, rx);
      g.addColorStop(0, 'rgba(90,30,50,.32)'); g.addColorStop(1, 'rgba(90,30,50,0)');
      c.save(); c.translate(x, y); c.scale(1, TILT); c.translate(-x, -y); c.fillStyle = g; c.beginPath(); c.arc(x, y, rx, 0, TAU); c.fill(); c.restore();
      // القاعدة
      [x, y, rx, ry] = el(-.46, .56);
      g = c.createLinearGradient(x - rx, 0, x + rx, 0); g.addColorStop(0, '#F7EDF2'); g.addColorStop(.35, '#FFFFFF'); g.addColorStop(1, '#D8C3CF');
      c.fillStyle = g; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI); c.lineTo(x - rx, y - .05 * S); c.ellipse(x, y - .05 * S, rx, ry, 0, Math.PI, 0, true); c.closePath(); c.fill();
      [x, y, rx, ry] = el(-.41, .56);
      g = c.createLinearGradient(0, y - ry, 0, y + ry); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#EBDDE6');
      c.fillStyle = g; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill();
      // الساق
      const yb = py(V, -.41, 0), yt = py(V, -.05, 0);
      g = c.createLinearGradient(cx - .2 * S, 0, cx + .2 * S, 0); g.addColorStop(0, '#E9DCE4'); g.addColorStop(.3, '#FFFFFF'); g.addColorStop(.55, '#F4EAF0'); g.addColorStop(1, '#C9B2C0');
      c.fillStyle = g; c.beginPath();
      c.moveTo(cx - .36 * S, yb); c.bezierCurveTo(cx - .14 * S, yb - .03 * S, cx - .1 * S, yb - .12 * S, cx - .1 * S, (yb + yt) / 2);
      c.bezierCurveTo(cx - .1 * S, yt + .08 * S, cx - .2 * S, yt + .02 * S, cx - .26 * S, yt);
      c.lineTo(cx + .26 * S, yt); c.bezierCurveTo(cx + .2 * S, yt + .02 * S, cx + .1 * S, yt + .08 * S, cx + .1 * S, (yb + yt) / 2);
      c.bezierCurveTo(cx + .1 * S, yb - .12 * S, cx + .14 * S, yb - .03 * S, cx + .36 * S, yb); c.closePath(); c.fill();
      c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.ellipse(cx - .045 * S, (yb + yt) / 2, .018 * S, .1 * S, 0, 0, TAU); c.fill();
    } else {
      let [x, y, rx] = el(-.03, 1.45);
      const g = c.createRadialGradient(x, y, 0, x, y, rx);
      g.addColorStop(0, 'rgba(90,30,50,.28)'); g.addColorStop(1, 'rgba(90,30,50,0)');
      c.save(); c.translate(x, y); c.scale(1, TILT); c.translate(-x, -y); c.fillStyle = g; c.beginPath(); c.arc(x, y, rx, 0, TAU); c.fill(); c.restore();
    }
    // الصحن: الحافة
    let [x, y, rx, ry] = el(0, RP);
    const yd = .055 * S;
    let g = c.createLinearGradient(x - rx, 0, x + rx, 0); g.addColorStop(0, '#E7D6E0'); g.addColorStop(.3, '#FFFFFF'); g.addColorStop(.7, '#F1E4EC'); g.addColorStop(1, '#C8AFBF');
    c.fillStyle = g; c.beginPath(); c.ellipse(x, y + yd, rx * .985, ry * .985, 0, 0, Math.PI); c.lineTo(x - rx, y); c.ellipse(x, y, rx, ry, 0, Math.PI, 0, true); c.closePath(); c.fill();
    // السطح
    g = c.createLinearGradient(0, y - ry, 0, y + ry); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.6, '#FAF2F6'); g.addColorStop(1, '#EADAE4');
    c.fillStyle = g; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(214,180,200,.8)'; c.lineWidth = Math.max(1, S * .01); c.beginPath(); c.ellipse(x, y, rx * .9, ry * .9, 0, 0, TAU); c.stroke();
    // حافة مزخرفة (لؤلؤ)
    for (let i = 0; i < 44; i++) {
      const a = i / 44 * TAU, bx = x + Math.cos(a) * rx * .955, by = y + Math.sin(a) * ry * .955;
      c.fillStyle = Math.sin(a) > 0 ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.7)';
      c.beginPath(); c.arc(bx, by, S * .016, 0, TAU); c.fill();
      c.fillStyle = 'rgba(200,160,185,.35)'; c.beginPath(); c.arc(bx + S * .005, by + S * .006, S * .01, 0, TAU); c.fill();
    }
    // انعكاس
    c.save(); c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.clip();
    c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.ellipse(x - rx * .55, y + ry * .45, rx * .22, ry * .1, -.15, 0, TAU); c.fill();
    c.restore();
  }

  /* ---------- رسم الإضافات ---------- */
  function sphere(c, x, y, r, lt, md, dk, gl = .9) {
    const g = c.createRadialGradient(x - r * .35, y - r * .4, r * .05, x, y, r);
    g.addColorStop(0, lt); g.addColorStop(.5, md); g.addColorStop(1, dk);
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    c.fillStyle = `rgba(255,255,255,${gl})`; c.beginPath(); c.ellipse(x - r * .38, y - r * .42, r * .26, r * .15, -.6, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(x + r * .25, y + r * .5, r * .3, r * .12, -.3, 0, TAU); c.fill();
  }
  function itemDraw(c, k, v, u) {
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    switch (k) {
      case 'cherry': {
        const r = .078 * u, cy = -r;
        c.strokeStyle = '#5E7A1C'; c.lineWidth = .016 * u;
        c.beginPath(); c.moveTo(0, cy - r * .7); c.quadraticCurveTo(r * .2, cy - r * 2.2, r * 1.3, cy - r * 3); c.stroke();
        c.strokeStyle = 'rgba(200,230,120,.6)'; c.lineWidth = .005 * u; c.beginPath(); c.moveTo(-r * .03, cy - r * .9); c.quadraticCurveTo(r * .15, cy - r * 2.2, r * 1.2, cy - r * 2.95); c.stroke();
        c.save(); c.translate(r * 1.3, cy - r * 3); c.rotate(-.5);
        const lg = c.createLinearGradient(0, -r * .3, 0, r * .3); lg.addColorStop(0, '#A6E36A'); lg.addColorStop(1, '#3F8F2A');
        c.fillStyle = lg; c.beginPath(); c.ellipse(r * .5, 0, r * .55, r * .22, 0, 0, TAU); c.fill(); c.restore();
        sphere(c, 0, cy, r, '#FF8A9C', '#E3102F', '#6E0012', .95);
        c.fillStyle = 'rgba(70,0,10,.35)'; c.beginPath(); c.ellipse(0, cy - r * .78, r * .18, r * .08, 0, 0, TAU); c.fill();
        break;
      }
      case 'straw': {
        const s = u;
        c.beginPath(); c.moveTo(0, -.26 * s);
        c.bezierCurveTo(.05 * s, -.25 * s, .095 * s, -.12 * s, .085 * s, -.06 * s);
        c.bezierCurveTo(.075 * s, -.01 * s, -.075 * s, -.01 * s, -.085 * s, -.06 * s);
        c.bezierCurveTo(-.095 * s, -.12 * s, -.05 * s, -.25 * s, 0, -.26 * s); c.closePath();
        const g = c.createRadialGradient(-.03 * s, -.15 * s, .005 * s, 0, -.1 * s, .14 * s);
        g.addColorStop(0, '#FF8C8C'); g.addColorStop(.55, '#EE1E36'); g.addColorStop(1, '#8E0618');
        c.fillStyle = g; c.fill();
        c.save(); c.clip();
        for (let r = 0; r < 7; r++) for (let q = -3; q <= 3; q++) {
          const yy = -.23 * s + r * .03 * s, xx = (q + (r % 2) * .5) * .026 * s;
          c.fillStyle = 'rgba(255,230,140,.9)'; c.beginPath(); c.ellipse(xx, yy, .005 * s, .008 * s, 0, 0, TAU); c.fill();
          c.fillStyle = 'rgba(120,0,10,.35)'; c.beginPath(); c.arc(xx, yy + .01 * s, .005 * s, 0, TAU); c.fill();
        }
        c.restore();
        c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(-.04 * s, -.17 * s, .015 * s, .04 * s, .3, 0, TAU); c.fill();
        // الأوراق
        for (let i = -3; i <= 3; i++) {
          c.save(); c.translate(i * .022 * s, -.035 * s); c.rotate(i * .35);
          const lg = c.createLinearGradient(0, 0, 0, .05 * s); lg.addColorStop(0, '#4FAF34'); lg.addColorStop(1, '#2A7A1E');
          c.fillStyle = lg; c.beginPath(); c.moveTo(-.016 * s, 0); c.quadraticCurveTo(0, .06 * s, .016 * s, 0); c.closePath(); c.fill(); c.restore();
        }
        break;
      }
      case 'blue': {
        const r = .042 * u, cy = -r * .95;
        sphere(c, 0, cy, r, '#8E9EF2', '#3542A8', '#141B5E', .55);
        c.fillStyle = 'rgba(220,225,255,.22)'; c.beginPath(); c.arc(0, cy, r, 0, TAU); c.fill();
        c.save(); c.translate(0, cy - r * .45); c.scale(1, .55); c.fillStyle = '#1B1F4A'; starPath(c, r * .3, .45); c.fill(); c.restore();
        break;
      }
      case 'choc': {
        const cols = [['#7A4426', '#4A2210', '#2B1205'], ['#A8693F', '#7A4426', '#4E2610'], ['#FFF6E6', '#EAD6B6', '#C6A982']][v % 3];
        c.translate(0, -.005 * u); c.rotate(-.18);
        const w = .14 * u, h = .13 * u;
        c.save(); c.shadowColor = 'rgba(40,10,0,.35)'; c.shadowBlur = .02 * u; c.shadowOffsetY = .01 * u;
        c.fillStyle = cols[2]; c.beginPath(); c.roundRect(-w / 2 + .008 * u, -h + .006 * u, w, h, .014 * u); c.fill(); c.restore();
        const g = c.createLinearGradient(-w / 2, -h, w / 2, 0); g.addColorStop(0, shade(cols[0], .25)); g.addColorStop(.5, cols[0]); g.addColorStop(1, cols[1]);
        c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2, -h, w, h, .014 * u); c.fill();
        c.strokeStyle = cols[1]; c.lineWidth = .008 * u;
        c.beginPath(); c.moveTo(0, -h + .01 * u); c.lineTo(0, -.01 * u); c.moveTo(-w / 2 + .01 * u, -h / 2); c.lineTo(w / 2 - .01 * u, -h / 2); c.stroke();
        c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = .005 * u;
        c.beginPath(); c.moveTo(.006 * u, -h + .012 * u); c.lineTo(.006 * u, -.012 * u); c.moveTo(-w / 2 + .012 * u, -h / 2 + .006 * u); c.lineTo(w / 2 - .012 * u, -h / 2 + .006 * u); c.stroke();
        c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.roundRect(-w / 2 + .01 * u, -h + .01 * u, w * .35, .012 * u, .006 * u); c.fill();
        break;
      }
      case 'mac': {
        const col = ['#FFAACB', '#A8E6C4', '#C6B3FF', '#FFE08F', '#9CD3FF'][v % 5], w = .07 * u;
        const shell = (y, top) => {
          const g = c.createLinearGradient(0, y - .03 * u, 0, y + .02 * u); g.addColorStop(0, shade(col, .35)); g.addColorStop(1, shade(col, -.12));
          c.fillStyle = g; c.beginPath();
          if (top) { c.ellipse(0, y, w, .04 * u, 0, Math.PI, 0); c.ellipse(0, y, w, .012 * u, 0, 0, Math.PI); }
          else { c.ellipse(0, y, w, .03 * u, 0, 0, Math.PI); c.ellipse(0, y, w, .012 * u, 0, Math.PI, 0); }
          c.fill();
          // القدم المكشكشة
          c.fillStyle = shade(col, -.2);
          for (let i = -6; i <= 6; i++) { c.beginPath(); c.arc(i * w / 7, y + (top ? .006 : -.004) * u, .006 * u, 0, TAU); c.fill(); }
        };
        shell(-.032 * u, false);
        c.fillStyle = '#FFF8EC'; c.beginPath(); c.roundRect(-w * .92, -.06 * u, w * 1.84, .022 * u, .011 * u); c.fill();
        c.fillStyle = 'rgba(200,170,140,.4)'; c.fillRect(-w * .9, -.042 * u, w * 1.8, .004 * u);
        shell(-.07 * u, true);
        c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.ellipse(-w * .4, -.095 * u, w * .28, .008 * u, -.1, 0, TAU); c.fill();
        break;
      }
      case 'candy': {
        const col = ['#FF5C8A', '#4FB8FF', '#FFC531', '#7BD86A'][v % 4];
        c.translate(0, -.045 * u); c.rotate(-.2);
        for (const s of [-1, 1]) {
          const g = c.createLinearGradient(0, -.03 * u, 0, .03 * u); g.addColorStop(0, shade(col, .4)); g.addColorStop(1, shade(col, -.2));
          c.fillStyle = g; c.beginPath(); c.moveTo(s * .04 * u, 0); c.lineTo(s * .095 * u, -.035 * u); c.quadraticCurveTo(s * .082 * u, 0, s * .095 * u, .035 * u); c.closePath(); c.fill();
        }
        const g = c.createRadialGradient(-.015 * u, -.015 * u, .002 * u, 0, 0, .05 * u); g.addColorStop(0, shade(col, .5)); g.addColorStop(.6, col); g.addColorStop(1, shade(col, -.3));
        c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, .05 * u, .036 * u, 0, 0, TAU); c.fill();
        c.save(); c.clip(); c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = .009 * u;
        for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(i * .025 * u - .03 * u, -.05 * u); c.lineTo(i * .025 * u + .03 * u, .05 * u); c.stroke(); }
        c.restore();
        c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.ellipse(-.018 * u, -.018 * u, .014 * u, .006 * u, -.4, 0, TAU); c.fill();
        break;
      }
      case 'lolly': {
        const R = .08 * u, cy = -.22 * u;
        c.fillStyle = '#FFFFFF'; c.strokeStyle = '#E5CCD8'; c.lineWidth = .004 * u;
        c.beginPath(); c.roundRect(-.008 * u, cy, .016 * u, -cy, .008 * u); c.fill(); c.stroke();
        const sets = [['#FFE0F0', '#FF6FB5', '#C2307A', ['#FFFFFF', '#FFE45C', '#7FE3FF']], ['#E0F0FF', '#4FA8FF', '#1E5FC9', ['#FFFFFF', '#FF8AC4', '#FFE45C']], ['#FFF6D0', '#FFB52E', '#D9700A', ['#FFFFFF', '#FF5C8A', '#7BD86A']]][v % 3];
        const g = c.createRadialGradient(-R * .3, cy - R * .35, R * .05, 0, cy, R);
        g.addColorStop(0, sets[0]); g.addColorStop(.5, sets[1]); g.addColorStop(1, sets[2]);
        c.fillStyle = g; c.beginPath(); c.arc(0, cy, R, 0, TAU); c.fill();
        c.save(); c.beginPath(); c.arc(0, cy, R, 0, TAU); c.clip();
        for (let j = 0; j < 3; j++) {
          c.strokeStyle = sets[3][j]; c.globalAlpha = .8; c.lineWidth = R * .16; c.beginPath();
          for (let a = 0; a < 5 * Math.PI; a += .12) { const rr = R * a / (5 * Math.PI), aa = a + j * TAU / 3; c.lineTo(Math.cos(aa) * rr, cy + Math.sin(aa) * rr); }
          c.stroke();
        }
        c.restore(); c.globalAlpha = 1;
        c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.ellipse(-R * .38, cy - R * .42, R * .3, R * .15, -.6, 0, TAU); c.fill();
        break;
      }
      case 'flower': {
        const col = ['#FF9CC8', '#FFFFFF', '#C9A6FF', '#FFD36B', '#8FD0FF'][v % 5];
        c.translate(0, -.035 * u); c.scale(1, .7);
        c.save(); c.shadowColor = 'rgba(80,20,40,.3)'; c.shadowBlur = .02 * u; c.shadowOffsetY = .015 * u;
        for (let i = 0; i < 5; i++) {
          const a = i / 5 * TAU - Math.PI / 2;
          c.save(); c.rotate(a);
          const g = c.createLinearGradient(0, 0, .085 * u, 0); g.addColorStop(0, shade(col, -.15)); g.addColorStop(.6, col); g.addColorStop(1, shade(col, .4));
          c.fillStyle = g; c.beginPath(); c.ellipse(.045 * u, 0, .045 * u, .03 * u, 0, 0, TAU); c.fill();
          c.restore();
        }
        c.restore();
        for (let i = 0; i < 5; i++) { const a = i / 5 * TAU - Math.PI / 2; c.strokeStyle = shade(col, -.18); c.lineWidth = .004 * u; c.beginPath(); c.moveTo(Math.cos(a) * .02 * u, Math.sin(a) * .02 * u); c.lineTo(Math.cos(a) * .065 * u, Math.sin(a) * .065 * u); c.stroke(); }
        sphere(c, 0, 0, .022 * u, '#FFF3A0', '#FFC52E', '#D08A00', .7);
        break;
      }
      case 'heart': {
        const col = ['#FF3D63', '#FF85BE', '#A57CFF'][v % 3], s = .085 * u;
        c.translate(0, -.065 * u); c.rotate(-.12);
        c.save(); c.shadowColor = 'rgba(80,10,30,.35)'; c.shadowBlur = .02 * u; c.shadowOffsetY = .01 * u;
        heartPath(c, s); const g = c.createRadialGradient(-s * .35, -s * .45, s * .05, 0, -s * .1, s * 1.1);
        g.addColorStop(0, shade(col, .55)); g.addColorStop(.5, col); g.addColorStop(1, shade(col, -.35));
        c.fillStyle = g; c.fill(); c.restore();
        c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(-s * .42, -s * .5, s * .18, s * .1, -.6, 0, TAU); c.fill();
        break;
      }
      case 'star': {
        const set = [['#FFF2A0', '#FFC21F', '#C07A00'], ['#FFD6EC', '#FF6FB5', '#B02A72'], ['#D6F0FF', '#4FB2FF', '#1F5FB0']][v % 3], r = .08 * u;
        c.translate(0, -.075 * u); c.rotate(.12);
        c.save(); c.shadowColor = 'rgba(80,40,0,.35)'; c.shadowBlur = .02 * u; c.shadowOffsetY = .01 * u;
        starPath(c, r, .48); c.lineJoin = 'round'; c.lineWidth = r * .25; c.strokeStyle = set[1];
        const g = c.createRadialGradient(-r * .3, -r * .35, r * .05, 0, 0, r * 1.1); g.addColorStop(0, set[0]); g.addColorStop(.55, set[1]); g.addColorStop(1, set[2]);
        c.fillStyle = g; c.stroke(); c.fill(); c.restore();
        c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.ellipse(-r * .25, -r * .35, r * .2, r * .09, -.6, 0, TAU); c.fill();
        break;
      }
      case 'candle': {
        const cols = [['#FF8DC0', '#FFFFFF'], ['#6EC1FF', '#FFFFFF'], ['#FFE066', '#FF6FB5'], ['#8BE07A', '#FFFFFF'], ['#C7A6FF', '#FFF27A']][v % 5];
        const w = .034 * u, h = .22 * u;
        const g = c.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, shade(cols[0], -.1)); g.addColorStop(.35, shade(cols[0], .35)); g.addColorStop(1, shade(cols[0], -.3));
        c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2, -h, w, h, w * .3); c.fill();
        c.save(); c.beginPath(); c.roundRect(-w / 2, -h, w, h, w * .3); c.clip();
        c.fillStyle = cols[1]; c.globalAlpha = .85;
        for (let i = -2; i < 9; i++) { c.beginPath(); c.moveTo(-w, -i * .032 * u); c.lineTo(w, -i * .032 * u - .03 * u); c.lineTo(w, -i * .032 * u - .042 * u); c.lineTo(-w, -i * .032 * u - .012 * u); c.closePath(); c.fill(); }
        c.globalAlpha = 1;
        const g2 = c.createLinearGradient(-w / 2, 0, w / 2, 0); g2.addColorStop(0, 'rgba(0,0,0,.1)'); g2.addColorStop(.35, 'rgba(255,255,255,.25)'); g2.addColorStop(1, 'rgba(0,0,0,.25)');
        c.fillStyle = g2; c.fillRect(-w, -h, w * 2, h);
        c.restore();
        c.fillStyle = shade(cols[0], .4); c.beginPath(); c.ellipse(0, -h, w / 2, w * .2, 0, 0, TAU); c.fill();
        c.strokeStyle = '#3A2A20'; c.lineWidth = .006 * u; c.beginPath(); c.moveTo(0, -h); c.quadraticCurveTo(.004 * u, -h - .012 * u, 0, -h - .022 * u); c.stroke();
        break;
      }
      case 'plq': {
        const w = .5 * u, h = .2 * u, y0 = -.27 * u;
        c.fillStyle = '#E8B84A'; c.fillRect(-w * .3, y0 + h - .01 * u, .01 * u, .07 * u); c.fillRect(w * .3 - .01 * u, y0 + h - .01 * u, .01 * u, .07 * u);
        c.save(); c.shadowColor = 'rgba(90,40,20,.35)'; c.shadowBlur = .03 * u; c.shadowOffsetY = .015 * u;
        c.fillStyle = '#E9D2B0'; c.beginPath(); c.roundRect(-w / 2 + .006 * u, y0 + .008 * u, w, h, .04 * u); c.fill(); c.restore();
        const g = c.createLinearGradient(0, y0, 0, y0 + h); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#F6E6CC');
        c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2, y0, w, h, .04 * u); c.fill();
        c.strokeStyle = '#FF8DBF'; c.lineWidth = .008 * u; c.setLineDash([.012 * u, .01 * u]);
        c.beginPath(); c.roundRect(-w / 2 + .018 * u, y0 + .018 * u, w - .036 * u, h - .036 * u, .028 * u); c.stroke(); c.setLineDash([]);
        c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.roundRect(-w / 2 + .03 * u, y0 + .01 * u, w * .5, .012 * u, .006 * u); c.fill();
        c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'rtl';
        c.fillStyle = '#E0457F'; c.font = `800 ${.052 * u}px ${FONT}`; c.fillText('عيد ميلاد سعيد', 0, y0 + h * .36);
        const nm = App.profile ? App.profile.name : '';
        c.fillStyle = '#7A3E1E'; c.font = `900 ${.06 * u}px ${FONT}`; c.fillText(nm, 0, y0 + h * .7);
        break;
      }
      case 'spr': {
        const R = rng(5);
        for (let i = 0; i < 14; i++) {
          const a = R() * TAU, d = Math.sqrt(R()) * .075 * u;
          c.save(); c.translate(Math.cos(a) * d, -.05 * u + Math.sin(a) * d * .6); c.rotate(R() * TAU);
          c.fillStyle = SPR_COLS[i % SPR_COLS.length]; c.beginPath(); c.roundRect(-.016 * u, -.0055 * u, .032 * u, .011 * u, .0055 * u); c.fill();
          c.restore();
        }
        break;
      }
    }
    c.restore();
  }

  /* ---------- رسم الكريمة (كيس التزيين) ---------- */
  function blobDraw(c, tip, col, r) {
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    // ظل
    c.fillStyle = 'rgba(70,25,30,.22)'; c.beginPath(); c.ellipse(r * .12, r * .42, r * 1.0, r * .62, 0, 0, TAU); c.fill();
    // جانب التلّة
    c.fillStyle = shade(col, -.3); c.beginPath(); c.ellipse(0, r * .22, r * .96, r * .74, 0, 0, TAU); c.fill();
    if (tip === 'star') {
      const g = c.createRadialGradient(-r * .3, -r * .35, 0, 0, 0, r);
      g.addColorStop(0, shade(col, .4)); g.addColorStop(.6, col); g.addColorStop(1, shade(col, -.2));
      c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, r * .94, r * .78, 0, 0, TAU); c.fill();
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * TAU + .2, lit = Math.cos(a - 3.9);
        c.save(); c.scale(1, .82); c.rotate(a);
        const pg = c.createLinearGradient(0, -r * .2, 0, r * .2);
        pg.addColorStop(0, shade(col, .28 + lit * .18)); pg.addColorStop(1, shade(col, -.12 + lit * .12));
        c.fillStyle = pg; c.beginPath(); c.ellipse(r * .5, 0, r * .45, r * .19, .45, 0, TAU); c.fill();
        c.strokeStyle = shade(col, -.22); c.lineWidth = r * .045; c.stroke();
        c.restore();
      }
      c.fillStyle = shade(col, .2); c.beginPath(); c.arc(0, -r * .04, r * .24, 0, TAU); c.fill();
      c.strokeStyle = shade(col, -.15); c.lineWidth = r * .05; c.beginPath(); c.arc(0, -r * .04, r * .15, .5, 5); c.stroke();
      c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.ellipse(-r * .35, -r * .38, r * .14, r * .07, -.5, 0, TAU); c.fill();
    } else if (tip === 'dot') {
      const g = c.createRadialGradient(-r * .35, -r * .45, r * .02, 0, 0, r * 1.05);
      g.addColorStop(0, shade(col, .55)); g.addColorStop(.55, col); g.addColorStop(1, shade(col, -.25));
      c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, r * .95, r * .85, 0, 0, TAU); c.fill();
      // قمّة صغيرة
      c.fillStyle = shade(col, .15); c.beginPath(); c.moveTo(-r * .3, -r * .35); c.quadraticCurveTo(0, -r * 1.25, r * .3, -r * .35); c.closePath(); c.fill();
      c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.ellipse(-r * .38, -r * .38, r * .2, r * .12, -.6, 0, TAU); c.fill();
    } else if (tip === 'ruffle') {
      const g = c.createLinearGradient(0, -r * .8, 0, r * .6);
      g.addColorStop(0, shade(col, .35)); g.addColorStop(.6, col); g.addColorStop(1, shade(col, -.2));
      c.fillStyle = g; c.beginPath(); c.moveTo(-r * .2, r * .45);
      for (let i = 0; i <= 8; i++) { const a = Math.PI + i / 8 * Math.PI, rr = r * (i % 2 ? 1.02 : .9); c.lineTo(Math.cos(a) * rr * .55, Math.sin(a) * rr * .85 + r * .1); }
      c.lineTo(r * .2, r * .45); c.closePath(); c.fill();
      for (let i = 1; i < 8; i++) {
        const a = Math.PI + i / 8 * Math.PI, ex = Math.cos(a) * r * .5, ey = Math.sin(a) * r * .78 + r * .1;
        c.strokeStyle = shade(col, i % 2 ? -.2 : .3); c.lineWidth = r * (i % 2 ? .07 : .09);
        c.beginPath(); c.moveTo(0, r * .38); c.lineTo(ex, ey); c.stroke();
      }
    } else { // swirl
      const g = c.createRadialGradient(-r * .3, -r * .35, 0, 0, 0, r);
      g.addColorStop(0, shade(col, .35)); g.addColorStop(.65, col); g.addColorStop(1, shade(col, -.22));
      c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, r * .95, r * .8, 0, 0, TAU); c.fill();
      c.save(); c.scale(1, .84);
      for (const [off, col2, lw] of [[r * .03, shade(col, -.28), .1], [-r * .025, shade(col, .4), .07]]) {
        c.strokeStyle = col2; c.lineWidth = r * lw; c.beginPath();
        for (let a = 0; a < 5.4 * Math.PI; a += .15) { const rr = r * .88 * (1 - a / (5.4 * Math.PI)); c.lineTo(Math.cos(a) * rr + off, Math.sin(a) * rr + off); }
        c.stroke();
      }
      c.restore();
      c.fillStyle = shade(col, .3); c.beginPath(); c.moveTo(-r * .16, -r * .05); c.quadraticCurveTo(r * .05, -r * .7, r * .12, -r * .02); c.closePath(); c.fill();
      c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.ellipse(-r * .4, -r * .32, r * .13, r * .07, -.5, 0, TAU); c.fill();
    }
    c.restore();
  }

  /* ---------- ذاكرة الصور الجاهزة ---------- */
  let SPR = new Map();
  function itemSprite(k, v, u, pr) {
    const e = TOP[k].e, P = Math.max(8, Math.round(u * pr / 3) * 3), key = 'i' + k + v + '|' + P;
    let s = SPR.get(key);
    if (!s) {
      if (SPR.size > 500) SPR = new Map();
      const sz = 2 * e * P; s = mk(sz, sz); const x = s.getContext('2d');
      x.translate(sz / 2, sz * .8); itemDraw(x, k, v, P); SPR.set(key, s);
    }
    return s;
  }
  function blobSprite(tip, col, r, pr) {
    const P = Math.max(4, Math.round(r * pr / 2) * 2), key = 'b' + tip + col + '|' + P;
    let s = SPR.get(key);
    if (!s) {
      if (SPR.size > 500) SPR = new Map();
      const sz = P * 2.8; s = mk(sz, sz); const x = s.getContext('2d');
      x.translate(sz / 2, sz * .45); blobDraw(x, tip, col, P); SPR.set(key, s);
    }
    return s;
  }

  /* ---------- رسم المشهد ---------- */
  function decorLists(ck, V, G, T) {
    const n = G.length, back = G.map(() => []), front = G.map(() => []);
    const c = Math.cos(V.th), s = Math.sin(V.th);
    const put = (ti, o) => { (ti < n - 1 && o.z < 0 ? back : (ti < n - 1 ? front : back))[ti].push(o); };
    for (const p of ck.pipes) {
      if (p.tier >= n) continue;
      const y = G[p.tier].y1 + .012, tp = TIPS.find(t => t.id === p.tip);
      for (const b of p.pts) {
        const x = b.x * c - b.z * s, z = b.x * s + b.z * c;
        put(p.tier, { t: 'b', p, b, x, z, sx: px(V, x), sy: py(V, y, z), r: tp.r });
      }
    }
    for (const it of ck.tops) {
      if (it.tier >= n) continue;
      const y = G[it.tier].y1 + .012, x = it.x * c - it.z * s, z = it.x * s + it.z * c;
      put(it.tier, { t: 'i', it, x, z, sx: px(V, x), sy: py(V, y, z) });
    }
    for (const L of back) L.sort((a, b) => a.sy - b.sy);
    for (const L of front) L.sort((a, b) => a.sy - b.sy);
    return { back, front };
  }
  function drawDecor(c, V, list, T, pr, th) {
    const S = V.S;
    for (const o of list) {
      const ps = 1 + .1 * o.z;
      if (o.t === 'b') {
        const rr = o.r * S * ps, spr = blobSprite(o.p.tip, o.p.col, o.r * S, pr), sz = rr * 2.8;
        const age = T - (o.b.t0 || -9), sq = age < .25 ? 1 + .35 * Math.sin(age / .25 * Math.PI) * (1 - age / .25) : 1;
        if (o.p.tip === 'ruffle') {
          const a = o.b.a + th, ang = Math.atan2(Math.sin(a) * TILT, Math.cos(a));
          c.save(); c.translate(o.sx, o.sy); c.rotate(ang + Math.PI / 2 * 0); c.scale(sq, 1 / sq);
          c.drawImage(spr, -sz / 2, -sz * .45, sz, sz); c.restore();
        } else if (sq !== 1) {
          c.save(); c.translate(o.sx, o.sy); c.scale(sq, 1 / sq); c.drawImage(spr, -sz / 2, -sz * .45 - rr * .15, sz, sz); c.restore();
        } else c.drawImage(spr, o.sx - sz / 2, o.sy - sz * .45 - rr * .15, sz, sz);
        continue;
      }
      const it = o.it, d = TOP[it.k], age = T - it.t0;
      if (age < 0) continue;
      if (it.k === 'spr') { drawSprinkle(c, V, o, age); continue; }
      let dy = 0, sx = 1, sy = 1;
      if (age < .5) {
        const k = age / .5;
        if (k < .55) dy = -(1 - easeOut(k / .55) * 0 - (k / .55) * (k / .55)) * S * .5;
        else { const q = (k - .55) / .45; sx = 1 + .22 * Math.sin(q * Math.PI) * (1 - q); sy = 1 / sx; }
      }
      const u = S * ps, spr = itemSprite(it.k, it.v, S, pr), sz = 2 * d.e * u;
      // ظل التلامس
      if (it.k !== 'flower') {
        c.fillStyle = 'rgba(70,25,30,.22)'; c.beginPath(); c.ellipse(o.sx + u * .01, o.sy + u * .006, d.e * u * .55, d.e * u * .2, 0, 0, TAU); c.fill();
      }
      c.save(); c.translate(o.sx, o.sy + dy);
      if (it.rot && it.k !== 'plq' && it.k !== 'candle') c.rotate(it.rot);
      c.scale(sx, sy);
      c.drawImage(spr, -sz / 2, -sz * .8, sz, sz);
      c.restore();
      if (it.k === 'candle' && it.lit && age >= .5) drawFlame(c, o.sx, o.sy - .245 * u, u, T, it.id);
    }
  }
  function drawSprinkle(c, V, o, age) {
    const S = V.S, it = o.it;
    let dy = 0;
    if (age < .35) { const k = age / .35; dy = -(1 - k * k) * S * .9; }
    c.save(); c.translate(o.sx, o.sy + dy); c.scale(1, age < .35 ? 1 : TILT * 1.6); c.rotate(it.rot);
    c.fillStyle = SPR_COLS[it.v % SPR_COLS.length];
    if (it.v2) { c.beginPath(); c.arc(0, 0, S * .009, 0, TAU); c.fill(); }
    else { c.beginPath(); c.roundRect(-S * .018, -S * .006, S * .036, S * .012, S * .006); c.fill(); c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(-S * .012, -S * .004, S * .02, S * .003); }
    c.restore();
  }
  function drawFlame(c, x, y, u, T, seed) {
    const f = 1 + .12 * Math.sin(T * 23 + seed) + .08 * Math.sin(T * 37 + seed * 2), sw = Math.sin(T * 11 + seed) * .06;
    const g0 = c.createRadialGradient(x, y - .02 * u, 0, x, y - .02 * u, .12 * u);
    g0.addColorStop(0, 'rgba(255,220,120,.45)'); g0.addColorStop(1, 'rgba(255,200,80,0)');
    c.fillStyle = g0; c.beginPath(); c.arc(x, y - .02 * u, .12 * u, 0, TAU); c.fill();
    c.save(); c.translate(x, y); c.rotate(sw); c.scale(1, f);
    const h = .07 * u, w = .022 * u;
    const g = c.createRadialGradient(0, -h * .25, 0, 0, -h * .3, h * .8);
    g.addColorStop(0, '#FFFFF0'); g.addColorStop(.35, '#FFE45C'); g.addColorStop(.75, '#FF8A1F'); g.addColorStop(1, 'rgba(255,90,20,.2)');
    c.fillStyle = g; c.beginPath(); c.moveTo(0, -h); c.bezierCurveTo(w * 1.4, -h * .4, w * 1.2, 0, 0, 0); c.bezierCurveTo(-w * 1.2, 0, -w * 1.4, -h * .4, 0, -h); c.fill();
    c.fillStyle = 'rgba(120,170,255,.55)'; c.beginPath(); c.ellipse(0, -h * .1, w * .45, h * .14, 0, 0, TAU); c.fill();
    c.restore();
  }
  function drawScene(c, V, ck, o = {}) {
    const G = tiersGeo(ck.tiers), T = o.T == null ? 99 : o.T, pr = o.pr || 1;
    if (o.stand !== false) drawStand(c, V, o.stand);
    const frames = G.map(g => frame(V, ck.shape, g.R));
    const D = o.decor === false ? null : decorLists(ck, V, G, T);
    for (let i = 0; i < G.length; i++) {
      footShadow(c, V, frames[i], G[i].y0, 1.02);
      drawTier(c, V, G[i], frames[i], ck, i, T);
      if (D) drawDecor(c, V, D.back[i], T, pr, V.th);
    }
    if (D) for (let i = G.length - 1; i >= 0; i--) drawDecor(c, V, D.front[i], T, pr, V.th);
  }
  /* شريحة كعكة مقطوعة (معاينة الطبقات) */
  function drawSlice(c, x, y, w, flavor, frostI) {
    const fl = FLAV[flavor], h = w * .62, fr = frostI >= 0 ? FROST[frostI] : null;
    const L2x = x - w * .22, L2y = y - w * .36;
    // ظل
    c.fillStyle = 'rgba(90,30,50,.2)'; c.beginPath(); c.ellipse(x + w * .45, y + h + w * .06, w * .75, w * .12, 0, 0, TAU); c.fill();
    // الوجه الجانبي (القشرة الخارجية)
    c.fillStyle = fr ? shade(fr.coat, -.18) : shade(fl.side, -.22);
    c.beginPath(); c.moveTo(x, y); c.lineTo(L2x, L2y); c.lineTo(L2x, L2y + h); c.lineTo(x, y + h); c.closePath(); c.fill();
    // الوجه المقطوع
    const layers = fl.layers || [fl.side, fl.side, fl.side];
    const n = layers.length, lh = h / n;
    for (let j = 0; j < n; j++) {
      const g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, shade(layers[j], .12)); g.addColorStop(1, shade(layers[j], -.1));
      c.fillStyle = g; c.fillRect(x, y + j * lh, w, lh + .5);
      // ثقوب الإسفنج
      const R = rng(j * 13 + 3); c.fillStyle = rgba('#000000', .07);
      for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(x + R() * w, y + j * lh + R() * lh, w * .012 + R() * w * .01, 0, TAU); c.fill(); }
      if (j > 0) { c.fillStyle = '#FFF6E6'; c.fillRect(x, y + j * lh - w * .018, w, w * .036); }
    }
    if (fr) { c.fillStyle = fr.coat; c.fillRect(x - .5, y, w * .045, h); c.fillStyle = fr.c; c.fillRect(x - .5, y - w * .02, w * .06, h * .35); }
    // الوجه العلوي
    c.fillStyle = fr ? fr.c : fl.crust;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y); c.lineTo(L2x, L2y); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(x + w * .1, y - w * .03); c.lineTo(x + w * .55, y - w * .03); c.lineTo(L2x + w * .12, L2y + w * .08); c.closePath(); c.fill();
    if (fr) { // تقطير فوق الوجه المقطوع
      c.fillStyle = fr.c; c.beginPath(); c.moveTo(x, y - 1);
      for (let i = 0; i <= 10; i++) { const xx = x + w * i / 10, dd = (i % 3 === 1 ? .2 : i % 3 === 2 ? .1 : .06) * h; c.lineTo(xx, y + dd); }
      c.lineTo(x + w, y - 1); c.closePath(); c.fill();
    }
    c.strokeStyle = 'rgba(90,40,20,.25)'; c.lineWidth = 1.2; c.strokeRect(x, y, w, h);
  }

  /* ---------- الواجهة ---------- */
  App.css(`
  #cake{background:#FFE6EF;overflow:hidden}
  #cake canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #cake .bar{gap:6px;padding-left:10px;padding-right:10px}
  #cake .ib{color:#D63F7A}
  #cake .ib[disabled]{opacity:.45}
  #cake .chip{color:#8A2D55;min-width:56px;padding:3px 10px}
  #cake .chip b{color:#E0457F;font-size:17px}
  #cake .panel{border-color:#FFD3E6;box-shadow:0 8px 0 #FF9CC6,0 20px 40px rgba(120,20,70,.3);color:#7A2A4E}
  #cake .panel h3{color:#E0457F}
  #cake .btn{background:linear-gradient(#FF86BD,#FF4F98);box-shadow:0 4px 0 #C4246A}
  #cake .btn:active{box-shadow:0 1px 0 #C4246A}
  #cake .btn.alt{background:#fff;color:#D63F7A;box-shadow:0 4px 0 #FFB8D6;border-color:#FFD6E8}
  #cake .btn.ok{background:linear-gradient(#7FE0A8,#2FBF71);box-shadow:0 4px 0 #1E8C50}
  #cake .overlay{background:rgba(110,30,70,.38)}
  #cake .order{position:absolute;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 52px);width:min(calc(100% - 16px),470px);display:none;align-items:center;gap:8px;z-index:4;pointer-events:none}
  #cake .order.on{display:flex}
  #cake .order.pop{animation:ckIn .5s cubic-bezier(.3,1.5,.6,1)}
  @keyframes ckIn{0%{opacity:0;transform:translateX(-50%) translateY(-20px) scale(.8)}100%{opacity:1;transform:translateX(-50%)}}
  #cake .cust{flex:0 0 58px;height:58px;border-radius:50%;font-size:36px;display:grid;place-items:center;font-family:${EMO};
    background:radial-gradient(circle at 35% 30%,#FFFFFF,#FFE3F0 60%,#FFC2DC);box-shadow:0 3px 0 #F3A9C9,0 6px 14px rgba(120,20,70,.18);border:3px solid #fff;animation:ckBob 2.4s ease-in-out infinite}
  @keyframes ckBob{50%{transform:translateY(-3px) rotate(-4deg)}}
  #cake .bub{flex:1;position:relative;background:#fff;border-radius:18px;padding:4px 10px 6px;box-shadow:0 3px 0 #F3C0D6,0 6px 14px rgba(120,20,70,.15);min-height:48px}
  #cake .bub::after{content:'';position:absolute;right:-9px;top:18px;border-top:8px solid transparent;border-bottom:8px solid transparent;border-left:10px solid #fff}
  #cake .bub .ot{font-size:12.5px;font-weight:900;color:#E0457F;line-height:1.4}
  #cake .reqs{display:flex;flex-wrap:wrap;gap:3px 4px}
  #cake .rq{display:inline-flex;align-items:center;gap:2px;background:#FFF1F7;border-radius:99px;padding:0 7px 0 4px;font-weight:800;font-size:12px;color:#8A2D55;border:2px solid #FFE0EE;line-height:1.55;direction:rtl}
  #cake .rq img{width:22px;height:22px}
  #cake .rq i{font-style:normal;display:inline-block;width:14px;height:14px;border-radius:50%;box-shadow:inset 0 -2px 0 rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.08)}
  #cake .rq bdi{direction:ltr;unicode-bidi:isolate}
  #cake .rq.ok{background:#E6FBEE;border-color:#86DCA6;color:#1E7A45}
  #cake .rq.ok::after{content:'✓';font-weight:900;color:#1FA35A}
  #cake .tools{position:absolute;left:10px;display:none;flex-direction:column;gap:10px;z-index:4}
  #cake .tools.on{display:flex}
  #cake .dock{position:absolute;left:0;right:0;bottom:0;z-index:5;display:flex;flex-direction:column;align-items:center;padding:0 8px max(8px,env(safe-area-inset-bottom));pointer-events:none}
  #cake .tipl{margin-bottom:7px;background:rgba(255,255,255,.9);color:#8A2D55;font-weight:800;font-size:14px;padding:3px 14px;border-radius:99px;box-shadow:0 2px 0 rgba(200,80,130,.2);max-width:94%;text-align:center;transition:opacity .3s}
  #cake .tray{pointer-events:auto;width:min(100%,760px);height:138px;background:linear-gradient(rgba(255,255,255,.96),rgba(255,243,249,.96));border-radius:26px;
    box-shadow:0 6px 0 #F6B8D2,0 12px 26px rgba(120,20,70,.2);padding:6px 4px;position:relative;overflow:hidden;border:3px solid #fff}
  #cake .pane{display:none;height:100%;flex-direction:column;justify-content:center;gap:4px}
  #cake .pane.on{display:flex;animation:fade .25s}
  #cake .row{display:flex;gap:7px;overflow-x:auto;overflow-y:hidden;justify-content:safe center;padding:3px 6px 5px;touch-action:pan-x;scrollbar-width:none;align-items:center}
  #cake .row::-webkit-scrollbar,#cake .grid2::-webkit-scrollbar{display:none}
  #cake .op{flex:0 0 auto;width:58px;height:58px;border-radius:18px;background:linear-gradient(#FFFFFF,#FFF0F6);box-shadow:0 3px 0 #F4C0D6;display:flex;flex-direction:column;align-items:center;justify-content:center;
    font-size:10.5px;font-weight:800;color:#8A2D55;line-height:1.05;position:relative;border:2px solid #FFE6F0;touch-action:pan-x;padding:0;user-select:none;-webkit-user-select:none}
  #cake .op img{width:40px;height:40px;pointer-events:none;-webkit-user-drag:none}
  #cake .op.on{border-color:#FF5FA2;background:linear-gradient(#FFF3F9,#FFD6E9);box-shadow:0 3px 0 #FF8CC0}
  #cake .op:active{transform:translateY(2px)}
  #cake .op.wide{width:78px;height:112px;font-size:13.5px;border-radius:22px}
  #cake .op.wide img{width:66px;height:66px;margin-bottom:4px}
  #cake .op.mid{width:66px;height:62px}
  #cake .op.mid img{width:46px;height:42px}
  #cake .sw{flex:0 0 auto;width:46px;height:46px;border-radius:50%;padding:0;background:radial-gradient(circle at 34% 28%,rgba(255,255,255,.95) 0,var(--c) 36%,var(--d) 100%);
    box-shadow:0 3px 0 var(--d),0 4px 8px rgba(0,0,0,.12);border:3px solid #fff;transition:transform .15s}
  #cake .sw.on{transform:scale(1.14);box-shadow:0 0 0 3px #FF5FA2,0 3px 0 var(--d)}
  #cake .sw.sm{width:38px;height:38px}
  #cake .sep{flex:0 0 2px;align-self:stretch;background:#FFD6E8;border-radius:2px;margin:6px 2px}
  #cake .grid2{display:grid;grid-auto-flow:column;grid-template-rows:repeat(2,56px);gap:6px;overflow-x:auto;overflow-y:hidden;justify-content:safe center;padding:2px 6px;touch-action:pan-x;scrollbar-width:none}
  #cake .grid2 .op{width:56px;height:56px}
  #cake .grid2 .op img{width:36px;height:36px}
  #cake .steps{pointer-events:auto;display:flex;align-items:flex-start;gap:2px;width:min(100%,760px);margin-top:9px;padding:0 2px}
  #cake .st{flex:1;display:flex;flex-direction:column;align-items:center;gap:1px;font-size:10.5px;font-weight:800;color:#A0587A;background:none;min-width:0;padding:0}
  #cake .st i{font-style:normal;width:36px;height:36px;border-radius:50%;background:#fff;display:grid;place-items:center;font-size:18px;box-shadow:0 2px 0 #F0BCD2;position:relative;transition:transform .2s;font-family:${EMO}}
  #cake .st.on i{background:linear-gradient(#FFA3CF,#FF4F98);box-shadow:0 3px 0 #C4246A;transform:scale(1.14)}
  #cake .st.on{color:#E0457F}
  #cake .st.done i::after{content:'✓';position:absolute;bottom:-3px;left:-3px;width:15px;height:15px;border-radius:50%;background:#2FBF71;color:#fff;font-size:10px;line-height:15px;font-weight:900;font-family:${FONT};box-shadow:0 0 0 2px #fff}
  #cake .nx{flex:0 0 auto;align-self:center;padding:8px 15px;border-radius:99px;background:linear-gradient(#7FE0A8,#2FBF71);color:#fff;font-weight:900;font-size:16px;box-shadow:0 4px 0 #1E8C50;margin-inline-start:4px;white-space:nowrap}
  #cake .nx:active{transform:translateY(3px);box-shadow:0 1px 0 #1E8C50}
  #cake .nx.hide{visibility:hidden}
  #cake .fin{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;height:100%;text-align:center}
  #cake .fin .res{display:flex;align-items:center;gap:8px;font-weight:900;color:#7A2A4E;font-size:15px;line-height:1.2}
  #cake .fin .res .em{font-size:34px;font-family:${EMO}}
  #cake .fin .stars3{font-size:26px;margin:0;letter-spacing:2px}
  #cake .fin .btns{display:flex;flex-wrap:wrap;justify-content:center}
  #cake .fin .btn{padding:7px 14px;font-size:15px;margin:3px}
  #cake .lvp{width:min(94vw,440px);max-height:88vh;overflow-y:auto;touch-action:pan-y;background:linear-gradient(#FFF8FB,#FFEFF6)}
  #cake .mbig{display:flex;gap:10px;margin:8px 0 4px}
  #cake .mbig button{flex:1;border-radius:20px;padding:9px 6px;font-weight:900;font-size:17px;display:flex;flex-direction:column;align-items:center;gap:1px}
  #cake .mbig .f{background:linear-gradient(#FFE3F0,#FFC7E0);color:#B0156A;box-shadow:0 4px 0 #FF8CC6}
  #cake .mbig .g{background:linear-gradient(#E3F3FF,#BFE0FF);color:#1F4F8F;box-shadow:0 4px 0 #7FB5EE}
  #cake .mbig button.on{outline:3px solid #FF4F98;outline-offset:2px}
  #cake .mbig span{font-size:28px;font-family:${EMO};line-height:1.1}
  #cake .mbig small{font-size:12px;font-weight:700;opacity:.8}
  #cake .lvh{font-weight:900;margin:10px 0 0;color:#B0156A}
  #cake .lvg{display:grid;grid-template-columns:repeat(5,1fr);gap:14px 8px;margin:8px 2px 16px}
  #cake .lvb{position:relative;aspect-ratio:1;border-radius:18px;background:linear-gradient(#FFFFFF,#FFE6F1);box-shadow:0 4px 0 #F4B5D0,0 6px 10px rgba(120,20,70,.12);display:flex;flex-direction:column;align-items:center;justify-content:center;color:#8A2D55;font-weight:900;padding:0}
  #cake .lvb:active{transform:translateY(3px)}
  #cake .lvb .e{font-size:26px;line-height:1;font-family:${EMO}}
  #cake .lvb .n{position:absolute;top:1px;right:6px;font-size:11px;opacity:.7}
  #cake .lvb .s{position:absolute;bottom:-8px;font-size:12px;letter-spacing:-2px;line-height:1}
  #cake .lvb .s i{font-style:normal}
  #cake .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #cake .lvb.cur{outline:3px dashed #FF4F98;outline-offset:3px}
  #cake .lvb.lock{background:linear-gradient(#F3ECF1,#E2D6DF);box-shadow:0 4px 0 #CDBCC9;color:#9C8A99}
  #cake .lvb.lock .e{filter:grayscale(1);opacity:.35}
  #cake .lvb.lock::after{content:'🔒';position:absolute;bottom:-7px;font-size:15px}
  #cake .gal{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:10px 0 14px}
  #cake .gal img{width:100%;aspect-ratio:1;border-radius:16px;border:3px solid #fff;box-shadow:0 3px 0 #F4B5D0,0 6px 12px rgba(120,20,70,.15);background:#FFE6EF;display:block}
  #cake .gal .empty{grid-column:1/-1;opacity:.75;padding:18px 0;font-weight:700}
  #cake .pimg{width:100%;border-radius:18px;border:3px solid #FFE0EE;display:block;margin:6px 0 4px;background:#FFE6EF}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib modeb" aria-label="الطلبات">📋</button>
      <button class="ib galb" aria-label="المعرض">🖼️</button>
      <span class="grow"></span>
      <div class="chip"><small class="mL">الوضع</small><b class="mV">حر</b></div>
      <div class="chip"><small>كعكاتي</small><b class="cN">0</b></div>
    </div>
    <div class="order"><div class="cust">🧒</div><div class="bub"><div class="ot"></div><div class="reqs"></div></div></div>
    <div class="tools"><button class="ib undo" aria-label="تراجع">↩️</button><button class="ib clr" aria-label="مسح الزينة">🗑️</button></div>
    <div class="dock">
      <div class="tipl"></div>
      <div class="tray"></div>
      <div class="steps"></div>
    </div>
    <div class="overlay" id="ckMode"><div class="panel lvp"><h3>🎂 زينة الكيك</h3>
      <div class="mbig"><button class="f" data-m="free"><span>🎨</span>حر<small class="fs"></small></button><button class="g" data-m="orders"><span>📋</span>طلبات<small class="gs"></small></button></div>
      <div class="lvh">📋 طلبات الزبائن</div>
      <div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="ckGal"><div class="panel lvp"><h3>🖼️ معرض الكعكات</h3><div class="gal"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="ckPic"><div class="panel"><h3>📸 صورة كعكتك</h3><img class="pimg" alt=""><p class="pp"></p>
      <button class="btn" data-a="close">👍 حسنًا</button></div></div>`);
  const cv = root.querySelector('canvas.sc'), bar = root.querySelector('.bar');
  const orderEl = root.querySelector('.order'), custEl = root.querySelector('.cust'), otEl = root.querySelector('.ot'), reqsEl = root.querySelector('.reqs');
  const toolsEl = root.querySelector('.tools'), undoB = root.querySelector('.undo'), clrB = root.querySelector('.clr');
  const tipEl = root.querySelector('.tipl'), tray = root.querySelector('.tray'), stepsEl = root.querySelector('.steps');
  const modeOv = root.querySelector('#ckMode'), galOv = root.querySelector('#ckGal'), picOv = root.querySelector('#ckPic');
  const mV = root.querySelector('.mV'), mL = root.querySelector('.mL'), cN = root.querySelector('.cN');
  const overlays = [modeOv, galOv, picOv];

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, bgLayer = null, raf = 0, last = 0, T = 0, running = false, paused = false, built = false;
  const V = { cx: 0, by: 0, S: 100, th: 0 };
  let area = { top: 60, bot: 500 }, goal = { S: 100, by: 300 };
  let mode = 'free', orderI = 0, cake = null, freeCake = null, orderCake = null, step = 1, maxStep = 1, profId = null;
  let tip = 'star', creamI = 0, topSel = 'cherry';
  let parts = [], stroke = null, drag = null, tdrag = null, finT = 0, squishT = -1, uid = 0, wobT = -9, lastRes = null, allOutSaid = false;
  const newCake = () => ({ shape: 'round', tiers: 1, flavor: 'vanilla', frost: -1, pour: 1, pipes: [], tops: [], hist: [], finished: false, gid: 0 });

  /* ---------- الأصوات ---------- */
  const snd = {
    squish() { Sound.noise(.09, 420, 170, .1, 1.3); Sound.tone(rand(140, 185), .07, 'sine', .07, -70); },
    plop() { Sound.tone(rand(380, 470), .11, 'sine', .16, -250); Sound.noise(.05, 1300, 500, .05, 2); },
    sparkle() { [1760, 2349, 2637, 3136, 3520].forEach((f, i) => Sound.tone(f * rand(.97, 1.03), .14, 'sine', .05, 0, i * .045)); },
    pour() { Sound.noise(1.6, 280, 110, .11, 1.1); for (let i = 0; i < 9; i++) Sound.tone(rand(140, 240), .09, 'sine', .07, rand(60, 140), .1 + i * .16); },
    blow() { Sound.noise(.45, 1500, 400, .12, .8); },
    light() { Sound.noise(.16, 3200, 1200, .07, 2); Sound.tone(880, .09, 'triangle', .05, 300); }
  };

  /* ---------- أيقونات صغيرة (dataURL) ---------- */
  const ICONS = new Map();
  function icon(key) {
    if (ICONS.has(key)) return ICONS.get(key);
    const P = 2, sz = 64, c0 = mk(sz * P, sz * P), c = c0.getContext('2d'); c.scale(P, P);
    const [kind, val] = key.split(':');
    if (kind === 'shape' || kind === 'tiers') {
      const ck = Object.assign(newCake(), { shape: kind === 'shape' ? val : 'round', tiers: kind === 'tiers' ? +val : 1, frost: kind === 'shape' ? 1 : 0 });
      const n = ck.tiers, S = [21, 18, 15][n - 1];
      drawScene(c, { cx: 32, by: [43, 49, 54][n - 1], S, th: 0 }, ck, { stand: 'plate', pr: P, decor: false });
    } else if (kind === 'flav') drawSlice(c, 19, 27, 34, val, -1);
    else if (kind === 'tip') {
      const r = 13, s = blobSprite(val, '#FF9CCB', r, P), w = r * 2.8;
      for (const dx of val === 'dot' ? [-12, 12] : val === 'ruffle' ? [-12, -6, 0, 6, 12] : [-9, 9]) c.drawImage(s, 32 + dx - w / 2, 34 - w * .45, w, w);
    } else if (kind === 'top') {
      const d = TOP[val], u = 25 / d.e, s = itemSprite(val, val === 'mac' || val === 'flower' ? 0 : 0, u, P), w = 2 * d.e * u;
      c.drawImage(s, 32 - w / 2, 54 - w * .8, w, w);
    }
    const url = c0.toDataURL();
    ICONS.set(key, url); return url;
  }

  /* ---------- الخلفية ---------- */
  function paintBg(x, w, h, cy, topY, S) {
    let g = x.createLinearGradient(0, 0, 0, cy); g.addColorStop(0, '#FFD3E5'); g.addColorStop(1, '#FFF0F6');
    x.fillStyle = g; x.fillRect(0, 0, w, cy);
    const sw = Math.max(30, Math.min(w, h) * .085);
    x.fillStyle = 'rgba(255,255,255,.4)'; for (let sx = (w / 2) % (sw * 2) - sw * 2; sx < w; sx += sw * 2) x.fillRect(sx, 0, sw, cy);
    x.fillStyle = 'rgba(255,120,175,.13)';
    for (let sx = (w / 2) % (sw * 2) - sw * 2 + sw * 1.5; sx < w; sx += sw * 2) for (let yy = sw * .6; yy < cy; yy += sw * 1.2) { x.save(); x.translate(sx, yy); heartPath(x, sw * .16); x.fill(); x.restore(); }
    // ضوء النافذة
    let rg = x.createRadialGradient(w * .5, cy * .55, 0, w * .5, cy * .55, Math.max(w, h) * .6);
    rg.addColorStop(0, 'rgba(255,255,255,.65)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = rg; x.fillRect(0, 0, w, cy);
    // أضواء ضبابية
    const R = rng(21);
    for (let i = 0; i < 14; i++) {
      const bx = R() * w, by = R() * cy * .8, br = 8 + R() * Math.min(w, h) * .05;
      const bg = x.createRadialGradient(bx, by, 0, bx, by, br); bg.addColorStop(0, `rgba(255,${200 + R() * 55 | 0},${220 + R() * 35 | 0},.55)`); bg.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = bg; x.beginPath(); x.arc(bx, by, br, 0, TAU); x.fill();
    }
    // زينة معلّقة (رايات)
    const fy = topY, sag = Math.min(40, w * .05), cols = ['#FF7FB8', '#FFD447', '#7CC8FF', '#7EE0B8', '#C7A6FF'];
    const yAt = t => fy + Math.sin(t * Math.PI) * sag;
    for (let rep = 0; rep < 2; rep++) {
      const x0 = rep ? w * .5 : 0, x1 = rep ? w : w * .5;
      x.strokeStyle = 'rgba(160,80,120,.5)'; x.lineWidth = 1.5; x.beginPath();
      for (let i = 0; i <= 20; i++) { const t = i / 20; x.lineTo(x0 + (x1 - x0) * t, yAt(t)); } x.stroke();
      const nf = Math.max(4, Math.round((x1 - x0) / 46));
      for (let i = 0; i < nf; i++) {
        const t = (i + .5) / nf, fx = x0 + (x1 - x0) * t, fyy = yAt(t), fw = Math.min(17, (x1 - x0) / nf * .38), fh = fw * 1.5;
        x.fillStyle = cols[(i + rep * 2) % cols.length]; x.beginPath(); x.moveTo(fx - fw, fyy); x.lineTo(fx + fw, fyy); x.lineTo(fx, fyy + fh); x.closePath(); x.fill();
        x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.moveTo(fx - fw * .7, fyy + 2); x.lineTo(fx - fw * .1, fyy + 2); x.lineTo(fx - fw * .25, fyy + fh * .5); x.closePath(); x.fill();
      }
    }
    // الطاولة الرخامية
    g = x.createLinearGradient(0, cy, 0, h); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.25, '#FBEFF4'); g.addColorStop(1, '#EED2DF');
    x.fillStyle = g; x.fillRect(0, cy, w, h - cy);
    x.save(); x.beginPath(); x.rect(0, cy, w, h - cy); x.clip();
    x.strokeStyle = 'rgba(214,160,190,.35)'; x.lineWidth = 1.2;
    for (let i = 0; i < 7; i++) {
      x.beginPath(); let vx = R() * w, vy = cy + R() * (h - cy) * .3; x.moveTo(vx, vy);
      for (let j = 0; j < 5; j++) { const nx = vx + (R() - .3) * w * .25, ny = vy + R() * (h - cy) * .3; x.quadraticCurveTo((vx + nx) / 2 + (R() - .5) * 40, (vy + ny) / 2, nx, ny); vx = nx; vy = ny; }
      x.stroke();
    }
    x.restore();
    g = x.createLinearGradient(0, cy - 10, 0, cy + 4); g.addColorStop(0, 'rgba(150,60,100,0)'); g.addColorStop(1, 'rgba(150,60,100,.18)');
    x.fillStyle = g; x.fillRect(0, cy - 10, w, 14);
    x.fillStyle = 'rgba(255,255,255,.9)'; x.fillRect(0, cy, w, 2);
    void S;
  }
  function buildBg() {
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const barB = bar.getBoundingClientRect().bottom - root.getBoundingClientRect().top;
    paintBg(x, W, H, goal.by + goal.S * .24, Math.max(6, barB - 30), goal.S);
  }

  /* ---------- التخطيط ---------- */
  function goalView() {
    const n = cake.tiers, G = tiersGeo(n), yT = G[n - 1].y1, rT = G[n - 1].R;
    const above = yT + .38 + TILT * rT, below = .47 + TILT * .62;
    const AH = Math.max(120, area.bot - area.top), AW = Math.min(W - 14, 760);
    const S = Math.max(40, Math.min(AW / 2.65, AH / (above + below), 215));
    return { S, by: area.top + above * S + (AH - (above + below) * S) * .55 };
  }
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const rb = root.getBoundingClientRect();
    let top = bar.getBoundingClientRect().bottom - rb.top + 4;
    if (orderEl.classList.contains('on')) top = orderEl.getBoundingClientRect().bottom - rb.top + 6;
    const tt = tipEl.getBoundingClientRect().top - rb.top;
    area = { top, bot: tt - 4 };
    V.cx = W / 2;
    goal = goalView(); V.S = goal.S; V.by = goal.by;
    toolsEl.style.bottom = (H - tt + 10) + 'px';
    buildBg();
  }
  function regoal() { goal = goalView(); buildBg(); }

  /* ---------- الشريط السفلي ---------- */
  const tipText = () => [
    App.g('اختاري شكل الكعكة وعدد الطبقات', 'اختر شكل الكعكة وعدد الطبقات'),
    App.g('اختاري نكهة الكيك من الداخل', 'اختر نكهة الكيك من الداخل'),
    App.g('اختاري لون الكريمة وشاهديها تنسكب!', 'اختر لون الكريمة وشاهدها تنسكب!'),
    App.g('ارسمي بالكريمة بإصبعك على الكعكة ✍️', 'ارسم بالكريمة بإصبعك على الكعكة ✍️'),
    App.g('اسحبي الإضافات إلى الكعكة، أو اختاري ثم اضغطي', 'اسحب الإضافات إلى الكعكة، أو اختر ثم اضغط'),
    cake && cake.tops.some(i => i.k === 'candle' && i.lit) ? App.g('اضغطي على الشموع لإطفائها! 🌬️', 'اضغط على الشموع لإطفائها! 🌬️') : App.g('كعكة رائعة! 🎉', 'كعكة رائعة! 🎉')
  ][step - 1];
  function buildTray() {
    built = true;
    const op = (attr, img, label, cls = '') => `<button class="op ${cls}" ${attr}><img src="${img}" alt="">${label}</button>`;
    const sw = (attr, c, cls = '') => `<button class="sw ${cls}" ${attr} style="--c:${c};--d:${shade(c, -.28)}"></button>`;
    tray.innerHTML = `
      <div class="pane" data-p="1"><div class="row">${SHAPES.map(s => op(`data-shape="${s.id}"`, icon('shape:' + s.id), s.n, 'mid')).join('')}</div>
        <div class="row">${[1, 2, 3].map(n => op(`data-tiers="${n}"`, icon('tiers:' + n), ['طبقة واحدة', 'طبقتان', '3 طبقات'][n - 1], 'mid')).join('')}</div></div>
      <div class="pane" data-p="2"><div class="row">${FLAV_IDS.map(f => op(`data-flav="${f}"`, icon('flav:' + f), FLAV[f].n, 'wide')).join('')}</div></div>
      <div class="pane" data-p="3"><div class="row">${FROST.slice(0, 5).map((f, i) => sw(`data-frost="${i}" aria-label="${f.n}"`, f.c)).join('')}</div>
        <div class="row">${FROST.slice(5).map((f, i) => sw(`data-frost="${i + 5}" aria-label="${f.n}"`, f.c)).join('')}</div></div>
      <div class="pane" data-p="4"><div class="row">${TIPS.map(t => op(`data-tip="${t.id}"`, icon('tip:' + t.id), t.n)).join('')}</div>
        <div class="row">${CREAM.map((c, i) => sw(`data-cream="${i}"`, c, 'sm')).join('')}</div></div>
      <div class="pane" data-p="5"><div class="grid2">${TOPS.map(t => op(`data-top="${t.id}"`, icon('top:' + t.id), t.n)).join('')}</div></div>
      <div class="pane" data-p="6"><div class="fin"></div></div>`;
    stepsEl.innerHTML = STEPS.map((s, i) => `<button class="st" data-s="${i + 1}"><i>${s.i}</i>${s.n}</button>`).join('') + `<button class="nx"></button>`;
  }
  function syncTray() {
    tray.querySelectorAll('.pane').forEach(p => p.classList.toggle('on', +p.dataset.p === step));
    tray.querySelectorAll('[data-shape]').forEach(b => b.classList.toggle('on', b.dataset.shape === cake.shape));
    tray.querySelectorAll('[data-tiers]').forEach(b => b.classList.toggle('on', +b.dataset.tiers === cake.tiers));
    tray.querySelectorAll('[data-flav]').forEach(b => b.classList.toggle('on', b.dataset.flav === cake.flavor));
    tray.querySelectorAll('[data-frost]').forEach(b => b.classList.toggle('on', +b.dataset.frost === cake.frost));
    tray.querySelectorAll('[data-tip]').forEach(b => b.classList.toggle('on', b.dataset.tip === tip));
    tray.querySelectorAll('[data-cream]').forEach(b => b.classList.toggle('on', +b.dataset.cream === creamI));
    tray.querySelectorAll('[data-top]').forEach(b => b.classList.toggle('on', b.dataset.top === topSel));
    stepsEl.querySelectorAll('.st').forEach(b => { const s = +b.dataset.s; b.classList.toggle('on', s === step); b.classList.toggle('done', s !== step && s < maxStep); });
    const nx = stepsEl.querySelector('.nx');
    nx.textContent = step < 5 ? 'التالي ◀' : '✔ ' + App.g('انتهيت', 'انتهيت');
    nx.classList.toggle('hide', step === 6);
    toolsEl.classList.toggle('on', step === 4 || step === 5);
    tipEl.textContent = tipText();
    undoB.disabled = !cake.hist.length; clrB.disabled = !cake.pipes.length && !cake.tops.length;
  }
  function updateChips() {
    if (mode === 'orders') { mL.textContent = 'الطلب'; mV.textContent = `${orderI + 1}/${ORDERS.length}`; }
    else { mL.textContent = 'الوضع'; mV.textContent = 'حر 🎨'; }
    cN.textContent = store.get('cakeMade', 0);
  }

  /* ---------- الطلبات ---------- */
  const loadProg = () => { const p = store.get('cakeProg', null) || {}; return { stars: p.stars || {}, unlocked: Math.max(1, p.unlocked || 1) }; };
  function reqsOf(o) {
    const r = [];
    if (o.shape) r.push({ k: 'shape', v: o.shape });
    if (o.tiers) r.push({ k: 'tiers', v: o.tiers });
    if (o.flavor) r.push({ k: 'flavor', v: o.flavor });
    if (o.frost) r.push({ k: 'frost', v: o.frost });
    if (o.pipe) r.push({ k: 'pipe', n: o.pipe });
    for (const [t, n] of Object.entries(o.items || {})) r.push({ k: 'item', t, n });
    return r;
  }
  function reqHave(r, ck) {
    switch (r.k) {
      case 'shape': return ck.shape === r.v ? 1 : 0;
      case 'tiers': return ck.tiers === r.v ? 1 : 0;
      case 'flavor': return ck.flavor === r.v ? 1 : 0;
      case 'frost': return ck.frost >= 0 && FROST[ck.frost].id === r.v ? 1 : 0;
      case 'pipe': return ck.pipes.filter(p => p.pts.length && p.tier < ck.tiers).length;
      default: return ck.tops.filter(i => i.k === r.t && i.tier < ck.tiers).length;
    }
  }
  const reqOk = (r, ck) => (r.k === 'pipe' || r.k === 'item') ? reqHave(r, ck) >= r.n : !!reqHave(r, ck);
  function orderSentence(o) {
    let s = 'أريد كعكة';
    if (o.shape) s += ' ' + SHAPES.find(x => x.id === o.shape).s;
    if (o.flavor) s += ' ' + FLAV[o.flavor].s;
    if (o.tiers) s += o.tiers === 2 ? ' من طبقتين' : ' من ثلاث طبقات';
    if (o.frost) s += ' وكريمة ' + FROST.find(f => f.id === o.frost).n;
    return s;
  }
  function renderOrder() {
    if (mode !== 'orders') return;
    const o = ORDERS[orderI];
    custEl.textContent = o.who;
    otEl.textContent = `طلب ${orderI + 1}: ${orderSentence(o)}`;
    reqsEl.innerHTML = reqsOf(o).map(r => {
      const ok = reqOk(r, cake) ? 'ok' : '';
      if (r.k === 'shape') return `<span class="rq ${ok}"><img src="${icon('shape:' + r.v)}" alt="">${SHAPES.find(s => s.id === r.v).n}</span>`;
      if (r.k === 'tiers') return `<span class="rq ${ok}"><img src="${icon('tiers:' + r.v)}" alt="">${r.v === 2 ? 'طبقتان' : '3 طبقات'}</span>`;
      if (r.k === 'flavor') return `<span class="rq ${ok}"><img src="${icon('flav:' + r.v)}" alt="">${FLAV[r.v].n}</span>`;
      if (r.k === 'frost') { const f = FROST.find(x => x.id === r.v); return `<span class="rq ${ok}"><i style="background:${f.c}"></i>كريمة</span>`; }
      const h = Math.min(reqHave(r, cake), r.n);
      if (r.k === 'pipe') return `<span class="rq ${ok}"><img src="${icon('tip:star')}" alt=""><bdi>${h}/${r.n}</bdi></span>`;
      if (r.t === 'spr' || r.t === 'plq') return `<span class="rq ${ok}"><img src="${icon('top:' + r.t)}" alt="">${TOP[r.t].n}</span>`;
      return `<span class="rq ${ok}"><img src="${icon('top:' + r.t)}" alt=""><bdi>${h}/${r.n}</bdi></span>`;
    }).join('');
  }
  function showOrderCard(on) {
    orderEl.classList.toggle('on', on);
    if (on) { orderEl.classList.remove('pop'); void orderEl.offsetWidth; orderEl.classList.add('pop'); renderOrder(); }
  }

  /* ---------- تغيّر الكعكة ---------- */
  function changed() {
    renderOrder(); syncTray();
    const strokes = cake.pipes.filter(p => p.pts.length).length;
    if (strokes >= 20) App.achieve('cake_artist');
  }
  function snap() { cake.hist.push({ pipes: cake.pipes.slice(), tops: cake.tops.slice() }); if (cake.hist.length > 60) cake.hist.shift(); }
  function undo() {
    const h = cake.hist.pop(); if (!h) { Sound.error(); return; }
    cake.pipes = h.pipes; cake.tops = h.tops; Sound.slide(); Sound.tone(500, .1, 'sine', .08, -200); vibrate(10); changed();
  }
  function clearDecor() {
    if (!cake.pipes.length && !cake.tops.length) return;
    snap();
    const G = tiersGeo(cake.tiers);
    for (let i = 0; i < 26; i++) { const g = G[ri(G.length)]; const a = rand(0, TAU), d = Math.sqrt(Math.random()) * g.R; burst(px(V, Math.cos(a) * d), py(V, g.y1, Math.sin(a) * d * TILT / TILT), 1, 'smoke'); }
    cake.pipes = []; cake.tops = []; Sound.erase(); vibrate(20); changed();
  }
  function wobble() { wobT = T; }
  function setShape(s) {
    if (cake.shape === s) { wobble(); Sound.pop(); return; }
    cake.shape = s;
    const G = tiersGeo(3);
    for (const p of cake.pipes) for (const b of p.pts) { const r = clampIn(s, b.x, b.z, G[p.tier].R * 1.04); b.x = r[0]; b.z = r[1]; }
    for (const it of cake.tops) { const r = clampIn(s, it.x, it.z, G[it.tier].R * .95); it.x = r[0]; it.z = r[1]; }
    wobble(); Sound.pop(); vibrate(10); App.speak(SHAPES.find(x => x.id === s).n); changed();
  }
  function setTiers(n) {
    if (cake.tiers === n) { wobble(); Sound.pop(); return; }
    cake.tiers = n; regoal(); wobble(); Sound.merge(n + 1); vibrate(15); changed();
  }
  function setFlavor(f) {
    cake.flavor = f; wobble(); Sound.pop(); App.speak(FLAV[f].n); changed();
  }
  function setFrost(i) {
    cake.frost = i; cake.pour = 0; snd.pour(); vibrate(15); changed();
  }

  /* ---------- الجسيمات ---------- */
  function burst(x, y, n, k = 'spark', col) {
    const cols = ['#FFD447', '#FF7FB8', '#7CC8FF', '#7EE0B8', '#C7A6FF', '#FFFFFF'];
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU), sp = k === 'smoke' ? rand(10, 30) : rand(60, 220);
      parts.push({ k, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - (k === 'smoke' ? 30 : 60), rot: rand(0, TAU), vr: rand(-6, 6),
        s: k === 'smoke' ? rand(6, 12) : rand(4, 8), c: col || cols[ri(cols.length)], life: k === 'smoke' ? rand(.8, 1.3) : rand(.5, .9), age: 0 });
    }
  }
  function confetti(n) {
    const cols = ['#FF4F8B', '#FFD23F', '#3ED1A0', '#4FA8FF', '#B07CFF', '#FF8A3D'];
    for (let i = 0; i < n; i++) parts.push({ k: 'conf', x: rand(0, W), y: rand(-H * .5, -10), vx: rand(-40, 40), vy: rand(90, 200), rot: rand(0, TAU), vr: rand(-8, 8), s: rand(7, 12), c: cols[ri(cols.length)], life: rand(3, 4.5), age: 0 });
  }

  /* ---------- الإدخال ---------- */
  function unproj(sx, sy, y) {
    const xr = (sx - V.cx) / V.S, zr = (sy - (V.by - y * V.S)) / (V.S * TILT), c = Math.cos(V.th), s = Math.sin(V.th);
    return [xr * c + zr * s, -xr * s + zr * c];
  }
  function hitTier(sx, sy, m = 1) {
    const G = tiersGeo(cake.tiers);
    for (let i = G.length - 1; i >= 0; i--) {
      const [x, z] = unproj(sx, sy, G[i].y1);
      if (inside(cake.shape, x, z, G[i].R * m) && (i === G.length - 1 || !inside(cake.shape, x, z, G[i + 1].R * .98))) return { ti: i, x, z };
    }
    return null;
  }
  function itemScreen(it) {
    const G = tiersGeo(cake.tiers), c = Math.cos(V.th), s = Math.sin(V.th);
    const x = it.x * c - it.z * s, z = it.x * s + it.z * c;
    return [px(V, x), py(V, G[it.tier].y1 + .012, z)];
  }
  function hitItem(sx, sy) {
    for (let i = cake.tops.length - 1; i >= 0; i--) {
      const it = cake.tops[i]; if (it.k === 'spr' || it.tier >= cake.tiers) continue;
      const e = TOP[it.k].e, [x, y] = itemScreen(it), cy = y - e * V.S * (it.k === 'candle' || it.k === 'lolly' ? .9 : .55);
      if (Math.hypot(sx - x, (sy - cy) * (it.k === 'candle' || it.k === 'lolly' ? .55 : 1)) < Math.max(22, e * V.S * .75)) return it;
    }
    return null;
  }
  function addBlob(st, x, z, a) {
    st.pts.push({ x, z, a, t0: T });
    if (T - squishT > .075) { squishT = T; snd.squish(); }
  }
  function startPipe(p) {
    const h = hitTier(p.x, p.y, 1.05);
    if (!h) { miss(p); return; }
    snap();
    stroke = { tier: h.ti, tip, col: CREAM[creamI], pts: [], lx: h.x, lz: h.z };
    cake.pipes.push(stroke);
    addBlob(stroke, h.x, h.z, 0); vibrate(8);
  }
  function movePipe(p) {
    const G = tiersGeo(cake.tiers), g = G[stroke.tier], gap = TIPS.find(t => t.id === stroke.tip).gap;
    let [x, z] = unproj(p.x, p.y, g.y1);
    [x, z] = clampIn(cake.shape, x, z, g.R * 1.05);
    let dx = x - stroke.lx, dz = z - stroke.lz, d = Math.hypot(dx, dz), n = 0;
    while (d >= gap && n++ < 60) {
      const a = Math.atan2(dz, dx); stroke.lx += Math.cos(a) * gap; stroke.lz += Math.sin(a) * gap;
      if (stroke.pts.length === 1) stroke.pts[0].a = a;
      const up = stroke.tier < G.length - 1 && inside(cake.shape, stroke.lx, stroke.lz, G[stroke.tier + 1].R * .97);
      if (!up) addBlob(stroke, stroke.lx, stroke.lz, a);
      dx = x - stroke.lx; dz = z - stroke.lz; d = Math.hypot(dx, dz);
    }
  }
  function endPipe() {
    if (!stroke) return;
    if (!stroke.pts.length) { cake.pipes.pop(); cake.hist.pop(); }
    stroke = null; changed();
  }
  function miss(p) { burst(p.x, p.y, 4, 'spark', '#FFFFFF'); Sound.tone(300, .06, 'sine', .05); }
  function placeTop(k, sx, sy) {
    const h = hitTier(sx, sy, .95);
    if (!h) return false;
    snap();
    if (k === 'spr') {
      const G = tiersGeo(cake.tiers), g = G[h.ti];
      for (let i = 0; i < 28; i++) {
        const a = rand(0, TAU), d = Math.sqrt(Math.random()) * .2 * Math.min(1, g.R + .2);
        let [x, z] = clampIn(cake.shape, h.x + Math.cos(a) * d, h.z + Math.sin(a) * d, g.R * .97);
        if (h.ti < G.length - 1 && inside(cake.shape, x, z, G[h.ti + 1].R)) continue;
        cake.tops.push({ id: ++uid, k: 'spr', tier: h.ti, x, z, v: ri(SPR_COLS.length), v2: Math.random() < .3, rot: rand(0, TAU), t0: T + rand(0, .3) });
      }
      snd.sparkle(); vibrate(12);
      setTimeout(() => burst(sx, sy, 8), 300);
    } else {
      const it = { id: ++uid, k, tier: h.ti, x: h.x, z: h.z, v: ri(TOP[k].nv), rot: rand(-.22, .22), t0: T, lit: false };
      cake.tops.push(it);
      setTimeout(() => { if (App.current !== ID) return; snd.plop(); vibrate(10); const [x, y] = itemScreen(it); burst(x, y - 6, 5); }, 270);
    }
    changed(); return true;
  }
  function toggleCandle(it) {
    it.lit = !it.lit;
    const [x, y] = itemScreen(it), yy = y - .26 * V.S;
    if (it.lit) { snd.light(); burst(x, yy, 6, 'spark', '#FFE45C'); }
    else {
      snd.blow(); for (let i = 0; i < 6; i++) burst(x, yy, 1, 'smoke', '#CFC6CC');
      if (step === 6 && !cake.tops.some(i => i.k === 'candle' && i.lit && i.tier < cake.tiers) && !allOutSaid) {
        allOutSaid = true; setTimeout(() => { confetti(60); Sound.win(); App.speak(App.g('عيد ميلاد سعيد!', 'عيد ميلاد سعيد!')); }, 300);
      }
    }
    vibrate(12); syncTray();
  }
  const ptr = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const anyOv = () => overlays.some(o => o.classList.contains('on'));
  cv.addEventListener('pointerdown', e => {
    if (paused || anyOv() || !cake) return;
    Sound.ac();
    const p = ptr(e);
    try { cv.setPointerCapture(e.pointerId); } catch (err) {}
    if (step === 4) startPipe(p);
    else if (step === 5) {
      const it = hitItem(p.x, p.y);
      if (it) { const [x, y] = itemScreen(it); drag = { it, ox: x - p.x, oy: y - p.y, sx: p.x, sy: p.y, moved: false }; }
      else if (!placeTop(topSel, p.x, p.y)) miss(p);
    } else if (step === 6) {
      const it = hitItem(p.x, p.y);
      if (it && it.k === 'candle') toggleCandle(it);
      else { burst(p.x, p.y, 10); snd.sparkle(); }
    } else {
      if (hitTier(p.x, p.y, 1.05) || Math.abs(p.x - V.cx) < V.S) { wobble(); Sound.pop(); burst(p.x, p.y, 6); }
    }
  });
  cv.addEventListener('pointermove', e => {
    if (!cake) return;
    const p = ptr(e);
    if (stroke) movePipe(p);
    else if (drag) {
      if (!drag.moved && Math.hypot(p.x - drag.sx, p.y - drag.sy) > 7) {
        drag.moved = true; snap();
        const cl = Object.assign({}, drag.it); const i = cake.tops.indexOf(drag.it); cake.tops[i] = cl; drag.it = cl;
        cake.tops.splice(i, 1); cake.tops.push(cl);
      }
      if (drag.moved) {
        const h = hitTier(p.x + drag.ox, p.y + drag.oy, .95);
        if (h) { drag.it.tier = h.ti; drag.it.x = h.x; drag.it.z = h.z; }
      }
    }
  });
  const pUp = () => {
    if (stroke) endPipe();
    if (drag) {
      if (!drag.moved) {
        if (drag.it.k === 'candle') toggleCandle(drag.it);
        else { drag.it.t0 = T - .28; snd.plop(); }
      } else { snd.plop(); changed(); }
      drag = null;
    }
  };
  cv.addEventListener('pointerup', pUp); cv.addEventListener('pointercancel', pUp);

  /* سحب من الشريط */
  tray.addEventListener('pointerdown', e => {
    const b = e.target.closest('[data-top]'); if (!b || step !== 5) return;
    Sound.ac();
    topSel = b.dataset.top; syncTray(); Sound.tap();
    const r = root.getBoundingClientRect();
    tdrag = { k: topSel, x: e.clientX - r.left, y: e.clientY - r.top, x0: e.clientX, y0: e.clientY, moved: false };
  });
  window.addEventListener('pointermove', e => {
    if (!tdrag) return;
    const r = root.getBoundingClientRect();
    tdrag.x = e.clientX - r.left; tdrag.y = e.clientY - r.top;
    if (!tdrag.moved && Math.hypot(e.clientX - tdrag.x0, e.clientY - tdrag.y0) > 12) tdrag.moved = true;
  });
  window.addEventListener('pointerup', () => {
    if (!tdrag) return;
    const d = tdrag; tdrag = null;
    if (d.moved && App.current === ID) { if (!placeTop(d.k, d.x, d.y - 30)) Sound.tone(260, .1, 'sine', .06, -60); }
  });
  window.addEventListener('pointercancel', () => { tdrag = null; });

  tray.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.shape) setShape(d.shape);
    else if (d.tiers) setTiers(+d.tiers);
    else if (d.flav) setFlavor(d.flav);
    else if (d.frost != null) setFrost(+d.frost);
    else if (d.tip) { tip = d.tip; Sound.tap(); syncTray(); }
    else if (d.cream != null) { creamI = +d.cream; Sound.tap(); syncTray(); }
    else if (d.a) finAct(d.a);
  });
  stepsEl.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('nx')) next();
    else setStep(+b.dataset.s);
  });
  undoB.addEventListener('click', () => undo());
  clrB.addEventListener('click', () => clearDecor());
  root.querySelector('.modeb').addEventListener('click', () => { Sound.tap(); openMode(); });
  root.querySelector('.galb').addEventListener('click', () => { Sound.tap(); openGallery(); });
  modeOv.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.a === 'close') { Sound.tap(); modeOv.classList.remove('on'); return; }
    if (b.dataset.m === 'free') { Sound.tap(); modeOv.classList.remove('on'); setFree(); return; }
    if (b.dataset.m === 'orders') { const pr = loadProg(); Sound.tap(); modeOv.classList.remove('on'); startOrder(Math.min(pr.unlocked, ORDERS.length) - 1); return; }
    if (b.dataset.o != null) {
      if (b.classList.contains('lock')) { Sound.error(); return; }
      Sound.tap(); modeOv.classList.remove('on'); startOrder(+b.dataset.o);
    }
  });
  galOv.addEventListener('click', e => { if (e.target.closest('[data-a="close"]')) { Sound.tap(); galOv.classList.remove('on'); } });
  picOv.addEventListener('click', e => { if (e.target.closest('[data-a="close"]')) { Sound.tap(); picOv.classList.remove('on'); } });
  window.addEventListener('keydown', e => {
    if (App.current !== ID || paused || anyOv() || !cake) return;
    if (e.key === 'Enter') { e.preventDefault(); next(); }
    else if (e.key === 'z' || e.key === 'Z' || e.key === 'Backspace') { e.preventDefault(); undo(); }
    else if (e.key >= '1' && e.key <= '6') setStep(+e.key);
  });

  /* ---------- التنقّل بين الخطوات والأوضاع ---------- */
  function next() {
    Sound.ac();
    if (step < 6) setStep(step + 1);
  }
  function setStep(n) {
    if (n === step || n < 1 || n > 6) return;
    const prev = step; step = n; maxStep = Math.max(maxStep, n);
    if (stroke) endPipe(); drag = null;
    if (n === 6) finish(); else if (prev === 6) { cake.tops.forEach(i => { if (i.k === 'candle') i.lit = false; }); }
    Sound.whoosh(); syncTray();
  }
  function setFree() {
    mode = 'free'; if (!freeCake) freeCake = newCake(); cake = freeCake;
    showOrderCard(false); step = cake.finished ? 5 : 1; maxStep = cake.finished ? 6 : 1;
    updateChips(); syncTray(); layout();
  }
  function startOrder(i) {
    mode = 'orders'; orderI = i; orderCake = newCake(); cake = orderCake; step = 1; maxStep = 1;
    showOrderCard(true); updateChips(); syncTray(); layout();
    setTimeout(() => { if (App.current === ID && mode === 'orders') App.speak(orderSentence(ORDERS[i])); }, 400);
    Sound.star();
  }
  function newFree() { freeCake = newCake(); cake = freeCake; step = 1; maxStep = 1; parts = []; regoal(); syncTray(); Sound.whoosh(); }
  function openMode() {
    const pr = loadProg();
    const done = Object.keys(pr.stars).filter(k => pr.stars[k]).length;
    modeOv.querySelector('.fs').textContent = App.g('زيّني كما تحبين', 'زيّن كما تحب');
    modeOv.querySelector('.gs').textContent = `${done}/${ORDERS.length}`;
    modeOv.querySelector('.f').classList.toggle('on', mode === 'free');
    modeOv.querySelector('.g').classList.toggle('on', mode === 'orders');
    modeOv.querySelector('.lvg').innerHTML = ORDERS.map((o, i) => {
      const st = pr.stars[i + 1] || 0, lock = i + 1 > pr.unlocked;
      const stars = st ? `<span class="s">${[0, 1, 2].map(j => `<i class="${j < st ? '' : 'off'}">⭐</i>`).join('')}</span>` : '';
      return `<button class="lvb ${lock ? 'lock' : ''} ${mode === 'orders' && i === orderI ? 'cur' : ''}" data-o="${i}"><span class="n">${i + 1}</span><span class="e">${o.who}</span>${lock ? '' : stars}</button>`;
    }).join('');
    modeOv.classList.add('on');
  }
  function openGallery() {
    const gal = store.get('cakeGallery', []);
    galOv.querySelector('.gal').innerHTML = gal.length ? gal.map(g => `<img src="${g.img}" alt="">`).join('') : `<div class="empty">${App.g('لا توجد كعكات بعد… زيّني أول كعكة! 🎂', 'لا توجد كعكات بعد… زيّن أول كعكة! 🎂')}</div>`;
    galOv.classList.add('on');
  }

  /* ---------- النهاية ---------- */
  function finish() {
    finT = T; allOutSaid = false;
    cake.tops.forEach(it => { if (it.k === 'candle') it.lit = true; });
    confetti(110); Sound.win(); vibrate(30);
    setTimeout(() => { if (App.current === ID && step === 6) App.speak(App.g('واو! كعكة رائعة!', 'واو! كعكة رائعة!')); }, 500);
    if (!cake.finished) {
      cake.finished = true;
      store.set('cakeMade', store.get('cakeMade', 0) + 1);
      App.achieve('cake_first');
      if (mode === 'free') {
        const d = new Date().toDateString(), day = store.get('cakeDay', { d: '', n: 0 });
        if (day.d !== d) { day.d = d; day.n = 0; }
        if (day.n < 3) { day.n++; store.set('cakeDay', day); setTimeout(() => App.addStars(1), 1100); }
      }
    }
    lastRes = null;
    if (mode === 'orders') {
      const rq = reqsOf(ORDERS[orderI]), ok = rq.filter(r => reqOk(r, cake)).length, f = ok / rq.length;
      const st = f >= 1 ? 3 : f >= .6 ? 2 : 1;
      const pr = loadProg(), old = pr.stars[orderI + 1] || 0;
      if (st > old) { pr.stars[orderI + 1] = st; setTimeout(() => App.addStars(st - old), 1300); }
      pr.unlocked = Math.max(pr.unlocked, Math.min(ORDERS.length, orderI + 2));
      store.set('cakeProg', { stars: pr.stars, unlocked: pr.unlocked });
      if (Object.keys(pr.stars).filter(k => pr.stars[k]).length >= 10) App.achieve('cake_order');
      lastRes = { st, ok, n: rq.length };
    }
    renderFin(); updateChips();
    setTimeout(saveGallery, 900);
  }
  function renderFin() {
    const fin = tray.querySelector('.fin'); if (!fin) return;
    let h = '';
    if (lastRes) {
      const r = lastRes, em = ['🙂', '😊', '😍'][r.st - 1];
      const msg = r.st === 3 ? App.g('طلب مثالي! الزبون سعيد جدًا', 'طلب مثالي! الزبون سعيد جدًا') : r.st === 2 ? 'جميل! ينقصه القليل' : App.g('شكرًا! حاولي مطابقة الطلب أكثر', 'شكرًا! حاول مطابقة الطلب أكثر');
      h += `<div class="res"><span class="em">${em}</span><div><div class="stars3">${[0, 1, 2].map(j => `<span class="${j < r.st ? '' : 'off'}">⭐</span>`).join('')}</div>${msg}</div></div>`;
      h += `<div class="btns">${orderI < ORDERS.length - 1 ? '<button class="btn ok" data-a="nextO">الطلب التالي ◀</button>' : ''}<button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="save">💾 صورة</button><button class="btn alt" data-a="edit">✏️</button></div>`;
    } else {
      h += `<div class="res"><span class="em">🎂</span>${App.g('كعكتك جاهزة! يمكنك حفظ صورتها', 'كعكتك جاهزة! يمكنك حفظ صورتها')}</div>`;
      h += `<div class="btns"><button class="btn" data-a="save">💾 حفظ الصورة</button><button class="btn ok" data-a="new">🎂 كعكة جديدة</button><button class="btn alt" data-a="edit">✏️ تعديل</button></div>`;
    }
    fin.innerHTML = h;
  }
  function finAct(a) {
    Sound.tap();
    if (a === 'save') savePic();
    else if (a === 'edit') setStep(5);
    else if (a === 'new') newFree();
    else if (a === 'again') startOrder(orderI);
    else if (a === 'nextO') startOrder(Math.min(orderI + 1, ORDERS.length - 1));
  }
  function compose(size) {
    const cvs = mk(size, size), c = cvs.getContext('2d');
    const n = cake.tiers, G = tiersGeo(n), yT = G[n - 1].y1, rT = G[n - 1].R;
    const above = yT + .38 + TILT * rT, below = .47 + TILT * .62, avail = size * .8;
    const S = Math.min(size * .9 / 2.65, avail / (above + below)), by = size * .05 + above * S + (avail - (above + below) * S) * .5;
    paintBg(c, size, size, by + S * .24, size * .02, S);
    drawScene(c, { cx: size / 2, by, S, th: V.th }, cake, { T, pr: 1 });
    // شريط العنوان
    const t = 'كعكة ' + (App.profile ? App.profile.name : '') + ' 🎂', fs = size * .055;
    c.font = `900 ${fs}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'rtl';
    const tw = c.measureText(t).width + fs * 1.6, ty = size - fs * 1.15;
    c.fillStyle = 'rgba(255,255,255,.92)'; c.beginPath(); c.roundRect(size / 2 - tw / 2, ty - fs * .8, tw, fs * 1.6, fs * .8); c.fill();
    c.fillStyle = '#E0457F'; c.fillText(t, size / 2, ty + fs * .05);
    return cvs;
  }
  function saveGallery() {
    if (!cake || !cake.finished) return;
    try {
      const big = compose(320), t = mk(160, 160); t.getContext('2d').drawImage(big, 0, 0, 160, 160);
      const url = t.toDataURL('image/jpeg', .72);
      let gal = store.get('cakeGallery', []);
      if (cake.gid) gal = gal.filter(g => g.id !== cake.gid);
      cake.gid = Date.now();
      gal.unshift({ id: cake.gid, img: url });
      store.set('cakeGallery', gal.slice(0, 12));
    } catch (e) {}
  }
  function savePic() {
    let url = '';
    try { url = compose(900).toDataURL('image/png'); } catch (e) { Sound.error(); return; }
    const android = !!window.AndroidBridge;
    if (!android) { try { const a = document.createElement('a'); a.href = url; a.download = 'cake-' + Date.now() + '.png'; document.body.appendChild(a); a.click(); a.remove(); } catch (e) {} }
    picOv.querySelector('.pimg').src = url;
    picOv.querySelector('.pp').textContent = android ? App.g('اضغطي مطوّلًا على الصورة لحفظها', 'اضغط مطوّلًا على الصورة لحفظها') : 'تم تنزيل الصورة 📥';
    picOv.classList.add('on'); Sound.star();
  }

  /* ---------- الحلقة ---------- */
  function update(dt) {
    T += dt;
    if (cake.frost >= 0 && cake.pour < 1) {
      cake.pour = Math.min(1, cake.pour + dt / 1.9);
      if (cake.pour >= 1) { const G = tiersGeo(cake.tiers), g = G[G.length - 1]; burst(V.cx, py(V, g.y1, 0), 14); Sound.star(); }
    }
    const k = Math.min(1, dt * 7);
    V.S += (goal.S - V.S) * k; V.by += (goal.by - V.by) * k;
    const tth = step === 6 ? Math.sin((T - finT) * .85) * .42 : 0;
    V.th += (tth - V.th) * Math.min(1, dt * 4);
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age >= q.life) { parts.splice(i, 1); continue; }
      if (q.k === 'conf') { q.vx += Math.sin(q.age * 3 + q.rot) * 40 * dt; q.vy = Math.min(q.vy + 60 * dt, 180); }
      else if (q.k === 'smoke') { q.vy -= 20 * dt; q.vx *= .98; q.s += dt * 14; }
      else q.vy += 300 * dt;
      q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
    }
  }
  function drawStream() {
    const fr = FROST[cake.frost], p = cake.pour, G = tiersGeo(cake.tiers), g = G[G.length - 1];
    const ty = py(V, g.y1, 0), a = cl01(p < .1 ? p / .1 : (.62 - p) / .12);
    if (a <= 0) return;
    const S = V.S, lipX = V.cx + S * .02, lipY = Math.max(area.top + S * .1, ty - S * 1.1);
    const w = S * .075 * (p < .5 ? 1 : 1 - (p - .5) / .12);
    ctx.save(); ctx.globalAlpha = a;
    // الوعاء
    const bw = S * .3;
    ctx.save(); ctx.translate(lipX + bw * .83, lipY - bw * .57); ctx.rotate(-.6);
    let gg = ctx.createLinearGradient(-bw, 0, bw, 0); gg.addColorStop(0, '#FFFFFF'); gg.addColorStop(.6, '#FFE3EF'); gg.addColorStop(1, '#F2B8D0');
    ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(0, 0, bw, bw * .8, 0, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.fillStyle = fr.c; ctx.beginPath(); ctx.ellipse(0, 0, bw * .96, bw * .2, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = S * .025; ctx.beginPath(); ctx.ellipse(0, 0, bw, bw * .22, 0, 0, TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.ellipse(-bw * .3, bw * .4, bw * .35, bw * .08, .2, 0, TAU); ctx.fill();
    ctx.restore();
    // التيار
    if (w > .5 && p < .62) {
      gg = ctx.createLinearGradient(lipX - w, 0, lipX + w, 0);
      gg.addColorStop(0, shade(fr.c, -.15)); gg.addColorStop(.35, shade(fr.c, .35)); gg.addColorStop(1, shade(fr.c, -.2));
      ctx.fillStyle = gg; ctx.beginPath(); ctx.moveTo(lipX - w * .9, lipY);
      for (let y = lipY; y <= ty; y += 6) ctx.lineTo(lipX - w / 2 + Math.sin(y * .05 + T * 14) * w * .08, y);
      ctx.lineTo(lipX + w / 2, ty);
      for (let y = ty; y >= lipY; y -= 6) ctx.lineTo(lipX + w / 2 + Math.sin(y * .05 + T * 14 + 1) * w * .08, y);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(lipX - w * .2, lipY + 6, w * .12, ty - lipY - 12);
      ctx.fillStyle = fr.c; ctx.beginPath(); ctx.ellipse(lipX, ty, w * 1.4, w * .5, 0, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  function drawSliceCard() {
    const cw = Math.min(118, Math.max(92, W * .24)), ch = cw * 1.08;
    const G = tiersGeo(cake.tiers), right = V.cx + 1.3 * V.S;
    let x = right + 18 + cw < W - 10 ? right + 18 : W - cw - 10, y = area.top + 6;
    if (W - (right + 18) >= cw + 10) y = Math.max(area.top + 6, py(V, G[0].y1, 0) - ch);
    ctx.save(); ctx.shadowColor = 'rgba(120,20,70,.22)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5;
    ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.beginPath(); ctx.roundRect(x, y, cw, ch, 20); ctx.fill(); ctx.restore();
    ctx.strokeStyle = '#FFD3E6'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x, y, cw, ch, 20); ctx.stroke();
    ctx.fillStyle = '#D63F7A'; ctx.font = `800 13px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'rtl';
    ctx.fillText('من الداخل', x + cw / 2, y + 15);
    const sw = cw * .5;
    drawSlice(ctx, x + cw * .36, y + ch * .44, sw, cake.flavor, step === 3 ? cake.frost : -1);
    ctx.fillStyle = '#8A2D55'; ctx.font = `800 12px ${FONT}`; ctx.fillText(FLAV[cake.flavor].n, x + cw / 2, y + ch - 13);
  }
  function render() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H); else { ctx.fillStyle = '#FFE6EF'; ctx.fillRect(0, 0, W, H); }
    // هالة ضوء خلف الكعكة
    const gl = ctx.createRadialGradient(V.cx, V.by - V.S * .5, 0, V.cx, V.by - V.S * .5, V.S * 1.8);
    gl.addColorStop(0, step === 6 ? 'rgba(255,250,210,.75)' : 'rgba(255,255,255,.45)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gl; ctx.fillRect(V.cx - V.S * 2, V.by - V.S * 2.4, V.S * 4, V.S * 3.8);
    if (step === 6) { // أشعة احتفال
      ctx.save(); ctx.translate(V.cx, V.by - V.S * .6); ctx.rotate((T - finT) * .25);
      ctx.fillStyle = 'rgba(255,240,180,.22)';
      for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(V.S * 2.2, -V.S * .22); ctx.lineTo(V.S * 2.2, V.S * .22); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    }
    const wk = T - wobT, wsc = wk < 1 ? 1 + .06 * Math.sin(wk * 20) * Math.exp(-wk * 5) : 1;
    const Vr = wsc === 1 ? V : { cx: V.cx, by: V.by, S: V.S * wsc, th: V.th };
    drawScene(ctx, Vr, cake, { T, pr: dpr });
    if (cake.frost >= 0 && cake.pour < .62) drawStream();
    if (step === 2 || step === 3) drawSliceCard();
    // شبح السحب
    if (tdrag && tdrag.moved) {
      const d = TOP[tdrag.k], u = V.S * 1.05, s = itemSprite(tdrag.k, 0, V.S, dpr), sz = 2 * d.e * u;
      const ok = !!hitTier(tdrag.x, tdrag.y - 30, .95);
      ctx.save(); ctx.globalAlpha = ok ? .95 : .55;
      ctx.fillStyle = ok ? 'rgba(80,200,120,.35)' : 'rgba(120,40,80,.18)'; ctx.beginPath(); ctx.ellipse(tdrag.x, tdrag.y - 30, Math.max(10, d.e * u * .6), Math.max(4, d.e * u * .22), 0, 0, TAU); ctx.fill();
      ctx.drawImage(s, tdrag.x - sz / 2, tdrag.y - 30 - sz * .8 - 6, sz, sz); ctx.restore();
    }
    // الجسيمات
    for (const q of parts) {
      const a = 1 - q.age / q.life;
      ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.rot);
      if (q.k === 'conf') { ctx.globalAlpha = Math.min(1, a * 3); ctx.fillStyle = q.c; ctx.scale(1, Math.cos(q.age * 8 + q.rot)); ctx.fillRect(-q.s / 2, -q.s * .3, q.s, q.s * .6); }
      else if (q.k === 'smoke') { ctx.globalAlpha = a * .5; ctx.fillStyle = q.c; ctx.beginPath(); ctx.arc(0, 0, q.s, 0, TAU); ctx.fill(); }
      else { ctx.globalAlpha = a; ctx.fillStyle = q.c; starPath(ctx, q.s * (.6 + a * .6), .42); ctx.fill(); }
      ctx.restore();
    }
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
    if (App.current !== ID || !cake) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); }, 80);
  });

  /* ---------- أيقونة القائمة ---------- */
  function menuIcon(c, s) {
    let g = c.createRadialGradient(s * .5, s * .38, s * .05, s * .5, s * .5, s * .78);
    g.addColorStop(0, '#FFF7FA'); g.addColorStop(.5, '#FFCFE4'); g.addColorStop(1, '#F58CBF');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.fillStyle = 'rgba(255,255,255,.35)'; for (let x = -s; x < s * 2; x += s * .16) { c.save(); c.translate(x, 0); c.rotate(.5); c.fillRect(0, -s, s * .07, s * 3); c.restore(); }
    const ck = Object.assign(newCake(), { tiers: 2, frost: 1, flavor: 'straw' });
    const ring = (tier, R, n, col) => { const pts = []; for (let k = 0; k < n; k++) { const a = k / n * TAU; pts.push({ x: Math.cos(a) * R, z: Math.sin(a) * R, a: 0, t0: -9 }); } ck.pipes.push({ tier, tip: 'star', col, pts }); };
    ring(0, .87, 22, '#FFFDF8'); ring(1, .6, 16, '#FFFDF8');
    ck.tops.push({ id: 1, k: 'cherry', tier: 1, x: 0, z: .05, v: 0, rot: 0, t0: -9 });
    drawScene(c, { cx: s * .5, by: s * .77, S: s * .335, th: 0 }, ck, { stand: 'plate', pr: 2, T: 99 });
    c.fillStyle = '#fff';
    [[.16, .24, .05], [.85, .3, .04], [.8, .12, .025]].forEach(([x, y, r]) => { c.save(); c.translate(s * x, s * y); starPath(c, s * r, .4); c.fill(); c.restore(); });
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'زينة الكيك', icon2: '🎂', isNew: true, music: 'cake',
    desc: () => App.g('صمّمي كعكتك وزيّنيها بالكريمة والفواكه', 'صمّم كعكتك وزيّنها بالكريمة والفواكه'),
    help: () => [
      '🎂 ' + App.g('اختاري', 'اختر') + ' الشكل والطبقات، ثم النكهة، ثم لون الكريمة وشاهدها تنسكب',
      '🧁 ' + App.g('ارسمي', 'ارسم') + ' بالكريمة بإصبعك على الكعكة: وردة، نقاط، كشكشة أو دوّامة',
      '🍒 ' + App.g('اسحبي', 'اسحب') + ' الفواكه والحلوى والشموع إلى الكعكة، و' + App.g('اضغطي', 'اضغط') + ' الشمعة لإشعالها أو إطفائها',
      '📋 في وضع الطلبات ' + App.g('حضّري', 'حضّر') + ' الكعكة كما يطلب الزبون لتربح حتى 3 نجوم ⭐',
      '↩️ للتراجع، و🗑️ لمسح الزينة، و💾 لحفظ صورة كعكتك في المعرض 🖼️'
    ],
    icon: menuIcon,
    best() {
      const pr = loadProg(), done = Object.keys(pr.stars).filter(k => pr.stars[k]).length, made = store.get('cakeMade', 0);
      const a = [];
      if (done) a.push(`🏆 طلبات ${done}/${ORDERS.length}`);
      if (made) a.push(`🎂 ${made}`);
      return a.join(' · ');
    },
    enter() {
      paused = false;
      const pid = App.profile ? App.profile.id : '';
      if (pid !== profId) { profId = pid; freeCake = newCake(); orderCake = null; mode = 'free'; cake = freeCake; step = 1; maxStep = 1; SPR = new Map(); parts = []; }
      if (!built) buildTray();
      showOrderCard(mode === 'orders');
      updateChips(); syncTray(); if (step === 6) renderFin();
      layout(); startLoop();
    },
    leave() {
      stopLoop(); stroke = null; drag = null; tdrag = null;
      overlays.forEach(o => o.classList.remove('on'));
    },
    pause() { paused = true; if (stroke) endPipe(); drag = null; tdrag = null; },
    resume() { paused = false; last = performance.now(); },
    back() {
      for (const o of overlays) if (o.classList.contains('on')) { o.classList.remove('on'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() { return { step, mode, orderI, cake: { shape: cake.shape, tiers: cake.tiers, flavor: cake.flavor, frost: cake.frost, pour: cake.pour, pipes: cake.pipes.length, tops: cake.tops.length }, V: { ...V }, area }; },
    _proj(ti, x, z) { const G = tiersGeo(cake.tiers); return [px(V, x), py(V, G[ti].y1, z)]; },
    _step(n) { setStep(n); },
    _order(i) { startOrder(i); },
    _free() { setFree(); }
  });
})();
