/* =====================================================================
   إشارات المرور والسلامة — شارع مجسّم لطيف:
   الإشارة الضوئية، القيادة عند الإشارة، عبور الشارع، الإشارات المرورية،
   مقعد الأطفال وحزام الأمان، خوذة الدراجة، وأسئلة السلامة في الشارع والبيت
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'traffic';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,"Segoe UI",Tahoma,sans-serif';
  const EN_FONT = 'system-ui,"Segoe UI",sans-serif';
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  /* ---------- المحتوى ---------- */
  const LIGHTS = [
    { id: 'red', ar: 'أحمر', en: 'Red', rar: 'يعني قف', ren: 'means stop', act: 0 },
    { id: 'yellow', ar: 'أصفر', en: 'Yellow', rar: 'يعني انتظر', ren: 'means wait', act: 1 },
    { id: 'green', ar: 'أخضر', en: 'Green', rar: 'يعني امش', ren: 'means go', act: 2 }
  ];
  const ACTIONS = [
    { ar: 'قف', en: 'Stop', e: '✋', col: '#F03E3E' },
    { ar: 'انتظر', en: 'Wait', e: '⏳', col: '#F5A700' },
    { ar: 'امشِ', en: 'Go', e: '🚶', col: '#2FB344' }
  ];
  const SIGNS = {
    stop:    { ar: 'قف', en: 'stop sign', lab: 'قف', lab_en: 'Stop' },
    cross:   { ar: 'ممر المشاة', en: 'pedestrian crossing', lab: 'ممر المشاة', lab_en: 'Crossing' },
    school:  { ar: 'منطقة مدرسة', en: 'school zone', lab: 'منطقة مدرسة', lab_en: 'School zone' },
    noentry: { ar: 'ممنوع الدخول', en: 'no entry', lab: 'ممنوع الدخول', lab_en: 'No entry' },
    lights:  { ar: 'إشارات ضوئية', en: 'traffic lights ahead', lab: 'إشارات ضوئية', lab_en: 'Traffic lights' }
  };
  /* مواقف السلامة: bg خلفية المشهد الصغير، it رموز [رمز، x، y، حجم] نسبةً إلى البطاقة */
  const SAFE = {
    street: [
      { bg: 'street', it: [['🚗', .8, .8, .3], ['🧒', .38, .84, .34], ['⚽', .57, .88, .14]], safe: false, ar: 'اللعب بالكرة في الشارع', en: 'Playing ball in the street', rar: 'نلعب في الحديقة لا في الشارع', ren: 'We play in the park, not in the street' },
      { bg: 'park', it: [['🧒', .4, .86, .34], ['⚽', .62, .9, .14], ['🌳', .84, .74, .36]], safe: true, ar: 'اللعب في الحديقة', en: 'Playing in the park' },
      { bg: 'zebra', it: [['👩‍👧', .5, .88, .42]], safe: true, ar: 'العبور مع الكبار من ممر المشاة', en: 'Crossing with a grown-up at the crossing' },
      { bg: 'street', it: [['🏃', .46, .84, .34], ['🚙', .84, .8, .3], ['🚗', .13, .78, .28]], safe: false, ar: 'الركض بين السيارات', en: 'Running between cars', rar: 'نعبر من ممر المشاة مع الكبار', ren: 'We cross at the crossing with a grown-up' },
      { bg: 'park', it: [['🚴', .5, .88, .44]], safe: true, ar: 'ركوب الدراجة بالخوذة', en: 'Riding a bike with a helmet' },
      { bg: 'street', light: 'red', it: [['🚶', .5, .86, .32]], safe: false, ar: 'العبور والإشارة حمراء', en: 'Crossing when the light is red', rar: 'أحمر يعني قف', ren: 'Red means stop' }
    ],
    home: [
      { bg: 'kitchen', stove: true, it: [['✋', .8, .42, .22]], safe: false, ar: 'لمس الموقد الساخن', en: 'Touching the hot stove', rar: 'الموقد ساخن لا نلمسه', ren: 'The stove is hot, we do not touch it' },
      { bg: 'room', it: [['🔌', .46, .56, .3], ['👆', .7, .6, .2], ['⚡', .28, .38, .16]], safe: false, ar: 'وضع الأصابع في الكهرباء', en: 'Putting fingers in the socket', rar: 'الكهرباء خطيرة', ren: 'Electricity is dangerous' },
      { bg: 'room', it: [['💊', .4, .66, .24], ['🧒', .72, .86, .36]], safe: false, ar: 'أخذ الدواء وحدي', en: 'Taking medicine alone', rar: 'الكبار فقط يعطوننا الدواء', ren: 'Only grown-ups give us medicine' },
      { bg: 'room', it: [['🧸', .34, .82, .3], ['🧒', .68, .86, .36]], safe: true, ar: 'اللعب بالألعاب', en: 'Playing with toys' },
      { bg: 'kitchen', it: [['🥛', .38, .7, .24], ['🧒', .68, .86, .36]], safe: true, ar: 'شرب الحليب', en: 'Drinking milk' },
      { bg: 'kitchen', it: [['🔪', .42, .64, .28], ['🧒', .72, .86, .36]], safe: false, ar: 'اللعب بالسكين', en: 'Playing with a knife', rar: 'السكين تجرح', ren: 'Knives can cut' },
      { bg: 'room', it: [['🧼', .36, .74, .22], ['🙌', .64, .6, .32]], safe: true, ar: 'غسل اليدين', en: 'Washing hands' },
      { bg: 'room', it: [['🧴', .42, .66, .28], ['🧒', .72, .86, .36]], safe: false, ar: 'شرب مواد التنظيف', en: 'Drinking cleaning liquids', rar: 'مواد التنظيف ليست للشرب', ren: 'Cleaning liquids are not for drinking' }
    ]
  };

  /* ---------- المستويات ---------- */
  const LEVELS = [
    { a: 'light', e: '🚦' },
    { a: 'drive', e: '🚗', rounds: ['red', 'green', 'red', 'yellow'], sp: 1 },
    { a: 'cross', e: '🚸', wait: false },
    { a: 'signs', e: '🛑', learn: ['stop', 'cross', 'school', 'noentry'], q: 4, ch: 3 },
    { a: 'seat', e: '💺' },
    { a: 'bike', e: '🚲' },
    { a: 'quiz', e: '⚽', set: 'street', q: 6 },
    { a: 'drive', e: '🚙', rounds: ['green', 'red', 'yellow', 'red', 'green', 'red'], sp: 1.3 },
    { a: 'quiz', e: '🏠', set: 'home', q: 6 },
    { a: 'signs', e: '🏫', learn: null, pool: ['stop', 'cross', 'school', 'noentry', 'lights'], q: 6, ch: 4 },
    { a: 'cross', e: '🚶', wait: true },
    { a: 'mix', e: '🏆', q: 8 }
  ];

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function rng(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
  const loadProg = () => { const p = store.get('trafficProg', null) || {}; return { stars: p.stars || {}, unlocked: p.unlocked || 1 }; };
  const lin = (c, x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; };
  function ball(c, cx, cy, r, c1, c2, c3) {
    const g = c.createRadialGradient(cx - r * .4, cy - r * .45, r * .1, cx, cy, r * 1.05);
    g.addColorStop(0, c1); g.addColorStop(.55, c2); g.addColorStop(1, c3);
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.fill();
  }
  const inR = (p, b) => b && !b.hide && p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h;
  let lang = 'ar';
  const num = n => lang === 'ar' ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
  const L = (ar, en) => lang === 'ar' ? ar : en;

  /* ---------- النطق ---------- */
  const say = (ar, en) => lang === 'ar' ? App.speak(ar) : App.speak(en, 'en');
  const sayRule = li => say(li.ar + ' ' + li.rar, li.en + ' ' + li.ren);
  const sayGood = () => say(App.g('أحسنت!', 'أحسنت!'), 'Well done!');
  const sayTry = () => say(App.g('حاولي مرة أخرى', 'حاول مرة أخرى'), 'Try again!');

  /* ---------- رموز بحافة بيضاء ---------- */
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
    cx.save(); cx.shadowColor = 'rgba(20,30,60,.3)'; cx.shadowBlur = px * .05; cx.shadowOffsetY = px * .025;
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; cx.drawImage(sil, Math.cos(a) * r, Math.sin(a) * r); }
    cx.restore();
    cx.drawImage(g, 0, 0);
    if (bakeCache.size > 160) bakeCache.clear();
    bakeCache.set(key, c);
    return c;
  }
  /* يرسم الرمز وأسفله عند (x,y) */
  function emo(c, e, x, y, s, o = {}) {
    const img = bake(e, s), sz = img.width / dpr;
    c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot);
    c.scale((o.flip ? -1 : 1) * (o.sc || 1), o.sc || 1);
    if (o.a != null) c.globalAlpha *= o.a;
    c.drawImage(img, -sz / 2, -sz * .88, sz, sz); c.restore();
  }

  /* =====================================================================
     رسومات مشتركة: الأشخاص، السيارات، الإشارات
     ===================================================================== */
  const SKIN = ['#FBD9BC', '#E9B48C', '#C98A5E'];
  /* شخص كرتوني: (x,y) القدمان، h الطول */
  function person(c, x, y, h, o = {}) {
    const adult = !!o.adult, girl = o.girl != null ? o.girl : App.g(true, false);
    const r = adult ? h * .13 : h * .2;
    const hy = y - h + r;                    // مركز الرأس
    const sh = hy + r * (adult ? 1.25 : 1.05); // الكتفان
    const hip = y - h * (adult ? .44 : .36);
    const bw = adult ? h * .2 : h * .27;
    const wk = o.walk != null ? Math.sin(o.walk) : 0;
    const shirt = o.shirt || (adult ? ['#8DD3FF', '#3D9BE8', '#1F6BB0'] : girl ? ['#FFB3D6', '#FF5FA2', '#C22A6E'] : ['#9EE6A0', '#3DBB57', '#1F7A33']);
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    // ظل
    if (!o.sit) { c.fillStyle = 'rgba(20,30,40,.18)'; c.beginPath(); c.ellipse(x, y + 2, h * .2, h * .04, 0, 0, TAU); c.fill(); }
    // الساقان
    const lw = h * (adult ? .075 : .1);
    if (o.sit) {
      c.strokeStyle = adult ? '#3A4A6B' : '#3A5BA8'; c.lineWidth = lw;
      c.beginPath(); c.moveTo(x - bw * .2, hip); c.lineTo(x + h * .2, hip); c.lineTo(x + h * .22, hip + h * .2); c.stroke();
      c.fillStyle = '#E8504A'; c.beginPath(); c.ellipse(x + h * .26, hip + h * .22, lw * .8, lw * .5, 0, 0, TAU); c.fill();
    } else {
      for (const sd of [-1, 1]) {
        const sw = wk * sd * h * .07;
        c.strokeStyle = adult ? (girl ? '#2E3A59' : '#2E3A59') : '#3A5BA8'; c.lineWidth = lw;
        c.beginPath(); c.moveTo(x + sd * bw * .22, hip); c.lineTo(x + sd * bw * .22 + sw, y - lw * .5); c.stroke();
        c.fillStyle = adult ? '#5A3A2A' : '#E8504A'; c.beginPath(); c.ellipse(x + sd * bw * .22 + sw + sd * lw * .2, y - lw * .3, lw * .75, lw * .45, 0, 0, TAU); c.fill();
      }
    }
    // الذراعان
    const aw = h * (adult ? .06 : .08);
    const arm = (sd, front) => {
      const sx = x + sd * bw * .48, sy = sh + aw * .4;
      let ex, ey;
      if (sd === 1 && o.stop) { ex = sx + h * .1; ey = hy - r * .6; }
      else if (sd === (o.handSide || 1) && o.hand) { ex = o.hand.x; ey = o.hand.y; }
      else if (o.sit) { ex = sx + h * .14; ey = hip - h * .02; }
      else { const sw = -wk * sd * h * .08; ex = sx + sd * h * .04 + sw; ey = sy + h * (adult ? .26 : .2); }
      c.strokeStyle = shirt[1]; c.lineWidth = aw;
      c.beginPath(); c.moveTo(sx, sy); c.lineTo(lerp(sx, ex, .45), lerp(sy, ey, .45)); c.stroke();
      c.strokeStyle = SKIN[1]; c.beginPath(); c.moveTo(lerp(sx, ex, .45), lerp(sy, ey, .45)); c.lineTo(ex, ey); c.stroke();
      c.fillStyle = SKIN[0]; c.beginPath(); c.arc(ex, ey, aw * (o.stop && sd === 1 ? .9 : .62), 0, TAU); c.fill();
    };
    arm(-1);
    // الجسم
    const bg = lin(c, x - bw / 2, 0, x + bw / 2, 0, [shirt[0], shirt[1], shirt[2]]);
    c.fillStyle = bg;
    c.beginPath();
    if (adult && girl) { // ثوب طويل
      c.moveTo(x - bw * .45, sh); c.lineTo(x + bw * .45, sh); c.lineTo(x + bw * .75, y - h * .1); c.lineTo(x - bw * .75, y - h * .1); c.closePath();
    } else c.roundRect(x - bw / 2, sh - aw * .2, bw, hip - sh + aw * .6, bw * .32);
    c.fill();
    c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.roundRect(x - bw * .36, sh + 2, bw * .2, (hip - sh) * .7, bw * .1); c.fill();
    if (!adult && girl && !o.sit) { // تنورة صغيرة
      c.fillStyle = shirt[2]; c.beginPath(); c.moveTo(x - bw * .5, hip - h * .04); c.lineTo(x + bw * .5, hip - h * .04); c.lineTo(x + bw * .66, hip + h * .07); c.lineTo(x - bw * .66, hip + h * .07); c.closePath(); c.fill();
    }
    if (o.belt) { // حزام الأمان
      c.strokeStyle = '#2B2F38'; c.lineWidth = h * .055;
      c.beginPath(); c.moveTo(x - bw * .5, sh); c.lineTo(x + bw * .55, hip - h * .02); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,.25)'; c.lineWidth = h * .015; c.stroke();
    }
    arm(1);
    // الرأس
    const look = o.look || 0;
    if (adult && girl) { // حجاب
      c.fillStyle = lin(c, x - r * 1.3, 0, x + r * 1.3, 0, ['#C9A4F5', '#9B6BE0', '#6E43B0']);
      c.beginPath(); c.arc(x, hy, r * 1.22, 0, TAU); c.moveTo(x - r * 1.2, hy); c.quadraticCurveTo(x, sh + r * .9, x + r * 1.2, hy); c.fill();
    }
    const fg = c.createRadialGradient(x - r * .35, hy - r * .35, r * .1, x, hy, r * 1.1);
    fg.addColorStop(0, SKIN[0]); fg.addColorStop(.7, SKIN[1]); fg.addColorStop(1, SKIN[2]);
    c.fillStyle = fg; c.beginPath();
    if (adult && girl) c.ellipse(x + look * r * .1, hy + r * .08, r * .82, r * .9, 0, 0, TAU); else c.arc(x, hy, r, 0, TAU);
    c.fill();
    // الشعر
    if (!(adult && girl) && !o.helmet) {
      c.fillStyle = '#3B2416';
      c.beginPath(); c.arc(x, hy - r * .1, r * 1.02, Math.PI * 1.02, Math.PI * 1.98); c.quadraticCurveTo(x + r * .3, hy - r * .55, x - r * .2, hy - r * .4); c.quadraticCurveTo(x - r * .7, hy - r * .3, x - r * 1.0, hy - r * .02); c.fill();
      if (girl && !adult) {
        for (const sd of [-1, 1]) {
          c.fillStyle = '#3B2416'; c.beginPath(); c.ellipse(x + sd * r * 1.1, hy + r * .15, r * .32, r * .5, sd * .3, 0, TAU); c.fill();
          c.fillStyle = '#FF4F9A'; c.beginPath(); c.arc(x + sd * r * 1.0, hy - r * .35, r * .2, 0, TAU); c.fill();
        }
      }
    }
    // الوجه
    const ex = look * r * .28;
    for (const sd of [-1, 1]) {
      c.fillStyle = '#2A1A10'; c.beginPath(); c.ellipse(x + ex + sd * r * .36, hy + r * .05, r * .12, r * .16, 0, 0, TAU); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(x + ex + sd * r * .36 - r * .04, hy - r * .02, r * .045, 0, TAU); c.fill();
      c.fillStyle = 'rgba(255,110,120,.4)'; c.beginPath(); c.ellipse(x + ex * .6 + sd * r * .58, hy + r * .38, r * .15, r * .09, 0, 0, TAU); c.fill();
    }
    c.strokeStyle = '#8A3A2A'; c.lineWidth = Math.max(1.2, r * .09);
    c.beginPath(); c.arc(x + ex * .8, hy + r * .32, r * .2, .3, Math.PI - .3); c.stroke();
    if (o.helmet) helmet(c, x, hy, r, o.strap);
    c.restore();
  }
  function helmet(c, x, hy, r, strap) {
    c.save();
    c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(x, hy - r * .12, r * 1.18, r * .3, 0, 0, TAU); c.fill();
    c.fillStyle = lin(c, 0, hy - r * 1.3, 0, hy, ['#FFB0B0', '#F03E3E', '#B01E1E']);
    c.beginPath(); c.ellipse(x, hy - r * .15, r * 1.2, r * 1.1, 0, Math.PI, TAU); c.closePath(); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(x, hy - r * .15, r * .28, r * 1.08, 0, Math.PI, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(x - r * .55, hy - r * .8, r * .3, r * .14, -.5, 0, TAU); c.fill();
    c.fillStyle = '#2B2F38'; c.beginPath(); c.roundRect(x - r * 1.25, hy - r * .2, r * 2.5, r * .2, r * .1); c.fill();
    c.strokeStyle = '#2B2F38'; c.lineWidth = r * .1;
    if (strap) { c.beginPath(); c.moveTo(x - r * .95, hy - r * .1); c.quadraticCurveTo(x, hy + r * 1.35, x + r * .95, hy - r * .1); c.stroke(); c.fillStyle = '#FFC81F'; c.beginPath(); c.roundRect(x - r * .14, hy + r * .78, r * .28, r * .2, 3); c.fill(); }
    else { c.beginPath(); c.moveTo(x - r * .95, hy - r * .1); c.lineTo(x - r * .9, hy + r * .7); c.moveTo(x + r * .95, hy - r * .1); c.lineTo(x + r * .9, hy + r * .7); c.stroke(); }
    c.restore();
  }
  /* سيارة جانبية: (x,y) منتصف الأسفل، w العرض، dir اتجاه المقدمة */
  function carSide(c, x, y, w, col, dir = 1, o = {}) {
    const h = w * .42, wr = w * .11;
    c.save(); c.translate(x, y); c.scale(dir, 1);
    c.fillStyle = 'rgba(20,30,40,.2)'; c.beginPath(); c.ellipse(0, 2, w * .52, h * .1, 0, 0, TAU); c.fill();
    // الهيكل
    c.fillStyle = lin(c, 0, -h, 0, 0, [col[0], col[1], col[2]]);
    c.beginPath(); c.roundRect(-w / 2, -h * .62 - wr * .4, w, h * .5, h * .2); c.fill();
    c.beginPath(); c.moveTo(-w * .34, -h * .68); c.quadraticCurveTo(-w * .3, -h * 1.08, -w * .12, -h * 1.08); c.lineTo(w * .12, -h * 1.08); c.quadraticCurveTo(w * .26, -h * 1.06, w * .34, -h * .68); c.closePath(); c.fill();
    // النوافذ
    c.fillStyle = lin(c, 0, -h, 0, -h * .6, ['#E6F6FF', '#9FD6F5']);
    c.beginPath(); c.moveTo(-w * .29, -h * .7); c.quadraticCurveTo(-w * .26, -h * .98, -w * .12, -h * .99); c.lineTo(-w * .02, -h * .99); c.lineTo(-w * .02, -h * .7); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(w * .03, -h * .7); c.lineTo(w * .03, -h * .99); c.lineTo(w * .11, -h * .99); c.quadraticCurveTo(w * .22, -h * .97, w * .29, -h * .7); c.closePath(); c.fill();
    if (o.driver) { emo(c, o.driver, w * .17, -h * .66, h * .38); }
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.roundRect(-w * .44, -h * .58, w * .88, h * .07, h * .035); c.fill();
    // الأضواء
    c.fillStyle = '#FFF3A0'; c.beginPath(); c.roundRect(w * .44, -h * .52, w * .05, h * .1, 3); c.fill();
    c.fillStyle = '#FF5A5A'; c.beginPath(); c.roundRect(-w * .49, -h * .52, w * .04, h * .1, 3); c.fill();
    // العجلات
    for (const wx of [-w * .3, w * .3]) {
      c.fillStyle = '#2B2F38'; c.beginPath(); c.arc(wx, -wr, wr, 0, TAU); c.fill();
      c.fillStyle = lin(c, 0, -wr * 1.5, 0, -wr * .5, ['#F5F8FB', '#9AA6B2']); c.beginPath(); c.arc(wx, -wr, wr * .48, 0, TAU); c.fill();
      if (o.spin != null) { c.strokeStyle = '#6F7C89'; c.lineWidth = 2; c.beginPath(); c.moveTo(wx + Math.cos(o.spin) * wr * .45, -wr + Math.sin(o.spin) * wr * .45); c.lineTo(wx - Math.cos(o.spin) * wr * .45, -wr - Math.sin(o.spin) * wr * .45); c.stroke(); }
    }
    c.restore();
  }
  /* سيارة من الخلف (للقيادة) */
  function carRear(c, x, y, w, col, brake, bob) {
    const h = w * .62;
    c.save(); c.translate(x, y + (bob || 0));
    c.fillStyle = 'rgba(20,30,40,.28)'; c.beginPath(); c.ellipse(0, 0, w * .58, h * .12, 0, 0, TAU); c.fill();
    // العجلات
    for (const sd of [-1, 1]) { c.fillStyle = '#23262E'; c.beginPath(); c.roundRect(sd * w * .36 - w * .09, -h * .22, w * .18, h * .24, w * .05); c.fill(); }
    // الهيكل
    c.fillStyle = lin(c, 0, -h * .7, 0, -h * .1, [col[0], col[1], col[2]]);
    c.beginPath(); c.roundRect(-w / 2, -h * .62, w, h * .48, w * .14); c.fill();
    // السقف والنافذة
    c.fillStyle = lin(c, 0, -h, 0, -h * .6, [col[0], col[1]]);
    c.beginPath(); c.roundRect(-w * .36, -h * .98, w * .72, h * .42, [w * .16, w * .16, w * .04, w * .04]); c.fill();
    c.fillStyle = lin(c, 0, -h * .92, 0, -h * .64, ['#3A4A63', '#7FA8C8']);
    c.beginPath(); c.roundRect(-w * .29, -h * .91, w * .58, h * .27, w * .08); c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(-w * .2, -h * .9); c.lineTo(-w * .08, -h * .9); c.lineTo(-w * .2, -h * .66); c.lineTo(-w * .28, -h * .66); c.closePath(); c.fill();
    // رأس السائق (الطفل)
    c.fillStyle = '#3B2416'; c.beginPath(); c.arc(w * .1, -h * .72, w * .09, Math.PI, TAU); c.fill();
    // أضواء خلفية
    for (const sd of [-1, 1]) {
      if (brake) { const g = c.createRadialGradient(sd * w * .38, -h * .45, 2, sd * w * .38, -h * .45, w * .3); g.addColorStop(0, 'rgba(255,60,60,.7)'); g.addColorStop(1, 'rgba(255,60,60,0)'); c.fillStyle = g; c.beginPath(); c.arc(sd * w * .38, -h * .45, w * .3, 0, TAU); c.fill(); }
      c.fillStyle = brake ? '#FF3B3B' : '#B3262A'; c.beginPath(); c.roundRect(sd * w * .38 - w * .08, -h * .5, w * .16, h * .1, h * .04); c.fill();
      c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.roundRect(sd * w * .38 - w * .06, -h * .49, w * .06, h * .03, 2); c.fill();
    }
    // اللوحة
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-w * .14, -h * .36, w * .28, h * .12, 4); c.fill();
    c.fillStyle = '#2B6CC8'; c.font = `900 ${h * .09}px ${EN_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(App.profile && App.profile.name ? '★ ' + (lang === 'ar' ? '٢٠٢٦' : '2026') + ' ★' : '★', 0, -h * .3);
    c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.roundRect(-w * .44, -h * .6, w * .88, h * .06, h * .03); c.fill();
    c.restore();
  }
  /* الإشارة الضوئية: (x,y) أعلى منتصف الصندوق، s نصف قطر المصباح */
  function trafficLight(c, x, y, s, lit, o = {}) {
    const w = s * 2.9, h = s * 7.9;
    c.save();
    if (o.ground) { // العمود
      c.fillStyle = lin(c, x - s * .3, 0, x + s * .3, 0, ['#5E6C7A', '#C9D2DB', '#5E6C7A']);
      c.fillRect(x - s * .28, y + h - 4, s * .56, o.ground - y - h + 4);
      c.fillStyle = 'rgba(20,30,40,.2)'; c.beginPath(); c.ellipse(x, o.ground, s * .9, s * .22, 0, 0, TAU); c.fill();
    }
    c.save(); c.shadowColor = 'rgba(10,20,40,.35)'; c.shadowBlur = s * .6; c.shadowOffsetY = s * .25;
    c.fillStyle = lin(c, x - w / 2, 0, x + w / 2, 0, ['#4A5568', '#2D3748', '#1A202C']);
    c.beginPath(); c.roundRect(x - w / 2, y, w, h, s * .9); c.fill(); c.restore();
    c.strokeStyle = 'rgba(255,255,255,.25)'; c.lineWidth = 2; c.beginPath(); c.roundRect(x - w / 2 + 2, y + 2, w - 4, h - 4, s * .85); c.stroke();
    const cols = [['#FFB3B3', '#FF3B3B', '#B71C1C', '#5A1E22'], ['#FFF3B0', '#FFC81F', '#C98A00', '#5A4A1E'], ['#C4FFB3', '#2FD15A', '#14802E', '#1E4A2A']];
    for (let i = 0; i < 3; i++) {
      const ly = y + s * 1.35 + i * s * 2.6, on = lit === i || lit === LIGHTS[i].id;
      if (on) { const g = c.createRadialGradient(x, ly, s * .5, x, ly, s * 2.4); g.addColorStop(0, cols[i][1] + 'AA'); g.addColorStop(1, cols[i][1] + '00'); c.fillStyle = g; c.beginPath(); c.arc(x, ly, s * 2.4, 0, TAU); c.fill(); }
      c.fillStyle = '#111620'; c.beginPath(); c.arc(x, ly, s * 1.08, 0, TAU); c.fill();
      if (on) ball(c, x, ly, s, '#FFFFFF', cols[i][1], cols[i][2]);
      else { c.fillStyle = cols[i][3]; c.beginPath(); c.arc(x, ly, s, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.arc(x - s * .3, ly - s * .3, s * .3, 0, TAU); c.fill(); }
      // الحاجب
      c.fillStyle = '#1A202C'; c.beginPath(); c.arc(x, ly - s * .1, s * 1.22, Math.PI * 1.08, Math.PI * 1.92); c.lineTo(x + s * .9, ly - s * .55); c.quadraticCurveTo(x, ly - s * 1.0, x - s * .9, ly - s * .55); c.closePath(); c.fill();
      if (o.glowI === i) { c.strokeStyle = '#FFE04A'; c.lineWidth = 4; c.shadowColor = '#FFD000'; c.shadowBlur = 12; c.beginPath(); c.arc(x, ly, s * 1.25, 0, TAU); c.stroke(); c.shadowBlur = 0; }
    }
    c.restore();
    return { w, h, lamp: i => ({ x, y: y + s * 1.35 + i * s * 2.6, r: s * 1.2 }) };
  }
  /* إشارة المشاة: رجل أحمر واقف / رجل أخضر يمشي */
  function pedLight(c, x, y, s, green, ground) {
    c.save();
    if (ground) { c.fillStyle = lin(c, x - s * .12, 0, x + s * .12, 0, ['#5E6C7A', '#C9D2DB', '#5E6C7A']); c.fillRect(x - s * .1, y + s * 2.6, s * .2, ground - y - s * 2.6); }
    c.fillStyle = lin(c, x - s, 0, x + s, 0, ['#4A5568', '#2D3748']); c.beginPath(); c.roundRect(x - s * .8, y, s * 1.6, s * 2.6, s * .3); c.fill();
    for (let i = 0; i < 2; i++) {
      const cy = y + s * .68 + i * s * 1.25, on = green ? i === 1 : i === 0, col = i === 0 ? '#FF4040' : '#30E060';
      c.fillStyle = '#10141C'; c.beginPath(); c.roundRect(x - s * .58, cy - s * .55, s * 1.16, s * 1.1, s * .2); c.fill();
      c.fillStyle = on ? col : (i === 0 ? '#4A2024' : '#1E4028');
      if (on) { c.shadowColor = col; c.shadowBlur = s * .6; }
      c.beginPath(); c.arc(x, cy - s * .32, s * .13, 0, TAU); c.fill();
      c.strokeStyle = c.fillStyle; c.lineWidth = s * .14; c.lineCap = 'round';
      c.beginPath();
      if (i === 0) { c.moveTo(x, cy - s * .15); c.lineTo(x, cy + s * .15); c.moveTo(x - s * .18, cy - s * .08); c.lineTo(x + s * .18, cy - s * .08); c.moveTo(x, cy + s * .15); c.lineTo(x - s * .1, cy + s * .42); c.moveTo(x, cy + s * .15); c.lineTo(x + s * .1, cy + s * .42); }
      else { c.moveTo(x + s * .03, cy - s * .15); c.lineTo(x - s * .02, cy + s * .14); c.moveTo(x - s * .2, cy); c.lineTo(x + s * .2, cy - s * .12); c.moveTo(x - s * .02, cy + s * .14); c.lineTo(x - s * .22, cy + s * .42); c.moveTo(x - s * .02, cy + s * .14); c.lineTo(x + s * .2, cy + s * .4); }
      c.stroke(); c.shadowBlur = 0;
    }
    c.restore();
  }
  /* لافتات المرور: (x,y) المركز، r نصف القطر */
  function walker(c, x, y, s, col) {
    c.save(); c.fillStyle = col; c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = s * .16;
    c.beginPath(); c.arc(x + s * .05, y - s * .55, s * .14, 0, TAU); c.fill();
    c.beginPath(); c.moveTo(x, y - s * .35); c.lineTo(x - s * .05, y + s * .08); c.moveTo(x - s * .05, y + s * .08); c.lineTo(x - s * .28, y + s * .5); c.moveTo(x - s * .05, y + s * .08); c.lineTo(x + s * .22, y + s * .48);
    c.moveTo(x - s * .25, y - s * .1); c.lineTo(x, y - s * .3); c.lineTo(x + s * .25, y - s * .05); c.stroke(); c.restore();
  }
  function sign(c, kind, x, y, r, o = {}) {
    c.save(); c.translate(x, y);
    if (o.pole) { c.fillStyle = lin(c, -r * .08, 0, r * .08, 0, ['#6F7C89', '#E6ECF2', '#6F7C89']); c.fillRect(-r * .07, 0, r * .14, o.pole); }
    c.shadowColor = 'rgba(10,20,40,.3)'; c.shadowBlur = r * .2; c.shadowOffsetY = r * .08;
    if (kind === 'stop') {
      const P = []; for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; P.push([Math.cos(a) * r, Math.sin(a) * r]); }
      c.fillStyle = '#fff'; c.beginPath(); P.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b)); c.closePath(); c.fill(); c.shadowColor = 'transparent';
      c.fillStyle = lin(c, 0, -r, 0, r, ['#FF6B6B', '#E02424', '#A51515']); c.beginPath(); P.forEach(([a, b], i) => i ? c.lineTo(a * .88, b * .88) : c.moveTo(a * .88, b * .88)); c.closePath(); c.fill();
      c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle';
      const ar = o.lang ? o.lang === 'ar' : lang === 'ar';
      c.font = `900 ${r * (ar ? .62 : .42)}px ${ar ? FONT : EN_FONT}`; c.fillText(ar ? 'قف' : 'STOP', 0, r * (ar ? .02 : .04));
    } else if (kind === 'noentry') {
      c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill(); c.shadowColor = 'transparent';
      c.fillStyle = lin(c, 0, -r, 0, r, ['#FF6B6B', '#E02424', '#A51515']); c.beginPath(); c.arc(0, 0, r * .88, 0, TAU); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-r * .62, -r * .15, r * 1.24, r * .3, r * .06); c.fill();
    } else if (kind === 'cross') {
      c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-r, -r, r * 2, r * 2, r * .25); c.fill(); c.shadowColor = 'transparent';
      c.fillStyle = lin(c, 0, -r, 0, r, ['#5DA8FF', '#1F6FE0', '#134EA8']); c.beginPath(); c.roundRect(-r * .88, -r * .88, r * 1.76, r * 1.76, r * .18); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.moveTo(0, -r * .72); c.lineTo(r * .72, r * .6); c.lineTo(-r * .72, r * .6); c.closePath(); c.fill();
      c.fillStyle = '#1A1A1A'; for (let i = 0; i < 4; i++) c.fillRect(-r * .5 + i * r * .28, r * .44, r * .16, r * .1);
      walker(c, 0, r * .05, r * .62, '#1A1A1A');
    } else if (kind === 'school') {
      c.fillStyle = '#fff'; c.beginPath(); c.moveTo(0, -r * 1.05); c.lineTo(r, -r * .1); c.lineTo(r, r * .95); c.lineTo(-r, r * .95); c.lineTo(-r, -r * .1); c.closePath(); c.fill(); c.shadowColor = 'transparent';
      c.fillStyle = lin(c, 0, -r, 0, r, ['#FFF27A', '#FFD21F', '#E0A800']); c.beginPath(); c.moveTo(0, -r * .9); c.lineTo(r * .87, -r * .05); c.lineTo(r * .87, r * .83); c.lineTo(-r * .87, r * .83); c.lineTo(-r * .87, -r * .05); c.closePath(); c.fill();
      walker(c, -r * .28, r * .25, r * .62, '#1A1A1A'); walker(c, r * .3, r * .32, r * .48, '#1A1A1A');
      c.fillStyle = '#1A1A1A'; c.fillRect(-r * .7, r * .66, r * 1.4, r * .07);
    } else if (kind === 'lights') {
      c.fillStyle = '#fff'; c.beginPath(); c.moveTo(0, -r * 1.05); c.lineTo(r * 1.08, r * .85); c.lineTo(-r * 1.08, r * .85); c.closePath(); c.fill(); c.shadowColor = 'transparent';
      c.fillStyle = '#E02424'; c.beginPath(); c.moveTo(0, -r * .9); c.lineTo(r * .94, r * .76); c.lineTo(-r * .94, r * .76); c.closePath(); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.moveTo(0, -r * .56); c.lineTo(r * .64, r * .6); c.lineTo(-r * .64, r * .6); c.closePath(); c.fill();
      c.fillStyle = '#2D3748'; c.beginPath(); c.roundRect(-r * .13, -r * .25, r * .26, r * .76, r * .08); c.fill();
      ['#FF3B3B', '#FFC81F', '#2FD15A'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(0, -r * .13 + i * r * .25, r * .085, 0, TAU); c.fill(); });
    }
    c.restore();
  }

  /* ---------- البطاقات (أزرار مرسومة) ---------- */
  function card(c, b, o = {}) {
    const pop = b.pop || 0, sq = Math.sin((1 - pop) * Math.PI * 3) * pop * .08;
    const sx = b.shk > 0 ? Math.sin(b.shk * 40) * 6 * b.shk : 0;
    const cx = b.x + b.w / 2 + sx, cy = b.y + b.h / 2;
    c.save(); c.translate(cx, cy); c.scale((1 + sq) * (b.sc || 1), (1 - sq) * (b.sc || 1)); c.translate(-b.w / 2, -b.h / 2);
    const col = b.col || '#3D9BE8', r = Math.min(b.w, b.h) * .2;
    if (b.glow > 0) { c.save(); c.globalAlpha = .5 + .5 * Math.sin(T * 8); c.shadowColor = '#FFD000'; c.shadowBlur = 24; c.strokeStyle = '#FFE04A'; c.lineWidth = 6; c.beginPath(); c.roundRect(-4, -4, b.w + 8, b.h + 8, r + 4); c.stroke(); c.restore(); }
    c.fillStyle = shadeCol(col); c.beginPath(); c.roundRect(0, 6, b.w, b.h, r); c.fill();
    c.fillStyle = b.fill || '#fff'; c.beginPath(); c.roundRect(0, 0, b.w, b.h, r); c.fill();
    c.strokeStyle = col; c.lineWidth = Math.max(3, Math.min(b.w, b.h) * .045); c.beginPath(); c.roundRect(2, 2, b.w - 4, b.h - 4, r - 2); c.stroke();
    if (!b.fill) { c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.roundRect(b.w * .1, 6, b.w * .8, b.h * .12, b.h * .06); c.fill(); }
    if (b.ok) { c.fillStyle = 'rgba(47,179,68,.12)'; c.beginPath(); c.roundRect(4, 4, b.w - 8, b.h - 8, r - 4); c.fill(); }
    if (b.draw) b.draw(c, b.w / 2, b.h / 2, b);
    if (b.ok) { c.font = `${Math.min(b.w, b.h) * .26}px ${EMOJI_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('✅', b.w - Math.min(b.w, b.h) * .16, Math.min(b.w, b.h) * .16); }
    c.restore();
  }
  const SHADES = {};
  function shadeCol(hex) {
    if (SHADES[hex]) return SHADES[hex];
    const n = parseInt(hex.slice(1), 16), ch = [n >> 16, n >> 8 & 255, n & 255].map(v => Math.round(v * .72));
    return (SHADES[hex] = '#' + ch.map(v => v.toString(16).padStart(2, '0')).join(''));
  }
  function text(c, t, x, y, size, col, o = {}) {
    const en = o.en != null ? o.en : lang === 'en';
    c.save(); c.font = `900 ${size}px ${en ? EN_FONT : FONT}`; c.direction = en ? 'ltr' : 'rtl';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    let s = size; while (o.max && c.measureText(t).width > o.max && s > 9) { s -= 1; c.font = `900 ${s}px ${en ? EN_FONT : FONT}`; }
    if (o.stroke) { c.lineWidth = s * .22; c.strokeStyle = o.stroke; c.lineJoin = 'round'; c.strokeText(t, x, y); }
    c.fillStyle = col; c.fillText(t, x, y); c.restore();
  }
  function bubble(c, t, x, y, size, col = '#2B6C9A') {
    c.save(); c.font = `900 ${size}px ${lang === 'en' ? EN_FONT : FONT}`; c.direction = lang === 'en' ? 'ltr' : 'rtl';
    const w = c.measureText(t).width + size * 1.6, h = size * 1.75;
    x = clamp(x, w / 2 + 6, W - w / 2 - 6);
    c.shadowColor = 'rgba(0,0,0,.15)'; c.shadowBlur = 8; c.shadowOffsetY = 3;
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, h / 2); c.fill(); c.shadowColor = 'transparent';
    c.strokeStyle = col; c.lineWidth = 3; c.stroke();
    c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, x, y + 1);
    c.restore();
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #traffic{background:#BFE6FF;overflow:hidden;color:#1E3A5A}
  #traffic canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #traffic .ib{color:#1F6BB0}
  #traffic .lang{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 rgba(20,60,120,.18),0 8px 16px rgba(20,50,100,.15)}
  #traffic .lang button{min-width:66px;padding:6px 12px;border-radius:99px;font-weight:900;font-size:17px;background:#EEF5FC;color:#2A6AB0;line-height:1.25}
  #traffic .lang button[data-l=en]{font-family:system-ui,"Segoe UI",sans-serif;font-size:16px}
  #traffic .lang button.on{background:linear-gradient(#6FB8FF,#2E86F5);color:#fff;box-shadow:0 3px 0 #1A5FC2;text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #traffic .prog{position:absolute;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 58px);display:flex;gap:4px;padding:6px 10px;background:rgba(255,255,255,.92);border-radius:99px;z-index:4;box-shadow:0 3px 0 rgba(0,0,0,.08),0 6px 14px rgba(0,0,0,.08)}
  #traffic .prog i{width:22px;height:11px;border-radius:6px;background:#E2E8EE;box-shadow:inset 0 2px 0 rgba(0,0,0,.08);transition:background .3s}
  #traffic .prog i.on{background:linear-gradient(#FFC861,#FF8A1F);box-shadow:0 2px 0 #D06A00;animation:tfPop .45s cubic-bezier(.3,1.8,.5,1)}
  @keyframes tfPop{40%{transform:scale(1.5,1.3)}}
  #traffic .sayb{position:absolute;z-index:5;width:54px;height:54px;flex:none;font-size:25px;top:calc(max(10px,env(safe-area-inset-top)) + 54px);left:max(12px,env(safe-area-inset-left))}
  #traffic .hint{top:calc(max(10px,env(safe-area-inset-top)) + 96px)}
  #traffic .hint span{color:#1F5A9A;max-width:86vw}
  #traffic .overlay{background:radial-gradient(circle at 50% 45%,rgba(20,60,110,.25),rgba(10,30,60,.55))}
  #traffic .panel{border:5px solid #CFE6FF;box-shadow:0 8px 0 #8DBDF0,0 20px 40px rgba(10,40,90,.3);color:#1E3A5A}
  #traffic .panel h3{color:#2E86F5;text-shadow:0 3px 0 #D8EBFF}
  #traffic .btn{background:linear-gradient(#6FB8FF,#2E86F5);box-shadow:0 5px 0 #1A5FC2,0 8px 12px rgba(30,90,200,.25)}
  #traffic .btn:active{box-shadow:0 1px 0 #1A5FC2}
  #traffic .btn.alt{background:#fff;color:#2A6AB0;box-shadow:0 5px 0 #B9D8F5;border:3px solid #DDEBFA}
  #traffic .wpair{white-space:nowrap;font-size:44px;line-height:1.1;margin:2px 0;font-family:${EMOJI_FONT}}
  #traffic .lvp{width:min(94vw,440px);max-height:88vh;overflow-y:auto;touch-action:pan-y}
  #traffic .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:10px 0 12px}
  #traffic .lvb{position:relative;aspect-ratio:.9;border-radius:20px;background:#fff;border:3px solid #CFE6FF;box-shadow:0 5px 0 #A9CFF2;
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#2A6AB0;font-weight:900;padding:2px}
  #traffic .lvb:active{transform:translateY(3px);box-shadow:0 2px 0 #A9CFF2}
  #traffic .lvb .n{font-size:13px;position:absolute;top:2px;right:8px;opacity:.7}
  #traffic .lvb .e{font-size:30px;line-height:1.15;font-family:${EMOJI_FONT}}
  #traffic .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:12px}
  #traffic .lvb .s i{font-style:normal}
  #traffic .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #traffic .lvb.cur{outline:3px solid #FF9A1F;outline-offset:2px}
  #traffic .lvb.lock{background:#EEF1F5;border-color:#DDE3EA;box-shadow:0 5px 0 #C9D2DC;color:#8A96A3}
  #traffic .lvb.lock .e{filter:grayscale(1);opacity:.35}
  #traffic .lvb.lock::after{content:'🔒';position:absolute;font-size:18px;bottom:3px}
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
    <div class="overlay" id="tfLv"><div class="panel lvp"><h3>🔢 المستويات</h3><div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="tfWin"><div class="panel">
      <h3 class="wT"></h3><div class="wpair"></div><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const progEl = root.querySelector('.prog'), sayBtn = root.querySelector('.sayb');
  const hintEl = root.querySelector('.hint'), hintT = root.querySelector('.hintT');
  const lvOv = root.querySelector('#tfLv'), winOv = root.querySelector('#tfWin');

  /* ---------- الحالة العامة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, portrait = true;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, def = LEVELS[0], A = null;
  let parts = [], rings = [], tasks = [], done = 0, total = 1, mistakes = 0, over = false, shake = 0, idleT = 0;
  let stage = { x: 0, y: 0, w: 0, h: 0 }, bgLayer = null, bgKey = '';
  let hintFn = null;
  const later = (s, fn) => { const tok = A; tasks.push({ t: s, fn: () => { if (tok === A) fn(); } }); };

  function showHint(fn) { hintFn = fn; hintT.textContent = fn(); hintEl.style.opacity = 1; }
  function hideHint() { hintEl.style.opacity = 0; }
  function setProg() {
    progEl.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    progEl.innerHTML = Array.from({ length: total }, (_, i) => `<i class="${i < done ? 'on' : ''}"></i>`).join('');
  }
  function step() { done++; const i = progEl.children[done - 1]; if (i) i.classList.add('on'); Sound.star(); }
  function miss() { mistakes++; Sound.error(); vibrate(25); shake = Math.max(shake, 3); }
  function sparkle(x, y, col = '#FF8AC2', n = 16) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU), v = rand(80, 240);
      parts.push({ t: 'star', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .9), age: 0, s: rand(5, 9), c: i % 2 ? '#FFE26B' : col });
    }
    rings.push({ x, y, age: 0, life: .45 });
  }

  /* =====================================================================
     الخلفيات
     ===================================================================== */
  function cloud(x, cx, cy, s) {
    const blobs = [[-1, .15, .55], [-.45, -.2, .75], [.2, -.3, .8], [.8, .05, .6], [.25, .2, .7], [-.4, .25, .6]];
    x.save(); x.shadowColor = 'rgba(80,140,200,.25)'; x.shadowBlur = s * .3; x.shadowOffsetY = s * .12;
    x.fillStyle = '#fff'; x.beginPath(); for (const [a, b, r] of blobs) { x.moveTo(cx + a * s + r * s, cy + b * s); x.arc(cx + a * s, cy + b * s, r * s, 0, TAU); } x.fill(); x.restore();
  }
  function tree(x, cx, gy, s) {
    x.fillStyle = 'rgba(30,60,20,.18)'; x.beginPath(); x.ellipse(cx + s * .1, gy, s * .5, s * .12, 0, 0, TAU); x.fill();
    x.fillStyle = lin(x, cx - s * .1, 0, cx + s * .1, 0, ['#B07A45', '#7A4E25']); x.beginPath(); x.roundRect(cx - s * .08, gy - s * .55, s * .16, s * .55, s * .05); x.fill();
    ball(x, cx - s * .22, gy - s * .7, s * .3, '#B6EE7A', '#5DBB3A', '#2F8A2A');
    ball(x, cx + s * .22, gy - s * .72, s * .3, '#B6EE7A', '#5DBB3A', '#2F8A2A');
    ball(x, cx, gy - s * .95, s * .38, '#C4F58A', '#62C23E', '#2F8A2A');
  }
  function building(x, bx, by, w, h, col, R) {
    x.fillStyle = 'rgba(20,40,70,.15)'; x.fillRect(bx + 4, by - h + 4, w, h);
    x.fillStyle = lin(x, bx, 0, bx + w, 0, [col[0], col[1]]); x.beginPath(); x.roundRect(bx, by - h, w, h, [w * .12, w * .12, 0, 0]); x.fill();
    x.fillStyle = 'rgba(255,255,255,.3)'; x.fillRect(bx + 3, by - h + 3, w * .12, h - 6);
    const cols = Math.max(2, Math.floor(w / 16)), rows = Math.max(2, Math.floor(h / 20));
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows - 1; j++) {
      x.fillStyle = R() < .3 ? '#FFF2B0' : 'rgba(210,235,255,.9)';
      x.beginPath(); x.roundRect(bx + w * (i + .25) / cols, by - h + 8 + j * (h - 10) / rows, w / cols * .5, (h - 10) / rows * .5, 2); x.fill();
    }
  }
  function sky(x, hz) {
    let g = x.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, '#6EC3FF'); g.addColorStop(1, '#DDF3FF');
    x.fillStyle = g; x.fillRect(0, 0, W, hz + 2);
    const sx = W * .84, sy = Math.max(110, hz * .45), sr = Math.min(W, H) * .055;
    g = x.createRadialGradient(sx, sy, sr * .2, sx, sy, sr * 3); g.addColorStop(0, 'rgba(255,240,170,.85)'); g.addColorStop(1, 'rgba(255,240,170,0)');
    x.fillStyle = g; x.fillRect(sx - sr * 3, sy - sr * 3, sr * 6, sr * 6);
    ball(x, sx, sy, sr, '#FFFBE0', '#FFD84A', '#FFB020');
    const cs = Math.min(W, H) * .04;
    cloud(x, W * .16, Math.max(120, hz * .5), cs); cloud(x, W * .55, Math.max(100, hz * .32), cs * .8);
  }
  function city(x, hz, seed) {
    const R = rng(seed), pal = [['#FFB8A8', '#F08A7A'], ['#B8D8FF', '#86B6F0'], ['#FFE3A0', '#F2C460'], ['#C8F0C0', '#90D488'], ['#E4C8FF', '#B894EE']];
    let bx = -10; while (bx < W) { const w = 34 + R() * 46, h = 40 + R() * Math.min(110, hz * .5); building(x, bx, hz + 2, w, h, pal[Math.floor(R() * pal.length)], R); bx += w + 4 + R() * 10; }
  }
  /* شارع بمنظور: الطريق يمتد نحو الأفق */
  function bgStreet(x) {
    const hz = drive.hz;
    sky(x, hz); city(x, hz, 5);
    // الأرض
    x.fillStyle = lin(x, 0, hz, 0, H, ['#B6E77E', '#5DB53A']); x.fillRect(0, hz, W, H - hz);
    const vx = W / 2, rb = drive.rb, yb = H;
    const at = t => ({ y: lerp(hz, yb, t), hw: lerp(4, rb, t) });
    // الرصيف
    x.fillStyle = '#E9E2D6'; x.beginPath(); x.moveTo(vx - 10, hz); x.lineTo(vx + 10, hz); x.lineTo(vx + rb * 1.35, yb); x.lineTo(vx - rb * 1.35, yb); x.closePath(); x.fill();
    // الطريق
    x.fillStyle = lin(x, 0, hz, 0, H, ['#7A8494', '#4A5363']); x.beginPath(); x.moveTo(vx - 4, hz); x.lineTo(vx + 4, hz); x.lineTo(vx + rb, yb); x.lineTo(vx - rb, yb); x.closePath(); x.fill();
    // حافة حمراء وبيضاء
    for (const sd of [-1, 1]) {
      for (let i = 0; i < 26; i++) {
        const t0 = Math.pow(i / 26, 1.6), t1 = Math.pow((i + 1) / 26, 1.6), a = at(t0), b = at(t1);
        x.fillStyle = i % 2 ? '#fff' : '#F04848';
        x.beginPath(); x.moveTo(vx + sd * a.hw, a.y); x.lineTo(vx + sd * a.hw * 1.07, a.y); x.lineTo(vx + sd * b.hw * 1.07, b.y); x.lineTo(vx + sd * b.hw, b.y); x.closePath(); x.fill();
      }
    }
    // أشجار على الجانبين
    const R = rng(9);
    for (let i = 0; i < 6; i++) { const t = .15 + i * .14, a = at(t), s = lerp(14, 90, t); for (const sd of [-1, 1]) tree(x, vx + sd * (a.hw * 1.5 + s * .4 + R() * 10), a.y, s); }
  }
  /* منظر جانبي للشارع (العبور، السيارة) */
  function bgSide(x, zebra) {
    const S = side;
    sky(x, S.farY);
    city(x, S.farY - S.walkH * .2, 3);
    // الرصيف البعيد
    x.fillStyle = lin(x, 0, S.farY - S.walkH * .2, 0, S.roadT, ['#F2ECE2', '#D9D0C2']); x.fillRect(0, S.farY - S.walkH * .2, W, S.roadT - S.farY + S.walkH * .2);
    x.fillStyle = '#BFB5A6'; x.fillRect(0, S.roadT - 6, W, 6);
    // الطريق
    x.fillStyle = lin(x, 0, S.roadT, 0, S.roadB, ['#69727F', '#4C5562']); x.fillRect(0, S.roadT, W, S.roadB - S.roadT);
    x.fillStyle = '#F2D23A'; for (let xx = 10; xx < W; xx += 46) { x.beginPath(); x.roundRect(xx, (S.roadT + S.roadB) / 2 - 3, 26, 6, 3); x.fill(); }
    if (zebra) {
      x.fillStyle = '#FFFFFF';
      const n = Math.max(5, Math.round((S.roadB - S.roadT) / 18)), sh = (S.roadB - S.roadT) / n;
      for (let i = 0; i < n; i++) { x.beginPath(); x.roundRect(S.zx - S.zw / 2, S.roadT + i * sh + sh * .2, S.zw, sh * .6, 4); x.fill(); }
    }
    // الرصيف القريب
    x.fillStyle = '#BFB5A6'; x.fillRect(0, S.roadB, W, 8);
    x.fillStyle = lin(x, 0, S.roadB + 8, 0, H, ['#F5EFE6', '#DCD2C3']); x.fillRect(0, S.roadB + 8, W, H - S.roadB - 8);
    x.strokeStyle = 'rgba(150,135,115,.35)'; x.lineWidth = 2;
    for (let xx = 0; xx < W; xx += 54) { x.beginPath(); x.moveTo(xx, S.roadB + 8); x.lineTo(xx - 20, H); x.stroke(); }
    // شجيرات على الرصيف البعيد
    for (let xx = W * .06; xx < W; xx += W * .32) { if (zebra && Math.abs(xx - S.zx) < S.zw * 1.6) continue; tree(x, xx, S.roadT - 6, Math.min(70, S.walkH * 1.2)); }
  }
  function bgPark(x) {
    const hz = stage.y + stage.h * .3;
    sky(x, hz);
    x.fillStyle = '#8FD86A'; x.beginPath(); x.ellipse(W * .2, hz + 8, W * .5, 30, 0, Math.PI, TAU); x.ellipse(W * .85, hz + 10, W * .45, 26, 0, Math.PI, TAU); x.fill();
    x.fillStyle = lin(x, 0, hz, 0, H, ['#A4E36A', '#56B53A']); x.fillRect(0, hz, W, H - hz);
    // مسار الدراجات
    const py = bike.gy;
    x.fillStyle = '#E8C99A'; x.beginPath(); x.roundRect(-10, py - 18, W + 20, 40, 20); x.fill();
    x.fillStyle = 'rgba(255,255,255,.6)'; for (let xx = 0; xx < W; xx += 40) x.fillRect(xx, py + 1, 20, 3);
    const R = rng(4);
    for (let i = 0; i < 5; i++) tree(x, W * (.08 + i * .22) + R() * 20, hz + 14, Math.min(W, H) * .1);
    for (let i = 0; i < 12; i++) { const fx = R() * W, fy = lerp(py + 40, H - 10, R()); ball(x, fx, fy, 5, '#fff', ['#FF7BAC', '#FFB03A', '#B78CFF'][i % 3], ['#FF7BAC', '#FFB03A', '#B78CFF'][i % 3]); }
  }
  function bgHome(x) {
    const fy = stage.y + stage.h * .55;
    x.fillStyle = lin(x, 0, 0, 0, fy, ['#FFF1D6', '#FFE2B8']); x.fillRect(0, 0, W, fy);
    x.fillStyle = 'rgba(255,255,255,.4)'; for (let xx = 0; xx < W; xx += 40) x.fillRect(xx, 0, 18, fy);
    x.fillStyle = lin(x, 0, fy, 0, H, ['#E0A868', '#B87A3E']); x.fillRect(0, fy, W, H - fy);
    x.strokeStyle = 'rgba(90,50,10,.25)'; x.lineWidth = 2; for (let yy = fy + 20; yy < H; yy += 26) { x.beginPath(); x.moveTo(0, yy); x.lineTo(W, yy); x.stroke(); }
  }
  function buildBg() {
    const key = def.a + '|' + (def.set || '') + '|' + W + 'x' + H + '|' + dpr;
    if (bgKey === key && bgLayer) return;
    bgKey = key;
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const a = def.a;
    if (a === 'cross' || a === 'seat') bgSide(x, a === 'cross');
    else if (a === 'bike') bgPark(x);
    else if (a === 'quiz' && def.set === 'home') bgHome(x);
    else bgStreet(x);
  }

  /* =====================================================================
     الأنشطة
     ===================================================================== */
  const drive = { hz: 0, rb: 0 };
  const side = { farY: 0, roadT: 0, roadB: 0, zx: 0, zw: 0, walkH: 0, nearY: 0 };
  const bike = { gy: 0 };

  function layoutCommon() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    portrait = W / H < 1.05;
    const top = progEl.getBoundingClientRect().bottom + 44;
    const sw = Math.min(W - 16, portrait ? 640 : 1000);
    stage = { x: (W - sw) / 2, y: top, w: sw, h: H - top - Math.max(10, H * .015) };
    drive.hz = stage.y + stage.h * (portrait ? .22 : .2); drive.rb = Math.max(W * .5, 260) * (portrait ? 1.05 : .75);
    side.farY = stage.y + stage.h * .2; side.walkH = stage.h * .1;
    side.roadT = stage.y + stage.h * .3; side.roadB = stage.y + stage.h * .58;
    side.zw = Math.min(130, W * .26); side.zx = portrait ? W * .64 : W * .58; side.nearY = stage.y + stage.h * .74;
    bike.gy = stage.y + stage.h * .62;
  }

  /* ---------- ١) تعلّم الإشارة الضوئية + أسئلة ---------- */
  function mkLight() {
    const st = { seen: [0, 0, 0], lit: -1, phase: 'learn', pose: -1, q: null, qn: 0, btns: [], order: shuffle(['red', 'yellow', 'green', ['red', 'green'][Math.floor(Math.random() * 2)]]) };
    total = 3 + st.order.length;
    const lay = () => {
      const s = clamp(Math.min(stage.h * .062, stage.w * .1), 18, 46);
      st.s = s; st.lx = portrait ? stage.x + stage.w * .26 : W * .4; st.ly = stage.y + stage.h * .04;
      st.ground = stage.y + stage.h * .66;
      st.kx = portrait ? stage.x + stage.w * .78 : W * .62; st.kh = Math.min(stage.h * .3, 200);
      const bh = Math.min(stage.h * .22, 150), bw = Math.min((stage.w - 40) / 3, 170), gap = 12, tw = bw * 3 + gap * 2;
      st.btns.forEach((b, i) => { b.w = bw; b.h = bh; b.x = W / 2 - tw / 2 + (lang === 'ar' ? 2 - i : i) * (bw + gap); b.y = stage.y + stage.h - bh - 8; });
    };
    const learnHint = () => showHint(() => '👆 ' + L(App.g('المسي كل ضوء', 'المس كل ضوء'), 'Touch each light'));
    const sayLearn = () => say(App.g('المسي كل ضوء', 'المس كل ضوء'), 'Touch each light');
    function ask() {
      st.q = st.order[st.qn]; st.lit = st.q; st.tries = 0; st.answered = false; st.pose = -1;
      st.btns.forEach(b => { b.ok = false; b.glow = 0; b.pop = 1; });
      Sound.tone(660, .1, 'sine', .1, 200);
      later(.3, () => say('ماذا نفعل؟', 'What do we do?'));
    }
    function startQuiz() {
      st.phase = 'quiz';
      st.btns = ACTIONS.map((a, i) => ({ i, col: a.col, pop: 1, draw: (c, cx, cy, b) => { emo(c, a.e, cx, cy + b.h * .12, b.h * .42); text(c, L(a.ar, a.en), cx, cy + b.h * .3, b.h * .17, a.col, { max: b.w * .9 }); } }));
      lay(); showHint(() => '🚦 ' + L('ماذا نفعل؟', 'What do we do?')); ask();
    }
    return {
      init() { lay(); learnHint(); later(.4, sayLearn); },
      layout: lay,
      replay() { if (st.phase === 'learn') sayLearn(); else say('ماذا نفعل؟', 'What do we do?'); },
      down(p) {
        if (st.phase === 'learn') {
          for (let i = 0; i < 3; i++) {
            const lp = { x: st.lx, y: st.ly + st.s * 1.35 + i * st.s * 2.6 };
            if (Math.hypot(p.x - lp.x, p.y - lp.y) < st.s * 1.5) {
              st.lit = i; st.pose = i; st.kpop = 1; Sound.tone([392, 523, 659][i], .25, 'triangle', .15);
              sayRule(LIGHTS[i]); sparkle(lp.x, lp.y, LIGHTS[i].id === 'red' ? '#FF5A5A' : LIGHTS[i].id === 'green' ? '#40E070' : '#FFC81F', 10);
              if (!st.seen[i]) { st.seen[i] = 1; step(); if (st.seen.every(Boolean)) later(2.6, startQuiz); }
              return;
            }
          }
          return;
        }
        if (st.answered) return;
        const b = st.btns.find(b => inR(p, b)); if (!b) return;
        const li = LIGHTS.find(l => l.id === st.q);
        if (b.i === li.act) {
          st.answered = true; b.ok = true; b.pop = 1; st.pose = li.act; st.kpop = 1; step();
          sparkle(b.x + b.w / 2, b.y + b.h / 2, b.col); sayRule(li);
          st.qn++; later(2.4, () => { if (st.qn >= st.order.length) finish(); else ask(); });
        } else {
          miss(); b.shk = 1; st.tries++; later(.3, sayTry);
          if (st.tries >= 2) st.btns[li.act].glow = 4;
        }
      },
      update(dt) { st.kpop = Math.max(0, (st.kpop || 0) - dt * 2.4); st.btns.forEach(b => { b.pop = Math.max(0, (b.pop || 0) - dt * 2.4); b.shk = Math.max(0, (b.shk || 0) - dt * 2.2); b.glow = Math.max(0, (b.glow || 0) - dt); }); },
      draw() {
        const litI = typeof st.lit === 'number' ? st.lit : LIGHTS.findIndex(l => l.id === st.lit);
        const glowI = st.phase === 'learn' ? st.seen.findIndex(v => !v) : -1;
        trafficLight(ctx, st.lx, st.ly, st.s, litI, { ground: st.ground, glowI: glowI >= 0 && Math.sin(T * 5) > 0 ? glowI : -1 });
        // الطفل يتفاعل
        const pose = st.pose, kh = st.kh * (1 + Math.sin((1 - (st.kpop || 0)) * Math.PI * 3) * (st.kpop || 0) * .05);
        person(ctx, st.kx, st.ground, kh, { stop: pose === 0, walk: pose === 2 ? T * 8 : null, look: pose === 1 ? Math.sin(T * 2) : 0 });
        if (pose >= 0) { const a = ACTIONS[pose]; bubble(ctx, a.e + ' ' + L(a.ar, a.en), st.kx, st.ground - kh - 26, clamp(kh * .1, 14, 22), a.col); }
        if (st.phase === 'learn') {
          // أسماء الألوان بجانب المصابيح
          for (let i = 0; i < 3; i++) {
            const ly = st.ly + st.s * 1.35 + i * st.s * 2.6, lx = st.lx + st.s * 2.1 * (lang === 'ar' ? -1 : 1) - (lang === 'ar' ? st.s * 1.2 : -st.s * 1.2);
            if (st.seen[i]) { const fs = clamp(st.s * .55, 13, 22); ctx.save(); ctx.font = `900 ${fs}px ${lang === 'en' ? EN_FONT : FONT}`; const tw = ctx.measureText(L(LIGHTS[i].ar, LIGHTS[i].en)).width; ctx.restore(); text(ctx, L(LIGHTS[i].ar, LIGHTS[i].en), st.lx + st.s * 1.45 + 10 + tw / 2, ly, fs, ['#E02424', '#D08A00', '#1F9A3A'][i], { stroke: '#fff' }); }
          }
          if (glowI >= 0) { const t = (T * .9) % 1; ctx.save(); ctx.globalAlpha = t > .8 ? (1 - t) / .2 : 1; emo(ctx, '👆', st.lx + st.s * .8, st.ly + st.s * 1.35 + glowI * st.s * 2.6 + st.s * 1.8 + Math.sin(t * Math.PI) * -10, st.s * 1.6); ctx.restore(); }
        } else st.btns.forEach(b => card(ctx, b));
      },
      _s: () => ({ phase: st.phase, q: st.q, lamps: [0, 1, 2].map(i => ({ x: st.lx, y: st.ly + st.s * 1.35 + i * st.s * 2.6 })), btns: st.btns.map(b => ({ i: b.i, x: b.x + b.w / 2, y: b.y + b.h / 2 })), ans: st.q ? LIGHTS.find(l => l.id === st.q).act : -1 })
    };
  }

  /* ---------- ٢) القيادة عند الإشارة ---------- */
  function mkDrive() {
    const F = 7, ZLINE0 = 70;
    const st = { round: 0, z: ZLINE0, v: 0, light: 'green', brake: false, phase: 'approach', t: 0, odo: 0, waitT: 0, peds: [], btns: [], lastSay: 0, helped: false };
    const rounds = def.rounds, sp = def.sp || 1, VC = 11 * sp;
    total = rounds.length;
    const yAt = z => drive.hz + (H - drive.hz) * F / (Math.max(z, -F * .9) + F);
    const hwAt = z => drive.rb * F / (Math.max(z, -F * .9) + F);
    const lay = () => {
      const bs = clamp(Math.min(stage.w * .3, stage.h * .16), 76, 130);
      st.carY = H - Math.max(14, stage.h * .03) - bs * .2; st.carW = clamp(stage.w * .36, 120, 250);
      st.btns = [
        { k: 'stop', col: '#E02424', w: bs, h: bs, x: stage.x + 10, y: H - bs - 14, draw: (c, cx, cy, b) => { sign(c, 'stop', cx, cy - b.h * .08, b.h * .27, {}); text(c, L('قف', 'Stop'), cx, cy + b.h * .32, b.h * .15, '#C81E1E'); } },
        { k: 'go', col: '#2FB344', w: bs, h: bs, x: stage.x + stage.w - bs - 10, y: H - bs - 14, draw: (c, cx, cy, b) => { c.fillStyle = '#2FB344'; c.beginPath(); c.arc(cx, cy - b.h * .08, b.h * .27, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(cx - b.h * .08, cy - b.h * .22); c.lineTo(cx + b.h * .14, cy - b.h * .08); c.lineTo(cx - b.h * .08, cy + b.h * .06); c.closePath(); c.fill(); text(c, L('انطلق', 'Go'), cx, cy + b.h * .32, b.h * .15, '#1F8A33'); } }
      ];
      st.carY = H - bs - 30; st.carW = clamp(stage.w * (portrait ? .4 : .22), 120, 230);
      if (!portrait) st.carY = H - 30;
    };
    const B = k => st.btns.find(b => b.k === k);
    function newRound() {
      st.kind = rounds[st.round]; st.z = ZLINE0; st.light = 'green'; st.phase = 'approach'; st.brake = false; st.autoB = false; st.waitT = 0; st.helped = false; st.goPressed = st.v > 1;
      st.lightT = 0;
    }
    function okRound() {
      step(); sparkle(W / 2, st.carY - st.carW * .5, '#40E070', 14);
      st.round++;
      if (st.round >= rounds.length) { st.phase = 'end'; later(1.2, finish); }
      else later(.6, newRound);
    }
    return {
      init() { lay(); st.v = VC; newRound(); showHint(() => '🚦 ' + L(App.g('انتبهي للإشارة', 'انتبه للإشارة'), 'Watch the traffic light')); later(.3, () => say(App.g('انتبهي للإشارة', 'انتبه للإشارة'), 'Watch the traffic light')); },
      layout: lay,
      replay() { if (st.light === 'green') sayRule(LIGHTS[2]); else sayRule(LIGHTS[st.light === 'red' ? 0 : 1]); },
      down(p) {
        const b = st.btns.find(b => inR(p, b)); if (!b) return;
        b.pop = 1; Sound.tap();
        if (b.k === 'stop') {
          if (st.phase === 'approach' && (st.light === 'red' || st.light === 'yellow') && !st.brake) {
            st.brake = true; st.phase = 'braking'; sparkle(b.x + b.w / 2, b.y + b.h / 2, '#FF5A5A', 10); Sound.star();
            say(App.g('أحسنت!', 'أحسنت!'), 'Well done!');
          } else if (st.light === 'green' && st.v > .5) { say(LIGHTS[2].ar + ' ' + LIGHTS[2].rar, LIGHTS[2].en + ' ' + LIGHTS[2].ren); B('go').glow = 2; }
        } else {
          if (st.light !== 'green' && st.v < 1 && (st.phase === 'stopped' || st.phase === 'braking')) {
            miss(); b.shk = 1; st.lshk = 1; say(App.g('انتظري الأخضر', 'انتظر الأخضر'), 'Wait for green');
          } else if (st.light === 'green' && st.phase === 'stopped') {
            st.phase = 'go'; Sound.tone(200, .4, 'sawtooth', .05, 300); sparkle(b.x + b.w / 2, b.y + b.h / 2, '#40E070', 10);
          }
        }
      },
      update(dt) {
        st.btns.forEach(b => { b.pop = Math.max(0, (b.pop || 0) - dt * 2.4); b.shk = Math.max(0, (b.shk || 0) - dt * 2.2); b.glow = Math.max(0, (b.glow || 0) - dt); });
        st.lshk = Math.max(0, (st.lshk || 0) - dt * 2);
        // تغيّر الإشارة
        if (st.phase === 'approach') {
          if (st.kind === 'red' && st.light === 'green' && st.z < 52) { st.light = 'yellow'; st.lightT = 0; }
          if (st.kind === 'yellow' && st.light === 'green' && st.z < 40) { st.light = 'yellow'; st.lightT = 0; sayRule(LIGHTS[1]); }
        }
        if (st.light === 'yellow') { st.lightT += dt; if (st.lightT > (st.kind === 'yellow' ? 1.3 : .9)) { st.light = 'red'; st.waitT = 0; if (st.phase === 'approach') { sayRule(LIGHTS[0]); B('stop').glow = 3; } } }
        // الحركة
        if (st.phase === 'approach') {
          st.v += (VC - st.v) * Math.min(1, dt * 2);
          if (st.light !== 'green' && st.z < 9 && !st.brake) {
            // لم يضغط «قف»: السيارة تقف بلطف وحدها
            st.brake = true; st.autoB = true; st.phase = 'braking'; miss(); shake = 0; B('stop').glow = 3;
            say(LIGHTS[0].ar + ' ' + LIGHTS[0].rar, LIGHTS[0].en + ' ' + LIGHTS[0].ren);
          }
          if (st.z < -4 && st.light === 'green') { st.phase = 'passed'; okRound(); }
        } else if (st.phase === 'braking') {
          const stopAt = st.autoB ? .8 : 1.8, dist = Math.max(.3, st.z - stopAt);
          const dec = st.v * st.v / (2 * dist); st.v = Math.max(0, st.v - Math.max(dec, 3) * dt);
          if (st.v <= .05 || st.z <= stopAt) { st.v = 0; st.phase = 'stopped'; st.waitT = 0; Sound.thud(); }
        } else if (st.phase === 'stopped') {
          st.waitT += dt;
          if (st.light === 'red' && st.waitT > 2.4) {
            st.light = 'green'; B('go').glow = 5; sayRule(LIGHTS[2]);
            if (!st.peds.length) { }
          }
          if (st.light === 'red' && st.waitT > .6 && st.peds.length < 2 && Math.random() < dt * 1.5) st.peds.push({ u: 0, e: ['🚶', '🚶‍♀️', '🧒'][Math.floor(Math.random() * 3)], sp: rand(.35, .5), dir: Math.random() < .5 ? 1 : -1 });
          if (st.light === 'green' && st.waitT > 7 && !st.helped) { st.helped = true; sayRule(LIGHTS[2]); }
        } else if (st.phase === 'go') {
          st.v += (VC - st.v) * Math.min(1, dt * 1.5);
          if (st.z < -4) { st.phase = 'passed'; okRound(); }
        } else if (st.phase === 'passed' || st.phase === 'end') {
          st.v += (VC - st.v) * Math.min(1, dt * 1.5);
        }
        st.z -= st.v * dt; st.odo += st.v * dt;
        for (let i = st.peds.length - 1; i >= 0; i--) { const q = st.peds[i]; q.u += q.sp * dt; if (q.u > 1) st.peds.splice(i, 1); }
      },
      draw() {
        const vx = W / 2;
        // خطوط الطريق المتحركة
        ctx.fillStyle = '#fff';
        for (let k = 0; k < 30; k++) {
          const z0 = k * 6 - (st.odo % 6), z1 = z0 + 3; if (z0 > 160) break; if (z1 < -F * .5) continue;
          const y0 = yAt(z0), y1 = yAt(z1), w0 = hwAt(z0) * .025, w1 = hwAt(z1) * .025;
          ctx.beginPath(); ctx.moveTo(vx - w0, y0); ctx.lineTo(vx + w0, y0); ctx.lineTo(vx + w1, y1); ctx.lineTo(vx - w1, y1); ctx.closePath(); ctx.fill();
        }
        // خط التوقف وممر المشاة
        const zl = st.z;
        if (zl > -F * .6 && zl < 200) {
          const zz = (a, b, col) => { const y0 = yAt(a), y1 = yAt(b), h0 = hwAt(a), h1 = hwAt(b); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(vx - h0, y0); ctx.lineTo(vx + h0, y0); ctx.lineTo(vx + h1, y1); ctx.lineTo(vx - h1, y1); ctx.closePath(); ctx.fill(); };
          zz(zl, zl + .5, '#FFFFFF');
          for (let i = 0; i < 7; i++) {
            const y0 = yAt(zl + 1.2), y1 = yAt(zl + 4.2), h0 = hwAt(zl + 1.2), h1 = hwAt(zl + 4.2);
            const u0 = -1 + i * 2 / 7 + .04, u1 = u0 + 2 / 7 * .55;
            ctx.fillStyle = '#F4F4F4'; ctx.beginPath(); ctx.moveTo(vx + u0 * h0, y0); ctx.lineTo(vx + u1 * h0, y0); ctx.lineTo(vx + u1 * h1, y1); ctx.lineTo(vx + u0 * h1, y1); ctx.closePath(); ctx.fill();
          }
          // المشاة
          for (const q of st.peds) {
            const zc = zl + 2.7, hw = hwAt(zc), u = q.dir > 0 ? q.u : 1 - q.u, px = vx - hw * 1.2 + u * hw * 2.4;
            emo(ctx, q.e, px, yAt(zc), hwAt(zc) * .32, { flip: q.dir > 0, rot: Math.sin(T * 10) * .05 });
          }
          // عمود الإشارة على اليمين
          const sc = F / (Math.max(zl, -F * .5) + F), gy = yAt(zl), px = vx + hwAt(zl) * 1.18, s = clamp(drive.rb * sc * .1, 2, 60);
          if (gy < H + 50) {
            ctx.save(); if (st.lshk) ctx.translate(Math.sin(st.lshk * 40) * 5 * st.lshk, 0);
            trafficLight(ctx, px, gy - s * 7.9 - s * 6, s, LIGHTS.findIndex(l => l.id === st.light), { ground: gy });
            ctx.restore();
          }
        }
        // السيارة
        const bob = Math.sin(st.odo * 2.2) * (st.v > .5 ? 1.2 : 0);
        carRear(ctx, vx, st.carY, st.carW, ['#FF9A9A', '#F03E3E', '#A61B1B'], st.brake && st.phase !== 'go' && st.phase !== 'passed' || st.v < .2, bob);
        if (st.v > 3) { ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { const yy = st.carY - st.carW * .2 - i * 9 + (T * 300 % 9); ctx.beginPath(); ctx.moveTo(vx - st.carW * .75 - i * 6, yy); ctx.lineTo(vx - st.carW * .6 - i * 6, yy); ctx.moveTo(vx + st.carW * .6 + i * 6, yy); ctx.lineTo(vx + st.carW * .75 + i * 6, yy); ctx.stroke(); } }
        st.btns.forEach(b => card(ctx, b));
        // فقاعة الإشارة الحالية
        const li = LIGHTS.find(l => l.id === st.light);
        if (st.z < 60) bubble(ctx, li.ar ? L(li.ar + ' ' + li.rar, li.en + ' ' + li.ren) : '', W / 2, drive.hz - 34, clamp(stage.w * .045, 14, 22), ['#E02424', '#C08000', '#1F9A3A'][LIGHTS.indexOf(li)]);
      },
      _s: () => ({ phase: st.phase, light: st.light, z: st.z, v: st.v, round: st.round, stop: B('stop') && { x: B('stop').x + B('stop').w / 2, y: B('stop').y + B('stop').h / 2 }, go: B('go') && { x: B('go').x + B('go').w / 2, y: B('go').y + B('go').h / 2 } })
    };
  }

  /* ---------- ٣) عبور الشارع ---------- */
  function mkCross() {
    const st = { step: 'where', kx: 0, ax: 0, ky: 0, walkT: 0, holding: false, seenL: false, seenR: false, green: false, cars: [], spawnT: 1, look: 0, btns: [], drag: null, glowZ: 0 };
    total = 4;
    const H_ = () => clamp(stage.h * .2, 80, 170);
    const lay = () => {
      const kh = H_();
      st.kh = kh; st.ah = kh * 1.45;
      if (st.step === 'where') { st.kx = portrait ? W * .2 : W * .22; }
      st.ky = side.nearY + kh * .1;
      const bh = clamp(stage.h * .13, 62, 96), bw = clamp(stage.w * .3, 96, 170);
      st.btns = [
        { k: 'L', col: '#3D9BE8', w: bw, h: bh, x: stage.x + 8, y: H - bh - 12, hide: true, draw: (c, cx, cy, b) => { text(c, '⬅️ 👀', cx, cy - b.h * .1, b.h * .36, '#000', { en: true }); text(c, L('يسار', 'Left'), cx, cy + b.h * .28, b.h * .2, '#1F6BB0'); } },
        { k: 'R', col: '#3D9BE8', w: bw, h: bh, x: stage.x + stage.w - bw - 8, y: H - bh - 12, hide: true, draw: (c, cx, cy, b) => { text(c, '👀 ➡️', cx, cy - b.h * .1, b.h * .36, '#000', { en: true }); text(c, L('يمين', 'Right'), cx, cy + b.h * .28, b.h * .2, '#1F6BB0'); } },
        { k: 'walk', col: '#2FB344', w: bw * 1.1, h: bh, x: W / 2 - bw * .55, y: H - bh - 12, hide: true, draw: (c, cx, cy, b) => { text(c, '🚶', cx, cy - b.h * .1, b.h * .4, '#000', { en: true }); text(c, L('هيا نعبر', "Let's cross"), cx, cy + b.h * .28, b.h * .2, '#1F8A33', { max: b.w * .9 }); } }
      ].map(n => { const o = st.btns.find(b => b.k === n.k); if (o) n.hide = o.hide; return n; });
      st.ax = st.kx - kh * .62;
    };
    const B = k => st.btns.find(b => b.k === k);
    const sayWhere = () => say('أين نعبر الشارع؟', 'Where do we cross the street?');
    const sayHand = () => say(App.g('أمسكي يد الكبير', 'أمسك يد الكبير'), "Hold a grown-up's hand");
    const sayLook = () => say(App.g('انظري يمينا ويسارا', 'انظر يمينا ويسارا'), 'Look left and right');
    const sayCross = () => say('هيا نعبر', "Let's cross");
    function spawnCar(dir) {
      const lane = dir > 0 ? side.roadT + (side.roadB - side.roadT) * .82 : side.roadT + (side.roadB - side.roadT) * .42;
      const cols = [['#FFB0B0', '#F03E3E', '#A61B1B'], ['#A6D4FF', '#2F8CF0', '#134E9C'], ['#FFF0A0', '#FFC81F', '#C98A00'], ['#C8B0FF', '#8A5BE8', '#5530A8']];
      const w = clamp(W * .3, 110, 190);
      st.cars.push({ x: dir > 0 ? -w : W + w, y: lane, dir, w, col: cols[Math.floor(Math.random() * cols.length)], v: rand(150, 200) * (W / 600 + .5), spin: 0 });
      Sound.noise(.6, 200, 600, .05, 1);
    }
    function toLook() {
      st.step = 'look'; B('L').hide = false; B('R').hide = false; B('L').pop = B('R').pop = 1;
      showHint(() => '👀 ' + L(App.g('انظري يمينًا ويسارًا', 'انظر يمينًا ويسارًا'), 'Look left and right')); sayLook();
    }
    function toWalk() {
      st.step = 'walk'; B('L').hide = B('R').hide = true; B('walk').hide = false; B('walk').pop = 1;
      if (def.wait) { st.green = false; st.redT = 0; showHint(() => '🚦 ' + L(App.g('انتظري الرجل الأخضر', 'انتظر الرجل الأخضر'), 'Wait for the green man')); say(App.g('انتظري الرجل الأخضر', 'انتظر الرجل الأخضر'), 'Wait for the green man'); }
      else { st.green = true; B('walk').glow = 4; showHint(() => '🟢 ' + L('هيا نعبر', "Let's cross")); sayCross(); }
    }
    function startWalk() {
      st.step = 'walking'; st.walkT = 0; B('walk').hide = true; hideHint(); Sound.whoosh();
    }
    return {
      init() { lay(); showHint(() => '🚸 ' + L('أين نعبر الشارع؟', 'Where do we cross the street?')); later(.4, sayWhere); },
      layout: lay,
      replay() { ({ where: sayWhere, hand: sayHand, look: sayLook, walk: () => st.green ? sayCross() : say(App.g('انتظري الرجل الأخضر', 'انتظر الرجل الأخضر'), 'Wait for the green man') })[st.step]?.(); },
      down(p) {
        const b = st.btns.find(b => inR(p, b));
        if (st.step === 'where') {
          if (p.y > side.roadT - 10 && p.y < side.roadB + 10) {
            if (Math.abs(p.x - side.zx) < side.zw * .75) {
              step(); sparkle(side.zx, (side.roadT + side.roadB) / 2, '#FFFFFF', 14); st.step = 'goto'; st.fromX = st.kx; st.walkT = 0;
              say('نعبر من ممر المشاة', 'We cross at the zebra crossing'); hideHint();
            } else { miss(); st.glowZ = 4; say('نعبر من ممر المشاة', 'We cross at the zebra crossing'); }
          }
          return;
        }
        if (st.step === 'hand') {
          if (Math.hypot(p.x - st.kx, p.y - (st.ky - st.kh * .5)) < st.kh * .6) { st.drag = { ox: st.kx - p.x, sx: st.kx }; Sound.tap(); }
          else if (Math.hypot(p.x - st.ax, p.y - (st.ky - st.ah * .5)) < st.ah * .4) { st.handHelp = 3; sayHand(); }
          return;
        }
        if (!b) return;
        b.pop = 1; Sound.tap();
        if (st.step === 'look' && (b.k === 'L' || b.k === 'R')) {
          const d = b.k === 'L' ? -1 : 1; st.look = d; st.lookT = 1.6;
          // سيارة تمرّ من الجهة التي ننظر إليها
          spawnCar(d < 0 ? 1 : -1);
          say(b.k === 'L' ? 'يسار' : 'يمين', b.k === 'L' ? 'Left' : 'Right');
          if (b.k === 'L' && !st.seenL) { st.seenL = true; b.ok = true; }
          if (b.k === 'R' && !st.seenR) { st.seenR = true; b.ok = true; }
          if (st.seenL && st.seenR && !st.lookDone) { st.lookDone = true; later(1.8, () => { step(); toWalk(); }); }
          return;
        }
        if (st.step === 'walk' && b.k === 'walk') {
          if (!st.green) { miss(); b.shk = 1; st.pshk = 1; say(App.g('انتظري الرجل الأخضر', 'انتظر الرجل الأخضر'), 'Wait for the green man'); return; }
          startWalk();
        }
      },
      move(p) { if (st.drag) { st.kx = clamp(p.x + st.drag.ox, st.ax - st.kh, st.drag.sx + st.kh); } },
      up() {
        if (!st.drag) return; const d = st.drag; st.drag = null;
        if (st.kx - st.ax < st.kh * .55) { st.holding = true; st.kx = st.ax + st.kh * .48; step(); Sound.pop(); sparkle(st.ax + st.kh * .3, st.ky - st.kh * .45, '#FF8AC2', 10); say(App.g('أحسنت!', 'أحسنت!'), 'Well done!'); later(1.2, toLook); }
        else { st.kBack = { from: st.kx, to: d.sx, t: 0 }; }
      },
      update(dt) {
        st.btns.forEach(b => { b.pop = Math.max(0, (b.pop || 0) - dt * 2.4); b.shk = Math.max(0, (b.shk || 0) - dt * 2.2); b.glow = Math.max(0, (b.glow || 0) - dt); });
        st.glowZ = Math.max(0, st.glowZ - dt); st.pshk = Math.max(0, (st.pshk || 0) - dt * 2); st.handHelp = Math.max(0, (st.handHelp || 0) - dt);
        if (st.kBack) { st.kBack.t += dt / .3; st.kx = lerp(st.kBack.from, st.kBack.to, ease.outBack(Math.min(1, st.kBack.t))); if (st.kBack.t >= 1) st.kBack = null; }
        if (st.step === 'goto') {
          st.walkT += dt / 1.4; const e = ease.inOut(Math.min(1, st.walkT));
          const tx = side.zx + st.kh * .2; st.kx = lerp(st.fromX, tx + st.kh * 1.1, e); st.ax = st.kx - st.kh * 1.1;
          if (st.walkT >= 1) { st.step = 'hand'; st.ax = side.zx - st.kh * .35; st.kx = st.ax + st.kh * 1.1; showHint(() => '🤝 ' + L(App.g('اسحبي الطفل ليمسك يد الكبير', 'اسحب الطفل ليمسك يد الكبير'), "Drag the child to hold the grown-up's hand")); sayHand(); st.handHelp = 4; }
        }
        if (st.lookT) st.lookT = Math.max(0, st.lookT - dt); if (!st.lookT && st.step !== 'look') st.look = 0;
        // السيارات
        if (!st.green && st.step !== 'walking' && st.step !== 'done') {
          st.spawnT -= dt; if (st.spawnT <= 0) { st.spawnT = rand(2.6, 4.2); spawnCar(Math.random() < .5 ? 1 : -1); }
        }
        if (st.step === 'walk' && !st.green) { st.redT += dt; if (st.redT > 3.2) { st.green = true; B('walk').glow = 5; Sound.tone(880, .2, 'sine', .1); showHint(() => '🟢 ' + L('هيا نعبر', "Let's cross")); sayCross(); } }
        for (let i = st.cars.length - 1; i >= 0; i--) {
          const c = st.cars[i];
          let v = c.v;
          if (st.green && st.step !== 'done') { // تقف السيارات قبل الممر
            const stopX = c.dir > 0 ? side.zx - side.zw / 2 - c.w * .58 : side.zx + side.zw / 2 + c.w * .58;
            const ahead = c.dir > 0 ? stopX - c.x : c.x - stopX;
            if (ahead > -5) v = Math.min(v, Math.max(0, ahead * 3));
          }
          c.x += c.dir * v * dt; c.spin += v * dt / (c.w * .11);
          if (c.x < -c.w * 1.5 || c.x > W + c.w * 1.5) st.cars.splice(i, 1);
        }
        if (st.step === 'walking') {
          st.walkT += dt / 2.6;
          if (st.walkT >= 1 && st.step === 'walking') { st.step = 'done'; step(); sparkle(st.kx, side.roadT - 20, '#40E070', 18); say(App.g('أحسنت!', 'أحسنت!'), 'Well done!'); later(1.4, finish); }
        }
      },
      draw() {
        const S = side;
        // إشارة المشاة على الرصيف البعيد
        ctx.save(); if (st.pshk) ctx.translate(Math.sin(st.pshk * 40) * 5 * st.pshk, 0);
        const ps = clamp(stage.h * .035, 12, 26);
        pedLight(ctx, S.zx + S.zw * .75, S.roadT - ps * 2.6 - stage.h * .09, ps, st.green, S.roadT - 4);
        ctx.restore();
        if (st.glowZ > 0 || st.step === 'where') {
          const a = st.step === 'where' ? .25 + .25 * Math.sin(T * 4) : (.5 + .5 * Math.sin(T * 8)) * Math.min(1, st.glowZ);
          ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#FFE04A'; ctx.lineWidth = 6; ctx.shadowColor = '#FFD000'; ctx.shadowBlur = 16;
          ctx.beginPath(); ctx.roundRect(S.zx - S.zw / 2 - 6, S.roadT + 2, S.zw + 12, S.roadB - S.roadT - 4, 10); ctx.stroke(); ctx.restore();
          if (st.step === 'where') { const t = (T * .8) % 1; ctx.save(); ctx.globalAlpha = t > .8 ? (1 - t) / .2 : 1; emo(ctx, '👆', S.zx + 10, (S.roadT + S.roadB) / 2 + 30 - Math.sin(t * Math.PI) * 14, clamp(S.zw * .45, 30, 56)); ctx.restore(); }
        }
        // السيارات خلف المشاة (حسب الحارة)
        const drawCars = near => st.cars.filter(c => (c.y > (S.roadT + S.roadB) / 2) === near).forEach(c => carSide(ctx, c.x, c.y, c.w, c.col, c.dir, { spin: c.spin }));
        drawCars(false); drawCars(true);
        // الطفل والكبير
        let ky = st.ky, kx = st.kx, ax = st.ax, sc = 1, wk = null;
        if (st.step === 'goto') wk = T * 9;
        if (st.step === 'walking' || st.step === 'done') {
          const e = ease.inOut(Math.min(1, st.walkT)); ky = lerp(st.ky, S.roadT - 4, e); sc = lerp(1, .8, e); wk = st.step === 'walking' ? T * 9 : null;
        }
        const kh = st.kh * sc, ah = st.ah * sc;
        const handP = st.holding ? { x: (ax + kx) / 2, y: ky - kh * .5 } : null;
        person(ctx, ax, ky, ah, { adult: true, girl: true, walk: wk, hand: handP, handSide: 1 });
        person(ctx, kx, ky, kh, { walk: wk != null ? wk + 1 : null, look: st.look, hand: handP, handSide: -1 });
        if (st.holding && st.step !== 'done') { ctx.fillStyle = '#FF4F86'; ctx.font = `${kh * .18}px ${EMOJI_FONT}`; ctx.textAlign = 'center'; ctx.fillText('💗', (ax + kx) / 2, ky - kh * 1.2 - Math.abs(Math.sin(T * 3)) * 6); }
        if (st.step === 'hand' && !st.drag) {
          const t = (T * .7) % 1, e = ease.inOut(Math.min(1, t * 1.3));
          ctx.save(); ctx.globalAlpha = t > .8 ? (1 - t) / .2 : 1; emo(ctx, '👆', lerp(st.kx, st.ax + st.kh * .5, e), st.ky - st.kh * .25, st.kh * .4); ctx.restore();
        }
        if (st.step === 'look' && st.look) { text(ctx, st.look < 0 ? '⬅️' : '➡️', kx + st.look * kh * .45, ky - kh * 1.15, kh * .2, '#000', { en: true }); }
        st.btns.forEach(b => { if (!b.hide) card(ctx, b); });
      },
      _s: () => ({ step: st.step, zx: side.zx, zy: (side.roadT + side.roadB) / 2, kx: st.kx, ky: st.ky - st.kh * .5, ax: st.ax, green: st.green, btns: st.btns.map(b => ({ k: b.k, hide: b.hide, x: b.x + b.w / 2, y: b.y + b.h / 2 })) })
    };
  }

  /* ---------- ٤) الإشارات المرورية + أسئلة عامة (سلامة/إشارات/أضواء) ---------- */
  function mkQuiz(kind) {
    const st = { phase: 'quiz', learn: [], seen: [], qs: [], qn: 0, q: null, btns: [], ill: null, answered: false, tries: 0, cardPop: 0 };
    if (kind === 'signs' && def.learn) { st.phase = 'learn'; st.learn = def.learn.slice(); }
    // توليد الأسئلة
    if (kind === 'signs') {
      const pool = def.learn || def.pool;
      const seq = []; while (seq.length < def.q) { const s = shuffle(pool.slice()); for (const k of s) if (seq.length < def.q && seq[seq.length - 1] !== k) seq.push(k); }
      st.qs = seq.map(k => ({ t: 'sign', k, ch: def.ch || 3, pool: def.pool || def.learn }));
    } else if (kind === 'quiz') {
      const set = SAFE[def.set], pick = shuffle(set.slice()).slice(0, def.q);
      // نضمن وجود «آمن» و«خطر»
      st.qs = pick.map(s => ({ t: 'safe', s }));
    } else { // mix
      const allSafe = shuffle(SAFE.street.concat(SAFE.home));
      const sg = shuffle(Object.keys(SIGNS));
      st.qs = shuffle([
        { t: 'light', k: 'red' }, { t: 'light', k: 'green' },
        { t: 'sign', k: sg[0], ch: 3, pool: Object.keys(SIGNS) }, { t: 'sign', k: sg[1], ch: 3, pool: Object.keys(SIGNS) }, { t: 'sign', k: sg[2], ch: 4, pool: Object.keys(SIGNS) },
        { t: 'safe', s: allSafe[0] }, { t: 'safe', s: allSafe[1] }, { t: 'safe', s: allSafe[2] }
      ]).slice(0, def.q);
    }
    total = st.learn.length + st.qs.length;
    const sayQ = () => {
      const q = st.q; if (!q) return;
      if (q.t === 'sign') say('أين إشارة ' + SIGNS[q.k].ar + '؟', 'Where is the ' + SIGNS[q.k].en + '?');
      else if (q.t === 'light') say('ماذا نفعل؟', 'What do we do?');
      else say(q.s.ar + '. هل هذا آمن؟', q.s.en + '. Is this safe?');
    };
    const sayLearnHint = () => say(App.g('المسي كل إشارة', 'المس كل إشارة'), 'Touch each sign');
    const signName = k => L(SIGNS[k].lab, SIGNS[k].lab_en);
    const signCard = (k, i) => ({ k, i, col: { stop: '#E02424', cross: '#1F6FE0', school: '#E0A800', noentry: '#C81E1E', lights: '#E02424' }[k], pop: 1,
      draw: (c, cx, cy, b) => { const r = Math.min(b.w, b.h) * .3; sign(c, k, cx, cy - b.h * .1, r); text(c, signName(k), cx, cy + b.h * .34, Math.min(b.h * .12, b.w * .12), '#2A3A55', { max: b.w * .92 }); } });
    function layBtns() {
      const n = st.btns.length; if (!n) return;
      const top = st.ill ? st.ill.y + st.ill.h + 16 : stage.y + 8, bot = stage.y + stage.h - 6;
      const ah = bot - top;
      let cols = n, rows = 1;
      if (portrait && n === 4) { cols = 2; rows = 2; }
      if (st.phase === 'learn') { cols = portrait ? 2 : n; rows = Math.ceil(n / cols); }
      const gap = 12, bw = Math.min((stage.w - 16 - gap * (cols - 1)) / cols, 230);
      const bh = Math.min((ah - gap * (rows - 1)) / rows, st.phase === 'learn' ? bw * 1.1 : (st.q && st.q.t === 'safe' ? 120 : bw * 1.0));
      const tw = cols * bw + (cols - 1) * gap, th = rows * bh + (rows - 1) * gap;
      st.btns.forEach((b, i) => {
        const r = Math.floor(i / cols), cI = i % cols, cc = lang === 'ar' ? cols - 1 - cI : cI;
        b.w = bw; b.h = bh; b.x = W / 2 - tw / 2 + cc * (bw + gap); b.y = top + (ah - th) / 2 + r * (bh + gap);
      });
    }
    function lay() {
      if (st.phase === 'learn') { st.ill = null; }
      else if (st.q) {
        const iw = Math.min(stage.w - 16, 560);
        const ih = st.q.t === 'sign' ? Math.min(stage.h * .2, 130) : st.q.t === 'light' ? stage.h * .46 : Math.min(stage.h * .5, iw * .8);
        st.ill = { x: W / 2 - iw / 2, y: stage.y + 4, w: iw, h: ih };
      }
      layBtns();
    }
    function ask() {
      st.q = st.qs[st.qn]; st.answered = false; st.tries = 0; st.cardPop = 0;
      const q = st.q;
      if (q.t === 'sign') {
        const others = shuffle(q.pool.filter(k => k !== q.k)).slice(0, q.ch - 1);
        st.btns = shuffle([q.k, ...others]).map(signCard);
        showHint(() => '🔎 ' + L('أين إشارة ' + SIGNS[q.k].lab + '؟', 'Where is the ' + SIGNS[q.k].en + '?'));
      } else if (q.t === 'light') {
        st.btns = ACTIONS.map((a, i) => ({ i, col: a.col, pop: 1, draw: (c, cx, cy, b) => { emo(c, a.e, cx, cy + b.h * .12, b.h * .42); text(c, L(a.ar, a.en), cx, cy + b.h * .3, b.h * .17, a.col, { max: b.w * .9 }); } }));
        showHint(() => '🚦 ' + L('ماذا نفعل؟', 'What do we do?'));
      } else {
        st.btns = [
          { safe: true, col: '#2FB344', pop: 1, draw: (c, cx, cy, b) => { emo(c, '✅', cx - (lang === 'ar' ? -1 : 1) * b.w * .22, cy + b.h * .2, b.h * .4); text(c, L('آمن', 'Safe'), cx + (lang === 'ar' ? -1 : 1) * b.w * .12, cy, b.h * .26, '#1F8A33', { max: b.w * .5 }); } },
          { safe: false, col: '#F26A1B', pop: 1, draw: (c, cx, cy, b) => { emo(c, '✋', cx - (lang === 'ar' ? -1 : 1) * b.w * .22, cy + b.h * .2, b.h * .4); text(c, L('خطر', 'Not safe'), cx + (lang === 'ar' ? -1 : 1) * b.w * .12, cy, b.h * .26, '#C2500E', { max: b.w * .5 }); } }
        ];
        showHint(() => '🤔 ' + L('هل هذا آمن؟', 'Is this safe?'));
      }
      lay(); Sound.whoosh(); later(.35, sayQ);
    }
    function startQuiz() { st.phase = 'quiz'; st.qn = 0; ask(); }
    function correctIdx() {
      const q = st.q;
      if (q.t === 'sign') return st.btns.findIndex(b => b.k === q.k);
      if (q.t === 'light') return LIGHTS.find(l => l.id === q.k).act;
      return st.btns.findIndex(b => b.safe === q.s.safe);
    }
    /* مشهد صغير للسؤال */
    function scene(c, R, s) {
      const { x, y, w, h } = R;
      c.save(); c.beginPath(); c.roundRect(x, y, w, h, 18); c.clip();
      const gy = y + h * .62;
      if (s.bg === 'kitchen' || s.bg === 'room') {
        c.fillStyle = lin(c, 0, y, 0, gy, s.bg === 'kitchen' ? ['#E6F7FF', '#C8EAFA'] : ['#FFF0F6', '#FFE0EC']); c.fillRect(x, y, w, gy - y);
        if (s.bg === 'kitchen') { c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 2; for (let xx = x; xx < x + w; xx += 26) { c.beginPath(); c.moveTo(xx, y); c.lineTo(xx, gy); c.stroke(); } for (let yy = y; yy < gy; yy += 26) { c.beginPath(); c.moveTo(x, yy); c.lineTo(x + w, yy); c.stroke(); } }
        else { c.fillStyle = '#BFE6FF'; c.beginPath(); c.roundRect(x + w * .08, y + h * .1, w * .26, h * .3, 8); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 5; c.stroke(); c.beginPath(); c.moveTo(x + w * .21, y + h * .1); c.lineTo(x + w * .21, y + h * .4); c.stroke(); }
        c.fillStyle = lin(c, 0, gy, 0, y + h, ['#E0A868', '#B87A3E']); c.fillRect(x, gy, w, y + h - gy);
        if (s.stove) { // موقد بقدر ولهب
          const sx = x + w * .44, sy = gy + h * .08, sw = w * .44;
          c.fillStyle = lin(c, 0, sy - h * .05, 0, y + h, ['#F5F8FB', '#B9C4CF']); c.beginPath(); c.roundRect(sx - sw / 2, sy - h * .05, sw, y + h - sy + h * .05, 10); c.fill();
          c.fillStyle = '#2D3748'; c.beginPath(); c.roundRect(sx - sw * .4, sy + h * .06, sw * .8, h * .18, 8); c.fill();
          emo(c, '🔥', sx, sy - h * .02, h * .2, { sc: 1 + Math.sin(T * 12) * .06 });
          emo(c, '🍲', sx, sy - h * .14, h * .28);
        }
      } else {
        c.fillStyle = lin(c, 0, y, 0, gy, ['#7CCBFF', '#DDF3FF']); c.fillRect(x, y, w, gy - y);
        const R2 = rng(3); for (let i = 0; i < 5; i++) building(c, x + i * w * .21 - 4, gy - h * .1, w * .18, h * (.18 + R2() * .18), [['#FFB8A8', '#F08A7A'], ['#B8D8FF', '#86B6F0'], ['#FFE3A0', '#F2C460']][i % 3], R2);
        if (s.bg === 'park') { c.fillStyle = lin(c, 0, gy - h * .1, 0, y + h, ['#A4E36A', '#56B53A']); c.fillRect(x, gy - h * .1, w, y + h - gy + h * .1); tree(c, x + w * .12, gy, h * .3); }
        else {
          c.fillStyle = '#E9E2D6'; c.fillRect(x, gy - h * .1, w, h * .1);
          c.fillStyle = '#5A6372'; c.fillRect(x, gy, w, y + h - gy);
          c.fillStyle = '#fff'; for (let xx = x + 8; xx < x + w; xx += 40) c.fillRect(xx, gy + (y + h - gy) * .5, 22, 4);
          if (s.bg === 'zebra') for (let i = 0; i < 6; i++) c.fillRect(x + w * .3 + i * w * .07, gy + 4, w * .04, y + h - gy - 8);
          if (s.light) trafficLight(c, x + w * .86, y + h * .1, h * .045, 0, { ground: gy - h * .04 });
        }
      }
      s.it.forEach(([e, ex, ey, es], i) => emo(c, e, x + w * ex, y + h * ey, h * es, { rot: Math.sin(T * 2 + i) * .04 }));
      c.restore();
    }
    return {
      init() {
        if (st.phase === 'learn') {
          st.btns = st.learn.map(signCard); lay();
          showHint(() => '👆 ' + L(App.g('المسي كل إشارة', 'المس كل إشارة'), 'Touch each sign')); later(.4, sayLearnHint);
        } else ask();
      },
      layout: lay,
      replay() { if (st.phase === 'learn') sayLearnHint(); else sayQ(); },
      down(p) {
        const i = st.btns.findIndex(b => inR(p, b)); if (i < 0) return;
        const b = st.btns[i];
        if (st.phase === 'learn') {
          b.pop = 1; Sound.pop(); say('إشارة ' + SIGNS[b.k].ar, SIGNS[b.k].en);
          if (!b.ok) { b.ok = true; step(); if (st.btns.every(q => q.ok)) later(2, startQuiz); }
          return;
        }
        if (st.answered) return;
        const ci = correctIdx(), q = st.q;
        if (i === ci) {
          st.answered = true; b.ok = true; b.pop = 1; st.cardPop = 1; step(); sparkle(b.x + b.w / 2, b.y + b.h / 2, b.col);
          if (q.t === 'light') sayRule(LIGHTS.find(l => l.id === q.k));
          else if (q.t === 'safe' && !q.s.safe) say(App.g('أحسنت!', 'أحسنت!') + ' ' + q.s.rar, 'Well done! ' + q.s.ren);
          else sayGood();
          st.qn++; later(q.t === 'safe' && !q.s.safe ? 3.4 : 2.2, () => { if (st.qn >= st.qs.length) finish(); else ask(); });
        } else {
          miss(); b.shk = 1; st.tries++;
          if (q.t === 'safe') { later(.3, () => say(q.s.safe ? App.g('حاولي مرة أخرى', 'حاول مرة أخرى') : q.s.rar, q.s.safe ? 'Try again!' : q.s.ren)); }
          else later(.3, sayTry);
          if (st.tries >= 2) st.btns[ci].glow = 4;
        }
      },
      update(dt) { st.cardPop = Math.max(0, st.cardPop - dt * 2); st.btns.forEach(b => { b.pop = Math.max(0, (b.pop || 0) - dt * 2.4); b.shk = Math.max(0, (b.shk || 0) - dt * 2.2); b.glow = Math.max(0, (b.glow || 0) - dt); }); },
      draw() {
        if (st.phase === 'quiz' && st.q && st.ill) {
          const R = st.ill, q = st.q;
          const bc = q.t === 'safe' ? (st.answered ? (q.s.safe ? '#2FB344' : '#F26A1B') : '#3D9BE8') : '#3D9BE8';
          card(ctx, { x: R.x, y: R.y, w: R.w, h: R.h, col: bc, pop: st.cardPop });
          const inner = { x: R.x + 8, y: R.y + 8, w: R.w - 16, h: R.h - 16 };
          if (q.t === 'safe') {
            const ch = Math.min(40, inner.h * .16);
            scene(ctx, { x: inner.x, y: inner.y, w: inner.w, h: inner.h - ch }, q.s);
            text(ctx, L(q.s.ar, q.s.en), R.x + R.w / 2, inner.y + inner.h - ch / 2, ch * .52, '#1E3A5A', { max: inner.w * .94 });
            if (st.answered && !q.s.safe) { ctx.save(); ctx.globalAlpha = .9; emo(ctx, '✋', inner.x + inner.w * .12, inner.y + inner.h * .3, inner.h * .24, { rot: Math.sin(T * 6) * .1 }); ctx.restore(); }
          } else if (q.t === 'light') {
            ctx.save(); ctx.beginPath(); ctx.roundRect(inner.x, inner.y, inner.w, inner.h, 18); ctx.clip();
            ctx.fillStyle = lin(ctx, 0, inner.y, 0, inner.y + inner.h, ['#BFE6FF', '#EAF7FF']); ctx.fillRect(inner.x, inner.y, inner.w, inner.h);
            const s = inner.h * .085; trafficLight(ctx, R.x + R.w / 2, inner.y + inner.h * .06, s, LIGHTS.findIndex(l => l.id === q.k), { ground: inner.y + inner.h });
            ctx.restore();
          } else {
            emo(ctx, '🧒', R.x + R.w * (lang === 'ar' ? .86 : .14), R.y + R.h * .92, R.h * .6);
            text(ctx, L('أين إشارة ' + SIGNS[q.k].lab + '؟', 'Where is the ' + SIGNS[q.k].en + '?'), R.x + R.w / 2 + (lang === 'ar' ? -1 : 1) * R.w * .06, R.y + R.h / 2, Math.min(R.h * .26, 30), '#1F5A9A', { max: R.w * .7 });
          }
        }
        st.btns.forEach(b => card(ctx, b));
        if (st.phase === 'learn') { const nb = st.btns.find(b => !b.ok); if (nb) { const t = (T * .9) % 1; ctx.save(); ctx.globalAlpha = t > .8 ? (1 - t) / .2 : .9; emo(ctx, '👆', nb.x + nb.w * .7, nb.y + nb.h * .9 - Math.sin(t * Math.PI) * 10, Math.min(nb.w, nb.h) * .32); ctx.restore(); } }
      },
      _s: () => ({ phase: st.phase, qn: st.qn, ans: st.phase === 'quiz' && st.q ? correctIdx() : -1, btns: st.btns.map(b => ({ x: b.x + b.w / 2, y: b.y + b.h / 2, ok: !!b.ok })) })
    };
  }

  /* ---------- ٥) مقعد الأطفال وحزام الأمان ---------- */
  function mkSeat() {
    const st = { step: 'sit', drag: null, kx: 0, ky: 0, belt: null, carX: 0, drive: 0, btn: null, frontGlow: 0 };
    total = 3;
    const lay = () => {
      st.cw = Math.min(stage.w * .96, 620); st.ch = st.cw * .52;
      st.gy = stage.y + stage.h * .52; if (!st.drive) st.carX = W / 2;
      st.kh = clamp(stage.h * .18, 80, 150);
      st.hx = portrait ? W * .26 : W * .3; st.hy = stage.y + stage.h * .9; // مكان الطفل الأصلي
      if (st.step === 'sit' && !st.drag) { st.kx = st.hx; st.ky = st.hy; }
      const bh = clamp(stage.h * .13, 64, 100), bw = clamp(stage.w * .36, 120, 200);
      st.btn = { col: '#2FB344', w: bw, h: bh, x: portrait ? W - bw - 16 : W * .62, y: stage.y + stage.h - bh - 8, hide: st.step !== 'go', pop: 1, draw: (c, cx, cy, b) => { text(c, '🚗💨', cx, cy - b.h * .1, b.h * .34, '#000', { en: true }); text(c, L('هيا ننطلق', "Let's go!"), cx, cy + b.h * .28, b.h * .2, '#1F8A33', { max: b.w * .9 }); } };
    };
    // الأماكن داخل السيارة
    const seatP = () => ({ x: st.carX - st.cw * .1, y: st.gy - st.ch * .32 });
    const frontP = () => ({ x: st.carX + st.cw * .16, y: st.gy - st.ch * .32 });
    const buckleP = () => { const s = seatP(); return { x: s.x + st.kh * .32, y: s.y - st.kh * .02 }; };
    const anchorP = () => { const s = seatP(); return { x: s.x - st.kh * .2, y: s.y - st.kh * .62 }; };
    const sayPut = () => say(App.g('اسحبي الطفل إلى مقعد الأطفال', 'اسحب الطفل إلى مقعد الأطفال'), 'Put the child in the car seat');
    const sayBelt = () => say(App.g('اربطي حزام الأمان', 'اربط حزام الأمان'), 'Buckle the seat belt');
    function drawCar() {
      const x = st.carX, gy = st.gy, w = st.cw, h = st.ch;
      ctx.save(); ctx.translate(x, gy);
      ctx.fillStyle = 'rgba(20,30,40,.22)'; ctx.beginPath(); ctx.ellipse(0, 4, w * .52, h * .07, 0, 0, TAU); ctx.fill();
      const col = ['#A6D4FF', '#2F8CF0', '#134E9C'];
      ctx.fillStyle = lin(ctx, 0, -h, 0, 0, col);
      // جسم السيارة
      ctx.beginPath(); ctx.moveTo(-w * .5, -h * .18); ctx.lineTo(-w * .5, -h * .5); ctx.quadraticCurveTo(-w * .48, -h * .58, -w * .38, -h * .6);
      ctx.lineTo(-w * .3, -h * .95); ctx.quadraticCurveTo(-w * .26, -h * 1.02, -w * .16, -h * 1.02); ctx.lineTo(w * .16, -h * 1.02); ctx.quadraticCurveTo(w * .24, -h * 1.0, w * .32, -h * .62);
      ctx.lineTo(w * .46, -h * .56); ctx.quadraticCurveTo(w * .52, -h * .52, w * .52, -h * .4); ctx.lineTo(w * .52, -h * .18); ctx.quadraticCurveTo(w * .52, -h * .08, w * .44, -h * .08); ctx.lineTo(-w * .44, -h * .08); ctx.quadraticCurveTo(-w * .5, -h * .08, -w * .5, -h * .18); ctx.closePath(); ctx.fill();
      // النافذة الكبيرة (نرى الداخل)
      ctx.fillStyle = '#F2E6D8'; ctx.beginPath(); ctx.moveTo(-w * .34, -h * .58); ctx.lineTo(-w * .27, -h * .9); ctx.quadraticCurveTo(-w * .24, -h * .95, -w * .16, -h * .95); ctx.lineTo(w * .14, -h * .95); ctx.quadraticCurveTo(w * .2, -h * .93, w * .27, -h * .58); ctx.closePath(); ctx.fill();
      ctx.restore();
      // المقعد الأمامي
      const f = frontP(); seatShape(f.x, f.y, '#7A8494', '#4A5363', 1);
      // مقعد الأطفال الملوّن في الخلف
      const s = seatP(); seatShape(s.x - st.kh * .1, s.y, '#9BE0A6', '#3DBB57', 1.12, true);
      if (st.frontGlow > 0) { ctx.save(); ctx.globalAlpha = .4 + .4 * Math.sin(T * 8); ctx.strokeStyle = '#FFE04A'; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(s.x - st.kh * .5, s.y - st.kh * .8, st.kh * .9, st.kh * .9, 14); ctx.stroke(); ctx.restore(); }
      // حافة النافذة
      ctx.save(); ctx.translate(x, gy);
      ctx.strokeStyle = '#1D5DA8'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-w * .34, -h * .58); ctx.lineTo(-w * .27, -h * .9); ctx.quadraticCurveTo(-w * .24, -h * .95, -w * .16, -h * .95); ctx.lineTo(w * .14, -h * .95); ctx.quadraticCurveTo(w * .2, -h * .93, w * .27, -h * .58); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.roundRect(-w * .46, -h * .5, w * .9, h * .05, h * .025); ctx.fill();
      ctx.fillStyle = '#FFF3A0'; ctx.beginPath(); ctx.roundRect(w * .47, -h * .45, w * .05, h * .09, 4); ctx.fill();
      ctx.fillStyle = '#FF5A5A'; ctx.beginPath(); ctx.roundRect(-w * .52, -h * .45, w * .04, h * .1, 4); ctx.fill();
      const spin = st.drive ? T * 20 : 0;
      for (const wx of [-w * .3, w * .3]) {
        const wr = h * .2; ctx.fillStyle = '#2B2F38'; ctx.beginPath(); ctx.arc(wx, -wr * .6, wr, 0, TAU); ctx.fill();
        ctx.fillStyle = lin(ctx, 0, -wr * 1.2, 0, 0, ['#F5F8FB', '#9AA6B2']); ctx.beginPath(); ctx.arc(wx, -wr * .6, wr * .5, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#6F7C89'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(wx + Math.cos(spin) * wr * .45, -wr * .6 + Math.sin(spin) * wr * .45); ctx.lineTo(wx - Math.cos(spin) * wr * .45, -wr * .6 - Math.sin(spin) * wr * .45); ctx.stroke();
      }
      ctx.restore();
    }
    function seatShape(x, y, c1, c2, k, kid) {
      const s = st.kh * k;
      ctx.fillStyle = lin(ctx, x - s * .3, 0, x + s * .3, 0, [c1, c2]);
      ctx.beginPath(); ctx.roundRect(x - s * .3, y - s * .75, s * .26, s * .8, s * .1); ctx.fill();
      ctx.beginPath(); ctx.roundRect(x - s * .3, y - s * .05, s * .62, s * .16, s * .07); ctx.fill();
      if (kid) { ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.roundRect(x - s * .26, y - s * .7, s * .07, s * .6, s * .03); ctx.fill(); ctx.fillStyle = c2; ctx.beginPath(); ctx.roundRect(x - s * .34, y - s * .25, s * .1, s * .32, s * .04); ctx.fill(); }
    }
    return {
      init() { lay(); showHint(() => '💺 ' + L(App.g('اسحبي الطفل إلى مقعد الأطفال', 'اسحب الطفل إلى مقعد الأطفال'), 'Put the child in the car seat')); later(.4, sayPut); },
      layout: lay,
      replay() { if (st.step === 'sit') sayPut(); else if (st.step === 'belt') sayBelt(); else say('هيا ننطلق', "Let's go!"); },
      down(p) {
        if (st.step === 'sit' && Math.hypot(p.x - st.kx, p.y - (st.ky - st.kh * .5)) < st.kh * .6) { st.drag = { ox: st.kx - p.x, oy: st.ky - p.y }; Sound.tap(); return; }
        if (st.step === 'belt') { const a = st.belt; if (Math.hypot(p.x - a.x, p.y - a.y) < st.kh * .35) { st.drag = { belt: true }; Sound.tap(); } return; }
        if (st.step === 'go' && inR(p, st.btn)) { st.btn.pop = 1; st.step = 'driving'; st.btn.hide = true; Sound.tone(150, .6, 'sawtooth', .06, 200); hideHint(); say('هيا ننطلق', "Let's go!"); }
      },
      move(p) {
        if (!st.drag) return;
        if (st.drag.belt) { st.belt.x = p.x; st.belt.y = p.y; return; }
        st.kx = p.x + st.drag.ox; st.ky = p.y + st.drag.oy;
      },
      up() {
        if (!st.drag) return; const d = st.drag; st.drag = null;
        if (d.belt) {
          const b = buckleP();
          if (Math.hypot(st.belt.x - b.x, st.belt.y - b.y) < st.kh * .35) {
            st.belted = true; st.step = 'go'; step(); Sound.noise(.04, 3000, 5000, .2, 4); Sound.tone(1200, .05, 'square', .06); vibrate(25);
            sparkle(b.x, b.y, '#FFE26B', 14); text; st.btn.hide = false; st.btn.pop = 1; st.btn.glow = 4;
            say(App.g('أحسنت!', 'أحسنت!'), 'Well done!');
            showHint(() => '🚗 ' + L('هيا ننطلق', "Let's go!"));
          } else { const a = anchorP(); st.beltBack = { fx: st.belt.x, fy: st.belt.y, t: 0, tx: a.x + st.kh * .05, ty: a.y + st.kh * .3 }; Sound.slide(); }
          return;
        }
        const s = seatP(), f = frontP();
        if (Math.hypot(st.kx - s.x, (st.ky - st.kh * .5) - (s.y - st.kh * .35)) < st.kh * .7) {
          st.step = 'belt'; step(); Sound.pop(); sparkle(s.x, s.y - st.kh * .4, '#40E070', 12);
          const a = anchorP(); st.belt = { x: a.x + st.kh * .05, y: a.y + st.kh * .3 };
          showHint(() => '🔒 ' + L(App.g('اسحبي الحزام إلى القفل', 'اسحب الحزام إلى القفل'), 'Drag the belt to the buckle')); later(.5, sayBelt);
        } else {
          if (Math.hypot(st.kx - f.x, st.ky - f.y) < st.kh * .8) { miss(); st.frontGlow = 3; say('الأطفال يجلسون في الخلف', 'Children sit in the back'); }
          st.kBack = { fx: st.kx, fy: st.ky, t: 0 };
        }
      },
      update(dt) {
        st.frontGlow = Math.max(0, st.frontGlow - dt);
        if (st.btn) { st.btn.pop = Math.max(0, (st.btn.pop || 0) - dt * 2.4); st.btn.glow = Math.max(0, (st.btn.glow || 0) - dt); }
        if (st.kBack) { st.kBack.t += dt / .35; const e = ease.outBack(Math.min(1, st.kBack.t)); st.kx = lerp(st.kBack.fx, st.hx, e); st.ky = lerp(st.kBack.fy, st.hy, e); if (st.kBack.t >= 1) st.kBack = null; }
        if (st.beltBack) { const b = st.beltBack; b.t += dt / .3; const e = ease.outCubic(Math.min(1, b.t)); st.belt.x = lerp(b.fx, b.tx, e); st.belt.y = lerp(b.fy, b.ty, e); if (b.t >= 1) st.beltBack = null; }
        if (st.step === 'driving') {
          st.drive += dt; st.carX += Math.min(900, st.drive * 500) * dt;
          if (st.carX > W + st.cw * .6 && !st.fin) { st.fin = true; step(); finish(); }
        }
      },
      draw() {
        drawCar();
        const s = seatP();
        if (st.step === 'sit') {
          person(ctx, st.kx, st.ky, st.kh, {});
          if (!st.drag) { const t = (T * .6) % 1, e = ease.inOut(Math.min(1, t * 1.3)); ctx.save(); ctx.globalAlpha = t > .8 ? (1 - t) / .2 : .95; emo(ctx, '👆', lerp(st.kx, s.x, e) + 10, lerp(st.ky - st.kh * .4, s.y - st.kh * .3, e), st.kh * .35); ctx.restore(); }
        } else {
          // الطفل جالس في مقعده (مع السيارة إن تحرّكت)
          const sx = s.x, sy = s.y + st.kh * .05;
          person(ctx, sx, sy, st.kh * .92, { sit: true, belt: st.belted });
          if (st.step === 'belt') {
            const a = anchorP(), b = st.belt, bk = buckleP();
            ctx.fillStyle = '#2B2F38'; ctx.beginPath(); ctx.roundRect(bk.x - 9, bk.y - 6, 18, 14, 4); ctx.fill(); ctx.fillStyle = '#E8504A'; ctx.fillRect(bk.x - 5, bk.y - 3, 10, 5);
            if (Math.sin(T * 6) > 0) { ctx.strokeStyle = '#FFE04A'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(bk.x, bk.y, 16, 0, TAU); ctx.stroke(); }
            ctx.strokeStyle = '#2B2F38'; ctx.lineWidth = st.kh * .06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            ctx.fillStyle = lin(ctx, b.x - 10, 0, b.x + 10, 0, ['#9AA6B2', '#F5F8FB', '#6F7C89']); ctx.beginPath(); ctx.roundRect(b.x - 10, b.y - 7, 20, 14, 4); ctx.fill();
            if (!st.drag) { const t = (T * .6) % 1, e = ease.inOut(Math.min(1, t * 1.3)); ctx.save(); ctx.globalAlpha = t > .8 ? (1 - t) / .2 : .95; emo(ctx, '👆', lerp(b.x, bk.x, e) + 8, lerp(b.y, bk.y, e) + 34, st.kh * .3); ctx.restore(); }
          }
        }
        if (st.btn && !st.btn.hide) card(ctx, st.btn);
        if (st.step === 'driving') { ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 4; for (let i = 0; i < 4; i++) { const yy = st.gy - st.ch * (.2 + i * .15); ctx.beginPath(); ctx.moveTo(st.carX - st.cw * .6 - i * 10, yy); ctx.lineTo(st.carX - st.cw * .9 - i * 10, yy); ctx.stroke(); } }
      },
      _s: () => { const s = seatP(), b = buckleP(); return { step: st.step, kx: st.kx, ky: st.ky - st.kh * .5, seat: { x: s.x, y: s.y - st.kh * .35 }, front: frontP(), belt: st.belt, buckle: b, btn: st.btn && { x: st.btn.x + st.btn.w / 2, y: st.btn.y + st.btn.h / 2 } }; }
    };
  }

  /* ---------- ٦) خوذة الدراجة ---------- */
  function mkBike() {
    const st = { step: 'wear', items: [], drag: null, ride: 0, kx: 0 };
    total = 3;
    const ITEMS_B = [{ k: 'helmet' }, { k: 'cap', e: '🧢' }, { k: 'crown', e: '👑' }, { k: 'bow', e: '🎀' }];
    const lay = () => {
      st.kh = clamp(stage.h * .26, 100, 210); st.wr = st.kh * .24;
      st.bx = W / 2 + st.kh * .3; st.kx = st.step === 'ride' || st.step === 'done' ? st.kx : st.bx - st.kh * .75;
      const n = ITEMS_B.length, sz = clamp(Math.min((stage.w - 40) / n - 10, stage.h * .15), 64, 120), tw = n * sz + (n - 1) * 12;
      const prev = st.items;
      st.items = ITEMS_B.map((it, i) => { const o = prev.find(p => p.k === it.k) || { ...it, pop: 1 }; o.col = it.k === 'helmet' ? '#F03E3E' : '#3D9BE8'; o.w = o.h = sz; o.hx = W / 2 - tw / 2 + (lang === 'ar' ? n - 1 - i : i) * (sz + 12); o.hy = stage.y + stage.h - sz - 8; if (!o.moving) { o.x = o.hx; o.y = o.hy; } return o; });
      const bh = clamp(stage.h * .13, 64, 100), bw = clamp(stage.w * .36, 120, 200);
      st.btn = { col: '#2FB344', w: bw, h: bh, x: W / 2 - bw / 2, y: stage.y + stage.h - bh - 8, hide: st.step !== 'go', pop: 1, glow: 3, draw: (c, cx, cy, b) => { text(c, '🚲', cx, cy - b.h * .1, b.h * .38, '#000', { en: true }); text(c, L('هيا ننطلق', "Let's go!"), cx, cy + b.h * .28, b.h * .2, '#1F8A33', { max: b.w * .9 }); } };
    };
    const headP = () => ({ x: st.kx, y: bike.gy - st.kh + st.kh * .2 });
    const sayWear = () => say('ماذا نلبس لركوب الدراجة؟', 'What do we wear to ride a bike?');
    const sayStrap = () => say(App.g('اربطي الخوذة', 'اربط الخوذة'), 'Buckle the helmet');
    function drawBikeAt(x, gy, wr, rot) {
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const w1 = { x: x - wr * 1.6, y: gy - wr }, w2 = { x: x + wr * 1.6, y: gy - wr };
      for (const w of [w1, w2]) {
        ctx.fillStyle = 'rgba(20,40,10,.2)'; ctx.beginPath(); ctx.ellipse(w.x, gy + 2, wr, wr * .2, 0, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#2B2F38'; ctx.lineWidth = wr * .22; ctx.beginPath(); ctx.arc(w.x, w.y, wr * .9, 0, TAU); ctx.stroke();
        ctx.strokeStyle = '#C9D2DB'; ctx.lineWidth = 2;
        for (let i = 0; i < 6; i++) { const a = rot + i * Math.PI / 3; ctx.beginPath(); ctx.moveTo(w.x, w.y); ctx.lineTo(w.x + Math.cos(a) * wr * .8, w.y + Math.sin(a) * wr * .8); ctx.stroke(); }
      }
      const seat = { x: x - wr * .5, y: gy - wr * 2.5 }, bar = { x: x + wr * 1.1, y: gy - wr * 2.9 }, ped = { x, y: gy - wr };
      ctx.strokeStyle = '#FF7A1A'; ctx.lineWidth = wr * .26;
      ctx.beginPath(); ctx.moveTo(w1.x, w1.y); ctx.lineTo(ped.x, ped.y); ctx.lineTo(seat.x, seat.y + wr * .2); ctx.lineTo(w1.x, w1.y);
      ctx.moveTo(ped.x, ped.y); ctx.lineTo(bar.x - wr * .2, bar.y + wr * .5); ctx.lineTo(seat.x + wr * .1, seat.y + wr * .4);
      ctx.moveTo(w2.x, w2.y); ctx.lineTo(bar.x, bar.y); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = wr * .07; ctx.beginPath(); ctx.moveTo(ped.x, ped.y - 3); ctx.lineTo(bar.x - wr * .2, bar.y + wr * .45); ctx.stroke();
      ctx.strokeStyle = '#2B2F38'; ctx.lineWidth = wr * .2; ctx.beginPath(); ctx.moveTo(bar.x - wr * .4, bar.y - wr * .1); ctx.lineTo(bar.x + wr * .25, bar.y - wr * .05); ctx.stroke();
      ctx.fillStyle = '#2B2F38'; ctx.beginPath(); ctx.ellipse(seat.x, seat.y, wr * .45, wr * .16, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#6F7C89'; ctx.lineWidth = wr * .12; ctx.beginPath(); ctx.moveTo(ped.x + Math.cos(rot) * wr * .4, ped.y + Math.sin(rot) * wr * .4); ctx.lineTo(ped.x - Math.cos(rot) * wr * .4, ped.y - Math.sin(rot) * wr * .4); ctx.stroke();
      ctx.restore();
      return { seat, bar, ped };
    }
    return {
      init() { lay(); showHint(() => '🚲 ' + L('ماذا نلبس لركوب الدراجة؟', 'What do we wear to ride a bike?')); later(.4, sayWear); },
      layout: lay,
      replay() { if (st.step === 'wear') sayWear(); else if (st.step === 'strap') sayStrap(); else say('هيا ننطلق', "Let's go!"); },
      down(p) {
        if (st.step === 'wear') { const it = st.items.find(o => inR(p, o)); if (it) { st.drag = { it, ox: it.x - p.x, oy: it.y - p.y }; it.moving = true; it.pop = 1; Sound.tap(); } return; }
        if (st.step === 'strap') { const h = headP(); if (Math.hypot(p.x - h.x, p.y - (h.y + st.kh * .15)) < st.kh * .3) { st.strap = true; st.step = 'go'; step(); Sound.noise(.04, 3000, 5000, .2, 4); Sound.tone(1200, .05, 'square', .06); vibrate(20); sparkle(h.x, h.y + st.kh * .15, '#FFE26B', 12); say(App.g('أحسنت!', 'أحسنت!'), 'Well done!'); st.btn.hide = false; st.btn.pop = 1; st.btn.glow = 4; showHint(() => '🚲 ' + L('هيا ننطلق', "Let's go!")); } return; }
        if (st.step === 'go' && inR(p, st.btn)) { st.step = 'ride'; st.btn.hide = true; st.ride = 0; hideHint(); Sound.tone(880, .1, 'sine', .1); Sound.tone(1100, .1, 'sine', .1, 0, .12); say('هيا ننطلق', "Let's go!"); }
      },
      move(p) { if (st.drag) { st.drag.it.x = p.x + st.drag.ox; st.drag.it.y = p.y + st.drag.oy; } },
      up() {
        if (!st.drag) return; const it = st.drag.it; st.drag = null;
        const h = headP(), cx = it.x + it.w / 2, cy = it.y + it.h / 2;
        if (Math.hypot(cx - h.x, cy - h.y) < st.kh * .4) {
          if (it.k === 'helmet') { st.helmet = true; it.gone = true; st.step = 'strap'; step(); Sound.pop(); sparkle(h.x, h.y - st.kh * .1, '#FF5A5A', 12); showHint(() => '👆 ' + L(App.g('اربطي الخوذة: المسي الحزام', 'اربط الخوذة: المس الحزام'), 'Buckle the helmet: touch the strap')); later(.4, sayStrap); return; }
          miss(); it.shk = 1; say('الخوذة تحمي رأسك', 'A helmet protects your head'); st.items[0].glow = 4;
        }
        it.back = { fx: it.x, fy: it.y, t: 0 };
      },
      update(dt) {
        st.items.forEach(o => { o.pop = Math.max(0, (o.pop || 0) - dt * 2.4); o.shk = Math.max(0, (o.shk || 0) - dt * 2.2); o.glow = Math.max(0, (o.glow || 0) - dt);
          if (o.back) { o.back.t += dt / .35; const e = ease.outBack(Math.min(1, o.back.t)); o.x = lerp(o.back.fx, o.hx, e); o.y = lerp(o.back.fy, o.hy, e); if (o.back.t >= 1) { o.back = null; o.moving = false; } } });
        if (st.btn) { st.btn.pop = Math.max(0, (st.btn.pop || 0) - dt * 2.4); st.btn.glow = Math.max(0, (st.btn.glow || 0) - dt); }
        if (st.step === 'ride') {
          st.ride += dt;
          const sp = Math.min(1, st.ride) * W * .45;
          st.bx += sp * dt; if (st.bx > W + st.kh) st.bx = -st.kh;
          if (st.ride > 4.2 && Math.abs(st.bx - W / 2) < 20) { st.step = 'done'; step(); sparkle(st.bx, bike.gy - st.kh * .8, '#40E070', 18); later(1, finish); }
        }
      },
      draw() {
        const riding = st.step === 'ride' || st.step === 'done';
        const rot = riding ? st.bx / st.wr : 0;
        const bk = drawBikeAt(st.bx, bike.gy, st.wr, rot);
        if (riding) { st.kx = bk.seat.x; person(ctx, bk.seat.x + st.wr * .2, bk.seat.y + st.wr * .3, st.kh * .9, { sit: true, helmet: true, strap: true, hand: { x: bk.bar.x - st.wr * .2, y: bk.bar.y }, handSide: 1 }); }
        else person(ctx, st.kx, bike.gy, st.kh, { helmet: st.helmet, strap: st.strap });
        if (st.step === 'strap') { const h = headP(), t = (T * 1.2) % 1; ctx.save(); ctx.strokeStyle = `rgba(255,224,74,${1 - t})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(h.x, h.y + st.kh * .17, st.kh * (.08 + t * .15), 0, TAU); ctx.stroke(); ctx.restore(); }
        if (st.step === 'wear' || st.step === 'strap' || st.step === 'go') {
          st.items.forEach(o => {
            if (o.gone) return;
            card(ctx, { ...o, x: o.x, y: o.y, draw: (c, cx, cy, b) => { if (o.k === 'helmet') helmet(c, cx, cy + b.h * .18, b.h * .3, false); else emo(c, o.e, cx, cy + b.h * .3, b.h * .6); } });
          });
          if (st.step === 'wear' && !st.drag) { const it = st.items[0], h = headP(), t = (T * .5) % 1, e = ease.inOut(Math.min(1, t * 1.3)); if (it.glow > 0) { ctx.save(); ctx.globalAlpha = t > .8 ? (1 - t) / .2 : .95; emo(ctx, '👆', lerp(it.x + it.w / 2, h.x, e) + 8, lerp(it.y + it.h * .6, h.y + 20, e), st.kh * .25); ctx.restore(); } }
        }
        if (st.btn && !st.btn.hide) card(ctx, st.btn);
      },
      _s: () => ({ step: st.step, head: headP(), items: st.items.map(o => ({ k: o.k, x: o.x + o.w / 2, y: o.y + o.h / 2 })), btn: st.btn && { x: st.btn.x + st.btn.w / 2, y: st.btn.y + st.btn.h / 2 } })
    };
  }

  /* =====================================================================
     إدارة المستوى
     ===================================================================== */
  function startLevel(n) {
    lvl = clamp(n, 1, LEVELS.length); def = LEVELS[lvl - 1];
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    tasks = []; parts = []; rings = []; over = false; mistakes = 0; done = 0; idleT = 0;
    layoutCommon();
    A = def.a === 'light' ? mkLight() : def.a === 'drive' ? mkDrive() : def.a === 'cross' ? mkCross() : def.a === 'seat' ? mkSeat() : def.a === 'bike' ? mkBike() : mkQuiz(def.a);
    bgKey = ''; buildBg();
    setProg();
    A.init();
    Sound.whoosh();
  }
  function layout() { layoutCommon(); if (A) A.layout(); bgKey = ''; buildBg(); }
  function finish() {
    if (over) return;
    over = true; hideHint();
    const pr = loadProg();
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('trafficProg', pr);
    for (let i = 0; i < 130; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 240), rot: rand(0, TAU), vr: rand(-8, 8), life: rand(2.5, 4), age: 0, s: rand(6, 11), c: ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9'][i % 6] });
    Sound.win();
    const tok = A;
    setTimeout(() => {
      if (App.current !== ID || tok !== A) return;
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنتَ!') + ' 🎉';
      root.querySelector('.wpair').textContent = def.e + ' 🏅';
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wP').textContent = App.g('أنتِ بطلة السلامة!', 'أنت بطل السلامة!') + (mistakes ? '' : ' 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < LEVELS.length ? '' : 'none';
      winOv.classList.add('on');
      sayGood();
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('traffic_first');
      if (def.a === 'drive' && !mistakes) App.achieve('traffic_driver');
      if (def.a === 'signs' && !def.learn) App.achieve('traffic_signs');
      if (def.a === 'quiz' && def.set === 'home') App.achieve('traffic_home');
      if (LEVELS.every((_, i) => pr.stars[i + 1])) App.achieve('traffic_all');
    }, 1100);
  }
  function openLevels() {
    const pr = loadProg(), g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((Lv, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}"><span class="n">${num(n)}</span>
        <span class="e">${Lv.e}</span>
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
    if (paused || !A) return;
    if (window.gsap) gsap.fromTo(sayBtn, { scale: .8 }, { scale: 1, duration: .5, ease: 'elastic.out(1.2,0.4)', clearProps: 'transform' });
    A.replay();
  });
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'ar'; store.set('trafficLang', lang);
    root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
    setProg();
    if (hintFn) hintT.textContent = hintFn();
  }
  root.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === lang) return;
    Sound.tap(); setLang(b.dataset.l); if (A) { A.layout(); A.replay(); }
  }));

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  const blocked = () => App.current !== ID || paused || over || winOv.classList.contains('on') || lvOv.classList.contains('on');
  let ptr = null;
  cv.addEventListener('pointerdown', e => {
    if (blocked() || ptr != null || !A) return;
    ptr = e.pointerId; try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    idleT = 0; A.down(pos(e));
  });
  cv.addEventListener('pointermove', e => { if (e.pointerId !== ptr || !A || !A.move) return; A.move(pos(e)); });
  const endP = e => { if (e.pointerId !== ptr) return; ptr = null; if (A && A.up) A.up(pos(e)); };
  cv.addEventListener('pointerup', endP);
  cv.addEventListener('pointercancel', endP);
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < LEVELS.length ? 'next' : 'levels'); return; }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? lvOv.classList.remove('on') : openLevels(); return; }
    if (blocked() || !A) return;
    if (e.key === 'r' || e.key === 'R') { sayBtn.click(); return; }
    // الأرقام تختار البطاقات، والمسافة/السهم تضغط «قف»/«انطلق» في القيادة
    const s = A._s ? A._s() : null;
    if (def.a === 'drive' && s) {
      if (e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); A.down(s.stop); }
      else if (e.key === 'ArrowUp' || e.key === 'Enter') { e.preventDefault(); A.down(s.go); }
      return;
    }
    const n = parseInt(e.key, 10);
    if (n >= 1 && s && s.btns) { const b = s.btns.filter(b => !b.hide)[n - 1]; if (b) A.down({ x: b.x, y: b.y }); }
  });

  /* ---------- الحلقة ---------- */
  function update(dt) {
    T += dt;
    for (let i = tasks.length - 1; i >= 0; i--) { const t = tasks[i]; t.t -= dt; if (t.t <= 0) { tasks.splice(i, 1); t.fn(); } }
    if (A) A.update(dt);
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.t === 'conf') { q.vy = Math.min(q.vy + 120 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; q.rot += q.vr * dt; }
      else { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 300 * dt; q.rot += q.vr * dt; }
      q.x += q.vx * dt; q.y += q.vy * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    shake = Math.max(0, shake - dt * 16);
  }
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  function render() {
    ctx.save();
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    if (A) A.draw();
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
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); if (!running) render(); }, 80);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#7CCBFF'); g.addColorStop(.6, '#D9F3FF'); g.addColorStop(.61, '#5A6372'); g.addColorStop(1, '#3E4652');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.fillStyle = '#fff'; for (let i = 0; i < 6; i++) c.fillRect(s * .08 + i * s * .15, s * .72, s * .09, s * .2);
    const sv = dpr; dpr = 2;
    trafficLight(c, s * .34, s * .12, s * .065, 2, { ground: s * .7 });
    sign(c, 'stop', s * .7, s * .36, s * .14, { lang: 'ar' });
    dpr = sv;
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'إشارات المرور والسلامة', icon2: '🚦', isNew: true, music: 'taxi',
    desc: () => App.g('تعلّمي الإشارة وعبور الشارع بأمان', 'تعلّم الإشارة وعبور الشارع بأمان'),
    help: () => [
      '🚦 الأحمر: قف ✋ — الأصفر: انتظر ⏳ — الأخضر: امشِ 🚶',
      '🚗 في القيادة ' + App.g('اضغطي', 'اضغط') + ' «قف» عند الأحمر و«انطلق» عند الأخضر',
      '🚸 نعبر من ممر المشاة، ونمسك يد الكبير، وننظر يمينًا ويسارًا',
      '💺 الأطفال في مقعدهم بالخلف مع حزام الأمان، وعلى الدراجة نلبس الخوذة ⛑️',
      '🌍 ' + App.g('بدّلي', 'بدّل') + ' بين «عربي» و«English» لتسمع باللغتين'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 ${ks.length}/${LEVELS.length} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      setLang(store.get('trafficLang', 'ar'));
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, LEVELS.length));
      render(); startLoop();
    },
    leave() { stopLoop(); tasks = []; ptr = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (A && A.up && ptr != null) { A.up({ x: -1e4, y: -1e4 }); } ptr = null; },
    resume() { paused = false; last = performance.now(); },
    back() { if (lvOv.classList.contains('on')) { act('close'); return true; } return false; },
    /* للاختبار الآلي فقط */
    _state() { return { lvl, a: def.a, done, total, mistakes, over, s: A && A._s ? A._s() : null }; },
    _go(n) { startLevel(n); }
  });
})();
