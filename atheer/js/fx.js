/* =====================================================================
   FX — الحركات السينمائية والمؤثرات (GSAP) لكل التطبيق
   ---------------------------------------------------------------------
   يُحمَّل بعد core.js. كل شيء هنا اختياري: إن غاب GSAP أو طلب الجهاز
   تقليل الحركة فكل الدوال تعمل بلا أثر (no-op) ويبقى التطبيق كما هو.
   نحرّك transform و opacity فقط، والجسيمات على كانفاس واحد لا يلتقط اللمس.

   واجهة الألعاب (window.FX):
     FX.snap(el)                 نجاح: قفزة مطاطية + شرر
     FX.nope(el)                 خطأ: هزّة رأس
     FX.burst(x, y, opts)        شرر من نقطة — opts: {n, colors, chars, power}
     FX.flyStars(fromEl, n)      نجوم تطير بمنحنى إلى عدّاد النجوم
     FX.confetti(opts)           قصاصات ملوّنة تسقط وتستقر ثم تختفي
     FX.heavy                    هل المؤثرات الثقيلة مفعّلة الآن؟
   أحداث على window: 'fx:win' {overlay, stars} ، 'fx:open' {id} ، 'fx:back' {id}
   ===================================================================== */
(function () {
  'use strict';
  const noop = () => {}, no = () => false;
  const G = window.gsap;
  const FX = window.FX = {
    ok: !!G, low: false, on: false, heavy: false,
    snap: noop, nope: noop, burst: noop, flyStars: noop, confetti: noop, sparks: noop, roll: noop,
    heroOpen: no, heroBack: () => null, overlayIn: no, starsEarned: no, medal: no, kidWave: no, levelWipe: no
  };
  if (!G || typeof Fx === 'undefined' || typeof App === 'undefined') return;

  const D = document, H = D.documentElement;
  const R = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[(Math.random() * a.length) | 0];
  const emit = (name, detail) => { try { window.dispatchEvent(new CustomEvent(name, { detail })); } catch (e) {} };
  const tone = (...a) => { try { Sound.tone(...a); } catch (e) {} };
  const buzz = ms => { try { vibrate(ms); } catch (e) {} };

  /* أجهزة ضعيفة: نبدأ بمؤثرات أخف */
  try { if ((navigator.hardwareConcurrency || 4) <= 2 || (navigator.deviceMemory || 4) <= 1) FX.low = true; } catch (e) {}

  /* on = الحركة مسموحة ؛ heavy = والمؤثرات الثقيلة أيضًا (إعداد «حركات أقل» يطفئها) */
  Object.defineProperty(FX, 'on', { get: () => !!Fx.on });
  Object.defineProperty(FX, 'heavy', { get: () => !!Fx.on && !gstore.get('lessmo', false) });

  /* ------------------------------------------------------------------ CSS */
  const css = D.createElement('style');
  css.textContent = `
#fxHero,#fxHeroIc,#fxWave,#fxWipe{position:fixed;left:0;top:0;pointer-events:none;visibility:hidden;will-change:transform,opacity}
#fxHero{z-index:85;transform-origin:50% 50%}
#fxHeroIc{z-index:86;border-radius:26%;box-shadow:0 0 0 4px #fff,0 10px 24px rgba(0,0,0,.22)}
#fxWave{z-index:87;width:200px;height:200px;border-radius:50%}
#fxWipe{z-index:88;inset:0;display:grid;place-items:center;overflow:hidden}
#fxWipe b{font-size:min(22vw,110px);line-height:1;white-space:nowrap;filter:drop-shadow(0 6px 0 rgba(0,0,0,.18))}
#fxCv{position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:96}
#fxTop{position:fixed;left:0;right:0;top:max(64px,calc(env(safe-area-inset-top) + 54px));z-index:91;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none}
.fxpill{display:flex;align-items:center;gap:6px;background:linear-gradient(180deg,#FFF8DC,#FFEBA6);border:3px solid #FFF6CF;color:#9A5A00;border-radius:99px;padding:3px 16px 3px 12px;
  font-weight:900;font-size:20px;box-shadow:0 5px 0 #F2C14E,0 9px 16px rgba(232,155,12,.3);visibility:hidden}
.fxpill i{font-style:normal;font-size:22px}.fxpill small{font-size:13px;opacity:.75;font-weight:800}
.fxmedal{position:relative;display:flex;align-items:center;gap:10px;overflow:hidden;max-width:min(92vw,360px);padding:7px 18px 7px 8px;border-radius:99px;visibility:hidden;
  background:linear-gradient(180deg,#FFF9D6 0%,#FFE07A 48%,#F7B92B 100%);border:3px solid #FFF5BF;color:#7A4300;box-shadow:0 5px 0 #C98A00,0 12px 22px rgba(160,100,0,.35)}
html[dir=rtl] .fxmedal{padding:7px 8px 7px 18px}
.fxm-coin{flex:0 0 52px;width:52px;height:52px;border-radius:50%;display:grid;place-items:center;font-size:27px;
  background:radial-gradient(circle at 35% 30%,#FFFBE0 0,#FFD84D 45%,#E79A00 100%);box-shadow:inset 0 0 0 3px #FFF1A8,inset 0 0 0 5px #D99300,0 3px 0 #B87400}
.fxm-t{display:flex;flex-direction:column;line-height:1.15;text-align:start;min-width:0}
.fxm-t small{font-size:12px;font-weight:800;opacity:.8}.fxm-t b{font-size:17px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fxm-sh{position:absolute;top:-20%;bottom:-20%;left:0;width:34%;background:linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.85),rgba(255,255,255,0));pointer-events:none}
#fxl i.fxs{line-height:1;will-change:transform}
#fxl i.fxg{font-style:normal;white-space:nowrap;line-height:1;margin:0}
.screen.fx-leave{display:flex!important;z-index:84;pointer-events:none;overflow:hidden;will-change:transform,opacity}
html.gs .chip b,html.gs #mStarsN{display:inline-block}
`;
  D.head.appendChild(css);

  const made = {};
  function layer(id, tag, cls) {
    let e = made[id]; if (e && e.isConnected) return e;
    e = D.createElement(tag || 'div'); e.id = id; if (cls) e.className = cls; e.setAttribute('aria-hidden', 'true');
    D.body.appendChild(e); made[id] = e; return e;
  }
  const fxl = () => D.getElementById('fxl') || layer('fxl');

  /* آخر موضع لمس (مصدر النجوم إن لم يُحدَّد غيره) */
  const last = { x: innerWidth / 2, y: innerHeight * .6, t: 0, down: false, trail: false, sx: 0, sy: 0 };
  const center = el => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; };

  /* ================================================================
     1) كانفاس الجسيمات: شرر (تكامل يدوي) + قصاصات (Physics2DPlugin)
     ================================================================ */
  const P = []; let cv = null, ctx = null, dpr = 1, running = false, ema = 16, frames = 0;
  const COLORS = ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9'];
  const GOLD = ['#FFD84D', '#FFF3B0', '#FFFFFF', '#FFB3D9'];
  function fit() {
    if (!cv) return;
    dpr = FX.low ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
    cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr);
  }
  function start() {
    if (!cv) { cv = layer('fxCv', 'canvas'); ctx = cv.getContext('2d'); fit(); window.addEventListener('resize', fit); }
    if (!running) { running = true; ema = 16; frames = 0; G.ticker.add(draw); }
  }
  function draw(time, dt) {
    const d = Math.min(dt, 50) / 1000;
    ema = ema * .92 + dt * .08; frames++;
    /* إن هبط معدّل الإطارات نطفئ الذيل والشرر لبقية الجلسة */
    if (!FX.low && frames > 50 && ema > 30) { FX.low = true; for (const p of P) if (p.k) p.dead = 1; }
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    let n = 0;
    for (let i = 0; i < P.length; i++) {
      const p = P[i]; if (p.dead) continue;
      if (p.k) { // شرارة نجمية
        p.age += d; if (p.age >= p.life) { p.dead = 1; continue; }
        p.x += p.vx * d; p.y += p.vy * d; p.vy += p.g * d; p.r += p.vr * d;
        const q = 1 - p.age / p.life, s = p.s * (.35 + .65 * q) * dpr, c = Math.cos(p.r), sn = Math.sin(p.r);
        ctx.setTransform(c, sn, -sn, c, p.x * dpr, p.y * dpr);
        ctx.globalAlpha = Math.min(1, q * 1.6); ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.moveTo(0, -s); ctx.quadraticCurveTo(0, 0, s, 0); ctx.quadraticCurveTo(0, 0, 0, s); ctx.quadraticCurveTo(0, 0, -s, 0); ctx.quadraticCurveTo(0, 0, 0, -s); ctx.fill();
      } else { // قصاصة
        const a = p.grp.a; if (a <= 0) { p.dead = 1; continue; }
        if (!p.landed) { p.r += p.vr * d; p.fl += p.fs * d; }
        const sy = p.landed ? .4 : Math.cos(p.fl), c = Math.cos(p.r) * dpr, sn = Math.sin(p.r) * dpr;
        ctx.setTransform(c, sn, -sn * sy, c * sy, p.x * dpr, p.y * dpr);
        ctx.globalAlpha = a; ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      P[n++] = p;
    }
    P.length = n; ctx.globalAlpha = 1;
    if (!n) { running = false; G.ticker.remove(draw); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); }
  }
  let nSpark = 0;
  /** شرر نجمي من نقطة (على الكانفاس) */
  function sparks(x, y, n, o) {
    if (!FX.on) return;
    o = o || {}; n = Math.min(n || 8, FX.low ? 6 : 24);
    nSpark = 0; for (const p of P) if (p.k && !p.dead) nSpark++;
    if (nSpark > 90) return;
    const pw = o.power || 1, cols = o.colors || GOLD;
    for (let i = 0; i < n; i++) {
      const a = R(0, Math.PI * 2), v = R(60, 260) * pw;
      P.push({ k: 1, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60 * pw, g: o.g == null ? 420 : o.g, r: R(0, 3), vr: R(-6, 6), s: R(4, 9) * (o.size || 1), life: R(.45, .85) * (o.life || 1), age: 0, c: cols[i % cols.length] });
    }
    start();
  }
  FX.sparks = sparks;
  /** FX.burst(x, y, {n, colors, chars, power}) — إن أُعطيت chars تطير إيموجي (DOM) وإلا شرر كانفاس */
  FX.burst = function (x, y, o) {
    if (!FX.on) return;
    if (typeof o === 'number') o = { n: o };
    o = o || {};
    if (o.chars && o.chars.length) Fx.burst(x, y, Math.min(o.n || 8, 12), o.chars);
    else sparks(x, y, o.n || 10, o);
  };
  /** قصاصات: تنطلق بفيزياء Physics2D، تهبط وتستقر على أرض الشاشة ثم تبهت */
  FX.confetti = function (o) {
    if (!FX.heavy || !window.Physics2DPlugin) return;
    o = o || {};
    const vw = innerWidth, vh = innerHeight, n = Math.min(o.n || (FX.low ? 26 : 60), 80), grav = 1300, grp = { a: 1 };
    const ox = o.x == null ? vw / 2 : o.x, oy = o.y == null ? vh * .34 : o.y;
    let maxT = 0;
    for (let i = 0; i < n; i++) {
      const ang = R(205, 335), v = R(280, 760), vy = v * Math.sin(ang * Math.PI / 180), floor = vh - R(5, 30);
      const p = { k: 0, x: ox + R(-30, 30), y: oy + R(-10, 10), w: R(7, 12), h: R(5, 9), c: COLORS[i % COLORS.length], r: R(0, 6), vr: R(-9, 9), fl: R(0, 6), fs: R(5, 11), landed: false, grp };
      const t = (-vy + Math.sqrt(vy * vy + 2 * grav * (floor - p.y))) / grav; // لحظة ملامسة الأرض
      maxT = Math.max(maxT, t);
      P.push(p);
      G.to(p, { duration: t, ease: 'none', physics2D: { velocity: v, angle: ang, gravity: grav }, onComplete: () => { p.landed = true; p.r = R(-.3, .3); } });
    }
    start();
    G.to(grp, { a: 0, duration: .7, delay: maxT + .9, ease: 'power1.in' });
  };

  /* ================================================================
     2) اللمسات الصغيرة: ضغط مطاطي + تكّة + ذيل شرر
     ================================================================ */
  const PRESS = '.btn,.ib,.tb,.tbtn,button.chip,.chip[role=button],.kchip,.seg button';
  let pressed = null, lastTick = 0;
  function tick() {
    const t = performance.now(); if (t - lastTick < 70) return; lastTick = t;
    tone(1250, .035, 'triangle', .045, -500); buzz(6);
  }
  function release() {
    const el = pressed; if (!el) return; pressed = null;
    const b = el.classList.contains('autonext') ? 1.18 : 1;
    G.to(el, { scaleX: b, scaleY: b, y: 0, duration: Fx.reduce ? 0 : .5, ease: 'elastic.out(1,0.42)', overwrite: 'auto', clearProps: 'transform' });
  }
  window.addEventListener('pointerdown', e => {
    last.x = e.clientX; last.y = e.clientY; last.t = performance.now(); last.down = true; last.sx = e.clientX; last.sy = e.clientY;
    const t = e.target, isEl = t && t.closest;
    /* الذيل: على القائمة وأسطح DOM فقط — لا فوق كانفاس الألعاب */
    last.trail = FX.heavy && !FX.low && isEl && !(t.tagName === 'CANVAS' && !t.closest('#menu'));
    if (!isEl || !Fx.ok) return;
    const el = t.closest(PRESS), card = !el && t.closest('#cards .card');
    if (card) { tick(); return; }
    if (!el || el.disabled) return;
    tick();
    if (!Fx.on) return;
    release(); pressed = el;
    G.to(el, { scaleX: 1.07, scaleY: .9, y: 3, duration: .09, ease: 'power2.out', overwrite: 'auto' });
  }, { capture: true, passive: true });
  ['pointerup', 'pointercancel'].forEach(t => window.addEventListener(t, e => {
    last.down = false; if (t === 'pointerup') { last.x = e.clientX; last.y = e.clientY; last.t = performance.now(); }
    release();
  }, { capture: true, passive: true }));
  window.addEventListener('pointermove', e => {
    if (!last.down || !last.trail) return;
    const dx = e.clientX - last.sx, dy = e.clientY - last.sy;
    if (dx * dx + dy * dy < 196) return;
    last.sx = e.clientX; last.sy = e.clientY;
    if (FX.low || !FX.heavy) { last.trail = false; return; }
    let c = 0; for (const p of P) if (p.k && !p.dead) c++;
    if (c > 40) return;
    P.push({ k: 1, x: e.clientX + R(-5, 5), y: e.clientY + R(-5, 5), vx: R(-25, 25), vy: R(-15, 35), g: 90, r: R(0, 3), vr: R(-5, 5), s: R(3.5, 7.5), life: R(.35, .6), age: 0, c: pick(GOLD) });
    start();
  }, { passive: true });

  /** نجاح: قفزة مطاطية وشرر */
  FX.snap = function (el, o) {
    if (!FX.on || !el) return;
    G.fromTo(el, { scale: 1.22 }, { scale: 1, duration: .55, ease: 'elastic.out(1.1,0.4)', overwrite: 'auto', clearProps: 'transform' });
    if (!(o && o.quiet)) { const c = center(el); sparks(c.x, c.y, 8, { power: .8 }); }
  };
  /** خطأ: هزّة رأس «لا لا» */
  FX.nope = function (el) {
    if (!FX.on || !el) return;
    G.fromTo(el, { x: 0, rotation: 0 }, { keyframes: { x: [0, -10, 9, -7, 5, -2, 0], rotation: [0, -3, 3, -2, 1, 0, 0] }, duration: .45, ease: 'power1.inOut', overwrite: 'auto', clearProps: 'transform' });
  };

  /* ================================================================
     3) عدّادات ميكانيكية: الرقم القديم ينزلق خارجًا والجديد يدخل مكانه
     ================================================================ */
  const ROLL = '.chip b,#mStarsN,[data-roll]';
  const toInt = s => { if (s == null) return null; s = String(s).trim().replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)); return /^-?\d{1,7}$/.test(s) ? +s : null; };
  function roll(el, oldText) {
    const now = el.textContent;
    if (el._fxW === now) return;              // كتابتنا نحن
    const a = toInt(oldText), b = toInt(now);
    if (a == null || b == null || a === b || !el.offsetParent || el.closest('[data-noroll]')) return;
    const t = performance.now(), fast = t - (el._fxRt || 0) < 160; el._fxRt = t; if (fast) return;
    const up = b > a, r = el.getBoundingClientRect(); if (!r.width || r.bottom < 0 || r.top > innerHeight) return;
    const cs = getComputedStyle(el), g = D.createElement('i');
    g.className = 'fxg'; g.textContent = oldText; g.style.font = cs.font; g.style.color = cs.color; g.style.width = r.width + 'px'; g.style.textAlign = 'center';
    fxl().appendChild(g);
    G.fromTo(g, { x: r.left, y: r.top, autoAlpha: 1 }, { y: r.top + (up ? -.75 : .75) * r.height, autoAlpha: 0, duration: .26, ease: 'power2.in', onComplete: () => g.remove() });
    G.fromTo(el, { yPercent: up ? 75 : -75, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .36, ease: 'back.out(2.2)', overwrite: true, clearProps: 'transform,opacity' });
  }
  FX.roll = (el, oldText) => { if (FX.heavy && el) roll(el, oldText); };
  if (window.MutationObserver) {
    new MutationObserver(recs => {
      if (!FX.heavy) return;
      let seen = null;
      for (const r of recs) {
        const el = r.target.nodeType === 3 ? r.target.parentElement : r.target;
        if (!el || !el.matches || !el.matches(ROLL) || (seen && seen.has(el))) continue;
        (seen || (seen = new Set())).add(el);
        const old = r.type === 'characterData' ? r.oldValue : (r.removedNodes[0] && r.removedNodes[0].nodeValue);
        roll(el, old);
      }
    }).observe(D.body, { subtree: true, childList: true, characterData: true, characterDataOldValue: true });
  }

  /* ================================================================
     4) النجوم المكتسبة: تطير بمنحنى (MotionPath) إلى العدّاد فيقفز ويعدّ
     ================================================================ */
  const pill = { el: null, b: null, s: null, shown: false, hide: null };
  const cnt = { v: null, to: 0 };   // القيمة المعروضة أثناء العدّ
  function sheetOn() { const w = D.getElementById('sheetWrap'); return !!w && w.classList.contains('on'); }
  /** العدّاد الهدف: عدّاد القائمة إن كان ظاهرًا، وإلا كبسولة مؤقتة أعلى الشاشة */
  function counter() {
    const real = D.getElementById('mStars');
    if (App.current === 'menu' && !sheetOn() && real && real.offsetParent && real.getBoundingClientRect().bottom > 0) return { el: real, num: D.getElementById('mStarsN'), real: true };
    if (!pill.el) {
      pill.el = D.createElement('div'); pill.el.className = 'fxpill'; pill.el.dataset.noroll = '1';
      pill.el.innerHTML = '<i>⭐</i><b></b><small></small>'; pill.b = pill.el.children[1]; pill.s = pill.el.children[2];
    }
    const top = layer('fxTop'); if (pill.el.parentNode !== top) top.appendChild(pill.el);
    if (!pill.shown) {
      pill.shown = true; pill.b.textContent = cnt.v != null ? cnt.v : App.stars();
      G.killTweensOf(pill.el);
      G.fromTo(pill.el, { y: -26, scale: .6, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: .35, ease: 'back.out(2)' });
    }
    if (pill.hide) pill.hide.kill();
    pill.hide = G.delayedCall(2.6, () => G.to(pill.el, { y: -14, autoAlpha: 0, duration: .3, ease: 'power1.in', onComplete: () => { pill.shown = false; pill.s.textContent = ''; } }));
    return { el: pill.el, num: pill.b, real: false };
  }
  function write(num, v) { if (!num) return; const s = String(v); num._fxW = s; num.textContent = s; }
  function bump(el) { G.fromTo(el, { scale: 1.22 }, { scale: 1, duration: .45, ease: 'elastic.out(1,0.4)', overwrite: 'auto', clearProps: el === pill.el ? '' : 'transform' }); }
  function srcPoint(from) {
    if (from && from.getBoundingClientRect && from.isConnected) { const c = center(from); if (c.w || c.h) return c; }
    if (from && typeof from.x === 'number') return from;
    if (performance.now() - last.t < 4000) return { x: last.x, y: last.y };
    return { x: innerWidth / 2, y: innerHeight * .55 };
  }
  /** يطير k نجمة من from إلى العدّاد؛ onHit(i, k) عند وصول كل واحدة */
  function fly(from, k, o) {
    o = o || {};
    const C = counter(), s = srcPoint(from), t = center(C.el.firstElementChild && !C.real ? C.el.firstElementChild : C.el);
    const dx = t.x - s.x, dy = t.y - s.y, len = Math.hypot(dx, dy) || 1, L = fxl();
    const tl = G.timeline({ delay: o.delay || 0 });
    for (let i = 0; i < k; i++) {
      const e = D.createElement('i'); e.className = 'fxs'; e.textContent = '⭐'; L.appendChild(e);
      const side = (i % 2 ? 1 : -1) * R(.18, .42) * len, mx = s.x + dx * .45 - dy / len * side, my = s.y + dy * .45 + dx / len * side;
      G.set(e, { x: s.x - 11, y: s.y - 12, scale: .3, autoAlpha: 0 });
      tl.to(e, { autoAlpha: 1, scale: 1.15, duration: .16, ease: 'back.out(3)' }, i * .09)
        .to(e, { motionPath: { path: [{ x: mx - 11, y: my - 12 }, { x: t.x - 11, y: t.y - 12 }], curviness: 1.5 }, rotation: R(-240, 240), scale: .7, duration: .55, ease: 'power2.in',
          onComplete: () => { e.remove(); bump(C.el); tone(1175 + i * 90, .07, 'sine', .07); if (o.onHit) o.onHit(i, k, C); } }, i * .09 + .12);
    }
    return C;
  }
  FX.flyStars = function (fromEl, n, o) {
    if (!FX.heavy || !window.MotionPathPlugin) return;
    fly(fromEl, Math.max(1, Math.min(n || 3, FX.low ? 3 : 7)), o);
  };
  let srcHint = null, srcHintT = 0;
  /** يستدعيه App.addStars: يعيد true إن تولّى العرض (بدل التوست) */
  FX.starsEarned = function (n, why) {
    if (!FX.heavy || !window.MotionPathPlugin || !(n > 0)) return false;
    const total = App.stars();
    if (cnt.v == null) cnt.v = total - n;
    cnt.to = total;
    const win = D.querySelector('.screen.on .overlay.on .stars3');
    const hinted = srcHint && performance.now() - srcHintT < 600 ? srcHint : null;
    const from = hinted || win || D.getElementById('dStar') || null;
    pill.sum = (pill.shown ? pill.sum || 0 : 0) + n;
    const C = counter();
    write(C.num, cnt.v);
    if (!C.real && pill.s) pill.s.textContent = '+' + pill.sum + (why ? ' ' + why : '');
    const k = Math.max(1, Math.min(n, FX.low ? 3 : 6)), step = Math.ceil(n / k);
    fly(from, k, {
      delay: win && !hinted ? 1.35 : .2,   // بعد أن تستقر نجوم لوحة الفوز في أماكنها
      onHit: (i, kk, C2) => {
        const fin = App.stars();
        cnt.v = i === kk - 1 && cnt.to === total ? fin : Math.min(fin, cnt.v + step);
        write(C2.num, cnt.v);
        const real = D.getElementById('mStarsN'); if (real && real !== C2.num) write(real, fin);
        if (cnt.v >= fin) cnt.v = null;
      }
    });
    return true;
  };

  /* ================================================================
     5) الإنجاز: بطاقة ميدالية ذهبية تدور وتلمع (بدل التوست)
     ================================================================ */
  const medals = []; let medalBusy = false;
  function nextMedal() {
    const a = medals.shift(); if (!a) { medalBusy = false; return; }
    medalBusy = true;
    const m = D.createElement('div'); m.className = 'fxmedal';
    m.innerHTML = '<div class="fxm-coin"></div><div class="fxm-t"><small></small><b></b></div><i class="fxm-sh"></i>';
    const coin = m.firstChild; coin.textContent = a.i || '🏆';
    m.querySelector('small').textContent = App.t('🏆 إنجاز جديد!', '🏆 New achievement!');
    m.querySelector('b').textContent = App.t(a.t, a.te || a.t);
    layer('fxTop').insertBefore(m, layer('fxTop').firstChild);
    srcHint = coin; srcHintT = performance.now();
    const hold = medals.length ? .9 : 1.7;
    G.timeline({ onComplete: () => { m.remove(); nextMedal(); } })
      .fromTo(m, { y: -40, scale: .4, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: .5, ease: 'back.out(2)' })
      .fromTo(coin, { rotationY: -540, scale: .6, transformPerspective: 400 }, { rotationY: 0, scale: 1, duration: 1.3, ease: 'power3.out' }, 0)
      .fromTo(m.lastChild, { xPercent: -140, skewX: -18 }, { xPercent: 420, duration: .8, ease: 'power1.inOut', repeat: 1, repeatDelay: .25 }, .25)
      .add(() => { const c = center(coin); sparks(c.x, c.y, 12, { power: .9 }); }, .35)
      .to(coin, { rotationY: 360, duration: .7, ease: 'power2.inOut' }, 1.35)
      .to(m, { y: -16, autoAlpha: 0, duration: .3, ease: 'power1.in' }, .5 + hold + .5);
  }
  /** يستدعيه App.achieve: يعيد true إن عُرضت الميدالية */
  FX.medal = function (a) {
    if (!FX.heavy || !a) return false;
    medals.push(a); if (!medalBusy) nextMedal();
    else { srcHint = null; }
    return true;
  };

  /* ================================================================
     6) لحظة الفوز: النجوم تطير واحدة واحدة إلى أماكنها + قصاصات
     ================================================================ */
  const PITCH = [659, 784, 1047];
  FX.overlayIn = function (o) {
    if (!FX.heavy) return false;
    const p = o.querySelector('.panel'), slots = [...o.querySelectorAll('.stars3 > *')];
    let next = null; try { next = App.findNext(o); } catch (e) {}
    const lit = slots.filter(s => !s.classList.contains('off'));
    if (!lit.length && !next) return false;     // ليست لوحة فوز: تبقى الحركة العادية
    if (o._fxTl) o._fxTl.kill();
    G.killTweensOf([o, p, ...slots].filter(Boolean));
    G.set(slots, { clearProps: 'transform,opacity,visibility' });
    const tl = o._fxTl = G.timeline();
    tl.fromTo(o, { autoAlpha: 0 }, { autoAlpha: 1, duration: .25, ease: 'power1.out', clearProps: 'opacity,visibility' });
    if (p) tl.fromTo(p, { scale: .55, y: 40, autoAlpha: 0 }, { scale: 1, y: 0, autoAlpha: 1, duration: .45, ease: 'back.out(1.7)', clearProps: 'transform,opacity,visibility' }, .05);
    tl.add(() => FX.confetti(), .12);
    if (slots.length) {
      G.set(lit, { autoAlpha: 0 });
      const off = slots.filter(s => s.classList.contains('off'));
      if (off.length) tl.fromTo(off, { scale: 0 }, { scale: 1, duration: .35, ease: 'back.out(2)', clearProps: 'transform' }, .3);
      const src = performance.now() - last.t < 6000 ? { x: last.x, y: last.y } : { x: innerWidth / 2, y: innerHeight * .78 };
      lit.forEach((slot, i) => tl.add(() => starIn(o, slot, i, src), .55 + i * .27));
    }
    emit('fx:win', { overlay: o, stars: lit.length });
    return true;
  };
  function starIn(o, slot, i, src) {
    const land = () => {
      G.set(slot, { autoAlpha: 1 });
      G.fromTo(slot, { scale: 1.7, rotation: -25 }, { scale: 1, rotation: 0, duration: .5, ease: 'elastic.out(1.1,0.45)', clearProps: 'transform,opacity,visibility' });
    };
    if (!slot.isConnected || !o.classList.contains('on')) { G.set(slot, { clearProps: 'opacity,visibility' }); return; }
    const c = center(slot);
    if (!c.w || !window.MotionPathPlugin) { land(); return; }
    const e = D.createElement('i'); e.className = 'fxs'; e.textContent = slot.textContent || '⭐';
    e.style.fontSize = getComputedStyle(slot).fontSize; fxl().appendChild(e);
    const sx = src.x + (i - 1) * 46, sy = src.y, mx = (sx + c.x) / 2 + (i - 1) * 70 + R(-20, 20), my = Math.min(sy, c.y) - R(50, 110);
    G.set(e, { xPercent: -50, yPercent: -50, x: sx, y: sy, scale: .2, rotation: -200, autoAlpha: 1 });
    G.to(e, { motionPath: { path: [{ x: mx, y: my }, { x: c.x, y: c.y }], curviness: 1.4 }, scale: 1.25, rotation: 0, duration: .46, ease: 'power2.in',
      onComplete: () => {
        e.remove(); land();
        if (!o.classList.contains('on')) return;
        const q = center(slot); sparks(q.x, q.y, 9, { power: .75 });
        tone(PITCH[Math.min(i, 2)], .2, 'triangle', .15); tone(PITCH[Math.min(i, 2)] * 2, .12, 'sine', .05, 0, .04); buzz(10);
      } });
  }

  /* ================================================================
     7) انتقالات الشاشات
     ================================================================ */
  let back = null;
  function finishBack() { if (back) { const b = back; back = null; b.progress(1); } }
  /** فتح لعبة: أيقونة البطاقة تكبر من مكانها حتى تملأ الشاشة بلون اللعبة، ثم تظهر اللعبة */
  FX.heroOpen = function (card, color, icon, done) {
    if (!FX.heavy || !card) return false;
    finishBack();
    const ic = card.querySelector('.ic') || card, r = ic.getBoundingClientRect();
    if (!r.width) return false;
    const vw = innerWidth, vh = innerHeight, h = layer('fxHero'), b = layer('fxHeroIc', 'canvas');
    const rad = getComputedStyle(ic).borderRadius || '26%';
    h.style.width = r.width + 'px'; h.style.height = r.height + 'px'; h.style.borderRadius = rad;
    h.style.background = `radial-gradient(circle, ${App.shade(color, .5)} 0, ${color} 60%, ${App.shade(color, -.12)} 100%)`;
    b.style.width = r.width + 'px'; b.style.height = r.height + 'px'; b.style.borderRadius = rad;
    if (b.width !== 240) { b.width = b.height = 240; }
    const bc = b.getContext('2d'); bc.clearRect(0, 0, 240, 240);
    if (icon) bc.drawImage(icon, 0, 0, 240, 240); else { bc.fillStyle = color; bc.fillRect(0, 0, 240, 240); }
    const S = Math.hypot(vw, vh) / Math.min(r.width, r.height) * 1.12, B = Math.min(vw, vh) * .4 / r.width;
    const cx = vw / 2 - r.width / 2, cy = vh / 2 - r.height / 2;
    G.killTweensOf([h, b]);
    let fired = false; const fire = () => { if (!fired) { fired = true; done(); } };
    G.timeline({ onInterrupt: fire })
      .set(h, { x: r.left, y: r.top, scale: 1, autoAlpha: 1 })
      .set(b, { x: r.left, y: r.top, scale: 1, rotation: 0, autoAlpha: 1 })
      .to(h, { x: cx, y: cy, scale: S, duration: .32, ease: 'power2.in' }, 0)
      .to(b, { x: cx, y: cy, scale: B, rotation: 360, duration: .4, ease: 'power2.inOut' }, 0)
      .add(fire, .32)
      .to(h, { autoAlpha: 0, duration: .26, ease: 'power1.out' }, .4)
      .to(b, { scale: B * 1.3, autoAlpha: 0, duration: .24, ease: 'power1.in' }, .42);
    emit('fx:open', { card });
    return true;
  };
  /** الرجوع: تُستدعى قبل تبديل الشاشة، وتعيد دالة تُشغَّل بعد رسم القائمة (اللعبة تنكمش إلى بطاقتها) */
  FX.heroBack = function (gid) {
    if (!FX.heavy) return null;
    const sec = D.getElementById(gid); if (!sec) return null;
    finishBack();
    sec.classList.add('fx-leave');
    const clean = () => { sec.classList.remove('fx-leave'); sec.style.borderRadius = ''; G.set(sec, { clearProps: 'transform,opacity,visibility,borderRadius' }); };
    return function () {
      let card = null; try { card = D.querySelector('#cards [data-go="' + CSS.escape(gid) + '"]'); } catch (e) {}
      if (!card) { clean(); return; }
      const vw = innerWidth, vh = innerHeight;
      let r = card.getBoundingClientRect();
      if (r.top < 60 || r.bottom > vh - 8) { try { card.scrollIntoView({ block: 'center', behavior: 'instant' }); } catch (e) { card.scrollIntoView(); } }
      const ic = card.querySelector('.ic') || card; r = ic.getBoundingClientRect();
      const s = Math.max(r.width / vw, r.height / vh), c = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      sec.style.borderRadius = '36px';
      back = G.timeline({ onComplete: () => { back = null; clean(); } })
        .fromTo(sec, { x: 0, y: 0, scale: 1, opacity: 1 }, { x: c.x - vw / 2, y: c.y - vh / 2, scale: s, duration: .4, ease: 'power3.inOut' }, 0)
        .to(sec, { opacity: 0, duration: .16, ease: 'power1.in' }, .26)
        .fromTo(card, { scale: .8 }, { scale: 1, duration: .6, ease: 'elastic.out(1,0.42)', clearProps: 'transform' }, .3)
        .add(() => sparks(c.x, c.y, 8, { power: .7 }), .34);
      back.eventCallback('onInterrupt', clean);
      emit('fx:back', { id: gid, card });
    };
  };

  /** بين المستويات: قطار صغير يسحب ستارة بلون اللعبة عبر الشاشة (≤ 450 مللي ثانية) */
  let wiping = false, passing = false;
  FX.levelWipe = function (fire) {
    if (!FX.heavy || wiping) return false;
    wiping = true;
    const w = layer('fxWipe'), A = App.accent(App.current || 'menu');
    if (!w.firstChild) { w.innerHTML = '<b dir="ltr">🚂🚃🚃</b>'; }
    w.style.background = `linear-gradient(100deg, ${App.shade(A.a, .35)}, ${A.a} 55%, ${A.ad})`;
    let done = false; const go = () => { if (!done) { done = true; try { fire && fire(); } catch (e) { console.warn(e); } } };
    tone(523, .08, 'triangle', .08); tone(784, .1, 'triangle', .08, 0, .09);
    G.timeline({ onComplete: () => { wiping = false; }, onInterrupt: () => { wiping = false; go(); } })
      .set(w, { xPercent: 102, autoAlpha: 1 })
      .to(w, { xPercent: 0, duration: .17, ease: 'power2.out' })
      .fromTo(w.firstChild, { x: innerWidth * .45 }, { x: -innerWidth * .45, duration: .43, ease: 'none' }, 0)
      .add(go, .17)
      .to(w, { xPercent: -102, duration: .21, ease: 'power2.in' }, .22)
      .set(w, { autoAlpha: 0 });
    return true;
  };
  /* زر «التالي» في لوحة الفوز (ضغطة الطفل أو autoNext): الستارة أولًا ثم تُنفَّذ الضغطة تحتها */
  window.addEventListener('click', e => {
    if (passing || !FX.heavy) return;
    const b = e.target && e.target.closest && e.target.closest('button'); if (!b) return;
    const o = b.closest('.overlay.on'); if (!o) return;
    let nx = null; try { nx = App.findNext(o); } catch (er) {}
    if (nx !== b) return;
    if (wiping) { e.preventDefault(); e.stopImmediatePropagation(); return; }
    const ok = FX.levelWipe(() => { passing = true; try { b.click(); } finally { passing = false; } });
    if (ok) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);

  /* ================================================================
     8) تبديل الطفل: موجة لون دائرية من صورته تغمر الشاشة ثم يُطبَّق الثيم
     ================================================================ */
  const TH = { girls: ['#FFE2F0', '#FF8CC3', '#FF4FA3'], boys: ['#C4E4FF', '#62AFFF', '#2E86F5'] };
  let waveTl = null;
  FX.kidWave = function (av, oldTheme) {
    if (!FX.heavy || !av) return false;
    const now = App.profile && App.profile.theme === 'boys' ? 'boys' : 'girls';
    if (waveTl) waveTl.progress(1);
    const c = center(av), vw = innerWidth, vh = innerHeight, w = layer('fxWave'), col = TH[now];
    const far = Math.hypot(Math.max(c.x, vw - c.x), Math.max(c.y, vh - c.y)) + 24;
    w.style.background = `radial-gradient(circle, ${col[0]} 0, ${col[1]} 38%, ${col[2]} 62%, rgba(255,255,255,.9) 66%, rgba(255,255,255,0) 71%)`;
    const hold = oldTheme && oldTheme !== now;
    const apply = () => { if (App.profile) H.dataset.theme = App.profile.theme === 'boys' ? 'boys' : 'girls'; };
    if (hold) H.dataset.theme = oldTheme;      // الألوان القديمة تبقى حتى تغمرها الموجة
    waveTl = G.timeline({ onComplete: () => { waveTl = null; }, onInterrupt: apply })
      .set(w, { x: c.x - 100, y: c.y - 100, scale: .1, autoAlpha: 1 })
      .to(w, { scale: far / 100 / .62, duration: .5, ease: 'power2.in' })
      .add(apply)
      .to(w, { autoAlpha: 0, duration: .32, ease: 'power1.out' });
    return true;
  };
})();
