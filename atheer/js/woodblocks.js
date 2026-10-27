/* =====================================================================
   المكعبات الخشبية — مكعبات ملوّنة (مكعب، طوبة، قوس، مثلث، سقف،
   أسطوانة، نصف دائرة) بمنظور ثلاثي الأبعاد. بطاقة الصورة تعرض مجسّمًا
   (بيت، جسر، برج، قلعة، سيارة، جمل، أهرامات البجراوية، قطار)
   والطفل يبني نسخة مطابقة على البساط: يسحب القطعة فتسقط وتستقر بلطف،
   ولمسة القطعة تديرها. وفي «البناء الحر» يبني ما يشاء ويحفظه في المعرض.
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'woodblocks';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';
  const AD = '٠١٢٣٤٥٦٧٨٩';
  const NC = 8, NR = 7;           // أعمدة وطبقات البساط
  const DXK = .34, DYK = -.27;    // إزاحة العمق (منظور مائل)

  /* ---------- الأشكال ---------- */
  const TYPES = {
    cube: { fp: [[1, 1]], ar: 'مكعب', def: 'المكعب', en: 'cube', g: 'm' },
    brick: { fp: [[2, 1], [1, 2]], ar: 'طوبة', def: 'الطوبة', en: 'brick', g: 'f' },
    arch: { fp: [[2, 1]], ar: 'قوس', def: 'القوس', en: 'arch', g: 'm' },
    tri: { fp: [[1, 1]], ar: 'مثلث', def: 'المثلث', en: 'triangle', g: 'm' },
    roof: { fp: [[2, 1]], ar: 'سقف', def: 'السقف', en: 'roof', g: 'm' },
    cyl: { fp: [[1, 1], [1, 1]], ar: 'أسطوانة', def: 'الأسطوانة', en: 'cylinder', g: 'f' },
    moon: { fp: [[2, 1], [2, 1]], ar: 'نصف دائرة', def: 'نصف الدائرة', en: 'half circle', g: 'f' }
  };
  const TORDER = ['cube', 'brick', 'arch', 'tri', 'roof', 'cyl', 'moon'];
  const COLS = {
    R: { h: '#EF4A3F', ar: 'أحمر', f: 'حمراء', en: 'Red' },
    Y: { h: '#FFC23A', ar: 'أصفر', f: 'صفراء', en: 'Yellow' },
    B: { h: '#3B8CEB', ar: 'أزرق', f: 'زرقاء', en: 'Blue' },
    G: { h: '#3DBA5C', ar: 'أخضر', f: 'خضراء', en: 'Green' },
    O: { h: '#FF8A2A', ar: 'برتقالي', f: 'برتقالية', en: 'Orange' },
    P: { h: '#9A62E8', ar: 'بنفسجي', f: 'بنفسجية', en: 'Purple' },
    W: { h: '#E2B47A', ar: 'خشبي', f: 'خشبية', en: 'Wooden' }
  };
  const CKEYS = ['R', 'Y', 'B', 'G', 'O', 'P', 'W'];
  const fpOf = (t, r) => { const f = TYPES[t].fp; return f[r % f.length]; };
  const nRot = t => TYPES[t].fp.length;
  const isCap = b => b.t === 'tri' || b.t === 'roof' || (b.t === 'moon' && b.r === 0);

  /* ---------- المجسّمات (الصورة) ---------- */
  const MODELS = [
    { k: 'house', ar: 'بيت', en: 'House', ic: '🏠', b: [['cube', 0, 0, 0, 'Y'], ['cube', 1, 0, 0, 'B'], ['roof', 0, 1, 0, 'R']] },
    { k: 'tower', ar: 'برج', en: 'Tower', ic: '🗼', b: [['cube', 0, 0, 0, 'R'], ['cube', 0, 1, 0, 'Y'], ['cube', 0, 2, 0, 'B'], ['tri', 0, 3, 0, 'G']] },
    { k: 'bridge', ar: 'جسر', en: 'Bridge', ic: '🌉', b: [['arch', 0, 0, 0, 'B'], ['arch', 2, 0, 0, 'B'], ['brick', 0, 1, 0, 'Y'], ['brick', 2, 1, 0, 'O']] },
    { k: 'pyramids', ar: 'أهرامات البجراوية', en: 'Bajrawiya Pyramids', ic: '🔺', b: [['brick', 0, 0, 0, 'W'], ['brick', 0, 1, 0, 'W'], ['roof', 0, 2, 0, 'O'], ['brick', 3, 0, 0, 'W'], ['roof', 3, 1, 0, 'O']] },
    { k: 'car', ar: 'سيارة', en: 'Car', ic: '🚗', b: [['cyl', 0, 0, 1, 'P'], ['cyl', 2, 0, 1, 'P'], ['brick', 0, 1, 0, 'R'], ['cube', 2, 1, 0, 'R'], ['moon', 0, 2, 0, 'B']] },
    { k: 'castle', ar: 'قلعة', en: 'Castle', ic: '🏰', b: [['cube', 0, 0, 0, 'P'], ['cube', 0, 1, 0, 'P'], ['tri', 0, 2, 0, 'R'], ['arch', 1, 0, 0, 'Y'], ['brick', 1, 1, 0, 'B'], ['cube', 3, 0, 0, 'P'], ['cube', 3, 1, 0, 'P'], ['tri', 3, 2, 0, 'R']] },
    { k: 'camel', ar: 'جمل', en: 'Camel', ic: '🐪', b: [['brick', 0, 0, 1, 'W'], ['brick', 2, 0, 1, 'W'], ['brick', 0, 2, 0, 'O'], ['cube', 2, 2, 0, 'O'], ['moon', 0, 3, 0, 'O'], ['brick', 2, 3, 1, 'W'], ['brick', 2, 5, 0, 'O']] },
    { k: 'train', ar: 'قطار', en: 'Train', ic: '🚂', b: [['cyl', 0, 0, 1, 'P'], ['cyl', 1, 0, 1, 'P'], ['cyl', 3, 0, 1, 'P'], ['cyl', 4, 0, 1, 'P'], ['brick', 0, 1, 0, 'G'], ['brick', 3, 1, 0, 'Y'], ['cube', 0, 2, 0, 'R'], ['cyl', 1, 2, 0, 'B']] }
  ];
  const NL = MODELS.length;

  /* ---------- أدوات ---------- */
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const hx2 = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const rgb = (a, al = 1) => `rgba(${a[0] | 0},${a[1] | 0},${a[2] | 0},${al})`;
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const PAL = {};
  function pal(k) {
    if (PAL[k]) return PAL[k];
    const c = hx2(COLS[k].h), W = [255, 255, 255], K = [50, 25, 20];
    return (PAL[k] = { m: rgb(c), l: rgb(mix(c, W, .3)), ll: rgb(mix(c, W, .55)), d: rgb(mix(c, K, .25)), dd: rgb(mix(c, K, .45)), g: rgb(mix(c, K, .5), .12), c });
  }
  const G = () => window.gsap && window.Fx && Fx.on ? window.gsap : null;
  const easeIO = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  /* ---------- اللغة ---------- */
  let lang = 'ar';
  const dg = n => lang === 'ar' ? String(n).replace(/\d/g, d => AD[d]) : String(n);
  const say = (ar, en) => { if (lang === 'en') App.speak(en, 'en'); else App.speak(ar); };
  const nameOf = b => { const T = TYPES[b.t], C = COLS[b.c]; return lang === 'en' ? C.en + ' ' + T.en : T.ar + ' ' + (T.g === 'f' ? C.f : C.ar); };
  const sayBlock = b => { const T = TYPES[b.t], C = COLS[b.c]; say(T.ar + ' ' + (T.g === 'f' ? C.f : C.ar), C.en + ' ' + T.en); };
  const loadProg = () => { const p = store.get('woodblocksProg', null) || {}; return { unlocked: clamp(p.unlocked || 1, 1, NL), stars: p.stars || {} }; };

  /* =====================================================================
     رسم القطعة: الواجهة الأمامية + السطح العلوي + الجانب، بحواف لامعة
     (cx, cy) مركز الواجهة الأمامية، U حجم الخلية
     ===================================================================== */
  function poly(c, P) { c.beginPath(); c.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) c.lineTo(P[i][0], P[i][1]); c.closePath(); }
  function grain(c, x0, y0, w, h, P, seed) {
    c.save(); c.globalAlpha = .5; c.strokeStyle = P.g; c.lineWidth = Math.max(1, h * .03);
    let s = seed * 97 + 13; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 4; i++) {
      const y = y0 + h * (.15 + .22 * i + r() * .06);
      c.beginPath(); c.moveTo(x0 + w * .06, y); c.bezierCurveTo(x0 + w * .35, y + h * (r() - .5) * .12, x0 + w * .65, y - h * (r() - .5) * .12, x0 + w * .94, y + h * .02); c.stroke();
    }
    c.restore();
  }
  function drawBlock(c, b, cx, cy, U, o = {}) {
    const [fw, fh] = fpOf(b.t, b.r), w = fw * U, h = fh * U, dx = U * DXK, dy = U * DYK;
    const x0 = cx - w / 2, y0 = cy - h / 2, x1 = x0 + w, y1 = y0 + h;
    const P = pal(b.c), rr = U * .07;
    const ghost = o.ghost;
    c.save();
    if (ghost) c.globalAlpha = ghost;
    c.lineJoin = 'round';
    const edge = 'rgba(70,35,20,.28)';
    const box = () => {
      // الجانب الأيمن
      poly(c, [[x1, y0], [x1 + dx, y0 + dy], [x1 + dx, y1 + dy], [x1, y1]]);
      let g = c.createLinearGradient(x1, 0, x1 + dx, 0); g.addColorStop(0, P.dd); g.addColorStop(1, P.d);
      c.fillStyle = g; c.fill(); c.strokeStyle = edge; c.lineWidth = 1; c.stroke();
      // السطح العلوي
      poly(c, [[x0, y0], [x0 + dx, y0 + dy], [x1 + dx, y0 + dy], [x1, y0]]);
      g = c.createLinearGradient(0, y0 + dy, 0, y0); g.addColorStop(0, P.ll); g.addColorStop(1, P.l);
      c.fillStyle = g; c.fill(); c.stroke();
    };
    const frontFill = (path, hy0 = y0, hy1 = y1) => {
      path();
      const g = c.createLinearGradient(0, hy0, 0, hy1); g.addColorStop(0, P.l); g.addColorStop(.25, P.m); g.addColorStop(1, P.d);
      c.fillStyle = g; c.fill();
      c.strokeStyle = edge; c.lineWidth = 1.2; c.stroke();
    };
    const rim = (pts) => { c.save(); c.strokeStyle = 'rgba(255,255,255,.65)'; c.lineWidth = Math.max(1.5, U * .05); c.lineCap = 'round'; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke(); c.restore(); };
    /* بثق منحنٍ: نرسم نسخًا متدرجة من الخلف إلى الأمام */
    const extrude = (pathAt, n = 7) => {
      for (let i = n; i >= 1; i--) {
        const t = i / n; pathAt(dx * t, dy * t);
        c.fillStyle = i === n ? P.dd : P.d; c.fill();
      }
      pathAt(dx * .5, dy * .5); c.fillStyle = P.d; c.fill();
    };
    if (b.t === 'cube' || b.t === 'brick') {
      box();
      frontFill(() => { c.beginPath(); c.roundRect(x0, y0, w, h, rr); });
      grain(c, x0, y0, w, h, P, b.id || 1);
      rim([[x0 + rr, y0 + 1.5], [x1 - rr, y0 + 1.5]]); rim([[x0 + 1.5, y0 + rr], [x0 + 1.5, y1 - rr]]);
      if (b.t === 'cube' && U > 24) { // نجمة صغيرة محفورة
        c.fillStyle = 'rgba(255,255,255,.22)'; star(c, cx, cy, Math.min(w, h) * .2);
      }
    } else if (b.t === 'arch') {
      box();
      const hr = w * .26, hcy = y1;
      const front = () => { c.beginPath(); c.moveTo(x0, y1); c.lineTo(x0, y0 + rr); c.quadraticCurveTo(x0, y0, x0 + rr, y0); c.lineTo(x1 - rr, y0); c.quadraticCurveTo(x1, y0, x1, y0 + rr); c.lineTo(x1, y1); c.lineTo(cx + hr, y1); c.arc(cx, hcy, hr, 0, Math.PI, true); c.lineTo(x0, y1); c.closePath(); };
      frontFill(front);
      // داخل القوس
      c.save(); c.beginPath(); c.arc(cx, hcy, hr, Math.PI, 0); c.closePath(); c.clip();
      const g = c.createLinearGradient(0, hcy - hr, 0, hcy); g.addColorStop(0, P.dd); g.addColorStop(1, 'rgba(40,20,10,.55)');
      c.fillStyle = g; c.fillRect(cx - hr, hcy - hr, hr * 2, hr);
      c.beginPath(); c.arc(cx + dx, hcy + dy, hr, Math.PI, 0); c.lineTo(cx + hr, hcy); c.closePath(); c.fillStyle = 'rgba(255,255,255,.12)'; c.fill();
      c.restore();
      grain(c, x0, y0, w, h * .45, P, b.id || 2);
      rim([[x0 + rr, y0 + 1.5], [x1 - rr, y0 + 1.5]]);
    } else if (b.t === 'tri' || b.t === 'roof') {
      const ax = cx, ay = y0;
      // الوجه الأيسر المائل (خلفي)
      poly(c, [[x0, y1], [ax, ay], [ax + dx, ay + dy], [x0 + dx, y1 + dy]]); c.fillStyle = P.l; c.fill(); c.strokeStyle = edge; c.lineWidth = 1; c.stroke();
      // الوجه الأيمن المائل
      poly(c, [[ax, ay], [ax + dx, ay + dy], [x1 + dx, y1 + dy], [x1, y1]]);
      const g = c.createLinearGradient(ax, ay, x1 + dx, y1); g.addColorStop(0, P.m); g.addColorStop(1, P.dd);
      c.fillStyle = g; c.fill(); c.stroke();
      frontFill(() => poly(c, [[x0, y1], [ax, ay], [x1, y1]]));
      rim([[x0 + 3, y1 - 3], [ax, ay + 3]]);
      if (b.t === 'roof') { c.strokeStyle = 'rgba(80,30,20,.18)'; c.lineWidth = 1.5; for (let k = 1; k < 3; k++) { const yy = y0 + h * k / 3; const hw = w / 2 * k / 3; c.beginPath(); c.moveTo(cx - hw, yy); c.lineTo(cx + hw, yy); c.stroke(); } }
    } else if (b.t === 'cyl' && b.r === 0) {
      // أسطوانة واقفة
      const rx = w * .44, ry = U * .16, ex = cx + dx * .5, eyT = y0 + dy * .5 + ry * .2, eyB = y1 + dy * .5 - ry * .1;
      c.beginPath(); c.moveTo(ex - rx, eyT); c.lineTo(ex - rx, eyB); c.ellipse(ex, eyB, rx, ry, 0, Math.PI, 0, true); c.lineTo(ex + rx, eyT); c.closePath();
      let g = c.createLinearGradient(ex - rx, 0, ex + rx, 0); g.addColorStop(0, P.d); g.addColorStop(.3, P.l); g.addColorStop(.55, P.m); g.addColorStop(1, P.dd);
      c.fillStyle = g; c.fill(); c.strokeStyle = edge; c.lineWidth = 1.2; c.stroke();
      c.beginPath(); c.ellipse(ex, eyT, rx, ry, 0, 0, TAU);
      g = c.createLinearGradient(0, eyT - ry, 0, eyT + ry); g.addColorStop(0, P.ll); g.addColorStop(1, P.l);
      c.fillStyle = g; c.fill(); c.stroke();
      c.strokeStyle = P.g; c.lineWidth = 1; c.beginPath(); c.ellipse(ex, eyT, rx * .55, ry * .55, 0, 0, TAU); c.stroke();
      rim([[ex - rx * .55, eyT + ry * 1.3], [ex - rx * .55, eyB - 2]]);
    } else if (b.t === 'cyl') {
      // أسطوانة نائمة (عجلة)
      const r = Math.min(w, h) * .48;
      extrude((ox, oy) => { c.beginPath(); c.arc(cx + ox, cy + oy, r, 0, TAU); });
      c.beginPath(); c.arc(cx, cy, r, 0, TAU);
      const g = c.createRadialGradient(cx - r * .3, cy - r * .35, r * .1, cx, cy, r); g.addColorStop(0, P.ll); g.addColorStop(.6, P.m); g.addColorStop(1, P.d);
      c.fillStyle = g; c.fill(); c.strokeStyle = edge; c.lineWidth = 1.2; c.stroke();
      c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = Math.max(1.5, r * .1); c.beginPath(); c.arc(cx, cy, r * .62, 0, TAU); c.stroke();
      c.fillStyle = '#FFF4D8'; c.beginPath(); c.arc(cx, cy, r * .22, 0, TAU); c.fill();
      c.fillStyle = P.dd; c.beginPath(); c.arc(cx, cy, r * .09, 0, TAU); c.fill();
      rim([[cx - r * .72, cy - r * .3], [cx - r * .45, cy - r * .65]]);
    } else if (b.t === 'moon') {
      const r = w / 2;
      if (b.r === 0) {
        const path = (ox, oy) => { c.beginPath(); c.moveTo(x0 + ox, y1 + oy); c.arc(cx + ox, y1 + oy, r, Math.PI, 0); c.closePath(); };
        extrude(path);
        frontFill(() => path(0, 0));
        c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = Math.max(1.5, U * .05); c.lineCap = 'round'; c.beginPath(); c.arc(cx, y1, r - U * .1, Math.PI * 1.15, Math.PI * 1.45); c.stroke();
      } else {
        const path = (ox, oy) => { c.beginPath(); c.moveTo(x0 + ox, y0 + oy); c.arc(cx + ox, y0 + oy, r, Math.PI, 0, true); c.closePath(); };
        extrude(path);
        // السطح العلوي المسطّح
        poly(c, [[x0, y0], [x0 + dx, y0 + dy], [x1 + dx, y0 + dy], [x1, y0]]); c.fillStyle = P.ll; c.fill(); c.strokeStyle = edge; c.lineWidth = 1; c.stroke();
        frontFill(() => path(0, 0));
        rim([[x0 + rr, y0 + 1.5], [x1 - rr, y0 + 1.5]]);
      }
    }
    c.restore();
  }
  function star(c, x, y, r) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .45 : r; c.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q); } c.closePath(); c.fill(); }
  /** رسم مجسّم كامل (للصورة والمعرض) داخل مستطيل */
  function drawStructure(c, list, bx, by, bw, bh, maxU) {
    if (!list.length) return;
    let mx = 99, Mx = 0, Mz = 0;
    for (const b of list) { const [w, h] = fpOf(b.t, b.r); mx = Math.min(mx, b.x); Mx = Math.max(Mx, b.x + w); Mz = Math.max(Mz, b.z + h); }
    const cw = Mx - mx + DXK, ch = Mz - DYK;
    const U = Math.min(bw / cw, bh / ch, maxU || 99);
    const ox = bx + (bw - cw * U) / 2 - mx * U, oy = by + bh - (bh - ch * U) / 2;
    c.save(); c.fillStyle = 'rgba(60,30,10,.16)'; c.beginPath(); c.ellipse(ox + (mx + (Mx - mx) / 2) * U + U * DXK * .5, oy + U * DYK * .3, (Mx - mx) * U * .6, U * .18, 0, 0, TAU); c.fill(); c.restore();
    const L = list.slice().sort((a, b) => (a.z + a.x * .01) - (b.z + b.x * .01) || a.x - b.x);
    for (const b of sortDraw(L)) { const [w, h] = fpOf(b.t, b.r); drawBlock(c, b, ox + (b.x + w / 2) * U, oy - (b.z + h / 2) * U, U); }
  }
  function sortDraw(L) { return L.slice().sort((a, b) => { const fa = fpOf(a.t, a.r), fb = fpOf(b.t, b.r); return (a.z - (a.x + fa[0])) - (b.z - (b.x + fb[0])) || a.z - b.z; }); }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #woodblocks{background:#FFE9C7;overflow:hidden}
  #woodblocks canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #woodblocks .ib{color:#B5541C}
  #woodblocks .lng{display:flex;background:rgba(255,255,255,.95);border-radius:99px;padding:3px;gap:2px;box-shadow:0 4px 0 rgba(150,80,20,.22);border:2px solid #fff}
  #woodblocks .lng button{padding:4px 9px;border-radius:99px;font-weight:900;font-size:14px;background:transparent;color:#9A4A16;line-height:1.2}
  #woodblocks .lng button.on{background:linear-gradient(180deg,#FFAA5C,#F07A1E);color:#fff;box-shadow:0 2px 0 #C25A0C}
  #woodblocks .side{position:absolute;z-index:6;display:flex;flex-direction:column;gap:10px;align-items:center}
  #woodblocks .side.l{left:max(10px,env(safe-area-inset-left))}
  #woodblocks .side.r{right:max(10px,env(safe-area-inset-right))}
  #woodblocks .spk{width:56px;height:56px;border-radius:50%;font-size:25px;display:grid;place-items:center;border:3px solid #FFF3C4;
    background:radial-gradient(circle at 35% 30%,#FFE98A,#FFC21A 60%,#E9A300);box-shadow:0 5px 0 #C98600,0 8px 16px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.6)}
  #woodblocks .spk:active,#woodblocks .rb:active{transform:translateY(3px)}
  #woodblocks .rb{width:52px;height:52px;border-radius:18px;font-size:24px;display:grid;place-items:center;border:3px solid #fff;color:#fff;
    background:linear-gradient(180deg,#7BD88F,#2FB457);box-shadow:0 5px 0 #1E8A3E,0 8px 14px rgba(0,0,0,.18)}
  #woodblocks .rb.hn{background:linear-gradient(180deg,#FFF0B0,#FFD54A);box-shadow:0 5px 0 #D9A400,0 8px 14px rgba(0,0,0,.15)}
  #woodblocks .rb.alt{background:linear-gradient(180deg,#fff,#FFF1E0);box-shadow:0 5px 0 #F0C9A0,0 8px 14px rgba(0,0,0,.12)}
  #woodblocks .rb[hidden]{display:none}
  #woodblocks .sw{position:absolute;z-index:6;left:0;right:0;display:none;justify-content:center;gap:7px}
  #woodblocks .sw.on{display:flex}
  #woodblocks .sw button{width:32px;height:32px;border-radius:50%;border:3px solid #fff;background:var(--c);box-shadow:0 3px 0 rgba(0,0,0,.18)}
  #woodblocks .sw button.on{transform:scale(1.25);box-shadow:0 0 0 3px #F07A1E,0 3px 0 rgba(0,0,0,.18)}
  #woodblocks .panel{border-color:#FFD9B0;box-shadow:0 9px 0 #F0A060,0 22px 44px rgba(90,40,0,.3);color:#6B3410;background:linear-gradient(180deg,#fff 0%,#fff 70%,#FFF4E6 100%)}
  #woodblocks .panel h3{color:#D9601A;text-shadow:0 3px 0 #FFE2C6}
  #woodblocks .btn{background:linear-gradient(180deg,#FFAA5C,#F07A1E 60%,#E0660C);box-shadow:0 5px 0 #B54F08,0 9px 14px rgba(180,80,0,.3)}
  #woodblocks .btn.alt{background:#fff;color:#D9601A;box-shadow:0 5px 0 #F7D2AE;border-color:#FFE7CF}
  #woodblocks .overlay{background:radial-gradient(circle at 50% 45%,rgba(120,60,10,.22),rgba(60,25,0,.5))}
  #woodblocks .lvp{width:min(94vw,500px);padding:16px 12px 14px}
  #woodblocks .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-height:min(62vh,620px);overflow-y:auto;touch-action:pan-y;padding:6px 4px 10px;margin:8px 0 10px}
  #woodblocks .lv{position:relative;border-radius:22px;background:linear-gradient(180deg,#fff,#FFF2E2);padding:6px 4px 6px;display:flex;flex-direction:column;align-items:center;border:3px solid #fff;
    box-shadow:0 5px 0 #F3C79C,0 8px 12px rgba(150,80,20,.12);color:#6B3410}
  #woodblocks .lv:active{transform:translateY(3px)}
  #woodblocks .lv canvas{width:84px;height:66px;display:block}
  #woodblocks .lv b{font-size:12.5px;line-height:1.2}
  #woodblocks .lv .n{position:absolute;top:4px;right:6px;width:24px;height:24px;border-radius:50%;background:#F07A1E;color:#fff;font-weight:900;font-size:14px;display:grid;place-items:center;box-shadow:0 2px 0 #B54F08}
  #woodblocks .lv .s{font-size:12px;letter-spacing:-2px}
  #woodblocks .lv .s i{font-style:normal}
  #woodblocks .lv .s i.off{filter:grayscale(1);opacity:.3}
  #woodblocks .lv.lock{filter:grayscale(.85);opacity:.6}
  #woodblocks .lv.lock::after{content:'🔒';position:absolute;top:28px;font-size:26px}
  #woodblocks .lv.cur{background:linear-gradient(180deg,#FFF6C8,#FFE07A);box-shadow:0 5px 0 #E9A300}
  #woodblocks .lv.free{background:linear-gradient(180deg,#E8F7FF,#C9EBFF);box-shadow:0 5px 0 #8CCBF0}
  #woodblocks .gal{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-height:min(60vh,600px);overflow-y:auto;touch-action:pan-y;padding:6px 4px 10px;margin:8px 0 10px}
  #woodblocks .gal button{position:relative;border-radius:18px;background:linear-gradient(180deg,#fff,#FFF2E2);border:3px solid #fff;box-shadow:0 4px 0 #F3C79C;padding:4px}
  #woodblocks .gal canvas{width:100%;aspect-ratio:4/3;display:block}
  #woodblocks .gal .x{position:absolute;top:-6px;left:-6px;width:26px;height:26px;border-radius:50%;background:#F2484B;color:#fff;font-size:13px;font-weight:900;display:grid;place-items:center;border:2px solid #fff}
  #woodblocks .gal p{grid-column:1/-1;opacity:.7}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" data-i="home">🏠</button>
      <button class="ib helpbtn" data-i="help">❓</button>
      <span class="grow"></span>
      <div class="lng"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
      <button class="ib lvb" data-i="levels">🗺️</button>
    </div>
    <div class="side l"><button class="spk" data-i="listen">🔊</button></div>
    <div class="side r">
      <button class="rb ok" data-i="check">✔</button>
      <button class="rb hn" data-i="hint">💡</button>
      <button class="rb alt save" data-i="save" hidden>💾</button>
      <button class="rb alt galb" data-i="gallery" hidden>🖼️</button>
      <button class="rb alt clr" data-i="clear" hidden>🗑️</button>
    </div>
    <div class="sw"></div>
    <div class="overlay" id="wbLv"><div class="panel lvp"><h3 class="hLv"></h3>
      <div class="grid"></div>
      <button class="btn alt" data-a="close"></button></div></div>
    <div class="overlay" id="wbGal"><div class="panel lvp"><h3 class="hGal"></h3>
      <div class="gal"></div>
      <button class="btn alt" data-a="gclose"></button></div></div>
    <div class="overlay" id="wbWin"><div class="panel">
      <h3 class="wT"></h3><canvas class="wC" style="width:200px;height:130px;display:block;margin:0 auto"></canvas><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next"></button><br>
      <button class="btn alt" data-a="again"></button><button class="btn alt" data-a="levels">🗺️</button><button class="btn alt home" data-i="home">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const spk = root.querySelector('.spk'), okB = root.querySelector('.ok'), hintB = root.querySelector(".hn");
  const saveB = root.querySelector('.save'), galB = root.querySelector('.galb'), clrB = root.querySelector('.clr');
  const swEl = root.querySelector('.sw');
  const lvOv = root.querySelector('#wbLv'), galOv = root.querySelector('#wbGal'), winOv = root.querySelector('#wbWin');
  const sideL = root.querySelector('.side.l'), sideR = root.querySelector('.side.r');
  function chrome() {
    const AL = { home: App.t('الرئيسية', 'Home'), help: App.t('مساعدة', 'Help'), levels: App.t('المستويات', 'Levels'), listen: App.t('استمع', 'Listen'), check: App.t('تحقق', 'Check'), hint: App.t('تلميح', 'Hint'), save: App.t('حفظ', 'Save'), gallery: App.t('المعرض', 'Gallery'), clear: App.t('مسح', 'Clear') };
    root.querySelectorAll('[data-i]').forEach(e => e.setAttribute('aria-label', AL[e.dataset.i]));
    root.querySelector('.hLv').textContent = '🧱 ' + App.t('ماذا نبني؟', 'What shall we build?');
    root.querySelector('.hGal').textContent = '🖼️ ' + App.t('معرض المباني', 'Buildings gallery');
    root.querySelectorAll('[data-a="close"],[data-a="gclose"]').forEach(b => { b.textContent = '✕ ' + App.t('إغلاق', 'Close'); });
    root.querySelector('[data-a="next"]').textContent = App.t('التالي', 'Next') + ' ▶️';
    root.querySelector('[data-a="again"]').textContent = '🔄 ' + App.t('مرة أخرى', 'Again');
  }
  let winSt = 0;
  function winText() {
    winOv.querySelector('.wT').textContent = App.t(App.g('أحسنتِ! ', 'أحسنت! '), 'Well done! ') + M.ic;
    winOv.querySelector('.wP').textContent = App.t(M.ar, M.en) + ' — ' + (winSt === 3 ? App.t(App.g('مطابق تمامًا! رائعة', 'مطابق تمامًا! رائع'), 'A perfect match! Amazing') : App.t('بناء جميل!', 'Lovely building!'));
  }

  /* ---------- الحالة ---------- */
  let ctx, Wd = 0, Hd = 0, raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, M = MODELS[0], free = false, blocks = [], parts = [], evs = [], drag = null, phase = 'idle';
  let mistakes = 0, hinted = false, ghostT = -9, ghostX = 0, lastAct = 0, nid = 1, curCol = 'R', shake = 0, badIds = new Set();
  let U = 40, gx0 = 0, gy0 = 0, card = { x: 0, y: 0, w: 0, h: 0 }, tray = { x: 0, y: 0, w: 0, h: 0 }, ts = .7, portrait = true;
  const after = (s, fn) => evs.push({ t: T + s, fn });
  const mkB = (t, r, c) => ({ id: nid++, t, r, c, x: 0, z: 0, st: 'tray', px: 0, py: 0, hx: 0, hy: 0, sc: .7, rot: 0, sqT: -9, wobT: -9, vy: 0, tx: 0, ty: 0, anim: null });
  const placed = () => blocks.filter(b => b.st === 'mat' || b.st === 'fall');

  /* ---------- بدء مستوى ---------- */
  function startLevel(n, isFree) {
    free = !!isFree; if (!free) { lvl = clamp(n, 1, NL); M = MODELS[lvl - 1]; }
    winOv.classList.remove('on'); lvOv.classList.remove('on'); galOv.classList.remove('on');
    blocks = []; parts = []; evs = []; drag = null; mistakes = 0; hinted = false; ghostT = -9; badIds.clear();
    if (free) {
      TORDER.forEach((t, i) => { const b = mkB(t, 0, curCol); b.st = 'pal'; b.slot = i; blocks.push(b); });
    } else {
      shuffle(M.b.map(q => q)).forEach((q, i) => { const b = mkB(q[0], 0, q[4]); b.slot = i; blocks.push(b); });
    }
    phase = 'play';
    saveB.hidden = galB.hidden = clrB.hidden = !free; okB.hidden = hintB.hidden = free;
    swEl.classList.toggle('on', free); paintSw();
    layout();
    blocks.forEach((b, i) => { b.px = b.hx; b.py = Hd + 60; b.anim = { t0: T + .05 * i, dur: .45, fx: b.hx + rand(-20, 20), fy: Hd + 60, tx: b.hx, ty: b.hy, arc: 50, done: () => { b.sqT = T; } }; });
    lastAct = T;
    after(.6, promptSpeak);
  }
  function paintSw() {
    swEl.innerHTML = CKEYS.map(k => `<button data-c="${k}" class="${k === curCol ? 'on' : ''}" style="--c:${COLS[k].h}" aria-label="${App.t(COLS[k].ar, COLS[k].en)}"></button>`).join('');
    swEl.querySelectorAll('button').forEach(b => b.onclick = () => {
      curCol = b.dataset.c; Sound.tap(); paintSw();
      blocks.forEach(x => { if (x.st === 'pal') { x.c = curCol; x.sqT = T; } });
      say(COLS[curCol].ar, COLS[curCol].en);
    });
  }

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; Wd = f.w; Hd = f.h;
    portrait = Wd / Hd < 1.05;
    const playW = Math.min(Wd, 1100), x0 = (Wd - playW) / 2;
    // الصينية
    const items = blocks.filter(b => b.st === 'tray' || b.st === 'pal' || b.slot != null).sort((a, b) => a.slot - b.slot);
    const u0 = portrait ? Math.min((Wd - 40) / (NC + 1), 54) : 58;
    ts = portrait ? .9 : .78;
    let rows, packW = playW - (portrait ? 30 : 160);
    const iw = b => { const [w] = fpOf(b.t, b.r); return Math.max(w, 1.6) * u0 * ts + u0 * DXK * ts + 18; };
    for (let k = 0; k < 6; k++) {
      rows = [[]]; let w = 0;
      for (const b of items) { const q = iw(b); if (w + q > packW && rows[rows.length - 1].length) { rows.push([]); w = 0; } rows[rows.length - 1].push([b, q]); w += q; }
      const rh = u0 * ts * (items.some(b => fpOf(b.t, b.r)[1] > 1) ? 2 : 1.2) + 18;
      if ((rows.length <= 2 && rows.length * rh + 26 <= Hd * .26) || ts < .4) break; ts -= .05;
    }
    const rowH = u0 * ts * (items.some(b => fpOf(b.t, b.r)[1] > 1) ? 2 : 1.2) + 18;
    const swH = free ? 44 : 0;
    const th = rows.length * rowH + 26;
    tray = { x: x0 + 10, w: playW - 20, h: th, y: Hd - th - 12 - swH };
    rows.forEach((row, ri) => {
      const tw = row.reduce((a, q) => a + q[1], 0);
      let x = Wd / 2 - tw / 2;
      const cy = tray.y + 13 + rowH * (ri + .5);
      for (const [b, q] of row) { b.hx = x + q / 2 - u0 * DXK * ts * .5; b.hy = cy; x += q; }
    });
    swEl.style.bottom = (12) + 'px';
    // بطاقة الصورة والبساط
    const top = 66;
    if (portrait) {
      card = { x: 12, y: top + 4, w: Wd - 24, h: free ? 0 : clamp(Hd * .19, 110, 180) };
      const mTop = card.y + card.h + (free ? 10 : 18), mBot = tray.y - 22;
      U = Math.min((Wd - 28) / (NC + DXK + .3), (mBot - mTop) / (NR - DYK + .45));
      gx0 = (Wd - (NC + DXK) * U) / 2; gy0 = mBot - U * .25;
    } else {
      const cw = free ? 0 : Math.min(300, playW * .27);
      card = { x: x0 + 14, y: top + 10, w: cw, h: free ? 0 : Math.min(260, (tray.y - top) * .6) };
      const mx0 = card.x + cw + 30, mx1 = x0 + playW - 80, mTop = top + 6, mBot = tray.y - 22;
      U = Math.min((mx1 - mx0) / (NC + DXK + .3), (mBot - mTop) / (NR - DYK + .45), 74);
      gx0 = mx0 + ((mx1 - mx0) - (NC + DXK) * U) / 2; gy0 = mBot - U * .25;
    }
    U = Math.max(16, U);
    for (const b of blocks) if (b.st === 'mat') { const c = cellCenter(b); b.px = c[0]; b.py = c[1]; }
    sideL.style.bottom = (Hd - tray.y + 12) + 'px';
    if (portrait && free) { sideR.style.bottom = 'auto'; sideR.style.top = 'calc(max(10px,env(safe-area-inset-top)) + 58px)'; sideR.style.flexDirection = 'row'; }
    else { sideR.style.top = 'auto'; sideR.style.bottom = (Hd - tray.y + 12) + 'px'; sideR.style.flexDirection = 'column'; }
  }
  function cellCenter(b, x = b.x, z = b.z) { const [w, h] = fpOf(b.t, b.r); return [gx0 + (x + w / 2) * U, gy0 - (z + h / 2) * U]; }

  /* ---------- الشبكة والجاذبية ---------- */
  function occ(ignore) {
    const g = Array.from({ length: NC }, () => Array(NR + 8).fill(null));
    for (const b of blocks) if ((b.st === 'mat' || b.st === 'fall') && b !== ignore) {
      const [w, h] = fpOf(b.t, b.r);
      for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) if (b.x + i < NC) g[b.x + i][b.z + j] = b;
    }
    return g;
  }
  /** أين تستقر القطعة إن أُسقطت في العمود x؟ */
  function landing(b, x) {
    const [w, h] = fpOf(b.t, b.r), g = occ(b);
    x = clamp(x, 0, NC - w);
    let z = 0;
    for (let i = 0; i < w; i++) { let t = 0; for (let j = 0; j < NR + 8; j++) if (g[x + i][j]) t = j + 1; z = Math.max(z, t); }
    let cap = null;
    if (z > 0) for (let i = 0; i < w; i++) { const u = g[x + i][z - 1]; if (u && isCap(u)) cap = u; }
    const under = new Set(); if (z > 0) for (let i = 0; i < w; i++) { const u = g[x + i][z - 1]; if (u) under.add(u); }
    let beside = null;
    for (let j = 0; j < h; j++) { if (x > 0 && g[x - 1][z + j]) beside = g[x - 1][z + j]; if (x + w < NC && g[x + w][z + j]) beside = g[x + w][z + j]; }
    return { x, z, ok: !cap && z + h <= NR, cap, under: [...under], beside };
  }
  const topFree = b => { const g = occ(null), [w, h] = fpOf(b.t, b.r); for (let i = 0; i < w; i++) if (g[b.x + i][b.z + h]) return g[b.x + i][b.z + h]; return null; };
  function dropCol(b, px) { const [w] = fpOf(b.t, b.r); return Math.round((px - gx0) / U - w / 2); }
  const overMat = (px, py) => px > gx0 - U * 1.2 && px < gx0 + (NC + 1.2) * U && py < tray.y - 6 && py > gy0 - (NR + 1.5) * U;

  /* ---------- الحركة ---------- */
  function dropOnMat(b, L) {
    b.x = L.x; b.z = L.z; b.st = 'fall';
    const [tx, ty] = cellCenter(b); b.tx = tx; b.ty = ty; b.vy = 0;
    if (b.py > ty) { b.st = 'fly'; b.anim = { t0: T, dur: .18, fx: b.px, fy: b.py, tx, ty: ty - U * .3, arc: 0, done: () => { b.st = 'fall'; b.vy = 200; } }; }
    b._L = L;
  }
  function landedB(b) {
    b.st = 'mat'; b.py = b.ty; b.px = b.tx; b.sqT = T;
    const L = b._L || {};
    Sound.thud(); Sound.tone(220 + b.z * 60 + rand(-10, 10), .1, 'triangle', .1); vibrate(12);
    shake = Math.min(.5, shake + .12 + b.z * .02);
    for (const u of L.under || []) u.sqT = T - .05;
    dust(b.px, b.py + fpOf(b.t, b.r)[1] * U / 2);
    // نطق الموضع
    lastAct = T;
    if (L.under && L.under.length) { const u = L.under[0]; after(.05, () => say('فوق ' + TYPES[u.t].def, 'on the ' + TYPES[u.t].en)); }
    else if (L.beside) { const u = L.beside; after(.05, () => say('بجانب ' + TYPES[u.t].def, 'next to the ' + TYPES[u.t].en)); }
    if (!free && !blocks.some(x => x.st === 'tray' || x.st === 'drag' || x.st === 'fly' || x.st === 'fall')) after(.7, check);
  }
  function toTray(b, hop) {
    if (b.free) { b.st = 'fly'; b.anim = { t0: T, dur: .3, fx: b.px, fy: b.py, tx: b.px, ty: b.py - 30, arc: 0, done: () => { b.st = 'gone'; poof(b.px, b.py); } }; blocks = blocks; return; }
    b.st = 'fly'; b.rot = 0;
    b.anim = { t0: T, dur: .42, fx: b.px, fy: b.py, tx: b.hx, ty: b.hy, arc: hop ? 60 : 24, done: () => { b.st = 'tray'; b.sqT = T; } };
  }
  function wobble(b) { b.wobT = T; Sound.tone(300, .2, 'sine', .12, 200); Sound.error(); vibrate(20); }
  function rotate(b) {
    lastAct = T;
    if (nRot(b.t) < 2) { b.wobT = T; Sound.tap(); spinT(b); sayBlock(b); return; }
    if (b.st === 'tray' || b.st === 'pal') {
      b.r = (b.r + 1) % nRot(b.t); b.sqT = T; Sound.slide(); Sound.tone(520, .08, 'sine', .08);
      layout(); sayBlock(b); return;
    }
    if (b.st === 'mat') {
      const above = topFree(b);
      if (above) { wobble(b); say('تحت ' + TYPES[above.t].def, 'under the ' + TYPES[above.t].en); return; }
      const oldR = b.r; b.r = (b.r + 1) % nRot(b.t);
      const L = landing(b, b.x);
      if (!L.ok) { b.r = oldR; wobble(b); return; }
      Sound.slide(); b.sqT = T;
      const c0 = [b.px, b.py]; dropOnMat(b, L); b.px = c0[0]; b.py = Math.min(c0[1], b.ty);
    }
  }
  function spinT(b) { b.spinT = T; }

  /* ---------- التحقق ---------- */
  function keyOf(b, dx) { const r = nRot(b.t) > 1 ? b.r : 0; return `${b.t}:${r}:${b.x - dx}:${b.z}`; }
  function check() {
    if (free || phase !== 'play') return;
    if (blocks.some(x => x.st === 'fall' || x.st === 'fly')) { after(.3, check); return; }
    const P = placed();
    if (!P.length) return;
    const mxB = Math.min(...P.map(b => b.x)), mxM = Math.min(...M.b.map(q => q[1]));
    const want = new Map();
    for (const q of M.b) { const k = keyOf({ t: q[0], r: q[3], x: q[1], z: q[2] }, mxM); want.set(k, (want.get(k) || 0) + 1); }
    badIds.clear();
    for (const b of P) { const k = keyOf(b, mxB); if (want.get(k)) want.set(k, want.get(k) - 1); else badIds.add(b.id); }
    const missing = [...want.values()].reduce((a, v) => a + v, 0);
    if (!badIds.size && !missing && P.length === M.b.length) { win(); return; }
    lastAct = T;
    if (blocks.some(b => b.st === 'tray')) { // لم ينتهِ بعد: نُظهر فقط القطع الخاطئة
      if (badIds.size) { mistakes++; P.filter(b => badIds.has(b.id)).forEach(b => b.wobT = T); Sound.error(); say(App.g('انظري إلى الصورة', 'انظر إلى الصورة'), 'Look at the picture'); }
      else { Sound.tap(); say(App.g('أكملي البناء', 'أكمل البناء'), 'Keep building'); }
      return;
    }
    mistakes++;
    P.filter(b => badIds.has(b.id)).forEach(b => b.wobT = T);
    Sound.error(); vibrate(25);
    ghostT = T; ghostX = mxB;
    say(App.g('حاولي مرة أخرى', 'حاول مرة أخرى') + '. ' + App.g('انظري إلى الصورة', 'انظر إلى الصورة'), 'Try again! Look at the picture');
  }
  function win() {
    phase = 'done'; badIds.clear();
    Sound.win(); after(.2, () => say('أحسنت! ' + M.ar, 'Well done! ' + M.en));
    for (const b of placed()) after(rand(0, .4), () => { b.sqT = T; });
    for (let i = 0; i < 100; i++) confetti();
    after(2, showWin);
  }
  function showWin() {
    phase = 'over';
    const st = mistakes === 0 && !hinted ? 3 : mistakes <= 1 ? 2 : 1;
    const pr = loadProg(), first = !pr.stars[lvl];
    pr.stars[lvl] = Math.max(pr.stars[lvl] || 0, st);
    pr.unlocked = Math.max(pr.unlocked, Math.min(NL, lvl + 1));
    store.set('woodblocksProg', pr);
    App.addStars(first ? st + 1 : 1);
    App.achieve('woodblocks_first');
    if (M.k === 'pyramids') App.achieve('woodblocks_pyramids');
    if (Object.keys(pr.stars).filter(k => pr.stars[k]).length >= NL) App.achieve('woodblocks_all');
    winSt = st; winText();
    const wc = winOv.querySelector('.wC'), k = 2; wc.width = 200 * k; wc.height = 130 * k;
    const c = wc.getContext('2d'); c.scale(k, k);
    drawStructure(c, M.b.map(q => ({ t: q[0], x: q[1], z: q[2], r: q[3], c: q[4], id: 3 })), 10, 6, 180, 118, 40);
    winOv.querySelector('.wS').innerHTML = [1, 2, 3].map(i => `<span class="${i <= st ? '' : 'off'}">⭐</span>`).join('');
    winOv.querySelector('[data-a="next"]').style.display = lvl < NL ? '' : 'none';
    winOv.classList.add('on');
  }

  /* ---------- النطق والتعليمات ---------- */
  function promptSpeak() {
    lastAct = T;
    if (free) { say(App.g('ابني ما تحبين', 'ابنِ ما تحب'), 'Build anything you like'); return; }
    if (phase !== 'play') return;
    say(M.ar + '. ' + App.g('ابني مثل الصورة', 'ابنِ مثل الصورة'), M.en + '. Build it like the picture');
  }

  /* ---------- المعرض ---------- */
  const loadGal = () => store.get('woodblocksGallery', []);
  function saveBuild() {
    const P = placed().filter(b => b.st === 'mat');
    if (!P.length) { Sound.error(); return; }
    const g = loadGal();
    g.unshift({ b: P.map(b => [b.t, b.x, b.z, b.r, b.c]), d: Date.now() });
    store.set('woodblocksGallery', g.slice(0, 15));
    Sound.star(); App.toast(App.t('حُفظ بناؤك في المعرض 🖼️', 'Your building was saved to the gallery 🖼️'));
    for (let i = 0; i < 40; i++) confetti();
    App.achieve('woodblocks_free');
    if (g.length === 1) App.addStars(2);
  }
  function openGal() {
    const g = loadGal(), el = galOv.querySelector('.gal');
    el.innerHTML = g.length ? g.map((it, i) => `<button data-i="${i}"><canvas></canvas><span class="x" data-del="${i}">✕</span></button>`).join('') : `<p>${App.t(App.g('لم تحفظي أي بناء بعد', 'لم تحفظ أي بناء بعد'), 'No saved buildings yet')} 💾</p>`;
    el.querySelectorAll('canvas').forEach((c, i) => {
      const k = 2; c.width = 120 * k; c.height = 90 * k; const x = c.getContext('2d'); x.scale(k, k);
      drawStructure(x, g[i].b.map(q => ({ t: q[0], x: q[1], z: q[2], r: q[3], c: q[4], id: 5 })), 6, 6, 108, 78, 30);
    });
    el.querySelectorAll('button').forEach(b => b.onclick = e => {
      const del = e.target.closest('[data-del]');
      if (del) { e.stopPropagation(); const gg = loadGal(); gg.splice(+del.dataset.del, 1); store.set('woodblocksGallery', gg); Sound.poof(); openGal(); return; }
      Sound.tap(); loadBuild(g[+b.dataset.i]);
    });
    galOv.classList.add('on');
  }
  function loadBuild(it) {
    galOv.classList.remove('on');
    blocks = blocks.filter(b => b.st === 'pal');
    it.b.forEach((q, i) => {
      const b = mkB(q[0], q[3], q[4]); b.x = q[1]; b.z = q[2]; b.free = true; b.st = 'fly';
      const [tx, ty] = cellCenter(b);
      b.px = tx; b.py = -60; b.anim = { t0: T + i * .07 + b.z * .12, dur: .5, fx: tx, fy: -60 - b.z * 40, tx, ty, arc: 0, done: () => { b.st = 'mat'; b.sqT = T; Sound.thud(); } };
      blocks.push(b);
    });
  }
  function clearAll() {
    const P = blocks.filter(b => b.st === 'mat');
    if (!P.length) return;
    Sound.whoosh();
    P.forEach((b, i) => { b.st = 'fly'; b.anim = { t0: T + i * .03, dur: .5, fx: b.px, fy: b.py, tx: b.px + rand(-80, 80), ty: Hd + 100, arc: 80, done: () => { b.st = 'gone'; } }; });
  }

  /* ---------- اللوحات ---------- */
  function thumb(c, list, w, h, maxU) { const k = 2; c.width = w * k; c.height = h * k; const x = c.getContext('2d'); x.scale(k, k); drawStructure(x, list, 4, 4, w - 8, h - 8, maxU); }
  function openLevels() {
    const pr = loadProg(), grid = lvOv.querySelector('.grid');
    grid.innerHTML = MODELS.map((V, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lv${lock ? ' lock' : ''}${!free && n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="${App.t(V.ar, V.en)}">
        <span class="n">${dg(n)}</span><canvas></canvas><b>${App.t(V.ar, V.en)}</b>
        <span class="s">${[1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('') + `<button class="lv free" data-l="free"><span style="font-size:44px;line-height:66px">🎨</span><b>${App.t('البناء الحر', 'Free build')}</b><span class="s">🖼️</span></button>`;
    grid.querySelectorAll('canvas').forEach((c, i) => thumb(c, MODELS[i].b.map(q => ({ t: q[0], x: q[1], z: q[2], r: q[3], c: q[4], id: 4 })), 84, 66, 22));
    grid.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      if (b.dataset.l === 'free') { Sound.tap(); startLevel(lvl, true); return; }
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); if (b.animate) b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
  }
  function paintLang() { root.querySelectorAll('.lng button').forEach(b => b.classList.toggle('on', b.dataset.l === lang)); }
  function setLang(l) {
    if (l === lang) return;
    lang = l; store.set('woodblocksLang', l); Sound.tap(); langChanged();
    promptSpeak();
  }
  function langChanged() {
    paintLang(); chrome(); if (phase === 'over') winText();
    swEl.querySelectorAll('[data-c]').forEach(b => b.setAttribute('aria-label', App.t(COLS[b.dataset.c].ar, COLS[b.dataset.c].en)));
    if (lvOv.classList.contains('on')) openLevels();
    if (galOv.classList.contains('on')) openGal();
  }
  function act(a) {
    Sound.tap();
    if (a === 'close') { lvOv.classList.remove('on'); if (phase === 'over') winOv.classList.add('on'); }
    else if (a === 'gclose') galOv.classList.remove('on');
    else if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvb').addEventListener('click', () => { Sound.tap(); openLevels(); });
  root.querySelectorAll('.lng button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l)));
  const pulse = el => { const g = G(); if (g) g.fromTo(el, { scale: 1.2 }, { scale: 1, duration: .5, ease: 'elastic.out(1,.4)' }); };
  spk.addEventListener('click', () => { promptSpeak(); pulse(spk); });
  okB.addEventListener('click', () => { pulse(okB); if (!placed().length) { Sound.error(); return; } check(); });
  hintB.addEventListener('click', () => {
    pulse(hintB); if (phase !== 'play') return;
    hinted = true; ghostT = T; const P = placed(); ghostX = P.length ? Math.min(...P.map(b => b.x)) : Math.max(0, Math.floor((NC - modelW()) / 2));
    Sound.star(); say(M.ar, M.en);
  });
  saveB.addEventListener('click', () => { pulse(saveB); saveBuild(); });
  galB.addEventListener('click', () => { Sound.tap(); openGal(); });
  clrB.addEventListener('click', () => { pulse(clrB); clearAll(); });
  function modelW() { let mx = 99, Mx = 0; for (const q of M.b) { mx = Math.min(mx, q[1]); Mx = Math.max(Mx, q[1] + fpOf(q[0], q[3])[0]); } return Mx - mx; }

  /* ---------- الجسيمات ---------- */
  function dust(x, y) { for (let i = 0; i < 10; i++) { const s = i % 2 ? 1 : -1; parts.push({ x: x + s * rand(0, U * .5), y, vx: s * rand(30, 110), vy: rand(-40, -10), g: 40, life: rand(.4, .7), age: 0, col: 'rgba(200,160,110,', r: rand(3, 7), dust: true }); } }
  function poof(x, y) { Sound.poof(); for (let i = 0; i < 14; i++) { const a = rand(0, TAU), v = rand(40, 140); parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 0, life: rand(.4, .7), age: 0, col: 'rgba(255,255,255,', r: rand(4, 9), dust: true }); } }
  function confetti() {
    const cols = CKEYS.map(k => COLS[k].h).concat(['#FFFFFF']);
    parts.push({ x: rand(0, Wd), y: rand(-Hd * .5, -10), vx: rand(-60, 60), vy: rand(80, 220), g: 120, life: rand(2.2, 3.4), age: 0, col: cols[Math.floor(Math.random() * cols.length)], r: rand(4, 8), rot: rand(0, TAU), vr: rand(-8, 8), conf: true });
  }

  /* ---------- الإدخال ---------- */
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  function hitB(b, x, y) {
    const [w, h] = fpOf(b.t, b.r), s = b.st === 'tray' || b.st === 'pal' ? ts : 1, u = U * s;
    const W = w * u, H = h * u, x0 = b.px - W / 2, y0 = b.py - H / 2;
    return x > x0 - 8 && x < x0 + W + u * DXK + 8 && y > y0 + u * DYK - 8 && y < y0 + H + 8;
  }
  cv.addEventListener('pointerdown', e => {
    if (paused || drag || (phase !== 'play')) return;
    const p = pos(e);
    const cands = blocks.filter(b => (b.st === 'tray' || b.st === 'pal' || b.st === 'mat') && hitB(b, p.x, p.y));
    if (!cands.length) return;
    // الأقرب إلى المقدّمة
    const b = cands.sort((a, c) => (c.st === 'mat' ? c.z + c.x * .01 : -1) - (a.st === 'mat' ? a.z + a.x * .01 : -1))[0];
    drag = { b, sx: p.x, sy: p.y, ox: b.px - p.x, oy: b.py - p.y, moved: false, id: e.pointerId, from: b.st, lx: p.x };
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    lastAct = T;
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const p = pos(e);
    if (!drag.moved && Math.hypot(p.x - drag.sx, p.y - drag.sy) > 9) {
      let b = drag.b;
      if (b.st === 'mat') { const above = topFree(b); if (above) { wobble(b); say('تحت ' + TYPES[above.t].def, 'under the ' + TYPES[above.t].en); drag = null; return; } }
      if (b.st === 'pal') { const nb = mkB(b.t, b.r, b.c); nb.free = true; nb.px = b.px; nb.py = b.py; nb.sc = ts; blocks.push(nb); drag.b = b = nb; b.sqT = T; }
      drag.moved = true; b.st = 'drag'; b.anim = null; Sound.tap(); vibrate(8); sayBlock(b);
    }
    if (drag.moved) { const b = drag.b; b.px = p.x; b.py = p.y - U * .5; b.rot = clamp(b.rot * .7 + (p.x - drag.lx) * .004, -.25, .25); drag.lx = p.x; }
  });
  function endDrag(e, cancel) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const d = drag, b = d.b; drag = null;
    try { cv.releasePointerCapture(d.id); } catch (er) {}
    if (!d.moved) { if (!cancel) rotate(b); return; }
    if (cancel) { toTray(b); return; }
    b.rot = 0;
    if (overMat(b.px, b.py)) {
      const L = landing(b, dropCol(b, b.px));
      if (L.ok) { dropOnMat(b, L); return; }
      wobble(b);
      if (L.cap) say('ليس هنا', 'Not there');
    }
    toTray(b, true);
  }
  cv.addEventListener('pointerup', e => endDrag(e));
  cv.addEventListener('pointercancel', e => endDrag(e, true));
  window.addEventListener('keydown', e => {
    if (App.current !== ID || paused || $('#sheetWrap').classList.contains('on')) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); promptSpeak(); }
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    if (evs.length) { const due = evs.filter(e => e.t <= T); if (due.length) { evs = evs.filter(e => e.t > T); due.sort((a, b) => a.t - b.t).forEach(e => e.fn()); } }
    for (const b of blocks) {
      const tsc = b.st === 'tray' || b.st === 'pal' || (b.st === 'fly' && b.anim && b.anim.tx === b.hx && b.anim.ty === b.hy) ? ts : 1;
      if (b.anim) {
        const a = b.anim;
        if (T >= a.t0) {
          const p = clamp((T - a.t0) / a.dur, 0, 1), k = easeIO(p);
          b.px = a.fx + (a.tx - a.fx) * k; b.py = a.fy + (a.ty - a.fy) * k - Math.sin(p * Math.PI) * a.arc;
          if (p >= 1) { b.anim = null; if (a.done) a.done(); }
        }
      } else if (b.st === 'tray' || b.st === 'pal') {
        const k = Math.min(1, dt * 12); b.px += (b.hx - b.px) * k; b.py += (b.hy - b.py) * k;
      } else if (b.st === 'fall') {
        b.px += (b.tx - b.px) * Math.min(1, dt * 20);
        b.vy += 2600 * dt; b.py += b.vy * dt;
        if (b.py >= b.ty) landedB(b);
      }
      b.sc += (tsc - b.sc) * Math.min(1, dt * 12);
      if (b.st !== 'drag') b.rot *= Math.exp(-dt * 10);
    }
    blocks = blocks.filter(b => b.st !== 'gone');
    shake = Math.max(0, shake - dt * 2.5);
    if (phase === 'play' && !drag && T - lastAct > 12 && !free) { lastAct = T; promptSpeak(); }
    for (const p of parts) { p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt; if (p.conf) { p.rot += p.vr * dt; p.vx += Math.sin(T * 3 + p.r) * 20 * dt; } else { p.vx *= .94; p.vy *= .94; } }
    parts = parts.filter(p => p.age < p.life && p.y < Hd + 40);
  }

  /* ---------- الرسم ---------- */
  let bgC = null;
  function drawBg(c) {
    const key = Wd + 'x' + Hd + ':' + U + ':' + gx0 + ':' + gy0;
    if (!bgC || bgC.key !== key) {
      const k = Math.min(2, window.devicePixelRatio || 1), cb = document.createElement('canvas');
      cb.width = Math.round(Wd * k); cb.height = Math.round(Hd * k);
      const b = cb.getContext('2d'); b.scale(k, k);
      const fy = gy0 + U * DYK * .5;
      let g = b.createLinearGradient(0, 0, 0, Hd);
      g.addColorStop(0, '#FFF3DC'); g.addColorStop(fy / Hd * .98, '#FFE4BD'); g.addColorStop(Math.min(1, fy / Hd + .001), '#E8B57C'); g.addColorStop(1, '#D9A066');
      b.fillStyle = g; b.fillRect(0, 0, Wd, Hd);
      // ورق جدران: مكعبات صغيرة باهتة
      b.globalAlpha = .1;
      const cs = CKEYS.map(q => COLS[q].h);
      for (let y = 40, i = 0; y < fy - 30; y += 56) for (let x = ((y / 56) % 2) * 28; x < Wd; x += 56, i++) { b.fillStyle = cs[i % cs.length]; b.beginPath(); b.roundRect(x, y, 14, 14, 3); b.fill(); }
      b.globalAlpha = 1;
      // ألواح الأرضية
      b.strokeStyle = 'rgba(140,80,30,.15)'; b.lineWidth = 2;
      for (let y = fy + 30; y < Hd; y += 34) { b.beginPath(); b.moveTo(0, y); b.lineTo(Wd, y); b.stroke(); }
      // البساط: سطح علوي بخطوط الأعمدة
      const dx = U * DXK, dy = U * DYK, x0 = gx0 - U * .3, x1 = gx0 + NC * U + U * .3;
      b.save(); b.shadowColor = 'rgba(90,40,0,.3)'; b.shadowBlur = 18; b.shadowOffsetY = 8;
      poly(b, [[x0, gy0 + U * .14], [x0 + dx, gy0 + dy], [x1 + dx, gy0 + dy], [x1 + dx, gy0 + dy + U * .14], [x1, gy0 + U * .14]]); b.fillStyle = '#2E9E8F'; b.fill(); b.restore();
      poly(b, [[x0, gy0], [x0 + dx, gy0 + dy], [x1 + dx, gy0 + dy], [x1, gy0]]);
      g = b.createLinearGradient(0, gy0 + dy, 0, gy0); g.addColorStop(0, '#6FD6C3'); g.addColorStop(1, '#46C0AC'); b.fillStyle = g; b.fill();
      poly(b, [[x0, gy0], [x1, gy0], [x1, gy0 + U * .14], [x0, gy0 + U * .14]]); b.fillStyle = '#2E9E8F'; b.fill();
      b.strokeStyle = 'rgba(255,255,255,.35)'; b.lineWidth = 1.5;
      for (let i = 0; i <= NC; i++) { const x = gx0 + i * U; b.beginPath(); b.moveTo(x, gy0); b.lineTo(x + dx, gy0 + dy); b.stroke(); }
      b.setLineDash([4, 6]); b.strokeStyle = 'rgba(255,255,255,.8)'; b.beginPath(); b.moveTo(x0 + 6, gy0 - 3); b.lineTo(x1 - 6, gy0 - 3); b.stroke(); b.setLineDash([]);
      // خطوط إرشاد خفيفة للأعمدة على الجدار
      b.strokeStyle = 'rgba(200,130,60,.12)'; b.lineWidth = 1;
      for (let i = 0; i <= NC; i++) { const x = gx0 + i * U + dx; b.beginPath(); b.moveTo(x, gy0 + dy); b.lineTo(x, gy0 + dy - NR * U); b.stroke(); }
      for (let j = 1; j <= NR; j++) { const y = gy0 + dy - j * U; b.beginPath(); b.moveTo(gx0 + dx, y); b.lineTo(gx0 + NC * U + dx, y); b.stroke(); }
      bgC = { cv: cb, key };
    }
    c.drawImage(bgC.cv, 0, 0, Wd, Hd);
  }
  function drawCard(c) {
    if (free || card.h <= 0) return;
    const { x, y, w, h } = card;
    c.save(); c.shadowColor = 'rgba(120,60,10,.25)'; c.shadowBlur = 14; c.shadowOffsetY = 6;
    c.fillStyle = '#F7A65A'; c.beginPath(); c.roundRect(x, y + 6, w, h, 26); c.fill(); c.restore();
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(x, y, w, h, 26); c.fill();
    c.strokeStyle = '#FFC98F'; c.lineWidth = 4; c.beginPath(); c.roundRect(x + 5, y + 5, w - 10, h - 10, 21); c.stroke();
    // لوح الصورة
    const lw = portrait ? Math.min(w * .55, 230) : w - 24, lh = portrait ? h - 20 : h - 64;
    const lx = portrait ? x + w - lw - 12 : x + 12, ly = y + 10;
    const g = c.createLinearGradient(0, ly, 0, ly + lh); g.addColorStop(0, '#E6F5FF'); g.addColorStop(1, '#CDEBFF');
    c.fillStyle = g; c.beginPath(); c.roundRect(lx, ly, lw, lh, 16); c.fill();
    const list = M.b.map(q => ({ t: q[0], x: q[1], z: q[2], r: q[3], c: q[4], id: 7 }));
    const bob = Math.sin(T * 2) * 1.5;
    drawStructure(c, list, lx + 8, ly + 8 + bob, lw - 16, lh - 18, U * .7);
    // الاسم
    const en = lang === 'en';
    c.save(); c.fillStyle = '#6B3410'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = en ? 'ltr' : 'rtl';
    const name = (en ? M.en : M.ar);
    if (portrait) {
      const tx = x + (w - lw - 12) / 2 + 4;
      c.font = `900 ${Math.min(30, (w - lw) * .2)}px ${FONT}`; c.fillText(M.ic, tx, y + h * .3);
      let fs = 20; c.font = `900 ${fs}px ${FONT}`; while (c.measureText(name).width > w - lw - 30 && fs > 11) { fs--; c.font = `900 ${fs}px ${FONT}`; }
      c.fillText(name, tx, y + h * .58);
      c.font = `800 13px ${FONT}`; c.fillStyle = '#B5743A'; c.fillText(en ? 'Build it! 👉' : App.g('ابني مثلها 👈', 'ابنِ مثلها 👈'), tx, y + h * .8);
    } else {
      let fs = 22; c.font = `900 ${fs}px ${FONT}`; while (c.measureText(M.ic + ' ' + name).width > w - 24 && fs > 12) { fs--; c.font = `900 ${fs}px ${FONT}`; }
      c.fillText(M.ic + ' ' + name, x + w / 2, y + h - 34);
      c.font = `800 13px ${FONT}`; c.fillStyle = '#B5743A'; c.fillText(en ? 'Build it like the picture' : App.g('ابني مثل الصورة', 'ابنِ مثل الصورة'), x + w / 2, y + h - 14);
    }
    c.restore();
  }
  function drawTray(c) {
    const t = tray;
    c.save(); c.shadowColor = 'rgba(120,60,10,.22)'; c.shadowBlur = 14; c.shadowOffsetY = 6;
    c.fillStyle = '#F2A35C'; c.beginPath(); c.roundRect(t.x, t.y + 6, t.w, t.h, 28); c.fill(); c.restore();
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(t.x, t.y, t.w, t.h, 28); c.fill();
    const g = c.createLinearGradient(0, t.y, 0, t.y + t.h); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#FFF1DE');
    c.fillStyle = g; c.beginPath(); c.roundRect(t.x + 6, t.y + 6, t.w - 12, t.h - 12, 22); c.fill();
    c.strokeStyle = '#FFD7AE'; c.lineWidth = 3; c.stroke();
  }
  function blockAt(c, b, alpha) {
    const s = b.sc, u = U * s;
    let sx = 1, sy = 1;
    const a = T - b.sqT; if (a >= 0 && a < .8) { const e = Math.exp(-7 * a) * Math.cos(a * 24); sx = 1 + .12 * e; sy = 1 - .16 * e; }
    let wob = 0; const wa = T - b.wobT; if (wa >= 0 && wa < .8) wob = Math.sin(wa * 34) * .12 * Math.exp(-wa * 4);
    const [, h] = fpOf(b.t, b.r), by = b.py + h * u / 2;
    c.save(); c.translate(b.px, by); c.rotate(b.rot + wob); c.scale(sx, sy); c.translate(-b.px, -by);
    if (alpha != null) c.globalAlpha = alpha;
    drawBlock(c, b, b.px, b.py, u);
    if (badIds.has(b.id) && phase === 'play') {
      const [w] = fpOf(b.t, b.r);
      c.strokeStyle = `rgba(242,72,75,${.6 + .3 * Math.sin(T * 8)})`; c.lineWidth = 3; c.setLineDash([6, 4]);
      c.strokeRect(b.px - w * u / 2 - 3, b.py - h * u / 2 - 3, w * u + 6, h * u + 6); c.setLineDash([]);
    }
    c.restore();
  }
  function render() {
    const c = ctx; if (!c) return;
    c.save();
    drawBg(c);
    if (shake > 0) c.translate(0, Math.sin(T * 50) * shake * 2.5);
    // ظلال القطع على البساط
    for (const b of blocks) if ((b.st === 'mat' || b.st === 'fall') && b.z === 0) { const [w] = fpOf(b.t, b.r); c.fillStyle = 'rgba(20,60,50,.22)'; c.beginPath(); c.ellipse(b.tx || b.px, gy0 + U * DYK * .45, w * U * .55, U * .14, 0, 0, TAU); c.fill(); }
    // الشبح (تلميح / خطأ)
    const ga = T - ghostT;
    if (!free && ga < 3) {
      const al = (ga < .3 ? ga / .3 : ga > 2.4 ? (3 - ga) / .6 : 1) * (.35 + .1 * Math.sin(T * 6));
      const mxM = Math.min(...M.b.map(q => q[1])), off = clamp(ghostX, 0, NC - modelW()) - mxM;
      for (const q of sortDraw(M.b.map(q => ({ t: q[0], x: q[1] + off, z: q[2], r: q[3], c: q[4], id: 9 })))) {
        const [x, y] = cellCenter(q); drawBlock(c, q, x, y, U, { ghost: al });
      }
    }
    // معاينة مكان الهبوط أثناء السحب
    if (drag && drag.moved && overMat(drag.b.px, drag.b.py)) {
      const b = drag.b, L = landing(b, dropCol(b, b.px)), [w, h] = fpOf(b.t, b.r);
      const x = gx0 + L.x * U, y = gy0 - (L.z + h) * U;
      c.save(); c.setLineDash([7, 5]); c.lineWidth = 3;
      c.strokeStyle = L.ok ? 'rgba(255,255,255,.95)' : 'rgba(242,72,75,.9)'; c.fillStyle = L.ok ? 'rgba(255,255,255,.3)' : 'rgba(242,72,75,.15)';
      c.beginPath(); c.roundRect(x, y, w * U, h * U, 6); c.fill(); c.stroke();
      c.setLineDash([]); c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 2;
      c.beginPath(); c.moveTo(x + w * U / 2, y + h * U); c.lineTo(x + w * U / 2, gy0); c.stroke();
      c.restore();
    }
    const mat = sortDraw(blocks.filter(b => b.st === 'mat' || b.st === 'fall'));
    for (const b of mat) blockAt(c, b);
    c.restore();
    drawCard(c);
    drawTray(c);
    for (const b of blocks) if (b.st === 'tray' || b.st === 'pal') blockAt(c, b);
    for (const b of blocks) if (b.st === 'fly') blockAt(c, b);
    if (drag && drag.moved) {
      const b = drag.b, [w, h] = fpOf(b.t, b.r);
      c.fillStyle = 'rgba(60,30,0,.18)'; c.beginPath(); c.ellipse(b.px, b.py + h * U / 2 + 40, w * U * .5, U * .14, 0, 0, TAU); c.fill();
      blockAt(c, b);
      // اسم القطعة
      const txt = nameOf(b), en = lang === 'en';
      c.save(); c.font = `900 17px ${FONT}`; c.direction = en ? 'ltr' : 'rtl'; c.textAlign = 'center'; c.textBaseline = 'middle';
      const tw = c.measureText(txt).width + 24, ty = b.py - h * U / 2 + U * DYK - 24;
      c.fillStyle = '#fff'; c.strokeStyle = COLS[b.c].h; c.lineWidth = 3.5; c.beginPath(); c.roundRect(b.px - tw / 2, ty - 15, tw, 30, 15); c.fill(); c.stroke();
      c.fillStyle = '#6B3410'; c.fillText(txt, b.px, ty + 1); c.restore();
    }
    // أسهم الدوران فوق القطع القابلة للدوران في الصينية
    for (const b of blocks) if ((b.st === 'tray' || b.st === 'pal') && nRot(b.t) > 1) {
      const [w, h] = fpOf(b.t, b.r), u = U * b.sc;
      const x = b.px + w * u / 2 + u * DXK * .6, y = b.py - h * u / 2 + u * DYK;
      c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, 11, 0, TAU); c.fill(); c.strokeStyle = '#F07A1E'; c.lineWidth = 2; c.stroke();
      c.font = `900 13px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#F07A1E'; c.fillText('↻', x, y + 1);
    }
    for (const p of parts) {
      const a = 1 - p.age / p.life;
      if (p.conf) { c.globalAlpha = Math.min(1, a * 2); c.fillStyle = p.col; c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); c.restore(); }
      else { c.globalAlpha = 1; c.fillStyle = p.col + (a * .7) + ')'; c.beginPath(); c.arc(p.x, p.y, p.r * (1.6 - a * .6), 0, TAU); c.fill(); }
    }
    c.globalAlpha = 1;
  }
  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = clamp((now - last) / 1000 || 0, 0, .05); last = now;
    if (paused || document.hidden) return;
    update(dt); render();
  }
  function startLoop() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stopLoop() { running = false; cancelAnimationFrame(raf); }
  let resizeT = 0;
  window.addEventListener('resize', () => { if (App.current !== ID) return; clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); render(); }, 60); });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    const g = c.createRadialGradient(s * .5, s * .3, s * .05, s * .5, s * .5, s * .8);
    g.addColorStop(0, '#FFE7C2'); g.addColorStop(1, '#F59A45');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.fillStyle = '#46C0AC'; c.beginPath(); c.ellipse(s * .5, s * .86, s * .48, s * .1, 0, 0, TAU); c.fill();
    drawStructure(c, [{ t: 'cube', x: 0, z: 0, r: 0, c: 'Y', id: 1 }, { t: 'arch', x: 1, z: 0, r: 0, c: 'B', id: 2 }, { t: 'cube', x: 3, z: 0, r: 0, c: 'G', id: 3 }, { t: 'brick', x: 0, z: 1, r: 0, c: 'R', id: 4 }, { t: 'brick', x: 2, z: 1, r: 0, c: 'P', id: 5 }, { t: 'roof', x: 1, z: 2, r: 0, c: 'O', id: 6 }], s * .1, s * .1, s * .8, s * .74, 99);
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'المكعبات الخشبية', titleEn: 'Wooden Blocks', icon2: '🧱', isNew: true, music: 'blocks',
    desc: () => App.g('ابني مثل الصورة بالمكعبات الملوّنة', 'ابنِ مثل الصورة بالمكعبات الملوّنة'),
    descEn: () => 'Build what you see in the picture with colorful blocks',
    helpEn: () => [
      '🖼️ Look at the picture, then build the same thing on the mat',
      '👆 Drag a block onto the mat and it drops and settles; tap it to turn it ↻',
      '✔ The check button compares your building with the picture, and 💡 shows a ghost of it on the mat',
      '🎨 In «Free build» pick a color and build anything you like, then 💾 saves it to the gallery',
      '🔊 The yellow button repeats the instructions, and «عربي / English» switches the language'
    ],
    help: () => [
      '🖼️ ' + App.g('انظري', 'انظر') + ' إلى الصورة ثم ' + App.g('ابني', 'ابنِ') + ' مثلها على البساط',
      '👆 ' + App.g('اسحبي', 'اسحب') + ' القطعة إلى البساط فتسقط وتستقر، و' + App.g('المسيها', 'المسها') + ' لتدور ↻',
      '✔ زر التحقق يقارن بناءك بالصورة، و💡 يُظهر شبح الصورة على البساط',
      '🎨 في «البناء الحر» ' + App.g('اختاري', 'اختر') + ' اللون و' + App.g('ابني', 'ابنِ') + ' ما ' + App.g('تحبين', 'تحب') + '، ثم 💾 للحفظ في المعرض',
      '🔊 الزر الأصفر يعيد التعليمات، و«عربي / English» يبدّل اللغة'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🧱 ${ks.length}/${NL} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      lang = App.gameLang(ID); paintLang(); chrome();
      const pr = loadProg();
      let n = 1; for (let i = 1; i <= pr.unlocked; i++) { n = i; if (!pr.stars[i]) break; }
      startLevel(n);
      render(); startLoop();
    },
    onLang(l) { const chg = l !== lang; lang = l; langChanged(); if (chg && phase === 'play') promptSpeak(); },
    leave() { stopLoop(); drag = null; evs = []; winOv.classList.remove('on'); lvOv.classList.remove('on'); galOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { if (drag.moved) toTray(drag.b); else if (drag.b.st === 'drag') toTray(drag.b); drag = null; } },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (galOv.classList.contains('on')) { act('gclose'); return true; }
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    },
    /* للاختبار الآلي */
    _state() { return { lvl, free, phase, mistakes, U, gx0, gy0, tray, model: M.k, blocks: blocks.map(b => ({ id: b.id, t: b.t, r: b.r, c: b.c, x: b.x, z: b.z, st: b.st, px: b.px, py: b.py })) }; },
    _start: (n, f) => startLevel(n, f),
    _modelOf: n => MODELS[n - 1].b
  });
})();
