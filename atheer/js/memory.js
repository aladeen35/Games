/* =====================================================================
   بطاقات الذاكرة — اقلب بطاقتين في كل مرة وابحث عن الأزواج المتشابهة
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'memory';
  const TAU = Math.PI * 2;
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';
  const ASP = 1.28;           // ارتفاع البطاقة / عرضها
  const FLIP = .3;            // مدة القلب بالثواني

  /* ---------- مجموعات البطاقات ---------- */
  // c: [فاتح، أغمق، حافة، حبر]
  const DECKS = {
    animals: { t: 'الحيوانات', ic: '🐶', c: ['#F1FFF4', '#C4F0D0', '#6FC78B', '#2E7A4A'], items: [
      ['🐶', 'كلب'], ['🐱', 'قطة'], ['🐰', 'أرنب'], ['🦁', 'أسد'], ['🐘', 'فيل'], ['🦒', 'زرافة'], ['🐼', 'باندا'],
      ['🐵', 'قرد'], ['🐸', 'ضفدع'], ['🐧', 'بطريق'], ['🦊', 'ثعلب'], ['🐮', 'بقرة'], ['🐔', 'دجاجة'], ['🐴', 'حصان']] },
    fruits: { t: 'الفواكه', ic: '🍎', c: ['#FFF6EA', '#FFD7B0', '#F2A060', '#9A4A10'], items: [
      ['🍎', 'تفاحة'], ['🍌', 'موزة'], ['🍇', 'عنب'], ['🍓', 'فراولة'], ['🍉', 'بطيخ'], ['🍊', 'برتقالة'], ['🍋', 'ليمونة'],
      ['🍒', 'كرز'], ['🍍', 'أناناس'], ['🥝', 'كيوي'], ['🍑', 'خوخ'], ['🥭', 'مانجو'], ['🍐', 'كمثرى'], ['🥥', 'جوز الهند']] },
    vehicles: { t: 'المركبات', ic: '🚗', c: ['#EEF6FF', '#C6DFFF', '#74A9EA', '#1F4F8F'], items: [
      ['🚗', 'سيارة'], ['🚌', 'حافلة'], ['✈️', 'طائرة'], ['🚲', 'دراجة'], ['⛵', 'قارب'], ['🚂', 'قطار'], ['🚁', 'مروحية'],
      ['🚒', 'سيارة إطفاء'], ['🚑', 'سيارة إسعاف'], ['🚓', 'سيارة شرطة'], ['🚜', 'جرّار'], ['🛵', 'دراجة نارية'], ['🚕', 'سيارة أجرة'], ['🚢', 'سفينة']] },
    space: { t: 'الفضاء', ic: '🚀', c: ['#F4F0FF', '#D8CBFF', '#9A84E6', '#4A3596'], items: [
      ['🚀', 'صاروخ'], ['☀️', 'شمس'], ['🌙', 'قمر'], ['⭐', 'نجمة'], ['🪐', 'كوكب زحل'], ['🌍', 'الأرض'], ['☄️', 'مذنّب'],
      ['🛸', 'صحن طائر'], ['👽', 'كائن فضائي'], ['🧑‍🚀', 'رائد فضاء'], ['🔭', 'مقراب'], ['🛰️', 'قمر صناعي'], ['🌠', 'شهاب'], ['🌌', 'مجرّة']] },
    sea: { t: 'البحر', ic: '🐠', c: ['#ECFEFD', '#BDEEF0', '#56BFC6', '#1A6E74'], items: [
      ['🐟', 'سمكة'], ['🐠', 'سمكة ملوّنة'], ['🐡', 'سمكة منفوخة'], ['🐙', 'أخطبوط'], ['🦀', 'سلطعون'], ['🐳', 'حوت'], ['🐬', 'دلفين'],
      ['🐚', 'صدفة'], ['🦈', 'قرش'], ['🐢', 'سلحفاة'], ['🦑', 'حبّار'], ['🦞', 'كركند'], ['🦐', 'روبيان'], ['⚓', 'مرساة']] },
    sweets: { t: 'الحلويات', ic: '🧁', c: ['#FFF1F8', '#FFCFE4', '#EE89B8', '#A0245E'], items: [
      ['🍰', 'كعكة'], ['🍩', 'دونات'], ['🍪', 'بسكويت'], ['🍭', 'مصّاصة'], ['🍬', 'حلوى'], ['🍫', 'شوكولاتة'], ['🧁', 'كب كيك'],
      ['🍦', 'آيس كريم'], ['🎂', 'كعكة عيد ميلاد'], ['🍮', 'بودينغ'], ['🥧', 'فطيرة'], ['🍯', 'عسل'], ['🥞', 'بان كيك'], ['🍨', 'بوظة']] }
  };
  const DECK_KEYS = Object.keys(DECKS);
  /* صور العائلة: صور حقيقية تُحمَّل من مجلد التطبيق، مع اسم صاحب كل صورة */
  DECKS.photos = { t: 'صور العائلة', ic: '🖼️', c: ['#FFF8E6', '#FFE3A8', '#E9B93A', '#8A5A00'], items: [] };
  const PHOTOS = [1, 2, 3, 4, 5, 6, 7].map(n => {
    const ph = { id: 'photo:' + n, name: App.PHOTO_NAMES[n - 1] || '', img: new Image(), ok: false, bad: false };
    ph.img.onload = () => { ph.ok = true; if (faces[ph.id] && faces[ph.id].tmp) { delete faces[ph.id]; if (cards.length) bakeFaces(); } };
    ph.img.onerror = () => { ph.bad = true; };
    ph.img.src = 'img/photos/p' + n + '.jpg';
    return ph;
  });

  /* ---------- المستويات: p أزواج، d مجموعة، peek نظرة أولى، time حدّ زمني ---------- */
  const LEVELS = [
    { p: 3, d: 'animals' }, { p: 4, d: 'fruits' }, { p: 4, d: 'photos' }, { p: 4, d: 'vehicles' },
    { p: 5, d: 'sea' }, { p: 6, d: 'sweets' }, { p: 6, d: 'photos' }, { p: 6, d: 'space' },
    { p: 6, d: 'animals', peek: 1 }, { p: 8, d: 'fruits' }, { p: 8, d: 'animals', ph: 7 }, { p: 8, d: 'vehicles' },
    { p: 8, d: 'sea', time: 100 }, { p: 9, d: 'sweets' }, { p: 9, d: 'space', peek: 1 }, { p: 10, d: 'sea', ph: 7 },
    { p: 10, d: 'animals' }, { p: 10, d: 'fruits', time: 125 }, { p: 10, d: 'vehicles', peek: 1 }, { p: 12, d: 'sea' },
    { p: 12, d: 'sweets', ph: 7, peek: 1 }, { p: 12, d: 'sweets', time: 155 }, { p: 12, d: 'space', peek: 1 }, { p: 12, d: 'animals', time: 145 },
    { p: 12, d: 'fruits', peek: 1, time: 135 }, { p: 12, d: 'mix', ph: 4, time: 145 }, { p: 12, d: 'mix', peek: 1, time: 125 }, { p: 12, d: 'mix', ph: 7, time: 125 },
    { p: 12, d: 'mix', time: 120 }, { p: 12, d: 'mix', ph: 5, peek: 1, time: 110 }
  ];
  const deckIcon = d => d === 'mix' ? '🎲' : DECKS[d].ic;
  

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  };
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const loadProg = () => { const p = store.get('memoryProg', null) || {}; return { unlocked: clamp(p.unlocked || 1, 1, LEVELS.length), stars: p.stars || {} }; };
  function starPath(c, s, inner = .45) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * inner : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  function heartPath(c, r) {
    c.beginPath(); c.moveTo(0, r * .9);
    c.bezierCurveTo(-r * 1.4, 0, -r * .65, -r * 1.1, 0, -r * .42);
    c.bezierCurveTo(r * .65, -r * 1.1, r * 1.4, 0, 0, r * .9); c.closePath();
  }
  function crownPath(c, s) {
    c.beginPath(); c.moveTo(-s * .5, s * .32); c.lineTo(-s * .58, -s * .22); c.lineTo(-s * .26, s * .02); c.lineTo(0, -s * .38);
    c.lineTo(s * .26, s * .02); c.lineTo(s * .58, -s * .22); c.lineTo(s * .5, s * .32); c.closePath();
  }
  function emojiCanvas(e, size) {
    const P = Math.ceil(size * 1.5 * dpr), c = mk(P, P), x = c.getContext('2d');
    let fs = size * dpr;
    x.direction = 'ltr'; x.font = `${fs}px ${EMOJI_FONT}`;
    let m = x.measureText(e);
    const w = (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || m.width), h = (m.actualBoundingBoxAscent || fs * .8) + (m.actualBoundingBoxDescent || fs * .2);
    fs *= Math.min(1.25, size * dpr / Math.max(w, h, 1)); x.font = `${fs}px ${EMOJI_FONT}`; m = x.measureText(e);
    const L = m.actualBoundingBoxLeft || m.width / 2, R = m.actualBoundingBoxRight || m.width / 2;
    const A = m.actualBoundingBoxAscent || fs * .8, D = m.actualBoundingBoxDescent || fs * .2;
    x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.fillText(e, P / 2 + (L - R) / 2, P / 2 + (A - D) / 2);
    return c;
  }

  /* ---------- رسم البطاقات مسبقًا ---------- */
  function drawCrown(x, s) {
    x.save();
    const g = x.createLinearGradient(0, -s * .4, 0, s * .35); g.addColorStop(0, '#FFF6C2'); g.addColorStop(.5, '#FFCE3A'); g.addColorStop(1, '#D98A0B');
    x.fillStyle = g; crownPath(x, s); x.lineJoin = 'round'; x.fill();
    x.strokeStyle = 'rgba(120,60,0,.55)'; x.lineWidth = s * .04; x.stroke();
    x.fillStyle = '#E9A21A'; x.beginPath(); x.roundRect(-s * .52, s * .26, s * 1.04, s * .16, s * .05); x.fill();
    [[-s * .58, -s * .22], [0, -s * .38], [s * .58, -s * .22]].forEach(([bx, by]) => {
      const gg = x.createRadialGradient(bx - s * .03, by - s * .03, 0, bx, by, s * .09); gg.addColorStop(0, '#FFFFFF'); gg.addColorStop(1, '#FFB0D6');
      x.fillStyle = gg; x.beginPath(); x.arc(bx, by, s * .08, 0, TAU); x.fill();
    });
    [['#FF4F9A', -s * .26], ['#5BD0FF', 0], ['#7BE36B', s * .26]].forEach(([c, gx]) => { x.fillStyle = c; x.beginPath(); x.arc(gx, s * .34, s * .045, 0, TAU); x.fill(); });
    x.fillStyle = 'rgba(255,255,255,.6)'; x.beginPath(); x.ellipse(-s * .2, -s * .02, s * .06, s * .14, .5, 0, TAU); x.fill();
    x.restore();
  }
  function bakeBack(w, h) {
    const c = mk(w * dpr, h * dpr), x = c.getContext('2d'); x.scale(dpr, dpr);
    const r = w * .13, b = Math.max(3, w * .065);
    let g = x.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#FFF2B0'); g.addColorStop(.28, '#F4BE3A'); g.addColorStop(.52, '#FFE58A'); g.addColorStop(.78, '#D6901A'); g.addColorStop(1, '#FFD660');
    x.fillStyle = g; x.beginPath(); x.roundRect(0, 0, w, h, r); x.fill();
    x.strokeStyle = 'rgba(140,80,0,.55)'; x.lineWidth = 1; x.beginPath(); x.roundRect(.5, .5, w - 1, h - 1, r); x.stroke();
    // اللوحة الداخلية
    const iw = w - b * 2, ih = h - b * 2;
    x.save(); x.beginPath(); x.roundRect(b, b, iw, ih, r * .6); x.clip();
    g = x.createRadialGradient(w * .5, h * .4, 0, w * .5, h * .5, h * .72);
    g.addColorStop(0, '#FF78B8'); g.addColorStop(.5, '#DB2382'); g.addColorStop(1, '#7A137A');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    // شبكة معيّنات + قلوب ونجوم
    const s = w / 3.2, cx = w / 2, cy = h / 2;
    x.strokeStyle = 'rgba(255,214,110,.28)'; x.lineWidth = Math.max(.8, w * .012);
    for (let a = -8; a <= 8; a++) {
      x.beginPath(); x.moveTo(cx + a * s - h, cy - h); x.lineTo(cx + a * s + h, cy + h); x.stroke();
      x.beginPath(); x.moveTo(cx + a * s + h, cy - h); x.lineTo(cx + a * s - h, cy + h); x.stroke();
    }
    for (let a = -8; a <= 8; a++) for (let k = -8; k <= 8; k++) {
      const px = cx + (a + k) * s / 2, py = cy + (k - a) * s / 2 + s / 2;
      if (px < b - 4 || px > w - b + 4 || py < b - 4 || py > h - b + 4) continue;
      if (Math.hypot(px - cx, py - cy) < w * .3) continue;
      x.save(); x.translate(px, py);
      if ((a + k) & 1) { x.fillStyle = 'rgba(255,170,215,.55)'; heartPath(x, s * .14); x.fill(); }
      else { x.fillStyle = 'rgba(255,224,120,.75)'; starPath(x, s * .13); x.fill(); }
      x.restore();
    }
    // ميدالية التاج
    const R = w * .25;
    x.save(); x.shadowColor = 'rgba(60,0,50,.5)'; x.shadowBlur = w * .06; x.shadowOffsetY = w * .02;
    g = x.createLinearGradient(cx - R, cy - R, cx + R, cy + R); g.addColorStop(0, '#FFF3B8'); g.addColorStop(.45, '#F2B630'); g.addColorStop(1, '#C47A0A');
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R, 0, TAU); x.fill(); x.restore();
    g = x.createRadialGradient(cx, cy - R * .3, 0, cx, cy, R * .86); g.addColorStop(0, '#B42B9E'); g.addColorStop(1, '#4E0C5A');
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R * .84, 0, TAU); x.fill();
    x.setLineDash([w * .018, w * .022]); x.strokeStyle = 'rgba(255,225,140,.75)'; x.lineWidth = Math.max(.8, w * .01);
    x.beginPath(); x.arc(cx, cy, R * .72, 0, TAU); x.stroke(); x.setLineDash([]);
    x.save(); x.translate(cx, cy + R * .05); drawCrown(x, R * 1.05); x.restore();
    // لمعة زجاجية
    g = x.createLinearGradient(0, 0, w * .55, h * .5); g.addColorStop(0, 'rgba(255,255,255,.42)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.beginPath(); x.moveTo(0, 0); x.lineTo(w * .85, 0); x.quadraticCurveTo(w * .4, h * .2, 0, h * .55); x.closePath(); x.fill();
    x.restore();
    // خطوط ذهبية داخلية
    x.strokeStyle = 'rgba(255,246,200,.95)'; x.lineWidth = Math.max(1, w * .016);
    const ib = b + w * .045; x.beginPath(); x.roundRect(ib, ib, w - ib * 2, h - ib * 2, r * .45); x.stroke();
    x.strokeStyle = 'rgba(120,40,90,.55)'; x.lineWidth = 1; x.beginPath(); x.roundRect(b, b, iw, ih, r * .6); x.stroke();
    // نقاط الزوايا
    [[ib, ib], [w - ib, ib], [ib, h - ib], [w - ib, h - ib]].forEach(([px, py]) => {
      x.save(); x.translate(px, py); x.fillStyle = '#FFE680'; starPath(x, w * .045, .4); x.fill(); x.restore();
    });
    // لمعة الإطار العلوية
    x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = Math.max(1, w * .014); x.lineCap = 'round';
    const q = w * .02 + .5; x.beginPath(); x.moveTo(q, r + q); x.arcTo(q, q, r + q, q, r - q); x.lineTo(w * .6, q); x.stroke();
    return c;
  }
  function bakeFace(it, w, h) {
    const D = DECKS[it.d].c;
    const c = mk(w * dpr, h * dpr), x = c.getContext('2d'); x.scale(dpr, dpr);
    const r = w * .13, b = Math.max(3, w * .05);
    x.fillStyle = '#FFFFFF'; x.beginPath(); x.roundRect(0, 0, w, h, r); x.fill();
    x.strokeStyle = D[2]; x.globalAlpha = .55; x.lineWidth = 1.2; x.beginPath(); x.roundRect(.6, .6, w - 1.2, h - 1.2, r); x.stroke(); x.globalAlpha = 1;
    x.save(); x.beginPath(); x.roundRect(b, b, w - b * 2, h - b * 2, r * .65); x.clip();
    let g = x.createLinearGradient(0, b, 0, h - b); g.addColorStop(0, D[0]); g.addColorStop(1, D[1]);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    const R = rng(it.e.codePointAt(0));
    x.fillStyle = D[2]; x.globalAlpha = .18;
    const sp = w / 5;
    for (let yy = b + sp * .4, k = 0; yy < h; yy += sp, k++) for (let xx = b + (k % 2 ? sp / 2 : 0); xx < w; xx += sp) { x.beginPath(); x.arc(xx, yy, w * .018, 0, TAU); x.fill(); }
    x.globalAlpha = 1;
    g = x.createRadialGradient(w / 2, h * .44, 0, w / 2, h * .44, w * .45); g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) { x.save(); x.translate(b + R() * (w - b * 2), b + R() * (h - b * 2)); x.fillStyle = 'rgba(255,255,255,.8)'; starPath(x, w * (.025 + R() * .025), .4); x.fill(); x.restore(); }
    const e = emojiCanvas(it.e, w * .6), ew = e.width / dpr;
    x.save(); x.shadowColor = 'rgba(40,20,60,.28)'; x.shadowBlur = w * .05; x.shadowOffsetY = w * .03;
    x.drawImage(e, w / 2 - ew / 2, h * .44 - ew / 2, ew, ew); x.restore();
    g = x.createLinearGradient(0, 0, w * .5, h * .5); g.addColorStop(0, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.beginPath(); x.moveTo(0, 0); x.lineTo(w * .7, 0); x.quadraticCurveTo(w * .3, h * .14, 0, h * .4); x.closePath(); x.fill();
    x.restore();
    x.setLineDash([w * .05, w * .035]); x.strokeStyle = D[2]; x.globalAlpha = .7; x.lineWidth = Math.max(1, w * .014);
    const ib = b + w * .03; x.beginPath(); x.roundRect(ib, ib, w - ib * 2, h - ib * 2, r * .45); x.stroke();
    x.setLineDash([]); x.globalAlpha = 1;
    return c;
  }
  /* وجه بطاقة بصورة حقيقية: قصّ لملء الإطار مع نفس الإطار الأبيض واللمعة */
  function bakePhoto(it, w, h) {
    const ph = it.photo, D = DECKS.photos.c;
    const c = mk(w * dpr, h * dpr), x = c.getContext('2d'); x.scale(dpr, dpr);
    const r = w * .13, b = Math.max(3, w * .05);
    x.fillStyle = '#FFFFFF'; x.beginPath(); x.roundRect(0, 0, w, h, r); x.fill();
    x.strokeStyle = D[2]; x.globalAlpha = .6; x.lineWidth = 1.2; x.beginPath(); x.roundRect(.6, .6, w - 1.2, h - 1.2, r); x.stroke(); x.globalAlpha = 1;
    const iw = w - b * 2, ih = h - b * 2;
    x.save(); x.beginPath(); x.roundRect(b, b, iw, ih, r * .65); x.clip();
    let g = x.createLinearGradient(0, b, 0, h - b); g.addColorStop(0, D[0]); g.addColorStop(1, D[1]);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    if (ph.ok && ph.img.naturalWidth) {
      const im = ph.img, k = Math.max(iw / im.naturalWidth, ih / im.naturalHeight);
      const sw = iw / k, sh = ih / k;
      x.drawImage(im, (im.naturalWidth - sw) / 2, (im.naturalHeight - sh) / 2, sw, sh, b, b, iw, ih);
    } else {
      const e = emojiCanvas('📷', w * .4), ew = e.width / dpr; x.globalAlpha = .5; x.drawImage(e, w / 2 - ew / 2, h / 2 - ew / 2, ew, ew); x.globalAlpha = 1;
      c.tmp = true;
    }
    g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(.75, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(60,30,0,.18)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    g = x.createLinearGradient(0, 0, w * .5, h * .5); g.addColorStop(0, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.beginPath(); x.moveTo(0, 0); x.lineTo(w * .6, 0); x.quadraticCurveTo(w * .25, h * .12, 0, h * .32); x.closePath(); x.fill();
    x.restore();
    x.strokeStyle = D[2]; x.lineWidth = Math.max(1.5, w * .02); x.beginPath(); x.roundRect(b, b, iw, ih, r * .65); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 1; x.beginPath(); x.roundRect(b + 2, b + 2, iw - 4, ih - 4, r * .55); x.stroke();
    // اسم صاحب الصورة على شريط أسفل البطاقة
    if (it.n) {
      let fs = Math.max(9, w * .12); x.font = `800 ${fs}px 'Baloo Bhaijaan 2',system-ui,sans-serif`;
      while (x.measureText(it.n).width > iw - 10 && fs > 7) { fs -= .5; x.font = `800 ${fs}px 'Baloo Bhaijaan 2',system-ui,sans-serif`; }
      const bh = fs * 1.5, by = h - b - bh - 2;
      x.fillStyle = 'rgba(255,255,255,.88)'; x.beginPath(); x.roundRect(b + 3, by, iw - 6, bh, bh / 2); x.fill();
      x.fillStyle = D[3]; x.textAlign = 'center'; x.textBaseline = 'middle'; x.direction = 'rtl'; x.fillText(it.n, w / 2, by + bh / 2 + 1);
    }
    // قلب صغير في الزاوية
    x.save(); x.translate(w - b - w * .1, b + w * .1); x.fillStyle = '#FF5C8A'; x.strokeStyle = '#fff'; x.lineWidth = 1.5; heartPath(x, w * .06); x.fill(); x.stroke(); x.restore();
    return c;
  }
  function chime() { [784, 988, 1175, 1568].forEach((f, i) => Sound.tone(f, .28, 'sine', .1, 0, i * .07)); Sound.tone(2093, .4, 'triangle', .04, 0, .3); }
  function bakeShade(w, h, c0, c1) {
    const c = mk(w * dpr, h * dpr), x = c.getContext('2d'); x.scale(dpr, dpr);
    const g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, c0); g.addColorStop(1, c1);
    x.fillStyle = g; x.beginPath(); x.roundRect(0, 0, w, h, w * .13); x.fill(); return c;
  }
  function bakeBlur(w, h, pad, col, blur, times) {
    const c = mk((w + pad * 2) * dpr, (h + pad * 2) * dpr), x = c.getContext('2d'); x.scale(dpr, dpr);
    const off = (w + pad * 2) * 3;
    x.shadowColor = col; x.shadowBlur = blur * dpr; x.shadowOffsetX = off * dpr; x.fillStyle = '#000';
    for (let i = 0; i < times; i++) { x.beginPath(); x.roundRect(pad - off, pad, w, h, w * .13); x.fill(); }
    return c;
  }

  /* ---------- الواجهة ---------- */
  App.css(`
  #memory{background:#9C86F0;overflow:hidden}
  #memory canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #memory .ib{color:#8A2BB8}
  #memory .chip{color:#5A2A86;min-width:58px;padding:3px 9px}
  #memory .chip b{color:#B0229A}
  #memory .chip.warn b{color:#E8213F;animation:mmPulse .5s ease-in-out infinite alternate}
  @keyframes mmPulse{to{transform:scale(1.15)}}
  #memory .chip b{display:inline-block}
  #memory .panel{border-color:#EBD9FF;box-shadow:0 8px 0 #C9A6F5,0 20px 40px rgba(60,20,110,.35);color:#4E2378}
  #memory .panel h3{color:#B0229A}
  #memory .btn{background:linear-gradient(#FF6FB5,#E0218A);box-shadow:0 4px 0 #A8126A}
  #memory .btn.alt{background:#fff;color:#A82AA0;box-shadow:0 4px 0 #D8BDF5;border-color:#EBD9FF}
  #memory .btn:active{box-shadow:0 1px 0 #A8126A}
  #memory .overlay{background:rgba(50,20,90,.42)}
  #memory .lvp{width:min(94vw,440px);max-height:90vh;overflow-y:auto;touch-action:pan-y;background:linear-gradient(#FFFFFF,#F6EEFF)}
  #memory .mode{display:flex;background:#EFE3FF;border-radius:99px;padding:4px;gap:4px;margin:6px auto 4px;max-width:330px}
  #memory .mode button{flex:1;padding:7px 6px;border-radius:99px;font-weight:800;font-size:15px;background:transparent;color:#6A3A9A}
  #memory .mode button.on{background:linear-gradient(#FF6FB5,#E0218A);color:#fff;box-shadow:0 3px 0 #A8126A}
  #memory .who{display:none;margin:6px 0 2px;padding:8px;border-radius:18px;background:#F4ECFF;border:2px dashed #DCC6FA}
  #memory .who.on{display:block}
  #memory .who .pr{display:flex;align-items:center;gap:5px;flex-wrap:wrap;justify-content:center;margin:3px 0}
  #memory .who .tag{font-weight:900;font-size:13px;min-width:54px;border-radius:99px;padding:2px 8px;color:#fff}
  #memory .who .pk{padding:4px 10px;border-radius:99px;font-weight:800;font-size:14px;background:#fff;color:#6A3A9A;box-shadow:0 2px 0 #D8BDF5;opacity:.75}
  #memory .who .pk.on{opacity:1;color:#fff}
  #memory .p0{background:#FF5C8A}#memory .p1{background:#3E8BFF}
  #memory .who .pk.on.p0b{background:#FF5C8A;box-shadow:0 2px 0 #C92F5E}
  #memory .who .pk.on.p1b{background:#3E8BFF;box-shadow:0 2px 0 #1E5FC9}
  #memory .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px 9px;margin:10px 2px 12px}
  #memory .lvb{position:relative;aspect-ratio:.8;border-radius:14px;color:#4E2378;font-weight:900;display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:linear-gradient(var(--a),var(--b));border:3px solid #fff;box-shadow:0 0 0 2px var(--e),0 4px 0 2px var(--e),0 6px 10px rgba(80,30,120,.2);padding:2px}
  #memory .lvb:active{transform:translateY(3px)}
  #memory .lvb .n{font-size:12px;position:absolute;top:2px;right:6px;opacity:.75}
  #memory .lvb .bd{font-size:11px;position:absolute;top:2px;left:4px;letter-spacing:-1px}
  #memory .lvb .e{font-size:27px;line-height:1.1;font-family:${EMOJI_FONT}}
  #memory .lvb .q{font-size:11px;opacity:.75;line-height:1.1}
  #memory .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:12px}
  #memory .lvb .s i{font-style:normal}
  #memory .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #memory .lvb.cur{outline:3px dashed #E0218A;outline-offset:3px}
  #memory .lvb.lock{background:linear-gradient(#EEE8F4,#DCD2E6) !important;--e:#BFB1CF !important;color:#8E80A0}
  #memory .lvb.lock .e,#memory .lvb.lock .bd{filter:grayscale(1);opacity:.3}
  #memory .lvb.lock::after{content:'🔒';position:absolute;font-size:18px;bottom:6px}
  #memory .lvb.lock .s,#memory .lvb.lock .q{visibility:hidden}
  #memory .duo{position:absolute;left:0;right:0;top:calc(max(10px,env(safe-area-inset-top)) + 54px);display:none;justify-content:center;align-items:center;gap:8px;z-index:5;pointer-events:none;padding:0 10px}
  #memory .duo.on{display:flex}
  #memory .pp{display:flex;align-items:center;gap:6px;background:rgba(255,255,255,.88);border-radius:99px;padding:3px 6px 3px 12px;font-weight:900;color:#4E2378;
    box-shadow:0 3px 0 rgba(60,20,110,.2);border:3px solid transparent;transition:transform .25s,opacity .25s;opacity:.6;transform:scale(.92);max-width:44vw}
  #memory .pp .av{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:16px;flex:0 0 28px}
  #memory .pp .nm{font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #memory .pp .sc{min-width:28px;height:28px;border-radius:14px;display:grid;place-items:center;color:#fff;font-size:17px;padding:0 6px}
  #memory .pp.on{opacity:1;transform:scale(1.04)}
  #memory .pp.on.q0{border-color:#FF5C8A;box-shadow:0 3px 0 #C92F5E,0 0 16px rgba(255,92,138,.7)}
  #memory .pp.on.q1{border-color:#3E8BFF;box-shadow:0 3px 0 #1E5FC9,0 0 16px rgba(62,139,255,.7)}
  #memory .pp.bump .sc{animation:pop .4s cubic-bezier(.3,1.8,.6,1)}
  #memory .vs{font-weight:900;color:#fff;font-size:15px;text-shadow:0 2px 0 rgba(60,20,110,.4)}
  #memory .hint{bottom:max(8px,env(safe-area-inset-bottom))}
  #memory .hint span{background:rgba(255,255,255,.92);color:#5A2A86;box-shadow:0 2px 8px rgba(60,20,110,.2);display:inline-block;max-width:92vw}
  #memory .res{display:flex;justify-content:center;gap:10px;margin:6px 0 12px;flex-wrap:wrap}
  #memory .res div{background:#F4ECFF;border-radius:16px;padding:4px 12px;font-weight:800;font-size:14px}
  #memory .res b{display:block;font-size:22px;color:#B0229A}
  #memory .res .win{background:#FFF3C4;box-shadow:0 0 0 3px #FFD54A}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🔢</button>
      <span class="grow"></span>
      <div class="chip"><small>المستوى</small><b class="cLv">1</b></div>
      <div class="chip cMsC"><small>الأخطاء</small><b class="cMs">0</b></div>
      <div class="chip cXC"><small class="cXL">المحاولات</small><b class="cX">0</b></div>
    </div>
    <div class="duo"><div class="pp q0"><span class="av p0"></span><b class="nm"></b><span class="sc p0">0</span></div><span class="vs">VS</span>
      <div class="pp q1"><span class="av p1"></span><b class="nm"></b><span class="sc p1">0</span></div></div>
    <div class="hint"><span class="hintT"></span></div>
    <div class="overlay" id="mmLv"><div class="panel lvp"><h3>🃏 المستويات</h3>
      <div class="mode"><button data-m="1">👤 لاعب واحد</button><button data-m="2">👥 لاعبان</button></div>
      <div class="who"><div class="pr" data-s="0"></div><div class="pr" data-s="1"></div></div>
      <div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="mmEnd"><div class="panel endp"></div></div>`);
  const cv = root.querySelector('canvas.sc');
  const bar = root.querySelector('.bar');
  const duoEl = root.querySelector('.duo'), pps = [...root.querySelectorAll('.pp')];
  const hintEl = root.querySelector('.hint'), hintT = root.querySelector('.hintT');
  const lvOv = root.querySelector('#mmLv'), endOv = root.querySelector('#mmEnd'), endP = root.querySelector('.endp');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, cw = 80, ch = 100, gap = 8, cols = 2, rows = 3, mat = { x: 0, y: 0, w: 0, h: 0 };
  let bgLayer = null, backImg = null, shadeL = null, shadeR = null, shineL = null, shineR = null, shadowImg = null, glowImg = null, faces = {};
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, def = LEVELS[0], cards = [], open = [], pend = null, events = [], phase = 'deal';
  let moves = 0, mistakes = 0, streak = 0, timeLeft = 0, timed = false, lastTick = 0;
  let duo = false, turn = 0, scores = [0, 0], players = [];
  let parts = [], rings = [], banner = null, shake = 0, kf = -1, hintTimer = 0;

  function later(t, fn) { const e = { t, fn }; events.push(e); return e; }
  function cancel(e) { const i = events.indexOf(e); if (i >= 0) events.splice(i, 1); }

  /* ---------- اللاعبان ---------- */
  function duoOptions(s) {
    return [...App.PROFILES.map(p => ({ n: p.name, av: p.av || '⭐' })), { n: s ? 'لاعب 2' : 'لاعب 1', av: s ? '😎' : '🙂' }];
  }
  function loadDuo() {
    const d = store.get('memDuo', null) || {};
    const me = App.profile ? App.profile.name : App.PROFILES[0].name;
    const other = (App.PROFILES.find(p => p.name !== me) || { name: 'لاعب 2' }).name;
    let a = duoOptions(0).some(o => o.n === d.a) ? d.a : me;
    let b = duoOptions(1).some(o => o.n === d.b) ? d.b : other;
    if (a === b) b = a === other ? 'لاعب 2' : other;
    return { on: !!d.on, a, b };
  }
  function saveDuo(d) { store.set('memDuo', d); }
  function avOf(name, s) { const o = duoOptions(s).find(o => o.n === name); return o ? o.av : '🙂'; }

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    let top = bar.getBoundingClientRect().bottom + 4;
    if (duo) top = duoEl.getBoundingClientRect().bottom + 6;
    const bottom = H - 40;
    const aw = Math.min(W - 20, 1000), ah = bottom - top;
    const N = cards.length || 6;
    let best = null;
    for (let c = 1; c <= N; c++) {
      if (N % c) continue;
      const r = N / c, g = .12, pad = 14;
      const w1 = (aw - pad * 2) / (c + (c - 1) * g), w2 = (ah - pad * 2) / ((r + (r - 1) * g) * ASP);
      const w = Math.min(w1, w2, 150);
      if (!best || w > best.w + .5) best = { c, r, w };
    }
    cols = best.c; rows = best.r; cw = Math.floor(best.w); ch = Math.round(cw * ASP); gap = Math.round(cw * .12);
    const gw = cols * cw + (cols - 1) * gap, gh = rows * ch + (rows - 1) * gap;
    const gx = (W - gw) / 2, gy = top + (ah - gh) / 2;
    const mp = Math.max(10, cw * .14);
    mat = { x: gx - mp, y: gy - mp, w: gw + mp * 2, h: gh + mp * 2 };
    cards.forEach((c, i) => {
      const r = Math.floor(i / cols), k = i % cols;
      c.col = k; c.row = r;
      c.x = gx + (cols - 1 - k) * (cw + gap) + cw / 2; // من اليمين لليسار
      c.y = gy + r * (ch + gap) + ch / 2;
    });
    bake();
  }
  function bake() {
    backImg = bakeBack(cw, ch);
    shadeL = bakeShade(cw, ch, 'rgba(20,0,40,.55)', 'rgba(20,0,40,.08)'); shadeR = bakeShade(cw, ch, 'rgba(20,0,40,.08)', 'rgba(20,0,40,.55)');
    shineL = bakeShade(cw, ch, 'rgba(255,255,255,.6)', 'rgba(255,255,255,0)'); shineR = bakeShade(cw, ch, 'rgba(255,255,255,0)', 'rgba(255,255,255,.6)');
    shadowImg = bakeBlur(cw, ch, cw * .3, 'rgba(30,10,60,.6)', cw * .12, 1);
    glowImg = bakeBlur(cw, ch, cw * .4, '#FFE45C', cw * .2, 3);
    faces = {};
    bakeFaces();
    buildBg();
  }
  function bakeFaces() { for (const c of cards) if (!faces[c.it.e]) faces[c.it.e] = c.it.photo ? bakePhoto(c.it, cw, ch) : bakeFace(c.it, cw, ch); }
  function buildBg() {
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    let g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#8C78EE'); g.addColorStop(.55, '#C597F2'); g.addColorStop(1, '#FFB4D8');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const R = rng(41);
    for (let i = 0; i < 22; i++) {
      const bx = R() * W, by = R() * H, br = 20 + R() * 70;
      g = x.createRadialGradient(bx, by, 0, bx, by, br); g.addColorStop(0, 'rgba(255,255,255,.22)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.beginPath(); x.arc(bx, by, br, 0, TAU); x.fill();
    }
    for (let i = 0; i < 40; i++) {
      x.save(); x.translate(R() * W, R() * H); x.rotate(R()); x.fillStyle = `rgba(255,${230 + R() * 25 | 0},${170 + R() * 80 | 0},${.35 + R() * .5})`;
      if (i % 3) starPath(x, 2 + R() * 4, .38); else heartPath(x, 3 + R() * 3); x.fill(); x.restore();
    }
    // البساط المخملي
    const m = mat, rad = Math.max(16, cw * .22);
    x.save(); x.shadowColor = 'rgba(40,10,80,.45)'; x.shadowBlur = 24; x.shadowOffsetY = 10;
    x.fillStyle = '#2A1F6B'; x.beginPath(); x.roundRect(m.x, m.y, m.w, m.h, rad); x.fill(); x.restore();
    x.save(); x.beginPath(); x.roundRect(m.x, m.y, m.w, m.h, rad); x.clip();
    g = x.createRadialGradient(m.x + m.w / 2, m.y + m.h * .35, 0, m.x + m.w / 2, m.y + m.h / 2, Math.max(m.w, m.h) * .75);
    g.addColorStop(0, '#4A3AA6'); g.addColorStop(1, '#241A60'); x.fillStyle = g; x.fillRect(m.x, m.y, m.w, m.h);
    x.fillStyle = 'rgba(255,255,255,.05)';
    for (let i = 0; i < m.w * m.h / 50; i++) x.fillRect(m.x + R() * m.w, m.y + R() * m.h, 1, 1);
    x.restore();
    x.lineWidth = 3; x.strokeStyle = '#E9B93A'; x.beginPath(); x.roundRect(m.x + 1.5, m.y + 1.5, m.w - 3, m.h - 3, rad - 1); x.stroke();
    x.lineWidth = 1; x.strokeStyle = 'rgba(255,240,180,.8)'; x.beginPath(); x.roundRect(m.x + 3.5, m.y + 3.5, m.w - 7, m.h - 7, rad - 3); x.stroke();
    x.setLineDash([6, 5]); x.lineWidth = 1.6; x.strokeStyle = 'rgba(255,215,110,.55)';
    x.beginPath(); x.roundRect(m.x + 8, m.y + 8, m.w - 16, m.h - 16, rad - 7); x.stroke(); x.setLineDash([]);
    // أماكن البطاقات الفارغة
    x.fillStyle = 'rgba(0,0,20,.18)';
    for (const c of cards) { x.beginPath(); x.roundRect(c.x - cw / 2, c.y - ch / 2, cw, ch, cw * .13); x.fill(); }
  }

  /* ---------- المستويات ---------- */
  function pickItems(d, n, ph) {
    if (d === 'photos') { ph = n; d = 'animals'; }
    if (ph) {
      const phs = shuffle(PHOTOS.filter(p => !p.bad)).slice(0, Math.min(ph, n)).map(p => ({ e: p.id, n: p.name, d: 'photos', photo: p }));
      return shuffle([...phs, ...pickItems(d, n - phs.length, 0)]);
    }
    if (!n) return [];
    if (d !== 'mix') return shuffle(DECKS[d].items.slice()).slice(0, n).map(([e, nm]) => ({ e, n: nm, d }));
    const pool = [];
    shuffle(DECK_KEYS.slice()).forEach(k => shuffle(DECKS[k].items.slice()).forEach(([e, nm]) => pool.push({ e, n: nm, d: k })));
    const out = [], used = new Set();
    for (let round = 0; out.length < n && round < 20; round++)
      for (const k of DECK_KEYS) { const it = pool.find(p => p.d === k && !used.has(p.e)); if (it && out.length < n) { used.add(it.e); out.push(it); } }
    return shuffle(out);
  }
  function startLevel(n) {
    lvl = clamp(n, 1, LEVELS.length); def = LEVELS[lvl - 1];
    lvOv.classList.remove('on'); endOv.classList.remove('on');
    const items = pickItems(def.d, def.p, def.ph || 0);
    const deck = shuffle([...items, ...items].map(it => it));
    cards = deck.map((it, i) => ({ it, i, x: 0, y: 0, col: 0, row: 0, f: 0, tgt: 0, matched: false, mt: 0, wob: 0, pop: 0, deal: -i * .035 - .05, dr: rand(-.6, .6), ph: rand(0, TAU) }));
    open = []; pend = null; events = []; parts = []; rings = []; banner = null; shake = 0; kf = -1;
    moves = 0; mistakes = 0; streak = 0; turn = 0; scores = [0, 0];
    timed = !!def.time && !duo; timeLeft = def.time || 0; lastTick = 0;
    phase = 'deal';
    const d = loadDuo(); players = [d.a, d.b];
    duoEl.classList.toggle('on', duo);
    if (duo) { pps.forEach((p, i) => { p.querySelector('.nm').textContent = players[i]; p.querySelector('.av').textContent = avOf(players[i], i); }); }
    updChips(); updDuo();
    layout();
    later(cards.length * .035 + .55, afterDeal);
    for (let i = 0; i < Math.min(cards.length, 12); i++) Sound.tone(900 + i * 40, .04, 'triangle', .04, 200, i * .05);
    Sound.whoosh();
    const pr = loadProg();
    let h = '';
    if (def.peek) h = '👀 ' + App.g('تذكّري', 'تذكّر') + ' أماكن الصور جيدًا!';
    else if (duo) h = '👥 الزوج الصحيح يعطي دورًا إضافيًا!';
    else if (timed) h = '⏱️ ' + App.g('أسرعي', 'أسرع') + ' قبل انتهاء الوقت!';
    else if (!pr.stars[lvl]) h = '👆 ' + App.g('اقلبي بطاقتين وابحثي عن الصورتين المتشابهتين', 'اقلب بطاقتين وابحث عن الصورتين المتشابهتين');
    showHint(h, 7);
  }
  function showHint(t, dur) { hintT.textContent = t; hintEl.style.opacity = t ? 1 : 0; hintTimer = t ? dur : 0; }
  function afterDeal() {
    if (def.peek) {
      phase = 'peek';
      const dur = 1.2 + def.p * .18;
      cards.forEach((c, i) => later(i * .025, () => { c.tgt = 1; }));
      later(.15, () => { Sound.whoosh(); setBanner('👀 ' + App.g('تذكّري!', 'تذكّر!'), '#8A2BB8'); });
      later(dur, () => { cards.forEach((c, i) => later(i * .02, () => { c.tgt = 0; })); flipSound(); });
      later(dur + FLIP + cards.length * .02 + .05, beginPlay);
    } else beginPlay();
  }
  function beginPlay() {
    phase = 'play';
    if (duo) setBanner(turnText(), turn ? '#3E8BFF' : '#FF5C8A');
  }
  const turnText = () => '🎲 دور ' + players[turn];
  function updChips() {
    root.querySelector('.cLv').textContent = lvl + '/' + LEVELS.length;
    root.querySelector('.cMs').textContent = mistakes;
    root.querySelector('.cMsC').style.display = duo ? 'none' : '';
    root.querySelector('.cXL').textContent = timed ? 'الوقت' : 'المحاولات';
    const s = Math.max(0, Math.ceil(timeLeft));
    root.querySelector('.cX').textContent = timed ? `${s / 60 | 0}:${String(s % 60).padStart(2, '0')}` : moves;
    root.querySelector('.cXC').classList.toggle('warn', timed && timeLeft <= 10 && phase === 'play');
  }
  function updDuo(bump) {
    if (!duo) return;
    pps.forEach((p, i) => {
      p.classList.toggle('on', i === turn); p.querySelector('.sc').textContent = scores[i];
      if (bump === i) { p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump'); }
    });
  }
  function setBanner(txt, col) { banner = { txt, col, age: 0, life: 1.4 }; }

  function openLevels() {
    const pr = loadProg(), d = loadDuo();
    root.querySelectorAll('.mode button').forEach(b => b.classList.toggle('on', (+b.dataset.m === 2) === d.on));
    const who = root.querySelector('.who'); who.classList.toggle('on', d.on);
    who.querySelectorAll('.pr').forEach(row => {
      const s = +row.dataset.s, cur = s ? d.b : d.a;
      row.innerHTML = `<span class="tag p${s}">${s ? '🔵 الثاني' : '🔴 الأول'}</span>` +
        duoOptions(s).map(o => `<button class="pk p${s}b ${o.n === cur ? 'on' : ''}" data-n="${o.n}">${o.av} ${o.n}</button>`).join('');
      row.querySelectorAll('.pk').forEach(b => b.onclick = () => {
        Sound.tap(); const dd = loadDuo(), nm = b.dataset.n;
        if (s) { if (nm === dd.a) dd.a = dd.b; dd.b = nm; } else { if (nm === dd.b) dd.b = dd.a; dd.a = nm; }
        saveDuo(dd); openLevels();
      });
    });
    const g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      const D = DECKS[L.d === 'mix' ? 'space' : L.d].c;
      const style = L.d === 'mix' ? '--a:#FFF6D8;--b:#FFE08A;--e:#E9B93A' : `--a:${D[0]};--b:${D[1]};--e:${D[2]}`;
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" style="${style}" data-l="${n}" aria-label="المستوى ${n}">
        <span class="n">${n}</span><span class="bd">${L.ph ? '📷' : ''}${L.time ? '⏱️' : ''}${L.peek ? '👀' : ''}</span><span class="e">${deckIcon(L.d)}</span>
        <span class="q">${L.p * 2} ${L.p * 2 <= 10 ? 'بطاقات' : 'بطاقة'}</span><span class="s">${[1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    g.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); duo = loadDuo().on; startLevel(n);
    });
    endOv.classList.remove('on'); lvOv.classList.add('on');
  }
  root.querySelectorAll('.mode button').forEach(b => b.addEventListener('click', () => {
    Sound.tap(); const d = loadDuo(); d.on = b.dataset.m === '2'; saveDuo(d); openLevels();
  }));

  /* ---------- اللعب ---------- */
  function flipSound() { Sound.noise(.07, 1800, 3600, .05, 1.4); Sound.tone(760, .05, 'triangle', .06, 240); }
  function tapCard(c) {
    if (phase !== 'play' || paused) return;
    if (c.matched) { c.pop = 1; if (c.it.photo) { chime(); App.speak(c.it.n); } else { Sound.pop(); App.speak(c.it.n); } return; }
    if (c.tgt === 1) return;
    if (open.length >= 2) {
      if (!pend) return;           // ننتظر نتيجة المحاولة
      resolveMismatch();
    }
    c.tgt = 1; open.push(c); flipSound(); vibrate(8);
    if (hintTimer > 0 && open.length === 2) hintTimer = Math.min(hintTimer, 1.5);
    if (open.length === 2) {
      moves++; updChips();
      const [a, b] = open;
      later(FLIP + .02, () => check(a, b));
    }
  }
  function check(a, b) {
    if (phase !== 'play') return;
    if (a.it.e === b.it.e) {
      open = [];
      for (const c of [a, b]) { c.matched = true; c.mt = 0; c.pop = 1; sparkle(c.x, c.y, DECKS[c.it.d].c[2]); }
      streak++;
      Sound.star(); later(.08, () => Sound.merge(Math.min(10, streak + 2))); vibrate(25); shake = Math.max(shake, 2.5);
      if (a.it.photo) { chime(); App.speak(a.it.n); } else App.speak(a.it.n);
      if (duo) { scores[turn]++; updDuo(turn); }
      const left = cards.some(c => !c.matched);
      if (!left) { phase = 'over'; later(.8, win); }
      else if (duo) setBanner('⭐ دور إضافي لـ' + players[turn] + '!', turn ? '#3E8BFF' : '#FF5C8A');
      else if (streak >= 2) setBanner(['رائع! 🌟', 'ممتاز! ✨', 'مذهل! 💫', 'عبقري! 🧠'][Math.min(3, streak - 2)], '#E0218A');
      if (hintTimer > 0) hintTimer = Math.min(hintTimer, .6);
    } else {
      if (!duo) { mistakes++; updChips(); }
      streak = 0;
      a.wob = b.wob = 1;
      Sound.tone(330, .16, 'sine', .07, -60); Sound.tone(262, .22, 'sine', .06, -40, .1); vibrate(15);
      pend = { a, b, ev: later(.8, resolveMismatch) };
    }
  }
  function resolveMismatch() {
    if (!pend) return;
    cancel(pend.ev);
    pend.a.tgt = 0; pend.b.tgt = 0; pend = null; open = [];
    Sound.noise(.06, 1200, 600, .04, 1.4);
    if (duo && phase === 'play') { turn ^= 1; updDuo(); setBanner(turnText(), turn ? '#3E8BFF' : '#FF5C8A'); }
  }
  function starsFor(p, m) { return m <= p ? 3 : m <= p * 2 ? 2 : 1; }
  const isGirl = n => /^(أثير|بشرى|ريلا)$/.test(n) || App.PROFILES.some(p => p.name === n && p.theme === 'girls');
  function win() {
    confetti(); Sound.win(); vibrate(30);
    if (def.p >= 12) App.achieve('mem_big');
    if (duo) {
      const [s0, s1] = scores, w = s0 === s1 ? -1 : s0 > s1 ? 0 : 1;
      later(.9, () => {
        if (App.current !== ID) return;
        endP.innerHTML = `<h3>${w < 0 ? 'تعادل! 🤝' : '🏆 فاز ' + players[w] + '!'}</h3>
          <div class="res">${[0, 1].map(i => `<div class="${i === w ? 'win' : ''}">${avOf(players[i], i)} ${players[i]}<b>${scores[i]}</b></div>`).join('')}</div>
          <p>${w < 0 ? 'ذاكرتكما قوية جدًا! 💪' : 'مباراة رائعة! 🎉'}</p>
          <button class="btn" data-a="again">🔄 مباراة جديدة</button><br>
          ${lvl < loadProg().unlocked ? '<button class="btn alt" data-a="next">التالي ▶️</button>' : ''}<button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>`;
        bindEnd(); endOv.classList.add('on');
        App.speak(w < 0 ? 'تعادل' : (isGirl(players[w]) ? 'فازت ' : 'فاز ') + players[w]);
        App.achieve('mem_first');
      });
      return;
    }
    const pr = loadProg();
    const stars = starsFor(def.p, mistakes), prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('memoryProg', pr);
    later(.9, () => {
      if (App.current !== ID) return;
      const tUsed = def.time ? Math.round(def.time - timeLeft) : 0;
      endP.innerHTML = `<h3>${App.g('أحسنتِ!', 'أحسنت!')} 🎉</h3>
        <div class="stars3">${[1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('')}</div>
        <div class="res"><div>المحاولات<b>${moves}</b></div><div>الأخطاء<b>${mistakes}</b></div>${def.time ? `<div>الوقت<b>${tUsed}ث</b></div>` : ''}</div>
        <p>${mistakes <= 1 && def.p >= 4 ? 'ذاكرة حديدية! 🧠' : stars === 3 ? 'ذاكرة رائعة! 🌟' : App.g('حاولي', 'حاول') + ' بأخطاء أقل لتحصل' + App.g('ي', '') + ' على 3 نجوم'}</p>
        ${lvl < LEVELS.length ? '<button class="btn" data-a="next">التالي ▶️</button><br>' : '<p>🏆 ' + App.g('أنهيتِ', 'أنهيتَ') + ' كل المستويات!</p>'}
        <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>`;
      bindEnd(); endOv.classList.add('on');
      App.speak(App.g('أحسنتِ!', 'أحسنت!'));
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('mem_first');
      if (mistakes <= 1 && def.p >= 4) App.achieve('mem_perfect');
    });
  }
  function timeUp() {
    phase = 'over'; timeLeft = 0; updChips();
    if (pend) { cancel(pend.ev); pend = null; }
    open = []; Sound.lose(); vibrate(40); shake = 6;
    cards.filter(c => !c.matched).forEach((c, i) => later(.2 + i * .04, () => { c.tgt = 1; }));
    later(1.4, () => {
      if (App.current !== ID) return;
      const left = cards.filter(c => !c.matched).length / 2;
      endP.innerHTML = `<h3>⏰ انتهى الوقت!</h3><div class="big" style="font-size:54px">🙈</div>
        <p>بقي ${left} ${left === 1 ? 'زوج' : left === 2 ? 'زوجان' : left <= 10 ? 'أزواج' : 'زوجًا'} فقط! ${App.g('حاولي', 'حاول')} مرة أخرى 💪</p>
        <button class="btn" data-a="again">🔄 إعادة</button><br>
        <button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>`;
      bindEnd(); endOv.classList.add('on');
    });
  }
  function bindEnd() { endP.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a))); }
  function act(a) {
    Sound.tap();
    if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
    else if (a === 'close') { lvOv.classList.remove('on'); if (duo !== loadDuo().on) { duo = loadDuo().on; startLevel(lvl); } else if (phase === 'over' && endP.innerHTML) endOv.classList.add('on'); }
  }
  root.querySelector('[data-a="close"]').addEventListener('click', () => act('close'));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });

  /* ---------- الجسيمات ---------- */
  function sparkle(x, y, col) {
    for (let i = 0; i < 16; i++) {
      const a = rand(0, TAU), v = rand(70, 230);
      parts.push({ t: i % 3 ? 'star' : 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 70, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .95), age: 0, s: rand(4, 9), c: i % 2 ? '#FFE26B' : col });
    }
    rings.push({ x, y, age: 0, life: .5 });
  }
  function confetti() {
    for (let i = 0; i < 150; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 260), rot: rand(0, TAU), vr: rand(-8, 8),
      life: rand(2.5, 4), age: 0, s: rand(6, 11), c: ['#FF5C8A', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF9F43'][i % 6] });
  }

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function hit(x, y) { return cards.find(c => Math.abs(x - c.x) <= cw / 2 + gap * .4 && Math.abs(y - c.y) <= ch / 2 + gap * .4); }
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused || lvOv.classList.contains('on') || endOv.classList.contains('on')) return;
    const m = pos(e), c = hit(m.x, m.y);
    if (c) { kf = -1; tapCard(c); }
  });
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (endOv.classList.contains('on')) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const b = endP.querySelector('.btn:not(.alt)'); if (b) act(b.dataset.a); }
      return;
    }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? act('close') : openLevels(); return; }
    if (lvOv.classList.contains('on') || !cards.length) return;
    const mv = { ArrowLeft: [1, 0], ArrowRight: [-1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (mv) {
      e.preventDefault();
      if (kf < 0) { kf = 0; return; }
      const c = cards[kf], col = clamp(c.col + mv[0], 0, cols - 1), row = clamp(c.row + mv[1], 0, rows - 1);
      kf = row * cols + col; Sound.tone(600, .03, 'sine', .04);
    } else if ((e.key === 'Enter' || e.key === ' ') && kf >= 0) { e.preventDefault(); tapCard(cards[kf]); }
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    for (let i = 0; i < events.length; i++) { const ev = events[i]; ev.t -= dt; if (ev.t <= 0) { events.splice(i--, 1); ev.fn(); } }
    let dealing = false;
    for (const c of cards) {
      if (c.deal < 1) { c.deal = Math.min(1, c.deal + dt / .5); dealing = true; }
      const sp = dt / FLIP;
      if (c.f < c.tgt) c.f = Math.min(c.tgt, c.f + sp); else if (c.f > c.tgt) c.f = Math.max(c.tgt, c.f - sp);
      if (c.matched) c.mt += dt;
      c.wob = Math.max(0, c.wob - dt * 1.6);
      c.pop = Math.max(0, c.pop - dt * 2.4);
    }
    if (phase === 'play' && timed) {
      timeLeft -= dt;
      const s = Math.ceil(timeLeft);
      if (s !== lastTick) { lastTick = s; updChips(); if (s <= 5 && s > 0) Sound.tone(1100, .05, 'square', .04); }
      if (timeLeft <= 0) timeUp();
    }
    if (hintTimer > 0) { hintTimer -= dt; if (hintTimer <= 0) hintEl.style.opacity = 0; }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.t === 'conf') { q.vy = Math.min(q.vy + 120 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; }
      else { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 300 * dt; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    if (banner) { banner.age += dt; if (banner.age > banner.life) banner = null; }
    shake = Math.max(0, shake - dt * 16);
    return dealing;
  }

  /* ---------- الرسم ---------- */
  /* قلب ثلاثي الأبعاد: تصغير أفقي + ظل متدرّج على الجانب البعيد + لمعة على القريب */
  function drawFlip(img, a2, lift) {
    const co = Math.max(.02, Math.abs(Math.cos(a2))), far = Math.sin(a2) > 0;
    ctx.save(); ctx.scale(co, 1);
    ctx.drawImage(img, -cw / 2, -ch / 2, cw, ch);
    ctx.globalAlpha = Math.min(1, lift * 1.1); ctx.drawImage(far ? shadeL : shadeR, -cw / 2, -ch / 2, cw, ch);
    ctx.globalAlpha = lift * .5; ctx.drawImage(far ? shineR : shineL, -cw / 2, -ch / 2, cw, ch);
    ctx.restore();
  }
  function drawCard(c, idx) {
    const e = ease.inOut(c.f), ang = e * Math.PI, face = ang > Math.PI / 2, lift = Math.sin(ang);
    let x = c.x, y = c.y, rot = 0, sc = 1;
    if (c.deal < 1) {
      if (c.deal <= 0) return;
      const t = ease.outBack(c.deal), sx = W / 2, sy = H + ch;
      x = sx + (c.x - sx) * t; y = sy + (c.y - sy) * t; rot = c.dr * (1 - c.deal); sc = .6 + .4 * Math.min(1, c.deal * 1.4);
    }
    let fl = 0;
    if (c.matched) { fl = ch * .045 * ease.outBack(Math.min(1, c.mt / .45)) + Math.sin(T * 2.2 + c.ph) * 1.2; y -= fl; }
    if (c.wob) rot += Math.sin(T * 40) * .08 * c.wob;
    sc *= 1 + lift * .08 + Math.sin((1 - c.pop) * Math.PI) * c.pop * .14;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
    if (c.matched) {
      const ga = Math.min(1, c.mt / .3) * (.55 + .3 * Math.sin(T * 3 + c.ph));
      ctx.globalAlpha = ga; const gw = glowImg.width / dpr, gh = glowImg.height / dpr;
      ctx.drawImage(glowImg, -gw / 2, -gh / 2, gw, gh); ctx.globalAlpha = 1;
    }
    const cs = Math.max(.15, Math.abs(Math.cos(ang))), sw = shadowImg.width / dpr, sh = shadowImg.height / dpr, so = 3 + lift * 10 + fl * 1.2;
    ctx.globalAlpha = .55 - lift * .15; ctx.drawImage(shadowImg, -sw * cs / 2 + so * .3, -sh / 2 + so, sw * cs, sh); ctx.globalAlpha = 1;
    const img = face ? faces[c.it.e] : backImg;
    if (lift < .01) ctx.drawImage(img, -cw / 2, -ch / 2, cw, ch);
    else drawFlip(img, face ? ang - Math.PI : ang, lift);
    if (c.matched && lift < .3 && c.it.n) {
      // شريط الاسم
      const fs = clamp(cw * .13, 10, 17), D = DECKS[c.it.d].c;
      ctx.font = `800 ${fs}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const tw = Math.min(cw * .92, ctx.measureText(c.it.n).width + fs * 1.1), ty = ch / 2 - fs * 1.05;
      ctx.globalAlpha = Math.min(1, c.mt / .4);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(-tw / 2, ty - fs * .62, tw, fs * 1.24, fs * .62); ctx.fill();
      ctx.strokeStyle = D[2]; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = D[3]; ctx.fillText(c.it.n, 0, ty + 1, cw * .86);
      ctx.globalAlpha = 1;
    }
    if (idx === kf) {
      ctx.strokeStyle = '#FFF27A'; ctx.lineWidth = 4; ctx.shadowColor = '#FFE45C'; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.roundRect(-cw / 2 - 4, -ch / 2 - 4, cw + 8, ch + 8, cw * .16); ctx.stroke(); ctx.shadowBlur = 0;
    }
    ctx.restore();
  }
  function render() {
    ctx.save();
    ctx.fillStyle = '#9C86F0'; ctx.fillRect(0, 0, W, H);
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    // البطاقات الساكنة أولًا ثم المتحركة فوقها
    cards.forEach((c, i) => { if (!(c.f > 0 && c.f < 1) && !c.matched) drawCard(c, i); });
    cards.forEach((c, i) => { if (c.matched && !(c.f > 0 && c.f < 1)) drawCard(c, i); });
    cards.forEach((c, i) => { if (c.f > 0 && c.f < 1) drawCard(c, i); });
    for (const r of rings) {
      const t = r.age / r.life;
      ctx.save(); ctx.globalAlpha = 1 - t; ctx.strokeStyle = '#FFF4B0'; ctx.lineWidth = 6 * (1 - t) + 1;
      ctx.beginPath(); ctx.ellipse(r.x, r.y, cw * (.5 + t * .5), ch * (.5 + t * .4), 0, 0, TAU); ctx.stroke(); ctx.restore();
    }
    for (const q of parts) {
      const a = 1 - q.age / q.life;
      ctx.save(); ctx.globalAlpha = q.t === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillStyle = q.c;
      if (q.t === 'star') { starPath(ctx, q.s * (.6 + a * .5)); ctx.fill(); }
      else if (q.t === 'dot') { ctx.beginPath(); ctx.arc(0, 0, q.s * .45 * a + 1, 0, TAU); ctx.fill(); }
      else { ctx.scale(1, Math.cos(q.age * 9 + q.rot)); ctx.fillRect(-q.s / 2, -q.s * .3, q.s, q.s * .6); }
      ctx.restore();
    }
    if (banner) drawBanner();
    ctx.restore();
  }
  function drawBanner() {
    const b = banner, t = b.age / b.life;
    const sIn = ease.outBack(Math.min(1, b.age / .25)), a = t > .75 ? 1 - (t - .75) / .25 : 1;
    const fs = clamp(W * .06, 20, 32);
    ctx.save(); ctx.translate(W / 2, mat.y + mat.h / 2 - (t > .75 ? (t - .75) * 80 : 0)); ctx.scale(sIn, sIn); ctx.globalAlpha = a;
    ctx.font = `900 ${fs}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const tw = Math.min(W * .9, ctx.measureText(b.txt).width + fs * 1.6), th = fs * 1.7;
    ctx.shadowColor = 'rgba(40,10,80,.4)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(-tw / 2, -th / 2, tw, th, th / 2); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.lineWidth = 4; ctx.strokeStyle = b.col; ctx.stroke();
    ctx.fillStyle = b.col; ctx.fillText(b.txt, 0, 2, W * .84);
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
    if (App.current !== ID || !cards.length) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#8C78EE'); g.addColorStop(1, '#FFB4D8');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    for (let i = 0; i < 7; i++) { c.save(); c.translate(s * [.15, .85, .1, .9, .5, .25, .78][i], s * [.18, .2, .7, .62, .1, .9, .9][i]); c.fillStyle = 'rgba(255,240,180,.7)'; starPath(c, s * .025, .4); c.fill(); c.restore(); }
    const w = s * .36, h = w * ASP;
    const savedDpr = dpr; dpr = 2;
    const back = bakeBack(w, h);
    dpr = savedDpr;
    const draw = (img, x, y, r) => {
      c.save(); c.translate(x, y); c.rotate(r);
      c.save(); c.shadowColor = 'rgba(40,10,80,.45)'; c.shadowBlur = 8; c.shadowOffsetY = 4; c.fillStyle = '#000'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, w * .13); c.fill(); c.restore();
      if (img) c.drawImage(img, -w / 2, -h / 2, w, h); else faceCard(c, w, h);
      c.restore();
    };
    draw(back, s * .3, s * .56, -.42);
    draw(back, s * .7, s * .56, .42);
    draw(null, s * .5, s * .5, 0);
  }
  /* بطاقة بوجه لطيف للأيقونة */
  function faceCard(c, w, h) {
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, w * .13); c.fill();
    const b = w * .06;
    let g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#FFF1F8'); g.addColorStop(1, '#FFCFE4');
    c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2 + b, -h / 2 + b, w - b * 2, h - b * 2, w * .09); c.fill();
    c.setLineDash([w * .05, w * .035]); c.strokeStyle = '#EE89B8'; c.lineWidth = 1.2;
    c.beginPath(); c.roundRect(-w / 2 + b * 1.6, -h / 2 + b * 1.6, w - b * 3.2, h - b * 3.2, w * .07); c.stroke(); c.setLineDash([]);
    const r = w * .3;
    g = c.createRadialGradient(-r * .3, -r * .35, r * .1, 0, 0, r); g.addColorStop(0, '#FFF6B8'); g.addColorStop(.6, '#FFD84A'); g.addColorStop(1, '#F2A81E');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
    c.fillStyle = '#4A2A1A';
    c.beginPath(); c.ellipse(-r * .36, -r * .12, r * .11, r * .15, 0, 0, TAU); c.fill();
    c.beginPath(); c.ellipse(r * .36, -r * .12, r * .11, r * .15, 0, 0, TAU); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(-r * .32, -r * .18, r * .045, 0, TAU); c.arc(r * .4, -r * .18, r * .045, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,110,150,.55)'; c.beginPath(); c.ellipse(-r * .6, r * .2, r * .14, r * .09, 0, 0, TAU); c.ellipse(r * .6, r * .2, r * .14, r * .09, 0, 0, TAU); c.fill();
    c.strokeStyle = '#4A2A1A'; c.lineWidth = r * .09; c.lineCap = 'round'; c.beginPath(); c.arc(0, r * .12, r * .3, .25, Math.PI - .25); c.stroke();
    c.save(); c.translate(w * .27, -h * .32); c.fillStyle = '#FF5C8A'; heartPath(c, w * .07); c.fill(); c.restore();
    c.save(); c.translate(-w * .27, h * .32); c.fillStyle = '#FFC531'; starPath(c, w * .07); c.fill(); c.restore();
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'بطاقات الذاكرة', icon2: '🃏', isNew: true, music: 'memory',
    desc: () => App.g('اقلبي البطاقات وابحثي عن الأزواج المتشابهة', 'اقلب البطاقات وابحث عن الأزواج المتشابهة'),
    help: () => [
      '👆 ' + App.g('اقلبي', 'اقلب') + ' بطاقتين في كل مرة بلمسة واحدة',
      '🧠 إذا تشابهت الصورتان تبقيان مكشوفتين، وإلا تنقلبان من جديد: ' + App.g('تذكّري', 'تذكّر') + ' مكانهما!',
      '⭐ أخطاء أقل = نجوم أكثر. 👀 بعض المستويات تكشف البطاقات قليلًا في البداية، و⏱️ بعضها له وقت محدد',
      '👥 من زر المستويات 🔢 ' + App.g('اختاري', 'اختر') + ' «لاعبان» للعب بالتناوب: الزوج الصحيح يعطي دورًا إضافيًا!',
      '🖼️ ' + App.g('ابحثي', 'ابحث') + ' عن صور العائلة الحقيقية في مستويات 📷، و🔊 ' + App.g('المسي', 'المس') + ' أي بطاقة مكشوفة ' + App.g('لتسمعي', 'لتسمع') + ' اسمها'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 المستوى ${Math.max(...ks)} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      duo = loadDuo().on;
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, LEVELS.length));
      render(); startLoop();
    },
    leave() { stopLoop(); events = []; pend = null; lvOv.classList.remove('on'); endOv.classList.remove('on'); },
    pause() { paused = true; },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _setTime(t) { timeLeft = t; },
    _state() { return { lvl, phase, moves, mistakes, duo, turn, scores, timeLeft, cw, ch, cols, rows, cards: cards.map(c => ({ e: c.it.e, n: c.it.n, x: c.x, y: c.y, m: c.matched, f: c.f })) }; }
  });
})();
