/* =====================================================================
   البرج — يدوّر الرقم الصحيح ويبني البرج طابقًا فوق طابق
   مدينة ثلاثية الأبعاد زائفة (Canvas 2D) وأبراج مشهورة تُبنى بالأرقام
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'tower';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';
  const AR_W = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
    'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر', 'عشرون'];
  const EN_W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
    'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  const AD = '٠١٢٣٤٥٦٧٨٩';
  const D = 11, FH = 1, BASE = .34, ROT = .62, DROP = .36;
  const LX = -.55, LZ = -.83; // اتجاه الضوء (من الأمام واليسار)

  /* ---------- أدوات ---------- */
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const ccache = {};
  const C = h => ccache[h] || (ccache[h] = [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
  const rgb = (a, al) => al == null ? `rgb(${a[0] | 0},${a[1] | 0},${a[2] | 0})` : `rgba(${a[0] | 0},${a[1] | 0},${a[2] | 0},${al})`;
  const lerpC = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const mul = (a, k) => [Math.min(255, a[0] * k), Math.min(255, a[1] * k), Math.min(255, a[2] * k)];
  const WHITE = [255, 255, 255], BLACK = [0, 0, 0];
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    outBack: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  };
  const rect = (x0, x1, z0, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
  function ell(rx, rz, n = 16) { const p = []; for (let i = 0; i < n; i++) { const a = -Math.PI * .75 + i * TAU / n; p.push([Math.cos(a) * rx, Math.sin(a) * rz]); } return p; }

  /* ---------- اللغة والأرقام ---------- */
  let lang = 'ar';
  const dg = n => lang === 'ar' ? String(n).replace(/\d/g, d => AD[d]) : String(n);
  const numWord = n => lang === 'ar' ? (AR_W[n] || String(n)) : (EN_W[n] || String(n));
  const sayNum = n => App.speak(numWord(n), lang === 'ar' ? 'ar' : 'en');

  /* ---------- الأبراج ---------- */
  const TOWERS = [
    { key: 'fateh', name: 'برج الفاتح', place: 'الخرطوم 🇸🇩', scene: 'nile', col: '#3BB2C0', pat: 'glass', crownH: 1.2, oval: .64,
      w: t => .2 + 2.7 * Math.pow(Math.max(0, Math.sin(Math.PI * (.2 + .74 * t))), .5) },
    { key: 'kingdom', name: 'برج المملكة', place: 'الرياض 🇸🇦', scene: 'city', col: '#86AAD2', pat: 'glass2', crownH: .2, dz: .62,
      w: t => 2.3 * (1 - .16 * t), hole: t => t < .62 ? 0 : .43 * Math.sqrt((t - .62) / .38) },
    { key: 'khalifa', name: 'برج خليفة', place: 'دبي 🇦🇪', scene: 'city', col: '#C3D0DE', pat: 'fins', crownH: 4.6, step: 1,
      w: t => 2.5 * (1 - .78 * Math.floor(t * 6) / 6) },
    { key: 'eiffel', name: 'برج إيفل', place: 'باريس 🇫🇷', scene: 'city', col: '#B8713D', pat: 'lattice', crownH: 2,
      w: t => .36 + 2.9 * Math.pow(1 - t, 2.3), legs: t => t < .36 },
    { key: 'clock', name: 'ساعة مكة', place: 'مكة المكرمة 🇸🇦', scene: 'city', col: '#EAD9BC', pat: 'stone', crownH: 6.2, step: 1,
      w: t => t < .3 ? 3.3 : 1.7 }
  ];

  /* المستويات */
  const LV = [
    { tw: 0, mode: 'up', a: 1, b: 7, show: 1, k: 4 },
    { tw: 1, mode: 'up', a: 1, b: 7, k: 4 },
    { tw: 2, mode: 'up', a: 1, b: 10, show: 1, k: 4 },
    { tw: 3, mode: 'up', a: 1, b: 10, k: 5 },
    { tw: 4, mode: 'miss', a: 1, b: 10, k: 4 },
    { tw: 0, mode: 'down', a: 10, b: 1, show: 1, k: 4 },
    { tw: 1, mode: 'up', a: 1, b: 20, k: 5 },
    { tw: 2, mode: 'by2', a: 2, b: 20, show: 1, k: 4 },
    { tw: 3, mode: 'down', a: 10, b: 1, k: 5 },
    { tw: 4, mode: 'miss', a: 1, b: 20, k: 5 },
    { tw: 0, mode: 'by2', a: 2, b: 20, k: 5 },
    { tw: 1, mode: 'miss', a: 1, b: 20, k: 5 },
    { tw: 2, mode: 'up', a: 1, b: 20, k: 6 },
    { tw: 3, mode: 'down2', a: 20, b: 2, k: 5 },
    { tw: 4, mode: 'down', a: 20, b: 1, k: 6 }
  ];
  const NL = LV.length;
  const MODE_SAY = { up: 'لنعد معا', down: 'لنعد تنازليا', down2: 'لنعد تنازليا', by2: 'لنعد بالاثنين', miss: 'ما الرقم الناقص؟' };
  const MODE_IC = { up: '⬆️', down: '⬇️', down2: '⬇️', by2: '✌️', miss: '❓' };
  function seqOf(L) {
    const s = [];
    if (L.mode === 'up' || L.mode === 'miss') for (let v = L.a; v <= L.b; v++) s.push(v);
    else if (L.mode === 'down') for (let v = L.a; v >= L.b; v--) s.push(v);
    else if (L.mode === 'by2') for (let v = L.a; v <= L.b; v += 2) s.push(v);
    else if (L.mode === 'down2') for (let v = L.a; v >= L.b; v -= 2) s.push(v);
    return s;
  }
  function modeLabel(L) {
    if (L.mode === 'miss') return dg(L.a) + ' ؟ ' + dg(L.b);
    if (L.mode === 'by2' || L.mode === 'down2') { const s = seqOf(L); return [s[0], s[1], s[2]].map(dg).join('، ') + '…'; }
    return dg(L.a) + ' ← ' + dg(L.b);
  }
  const loadProg = () => { const p = store.get('towerProg', null) || {}; return { unlocked: clamp(p.unlocked || 1, 1, NL), stars: p.stars || {} }; };

  /* ---------- الكاميرا والإسقاط ---------- */
  const cam = { cx: 200, hY: 260, f: 420, x: 0, y: 8, z: 0 };
  function pj(x, y, z) { const d = Math.max(.08, z - cam.z); return [cam.cx + cam.f * (x - cam.x) / d, cam.hY - cam.f * (y - cam.y) / d]; }
  const scl = z => cam.f / Math.max(.08, z - cam.z);
  function area(Q) { let a = 0; for (let i = 0; i < Q.length; i++) { const p = Q[i], q = Q[(i + 1) % Q.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; }
  const bil = (Q, u, v) => { const ax = Q[0][0] + (Q[1][0] - Q[0][0]) * u, ay = Q[0][1] + (Q[1][1] - Q[0][1]) * u, bx = Q[3][0] + (Q[2][0] - Q[3][0]) * u, by = Q[3][1] + (Q[2][1] - Q[3][1]) * u; return [ax + (bx - ax) * v, ay + (by - ay) * v]; };
  function poly(c, P) { c.beginPath(); c.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) c.lineTo(P[i][0], P[i][1]); c.closePath(); }

  /* منشور عام (طابق، مبنى، تاج) — قاعدته وقمته مضلّعان بعدد الرؤوس نفسه */
  function prism(c, bot, top, y0, y1, o) {
    const cs = Math.cos(o.rot || 0), sn = Math.sin(o.rot || 0), n = bot.length, ox = o.ox || 0, oz = o.oz;
    const Wd = p => [ox + p[0] * cs - p[1] * sn, oz + p[0] * sn + p[1] * cs];
    const Bw = bot.map(Wd), Tw = top.map(Wd);
    const B = Bw.map(p => pj(p[0], y0, p[1])), U = Tw.map(p => pj(p[0], y1, p[1]));
    const base = o.base, fog = o.fog || 0, lit = o.lit || 0;
    const hpx = Math.abs(B[0][1] - U[0][1]);
    const faces = [];
    for (let k = 0; k < n; k++) {
      const j = (k + 1) % n, Q = [B[k], B[j], U[j], U[k]];
      if (area(Q) > -.3) continue;
      const ex = Bw[j][0] - Bw[k][0], ez = Bw[j][1] - Bw[k][1], len = Math.hypot(ex, ez) || 1e-6;
      const nx = ez / len, nz = -ex / len;
      faces.push({ Q, len, l: .6 + .42 * Math.max(0, nx * LX + nz * LZ) + .05 * Math.max(0, -nz) });
    }
    if (o.ghost) {
      c.save(); c.setLineDash([6, 5]); c.lineWidth = 2.5; c.lineJoin = 'round'; c.strokeStyle = `rgba(255,150,30,${o.ghost})`; c.fillStyle = `rgba(255,214,120,${o.ghost * .35})`;
      for (const f of faces) { poly(c, f.Q); c.fill(); c.stroke(); }
      if (cam.y > y1) { poly(c, U); c.fill(); c.stroke(); }
      c.restore(); return faces;
    }
    const al = o.alpha == null ? 1 : o.alpha;
    if (al < 1) { c.save(); c.globalAlpha *= al; }
    for (const f of faces) {
      let col = mul(base, f.l);
      if (fog) col = lerpC(col, HAZE, fog);
      if (o.pat === 'lattice') {
        poly(c, f.Q); c.fillStyle = rgb(col, .3 + .2 * lit); c.fill();
      } else if (o.grad && hpx > 3) {
        const t = bil(f.Q, .5, 1), b = bil(f.Q, .5, 0);
        const g = c.createLinearGradient(t[0], t[1], b[0], b[1]);
        g.addColorStop(0, rgb(lerpC(col, WHITE, .2))); g.addColorStop(1, rgb(mul(col, .9)));
        poly(c, f.Q); c.fillStyle = g; c.fill();
      } else { poly(c, f.Q); c.fillStyle = rgb(col); c.fill(); }
      if (o.pat) pattern(c, f, o, col, hpx, y1 - y0, lit);
      if (o.rim !== false && hpx > 2) {
        c.lineWidth = Math.max(.8, Math.min(2, hpx * .05));
        c.strokeStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.moveTo(f.Q[3][0], f.Q[3][1]); c.lineTo(f.Q[2][0], f.Q[2][1]); c.stroke();
        c.strokeStyle = 'rgba(30,30,60,.16)'; c.beginPath(); c.moveTo(f.Q[0][0], f.Q[0][1]); c.lineTo(f.Q[1][0], f.Q[1][1]); c.stroke();
        if (n <= 4) { c.strokeStyle = 'rgba(255,255,255,.28)'; c.beginPath(); c.moveTo(f.Q[0][0], f.Q[0][1]); c.lineTo(f.Q[3][0], f.Q[3][1]); c.stroke(); }
      }
    }
    if (cam.y > y1 && o.top !== false) {
      const a = Math.abs(area(U));
      if (a > .5) {
        let col = mul(base, 1.1); if (fog) col = lerpC(col, HAZE, fog);
        if (o.topCol) col = o.topCol;
        poly(c, U); c.fillStyle = rgb(col, o.pat === 'lattice' ? .55 : 1); c.fill();
        if (o.rim !== false) { c.lineWidth = 1; c.strokeStyle = 'rgba(255,255,255,.5)'; c.stroke(); }
      }
    }
    if (al < 1) c.restore();
    return faces;
  }
  /* زخرفة الوجه: زجاج، حجر بنوافذ، شبكة حديد، زعانف... */
  function pattern(c, f, o, col, hpx, hw, lit) {
    const Q = f.Q, pat = o.pat, wpx = Math.hypot(Q[1][0] - Q[0][0], Q[1][1] - Q[0][1]);
    if (wpx < 3 || hpx < 3) return;
    c.save(); poly(c, Q); c.clip();
    const line = (u0, v0, u1, v1) => { const a = bil(Q, u0, v0), b = bil(Q, u1, v1); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); };
    if (pat === 'glass' || pat === 'glass2' || pat === 'fins') {
      const cols = Math.max(1, Math.round(f.len / (pat === 'glass2' ? .3 : .42)));
      if (lit) { poly(c, Q); c.fillStyle = `rgba(200,250,255,${.38 * lit})`; c.fill(); }
      c.beginPath();
      for (let k = 1; k < cols; k++) line(k / cols, 0, k / cols, 1);
      if (pat !== 'fins') line(0, .5, 1, .5);
      if (lit && pat !== 'fins') { c.save(); c.lineWidth = Math.max(1.5, hpx * .08); c.strokeStyle = `rgba(255,230,140,${.9 * lit})`; c.shadowColor = '#FFD76A'; c.shadowBlur = 8 * lit; c.stroke(); c.restore(); c.beginPath(); for (let k = 1; k < cols; k++) line(k / cols, 0, k / cols, 1); }
      c.lineWidth = pat === 'fins' ? Math.max(1, wpx / cols * .22) : 1;
      c.strokeStyle = pat === 'fins' ? 'rgba(255,255,255,.55)' : `rgba(255,255,255,${.3 + .3 * lit})`; c.stroke();
      if (pat === 'fins') { c.beginPath(); for (let k = 0; k < cols; k++) line((k + .5) / cols, 0, (k + .5) / cols, 1); c.lineWidth = 1; c.strokeStyle = lit ? `rgba(255,220,130,${.8 * lit})` : 'rgba(70,100,140,.25)'; c.stroke(); }
      // انعكاس لامع
      const a = bil(Q, .12, 0), b = bil(Q, .34, 0), d2 = bil(Q, .78, 1), e = bil(Q, .56, 1);
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d2[0], d2[1]); c.lineTo(e[0], e[1]); c.closePath();
      c.fillStyle = 'rgba(255,255,255,.14)'; c.fill();
    } else if (pat === 'stone' || pat === 'sand') {
      const cols = Math.max(1, Math.round(f.len / (pat === 'sand' ? .9 : .45))), rows = Math.max(1, Math.round(hw * (pat === 'sand' ? 1 : 2)));
      if (wpx / cols > 2.2 && hpx / rows > 2.2) {
        c.fillStyle = lit ? rgb(lerpC([80, 120, 160], [255, 222, 120], lit)) : (pat === 'sand' ? 'rgba(120,90,60,.35)' : '#5E86AE');
        for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
          const p0 = bil(Q, (k + .28) / cols, (r + .3) / rows), p1 = bil(Q, (k + .72) / cols, (r + .3) / rows), p2 = bil(Q, (k + .72) / cols, (r + .75) / rows), p3 = bil(Q, (k + .28) / cols, (r + .75) / rows);
          c.beginPath(); c.moveTo(p0[0], p0[1]); c.lineTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]); c.lineTo(p3[0], p3[1]); c.fill();
        }
      }
    } else if (pat === 'lattice') {
      const cols = Math.max(1, Math.round(f.len / .55));
      c.beginPath();
      for (let k = 0; k < cols; k++) { line(k / cols, 0, (k + 1) / cols, 1); line((k + 1) / cols, 0, k / cols, 1); }
      c.lineWidth = Math.max(1, hpx * .045); c.strokeStyle = rgb(mul(col, .62)); c.stroke();
      c.beginPath(); line(0, 0, 0, 1); line(1, 0, 1, 1); line(0, 0, 1, 0); line(0, 1, 1, 1);
      c.lineWidth = Math.max(1.5, hpx * .09); c.strokeStyle = lit ? rgb(lerpC(mul(col, .8), [255, 210, 110], lit)) : rgb(mul(col, .75)); c.stroke();
    } else if (pat === 'bands') {
      const rows = Math.max(1, Math.round(hw));
      if (hpx / rows > 2) {
        c.beginPath(); for (let r = 1; r <= rows; r++) line(0, (r - .45) / rows, 1, (r - .45) / rows);
        c.lineWidth = Math.max(1, hpx / rows * .28); c.strokeStyle = rgb(lerpC([140, 175, 210], HAZE, o.fog || 0), .65); c.stroke();
      }
    }
    c.restore();
  }

  /* ---------- هندسة الطوابق ---------- */
  function floorParts(T, N, i) {
    const t0 = i / N, t1 = (i + 1) / N, tm = (t0 + t1) / 2;
    let wb, wt; if (T.step) wb = wt = T.w(tm); else { wb = T.w(t0); wt = T.w(t1); }
    const P = [], dz = T.dz || 1;
    const R = (w, d = dz) => rect(-w / 2, w / 2, -w * d / 2, w * d / 2);
    if (T.oval) P.push({ b: ell(wb / 2, wb / 2 * T.oval), t: ell(wt / 2, wt / 2 * T.oval) });
    else if (T.hole && T.hole(t1) > 0) {
      const hb = T.hole(t0) * wb, ht = T.hole(t1) * wt;
      P.push({ b: rect(-wb / 2, -hb, -wb * dz / 2, wb * dz / 2), t: rect(-wt / 2, -ht, -wt * dz / 2, wt * dz / 2) });
      P.push({ b: rect(hb, wb / 2, -wb * dz / 2, wb * dz / 2), t: rect(ht, wt / 2, -wt * dz / 2, wt * dz / 2) });
    } else if (T.legs && T.legs(tm)) {
      const lf = .3;
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
        const L = w => { const a = w / 2, b = w / 2 - lf * w; const xs = sx < 0 ? [-a, -b] : [b, a], zs = sz < 0 ? [-a, -b] : [b, a]; return rect(xs[0], xs[1], zs[0], zs[1]); };
        P.push({ b: L(wb), t: L(wt) });
      }
      if ((t0 < .16 && t1 >= .16) || !T.legs(tm + 1 / N)) P.push({ b: R(wt * 1.1, 1), t: R(wt * 1.1, 1), ya: .78, yb: 1, slab: 1 });
    } else P.push({ b: R(wb), t: R(wt) });
    // ترتيب الرسم: الأبعد أولًا
    const cs = Math.cos(ROT), sn = Math.sin(ROT);
    P.forEach(p => { const cx = p.b.reduce((a, q) => a + q[0], 0) / p.b.length, cz = p.b.reduce((a, q) => a + q[1], 0) / p.b.length; p.d = cx * sn + cz * cs; });
    P.sort((a, b) => b.d - a.d);
    return { P, wb, wt };
  }
  const PLATE = ['#58C76B', '#F0605D', '#E86BD0', '#4F9CF0', '#F59A3A', '#9B6CF0', '#1FB5A8'];

  /* رسم البرج كاملًا: الطوابق المبنية + الطابق الشبح + التاج */
  function drawTower(c, tw, N, fl, opt) {
    const T = TOWERS[tw], mat = C(T.col);
    // القاعدة
    const pw = Math.max(T.w(0), T.w(.05)) / 2 + .3;
    prism(c, rect(-pw, pw, -pw, pw), rect(-pw * .96, pw * .96, -pw * .96, pw * .96), 0, BASE, { rot: ROT, oz: D, base: C('#E9DCC4'), topCol: C('#F6EEDF'), grad: 1 });
    let shake = opt.shake || 0;
    for (let i = 0; i < fl.length; i++) {
      const F = fl[i], g = floorParts(T, N, i);
      let y0 = BASE + i * FH, h = FH, ws = 1;
      if (F.off) y0 += F.off;
      if (F.sq) { h *= F.sq[0]; ws = F.sq[1]; }
      const lit = F.lit || 0;
      for (const p of g.P) {
        const sb = ws, b = p.b.map(q => [q[0] * sb, q[1] * sb]), t = p.t.map(q => [q[0] * sb, q[1] * sb]);
        const ya = y0 + (p.ya || 0) * h, yb = y0 + (p.yb == null ? 1 : p.yb) * h;
        prism(c, b, t, ya, yb, { rot: ROT, ox: shake, oz: D, base: p.slab ? mul(mat, .85) : mat, pat: p.slab ? null : T.pat, grad: 1, lit, alpha: F.alpha });
      }
      F._g = g; F._ym = y0 + h * .5;
    }
    if (opt.plates !== false) for (let i = 0; i < fl.length; i++) { const F = fl[i]; if (F.v != null) plate(c, T, F._g, F._ym, F.v, i, F.alpha == null ? 1 : F.alpha, shake); }
    if (opt.ghost && fl.length < N) {
      const i = fl.length, g = floorParts(T, N, i), y0 = BASE + i * FH;
      for (const p of g.P) prism(c, p.b, p.t, y0 + (p.ya || 0) * FH, y0 + (p.yb == null ? 1 : p.yb) * FH, { rot: ROT, oz: D, ghost: opt.ghost });
      if (opt.ghostTxt) {
        const [x, y] = pj(0, y0 + .5, D - g.wb * .3), s = scl(D) * .62;
        c.save(); c.globalAlpha = opt.ghost; c.font = `900 ${s}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
        c.fillStyle = '#fff'; c.strokeStyle = 'rgba(220,110,0,.75)'; c.lineWidth = 4; c.lineJoin = 'round'; c.strokeText(opt.ghostTxt, x, y); c.fillText(opt.ghostTxt, x, y); c.restore();
      }
    }
    if (opt.crown != null && opt.crown > 0) drawCrown(c, tw, N, opt.crown, opt.crownLit || 0, shake);
  }
  function plate(c, T, g, ym, v, i, al, ox) {
    const s = scl(D), w0 = (g.wb + g.wt) / 2;
    let fz = T.oval ? w0 / 2 * T.oval : w0 * (T.dz || 1) / 2 * .95;
    if (T.legs && fz > .7) fz = .7;
    const [x, y] = pj(ox, ym, D - fz);
    const h = Math.min(s * .66, 34); if (h < 9) return;
    const txt = dg(v), w = h * (txt.length > 1 ? 1.4 : 1.02), col = PLATE[i % PLATE.length];
    c.save(); c.globalAlpha *= al;
    c.fillStyle = 'rgba(20,30,60,.25)'; c.beginPath(); c.roundRect(x - w / 2, y - h / 2 + h * .08, w, h, h * .28); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, h * .28); c.fill();
    c.lineWidth = Math.max(1.5, h * .1); c.strokeStyle = col; c.beginPath(); c.roundRect(x - w / 2 + h * .06, y - h / 2 + h * .06, w - h * .12, h - h * .12, h * .22); c.stroke();
    c.font = `900 ${h * .68}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
    c.fillStyle = '#2B3A67'; c.fillText(txt, x, y + h * .06);
    c.restore();
  }
  function sphere(c, x, y, z, r, c1, c2) {
    const [px, py] = pj(x, y, z), R = r * scl(z);
    const g = c.createRadialGradient(px - R * .35, py - R * .4, R * .1, px, py, R);
    g.addColorStop(0, c1); g.addColorStop(1, c2);
    c.fillStyle = g; c.beginPath(); c.arc(px, py, R, 0, TAU); c.fill();
    return [px, py, R];
  }
  function drawCrown(c, tw, N, k, lit, ox) {
    const T = TOWERS[tw], top = BASE + N * FH, drop = (1 - ease.outCubic(Math.min(1, k))) * 4, y = top + drop;
    const al = Math.min(1, k * 2.5);
    c.save(); c.globalAlpha *= al;
    const o = (base, extra) => Object.assign({ rot: ROT, ox, oz: D, base: C(base), grad: 1 }, extra || {});
    if (T.key === 'fateh') {
      const w0 = T.w(1), ov = T.oval;
      for (let k2 = 0; k2 < 4; k2++) {
        const a0 = k2 / 4 * Math.PI / 2, a1 = (k2 + 1) / 4 * Math.PI / 2, r0 = w0 / 2 * Math.cos(a0), r1 = Math.max(.02, w0 / 2 * Math.cos(a1));
        prism(c, ell(r0, r0 * ov), ell(r1, r1 * ov), y + Math.sin(a0) * .55, y + Math.sin(a1) * .55, o(T.col, { pat: k2 < 2 ? 'glass' : null, lit }));
      }
      prism(c, ell(.06, .06, 8), ell(.015, .015, 8), y + .5, y + 1.1, o('#DDE8EE'));
      const [px, py, R] = sphere(c, ox, y + 1.12, D, .06, '#FFFFFF', '#FF5A5F');
      if (lit) { c.fillStyle = `rgba(255,90,95,${.35 * lit})`; c.beginPath(); c.arc(px, py, R * 4, 0, TAU); c.fill(); }
    } else if (T.key === 'kingdom') {
      const yb = BASE + N * .9 * FH, w = T.w(.9) * .62;
      prism(c, rect(-w / 2, w / 2, -.18, .18), rect(-w / 2, w / 2, -.18, .18), yb - drop, yb + .32 - drop, o('#B9CCE0', { pat: 'glass2', lit }));
    } else if (T.key === 'khalifa') {
      prism(c, rect(-.3, .3, -.3, .3), rect(-.03, .03, -.03, .03), y, y + 4.6, o('#D7E0EA', { pat: 'fins', lit }));
    } else if (T.key === 'eiffel') {
      prism(c, rect(-.26, .26, -.26, .26), rect(-.2, .2, -.2, .2), y, y + .55, o('#A9652F', { lit }));
      prism(c, rect(-.07, .07, -.07, .07), rect(-.02, .02, -.02, .02), y + .55, y + 2, o('#8E5428'));
      if (lit) { const [px, py] = pj(ox, y + 2, D); c.fillStyle = `rgba(255,240,180,${.5 * lit})`; c.beginPath(); c.arc(px, py, 6, 0, TAU); c.fill(); }
    } else if (T.key === 'clock') {
      const fc = prism(c, rect(-1.05, 1.05, -1.05, 1.05), rect(-1.05, 1.05, -1.05, 1.05), y, y + 2.1, o('#EAD9BC', { pat: null }));
      for (const f of fc) clockFace(c, f.Q, lit);
      prism(c, rect(-.8, .8, -.8, .8), rect(-.3, .3, -.3, .3), y + 2.1, y + 3.2, o('#2FA36B', { pat: 'fins', lit }));
      prism(c, rect(-.22, .22, -.22, .22), rect(-.03, .03, -.03, .03), y + 3.2, y + 5.6, o('#E7B640'));
      const [px, py] = pj(ox, y + 5.95, D), R = .32 * scl(D);
      c.fillStyle = '#F2C443'; c.beginPath(); c.arc(px, py, R, -Math.PI * .1, Math.PI * 1.1, false); c.arc(px, py - R * .3, R * .82, Math.PI * 1.1, -Math.PI * .1, true); c.fill();
      if (lit) { c.fillStyle = `rgba(80,255,150,${.25 * lit})`; c.beginPath(); c.arc(pj(ox, y + 1.05, D)[0], pj(ox, y + 1.05, D)[1], 2.2 * scl(D), 0, TAU); c.fill(); }
    }
    c.restore();
  }
  function clockFace(c, Q, lit) {
    const ctr = bil(Q, .5, .5), w = Math.hypot(Q[1][0] - Q[0][0], Q[1][1] - Q[0][1]), h = Math.abs(Q[3][1] - Q[0][1]);
    const rx = w * .38, ry = h * .38; if (rx < 3) return;
    c.save(); c.translate(ctr[0], ctr[1]);
    const ang = Math.atan2(Q[1][1] - Q[0][1], Q[1][0] - Q[0][0]);
    c.rotate(ang); c.scale(1, ry / rx);
    c.fillStyle = '#E8B33A'; c.beginPath(); c.arc(0, 0, rx * 1.12, 0, TAU); c.fill();
    c.fillStyle = lit ? rgb(lerpC(WHITE, [140, 255, 180], lit)) : '#FFFFFF'; c.beginPath(); c.arc(0, 0, rx, 0, TAU); c.fill();
    c.strokeStyle = '#1E8A55'; c.lineWidth = rx * .1; c.beginPath(); c.arc(0, 0, rx * .86, 0, TAU); c.stroke();
    c.strokeStyle = '#223'; c.lineCap = 'round'; c.lineWidth = rx * .1;
    c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -rx * .6); c.moveTo(0, 0); c.lineTo(rx * .42, rx * .1); c.stroke();
    c.restore();
  }

  /* ---------- المشهد ---------- */
  const HAZE = [214, 232, 246];
  let SC = null; // عناصر المشهد الحالي
  function buildScene(kind) {
    const R = rng(kind === 'nile' ? 101 : 77), S = { kind, bld: [], palms: [], clouds: [], boats: [], waves: [] };
    const free = (x, w, z) => {
      if (kind === 'nile') { if (x - w / 2 < 9.6 && z < D + 37) return false; if (z > D + 36 && z < D + 56) return false; }
      else { if (Math.abs(x) - w / 2 < 9.6 && Math.abs(x) + w / 2 > 4.6) return false; if (Math.abs(z - (D + 6.6)) < 3 + w / 2) return false; if (Math.abs(x) < 4.5 + w / 2 && z < D + 8) return false; }
      return true;
    };
    let guard = 0;
    while (S.bld.length < (kind === 'nile' ? 44 : 50) && guard++ < 900) {
      const z = D + 7 + R() * 95, w = kind === 'nile' ? 2.2 + R() * 3.4 : 2.4 + R() * 3.2, d = 2 + R() * 3;
      let x = (R() * 2 - 1) * 62;
      if (!free(x, w, z)) continue;
      if (S.bld.some(b => Math.abs(b.x - x) < (b.w + w) / 2 + .6 && Math.abs(b.z - z) < (b.d + d) / 2 + .6)) continue;
      let h = kind === 'nile' ? 1.2 + R() * 3.6 : 3 + R() * 11 + (z > D + 40 ? R() * 6 : 0);
      if (kind === 'nile' && R() < .12) h += 5;
      const col = kind === 'nile' ? pick(['#E9D3A8', '#E2C592', '#F1E2C2', '#D9B98A', '#EEDDBB']) : pick(['#F7F7F3', '#EEF3F8', '#E6EFF8', '#F6F1E8', '#FFFFFF']);
      S.bld.push({ x, z, w, d, h, c: C(col), pat: kind === 'nile' ? 'sand' : 'bands', dome: kind === 'nile' && R() < .15 });
    }
    // نخيل
    const lanes = kind === 'nile' ? [-5.1, 4.7, 9.7] : [-9.7, -4.7, 4.7, 9.7];
    for (const x of lanes) for (let z = D - 9; z < D + (kind === 'nile' ? 36 : 60); z += 3.1) {
      if (kind === 'city' && Math.abs(z - (D + 6.6)) < 2.4) continue;
      if (Math.abs(z - (D - 5.5)) < 2.2 && x > 0) continue;
      S.palms.push({ x: x + (R() - .5) * .5, z: z + (R() - .5) * .8, s: .85 + R() * .35, v: R() < .5 ? 0 : 1 });
    }
    if (kind === 'nile') for (let x = 11; x < 60; x += 3.3) S.palms.push({ x, z: D + 34.5 + R(), s: .9 + R() * .3, v: R() < .5 ? 0 : 1 });
    // سحب
    const RC = rng(5);
    for (let i = 0; i < 14; i++) S.clouds.push({ x: (RC() * 2 - 1) * 40, y: 8 + RC() * 9 + (i > 8 ? 12 + RC() * 14 : 0), z: D + 16 + RC() * 55, s: 7 + RC() * 6, v: i % 3 });
    if (kind === 'nile') {
      S.boats.push({ x: -13, z: D + 6, sp: .25 }, { x: -22, z: D + 22, sp: -.18 }, { x: -9.5, z: D - 3, sp: .12 });
      for (let i = 0; i < 70; i++) S.waves.push({ x: -7.5 - R() * 40, z: D - 10 + R() * 47, ph: R() * TAU });
      for (let i = 0; i < 40; i++) S.waves.push({ x: (R() * 2 - 1) * 60, z: D + 38 + R() * 16, ph: R() * TAU });
    }
    return S;
  }
  const sprites = {};
  function palmSprite(v, dark) {
    const k = v + (dark ? 'd' : '');
    if (sprites['p' + k]) return sprites['p' + k];
    const W = 150, H = 190, cv2 = document.createElement('canvas'); cv2.width = W; cv2.height = H;
    const c = cv2.getContext('2d'); const lean = v ? -1 : 1;
    // الجذع
    const tx = W / 2 + lean * 16, ty = 62;
    c.lineCap = 'round';
    for (let i = 0; i < 12; i++) {
      const t0 = i / 12, t1 = (i + 1) / 12;
      const x0 = W / 2 + lean * 16 * t0 * t0, y0 = H - 4 - (H - 4 - ty) * t0, x1 = W / 2 + lean * 16 * t1 * t1, y1 = H - 4 - (H - 4 - ty) * t1;
      c.strokeStyle = i % 2 ? '#A06A3C' : '#8A5A31'; c.lineWidth = 13 - t0 * 4; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
    }
    c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 3; c.beginPath(); c.moveTo(W / 2 - 3, H - 6); c.quadraticCurveTo(W / 2 - 3 + lean * 4, (H + ty) / 2, tx - 3, ty + 6); c.stroke();
    // السعف
    const leaves = [-2.75, -2.25, -1.75, -1.25, -.75, -.35, .1, -3.1, -1.5].map((a, i) => ({ a, l: 52 + (i % 3) * 8 }));
    const drawLeaf = (a, l, dk) => {
      c.save(); c.translate(tx, ty); c.rotate(a);
      const g = c.createLinearGradient(0, 0, l, 0); g.addColorStop(0, dk ? '#2E8B3E' : '#5BD06A'); g.addColorStop(1, dk ? '#1F6D30' : '#36A847');
      c.fillStyle = g; c.beginPath(); c.moveTo(0, 0);
      c.quadraticCurveTo(l * .45, -16, l, 10); c.quadraticCurveTo(l * .5, 4, 0, 6); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(2, 2); c.quadraticCurveTo(l * .45, -8, l - 2, 9); c.stroke();
      c.restore();
    };
    leaves.slice(7).forEach(L => drawLeaf(L.a, L.l, 1));
    c.fillStyle = '#7A4A22'; [[-6, 6], [5, 7], [0, 10]].forEach(([x, y]) => { c.beginPath(); c.arc(tx + x, ty + y, 5, 0, TAU); c.fill(); });
    leaves.slice(0, 7).forEach(L => drawLeaf(L.a, L.l, 0));
    if (dark) { c.globalCompositeOperation = 'source-atop'; c.fillStyle = 'rgba(25,20,70,.55)'; c.fillRect(0, 0, W, H); }
    cv2.ax = W / 2; return sprites['p' + k] = cv2;
  }
  function cloudSprite(v) {
    if (sprites['c' + v]) return sprites['c' + v];
    const W = 340, H = 190, cv2 = document.createElement('canvas'); cv2.width = W; cv2.height = H;
    const c = cv2.getContext('2d'), R = rng(31 + v * 17);
    const puffs = [];
    for (let i = 0; i < 11; i++) { const t = i / 10; puffs.push({ x: 60 + t * 220 + (R() - .5) * 30, y: 120 - Math.sin(t * Math.PI) * (40 + R() * 25), r: 38 + Math.sin(t * Math.PI) * 30 + R() * 14 }); }
    for (let i = 0; i < 6; i++) puffs.push({ x: 70 + R() * 200, y: 128 + R() * 10, r: 30 + R() * 14 });
    puffs.sort((a, b) => a.y - b.y);
    // ظل سفلي
    c.fillStyle = '#C3D2E6'; puffs.forEach(p => { c.beginPath(); c.arc(p.x, p.y + 6, p.r, 0, TAU); c.fill(); });
    puffs.forEach(p => {
      const g = c.createRadialGradient(p.x - p.r * .35, p.y - p.r * .45, p.r * .1, p.x, p.y, p.r);
      g.addColorStop(0, '#FFFFFF'); g.addColorStop(.65, '#F4F8FD'); g.addColorStop(1, '#D6E1EE');
      c.fillStyle = g; c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.fill();
    });
    c.globalCompositeOperation = 'destination-out'; c.fillStyle = '#000'; c.fillRect(0, H - 22, W, 22);
    return sprites['c' + v] = cv2;
  }

  /* أرضية مع قصّ عند مستوى قريب */
  let zNear = 1;
  function gpoly(c, pts) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i], b = pts[(i + 1) % pts.length], ia = a[1] >= zNear, ib = b[1] >= zNear;
      if (ia) out.push(a);
      if (ia !== ib) { const t = (zNear - a[1]) / (b[1] - a[1]); out.push([a[0] + (b[0] - a[0]) * t, zNear]); }
    }
    if (out.length < 3) return false;
    poly(c, out.map(p => pj(p[0], 0, p[1]))); return true;
  }
  function drawSky(c, W, H, dusk, finT) {
    const hY = cam.hY;
    const g = c.createLinearGradient(0, 0, 0, hY);
    g.addColorStop(0, rgb(lerpC([78, 160, 236], [34, 30, 92], dusk))); g.addColorStop(.6, rgb(lerpC([140, 204, 247], [96, 70, 150], dusk))); g.addColorStop(1, rgb(lerpC([212, 236, 251], [250, 170, 140], dusk)));
    c.fillStyle = g; c.fillRect(0, 0, W, hY + 2);
    if (dusk > 0) {
      c.fillStyle = '#fff';
      const R = rng(9);
      for (let i = 0; i < 60; i++) { const x = R() * W, y = R() * hY * .8, tw = .5 + .5 * Math.sin(finT * 3 + i); c.globalAlpha = dusk * tw * .8; c.beginPath(); c.arc(x, y, 1 + R() * 1.3, 0, TAU); c.fill(); }
      c.globalAlpha = 1;
    }
    // كواكب
    const off = clamp((cam.y - 8) * 1.2, -30, 60);
    const pr = Math.min(W, H) * .12, px = pr * .5, py = hY * .42 + off * .4;
    c.save();
    let gg = c.createRadialGradient(px - pr * .3, py - pr * .35, pr * .1, px, py, pr);
    gg.addColorStop(0, '#FFC46B'); gg.addColorStop(.7, '#F28A2E'); gg.addColorStop(1, '#D9661C');
    c.strokeStyle = '#F5C54A'; c.lineWidth = pr * .12;
    c.beginPath(); c.ellipse(px, py, pr * 1.55, pr * .42, -.32, Math.PI, TAU); c.stroke();
    c.fillStyle = gg; c.beginPath(); c.arc(px, py, pr, 0, TAU); c.fill();
    c.beginPath(); c.ellipse(px, py, pr * 1.55, pr * .42, -.32, 0, Math.PI); c.stroke();
    const qx = W - pr * 1.1, qy = hY * .3 + off * .3, qr = pr * .5;
    gg = c.createRadialGradient(qx - qr * .3, qy - qr * .35, qr * .1, qx, qy, qr);
    gg.addColorStop(0, '#B98CFF'); gg.addColorStop(1, '#6E3FD0');
    c.fillStyle = gg; c.beginPath(); c.arc(qx, qy, qr, 0, TAU); c.fill();
    c.restore();
  }
  function drawGround(c, W, H, T, dusk) {
    const kind = SC.kind, hY = cam.hY;
    zNear = Math.max(cam.z + .3, cam.z + cam.f * Math.max(.1, cam.y) / Math.max(1, (H - hY)) * .92);
    const zF = cam.z + 180;
    let g = c.createLinearGradient(0, hY, 0, H);
    const sand = kind === 'nile' ? [238, 217, 176] : [242, 228, 202];
    g.addColorStop(0, rgb(HAZE)); g.addColorStop(.12, rgb(lerpC(sand, HAZE, .45))); g.addColorStop(1, rgb(sand));
    c.fillStyle = g; c.fillRect(0, hY, W, H - hY + 2);
    // بلاطات
    c.save(); c.beginPath();
    for (let x = -40; x <= 40; x += 1.6) { const a = pj(x, 0, zNear), b = pj(x, 0, cam.z + 60); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); }
    for (let z = Math.ceil(zNear / 1.6) * 1.6; z < cam.z + 50; z += 1.6) { const a = pj(-60, 0, z), b = pj(60, 0, z); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); }
    g = c.createLinearGradient(0, hY, 0, H); g.addColorStop(0, 'rgba(190,160,120,0)'); g.addColorStop(.3, 'rgba(190,160,120,.25)'); g.addColorStop(1, 'rgba(190,160,120,.45)');
    c.strokeStyle = g; c.lineWidth = 1; c.stroke(); c.restore();
    // ساحة البرج
    const pd = 3.6;
    const sq = (x0, x1, z0, z1, col) => { if (gpoly(c, [[x0, z0], [x1, z0], [x1, z1], [x0, z1]])) { c.fillStyle = col; c.fill(); } };
    sq(-pd - .3, pd + .3, D - pd - .3, D + pd + .3, '#E3CFA9');
    sq(-pd, pd, D - pd, D + pd, '#F8EFDD');
    const road = (x0, x1, z0, z1, along) => {
      if (!gpoly(c, [[x0, z0], [x1, z0], [x1, z1], [x0, z1]])) return;
      const gg = c.createLinearGradient(0, hY, 0, H); gg.addColorStop(0, 'rgb(170,180,195)'); gg.addColorStop(.25, '#6B7487'); gg.addColorStop(1, '#4E5668');
      c.fillStyle = gg; c.fill();
      c.fillStyle = 'rgba(255,255,255,.85)';
      if (along === 'z') {
        for (const xe of [x0, x1 - .22]) if (gpoly(c, [[xe, z0], [xe + .22, z0], [xe + .22, z1], [xe, z1]])) c.fill();
        const xm = (x0 + x1) / 2;
        for (let z = Math.max(z0, Math.floor(zNear)); z < Math.min(z1, cam.z + 70); z += 1.8) if (gpoly(c, [[xm - .07, z], [xm + .07, z], [xm + .07, z + .9], [xm - .07, z + .9]])) c.fill();
      } else {
        for (const ze of [z0, z1 - .22]) if (gpoly(c, [[x0, ze], [x1, ze], [x1, ze + .22], [x0, ze + .22]])) c.fill();
        const zm = (z0 + z1) / 2;
        for (let x = -40; x < 40; x += 1.8) if (gpoly(c, [[x, zm - .07], [x + .9, zm - .07], [x + .9, zm + .07], [x, zm + .07]])) c.fill();
      }
    };
    if (kind === 'city') {
      road(-9, -5.4, zNear, zF, 'z'); road(5.4, 9, zNear, zF, 'z');
      road(-200, 200, D + 4.8, D + 8.4, 'x'); road(-200, 200, D - 7.4, D - 3.9, 'x');
    } else {
      // النيل: الأزرق على اليسار يلتقي بالأبيض في الأفق
      const water = (pts) => { if (!gpoly(c, pts)) return; const gg = c.createLinearGradient(0, hY, 0, H); gg.addColorStop(0, rgb(lerpC([150, 205, 225], HAZE, .3))); gg.addColorStop(.3, '#4DB3D3'); gg.addColorStop(1, '#2A8FC0'); c.fillStyle = gg; c.fill(); };
      if (gpoly(c, [[-200, zNear], [-6, zNear], [-6, D + 37.6], [-200, D + 37.6]])) { c.fillStyle = '#E2C38D'; c.fill(); }
      water([[-200, zNear], [-6.8, zNear], [-6.8, D + 38.2], [-200, D + 38.2]]);
      if (gpoly(c, [[-200, D + 36.6], [200, D + 36.6], [200, D + 57], [-200, D + 57]])) { c.fillStyle = '#E2C38D'; c.fill(); }
      water([[-200, D + 37.3], [200, D + 37.3], [200, D + 56], [-200, D + 56]]);
      // لمعان الماء
      c.save(); c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineCap = 'round';
      for (const w of SC.waves) {
        if (w.z < zNear) continue;
        const [x, y] = pj(w.x + Math.sin(T * .6 + w.ph) * .3, 0, w.z), s = scl(w.z), a = .5 + .5 * Math.sin(T * 2 + w.ph);
        if (s < 3) continue;
        c.globalAlpha = a * .8; c.lineWidth = Math.max(1, s * .05); c.beginPath(); c.moveTo(x - s * .3, y); c.quadraticCurveTo(x, y - s * .08, x + s * .3, y); c.stroke();
      }
      c.restore();
      road(5.4, 9, zNear, D + 36, 'z'); road(-6, 200, D - 7.4, D - 3.9, 'x');
    }
    // ظل البرج
    if (fl.length) {
      const sh = [], N = floorsN, Tt = TOWERS[L.tw], cs = Math.cos(ROT), sn = Math.sin(ROT);
      const push = (pts, y) => pts.map(p => [p[0] * cs - p[1] * sn + y * .55, D + p[0] * sn + p[1] * cs + y * .5]);
      c.save(); c.fillStyle = 'rgba(80,60,100,.18)'; c.beginPath();
      for (let i = 0; i < fl.length; i++) {
        const g2 = floorParts(Tt, N, i), y0 = BASE + i * FH, y1 = y0 + FH;
        for (const p of g2.P) {
          const A = push(p.b, y0), B2 = push(p.t, y1);
          const hull = convexHull(A.concat(B2)).filter(q => q[1] >= zNear);
          if (hull.length < 3) continue;
          const sp = hull.map(q => pj(q[0], 0, q[1])); c.moveTo(sp[0][0], sp[0][1]); for (let k = 1; k < sp.length; k++) c.lineTo(sp[k][0], sp[k][1]); c.closePath();
        }
      }
      c.fill('nonzero'); c.restore();
    }
  }
  function convexHull(P) {
    P = P.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const p of P) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    up.pop(); lo.pop(); return lo.concat(up); // اتجاه موحّد عكس عقارب الساعة
  }
  function drawBuilding(c, b) {
    const fog = clamp((b.z - D - 8) / 95, 0, .7);
    const y1 = b.h;
    prism(c, rect(-b.w / 2, b.w / 2, -b.d / 2, b.d / 2), rect(-b.w / 2, b.w / 2, -b.d / 2, b.d / 2), 0, y1, { ox: b.x, oz: b.z, base: b.c, pat: b.pat, fog, rim: scl(b.z) > 8 });
    if (b.dome) {
      const [px, py, R] = (() => { const p = pj(b.x, y1, b.z); return [p[0], p[1], Math.min(b.w, b.d) * .3 * scl(b.z)]; })();
      c.fillStyle = rgb(lerpC([236, 236, 236], HAZE, fog)); c.beginPath(); c.arc(px, py, R, Math.PI, TAU); c.fill();
    }
  }
  function drawPalm(c, p, dusk) {
    if (p.z < zNear + .5) return;
    const [x, y] = pj(p.x, 0, p.z), s = scl(p.z), h = 2.7 * p.s * s;
    if (h < 3 || x < -h || x > Wd + h) return;
    c.fillStyle = 'rgba(80,60,40,.18)'; c.beginPath(); c.ellipse(x + h * .12, y, h * .26, h * .07, 0, 0, TAU); c.fill();
    const sp = palmSprite(p.v), w = h * sp.width / sp.height;
    const fog = clamp((p.z - D - 10) / 80, 0, .6);
    c.drawImage(sp, x - w / 2, y - h, w, h);
    if (dusk > 0) { c.globalAlpha = dusk; c.drawImage(palmSprite(p.v, 1), x - w / 2, y - h, w, h); c.globalAlpha = 1; }
    if (fog > .05) { c.globalAlpha = fog * .6; c.drawImage(palmSprite(p.v, 1), x - w / 2, y - h, w, h); c.globalAlpha = 1; }
  }
  function drawCloud(c, cl) {
    const z = cl.z, s = scl(z), w = cl.s * s; if (w < 4) return;
    const [x, y] = pj(cl.x + Math.sin(Tm * .05 + cl.v) * 1.5, cl.y, z), sp = cloudSprite(cl.v), h = w * sp.height / sp.width;
    if (x + w < 0 || x - w > Wd) return;
    c.drawImage(sp, x - w / 2, y - h * .7, w, h);
  }
  function drawBoat(c, b) {
    if (b.z < zNear + .3) return;
    const [x, y] = pj(b.x, 0, b.z), s = scl(b.z);
    const L = 1.6 * s;
    c.fillStyle = 'rgba(20,60,90,.25)'; c.beginPath(); c.ellipse(x, y + s * .05, L * .6, s * .1, 0, 0, TAU); c.fill();
    c.fillStyle = '#8C5A30'; c.beginPath(); c.moveTo(x - L * .55, y - s * .18); c.lineTo(x + L * .55, y - s * .18); c.lineTo(x + L * .38, y + s * .02); c.lineTo(x - L * .4, y + s * .02); c.closePath(); c.fill();
    c.strokeStyle = '#5B3A1E'; c.lineWidth = Math.max(1, s * .04); c.beginPath(); c.moveTo(x, y - s * .18); c.lineTo(x, y - s * 1.6); c.stroke();
    const g = c.createLinearGradient(x, y - s * 1.6, x + L * .6, y); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#E3E9EF');
    c.fillStyle = g; c.beginPath(); c.moveTo(x + s * .05, y - s * 1.7); c.quadraticCurveTo(x + L * .65, y - s * .9, x + L * .5, y - s * .3); c.lineTo(x + s * .05, y - s * .3); c.closePath(); c.fill();
  }

  /* ---------- الواجهة ---------- */
  App.css(`
  #tower{background:#8CCBF7;overflow:hidden}
  #tower canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #tower .ib{color:#2B4C8C;background:rgba(255,255,255,.95);box-shadow:0 3px 0 rgba(30,60,120,.25)}
  #tower .ttl{position:absolute;left:50%;transform:translateX(-50%);top:max(14px,calc(env(safe-area-inset-top) + 4px));z-index:6;background:#fff;color:#22305E;
    font-weight:900;font-size:clamp(15px,4.4vw,19px);padding:5px 18px 4px;border-radius:99px;box-shadow:0 4px 0 rgba(30,60,120,.22),0 6px 14px rgba(0,0,0,.12);white-space:nowrap;max-width:calc(100% - 230px);overflow:hidden;text-overflow:ellipsis;pointer-events:none}
  #tower .ttl small{display:block;font-size:11px;font-weight:700;opacity:.6;text-align:center;line-height:1}
  #tower .prm{position:absolute;z-index:4;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 60px);display:flex;align-items:center;gap:6px;
    padding:6px 10px;border-radius:20px;background:rgba(255,255,255,.93);box-shadow:0 4px 0 rgba(30,60,120,.2),0 8px 18px rgba(0,0,0,.1);transition:opacity .3s,transform .3s;cursor:pointer}
  #tower .prm.off{opacity:0;pointer-events:none;transform:translateX(-50%) translateY(-10px)}
  #tower .prm.bump{animation:twBump .45s}
  @keyframes twBump{40%{transform:translateX(-50%) scale(1.08)}}
  #tower .prm i{font-style:normal;min-width:38px;height:40px;padding:0 5px;border-radius:12px;display:grid;place-items:center;font-weight:900;font-size:24px;color:#2B3A67;background:#F1F5FB;border:3px solid #D9E3F2}
  #tower .prm i.q{background:#FFF6D6;border-color:#FFC531;color:#E89B0C;animation:twQ 1.2s ease-in-out infinite}
  #tower .prm i.q.sh{color:rgba(232,155,12,.45)}
  #tower .prm i.dim{opacity:.55}
  @keyframes twQ{50%{transform:translateY(-3px);box-shadow:0 4px 10px rgba(255,180,0,.45)}}
  #tower .bot{position:absolute;left:0;right:0;bottom:0;z-index:5;display:flex;align-items:center;gap:8px;padding:8px 12px max(12px,env(safe-area-inset-bottom));pointer-events:none}
  #tower .bot > *{pointer-events:auto}
  #tower .spk{width:58px;height:58px;flex:0 0 58px;border-radius:50%;font-size:26px;display:grid;place-items:center;
    background:radial-gradient(circle at 35% 30%,#FFE98A,#FFC21A 60%,#E9A300);box-shadow:0 5px 0 #C98600,0 8px 16px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.6)}
  #tower .spk:active{transform:translateY(3px);box-shadow:0 2px 0 #C98600}
  #tower .spk.pulse{animation:twSpk 1s ease-in-out 2}
  @keyframes twSpk{50%{transform:scale(1.12)}}
  #tower .pbar{flex:1;max-width:560px;margin:0 auto;display:flex;gap:3px;padding:6px 8px;border-radius:99px;background:rgba(255,255,255,.88);box-shadow:0 3px 0 rgba(30,60,120,.18);min-width:0}
  #tower .pbar i{flex:1;height:12px;border-radius:6px;background:#DCE4EF;box-shadow:inset 0 2px 2px rgba(0,0,0,.1)}
  #tower .pbar i.on{background:linear-gradient(#FFB35C,#FF8A1F);box-shadow:0 2px 0 #D96A00;animation:pop .3s}
  #tower .pbar i.cur{background:#FFE7B5;box-shadow:0 0 0 2px #FFB35C}
  #tower .lng{display:flex;background:rgba(255,255,255,.9);border-radius:99px;padding:3px;gap:2px;box-shadow:0 3px 0 rgba(30,60,120,.18)}
  #tower .lng button{padding:4px 9px;border-radius:99px;font-weight:900;font-size:15px;background:transparent;color:#2B3A67;line-height:1.2}
  #tower .lng button.on{background:#4F9CF0;color:#fff;box-shadow:0 2px 0 #2C6FC0}
  #tower .panel{border-color:#CFE3FA;box-shadow:0 8px 0 #9CC3EE,0 20px 40px rgba(0,30,80,.3);color:#22305E}
  #tower .panel h3{color:#2C6FC0}
  #tower .btn{background:#4F9CF0;box-shadow:0 4px 0 #2C6FC0}
  #tower .btn:active{box-shadow:0 1px 0 #2C6FC0}
  #tower .btn.alt{background:#fff;color:#2C6FC0;box-shadow:0 4px 0 #BFD7F3;border-color:#DCEAFB}
  #tower .overlay{background:rgba(20,40,90,.38)}
  #tower .lvp{width:min(94vw,460px);padding:16px 12px 14px}
  #tower .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-height:min(64vh,620px);overflow-y:auto;touch-action:pan-y;padding:6px 4px 10px;margin:8px 0 10px}
  #tower .lv{position:relative;border-radius:20px;background:linear-gradient(#BFE3FF,#F3E4C6);padding:6px 4px 6px;display:flex;flex-direction:column;align-items:center;gap:1px;
    box-shadow:0 5px 0 #9CC3EE,inset 0 0 0 3px #fff;color:#22305E}
  #tower .lv:active{transform:translateY(3px);box-shadow:0 2px 0 #9CC3EE,inset 0 0 0 3px #fff}
  #tower .lv canvas{width:72px;height:84px;display:block}
  #tower .lv b{font-size:13px;line-height:1.2}
  #tower .lv .md{font-size:12px;font-weight:800;color:#2C6FC0;background:#fff;border-radius:99px;padding:0 8px}
  #tower .lv .n{position:absolute;top:4px;right:6px;width:24px;height:24px;border-radius:50%;background:#FF8A1F;color:#fff;font-weight:900;font-size:14px;display:grid;place-items:center;box-shadow:0 2px 0 #D96A00}
  #tower .lv .s{font-size:12px;letter-spacing:-2px}
  #tower .lv .s i{font-style:normal}
  #tower .lv .s i.off{filter:grayscale(1);opacity:.35}
  #tower .lv.lock{filter:grayscale(.85);opacity:.6}
  #tower .lv.lock::after{content:'🔒';position:absolute;top:30px;font-size:26px}
  #tower .lv.cur{box-shadow:0 5px 0 #FF8A1F,inset 0 0 0 3px #FFB35C}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <span class="grow"></span>
      <button class="ib xbtn" aria-label="المستويات">✕</button>
    </div>
    <div class="ttl"><span class="tN">برج الفاتح</span><small class="tP"></small></div>
    <div class="prm off" role="button" aria-label="إعادة السؤال"></div>
    <div class="bot">
      <button class="spk" aria-label="استمع">🔊</button>
      <div class="pbar"></div>
      <div class="lng"><button data-l="ar">١٢٣</button><button data-l="en">123</button></div>
    </div>
    <div class="overlay" id="twLv"><div class="panel lvp"><h3>🏙️ اختر البرج</h3>
      <div class="grid"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="twWin"><div class="panel">
      <h3 class="wT"></h3><div class="wN" style="font-weight:800;font-size:18px"></div><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">البرج التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🏙️ الأبراج</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const prm = root.querySelector('.prm'), pbar = root.querySelector('.pbar'), spk = root.querySelector('.spk');
  const lvOv = root.querySelector('#twLv'), winOv = root.querySelector('#twWin');
  const tN = root.querySelector('.tN'), tP = root.querySelector('.tP');

  /* ---------- الحالة ---------- */
  let ctx, Wd = 0, Hd = 0, dpr = 1, portrait = true;
  let raf = 0, last = 0, Tm = 0, running = false, paused = false;
  let lvl = 1, L = LV[0], seq = [], floorsN = 7, missing = new Set(), si = 0, phase = 'idle';
  let fl = [], cards = [], parts = [], fw = [], evs = [], mistakes = 0, wrongStep = 0, lastAct = 0, hintT = -9;
  let camYT = 8, camZT = 0, camHmin = 8, towerShake = 0, crownK = 0, crownT = -1, duskT = -1, litT = -1, finT = -1;
  let drag = null, keyBuf = '', keyT = -1, cardS = 60, colX = 0, colY0 = 0, colGap = 0, topS = 0, baseS = 0;

  const after = (s, fn) => evs.push({ t: Tm + s, fn });

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; Wd = f.w; Hd = f.h; dpr = f.dpr;
    portrait = Wd / Hd < 1.05;
    const prb = 60 + 56 + 14, bottom = 84;
    const K = L.k;
    const avail = Hd - prb - bottom - 10;
    cardS = clamp(Math.min(avail / (K * 1.24), portrait ? Wd * .19 : 92), 44, 92);
    colGap = cardS * .24;
    const area = Math.min(Wd, 980);
    if (portrait) { colX = Wd - 12 - cardS * .58; cam.cx = (colX - cardS * .62) / 2 + 4; }
    else { cam.cx = Wd / 2 - area * .1; colX = Wd / 2 + area * .3; }
    colY0 = prb + (avail - (K * cardS + (K - 1) * colGap)) / 2 + cardS / 2 + 4;
    cam.hY = Hd * (portrait ? .36 : .34);
    cam.f = Math.min(portrait ? Wd * 1.4 : Wd * .9, Hd * (portrait ? .74 : .95));
    topS = Hd * (portrait ? .52 : .5); baseS = Hd * (portrait ? .8 : .84);
    cards.forEach(placeCard);
    camTargets(true);
  }
  function placeCard(cd) { cd.hx = colX; cd.hy = colY0 + cd.slot * (cardS + colGap); if (cd.st === 'idle') { cd.x = cd.hx; cd.y = cd.hy; } }
  function towerTop() { return BASE + fl.length * FH; }
  function camTargets(snap) {
    const Dz = D - camZT;
    camHmin = (baseS - cam.hY) * Dz / cam.f;
    if (phase === 'finale' || phase === 'over') {
      const Ht = BASE + floorsN * FH + TOWERS[L.tw].crownH + .4;
      const sc = (Hd * (portrait ? .62 : .66));
      camZT = Math.min(-3, D - cam.f * Ht / sc);
      const Dz2 = D - camZT;
      camYT = (Hd * (portrait ? .84 : .88) - cam.hY) * Dz2 / cam.f;
    } else {
      camYT = Math.max(camHmin, towerTop() + FH * .8 + (topS - cam.hY) * Dz / cam.f);
    }
    if (snap) { cam.y = camYT; cam.z = camZT; }
  }

  /* ---------- البطاقات ---------- */
  const target = () => seq[si];
  function nextAsk() { let j = si + 1; if (L.mode === 'miss') while (j < floorsN && !missing.has(j)) j++; return j; }
  function distractor(exclude, tv) {
    const t = tv == null ? target() : tv, st = (L.mode === 'by2' || L.mode === 'down2') ? 2 : 1, lo = Math.min(...seq), hi = Math.max(...seq);
    const cand = shuffle([t + st, t - st, t + 1, t - 1, t + 2 * st, t - 2 * st, t + 3, t - 3, t + 10, t - 10].filter(v => v >= Math.max(1, lo - 1) && v <= Math.min(20, hi + 1) && v !== t && !exclude.includes(v)));
    if (cand.length) return cand[0];
    for (let g = 0; g < 50; g++) { const v = ri(Math.max(1, lo), Math.min(20, hi)); if (v !== t && !exclude.includes(v)) return v; }
    return t + 5;
  }
  const newCard = (v, slot) => { const cd = { v, slot, ci: ri(0, PLATE.length - 1), st: 'idle', pop: Tm + slot * .06, flip: -9, shake: -9, flash: -9, x: 0, y: 0, hx: 0, hy: 0, sc: 1 }; placeCard(cd); return cd; };
  function dealCards() {
    const vals = [target()];
    while (vals.length < L.k) vals.push(distractor(vals));
    shuffle(vals);
    cards = vals.map((v, i) => newCard(v, i));
  }
  function refillCards(vacated, tv) {
    const live = cards.filter(cd => cd.st !== 'gone' && cd.st !== 'fly');
    const vals = live.map(cd => cd.v);
    const nv = newCard(distractor(vals.concat([tv]), tv), vacated); nv.pop = Tm + .1;
    cards = live.concat([nv]);
    if (!cards.some(cd => cd.v === tv)) { const r = pick(cards); r.v = tv; r.flip = Tm + .12; r.ci = ri(0, PLATE.length - 1); }
  }
  function cardAt(x, y) {
    for (let i = cards.length - 1; i >= 0; i--) { const cd = cards[i]; if (cd.st !== 'idle') continue; if (Math.abs(x - cd.x) < cardS * .58 && Math.abs(y - cd.y) < cardS * .58) return cd; }
    return null;
  }
  function drawCard(c, cd) {
    const s = cardS;
    let k = 1, ox = 0, oy = 0, rot = 0;
    const pa = Tm - cd.pop; if (pa < 0) return; if (pa < .45) k = ease.outBack(pa / .45);
    const sa = Tm - cd.shake; if (sa < .45) { ox = Math.sin(sa * 40) * (1 - sa / .45) * 10; rot = ox * .012; }
    const fa = Tm - cd.flip; let sx = 1; if (fa >= 0 && fa < .4) sx = Math.abs(Math.cos(fa / .4 * Math.PI));
    if (cd.v === target() && phase === 'play' && Tm - hintT < 3.5) { oy = -Math.abs(Math.sin((Tm - hintT) * 6)) * 8; }
    if (cd.st === 'fly') { const t = clamp((Tm - cd.ft) / .38, 0, 1); k = 1 - .45 * t; }
    if (cd.st === 'drag') k = 1.12;
    const w = s * 1.04, h = s;
    c.save(); c.translate(cd.x + ox, cd.y + oy); c.rotate(rot); c.scale(k * sx, k);
    const col = C(PLATE[cd.ci]);
    if (cd.v === target() && phase === 'play' && Tm - hintT < 3.5) {
      const a = .5 + .5 * Math.sin(Tm * 8);
      c.fillStyle = `rgba(255,214,60,${.35 + .3 * a})`; c.beginPath(); c.roundRect(-w / 2 - 9, -h / 2 - 9, w + 18, h + 18, s * .32); c.fill();
    }
    c.fillStyle = 'rgba(20,40,80,.22)'; c.beginPath(); c.roundRect(-w / 2 + 2, -h / 2 + s * .12, w, h, s * .24); c.fill();
    c.fillStyle = rgb(mul(col, .78)); c.beginPath(); c.roundRect(-w / 2, -h / 2 + s * .07, w, h, s * .24); c.fill();
    c.fillStyle = rgb(col); c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, s * .24); c.fill();
    const g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#E9EEF6');
    const b = s * .1;
    c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2 + b, -h / 2 + b, w - b * 2, h - b * 2, s * .16); c.fill();
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.roundRect(-w / 2 + b * 1.6, -h / 2 + b * 1.3, w - b * 3.2, h * .18, h * .09); c.fill();
    const txt = dg(cd.v);
    c.font = `900 ${s * (txt.length > 1 ? .5 : .6)}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
    c.fillStyle = '#2B3A67'; c.fillText(txt, 0, s * .05);
    const fl2 = Tm - cd.flash; if (fl2 < .5) { c.fillStyle = `rgba(255,70,70,${.4 * (1 - fl2 / .5)})`; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, s * .24); c.fill(); }
    c.restore();
  }

  /* ---------- مجرى اللعب ---------- */
  function startLevel(n, keepLvlUI) {
    lvl = clamp(n, 1, NL); L = LV[lvl - 1];
    evs = []; parts = []; fw = []; fl = []; cards = []; drag = null;
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    seq = seqOf(L); floorsN = seq.length; si = 0; mistakes = 0; wrongStep = 0; hintT = -9;
    missing = new Set();
    if (L.mode === 'miss') {
      const want = floorsN > 12 ? 8 : 5, cands = shuffle(Array.from({ length: floorsN - 2 }, (_, i) => i + 1));
      for (const c of cands) { if (missing.size >= want) break; if (!missing.has(c - 1) && !missing.has(c + 1)) missing.add(c); }
    }
    crownK = 0; crownT = -1; duskT = -1; litT = -1; finT = -1; towerShake = 0; camZT = 0;
    const T = TOWERS[L.tw];
    if (!SC || SC.kind !== T.scene) SC = buildScene(T.scene);
    tN.textContent = T.name; tP.textContent = T.place;
    phase = 'intro';
    layout(); camTargets(true);
    renderBar(); setPrompt();
    lastAct = Tm;
    App.speak(T.name + '. ' + MODE_SAY[L.mode]);
    after(.6, () => beginStep(true));
  }
  function beginStep(first) {
    if (si >= floorsN) { finale(); return; }
    if (L.mode === 'miss' && !missing.has(si)) { phase = 'auto'; setPrompt(); after(first ? .5 : .32, () => dropFloor(seq[si], true)); return; }
    phase = 'play'; wrongStep = 0; lastAct = Tm;
    if (first || !cards.length) dealCards();
    setPrompt(true); renderBar();
    if (L.show) after(first ? 1.6 : .15, () => { if (phase === 'play') sayNum(target()); });
  }
  function dropFloor(v, auto) {
    fl.push({ v, spawn: Tm, off: 3.2, alpha: 0, auto });
    Sound.whoosh();
    camTargets();
  }
  function landed(F) {
    F.landT = Tm; F.off = 0; F.alpha = 1;
    Sound.thud(); Sound.pop(); vibrate(18);
    towerShake = 1;
    const i = fl.indexOf(F), g = floorParts(TOWERS[L.tw], floorsN, i);
    const y = BASE + i * FH;
    for (const sx of [-1, 1]) {
      const [x, yy] = pj(sx * g.wb * .55, y, D - g.wb * .2);
      for (let k = 0; k < 7; k++) parts.push({ x, y: yy, vx: sx * rand(20, 90), vy: rand(-40, -5), r: rand(5, 11) * scl(D) / 40, life: rand(.5, .9), age: 0, col: 'rgba(255,255,255,', kind: 'dust' });
    }
    if (!F.auto && !L.show) sayNum(F.v);
    si++;
    renderBar();
    after(F.auto ? .1 : .3, () => beginStep(false));
  }
  function choose(cd) {
    if (phase !== 'play' || !cd) return;
    lastAct = Tm;
    if (cd.v === target()) {
      phase = 'anim';
      cd.st = 'fly'; cd.ft = Tm; cd.fx = cd.x; cd.fy = cd.y;
      const [tx, ty] = pj(0, towerTop() + FH * 3.2, D); cd.tx = tx; cd.ty = ty;
      Sound.star(); vibrate(12);
      setPrompt(false, true);
      const vac = cd.slot;
      after(.38, () => {
        cd.st = 'gone';
        dropFloor(cd.v, false);
        const j = nextAsk();
        if (j < floorsN) refillCards(vac, seq[j]);
        else cards = cards.filter(c => c !== cd);
      });
    } else {
      mistakes++; wrongStep++;
      cd.shake = Tm; cd.flash = Tm; cd.st = 'idle';
      Sound.error(); vibrate(35);
      if (wrongStep >= 2) { hintT = Tm; after(.1, () => promptSpeak()); }
      else App.speak(App.g('حاولي مرة أخرى', 'حاول مرة أخرى'));
    }
  }
  function promptSpeak() {
    if (L.mode === 'miss') { App.speak(MODE_SAY.miss); if (wrongStep >= 2 || Tm - hintT < 3.5) after(1.6, () => sayNum(target())); }
    else sayNum(target());
  }
  function finale() {
    phase = 'finale'; finT = Tm; prm.classList.add('off');
    cards.forEach(cd => { cd.st = 'out'; cd.ot = Tm; });
    after(.35, () => { crownT = Tm; Sound.whoosh(); });
    after(.8, () => { if (TOWERS[L.tw].crownH > .3) { Sound.thud(); towerShake = 1.2; } camTargets(); });
    after(1.5, () => { duskT = Tm; litT = Tm; Sound.win(); App.speak('بنينا ' + TOWERS[L.tw].name); });
    after(4.6, showWin);
  }
  function showWin() {
    phase = 'over';
    const pr = loadProg(), stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1, prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(NL, lvl + 1);
    store.set('towerProg', pr);
    root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنت!') + ' 🎉';
    root.querySelector('.wN').textContent = App.g('بنيتِ', 'بنيتَ') + ' ' + TOWERS[L.tw].name + ' 🏙️';
    root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
    root.querySelector('.wP').textContent = mistakes ? `الأخطاء: ${dg(mistakes)}` : 'دون أي خطأ! 💯';
    root.querySelector('[data-a="next"]').style.display = lvl < NL ? '' : 'none';
    winOv.classList.add('on');
    App.speak(App.g('أحسنتِ!', 'أحسنت!'));
    if (stars > prev) App.addStars(stars - prev + 1);
    App.achieve('tower_first');
    if (Math.max(L.a, L.b) >= 20) App.achieve('tower_20');
    if (Array.from({ length: NL }, (_, i) => pr.stars[i + 1]).every(Boolean)) App.achieve('tower_all');
  }

  /* ---------- عناصر HTML ---------- */
  function setPrompt(bump, done) {
    if (phase === 'finale' || phase === 'over' || phase === 'intro' && !seq.length) { prm.classList.add('off'); return; }
    const box = (v, cls) => `<i class="${cls || ''}">${v}</i>`;
    let h = '';
    if (L.mode === 'miss') {
      const a = seq[si - 1], b = seq[si + 1];
      h = (a != null ? box(dg(a)) : '') + box(phase === 'auto' ? dg(seq[si]) : '؟', phase === 'auto' ? 'dim' : 'q') + (b != null ? box(dg(b), 'dim') : '');
    } else {
      const prev = seq.slice(Math.max(0, si - 3), si).map(v => box(dg(v)));
      const cur = si < floorsN ? (done ? box(dg(target())) : box(L.show ? dg(target()) : '؟', 'q' + (L.show ? ' sh' : ''))) : '';
      h = prev.join('') + cur;
    }
    prm.innerHTML = h; prm.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    prm.classList.toggle('off', !h);
    if (bump) { prm.classList.remove('bump'); void prm.offsetWidth; prm.classList.add('bump'); }
  }
  function renderBar() {
    pbar.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    pbar.innerHTML = Array.from({ length: floorsN }, (_, i) => `<i class="${i < si ? 'on' : i === si && phase === 'play' ? 'cur' : ''}"></i>`).join('');
    root.querySelectorAll('.lng button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
  }
  function thumb(cv2, tw) {
    const N = 7, c = cv2.getContext('2d'), w = 72, h = 84;
    cv2.width = w * 2; cv2.height = h * 2; c.scale(2, 2);
    const sv = Object.assign({}, cam);
    const T = TOWERS[tw], Ht = BASE + N * FH + T.crownH + .3;
    cam.cx = w / 2; cam.hY = h * .5; cam.f = 150; cam.x = 0;
    cam.z = D - cam.f * Ht / (h * .8); cam.y = (h * .93 - cam.hY) * (D - cam.z) / cam.f;
    c.fillStyle = 'rgba(40,80,140,.18)'; c.beginPath(); c.ellipse(w / 2, h * .9, w * .42, h * .07, 0, 0, TAU); c.fill();
    c.fillStyle = T.scene === 'nile' ? '#7FC6DD' : '#EBDDC2'; c.beginPath(); c.ellipse(w / 2, h * .88, w * .4, h * .065, 0, 0, TAU); c.fill();
    const fls = Array.from({ length: N }, () => ({}));
    drawTower(c, tw, N, fls, { crown: 1, plates: false });
    Object.assign(cam, sv);
  }
  function openLevels() {
    const pr = loadProg(), grid = root.querySelector('.grid');
    grid.innerHTML = LV.map((V, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lv${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}">
        <span class="n">${dg(n)}</span><canvas data-t="${V.tw}"></canvas><b>${TOWERS[V.tw].name}</b>
        <span class="md" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">${MODE_IC[V.mode]} ${modeLabel(V)}</span>
        <span class="s">${[1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    grid.querySelectorAll('canvas[data-t]').forEach(c => thumb(c, +c.dataset.t));
    grid.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
    const cur = grid.querySelector('.cur');
    requestAnimationFrame(() => { if (cur) grid.scrollTop = Math.max(0, cur.offsetTop - grid.clientHeight / 2); });
  }
  function setLang(l) {
    if (l === lang) return;
    lang = l; store.set('towerLang', l); Sound.tap();
    setPrompt(); renderBar();
    if (phase === 'play') sayNum(target());
    if (lvOv.classList.contains('on')) openLevels();
  }
  function act(a) {
    Sound.tap();
    if (a === 'close') { lvOv.classList.remove('on'); if (phase === 'over') winOv.classList.add('on'); }
    else if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.xbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });
  root.querySelectorAll('.lng button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l)));
  spk.addEventListener('click', () => { lastAct = Tm; if (phase === 'play') promptSpeak(); else if (phase === 'over' || phase === 'finale') App.speak(TOWERS[L.tw].name); spk.classList.remove('pulse'); void spk.offsetWidth; spk.classList.add('pulse'); });
  prm.addEventListener('click', () => { if (phase === 'play') { promptSpeak(); setPrompt(true); } });

  /* ---------- الإدخال ---------- */
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  function overTower(x, y) {
    const [tx, ty] = pj(0, towerTop(), D), s = scl(D);
    return Math.abs(x - tx) < Math.max(70, s * 2.2) && y > ty - Math.max(120, s * 4) && y < pj(0, 0, D)[1] + 20;
  }
  cv.addEventListener('pointerdown', e => {
    if (paused || phase !== 'play') return;
    const p = pos(e), cd = cardAt(p.x, p.y);
    if (!cd) return;
    drag = { cd, sx: p.x, sy: p.y, ox: cd.x - p.x, oy: cd.y - p.y, moved: false, id: e.pointerId };
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    Sound.tap();
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const p = pos(e);
    if (!drag.moved && Math.hypot(p.x - drag.sx, p.y - drag.sy) > 9) { drag.moved = true; drag.cd.st = 'drag'; cards = cards.filter(c => c !== drag.cd).concat([drag.cd]); }
    if (drag.moved) { drag.cd.x = p.x + drag.ox; drag.cd.y = p.y + drag.oy; }
  });
  function endDrag(e, cancel) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const d = drag; drag = null;
    if (cancel) { d.cd.st = 'back'; return; }
    if (!d.moved) { choose(d.cd); return; }
    const p = pos(e);
    if (overTower(p.x, p.y)) { d.cd.st = 'idle'; choose(d.cd); if (d.cd.st === 'idle') d.cd.st = 'back'; }
    else d.cd.st = 'back';
  }
  cv.addEventListener('pointerup', e => endDrag(e));
  cv.addEventListener('pointercancel', e => endDrag(e, true));
  window.addEventListener('keydown', e => {
    if (App.current !== ID || paused || $('#sheetWrap').classList.contains('on')) return;
    let k = e.key; const ai = AD.indexOf(k); if (ai >= 0) k = String(ai);
    if (k === ' ' || k === 'Enter') { e.preventDefault(); if (phase === 'play') promptSpeak(); return; }
    if (!/^\d$/.test(k) || phase !== 'play') return;
    keyBuf = (Tm - keyT < .8 ? keyBuf : '') + k; keyT = Tm;
    const v = +keyBuf, cd = cards.find(c => c.st === 'idle' && c.v === v);
    const longer = cards.some(c => c.st === 'idle' && String(c.v).length > keyBuf.length && String(c.v).startsWith(keyBuf));
    if (cd && !longer) { keyBuf = ''; choose(cd); }
    else if (!cd && !longer) { keyBuf = ''; Sound.error(); }
    else if (cd && longer) { const kb = keyBuf; after(.8, () => { if (keyBuf === kb && phase === 'play') { keyBuf = ''; choose(cd); } }); }
  });

  /* ---------- التحديث ---------- */
  function rand(a, b) { return a + Math.random() * (b - a); }
  function burstFW(x, y) {
    const cols = ['#FF5A5F', '#FFC531', '#58C76B', '#4F9CF0', '#E86BD0', '#FFFFFF', '#9B6CF0'], col = pick(cols), col2 = pick(cols);
    for (let i = 0; i < 46; i++) { const a = i / 46 * TAU + rand(-.05, .05), sp = rand(110, 230); fw.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rand(1, 1.6), age: 0, col: i % 3 ? col : col2, r: rand(2.4, 4) }); }
    Sound.tone(rand(180, 260), .25, 'sine', .12, -80); Sound.noise(.3, 1800, 400, .06, 1);
  }
  function update(dt) {
    Tm += dt;
    // أحداث مجدولة
    if (evs.length) { const due = evs.filter(e => e.t <= Tm); if (due.length) { evs = evs.filter(e => e.t > Tm); due.sort((a, b) => a.t - b.t).forEach(e => e.fn()); } }
    // الطوابق
    for (const F of fl) {
      if (F.landT == null) {
        const p = clamp((Tm - F.spawn) / DROP, 0, 1);
        F.off = 3.2 * (1 - p * p); F.alpha = Math.min(1, p * 3);
        if (p >= 1) landed(F);
      } else {
        const a = Tm - F.landT;
        if (a < .9) { const e = Math.exp(-7 * a) * Math.cos(a * 20); F.sq = [1 - .26 * e, 1 + .12 * e]; } else F.sq = null;
      }
      if (litT >= 0) F.lit = clamp((Tm - litT - fl.indexOf(F) * .07) / .35, 0, 1);
    }
    towerShake = Math.max(0, towerShake - dt * 3);
    for (const b of SC.boats) { b.z += b.sp * dt; if (b.z > D + 30) b.sp = -Math.abs(b.sp); if (b.z < D - 6) b.sp = Math.abs(b.sp); }
    if (crownT >= 0) crownK = clamp((Tm - crownT) / .45, 0, 1);
    // الكاميرا
    if (phase !== 'finale' && phase !== 'over') camTargets();
    const k = 1 - Math.exp(-dt * (phase === 'finale' ? 1.6 : 3.2));
    cam.y += (camYT - cam.y) * k; cam.z += (camZT - cam.z) * k;
    // البطاقات
    for (const cd of cards) {
      if (cd.st === 'fly') { const t = ease.inOut(clamp((Tm - cd.ft) / .38, 0, 1)); cd.x = cd.fx + (cd.tx - cd.fx) * t; cd.y = cd.fy + (cd.ty - cd.fy) * t - Math.sin(t * Math.PI) * 60; }
      else if (cd.st === 'back' || cd.st === 'idle') { cd.x += (cd.hx - cd.x) * Math.min(1, dt * 14); cd.y += (cd.hy - cd.y) * Math.min(1, dt * 14); if (cd.st === 'back' && Math.hypot(cd.hx - cd.x, cd.hy - cd.y) < 1) cd.st = 'idle'; }
      else if (cd.st === 'out') { cd.x += dt * 600 * (portrait ? 1 : 1); }
    }
    // تلميح عند الخمول
    if (phase === 'play' && Tm - lastAct > 9) { lastAct = Tm; hintT = Tm; promptSpeak(); }
    // جسيمات
    for (const p of parts) { p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .95; p.vy *= .95; }
    parts = parts.filter(p => p.age < p.life);
    for (const p of fw) { p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= .97; p.vy = p.vy * .97 + 60 * dt; }
    fw = fw.filter(p => p.age < p.life);
    if (duskT >= 0 && Tm - duskT < 6 && Math.random() < dt * 3.2) {
      const [tx, ty] = pj(0, BASE + floorsN * FH + TOWERS[L.tw].crownH, D);
      const sd = Math.random() < .5 ? -1 : 1; burstFW(clamp(tx + sd * rand(Wd * .14, Wd * .4), 40, Wd - 40), clamp(ty + rand(-Hd * .25, Hd * .12), Hd * .1, Hd * .5));
    }
  }

  /* ---------- الرسم ---------- */
  function render() {
    const c = ctx; if (!c || !SC) return;
    const dusk = duskT >= 0 ? clamp((Tm - duskT) / 1.2, 0, 1) * .85 : 0;
    c.clearRect(0, 0, Wd, Hd);
    drawSky(c, Wd, Hd, dusk, Tm);
    drawGround(c, Wd, Hd, Tm, dusk);
    // عناصر مرتبة بالعمق
    const items = [];
    for (const b of SC.bld) items.push([b.z, 0, b]);
    for (const p of SC.palms) items.push([p.z, 1, p]);
    for (const cl of SC.clouds) items.push([cl.z + 4, 2, cl]);
    for (const b of SC.boats) items.push([b.z, 3, b]);
    items.push([D, 4, null]);
    items.sort((a, b) => b[0] - a[0]);
    let dimmed = false;
    for (const it of items) {
      if (it[1] === 4) {
        if (dusk > 0) { c.fillStyle = `rgba(30,20,80,${dusk * .42})`; c.fillRect(0, 0, Wd, Hd); dimmed = true; searchlights(c, dusk); }
        const ghost = phase === 'play' || phase === 'anim' || phase === 'auto' ? (.45 + .25 * Math.sin(Tm * 4)) : 0;
        drawTower(c, L.tw, floorsN, fl, { shake: Math.sin(Tm * 50) * towerShake * .06, ghost: si < floorsN && fl.length < floorsN && fl.length === si ? ghost : 0,
          ghostTxt: phase === 'play' ? (L.show ? dg(target()) : '؟') : '', crown: crownT >= 0 ? crownK : null, crownLit: dusk });
      } else if (it[1] === 0) drawBuilding(c, it[2]);
      else if (it[1] === 1) drawPalm(c, it[2], dimmed ? dusk * .5 : 0);
      else if (it[1] === 2) drawCloud(c, it[2]);
      else drawBoat(c, it[2]);
    }
    // جسيمات
    for (const p of parts) { const a = 1 - p.age / p.life; c.fillStyle = p.col + (a * .85) + ')'; c.beginPath(); c.arc(p.x, p.y, p.r * (1 + p.age * 2), 0, TAU); c.fill(); }
    if (fw.length) {
      c.save(); c.globalCompositeOperation = 'lighter';
      c.lineCap = 'round';
      for (const p of fw) { const a = 1 - p.age / p.life; c.globalAlpha = a; c.strokeStyle = p.col; c.lineWidth = p.r * 1.3; c.beginPath(); c.moveTo(p.x - p.vx * .06, p.y - p.vy * .06); c.lineTo(p.x, p.y); c.stroke(); c.fillStyle = '#fff'; c.beginPath(); c.arc(p.x, p.y, p.r * .7, 0, TAU); c.fill(); }
      c.restore();
    }
    // البطاقات
    for (const cd of cards) if (cd.st !== 'gone' && cd.st !== 'drag') drawCard(c, cd);
    for (const cd of cards) if (cd.st === 'drag') drawCard(c, cd);
  }
  function searchlights(c, dusk) {
    const [bx, by] = pj(0, 0, D);
    c.save(); c.globalCompositeOperation = 'lighter';
    for (const s of [-1, 1]) {
      const a = -Math.PI / 2 + s * (.25 + .18 * Math.sin(Tm * 1.3 + s));
      const len = Hd, x2 = bx + s * 40 + Math.cos(a) * len, y2 = by + Math.sin(a) * len;
      const g = c.createLinearGradient(bx, by, x2, y2); g.addColorStop(0, `rgba(255,240,190,${.35 * dusk})`); g.addColorStop(1, 'rgba(255,240,190,0)');
      c.fillStyle = g; c.beginPath(); c.moveTo(bx + s * 30, by);
      c.lineTo(x2 - 50, y2); c.lineTo(x2 + 50, y2); c.closePath(); c.fill();
    }
    c.restore();
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
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    const sv = Object.assign({}, cam);
    let g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#5AAAF0'); g.addColorStop(.55, '#BFE3FB'); g.addColorStop(.56, '#4DB3D3'); g.addColorStop(1, '#E9D3A8');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.fillStyle = '#E9D3A8'; c.beginPath(); c.moveTo(s * .3, s * .56); c.lineTo(s, s * .56); c.lineTo(s, s); c.lineTo(0, s); c.closePath(); c.fill();
    c.drawImage(cloudSprite(0), -s * .1, s * .12, s * .55, s * .3);
    c.fillStyle = '#F28A2E'; c.beginPath(); c.arc(s * .85, s * .2, s * .07, 0, TAU); c.fill();
    const N = 7, T = TOWERS[0], Ht = BASE + N * FH + T.crownH;
    cam.cx = s * .52; cam.hY = s * .56; cam.f = s * 1.1; cam.x = 0;
    cam.z = D - cam.f * Ht / (s * .74); cam.y = (s * .9 - cam.hY) * (D - cam.z) / cam.f;
    drawTower(c, 0, N, Array.from({ length: N }, (_, i) => ({ v: i + 1 })), { crown: 1, plates: false });
    const sp = palmSprite(0); c.drawImage(sp, s * .02, s * .55, s * .28, s * .36); c.drawImage(palmSprite(1), s * .74, s * .6, s * .24, s * .3);
    Object.assign(cam, sv);
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'البرج', icon2: '🏙️', isNew: true, music: 'numbers',
    desc: () => App.g('دوّري الرقم الصحيح وابني البرج طابقًا فوق طابق', 'دوّر الرقم الصحيح وابنِ البرج طابقًا فوق طابق'),
    help: () => [
      '🔢 ' + App.g('اسمعي', 'اسمع') + ' الرقم التالي ثم ' + App.g('المسيه', 'المسه') + ' من البطاقات، أو ' + App.g('اسحبيه', 'اسحبه') + ' إلى البرج',
      '🏗️ كل رقم صحيح يضيف طابقًا جديدًا، وفي النهاية يكتمل البرج بالأضواء والألعاب النارية 🎆',
      '🔊 الزر الأصفر يعيد السؤال، و«١٢٣ / 123» يبدّل بين الأرقام العربية والإنجليزية',
      '🏙️ ' + App.g('ابني', 'ابنِ') + ' برج الفاتح وبرج المملكة وبرج خليفة وبرج إيفل وساعة مكة: عدّ تصاعدي وتنازلي وبالاثنين والرقم الناقص',
      '⭐ ' + App.g('ابني', 'ابنِ') + ' البرج دون أخطاء ' + App.g('لتحصلي', 'لتحصل') + ' على 3 نجوم، و✕ يفتح قائمة الأبراج'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏙️ ${ks.length} برج · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      lang = store.get('towerLang', 'ar') === 'en' ? 'en' : 'ar';
      const pr = loadProg();
      let n = 1; for (let i = 1; i <= pr.unlocked; i++) if (!pr.stars[i]) { n = i; break; } else n = i;
      startLevel(n);
      render(); startLoop();
    },
    leave() { stopLoop(); drag = null; evs = []; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { drag.cd.st = 'back'; drag = null; } },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    },
    /* للاختبار الآلي */
    _state() { return { lvl, si, phase, target: target(), floors: fl.length, N: floorsN, mistakes, cards: cards.map(c => ({ v: c.v, x: c.x, y: c.y, st: c.st })), cam: Object.assign({}, cam) }; },
    _start: n => startLevel(n)
  });
})();
