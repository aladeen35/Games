/* =====================================================================
   قطار الكلمات — اسمع الكلمة، ثم اسحب الحروف إلى عربات القطار بالترتيب
   ثنائي اللغة: عربي / English (يُحفظ لكل لاعب)
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'wordtrain';
  const TAU = Math.PI * 2;
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';

  /* ---------- الكلمات ---------- */
  // [الكلمة، الصورة]
  const AR = [
    [['يد', '✋'], ['دب', '🐻'], ['فم', '👄'], ['قط', '🐈'], ['رز', '🍚'], ['جد', '👴'], ['سن', '🦷'], ['أم', '👩'], ['أب', '👨']],
    [['أسد', '🦁'], ['بيت', '🏠'], ['بوق', '🎺'], ['قرد', '🐒'], ['فيل', '🐘'], ['قلب', '❤️'], ['كلب', '🐕'], ['نمر', '🐯'], ['حوت', '🐋'],
      ['ثلج', '❄️'], ['جمل', '🐫'], ['خبز', '🍞'], ['ذرة', '🌽'], ['قمر', '🌙'], ['شمس', '☀️'], ['عسل', '🍯'], ['عنب', '🍇'], ['قطة', '🐱'],
      ['بطة', '🦆'], ['موز', '🍌'], ['ملح', '🧂'], ['مطر', '🌧️'], ['كرة', '⚽'], ['طبل', '🥁'], ['برق', '⚡'], ['صقر', '🦅'], ['ظرف', '✉️'], ['عشب', '🌿']],
    [['أرنب', '🐰'], ['ثعلب', '🦊'], ['بطيخ', '🍉'], ['قارب', '⛵'], ['ضفدع', '🐸'], ['هدية', '🎁'], ['نخلة', '🌴'], ['نحلة', '🐝'], ['خروف', '🐑'],
      ['حصان', '🐴'], ['بومة', '🦉'], ['قميص', '👕'], ['وردة', '🌹'], ['صدفة', '🐚'], ['غيمة', '☁️'], ['قطار', '🚂'], ['نجمة', '⭐'], ['زهرة', '🌸'],
      ['سمكة', '🐟'], ['جزرة', '🥕'], ['بقرة', '🐄'], ['كعكة', '🎂'], ['بيضة', '🥚'], ['حليب', '🥛'], ['نملة', '🐜'], ['يرقة', '🐛'], ['عظمة', '🦴']]
  ];
  const EN3 = [['cat', '🐱'], ['dog', '🐶'], ['sun', '☀️'], ['hat', '🎩'], ['pig', '🐷'], ['egg', '🥚'], ['bus', '🚌'], ['cow', '🐮'], ['fox', '🦊'],
    ['bee', '🐝'], ['owl', '🦉'], ['ant', '🐜'], ['car', '🚗'], ['bed', '🛏️'], ['cup', '☕'], ['box', '📦'], ['key', '🔑'], ['hen', '🐔'], ['van', '🚐'],
    ['bat', '🦇'], ['pen', '🖊️'], ['ear', '👂']];
  const EN = [
    EN3,
    EN3,
    [['fish', '🐟'], ['frog', '🐸'], ['duck', '🦆'], ['bear', '🐻'], ['lion', '🦁'], ['kite', '🪁'], ['moon', '🌙'], ['star', '⭐'], ['cake', '🎂'],
      ['ball', '⚽'], ['boat', '⛵'], ['tree', '🌳'], ['milk', '🥛'], ['corn', '🌽'], ['shoe', '👟'], ['sock', '🧦'], ['drum', '🥁'], ['bird', '🐦'],
      ['crab', '🦀'], ['goat', '🐐'], ['rose', '🌹'], ['ship', '🚢'], ['hand', '✋'], ['door', '🚪'], ['bell', '🔔'], ['book', '📖']]
  ];
  // المستويات: الفئة (0 قصيرة، 1 ثلاثة، 2 أربعة)، عدد الكلمات، عدد الحروف الزائدة
  const LV = [
    { t: 0, n: 4, x: 1 }, { t: 0, n: 5, x: 2 },
    { t: 1, n: 4, x: 1 }, { t: 1, n: 5, x: 2 }, { t: 1, n: 5, x: 3 },
    { t: 2, n: 4, x: 1 }, { t: 2, n: 5, x: 2 }, { t: 2, n: 5, x: 3 }
  ];
  const NL = LV.length;
  const TIER_T = ['كلمات قصيرة', 'ثلاثة حروف', 'أربعة حروف'];
  const TIER_I = ['🚂', '🚃', '🚄'];

  const AR_POOL = 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي'.split('');
  const EN_POOL = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const LNAME = { 'ا': 'ألف', 'أ': 'ألف', 'إ': 'ألف', 'آ': 'ألف', 'ب': 'باء', 'ت': 'تاء', 'ث': 'ثاء', 'ج': 'جيم', 'ح': 'حاء', 'خ': 'خاء', 'د': 'دال', 'ذ': 'ذال',
    'ر': 'راء', 'ز': 'زاي', 'س': 'سين', 'ش': 'شين', 'ص': 'صاد', 'ض': 'ضاد', 'ط': 'طاء', 'ظ': 'ظاء', 'ع': 'عين', 'غ': 'غين', 'ف': 'فاء', 'ق': 'قاف',
    'ك': 'كاف', 'ل': 'لام', 'م': 'ميم', 'ن': 'نون', 'ه': 'هاء', 'و': 'واو', 'ي': 'ياء', 'ة': 'تاء مربوطة' };
  // حروف لا تتصل بما بعدها
  const NOJOIN = new Set(['ا', 'أ', 'إ', 'آ', 'د', 'ذ', 'ر', 'ز', 'و', 'ؤ', 'ة', 'ء', 'ى']);
  // أشكال قد تلتبس على الطفل: لا نضعها حروفًا زائدة مع بعضها
  const SIMILAR = ['بتث', 'جحخ', 'دذ', 'رز', 'سش', 'صض', 'طظ', 'عغ', 'فق', 'ةته', 'اأإآ'];

  const BCOL = [['#FF8A3D', '#D9601A'], ['#3D8BFF', '#2163C9'], ['#A65CF0', '#7836C4'], ['#24B47E', '#138A5E'],
    ['#FF5C7A', '#D13355'], ['#16B5C9', '#0B8696'], ['#F5B700', '#C98D00']];
  const WCOL = [['#FF6B5B', '#D2453A'], ['#3E9BFF', '#2470D1'], ['#FFC23D', '#DB9600'], ['#4CC76A', '#2E9A49'], ['#B26BFF', '#8442D6']];

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const easeInCubic = t => t * t * t;
  const outBack = t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  function mix(a, b, t) { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; }
  const AD = '٠١٢٣٤٥٦٧٨٩';
  const numL = (n, lg) => lg === 'ar' ? String(n).replace(/\d/g, d => AD[d]) : String(n);
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  const blankProg = () => ({ unlocked: 1, stars: {} });
  function loadProg() {
    const p = store.get('wordtrainProg', null) || {};
    const fix = q => ({ unlocked: clamp((q && q.unlocked) || 1, 1, NL), stars: (q && q.stars) || {} });
    return { ar: fix(p.ar || blankProg()), en: fix(p.en || blankProg()) };
  }
  const lettersOf = w => Array.from(w);
  const formOf = (ls, i) => {
    const jp = i > 0 && !NOJOIN.has(ls[i - 1]), jn = i < ls.length - 1 && !NOJOIN.has(ls[i]);
    return (jp ? 'ـ' : '') + ls[i] + (jn ? 'ـ' : '');
  };

  /* ---------- صور مخزّنة ---------- */
  let dpr = 1;
  const ecache = new Map(), bcache = new Map();
  function emojiImg(e, size) {
    size = Math.max(8, Math.round(size / 2) * 2);
    const key = e + '|' + size + '|' + dpr;
    let c = ecache.get(key); if (c) return c;
    if (ecache.size > 200) ecache.clear();
    const P = Math.ceil(size * 1.3 * dpr); c = mk(P, P); const x = c.getContext('2d');
    x.direction = 'ltr';
    let fs = size * dpr; x.font = `${fs}px ${EMOJI_FONT}`;
    let m = x.measureText(e);
    const w = (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || m.width), h = (m.actualBoundingBoxAscent || fs * .8) + (m.actualBoundingBoxDescent || fs * .2);
    fs *= Math.min(1.25, size * dpr / Math.max(w, h, 1)); x.font = `${fs}px ${EMOJI_FONT}`; m = x.measureText(e);
    const L = m.actualBoundingBoxLeft || m.width / 2, R = m.actualBoundingBoxRight || m.width / 2;
    const A = m.actualBoundingBoxAscent || fs * .8, D = m.actualBoundingBoxDescent || fs * .2;
    x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.fillText(e, P / 2 + (L - R) / 2, P / 2 + (A - D) / 2);
    c.sz = P / dpr; ecache.set(key, c);
    return c;
  }
  function drawEmoji(c, e, x, y, size) { const im = emojiImg(e, size); c.drawImage(im, x - im.sz / 2, y - im.sz / 2, im.sz, im.sz); }

  /* بطاقة حرف بيضاء سميكة بإطار ملوّن (شكل لعبة ثلاثية الأبعاد) */
  function blockImg(txt, ci, s, isAr, state) {
    s = Math.max(16, Math.round(s));
    const key = txt + '|' + ci + '|' + s + '|' + dpr + '|' + (state || '');
    let im = bcache.get(key); if (im) return im;
    if (bcache.size > 300) bcache.clear();
    const d = Math.round(s * .1), pad = Math.ceil(s * .16), cw = s + pad * 2, ch = s + d + pad * 2;
    const c = mk(cw * dpr, ch * dpr), x = c.getContext('2d'); x.scale(dpr, dpr);
    const [c1, c2] = state === 'gray' ? ['#B9AFC9', '#8E84A0'] : BCOL[ci % BCOL.length];
    const bx = pad, by = pad, r = s * .24, bw = s * .085;
    // الحافة السفلية (العمق)
    x.save(); x.shadowColor = 'rgba(40,20,60,.35)'; x.shadowBlur = s * .12; x.shadowOffsetY = s * .07;
    x.fillStyle = c2; x.beginPath(); x.roundRect(bx, by + d, s, s, r); x.fill(); x.restore();
    // الإطار الملوّن
    let g = x.createLinearGradient(0, by, 0, by + s); g.addColorStop(0, mix(c1, '#FFFFFF', .3)); g.addColorStop(1, c1);
    x.fillStyle = g; x.beginPath(); x.roundRect(bx, by, s, s, r); x.fill();
    // الوجه الأبيض
    g = x.createLinearGradient(0, by + bw, 0, by + s - bw); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.7, '#FFFFFF'); g.addColorStop(1, mix(c1, '#FFFFFF', .82));
    x.fillStyle = g; x.beginPath(); x.roundRect(bx + bw, by + bw, s - bw * 2, s - bw * 2, r * .7); x.fill();
    // ظل داخلي ولمعة
    x.save(); x.beginPath(); x.roundRect(bx + bw, by + bw, s - bw * 2, s - bw * 2, r * .7); x.clip();
    x.strokeStyle = 'rgba(0,0,0,.08)'; x.lineWidth = s * .05; x.beginPath(); x.roundRect(bx + bw, by + bw + s * .025, s - bw * 2, s - bw * 2, r * .7); x.stroke();
    g = x.createRadialGradient(bx + s * .3, by + s * .2, 0, bx + s * .3, by + s * .2, s * .5); g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(bx, by, s, s * .5);
    x.restore();
    x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = Math.max(1, s * .022);
    x.beginPath(); x.roundRect(bx + s * .02, by + s * .02, s - s * .04, s - s * .04, r * .95); x.stroke();
    // الحرف
    let fs = s * (isAr ? .66 : .7);
    x.font = `900 ${fs}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.direction = isAr ? 'rtl' : 'ltr';
    let m = x.measureText(txt);
    const maxW = s * .8; const tw = (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || m.width);
    if (tw > maxW) { fs *= maxW / tw; x.font = `900 ${fs}px ${FONT}`; m = x.measureText(txt); }
    const A = m.actualBoundingBoxAscent || fs * .7, D = m.actualBoundingBoxDescent || 0;
    const Lb = m.actualBoundingBoxLeft || m.width / 2, Rb = m.actualBoundingBoxRight || m.width / 2;
    const tx = bx + s / 2 + (Lb - Rb) / 2, ty = by + s * .5 + (A - D) / 2;
    const ink = state === 'gray' ? '#6D6380' : mix(c2, '#2A1240', .45);
    x.lineJoin = 'round'; x.lineWidth = s * .05; x.strokeStyle = '#fff'; x.strokeText(txt, tx, ty + s * .02);
    x.fillStyle = mix(c1, '#FFFFFF', .55); x.fillText(txt, tx, ty + s * .025);
    x.fillStyle = ink; x.fillText(txt, tx, ty);
    im = { c, w: cw, h: ch, pad };
    bcache.set(key, im);
    return im;
  }
  function drawBlock(c, txt, ci, x, y, s, isAr, state) {
    const im = blockImg(txt, ci, s, isAr, state), k = s / Math.max(16, Math.round(s));
    c.drawImage(im.c, x - (s / 2 + im.pad * k), y - (s / 2 + im.pad * k), im.w * k, im.h * k);
  }
  // سحابة دخان ناعمة
  let puffImg = null;
  function getPuff() {
    if (puffImg) return puffImg;
    const S = 96, c = mk(S, S), x = c.getContext('2d');
    const blob = (cx, cy, r, a) => { const g = x.createRadialGradient(cx - r * .3, cy - r * .35, r * .1, cx, cy, r); g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(.75, `rgba(240,242,250,${a * .95})`); g.addColorStop(1, 'rgba(220,226,240,0)'); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill(); };
    blob(48, 52, 38, 1); blob(34, 44, 22, .9); blob(62, 40, 24, .9);
    puffImg = c; return c;
  }

  /* ---------- الواجهة ---------- */
  App.css(`
  #wordtrain{background:#BFE6FF;overflow:hidden}
  #wordtrain canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #wordtrain .ib{color:#D9601A}
  #wordtrain .lang{display:flex;background:rgba(255,255,255,.95);border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;
    box-shadow:0 4px 0 rgba(30,70,140,.18),0 7px 12px rgba(30,70,140,.16)}
  #wordtrain .lang button{padding:6px 14px;border-radius:99px;font-weight:900;font-size:17px;background:transparent;color:#2D5C9E;line-height:1.2;transition:transform .14s var(--press)}
  #wordtrain .lang button.on{background:linear-gradient(#FFA25E,#FF7A2E 60%,#E8590C);color:#fff;box-shadow:0 3px 0 #B8460A,inset 0 2px 0 rgba(255,255,255,.4);text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #wordtrain .lang button:active{transform:scale(.92)}
  #wordtrain .prog{position:absolute;z-index:4;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 58px);
    width:min(calc(100% - 32px),420px);height:16px;display:flex;gap:5px;padding:3px;border-radius:99px;background:rgba(255,255,255,.75);
    box-shadow:0 3px 0 rgba(30,70,140,.15),inset 0 1px 2px rgba(0,0,0,.08)}
  #wordtrain .prog i{flex:1;border-radius:99px;background:#DCE7F5;box-shadow:inset 0 2px 2px rgba(0,0,0,.08);transition:background .3s}
  #wordtrain .prog i.on{background:linear-gradient(#8CE58F,#3DBE52);box-shadow:inset 0 2px 0 rgba(255,255,255,.5),0 1px 0 #2A9440;animation:wtPop .4s}
  #wordtrain .prog i.cur{background:linear-gradient(#FFE07A,#FFC234);box-shadow:inset 0 2px 0 rgba(255,255,255,.6)}
  @keyframes wtPop{40%{transform:scaleY(1.6)}}
  #wordtrain .spk{position:absolute;z-index:4;width:64px;height:64px;border-radius:50%;font-size:28px;display:grid;place-items:center;
    background:radial-gradient(circle at 35% 30%,#FFF3A8 0,#FFD43B 40%,#F5A900 100%);border:4px solid #FFF6CC;color:#7A3E00;
    box-shadow:0 5px 0 #C98500,0 10px 16px rgba(150,90,0,.35);transition:transform .14s var(--press)}
  #wordtrain .spk:active{transform:translateY(4px) scale(1.06,.9);box-shadow:0 1px 0 #C98500}
  #wordtrain .spk.pulse{animation:wtPulse 1.4s ease-in-out infinite}
  @keyframes wtPulse{50%{transform:scale(1.1)}}
  #wordtrain .lvbtn .cnt{background:#E8590C}
  #wordtrain .panel{border-color:#FFD2A8;box-shadow:0 10px 0 #F08A3E,0 24px 44px rgba(60,30,0,.32),inset 0 0 0 3px #fff;color:#5A2A08;background:linear-gradient(180deg,#fff 0%,#fff 70%,#FFF4EA 100%)}
  #wordtrain .panel h3{color:#E8590C;text-shadow:0 3px 0 #FFE0C4}
  #wordtrain .btn{background:linear-gradient(180deg,#FFA25E 0%,#FF7A2E 55%,#E8590C 100%);box-shadow:0 5px 0 #B8460A,0 9px 14px rgba(200,80,10,.3);text-shadow:0 2px 0 rgba(120,40,0,.25)}
  #wordtrain .btn:active{box-shadow:0 1px 0 #B8460A}
  #wordtrain .btn.alt{background:linear-gradient(180deg,#fff,#FFF4EA);color:#D9601A;box-shadow:0 5px 0 #FFD2A8,0 8px 12px rgba(200,80,10,.14);border-color:#FFE3C9;text-shadow:none}
  #wordtrain .overlay{background:radial-gradient(circle at 50% 45%,rgba(20,60,120,.25),rgba(10,30,70,.55))}
  #wordtrain .lvp{width:min(94vw,440px);max-height:calc(100% - 20px);overflow-y:auto;touch-action:pan-y}
  #wordtrain .lvp .lang{display:inline-flex;margin:2px auto 10px;box-shadow:0 3px 0 #FFD2A8;border-color:#FFE3C9;background:#FFF4EA}
  #wordtrain .tier{display:flex;align-items:center;gap:8px;margin:6px 2px 6px;font-weight:900;font-size:16px;color:#B8460A}
  #wordtrain .tier::after{content:'';flex:1;height:5px;border-radius:5px;background:repeating-linear-gradient(90deg,#FFD2A8 0 9px,transparent 9px 15px)}
  #wordtrain .lvg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:6px}
  #wordtrain .lv{position:relative;height:74px;border-radius:22px;font-weight:900;font-size:28px;color:#fff;line-height:1;padding-bottom:12px;
    background:linear-gradient(var(--l),var(--c));border:3px solid #fff;box-shadow:0 5px 0 var(--d),0 9px 14px rgba(0,0,0,.15);text-shadow:0 2px 0 rgba(0,0,0,.2);
    transition:transform .14s var(--press)}
  #wordtrain .lv:active{transform:translateY(3px) scale(1.04,.94)}
  #wordtrain .lv .s{position:absolute;bottom:5px;left:0;right:0;font-size:14px;letter-spacing:-1px;text-shadow:none}
  #wordtrain .lv .s i{font-style:normal}
  #wordtrain .lv .s i.off{filter:grayscale(1);opacity:.35}
  #wordtrain .lv.cur::before{content:'';position:absolute;inset:-8px;border-radius:28px;border:4px solid #FFB067;animation:wtRing 1.2s infinite}
  @keyframes wtRing{0%{transform:scale(.92);opacity:1}100%{transform:scale(1.15);opacity:0}}
  #wordtrain .lv.lock{--c:#CFC6D8;--l:#E6E0EC;--d:#A99DB6;color:#8C8098;text-shadow:none}
  #wordtrain .lv.lock::after{content:'🔒';position:absolute;top:-8px;left:-6px;font-size:18px}
  #wordtrain .case{display:none;margin:2px auto 8px;gap:6px;justify-content:center;align-items:center;font-weight:800;font-size:14px;color:#B8460A}
  #wordtrain .case.on{display:flex}
  #wordtrain .case button{padding:3px 12px;border-radius:99px;font-weight:900;font-size:16px;background:#FFF4EA;color:#B8460A;border:2px solid #FFE3C9;direction:ltr}
  #wordtrain .case button.on{background:linear-gradient(#FFA25E,#E8590C);color:#fff;border-color:#fff;box-shadow:0 3px 0 #B8460A}
  #wordtrain .wW{font-size:44px;font-weight:900;color:#3B2A8A;line-height:1.2;margin:2px 0}
  #wordtrain .wW.en{direction:ltr}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🗺️<span class="cnt">١</span></button>
      <span class="grow"></span>
      <div class="lang top"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="prog"></div>
    <button class="spk" aria-label="أعد سماع الكلمة">🔊</button>
    <div class="overlay" id="wtLv"><div class="panel lvp"><h3>🚂 المستويات</h3>
      <div class="lang"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
      <div class="case"><span>شكل الحروف:</span><button data-c="lower">abc</button><button data-c="upper">ABC</button></div>
      <div class="lvl"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="wtWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again" aria-label="أعد">🔄</button><button class="btn alt" data-a="levels">🗺️ المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const progEl = root.querySelector('.prog'), spk = root.querySelector('.spk');
  const lvOv = root.querySelector('#wtLv'), winOv = root.querySelector('#wtWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, top = 100, safeB = 0;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lang = 'ar', ucase = false, lvl = 1, words = [], wi = 0, mistakes = 0, phase = 'idle', winTimer = 0;
  let train = null, blocks = [], parts = [], drag = null, shake = 0, banner = null, bgC = null, bgKey = '';
  let G = {}; // التخطيط
  let clouds = [], chuffAcc = 0, recent = { ar: [], en: [] };
  const timers = [];
  const later = (ms, f) => { const id = setTimeout(() => { const i = timers.indexOf(id); if (i >= 0) timers.splice(i, 1); if (App.current === ID) f(); }, ms); timers.push(id); };
  const clearTimers = () => { timers.forEach(clearTimeout); timers.length = 0; };

  const isAr = () => lang === 'ar';
  const dir = () => isAr() ? 1 : -1;
  const disp = ch => isAr() ? ch : (ucase ? ch.toUpperCase() : ch);
  const say = t => App.speak(t, lang === 'en' ? 'en' : 'ar');
  const sayLetter = ch => isAr() ? App.speak(LNAME[ch] || ch) : App.speak(ch.toUpperCase(), 'en');
  const praise = () => isAr() ? App.speak(App.g('أحسنتِ!', 'أحسنت!')) : App.speak('Great job!', 'en');

  /* ---------- اختيار الكلمات ---------- */
  function pickWords(L) {
    const pool = (isAr() ? AR : EN)[L.t].slice();
    const rec = recent[lang];
    shuffle(pool);
    pool.sort((a, b) => (rec.includes(a[0]) ? 1 : 0) - (rec.includes(b[0]) ? 1 : 0));
    const out = pool.slice(0, L.n);
    out.forEach(w => { rec.push(w[0]); });
    while (rec.length > 24) rec.shift();
    return out;
  }
  function extrasFor(ls, n) {
    const pool = (isAr() ? AR_POOL : EN_POOL).filter(ch => !ls.includes(ch) && !(isAr() && ls.some(l => SIMILAR.some(s => s.includes(l) && s.includes(ch)))));
    return shuffle(pool).slice(0, n);
  }

  /* ---------- التخطيط ---------- */
  function measureSafe() {
    const p = document.createElement('div'); p.style.cssText = 'position:fixed;bottom:0;height:0;padding-bottom:env(safe-area-inset-bottom);visibility:hidden';
    document.body.appendChild(p); safeB = p.offsetHeight || 0; p.remove();
  }
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const pr = progEl.getBoundingClientRect();
    top = (pr.bottom || 96) + 8;
    const L = LV[lvl - 1], n = train ? train.n : (L.t === 0 && isAr() ? 2 : L.t === 2 ? 4 : 3);
    const nb = train ? blocks.length : n + L.x;
    const land = W > H * 1.15;
    const PW = Math.min(W - 20, land ? 900 : 620);
    // صينية الحروف
    const cols = nb <= 5 || land ? nb : Math.ceil(nb / 2), rows = Math.ceil(nb / cols);
    let b = Math.min(88, (Math.min(PW, 640) - 24) / cols - 14, land ? H * .13 : H * .1);
    b = Math.max(44, b);
    const trayH = rows * (b * 1.12 + 10) + 34 + safeB;
    const trayTop = H - trayH;
    // القطار
    const EL = 1.6, WS = 1.06, GAP = .08;
    const TLu = EL + GAP + n * WS + .1;
    let u = Math.min((PW - 8) / TLu, 104);
    const avail = trayTop - top - 26;
    u = Math.min(u, avail / 3.3);
    let P = clamp(Math.min(u * (land ? 1.9 : 2.6), avail - u * 2.2 - 40), 70, land ? 130 : 190);
    const trackY = Math.min(trayTop - Math.max(18, u * .35), top + P + u * 1.9 + 30 + (avail - P - u * 1.95) * .55);
    G = { PW, cols, rows, b, trayH, trayTop, u, EL: EL * u, WS: WS * u, GAP: GAP * u, TL: TLu * u, n, P, trackY, cx: W / 2, land };
    // أماكن الحروف في الصينية
    const sp = b * 1.12 + 10;
    blocks.forEach((bk, i) => {
      const r = Math.floor(i / cols), inRow = Math.min(cols, nb - r * cols), ci = i - r * cols;
      const rowW = inRow * (b + 14) - 14;
      bk.hx = W / 2 + (isAr() ? 1 : -1) * (rowW / 2 - b / 2 - ci * (b + 14));
      bk.hy = trayTop + 24 + b / 2 + r * sp;
      if (!bk.placed && !bk.anim && drag?.b !== bk) { bk.x = bk.hx; bk.y = bk.hy; }
    });
    // زر الصوت
    const sz = 64;
    spk.style.top = Math.round(trayTop - sz * .62) + 'px';
    spk.style.left = isAr() ? 'max(12px, env(safe-area-inset-left))' : 'auto';
    spk.style.right = isAr() ? 'auto' : 'max(12px, env(safe-area-inset-right))';
    if (train) placeSlots();
    buildBg();
    if (!clouds.length) for (let i = 0; i < 5; i++) clouds.push({ x: Math.random(), y: rand(.05, .45), s: rand(.6, 1.2), v: rand(.006, .016) });
  }
  // مواقع العربات بالنسبة لمركز القطار
  function placeSlots() {
    const { EL, WS, GAP, TL } = G, d = dir();
    train.engRear = d > 0 ? TL / 2 - EL - .05 * G.u : -TL / 2 + EL + .05 * G.u;
    train.slots.forEach((s, i) => { s.lx = d > 0 ? train.engRear - GAP - WS * (i + .5) : train.engRear + GAP + WS * (i + .5); });
  }

  /* ---------- الخلفية ---------- */
  function buildBg() {
    const key = W + 'x' + H + '|' + dpr + '|' + Math.round(G.trackY) + '|' + Math.round(G.trayTop);
    if (key === bgKey && bgC) return; bgKey = key;
    bgC = mk(W * dpr, H * dpr); const c = bgC.getContext('2d'); c.scale(dpr, dpr);
    const ty = G.trackY, u = G.u;
    // سماء
    let g = c.createLinearGradient(0, 0, 0, ty); g.addColorStop(0, '#6EC3FF'); g.addColorStop(.55, '#AEE0FF'); g.addColorStop(1, '#E4F6FF');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // شمس
    const sx = W * (isAr() ? .16 : .84), sy = top + 40;
    g = c.createRadialGradient(sx, sy, 0, sx, sy, 120); g.addColorStop(0, 'rgba(255,250,210,.95)'); g.addColorStop(.25, 'rgba(255,240,170,.55)'); g.addColorStop(1, 'rgba(255,240,170,0)');
    c.fillStyle = g; c.fillRect(sx - 130, sy - 130, 260, 260);
    // تلال بعيدة
    const hill = (yb, amp, col1, col2, seed, k) => {
      c.beginPath(); c.moveTo(0, H);
      for (let x = 0; x <= W + 10; x += 8) c.lineTo(x, yb - amp * (.55 + .45 * Math.sin(x * k + seed)) - amp * .3 * Math.sin(x * k * 2.3 + seed * 2));
      c.lineTo(W, H); c.closePath();
      const gg = c.createLinearGradient(0, yb - amp * 1.4, 0, yb + 30); gg.addColorStop(0, col1); gg.addColorStop(1, col2);
      c.fillStyle = gg; c.fill();
    };
    hill(ty - u * .9, u * 1.6, '#BFE6C8', '#9ED6B0', 1.3, .006);
    hill(ty - u * .45, u * 1.1, '#9BDB8C', '#6CC46A', 4.1, .009);
    // أشجار مستديرة
    const tree = (x, y, r, col) => {
      c.fillStyle = 'rgba(30,80,30,.18)'; c.beginPath(); c.ellipse(x, y + 2, r * .8, r * .22, 0, 0, TAU); c.fill();
      c.fillStyle = '#9A6A3A'; c.beginPath(); c.roundRect(x - r * .12, y - r * 1.1, r * .24, r * 1.1, r * .08); c.fill();
      const gg = c.createRadialGradient(x - r * .35, y - r * 1.75, r * .1, x, y - r * 1.4, r * 1.05);
      gg.addColorStop(0, mix(col, '#FFFFFF', .45)); gg.addColorStop(.6, col); gg.addColorStop(1, mix(col, '#000000', .25));
      c.fillStyle = gg; c.beginPath(); c.arc(x, y - r * 1.45, r, 0, TAU); c.fill();
      c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(x - r * .35, y - r * 1.85, r * .3, r * .18, -.5, 0, TAU); c.fill();
    };
    let sd = 7; const R = () => (sd = (sd * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < Math.ceil(W / 90); i++) { const x = i * 90 + R() * 50; tree(x, ty - u * .32 - R() * u * .25, u * (.22 + R() * .12), R() < .5 ? '#4DBB5A' : '#3FA65A'); }
    // أرض العشب أمام السكة
    g = c.createLinearGradient(0, ty - u * .3, 0, G.trayTop); g.addColorStop(0, '#8AD67A'); g.addColorStop(1, '#5DBB5E');
    c.fillStyle = g; c.fillRect(0, ty - u * .3, W, G.trayTop - ty + u * .3);
    // زهور صغيرة
    for (let i = 0; i < W / 26; i++) {
      const x = R() * W, y = ty + u * .3 + R() * Math.max(4, G.trayTop - ty - u * .45);
      c.fillStyle = 'rgba(40,120,40,.25)'; c.beginPath(); c.ellipse(x, y + 3, 5, 2, 0, 0, TAU); c.fill();
      c.fillStyle = ['#FFF', '#FFE45C', '#FF9EC4', '#FFFFFF'][i % 4]; c.beginPath(); c.arc(x, y, 2.6, 0, TAU); c.fill();
    }
    // سرير الحصى
    const bedT = ty - u * .14, bedB = ty + u * .2;
    g = c.createLinearGradient(0, bedT, 0, bedB); g.addColorStop(0, '#D9C8B0'); g.addColorStop(1, '#B49E82');
    c.fillStyle = g; c.beginPath(); c.moveTo(0, bedT); c.lineTo(W, bedT); c.lineTo(W, bedB); c.lineTo(0, bedB); c.fill();
    c.fillStyle = 'rgba(90,60,30,.15)'; c.fillRect(0, bedB - 3, W, 3);
    // العوارض
    const sl = u * .42;
    for (let x = -sl; x < W + sl; x += sl) {
      c.fillStyle = '#7A5134'; c.beginPath(); c.moveTo(x, bedT + 2); c.lineTo(x + sl * .5, bedT + 2); c.lineTo(x + sl * .58, bedB - 5); c.lineTo(x - sl * .02, bedB - 5); c.closePath(); c.fill();
      c.fillStyle = '#9C6B45'; c.fillRect(x, bedT + 2, sl * .5, 3);
    }
    // القضبان
    const rail = (y, th) => {
      const gg = c.createLinearGradient(0, y - th, 0, y + th); gg.addColorStop(0, '#F2F4F8'); gg.addColorStop(.5, '#A9B2C2'); gg.addColorStop(1, '#6B7488');
      c.fillStyle = gg; c.fillRect(0, y - th / 2, W, th);
    };
    rail(bedT + u * .07, Math.max(3, u * .06));
    rail(ty + u * .08, Math.max(4, u * .08));
    // رصيف الحروف (المحطة)
    const pt = G.trayTop, ph = G.trayH;
    g = c.createLinearGradient(0, pt, 0, pt + 18); g.addColorStop(0, '#FFE9CC'); g.addColorStop(1, '#FFD9A8');
    c.fillStyle = 'rgba(60,40,10,.18)'; c.fillRect(0, pt - 4, W, 8);
    c.fillStyle = g; c.beginPath(); c.roundRect(-10, pt, W + 20, ph + 20, 22); c.fill();
    g = c.createLinearGradient(0, pt + 10, 0, H); g.addColorStop(0, '#FFF4E4'); g.addColorStop(1, '#FFE6C4');
    c.fillStyle = g; c.beginPath(); c.roundRect(-10, pt + 10, W + 20, ph, 22); c.fill();
    // بلاط الرصيف
    c.strokeStyle = 'rgba(200,140,70,.16)'; c.lineWidth = 2;
    for (let x = 30; x < W; x += 60) { c.beginPath(); c.moveTo(x, pt + 14); c.lineTo(x, H); c.stroke(); }
    // خط أصفر للحافة
    c.fillStyle = '#FFC93C'; c.fillRect(0, pt + 3, W, 5);
    c.fillStyle = 'rgba(255,255,255,.6)'; c.fillRect(0, pt + 3, W, 1.5);
  }

  /* ---------- القطار ---------- */
  function newTrain() {
    const [w, e] = words[wi], L = LV[lvl - 1];
    const ls = lettersOf(w), n = ls.length;
    const given = !isAr() && L.t === 0 ? 1 : 0;
    const col0 = Math.floor(Math.random() * WCOL.length);
    train = { w, e, ls, n, given, x: 0, phase: 'arrive', t0: T, wheel: 0, speed: 0, connected: 0, toot: 0, conT: 0,
      slots: ls.map((ch, i) => ({ ch, i, b: null, sq: 0, shake: 0, wrong: 0, col: (col0 + i) % WCOL.length, pop: 0 })) };
    // الحروف
    const need = ls.slice(given);
    const ex = extrasFor(ls, L.x);
    const all = shuffle(need.concat(ex));
    blocks = all.map((ch, i) => ({ ch, ci: (i * 3 + col0) % BCOL.length, x: 0, y: 0, hx: 0, hy: 0, placed: null, anim: null, wig: 0, hint: 0, appear: T + .9 + i * .07, sc: 1, rot: 0 }));
    layout();
    for (let i = 0; i < given; i++) {
      const s = train.slots[i];
      s.b = { ch: s.ch, ci: 6, given: true, x: 0, y: 0 };
    }
    const D = W / 2 + G.TL / 2 + 80;
    train.from = -dir() * D; train.x = train.from;
    banner = null;
    renderProg();
    Sound.whoosh();
    later(1500, () => { if (train && train.phase !== 'leave') say(train.w); });
  }
  const slotPos = s => ({ x: G.cx + train.x + s.lx, y: G.trackY - G.u * .62 - G.u * .4 });
  function trainBox() {
    const x0 = G.cx + train.x - G.TL / 2, x1 = G.cx + train.x + G.TL / 2;
    return { x0, x1, y0: G.trackY - G.u * 1.6, y1: G.trackY + G.u * .1 };
  }

  function drawWheel(c, x, y, r, ang, rim, hub) {
    c.save(); c.translate(x, y);
    c.fillStyle = 'rgba(30,20,40,.25)'; c.beginPath(); c.ellipse(0, r * .95, r * .9, r * .18, 0, 0, TAU); c.fill();
    let g = c.createRadialGradient(-r * .3, -r * .35, r * .1, 0, 0, r);
    g.addColorStop(0, '#5E5A73'); g.addColorStop(1, '#25223A');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
    g = c.createRadialGradient(-r * .2, -r * .25, 0, 0, 0, r * .78); g.addColorStop(0, mix(rim, '#FFFFFF', .4)); g.addColorStop(1, rim);
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, r * .74, 0, TAU); c.fill();
    c.rotate(ang);
    c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = Math.max(1.5, r * .14); c.lineCap = 'round';
    for (let i = 0; i < 3; i++) { c.rotate(TAU / 6); c.beginPath(); c.moveTo(-r * .55, 0); c.lineTo(r * .55, 0); c.stroke(); }
    c.fillStyle = hub; c.beginPath(); c.arc(0, 0, r * .26, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(-r * .07, -r * .08, r * .09, 0, TAU); c.fill();
    c.restore();
  }
  function glossyRect(c, x, y, w, h, r, c1, c2, opt = {}) {
    c.save();
    c.shadowColor = 'rgba(30,20,60,.25)'; c.shadowBlur = opt.blur == null ? 6 : opt.blur; c.shadowOffsetY = opt.dy == null ? 3 : opt.dy;
    const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, mix(c1, '#FFFFFF', .35)); g.addColorStop(.35, c1); g.addColorStop(1, c2);
    c.fillStyle = g; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); c.restore();
    c.save(); c.beginPath(); c.roundRect(x, y, w, h, r); c.clip();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.roundRect(x + w * .06, y + h * .08, w * .88, Math.min(h * .28, 10), 6); c.fill();
    c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(x, y + h - Math.max(3, h * .14), w, h);
    c.restore();
  }
  // القاطرة: الإحداثيات المحلية تبدأ من مؤخرة القاطرة على القضيب وتتجه نحو +x
  function drawEngine(c, u, ang, tt) {
    const EL = G.EL;
    // الهيكل السفلي
    glossyRect(c, -u * .02, -u * .42, EL * .98, u * .18, u * .06, '#4B4670', '#2E2A4A', { blur: 4 });
    // البويلر
    const by = -u * .7, br = u * .27, bx0 = u * .62, bx1 = EL - u * .1;
    let g = c.createLinearGradient(0, by - br, 0, by + br);
    g.addColorStop(0, '#FF9A8A'); g.addColorStop(.25, '#F2483C'); g.addColorStop(.75, '#D52C2A'); g.addColorStop(1, '#951B1E');
    c.save(); c.shadowColor = 'rgba(40,10,10,.3)'; c.shadowBlur = 8; c.shadowOffsetY = 3;
    c.fillStyle = g; c.beginPath(); c.roundRect(bx0, by - br, bx1 - bx0, br * 2, [0, br, br, 0]); c.fill(); c.restore();
    c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.roundRect(bx0 + u * .05, by - br * .78, (bx1 - bx0) * .8, br * .28, br * .14); c.fill();
    // حلقات ذهبية
    for (const fx of [.33, .7]) {
      const x = bx0 + (bx1 - bx0) * fx;
      g = c.createLinearGradient(0, by - br, 0, by + br); g.addColorStop(0, '#FFF0A8'); g.addColorStop(.4, '#FFC93C'); g.addColorStop(1, '#C98A00');
      c.fillStyle = g; c.beginPath(); c.roundRect(x - u * .035, by - br - 1, u * .07, br * 2 + 2, u * .03); c.fill();
    }
    // واجهة الدخان الأمامية
    g = c.createLinearGradient(0, by - br, 0, by + br); g.addColorStop(0, '#6C6790'); g.addColorStop(1, '#2E2A4A');
    c.fillStyle = g; c.beginPath(); c.ellipse(bx1, by, u * .1, br * 1.02, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(bx1 - u * .02, by - br * .5, u * .04, br * .25, 0, 0, TAU); c.fill();
    // القبة
    g = c.createRadialGradient(bx0 + u * .45, by - br - u * .1, 1, bx0 + u * .45, by - br, u * .16);
    g.addColorStop(0, '#FFF5C4'); g.addColorStop(.5, '#FFC93C'); g.addColorStop(1, '#C98A00');
    c.fillStyle = g; c.beginPath(); c.ellipse(bx0 + u * .45, by - br + u * .02, u * .13, u * .14, 0, Math.PI, 0); c.fill();
    // المدخنة
    const cx = bx1 - u * .25, ct = by - br - u * .38;
    g = c.createLinearGradient(cx - u * .1, 0, cx + u * .1, 0); g.addColorStop(0, '#2E2A4A'); g.addColorStop(.4, '#6C6790'); g.addColorStop(1, '#2E2A4A');
    c.fillStyle = g; c.beginPath(); c.moveTo(cx - u * .08, by - br + 2); c.lineTo(cx - u * .1, ct + u * .1); c.lineTo(cx - u * .17, ct); c.lineTo(cx + u * .17, ct);
    c.lineTo(cx + u * .1, ct + u * .1); c.lineTo(cx + u * .08, by - br + 2); c.closePath(); c.fill();
    c.fillStyle = '#FFC93C'; c.beginPath(); c.roundRect(cx - u * .19, ct - u * .05, u * .38, u * .08, u * .04); c.fill();
    // المصباح
    g = c.createRadialGradient(bx1 + u * .02, by - br - u * .02, 0, bx1 + u * .02, by - br - u * .02, u * .1);
    g.addColorStop(0, '#FFFBE0'); g.addColorStop(.6, '#FFE066'); g.addColorStop(1, '#E0A800');
    c.fillStyle = '#4B4670'; c.fillRect(bx1 - u * .04, by - br - u * .02, u * .06, u * .08);
    c.fillStyle = g; c.beginPath(); c.arc(bx1 + u * .02, by - br - u * .05, u * .075, 0, TAU); c.fill();
    // الكابينة
    const cw = u * .66, ch = u * .78, cy0 = -u * .4 - ch;
    glossyRect(c, 0, cy0, cw, ch, u * .08, '#3E9BFF', '#2163C9');
    // نافذة
    const wx = u * .13, wy = cy0 + u * .14, ww = cw - u * .26, wh = ch * .42;
    c.fillStyle = '#1D4F9E'; c.beginPath(); c.roundRect(wx - 2, wy - 2, ww + 4, wh + 4, u * .08); c.fill();
    g = c.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#E6F7FF'); g.addColorStop(1, '#9ED8FF');
    c.fillStyle = g; c.beginPath(); c.roundRect(wx, wy, ww, wh, u * .07); c.fill();
    c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.moveTo(wx + ww * .15, wy + wh); c.lineTo(wx + ww * .45, wy); c.lineTo(wx + ww * .62, wy); c.lineTo(wx + ww * .32, wy + wh); c.fill();
    // السقف
    glossyRect(c, -u * .07, cy0 - u * .13, cw + u * .14, u * .16, u * .07, '#FF6B5B', '#C2382E', { blur: 4 });
    // حاجز البقر الأمامي
    c.fillStyle = '#FFC93C'; c.beginPath(); c.moveTo(EL - u * .1, -u * .42); c.lineTo(EL + u * .08, -u * .14); c.lineTo(EL - u * .22, -u * .14); c.closePath(); c.fill();
    c.strokeStyle = '#C98A00'; c.lineWidth = 1.5;
    for (let i = 1; i < 3; i++) { c.beginPath(); c.moveTo(EL - u * .1 - i * u * .04, -u * .4); c.lineTo(EL - u * .22 + i * u * .07, -u * .15); c.stroke(); }
    // العجلات
    const r1 = u * .2, wy0 = -r1 - u * .01;
    drawWheel(c, u * .3, wy0, r1, ang, '#FF6B5B', '#FFC93C');
    drawWheel(c, u * .82, wy0, r1, ang, '#FF6B5B', '#FFC93C');
    drawWheel(c, EL - u * .3, -u * .14 - u * .01, u * .13, ang * 1.5, '#FF6B5B', '#FFC93C');
    // ذراع التوصيل
    const ox = Math.cos(ang) * r1 * .45, oy = Math.sin(ang) * r1 * .45;
    c.strokeStyle = '#C9CED9'; c.lineWidth = Math.max(2.5, u * .05); c.lineCap = 'round';
    c.beginPath(); c.moveTo(u * .3 + ox, wy0 + oy); c.lineTo(u * .82 + ox, wy0 + oy); c.stroke();
    c.fillStyle = '#fff'; [u * .3, u * .82].forEach(x => { c.beginPath(); c.arc(x + ox, wy0 + oy, u * .03, 0, TAU); c.fill(); });
  }
  function drawWagon(c, x, base, u, s, ang) {
    const [c1, c2] = WCOL[s.col];
    const w = u * .98, h = u * .44, y0 = base - u * .26 - h;
    // الهيكل
    glossyRect(c, x - w * .48, base - u * .34, w * .96, u * .12, u * .05, '#4B4670', '#2E2A4A', { blur: 3 });
    drawWheel(c, x - w * .28, base - u * .15, u * .15, ang, c1, '#FFE066');
    drawWheel(c, x + w * .28, base - u * .15, u * .15, ang, c1, '#FFE066');
    // الحرف داخل العربة
    if (s.b) {
      const sq = s.sq, sx = 1 + sq * .18, sy = 1 - sq * .22;
      const bs = u * .8, bx = x, by = y0 + h * .3 - bs / 2;
      c.save(); c.translate(bx, by + bs / 2); c.scale(sx, sy); c.translate(-bx, -(by + bs / 2));
      const txt = train.connected && isAr() ? formOf(train.ls, s.i) : disp(s.ch);
      const pop = s.pop > 0 ? 1 + Math.sin(Math.min(1, s.pop) * Math.PI) * .18 : 1;
      c.translate(bx, by); c.scale(pop, pop); c.translate(-bx, -by);
      drawBlock(c, txt, s.b.given ? 6 : s.b.ci, bx, by, bs, isAr(), s.b.given ? '' : '');
      c.restore();
    } else if (train.phase === 'play' || train.phase === 'arrive') {
      // مكان فارغ منقّط
      const bs = u * .8, by = y0 + h * .3 - bs / 2, cur = train.slots.find(q => !q.b) === s;
      const pulse = cur ? .5 + .5 * Math.sin(T * 5) : 0;
      const hl = drag && drag.over === s;
      c.save();
      c.fillStyle = hl ? 'rgba(255,255,255,.75)' : `rgba(255,255,255,${.6 + pulse * .2})`;
      c.strokeStyle = hl ? '#FFB020' : cur ? `rgba(255,${170 + pulse * 60},40,1)` : 'rgba(255,255,255,.95)';
      c.lineWidth = hl || cur ? 4 : 3; c.setLineDash([u * .1, u * .07]);
      c.beginPath(); c.roundRect(x - bs / 2, by - bs / 2, bs, bs, bs * .22); c.fill(); c.stroke();
      c.setLineDash([]);
      if (s.hintOn) {
        c.globalAlpha = .28 + .12 * Math.sin(T * 6);
        c.font = `900 ${bs * .6}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#5A2A08'; c.direction = isAr() ? 'rtl' : 'ltr';
        c.fillText(disp(s.ch), x, by + bs * .04);
      } else {
        c.fillStyle = 'rgba(255,255,255,.9)'; c.font = `900 ${bs * .42}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillText('?', x, by + bs * .02);
      }
      c.restore();
    }
    // جدار العربة الأمامي
    let g = c.createLinearGradient(0, y0, 0, y0 + h);
    g.addColorStop(0, mix(c1, '#FFFFFF', .4)); g.addColorStop(.3, c1); g.addColorStop(1, c2);
    c.save(); c.shadowColor = 'rgba(30,20,60,.3)'; c.shadowBlur = 6; c.shadowOffsetY = 3;
    c.fillStyle = g; c.beginPath(); c.roundRect(x - w / 2, y0, w, h, [u * .06, u * .06, u * .14, u * .14]); c.fill(); c.restore();
    // حافة علوية
    g = c.createLinearGradient(0, y0 - u * .05, 0, y0 + u * .07); g.addColorStop(0, mix(c1, '#FFFFFF', .6)); g.addColorStop(1, mix(c1, '#FFFFFF', .2));
    c.fillStyle = g; c.beginPath(); c.roundRect(x - w / 2 - u * .03, y0 - u * .04, w + u * .06, u * .1, u * .05); c.fill();
    // ألواح ومسامير
    c.fillStyle = 'rgba(0,0,0,.1)';
    c.beginPath(); c.roundRect(x - w * .36, y0 + h * .3, w * .72, h * .44, u * .05); c.fill();
    c.fillStyle = 'rgba(255,255,255,.22)';
    c.beginPath(); c.roundRect(x - w * .36, y0 + h * .3, w * .72, h * .12, u * .04); c.fill();
    c.fillStyle = 'rgba(255,255,255,.65)';
    for (const fx of [-.42, .42]) for (const fy of [.3, .74]) { c.beginPath(); c.arc(x + w * fx, y0 + h * fy, Math.max(1.2, u * .025), 0, TAU); c.fill(); }
  }
  function drawCoupler(c, x0, x1, y) {
    c.strokeStyle = '#2E2A4A'; c.lineWidth = Math.max(3, G.u * .07); c.lineCap = 'round';
    c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
    c.fillStyle = '#6C6790'; c.beginPath(); c.arc((x0 + x1) / 2, y, G.u * .05, 0, TAU); c.fill();
  }
  function drawTrain(c) {
    if (!train) return;
    const u = G.u, base = G.trackY, d = dir();
    const ox = G.cx + train.x;
    const bob = train.speed > 5 ? Math.sin(T * 22) * .9 : 0;
    // ظل
    c.fillStyle = 'rgba(40,30,20,.22)';
    c.beginPath(); c.ellipse(ox, base + u * .02, G.TL * .52, u * .1, 0, 0, TAU); c.fill();
    // الوصلات
    const ys = base - u * .27;
    train.slots.forEach((s, i) => {
      const a = ox + s.lx + d * G.WS * .48, b = i === 0 ? ox + train.engRear : ox + s.lx + d * G.WS * .52;
      drawCoupler(c, Math.min(a, b) - 1, Math.max(a, b) + 1, ys);
    });
    // العربات
    train.slots.forEach((s, i) => {
      const sh = s.shake > 0 ? Math.sin(s.shake * 40) * s.shake * 5 : 0;
      c.save(); c.translate(sh, bob * (i % 2 ? 1 : -1));
      drawWagon(c, ox + s.lx, base, u, s, train.wheel);
      c.restore();
    });
    // القاطرة
    c.save(); c.translate(ox + train.engRear, base + bob); c.scale(d, 1);
    drawEngine(c, u, train.wheel, T);
    c.restore();
    // بطاقة الصورة فوق الكابينة
    const cabX = ox + train.engRear + d * u * .33;
    const P = G.P, cy = base - u * 1.32 - P * .5 - u * .08 + bob;
    const sway = train.speed > 5 ? Math.sin(T * 8) * .03 : Math.sin(T * 1.6) * .015;
    const lift = u * .32;
    let ccx = clamp(cabX, P / 2 + 8, W - P / 2 - 8);
    if (train.phase === 'arrive' || train.phase === 'leave') ccx = cabX;
    const dx = ccx - cabX;
    c.save(); c.translate(cabX, base - u * 1.3 + bob);
    // العمود
    let g = c.createLinearGradient(-u * .05, 0, u * .05, 0); g.addColorStop(0, '#C98A00'); g.addColorStop(.5, '#FFE07A'); g.addColorStop(1, '#C98A00');
    c.fillStyle = g; c.beginPath(); c.moveTo(-u * .04, u * .02); c.lineTo(u * .04, u * .02); c.lineTo(dx * .9 + u * .04, -lift - u * .05); c.lineTo(dx * .9 - u * .04, -lift - u * .05); c.fill();
    c.translate(dx, 0); c.rotate(sway);
    const cy2 = -lift - P / 2;
    c.save(); c.shadowColor = 'rgba(30,20,60,.3)'; c.shadowBlur = 12; c.shadowOffsetY = 6;
    c.fillStyle = '#E8590C'; c.beginPath(); c.roundRect(-P / 2, cy2 - P / 2 + P * .05, P, P, P * .22); c.fill(); c.restore();
    g = c.createLinearGradient(0, cy2 - P / 2, 0, cy2 + P / 2); g.addColorStop(0, '#FFB676'); g.addColorStop(1, '#FF7A2E');
    c.fillStyle = g; c.beginPath(); c.roundRect(-P / 2, cy2 - P / 2, P, P, P * .22); c.fill();
    g = c.createLinearGradient(0, cy2 - P / 2, 0, cy2 + P / 2); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#FFF1E2');
    const bw = P * .075;
    c.fillStyle = g; c.beginPath(); c.roundRect(-P / 2 + bw, cy2 - P / 2 + bw, P - bw * 2, P - bw * 2, P * .16); c.fill();
    const pe = train.phase === 'done' ? 1 + Math.sin(Math.min(1, (T - train.conT) * 2.2) * Math.PI) * .18 : 1;
    c.save(); c.translate(0, cy2); c.scale(pe, pe);
    drawEmoji(c, train.e, 0, Math.sin(T * 2.4) * P * .02, P * .66);
    c.restore();
    c.restore();
    train.card = { x: ccx - P / 2, y: base - u * 1.3 - lift - P, w: P, h: P };
    void cy;
  }

  /* ---------- اللافتة عند اكتمال الكلمة ---------- */
  function drawBanner(c) {
    if (!banner) return;
    const t = T - banner.t, k = t < .45 ? outBack(t / .45) : 1, a = banner.out ? Math.max(0, 1 - (T - banner.out) * 3) : 1;
    if (a <= 0) return;
    const fs = Math.min(64, G.u * .9 + 18);
    c.save(); c.globalAlpha = a;
    c.font = `900 ${fs}px ${FONT}`; c.direction = isAr() ? 'rtl' : 'ltr';
    const tw = c.measureText(banner.txt).width;
    let tw2 = 0; if (banner.sub) { c.font = `900 ${fs * .55}px ${FONT}`; tw2 = c.measureText(banner.sub).width + 24; }
    const bw = tw + tw2 + fs * 1.1, bh = fs * 1.35;
    const cx = W / 2, cy = Math.max(top + bh / 2 + 6, G.trackY - G.u * 1.4 - G.P - bh / 2 - 14);
    c.translate(cx, cy); c.scale(k, k);
    c.save(); c.shadowColor = 'rgba(30,20,60,.3)'; c.shadowBlur = 14; c.shadowOffsetY = 7;
    c.fillStyle = '#3E9BFF'; c.beginPath(); c.roundRect(-bw / 2, -bh / 2 + 6, bw, bh, bh / 2); c.fill(); c.restore();
    c.fillStyle = '#7CC0FF'; c.beginPath(); c.roundRect(-bw / 2, -bh / 2, bw, bh, bh / 2); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-bw / 2 + 5, -bh / 2 + 5, bw - 10, bh - 10, bh / 2 - 5); c.fill();
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.font = `900 ${fs}px ${FONT}`; c.fillStyle = '#2B3A8C';
    const x0 = banner.sub ? (isAr() ? tw2 / 2 : -tw2 / 2) : 0;
    c.fillText(banner.txt, x0, fs * .06);
    if (banner.sub) { c.font = `900 ${fs * .55}px ${FONT}`; c.fillStyle = '#E8590C'; c.fillText(banner.sub, x0 + (isAr() ? -1 : 1) * (tw / 2 + tw2 / 2 + 4), fs * .06); }
    c.restore();
    // نجوم صغيرة حولها
    for (let i = 0; i < 4; i++) {
      const an = T * 1.5 + i * TAU / 4;
      c.save(); c.globalAlpha = a * (.6 + .4 * Math.sin(T * 5 + i)); c.translate(cx + Math.cos(an) * bw * .55, cy + Math.sin(an) * bh * .75); c.fillStyle = '#FFD43B'; starPath(c, 7); c.fill(); c.restore();
    }
  }

  /* ---------- الجسيمات ---------- */
  function smoke(x, y, n, big) {
    for (let i = 0; i < n; i++) parts.push({ t: 'smoke', x: x + rand(-4, 4), y, vx: -dir() * rand(10, 40) + rand(-15, 15), vy: -rand(40, 80) * (big ? 1.4 : 1), s: G.u * rand(.25, .4) * (big ? 1.5 : 1), age: 0, life: rand(1.1, 1.8), rot: rand(0, TAU) });
  }
  function burst(x, y, col, n) {
    for (let i = 0; i < n; i++) { const a = rand(0, TAU), v = rand(80, 260); parts.push({ t: Math.random() < .5 ? 'star' : 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, s: rand(4, 9), age: 0, life: rand(.5, .9), c: col || pick(['#FFD43B', '#FF7A2E', '#3E9BFF', '#4CC76A', '#FF5C7A']), rot: rand(0, TAU), g: 400 }); }
  }
  function confetti(n) {
    for (let i = 0; i < n; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-60, -10), vx: rand(-40, 40), vy: rand(60, 180), s: rand(6, 11), age: 0, life: rand(2, 3.2), c: pick(['#FFD43B', '#FF7A2E', '#3E9BFF', '#4CC76A', '#FF5C7A', '#B26BFF']), rot: rand(0, TAU), vr: rand(-6, 6), g: 30 });
  }
  function drawParts(c, front) {
    const puff = getPuff();
    for (const p of parts) {
      if ((p.t === 'smoke') !== front) continue;
      const a = 1 - p.age / p.life;
      c.save(); c.translate(p.x, p.y);
      if (p.t === 'smoke') {
        const s = p.s * (1 + p.age * 1.4);
        c.globalAlpha = Math.min(1, a * 1.4) * .95; c.rotate(p.rot); c.drawImage(puff, -s, -s, s * 2, s * 2);
      } else {
        c.globalAlpha = p.t === 'conf' ? Math.min(1, a * 3) : a; c.rotate(p.rot); c.fillStyle = p.c;
        if (p.t === 'star') { starPath(c, p.s * (.6 + a * .5)); c.fill(); }
        else if (p.t === 'dot') { c.beginPath(); c.arc(0, 0, p.s * .45 * a + 1, 0, TAU); c.fill(); }
        else { c.scale(1, Math.cos(p.age * 9 + p.rot)); c.fillRect(-p.s / 2, -p.s * .3, p.s, p.s * .6); }
      }
      c.restore();
    }
  }

  /* ---------- اللعب ---------- */
  function renderProg() {
    progEl.style.direction = isAr() ? 'rtl' : 'ltr';
    progEl.innerHTML = words.map((_, i) => `<i class="${i < wi ? 'on' : i === wi ? 'cur' : ''}"></i>`).join('');
  }
  function startLevel(n) {
    lvl = clamp(n, 1, NL);
    clearTimers(); winOv.classList.remove('on'); lvOv.classList.remove('on');
    words = pickWords(LV[lvl - 1]); wi = 0; mistakes = 0; parts = []; drag = null; phase = 'play';
    root.querySelector('.lvbtn .cnt').textContent = numL(lvl, lang);
    train = null;
    newTrain();
  }
  function blockAt(x, y) {
    for (let i = blocks.length - 1; i >= 0; i--) {
      const b = blocks[i]; if (b.placed || b.anim || T < b.appear) continue;
      if (Math.abs(x - b.x) < G.b * .62 && Math.abs(y - b.y) < G.b * .62) return b;
    }
    return null;
  }
  function slotNear(x, y) {
    if (!train) return null;
    let best = null, bd = 1e9;
    for (const s of train.slots) {
      if (s.b) continue;
      const p = slotPos(s), d = Math.hypot((x - p.x) * .9, y - p.y);
      if (d < bd) { bd = d; best = s; }
    }
    const box = trainBox();
    if (best && (bd < G.u * 1.1 || (x > box.x0 - 10 && x < box.x1 + 10 && y > box.y0 - G.u * .5 && y < box.y1))) return best;
    return null;
  }
  function tryPlace(b, s) {
    if (!train || train.phase !== 'play') return false;
    if (s.ch === b.ch && !s.b) {
      const p = slotPos(s);
      b.placed = s; s.b = b;
      b.anim = { fx: b.x, fy: b.y, t0: T, d: .22, tx: p.x, ty: p.y, kind: 'in' };
      s.sq = 0; s.pending = true;
      return true;
    }
    // خطأ
    mistakes++; s.wrong++;
    s.shake = 1; shake = Math.max(shake, 4);
    Sound.error(); vibrate(30);
    b.anim = { fx: b.x, fy: b.y, t0: T, d: .45, tx: b.hx, ty: b.hy, kind: 'back' };
    const need = train.slots.find(q => !q.b);
    if (s.wrong >= 2 || mistakes % 3 === 0) {
      if (need) { need.hintOn = true; const nb = blocks.find(q => !q.placed && q.ch === need.ch); if (nb) nb.hint = T + 4; later(350, () => sayLetter(need.ch)); }
    }
    return false;
  }
  function landed(b) {
    const s = b.placed; s.sq = 1; s.pending = false; s.hintOn = false;
    const p = slotPos(s);
    Sound.pop(); Sound.tone(440 * Math.pow(1.12, s.i + 2), .14, 'triangle', .12, 120);
    vibrate(15); burst(p.x, p.y - G.u * .2, null, 10);
    sayLetter(s.ch);
    if (train.slots.every(q => q.b && !q.pending)) later(380, complete);
  }
  function complete() {
    if (!train || train.phase !== 'play') return;
    train.phase = 'done'; train.conT = T;
    train.connected = 1;
    train.slots.forEach((s, i) => { s.pop = -i * .12 / .5; });
    const sub = isAr() ? '' : train.w.toUpperCase();
    banner = { txt: isAr() ? train.w : train.w, sub: isAr() ? '' : (ucase ? train.w : sub), t: T + .25 };
    if (!isAr() && ucase) banner.txt = train.w.toUpperCase();
    Sound.star();
    later(300, () => say(train.w));
    later(900, () => { toot(); });
    later(1650, () => { praise(); });
    later(2300, () => { if (!train) return; train.phase = 'leave'; train.t0 = T; banner.out = T + .3; Sound.whoosh(); });
    wi++; renderProg();
    App.achieve('wordtrain_first');
    const tw = store.get('wordtrainWords', 0) + 1; store.set('wordtrainWords', tw);
    if (tw >= 50) App.achieve('wordtrain_50');
  }
  function toot() {
    if (!train) return;
    train.toot = T;
    [[587, 0], [740, 0], [587, .42], [740, .42]].forEach(([f, d]) => Sound.tone(f, .38, 'triangle', .1, -12, d));
    Sound.noise(.7, 1800, 2600, .05, 3);
    const p = chimneyPos(); smoke(p.x, p.y, 6, true);
    for (let i = 0; i < train.slots.length; i++) { const sp = slotPos(train.slots[i]); burst(sp.x, sp.y - G.u * .3, null, 8); }
    confetti(60);
  }
  function chimneyPos() {
    const d = dir(), u = G.u;
    return { x: G.cx + train.x + train.engRear + d * (G.EL - u * .35), y: G.trackY - u * 1.4 };
  }
  function levelWin() {
    phase = 'over';
    const pr = loadProg(), my = pr[lang], stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1, prev = my.stars[lvl] || 0;
    if (stars > prev) my.stars[lvl] = stars;
    if (lvl >= my.unlocked) my.unlocked = Math.min(NL, lvl + 1);
    store.set('wordtrainProg', pr);
    Sound.win(); confetti(140);
    later(700, () => {
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنت!') + ' 🎉';
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wP').innerHTML = `🚂 ${App.g('أوصلتِ', 'أوصلتَ')} ${numL(words.length, lang)} ${words.length > 2 && words.length < 11 ? 'قطارات' : 'قطار'}` +
        (mistakes ? ` · الأخطاء: ${numL(mistakes, lang)}` : ' دون أي خطأ! 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < NL ? '' : 'none';
      winOv.classList.add('on');
      praise();
      if (stars > prev) App.addStars(stars - prev);
      if (Array.from({ length: NL }, (_, i) => my.stars[i + 1]).every(Boolean)) App.achieve(isAr() ? 'wordtrain_ar' : 'wordtrain_en');
    });
  }

  /* ---------- القائمة/المستويات ---------- */
  function paintLang() {
    root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
    root.querySelector('.case').classList.toggle('on', lang === 'en');
    root.querySelectorAll('.case button').forEach(b => b.classList.toggle('on', (b.dataset.c === 'upper') === ucase));
  }
  function setLang(l, fromPanel) {
    if (l === lang) return;
    lang = l; store.set('wordtrainLang', lang); paintLang(); bcache.clear(); bgKey = '';
    Sound.tap();
    if (fromPanel) { renderLevels(); return; }
    startLevel(Math.min(loadProg()[lang].unlocked, NL));
  }
  function renderLevels() {
    const my = loadProg()[lang], box = root.querySelector('.lvl');
    const cols = [['#FF9A5C', '#E8590C', '#B8460A'], ['#5BB0FF', '#2F80E8', '#1F5CC4'], ['#B57CFF', '#8B4FE0', '#6A33B3']];
    let html = '';
    [0, 1, 2].forEach(t => {
      html += `<div class="tier">${TIER_I[t]} ${t === 0 && !isAr() ? 'كلمات قصيرة (الحرف الأول جاهز)' : TIER_T[t]}</div><div class="lvg">`;
      LV.forEach((L, i) => {
        if (L.t !== t) return;
        const n = i + 1, s = my.stars[n] || 0, lock = n > my.unlocked, [l, c, d] = cols[t];
        html += `<button class="lv${lock ? ' lock' : ''}${n === lvl && phase !== 'idle' ? ' cur' : ''}" data-l="${n}" style="--l:${l};--c:${c};--d:${d}" aria-label="المستوى ${n}">${numL(n, lang)}
          <span class="s">${lock ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
      });
      html += '</div>';
    });
    box.innerHTML = html;
    box.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg()[lang].unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n); layout();
    });
  }
  function openLevels() { paintLang(); renderLevels(); winOv.classList.remove('on'); lvOv.classList.add('on'); }
  function act(a) {
    Sound.tap();
    if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
    else if (a === 'close') {
      lvOv.classList.remove('on');
      // إن تغيّرت اللغة من النافذة نبدأ بها
      if (train && (isAr() ? /[a-z]/ : /[؀-ۿ]/).test(train.w)) startLevel(Math.min(loadProg()[lang].unlocked, NL));
      else if (phase === 'over') winOv.classList.add('on');
    }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });
  root.querySelectorAll('.lang.top button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l, false)));
  root.querySelectorAll('.lvp .lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l, true)));
  root.querySelectorAll('.case button').forEach(b => b.addEventListener('click', () => { ucase = b.dataset.c === 'upper'; store.set('wordtrainCase', ucase); paintLang(); bcache.clear(); Sound.tap(); }));
  spk.addEventListener('click', () => { if (train) { say(train.w); Sound.tap(); } });

  /* ---------- الإدخال ---------- */
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  cv.addEventListener('pointerdown', e => {
    if (paused || !train || drag) return;
    Sound.ac(true);
    const m = pos(e);
    const c = train.card;
    if (c && m.x > c.x && m.x < c.x + c.w && m.y > c.y && m.y < c.y + c.h) { say(train.w); train.cardTap = T; return; }
    if (train.phase !== 'play' && train.phase !== 'arrive') return;
    const b = blockAt(m.x, m.y); if (!b) return;
    drag = { b, id: e.pointerId, ox: b.x - m.x, oy: b.y - m.y, sx: m.x, sy: m.y, moved: false, over: null };
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    Sound.tap(); vibrate(8);
    blocks.splice(blocks.indexOf(b), 1); blocks.push(b); // للأعلى
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || drag.id !== e.pointerId) return;
    const m = pos(e);
    if (!drag.moved && Math.hypot(m.x - drag.sx, m.y - drag.sy) > 8) { drag.moved = true; sayLetter(drag.b.ch); }
    drag.b.x = m.x + drag.ox; drag.b.y = m.y + drag.oy - (drag.moved ? 10 : 0);
    drag.over = drag.moved && train.phase === 'play' ? slotNear(drag.b.x, drag.b.y) : null;
  });
  const endDrag = e => {
    if (!drag || drag.id !== e.pointerId) return;
    const d = drag; drag = null;
    const b = d.b;
    if (!d.moved) { b.wig = 1; sayLetter(b.ch); b.x = b.hx; b.y = b.hy; return; }
    const s = train && train.phase === 'play' ? slotNear(b.x, b.y) : null;
    if (s) tryPlace(b, s);
    else { b.anim = { fx: b.x, fy: b.y, t0: T, d: .3, tx: b.hx, ty: b.hy, kind: 'home' }; Sound.slide(); }
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', e => { if (drag && drag.id === e.pointerId) { const b = drag.b; drag = null; b.anim = { fx: b.x, fy: b.y, t0: T, d: .3, tx: b.hx, ty: b.hy, kind: 'home' }; } });

  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on')) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(lvl < NL ? 'next' : 'levels'); } return; }
    if (lvOv.classList.contains('on')) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (train) say(train.w); return; }
    if (!train || train.phase !== 'play' || drag || e.key.length !== 1) return;
    const k = e.key.toLowerCase();
    const s = train.slots.find(q => !q.b); if (!s) return;
    const b = blocks.find(q => !q.placed && !q.anim && (q.ch === k || (isAr() && LNAME[q.ch] && LNAME[q.ch] === LNAME[k] && q.ch === k)));
    if (b) { sayLetter(b.ch); tryPlace(b, s); }
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    if (shake > 0) shake = Math.max(0, shake - dt * 18);
    clouds.forEach(cl => { cl.x += cl.v * dt; if (cl.x > 1.25) cl.x = -.25; });
    if (train) {
      const D = W / 2 + G.TL / 2 + 80, px = train.x;
      if (train.phase === 'arrive') {
        const p = Math.min(1, (T - train.t0) / 1.9);
        train.x = train.from * (1 - easeOutCubic(p));
        if (p >= 1) { train.phase = 'play'; train.x = 0; Sound.tone(1320, .12, 'sine', .1); Sound.tone(1660, .25, 'sine', .08, 0, .1); smoke(chimneyPos().x, chimneyPos().y, 3, false); }
      } else if (train.phase === 'leave') {
        const p = Math.min(1, (T - train.t0) / 1.7);
        train.x = dir() * D * easeInCubic(p);
        if (p >= 1) {
          train = null; blocks = [];
          if (wi >= words.length) levelWin(); else newTrain();
        }
      }
      if (train) {
        const v = (train.x - px) / Math.max(dt, 1e-3);
        train.speed = Math.abs(v);
        train.wheel += (train.x - px) / (G.u * .2);
        if (train.speed > 20) {
          chuffAcc += dt * Math.min(9, 2 + train.speed / 60);
          if (chuffAcc > 1) { chuffAcc = 0; const p = chimneyPos(); smoke(p.x, p.y, 1, false); Sound.noise(.08, 260, 900, .06, 1.2); }
        } else if (train.phase === 'play' && Math.random() < dt * .7) { const p = chimneyPos(); smoke(p.x, p.y, 1, false); }
        train.slots.forEach(s => {
          s.sq = Math.max(0, s.sq - dt * 4.5);
          s.shake = Math.max(0, s.shake - dt * 2.5);
          if (s.pop < 1 && train.connected) s.pop = Math.min(1, s.pop + dt * 2);
        });
      }
    }
    for (const b of blocks) {
      if (b.wig > 0) b.wig = Math.max(0, b.wig - dt * 2.2);
      if (b.anim) {
        const a = b.anim, p = Math.min(1, (T - a.t0) / a.d);
        const e = a.kind === 'back' ? outBack(p) : easeOutCubic(p);
        if (a.kind === 'in' && b.placed) { const sp = slotPos(b.placed); a.tx = sp.x; a.ty = sp.y; }
        b.x = a.fx + (a.tx - a.fx) * e; b.y = a.fy + (a.ty - a.fy) * e - (a.kind === 'in' ? Math.sin(p * Math.PI) * G.u * .5 : 0);
        if (p >= 1) { b.anim = null; if (a.kind === 'in') landed(b); }
      }
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.age += dt;
      if (p.age >= p.life) { parts.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.t === 'smoke') { p.vy *= 1 - dt * .8; p.vx *= 1 - dt * .5; p.rot += dt * .5; }
      else { p.vy += (p.g || 0) * dt; if (p.vr) p.rot += p.vr * dt; }
    }
  }
  function render() {
    if (!ctx) return;
    const c = ctx;
    c.save();
    if (shake > 0) c.translate(rand(-shake, shake), rand(-shake, shake) * .5);
    c.drawImage(bgC, 0, 0, W, H);
    // غيوم
    clouds.forEach(cl => IK.cloud(c, cl.x * (W + 200) - 100, top + 20 + cl.y * (G.trackY - top - G.u * 2.5), 90 * cl.s, '#fff', 'rgba(170,200,235,.5)'));
    drawParts(c, true);
    drawTrain(c);
    drawBanner(c);
    // حروف الصينية
    for (const b of blocks) {
      if (b.placed && !b.anim) continue;
      const ap = Math.min(1, Math.max(0, (T - b.appear) / .35));
      if (ap <= 0) continue;
      const isDrag = drag && drag.b === b;
      const s = G.b * (isDrag && drag.moved ? 1.12 : 1) * outBack(ap) * (b.anim && b.anim.kind === 'in' ? 1 - (T - b.anim.t0) / b.anim.d * (1 - G.u * .8 / G.b) : 1);
      const hint = b.hint > T ? .5 + .5 * Math.sin(T * 9) : 0;
      c.save(); c.translate(b.x, b.y);
      if (b.wig > 0) c.rotate(Math.sin(b.wig * 22) * b.wig * .2);
      if (hint) {
        c.fillStyle = `rgba(255,214,60,${.35 + hint * .4})`; c.beginPath(); c.roundRect(-s * .66, -s * .66, s * 1.32, s * 1.32, s * .32); c.fill();
      }
      if (isDrag && drag.moved) { c.fillStyle = 'rgba(30,20,60,.18)'; c.beginPath(); c.ellipse(0, s * .75, s * .45, s * .1, 0, 0, TAU); c.fill(); }
      drawBlock(c, disp(b.ch), b.ci, 0, 0, s, isAr());
      c.restore();
    }
    drawParts(c, false);
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
    clearTimeout(resizeT); resizeT = setTimeout(() => { measureSafe(); layout(); render(); }, 60);
  });
  if (document.fonts && document.fonts.load) document.fonts.load(`900 40px ${FONT}`, 'قطةabc').then(() => { bcache.clear(); }).catch(() => {});

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    IK.bg(c, s, ['#E2F5FF', '#7CC8FF', '#2F80E8'], { seed: 21 });
    IK.ground(c, s, s * .74, '#8AD67A', '#4FAE52');
    const sv = dpr, sg = G; dpr = 2;
    G = { u: s * .26, EL: s * .26 * 1.6 };
    IK.sticker(c, s, x => {
      x.save(); x.translate(s * .5, s * .78); drawEngine(x, G.u, .4, 0); x.restore();
      x.save(); x.translate(0, 0);
      const fake = { col: 0 };
      void fake;
      x.restore();
      drawBlock(x, 'ب', 0, s * .26, s * .62, s * .26, true);
      drawBlock(x, 'a', 1, s * .26, s * .34, s * .22, false);
      const p = getPuff(); x.drawImage(p, s * .7, s * .1, s * .24, s * .24); x.drawImage(p, s * .8, s * .02, s * .16, s * .16);
    });
    dpr = sv; G = sg;
    IK.sparkle(c, s * .14, s * .14, 7);
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'قطار الكلمات', icon2: '🚂', isNew: false, music: 'letters',
    desc: () => App.g('اسمعي الكلمة وضعي حروفها في عربات القطار', 'اسمع الكلمة وضع حروفها في عربات القطار'),
    help: () => [
      '🔊 ' + App.g('اسمعي', 'اسمع') + ' الكلمة و' + App.g('انظري', 'انظر') + ' إلى صورتها فوق القاطرة',
      '👆 ' + App.g('اسحبي', 'اسحب') + ' الحروف إلى العربات بالترتيب، أول حرف بجانب القاطرة',
      '❌ الحرف الخطأ يرجع إلى مكانه، و' + App.g('المسي', 'المس') + ' الحرف ' + App.g('لتسمعي', 'لتسمع') + ' اسمه',
      '🚂 عندما تكتمل الكلمة يصفر القطار وينطلق!',
      '🌍 ' + App.g('اختاري', 'اختر') + ' «عربي» أو «English» من الأعلى'
    ],
    icon,
    best() {
      const pr = loadProg(); let n = 0, st = 0;
      for (const l of ['ar', 'en']) for (const k in pr[l].stars) { if (pr[l].stars[k]) { n++; st += pr[l].stars[k]; } }
      return n ? `🚂 ${n} مستوى · ⭐ ${st}` : '';
    },
    enter() {
      paused = false; measureSafe();
      lang = store.get('wordtrainLang', 'ar') === 'en' ? 'en' : 'ar';
      ucase = !!store.get('wordtrainCase', false);
      paintLang(); bcache.clear(); bgKey = '';
      layout();
      startLevel(Math.min(loadProg()[lang].unlocked, NL));
      render();
      startLoop();
    },
    leave() { stopLoop(); clearTimers(); drag = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { const b = drag.b; drag = null; b.x = b.hx; b.y = b.hy; } },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() {
      return { lang, lvl, wi, n: words.length, phase, mistakes, tphase: train && train.phase, word: train && train.w,
        slots: train ? train.slots.map(s => ({ ch: s.ch, filled: !!s.b, ...slotPos(s) })) : [],
        blocks: blocks.map(b => ({ ch: b.ch, x: b.x, y: b.y, placed: !!b.placed, ready: T >= b.appear && !b.anim })) };
    }
  });
})();
