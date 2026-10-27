/* =====================================================================
   الميزان — ميزان كفّتين نحاسي كبير:
   أيهما أثقل/أخف، اجعل الكفتين متساويتين، الجمع بالأوزان (٣ + ؟ = ٥)،
   والمقارنة بالرموز > < = — ثنائي اللغة (عربي / English)
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'balance';
  const TAU = Math.PI * 2;
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';
  const AR_D = '٠١٢٣٤٥٦٧٨٩';
  const NUM_AR = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر', 'عشرون'];
  const NUM_EN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

  /* ---------- اللغة ---------- */
  let lang = 'ar';
  const en = () => lang === 'en';
  const N = n => en() ? String(n) : String(n).replace(/\d/g, d => AR_D[d]);
  const numWord = n => (en() ? NUM_EN : NUM_AR)[n] || String(n);
  const say = (ar, e) => { if (en()) App.speak(e, 'en'); else App.speak(ar); };
  const praise = () => say(App.g('أحسنتِ!', 'أحسنت!'), 'Well done!');
  const tryAgain = () => say(App.g('حاولي مرة أخرى.', 'حاول مرة أخرى.'), 'Try again!');

  /* ---------- المستويات ---------- */
  const ROUNDS = 5;
  const LEVELS = [
    { m: 'heavy', ask: 'heavy', kind: 'cube', max: 4, ic: '🧱' },
    { m: 'heavy', ask: 'both', kind: 'fruit', max: 6, ic: '🍓' },
    { m: 'heavy', ask: 'both', kind: 'obj', ic: '🐘' },
    { m: 'equal', kind: 'cube', max: 4, ic: '🧱' },
    { m: 'equal', kind: 'fruit', max: 6, ic: '🍎' },
    { m: 'equal', kind: 'wt', max: 8, ic: '🔢' },
    { m: 'add', max: 5, ic: '➕' },
    { m: 'add', max: 7, ic: '➕' },
    { m: 'add', max: 10, ic: '➕' },
    { m: 'cmp', max: 5, ic: '🐊' },
    { m: 'cmp', max: 10, ic: '🐊' },
    { m: 'mix', max: 8, ic: '⭐' }
  ];
  const MODE = {
    heavy: { t: 'أثقل؟', en: 'Heavier?', c: '#FF8A3D', d: '#D2600F' },
    equal: { t: 'توازن', en: 'Balance', c: '#3DBE6B', d: '#22863F' },
    add: { t: 'جمع', en: 'Add', c: '#3D9BFF', d: '#1F6FCC' },
    cmp: { t: '> < =', c: '#A86BFF', d: '#7140CF' },
    mix: { t: 'منوّع', en: 'Mixed', c: '#FF5FA2', d: '#D2357B' }
  };
  const FRUITS = [['🍎', 'تفاحة', 'apple'], ['🍊', 'برتقالة', 'orange'], ['🍓', 'فراولة', 'strawberry'], ['🍐', 'كمثرى', 'pear'], ['🍋', 'ليمونة', 'lemon'], ['🍑', 'خوخ', 'peach']];
  const OBJS = [[['🐘', 10], ['🐭', 1]], [['🍉', 6], ['🍒', 1]], [['🐄', 9], ['🐥', 1]], [['🎃', 5], ['🍓', 1]], [['🐻', 8], ['🐝', 1]], [['🦒', 9], ['🐞', 1]], [['🍍', 4], ['🍇', 1]]];
  const CUBE_COLS = ['#FF6B6B', '#FFC23C', '#4CC9F0', '#7ED957', '#B57BFF', '#FF85C0', '#FF9F43'];
  const WCOL = ['#FF6B6B', '#FF9F43', '#F6C026', '#6CCB4B', '#2EC4C9', '#4D8BFF', '#9B6BFF', '#FF6FB5', '#18B88F', '#F2603A'];

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    inQuad: t => t * t
  };
  const ri = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const shade = (h, f) => App.shade(h, f);
  const loadProg = () => { const p = store.get('balanceProg', null) || {}; return { unlocked: Math.max(1, p.unlocked || 1), stars: p.stars || {} }; };

  /* ---------- الواجهة ---------- */
  App.css(`
  #balance{background:#EFE8FF;overflow:hidden}
  #balance canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #balance .ib{color:#6A3FD1}
  #balance .lvbtn{position:relative}
  #balance .ib .cnt{background:#FF8A3D}
  #balance .lang{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 #CDBEF5,0 8px 14px rgba(70,40,140,.18);flex:0 0 auto}
  #balance .lang button{min-width:56px;padding:5px 11px;border-radius:99px;font-weight:900;font-size:16px;background:transparent;color:#7A5BC9;line-height:1.25;transition:transform .14s var(--press)}
  #balance .lang button.on{background:linear-gradient(#A88BFF,#6C4BE0);color:#fff;box-shadow:0 3px 0 #4B2DB0,inset 0 2px 0 rgba(255,255,255,.4);text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #balance .lang button:active{transform:scale(.92)}
  #balance .prm{position:absolute;z-index:4;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 58px);
    width:min(calc(100% - 24px),580px);display:flex;align-items:center;gap:10px;padding:8px 10px 9px 12px;border-radius:26px;background:linear-gradient(#fff,#FFFDF8);
    border:4px solid #FFC15A;box-shadow:0 6px 0 #EC9A22,0 12px 24px rgba(110,60,10,.18);cursor:pointer}
  #balance .prm.bump{animation:blBump .45s}
  #balance .prm.wig{animation:blWig .45s}
  @keyframes blBump{35%{transform:translateX(-50%) scale(1.05)}}
  @keyframes blWig{20%{transform:translateX(calc(-50% - 7px))}40%{transform:translateX(calc(-50% + 6px))}60%{transform:translateX(calc(-50% - 4px))}80%{transform:translateX(calc(-50% + 2px))}}
  #balance .pt{flex:1;min-width:0;color:#4A2A86}
  #balance .prog{display:flex;gap:4px;margin:0 0 5px;direction:rtl}
  #balance .prog i{flex:1;height:9px;border-radius:6px;background:#EFE8FF;box-shadow:inset 0 2px 2px rgba(60,30,120,.12)}
  #balance .prog i.on{background:linear-gradient(#FFE07A,#FFA51F);box-shadow:0 2px 0 #D98100}
  #balance .prog i.cur{background:#CDBDFF;animation:blPul 1s ease-in-out infinite}
  @keyframes blPul{50%{opacity:.5}}
  #balance .ptxt{display:block;font-size:clamp(21px,5.8vw,29px);font-weight:900;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #balance .ptxt bdi{direction:ltr;unicode-bidi:isolate;letter-spacing:1px}
  #balance .psub{display:block;font-size:14px;font-weight:700;opacity:.72;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #balance .spk{width:54px;height:54px;flex:0 0 54px;border-radius:50%;font-size:25px;display:grid;place-items:center;border:3px solid #fff;
    background:radial-gradient(circle at 36% 28%,#FFF6B8 0,#FFD84A 42%,#F5B400 100%);box-shadow:0 4px 0 #D08F00,0 7px 12px rgba(200,130,0,.35);transition:transform .14s var(--press)}
  #balance .spk:active{transform:translateY(3px) scale(1.06,.9)}
  #balance .spk.talk{animation:blTalk .5s ease-in-out 2}
  @keyframes blTalk{50%{transform:scale(1.12)}}
  #balance .panel{border-color:#E4D8FF;box-shadow:0 8px 0 #B9A3F2,0 20px 40px rgba(40,10,90,.3);color:#4A2A86}
  #balance .panel h3{color:#6C3FE0;text-shadow:0 3px 0 #E8DEFF}
  #balance .btn{background:linear-gradient(#FFB45C,#FF8A1F);box-shadow:0 5px 0 #CF5F12,0 8px 12px rgba(200,90,10,.25)}
  #balance .btn.alt{background:#fff;color:#6C3FE0;box-shadow:0 5px 0 #D9CCFA;border-color:#EDE5FF}
  #balance .btn:active{box-shadow:0 1px 0 #CF5F12}
  #balance .overlay{background:radial-gradient(circle at 50% 45%,rgba(80,40,150,.25),rgba(30,10,70,.5))}
  #balance .lvp{width:min(94vw,440px);max-height:88vh;overflow-y:auto;touch-action:pan-y}
  #balance .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:10px 0 14px}
  #balance .lvb{position:relative;aspect-ratio:.86;border-radius:22px;color:#fff;font-weight:900;padding:4px 2px 2px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;
    background:linear-gradient(180deg,var(--l),var(--c));border:3px solid #fff;box-shadow:0 5px 0 var(--d),0 8px 12px rgba(40,10,80,.18);transition:transform .14s var(--press)}
  #balance .lvb::after{content:'';position:absolute;top:3px;left:16%;right:16%;height:30%;border-radius:20px;background:linear-gradient(rgba(255,255,255,.55),rgba(255,255,255,0));pointer-events:none}
  #balance .lvb:active{transform:translateY(4px) scale(1.04,.94);box-shadow:0 1px 0 var(--d)}
  #balance .lvb .n{position:absolute;top:2px;right:8px;font-size:14px;text-shadow:0 1px 0 rgba(0,0,0,.25)}
  #balance .lvb .e{font-size:27px;line-height:1.1;filter:drop-shadow(0 2px 0 rgba(0,0,0,.15))}
  #balance .lvb .t{font-size:11.5px;line-height:1.2;text-shadow:0 1px 0 rgba(0,0,0,.25);direction:ltr}
  #balance .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:13px}
  #balance .lvb .s i{font-style:normal}
  #balance .lvb .s i.off{filter:grayscale(1) brightness(1.6);opacity:.45}
  #balance .lvb.cur{outline:4px solid #FFD84A;outline-offset:2px}
  #balance .lvb.lock{--c:#CFC6DD;--l:#E7E1F0;--d:#A99DBB;color:#8D82A0}
  #balance .lvb.lock .e{filter:grayscale(1);opacity:.4}
  #balance .lvb.lock::before{content:'🔒';position:absolute;bottom:4px;font-size:18px;z-index:2}
  #balance .lvb.lock .s,#balance .lvb.lock .t{visibility:hidden}
  #balance .lvb.lock::before{bottom:auto;top:50%;margin-top:4px}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية" data-al="Home">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة" data-al="Help">❓</button>
      <button class="ib lvbtn" aria-label="المستويات" data-al="Levels">🗺️<span class="cnt">1</span></button>
      <span class="grow"></span>
      <div class="lang" role="group" aria-label="اللغة" data-al="Language"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="prm" role="button" aria-label="إعادة السؤال" data-al="Repeat the question">
      <div class="pt"><div class="prog"></div><b class="ptxt"></b><span class="psub"></span></div>
      <button class="spk" aria-label="استمع" data-al="Listen">🔊</button>
    </div>
    <div class="overlay" id="blLv"><div class="panel lvp"><h3 data-en="⚖️ Levels">⚖️ المستويات</h3><div class="lvg"></div>
      <button class="btn alt" data-a="close" data-en="✕ Close">✕ إغلاق</button></div></div>
    <div class="overlay" id="blWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next" data-en="Next ▶️">التالي ▶️</button><br>
      <button class="btn alt" data-a="again" aria-label="من جديد" data-al="Restart">🔄</button><button class="btn alt" data-a="levels" data-en="🗺️ Levels">🗺️ المستويات</button><button class="btn alt home" aria-label="الرئيسية" data-al="Home">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const prm = root.querySelector('.prm'), ptxt = root.querySelector('.ptxt'), psub = root.querySelector('.psub'), progEl = root.querySelector('.prog'), spk = root.querySelector('.spk');
  const lvOv = root.querySelector('#blLv'), winOv = root.querySelector('#blWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1;
  let G = null;            // الأبعاد
  let bgLayer = null;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, round = 0, mistakes = 0, q = null, phase = 'idle', phT = 0, over = false, winTimer = 0;
  let items = [], ordC = 0, drag = null, parts = [], rings = [], shake = 0;
  let theta = 0, omega = 0, prevOmega = 0, supp = 0, suppTarget = 0, balHold = 0, creakT = 0;
  const pans = { L: { x: 0, y: 0, phi: 0, pv: 0, glow: 0, glowC: '#7CFF8A', mark: 0, ex: 0, ey: 0 }, R: { x: 0, y: 0, phi: 0, pv: 0, glow: 0, glowC: '#7CFF8A', mark: 0, ex: 0, ey: 0 } };
  let slot = null;         // خانة رمز المقارنة
  let eqBadge = 0, idle = 0, hintOn = false, trayMode = true;
  const emoCache = new Map();

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    emoCache.clear();
    const top = prm.getBoundingClientRect().bottom + 8, pad = Math.max(10, H * .012);
    const aw = Math.min(W - 20, 760), ax = (W - aw) / 2, avail = H - top - pad;
    const wide = W / H > 1.1;
    const balH = avail * (trayMode ? (wide ? .64 : .6) : (wide ? .8 : .68));
    const tableY = top + balH;
    const Lb = Math.min(aw * .36, balH * .62, 250);
    const pr = Lb * .42, bd = pr * .42, ry = pr * .28;
    const maxA = .27;
    const cs = Math.min(pr * .62, 52), ws = Math.min(pr * .9, 76);
    const panRest = tableY - bd - Lb * Math.sin(maxA) - Math.max(16, balH * .05);
    const dialR = Lb * .36;
    let Ls = clamp(panRest - top - dialR - 26, 70, Math.max(70, trayMode ? cs * 3.4 + 20 : avail * .3));
    const py = panRest - Ls;
    G = { top, pad, aw, ax, cx: W / 2, py, Lb, pr, bd, ry, Ls, tableY, maxA, cs, ws, dialR, bt: Math.max(9, Lb * .075), wide,
      tray: { x: ax + 6, y: tableY + 22, w: aw - 12, h: H - pad - tableY - 22 } };
    layoutTray();
    slot = { x: G.cx, y: panRest - ws * .3, s: Math.min(ws * .95, (Lb - pr) * 1.5), sym: null };
    buildBg();
  }
  function layoutTray() {
    const tr = G.tray, list = items.filter(i => i.ti >= 0);
    const n = Math.max(1, list.reduce((m, i) => Math.max(m, i.ti + 1), 0));
    const base = list.length ? Math.max(...list.map(i => i.s)) : G.cs;
    let sc = 1.3, cols = 1, rows = 1;
    for (; sc > .7; sc -= .05) {
      const cell = base * sc * 1.18;
      cols = Math.max(1, Math.min(n, Math.floor((tr.w - 16) / cell)));
      rows = Math.ceil(n / cols);
      if (rows * cell * 1.02 + 16 <= tr.h) break;
    }
    G.traySc = sc; G.trayCols = cols; G.trayRows = rows; G.trayN = n;
  }
  function traySlot(ti, s) {
    const tr = G.tray, cols = G.trayCols, rows = G.trayRows, n = G.trayN;
    const row = Math.floor(ti / cols), inRow = row === rows - 1 ? n - row * cols : cols, col = ti % cols;
    const cw = (tr.w - 16) / cols, ch = (tr.h - 12) / rows;
    const off = (cols - inRow) * cw / 2;
    // من اليمين لليسار (اتجاه القراءة العربي) في الوضع العربي
    const cx = en() ? tr.x + 8 + off + (col + .5) * cw : tr.x + tr.w - 8 - off - (col + .5) * cw;
    return { x: cx, y: tr.y + 6 + (row + .5) * ch + s * G.traySc * .5 };
  }

  /* ---------- الخلفية الثابتة ---------- */
  function buildBg() {
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const { tableY, tray: tr } = G;
    let g = x.createLinearGradient(0, 0, 0, tableY);
    g.addColorStop(0, '#CDBBFF'); g.addColorStop(.45, '#E7DCFF'); g.addColorStop(1, '#FFE6F1');
    x.fillStyle = g; x.fillRect(0, 0, W, tableY);
    // أشعة ناعمة
    x.save(); x.translate(W / 2, G.py - 30); x.fillStyle = 'rgba(255,255,255,.13)';
    for (let i = 0; i < 16; i++) { x.rotate(TAU / 16); x.beginPath(); x.moveTo(0, 0); x.lineTo(-90, -Math.max(W, H)); x.lineTo(90, -Math.max(W, H)); x.closePath(); x.fill(); }
    x.restore();
    g = x.createRadialGradient(W / 2, G.py, 10, W / 2, G.py, Math.max(W, H) * .6);
    g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, W, tableY);
    // فقاعات ضوء ونجوم
    const R = rng(11);
    for (let i = 0; i < 22; i++) {
      const bx = R() * W, by = R() * tableY * .95, br = 4 + R() * 16;
      x.fillStyle = `rgba(255,255,255,${.18 + R() * .3})`; x.beginPath(); x.arc(bx, by, br, 0, TAU); x.fill();
    }
    for (let i = 0; i < 9; i++) { x.save(); x.translate(R() * W, R() * tableY * .8); x.fillStyle = ['#FFE27A', '#FFB3D6', '#B9F0FF'][i % 3]; starPath(x, 4 + R() * 5); x.fill(); x.restore(); }
    // رفّ على الجدار مع أصص صغيرة
    // الطاولة
    const ty = tableY - 34;
    g = x.createLinearGradient(0, ty, 0, H);
    g.addColorStop(0, '#F2C58C'); g.addColorStop(.18, '#E8B172'); g.addColorStop(1, '#C98B4D');
    x.fillStyle = g; x.fillRect(0, ty, W, H - ty);
    x.fillStyle = 'rgba(255,255,255,.55)'; x.fillRect(0, ty, W, 3);
    x.fillStyle = 'rgba(120,70,20,.16)'; x.fillRect(0, ty + 3, W, 3);
    const R2 = rng(5);
    for (let yy = ty + 30, k = 0; yy < H; yy += 40 + k * 4, k++) {
      x.fillStyle = 'rgba(130,75,25,.13)'; x.fillRect(0, yy, W, 2);
      for (let j = 0; j < 4; j++) { x.strokeStyle = `rgba(150,90,35,${.05 + R2() * .08})`; x.lineWidth = 1; x.beginPath(); const y0 = yy + 8 + R2() * 24; x.moveTo(0, y0); for (let xx = 0; xx <= W; xx += 40) x.lineTo(xx, y0 + Math.sin(xx * .02 + j) * 2); x.stroke(); }
    }
    // ظل حافة الجدار
    g = x.createLinearGradient(0, ty - 26, 0, ty); g.addColorStop(0, 'rgba(90,40,120,0)'); g.addColorStop(1, 'rgba(90,40,120,.14)');
    x.fillStyle = g; x.fillRect(0, ty - 26, W, 26);
    // حصيرة الأوزان (لبّاد)
    if (tr.h > 30 && trayMode) {
      x.save(); x.shadowColor = 'rgba(90,50,10,.35)'; x.shadowBlur = 14; x.shadowOffsetY = 7;
      x.fillStyle = '#5C9E8E'; x.beginPath(); x.roundRect(tr.x, tr.y + 5, tr.w, tr.h - 2, 26); x.fill(); x.restore();
      g = x.createLinearGradient(0, tr.y, 0, tr.y + tr.h); g.addColorStop(0, '#8FE3CF'); g.addColorStop(1, '#5FC6B0');
      x.fillStyle = g; x.beginPath(); x.roundRect(tr.x, tr.y, tr.w, tr.h - 5, 26); x.fill();
      x.save(); x.beginPath(); x.roundRect(tr.x, tr.y, tr.w, tr.h - 5, 26); x.clip();
      x.fillStyle = 'rgba(255,255,255,.07)';
      for (let i = 0; i < tr.w * tr.h / 60; i++) x.fillRect(tr.x + R2() * tr.w, tr.y + R2() * tr.h, 1.5, 1.5);
      x.shadowColor = 'rgba(0,70,60,.45)'; x.shadowBlur = 12; x.shadowOffsetY = 4; x.lineWidth = 14; x.strokeStyle = '#000';
      x.beginPath(); x.roundRect(tr.x - 7, tr.y - 7, tr.w + 14, tr.h + 9, 32); x.stroke();
      x.restore();
      x.setLineDash([8, 6]); x.lineWidth = 2.5; x.strokeStyle = 'rgba(255,255,255,.6)';
      x.beginPath(); x.roundRect(tr.x + 8, tr.y + 8, tr.w - 16, tr.h - 21, 19); x.stroke(); x.setLineDash([]);
    }
  }

  /* ---------- رسم العناصر ---------- */
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  function emoji(e, size) {
    const key = e + '|' + Math.round(size) + '|' + dpr;
    let r = emoCache.get(key); if (r) return r;
    const P = 2 * Math.ceil(size * .7 * dpr), c = mk(P, P), x = c.getContext('2d');
    x.direction = 'ltr'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    let fs = size * dpr; x.font = `${fs}px ${EMOJI_FONT}`;
    let m = x.measureText(e);
    const bw = m2 => (m2.actualBoundingBoxLeft || 0) + (m2.actualBoundingBoxRight || m2.width), bh = m2 => (m2.actualBoundingBoxAscent || fs * .8) + (m2.actualBoundingBoxDescent || fs * .2);
    fs *= Math.min(1.4, size * dpr / Math.max(bw(m), bh(m), 1));
    x.font = `${fs}px ${EMOJI_FONT}`; m = x.measureText(e);
    const L = m.actualBoundingBoxLeft || 0, Rr = m.actualBoundingBoxRight || m.width, A = m.actualBoundingBoxAscent || fs * .8, D = m.actualBoundingBoxDescent || fs * .2;
    x.fillText(e, Math.round((P - (L + Rr)) / 2 + L), Math.round((P - (A + D)) / 2 + A));
    r = { c, s: P / dpr }; emoCache.set(key, r); return r;
  }
  /* مكعب لعبة بوجه لطيف (x,by: منتصف القاعدة) */
  function drawCube(c, x, by, s, col) {
    const f = s * .8, d = s * .2, x0 = x - (f + d) / 2, y0 = by - f, dk = shade(col, -.3), lt = shade(col, .45);
    c.lineJoin = 'round';
    // الجانب
    c.fillStyle = dk; c.beginPath(); c.moveTo(x0 + f - 2, y0 + 2); c.lineTo(x0 + f + d, y0 - d + 3); c.lineTo(x0 + f + d, by - d - 2); c.lineTo(x0 + f - 2, by - 2); c.closePath(); c.fill();
    // الأعلى
    let g = c.createLinearGradient(0, y0 - d, 0, y0); g.addColorStop(0, shade(col, .6)); g.addColorStop(1, lt);
    c.fillStyle = g; c.beginPath(); c.moveTo(x0 + 3, y0 + 1); c.lineTo(x0 + d + 2, y0 - d + 1); c.lineTo(x0 + f + d - 1, y0 - d + 1); c.lineTo(x0 + f - 2, y0 + 1); c.closePath(); c.fill();
    // الوجه
    g = c.createLinearGradient(x0, y0, x0 + f * .3, by); g.addColorStop(0, lt); g.addColorStop(.35, col); g.addColorStop(1, shade(col, -.12));
    c.fillStyle = g; c.beginPath(); c.roundRect(x0, y0, f, f, f * .16); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = Math.max(1, s * .035); c.beginPath(); c.roundRect(x0 + f * .08, y0 + f * .08, f * .84, f * .84, f * .12); c.stroke();
    // عينان وابتسامة
    c.fillStyle = '#3B2350';
    c.beginPath(); c.ellipse(x0 + f * .33, y0 + f * .44, f * .07, f * .09, 0, 0, TAU); c.ellipse(x0 + f * .67, y0 + f * .44, f * .07, f * .09, 0, 0, TAU); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(x0 + f * .35, y0 + f * .41, f * .025, 0, TAU); c.arc(x0 + f * .69, y0 + f * .41, f * .025, 0, TAU); c.fill();
    c.strokeStyle = '#3B2350'; c.lineWidth = Math.max(1.2, f * .05); c.lineCap = 'round';
    c.beginPath(); c.arc(x0 + f * .5, y0 + f * .58, f * .12, .2 * Math.PI, .8 * Math.PI); c.stroke();
    c.fillStyle = 'rgba(255,120,150,.45)'; c.beginPath(); c.arc(x0 + f * .2, y0 + f * .62, f * .07, 0, TAU); c.arc(x0 + f * .8, y0 + f * .62, f * .07, 0, TAU); c.fill();
  }
  /* ثقل معدني ملوّن برقم */
  function drawWeight(c, x, by, s, v) {
    const w = s, h = s * .62, tw = w * .7, col = WCOL[(v - 1) % WCOL.length], dk = shade(col, -.38), lt = shade(col, .5);
    const ty = by - h;
    // المقبض
    c.lineCap = 'round';
    c.lineWidth = s * .1; c.strokeStyle = '#6E6A7E'; c.beginPath(); c.arc(x, ty - s * .02, s * .16, Math.PI * 1.02, Math.PI * 1.98); c.stroke();
    c.lineWidth = s * .05; c.strokeStyle = '#D8D6E6'; c.beginPath(); c.arc(x, ty - s * .03, s * .16, Math.PI * 1.15, Math.PI * 1.5); c.stroke();
    // الجسم
    const body = () => {
      c.beginPath();
      c.moveTo(x - tw / 2, ty);
      c.lineTo(x + tw / 2, ty);
      c.quadraticCurveTo(x + tw / 2 + s * .04, ty, x + tw / 2 + s * .05, ty + s * .06);
      c.lineTo(x + w / 2, by - s * .08);
      c.quadraticCurveTo(x + w / 2 + s * .01, by, x + w / 2 - s * .08, by);
      c.lineTo(x - w / 2 + s * .08, by);
      c.quadraticCurveTo(x - w / 2 - s * .01, by, x - w / 2, by - s * .08);
      c.lineTo(x - tw / 2 - s * .05, ty + s * .06);
      c.quadraticCurveTo(x - tw / 2 - s * .04, ty, x - tw / 2, ty);
      c.closePath();
    };
    let g = c.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
    g.addColorStop(0, dk); g.addColorStop(.22, col); g.addColorStop(.42, lt); g.addColorStop(.62, col); g.addColorStop(1, dk);
    c.fillStyle = g; body(); c.fill();
    g = c.createLinearGradient(0, ty, 0, by); g.addColorStop(0, 'rgba(255,255,255,.18)'); g.addColorStop(.7, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.18)');
    c.fillStyle = g; body(); c.fill();
    // الوجه العلوي
    c.fillStyle = lt; c.beginPath(); c.ellipse(x, ty + s * .01, tw / 2 + s * .02, s * .055, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(x - tw * .12, ty, tw * .25, s * .022, 0, 0, TAU); c.fill();
    // الرقم
    c.font = `900 ${s * .44}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.lineJoin = 'round'; c.lineWidth = s * .1; c.strokeStyle = dk; const t = N(v), ny = by - h * .43 + (en() ? 0 : s * .03);
    c.strokeText(t, x, ny); c.fillStyle = '#fff'; c.fillText(t, x, ny);
  }
  /* لوح رمز المقارنة */
  function drawTile(c, x, by, s, sym, col) {
    const d = s * .1, y0 = by - s, dk = shade(col, -.35), lt = shade(col, .45);
    c.fillStyle = dk; c.beginPath(); c.roundRect(x - s / 2, y0 + d, s, s - d, s * .22); c.fill();
    let g = c.createLinearGradient(0, y0, 0, by - d); g.addColorStop(0, lt); g.addColorStop(.5, col); g.addColorStop(1, shade(col, -.1));
    c.fillStyle = g; c.beginPath(); c.roundRect(x - s / 2, y0, s, s - d, s * .22); c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.roundRect(x - s * .38, y0 + s * .06, s * .76, s * .22, s * .11); c.fill();
    symGlyph(c, x, y0 + (s - d) / 2, s * .5, sym, dk);
  }
  function symGlyph(c, x, y, s, sym, dk) {
    const path = () => {
      c.beginPath();
      if (sym === '<') { c.moveTo(x + s * .42, y - s * .42); c.lineTo(x - s * .42, y); c.lineTo(x + s * .42, y + s * .42); }
      else if (sym === '>') { c.moveTo(x - s * .42, y - s * .42); c.lineTo(x + s * .42, y); c.lineTo(x - s * .42, y + s * .42); }
      else { c.moveTo(x - s * .45, y - s * .2); c.lineTo(x + s * .45, y - s * .2); c.moveTo(x - s * .45, y + s * .2); c.lineTo(x + s * .45, y + s * .2); }
    };
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.lineWidth = s * .36; c.strokeStyle = dk; path(); c.stroke();
    c.lineWidth = s * .2; c.strokeStyle = '#fff'; path(); c.stroke();
  }
  function drawItem(c, it, x, by, sc) {
    const s = it.s * sc;
    // ظل
    if (it.state !== 'pan') {
      const lift = it.lift || 0;
      c.save(); c.globalAlpha = (.28 - lift * .1) * (it.alpha == null ? 1 : it.alpha); c.fillStyle = '#3A1E10';
      c.beginPath(); c.ellipse(x + lift * 8, by + 2 + lift * 18, s * .42 * (1 - lift * .2), s * .1, 0, 0, TAU); c.fill(); c.restore();
    }
    const sq = Math.sin((1 - it.pop) * Math.PI * 3) * it.pop * .16;
    c.save(); c.translate(x, by); if (it.rot) c.rotate(it.rot); c.scale(1 + sq, 1 - sq);
    if (it.alpha != null) c.globalAlpha = Math.max(0, it.alpha);
    if (it.kind === 'cube') drawCube(c, 0, 0, s, it.col);
    else if (it.kind === 'wt') drawWeight(c, 0, 0, s, it.v);
    else if (it.kind === 'tile') drawTile(c, 0, 0, s, it.sym, it.col);
    else { const e = emoji(it.e, s); c.drawImage(e.c, -e.s / 2, -e.s / 2 - s * .5, e.s, e.s); }
    if (it.hint > 0) {
      c.globalAlpha = .5 + .5 * Math.sin(T * 9); c.strokeStyle = '#FFF27A'; c.lineWidth = 5;
      c.beginPath(); c.roundRect(-s * .62, -s * 1.12, s * 1.24, s * 1.2, s * .25); c.stroke();
    }
    c.restore();
  }

  /* ---------- الميزان ---------- */
  function hook(side) {
    const sgn = side === 'L' ? -1 : 1, { cx, py, Lb, bt } = G;
    return { x: cx + Math.cos(theta) * Lb * sgn - Math.sin(theta) * bt * .2, y: py + Math.sin(theta) * Lb * sgn + Math.cos(theta) * bt * .2 };
  }
  function updPans() {
    for (const side of ['L', 'R']) {
      const p = pans[side], h = hook(side);
      p.ex = h.x; p.ey = h.y;
      p.x = h.x + Math.sin(p.phi) * G.Ls; p.y = h.y + Math.cos(p.phi) * G.Ls;
    }
  }
  function panList(side) { return items.filter(i => i.pan === side && (i.state === 'pan' || i.state === 'fly')).sort((a, b) => a.ord - b.ord); }
  function mass(side) { return items.reduce((m, i) => m + (i.pan === side && i.state === 'pan' ? i.v : 0), 0); }
  function panSlot(side, it) {
    const p = pans[side], list = panList(side), idx = Math.max(0, list.indexOf(it));
    const big = list.some(i => i.kind === 'wt' || i.kind === 'obj');
    const baseY = p.y + G.ry * .45;
    if (big) {
      // أوزان أو أجسام: جنبًا إلى جنب
      const n = list.length; let xx = 0; const tot = list.reduce((a, i) => a + i.s * .92, 0);
      let x0 = p.x - tot / 2;
      for (let k = 0; k < idx; k++) x0 += list[k].s * .92;
      xx = x0 + it.s * .46;
      return { x: n === 1 ? p.x : xx, y: baseY };
    }
    const cap = Math.max(2, Math.floor(G.pr * 1.9 / (it.s * .9)));
    const row = Math.floor(idx / cap), inRow = Math.min(cap, list.length - row * cap), col = idx % cap;
    const step = it.s * .88;
    return { x: p.x + (col - (inRow - 1) / 2) * step, y: baseY - row * it.s * .78 };
  }
  function drawStand(c) {
    const { cx, py, Lb, tableY, dialR } = G;
    const s = Lb / 140;
    // ظل
    c.save(); c.fillStyle = 'rgba(70,30,10,.25)'; c.beginPath(); c.ellipse(cx, tableY + 4, Lb * .55, 9 * s + 4, 0, 0, TAU); c.fill(); c.restore();
    // قاعدة مدرّجة
    const tier = (w, h, yb, c1, c2) => {
      let g = c.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
      g.addColorStop(0, shade(c2, -.25)); g.addColorStop(.35, c1); g.addColorStop(.6, shade(c1, .25)); g.addColorStop(1, shade(c2, -.3));
      c.fillStyle = g; c.beginPath(); c.roundRect(cx - w / 2, yb - h, w, h, Math.min(10, h * .45)); c.fill();
      c.fillStyle = shade(c1, .35); c.beginPath(); c.ellipse(cx, yb - h, w / 2 - 2, h * .32, 0, 0, TAU); c.fill();
      c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(cx - w * .12, yb - h - 1, w * .25, h * .1, 0, 0, TAU); c.fill();
    };
    tier(Lb * .95, 20 * s + 4, tableY + 4, '#B8733A', '#8C5226');
    tier(Lb * .62, 16 * s + 3, tableY - 14 * s - 2, '#D18D4C', '#9B5C2A');
    // العمود النحاسي
    const colTop = py, colBot = tableY - 28 * s - 4, cw = 15 * s + 4;
    let g = c.createLinearGradient(cx - cw / 2, 0, cx + cw / 2, 0);
    g.addColorStop(0, '#7A4A0A'); g.addColorStop(.25, '#E4B444'); g.addColorStop(.45, '#FFF0B0'); g.addColorStop(.7, '#D9A630'); g.addColorStop(1, '#6E420A');
    c.fillStyle = g; c.beginPath(); c.roundRect(cx - cw / 2, colTop, cw, colBot - colTop, cw / 2); c.fill();
    // حلقات زخرفية
    for (const [yy, k] of [[colBot - 4, 1.7], [colTop + (colBot - colTop) * .55, 1.35]]) {
      const rw = cw * k;
      g = c.createLinearGradient(cx - rw / 2, 0, cx + rw / 2, 0);
      g.addColorStop(0, '#80500F'); g.addColorStop(.4, '#FFE58A'); g.addColorStop(1, '#7A4A0A');
      c.fillStyle = g; c.beginPath(); c.roundRect(cx - rw / 2, yy - 6 * s, rw, 12 * s, 6 * s); c.fill();
    }
    // المؤشر والقرص
    const dy = py - G.bt * .2;
    c.save();
    c.shadowColor = 'rgba(80,40,0,.3)'; c.shadowBlur = 8; c.shadowOffsetY = 3;
    g = c.createLinearGradient(0, dy - dialR, 0, dy); g.addColorStop(0, '#FFE58A'); g.addColorStop(1, '#B07A1A');
    c.fillStyle = g; c.beginPath(); c.arc(cx, dy, dialR + 5, Math.PI, 0); c.closePath(); c.fill(); c.restore();
    c.fillStyle = '#FFFDF4'; c.beginPath(); c.arc(cx, dy, dialR, Math.PI, 0); c.closePath(); c.fill();
    // منطقة التوازن الخضراء
    c.lineWidth = dialR * .16; c.lineCap = 'butt';
    c.strokeStyle = '#FFB3B3'; c.beginPath(); c.arc(cx, dy, dialR * .78, Math.PI * 1.08, Math.PI * 1.42); c.stroke();
    c.beginPath(); c.arc(cx, dy, dialR * .78, Math.PI * 1.58, Math.PI * 1.92); c.stroke();
    c.strokeStyle = '#8FE08A'; c.beginPath(); c.arc(cx, dy, dialR * .78, Math.PI * 1.43, Math.PI * 1.57); c.stroke();
    c.strokeStyle = 'rgba(80,50,20,.55)'; c.lineWidth = 1.5; c.lineCap = 'round';
    for (let k = -5; k <= 5; k++) { const a = -Math.PI / 2 + k * .13, r1 = dialR * (k % 5 === 0 ? .52 : .62), r2 = dialR * .9; c.beginPath(); c.moveTo(cx + Math.cos(a) * r1, dy + Math.sin(a) * r1); c.lineTo(cx + Math.cos(a) * r2, dy + Math.sin(a) * r2); c.stroke(); }
    // الإبرة
    const na = -Math.PI / 2 + theta * 2.2;
    c.save(); c.translate(cx, dy); c.rotate(na + Math.PI / 2);
    c.fillStyle = '#E2453C'; c.beginPath(); c.moveTo(-dialR * .07, 0); c.lineTo(0, -dialR * .92); c.lineTo(dialR * .07, 0); c.closePath(); c.fill();
    c.restore();
  }
  function drawBeam(c) {
    const { cx, py, Lb, bt } = G;
    c.save(); c.translate(cx, py); c.rotate(theta);
    c.save(); c.shadowColor = 'rgba(70,30,0,.3)'; c.shadowBlur = 10; c.shadowOffsetY = 5;
    let g = c.createLinearGradient(0, -bt / 2, 0, bt / 2);
    g.addColorStop(0, '#FFF0B0'); g.addColorStop(.35, '#E8B444'); g.addColorStop(1, '#8A5A12');
    c.fillStyle = g; c.beginPath(); c.roundRect(-Lb - bt * .4, -bt / 2, Lb * 2 + bt * .8, bt, bt / 2); c.fill(); c.restore();
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.roundRect(-Lb + bt, -bt * .36, Lb * 2 - bt * 2, bt * .18, bt * .09); c.fill();
    // كرات الأطراف
    for (const sx of [-1, 1]) {
      const ex = sx * Lb;
      g = c.createRadialGradient(ex - bt * .25, -bt * .3, 1, ex, 0, bt * .8);
      g.addColorStop(0, '#FFF6CC'); g.addColorStop(.5, '#E2AE3A'); g.addColorStop(1, '#7A4A0A');
      c.fillStyle = g; c.beginPath(); c.arc(ex, 0, bt * .78, 0, TAU); c.fill();
    }
    // المحور مع جوهرة
    g = c.createRadialGradient(-bt * .3, -bt * .4, 1, 0, 0, bt * 1.3);
    g.addColorStop(0, '#FFF6CC'); g.addColorStop(.55, '#DDA436'); g.addColorStop(1, '#704208');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, bt * 1.25, 0, TAU); c.fill();
    g = c.createRadialGradient(-bt * .15, -bt * .2, 1, 0, 0, bt * .6);
    g.addColorStop(0, '#FFC4D8'); g.addColorStop(.5, '#FF3D7F'); g.addColorStop(1, '#A0124A');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, bt * .58, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(-bt * .2, -bt * .22, bt * .14, 0, TAU); c.fill();
    c.restore();
  }
  function chain(c, x1, y1, x2, y2) {
    c.lineCap = 'round';
    c.strokeStyle = '#8A5A12'; c.lineWidth = 3.2; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    c.strokeStyle = '#FFE08A'; c.lineWidth = 1.4; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.setLineDash([]);
  }
  function drawPan(c, side) {
    const p = pans[side], { pr, ry, bd } = G;
    const lx = p.x - pr * .95, rx = p.x + pr * .95;
    // السلاسل الخلفية
    chain(c, p.ex, p.ey, p.x + Math.sin(p.phi) * 2, p.y - ry * .9);
    // جسم الكفّة
    if (p.glow > .01) {
      c.save(); c.globalAlpha = p.glow; c.shadowColor = p.glowC; c.shadowBlur = 26;
      c.fillStyle = p.glowC; c.beginPath(); c.ellipse(p.x, p.y + bd * .3, pr * 1.08, ry + bd * .8, 0, 0, TAU); c.fill(); c.restore();
    }
    let g = c.createLinearGradient(lx, 0, rx, 0);
    g.addColorStop(0, '#8A5A12'); g.addColorStop(.3, '#F2C65A'); g.addColorStop(.5, '#FFF0B0'); g.addColorStop(.75, '#D9A630'); g.addColorStop(1, '#7A4A0A');
    c.fillStyle = g; c.beginPath(); c.moveTo(p.x - pr, p.y);
    c.bezierCurveTo(p.x - pr * .95, p.y + bd * 1.2, p.x + pr * .95, p.y + bd * 1.2, p.x + pr, p.y); c.closePath(); c.fill();
    // داخل الكفة
    g = c.createLinearGradient(0, p.y - ry, 0, p.y + ry);
    g.addColorStop(0, '#9C6A1C'); g.addColorStop(1, '#E7BA55');
    c.fillStyle = g; c.beginPath(); c.ellipse(p.x, p.y, pr, ry, 0, 0, TAU); c.fill();
    // العناصر
    for (const it of panList(side)) if (it.state === 'pan') { const sl = panSlot(side, it); drawItem(c, it, sl.x, sl.y, 1); }
    // الحافة الأمامية
    c.lineWidth = Math.max(3, pr * .07); c.strokeStyle = '#FFE58A';
    c.beginPath(); c.ellipse(p.x, p.y, pr, ry, 0, .05, Math.PI - .05); c.stroke();
    c.lineWidth = 1.5; c.strokeStyle = 'rgba(120,70,10,.6)'; c.beginPath(); c.ellipse(p.x, p.y + 1.5, pr, ry, 0, .05, Math.PI - .05); c.stroke();
    // السلاسل الأمامية
    chain(c, p.ex, p.ey, lx, p.y + 1); chain(c, p.ex, p.ey, rx, p.y + 1);
    c.fillStyle = '#C9902A'; c.beginPath(); c.arc(p.ex, p.ey, 4, 0, TAU); c.fill();
    // علامة الخطأ
    if (p.mark > .01) {
      c.save(); c.globalAlpha = Math.min(1, p.mark); c.translate(p.x, p.y - pr * .9); c.rotate(Math.sin(T * 25) * .08 * p.mark);
      c.strokeStyle = '#fff'; c.lineWidth = 13; c.lineCap = 'round'; const a = pr * .28;
      c.beginPath(); c.moveTo(-a, -a); c.lineTo(a, a); c.moveTo(a, -a); c.lineTo(-a, a); c.stroke();
      c.strokeStyle = '#FF4B4B'; c.lineWidth = 8; c.stroke(); c.restore();
    }
  }
  function drawSupports(c) {
    if (supp < .01) return;
    for (const side of ['L', 'R']) {
      const p = pans[side], sgn = side === 'L' ? -1 : 1;
      const out = (1 - supp) * G.pr * 1.4, a = supp;
      const top = p.y + G.bd * .9, bot = G.tableY + 4, w = G.pr * .62, x = p.x + sgn * out;
      if (bot - top < 6) continue;
      c.save(); c.globalAlpha = a;
      let g = c.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
      g.addColorStop(0, '#9A5B26'); g.addColorStop(.4, '#E9A660'); g.addColorStop(1, '#8C5020');
      c.fillStyle = g; c.beginPath(); c.roundRect(x - w / 2, top, w, bot - top, 7); c.fill();
      c.fillStyle = 'rgba(255,240,210,.4)'; c.fillRect(x - w / 2 + 4, top + 4, w - 8, 3);
      c.strokeStyle = 'rgba(110,60,20,.35)'; c.lineWidth = 1.5;
      for (let yy = top + 12; yy < bot - 4; yy += 11) { c.beginPath(); c.moveTo(x - w / 2 + 5, yy); c.quadraticCurveTo(x, yy + 3, x + w / 2 - 5, yy); c.stroke(); }
      c.restore();
    }
  }
  function drawSlot(c) {
    if (!slot || !q || q.m !== 'cmp') return;
    const s = slot.s, x = slot.x, y = slot.y;
    c.save();
    c.shadowColor = 'rgba(70,30,120,.25)'; c.shadowBlur = 10; c.shadowOffsetY = 4;
    c.fillStyle = 'rgba(255,255,255,.92)'; c.beginPath(); c.roundRect(x - s / 2 - 6, y - s / 2 - 6, s + 12, s + 12, s * .28); c.fill(); c.restore();
    if (!slot.sym) {
      c.setLineDash([7, 5]); c.lineWidth = 3; c.strokeStyle = `rgba(140,100,230,${.55 + .35 * Math.sin(T * 4)})`;
      c.beginPath(); c.roundRect(x - s / 2, y - s / 2, s, s, s * .22); c.stroke(); c.setLineDash([]);
      c.fillStyle = '#B59BF0'; c.font = `900 ${s * .55}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', x, y + s * .04);
    }
  }
  function drawGhost(c) {
    if (!q || q.m !== 'add' || phase === 'good') return;
    if (panList('L').length > 1) return;
    const fixed = panList('L')[0]; if (!fixed) return;
    const p = pans.L, s = G.ws, gx = p.x + s * .46, gy = p.y + G.ry * .45;
    c.save(); c.globalAlpha = .55 + .3 * Math.sin(T * 4);
    c.setLineDash([6, 5]); c.lineWidth = 2.5; c.strokeStyle = '#7A4DE0'; c.fillStyle = 'rgba(255,255,255,.5)';
    c.beginPath(); c.roundRect(gx - s * .42, gy - s * .64, s * .84, s * .62, s * .14); c.fill(); c.stroke(); c.setLineDash([]);
    c.fillStyle = '#7A4DE0'; c.font = `900 ${s * .4}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', gx, gy - s * .32);
    c.restore();
  }

  /* ---------- الجولات ---------- */
  function mkItem(kind, v, o = {}) {
    const s = kind === 'wt' ? G.ws * (o.big ? 1 : 1) : kind === 'tile' ? G.ws * .9 : kind === 'obj' ? o.size : G.cs;
    return Object.assign({ kind, v, s, state: 'tray', pan: null, ti: -1, fixed: false, x: 0, y: 0, fx: 0, fy: 0, t: 0, dur: .35, rot: 0, pop: 0, lift: 0, ord: ordC++, hint: 0 }, o, { s: o.s || s });
  }
  function toPanDrop(it, side, delay) { it.pan = side; it.state = 'fly'; it.drop = true; it.t = -delay; it.dur = .42; it.ord = ordC++; const sl = panSlot(side, it); it.fx = sl.x; it.fy = sl.y - G.Ls - 120; it.x = it.fx; it.y = it.fy; }
  function roundMode() {
    const L = LEVELS[lvl - 1];
    if (L.m !== 'mix') return { m: L.m, L };
    const seq = ['heavy', 'equal', 'add', 'cmp', pick(['add', 'cmp', 'equal'])];
    const m = seq[round % 5];
    return { m, L: { m, ask: 'both', kind: m === 'heavy' ? pick(['fruit', 'obj']) : m === 'equal' ? 'fruit' : undefined, max: m === 'equal' ? 6 : L.max } };
  }
  function newRound() {
    items = []; drag = null; parts.length = 0; slot.sym = null; balHold = 0; eqBadge = 0; idle = 0; hintOn = false;
    for (const s of ['L', 'R']) { pans[s].glow = 0; pans[s].mark = 0; }
    const { m, L } = roundMode();
    q = { m, L };
    const tm = m !== 'heavy';
    if (tm !== trayMode) { trayMode = tm; layout(); updPans(); }
    let delay = .1;
    if (m === 'heavy') {
      q.ask = L.ask === 'both' ? (Math.random() < .5 ? 'heavy' : 'light') : L.ask;
      if (L.kind === 'obj') {
        const pr = pick(OBJS), sw = Math.random() < .5;
        const [hv, lt] = pr;
        const a = sw ? lt : hv, b = sw ? hv : lt;
        const sz = o => G.pr * (o[1] >= 4 ? 1.35 : .72);
        const ia = mkItem('obj', a[1], { e: a[0], s: sz(a), fixed: true }), ib = mkItem('obj', b[1], { e: b[0], s: sz(b), fixed: true });
        items.push(ia, ib); toPanDrop(ia, 'L', delay); toPanDrop(ib, 'R', delay + .25);
      } else {
        let a = ri(1, L.max), b = ri(1, L.max); while (b === a) b = ri(1, L.max);
        const fr = pick(FRUITS), c1 = pick(CUBE_COLS); let c2 = pick(CUBE_COLS); while (c2 === c1) c2 = pick(CUBE_COLS);
        const mkU = (col) => L.kind === 'cube' ? mkItem('cube', 1, { col, fixed: true }) : mkItem('fruit', 1, { e: fr[0], fixed: true });
        for (let i = 0; i < Math.max(a, b); i++) {
          if (i < a) { const it = mkU(c1); items.push(it); toPanDrop(it, 'L', delay); delay += .12; }
          if (i < b) { const it = mkU(c2); items.push(it); toPanDrop(it, 'R', delay); delay += .12; }
        }
        q.a = a; q.b = b;
      }
      supp = 1; suppTarget = 1;
    } else if (m === 'equal') {
      supp = 0; suppTarget = 0;
      if (L.kind === 'wt') {
        const a = ri(3, L.max); q.a = a; q.unit = 'cube';
        const w = mkItem('wt', a, { fixed: true }); items.push(w); toPanDrop(w, 'L', delay);
        const col = pick(CUBE_COLS);
        const n = Math.min(10, a + 2);
        for (let i = 0; i < n; i++) items.push(mkItem('cube', 1, { col, ti: i, state: 'back' }));
        q.addSide = 'R';
      } else {
        const a = ri(2, L.max), b = ri(0, Math.max(0, a - 2)); q.a = a; q.b = b; q.unit = L.kind === 'cube' ? 'cubes' : 'fruit';
        const fr = pick(FRUITS), col = pick(CUBE_COLS);
        q.fruit = fr;
        const mkU = (o) => L.kind === 'cube' ? mkItem('cube', 1, Object.assign({ col }, o)) : mkItem('fruit', 1, Object.assign({ e: fr[0] }, o));
        const leftSide = Math.random() < .5 ? 'L' : 'R', other = leftSide === 'L' ? 'R' : 'L';
        for (let i = 0; i < a; i++) { const it = mkU({ fixed: true }); items.push(it); toPanDrop(it, leftSide, delay); delay += .1; }
        for (let i = 0; i < b; i++) { const it = mkU({ fixed: true }); items.push(it); toPanDrop(it, other, delay); delay += .1; }
        const n = Math.min(9, a - b + 2);
        for (let i = 0; i < n; i++) items.push(mkU({ ti: i, state: 'back' }));
        q.addSide = other;
      }
    } else if (m === 'add') {
      supp = 0; suppTarget = 0;
      const c = ri(2, L.max), a = ri(1, c - 1), b = c - a; q.a = a; q.b = b; q.c = c;
      const wa = mkItem('wt', a, { fixed: true }), wc = mkItem('wt', c, { fixed: true });
      items.push(wa, wc); toPanDrop(wa, 'L', delay); toPanDrop(wc, 'R', delay + .3);
      const opts = new Set([b]); let guard = 0;
      while (opts.size < 3 && guard++ < 50) { const d = clamp(b + ri(-3, 3), 1, Math.max(3, L.max - 1)); opts.add(d); }
      [...opts].sort((x, y) => x - y).forEach((v, i) => items.push(mkItem('wt', v, { ti: i, state: 'back' })));
    } else if (m === 'cmp') {
      supp = 0; suppTarget = 0;
      let a = ri(1, L.max), b = Math.random() < .22 ? a : ri(1, L.max);
      q.a = a; q.b = b; q.ans = a > b ? '>' : a < b ? '<' : '=';
      const wa = mkItem('wt', a, { fixed: true }), wb = mkItem('wt', b, { fixed: true });
      items.push(wa, wb); toPanDrop(wa, 'L', delay); toPanDrop(wb, 'R', delay + .3);
      ['<', '=', '>'].forEach((sym, i) => items.push(mkItem('tile', 0, { sym, col: ['#FF8A3D', '#3DBE6B', '#3D9BFF'][i], ti: i, state: 'back' })));
    }
    layoutTray();
    items.filter(i => i.state === 'back').forEach((it, k) => { const t = traySlot(it.ti, it.s); it.fx = t.x; it.fy = H + 80; it.x = it.fx; it.y = it.fy; it.t = -.35 - k * .06; it.dur = .5; });
    phase = 'intro'; phT = 0;
    if (m !== 'heavy') { theta = theta * .5; }
    paintPrompt(); paintProg();
    Sound.whoosh();
  }

  /* ---------- لوحة السؤال ---------- */
  function eqHTML(a, b, c, fill) { return `<bdi dir="ltr">${N(a)} + ${fill ? N(b) : '؟'.replace('؟', en() ? '?' : '؟')} = ${N(c)}</bdi>`; }
  function paintPrompt() {
    if (!q) return;
    const m = q.m; let main = '', sub = '';
    if (m === 'heavy') {
      const hv = q.ask === 'heavy';
      main = en() ? (hv ? 'Which is heavier?' : 'Which is lighter?') : (hv ? 'أيهما أثقل؟' : 'أيهما أخف؟');
      sub = '👆 ' + (hv ? App.t(App.g('المسي الكفّة الأثقل', 'المس الكفّة الأثقل'), 'Tap the heavier pan') : App.t(App.g('المسي الكفّة الأخف', 'المس الكفّة الأخف'), 'Tap the lighter pan'));
    } else if (m === 'equal') {
      main = en() ? 'Make both sides equal' : App.g('اجعلي الكفّتين متساويتين', 'اجعل الكفّتين متساويتين');
      sub = '👆 ' + App.t(App.g('اسحبي', 'اسحب') + (q.unit === 'fruit' ? ' الفواكه' : ' المكعبات') + ' إلى الكفّة', 'Drag the ' + (q.unit === 'fruit' ? 'fruit' : 'blocks') + ' onto the pan');
    } else if (m === 'add') {
      main = eqHTML(q.a, q.b, q.c, phase === 'good');
      sub = App.lang === 'en' ? 'What is the missing weight? · 👆 Drag it onto the pan' : (en() ? 'What is the missing weight? · ' : '') + '👆 ' + App.g('اسحبي', 'اسحب') + ' الوزن الناقص إلى الكفّة';
    } else if (m === 'cmp') {
      const s = phase === 'good' ? q.ans : '؟';
      main = `<bdi dir="ltr">${N(q.a)} ${s === '؟' && en() ? '?' : s} ${N(q.b)}</bdi>`;
      sub = '👆 ' + App.t(App.g('اختاري', 'اختر') + ' الرمز الصحيح:', 'Choose the right sign:') + ' <bdi>&gt; &lt; =</bdi>';
    }
    ptxt.innerHTML = main; ptxt.dir = en() && m !== 'add' && m !== 'cmp' ? 'ltr' : 'rtl';
    psub.innerHTML = sub;
  }
  function paintProg() {
    progEl.innerHTML = Array.from({ length: ROUNDS }, (_, i) => `<i class="${i < round ? 'on' : i === round ? 'cur' : ''}"></i>`).join('');
    root.querySelector('.lvbtn .cnt').textContent = N(lvl);
  }
  function askSpeak() {
    if (!q) return;
    spk.classList.remove('talk'); void spk.offsetWidth; spk.classList.add('talk');
    const m = q.m;
    if (m === 'heavy') { const hv = q.ask === 'heavy'; say(hv ? 'أيهما أثقل؟' : 'أيهما أخف؟', hv ? 'Which is heavier?' : 'Which is lighter?'); }
    else if (m === 'equal') say(App.g('اجعلي الكفتين متساويتين', 'اجعل الكفتين متساويتين'), 'Make both sides equal');
    else if (m === 'add') say('ما الوزن الناقص؟', 'What is the missing weight?');
    else if (m === 'cmp') say(App.g('اختاري الرمز الصحيح', 'اختر الرمز الصحيح'), 'Choose the right sign');
  }
  function cmpSentence(a, sym, b) {
    if (en()) return [NUM_EN[a], sym === '>' ? 'is greater than' : sym === '<' ? 'is less than' : 'equals', NUM_EN[b]].join(' ');
    return [NUM_AR[a], sym === '>' ? 'أكبر من' : sym === '<' ? 'أصغر من' : 'يساوي', NUM_AR[b]].join(' ');
  }

  /* ---------- النجاح والخطأ ---------- */
  function good(delayNext = 1.7) {
    phase = 'good'; phT = 0; q.next = delayNext;
    Sound.win(); vibrate(25);
    const c = { x: G.cx, y: G.py };
    burst(c.x, c.y - G.dialR * .5, 40, true);
    paintPrompt();
    prm.classList.remove('bump'); void prm.offsetWidth; prm.classList.add('bump');
  }
  function bad(side) {
    mistakes++; Sound.error(); vibrate(35); shake = 5;
    prm.classList.remove('wig'); void prm.offsetWidth; prm.classList.add('wig');
    if (side) pans[side].mark = 1.6;
  }
  function burst(x, y, n, conf) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU), v = rand(90, 300);
      parts.push({ t: conf && i % 3 === 0 ? 'conf' : i % 2 ? 'star' : 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, rot: rand(0, TAU), vr: rand(-7, 7), life: rand(.7, 1.3), age: 0, s: rand(5, 10),
        c: ['#FFD84A', '#FF6FB5', '#6CCB4B', '#4D8BFF', '#FF9F43', '#B57BFF'][i % 6] });
    }
    rings.push({ x, y, age: 0, life: .5, c: '#FFF4B0', r: G.pr });
  }
  function nextRound() {
    round++;
    if (round >= ROUNDS) { levelDone(); return; }
    newRound();
  }
  function levelDone() {
    over = true; phase = 'end';
    const pr = loadProg();
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1, prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('balanceProg', pr);
    for (let i = 0; i < 150; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 260), rot: rand(0, TAU), vr: rand(-8, 8), life: rand(2.5, 4), age: 0, s: rand(6, 11), c: ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9'][i % 6] });
    Sound.win(); paintProg();
    winTimer = setTimeout(() => {
      if (App.current !== ID) return;
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      winText();
      root.querySelector('[data-a="next"]').style.display = lvl < LEVELS.length ? '' : 'none';
      winOv.classList.add('on');
      praise();
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('balance_first');
      if (!mistakes) App.achieve('balance_perfect');
      if (LEVELS.every((_, i) => pr.stars[i + 1])) App.achieve('balance_all');
    }, 1000);
  }
  function winText() {
    const uN = n => App.lang === 'en' ? String(n) : String(n).replace(/\d/g, d => AR_D[d]);
    root.querySelector('.wT').textContent = App.t(App.g('أحسنتِ!', 'أحسنت!'), 'Well done!') + ' 🎉';
    root.querySelector('.wP').textContent = App.t(App.g('أنهيتِ', 'أنهيتَ') + ` المستوى ${uN(lvl)}` + (mistakes ? ` · الأخطاء: ${uN(mistakes)}` : ' دون أي خطأ! 💯'),
      `You finished level ${lvl}` + (mistakes ? ` · Mistakes: ${mistakes}` : ' with no mistakes! 💯'));
  }
  /** ترجمة نصوص الواجهة الثابتة (data-en للنص، data-al لوصف الزر) */
  function trUI() {
    root.querySelectorAll('[data-en]').forEach(e => { if (e.dataset.ar == null) e.dataset.ar = e.textContent; e.textContent = App.t(e.dataset.ar, e.dataset.en); });
    root.querySelectorAll('[data-al]').forEach(e => { if (e.dataset.aral == null) e.dataset.aral = e.getAttribute('aria-label'); e.setAttribute('aria-label', App.t(e.dataset.aral, e.dataset.al)); });
  }
  function startLevel(n) {
    lvl = clamp(n, 1, LEVELS.length); round = 0; mistakes = 0; over = false;
    clearTimeout(winTimer); winOv.classList.remove('on'); lvOv.classList.remove('on');
    theta = 0; omega = 0; for (const s of ['L', 'R']) { pans[s].phi = 0; pans[s].pv = 0; }
    updPans(); newRound();
  }
  function openLevels() {
    const pr = loadProg(), g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked, M = MODE[L.m];
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" style="--c:${M.c};--d:${M.d};--l:${shade(M.c, .35)}" aria-label="${App.t('المستوى', 'Level')} ${n}">
        <span class="n">${N(n)}</span><span class="e">${L.ic}</span><span class="t">${App.t(M.t, M.en)}</span>
        <span class="s">${[1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    g.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n); setTimeout(askSpeak, 900);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
  }

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function itemPos(it) { return { x: it.x, y: it.y, sc: it.state === 'tray' || it.state === 'back' ? G.traySc : it.sc || 1 }; }
  function hitItem(x, y) {
    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i]; if (it.fixed || it.locked) continue;
      if (!(it.state === 'tray' || (it.state === 'pan' && q.m === 'equal'))) continue;
      let px, py, sc;
      if (it.state === 'pan') { const sl = panSlot(it.pan, it); px = sl.x; py = sl.y; sc = 1; }
      else { px = it.x; py = it.y; sc = G.traySc; }
      const s = it.s * sc;
      if (Math.abs(x - px) < s * .6 && y < py + s * .2 && y > py - s * 1.15) return it;
    }
    return null;
  }
  function overPan(x, y) {
    let best = null, bd = 1e9;
    for (const side of ['L', 'R']) {
      const p = pans[side], dx = Math.abs(x - p.x);
      if (dx < G.pr * 1.35 && y > p.y - G.Ls * .95 && y < p.y + G.bd + 50) { if (dx < bd) { bd = dx; best = side; } }
    }
    return best;
  }
  function hitPanTap(x, y) {
    for (const side of ['L', 'R']) {
      const p = pans[side];
      const top = Math.min(p.y - G.pr * 1.4, ...panList(side).map(i => panSlot(side, i).y - i.s * 1.1));
      if (Math.abs(x - p.x) < G.pr * 1.2 && y > top - 10 && y < p.y + G.bd + 24) return side;
    }
    return null;
  }
  function interactive() { return App.current === ID && !paused && !winOv.classList.contains('on') && !lvOv.classList.contains('on') && phase === 'ask'; }
  cv.addEventListener('pointerdown', e => {
    if (!interactive() || drag) return;
    const m = pos(e); idle = 0; hintOn = false; items.forEach(i => i.hint = 0);
    if (q.m === 'heavy') {
      const side = hitPanTap(m.x, m.y);
      if (side) choosePan(side);
      return;
    }
    const it = hitItem(m.x, m.y);
    if (it) {
      try { cv.setPointerCapture(e.pointerId); } catch (er) {}
      let px = it.x, py = it.y;
      if (it.state === 'pan') { const sl = panSlot(it.pan, it); px = sl.x; py = sl.y; it.fromPan = it.pan; }
      it.x = px; it.y = py; it.sc = it.state === 'pan' ? 1 : G.traySc;
      it.state = 'drag'; it.pan = null; it.lift = 0;
      drag = { it, id: e.pointerId, ox: px - m.x, oy: py - m.y, sx: m.x, sy: m.y, tx: px, ty: py, moved: false, t0: performance.now(), touch: e.pointerType !== 'mouse' };
      items.splice(items.indexOf(it), 1); items.push(it);
      Sound.tone(520, .08, 'sine', .1, 260); vibrate(8);
    }
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const m = pos(e);
    if (!drag.moved && Math.hypot(m.x - drag.sx, m.y - drag.sy) > 8) drag.moved = true;
    drag.tx = m.x + drag.ox; drag.ty = m.y + drag.oy + (drag.touch && drag.moved ? -drag.it.s * .25 : 0);
  });
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag, it = d.it; drag = null;
    if (!d.moved && performance.now() - d.t0 < 380) {      // لمسة: يقفز إلى المكان المناسب
      if (it.fromPan) { it.fromPan = null; flyTray(it); return; }
      const side = q.m === 'equal' ? (q.addSide || lighter()) : q.m === 'add' ? 'L' : null;
      if (q.m === 'cmp') { placeTile(it); return; }
      if (side) { flyPan(it, side); return; }
      flyTray(it); return;
    }
    it.fromPan = null;
    if (q.m === 'cmp') {
      if (Math.hypot(it.x - slot.x, it.y - it.s * .5 - slot.y) < slot.s * 1.1) { placeTile(it); return; }
      flyTray(it); return;
    }
    const side = overPan(it.x, it.y - it.s * .4);
    if (side && (q.m === 'equal' || (q.m === 'add' && side === 'L' && panList('L').length < 2))) { flyPan(it, side); return; }
    if (side && q.m === 'add') { Sound.error(); }
    flyTray(it);
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);
  function lighter() { return mass('L') <= mass('R') ? 'L' : 'R'; }
  function flyTray(it) { it.state = 'back'; it.pan = null; it.t = 0; it.dur = .4; it.fx = it.x; it.fy = it.y; it.fsc = it.sc || 1; Sound.slide(); }
  function flyPan(it, side) {
    if (q.m === 'add' && panList('L').length >= 2) { flyTray(it); return; }
    it.pan = side; it.state = 'fly'; it.drop = false; it.t = 0; it.dur = .3; it.fx = it.x; it.fy = it.y; it.fsc = it.sc || G.traySc; it.ord = ordC++;
  }
  function placeTile(it) {
    it.state = 'slot'; it.t = 0; it.dur = .28; it.fx = it.x; it.fy = it.y; it.fsc = it.sc || G.traySc;
  }
  function choosePan(side) {
    phase = 'reveal'; phT = 0; q.chosen = side; suppTarget = 0;
    pans[side].glow = .6; pans[side].glowC = '#FFF27A';
    Sound.tap(); Sound.tone(300, .25, 'triangle', .12, -120, .1); vibrate(15);
  }

  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < LEVELS.length ? 'next' : 'levels'); return; }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? act('close') : openLevels(); return; }
    if (!interactive()) return;
    if (q.m === 'heavy' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) choosePan(e.key === 'ArrowLeft' ? 'L' : 'R');
    if (q.m === 'cmp' && ['<', '>', '='].includes(e.key)) { const t = items.find(i => i.kind === 'tile' && i.sym === e.key && i.state === 'tray'); if (t) { t.sc = G.traySc; placeTile(t); } }
    if ((q.m === 'add' || q.m === 'equal') && /^[0-9]$/.test(e.key)) {
      const t = items.find(i => i.state === 'tray' && (q.m === 'equal' || i.v === +e.key)); if (t) { t.sc = G.traySc; flyPan(t, q.m === 'add' ? 'L' : q.addSide); }
    }
  });
  function act(a) {
    Sound.tap();
    if (a === 'next') { startLevel(lvl + 1); setTimeout(askSpeak, 900); }
    else if (a === 'again') { startLevel(lvl); setTimeout(askSpeak, 900); }
    else if (a === 'levels') openLevels();
    else if (a === 'close') { lvOv.classList.remove('on'); if (over) winOv.classList.add('on'); }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });
  prm.addEventListener('click', () => { Sound.tap(); askSpeak(); });
  root.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l, true)));
  function setLang(l, user) {
    lang = l === 'en' ? 'en' : 'ar'; if (user) { store.set(ID + 'Lang', lang); Sound.tap(); }
    if (lvOv.classList.contains('on')) openLevels();
    root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
    if (G) { layoutTray(); }
    paintPrompt(); paintProg();
    if (user && q) askSpeak();
  }

  /* ---------- التحديث ---------- */
  function land(it) {
    it.state = 'pan'; it.pop = 1; it.drop = false;
    const side = it.pan, sgn = side === 'L' ? -1 : 1, p = pans[side];
    const k = 1 / (1 + (mass('L') + mass('R')) * .06);
    if (supp < .5) omega += sgn * (.35 + it.v * .05) * k;
    p.pv += (Math.random() - .5) * .8;
    if (it.kind === 'wt' || it.kind === 'obj') { Sound.tone(1650, .3, 'sine', .07); Sound.tone(2480, .22, 'sine', .04, 0, .01); Sound.thud(); }
    else if (it.kind === 'cube') { Sound.tone(560, .07, 'triangle', .12, -120); Sound.tone(1900, .16, 'sine', .04, 0, .01); }
    else { Sound.pop(); Sound.tone(1760, .18, 'sine', .04); }
    vibrate(10);
    const sl = panSlot(side, it);
    for (let i = 0; i < 6; i++) parts.push({ t: 'dot', x: sl.x + rand(-it.s * .4, it.s * .4), y: sl.y, vx: rand(-60, 60), vy: rand(-90, -20), rot: 0, vr: 0, life: rand(.3, .5), age: 0, s: rand(3, 5), c: '#FFF6D0' });
    if (phase === 'ask' && q.m === 'equal' && !it.fixed) {
      const cnt = panList(side).filter(i => i.state === 'pan').length;
      if (q.unit === 'cube' && side === q.addSide) say(NUM_AR[cnt], NUM_EN[cnt]);
      else if (q.unit !== 'cube') say(NUM_AR[cnt], NUM_EN[cnt]);
    }
    if (phase === 'ask' && q.m === 'add' && !it.fixed) { phase = 'check'; phT = 0; q.try = it; }
  }
  function update(dt) {
    T += dt; phT += dt;
    // دخول الجولة
    if (phase === 'intro') {
      const busy = items.some(i => i.state === 'fly' || i.state === 'back');
      if (!busy && phT > .5) { phase = 'ask'; phT = 0; askSpeak(); }
    }
    // الحامل
    supp += (suppTarget - supp) * Math.min(1, dt * 7);
    if (Math.abs(supp - suppTarget) < .01) supp = suppTarget;
    // الفيزياء
    const mL = mass('L'), mR = mass('R');
    let tgt = G.maxA * Math.tanh((mR - mL) * 1.25) * (1 - supp);
    const steps = 4, h = dt / steps;
    prevOmega = omega;
    for (let s = 0; s < steps; s++) {
      const acc = -34 * (theta - tgt) - 3.4 * omega;
      omega += acc * h; theta += omega * h;
    }
    if (supp > .98) { theta *= .8; omega *= .8; }
    const alpha = (omega - prevOmega) / Math.max(dt, 1e-3);
    for (const side of ['L', 'R']) {
      const p = pans[side];
      for (let s = 0; s < steps; s++) { const a = -16 * p.phi - 2.4 * p.pv - alpha * .035; p.pv += a * h; p.phi += p.pv * h; }
      p.phi = clamp(p.phi, -.35, .35);
      p.glow = Math.max(0, p.glow - dt * (phase === 'good' || phase === 'reveal' ? .15 : 1.2));
      p.mark = Math.max(0, p.mark - dt * .9);
    }
    updPans();
    creakT -= dt;
    if (Math.abs(omega) > .7 && creakT <= 0) { Sound.noise(.22, 380, 220, .045, 7); creakT = .6; }
    // العناصر
    const k = 1 - Math.exp(-dt * 26);
    for (const it of items) {
      it.pop = Math.max(0, it.pop - dt * 2.6);
      it.hint = Math.max(0, (it.hint || 0) - dt);
      if (it.state === 'drag' && drag && drag.it === it) {
        it.x += (drag.tx - it.x) * k; it.y += (drag.ty - it.y) * k;
        it.lift += (1 - it.lift) * k * .5; it.sc += (1.12 - it.sc) * k * .5;
        it.rot = Math.sin(T * 10) * .03;
      } else if (it.state === 'fly') {
        it.t += dt / it.dur; if (it.t < 0) continue;
        const t = Math.min(1, it.t), e = it.drop ? ease.inQuad(t) : ease.outCubic(t), sl = panSlot(it.pan, it);
        it.x = it.fx + (sl.x - it.fx) * e; it.y = it.fy + (sl.y - it.fy) * e;
        it.sc = it.drop ? 1 : (it.fsc || 1) + (1 - (it.fsc || 1)) * e; it.lift = 1 - e; it.rot = 0;
        if (t >= 1) land(it);
      } else if (it.state === 'back') {
        it.t += dt / it.dur; if (it.t < 0) continue;
        const t = Math.min(1, it.t), e = ease.outBack(t), sl = traySlot(it.ti, it.s);
        it.x = it.fx + (sl.x - it.fx) * e; it.y = it.fy + (sl.y - it.fy) * e;
        it.sc = (it.fsc || G.traySc) + (G.traySc - (it.fsc || G.traySc)) * Math.min(1, t * 1.5); it.lift = Math.max(0, it.lift - dt * 4); it.rot = 0;
        if (t >= 1) { it.state = 'tray'; it.sc = G.traySc; }
      } else if (it.state === 'tray') {
        const sl = traySlot(it.ti, it.s); it.x = sl.x; it.y = sl.y; it.sc = G.traySc; it.rot = 0; it.lift = 0;
      } else if (it.state === 'slot') {
        it.t += dt / it.dur; const t = Math.min(1, it.t), e = ease.outBack(t);
        const tx = slot.x, ty = slot.y + slot.s * .5 + slot.s * .05, ts = slot.s / it.s;
        it.x = it.fx + (tx - it.fx) * e; it.y = it.fy + (ty - it.fy) * e; it.sc = (it.fsc || 1) + (ts - (it.fsc || 1)) * Math.min(1, t);
        if (t >= 1 && !it.judged) judgeTile(it);
      } else if (it.state === 'gone') {
        it.alpha = (it.alpha == null ? 1 : it.alpha) - dt * 3;
      }
    }
    // منطق الأطوار
    if (phase === 'ask') {
      idle += dt;
      if (q.m === 'equal') {
        const busy = items.some(i => i.state === 'fly' || i.state === 'drag');
        if (!busy && mL === mR && Math.abs(theta) < .06 && Math.abs(omega) < .3) { balHold += dt; if (balHold > .25) equalDone(); }
        else balHold = 0;
      }
      if (idle > 7 && !hintOn) showHint();
    } else if (phase === 'reveal') {
      if (phT > 1.35 && !q.judged) {
        q.judged = true;
        const heavier = mR > mL ? 'R' : 'L', lighterS = heavier === 'L' ? 'R' : 'L';
        const want = q.ask === 'heavy' ? heavier : lighterS;
        if (q.chosen === want) { pans[want].glow = 1; pans[want].glowC = '#7CFF8A'; good(1.6); praise(); }
        else { bad(q.chosen); pans[want].glow = 1; pans[want].glowC = '#7CFF8A'; phase = 'good'; phT = 0; q.next = 2.2; tryAgain(); }
      }
    } else if (phase === 'check') {
      if (phT > 1.0) {
        if (mL === mR) { pans.L.glow = pans.R.glow = 1; pans.L.glowC = pans.R.glowC = '#7CFF8A'; eqBadge = 1; good(2.4); q.try.locked = true;
          say(`${NUM_AR[q.a]} زائد ${NUM_AR[q.b]} يساوي ${NUM_AR[q.c]}`, `${NUM_EN[q.a]} plus ${NUM_EN[q.b]} equals ${NUM_EN[q.c]}`); }
        else { bad('L'); tryAgain(); const t = q.try; t.sc = 1; t.x = panSlot('L', t).x; t.y = panSlot('L', t).y; flyTray(t); phase = 'ask'; phT = 0;
          if ((q.errs = (q.errs || 0) + 1) >= 2) items.forEach(i => { if (i.state !== 'pan' && i.v === q.b) i.hint = 3; }); }
      }
    } else if (phase === 'good') {
      eqBadge = Math.min(1, eqBadge + dt * 3 * (eqBadge > 0 ? 1 : 0));
      if (phT > q.next) {
        phase = 'out'; phT = 0;
        items.forEach(i => { if (i.state === 'pan' || i.state === 'fly') { const sl = panSlot(i.pan, i); i.x = sl.x; i.y = sl.y; i.sc = 1; } });
        items.forEach(i => { if (i.state !== 'gone') { i.state = 'gone'; i.alpha = 1; i.pan = null; } });
        Sound.whoosh();
      }
    } else if (phase === 'out') {
      eqBadge = Math.max(0, eqBadge - dt * 4);
      if (phT > .35) nextRound();
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.age += dt;
      if (p.age > p.life) { parts.splice(i, 1); continue; }
      if (p.t === 'conf') { p.vy = Math.min(p.vy + 120 * dt, 260); p.vx += Math.sin(T * 3 + i) * 40 * dt; }
      else { p.vx *= 1 - dt * 2.5; p.vy = p.vy * (1 - dt * 2.5) + 380 * dt; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    shake = Math.max(0, shake - dt * 18);
  }
  function equalDone() {
    pans.L.glow = pans.R.glow = 1; pans.L.glowC = pans.R.glowC = '#7CFF8A'; eqBadge = 1;
    items.forEach(i => i.locked = true);
    good(2.1);
    setTimeout(() => { if (App.current === ID) say('متساويتان!', 'Balanced!'); }, 450);
  }
  function judgeTile(it) {
    it.judged = true;
    if (it.sym === q.ans) {
      slot.sym = it.sym; it.locked = true; good(2.6);
      burst(slot.x, slot.y, 24, false);
      say(cmpSentence(q.a, q.ans, q.b), cmpSentence(q.a, q.ans, q.b));
    } else {
      bad(null); tryAgain(); it.judged = false; flyTray(it);
      q.errs = (q.errs || 0) + 1;
      if (q.errs >= 2) items.forEach(i => { if (i.kind === 'tile' && i.sym === q.ans) i.hint = 3; });
    }
  }
  function showHint() {
    hintOn = true;
    if (q.m === 'heavy') { const want = (mass('R') > mass('L')) === (q.ask === 'heavy') ? 'R' : 'L'; pans[want].glow = .5; pans[want].glowC = '#FFF27A'; }
    else if (q.m === 'add') items.forEach(i => { if (i.state === 'tray' && i.v === q.b) i.hint = 3; });
    else if (q.m === 'cmp') items.forEach(i => { if (i.kind === 'tile' && i.sym === q.ans) i.hint = 3; });
    else { const t = items.find(i => i.state === 'tray'); if (t) t.hint = 3; }
    idle = 0; hintOn = false;
  }

  /* ---------- الرسم ---------- */
  function render() {
    ctx.save();
    ctx.fillStyle = '#EFE8FF'; ctx.fillRect(0, 0, W, H);
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    drawSupports(ctx);
    drawStand(ctx);
    drawSlot(ctx);
    drawPan(ctx, 'L'); drawPan(ctx, 'R');
    drawBeam(ctx);
    drawGhost(ctx);
    // علامة التوازن
    if (eqBadge > .01) {
      const s = G.dialR * .9 * ease.outBack(Math.min(1, eqBadge)), y = G.py - G.dialR - s * .2;
      ctx.save(); ctx.translate(G.cx, y);
      ctx.shadowColor = 'rgba(30,120,40,.4)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
      const g = ctx.createRadialGradient(-s * .2, -s * .3, 2, 0, 0, s * .7); g.addColorStop(0, '#C6FFB0'); g.addColorStop(1, '#2FB24A');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, s * .62, 0, TAU); ctx.fill(); ctx.shadowColor = 'transparent';
      ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.stroke();
      symGlyph(ctx, 0, 0, s * .62, '=', '#1E7A30'); ctx.restore();
    }
    // عناصر الصينية والمتحركة
    const order = s => s === 'tray' ? 0 : s === 'back' ? 1 : s === 'slot' ? 2 : s === 'gone' ? 2 : s === 'fly' ? 3 : 4;
    const list = items.filter(i => i.state !== 'pan').sort((a, b) => order(a.state) - order(b.state));
    for (const it of list) {
      if (it.state === 'fly' && it.t < 0) continue;
      if (it.state === 'back' && it.t < 0) continue;
      if (it.state === 'gone') { if (it.alpha <= 0) continue; }
      if (it.state === 'gone') { drawItem(ctx, it, it.x, it.y - (1 - it.alpha) * 30, it.sc || 1); continue; }
      drawItem(ctx, it, it.x, it.y, it.sc || 1);
    }
    for (const r of rings) {
      const t = r.age / r.life;
      ctx.save(); ctx.globalAlpha = 1 - t; ctx.strokeStyle = r.c; ctx.lineWidth = 6 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r * (.4 + t * .8), 0, TAU); ctx.stroke(); ctx.restore();
    }
    for (const p of parts) {
      const a = 1 - p.age / p.life;
      ctx.save(); ctx.globalAlpha = p.t === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
      if (p.t === 'star') { starPath(ctx, p.s * (.6 + a * .5)); ctx.fill(); }
      else if (p.t === 'dot') { ctx.beginPath(); ctx.arc(0, 0, p.s * .45 * a + 1, 0, TAU); ctx.fill(); }
      else { ctx.scale(1, Math.cos(p.age * 9 + p.rot)); ctx.fillRect(-p.s / 2, -p.s * .3, p.s, p.s * .6); }
      ctx.restore();
    }
    // يد التلميح عند الاختيار
    if (phase === 'ask' && q && q.m === 'heavy' && round === 0 && lvl === 1 && idle > 1.5) {
      const side = Math.floor(T / 1.4) % 2 ? 'L' : 'R', p = pans[side], b = Math.abs(Math.sin(T * 4.4)) * 12;
      const e = emoji('👆', 40); ctx.globalAlpha = .9; ctx.drawImage(e.c, p.x - e.s / 2 + 10, p.y + G.bd + 4 + b, e.s, e.s); ctx.globalAlpha = 1;
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
    clearTimeout(resizeT); resizeT = setTimeout(() => {
      layout(); items.forEach(i => { if (i.kind === 'wt') i.s = G.ws; else if (i.kind === 'tile') i.s = G.ws * .9; else if (i.kind !== 'obj') i.s = G.cs; });
      layoutTray(); updPans(); if (!running) render();
    }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    IK.bg(c, s, ['#E9DEFF', '#B79CFF', '#7B55E6'], { seed: 4 });
    IK.shadow(c, s * .5, s * .84, s * .36, s * .07, .3);
    IK.sticker(c, s, x => {
      const cx = s * .5, py = s * .34, L = s * .3, th = -.2;
      // القاعدة والعمود
      let g = x.createLinearGradient(cx - s * .18, 0, cx + s * .18, 0); g.addColorStop(0, '#8C5226'); g.addColorStop(.5, '#E6A25C'); g.addColorStop(1, '#8C5226');
      x.fillStyle = g; x.beginPath(); x.roundRect(cx - s * .2, s * .76, s * .4, s * .08, s * .03); x.fill();
      g = x.createLinearGradient(cx - s * .03, 0, cx + s * .03, 0); g.addColorStop(0, '#7A4A0A'); g.addColorStop(.5, '#FFF0B0'); g.addColorStop(1, '#7A4A0A');
      x.fillStyle = g; x.fillRect(cx - s * .025, py, s * .05, s * .43);
      const ends = [-1, 1].map(k => ({ x: cx + Math.cos(th) * L * k, y: py + Math.sin(th) * L * k }));
      ends.forEach((e, i) => {
        const px = e.x, pyy = e.y + s * .22;
        x.strokeStyle = '#B07A1A'; x.lineWidth = s * .012;
        x.beginPath(); x.moveTo(e.x, e.y); x.lineTo(px - s * .12, pyy); x.moveTo(e.x, e.y); x.lineTo(px + s * .12, pyy); x.stroke();
        if (i === 1) { drawCubeIcon(x, px, pyy - s * .005, s * .1, '#FF6B6B'); drawCubeIcon(x, px - s * .05, pyy - s * .09, s * .09, '#4CC9F0'); drawCubeIcon(x, px + s * .055, pyy - s * .005, s * .1, '#FFC23C'); }
        else drawCubeIcon(x, px, pyy - s * .005, s * .1, '#7ED957');
        g = x.createLinearGradient(px - s * .13, 0, px + s * .13, 0); g.addColorStop(0, '#8A5A12'); g.addColorStop(.5, '#FFF0B0'); g.addColorStop(1, '#8A5A12');
        x.fillStyle = g; x.beginPath(); x.moveTo(px - s * .13, pyy); x.bezierCurveTo(px - s * .12, pyy + s * .07, px + s * .12, pyy + s * .07, px + s * .13, pyy); x.closePath(); x.fill();
      });
      x.save(); x.translate(cx, py); x.rotate(th);
      g = x.createLinearGradient(0, -s * .025, 0, s * .025); g.addColorStop(0, '#FFF0B0'); g.addColorStop(1, '#8A5A12');
      x.fillStyle = g; x.beginPath(); x.roundRect(-L - s * .02, -s * .022, L * 2 + s * .04, s * .044, s * .022); x.fill();
      x.fillStyle = '#FF3D7F'; x.beginPath(); x.arc(0, 0, s * .035, 0, TAU); x.fill();
      x.restore();
    });
    IK.sparkle(c, s * .8, s * .2, s * .06); IK.sparkle(c, s * .2, s * .26, s * .04);
  }
  function drawCubeIcon(x, cx, by, s, col) {
    x.fillStyle = shade(col, -.3); x.beginPath(); x.roundRect(cx - s / 2 + s * .12, by - s - s * .1, s, s, s * .15); x.fill();
    const g = x.createLinearGradient(0, by - s, 0, by); g.addColorStop(0, shade(col, .4)); g.addColorStop(1, col);
    x.fillStyle = g; x.beginPath(); x.roundRect(cx - s / 2, by - s, s, s, s * .15); x.fill();
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'الميزان', icon2: '⚖️', isNew: false, music: 'numbers',
    desc: () => App.g('وازني الكفّتين وتعلّمي الأكبر والأصغر', 'وازن الكفّتين وتعلّم الأكبر والأصغر'),
    titleEn: 'Balance',
    descEn: () => 'Balance the pans and learn bigger and smaller',
    helpEn: () => [
      '⚖️ The heavier pan goes down and the lighter one goes up',
      '👆 Tap the heavier or lighter pan, or drag things onto a pan until both sides are equal',
      '➕ In the adding levels put in the missing weight: <bdi>3 + ? = 5</bdi>',
      '🐊 Choose the right sign <bdi>&gt; &lt; =</bdi> — the crocodile mouth eats the bigger number!',
      '🔤 The «عربي / English» button changes the numbers, words and voice; 🔊 repeats the question'
    ],
    help: () => [
      '⚖️ الكفّة الأثقل تنزل إلى الأسفل، والأخف ترتفع إلى الأعلى',
      '👆 ' + App.g('المسي', 'المس') + ' الكفّة الأثقل أو الأخف، أو ' + App.g('اسحبي', 'اسحب') + ' الأشياء إلى الكفّة حتى تتساوى الكفّتان',
      '➕ في مستويات الجمع ' + App.g('ضعي', 'ضع') + ' الوزن الناقص: <bdi>٣ + ؟ = ٥</bdi>',
      '🐊 ' + App.g('اختاري', 'اختر') + ' الرمز الصحيح <bdi>&gt; &lt; =</bdi> — فم التمساح يأكل العدد الأكبر!',
      '🔤 زر «عربي / English» يغيّر الأرقام والكلمات والصوت، و🔊 يعيد السؤال'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 ${App.t('المستوى', 'Level')} ${Math.max(...ks)} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      trUI(); setLang(App.gameLang(ID), false);
      layout();
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, LEVELS.length));
      render(); startLoop();
    },
    onLang(l) {
      trUI();
      const ch = l !== lang;
      setLang(l, false);
      if (ch && q && !over) askSpeak();
      if (winOv.classList.contains('on')) winText();
    },
    leave() { stopLoop(); clearTimeout(winTimer); drag = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { const it = drag.it; drag = null; flyTray(it); } },
    resume() { paused = false; last = performance.now(); },
    back() { if (lvOv.classList.contains('on')) { act('close'); return true; } return false; },
    /* للاختبار الآلي فقط */
    _s() {
      return { lvl, round, phase, mistakes, theta, lang, q: q && { m: q.m, a: q.a, b: q.b, c: q.c, ans: q.ans, ask: q.ask, addSide: q.addSide },
        pans: { L: { x: pans.L.x, y: pans.L.y, m: mass('L') }, R: { x: pans.R.x, y: pans.R.y, m: mass('R') } }, slot: slot && { x: slot.x, y: slot.y },
        items: items.map(i => ({ kind: i.kind, v: i.v, sym: i.sym, state: i.state, fixed: i.fixed, x: i.x, y: i.y, s: i.s * (i.sc || 1) })) };
    },
    _go(n, r) { startLevel(n); if (r) { round = r; newRound(); } }
  });
})();
