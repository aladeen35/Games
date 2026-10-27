/* =====================================================================
   دورة الحياة — رتّب المراحل على مسار دائري بالأسهم، ثم شاهد الدورة تتحرك:
   النبات، الفراشة، الضفدع، الدجاجة، الإنسان، ودورة الماء.
   ووضع «ازرعها»: اسقِ البذرة وأعطها الشمس لتكبر خطوة بخطوة.
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'lifecycle';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,"Segoe UI",Tahoma,sans-serif';
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const hex2 = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; };
  const mix = (a, b, t) => { const A = hex2(a), B = hex2(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, '0')).join(''); };
  const shade = (h, f) => App.shade ? App.shade(h, f) : h;
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, Array.isArray(r) ? r : Math.max(0, Math.min(r, w / 2, h / 2))); };
  const loadProg = () => { const p = store.get('lifecycleProg', null) || {}; return { stars: p.stars || {}, unlocked: p.unlocked || 1 }; };
  let lang = 'ar';
  const num = n => lang === 'ar' ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
  const say = (ar, en) => lang === 'ar' ? App.speak(ar) : App.speak(en, 'en');
  const L = o => lang === 'ar' ? o.ar : o.en;
  function ball(x, cx, cy, r, c1, c2, c3) {
    const g = x.createRadialGradient(cx - r * .4, cy - r * .45, r * .1, cx, cy, r * 1.05);
    g.addColorStop(0, c1); g.addColorStop(.55, c2); g.addColorStop(1, c3);
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill();
  }
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }

  /* ---------- ملصقات بحافة بيضاء ---------- */
  let dpr = 1;
  const bakeCache = new Map();
  function bake(key, size, draw) {
    const px = Math.max(8, Math.round(size * dpr)), k = key + '|' + px;
    let c = bakeCache.get(k); if (c) return c;
    const pad = Math.round(px * .14), S = px + pad * 2;
    const g = mk(S, S), x = g.getContext('2d');
    x.save(); draw(x, S, px); x.restore();
    const sil = mk(S, S), sx = sil.getContext('2d');
    sx.drawImage(g, 0, 0); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = '#fff'; sx.fillRect(0, 0, S, S);
    c = mk(S, S); const cx = c.getContext('2d');
    const r = Math.max(2, px * .045);
    cx.save(); cx.shadowColor = 'rgba(30,30,60,.3)'; cx.shadowBlur = px * .05; cx.shadowOffsetY = px * .03;
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; cx.drawImage(sil, Math.cos(a) * r, Math.sin(a) * r); }
    cx.restore();
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; cx.drawImage(sil, Math.cos(a) * r * .6, Math.sin(a) * r * .6); }
    cx.drawImage(g, 0, 0);
    if (bakeCache.size > 200) bakeCache.clear();
    bakeCache.set(k, c);
    return c;
  }
  const emojiDraw = e => (x, S, px) => { x.font = `${Math.round(px * .84)}px ${EMOJI_FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(e, S / 2, S / 2 + px * .05); };
  const vecDraw = fn => (x, S, px) => { x.translate(S / 2, S / 2); fn(x, px); };
  function sticker(c, key, draw, x, y, size, o = {}) {
    const img = bake(key, size, draw), sz = img.width / dpr;
    c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot);
    const sq = o.sq || 0, sc = o.sc || 1; c.scale(sc * (1 + sq), sc * (1 - sq));
    if (o.alpha != null) c.globalAlpha *= o.alpha;
    c.drawImage(img, -sz / 2, -sz / 2, sz, sz); c.restore();
  }

  /* =====================================================================
     الرسومات
     ===================================================================== */
  /** نبتة متدرّجة النموّ: g من 0 (بذرة) إلى 4 (ثمار). (0,0) = سطح التربة، s = حجم المربع */
  function drawPlant(c, s, g, o = {}) {
    const fruitC = o.fruit || ['#FF8787', '#F03E3E', '#A61E1E'];
    const flowerC = o.flower || '#FFD43B';
    // البذرة (تصغر وتختفي مع النمو)
    const seedA = clamp(1.4 - g, 0, 1);
    if (seedA > 0) {
      c.save(); c.globalAlpha *= seedA; c.translate(0, s * .1); c.rotate(-.4);
      const sg = c.createLinearGradient(-s * .08, -s * .05, s * .08, s * .05); sg.addColorStop(0, '#C08552'); sg.addColorStop(1, '#6B4226');
      c.fillStyle = sg; c.beginPath(); c.ellipse(0, 0, s * .1, s * .065, 0, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = s * .012; c.beginPath(); c.ellipse(-s * .02, -s * .015, s * .05, s * .025, 0, Math.PI, TAU); c.stroke();
      c.restore();
      if (g > .05 && g < 1.2) { // جذر صغير
        c.strokeStyle = '#E9D8A6'; c.lineWidth = s * .015; c.lineCap = 'round';
        c.beginPath(); c.moveTo(0, s * .12); c.quadraticCurveTo(-s * .03, s * .17, s * .01, s * .2 * Math.min(1, g * 2)); c.stroke();
      }
    }
    if (g <= .15) return;
    const h = s * (g < 1 ? .1 + (g - .15) * .2 : g < 2 ? .27 + (g - 1) * .13 : g < 3 ? .4 + (g - 2) * .15 : .55 + Math.min(1, g - 3) * .06);
    const sway = o.sway || 0;
    // الساق
    c.lineCap = 'round';
    const sg = c.createLinearGradient(-s * .02, 0, s * .02, 0); sg.addColorStop(0, '#8CE99A'); sg.addColorStop(1, '#2F9E44');
    c.strokeStyle = sg; c.lineWidth = s * (.02 + Math.min(1, g / 3) * .02);
    const tx = sway * h * .25;
    c.beginPath(); c.moveTo(0, s * .04); c.quadraticCurveTo(s * .02 + tx * .3, -h * .5, tx, -h); c.stroke();
    const at = t => { const u = 1 - t; return [2 * u * t * (s * .02 + tx * .3) + t * t * tx, u * u * s * .04 + 2 * u * t * (-h * .5) + t * t * (-h)]; };
    const leaf = (t, side, len, a) => {
      const [lx, ly] = at(t); c.save(); c.translate(lx, ly); c.rotate(side * (a || .9));
      const lg = c.createLinearGradient(0, 0, side * len, -len * .2); lg.addColorStop(0, '#2F9E44'); lg.addColorStop(1, '#8CE99A');
      c.fillStyle = lg; c.beginPath(); c.moveTo(0, 0); c.quadraticCurveTo(side * len * .5, -len * .45, side * len, 0); c.quadraticCurveTo(side * len * .5, len * .3, 0, 0); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = s * .006; c.beginPath(); c.moveTo(0, 0); c.lineTo(side * len * .8, -len * .03); c.stroke();
      c.restore();
    };
    // ورقتا البرعم
    const cot = clamp((g - .2) / .8, 0, 1);
    if (cot > 0) { leaf(1, -1, s * .11 * cot, 1.2); leaf(1, 1, s * .11 * cot, 1.2); }
    // أوراق النبتة
    const lv = clamp(g - 1, 0, 1.6);
    if (lv > 0) {
      const ls = [[.35, -1], [.5, 1], [.68, -1], [.8, 1]];
      ls.forEach(([t, sd], i) => { const k = clamp(lv * 2.2 - i * .5, 0, 1); if (k > 0) leaf(t, sd, s * .16 * k, .5); });
    }
    // الأزهار
    const fl = clamp((g - 2.2) / .7, 0, 1), fr = clamp((g - 3.1) / .8, 0, 1);
    const spots = [[1, 0], [.62, -1], [.75, 1]];
    spots.forEach(([t, sd], i) => {
      let [x, y] = at(t); x += sd * s * .13; y -= s * .02;
      if (t === 1) { y -= s * .04; }
      else { c.strokeStyle = '#2F9E44'; c.lineWidth = s * .014; const [bx, by] = at(t); if (fl > 0 || fr > 0) { c.beginPath(); c.moveTo(bx, by); c.quadraticCurveTo((bx + x) / 2, by - s * .06, x, y); c.stroke(); } }
      const k = clamp(fl * 1.6 - i * .3, 0, 1) * (1 - fr);
      if (k > 0) {
        c.save(); c.translate(x, y); c.scale(k, k);
        for (let p = 0; p < 6; p++) { const a = p / 6 * TAU; ball(c, Math.cos(a) * s * .045, Math.sin(a) * s * .045, s * .04, '#FFF9DB', flowerC, shade(flowerC, -.25)); }
        ball(c, 0, 0, s * .03, '#FFE8CC', '#F76707', '#C2410C');
        c.restore();
      }
      const kf = clamp(fr * 1.5 - i * .25, 0, 1);
      if (kf > 0) {
        c.save(); c.translate(x, y + s * .03 * kf); c.scale(kf, kf);
        ball(c, 0, 0, s * .065, fruitC[0], fruitC[1], fruitC[2]);
        c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(-s * .022, -s * .025, s * .016, s * .01, -.6, 0, TAU); c.fill();
        c.fillStyle = '#2F9E44'; for (let p = 0; p < 5; p++) { const a = -Math.PI / 2 + (p - 2) * .5; c.beginPath(); c.ellipse(Math.cos(a) * s * .02, -s * .06 + Math.sin(a) * s * .01, s * .018, s * .007, a, 0, TAU); c.fill(); }
        c.restore();
      }
    });
  }
  function soil(c, s, w = .4) {
    const g = c.createLinearGradient(0, -s * .05, 0, s * .2); g.addColorStop(0, '#9C6B43'); g.addColorStop(1, '#5C3A1E');
    c.fillStyle = g; c.beginPath(); c.ellipse(0, s * .08, s * w, s * .14, 0, Math.PI, TAU); c.lineTo(s * w, s * .16); c.quadraticCurveTo(0, s * .26, -s * w, s * .16); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.ellipse(-s * .1, s * .0, s * .14, s * .03, -.1, 0, TAU); c.fill();
    c.fillStyle = 'rgba(60,30,10,.35)'; for (const [x, y] of [[-.2, .1], [.15, .08], [.25, .13], [-.05, .15]]) { c.beginPath(); c.arc(x * s, y * s, s * .012, 0, TAU); c.fill(); }
  }
  const plantArt = g => (c, s) => {
    const k = [1.9, 1.6, 1.2, 1, 1][g], y = [.05, .18, .26, .3, .3][g];
    c.translate(0, s * y); soil(c, s * Math.min(1.25, k * .8), .38); c.translate(0, s * .02); drawPlant(c, s * k * .95, g);
  };
  function frogspawn(c, s) {
    const pts = [[0, 0], [-.18, -.05], [.17, -.07], [-.08, -.2], [.1, -.22], [-.25, .12], [.24, .1], [0, .17], [-.1, .32], [.13, .3], [-.3, -.18], [.3, -.2]];
    c.fillStyle = 'rgba(120,200,255,.35)'; c.beginPath(); c.ellipse(0, s * .04, s * .44, s * .36, 0, 0, TAU); c.fill();
    for (const [x, y] of pts) {
      const g = c.createRadialGradient(x * s - s * .03, y * s - s * .03, s * .01, x * s, y * s, s * .1);
      g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.6, 'rgba(190,230,255,.85)'); g.addColorStop(1, 'rgba(120,190,240,.7)');
      c.fillStyle = g; c.beginPath(); c.arc(x * s, y * s, s * .1, 0, TAU); c.fill();
      c.fillStyle = '#212529'; c.beginPath(); c.arc(x * s + s * .01, y * s + s * .01, s * .035, 0, TAU); c.fill();
    }
  }
  function tadpole(c, s, ph = 0) {
    c.save(); c.scale(s / 100, s / 100); c.lineCap = c.lineJoin = 'round';
    c.strokeStyle = '#495057'; c.lineWidth = 11; c.beginPath(); c.moveTo(6, 4);
    for (let i = 0; i <= 10; i++) c.lineTo(6 + i * 3.8, 4 + Math.sin(i * .9 + ph) * (2 + i * .9)); c.stroke();
    c.strokeStyle = '#868E96'; c.lineWidth = 4; c.stroke();
    const g = c.createRadialGradient(-20, -10, 3, -10, 2, 30); g.addColorStop(0, '#8A94A6'); g.addColorStop(.55, '#4A5568'); g.addColorStop(1, '#2D3748');
    c.fillStyle = g; c.beginPath(); c.ellipse(-12, 2, 25, 21, -.1, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-22, -9, 9, 5, -.5, 0, TAU); c.fill();
    for (const ex of [-24, -7]) { c.fillStyle = '#fff'; c.beginPath(); c.arc(ex, -2, 7, 0, TAU); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(ex - 1.5, -1, 4, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(ex - 3, -3, 1.5, 0, TAU); c.fill(); }
    c.strokeStyle = '#1A202C'; c.lineWidth = 2.2; c.beginPath(); c.arc(-16, 9, 5, .3, Math.PI - .3); c.stroke();
    c.restore();
  }
  function froglet(c, s) {
    c.save(); c.scale(s / 100, s / 100); c.lineCap = 'round';
    // ذيل قصير
    c.fillStyle = '#69DB7C'; c.beginPath(); c.moveTo(18, 18); c.quadraticCurveTo(46, 22, 48, 8); c.quadraticCurveTo(38, 14, 18, 8); c.fill();
    // أرجل
    c.strokeStyle = '#40C057'; c.lineWidth = 8;
    c.beginPath(); c.moveTo(-14, 22); c.lineTo(-26, 32); c.lineTo(-34, 30); c.moveTo(10, 24); c.lineTo(18, 34); c.lineTo(26, 34); c.stroke();
    const g = c.createRadialGradient(-10, -6, 3, -2, 6, 34); g.addColorStop(0, '#B2F2BB'); g.addColorStop(.6, '#51CF66'); g.addColorStop(1, '#2B8A3E');
    c.fillStyle = g; c.beginPath(); c.ellipse(-2, 8, 27, 21, 0, 0, TAU); c.fill();
    c.fillStyle = '#E6FCF5'; c.beginPath(); c.ellipse(-2, 16, 15, 9, 0, 0, TAU); c.fill();
    for (const ex of [-15, 9]) { ball(c, ex, -10, 9, '#D3F9D8', '#51CF66', '#2B8A3E'); c.fillStyle = '#fff'; c.beginPath(); c.arc(ex, -11, 6, 0, TAU); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(ex, -10, 3.4, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(ex - 1.3, -11.5, 1.2, 0, TAU); c.fill(); }
    c.strokeStyle = '#1B5E20'; c.lineWidth = 2.4; c.beginPath(); c.arc(-3, 6, 9, .35, Math.PI - .35); c.stroke();
    c.fillStyle = 'rgba(255,120,140,.5)'; for (const ex of [-17, 11]) { c.beginPath(); c.ellipse(ex, 6, 4, 2.5, 0, 0, TAU); c.fill(); }
    c.restore();
  }
  function leafBase(c, s) {
    const g = c.createLinearGradient(-s * .4, 0, s * .4, 0); g.addColorStop(0, '#8CE99A'); g.addColorStop(1, '#2F9E44');
    c.fillStyle = g; c.beginPath(); c.moveTo(-s * .45, s * .1); c.quadraticCurveTo(-s * .1, -s * .35, s * .45, -s * .05); c.quadraticCurveTo(0, s * .38, -s * .45, s * .1); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = s * .02; c.beginPath(); c.moveTo(-s * .45, s * .1); c.quadraticCurveTo(0, 0, s * .42, -s * .04); c.stroke();
  }
  function bflyEggs(c, s) {
    leafBase(c, s);
    for (const [x, y] of [[-.1, .02], [.04, -.02], [.17, -.04], [-.03, .1], [.11, .07]]) {
      ball(c, x * s, y * s, s * .045, '#FFFFFF', '#FFF3BF', '#E9C46A');
    }
  }
  function chrysalis(c, s) {
    c.strokeStyle = '#8B5A2B'; c.lineWidth = s * .06; c.lineCap = 'round'; c.beginPath(); c.moveTo(-s * .42, -s * .36); c.lineTo(s * .42, -s * .4); c.stroke();
    c.strokeStyle = '#5C940D'; c.lineWidth = s * .02; c.beginPath(); c.moveTo(0, -s * .38); c.lineTo(0, -s * .3); c.stroke();
    const g = c.createLinearGradient(-s * .16, 0, s * .16, 0); g.addColorStop(0, '#C0EB75'); g.addColorStop(.5, '#82C91E'); g.addColorStop(1, '#5C940D');
    c.fillStyle = g; c.beginPath(); c.moveTo(0, -s * .32); c.bezierCurveTo(s * .2, -s * .25, s * .2, s * .2, 0, s * .42); c.bezierCurveTo(-s * .2, s * .2, -s * .2, -s * .25, 0, -s * .32); c.fill();
    c.strokeStyle = 'rgba(60,90,10,.4)'; c.lineWidth = s * .012;
    for (const y of [-.12, .02, .16]) { c.beginPath(); c.moveTo(-s * .13, y * s); c.quadraticCurveTo(0, y * s + s * .04, s * .13, y * s); c.stroke(); }
    ball(c, s * .05, -s * .18, s * .018, '#FFF3BF', '#FFD43B', '#F08C00'); ball(c, -s * .06, -s * .1, s * .015, '#FFF3BF', '#FFD43B', '#F08C00');
    c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.ellipse(-s * .07, -s * .05, s * .025, s * .12, .1, 0, TAU); c.fill();
  }
  function waves(c, s, y0, col) {
    c.fillStyle = col[0]; c.beginPath(); c.moveTo(-s * .48, s * .48); c.lineTo(-s * .48, y0);
    for (let i = 0; i <= 8; i++) { const x = -s * .48 + i * s * .12; c.quadraticCurveTo(x + s * .03, y0 - s * .07, x + s * .06, y0); c.quadraticCurveTo(x + s * .09, y0 + s * .05, x + s * .12, y0); }
    c.lineTo(s * .48, s * .48); c.closePath();
    const g = c.createLinearGradient(0, y0, 0, s * .48); g.addColorStop(0, col[0]); g.addColorStop(1, col[1]); c.fillStyle = g; c.fill();
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = s * .025; c.lineCap = 'round';
    for (const [x, y] of [[-.3, .12], [.1, .2], [.28, .1], [-.1, .32]]) { c.beginPath(); c.moveTo(x * s, (y0 / s + y) * s); c.quadraticCurveTo(x * s + s * .05, (y0 / s + y) * s - s * .03, x * s + s * .1, (y0 / s + y) * s); c.stroke(); }
  }
  function sunSmall(c, x, y, r) {
    c.save(); c.translate(x, y); c.fillStyle = '#FFC93C';
    for (let i = 0; i < 10; i++) { c.rotate(TAU / 10); c.beginPath(); c.moveTo(-r * .25, -r * 1.05); c.lineTo(0, -r * 1.55); c.lineTo(r * .25, -r * 1.05); c.closePath(); c.fill(); }
    c.restore(); ball(c, x, y, r, '#FFF6C2', '#FFD43B', '#F59F00');
    c.fillStyle = '#7A3E00'; for (const sd of [-1, 1]) { c.beginPath(); c.arc(x + sd * r * .33, y - r * .1, r * .1, 0, TAU); c.fill(); }
    c.strokeStyle = '#7A3E00'; c.lineWidth = r * .1; c.lineCap = 'round'; c.beginPath(); c.arc(x, y + r * .1, r * .32, .4, Math.PI - .4); c.stroke();
  }
  function cloudIcon(c, x, y, s, col = ['#FFFFFF', '#DCE6F2']) {
    const g = c.createLinearGradient(0, y - s * .3, 0, y + s * .2); g.addColorStop(0, col[0]); g.addColorStop(1, col[1]);
    c.fillStyle = g; c.beginPath();
    c.arc(x - s * .22, y + s * .02, s * .17, 0, TAU); c.arc(x, y - s * .1, s * .23, 0, TAU); c.arc(x + s * .23, y + s * .01, s * .16, 0, TAU);
    c.roundRect(x - s * .38, y - s * .02, s * .76, s * .19, s * .09); c.fill();
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(x - s * .06, y - s * .2, s * .1, s * .05, -.3, 0, TAU); c.fill();
  }
  function drop(c, x, y, s, col = '#4DABF7') {
    c.fillStyle = col; c.beginPath(); c.moveTo(x, y - s); c.quadraticCurveTo(x + s * .75, y + s * .1, x, y + s * .6); c.quadraticCurveTo(x - s * .75, y + s * .1, x, y - s); c.fill();
    c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.arc(x - s * .2, y, s * .17, 0, TAU); c.fill();
  }
  const ART = {
    sea(c, s) { sunSmall(c, s * .24, -s * .24, s * .12); waves(c, s, -s * .02, ['#4DABF7', '#1864AB']); },
    evap(c, s) {
      sunSmall(c, s * .26, -s * .3, s * .11);
      waves(c, s, s * .2, ['#74C0FC', '#1971C2']);
      c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineCap = 'round'; c.lineWidth = s * .04;
      for (const x of [-.25, -.05, .15]) {
        c.save(); c.translate(x * s, 0);
        c.strokeStyle = '#A5D8FF'; c.lineWidth = s * .055;
        c.beginPath(); c.moveTo(0, s * .14); for (let i = 1; i <= 6; i++) c.lineTo(Math.sin(i * 1.2) * s * .03, s * .14 - i * s * .07); c.stroke();
        c.fillStyle = '#A5D8FF'; c.beginPath(); c.moveTo(-s * .05, -s * .26); c.lineTo(0, -s * .34); c.lineTo(s * .05, -s * .26); c.fill();
        c.restore();
      }
    },
    cloud(c, s) { cloudIcon(c, 0, 0, s * .95, ['#FFFFFF', '#C5D6EA']); },
    rain(c, s) { cloudIcon(c, 0, -s * .14, s * .9, ['#E9EEF5', '#8EA1BA']); for (const [x, y] of [[-.24, .2], [-.08, .3], [.08, .2], [.24, .3], [-.16, .42], [.16, .42]]) drop(c, x * s, y * s, s * .065); },
    frogspawn, tadpole: (c, s) => tadpole(c, s * .9), froglet: (c, s) => froglet(c, s * .9),
    bflyEggs, chrysalis
  };
  const vec = (k, fn) => ({ key: 'v:' + k, draw: vecDraw(fn) });
  const emo = e => ({ key: 'e:' + e, draw: emojiDraw(e) });

  /* ---------- الدورات ---------- */
  const CYC = {
    plant: { ar: 'دورة حياة النبات', en: 'Plant life cycle', c: '#2F9E44', bg: ['#B9F0B0', '#F1FFEC'], ic: '🌱',
      st: [{ id: 'seed', ar: 'بذرة', en: 'Seed', a: vec('p0', plantArt(0)), g: 0 }, { id: 'sprout', ar: 'برعم', en: 'Sprout', a: vec('p1', plantArt(1)), g: 1 },
        { id: 'small', ar: 'نبتة', en: 'Small plant', a: vec('p2', plantArt(2)), g: 2 }, { id: 'flower', ar: 'زهرة', en: 'Flowering plant', a: vec('p3', plantArt(3)), g: 3 },
        { id: 'fruit', ar: 'ثمرة', en: 'Fruit', a: vec('p4', plantArt(4)), g: 4 }] },
    butterfly: { ar: 'دورة حياة الفراشة', en: 'Butterfly life cycle', c: '#E64980', bg: ['#FFD6E8', '#FFF5FA'], ic: '🦋',
      st: [{ id: 'begg', ar: 'بيضة', en: 'Egg', a: vec('be', ART.bflyEggs) }, { id: 'cat', ar: 'يرقة', en: 'Caterpillar', a: emo('🐛') },
        { id: 'chry', ar: 'شرنقة', en: 'Chrysalis', a: vec('ch', ART.chrysalis) }, { id: 'bfly', ar: 'فراشة', en: 'Butterfly', a: emo('🦋') }] },
    frog: { ar: 'دورة حياة الضفدع', en: 'Frog life cycle', c: '#0CA678', bg: ['#B2F2E6', '#F0FFFB'], ic: '🐸',
      st: [{ id: 'spawn', ar: 'بيض', en: 'Eggs', a: vec('fs', ART.frogspawn) }, { id: 'tad', ar: 'شرغوف', en: 'Tadpole', a: vec('td', ART.tadpole) },
        { id: 'flet', ar: 'ضفدع صغير', en: 'Froglet', a: vec('fl', ART.froglet) }, { id: 'frog', ar: 'ضفدع', en: 'Frog', a: emo('🐸') }] },
    chicken: { ar: 'دورة حياة الدجاجة', en: 'Chicken life cycle', c: '#F08C00', bg: ['#FFE8A3', '#FFFBEA'], ic: '🐔',
      st: [{ id: 'cegg', ar: 'بيضة', en: 'Egg', a: emo('🥚') }, { id: 'chick', ar: 'كتكوت', en: 'Chick', a: emo('🐥') }, { id: 'hen', ar: 'دجاجة', en: 'Hen', a: emo('🐔') }] },
    human: { ar: 'دورة حياة الإنسان', en: 'Human life cycle', c: '#7048E8', bg: ['#E5DBFF', '#F8F5FF'], ic: '👶🏾',
      st: [{ id: 'baby', ar: 'رضيع', en: 'Baby', a: emo('👶🏾') }, { id: 'kid', ar: 'طفل', en: 'Child', a: emo('🧒🏾') },
        { id: 'adult', ar: 'شاب', en: 'Grown-up', a: emo('🧑🏾') }, { id: 'grand', ar: 'جد', en: 'Grandparent', a: emo('👴🏾') }] },
    water: { ar: 'دورة الماء', en: 'The water cycle', c: '#1C7ED6', bg: ['#A5D8FF', '#EEF7FF'], ic: '💧',
      st: [{ id: 'sea', ar: 'بحر', en: 'Sea', a: vec('sea', ART.sea) }, { id: 'evap', ar: 'تبخر', en: 'Evaporation', a: vec('ev', ART.evap) },
        { id: 'cloud', ar: 'سحابة', en: 'Cloud', a: vec('cl', ART.cloud) }, { id: 'rain', ar: 'مطر', en: 'Rain', a: vec('rn', ART.rain) }] }
  };
  const FRUITS = { tomato: ['#FF8787', '#F03E3E', '#A61E1E'], orange: ['#FFD8A8', '#FD7E14', '#C2410C'], plum: ['#E599F7', '#9C36B5', '#5F1E78'] };
  const FLOWERS = { tomato: '#FFD43B', orange: '#FFFFFF', plum: '#FCC2D7' };

  const LEVELS = [
    { m: 'order', c: 'plant' },
    { m: 'grow', needs: ['water', 'sun'], v: 'tomato' },
    { m: 'order', c: 'chicken' },
    { m: 'order', c: 'butterfly' },
    { m: 'order', c: 'frog' },
    { m: 'order', c: 'water' },
    { m: 'grow', needs: ['water', 'sun', 'water'], v: 'orange' },
    { m: 'order', c: 'human' },
    { m: 'order', c: 'butterfly', x: 'frog' },
    { m: 'order', c: 'frog', x: 'chicken' },
    { m: 'order', c: 'plant', x: 'butterfly', free: true },
    { m: 'grow', needs: ['water', 'sun', 'sun', 'water'], v: 'plum' }
  ];

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #lifecycle{background:#DFF5D8;overflow:hidden;color:#24442A}
  #lifecycle canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #lifecycle .ib{color:#2F9E44}
  #lifecycle .lang{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 rgba(30,80,30,.18),0 8px 16px rgba(30,60,30,.15)}
  #lifecycle .lang button{min-width:62px;padding:6px 11px;border-radius:99px;font-weight:900;font-size:16px;background:#EEF8EA;color:#2B7A1D;line-height:1.25}
  #lifecycle .lang button.on{background:linear-gradient(#8CE36A,#37A62A);color:#fff;box-shadow:0 3px 0 #2B7A1D;text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #lifecycle .prog{position:absolute;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 58px);display:flex;gap:5px;padding:6px 10px;background:rgba(255,255,255,.92);border-radius:99px;z-index:4;box-shadow:0 3px 0 rgba(0,0,0,.08),0 6px 14px rgba(0,0,0,.1)}
  #lifecycle .prog i{width:24px;height:11px;border-radius:6px;background:#E2E8EE;box-shadow:inset 0 2px 0 rgba(0,0,0,.08);transition:background .3s}
  #lifecycle .prog i.on{background:linear-gradient(#C0EB75,#37B24D);box-shadow:0 2px 0 #2B8A3E;animation:lcPop .45s cubic-bezier(.3,1.8,.5,1)}
  @keyframes lcPop{40%{transform:scale(1.5,1.3)}}
  #lifecycle .sayb{position:absolute;z-index:5;width:60px;height:60px;flex:none;font-size:27px;top:calc(max(10px,env(safe-area-inset-top)) + 54px);left:max(12px,env(safe-area-inset-left))}
  #lifecycle .hint{top:calc(max(10px,env(safe-area-inset-top)) + 96px)}
  #lifecycle .hint span{color:#2B7A1D;font-size:15px}
  #lifecycle .overlay{background:radial-gradient(circle at 50% 45%,rgba(30,80,40,.25),rgba(20,50,30,.5))}
  #lifecycle .panel{border:5px solid #CDEFB8;box-shadow:0 8px 0 #8FCB6E,0 20px 40px rgba(20,60,20,.3);color:#33461F;background:linear-gradient(180deg,#fff 0%,#fff 70%,#F1FBEA 100%)}
  #lifecycle .panel h3{color:#2F9E44;text-shadow:0 3px 0 #D8F5C4}
  #lifecycle .btn{background:linear-gradient(#86DB57,#3FA52E);box-shadow:0 5px 0 #2B7A1D,0 8px 12px rgba(40,120,30,.25)}
  #lifecycle .btn:active{box-shadow:0 1px 0 #2B7A1D}
  #lifecycle .btn.alt{background:#fff;color:#2F8A2A;box-shadow:0 5px 0 #B9E3A0;border:3px solid #DDF3CF}
  #lifecycle .wic{font-size:46px;line-height:1.1;margin:2px 0}
  #lifecycle .lvp{width:min(94vw,440px);max-height:88vh;overflow-y:auto;touch-action:pan-y}
  #lifecycle .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:10px 0 12px}
  #lifecycle .lvb{position:relative;aspect-ratio:.9;border-radius:20px;background:#fff;border:3px solid #CDEFB8;box-shadow:0 5px 0 #A8DB8A;
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#2F6A22;font-weight:900;padding:2px}
  #lifecycle .lvb.grow{border-color:#FFE8A3;box-shadow:0 5px 0 #F2C14E}
  #lifecycle .lvb:active{transform:translateY(3px)}
  #lifecycle .lvb .n{font-size:13px;position:absolute;top:2px;right:8px;opacity:.7}
  #lifecycle .lvb .md{font-size:12px;position:absolute;top:3px;left:6px}
  #lifecycle .lvb .e{font-size:30px;line-height:1.15}
  #lifecycle .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:12px}
  #lifecycle .lvb .s i{font-style:normal}
  #lifecycle .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #lifecycle .lvb.cur{outline:3px solid #FF9A1F;outline-offset:2px}
  #lifecycle .lvb.lock{background:#EEF1EA;border-color:#DDE3D6;box-shadow:0 5px 0 #C9D2BE;color:#8A9680}
  #lifecycle .lvb.lock .e{filter:grayscale(1);opacity:.35}
  #lifecycle .lvb.lock::after{content:'🔒';position:absolute;font-size:18px;bottom:3px}
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
    <div class="overlay" id="lcLv"><div class="panel lvp"><h3>🔢 المستويات</h3><div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="lcWin"><div class="panel">
      <h3 class="wT"></h3><div class="wic"></div><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const progEl = root.querySelector('.prog'), sayBtn = root.querySelector('.sayb');
  const hintEl = root.querySelector('.hint'), hintT = root.querySelector('.hintT');
  const lvOv = root.querySelector('#lcLv'), winOv = root.querySelector('#lcWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, portrait = true, topY = 110;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, def = LEVELS[0], mode = 'order', cyc = CYC.plant;
  let total = 0, done = 0, mistakes = 0, over = false, idleT = 0, shake = 0;
  let tasks = [], parts = [], rings = [], drag = null;
  let cards = [], slots = [], ring = { cx: 0, cy: 0, R: 100, cs: 80 }, trayY = 0;
  let play = null;               // عرض الدورة المتحركة
  let grow = null;               // وضع الزراعة
  const later = (s, fn) => tasks.push({ t: s, fn });

  const sayGood = () => say(App.g('أحسنتِ!', 'أحسنتَ!'), 'Well done!');
  const sayTry = () => say(App.g('حاولي مرة أخرى.', 'حاول مرة أخرى.'), 'Try again!');
  const sayStage = st => say(st.ar, st.en);
  function askCurrent() {
    if (mode === 'order') say(cyc.ar + ' ' + App.g('رتبي المراحل', 'رتب المراحل'), cyc.en + '. Put the stages in order');
    else if (grow) sayNeed();
  }

  /* ---------- البطاقات ---------- */
  function mkCard(st, cy, o = {}) { return Object.assign({ st_: st, cy, x: 0, y: 0, hx: 0, hy: 0, w: 80, h: 86, st: 'tray', t: 0, fx: 0, fy: 0, tx: 0, ty: 0, pop: 0, shake: 0, glow: 0, sc: 1, intro: 0, done: false, hide: false, rot: 0, errs: 0 }, o); }
  function drawCardBox(c, x, y, w, h, col, o = {}) {
    const r = Math.min(w, h) * .24, d = Math.max(3, h * .07), b = Math.max(3, Math.min(w, h) * .055);
    c.save(); c.shadowColor = 'rgba(20,40,20,.25)'; c.shadowBlur = o.lift ? 18 : 8; c.shadowOffsetY = o.lift ? 10 : 4;
    c.fillStyle = shade(col, -.28); rr(c, x, y + d, w, h, r); c.fill(); c.restore();
    c.fillStyle = col; rr(c, x, y, w, h, r); c.fill();
    const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, mix(col, '#ffffff', .88));
    c.fillStyle = g; rr(c, x + b, y + b, w - 2 * b, h - 2 * b, r - b * .7); c.fill();
    c.fillStyle = 'rgba(255,255,255,.55)'; rr(c, x + w * .18, y + b * .35, w * .64, b * .5, b * .25); c.fill();
  }
  function textFit(c, t, x, y, maxW, size, col, weight = 900) {
    let s = size; c.font = `${weight} ${s}px ${FONT}`;
    while (s > 9 && c.measureText(t).width > maxW) { s -= 1; c.font = `${weight} ${s}px ${FONT}`; }
    c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = lang === 'ar' ? 'rtl' : 'ltr'; c.fillText(t, x, y);
  }
  function drawStageCard(cx, cy, w, h, st, col, o = {}) {
    drawCardBox(ctx, cx - w / 2, cy - h / 2, w, h, col, o);
    const art = Math.min(w * .78, h * .62);
    sticker(ctx, st.a.key, st.a.draw, cx, cy - h * .11, art, { sq: o.sq });
    textFit(ctx, L(st), cx, cy + h * .32, w * .86, Math.max(11, Math.min(17, h * .16)), shade(col, -.35));
  }
  function drawCard(cd) {
    if (cd.hide) return;
    const it = cd.intro < 1 ? ease.outBack(clamp(cd.intro, 0, 1)) : 1; if (it <= 0) return;
    const lift = cd.st === 'drag';
    const sq = Math.sin((1 - cd.pop) * Math.PI * 3) * cd.pop * .12;
    const sx = cd.shake > 0 ? Math.sin(cd.shake * 40) * 8 * cd.shake : 0;
    const s = it * cd.sc * (lift ? 1.1 : 1);
    ctx.save(); ctx.globalAlpha = cd.alpha == null ? 1 : cd.alpha; ctx.translate(cd.x + sx, cd.y); ctx.scale(s * (1 + sq), s * (1 - sq)); if (lift) ctx.rotate(cd.rot);
    if (cd.glow > 0) { ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(T * 9); ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 22; ctx.fillStyle = '#FFE066'; rr(ctx, -cd.w / 2 - 5, -cd.h / 2 - 5, cd.w + 10, cd.h + 10, Math.min(cd.w, cd.h) * .28); ctx.fill(); ctx.restore(); }
    drawStageCard(0, 0, cd.w, cd.h, cd.st_, cd.lit ? '#FAB005' : cyc.c, { lift });
    ctx.restore();
  }
  const cardHit = (cd, x, y, pad = 0) => !cd.hide && Math.abs(x - cd.x) < cd.w / 2 + pad && Math.abs(y - cd.y) < cd.h / 2 + pad;
  function sendBack(cd) { cd.st = 'back'; cd.t = 0; cd.fx = cd.x; cd.fy = cd.y; }
  function flyTo(cd, x, y, cb) { cd.st = 'fly'; cd.t = 0; cd.fx = cd.x; cd.fy = cd.y; cd.tx = x; cd.ty = y; cd.cb = cb; }

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    portrait = W / H < 1.05;
    const pb = progEl.getBoundingClientRect();
    topY = (pb.height ? pb.bottom : 80) + 8;
    if (mode === 'order') layoutOrder(); else layoutGrow();
  }
  let trayBox = null;
  function layoutOrder() {
    const n = cyc.st.length;
    const tray = cards.filter(c => !c.done);
    const cs = portrait ? clamp(W * .235, 70, 112) : clamp(H * .17, 84, 128);
    const ch = cs * 1.08;
    const top = Math.max(topY, sayBtn.getBoundingClientRect().bottom - (portrait ? 10 : 60)) + 30;
    const nt = play ? 0 : Math.max(1, cards.length - (def.free ? 0 : 1));
    let area;
    if (!nt) { trayBox = null; area = { x0: 0, x1: W, y0: top, y1: H - 18 }; }
    else if (portrait) {
      const cols = Math.min(nt, 4), rows = Math.ceil(nt / cols);
      const tcw = Math.min(cs, (W - 24 - (cols - 1) * 8) / cols), tch = tcw * 1.08, th = rows * tch + (rows - 1) * 8;
      trayY = H - 14 - th - 6; trayBox = { x: 6, y: trayY, w: W - 12, h: H - trayY + 30 };
      placeTray(tray, cols, tcw, tch, W / 2, trayY + 6 + th / 2);
      area = { x0: 0, x1: W, y0: top, y1: trayY - 14 };
    } else {
      const cols = nt > 3 ? 2 : 1, rows = Math.ceil(nt / cols);
      const tcw = Math.min(cs, (H - top - 30 - (rows - 1) * 10) / rows / 1.08), tch = tcw * 1.08;
      const bw = cols * tcw + (cols - 1) * 10 + 36, bx = lang === 'ar' ? 14 : W - 14 - bw;
      trayBox = { x: bx, y: top - 10, w: bw, h: H - top - 4 };
      placeTray(tray, cols, tcw, tch, bx + bw / 2, top - 10 + (H - top - 4) / 2, 10);
      area = lang === 'ar' ? { x0: bx + bw, x1: W, y0: top, y1: H - 18 } : { x0: 0, x1: bx, y0: top, y1: H - 18 };
    }
    const aw = area.x1 - area.x0, ah = area.y1 - area.y0;
    const R = Math.max(60, Math.min(aw / 2 - cs * .62, ah / 2 - ch * .55, 260));
    ring = { cx: (area.x0 + area.x1) / 2, cy: (area.y0 + area.y1) / 2, R, cs, ch };
    slots.forEach((sl, i) => {
      const a = -Math.PI / 2 + i / n * TAU;
      sl.a = a; sl.x = ring.cx + Math.cos(a) * R; sl.y = ring.cy + Math.sin(a) * R; sl.w = cs; sl.h = ch;
      if (sl.card) { const cd = sl.card; if (cd.st !== 'fly') { cd.w = cs; cd.h = ch; cd.x = sl.x; cd.y = sl.y; } else { cd.tx = sl.x; cd.ty = sl.y; } }
    });
  }
  function placeTray(tray, cols, tcw, tch, cx, cy, gap = 8) {
    const rows = Math.ceil(tray.length / cols) || 1, th = rows * tch + (rows - 1) * gap;
    tray.forEach((cd, i) => {
      const r = Math.floor(i / cols), inRow = Math.min(cols, tray.length - r * cols), j = i - r * cols;
      const rowW = inRow * tcw + (inRow - 1) * gap, sx = cx - rowW / 2, jj = lang === 'ar' ? inRow - 1 - j : j;
      cd.hx = sx + jj * (tcw + gap) + tcw / 2; cd.hy = cy - th / 2 + r * (tch + gap) + tch / 2; cd.w = tcw; cd.h = tch;
      if (cd.st === 'tray') { cd.x = cd.hx; cd.y = cd.hy; }
    });
  }
  function layoutGrow() {
    const g = grow; if (!g) return;
    g.groundY = portrait ? H * .7 : H * .72;
    g.potX = W / 2; g.potY = portrait ? H * .74 : H * .78;
    g.ps = clamp(Math.min(W * .62, (g.potY - topY) * .95), 180, 420);
    const bs = clamp(Math.min(W, H) * .17, 74, 110);
    const by = H - bs * .7 - 16;
    g.tools = [{ id: 'water', x: W / 2 + (lang === 'ar' ? 1 : -1) * bs * .85, y: by, r: bs / 2 }, { id: 'sun', x: W / 2 - (lang === 'ar' ? 1 : -1) * bs * .85, y: by, r: bs / 2 }];
    if (!portrait) { g.tools[0].x = W / 2 - g.ps * .75; g.tools[1].x = W / 2 + g.ps * .75; g.tools.forEach(t => { t.y = g.potY - bs * .2; }); }
    g.sunX = W * (portrait ? .78 : .82); g.sunY = Math.max(topY + 50, H * .2); g.sunR = clamp(Math.min(W, H) * .08, 34, 60);
  }

  /* ---------- المستويات ---------- */
  function setProg() {
    progEl.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    progEl.innerHTML = Array.from({ length: total }, (_, i) => `<i class="${i < done ? 'on' : ''}"></i>`).join('');
  }
  function bumpProg() { const i = progEl.children[done - 1]; if (i) i.classList.add('on'); }
  function showHint(t) { hintT.textContent = t; hintEl.style.opacity = 1; }
  function hideHint() { hintEl.style.opacity = 0; }
  function startLevel(n) {
    lvl = clamp(n, 1, LEVELS.length); def = LEVELS[lvl - 1]; mode = def.m;
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    tasks = []; parts = []; rings = []; drag = null; over = false; mistakes = 0; done = 0; idleT = 0; play = null; grow = null; cards = []; slots = [];
    if (mode === 'order') {
      cyc = CYC[def.c];
      const n = cyc.st.length;
      slots = cyc.st.map((st, i) => ({ i, st, card: null, glow: 0, pop: 0 }));
      cards = cyc.st.map((st, i) => mkCard(st, def.c, { i }));
      let rest = cards.slice();
      if (!def.free) { const c0 = cards[0]; c0.done = true; c0.st = 'placed'; slots[0].card = c0; rest = cards.slice(1); }
      if (def.x) { const xs = CYC[def.x].st, st = xs[Math.floor(xs.length / 2)]; rest.push(mkCard(st, def.x, { i: -1, foreign: true })); }
      shuffle(rest);
      cards = [...cards.filter(c => c.done), ...rest];
      rest.forEach((c, i) => { c.intro = -.25 - i * .07; });
      total = n - (def.free ? 0 : 1);
      layout();
      later(.4, askCurrent);
      showHint('👆 ' + App.g('اسحبي', 'اسحب') + ' كل مرحلة إلى مكانها في الدائرة');
    } else {
      cyc = CYC.plant;
      grow = { g: 0, gt: 0, step: 0, k: 0, needs: def.needs, v: def.v, act: null, actT: 0, bubble: 0, wrong: 0, sad: 0, harvest: false, tools: [], drops: [] };
      total = 4;
      layout();
      later(.5, () => { say(App.g('ازرعي', 'ازرع') + ' البذرة', 'Grow the seed'); later(1.8, sayNeed); });
      showHint('💧☀️ ' + App.g('أعطي', 'أعطِ') + ' البذرة ما تحتاجه لتكبر');
    }
    setProg();
    Sound.whoosh();
  }

  /* ----- وضع الترتيب ----- */
  function nearestSlot(x, y) {
    let best = null, bd = 1e9;
    for (const sl of slots) { const d = Math.hypot(x - sl.x, y - sl.y); if (d < bd) { bd = d; best = sl; } }
    return bd < ring.cs * .85 ? best : null;
  }
  function dropCard(cd) {
    const sl = nearestSlot(cd.x, cd.y);
    if (!sl || sl.card) { sendBack(cd); Sound.slide(); return; }
    if (!cd.foreign && cd.i === sl.i) {
      sl.card = cd; cd.done = true; sl.pop = 1;
      flyTo(cd, sl.x, sl.y, () => { cd.st = 'placed'; cd.w = ring.cs; cd.h = ring.ch; });
      Sound.pop(); Sound.star(); vibrate(20); sparkle(sl.x, sl.y, cyc.c);
      done++; bumpProg(); hideHint();
      sayStage(cd.st_);
      later(.5, () => { layoutOrder(); cards.filter(c => !c.done && c.st === 'tray').forEach(c => { c.st = 'back'; c.t = 0; c.fx = c.x; c.fy = c.y; }); });
      if (slots.every(s => s.card)) later(1.3, startPlay);
    } else {
      mistakes++; cd.errs++; cd.shake = 1; shake = 3; sendBack(cd); Sound.error(); vibrate(30);
      if (cd.foreign) { later(.3, () => say(cd.st_.ar, cd.st_.en)); later(1.2, sayTry); }
      else later(.3, sayTry);
      if (cd.errs >= 2 && !cd.foreign) { const r = slots[cd.i]; r.glow = 4; }
    }
  }
  function startPlay() {
    const fx = cards.find(c => c.foreign); if (fx) { fx.st = 'gone'; fx.fade = 1; }
    play = { i: 0, t: 0, steps: cyc.st.length * 2 + 1, n: 0, dot: 0, g: 0 };
    layoutOrder();
    say(cyc.ar, cyc.en);
    Sound.whoosh();
    later(1.4, playStep);
  }
  function playStep() {
    if (!play) return;
    const n = cyc.st.length;
    if (play.n >= play.steps) { win(); return; }
    const i = play.n % n; play.i = i; play.t = 0; play.n++;
    const sl = slots[i]; sl.pop = 1; if (sl.card) sl.card.pop = 1;
    Sound.tone(520 + i * 90, .16, 'triangle', .12, 120); sparkle(sl.x, sl.y, cyc.c);
    sayStage(cyc.st[i]);
    later(1.55, playStep);
  }

  /* ----- وضع الزراعة ----- */
  function sayNeed() {
    if (!grow || grow.harvest) return;
    const need = grow.needs[grow.k];
    if (need === 'water') say('أريد الماء', 'I need water'); else say('أريد الشمس', 'I need sunshine');
  }
  function useTool(id) {
    const g = grow; if (!g || g.act || g.harvest || over) return;
    const t = g.tools.find(q => q.id === id); if (t) t.pop = 1;
    const need = g.needs[g.k];
    if (id !== need) {
      mistakes++; g.wrong = 1; g.sad = 1.2; shake = 3; Sound.error(); vibrate(30);
      later(.3, sayNeed); return;
    }
    g.act = id; g.actT = 0; Sound.tap();
    if (id === 'water') { Sound.noise(1.1, 1200, 3000, .07, 1.2, .25); }
    else { Sound.tone(660, .4, 'sine', .1, 330); Sound.tone(990, .4, 'sine', .06, 400, .15); }
    later(1.25, () => {
      g.act = null; g.k++;
      if (g.k >= g.needs.length) { g.k = 0; growStep(); }
      else { g.bubble = 1; Sound.pop(); later(.3, sayNeed); }
    });
  }
  function growStep() {
    const g = grow; g.step++; g.from = g.g; g.gt = 0; g.growing = true;
    Sound.merge(g.step * 2); Sound.star(); vibrate(25);
    sparkle(g.potX, g.potY - g.ps * .3, '#69DB7C');
    done++; bumpProg(); hideHint();
    later(.6, () => sayStage(CYC.plant.st[g.step]));
    if (g.step >= 4) { g.harvest = true; later(2.2, () => { for (let i = 0; i < 3; i++) later(i * .25, () => { Sound.pop(); sparkle(g.potX + rand(-60, 60), g.potY - g.ps * .45, FRUITS[g.v][1]); }); }); later(3.4, win); }
    else later(2.4, () => { g.bubble = 1; sayNeed(); });
  }

  /* ---------- الفوز ---------- */
  function win() {
    if (over) return;
    over = true; play = null;
    const pr = loadProg();
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('lifecycleProg', pr);
    for (let i = 0; i < 130; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 240), rot: rand(0, TAU), vr: rand(-8, 8), life: rand(2.5, 4), age: 0, s: rand(6, 11), c: ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9'][i % 6] });
    Sound.win();
    later(1.2, () => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنتَ!') + ' 🎉';
      root.querySelector('.wic').textContent = mode === 'grow' ? '🌱🌿🌷🍅' : { plant: '🌱🌷🍅', butterfly: '🥚🐛🦋', frog: '🥚🐸', chicken: '🥚🐥🐔', human: '👶🏾🧒🏾👴🏾', water: '🌊☁️🌧️' }[def.c];
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wP').textContent = (mode === 'grow' ? App.g('زرعتِ', 'زرعتَ') + ' نبتة حتى أثمرت' : App.g('رتّبتِ', 'رتّبتَ') + ' ' + cyc.ar) + (mistakes ? '' : ' دون أخطاء! 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < LEVELS.length ? '' : 'none';
      winOv.classList.add('on');
      if (window.gsap) try { gsap.fromTo(root.querySelector('#lcWin .wic'), { scale: .3, rotation: -20 }, { scale: 1, rotation: 0, duration: .8, ease: 'elastic.out(1,0.45)' }); } catch (e) {}
      sayGood();
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('lifecycle_first');
      if (mode === 'grow') App.achieve('lifecycle_gardener');
      if (mode === 'order' && def.c === 'water') App.achieve('lifecycle_water');
      if (LEVELS.every((_, i) => pr.stars[i + 1])) App.achieve('lifecycle_all');
    });
  }
  function openLevels() {
    const pr = loadProg(), g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((Lv, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      const e = Lv.m === 'grow' ? '🪴' : CYC[Lv.c].ic;
      return `<button class="lvb${Lv.m === 'grow' ? ' grow' : ''}${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}"><span class="n">${num(n)}</span>
        <span class="md">${Lv.x ? '⭐' : Lv.m === 'grow' ? '💧' : '🔄'}</span><span class="e">${e}</span>
        <span class="s">${lock ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    g.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
    if (window.gsap) try { gsap.fromTo(g.children, { y: 16, autoAlpha: 0, scale: .9 }, { y: 0, autoAlpha: 1, scale: 1, stagger: .025, duration: .35, ease: 'back.out(1.8)', clearProps: 'transform,opacity,visibility' }); } catch (e) {}
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
  sayBtn.addEventListener('click', () => { if (paused) return; Sound.tap(); askCurrent(); });
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'ar'; store.set('lifecycleLang', lang);
    root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
    setProg();
  }
  root.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === lang) return;
    Sound.tap(); setLang(b.dataset.l); if (W) layout(); askCurrent();
  }));

  /* ---------- الجسيمات ---------- */
  function sparkle(x, y, col) {
    for (let i = 0; i < 16; i++) {
      const a = rand(0, TAU), v = rand(80, 240);
      parts.push({ t: 'star', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .9), age: 0, s: rand(5, 9), c: i % 2 ? '#FFE26B' : col });
    }
    rings.push({ x, y, age: 0, life: .45 });
  }

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  const blocked = () => App.current !== ID || paused || winOv.classList.contains('on') || lvOv.classList.contains('on') || over;
  cv.addEventListener('pointerdown', e => {
    if (blocked() || drag) return;
    const p = pos(e); idleT = 0;
    if (mode === 'grow') {
      const g = grow; if (!g) return;
      const t = g.tools.find(q => Math.hypot(p.x - q.x, p.y - q.y) < q.r * 1.15);
      if (t) { useTool(t.id); return; }
      if (Math.hypot(p.x - g.sunX, p.y - g.sunY) < g.sunR * 1.5) { useTool('sun'); return; }
      if (Math.abs(p.x - g.potX) < g.ps * .3 && p.y < g.potY + g.ps * .15 && p.y > g.potY - g.ps * .7) { g.wiggle = 1; Sound.tone(700, .1, 'sine', .1, 300); sayStage(CYC.plant.st[g.step]); }
      return;
    }
    if (play) return;
    const cd = [...cards].reverse().find(c => !c.done && (c.st === 'tray' || c.st === 'back') && cardHit(c, p.x, p.y, 4));
    if (cd) {
      try { cv.setPointerCapture(e.pointerId); } catch (er) {}
      drag = { id: e.pointerId, cd, ox: cd.x - p.x, oy: cd.y - p.y, sx: p.x, sy: p.y, moved: false, t0: performance.now(), lx: p.x, vx: 0, touch: e.pointerType !== 'mouse' };
      cd.st = 'drag'; cd.tx = cd.x; cd.ty = cd.y; cd.rot = 0;
      cards.splice(cards.indexOf(cd), 1); cards.push(cd);
      Sound.tone(600, .08, 'sine', .1, 300); vibrate(10);
      return;
    }
    const sl = slots.find(s => s.card && cardHit(s.card, p.x, p.y)); if (sl) { sl.card.pop = 1; sayStage(sl.st); }
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const p = pos(e);
    if (!drag.moved && Math.hypot(p.x - drag.sx, p.y - drag.sy) > 8) { drag.moved = true; sayStage(drag.cd.st_); }
    drag.cd.tx = p.x + drag.ox; drag.cd.ty = p.y + drag.oy - (drag.touch && drag.moved ? 26 : 0);
    drag.vx = drag.vx * .6 + (p.x - drag.lx) * .4; drag.lx = p.x;
  });
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag, cd = d.cd; drag = null;
    if (!d.moved && performance.now() - d.t0 < 350) { cd.pop = 1; sayStage(cd.st_); sendBack(cd); return; }
    dropCard(cd);
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', e => { if (drag && e.pointerId === drag.id) { const cd = drag.cd; drag = null; sendBack(cd); } });
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < LEVELS.length ? 'next' : 'levels'); return; }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? lvOv.classList.remove('on') : openLevels(); return; }
    if (blocked()) return;
    if (e.key === 'r' || e.key === 'R') { askCurrent(); return; }
    if (mode === 'grow') { if (e.key === 'w' || e.key === 'W' || e.key === '1') useTool('water'); else if (e.key === 's' || e.key === 'S' || e.key === '2') useTool('sun'); return; }
    const k = parseInt(e.key, 10); if (!(k >= 1) || play) return;
    // اختيار البطاقة رقم k من الصندوق ووضعها في أول خانة فارغة
    const list = cards.filter(c => !c.done && (c.st === 'tray' || c.st === 'back'));
    const cd = list[k - 1]; if (!cd) return;
    const sl = slots.find(s => !s.card); if (!sl) return;
    cd.x = sl.x; cd.y = sl.y; dropCard(cd);
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    for (let i = tasks.length - 1; i >= 0; i--) { const t = tasks[i]; t.t -= dt; if (t.t <= 0) { tasks.splice(i, 1); t.fn(); } }
    const k = 1 - Math.exp(-dt * 24);
    for (const cd of cards) {
      cd.intro = Math.min(1, cd.intro + dt / .4);
      cd.pop = Math.max(0, cd.pop - dt * 2.4); cd.shake = Math.max(0, cd.shake - dt * 2.4); cd.glow = Math.max(0, cd.glow - dt);
      if (cd.st === 'drag') { cd.x += (cd.tx - cd.x) * k; cd.y += (cd.ty - cd.y) * k; cd.rot += (clamp((drag ? drag.vx : 0) * .02, -.25, .25) - cd.rot) * k * .5; }
      else if (cd.st === 'back') { cd.t += dt / .38; const t = Math.min(1, cd.t), e = ease.outBack(t); cd.x = lerp(cd.fx, cd.hx, e); cd.y = lerp(cd.fy, cd.hy, e); if (t >= 1) cd.st = 'tray'; }
      else if (cd.st === 'fly') {
        cd.t += dt / .3; const t = Math.min(1, cd.t), e = ease.outCubic(t);
        cd.x = lerp(cd.fx, cd.tx, e); cd.y = lerp(cd.fy, cd.ty, e) - Math.sin(t * Math.PI) * 30;
        cd.w = lerp(cd.w, ring.cs, k); cd.h = lerp(cd.h, ring.ch, k);
        if (t >= 1) { cd.pop = 1; const cb = cd.cb; cd.cb = null; cd.st = 'placed'; if (cb) cb(); }
      } else if (cd.st === 'gone') { cd.fade -= dt * 2; cd.alpha = Math.max(0, cd.fade); cd.y += 60 * dt; if (cd.fade <= 0) cd.hide = true; }
    }
    slots.forEach(s => { s.glow = Math.max(0, s.glow - dt); s.pop = Math.max(0, s.pop - dt * 2); });
    if (play) { play.t += dt; play.dot += dt / 1.55; }
    if (grow) {
      const g = grow;
      if (g.growing) { g.gt += dt / 1.6; const e = ease.outBack(Math.min(1, g.gt)); g.g = lerp(g.from, g.step, Math.min(1.08, e)); if (g.gt >= 1) { g.g = g.step; g.growing = false; } }
      if (g.act) {
        g.actT += dt;
        if (g.act === 'water' && g.actT > .35 && g.actT < 1.05 && Math.random() < dt * 40) g.drops.push({ x: g.potX + rand(-g.ps * .12, g.ps * .12) + g.ps * .02, y: g.potY - g.ps * .62, vy: rand(160, 260), age: 0 });
      }
      for (let i = g.drops.length - 1; i >= 0; i--) { const d = g.drops[i]; d.age += dt; d.vy += 500 * dt; d.y += d.vy * dt; if (d.y > g.potY - g.ps * .02) { g.drops.splice(i, 1); parts.push({ t: 'spl', x: d.x, y: g.potY - g.ps * .02, life: .3, age: 0 }); } }
      g.bubble = Math.max(0, g.bubble - dt * 2); g.wrong = Math.max(0, g.wrong - dt * 2.4); g.sad = Math.max(0, g.sad - dt); g.wiggle = Math.max(0, (g.wiggle || 0) - dt * 2);
      g.tools.forEach(t => { t.pop = Math.max(0, (t.pop || 0) - dt * 2.4); });
      if (!g.act && !g.growing && !g.harvest && !over) { idleT += dt; if (idleT > 9) { idleT = 0; g.hintTool = 3; sayNeed(); } }
      g.hintTool = Math.max(0, (g.hintTool || 0) - dt);
    }
    if (mode === 'order' && !play && !over && !drag) { idleT += dt; if (idleT > 11) { idleT = 0; const cd = cards.find(c => !c.done && !c.foreign && c.st === 'tray'); if (cd) { cd.glow = 3; slots[cd.i].glow = 3; } } }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.t === 'conf') { q.vy = Math.min(q.vy + 260 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; q.rot += q.vr * dt; }
      else if (q.t === 'star') { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 300 * dt; q.rot += q.vr * dt; }
      if (q.vx != null) { q.x += q.vx * dt; q.y += q.vy * dt; }
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    shake = Math.max(0, shake - dt * 16);
  }

  /* ---------- الرسم ---------- */
  function background(cols) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, cols[0]); g.addColorStop(1, cols[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    for (let i = 0; i < 16; i++) { const x = (i * 197 + Math.sin(T * .3 + i) * 12) % W, y = (i * 113 + 50) % H; ctx.beginPath(); ctx.arc(x, y, 8 + (i % 5) * 7, 0, TAU); ctx.fill(); }
  }
  function shelf(b) {
    const g = ctx.createLinearGradient(0, b.y, 0, b.y + b.h); g.addColorStop(0, 'rgba(255,255,255,.6)'); g.addColorStop(1, 'rgba(255,255,255,.8)');
    ctx.fillStyle = g; rr(ctx, b.x, b.y, b.w, b.h, 26); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 3; ctx.stroke();
  }
  function drawRing() {
    const { cx, cy, R, cs } = ring, n = slots.length, col = cyc.c;
    // مسار سميك بظل
    ctx.save(); ctx.shadowColor = 'rgba(20,40,20,.2)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 8;
    ctx.strokeStyle = mix(col, '#ffffff', .72); ctx.lineWidth = cs * .34; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = mix(col, '#ffffff', .86); ctx.lineWidth = cs * .22; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, R - cs * .1, Math.PI * 1.1, Math.PI * 1.6); ctx.stroke();
    // الأسهم بين المراحل
    const gap = Math.min(TAU / n * .42, (cs * .66) / R);
    for (let i = 0; i < n; i++) {
      const a0 = -Math.PI / 2 + i / n * TAU + gap, a1 = -Math.PI / 2 + (i + 1) / n * TAU - gap;
      const active = play && play.i === i;
      const lit = slots[i].card && slots[(i + 1) % n].card;
      ctx.save();
      ctx.strokeStyle = lit ? col : mix(col, '#ffffff', .5); ctx.lineWidth = cs * .1; ctx.lineCap = 'round';
      if (!lit) ctx.setLineDash([cs * .08, cs * .12]);
      ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1 - .06); ctx.stroke();
      if (play) {
        ctx.setLineDash([cs * .06, cs * .1]); ctx.lineDashOffset = -T * 60; ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = cs * .04;
        ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1 - .06); ctx.stroke();
      }
      ctx.restore();
      // رأس السهم
      const hx = cx + Math.cos(a1) * R, hy = cy + Math.sin(a1) * R, ta = a1 + Math.PI / 2, hs = cs * (active ? .2 : .16) * (1 + (active ? .15 * Math.sin(T * 10) : 0));
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(ta);
      ctx.fillStyle = lit ? col : mix(col, '#ffffff', .5); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(hs, 0); ctx.lineTo(-hs * .7, -hs * .85); ctx.lineTo(-hs * .7, hs * .85); ctx.closePath(); ctx.stroke(); ctx.fill();
      ctx.restore();
      // نقطة تتحرك على السهم أثناء العرض
      if (active) {
        const t = clamp(play.t / 1.3, 0, 1), a = lerp(a0, a1, ease.inOut(t));
        ctx.save(); ctx.translate(cx + Math.cos(a) * R, cy + Math.sin(a) * R); ctx.rotate(T * 4); ctx.fillStyle = '#FFD43B'; ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 14; starPath(ctx, cs * .13); ctx.fill(); ctx.restore();
      }
    }
  }
  function drawSlots() {
    const n = slots.length;
    for (const sl of slots) {
      if (sl.card && sl.card.st === 'placed') continue;
      const hov = drag && nearestSlot(drag.cd.x, drag.cd.y) === sl;
      const w = sl.w, h = sl.h, r = Math.min(w, h) * .24;
      ctx.save(); ctx.translate(sl.x, sl.y);
      if (sl.glow > 0) { ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(T * 9); ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 22; ctx.fillStyle = '#FFE066'; rr(ctx, -w / 2 - 5, -h / 2 - 5, w + 10, h + 10, r + 4); ctx.fill(); ctx.restore(); }
      ctx.fillStyle = hov ? 'rgba(255,236,153,.9)' : 'rgba(255,255,255,.75)'; rr(ctx, -w / 2, -h / 2, w, h, r); ctx.fill();
      ctx.setLineDash([9, 7]); ctx.lineWidth = 3.5; ctx.strokeStyle = hov ? '#FAB005' : mix(cyc.c, '#ffffff', .25); ctx.stroke(); ctx.setLineDash([]);
      textFit(ctx, num(sl.i + 1), 0, 0, w, h * .42, mix(cyc.c, '#ffffff', .4));
      ctx.restore();
    }
    // شارات الأرقام على البطاقات الموضوعة
    for (const sl of slots) {
      if (!(sl.card && sl.card.st === 'placed')) continue;
      const bx = sl.x + (lang === 'ar' ? 1 : -1) * sl.w * .44, by = sl.y - sl.h * .44, br = Math.max(11, sl.w * .14);
      ball(ctx, bx, by, br, mix(cyc.c, '#ffffff', .5), cyc.c, shade(cyc.c, -.3)); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.stroke();
      textFit(ctx, num(sl.i + 1), bx, by + 1, br * 1.6, br * 1.15, '#fff');
    }
    // علم البداية
    const s0 = slots[0]; if (s0) { const fy = s0.y - s0.h / 2 - 14; label(lang === 'ar' ? 'ابدأ' : 'Start', s0.x, fy, cyc.c, clamp(ring.cs * .15, 11, 15)); }
  }
  function label(text, x, y, col, size) {
    ctx.save();
    ctx.font = `900 ${size}px ${FONT}`; ctx.direction = lang === 'ar' ? 'rtl' : 'ltr';
    const w = ctx.measureText(text).width + size * 1.4, h = size * 1.6;
    ctx.fillStyle = 'rgba(0,0,0,.14)'; rr(ctx, x - w / 2, y - h / 2 + 3, w, h, h / 2); ctx.fill();
    ctx.fillStyle = '#fff'; rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + size * .05);
    ctx.restore();
  }
  function drawCenter() {
    const { cx, cy, R, cs } = ring, r = Math.max(36, R - cs * .62 - 6);
    ctx.save(); ctx.shadowColor = 'rgba(20,40,20,.22)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6;
    ctx.fillStyle = shade(cyc.c, -.2); ctx.beginPath(); ctx.arc(cx, cy + 5, r, 0, TAU); ctx.fill(); ctx.restore();
    ctx.fillStyle = cyc.c; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
    const g = ctx.createRadialGradient(cx - r * .3, cy - r * .4, r * .1, cx, cy, r); g.addColorStop(0, '#fff'); g.addColorStop(1, mix(cyc.c, '#ffffff', .82));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r - 5, 0, TAU); ctx.fill();
    if (play) {
      const st = cyc.st[play.i], e = ease.outBack(clamp(play.t / .45, 0, 1));
      if (def.c === 'plant') { // النبتة تنمو فعلًا في الوسط
        const prevG = play.n <= 1 ? 0 : cyc.st[(play.i - 1 + cyc.st.length) % cyc.st.length].g;
        const gv = play.i === 0 ? 0 : lerp(prevG, st.g, clamp(play.t / .9, 0, 1));
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r - 5, 0, TAU); ctx.clip(); ctx.translate(cx, cy + r * .3); soilC(r * 1.5); drawPlant(ctx, r * 1.75, Math.max(gv, .02), { sway: Math.sin(T * 2) * .2 }); ctx.restore();
      } else {
        const bob = Math.sin(T * 3) * r * .03;
        sticker(ctx, st.a.key, st.a.draw, cx, cy - r * .12 + bob, r * 1.05 * e, { sq: Math.sin(play.t * 8) * .04 * (1 - clamp(play.t, 0, 1)) });
      }
      label(L(st), cx, cy + r * .76, shade(cyc.c, -.2), clamp(r * .17, 12, 20));
    } else {
      const f = cyc.st[cyc.st.length - 1];
      ctx.save(); ctx.globalAlpha = .9; sticker(ctx, f.a.key, f.a.draw, cx, cy - r * .16 + Math.sin(T * 2) * 3, r * .78); ctx.restore();
      textFit(ctx, L(cyc), cx, cy + r * .5, r * 1.6, clamp(r * .17, 12, 20), shade(cyc.c, -.35));
    }
  }
  function soilC(s) { ctx.save(); soil(ctx, s, .42); ctx.restore(); }
  /* ---- مشهد الزراعة ---- */
  function wateringCan(c, s, tilt) {
    c.save(); c.rotate(tilt);
    const g = c.createLinearGradient(0, -s * .3, 0, s * .3); g.addColorStop(0, '#74C0FC'); g.addColorStop(1, '#1971C2');
    c.fillStyle = '#1864AB'; c.lineCap = 'round';
    c.strokeStyle = '#1864AB'; c.lineWidth = s * .07; c.beginPath(); c.arc(s * .02, -s * .2, s * .2, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
    c.lineWidth = s * .08; c.strokeStyle = '#339AF0'; c.beginPath(); c.moveTo(-s * .24, s * .08); c.lineTo(-s * .52, -s * .2); c.stroke();
    c.fillStyle = '#1C7ED6'; c.beginPath(); c.ellipse(-s * .54, -s * .22, s * .06, s * .1, -.7, 0, TAU); c.fill();
    c.fillStyle = g; rr(c, -s * .28, -s * .16, s * .56, s * .44, s * .1); c.fill();
    c.fillStyle = 'rgba(255,255,255,.4)'; rr(c, -s * .2, -s * .1, s * .08, s * .3, s * .04); c.fill();
    c.fillStyle = '#FFD43B'; c.beginPath(); c.arc(s * .06, s * .06, s * .07, 0, TAU); c.fill();
    c.restore();
  }
  function drawGrow() {
    const g = grow;
    // سماء وأرض الحديقة
    let gr = ctx.createLinearGradient(0, 0, 0, g.groundY); gr.addColorStop(0, '#74C7FF'); gr.addColorStop(1, '#D9F2FF');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, g.groundY + 2);
    // الشمس
    const sunOn = g.act === 'sun' ? Math.sin(Math.min(1, g.actT / 1.2) * Math.PI) : 0;
    const sr = g.sunR * (1 + sunOn * .25 + ((g.tools[1] && g.tools[1].pop) || 0) * .1);
    ctx.save(); const glow = ctx.createRadialGradient(g.sunX, g.sunY, sr * .3, g.sunX, g.sunY, sr * (3 + sunOn * 2)); glow.addColorStop(0, `rgba(255,240,170,${.7 + sunOn * .3})`); glow.addColorStop(1, 'rgba(255,240,170,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H); ctx.restore();
    if (sunOn > 0) { // أشعة نحو النبتة
      ctx.save(); ctx.globalAlpha = sunOn * .55; ctx.fillStyle = '#FFE066';
      const ang = Math.atan2(g.potY - g.ps * .3 - g.sunY, g.potX - g.sunX);
      for (let i = -2; i <= 2; i++) { const a = ang + i * .08; ctx.beginPath(); ctx.moveTo(g.sunX, g.sunY); ctx.lineTo(g.sunX + Math.cos(a - .025) * H, g.sunY + Math.sin(a - .025) * H); ctx.lineTo(g.sunX + Math.cos(a + .025) * H, g.sunY + Math.sin(a + .025) * H); ctx.fill(); }
      ctx.restore();
    }
    ctx.save(); ctx.translate(g.sunX, g.sunY); ctx.rotate(T * .3);
    ctx.fillStyle = '#FFC93C'; for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); ctx.beginPath(); ctx.moveTo(-sr * .18, -sr * 1.05); ctx.lineTo(0, -sr * (1.5 + .1 * Math.sin(T * 4 + i))); ctx.lineTo(sr * .18, -sr * 1.05); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    sunSmall(ctx, g.sunX, g.sunY, sr);
    // غيوم
    for (let i = 0; i < 3; i++) { const x = ((T * (8 + i * 4) + i * 260) % (W + 240)) - 120, y = topY + 20 + i * 40; ctx.globalAlpha = .9; cloudIcon(ctx, x, y, 90 + i * 20); }
    ctx.globalAlpha = 1;
    // تلال وأرض
    ctx.fillStyle = '#8FD86A'; ctx.beginPath(); ctx.ellipse(W * .15, g.groundY + 10, W * .45, H * .08, 0, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = '#7CCB5A'; ctx.beginPath(); ctx.ellipse(W * .85, g.groundY + 14, W * .5, H * .1, 0, Math.PI, TAU); ctx.fill();
    gr = ctx.createLinearGradient(0, g.groundY, 0, H); gr.addColorStop(0, '#A9E36E'); gr.addColorStop(1, '#4CAF3A');
    ctx.fillStyle = gr; ctx.fillRect(0, g.groundY, W, H - g.groundY);
    // سياج خشبي
    for (let x = 10; x < W; x += 46) { const fg = ctx.createLinearGradient(x, 0, x + 18, 0); fg.addColorStop(0, '#FFF3DD'); fg.addColorStop(1, '#D2AE7C'); ctx.fillStyle = fg; rr(ctx, x, g.groundY - 46, 18, 52, [9, 9, 2, 2]); ctx.fill(); }
    ctx.fillStyle = '#E9CFA4'; rr(ctx, 0, g.groundY - 34, W, 9, 4); ctx.fill(); rr(ctx, 0, g.groundY - 16, W, 9, 4); ctx.fill();
    // الأصيص بوجه لطيف
    const ps = g.ps, px = g.potX, py = g.potY;
    const wig = g.wrong > 0 ? Math.sin(g.wrong * 30) * 6 * g.wrong : 0;
    ctx.fillStyle = 'rgba(30,60,20,.25)'; ctx.beginPath(); ctx.ellipse(px, py + ps * .26, ps * .3, ps * .05, 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(px + wig, py);
    const pg = ctx.createLinearGradient(-ps * .25, 0, ps * .25, 0); pg.addColorStop(0, '#FF9A6B'); pg.addColorStop(.6, '#E8673C'); pg.addColorStop(1, '#B4461F');
    ctx.fillStyle = pg; ctx.beginPath(); ctx.moveTo(-ps * .25, -ps * .02); ctx.lineTo(ps * .25, -ps * .02); ctx.lineTo(ps * .2, ps * .26); ctx.quadraticCurveTo(0, ps * .29, -ps * .2, ps * .26); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#C8532A'; rr(ctx, -ps * .29, -ps * .07, ps * .58, ps * .09, ps * .03); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.3)'; rr(ctx, -ps * .26, -ps * .065, ps * .5, ps * .02, ps * .01); ctx.fill();
    // الوجه
    const sad = g.sad > 0, happy = g.growing || g.harvest;
    ctx.fillStyle = '#4A1E0C';
    for (const sd of [-1, 1]) { ctx.beginPath(); if (happy) { ctx.lineWidth = ps * .012; ctx.strokeStyle = '#4A1E0C'; ctx.arc(sd * ps * .07, ps * .1, ps * .02, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); } else { ctx.ellipse(sd * ps * .07, ps * .095, ps * .015, ps * .022, 0, 0, TAU); ctx.fill(); } }
    ctx.strokeStyle = '#4A1E0C'; ctx.lineWidth = ps * .012; ctx.lineCap = 'round'; ctx.beginPath();
    if (sad) ctx.arc(0, ps * .19, ps * .04, Math.PI * 1.2, Math.PI * 1.8); else ctx.arc(0, ps * .13, ps * .04, .3, Math.PI - .3); ctx.stroke();
    ctx.fillStyle = 'rgba(255,200,180,.6)'; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * ps * .13, ps * .14, ps * .025, ps * .014, 0, 0, TAU); ctx.fill(); }
    // التربة والنبتة
    ctx.save(); ctx.translate(0, -ps * .06); ctx.scale(.62, .5); soil(ctx, ps * .9, .38); ctx.restore();
    const wg = (g.wiggle || 0) > 0 ? Math.sin(g.wiggle * 20) * .4 * g.wiggle : 0;
    ctx.save(); ctx.translate(0, -ps * .07); drawPlant(ctx, ps * 1.2, g.g, { sway: Math.sin(T * 1.8) * .15 + wg, fruit: FRUITS[g.v], flower: FLOWERS[g.v] }); ctx.restore();
    ctx.restore();
    // قطرات الماء
    for (const d of g.drops) drop(ctx, d.x, d.y, ps * .02, '#4DABF7');
    // إبريق السقي فوق النبتة أثناء السقي
    if (g.act === 'water') {
      const t = g.actT, inn = clamp(t / .3, 0, 1), out = clamp((t - 1.05) / .2, 0, 1);
      const x = lerp(W + 80, px + ps * .26, ease.outCubic(inn)) + out * 200, y = py - ps * .72;
      ctx.save(); ctx.translate(x, y); wateringCan(ctx, ps * .45, -.5 * clamp((t - .2) / .2, 0, 1) * (1 - out)); ctx.restore();
    }
    // فقاعة الحاجة
    if (!g.act && !g.growing && !g.harvest && !over) {
      const need = g.needs[g.k], bs = clamp(ps * .2, 44, 74), bx = px + (lang === 'ar' ? -1 : 1) * ps * .36, by = py - ps * .6 - Math.sin(T * 2.4) * 4;
      const pp = 1 + Math.sin((1 - g.bubble) * Math.PI * 3) * g.bubble * .15 + (g.wrong > 0 ? .1 * g.wrong : 0);
      ctx.save(); ctx.translate(bx, by); ctx.scale(pp, pp);
      ctx.shadowColor = 'rgba(0,0,0,.15)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4; ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(0, 0, bs * .62, 0, TAU); ctx.fill(); ctx.shadowColor = 'transparent';
      const sd = lang === 'ar' ? 1 : -1;
      ctx.beginPath(); ctx.arc(sd * bs * .45, bs * .6, bs * .12, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(sd * bs * .7, bs * .85, bs * .07, 0, TAU); ctx.fill();
      ctx.strokeStyle = need === 'water' ? '#74C0FC' : '#FFC93C'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, bs * .62, 0, TAU); ctx.stroke();
      if (need === 'water') drop(ctx, 0, bs * .02, bs * .32, '#339AF0'); else sunSmall(ctx, 0, 0, bs * .24);
      ctx.restore();
    }
    // اسم المرحلة
    label(L(CYC.plant.st[Math.min(4, g.step)]), px, py + ps * .36, '#2F9E44', clamp(ps * .065, 14, 20));
    // أزرار الأدوات
    for (const t of g.tools) {
      const need = g.needs[g.k] === t.id && (g.hintTool > 0);
      const sq = Math.sin((1 - (t.pop || 0)) * Math.PI * 3) * (t.pop || 0) * .14;
      ctx.save(); ctx.translate(t.x, t.y + (need ? Math.sin(T * 8) * 4 : 0)); ctx.scale(1 + sq, 1 - sq);
      if (need) { ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(T * 9); ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 24; ctx.fillStyle = '#FFE066'; ctx.beginPath(); ctx.arc(0, 0, t.r * 1.15, 0, TAU); ctx.fill(); ctx.restore(); }
      const col = t.id === 'water' ? ['#A5D8FF', '#339AF0', '#1864AB'] : ['#FFF3BF', '#FFC93C', '#E8890C'];
      ctx.fillStyle = col[2]; ctx.beginPath(); ctx.arc(0, t.r * .12, t.r, 0, TAU); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, t.r, 0, TAU); ctx.fill();
      ball(ctx, 0, 0, t.r * .86, col[0], col[1], col[2]);
      ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.ellipse(-t.r * .25, -t.r * .45, t.r * .35, t.r * .14, -.3, 0, TAU); ctx.fill();
      if (t.id === 'water') { ctx.save(); ctx.translate(t.r * .05, t.r * .05); wateringCan(ctx, t.r * 1.15, 0); ctx.restore(); }
      else sunSmall(ctx, 0, 0, t.r * .4);
      ctx.restore();
      textFit(ctx, t.id === 'water' ? (lang === 'ar' ? 'ماء' : 'Water') : (lang === 'ar' ? 'شمس' : 'Sun'), t.x, t.y + t.r + 14, t.r * 2.4, clamp(t.r * .3, 13, 18), t.id === 'water' ? '#1864AB' : '#B35C00');
    }
  }
  function render() {
    ctx.save();
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    if (mode === 'grow' && grow) drawGrow();
    else {
      background(cyc.bg);
      if (trayBox) shelf(trayBox);
      drawRing(); drawCenter(); drawSlots();
      const order = cards.slice().sort((a, b) => (a.st === 'drag') - (b.st === 'drag') || (a.st === 'fly') - (b.st === 'fly'));
      for (const cd of order) { cd.lit = play && cd.done && slots[play.i] && slots[play.i].card === cd && play.t < 1.3; drawCard(cd); }
    }
    for (const r of rings) { const t = r.age / r.life; ctx.strokeStyle = `rgba(255,255,255,${(1 - t) * .9})`; ctx.lineWidth = 4 * (1 - t) + 1; ctx.beginPath(); ctx.arc(r.x, r.y, 10 + t * 60, 0, TAU); ctx.stroke(); }
    for (const q of parts) {
      const t = q.age / q.life;
      ctx.save(); ctx.translate(q.x, q.y);
      if (q.t === 'conf') { ctx.rotate(q.rot); ctx.globalAlpha = Math.min(1, (q.life - q.age) * 2); ctx.fillStyle = q.c; ctx.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); }
      else if (q.t === 'spl') { ctx.strokeStyle = `rgba(116,192,252,${1 - t})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(0, 0, 3 + t * 10, 1 + t * 3, 0, 0, TAU); ctx.stroke(); }
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
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); if (!running) render(); }, 80);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    const g = c.createRadialGradient(s * .5, s * .4, s * .05, s * .5, s * .5, s * .8); g.addColorStop(0, '#E9FBE5'); g.addColorStop(1, '#7FD36B');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = s * .07; c.beginPath(); c.arc(s / 2, s / 2, s * .3, 0, TAU); c.stroke();
    c.strokeStyle = '#2F9E44'; c.lineWidth = s * .03; c.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      const a0 = -Math.PI / 2 + i * TAU / 3 + .45, a1 = a0 + TAU / 3 - .9;
      c.beginPath(); c.arc(s / 2, s / 2, s * .3, a0, a1); c.stroke();
      const hx = s / 2 + Math.cos(a1) * s * .3, hy = s / 2 + Math.sin(a1) * s * .3;
      c.save(); c.translate(hx, hy); c.rotate(a1 + Math.PI / 2); c.fillStyle = '#2F9E44'; c.beginPath(); c.moveTo(s * .05, 0); c.lineTo(-s * .03, -s * .045); c.lineTo(-s * .03, s * .045); c.fill(); c.restore();
    }
    c.save(); c.shadowColor = 'rgba(0,0,0,.2)'; c.shadowBlur = 5; c.shadowOffsetY = 2;
    c.save(); c.translate(s * .5, s * .2); c.scale(.9, .9); bflyEggs(c, s * .26); c.restore();
    c.font = `${s * .2}px ${EMOJI_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000';
    c.fillText('🐛', s * .76, s * .64); c.fillText('🦋', s * .24, s * .64);
    c.restore();
    c.save(); c.translate(s * .5, s * .62); soil(c, s * .32); drawPlant(c, s * .36, 1.6); c.restore();
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'دورة الحياة', icon2: '🌱', isNew: true, music: 'shapes',
    desc: () => App.g('رتّبي مراحل الحياة وشاهدي الدورة تتحرك', 'رتّب مراحل الحياة وشاهد الدورة تتحرك'),
    help: () => [
      '🔄 ' + App.g('اسحبي', 'اسحب') + ' كل مرحلة إلى مكانها على الدائرة حسب الأسهم',
      '🥚➡️🐛➡️🦋 بعد الترتيب ' + App.g('شاهدي', 'شاهد') + ' الدورة تتحرك و' + App.g('اسمعي', 'اسمع') + ' اسم كل مرحلة',
      '🪴 في «ازرعها» ' + App.g('أعطي', 'أعطِ') + ' البذرة 💧 الماء و☀️ الشمس لتكبر حتى تُثمر',
      '🌍 ' + App.g('بدّلي', 'بدّل') + ' بين «عربي» و«English»',
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
      setLang(store.get('lifecycleLang', 'ar'));
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, LEVELS.length));
      render(); startLoop();
    },
    leave() { stopLoop(); tasks = []; drag = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { const cd = drag.cd; drag = null; sendBack(cd); } },
    resume() { paused = false; last = performance.now(); },
    back() { if (lvOv.classList.contains('on')) { act('close'); return true; } return false; },
    /* للاختبار الآلي فقط */
    _state() {
      return {
        lvl, mode, done, total, mistakes, over, lang, playing: !!play,
        cards: cards.map(c => ({ id: c.st_.id, i: c.i, foreign: !!c.foreign, x: c.x, y: c.y, st: c.st, done: c.done, hide: c.hide })),
        slots: slots.map(s => ({ i: s.i, x: s.x, y: s.y, filled: !!s.card })),
        grow: grow && { need: grow.needs[grow.k], busy: !!(grow.act || grow.growing), step: grow.step, tools: grow.tools.map(t => ({ id: t.id, x: t.x, y: t.y })) }
      };
    }
  });
})();
