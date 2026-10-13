/* =====================================================================
   أرقام وعدّ — عدّ الأشياء، المقارنة، الجمع والطرح بالصور، تمييز الأرقام
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'numbers';
  const TAU = Math.PI * 2;
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';

  const WORDS = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
    'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر', 'عشرون'];
  const word = n => WORDS[n] != null ? WORDS[n] : String(n);
  const THINGS = [['🍎', 'تفاحة'], ['🍌', 'موزة'], ['🍓', 'فراولة'], ['🍊', 'برتقالة'], ['🐥', 'كتكوت'], ['🐟', 'سمكة'],
    ['🐞', 'دعسوقة'], ['🦋', 'فراشة'], ['🐢', 'سلحفاة'], ['🐝', 'نحلة'], ['🧸', 'دبدوب'], ['⚽', 'كرة'], ['🎈', 'بالون'],
    ['🚗', 'سيارة'], ['⭐', 'نجمة'], ['🌸', 'زهرة'], ['🍪', 'بسكويتة'], ['🦆', 'بطة'], ['🐰', 'أرنب'], ['🐸', 'ضفدع'], ['🍒', 'كرزة'], ['🧁', 'كعكة']];
  const FLIERS = [['🎈', 'بالون'], ['🦋', 'فراشة'], ['🐝', 'نحلة'], ['🐦', 'عصفور'], ['🐞', 'دعسوقة'], ['🦆', 'بطة']];
  const COLS = [['#FF5A5F', '#C7343A'], ['#FF9F1C', '#C96D06'], ['#FFC21A', '#C98E00'], ['#3BC14A', '#22852E'],
    ['#3A86FF', '#1F5CC4'], ['#9B5DE5', '#6A33B3'], ['#F15BB5', '#B42F7C'], ['#14B8C4', '#0B8089']];
  const TICON = { count: '🍎', more: '⚖️', add: '➕', sub: '➖', find: '🔢', match: '🔗' };

  /* المستويات: [النوع، من، إلى] — للجمع: المجموع، للطرح: العدد الأول */
  const LV = [
    [6, [['count', 1, 3]]],
    [6, [['count', 1, 5]]],
    [6, [['count', 1, 5], ['find', 1, 5]]],
    [6, [['count', 2, 6], ['more', 1, 5]]],
    [6, [['count', 3, 7], ['find', 0, 9], ['match', 1, 5]]],
    [6, [['count', 4, 8], ['more', 1, 7], ['find', 0, 10]]],
    [6, [['add', 2, 4], ['count', 3, 8]]],
    [6, [['add', 2, 5], ['find', 0, 10]]],
    [6, [['add', 3, 6], ['match', 1, 6], ['more', 2, 8]]],
    [6, [['count', 5, 10], ['add', 3, 7]]],
    [7, [['add', 4, 8], ['find', 5, 12]]],
    [7, [['add', 5, 10], ['match', 2, 8]]],
    [7, [['add', 5, 10], ['more', 3, 10], ['count', 6, 10]]],
    [7, [['sub', 2, 5], ['count', 6, 12]]],
    [7, [['sub', 3, 6], ['add', 5, 10]]],
    [7, [['sub', 4, 8], ['find', 0, 15]]],
    [7, [['count', 8, 12], ['find', 8, 15], ['match', 3, 10]]],
    [7, [['add', 8, 12], ['sub', 4, 8]]],
    [7, [['find', 10, 20], ['count', 8, 14]]],
    [7, [['add', 9, 14], ['sub', 5, 10]]],
    [8, [['add', 10, 15], ['match', 5, 12]]],
    [8, [['sub', 6, 10], ['more', 6, 15]]],
    [8, [['add', 11, 16], ['find', 10, 20]]],
    [8, [['sub', 7, 12], ['add', 10, 16]]],
    [8, [['add', 12, 18], ['match', 6, 12]]],
    [8, [['sub', 8, 15], ['count', 10, 15]]],
    [8, [['add', 13, 20], ['find', 0, 20]]],
    [8, [['sub', 10, 18], ['add', 12, 20]]],
    [8, [['add', 14, 20], ['sub', 10, 20], ['match', 8, 12]]],
    [8, [['add', 10, 20], ['sub', 10, 20], ['find', 0, 20], ['more', 8, 15], ['count', 10, 15]]]
  ];
  const NL = LV.length;

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  };
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  function mix(a, b, t) { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; }
  const loadProg = () => { const p = store.get('numbersProg', null) || {}; return { unlocked: clamp(p.unlocked || 1, 1, NL), stars: p.stars || {} }; };
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }

  /* ---------- صور مخزّنة ---------- */
  let dpr = 1;
  const ecache = new Map(), bcache = new Map();
  function emojiImg(e, size) {
    size = Math.max(8, Math.round(size / 2) * 2);
    const key = e + '|' + size + '|' + dpr;
    let c = ecache.get(key); if (c) return c;
    if (ecache.size > 260) ecache.clear();
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
  /* مكعب خشبي ملوّن عليه رقم (وكلمة اختيارية) */
  function blockImg(label, ci, s, wtxt) {
    s = Math.max(16, Math.round(s));
    const key = label + '|' + ci + '|' + s + '|' + (wtxt || '') + '|' + dpr;
    let im = bcache.get(key); if (im) return im;
    if (bcache.size > 260) bcache.clear();
    const d = Math.round(s * .09), pad = Math.ceil(s * .14), cw = s + pad * 2, chh = s + d + pad * 2;
    const c = mk(cw * dpr, chh * dpr), x = c.getContext('2d'); x.scale(dpr, dpr); x.direction = 'ltr';
    const [c1, c2] = ci < 0 ? ['#C9B8A4', '#9C8670'] : COLS[ci % COLS.length];
    const bx = pad, by = pad, r = s * .2;
    x.save(); x.shadowColor = 'rgba(70,35,5,.38)'; x.shadowBlur = s * .1; x.shadowOffsetY = s * .06;
    x.fillStyle = c2; x.beginPath(); x.roundRect(bx, by + d, s, s, r); x.fill(); x.restore();
    x.fillStyle = mix(c2, '#000000', .12); x.beginPath(); x.roundRect(bx, by + d, s, s, r); x.fill();
    // الوجه
    let g = x.createLinearGradient(0, by, 0, by + s); g.addColorStop(0, mix(c1, '#FFFFFF', .38)); g.addColorStop(.45, c1); g.addColorStop(1, mix(c1, c2, .55));
    x.fillStyle = g; x.beginPath(); x.roundRect(bx, by, s, s, r); x.fill();
    // عروق الخشب
    x.save(); x.beginPath(); x.roundRect(bx, by, s, s, r); x.clip();
    const R = rng(String(label).charCodeAt(0) * 31 + ci * 7 + s);
    for (let i = 0; i < 9; i++) {
      const y0 = by + R() * s; x.beginPath();
      for (let xx = bx - 4; xx <= bx + s + 4; xx += 4) x.lineTo(xx, y0 + Math.sin(xx * .07 + i * 1.7) * s * .025 + Math.sin(xx * .19 + i) * s * .01);
      x.strokeStyle = i % 2 ? 'rgba(255,255,255,.13)' : 'rgba(80,40,0,.08)'; x.lineWidth = .6 + R() * 1.4; x.stroke();
    }
    g = x.createRadialGradient(bx + s * .28, by + s * .2, 0, bx + s * .28, by + s * .2, s * .55);
    g.addColorStop(0, 'rgba(255,255,255,.38)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(bx, by, s, s);
    x.restore();
    // إطار داخلي محفور
    const ins = s * .085;
    x.lineWidth = Math.max(1.2, s * .024); x.strokeStyle = 'rgba(0,0,0,.14)';
    x.beginPath(); x.roundRect(bx + ins, by + ins + 1, s - ins * 2, s - ins * 2, r * .65); x.stroke();
    x.strokeStyle = 'rgba(255,255,255,.6)';
    x.beginPath(); x.roundRect(bx + ins, by + ins, s - ins * 2, s - ins * 2, r * .65); x.stroke();
    x.lineWidth = 1.5; x.strokeStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.roundRect(bx + 1, by + 1, s - 2, s - 2, r); x.stroke();
    // الرقم
    const lab = String(label);
    let fs = s * (wtxt ? (lab.length > 1 ? .44 : .54) : (lab.length > 1 ? .52 : .64));
    x.font = `900 ${fs}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    const m = x.measureText(lab); const A = m.actualBoundingBoxAscent || fs * .7, D = m.actualBoundingBoxDescent || 0;
    const cy = by + s * (wtxt ? .42 : .5), ty = cy + (A - D) / 2;
    x.lineJoin = 'round'; x.lineWidth = s * .075; x.strokeStyle = mix(c2, '#000000', .3);
    x.save(); x.shadowColor = 'rgba(0,0,0,.3)'; x.shadowOffsetY = s * .03; x.shadowBlur = s * .02;
    x.strokeText(lab, bx + s / 2, ty); x.restore();
    x.fillStyle = '#FFFFFF'; x.fillText(lab, bx + s / 2, ty);
    // شريط الكلمة
    if (wtxt) {
      const rw = s * .82, rh = s * .2, rx = bx + (s - rw) / 2, ry = by + s * .7;
      x.fillStyle = 'rgba(0,0,0,.12)'; x.beginPath(); x.roundRect(rx, ry + 1.5, rw, rh, rh / 2); x.fill();
      x.fillStyle = 'rgba(255,251,240,.95)'; x.beginPath(); x.roundRect(rx, ry, rw, rh, rh / 2); x.fill();
      let f2 = s * .14; x.font = `800 ${f2}px ${FONT}`; x.direction = 'rtl';
      const ww = x.measureText(wtxt).width; if (ww > rw * .9) { f2 *= rw * .9 / ww; x.font = `800 ${f2}px ${FONT}`; }
      x.fillStyle = mix(c2, '#000000', .35); x.textBaseline = 'middle'; x.fillText(wtxt, bx + s / 2, ry + rh * .54);
    }
    im = { c, w: cw, h: chh, pad };
    bcache.set(key, im);
    return im;
  }
  function drawBlock(c, x, y, s, label, ci, wtxt) {
    const im = blockImg(label, ci, s, wtxt), k = s / Math.max(16, Math.round(s));
    c.drawImage(im.c, x - (s / 2 + im.pad * k), y - (s / 2 + im.pad * k), im.w * k, im.h * k);
  }

  /* ---------- الواجهة ---------- */
  App.css(`
  #numbers{background:#FFF1DB;overflow:hidden}
  #numbers canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #numbers .ib{color:#C2571A}
  #numbers .chip{color:#7A3E10}
  #numbers .chip b{color:#E0592A}
  #numbers .prm{position:absolute;z-index:4;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 54px);
    width:min(calc(100% - 24px),560px);display:flex;align-items:center;gap:10px;padding:7px 12px 7px 10px;border-radius:24px;background:rgba(255,253,246,.96);
    box-shadow:0 4px 0 #E2B27C,0 8px 22px rgba(120,70,20,.15);border:3px solid #FFE1B5;cursor:pointer;transition:opacity .3s}
  #numbers .prm.off{opacity:0;pointer-events:none}
  #numbers .prm.bump{animation:nmBump .5s}
  #numbers .prm.wig{animation:nmWig .45s}
  @keyframes nmBump{30%{transform:translateX(-50%) scale(1.06)}}
  @keyframes nmWig{20%{transform:translateX(calc(-50% - 7px))}40%{transform:translateX(calc(-50% + 6px))}60%{transform:translateX(calc(-50% - 4px))}80%{transform:translateX(calc(-50% + 2px))}}
  #numbers .pic{width:48px;height:48px;flex:0 0 48px;border-radius:14px;display:grid;place-items:center;font-size:30px;background:linear-gradient(#FFE7B0,#FFC861);box-shadow:0 3px 0 #D9922E,inset 0 2px 0 rgba(255,255,255,.6)}
  #numbers .pt{flex:1;min-width:0;color:#6B3510}
  #numbers .ptxt{display:block;font-size:clamp(18px,5.2vw,24px);font-weight:900;line-height:1.2}
  #numbers .psub{display:block;font-size:13px;font-weight:700;opacity:.7;line-height:1.3}
  #numbers .spk{font-size:22px;flex:0 0 auto;opacity:.85}
  #numbers .dots{display:flex;gap:4px;margin-top:3px;flex-wrap:wrap}
  #numbers .dots i{width:16px;height:16px;border-radius:5px;background:#F2E3CC;box-shadow:inset 0 2px 3px rgba(0,0,0,.12);font-style:normal}
  #numbers .dots i.cur{background:#FFE7B0;box-shadow:0 0 0 2px #FF9F1C}
  #numbers .dots i.on{background:linear-gradient(#7DE38A,#3BC14A);box-shadow:0 2px 0 #22852E;animation:pop .3s}
  #numbers .panel{border-color:#FFE1B5;box-shadow:0 8px 0 #E2B27C,0 20px 40px rgba(80,40,0,.3);color:#6B3510}
  #numbers .panel h3{color:#E0592A}
  #numbers .btn{background:#FF8A3D;box-shadow:0 4px 0 #CF5F12}
  #numbers .btn.alt{background:#fff;color:#C9560A;box-shadow:0 4px 0 #EFC69A;border-color:#FFE0B8}
  #numbers .btn:active{box-shadow:0 1px 0 #CF5F12}
  #numbers .overlay{background:rgba(90,45,10,.35)}
  #numbers .lvp{width:min(94vw,420px);padding-bottom:14px}
  #numbers .pwrap{max-height:min(64vh,620px);overflow-y:auto;touch-action:pan-y;margin:8px -8px 10px;border-radius:22px;
    background:radial-gradient(circle at 20% 10%,rgba(255,255,255,.7) 0 6%,transparent 7%) 0 0/90px 90px,linear-gradient(#BFEAD2,#9FDCC0);box-shadow:inset 0 3px 10px rgba(0,60,30,.18)}
  #numbers .path{position:relative}
  #numbers .path svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  #numbers .nd{position:absolute;width:58px;height:58px;margin:-29px 0 0 -29px;border-radius:17px;color:#fff;font-weight:900;font-size:25px;line-height:1;
    display:grid;place-items:center;text-shadow:0 2px 0 rgba(0,0,0,.25);box-shadow:0 5px 0 var(--d),inset 0 2px 0 rgba(255,255,255,.55),0 8px 14px rgba(0,50,20,.2);
    background:linear-gradient(var(--l),var(--c))}
  #numbers .nd:active{transform:translateY(3px);box-shadow:0 2px 0 var(--d)}
  #numbers .nd .e{position:absolute;top:-10px;left:-10px;font-size:17px;text-shadow:none;background:#fff;border-radius:50%;width:26px;height:26px;display:grid;place-items:center;box-shadow:0 2px 0 rgba(0,0,0,.12)}
  #numbers .nd .s{position:absolute;bottom:-17px;left:50%;transform:translateX(-50%);font-size:12px;letter-spacing:-2px;white-space:nowrap;text-shadow:none}
  #numbers .nd .s i{font-style:normal}
  #numbers .nd .s i.off{filter:grayscale(1);opacity:.35}
  #numbers .nd.cur::before{content:'';position:absolute;inset:-9px;border-radius:24px;border:4px solid #fff;animation:nmPulse 1.2s infinite}
  @keyframes nmPulse{0%{transform:scale(.9);opacity:1}100%{transform:scale(1.25);opacity:0}}
  #numbers .nd.lock{--c:#CDBFAE;--l:#E6DCCF;--d:#A8977F;color:#8F7F6B;text-shadow:none}
  #numbers .nd.lock .n{opacity:.35}
  #numbers .nd.lock::after{content:'🔒';position:absolute;font-size:18px;bottom:-6px;right:-6px}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🗺️</button>
      <span class="grow"></span>
      <div class="chip"><small>المستوى</small><b class="cLv">1</b></div>
      <div class="chip"><small>النجوم</small><b class="cSt">⭐⭐⭐</b></div>
    </div>
    <div class="prm off" role="button" aria-label="إعادة السؤال">
      <div class="pic">🍎</div>
      <div class="pt"><b class="ptxt"></b><span class="psub"></span><div class="dots"></div></div>
      <span class="spk">🔊</span>
    </div>
    <div class="overlay" id="nmLv"><div class="panel lvp"><h3>🗺️ المستويات</h3>
      <div class="pwrap"><div class="path"></div></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="nmWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🗺️ المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const bar = root.querySelector('.bar');
  const prm = root.querySelector('.prm'), ptxt = root.querySelector('.ptxt'), psub = root.querySelector('.psub'), dotsEl = root.querySelector('.dots'), pic = root.querySelector('.pic');
  const lvOv = root.querySelector('#nmLv'), winOv = root.querySelector('#nmWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, portrait = true, top = 140;
  let area = null, board = null, inner = null, shelf = null, bgCache = {};
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, Q = [], qi = 0, q = null, mistakes = 0, phase = 'idle', nextAt = 0, winTimer = 0;
  let objs = [], choices = [], blocks = [], groups = [], links = [], seq = [], seqEnd = 0;
  let parts = [], rings = [], shake = 0, sel = null, keyBuf = '', keyT = 0, sayTimer = 0;

  /* ---------- توليد الأسئلة ---------- */
  function makeChoices(ans, mn, mx) {
    const c = [ans], cand = shuffle([ans - 1, ans + 1, ans - 2, ans + 2]).concat([ans + 3, ans - 3, ans + 4]);
    for (const v of cand) { if (c.length >= 3) break; if (v >= mn && v <= mx && !c.includes(v)) c.push(v); }
    for (let v = mn; c.length < 3; v++) if (!c.includes(v)) c.push(v);
    return shuffle(c);
  }
  function genQ(spec, prevE) {
    const [type, lo, hi] = spec;
    let th; do th = pick(type === 'sub' ? FLIERS : THINGS); while (th[0] === prevE);
    const base = { type, e: th[0], name: th[1], ciA: ri(0, 7) };
    base.ciB = (base.ciA + ri(2, 5)) % 8;
    if (type === 'count') { const n = ri(lo, hi); return Object.assign(base, { n, ans: n, ch: makeChoices(n, Math.max(0, lo - 1), Math.max(hi + 2, 5)) }); }
    if (type === 'add') {
      const s = ri(Math.max(2, lo), hi), a = ri(Math.max(1, Math.ceil(s / 2) - 3), Math.min(s - 1, Math.floor(s / 2) + 3)), b = s - a;
      const sw = Math.random() < .5;
      return Object.assign(base, { a: sw ? b : a, b: sw ? a : b, ans: s, ch: makeChoices(s, 1, 20) });
    }
    if (type === 'sub') {
      const n = ri(Math.max(2, lo), hi), k = ri(1, Math.max(1, Math.min(n - 1, Math.ceil(n * .6))));
      return Object.assign(base, { n, k, ans: n - k, ch: makeChoices(n - k, 0, n) });
    }
    if (type === 'more') {
      let a = ri(lo, hi), b; const gap = hi - lo >= 4 ? 2 : 1;
      do b = ri(lo, hi); while (Math.abs(a - b) < gap);
      const less = lvl >= 13 && Math.random() < .4;
      return Object.assign(base, { a, b, less, ans: (less ? a < b : a > b) ? 0 : 1 });
    }
    if (type === 'find') {
      const t = ri(lo, hi), K = hi > 10 ? 6 : 4, vs = [t];
      const tricky = [t + 10, t - 10, t % 10, t + 1, t - 1].filter(v => v >= 0 && v <= 20 && v !== t);
      for (const v of shuffle(tricky)) { if (vs.length >= Math.ceil(K / 2)) break; if (!vs.includes(v)) vs.push(v); }
      let guard = 0;
      while (vs.length < K && guard++ < 200) { const v = ri(Math.max(0, lo - 2), Math.min(20, hi + 2)); if (!vs.includes(v)) vs.push(v); }
      return Object.assign(base, { t, ans: t, vals: shuffle(vs) });
    }
    if (type === 'match') {
      const vs = []; let guard = 0;
      while (vs.length < 3 && guard++ < 200) { const v = ri(Math.max(1, lo), Math.min(12, hi)); if (!vs.includes(v)) vs.push(v); }
      return Object.assign(base, { vals: vs, gOrder: shuffle([0, 1, 2]) });
    }
  }
  function buildLevel(n) {
    const [cnt, specs] = LV[n - 1], list = [];
    for (let i = 0; i < cnt; i++) list.push(specs[i % specs.length]);
    shuffle(list);
    // أول سؤال في المستوى من النوع الجديد/الأساسي
    const i0 = list.indexOf(specs[0]); [list[0], list[i0]] = [list[i0], list[0]];
    let prev = null;
    return list.map(s => { const qq = genQ(s, prev); prev = qq.e; return qq; });
  }

  /* ---------- التخطيط ---------- */
  const usesChoices = t => t === 'count' || t === 'add' || t === 'sub';
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h;
    if (f.dpr !== dpr) { ecache.clear(); bcache.clear(); }
    dpr = f.dpr;
    portrait = W / H < 1.05;
    const pr = prm.getBoundingClientRect();
    top = Math.max(bar.getBoundingClientRect().bottom, pr.bottom) + 16;
    const pad = 12, bottom = H - Math.max(10, pad);
    const aw = Math.min(W - pad * 2, portrait ? 640 : 940);
    area = { x: (W - aw) / 2, y: top, w: aw, h: bottom - top };
    bgCache = {};
  }
  function regions(mode) {
    if (mode === 'split') {
      const sh = clamp(area.h * (portrait ? .22 : .26), 112, 170);
      board = { x: area.x, y: area.y, w: area.w, h: area.h - sh - 4 };
      shelf = { x: area.x, y: area.y + area.h - sh, w: area.w, h: sh };
    } else { board = { x: area.x, y: area.y, w: area.w, h: area.h - 8 }; shelf = null; }
    const fr = clamp(Math.min(board.w, board.h) * .045, 12, 20);
    inner = { x: board.x + fr + 6, y: board.y + fr + 8, w: board.w - fr * 2 - 12, h: board.h - fr * 2 - 14 };
  }
  /* شبكة متمركزة لمجموعة (من اليمين إلى اليسار) */
  function groupGrid(n, r, maxCols = 5, maxS = 96) {
    let best = { cols: 1, sz: 0 };
    for (let cols = 1; cols <= Math.min(n, maxCols); cols++) {
      const rows = Math.ceil(n / cols), sz = Math.min(r.w / cols, r.h / rows);
      if (sz > best.sz + .5) best = { cols, sz };
    }
    const cols = best.cols, rows = Math.ceil(n / cols), cell = best.sz;
    const s = Math.min(cell * .84, maxS), x0 = r.x + (r.w + cols * cell) / 2, y0 = r.y + (r.h - rows * cell) / 2;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / cols), col = i % cols, inRow = row === rows - 1 ? n - row * cols : cols;
      const off = (cols - inRow) * cell / 2;
      pts.push({ x: x0 - off - (col + .5) * cell, y: y0 + (row + .5) * cell });
    }
    return { pts, s };
  }
  function eqRect() { const eh = clamp(inner.h * .2, 54, 84); return { x: inner.x + 6, y: inner.y + inner.h - eh, w: inner.w - 12, h: eh - 4 }; }
  function layoutQ(snap) {
    if (!q) return;
    regions(usesChoices(q.type) ? 'split' : 'full');
    const t = q.type;
    if (t === 'count') {
      const n = q.n, cells = q.cells;
      const gr = { cols: q.cols, rows: q.rows }, cw = inner.w / gr.cols, ch = inner.h / gr.rows;
      const s = Math.min(cw, ch) * .7 > 110 ? 110 : Math.min(cw, ch) * .7;
      objs.forEach((o, i) => {
        const c = cells[i], col = c % gr.cols, row = Math.floor(c / gr.cols);
        o.s = s; o.hx = inner.x + inner.w - (col + .5) * cw + o.jx * (cw - s) * .38; o.hy = inner.y + (row + .5) * ch + o.jy * (ch - s) * .38;
      });
    } else if (t === 'add') {
      const er = eqRect(), gh = er.y - inner.y - 6, pw = clamp(inner.w * .12, 34, 70), hw = (inner.w - pw) / 2;
      q.rA = { x: inner.x + inner.w - hw, y: inner.y, w: hw, h: gh }; q.rB = { x: inner.x, y: inner.y, w: hw, h: gh };
      q.plus = { x: inner.x + hw + pw / 2, y: inner.y + gh / 2, s: pw };
      if (q.merged) {
        const g = groupGrid(objs.length, { x: inner.x + 6, y: inner.y, w: inner.w - 12, h: gh }, 5, 92);
        objs.forEach((o, i) => { o.s = g.s; o.hx = g.pts[i].x; o.hy = g.pts[i].y; });
      } else {
        const ga = groupGrid(q.a, q.rA, 5, 92), gb = groupGrid(q.b, q.rB, 5, 92), s = Math.min(ga.s, gb.s);
        objs.forEach(o => { const p = (o.g ? gb : ga).pts[o.gi]; o.s = s; o.hx = p.x; o.hy = p.y; });
      }
    } else if (t === 'sub') {
      const er = eqRect(), gr = groupGrid(q.n, { x: inner.x + 6, y: inner.y, w: inner.w - 12, h: er.y - inner.y - 6 }, 5, 96);
      objs.forEach((o, i) => { o.s = gr.s; o.hx = gr.pts[i].x; o.hy = gr.pts[i].y; });
    } else if (t === 'more') {
      const gap = clamp(inner.w * .05, 12, 30), tw = (inner.w - gap) / 2;
      groups = [0, 1].map(i => {
        const g = groups[i] || { wob: 0, hl: 0, ok: 0, i };
        g.r = { x: i === 0 ? inner.x + inner.w - tw : inner.x, y: inner.y + 30, w: tw, h: inner.h - 34 };
        return g;
      });
      [q.a, q.b].forEach((n, gi) => {
        const r = groups[gi].r, gg = groupGrid(n, { x: r.x + 10, y: r.y + 12, w: r.w - 20, h: r.h - 24 }, 4, 88);
        objs.filter(o => o.g === gi).forEach(o => { o.s = gg.s; o.hx = gg.pts[o.gi].x; o.hy = gg.pts[o.gi].y; });
      });
    } else if (t === 'find') {
      const K = q.vals.length;
      let best = { cols: 1, cell: 0 };
      for (let cols = 1; cols <= K; cols++) { const rows = Math.ceil(K / cols), cell = Math.min(inner.w / cols, inner.h / rows); if (cell > best.cell) best = { cols, cell }; }
      const cols = best.cols, rows = Math.ceil(K / cols), cw = inner.w / cols, ch = inner.h / rows, s = Math.min(best.cell * .7, 140);
      blocks.forEach((b, i) => {
        const row = Math.floor(i / cols), col = i % cols, inRow = row === rows - 1 ? K - row * cols : cols, off = (cols - inRow) * cw / 2;
        b.s = s; b.x = inner.x + inner.w - off - (col + .5) * cw + b.jx * (cw - s) * .25; b.y = inner.y + (row + .5) * ch + b.jy * (ch - s) * .25;
      });
    } else if (t === 'match') {
      const colW = clamp(inner.w * .28, 84, 220), mid = clamp(inner.w * .1, 26, 90), rh = inner.h / 3;
      const s = Math.min(colW * .78, rh * .74, 116);
      blocks.forEach((b, i) => { b.s = s; b.x = inner.x + inner.w - colW / 2; b.y = inner.y + (i + .5) * rh; });
      const gw = inner.w - colW - mid;
      groups.forEach((g, k) => {
        const slot = q.gOrder[k];
        g.r = { x: inner.x, y: inner.y + slot * rh + 6, w: gw, h: rh - 12 };
        const gg = groupGrid(g.v, { x: g.r.x + 8, y: g.r.y + 6, w: g.r.w - 16, h: g.r.h - 12 }, 6, 60);
        objs.filter(o => o.g === k).forEach(o => { o.s = gg.s; o.hx = gg.pts[o.gi].x; o.hy = gg.pts[o.gi].y; });
      });
    }
    if (shelf && choices.length) {
      const cs = Math.min(shelf.w / 3.5, shelf.h - 34, 132), gap = (shelf.w - cs * 3) / 4;
      const py = shelf.y + shelf.h - 22;
      choices.forEach((c, i) => { c.s = cs; c.x = shelf.x + shelf.w - gap - cs / 2 - i * (cs + gap); c.y = py - cs * .09 - cs / 2 - 4; });
      shelf.plank = py;
    }
    for (const o of objs) if (snap || o.x == null) { o.x = o.hx; o.y = o.hy; }
  }

  /* ---------- الخلفية ---------- */
  function bgFor(mode) {
    if (bgCache[mode]) return bgCache[mode];
    const c = mk(W * dpr, H * dpr), x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    // جدار غرفة اللعب
    let g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#FFF7E8'); g.addColorStop(1, '#FFE3BE');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i * 40 < W + 40; i++) { x.fillStyle = i % 2 ? 'rgba(255,255,255,.4)' : 'rgba(255,190,120,.10)'; x.fillRect(i * 40, 0, 20, H); }
    const R = rng(11);
    for (let i = 0; i < 34; i++) { x.fillStyle = ['rgba(255,90,95,.16)', 'rgba(58,134,255,.15)', 'rgba(255,194,26,.22)', 'rgba(59,193,74,.16)'][i % 4]; x.beginPath(); x.arc(R() * W, R() * H * .8, 3 + R() * 6, 0, TAU); x.fill(); }
    // راية أعلام ملوّنة
    x.strokeStyle = 'rgba(150,90,40,.5)'; x.lineWidth = 1.5;
    for (let row = 0; row < 1; row++) {
      const y0 = 8, sag = 16, n = Math.ceil(W / 34);
      x.beginPath(); for (let i = 0; i <= n; i++) { const xx = i * W / n, yy = y0 + Math.sin(i / n * Math.PI) * sag; i ? x.lineTo(xx, yy) : x.moveTo(xx, yy); } x.stroke();
      for (let i = 0; i < n; i++) {
        const xx = (i + .5) * W / n, yy = y0 + Math.sin((i + .5) / n * Math.PI) * sag;
        x.fillStyle = COLS[i % 8][0]; x.beginPath(); x.moveTo(xx - 11, yy); x.lineTo(xx + 11, yy); x.lineTo(xx, yy + 20); x.closePath(); x.fill();
      }
    }
    // أرضية خشبية
    const fy = H * (portrait ? .86 : .82);
    g = x.createLinearGradient(0, fy, 0, H); g.addColorStop(0, '#E7BE89'); g.addColorStop(1, '#D3A06A');
    x.fillStyle = g; x.fillRect(0, fy, W, H - fy);
    x.fillStyle = 'rgba(255,255,255,.5)'; x.fillRect(0, fy, W, 3);
    x.fillStyle = 'rgba(140,85,35,.18)';
    for (let yy = fy + 22, k = 0; yy < H; yy += 22, k++) { x.fillRect(0, yy, W, 1.5); for (let xx = (k % 2) * 60; xx < W; xx += 120) x.fillRect(xx, yy - 22, 1.5, 22); }
    // معداد في الهوامش العريضة
    const side = (W - area.w) / 2;
    if (side > 150) {
      const aw = Math.min(side - 40, 200), ah = Math.min(H * .5, aw * 1.5);
      drawAbacus(x, side / 2 - aw / 2, H * .3, aw, ah, 3);
      drawAbacus(x, W - side / 2 - aw / 2, H * .34, aw, ah * .9, 8);
    }
    regions(mode);
    drawBoard(x, board);
    if (mode === 'split') drawShelf(x, shelf);
    return (bgCache[mode] = c);
  }
  function drawAbacus(x, ax, ay, aw, ah, seed) {
    const R = rng(seed), fw = aw * .09, rods = 6;
    x.save(); x.shadowColor = 'rgba(90,45,10,.3)'; x.shadowBlur = 14; x.shadowOffsetY = 8;
    x.fillStyle = '#B9773C'; x.beginPath(); x.roundRect(ax, ay, aw, ah, 12); x.fill(); x.restore();
    x.fillStyle = '#FFF4E0'; x.beginPath(); x.roundRect(ax + fw, ay + fw, aw - fw * 2, ah - fw * 2, 6); x.fill();
    const g = x.createLinearGradient(ax, ay, ax, ay + ah); g.addColorStop(0, 'rgba(255,255,255,.25)'); g.addColorStop(1, 'rgba(0,0,0,.1)');
    x.lineWidth = fw; x.strokeStyle = g; x.beginPath(); x.roundRect(ax + fw / 2, ay + fw / 2, aw - fw, ah - fw, 9); x.stroke();
    const ih = ah - fw * 2, br = Math.min(ih / rods * .36, aw * .045);
    for (let r = 0; r < rods; r++) {
      const ry = ay + fw + (r + .5) * ih / rods;
      x.fillStyle = '#9E9E9E'; x.fillRect(ax + fw, ry - 1.5, aw - fw * 2, 3);
      const slid = Math.floor(R() * 10), [c1, c2] = COLS[r % 8];
      for (let b = 0; b < 10; b++) {
        const bx = b < slid ? ax + fw + br * 1.1 + b * br * 2.05 : ax + aw - fw - br * 1.1 - (9 - b) * br * 2.05;
        const gg = x.createRadialGradient(bx - br * .35, ry - br * .4, br * .1, bx, ry, br * 1.1);
        gg.addColorStop(0, mix(c1, '#FFFFFF', .5)); gg.addColorStop(.5, c1); gg.addColorStop(1, c2);
        x.fillStyle = gg; x.beginPath(); x.ellipse(bx, ry, br, br * .92, 0, 0, TAU); x.fill();
      }
    }
    // أرجل
    x.fillStyle = '#9C6230'; x.fillRect(ax + aw * .1, ay + ah - 2, fw * .8, fw * 1.6); x.fillRect(ax + aw * .9 - fw * .8, ay + ah - 2, fw * .8, fw * 1.6);
  }
  function drawBoard(x, b) {
    const rad = 28, fr = inner.x - b.x - 6;
    x.save(); x.shadowColor = 'rgba(90,45,10,.35)'; x.shadowBlur = 22; x.shadowOffsetY = 10;
    x.fillStyle = '#9A5A26'; x.beginPath(); x.roundRect(b.x, b.y + 8, b.w, b.h, rad); x.fill(); x.restore();
    // الإطار الخشبي
    x.save(); x.beginPath(); x.roundRect(b.x, b.y, b.w, b.h, rad); x.clip();
    let g = x.createLinearGradient(b.x, b.y, b.x + b.w * .3, b.y + b.h); g.addColorStop(0, '#E9A866'); g.addColorStop(.5, '#F3BC7C'); g.addColorStop(1, '#DE9A55');
    x.fillStyle = g; x.fillRect(b.x, b.y, b.w, b.h);
    const R = rng(5);
    for (let i = 0; i < b.h / 4; i++) {
      const y0 = b.y + i * 4 + R() * 2; x.beginPath();
      for (let xx = b.x; xx <= b.x + b.w + 8; xx += 8) x.lineTo(xx, y0 + Math.sin(xx * .01 + i * .3) * 3);
      x.strokeStyle = `rgba(130,65,15,${(.04 + R() * .1).toFixed(3)})`; x.lineWidth = .5 + R() * 1.4; x.stroke();
    }
    x.restore();
    x.lineWidth = 3; x.strokeStyle = 'rgba(255,236,200,.75)'; x.beginPath(); x.roundRect(b.x + 1.5, b.y + 1.5, b.w - 3, b.h - 3, rad - 1); x.stroke();
    // اللبّاد
    const f = { x: b.x + fr, y: b.y + fr + 2, w: b.w - fr * 2, h: b.h - fr * 2 - 2 };
    x.save(); x.beginPath(); x.roundRect(f.x, f.y, f.w, f.h, rad - 10); x.clip();
    g = x.createLinearGradient(0, f.y, 0, f.y + f.h); g.addColorStop(0, '#D9F4E6'); g.addColorStop(1, '#BDE9D3');
    x.fillStyle = g; x.fillRect(f.x, f.y, f.w, f.h);
    const R2 = rng(9); x.fillStyle = 'rgba(255,255,255,.35)';
    for (let i = 0; i < f.w * f.h / 70; i++) x.fillRect(f.x + R2() * f.w, f.y + R2() * f.h, 1, 1);
    x.fillStyle = 'rgba(30,110,70,.07)';
    for (let i = 0; i < f.w * f.h / 90; i++) x.fillRect(f.x + R2() * f.w, f.y + R2() * f.h, 1, 1);
    x.shadowColor = 'rgba(30,90,60,.45)'; x.shadowBlur = 12; x.shadowOffsetY = 5;
    x.lineWidth = 14; x.strokeStyle = '#000'; x.beginPath(); x.roundRect(f.x - 7, f.y - 7, f.w + 14, f.h + 14, rad - 4); x.stroke();
    x.restore();
    x.setLineDash([8, 7]); x.lineWidth = 2; x.strokeStyle = 'rgba(255,255,255,.8)';
    x.beginPath(); x.roundRect(f.x + 7, f.y + 7, f.w - 14, f.h - 14, rad - 16); x.stroke(); x.setLineDash([]);
    // خرز المعداد على الإطار العلوي
    const by = b.y + fr * .52, br = Math.min(fr * .36, 7), x0 = b.x + rad + 6, x1 = b.x + b.w - rad - 6;
    x.fillStyle = 'rgba(110,60,20,.45)'; x.fillRect(x0, by - 1.2, x1 - x0, 2.4);
    for (let i = 0; i < 10; i++) {
      const bx = i < 5 ? x0 + br + i * br * 2.1 : x1 - br - (9 - i) * br * 2.1, [c1, c2] = COLS[i % 8];
      const gg = x.createRadialGradient(bx - br * .35, by - br * .4, br * .1, bx, by, br * 1.1);
      gg.addColorStop(0, mix(c1, '#FFFFFF', .5)); gg.addColorStop(.5, c1); gg.addColorStop(1, c2);
      x.fillStyle = gg; x.beginPath(); x.ellipse(bx, by, br, br * .9, 0, 0, TAU); x.fill();
    }
  }
  function drawShelf(x, s) {
    const py = s.y + s.h - 22, x0 = s.x - 6, w = s.w + 12;
    x.save(); x.shadowColor = 'rgba(80,40,10,.35)'; x.shadowBlur = 12; x.shadowOffsetY = 8;
    x.fillStyle = '#A8682F'; x.beginPath(); x.roundRect(x0, py + 6, w, 14, 6); x.fill(); x.restore();
    const g = x.createLinearGradient(0, py - 6, 0, py + 8); g.addColorStop(0, '#F6C88E'); g.addColorStop(1, '#DCA061');
    x.fillStyle = g; x.beginPath(); x.roundRect(x0, py - 4, w, 12, 6); x.fill();
    x.fillStyle = 'rgba(255,255,255,.55)'; x.fillRect(x0 + 6, py - 3, w - 12, 2);
    // مساند
    x.fillStyle = '#B97A3E';
    [x0 + w * .12, x0 + w * .88].forEach(bx => { x.beginPath(); x.moveTo(bx - 8, py + 18); x.lineTo(bx + 8, py + 18); x.lineTo(bx, py + 30); x.closePath(); x.fill(); });
  }

  /* ---------- بدء السؤال ---------- */
  function mkObj(e, extra) { return Object.assign({ e, x: null, y: null, hx: 0, hy: 0, s: 40, at: 0, shown: false, cnt: 0, pop: 0, hl: 0, wob: 0, mode: 'sit', ft: 0, md: 0, ph: Math.random() * TAU, g: 0, gi: 0 }, extra); }
  function startQ() {
    q = Q[qi]; phase = 'intro'; seq = []; sel = null; links = []; choices = []; blocks = []; groups = []; objs = [];
    q.cnt = [0, 0, 0]; q.merged = false; q.solved = false; q.hintGlow = 0;
    const t = q.type, t0 = T + .35;
    let step = .08;
    if (t === 'count') {
      step = q.n > 10 ? .13 : .2;
      let best = { cols: 1, rows: 1, cell: 0 }; const cellsN = q.n + Math.max(1, Math.round(q.n * .35));
      regions('split');
      for (let cols = 1; cols <= cellsN; cols++) { const rows = Math.ceil(cellsN / cols), cell = Math.min(inner.w / cols, inner.h / rows); if (cell > best.cell) best = { cols, rows, cell }; }
      q.cols = best.cols; q.rows = best.rows;
      q.cells = shuffle(Array.from({ length: best.cols * best.rows }, (_, i) => i)).slice(0, q.n).sort((a, b) => a - b);
      for (let i = 0; i < q.n; i++) objs.push(mkObj(q.e, { at: t0 + i * step, jx: rand(-1, 1), jy: rand(-1, 1) }));
    } else if (t === 'add') {
      step = .09;
      for (let i = 0; i < q.a; i++) objs.push(mkObj(q.e, { g: 0, gi: i, at: t0 + i * step }));
      for (let i = 0; i < q.b; i++) objs.push(mkObj(q.e, { g: 1, gi: i, at: t0 + .25 + (q.a + i) * step }));
    } else if (t === 'sub') {
      step = .08;
      for (let i = 0; i < q.n; i++) objs.push(mkObj(q.e, { at: t0 + i * step, leave: i >= q.n - q.k }));
    } else if (t === 'more') {
      step = .07;
      for (let i = 0; i < q.a; i++) objs.push(mkObj(q.e, { g: 0, gi: i, at: t0 + i * step }));
      for (let i = 0; i < q.b; i++) objs.push(mkObj(q.e, { g: 1, gi: i, at: t0 + .2 + (q.a + i) * step }));
    } else if (t === 'find') {
      const cis = shuffle([0, 1, 2, 3, 4, 5, 6, 7]);
      blocks = q.vals.map((v, i) => ({ v, ci: cis[i % 8], at: t0 + i * .1, pop: 0, wob: 0, ok: 0, jx: rand(-1, 1), jy: rand(-1, 1), rot: rand(-.12, .12) }));
    } else if (t === 'match') {
      const cis = shuffle([0, 1, 2, 3, 4, 5, 6, 7]);
      blocks = q.vals.map((v, i) => ({ v, ci: cis[i], at: t0 + i * .12, pop: 0, wob: 0, ok: 0, rot: 0, jx: 0, jy: 0 }));
      groups = q.vals.map((v, k) => ({ v, wob: 0, hl: 0, ok: 0 }));
      let n = 0;
      const ems = shuffle(THINGS.slice()).slice(0, 3);
      groups.forEach((g, k) => { g.e = ems[k][0]; for (let i = 0; i < g.v; i++) objs.push(mkObj(g.e, { g: k, gi: i, at: t0 + .3 + (n++) * .03 })); });
    }
    let endT = t0 + (objs.length ? (objs[objs.length - 1].at - t0) : .4) + .45;
    if (t === 'sub') {
      // الطيران بعيدًا
      const lv = objs.filter(o => o.leave);
      const flyAt = endT + .5;
      lv.forEach((o, i) => { o.md = flyAt + i * .14; });
      q.flyAt = flyAt;
      endT = flyAt + lv.length * .14 + .9;
    }
    q.playAt = endT;
    if (usesChoices(t)) choices = q.ch.map((v, i) => ({ v, ci: (v + 3) % 8, st: 'idle', wob: 0, pop: 0, press: 0, at: endT - .25 + i * .08 }));
    layoutQ(true);
    setPrompt(true);
    renderDots();
    clearTimeout(sayTimer); sayTimer = setTimeout(() => { if (App.current === ID && q) sayPrompt(); }, 450);
    Sound.whoosh();
  }
  function promptOf() {
    const t = q.type;
    if (t === 'count') return { ic: q.e, t: `كم ${q.name}؟`, s: '👆 ' + App.g('المسي كل واحدة وعُدّي', 'المس كل واحدة وعُدّ'), say: `كم ${q.name}؟` };
    if (t === 'more') { const w = q.less ? 'أيهما أقل؟' : 'أيهما أكثر؟'; return { ic: '⚖️', t: w, s: '👆 ' + App.g('اختاري', 'اختر') + ' المجموعة', say: w }; }
    if (t === 'add') return { ic: '➕', t: 'كم المجموع؟', s: `${word(q.a)} زائد ${word(q.b)}`, say: `${word(q.a)} زائد ${word(q.b)}، كم المجموع؟` };
    if (t === 'sub') return { ic: '➖', t: 'كم بقي؟', s: `${word(q.n)} ناقص ${word(q.k)}`, say: `${word(q.n)} ناقص ${word(q.k)}، كم بقي؟` };
    if (t === 'find') return { ic: '🔢', t: `${App.g('المسي', 'المس')} الرقم ${q.t}`, s: word(q.t), say: `${App.g('المسي', 'المس')} الرقم ${word(q.t)}` };
    return { ic: '🔗', t: `${App.g('صِلي', 'صِل')} كل رقم بعدده`, s: '👉 ' + App.g('اسحبي', 'اسحب') + ' من الرقم إلى المجموعة', say: `${App.g('صِلي', 'صِل')} كل رقم بعدده` };
  }
  function setPrompt(bump) {
    const p = promptOf();
    pic.textContent = p.ic; ptxt.textContent = p.t; psub.textContent = p.s;
    prm.classList.remove('off');
    if (bump) { prm.classList.remove('bump'); void prm.offsetWidth; prm.classList.add('bump'); }
  }
  function sayPrompt() { App.speak(promptOf().say); }
  function renderDots() {
    dotsEl.innerHTML = Q.map((_, i) => `<i class="${i < qi ? 'on' : i === qi ? 'cur' : ''}"></i>`).join('');
  }
  function updChips() {
    root.querySelector('.cLv').textContent = lvl + '/' + NL;
    const s = starsFor(mistakes);
    root.querySelector('.cSt').textContent = '⭐'.repeat(s);
  }
  const starsFor = m => m === 0 ? 3 : m <= 2 ? 2 : 1;

  /* ---------- المستويات ---------- */
  function startLevel(n) {
    lvl = clamp(n, 1, NL);
    clearTimeout(winTimer); winOv.classList.remove('on'); lvOv.classList.remove('on');
    Q = buildLevel(lvl); qi = 0; mistakes = 0; parts = []; rings = [];
    layout(); updChips(); startQ();
  }
  function win() {
    phase = 'over'; prm.classList.add('off');
    const pr = loadProg(), stars = starsFor(mistakes), prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(NL, lvl + 1);
    store.set('numbersProg', pr);
    confetti(170);
    Sound.win(); vibrate(30);
    winTimer = setTimeout(() => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنت!') + ' 🎉';
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wP').textContent = App.g('أنهيتِ', 'أنهيتَ') + ` المستوى ${lvl}` + (mistakes ? ` · الأخطاء: ${mistakes}` : ' دون أي خطأ! 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < NL ? '' : 'none';
      winOv.classList.add('on');
      App.speak(App.g('أحسنتِ!', 'أحسنت!'));
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('num_first');
      if (Array.from({ length: NL }, (_, i) => pr.stars[i + 1]).every(Boolean)) App.achieve('num_all');
    }, 1200);
  }
  function openLevels() {
    const pr = loadProg(), path = root.querySelector('.path'), wrap = root.querySelector('.pwrap');
    const step = 98, h = NL * step + 50;
    const pts = Array.from({ length: NL }, (_, i) => ({ x: 50 + 30 * Math.sin(i * 1.05), y: 44 + i * step }));
    let d = `M${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < NL; i++) { const a = pts[i - 1], b = pts[i], my = (a.y + b.y) / 2; d += ` C${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`; }
    path.style.height = h + 'px';
    path.innerHTML = `<svg viewBox="0 0 100 ${h}" preserveAspectRatio="none" aria-hidden="true">
      <path d="${d}" fill="none" stroke="#C98B4E" stroke-width="22" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
      <path d="${d}" fill="none" stroke="#F3CF9C" stroke-width="15" stroke-linecap="round" vector-effect="non-scaling-stroke"/>
      <path d="${d}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>` +
      pts.map((p, i) => {
        const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked, [c1, c2] = COLS[i % 8];
        const ic = n === NL ? '🏆' : TICON[LV[i][1][0][0]];
        return `<button class="nd${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}"
          style="left:${p.x}%;top:${p.y}px;--c:${c1};--d:${c2};--l:${mix(c1, '#FFFFFF', .35)}"><span class="n">${n}</span><span class="e">${ic}</span>
          <span class="s">${lock ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
      }).join('');
    path.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
    const cur = pts[Math.min(pr.unlocked, NL) - 1];
    requestAnimationFrame(() => { wrap.scrollTop = Math.max(0, cur.y - wrap.clientHeight / 2); });
  }

  /* ---------- الحل والخطأ ---------- */
  function praise() { App.speak(App.g('أحسنتِ!', 'أحسنت!')); }
  function solved(cx, cy) {
    phase = 'solved'; q.solved = true; q.solvedAt = T; seq = [];
    Sound.star(); setTimeout(() => Sound.coin(), 120); vibrate(25);
    burst(cx, cy, '#FFD84A', 26); confetti(70);
    praise();
    let delay = 1.7;
    if (q.type === 'add') {
      q.merged = true; layoutQ(false);
      objs.forEach((o, i) => { o.md = T + .35 + i * .04; o.pop = 0; });
      setTimeout(() => { if (App.current === ID) Sound.merge(4); }, 400);
      delay = 2.3;
      const na = store.get('numbersAdd', 0) + 1; store.set('numbersAdd', na);
      if (na >= 20) App.achieve('num_add');
    } else if (q.type === 'count' || q.type === 'sub') {
      objs.filter(o => o.mode === 'sit').forEach((o, i) => { o.hop = T + i * .05; });
    } else if (q.type === 'more') {
      objs.filter(o => o.g === q.ans).forEach((o, i) => { o.hop = T + i * .04; });
      q.showTot = true; delay = 2;
    }
    nextAt = T + delay;
  }
  function wrongFx() {
    mistakes++; updChips();
    Sound.error(); vibrate(35); shake = Math.max(shake, 5);
    prm.classList.remove('wig'); void prm.offsetWidth; prm.classList.add('wig');
  }
  /* تلميح: إعادة العدّ مع الإضاءة */
  function recount(list, startAt, restart) {
    let n = 0; const t = T + startAt, iv = list.length > 10 ? .4 : list.length > 6 ? .5 : .62;
    if (restart !== false) list.forEach(o => { o.cnt = 0; });
    seq = seq.concat(list.map(o => ({ o, n: ++n, at: t + (n - 1) * iv })));
    seqEnd = t + n * iv + .2;
    phase = 'hint';
  }
  function wrongChoice(c) {
    c.st = 'wrong'; c.wob = 1; wrongFx();
    App.speak(App.g('حاولي مرة أخرى', 'حاول مرة أخرى'));
    if (q.type === 'count') recount(objs, 1.1);
    else if (q.type === 'add') { q.cnt = [0, 0, 0]; recount(objs, 1.1); }
    else if (q.type === 'sub') recount(objs.filter(o => o.mode === 'sit'), 1.1);
  }
  function pickChoice(c) {
    if (phase !== 'play' || c.st !== 'idle') return;
    c.press = 1;
    if (c.v === q.ans) {
      c.st = 'right'; c.pop = 1;
      solved(c.x, c.y);
    } else wrongChoice(c);
  }

  /* ---------- الجسيمات ---------- */
  function burst(x, y, col, n = 18) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU), v = rand(90, 300);
      parts.push({ t: i % 3 ? 'star' : 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 70, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .95), age: 0, s: rand(5, 11), c: i % 2 ? '#FFE26B' : col });
    }
    rings.push({ x, y, age: 0, life: .45, r: 40 });
  }
  function confetti(n) {
    for (let i = 0; i < n; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .35, -10), vx: rand(-60, 60), vy: rand(90, 260), rot: rand(0, TAU), vr: rand(-8, 8),
      life: rand(2.2, 3.6), age: 0, s: rand(6, 11), c: COLS[i % 8][0] });
  }

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  const inR = (r, x, y) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  function hitObj(x, y) {
    for (let i = objs.length - 1; i >= 0; i--) { const o = objs[i]; if (o.mode === 'sit' && T >= o.at && Math.hypot(o.x - x, o.y - y) < o.s * .58) return o; }
    return null;
  }
  function tapObj(o) {
    o.pop = 1; o.wob = .6;
    const gk = q.type === 'more' || q.type === 'match' ? o.g : 0;
    if (!o.cnt) {
      o.cnt = ++q.cnt[gk];
      Sound.tone(392 * Math.pow(2, Math.min(o.cnt, 20) / 12), .12, 'triangle', .14, 0); Sound.pop();
      burst(o.x, o.y, COLS[o.cnt % 8][0], 6);
    } else Sound.tap();
    App.speak(word(o.cnt)); vibrate(10);
  }
  function tryLink(bi, gi) {
    const b = blocks[bi], g = groups[gi];
    if (!b || !g || b.ok || g.ok) return;
    if (b.v === g.v) {
      b.ok = 1; g.ok = 1; b.pop = 1; links.push({ bi, gi, t: T });
      Sound.star(); vibrate(20); App.speak(word(b.v));
      burst(g.r.x + g.r.w / 2, g.r.y + g.r.h / 2, COLS[b.ci][0], 18);
      objs.filter(o => o.g === gi).forEach((o, i) => { o.hop = T + i * .03; });
      if (blocks.every(k => k.ok)) { setTimeout(() => { if (q && !q.solved) solved(b.x, b.y); }, 350); phase = 'wait'; }
    } else {
      b.wob = 1; g.wob = 1; wrongFx();
      App.speak(App.g('حاولي مرة أخرى', 'حاول مرة أخرى'));
      q.cnt[gi] = 0; recount(objs.filter(o => o.g === gi), 1.0);
    }
  }
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused || !q || winOv.classList.contains('on') || lvOv.classList.contains('on')) return;
    const m = pos(e);
    if (phase !== 'play') return;
    for (const c of choices) if (Math.abs(m.x - c.x) < c.s * .55 && Math.abs(m.y - c.y) < c.s * .6) { pickChoice(c); return; }
    const t = q.type;
    if (t === 'find') {
      for (const b of blocks) if (Math.abs(m.x - b.x) < b.s * .55 && Math.abs(m.y - b.y) < b.s * .55) {
        b.pop = 1; App.speak(word(b.v));
        if (b.v === q.t) { b.ok = 1; solved(b.x, b.y); }
        else { b.wob = 1; wrongFx(); q.hintGlow = 3.5; setTimeout(() => { if (q && !q.solved && App.current === ID) App.speak(`${App.g('ابحثي', 'ابحث')} عن ${word(q.t)}`); }, 900); }
        return;
      }
      return;
    }
    if (t === 'match') {
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (!b.ok && Math.abs(m.x - b.x) < b.s * .6 && Math.abs(m.y - b.y) < b.s * .6) {
          try { cv.setPointerCapture(e.pointerId); } catch (er) {}
          sel = { i, id: e.pointerId, x: m.x, y: m.y, sx: m.x, sy: m.y, moved: false };
          b.pop = 1; Sound.tone(520, .08, 'sine', .1, 260); App.speak(word(b.v)); vibrate(10);
          return;
        }
      }
      for (let gi = 0; gi < groups.length; gi++) if (inR(groups[gi].r, m.x, m.y)) {
        if (sel && sel.tap) { const s = sel; sel = null; tryLink(s.i, gi); return; }
        const o = hitObj(m.x, m.y); if (o) tapObj(o);
        return;
      }
      sel = null;
      return;
    }
    if (t === 'more') {
      const gi = groups.findIndex(g => inR(g.r, m.x, m.y));
      if (gi >= 0) pickGroup(gi);
      return;
    }
    const o = hitObj(m.x, m.y); if (o) tapObj(o);
  });
  cv.addEventListener('pointerup', e => {
    if (App.current !== ID || !q) return;
    const m = pos(e);
    if (q.type === 'match' && sel && sel.id === e.pointerId) {
      const gi = groups.findIndex(g => inR(g.r, m.x, m.y));
      if (gi >= 0 && sel.moved) { const s = sel; sel = null; tryLink(s.i, gi); }
      else if (!sel.moved) sel.tap = true;
      else sel = null;
    }
  });
  cv.addEventListener('pointermove', e => {
    if (!sel || sel.id !== e.pointerId) return;
    const m = pos(e); sel.x = m.x; sel.y = m.y;
    if (!sel.moved && Math.hypot(m.x - sel.sx, m.y - sel.sy) > 10) sel.moved = true;
  });
  cv.addEventListener('pointercancel', () => { sel = null; });

  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on')) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(lvl < NL ? 'next' : 'levels'); } return; }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? lvOv.classList.remove('on') : openLevels(); return; }
    if (lvOv.classList.contains('on') || !q || phase !== 'play') return;
    if (/^[0-9]$/.test(e.key)) {
      keyBuf = (performance.now() - keyT < 900 ? keyBuf : '') + e.key; keyT = performance.now();
      const v = +keyBuf;
      if (choices.length) { const c = choices.find(c => c.v === v && c.st === 'idle'); if (c && !choices.some(k => k.v > 9 && String(k.v).startsWith(keyBuf) && k.v !== v)) { keyBuf = ''; pickChoice(c); } }
      else if (q.type === 'find') { const b = blocks.find(b => b.v === v); if (b && !blocks.some(k => k.v > 9 && String(k.v).startsWith(keyBuf) && k.v !== v)) { keyBuf = ''; const r = cv.getBoundingClientRect(); cv.dispatchEvent(new PointerEvent('pointerdown', { clientX: r.left + b.x, clientY: r.top + b.y, pointerId: 9 })); } }
    } else if (q.type === 'more' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) pickGroup(e.key === 'ArrowRight' ? 0 : 1);
  });
  function pickGroup(gi) {
    if (phase !== 'play' || q.type !== 'more') return;
    const g = groups[gi];
    if (gi === q.ans) { g.ok = 1; solved(g.r.x + g.r.w / 2, g.r.y + g.r.h / 2); }
    else {
      g.wob = 1; wrongFx(); App.speak(App.g('لنعدّ معًا', 'لنعدّ معًا'));
      q.cnt = [0, 0, 0]; objs.forEach(o => { o.cnt = 0; });
      recount(objs.filter(o => o.g === 0), 1.0, false);
      recount(objs.filter(o => o.g === 1), seqEnd - T + .4, false);
      q.showTotAt = seqEnd;
    }
  }
  function act(a) {
    Sound.tap();
    if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
    else if (a === 'close') { lvOv.classList.remove('on'); if (phase === 'over') winOv.classList.add('on'); }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });
  prm.addEventListener('click', () => { if (q && phase !== 'over') { sayPrompt(); prm.classList.remove('bump'); void prm.offsetWidth; prm.classList.add('bump'); } });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    const k = 1 - Math.exp(-dt * 9);
    if (!q) return;
    if (phase === 'intro' && T >= q.playAt) phase = 'play';
    if (phase === 'hint') {
      while (seq.length && T >= seq[0].at) {
        const s = seq.shift(), o = s.o;
        o.cnt = s.n; o.pop = 1; o.hl = 1;
        const gk = q.type === 'more' || q.type === 'match' ? o.g : 0; q.cnt[gk] = Math.max(q.cnt[gk], s.n);
        App.speak(word(s.n)); Sound.tone(392 * Math.pow(2, Math.min(s.n, 20) / 12), .12, 'triangle', .13, 0);
      }
      if (!seq.length && T >= seqEnd) phase = 'play';
    }
    if (q.showTotAt && T >= q.showTotAt) { q.showTot = true; q.showTotAt = 0; }
    if (phase === 'solved' && T >= nextAt) {
      qi++; renderDots();
      if (qi >= Q.length) win(); else startQ();
      return;
    }
    q.hintGlow = Math.max(0, (q.hintGlow || 0) - dt);
    for (const o of objs) {
      if (!o.shown && T >= o.at) { o.shown = true; if (q.type === 'count') Sound.tone(500 + objs.indexOf(o) * 30, .07, 'sine', .08, 300); }
      o.pop = Math.max(0, o.pop - dt * 2.4); o.hl = Math.max(0, o.hl - dt * .9); o.wob = Math.max(0, o.wob - dt * 2);
      if (o.mode === 'sit') {
        if (o.leave && T >= o.md && q.type === 'sub') { o.mode = 'fly'; o.ft = 0; o.vx = rand(-60, 60); Sound.whoosh(); }
        if (!(q.type === 'add' && q.merged && T < o.md)) { o.x += (o.hx - o.x) * k; o.y += (o.hy - o.y) * k; }
      } else if (o.mode === 'fly') {
        o.ft += dt;
        o.fx = o.hx + o.vx * o.ft + Math.sin(o.ft * 9 + o.ph) * 10; o.fy = o.hy - 40 * o.ft - 380 * o.ft * o.ft;
        if (o.ft > 1.1) o.mode = 'gone';
      }
    }
    for (const c of choices) { c.pop = Math.max(0, c.pop - dt * 2); c.wob = Math.max(0, c.wob - dt * 1.8); c.press = Math.max(0, c.press - dt * 6); }
    for (const b of blocks) { b.pop = Math.max(0, b.pop - dt * 2.4); b.wob = Math.max(0, b.wob - dt * 1.8); }
    for (const g of groups) { g.wob = Math.max(0, g.wob - dt * 1.8); }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.age += dt;
      if (p.age > p.life) { parts.splice(i, 1); continue; }
      if (p.t === 'conf') { p.vy = Math.min(p.vy + 120 * dt, 260); p.vx += Math.sin(T * 3 + i) * 40 * dt; }
      else { p.vx *= 1 - dt * 3; p.vy = p.vy * (1 - dt * 3) + 320 * dt; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    shake = Math.max(0, shake - dt * 20);
  }

  /* ---------- الرسم ---------- */
  function badge(x, y, r, n) {
    const [c1, c2] = COLS[n % 8];
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.25)'; ctx.shadowBlur = 4; ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r + 2.5, 0, TAU); ctx.fill(); ctx.restore();
    const g = ctx.createRadialGradient(x - r * .3, y - r * .35, r * .1, x, y, r); g.addColorStop(0, mix(c1, '#FFFFFF', .35)); g.addColorStop(1, c2);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font = `900 ${r * (n > 9 ? 1.05 : 1.3)}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'ltr';
    ctx.fillText(String(n), x, y + r * .08);
  }
  function drawObj(o) {
    if (T < o.at) return;
    const a = clamp((T - o.at) / .38, 0, 1);
    if (a <= 0) return;
    const s = o.s;
    let x = o.x, y = o.y, al = 1, rot = 0, sc = ease.outBack(a);
    if (o.mode === 'fly') { x = o.fx; y = o.fy; al = clamp(1 - (o.ft - .6) / .5, 0, 1); rot = Math.sin(o.ft * 10) * .2; sc *= 1 + o.ft * .15; }
    if (o.mode === 'gone') {
      const gi = emojiImg(o.e, s * .9);
      ctx.save(); ctx.globalAlpha = .22; ctx.drawImage(gi, o.hx - gi.sz / 2, o.hy - gi.sz / 2, gi.sz, gi.sz);
      ctx.globalAlpha = .55; ctx.setLineDash([5, 5]); ctx.strokeStyle = '#6A9C83'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(o.hx, o.hy, s * .48, 0, TAU); ctx.stroke(); ctx.restore();
      return;
    }
    let hop = 0;
    if (o.hop && T >= o.hop && T < o.hop + .5) hop = Math.sin((T - o.hop) / .5 * Math.PI) * s * .3;
    const sq = Math.sin((1 - o.pop) * Math.PI * 3) * o.pop * .16;
    rot += Math.sin(T * 26 + o.ph) * .22 * o.wob;
    const bob = Math.sin(T * 2 + o.ph) * 1.5;
    ctx.save(); ctx.globalAlpha = al;
    // ظل
    if (o.mode === 'sit') { ctx.fillStyle = 'rgba(30,90,60,.18)'; ctx.beginPath(); ctx.ellipse(x, y + s * .42, s * .34 * sc * (1 - hop / s * .8), s * .09 * sc, 0, 0, TAU); ctx.fill(); }
    ctx.translate(x, y + bob - hop);
    if (o.hl > 0 || (q && q.type === 'count' && o.cnt)) {
      const ga = o.hl > 0 ? o.hl : .35;
      const g = ctx.createRadialGradient(0, 0, s * .1, 0, 0, s * .66);
      g.addColorStop(0, `rgba(255,240,120,${.9 * ga})`); g.addColorStop(1, 'rgba(255,240,120,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, s * .66, 0, TAU); ctx.fill();
    }
    ctx.rotate(rot); ctx.scale(sc * (1 + sq), sc * (1 - sq));
    const im = emojiImg(o.e, s * .9);
    ctx.drawImage(im, -im.sz / 2, -im.sz / 2, im.sz, im.sz);
    ctx.restore();
    if (o.cnt && o.mode === 'sit') badge(x + s * .3, y + bob - hop - s * .3, clamp(s * .2, 9, 17), o.cnt);
  }
  function drawChoice(c) {
    const a = clamp((T - c.at) / .4, 0, 1); if (a <= 0) return;
    const sc = ease.outBack(a) * (1 - c.press * .06) * (1 + Math.sin((1 - c.pop) * Math.PI * 3) * c.pop * .12);
    const bob = c.st === 'idle' ? Math.sin(T * 2.4 + c.x * .05) * 2 : 0;
    ctx.save();
    ctx.translate(c.x + Math.sin(T * 40) * 9 * c.wob, c.y + bob);
    ctx.rotate(Math.sin(T * 30) * .12 * c.wob);
    if (c.st === 'right') {
      const g = ctx.createRadialGradient(0, 0, c.s * .3, 0, 0, c.s * .9); g.addColorStop(0, 'rgba(130,255,140,.75)'); g.addColorStop(1, 'rgba(130,255,140,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, c.s * .9, 0, TAU); ctx.fill();
    }
    if (c.st === 'wrong' && c.wob <= 0) ctx.globalAlpha = .45;
    ctx.scale(sc, sc);
    drawBlock(ctx, 0, 0, c.s, c.v, c.st === 'wrong' ? -1 : c.ci, word(c.v));
    ctx.restore();
  }
  function drawEq() {
    const er = eqRect();
    ctx.save();
    ctx.fillStyle = 'rgba(255,250,236,.85)'; ctx.beginPath(); ctx.roundRect(er.x, er.y, er.w, er.h, er.h / 2); ctx.fill();
    ctx.strokeStyle = 'rgba(160,110,50,.25)'; ctx.lineWidth = 2; ctx.stroke();
    const bs = er.h * .78, ow = bs * .62;
    const ansTok = q.solved ? { v: q.ans, ci: (q.ans + 3) % 8 } : { v: '?', ci: -1 };
    const toks = q.type === 'add'
      ? [{ v: q.a, ci: q.ciA }, { op: '+' }, { v: q.b, ci: q.ciB }, { op: '=' }, ansTok]
      : [{ v: q.n, ci: q.ciA }, { op: '−' }, { v: q.k, ci: q.ciB }, { op: '=' }, ansTok];
    const tw = toks.reduce((s, t) => s + (t.op ? ow : bs + 6), 0);
    let x = er.x + er.w / 2 + tw / 2; const y = er.y + er.h / 2 - 2;
    ctx.direction = 'ltr';
    for (const t of toks) {
      const w = t.op ? ow : bs + 6; x -= w;
      if (t.op) {
        ctx.fillStyle = '#8A4B16'; ctx.font = `900 ${bs * .72}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(t.op, x + w / 2, y + bs * .04);
      } else {
        const isAns = t === ansTok;
        let s = bs;
        if (isAns && !q.solved) s *= 1 + Math.sin(T * 5) * .05;
        if (isAns && q.solved) s *= 1 + Math.max(0, 1 - (T - q.solvedAt) * 3) * .2;
        drawBlock(ctx, x + w / 2, y, s, t.v, t.ci);
      }
    }
    ctx.restore();
  }
  function drawTray(g, ci, label) {
    const r = g.r, wob = Math.sin(T * 34) * 7 * g.wob;
    ctx.save(); ctx.translate(wob, 0);
    const [c1, c2] = COLS[ci % 8];
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 22); ctx.fill();
    ctx.lineWidth = 3.5; ctx.setLineDash([10, 7]); ctx.strokeStyle = mix(c1, '#FFFFFF', .2); ctx.stroke(); ctx.setLineDash([]);
    if (g.ok) {
      ctx.save(); ctx.shadowColor = '#6CFF8A'; ctx.shadowBlur = 22; ctx.lineWidth = 5; ctx.strokeStyle = '#3BC14A';
      ctx.beginPath(); ctx.roundRect(r.x, r.y, r.w, r.h, 22); ctx.stroke(); ctx.restore();
    }
    if (label != null) {
      ctx.save(); ctx.translate(r.x + r.w / 2, r.y);
      drawBlock(ctx, 0, 0, 46, label, ci);
      ctx.restore();
    }
    ctx.restore();
  }
  function rope(x0, y0, x1, y1, col, t) {
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + Math.min(40, Math.abs(x1 - x0) * .2) * (t == null ? 1 : Math.cos(t * 6) * .3 + .7);
    ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(0,0,0,.15)'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(x0, y0 + 3); ctx.quadraticCurveTo(mx, my + 3, x1, y1 + 3); ctx.stroke();
    ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(mx, my, x1, y1); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 2; ctx.setLineDash([4, 6]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x1, y1, 8, 0, TAU); ctx.fill();
    ctx.restore();
  }
  function render() {
    if (!ctx) return;
    ctx.save();
    ctx.fillStyle = '#FFF1DB'; ctx.fillRect(0, 0, W, H);
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    if (q && area) {
      const mode = usesChoices(q.type) ? 'split' : 'full';
      ctx.drawImage(bgFor(mode), 0, 0, W, H);
      regions(mode);
      const t = q.type;
      if (t === 'add') {
        const fa = q.merged ? Math.max(0, 1 - (T - q.solvedAt) * 2.5) : clamp((T - objs[0].at) / .4, 0, 1);
        if (fa > 0) [[q.rA, q.ciA], [q.rB, q.ciB]].forEach(([r, ci]) => {
          ctx.save(); ctx.globalAlpha = fa; ctx.fillStyle = mix(COLS[ci][0], '#FFFFFF', .78);
          ctx.beginPath(); ctx.roundRect(r.x + 4, r.y + 4, r.w - 8, r.h - 8, 20); ctx.fill();
          ctx.setLineDash([9, 7]); ctx.lineWidth = 3; ctx.strokeStyle = mix(COLS[ci][0], '#FFFFFF', .25); ctx.stroke(); ctx.restore();
        });
        const p = q.plus, a = q.merged ? Math.max(0, 1 - (T - q.solvedAt) * 2.5) : clamp((T - objs[0].at) / .4, 0, 1);
        if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.translate(p.x, p.y); ctx.scale(.8 + a * .2, .8 + a * .2);
          const s = Math.min(p.s, 62);
          ctx.save(); ctx.shadowColor = 'rgba(30,90,60,.3)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3;
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, s * .55, 0, TAU); ctx.fill(); ctx.restore();
          const l = s * .27; ctx.lineCap = 'round'; ctx.lineWidth = s * .17; ctx.strokeStyle = '#FF8A3D';
          ctx.beginPath(); ctx.moveTo(-l, 0); ctx.lineTo(l, 0); ctx.moveTo(0, -l); ctx.lineTo(0, l); ctx.stroke(); ctx.restore(); }
      }
      if (t === 'more') {
        groups.forEach((g, i) => drawTray(g, i ? q.ciB : q.ciA, q.showTot ? (i ? q.b : q.a) : null));
      }
      if (t === 'match') {
        groups.forEach((g, i) => drawTray(g, 7 - i, null));
        for (const l of links) { const b = blocks[l.bi], g = groups[l.gi]; rope(b.x - b.s * .5, b.y, g.r.x + g.r.w - 6, g.r.y + g.r.h / 2, COLS[b.ci][0], T - l.t); }
        if (sel) { const b = blocks[sel.i]; if (sel.moved) rope(b.x - b.s * .5, b.y, sel.x, sel.y, COLS[b.ci][0]); }
      }
      for (const o of objs) if (o.mode !== 'fly') drawObj(o);
      for (const o of objs) if (o.mode === 'fly') drawObj(o);
      if (t === 'add' || t === 'sub') drawEq();
      for (const b of blocks) {
        const a = clamp((T - b.at) / .4, 0, 1); if (a <= 0) continue;
        const glow = (t === 'find' && q.hintGlow > 0 && b.v === q.t) || (t === 'match' && sel && blocks[sel.i] === b) || (t === 'find' && b.ok);
        ctx.save(); ctx.translate(b.x + Math.sin(T * 40) * 8 * b.wob, b.y + Math.sin(T * 2 + b.x) * 2);
        ctx.rotate(b.rot + Math.sin(T * 30) * .12 * b.wob + (b.ok && t === 'find' ? Math.min(1, b.pop) * 0 : 0));
        if (glow) {
          const pulse = .6 + .4 * Math.sin(T * 8);
          const g = ctx.createRadialGradient(0, 0, b.s * .3, 0, 0, b.s * .95); g.addColorStop(0, `rgba(255,236,90,${.9 * pulse})`); g.addColorStop(1, 'rgba(255,236,90,0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, b.s * .95, 0, TAU); ctx.fill();
        }
        const sc = ease.outBack(a) * (1 + Math.sin((1 - b.pop) * Math.PI * 3) * b.pop * .14) * (b.ok && t === 'match' ? .9 : 1);
        ctx.scale(sc, sc); if (b.ok && t === 'match') ctx.globalAlpha = .75;
        drawBlock(ctx, 0, 0, b.s, b.v, b.ci, b.s > 70 ? word(b.v) : null);
        ctx.restore();
      }
      for (const c of choices) drawChoice(c);
    }
    for (const r of rings) {
      const tt = r.age / r.life;
      ctx.save(); ctx.globalAlpha = 1 - tt; ctx.strokeStyle = '#FFF4B0'; ctx.lineWidth = 6 * (1 - tt) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r * (.6 + tt * 1.2), 0, TAU); ctx.stroke(); ctx.restore();
    }
    for (const p of parts) {
      const a = 1 - p.age / p.life;
      ctx.save(); ctx.globalAlpha = p.t === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
      if (p.t === 'star') { starPath(ctx, p.s * (.6 + a * .5)); ctx.fill(); }
      else if (p.t === 'dot') { ctx.beginPath(); ctx.arc(0, 0, p.s * .45 * a + 1, 0, TAU); ctx.fill(); }
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
    if (App.current !== ID || !q) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); layoutQ(true); render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#BFEAFF'); g.addColorStop(1, '#FFE6B8');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.fillStyle = 'rgba(255,255,255,.55)'; [[.2, .18, .07], [.82, .2, .05], [.9, .45, .04]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x * s, y * s, r * s, 0, TAU); c.fill(); });
    g = c.createLinearGradient(0, s * .78, 0, s); g.addColorStop(0, '#E7BE89'); g.addColorStop(1, '#C88E55');
    c.fillStyle = g; c.fillRect(0, s * .8, s, s * .2);
    const sv = dpr; dpr = 2;
    const bs = s * .33;
    drawBlock(c, s * .68, s * .65, bs, 1, 0);
    drawBlock(c, s * .32, s * .65, bs, 2, 4);
    drawBlock(c, s * .5, s * .65 - bs * 1.04, bs, 3, 2);
    dpr = sv;
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
    c.font = `${s * .2}px ${EMOJI_FONT}`; c.fillText('🍎', s * .16, s * .3); c.fillText('🍎', s * .86, s * .32);
    c.font = `${s * .15}px ${EMOJI_FONT}`; c.fillText('🍏', s * .2, s * .86);
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'أرقام وعدّ', icon2: '🔢', isNew: true, music: 'numbers',
    desc: () => App.g('عُدّي واجمعي واطرحي بالصور', 'عُدّ واجمع واطرح بالصور'),
    help: () => [
      '👆 ' + App.g('المسي', 'المس') + ' كل شيء ' + App.g('لتعدّيه', 'لتعدّه') + '، وسيظهر عليه رقمه ' + App.g('وتسمعينه', 'وتسمعه'),
      '🔢 ' + App.g('اختاري', 'اختر') + ' المكعب الذي عليه الجواب الصحيح',
      '➕ في الجمع تجتمع المجموعتان، وفي الطرح تطير بعض الأشياء بعيدًا 🎈 · ⚖️ وفي «أيهما أكثر؟» ' + App.g('المسي', 'المس') + ' المجموعة',
      '🔗 في التوصيل ' + App.g('اسحبي', 'اسحب') + ' من الرقم إلى المجموعة التي لها العدد نفسه',
      '⭐ ' + App.g('أنهي', 'أنهِ') + ' المستوى دون أخطاء ' + App.g('لتحصلي', 'لتحصل') + ' على 3 نجوم، و🗺️ يفتح ' + App.g('لكِ', 'لك') + ' خريطة المستويات'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 المستوى ${Math.max(...ks)} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      startLevel(Math.min(loadProg().unlocked, NL));
      render();
      startLoop();
    },
    leave() { stopLoop(); clearTimeout(winTimer); clearTimeout(sayTimer); sel = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; sel = null; },
    resume() { paused = false; last = performance.now(); },
    /* للاختبار الآلي فقط */
    _state() {
      return { lvl, qi, phase, mistakes, type: q && q.type, ans: q && q.ans, q,
        choices: choices.map(c => ({ v: c.v, x: c.x, y: c.y, st: c.st })), blocks: blocks.map(b => ({ v: b.v, x: b.x, y: b.y, ok: b.ok })),
        groups: groups.map(g => ({ v: g.v, r: g.r, ok: g.ok })), objs: objs.map(o => ({ x: o.x, y: o.y, g: o.g, cnt: o.cnt, mode: o.mode })) };
    },
    _pickGroup: gi => pickGroup(gi),
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    }
  });
})();
