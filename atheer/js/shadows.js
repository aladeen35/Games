/* =====================================================================
   ظل من؟ — اسحب كل صورة ملوّنة إلى ظلّها الداكن
   (ثنائية اللغة: أسماء الحيوانات والفواكه والمركبات والألعاب والأدوات)
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'shadows';
  const TAU = Math.PI * 2;
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const FONT = '"Baloo Bhaijaan 2",system-ui,"Segoe UI",Tahoma,sans-serif';

  /* ---------- الصور وأسماؤها ---------- */
  const THEMES = {
    animals: [
      ['🐈', 'قطة', 'Cat'], ['🐕', 'كلب', 'Dog'], ['🐇', 'أرنب', 'Rabbit'], ['🦁', 'أسد', 'Lion'], ['🐘', 'فيل', 'Elephant'],
      ['🦒', 'زرافة', 'Giraffe'], ['🐢', 'سلحفاة', 'Turtle'], ['🦋', 'فراشة', 'Butterfly'], ['🐧', 'بطريق', 'Penguin'], ['🦆', 'بطة', 'Duck'],
      ['🦉', 'بومة', 'Owl'], ['🐎', 'حصان', 'Horse'], ['🐄', 'بقرة', 'Cow'], ['🐒', 'قرد', 'Monkey'], ['🐊', 'تمساح', 'Crocodile'],
      ['🐫', 'جمل', 'Camel'], ['🐬', 'دلفين', 'Dolphin'], ['🐳', 'حوت', 'Whale'], ['🐟', 'سمكة', 'Fish'], ['🐸', 'ضفدع', 'Frog'],
      ['🐌', 'حلزون', 'Snail'], ['🐑', 'خروف', 'Sheep'], ['🐐', 'عنزة', 'Goat'], ['🦓', 'حمار وحشي', 'Zebra'], ['🦀', 'سلطعون', 'Crab'],
      ['🐙', 'أخطبوط', 'Octopus'], ['🐝', 'نحلة', 'Bee'], ['🐞', 'دعسوقة', 'Ladybug'], ['🦕', 'ديناصور', 'Dinosaur'], ['🦈', 'قرش', 'Shark'],
      ['🦩', 'فلامنغو', 'Flamingo'], ['🦜', 'ببغاء', 'Parrot'], ['🐿️', 'سنجاب', 'Squirrel']
    ],
    fruits: [
      ['🍎', 'تفاحة', 'Apple'], ['🍌', 'موزة', 'Banana'], ['🍇', 'عنب', 'Grapes'], ['🍓', 'فراولة', 'Strawberry'], ['🍉', 'بطيخ', 'Watermelon'],
      ['🍐', 'كمثرى', 'Pear'], ['🍊', 'برتقالة', 'Orange'], ['🍋', 'ليمونة', 'Lemon'], ['🍒', 'كرز', 'Cherries'], ['🍍', 'أناناس', 'Pineapple'],
      ['🥕', 'جزرة', 'Carrot'], ['🌽', 'ذرة', 'Corn'], ['🥝', 'كيوي', 'Kiwi'], ['🍑', 'خوخ', 'Peach'], ['🥭', 'مانجو', 'Mango'], ['🥥', 'جوز الهند', 'Coconut']
    ],
    vehicles: [
      ['🚗', 'سيارة', 'Car'], ['🚌', 'حافلة', 'Bus'], ['🚀', 'صاروخ', 'Rocket'], ['✈️', 'طائرة', 'Airplane'], ['🚲', 'دراجة', 'Bicycle'],
      ['⛵', 'قارب', 'Boat'], ['🚢', 'سفينة', 'Ship'], ['🚂', 'قطار', 'Train'], ['🚁', 'مروحية', 'Helicopter'], ['🚑', 'سيارة إسعاف', 'Ambulance'],
      ['🚒', 'سيارة إطفاء', 'Fire truck'], ['🏍️', 'دراجة نارية', 'Motorbike'], ['🚜', 'جرار', 'Tractor'], ['🛸', 'صحن طائر', 'UFO']
    ],
    toys: [
      ['⚽', 'كرة', 'Ball'], ['🧸', 'دبدوب', 'Teddy bear'], ['🎈', 'بالون', 'Balloon'], ['🪁', 'طائرة ورقية', 'Kite'], ['🪀', 'يويو', 'Yo-yo'],
      ['🎲', 'نرد', 'Dice'], ['🧩', 'أحجية', 'Puzzle'], ['🥁', 'طبل', 'Drum'], ['🎸', 'جيتار', 'Guitar'], ['🎁', 'هدية', 'Gift'],
      ['🪆', 'دمية', 'Doll'], ['🛴', 'سكوتر', 'Scooter'], ['🎺', 'بوق', 'Trumpet'], ['🎨', 'ألوان', 'Paints']
    ],
    tools: [
      ['🔨', 'مطرقة', 'Hammer'], ['🔧', 'مفتاح ربط', 'Wrench'], ['🪛', 'مفك', 'Screwdriver'], ['✂️', 'مقص', 'Scissors'], ['🪚', 'منشار', 'Saw'],
      ['🔑', 'مفتاح', 'Key'], ['📏', 'مسطرة', 'Ruler'], ['🖌️', 'فرشاة', 'Paintbrush'], ['✏️', 'قلم رصاص', 'Pencil'], ['🧹', 'مكنسة', 'Broom'],
      ['🪣', 'دلو', 'Bucket'], ['🔦', 'مصباح يدوي', 'Flashlight'], ['🧲', 'مغناطيس', 'Magnet'], ['🪜', 'سلم', 'Ladder']
    ]
  };
  /* مجموعات متشابهة الظلال (للمستويات الصعبة) */
  const SIMS = {
    animals: [['🐎', '🦓', '🐄', '🐑', '🐐', '🐫', '🐕', '🐈'], ['🐬', '🐳', '🦈', '🐟', '🐊', '🐢', '🐸', '🐙']],
    fruits: [['🍎', '🍑', '🍊', '🥭', '🍋', '🍐', '🥝', '🍒']]
  };
  const ITEMS = {};
  for (const [th, list] of Object.entries(THEMES)) for (const [e, ar, en] of list) ITEMS[e] = { e, ar, en, th };

  const LEVELS = [
    { ic: '🐈', th: 'animals', n: 3 },
    { ic: '🍎', th: 'fruits', n: 3 },
    { ic: '🚗', th: 'vehicles', n: 3 },
    { ic: '🧸', th: 'toys', n: 3 },
    { ic: '🔨', th: 'tools', n: 3 },
    { ic: '🐘', th: 'animals', n: 4 },
    { ic: '🍌', th: 'fruits', n: 4 },
    { ic: '🚀', th: 'vehicles', n: 4, dec: 1 },
    { ic: '🎈', th: 'toys', n: 4, size: 1 },
    { ic: '✂️', th: 'tools', n: 4, dec: 1 },
    { ic: '🦒', th: 'animals', n: 5, size: 1 },
    { ic: '🍇', th: 'fruits', n: 5, rot: 25 },
    { ic: '🚂', th: 'vehicles', n: 5, size: 1, rot: 20 },
    { ic: '🐕', th: 'animals', n: 5, sim: 1, dec: 1 },
    { ic: '🔑', th: 'tools', n: 5, dec: 1, rot: 35 },
    { ic: '🍑', th: 'fruits', n: 5, sim: 1, dec: 1 },
    { ic: '🎲', th: 'toys', n: 6, size: 1, rot: 30 },
    { ic: '🐬', th: 'animals', n: 6, sim: 1, dec: 2, rot: 30 },
    { ic: '🌈', th: 'mix', n: 6, dec: 2, size: 1, rot: 45 },
    { ic: '🏆', th: 'mix', n: 6, dec: 2, size: 1, rot: 90 }
  ];

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h == null ? w : h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  };
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const RESF = () => Math.min(3, Math.max(1, window.devicePixelRatio || 1));
  const AR_D = '٠١٢٣٤٥٦٧٨٩';
  let lang = 'ar';
  const num = n => lang === 'ar' ? String(n).replace(/\d/g, d => AR_D[d]) : String(n);
  const nameOf = e => ITEMS[e][lang];
  const loadProg = () => { const p = store.get('shadowsProg', null) || {}; return { unlocked: Math.max(1, p.unlocked || 1), stars: p.stars || {} }; };

  function emojiCanvas(e, size, res) {
    const P = 2 * Math.ceil(size * .75 * res), c = mk(P, P), x = c.getContext('2d');
    x.direction = 'ltr'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    let fs = size * res;
    x.font = `${fs}px ${EMOJI_FONT}`;
    let m = x.measureText(e);
    const bw = m2 => (m2.actualBoundingBoxLeft || 0) + (m2.actualBoundingBoxRight || m2.width), bh = m2 => (m2.actualBoundingBoxAscent || fs * .8) + (m2.actualBoundingBoxDescent || fs * .2);
    fs *= Math.min(1.4, size * res / Math.max(bw(m), bh(m), 1));
    x.font = `${fs}px ${EMOJI_FONT}`; m = x.measureText(e);
    const L = m.actualBoundingBoxLeft || 0, R = m.actualBoundingBoxRight || m.width;
    const A = m.actualBoundingBoxAscent || fs * .8, D = m.actualBoundingBoxDescent || fs * .2;
    x.fillText(e, Math.round((P - (L + R)) / 2 + L), Math.round((P - (A + D)) / 2 + A));
    return c;
  }
  /* هل يعرض الجهاز هذا الإيموجي؟ نقارنه برمز غير موجود (المربع الفارغ) */
  const emoOK = new Map();
  let tofu = null;
  function glyphData(e) {
    const c = mk(32, 32), x = c.getContext('2d', { willReadFrequently: true });
    x.font = `26px ${EMOJI_FONT}`; x.textBaseline = 'middle'; x.textAlign = 'center'; x.fillText(e, 16, 17);
    return x.getImageData(0, 0, 32, 32).data;
  }
  function emojiOK(e) {
    if (emoOK.has(e)) return emoOK.get(e);
    let ok = true;
    try {
      if (!tofu) tofu = glyphData('\u{10FFFD}');
      const d = glyphData(e); let diff = 0, ink = 0, colr = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 40) { ink++; if (Math.max(d[i], d[i + 1], d[i + 2]) - Math.min(d[i], d[i + 1], d[i + 2]) > 24) colr++; }
        if (Math.abs(d[i + 3] - tofu[i + 3]) > 40) diff++;
      }
      ok = ink > 40 && diff > 20 && colr > 8;
    } catch (er) { ok = true; }
    emoOK.set(e, ok); return ok;
  }
  function tint(src, style) {
    const c = mk(src.width, src.height), x = c.getContext('2d');
    x.drawImage(src, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = style; x.fillRect(0, 0, c.width, c.height);
    x.globalCompositeOperation = 'source-over';
    return c;
  }
  function dilate(src, d) {
    const c = mk(src.width, src.height), x = c.getContext('2d');
    for (const f of [1, .5]) for (let i = 0; i < 24; i++) { const a = i * TAU / 24; x.drawImage(src, Math.cos(a) * d * f, Math.sin(a) * d * f); }
    x.drawImage(src, 0, 0);
    return tint(c, '#000');
  }
  function rim(x, mask, color, ox, oy) {
    const t = mk(mask.width, mask.height), c = t.getContext('2d');
    c.drawImage(mask, 0, 0); c.globalCompositeOperation = 'destination-out'; c.drawImage(mask, ox, oy);
    c.globalCompositeOperation = 'source-in'; c.fillStyle = color; c.fillRect(0, 0, t.width, t.height);
    x.drawImage(t, 0, 0);
  }

  /* الملصق الملوّن والظل الداكن لكل صورة — بدقة حتى 3x */
  const SPR = new Map();
  function bake(e, size) {
    const res = RESF(), key = e + '|' + Math.round(size) + '|' + res;
    let s = SPR.get(key); if (s) return s;
    const emo = emojiCanvas(e, size, res), P = emo.width + Math.ceil(size * .3 * res) * 2, o = (P - emo.width) / 2;
    const base = mk(P, P); base.getContext('2d').drawImage(emo, o, o);
    // ملصق: حافة بيضاء سميكة + ظل ناعم + الصورة
    const outline = dilate(base, size * .06 * res);
    const st = mk(P, P), sx = st.getContext('2d');
    sx.save(); sx.shadowColor = 'rgba(40,30,90,.35)'; sx.shadowBlur = size * .08 * res; sx.shadowOffsetY = size * .05 * res;
    sx.drawImage(tint(outline, '#FFFFFF'), 0, 0); sx.restore();
    rim(sx, outline, 'rgba(150,140,200,.35)', 0, -size * .02 * res);
    sx.drawImage(base, 0, 0);
    // الظل: الصورة نفسها مصبوغة بلون داكن متدرّج مع لمعة خفيفة على الحافة العليا
    const g = sx.createLinearGradient(0, o, 0, P - o); g.addColorStop(0, '#4A3F93'); g.addColorStop(1, '#221A55');
    const sil = tint(base, g), lx = sil.getContext('2d');
    rim(lx, base, 'rgba(255,255,255,.16)', 0, size * .025 * res);
    s = { st, sil, P, sz: P / res };
    if (SPR.size > 260) SPR.clear();
    SPR.set(key, s); return s;
  }

  /* ---------- الواجهة ---------- */
  App.css(`
  #shadows{background:#DDF4FF;overflow:hidden}
  #shadows canvas.sc2{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #shadows .ib{color:#3E4FC4}
  #shadows .ib.snd{color:#7A3E00}
  #shadows .lvbtn .cnt{background:#5865F2}
  #shadows .lang{display:flex;background:linear-gradient(180deg,#fff,#F0F3FB);border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;
    box-shadow:0 4px 0 rgba(30,40,110,.2),0 7px 12px rgba(30,40,110,.18)}
  #shadows .lang button{min-width:58px;padding:5px 12px;border-radius:99px;font-weight:900;font-size:17px;background:transparent;color:#3E4FC4;line-height:1.25;transition:transform .14s var(--press)}
  #shadows .lang button.on{background:linear-gradient(180deg,#8F9BFF,#5865F2 70%);color:#fff;box-shadow:0 3px 0 #3A45C0,inset 0 2px 0 rgba(255,255,255,.35);text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #shadows .lang button:active{transform:scale(.93)}
  #shadows .foot{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;gap:10px;z-index:5;pointer-events:none;
    padding:4px max(14px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left))}
  #shadows .foot > *{pointer-events:auto}
  #shadows .say{width:58px;height:58px;flex:0 0 58px;font-size:27px}
  #shadows .prog{display:flex;gap:5px;background:rgba(255,255,255,.92);padding:8px 12px;border-radius:99px;border:3px solid #fff;direction:ltr;
    box-shadow:0 4px 0 rgba(30,40,110,.14),0 7px 12px rgba(30,40,110,.12)}
  #shadows .prog i{width:24px;height:13px;border-radius:99px;background:#D5DBEE;box-shadow:inset 0 2px 0 rgba(0,0,0,.08);transition:background .3s}
  #shadows .prog i.on{background:linear-gradient(#FFC660,#FF9124);box-shadow:0 2px 0 #D06A00,inset 0 2px 0 rgba(255,255,255,.45)}
  #shadows .hint{top:auto}
  #shadows .hint span{background:#fff;color:#3341B8;border:3px solid #CBD2FF;box-shadow:0 3px 0 #A9B3F5}
  #shadows .panel{border-color:#CBD2FF;box-shadow:0 10px 0 #7F8BF2,0 24px 44px rgba(20,20,90,.32),inset 0 0 0 3px #fff;color:#27318A;background:linear-gradient(180deg,#fff 0%,#fff 70%,#EEF1FF 100%)}
  #shadows .panel h3{color:#4652E0;text-shadow:0 3px 0 #DDE2FF}
  #shadows .btn{background:linear-gradient(180deg,#8F9BFF 0%,#6370F5 55%,#4D59E0 100%);box-shadow:0 5px 0 #3A45C0,0 9px 14px rgba(58,69,192,.3);text-shadow:0 2px 0 rgba(10,0,120,.25)}
  #shadows .btn:active{box-shadow:0 1px 0 #3A45C0}
  #shadows .btn.alt{background:linear-gradient(180deg,#fff,#F2F4FF);color:#4652E0;box-shadow:0 5px 0 #CBD2FF,0 8px 12px rgba(58,69,192,.14);border-color:#E1E5FF;text-shadow:none}
  #shadows .overlay{background:radial-gradient(circle at 50% 45%,rgba(30,40,140,.25),rgba(15,20,80,.5))}
  #shadows .lvp{width:min(94vw,440px);max-height:86vh;overflow-y:auto;touch-action:pan-y}
  #shadows .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:10px 0 12px}
  #shadows .lvb{position:relative;aspect-ratio:1;border-radius:22px;background:linear-gradient(180deg,#fff,#EEF1FF);border:3px solid #C3CBFF;box-shadow:0 5px 0 #98A3F2,inset 0 2px 0 #fff;
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#2B36A0;font-weight:900;padding:2px;transition:transform .14s var(--press)}
  #shadows .lvb:active{transform:translateY(3px) scale(1.04,.94);box-shadow:0 1px 0 #98A3F2}
  #shadows .lvb .n{font-size:14px;position:absolute;top:2px;right:8px;opacity:.8}
  #shadows .lvb .e{font-size:27px;line-height:1.15}
  #shadows .lvb .e.sh{filter:brightness(0) opacity(.75)}
  #shadows .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:12px}
  #shadows .lvb .s i{font-style:normal}
  #shadows .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #shadows .lvb.cur{border-color:#FF9124;box-shadow:0 5px 0 #D06A00,inset 0 2px 0 #fff}
  #shadows .lvb.lock{background:linear-gradient(#ECEEF5,#D8DCEA);border-color:#CDD1E0;box-shadow:0 5px 0 #B3B8CC;color:#8088A0}
  #shadows .lvb.lock .e{filter:grayscale(1);opacity:.35;font-size:22px}
  #shadows .lvb.lock::after{content:'🔒';position:absolute;font-size:19px;bottom:3px}
  `);
  const root = App.section(ID, `
    <canvas class="sc2"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🔢<span class="cnt">1</span></button>
      <span class="grow"></span>
      <div class="lang" role="group" aria-label="لغة الكلمات"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="hint"><span class="hintT"></span></div>
    <div class="foot">
      <button class="ib snd say" aria-label="استمع">🔊</button>
      <span class="grow"></span>
      <div class="prog"></div>
    </div>
    <div class="overlay" id="sdLv"><div class="panel lvp"><h3>🔢 المستويات</h3><div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="sdWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc2');
  const bar = root.querySelector('.bar'), foot = root.querySelector('.foot');
  const hintEl = root.querySelector('.hint'), hintT = root.querySelector('.hintT');
  const lvOv = root.querySelector('#sdLv'), winOv = root.querySelector('#sdWin');
  const progEl = root.querySelector('.prog');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, portrait = true;
  let bgLayer = null, board = null, tray = null;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, mistakes = 0, over = false, tq = [];
  let slots = [], pics = [], drag = null, parts = [], rings = [], bubbles = [], shake = 0;
  let TS = 90, S = 70, PS = 70, hintOn = false;
  const later = (sec, fn) => tq.push({ t: sec, fn });

  /* ---------- التخطيط ---------- */
  function bestGrid(n, w, h) {
    let best = { cols: 1, rows: n, cell: 0 };
    for (let cols = 1; cols <= n; cols++) {
      const rows = Math.ceil(n / cols), cell = Math.min(w / cols, h / rows);
      if (cell > best.cell + .5) best = { cols, rows, cell };
    }
    return best;
  }
  function gridPts(n, r, gr, flip) {
    const pts = [], cw = r.w / gr.cols, ch = r.h / gr.rows;
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / gr.cols), inRow = row === gr.rows - 1 ? n - row * gr.cols : gr.cols;
      const col = i % gr.cols, off = (gr.cols - inRow) * cw / 2;
      let x = r.x + off + (col + .5) * cw; if (flip) x = r.x + r.w - (x - r.x);
      pts.push({ x, y: r.y + (row + .5) * ch });
    }
    return pts;
  }
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const top = bar.getBoundingClientRect().bottom + 6;
    const bottom = foot.getBoundingClientRect().top - 4;
    const avail = bottom - top;
    portrait = W / H < 1.05;
    if (portrait) {
      const cw = Math.min(W - 16, 640), x0 = (W - cw) / 2, bh = Math.round(avail * .57);
      board = { x: x0, y: top, w: cw, h: bh - 14 };
      tray = { x: x0, y: top + bh + 6, w: cw, h: avail - bh - 14 };
    } else {
      const aw = Math.min(W - 28, 1180), x0 = (W - aw) / 2, bw = Math.round(aw * .58);
      // الصور على اليمين (اتجاه القراءة العربي) والظلال على اليسار
      board = { x: x0, y: top, w: bw - 10, h: avail - 12 };
      tray = { x: x0 + bw + 6, y: top, w: aw - bw - 6, h: avail - 12 };
    }
    const m = slots.length || 3, n = pics.length || 3;
    const bi = { x: board.x + 18, y: board.y + 18, w: board.w - 36, h: board.h - 36 };
    const ti = { x: tray.x + 16, y: tray.y + 16, w: tray.w - 32, h: tray.h - 32 };
    const gb = bestGrid(m, bi.w, bi.h), gt = bestGrid(n, ti.w, ti.h);
    TS = Math.min(gb.cell * .92, 170);
    const L = LEVELS[lvl - 1] || {};
    S = TS * (L.size || L.rot ? .66 : .74);
    PS = Math.min(gt.cell * .74, TS * .86, 130);
    const sp = gridPts(m, bi, gb, true), pp = gridPts(n, ti, gt, true);
    slots.forEach((s, i) => { s.x = sp[i].x; s.y = sp[i].y; });
    pics.forEach((p, i) => {
      p.hx = pp[i].x; p.hy = pp[i].y;
      if (p.state === 'done') { const s = p.slot; p.x = s.x; p.y = s.y; }
      else if (p.state !== 'drag') { p.x = p.hx; p.y = p.hy; if (p.state !== 'intro') p.state = 'tray'; }
    });
    hintEl.style.top = (tray.y - 17) + 'px';
    hintEl.style.left = tray.x + 'px'; hintEl.style.right = (W - tray.x - tray.w) + 'px';
    buildBg();
  }
  function cardRect(x, r, col, dark, rad) {
    x.save(); x.shadowColor = 'rgba(30,40,110,.25)'; x.shadowBlur = 16 * dpr; x.shadowOffsetY = 8 * dpr;
    x.fillStyle = dark; x.beginPath(); x.roundRect(r.x, r.y + 7, r.w, r.h, rad); x.fill(); x.restore();
    x.fillStyle = dark; x.beginPath(); x.roundRect(r.x, r.y + 7, r.w, r.h, rad); x.fill();
    x.fillStyle = col; x.beginPath(); x.roundRect(r.x, r.y, r.w, r.h, rad); x.fill();
    const g = x.createLinearGradient(0, r.y, 0, r.y + r.h); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#F7F9FF');
    x.fillStyle = g; x.beginPath(); x.roundRect(r.x + 6, r.y + 6, r.w - 12, r.h - 12, rad - 6); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 2; x.beginPath(); x.roundRect(r.x + 2.5, r.y + 2.5, r.w - 5, r.h - 5, rad - 2); x.stroke();
  }
  function buildBg() {
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    let g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#8FDDF7'); g.addColorStop(.55, '#D3F2FF'); g.addColorStop(1, '#EAF9FF');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // شمس
    const sx = W * .14, sy = 70;
    g = x.createRadialGradient(sx, sy, 0, sx, sy, 150); g.addColorStop(0, 'rgba(255,240,170,.9)'); g.addColorStop(.3, 'rgba(255,230,140,.35)'); g.addColorStop(1, 'rgba(255,230,140,0)');
    x.fillStyle = g; x.fillRect(0, 0, W, H * .5);
    x.save(); x.translate(sx, sy); x.fillStyle = 'rgba(255,255,255,.18)';
    for (let i = 0; i < 12; i++) { x.rotate(TAU / 12); x.beginPath(); x.moveTo(0, 0); x.lineTo(-30, -Math.max(W, H)); x.lineTo(30, -Math.max(W, H)); x.closePath(); x.fill(); }
    x.restore();
    const R0 = rng(5);
    for (let i = 0; i < 5; i++) IK.cloud(x, R0() * W - 40, 50 + R0() * H * .5, 90 + R0() * 90, 'rgba(255,255,255,.9)', 'rgba(140,190,230,.35)');
    // تلال
    const hy = H * .72;
    [['#B8EBA0', 0, 60], ['#93DB7E', 40, 30]].forEach(([c, dy, amp], k) => {
      x.fillStyle = c; x.beginPath(); x.moveTo(0, H);
      for (let xx = 0; xx <= W + 20; xx += 20) x.lineTo(xx, hy + dy - Math.sin(xx * .006 + k * 2) * amp - amp);
      x.lineTo(W, H); x.fill();
    });
    // زهور صغيرة
    const R1 = rng(9);
    for (let i = 0; i < W / 30; i++) { const fx = R1() * W, fy = hy + 40 + R1() * (H - hy); x.fillStyle = ['#FF8FB8', '#FFE066', '#fff'][i % 3]; for (let k = 0; k < 5; k++) { x.beginPath(); x.arc(fx + Math.cos(k * TAU / 5) * 3, fy + Math.sin(k * TAU / 5) * 3, 2.4, 0, TAU); x.fill(); } }
    cardRect(x, board, '#8C98FF', '#5D69E6', 30);
    cardRect(x, tray, '#FFC560', '#E89520', 30);
    // بلاطات الظلال
    for (const s of slots) tile(x, s.x, s.y, TS, false);
    x.fillStyle = 'rgba(255,190,90,.12)';
    for (let yy = tray.y + 22; yy < tray.y + tray.h - 12; yy += 18) for (let xx = tray.x + 22 + ((yy / 18 | 0) % 2) * 9; xx < tray.x + tray.w - 14; xx += 18) { x.beginPath(); x.arc(xx, yy, 2.2, 0, TAU); x.fill(); }
  }
  function tile(x, cx, cy, ts, done, glow) {
    const h = ts / 2, rad = ts * .2;
    x.fillStyle = done ? '#BDEFC9' : '#DCE1FA'; x.beginPath(); x.roundRect(cx - h, cy - h + 4, ts, ts, rad); x.fill();
    const g = x.createLinearGradient(0, cy - h, 0, cy + h);
    if (done) { g.addColorStop(0, '#F2FFF5'); g.addColorStop(1, '#DDF8E4'); } else { g.addColorStop(0, '#F4F6FF'); g.addColorStop(1, '#E8ECFC'); }
    x.fillStyle = g; x.beginPath(); x.roundRect(cx - h, cy - h, ts, ts, rad); x.fill();
    x.lineWidth = 3; x.strokeStyle = done ? '#5BD27E' : glow ? '#FFB020' : '#C9D0F5'; x.beginPath(); x.roundRect(cx - h + 1.5, cy - h + 1.5, ts - 3, ts - 3, rad - 1); x.stroke();
  }

  /* ---------- المستويات ---------- */
  function pool(L) {
    let list = L.th === 'mix' ? Object.keys(ITEMS) : THEMES[L.th].map(a => a[0]);
    list = list.filter(emojiOK);
    const need = L.n + (L.dec || 0);
    if (L.sim && SIMS[L.th]) {
      const grp = shuffle(SIMS[L.th].map(g => g.filter(emojiOK)).filter(g => g.length >= need))[0];
      if (grp) return shuffle(grp.slice()).slice(0, need);
    }
    return shuffle(list).slice(0, need);
  }
  function startLevel(n) {
    lvl = clamp(n, 1, LEVELS.length);
    tq = []; winOv.classList.remove('on'); lvOv.classList.remove('on');
    const L = LEVELS[lvl - 1];
    const chosen = pool(L), pairs = chosen.slice(0, L.n), dec = chosen.slice(L.n);
    const rot = (L.rot || 0) * Math.PI / 180;
    slots = shuffle(chosen.map(e => ({ e, real: pairs.includes(e), x: 0, y: 0, rot: rot ? (Math.random() < .5 ? -1 : 1) * rand(rot * .45, rot) : 0,
      sc: L.size ? rand(.7, 1.14) : 1, flash: 0, wob: 0, done: false, glow: 0, hint: 0 })));
    pics = shuffle(pairs.map(e => ({ e, x: 0, y: 0, hx: 0, hy: 0, state: 'intro', a: 0, rot: 0, sc: 1, lift: 0, pop: 0, errs: 0, ph: Math.random() * TAU, slot: null })));
    pics.forEach((p, i) => { p.slot = slots.find(s => s.e === p.e); p.a = -.15 - i * .08; });
    mistakes = 0; over = false; drag = null; parts = []; rings = []; bubbles = [];
    layout();
    root.querySelector('.lvbtn .cnt').textContent = num(lvl);
    paintProg();
    hintOn = true; hintT.textContent = '👆 ' + App.g('اسحبي', 'اسحب') + ' كل صورة إلى ظلّها'; hintEl.style.opacity = 1;
    Sound.whoosh();
    later(.45, () => App.speak('ظل من؟'));
  }
  function paintProg() {
    const n = pics.length, d = pics.filter(p => p.state === 'done').length;
    progEl.innerHTML = Array.from({ length: n }, (_, i) => `<i class="${i < d ? 'on' : ''}"></i>`).join('');
  }
  function win() {
    over = true;
    const pr = loadProg();
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('shadowsProg', pr);
    for (let i = 0; i < 130; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 260), rot: rand(0, TAU), vr: rand(-8, 8),
      life: rand(2.5, 4), age: 0, s: rand(6, 11), c: ['#FF4D5A', '#FFD02B', '#3A86FF', '#3FC954', '#9A5BF5', '#FF66B2'][i % 6] });
    later(.9, () => { Sound.win(); App.speak(App.g('أحسنتِ!', 'أحسنت!')); });
    later(1.7, () => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنت!') + ' 🎉';
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wP').textContent = App.g('أنهيتِ', 'أنهيتَ') + ` المستوى ${num(lvl)}` + (mistakes ? ` · الأخطاء: ${num(mistakes)}` : ' دون أي خطأ! 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < LEVELS.length ? '' : 'none';
      winOv.classList.add('on');
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('shadows_first');
      if (!mistakes) App.achieve('shadows_perfect');
      if (LEVELS.every((_, i) => pr.stars[i + 1])) App.achieve('shadows_all');
    });
  }
  function openLevels() {
    const pr = loadProg();
    const g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}"><span class="n">${num(n)}</span><span class="e${s ? '' : ' sh'}">${L.ic}</span>
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
  root.querySelector('.say').addEventListener('click', () => {
    Sound.tap(); App.speak('ظل من؟');
    slots.forEach((s, i) => { if (!s.done) later(i * .08, () => { s.wob = 1; }); });
  });
  function paintLang() { root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang)); }
  root.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === lang) return;
    Sound.tap(); lang = b.dataset.l; store.set('shadows:lang', lang); paintLang();
    root.querySelector('.lvbtn .cnt').textContent = num(lvl);
    // نطق آخر صورة مطابقة باللغة الجديدة
    const d = slots.filter(s => s.done);
    if (d.length) { const s = d[d.length - 1]; s.pop = 1; App.speak(nameOf(s.e), lang); }
  }));

  /* ---------- الجسيمات ---------- */
  function sparkle(x, y, col) {
    for (let i = 0; i < 20; i++) {
      const a = rand(0, TAU), v = rand(90, 270);
      parts.push({ t: i % 3 ? 'star' : 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .9), age: 0, s: rand(5, 10), c: i % 2 ? '#FFE26B' : col });
    }
    rings.push({ x, y, age: 0, life: .5 });
  }
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  function bubble(text, x, y) { bubbles = bubbles.filter(b => b.age < b.life * .6); bubbles.push({ text, x, y, age: 0, life: 1.5 }); }

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  const blocked = () => App.current !== ID || paused || winOv.classList.contains('on') || lvOv.classList.contains('on');
  cv.addEventListener('pointerdown', e => {
    if (blocked() || drag) return;
    const m = pos(e);
    for (let i = pics.length - 1; i >= 0; i--) {
      const p = pics[i];
      if ((p.state === 'tray' || p.state === 'back') && Math.hypot(p.x - m.x, p.y - m.y) < Math.max(PS * .58, 30)) {
        try { cv.setPointerCapture(e.pointerId); } catch (er) {}
        drag = { p, id: e.pointerId, ox: p.x - m.x, oy: p.y - m.y, sx: m.x, sy: m.y, tx: p.x, ty: p.y, moved: false, t0: performance.now(), touch: e.pointerType !== 'mouse', lastX: m.x, vx: 0 };
        p.state = 'drag'; pics.splice(i, 1); pics.push(p);
        Sound.tone(520, .08, 'sine', .1, 260); vibrate(10);
        return;
      }
    }
    const s = slots.find(s => Math.abs(s.x - m.x) < TS / 2 && Math.abs(s.y - m.y) < TS / 2);
    if (s) {
      if (s.done) { s.pop = 1; Sound.pop(); App.speak(nameOf(s.e), lang); bubble(nameOf(s.e), s.x, s.y - TS * .62); }
      else { s.wob = 1; Sound.tone(300, .12, 'triangle', .1, -80); App.speak('ظل من؟'); }
    }
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const m = pos(e);
    if (!drag.moved && Math.hypot(m.x - drag.sx, m.y - drag.sy) > 8) { drag.moved = true; if (hintOn) { hintOn = false; hintEl.style.opacity = 0; } }
    drag.tx = m.x + drag.ox; drag.ty = m.y + drag.oy - (drag.touch && drag.moved ? PS * .25 : 0);
    drag.vx = drag.vx * .6 + (m.x - drag.lastX) * .4; drag.lastX = m.x;
  });
  function slotAt(x, y) {
    let best = null, bd = TS * .62;
    for (const s of slots) if (!s.done) { const d = Math.hypot(s.x - x, s.y - y); if (d < bd) { bd = d; best = s; } }
    return best;
  }
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag, p = d.p; drag = null;
    if (!d.moved && performance.now() - d.t0 < 400) {
      p.pop = 1; Sound.pop(); App.speak(nameOf(p.e), lang); bubble(nameOf(p.e), p.hx, p.hy - PS * .7);
      toTray(p, false); return;
    }
    tryDrop(p);
  };
  function tryDrop(p) {
    const s = slotAt(p.x, p.y);
    if (!s) { Sound.slide(); toTray(p, false); return; }
    if (s.e === p.e) { p.state = 'fly'; p.a = 0; p.fx = p.x; p.fy = p.y; p.frot = p.rot; p.fsc = p.sc; s.hint = 0; return; }
    mistakes++; p.errs++; s.flash = 1;
    Sound.error(); vibrate(35); shake = Math.max(shake, 4);
    if (p.errs >= 2) p.slot.hint = 3.5;
    App.speak(App.g('حاولي مرة أخرى', 'حاول مرة أخرى'));
    toTray(p, true);
  }
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', e => { if (drag && e.pointerId === drag.id) { const p = drag.p; drag = null; toTray(p, false); } });
  function toTray(p, wob) { p.state = 'back'; p.a = 0; p.fx = p.x; p.fy = p.y; p.wob = wob ? 1 : 0; }
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < LEVELS.length ? 'next' : 'levels'); return; }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? act('close') : openLevels(); }
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    for (let i = tq.length - 1; i >= 0; i--) { const q = tq[i]; q.t -= dt; if (q.t <= 0) { tq.splice(i, 1); q.fn(); } }
    const k = 1 - Math.exp(-dt * 28);
    for (const s of slots) { s.flash = Math.max(0, s.flash - dt * 1.6); s.wob = Math.max(0, s.wob - dt * 2.2); s.pop = Math.max(0, (s.pop || 0) - dt * 2.4); if (s.hint > 0) s.hint = Math.max(0, s.hint - dt); }
    for (const p of pics) {
      p.pop = Math.max(0, p.pop - dt * 2.6);
      if (p.state === 'intro') { p.a += dt / .35; if (p.a >= 1) { p.a = 1; p.state = 'tray'; } p.x = p.hx; p.y = p.hy; }
      else if (p.state === 'drag' && drag && drag.p === p) {
        p.x += (drag.tx - p.x) * k; p.y += (drag.ty - p.y) * k;
        p.rot += (clamp(drag.vx * .02, -.3, .3) - p.rot) * k * .5;
        p.lift += (1 - p.lift) * k * .6;
        const near = slotAt(p.x, p.y), tsc = drag.moved ? (S * (near ? near.sc : 1)) / PS * 1.06 : 1.1;
        p.sc += (tsc - p.sc) * k * .4;
      } else if (p.state === 'fly') {
        p.a += dt / .22; const t = Math.min(1, p.a), e = ease.outCubic(t), s = p.slot;
        p.x = p.fx + (s.x - p.fx) * e; p.y = p.fy + (s.y - p.fy) * e;
        p.rot = p.frot + (s.rot - p.frot) * e; p.sc = p.fsc + (S * s.sc / PS - p.fsc) * e; p.lift = 1 - e;
        if (t >= 1) {
          p.state = 'done'; s.done = true; s.pop = 1; p.x = s.x; p.y = s.y; p.lift = 0;
          Sound.thud(); Sound.pop(); vibrate(25); shake = Math.max(shake, 3);
          sparkle(s.x, s.y, '#7ED957'); App.speak(nameOf(p.e), lang); bubble(nameOf(p.e), s.x, s.y - TS * .62);
          paintProg();
          if (pics.every(q => q.state === 'done')) win();
        }
      } else if (p.state === 'back') {
        p.a += dt / (p.wob ? .55 : .36);
        const t = Math.min(1, p.a), tm = p.wob ? clamp((t - .3) / .7, 0, 1) : t, e = p.wob ? ease.outCubic(tm) : ease.outBack(tm);
        p.x = p.fx + (p.hx - p.fx) * e; p.y = p.fy + (p.hy - p.fy) * e;
        p.rot = p.wob ? Math.sin(t * 34) * .28 * (1 - t) : p.rot * (1 - k);
        p.lift += (0 - p.lift) * k * .5; p.sc += (1 - p.sc) * k * .5;
        if (t >= 1) { p.state = 'tray'; p.x = p.hx; p.y = p.hy; p.rot = 0; }
      } else if (p.state === 'tray') {
        p.x = p.hx; p.y = p.hy + Math.sin(T * 2.2 + p.ph) * 2;
        p.lift *= 1 - k; p.sc += (1 - p.sc) * k;
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
    for (let i = bubbles.length - 1; i >= 0; i--) { bubbles[i].age += dt; if (bubbles[i].age > bubbles[i].life) bubbles.splice(i, 1); }
    shake = Math.max(0, shake - dt * 18);
  }

  /* ---------- الرسم ---------- */
  function drawSprite(img, b, x, y, size, rot, sx, sy, alpha) {
    const k = size / (b.sz * (size > 0 ? 1 : 1)), h = b.sz / 2;
    ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(k * (sx || 1), k * (sy || 1));
    if (alpha != null) ctx.globalAlpha = alpha;
    ctx.drawImage(img, -h, -h, b.sz, b.sz); ctx.restore();
  }
  function bakeSize() { return Math.max(S * 1.16, PS * 1.12); }
  function render() {
    ctx.save();
    ctx.fillStyle = '#DDF4FF'; ctx.fillRect(0, 0, W, H);
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    const BZ = bakeSize();
    // الظلال
    for (const s of slots) {
      const b = bake(s.e, BZ), base = BZ / b.sz;
      let glow = 0;
      if (drag && drag.moved && !s.done) glow = clamp(1 - Math.hypot(drag.p.x - s.x, drag.p.y - s.y) / (TS * .9), 0, 1);
      if (s.hint > 0) glow = Math.max(glow, .5 + .5 * Math.sin(T * 8));
      if (s.done || glow > .02 || s.flash > 0) tile(ctx, s.x, s.y, TS, s.done, glow > .02);
      if (glow > .02) { ctx.save(); ctx.globalAlpha = glow * .6; ctx.fillStyle = '#FFF2A8'; ctx.beginPath(); ctx.roundRect(s.x - TS / 2 + 4, s.y - TS / 2 + 4, TS - 8, TS - 8, TS * .16); ctx.fill(); ctx.restore(); }
      const wob = Math.sin(s.wob * 18) * s.wob * .12, sq = Math.sin((1 - (s.pop || 0)) * Math.PI * 3) * (s.pop || 0) * .12;
      const sz = S * s.sc / BZ * b.sz;
      if (!s.done) {
        ctx.save(); if (s.flash > 0) ctx.translate(Math.sin(T * 50) * 5 * s.flash, 0);
        drawSprite(b.sil, b, s.x, s.y, sz, s.rot + wob, 1, 1, .92 - glow * .25);
        if (s.flash > 0) {
          ctx.globalAlpha = s.flash; ctx.strokeStyle = '#FF4B4B'; ctx.lineWidth = 6; ctx.lineCap = 'round'; const a = TS * .14;
          ctx.beginPath(); ctx.moveTo(s.x + TS * .3 - a, s.y - TS * .3 - a); ctx.lineTo(s.x + TS * .3 + a, s.y - TS * .3 + a); ctx.moveTo(s.x + TS * .3 + a, s.y - TS * .3 - a); ctx.lineTo(s.x + TS * .3 - a, s.y - TS * .3 + a); ctx.stroke();
        }
        ctx.restore();
      } else {
        drawSprite(b.st, b, s.x, s.y, sz, s.rot, 1 + sq, 1 - sq);
        // علامة صح
        const bx = s.x + TS * .36, by = s.y - TS * .36, br = Math.max(10, TS * .11);
        ctx.fillStyle = '#2FB863'; ctx.beginPath(); ctx.arc(bx, by + 2, br, 0, TAU); ctx.fill();
        ctx.fillStyle = '#4CD07A'; ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = br * .28; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(bx - br * .45, by); ctx.lineTo(bx - br * .1, by + br * .38); ctx.lineTo(bx + br * .48, by - br * .35); ctx.stroke();
        // اسم الصورة مكتوبًا
        const fs = Math.round(clamp(TS * .15, 12, 19));
        ctx.font = `900 ${fs}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = lang === 'ar' ? 'rtl' : 'ltr';
        const txt = nameOf(s.e), tw = Math.min(TS * 1.04, ctx.measureText(txt).width + 16), th = fs + 9, ty = s.y + TS / 2 - 2;
        ctx.fillStyle = '#2FB863'; ctx.beginPath(); ctx.roundRect(s.x - tw / 2, ty - th / 2 + 2.5, tw, th, th / 2); ctx.fill();
        ctx.fillStyle = '#4CD07A'; ctx.beginPath(); ctx.roundRect(s.x - tw / 2, ty - th / 2, tw, th, th / 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.fillText(txt, s.x, ty + 1, TS - 8);
      }
    }
    // الصور
    const drawPic = p => {
      const b = bake(p.e, BZ);
      const e0 = p.state === 'intro' ? (p.a <= 0 ? 0 : ease.outBack(p.a)) : 1;
      if (e0 <= 0) return;
      const sq = Math.sin((1 - p.pop) * Math.PI * 3) * p.pop * .13;
      const size = PS * p.sc * e0 / BZ * b.sz;
      if (p.lift > .02) {
        ctx.save(); ctx.globalAlpha = .22 * p.lift; ctx.fillStyle = '#1D2470';
        ctx.beginPath(); ctx.ellipse(p.x + 8, p.y + PS * p.sc * .48 + p.lift * 10, PS * p.sc * .38, PS * .1, 0, 0, TAU); ctx.fill(); ctx.restore();
      }
      drawSprite(b.st, b, p.x, p.y - p.lift * 4, size, p.rot, 1 + sq, 1 - sq);
    };
    for (const p of pics) if (p.state !== 'done' && p.state !== 'drag') drawPic(p);
    if (drag) drawPic(drag.p);
    for (const r of rings) {
      const t = r.age / r.life;
      ctx.save(); ctx.globalAlpha = 1 - t; ctx.strokeStyle = '#FFF4B0'; ctx.lineWidth = 6 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, TS * (.4 + t * .5), 0, TAU); ctx.stroke(); ctx.restore();
    }
    for (const q of parts) {
      const a = 1 - q.age / q.life;
      ctx.save(); ctx.globalAlpha = q.t === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillStyle = q.c;
      if (q.t === 'star') { starPath(ctx, q.s * (.6 + a * .5)); ctx.fill(); }
      else if (q.t === 'dot') { ctx.beginPath(); ctx.arc(0, 0, q.s * .45 * a + 1, 0, TAU); ctx.fill(); }
      else { ctx.scale(1, Math.cos(q.age * 9 + q.rot)); ctx.fillRect(-q.s / 2, -q.s * .3, q.s, q.s * .6); }
      ctx.restore();
    }
    for (const b of bubbles) {
      const t = b.age / b.life, sc = t < .15 ? ease.outBack(t / .15) : 1, al = t > .75 ? 1 - (t - .75) / .25 : 1;
      ctx.save(); ctx.globalAlpha = al; ctx.translate(clamp(b.x, 70, W - 70), Math.max(70, b.y - t * 14)); ctx.scale(sc, sc);
      ctx.font = `900 21px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = lang === 'ar' ? 'rtl' : 'ltr';
      const w = ctx.measureText(b.text).width + 32, h = 40;
      ctx.fillStyle = 'rgba(20,30,110,.2)'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2 + 4, w, h, h / 2); ctx.fill();
      ctx.fillStyle = '#5865F2'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(-w / 2 + 3.5, -h / 2 + 3.5, w - 7, h - 7, h / 2 - 3.5); ctx.fill();
      ctx.fillStyle = '#27318A'; ctx.fillText(b.text, 0, 2);
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
    if (App.current !== ID || !slots.length) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); if (!running) render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    IK.bg(c, s, ['#E3F7FF', '#8FDDF7', '#4A7BEA'], { seed: 21, rays: .1 });
    const e = '🐘', cs = s * .5;
    const em = emojiCanvas(e, cs, 2);
    // الظل
    const sil = tint(em, '#2A2263');
    c.save(); c.globalAlpha = .9; c.drawImage(sil, s * .42 - em.width / 4, s * .44 - em.height / 4, em.width / 2, em.height / 2); c.restore();
    // الصورة الملوّنة كملصق
    IK.sticker(c, s, x => { x.drawImage(em, s * .6 - em.width / 4, s * .62 - em.height / 4, em.width / 2, em.height / 2); }, { line: 4 });
    c.save(); c.font = `900 ${s * .2}px ${FONT}`; c.textAlign = 'center'; c.fillStyle = '#fff'; c.strokeStyle = '#3E4FC4'; c.lineWidth = s * .03;
    c.strokeText('؟', s * .24, s * .3); c.fillText('؟', s * .24, s * .3); c.restore();
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'ظل من؟', icon2: '👤', isNew: false, music: 'shapes',
    desc: () => App.g('طابقي كل صورة مع ظلّها', 'طابق كل صورة مع ظلّها'),
    help: () => [
      '👤 ' + App.g('انظري', 'انظر') + ' إلى الظلال الداكنة: لكل صورة ظلّ يشبهها تمامًا',
      '👆 ' + App.g('اسحبي', 'اسحب') + ' كل صورة ملوّنة وضعها فوق ظلّها',
      '🔤 زر «عربي / English» يغيّر لغة أسماء الصور',
      '🔊 ' + App.g('المسي', 'المس') + ' أي صورة ' + App.g('لتسمعي', 'لتسمع') + ' اسمها',
      '🧠 في المستويات المتقدّمة ظلال مائلة وبأحجام مختلفة وظلال زائدة لا صورة لها!'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 المستوى ${Math.max(...ks)} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      lang = store.get('shadows:lang', 'ar') === 'en' ? 'en' : 'ar';
      paintLang();
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, LEVELS.length));
      render();
      startLoop();
    },
    leave() { stopLoop(); tq = []; drag = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { const p = drag.p; drag = null; toTray(p, false); } },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() { return { lvl, mistakes, lang, TS, S, PS, slots: slots.map(s => ({ key: s.e, x: s.x, y: s.y, done: s.done, real: s.real })), pics: pics.map(p => ({ key: p.e, x: p.hx, y: p.hy, state: p.state })) }; }
  });
})();
