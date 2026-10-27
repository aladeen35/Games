/* =====================================================================
   البطاريق — بطاريق لطيفة تحمل أرقامًا على بطونها
   ترتيب الأرقام بالسحب، الاستماع واللمس، الرقم الناقص، وعدّ الأسماك
   بالعربية (١٢٣) أو الإنجليزية (123)
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'penguins', TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';
  const AD = '٠١٢٣٤٥٦٧٨٩';
  const WAR = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
    'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر', 'عشرون'];
  const WEN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];

  /* المستويات: عدد البطاريق، مدى الأرقام، أنواع الجولات، مدى عدد الأسماك، خلط أماكن الاستماع */
  const LV = [
    { n: 3, lo: 1, hi: 3, k: ['order', 'listen', 'count', 'order', 'listen'], f: [1, 3] },
    { n: 3, lo: 1, hi: 5, k: ['order', 'missing', 'listen', 'count', 'order'], f: [2, 4] },
    { n: 4, lo: 1, hi: 5, k: ['order', 'listen', 'missing', 'count', 'order'], f: [3, 5] },
    { n: 5, lo: 1, hi: 5, k: ['order', 'missing', 'listen', 'count', 'order'], f: [3, 6] },
    { n: 6, lo: 1, hi: 6, k: ['order', 'listen', 'missing', 'count', 'order'], f: [4, 7], mix: true },
    { n: 6, lo: 1, hi: 10, k: ['order', 'missing', 'listen', 'count', 'missing'], f: [5, 8], mix: true },
    { n: 8, lo: 1, hi: 10, k: ['order', 'listen', 'missing', 'count', 'order'], f: [5, 9], mix: true },
    { n: 10, lo: 1, hi: 10, k: ['order', 'missing', 'listen', 'count', 'order'], f: [6, 10], mix: true },
    { n: 6, lo: 1, hi: 15, k: ['order', 'listen', 'missing', 'count', 'order'], f: [6, 10], mix: true },
    { n: 6, lo: 5, hi: 20, k: ['order', 'missing', 'listen', 'count', 'missing'], f: [7, 12], mix: true },
    { n: 8, lo: 1, hi: 20, k: ['order', 'listen', 'missing', 'count', 'order'], f: [8, 12], mix: true },
    { n: 10, lo: 11, hi: 20, k: ['order', 'missing', 'listen', 'count', 'order'], f: [8, 12], mix: true }
  ];
  const NL = LV.length, ROUNDS = 5;
  const BEADS = ['#FF5A7A', '#FFC21A', '#3BC14A', '#3A86FF', '#B266FF', '#FF8A3D'];
  const FISHC = [['#FFB347', '#E8700C'], ['#5EDBD0', '#139087'], ['#FF8FC0', '#D93C79'], ['#9FB6FF', '#4566DB']];
  const TICON = { order: '↔️', listen: '👂', missing: '❓', count: '🐟' };

  /* ---------- أدوات ---------- */
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const ease = {
    io: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    outBack: t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    outCubic: t => 1 - Math.pow(1 - t, 3)
  };
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  function mix(a, b, t) { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; }
  const loadProg = () => { const p = store.get('penguinsProg', null) || {}; return { unlocked: clamp(p.unlocked || 1, 1, NL), stars: p.stars || {} }; };
  function starPath(c, x, y, s, rot = 0) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + rot + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); }

  let lang = 'ar';
  const isAr = () => lang === 'ar';
  const numTxt = n => isAr() ? String(n).replace(/\d/g, d => AD[d]) : String(n);
  function say(ar, en) { if (isAr()) App.speak(ar); else App.speak(en, 'en'); }
  const sayNum = n => say(WAR[n], WEN[n]);
  const praise = () => say(App.g('أحسنتِ!', 'أحسنت!'), 'Great job!');
  const tryAgain = () => say(App.g('حاولي مرة أخرى', 'حاول مرة أخرى'), 'Try again!');

  /* ---------- الواجهة ---------- */
  App.css(`
  #penguins{background:#E6ECFB;overflow:hidden}
  #penguins canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #penguins .ib{color:#2B3C7E}
  #penguins .chip{color:#2B3C7E;min-width:60px}
  #penguins .chip b{color:#3A55C4;font-size:17px}
  #penguins .lang{display:flex;background:rgba(255,255,255,.94);border-radius:99px;padding:3px;gap:2px;box-shadow:0 3px 0 rgba(0,0,0,.12)}
  #penguins .lang button{min-width:46px;height:38px;border-radius:99px;font-weight:900;font-size:17px;color:#7584B8;background:transparent;padding:0 8px;line-height:1;transition:background .2s,color .2s}
  #penguins .lang button.on{background:linear-gradient(#6C8BF2,#3A55C4);color:#fff;box-shadow:0 3px 0 #263C91,inset 0 2px 0 rgba(255,255,255,.35)}
  #penguins .ban{position:absolute;z-index:4;top:calc(max(10px,env(safe-area-inset-top)) + 56px);left:50%;transform:translateX(-50%);width:min(calc(100% - 24px),540px);
    background:#fff;border:4px solid #C9D7FF;border-radius:24px;box-shadow:0 5px 0 #93A9EA,0 12px 24px rgba(40,60,140,.14);padding:5px 14px;color:#24346E;
    font-weight:900;font-size:clamp(17px,4.8vw,23px);min-height:52px;display:flex;align-items:center;justify-content:center;text-align:center;line-height:1.25;cursor:pointer;transition:opacity .3s}
  #penguins .ban.off{opacity:0;pointer-events:none}
  #penguins .ban.bump{animation:pgBump .5s}
  @keyframes pgBump{30%{transform:translateX(-50%) scale(1.06)}}
  #penguins .foot{position:absolute;left:0;right:0;bottom:0;z-index:4;padding:0 14px max(12px,env(safe-area-inset-bottom));display:flex;flex-direction:column;align-items:center;gap:10px;pointer-events:none}
  #penguins .ctl{width:min(100%,560px);display:flex;align-items:center;justify-content:center;position:relative;height:64px}
  #penguins .done{pointer-events:auto;height:58px;padding:0 34px;border-radius:99px;font-size:25px;font-weight:900;color:#fff;letter-spacing:.5px;
    background:linear-gradient(#78E584,#2DB84A);box-shadow:0 6px 0 #1E8A35,0 12px 20px rgba(20,120,40,.28),inset 0 3px 0 rgba(255,255,255,.45);
    text-shadow:0 2px 0 rgba(0,90,20,.35);transition:transform .25s cubic-bezier(.3,1.6,.6,1),opacity .2s}
  #penguins .done:active{transform:translateY(4px);box-shadow:0 2px 0 #1E8A35}
  #penguins .done.wait{filter:saturate(.4);opacity:.7}
  #penguins .done.off{opacity:0;transform:scale(.5);pointer-events:none}
  #penguins .spk{pointer-events:auto;position:absolute;right:0;top:3px;width:58px;height:58px;border-radius:50%;
    background:radial-gradient(circle at 35% 28%,#FFF6B8,#FFD21E 48%,#F0A400);box-shadow:0 5px 0 #C98500,0 10px 18px rgba(160,100,0,.28),inset 0 2px 0 rgba(255,255,255,.6);
    font-size:25px;display:grid;place-items:center}
  #penguins .spk:active{transform:translateY(3px);box-shadow:0 2px 0 #C98500}
  #penguins .spk.talk{animation:pgTalk .5s}
  @keyframes pgTalk{30%{transform:scale(1.15)}60%{transform:scale(.95)}}
  #penguins .dots{display:flex;gap:7px;background:rgba(255,255,255,.8);padding:7px 12px;border-radius:99px;box-shadow:0 2px 0 rgba(40,60,140,.12)}
  #penguins .dots i{width:11px;height:11px;border-radius:50%;background:#C9D3EE;transition:all .3s}
  #penguins .dots i.on{background:#5B7BEA}
  #penguins .dots i.cur{background:#FFC21A;transform:scale(1.35);box-shadow:0 0 0 2px #fff}
  #penguins .overlay{background:rgba(30,50,110,.35)}
  #penguins .panel{border-color:#D3DFFF;box-shadow:0 8px 0 #93A9EA,0 20px 40px rgba(20,40,110,.3);color:#24346E}
  #penguins .panel h3{color:#3A55C4}
  #penguins .btn{background:#4C6FE0;box-shadow:0 4px 0 #2E4BB0}
  #penguins .btn:active{box-shadow:0 1px 0 #2E4BB0}
  #penguins .btn.alt{background:#fff;color:#3A55C4;box-shadow:0 4px 0 #BCCBF5;border-color:#DCE5FF}
  #penguins .lvp{width:min(94vw,440px);padding-bottom:14px}
  #penguins .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:10px 0 14px;max-height:62vh;overflow-y:auto;padding:6px 4px 12px;touch-action:pan-y}
  #penguins .lv{position:relative;aspect-ratio:1;border-radius:20px;background:linear-gradient(#FFFFFF,#DCE5FF);box-shadow:0 5px 0 #9DB2EE,inset 0 2px 0 #fff;
    color:#2B3C7E;font-weight:900;font-size:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
  #penguins .lv:active{transform:translateY(3px);box-shadow:0 2px 0 #9DB2EE}
  #penguins .lv small{font-size:11px;font-weight:800;opacity:.75;margin-top:3px}
  #penguins .lv .s{font-size:11px;letter-spacing:-1px;margin-top:3px;min-height:12px}
  #penguins .lv .s i{font-style:normal}
  #penguins .lv .s i.off{filter:grayscale(1);opacity:.3}
  #penguins .lv.cur{background:linear-gradient(#FFF8CC,#FFD84A);box-shadow:0 5px 0 #D9A400,0 0 0 3px #fff}
  #penguins .lv.lock{opacity:.55;filter:grayscale(.6)}
  #penguins .lv.lock::after{content:'🔒';position:absolute;bottom:-4px;right:-4px;font-size:16px}
  `);

  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية" data-al="Home">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة" data-al="Help">❓</button>
      <button class="ib lvbtn" aria-label="المستويات" data-al="Levels">🗺️</button>
      <span class="grow"></span>
      <div class="lang" role="group" aria-label="اللغة" data-al="Language"><button data-l="ar">١٢٣</button><button data-l="en">123</button></div>
      <div class="chip"><small data-en="Level">المستوى</small><b class="cLv">1</b></div>
    </div>
    <div class="ban off" role="button" aria-label="إعادة السؤال" data-al="Repeat the question"><span class="bt"></span></div>
    <div class="foot">
      <div class="ctl">
        <button class="done off" aria-label="تم" data-al="Done" data-en="Done ✓">تم ✓</button>
        <button class="spk" aria-label="إعادة الصوت" data-al="Repeat the sound">🔊</button>
      </div>
      <div class="dots"></div>
    </div>
    <div class="overlay" id="pgLv"><div class="panel lvp"><h3 data-en="🗺️ Levels">🗺️ المستويات</h3>
      <div class="grid"></div>
      <button class="btn alt" data-a="close" data-en="✕ Close">✕ إغلاق</button></div></div>
    <div class="overlay" id="pgWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next" data-en="Next ▶️">التالي ▶️</button><br>
      <button class="btn alt" data-a="again" aria-label="من جديد" data-al="Restart">🔄</button><button class="btn alt" data-a="levels" data-en="🗺️ Levels">🗺️ المستويات</button><button class="btn alt home" aria-label="الرئيسية" data-al="Home">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const ban = root.querySelector('.ban'), banT = root.querySelector('.bt'), foot = root.querySelector('.foot');
  const doneBtn = root.querySelector('.done'), spkBtn = root.querySelector('.spk'), dotsEl = root.querySelector('.dots');
  const lvOv = root.querySelector('#pgLv'), winOv = root.querySelector('#pgWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, portrait = true;
  let ax = 0, aw = 0, topY = 0, botY = 0, hz = 0, chTop = 0, bg = null;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, qi = 0, R = null, mistakes = 0, phase = 'idle', fails = 0, wrongTaps = 0, hint = false;
  let pens = [], slots = [], choices = [], parts = [], flakes = [], flies = [], timers = [];
  let shake = 0, sel = null, drag = null, countN = 0, hover = -1, dirSign = -1;

  function later(s, fn) { timers.push({ at: T + s, fn }); }
  function clearLater() { timers = []; }

  /* ---------- توليد الجولات ---------- */
  function makeChoices(ans, mn, mx) {
    const c = [ans], cand = shuffle([ans - 1, ans + 1, ans - 2, ans + 2]).concat([ans + 3, ans - 3, ans + 4]);
    for (const v of cand) { if (c.length >= 3) break; if (v >= mn && v <= mx && !c.includes(v)) c.push(v); }
    for (let v = mn; c.length < 3; v++) if (!c.includes(v)) c.push(v);
    return shuffle(c);
  }
  function derange(n) {
    const a = Array.from({ length: n }, (_, i) => i);
    if (n < 2) return a;
    for (let g = 0; g < 200; g++) { shuffle(a); if (a.every((v, i) => v !== i)) return a; }
    return a.map((_, i) => (i + 1) % n);
  }
  function genRound(L, type) {
    const r = { type };
    if (type === 'count') {
      const K = ri(L.f[0], L.f[1]), np = clamp(Math.ceil(K / 2), 2, 6), fish = new Array(np).fill(0);
      let left = K;
      if (K >= np) { fish.fill(1); left -= np; }
      let guard = 0;
      while (left > 0 && guard++ < 999) { const i = ri(0, np - 1); if (fish[i] < 3) { fish[i]++; left--; } }
      r.K = K; r.fish = fish; r.vals = fish.map((_, i) => i + 1); r.ch = makeChoices(K, 1, 20);
      return r;
    }
    const n = L.n, s = ri(L.lo, Math.max(L.lo, L.hi - n + 1));
    r.vals = Array.from({ length: n }, (_, i) => s + i);
    if (type === 'listen') { r.target = pick(r.vals); r.mix = !!L.mix; }
    if (type === 'missing') { r.blankI = ri(0, n - 1); r.ch = makeChoices(r.vals[r.blankI], 1, 20); }
    return r;
  }
  function mkPen(v) {
    return { v, slot: 0, x: 0, y: 0, u: 60, mv: null, walk: 0, moving: false, hopT: -1, hopH: .5, sq: 0, shiverT: 0, coldT: 0, happyT: 0,
      flapT: 0, blinkAt: T + rand(.5, 4), blinkT: 0, ph: rand(0, TAU), ok: false, blank: false, fish: 0, cnt: [], wob: 0, dvx: 0, lx: 0 };
  }

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    portrait = W / H < 1.05;
    topY = ban.getBoundingClientRect().bottom + 6;
    if (topY < 60) topY = (root.querySelector('.bar').getBoundingClientRect().bottom || 60) + 64;
    botY = root.querySelector('.ctl').getBoundingClientRect().top - 6;
    aw = Math.min(W - 20, 1000); ax = (W - aw) / 2;
    hz = Math.round(topY + (botY - topY) * (portrait ? .25 : .2));
    chTop = botY - clamp(Math.min(W * .3, H * .17), 92, 128);
    bg = null;
    if (!flakes.length) for (let i = 0; i < 46; i++) flakes.push({ x: Math.random(), y: Math.random(), r: rand(1.2, 3.4), s: rand(.02, .06), ph: rand(0, TAU) });
  }
  function geom(snap) {
    const n = pens.length; if (!n) return;
    dirSign = isAr() ? -1 : 1;
    const hasCh = choices.length > 0;
    const zy = hz + 6, zb = (hasCh ? chTop : botY) - 6, zh = zb - zy;
    const maxU = portrait ? 132 : 140, wf = R && R.type === 'count' ? 1.85 : 1.14;
    let best = null;
    for (const Rr of [1, 2]) {
      if (Rr === 2 && n < 4) continue;
      const C = Math.ceil(n / Rr);
      const u = Math.min(aw / C / wf, zh / Rr / (Rr === 1 ? 1.5 : 1.32), maxU);
      if (!best || u > best.u * 1.2) best = { Rr, C, u };
    }
    const { Rr, C, u } = best;
    slots = [];
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / C), inRow = Math.min(C, n - r * C), col = i - r * C;
      const sc = Rr === 2 && r === 0 ? .88 : 1;
      const cw = Math.min(aw / C, u * Math.max(1.32, wf)) * sc;
      let y;
      if (Rr === 1) y = Math.min(zb - u * .14, zy + zh * .5 + u * .66);
      else {
        const gap = u * (R && R.type === 'count' ? 1.62 : 1.42), bh = u * 1.15 + gap, top = zy + Math.max(0, (zh - bh - u * .1) / 2);
        y = r === 0 ? top + u * 1.15 : Math.min(zb - u * .14, top + u * 1.15 + gap);
      }
      slots.push({ x: ax + aw / 2 + (col - (inRow - 1) / 2) * cw * dirSign, y, u: u * sc, row: r });
    }
    // خيارات الأسماك
    if (hasCh) {
      const ch = botY - chTop, L = Math.min(aw / 3.5, 150, ch * 1.45), gap = Math.min(aw / 3, L * 1.3);
      choices.forEach((c, i) => { c.L = L; c.x = ax + aw / 2 + (i - 1) * gap * dirSign; c.y = chTop + ch * .5; });
    }
    pens.forEach(p => {
      const s = slots[p.slot]; p.u = s.u;
      if (snap) { p.x = s.x; p.y = s.y; p.mv = null; }
      else if (!p.drag) moveTo(p, s.x, s.y, .45, true);
    });
  }
  function moveTo(p, x, y, d, walk) {
    if (Math.abs(p.x - x) < 1 && Math.abs(p.y - y) < 1) { p.x = x; p.y = y; p.mv = null; return; }
    p.mv = { fx: p.x, fy: p.y, tx: x, ty: y, t: 0, d, walk };
  }
  function hop(p, h = .5) { p.hopT = 0; p.hopH = h; }

  /* ---------- الجولات ---------- */
  function setBanner() {
    const t = R.type, a = R.vals[0], b = R.vals[R.vals.length - 1];
    let s = '';
    /* السؤال بلغة المحتوى (مفتاح ١٢٣ / 123) مثل النطق */
    const en = !isAr();
    if (t === 'order') s = en ? `🐧 Put the penguins in order from ${a} to ${b}` : `🐧 ${App.g('رتّبي', 'رتّب')} البطاريق من ${numTxt(a)} إلى ${numTxt(b)}`;
    else if (t === 'listen') s = en ? '👂 Listen and tap the right penguin' : `👂 ${App.g('استمعي', 'استمع')} ${App.g('والمسي', 'والمس')} البطريق الصحيح`;
    else if (t === 'missing') s = en ? '🐟 Which number is missing?' : '🐟 أيّ رقم ناقص؟';
    else s = en ? '🐟 How many fish are with the penguins?' : '🐟 كم سمكة مع البطاريق؟';
    ban.style.direction = en ? 'ltr' : 'rtl';
    banT.textContent = s;
    ban.classList.remove('off', 'bump'); void ban.offsetWidth; ban.classList.add('bump');
  }
  function sayPrompt() {
    if (!R || phase === 'over') return;
    spkBtn.classList.remove('talk'); void spkBtn.offsetWidth; spkBtn.classList.add('talk');
    const t = R.type;
    if (t === 'order') say(App.g('رتّبي البطاريق', 'رتّب البطاريق'), 'Put the penguins in order');
    else if (t === 'listen') say(App.g('ابحثي عن', 'ابحث عن') + ' ' + WAR[R.target], 'Find number ' + WEN[R.target]);
    else if (t === 'missing') say('أيّ رقم ناقص؟', 'Which number is missing?');
    else say('كم سمكة؟', 'How many fish?');
  }
  function renderDots() {
    dotsEl.innerHTML = Array.from({ length: ROUNDS }, (_, i) => `<i class="${i < qi ? 'on' : i === qi ? 'cur' : ''}"></i>`).join('');
  }
  function updChips() { root.querySelector('.cLv').textContent = numTxt(lvl); }
  function showDone(on) { doneBtn.classList.toggle('off', !on); }

  function startRound() {
    clearLater(); sel = null; drag = null; hint = false; fails = 0; wrongTaps = 0; countN = 0; flies = []; hover = -1;
    const L = LV[lvl - 1], type = L.k[qi];
    R = genRound(L, type);
    pens = R.vals.map(v => mkPen(v));
    if (type === 'order') { const perm = derange(pens.length); pens.forEach((p, i) => p.slot = perm[i]); }
    else if (type === 'listen' && R.mix) { const perm = shuffle(pens.map((_, i) => i)); pens.forEach((p, i) => p.slot = perm[i]); }
    else pens.forEach((p, i) => p.slot = i);
    if (type === 'missing') pens[R.blankI].blank = true;
    if (type === 'count') pens.forEach((p, i) => p.fish = R.fish[i]);
    choices = R.ch ? R.ch.map((v, i) => ({ v, ci: (i + qi + lvl) % FISHC.length, x: 0, y: 0, L: 100, at: 0, wob: 0, wt: 0, st: 'idle', glow: 0 })) : [];
    geom(true);
    // الدخول مشيًا من جانب المشهد
    const side = dirSign < 0 ? 1 : -1; // عربي: من اليمين
    const order = pens.slice().sort((a, b) => a.slot - b.slot);
    order.forEach((p, k) => {
      const tx = p.x, ty = p.y;
      p.x = side > 0 ? W + p.u * (1 + k * .35) : -p.u * (1 + k * .35);
      moveTo(p, tx, ty, .9 + Math.abs(tx - p.x) / Math.max(W, 1) * .55, true);
    });
    const arrive = .9 + .55 * 1.4;
    choices.forEach((c, i) => c.at = T + arrive * .6 + i * .12);
    phase = 'enter';
    setBanner(); renderDots(); updChips(); showDone(type === 'order');
    doneBtn.classList.add('wait');
    Sound.whoosh();
    later(arrive, () => { phase = 'play'; doneBtn.classList.remove('wait'); sayPrompt(); });
  }
  function startLevel(n) {
    lvl = clamp(n, 1, NL); qi = 0; mistakes = 0; parts = [];
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    layout(); startRound();
  }
  function roundSolved(delay) {
    qi++; renderDots();
    if (qi >= ROUNDS) { later(delay * .7, win); return; }
    later(delay, () => {
      phase = 'exit'; showDone(false);
      const side = dirSign < 0 ? -1 : 1; // يخرجون من الجهة الأخرى
      pens.forEach((p, k) => { p.happyT = 0; moveTo(p, side > 0 ? W + p.u * (1.2 + k * .2) : -p.u * (1.2 + k * .2), p.y, .85, true); });
      choices.forEach(c => { if (c.st !== 'gone') c.st = 'out'; c.ot = T; });
      Sound.whoosh();
      later(.95, startRound);
    });
  }
  const starsFor = m => m === 0 ? 3 : m <= 2 ? 2 : 1;
  function win() {
    phase = 'over'; showDone(false); ban.classList.add('off');
    const pr = loadProg(), stars = starsFor(mistakes), prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(NL, lvl + 1);
    store.set('penguinsProg', pr);
    confetti(150); Sound.win(); vibrate(30);
    pens.forEach((p, i) => later(i * .08, () => { hop(p, .7); p.happyT = 3; }));
    later(1.3, () => {
      if (App.current !== ID) return;
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      winText();
      root.querySelector('[data-a="next"]').style.display = lvl < NL ? '' : 'none';
      winOv.classList.add('on');
      praise();
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('penguins_first');
      if (!isAr()) App.achieve('penguins_en');
      if (Array.from({ length: NL }, (_, i) => pr.stars[i + 1]).every(Boolean)) App.achieve('penguins_all');
    });
  }
  function winText() {
    const uN = n => App.lang === 'en' ? String(n) : String(n).replace(/\d/g, d => AD[d]);
    root.querySelector('.wT').textContent = App.t(App.g('أحسنتِ!', 'أحسنت!'), 'Well done!') + ' 🎉';
    root.querySelector('.wP').textContent = App.t(App.g('أنهيتِ', 'أنهيتَ') + ` المستوى ${uN(lvl)}` + (mistakes ? ` · الأخطاء: ${uN(mistakes)}` : ' دون أي خطأ! 💯'),
      `You finished level ${lvl}` + (mistakes ? ` · Mistakes: ${mistakes}` : ' with no mistakes! 💯'));
  }
  /** ترجمة نصوص الواجهة الثابتة (data-en للنص، data-al لوصف الزر) */
  function trUI() {
    root.querySelectorAll('[data-en]').forEach(e => { if (e.dataset.ar == null) e.dataset.ar = e.textContent; e.textContent = App.t(e.dataset.ar, e.dataset.en); });
    root.querySelectorAll('[data-al]').forEach(e => { if (e.dataset.aral == null) e.dataset.aral = e.getAttribute('aria-label'); e.setAttribute('aria-label', App.t(e.dataset.aral, e.dataset.al)); });
  }
  function openLevels() {
    const pr = loadProg(), grid = root.querySelector('.grid');
    grid.innerHTML = LV.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lv${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="${App.t('المستوى', 'Level')} ${n}">${numTxt(n)}
        <small><span dir="ltr">${numTxt(L.lo)}–${numTxt(L.hi)}</span> · 🐧${numTxt(L.n)}</small>
        <span class="s">${lock ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    grid.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
  }

  /* ---------- اللعب ---------- */
  function check() {
    if (phase !== 'play' || !R || R.type !== 'order' || drag) return;
    Sound.tap(); phase = 'check'; sel = null; doneBtn.classList.add('wait');
    const ord = pens.slice().sort((a, b) => a.slot - b.slot);
    let allOk = true;
    ord.forEach((p, i) => {
      const good = p.v === R.vals[p.slot];
      if (!good) allOk = false;
      if (p.ok) return;
      later(i * .09, () => {
        if (good) { p.ok = true; hop(p, .45); p.happyT = 1.1; Sound.tone(520 + p.slot * 50, .1, 'triangle', .1); sparkle(p.x, p.y - p.u * .7, 6); }
        else { p.shiverT = 1.1; p.coldT = 1.4; Sound.noise(.45, 3400, 5200, .035, 5); puff(p); }
      });
    });
    const tEnd = ord.length * .09 + .45;
    if (allOk) { if (fails === 0 && pens.length >= 10) App.achieve('penguins_ten'); later(tEnd, solveOrder); }
    else {
      mistakes++; fails++; if (fails >= 2) hint = true;
      later(tEnd, () => { Sound.error(); vibrate(25); shake = 5; tryAgain(); });
      later(tEnd + .5, () => { if (phase === 'check') { phase = 'play'; doneBtn.classList.remove('wait'); } });
    }
  }
  function solveOrder() {
    phase = 'solved'; showDone(false);
    const ord = pens.slice().sort((a, b) => a.slot - b.slot);
    say(ord.map(p => WAR[p.v]).join(' '), ord.map(p => WEN[p.v]).join(' '));
    const step = clamp(.62 - ord.length * .015, .45, .6);
    ord.forEach((p, i) => later(i * step, () => {
      hop(p, .6); p.happyT = 1.2; Sound.tone(392 * Math.pow(2, Math.min(i, 14) / 12), .14, 'triangle', .12);
      sparkle(p.x, p.y - p.u * 1.2, 5);
    }));
    const tEnd = ord.length * step + .25;
    later(tEnd, () => { Sound.star(); setTimeout(() => Sound.coin(), 120); confetti(60); praise(); vibrate(25); });
    roundSolved(tEnd + 1.5);
  }
  function tapListen(p) {
    if (p.v === R.target) {
      phase = 'solved'; hop(p, .75); p.happyT = 1.6; Sound.star(); vibrate(20);
      sparkle(p.x, p.y - p.u * .8, 14); confetti(40); praise();
      pens.forEach(o => { if (o !== p) later(.3, () => { o.flapT = 1; }); });
      roundSolved(1.7);
    } else {
      mistakes++; wrongTaps++; if (wrongTaps >= 2) hint = true;
      p.shiverT = .9; p.coldT = 1.1; puff(p); Sound.error(); vibrate(20);
      sayNum(p.v);
      later(1.1, () => { if (phase === 'play') sayPrompt(); });
    }
  }
  function tapCount(p) {
    if (p.cnt.length < p.fish) {
      countN++; p.cnt.push(countN); p.flapT = 1; p.wob = .5;
      Sound.pop(); vibrate(8); sayNum(countN);
      const f = fishPos(p, p.cnt.length - 1);
      ring(f.x, f.y, '#FFD84A');
    } else { p.wob = 1; Sound.tone(880, .07, 'sine', .08, 300); }
  }
  function pickChoice(c) {
    if (phase !== 'play' || c.st === 'gone' || c.st === 'out') return;
    if (R.type === 'missing') {
      const p = pens.find(o => o.blank);
      if (c.v === p.v) {
        phase = 'solved'; c.st = 'gone'; Sound.whoosh();
        flies.push({ x0: c.x, y0: c.y, p, L0: c.L, ci: c.ci, v: c.v, t: 0, d: .6 });
      } else {
        mistakes++; wrongTaps++; if (wrongTaps >= 2) hint = true;
        c.wob = 1; c.wt = .9; p.shiverT = .8; p.coldT = 1; Sound.error(); vibrate(20); tryAgain();
      }
    } else if (R.type === 'count') {
      if (c.v === R.K) {
        phase = 'solved'; c.pop = 1; Sound.star(); vibrate(20);
        sparkle(c.x, c.y, 16); sayNum(R.K);
        pens.slice().sort((a, b) => a.slot - b.slot).forEach((p, i) => later(.15 + i * .12, () => { hop(p, .6); p.happyT = 1.4; }));
        later(1, () => { praise(); confetti(50); Sound.coin(); });
        roundSolved(2.4);
      } else {
        mistakes++; wrongTaps++; if (wrongTaps >= 2) hint = true;
        c.wob = 1; c.wt = .9; Sound.error(); vibrate(20);
        recount();
      }
    }
  }
  function recount() {
    phase = 'recount'; pens.forEach(p => p.cnt = []); countN = 0;
    say('لنعدّ معًا', "Let's count together");
    let d = 1.4, k = 0;
    pens.slice().sort((a, b) => a.slot - b.slot).forEach(p => {
      for (let j = 0; j < p.fish; j++) {
        const n = ++k;
        later(d, () => { p.cnt.push(n); countN = n; p.flapT = 1; Sound.pop(); sayNum(n); const f = fishPos(p, p.cnt.length - 1); ring(f.x, f.y, '#FFD84A'); });
        d += .72;
      }
    });
    later(d, () => { if (phase === 'recount') phase = 'play'; });
  }
  function swapPens(a, b) {
    const sa = a.slot; a.slot = b.slot; b.slot = sa;
    const s1 = slots[a.slot], s2 = slots[b.slot];
    a.u = s1.u; b.u = s2.u;
    moveTo(a, s1.x, s1.y, .32, true); moveTo(b, s2.x, s2.y, .42, true);
    Sound.slide(); Sound.tone(700, .08, 'sine', .08, 300);
  }

  /* ---------- مؤثرات ---------- */
  function sparkle(x, y, n) {
    for (let i = 0; i < n; i++) { const a = Math.random() * TAU, s = rand(80, 230); parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 80, g: 420, life: .9, max: .9, r: rand(4, 7), c: pick(['#FFD84A', '#FFF3A0', '#FF9FC6', '#9FD8FF']), k: 'star', rot: rand(0, 6) }); }
  }
  function puff(p) {
    for (let i = 0; i < 7; i++) parts.push({ x: p.x + rand(-p.u * .4, p.u * .4), y: p.y - p.u * rand(.4, 1.2), vx: rand(-40, 40), vy: rand(-70, -20), g: 30, life: .9, max: .9, r: rand(2, 4), c: '#BFE6FF', k: 'flake', rot: rand(0, 6) });
  }
  function confetti(n) {
    const cols = ['#FF5A7A', '#FFC21A', '#3BC14A', '#3A86FF', '#B266FF', '#FF8A3D', '#5EDBD0'];
    for (let i = 0; i < n; i++) parts.push({ x: rand(0, W), y: rand(-60, -10), vx: rand(-50, 50), vy: rand(60, 220), g: 160, life: 2.6, max: 2.6, r: rand(4, 7), c: pick(cols), k: 'conf', rot: rand(0, 6), vr: rand(-8, 8) });
  }
  function ring(x, y, c) { parts.push({ x, y, vx: 0, vy: 0, g: 0, life: .45, max: .45, r: 24, c, k: 'ring' }); }

  /* ---------- الرسم: المشهد ---------- */
  function lowTree(c, x, y, h) {
    const w = h * .56;
    c.fillStyle = 'rgba(90,110,170,.13)'; c.beginPath(); c.ellipse(x + w * .12, y + 2, w * .5, w * .11, 0, 0, TAU); c.fill();
    let g = c.createLinearGradient(x - w * .07, 0, x + w * .07, 0); g.addColorStop(0, '#B57440'); g.addColorStop(1, '#7E4A22');
    c.fillStyle = g; c.beginPath(); c.roundRect(x - w * .065, y - h * .24, w * .13, h * .25, 3); c.fill();
    c.lineJoin = 'round';
    for (let i = 0; i < 3; i++) {
      const base = y - h * .17 - i * h * .25, top = base - h * (.44 - i * .03), hw = w * (.5 - i * .1), dip = hw * .2;
      const L = mix('#7EE2C2', '#9AEBD2', i * .25), Rr = mix('#2FA889', '#3BB896', i * .2);
      c.fillStyle = 'rgba(30,110,90,.25)';
      c.beginPath(); c.moveTo(x, top + 3); c.lineTo(x - hw, base + 3); c.lineTo(x + hw * .12, base + dip + 3); c.lineTo(x + hw, base + 3); c.closePath(); c.fill();
      c.fillStyle = L; c.strokeStyle = L; c.lineWidth = 5;
      c.beginPath(); c.moveTo(x, top); c.lineTo(x - hw, base); c.lineTo(x + hw * .12, base + dip); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = Rr; c.strokeStyle = Rr;
      c.beginPath(); c.moveTo(x, top); c.lineTo(x + hw * .12, base + dip); c.lineTo(x + hw, base); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(x - 1, top + 3); c.lineTo(x - hw + 4, base - 1); c.stroke();
    }
  }
  function igloo(c, x, y, r, face) {
    c.fillStyle = 'rgba(90,110,170,.16)'; c.beginPath(); c.ellipse(x + r * .1, y + 3, r * 1.25, r * .2, 0, 0, TAU); c.fill();
    let g = c.createRadialGradient(x - r * .4, y - r * .75, r * .05, x, y - r * .3, r * 1.15);
    g.addColorStop(0, '#FFFFFF'); g.addColorStop(.55, '#EEF2FC'); g.addColorStop(1, '#C3CEEE');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, Math.PI, 0); c.closePath(); c.fill();
    c.save(); c.beginPath(); c.arc(x, y, r, Math.PI, 0); c.closePath(); c.clip();
    c.lineWidth = Math.max(1.2, r * .022); c.lineCap = 'round';
    const rows = 5;
    for (let k = 1; k <= rows; k++) {
      const yy = y - r * k / (rows + .3);
      c.strokeStyle = 'rgba(160,178,222,.75)';
      c.beginPath(); c.moveTo(x - r, yy + r * .05); c.quadraticCurveTo(x, yy - r * .07, x + r, yy + r * .05); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,.8)';
      c.beginPath(); c.moveTo(x - r, yy + r * .05 + 2); c.quadraticCurveTo(x, yy - r * .07 + 2, x + r, yy + r * .05 + 2); c.stroke();
      const y0 = y - r * (k - 1) / (rows + .3), hw = Math.sqrt(Math.max(0, r * r - (y - (yy + y0) / 2) ** 2));
      const nB = Math.max(2, Math.round(hw / (r * .22)));
      c.strokeStyle = 'rgba(160,178,222,.7)';
      for (let j = 0; j <= nB; j++) {
        const xx = x - hw + (j + (k % 2) * .5) * (hw * 2 / nB);
        if (xx < x - hw + 3 || xx > x + hw - 3) continue;
        c.beginPath(); c.moveTo(xx, y0 - 2); c.lineTo(xx, yy + 3); c.stroke();
      }
    }
    g = c.createLinearGradient(x + r * .2, 0, x + r, 0); g.addColorStop(0, 'rgba(120,140,200,0)'); g.addColorStop(1, 'rgba(120,140,200,.25)');
    c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r);
    c.restore();
    // المدخل
    const ex = x + face * r * .62, er = r * .42;
    g = c.createLinearGradient(0, y - er, 0, y); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#D3DCF3');
    c.fillStyle = g; c.beginPath(); c.arc(ex, y, er, Math.PI, 0); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(160,178,222,.7)'; c.lineWidth = Math.max(1, r * .02); c.stroke();
    g = c.createLinearGradient(0, y - er * .7, 0, y); g.addColorStop(0, '#41548C'); g.addColorStop(1, '#1D2753');
    c.fillStyle = g; c.beginPath(); c.arc(ex, y, er * .64, Math.PI, 0); c.closePath(); c.fill();
  }
  function buildBg() {
    const cnv = document.createElement('canvas'); cnv.width = Math.max(1, Math.round(W * dpr)); cnv.height = Math.max(1, Math.round(H * dpr));
    const c = cnv.getContext('2d'); c.scale(dpr, dpr);
    // السماء
    let g = c.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, '#B9C6F3'); g.addColorStop(.55, '#D9E0FA'); g.addColorStop(1, '#F2F4FD');
    c.fillStyle = g; c.fillRect(0, 0, W, hz + 4);
    g = c.createRadialGradient(W * .78, hz * .35, 0, W * .78, hz * .35, Math.max(W, hz) * .5);
    g.addColorStop(0, 'rgba(255,255,255,.75)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, W, hz);
    const Rn = rng(17 + Math.round(W) * 3 + Math.round(H));
    c.fillStyle = 'rgba(255,255,255,.7)';
    for (let i = 0; i < Math.max(3, W / 160); i++) {
      const cx = Rn() * W, cy = hz * (.25 + Rn() * .45), s = 14 + Rn() * 18;
      c.beginPath(); [[0, 0, 1], [1.1, -.35, 1.25], [2.3, 0, .95], [1.2, .25, 1]].forEach(([dx, dy, k]) => { c.moveTo(cx + dx * s + k * s, cy + dy * s); c.arc(cx + dx * s, cy + dy * s, k * s, 0, TAU); }); c.fill();
    }
    // تلال بعيدة
    c.fillStyle = '#E2E8FA';
    c.beginPath(); c.moveTo(0, hz + 4);
    for (let x = 0; x <= W + 20; x += 20) c.lineTo(x, hz - 18 - Math.sin(x * .011 + 1) * 12 - Math.sin(x * .029) * 6);
    c.lineTo(W, hz + 4); c.closePath(); c.fill();
    // الأرض
    g = c.createLinearGradient(0, hz, 0, H); g.addColorStop(0, '#FBFCFF'); g.addColorStop(.45, '#EFF3FD'); g.addColorStop(1, '#DCE3F7');
    c.fillStyle = g; c.fillRect(0, hz - 2, W, H - hz + 2);
    // الأشجار والإيغلو
    const th = clamp((hz - topY + 40) * 1.05, 80, 200);
    const igR = clamp(Math.min(aw * (portrait ? .2 : .13), th * .62), 46, 110);
    const igX = ax + aw * (portrait ? .2 : .16);
    const trees = [];
    for (let x = -10 + Rn() * 40; x < W + 30; x += th * (.42 + Rn() * .32)) {
      if (Math.abs(x - igX) < igR * .9 && Rn() < .7) continue;
      trees.push({ x, y: hz + 6 + Rn() * 10, h: th * (.72 + Rn() * .32), back: Rn() < .5 });
    }
    trees.filter(t => t.back).forEach(t => lowTree(c, t.x, t.y - 6, t.h * .82));
    igloo(c, igX, hz + igR * .22, igR, 1);
    trees.filter(t => !t.back).sort((a, b) => a.y - b.y).forEach(t => lowTree(c, t.x, t.y, t.h));
    // كثبان الثلج الأمامية
    c.fillStyle = '#FBFCFF';
    c.beginPath(); c.moveTo(0, H);
    for (let x = 0; x <= W + 24; x += 24) c.lineTo(x, hz + 14 + Math.sin(x * .018 + 2) * 4 + Math.sin(x * .05) * 2);
    c.lineTo(W, H); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(170,186,230,.35)'; c.lineWidth = 2; c.beginPath();
    for (let x = 0; x <= W + 24; x += 24) c.lineTo(x, hz + 14 + Math.sin(x * .018 + 2) * 4 + Math.sin(x * .05) * 2);
    c.stroke();
    g = c.createLinearGradient(0, hz + 10, 0, H); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(236,241,253,.6)'); g.addColorStop(1, 'rgba(206,216,244,.95)');
    c.fillStyle = g; c.fillRect(0, hz + 10, W, H - hz);
    // بريق الثلج
    for (let i = 0; i < W * H / 9000; i++) {
      const x = Rn() * W, y = hz + 20 + Rn() * (H - hz - 20), s = 1 + Rn() * 2.2;
      c.fillStyle = Rn() < .5 ? 'rgba(255,255,255,.95)' : 'rgba(170,195,255,.6)';
      c.beginPath(); c.moveTo(x, y - s * 2); c.lineTo(x + s * .5, y); c.lineTo(x, y + s * 2); c.lineTo(x - s * .5, y); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(x - s * 2, y); c.lineTo(x, y + s * .5); c.lineTo(x + s * 2, y); c.lineTo(x, y - s * .5); c.closePath(); c.fill();
    }
    // ظلال ناعمة على الجانبين لعمق المشهد
    g = c.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(120,140,210,.12)'); g.addColorStop(.15, 'rgba(120,140,210,0)'); g.addColorStop(.85, 'rgba(120,140,210,0)'); g.addColorStop(1, 'rgba(120,140,210,.12)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    return cnv;
  }

  /* ---------- الرسم: السمكة ---------- */
  function fishPath(c, L) {
    const h = L * .5;
    c.beginPath();
    c.moveTo(-L * .5, 0);
    c.bezierCurveTo(-L * .44, -h * .7, L * .1, -h * .78, L * .27, -h * .06);
    c.quadraticCurveTo(L * .4, -h * .5, L * .52, -h * .6);
    c.quadraticCurveTo(L * .4, 0, L * .52, h * .6);
    c.quadraticCurveTo(L * .4, h * .5, L * .27, h * .06);
    c.bezierCurveTo(L * .1, h * .78, -L * .44, h * .7, -L * .5, 0);
    c.closePath();
  }
  function drawFish(c, x, y, L, ci, rot, label, gray) {
    const [c1, c2] = FISHC[ci % FISHC.length], h = L * .5;
    c.save(); c.translate(x, y); c.rotate(rot || 0);
    // الزعنفة العلوية
    c.fillStyle = gray ? '#B9BFCF' : c2;
    c.beginPath(); c.moveTo(-L * .12, -h * .62); c.quadraticCurveTo(L * .02, -h * 1.1, L * .16, -h * .58); c.closePath(); c.fill();
    fishPath(c, L);
    const g = c.createLinearGradient(0, -h * .7, 0, h * .7);
    g.addColorStop(0, gray ? '#E3E6EE' : mix(c1, '#FFFFFF', .4)); g.addColorStop(.5, gray ? '#CBD0DC' : c1); g.addColorStop(1, gray ? '#A9B0C2' : c2);
    c.fillStyle = g; c.fill();
    c.lineWidth = Math.max(1, L * .025); c.strokeStyle = gray ? '#9298AA' : mix(c2, '#000000', .15); c.stroke();
    // لمعة
    c.save(); fishPath(c, L); c.clip();
    c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.ellipse(-L * .1, -h * .42, L * .26, h * .14, -.1, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = Math.max(1, L * .02);
    for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(L * (.08 + i * .07), 0, h * .5, -.9, .9); c.stroke(); }
    c.restore();
    // العين
    c.fillStyle = '#fff'; c.beginPath(); c.arc(-L * .3, -h * .1, L * .075, 0, TAU); c.fill();
    c.fillStyle = '#16204A'; c.beginPath(); c.arc(-L * .315, -h * .08, L * .045, 0, TAU); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(-L * .33, -h * .13, L * .017, 0, TAU); c.fill();
    c.strokeStyle = gray ? '#7D8394' : mix(c2, '#000000', .3); c.lineWidth = Math.max(1, L * .02); c.lineCap = 'round';
    c.beginPath(); c.arc(-L * .43, h * .12, L * .05, -.2, 1.2); c.stroke();
    if (label != null) {
      const cx = L * .04, r = h * .5;
      c.fillStyle = 'rgba(0,0,0,.12)'; c.beginPath(); c.arc(cx, r * .1, r, 0, TAU); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(cx, 0, r, 0, TAU); c.fill();
      c.rotate(-(rot || 0));
      const s = String(label); const fs = r * (s.length > 1 ? 1.15 : 1.4);
      c.font = `900 ${fs}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillStyle = gray ? '#8A90A2' : mix(c2, '#000000', .35);
      c.fillText(s, cx * Math.cos(rot || 0), r * .1 + cx * Math.sin(rot || 0));
    }
    c.restore();
  }

  /* ---------- الرسم: البطريق ---------- */
  function eggPath(c, Rw, yT, yB, cy) {
    c.beginPath();
    c.moveTo(0, yT);
    c.bezierCurveTo(Rw * .6, yT, Rw, cy - (cy - yT) * .52, Rw, cy);
    c.bezierCurveTo(Rw, cy + (yB - cy) * .62, Rw * .62, yB, 0, yB);
    c.bezierCurveTo(-Rw * .62, yB, -Rw, cy + (yB - cy) * .62, -Rw, cy);
    c.bezierCurveTo(-Rw, cy - (cy - yT) * .52, -Rw * .6, yT, 0, yT);
    c.closePath();
  }
  function flipAng(p) {
    const holding = R && R.type === 'count' && p.fish > 0;
    if (p.coldT > 0) return .08;
    if (p.happyT > 0 || p.hopT >= 0) return 2.25 + Math.sin(T * 22 + p.ph) * .35;
    if (p.drag) return 1.3 + Math.sin(T * 18) * .5;
    if (holding) return 2.5 + Math.sin(T * 3 + p.ph) * .08 + (p.flapT > 0 ? Math.sin(p.flapT * 16) * .25 * p.flapT : 0);
    if (p.flapT > 0) return .3 + Math.abs(Math.sin(p.flapT * 14)) * 1.1 * p.flapT;
    if (p.moving) return .45 + Math.sin(p.walk) * .15;
    return .3;
  }
  /* موضع السمكة j (يمين، يسار، منقار) في إحداثيات الشاشة التقريبية */
  function fishLocal(p, j, u) {
    const fa = flipAng(p);
    if (j === 2) return { x: u * .06, y: -u * .73, rot: .15 };
    const s = j === 0 ? 1 : -1;
    return { x: s * u * .38 + s * Math.sin(fa) * u * .5, y: -u * .72 + Math.cos(fa) * u * .5, rot: Math.PI / 2 + s * .35 };
  }
  function fishPos(p, j) { const f = fishLocal(p, j, p.u); return { x: p.x + f.x, y: p.y + f.y }; }
  function penPose(p) {
    const u = p.u * (p.drag ? 1.1 : 1);
    const hopY = p.hopT >= 0 ? Math.sin(Math.PI * p.hopT) * u * p.hopH : 0;
    const lift = p.drag ? u * .18 : 0;
    return { u, hopY, lift };
  }
  function drawShadow(c, p) {
    const { u, hopY, lift } = penPose(p), k = 1 - clamp((hopY + lift) / (u * 1.2), 0, .55);
    c.fillStyle = `rgba(70,90,160,${.22 * k})`;
    c.beginPath(); c.ellipse(p.x, p.y + 1, u * .48 * k, u * .12 * k, 0, 0, TAU); c.fill();
  }
  function drawPenguin(c, p) {
    const { u, hopY, lift } = penPose(p);
    const sh = p.shiverT > 0 ? Math.sin(T * 80 + p.ph) * u * .035 * Math.min(1, p.shiverT * 2) : 0;
    let tilt = Math.sin(T * 1.4 + p.ph) * .03;
    if (p.moving) tilt = Math.sin(p.walk) * .14;
    if (p.drag) tilt = clamp(p.dvx * .0007, -.4, .4) + Math.sin(T * 10) * .05;
    if (p.wob > 0) tilt += Math.sin(p.wob * 24) * .18 * p.wob;
    const br = 1 + Math.sin(T * 2.3 + p.ph) * .016;
    const sq = p.sq, happy = p.happyT > 0, cold = p.coldT > 0;
    const glow = (sel === p) || (hint && R && R.type === 'listen' && p.v === R.target && phase === 'play');
    c.save();
    c.translate(p.x + sh, p.y - hopY - lift);
    if (glow) {
      const pulse = .6 + Math.sin(T * 6) * .4;
      c.strokeStyle = `rgba(255,200,20,${.55 + pulse * .4})`; c.lineWidth = u * .07;
      c.beginPath(); c.ellipse(0, hopY + lift, u * (.55 + pulse * .05), u * .17, 0, 0, TAU); c.stroke();
    }
    c.rotate(tilt);
    c.scale(1 + sq, (1 - sq) * br);
    // القدمان
    for (const s of [-1, 1]) {
      const fy = -u * .03 - (p.moving ? Math.max(0, s * Math.sin(p.walk)) * u * .07 : 0) + (p.drag ? Math.sin(T * 12 + s * 2) * u * .04 : 0);
      c.save(); c.translate(s * u * .19, fy); c.rotate(s * .14);
      const g = c.createLinearGradient(0, -u * .07, 0, u * .07); g.addColorStop(0, '#FFC75E'); g.addColorStop(1, '#EE7410');
      c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, u * .16, u * .075, 0, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(190,80,0,.45)'; c.lineWidth = Math.max(1, u * .016); c.lineCap = 'round';
      c.beginPath(); c.moveTo(s * u * .03, u * .01); c.lineTo(s * u * .11, u * .03); c.moveTo(-s * u * .04, u * .015); c.lineTo(-s * u * .1, u * .035); c.stroke();
      c.restore();
    }
    // الزعنفتان
    const fa = flipAng(p);
    for (const s of [-1, 1]) {
      c.save(); c.translate(s * u * .38, -u * .72); c.rotate(-s * fa);
      const g = c.createLinearGradient(-u * .1, 0, u * .1, 0);
      g.addColorStop(0, s < 0 ? '#3D52A3' : '#22306E'); g.addColorStop(1, s < 0 ? '#22306E' : '#3D52A3');
      c.fillStyle = g; c.beginPath(); c.ellipse(0, u * .26, u * .1, u * .28, 0, 0, TAU); c.fill();
      c.restore();
    }
    // الجسم: إطار ضوئي ثم الجسم
    eggPath(c, u * .5, -u * 1.2, -u * .04, -u * .52);
    c.fillStyle = '#8EA6F5'; c.fill();
    c.save(); c.clip();
    c.translate(-u * .05, -u * .03);
    eggPath(c, u * .5, -u * 1.2, -u * .04, -u * .52);
    let g = c.createRadialGradient(-u * .14, -u * .88, u * .04, 0, -u * .55, u * .78);
    g.addColorStop(0, '#5571CF'); g.addColorStop(.45, '#2D3E8E'); g.addColorStop(1, '#161E55');
    c.fillStyle = g; c.fill();
    c.translate(u * .05, u * .03);
    g = c.createLinearGradient(0, -u * .3, 0, 0); g.addColorStop(0, 'rgba(10,15,50,0)'); g.addColorStop(1, 'rgba(10,15,50,.35)');
    c.fillStyle = g; c.fillRect(-u, -u * .3, u * 2, u * .3);
    c.fillStyle = 'rgba(255,255,255,.22)'; c.beginPath(); c.ellipse(-u * .2, -u * .98, u * .13, u * .07, -.6, 0, TAU); c.fill();
    if (cold) { c.fillStyle = `rgba(150,215,255,${.38 * Math.min(1, p.coldT * 2)})`; c.fillRect(-u, -u * 1.3, u * 2, u * 1.4); }
    c.restore();
    // خصلة على الرأس
    c.fillStyle = '#22306E';
    c.beginPath(); c.moveTo(-u * .05, -u * 1.17); c.quadraticCurveTo(-u * .02, -u * 1.32, u * .1, -u * 1.3); c.quadraticCurveTo(u * .02, -u * 1.24, u * .06, -u * 1.17); c.closePath(); c.fill();
    // العينان
    const blink = p.blinkT > 0;
    const lx = clamp(p.lx, -1, 1);
    for (const s of [-1, 1]) {
      const ex = s * u * .165, ey = -u * .9, er = u * .15;
      c.lineCap = 'round'; c.lineJoin = 'round';
      if (happy) {
        c.fillStyle = '#fff'; c.beginPath(); c.arc(ex, ey, er, 0, TAU); c.fill();
        c.strokeStyle = '#1A2350'; c.lineWidth = u * .045;
        c.beginPath(); c.arc(ex, ey + er * .35, er * .55, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
        continue;
      }
      if (cold) {
        c.fillStyle = '#fff'; c.beginPath(); c.arc(ex, ey, er, 0, TAU); c.fill();
        c.strokeStyle = '#1A2350'; c.lineWidth = u * .042;
        c.beginPath(); c.moveTo(ex + s * er * .45, ey - er * .42); c.lineTo(ex - s * er * .3, ey); c.lineTo(ex + s * er * .45, ey + er * .42); c.stroke();
        continue;
      }
      c.save(); c.translate(ex, ey); if (blink) c.scale(1, .1);
      g = c.createRadialGradient(-er * .3, -er * .35, er * .1, 0, 0, er);
      g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#DCE3F5');
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, er, 0, TAU); c.fill();
      const px = lx * er * .3 - s * er * .06, py = er * .1;
      c.fillStyle = '#10163A'; c.beginPath(); c.arc(px, py, er * .6, 0, TAU); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(px - er * .2, py - er * .24, er * .22, 0, TAU); c.fill();
      c.beginPath(); c.arc(px + er * .2, py + er * .2, er * .09, 0, TAU); c.fill();
      c.restore();
    }
    // الخدود
    c.fillStyle = 'rgba(255,130,170,.85)';
    for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * u * .3, -u * .765, u * .075, u * .046, 0, 0, TAU); c.fill(); }
    // المنقار
    const by = -u * .8, bw = u * .085, bh = u * .1;
    g = c.createLinearGradient(0, by - bh * .6, 0, by + bh); g.addColorStop(0, '#FFCB5C'); g.addColorStop(1, '#F07A10');
    if (happy) {
      c.fillStyle = '#8A2232'; c.beginPath(); c.ellipse(0, by + bh * .45, bw * .7, bh * .5, 0, 0, TAU); c.fill();
      c.fillStyle = '#FF7F93'; c.beginPath(); c.ellipse(0, by + bh * .7, bw * .42, bh * .22, 0, 0, TAU); c.fill();
      c.fillStyle = g; c.beginPath(); c.moveTo(-bw, by); c.quadraticCurveTo(0, by - bw * .8, bw, by); c.quadraticCurveTo(0, by + bh * .35, -bw, by); c.fill();
    } else {
      c.fillStyle = g; c.beginPath(); c.moveTo(-bw, by); c.quadraticCurveTo(0, by - bw * .8, bw, by); c.quadraticCurveTo(bw * .3, by + bh * .6, 0, by + bh); c.quadraticCurveTo(-bw * .3, by + bh * .6, -bw, by); c.fill();
      c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(-bw * .3, by - bh * .12, bw * .28, bh * .12, -.3, 0, TAU); c.fill();
    }
    // قرص البطن
    const bcy = -u * .35, brr = u * .265;
    c.fillStyle = '#A9B5DC'; c.beginPath(); c.arc(0, bcy + u * .028, brr, 0, TAU); c.fill();
    g = c.createRadialGradient(-u * .08, bcy - u * .1, u * .02, 0, bcy, brr * 1.05);
    g.addColorStop(0, '#FFFFFF'); g.addColorStop(.6, '#F3F6FD'); g.addColorStop(1, '#D3DBF1');
    c.fillStyle = g; c.beginPath(); c.arc(0, bcy, brr, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = Math.max(1, u * .018);
    c.beginPath(); c.arc(0, bcy, brr * .88, Math.PI * 1.1, Math.PI * 1.6); c.stroke();
    const counting = R && R.type === 'count';
    if (p.blank) {
      const pulse = 1 + Math.sin(T * 5) * .06;
      c.setLineDash([u * .05, u * .04]); c.strokeStyle = '#9DAEE0'; c.lineWidth = Math.max(1.2, u * .025);
      c.beginPath(); c.arc(0, bcy, brr * .7 * pulse, 0, TAU); c.stroke(); c.setLineDash([]);
      c.font = `900 ${u * .3 * pulse}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillStyle = '#8FA2DD'; c.fillText(isAr() ? '؟' : '?', 0, bcy + u * .02);
    } else if (!counting) {
      const s = numTxt(p.v);
      c.font = `900 ${u * (s.length > 1 ? .25 : .32)}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillStyle = 'rgba(30,43,107,.18)'; c.fillText(s, 0, bcy + u * .035);
      c.fillStyle = '#1E2B6B'; c.fillText(s, 0, bcy + u * .02);
    }
    // العقد الملوّن
    for (let i = 0; i < 9; i++) {
      const tt = i / 8 * 2 - 1, bx = tt * u * .31, byy = -u * .66 + (1 - tt * tt) * u * .05, r = u * .042;
      const col = BEADS[(i + p.v) % BEADS.length];
      g = c.createRadialGradient(bx - r * .35, byy - r * .35, r * .1, bx, byy, r);
      g.addColorStop(0, mix(col, '#FFFFFF', .55)); g.addColorStop(1, col);
      c.fillStyle = g; c.beginPath(); c.arc(bx, byy, r, 0, TAU); c.fill();
    }
    // الأسماك المحمولة
    if (counting) {
      for (let j = 0; j < p.fish; j++) {
        const f = fishLocal(p, j, u);
        drawFish(c, f.x, f.y, u * .5, j + p.v, f.rot + (j === 2 ? Math.sin(T * 4 + p.ph) * .1 : 0));
        if (j < p.cnt.length) {
          const r = u * .1, s = numTxt(p.cnt[j]);
          c.fillStyle = 'rgba(0,0,0,.15)'; c.beginPath(); c.arc(f.x, f.y + 2, r, 0, TAU); c.fill();
          c.fillStyle = '#FFE15A'; c.beginPath(); c.arc(f.x, f.y, r, 0, TAU); c.fill();
          c.strokeStyle = '#fff'; c.lineWidth = Math.max(1.5, u * .025); c.stroke();
          c.font = `900 ${r * (s.length > 1 ? 1.1 : 1.35)}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
          c.fillStyle = '#6B4200'; c.fillText(s, f.x, f.y + r * .1);
        }
      }
    }
    // علامة صح
    if (p.ok && R && R.type === 'order' && phase !== 'exit') {
      const cx = u * .34, cy = -u * .18, r = u * .11;
      c.fillStyle = '#1E8A35'; c.beginPath(); c.arc(cx, cy + 2, r, 0, TAU); c.fill();
      c.fillStyle = '#3BC14A'; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.fill();
      c.strokeStyle = '#fff'; c.lineWidth = r * .32; c.lineCap = 'round'; c.lineJoin = 'round';
      c.beginPath(); c.moveTo(cx - r * .45, cy); c.lineTo(cx - r * .1, cy + r * .35); c.lineTo(cx + r * .5, cy - r * .35); c.stroke();
    }
    c.restore();
  }

  /* ---------- الرسم العام ---------- */
  function drawSlots(c) {
    if (!R || R.type !== 'order' || phase === 'exit') return;
    const n = slots.length;
    // درب الأقدام بين الأماكن
    for (let i = 0; i < n - 1; i++) {
      const a = slots[i], b = slots[i + 1], ay = a.y + a.u * .22, by = b.y + b.u * .22;
      const d = Math.hypot(b.x - a.x, by - ay), k = Math.max(2, Math.floor(d / 11));
      c.fillStyle = 'rgba(140,160,220,.38)';
      for (let j = 1; j < k; j++) { const t = j / k; c.beginPath(); c.arc(a.x + (b.x - a.x) * t, ay + (by - ay) * t, 2.2, 0, TAU); c.fill(); }
      const mx = (a.x + b.x) / 2, my = (ay + by) / 2, ang = Math.atan2(by - ay, b.x - a.x);
      c.save(); c.translate(mx, my); c.rotate(ang);
      c.fillStyle = 'rgba(110,135,210,.55)'; c.beginPath(); c.moveTo(6, 0); c.lineTo(-4, -5); c.lineTo(-4, 5); c.closePath(); c.fill();
      c.restore();
    }
    slots.forEach((s, i) => {
      const on = drag && hover === i;
      c.fillStyle = on ? 'rgba(255,214,60,.55)' : 'rgba(160,180,235,.3)';
      c.beginPath(); c.ellipse(s.x, s.y, s.u * .52, s.u * .16, 0, 0, TAU); c.fill();
      c.strokeStyle = on ? 'rgba(240,170,0,.9)' : 'rgba(140,160,225,.5)'; c.lineWidth = 2; c.setLineDash([5, 5]); c.stroke(); c.setLineDash([]);
      if (hint) {
        const t = numTxt(R.vals[i]), r = s.u * .13, y = s.y + s.u * .3;
        c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.arc(s.x, y, r, 0, TAU); c.fill();
        c.strokeStyle = '#FFC21A'; c.lineWidth = 2; c.stroke();
        c.font = `900 ${r * (t.length > 1 ? 1.05 : 1.3)}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillStyle = '#3A55C4'; c.fillText(t, s.x, y + r * .08);
      }
    });
    // راية البداية
    const s0 = slots[0], fx = clamp(s0.x - dirSign * s0.u * .66, 10, W - 10), fy = s0.y + s0.u * .12, ph = s0.u * .7;
    c.strokeStyle = '#8A5A33'; c.lineWidth = 3; c.lineCap = 'round';
    c.beginPath(); c.moveTo(fx, fy); c.lineTo(fx, fy - ph); c.stroke();
    const wv = Math.sin(T * 4) * 3;
    c.fillStyle = '#FF5A7A'; c.beginPath(); c.moveTo(fx, fy - ph); c.quadraticCurveTo(fx + dirSign * ph * .25, fy - ph + 4 + wv, fx + dirSign * ph * .45, fy - ph * .82 + wv); c.lineTo(fx, fy - ph * .62); c.closePath(); c.fill();
    c.fillStyle = 'rgba(140,160,220,.4)'; c.beginPath(); c.ellipse(fx, fy, 6, 2.5, 0, 0, TAU); c.fill();
  }
  function drawChoices(c) {
    choices.forEach((ch, i) => {
      if (ch.st === 'gone') return;
      let k = T < ch.at ? 0 : ease.outBack(clamp((T - ch.at) / .45, 0, 1));
      if (ch.st === 'out') k *= 1 - clamp((T - ch.ot) / .3, 0, 1);
      if (k <= 0.01) return;
      const bob = Math.sin(T * 2.2 + i * 1.7) * 4;
      const wob = ch.wob > 0 ? Math.sin(ch.wob * 30) * .25 * ch.wob : 0;
      const pop = ch.pop ? 1 + Math.sin(Math.min(1, ch.pop) * Math.PI) * .25 : 1;
      const isHint = hint && R.type === 'missing' && ch.v === (pens.find(p => p.blank) || {}).v && phase === 'play';
      c.save(); c.translate(ch.x, ch.y + bob); c.scale(k * pop, k * pop);
      c.fillStyle = 'rgba(70,90,160,.16)'; c.beginPath(); c.ellipse(0, ch.L * .4 - bob, ch.L * .42, ch.L * .07, 0, 0, TAU); c.fill();
      if (isHint) { const pl = .5 + Math.sin(T * 6) * .5; c.fillStyle = `rgba(255,220,60,${.25 + pl * .3})`; c.beginPath(); c.ellipse(0, 0, ch.L * .66, ch.L * .4, 0, 0, TAU); c.fill(); }
      drawFish(c, 0, 0, ch.L, ch.ci, wob + Math.sin(T * 1.8 + i) * .04, numTxt(ch.v), ch.wt > 0);
      c.restore();
    });
  }
  function drawFlies(c) {
    flies.forEach(f => {
      const k = ease.io(clamp(f.t / f.d, 0, 1)), p = f.p;
      const x1 = p.x, y1 = p.y - p.u * .35;
      const x = f.x0 + (x1 - f.x0) * k, y = f.y0 + (y1 - f.y0) * k - Math.sin(k * Math.PI) * 90;
      drawFish(c, x, y, f.L0 * (1 - k * .55), f.ci, k * TAU, numTxt(f.v));
    });
  }
  function drawParts(c) {
    for (const q of parts) {
      const a = clamp(q.life / q.max, 0, 1);
      c.globalAlpha = q.k === 'conf' ? Math.min(1, a * 2) : a;
      if (q.k === 'star') { c.fillStyle = q.c; starPath(c, q.x, q.y, q.r, q.rot); c.fill(); }
      else if (q.k === 'conf') { c.save(); c.translate(q.x, q.y); c.rotate(q.rot); c.fillStyle = q.c; c.fillRect(-q.r, -q.r * .45, q.r * 2, q.r * .9); c.restore(); }
      else if (q.k === 'ring') { c.strokeStyle = q.c; c.lineWidth = 4 * a; c.beginPath(); c.arc(q.x, q.y, q.r * (1.6 - a * .8), 0, TAU); c.stroke(); }
      else if (q.k === 'flake') { c.strokeStyle = q.c; c.lineWidth = 1.6; c.save(); c.translate(q.x, q.y); c.rotate(q.rot); for (let i = 0; i < 3; i++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(-q.r * 1.6, 0); c.lineTo(q.r * 1.6, 0); c.stroke(); } c.restore(); }
    }
    c.globalAlpha = 1;
  }
  function drawFlakes(c) {
    c.fillStyle = 'rgba(255,255,255,.85)';
    for (const f of flakes) {
      const x = f.x * W + Math.sin(T * .8 + f.ph) * 10, y = f.y * H;
      c.beginPath(); c.arc(x, y, f.r, 0, TAU); c.fill();
    }
  }
  function render() {
    if (!ctx) return;
    const c = ctx;
    if (!bg) bg = buildBg();
    c.save();
    if (shake > .2) c.translate(rand(-shake, shake), rand(-shake, shake) * .5);
    c.drawImage(bg, 0, 0, W, H);
    drawSlots(c);
    const list = pens.slice().sort((a, b) => (a.drag ? 1 : 0) - (b.drag ? 1 : 0) || a.y - b.y);
    list.forEach(p => drawShadow(c, p));
    list.forEach(p => drawPenguin(c, p));
    drawChoices(c);
    drawFlies(c);
    drawParts(c);
    drawFlakes(c);
    c.restore();
  }

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    if (timers.length) {
      const due = timers.filter(t => t.at <= T);
      if (due.length) { timers = timers.filter(t => t.at > T); due.forEach(t => t.fn()); }
    }
    const fx = drag ? drag.p.x : null;
    for (const p of pens) {
      if (p.mv && !p.drag) {
        const m = p.mv; m.t += dt;
        const k = ease.io(clamp(m.t / m.d, 0, 1));
        p.x = m.fx + (m.tx - m.fx) * k; p.y = m.fy + (m.ty - m.fy) * k;
        p.moving = m.walk && m.t < m.d;
        if (m.t >= m.d) { p.mv = null; p.moving = false; if (m.walk) p.sq = Math.max(p.sq, .08); }
      } else p.moving = false;
      if (p.moving) p.walk += dt * 15;
      if (p.hopT >= 0) { p.hopT += dt / .5; if (p.hopT >= 1) { p.hopT = -1; p.sq = .2; } }
      p.sq *= Math.pow(.004, dt); if (p.sq < .002) p.sq = 0;
      p.shiverT = Math.max(0, p.shiverT - dt); p.coldT = Math.max(0, p.coldT - dt); p.happyT = Math.max(0, p.happyT - dt);
      p.flapT = Math.max(0, p.flapT - dt * 1.4); p.wob = Math.max(0, p.wob - dt * 2);
      p.blinkT = Math.max(0, p.blinkT - dt);
      if (T > p.blinkAt) { p.blinkT = .13; p.blinkAt = T + rand(2, 5.5); }
      if (phase === 'play' && !p.drag && Math.random() < dt * .05) p.flapT = 1;
      const tl = fx != null && !p.drag ? clamp((fx - p.x) / 120, -1, 1) : Math.sin(T * .5 + p.ph * 2) * .6;
      p.lx += (tl - p.lx) * Math.min(1, dt * 6);
      if (phase === 'over' && p.hopT < 0 && Math.random() < dt * .9) { hop(p, rand(.35, .7)); p.happyT = 1; }
      p.dvx *= Math.pow(.02, dt);
    }
    choices.forEach(c => { c.wob = Math.max(0, c.wob - dt * 1.8); c.wt = Math.max(0, c.wt - dt); if (c.pop) c.pop += dt * 2; });
    for (let i = flies.length - 1; i >= 0; i--) {
      const f = flies[i]; f.t += dt;
      if (f.t >= f.d) {
        flies.splice(i, 1);
        const p = f.p; p.blank = false; hop(p, .65); p.happyT = 1.5;
        sparkle(p.x, p.y - p.u * .4, 16); ring(p.x, p.y - p.u * .35, '#FFD84A'); Sound.star(); vibrate(20); sayNum(p.v);
        later(.9, () => { praise(); confetti(40); Sound.coin(); });
        roundSolved(2.3);
      }
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.life -= dt;
      if (q.life <= 0) { parts.splice(i, 1); continue; }
      q.vy += q.g * dt; q.x += q.vx * dt; q.y += q.vy * dt;
      if (q.rot != null) q.rot += (q.vr || 2) * dt;
    }
    for (const f of flakes) { f.y += f.s * dt * (f.r / 2.5); if (f.y > 1.02) { f.y = -.02; f.x = Math.random(); } }
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
  function hitPen(x, y) {
    const list = pens.slice().sort((a, b) => b.y - a.y);
    let best = null, bd = 1e9;
    for (const p of list) {
      const u = p.u, cx = p.x, cy = p.y - u * .6;
      const dx = (x - cx) / (u * .62), dy = (y - cy) / (u * .78), d = dx * dx + dy * dy;
      if (d < 1 && d < bd) { bd = d; best = p; }
    }
    return best;
  }
  function nearestSlot(x, y) {
    let bi = -1, bd = 1e9;
    slots.forEach((s, i) => { const d = Math.hypot((x - s.x), (y - (s.y - s.u * .45)) * 1.2); if (d < bd) { bd = d; bi = i; } });
    return bd < (slots[bi] ? slots[bi].u * 1.1 : 0) ? bi : -1;
  }
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused || !R) return;
    Sound.ac(true);
    const { x, y } = pos(e);
    if (phase !== 'play') return;
    for (const c of choices) {
      if (c.st === 'gone' || c.st === 'out') continue;
      if (Math.abs(x - c.x) < c.L * .58 && Math.abs(y - c.y) < c.L * .38) { pickChoice(c); return; }
    }
    const p = hitPen(x, y);
    if (!p) { if (sel) { sel = null; Sound.tap(); } return; }
    if (R.type === 'order') {
      if (p.ok) { p.wob = 1; Sound.tone(900, .07, 'sine', .08, 300); return; }
      drag = { p, id: e.pointerId, sx: x, sy: y, moved: false, offY: y - p.y, offX: x - p.x, lx: x };
      try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    } else if (R.type === 'listen') tapListen(p);
    else if (R.type === 'count') tapCount(p);
    else { // الرقم الناقص: لمس بطريق يقول رقمه
      if (p.blank) { p.wob = 1; Sound.tone(500, .1, 'sine', .08, -100); }
      else { hop(p, .35); sayNum(p.v); Sound.tone(880, .07, 'sine', .08, 400); }
    }
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const { x, y } = pos(e), p = drag.p;
    if (!drag.moved && Math.hypot(x - drag.sx, y - drag.sy) > 9) {
      drag.moved = true; p.drag = true; p.mv = null; sel = null;
      Sound.pop(); vibrate(10);
    }
    if (drag.moved) {
      p.dvx = (x - drag.lx) / .016 * .5 + p.dvx * .5; drag.lx = x;
      p.x = x - drag.offX; p.y = y - drag.offY + p.u * .25;
      p.y = clamp(p.y, hz + p.u * .9, botY);
      hover = nearestSlot(p.x, p.y - p.u * .25);
    }
  });
  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const d = drag, p = d.p; drag = null;
    if (!d.moved) {
      // لمس دون سحب: اختيار ثم تبديل
      if (!sel) { sel = p; hop(p, .3); Sound.tone(820, .08, 'sine', .1, 400); }
      else if (sel === p) { sel = null; Sound.tap(); }
      else { const a = sel; sel = null; swapPens(a, p); }
      return;
    }
    p.drag = false;
    const to = hover; hover = -1;
    const other = to >= 0 ? pens.find(o => o.slot === to) : null;
    if (to >= 0 && other && other !== p && !other.ok) {
      const old = p.slot; p.slot = to; other.slot = old;
      const s1 = slots[p.slot], s2 = slots[old];
      p.u = s1.u; other.u = s2.u;
      moveTo(p, s1.x, s1.y, .18, false); moveTo(other, s2.x, s2.y, .42, true);
      p.sq = .15; Sound.thud(); Sound.slide(); vibrate(12);
    } else {
      const s = slots[p.slot];
      moveTo(p, s.x, s.y, .3, false); p.sq = .12; Sound.thud();
      if (other && other.ok) other.wob = 1;
    }
  }
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);

  doneBtn.onclick = () => { if (phase === 'play') check(); };
  spkBtn.onclick = () => { Sound.ac(true); if (R && phase !== 'over') sayPrompt(); };
  ban.onclick = () => { if (R && phase !== 'over') sayPrompt(); };
  function switchLang(l) {
    if (l === lang) return;
    lang = l; store.set('penguinsLang', l); Sound.tap(); paintLang();
    if (lvOv.classList.contains('on')) openLevels();
    if (!R) return;
    geom(false); if (phase !== 'over') setBanner(); updChips();
    if (phase === 'play') sayPrompt(); else sayNum(1);
  }
  root.querySelectorAll('.lang button').forEach(b => b.onclick = () => switchLang(b.dataset.l));
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
    if (e.key === 'Enter') { if (R.type === 'order') check(); else sayPrompt(); e.preventDefault(); }
    else if (e.key === ' ') { sayPrompt(); e.preventDefault(); }
    else if (/^[1-3]$/.test(e.key) && choices[+e.key - 1]) pickChoice(choices[+e.key - 1]);
  });
  let resizeT = 0;
  window.addEventListener('resize', () => {
    if (App.current !== ID) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); if (R) geom(true); render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#B9C6F3'); g.addColorStop(.55, '#E8EDFC'); g.addColorStop(.56, '#FBFCFF'); g.addColorStop(1, '#D6DEF6');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    lowTree(c, s * .14, s * .6, s * .5); lowTree(c, s * .88, s * .6, s * .44);
    const sv = { T, R, lang }; R = null;
    const p2 = mkPen(2); p2.x = s * .3; p2.y = s * .9; p2.u = s * .36; p2.lx = .4;
    const p1 = mkPen(1); p1.x = s * .6; p1.y = s * .95; p1.u = s * .5; p1.lx = -.3;
    lang = App.gameLang(ID);
    T = 0;
    drawShadow(c, p2); drawPenguin(c, p2); drawShadow(c, p1); drawPenguin(c, p1);
    T = sv.T; R = sv.R; lang = sv.lang;
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'البطاريق', icon2: '🐧', isNew: false, music: 'numbers',
    desc: () => App.g('رتّبي البطاريق وتعلّمي الأرقام', 'رتّب البطاريق وتعلّم الأرقام'),
    titleEn: 'Penguins',
    descEn: () => 'Put the penguins in order and learn numbers',
    helpEn: () => [
      '🐧 Drag the penguins and put them in order from smallest to biggest, then press «Done ✓»',
      '👂 Listen to the number and tap the penguin that carries it',
      '🐟 Choose the fish with the missing number, or the number of fish after counting them',
      '🔤 The ١٢٣ / 123 button changes the numbers and voice between Arabic and English, and 🔊 repeats the question',
      '⭐ Finish the level with no mistakes to get 3 stars'
    ],
    help: () => [
      '🐧 ' + App.g('اسحبي', 'اسحب') + ' البطاريق ' + App.g('ورتّبيها', 'ورتّبها') + ' من الأصغر إلى الأكبر، ثم ' + App.g('اضغطي', 'اضغط') + ' «تم ✓»',
      '👂 ' + App.g('استمعي', 'استمع') + ' إلى الرقم ' + App.g('والمسي', 'والمس') + ' البطريق الذي يحمله',
      '🐟 ' + App.g('اختاري', 'اختر') + ' السمكة التي عليها الرقم الناقص، أو عدد الأسماك ' + App.g('بعد أن تعدّيها', 'بعد أن تعدّها'),
      '🔤 زرّ ١٢٣ / 123 يغيّر الأرقام والنطق بين العربية والإنجليزية، و🔊 يعيد السؤال',
      '⭐ ' + App.g('أنهي', 'أنهِ') + ' المستوى دون أخطاء ' + App.g('لتحصلي', 'لتحصل') + ' على ٣ نجوم'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 ${App.t('المستوى', 'Level')} ${Math.max(...ks)} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      lang = App.gameLang(ID); paintLang(); trUI();
      startLevel(Math.min(loadProg().unlocked, NL));
      render(); startLoop();
    },
    onLang(l) {
      trUI();
      if (l !== lang) switchLang(l);
      else if (lvOv.classList.contains('on')) openLevels();
      if (winOv.classList.contains('on')) winText();
    },
    leave() { stopLoop(); clearLater(); drag = null; sel = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { drag.p.drag = false; drag = null; hover = -1; geom(false); } },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { lvOv.classList.remove('on'); if (phase === 'over') winOv.classList.add('on'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() {
      return { lvl, qi, phase, mistakes, lang, type: R && R.type, target: R && R.target, K: R && R.K, vals: R && R.vals, hint,
        pens: pens.map(p => ({ v: p.v, slot: p.slot, x: p.x, y: p.y, u: p.u, ok: p.ok, blank: p.blank, fish: p.fish, cnt: p.cnt.length })),
        slots: slots.map(s => ({ x: s.x, y: s.y, u: s.u })), choices: choices.map(c => ({ v: c.v, x: c.x, y: c.y, L: c.L, st: c.st })) };
    },
    _go(l, q) { lvl = l; qi = q || 0; mistakes = 0; winOv.classList.remove('on'); lvOv.classList.remove('on'); layout(); startRound(); }
  });
})();
