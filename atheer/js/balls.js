/* =====================================================================
   مطر الكرات — صوّب وأطلق كل الكرات لتكسر المربعات الزجاجية
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'balls';
  const COLS = 7, RAD = 0.13, SPEED = 17, GAP = 0.06, LAUNCH_GAP = 0.06, MIN_ANG = 0.13;
  const FONT = "'Baloo Bhaijaan 2',system-ui,sans-serif";
  const TAU = Math.PI * 2;
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeBack = t => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const mulberry = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

  /* ------------------------------------------------------------------
     أشكال الكرات (المتجر)
     ------------------------------------------------------------------ */
  function circle(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, TAU); }
  function gloss(c, x, y, r, a = .85) {
    const g = c.createRadialGradient(x - r * .38, y - r * .42, 0, x - r * .38, y - r * .42, r * .55);
    g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; circle(c, x, y, r); c.fill();
  }
  function rim(c, x, y, r, col = 'rgba(40,10,80,.35)') {
    const g = c.createRadialGradient(x, y, r * .6, x, y, r);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, col);
    c.fillStyle = g; circle(c, x, y, r); c.fill();
  }
  function starPath(c, x, y, R, r, rot = -Math.PI / 2, n = 5) {
    c.beginPath();
    for (let i = 0; i < n * 2; i++) { const a = rot + i * Math.PI / n, d = i % 2 ? r : R; c.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); }
    c.closePath();
  }
  function pentagon(c, x, y, r, rot) {
    c.beginPath();
    for (let i = 0; i < 5; i++) { const a = rot + i * TAU / 5; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
    c.closePath();
  }
  const SKINS = {
    ball_white: {
      trail: '190,210,255',
      draw(c, x, y, r) {
        const g = c.createRadialGradient(x - r * .3, y - r * .35, r * .1, x, y, r);
        g.addColorStop(0, '#ffffff'); g.addColorStop(.6, '#eef0ff'); g.addColorStop(1, '#aeb3e6');
        c.fillStyle = g; circle(c, x, y, r); c.fill(); gloss(c, x, y, r, .9);
      }
    },
    ball_rainbow: {
      trail: null,
      draw(c, x, y, r) {
        c.save(); circle(c, x, y, r); c.clip();
        const cols = ['#FF4F7B', '#FF9F1C', '#FFE14D', '#4CD97B', '#38B6FF', '#9D5CFF'];
        for (let i = 0; i < 6; i++) {
          c.fillStyle = cols[i]; c.beginPath(); c.moveTo(x, y);
          c.arc(x, y, r * 1.1, -Math.PI / 2 + i * TAU / 6, -Math.PI / 2 + (i + 1) * TAU / 6 + .02); c.closePath(); c.fill();
        }
        const w = c.createRadialGradient(x, y, 0, x, y, r * .45);
        w.addColorStop(0, 'rgba(255,255,255,.75)'); w.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = w; c.fillRect(x - r, y - r, r * 2, r * 2);
        rim(c, x, y, r); gloss(c, x, y, r, .8);
        c.restore();
      }
    },
    ball_soccer: {
      trail: '230,240,255',
      draw(c, x, y, r) {
        const g = c.createRadialGradient(x - r * .3, y - r * .35, r * .1, x, y, r);
        g.addColorStop(0, '#fff'); g.addColorStop(.7, '#f1f1f6'); g.addColorStop(1, '#b7b9cc');
        c.fillStyle = g; circle(c, x, y, r); c.fill();
        c.save(); circle(c, x, y, r); c.clip();
        c.fillStyle = '#23202e'; c.strokeStyle = '#3a3646'; c.lineWidth = Math.max(.8, r * .06);
        pentagon(c, x, y, r * .36, -Math.PI / 2); c.fill();
        for (let i = 0; i < 5; i++) {
          const a = -Math.PI / 2 + i * TAU / 5, a2 = a + TAU / 10;
          c.beginPath(); c.moveTo(x + Math.cos(a) * r * .36, y + Math.sin(a) * r * .36); c.lineTo(x + Math.cos(a) * r * .62, y + Math.sin(a) * r * .62); c.stroke();
          pentagon(c, x + Math.cos(a2) * r * 1.02, y + Math.sin(a2) * r * 1.02, r * .36, a2 + Math.PI / 5 + Math.PI); c.fill();
        }
        rim(c, x, y, r, 'rgba(30,20,60,.3)');
        c.restore(); gloss(c, x, y, r, .7);
      }
    },
    ball_star: {
      trail: '255,214,90',
      draw(c, x, y, r) {
        const R = r * 1.22;
        const gl = c.createRadialGradient(x, y, 0, x, y, R * 1.25);
        gl.addColorStop(0, 'rgba(255,230,120,.55)'); gl.addColorStop(1, 'rgba(255,200,60,0)');
        c.fillStyle = gl; circle(c, x, y, R * 1.25); c.fill();
        const g = c.createRadialGradient(x - R * .2, y - R * .3, 0, x, y, R);
        g.addColorStop(0, '#FFFBD6'); g.addColorStop(.45, '#FFD84A'); g.addColorStop(1, '#F29A0C');
        starPath(c, x, y, R, R * .5); c.fillStyle = g; c.fill();
        c.lineJoin = 'round'; c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = Math.max(.8, r * .1); c.stroke();
        c.fillStyle = 'rgba(255,255,255,.9)'; starPath(c, x - R * .18, y - R * .2, R * .2, R * .06, 0, 4); c.fill();
      }
    },
    ball_gold: {
      trail: '255,200,80',
      draw(c, x, y, r) {
        const g = c.createRadialGradient(x - r * .35, y - r * .4, r * .05, x, y, r);
        g.addColorStop(0, '#FFF8D2'); g.addColorStop(.35, '#FFD54A'); g.addColorStop(.8, '#E09A08'); g.addColorStop(1, '#9A5E00');
        c.fillStyle = g; circle(c, x, y, r); c.fill();
        c.strokeStyle = 'rgba(255,240,180,.7)'; c.lineWidth = Math.max(.6, r * .08);
        c.beginPath(); c.arc(x, y, r * .7, Math.PI * .15, Math.PI * .85); c.stroke();
        gloss(c, x, y, r, .95);
      }
    }
  };
  function drawSkin(c, id, x, y, r, t) {
    const s = SKINS[id] || SKINS.ball_white;
    c.save(); s.draw(c, x, y, r, t || 0); c.restore();
  }
  [['ball_white', 'كرة بيضاء', 0, 'White ball'], ['ball_rainbow', 'كرة قوس قزح', 20, 'Rainbow ball'], ['ball_soccer', 'كرة قدم', 30, 'Soccer ball'],
   ['ball_star', 'نجمة لامعة', 30, 'Shiny star'], ['ball_gold', 'كرة ذهبية', 50, 'Golden ball']].forEach(([id, name, price, nameEn]) => App.shopItem({
    cat: 'ball', id, name, nameEn, price,
    draw(c, size) {
      const m = size / 2;
      const bg = c.createRadialGradient(m, m * .8, 0, m, m, m * .95);
      bg.addColorStop(0, '#4a2b86'); bg.addColorStop(1, '#1b1035');
      c.fillStyle = bg; circle(c, m, m, m * .94); c.fill();
      c.fillStyle = 'rgba(255,255,255,.7)';
      [[.25, .3, 1.2], [.72, .22, 1], [.8, .66, 1.3], [.2, .7, .9]].forEach(([a, b, s]) => { circle(c, size * a, size * b, s); c.fill(); });
      // ظل خفيف وأثر حركة
      c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(m, m + size * .3, size * .2, size * .05, 0, 0, TAU); c.fill();
      drawSkin(c, id, m, m, size * .27);
    }
  }));

  /* ------------------------------------------------------------------
     رسم المربع الزجاجي (يُستخدم في اللعبة والأيقونة)
     ------------------------------------------------------------------ */
  const CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const TRI = [0, 1, 2, 3].map(o => CORNERS.filter((_, i) => i !== o));
  function brickPath(c, h, tri) {
    c.beginPath();
    if (tri < 0) c.roundRect(-h, -h, h * 2, h * 2, h * .26);
    else { const p = TRI[tri]; c.moveTo(p[0][0] * h, p[0][1] * h); c.lineTo(p[1][0] * h, p[1][1] * h); c.lineTo(p[2][0] * h, p[2][1] * h); c.closePath(); }
  }
  const hueFor = (hp, round) => 330 - 120 * clamp(Math.log(Math.max(1, hp)) / Math.log(Math.max(14, round * 2.2)), 0, 1);
  function drawGlass(c, x, y, s, hue, val, tri, ratio, flash, seed, scale = 1) {
    const h = s * (.5 - GAP);
    c.save(); c.translate(x, y); if (scale !== 1) c.scale(scale, scale);
    c.lineJoin = 'round';
    brickPath(c, h, tri);
    c.strokeStyle = `hsla(${hue},100%,66%,.2)`; c.lineWidth = s * .13; c.stroke();
    const g = c.createLinearGradient(0, -h, 0, h);
    g.addColorStop(0, `hsla(${hue},95%,74%,.97)`); g.addColorStop(.5, `hsla(${hue},85%,58%,.94)`); g.addColorStop(1, `hsla(${hue + 12},80%,40%,.97)`);
    c.fillStyle = g; c.fill();
    if (tri >= 0) { c.strokeStyle = g; c.lineWidth = s * .06; c.stroke(); }
    c.save(); c.clip();
    const gl = c.createLinearGradient(0, -h, 0, 0);
    gl.addColorStop(0, 'rgba(255,255,255,.6)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = gl; c.beginPath(); c.ellipse(0, -h * 1.02, h * 1.3, h * .78, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.13)';
    c.beginPath(); c.moveTo(h * .05, -h); c.lineTo(h * .38, -h); c.lineTo(-h * .38, h); c.lineTo(-h * .72, h); c.fill();
    const sh = c.createLinearGradient(0, h * .3, 0, h);
    sh.addColorStop(0, 'rgba(20,0,50,0)'); sh.addColorStop(1, 'rgba(20,0,50,.25)');
    c.fillStyle = sh; c.fillRect(-h, h * .3, h * 2, h * .7);
    // تشققات حسب الضرر
    const lvl = ratio < .34 ? 2 : ratio < .67 ? 1 : 0;
    if (lvl) {
      const rnd = mulberry(seed);
      c.lineCap = 'round';
      for (let k = 0; k < lvl * 2; k++) {
        const a0 = rnd() * TAU, pts = [[Math.cos(a0) * h * 1.1, Math.sin(a0) * h * 1.1]];
        let a = a0 + Math.PI + (rnd() - .5) * 1.2;
        for (let j = 0; j < 3; j++) { const p = pts[pts.length - 1], d = h * (.25 + rnd() * .3); a += (rnd() - .5) * 1.4; pts.push([p[0] + Math.cos(a) * d, p[1] + Math.sin(a) * d]); }
        c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
        c.strokeStyle = 'rgba(40,0,70,.35)'; c.lineWidth = Math.max(1, s * .035); c.stroke();
        c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = Math.max(.7, s * .016); c.stroke();
        const b = pts[2], ba = a0 + Math.PI + (rnd() - .5) * 2.5;
        c.beginPath(); c.moveTo(b[0], b[1]); c.lineTo(b[0] + Math.cos(ba) * h * .3, b[1] + Math.sin(ba) * h * .3); c.stroke();
      }
    }
    if (flash > 0) { c.fillStyle = `rgba(255,255,255,${flash * .55})`; c.fillRect(-h, -h, h * 2, h * 2); }
    c.restore();
    brickPath(c, h, tri);
    c.strokeStyle = `hsla(${hue},100%,90%,.85)`; c.lineWidth = Math.max(1, s * .028); c.stroke();
    if (val != null) {
      let tx = 0, ty = 0, fs = s * (String(val).length > 3 ? .26 : String(val).length > 2 ? .31 : .37);
      if (tri >= 0) { const p = TRI[tri]; tx = (p[0][0] + p[1][0] + p[2][0]) / 3 * h * 1.05; ty = (p[0][1] + p[1][1] + p[2][1]) / 3 * h * 1.05; fs *= .78; }
      c.font = `900 ${fs}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillStyle = 'rgba(40,0,70,.35)'; c.fillText(val, tx, ty + s * .03);
      c.fillStyle = '#fff'; c.fillText(val, tx, ty);
    }
    c.restore();
  }

  /* ------------------------------------------------------------------
     الشاشة
     ------------------------------------------------------------------ */
  App.css(`
#balls{background:#1a1033;color:#fff}
#balls canvas.bc{position:absolute;inset:0;width:100%;height:100%;display:block}
#balls .ib{background:rgba(255,255,255,.13);color:#fff;box-shadow:0 3px 0 rgba(0,0,0,.35),inset 0 0 0 1.5px rgba(255,255,255,.18);backdrop-filter:blur(4px)}
#balls .chip{background:rgba(255,255,255,.1);color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.16),0 3px 0 rgba(0,0,0,.3);min-width:56px;padding:3px 10px}
#balls .chip small{opacity:.75}
#balls .chip b{font-size:18px}
#balls .chip.st b{color:#FFD84A}
#balls .fbtn{position:absolute;z-index:4;width:48px;height:48px;border-radius:50%;font-size:22px;display:grid;place-items:center;
  background:rgba(255,255,255,.12);box-shadow:0 3px 0 rgba(0,0,0,.35),inset 0 0 0 1.5px rgba(255,255,255,.22);
  opacity:0;transform:scale(.4);pointer-events:none;transition:opacity .25s,transform .35s cubic-bezier(.3,1.6,.6,1),background .2s}
#balls .fbtn.on{opacity:1;transform:none;pointer-events:auto}
#balls .fbtn.act{background:linear-gradient(#ff6fb5,#9d5cff);box-shadow:0 3px 0 #5a2a9a,0 0 18px rgba(255,111,181,.7)}
#balls .fbtn:active{transform:translateY(2px)}
#balls .hint span{background:rgba(255,255,255,.14);color:#fff;backdrop-filter:blur(3px)}
#balls .overlay{background:rgba(16,6,36,.6)}
#balls .panel{border-color:#E3D4FF;box-shadow:0 8px 0 #A98BFF,0 20px 50px rgba(0,0,0,.5);color:#3A1F6B}
#balls .panel h3{color:#7B3FE4}
#balls .panel .big{color:#3A1F6B}
#balls .panel .btn{background:linear-gradient(#ff6fb5,#e0217f);box-shadow:0 4px 0 #a3155c}
#balls .panel .btn.cont{background:linear-gradient(#a67bff,#6c3ce0);box-shadow:0 4px 0 #46219e}
#balls .panel .btn.alt{background:#fff;color:#7B3FE4;box-shadow:0 4px 0 #CDB8FF;border:2px solid #E3D4FF}
#balls .bo-sum{display:flex;justify-content:center;gap:10px;margin:2px 0 12px;flex-wrap:wrap}
#balls .bo-sum span{background:#F3ECFF;border-radius:99px;padding:3px 12px;font-weight:800;font-size:15px}
#balls .bo-rec{display:none;color:#E0217F;font-weight:900;font-size:17px;animation:pop .5s}
#balls .bo-rec.on{display:block}
#balls .sb{position:absolute;bottom:0;height:env(safe-area-inset-bottom,0px);width:1px;pointer-events:none}
`);
  const root = App.section(ID, `
    <canvas class="bc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية" data-aen="Home">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة" data-aen="Help">❓</button>
      <button class="ib pz" aria-label="إيقاف مؤقت" data-aen="Pause">⏸️</button>
      <span class="grow"></span>
      <div class="chip st"><small data-en="Stars">نجوم</small><b class="cS">0</b></div>
      <div class="chip"><small data-en="Round">الجولة</small><b class="cR">1</b></div>
      <div class="chip"><small data-en="Best">الأفضل</small><b class="cB">0</b></div>
    </div>
    <button class="fbtn recall" aria-label="إرجاع الكرات" data-aen="Call balls back">↩️</button>
    <button class="fbtn speed" aria-label="تسريع" data-aen="Speed up">⏩</button>
    <div class="hint"><span></span></div>
    <div class="sb"></div>
    <div class="overlay pause"><div class="panel">
      <h3 data-en="⏸️ Break">⏸️ استراحة</h3><p class="pzTxt"></p>
      <button class="btn pzGo" data-en="▶️ Continue">▶️ متابعة</button><br>
      <button class="btn alt pzNew" data-en="🔁 New game">🔁 لعبة جديدة</button>
      <button class="btn alt home" data-en="🏠 Menu">🏠 القائمة</button>
    </div></div>
    <div class="overlay over"><div class="panel">
      <h3 class="boT">انتهت اللعبة</h3>
      <div class="bo-rec" data-en="🎉 New record! 🎉">🎉 رقم قياسي جديد! 🎉</div>
      <div class="big boR">1</div>
      <p class="boP">جولة</p>
      <div class="bo-sum"><span><span data-en="🏆 Best:">🏆 الأفضل:</span> <b class="boB">0</b></span><span>⭐ +<b class="boS">0</b></span></div>
      <button class="btn cont boC">✨ فرصة إضافية</button><br>
      <button class="btn boA">🔁 العب مجددًا</button>
      <button class="btn alt home" data-en="🏠 Menu">🏠 القائمة</button>
    </div></div>`);
  /* نصوص الواجهة الثابتة: data-en للنص و data-aen للوصف (aria/title) */
  function i18n() {
    root.querySelectorAll('[data-en]').forEach(el => { if (el.dataset.ar == null) el.dataset.ar = el.textContent; el.textContent = App.t(el.dataset.ar, el.dataset.en); });
    root.querySelectorAll('[data-aen]').forEach(el => {
      if (el.dataset.aar == null) el.dataset.aar = el.getAttribute('aria-label') || el.title || '';
      const v = App.t(el.dataset.aar, el.dataset.aen); if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', v); if (el.title) el.title = v;
    });
  }
  let overRec = false;
  const hintText = () => App.t(App.g('اسحبي للتصويب ثم اتركي 👆', 'اسحب للتصويب ثم اترك 👆'), 'Drag to aim, then let go 👆');
  function overText() {
    q('.boT').textContent = overRec ? App.t(App.g('أحسنتِ!', 'أحسنت!'), 'Well done!') + ' 🌟' : App.t('انتهت اللعبة', 'Game over');
    q('.boP').textContent = App.t(App.g('وصلتِ إلى الجولة', 'وصلت إلى الجولة'), 'You reached round') + ' ' + round;
    q('.boC').textContent = App.t('✨ فرصة إضافية (مرة واحدة)', '✨ Extra chance (once)');
    q('.boA').textContent = '🔁 ' + App.t(App.g('العبي مجددًا', 'العب مجددًا'), 'Play again');
  }
  const pauseText = () => App.t(`الجولة ${round} • ⚪ ${ballN} ${ballN > 10 ? 'كرة' : ballN > 2 ? 'كرات' : 'كرة'}`, `Round ${round} • ⚪ ${ballN} ${ballN === 1 ? 'ball' : 'balls'}`);
  const q = s => root.querySelector(s);
  const cv = q('canvas.bc'), bar = q('.bar'), hintEl = q('.hint'), speedBtn = q('.speed'), recallBtn = q('.recall');
  const pauseOv = q('.overlay.pause'), overOv = q('.overlay.over');

  /* ------------------------------------------------------------------
     الحالة
     ------------------------------------------------------------------ */
  let ctx, W = 0, H = 0, dpr = 1, C = 50, ox = 0, oy = 0, R = 10, bgCv = null, sprite = null, spriteS = 0;
  let skin = 'ball_white';
  let raf = 0, last = 0, running = false, paused = false, userPaused = false, time = 0;
  let state = 'aim'; // aim | fly | shift | over
  let round = 1, ballN = 1, launchX = 3.5, nextX = null, pending = 0, starsRun = 0, continued = false, awardedTens = 0, bestAtStart = 0;
  let bricks = [], picks = [], grid = [], flying = [], queue = 0, launchT = 0, flyT = 0, timeScale = 1, roundBreaks = 0;
  let parts = [], texts = [], shake = 0, shiftT = 0, overT = 0, pickId = 0;
  let aim = null, aimPath = null, dragging = false, kbAng = -Math.PI / 2, lastSnd = 0, lastBreakSnd = 0, lastLaunchSnd = 0, hintShown = false;
  let twinkles = [];

  const best = () => store.get('ballsBest', 0);

  /* ---------- التخطيط ---------- */
  function layout(newRun) {
    const r = fitCanvas(cv); ctx = r.ctx; W = r.w; H = r.h; dpr = r.dpr;
    const top = bar.getBoundingClientRect().height + 8;
    const safeB = q('.sb').offsetHeight || 0;
    const bottom = 86 + safeB;
    const availH = Math.max(200, H - top - bottom), availW = Math.min(W - 20, 470);
    if (newRun) R = clamp(Math.floor(availH / (availW / COLS)), 9, 12);
    C = Math.min(availW / COLS, availH / R);
    ox = Math.round((W - COLS * C) / 2);
    oy = Math.round(top + Math.max(0, (availH - R * C) * .4));
    const floorY = oy + R * C;
    recallBtn.style.top = speedBtn.style.top = (floorY + 30) + 'px';
    recallBtn.style.left = (ox) + 'px';
    speedBtn.style.left = (ox + COLS * C - 48) + 'px';
    hintEl.style.top = (floorY - C * 2.2) + 'px';
    buildBg(); buildSprite();
    twinkles = Array.from({ length: 26 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: rand(.6, 1.8), p: rand(0, TAU), v: rand(1, 2.5) }));
  }
  function buildBg() {
    bgCv = document.createElement('canvas'); bgCv.width = Math.round(W * dpr); bgCv.height = Math.round(H * dpr);
    const c = bgCv.getContext('2d'); c.scale(dpr, dpr);
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#120a2b'); g.addColorStop(.5, '#24124a'); g.addColorStop(1, '#0f0824');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    [[.15, .2, '#ff4fa3', .16], [.9, .45, '#5b7bff', .16], [.3, .85, '#9d5cff', .14], [.75, .05, '#9d5cff', .12]].forEach(([x, y, col, a]) => {
      const rg = c.createRadialGradient(W * x, H * y, 0, W * x, H * y, Math.max(W, H) * .45);
      rg.addColorStop(0, col + Math.round(a * 255).toString(16).padStart(2, '0')); rg.addColorStop(1, col + '00');
      c.fillStyle = rg; c.fillRect(0, 0, W, H);
    });
    for (let i = 0; i < W * H / 2500; i++) { c.fillStyle = `rgba(255,255,255,${rand(.15, .6)})`; c.beginPath(); c.arc(Math.random() * W, Math.random() * H, rand(.4, 1.3), 0, TAU); c.fill(); }
    // لوحة اللعب
    const pw = COLS * C, ph = R * C;
    c.save();
    c.beginPath(); c.roundRect(ox - 6, oy - 6, pw + 12, ph + 12, 18);
    const pg = c.createLinearGradient(0, oy, 0, oy + ph);
    pg.addColorStop(0, 'rgba(255,255,255,.05)'); pg.addColorStop(1, 'rgba(160,120,255,.07)');
    c.fillStyle = pg; c.fill();
    c.strokeStyle = 'rgba(200,170,255,.28)'; c.lineWidth = 1.5; c.stroke();
    c.clip();
    c.strokeStyle = 'rgba(255,255,255,.045)'; c.lineWidth = 1;
    for (let i = 1; i < COLS; i++) { c.beginPath(); c.moveTo(ox + i * C, oy); c.lineTo(ox + i * C, oy + ph); c.stroke(); }
    for (let j = 1; j < R; j++) { c.beginPath(); c.moveTo(ox, oy + j * C); c.lineTo(ox + pw, oy + j * C); c.stroke(); }
    // صف الخطر
    const dg = c.createLinearGradient(0, oy + (R - 1) * C, 0, oy + ph);
    dg.addColorStop(0, 'rgba(255,80,140,0)'); dg.addColorStop(1, 'rgba(255,80,140,.1)');
    c.fillStyle = dg; c.fillRect(ox, oy + (R - 1) * C, pw, C);
    c.restore();
    // الأرضية
    const fy = oy + ph;
    const fg = c.createLinearGradient(ox, 0, ox + pw, 0);
    fg.addColorStop(0, 'rgba(255,111,181,0)'); fg.addColorStop(.5, 'rgba(255,170,230,.9)'); fg.addColorStop(1, 'rgba(120,150,255,0)');
    c.fillStyle = fg; c.fillRect(ox - 6, fy - 1, pw + 12, 2);
    const fg2 = c.createLinearGradient(0, fy, 0, fy + 26);
    fg2.addColorStop(0, 'rgba(255,111,181,.16)'); fg2.addColorStop(1, 'rgba(255,111,181,0)');
    c.fillStyle = fg2; c.fillRect(ox - 6, fy, pw + 12, 26);
  }
  function buildSprite() {
    const rp = RAD * C;
    spriteS = Math.ceil(rp * 3.4);
    sprite = document.createElement('canvas'); sprite.width = sprite.height = Math.ceil(spriteS * dpr);
    const c = sprite.getContext('2d'); c.scale(dpr, dpr);
    drawSkin(c, skin, spriteS / 2, spriteS / 2, rp);
  }
  const PX = gx => ox + gx * C, PY = gy => oy + gy * C;

  /* ---------- اللعبة ---------- */
  function newGame() {
    layout(true);
    round = 1; ballN = 1; launchX = 3.5; nextX = null; pending = 0; starsRun = 0; continued = false; awardedTens = 0;
    bestAtStart = best();
    bricks = []; picks = []; flying = []; parts = []; texts = []; queue = 0;
    spawnRow(1, 1, false);
    rebuild();
    startAim();
  }
  function spawnRow(rnd, row, anim) {
    const cells = [0, 1, 2, 3, 4, 5, 6].sort(() => Math.random() - .5);
    const mk = (t) => picks.push({ c: cells.pop(), r: row, t, id: ++pickId, ph: rand(0, TAU), born: anim, used: false, flash: 0 });
    mk('ball');
    if (rnd > 2 && Math.random() < .22) mk('star');
    if (rnd >= 6 && Math.random() < .1) mk('laser');
    const p = clamp(.36 + rnd * .012, .36, .68);
    let made = 0;
    cells.forEach(c => {
      if (Math.random() < p || (rnd === 1 && made < 2 && Math.random() < .6)) { addBrick(c, row, rnd, anim); made++; }
    });
    if (!made && cells.length) addBrick(cells[0], row, rnd, anim);
  }
  function addBrick(c, r, rnd, anim) {
    const hp = rnd * (rnd >= 4 && Math.random() < .22 ? 2 : 1);
    const tri = rnd >= 5 && Math.random() < .12 ? (Math.random() * 4) | 0 : -1;
    bricks.push({ c, r, hp, max: hp, tri, hit: 0, seed: (Math.random() * 1e9) | 0, dead: false, born: anim });
  }
  function rebuild() {
    grid = Array.from({ length: R + 1 }, () => new Array(COLS).fill(null));
    bricks = bricks.filter(b => !b.dead);
    picks = picks.filter(p => !p.dead);
    bricks.forEach(b => {
      if (b.r >= 0 && b.r < R) grid[b.r][b.c] = b;
      const h = .5 - GAP, pts = b.tri < 0 ? CORNERS : TRI[b.tri];
      b.poly = pts.map(p => [b.c + .5 + p[0] * h, b.r + .5 + p[1] * h]);
    });
  }
  function startAim() {
    state = 'aim'; aim = null; aimPath = null; dragging = false; nextX = null; timeScale = 1;
    speedBtn.classList.remove('on', 'act'); recallBtn.classList.remove('on');
    if (round > best()) store.set('ballsBest', round);
    if (round >= 10) App.achieve('balls_10');
    if (round >= 30) App.achieve('balls_30');
    paintChips(); save();
    if (round <= 2 && !hintShown) showHint(hintText());
  }
  function showHint(t) { hintEl.querySelector('span').textContent = t; hintEl.style.opacity = 1; }
  function hideHint() { hintEl.style.opacity = 0; }
  function paintChips() {
    q('.cR').textContent = round; q('.cB').textContent = Math.max(best(), round); q('.cS').textContent = starsRun;
  }
  function save() {
    store.set('ballsSave', {
      R, round, ballN, launchX, starsRun, continued, awardedTens, bestAtStart,
      bricks: bricks.filter(b => !b.dead).map(b => [b.c, b.r, b.hp, b.max, b.tri, b.seed]),
      picks: picks.filter(p => !p.dead).map(p => [p.c, p.r, p.t])
    });
  }
  function load() {
    const s = store.get('ballsSave', null);
    if (!s || !s.bricks) return false;
    R = s.R; layout(false);
    ({ round, ballN, launchX, starsRun, continued, awardedTens, bestAtStart } = s);
    bricks = s.bricks.map(([c, r, hp, max, tri, seed]) => ({ c, r, hp, max, tri, seed, hit: 0, dead: false }));
    picks = s.picks.map(([c, r, t]) => ({ c, r, t, id: ++pickId, ph: rand(0, TAU), used: false, flash: 0 }));
    flying = []; parts = []; texts = []; queue = 0; pending = 0;
    rebuild(); startAim();
    return true;
  }

  /* ---------- التصويب ---------- */
  function aimFromPointer(px, py) {
    const gx = (px - ox) / C, gy = (py - oy) / C;
    let dx = gx - launchX, dy = gy - (R - RAD);
    if (dy > -.35) { dx = -dx; dy = -dy; } // سحب للخلف كالمقلاع
    if (Math.hypot(dx, dy) < .45) return null;
    let a = Math.atan2(dy, dx);
    if (a > 0) a = a > Math.PI / 2 ? -Math.PI + MIN_ANG : -MIN_ANG;
    a = clamp(a, -Math.PI + MIN_ANG, -MIN_ANG);
    return a;
  }
  function setAim(a) {
    if (a == null) { aim = null; aimPath = null; return; }
    if (aim === a && aimPath) return;
    aim = a; aimPath = traceAim(a);
  }
  function traceAim(a) {
    const b = { x: launchX, y: R - RAD, vx: Math.cos(a), vy: Math.sin(a) };
    const pts = [[b.x, b.y]]; let dist = 0, sinceDot = 0, bounced = false, after = 0, hitPt = null;
    const step = .035;
    for (let i = 0; i < 2000; i++) {
      b.x += b.vx * step; b.y += b.vy * step; dist += step; sinceDot += step;
      const hit = collide(b, false);
      if (hit) {
        if (bounced) { hitPt = [b.x, b.y]; break; }
        bounced = true; hitPt = [b.x, b.y]; pts.push([b.x, b.y, 1]); sinceDot = 0;
      }
      if (bounced) { after += step; if (after > 2.6) break; }
      if (sinceDot >= .34) { pts.push([b.x, b.y, bounced ? 1 : 0]); sinceDot = 0; }
      if (b.y >= R - RAD && b.vy > 0) break;
    }
    return { pts, hitPt: bounced ? pts.find(p => p[2]) : hitPt };
  }

  /* ---------- الفيزياء ---------- */
  function circlePoly(px, py, r, poly) {
    let best = 1e9, qx = 0, qy = 0, inside = true;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const ex = b[0] - a[0], ey = b[1] - a[1];
      const cr = ex * (py - a[1]) - ey * (px - a[0]);
      if (cr < 0) inside = false;
      let t = ((px - a[0]) * ex + (py - a[1]) * ey) / (ex * ex + ey * ey); t = t < 0 ? 0 : t > 1 ? 1 : t;
      const cx = a[0] + ex * t, cy = a[1] + ey * t, d = (px - cx) ** 2 + (py - cy) ** 2;
      if (d < best) { best = d; qx = cx; qy = cy; }
    }
    const d = Math.sqrt(best);
    if (inside) { const n = d || 1; return { nx: (qx - px) / n, ny: (qy - py) / n, pen: d + r }; }
    if (d >= r || d === 0) return null;
    return { nx: (px - qx) / d, ny: (py - qy) / d, pen: r - d };
  }
  function collide(b, live) {
    let hit = null;
    if (b.x < RAD) { b.x = RAD; if (b.vx < 0) { b.vx = -b.vx; hit = 'wall'; } }
    else if (b.x > COLS - RAD) { b.x = COLS - RAD; if (b.vx > 0) { b.vx = -b.vx; hit = 'wall'; } }
    if (b.y < RAD) { b.y = RAD; if (b.vy < 0) { b.vy = -b.vy; hit = 'wall'; } }
    const c0 = Math.floor(b.x), r0 = Math.floor(b.y);
    for (let r = r0 - 1; r <= r0 + 1; r++) {
      const row = grid[r]; if (!row) continue;
      for (let c = c0 - 1; c <= c0 + 1; c++) {
        const br = row[c]; if (!br || br.dead) continue;
        const res = circlePoly(b.x, b.y, RAD, br.poly);
        if (!res) continue;
        b.x += res.nx * res.pen; b.y += res.ny * res.pen;
        const vn = b.vx * res.nx + b.vy * res.ny;
        if (vn < 0) {
          b.vx -= 2 * vn * res.nx; b.vy -= 2 * vn * res.ny; hit = br;
          if (live) damage(br, b.x - res.nx * RAD, b.y - res.ny * RAD);
        }
      }
    }
    if (hit && live) {
      const sp = Math.hypot(b.vx, b.vy), minVy = sp * .1;
      if (Math.abs(b.vy) < minVy) { b.vy = (b.vy <= 0 ? -1 : 1) * minVy; b.vx = Math.sign(b.vx || 1) * Math.sqrt(sp * sp - minVy * minVy); }
    }
    return hit;
  }
  function brickColor(b) { return hueFor(b.hp, round); }
  function damage(br, hx, hy) {
    if (br.dead) return;
    br.hp--; br.hit = 1;
    const hue = brickColor(br);
    const now = performance.now();
    if (br.hp <= 0) {
      br.dead = true; roundBreaks++;
      if (grid[br.r] && grid[br.r][br.c] === br) grid[br.r][br.c] = null;
      shatter(br, hue);
      shake = Math.min(shake + 2.5, 6);
      if (now - lastBreakSnd > 45) { lastBreakSnd = now; Sound.noise(.22, 5200, 2400, .1, 1.6); Sound.tone(rand(1500, 2100), .14, 'triangle', .06, -700); vibrate(12); }
      return;
    }
    if (hx != null) for (let i = 0; i < 3; i++) parts.push({ k: 'spark', x: hx, y: hy, vx: rand(-3, 3), vy: rand(-3, 3), life: .3, t: 0, hue });
    if (now - lastSnd > 28) { lastSnd = now; Sound.tone(900 + Math.min(br.hp, 60) * 12 + rand(-40, 40), .045, 'sine', .05); }
  }
  function shatter(br, hue) {
    const cx = br.c + .5, cy = br.r + .5;
    for (let i = 0; i < 16; i++) {
      const a = rand(0, TAU), sp = rand(1.5, 5.5);
      parts.push({ k: 'shard', x: cx + rand(-.35, .35), y: cy + rand(-.35, .35), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2.5,
        rot: rand(0, TAU), vr: rand(-12, 12), s: rand(.07, .2), life: rand(.6, 1.1), t: 0, hue: hue + rand(-15, 15), pts: [rand(0, 2), rand(2, 4), rand(4, 6)] });
    }
    for (let i = 0; i < 8; i++) parts.push({ k: 'spark', x: cx, y: cy, vx: rand(-6, 6), vy: rand(-6, 6), life: rand(.25, .5), t: 0, hue });
    parts.push({ k: 'ring', x: cx, y: cy, life: .4, t: 0, hue });
    if (parts.length > 600) parts.splice(0, parts.length - 600);
  }
  function fire() {
    if (state !== 'aim' || aim == null) return;
    const a = aim;
    state = 'fly'; queue = ballN; launchT = LAUNCH_GAP; flyT = 0; roundBreaks = 0; nextX = null; flying = []; timeScale = 1;
    fire.dir = [Math.cos(a), Math.sin(a)];
    aim = null; aimPath = null; hintShown = true; hideHint();
    Sound.whoosh(); vibrate(15);
  }
  function recall() {
    if (state !== 'fly') return;
    queue = 0; if (nextX == null) nextX = launchX;
    flying.forEach(b => { if (b.mode !== 'done') b.mode = 'recall'; });
    recallBtn.classList.remove('on'); Sound.whoosh(); vibrate(10);
  }
  function triggerLaser(p) {
    p.used = true; p.flash = 1;
    Sound.tone(1400, .18, 'sawtooth', .05, -900); Sound.tone(700, .2, 'square', .03, 400);
    const row = grid[p.r]; if (!row) return;
    row.slice().forEach(br => { if (br && !br.dead) damage(br, null, null); });
  }
  function collectPick(p, b) {
    const x = p.c + .5, y = p.r + .5;
    if (p.t === 'ball') {
      p.dead = true; pending++;
      for (let i = 0; i < 10; i++) { const a = i * TAU / 10; parts.push({ k: 'spark', x, y, vx: Math.cos(a) * 4, vy: Math.sin(a) * 4, life: .4, t: 0, hue: 150 }); }
      parts.push({ k: 'ring', x, y, life: .45, t: 0, hue: 150 });
      texts.push({ x, y, s: '+1', col: '#7CFFB2', t: 0 });
      Sound.pop(); vibrate(8);
    } else if (p.t === 'star') {
      p.dead = true; starsRun++; paintChips();
      for (let i = 0; i < 12; i++) { const a = i * TAU / 12; parts.push({ k: 'spark', x, y, vx: Math.cos(a) * 5, vy: Math.sin(a) * 5, life: .5, t: 0, hue: 48 }); }
      texts.push({ x, y, s: '⭐+1', col: '#FFD84A', t: 0 });
      Sound.star(); vibrate(10);
    } else if (p.t === 'laser') {
      if (b.lz !== p.id) { b.lz = p.id; triggerLaser(p); }
    }
  }

  function update(dt) {
    time += dt;
    for (const b of bricks) if (b.hit > 0) b.hit = Math.max(0, b.hit - dt * 6);
    for (const p of picks) if (p.flash > 0) p.flash = Math.max(0, p.flash - dt * 3.5);
    shake = Math.max(0, shake - dt * 20);

    if (state === 'fly') {
      flyT += dt;
      if (flyT > 2 && !recallBtn.classList.contains('on') && flying.some(b => b.mode === 'fly')) recallBtn.classList.add('on');
      if (flyT > 3 && !speedBtn.classList.contains('on')) speedBtn.classList.add('on');
      const sdt = dt * timeScale;
      // إطلاق الكرات
      launchT += sdt;
      while (queue > 0 && launchT >= LAUNCH_GAP) {
        launchT -= LAUNCH_GAP; queue--;
        flying.push({ x: launchX, y: R - RAD, vx: fire.dir[0] * SPEED, vy: fire.dir[1] * SPEED, mode: 'fly', lz: -1, age: 0 });
        const now = performance.now();
        if (now - lastLaunchSnd > 50) { lastLaunchSnd = now; Sound.tone(520 + rand(0, 80), .04, 'triangle', .05, 200); }
      }
      if (queue === 0) launchT = 0;
      const n = Math.max(1, Math.ceil(SPEED * sdt / .05)), h = sdt / n;
      for (const b of flying) {
        if (b.mode === 'fly') {
          b.age += sdt;
          for (let s = 0; s < n; s++) {
            b.x += b.vx * h; b.y += b.vy * h;
            collide(b, true);
            for (const p of picks) {
              if (p.dead) continue;
              const d = (b.x - p.c - .5) ** 2 + (b.y - p.r - .5) ** 2;
              if (d < (RAD + .26) ** 2) collectPick(p, b);
              else if (p.t === 'laser' && b.lz === p.id && d > (RAD + .32) ** 2) b.lz = -1;
            }
            if (b.y >= R - RAD && b.vy > 0) {
              b.y = R - RAD;
              if (nextX == null) { nextX = clamp(b.x, RAD + .05, COLS - RAD - .05); b.mode = 'done'; b.x = nextX; Sound.tone(300, .06, 'sine', .07); }
              else b.mode = 'gather';
              break;
            }
          }
        } else if (b.mode === 'gather') {
          const d = nextX - b.x, st = 16 * sdt;
          if (Math.abs(d) <= st) { b.x = nextX; b.mode = 'done'; } else b.x += Math.sign(d) * st;
        } else if (b.mode === 'recall') {
          const tx = nextX, ty = R - RAD, dx = tx - b.x, dy = ty - b.y, d = Math.hypot(dx, dy), st = 30 * sdt;
          if (d <= st) { b.x = tx; b.y = ty; b.mode = 'done'; } else { b.x += dx / d * st; b.y += dy / d * st; b.vx = dx / d * SPEED; b.vy = dy / d * SPEED; }
        }
      }
      if (queue === 0 && flying.every(b => b.mode === 'done')) endRound();
    } else if (state === 'shift') {
      shiftT += dt / .42;
      if (shiftT >= 1) { shiftT = 1; afterShift(); }
    } else if (state === 'over') {
      overT += dt;
    }
    // الجسيمات
    for (const p of parts) {
      p.t += dt;
      if (p.k === 'shard') { p.vy += 14 * dt; p.vx *= .99; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt; }
      else if (p.k === 'spark') { p.vx *= .92; p.vy *= .92; p.x += p.vx * dt; p.y += p.vy * dt; }
    }
    parts = parts.filter(p => p.t < p.life);
    for (const t of texts) t.t += dt;
    texts = texts.filter(t => t.t < 1.1);
  }
  function endRound() {
    state = 'shift'; shiftT = 0;
    speedBtn.classList.remove('on', 'act'); recallBtn.classList.remove('on'); timeScale = 1;
    if (roundBreaks >= 5) App.achieve('balls_combo');
    if (roundBreaks >= 5) { texts.push({ x: 3.5, y: R * .45, s: `💥 ${App.t(App.g('رائعة', 'رائع'), 'Great')}! ×${roundBreaks}`, col: '#FFB3E6', t: 0, big: 1 }); Sound.win(); }
    picks.forEach(p => { if (p.t === 'laser' && p.used) { p.dead = true; parts.push({ k: 'ring', x: p.c + .5, y: p.r + .5, life: .4, t: 0, hue: 340 }); } });
    launchX = nextX == null ? launchX : nextX;
    flying = [];
    round++; ballN += pending;
    if (pending) texts.push({ x: launchX, y: R - .8, s: `+${pending}`, col: '#7CFFB2', t: 0 });
    pending = 0;
    bricks = bricks.filter(b => !b.dead); picks = picks.filter(p => !p.dead);
    bricks.forEach(b => { b.r++; b.born = false; }); picks.forEach(p => { p.r++; p.born = false; });
    spawnRow(round, 1, true);
    Sound.slide();
  }
  function afterShift() {
    // التقاط ما وصل للأسفل من حلقات ونجوم
    picks.forEach(p => {
      if (p.r >= R - 1) {
        p.dead = true;
        if (p.t === 'ball') { ballN++; texts.push({ x: p.c + .5, y: p.r + .5, s: '+1', col: '#7CFFB2', t: 0 }); Sound.pop(); }
        if (p.t === 'star') { starsRun++; texts.push({ x: p.c + .5, y: p.r + .5, s: '⭐+1', col: '#FFD84A', t: 0 }); Sound.star(); }
      }
    });
    rebuild();
    if (bricks.some(b => b.r >= R - 1)) { gameOver(); return; }
    startAim();
  }
  function gameOver() {
    state = 'over'; overT = 0; shake = 8;
    Sound.lose(); vibrate(40);
    bricks.forEach(b => { if (b.r >= R - 1) b.hit = 1; });
    store.set('ballsSave', null);
    if (round > best()) store.set('ballsBest', round);
    const tens = Math.floor(round / 10), earned = starsRun + Math.max(0, tens - awardedTens);
    awardedTens = Math.max(awardedTens, tens); starsRun = 0;
    setTimeout(() => {
      if (state !== 'over') return;
      const rec = round > bestAtStart && round > 1;
      overRec = rec;
      q('.bo-rec').classList.toggle('on', rec);
      q('.boR').textContent = round;
      overText();
      q('.boB').textContent = best();
      q('.boS').textContent = earned;
      q('.boC').style.display = continued ? 'none' : '';
      overOv.classList.add('on');
      if (earned > 0) App.addStars(earned);
      if (rec) setTimeout(() => Sound.win(), 400);
      paintChips();
    }, 900);
  }
  function continueRun() {
    if (continued || state !== 'over') return;
    continued = true; overOv.classList.remove('on');
    bricks.forEach(b => { if (b.r >= R - 3 && !b.dead) { b.dead = true; shatter(b, brickColor(b)); } });
    Sound.boom(); shake = 6; vibrate(30);
    rebuild(); startAim();
  }

  /* ---------- الرسم ---------- */
  function render() {
    const c = ctx; if (!c) return;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.drawImage(bgCv, 0, 0, W, H);
    for (const s of twinkles) {
      const a = .25 + .55 * (.5 + .5 * Math.sin(time * s.v + s.p));
      c.fillStyle = `rgba(255,240,255,${a})`; c.beginPath(); c.arc(s.x, s.y, s.s, 0, TAU); c.fill();
    }
    c.save();
    if (shake > 0) c.translate(rand(-shake, shake) * .5, rand(-shake, shake) * .5);
    const sh = state === 'shift' ? 1 - easeBack(Math.min(1, shiftT)) : 0;
    const bornA = state === 'shift' ? ease(Math.min(1, shiftT)) : 1;
    // خطر قرب الأرضية
    const danger = state === 'aim' && bricks.some(b => !b.dead && b.r >= R - 2);
    if (danger || state === 'over') {
      const a = state === 'over' ? .35 : .12 + .1 * Math.sin(time * 6);
      const g = c.createLinearGradient(0, PY(R - 1.5), 0, PY(R));
      g.addColorStop(0, 'rgba(255,60,110,0)'); g.addColorStop(1, `rgba(255,60,110,${a})`);
      c.fillStyle = g; c.fillRect(PX(0), PY(R - 1.5), COLS * C, C * 1.5);
    }
    // العناصر
    for (const p of picks) {
      if (p.dead) continue;
      c.globalAlpha = p.born ? bornA : 1;
      drawPick(c, p, PX(p.c + .5), PY(p.r + .5 - sh));
    }
    c.globalAlpha = 1;
    for (const b of bricks) {
      if (b.dead) continue;
      c.globalAlpha = b.born ? bornA : 1;
      const sc = 1 - .08 * Math.sin(b.hit * Math.PI);
      const over = state === 'over' && b.r >= R - 1 ? .5 + .5 * Math.sin(overT * 14) : 0;
      drawGlass(c, PX(b.c + .5), PY(b.r + .5 - sh), C, brickColor(b), b.hp, b.tri, b.hp / b.max, Math.max(b.hit, over), b.seed, sc);
    }
    c.globalAlpha = 1;
    // أشعة الليزر
    for (const p of picks) if (p.flash > 0) {
      const y = PY(p.r + .5), g = c.createLinearGradient(0, y - C * .12, 0, y + C * .12);
      g.addColorStop(0, 'rgba(255,80,160,0)'); g.addColorStop(.5, `rgba(255,220,240,${p.flash})`); g.addColorStop(1, 'rgba(255,80,160,0)');
      c.fillStyle = g; c.fillRect(PX(0), y - C * .12, COLS * C, C * .24);
    }
    // دليل التصويب
    if (state === 'aim' && aimPath) drawAim(c);
    // الكرات
    drawBalls(c);
    // الجسيمات
    for (const p of parts) {
      const k = 1 - p.t / p.life, x = PX(p.x), y = PY(p.y);
      if (p.k === 'shard') {
        c.save(); c.translate(x, y); c.rotate(p.rot); c.globalAlpha = Math.min(1, k * 1.6);
        const s = p.s * C;
        c.beginPath(); c.moveTo(Math.cos(p.pts[0]) * s, Math.sin(p.pts[0]) * s); c.lineTo(Math.cos(p.pts[1]) * s, Math.sin(p.pts[1]) * s); c.lineTo(Math.cos(p.pts[2]) * s * .6, Math.sin(p.pts[2]) * s * .6); c.closePath();
        c.fillStyle = `hsla(${p.hue},95%,72%,.85)`; c.fill();
        c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1; c.stroke();
        c.restore();
      } else if (p.k === 'spark') {
        c.globalAlpha = k; c.fillStyle = `hsl(${p.hue},100%,82%)`;
        c.beginPath(); c.arc(x, y, C * .045 * (.5 + k), 0, TAU); c.fill();
      } else if (p.k === 'ring') {
        c.globalAlpha = k * .8; c.strokeStyle = `hsl(${p.hue},100%,85%)`; c.lineWidth = 2.5 * k + .5;
        c.beginPath(); c.arc(x, y, C * (.25 + .55 * (1 - k)), 0, TAU); c.stroke();
      }
    }
    c.globalAlpha = 1;
    // نصوص عائمة
    for (const t of texts) {
      const k = t.t / 1.1, y = PY(t.y) - k * C * (t.big ? .6 : 1);
      c.globalAlpha = k < .7 ? 1 : 1 - (k - .7) / .3;
      const sc = t.big ? Math.min(1, .5 + t.t * 4) : 1;
      c.font = `900 ${C * (t.big ? .62 : .42) * sc}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.lineWidth = 4; c.strokeStyle = 'rgba(30,8,60,.7)'; c.lineJoin = 'round';
      c.strokeText(t.s, PX(t.x), y); c.fillStyle = t.col; c.fillText(t.s, PX(t.x), y);
    }
    c.globalAlpha = 1;
    c.restore();
    drawLauncher(c);
  }
  function drawPick(c, p, x, y) {
    const pulse = 1 + .08 * Math.sin(time * 4 + p.ph);
    if (p.t === 'ball') {
      const r = C * .2 * pulse;
      c.strokeStyle = 'rgba(124,255,178,.22)'; c.lineWidth = C * .12; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
      c.strokeStyle = '#8CFFC0'; c.lineWidth = Math.max(2, C * .045); c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, C * .075, 0, TAU); c.fill();
    } else if (p.t === 'star') {
      const R0 = C * .22 * pulse;
      const g = c.createRadialGradient(x, y, 0, x, y, R0 * 1.8);
      g.addColorStop(0, 'rgba(255,216,74,.45)'); g.addColorStop(1, 'rgba(255,216,74,0)');
      c.fillStyle = g; c.beginPath(); c.arc(x, y, R0 * 1.8, 0, TAU); c.fill();
      const sg = c.createLinearGradient(x, y - R0, x, y + R0);
      sg.addColorStop(0, '#FFF6B0'); sg.addColorStop(1, '#F5A70E');
      starPath(c, x, y, R0, R0 * .48, -Math.PI / 2 + Math.sin(time * 2 + p.ph) * .25); c.fillStyle = sg; c.fill();
      c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 1.2; c.lineJoin = 'round'; c.stroke();
    } else if (p.t === 'laser') {
      const r = C * .22 * pulse;
      c.strokeStyle = 'rgba(255,92,160,.25)'; c.lineWidth = C * .12; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
      c.strokeStyle = p.used ? '#FFB3D9' : '#FF5CA8'; c.lineWidth = Math.max(2, C * .045); c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
      c.strokeStyle = '#fff'; c.lineWidth = Math.max(1.5, C * .035); c.lineCap = 'round';
      const a = r * .62;
      c.beginPath(); c.moveTo(x - a, y); c.lineTo(x + a, y);
      c.moveTo(x - a + a * .4, y - a * .4); c.lineTo(x - a, y); c.lineTo(x - a + a * .4, y + a * .4);
      c.moveTo(x + a - a * .4, y - a * .4); c.lineTo(x + a, y); c.lineTo(x + a - a * .4, y + a * .4); c.stroke();
      c.lineCap = 'butt';
    }
  }
  function drawAim(c) {
    const pts = aimPath.pts;
    let first = true;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i], k = i / pts.length;
      const a = p[2] ? .5 * (1 - k) + .1 : .9 - k * .35;
      c.fillStyle = `rgba(255,255,255,${a})`;
      c.beginPath(); c.arc(PX(p[0]), PY(p[1]), C * (p[2] ? .045 : .06), 0, TAU); c.fill();
      if (p[2] && first) {
        first = false;
        c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 1.5; c.setLineDash([3, 3]);
        c.beginPath(); c.arc(PX(p[0]), PY(p[1]), RAD * C, 0, TAU); c.stroke(); c.setLineDash([]);
      }
    }
  }
  function drawBalls(c) {
    if (!flying.length) return;
    const tr = (SKINS[skin] || SKINS.ball_white).trail;
    c.save();
    c.beginPath(); c.rect(PX(0), PY(0), COLS * C, R * C + 2); c.clip();
    c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
    const k = .045 / Math.max(1, timeScale * .8);
    for (let i = 0; i < flying.length; i++) {
      const b = flying[i]; if (b.mode !== 'fly' && b.mode !== 'recall') continue;
      const col = tr || `${hslRgb((time * 200 + i * 25) % 360)}`;
      const x = PX(b.x), y = PY(b.y), tx = PX(b.x - b.vx * k), ty = PY(b.y - b.vy * k);
      c.strokeStyle = `rgba(${col},.16)`; c.lineWidth = RAD * C * 2.2;
      c.beginPath(); c.moveTo(x, y); c.lineTo(tx, ty); c.stroke();
      c.strokeStyle = `rgba(${col},.28)`; c.lineWidth = RAD * C * 1.1;
      c.beginPath(); c.moveTo(x, y); c.lineTo((x + tx) / 2, (y + ty) / 2); c.stroke();
    }
    c.restore();
    const S = spriteS;
    for (const b of flying) {
      if (b.mode === 'done') continue;
      c.drawImage(sprite, PX(b.x) - S / 2, PY(b.y) - S / 2, S, S);
    }
  }
  const hslRgb = h => { const f = n => { const k = (n + h / 30) % 12; return Math.round(255 * (.5 - .5 * Math.max(-1, Math.min(k - 3, 9 - k, 1)))); }; return `${f(0)},${f(8)},${f(4)}`; };
  function drawLauncher(c) {
    const S = spriteS, fy = PY(R);
    const spot = (gx, n, alpha) => {
      const x = PX(gx), y = PY(R - RAD);
      c.globalAlpha = alpha;
      const g = c.createRadialGradient(x, y, 0, x, y, C * .55);
      g.addColorStop(0, 'rgba(255,170,230,.35)'); g.addColorStop(1, 'rgba(255,170,230,0)');
      c.fillStyle = g; c.beginPath(); c.arc(x, y, C * .55, 0, TAU); c.fill();
      c.drawImage(sprite, x - S / 2, y - S / 2, S, S);
      if (n > 0) {
        c.font = `800 ${Math.max(14, C * .3)}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'top';
        c.fillStyle = 'rgba(255,255,255,.95)'; c.fillText('×' + n, x, fy + 6);
      }
      c.globalAlpha = 1;
    };
    if (state === 'aim' || state === 'over') spot(launchX, ballN, 1);
    else if (state === 'shift') spot(launchX, ballN, 1);
    else if (state === 'fly') {
      if (queue > 0) spot(launchX, queue, 1);
      if (nextX != null) { const d = flying.filter(b => b.mode === 'done').length; if (d) spot(nextX, d, 1); }
      if (pending) {
        c.font = `800 ${Math.max(12, C * .26)}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'top';
        c.fillStyle = '#8CFFC0'; c.fillText('+' + pending + ' ⚪', PX(3.5), fy + 30 + C * .05);
      }
    }
  }

  /* ---------- الحلقة ---------- */
  function frame(t) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(.033, (t - last) / 1000 || 0); last = t;
    if (!paused && !document.hidden) update(dt);
    render();
  }
  function start() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  /* ---------- الإدخال ---------- */
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused || state !== 'aim') return;
    dragging = true; try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    setAim(aimFromPointer(e.clientX, e.clientY));
  });
  cv.addEventListener('pointermove', e => { if (dragging && state === 'aim') setAim(aimFromPointer(e.clientX, e.clientY)); });
  const up = e => {
    if (!dragging) return; dragging = false;
    if (state !== 'aim' || paused) return;
    setAim(aimFromPointer(e.clientX, e.clientY));
    if (aim != null) fire();
  };
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', () => { dragging = false; aim = null; aimPath = null; });
  speedBtn.onclick = () => {
    if (state !== 'fly') return;
    timeScale = timeScale > 1 ? 1 : 2; speedBtn.classList.toggle('act', timeScale > 1); Sound.tap();
  };
  recallBtn.onclick = () => recall();
  q('.pz').onclick = () => { if (state === 'over') return; Sound.tap(); openPause(); };
  q('.pzGo').onclick = () => { Sound.tap(); closePause(); };
  q('.pzNew').onclick = () => { Sound.tap(); closePause(); store.set('ballsSave', null); newGame(); };
  q('.boA').onclick = () => { Sound.tap(); overOv.classList.remove('on'); newGame(); };
  q('.boC').onclick = () => { Sound.tap(); continueRun(); };
  function openPause() {
    userPaused = true; paused = true;
    q('.pzTxt').textContent = pauseText();
    pauseOv.classList.add('on');
  }
  function closePause() { userPaused = false; paused = false; pauseOv.classList.remove('on'); }
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (pauseOv.classList.contains('on')) { if (e.key === 'Enter' || e.key === ' ' || e.key === 'p') { e.preventDefault(); closePause(); } return; }
    if (overOv.classList.contains('on')) { if (e.key === 'Enter') { e.preventDefault(); q('.boA').click(); } return; }
    if (e.key === 'p' || e.key === 'P') { openPause(); return; }
    if (state === 'aim') {
      const st = e.shiftKey ? .08 : .025;
      if (e.key === 'ArrowLeft') { e.preventDefault(); kbAng = clamp(kbAng - st, -Math.PI + MIN_ANG, -MIN_ANG); setAim(kbAng); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); kbAng = clamp(kbAng + st, -Math.PI + MIN_ANG, -MIN_ANG); setAim(kbAng); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); kbAng = -Math.PI / 2; setAim(kbAng); }
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (aim == null) setAim(kbAng); else fire(); }
    } else if (state === 'fly') {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (speedBtn.classList.contains('on')) speedBtn.click(); }
      else if (e.key === 'Backspace' || e.key === 'r') { e.preventDefault(); recall(); }
    }
  });
  window.addEventListener('resize', () => { if (App.current === ID && running) { layout(false); rebuild(); if (aim != null) aimPath = traceAim(aim); } });

  /* ------------------------------------------------------------------
     التسجيل
     ------------------------------------------------------------------ */
  App.register({
    id: ID, title: 'مطر الكرات', titleEn: 'Ball Rain', icon2: '⚪', isNew: false,
    desc: () => App.g('صوّبي الكرات واكسري المربعات الزجاجية', 'صوّب الكرات واكسر المربعات الزجاجية'),
    descEn: () => 'Aim the balls and smash the glass blocks',
    helpEn: () => [
      '🎯 Drag your finger to choose the direction, then let go and all the balls fly',
      '🧱 Every hit lowers the block\'s number, and at zero it shatters like glass!',
      '⚪ Collect the green rings to get more balls, and the stars ⭐ to win stars',
      '⏩ The speed-up button and ↩️ the call-back button appear during a shot',
      '⚠️ If a block reaches the bottom the game ends. Change your ball in the shop 🛍️'
    ],
    music: 'balls',
    help: () => [
      `🎯 ${App.g('اسحبي', 'اسحب')} إصبعك لتحديد الاتجاه، ثم ${App.g('اتركيه', 'اتركه')} لتنطلق كل الكرات`,
      '🧱 كل ضربة تُنقص رقم المربع، وعند الصفر يتكسّر كالزجاج!',
      `⚪ ${App.g('اجمعي', 'اجمع')} الحلقات الخضراء لتزيد كراتك، والنجوم ⭐ لتربح نجومًا`,
      '⏩ زر التسريع و↩️ زر إرجاع الكرات يظهران أثناء الرمية',
      `⚠️ إذا وصل مربع إلى الأسفل تنتهي اللعبة، ${App.g('غيّري', 'غيّر')} شكل كرتك من المتجر 🛍️`
    ],
    icon(c, s) {
      IK.bg(c, s, ['#9E7BFF', '#5631C9', '#22105E'], { rays: .07, seed: 10 });
      const lx = s * .5, ly = s * .82;
      IK.sticker(c, s, c => {
        const cs = s * .22;
        [[.27, .22, 3, 330, -1], [.5, .22, 12, 280, -1], [.73, .22, 7, 300, 3], [.385, .44, 5, 312, -1], [.615, .44, 24, 200, -1]].forEach(([x, y, n, hue, tri]) =>
          drawGlass(c, s * x, s * y, cs, hue, n, tri, n === 12 ? .5 : 1, 0, 7));
      }, { line: 3.5, shadow: 'rgba(0,0,0,.45)' });
      c.fillStyle = 'rgba(255,255,255,.7)';
      [-.95, -.5, 0, .5, .95].forEach(d => {
        const a = -Math.PI / 2 + d * .55;
        for (let k = 1; k <= 3; k++) { c.beginPath(); c.arc(lx + Math.cos(a) * k * s * .055, ly + Math.sin(a) * k * s * .055, 1.5, 0, TAU); c.fill(); }
      });
      const g = c.createRadialGradient(lx, ly, 0, lx, ly, s * .14);
      g.addColorStop(0, 'rgba(255,190,240,.8)'); g.addColorStop(1, 'rgba(255,170,230,0)');
      c.fillStyle = g; c.beginPath(); c.arc(lx, ly, s * .14, 0, TAU); c.fill();
      IK.sticker(c, s, c => {
        [-.95, -.5, 0, .5, .95].forEach(d => { const a = -Math.PI / 2 + d * .55; drawSkin(c, App.equipped('ball') || 'ball_white', lx + Math.cos(a) * s * .25, ly + Math.sin(a) * s * .25, s * .045); });
        drawSkin(c, App.equipped('ball') || 'ball_white', lx, ly, s * .065);
      }, { line: 2.5, shadow: 'rgba(0,0,0,.4)' });
    },
    best() { const b = store.get('ballsBest', 0); return b > 0 ? App.t('🏆 أفضل جولة: ', '🏆 Best round: ') + b : ''; },
    onLang() {
      i18n(); hintEl.querySelector('span').textContent = hintText();
      if (overOv.classList.contains('on')) overText();
      if (pauseOv.classList.contains('on')) q('.pzTxt').textContent = pauseText();
    },
    enter() {
      i18n();
      skin = App.equipped('ball') || 'ball_white';
      if (!App.owns(skin)) skin = 'ball_white';
      paused = false; userPaused = false; pauseOv.classList.remove('on'); overOv.classList.remove('on');
      hintShown = false; hideHint();
      if (!load()) newGame();
      start();
    },
    leave() {
      stop(); dragging = false;
      if (state === 'aim') save();
    },
    pause() { paused = true; },
    resume() { if (!userPaused) paused = false; },
    back() {
      if (pauseOv.classList.contains('on')) { closePause(); return true; }
      return false;
    }
  });
})();
