/* =====================================================================
   صيد الفراشات — حديقة زهور متحركة، المس الفراشات باللون (أو النقش أو العدد) المطلوب
   20 مستوى + «حديقة حرة» لتعلّم أسماء الألوان.
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'butterfly';
  const TAU = Math.PI * 2;
  const FONT = "'Baloo Bhaijaan 2',system-ui,sans-serif";
  const NL = 20;

  /* ---------- الألوان: n اسم اللون، f صفة الجمع المعرّفة، i صفة نكرة ---------- */
  const COLS = [
    { k: 'red',    n: 'أحمر',    f: 'الحمراء',   i: 'حمراء',   c: '#F23B3B', d: '#A3121F', l: '#FF9C90', p: '#FFF3C4' },
    { k: 'yellow', n: 'أصفر',    f: 'الصفراء',   i: 'صفراء',   c: '#FFD81F', d: '#E39A00', l: '#FFF4A3', p: '#7A4300' },
    { k: 'blue',   n: 'أزرق',    f: 'الزرقاء',   i: 'زرقاء',   c: '#2F7BF2', d: '#123C9C', l: '#9CCBFF', p: '#FFFFFF' },
    { k: 'green',  n: 'أخضر',    f: 'الخضراء',   i: 'خضراء',   c: '#34BE4C', d: '#157326', l: '#AEF2A4', p: '#FFFBD0' },
    { k: 'pink',   n: 'وردي',    f: 'الوردية',   i: 'وردية',   c: '#FF6FB5', d: '#C92A78', l: '#FFC8E3', p: '#FFFFFF' },
    { k: 'purple', n: 'بنفسجي',  f: 'البنفسجية', i: 'بنفسجية', c: '#9A4CE8', d: '#561C9E', l: '#D6B5FF', p: '#FFFFFF' },
    { k: 'orange', n: 'برتقالي', f: 'البرتقالية', i: 'برتقالية', c: '#FF8A1F', d: '#C05200', l: '#FFC98A', p: '#3B1B00' },
    { k: 'white',  n: 'أبيض',    f: 'البيضاء',   i: 'بيضاء',   c: '#F7F8FA', d: '#8E98A6', l: '#FFFFFF', p: '#4A5262' },
    { k: 'black',  n: 'أسود',    f: 'السوداء',   i: 'سوداء',   c: '#2B2B36', d: '#07070C', l: '#5E5E74', p: '#FFFFFF' },
    { k: 'brown',  n: 'بني',     f: 'البنية',    i: 'بنية',    c: '#9A5B2A', d: '#593010', l: '#D29C66', p: '#FFF0D0' }
  ];
  const CK = {}; COLS.forEach(c => CK[c.k] = c);
  const PATS = {
    plain:   { def: '', ind: '', n: '' },
    dots:    { def: 'ذات النقاط', ind: 'ذات نقاط', n: 'منقّطة' },
    stripes: { def: 'المخططة', ind: 'مخططة', n: 'مخططة' }
  };
  const NUMW = { 2: 'فراشتين', 3: 'ثلاث', 4: 'أربع', 5: 'خمس' };
  /* الإنجليزية */
  const COL_EN = { red: 'red', yellow: 'yellow', blue: 'blue', green: 'green', pink: 'pink', purple: 'purple', orange: 'orange', white: 'white', black: 'black', brown: 'brown' };
  const PAT_EN = { plain: '', dots: 'spotted', stripes: 'striped' };
  const NUMW_EN = { 2: 'two', 3: 'three', 4: 'four', 5: 'five' };
  const isEn = () => App.gameLang(ID) === 'en';
  const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
  const say = (ar, en) => isEn() ? App.speak(en, 'en') : App.speak(ar);
  const freeMsg = () => isEn() ? 'Touch any butterfly to hear its color' : App.g('المسي أي فراشة لتعرفي لونها', 'المس أي فراشة لتعرف لونها');
  const colName = C => isEn() ? cap(COL_EN[C.k]) : C.n;

  /* ---------- تصميم المستويات ---------- */
  function lvDef(n) {
    return {
      nc: Math.min(10, 2 + Math.ceil(n * .55)),            // عدد الألوان
      count: Math.min(13, 4 + Math.round(n * .45)),        // عدد الفراشات في الحديقة
      spd: .72 + n * .085,                                  // السرعة (نسبة إلى حجم الفراشة في الثانية)
      need: n < 4 ? 2 : n < 12 ? 3 : 4,
      tasks: n < 6 ? 3 : 4,
      timer: n >= 8 ? Math.round(Math.max(16, 32 - (n - 8) * 1.3)) : 0,
      pats: n >= 5,
      rest: Math.max(.12, .6 - n * .026),                   // ميل الفراشات للوقوف على الأزهار
      size: 1 - (n - 1) * .011,
      kinds: n < 7 ? ['col'] : n < 10 ? ['col', 'col', 'pat'] : n < 15 ? ['col', 'pat', 'cnt', 'col'] : ['col', 'pat', 'cnt', 'combo']
    };
  }
  const FREE = { nc: 10, count: 11, spd: .62, need: 0, tasks: 0, timer: 0, pats: true, rest: .7, size: 1.02, kinds: [] };

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    inCubic: t => t * t * t,
    outBack: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  };
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const angDiff = (a, b) => { let d = b - a; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return d; };
  const loadProg = () => { const p = store.get('butterflyProg', null) || {}; return { unlocked: clamp(p.unlocked || 1, 1, NL), stars: p.stars || {}, total: p.total || 0 }; };
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }

  /* ---------- رسم الفراشة (متجهات) ---------- */
  function wingPath(c, R, w) {
    c.beginPath();
    if (w === 0) { // الجناح الأمامي
      c.moveTo(.04 * R, -.14 * R);
      c.bezierCurveTo(.22 * R, -.98 * R, .96 * R, -1.1 * R, 1.03 * R, -.74 * R);
      c.bezierCurveTo(1.1 * R, -.38 * R, .74 * R, -.06 * R, .06 * R, .04 * R);
    } else {       // الجناح الخلفي
      c.moveTo(.05 * R, .02 * R);
      c.bezierCurveTo(.7 * R, -.04 * R, .92 * R, .42 * R, .72 * R, .72 * R);
      c.bezierCurveTo(.52 * R, 1, .14 * R, .88 * R, .03 * R, .26 * R);
    }
    c.closePath();
  }
  /* الجناحان الأيمنان (الأمامي والخلفي) عند الأصل، والجسم على المحور y */
  function drawWings(c, R, C, pat) {
    for (const w of [1, 0]) {
      c.save();
      wingPath(c, R, w);
      const g = c.createRadialGradient(0, 0, R * .04, 0, 0, R * 1.12);
      g.addColorStop(0, C.d); g.addColorStop(.28, C.c); g.addColorStop(.72, C.c); g.addColorStop(1, C.l);
      c.fillStyle = g; c.fill();
      c.clip();
      if (w === 1) { c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(0, -R * 1.2, R * 1.3, R * 2.4); }
      if (pat === 'dots') {
        const D = w === 0 ? [[.56, -.62, .14], [.84, -.7, .1], [.4, -.3, .1], [.76, -.38, .09]] : [[.42, .3, .13], [.62, .6, .1], [.26, .56, .075]];
        for (const [x, y, r] of D) {
          c.beginPath(); c.arc(x * R, y * R, r * R, 0, TAU);
          c.fillStyle = C.p; c.fill();
          c.lineWidth = R * .025; c.strokeStyle = 'rgba(0,0,0,.25)'; c.stroke();
        }
      } else if (pat === 'stripes') {
        c.strokeStyle = C.p; c.lineWidth = R * .11; c.lineCap = 'round';
        for (const r of [.38, .62, .88]) { c.beginPath(); c.arc(0, 0, r * R, -Math.PI, Math.PI); c.stroke(); }
        c.strokeStyle = 'rgba(0,0,0,.14)'; c.lineWidth = R * .02;
        for (const r of [.38, .62, .88]) { c.beginPath(); c.arc(0, 0, r * R + R * .056, -Math.PI, Math.PI); c.stroke(); }
      }
      // عروق خفيفة
      c.strokeStyle = 'rgba(0,0,0,.16)'; c.lineWidth = R * .022;
      const V = w === 0 ? [[.95, -.85], [1.05, -.55], [.8, -.2], [.5, -1]] : [[.85, .4], [.65, .8], [.3, .9]];
      for (const [x, y] of V) { c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(x * R * .5, y * R * .62, x * R, y * R); c.stroke(); }
      // لمعة
      const sg = c.createLinearGradient(0, -R, R * .7, R * .2);
      sg.addColorStop(0, 'rgba(255,255,255,.42)'); sg.addColorStop(.5, 'rgba(255,255,255,0)');
      c.fillStyle = sg; c.fillRect(0, -R * 1.2, R * 1.3, R * 2.4);
      c.restore();
      wingPath(c, R, w); c.lineJoin = 'round'; c.lineWidth = R * .07; c.strokeStyle = C.d; c.stroke();
    }
  }
  function drawBody(c, R, wig) {
    // قرنا الاستشعار
    c.strokeStyle = '#2B1E2E'; c.lineWidth = Math.max(1, R * .04); c.lineCap = 'round';
    for (const s of [-1, 1]) {
      c.beginPath(); c.moveTo(s * R * .04, -R * .44);
      c.quadraticCurveTo(s * R * .08, -R * .8, s * (R * .3 + wig), -R * .96); c.stroke();
      c.fillStyle = '#2B1E2E'; c.beginPath(); c.arc(s * (R * .3 + wig), -R * .96, R * .055, 0, TAU); c.fill();
    }
    let g = c.createLinearGradient(-R * .12, 0, R * .12, 0);
    g.addColorStop(0, '#1C1220'); g.addColorStop(.5, '#5A4652'); g.addColorStop(1, '#1C1220');
    c.fillStyle = g;
    c.beginPath(); c.ellipse(0, R * .3, R * .085, R * .4, 0, 0, TAU); c.fill();
    c.beginPath(); c.ellipse(0, -R * .12, R * .12, R * .2, 0, 0, TAU); c.fill();
    c.beginPath(); c.arc(0, -R * .38, R * .115, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = R * .02;
    for (let i = 0; i < 4; i++) { c.beginPath(); c.moveTo(-R * .07, R * (.12 + i * .13)); c.lineTo(R * .07, R * (.12 + i * .13)); c.stroke(); }
    c.fillStyle = '#fff';
    c.beginPath(); c.arc(-R * .05, -R * .41, R * .032, 0, TAU); c.arc(R * .05, -R * .41, R * .032, 0, TAU); c.fill();
  }
  function drawButterflyDirect(c, x, y, R, C, pat, rot, sx) {
    c.save(); c.translate(x, y); c.rotate(rot);
    c.save(); c.shadowColor = 'rgba(0,0,0,.25)'; c.shadowBlur = R * .2; c.shadowOffsetY = R * .1;
    c.save(); c.scale(sx, 1); drawWings(c, R, C, pat); c.restore();
    c.save(); c.scale(-sx, 1); drawWings(c, R, C, pat); c.restore();
    c.restore();
    drawBody(c, R, 0);
    c.restore();
  }

  /* صورة جاهزة لجناحي جانب واحد (للأداء) */
  const sprites = new Map();
  function sprite(colK, pat, size) {
    const key = colK + '|' + pat + '|' + size;
    let s = sprites.get(key); if (s) return s;
    const R = size / 2, pad = R * .2;
    const w = R * 1.12 + pad, h = R * 2.2 + pad * 2, oy = R * 1.12 + pad;
    const c = mk(w * dpr, h * dpr), x = c.getContext('2d');
    x.scale(dpr, dpr); x.translate(0, oy);
    x.shadowColor = 'rgba(40,40,20,.22)'; x.shadowBlur = R * .16; x.shadowOffsetY = R * .1;
    drawWings(x, R, CK[colK], pat);
    s = { c, w, h, oy }; sprites.set(key, s); return s;
  }

  /* ---------- الواجهة ---------- */
  App.css(`
  #butterfly{background:#BFE8FF;overflow:hidden}
  #butterfly canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #butterfly .ib{color:#C2397E}
  #butterfly .chip{color:#5B2A6E}
  #butterfly .chip b{color:#C2397E}
  #butterfly .prm{position:absolute;z-index:4;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 54px);
    width:min(calc(100% - 24px),520px);display:flex;align-items:center;gap:10px;padding:8px 12px 8px 10px;border-radius:24px;background:rgba(255,255,255,.93);
    box-shadow:0 4px 0 rgba(120,60,140,.18),0 8px 22px rgba(60,40,90,.15);border:3px solid #FFE3F1;cursor:pointer;transition:opacity .3s}
  #butterfly .prm.off{opacity:0;pointer-events:none}
  #butterfly .prm.bump{animation:bfBump .5s}
  #butterfly .prm.wig{animation:bfWig .45s}
  @keyframes bfBump{30%{transform:translateX(-50%) scale(1.06)}}
  @keyframes bfWig{20%{transform:translateX(calc(-50% - 7px))}40%{transform:translateX(calc(-50% + 6px))}60%{transform:translateX(calc(-50% - 4px))}80%{transform:translateX(calc(-50% + 2px))}}
  #butterfly .sw{width:62px;height:62px;flex:0 0 62px;display:block}
  #butterfly .pt{flex:1;min-width:0;color:#4A2160}
  #butterfly .ptxt{display:block;font-size:clamp(17px,4.9vw,23px);font-weight:900;line-height:1.25}
  #butterfly .dots{display:flex;gap:5px;margin-top:4px;flex-wrap:wrap}
  #butterfly .dots i{width:20px;height:20px;border-radius:50%;background:#EFE6F5;box-shadow:inset 0 2px 3px rgba(0,0,0,.12);font-style:normal;font-size:12px;display:grid;place-items:center}
  #butterfly .dots i.on{background:radial-gradient(circle at 35% 30%,#FFF6B8,#FFC531 60%,#E89B0C);box-shadow:0 1px 0 #C97F00;animation:pop .3s}
  #butterfly .spk{font-size:20px;opacity:.55;flex:0 0 auto}
  #butterfly .tmr{position:absolute;left:14px;right:14px;bottom:-9px;height:8px;border-radius:5px;background:rgba(255,255,255,.95);box-shadow:0 1px 3px rgba(0,0,0,.15);overflow:hidden;display:none}
  #butterfly .tmr.on{display:block}
  #butterfly .tmr i{display:block;height:100%;width:100%;border-radius:5px;background:linear-gradient(90deg,#7EDC5A,#3DBB4E);transition:background .3s}
  #butterfly .tmr.low i{background:linear-gradient(90deg,#FF9A5A,#FF4F6B)}
  #butterfly .panel{border-color:#FFE0F0;box-shadow:0 8px 0 #E7A9D8,0 20px 40px rgba(80,20,90,.3);color:#5B2A6E}
  #butterfly .panel h3{color:#C2397E}
  #butterfly .btn{background:#E9559B;box-shadow:0 4px 0 #B32C70}
  #butterfly .btn.alt{background:#fff;color:#C2397E;box-shadow:0 4px 0 #F0BBD9;border-color:#FFE0F0}
  #butterfly .btn:active{box-shadow:0 1px 0 #B32C70}
  #butterfly .overlay{background:rgba(70,30,90,.32)}
  #butterfly .lvp{width:min(94vw,440px);max-height:86vh;overflow-y:auto;touch-action:pan-y}
  #butterfly .lvg{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:10px 0 12px}
  #butterfly .lvb{position:relative;aspect-ratio:1;border-radius:18px;background:linear-gradient(#FFE6F4,#F9BEDD);box-shadow:0 4px 0 #D98AB8,inset 0 2px 0 rgba(255,255,255,.7);
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#7A2A5E;font-weight:900;padding:2px}
  #butterfly .lvb:active{transform:translateY(3px);box-shadow:0 1px 0 #D98AB8}
  #butterfly .lvb .n{font-size:20px;line-height:1.1}
  #butterfly .lvb .c{width:13px;height:13px;border-radius:50%;position:absolute;top:4px;right:5px;box-shadow:0 0 0 2px #fff}
  #butterfly .lvb .s{font-size:10px;letter-spacing:-1px;line-height:1;height:11px}
  #butterfly .lvb .s i{font-style:normal}
  #butterfly .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #butterfly .lvb.cur{outline:3px solid #E9559B;outline-offset:2px}
  #butterfly .lvb.lock{background:linear-gradient(#EEE6EC,#D9CCD5);box-shadow:0 4px 0 #B9A8B4;color:#9a8a96}
  #butterfly .lvb.lock .n{opacity:.4}
  #butterfly .lvb.lock::after{content:'🔒';position:absolute;font-size:15px;bottom:2px}
  #butterfly .freeb{width:100%;margin-top:2px}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🔢</button>
      <button class="ib frbtn" aria-label="حديقة حرة">🌸</button>
      <span class="grow"></span>
      <div class="chip c1"><small class="c1s">المستوى</small><b class="c1b">1</b></div>
      <div class="chip c2"><small data-ar="الجولة" data-en="Round">الجولة</small><b class="c2b">1</b></div>
    </div>
    <div class="prm off" role="button" aria-label="إعادة السؤال">
      <canvas class="sw" width="124" height="124"></canvas>
      <div class="pt"><b class="ptxt"></b><div class="dots"></div></div>
      <span class="spk">🔊</span>
      <div class="tmr"><i></i></div>
    </div>
    <div class="overlay" id="bfLv"><div class="panel lvp"><h3 data-ar="🔢 المستويات" data-en="🔢 Levels">🔢 المستويات</h3><div class="lvg"></div>
      <button class="btn freeb" data-a="free" data-ar="🌸 حديقة حرة" data-en="🌸 Free garden">🌸 حديقة حرة</button><br>
      <button class="btn alt" data-a="close" data-ar="✕ إغلاق" data-en="✕ Close">✕ إغلاق</button></div></div>
    <div class="overlay" id="bfWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next" data-ar="التالي ▶️" data-en="Next ▶️">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels" data-ar="🔢 المستويات" data-en="🔢 Levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>
    <div class="overlay" id="bfTo"><div class="panel">
      <h3 data-ar="⏰ انتهى الوقت" data-en="⏰ Time's up">⏰ انتهى الوقت</h3><div class="big">🦋💨</div><p class="toP"></p>
      <button class="btn" data-a="again" data-ar="🔄 مرة أخرى" data-en="🔄 Try again">🔄 مرة أخرى</button><br>
      <button class="btn alt" data-a="levels" data-ar="🔢 المستويات" data-en="🔢 Levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const bar = root.querySelector('.bar');
  const prm = root.querySelector('.prm'), ptxt = root.querySelector('.ptxt'), dotsEl = root.querySelector('.dots');
  const swc = root.querySelector('.sw'), tmr = root.querySelector('.tmr'), tmrI = tmr.querySelector('i');
  const lvOv = root.querySelector('#bfLv'), winOv = root.querySelector('#bfWin'), toOv = root.querySelector('#bfTo');
  const frBtn = root.querySelector('.frbtn');
  function relabel() {
    root.querySelectorAll('[data-ar]').forEach(el => { el.textContent = App.t(el.dataset.ar, el.dataset.en); });
    [['.home', 'الرئيسية', 'Home'], ['.helpbtn', 'مساعدة', 'Help'], ['.lvbtn', 'المستويات', 'Levels'], ['.prm', 'إعادة السؤال', 'Repeat the question']].forEach(([q, a, e]) => root.querySelectorAll(q).forEach(b => b.setAttribute('aria-label', App.t(a, e))));
    frBtn.setAttribute('aria-label', phase === 'free' ? App.t('المستويات', 'Levels') : App.t('حديقة حرة', 'Free garden'));
  }
  let winInfo = null;
  function fillWin() {
    if (!winInfo) return;
    const { stars, n, c, ms } = winInfo;
    root.querySelector('.wT').textContent = App.t(App.g('أحسنتِ!', 'أحسنت!'), 'Well done!') + ' 🦋';
    root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
    root.querySelector('.wP').textContent = App.t(`${App.g('أمسكتِ', 'أمسكتَ')} ${c} فراشة في المستوى ${n}` + (ms ? ` · الأخطاء: ${ms}` : ' دون أي خطأ! 💯'),
      `You caught ${c} butterflies in level ${n}` + (ms ? ` · Mistakes: ${ms}` : ' with no mistakes! 💯'));
    root.querySelector('.toP').textContent = App.t(App.g('لا بأس! حاولي مرة أخرى، أنتِ قادرة 💪', 'لا بأس! حاول مرة أخرى، أنت قادر 💪'), "That's OK! Try again, you can do it 💪");
  }
  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, S = 70, top = 140, meadowY = 600, areaX = 0, areaW = 400;
  let layers = [], flowers = [], clouds = [], pollen = [], grass = null;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, D = lvDef(1), pool = [], tasks = [], ti = 0, task = null, got = 0, mistakes = 0, caughtL = 0, tLeft = 0, elapsed = 0;
  let phase = 'idle', overOv = null; // play | between | over | free
  let bs = [], parts = [], rings = [], floats = [], shake = 0, spawnT = 0, betweenT = 0, winTimer = 0, speakTimer = 0;

  /* ---------- التخطيط والخلفية ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h;
    if (f.dpr !== dpr) sprites.clear();
    dpr = f.dpr;
    const pr = prm.getBoundingClientRect();
    top = Math.max(bar.getBoundingClientRect().bottom, pr.bottom + 8) + 4;
    areaW = Math.min(W, 1040); areaX = (W - areaW) / 2;
    S = clamp(Math.min(W * .2, H * .11), 56, 96);
    meadowY = H * (W / H < 1 ? .76 : .72);
    buildLayers(); buildFlowers();
    clouds = Array.from({ length: Math.max(3, Math.round(W / 260)) }, (_, i) => makeCloud(rand(0, W), i));
    pollen = Array.from({ length: Math.round(W * H / 26000) + 8 }, () => ({ x: rand(0, W), y: rand(top, H), r: rand(1, 2.6), ph: rand(0, TAU), v: rand(6, 16) }));
  }
  function hillPath(x, w, base, amp, seed, freq) {
    const R = rng(seed), ph1 = R() * 10, ph2 = R() * 10;
    x.beginPath(); x.moveTo(0, H);
    for (let xx = 0; xx <= w + 8; xx += 8) {
      const y = base - amp * (.55 + .3 * Math.sin(xx * freq + ph1) + .15 * Math.sin(xx * freq * 2.7 + ph2));
      x.lineTo(xx, y);
    }
    x.lineTo(w, H); x.closePath();
  }
  function buildLayers() {
    const pad = 40;
    const defs = [
      { base: meadowY - H * .1, amp: H * .1, c1: '#A9DDB0', c2: '#8FCB9A', seed: 3, freq: .006, k: 5, trees: 0, dots: 0 },
      { base: meadowY - H * .03, amp: H * .08, c1: '#8DD573', c2: '#6CBD58', seed: 9, freq: .009, k: 11, trees: 1, dots: 40 },
      { base: meadowY + H * .02, amp: H * .05, c1: '#72CC52', c2: '#4FAE3E', seed: 17, freq: .012, k: 18, trees: 0, dots: 90 }
    ];
    layers = defs.map((d, li) => {
      const w = W + pad * 2, c = mk(w * dpr, H * dpr), x = c.getContext('2d'); x.scale(dpr, dpr);
      hillPath(x, w, d.base, d.amp, d.seed, d.freq);
      const g = x.createLinearGradient(0, d.base - d.amp, 0, H); g.addColorStop(0, d.c1); g.addColorStop(.6, d.c2); g.addColorStop(1, d.c2);
      x.fillStyle = g; x.fill();
      x.save(); x.clip();
      x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 3; hillPath(x, w, d.base, d.amp, d.seed, d.freq); x.stroke();
      const R = rng(d.seed * 7);
      if (d.trees) {
        for (let i = 0; i < Math.max(2, W / 220); i++) {
          const tx = R() * w, ty = d.base - d.amp * .55 + R() * 30, s = 16 + R() * 14;
          x.fillStyle = '#7A5230'; x.fillRect(tx - 2.5, ty, 5, s * .9);
          const tg = x.createRadialGradient(tx - s * .3, ty - s * .4, 2, tx, ty - s * .2, s * 1.1);
          tg.addColorStop(0, '#9BE27C'); tg.addColorStop(1, '#3E9A3A');
          x.fillStyle = tg; x.beginPath(); x.arc(tx, ty - s * .2, s * .8, 0, TAU); x.arc(tx - s * .5, ty + s * .1, s * .55, 0, TAU); x.arc(tx + s * .5, ty + s * .1, s * .55, 0, TAU); x.fill();
        }
      }
      const fc = ['#FFFFFF', '#FFE45C', '#FF8CC6', '#FF6B6B', '#B78CFF'];
      for (let i = 0; i < d.dots * w / 400; i++) {
        const px = R() * w, py = d.base - d.amp * .3 + R() * (H - d.base + d.amp * .3);
        x.fillStyle = fc[i % fc.length]; x.globalAlpha = .55 + R() * .45;
        x.beginPath(); x.arc(px, py, (1 + R() * 1.6) * (li + 1) * .7, 0, TAU); x.fill();
      }
      x.globalAlpha = 1;
      // تظليل خفيف للعمق
      const sg = x.createLinearGradient(0, d.base - d.amp, 0, H); sg.addColorStop(0, 'rgba(255,255,220,.12)'); sg.addColorStop(1, 'rgba(20,80,20,.18)');
      x.fillStyle = sg; x.fillRect(0, 0, w, H);
      x.restore();
      return { c, k: d.k, pad };
    });
  }
  const FLC = [['#FF5C8A', '#FFC2D6'], ['#FFD23F', '#FFF3B0'], ['#FFFFFF', '#FFFFFF'], ['#B17CFF', '#E2CCFF'], ['#FF8A3D', '#FFD0A8'], ['#5AA9FF', '#CDE6FF'], ['#FF4D4D', '#FFB3B3']];
  function buildFlowers() {
    const R = rng(77), n = Math.round(W / 34) + 6;
    flowers = [];
    for (let i = 0; i < n; i++) {
      const by = meadowY + 10 + R() * (H - meadowY - 6);
      const near = (by - meadowY) / (H - meadowY);
      const sc = .6 + near * .7;
      flowers.push({
        x: R() * W, by, h: (34 + R() * 46) * sc * clamp(S / 70, .8, 1.2), r: (9 + R() * 7) * sc * clamp(S / 70, .8, 1.25),
        type: Math.floor(R() * 3), col: FLC[Math.floor(R() * FLC.length)], petals: 5 + Math.floor(R() * 4),
        ph: R() * TAU, sw: 3 + R() * 5, hx: 0, hy: 0, busy: false
      });
    }
    flowers.sort((a, b) => a.by - b.by);
    // عشب أمامي
    grass = [];
    for (let xx = -6; xx < W + 6; xx += 5) grass.push({ x: xx + rand(-2, 2), h: rand(10, 24), ph: rand(0, TAU), c: Math.random() < .5 ? 0 : 1 });
  }
  function makeCloud(x, i) {
    const s = rand(.6, 1.15) * clamp(W / 600, .7, 1.4), w = 120 * s, h = 56 * s;
    const c = mk((w + 20) * dpr, (h + 20) * dpr), g = c.getContext('2d'); g.scale(dpr, dpr);
    g.translate(10, 10);
    g.shadowColor = 'rgba(120,160,200,.35)'; g.shadowBlur = 8; g.shadowOffsetY = 4;
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(1, '#E6F1FB');
    g.fillStyle = gr;
    g.beginPath();
    g.arc(w * .28, h * .62, h * .34, 0, TAU); g.arc(w * .48, h * .42, h * .42, 0, TAU); g.arc(w * .7, h * .56, h * .34, 0, TAU);
    g.roundRect(w * .1, h * .55, w * .8, h * .38, h * .19); g.fill();
    return { c, x, y: rand(top - 20, Math.max(top + 10, meadowY - H * .3)), w: w + 20, h: h + 20, v: rand(6, 14) * (i % 2 ? 1 : .7) };
  }

  /* ---------- الفراشات ---------- */
  const matchT = (b, t) => !!t && (!t.col || b.col === t.col) && (!t.pat || b.pat === t.pat);
  const alive = () => bs.filter(b => b.st === 'fly' || b.st === 'rest');
  function look(want) {
    const pats = D.pats ? ['plain', 'plain', 'dots', 'stripes'] : ['plain'];
    for (let k = 0; k < 40; k++) {
      let col = pick(pool), pat = pick(pats);
      if (want === true && task) {
        if (task.col) col = task.col;
        if (task.pat) pat = task.pat; else if (task.kind === 'col' || task.kind === 'cnt') pat = pick(pats);
        return { col, pat };
      }
      if (want === false && task && matchT({ col, pat }, task)) continue;
      // في مهام اللون+النقش: مشتّتات قريبة (نفس اللون بنقش آخر)
      if (want === false && task && task.kind === 'combo' && Math.random() < .35) { col = task.col; pat = pick(['plain', 'dots', 'stripes'].filter(p => p !== task.pat)); }
      return { col, pat };
    }
    return { col: pick(pool), pat: 'plain' };
  }
  function makeB(lk, inside) {
    const size = Math.round(S * D.size * rand(.9, 1.08) / 3) * 3;
    const b = {
      col: lk.col, pat: lk.pat, S: size, st: 'fly', x: 0, y: 0, ry: 0, ang: rand(0, TAU), ph: rand(0, TAU),
      p1: rand(0, TAU), p2: rand(0, TAU), f1: rand(.5, 1.1), f2: rand(1.3, 2.3), vm: rand(.85, 1.15),
      fl: -1, restT: 0, cool: rand(1, 4), a: inside ? 0 : 1, rot: 0, pop: 0, ct: 0, net: null, wig: 0, hap: 0
    };
    if (inside) {
      b.x = rand(areaX + size, areaX + areaW - size); b.y = rand(top + size, H - size * 1.2);
    } else {
      const side = Math.random() < .5 ? -1 : 1;
      b.x = side < 0 ? -size : W + size; b.y = rand(top + size, meadowY);
      b.ang = side < 0 ? rand(-.5, .3) : Math.PI + rand(-.3, .5);
    }
    b.ry = b.y;
    bs.push(b); return b;
  }
  function spawnOne(want) { makeB(look(want), false); }
  function wantNext() {
    if (!task) return null;
    const left = Math.max(0, task.need - got);
    const m = alive().filter(b => matchT(b, task)).length;
    if (m < left + 1) return true;
    const nm = alive().length - m;
    if (nm < 2) return false;
    return Math.random() < .4 ? true : false;
  }
  /* تأكّد من وجود فراشات مطلوبة كافية عند بداية كل جولة */
  function ensureTargets() {
    const left = task.need - got;
    let m = alive().filter(b => matchT(b, task)).length;
    const others = alive().filter(b => !matchT(b, task)).sort(() => Math.random() - .5);
    while (m < left + 1) {
      const o = others.pop();
      if (o && alive().length >= D.count) { o.st = 'leave'; o.fl = -1; }
      spawnOne(true); m++;
    }
    const nm = alive().filter(b => !matchT(b, task)).length;
    for (let i = nm; i < Math.min(3, D.count - left - 1); i++) spawnOne(false);
  }

  /* ---------- المستويات والجولات ---------- */
  function makeTasks() {
    const out = [];
    for (let i = 0; i < D.tasks; i++) {
      const prev = out[i - 1];
      let kind = i === 0 ? 'col' : pick(D.kinds);
      let t;
      const ncol = () => { let c; do c = pick(pool); while (prev && prev.col === c && pool.length > 1); return c; };
      if (kind === 'col') t = { kind, col: ncol(), pat: null, need: D.need };
      else if (kind === 'pat') t = { kind, col: null, pat: prev && prev.pat === 'dots' ? 'stripes' : pick(['dots', 'stripes']), need: D.need };
      else if (kind === 'cnt') t = { kind, col: ncol(), pat: null, need: Math.min(5, 3 + Math.floor(Math.random() * (D.need - 1))) };
      else t = { kind, col: ncol(), pat: pick(['dots', 'stripes']), need: Math.max(2, D.need - 1) };
      out.push(t);
    }
    return out;
  }
  function closeOverlays() { [lvOv, winOv, toOv].forEach(o => o.classList.remove('on')); overOv = null; }
  function startLevel(n) {
    lvl = clamp(n, 1, NL); D = lvDef(lvl);
    clearTimeout(winTimer); clearTimeout(speakTimer); closeOverlays();
    pool = COLS.slice(0, D.nc).map(c => c.k);
    tasks = makeTasks(); ti = 0; mistakes = 0; caughtL = 0; elapsed = 0;
    bs = []; parts = []; rings = []; floats = [];
    phase = 'play'; frBtn.textContent = '🌸'; frBtn.setAttribute('aria-label', App.t('حديقة حرة', 'Free garden'));
    prm.classList.remove('off');
    task = tasks[0];
    for (let i = 0; i < D.count; i++) makeB(look(i < task.need + 1 ? true : false), true);
    if (lvl >= 10) App.achieve('bfly_lvl10');
    beginTask(0);
    Sound.whoosh();
  }
  function beginTask(i) {
    ti = i; task = tasks[i]; got = 0; tLeft = D.timer; phase = 'play';
    ensureTargets(); paintPrompt(); updChips();
    prm.classList.remove('bump'); void prm.offsetWidth; prm.classList.add('bump');
    clearTimeout(speakTimer); speakTimer = setTimeout(() => { if (App.current === ID && !paused) sayTask(); }, 250);
  }
  function startFree() {
    clearTimeout(winTimer); clearTimeout(speakTimer); closeOverlays();
    D = FREE; pool = COLS.map(c => c.k); task = null; phase = 'free';
    bs = []; parts = []; rings = []; floats = [];
    for (let i = 0; i < D.count; i++) { const c = COLS[i % 10]; makeB({ col: c.k, pat: pick(['plain', 'plain', 'dots', 'stripes']) }, true); }
    frBtn.textContent = '🎯'; frBtn.setAttribute('aria-label', App.t('المستويات', 'Levels'));
    prm.classList.remove('off'); paintPrompt(); updChips();
    clearTimeout(speakTimer); speakTimer = setTimeout(() => { if (App.current === ID) say(freeMsg(), freeMsg()); }, 250);
    Sound.whoosh();
  }
  function sayTask() { if (task) say(taskText(task, true), taskText(task, true)); }
  function taskText(t, spoken) {
    if (isEn()) {
      const adj = [t.pat ? PAT_EN[t.pat] : '', t.col ? COL_EN[t.col] : ''].filter(Boolean).join(' ');
      if (t.kind === 'cnt') return `Touch ${spoken ? NUMW_EN[t.need] : t.need} ${adj ? adj + ' ' : ''}butterflies!`;
      return `Touch the ${adj ? adj + ' ' : ''}butterflies!`;
    }
    const v = App.g('المسي', 'المس');
    const C = t.col ? CK[t.col] : null;
    if (t.kind === 'cnt') return `${v} ${spoken ? NUMW[t.need] : t.need} فراشات${C ? ' ' + C.i : ''}${t.pat ? ' ' + PATS[t.pat].ind : ''}!`;
    return `${v} الفراشات${C ? ' ' + C.f : ''}${t.pat ? ' ' + PATS[t.pat].def : ''}!`;
  }
  function paintSwatch(t) {
    const c = swc.getContext('2d'), s = 124, r = 52;
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, s, s);
    c.save(); c.translate(s / 2, s / 2);
    if (!t) { // حديقة حرة: عجلة ألوان
      COLS.forEach((C, i) => { c.beginPath(); c.moveTo(0, 0); c.arc(0, 0, r, i * TAU / 10 - Math.PI / 2, (i + 1) * TAU / 10 - Math.PI / 2); c.closePath(); c.fillStyle = C.c; c.fill(); });
      c.lineWidth = 5; c.strokeStyle = '#fff'; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke();
      drawButterflyDirect(c, 0, 4, 30, CK.pink, 'dots', 0, .9);
      c.restore(); return;
    }
    const C = t.col ? CK[t.col] : { c: '#FFFFFF', d: '#B9AFC4', l: '#FFFFFF', p: '#5B4A6E' };
    c.save(); c.shadowColor = 'rgba(0,0,0,.25)'; c.shadowBlur = 6; c.shadowOffsetY = 3;
    const g = c.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r);
    g.addColorStop(0, C.l); g.addColorStop(.55, C.c); g.addColorStop(1, C.d);
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill(); c.restore();
    c.save(); c.beginPath(); c.arc(0, 0, r, 0, TAU); c.clip();
    if (t.pat === 'dots') { c.fillStyle = C.p; [[-.4, -.35, .2], [.35, -.3, .16], [0, .1, .22], [-.4, .45, .15], [.45, .42, .17], [.05, -.7, .12]].forEach(([x, y, rr]) => { c.beginPath(); c.arc(x * r, y * r, rr * r, 0, TAU); c.fill(); }); }
    if (t.pat === 'stripes') { c.strokeStyle = C.p; c.lineWidth = r * .22; for (let k = -2; k <= 2; k++) { c.beginPath(); c.moveTo(-r, k * r * .5 - r * .5); c.lineTo(r, k * r * .5 + r * .5); c.stroke(); } }
    c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(-r * .38, -r * .45, r * .28, r * .14, -.6, 0, TAU); c.fill();
    c.restore();
    c.lineWidth = 5; c.strokeStyle = '#fff'; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.stroke();
    if (t.kind === 'cnt') {
      c.fillStyle = '#E9559B'; c.beginPath(); c.arc(r * .7, r * .7, 22, 0, TAU); c.fill();
      c.lineWidth = 4; c.strokeStyle = '#fff'; c.stroke();
      c.fillStyle = '#fff'; c.font = `900 28px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t.need, r * .7, r * .74);
    }
    c.restore();
  }
  function paintPrompt() {
    if (phase === 'free') {
      ptxt.textContent = '🌸 ' + freeMsg();
      dotsEl.innerHTML = ''; tmr.classList.remove('on'); paintSwatch(null); return;
    }
    if (!task) return;
    ptxt.textContent = taskText(task, false);
    paintDots();
    tmr.classList.toggle('on', !!D.timer);
    paintSwatch(task);
  }
  function paintDots() {
    if (!task) return;
    dotsEl.innerHTML = Array.from({ length: task.need }, (_, i) => `<i class="${i < got ? 'on' : ''}">${i < got ? '🦋' : ''}</i>`).join('');
  }
  function updChips() {
    if (phase === 'free') {
      root.querySelector('.c1s').textContent = App.t('حديقة حرة', 'Free garden'); root.querySelector('.c1b').textContent = '🌸';
      root.querySelector('.c2').style.display = 'none';
    } else {
      root.querySelector('.c1s').textContent = App.t('المستوى', 'Level'); root.querySelector('.c1b').textContent = lvl + '/' + NL;
      root.querySelector('.c2').style.display = '';
      root.querySelector('.c2b').textContent = (ti + 1) + '/' + tasks.length;
    }
  }

  /* ---------- اللعب ---------- */
  function chime() {
    const f = [1047, 1319, 1568, 2093][Math.min(3, got)];
    Sound.tone(f, .18, 'sine', .14); Sound.tone(f * 1.5, .22, 'triangle', .05, 0, .05); Sound.tone(f * 2, .12, 'sine', .04, 0, .1);
  }
  function catchB(b) {
    b.st = 'caught'; b.ct = 0; b.fl = -1;
    b.net = { sx: b.x + S * 1.7, sy: b.ry - S * 2.4, x: b.x, y: b.ry };
    got++; caughtL++;
    const pr = loadProg(); pr.total++; store.set('butterflyProg', pr);
    if (pr.total >= 50) App.achieve('bfly_50');
    Sound.whoosh(); setTimeout(() => { chime(); Sound.pop(); }, 120);
    vibrate(15);
    paintDots();
    if (got >= task.need) { phase = 'between'; betweenT = 1.05; }
  }
  function wrongB(b, m) {
    mistakes++;
    b.st = 'flee'; b.fl = -1;
    b.ang = Math.atan2(b.ry - m.y - S * .6, b.x - m.x || 1);
    b.wig = 1;
    Sound.tone(520, .16, 'sine', .1, -160); Sound.tone(400, .22, 'sine', .08, -110, .12);
    Sound.noise(.3, 1800, 3200, .03, 2);
    vibrate(25);
    floats.push({ x: b.x, y: b.ry - b.S * .5, txt: '💨', col: '#fff', age: 0, life: .9, sz: 26 });
    prm.classList.remove('wig'); void prm.offsetWidth; prm.classList.add('wig');
    const C = CK[b.col];
    say(`هذه فراشة ${C.i}${b.pat !== 'plain' ? ' ' + PATS[b.pat].ind : ''}`, `This is a ${b.pat !== 'plain' ? PAT_EN[b.pat] + ' ' : ''}${COL_EN[b.col]} butterfly`);
  }
  function freeTap(b) {
    const C = CK[b.col];
    b.pop = 1; b.hap = 1;
    say(C.n, cap(COL_EN[C.k]));
    Sound.tone(880 + COLS.indexOf(C) * 60, .16, 'sine', .12); Sound.tone(1320 + COLS.indexOf(C) * 90, .14, 'triangle', .05, 0, .06);
    sparkle(b.x, b.ry, C.c, 12);
    floats.push({ x: b.x, y: b.ry - b.S * .7, txt: colName(C), col: C.c, dark: C.d, age: 0, life: 1.6, sz: 30, label: true });
    vibrate(10);
  }
  function taskDone() {
    if (ti + 1 < tasks.length) {
      Sound.star();
      beginTask(ti + 1);
    } else levelWin();
  }
  function levelWin() {
    phase = 'over';
    const pr = loadProg();
    const par = tasks.reduce((a, t) => a + t.need, 0) * 2.4 + tasks.length * 2;
    let stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    if (elapsed > par * 1.6 && stars > 1) stars--;
    const prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(NL, lvl + 1);
    store.set('butterflyProg', pr);
    for (let i = 0; i < 130; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 240), rot: rand(0, TAU), vr: rand(-8, 8),
      life: rand(2.5, 4), age: 0, s: rand(6, 11), c: COLS[i % 7].c });
    Sound.win(); vibrate(30);
    // الفراشات تحتفل وتطير
    for (const b of bs) if (b.st === 'fly' || b.st === 'rest') { b.st = 'fly'; b.fl = -1; b.hap = 1; }
    winTimer = setTimeout(() => {
      if (App.current !== ID) return;
      winInfo = { stars, n: lvl, c: caughtL, ms: mistakes }; fillWin();
      root.querySelector('#bfWin [data-a="next"]').style.display = lvl < NL ? '' : 'none';
      winOv.classList.add('on'); overOv = winOv;
      say(App.g('أحسنتِ!', 'أحسنت!'), 'Well done!');
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('bfly_first');
      if (pr.unlocked >= 10) App.achieve('bfly_lvl10');
    }, 1100);
  }
  function timeUp() {
    phase = 'over';
    Sound.tone(440, .3, 'triangle', .1, -120); Sound.tone(330, .4, 'triangle', .08, -80, .2);
    for (const b of bs) if (b.st === 'fly' || b.st === 'rest') { b.st = 'flee'; b.ang = -Math.PI / 2 + rand(-1, 1); }
    winTimer = setTimeout(() => {
      if (App.current !== ID) return;
      winInfo = winInfo || {}; fillWin();
      toOv.classList.add('on'); overOv = toOv;
    }, 900);
  }

  /* ---------- مستويات ---------- */
  function openLevels() {
    const pr = loadProg();
    const g = root.querySelector('.lvg');
    g.innerHTML = Array.from({ length: NL }, (_, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked, d = lvDef(n), nc = COLS[d.nc - 1];
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl && phase !== 'free' ? ' cur' : ''}" data-l="${n}" aria-label="${App.t('المستوى', 'Level')} ${n}">
        <span class="c" style="background:${nc.c}"></span><span class="n">${n}</span>
        <span class="s">${lock ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    g.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); toOv.classList.remove('on'); lvOv.classList.add('on');
  }
  function act(a) {
    Sound.tap();
    if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
    else if (a === 'free') startFree();
    else if (a === 'close') {
      lvOv.classList.remove('on');
      if (phase === 'over' && overOv) overOv.classList.add('on');
    }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });
  frBtn.addEventListener('click', () => { Sound.tap(); if (phase === 'free') startLevel(loadProg().unlocked); else startFree(); });
  prm.addEventListener('click', () => {
    Sound.tap();
    if (phase === 'free') say(freeMsg(), freeMsg());
    else sayTask();
    prm.classList.remove('bump'); void prm.offsetWidth; prm.classList.add('bump');
  });

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function hitB(m, t) {
    let best = null, bd = 1e9, bm = null, bmd = 1e9;
    for (const b of bs) {
      if (b.st !== 'fly' && b.st !== 'rest') continue;
      const d = Math.hypot(b.x - m.x, b.ry - m.y);
      if (d < b.S * .74) {
        if (d < bd) { bd = d; best = b; }
        if (t && matchT(b, t) && d < bmd) { bmd = d; bm = b; }
      }
    }
    return bm || best;
  }
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused || [lvOv, winOv, toOv].some(o => o.classList.contains('on'))) return;
    const m = pos(e);
    if (phase === 'free') { const b = hitB(m, null); if (b) freeTap(b); else rings.push({ x: m.x, y: m.y, age: 0, life: .35, c: '#fff', r: 18 }); return; }
    if (phase !== 'play') return;
    const b = hitB(m, task);
    if (!b) { rings.push({ x: m.x, y: m.y, age: 0, life: .35, c: '#fff', r: 18 }); return; }
    if (matchT(b, task)) catchB(b); else wrongB(b, m);
  });
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < NL ? 'next' : 'levels'); }
    else if (toOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act('again'); }
    else if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? act('close') : openLevels(); }
    else if (e.key === 'r' || e.key === 'R' || e.key === ' ') { if (task && phase === 'play') { e.preventDefault(); App.speak(taskText(task, true)); } }
  });

  /* ---------- الجسيمات ---------- */
  function sparkle(x, y, col, n = 18) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU), v = rand(70, 230);
      parts.push({ t: i % 3 ? 'star' : 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 50, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .9), age: 0, s: rand(5, 10), c: i % 2 ? '#FFE26B' : col });
    }
    rings.push({ x, y, age: 0, life: .45, c: '#FFF4B0', r: S * .45 });
  }

  /* ---------- التحديث ---------- */
  function flowerHead(f) {
    const sw = Math.sin(T * 1.3 + f.ph) * f.sw + Math.sin(T * .7 + f.ph * 2) * f.sw * .4;
    f.hx = f.x + sw; f.hy = f.by - f.h + Math.abs(sw) * .15;
  }
  function update(dt) {
    T += dt;
    for (const f of flowers) flowerHead(f);
    for (const c of clouds) { c.x += c.v * dt; if (c.x > W + 20) { c.x = -c.w; c.y = rand(top - 20, Math.max(top + 10, meadowY - H * .3)); } }
    for (const p of pollen) { p.y -= p.v * dt * .4; p.x += Math.sin(T * .8 + p.ph) * 8 * dt; if (p.y < top - 10) { p.y = H + 5; p.x = rand(0, W); } }

    if (phase === 'play') {
      elapsed += dt;
      if (D.timer) {
        tLeft -= dt;
        const pct = clamp(tLeft / D.timer, 0, 1);
        tmrI.style.width = (pct * 100).toFixed(1) + '%'; tmr.classList.toggle('low', pct < .3);
        if (tLeft <= 0) timeUp();
      }
    } else if (phase === 'between') {
      elapsed += dt; betweenT -= dt;
      if (betweenT <= 0) taskDone();
    }
    // إعادة ملء الحديقة
    if (phase === 'play' || phase === 'between' || phase === 'free') {
      spawnT -= dt;
      const n = alive().length;
      if (n < D.count && spawnT <= 0) { spawnT = rand(.4, .9); spawnOne(phase === 'free' ? null : wantNext()); }
    }

    const x0 = areaX + S * .6, x1 = areaX + areaW - S * .6, y0 = top + S * .55, y1 = H - S * .55;
    for (let i = bs.length - 1; i >= 0; i--) {
      const b = bs[i];
      b.pop = Math.max(0, b.pop - dt * 2.2); b.hap = Math.max(0, b.hap - dt * .8); b.wig = Math.max(0, b.wig - dt * 1.5);
      if (b.a < 1) b.a = Math.min(1, b.a + dt * 2.5);
      const base = S * D.spd * b.vm;
      if (b.st === 'caught') {
        b.ct += dt; b.ph += dt * 26;
        if (b.ct > 1.15) { bs.splice(i, 1); continue; }
        continue;
      }
      if (b.st === 'rest') {
        const f = flowers[b.fl];
        b.restT -= dt; b.ph += dt * (2.2 + Math.sin(T * 2 + b.p1) * 1.2);
        if (f) { b.x = f.hx; b.y = f.hy - b.S * .12; }
        if (b.restT <= 0 || !f || phase === 'over') { b.st = 'fly'; b.ang = -Math.PI / 2 + rand(-.9, .9); b.cool = rand(2, 5); if (f) f.busy = false; b.fl = -1; }
        b.ry = b.y; b.rot += (0 - b.rot) * Math.min(1, dt * 6);
        continue;
      }
      let v = base * (.85 + .3 * Math.sin(T * 2.1 + b.p1));
      b.ph += dt * (13 + D.spd * 3);
      if (b.st === 'fly') {
        b.ang += (Math.sin(T * b.f1 + b.p1) * 1.3 + Math.sin(T * b.f2 + b.p2) * .9) * dt * 1.4;
        if (b.hap > 0) b.ang += dt * 7 * b.hap;
        // الطيران نحو زهرة للراحة
        b.cool -= dt;
        if (b.fl < 0 && b.cool <= 0 && phase !== 'over') {
          b.cool = rand(1.5, 4);
          if (Math.random() < D.rest) {
            const free = flowers.map((f, k) => k).filter(k => !flowers[k].busy && flowers[k].x > x0 && flowers[k].x < x1);
            if (free.length) { b.fl = pick(free); flowers[b.fl].busy = true; }
          }
        }
        if (b.fl >= 0) {
          const f = flowers[b.fl], tx = f.hx, ty = f.hy - b.S * .12, dd = Math.hypot(tx - b.x, ty - b.y);
          b.ang += angDiff(b.ang, Math.atan2(ty - b.y, tx - b.x)) * Math.min(1, dt * 4);
          v = Math.min(v, dd * 3 + 12);
          if (dd < 6) { b.st = 'rest'; b.restT = rand(1.3, 3) * (phase === 'free' ? 1.5 : 1); }
        } else {
          let px = 0, py = 0; const m = S * 1.2;
          if (b.x < x0 + m) px += (x0 + m - b.x) / m; if (b.x > x1 - m) px -= (b.x - x1 + m) / m;
          if (b.y < y0 + m) py += (y0 + m - b.y) / m; if (b.y > y1 - m * .5) py -= (b.y - y1 + m * .5) / m;
          if (px || py) b.ang += angDiff(b.ang, Math.atan2(py, px)) * Math.min(1, dt * 2.2 * Math.min(2, Math.hypot(px, py)));
        }
      } else if (b.st === 'flee') {
        v = base * 2.2 + S * 2.2;
        b.ang += Math.sin(T * 14 + b.p1) * dt * 3;
        b.ang += angDiff(b.ang, -Math.PI / 2) * dt * .8;
        b.ph += dt * 10;
        if (b.x < -b.S * 2 || b.x > W + b.S * 2 || b.y < -b.S * 2 || b.y > H + b.S * 2) { bs.splice(i, 1); continue; }
      } else if (b.st === 'leave') {
        const tgt = b.x < W / 2 ? Math.PI : 0;
        b.ang += angDiff(b.ang, tgt + (b.y > H / 2 ? -.5 : .3) * (tgt ? -1 : 1)) * dt * 2;
        v = base * 1.4;
        if (b.x < -b.S * 2 || b.x > W + b.S * 2 || b.y < -b.S * 2 || b.y > H + b.S * 2) { bs.splice(i, 1); continue; }
      }
      const vx = Math.cos(b.ang) * v, vy = Math.sin(b.ang) * v;
      b.x += vx * dt; b.y += vy * dt;
      b.ry = b.y - Math.sin(b.ph) * b.S * .045;
      const tr = clamp(vx / (Math.abs(v) + 1), -1, 1) * .5 + clamp(vy / (Math.abs(v) + 1), -1, 1) * .08 * Math.sign(vx);
      b.rot += (tr - b.rot) * Math.min(1, dt * 5);
    }
    // أزهار مشغولة بلا فراشات
    for (const f of flowers) f.busy = false;
    for (const b of bs) if (b.fl >= 0 && flowers[b.fl]) flowers[b.fl].busy = true;

    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.t === 'conf') { q.vy = Math.min(q.vy + 120 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; }
      else { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 260 * dt; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    for (let i = floats.length - 1; i >= 0; i--) { const f = floats[i]; f.age += dt; f.y -= dt * (f.label ? 26 : 50); if (f.age > f.life) floats.splice(i, 1); }
    shake = Math.max(0, shake - dt * 18);
  }

  /* ---------- الرسم ---------- */
  function drawBg() {
    let g = ctx.createLinearGradient(0, 0, 0, meadowY);
    g.addColorStop(0, '#6EC3F4'); g.addColorStop(.55, '#B5E3FF'); g.addColorStop(1, '#FFF4D6');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // الشمس
    const sx = W - Math.min(80, W * .16), sy = top + 34, sr = clamp(W * .07, 26, 44);
    ctx.save(); ctx.translate(sx, sy);
    g = ctx.createRadialGradient(0, 0, sr * .5, 0, 0, sr * 3.2); g.addColorStop(0, 'rgba(255,240,150,.7)'); g.addColorStop(1, 'rgba(255,240,150,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, sr * 3.2, 0, TAU); ctx.fill();
    ctx.rotate(T * .15);
    ctx.fillStyle = 'rgba(255,214,70,.55)';
    for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); ctx.beginPath(); ctx.moveTo(sr * 1.15, -sr * .14); ctx.lineTo(sr * (1.75 + .15 * Math.sin(T * 2 + i)), 0); ctx.lineTo(sr * 1.15, sr * .14); ctx.fill(); }
    ctx.rotate(-T * .15 - TAU);
    g = ctx.createRadialGradient(-sr * .3, -sr * .3, sr * .1, 0, 0, sr); g.addColorStop(0, '#FFF7B5'); g.addColorStop(.7, '#FFD43B'); g.addColorStop(1, '#FFB81C');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, sr, 0, TAU); ctx.fill();
    ctx.fillStyle = '#B5651D'; ctx.beginPath(); ctx.arc(-sr * .3, -sr * .08, sr * .08, 0, TAU); ctx.arc(sr * .3, -sr * .08, sr * .08, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#B5651D'; ctx.lineWidth = sr * .07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, sr * .12, sr * .3, .3, Math.PI - .3); ctx.stroke();
    ctx.fillStyle = 'rgba(255,120,120,.35)'; ctx.beginPath(); ctx.arc(-sr * .55, sr * .2, sr * .14, 0, TAU); ctx.arc(sr * .55, sr * .2, sr * .14, 0, TAU); ctx.fill();
    ctx.restore();
    for (const c of clouds) ctx.drawImage(c.c, c.x, c.y, c.w, c.h);
    // التلال (منظور متوازي)
    for (const L of layers) ctx.drawImage(L.c, -L.pad + Math.sin(T * .13) * L.k, 0, W + L.pad * 2, H);
  }
  function drawFlower(f) {
    ctx.save();
    // الساق
    ctx.strokeStyle = '#3E9B3A'; ctx.lineWidth = Math.max(2, f.r * .22); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(f.x, f.by); ctx.quadraticCurveTo(f.x + (f.hx - f.x) * .2, f.by - f.h * .5, f.hx, f.hy); ctx.stroke();
    // ورقة
    const lx = f.x + (f.hx - f.x) * .15, ly = f.by - f.h * .35;
    ctx.fillStyle = '#4CB548';
    ctx.save(); ctx.translate(lx, ly); ctx.rotate(-.7 + Math.sin(T * 1.3 + f.ph) * .1);
    ctx.beginPath(); ctx.ellipse(f.r * .7, 0, f.r * .75, f.r * .28, 0, 0, TAU); ctx.fill(); ctx.restore();
    ctx.translate(f.hx, f.hy); ctx.rotate((f.hx - f.x) * .02);
    const [c1, c2] = f.col, r = f.r;
    if (f.type === 2) { // توليب
      const g = ctx.createLinearGradient(0, -r, 0, r); g.addColorStop(0, c2); g.addColorStop(1, c1);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(-r * .8, -r * .4); ctx.lineTo(-r * .4, -r * .9); ctx.lineTo(0, -r * .5); ctx.lineTo(r * .4, -r * .9); ctx.lineTo(r * .8, -r * .4);
      ctx.quadraticCurveTo(r * .85, r * .7, 0, r * .75); ctx.quadraticCurveTo(-r * .85, r * .7, -r * .8, -r * .4); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,.12)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, -r * .5); ctx.lineTo(0, r * .6); ctx.stroke();
    } else {
      const n = f.petals;
      for (let i = 0; i < n; i++) {
        ctx.save(); ctx.rotate(i * TAU / n + T * .05 * (f.type ? 1 : 0));
        const g = ctx.createRadialGradient(0, -r * .2, 0, 0, -r * .55, r * .7); g.addColorStop(0, c2); g.addColorStop(1, c1);
        ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, -r * .58, r * (f.type ? .38 : .3), r * .6, 0, 0, TAU); ctx.fill();
        if (c1 === '#FFFFFF') { ctx.strokeStyle = 'rgba(160,170,190,.6)'; ctx.lineWidth = 1; ctx.stroke(); }
        ctx.restore();
      }
      const g = ctx.createRadialGradient(-r * .1, -r * .1, 0, 0, 0, r * .36); g.addColorStop(0, '#FFF2A0'); g.addColorStop(1, f.type ? '#E89B0C' : '#C9760C');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * .34, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(120,60,0,.35)';
      for (let i = 0; i < 5; i++) { const a = i * 2.4; ctx.beginPath(); ctx.arc(Math.cos(a) * r * .17, Math.sin(a) * r * .17, r * .04, 0, TAU); ctx.fill(); }
    }
    ctx.restore();
  }
  function drawB(b, x, y, sc, alpha, flapK = 1) {
    const R = b.S / 2, sp = sprite(b.col, b.pat, b.S);
    const open = .5 + .5 * Math.cos(b.ph);
    const sx = b.st === 'rest' ? .35 + .65 * open : .14 + .86 * open * flapK + (1 - flapK) * .5;
    const sq = Math.sin((1 - b.pop) * Math.PI * 3) * b.pop * .16;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y);
    ctx.rotate(b.rot + Math.sin(T * 30) * b.wig * .3 + (b.hap > 0 ? Math.sin(T * 9) * .25 * b.hap : 0));
    ctx.scale(sc * (1 + sq), sc * (1 - sq));
    ctx.save(); ctx.scale(sx, 1); ctx.drawImage(sp.c, 0, -sp.oy, sp.w, sp.h); ctx.restore();
    ctx.save(); ctx.scale(-sx, 1); ctx.drawImage(sp.c, 0, -sp.oy, sp.w, sp.h); ctx.restore();
    drawBody(ctx, R, Math.sin(T * 5 + b.p1) * R * .04);
    ctx.restore();
  }
  /* الشبكة: إطار خشبي بيضاوي + كيس شبكي + مقبض */
  function drawNet(x, y, s, rot, alpha, part) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(rot);
    const rx = s * .78, ry = s * .3;
    if (part === 'back') {
      const bag = () => {
        ctx.beginPath(); ctx.moveTo(-rx, 0);
        ctx.bezierCurveTo(-rx * 1.05, s * .9, -rx * .2, s * 1.25, rx * .1, s * 1.15);
        ctx.bezierCurveTo(rx * .6, s * 1.05, rx * 1.05, s * .7, rx, 0);
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI, true);
        ctx.closePath();
      };
      bag();
      ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fill();
      ctx.save(); ctx.clip();
      ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.3;
      for (let k = -8; k <= 8; k++) { ctx.beginPath(); ctx.moveTo(k * s * .14 - s, -ry); ctx.lineTo(k * s * .14 + s, s * 1.4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(k * s * .14 + s, -ry); ctx.lineTo(k * s * .14 - s, s * 1.4); ctx.stroke(); }
      ctx.restore();
      bag(); ctx.strokeStyle = 'rgba(160,160,180,.6)'; ctx.lineWidth = 1.5; ctx.stroke();
    } else {
      // المقبض
      ctx.strokeStyle = '#8A5426'; ctx.lineWidth = s * .1; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(rx * .95, -ry * .2); ctx.lineTo(rx + s * 1.3, -s * 1.45); ctx.stroke();
      ctx.strokeStyle = '#C98A4B'; ctx.lineWidth = s * .04;
      ctx.beginPath(); ctx.moveTo(rx * .95, -ry * .35); ctx.lineTo(rx + s * 1.28, -s * 1.5); ctx.stroke();
      ctx.strokeStyle = '#E9559B'; ctx.lineWidth = s * .13;
      ctx.beginPath(); ctx.moveTo(rx + s * 1.0, -s * 1.12); ctx.lineTo(rx + s * 1.3, -s * 1.45); ctx.stroke();
      // الإطار
      ctx.strokeStyle = '#B87333'; ctx.lineWidth = s * .09;
      ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, TAU); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,230,180,.8)'; ctx.lineWidth = s * .03;
      ctx.beginPath(); ctx.ellipse(0, -s * .015, rx, ry, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    }
    ctx.restore();
  }
  function drawCaught(b) {
    const t = b.ct, s = b.S * 1.05, N = b.net;
    let nx, ny, sc = 1, al = 1, rot = 0;
    const inT = .2;
    if (t < inT) {
      const k = ease.outCubic(t / inT);
      nx = N.sx + (N.x - N.sx) * k; ny = N.sy + (N.y - b.S * .15 - N.sy) * k; rot = (1 - k) * -.7;
      drawB(b, N.x, N.y, 1, 1);
      drawNet(nx, ny, s, rot, 1, 'back'); drawNet(nx, ny, s, rot, 1, 'front');
      return;
    }
    if (!N.hit) { N.hit = true; sparkle(N.x, N.y, CK[b.col].c); floats.push({ x: N.x, y: N.y - b.S * .6, txt: '+1', col: '#FFD23F', dark: '#C97F00', age: 0, life: 1, sz: 34 }); shake = 2.5; }
    nx = N.x; ny = N.y - b.S * .15;
    if (t < .6) { rot = Math.sin((t - inT) * 30) * .12 * (1 - (t - inT) / .4); }
    else {
      const pr = prm.getBoundingClientRect(), cr = cv.getBoundingClientRect();
      const tx = pr.left - cr.left + 40, ty = pr.top - cr.top + 40;
      const k = ease.inCubic(clamp((t - .6) / .55, 0, 1));
      nx += (tx - nx) * k; ny += (ty - ny) * k; sc = 1 - k * .6; al = 1 - clamp((k - .6) / .4, 0, 1); rot = -k * .4;
    }
    ctx.save(); ctx.translate(nx, ny); ctx.scale(sc, sc); ctx.translate(-nx, -ny);
    drawNet(nx, ny, s, rot, al, 'back');
    ctx.save(); ctx.translate(nx, ny); ctx.rotate(rot);
    drawB(b, 0, s * .55, .62, al, .6);
    ctx.restore();
    drawNet(nx, ny, s, rot, al, 'front');
    ctx.restore();
  }
  function render() {
    ctx.save();
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    drawBg();
    for (const f of flowers) drawFlower(f);
    // حبوب لقاح
    ctx.fillStyle = 'rgba(255,250,200,.75)';
    for (const p of pollen) { ctx.globalAlpha = .4 + .4 * Math.sin(T * 2 + p.ph); ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.fill(); }
    ctx.globalAlpha = 1;
    // ظلال الفراشات على العشب
    for (const b of bs) {
      if (b.st === 'caught' || b.y < meadowY - H * .1) continue;
      ctx.fillStyle = 'rgba(20,70,20,.13)'; ctx.beginPath(); ctx.ellipse(b.x, Math.min(H - 6, b.y + b.S * .9), b.S * .4, b.S * .1, 0, 0, TAU); ctx.fill();
    }
    for (const b of bs) if (b.st === 'rest') drawB(b, b.x, b.ry, 1, b.a);
    for (const b of bs) if (b.st === 'fly' || b.st === 'leave' || b.st === 'flee') drawB(b, b.x, b.ry, 1, b.a);
    // عشب أمامي
    if (grass) {
      for (const k of [0, 1]) {
        ctx.fillStyle = k ? '#3FA236' : '#5BC04B'; ctx.beginPath();
        for (const g of grass) {
          if (g.c !== k) continue;
          const sw = Math.sin(T * 1.6 + g.ph + g.x * .01) * 4;
          ctx.moveTo(g.x - 3, H + 2); ctx.quadraticCurveTo(g.x + sw * .3, H - g.h * .5, g.x + sw, H - g.h); ctx.quadraticCurveTo(g.x + sw * .3 + 1, H - g.h * .5, g.x + 3, H + 2);
        }
        ctx.fill();
      }
    }
    for (const b of bs) if (b.st === 'caught') drawCaught(b);
    for (const r of rings) {
      const t = r.age / r.life;
      ctx.save(); ctx.globalAlpha = 1 - t; ctx.strokeStyle = r.c; ctx.lineWidth = 5 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r * (1 + t), 0, TAU); ctx.stroke(); ctx.restore();
    }
    for (const q of parts) {
      const a = 1 - q.age / q.life;
      ctx.save(); ctx.globalAlpha = q.t === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillStyle = q.c;
      if (q.t === 'star') { starPath(ctx, q.s * (.6 + a * .5)); ctx.fill(); }
      else if (q.t === 'dot') { ctx.beginPath(); ctx.arc(0, 0, q.s * .45 * a + 1, 0, TAU); ctx.fill(); }
      else { ctx.scale(1, Math.cos(q.age * 9 + q.rot)); ctx.fillRect(-q.s / 2, -q.s * .3, q.s, q.s * .6); }
      ctx.restore();
    }
    for (const f of floats) {
      const t = f.age / f.life, sc = t < .15 ? ease.outBack(t / .15) : 1;
      ctx.save(); ctx.globalAlpha = 1 - clamp((t - .7) / .3, 0, 1); ctx.translate(f.x, f.y); ctx.scale(sc, sc);
      ctx.font = `900 ${f.sz}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = f.label && /[\u0600-\u06FF]/.test(f.txt) ? 'rtl' : 'ltr';
      if (f.label) {
        const w = ctx.measureText(f.txt).width + 28, h = f.sz + 14;
        ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.shadowColor = 'rgba(0,0,0,.2)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
        ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill(); ctx.shadowColor = 'transparent';
        ctx.lineWidth = 3; ctx.strokeStyle = f.col === '#F7F8FA' ? '#C9CFD8' : f.col; ctx.stroke();
        ctx.fillStyle = f.col === '#F7F8FA' ? '#8E98A6' : f.dark; ctx.fillText(f.txt, 0, 2);
      } else if (f.dark) {
        ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.lineJoin = 'round'; ctx.strokeText(f.txt, 0, 0);
        ctx.fillStyle = f.dark; ctx.fillText(f.txt, 0, 2); ctx.fillStyle = f.col; ctx.fillText(f.txt, 0, 0);
      } else ctx.fillText(f.txt, 0, 0);
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
    clearTimeout(resizeT); resizeT = setTimeout(() => {
      const oW = W, oH = H; layout();
      for (const b of bs) { b.x = b.x / (oW || W) * W; b.y = b.y / (oH || H) * H; b.ry = b.y; b.S = Math.round(S * D.size / 3) * 3; if (b.st === 'rest') { b.st = 'fly'; b.fl = -1; } }
      if (!running) render();
    }, 80);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    IK.bg(c, s, ['#E6F7FF', '#8ED3FA', '#4AA6E8'], { seed: 16 });
    let g = c.createRadialGradient(s * .84, s * .16, 2, s * .84, s * .16, s * .2); g.addColorStop(0, '#FFF6B0'); g.addColorStop(.5, '#FFD43B'); g.addColorStop(1, 'rgba(255,212,59,0)');
    c.fillStyle = g; c.beginPath(); c.arc(s * .84, s * .16, s * .2, 0, TAU); c.fill();
    IK.ground(c, s, s * .76, '#8EE070', '#4FB33F');
    const fl = [[.12, .9, '#FF5C8A'], [.36, .95, '#FFD23F'], [.64, .92, '#FFFFFF'], [.9, .9, '#B17CFF']];
    for (const [fx, fy, col] of fl) {
      c.fillStyle = col; for (let i = 0; i < 6; i++) { const a = i * TAU / 6; c.beginPath(); c.ellipse(fx * s + Math.cos(a) * 6, fy * s + Math.sin(a) * 6, 5.5, 3.6, a, 0, TAU); c.fill(); }
      c.fillStyle = '#F2A20C'; c.beginPath(); c.arc(fx * s, fy * s, 3.8, 0, TAU); c.fill();
    }
    IK.sticker(c, s, c => {
      drawButterflyDirect(c, s * .38, s * .42, s * .25, CK.pink, 'dots', -.25, .95);
      drawButterflyDirect(c, s * .73, s * .6, s * .17, CK.blue, 'stripes', .3, .75);
    });
    IK.sparkle(c, s * .66, s * .24, 7); IK.sparkle(c, s * .14, s * .58, 6);
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'صيد الفراشات', icon2: '🦋', isNew: false, music: 'butterfly',
    titleEn: 'Butterfly Catch',
    desc: () => App.g('امسكي الفراشات وتعلّمي الألوان', 'امسك الفراشات وتعلّم الألوان'),
    descEn: () => 'Catch the butterflies and learn the colors',
    helpEn: () => [
      '🦋 Listen to the question, then touch the butterflies of the right color to catch them with the net',
      '🎨 The colored circle at the top reminds you of the color. Touch it to hear the question again 🔊',
      '🔍 In harder levels: spotted and striped butterflies, an exact number of butterflies, and a short time ⏰',
      '⭐ Catch the right butterflies with no mistakes to get 3 stars',
      '🌸 «Free garden»: touch any butterfly to hear the name of its color'
    ],
    help: () => [
      '🦋 ' + App.g('اسمعي', 'اسمع') + ' السؤال ثم ' + App.g('المسي', 'المس') + ' الفراشات باللون المطلوب لتمسكها بالشبكة',
      '🎨 المربّع الملوّن في الأعلى يذكّرك باللون. ' + App.g('المسيه', 'المسه') + ' لتسمع السؤال مرة أخرى 🔊',
      '🔍 في المستويات المتقدمة: فراشات منقّطة ومخططة، وعدد محدد من الفراشات، ووقت قصير ⏰',
      '⭐ ' + App.g('امسكي', 'امسك') + ' الفراشات الصحيحة دون أخطاء لتحصل على 3 نجوم',
      '🌸 «حديقة حرة»: ' + App.g('المسي', 'المس') + ' أي فراشة ' + App.g('لتسمعي', 'لتسمع') + ' اسم لونها'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 ${App.t('المستوى', 'Level')} ${Math.max(...ks)} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false; relabel();
      prm.classList.remove('off');
      layout();
      startLevel(loadProg().unlocked);
      layout(); // بعد ظهور بطاقة السؤال
      render();
      startLoop();
    },
    onLang() {
      relabel(); updChips(); paintPrompt(); fillWin();
      if (lvOv.classList.contains('on')) openLevels();
      if (phase === 'free') say(freeMsg(), freeMsg()); else if (phase === 'play') sayTask();
    },
    leave() { stopLoop(); clearTimeout(winTimer); clearTimeout(speakTimer); closeOverlays(); phase = 'idle'; try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {} },
    pause() { paused = true; },
    resume() { paused = false; last = performance.now(); },
    /* للاختبار الآلي فقط */
    _state() { return { lvl, phase, ti, got, mistakes, task, S, top, bs: bs.map(b => ({ col: b.col, pat: b.pat, st: b.st, x: b.x, y: b.ry, S: b.S, m: matchT(b, task) })) }; },
    _start(n) { startLevel(n); },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    }
  });
})();
