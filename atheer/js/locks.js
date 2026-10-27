/* =====================================================================
   المفاتيح والأقفال — صندوق خشبي فيه أبواب صغيرة مقفلة بأقفال ملوّنة
   اسحب المفتاح المناسب إلى القفل، أدِره… فينفتح الباب عن مفاجأة!
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'locks';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,"Segoe UI",Tahoma,sans-serif';
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  /* ---------- الألوان والأشكال ---------- */
  const COLORS = {
    red:    { g: ['#FFA3A3', '#F03E3E', '#A61B1B'], ar: 'أحمر', arf: 'حمراء', en: 'Red' },
    blue:   { g: ['#A6D4FF', '#2F8CF0', '#134E9C'], ar: 'أزرق', arf: 'زرقاء', en: 'Blue' },
    green:  { g: ['#B4F0A0', '#38B048', '#1A6B26'], ar: 'أخضر', arf: 'خضراء', en: 'Green' },
    yellow: { g: ['#FFF4B0', '#FFC81F', '#C98A00'], ar: 'أصفر', arf: 'صفراء', en: 'Yellow' },
    orange: { g: ['#FFD0A0', '#FF8A1F', '#B85200'], ar: 'برتقالي', arf: 'برتقالية', en: 'Orange' },
    purple: { g: ['#DDBDFF', '#9A55F0', '#55249C'], ar: 'بنفسجي', arf: 'بنفسجية', en: 'Purple' },
    pink:   { g: ['#FFC6E4', '#FF5FAE', '#B0226E'], ar: 'وردي', arf: 'وردية', en: 'Pink' }
  };
  const BRASS = ['#FFF3BF', '#E9B949', '#94640E'];
  const STEEL = ['#FFFFFF', '#BAC6D2', '#5E6C7A'];
  const TEAL = ['#A8F0E6', '#1FB3A0', '#0B6B60'];
  const SHAPES = {
    heart:    { ar: 'قلب', f: false, en: 'Heart' },
    star:     { ar: 'نجمة', f: true, en: 'Star' },
    circle:   { ar: 'دائرة', f: true, en: 'Circle' },
    triangle: { ar: 'مثلث', f: false, en: 'Triangle' },
    square:   { ar: 'مربع', f: false, en: 'Square' },
    moon:     { ar: 'هلال', f: false, en: 'Moon' }
  };

  /* ---------- المفاجآت خلف الأبواب ---------- */
  const ITEMS = [
    { e: '🐱', ar: 'قطة', en: 'Cat' }, { e: '🐶', ar: 'كلب', en: 'Dog' }, { e: '🐟', ar: 'سمكة', en: 'Fish' },
    { e: '🦁', ar: 'أسد', en: 'Lion' }, { e: '🐯', ar: 'نمر', en: 'Tiger' }, { e: '🦓', ar: 'حمار وحشي', en: 'Zebra' },
    { e: '🐳', ar: 'حوت', en: 'Whale' }, { e: '🐰', ar: 'أرنب', en: 'Rabbit' }, { e: '🐼', ar: 'باندا', en: 'Panda' },
    { e: '🐧', ar: 'بطريق', en: 'Penguin' }, { e: '🦆', ar: 'بطة', en: 'Duck' },
    { e: '🍎', ar: 'تفاحة', en: 'Apple' }, { e: '🍌', ar: 'موزة', en: 'Banana' }, { e: '🍓', ar: 'فراولة', en: 'Strawberry' },
    { e: '🍇', ar: 'عنب', en: 'Grapes' }, { e: '🍊', ar: 'برتقالة', en: 'Orange' }, { e: '🍉', ar: 'بطيخ', en: 'Watermelon' },
    { e: '⚽', ar: 'كرة', en: 'Ball' }, { e: '🧸', ar: 'دبدوب', en: 'Teddy bear' }, { e: '🎈', ar: 'بالون', en: 'Balloon' },
    { e: '🚗', ar: 'سيارة', en: 'Car' }, { e: '🥁', ar: 'طبل', en: 'Drum' }, { e: '🍦', ar: 'آيس كريم', en: 'Ice cream' },
    { e: '🌈', ar: 'قوس قزح', en: 'Rainbow' }, { e: '🎁', ar: 'هدية', en: 'Gift' }
  ];

  /* ---------- المستويات ----------
     m: color (لون) / shape (شكل) / combo (لون + شكل) / num (رقم المفتاح = نقاط القفل)
     n: عدد الأبواب، x: مفاتيح زائدة متشابهة، max: أكبر رقم */
  const LEVELS = [
    { m: 'color', n: 2, x: 0 },
    { m: 'color', n: 3, x: 0 },
    { m: 'shape', n: 3, x: 0 },
    { m: 'color', n: 4, x: 1 },
    { m: 'shape', n: 4, x: 1 },
    { m: 'combo', n: 3, x: 1 },
    { m: 'num', n: 3, x: 0, max: 3 },
    { m: 'combo', n: 4, x: 2 },
    { m: 'num', n: 4, x: 1, max: 5 },
    { m: 'combo', n: 5, x: 1 },
    { m: 'num', n: 5, x: 1, max: 6 },
    { m: 'combo', n: 6, x: 1 }
  ];
  const MODE_ICON = { color: '🎨', shape: '⭐', combo: '🎨⭐', num: '🔢' };

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    outElastic: t => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (TAU / 3)) + 1
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function rng(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
  const loadProg = () => { const p = store.get('locksProg', null) || {}; return { stars: p.stars || {}, unlocked: p.unlocked || 1 }; };
  let lang = 'ar';
  const num = n => lang === 'ar' ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
  const NUM_AR = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
  const NUM_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

  /* ---------- النطق ---------- */
  const say = (ar, en) => lang === 'ar' ? App.speak(ar) : App.speak(en, 'en');
  function descAr(o) {
    if (def.m === 'color') return COLORS[o.c].ar;
    if (def.m === 'shape') return SHAPES[o.s].ar;
    if (def.m === 'num') return NUM_AR[o.n];
    const S = SHAPES[o.s]; return S.ar + ' ' + (S.f ? COLORS[o.c].arf : COLORS[o.c].ar);
  }
  function descEn(o) {
    if (def.m === 'color') return COLORS[o.c].en;
    if (def.m === 'shape') return SHAPES[o.s].en;
    if (def.m === 'num') return NUM_EN[o.n];
    return COLORS[o.c].en + ' ' + SHAPES[o.s].en.toLowerCase();
  }
  const sayDesc = o => say(descAr(o), descEn(o));
  const sayKey = o => def.m === 'num' ? sayDesc(o) : say('مفتاح ' + descAr(o), descEn(o) + ' key');
  const sayIntro = () => say(App.g('اسحبي المفتاح إلى القفل', 'اسحب المفتاح إلى القفل'), 'Drag the key to the lock');
  const sayTurn = () => say(App.g('أديري المفتاح', 'أدر المفتاح'), 'Turn the key');
  const sayTry = () => say(App.g('حاولي مرة أخرى', 'حاول مرة أخرى'), 'Try again!');
  const sayGood = () => say(App.g('أحسنت!', 'أحسنت!'), 'Well done!');
  const sayItem = it => say('مفاجأة! ' + it.ar, 'Surprise! ' + it.en);

  /* ---------- رسم الأشكال ---------- */
  function rpoly(c, pts, r) {
    c.beginPath();
    for (let i = 0; i < pts.length; i++) {
      const p0 = pts[(i + pts.length - 1) % pts.length], p1 = pts[i], p2 = pts[(i + 1) % pts.length];
      const m0 = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
      if (i === 0) c.moveTo(m0[0], m0[1]);
      c.arcTo(p1[0], p1[1], (p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, r);
    }
    c.closePath();
  }
  /* مسار شكل مركزه (0,0) ونصف قطره التقريبي r */
  function shapePath(c, s, r) {
    if (s === 'circle') { c.beginPath(); c.arc(0, 0, r * .92, 0, TAU); return; }
    if (s === 'square') { c.beginPath(); c.roundRect(-r * .82, -r * .82, r * 1.64, r * 1.64, r * .28); return; }
    if (s === 'triangle') { rpoly(c, [[0, -r * 1.02], [r * 1.02, r * .78], [-r * 1.02, r * .78]], r * .24); return; }
    if (s === 'star') {
      const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .5 : r * 1.06; pts.push([Math.cos(a) * rr, Math.sin(a) * rr + r * .06]); }
      rpoly(c, pts, r * .12); return;
    }
    if (s === 'heart') {
      const k = r * 1.05; c.beginPath(); c.moveTo(0, k * .82);
      c.bezierCurveTo(-k * 1.25, -k * .05, -k * .62, -k * 1.02, 0, -k * .42);
      c.bezierCurveTo(k * .62, -k * 1.02, k * 1.25, -k * .05, 0, k * .82); c.closePath(); return;
    }
    if (s === 'moon') {
      const R = r * .98, d = R * .55, r2 = R * .82, rot = -.5;
      const xi = (d * d + R * R - r2 * r2) / (2 * d), yi = Math.sqrt(Math.max(0, R * R - xi * xi));
      const a = Math.atan2(yi, xi), b1 = Math.atan2(yi, xi - d), b2 = Math.atan2(-yi, xi - d);
      c.beginPath(); c.arc(0, 0, R, a + rot, TAU - a + rot, false);
      c.arc(Math.cos(rot) * d, Math.sin(rot) * d, r2, b2 + rot, b1 + rot, true); c.closePath(); return;
    }
    c.beginPath(); c.arc(0, 0, r, 0, TAU);
  }
  function grad3(c, x, y, r, g) {
    const gr = c.createRadialGradient(x - r * .45, y - r * .55, r * .08, x, y, r * 1.25);
    gr.addColorStop(0, g[0]); gr.addColorStop(.5, g[1]); gr.addColorStop(1, g[2]); return gr;
  }
  function lin(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; }
  /* نقاط النرد داخل مربع نصف ضلعه r */
  function dicePts(n, r) {
    const a = r * .58, P = { c: [0, 0], tl: [-a, -a], tr: [a, -a], bl: [-a, a], br: [a, a], ml: [-a, 0], mr: [a, 0] };
    const L = { 1: ['c'], 2: ['tl', 'br'], 3: ['tl', 'c', 'br'], 4: ['tl', 'tr', 'bl', 'br'], 5: ['tl', 'tr', 'c', 'bl', 'br'], 6: ['tl', 'tr', 'ml', 'mr', 'bl', 'br'] };
    return (L[n] || L[1]).map(k => P[k]);
  }

  /* ---------- القفل ----------
     (x,y) مركز جسم القفل، L عرضه. lift: ارتفاع الحلقة عند الفتح */
  function lockGrad(o) { return def.m === 'color' || def.m === 'combo' ? COLORS[o.c].g : def.m === 'num' ? TEAL : BRASS; }
  function drawLock(c, o, x, y, L, opt = {}) {
    const w = L, h = L * .84, lift = opt.lift || 0, g = opt.g || lockGrad(o);
    c.save(); c.translate(x, y); if (opt.rot) c.rotate(opt.rot);
    if (opt.sc) c.scale(opt.sc, opt.sc);
    // الحلقة المعدنية
    const sw = w * .64, sh = h * .78, th = w * .13, sy = -h * .42 - lift * h * .3;
    c.lineCap = 'round';
    c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = th + 3;
    c.beginPath(); c.moveTo(-sw / 2, sy + sh * .55 + 4); c.lineTo(-sw / 2, sy); c.arc(0, sy, sw / 2, Math.PI, 0); c.lineTo(sw / 2, -h * .42 + (lift ? 0 : 4) + 2); c.stroke();
    c.strokeStyle = lin(c, -sw / 2, 0, sw / 2, 0, ['#8A96A3', '#F5F8FB', '#9AA6B2', '#E6ECF2', '#6F7C89']); c.lineWidth = th;
    c.beginPath(); c.moveTo(-sw / 2, sy + sh * .55); c.lineTo(-sw / 2, sy); c.arc(0, sy, sw / 2, Math.PI, 0); c.lineTo(sw / 2, -h * .42 + (lift ? -lift * h * .06 : 2)); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = th * .25;
    c.beginPath(); c.arc(0, sy, sw / 2 - th * .1, Math.PI * 1.15, Math.PI * 1.6); c.stroke();
    // الجسم
    c.save(); c.shadowColor = 'rgba(40,20,0,.35)'; c.shadowBlur = L * .12; c.shadowOffsetY = L * .06;
    c.fillStyle = g[2]; c.beginPath(); c.roundRect(-w / 2, -h / 2 + h * .06, w, h, w * .2); c.fill(); c.restore();
    c.fillStyle = lin(c, 0, -h / 2, 0, h / 2, [g[0], g[1], g[1], g[2]]);
    c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h * .96, w * .2); c.fill();
    // لمعة الحافة
    c.fillStyle = 'rgba(255,255,255,.38)'; c.beginPath(); c.roundRect(-w / 2 + w * .07, -h / 2 + h * .05, w * .86, h * .18, h * .09); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = Math.max(1.5, w * .025); c.beginPath(); c.roundRect(-w / 2 + 1.5, -h / 2 + 1.5, w - 3, h * .96 - 3, w * .19); c.stroke();
    // الشعار: شكل أو نقاط
    const ey = -h * .06;
    if (def.m === 'shape' || def.m === 'combo') {
      c.save(); c.translate(0, ey); c.fillStyle = 'rgba(0,0,0,.22)'; c.translate(0, w * .025); shapePath(c, o.s, w * .2); c.fill(); c.restore();
      c.save(); c.translate(0, ey);
      c.fillStyle = def.m === 'combo' ? '#fff' : lin(c, 0, -w * .2, 0, w * .2, ['#FFFDF0', '#FFE38A']);
      shapePath(c, o.s, w * .2); c.fill();
      if (def.m === 'shape') { c.strokeStyle = g[2]; c.lineWidth = Math.max(1.5, w * .03); c.stroke(); }
      c.restore();
    } else if (def.m === 'num') {
      for (const [px, py] of dicePts(o.n, w * .24)) {
        c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.arc(px, ey + py + w * .02, w * .07, 0, TAU); c.fill();
        c.fillStyle = '#fff'; c.beginPath(); c.arc(px, ey + py, w * .07, 0, TAU); c.fill();
      }
    }
    // ثقب المفتاح
    const ky = h * .27;
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.arc(0, ky + 1.5, w * .1, 0, TAU); c.fill();
    c.fillStyle = '#2A1A0A'; c.beginPath(); c.arc(0, ky, w * .075, 0, TAU); c.moveTo(-w * .035, ky); c.lineTo(-w * .05, ky + w * .14); c.lineTo(w * .05, ky + w * .14); c.lineTo(w * .035, ky); c.fill();
    c.restore();
  }
  const keyholeOff = L => L * .84 * .27;

  /* ---------- المفتاح ----------
     الأصل (0,0) = حلقة التعليق في الأعلى، والمفتاح يتدلّى نحو الأسفل.
     b: نصف حجم رأس المفتاح. cut: لا يُرسم ما بعد هذا العمق (للمفتاح داخل القفل) */
  const KEY = { bowY: 1.18, shaft0: 2.0, len: 4.25 };
  function keyGrad(o) { return def.m === 'color' || def.m === 'combo' ? COLORS[o.c].g : def.m === 'num' ? BRASS : STEEL; }
  function keyShape(o) { return def.m === 'shape' || def.m === 'combo' ? o.s : 'circle'; }
  function drawKey(c, o, x, y, b, ang, opt = {}) {
    const g = keyGrad(o), sh = keyShape(o), metal = def.m === 'num' ? BRASS : STEEL;
    c.save(); c.translate(x, y); c.rotate(ang || 0); if (opt.sc) c.scale(opt.sc, opt.sc);
    if (opt.cut != null) { c.beginPath(); c.rect(-b * 3, -b * 3, b * 6, b * 3 + opt.cut); c.clip(); }
    const by = b * KEY.bowY;
    // الساق والأسنان
    const s0 = b * KEY.shaft0 - b * .2, s1 = b * KEY.len, sw = b * .36;
    c.save(); c.shadowColor = 'rgba(30,15,0,.3)'; c.shadowBlur = b * .3; c.shadowOffsetY = b * .15;
    c.fillStyle = lin(c, -sw / 2, 0, sw / 2, 0, [metal[2], metal[0], metal[1], metal[2]]);
    c.beginPath(); c.roundRect(-sw / 2, s0, sw, s1 - s0, sw * .4); c.fill();
    // الأسنان
    c.beginPath(); c.moveTo(sw / 2 - 1, s1 - b * 1.05); c.lineTo(sw / 2 + b * .38, s1 - b * 1.05); c.lineTo(sw / 2 + b * .38, s1 - b * .78);
    c.lineTo(sw / 2 + b * .2, s1 - b * .72); c.lineTo(sw / 2 + b * .2, s1 - b * .5); c.lineTo(sw / 2 + b * .42, s1 - b * .45); c.lineTo(sw / 2 + b * .42, s1 - b * .12);
    c.lineTo(sw / 2 - 1, s1 - b * .05); c.closePath(); c.fill();
    c.restore();
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.roundRect(-sw * .22, s0 + b * .1, sw * .2, s1 - s0 - b * .3, sw * .1); c.fill();
    // رقبة الرأس
    c.fillStyle = lin(c, -b * .3, 0, b * .3, 0, [metal[2], metal[0], metal[2]]);
    c.beginPath(); c.roundRect(-b * .3, by + b * .62, b * .6, b * .32, b * .1); c.fill();
    // حلقة التعليق
    c.strokeStyle = lin(c, -b * .3, 0, b * .3, 0, [metal[2], metal[0], metal[2]]); c.lineWidth = b * .14;
    c.beginPath(); c.arc(0, b * .02, b * .22, 0, TAU); c.stroke();
    // الرأس (اللون/الشكل)
    c.save(); c.translate(0, by);
    c.save(); c.shadowColor = 'rgba(30,15,0,.32)'; c.shadowBlur = b * .35; c.shadowOffsetY = b * .16;
    c.fillStyle = g[2]; shapePath(c, sh, b); c.fill(); c.restore();
    c.fillStyle = grad3(c, 0, 0, b, g); shapePath(c, sh, b * .92); c.fill();
    c.save(); shapePath(c, sh, b * .92); c.clip();
    c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.ellipse(-b * .25, -b * .45, b * .55, b * .28, -.4, 0, TAU); c.fill();
    c.restore();
    c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = Math.max(1.5, b * .1); shapePath(c, sh, b * .92); c.stroke();
    if (def.m === 'num') {
      c.font = `900 ${b * 1.15}px ${lang === 'ar' ? FONT : 'system-ui,"Segoe UI",sans-serif'}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.lineWidth = b * .16; c.strokeStyle = 'rgba(120,70,0,.55)'; c.strokeText(num(o.n), 0, b * .08);
      c.fillStyle = '#fff'; c.fillText(num(o.n), 0, b * .08);
    } else {
      // ثقب صغير في الرأس
      c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.arc(0, -b * .35, b * .15, 0, TAU); c.fill();
    }
    c.restore();
    c.restore();
  }

  /* ---------- المفاجآت (رمز بحافة بيضاء) ---------- */
  const bakeCache = new Map();
  function bake(e, size) {
    const px = Math.max(8, Math.round(size * dpr)), key = e + '|' + px;
    let c = bakeCache.get(key); if (c) return c;
    const pad = Math.round(px * .15), S = px + pad * 2;
    const g = mk(S, S), x = g.getContext('2d');
    x.font = `${Math.round(px * .86)}px ${EMOJI_FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(e, S / 2, S / 2 + px * .04);
    const sil = mk(S, S), sx = sil.getContext('2d');
    sx.drawImage(g, 0, 0); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = '#fff'; sx.fillRect(0, 0, S, S);
    c = mk(S, S); const cx = c.getContext('2d');
    const r = Math.max(2, px * .045);
    cx.save(); cx.shadowColor = 'rgba(40,20,0,.3)'; cx.shadowBlur = px * .05; cx.shadowOffsetY = px * .025;
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; cx.drawImage(sil, Math.cos(a) * r, Math.sin(a) * r); }
    cx.restore();
    cx.drawImage(g, 0, 0);
    if (bakeCache.size > 120) bakeCache.clear();
    bakeCache.set(key, c);
    return c;
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #locks{background:#F6D7B0;overflow:hidden;color:#4A2A10}
  #locks canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #locks .ib{color:#9A5A1E}
  #locks .lang{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 rgba(120,60,10,.22),0 8px 16px rgba(80,40,10,.18)}
  #locks .lang button{min-width:66px;padding:6px 12px;border-radius:99px;font-weight:900;font-size:17px;background:#FBF1E4;color:#9A5A1E;line-height:1.25}
  #locks .lang button[data-l=en]{font-family:system-ui,"Segoe UI",sans-serif;font-size:16px}
  #locks .lang button.on{background:linear-gradient(#FFB54D,#F07F12);color:#fff;box-shadow:0 3px 0 #B85A00;text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #locks .prog{position:absolute;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 58px);display:flex;gap:5px;padding:6px 10px;background:rgba(255,255,255,.92);border-radius:99px;z-index:4;box-shadow:0 3px 0 rgba(120,60,10,.12),0 6px 14px rgba(80,40,10,.12)}
  #locks .prog i{width:26px;height:11px;border-radius:6px;background:#EBDCCB;box-shadow:inset 0 2px 0 rgba(0,0,0,.08);transition:background .3s}
  #locks .prog i.on{background:linear-gradient(#FFC861,#FF8A1F);box-shadow:0 2px 0 #D06A00;animation:lkPop .45s cubic-bezier(.3,1.8,.5,1)}
  @keyframes lkPop{40%{transform:scale(1.5,1.3)}}
  #locks .sayb{position:absolute;z-index:5;width:62px;height:62px;flex:none;font-size:28px;bottom:max(14px,env(safe-area-inset-bottom));left:max(14px,env(safe-area-inset-left))}
  #locks .hint{top:calc(max(10px,env(safe-area-inset-top)) + 94px)}
  #locks .hint span{color:#8A4A10}
  #locks .overlay{background:radial-gradient(circle at 50% 45%,rgba(90,45,10,.25),rgba(60,30,5,.55))}
  #locks .panel{border:5px solid #FFE1B8;box-shadow:0 8px 0 #E8A860,0 20px 40px rgba(80,40,0,.3);color:#5A3410}
  #locks .panel h3{color:#E07012;text-shadow:0 3px 0 #FFE6C4}
  #locks .btn{background:linear-gradient(#FFB54D,#F07F12);box-shadow:0 5px 0 #B85A00,0 8px 12px rgba(180,90,0,.25)}
  #locks .btn:active{box-shadow:0 1px 0 #B85A00}
  #locks .btn.alt{background:#fff;color:#C2650E;box-shadow:0 5px 0 #F5CF9E;border:3px solid #FFE6C4}
  #locks .wpair{white-space:nowrap;font-size:40px;line-height:1.15;margin:2px 0;font-family:${EMOJI_FONT}}
  #locks .lvp{width:min(94vw,440px);max-height:88vh;overflow-y:auto;touch-action:pan-y}
  #locks .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:10px 0 12px}
  #locks .lvb{position:relative;aspect-ratio:.9;border-radius:20px;background:#fff;border:3px solid #FFE1B8;box-shadow:0 5px 0 #F0C287;
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#9A5A1E;font-weight:900;padding:2px}
  #locks .lvb:active{transform:translateY(3px);box-shadow:0 2px 0 #F0C287}
  #locks .lvb .n{font-size:13px;position:absolute;top:2px;right:8px;opacity:.7}
  #locks .lvb .e{font-size:22px;line-height:1.3;font-family:${EMOJI_FONT};white-space:nowrap}
  #locks .lvb .d{font-size:12px;line-height:1;opacity:.8}
  #locks .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:12px;margin-top:3px}
  #locks .lvb .s i{font-style:normal}
  #locks .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #locks .lvb.cur{outline:3px solid #FF8A1F;outline-offset:2px}
  #locks .lvb.lock{background:#F3EDE6;border-color:#E6DCD0;box-shadow:0 5px 0 #D6C8B8;color:#A89A8A}
  #locks .lvb.lock .e{filter:grayscale(1);opacity:.35}
  #locks .lvb.lock::after{content:'🔒';position:absolute;font-size:16px;bottom:2px}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🔢</button>
      <span class="grow"></span>
      <div class="lang"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="prog"></div>
    <button class="ib snd sayb" aria-label="اسمع مرة أخرى">🔊</button>
    <div class="hint"><span class="hintT"></span></div>
    <div class="overlay" id="lkLv"><div class="panel lvp"><h3>🔢 المستويات</h3><div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="lkWin"><div class="panel">
      <h3 class="wT"></h3><div class="wpair"></div><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const progEl = root.querySelector('.prog'), sayBtn = root.querySelector('.sayb');
  const hintEl = root.querySelector('.hint'), hintT = root.querySelector('.hintT');
  const lvOv = root.querySelector('#lkLv'), winOv = root.querySelector('#lkWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, portrait = true;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, def = LEVELS[0];
  let doors = [], keys = [], parts = [], rings = [], tasks = [], falling = [];
  let opened = 0, mistakes = 0, over = false, drag = null, turnDrag = null, idleT = 0, shake = 0, helpHand = null;
  let board = { x: 0, y: 0, w: 0, h: 0 }, ring = { x: 0, y: 0, rx: 0, ry: 0 }, KB = 24, bgLayer = null, bgKey = '';
  const later = (s, fn) => tasks.push({ t: s, fn });

  /* ---------- بناء المستوى ---------- */
  function genLocks() {
    const n = def.n, x = def.x || 0;
    const cols = shuffle(Object.keys(COLORS)), shs = shuffle(Object.keys(SHAPES));
    let locks = [], extras = [];
    if (def.m === 'color') {
      locks = cols.slice(0, n).map(c => ({ c, s: 'circle', n: 0 }));
      extras = cols.slice(n, n + x).map(c => ({ c, s: 'circle', n: 0 }));
    } else if (def.m === 'shape') {
      locks = shs.slice(0, n).map(s => ({ c: 'yellow', s, n: 0 }));
      extras = shs.slice(n, n + x).map(s => ({ c: 'yellow', s, n: 0 }));
    } else if (def.m === 'num') {
      const ns = shuffle(Array.from({ length: def.max }, (_, i) => i + 1));
      locks = ns.slice(0, n).map(v => ({ c: 'yellow', s: 'circle', n: v }));
      extras = ns.slice(n, n + x).map(v => ({ c: 'yellow', s: 'circle', n: v }));
    } else {
      // لون + شكل: شبكة صغيرة حتى تتشابه المفاتيح (نفس اللون بشكل آخر، أو نفس الشكل بلون آخر)
      const nc = n <= 3 ? 2 : 3, ns = n <= 4 ? 2 : 3;
      const grid = []; for (const c of cols.slice(0, nc)) for (const s of shs.slice(0, ns)) grid.push({ c, s, n: 0 });
      shuffle(grid);
      // نضمن تكرار كل لون/شكل قدر الإمكان
      locks = grid.slice(0, n); extras = grid.slice(n, n + x);
      if (extras.length < x) {
        const more = shuffle(Object.keys(COLORS).filter(c => !cols.slice(0, nc).includes(c)));
        for (let i = extras.length; i < x; i++) extras.push({ c: more[i] || 'pink', s: locks[i % locks.length].s, n: 0 });
      }
    }
    locks.forEach((o, i) => { o.id = i; });
    extras.forEach((o, i) => { o.id = 100 + i; });
    return { locks, extras };
  }
  const same = (a, b) => a.c === b.c && a.s === b.s && a.n === b.n;

  function startLevel(n) {
    lvl = clamp(n, 1, LEVELS.length); def = LEVELS[lvl - 1];
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    tasks = []; parts = []; rings = []; falling = []; drag = null; turnDrag = null; over = false; mistakes = 0; opened = 0; idleT = 0; helpHand = null;
    const { locks, extras } = genLocks();
    const items = shuffle(ITEMS.slice());
    doors = locks.map((o, i) => ({ o, item: items[i], state: 'locked', t: 0, open: 0, turn: 0, lift: 0, shk: 0, glow: 0, pop: 0, hover: false, errs: 0, itemPop: 0, intro: -i * .08, x: 0, y: 0, w: 0, h: 0 }));
    keys = shuffle(locks.concat(extras).map(o => ({ o, state: 'hang', x: 0, y: 0, hx: 0, hy: 0, ang: 0, av: 0, sc: 1, door: null, pop: 0, glow: 0, wig: 0 })));
    keys.forEach((k, i) => { k.ang = (i % 2 ? 1 : -1) * .25; });
    bgKey = '';
    layout();
    setProg();
    showHint(introHint());
    later(.5, sayIntro);
    Sound.whoosh();
  }
  const introHint = () => lang === 'ar' ? '👆 ' + App.g('اسحبي', 'اسحب') + ' المفتاح المناسب إلى القفل' : '👆 Drag the matching key to the lock';
  function showHint(t) { hintT.textContent = t; hintEl.style.opacity = 1; }
  function hideHint() { hintEl.style.opacity = 0; }
  function setProg() {
    progEl.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    progEl.innerHTML = doors.map((_, i) => `<i class="${i < opened ? 'on' : ''}"></i>`).join('');
  }
  function bumpProg() { const i = progEl.children[opened - 1]; if (i) i.classList.add('on'); }

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    portrait = W / H < 1.05;
    const top = progEl.getBoundingClientRect().bottom + 56;
    const bw = Math.min(W - 20, portrait ? 620 : 1000);
    const keysH = portrait ? clamp(H * .27, 170, 260) : clamp(H * .36, 150, 300);
    board = { x: (W - bw) / 2, y: top, w: bw, h: Math.max(140, H - top - keysH - 12) };
    // شبكة الأبواب: نختار عدد الأعمدة الذي يعطي أكبر باب
    const n = doors.length, pad = Math.min(bw, board.h) * .06;
    const iw = bw - pad * 2, ih = board.h - pad * 2;
    let best = null;
    for (let cols = 1; cols <= n; cols++) {
      const rows = Math.ceil(n / cols), cw = iw / cols, ch = ih / rows;
      const dw = Math.min(cw * .84, ch * .84 * .8), dh = dw / .8;
      if (!best || dw > best.dw) best = { cols, rows, cw, ch, dw, dh };
    }
    const { cols, rows, cw, ch } = best;
    const dw = Math.min(best.dw, 230), dh = dw / .8;
    doors.forEach((d, i) => {
      const r = Math.floor(i / cols), inRow = Math.min(cols, n - r * cols), c = i - r * cols;
      const rowW = inRow * cw, x0 = board.x + pad + (iw - rowW) / 2;
      const cx = x0 + cw * (c + .5), cy = board.y + pad + ih / 2 + (r - (rows - 1) / 2) * ch;
      d.w = dw; d.h = dh; d.x = cx - dw / 2; d.y = cy - dh / 2;
      d.L = Math.min(dw * .46, dh * .36);
      d.lx = d.x + dw * .8; d.ly = d.y + dh * .5;
    });
    // حلقة المفاتيح
    const nk = keys.length;
    const ky = board.y + board.h + 22;
    ring.rx = Math.min(W * .44, Math.max(110, nk * (portrait ? 46 : 70) / 2 + 30), 420); ring.ry = Math.max(14, ring.rx * .09);
    ring.x = W / 2; ring.y = ky + ring.ry;
    const zig = portrait && nk > 5;
    const span = ring.rx * 1.7, sp = span / Math.max(1, nk);
    const avail = H - ring.y - Math.max(14, parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 14) - 10;
    KB = clamp(Math.min(sp * (zig ? .62 : .4), avail / (KEY.len + (zig ? 1.9 : 1.1))), 14, 34);
    keys.forEach((k, i) => {
      const dx = -span / 2 + sp * (i + .5);
      const yy = ring.y + ring.ry * Math.sqrt(Math.max(0, 1 - (dx / ring.rx) ** 2));
      k.hx = ring.x + dx; k.hy = yy + 4 + (zig && i % 2 ? KB * 1.7 : 0); k.chain = zig && i % 2 ? KB * 1.7 : 0; k.ry = yy;
      if (k.state === 'hang') { k.x = k.hx; k.y = k.hy; }
    });
    // مواضع المفاتيح المركّبة داخل الأقفال
    doors.forEach(d => { if (d.key) placeInKey(d); });
    buildBg();
  }
  function placeInKey(d) {
    const k = d.key; const s = d.L * .3 / KB;
    k.isc = s;
  }

  /* ---------- الخلفية: جدار + لوح خشبي ---------- */
  function wood(x, X, Y, w, h, r, base, seed) {
    const R = rng(seed);
    x.save(); x.beginPath(); x.roundRect(X, Y, w, h, r); x.clip();
    x.fillStyle = lin(x, X, Y, X, Y + h, base); x.fillRect(X, Y, w, h);
    x.globalAlpha = .18; x.strokeStyle = '#7A4210'; x.lineWidth = 1.4;
    for (let i = 0; i < h / 7; i++) {
      const yy = Y + i * 7 + R() * 4; x.beginPath(); x.moveTo(X, yy);
      for (let xx = X; xx <= X + w; xx += 24) x.lineTo(xx, yy + Math.sin(xx * .02 + i) * 2 + R() * 1.2);
      x.stroke();
    }
    x.globalAlpha = .12; x.fillStyle = '#5A2E05';
    for (let i = 0; i < 4; i++) { const kx = X + R() * w, ky = Y + R() * h; x.beginPath(); x.ellipse(kx, ky, 9 + R() * 8, 3 + R() * 3, 0, 0, TAU); x.fill(); }
    x.restore();
  }
  function screw(x, cx, cy, r) {
    x.fillStyle = grad3(x, cx, cy, r, ['#FFFFFF', '#C6CDD4', '#6E7781']); x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill();
    x.strokeStyle = 'rgba(60,60,60,.6)'; x.lineWidth = r * .3; x.beginPath(); x.moveTo(cx - r * .6, cy - r * .2); x.lineTo(cx + r * .6, cy + r * .2); x.stroke();
  }
  function buildBg() {
    const key = W + 'x' + H + '|' + dpr + '|' + doors.length + '|' + keys.length;
    if (bgKey === key && bgLayer) return;
    bgKey = key;
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    // جدار الغرفة: ورق حائط دافئ بنقاط ونجوم
    let g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#FFE9CC'); g.addColorStop(1, '#F7CFA0');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = 'rgba(255,255,255,.35)';
    for (let yy = 12; yy < H; yy += 34) for (let xx = (yy / 34 % 2) * 17 + 8; xx < W; xx += 34) { x.beginPath(); x.arc(xx, yy, 3, 0, TAU); x.fill(); }
    g = x.createRadialGradient(W / 2, H * .45, 10, W / 2, H * .45, Math.max(W, H) * .7); g.addColorStop(0, 'rgba(255,255,255,.25)'); g.addColorStop(1, 'rgba(150,80,20,.18)');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // اللوح الخشبي (صندوق الانشغال)
    const B = board, fr = Math.max(12, Math.min(B.w, B.h) * .04);
    x.save(); x.shadowColor = 'rgba(90,40,0,.35)'; x.shadowBlur = 24; x.shadowOffsetY = 12;
    x.fillStyle = '#9A5520'; x.beginPath(); x.roundRect(B.x - fr, B.y - fr, B.w + fr * 2, B.h + fr * 2, fr * 1.6); x.fill(); x.restore();
    wood(x, B.x - fr, B.y - fr, B.w + fr * 2, B.h + fr * 2, fr * 1.6, ['#D88A45', '#B86A2A', '#94501A'], 7);
    x.strokeStyle = 'rgba(255,230,190,.55)'; x.lineWidth = 2; x.beginPath(); x.roundRect(B.x - fr + 2, B.y - fr + 2, B.w + fr * 2 - 4, B.h + fr * 2 - 4, fr * 1.5); x.stroke();
    // السطح الداخلي
    x.save(); x.shadowColor = 'rgba(70,30,0,.45)'; x.shadowBlur = 10; x.shadowOffsetY = -3; x.shadowOffsetX = 0;
    wood(x, B.x, B.y, B.w, B.h, fr * .9, ['#F6C78C', '#EDB06A', '#E0A058'], 11); x.restore();
    g = x.createLinearGradient(0, B.y, 0, B.y + 16); g.addColorStop(0, 'rgba(90,40,0,.25)'); g.addColorStop(1, 'rgba(90,40,0,0)');
    x.fillStyle = g; x.beginPath(); x.roundRect(B.x, B.y, B.w, 16, [fr * .9, fr * .9, 0, 0]); x.fill();
    for (const [sx, sy] of [[B.x - fr / 2, B.y - fr / 2], [B.x + B.w + fr / 2, B.y - fr / 2], [B.x - fr / 2, B.y + B.h + fr / 2], [B.x + B.w + fr / 2, B.y + B.h + fr / 2]]) screw(x, sx, sy, fr * .28);
    // إطارات الأبواب (التجاويف)
    for (const d of doors) {
      const m = d.w * .07;
      x.save(); x.shadowColor = 'rgba(80,35,0,.35)'; x.shadowBlur = 8; x.shadowOffsetY = 4;
      x.fillStyle = lin(x, 0, d.y - m, 0, d.y + d.h + m, ['#FFE2B8', '#E8A866', '#C9853F']);
      x.beginPath(); x.roundRect(d.x - m, d.y - m, d.w + m * 2, d.h + m * 2, d.w * .16); x.fill(); x.restore();
      // داخل الخزانة
      g = x.createRadialGradient(d.x + d.w / 2, d.y + d.h * .45, 4, d.x + d.w / 2, d.y + d.h * .5, d.h * .7);
      g.addColorStop(0, '#FFF6E2'); g.addColorStop(.6, '#F2D3A6'); g.addColorStop(1, '#B07A42');
      x.fillStyle = g; x.beginPath(); x.roundRect(d.x, d.y, d.w, d.h, d.w * .12); x.fill();
      x.strokeStyle = 'rgba(110,55,10,.35)'; x.lineWidth = 3; x.stroke();
      // رف صغير
      x.fillStyle = 'rgba(150,85,25,.35)'; x.fillRect(d.x + 4, d.y + d.h * .78, d.w - 8, d.h * .035);
      x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(d.x + 4, d.y + d.h * .78, d.w - 8, 2);
    }
    // رف المفاتيح ومشبك الحلقة
    const hy = B.y + B.h + fr;
    x.fillStyle = 'rgba(90,40,0,.2)'; x.beginPath(); x.ellipse(ring.x, hy + 4, 18, 5, 0, 0, TAU); x.fill();
    x.fillStyle = lin(x, ring.x - 9, 0, ring.x + 9, 0, ['#8A96A3', '#F5F8FB', '#6F7C89']);
    x.beginPath(); x.roundRect(ring.x - 8, hy - 6, 16, ring.y - ring.ry - hy + 10, 6); x.fill();
  }

  /* ---------- الباب (لوحة مخزّنة تُرسم كشرائح لمنظور الدوران) ---------- */
  const doorCache = new Map();
  const DOOR_TONES = [['#FFE9C9', '#F2C88E', '#C98E4E'], ['#FBE3C0', '#E8B878', '#B87C3C'], ['#FFF0D8', '#F0CFA0', '#C89A62'], ['#F8DDB8', '#E2AE6E', '#AE7034']];
  function doorImg(d, i) {
    const pw = Math.round(d.w * dpr), ph = Math.round(d.h * dpr), key = i + '|' + pw + 'x' + ph;
    let c = doorCache.get(key); if (c) return c;
    c = mk(pw, ph); const x = c.getContext('2d'); x.scale(dpr, dpr);
    const w = d.w, h = d.h, tone = DOOR_TONES[i % DOOR_TONES.length], r = w * .12;
    // جسم الباب (خشب مطلي بلون باستيل)
    x.fillStyle = lin(x, 0, 0, 0, h, [tone[0], tone[1], tone[2]]);
    x.beginPath(); x.roundRect(0, 0, w, h, r); x.fill();
    x.save(); x.beginPath(); x.roundRect(0, 0, w, h, r); x.clip();
    x.globalAlpha = .12; x.strokeStyle = '#000'; x.lineWidth = 1;
    for (let xx = 6; xx < w; xx += 9) { x.beginPath(); x.moveTo(xx, 0); x.lineTo(xx + Math.sin(xx) * 2, h); x.stroke(); }
    x.restore();
    // ألواح بارزة
    const m = w * .14;
    for (const [py, pH] of [[m, h * .36], [m + h * .36 + m * .6, h - m * 2.6 - h * .36]]) {
      x.fillStyle = 'rgba(0,0,0,.14)'; x.beginPath(); x.roundRect(m, py + 2, w - m * 2, pH, r * .6); x.fill();
      x.fillStyle = lin(x, 0, py, 0, py + pH, [tone[0], tone[1]]); x.beginPath(); x.roundRect(m, py, w - m * 2, pH, r * .6); x.fill();
      x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 2; x.beginPath(); x.moveTo(m + 3, py + pH - 3); x.lineTo(m + 3, py + 3); x.lineTo(w - m - 3, py + 3); x.stroke();
    }
    // حافة بيضاء ولمعة
    x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = Math.max(2, w * .025); x.beginPath(); x.roundRect(1.5, 1.5, w - 3, h - 3, r); x.stroke();
    x.fillStyle = 'rgba(255,255,255,.22)'; x.beginPath(); x.roundRect(w * .08, h * .03, w * .84, h * .08, h * .04); x.fill();
    if (doorCache.size > 40) doorCache.clear();
    doorCache.set(key, c);
    return c;
  }
  function drawDoor(d, i) {
    const img = doorImg(d, i), a = d.open * Math.PI * .58;
    const intro = ease.outBack(clamp(d.intro, 0, 1));
    if (a <= .001) {
      ctx.save();
      if (d.shk) ctx.translate(Math.sin(d.shk * 40) * 3 * d.shk, 0);
      ctx.translate(d.x + d.w / 2, d.y + d.h / 2); ctx.scale(intro, intro); ctx.translate(-d.x - d.w / 2, -d.y - d.h / 2);
      ctx.drawImage(img, d.x, d.y, d.w, d.h);
      // مفصلات
      hinge(d.x, d.y + d.h * .18, d.w); hinge(d.x, d.y + d.h * .78, d.w);
      ctx.restore();
      return;
    }
    // الباب يدور حول المفصلة اليسرى: نرسمه شرائح بارتفاع متزايد (منظور)
    const N = 18, cs = Math.cos(a), sn = Math.sin(a);
    for (let s = 0; s < N; s++) {
      const u0 = s / N, u1 = (s + 1) / N;
      const x0 = d.x + u0 * d.w * cs, x1 = d.x + u1 * d.w * cs;
      const um = (u0 + u1) / 2, k = 1 + um * sn * .22, hh = d.h * k;
      const sx = Math.min(x0, x1), sw = Math.abs(x1 - x0) + .6;
      ctx.drawImage(img, u0 * img.width, 0, img.width / N, img.height, sx, d.y + d.h / 2 - hh / 2, sw, hh);
    }
    // تظليل حسب الزاوية
    ctx.save();
    ctx.globalAlpha = sn * .35;
    ctx.fillStyle = '#3A1A00';
    ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.w * cs, d.y + d.h / 2 - d.h * (1 + sn * .22) / 2); ctx.lineTo(d.x + d.w * cs, d.y + d.h / 2 + d.h * (1 + sn * .22) / 2); ctx.lineTo(d.x, d.y + d.h); ctx.closePath(); ctx.fill();
    ctx.restore();
    hinge(d.x, d.y + d.h * .18, d.w); hinge(d.x, d.y + d.h * .78, d.w);
  }
  function hinge(x, y, w) {
    const hw = w * .09, hh = w * .16;
    ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.roundRect(x - hw * .6, y - hh / 2 + 2, hw * 1.2, hh, 3); ctx.fill();
    ctx.fillStyle = lin(ctx, x - hw * .6, 0, x + hw * .6, 0, STEEL.slice().reverse().concat([STEEL[1]])); ctx.beginPath(); ctx.roundRect(x - hw * .6, y - hh / 2, hw * 1.2, hh, 3); ctx.fill();
  }
  /* المِشبك الذي يتعلّق به القفل */
  function hasp(d) {
    const x = d.lx, y = d.ly - d.L * .84 * .5 - d.L * .25, r = d.L * .2;
    ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.roundRect(x - d.L * .5, y - r * .8 + 3, d.L, r * 1.6, r * .5); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, y - r, 0, y + r, ['#F5F8FB', '#AEB9C4', '#6F7C89']); ctx.beginPath(); ctx.roundRect(x - d.L * .5, y - r * .8, d.L, r * 1.6, r * .5); ctx.fill();
    screwC(x - d.L * .36, y, r * .28); screwC(x + d.L * .36, y, r * .28);
  }
  function screwC(cx, cy, r) {
    ctx.fillStyle = '#7A8692'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(cx - r * .3, cy - r * .3, r * .35, 0, TAU); ctx.fill();
  }

  /* ---------- التفاعل ---------- */
  function lockAt(x, y, pad = 1) {
    let best = null, bd = 1e9;
    for (const d of doors) {
      if (d.state !== 'locked') continue;
      const dd = Math.hypot(x - d.lx, y - d.ly);
      if (dd < d.L * pad && dd < bd) { bd = dd; best = d; }
    }
    return best;
  }
  function keyAt(x, y) {
    let best = null, bd = 1e9;
    for (const k of keys) {
      if (k.state !== 'hang' && k.state !== 'back') continue;
      const p = bowPos(k), dd = Math.hypot(x - p.x, y - p.y);
      if (dd < KB * 1.7 && dd < bd) { bd = dd; best = k; }
    }
    return best;
  }
  function bowPos(k) {
    const r = KB * KEY.bowY * (k.sc || 1) + (k.state === 'hang' || k.state === 'back' ? 0 : 0);
    return { x: k.x - Math.sin(k.ang) * r, y: k.y + Math.cos(k.ang) * r };
  }
  /* موضع حلقة المفتاح حين يكون داخل القفل */
  function inKeyAnchor(d) {
    const s = d.L * .3 / KB, depth = KB * KEY.len * .62 * s, kx = d.lx, ky = d.ly + keyholeOff(d.L);
    const a = d.turn * Math.PI / 2;
    return { x: kx + Math.sin(a) * depth, y: ky - Math.cos(a) * depth, s, a, kx, ky, depth };
  }
  function dropKey(k) {
    const bp = bowPos(k);
    let d = lockAt(bp.x, bp.y, 1.05) || lockAt(k.x, k.y + KB * 2, .9);
    if (!d) { k.state = 'back'; k.t = 0; k.fx = k.x; k.fy = k.y; Sound.slide(); return; }
    if (same(k.o, d.o)) {
      k.state = 'fly'; k.t = 0; k.fx = k.x; k.fy = k.y; k.fa = k.ang; k.fs = k.sc; k.door = d; d.state = 'fly'; d.key = k;
      Sound.tone(700, .08, 'sine', .1, 400); hideHint(); idleT = 0; helpHand = null;
    } else {
      mistakes++; d.errs++; d.shk = 1; d.glow = 0; shake = Math.max(shake, 3);
      Sound.error(); vibrate(30);
      k.state = 'back'; k.t = 0; k.fx = k.x; k.fy = k.y; k.wob = 1;
      later(.3, () => { sayTry(); later(1.2, () => sayDesc(d.o)); });
      if (d.errs >= 2) { const rk = keys.find(q => q.state === 'hang' && same(q.o, d.o)); if (rk) { rk.glow = 5; d.glow = 5; } }
    }
  }
  function keyInserted(d) {
    d.state = 'keyed'; d.key.state = 'in'; d.pop = 1;
    Sound.tone(300, .05, 'square', .05); Sound.noise(.06, 2500, 4000, .1, 3); vibrate(15);
    later(.25, sayTurn);
    d.turnHint = 0;
  }
  function finishTurn(d) {
    if (d.state !== 'keyed' && d.state !== 'turn') return;
    d.state = 'unlock'; d.turn = 1; d.t = 0;
    // «طق!» صوت القفل
    Sound.noise(.04, 3000, 5000, .18, 4); Sound.tone(1400, .04, 'square', .06, -600, .02); Sound.tone(500, .08, 'triangle', .14, -200, .06);
    vibrate(25); d.pop = 1;
    sparkle(d.lx, d.ly - d.L * .3, '#FFE26B', 10);
  }
  function lockFalls(d) {
    falling.push({ o: d.o, key: d.key, x: d.lx, y: d.ly, vx: rand(-40, 40), vy: -160, rot: 0, vr: rand(-3, 3), L: d.L, age: 0, s: d.key.isc || (d.L * .3 / KB) });
    d.key.state = 'gone';
    d.state = 'opening'; d.t = 0;
    Sound.tone(220, .5, 'sawtooth', .025, 120); Sound.tone(330, .45, 'triangle', .05, 160, .05); // صرير الباب
  }
  function doorOpened(d) {
    d.state = 'open'; d.itemPop = 0;
    opened++; bumpProg();
    Sound.star(); Sound.pop();
    const cx = d.x + d.w / 2, cy = d.y + d.h * .5;
    sparkle(cx, cy, '#FF8AC2', 18);
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + rand(-1.2, 1.2), v = rand(90, 220); parts.push({ t: 'conf', x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, rot: rand(0, TAU), vr: rand(-8, 8), life: rand(.8, 1.3), age: 0, s: rand(5, 9), c: ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF'][i % 5] }); }
    sayItem(d.item);
    d.label = 3;
    if (opened >= doors.length) later(1.8, win);
  }

  /* ---------- الفوز ---------- */
  function win() {
    if (over) return;
    over = true;
    const pr = loadProg();
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('locksProg', pr);
    for (let i = 0; i < 130; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 240), rot: rand(0, TAU), vr: rand(-8, 8), life: rand(2.5, 4), age: 0, s: rand(6, 11), c: ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9'][i % 6] });
    Sound.win();
    later(1.1, () => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنتَ!') + ' 🎉';
      root.querySelector('.wpair').textContent = doors.map(d => d.item.e).join(' ');
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wP').textContent = App.g('فتحتِ كل الأبواب!', 'فتحتَ كل الأبواب!') + (mistakes ? '' : ' دون أخطاء! 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < LEVELS.length ? '' : 'none';
      winOv.classList.add('on');
      say(App.g('فتحت كل الأبواب!', 'فتحت كل الأبواب!'), 'You opened all the doors!');
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('locks_first');
      if (!mistakes && doors.length >= 4) App.achieve('locks_perfect');
      if (def.m === 'num') App.achieve('locks_numbers');
      if (LEVELS.every((_, i) => pr.stars[i + 1])) App.achieve('locks_all');
    });
  }
  function openLevels() {
    const pr = loadProg(), g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}"><span class="n">${num(n)}</span>
        <span class="e">${MODE_ICON[L.m]}</span><span class="d">🔒×${num(L.n)}</span>
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
    else if (a === 'close') { lvOv.classList.remove('on'); if (over) winOv.classList.add('on'); }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });
  sayBtn.addEventListener('click', () => {
    if (paused) return;
    if (window.gsap) gsap.fromTo(sayBtn, { scale: .8 }, { scale: 1, duration: .5, ease: 'elastic.out(1.2,0.4)', clearProps: 'transform' });
    const kd = doors.find(d => d.state === 'keyed');
    if (kd) { sayTurn(); kd.turnHint = 0; return; }
    sayIntro();
  });
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'ar'; store.set('locksLang', lang);
    root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
    hintEl.dir = lang === 'en' ? 'ltr' : 'rtl'; hintT.textContent = introHint();
    setProg();
  }
  root.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === lang) return;
    Sound.tap(); setLang(b.dataset.l); sayIntro();
  }));

  /* ---------- الجسيمات ---------- */
  function sparkle(x, y, col, n = 16) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU), v = rand(80, 240);
      parts.push({ t: 'star', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .9), age: 0, s: rand(5, 9), c: i % 2 ? '#FFE26B' : col });
    }
    rings.push({ x, y, age: 0, life: .45 });
  }

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  const blocked = () => App.current !== ID || paused || over || winOv.classList.contains('on') || lvOv.classList.contains('on');
  cv.addEventListener('pointerdown', e => {
    if (blocked() || drag || turnDrag) return;
    const p = pos(e); idleT = 0; helpHand = null;
    // تدوير مفتاح داخل قفل
    for (const d of doors) {
      if (d.state !== 'keyed') continue;
      const kx = d.lx, ky = d.ly + keyholeOff(d.L);
      if (Math.hypot(p.x - kx, p.y - (ky - d.L * .35)) < d.L * 1.1) {
        try { cv.setPointerCapture(e.pointerId); } catch (er) {}
        turnDrag = { id: e.pointerId, d, a0: Math.atan2(p.y - ky, p.x - kx), sx: p.x, sy: p.y, moved: false, t0: performance.now() };
        d.state = 'turn'; Sound.tap();
        return;
      }
    }
    const k = keyAt(p.x, p.y);
    if (k) {
      try { cv.setPointerCapture(e.pointerId); } catch (er) {}
      drag = { id: e.pointerId, k, ox: k.x - p.x, oy: k.y - p.y, sx: p.x, sy: p.y, moved: false, t0: performance.now(), touch: e.pointerType !== 'mouse', lx: p.x, vx: 0 };
      k.state = 'drag'; k.tx = k.x; k.ty = k.y; k.glow = 0;
      Sound.tone(880, .05, 'triangle', .08); Sound.tone(1320, .06, 'triangle', .05, 0, .03); vibrate(10);
      sayKey(k.o);
      return;
    }
    const d = lockAt(p.x, p.y, 1.1);
    if (d) { d.pop = 1; Sound.pop(); sayDesc(d.o); return; }
    // لمس باب مفتوح: نسمع اسم المفاجأة من جديد
    for (const dd of doors) if (dd.state === 'open' && p.x > dd.x && p.x < dd.x + dd.w && p.y > dd.y && p.y < dd.y + dd.h) { dd.itemPop = .35; dd.label = 2.5; Sound.pop(); say(dd.item.ar, dd.item.en); return; }
  });
  cv.addEventListener('pointermove', e => {
    const p = pos(e);
    if (turnDrag && e.pointerId === turnDrag.id) {
      const d = turnDrag.d, kx = d.lx, ky = d.ly + keyholeOff(d.L);
      if (Math.hypot(p.x - turnDrag.sx, p.y - turnDrag.sy) > 8) turnDrag.moved = true;
      let da = Math.atan2(p.y - ky, p.x - kx) - turnDrag.a0;
      while (da > Math.PI) da -= TAU; while (da < -Math.PI) da += TAU;
      const nt = clamp(Math.abs(da) / (Math.PI / 2), 0, 1);
      if (Math.floor(nt * 4) > Math.floor(d.turn * 4)) Sound.tone(900 + nt * 500, .03, 'square', .04);
      d.turn = Math.max(d.turn * .5, nt);
      if (d.turn >= .8) { turnDrag = null; finishTurn(d); }
      return;
    }
    if (!drag || e.pointerId !== drag.id) return;
    const k = drag.k;
    if (!drag.moved && Math.hypot(p.x - drag.sx, p.y - drag.sy) > 8) drag.moved = true;
    k.tx = p.x + drag.ox; k.ty = p.y + drag.oy - (drag.touch && drag.moved ? KB * .9 : 0);
    drag.vx = drag.vx * .6 + (p.x - drag.lx) * .4; drag.lx = p.x;
  });
  const endDrag = e => {
    if (turnDrag && e.pointerId === turnDrag.id) {
      const td = turnDrag; turnDrag = null; const d = td.d;
      if (!td.moved || performance.now() - td.t0 < 250 && d.turn < .2) { d.state = 'autoturn'; d.t = d.turn; return; }
      d.state = 'keyed'; // ترجع ببطء في update
      return;
    }
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (!d.moved && performance.now() - d.t0 < 350) { d.k.state = 'back'; d.k.t = 0; d.k.fx = d.k.x; d.k.fy = d.k.y; d.k.av += .25; return; }
    dropKey(d.k);
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < LEVELS.length ? 'next' : 'levels'); return; }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? lvOv.classList.remove('on') : openLevels(); return; }
    if (blocked()) return;
    if (e.key === 'r' || e.key === 'R') { sayBtn.click(); return; }
    // لوحة المفاتيح: الرقم = المفتاح، ثم الرقم = الباب
    const kd = doors.find(d => d.state === 'keyed');
    if (kd && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); kd.state = 'autoturn'; kd.t = kd.turn; return; }
    const n = parseInt(e.key, 10);
    if (!(n >= 1)) return;
    if (kbSel == null) { const k = keys.filter(q => q.state === 'hang')[n - 1]; if (k) { kbSel = k; k.pop = 1; k.av += .3; Sound.tap(); sayKey(k.o); } }
    else { const d = doors[n - 1], k = kbSel; kbSel = null; if (d && d.state === 'locked' && k.state === 'hang') { const bp = { x: d.lx, y: d.ly }; k.x = bp.x; k.y = bp.y - KB * KEY.bowY; dropKey(k); } }
  });
  let kbSel = null;

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    for (let i = tasks.length - 1; i >= 0; i--) { const t = tasks[i]; t.t -= dt; if (t.t <= 0) { tasks.splice(i, 1); t.fn(); } }
    const k24 = 1 - Math.exp(-dt * 22);
    for (const d of doors) {
      d.intro = Math.min(1, d.intro + dt / .45);
      d.shk = Math.max(0, d.shk - dt * 2.2); d.pop = Math.max(0, d.pop - dt * 2.4); d.glow = Math.max(0, d.glow - dt);
      d.label = Math.max(0, (d.label || 0) - dt);
      d.hover = false;
      if (d.state === 'keyed') {
        d.turn = Math.max(0, d.turn - dt * 2); d.turnHint = (d.turnHint || 0) + dt;
        if (d.turnHint > 6) { d.turnHint = 0; sayTurn(); }
      } else if (d.state === 'autoturn') {
        d.t = Math.min(1, d.t + dt / .35); d.turn = ease.inOut(d.t);
        if (d.t >= 1) finishTurn(d);
      } else if (d.state === 'unlock') {
        d.t += dt; d.lift = ease.outBack(clamp(d.t / .3, 0, 1));
        if (d.t > .55) lockFalls(d);
      } else if (d.state === 'opening') {
        d.t += dt / .75; d.open = ease.outElastic(clamp(d.t, 0, 1) * .85 + .15 * clamp(d.t, 0, 1)) ;
        d.open = clamp(ease.outCubic(clamp(d.t, 0, 1)) + Math.sin(clamp(d.t, 0, 1) * Math.PI * 2.5) * .05 * (1 - clamp(d.t, 0, 1)), 0, 1.05);
        if (d.t > .35) d.itemPop = Math.min(1, d.itemPop + dt / .45);
        if (d.t >= 1) { d.open = 1; doorOpened(d); }
      } else if (d.state === 'open') {
        d.itemPop = Math.min(1, d.itemPop + dt / .45);
      }
    }
    // المفاتيح
    for (const k of keys) {
      k.pop = Math.max(0, k.pop - dt * 2.4); k.glow = Math.max(0, k.glow - dt);
      if (k.state === 'hang') {
        // بندول
        k.av += (-Math.sin(k.ang) * 26 - k.av * 2.2) * dt; k.ang += k.av * dt;
        k.x = k.hx; k.y = k.hy;
      } else if (k.state === 'drag') {
        k.x += (k.tx - k.x) * k24; k.y += (k.ty - k.y) * k24;
        const target = clamp(-(drag ? drag.vx : 0) * .03, -.6, .6);
        k.av += ((target - k.ang) * 60 - k.av * 7) * dt; k.ang += k.av * dt;
        k.sc += (1.35 - k.sc) * k24 * .5;
        const bp = bowPos(k); const d = lockAt(bp.x, bp.y, 1.05) || lockAt(k.x, k.y + KB * 2, .9); if (d) d.hover = true;
      } else if (k.state === 'back') {
        k.t += dt / (k.wob ? .5 : .35); const t = Math.min(1, k.t), e = k.wob ? ease.outCubic(t) : ease.outBack(t);
        k.x = lerp(k.fx, k.hx, e); k.y = lerp(k.fy, k.hy, e); k.sc += (1 - k.sc) * k24;
        if (k.wob) k.ang = Math.sin(t * 25) * .35 * (1 - t);
        if (t >= 1) { k.state = 'hang'; k.wob = 0; k.av += .6 * (Math.random() < .5 ? -1 : 1); }
      } else if (k.state === 'fly') {
        k.t += dt / .38; const t = Math.min(1, k.t), e = ease.outCubic(t);
        const d = k.door, A = inKeyAnchor(d);
        k.x = lerp(k.fx, A.x, e); k.y = lerp(k.fy, A.y, e) - Math.sin(t * Math.PI) * 30;
        k.ang = lerp(k.fa, 0, e); k.sc = lerp(k.fs, A.s, e);
        if (t >= 1) { k.isc = A.s; keyInserted(d); }
      }
    }
    // ارتجاج الحلقة كلها حين تتحرك المفاتيح
    for (let i = falling.length - 1; i >= 0; i--) {
      const f = falling[i]; f.age += dt; f.vy += 1500 * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.rot += f.vr * dt;
      if (f.age > 1.4) falling.splice(i, 1);
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.t === 'conf') { q.vy = Math.min(q.vy + 160 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; q.rot += q.vr * dt; }
      else { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 300 * dt; q.rot += q.vr * dt; }
      q.x += q.vx * dt; q.y += q.vy * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    shake = Math.max(0, shake - dt * 16);
    // مساعدة بعد فترة خمول: يد تشير من المفتاح الصحيح إلى قفله
    if (!over && !drag && !turnDrag) {
      idleT += dt;
      if (idleT > 8 && !helpHand && !doors.some(d => d.state === 'keyed')) {
        const d = doors.find(q => q.state === 'locked'), k = d && keys.find(q => q.state === 'hang' && same(q.o, d.o));
        if (d && k) { helpHand = { k, d, t: 0 }; k.glow = 4; d.glow = 4; }
      }
    }
    if (helpHand) { helpHand.t += dt; if (helpHand.t > 4.5 || helpHand.k.state !== 'hang') { helpHand = null; idleT = 0; } }
  }

  /* ---------- الرسم ---------- */
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  function label(text, x, y, col, size, en) {
    ctx.save();
    ctx.font = `900 ${size}px ${en ? 'system-ui,"Segoe UI",sans-serif' : FONT}`;
    ctx.direction = en ? 'ltr' : 'rtl';
    const w = ctx.measureText(text).width + size * 1.3, h = size * 1.55;
    ctx.fillStyle = 'rgba(0,0,0,.14)'; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2 + 3, w, h, h / 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + size * .05);
    ctx.restore();
  }
  function drawItem(d) {
    if (d.open < .25 && d.state !== 'open') return;
    const t = clamp(d.itemPop, 0, 1), e = ease.outBack(t);
    if (e <= 0) return;
    const s = Math.min(d.w, d.h) * .62, cx = d.x + d.w * .52, cy = d.y + d.h * .74;
    const bob = d.state === 'open' ? Math.sin(T * 2.4 + d.x) * 3 : 0;
    // ضوء خلفي
    const g = ctx.createRadialGradient(cx, cy - s * .45, 2, cx, cy - s * .45, s * .8);
    g.addColorStop(0, `rgba(255,255,220,${.8 * e})`); g.addColorStop(1, 'rgba(255,255,220,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy - s * .45, s * .8, 0, TAU); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.roundRect(d.x, d.y - d.h * .4, d.w, d.h * 1.4, d.w * .12); ctx.clip();
    const img = bake(d.item.e, s), sz = img.width / dpr;
    ctx.translate(cx, cy + bob); ctx.scale(e, e * (1 + Math.sin(t * Math.PI) * .1));
    ctx.drawImage(img, -sz / 2, -sz * .9, sz, sz);
    ctx.restore();
  }
  function drawLockOnDoor(d) {
    if (!(d.state === 'locked' || d.state === 'fly' || d.state === 'keyed' || d.state === 'turn' || d.state === 'autoturn' || d.state === 'unlock')) return;
    hasp(d);
    const sq = Math.sin((1 - d.pop) * Math.PI * 3) * d.pop * .08;
    const sw = d.shk > 0 ? Math.sin(d.shk * 30) * .22 * d.shk : Math.sin(T * 1.6 + d.x) * .025;
    const pivotY = d.ly - d.L * .84 * .5 - d.L * .25;
    ctx.save(); ctx.translate(d.lx, pivotY); ctx.rotate(sw); ctx.scale(1 + sq, 1 - sq); ctx.translate(-d.lx, -pivotY);
    if (d.glow > 0 || d.hover) {
      const a = d.hover ? .95 : (.45 + .45 * Math.sin(T * 8)) * Math.min(1, d.glow);
      ctx.save(); ctx.globalAlpha = a; ctx.shadowColor = d.hover ? '#FFFFFF' : '#FFD000'; ctx.shadowBlur = 22;
      ctx.strokeStyle = d.hover ? '#FFFFFF' : '#FFE04A'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.roundRect(d.lx - d.L * .62, d.ly - d.L * .5, d.L * 1.24, d.L * .98, d.L * .24); ctx.stroke(); ctx.restore();
    }
    drawLock(ctx, d.o, d.lx, d.ly, d.L, { lift: d.lift });
    if (d.key && d.key.state === 'in') {
      const A = inKeyAnchor(d);
      drawKey(ctx, d.key.o, A.x, A.y, KB, A.a, { sc: A.s, cut: A.depth / A.s });
    }
    ctx.restore();
    // سهم التدوير
    if (d.state === 'keyed' || d.state === 'turn') {
      const kx = d.lx, ky = d.ly + keyholeOff(d.L), r = d.L * .72, pul = 1 + Math.sin(T * 6) * .06;
      ctx.save(); ctx.translate(kx, ky - d.L * .15); ctx.scale(pul, pul);
      const a0 = -Math.PI * .85, a1 = a0 + Math.PI * .7 + (T * 1.2 % 1) * .0;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = d.L * .14; ctx.beginPath(); ctx.arc(0, 3, r, a0, a1); ctx.stroke();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = d.L * .14; ctx.beginPath(); ctx.arc(0, 0, r, a0, a1); ctx.stroke();
      ctx.strokeStyle = '#FF8A1F'; ctx.lineWidth = d.L * .08; ctx.beginPath(); ctx.arc(0, 0, r, a0, a1); ctx.stroke();
      const hx = Math.cos(a1) * r, hy = Math.sin(a1) * r, ta = a1 + Math.PI / 2, hs = d.L * .2;
      ctx.fillStyle = '#FF8A1F'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(hx + Math.cos(ta) * hs, hy + Math.sin(ta) * hs);
      ctx.lineTo(hx + Math.cos(ta + 2.3) * hs * .8, hy + Math.sin(ta + 2.3) * hs * .8); ctx.lineTo(hx + Math.cos(ta - 2.3) * hs * .8, hy + Math.sin(ta - 2.3) * hs * .8); ctx.closePath(); ctx.stroke(); ctx.fill();
      ctx.restore();
      // يد تدوير إرشادية
      if (d.state === 'keyed') {
        const t = (T * .7) % 1, aa = a0 + (a1 - a0) * ease.inOut(t);
        ctx.save(); ctx.globalAlpha = t > .85 ? (1 - t) / .15 : 1; ctx.font = `${d.L * .5}px ${EMOJI_FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText('👆', kx + Math.cos(aa) * r, ky - d.L * .15 + Math.sin(aa) * r); ctx.restore();
      }
    }
  }
  function drawRing() {
    const { x, y, rx, ry } = ring;
    // الجزء الخلفي من الحلقة
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#6F7C89'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, Math.PI, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y - 1, rx, ry, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  }
  function drawRingFront() {
    const { x, y, rx, ry } = ring;
    ctx.strokeStyle = 'rgba(60,30,0,.2)'; ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(x, y + 3, rx, ry, 0, 0, Math.PI); ctx.stroke();
    ctx.strokeStyle = lin(ctx, x - rx, 0, x + rx, 0, ['#8A96A3', '#F5F8FB', '#9AA6B2', '#F5F8FB', '#6F7C89']); ctx.lineWidth = 7;
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y + 1, rx - 2, ry - 1, 0, Math.PI * .2, Math.PI * .45); ctx.stroke();
  }
  function drawChain(k) {
    if (!k.chain) return;
    ctx.strokeStyle = '#9AA6B2'; ctx.lineWidth = 2.5;
    const n = Math.max(2, Math.round(k.chain / 9));
    for (let i = 0; i < n; i++) {
      const yy = k.ry + 2 + (k.hy - k.ry - 2) * (i + .5) / n;
      ctx.beginPath(); ctx.ellipse(k.hx, yy, i % 2 ? 2 : 3.2, (k.hy - k.ry) / n * .62, 0, 0, TAU); ctx.stroke();
    }
  }
  function drawHand() {
    if (!helpHand) return;
    const { k, d } = helpHand, t = (helpHand.t * .55) % 1, e = ease.inOut(clamp(t * 1.4, 0, 1));
    const bp = bowPos(k), x = lerp(bp.x, d.lx, e), y = lerp(bp.y, d.ly, e);
    ctx.save(); ctx.globalAlpha = t > .85 ? (1 - t) / .15 : 1;
    ctx.font = `${KB * 1.8}px ${EMOJI_FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText('👆', x + 6, y); ctx.restore();
  }
  function render() {
    ctx.save();
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    doors.forEach((d, i) => { drawItem(d); drawDoor(d, i); });
    doors.forEach(d => drawLockOnDoor(d));
    for (const d of doors) if (d.state === 'open' && d.label > 0) {
      const fs = clamp(d.w * .13, 13, 20), a = Math.min(1, d.label * 2);
      ctx.save(); ctx.globalAlpha = a; label(lang === 'ar' ? d.item.ar : d.item.en, d.x + d.w / 2, d.y + d.h + fs * .2, '#C2650E', fs, lang === 'en'); ctx.restore();
    }
    // حلقة المفاتيح
    drawRing();
    for (const k of keys) if (k.state === 'hang' || k.state === 'back') drawChain(k);
    for (const k of keys) {
      if (k.state !== 'hang' && k.state !== 'back') continue;
      if (k.glow > 0) {
        const bp = bowPos(k); ctx.save(); ctx.globalAlpha = (.5 + .5 * Math.sin(T * 8)) * Math.min(1, k.glow);
        const g = ctx.createRadialGradient(bp.x, bp.y, 2, bp.x, bp.y, KB * 2); g.addColorStop(0, 'rgba(255,240,120,.95)'); g.addColorStop(1, 'rgba(255,240,120,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bp.x, bp.y, KB * 2, 0, TAU); ctx.fill(); ctx.restore();
      }
      const sq = Math.sin((1 - k.pop) * Math.PI * 3) * k.pop * .12;
      drawKey(ctx, k.o, k.x, k.y, KB, k.ang, { sc: k.sc * (1 + sq) });
    }
    drawRingFront();
    // المفاتيح المحمولة / الطائرة فوق كل شيء
    for (const k of keys) if (k.state === 'drag' || k.state === 'fly') {
      ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = '#3A1A00'; ctx.beginPath(); ctx.ellipse(k.x + 14, k.y + KB * 4.6 * k.sc, KB * .9, KB * .25, 0, 0, TAU); ctx.fill(); ctx.restore();
      drawKey(ctx, k.o, k.x, k.y, KB, k.ang, { sc: k.sc });
    }
    // الأقفال الساقطة
    for (const f of falling) {
      ctx.save(); ctx.globalAlpha = clamp(1.4 - f.age, 0, 1) ;
      ctx.translate(f.x, f.y); ctx.rotate(f.rot); ctx.translate(-f.x, -f.y);
      drawLock(ctx, f.o, f.x, f.y, f.L, { lift: 1 });
      const ky = f.y + keyholeOff(f.L), depth = KB * KEY.len * .62 * f.s;
      drawKey(ctx, f.key.o, f.x + depth, ky, KB, Math.PI / 2, { sc: f.s, cut: depth / f.s });
      ctx.restore();
    }
    drawHand();
    for (const r of rings) {
      const t = r.age / r.life; ctx.strokeStyle = `rgba(255,255,255,${(1 - t) * .9})`; ctx.lineWidth = 4 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, 10 + t * 60, 0, TAU); ctx.stroke();
    }
    for (const q of parts) {
      const t = q.age / q.life;
      ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.rot);
      if (q.t === 'conf') { ctx.globalAlpha = Math.min(1, (q.life - q.age) * 2); ctx.fillStyle = q.c; ctx.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); }
      else { ctx.globalAlpha = 1 - t; ctx.fillStyle = q.c; starPath(ctx, q.s); ctx.fill(); }
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
    clearTimeout(resizeT); resizeT = setTimeout(() => { bgKey = ''; layout(); if (!running) render(); }, 80);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#FFD08A'); g.addColorStop(1, '#E58A2E');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.globalAlpha = .15; c.strokeStyle = '#7A3A00'; c.lineWidth = 2;
    for (let y = 8; y < s; y += 10) { c.beginPath(); c.moveTo(0, y); c.quadraticCurveTo(s / 2, y + 4, s, y); c.stroke(); }
    c.globalAlpha = 1;
    // باب صغير
    c.save(); c.shadowColor = 'rgba(80,30,0,.4)'; c.shadowBlur = 8; c.shadowOffsetY = 4;
    c.fillStyle = lin(c, 0, s * .14, 0, s * .8, ['#8ED1FF', '#4FA6EA', '#2A72B8']); c.beginPath(); c.roundRect(s * .2, s * .14, s * .5, s * .66, s * .07); c.fill(); c.restore();
    c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 3; c.beginPath(); c.roundRect(s * .2, s * .14, s * .5, s * .66, s * .07); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = 2; c.beginPath(); c.roundRect(s * .27, s * .2, s * .36, s * .22, 6); c.roundRect(s * .27, s * .47, s * .36, s * .26, 6); c.stroke();
    const sv = def; def = { m: 'combo' };
    drawLock(c, { c: 'red', s: 'heart', n: 0 }, s * .66, s * .55, s * .3, {});
    drawKey(c, { c: 'yellow', s: 'star', n: 0 }, s * .3, s * .5, s * .085, -.7, {});
    def = sv;
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'المفاتيح والأقفال', icon2: '🔑', isNew: true, music: 'shapes',
    desc: () => App.g('افتحي الأبواب بالمفتاح المناسب', 'افتح الأبواب بالمفتاح المناسب'),
    help: () => [
      '🔑 ' + App.g('اسحبي', 'اسحب') + ' المفتاح إلى القفل الذي يشبهه: باللون، أو بالشكل، أو بالاثنين معًا',
      '🔢 في مستويات الأرقام: رقم المفتاح = عدد النقاط على القفل',
      '🔄 ' + App.g('أديري', 'أدِر') + ' المفتاح بإصبعك (أو ' + App.g('المسيه', 'المسه') + ') فينفتح الباب عن مفاجأة!',
      '🌍 ' + App.g('بدّلي', 'بدّل') + ' بين «عربي» و«English» لتسمع الأسماء باللغتين',
      '⭐ بلا أخطاء = 3 نجوم'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 ${ks.length}/${LEVELS.length} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      setLang(store.get('locksLang', 'ar'));
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, LEVELS.length));
      render(); startLoop();
    },
    leave() { stopLoop(); tasks = []; drag = null; turnDrag = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() {
      paused = true;
      if (drag) { const k = drag.k; drag = null; k.state = 'back'; k.t = 0; k.fx = k.x; k.fy = k.y; }
      if (turnDrag) { turnDrag.d.state = 'keyed'; turnDrag = null; }
    },
    resume() { paused = false; last = performance.now(); },
    back() { if (lvOv.classList.contains('on')) { act('close'); return true; } return false; },
    /* للاختبار الآلي فقط */
    _state() {
      return {
        lvl, mode: def.m, opened, mistakes, over, KB,
        doors: doors.map(d => ({ id: d.o.id, state: d.state, lx: d.lx, ly: d.ly, L: d.L, kx: d.lx, ky: d.ly + keyholeOff(d.L) })),
        keys: keys.map(k => { const b = bowPos(k); return { id: k.o.id, state: k.state, bx: b.x, by: b.y }; })
      };
    }
  });
})();
