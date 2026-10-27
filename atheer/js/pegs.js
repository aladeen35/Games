/* =====================================================================
   لوح الأوتاد — نسخة رقمية من لعبة مونتيسوري الخشبية:
   لوح من الخشب الرقائقي عليه مجموعات من الأوتاد (١، ٢، ٣…)،
   وأشكال ملوّنة مثقوبة تُركَّب على المجموعة التي عدد أوتادها يساوي عدد ثقوبها.
   رسم «لعبة ثلاثية الأبعاد» بمنظور مائل من الأعلى (Canvas 2D) + تحريك GSAP
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'pegs';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';
  const AD = '٠١٢٣٤٥٦٧٨٩';
  const AR_W = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
  const EN_W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  /* المنظور: ضغط الأرض عموديًا، وإزاحة الارتفاع على الشاشة */
  const GK = .8, HK = .62;
  /* أبعاد بوحدة U: سماكة الشكل، طول الوتد، نصف قطر الوتد والثقب، ارتفاع الرفع */
  const TH = .15, PH = .62, PR = .072, HR = .098, LIFT = 1.0;

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
  const WHITE = [255, 255, 255];

  /* ---------- اللغة ---------- */
  let lang = 'ar';
  const dg = n => lang === 'ar' ? String(n).replace(/\d/g, d => AD[d]) : String(n);
  const say = (ar, en) => App.speak(lang === 'ar' ? ar : en, lang === 'ar' ? 'ar' : 'en');

  /* ---------- الألوان والأشكال ---------- */
  const COLS = {
    red:    { h: '#E8382F', m: 'أحمر', f: 'حمراء', en: 'red' },
    yellow: { h: '#FFCC17', m: 'أصفر', f: 'صفراء', en: 'yellow' },
    blue:   { h: '#2152E3', m: 'أزرق', f: 'زرقاء', en: 'blue' },
    green:  { h: '#27B24A', m: 'أخضر', f: 'خضراء', en: 'green' },
    orange: { h: '#FF8519', m: 'برتقالي', f: 'برتقالية', en: 'orange' },
    purple: { h: '#8A4CD9', m: 'بنفسجي', f: 'بنفسجية', en: 'purple' },
    pink:   { h: '#FF5AA5', m: 'وردي', f: 'وردية', en: 'pink' }
  };
  const COL_KEYS = Object.keys(COLS);
  const KINDS = {
    circle: { ar: 'دائرة', fem: 1, en: 'circle' }, disc: { ar: 'دائرة', fem: 1, en: 'circle' },
    bar: { ar: 'مستطيل', en: 'rectangle' }, tri: { ar: 'مثلث', en: 'triangle' }, sq: { ar: 'مربع', en: 'square' },
    pent: { ar: 'خماسي', en: 'pentagon' }, hex: { ar: 'سداسي', en: 'hexagon' }
  };
  const STD_KIND = [null, 'circle', 'bar', 'tri', 'sq', 'pent', 'hex'];
  const STD_COL = [null, 'red', 'green', 'yellow', 'blue', 'orange', 'purple'];
  const nameAr = s => KINDS[s.kind].ar + ' ' + (KINDS[s.kind].fem ? COLS[s.col].f : COLS[s.col].m);
  const nameEn = s => COLS[s.col].en + ' ' + KINDS[s.kind].en;

  function regPts(n, R, a0) { const p = []; for (let i = 0; i < n; i++) { const a = a0 + i * TAU / n; p.push([Math.cos(a) * R, Math.sin(a) * R]); } return p; }
  /* تدوير زوايا المضلّع بمنحنيات تربيعية */
  function rounded(pts, rc, seg) {
    const out = [], n = pts.length;
    for (let i = 0; i < n; i++) {
      const p = pts[i], a = pts[(i + n - 1) % n], b = pts[(i + 1) % n];
      const da = Math.hypot(a[0] - p[0], a[1] - p[1]), db = Math.hypot(b[0] - p[0], b[1] - p[1]);
      const k = Math.min(rc, da * .45, db * .45);
      const s = [p[0] + (a[0] - p[0]) / da * k, p[1] + (a[1] - p[1]) / da * k], e = [p[0] + (b[0] - p[0]) / db * k, p[1] + (b[1] - p[1]) / db * k];
      for (let j = 0; j <= seg; j++) { const t = j / seg, u = 1 - t; out.push([u * u * s[0] + 2 * u * t * p[0] + t * t * e[0], u * u * s[1] + 2 * u * t * p[1] + t * t * e[1]]); }
    }
    return out;
  }
  const GEO = {};
  function geo(kind) {
    if (GEO[kind]) return GEO[kind];
    let pts;
    if (kind === 'circle') pts = regPts(36, .3, 0);
    else if (kind === 'disc') pts = regPts(44, .5, 0);
    else if (kind === 'bar') pts = rounded([[-.42, -.2], [.42, -.2], [.42, .2], [-.42, .2]], .18, 8);
    else if (kind === 'tri') pts = rounded(regPts(3, .57, -Math.PI / 2), .1, 8);
    else if (kind === 'sq') pts = rounded([[-.37, -.37], [.37, -.37], [.37, .37], [-.37, .37]], .1, 6);
    else if (kind === 'pent') pts = rounded(regPts(5, .5, -Math.PI / 2), .08, 6);
    else pts = rounded(regPts(6, .5, -Math.PI / 2), .07, 6);
    const nrm = pts.map((p, i) => {
      const q = pts[(i + 1) % pts.length];
      let nx = q[1] - p[1], nz = -(q[0] - p[0]); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
      if (nx * (p[0] + q[0]) + nz * (p[1] + q[1]) < 0) { nx = -nx; nz = -nz; }
      return [nx, nz];
    });
    return (GEO[kind] = { pts, nrm });
  }
  /* مواضع الثقوب/الأوتاد (بترتيب العدّ: من الأعلى مع عقارب الساعة) */
  const HL = [null, [[0, 0]], [[-.2, 0], [.2, 0]], regPts(3, .23, -Math.PI / 2),
    [[-.17, -.17], [.17, -.17], [.17, .17], [-.17, .17]], regPts(5, .26, -Math.PI / 2), regPts(6, .28, -Math.PI / 2)];

  /* =====================================================================
     تحريك: GSAP إن وُجد، وإلا محرّك صغير بديل بنفس الواجهة
     ===================================================================== */
  const HAS = () => !!window.gsap;
  const live = new Set();
  const FB = { tws: [] };
  const EASES = {};
  function easeFn(e) {
    if (typeof e === 'function') return e;
    e = e || 'power1.out';
    if (EASES[e]) return EASES[e];
    const m = /^([a-z]+?)(\d?)(?:\.(inOut|in|out))?(?:\(.*\))?$/.exec(e) || [];
    const base = m[1] || 'power', p = +(m[2] || 1), type = m[3] || 'out';
    let f;
    if (base === 'none' || base === 'linear') return (EASES[e] = t => t);
    if (base === 'bounce') { const bo = t => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; }; f = t => 1 - bo(1 - t); }
    else if (base === 'elastic') f = t => t === 0 || t === 1 ? t : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * TAU / 3);
    else if (base === 'back') f = t => t * t * (2.7 * t - 1.7);
    else if (base === 'sine') f = t => 1 - Math.cos(t * Math.PI / 2);
    else f = t => Math.pow(t, p + 1);
    const r = type === 'in' ? f : type === 'out' ? t => 1 - f(1 - t) : t => t < .5 ? f(2 * t) / 2 : 1 - f(2 - 2 * t) / 2;
    return (EASES[e] = r);
  }
  const RES = { duration: 1, delay: 1, ease: 1, onStart: 1, onUpdate: 1, onComplete: 1, overwrite: 1, stagger: 1, repeat: 1, yoyo: 1 };
  function fbTween(targets, vars, delay0) {
    const tw = { tg: [].concat(targets), props: {}, dur: vars.duration == null ? .5 : vars.duration, delay: (vars.delay || 0) + (delay0 || 0), ease: easeFn(vars.ease), t: 0, started: false, vars, done: false,
      kill() { this.done = true; }, pause() {}, resume() {} };
    for (const k in vars) if (!RES[k]) tw.props[k] = vars[k];
    FB.tws.push(tw); return tw;
  }
  function fbStep(dt) {
    const list = FB.tws.slice();
    for (const tw of list) {
      if (tw.done) continue;
      tw.t += dt; const lt = tw.t - tw.delay; if (lt < 0) continue;
      if (!tw.started) { tw.started = true; tw.from = tw.tg.map(o => { const f = {}; for (const k in tw.props) f[k] = o[k]; return f; }); if (tw.vars.onStart) tw.vars.onStart(); }
      const p = tw.dur > 0 ? Math.min(1, lt / tw.dur) : 1, e = tw.ease(p);
      tw.tg.forEach((o, i) => { for (const k in tw.props) o[k] = tw.from[i][k] + (tw.props[k] - tw.from[i][k]) * e; });
      if (tw.vars.onUpdate) tw.vars.onUpdate();
      if (p >= 1) { tw.done = true; if (tw.vars.onComplete) tw.vars.onComplete(); }
    }
    FB.tws = FB.tws.filter(t => !t.done);
  }
  function fbTL() {
    let end = 0, lastStart = 0; const kids = [];
    const at = (pos, dur) => {
      let st;
      if (pos == null) st = end; else if (typeof pos === 'number') st = pos; else if (pos === '<') st = lastStart;
      else if (/^\+=/.test(pos)) st = end + parseFloat(pos.slice(2)); else if (/^-=/.test(pos)) st = end - parseFloat(pos.slice(2)); else st = end;
      lastStart = st; end = Math.max(end, st + dur); return st;
    };
    const tl = {
      to(t, v, pos) { const d = v.duration == null ? .5 : v.duration; kids.push(fbTween(t, v, at(pos, d + (v.delay || 0)))); return tl; },
      call(fn, args, pos) { kids.push(fbTween({}, { duration: 0, onComplete: () => fn.apply(null, args || []) }, at(pos, 0))); return tl; },
      kill() { kids.forEach(k => k.kill()); }, pause() {}, resume() {}
    };
    return tl;
  }
  function track(t, v) {
    live.add(t);
    const oc = v && v.onComplete;
    if (v) v.onComplete = function () { live.delete(t); if (oc) oc.apply(this, arguments); };
    return t;
  }
  const A = {
    to(t, v) {
      if (HAS()) { const vv = Object.assign({}, v); const tw = gsap.to(t, vv); live.add(tw); const oc = v.onComplete; tw.eventCallback('onComplete', function () { live.delete(tw); if (oc) oc.apply(this, arguments); }); return tw; }
      return fbTween(t, v, 0);
    },
    tl() {
      if (HAS()) { const t = gsap.timeline(); live.add(t); t.eventCallback('onComplete', () => live.delete(t)); return t; }
      return fbTL();
    },
    kill(o) { if (HAS()) gsap.killTweensOf(o); FB.tws.forEach(t => { if (t.tg.includes(o)) t.done = true; }); },
    killAll() { live.forEach(t => { try { t.kill(); } catch (e) {} }); live.clear(); FB.tws = []; },
    pause() { live.forEach(t => { try { t.pause(); } catch (e) {} }); },
    resume() { live.forEach(t => { try { t.resume(); } catch (e) {} }); }
  };
  void track;

  /* =====================================================================
     المستويات
     ===================================================================== */
  const LV = [
    { key: 'match', ic: '🔺', t: 'مطابقة الثقوب', te: 'Match the holes', sub: () => dg(1) + ' – ' + dg(4), rounds: 2 },
    { key: 'match6', ic: '⬢', t: 'حتى الستة', te: 'Up to six', sub: () => dg(1) + ' – ' + dg(6), rounds: 2 },
    { key: 'stack', ic: '🗼', t: 'برج الأشكال', te: 'Shape tower', sub: () => App.t('تكديس', 'Stacking'), rounds: 2 },
    { key: 'count', ic: '👂', t: 'العدّ بالسمع', te: 'Count by ear', sub: () => (lang === 'ar' ? 'ضع ' : 'Put ') + dg(3), rounds: 2 },
    { key: 'numer', ic: '🔢', t: 'الأرقام', te: 'Numbers', sub: () => dg(3) + ' = •••', rounds: 2 },
    { key: 'color', ic: '🎨', t: 'الألوان والأشكال', te: 'Colors & shapes', sub: () => lang === 'ar' ? 'مثلث أصفر' : 'yellow triangle', rounds: 2 },
    { key: 'add', ic: '➕', t: 'الجمع', te: 'Adding', sub: () => dg(2) + ' + ' + dg(1), rounds: 4 }
  ];
  const NL = LV.length;
  const loadProg = () => { const p = store.get('pegsProg', null) || {}; return { unlocked: clamp(p.unlocked || 1, 1, NL), stars: p.stars || {} }; };

  function mkGroup(n, o = {}) {
    const pegs = HL[n].map((h, i) => ({ x: h[0], z: h[1], i, tone: rand(.93, 1.06), glow: 0, nb: 0 }));
    return { n, pegs, sorted: pegs.slice().sort((a, b) => a.z - b.z), pegH: o.hidden ? 0 : PH, hidden: !!o.hidden, badge: o.badge || '', badgeA: o.hidden ? 1 : 0,
      tagA: o.tag ? 1 : 0, shapes: [], cap: o.cap || 1, fixed: !!o.fixed, hl: 0, hint: 0, wob: 0, gx: 0, gy: 0, tx: 0, ty: 0 };
  }
  function mkShape(n, kind, col, o = {}) {
    return { n, kind: kind || STD_KIND[n], col: col || STD_COL[n], plug: !!o.plug, numeral: !!o.plug, gx: 0, gy: 0, y: 0, rot: 0, tilt: 0, sc: 1, sq: 0, alpha: 1,
      st: 'tray', hx: 0, hy: 0, hrot: rand(-.22, .22), hsc: 1, slot: 0, grp: null, jx: rand(-1, 1), jy: rand(-1, 1) };
  }
  const randCols = (k, avoid = []) => shuffle(COL_KEYS.filter(c => !avoid.includes(c))).slice(0, k);
  function pickCounts(k, lo, hi, must) {
    for (let g = 0; g < 50; g++) {
      const s = shuffle(Array.from({ length: hi - lo + 1 }, (_, i) => i + lo)).slice(0, k).sort((a, b) => a - b);
      if (!must || s.some(v => must.includes(v))) return s;
    }
    return [1, 2, 3, 4];
  }
  /* بناء جولة: مجموعات اللوح + أشكال الصينية + (أسئلة اختيارية) */
  function makeRound(key, r) {
    const R = { items: [], shapes: [], prompts: null, pi: 0, need: 0 };
    const addG = g => { R.items.push({ g }); return g; };
    if (key === 'match' || key === 'match6') {
      const counts = key === 'match' ? [1, 2, 3, 4] : pickCounts(4, 1, 6, [5, 6]);
      const order = r === 0 ? counts : shuffle(counts.slice());
      order.forEach(n => addG(mkGroup(n)));
      const cols = r === 0 ? null : randCols(4);
      R.shapes = counts.map((n, i) => mkShape(n, null, cols ? cols[i] : null));
    } else if (key === 'stack') {
      const counts = r === 0 ? pickCounts(3, 1, 4) : pickCounts(2, 2, 5);
      const per = r === 0 ? 2 : 3;
      counts.forEach(n => {
        addG(mkGroup(n, { cap: 3 }));
        const cols = [STD_COL[n]].concat(randCols(per - 1, [STD_COL[n]]));
        cols.forEach(c => R.shapes.push(mkShape(n, null, c)));
      });
    } else if (key === 'count') {
      const counts = pickCounts(4, 1, 6);
      counts.forEach(n => addG(mkGroup(n)));
      const cols = randCols(4);
      R.shapes = counts.map((n, i) => mkShape(n, 'disc', cols[i]));
      R.prompts = shuffle(counts.slice());
    } else if (key === 'numer') {
      const counts = shuffle(pickCounts(4, 1, 6));
      if (r === 0) {
        counts.forEach(n => addG(mkGroup(n, { hidden: true, badge: String(n) })));
        R.shapes = counts.map(n => mkShape(n));
      } else {
        counts.forEach(n => addG(mkGroup(n)));
        const cols = randCols(4);
        R.shapes = counts.map((n, i) => mkShape(n, 'disc', cols[i], { plug: true }));
      }
    } else if (key === 'color') {
      const ks = shuffle(['circle', 'bar', 'tri', 'sq', 'pent', 'hex']).slice(0, 3);
      const counts = ks.map(k => STD_KIND.indexOf(k));
      counts.slice().sort((a, b) => a - b).forEach(n => addG(mkGroup(n, { cap: 2 })));
      const [c1, c2, c3, c4, c5] = randCols(5);
      const sA1 = mkShape(counts[0], ks[0], c1), sA2 = mkShape(counts[0], ks[0], c2);
      const sB1 = mkShape(counts[1], ks[1], c3), sB2 = mkShape(counts[1], ks[1], pick([c1, c2, c4]));
      const sC = mkShape(counts[2], ks[2], c5);
      R.shapes = [sA1, sA2, sB1, sB2, sC];
      R.prompts = shuffle([sA1, sA2, pick([sB1, sB2]), sC]);
    } else if (key === 'add') {
      const s = ri(2, 6), a = ri(1, s - 1), b = s - a;
      R.a = a; R.b = b; R.sum = s;
      R.items.push({ g: mkGroup(a, { fixed: true, tag: true }) }, { sign: '+' }, { g: mkGroup(b, { fixed: true, tag: true }) }, { sign: '=' });
      addG(mkGroup(s, { hidden: true, badge: '?' }));
      const opts = [s];
      for (const d of shuffle([-1, 1, 2, -2])) { const v = s + d; if (v >= 1 && v <= 6 && !opts.includes(v)) opts.push(v); if (opts.length >= 3) break; }
      const cols = randCols(3);
      R.shapes = shuffle(opts).map((n, i) => mkShape(n, 'disc', cols[i]));
      R.prompts = [s];
    }
    shuffle(R.shapes).forEach((s, i) => { s.slot = i; });
    R.groups = R.items.filter(it => it.g).map(it => it.g);
    R.need = R.prompts ? R.prompts.length : R.shapes.length;
    return R;
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #pegs{background:#C99FA8;overflow:hidden}
  #pegs canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #pegs .ib{color:#8A4A17;background:rgba(255,255,255,.95);box-shadow:0 3px 0 rgba(120,60,30,.28)}
  #pegs .ttl{position:absolute;left:0;right:0;margin:0 auto;width:fit-content;top:max(14px,calc(env(safe-area-inset-top) + 4px));z-index:6;background:#fff;color:#6B3A12;
    font-weight:900;font-size:clamp(15px,4.4vw,19px);padding:5px 18px 4px;border-radius:99px;box-shadow:0 4px 0 rgba(150,80,30,.25),0 6px 14px rgba(0,0,0,.12);white-space:nowrap;max-width:calc(100% - 210px);overflow:hidden;text-overflow:ellipsis;pointer-events:none;text-align:center}
  #pegs .ttl small{display:block;font-size:11px;font-weight:700;opacity:.65;line-height:1.1}
  #pegs .prm{position:absolute;z-index:4;left:0;right:0;margin:0 auto;width:fit-content;max-width:calc(100% - 24px);top:calc(max(10px,env(safe-area-inset-top)) + 58px);display:flex;align-items:center;justify-content:center;gap:8px;min-height:52px;
    padding:5px 16px;border-radius:22px;background:#fff;border:4px solid #FFC56B;box-shadow:0 5px 0 #E59A2F,0 10px 20px rgba(80,30,10,.18);cursor:pointer;color:#5A2E0C;font-weight:900;font-size:clamp(17px,4.8vw,22px);line-height:1.15;will-change:transform}
  #pegs .prm.off{visibility:hidden}
  #pegs .prm .nm{font-size:clamp(26px,7.5vw,34px);min-width:40px;height:42px;padding:0 6px;border-radius:12px;display:grid;place-items:center;background:#FFF4DE;border:3px solid #FFD9A0;color:#C25E0C}
  #pegs .prm .nm.q{color:#E8382F;background:#FFF0F0;border-color:#FFB9B9}
  #pegs .prm i{font-style:normal;font-size:26px;color:#8A4A17}
  #pegs .prm canvas.pc{width:46px;height:46px;display:block}
  #pegs .bot{position:absolute;left:0;right:0;bottom:0;z-index:5;display:flex;align-items:center;gap:8px;padding:8px 12px max(12px,env(safe-area-inset-bottom));pointer-events:none}
  #pegs .bot > *{pointer-events:auto}
  #pegs .spk{width:58px;height:58px;flex:0 0 58px;border-radius:50%;font-size:26px;display:grid;place-items:center;
    background:radial-gradient(circle at 35% 30%,#FFE98A,#FFC21A 60%,#E9A300);box-shadow:0 5px 0 #C98600,0 8px 16px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.6)}
  #pegs .spk:active{transform:translateY(3px);box-shadow:0 2px 0 #C98600}
  #pegs .pbar{flex:1;max-width:560px;margin:0 auto;display:flex;gap:3px;padding:6px 8px;border-radius:99px;background:rgba(255,255,255,.9);box-shadow:0 3px 0 rgba(120,60,40,.22);min-width:0}
  #pegs .pbar i{flex:1;height:12px;border-radius:6px;background:#EBDCCB;box-shadow:inset 0 2px 2px rgba(0,0,0,.1)}
  #pegs .pbar i.on{background:linear-gradient(#FFB35C,#FF8A1F);box-shadow:0 2px 0 #D96A00}
  #pegs .lng{display:flex;background:rgba(255,255,255,.94);border-radius:99px;padding:4px;gap:2px;box-shadow:0 3px 0 rgba(120,60,40,.22)}
  #pegs .lng button{padding:7px 11px;border-radius:99px;font-weight:900;font-size:16px;background:transparent;color:#6B3A12;line-height:1.1;font-family:inherit}
  #pegs .lng button.on{background:#F08A24;color:#fff;box-shadow:0 3px 0 #B9600F}
  #pegs .panel{border-color:#FFE1B8;box-shadow:0 8px 0 #E8B477,0 20px 40px rgba(60,20,10,.3);color:#5A2E0C;background:linear-gradient(180deg,#fff 0%,#fff 70%,#FFF6EA 100%)}
  #pegs .panel h3{color:#D2691E;text-shadow:0 3px 0 #FFE2BF}
  #pegs .btn{background:linear-gradient(180deg,#FFA545,#F07C14);box-shadow:0 5px 0 #B9600F,0 8px 12px rgba(180,90,20,.25)}
  #pegs .btn:active{box-shadow:0 1px 0 #B9600F}
  #pegs .btn.alt{background:#fff;color:#C25E0C;box-shadow:0 4px 0 #F2C99A;border-color:#FFE6C7}
  #pegs .overlay{background:radial-gradient(circle at 50% 45%,rgba(90,40,30,.25),rgba(60,20,20,.5))}
  #pegs .lvp{width:min(94vw,480px);padding:16px 12px 14px}
  #pegs .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(128px,1fr));gap:10px;max-height:min(64vh,620px);overflow-y:auto;touch-action:pan-y;padding:6px 4px 10px;margin:8px 0 10px}
  #pegs .lv{position:relative;border-radius:20px;background:linear-gradient(#FFF7EC,#F6E2C4);padding:6px 4px 7px;display:flex;flex-direction:column;align-items:center;gap:1px;
    box-shadow:0 5px 0 #E3B98A,inset 0 0 0 3px #fff;color:#5A2E0C;font-family:inherit}
  #pegs .lv:active{transform:translateY(3px);box-shadow:0 2px 0 #E3B98A,inset 0 0 0 3px #fff}
  #pegs .lv canvas{width:110px;height:76px;display:block}
  #pegs .lv b{font-size:14px;line-height:1.2}
  #pegs .lv .md{font-size:12px;font-weight:800;color:#C25E0C;background:#fff;border-radius:99px;padding:0 8px}
  #pegs .lv .n{position:absolute;top:5px;right:7px;width:25px;height:25px;border-radius:50%;background:#FF8A1F;color:#fff;font-weight:900;font-size:14px;display:grid;place-items:center;box-shadow:0 2px 0 #D96A00}
  #pegs .lv .s{font-size:13px;letter-spacing:-2px}
  #pegs .lv .s i{font-style:normal}
  #pegs .lv .s i.off{filter:grayscale(1);opacity:.35}
  #pegs .lv.lock{filter:grayscale(.85);opacity:.6}
  #pegs .lv.lock::after{content:'🔒';position:absolute;top:28px;font-size:26px}
  #pegs .lv.cur{box-shadow:0 5px 0 #FF8A1F,inset 0 0 0 3px #FFB35C}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" data-i="home">🏠</button>
      <button class="ib helpbtn" data-i="help">❓</button>
      <span class="grow"></span>
      <button class="ib xbtn" data-i="levels">✕</button>
    </div>
    <div class="ttl"><span class="tN"></span><small class="tP"></small></div>
    <div class="prm off" role="button" data-i="repeat"></div>
    <div class="bot">
      <button class="spk" data-i="listen">🔊</button>
      <div class="pbar"></div>
      <div class="lng"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="overlay" id="pgLv"><div class="panel lvp"><h3 class="hLv"></h3>
      <div class="grid"></div>
      <button class="btn alt" data-a="close"></button></div></div>
    <div class="overlay" id="pgWin"><div class="panel">
      <h3 class="wT"></h3><div class="wN" style="font-weight:800;font-size:18px"></div><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next"></button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels"></button><button class="btn alt home" data-i="home">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const prm = root.querySelector('.prm'), pbar = root.querySelector('.pbar'), spk = root.querySelector('.spk'), botEl = root.querySelector('.bot');
  const lvOv = root.querySelector('#pgLv'), winOv = root.querySelector('#pgWin');
  const tP = root.querySelector('.tP');
  const LT = V => App.t(V.t, V.te);
  /* نصوص الواجهة حسب لغة التطبيق */
  function chrome() {
    const AL = { home: App.t('الرئيسية', 'Home'), help: App.t('مساعدة', 'Help'), levels: App.t('المستويات', 'Levels'), repeat: App.t('إعادة السؤال', 'Repeat the question'), listen: App.t('استمع', 'Listen') };
    root.querySelectorAll('[data-i]').forEach(e => e.setAttribute('aria-label', AL[e.dataset.i]));
    root.querySelector('.tN').textContent = App.t('لوح الأوتاد', 'Peg Board');
    root.querySelector('.hLv').textContent = '🪵 ' + App.t('المستويات', 'Levels');
    root.querySelector('[data-a="close"]').textContent = '✕ ' + App.t('إغلاق', 'Close');
    root.querySelector('[data-a="next"]').textContent = App.t('المستوى التالي', 'Next level') + ' ▶️';
    root.querySelector('[data-a="levels"]').textContent = '🪵 ' + App.t('المستويات', 'Levels');
    if (L) tP.textContent = App.t('المستوى ', 'Level ') + dg(lvl) + ' · ' + LT(L);
  }
  let winMis = 0;
  function winText() {
    root.querySelector('.wT').textContent = App.t(App.g('أحسنتِ!', 'أحسنت!'), 'Well done!') + ' 🎉';
    root.querySelector('.wN').textContent = L.ic + ' ' + LT(L);
    root.querySelector('.wP').textContent = winMis ? App.t('الأخطاء: ', 'Mistakes: ') + dg(winMis) : App.t('دون أي خطأ!', 'No mistakes!') + ' 💯';
  }

  /* ---------- الحالة ---------- */
  let ctx, Wd = 0, Hd = 0, dpr = 1, portrait = true, U = 100;
  let raf = 0, last = 0, Tm = 0, running = false, paused = false;
  let lvl = 1, L = LV[0], rounds = [], round = 0, R = null, groups = [], shapes = [];
  let done = 0, total = 1, mistakes = 0, wrongN = 0, phase = 'idle', busy = false, lastAct = 0;
  let parts = [], drag = null, shakeA = 0, BRD = { x0: 0, y0: 0, x1: 0, y1: 0 };
  const SC = { x: 0 };
  const bgCv = document.createElement('canvas'), bdCv = document.createElement('canvas');

  /* =====================================================================
     الرسم
     ===================================================================== */
  function shapeXf(s) { const r = s.rot + (s.tilt || 0); return { cs: Math.cos(r), sn: Math.sin(r), k: U * s.sc * (1 + .05 * (s.sq || 0)) }; }
  const P = (s, X, lx, lz, y) => [s.gx + (lx * X.cs - lz * X.sn) * X.k, s.gy + (lx * X.sn + lz * X.cs) * X.k * GK - y * HK * U];

  function drawShape(c, s) {
    if (s.alpha <= .01) return;
    const G = geo(s.kind), X = shapeXf(s), col = C(COLS[s.col].h);
    const th = TH * s.sc * (1 - .35 * (s.sq || 0)), y0 = s.y, y1 = s.y + th;
    const fade = s.alpha < 1; if (fade) { c.save(); c.globalAlpha *= s.alpha; }
    const n = G.pts.length;
    /* الجوانب: وجه لكل ضلع مواجه للكاميرا، بإضاءة حسب اتجاهه */
    c.lineJoin = 'round'; c.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const nr = G.nrm[i], rx = nr[0] * X.cs - nr[1] * X.sn, rz = nr[0] * X.sn + nr[1] * X.cs;
      if (rz < -.05) continue;
      const p = G.pts[i], q = G.pts[(i + 1) % n];
      const a = P(s, X, p[0], p[1], y0), b = P(s, X, q[0], q[1], y0), d = P(s, X, q[0], q[1], y1), e = P(s, X, p[0], p[1], y1);
      const f = rgb(mul(col, .5 + .3 * rz - .16 * rx));
      c.fillStyle = f; c.strokeStyle = f;
      c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.lineTo(d[0], d[1]); c.lineTo(e[0], e[1]); c.closePath(); c.fill(); c.stroke();
    }
    /* الوجه العلوي مع الثقوب (شفافة) */
    const outl = new Path2D();
    G.pts.forEach((p, i) => { const q = P(s, X, p[0], p[1], y1); if (i) outl.lineTo(q[0], q[1]); else outl.moveTo(q[0], q[1]); });
    outl.closePath();
    const face = new Path2D(outl);
    const hr = HR * X.k, hry = hr * GK, holes = [];
    if (!s.plug) for (const h of HL[s.n]) {
      const e1 = P(s, X, h[0], h[1], y1), e0 = P(s, X, h[0], h[1], y0);
      holes.push([e1, e0]); face.moveTo(e1[0] + hr, e1[1]); face.ellipse(e1[0], e1[1], hr, hry, 0, 0, TAU);
    }
    const ga = P(s, X, -.5, -.5, y1), gb = P(s, X, .5, .5, y1);
    const g = c.createLinearGradient(ga[0], ga[1], gb[0], gb[1]);
    g.addColorStop(0, rgb(lerpC(col, WHITE, .3))); g.addColorStop(.5, rgb(col)); g.addColorStop(1, rgb(mul(col, .86)));
    c.fillStyle = g; c.fill(face, 'evenodd');
    /* لمعة الطلاء */
    c.save(); c.clip(face, 'evenodd');
    const hc = P(s, X, -.2, -.24, y1);
    const rg = c.createRadialGradient(hc[0], hc[1], 0, hc[0], hc[1], X.k * .5);
    rg.addColorStop(0, 'rgba(255,255,255,.55)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = rg; c.fillRect(hc[0] - X.k, hc[1] - X.k, X.k * 2, X.k * 2);
    const lg = c.createLinearGradient(0, ga[1] - X.k * .3, 0, gb[1]);
    lg.addColorStop(0, 'rgba(255,255,255,.85)'); lg.addColorStop(.6, 'rgba(255,255,255,.1)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
    c.strokeStyle = lg; c.lineWidth = Math.max(2, X.k * .05); c.stroke(outl);
    c.restore();
    c.strokeStyle = rgb(mul(col, .5), .35); c.lineWidth = 1; c.stroke(outl);
    /* جدران الثقوب المحفورة: يظهر الخشب الخام */
    for (const [e1, e0] of holes) {
      c.save(); c.beginPath(); c.ellipse(e1[0], e1[1], hr, hry, 0, 0, TAU); c.clip();
      c.beginPath(); c.ellipse(e1[0], e1[1], hr, hry, 0, 0, TAU); c.moveTo(e0[0] + hr, e0[1]); c.ellipse(e0[0], e0[1], hr, hry, 0, 0, TAU);
      const wg = c.createLinearGradient(0, e1[1] - hry, 0, e1[1] + hry);
      wg.addColorStop(0, '#7E5A36'); wg.addColorStop(1, '#D9BA8C');
      c.fillStyle = wg; c.fill('evenodd');
      c.restore();
      c.beginPath(); c.ellipse(e1[0], e1[1], hr, hry, 0, Math.PI * .1, Math.PI * .9);
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = Math.max(1, X.k * .02); c.stroke();
    }
    /* رقم مطبوع على الشكل (مستوى الأرقام) */
    if (s.numeral) {
      const cp = P(s, X, 0, 0, y1);
      c.save(); c.translate(cp[0], cp[1]); c.scale(1, GK);
      c.font = `900 ${X.k * .56}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
      c.lineWidth = X.k * .08; c.lineJoin = 'round'; c.strokeStyle = rgb(mul(col, .55)); c.strokeText(dg(s.n), 0, X.k * .04);
      c.fillStyle = '#fff'; c.fillText(dg(s.n), 0, X.k * .04);
      c.restore();
    }
    if (fade) c.restore();
  }
  /* ظل ناعم بثقوب (الضوء يمر عبرها) — حيلة الإزاحة الكبيرة لرسم الظل وحده */
  function shapeShadow(c, s) {
    if (s.alpha <= .01) return;
    const G = geo(s.kind), X = shapeXf(s), h = Math.max(0, s.y);
    const dx = (.05 + h * .42) * U, dy = (.035 + h * .26) * U, off = 6000;
    const path = new Path2D();
    G.pts.forEach((p, i) => { const q = P(s, X, p[0], p[1], 0); if (i) path.lineTo(q[0] + dx - off, q[1] + dy); else path.moveTo(q[0] + dx - off, q[1] + dy); });
    path.closePath();
    if (!s.plug) for (const hh of HL[s.n]) { const e = P(s, X, hh[0], hh[1], 0); const r = HR * X.k; path.moveTo(e[0] + dx - off + r, e[1] + dy); path.ellipse(e[0] + dx - off, e[1] + dy, r, r * GK, 0, 0, TAU); }
    c.save();
    c.shadowColor = `rgba(70,25,30,${clamp(.34 - h * .17, .1, .34) * s.alpha})`; c.shadowBlur = (3 + h * 20) * dpr; c.shadowOffsetX = off * dpr;
    c.fillStyle = '#000'; c.fill(path, 'evenodd'); c.restore();
  }

  /* الأوتاد: أسطوانة خشبية مخدّدة بنهاية مقطوعة تظهر حلقات الخشب */
  const WL = [214, 186, 150], WM = [176, 144, 106], WD = [108, 80, 52];
  function drawPeg(c, x, y, yA, yB, cap, p) {
    const r = PR * U, ry = r * GK, top = y - yB * HK * U, bot = y - yA * HK * U, t = p.tone;
    if (yB > yA + .002) {
      const g = c.createLinearGradient(x - r, 0, x + r, 0);
      g.addColorStop(0, rgb(mul(WD, t))); g.addColorStop(.3, rgb(mul(WL, t))); g.addColorStop(.62, rgb(mul(WM, t))); g.addColorStop(1, rgb(mul(WD, t * .85)));
      c.beginPath(); c.moveTo(x - r, top); c.lineTo(x - r, bot); c.ellipse(x, bot, r, ry, 0, Math.PI, 0, true); c.lineTo(x + r, top); c.closePath();
      c.fillStyle = g; c.fill();
      if (bot - top > 3) {
        c.beginPath();
        for (const a of [-.95, -.45, .05, .55]) { const fx = x + Math.sin(a) * r; c.moveTo(fx, top + 1); c.lineTo(fx, bot + Math.cos(a) * ry * .9); }
        c.strokeStyle = 'rgba(80,52,26,.2)'; c.lineWidth = Math.max(.6, r * .09); c.stroke();
      }
    }
    if (cap) {
      const g2 = c.createRadialGradient(x - r * .2, top - ry * .2, 0, x, top, r);
      g2.addColorStop(0, '#EBD5AE'); g2.addColorStop(.7, '#D3B185'); g2.addColorStop(1, '#A9845A');
      c.beginPath(); c.ellipse(x, top, r, ry, 0, 0, TAU); c.fillStyle = g2; c.fill();
      c.strokeStyle = 'rgba(120,80,40,.28)'; c.lineWidth = Math.max(.5, r * .06);
      c.beginPath(); c.ellipse(x + r * .06, top, r * .55, ry * .55, 0, 0, TAU); c.stroke();
      c.beginPath(); c.ellipse(x + r * .06, top, r * .25, ry * .25, 0, 0, TAU); c.stroke();
      c.strokeStyle = 'rgba(255,248,230,.65)'; c.lineWidth = Math.max(.8, r * .1);
      c.beginPath(); c.ellipse(x, top, r * .9, ry * .9, 0, Math.PI * 1.05, Math.PI * 1.75); c.stroke();
      if (p.glow > .01) {
        c.save(); c.globalCompositeOperation = 'lighter';
        const gg = c.createRadialGradient(x, top, 0, x, top, r * 2.8);
        gg.addColorStop(0, `rgba(255,220,90,${.9 * p.glow})`); gg.addColorStop(1, 'rgba(255,200,60,0)');
        c.fillStyle = gg; c.beginPath(); c.ellipse(x, top, r * 2.8, r * 2.8 * GK, 0, 0, TAU); c.fill(); c.restore();
      }
    }
  }
  const pegXY = (g, p) => [g.gx + p.x * U + (g.wob ? Math.sin(Tm * 45 + p.i) * g.wob * .035 * U : 0), g.gy + p.z * U * GK];
  function pegShadows(c, g) {
    if (g.pegH < .01) return;
    c.save(); c.strokeStyle = 'rgba(80,40,25,.16)'; c.lineCap = 'round'; c.lineWidth = PR * 2 * U; c.beginPath();
    const Lh = g.pegH * U;
    for (const p of g.pegs) { const [x, y] = pegXY(g, p); c.moveTo(x, y); c.lineTo(x + Lh * .6, y + Lh * .26); }
    c.stroke(); c.restore();
  }
  /* مجموعة: أوتاد تتخلّلها الأشكال المكدّسة بالترتيب الصحيح للعمق */
  function drawGroup(c, g) {
    const H = g.pegH;
    const seg = (a, b) => {
      if (H <= .002) return;
      const bb = Math.min(b, H); if (bb <= a + 1e-4) return;
      const cap = bb >= H - 1e-4;
      for (const p of g.sorted) { const [x, y] = pegXY(g, p); drawPeg(c, x, y, a, bb, cap, p); }
    };
    let cur = 0;
    const stack = g.shapes.slice().sort((a, b) => a.y - b.y);
    for (const s of stack) { if (s.st === 'placed') { s.gx = g.gx; s.gy = g.gy; } seg(cur, s.y); drawShape(c, s); cur = Math.max(cur, s.y + TH * s.sc); }
    if (cur < H) seg(cur, H);
  }
  function burnText(c, txt, x, y, size, a) {
    if (a <= .01) return;
    c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(1, GK);
    c.font = `900 ${size}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
    c.shadowColor = 'rgba(120,60,20,.55)'; c.shadowBlur = 3 * dpr;
    c.fillStyle = 'rgba(102,56,22,.85)'; c.fillText(txt, 0, size * .06);
    c.restore();
  }
  function drawDeco(c, g) {
    const rx = .62 * U, ry = rx * GK;
    if (g.hl > .02 || g.hint > .02) {
      const a = Math.max(g.hl, g.hint * (.55 + .45 * Math.sin(Tm * 8)));
      const gg = c.createRadialGradient(g.gx, g.gy, rx * .2, g.gx, g.gy, rx * 1.1);
      gg.addColorStop(0, `rgba(255,236,150,${.65 * a})`); gg.addColorStop(1, 'rgba(255,220,120,0)');
      c.save(); c.translate(g.gx, g.gy); c.scale(1, GK); c.translate(-g.gx, -g.gy);
      c.fillStyle = gg; c.beginPath(); c.arc(g.gx, g.gy, rx * 1.1, 0, TAU); c.fill();
      c.lineWidth = 3; c.strokeStyle = `rgba(255,170,30,${.8 * a})`; c.setLineDash([8, 6]); c.lineDashOffset = -Tm * 30;
      c.beginPath(); c.arc(g.gx, g.gy, rx * .82, 0, TAU); c.stroke(); c.restore();
    }
    if (g.badgeA > .01) {
      c.save(); c.globalAlpha *= g.badgeA;
      c.strokeStyle = 'rgba(102,56,22,.75)'; c.lineWidth = .045 * U; c.shadowColor = 'rgba(120,60,20,.5)'; c.shadowBlur = 3 * dpr;
      c.beginPath(); c.ellipse(g.gx, g.gy, .4 * U, .4 * U * GK, 0, 0, TAU); c.stroke();
      c.restore();
      const txt = g.badge === '?' ? (lang === 'ar' ? '؟' : '?') : dg(g.badge);
      burnText(c, txt, g.gx, g.gy, .56 * U, g.badgeA);
    }
    if (g.tagA > .01) {
      c.save(); c.globalAlpha *= g.tagA;
      c.fillStyle = 'rgba(255,250,235,.55)'; c.strokeStyle = 'rgba(102,56,22,.55)'; c.lineWidth = 1.5;
      c.beginPath(); c.ellipse(g.tx, g.ty, .17 * U, .17 * U * GK, 0, 0, TAU); c.fill(); c.stroke(); c.restore();
      burnText(c, dg(g.n), g.tx, g.ty, .27 * U, g.tagA);
    }
  }
  /* لوح الخشب الرقائقي (يُرسم مرة في ذاكرة مؤقتة) */
  function drawBoardRect(c, x0, y0, x1, y1, th, vert, seed, dp) {
    const w = x1 - x0, h = y1 - y0, r = Math.min(w, h) * .07, rnd = rng(seed);
    c.save(); c.shadowColor = 'rgba(70,20,40,.4)'; c.shadowBlur = 22 * dp; c.shadowOffsetY = 10 * dp; c.shadowOffsetX = 4 * dp;
    c.fillStyle = '#C9A87A'; c.beginPath(); c.roundRect(x0, y0, w, h + th, r); c.fill(); c.restore();
    /* حافة اللوح: طبقات الخشب الرقائقي */
    c.save(); c.beginPath(); c.roundRect(x0, y0, w, h + th, r); c.clip();
    const eg = c.createLinearGradient(0, y1, 0, y1 + th); eg.addColorStop(0, '#E9D4AC'); eg.addColorStop(1, '#BC9964');
    c.fillStyle = eg; c.fillRect(x0, y0, w, h + th);
    for (let k = 1; k <= 4; k++) { c.fillStyle = k % 2 ? 'rgba(125,85,45,.3)' : 'rgba(255,242,215,.4)'; c.fillRect(x0, y1 + th * k / 5 - th * .05, w, Math.max(.7, th * .1)); }
    const sg = c.createLinearGradient(x0, 0, x1, 0); sg.addColorStop(0, 'rgba(90,50,20,.25)'); sg.addColorStop(.06, 'rgba(90,50,20,0)'); sg.addColorStop(.94, 'rgba(90,50,20,0)'); sg.addColorStop(1, 'rgba(90,50,20,.3)');
    c.fillStyle = sg; c.fillRect(x0, y1, w, th + 2);
    c.restore();
    /* السطح */
    const tg = c.createLinearGradient(x0, y0, x1, y1); tg.addColorStop(0, '#FAF2E2'); tg.addColorStop(.5, '#F2E4C8'); tg.addColorStop(1, '#E7D3AF');
    c.beginPath(); c.roundRect(x0, y0, w, h, r); c.fillStyle = tg; c.fill();
    c.save(); c.clip();
    const Lg = vert ? h : w, Ac = vert ? w : h;
    const pt = (al, ac) => vert ? [x0 + ac, y0 + al] : [x0 + al, y0 + ac];
    /* خطوط عريضة باهتة */
    for (let i = 0; i < 5; i++) {
      const off = rnd() * Ac, amp = 3 + rnd() * 8, fr = .004 + rnd() * .008, ph = rnd() * 6;
      c.strokeStyle = `rgba(190,140,80,${.04 + rnd() * .05})`; c.lineWidth = 8 + rnd() * 18; c.beginPath();
      for (let t = -10; t <= Lg + 10; t += 10) { const q = pt(t, off + Math.sin(t * fr + ph) * amp); if (t < 0) c.moveTo(q[0], q[1]); else c.lineTo(q[0], q[1]); }
      c.stroke();
    }
    /* عروق الخشب */
    const N = Math.round(Ac / 3);
    for (let i = 0; i < N; i++) {
      const off = rnd() * Ac, amp = 1 + rnd() * 4, fr = .006 + rnd() * .02, ph = rnd() * 6;
      c.strokeStyle = `rgba(160,112,58,${.035 + rnd() * .09})`; c.lineWidth = .5 + rnd() * 1.3; c.beginPath();
      const st = rnd() * Lg * .3, en = Lg - rnd() * Lg * .3;
      for (let t = st; t <= en; t += 7) { const q = pt(t, off + Math.sin(t * fr + ph) * amp + Math.sin(t * fr * 3.1 + ph * 2) * amp * .3); if (t === st) c.moveTo(q[0], q[1]); else c.lineTo(q[0], q[1]); }
      c.stroke();
    }
    /* عقدة خشب وبقع خفيفة */
    for (let k = 0; k < 2; k++) {
      const q = pt(Lg * (.2 + rnd() * .6), Ac * (.15 + rnd() * .7)), rr = 4 + rnd() * 6;
      for (let j = 1; j <= 4; j++) { c.strokeStyle = `rgba(150,100,50,${.13 - j * .02})`; c.lineWidth = 1; c.beginPath(); c.ellipse(q[0], q[1], vert ? rr * j * .5 : rr * j * 1.4, vert ? rr * j * 1.4 : rr * j * .5, 0, 0, TAU); c.stroke(); }
    }
    for (let k = 0; k < 4; k++) { const q = pt(Lg * rnd(), Ac * rnd()); const gg = c.createRadialGradient(q[0], q[1], 0, q[0], q[1], 30); gg.addColorStop(0, 'rgba(120,110,100,.06)'); gg.addColorStop(1, 'rgba(120,110,100,0)'); c.fillStyle = gg; c.fillRect(q[0] - 30, q[1] - 30, 60, 60); }
    c.restore();
    c.beginPath(); c.roundRect(x0 + 1.5, y0 + 1.5, w - 3, h - 3, r); c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1.5; c.stroke();
    c.beginPath(); c.roundRect(x0, y0, w, h, r); c.strokeStyle = 'rgba(140,100,55,.35)'; c.lineWidth = 1; c.stroke();
  }
  /* السجادة الوردية بزخارف ذهبية ناعمة (مثل الصورة) */
  function drawCarpet(c, W, H) {
    const rnd = rng(77);
    const g = c.createRadialGradient(W * .5, H * .4, 0, W * .5, H * .5, Math.max(W, H) * .8);
    g.addColorStop(0, '#E4C3C8'); g.addColorStop(1, '#BC929C');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.lineCap = 'round';
    const n = Math.round(W * H / 45000) + 6;
    for (let i = 0; i < n; i++) {
      const x = rnd() * W, y = rnd() * H, s = 60 + rnd() * 120, a = rnd() * TAU;
      const pts = [[x, y]]; let ang = a;
      for (let k = 0; k < 3; k++) { ang += 1.2 + rnd(); pts.push([pts[k][0] + Math.cos(ang) * s, pts[k][1] + Math.sin(ang) * s]); }
      const lw = 10 + rnd() * 16;
      for (const [col, w] of [['rgba(250,236,205,.28)', lw], ['rgba(214,186,120,.3)', lw * .35]]) {
        c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
        c.bezierCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1], pts[3][0], pts[3][1]); c.stroke();
      }
    }
    for (let i = 0; i < W * H / 260; i++) { c.fillStyle = rnd() < .5 ? 'rgba(255,255,255,.07)' : 'rgba(90,40,60,.06)'; c.fillRect(rnd() * W, rnd() * H, 1.5, 1.5); }
    for (let i = 0; i < W * H / 9000; i++) { c.fillStyle = `rgba(255,225,140,${.3 + rnd() * .4})`; c.fillRect(rnd() * W, rnd() * H, 1.2, 1.2); }
    const v = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .4, W / 2, H / 2, Math.max(W, H) * .75);
    v.addColorStop(0, 'rgba(60,20,40,0)'); v.addColorStop(1, 'rgba(60,20,40,.25)');
    c.fillStyle = v; c.fillRect(0, 0, W, H);
  }
  function buildCaches() {
    bgCv.width = cv.width; bgCv.height = cv.height;
    const b = bgCv.getContext('2d'); b.setTransform(dpr, 0, 0, dpr, 0, 0); drawCarpet(b, Wd, Hd);
    bdCv.width = cv.width; bdCv.height = cv.height;
    const d = bdCv.getContext('2d'); d.setTransform(dpr, 0, 0, dpr, 0, 0); d.clearRect(0, 0, Wd, Hd);
    if (R) drawBoardRect(d, BRD.x0, BRD.y0, BRD.x1, BRD.y1, .16 * U, portrait, 11 + lvl * 7 + round, dpr);
  }

  /* =====================================================================
     التخطيط
     ===================================================================== */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; Wd = f.w; Hd = f.h; dpr = f.dpr;
    portrait = Wd / Hd < 1.05;
    if (!R) { buildCaches(); return; }
    const top = Math.max(118, prm.offsetTop + prm.offsetHeight + 12);
    const bottom = Math.min(Hd - 72, botEl.offsetTop - 2);
    const avail = bottom - top;
    const glen = portrait ? 1.45 : 1.36, slen = portrait ? .62 : .56;
    const sumL = R.items.reduce((a, it) => a + (it.g ? glen : slen), 0);
    let x0, x1, y0, y1, tray;
    if (portrait) {
      U = Math.min(avail / (sumL * GK + .8), (Wd - 34) / (1.62 + 1.15), 150);
      const bw = 1.62 * U; x1 = Wd - 12; x0 = x1 - bw;
      const len = sumL * GK * U + .3 * U;
      y0 = top + .42 * U + Math.max(0, (avail - .42 * U - len - .16 * U) / 2); y1 = y0 + len;
      let cur = y0 + .15 * U;
      for (const it of R.items) {
        const l2 = (it.g ? glen : slen) * GK * U, cy = cur + l2 / 2, cx = x0 + bw * .43;
        if (it.g) Object.assign(it.g, { gx: cx, gy: cy, tx: x0 + bw * .86, ty: cy + .04 * U }); else { it.x = cx; it.y = cy; }
        cur += l2;
      }
      tray = { x0: 8, x1: x0 - 8, y0: top, y1: bottom };
    } else {
      const Wc = Math.min(Wd - 40, 1080);
      U = Math.min(Wc / (sumL + .45), avail / (1.75 * GK + PH * HK + .3 + 1.2 * GK + .25), 150);
      const len = (sumL + .3) * U; x0 = (Wd - len) / 2; x1 = x0 + len;
      y0 = top + (PH * HK + .1) * U; const dep = 1.75 * GK * U; y1 = y0 + dep;
      let cur = x0 + .15 * U;
      for (const it of R.items) {
        const l2 = (it.g ? glen : slen) * U, cx = cur + l2 / 2, cy = y0 + dep * .42;
        if (it.g) Object.assign(it.g, { gx: cx, gy: cy, tx: cx, ty: y0 + dep * .87 }); else { it.x = cx; it.y = cy; }
        cur += l2;
      }
      tray = { x0: Math.max(12, (Wd - Wc) / 2), x1: Math.min(Wd - 12, (Wd + Wc) / 2), y0: y1 + .16 * U + .25 * U, y1: bottom };
    }
    BRD = { x0, y0, x1, y1 };
    /* الصينية: شبكة تختار أكبر مقياس ممكن */
    const n = R.shapes.length; let best = null;
    for (let cols = 1; cols <= n; cols++) {
      const rows = Math.ceil(n / cols), cw = (tray.x1 - tray.x0) / cols, ch = (tray.y1 - tray.y0) / rows;
      const sc = Math.min(.95, cw / (1.14 * U), ch / ((1.08 * GK + .14) * U));
      if (!best || sc > best.sc + .001) best = { cols, rows, cw, ch, sc };
    }
    for (const s of R.shapes) {
      const col = s.slot % best.cols, row = Math.floor(s.slot / best.cols);
      const cx = lang === 'ar' && !portrait ? best.cols - 1 - col : col;
      s.hx = tray.x0 + best.cw * (cx + .5) + s.jx * best.cw * .06;
      s.hy = tray.y0 + best.ch * (row + .5) + .04 * U + s.jy * best.ch * .04;
      s.hsc = best.sc;
      if (s.st === 'tray') { s.gx = s.hx; s.gy = s.hy; s.sc = s.hsc; }
    }
    buildCaches();
  }

  /* =====================================================================
     مجرى اللعب
     ===================================================================== */
  const curPrompt = () => R && R.prompts ? R.prompts[R.pi] : null;
  function startLevel(n) {
    lvl = clamp(n, 1, NL); L = LV[lvl - 1];
    A.killAll(); parts = []; drag = null; busy = false;
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    rounds = Array.from({ length: L.rounds }, (_, r) => makeRound(L.key, r));
    total = rounds.reduce((a, r) => a + r.need, 0);
    round = 0; done = 0; mistakes = 0; wrongN = 0;
    chrome();
    buildRound(0, true);
  }
  function buildRound(r, first) {
    R = rounds[r]; groups = R.groups; shapes = R.shapes;
    phase = 'intro'; busy = false; wrongN = 0;
    setPrompt(true); renderBar();
    layout();
    SC.x = first ? Wd * .9 : Wd * 1.1;
    const tl = A.tl();
    tl.to(SC, { x: 0, duration: .65, ease: 'power3.out' });
    shapes.forEach((s, i) => {
      s.y = 2.2; s.alpha = 1; s.sc = s.hsc; s.rot = s.hrot; s.st = 'anim';
      tl.to(s, { y: 0, duration: .6, ease: 'bounce.out', onComplete: () => { s.st = 'tray'; Sound.tone(260 + i * 30, .05, 'triangle', .08); } }, .3 + i * .08);
    });
    tl.call(() => { phase = 'play'; lastAct = Tm; speakPrompt(); }, null, .45);
    Sound.whoosh();
  }
  function speakPrompt() {
    const Pp = curPrompt();
    if (L.key === 'count') say(App.g('ضعي', 'ضع') + ' ' + AR_W[Pp], 'Put ' + EN_W[Pp]);
    else if (L.key === 'color') say(nameAr(Pp), nameEn(Pp));
    else if (L.key === 'add') say(`${AR_W[R.a]} زائد ${AR_W[R.b]} يساوي؟`, `${EN_W[R.a]} plus ${EN_W[R.b]} equals?`);
    else say(App.g('ضعي كل شكل على أوتاده', 'ضع كل شكل على أوتاده'), 'Put each shape on its pegs');
  }
  function isCorrect(s, g) {
    if (g.n !== s.n || g.shapes.length >= g.cap) return false;
    const Pp = curPrompt();
    if (Pp != null) return L.key === 'color' ? Pp === s : Pp === s.n;
    return true;
  }
  function dropTarget(s) {
    const cx = s.gx, cy = s.gy - s.y * HK * U;
    let best = null, bd = .8 * U;
    for (const g of groups) {
      if (g.fixed) continue;
      const d = Math.hypot(cx - g.gx, (cy - (g.gy - PH * HK * U * .5)) * 1.1);
      if (d < bd) { bd = d; best = g; }
    }
    return best;
  }
  function clack(s, g) {
    Sound.noise(.05, 3400, 1900, .32, 5); Sound.tone(1150, .035, 'square', .04); Sound.tone(310, .1, 'triangle', .2, -90);
    vibrate(18); shakeA = .7;
    const G = geo(s.kind);
    for (let i = 0; i < 12; i++) {
      const p = G.pts[Math.floor(i / 12 * G.pts.length)];
      parts.push({ k: 'd', x: g.gx + p[0] * U * 1.05, y: g.gy + p[1] * U * GK * 1.05 - s.y * HK * U, vx: p[0] * rand(120, 220), vy: p[1] * rand(60, 120) - 10, r: rand(.03, .07) * U, life: rand(.4, .75), age: 0 });
    }
  }
  function popPlugs(s) {
    const X = shapeXf(s);
    s.plug = false;
    for (const h of HL[s.n]) {
      const e = P(s, X, h[0], h[1], s.y + TH);
      parts.push({ k: 'p', x: e[0], y: e[1], vx: rand(-160, 160), vy: rand(-420, -260), g: 1300, r: HR * U, col: COLS[s.col].h, rot: rand(0, TAU), vr: rand(-12, 12), life: 1.2, age: 0 });
    }
    Sound.pop(); Sound.tone(900, .08, 'sine', .1, 400, .05);
  }
  function place(s, g) {
    busy = true; lastAct = Tm; wrongN = 0;
    const idx = g.shapes.length; g.shapes.push(s); s.grp = g; s.st = 'anim';
    groups.forEach(G => { G.hint = 0; });
    const restY = idx * TH;
    const tl = A.tl();
    tl.to(s, { gx: g.gx, gy: g.gy, rot: 0, tilt: 0, sc: 1, y: Math.max(s.y, PH + .16), duration: .24, ease: 'power2.out' });
    if (s.plug) tl.call(() => popPlugs(s), null, '+=.02');
    if (g.hidden && g.pegH < PH) {
      tl.to(g, { badgeA: 0, duration: .2 });
      tl.to(g, { pegH: PH, duration: .42, ease: 'back.out(1.8)', onStart: () => { Sound.tone(300, .3, 'sine', .14, 500); Sound.noise(.25, 600, 1600, .06, 2); } }, '<');
    }
    tl.to(s, { y: restY, duration: .36, ease: 'power2.in', onComplete: () => clack(s, g) }, '+=.04');
    tl.to(s, { sq: 1, duration: .05 });
    tl.to(s, { sq: 0, duration: .45, ease: 'elastic.out(1,.4)', onComplete: () => { s.st = 'placed'; } });
    tl.call(() => countPegs(g, s), null, '-=.4');
  }
  function countPegs(g, s) {
    const n = g.n, step = .44;
    if (L.key === 'color') say(nameAr(s), nameEn(s));
    else if (L.key === 'add') say(`${AR_W[R.a]} زائد ${AR_W[R.b]} يساوي ${AR_W[R.sum]}`, `${EN_W[R.a]} plus ${EN_W[R.b]} equals ${EN_W[R.sum]}`);
    else say(AR_W.slice(1, n + 1).join('، '), EN_W.slice(1, n + 1).join(', '));
    const tl = A.tl();
    g.pegs.forEach((p, i) => {
      tl.call(() => { Sound.tone(520 * Math.pow(1.122, i), .14, 'sine', .13); Sound.tone(1040 * Math.pow(1.122, i), .08, 'triangle', .04); }, null, i * step);
      tl.to(p, { glow: 1, nb: 1, duration: .25, ease: 'back.out(3)' }, i * step);
      tl.to(p, { glow: 0, duration: .6 }, i * step + .3);
    });
    tl.to(g, { tagA: 1, duration: .4 }, n * step);
    tl.to(g.pegs, { nb: 0, duration: .3 }, n * step + .45);
    tl.call(() => afterPlace(g), null, n * step + .2);
  }
  function afterPlace(g) {
    done++; busy = false; renderBar(true);
    if (g.shapes.length >= 3) App.achieve('pegs_tower');
    if (R.prompts) R.pi++;
    const placed = R.prompts ? R.pi : R.shapes.filter(s => s.grp).length;
    if (placed >= R.need) roundDone();
    else { setPrompt(true); if (R.prompts) A.tl().call(speakPrompt, null, .5); }
  }
  function reject(s, g) {
    mistakes++; wrongN++; lastAct = Tm;
    s.st = 'anim';
    const countOK = g.n === s.n && g.shapes.length < g.cap;
    const tl = A.tl();
    tl.to(s, { gx: g.gx, gy: g.gy, y: PH + .24, rot: 0, tilt: 0, sc: 1, duration: .18, ease: 'power2.out' });
    tl.to(s, { y: PH + .05, duration: .08, ease: 'power2.in', onComplete: () => {
      Sound.noise(.05, 1900, 900, .2, 4); Sound.error(); vibrate(30);
      g.wob = 1; A.to(g, { wob: 0, duration: .6 });
    } });
    tl.to(s, { y: PH + .5, duration: .22, ease: 'power2.out' });
    tl.to(s, { tilt: .22, duration: .07 }).to(s, { tilt: -.22, duration: .1 }).to(s, { tilt: 0, duration: .08 });
    tl.to(s, { gx: s.hx, gy: s.hy, rot: s.hrot, sc: s.hsc, duration: .5, ease: 'power2.inOut' });
    tl.to(s, { y: 0, duration: .55, ease: 'bounce.out', onComplete: () => { s.st = 'tray'; } }, '<');
    if (countOK && curPrompt() != null) speakPrompt();
    else say(App.g('حاولي مرة أخرى', 'حاول مرة أخرى'), 'Try again!');
    if (wrongN >= 2) A.tl().call(() => hint(false), null, 1.2);
  }
  function backToTray(s) {
    s.st = 'anim';
    const tl = A.tl();
    tl.to(s, { gx: s.hx, gy: s.hy, rot: s.hrot, sc: s.hsc, tilt: 0, duration: .42, ease: 'power2.inOut' });
    tl.to(s, { y: 0, duration: .5, ease: 'bounce.out', onComplete: () => { s.st = 'tray'; Sound.tone(240, .05, 'triangle', .08); } }, '<');
  }
  /* تلميح: إضاءة المجموعة الصحيحة واهتزاز الشكل الصحيح */
  function correctPair() {
    const Pp = curPrompt();
    for (const s of shapes) {
      if (s.grp || s.st === 'gone') continue;
      if (Pp != null && (L.key === 'color' ? Pp !== s : Pp !== s.n)) continue;
      const g = groups.find(G => !G.fixed && isCorrect(s, G));
      if (g) return [s, g];
    }
    return null;
  }
  function hint(talk) {
    const cp = correctPair(); if (!cp) return;
    const [s, g] = cp;
    A.to(g, { hint: 1, duration: .3 }); A.tl().to(g, { hint: 0, duration: .6 }, 3.2);
    if (s.st === 'tray') { const tl = A.tl(); tl.to(s, { y: .35, duration: .18, ease: 'power2.out' }).to(s, { y: 0, duration: .45, ease: 'bounce.out' }).to(s, { y: .25, duration: .15 }).to(s, { y: 0, duration: .4, ease: 'bounce.out' }); }
    if (talk) speakPrompt();
  }
  function roundDone() {
    phase = 'celebrate';
    const cx = (BRD.x0 + BRD.x1) / 2, cy = (BRD.y0 + BRD.y1) / 2;
    confetti(cx, cy, 70); Sound.star();
    const tl = A.tl();
    if (round + 1 < rounds.length) {
      tl.call(() => {
        phase = 'trans'; Sound.whoosh();
        shapes.forEach(s => { if (!s.grp) A.to(s, { alpha: 0, y: 1.2, duration: .35 }); });
      }, null, 1.3);
      tl.to(SC, { x: -Wd * 1.1, duration: .5, ease: 'power2.in' }, 1.4);
      tl.call(() => { round++; buildRound(round); }, null, 1.95);
    } else tl.call(levelDone, null, 1.3);
  }
  function levelDone() {
    phase = 'over';
    const pr = loadProg(), stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1, prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(NL, lvl + 1);
    store.set('pegsProg', pr);
    winMis = mistakes; winText();
    root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
    root.querySelector('[data-a="next"]').style.display = lvl < NL ? '' : 'none';
    winOv.classList.add('on');
    if (HAS()) gsap.fromTo(winOv.querySelector('.panel'), { scale: .6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .5, ease: 'back.out(1.8)' });
    Sound.win(); confetti(Wd / 2, Hd * .3, 90);
    say(App.g('أحسنتِ!', 'أحسنت!'), 'Well done!');
    if (stars > prev) App.addStars(stars - prev + 1);
    App.achieve('pegs_first');
    if (L.key === 'add') App.achieve('pegs_add');
    if (Array.from({ length: NL }, (_, i) => pr.stars[i + 1]).every(Boolean)) App.achieve('pegs_all');
  }
  function confetti(x, y, n) {
    const cols = ['#E8382F', '#FFCC17', '#2152E3', '#27B24A', '#FF8519', '#8A4CD9', '#FF5AA5', '#FFFFFF'];
    for (let i = 0; i < n; i++) parts.push({ k: 'c', x: x + rand(-40, 40), y: y + rand(-20, 20), vx: rand(-300, 300), vy: rand(-560, -180), g: 900, col: pick(cols), w: rand(6, 11), h: rand(4, 7), rot: rand(0, TAU), vr: rand(-10, 10), life: rand(1.4, 2.2), age: 0 });
  }

  /* =====================================================================
     عناصر HTML
     ===================================================================== */
  function drawMini(cvs, s, size) {
    cvs.width = size * 2; cvs.height = size * 2;
    const c = cvs.getContext('2d'); c.scale(2, 2);
    const sv = U, mr = Math.max(...geo(s.kind).pts.map(q => Math.hypot(q[0], q[1] / GK))); U = size * .46 / mr;
    const t = Object.assign({}, s, { gx: size / 2, gy: size * .5 + TH * HK * U * .5, y: 0, sc: 1, rot: 0, tilt: 0, sq: 0, alpha: 1 });
    drawShape(c, t); U = sv;
  }
  function setPrompt(bump) {
    if (!R || phase === 'over') { prm.classList.add('off'); return; }
    const Pp = curPrompt(), ar = lang === 'ar';
    let h = '';
    if (L.key === 'count') h = `<span class="pt">${ar ? App.g('ضعي', 'ضع') : 'Put'}</span><b class="nm">${dg(Pp)}</b>`;
    else if (L.key === 'color') h = `<canvas class="pc"></canvas><span class="pt">${ar ? nameAr(Pp) : nameEn(Pp)}</span>`;
    else if (L.key === 'add') h = `<b class="nm">${dg(R.a)}</b><i>+</i><b class="nm">${dg(R.b)}</b><i>=</i><b class="nm q">${ar ? '؟' : '?'}</b>`;
    else if (L.key === 'numer') h = `<span class="pt">🔢 ${ar ? App.g('طابقي', 'طابق') + ' الرقم مع عدد الأوتاد' : 'Match numbers and pegs'}</span>`;
    else if (L.key === 'stack') h = `<span class="pt">🗼 ${ar ? App.g('كدّسي الأشكال على أوتادها', 'كدّس الأشكال على أوتادها') : 'Stack the shapes on their pegs'}</span>`;
    else h = `<span class="pt">🪵 ${ar ? App.g('ضعي كل شكل على أوتاده', 'ضع كل شكل على أوتاده') : 'Put each shape on its pegs'}</span>`;
    prm.innerHTML = h; prm.dir = ar ? 'rtl' : 'ltr';
    prm.classList.remove('off');
    const pc = prm.querySelector('canvas.pc'); if (pc && Pp) drawMini(pc, Pp, 46);
    if (bump && HAS()) gsap.fromTo(prm, { scale: .82 }, { scale: 1, duration: .55, ease: 'back.out(3)', overwrite: true });
  }
  function renderBar(pop) {
    pbar.dir = lang === 'ar' ? 'rtl' : 'ltr';
    pbar.innerHTML = Array.from({ length: total }, (_, i) => `<i class="${i < done ? 'on' : ''}"></i>`).join('');
    root.querySelectorAll('.lng button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
    if (pop && done > 0 && HAS()) { const el = pbar.children[done - 1]; if (el) gsap.fromTo(el, { scaleY: 1.8, scaleX: 1.3 }, { scaleY: 1, scaleX: 1, duration: .5, ease: 'elastic.out(1,.4)' }); }
  }
  /* صورة مصغّرة لكل مستوى: قطعة لوح عليها أوتاد وشكل */
  const THUMB = [
    { n: 3, kind: 'tri', cols: ['yellow'] }, { n: 6, kind: 'hex', cols: ['purple'] }, { n: 4, kind: 'sq', cols: ['blue', 'red', 'green'] },
    { n: 4, kind: 'disc', cols: ['orange'], lift: .5 }, { n: 3, kind: 'disc', cols: ['pink'], plug: true, lift: .55 },
    { n: 3, kind: 'tri', cols: ['green', 'yellow'] }, { n: 2, kind: 'bar', cols: ['green'], add: true }
  ];
  function miniScene(c, w, h, spec, u) {
    const sv = { U, dpr }; U = u; dpr = 2;
    drawBoardRect(c, w * .1, h * .3, w * .9, h * .86, .14 * U, false, 5, 2);
    const g = mkGroup(spec.n, { cap: 3 }); g.gx = spec.add ? w * .62 : w * .5; g.gy = h * .58;
    spec.cols.forEach((col, i) => { const s = mkShape(spec.n, spec.kind, col, { plug: spec.plug }); s.gx = g.gx; s.gy = g.gy; s.y = spec.lift || i * TH; s.st = 'placed'; s.sc = 1; s.rot = 0; g.shapes.push(s); });
    pegShadows(c, g); g.shapes.slice(0, 1).forEach(s => shapeShadow(c, s));
    drawGroup(c, g);
    if (spec.add) {
      const g2 = mkGroup(1); g2.gx = w * .24; g2.gy = h * .58; pegShadows(c, g2); drawGroup(c, g2);
      burnText(c, '+', w * .4, h * .6, .45 * U, 1);
    }
    U = sv.U; dpr = sv.dpr;
  }
  function openLevels() {
    const pr = loadProg(), grid = root.querySelector('.grid');
    grid.innerHTML = LV.map((V, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lv${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="${App.t('المستوى', 'Level')} ${n}">
        <span class="n">${dg(n)}</span><canvas data-t="${i}"></canvas><b>${V.ic} ${LT(V)}</b>
        <span class="md" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">${V.sub()}</span>
        <span class="s">${[1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    grid.querySelectorAll('canvas[data-t]').forEach(cc => {
      cc.width = 220; cc.height = 152; const c = cc.getContext('2d'); c.scale(2, 2);
      miniScene(c, 110, 76, THUMB[+cc.dataset.t], 46);
    });
    grid.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); if (HAS()) gsap.fromTo(b, { rotation: -8 }, { rotation: 0, duration: .5, ease: 'elastic.out(1,.3)' }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
    if (HAS()) gsap.from(grid.querySelectorAll('.lv'), { y: 24, autoAlpha: 0, duration: .4, stagger: .045, ease: 'back.out(1.6)' });
    const cur = grid.querySelector('.cur');
    requestAnimationFrame(() => { if (cur) grid.scrollTop = Math.max(0, cur.offsetTop - grid.clientHeight / 2); });
  }
  function setLang(l) {
    if (l === lang) return;
    lang = l; store.set('pegsLang', l); Sound.tap();
    langChanged();
  }
  function langChanged() {
    chrome(); if (phase === 'over' && L) winText();
    setPrompt(true); renderBar();
    if (phase === 'play' && !busy) speakPrompt();
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
  spk.addEventListener('click', () => {
    lastAct = Tm;
    if (phase === 'play' || phase === 'intro') speakPrompt();
    if (HAS()) gsap.fromTo(spk, { scale: 1.2 }, { scale: 1, duration: .5, ease: 'elastic.out(1,.4)' });
  });
  prm.addEventListener('click', () => { if (phase === 'play') { speakPrompt(); setPrompt(true); } });

  /* =====================================================================
     الإدخال
     ===================================================================== */
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left - SC.x, y: e.clientY - r.top }; };
  function shapeAt(x, y) {
    const list = shapes.filter(s => s.st === 'tray').sort((a, b) => b.gy - a.gy);
    for (const s of list) {
      const cy = s.gy - (s.y + TH * .5) * HK * U;
      if (Math.hypot(x - s.gx, (y - cy) / GK) < .62 * U * s.sc) return s;
    }
    return null;
  }
  function lift(s, px, py, id) {
    A.kill(s);
    s.st = 'drag'; s.tilt = 0;
    const dcx = s.gx, dcy = s.gy - s.y * HK * U;
    drag = { s, id, px, py, lx: px, off: { x: dcx - px, y: dcy - py } };
    A.to(drag.off, { x: drag.off.x * .4, y: Math.min(drag.off.y, -.3 * U), duration: .25, ease: 'power2.out' });
    A.to(s, { y: LIFT, sc: 1, rot: 0, duration: .26, ease: 'back.out(2)' });
    Sound.tone(470, .06, 'triangle', .12, 160); Sound.noise(.04, 2500, 3500, .06, 4); vibrate(8);
    if (L.key === 'color') say(nameAr(s), nameEn(s));
    lastAct = Tm;
  }
  function release(s) {
    groups.forEach(G => { G.hl = 0; });
    const g = dropTarget(s);
    if (!g) { backToTray(s); return; }
    if (isCorrect(s, g)) place(s, g); else reject(s, g);
  }
  cv.addEventListener('pointerdown', e => {
    if (paused || phase !== 'play' || busy || drag) return;
    const p = pos(e), s = shapeAt(p.x, p.y);
    if (!s) return;
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    lift(s, p.x, p.y, e.pointerId);
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const p = pos(e); drag.px = p.x; drag.py = p.y;
  });
  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const d = drag; drag = null; A.kill(d.off);
    if (e && e.type === 'pointercancel') { backToTray(d.s); return; }
    release(d.s);
  }
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);
  /* لوحة المفاتيح: رقم = يختار الشكل الذي له هذا العدد من الثقوب ويركّبه */
  window.addEventListener('keydown', e => {
    if (App.current !== ID || paused || $('#sheetWrap').classList.contains('on')) return;
    let k = e.key; const ai = AD.indexOf(k); if (ai >= 0) k = String(ai);
    if (k === ' ' || k === 'Enter') { e.preventDefault(); if (phase === 'play') speakPrompt(); return; }
    if (!/^[1-6]$/.test(k) || phase !== 'play' || busy || drag) return;
    const n = +k, Pp = curPrompt();
    const cand = shapes.filter(s => s.st === 'tray' && s.n === n);
    const s = (L.key === 'color' && cand.includes(Pp)) ? Pp : cand[0];
    if (!s) { Sound.error(); return; }
    const g = groups.find(G => !G.fixed && G.n === n && G.shapes.length < G.cap) || groups.find(G => !G.fixed);
    lift(s, s.gx, s.gy, -1); drag = null;
    A.tl().to(s, { gx: g.gx, gy: g.gy + LIFT * HK * U - PH * HK * U * .5, duration: .35, ease: 'power2.inOut' }).call(() => release(s));
  });

  /* =====================================================================
     التحديث والرسم
     ===================================================================== */
  function update(dt) {
    Tm += dt;
    if (!HAS()) fbStep(dt);
    if (drag) {
      const s = drag.s;
      s.gx = drag.px + drag.off.x; s.gy = drag.py + drag.off.y + s.y * HK * U;
      const vx = (drag.px - drag.lx) / Math.max(dt, 1e-3); drag.lx = drag.px;
      s.tilt += (clamp(vx * .0005, -.28, .28) - s.tilt) * Math.min(1, dt * 10);
      const tg = dropTarget(s);
      for (const g of groups) g.hl += ((g === tg ? 1 : 0) - g.hl) * Math.min(1, dt * 14);
    } else for (const g of groups) g.hl *= Math.max(0, 1 - dt * 10);
    shakeA = Math.max(0, shakeA - dt * 4);
    for (const p of parts) {
      p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.g) { p.vy += p.g * dt; p.vx *= .99; p.rot += p.vr * dt; } else { p.vx *= .92; p.vy *= .92; }
    }
    parts = parts.filter(p => p.age < p.life && p.y < Hd + 60);
    if (phase === 'play' && !busy && !drag && Tm - lastAct > 11) { lastAct = Tm; hint(true); }
  }
  function render() {
    const c = ctx; if (!c) return;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.drawImage(bgCv, 0, 0, Wd, Hd);
    if (!R) return;
    c.save();
    const sx = shakeA ? (Math.random() - .5) * shakeA * 4 : 0, sy = shakeA ? (Math.random() - .5) * shakeA * 3 : 0;
    c.translate(SC.x + sx, sy);
    c.drawImage(bdCv, 0, 0, Wd, Hd);
    for (const it of R.items) if (it.sign) burnText(c, it.sign, it.x, it.y, .62 * U, 1);
    for (const g of groups) drawDeco(c, g);
    for (const g of groups) pegShadows(c, g);
    for (const s of shapes) if (!s.grp || s.grp.shapes.indexOf(s) === 0) shapeShadow(c, s);
    const items = [];
    for (const g of groups) items.push([g.gy, g, 0]);
    for (const s of shapes) { if (s.grp) continue; const up = s.st === 'drag' || s.y > .06; items.push([up ? 1e6 + s.y : s.gy, s, 1]); }
    items.sort((a, b) => a[0] - b[0]);
    for (const it of items) { if (it[2]) drawShape(c, it[1]); else drawGroup(c, it[1]); }
    /* فقاعات العدّ فوق الأوتاد */
    for (const g of groups) for (const p of g.pegs) {
      if (p.nb < .02) continue;
      const [x, y] = pegXY(g, p);
      const topY = Math.max(g.pegH, g.shapes.length * TH);
      const bx = x, by = y - topY * HK * U - .3 * U - (1 - p.nb) * .1 * U, r = .15 * U * (.5 + .5 * p.nb);
      c.save(); c.globalAlpha = clamp(p.nb, 0, 1);
      c.fillStyle = 'rgba(80,30,10,.25)'; c.beginPath(); c.arc(bx + 1, by + 3, r, 0, TAU); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(bx, by, r, 0, TAU); c.fill();
      c.lineWidth = Math.max(2, r * .16); c.strokeStyle = '#FF9A2E'; c.stroke();
      c.font = `900 ${r * 1.25}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
      c.fillStyle = '#C25E0C'; c.fillText(dg(p.i + 1), bx, by + r * .1);
      c.restore();
    }
    /* جسيمات */
    for (const p of parts) {
      const a = 1 - p.age / p.life;
      if (p.k === 'd') { c.fillStyle = `rgba(235,215,180,${a * .7})`; c.beginPath(); c.arc(p.x, p.y, p.r * (1 + p.age * 2), 0, TAU); c.fill(); }
      else if (p.k === 'c') { c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.globalAlpha = Math.min(1, a * 2); c.fillStyle = p.col; c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.rot * 1.3))); c.restore(); }
      else if (p.k === 'p') {
        c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.globalAlpha = Math.min(1, a * 2);
        const col = C(p.col);
        c.fillStyle = rgb(mul(col, .7)); c.beginPath(); c.ellipse(0, p.r * .25, p.r, p.r * .6, 0, 0, TAU); c.fill();
        c.fillStyle = rgb(col); c.beginPath(); c.ellipse(0, 0, p.r, p.r * .6, 0, 0, TAU); c.fill();
        c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(-p.r * .3, -p.r * .15, p.r * .35, p.r * .18, 0, 0, TAU); c.fill();
        c.restore();
      }
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
    const g = c.createRadialGradient(s * .5, s * .3, s * .05, s * .5, s * .5, s * .8);
    g.addColorStop(0, '#F6D7DB'); g.addColorStop(1, '#C48F9C');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    const sv = { U, dpr }; U = s * .56; dpr = 2;
    drawBoardRect(c, s * .04, s * .3, s * .96, s * .8, .12 * U, false, 9, 2);
    const g1 = mkGroup(3, { cap: 3 }); g1.gx = s * .56; g1.gy = s * .58;
    const s1 = mkShape(3, 'tri', 'yellow'); Object.assign(s1, { gx: g1.gx, gy: g1.gy, y: .12, sc: 1, rot: 0, st: 'placed' }); g1.shapes.push(s1);
    pegShadows(c, g1); shapeShadow(c, s1); drawGroup(c, g1);
    const s2 = mkShape(4, 'sq', 'blue'); Object.assign(s2, { gx: s * .2, gy: s * .86, y: 0, sc: .45, rot: -.25 });
    shapeShadow(c, s2); drawShape(c, s2);
    U = sv.U; dpr = sv.dpr;
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'لوح الأوتاد', titleEn: 'Peg Board', icon2: '🪵', isNew: true, music: 'shapes',
    desc: () => App.g('ركّبي الأشكال الخشبية على الأوتاد وعُدّي معنا', 'ركّب الأشكال الخشبية على الأوتاد وعُدّ معنا'),
    descEn: () => 'Fit the wooden shapes onto the pegs and count along',
    helpEn: () => [
      '🪵 Drag the colored shape onto the group of pegs that matches its number of holes',
      '🔢 When it fits we count the pegs together: one, two, three…',
      '🗼 Levels: match the holes, shape tower, count by ear, numbers, colors & shapes, and adding',
      '🔊 The yellow button repeats the question, and «عربي / English» switches the spoken language and digits',
      '⭐ Finish a level with no mistakes to get 3 stars; ✕ opens the levels'
    ],
    help: () => [
      '🪵 ' + App.g('اسحبي', 'اسحب') + ' الشكل الملوّن ' + App.g('وضعيه', 'وضعه') + ' على مجموعة الأوتاد التي عددها يساوي عدد ثقوبه',
      '🔢 عند التركيب نعدّ الأوتاد معًا: واحد، اثنان، ثلاثة…',
      '🗼 المستويات: مطابقة الثقوب، برج الأشكال، العدّ بالسمع، الأرقام، الألوان والأشكال، والجمع',
      '🔊 الزر الأصفر يعيد السؤال، و«عربي / English» يبدّل لغة النطق والأرقام',
      '⭐ ' + App.g('أكملي', 'أكمل') + ' المستوى دون أخطاء ' + App.g('لتحصلي', 'لتحصل') + ' على ٣ نجوم، و✕ يفتح المستويات'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🪵 ${ks.length}/${NL} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      lang = App.gameLang(ID);
      const pr = loadProg();
      let n = 1; for (let i = 1; i <= pr.unlocked; i++) { n = i; if (!pr.stars[i]) break; }
      layout();
      startLevel(n);
      render(); startLoop();
    },
    onLang(l) { if (l === lang) { chrome(); if (phase === 'over' && L) winText(); if (lvOv.classList.contains('on')) openLevels(); return; } lang = l; langChanged(); },
    leave() { stopLoop(); A.killAll(); drag = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; A.pause(); if (drag) { const s = drag.s; drag = null; backToTray(s); } },
    resume() { paused = false; last = performance.now(); A.resume(); },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    },
    /* للاختبار الآلي */
    _state() {
      return { lvl, round, phase, busy, done, total, mistakes, U, prompt: (p => p == null ? null : typeof p === 'object' ? p.n : p)(curPrompt()), promptShape: curPrompt() && typeof curPrompt() === 'object' ? shapes.indexOf(curPrompt()) : -1,
        shapes: shapes.map(s => ({ n: s.n, kind: s.kind, col: s.col, st: s.st, x: s.gx + SC.x, y: s.gy - (s.y + TH * .5) * HK * U, placed: !!s.grp })),
        groups: groups.map(g => ({ n: g.n, fixed: g.fixed, x: g.gx + SC.x, y: g.gy - PH * HK * U * .5, filled: g.shapes.length })) };
    },
    _start: n => startLevel(n)
  });
})();
