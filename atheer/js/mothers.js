/* =====================================================================
   أين أمي؟ — صغير حيوان تائه يبكي، اسحبه إلى أمه
   وضع ثانٍ: «صوت مَن هذا؟» (تسجيلات حقيقية لأصوات الحيوانات)
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'mothers';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,"Segoe UI",Tahoma,sans-serif';
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  /* ---------- الحيوانات ----------
     e/be: رمز الأم/الصغير، d/bd: اتجاه الوجه في الرمز (-1 يسار، 1 يمين، 0 أمامي)
     s/bs: ملف الصوت الحقيقي (sounds/animals/<اسم>.mp3) أو null إن لم يتوفر تسجيل */
  const AN = {
    cow:       { e: '🐄', d: -1, be: '🐮', bd: 0,  ar: 'البقرة',   bar: 'العِجْل',    c: 'وصغيرها',   en: 'cow',       ben: 'calf',        s: 'cow',   bs: 'calf' },
    sheep:     { e: '🐑', d: -1, be: '🐑', bd: -1, ar: 'النعجة',   bar: 'الحَمَل',    c: 'وصغيرها',   en: 'sheep',     ben: 'lamb',        s: 'sheep', bs: 'lamb' },
    hen:       { e: '🐔', d: -1, be: '🐥', bd: 0,  ar: 'الدجاجة',  bar: 'الكتكوت',   c: 'وصغيرها',   en: 'hen',       ben: 'chick',       s: 'hen',   bs: 'chick' },
    cat:       { e: '🐈', d: -1, be: '🐱', bd: 0,  ar: 'القطة',    bar: 'الهُرَيْرة',  c: 'وصغيرتها',  en: 'cat',       ben: 'kitten',      s: 'cat',   bs: 'kitten' },
    dog:       { e: '🐕', d: -1, be: '🐶', bd: 0,  ar: 'الكلبة',   bar: 'الجَرْو',    c: 'وصغيرها',   en: 'dog',       ben: 'puppy',       s: 'dog',   bs: 'puppy' },
    horse:     { e: '🐎', d: -1, be: '🐎', bd: -1, ar: 'الفرس',    bar: 'المُهْر',    c: 'وصغيرها',   en: 'horse',     ben: 'foal',        s: 'horse', bs: null, bp: 1.25 },
    camel:     { e: '🐫', d: -1, be: '🐪', bd: -1, ar: 'الناقة',   bar: 'الحُوار',    c: 'وصغيرها',   en: 'camel',     ben: 'calf',        s: null,    bs: null },
    lion:      { e: '🦁', d: 0,  be: '🦁', bd: 0,  ar: 'اللبؤة',   bar: 'الشِّبْل',    c: 'وصغيرها',   en: 'lion',      ben: 'cub',         s: null,    bs: null },
    duck:      { e: '🦆', d: -1, be: '🐤', bd: 1,  ar: 'البطة',    bar: 'الفَرْخ',    c: 'وصغيرها',   en: 'duck',      ben: 'duckling',    s: null,    bs: null },
    frog:      { e: '🐸', d: 0,  be: '#tadpole', bd: -1, ar: 'الضفدعة', bar: 'الشُّرْغُوف', c: 'وصغيرها', en: 'frog',   ben: 'tadpole',     s: 'frog',  bs: null },
    butterfly: { e: '🦋', d: 0,  be: '🐛', bd: 1,  ar: 'الفراشة',  bar: 'اليَرَقة',   c: 'وصغيرتها',  en: 'butterfly', ben: 'caterpillar', s: null,    bs: null },
    bear:      { e: '🐻', d: 0,  be: '🐻', bd: 0,  ar: 'الدُّبّة',   bar: 'الدَّيْسَم',   c: 'وصغيرها',   en: 'bear',      ben: 'cub',         s: 'bear',  bs: null, bp: 1.3 },
    elephant:  { e: '🐘', d: -1, be: '🐘', bd: -1, ar: 'الفيلة',   bar: 'الدَّغْفَل',   c: 'وصغيرها',   en: 'elephant',  ben: 'calf',        s: null,    bs: null },
    rabbit:    { e: '🐇', d: -1, be: '🐰', bd: 0,  ar: 'الأرنبة',  bar: 'الخِرْنِق',   c: 'وصغيرها',   en: 'rabbit',    ben: 'bunny',       s: null,    bs: null },
    goat:      { e: '🐐', d: -1, be: '🐐', bd: -1, ar: 'العنزة',   bar: 'الجَدْي',    c: 'وصغيرها',   en: 'goat',      ben: 'kid',         s: null,    bs: null }
  };
  for (const k in AN) AN[k].id = k;

  /* المستويات: match = أعِد الصغير إلى أمه، sound = صوت مَن هذا؟ */
  const LEVELS = [
    { m: 'match', sc: 'farm', a: ['cow', 'sheep', 'hen'] },
    { m: 'match', sc: 'farm', a: ['cat', 'dog', 'horse'] },
    { m: 'sound', sc: 'farm', a: ['cow', 'sheep', 'hen', 'cat', 'dog'], q: 5, ch: 3 },
    { m: 'match', sc: 'pond', a: ['duck', 'frog', 'butterfly'] },
    { m: 'match', sc: 'farm', a: ['goat', 'rabbit', 'cow', 'horse'] },
    { m: 'match', sc: 'wild', a: ['lion', 'elephant', 'bear'] },
    { m: 'sound', sc: 'pond', a: ['dog', 'cat', 'horse', 'frog', 'hen', 'bear'], q: 6, ch: 3 },
    { m: 'match', sc: 'wild', a: ['camel', 'lion', 'elephant', 'bear'] },
    { m: 'match', sc: 'farm', a: ['cow', 'sheep', 'hen', 'goat', 'cat'] },
    { m: 'sound', sc: 'wild', a: ['cow', 'sheep', 'hen', 'cat', 'dog', 'horse', 'frog', 'bear'], q: 6, ch: 4 },
    { m: 'match', sc: 'pond', a: ['duck', 'frog', 'butterfly', 'rabbit', 'dog'] },
    { m: 'match', sc: 'wild', a: ['camel', 'lion', 'elephant', 'bear', 'horse'] }
  ];

  const SCENES = {
    farm: { sky: ['#7CCBFF', '#D9F2FF'], far: ['#9EDB7E', '#7CC85E'], gr: ['#A4E36A', '#56B53A'], acc: '#3FA52E', lab: '#2E7D32' },
    pond: { sky: ['#86D3FF', '#E6F8FF'], far: ['#8FD9A0', '#5FBF7A'], gr: ['#97E27A', '#45A94A'], acc: '#1FA3C9', lab: '#16708C' },
    wild: { sky: ['#FFC98A', '#FFF1D6'], far: ['#E9B27A', '#D8955B'], gr: ['#F4CF7A', '#D69C3C'], acc: '#E07B1F', lab: '#9A4B0C' }
  };

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
  const plain = s => s.replace(/[ً-ْ]/g, '');
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const loadProg = () => { const p = store.get('mothersProg', null) || {}; return { stars: p.stars || {}, unlocked: p.unlocked || 1 }; };
  let lang = 'ar';
  const num = n => lang === 'ar' ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);

  /* ---------- الأصوات الحقيقية ---------- */
  const Snd = {
    bufs: {}, srcs: [],
    load(n) {
      if (!this.bufs[n]) this.bufs[n] = fetch('sounds/animals/' + n + '.mp3').then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then(a => new Promise((ok, no) => Sound.ac(true).decodeAudioData(a, ok, no))).catch(() => { delete this.bufs[n]; return null; });
      return this.bufs[n];
    },
    async play(n, rate = 1, vol = 1) {
      if (!n || !Sound.on) return 0;
      const ac = Sound.ac(true); if (!ac) return 0;
      const b = await this.load(n); if (!b) return 0;
      this.stop();
      const s = ac.createBufferSource(); s.buffer = b; s.playbackRate.value = rate;
      const g = ac.createGain(); g.gain.value = vol; s.connect(g); g.connect(ac.destination); s.start(); this.srcs.push(s);
      return b.duration / rate;
    },
    stop() { this.srcs.forEach(s => { try { s.stop(); } catch (e) {} }); this.srcs = []; }
  };
  const sndOf = (a, baby) => baby ? (a.bs ? [a.bs, 1] : a.s && a.bp ? [a.s, a.bp] : null) : (a.s ? [a.s, 1] : null);
  const hasSnd = (a, baby) => !!sndOf(a, baby);
  /* يشغّل صوت الحيوان ثم ينفّذ cb بعد انتهائه */
  function animalSound(a, baby, cb, vol = 1) {
    const sp = sndOf(a, baby);
    const my = ++sayTok;
    if (!sp) { if (cb) later(.15, () => { if (my === sayTok) cb(); }); return; }
    Snd.play(sp[0], sp[1], vol).then(d => { if (cb) later(Math.max(.15, d * .92), () => { if (my === sayTok) cb(); }); });
  }

  /* ---------- النطق (عربي / إنجليزي) ---------- */
  const say = (ar, en) => lang === 'ar' ? App.speak(plain(ar)) : App.speak(en, 'en');
  const pairText = a => lang === 'ar' ? `${a.ar} ${a.c} ${a.bar}` : `${cap(a.en)} and ${a.ben}`;
  const sayPair = a => say(`${a.ar} ${a.c} ${a.bar}`, `${a.en} and ${a.ben}`);
  const sayMom = a => say(a.ar, a.en);
  const sayWhere = () => say('أين أمي؟', 'Where is my mom?');
  const sayWho = () => say('من صاحب هذا الصوت؟', 'Who makes this sound?');
  const sayGood = () => say(App.g('أحسنتِ!', 'أحسنتَ!'), 'Well done!');
  const sayTry = () => say(App.g('حاولي مرة أخرى.', 'حاول مرة أخرى.'), 'Try again!');

  /* ---------- رسم الرموز بحواف بيضاء (شكل ملصق/لعبة) ---------- */
  const bakeCache = new Map();
  function drawTadpole(x, S) {
    x.save(); x.translate(S / 2, S / 2); x.scale(S / 100, S / 100); x.lineCap = x.lineJoin = 'round';
    // ذيل متموّج
    x.strokeStyle = '#4A5568'; x.lineWidth = 10; x.beginPath(); x.moveTo(8, 4);
    for (let i = 0; i <= 10; i++) x.lineTo(8 + i * 3.6, 4 + Math.sin(i * .9) * (2 + i * .9));
    x.stroke();
    x.strokeStyle = '#718096'; x.lineWidth = 4; x.stroke();
    // الرأس
    const g = x.createRadialGradient(-18, -10, 3, -8, 2, 30); g.addColorStop(0, '#8A94A6'); g.addColorStop(.55, '#4A5568'); g.addColorStop(1, '#2D3748');
    x.fillStyle = g; x.beginPath(); x.ellipse(-10, 2, 26, 22, -.15, 0, TAU); x.fill();
    x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.ellipse(-20, -9, 9, 5, -.5, 0, TAU); x.fill();
    // عينان كبيرتان
    for (const ex of [-24, -6]) {
      x.fillStyle = '#fff'; x.beginPath(); x.arc(ex, -2, 7.5, 0, TAU); x.fill();
      x.fillStyle = '#111'; x.beginPath(); x.arc(ex - 1.5, -1, 4.2, 0, TAU); x.fill();
      x.fillStyle = '#fff'; x.beginPath(); x.arc(ex - 3, -3, 1.6, 0, TAU); x.fill();
    }
    x.strokeStyle = '#1A202C'; x.lineWidth = 2.2; x.beginPath(); x.arc(-15, 10, 5, .3, Math.PI - .3); x.stroke();
    x.fillStyle = 'rgba(255,120,140,.55)'; x.beginPath(); x.ellipse(-30, 9, 4, 2.6, 0, 0, TAU); x.ellipse(0, 9, 4, 2.6, 0, 0, TAU); x.fill();
    x.restore();
  }
  /* يعيد لوحة مربعة بحجم (size*1.3) بكسل جهاز: الرمز + حافة بيضاء + ظل خفيف */
  function bake(e, size) {
    const px = Math.max(8, Math.round(size * dpr)), key = e + '|' + px;
    let c = bakeCache.get(key); if (c) return c;
    const pad = Math.round(px * .15), S = px + pad * 2;
    const g = mk(S, S), x = g.getContext('2d');
    if (e[0] === '#') drawTadpole(x, S);
    else { x.font = `${Math.round(px * .86)}px ${EMOJI_FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(e, S / 2, S / 2 + px * .04); }
    const sil = mk(S, S), sx = sil.getContext('2d');
    sx.drawImage(g, 0, 0); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = '#fff'; sx.fillRect(0, 0, S, S);
    c = mk(S, S); const cx = c.getContext('2d');
    const r = Math.max(2, px * .045);
    cx.save(); cx.shadowColor = 'rgba(40,30,20,.28)'; cx.shadowBlur = px * .05; cx.shadowOffsetY = px * .025;
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; cx.drawImage(sil, Math.cos(a) * r, Math.sin(a) * r); }
    cx.restore();
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; cx.drawImage(sil, Math.cos(a) * r * .6, Math.sin(a) * r * .6); }
    cx.drawImage(g, 0, 0);
    if (bakeCache.size > 160) bakeCache.clear();
    bakeCache.set(key, c);
    return c;
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #mothers{background:#BFE6FF;overflow:hidden;color:#3B2A1A}
  #mothers canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #mothers .ib{color:#2E8B3A}
  #mothers .lang{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 rgba(30,80,30,.18),0 8px 16px rgba(30,60,30,.15)}
  #mothers .lang button{min-width:66px;padding:6px 12px;border-radius:99px;font-weight:900;font-size:17px;background:#F1F7EC;color:#4E7A33;line-height:1.25}
  #mothers .lang button[data-l=en]{font-family:system-ui,"Segoe UI",sans-serif;font-size:16px}
  #mothers .lang button.on{background:linear-gradient(#86DB57,#3FA52E);color:#fff;box-shadow:0 3px 0 #2B7A1D;text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #mothers .prog{position:absolute;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 58px);display:flex;gap:5px;padding:6px 10px;background:rgba(255,255,255,.9);border-radius:99px;z-index:4;box-shadow:0 3px 0 rgba(0,0,0,.08),0 6px 14px rgba(0,0,0,.08)}
  #mothers .prog i{width:24px;height:11px;border-radius:6px;background:#E2E8EE;box-shadow:inset 0 2px 0 rgba(0,0,0,.08);transition:background .3s}
  #mothers .prog i.on{background:linear-gradient(#FFC861,#FF8A1F);box-shadow:0 2px 0 #D06A00;animation:moPop .45s cubic-bezier(.3,1.8,.5,1)}
  @keyframes moPop{40%{transform:scale(1.5,1.3)}}
  #mothers .sayb{position:absolute;z-index:5;width:66px;height:66px;flex:none;font-size:30px;bottom:max(16px,env(safe-area-inset-bottom));left:max(16px,env(safe-area-inset-left))}
  #mothers .sayb.pulse{animation:moPulse 1s ease-in-out infinite}
  @keyframes moPulse{50%{transform:scale(1.12)}}
  #mothers .hint{top:auto;bottom:max(92px,calc(env(safe-area-inset-bottom) + 92px))}
  #mothers .hint span{color:#2E6B1F}
  #mothers .overlay{background:radial-gradient(circle at 50% 45%,rgba(30,80,40,.25),rgba(20,50,30,.5))}
  #mothers .panel{border:5px solid #CDEFB8;box-shadow:0 8px 0 #8FCB6E,0 20px 40px rgba(20,60,20,.3);color:#33461F}
  #mothers .panel h3{color:#3A9A2A;text-shadow:0 3px 0 #D8F5C4}
  #mothers .btn{background:linear-gradient(#86DB57,#3FA52E);box-shadow:0 5px 0 #2B7A1D,0 8px 12px rgba(40,120,30,.25)}
  #mothers .btn:active{box-shadow:0 1px 0 #2B7A1D}
  #mothers .btn.alt{background:#fff;color:#3A8A2A;box-shadow:0 5px 0 #B9E3A0;border:3px solid #DDF3CF}
  #mothers .wpair{font-size:56px;line-height:1.1;margin:2px 0;font-family:${EMOJI_FONT}}
  #mothers .lvp{width:min(94vw,440px);max-height:88vh;overflow-y:auto;touch-action:pan-y}
  #mothers .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:10px 0 12px}
  #mothers .lvb{position:relative;aspect-ratio:.9;border-radius:20px;background:#fff;border:3px solid #CDEFB8;box-shadow:0 5px 0 #A8DB8A;
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#3A6A22;font-weight:900;padding:2px}
  #mothers .lvb.s-pond{border-color:#BDE8F5;box-shadow:0 5px 0 #8CCFE3}
  #mothers .lvb.s-wild{border-color:#FBE0B4;box-shadow:0 5px 0 #EBC07A}
  #mothers .lvb:active{transform:translateY(3px);box-shadow:0 2px 0 #A8DB8A}
  #mothers .lvb .n{font-size:13px;position:absolute;top:2px;right:8px;opacity:.7}
  #mothers .lvb .md{font-size:13px;position:absolute;top:3px;left:6px}
  #mothers .lvb .e{font-size:30px;line-height:1.15;font-family:${EMOJI_FONT}}
  #mothers .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:12px}
  #mothers .lvb .s i{font-style:normal}
  #mothers .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #mothers .lvb.cur{outline:3px solid #FF9A1F;outline-offset:2px}
  #mothers .lvb.lock{background:#EEF1EA;border-color:#DDE3D6;box-shadow:0 5px 0 #C9D2BE;color:#8A9680}
  #mothers .lvb.lock .e{filter:grayscale(1);opacity:.35}
  #mothers .lvb.lock::after{content:'🔒';position:absolute;font-size:18px;bottom:3px}
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
    <div class="overlay" id="moLv"><div class="panel lvp"><h3>🔢 المستويات</h3><div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="moWin"><div class="panel">
      <h3 class="wT"></h3><div class="wpair"></div><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const progEl = root.querySelector('.prog'), sayBtn = root.querySelector('.sayb');
  const hintEl = root.querySelector('.hint'), hintT = root.querySelector('.hintT');
  const lvOv = root.querySelector('#moLv'), winOv = root.querySelector('#moWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, portrait = true;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, def = LEVELS[0], scene = SCENES.farm, bgLayer = null, bgKey = '';
  let moms = [], baby = null, queue = [], done = 0, total = 0, mistakes = 0, over = false;
  let quiz = null;                 // وضع الصوت: { q, target, used }
  let parts = [], tasks = [], sayTok = 0, drag = null, idleT = 0, shake = 0;
  let spkPop = 0, horizon = 0, home = { x: 0, y: 0 }, M = 100, BS = 60;

  function later(s, fn) { tasks.push({ t: s, fn }); }

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    portrait = W / H < 1.05;
    const top = progEl.getBoundingClientRect().bottom + 6;
    horizon = portrait ? Math.max(top + 70, H * .3) : Math.max(top + 60, H * .34);
    home = { x: W / 2, y: portrait ? H * .87 : H * .88 };
    placeMoms();
    buildBg();
  }
  function placeMoms() {
    const n = moms.length; if (!n) return;
    const aw = Math.min(W - 20, portrait ? 640 : 1060), ax = (W - aw) / 2;
    const rows = portrait ? (n <= 2 ? [n] : n === 3 ? [1, 2] : n === 4 ? [2, 2] : [2, 3]) : [n];
    const span = home.y - horizon;
    const maxRow = Math.max(...rows);
    let base = Math.min(aw / maxRow * (rows.length > 1 ? .78 : .8), span * (rows.length > 1 ? .33 : .5), 210);
    M = base; BS = Math.max(46, M * .56);
    const ys = rows.length === 1 ? [horizon + span * .5] : [horizon + span * .27, horizon + span * .63];
    const sc = rows.length === 1 ? [1] : [.88, 1];
    let i = 0;
    rows.forEach((k, r) => {
      for (let j = 0; j < k; j++, i++) {
        const m = moms[i]; if (!m) continue;
        let fx = (j + .5) / k;
        m.x = ax + aw * fx; m.y = ys[r] + (rows.length === 1 && k >= 3 ? (j % 2 ? -span * .06 : 0) : 0); m.s = M * sc[r];
        if (m.att) nestle(m, m.att, true);
      }
    });
    if (baby && baby.state !== 'hug' && baby.state !== 'fly') { baby.hx = home.x; baby.hy = home.y; if (baby.state === 'idle') { baby.x = home.x; baby.y = home.y; } }
  }
  function nestlePos(m) {
    const dir = m.a.d || 1;
    let x = m.x + dir * m.s * .44, y = m.y + m.s * .07;
    x = clamp(x, BS * .6, W - BS * .6);
    return { x, y };
  }
  function nestle(m, b, now) { const p = nestlePos(m); b.tx = p.x; b.ty = p.y; if (now) { b.x = p.x; b.y = p.y; } }

  /* ---------- الخلفية (مشهد مجسّم) ---------- */
  function cloud(x, cx, cy, s) {
    const blobs = [[-1, .15, .55], [-.45, -.2, .75], [.2, -.3, .8], [.8, .05, .6], [.25, .2, .7], [-.4, .25, .6]];
    x.save(); x.shadowColor = 'rgba(80,140,200,.25)'; x.shadowBlur = s * .3; x.shadowOffsetY = s * .12;
    x.fillStyle = '#fff'; x.beginPath(); for (const [a, b, r] of blobs) { x.moveTo(cx + a * s + r * s, cy + b * s); x.arc(cx + a * s, cy + b * s, r * s, 0, TAU); } x.fill(); x.restore();
    const g = x.createLinearGradient(0, cy - s, 0, cy + s); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.6, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(170,205,235,.55)');
    x.fillStyle = g; x.beginPath(); for (const [a, b, r] of blobs) { x.moveTo(cx + a * s + r * s, cy + b * s); x.arc(cx + a * s, cy + b * s, r * s, 0, TAU); } x.fill();
  }
  function ball(x, cx, cy, r, c1, c2, c3) {
    const g = x.createRadialGradient(cx - r * .4, cy - r * .45, r * .1, cx, cy, r * 1.05);
    g.addColorStop(0, c1); g.addColorStop(.55, c2); g.addColorStop(1, c3);
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill();
  }
  function tree(x, cx, gy, s, kind) {
    x.fillStyle = 'rgba(30,60,20,.18)'; x.beginPath(); x.ellipse(cx + s * .1, gy, s * .55, s * .14, 0, 0, TAU); x.fill();
    const tg = x.createLinearGradient(cx - s * .1, 0, cx + s * .1, 0); tg.addColorStop(0, '#B07A45'); tg.addColorStop(1, '#7A4E25');
    if (kind === 'acacia') {
      x.strokeStyle = '#8A5A2E'; x.lineWidth = s * .09; x.lineCap = 'round';
      x.beginPath(); x.moveTo(cx, gy); x.quadraticCurveTo(cx + s * .05, gy - s * .5, cx - s * .2, gy - s * .9); x.moveTo(cx + s * .02, gy - s * .45); x.quadraticCurveTo(cx + s * .2, gy - s * .7, cx + s * .3, gy - s * .9); x.stroke();
      const cg = x.createLinearGradient(0, gy - s * 1.15, 0, gy - s * .8); cg.addColorStop(0, '#9CCB4E'); cg.addColorStop(1, '#5E9A2A');
      x.fillStyle = cg; x.beginPath(); x.ellipse(cx + s * .05, gy - s * .95, s * .75, s * .18, 0, 0, TAU); x.fill();
      x.fillStyle = 'rgba(255,255,255,.25)'; x.beginPath(); x.ellipse(cx - s * .1, gy - s * 1.03, s * .45, s * .07, 0, 0, TAU); x.fill();
      return;
    }
    x.fillStyle = tg; x.beginPath(); x.roundRect(cx - s * .08, gy - s * .55, s * .16, s * .55, s * .05); x.fill();
    ball(x, cx - s * .22, gy - s * .7, s * .3, '#B6EE7A', '#5DBB3A', '#2F8A2A');
    ball(x, cx + s * .22, gy - s * .72, s * .3, '#B6EE7A', '#5DBB3A', '#2F8A2A');
    ball(x, cx, gy - s * .95, s * .38, '#C4F58A', '#62C23E', '#2F8A2A');
  }
  function barn(x, cx, gy, s) {
    x.fillStyle = 'rgba(30,60,20,.2)'; x.beginPath(); x.ellipse(cx, gy, s * .75, s * .12, 0, 0, TAU); x.fill();
    const w = s, h = s * .62;
    let g = x.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0); g.addColorStop(0, '#F0625A'); g.addColorStop(1, '#C7342E');
    x.fillStyle = g; x.beginPath(); x.roundRect(cx - w / 2, gy - h, w, h, s * .05); x.fill();
    x.fillStyle = '#8E2A22'; x.beginPath(); x.moveTo(cx - w * .58, gy - h + 2); x.lineTo(cx, gy - h - s * .42); x.lineTo(cx + w * .58, gy - h + 2); x.closePath(); x.fill();
    x.fillStyle = '#B03A30'; x.beginPath(); x.moveTo(cx - w * .5, gy - h + 2); x.lineTo(cx, gy - h - s * .34); x.lineTo(cx + w * .5, gy - h + 2); x.closePath(); x.fill();
    x.fillStyle = '#FFF6E8'; x.beginPath(); x.roundRect(cx - w * .2, gy - h * .62, w * .4, h * .62, [s * .2, s * .2, 0, 0]); x.fill();
    x.fillStyle = '#C7342E'; x.beginPath(); x.roundRect(cx - w * .16, gy - h * .55, w * .32, h * .55, [s * .16, s * .16, 0, 0]); x.fill();
    x.strokeStyle = '#FFF6E8'; x.lineWidth = s * .025; x.beginPath(); x.moveTo(cx - w * .16, gy - h * .5); x.lineTo(cx + w * .16, gy); x.moveTo(cx + w * .16, gy - h * .5); x.lineTo(cx - w * .16, gy); x.stroke();
    x.fillStyle = '#FFF6E8'; x.beginPath(); x.arc(cx, gy - h - s * .08, s * .07, 0, TAU); x.fill();
    x.fillStyle = 'rgba(255,255,255,.25)'; x.fillRect(cx - w / 2 + 3, gy - h + 3, w * .08, h - 6);
  }
  function fence(x, x0, x1, y, s) {
    x.fillStyle = 'rgba(40,60,20,.15)'; x.fillRect(x0, y + s * .05, x1 - x0, s * .08);
    for (const yy of [y - s * .55, y - s * .25]) {
      const g = x.createLinearGradient(0, yy, 0, yy + s * .12); g.addColorStop(0, '#FFF3DD'); g.addColorStop(1, '#D9B98A');
      x.fillStyle = g; x.beginPath(); x.roundRect(x0, yy, x1 - x0, s * .12, s * .06); x.fill();
    }
    for (let px = x0 + s * .2; px < x1; px += s * .9) {
      const g = x.createLinearGradient(px, 0, px + s * .16, 0); g.addColorStop(0, '#FFF6E6'); g.addColorStop(1, '#D2AE7C');
      x.fillStyle = g; x.beginPath(); x.roundRect(px, y - s * .78, s * .16, s * .82, [s * .08, s * .08, 2, 2]); x.fill();
    }
  }
  function flower(x, cx, cy, s, col) {
    x.fillStyle = '#3E9A33'; x.fillRect(cx - s * .06, cy, s * .12, s * .8);
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; ball(x, cx + Math.cos(a) * s * .32, cy + Math.sin(a) * s * .32, s * .26, '#fff', col, col); }
    ball(x, cx, cy, s * .2, '#FFF6B0', '#FFC93C', '#E89A10');
  }
  function bush(x, cx, gy, s, c) {
    x.fillStyle = 'rgba(20,50,10,.2)'; x.beginPath(); x.ellipse(cx, gy, s * .9, s * .2, 0, 0, TAU); x.fill();
    ball(x, cx - s * .45, gy - s * .3, s * .42, c[0], c[1], c[2]);
    ball(x, cx + s * .45, gy - s * .28, s * .4, c[0], c[1], c[2]);
    ball(x, cx, gy - s * .5, s * .52, c[0], c[1], c[2]);
  }
  function buildBg() {
    const key = def.sc + '|' + W + 'x' + H + '|' + dpr;
    if (bgKey === key && bgLayer) return;
    bgKey = key;
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const S = scene, R = rng(def.sc.length * 7 + 3), hz = horizon;
    // السماء
    let g = x.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, S.sky[0]); g.addColorStop(1, S.sky[1]);
    x.fillStyle = g; x.fillRect(0, 0, W, hz + 2);
    // الشمس
    const sx = W * .82, sy = hz * .42, sr = Math.min(W, H) * .07;
    g = x.createRadialGradient(sx, sy, sr * .2, sx, sy, sr * 3); g.addColorStop(0, 'rgba(255,240,170,.9)'); g.addColorStop(1, 'rgba(255,240,170,0)');
    x.fillStyle = g; x.fillRect(sx - sr * 3, sy - sr * 3, sr * 6, sr * 6);
    ball(x, sx, sy, sr, '#FFFBE0', '#FFD84A', '#FFB020');
    // غيوم منفوخة
    const cs = Math.min(W, H) * .045;
    cloud(x, W * .18, hz * .38, cs * 1.1); cloud(x, W * .55, hz * .22, cs * .8);
    if (!portrait) cloud(x, W * .38, hz * .55, cs * .7);
    // التلال / الجبال البعيدة
    if (def.sc === 'wild') {
      x.fillStyle = '#E9C7A2';
      x.beginPath(); x.moveTo(0, hz); for (let i = 0; i <= 8; i++) x.lineTo(W * i / 8, hz - (i % 2 ? hz * .32 : hz * .14) * (.7 + R() * .5)); x.lineTo(W, hz); x.fill();
      x.fillStyle = 'rgba(255,255,255,.35)';
      x.beginPath(); x.moveTo(0, hz); for (let i = 0; i <= 8; i++) x.lineTo(W * i / 8 + W / 16, hz - (i % 2 ? hz * .2 : hz * .08)); x.lineTo(W, hz); x.fill();
    }
    for (let k = 0; k < 2; k++) {
      const yb = hz + 2, amp = hz * (k ? .1 : .18);
      g = x.createLinearGradient(0, yb - amp, 0, yb); g.addColorStop(0, S.far[k]); g.addColorStop(1, S.far[1 - k]);
      x.fillStyle = g; x.beginPath(); x.moveTo(0, yb);
      const ph = R() * 6, fr = k ? 2.4 : 1.6;
      for (let i = 0; i <= 40; i++) { const xx = W * i / 40; x.lineTo(xx, yb - amp * (.55 + .45 * Math.sin(i / 40 * TAU * fr / 2 + ph))); }
      x.lineTo(W, yb); x.fill();
    }
    // الأرض بمنظور (خطوط تتلاقى في نقطة التلاشي)
    g = x.createLinearGradient(0, hz, 0, H); g.addColorStop(0, S.gr[0]); g.addColorStop(1, S.gr[1]);
    x.fillStyle = g; x.fillRect(0, hz, W, H - hz);
    x.save(); x.beginPath(); x.rect(0, hz, W, H - hz); x.clip();
    const vx = W / 2, vy = hz - H * .6;
    for (let i = -14; i <= 14; i++) {
      if (i % 2) continue;
      const bx = W / 2 + i * W * .09, bx2 = W / 2 + (i + 1) * W * .09;
      const t1 = (hz - vy) / (H - vy);
      x.fillStyle = 'rgba(255,255,255,.07)';
      x.beginPath(); x.moveTo(lerp(vx, bx, t1), hz); x.lineTo(lerp(vx, bx2, t1), hz); x.lineTo(bx2, H); x.lineTo(bx, H); x.closePath(); x.fill();
    }
    // ضوء ناعم في الوسط
    g = x.createRadialGradient(W / 2, lerp(hz, H, .45), 10, W / 2, lerp(hz, H, .45), Math.max(W, H) * .6);
    g.addColorStop(0, 'rgba(255,255,230,.25)'); g.addColorStop(1, 'rgba(255,255,230,0)'); x.fillStyle = g; x.fillRect(0, hz, W, H - hz);
    // تظليل قرب الأفق
    g = x.createLinearGradient(0, hz, 0, hz + 30); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, hz, W, 30);
    x.restore();
    const u = Math.min(W, H) / 10;
    if (def.sc === 'farm') {
      barn(x, portrait ? W * .16 : W * .1, hz + 4, u * 1.4);
      tree(x, portrait ? W * .9 : W * .92, hz + 6, u * 1.3);
      tree(x, portrait ? W * .74 : W * .8, hz + 2, u * .9);
      fence(x, portrait ? W * .32 : W * .2, portrait ? W * .64 : W * .72, hz + u * .35, u * .5);
      // بالات قش
      for (const [bx, s] of [[portrait ? W * .62 : W * .66, u * .35]]) {
        const gg = x.createLinearGradient(0, hz + u * .1, 0, hz + u * .5); gg.addColorStop(0, '#FFE58A'); gg.addColorStop(1, '#D9A830');
        x.fillStyle = gg; x.beginPath(); x.roundRect(bx, hz + u * .5 - s, s * 1.6, s, s * .2); x.fill();
        x.strokeStyle = 'rgba(150,100,20,.4)'; x.lineWidth = 2; x.beginPath(); x.moveTo(bx + s * .5, hz + u * .5 - s); x.lineTo(bx + s * .5, hz + u * .5); x.moveTo(bx + s * 1.1, hz + u * .5 - s); x.lineTo(bx + s * 1.1, hz + u * .5); x.stroke();
      }
    } else if (def.sc === 'pond') {
      // بركة
      const px = W * .5, py = lerp(hz, home.y, .17), pw = Math.min(W * .48, 380), ph = Math.max(18, (home.y - hz) * .09);
      x.fillStyle = '#7BC36A'; x.beginPath(); x.ellipse(px, py + 3, pw + 8, ph + 6, 0, 0, TAU); x.fill();
      g = x.createLinearGradient(0, py - ph, 0, py + ph); g.addColorStop(0, '#9DE6FF'); g.addColorStop(1, '#2FA7D6');
      x.fillStyle = g; x.beginPath(); x.ellipse(px, py, pw, ph, 0, 0, TAU); x.fill();
      x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 2;
      for (let i = 0; i < 4; i++) { x.beginPath(); x.ellipse(px - pw * .3 + i * pw * .2, py - ph * .2 + (i % 2) * ph * .3, pw * .08, ph * .12, 0, 0, Math.PI); x.stroke(); }
      for (const [lx, ly] of [[-.55, .15], [.5, -.1], [.15, .35]]) {
        x.fillStyle = '#4FB343'; x.beginPath(); x.ellipse(px + lx * pw, py + ly * ph, ph * .55, ph * .28, 0, .35, TAU - .35); x.lineTo(px + lx * pw, py + ly * ph); x.fill();
      }
      flower(x, px + pw * .5, py - ph * .2, ph * .22, '#FF8FC7');
      // قصب
      for (const rx of [px - pw * .95, px - pw * .85, px + pw * .9]) {
        x.strokeStyle = '#3E8E2F'; x.lineWidth = 3; x.beginPath(); x.moveTo(rx, py + ph * .2); x.quadraticCurveTo(rx + 4, py - ph * 1.5, rx - 2, py - ph * 3); x.stroke();
        x.fillStyle = '#8A5A2E'; x.beginPath(); x.roundRect(rx - 4, py - ph * 3.1, 8, ph * 1.1, 4); x.fill();
      }
      tree(x, W * .1, hz + 4, u * 1.1); tree(x, W * .92, hz + 6, u * 1.25);
    } else {
      tree(x, portrait ? W * .14 : W * .12, hz + 6, u * 1.4, 'acacia');
      tree(x, portrait ? W * .86 : W * .85, hz + 3, u * 1.1, 'acacia');
      // صخور
      for (const [rx, s] of [[W * .36, u * .3], [W * .62, u * .22]]) {
        const ry = hz + u * .25;
        x.fillStyle = 'rgba(90,50,10,.18)'; x.beginPath(); x.ellipse(rx, ry, s * 1.1, s * .25, 0, 0, TAU); x.fill();
        const gg = x.createRadialGradient(rx - s * .3, ry - s * .5, 2, rx, ry - s * .2, s * 1.1); gg.addColorStop(0, '#E8D8C8'); gg.addColorStop(1, '#A08670');
        x.fillStyle = gg; x.beginPath(); x.ellipse(rx, ry - s * .3, s, s * .62, 0, Math.PI, 0); x.lineTo(rx + s, ry); x.lineTo(rx - s, ry); x.fill();
      }
    }
    // شجيرات وزهور أمامية
    const bc = def.sc === 'wild' ? ['#D7E58A', '#9BB93E', '#5F7F1F'] : ['#B6EE7A', '#4FB33A', '#24781F'];
    bush(x, -u * .2, H + u * .1, u * 1.1, bc); bush(x, W + u * .2, H + u * .15, u * 1.2, bc);
    const fc = ['#FF7BAC', '#FFB03A', '#B78CFF', '#FF6B6B'];
    for (let i = 0; i < 7; i++) {
      const fx = R() * W, fy = lerp(hz + 20, H - 10, .35 + R() * .65);
      if (Math.abs(fx - home.x) < u * 1.4 && fy > home.y - u) continue;
      flower(x, fx, fy, u * (.1 + R() * .06), fc[i % 4]);
    }
    for (let i = 0; i < 40; i++) { // خصلات عشب
      const fx = R() * W, fy = lerp(hz + 10, H, R()), s = 3 + (fy - hz) / (H - hz) * 6;
      x.strokeStyle = def.sc === 'wild' ? 'rgba(150,100,30,.35)' : 'rgba(30,110,30,.35)'; x.lineWidth = 1.6;
      x.beginPath(); x.moveTo(fx - s * .5, fy - s); x.lineTo(fx, fy); x.lineTo(fx + s * .4, fy - s * 1.1); x.stroke();
    }
  }

  /* ---------- المستوى ---------- */
  function setProg() {
    progEl.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    progEl.innerHTML = Array.from({ length: total }, (_, i) => `<i class="${i < done ? 'on' : ''}"></i>`).join('');
  }
  function bumpProg() { const i = progEl.children[done - 1]; if (i) i.classList.add('on'); }
  function mkMom(id) { return { a: AN[id], x: W / 2, y: H / 2, s: M, ph: Math.random() * TAU, pop: 0, jump: 0, shake: 0, glow: 0, att: null, look: 0, intro: 0 }; }
  function startLevel(n) {
    lvl = clamp(n, 1, LEVELS.length); def = LEVELS[lvl - 1]; scene = SCENES[def.sc];
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    tasks = []; parts = []; drag = null; baby = null; over = false; mistakes = 0; done = 0; idleT = 0; sayTok++; Snd.stop();
    bgKey = '';
    if (def.m === 'match') {
      moms = shuffle(def.a.slice()).map(mkMom);
      queue = shuffle(def.a.slice()); total = queue.length;
      quiz = null;
      layout();
      moms.forEach((m, i) => { m.intro = -i * .12; });
      later(.7, nextBaby);
      showHint('👆 ' + App.g('اسحبي', 'اسحب') + ' الصغير إلى أمّه');
    } else {
      total = def.q; moms = [];
      const pool = shuffle(def.a.filter(id => hasSnd(AN[id])));
      quiz = { q: 0, pool, used: [], target: null };
      layout();
      later(.4, () => { sayWho(); later(1.9, nextQuestion); });
      showHint('🔊 ' + App.g('اسمعي', 'اسمع') + ' الصوت ثم ' + App.g('المسي', 'المس') + ' صاحبه');
    }
    sayBtn.style.display = def.m === 'sound' ? 'none' : '';
    // تحميل الأصوات مسبقًا
    def.a.forEach(id => { const a = AN[id]; [sndOf(a), sndOf(a, true)].forEach(sp => { if (sp) Snd.load(sp[0]); }); });
    setProg();
    Sound.whoosh();
  }
  function showHint(t) { hintT.textContent = t; hintEl.style.opacity = 1; }
  function hideHint() { hintEl.style.opacity = 0; }

  /* ----- وضع «أين أمي؟» ----- */
  function nextBaby() {
    if (!queue.length) { win(); return; }
    const id = queue.shift(), a = AN[id];
    baby = { a, x: home.x, y: H + BS, hx: home.x, hy: home.y, state: 'enter', t: 0, sc: 1, rot: 0, tear: 0, errs: 0, tx: 0, ty: 0, pop: 0, flip: false };
    Sound.tone(520, .12, 'sine', .08, 300);
    later(.65, () => cryNow());
  }
  function cryNow() {
    if (!baby || baby.state === 'hug' || baby.state === 'fly') return;
    animalSound(baby.a, true, () => sayWhere(), .9);
  }
  function hitMom(x, y, pad = .62) {
    let best = null, bd = 1e9;
    for (const m of moms) {
      const cx = m.x, cy = m.y - m.s * .45, d = Math.hypot(x - cx, y - cy);
      if (d < m.s * pad && d < bd) { bd = d; best = m; }
    }
    return best;
  }
  function dropBaby() {
    const b = baby, cy = b.y - BS * .45;
    const m = hitMom(b.x, cy, .75);
    if (!m) { b.state = 'back'; b.t = 0; b.fx = b.x; b.fy = b.y; Sound.slide(); return; }
    if (m.a === b.a && !m.att) {
      b.state = 'fly'; b.t = 0; b.fx = b.x; b.fy = b.y; b.mom = m; nestle(m, b);
      const want = -(m.a.d || 1); b.flip = b.a.bd !== 0 && b.a.bd !== want;
      hideHint();
    } else {
      mistakes++; b.errs++; m.shake = 1; shake = Math.max(shake, 3);
      Sound.error(); vibrate(30);
      b.state = 'back'; b.t = 0; b.fx = b.x; b.fy = b.y; b.wob = 1;
      later(.35, () => sayTry());
      if (b.errs >= 2) { const r = moms.find(q => q.a === b.a); if (r) r.glow = 6; }
    }
  }
  function hug(m, b) {
    b.state = 'hug'; m.att = b; m.jump = 1; m.pop = 1; b.pop = 1;
    Sound.thud(); Sound.star(); vibrate(25);
    for (let i = 0; i < 14; i++) {
      const a = -Math.PI / 2 + rand(-1.1, 1.1), v = rand(70, 190);
      parts.push({ t: 'heart', x: (m.x + b.x) / 2, y: m.y - m.s * .55, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(1, 1.6), age: 0, s: rand(7, 14), rot: rand(-.4, .4), c: ['#FF5C8A', '#FF8FB1', '#FF3D6E'][i % 3] });
    }
    sparkle(b.x, b.y - BS * .5, '#FFD84A');
    done++; bumpProg();
    const go = () => sayPair(m.a);
    if (hasSnd(m.a)) animalSound(m.a, false, go); else { Sound.tone(880, .3, 'sine', .08, 200); later(.3, go); }
    later(hasSnd(m.a) ? 4.4 : 3, nextBaby);
    m.label = 2.5;
  }

  /* ----- وضع «صوت مَن هذا؟» ----- */
  function nextQuestion() {
    if (!quiz) return;
    if (quiz.q >= def.q) { win(); return; }
    let pool = quiz.pool.filter(id => id !== quiz.last);
    const fresh = pool.filter(id => !quiz.used.includes(id));
    const target = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length ? fresh : pool).length)];
    quiz.used.push(target); quiz.last = target; quiz.target = target; quiz.tries = 0; quiz.answered = false;
    const others = shuffle(def.a.filter(id => id !== target)).slice(0, def.ch - 1);
    moms = shuffle([target, ...others]).map(mkMom);
    moms.forEach((m, i) => { m.intro = -i * .1; });
    placeMoms();
    later(.6, playTarget);
  }
  function playTarget() {
    if (!quiz || !quiz.target) return;
    spkPop = 1;
    animalSound(AN[quiz.target], false, null);
  }
  function answer(m) {
    if (!quiz || quiz.answered) return;
    if (m.a.id === quiz.target) {
      quiz.answered = true; quiz.q++; done++; bumpProg();
      m.jump = 1; m.pop = 1; m.label = 3; hideHint();
      // الصغير يأتي ليعانق أمه مكافأةً
      const b = { a: m.a, x: m.x + (m.a.d || 1) * m.s * .44, y: m.y + m.s * .07, state: 'hug', t: 0, sc: 1, rot: 0, pop: 1, flip: false, appear: 0 };
      const want = -(m.a.d || 1); b.flip = b.a.bd !== 0 && b.a.bd !== want; nestle(m, b, true); m.att = b;
      Sound.star(); vibrate(25);
      for (let i = 0; i < 12; i++) { const a = -Math.PI / 2 + rand(-1.1, 1.1), v = rand(70, 180); parts.push({ t: 'heart', x: m.x, y: m.y - m.s * .6, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(1, 1.5), age: 0, s: rand(7, 13), rot: 0, c: ['#FF5C8A', '#FF8FB1', '#FFC93C'][i % 3] }); }
      sayMom(m.a);
      later(1.4, () => animalSound(m.a, false, null));
      later(3.9, nextQuestion);
    } else {
      mistakes++; quiz.tries++; m.shake = 1; shake = Math.max(shake, 3);
      Sound.error(); vibrate(30);
      later(.3, () => sayTry());
      if (quiz.tries >= 2) { const r = moms.find(q => q.a.id === quiz.target); if (r) r.glow = 5; }
      later(1.4, () => { if (quiz && !quiz.answered) playTarget(); });
    }
  }

  /* ---------- الفوز والمستويات ---------- */
  function win() {
    over = true; baby = baby && baby.state === 'hug' ? null : baby;
    const pr = loadProg();
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('mothersProg', pr);
    for (let i = 0; i < 130; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 240), rot: rand(0, TAU), vr: rand(-8, 8), life: rand(2.5, 4), age: 0, s: rand(6, 11), c: ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9'][i % 6] });
    Sound.win();
    later(1.3, () => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنتَ!') + ' 🎉';
      root.querySelector('.wpair').textContent = def.a.slice(0, 3).map(id => AN[id].e).join(' ');
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wP').textContent = (def.m === 'match' ? 'أعدتَ كل الصغار إلى أمهاتهم' : 'عرفتَ كل الأصوات').replace('أعدتَ', App.g('أعدتِ', 'أعدتَ')).replace('عرفتَ', App.g('عرفتِ', 'عرفتَ')) + (mistakes ? '' : ' دون أخطاء! 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < LEVELS.length ? '' : 'none';
      winOv.classList.add('on');
      sayGood();
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('mothers_first');
      if (def.m === 'sound' && !mistakes) App.achieve('mothers_ears');
      if (LEVELS.every((_, i) => pr.stars[i + 1])) App.achieve('mothers_all');
    });
  }
  function openLevels() {
    const pr = loadProg(), g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lvb s-${L.sc}${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}"><span class="n">${num(n)}</span>
        <span class="md">${L.m === 'sound' ? '🔊' : ''}</span><span class="e">${AN[L.a[0]].e}</span>
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
    if (paused) return;
    if (def.m === 'sound') { if (quiz && quiz.target && !quiz.answered) playTarget(); return; }
    else if (baby && (baby.state === 'idle' || baby.state === 'back')) { baby.pop = 1; cryNow(); }
  });
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'ar'; store.set('mothersLang', lang);
    root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
    setProg();
  }
  root.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === lang) return;
    Sound.tap(); setLang(b.dataset.l);
    if (def.m === 'sound') sayWho(); else if (baby && baby.state === 'idle') sayWhere();
  }));

  /* ---------- الجسيمات ---------- */
  let rings = [];
  function sparkle(x, y, col) {
    for (let i = 0; i < 16; i++) {
      const a = rand(0, TAU), v = rand(80, 240);
      parts.push({ t: 'star', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .9), age: 0, s: rand(5, 9), c: i % 2 ? '#FFE26B' : col });
    }
    rings.push({ x, y, age: 0, life: .45 });
  }

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  const blocked = () => App.current !== ID || paused || winOv.classList.contains('on') || lvOv.classList.contains('on');
  cv.addEventListener('pointerdown', e => {
    if (blocked() || drag) return;
    const p = pos(e); idleT = 0;
    if (def.m === 'match' && baby && (baby.state === 'idle' || baby.state === 'back') && Math.hypot(p.x - baby.x, p.y - (baby.y - BS * .45)) < BS * .75) {
      try { cv.setPointerCapture(e.pointerId); } catch (er) {}
      drag = { id: e.pointerId, ox: baby.x - p.x, oy: baby.y - p.y, sx: p.x, sy: p.y, moved: false, t0: performance.now(), touch: e.pointerType !== 'mouse', lx: p.x, vx: 0 };
      baby.state = 'drag'; baby.tx = baby.x; baby.ty = baby.y;
      Sound.tone(600, .08, 'sine', .1, 300); vibrate(10);
      return;
    }
    const m = hitMom(p.x, p.y, .6);
    if (!m && def.m === 'sound' && quiz && !quiz.answered && Math.hypot(p.x - home.x, p.y - (home.y - BS * .55)) < BS) { playTarget(); return; }
    if (!m) return;
    if (def.m === 'sound') { answer(m); return; }
    // لمس أم: صوتها واسمها
    m.pop = 1; Sound.pop();
    if (m.att) { const my = ++sayTok; animalSound(m.a, false, () => { if (my === sayTok) sayPair(m.a); }); }
    else animalSound(m.a, false, () => sayMom(m.a));
    m.label = 2;
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const p = pos(e);
    if (!drag.moved && Math.hypot(p.x - drag.sx, p.y - drag.sy) > 8) { drag.moved = true; }
    baby.tx = p.x + drag.ox; baby.ty = p.y + drag.oy - (drag.touch && drag.moved ? BS * .25 : 0);
    drag.vx = drag.vx * .6 + (p.x - drag.lx) * .4; drag.lx = p.x;
  });
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (!d.moved && performance.now() - d.t0 < 350) { baby.state = 'back'; baby.t = 0; baby.fx = baby.x; baby.fy = baby.y; baby.pop = 1; cryNow(); return; }
    dropBaby();
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < LEVELS.length ? 'next' : 'levels'); return; }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? lvOv.classList.remove('on') : openLevels(); return; }
    if (blocked()) return;
    const k = parseInt(e.key, 10);
    if (k >= 1 && k <= moms.length) {   // اختيار بالأرقام: 1..n
      const m = moms[k - 1];
      if (def.m === 'sound') answer(m);
      else if (baby && (baby.state === 'idle' || baby.state === 'back')) { baby.x = m.x; baby.y = m.y - m.s * .1; dropBaby(); }
    } else if (e.key === 'r' || e.key === 'R') sayBtn.click();
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    for (let i = tasks.length - 1; i >= 0; i--) { const t = tasks[i]; t.t -= dt; if (t.t <= 0) { tasks.splice(i, 1); t.fn(); } }
    const k = 1 - Math.exp(-dt * 24);
    for (const m of moms) {
      m.intro = Math.min(1, m.intro + dt / .45);
      m.pop = Math.max(0, m.pop - dt * 2.4); m.jump = Math.max(0, m.jump - dt * 1.2); m.shake = Math.max(0, m.shake - dt * 2.2);
      m.glow = Math.max(0, m.glow - dt); m.label = Math.max(0, (m.label || 0) - dt);
    }
    const b = baby;
    if (b) {
      b.pop = Math.max(0, b.pop - dt * 2.4);
      if (b.state === 'enter') {
        b.t += dt / .6; const t = Math.min(1, b.t), e = ease.outBack(t);
        b.y = lerp(H + BS, b.hy, e); b.x = b.hx + Math.sin(t * 8) * 6 * (1 - t);
        if (t >= 1) { b.state = 'idle'; b.y = b.hy; b.x = b.hx; }
      } else if (b.state === 'idle') {
        b.x = b.hx + Math.sin(T * 26) * 1.2; b.y = b.hy;
        b.tear -= dt; if (b.tear <= 0) { b.tear = .38; for (const sd of [-1, 1]) parts.push({ t: 'tear', x: b.x + sd * BS * .2, y: b.y - BS * .55, vx: sd * rand(20, 45), vy: -rand(30, 60), life: .8, age: 0, s: BS * .07 }); }
        idleT += dt;
        if (idleT > 9 && !b.helped) { b.helped = true; const r = moms.find(q => q.a === b.a); if (r) r.glow = 5; }
      } else if (b.state === 'drag') {
        b.x += (b.tx - b.x) * k; b.y += (b.ty - b.y) * k;
        b.rot += (clamp((drag ? drag.vx : 0) * .02, -.3, .3) - b.rot) * k * .5;
        b.sc += (1.12 - b.sc) * k * .5;
        for (const m of moms) m.hover = hitMom(b.x, b.y - BS * .45, .75) === m;
      } else if (b.state === 'back') {
        b.t += dt / (b.wob ? .55 : .35); const t = Math.min(1, b.t), e = b.wob ? ease.outCubic(t) : ease.outBack(t);
        b.x = lerp(b.fx, b.hx, e); b.y = lerp(b.fy, b.hy, e);
        b.rot = b.wob ? Math.sin(t * 30) * .25 * (1 - t) : b.rot * (1 - k); b.sc += (1 - b.sc) * k;
        if (t >= 1) { b.state = 'idle'; b.wob = 0; b.rot = 0; }
      } else if (b.state === 'fly') {
        b.t += dt / .32; const t = Math.min(1, b.t), e = ease.outCubic(t);
        b.x = lerp(b.fx, b.tx, e); b.y = lerp(b.fy, b.ty, e) - Math.sin(t * Math.PI) * 40;
        b.rot *= 1 - k; b.sc = lerp(1.12, 1, e);
        if (t >= 1) { b.x = b.tx; b.y = b.ty; hug(b.mom, b); }
      }
      if (b.state !== 'drag') moms.forEach(m => { m.hover = false; });
    }
    for (const m of moms) if (m.att && m.att !== baby) { m.att.pop = Math.max(0, m.att.pop - dt * 2.4); }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.t === 'conf') { q.vy = Math.min(q.vy + 120 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; q.rot += q.vr * dt; }
      else if (q.t === 'heart') { q.vx *= 1 - dt * 1.5; q.vy = q.vy * (1 - dt * 1.5) - 30 * dt; }
      else if (q.t === 'tear') { q.vy += 380 * dt; }
      else { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 300 * dt; q.rot += q.vr * dt; }
      q.x += q.vx * dt; q.y += q.vy * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    shake = Math.max(0, shake - dt * 16); spkPop = Math.max(0, spkPop - dt * 2.5);
  }

  /* ---------- الرسم ---------- */
  function heartPath(c, s) { c.beginPath(); c.moveTo(0, s * .35); c.bezierCurveTo(-s * 1.1, -s * .35, -s * .45, -s * 1.05, 0, -s * .45); c.bezierCurveTo(s * .45, -s * 1.05, s * 1.1, -s * .35, 0, s * .35); c.closePath(); }
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  function pedestal(m) {
    const rx = m.s * .58, ry = m.s * .17, th = m.s * .07, x = m.x, y = m.y;
    const top = def.sc === 'wild' ? ['#FFE7B0', '#E9B860', '#B9822F'] : def.sc === 'pond' ? ['#D9F7C2', '#8FD46A', '#4E9A35'] : ['#DDFBB8', '#8DD65C', '#4C9A2E'];
    ctx.fillStyle = 'rgba(30,50,10,.22)'; ctx.beginPath(); ctx.ellipse(x + rx * .06, y + th + ry * .35, rx * 1.04, ry * 1.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = top[2]; ctx.beginPath(); ctx.ellipse(x, y + th, rx, ry, 0, 0, TAU); ctx.fill(); ctx.fillRect(x - rx, y, rx * 2, th);
    const g = ctx.createRadialGradient(x - rx * .3, y - ry * .5, 2, x, y, rx);
    g.addColorStop(0, top[0]); g.addColorStop(1, top[1]);
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y, rx - 3, ry - 2, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    if (m.glow > 0 || m.hover) {
      const a = m.hover ? .9 : (.45 + .45 * Math.sin(T * 8)) * Math.min(1, m.glow);
      ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = m.hover ? '#FFFFFF' : '#FFE04A'; ctx.lineWidth = 5; ctx.shadowColor = '#FFD000'; ctx.shadowBlur = 14;
      ctx.beginPath(); ctx.ellipse(x, y, rx + 4, ry + 3, 0, 0, TAU); ctx.stroke(); ctx.restore();
    }
  }
  function drawAnimal(e, x, y, s, opt = {}) {
    const img = bake(e, s), sz = img.width / dpr;
    ctx.save(); ctx.translate(x, y);
    if (opt.rot) ctx.rotate(opt.rot);
    const sq = opt.sq || 0;
    ctx.scale((opt.flip ? -1 : 1) * (opt.sc || 1) * (1 + sq), (opt.sc || 1) * (1 - sq));
    ctx.drawImage(img, -sz / 2, -sz * .87, sz, sz);   // نقطة الارتكاز: أسفل الرمز
    ctx.restore();
  }
  function label(text, x, y, col, size, en) {
    ctx.save();
    ctx.font = `900 ${size}px ${en ? 'system-ui,"Segoe UI",sans-serif' : FONT}`;
    ctx.direction = en ? 'ltr' : 'rtl';
    const w = ctx.measureText(text).width + size * 1.3, h = size * 1.55;
    ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2 + 3, w, h, h / 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + size * .05);
    ctx.restore();
  }
  function drawMom(m) {
    const it = ease.outBack(clamp(m.intro, 0, 1));
    if (it <= 0) return;
    ctx.save(); ctx.translate(m.x, m.y); ctx.scale(it, it); ctx.translate(-m.x, -m.y);
    pedestal(m);
    const breath = Math.sin(T * 2.2 + m.ph) * .018;
    const jy = m.jump > 0 ? -Math.abs(Math.sin((1 - m.jump) * Math.PI * 3)) * m.s * .14 * m.jump : 0;
    const sq = Math.sin((1 - m.pop) * Math.PI * 3) * m.pop * .1 + breath;
    const sx = m.shake > 0 ? Math.sin(m.shake * 40) * 7 * m.shake : 0;
    ctx.fillStyle = 'rgba(20,40,10,.22)'; ctx.beginPath(); ctx.ellipse(m.x, m.y, m.s * .36 * (1 + jy / m.s), m.s * .08, 0, 0, TAU); ctx.fill();
    drawAnimal(m.a.e, m.x + sx, m.y + jy, m.s, { sq, rot: m.shake > 0 ? Math.sin(m.shake * 30) * .08 : 0 });
    ctx.restore();
  }
  function drawBaby(b, front) {
    const sq = Math.sin((1 - b.pop) * Math.PI * 3) * b.pop * .14;
    const lift = b.state === 'drag' ? 1 : b.state === 'fly' ? .6 : 0;
    ctx.fillStyle = `rgba(20,40,10,${.25 - lift * .1})`; ctx.beginPath(); ctx.ellipse(b.x + lift * 10, b.y + lift * 16, BS * .38, BS * .1, 0, 0, TAU); ctx.fill();
    let sc = b.sc || 1;
    if (b.state === 'hug') { const hb = Math.sin(T * 3 + 1) * .02; sc *= 1 + hb; }
    drawAnimal(b.a.be, b.x, b.y, BS, { sq, rot: b.rot, sc, flip: b.flip });
    if (front && (b.state === 'idle' || b.state === 'back')) bubble(b);
  }
  function bubble(b) {
    const txt = lang === 'ar' ? 'أين أمي؟' : 'Where is my mom?';
    const size = clamp(BS * .26, 15, 22);
    ctx.save();
    ctx.font = `900 ${size}px ${lang === 'en' ? 'system-ui,"Segoe UI",sans-serif' : FONT}`; ctx.direction = lang === 'en' ? 'ltr' : 'rtl';
    const w = ctx.measureText(txt).width + size * 2.6, h = size * 1.8;
    const bob = Math.sin(T * 3) * 2;
    let x = b.x + BS * .55, y = b.y - BS * 1.25 + bob;
    x = clamp(x, w / 2 + 8, W - w / 2 - 8);
    ctx.shadowColor = 'rgba(0,0,0,.15)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.beginPath(); ctx.moveTo(b.x + BS * .1, y + h / 2 - 2); ctx.lineTo(b.x + BS * .05, y + h / 2 + 12); ctx.lineTo(b.x + BS * .3, y + h / 2 - 2); ctx.fill();
    ctx.strokeStyle = '#7EC8F0'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.stroke();
    ctx.fillStyle = '#2B6C9A'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(txt, x + (lang === 'ar' ? size * .55 : -size * .55), y + 1);
    ctx.font = `${size}px ${EMOJI_FONT}`; ctx.fillText('😢', x + (lang === 'ar' ? -1 : 1) * (w / 2 - size * .95), y + 1);
    ctx.restore();
  }
  function drawSpeaker() {
    // في وضع الأصوات: سمّاعة كبيرة لطيفة في مكان الصغير
    const x = home.x, y = home.y - BS * .55, r = clamp(BS * .62, 34, 70);
    const pul = 1 + Math.sin(T * 4) * .04 + Math.sin((1 - spkPop) * Math.PI * 3) * spkPop * .15;
    ctx.save(); ctx.translate(x, y); ctx.scale(pul, pul);
    for (let i = 0; i < 3; i++) {
      const t = ((T * .8 + i / 3) % 1);
      ctx.strokeStyle = `rgba(255,190,40,${.6 * (1 - t)})`; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, r * (1 + t * .9), 0, TAU); ctx.stroke();
    }
    ctx.shadowColor = 'rgba(180,110,0,.35)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#E39A00'; ctx.beginPath(); ctx.arc(0, 5, r, 0, TAU); ctx.fill();
    ctx.shadowColor = 'transparent';
    ball(ctx, 0, 0, r, '#FFF2A8', '#FFC93C', '#F2A90F');
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, r - 2, 0, TAU); ctx.stroke();
    ctx.font = `${r * 1.05}px ${EMOJI_FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('🔊', 0, r * .05);
    ctx.restore();
  }
  function drawHand() {
    if (!baby || baby.state !== 'idle') return;
    const r = moms.find(q => q.a === baby.a); if (!r || !(r.glow > 0)) return;
    const t = (T * .55) % 1, e = ease.inOut(clamp(t * 1.4, 0, 1));
    const x = lerp(baby.x, r.x, e), y = lerp(baby.y - BS * .3, r.y - r.s * .4, e);
    ctx.save(); ctx.globalAlpha = t > .85 ? (1 - t) / .15 : 1;
    ctx.font = `${BS * .6}px ${EMOJI_FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'top'; ctx.fillText('👆', x + 6, y); ctx.restore();
  }
  function render() {
    ctx.save();
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    // الأمهات (مرتّبة حسب العمق) مع صغارها
    const ents = [];
    moms.forEach(m => { ents.push({ y: m.y, f: () => drawMom(m) }); if (m.att && (m.att !== baby || baby.state === 'hug')) ents.push({ y: m.att.y + .1, f: () => drawBaby(m.att) }); });
    ents.sort((a, b) => a.y - b.y).forEach(e => e.f());
    // الأسماء
    for (const m of moms) {
      if (m.intro < .9) continue;
      const showName = def.m === 'match' || m.label > 0 || (quiz && quiz.answered && m.a.id === quiz.target);
      if (!showName) continue;
      const fs = clamp(m.s * .13, 13, 19);
      const txt = m.att && def.m === 'match' ? (lang === 'ar' ? `${m.a.ar} و${m.a.bar}` : `${cap(m.a.en)} & ${m.a.ben}`) : (lang === 'ar' ? m.a.ar : cap(m.a.en));
      label(txt, m.x, m.y + m.s * .2 + fs * .9, scene.lab, fs, lang === 'en');
    }
    if (def.m === 'match') {
      // مكان الصغير التائه
      if (baby && baby.state !== 'hug') {
        ctx.save(); ctx.setLineDash([7, 6]); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,.7)';
        ctx.beginPath(); ctx.ellipse(home.x, home.y, BS * .62, BS * .18, 0, 0, TAU); ctx.stroke(); ctx.restore();
      }
      if (baby && baby.state !== 'hug') drawBaby(baby, true);
      drawHand();
    } else if (quiz && !over) drawSpeaker();
    // الجسيمات
    for (const r of rings) {
      if (r.dom) continue;
      const t = r.age / r.life; ctx.strokeStyle = `rgba(255,255,255,${(1 - t) * .9})`; ctx.lineWidth = 4 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, 10 + t * 60, 0, TAU); ctx.stroke();
    }
    for (const q of parts) {
      const t = q.age / q.life;
      ctx.save(); ctx.translate(q.x, q.y);
      if (q.t === 'heart') { ctx.globalAlpha = 1 - t * t; ctx.rotate(q.rot + Math.sin(q.age * 6) * .2); ctx.scale(1 + t * .3, 1 + t * .3); ctx.fillStyle = q.c; heartPath(ctx, q.s); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.beginPath(); ctx.arc(-q.s * .4, -q.s * .45, q.s * .18, 0, TAU); ctx.fill(); }
      else if (q.t === 'tear') { ctx.globalAlpha = 1 - t; ctx.fillStyle = '#6EC6FF'; ctx.beginPath(); ctx.moveTo(0, -q.s * 1.6); ctx.quadraticCurveTo(q.s, 0, 0, q.s); ctx.quadraticCurveTo(-q.s, 0, 0, -q.s * 1.6); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(-q.s * .3, -q.s * .1, q.s * .25, 0, TAU); ctx.fill(); }
      else if (q.t === 'conf') { ctx.rotate(q.rot); ctx.globalAlpha = Math.min(1, (q.life - q.age) * 2); ctx.fillStyle = q.c; ctx.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); }
      else { ctx.rotate(q.rot); ctx.globalAlpha = 1 - t; ctx.fillStyle = q.c; starPath(ctx, q.s); ctx.fill(); }
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
    clearTimeout(resizeT); resizeT = setTimeout(() => { bgKey = ''; layout(); if (!running) render(); }, 80);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#8ED6FF'); g.addColorStop(.55, '#D9F3FF'); g.addColorStop(.56, '#A9E46E'); g.addColorStop(1, '#4FAE35');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.fillStyle = '#8FD86A'; c.beginPath(); c.ellipse(s * .2, s * .58, s * .45, s * .12, 0, 0, TAU); c.ellipse(s * .85, s * .6, s * .4, s * .1, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(30,60,10,.25)'; c.beginPath(); c.ellipse(s * .5, s * .86, s * .38, s * .07, 0, 0, TAU); c.fill();
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.save(); c.shadowColor = 'rgba(0,0,0,.25)'; c.shadowBlur = 6; c.shadowOffsetY = 3;
    c.font = `${s * .5}px ${EMOJI_FONT}`; c.fillText('🐄', s * .58, s * .62);
    c.font = `${s * .3}px ${EMOJI_FONT}`; c.fillText('🐮', s * .26, s * .74);
    c.restore();
    c.fillStyle = '#FF4F86'; for (const [hx, hy, hs] of [[s * .3, s * .3, s * .07], [s * .44, s * .2, s * .05]]) { c.save(); c.translate(hx, hy); heartPath(c, hs); c.fill(); c.restore(); }
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'أين أمي؟', icon2: '🐄', isNew: true, music: 'shapes',
    desc: () => App.g('أعيدي كل صغير إلى أمّه', 'أعِد كل صغير إلى أمّه'),
    help: () => [
      '😢 صغير حيوان تائه يبكي! ' + App.g('اسحبيه', 'اسحبه') + ' إلى أمّه',
      '🐄 البقرة وصغيرها العجل، والدجاجة وصغيرها الكتكوت… ' + App.g('تعرّفي', 'تعرّف') + ' على أسماء الصغار',
      '🔊 في مستويات الأصوات ' + App.g('اسمعي', 'اسمع') + ' الصوت ثم ' + App.g('المسي', 'المس') + ' الحيوان صاحبه',
      '🌍 ' + App.g('بدّلي', 'بدّل') + ' بين «عربي» و«English» لتسمع الأسماء باللغتين',
      '⭐ بلا أخطاء = 3 نجوم'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 ${ks.length}/${LEVELS.length} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      setLang(store.get('mothersLang', 'ar'));
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, LEVELS.length));
      render(); startLoop();
    },
    leave() { stopLoop(); Snd.stop(); sayTok++; tasks = []; drag = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; Snd.stop(); if (drag && baby) { drag = null; baby.state = 'back'; baby.t = 0; baby.fx = baby.x; baby.fy = baby.y; } },
    resume() { paused = false; last = performance.now(); },
    back() { if (lvOv.classList.contains('on')) { act('close'); return true; } return false; },
    /* للاختبار الآلي فقط */
    _state() { return { lvl, mode: def.m, done, total, mistakes, over, M, BS, home, lang, target: quiz && quiz.target, baby: baby && { id: baby.a.id, x: baby.x, y: baby.y, state: baby.state }, moms: moms.map(m => ({ id: m.a.id, x: m.x, y: m.y, s: m.s })) }; }
  });
})();
