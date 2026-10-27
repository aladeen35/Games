/* =====================================================================
   الكسور بالكيك — قطّع الكعكة/البيتزا بالسكين إلى أنصاف وأثلاث وأرباع،
   وزّعها بالعدل على الأصدقاء، تعرّف على الكسر، وقارن أيّ القطع أكبر
   ثنائي اللغة (عربي / English)
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'fractions';
  const TAU = Math.PI * 2;
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';
  const AR_D = '٠١٢٣٤٥٦٧٨٩';

  /* ---------- اللغة ---------- */
  let lang = 'ar';
  const en = () => lang === 'en';
  const N = n => en() ? String(n) : String(n).replace(/\d/g, d => AR_D[d]);
  const say = (ar, e) => { if (en()) App.speak(e, 'en'); else App.speak(ar); };
  const praise = () => say(App.g('أحسنتِ!', 'أحسنت!'), 'Well done!');
  const tryAgain = () => say(App.g('حاولي مرة أخرى.', 'حاول مرة أخرى.'), 'Try again!');
  /* أسماء الكسور */
  const FR = {
    2: { ar: 'نصف', def: 'النصف', pl: 'نصفين', en: 'half', one: 'one half', pen: 'two halves', glyph: '½' },
    3: { ar: 'ثلث', def: 'الثلث', pl: 'ثلاثة أثلاث', en: 'third', one: 'one third', pen: 'three thirds', glyph: '⅓' },
    4: { ar: 'ربع', def: 'الربع', pl: 'أربعة أرباع', en: 'quarter', one: 'one quarter', pen: 'four quarters', glyph: '¼' }
  };
  const frWord = n => en() ? FR[n].en : FR[n].ar;

  /* ---------- المستويات ---------- */
  const ROUNDS = 4;
  const LEVELS = [
    { m: 'cut', n: [2], ic: '🔪', st: ['cake'] },
    { m: 'share', n: [2], f: 2, ic: '🐻', st: ['cake', 'choco'] },
    { m: 'cut', n: [4], ic: '🔪', st: ['cake', 'pizza'] },
    { m: 'share', n: [4], f: 4, ic: '🐰', st: ['cake', 'pizza', 'choco'] },
    { m: 'cut', n: [3], ic: '🔪', st: ['choco', 'pizza'] },
    { m: 'share', n: [3], f: 3, ic: '🐱', st: ['cake', 'pizza', 'choco'] },
    { m: 'name', n: [2, 4], ic: '❓' },
    { m: 'name', n: [2, 3, 4], ic: '❓' },
    { m: 'cmp', ic: '⚖️' },
    { m: 'share', n: [4], f: 2, ic: '🍕', st: ['pizza'] },
    { m: 'mix', ms: ['name', 'cmp'], ic: '⭐' },
    { m: 'mix', ms: ['cut', 'share', 'name', 'cmp'], ic: '🏆' }
  ];
  const MODE = {
    cut: { t: 'تقطيع', en: 'Cut', c: '#FF7EB3', d: '#D84C88' },
    share: { t: 'توزيع', en: 'Share', c: '#3DBE6B', d: '#22863F' },
    name: { t: 'ما الكسر؟', en: 'Which part?', c: '#3D9BFF', d: '#1F6FCC' },
    cmp: { t: 'أيها أكبر؟', en: 'Which is bigger?', c: '#A86BFF', d: '#7140CF' },
    mix: { t: 'منوّع', en: 'Mixed', c: '#FF9F1C', d: '#D27400' }
  };
  const FRIENDS = ['🐻', '🐰', '🐱', '🐼', '🦊', '🐶'];
  const PLATE_COLS = ['#FF9EC4', '#8FD3FF', '#FFD36B', '#A8E6A0'];
  const STY = {
    cake: { h: .4, top: ['#FFE0EC', '#FF9EC2', '#F2679E'], layers: [[0, .2, '#FF8FB8'], [.2, .46, '#F7D08A'], [.46, .58, '#FFF6F0'], [.58, 1, '#F2C277']], drip: '#FF8FB8', pipe: '#FFF6FA', deco: 'berry', ar: 'الكعكة', en: 'cake' },
    choco: { h: .4, top: ['#B07050', '#6A341C', '#40190A'], layers: [[0, .2, '#5E2E18'], [.2, .46, '#8F4F2C'], [.46, .58, '#FFF1DF'], [.58, 1, '#7E4022']], drip: '#5A2A14', pipe: '#FFF1DF', deco: 'cherry', ar: 'الكعكة', en: 'cake' },
    pizza: { h: .12, layers: [[0, .4, '#FFCF57'], [.4, 1, '#DDA052']], pizza: true, ar: 'البيتزا', en: 'pizza' }
  };

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const shade = (h, f) => App.shade(h, f);
  const norm = a => { a %= TAU; return a < 0 ? a + TAU : a; };
  const loadProg = () => { const p = store.get('fractionsProg', null) || {}; return { unlocked: Math.max(1, p.unlocked || 1), stars: p.stars || {} }; };

  /* ---------- الواجهة ---------- */
  App.css(`
  #fractions{background:#FFF0F6;overflow:hidden}
  #fractions canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #fractions .ib{color:#D6457F}
  #fractions .lvbtn{position:relative}
  #fractions .ib .cnt{background:#7C5CFF}
  #fractions .lang{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 #F6BCD3,0 8px 14px rgba(150,30,80,.16);flex:0 0 auto}
  #fractions .lang button{min-width:56px;padding:5px 11px;border-radius:99px;font-weight:900;font-size:16px;background:transparent;color:#C54C7E;line-height:1.25;transition:transform .14s var(--press)}
  #fractions .lang button.on{background:linear-gradient(#FF9CC5,#F0558F);color:#fff;box-shadow:0 3px 0 #C23270,inset 0 2px 0 rgba(255,255,255,.4);text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #fractions .lang button:active{transform:scale(.92)}
  #fractions .prm{position:absolute;z-index:4;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 58px);
    width:min(calc(100% - 24px),580px);display:flex;align-items:center;gap:10px;padding:8px 10px 9px 12px;border-radius:26px;background:linear-gradient(#fff,#FFFBFD);
    border:4px solid #FF9EC4;box-shadow:0 6px 0 #E0508C,0 12px 24px rgba(120,20,60,.18);cursor:pointer}
  #fractions .prm.bump{animation:frBump .45s}
  #fractions .prm.wig{animation:frWig .45s}
  @keyframes frBump{35%{transform:translateX(-50%) scale(1.05)}}
  @keyframes frWig{20%{transform:translateX(calc(-50% - 7px))}40%{transform:translateX(calc(-50% + 6px))}60%{transform:translateX(calc(-50% - 4px))}80%{transform:translateX(calc(-50% + 2px))}}
  #fractions .pt{flex:1;min-width:0;color:#7A1F4E}
  #fractions .prog{display:flex;gap:4px;margin:0 0 5px;direction:rtl}
  #fractions .prog i{flex:1;height:9px;border-radius:6px;background:#FCE4EE;box-shadow:inset 0 2px 2px rgba(120,20,60,.12)}
  #fractions .prog i.on{background:linear-gradient(#FFE07A,#FFA51F);box-shadow:0 2px 0 #D98100}
  #fractions .prog i.cur{background:#FFB8D3;animation:frPul 1s ease-in-out infinite}
  @keyframes frPul{50%{opacity:.5}}
  #fractions .ptxt{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-size:clamp(18px,5vw,27px);font-weight:900;line-height:1.15;overflow:hidden}
  #fractions .psub{display:block;font-size:14px;font-weight:700;opacity:.72;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #fractions .fr{flex:0 0 auto;width:50px;height:62px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:linear-gradient(#FFF3C4,#FFD45A);box-shadow:0 4px 0 #E0A21A,inset 0 2px 0 rgba(255,255,255,.7);color:#8A3A00;font-weight:900;font-size:22px;line-height:1}
  #fractions .fr i{display:block;width:26px;height:4px;border-radius:2px;background:#8A3A00;margin:3px 0}
  #fractions .fr.off{display:none}
  #fractions .spk{width:54px;height:54px;flex:0 0 54px;border-radius:50%;font-size:25px;display:grid;place-items:center;border:3px solid #fff;
    background:radial-gradient(circle at 36% 28%,#FFF6B8 0,#FFD84A 42%,#F5B400 100%);box-shadow:0 4px 0 #D08F00,0 7px 12px rgba(200,130,0,.35);transition:transform .14s var(--press)}
  #fractions .spk:active{transform:translateY(3px) scale(1.06,.9)}
  #fractions .spk.talk{animation:frTalk .5s ease-in-out 2}
  @keyframes frTalk{50%{transform:scale(1.12)}}
  #fractions .panel{border-color:#FFD3E4;box-shadow:0 8px 0 #F29BBE,0 20px 40px rgba(90,10,50,.3);color:#7A1F4E}
  #fractions .panel h3{color:#E0447F;text-shadow:0 3px 0 #FFE0EC}
  #fractions .btn{background:linear-gradient(#FF9CC5,#F0558F);box-shadow:0 5px 0 #C23270,0 8px 12px rgba(200,40,100,.25)}
  #fractions .btn.alt{background:#fff;color:#E0447F;box-shadow:0 5px 0 #FFC7DC;border-color:#FFE3EE}
  #fractions .btn:active{box-shadow:0 1px 0 #C23270}
  #fractions .overlay{background:radial-gradient(circle at 50% 45%,rgba(120,30,80,.25),rgba(60,10,40,.5))}
  #fractions .lvp{width:min(94vw,440px);max-height:88vh;overflow-y:auto;touch-action:pan-y}
  #fractions .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:10px 0 14px}
  #fractions .lvb{position:relative;aspect-ratio:.86;border-radius:22px;color:#fff;font-weight:900;padding:4px 2px 2px;display:flex;flex-direction:column;align-items:center;justify-content:center;
    background:linear-gradient(180deg,var(--l),var(--c));border:3px solid #fff;box-shadow:0 5px 0 var(--d),0 8px 12px rgba(80,10,40,.18);transition:transform .14s var(--press)}
  #fractions .lvb::after{content:'';position:absolute;top:3px;left:16%;right:16%;height:30%;border-radius:20px;background:linear-gradient(rgba(255,255,255,.55),rgba(255,255,255,0));pointer-events:none}
  #fractions .lvb:active{transform:translateY(4px) scale(1.04,.94);box-shadow:0 1px 0 var(--d)}
  #fractions .lvb .n{position:absolute;top:2px;right:8px;font-size:14px;text-shadow:0 1px 0 rgba(0,0,0,.25)}
  #fractions .lvb .e{font-size:26px;line-height:1.1;filter:drop-shadow(0 2px 0 rgba(0,0,0,.15))}
  #fractions .lvb .t{font-size:11.5px;line-height:1.2;text-shadow:0 1px 0 rgba(0,0,0,.25)}
  #fractions .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:13px}
  #fractions .lvb .s i{font-style:normal}
  #fractions .lvb .s i.off{filter:grayscale(1) brightness(1.6);opacity:.45}
  #fractions .lvb.cur{outline:4px solid #FFD84A;outline-offset:2px}
  #fractions .lvb.lock{--c:#D9C9D1;--l:#EEE3E8;--d:#B49FAA;color:#8F7C86}
  #fractions .lvb.lock .e{filter:grayscale(1);opacity:.4}
  #fractions .lvb.lock::before{content:'🔒';position:absolute;top:50%;margin-top:4px;font-size:18px;z-index:2}
  #fractions .lvb.lock .s,#fractions .lvb.lock .t{visibility:hidden}
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
      <div class="fr off"><b class="fn">١</b><i></i><b class="fd">٢</b></div>
      <div class="pt"><div class="prog"></div><b class="ptxt"></b><span class="psub"></span></div>
      <button class="spk" aria-label="استمع" data-al="Listen">🔊</button>
    </div>
    <div class="overlay" id="frLv"><div class="panel lvp"><h3 data-en="🧁 Levels">🧁 المستويات</h3><div class="lvg"></div>
      <button class="btn alt" data-a="close" data-en="✕ Close">✕ إغلاق</button></div></div>
    <div class="overlay" id="frWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next" data-en="Next ▶️">التالي ▶️</button><br>
      <button class="btn alt" data-a="again" aria-label="من جديد" data-al="Restart">🔄</button><button class="btn alt" data-a="levels" data-en="🗺️ Levels">🗺️ المستويات</button><button class="btn alt home" aria-label="الرئيسية" data-al="Home">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const prm = root.querySelector('.prm'), ptxt = root.querySelector('.ptxt'), psub = root.querySelector('.psub'), progEl = root.querySelector('.prog'), spk = root.querySelector('.spk');
  const frEl = root.querySelector('.fr');
  const lvOv = root.querySelector('#frLv'), winOv = root.querySelector('#frWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, G = null, bgLayer = null;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, round = 0, mistakes = 0, q = null, phase = 'idle', phT = 0, over = false, winTimer = 0;
  let cakes = [], friends = [], cards = [], parts = [], rings = [], shake = 0;
  let drag = null, stroke = null, idle = 0;
  const emoCache = new Map();

  /* ---------- رسم الكعكة ---------- */
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
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  /* مجالات الجانب الأمامي الظاهر [0,π] ضمن [a0,a1] */
  function frontRanges(a0, a1) {
    const out = [];
    for (let j = -2; j <= 2; j++) { const s = Math.max(a0, j * TAU), e = Math.min(a1, j * TAU + Math.PI); if (e - s > 1e-4) out.push([s, e]); }
    return out;
  }
  function topPath(c, x, y, R, k, a0, a1, full, rr = 1) {
    c.beginPath();
    if (full) { c.ellipse(x, y, R * rr, R * k * rr, 0, 0, TAU); return; }
    c.moveTo(x, y); c.lineTo(x + Math.cos(a0) * R * rr, y + Math.sin(a0) * R * k * rr);
    c.ellipse(x, y, R * rr, R * k * rr, 0, a0, a1, false); c.closePath();
  }
  function band(c, x, y, R, k, s, e, y0, y1) {
    c.beginPath(); c.ellipse(x, y + y0, R, R * k, 0, s, e, false); c.ellipse(x, y + y1, R, R * k, 0, e, s, true); c.closePath();
  }
  function dollop(c, x, y, r, col) {
    let g = c.createRadialGradient(x - r * .35, y - r * .45, r * .1, x, y, r);
    g.addColorStop(0, '#fff'); g.addColorStop(.6, col); g.addColorStop(1, shade(col, -.12));
    c.fillStyle = 'rgba(80,20,40,.18)'; c.beginPath(); c.ellipse(x, y + r * .45, r, r * .55, 0, 0, TAU); c.fill();
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    c.beginPath(); c.arc(x, y - r * .55, r * .62, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.arc(x - r * .25, y - r * .7, r * .18, 0, TAU); c.fill();
  }
  function berry(c, x, y, r) {
    c.fillStyle = 'rgba(80,10,20,.22)'; c.beginPath(); c.ellipse(x, y + r * .5, r * .9, r * .4, 0, 0, TAU); c.fill();
    let g = c.createRadialGradient(x - r * .3, y - r * .4, r * .1, x, y, r * 1.1);
    g.addColorStop(0, '#FF8A8A'); g.addColorStop(.5, '#F0283C'); g.addColorStop(1, '#A80F22');
    c.fillStyle = g; c.beginPath();
    c.moveTo(x, y + r * .95); c.bezierCurveTo(x - r * 1.15, y + r * .2, x - r * .9, y - r * .75, x, y - r * .6); c.bezierCurveTo(x + r * .9, y - r * .75, x + r * 1.15, y + r * .2, x, y + r * .95); c.fill();
    c.fillStyle = '#FFE38A';
    for (const [dx, dy] of [[-.4, -.15], [.4, -.15], [0, .1], [-.25, .4], [.25, .4], [0, -.35]]) { c.beginPath(); c.ellipse(x + dx * r, y + dy * r, r * .06, r * .09, 0, 0, TAU); c.fill(); }
    c.fillStyle = '#3FAE3A';
    for (const a of [-1.2, -.4, .4, 1.2]) { c.save(); c.translate(x, y - r * .62); c.rotate(a); c.beginPath(); c.ellipse(0, -r * .22, r * .12, r * .3, 0, 0, TAU); c.fill(); c.restore(); }
    c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(x - r * .35, y - r * .2, r * .14, r * .22, -.4, 0, TAU); c.fill();
  }
  function cherry(c, x, y, r) {
    c.strokeStyle = '#4E8A2A'; c.lineWidth = Math.max(1.5, r * .16); c.lineCap = 'round';
    c.beginPath(); c.moveTo(x, y - r * .6); c.quadraticCurveTo(x + r * .3, y - r * 1.5, x + r * .8, y - r * 1.7); c.stroke();
    c.fillStyle = 'rgba(40,0,0,.25)'; c.beginPath(); c.ellipse(x, y + r * .7, r * .9, r * .35, 0, 0, TAU); c.fill();
    const g = c.createRadialGradient(x - r * .3, y - r * .3, r * .1, x, y, r);
    g.addColorStop(0, '#FF7A8A'); g.addColorStop(.55, '#D0102E'); g.addColorStop(1, '#7A0016');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.ellipse(x - r * .35, y - r * .35, r * .2, r * .13, -.6, 0, TAU); c.fill();
  }
  function pepperoni(c, x, y, r, k) {
    c.fillStyle = 'rgba(120,40,0,.25)'; c.beginPath(); c.ellipse(x, y + 2, r, r * k, 0, 0, TAU); c.fill();
    const g = c.createRadialGradient(x - r * .3, y - r * k * .4, 1, x, y, r);
    g.addColorStop(0, '#E8574A'); g.addColorStop(1, '#A82A1E');
    c.fillStyle = g; c.beginPath(); c.ellipse(x, y, r, r * k, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(90,10,0,.35)';
    for (const [dx, dy] of [[-.4, -.2], [.3, .3], [.35, -.35], [-.2, .4]]) { c.beginPath(); c.ellipse(x + dx * r, y + dy * r * k, r * .12, r * .12 * k, 0, 0, TAU); c.fill(); }
    c.fillStyle = 'rgba(255,220,200,.45)'; c.beginPath(); c.ellipse(x - r * .35, y - r * k * .4, r * .25, r * k * .14, 0, 0, TAU); c.fill();
  }
  function basil(c, x, y, r, a) {
    c.save(); c.translate(x, y); c.rotate(a); c.scale(1, .6);
    const g = c.createLinearGradient(-r, 0, r, 0); g.addColorStop(0, '#2E8B2E'); g.addColorStop(1, '#6CCB4B');
    c.fillStyle = g; c.beginPath(); c.moveTo(-r, 0); c.quadraticCurveTo(0, -r * .7, r, 0); c.quadraticCurveTo(0, r * .7, -r, 0); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-r * .8, 0); c.lineTo(r * .8, 0); c.stroke();
    c.restore();
  }
  function inRange(a, a0, a1, full) { if (full) return true; a = norm(a - a0); return a > .02 && a < (a1 - a0) - .02; }
  /* قطعة (أو كعكة كاملة) رأسها (x,y) في المستوى العلوي */
  function drawWedge(c, x, y, R, k, a0, a1, st, n, o = {}) {
    const S = STY[st], H = R * S.h, full = a1 - a0 > TAU - 1e-3;
    c.save();
    if (o.alpha != null) c.globalAlpha = o.alpha;
    // الظل
    c.save(); c.fillStyle = 'rgba(90,20,50,.2)'; c.filter = 'none';
    topPath(c, x + R * .03, y + H + R * k * .06, R * 1.02, k, a0, a1, full); c.fill(); c.restore();
    // وجوه القطع
    if (!full) {
      for (const [a, vis] of [[a0, -Math.cos(a0) > 0], [a1, Math.cos(a1) > 0]]) {
        if (!vis) continue;
        const rx = x + Math.cos(a) * R, ry = y + Math.sin(a) * R * k;
        for (const [f0, f1, col] of S.layers) {
          c.fillStyle = col; c.beginPath(); c.moveTo(x, y + H * f0); c.lineTo(rx, ry + H * f0); c.lineTo(rx, ry + H * f1 + .5); c.lineTo(x, y + H * f1 + .5); c.closePath(); c.fill();
        }
        // ثقوب الإسفنج
        if (!S.pizza) {
          const R2 = rng(Math.round(a * 1000));
          c.fillStyle = 'rgba(120,60,10,.18)';
          for (let i = 0; i < 14; i++) { const t = .1 + R2() * .85, f = R2() < .5 ? .22 + R2() * .22 : .6 + R2() * .36; c.beginPath(); c.arc(x + (rx - x) * t, y + (ry - y) * t + H * f, 1 + R2() * 1.6, 0, TAU); c.fill(); }
        }
        c.fillStyle = `rgba(60,10,20,${.06 + .1 * Math.abs(Math.sin(a))})`;
        c.beginPath(); c.moveTo(x, y); c.lineTo(rx, ry); c.lineTo(rx, ry + H); c.lineTo(x, y + H); c.closePath(); c.fill();
        c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1; c.beginPath(); c.moveTo(rx, ry); c.lineTo(rx, ry + H); c.stroke();
      }
    }
    // الجانب الخارجي
    for (const [s, e] of frontRanges(a0, full ? a0 + TAU : a1)) {
      for (const [f0, f1, col] of S.layers) { c.fillStyle = col; band(c, x, y, R, k, s, e, H * f0, H * f1 + .6); c.fill(); }
      if (!S.pizza) {
        // سيلان الكريمة
        c.fillStyle = S.drip; c.beginPath(); c.ellipse(x, y, R, R * k, 0, s, e, false);
        const steps = Math.max(8, Math.ceil((e - s) * 40));
        for (let i = steps; i >= 0; i--) { const a = s + (e - s) * i / steps, f = .17 + .2 * Math.pow(Math.max(0, Math.sin(a * 11 + 1)), 4) + .05 * Math.max(0, Math.sin(a * 23)); c.lineTo(x + Math.cos(a) * R, y + Math.sin(a) * R * k + H * f); }
        c.closePath(); c.fill();
      }
      const g = c.createLinearGradient(x - R, 0, x + R, 0);
      g.addColorStop(0, 'rgba(60,10,30,.32)'); g.addColorStop(.25, 'rgba(60,10,30,.04)'); g.addColorStop(.4, 'rgba(255,255,255,.16)'); g.addColorStop(.55, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(60,10,30,.36)');
      c.fillStyle = g; band(c, x, y, R, k, s, e, 0, H); c.fill();
    }
    // الوجه العلوي
    if (S.pizza) {
      let g = c.createRadialGradient(x, y, R * .7, x, y, R);
      g.addColorStop(0, '#F2B866'); g.addColorStop(1, '#C9822F');
      c.fillStyle = g; topPath(c, x, y, R, k, a0, a1, full); c.fill();
      g = c.createRadialGradient(x - R * .3, y - R * k * .4, R * .05, x, y, R * .9);
      g.addColorStop(0, '#FFF0A0'); g.addColorStop(.6, '#FFC93C'); g.addColorStop(1, '#F2A51E');
      c.fillStyle = g; topPath(c, x, y, R, k, a0, a1, full, .85); c.fill();
      const R2 = rng(7); c.fillStyle = 'rgba(255,250,210,.55)';
      for (let i = 0; i < 26; i++) { const a = R2() * TAU, r = R2() * R * .78; if (!inRange(a, a0, a1, full)) continue; c.beginPath(); c.ellipse(x + Math.cos(a) * r, y + Math.sin(a) * r * k, R * .05, R * .05 * k, 0, 0, TAU); c.fill(); }
    } else {
      const g = c.createRadialGradient(x - R * .3, y - R * k * .5, R * .05, x, y, R * 1.05);
      g.addColorStop(0, S.top[0]); g.addColorStop(.55, S.top[1]); g.addColorStop(1, S.top[2]);
      c.fillStyle = g; topPath(c, x, y, R, k, a0, a1, full); c.fill();
      c.save(); topPath(c, x, y, R, k, a0, a1, full); c.clip();
      c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(x - R * .25, y - R * k * .45, R * .45, R * k * .18, -.15, 0, TAU); c.fill();
      // رشّات ملونة
      const R2 = rng(3), sc = ['#FFE14D', '#7FE0FF', '#9CF07A', '#FFFFFF', '#C79CFF'];
      for (let i = 0; i < 40; i++) {
        const a = R2() * TAU, r = (.15 + R2() * .62) * R, col = sc[i % sc.length], rot = R2() * Math.PI;
        if (!inRange(a, a0, a1, full)) continue;
        c.save(); c.translate(x + Math.cos(a) * r, y + Math.sin(a) * r * k); c.rotate(rot); c.scale(1, k);
        c.fillStyle = col; c.beginPath(); c.roundRect(-R * .035, -R * .01, R * .07, R * .02, R * .01); c.fill(); c.restore();
      }
      c.restore();
    }
    if (o.glow) {
      c.save(); c.globalAlpha = (c.globalAlpha || 1) * o.glow; c.lineWidth = 5; c.strokeStyle = '#FFF27A'; c.shadowColor = '#FFE14D'; c.shadowBlur = 14;
      topPath(c, x, y, R, k, a0, a1, full); c.stroke(); c.restore();
    }
    // الزينة (مرتّبة من الخلف إلى الأمام)
    const deco = [];
    const pn = 24;
    if (!S.pizza) for (let i = 0; i < pn; i++) { const a = -Math.PI / 2 + (i + .5) * TAU / pn; if (inRange(a, a0, a1, full)) deco.push({ t: 'pipe', a, r: R * .88 }); }
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i + .5) * TAU / n;
      if (!inRange(a, a0, a1, full)) continue;
      if (S.pizza) { deco.push({ t: 'pep', a, r: R * .55 }); deco.push({ t: 'pep', a: a + (TAU / n) * .22, r: R * .25 }); deco.push({ t: 'basil', a: a - (TAU / n) * .25, r: R * .7 }); }
      else deco.push({ t: S.deco, a, r: R * .52 });
    }
    deco.sort((p, q2) => Math.sin(p.a) * p.r - Math.sin(q2.a) * q2.r);
    for (const d of deco) {
      const px = x + Math.cos(d.a) * d.r, py = y + Math.sin(d.a) * d.r * k;
      if (d.t === 'pipe') dollop(c, px, py - R * .02, R * .065, S.pipe);
      else if (d.t === 'berry') berry(c, px, py - R * .07, R * .13);
      else if (d.t === 'cherry') cherry(c, px, py - R * .06, R * .1);
      else if (d.t === 'pep') pepperoni(c, px, py, R * (d.r > R * .4 ? .13 : .1), k);
      else if (d.t === 'basil') basil(c, px, py, R * .08, d.a);
    }
    c.restore();
  }
  function drawPlate(c, x, y, r, k, col) {
    c.save();
    c.fillStyle = 'rgba(90,20,50,.2)'; c.beginPath(); c.ellipse(x + r * .04, y + r * k * .22, r * 1.02, r * k * 1.02, 0, 0, TAU); c.fill();
    let g = c.createLinearGradient(0, y - r * k, 0, y + r * k);
    g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#DDE3EE');
    c.fillStyle = g; c.beginPath(); c.ellipse(x, y, r, r * k, 0, 0, TAU); c.fill();
    if (col) { c.strokeStyle = col; c.lineWidth = Math.max(3, r * .07); c.beginPath(); c.ellipse(x, y, r * .9, r * k * .9, 0, 0, TAU); c.stroke(); }
    g = c.createLinearGradient(0, y - r * k * .7, 0, y + r * k * .7);
    g.addColorStop(0, '#E9EDF5'); g.addColorStop(1, '#FFFFFF');
    c.fillStyle = g; c.beginPath(); c.ellipse(x, y + r * k * .04, r * .72, r * k * .68, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.ellipse(x - r * .45, y - r * k * .55, r * .2, r * k * .1, -.2, 0, TAU); c.fill();
    c.restore();
  }
  /* كسر مكدّس: البسط فوق الخط والمقام تحته */
  function drawFrac(c, x, y, s, num, den, col) {
    c.save(); c.font = `900 ${s}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = col; c.lineJoin = 'round';
    const dy = s * .58, ad = en() ? 0 : s * .08;
    c.fillText(N(num), x, y - dy + ad); c.fillText(N(den), x, y + dy + ad);
    c.lineCap = 'round'; c.lineWidth = Math.max(2.5, s * .13); c.strokeStyle = col;
    c.beginPath(); c.moveTo(x - s * .38, y); c.lineTo(x + s * .38, y); c.stroke();
    c.restore();
  }
  function bubble(c, x, y, s, n, a) {
    c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(.6 + .4 * ease.outBack(Math.min(1, a)), .6 + .4 * ease.outBack(Math.min(1, a)));
    c.shadowColor = 'rgba(120,20,60,.3)'; c.shadowBlur = 8; c.shadowOffsetY = 3;
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-s * .55, -s * .95, s * 1.1, s * 1.9, s * .4); c.fill();
    c.beginPath(); c.moveTo(-s * .18, s * .9); c.lineTo(0, s * 1.2); c.lineTo(s * .18, s * .9); c.fill();
    c.shadowColor = 'transparent'; c.strokeStyle = '#FF9EC4'; c.lineWidth = 3; c.beginPath(); c.roundRect(-s * .55, -s * .95, s * 1.1, s * 1.9, s * .4); c.stroke();
    drawFrac(c, 0, 0, s * .62, 1, n, '#D6336C');
    c.restore();
  }

  /* ---------- الكعكة وقطعها ---------- */
  function guidesFor(n) {
    const g = -Math.PI / 2 + .32;
    if (n === 2) return [{ angs: [g, g + Math.PI] }];
    if (n === 4) return [{ angs: [g, g + Math.PI] }, { angs: [g + Math.PI / 2, g + Math.PI * 1.5] }];
    return [{ angs: [g] }, { angs: [g + TAU / 3] }, { angs: [g + TAU * 2 / 3] }];
  }
  function mkCake(x, y, R, st, n, preCut) {
    const ck = { x, y, R, k: .56, st, n, groups: guidesFor(n).map(gr => ({ angs: gr.angs, cut: !!preCut, flash: 0 })), pieces: [], gap: preCut ? 1 : 0, ix: 0, hl: -1, hlT: 0 };
    rebuild(ck); return ck;
  }
  function rebuild(ck) {
    const angs = []; ck.groups.forEach(g => { if (g.cut) angs.push(...g.angs.map(norm)); });
    angs.sort((a, b) => a - b);
    const old = ck.pieces; ck.pieces = [];
    if (angs.length < 2) { ck.pieces.push(mkPiece(ck, angs.length ? angs[0] : 0, (angs.length ? angs[0] : 0) + TAU)); }
    else for (let i = 0; i < angs.length; i++) { const a0 = angs[i], a1 = i + 1 < angs.length ? angs[i + 1] : angs[0] + TAU; ck.pieces.push(mkPiece(ck, a0, a1)); }
    if (old.length && ck.pieces.length > old.length) ck.gap = 0;
  }
  function mkPiece(ck, a0, a1) { return { ck, a0, a1, state: 'cake', plate: -1, x: 0, y: 0, sc: 1, t: 0, fx: 0, fy: 0, fsc: 1, lift: 0, wig: 0, tag: 0, ord: 0 }; }
  const isFull = p => p.a1 - p.a0 > TAU - 1e-3;
  function gapVec(p) {
    if (isFull(p)) return { x: 0, y: 0 };
    const m = (p.a0 + p.a1) / 2, d = p.ck.R * .075 * p.ck.gap;
    return { x: Math.cos(m) * d, y: Math.sin(m) * d * p.ck.k };
  }
  function centroid(p, sc = 1) { // إزاحة مركز الوجه العلوي عن الرأس
    if (isFull(p)) return { x: 0, y: 0 };
    const w = p.a1 - p.a0, m = (p.a0 + p.a1) / 2, d = 4 * Math.sin(w / 2) / (3 * w) * p.ck.R * sc;
    return { x: Math.cos(m) * d, y: Math.sin(m) * d * p.ck.k };
  }
  function apex(p) {
    if (p.state === 'cake') { const g = gapVec(p); const lift = p.ck.hl >= 0 && p.ck.pieces[p.ck.hl] === p ? hlOff(p) : { x: 0, y: 0 }; return { x: p.ck.x + p.ck.ix + g.x + lift.x, y: p.ck.y + g.y + lift.y, sc: 1 }; }
    return { x: p.x, y: p.y, sc: p.sc };
  }
  function hlOff(p) {
    const m = (p.a0 + p.a1) / 2, e = ease.outBack(Math.min(1, p.ck.hlT)), d = p.ck.R * .16 * e;
    return { x: Math.cos(m) * d, y: Math.sin(m) * d * p.ck.k - p.ck.R * .1 * e };
  }
  function drawPiece(c, p, o = {}) {
    const a = apex(p), ck = p.ck;
    let x = a.x, y = a.y;
    if (p.wig > 0) x += Math.sin(p.wig * 30) * 6 * p.wig;
    if (p.lift > 0) y -= p.lift * 10;
    drawWedge(c, x, y, ck.R * a.sc, ck.k, p.a0, p.a1, ck.st, ck.n, o);
  }
  function drawCake(c, ck) {
    const S = STY[ck.st];
    // صحن التقديم
    drawPlate(c, ck.x + ck.ix, ck.y + ck.R * S.h + ck.R * ck.k * .08, ck.R * 1.2, ck.k, null);
    const list = ck.pieces.filter(p => p.state === 'cake').map(p => ({ p, z: apex(p).y + centroid(p).y }));
    list.sort((a, b) => a.z - b.z);
    for (const { p } of list) drawPiece(c, p, { glow: ck.hl >= 0 && ck.pieces[ck.hl] === p ? .6 + .4 * Math.sin(T * 6) : 0 });
    // خطوط الإرشاد
    if (phase === 'cut' && q && q.m !== 'share-go') {
      const uncut = ck.groups.filter(g => !g.cut);
      for (const g of uncut) {
        c.save(); c.setLineDash([9, 7]); c.lineDashOffset = -T * 30; c.lineCap = 'round';
        c.lineWidth = 4; c.strokeStyle = `rgba(255,255,255,${.75 + .25 * Math.sin(T * 5)})`;
        c.shadowColor = 'rgba(120,20,60,.45)'; c.shadowBlur = 4;
        c.beginPath();
        for (const a of g.angs) { c.moveTo(ck.x + ck.ix, ck.y); c.lineTo(ck.x + ck.ix + Math.cos(a) * ck.R * .98, ck.y + Math.sin(a) * ck.R * ck.k * .98); }
        c.stroke(); c.restore();
      }
    }
    // خط القطع (وميض) والقطع غير المنفصلة
    for (const g of ck.groups) {
      if (!g.cut) continue;
      const one = ck.pieces.length === 1;
      if (g.flash <= 0 && !one) continue;
      c.save(); c.lineCap = 'round';
      c.beginPath();
      for (const a of g.angs) { c.moveTo(ck.x + ck.ix, ck.y); c.lineTo(ck.x + ck.ix + Math.cos(a) * ck.R, ck.y + Math.sin(a) * ck.R * ck.k); }
      if (one) { c.lineWidth = 3; c.strokeStyle = 'rgba(120,30,60,.55)'; c.stroke(); }
      if (g.flash > 0) { c.globalAlpha = g.flash; c.lineWidth = 7; c.strokeStyle = '#FFFFFF'; c.shadowColor = '#FFF7B0'; c.shadowBlur = 16; c.stroke(); }
      c.restore();
    }
  }

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    emoCache.clear();
    const top = prm.getBoundingClientRect().bottom + 6, pad = Math.max(10, H * .012);
    const aw = Math.min(W - 20, 780), ax = (W - aw) / 2, avail = H - top - pad;
    G = { top, pad, aw, ax, avail, cx: W / 2, wide: W / H > 1.1 };
    placeAll();
    buildBg();
  }
  function placeAll() {
    if (!q) { G.tableTop = G.top + G.avail * .15; return; }
    const { top, aw, ax, avail, cx, wide } = G, bottom = top + avail;
    const m = q.m;
    if (m === 'share' || m === 'cut') {
      const f = q.f || 0;
      if (f) {
        const cs = Math.min(aw / f * .62, wide ? 96 : 88, avail * .14);
        const pr = Math.min(aw / f * .4, wide ? 86 : 70, avail * .1);
        let R = Math.min(aw * .42, 210, avail * .26);
        const blockH = cs * .82 + 8 + pr * 1.12 + 34 + R * 1.12 + R * .4 + 30;
        const off = clamp((avail - blockH) * .45, 0, avail * .2);
        G.tableTop = top + off + cs * .82 + 8;
        const py = G.tableTop + pr * .56 + 18;
        friends.forEach((fr, i) => { const x = en() ? ax + aw * (i + .5) / f : ax + aw * (f - i - .5) / f; fr.x = x; fr.y = G.tableTop + 4; fr.s = cs; fr.px = x; fr.py = py; fr.pr = pr; });
        const ck = cakes[0]; ck.R = R; ck.x = cx; ck.y = py + pr * .56 + 34 + R * .56;
        if (ck.y + R * .56 + R * .4 + 20 > bottom) ck.y = bottom - R * .56 - R * .4 - 20;
      } else {
        G.tableTop = top + avail * .14;
        const R = Math.min(aw * .43, 230, avail * .3);
        const ck = cakes[0]; ck.R = R; ck.x = cx; ck.y = top + avail * .54;
      }
    } else if (m === 'name') {
      G.tableTop = top + avail * .1;
      const cw = Math.min((aw - 30) / 3, 130), ch = cw * 1.12;
      const cyTop = bottom - ch - 6;
      const R = Math.min(aw * .4, 220, (cyTop - top - 40) / (2 * .56 + .4 + .3));
      const ck = cakes[0]; ck.R = R; ck.x = cx; ck.y = top + (cyTop - top) * .5 - R * .1;
      cards.forEach((cd, i) => { const n = cards.length, gap = (aw - n * cw) / (n + 1); const k2 = en() ? i : n - 1 - i; cd.x = ax + gap + k2 * (cw + gap); cd.y = cyTop; cd.w = cw; cd.h = ch; });
    } else if (m === 'cmp') {
      G.tableTop = top + avail * .1;
      const R = Math.min(aw * .19, 150, avail * .2);
      const cw = Math.min(aw * .3, 120), ch = cw * .95;
      cakes.forEach((ck, i) => { ck.R = R; const left = en() ? i === 0 : i === 1; ck.x = cx + (left ? -1 : 1) * aw * .26; ck.y = top + avail * .45; });
      cards.forEach((cd, i) => { const ck = cakes[i]; cd.w = cw; cd.h = ch; cd.x = ck.x - cw / 2; cd.y = Math.min(bottom - ch - 6, ck.y + R * .56 + R * .4 + R * .5 + 24); });
    }
  }
  function buildBg() {
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const tt = G.tableTop;
    let g = x.createLinearGradient(0, 0, 0, tt);
    g.addColorStop(0, '#9FDCFF'); g.addColorStop(1, '#DDF4FF');
    x.fillStyle = g; x.fillRect(0, 0, W, tt);
    // تلال وغيوم بعيدة
    const R = rng(9);
    for (let i = 0; i < 4; i++) IK.cloud(x, R() * W - 40, 40 + R() * Math.max(10, tt - 80), 70 + R() * 70, 'rgba(255,255,255,.9)', 'rgba(170,210,240,.6)');
    x.fillStyle = '#9FE08A'; x.beginPath(); x.moveTo(0, tt);
    for (let xx = 0; xx <= W; xx += 20) x.lineTo(xx, tt - 18 - Math.sin(xx * .012) * 10 - Math.sin(xx * .031 + 1) * 6);
    x.lineTo(W, tt); x.closePath(); x.fill();
    // مفرش مربعات وردي
    g = x.createLinearGradient(0, tt, 0, H); g.addColorStop(0, '#FFF3F7'); g.addColorStop(1, '#FFE2EC');
    x.fillStyle = g; x.fillRect(0, tt, W, H - tt);
    let yy = tt, rowH = 18, row = 0;
    while (yy < H) {
      const cw = rowH * 1.4;
      x.fillStyle = 'rgba(255,120,170,.1)'; if (row % 2 === 0) x.fillRect(0, yy, W, rowH);
      for (let xx = (W / 2) % (cw * 2) - cw * 2; xx < W; xx += cw * 2) x.fillRect(xx, yy, cw, rowH);
      yy += rowH; rowH *= 1.06; row++;
    }
    x.fillStyle = 'rgba(255,255,255,.8)'; x.fillRect(0, tt, W, 3);
    g = x.createLinearGradient(0, tt, 0, tt + 30); g.addColorStop(0, 'rgba(150,40,90,.18)'); g.addColorStop(1, 'rgba(150,40,90,0)');
    x.fillStyle = g; x.fillRect(0, tt + 3, W, 30);
    // نجوم وبريق خفيف على المفرش
    for (let i = 0; i < 10; i++) { x.save(); x.translate(R() * W, tt + 20 + R() * (H - tt - 20)); x.fillStyle = 'rgba(255,255,255,.55)'; starPath(x, 3 + R() * 4); x.fill(); x.restore(); }
  }

  /* ---------- الجولات ---------- */
  function roundMode() {
    const L = LEVELS[lvl - 1];
    if (L.m !== 'mix') return Object.assign({}, L);
    const m = L.ms[round % L.ms.length];
    if (m === 'cut') return { m, n: [pick([2, 3, 4])], st: ['cake', 'choco', 'pizza'] };
    if (m === 'share') { const n = pick([2, 3, 4]); return { m, n: [n], f: n === 4 ? pick([2, 4]) : n, st: ['cake', 'choco', 'pizza'] }; }
    if (m === 'name') return { m, n: [2, 3, 4] };
    return { m };
  }
  function newRound() {
    drag = null; stroke = null; parts.length = 0; idle = 0;
    const L = roundMode();
    q = { m: L.m, L, errs: 0 };
    cakes = []; friends = []; cards = [];
    const st = L.st ? pick(L.st) : pick(['cake', 'choco', 'pizza']);
    q.st = st;
    if (L.m === 'cut' || L.m === 'share') {
      q.n = pick(L.n); q.f = L.m === 'share' ? L.f : 0;
      cakes.push(mkCake(0, 0, 100, st, q.n, false));
      if (q.f) { const fr = shuffle(FRIENDS.slice()).slice(0, q.f); friends = fr.map((e, i) => ({ e, i, n: 0, bounce: 0, shake: 0, col: PLATE_COLS[i % 4], happy: 0 })); }
      phase = 'cut';
    } else if (L.m === 'name') {
      q.n = pick(L.n);
      const ck = mkCake(0, 0, 100, st, q.n, true); cakes.push(ck);
      ck.hl = Math.floor(Math.random() * q.n); ck.hlT = 0;
      cards = [2, 3, 4].map(n => ({ n, x: 0, y: 0, w: 0, h: 0, state: 0, pop: 0 }));
      phase = 'pick';
    } else {
      const pairs = [[2, 4], [2, 3], [3, 4]], pr = shuffle(pick(pairs).slice());
      q.ask = Math.random() < .5 ? 'big' : 'small';
      pr.forEach(n => { const ck = mkCake(0, 0, 100, st, n, true); ck.hl = Math.floor(Math.random() * n); ck.hlT = 0; cakes.push(ck); });
      q.ns = pr; q.ans = q.ask === 'big' ? (pr[0] < pr[1] ? 0 : 1) : (pr[0] > pr[1] ? 0 : 1);
      cards = pr.map(n => ({ n, x: 0, y: 0, w: 0, h: 0, state: 0, pop: 0 }));
      phase = 'pick';
    }
    cakes.forEach((ck, i) => { ck.ix = W * (en() ? -1 : 1) * .9; ck.introT = -i * .12; });
    q.introT = 0;
    layout();
    paintPrompt(); paintProg();
    Sound.whoosh();
    setTimeout(() => { if (App.current === ID && q && !paused) askSpeak(); }, 500);
  }

  /* ---------- لوحة السؤال ---------- */
  function paintPrompt() {
    if (!q) return;
    const S = STY[q.st] || STY.cake, m = q.m;
    let main = '', sub = '', fr = 0;
    if (m === 'cut' || (m === 'share' && phase === 'cut')) {
      const n = q.n; fr = n;
      main = en() ? `Cut the ${S.en} into ${FR[n].pen}` : `${App.g('قسّمي', 'قسّم')} ${S.ar} إلى ${FR[n].pl}`;
      sub = '🔪 ' + App.t(App.g('اسحبي', 'اسحب') + ' السكّين على الخط المنقّط', 'Drag the knife along the dotted line');
    } else if (m === 'share') {
      fr = q.n / q.f === 2 ? 2 : q.n;
      main = en() ? `Share the ${S.en} fairly` : `${App.g('وزّعي', 'وزّع')} ${S.ar} بالتساوي`;
      sub = '👆 ' + App.t(App.g('اسحبي', 'اسحب') + ' القطع إلى أطباق الأصدقاء', 'Drag the pieces to the friends\' plates');
    } else if (m === 'name') {
      main = en() ? 'What part is this?' : 'ما اسم هذا الجزء؟';
      sub = '👆 ' + App.t(App.g('اختاري', 'اختر') + ' البطاقة الصحيحة', 'Choose the right card');
    } else if (m === 'cmp') {
      const big = q.ask === 'big';
      main = en() ? (big ? 'Which piece is bigger?' : 'Which piece is smaller?') : (big ? 'أي قطعة أكبر؟' : 'أي قطعة أصغر؟');
      sub = '👆 ' + App.t(App.g('المسي', 'المس') + (big ? ' القطعة الأكبر' : ' القطعة الأصغر'), big ? 'Tap the bigger piece' : 'Tap the smaller piece');
    }
    ptxt.textContent = main; ptxt.dir = en() ? 'ltr' : 'rtl';
    psub.textContent = sub;
    frEl.classList.toggle('off', !fr);
    if (fr) { frEl.querySelector('.fn').textContent = N(1); frEl.querySelector('.fd').textContent = N(fr); }
  }
  function paintProg() {
    progEl.innerHTML = Array.from({ length: ROUNDS }, (_, i) => `<i class="${i < round ? 'on' : i === round ? 'cur' : ''}"></i>`).join('');
    root.querySelector('.lvbtn .cnt').textContent = N(lvl);
  }
  function askSpeak() {
    if (!q) return;
    spk.classList.remove('talk'); void spk.offsetWidth; spk.classList.add('talk');
    const S = STY[q.st] || STY.cake, m = q.m;
    if (m === 'cut' || (m === 'share' && phase === 'cut')) say(`${App.g('قسمي', 'قسم')} ${S.ar} إلى ${FR[q.n].pl}`, `Cut the ${S.en} into ${FR[q.n].pen}`);
    else if (m === 'share') say(`${App.g('وزعي', 'وزع')} ${S.ar} بالتساوي`, `Share the ${S.en} fairly`);
    else if (m === 'name') say('ما اسم هذا الجزء؟', 'What part is this?');
    else if (m === 'cmp') say(q.ask === 'big' ? 'أي قطعة أكبر؟' : 'أي قطعة أصغر؟', q.ask === 'big' ? 'Which piece is bigger?' : 'Which piece is smaller?');
  }

  /* ---------- النجاح والخطأ ---------- */
  function good(next = 1.8) {
    phase = 'good'; phT = 0; q.next = next;
    Sound.win(); vibrate(25);
    prm.classList.remove('bump'); void prm.offsetWidth; prm.classList.add('bump');
  }
  function bad() {
    mistakes++; q.errs++; Sound.error(); vibrate(35); shake = 5;
    prm.classList.remove('wig'); void prm.offsetWidth; prm.classList.add('wig');
  }
  function burst(x, y, n, conf) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU), v = rand(90, 300);
      parts.push({ t: conf && i % 3 === 0 ? 'conf' : i % 2 ? 'star' : 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, rot: rand(0, TAU), vr: rand(-7, 7), life: rand(.7, 1.3), age: 0, s: rand(5, 10),
        c: ['#FFD84A', '#FF6FB5', '#6CCB4B', '#4D8BFF', '#FF9F43', '#B57BFF'][i % 6] });
    }
    rings.push({ x, y, age: 0, life: .5, r: 60 });
  }
  function hearts(x, y) { for (let i = 0; i < 6; i++) parts.push({ t: 'heart', x: x + rand(-20, 20), y, vx: rand(-30, 30), vy: rand(-140, -70), rot: rand(-.3, .3), vr: 0, life: rand(.8, 1.2), age: 0, s: rand(7, 11), c: '#FF4F8B', float: 1 }); }
  function nextRound() { round++; if (round >= ROUNDS) { levelDone(); return; } newRound(); }
  function levelDone() {
    over = true; phase = 'end';
    const pr = loadProg();
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1, prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('fractionsProg', pr);
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
      App.achieve('fractions_first');
      if (LEVELS.every((_, i) => pr.stars[i + 1])) App.achieve('fractions_all');
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
    newRound();
  }
  function openLevels() {
    const pr = loadProg(), g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked, M = MODE[L.m];
      const mt = App.t(M.t, M.en);
      const t = L.m === 'cut' ? `${mt} ${FR[L.n[0]].glyph}` : L.m === 'share' ? `${mt} ${FR[L.n[0] / L.f === 2 ? 2 : L.n[0]].glyph}` : mt;
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" style="--c:${M.c};--d:${M.d};--l:${shade(M.c, .35)}" aria-label="${App.t('المستوى', 'Level')} ${n}">
        <span class="n">${N(n)}</span><span class="e">${L.ic}</span><span class="t">${t}</span>
        <span class="s">${[1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    g.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
  }

  /* ---------- التقطيع ---------- */
  function doCut(ck, dir) {
    const uncut = ck.groups.filter(g => !g.cut); if (!uncut.length) return;
    let best = uncut[0], bd = 9;
    for (const g of uncut) {
      for (const a of g.angs) { let d = Math.abs(norm(a - dir)); d = Math.min(d % Math.PI, Math.PI - d % Math.PI); if (d < bd) { bd = d; best = g; } }
    }
    best.cut = true; best.flash = 1;
    rebuild(ck);
    Sound.whoosh(); Sound.noise(.09, 3200, 1800, .14, 2, .05); Sound.thud(); vibrate(25); shake = 3;
    const mid = best.angs[0];
    for (let i = 0; i < 14; i++) { const t = Math.random(); parts.push({ t: 'crumb', x: ck.x + Math.cos(mid) * ck.R * t, y: ck.y + Math.sin(mid) * ck.R * ck.k * t, vx: rand(-80, 80), vy: rand(-160, -40), rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .8), age: 0, s: rand(3, 6), c: STY[ck.st].pizza ? '#F2B866' : STY[ck.st].layers[1][2] }); }
    if (ck.groups.every(g => g.cut)) {
      phase = 'cutdone'; phT = 0;
      ck.pieces.forEach(p => p.tag = 0);
    }
  }
  function cutFinished() {
    const ck = cakes[0], n = q.n;
    if (q.m === 'cut') {
      good(2.4); burst(ck.x, ck.y - ck.R * .3, 30, true);
      setTimeout(() => { if (App.current === ID) say(`كل قطعة ${FR[n].ar}`, `Each piece is ${FR[n].one}`); }, 300);
    } else {
      phase = 'share'; phT = 0; idle = 0;
      Sound.star(); say(FR[n].pl, FR[n].pen);
      paintPrompt();
      setTimeout(() => { if (App.current === ID && phase === 'share') askSpeak(); }, 1500);
    }
  }

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function hitPiece(x, y, list) {
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i], a = apex(p), R = p.ck.R * a.sc, k = p.ck.k, H = R * STY[p.ck.st].h;
      for (const yy of [y, y - H * .6]) {
        const dx = x - a.x, dy = (yy - a.y) / k, r = Math.hypot(dx, dy);
        if (r > R * 1.05) continue;
        if (isFull(p) || r < R * .12) return p;
        const ang = Math.atan2(dy, dx);
        if (norm(ang - p.a0) <= p.a1 - p.a0) return p;
      }
    }
    return null;
  }
  function interactive() { return App.current === ID && !paused && !winOv.classList.contains('on') && !lvOv.classList.contains('on'); }
  cv.addEventListener('pointerdown', e => {
    if (!interactive() || drag || stroke) return;
    const m = pos(e); idle = 0;
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    if (phase === 'cut') { stroke = { id: e.pointerId, pts: [{ x: m.x, y: m.y, t: T }], done: false, touched: false }; return; }
    if (phase === 'share') {
      const ck = cakes[0], list = ck.pieces.filter(p => p.state === 'cake');
      list.sort((a, b) => (apex(a).y + centroid(a).y) - (apex(b).y + centroid(b).y));
      const p = hitPiece(m.x, m.y, list);
      if (p) {
        const a = apex(p); p.x = a.x; p.y = a.y; p.sc = 1; p.state = 'drag';
        drag = { p, id: e.pointerId, ox: a.x - m.x, oy: a.y - m.y, tx: a.x, ty: a.y, sx: m.x, sy: m.y, moved: false, touch: e.pointerType !== 'mouse' };
        Sound.tone(520, .08, 'sine', .1, 260); vibrate(8);
      }
      return;
    }
    if (phase === 'pick') {
      if (q.m === 'name') {
        const cd = cards.find(c => m.x > c.x && m.x < c.x + c.w && m.y > c.y && m.y < c.y + c.h);
        if (cd) pickName(cd);
        else if (hitPiece(m.x, m.y, cakes[0].pieces)) { say(FR[q.n].ar, FR[q.n].en); }
      } else if (q.m === 'cmp') {
        let idx = cards.findIndex(c => m.x > c.x && m.x < c.x + c.w && m.y > c.y && m.y < c.y + c.h);
        if (idx < 0) idx = cakes.findIndex(ck => Math.abs(m.x - ck.x) < ck.R * 1.25 && Math.abs(m.y - ck.y - ck.R * .2) < ck.R * .95);
        if (idx >= 0) pickCmp(idx);
      }
    }
  });
  cv.addEventListener('pointermove', e => {
    const m = pos(e);
    if (stroke && e.pointerId === stroke.id) {
      stroke.pts.push({ x: m.x, y: m.y, t: T }); if (stroke.pts.length > 60) stroke.pts.shift();
      checkStroke(false); return;
    }
    if (drag && e.pointerId === drag.id) {
      if (!drag.moved && Math.hypot(m.x - drag.sx, m.y - drag.sy) > 6) drag.moved = true;
      drag.tx = m.x + drag.ox; drag.ty = m.y + drag.oy + (drag.touch ? -12 : 0);
    }
  });
  const up = e => {
    if (stroke && e.pointerId === stroke.id) { checkStroke(true); stroke.fade = 1; stroke.ended = true; fading.push(stroke); stroke = null; return; }
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag, p = d.p; drag = null;
    const c = centroid(p, p.sc), cx = p.x + c.x, cy = p.y + c.y;
    let best = null, bd = 1e9;
    for (const fr of friends) { const dd = Math.hypot(cx - fr.px, (cy - fr.py) * 1.4); if (dd < bd) { bd = dd; best = fr; } }
    if (best && bd < Math.max(best.pr * 1.7, 70)) {
      const cap = q.n / q.f;
      if (best.n >= cap) {
        best.shake = 1; bad(); tryAgain(); toCake(p);
        if (q.errs >= 2) { const f2 = friends.find(f => f.n < cap); if (f2) f2.bounce = 1.5; }
        return;
      }
      best.n++; p.state = 'fly'; p.plate = best.i; p.t = 0; p.fx = p.x; p.fy = p.y; p.fsc = p.sc; p.ord = best.n;
      return;
    }
    if (!d.moved) { p.wig = 1; say(FR[q.n].ar, FR[q.n].en); }
    toCake(p);
  };
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', up);
  let fading = [];
  function toCake(p) { p.state = 'back'; p.t = 0; p.fx = p.x; p.fy = p.y; p.fsc = p.sc; Sound.slide(); }
  function checkStroke(final) {
    const s = stroke; if (!s || s.done) return;
    const ck = cakes[0];
    let len = 0; for (let i = 1; i < s.pts.length; i++) len += Math.hypot(s.pts[i].x - s.pts[i - 1].x, s.pts[i].y - s.pts[i - 1].y);
    const last2 = s.pts[s.pts.length - 1];
    const inside = (p2) => Math.hypot(p2.x - ck.x, (p2.y - ck.y - ck.R * .1) / ck.k) < ck.R * 1.08;
    if (!s.touched && inside(last2)) s.touched = true;
    if (!s.touched) return;
    if (len > ck.R * 1.1 || (final && len > ck.R * .55)) {
      s.done = true;
      const a = s.pts[0], b = s.pts[s.pts.length - 1];
      const dir = Math.atan2((b.y - a.y) / ck.k, b.x - a.x);
      doCut(ck, dir);
    }
  }
  function pickName(cd) {
    if (cd.n === q.n) {
      cd.state = 1; cd.pop = 1; good(2.2);
      burst(cd.x + cd.w / 2, cd.y + cd.h / 2, 24, false);
      say(FR[q.n].ar, FR[q.n].en);
    } else { cd.state = -1; cd.pop = 1; bad(); tryAgain(); if (q.errs >= 2) cards.forEach(c => { if (c.n === q.n) c.hint = 3; }); }
  }
  function pickCmp(i) {
    const cd = cards[i];
    if (i === q.ans) {
      cd.state = 1; cd.pop = 1; good(2.8);
      burst(cakes[i].x, cakes[i].y - cakes[i].R * .3, 28, false);
      const o = 1 - i, a = q.ns[i], b = q.ns[o];
      const big = a < b;
      say(`${FR[a].def} ${big ? 'أكبر من' : 'أصغر من'} ${FR[b].def}`, `${FR[a].one} ${big ? 'is greater than' : 'is less than'} ${FR[b].one}`);
    } else { cd.state = -1; cd.pop = 1; bad(); tryAgain(); if (q.errs >= 2) cards[q.ans].hint = 3; }
  }

  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < LEVELS.length ? 'next' : 'levels'); return; }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? act('close') : openLevels(); return; }
    if (!interactive()) return;
    if (phase === 'cut' && (e.key === ' ' || e.key === 'Enter')) { const g = cakes[0].groups.find(g2 => !g2.cut); if (g) doCut(cakes[0], g.angs[0]); }
    if (phase === 'pick' && q.m === 'name' && ['2', '3', '4'].includes(e.key)) { const cd = cards.find(c => c.n === +e.key); if (cd) pickName(cd); }
    if (phase === 'pick' && q.m === 'cmp' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { const left = e.key === 'ArrowLeft'; pickCmp(en() ? (left ? 0 : 1) : (left ? 1 : 0)); }
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
  prm.addEventListener('click', () => { Sound.tap(); askSpeak(); });
  root.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l, true)));
  function setLang(l, user) {
    lang = l === 'en' ? 'en' : 'ar'; if (user) { store.set(ID + 'Lang', lang); Sound.tap(); }
    if (lvOv.classList.contains('on')) openLevels();
    root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
    if (G && q) placeAll();
    paintPrompt(); paintProg();
    if (user && q) askSpeak();
  }

  /* ---------- التحديث ---------- */
  function platePos(p) {
    const fr = friends[p.plate], sc = fr.pr * 1.08 / p.ck.R * (q.f === 2 ? 1.1 : q.f === 3 ? 1.35 : 1.55);
    const mine = p.ck.pieces.filter(o => o.plate === p.plate && (o.state === 'plate' || o.state === 'fly'));
    let cx = 0, cy = 0; mine.forEach(o => { const c = centroid(o, sc); cx += c.x; cy += c.y; });
    cx /= mine.length || 1; cy /= mine.length || 1;
    const g = gapVec(p);
    return { x: fr.px - cx + g.x * sc * .6, y: fr.py - cy - fr.pr * .12 + g.y * sc * .6, sc };
  }
  function update(dt) {
    T += dt; phT += dt;
    for (const ck of cakes) {
      ck.introT = (ck.introT || 0) + dt;
      const t = clamp(ck.introT / .7, 0, 1), from = W * (en() ? -1 : 1) * .9;
      ck.ix = from * (1 - ease.outBack(t));
      if (ck.gap < 1 && ck.pieces.length > 1) ck.gap = Math.min(1, ck.gap + dt * 3);
      if (ck.hl >= 0 && ck.introT > .9) ck.hlT = Math.min(1, ck.hlT + dt * 2);
      ck.groups.forEach(g => g.flash = Math.max(0, g.flash - dt * 1.6));
    }
    const k = 1 - Math.exp(-dt * 24);
    for (const ck of cakes) for (const p of ck.pieces) {
      p.wig = Math.max(0, p.wig - dt * 2);
      p.tag = Math.min(1.2, p.tag + (phase === 'cutdone' || phase === 'good' || phase === 'share' ? dt * 2.5 : 0));
      if (p.state === 'drag' && drag && drag.p === p) {
        p.x += (drag.tx - p.x) * k; p.y += (drag.ty - p.y) * k; p.sc += (.85 - p.sc) * k * .5; p.lift += (1 - p.lift) * k * .5;
      } else if (p.state === 'fly') {
        p.t += dt / .3; const t = Math.min(1, p.t), e = ease.outCubic(t), tg = platePos(p);
        p.x = p.fx + (tg.x - p.fx) * e; p.y = p.fy + (tg.y - p.fy) * e; p.sc = p.fsc + (tg.sc - p.fsc) * e; p.lift = 1 - e;
        if (t >= 1) landPlate(p);
      } else if (p.state === 'plate') {
        const tg = platePos(p); p.x = tg.x; p.y = tg.y; p.sc = tg.sc; p.lift = 0;
      } else if (p.state === 'back') {
        p.t += dt / .35; const t = Math.min(1, p.t), e = ease.outBack(t);
        const g = gapVec(p), tx = ck.x + ck.ix + g.x, ty = ck.y + g.y;
        p.x = p.fx + (tx - p.fx) * e; p.y = p.fy + (ty - p.fy) * e; p.sc = p.fsc + (1 - p.fsc) * Math.min(1, t * 1.4); p.lift = Math.max(0, p.lift - dt * 4);
        if (t >= 1) p.state = 'cake';
      }
    }
    for (const fr of friends) { fr.bounce = Math.max(0, fr.bounce - dt * 1.6); fr.shake = Math.max(0, fr.shake - dt * 1.8); fr.happy = Math.max(0, fr.happy - dt * .5); }
    for (const cd of cards) { cd.pop = Math.max(0, cd.pop - dt * 2.4); cd.hint = Math.max(0, (cd.hint || 0) - dt); if (cd.state === -1 && cd.pop <= 0) cd.state = 0; }
    if (phase === 'cutdone' && phT > .8) cutFinished();
    if (phase === 'cut' || phase === 'share' || phase === 'pick') {
      idle += dt;
      if (idle > 8) { idle = 0; if (phase === 'pick' && q.m === 'name') cards.forEach(c => { if (c.n === q.n) c.hint = 2.5; }); if (phase === 'pick' && q.m === 'cmp') cards[q.ans].hint = 2.5; }
    }
    if (phase === 'good' && phT > q.next) { phase = 'out'; phT = 0; Sound.whoosh(); }
    if (phase === 'out') { for (const ck of cakes) ck.ix += (en() ? 1 : -1) * W * dt * 3.2; if (phT > .35) nextRound(); }
    for (const s of fading) s.fade -= dt * 3;
    fading = fading.filter(s => s.fade > 0);
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.age += dt;
      if (p.age > p.life) { parts.splice(i, 1); continue; }
      if (p.t === 'conf') { p.vy = Math.min(p.vy + 120 * dt, 260); p.vx += Math.sin(T * 3 + i) * 40 * dt; }
      else if (p.float) { p.vy *= 1 - dt * .8; p.vx = Math.sin(T * 5 + i) * 20; }
      else { p.vx *= 1 - dt * 2.5; p.vy = p.vy * (1 - dt * 2.5) + 380 * dt; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    shake = Math.max(0, shake - dt * 18);
  }
  function landPlate(p) {
    p.state = 'plate'; const fr = friends[p.plate];
    fr.bounce = 1; fr.happy = 1; hearts(fr.x, fr.y - fr.s * .7);
    Sound.pop(); Sound.tone(880, .12, 'triangle', .1, 0, .05); Sound.tone(1175, .16, 'triangle', .08, 0, .12); vibrate(12);
    const ck = p.ck;
    if (ck.pieces.every(o => o.state === 'plate')) {
      good(2.6);
      friends.forEach(f => { f.bounce = 1.5; hearts(f.x, f.y - f.s * .6); });
      const each = q.n / q.f === 2 && q.n === 4 ? 2 : q.n;
      setTimeout(() => { if (App.current === ID) say(`لكل صديق ${FR[each].ar}`, `Each friend gets ${FR[each].one}`); }, 350);
    }
  }

  /* ---------- الرسم ---------- */
  function drawFriend(c, fr) {
    const b = Math.abs(Math.sin(fr.bounce * Math.PI * 2)) * fr.bounce * 18;
    const sh = Math.sin(fr.shake * 26) * fr.shake * .25;
    const e = emoji(fr.e, fr.s);
    c.save();
    c.beginPath(); c.rect(0, 0, W, G.tableTop + 3); c.clip();
    c.translate(fr.x, fr.y - fr.s * .42 - b); c.rotate(sh);
    // جسم صغير خلف الرأس
    c.fillStyle = shade(fr.col, -.05); c.beginPath(); c.ellipse(0, fr.s * .55, fr.s * .42, fr.s * .4, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-fr.s * .12, fr.s * .35, fr.s * .14, fr.s * .07, -.3, 0, TAU); c.fill();
    c.drawImage(e.c, -e.s / 2, -e.s / 2, e.s, e.s);
    c.restore();
    if (fr.happy > .2) { c.save(); c.globalAlpha = Math.min(1, fr.happy * 2); const e2 = emoji('😋', fr.s * .34); c.drawImage(e2.c, fr.x + fr.s * .3, fr.y - fr.s * 1.05 - b, e2.s, e2.s); c.restore(); }
  }
  function drawCard(c, cd, i) {
    const pop = Math.sin((1 - cd.pop) * Math.PI * 3) * cd.pop * .08;
    const col = cd.state === 1 ? '#3DBE6B' : cd.state === -1 ? '#FF5A5A' : ['#FF7EB3', '#3D9BFF', '#A86BFF'][cd.n - 2];
    const x = cd.x + cd.w / 2, y = cd.y + cd.h / 2;
    c.save(); c.translate(x, y); c.scale(1 + pop, 1 - pop);
    if (cd.state === -1) c.rotate(Math.sin(cd.pop * 30) * .06);
    const w = cd.w, h = cd.h;
    c.fillStyle = shade(col, -.25); c.beginPath(); c.roundRect(-w / 2, -h / 2 + 7, w, h, 22); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, 22); c.fill();
    c.lineWidth = 5; c.strokeStyle = col; c.beginPath(); c.roundRect(-w / 2 + 2.5, -h / 2 + 2.5, w - 5, h - 5, 20); c.stroke();
    if (cd.hint > 0) { c.globalAlpha = .5 + .5 * Math.sin(T * 9); c.lineWidth = 6; c.strokeStyle = '#FFE14D'; c.beginPath(); c.roundRect(-w / 2 - 5, -h / 2 - 5, w + 10, h + 10, 26); c.stroke(); c.globalAlpha = 1; }
    const fs = Math.min(w, h) * .26;
    if (q.m === 'name') {
      drawFrac(c, 0, -h * .14, fs, 1, cd.n, shade(col, -.2));
      c.font = `900 ${fs * .78}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#7A1F4E';
      c.fillText(frWord(cd.n), 0, h * .33);
    } else {
      drawFrac(c, -w * .18, 0, fs * 1.05, 1, cd.n, shade(col, -.2));
      c.font = `900 ${fs * .78}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#7A1F4E';
      c.fillText(frWord(cd.n), w * .2, en() ? 0 : fs * .08);
    }
    if (cd.state === 1) { c.font = `${fs}px ${EMOJI_FONT}`; c.fillText('✅', w * .38, -h * .4); }
    c.restore();
  }
  function knife(c, x, y, ang) {
    c.save(); c.translate(x, y); c.rotate(ang);
    c.shadowColor = 'rgba(60,10,30,.3)'; c.shadowBlur = 8; c.shadowOffsetY = 5;
    // النصل
    const g = c.createLinearGradient(0, -10, 0, 8); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.5, '#C9D3E2'); g.addColorStop(1, '#8D9BB2');
    c.fillStyle = g; c.beginPath(); c.moveTo(0, -9); c.lineTo(62, -6); c.quadraticCurveTo(78, -2, 74, 6); c.lineTo(0, 7); c.closePath(); c.fill();
    c.shadowColor = 'transparent';
    c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(4, -6, 54, 2);
    // المقبض
    const g2 = c.createLinearGradient(0, -9, 0, 9); g2.addColorStop(0, '#FFB3CF'); g2.addColorStop(1, '#E0447F');
    c.fillStyle = g2; c.beginPath(); c.roundRect(-46, -9, 46, 18, 9); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(-34, 0, 2.6, 0, TAU); c.arc(-14, 0, 2.6, 0, TAU); c.fill();
    c.restore();
  }
  function render() {
    ctx.save();
    ctx.fillStyle = '#FFF0F6'; ctx.fillRect(0, 0, W, H);
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    for (const fr of friends) drawFriend(ctx, fr);
    for (const fr of friends) drawPlate(ctx, fr.px, fr.py, fr.pr, .56, fr.col);
    // القطع على الأطباق
    for (const ck of cakes) {
      const onPl = ck.pieces.filter(p => p.state === 'plate').sort((a, b) => (a.y + centroid(a, a.sc).y) - (b.y + centroid(b, b.sc).y));
      for (const p of onPl) drawPiece(ctx, p);
    }
    for (const ck of cakes) drawCake(ctx, ck);
    // بطاقات وعناوين
    if (q && q.m === 'cmp') cakes.forEach((ck, i) => drawCard(ctx, cards[i], i));
    else for (let i = 0; i < cards.length; i++) drawCard(ctx, cards[i], i);
    // فقاعات الكسر فوق القطع
    for (const ck of cakes) {
      if (q && (q.m === 'cut' || q.m === 'share') && ck.pieces.length > 1 && ck.groups.every(g => g.cut)) {
        for (const p of ck.pieces) {
          if (p.state !== 'cake' || p.tag <= 0) continue;
          const a = apex(p), c2 = centroid(p);
          bubble(ctx, a.x + c2.x * 1.1, a.y + c2.y * 1.1 - ck.R * .38, Math.min(30, ck.R * .2), ck.n, Math.min(1, p.tag));
        }
      }
    }
    // القطع المتحركة
    for (const ck of cakes) for (const p of ck.pieces) if (p.state === 'fly' || p.state === 'back') drawPiece(ctx, p);
    if (drag) drawPiece(ctx, drag.p);
    // أثر السكين
    const drawTrail = (s, a) => {
      if (s.pts.length < 2) return;
      ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 10; ctx.shadowColor = '#FFF7B0'; ctx.shadowBlur = 12;
      ctx.beginPath(); s.pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.restore();
    };
    for (const s of fading) drawTrail(s, s.fade);
    if (stroke) {
      drawTrail(stroke, 1);
      const n = stroke.pts.length, p1 = stroke.pts[Math.max(0, n - 5)], p2 = stroke.pts[n - 1];
      const ang = n > 1 && Math.hypot(p2.x - p1.x, p2.y - p1.y) > 2 ? Math.atan2(p2.y - p1.y, p2.x - p1.x) : -.5;
      knife(ctx, p2.x, p2.y, ang + Math.PI);
    }
    // تلميح: سكين يتحرك على الخط
    if (phase === 'cut' && !stroke && idle > 1.6 && cakes[0]) {
      const ck = cakes[0], g = ck.groups.find(g2 => !g2.cut);
      if (g) {
        const t = (T * .7) % 1, a0 = g.angs[0], a1 = g.angs[1] != null ? g.angs[1] : a0 + Math.PI;
        const s = g.angs.length === 1 ? { x: ck.x, y: ck.y } : { x: ck.x + Math.cos(a0) * ck.R * 1.1, y: ck.y + Math.sin(a0) * ck.R * ck.k * 1.1 };
        const e = g.angs.length === 1 ? { x: ck.x + Math.cos(a0) * ck.R * 1.15, y: ck.y + Math.sin(a0) * ck.R * ck.k * 1.15 } : { x: ck.x + Math.cos(a1) * ck.R * 1.1, y: ck.y + Math.sin(a1) * ck.R * ck.k * 1.1 };
        const px = s.x + (e.x - s.x) * ease.outCubic(t), py = s.y + (e.y - s.y) * ease.outCubic(t);
        ctx.save(); ctx.globalAlpha = Math.min(1, (1 - t) * 3) * .9;
        knife(ctx, px, py, Math.atan2(e.y - s.y, e.x - s.x) + Math.PI);
        const em = emoji('👆', 40); ctx.drawImage(em.c, px - 6, py + 4, em.s, em.s);
        ctx.restore();
      }
    }
    if (phase === 'share' && !drag && idle > 4 && friends.length) {
      const ck = cakes[0], p = ck.pieces.find(o => o.state === 'cake'), fr = friends.find(f => f.n < q.n / q.f);
      if (p && fr) {
        const a = apex(p), c2 = centroid(p), t = (T * .6) % 1, e = ease.outCubic(t);
        const sx = a.x + c2.x, sy = a.y + c2.y, px = sx + (fr.px - sx) * e, py = sy + (fr.py - sy) * e;
        const em = emoji('👆', 42); ctx.globalAlpha = Math.min(1, (1 - t) * 3) * .9; ctx.drawImage(em.c, px - 8, py, em.s, em.s); ctx.globalAlpha = 1;
      }
    }
    for (const r of rings) {
      const t = r.age / r.life;
      ctx.save(); ctx.globalAlpha = 1 - t; ctx.strokeStyle = '#FFF4B0'; ctx.lineWidth = 6 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r * (.4 + t * .8), 0, TAU); ctx.stroke(); ctx.restore();
    }
    for (const p of parts) {
      const a = 1 - p.age / p.life;
      ctx.save(); ctx.globalAlpha = p.t === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
      if (p.t === 'star') { starPath(ctx, p.s * (.6 + a * .5)); ctx.fill(); }
      else if (p.t === 'dot' || p.t === 'crumb') { ctx.beginPath(); ctx.arc(0, 0, p.s * .45 * (p.t === 'crumb' ? 1 : a) + 1, 0, TAU); ctx.fill(); }
      else if (p.t === 'heart') { const s = p.s; ctx.beginPath(); ctx.moveTo(0, s * .8); ctx.bezierCurveTo(-s * 1.4, -s * .1, -s * .6, -s * 1.1, 0, -s * .45); ctx.bezierCurveTo(s * .6, -s * 1.1, s * 1.4, -s * .1, 0, s * .8); ctx.fill(); }
      else { ctx.scale(1, Math.cos(p.age * 9 + p.rot)); ctx.fillRect(-p.s / 2, -p.s * .3, p.s, p.s * .6); }
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
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); if (!running) render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    IK.bg(c, s, ['#FFE3EE', '#FF9EC4', '#E0508C'], { seed: 6 });
    IK.shadow(c, s * .5, s * .8, s * .38, s * .08, .3);
    const saved = lang; lang = 'en';
    IK.sticker(c, s, x => {
      const ck = { R: s * .34, k: .56, st: 'cake', n: 4 };
      const p0 = { ck, a0: -Math.PI / 2, a1: Math.PI, state: 'x' };
      drawWedge(x, s * .47, s * .5, ck.R, ck.k, -Math.PI / 2, Math.PI, 'cake', 4);
      // قطعة مسحوبة إلى الخارج
      drawWedge(x, s * .56, s * .53, ck.R, ck.k, Math.PI, Math.PI * 1.5, 'cake', 4);
      void p0;
    }, { line: 4 });
    lang = saved;
    c.save(); c.translate(s * .8, s * .22);
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-s * .1, -s * .13, s * .2, s * .26, s * .06); c.fill();
    c.strokeStyle = '#E0447F'; c.lineWidth = 2.5; c.stroke();
    c.font = `900 ${s * .09}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#D6336C';
    c.fillText('1', 0, -s * .055); c.fillText('4', 0, s * .07);
    c.fillRect(-s * .05, -s * .005, s * .1, s * .012);
    c.restore();
    IK.sparkle(c, s * .18, s * .22, s * .05);
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'الكسور بالكيك', icon2: '🧁', isNew: false, music: 'cake',
    desc: () => App.g('قطّعي الكيك وتعلّمي النصف والثلث والربع', 'قطّع الكيك وتعلّم النصف والثلث والربع'),
    titleEn: 'Cake Fractions',
    descEn: () => 'Cut the cake and learn halves, thirds and quarters',
    helpEn: () => [
      '🔪 Drag the knife along the dotted line to cut the cake or pizza',
      '🐻 Share the pieces fairly on the friends\' plates: every friend gets an equal share',
      '❓ Choose the name of the part: half <bdi>½</bdi>, third <bdi>⅓</bdi> or quarter <bdi>¼</bdi>',
      '⚖️ Compare: the more pieces, the smaller each piece!',
      '🔤 The «عربي / English» button changes the numbers, words and voice; 🔊 repeats the question'
    ],
    help: () => [
      '🔪 ' + App.g('اسحبي', 'اسحب') + ' السكّين على الخط المنقّط لتقطيع الكعكة أو البيتزا',
      '🐻 ' + App.g('وزّعي', 'وزّع') + ' القطع على أطباق الأصدقاء بالعدل: لكل صديق حصة متساوية',
      '❓ ' + App.g('اختاري', 'اختر') + ' اسم الجزء: نصف <bdi>½</bdi> أو ثلث <bdi>⅓</bdi> أو ربع <bdi>¼</bdi>',
      '⚖️ ' + App.g('قارني', 'قارن') + ': كلما زاد عدد القطع صغرت القطعة!',
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
    leave() { stopLoop(); clearTimeout(winTimer); drag = null; stroke = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; stroke = null; if (drag) { const p = drag.p; drag = null; toCake(p); } },
    resume() { paused = false; last = performance.now(); },
    back() { if (lvOv.classList.contains('on')) { act('close'); return true; } return false; },
    /* للاختبار الآلي فقط */
    _s() {
      return { lvl, round, phase, mistakes, lang, q: q && { m: q.m, n: q.n, f: q.f, ns: q.ns, ans: q.ans, ask: q.ask },
        cakes: cakes.map(ck => ({ x: ck.x, y: ck.y, R: ck.R, k: ck.k, groups: ck.groups.map(g => ({ angs: g.angs, cut: g.cut })),
          pieces: ck.pieces.map(p => { const a = apex(p), c = centroid(p, a.sc); return { state: p.state, cx: a.x + c.x, cy: a.y + c.y, plate: p.plate }; }) })),
        friends: friends.map(f => ({ px: f.px, py: f.py, n: f.n })), cards: cards.map(c => ({ n: c.n, x: c.x + c.w / 2, y: c.y + c.h / 2 })) };
    },
    _go(n, r) { startLevel(n); if (r) { round = r; newRound(); } }
  });
})();
