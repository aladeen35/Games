/* =====================================================================
   عدّاد الخرز — إطار خشبي وأسلاك معدنية وعشر خرزات ملوّنة في كل سلك
   اعرض العدد، اقرأ العدّاد، الجمع والطرح، العشرات والآحاد حتى ١٠٠،
   أصدقاء العشرة وروابط الأعداد — بالعربية (١٢٣) أو الإنجليزية (123)
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'abacus', TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';
  const AD = '٠١٢٣٤٥٦٧٨٩';
  const WAR = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
    'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر', 'عشرون'];
  const WEN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  const TAR = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون', 'مئة'];
  const TEN = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'one hundred'];
  const arNum = n => n <= 20 ? WAR[n] : n % 10 === 0 ? TAR[n / 10] : WAR[n % 10] + ' و' + TAR[Math.floor(n / 10)];
  const enNum = n => n <= 20 ? WEN[n] : n % 10 === 0 ? TEN[n / 10] : TEN[Math.floor(n / 10)] + ' ' + WEN[n % 10];

  /* المستويات: عدد الأسلاك، المدى، أنواع الجولات */
  const LV = [
    { rows: 1, lo: 1, hi: 5, k: ['show', 'show', 'read', 'show', 'read'], ic: '👆', t: '١–٥' },
    { rows: 1, lo: 1, hi: 10, k: ['show', 'read', 'show', 'read', 'show'], ic: '👆', t: '١–١٠' },
    { rows: 1, lo: 1, hi: 6, k: ['add', 'add', 'read', 'add', 'show'], ic: '➕', t: '≤٦' },
    { rows: 1, lo: 1, hi: 10, k: ['add', 'add', 'add', 'read', 'add'], ic: '➕', t: '≤١٠' },
    { rows: 1, lo: 1, hi: 10, k: ['sub', 'sub', 'show', 'sub', 'sub'], ic: '➖', t: '≤١٠' },
    { rows: 1, lo: 1, hi: 10, k: ['bond', 'bond', 'bond', 'bond', 'bond'], T: 10, ic: '🤝', t: '١٠' },
    { rows: 1, lo: 1, hi: 9, k: ['bond', 'bond', 'bond', 'bond', 'bond'], ic: '🔗', t: '٥–٩' },
    { rows: 2, lo: 11, hi: 20, k: ['show', 'read', 'show', 'read', 'show'], ic: '🔟', t: '١١–٢٠' },
    { rows: 2, lo: 1, hi: 18, k: ['add', 'add', 'read', 'add', 'add'], cross: true, ic: '➕', t: '≤٢٠' },
    { rows: 10, lo: 10, hi: 100, k: ['read', 'show', 'read', 'show', 'read'], tens: true, ic: '💯', t: '١٠،٢٠…' },
    { rows: 10, lo: 21, hi: 99, k: ['read', 'show', 'read', 'read', 'show'], ic: '💯', t: '٢١–٩٩' },
    { rows: 10, lo: 30, hi: 100, k: ['show', 'read', 'show', 'read', 'show'], ic: '🏆', t: '≤١٠٠' }
  ];
  const NL = LV.length, ROUNDS = 5;
  const ROWC = ['#FF4D5E', '#3D8BFF', '#FFB31A', '#36C26A', '#9B5CF6', '#FF7A2E', '#1DB8C9', '#FF5FAE', '#7AC43B', '#5B6CFF'];
  const CARDC = [['#FF9A3D', '#E86F0C'], ['#4D9BFF', '#1F6FE0'], ['#A66BFF', '#7A3EE0']];

  /* ---------- أدوات ---------- */
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const ease = {
    io: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    out: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  };
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  function mix(a, b, t) { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
  const loadProg = () => { const p = store.get('abacusProg', null) || {}; return { unlocked: clamp(p.unlocked || 1, 1, NL), stars: p.stars || {} }; };
  function starPath(c, x, y, s, rot = 0) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + rot + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); }
  const G = () => window.gsap && !(window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) ? window.gsap : null;

  let lang = 'ar';
  const isAr = () => lang === 'ar';
  const dg = n => isAr() ? String(n).replace(/\d/g, d => AD[d]) : String(n);
  function say(ar, en) { if (isAr()) App.speak(ar); else App.speak(en, 'en'); }
  const sayNum = n => say(arNum(n), enNum(n));
  const praise = () => say(App.g('أحسنتِ!', 'أحسنت!'), 'Great job!');
  const tryAgain = () => say(App.g('حاولي مرة أخرى', 'حاول مرة أخرى'), 'Try again!');

  /* ---------- الواجهة ---------- */
  App.css(`
  #abacus{background:#FFF1DC;overflow:hidden;color:#5A3416}
  #abacus canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #abacus .ib{color:#B4561A}
  #abacus .lang{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 rgba(140,70,20,.2),0 8px 16px rgba(120,60,20,.15)}
  #abacus .lang button{min-width:58px;padding:6px 11px;border-radius:99px;font-weight:900;font-size:17px;background:#FFF3E3;color:#B4651F;line-height:1.25}
  #abacus .lang button[data-l=en]{font-family:system-ui,"Segoe UI",sans-serif;font-size:15px}
  #abacus .lang button.on{background:linear-gradient(#FFB45E,#F07A12);color:#fff;box-shadow:0 3px 0 #B9560A;text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #abacus .prog{position:absolute;z-index:4;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 56px);
    display:flex;gap:5px;width:min(calc(100% - 40px),330px);height:16px;padding:3px;background:rgba(255,255,255,.92);border-radius:99px;box-shadow:0 3px 0 rgba(140,70,20,.12),0 6px 12px rgba(120,60,20,.1)}
  #abacus .prog i{flex:1;border-radius:99px;background:#F4E2CC;box-shadow:inset 0 2px 2px rgba(0,0,0,.08);transition:background .3s}
  #abacus .prog i.on{background:linear-gradient(#8CE58F,#3DBE52);box-shadow:inset 0 2px 0 rgba(255,255,255,.5),0 1px 0 #2A9440;animation:abPop .45s cubic-bezier(.3,1.8,.5,1)}
  #abacus .prog i.cur{background:linear-gradient(#FFE07A,#FFC234)}
  @keyframes abPop{40%{transform:scale(1.25,1.5)}}
  #abacus .ban{position:absolute;z-index:4;top:calc(max(10px,env(safe-area-inset-top)) + 82px);left:50%;transform:translateX(-50%);width:min(calc(100% - 24px),560px);
    background:#fff;border:4px solid #FFD9AE;border-radius:24px;box-shadow:0 5px 0 #F2B26E,0 12px 24px rgba(140,70,20,.14);padding:5px 14px;color:#6B3A12;
    font-weight:900;font-size:clamp(18px,5vw,24px);min-height:54px;display:flex;align-items:center;justify-content:center;gap:8px;text-align:center;line-height:1.25;cursor:pointer;transition:opacity .3s}
  #abacus .ban.off{opacity:0;pointer-events:none}
  #abacus .ban .eq{unicode-bidi:isolate;display:inline-flex;gap:6px;align-items:center;font-size:1.15em;color:#E0650C}
  #abacus .ban .eq b{min-width:1.1em;padding:0 6px;border-radius:12px;background:#FFF0DC;box-shadow:inset 0 -3px 0 #FFD9AE}
  #abacus .ban .eq b.q{background:#FFE58A;color:#9A5A00;box-shadow:inset 0 -3px 0 #F2C14E}
  #abacus .ban .eq b.g2{color:#fff;background:var(--g2,#3D8BFF);box-shadow:inset 0 -3px 0 rgba(0,0,0,.18)}
  #abacus .ban .eq i{font-style:normal;opacity:.8}
  #abacus .ban.bump{animation:abBump .5s}
  #abacus .ban.shake{animation:abShake .45s}
  @keyframes abBump{30%{transform:translateX(-50%) scale(1.06)}}
  @keyframes abShake{20%{transform:translateX(calc(-50% - 9px))}45%{transform:translateX(calc(-50% + 8px))}70%{transform:translateX(calc(-50% - 5px))}}
  #abacus .foot{position:absolute;left:0;right:0;bottom:0;z-index:4;padding:0 12px max(14px,env(safe-area-inset-bottom));display:flex;justify-content:center;pointer-events:none}
  #abacus .ctl{width:min(100%,600px);display:flex;align-items:center;justify-content:center;gap:12px;min-height:96px;position:relative}
  #abacus .cards{display:flex;gap:12px;justify-content:center;flex:1}
  #abacus .cd{pointer-events:auto;flex:0 1 112px;height:92px;border-radius:24px;background:linear-gradient(#fff 0%,#fff 70%,#FFF6EA 100%);border:5px solid var(--c);
    box-shadow:0 7px 0 var(--d),0 14px 20px rgba(120,60,20,.2),inset 0 -5px 0 rgba(0,0,0,.04);color:var(--d);font-weight:900;font-size:46px;line-height:1;
    display:grid;place-items:center;transition:transform .16s cubic-bezier(.3,1.7,.55,1),box-shadow .16s,opacity .3s}
  #abacus .cd:active{transform:translateY(5px) scale(1.04,.95);box-shadow:0 2px 0 var(--d),0 5px 8px rgba(120,60,20,.2)}
  #abacus .cd.no{animation:abNo .45s;filter:saturate(.3);opacity:.55}
  #abacus .cd.ok{background:linear-gradient(#E9FFE6,#BFF5B8);border-color:#3DBE52;color:#1E8A35;box-shadow:0 7px 0 #1E8A35,0 0 0 6px rgba(80,220,100,.35)}
  #abacus .cd.hint{animation:abGlow 1s ease-in-out infinite}
  @keyframes abNo{20%{transform:translateX(-8px) rotate(-4deg)}45%{transform:translateX(7px) rotate(3deg)}70%{transform:translateX(-4px)}}
  @keyframes abGlow{50%{box-shadow:0 7px 0 var(--d),0 0 0 8px rgba(255,214,60,.75)}}
  #abacus .done{pointer-events:auto;height:64px;padding:0 38px;border-radius:99px;font-size:27px;font-weight:900;color:#fff;
    background:linear-gradient(#78E584,#2DB84A);box-shadow:0 6px 0 #1E8A35,0 12px 20px rgba(20,120,40,.28),inset 0 3px 0 rgba(255,255,255,.45);border:3px solid rgba(255,255,255,.8);
    text-shadow:0 2px 0 rgba(0,90,20,.35);transition:transform .25s cubic-bezier(.3,1.6,.6,1),opacity .2s}
  #abacus .done:active{transform:translateY(4px);box-shadow:0 2px 0 #1E8A35}
  #abacus .done.wait{filter:saturate(.4);opacity:.7}
  #abacus .off2{display:none!important}
  #abacus .spk{pointer-events:auto;flex:0 0 62px;width:62px;height:62px;border-radius:50%;border:3px solid #FFF4C4;
    background:radial-gradient(circle at 35% 28%,#FFF6B8,#FFD21E 48%,#F0A400);box-shadow:0 5px 0 #C98500,0 10px 18px rgba(160,100,0,.28),inset 0 2px 0 rgba(255,255,255,.6);
    font-size:27px;display:grid;place-items:center}
  #abacus .spk:active{transform:translateY(3px);box-shadow:0 2px 0 #C98500}
  #abacus .spk.talk{animation:abTalk .5s}
  @keyframes abTalk{30%{transform:scale(1.15)}60%{transform:scale(.95)}}
  #abacus .overlay{background:radial-gradient(circle at 50% 45%,rgba(120,60,10,.25),rgba(70,30,0,.5))}
  #abacus .panel{border:5px solid #FFD9AE;box-shadow:0 9px 0 #F2A65A,0 22px 40px rgba(80,30,0,.3);color:#5A3416;background:linear-gradient(#fff 0%,#fff 70%,#FFF4E6 100%)}
  #abacus .panel h3{color:#E0650C;text-shadow:0 3px 0 #FFE3C2}
  #abacus .btn{background:linear-gradient(#FFB45E,#F07A12);box-shadow:0 5px 0 #B9560A,0 8px 12px rgba(180,90,10,.25);text-shadow:0 2px 0 rgba(120,50,0,.3)}
  #abacus .btn:active{box-shadow:0 1px 0 #B9560A}
  #abacus .btn.alt{background:#fff;color:#C5600E;box-shadow:0 5px 0 #FFD0A0;border:3px solid #FFE6CC;text-shadow:none}
  #abacus .lvp{width:min(94vw,450px);max-height:88vh;overflow-y:auto;touch-action:pan-y}
  #abacus .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:10px 0 12px}
  #abacus .lvb{position:relative;aspect-ratio:.88;border-radius:20px;background:#fff;border:3px solid #FFD9AE;box-shadow:0 5px 0 #F2B26E;
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#8A4A14;font-weight:900;padding:2px;gap:1px}
  #abacus .lvb:active{transform:translateY(3px);box-shadow:0 2px 0 #F2B26E}
  #abacus .lvb .n{font-size:13px;position:absolute;top:3px;right:8px;opacity:.65}
  #abacus .lvb .e{font-size:26px;line-height:1.1}
  #abacus .lvb .r{font-size:12px;line-height:1;opacity:.85;direction:rtl}
  #abacus .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:12px}
  #abacus .lvb .s i{font-style:normal}
  #abacus .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #abacus .lvb.cur{outline:3px solid #3D8BFF;outline-offset:2px}
  #abacus .lvb.lock{background:#F4EEE8;border-color:#E6DCD0;box-shadow:0 5px 0 #D6C8B8;color:#A0958A}
  #abacus .lvb.lock .e{filter:grayscale(1);opacity:.35}
  #abacus .lvb.lock::after{content:'🔒';position:absolute;font-size:16px;bottom:2px;left:4px}
  @media (max-width:370px){#abacus .lang button{min-width:50px;padding:6px 8px}#abacus .cd{height:84px;font-size:40px}}
  `);

  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🗺️</button>
      <span class="grow"></span>
      <div class="lang" role="group" aria-label="اللغة"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="prog"></div>
    <div class="ban off" role="button" aria-label="إعادة السؤال"></div>
    <div class="foot"><div class="ctl">
      <div class="cards"></div>
      <button class="done off2" aria-label="تم">تم ✓</button>
      <button class="spk" aria-label="إعادة الصوت">🔊</button>
    </div></div>
    <div class="overlay" id="abLv"><div class="panel lvp"><h3>🧮 المستويات</h3><div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="abWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄 مرة أخرى</button><button class="btn alt" data-a="levels">🗺️</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const ban = root.querySelector('.ban'), progEl = root.querySelector('.prog'), cardsEl = root.querySelector('.cards');
  const doneBtn = root.querySelector('.done'), spkBtn = root.querySelector('.spk');
  const lvOv = root.querySelector('#abLv'), winOv = root.querySelector('#abWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, bg = null;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, qi = 0, R = null, mistakes = 0, fails = 0, phase = 'idle', stage = 0;
  let rows = [], parts = [], timers = [], choices = [];
  let geo = null, drag = null, shake = 0, lastTotal = 0, settleT = 0, spoken = -1, bub = { v: 0, pop: 0, show: true, q: false };
  let countHL = null, prevN = -1, overT = 0;

  function later(s, fn) { timers.push({ at: T + s, fn }); }
  function clearLater() { timers = []; }
  const total = () => rows.reduce((a, r) => a + r.n, 0);
  const moving = () => !!drag || rows.some(r => r.beads.some(b => b.tw));

  /* ---------- الأسلاك والخرز ---------- */
  function mkRows(nr, cap) {
    rows = Array.from({ length: nr }, (_, r) => ({
      n: 0, min: 0, max: cap || 10, lock: false, cap: cap || 10, col: ROWC[nr === 1 ? 0 : nr === 2 ? r : r % ROWC.length],
      beads: Array.from({ length: cap || 10 }, () => ({ p: 0, tw: null, grp: 0, hl: 0, wob: 0, sq: 0 }))
    }));
  }
  function g2Col(row) { return /3D8BFF|5B6CFF|1DB8C9|9B5CF6/i.test(row.col) ? '#FF8A1F' : '#3D8BFF'; }
  /* تحريك السلك إلى عدد جديد من الخرزات المعدودة، مع ارتطام متتابع */
  function setN(row, m, opt = {}) {
    m = clamp(m, 0, row.cap);
    const a = row.n; if (m === a) return false;
    row.n = m;
    const up = m > a, lo = Math.min(a, m), hi = Math.max(a, m);
    for (let i = lo; i < hi; i++) {
      const b = row.beads[i], k = up ? i - a : a - 1 - i;
      if (up && opt.grp != null) b.grp = opt.grp;
      if (!up && opt.back != null) b.grp = opt.back;
      const to = up ? 1 : 0, dist = Math.abs(to - b.p);
      b.tw = { from: b.p, to, t: -(opt.stag == null ? .035 : opt.stag) * (hi - lo - 1 - k), d: .16 + dist * .2, ri: rows.indexOf(row), lead: k === hi - lo - 1 };
    }
    if (hi - lo > 4) Sound.slide();
    settleT = 0;
    return true;
  }
  function canSet(row, m) { return !row.lock && m >= row.min && m <= row.max; }
  function clack(ri, lead) {
    const f = 1500 + ri * 60 + rand(-120, 120);
    Sound.tone(f, .025, 'square', lead ? .05 : .03);
    Sound.noise(.035, 2600, 4200, lead ? .1 : .06, 3);
    Sound.tone(420 + ri * 18, .05, 'triangle', .06, -80);
  }
  function preset(n) {
    // يملأ الأسلاك من الأعلى: كل سلك عشرة
    let left = n;
    rows.forEach(r => { const k = Math.min(r.cap, left); left -= k; r.n = k; r.beads.forEach((b, i) => { b.p = i < k ? 1 : 0; b.tw = null; b.grp = 0; }); });
  }
  function presetAnimated(n) {
    let left = n, d = 0;
    rows.forEach((r, ri) => { const k = Math.min(r.cap, left); left -= k; if (k) later(d, () => { setN(r, k, { stag: .03 }); }); d += k ? .12 : 0; });
    return d + .5;
  }

  /* ---------- توليد الجولات ---------- */
  function makeChoices(ans, mn, mx, tens) {
    const c = [ans];
    let cand;
    if (tens && ans > 10) {
      const t = Math.floor(ans / 10), o = ans % 10;
      cand = [o * 10 + t, ans + 10, ans - 10, ans + 1, ans - 1].filter(v => v !== ans && v <= 100);
      cand = shuffle(cand.slice(0, 3)).concat(cand.slice(3));
    } else cand = shuffle([ans - 1, ans + 1, ans - 2, ans + 2]).concat([ans + 3, ans - 3]);
    for (const v of cand) { if (c.length >= 3) break; if (v >= mn && v <= mx && !c.includes(v)) c.push(v); }
    for (let v = mn; c.length < 3; v++) if (!c.includes(v)) c.push(v);
    return shuffle(c);
  }
  let lastN = -1;
  function freshN(a, b) { let n, g = 0; do { n = ri(a, b); } while (n === lastN && g++ < 20 && b > a); lastN = n; return n; }
  function genRound(L, type) {
    const r = { type };
    if (type === 'show' || type === 'read') {
      if (L.tens) r.N = 10 * ri(Math.max(1, L.lo / 10), L.hi / 10);
      else r.N = freshN(L.lo, L.hi);
      if (L.tens && r.N === lastN) r.N = r.N === 100 ? 90 : r.N + 10;
      lastN = r.N;
      if (type === 'read') r.ch = makeChoices(r.N, Math.max(1, L.lo - 5), L.rows === 10 ? 100 : L.rows * 10, L.rows === 10);
    } else if (type === 'add') {
      if (L.cross) { r.a = ri(6, 9); r.b = ri(11 - r.a, 9); }
      else { do { r.a = ri(1, L.hi - 1); r.b = ri(1, L.hi - r.a); } while (r.a + r.b < 3); }
      r.N = r.a + r.b; r.ch = makeChoices(r.N, 1, L.rows * 10);
    } else if (type === 'sub') {
      r.a = ri(4, L.hi); r.b = ri(1, r.a - 1); r.N = r.a - r.b; r.ch = makeChoices(r.N, 0, 10);
    } else if (type === 'bond') {
      r.T = L.T || ri(5, 9); r.a = ri(1, r.T - 1); r.N = r.T - r.a; r.ch = makeChoices(r.N, 1, r.T);
    }
    return r;
  }

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    bg = null; computeGeo();
  }
  function computeGeo() {
    if (!rows.length || !W) return;
    const nr = rows.length;
    const banB = ban.getBoundingClientRect().bottom || 150;
    const topY = Math.max(banB, 120) + 8;
    const botY = (root.querySelector('.ctl').getBoundingClientRect().top || H - 110) - 10;
    const portrait = W / H < 1.05;
    const bubH = nr === 10 ? 0 : clamp((botY - topY) * .24, 56, 130);
    const aw = Math.min(W - 20, 880), ah = botY - topY - bubH;
    const rowK = nr === 1 ? 2.5 : nr === 2 ? 2.05 : 1.55;
    let d = Math.min((aw - 16) / 14.6, ah / (nr * rowK + 1.9), nr === 1 ? 64 : 54);
    d = Math.max(d, 12);
    const pw = clamp(d * .78, 12, 34), rail = clamp(d * .6, 10, 30), rowH = d * rowK;
    const Lw = 12.6 * d, fw = Lw + pw * 2, fh = nr * rowH + rail * 2;
    const fx = W / 2 - fw / 2;
    const space = ah - fh;
    const fy = topY + bubH + Math.max(0, space * (portrait ? .5 : .45));
    const bh = Math.min(d * (nr === 1 ? 1.95 : nr === 2 ? 1.65 : 1.48), rowH * .86);
    // فقاعة العدد (أو بجانب الإطار حين تكون الأسلاك عشرة)
    let bx, by, br;
    if (nr === 10) {
      br = clamp(d * 1.25, 22, 40);
      const side = isAr() ? -1 : 1;
      bx = W / 2 - side * (fw / 2 + br + 6);
      if (bx - br < 4 || bx + br > W - 4) { bx = W / 2; by = fy - br - 4; } else by = fy + br;
    } else { br = clamp(bubH * .42, 24, 54); bx = W / 2; by = fy - 12 - br; }
    geo = { d, pw, rail, rowH, Lw, fw, fh, fx, fy, bh, x0: fx + pw, bx, by, br, portrait, topY, botY };
  }
  const cLeft = () => !isAr(); // جهة العدّ: يسار في الإنجليزية، يمين في العربية
  function uOf(row, i, p) { const d = geo.d, uC = d * (i + .5), uR = geo.Lw - d * (row.cap - i - .5); return uR + (uC - uR) * p; }
  function xOfU(u) { return cLeft() ? geo.x0 + u : geo.x0 + geo.Lw - u; }
  function beadXY(ri, i) { const row = rows[ri]; return { x: xOfU(uOf(row, i, row.beads[i].p)), y: geo.fy + geo.rail + geo.rowH * (ri + .5) }; }

  /* ---------- الجولات ---------- */
  function setBanner(bump) {
    const t = R.type;
    let txt = '', eq = '';
    const N = dg(R.N);
    if (t === 'show') txt = `👆 ${App.g('اعرضي', 'اعرض')} العدد <span class="eq"><b>${N}</b></span>`;
    else if (t === 'read') txt = `🧮 كم خرزة؟`;
    else if (t === 'add') {
      const s = stage;
      txt = s === 0 ? `👆 ${App.g('اعرضي', 'اعرض')}` : s === 1 ? `➕ ${App.g('أضيفي', 'أضف')}` : '🤔';
      eq = `<b>${dg(R.a)}</b><i>+</i><b class="${s >= 1 ? 'g2' : ''}">${dg(R.b)}</b><i>=</i><b class="q">${s >= 3 ? dg(R.N) : '?'}</b>`;
    } else if (t === 'sub') {
      txt = stage === 0 ? `👈 ${App.g('أرجعي', 'أرجع')}` : '🤔';
      eq = `<b>${dg(R.a)}</b><i>−</i><b>${dg(R.b)}</b><i>=</i><b class="q">${stage >= 3 ? dg(R.N) : '?'}</b>`;
    } else if (t === 'bond') {
      txt = R.T === 10 ? '🤝' : '🔗';
      eq = `<b>${dg(R.a)}</b><i>+</i><b class="q g2">${stage >= 3 ? dg(R.N) : '?'}</b><i>=</i><b>${dg(R.T)}</b>`;
    }
    if (!isAr() && t === 'read') txt = '🧮 How many?';
    ban.innerHTML = txt + (eq ? ` <span class="eq">${eq}</span>` : '');
    const g2 = rows[0] ? g2Col(rows[0]) : '#3D8BFF'; ban.style.setProperty('--g2', g2);
    ban.style.direction = isAr() ? 'rtl' : 'ltr';
    if (!isAr() && t !== 'read') {
      const map = { show: '👆 Show', add: stage === 0 ? '👆 Show' : stage === 1 ? '➕ Add' : '🤔', sub: stage === 0 ? '👈 Take away' : '🤔', bond: R.T === 10 ? '🤝' : '🔗' };
      ban.innerHTML = map[t] + ` <span class="eq">${eq || `<b>${N}</b>`}</span>`;
    }
    ban.classList.remove('off');
    if (bump !== false) { ban.classList.remove('bump'); void ban.offsetWidth; ban.classList.add('bump'); }
  }
  function sayPrompt() {
    if (!R || phase === 'over') return;
    spkBtn.classList.remove('talk'); void spkBtn.offsetWidth; spkBtn.classList.add('talk');
    const t = R.type;
    const show = n => say(App.g('اعرضي العدد', 'اعرض العدد') + ' ' + arNum(n), 'Show the number ' + enNum(n));
    if (t === 'show') show(R.N);
    else if (t === 'read') say('كم خرزة؟', 'How many beads?');
    else if (t === 'add') {
      if (stage === 0) show(R.a);
      else if (stage === 1) say(App.g('أضيفي', 'أضف') + ' ' + arNum(R.b), 'Add ' + enNum(R.b) + ' more');
      else say('كم المجموع؟', 'How many altogether?');
    } else if (t === 'sub') {
      if (stage === 0) say(App.g('أرجعي', 'أرجع') + ' ' + arNum(R.b), 'Take away ' + enNum(R.b));
      else say('كم بقي؟', 'How many are left?');
    } else if (t === 'bond') say('كم نحتاج لنصنع ' + arNum(R.T) + '؟', 'How many more to make ' + enNum(R.T) + '?');
  }
  function renderProg() {
    progEl.style.direction = isAr() ? 'rtl' : 'ltr';
    progEl.innerHTML = Array.from({ length: ROUNDS }, (_, i) => `<i class="${i < qi ? 'on' : i === qi && phase !== 'over' ? 'cur' : ''}"></i>`).join('');
  }
  function showCards(list) {
    choices = list || [];
    cardsEl.innerHTML = choices.map((v, i) => `<button class="cd" data-v="${v}" style="--c:${CARDC[i][0]};--d:${CARDC[i][1]}" aria-label="${v}">${dg(v)}</button>`).join('');
    cardsEl.querySelectorAll('.cd').forEach(b => b.onclick = () => pickCard(b));
    const g = G();
    if (g && choices.length) g.fromTo(cardsEl.children, { y: 70, scale: .5, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: .5, ease: 'back.out(1.8)', stagger: .08, clearProps: 'transform' });
  }
  function showDone(on) { doneBtn.classList.toggle('off2', !on); doneBtn.classList.remove('wait'); }

  function startRound() {
    clearLater(); drag = null; fails = 0; stage = 0; countHL = null; overT = 0;
    const L = LV[lvl - 1], type = L.k[qi];
    R = genRound(L, type);
    mkRows(L.rows, type === 'bond' ? R.T : 10);
    bub = { v: 0, pop: 0, show: type !== 'read', q: type === 'read' };
    showCards(null); showDone(false);
    setBanner(); renderProg();
    layout();
    phase = 'enter'; spoken = 0; prevN = 0; settleT = 0;
    let d = .35;
    if (type === 'read') { rows.forEach(r => r.lock = true); d = presetAnimated(R.N); }
    else if (type === 'sub') { d = presetAnimated(R.a); rows.forEach(r => { r.max = r.cap; }); }
    else if (type === 'bond') { d = presetAnimated(R.a); }
    later(d, () => {
      phase = 'play'; prevN = total(); spoken = prevN;
      if (type === 'read') { showCards(R.ch); }
      else if (type === 'show') showDone(true);
      else if (type === 'sub') rows.forEach(r => { r.max = r.n; });
      else if (type === 'bond') { rows.forEach(r => r.lock = true); showCards(R.ch); }
      sayPrompt();
    });
  }
  function startLevel(n) {
    lvl = clamp(n, 1, NL); qi = 0; mistakes = 0; parts = [];
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    startRound();
  }
  function roundSolved(delay) {
    phase = 'solved'; showDone(false);
    qi++; renderProg();
    if (qi >= ROUNDS) { later(delay * .8, win); return; }
    later(delay, () => {
      const g = G();
      if (g) g.to(cardsEl.children, { y: 60, autoAlpha: 0, duration: .25, stagger: .04 });
      Sound.whoosh();
      // الخرز يعود إلى مكانه
      rows.forEach((r, k) => { r.lock = false; r.min = 0; r.max = r.cap; later(k * .04, () => setN(r, 0, { stag: .02 })); });
      later(.55 + rows.length * .04, startRound);
    });
  }
  const starsFor = m => m === 0 ? 3 : m <= 2 ? 2 : 1;
  function win() {
    phase = 'over'; showDone(false); ban.classList.add('off'); renderProg();
    const pr = loadProg(), stars = starsFor(mistakes), prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(NL, lvl + 1);
    store.set('abacusProg', pr);
    confetti(150); Sound.win(); vibrate(30);
    // موجة احتفال على الخرز
    rows.forEach((r, ri) => r.beads.forEach((b, i) => later(.03 * (i + ri * 2), () => { b.hl = 1; b.sq = .5; })));
    later(1.2, () => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنت!') + ' 🎉';
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wP').textContent = App.g('أنهيتِ', 'أنهيتَ') + ` المستوى ${dg(lvl)}` + (mistakes ? ` · الأخطاء: ${dg(mistakes)}` : ' دون أي خطأ! 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < NL ? '' : 'none';
      winOv.classList.add('on');
      const g = G(); if (g) g.from(winOv.querySelector('.panel'), { scale: .6, rotation: -6, duration: .6, ease: 'elastic.out(1,.55)' });
      praise();
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('abacus_first');
      if (!isAr()) App.achieve('abacus_en');
      if (Array.from({ length: NL }, (_, i) => pr.stars[i + 1]).every(Boolean)) App.achieve('abacus_all');
    });
  }
  function openLevels() {
    const pr = loadProg(), grid = root.querySelector('.lvg');
    grid.innerHTML = LV.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}"><span class="n">${dg(n)}</span>
        <span class="e">${L.ic}</span><span class="r">${L.t}</span>
        <span class="s">${lock ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    grid.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
  }

  /* ---------- منطق اللعب ---------- */
  function onSettled() {
    // يُستدعى بعد أن يستقر الخرز
    const n = total();
    if (phase !== 'play') return;
    if (n !== spoken) { spoken = n; if (R.type !== 'read' && R.type !== 'bond') { sayNum(n); bub.pop = 1; } }
    if (R.type === 'add') {
      const target = stage === 0 ? R.a : R.N;
      if (n === target) {
        if (stage === 0) {
          stage = 1; rows.forEach(r => r.min = r.n); Sound.star(); sparkleRows(); setBanner();
          later(.9, sayPrompt);
        } else if (stage === 1) {
          stage = 2; rows.forEach(r => r.lock = true); Sound.star(); sparkleRows(); bub.q = true; setBanner();
          showCards(R.ch); later(.9, sayPrompt);
        }
      } else if (n > target) overflow();
    } else if (R.type === 'sub' && stage === 0) {
      if (n < R.N) overflow();
      if (n === R.N) { stage = 2; rows.forEach(r => r.lock = true); Sound.star(); sparkleRows(); bub.q = true; setBanner(); showCards(R.ch); later(.9, sayPrompt); }
    }
  }
  function overflow() {
    if (T - overT < 1.2) return; overT = T;
    Sound.error(); vibrate(15);
    ban.classList.remove('shake'); void ban.offsetWidth; ban.classList.add('shake');
  }
  function checkShow() {
    if (phase !== 'play' || R.type !== 'show' || moving()) return;
    const n = total();
    if (n === R.N) {
      showDone(false); Sound.star(); vibrate(20); sparkleRows(); confetti(40);
      rows.forEach(r => r.beads.forEach((b, i) => { if (i < r.n) later(i * .03, () => { b.hl = 1; b.sq = .4; }); }));
      if (R.N === 100) App.achieve('abacus_hundred');
      later(.3, praise);
      roundSolved(1.9);
    } else {
      mistakes++; fails++; Sound.error(); vibrate(25); shake = 6;
      ban.classList.remove('shake'); void ban.offsetWidth; ban.classList.add('shake');
      tryAgain();
      if (fails >= 2) later(1.2, () => { if (phase === 'play') { say('لنعد معا', "Let's count together"); later(1.3, () => countAlong(() => {})); } });
    }
  }
  function pickCard(b) {
    if (phase !== 'play' || b.classList.contains('no')) return;
    Sound.ac(true);
    const v = +b.dataset.v;
    if (v === R.N) {
      b.classList.add('ok'); cardsEl.querySelectorAll('.cd').forEach(x => { if (x !== b) x.style.opacity = '.35'; });
      Sound.star(); vibrate(20); stage = 3; setBanner(false); bub.q = false; bub.v = R.N; bub.pop = 1;
      const r = b.getBoundingClientRect(); sparkle(r.left + r.width / 2, r.top + r.height / 2, 16);
      sayNum(R.N);
      if (R.type === 'bond') {
        phase = 'solved';
        rows.forEach(r => { r.lock = false; r.max = r.cap; setN(r, r.cap, { grp: 1, stag: .07 }); });
        later(1.2, () => { praise(); confetti(50); });
        roundSolved(2.6); return;
      }
      later(.9, () => { praise(); confetti(50); Sound.coin(); });
      roundSolved(2.2);
    } else {
      mistakes++; fails++;
      b.classList.add('no'); Sound.error(); vibrate(20); shake = 4;
      if (fails >= 2 && R.type !== 'bond') { say('لنعد معا', "Let's count together"); later(1.3, () => countAlong(() => markHint())); }
      else if (fails >= 2) { tryAgain(); markHint(); }
      else tryAgain();
    }
  }
  function markHint() { cardsEl.querySelectorAll('.cd').forEach(x => x.classList.toggle('hint', +x.dataset.v === R.N)); }
  /* العدّ معًا: خرزة خرزة، أو بالعشرات حين تمتلئ الأسلاك */
  function countAlong(done) {
    if (phase !== 'play') return;
    phase = 'count'; bub.q = false;
    const steps = []; let v = 0;
    const byTens = rows.length === 10 && total() >= 20;
    rows.forEach((r, ri) => {
      if (byTens && r.n === r.cap) { v += r.cap; steps.push({ ri, all: true, v }); }
      else for (let i = 0; i < r.n; i++) { v++; steps.push({ ri, i, v }); }
    });
    let d = 0;
    steps.forEach(s => {
      later(d, () => {
        const r = rows[s.ri];
        if (s.all) r.beads.forEach(b => { b.hl = 1; b.sq = .35; });
        else { const b = r.beads[s.i]; b.hl = 1; b.sq = .45; const p = beadXY(s.ri, s.i); ring(p.x, p.y, '#FFD84A'); }
        bub.v = s.v; bub.pop = 1; Sound.pop(); sayNum(s.v);
      });
      d += s.all ? .85 : s.v > 20 ? .9 : .7;
    });
    later(d + .3, () => { if (phase === 'count') { phase = 'play'; bub.q = R.type === 'read' || stage === 2; spoken = total(); done && done(); } });
  }
  function sparkleRows() {
    rows.forEach((r, ri) => { if (!r.n) return; const p = beadXY(ri, r.n - 1); sparkle(p.x, p.y, 6); });
  }

  /* ---------- مؤثرات ---------- */
  function sparkle(x, y, n) {
    for (let i = 0; i < n; i++) { const a = Math.random() * TAU, s = rand(80, 230); parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 80, g: 420, life: .9, max: .9, r: rand(4, 7), c: pick(['#FFD84A', '#FFF3A0', '#FF9FC6', '#9FD8FF']), k: 'star', rot: rand(0, 6) }); }
  }
  function confetti(n) {
    const cols = ['#FF4D5E', '#FFB31A', '#36C26A', '#3D8BFF', '#9B5CF6', '#FF7A2E', '#1DB8C9'];
    for (let i = 0; i < n; i++) parts.push({ x: rand(0, W), y: rand(-60, -10), vx: rand(-50, 50), vy: rand(60, 220), g: 160, life: 2.6, max: 2.6, r: rand(4, 7), c: pick(cols), k: 'conf', rot: rand(0, 6), vr: rand(-8, 8) });
  }
  function ring(x, y, c) { parts.push({ x, y, vx: 0, vy: 0, g: 0, life: .45, max: .45, r: 22, c, k: 'ring' }); }

  /* ---------- الرسم ---------- */
  function buildBg() {
    const cnv = document.createElement('canvas'); cnv.width = Math.max(1, Math.round(W * dpr)); cnv.height = Math.max(1, Math.round(H * dpr));
    const c = cnv.getContext('2d'); c.scale(dpr, dpr);
    const tableY = geo ? Math.min(H - 40, geo.fy + geo.fh + geo.rail * .2) : H * .75;
    let g = c.createLinearGradient(0, 0, 0, tableY); g.addColorStop(0, '#FFE2BE'); g.addColorStop(.5, '#FFF0DC'); g.addColorStop(1, '#FFF7EC');
    c.fillStyle = g; c.fillRect(0, 0, W, tableY);
    // دوائر ناعمة على الجدار
    let s = 7; const rr = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const cols = ['#FFD0A0', '#FFC6C9', '#CFE6FF', '#D7F2C8', '#E9D8FF'];
    for (let i = 0; i < 16; i++) {
      const x = rr() * W, y = rr() * tableY * .95, r = 10 + rr() * 34;
      c.globalAlpha = .35; c.fillStyle = cols[i % cols.length]; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
      c.globalAlpha = .5; c.fillStyle = '#fff'; c.beginPath(); c.arc(x - r * .3, y - r * .3, r * .28, 0, TAU); c.fill();
    }
    c.globalAlpha = 1;
    // إطار سبورة صغير خلفي (لوح فلّين)
    // الطاولة
    g = c.createLinearGradient(0, tableY, 0, H); g.addColorStop(0, '#E9A866'); g.addColorStop(.06, '#D98F4C'); g.addColorStop(1, '#B86F33');
    c.fillStyle = g; c.fillRect(0, tableY, W, H - tableY);
    c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(0, tableY, W, 3);
    c.strokeStyle = 'rgba(120,60,20,.14)'; c.lineWidth = 2;
    for (let y = tableY + 18; y < H; y += 22) { c.beginPath(); for (let x = 0; x <= W; x += 30) c.lineTo(x, y + Math.sin(x * .02 + y) * 3); c.stroke(); }
    return cnv;
  }
  function woodRect(c, x, y, w, h, r, vertical) {
    const g = vertical ? c.createLinearGradient(x, 0, x + w, 0) : c.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, '#E7A060'); g.addColorStop(.35, '#C97A3A'); g.addColorStop(.7, '#A85E26'); g.addColorStop(1, '#7E4318');
    c.fillStyle = g; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill();
    c.save(); c.beginPath(); c.roundRect(x, y, w, h, r); c.clip();
    c.strokeStyle = 'rgba(90,40,10,.18)'; c.lineWidth = 1.3;
    if (vertical) for (let k = 1; k < 4; k++) { const xx = x + w * k / 4; c.beginPath(); for (let yy = y; yy <= y + h; yy += 12) c.lineTo(xx + Math.sin(yy * .05 + k * 2) * w * .06, yy); c.stroke(); }
    else for (let k = 1; k < 4; k++) { const yy = y + h * k / 4; c.beginPath(); for (let xx = x; xx <= x + w; xx += 12) c.lineTo(xx, yy + Math.sin(xx * .04 + k * 2) * h * .07); c.stroke(); }
    // لمعة
    const hg = vertical ? c.createLinearGradient(x, 0, x + w, 0) : c.createLinearGradient(0, y, 0, y + h);
    hg.addColorStop(0, 'rgba(255,255,255,0)'); hg.addColorStop(.25, 'rgba(255,240,220,.45)'); hg.addColorStop(.45, 'rgba(255,255,255,0)');
    c.fillStyle = hg; c.fillRect(x, y, w, h);
    c.restore();
  }
  function beadPath(c, x, y, w, h) {
    const f = h * .17;
    c.beginPath();
    c.moveTo(x - w * .5, y - f);
    c.bezierCurveTo(x - w * .5, y - h * .36, x - w * .2, y - h * .5, x, y - h * .5);
    c.bezierCurveTo(x + w * .2, y - h * .5, x + w * .5, y - h * .36, x + w * .5, y - f);
    c.lineTo(x + w * .5, y + f);
    c.bezierCurveTo(x + w * .5, y + h * .36, x + w * .2, y + h * .5, x, y + h * .5);
    c.bezierCurveTo(x - w * .2, y + h * .5, x - w * .5, y + h * .36, x - w * .5, y + f);
    c.closePath();
  }
  function drawBead(c, x, y, w, h, col, alpha, hl) {
    c.globalAlpha = alpha;
    let g = c.createLinearGradient(x - w * .5, y - h * .5, x + w * .5, y + h * .5);
    g.addColorStop(0, mix(col, '#ffffff', .45)); g.addColorStop(.42, col); g.addColorStop(1, mix(col, '#000000', .38));
    beadPath(c, x, y, w, h); c.fillStyle = g; c.fill();
    // حافة سفلية داكنة وحزام الاستواء
    g = c.createLinearGradient(0, y - h * .5, 0, y + h * .5);
    g.addColorStop(0, 'rgba(255,255,255,.28)'); g.addColorStop(.48, 'rgba(255,255,255,0)'); g.addColorStop(.52, 'rgba(0,0,0,.06)'); g.addColorStop(1, 'rgba(0,0,0,.25)');
    c.fillStyle = g; c.fill();
    c.strokeStyle = mix(col, '#000000', .45); c.globalAlpha = alpha * .55; c.lineWidth = Math.max(1, w * .05); c.stroke();
    c.globalAlpha = alpha;
    // اللمعة
    c.fillStyle = 'rgba(255,255,255,.75)';
    c.beginPath(); c.ellipse(x - w * .17, y - h * .27, w * .12, h * .09, -.5, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.4)';
    c.beginPath(); c.ellipse(x + w * .2, y + h * .22, w * .06, h * .05, -.5, 0, TAU); c.fill();
    if (hl > 0) {
      c.globalAlpha = hl * .9; c.strokeStyle = '#FFE14D'; c.lineWidth = 3.5; beadPath(c, x, y, w + 5, h + 5); c.stroke();
    }
    c.globalAlpha = 1;
  }
  function drawAbacus(c) {
    if (!geo) return;
    const { d, pw, rail, rowH, Lw, fw, fh, fx, fy, bh, x0 } = geo;
    // ظل الإطار على الطاولة والجدار
    c.fillStyle = 'rgba(110,50,10,.16)'; c.beginPath(); c.ellipse(fx + fw / 2, fy + fh + rail * .3, fw * .55, rail * .7 + 6, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(110,50,10,.07)'; c.beginPath(); c.roundRect(fx + 10, fy + 12, fw, fh, rail); c.fill();
    // لوح خلفي فاتح
    const g = c.createLinearGradient(0, fy, 0, fy + fh); g.addColorStop(0, 'rgba(255,250,240,.9)'); g.addColorStop(1, 'rgba(255,236,210,.9)');
    c.fillStyle = g; c.beginPath(); c.roundRect(x0 - 2, fy + rail * .5, Lw + 4, fh - rail, 6); c.fill();
    // علامة منتصف الخمسات على اللوح
    c.strokeStyle = 'rgba(200,140,80,.25)'; c.lineWidth = 2; c.setLineDash([4, 6]);
    const mx = xOfU(d * 5); c.beginPath(); c.moveTo(mx, fy + rail); c.lineTo(mx, fy + fh - rail); c.stroke(); c.setLineDash([]);
    // الأسلاك
    rows.forEach((r, ri) => {
      const y = fy + rail + rowH * (ri + .5);
      c.strokeStyle = '#8D97A6'; c.lineWidth = Math.max(2.5, d * .14); c.lineCap = 'round';
      c.beginPath(); c.moveTo(x0 - 2, y); c.lineTo(x0 + Lw + 2, y); c.stroke();
      c.strokeStyle = '#E9EEF5'; c.lineWidth = Math.max(1, d * .05);
      c.beginPath(); c.moveTo(x0, y - d * .03); c.lineTo(x0 + Lw, y - d * .03); c.stroke();
    });
    // ظلال الخرز
    rows.forEach((r, ri) => r.beads.forEach((b, i) => {
      const p = beadXY(ri, i);
      c.fillStyle = 'rgba(110,50,10,.16)'; beadPath(c, p.x + d * .12, p.y + bh * .1, d * .98, bh); c.fill();
    }));
    // الخرز
    rows.forEach((r, ri) => {
      const g2 = g2Col(r);
      r.beads.forEach((b, i) => {
        const p = beadXY(ri, i);
        let base = b.grp === 1 ? g2 : r.col;
        if (i >= 5) base = mix(base, '#ffffff', .4);
        const sq = b.sq > 0 ? Math.sin(b.sq * Math.PI * 2) * .12 * b.sq : 0;
        const wob = b.wob > 0 ? Math.sin(b.wob * 28) * 3 * b.wob : 0;
        const dragK = drag && drag.ri === ri && drag.group.includes(i) ? 1.06 : 1;
        drawBead(c, p.x + wob, p.y, d * .98 * (1 + sq) * dragK, bh * (1 - sq * .6) * dragK, base, b.grp === 2 ? .45 : 1, b.hl);
      });
    });
    // الأعمدة الجانبية والقضبان
    woodRect(c, fx, fy - rail * .15, pw, fh + rail * .3, pw * .45, true);
    woodRect(c, fx + fw - pw, fy - rail * .15, pw, fh + rail * .3, pw * .45, true);
    woodRect(c, fx + pw * .4, fy, fw - pw * .8, rail, rail * .45, false);
    woodRect(c, fx + pw * .4, fy + fh - rail, fw - pw * .8, rail, rail * .45, false);
    // أقدام
    [fx + pw * .5, fx + fw - pw * .5].forEach(x => {
      const fg = c.createLinearGradient(0, fy + fh, 0, fy + fh + rail * .55); fg.addColorStop(0, '#9A5520'); fg.addColorStop(1, '#6E3712');
      c.fillStyle = fg; c.beginPath(); c.roundRect(x - pw * .95, fy + fh + rail * .1, pw * 1.9, rail * .5, rail * .25); c.fill();
    });
    // مسامير نحاسية
    [[fx + pw * .5, fy + rail * .5], [fx + fw - pw * .5, fy + rail * .5], [fx + pw * .5, fy + fh - rail * .5], [fx + fw - pw * .5, fy + fh - rail * .5]].forEach(([x, y]) => {
      const rg = c.createRadialGradient(x - 2, y - 2, 0, x, y, pw * .26); rg.addColorStop(0, '#FFF2B0'); rg.addColorStop(.6, '#E8B33C'); rg.addColorStop(1, '#A87314');
      c.fillStyle = rg; c.beginPath(); c.arc(x, y, pw * .24, 0, TAU); c.fill();
    });
  }
  function drawBubble(c) {
    if (!geo || !R || !bub.show) return;
    const { bx, by, br } = geo;
    const k = 1 + Math.sin(Math.min(1, bub.pop) * Math.PI) * .22;
    const v = phase === 'count' || !bub.q ? bub.v : null;
    c.save(); c.translate(bx, by); c.scale(k, k);
    c.fillStyle = 'rgba(140,70,20,.18)'; c.beginPath(); c.ellipse(0, br * .95, br * .8, br * .16, 0, 0, TAU); c.fill();
    c.fillStyle = '#F2A65A'; c.beginPath(); c.arc(0, 4, br, 0, TAU); c.fill();
    const g = c.createLinearGradient(0, -br, 0, br); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#FFF1DE');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, br, 0, TAU); c.fill();
    c.strokeStyle = '#FFD9AE'; c.lineWidth = 4; c.beginPath(); c.arc(0, 0, br - 2, 0, TAU); c.stroke();
    const t = v == null ? (isAr() ? '؟' : '?') : dg(v);
    c.font = `900 ${br * (t.length > 2 ? .82 : t.length > 1 ? 1.02 : 1.2)}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = '#F2B26E'; c.fillText(t, 0, br * .1 + 3);
    c.fillStyle = v == null ? '#C98A3A' : '#E0650C'; c.fillText(t, 0, br * .1);
    c.restore();
  }
  function drawParts(c) {
    for (const q of parts) {
      const a = clamp(q.life / q.max, 0, 1);
      c.globalAlpha = q.k === 'conf' ? Math.min(1, a * 2) : a;
      if (q.k === 'star') { c.fillStyle = q.c; starPath(c, q.x, q.y, q.r, q.rot); c.fill(); }
      else if (q.k === 'conf') { c.save(); c.translate(q.x, q.y); c.rotate(q.rot); c.fillStyle = q.c; c.fillRect(-q.r, -q.r * .45, q.r * 2, q.r * .9); c.restore(); }
      else if (q.k === 'ring') { c.strokeStyle = q.c; c.lineWidth = 4 * a; c.beginPath(); c.arc(q.x, q.y, q.r * (1.6 - a * .8), 0, TAU); c.stroke(); }
    }
    c.globalAlpha = 1;
  }
  function drawHand(c) {
    // يد إرشادية في أول جولة من المستوى الأول
    if (lvl !== 1 || qi !== 0 || phase !== 'play' || total() > 0 || drag || !geo) return;
    const ri = 0, row = rows[0]; if (!row) return;
    const t = (T % 1.8) / 1.8, k = ease.io(clamp(t * 1.4, 0, 1));
    const p0 = xOfU(uOf(row, 0, 0)), p1 = xOfU(uOf(row, 0, 1));
    const x = p0 + (p1 - p0) * k, y = geo.fy + geo.rail + geo.rowH * .5 + geo.bh * .45;
    c.globalAlpha = t > .85 ? (1 - t) / .15 : 1;
    c.font = `${Math.round(geo.d * 1.3)}px system-ui`; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillText('👆', x, y);
    c.globalAlpha = 1;
  }
  function render() {
    if (!ctx) return;
    const c = ctx;
    if (!bg) bg = buildBg();
    c.save();
    if (shake > .2) c.translate(rand(-shake, shake), rand(-shake, shake) * .5);
    c.drawImage(bg, 0, 0, W, H);
    drawAbacus(c);
    drawBubble(c);
    drawHand(c);
    drawParts(c);
    c.restore();
  }

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    if (timers.length) {
      const due = timers.filter(t => t.at <= T);
      if (due.length) { timers = timers.filter(t => t.at > T); due.forEach(t => t.fn()); }
    }
    let anyMove = !!drag;
    rows.forEach((r, ri) => r.beads.forEach(b => {
      if (b.tw) {
        const w = b.tw; w.t += dt; anyMove = true;
        if (w.t > 0) {
          const k = clamp(w.t / w.d, 0, 1);
          b.p = w.from + (w.to - w.from) * ease.out(k);
          if (k >= 1) { b.p = w.to; b.tw = null; b.sq = .3; clack(ri, w.lead); }
        }
      }
      b.hl = Math.max(0, b.hl - dt * 1.4); b.wob = Math.max(0, b.wob - dt * 2.2); b.sq = Math.max(0, b.sq - dt * 2.2);
    }));
    // العدد الظاهر في الفقاعة يتبع المجموع
    if (phase !== 'count') { const n = total(); if (n !== bub.v && (R && R.type !== 'read' || phase === 'solved')) { bub.v = n; } }
    bub.pop = bub.pop > 0 ? bub.pop + dt * 3 : 0; if (bub.pop > 1) bub.pop = 0;
    if (!anyMove) { settleT += dt; if (settleT > .28 && settleT - dt <= .28) onSettled(); }
    else settleT = 0;
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.life -= dt;
      if (q.life <= 0) { parts.splice(i, 1); continue; }
      q.vy += q.g * dt; q.x += q.vx * dt; q.y += q.vy * dt;
      if (q.rot != null) q.rot += (q.vr || 2) * dt;
    }
    shake *= Math.pow(.003, dt);
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

  /* ---------- الإدخال ---------- */
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  function hitBead(x, y) {
    if (!geo) return null;
    const { fy, rail, rowH, d } = geo;
    const ri = Math.floor((y - fy - rail) / rowH);
    if (ri < 0 || ri >= rows.length) return null;
    const row = rows[ri]; let bi = -1, bd = 1e9;
    row.beads.forEach((b, i) => { const p = beadXY(ri, i), dd = Math.abs(p.x - x); if (dd < bd) { bd = dd; bi = i; } });
    return bd < d * .9 ? { ri, i: bi } : null;
  }
  function inGap(x, y) {
    // لمس السلك الفارغ: يحرّك خرزة واحدة نحو المكان الملموس
    if (!geo) return null;
    const { fy, rail, rowH, x0, Lw } = geo;
    const ri = Math.floor((y - fy - rail) / rowH);
    if (ri < 0 || ri >= rows.length || x < x0 || x > x0 + Lw) return null;
    return ri;
  }
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused || !R) return;
    Sound.ac(true);
    const { x, y } = pos(e);
    if (phase !== 'play') return;
    const h = hitBead(x, y);
    if (!h) {
      const ri = inGap(x, y);
      if (ri != null) {
        const row = rows[ri], u = cLeft() ? x - geo.x0 : geo.x0 + geo.Lw - x;
        const m = u < uOf(row, row.n, 0) ? row.n - 1 : row.n + 1;
        tryMove(row, m, ri);
      }
      return;
    }
    const row = rows[h.ri];
    if (row.lock) { lockedWiggle(h.ri, h.i); return; }
    const counted = h.i < row.n;
    const group = counted ? range(h.i, row.n - 1) : range(row.n, h.i);
    drag = { ri: h.ri, i: h.i, counted, group, id: e.pointerId, sx: x, sy: y, moved: false, p0: row.beads[h.i].p };
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
  });
  const range = (a, b) => { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; };
  function lockedWiggle(ri, i) {
    const row = rows[ri]; row.beads.forEach((b, k) => { if (Math.abs(k - i) < 3) b.wob = .8 - Math.abs(k - i) * .2; });
    Sound.tone(700, .05, 'triangle', .07, -100);
  }
  function tryMove(row, m, ri) {
    if (!canSet(row, m)) {
      if (row.lock) { lockedWiggle(ri, Math.min(row.n, row.cap - 1)); return false; }
      const b = row.beads[clamp(m > row.n ? row.n : row.n - 1, 0, row.cap - 1)]; b.wob = 1;
      Sound.tone(500, .08, 'triangle', .08, -120);
      if (R.type === 'sub' && m > row.n) { /* لا يمكن إضافة خرز في الطرح */ }
      return false;
    }
    const opt = {};
    if (R.type === 'add' && stage === 1) opt.grp = 1;
    if (R.type === 'add' && stage === 1) opt.back = 0;
    if (R.type === 'sub') { opt.back = 2; opt.grp = 0; }
    setN(row, m, opt); vibrate(8);
    return true;
  }
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const { x, y } = pos(e), row = rows[drag.ri];
    if (!drag.moved && Math.abs(x - drag.sx) > 8) {
      // قبل السحب: تحقق من السماح بالحركة
      const m = drag.counted ? drag.i : drag.i + 1;
      if (!canSet(row, m)) { tryMove(row, m, drag.ri); drag = null; return; }
      drag.moved = true; Sound.tone(900, .04, 'sine', .06, 200); vibrate(6);
      drag.group.forEach(i => row.beads[i].tw = null);
    }
    if (drag.moved) {
      const dist = geo.Lw - geo.d * row.cap;
      const dx = (x - drag.sx) * (cLeft() ? -1 : 1); // موجب = نحو جهة العدّ
      const p = clamp(drag.p0 + dx / dist, 0, 1);
      drag.group.forEach(i => row.beads[i].p = p);
      if (!drag.clk && (p >= .98 || p <= .02) && Math.abs(p - drag.p0) > .5) { drag.clk = true; clack(drag.ri, true); }
    }
  });
  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const d = drag, row = rows[d.ri]; drag = null;
    if (!d.moved) {
      // لمس: يدفع المجموعة كلها
      tryMove(row, d.counted ? d.i : d.i + 1, d.ri);
      return;
    }
    const p = row.beads[d.i].p;
    const goCount = d.counted ? p > .55 : p > .45;
    const m = goCount ? (d.counted ? row.n : d.i + 1) : (d.counted ? d.i : row.n);
    const opt = {};
    if (R.type === 'add' && stage === 1) { opt.grp = 1; opt.back = 0; }
    if (R.type === 'sub') { opt.back = 2; opt.grp = 0; }
    const old = row.n;
    if (m !== old && canSet(row, m)) {
      // تثبيت مع إكمال الانزلاق
      row.n = m;
      d.group.forEach(i => {
        const b = row.beads[i], to = i < m ? 1 : 0;
        if (to === 1 && opt.grp != null) b.grp = opt.grp;
        if (to === 0 && opt.back != null) b.grp = opt.back;
        b.tw = { from: b.p, to, t: 0, d: .08 + Math.abs(to - b.p) * .2, ri: d.ri, lead: i === d.i && !d.clk };
      });
      vibrate(8);
    } else {
      d.group.forEach(i => { const b = row.beads[i], to = i < row.n ? 1 : 0; b.tw = { from: b.p, to, t: 0, d: .1 + Math.abs(to - b.p) * .2, ri: d.ri, lead: false }; });
    }
    settleT = 0;
  }
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);

  doneBtn.onclick = () => { Sound.ac(true); checkShow(); };
  spkBtn.onclick = () => { Sound.ac(true); if (R && phase !== 'over') sayPrompt(); };
  ban.onclick = () => { if (R && phase !== 'over') sayPrompt(); };
  root.querySelectorAll('.lang button').forEach(b => b.onclick = () => {
    const l = b.dataset.l; if (l === lang) return;
    lang = l; store.set('abacusLang', l); Sound.tap(); paintLang();
    if (!R) return;
    computeGeo(); setBanner(); renderProg(); showCardsText();
    if (phase === 'play') sayPrompt();
  });
  function showCardsText() { cardsEl.querySelectorAll('.cd').forEach(b => b.textContent = dg(+b.dataset.v)); }
  function paintLang() { root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang)); }
  root.querySelector('.lvbtn').onclick = () => { Sound.tap(); openLevels(); };
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a; Sound.tap();
    if (a === 'close') { lvOv.classList.remove('on'); if (phase === 'over') winOv.classList.add('on'); }
    else if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
  });
  window.addEventListener('keydown', e => {
    if (App.current !== ID || paused || lvOv.classList.contains('on') || winOv.classList.contains('on') || !R) return;
    if (e.key === 'Enter') { if (R.type === 'show') checkShow(); else sayPrompt(); e.preventDefault(); }
    else if (e.key === ' ') { sayPrompt(); e.preventDefault(); }
    else if (/^[1-3]$/.test(e.key) && choices.length) { const b = cardsEl.children[+e.key - 1]; if (b) pickCard(b); }
    else if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') && phase === 'play') {
      const toCount = e.key === 'ArrowUp' || (e.key === 'ArrowLeft') === cLeft();
      if (toCount) { const ri = rows.findIndex(r => r.n < r.cap); if (ri >= 0) tryMove(rows[ri], rows[ri].n + 1, ri); }
      else { let ri = -1; rows.forEach((r, k) => { if (r.n > 0) ri = k; }); if (ri >= 0) tryMove(rows[ri], rows[ri].n - 1, ri); }
      e.preventDefault();
    }
  });
  let resizeT = 0;
  window.addEventListener('resize', () => {
    if (App.current !== ID) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createRadialGradient(s * .5, s * .3, s * .05, s * .5, s * .5, s * .8);
    g.addColorStop(0, '#FFF6E6'); g.addColorStop(.6, '#FFD9A8'); g.addColorStop(1, '#F7A85C');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    const sv = { geo, rows, lang, drag };
    lang = 'en'; drag = null;
    const d = s * .052;
    rows = [3, 7, 5].map((n, ri) => ({ n, cap: 10, col: ['#FF4D5E', '#3D8BFF', '#FFB31A'][ri], beads: Array.from({ length: 10 }, (_, i) => ({ p: i < n ? 1 : 0, grp: 0, hl: 0, wob: 0, sq: 0 })) }));
    const pw = d * .95, rail = d * .9, rowH = d * 2.05, Lw = 12.6 * d, fw = Lw + pw * 2, fh = 3 * rowH + rail * 2;
    geo = { d, pw, rail, rowH, Lw, fw, fh, fx: s / 2 - fw / 2, fy: s * .52 - fh / 2, bh: d * 1.6, x0: s / 2 - fw / 2 + pw };
    try { drawAbacus(c); } finally { geo = sv.geo; rows = sv.rows; lang = sv.lang; drag = sv.drag; }
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'عدّاد الخرز', icon2: '🧮', isNew: true, music: 'numbers',
    desc: () => App.g('حرّكي الخرز وتعلّمي العدّ والجمع', 'حرّك الخرز وتعلّم العدّ والجمع'),
    help: () => [
      '👆 ' + App.g('المسي', 'المس') + ' خرزة أو ' + App.g('اسحبيها', 'اسحبها') + ' على السلك فتنزلق معها الخرزات التي أمامها',
      '🔢 ' + App.g('اعرضي', 'اعرض') + ' العدد المطلوب ثم ' + App.g('اضغطي', 'اضغط') + ' «تم ✓»، أو ' + App.g('اختاري', 'اختر') + ' كم خرزة ترين',
      '➕➖ في الجمع ' + App.g('أضيفي', 'أضف') + ' خرزات، وفي الطرح ' + App.g('أرجعيها', 'أرجعها') + ' إلى الطرف الآخر',
      '💯 كل سلك ممتلئ = عشرة، فثلاثة أسلاك وسبع خرزات = ٣٧',
      '🔤 زر «عربي / English» يغيّر الأرقام والنطق، و🔊 يعيد السؤال'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 المستوى ${Math.max(...ks)} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      lang = store.get('abacusLang', 'ar') === 'en' ? 'en' : 'ar'; paintLang();
      layout();
      startLevel(Math.min(loadProg().unlocked, NL));
      render(); startLoop();
    },
    leave() { stopLoop(); clearLater(); drag = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { endDrag(); } },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { lvOv.classList.remove('on'); if (phase === 'over') winOv.classList.add('on'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() {
      return { lvl, qi, phase, stage, mistakes, lang, type: R && R.type, N: R && R.N, a: R && R.a, b: R && R.b, T: R && R.T, total: total(),
        rows: rows.map((r, ri) => ({ n: r.n, cap: r.cap, lock: r.lock, beads: r.beads.map((b, i) => beadXY(ri, i)) })), geo };
    },
    _go(l, q) { lvl = l; qi = q || 0; mistakes = 0; winOv.classList.remove('on'); lvOv.classList.remove('on'); startRound(); }
  });
})();
