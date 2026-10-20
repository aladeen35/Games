/* =====================================================================
   مطابقة الأشكال — لوح خشبي بفتحات، اسحب كل قطعة إلى فتحتها
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'shapes';
  const TAU = Math.PI * 2;
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  /* ---------- الأشكال الهندسية ---------- */
  const GEO = {
    circle: 'دائرة', square: 'مربع', triangle: 'مثلث', star: 'نجمة', heart: 'قلب', rect: 'مستطيل',
    rhombus: 'معين', hexagon: 'سداسي', moon: 'هلال', oval: 'بيضاوي', pentagon: 'خماسي', cloud: 'سحابة',
    plus: 'زائد', arrow: 'سهم',
    octagon: 'مثمّن', semicircle: 'نصف دائرة', trapezoid: 'شبه منحرف', parallelogram: 'متوازي أضلاع',
    drop: 'قطرة', bolt: 'برق', ring: 'حلقة'
  };
  const EMO = {
    '🐈': 'قطة', '🐕': 'كلب', '🐇': 'أرنب', '🦁': 'أسد', '🐘': 'فيل', '🦒': 'زرافة', '🐢': 'سلحفاة', '🦋': 'فراشة',
    '🍎': 'تفاحة', '🍌': 'موزة', '🍇': 'عنب', '🍓': 'فراولة', '🍉': 'بطيخ', '🍐': 'كمثرى', '🍊': 'برتقالة', '🍋': 'ليمونة', '🍒': 'كرز',
    '🚗': 'سيارة', '🚌': 'حافلة', '🚀': 'صاروخ', '✈️': 'طائرة', '🚲': 'دراجة', '⛵': 'قارب',
    '🐟': 'سمكة', '🐙': 'أخطبوط', '🦀': 'سلطعون', '🐳': 'حوت', '🐬': 'دلفين', '🐚': 'صدفة',
    '⚽': 'كرة', '🧸': 'دبدوب', '🎈': 'بالون', '🏠': 'بيت', '☂️': 'مظلة', '🎁': 'هدية',
    '☀️': 'شمس', '🌙': 'قمر', '⭐': 'نجمة', '🌈': 'قوس قزح', '☁️': 'غيمة', '🌸': 'زهرة',
    // طيور
    '🦜': 'ببغاء', '🦉': 'بومة', '🦆': 'بطة', '🐧': 'بطريق', '🦩': 'فلامنغو',
    // حشرات وأصدقاء صغار
    '🐝': 'نحلة', '🐞': 'دعسوقة', '🐜': 'نملة', '🐛': 'يرقة', '🐌': 'حلزون',
    // طعام
    '🍕': 'بيتزا', '🍔': 'برغر', '🥕': 'جزرة', '🧀': 'جبنة', '🍞': 'خبز', '🥚': 'بيضة',
    // آلات موسيقية
    '🎸': 'جيتار', '🥁': 'طبل', '🎹': 'بيانو', '🎺': 'بوق', '🎻': 'كمان', '🎷': 'ساكسفون',
    // ملابس
    '👕': 'قميص', '👖': 'بنطال', '👗': 'فستان', '🧦': 'جوارب', '🧢': 'قبعة', '👟': 'حذاء', '🧤': 'قفازات',
    // طقس
    '🌧️': 'مطر', '❄️': 'ثلج', '⚡': 'برق', '⛄': 'رجل الثلج',
    // رياضة
    '🏀': 'كرة السلة', '🎾': 'كرة التنس', '🏐': 'الكرة الطائرة', '🏓': 'تنس الطاولة', '🏸': 'الريشة الطائرة', '🏆': 'كأس',
    // مطبخ
    '🥄': 'ملعقة', '🍳': 'مقلاة', '☕': 'فنجان', '🍽️': 'صحن', '🥛': 'حليب', '🧂': 'ملح', '🍯': 'عسل',
    // فضاء
    '🪐': 'كوكب زحل', '🌍': 'الأرض', '🛸': 'صحن طائر', '☄️': 'مذنّب', '🛰️': 'قمر صناعي', '🔭': 'تلسكوب',
    // مزرعة
    '🐄': 'بقرة', '🐑': 'خروف', '🐐': 'عنزة', '🐔': 'دجاجة', '🐴': 'حصان', '🐫': 'جمل', '🚜': 'جرّار',
    // غابة
    '🐒': 'قرد', '🐯': 'نمر', '🦓': 'حمار وحشي', '🦛': 'فرس النهر', '🐊': 'تمساح', '🦍': 'غوريلا', '🐍': 'ثعبان',
    // ديناصورات
    '🦕': 'ديناصور', '🦖': 'تيرانوصور', '🌋': 'بركان', '🦴': 'عظمة', '🌴': 'نخلة', '🐉': 'تنين', '🌿': 'عشب'
  };
  const LEVELS = [
    { ic: '🔵', items: ['circle', 'square', 'triangle'] },
    { ic: '❤️', items: ['star', 'heart', 'moon', 'circle'] },
    { ic: '⬢', items: ['hexagon', 'pentagon', 'cloud', 'oval', 'plus'] },
    { ic: '🔷', items: ['square', 'rect', 'rhombus', 'arrow', 'oval', 'circle'] },
    { ic: '🐈', items: ['🐈', '🐕', '🐇'] },
    { ic: '🍎', items: ['🍎', '🍌', '🍇', '🍓'] },
    { ic: '🚗', items: ['🚗', '🚌', '🚀', '✈️'] },
    { ic: '🐟', items: ['🐟', '🐙', '🦀', '🐳', '🐬'] },
    { ic: '🦁', items: ['🦁', '🐘', '🦒', '🐢', '🦋'] },
    { ic: '🍉', items: ['🍉', '🍐', '🍊', '🍋', '🍒', '🍎'] },
    { ic: '🧸', items: ['⚽', '🧸', '🎈', '🏠', '☂️', '🎁'] },
    { ic: '🌈', items: ['☀️', '🌙', '⭐', '🌈', '☁️', '🌸'] },
    { ic: '🎉', items: ['⛵', 'heart', '🚲', '🐚', 'star', '🐢'] },
    /* ---- المستويات 14+ (أُضيفت لاحقًا في النهاية حفاظًا على التقدّم المحفوظ) ---- */
    { ic: '🔶', items: ['octagon', 'semicircle', 'trapezoid', 'parallelogram', 'drop'] },
    { ic: '🦜', items: ['🦜', '🦉', '🦆', '🐧', '🦩'] },
    { ic: '🐞', items: ['🐝', '🐞', '🐜', '🦋', '🐛', '🐌'] },
    { ic: '🍕', items: ['🍕', '🍔', '🥕', '🧀', '🍞', '🥚'] },
    { ic: '🎸', items: ['🎸', '🥁', '🎹', '🎺', '🎻', '🎷'] },
    { ic: '👕', items: ['👕', '👖', '👗', '🧦', '🧢', '👟', '🧤'] },
    { ic: '⛄', items: ['☀️', '☁️', '🌧️', '❄️', '⚡', '🌈', '⛄'] },
    { ic: '⚡', items: ['ring', 'bolt', 'octagon', 'hexagon', 'parallelogram', 'drop', 'semicircle'] },
    { ic: '🏀', items: ['⚽', '🏀', '🎾', '🏐', '🏓', '🏸', '🏆'] },
    { ic: '🍳', items: ['🥄', '🍳', '☕', '🍽️', '🥛', '🧂', '🍯'] },
    { ic: '🪐', items: ['🚀', '🪐', '🌍', '🛸', '☄️', '🛰️', '🔭', '🌙'] },
    { ic: '🐄', items: ['🐄', '🐑', '🐐', '🐔', '🐴', '🐫', '🚜', '🦆'] },
    { ic: '🐒', items: ['🐒', '🐯', '🦓', '🦛', '🐊', '🦍', '🐍', '🦜'] },
    { ic: '🦖', items: ['🦕', '🦖', '🌋', '🦴', '🥚', '🌴', '🐉', '🌿'] },
    { ic: '🏅', items: ['trapezoid', '🦖', 'ring', '🎻', 'drop', '🐧', 'bolt', '🪐'] }
  ];
  const COLORS = [
    ['#FF6B6B', '#D63447', '#FFB4B4'], ['#FFC93C', '#E39B0B', '#FFF0B0'], ['#3EC1D3', '#1C8798', '#B6F0F7'],
    ['#7ED957', '#3F9E2A', '#D3F7C2'], ['#A77BFF', '#6A3FD1', '#E2D3FF'], ['#FF7EB9', '#D63D86', '#FFD3E7'],
    ['#FF8F45', '#D2600F', '#FFD7B8'], ['#4D8BFF', '#2457C8', '#C9DCFF']
  ];

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  };
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const loadProg = () => {
    const p = store.get('shapesProg', null) || {}, stars = p.stars || {};
    // من أنهى آخر مستوى قديم (قبل إضافة المستويات الجديدة) يُفتح له المستوى التالي
    const top = Object.keys(stars).map(Number).filter(n => stars[n]).reduce((a, n) => Math.max(a, n), 0);
    return { unlocked: Math.max(1, p.unlocked || 1, Math.min(LEVELS.length, top + 1)), stars };
  };

  /* رسم مسار شكل هندسي متمركز عند (0,0) بنصف قطر r (قد يستخدم الدمج لطرح أجزاء) */
  function geoFill(c, k, r) {
    const poly = (pts, round) => {
      c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath();
      c.fill(); if (round) { c.lineJoin = 'round'; c.lineWidth = round; c.stroke(); }
    };
    const reg = (n, R, a0, dy = 0) => Array.from({ length: n }, (_, i) => { const a = a0 + i * TAU / n; return [Math.cos(a) * R, Math.sin(a) * R + dy]; });
    c.beginPath();
    switch (k) {
      case 'circle': c.arc(0, 0, r * .9, 0, TAU); c.fill(); break;
      case 'square': c.roundRect(-r * .78, -r * .78, r * 1.56, r * 1.56, r * .14); c.fill(); break;
      case 'rect': c.roundRect(-r * .95, -r * .54, r * 1.9, r * 1.08, r * .12); c.fill(); break;
      case 'triangle': poly([[0, -r * .8], [r * .86, r * .7], [-r * .86, r * .7]], r * .16); break;
      case 'star': {
        const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, R = i % 2 ? r * .44 : r * .92; pts.push([Math.cos(a) * R, Math.sin(a) * R + r * .06]); }
        poly(pts, r * .1); break;
      }
      case 'heart':
        c.moveTo(0, r * .86);
        c.bezierCurveTo(-r * 1.32, -r * .02, -r * .62, -r * 1.08, 0, -r * .48);
        c.bezierCurveTo(r * .62, -r * 1.08, r * 1.32, -r * .02, 0, r * .86);
        c.fill(); break;
      case 'rhombus': poly([[0, -r * .92], [r * .62, 0], [0, r * .92], [-r * .62, 0]], r * .12); break;
      case 'hexagon': poly(reg(6, r * .86, -Math.PI / 2), r * .1); break;
      case 'pentagon': poly(reg(5, r * .86, -Math.PI / 2, r * .07), r * .12); break;
      case 'oval': c.ellipse(0, 0, r * .95, r * .6, 0, 0, TAU); c.fill(); break;
      case 'moon':
        c.arc(0, 0, r * .88, 0, TAU); c.fill();
        c.globalCompositeOperation = 'destination-out';
        c.beginPath(); c.arc(r * .42, -r * .22, r * .74, 0, TAU); c.fill();
        c.globalCompositeOperation = 'source-over'; break;
      case 'cloud':
        [[-.52, .16, .38], [-.16, -.18, .46], [.3, -.12, .42], [.6, .2, .33]].forEach(([x, y, R]) => { c.beginPath(); c.arc(x * r, y * r, R * r, 0, TAU); c.fill(); });
        c.beginPath(); c.roundRect(-r * .86, r * .02, r * 1.76, r * .52, r * .26); c.fill(); break;
      case 'plus': {
        const a = r * .32, b = r * .9;
        c.roundRect(-a, -b, a * 2, b * 2, r * .1); c.fill();
        c.beginPath(); c.roundRect(-b, -a, b * 2, a * 2, r * .1); c.fill(); break;
      }
      case 'octagon': poly(reg(8, r * .92, Math.PI / 8), r * .1); break;
      case 'semicircle': c.arc(0, r * .32, r * .95, Math.PI, 0); c.closePath(); c.fill(); break;
      case 'trapezoid': poly([[-r * .5, -r * .56], [r * .5, -r * .56], [r * .95, r * .56], [-r * .95, r * .56]], r * .12); break;
      case 'parallelogram': poly([[-r * .45, -r * .52], [r * .95, -r * .52], [r * .45, r * .52], [-r * .95, r * .52]], r * .12); break;
      case 'drop':
        c.moveTo(0, -r * .95);
        c.bezierCurveTo(r * .2, -r * .55, r * .72, -r * .1, r * .72, r * .26);
        c.arc(0, r * .26, r * .72, 0, Math.PI);
        c.bezierCurveTo(-r * .72, -r * .1, -r * .2, -r * .55, 0, -r * .95);
        c.fill(); break;
      case 'bolt': poly([[r * .2, -r * .95], [-r * .62, r * .12], [-r * .04, r * .12], [-r * .24, r * .95], [r * .62, -r * .18], [r * .04, -r * .18]], r * .08); break;
      case 'ring':
        c.arc(0, 0, r * .9, 0, TAU); c.fill();
        c.globalCompositeOperation = 'destination-out';
        c.beginPath(); c.arc(0, 0, r * .42, 0, TAU); c.fill();
        c.globalCompositeOperation = 'source-over'; break;
      case 'arrow':
        poly([[-r * .9, -r * .26], [r * .02, -r * .26], [r * .02, -r * .7], [r * .9, 0], [r * .02, r * .7], [r * .02, r * .26], [-r * .9, r * .26]], r * .1); break;
    }
  }

  /* يحوّل قناع الشفافية إلى لون/تدرّج */
  function tint(src, style) {
    const c = mk(src.width, src.height), x = c.getContext('2d');
    x.drawImage(src, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = style; x.fillRect(0, 0, c.width, c.height);
    x.globalCompositeOperation = 'source-over';
    return c;
  }
  function invert(src) {
    const c = mk(src.width, src.height), x = c.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height); x.globalCompositeOperation = 'destination-out'; x.drawImage(src, 0, 0);
    return c;
  }
  /* ظل داخلي/إضاءة حافة داخل الشكل.
     (الإصدار السابق كان يرسم الظل مباشرة بوضع source-atop، وهذا في كروم/أندرويد يمسح وجه القطعة
      فيظهر الجانب البنّي من خلالها وتبدو القطعة باهتة وضبابية — لذا نحسبه في لوحة منفصلة ثم نقصّه بالقناع) */
  function innerGlow(x, inv, mask, color, blur, ox, oy) {
    const P = inv.width, t = mk(P, inv.height), c = t.getContext('2d');
    c.shadowColor = color; c.shadowBlur = blur; c.shadowOffsetX = ox + P * 2; c.shadowOffsetY = oy;
    c.drawImage(inv, -P * 2, 0);
    c.shadowColor = 'transparent'; c.globalCompositeOperation = 'destination-in'; c.drawImage(mask, 0, 0);
    x.drawImage(t, 0, 0);
  }
  /* حافة حادّة: الجزء من الشكل الذي لا يغطيه الشكل نفسه بعد إزاحته (ox,oy) */
  function rim(x, mask, color, ox, oy) {
    const t = mk(mask.width, mask.height), c = t.getContext('2d');
    c.drawImage(mask, 0, 0); c.globalCompositeOperation = 'destination-out'; c.drawImage(mask, ox, oy);
    c.globalCompositeOperation = 'source-in'; c.fillStyle = color; c.fillRect(0, 0, t.width, t.height);
    x.drawImage(t, 0, 0);
  }
  /* تمديد القناع (حواف أعرض ومستديرة) */
  function dilate(src, d) {
    const c = mk(src.width, src.height), x = c.getContext('2d');
    if (d <= 0) { x.drawImage(src, 0, 0); return c; }
    for (const f of [1, .5]) for (let i = 0; i < 24; i++) { const a = i * TAU / 24; x.drawImage(src, Math.cos(a) * d * f, Math.sin(a) * d * f); }
    x.drawImage(src, 0, 0);
    return tint(c, '#000');
  }

  /* صورة الإيموجي متمركزة بدقّة داخل مربع ضلعه size (بكسلات الجهاز) */
  function emojiCanvas(e, size, dpr) {
    const P = 2 * Math.ceil(size * .75 * dpr), c = mk(P, P), x = c.getContext('2d');
    x.direction = 'ltr'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    let fs = size * dpr;
    x.font = `${fs}px ${EMOJI_FONT}`;
    let m = x.measureText(e);
    const bw = m2 => (m2.actualBoundingBoxLeft || 0) + (m2.actualBoundingBoxRight || m2.width), bh = m2 => (m2.actualBoundingBoxAscent || fs * .8) + (m2.actualBoundingBoxDescent || fs * .2);
    fs *= Math.min(1.4, size * dpr / Math.max(bw(m), bh(m), 1));
    x.font = `${fs}px ${EMOJI_FONT}`; m = x.measureText(e);
    const L = m.actualBoundingBoxLeft || 0, R = m.actualBoundingBoxRight || m.width;
    const A = m.actualBoundingBoxAscent || fs * .8, D = m.actualBoundingBoxDescent || fs * .2;
    x.fillText(e, Math.round((P - (L + R)) / 2 + L), Math.round((P - (A + D)) / 2 + A));
    return c;
  }

  /* تجهيز صور القطعة والفتحة بحجم S — كل شيء بدقة شاشة الجهاز (dpr) */
  function bake(item, S, dpr) {
    const P = 2 * Math.ceil(S * .75 * dpr), r = S / 2;
    let mask = mk(P, P);
    const mx = mask.getContext('2d');
    let emo = null, sticker = null;
    if (item.geo) {
      mx.translate(P / 2, P / 2); mx.scale(dpr, dpr); mx.fillStyle = mx.strokeStyle = '#000';
      geoFill(mx, item.k, r);
    } else {
      emo = emojiCanvas(item.k, S * .84, dpr);
      const o = (P - emo.width) / 2, base = mk(P, P);
      base.getContext('2d').drawImage(emo, o, o);
      sticker = dilate(base, S * .035 * dpr);              // حدّ أبيض رفيع حول الصورة
      mask = dilate(sticker, S * .045 * dpr);               // جسم القطعة الملوّن
    }
    const inv = invert(mask);
    const col = item.col;
    // الوجه العلوي: لون زاهٍ كامل مع تدرّج
    const g = mx.createRadialGradient(P * .36, P * .28, 0, P * .5, P * .5, P * .56);
    if (item.geo) { g.addColorStop(0, col[2]); g.addColorStop(.45, col[0]); g.addColorStop(1, col[1]); }
    else { g.addColorStop(0, col[2]); g.addColorStop(.35, col[0]); g.addColorStop(1, col[1]); }
    const top = tint(mask, g), tx = top.getContext('2d');
    innerGlow(tx, inv, mask, 'rgba(0,0,0,.28)', 4 * dpr, -2 * dpr, -2.5 * dpr);
    rim(tx, mask, 'rgba(255,255,255,.75)', 1.6 * dpr, 1.8 * dpr);
    rim(tx, mask, 'rgba(0,0,0,.18)', -1.4 * dpr, -1.6 * dpr);
    if (item.geo) { // لمعة
      tx.save(); tx.globalCompositeOperation = 'source-atop';
      tx.translate(P * .4, P * .33); tx.rotate(-.5);
      const gg = tx.createRadialGradient(0, 0, 0, 0, 0, P * .28);
      gg.addColorStop(0, 'rgba(255,255,255,.7)'); gg.addColorStop(1, 'rgba(255,255,255,0)');
      tx.scale(1, .55); tx.fillStyle = gg; tx.beginPath(); tx.arc(0, 0, P * .28, 0, TAU); tx.fill();
      tx.restore();
      tx.save(); tx.globalCompositeOperation = 'source-atop'; tx.fillStyle = 'rgba(255,255,255,.9)';
      tx.beginPath(); tx.ellipse(P * .36, P * .3, P * .045, P * .025, -.6, 0, TAU); tx.fill(); tx.restore();
    } else {
      // ملصق أبيض ناصع ثم الصورة بألوانها الكاملة وبلا أي طبقة فوقها
      const st = tint(sticker, '#FFFFFF');
      { const sx2 = st.getContext('2d'); sx2.globalCompositeOperation = 'source-atop'; const sg = sx2.createLinearGradient(0, 0, 0, P); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(1, 'rgba(120,90,60,.12)'); sx2.fillStyle = sg; sx2.fillRect(0, 0, P, P); }
      tx.save(); tx.shadowColor = 'rgba(0,0,0,.25)'; tx.shadowBlur = 2 * dpr; tx.shadowOffsetY = 1 * dpr; tx.drawImage(st, 0, 0); tx.restore();
      tx.drawImage(emo, (P - emo.width) / 2, (P - emo.height) / 2);
    }
    const side = tint(mask, col[1]);
    { const sx = side.getContext('2d'); sx.globalCompositeOperation = 'source-atop'; sx.fillStyle = 'rgba(0,0,0,.22)'; sx.fillRect(0, 0, P, P); }
    // الظل
    const shadow = mk(P, P), shx = shadow.getContext('2d');
    shx.shadowColor = 'rgba(60,30,5,.5)'; shx.shadowBlur = 6 * dpr; shx.shadowOffsetX = P * 2;
    shx.drawImage(tint(mask, '#000'), -P * 2, 0);
    // الفتحة المحفورة
    const hole = mk(P, P), hx = hole.getContext('2d');
    hx.drawImage(tint(mask, 'rgba(255,226,180,.65)'), 0, Math.round(2 * dpr));          // حافة مضيئة أسفل الفتحة
    hx.drawImage(tint(mask, 'rgba(70,35,10,.6)'), 0, -Math.round(1.2 * dpr));           // حافة داكنة أعلى
    const hIn = tint(mask, '#4A2810'), hix = hIn.getContext('2d');
    { const hg = hix.createLinearGradient(0, 0, 0, P); hg.addColorStop(0, '#2E180A'); hg.addColorStop(1, '#5C3416');
      hix.globalCompositeOperation = 'source-atop'; hix.fillStyle = hg; hix.fillRect(0, 0, P, P); hix.globalCompositeOperation = 'source-over'; }
    if (emo) { hix.save(); hix.globalCompositeOperation = 'source-atop'; hix.globalAlpha = .5; hix.drawImage(tint(emo, '#1E0E04'), (P - emo.width) / 2, (P - emo.height) / 2); hix.restore(); }
    innerGlow(hix, inv, mask, 'rgba(0,0,0,.85)', 6 * dpr, 0, 4 * dpr);
    innerGlow(hix, inv, mask, 'rgba(255,200,140,.3)', 2 * dpr, 0, -2 * dpr);
    hx.drawImage(hIn, 0, 0);
    // توهج للتلميح
    const glow = mk(P, P), gx = glow.getContext('2d');
    gx.shadowColor = '#FFF27A'; gx.shadowBlur = 10 * dpr; gx.shadowOffsetX = P * 2;
    const yel = tint(mask, '#FFE95C'); gx.drawImage(yel, -P * 2, 0); gx.drawImage(yel, -P * 2, 0);
    return { P, sz: P / dpr, top, side, shadow, hole, glow, mask };
  }

  /* ---------- رسم الخشب ---------- */
  function woodGrain(x, rx, ry, rw, rh, c1, c2, seed, lineCol) {
    const R = rng(seed);
    const g = x.createLinearGradient(rx, ry, rx + rw * .3, ry + rh);
    g.addColorStop(0, c1); g.addColorStop(.5, c2); g.addColorStop(1, c1);
    x.fillStyle = g; x.fillRect(rx, ry, rw, rh);
    const knots = Array.from({ length: 2 + Math.floor(R() * 2) }, () => ({ x: rx + R() * rw, y: ry + R() * rh, rx: 30 + R() * 50, ry: 8 + R() * 8 }));
    const lines = Math.ceil(rh / 3.2);
    const ph1 = R() * 10, ph2 = R() * 10;
    for (let i = 0; i < lines; i++) {
      const y0 = ry + i * rh / lines + R() * 2;
      x.beginPath();
      for (let xx = rx - 10; xx <= rx + rw + 10; xx += 7) {
        let y = y0 + Math.sin(xx * .008 + ph1 + i * .05) * 5 + Math.sin(xx * .031 + ph2 + i * .21) * 1.6;
        for (const k of knots) {
          const dx = (xx - k.x) / k.rx, dy = (y0 - k.y) / (k.ry * 2.2), f = Math.exp(-dx * dx - dy * dy);
          y += Math.sign(y0 - k.y || 1) * f * k.ry * 1.4;
        }
        xx === rx - 10 ? x.moveTo(xx, y) : x.lineTo(xx, y);
      }
      x.strokeStyle = lineCol.replace('A', (.04 + R() * .14).toFixed(3)); x.lineWidth = .5 + R() * 1.8; x.stroke();
    }
    for (const k of knots) {
      for (let j = 4; j >= 1; j--) {
        x.beginPath(); x.ellipse(k.x, k.y, k.rx * .22 * j / 2.2, k.ry * .5 * j / 2.2, 0, 0, TAU);
        x.strokeStyle = lineCol.replace('A', (.1 + j * .03).toFixed(2)); x.lineWidth = 1.2; x.stroke();
      }
      x.beginPath(); x.ellipse(k.x, k.y, k.rx * .08, k.ry * .2, 0, 0, TAU); x.fillStyle = lineCol.replace('A', '.35'); x.fill();
    }
  }

  /* ---------- الواجهة ---------- */
  App.css(`
  #shapes{background:#FFE9D0;overflow:hidden}
  #shapes canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #shapes .ib{color:#B85A12}
  #shapes .chip{color:#7A3E10}
  #shapes .chip b{color:#C25A0E}
  #shapes .panel{border-color:#FFE0B8;box-shadow:0 8px 0 #E9B680,0 20px 40px rgba(80,40,0,.3);color:#6B3510}
  #shapes .panel h3{color:#C9560A}
  #shapes .btn{background:#FF8A3D;box-shadow:0 4px 0 #CF5F12}
  #shapes .btn.alt{background:#fff;color:#C9560A;box-shadow:0 4px 0 #EFC69A;border-color:#FFE0B8}
  #shapes .btn:active{box-shadow:0 1px 0 #CF5F12}
  #shapes .overlay{background:rgba(90,45,10,.35)}
  #shapes .lvp{width:min(94vw,420px);max-height:86vh;overflow-y:auto;touch-action:pan-y}
  #shapes .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:10px 0 12px}
  #shapes .lvb{position:relative;aspect-ratio:1;border-radius:20px;background:linear-gradient(#FFD9A8,#F2B572);box-shadow:0 4px 0 #C98744,inset 0 2px 0 rgba(255,255,255,.6);
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#6B3510;font-weight:900;padding:2px}
  #shapes .lvb:active{transform:translateY(3px);box-shadow:0 1px 0 #C98744}
  #shapes .lvb .n{font-size:13px;position:absolute;top:3px;right:8px;opacity:.75}
  #shapes .lvb .e{font-size:26px;line-height:1.1}
  #shapes .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:12px}
  #shapes .lvb .s i{font-style:normal}
  #shapes .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #shapes .lvb.cur{outline:3px solid #FF8A3D;outline-offset:2px}
  #shapes .lvb.lock{background:linear-gradient(#E9DCCB,#D5C3AC);box-shadow:0 4px 0 #B5A089;color:#8d7a66}
  #shapes .lvb.lock .e{filter:grayscale(1);opacity:.35;font-size:22px}
  #shapes .lvb.lock::after{content:'🔒';position:absolute;font-size:20px;bottom:4px}
  #shapes .hint{top:auto}
  #shapes .hint span{background:rgba(255,250,240,.92);color:#7A3E10;box-shadow:0 2px 8px rgba(120,60,10,.15)}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🔢</button>
      <span class="grow"></span>
      <div class="chip"><small>المستوى</small><b class="cLv">1</b></div>
      <div class="chip"><small>الأخطاء</small><b class="cMs">0</b></div>
    </div>
    <div class="hint"><span class="hintT"></span></div>
    <div class="overlay" id="shLv"><div class="panel lvp"><h3>🔢 المستويات</h3><div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="shWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const bar = root.querySelector('.bar');
  const hintEl = root.querySelector('.hint'), hintT = root.querySelector('.hintT');
  const lvOv = root.querySelector('#shLv'), winOv = root.querySelector('#shWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, S = 80, portrait = true;
  let board = null, tray = null, bgLayer = null;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, pieces = [], mistakes = 0, over = false, winTimer = 0;
  let drag = null, parts = [], shake = 0, rings = [];
  let holesPos = [], slotsPos = [];
  let hintShown = false;

  /* ---------- التخطيط ---------- */
  function bestGrid(n, w, h) {
    let best = { cols: 1, rows: n, cell: 0 };
    for (let cols = 1; cols <= n; cols++) {
      const rows = Math.ceil(n / cols), cell = Math.min(w / cols, h / rows);
      if (cell > best.cell + .5) best = { cols, rows, cell };
    }
    return best;
  }
  function gridPts(n, r, gr) {
    const pts = [], cw = r.w / gr.cols, ch = r.h / gr.rows;
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / gr.cols), inRow = row === gr.rows - 1 ? n - row * gr.cols : gr.cols;
      const col = i % gr.cols, off = (gr.cols - inRow) * cw / 2;
      pts.push({ x: Math.round((r.x + off + (col + .5) * cw) * dpr) / dpr, y: Math.round((r.y + (row + .5) * ch) * dpr) / dpr });
    }
    return pts;
  }
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const top = bar.getBoundingClientRect().bottom + 4, pad = 14, bottom = H - Math.max(pad, 10);
    portrait = W / H < 1.05;
    const n = pieces.length || 3;
    if (portrait) {
      const aw = Math.min(W - pad * 2, 620), ax = (W - aw) / 2, ah = bottom - top;
      const bh = Math.round(ah * .58);
      board = { x: ax, y: top, w: aw, h: bh - 12 };
      tray = { x: ax, y: top + bh + 4, w: aw, h: ah - bh - 4 };
    } else {
      const aw = Math.min(W - pad * 2, 1180), ax = (W - aw) / 2, ah = bottom - top;
      const bw = Math.round(aw * .6);
      board = { x: ax, y: top, w: bw - 8, h: ah - 12 };
      tray = { x: ax + bw + 8, y: top, w: aw - bw - 8, h: ah };
    }
    const bi = { x: board.x + 22, y: board.y + 22, w: board.w - 44, h: board.h - 44 };
    const ti = { x: tray.x + 20, y: tray.y + 16, w: tray.w - 40, h: tray.h - 48 };
    const gb = bestGrid(n, bi.w, bi.h), gt = bestGrid(n, ti.w, ti.h);
    S = Math.max(40, Math.min(gb.cell * .84, gt.cell * .86, 170));
    holesPos = gridPts(n, bi, gb); slotsPos = gridPts(n, ti, gt);
    hintEl.style.top = (portrait ? board.y + board.h - 2 : H - 40) + 'px';
    if (!portrait) { hintEl.style.left = board.x + 'px'; hintEl.style.right = (W - board.x - board.w) + 'px'; }
    else { hintEl.style.left = '0'; hintEl.style.right = '0'; }
  }
  function placePieces() {
    for (const p of pieces) {
      p.b = bake(p.it, S, dpr);
      p.hx = holesPos[p.hi].x; p.hy = holesPos[p.hi].y;
      p.homeX = slotsPos[p.si].x; p.homeY = slotsPos[p.si].y;
      if (p.state === 'done' || p.state === 'fly') { p.x = p.hx; p.y = p.hy; p.state = 'done'; p.sc = 1 / .97; p.rot = 0; p.pop = 0; }
      else if (p.state !== 'drag') { p.x = p.homeX; p.y = p.homeY; if (p.state === 'back' && p.a >= 0) p.state = 'tray'; }
    }
    buildBg();
  }

  /* الطبقة الثابتة: الغرفة + اللوح + الصينية + الفتحات */
  function buildBg() {
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    // جدار
    let g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#FFF3E0'); g.addColorStop(1, '#FFE2C2');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i * 34 < W + 34; i++) { x.fillStyle = i % 2 ? 'rgba(255,255,255,.35)' : 'rgba(255,200,150,.12)'; x.fillRect(i * 34, 0, 17, H); }
    const R = rng(7);
    for (let i = 0; i < 26; i++) { x.fillStyle = ['rgba(255,140,90,.18)', 'rgba(120,200,220,.2)', 'rgba(255,205,80,.22)'][i % 3]; x.beginPath(); x.arc(R() * W, R() * H * .7, 3 + R() * 5, 0, TAU); x.fill(); }
    // أرضية خشبية فاتحة
    const fy = portrait ? H * .74 : H * .7;
    g = x.createLinearGradient(0, fy, 0, H); g.addColorStop(0, '#E9C79C'); g.addColorStop(1, '#D9AE7C');
    x.fillStyle = g; x.fillRect(0, fy, W, H - fy);
    x.fillStyle = 'rgba(255,255,255,.5)'; x.fillRect(0, fy, W, 3);
    x.fillStyle = 'rgba(150,95,45,.18)';
    for (let yy = fy + 26, k = 0; yy < H; yy += 26, k++) { x.fillRect(0, yy, W, 1.5); for (let xx = (k % 2) * 70; xx < W; xx += 140) x.fillRect(xx, yy - 26, 1.5, 26); }
    // سجادة دائرية
    const cx = W / 2, cy = (fy + H) / 2 + 10, rw = Math.min(W * .48, 420), rh = Math.max(30, (H - fy) * .42);
    ['#FFB36B', '#FFE08A', '#8FD6C8', '#FF9AB8', '#FFE9C4'].forEach((c, i) => { x.fillStyle = c; x.beginPath(); x.ellipse(cx, cy, rw * (1 - i * .17), rh * (1 - i * .17), 0, 0, TAU); x.fill(); });
    // الصينية (خشب فاتح + لبّاد)
    drawTray(x, tray);
    drawBoard(x, board);
    for (const p of pieces) { const s = p.b.sz; x.drawImage(p.b.hole, p.hx - s / 2, p.hy - s / 2, s, s); }
  }
  function drawBoard(x, b) {
    const rad = 26, th = 12;
    x.save(); x.shadowColor = 'rgba(80,40,10,.38)'; x.shadowBlur = 22; x.shadowOffsetY = 12;
    x.fillStyle = '#7E4A20'; x.beginPath(); x.roundRect(b.x, b.y + th, b.w, b.h, rad); x.fill(); x.restore();
    x.fillStyle = '#8A5426'; x.beginPath(); x.roundRect(b.x, b.y + th, b.w, b.h, rad); x.fill();
    x.save(); x.beginPath(); x.roundRect(b.x, b.y, b.w, b.h, rad); x.clip();
    woodGrain(x, b.x, b.y, b.w, b.h, '#D49255', '#E3A866', 11, 'rgba(110,55,15,A)');
    // تظليل الحواف
    let g = x.createLinearGradient(0, b.y, 0, b.y + b.h); g.addColorStop(0, 'rgba(255,240,210,.25)'); g.addColorStop(.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(90,40,0,.18)');
    x.fillStyle = g; x.fillRect(b.x, b.y, b.w, b.h);
    x.restore();
    // حافة مشطوفة
    x.lineWidth = 3; x.strokeStyle = 'rgba(255,230,190,.7)'; x.beginPath(); x.roundRect(b.x + 1.5, b.y + 1.5, b.w - 3, b.h - 3, rad - 1); x.stroke();
    // أخدود داخلي
    const ins = 11;
    x.lineWidth = 2.5; x.strokeStyle = 'rgba(95,45,10,.35)'; x.beginPath(); x.roundRect(b.x + ins, b.y + ins, b.w - ins * 2, b.h - ins * 2, rad - 8); x.stroke();
    x.lineWidth = 1.5; x.strokeStyle = 'rgba(255,225,180,.55)'; x.beginPath(); x.roundRect(b.x + ins + 2, b.y + ins + 2, b.w - ins * 2 - 4, b.h - ins * 2 - 4, rad - 10); x.stroke();
    // مسامير
    [[b.x + 12, b.y + 12], [b.x + b.w - 12, b.y + 12], [b.x + 12, b.y + b.h - 12], [b.x + b.w - 12, b.y + b.h - 12]].forEach(([sx, sy], i) => {
      const gg = x.createRadialGradient(sx - 1.5, sy - 1.5, .5, sx, sy, 5); gg.addColorStop(0, '#FFF6D8'); gg.addColorStop(1, '#B08A4A');
      x.fillStyle = gg; x.beginPath(); x.arc(sx, sy, 4.5, 0, TAU); x.fill();
      x.strokeStyle = 'rgba(90,60,20,.7)'; x.lineWidth = 1.2; x.beginPath(); const a = .6 + i; x.moveTo(sx - Math.cos(a) * 3, sy - Math.sin(a) * 3); x.lineTo(sx + Math.cos(a) * 3, sy + Math.sin(a) * 3); x.stroke();
    });
  }
  function drawTray(x, t) {
    const rad = 26, th = 10;
    x.save(); x.shadowColor = 'rgba(80,40,10,.28)'; x.shadowBlur = 18; x.shadowOffsetY = 10;
    x.fillStyle = '#C08A4E'; x.beginPath(); x.roundRect(t.x, t.y + th, t.w, t.h - th, rad); x.fill(); x.restore();
    x.save(); x.beginPath(); x.roundRect(t.x, t.y, t.w, t.h - th, rad); x.clip();
    woodGrain(x, t.x, t.y, t.w, t.h, '#EFC487', '#F7D59E', 23, 'rgba(150,90,30,A)');
    x.restore();
    x.lineWidth = 2.5; x.strokeStyle = 'rgba(255,245,220,.8)'; x.beginPath(); x.roundRect(t.x + 1.5, t.y + 1.5, t.w - 3, t.h - th - 3, rad - 1); x.stroke();
    // لبّاد غائر
    const f = { x: t.x + 12, y: t.y + 12, w: t.w - 24, h: t.h - th - 24 };
    x.save(); x.beginPath(); x.roundRect(f.x, f.y, f.w, f.h, rad - 10); x.clip();
    const g = x.createLinearGradient(0, f.y, 0, f.y + f.h); g.addColorStop(0, '#FFF6E6'); g.addColorStop(1, '#FBE9CC');
    x.fillStyle = g; x.fillRect(f.x, f.y, f.w, f.h);
    const R = rng(5); x.fillStyle = 'rgba(190,140,80,.07)';
    for (let i = 0; i < f.w * f.h / 90; i++) x.fillRect(f.x + R() * f.w, f.y + R() * f.h, 1, 1);
    // ظل داخلي
    x.shadowColor = 'rgba(140,90,40,.4)'; x.shadowBlur = 10; x.shadowOffsetY = 4;
    x.lineWidth = 12; x.strokeStyle = '#000'; x.beginPath(); x.roundRect(f.x - 6, f.y - 6, f.w + 12, f.h + 12, rad - 4); x.stroke();
    x.restore();
    x.setLineDash([7, 6]); x.lineWidth = 2; x.strokeStyle = 'rgba(214,160,95,.55)';
    x.beginPath(); x.roundRect(f.x + 7, f.y + 7, f.w - 14, f.h - 14, rad - 16); x.stroke(); x.setLineDash([]);
  }

  /* ---------- المستويات ---------- */
  function startLevel(n) {
    lvl = clamp(n, 1, LEVELS.length);
    clearTimeout(winTimer); winOv.classList.remove('on'); lvOv.classList.remove('on');
    const def = LEVELS[lvl - 1];
    const cols = shuffle(COLORS.slice());
    const hi = shuffle(def.items.map((_, i) => i)), si = shuffle(def.items.map((_, i) => i));
    pieces = def.items.map((k, i) => {
      const geo = !!GEO[k];
      return { it: { k, geo, col: cols[i % cols.length] }, name: geo ? GEO[k] : EMO[k], hi: hi[i], si: si[i],
        x: 0, y: 0, state: 'back', a: -.25 - i * .09, fx: 0, fy: 0, rot: 0, sc: 1, lift: 0, wob: 0, pop: 0, errs: 0, ph: Math.random() * TAU, flash: 0, hint: 0 };
    });
    mistakes = 0; over = false; drag = null; parts = []; rings = [];
    layout(); placePieces();
    pieces.forEach(p => { p.state = 'back'; p.fx = p.homeX + (portrait ? 0 : W * .3); p.fy = p.homeY + (portrait ? H * .45 : 0); p.x = p.fx; p.y = p.fy; p.wob = 0; });
    updChips();
    const pr = loadProg();
    if (!hintShown || !pr.stars[lvl]) { hintT.textContent = '👆 ' + App.g('اسحبي كل قطعة إلى مكانها', 'اسحب كل قطعة إلى مكانها'); hintEl.style.opacity = 1; }
    else hintEl.style.opacity = 0;
    Sound.whoosh();
  }
  function updChips() {
    root.querySelector('.cLv').textContent = lvl + '/' + LEVELS.length;
    root.querySelector('.cMs').textContent = mistakes;
  }
  function openLevels() {
    const pr = loadProg();
    const g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}"><span class="n">${n}</span><span class="e">${L.ic}</span>
        <span class="s">${lock ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    g.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
  }
  function win() {
    over = true;
    const pr = loadProg();
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('shapesProg', pr);
    hintShown = true;
    // احتفال
    for (let i = 0; i < 140; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 260), rot: rand(0, TAU), vr: rand(-8, 8),
      life: rand(2.5, 4), age: 0, s: rand(6, 11), c: ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9'][i % 6] });
    Sound.win(); vibrate(30);
    winTimer = setTimeout(() => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنت!') + ' 🎉';
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wP').textContent = App.g('أنهيتِ', 'أنهيتَ') + ` المستوى ${lvl}` + (mistakes ? ` · الأخطاء: ${mistakes}` : ' دون أي خطأ! 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < LEVELS.length ? '' : 'none';
      winOv.classList.add('on');
      App.speak(App.g('أحسنتِ!', 'أحسنت!'));
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('shapes_first');
      if (!mistakes) App.achieve('shapes_perfect');
      if (LEVELS.every((_, i) => pr.stars[i + 1])) App.achieve('shapes_all');
    }, 1100);
  }

  /* ---------- الجسيمات ---------- */
  function sparkle(x, y, col) {
    for (let i = 0; i < 18; i++) {
      const a = rand(0, TAU), v = rand(80, 260);
      parts.push({ t: i % 3 ? 'star' : 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .9), age: 0, s: rand(5, 10), c: i % 2 ? '#FFE26B' : col });
    }
    rings.push({ x, y, age: 0, life: .45, c: col });
  }
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function hit(x, y, states) {
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i]; if (!states.includes(p.state)) continue;
      if (Math.hypot(p.x - x, p.y - y) < S * .58) return p;
    }
    return null;
  }
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused || drag || winOv.classList.contains('on') || lvOv.classList.contains('on')) return;
    const m = pos(e);
    const p = hit(m.x, m.y, ['tray', 'back']);
    if (p) {
      if (p.state === 'back' && p.a < 0) return;
      try { cv.setPointerCapture(e.pointerId); } catch (er) {}
      drag = { p, id: e.pointerId, ox: p.x - m.x, oy: p.y - m.y, sx: m.x, sy: m.y, tx: p.x, ty: p.y, moved: false, t0: performance.now(), touch: e.pointerType !== 'mouse', lastX: m.x, vx: 0 };
      p.state = 'drag'; p.wob = 0;
      pieces.splice(pieces.indexOf(p), 1); pieces.push(p);
      Sound.tone(520, .08, 'sine', .1, 260); vibrate(10);
      return;
    }
    const d = hit(m.x, m.y, ['done']);
    if (d) { d.pop = 1; Sound.pop(); App.speak(d.name); sparkle(d.x, d.y, d.it.col[0]); }
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const m = pos(e);
    if (!drag.moved && Math.hypot(m.x - drag.sx, m.y - drag.sy) > 8) { drag.moved = true; if (hintEl.style.opacity !== '0') hintEl.style.opacity = 0; }
    drag.tx = m.x + drag.ox; drag.ty = m.y + drag.oy - (drag.touch && drag.moved ? S * .22 : 0);
    drag.vx = drag.vx * .6 + (m.x - drag.lastX) * .4; drag.lastX = m.x;
  });
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag, p = d.p; drag = null;
    if (!d.moved && performance.now() - d.t0 < 350) {           // لمسة: نطق الاسم
      App.speak(p.name); p.pop = 1; Sound.pop();
      toTray(p, false); return;
    }
    const tol = S * .38;
    if (Math.hypot(p.x - p.hx, p.y - p.hy) < tol) { snap(p); return; }
    const wrong = pieces.find(q => q !== p && q.state !== 'done' && Math.hypot(p.x - q.hx, p.y - q.hy) < tol);
    if (wrong) {
      mistakes++; p.errs++; updChips();
      wrong.flash = 1;
      Sound.error(); vibrate(35); shake = Math.max(shake, 4);
      if (p.errs >= 2) p.hint = 3;
      toTray(p, true);
    } else { Sound.slide(); toTray(p, false); }
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);
  function toTray(p, wobble) { p.state = 'back'; p.a = 0; p.fx = p.x; p.fy = p.y; p.wob = wobble ? 1 : 0; }
  function snap(p) { p.state = 'fly'; p.a = 0; p.fx = p.x; p.fy = p.y; p.hint = 0; }

  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < LEVELS.length ? 'next' : 'levels'); }
    else if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? lvOv.classList.remove('on') : openLevels(); }
  });
  function act(a) {
    Sound.tap();
    if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
    else if (a === 'close') { lvOv.classList.remove('on'); if (over) winOv.classList.add('on'); }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    const k = 1 - Math.exp(-dt * 28);
    for (const p of pieces) {
      p.pop = Math.max(0, p.pop - dt * 2.6);
      p.flash = Math.max(0, p.flash - dt * 1.8);
      if (p.hint > 0) p.hint = Math.max(0, p.hint - dt);
      if (p.state === 'drag' && drag && drag.p === p) {
        p.x += (drag.tx - p.x) * k; p.y += (drag.ty - p.y) * k;
        p.rot += (clamp(drag.vx * .02, -.3, .3) - p.rot) * k * .5;
        p.lift += (1 - p.lift) * k * .6; p.sc += (1.14 - p.sc) * k * .6;
      } else if (p.state === 'fly') {
        p.a += dt / .2; const t = Math.min(1, p.a), e = ease.outCubic(t);
        p.x = p.fx + (p.hx - p.fx) * e; p.y = p.fy + (p.hy - p.fy) * e;
        p.rot *= 1 - k; p.sc = 1.14 - .14 * e; p.lift = 1 - e;
        if (t >= 1) {
          p.state = 'done'; p.x = p.hx; p.y = p.hy; p.rot = 0; p.sc = 1 / .97; p.lift = 0; p.pop = 1;
          Sound.thud(); Sound.pop(); vibrate(25); shake = Math.max(shake, 3);
          sparkle(p.x, p.y, p.it.col[0]); App.speak(p.name);
          if (pieces.every(q => q.state === 'done')) win();
        }
      } else if (p.state === 'back') {
        p.a += dt / (p.wob ? .55 : .38);
        if (p.a < 0) continue;
        const t = Math.min(1, p.a);
        const tm = p.wob ? clamp((t - .3) / .7, 0, 1) : t;
        const e = p.wob ? ease.outCubic(tm) : ease.outBack(tm);
        p.x = p.fx + (p.homeX - p.fx) * e; p.y = p.fy + (p.homeY - p.fy) * e;
        p.rot = p.wob ? Math.sin(t * 34) * .28 * (1 - t) : p.rot * (1 - k);
        p.lift += (0 - p.lift) * k * .5; p.sc += (1 - p.sc) * k * .5;
        if (t >= 1) { p.state = 'tray'; p.x = p.homeX; p.y = p.homeY; p.rot = 0; }
      } else if (p.state === 'tray') {
        p.x = p.homeX; p.y = p.homeY + Math.sin(T * 2.2 + p.ph) * 1.5;
        p.rot = 0; p.lift *= 1 - k; p.sc += (1 - p.sc) * k; if (Math.abs(p.sc - 1) < .003) p.sc = 1; if (p.lift < .005) p.lift = 0;
      }
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.t === 'conf') { q.vy = Math.min(q.vy + 120 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; }
      else { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 300 * dt; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    shake = Math.max(0, shake - dt * 18);
  }

  /* ---------- الرسم ---------- */
  function drawPiece(p, inHole) {
    const b = p.b, sz = b.sz, h = sz / 2;
    const sq = Math.sin((1 - p.pop) * Math.PI * 3) * p.pop * .13;
    // محاذاة لبكسلات الجهاز: القطعة الساكنة تُرسم 1:1 بلا أي تكبير/تدوير فتبقى حادّة تمامًا
    const still = !sq && Math.abs(p.rot) < .002 && Math.abs(p.sc - (inHole ? 1 / .97 : 1)) < .002 && (inHole || p.lift < .01);
    const px = Math.round(p.x * dpr) / dpr, py = Math.round(p.y * dpr) / dpr;
    ctx.save(); ctx.translate(px, py);
    if (!inHole) {
      const so = 3 + p.lift * 16;
      ctx.save(); ctx.globalAlpha = .55 - p.lift * .2; ctx.translate(so * .35, so);
      const ss = p.sc * (1 + p.lift * .06); ctx.rotate(p.rot); ctx.scale(ss, ss);
      ctx.drawImage(b.shadow, -h, -h, sz, sz); ctx.restore();
    }
    if (!still) { ctx.rotate(p.rot); ctx.scale(p.sc * (inHole ? .97 : 1) * (1 + sq), p.sc * (inHole ? .97 : 1) * (1 - sq)); }
    const th = Math.round((inHole ? 2 : S * .085) * dpr), st = 1;
    for (let i = th; i > 0; i -= st) ctx.drawImage(b.side, -h, -h + i / dpr, sz, sz);
    ctx.drawImage(b.top, -h, -h, sz, sz);
    ctx.restore();
  }
  function render() {
    ctx.save();
    ctx.fillStyle = '#FFE9D0'; ctx.fillRect(0, 0, W, H);
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    // توهج الفتحات (قرب السحب / تلميح / خطأ)
    for (const p of pieces) {
      if (p.state === 'done') continue;
      let gA = 0;
      if (drag && drag.moved) { const d = Math.hypot(drag.p.x - p.hx, drag.p.y - p.hy); gA = clamp(1 - d / (S * .9), 0, 1) * .85; }
      const hintOn = pieces.some(q => q.hint > 0 && q.hi === p.hi && q.state !== 'done');
      if (hintOn) gA = Math.max(gA, .45 + .45 * Math.sin(T * 8));
      if (gA > .01) { ctx.save(); ctx.globalAlpha = gA; ctx.drawImage(p.b.glow, p.hx - p.b.sz / 2, p.hy - p.b.sz / 2, p.b.sz, p.b.sz); ctx.drawImage(p.b.hole, p.hx - p.b.sz / 2, p.hy - p.b.sz / 2, p.b.sz, p.b.sz); ctx.restore(); }
      if (p.flash > 0) {
        ctx.save(); ctx.globalAlpha = p.flash; ctx.translate(p.hx, p.hy); ctx.rotate(Math.sin(T * 30) * .1 * p.flash);
        ctx.strokeStyle = '#FF4B4B'; ctx.lineWidth = 7; ctx.lineCap = 'round'; const a = S * .16;
        ctx.beginPath(); ctx.moveTo(-a, -a); ctx.lineTo(a, a); ctx.moveTo(a, -a); ctx.lineTo(-a, a); ctx.stroke(); ctx.restore();
      }
    }
    for (const p of pieces) if (p.state === 'done') drawPiece(p, true);
    for (const p of pieces) if (p.state === 'tray') drawPiece(p, false);
    for (const p of pieces) if (p.state === 'back' || p.state === 'fly') drawPiece(p, false);
    if (drag) drawPiece(drag.p, false);
    // حلقات وجسيمات
    for (const r of rings) {
      const t = r.age / r.life;
      ctx.save(); ctx.globalAlpha = 1 - t; ctx.strokeStyle = '#FFF4B0'; ctx.lineWidth = 6 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, S * (.45 + t * .5), 0, TAU); ctx.stroke(); ctx.restore();
    }
    for (const q of parts) {
      const a = 1 - q.age / q.life;
      ctx.save(); ctx.globalAlpha = q.t === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillStyle = q.c;
      if (q.t === 'star') { starPath(ctx, q.s * (.6 + a * .5)); ctx.fill(); }
      else if (q.t === 'dot') { ctx.beginPath(); ctx.arc(0, 0, q.s * .45 * a + 1, 0, TAU); ctx.fill(); }
      else { ctx.scale(1, Math.cos(q.age * 9 + q.rot)); ctx.fillRect(-q.s / 2, -q.s * .3, q.s, q.s * .6); }
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

  window.addEventListener('resize', () => {
    if (App.current !== ID || !pieces.length) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); placePieces(); if (!running) render(); }, 60);
  });
  let resizeT = 0;

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#FFE7C7'); g.addColorStop(1, '#FFC98F');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    const bx = s * .14, by = s * .2, bw = s * .72, bh = s * .56;
    c.save(); c.shadowColor = 'rgba(90,45,10,.4)'; c.shadowBlur = 10; c.shadowOffsetY = 6;
    c.fillStyle = '#8A5426'; c.beginPath(); c.roundRect(bx, by + 7, bw, bh, 16); c.fill(); c.restore();
    c.save(); c.beginPath(); c.roundRect(bx, by, bw, bh, 16); c.clip();
    woodGrain(c, bx, by, bw, bh, '#D49255', '#E3A866', 4, 'rgba(110,55,15,A)'); c.restore();
    c.lineWidth = 2; c.strokeStyle = 'rgba(255,230,190,.8)'; c.beginPath(); c.roundRect(bx + 1, by + 1, bw - 2, bh - 2, 15); c.stroke();
    // فتحة نجمة
    c.save(); c.translate(s * .38, s * .47);
    c.fillStyle = 'rgba(255,226,180,.6)'; c.save(); c.translate(0, 2); starPath(c, s * .17); c.fill(); c.restore();
    g = c.createLinearGradient(0, -s * .17, 0, s * .17); g.addColorStop(0, '#24120A'); g.addColorStop(1, '#5C3416');
    c.fillStyle = g; starPath(c, s * .17); c.lineJoin = 'round'; c.fill(); c.restore();
    // قطعة دائرية ملونة
    const cx = s * .64, cy = s * .6, r = s * .17;
    c.save(); c.shadowColor = 'rgba(60,30,5,.45)'; c.shadowBlur = 10; c.shadowOffsetX = 3; c.shadowOffsetY = 8;
    c.fillStyle = '#C42C47'; c.beginPath(); c.arc(cx, cy + 5, r, 0, TAU); c.fill(); c.restore();
    g = c.createRadialGradient(cx - r * .4, cy - r * .45, r * .1, cx, cy, r);
    g.addColorStop(0, '#FFC0C0'); g.addColorStop(.45, '#FF6B6B'); g.addColorStop(1, '#D63447');
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(cx - r * .38, cy - r * .45, r * .3, r * .14, -.6, 0, TAU); c.fill();
    // نجمة صغيرة لامعة
    c.save(); c.translate(s * .78, s * .26); c.fillStyle = '#FFD84A'; starPath(c, s * .07); c.fill(); c.restore();
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'مطابقة الأشكال', icon2: '🔷', isNew: false, music: 'shapes',
    desc: () => App.g('ضعي كل قطعة في مكانها الصحيح', 'ضع كل قطعة في مكانها الصحيح'),
    help: () => [
      '👆 ' + App.g('اسحبي', 'اسحب') + ' كل قطعة من الصينية إلى فتحتها في اللوح الخشبي',
      '🔍 ' + App.g('انظري', 'انظر') + ' إلى شكل الفتحة جيدًا: لكل قطعة فتحة واحدة تناسبها تمامًا',
      '🔊 ' + App.g('المسي', 'المس') + ' أي قطعة ' + App.g('لتسمعي', 'لتسمع') + ' اسمها',
      '⭐ ' + App.g('أنهي', 'أنهِ') + ' المستوى دون أخطاء ' + App.g('لتحصلي', 'لتحصل') + ' على 3 نجوم',
      '🔢 زر المستويات يفتح ' + App.g('لكِ', 'لك') + ' أشكالًا وحيوانات وفواكه ومركبات!'
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
      let n = Math.min(pr.unlocked, LEVELS.length);
      startLevel(n);
      render();
      startLoop();
    },
    leave() { stopLoop(); clearTimeout(winTimer); drag = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { const p = drag.p; drag = null; toTray(p, false); } },
    resume() { paused = false; last = performance.now(); },
    /* للاختبار الآلي فقط */
    _state() { return { lvl, mistakes, S, pieces: pieces.map(p => ({ name: p.name, state: p.state, x: p.x, y: p.y, hx: p.hx, hy: p.hy })) }; },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    }
  });
})();
