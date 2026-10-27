/* =====================================================================
   حلقات الهرم — لعبة الحلقات الخشبية الملوّنة على العمود
   حلقات لامعة بألوان قوس قزح وبأحجام متدرّجة، يضعها الطفل على العمود
   من الأكبر إلى الأصغر، ثم الكرة في القمة فيبتسم البرج ويتمايل.
   أنماط: الأكبر أولًا، المخروط المقلوب (الأصغر أولًا)، تسلسل الألوان،
   عمودان للفرز حسب اللون، عدّ الحلقات، والحلقة الناقصة.
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'rings';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';
  const AD = '٠١٢٣٤٥٦٧٨٩';
  const AR_N = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة'];
  const EN_N = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const KY = .2;            // ميل المنظور (نرى سطح الحلقة من الأعلى قليلًا)
  const COLS = [
    { k: 'red', h: '#F23B4C', def: 'الحمراء', ind: 'حمراء', en: 'Red' },
    { k: 'orange', h: '#FF8A1C', def: 'البرتقالية', ind: 'برتقالية', en: 'Orange' },
    { k: 'yellow', h: '#FFC928', def: 'الصفراء', ind: 'صفراء', en: 'Yellow' },
    { k: 'green', h: '#2FBF5A', def: 'الخضراء', ind: 'خضراء', en: 'Green' },
    { k: 'blue', h: '#2E8BF0', def: 'الزرقاء', ind: 'زرقاء', en: 'Blue' },
    { k: 'purple', h: '#8A5CF5', def: 'البنفسجية', ind: 'بنفسجية', en: 'Purple' },
    { k: 'pink', h: '#FF5DA8', def: 'الوردية', ind: 'وردية', en: 'Pink' }
  ];
  /* المستويات: m = النمط، n = عدد الحلقات */
  const LV = [
    { m: 'big', n: 3 }, { m: 'big', n: 4 }, { m: 'color', n: 3 }, { m: 'count', n: [3, 4] }, { m: 'big', n: 5 },
    { m: 'cone', n: 4 }, { m: 'sort', n: 6 }, { m: 'miss', n: 5 }, { m: 'color', n: 5 }, { m: 'big', n: 7 },
    { m: 'cone', n: 6 }, { m: 'count', n: [5, 7] }, { m: 'sort', n: 8 }, { m: 'miss', n: 7 }, { m: 'color', n: 7 }
  ];
  const NL = LV.length;
  const MODE_IC = { big: '🔽', cone: '🔼', color: '🎨', sort: '🎯', count: '🔢', miss: '❓' };
  const MODE_AR = { big: 'من الأكبر', cone: 'من الأصغر', color: 'الألوان', sort: 'فرز الألوان', count: 'العدّ', miss: 'الناقصة' };
  const MODE_EN = { big: 'Big first', cone: 'Small first', color: 'Colors', sort: 'Sort', count: 'Count', miss: 'Missing' };

  /* ---------- أدوات ---------- */
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const hx2 = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const rgb = (a, al = 1) => `rgba(${a[0] | 0},${a[1] | 0},${a[2] | 0},${al})`;
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const PAL = {};
  function pal(h) {
    if (PAL[h]) return PAL[h];
    const c = hx2(h), W = [255, 255, 255], K = [40, 10, 60];
    return (PAL[h] = { m: rgb(c), l: rgb(mix(c, W, .45)), ll: rgb(mix(c, W, .72)), d: rgb(mix(c, K, .28)), dd: rgb(mix(c, K, .5)), c });
  }
  const easeIO = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const G = () => window.gsap && Fx && Fx.on ? window.gsap : null;

  /* ---------- اللغة ---------- */
  let lang = 'ar';
  const dg = n => lang === 'ar' ? String(n).replace(/\d/g, d => AD[d]) : String(n);
  const say = (ar, en) => { if (lang === 'en') App.speak(en, 'en'); else App.speak(ar); };
  const sizeOf = r => r.s > .66 ? 2 : r.s < .34 ? 0 : 1;
  const SIZE_AR = ['صغيرة', 'متوسطة', 'كبيرة'], SIZE_EN = ['Small', 'Medium', 'Big'];

  const loadProg = () => { const p = store.get('ringsProg', null) || {}; return { unlocked: clamp(p.unlocked || 1, 1, NL), stars: p.stars || {} }; };

  /* =====================================================================
     الرسم: حلقة، عمود، قاعدة، كرة بوجه مبتسم
     ===================================================================== */
  function ringPath(c, R, th) {
    const h2 = th / 2, Rs = R * .84;
    c.beginPath();
    c.moveTo(-Rs, -h2);
    c.quadraticCurveTo(-R * 1.16, 0, -Rs, h2);
    c.ellipse(0, h2, Rs, Rs * KY, 0, Math.PI, 0, true);
    c.quadraticCurveTo(R * 1.16, 0, Rs, -h2);
    c.ellipse(0, -h2, Rs, Rs * KY, 0, 0, Math.PI, true);
    c.closePath();
  }
  /** حلقة دونات لامعة مركزها (0,0) */
  function drawRing(c, R, th, hex, hr, o = {}) {
    const P = pal(hex), h2 = th / 2, Rs = R * .84;
    // الجسم
    ringPath(c, R, th);
    let g = c.createLinearGradient(-R, 0, R, 0);
    g.addColorStop(0, P.dd); g.addColorStop(.14, P.d); g.addColorStop(.36, P.l); g.addColorStop(.5, P.m); g.addColorStop(.8, P.d); g.addColorStop(1, P.dd);
    c.fillStyle = g; c.fill();
    g = c.createLinearGradient(0, -h2 - Rs * KY, 0, h2 + Rs * KY);
    g.addColorStop(0, 'rgba(255,255,255,.28)'); g.addColorStop(.45, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(30,0,40,.3)');
    c.fillStyle = g; c.fill();
    // السطح العلوي
    c.beginPath(); c.ellipse(0, -h2, Rs * .985, Rs * KY * .985, 0, 0, TAU);
    g = c.createLinearGradient(0, -h2 - Rs * KY, 0, -h2 + Rs * KY);
    g.addColorStop(0, P.m); g.addColorStop(.55, P.l); g.addColorStop(1, P.ll);
    c.fillStyle = g; c.fill();
    // ظل داخلي حول الثقب
    const hR = Math.max(hr, R * .18);
    c.beginPath(); c.ellipse(0, -h2, hR * 1.55, hR * 1.55 * KY, 0, 0, TAU); c.fillStyle = rgb(P.c, .55); c.fill();
    // الثقب
    c.beginPath(); c.ellipse(0, -h2, hR, hR * KY, 0, 0, TAU);
    g = c.createLinearGradient(0, -h2 - hR * KY, 0, -h2 + hR * KY); g.addColorStop(0, 'rgba(40,10,40,.85)'); g.addColorStop(1, P.dd);
    c.fillStyle = g; c.fill();
    // لمعة أمامية
    c.save(); c.lineCap = 'round';
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = Math.max(2, th * .13);
    c.beginPath(); c.ellipse(0, -h2 * .15, Rs * .8, Rs * KY * 1.25 + th * .2, 0, Math.PI * .66, Math.PI * .8); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(-Rs * .25, h2 * .2 + Rs * KY * .9, Math.max(1.5, th * .07), 0, TAU); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = Math.max(1.5, th * .06);
    c.beginPath(); c.ellipse(0, -h2, Rs * .9, Rs * KY * .9, 0, Math.PI * 1.1, Math.PI * 1.5); c.stroke();
    c.restore();
    // حدّ خفيف
    ringPath(c, R, th); c.lineWidth = 1.2; c.strokeStyle = rgb(hx2(hex).map(v => v * .45), .35); c.stroke();
    if (o.ghost) { ringPath(c, R, th); c.fillStyle = 'rgba(255,255,255,.55)'; c.fill(); }
  }
  /** القاعدة الخشبية */
  function drawBase(c, x, y, Rb, bh, ci) {
    // ظل
    let g = c.createRadialGradient(x, y + bh + Rb * KY * .6, 0, x, y + bh + Rb * KY * .6, Rb * 1.25);
    g.addColorStop(0, 'rgba(60,30,80,.32)'); g.addColorStop(1, 'rgba(60,30,80,0)');
    c.save(); c.translate(x, y + bh + Rb * KY); c.scale(1, .28); c.translate(-x, -(y + bh + Rb * KY));
    c.fillStyle = g; c.beginPath(); c.arc(x, y + bh + Rb * KY, Rb * 1.25, 0, TAU); c.fill(); c.restore();
    // الجانب
    c.beginPath(); c.moveTo(x - Rb, y); c.lineTo(x - Rb, y + bh); c.ellipse(x, y + bh, Rb, Rb * KY, 0, Math.PI, 0, true); c.lineTo(x + Rb, y); c.closePath();
    g = c.createLinearGradient(x - Rb, 0, x + Rb, 0);
    g.addColorStop(0, '#A8692E'); g.addColorStop(.3, '#E2A55E'); g.addColorStop(.6, '#C98943'); g.addColorStop(1, '#94591F');
    c.fillStyle = g; c.fill();
    if (ci != null) { // شريط ملوّن يدل على لون العمود
      c.save(); c.clip();
      const P = pal(COLS[ci].h);
      c.beginPath(); c.moveTo(x - Rb, y + bh * .2); c.ellipse(x, y + bh * .2, Rb, Rb * KY, 0, Math.PI, 0, true); c.lineTo(x + Rb, y + bh * .85); c.ellipse(x, y + bh * .85, Rb, Rb * KY, 0, 0, Math.PI, false); c.closePath();
      const g2 = c.createLinearGradient(x - Rb, 0, x + Rb, 0); g2.addColorStop(0, P.dd); g2.addColorStop(.35, P.l); g2.addColorStop(1, P.d);
      c.fillStyle = g2; c.fill(); c.restore();
    }
    // السطح
    c.beginPath(); c.ellipse(x, y, Rb, Rb * KY, 0, 0, TAU);
    g = c.createLinearGradient(0, y - Rb * KY, 0, y + Rb * KY); g.addColorStop(0, '#E9B571'); g.addColorStop(1, '#F8D7A0');
    c.fillStyle = g; c.fill();
    c.save(); c.clip(); c.strokeStyle = 'rgba(150,90,30,.18)'; c.lineWidth = 1.5;
    for (let k = 1; k <= 4; k++) { c.beginPath(); c.ellipse(x + k * 3, y, Rb * k / 5, Rb * KY * k / 5, 0, 0, TAU); c.stroke(); }
    c.restore();
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 2; c.beginPath(); c.lineCap = 'round'; c.ellipse(x, y, Rb * .97, Rb * KY * .97, 0, Math.PI * 1.12, Math.PI * 1.42); c.stroke();
  }
  /** جزء من العمود بين y1 (أسفل) و y2 (أعلى)، مع قمة دائرية إن كانت قمته */
  function drawPoleSeg(c, p, y1, y2, cap) {
    if (y1 <= y2) return;
    const w1 = p.wAt(y1), w2 = p.wAt(y2);
    c.beginPath(); c.moveTo(p.x - w1, y1); c.lineTo(p.x - w2, y2);
    if (cap) c.ellipse(p.x, y2, w2, w2 * .9, 0, Math.PI, 0, false); else c.lineTo(p.x + w2, y2);
    c.lineTo(p.x + w1, y1); c.ellipse(p.x, y1, w1, w1 * KY, 0, 0, Math.PI, false); c.closePath();
    const wm = Math.max(w1, w2), g = c.createLinearGradient(p.x - wm, 0, p.x + wm, 0);
    g.addColorStop(0, '#A9692C'); g.addColorStop(.3, '#F3C27C'); g.addColorStop(.5, '#E4A65C'); g.addColorStop(1, '#9A5D22');
    c.fillStyle = g; c.fill();
    c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = Math.max(1.5, wm * .22); c.lineCap = 'round';
    c.beginPath(); c.moveTo(p.x - w1 * .45, y1 - 3); c.lineTo(p.x - w2 * .45, y2 + (cap ? 0 : 3)); c.stroke();
  }
  /** الكرة الخشبية بوجه مبتسم */
  function drawBall(c, r, x, y, happy, look, blink) {
    let g = c.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r * 1.05);
    g.addColorStop(0, '#FFF1B0'); g.addColorStop(.35, '#FFCF3A'); g.addColorStop(.8, '#F29A12'); g.addColorStop(1, '#C8700A');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(x - r * .38, y - r * .48, r * .26, r * .14, -.6, 0, TAU); c.fill();
    // الوجه
    const lx = (look || 0) * r * .08, ex = r * .32, ey = y - r * .08;
    c.fillStyle = 'rgba(255,90,120,.42)';
    c.beginPath(); c.ellipse(x - r * .55, y + r * .2, r * .17, r * .1, 0, 0, TAU); c.ellipse(x + r * .55, y + r * .2, r * .17, r * .1, 0, 0, TAU); c.fill();
    c.fillStyle = '#3A1B12';
    if (happy > .5) {
      c.strokeStyle = '#3A1B12'; c.lineWidth = r * .1; c.lineCap = 'round';
      for (const s of [-1, 1]) { c.beginPath(); c.arc(x + s * ex, ey + r * .05, r * .12, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
    } else if (blink) {
      c.strokeStyle = '#3A1B12'; c.lineWidth = r * .07; c.lineCap = 'round';
      for (const s of [-1, 1]) { c.beginPath(); c.moveTo(x + s * ex - r * .1, ey); c.lineTo(x + s * ex + r * .1, ey); c.stroke(); }
    } else {
      for (const s of [-1, 1]) {
        c.fillStyle = '#3A1B12'; c.beginPath(); c.ellipse(x + s * ex + lx, ey, r * .11, r * .15, 0, 0, TAU); c.fill();
        c.fillStyle = '#fff'; c.beginPath(); c.arc(x + s * ex + lx - r * .04, ey - r * .06, r * .045, 0, TAU); c.fill();
      }
    }
    c.strokeStyle = '#3A1B12'; c.lineWidth = r * .08; c.lineCap = 'round';
    const sm = .18 + .22 * happy;
    if (happy > .5) {
      c.fillStyle = '#B5263A'; c.beginPath(); c.arc(x, y + r * .22, r * .26, .1, Math.PI - .1); c.closePath(); c.fill();
      c.fillStyle = '#FF7A8E'; c.beginPath(); c.ellipse(x, y + r * .38, r * .12, r * .06, 0, 0, TAU); c.fill();
    } else { c.beginPath(); c.arc(x, y + r * .12, r * sm, Math.PI * .2, Math.PI * .8); c.stroke(); }
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #rings{background:#CDEBFF;overflow:hidden}
  #rings canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #rings .ib{color:#7A3BB8}
  #rings .row1{display:flex;align-items:center;gap:8px;pointer-events:none;max-width:94vw}
  #rings .ttl{background:#fff;color:#4B2A84;font-weight:900;font-size:14px;padding:2px 12px 2px;border-radius:99px;border:3px solid #E9D9FF;box-shadow:0 3px 0 #C9B2F2;white-space:nowrap;text-align:center;line-height:1.1;flex:0 0 auto}
  #rings .ttl small{display:block;font-size:10.5px;font-weight:800;opacity:.65}
  #rings .hud{position:absolute;z-index:4;left:0;right:0;top:calc(max(10px,env(safe-area-inset-top)) + 56px);display:flex;flex-direction:column;align-items:center;gap:7px;pointer-events:none}
  #rings .pbar{display:flex;gap:4px;padding:5px 8px;border-radius:99px;background:rgba(255,255,255,.92);box-shadow:0 3px 0 rgba(90,50,150,.18);max-width:min(92vw,520px)}
  #rings .pbar i{width:clamp(12px,4.6vw,30px);height:12px;border-radius:6px;background:#E3DDF0;box-shadow:inset 0 2px 2px rgba(0,0,0,.1);transition:background .25s}
  #rings .pbar i.tg{background:var(--c);opacity:.35;box-shadow:none}
  #rings .pbar i.cur{box-shadow:0 0 0 2px #fff,0 0 0 4px #FFB020;opacity:1}
  #rings .pbar i.on{background:linear-gradient(180deg,rgba(255,255,255,.5),rgba(255,255,255,0) 60%),var(--c,#FFB020);opacity:1;box-shadow:0 2px 0 rgba(0,0,0,.18)}
  #rings .prm{pointer-events:auto;display:flex;align-items:center;gap:8px;padding:5px 14px;border-radius:99px;background:#fff;border:3px solid #FFE08A;color:#4B2A84;font-weight:900;font-size:clamp(15px,4.3vw,19px);
    box-shadow:0 4px 0 #F2C14E,0 8px 16px rgba(90,50,150,.14);cursor:pointer;max-width:94vw;white-space:nowrap}
  #rings .prm .dots{display:flex;align-items:flex-end;gap:3px}
  #rings .prm .dots i{display:block;border-radius:50%;background:var(--c);box-shadow:inset 0 -2px 0 rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.5)}
  #rings .prm .dots i.cur{outline:3px solid #FFB020;outline-offset:1px}
  #rings .prm .dots i.dn{opacity:.35}
  #rings .spk{position:absolute;z-index:6;left:max(12px,env(safe-area-inset-left));bottom:200px;width:58px;height:58px;border-radius:50%;font-size:26px;display:grid;place-items:center;border:3px solid #FFF3C4;
    background:radial-gradient(circle at 35% 30%,#FFE98A,#FFC21A 60%,#E9A300);box-shadow:0 5px 0 #C98600,0 8px 16px rgba(0,0,0,.2),inset 0 2px 0 rgba(255,255,255,.6);transition:transform .14s var(--press)}
  #rings .spk:active{transform:translateY(3px);box-shadow:0 2px 0 #C98600}
  #rings .lng{display:flex;background:rgba(255,255,255,.95);border-radius:99px;padding:3px;gap:2px;box-shadow:0 4px 0 rgba(90,50,150,.2);border:2px solid #fff}
  #rings .lng button{padding:4px 9px;border-radius:99px;font-weight:900;font-size:14px;background:transparent;color:#5B3A9A;line-height:1.2}
  #rings .lng button.on{background:linear-gradient(180deg,#B48CFF,#8A5CF5);color:#fff;box-shadow:0 2px 0 #6237C9}
  #rings .ans{position:absolute;z-index:6;left:0;right:0;bottom:max(18px,calc(env(safe-area-inset-bottom) + 10px));display:none;justify-content:center;gap:18px}
  #rings .ans.on{display:flex}
  #rings .ans button{width:84px;height:84px;border-radius:50%;font-size:44px;font-weight:900;color:#fff;border:5px solid #fff;line-height:1;
    box-shadow:0 7px 0 var(--d),0 12px 20px rgba(60,20,100,.25);background:radial-gradient(circle at 35% 28%,var(--l),var(--c) 62%);text-shadow:0 3px 0 rgba(0,0,0,.2);transition:transform .14s var(--press)}
  #rings .ans button:active{transform:translateY(4px) scale(1.05,.92)}
  #rings .ans button.no{filter:grayscale(.9);opacity:.45}
  #rings .panel{border-color:#E4D4FF;box-shadow:0 9px 0 #A982F0,0 22px 44px rgba(50,10,100,.32);color:#3E2470}
  #rings .panel h3{color:#7A3BE0;text-shadow:0 3px 0 #EBDDFF}
  #rings .btn{background:linear-gradient(180deg,#B48CFF,#8A5CF5 60%,#7343E6);box-shadow:0 5px 0 #5B2FC0,0 9px 14px rgba(90,40,180,.3)}
  #rings .btn.alt{background:#fff;color:#7343E6;box-shadow:0 5px 0 #D4C1FA;border-color:#EDE3FF}
  #rings .overlay{background:radial-gradient(circle at 50% 45%,rgba(70,30,130,.25),rgba(30,10,70,.55))}
  #rings .lvp{width:min(94vw,480px);padding:16px 12px 14px}
  #rings .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-height:min(62vh,620px);overflow-y:auto;touch-action:pan-y;padding:6px 4px 10px;margin:8px 0 10px}
  #rings .lv{position:relative;border-radius:22px;background:linear-gradient(180deg,#fff,#F3ECFF);padding:6px 4px 6px;display:flex;flex-direction:column;align-items:center;gap:0;border:3px solid #fff;
    box-shadow:0 5px 0 #CDB8F5,0 8px 12px rgba(90,50,150,.12);color:#3E2470;transition:transform .14s var(--press)}
  #rings .lv:active{transform:translateY(3px)}
  #rings .lv canvas{width:76px;height:64px;display:block}
  #rings .lv b{font-size:12.5px;line-height:1.2}
  #rings .lv .n{position:absolute;top:4px;right:6px;width:24px;height:24px;border-radius:50%;background:#8A5CF5;color:#fff;font-weight:900;font-size:14px;display:grid;place-items:center;box-shadow:0 2px 0 #5B2FC0}
  #rings .lv .s{font-size:12px;letter-spacing:-2px}
  #rings .lv .s i{font-style:normal}
  #rings .lv .s i.off{filter:grayscale(1);opacity:.3}
  #rings .lv.lock{filter:grayscale(.85);opacity:.6}
  #rings .lv.lock::after{content:'🔒';position:absolute;top:26px;font-size:26px}
  #rings .lv.cur{background:linear-gradient(180deg,#FFF6C8,#FFE07A);box-shadow:0 5px 0 #E9A300,0 8px 12px rgba(200,140,0,.2)}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <span class="grow"></span>
      <div class="lng"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
      <button class="ib lvb" aria-label="المستويات">🗺️</button>
    </div>
    <div class="hud"><div class="row1"><div class="ttl"><span class="tN"></span><small class="tM"></small></div><div class="pbar"></div></div><div class="prm" role="button" aria-label="إعادة السؤال"></div></div>
    <button class="spk" aria-label="استمع">🔊</button>
    <div class="ans"></div>
    <div class="overlay" id="rgLv"><div class="panel lvp"><h3>🌈 المستويات</h3>
      <div class="grid"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="rgWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄 مرة أخرى</button><button class="btn alt" data-a="levels">🗺️</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const pbar = root.querySelector('.pbar'), prm = root.querySelector('.prm'), spk = root.querySelector('.spk'), ansEl = root.querySelector('.ans');
  const lvOv = root.querySelector('#rgLv'), winOv = root.querySelector('#rgWin');
  const tN = root.querySelector('.tN'), tM = root.querySelector('.tM');

  /* ---------- الحالة ---------- */
  let ctx, Wd = 0, Hd = 0, raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, L = LV[0], poles = [], rings = [], balls = [], phase = 'idle', mistakes = 0, steps = 0, done = 0;
  let seq = [], missS = 0, countN = 0, counted = 0, parts = [], evs = [], drag = null, lastAct = 0, hintR = null;
  let th = 40, Rmax = 100, Rmin = 40, ts = .5, tray = { x: 0, y: 0, w: 0, h: 0 }, x0 = 0, playW = 400, label = null, shake = 0;
  const after = (s, fn) => evs.push({ t: T + s, fn });
  const ballMode = () => L.m === 'big' || L.m === 'cone' || L.m === 'color';

  function Rof(s) { return Rmin + (Rmax - Rmin) * s; }
  function mkPole(x, cap, ci) {
    const p = { x, cap, ci, stack: [], ball: null, wig: 0, bY: 0, topY: 0, cone: L.m === 'cone' };
    p.wAt = y => {
      const pw = th * .19;
      if (!p.cone) return pw;
      const t = clamp((p.bY - y) / Math.max(1, p.bY - p.topY), 0, 1);
      return pw * (.55 + 1.1 * t);
    };
    return p;
  }
  const stackY = (p, k) => p.bY - th / 2 - th * k;
  const ballR = () => th * .82;
  const ballY = p => p.topY - ballR() * .3;

  /* ---------- بدء مستوى ---------- */
  function startLevel(n) {
    lvl = clamp(n, 1, NL); L = LV[lvl - 1];
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    poles = []; rings = []; balls = []; parts = []; evs = []; drag = null; label = null;
    mistakes = 0; done = 0; counted = 0; seq = []; hintR = null;
    const m = L.m;
    let id = 0;
    const mk = (ci, s) => ({ id: id++, ci, s, x: 0, y: 0, sc: .5, rot: 0, st: 'tray', hx: 0, hy: 0, pole: null, k: -1, sqT: -9, wobT: -9, anim: null, vy: 0, ty: 0, hop: 0, cnt: 0 });
    const rainbow = k => Array.from({ length: k }, (_, i) => k >= 7 ? i : Math.round(i * 5 / Math.max(1, k - 1)));
    if (m === 'big' || m === 'cone') {
      const n = L.n, cs = rainbow(n);
      poles.push(mkPole(0, n));
      for (let i = 0; i < n; i++) rings.push(mk(cs[i], 1 - i / (n - 1)));
      steps = n + 1;
    } else if (m === 'color') {
      const n = L.n, cs = shuffle(rainbow(n).slice());
      poles.push(mkPole(0, n));
      seq = cs.slice();
      for (let i = 0; i < n; i++) rings.push(mk(cs[i], .55 + (i % 2) * .02));
      steps = n + 1;
    } else if (m === 'sort') {
      const n2 = L.n / 2, pair = shuffle([0, 2, 3, 4, 5, 6]).slice(0, 2);
      pair.forEach(ci => { poles.push(mkPole(0, n2, ci)); for (let i = 0; i < n2; i++) rings.push(mk(ci, 1 - i / (n2 - 1))); });
      steps = L.n;
    } else if (m === 'count') {
      countN = ri(L.n[0], L.n[1]);
      const p = mkPole(0, countN), cs = rainbow(countN);
      poles.push(p);
      for (let i = 0; i < countN; i++) { const r = mk(cs[i], 1 - i / (countN - 1)); r.st = 'pole'; r.pole = p; r.k = i; p.stack[i] = r; rings.push(r); }
      const b = mkBall(); b.st = 'pole'; b.pole = p; p.ball = b; balls.push(b);
      steps = 1;
    } else if (m === 'miss') {
      const n = L.n, cs = rainbow(n), p = mkPole(0, n);
      poles.push(p);
      const mk_ = ri(1, n - 2);
      missS = 1 - mk_ / (n - 1);
      for (let i = 0; i < n; i++) { if (i === mk_) continue; const r = mk(cs[i], 1 - i / (n - 1)); r.st = 'pole'; r.pole = p; r.k = i; p.stack[i] = r; rings.push(r); }
      p.gap = mk_;
      const step = 1 / (n - 1);
      [missS, missS + step, missS - step].forEach(s => rings.push(mk(cs[mk_], s)));
      const b = mkBall(); b.st = 'pole'; b.pole = p; p.ball = b; balls.push(b);
      steps = 1;
    }
    // ترتيب عشوائي في الصينية
    const trayR = shuffle(rings.filter(r => r.st === 'tray'));
    trayR.forEach((r, i) => r.slot = i);
    phase = 'play';
    layout(true);
    for (const r of rings) if (r.st === 'tray') { r.x = r.hx + rand(-30, 30); r.y = tray.y + tray.h + 30; r.sc = ts; r.anim = { t0: T + .06 * r.slot, dur: .45, fx: r.x, fy: r.y, tx: r.hx, ty: r.hy, arc: 40, done: () => Sound.tone(500 + r.slot * 60, .08, 'sine', .06) }; }
    paintTitle(); paintPrompt(); paintBar(); paintAns();
    lastAct = T;
    after(.5, promptSpeak);
  }
  function mkBall() { return { id: 99, ball: true, ci: -1, s: 0, x: 0, y: 0, sc: 1, rot: 0, st: 'tray', hx: 0, hy: 0, pole: null, sqT: -9, wobT: -9, anim: null, vy: 0, happy: 0 }; }

  /* ---------- التخطيط ---------- */
  function layout(first) {
    const f = fitCanvas(cv); ctx = f.ctx; Wd = f.w; Hd = f.h;
    playW = Math.min(Wd, 1000); x0 = (Wd - playW) / 2;
    const portrait = Wd / Hd < 1.05;
    const top = 150 + (portrait ? 6 : 0);
    const two = poles.length === 2;
    const cap = Math.max(...poles.map(p => p.cap));
    const inTray = rings.filter(r => r.slot != null);
    // تقدير أولي لحجم الحلقات ثم ترتيب الصينية
    let trayH = portrait ? Hd * .2 : 120;
    for (let pass = 0; pass < 2; pass++) {
      const avail = Hd - top - trayH - 24;
      th = clamp(avail / (cap + 3.0), 22, 66);
      Rmax = Math.min(playW * (two ? .21 : .33), th * 3.4, 160);
      th = Math.min(th, Rmax / 2.7);
      Rmin = Math.max(Rmax * .45, th * 1.5);
      ts = portrait ? .52 : .6;
      let rows;
      const packW = playW - 40;
      for (let tries = 0; tries < 8; tries++) {
        rows = [[]]; let w = 0;
        for (const r of inTray.slice().sort((a, b) => a.slot - b.slot)) {
          const iw = 2 * Rof(r.s) * ts * 1.04 + 12;
          if (w + iw > packW && rows[rows.length - 1].length) { rows.push([]); w = 0; }
          rows[rows.length - 1].push([r, iw]); w += iw;
        }
        if (rows.length <= 2 || ts < .36) break;
        ts -= .05;
      }
      const rowH = (th + 2 * Rmax * KY) * ts + 22;
      const nRows = L.m === 'count' ? 0 : Math.max(1, rows.length);
      trayH = L.m === 'count' ? 96 : nRows * rowH + 30;
      tray = { x: x0 + 10, w: playW - 20, h: trayH, y: Hd - trayH - Math.max(12, 10) };
      tray.rows = rows; tray.rowH = rowH;
    }
    const rows = tray.rows;
    rows.forEach((row, ri_) => {
      const tw = row.reduce((a, b) => a + b[1], 0);
      let x = Wd / 2 - tw / 2;
      const cy = tray.y + 18 + tray.rowH * (ri_ + .5);
      for (const [r, iw] of row) { r.hx = x + iw / 2; r.hy = cy; x += iw; }
    });
    // الأعمدة
    const stageBot = tray.y - 14;
    const Rb = Rmax * 1.12, bh = th * .5;
    const bY = stageBot - bh - Rb * KY - 4;
    poles.forEach((p, i) => {
      p.x = two ? Wd / 2 + (i ? 1 : -1) * playW * .24 : Wd / 2 + (Wd > 700 ? -playW * .05 : 0);
      p.bY = bY; p.Rb = Rb; p.bh = bh;
      p.topY = bY - th * p.cap - th * .55;
    });
    for (const r of rings) { r.R = Rof(r.s); if (r.st === 'pole') { r.x = r.pole.x; r.y = r.ty = stackY(r.pole, r.k); } }
    for (const b of balls) { b.R = ballR(); if (b.st === 'pole') { b.x = b.pole.x; b.y = ballY(b.pole); } else { b.hx = Wd / 2; b.hy = tray.y + tray.h / 2; } }
    spk.style.bottom = (Hd - tray.y + 14) + 'px';
    if (first) for (const r of rings) if (r.st === 'tray') { r.x = r.hx; r.y = r.hy; r.sc = ts; }
  }

  /* ---------- النصوص والشريط ---------- */
  function modeName() { return lang === 'en' ? MODE_EN[L.m] : MODE_AR[L.m]; }
  function paintTitle() {
    tN.textContent = (lang === 'en' ? 'Level ' : 'المستوى ') + dg(lvl);
    tM.textContent = MODE_IC[L.m] + ' ' + modeName();
  }
  function dotsHTML(list, curI) { return `<span class="dots">${list.map((d, i) => `<i style="--c:${d.c};width:${d.s}px;height:${d.s}px" class="${i === curI ? 'cur' : i < curI ? 'dn' : ''}"></i>`).join('')}</span>`; }
  function promptText() {
    const en = lang === 'en';
    if (phase === 'ball') return en ? 'Now the ball! 🟡' : 'والآن الكرة! 🟡';
    const m = L.m;
    const sz = [26, 20, 14].map(s => ({ c: '#8A5CF5', s }));
    if (m === 'big') return dotsHTML(sz) + (en ? 'Biggest → smallest' : 'من الأكبر إلى الأصغر');
    if (m === 'cone') return dotsHTML(sz.slice().reverse()) + (en ? 'Smallest → biggest' : 'من الأصغر إلى الأكبر');
    if (m === 'color') {
      const k = poles[0].stack.length, ci = seq[Math.min(k, seq.length - 1)];
      return dotsHTML(seq.map(ci => ({ c: COLS[ci].h, s: 18 })), k) + (en ? COLS[ci].en : COLS[ci].def);
    }
    if (m === 'sort') return dotsHTML(poles.map(p => ({ c: COLS[p.ci].h, s: 18 }))) + (en ? 'Each ring on its color' : 'كل حلقة على عمود لونها');
    if (m === 'count') return '🔢 ' + (en ? 'How many rings?' : 'كم حلقة؟');
    if (m === 'miss') return '❓ ' + (en ? 'Which ring is missing?' : 'أي حلقة ناقصة؟');
    return '';
  }
  function paintPrompt(bump) {
    prm.innerHTML = promptText();
    prm.dir = lang === 'en' ? 'ltr' : 'rtl';
    const g = G(); if (bump && g) g.fromTo(prm, { scale: .85 }, { scale: 1, duration: .5, ease: 'back.out(3)' });
  }
  function paintBar() {
    let html = '';
    const placed = rings.filter(r => r.st === 'pole' || r.st === 'slide' || (r.st === 'fly' && r.pole)).length;
    if (L.m === 'count' || L.m === 'miss') {
      html = `<i class="${phase === 'done' || phase === 'over' ? 'on' : 'cur'}" style="--c:#8A5CF5;width:120px"></i>`;
    } else {
      const order = [];
      if (L.m === 'color') seq.forEach(ci => order.push(COLS[ci].h));
      else for (let i = 0; i < steps - (ballMode() ? 1 : 0); i++) order.push(null);
      if (ballMode()) order.push('#FFC531');
      const doneN = done;
      html = order.map((c, i) => `<i class="${i < doneN ? 'on' : (L.m === 'color' && c ? 'tg' : '') + (i === doneN ? ' cur' : '')}" style="--c:${c || '#FFB020'}"></i>`).join('');
      void placed;
    }
    pbar.innerHTML = html;
    const g = G(), on = pbar.querySelectorAll('i.on');
    if (g && on.length && done > 0) g.fromTo(on[on.length - 1], { scaleY: 1.8, scaleX: 1.2 }, { scaleY: 1, scaleX: 1, duration: .45, ease: 'elastic.out(1,.4)' });
  }
  function paintAns() {
    if (L.m !== 'count') { ansEl.classList.remove('on'); ansEl.innerHTML = ''; return; }
    let opts = new Set([countN]);
    while (opts.size < 3) { const v = countN + pick([-2, -1, 1, 2]); if (v >= 1 && v <= 9) opts.add(v); }
    const cs = [['#FF8FA0', '#F23B4C', '#B81D2E'], ['#7CC0FF', '#2E8BF0', '#1A5FC2'], ['#7DE39A', '#2FBF5A', '#1C8A3C']];
    ansEl.innerHTML = shuffle([...opts]).map((v, i) => `<button data-v="${v}" style="--l:${cs[i][0]};--c:${cs[i][1]};--d:${cs[i][2]}">${dg(v)}</button>`).join('');
    ansEl.classList.add('on');
    ansEl.querySelectorAll('button').forEach(b => b.onclick = () => answer(+b.dataset.v, b));
    const g = G(); if (g) g.fromTo(ansEl.children, { scale: 0 }, { scale: 1, duration: .5, stagger: .08, ease: 'back.out(2.5)', delay: .3, clearProps: 'transform' });
  }
  function promptSpeak() {
    lastAct = T;
    const en = lang === 'en', m = L.m;
    if (phase === 'ball') return say('والآن الكرة!', 'Now the ball!');
    if (phase !== 'play') return;
    if (m === 'big') say(App.g('ضعي الحلقات', 'ضع الحلقات') + ' من الأكبر إلى الأصغر', 'Stack the rings from the biggest to the smallest');
    else if (m === 'cone') say(App.g('ضعي الحلقات', 'ضع الحلقات') + ' من الأصغر إلى الأكبر', 'Stack the rings from the smallest to the biggest');
    else if (m === 'color') {
      const k = poles[0].stack.length;
      if (k === 0) say(seq.map(ci => COLS[ci].def).join(' ثم '), seq.map(ci => COLS[ci].en).join(' then '));
      else say('الحلقة ' + COLS[seq[k]].def, 'The ' + COLS[seq[k]].en + ' ring');
    } else if (m === 'sort') say(App.g('ضعي كل حلقة على عمود لونها', 'ضع كل حلقة على عمود لونها'), 'Put each ring on the pole of its color');
    else if (m === 'count') say('كم حلقة؟', 'How many rings?');
    else if (m === 'miss') say('أي حلقة ناقصة؟', 'Which ring is missing?');
    void en;
  }
  function sayRing(r) {
    const col = COLS[r.ci], sz = sizeOf(r);
    if (L.m === 'color') say('حلقة ' + col.ind, col.en + ' ring');
    else say('حلقة ' + col.ind + ' ' + SIZE_AR[sz], SIZE_EN[sz] + ' ' + col.en.toLowerCase() + ' ring');
  }

  /* ---------- القواعد ---------- */
  const trayRings = () => rings.filter(r => !r.pole && (r.st === 'tray' || r.st === 'drag' || r.st === 'wob'));
  function expected(p) {
    const tr = trayRings();
    if (!tr.length) return null;
    if (L.m === 'big') return tr.reduce((a, b) => b.s > a.s ? b : a);
    if (L.m === 'cone') return tr.reduce((a, b) => b.s < a.s ? b : a);
    if (L.m === 'color') return tr.find(r => r.ci === seq[p.stack.length]) || null;
    if (L.m === 'sort') return tr.find(r => r.ci === p.ci) || null;
    if (L.m === 'miss') return tr.find(r => Math.abs(r.s - missS) < 1e-6) || null;
    return null;
  }
  function accepts(r, p) {
    if (L.m === 'sort') return r.ci === p.ci;
    if (L.m === 'color') return r.ci === seq[p.stack.length];
    const e = expected(p);
    return e === r || (e && Math.abs(e.s - r.s) < 1e-6 && e.ci === r.ci);
  }
  function attempt(r, p) {
    lastAct = T; hintR = null;
    if (r.ball) {
      if (phase === 'ball' && !p.ball) placeBall(r, p); else backToTray(r);
      return;
    }
    if (phase !== 'play') { backToTray(r); return; }
    if (accepts(r, p)) place(r, p); else reject(r, p);
  }
  function place(r, p) {
    const k = L.m === 'miss' ? p.gap : p.stack.length;
    p.stack[k] = r; r.pole = p; r.k = k;
    r.st = 'fly'; r.rot = 0;
    const ty = stackY(p, k);
    const above = Math.min(ty, p.topY) - th * .9;
    r.anim = { t0: T, dur: .26, fx: r.x, fy: r.y, tx: p.x, ty: above, arc: 26, done: () => { r.st = 'slide'; r.vy = 120; r.ty = ty; } };
    Sound.whoosh();
  }
  function landed(r) {
    const p = r.pole;
    r.st = 'pole'; r.y = r.ty; r.x = p.x; r.sqT = T;
    Sound.thud(); Sound.tone(392 * Math.pow(1.122, r.k), .22, 'triangle', .13, 0, .02);
    vibrate(12); p.wig = Math.max(p.wig, .25);
    sparks(p.x, r.y + th * .3, COLS[r.ci].h, 14, r.R);
    done++; paintBar();
    if (L.m === 'miss') { p.gap = null; complete(); return; }
    const left = rings.filter(x => !x.pole).length;
    if (L.m === 'color' && left) after(.35, () => { paintPrompt(true); say(COLS[seq[p.stack.length]].def, COLS[seq[p.stack.length]].en); });
    if (!left) {
      if (ballMode()) {
        phase = 'ball';
        const b = mkBall(); b.R = ballR(); b.hx = Wd / 2; b.hy = tray.y + tray.h / 2; b.x = b.hx; b.y = Hd + 60; b.sc = .3;
        b.anim = { t0: T + .3, dur: .55, fx: b.x, fy: b.y, tx: b.hx, ty: b.hy, arc: 60, done: () => { b.sqT = T; Sound.pop(); } };
        balls.push(b);
        after(.45, () => { paintPrompt(true); say('والآن الكرة!', 'Now the ball!'); });
      } else if (L.m === 'sort') {
        poles.forEach((pp, i) => after(.3 + i * .35, () => {
          const b = mkBall(); b.R = ballR(); b.x = pp.x; b.y = -60; b.pole = pp; pp.ball = b; b.st = 'slide'; b.vy = 0; b.ty = ballY(pp); balls.push(b);
        }));
        after(1.2, complete);
      }
    }
  }
  function placeBall(b, p) {
    p.ball = b; b.pole = p; b.st = 'fly';
    b.anim = { t0: T, dur: .26, fx: b.x, fy: b.y, tx: p.x, ty: ballY(p) - th * 1.6, arc: 26, done: () => { b.st = 'slide'; b.vy = 100; b.ty = ballY(p); } };
    done++; Sound.whoosh();
  }
  function reject(r, p) {
    mistakes++;
    const top = p.stack.length ? stackY(p, Math.max(...p.stack.map((x, i) => x ? i : 0))) : p.bY;
    r.st = 'fly';
    r.anim = { t0: T, dur: .24, fx: r.x, fy: r.y, tx: p.x, ty: Math.min(top, p.topY) - th * 1.1, arc: 22, done: () => {
      r.st = 'wob'; r.wobT = T; Sound.tone(300, .25, 'sine', .14, 260); Sound.error(); vibrate(25); p.wig = .7; shake = .4;
      after(.55, () => { backToTray(r, true); });
    } };
    // تلميح صوتي
    const m = L.m;
    if (m === 'big') after(.3, () => say('الأكبر أولا', 'The biggest first'));
    else if (m === 'cone') after(.3, () => say('الأصغر أولا', 'The smallest first'));
    else if (m === 'color') after(.3, () => say('الحلقة ' + COLS[seq[p.stack.length]].def, 'The ' + COLS[seq[p.stack.length]].en + ' ring'));
    else if (m === 'sort') after(.3, () => say(App.g('حاولي مرة أخرى', 'حاول مرة أخرى'), 'Try again!'));
    else if (m === 'miss') after(.3, () => r.s > missS ? say('كبيرة', 'Too big') : say('صغيرة', 'Too small'));
  }
  function backToTray(r, hop) {
    r.st = 'fly'; r.rot = 0;
    r.anim = { t0: T, dur: .45, fx: r.x, fy: r.y, tx: r.hx, ty: r.hy, arc: hop ? 70 : 20, done: () => { r.st = 'tray'; r.sqT = T; Sound.tone(260, .08, 'sine', .08); } };
  }
  function complete() {
    phase = 'done'; paintBar(); prm.innerHTML = '🎉 ' + (lang === 'en' ? 'Hooray!' : App.g('أحسنتِ!', 'أحسنت!'));
    poles.forEach(p => { p.wig = 1.4; });
    rings.filter(r => !r.pole).forEach((r, i) => { r.st = 'fly'; r.anim = { t0: T + i * .07, dur: .5, fx: r.x, fy: r.y, tx: r.x, ty: Hd + 120, arc: 50, done: () => { r.st = 'gone'; } }; });
    balls.forEach(b => { b.happy = 1; });
    Sound.win();
    after(.25, () => say('أحسنت!', 'Well done!'));
    for (let i = 0; i < 90; i++) confetti();
    after(2.1, showWin);
  }
  function answer(v, btn) {
    if (phase !== 'play') return;
    lastAct = T;
    if (v === countN) {
      Sound.pop(); btn.style.transform = 'scale(1.15)';
      say(AR_N[v], EN_N[v]);
      ansEl.querySelectorAll('button').forEach(b => { if (b !== btn) b.classList.add('no'); });
      // عدّ الحلقات المتبقية بصريًا
      const p = poles[0];
      p.stack.forEach((r, i) => { if (!r.cnt) after(.08 * i, () => { r.cnt = ++counted; r.sqT = T; }); });
      done = 1; after(.7, complete);
    } else {
      mistakes++; Sound.error(); vibrate(25); btn.classList.add('no');
      if (btn.animate) btn.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-12deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(0)' }], { duration: 380 });
      say(App.g('عدّي الحلقات', 'عدّ الحلقات'), 'Count the rings');
    }
  }
  function tapCount(r) {
    lastAct = T;
    if (!r.cnt) r.cnt = ++counted;
    r.sqT = T; Sound.tone(440 * Math.pow(1.122, r.cnt - 1), .15, 'triangle', .12);
    say(AR_N[r.cnt] || String(r.cnt), EN_N[r.cnt] || String(r.cnt));
    sparks(r.x + r.R * .9, r.y, COLS[r.ci].h, 6, 10);
  }

  /* ---------- النهاية ---------- */
  function showWin() {
    phase = 'over';
    const st = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const pr = loadProg(), first = !pr.stars[lvl];
    pr.stars[lvl] = Math.max(pr.stars[lvl] || 0, st);
    pr.unlocked = Math.max(pr.unlocked, Math.min(NL, lvl + 1));
    store.set('ringsProg', pr);
    App.addStars(first ? st : 1);
    App.achieve('rings_first');
    if ((L.m === 'big' || L.m === 'color') && L.n >= 7) App.achieve('rings_rainbow');
    if (Object.keys(pr.stars).filter(k => pr.stars[k]).length >= NL) App.achieve('rings_all');
    winOv.querySelector('.wT').textContent = App.g('أحسنتِ! 🌈', 'أحسنت! 🌈');
    winOv.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= st ? '' : 'off'}">⭐</span>`).join('');
    winOv.querySelector('.wP').textContent = st === 3 ? App.g('بلا أي خطأ! رائعة', 'بلا أي خطأ! رائع') : App.g('برج جميل! جرّبي مرة أخرى لثلاث نجوم', 'برج جميل! جرّب مرة أخرى لثلاث نجوم');
    winOv.querySelector('[data-a="next"]').style.display = lvl < NL ? '' : 'none';
    winOv.classList.add('on');
  }
  function lvThumb(cvs, V) {
    const d = 2, w = 76, h = 64; cvs.width = w * d; cvs.height = h * d;
    const c = cvs.getContext('2d'); c.scale(d, d);
    const n = Array.isArray(V.n) ? V.n[1] : V.m === 'sort' ? V.n / 2 : V.n;
    const two = V.m === 'sort', t = Math.min(9, 44 / (n + 1.5)), Rm = two ? 15 : 26;
    const cols = V.m === 'sort' ? [3, 4] : null;
    const xs = two ? [20, 56] : [38];
    xs.forEach((x, pi) => {
      drawBase(c, x, h - 9, Rm * 1.1, 4, null);
      const p = { x, bY: h - 9, topY: h - 9 - t * n - 6, wAt: () => 2 };
      drawPoleSeg(c, p, h - 9, p.topY, true);
      for (let i = 0; i < n; i++) {
        const s = V.m === 'cone' ? i / (n - 1) : V.m === 'color' ? .6 : 1 - i / (n - 1);
        const ci = cols ? cols[pi] : (n >= 7 ? i : Math.round(i * 5 / Math.max(1, n - 1)));
        c.save(); c.translate(x, h - 9 - t / 2 - t * i);
        const R = Rm * .42 + Rm * .58 * s;
        drawRing(c, R, t, COLS[ci].h, 2, { ghost: V.m === 'miss' && i === 2 });
        c.restore();
      }
      drawBall(c, t * .8, x, p.topY - 1, 1);
    });
  }
  function openLevels() {
    const pr = loadProg(), grid = root.querySelector('.grid');
    grid.innerHTML = LV.map((V, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lv${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}">
        <span class="n">${dg(n)}</span><canvas></canvas><b>${MODE_IC[V.m]} ${lang === 'en' ? MODE_EN[V.m] : MODE_AR[V.m]}</b>
        <span class="s">${[1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    grid.querySelectorAll('canvas').forEach((c, i) => lvThumb(c, LV[i]));
    grid.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); if (b.animate) b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
    const cur = grid.querySelector('.cur');
    requestAnimationFrame(() => { if (cur) grid.scrollTop = Math.max(0, cur.offsetTop - grid.clientHeight / 2); });
  }
  function paintLang() { root.querySelectorAll('.lng button').forEach(b => b.classList.toggle('on', b.dataset.l === lang)); }
  function setLang(l) {
    if (l === lang) return;
    lang = l; store.set('ringsLang', l); Sound.tap(); paintLang();
    paintTitle(); paintPrompt(true); paintBar();
    if (L.m === 'count' && phase === 'play') ansEl.querySelectorAll('button').forEach(b => { b.textContent = dg(+b.dataset.v); });
    if (lvOv.classList.contains('on')) openLevels();
    promptSpeak();
  }
  function act(a) {
    Sound.tap();
    if (a === 'close') { lvOv.classList.remove('on'); if (phase === 'over') winOv.classList.add('on'); }
    else if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvb').addEventListener('click', () => { Sound.tap(); openLevels(); });
  root.querySelectorAll('.lng button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l)));
  spk.addEventListener('click', () => {
    promptSpeak();
    const g = G(); if (g) g.fromTo(spk, { scale: 1.2 }, { scale: 1, duration: .5, ease: 'elastic.out(1,.4)' });
  });
  prm.addEventListener('click', () => { promptSpeak(); paintPrompt(true); });

  /* ---------- الجسيمات ---------- */
  function sparks(x, y, col, n, spread) {
    for (let i = 0; i < n; i++) {
      const a = rand(Math.PI * 1.05, Math.PI * 1.95), sp = rand(120, 300);
      parts.push({ x: x + rand(-spread, spread) * .8, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, g: 500, life: rand(.5, .9), age: 0, col: i % 3 ? col : '#FFFFFF', r: rand(2.5, 5), star: i % 4 === 0 });
    }
  }
  function confetti() {
    const cols = COLS.map(c => c.h).concat(['#FFFFFF']);
    parts.push({ x: rand(0, Wd), y: rand(-Hd * .5, -10), vx: rand(-60, 60), vy: rand(80, 220), g: 120, life: rand(2.2, 3.4), age: 0, col: pick(cols), r: rand(4, 8), rot: rand(0, TAU), vr: rand(-8, 8), conf: true });
  }

  /* ---------- الإدخال ---------- */
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  function hitRing(r, x, y, pad = 10) {
    const s = r.sc, R = (r.ball ? r.R : r.R) * s, hh = (r.ball ? r.R : th / 2 + r.R * KY) * s;
    return Math.abs(x - r.x) < R + pad && Math.abs(y - r.y) < hh + pad;
  }
  function pickAt(x, y) {
    const cand = rings.filter(r => (r.st === 'tray' || r.st === 'wob') && !r.pole && hitRing(r, x, y)).concat(balls.filter(b => b.st === 'tray' && hitRing(b, x, y)));
    if (!cand.length) return null;
    return cand.reduce((a, b) => Math.hypot(b.x - x, b.y - y) < Math.hypot(a.x - x, a.y - y) ? b : a);
  }
  function poleAt(x, y, r) {
    let best = null, bd = 1e9;
    for (const p of poles) {
      const dx = Math.abs(x - p.x), lim = Math.max(Rmax * 1.05, 70);
      if (dx < lim && y < p.bY + 30 && y > p.topY - 240 && dx < bd) { best = p; bd = dx; }
    }
    if (!best && poles.length === 1 && y < tray.y - 10) best = poles[0];
    void r; return best;
  }
  cv.addEventListener('pointerdown', e => {
    if (paused || drag) return;
    const p = pos(e);
    if (L.m === 'count' && phase === 'play') {
      const r = poles[0].stack.slice().reverse().find(r => hitRing(r, p.x, p.y, 4));
      if (r) tapCount(r);
      return;
    }
    if (phase !== 'play' && phase !== 'ball') return;
    const r = pickAt(p.x, p.y);
    if (!r) return;
    drag = { r, sx: p.x, sy: p.y, ox: r.x - p.x, oy: r.y - p.y, moved: false, id: e.pointerId, lx: p.x };
    r.st = 'drag'; r.anim = null; lastAct = T;
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    Sound.tap(); vibrate(8);
    if (!r.ball) { sayRing(r); label = r; } else say('الكرة', 'The ball');
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const p = pos(e), r = drag.r;
    if (!drag.moved && Math.hypot(p.x - drag.sx, p.y - drag.sy) > 8) drag.moved = true;
    if (drag.moved) {
      r.x = p.x + drag.ox * .5; r.y = p.y + drag.oy * .5 - 24;
      r.rot = clamp(r.rot * .7 + (p.x - drag.lx) * .006, -.35, .35); drag.lx = p.x;
    }
  });
  function endDrag(e, cancel) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const d = drag, r = d.r; drag = null; label = null;
    try { cv.releasePointerCapture(d.id); } catch (er) {}
    if (cancel) { backToTray(r); return; }
    if (!d.moved) {
      // لمسة: الحلقة تحاول الصعود إلى العمود (إلا في الفرز حيث يجب سحبها)
      if (L.m === 'sort' && !r.ball) { r.st = 'tray'; r.sqT = T; return; }
      attempt(r, poles.find(p => !r.ball || !p.ball) || poles[0]);
      return;
    }
    const p = pos(e), pl = poleAt(p.x, r.y, r);
    if (pl) attempt(r, pl); else backToTray(r);
  }
  cv.addEventListener('pointerup', e => endDrag(e));
  cv.addEventListener('pointercancel', e => endDrag(e, true));
  window.addEventListener('keydown', e => {
    if (App.current !== ID || paused || $('#sheetWrap').classList.contains('on')) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); promptSpeak(); return; }
    let k = e.key; const ai = AD.indexOf(k); if (ai >= 0) k = String(ai);
    if (/^\d$/.test(k) && L.m === 'count' && phase === 'play') {
      const b = ansEl.querySelector(`button[data-v="${k}"]`); if (b && !b.classList.contains('no')) answer(+k, b);
    }
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    if (evs.length) { const due = evs.filter(e => e.t <= T); if (due.length) { evs = evs.filter(e => e.t > T); due.sort((a, b) => a.t - b.t).forEach(e => e.fn()); } }
    const all = rings.concat(balls);
    for (const r of all) {
      const tsc = r.st === 'tray' || (r.st === 'fly' && !r.pole && !r.ball) ? (r.ball ? 1 : ts) : 1;
      if (r.anim) {
        const a = r.anim;
        if (T >= a.t0) {
          const p = clamp((T - a.t0) / a.dur, 0, 1), e = easeIO(p);
          r.x = a.fx + (a.tx - a.fx) * e; r.y = a.fy + (a.ty - a.fy) * e - Math.sin(p * Math.PI) * a.arc;
          if (p >= 1) { r.anim = null; if (a.done) a.done(); }
        }
      } else if (r.st === 'tray') {
        const k = Math.min(1, dt * 12); r.x += (r.hx - r.x) * k; r.y += (r.hy - r.y) * k;
      } else if (r.st === 'slide') {
        r.vy += 2400 * dt; r.y += r.vy * dt; r.x = r.pole.x;
        if (r.y >= r.ty) { r.y = r.ty; if (r.ball) ballLanded(r); else landed(r); }
      } else if (r.st === 'pole') { r.x = r.pole.x; }
      r.sc += (tsc - r.sc) * Math.min(1, dt * 10);
      if (r.st !== 'drag') r.rot *= Math.exp(-dt * 8);
    }
    for (const p of poles) p.wig = Math.max(0, p.wig - dt * (phase === 'done' || phase === 'over' ? .45 : 1.4));
    shake = Math.max(0, shake - dt * 2);
    // تلميح عند الخمول
    if ((phase === 'play' || phase === 'ball') && !drag && T - lastAct > 9) {
      lastAct = T; promptSpeak();
      if (phase === 'ball') hintR = balls.find(b => b.st === 'tray'); else if (L.m !== 'count') hintR = expected(poles.find(p => expected(p)) || poles[0]);
      if (hintR) hintR.sqT = T;
    }
    for (const p of parts) {
      p.age += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.g * dt;
      if (p.conf) { p.rot += p.vr * dt; p.vx += Math.sin(T * 3 + p.r) * 20 * dt; } else { p.vx *= .97; }
    }
    parts = parts.filter(p => p.age < p.life && p.y < Hd + 40);
  }
  function ballLanded(b) {
    b.st = 'pole'; b.y = b.ty; b.sqT = T;
    Sound.thud(); Sound.pop(); vibrate(15);
    if (phase === 'ball') { paintBar(); sparks(b.x, b.y, '#FFC531', 20, 20); complete(); }
    else b.happy = 1;
  }

  /* ---------- الرسم ---------- */
  let bgCache = null;
  function drawBg(c) {
    if (!bgCache || bgCache.w !== Wd || bgCache.h !== Hd) {
      const k = Math.min(2, window.devicePixelRatio || 1), cvb = document.createElement('canvas');
      cvb.width = Math.round(Wd * k); cvb.height = Math.round(Hd * k);
      const b = cvb.getContext('2d'); b.scale(k, k);
      let g = b.createLinearGradient(0, 0, 0, Hd);
      g.addColorStop(0, '#B9E3FF'); g.addColorStop(.55, '#E6F5FF'); g.addColorStop(.56, '#F7E6C8'); g.addColorStop(1, '#EED2A5');
      b.fillStyle = g; b.fillRect(0, 0, Wd, Hd);
      // ورق جدران منقّط
      b.fillStyle = 'rgba(255,255,255,.55)';
      for (let y = 30; y < Hd * .55; y += 46) for (let x = (y / 46 % 2) * 23; x < Wd; x += 46) { b.beginPath(); b.arc(x, y, 5, 0, TAU); b.fill(); }
      // قوس قزح ناعم في الخلفية
      const cx = Wd / 2, cy = Hd * .55, Rr = Math.min(Wd * .46, Hd * .42);
      b.globalAlpha = .18;
      COLS.slice(0, 6).forEach((col, i) => { b.strokeStyle = col.h; b.lineWidth = Rr * .055; b.beginPath(); b.arc(cx, cy, Rr - i * Rr * .055, Math.PI, 0); b.stroke(); });
      b.globalAlpha = 1;
      // خط الأرضية
      g = b.createLinearGradient(0, Hd * .55 - 10, 0, Hd * .55 + 16); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.4, 'rgba(255,255,255,.9)'); g.addColorStop(1, 'rgba(210,160,100,.25)');
      b.fillStyle = g; b.fillRect(0, Hd * .55 - 10, Wd, 26);
      // ألواح الأرضية الخشبية
      b.strokeStyle = 'rgba(170,110,50,.13)'; b.lineWidth = 2;
      for (let i = -12; i <= 12; i++) { b.beginPath(); b.moveTo(Wd / 2 + i * 40, Hd * .56); b.lineTo(Wd / 2 + i * 150, Hd); b.stroke(); }
      // سجادة دائرية تحت اللعبة
      b.save(); b.translate(Wd / 2, Hd * .78); b.scale(1, .3);
      g = b.createRadialGradient(0, 0, 0, 0, 0, Math.min(Wd * .5, 420));
      g.addColorStop(0, 'rgba(255,190,220,.55)'); g.addColorStop(.7, 'rgba(255,170,210,.35)'); g.addColorStop(1, 'rgba(255,170,210,0)');
      b.fillStyle = g; b.beginPath(); b.arc(0, 0, Math.min(Wd * .5, 420), 0, TAU); b.fill(); b.restore();
      bgCache = { cv: cvb, w: Wd, h: Hd };
    }
    c.drawImage(bgCache.cv, 0, 0, Wd, Hd);
  }
  function sq(r) { const a = T - r.sqT; if (a < 0 || a > .9) return [1, 1]; const e = Math.exp(-6 * a) * Math.cos(a * 22); return [1 + .14 * e, 1 - .2 * e]; }
  function drawRingObj(c, r, poleHole) {
    const [sx, sy] = sq(r);
    let wob = 0;
    if (r.st === 'wob') { const a = T - r.wobT; wob = Math.sin(a * 30) * .28 * Math.exp(-a * 3); }
    c.save(); c.translate(r.x, r.y + th / 2 * r.sc * (1 - sy)); c.rotate(r.rot + wob); c.scale(r.sc * sx, r.sc * sy);
    if (hintR === r && T - r.sqT < 2.5) { c.shadowColor = '#FFE45C'; c.shadowBlur = 24; }
    drawRing(c, r.R, th, COLS[r.ci].h, poleHole ? poleHole * 1.25 : r.R * .22);
    c.restore();
  }
  function drawPoleGroup(c, p) {
    const k = Math.sin(T * 9) * p.wig * .07;
    c.save(); c.translate(p.x, p.bY); c.transform(1, 0, -k, 1, 0, 0); c.translate(-p.x, -p.bY);
    drawBase(c, p.x, p.bY, p.Rb, p.bh, L.m === 'sort' ? p.ci : null);
    drawPoleSeg(c, p, p.bY + 2, p.topY, true);
    // حلقات العمود، من الأسفل إلى الأعلى
    const st = rings.filter(r => r.pole === p && (r.st === 'pole' || r.st === 'slide')).sort((a, b) => b.y - a.y);
    for (const r of st) {
      drawRingObj(c, r, p.wAt(r.y));
      // العمود يخرج من ثقب الحلقة
      const yh = r.y - th / 2;
      if (yh > p.topY) drawPoleSeg(c, p, yh + p.wAt(yh) * KY * .5, p.topY, true);
    }
    // الحلقة الناقصة: شبح منقّط
    if (p.gap != null && L.m === 'miss') {
      const y = stackY(p, p.gap), R = Rof(missS);
      c.save(); c.translate(p.x, y);
      c.globalAlpha = .55 + .25 * Math.sin(T * 5);
      ringPath(c, R, th); c.fillStyle = 'rgba(255,255,255,.55)'; c.fill();
      c.setLineDash([7, 6]); c.lineWidth = 3; c.strokeStyle = '#8A5CF5'; c.stroke();
      c.setLineDash([]); c.fillStyle = '#8A5CF5'; c.font = `900 ${th * .7}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 0, th * .1);
      c.restore();
    }
    for (const b of balls) if (b.pole === p && (b.st === 'pole' || b.st === 'slide')) drawBallObj(c, b);
    c.restore();
    // أرقام العدّ
    for (const r of st) if (r.cnt) {
      const x = p.x + r.R + 22, y = r.y, a = clamp((T - r.sqT) * 4, 0, 1), s = 13 + 4 * Math.sin(a * Math.PI);
      c.save(); c.fillStyle = '#fff'; c.strokeStyle = COLS[r.ci].h; c.lineWidth = 3.5; c.beginPath(); c.arc(x, y, s, 0, TAU); c.fill(); c.stroke();
      c.fillStyle = '#3E2470'; c.font = `900 ${s * 1.2}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
      c.fillText(dg(r.cnt), x, y + 1); c.restore();
    }
  }
  function drawBallObj(c, b) {
    const [sx, sy] = sq(b), R = b.R;
    const tgt = drag ? drag.r : null;
    const look = tgt ? clamp((tgt.x - b.x) / 120, -1, 1) : Math.sin(T * .7) * .6;
    const blink = (T % 3.7) < .12;
    c.save(); c.translate(b.x, b.y + R * (1 - sy)); c.rotate(b.rot); c.scale(b.sc * sx, b.sc * sy);
    drawBall(c, R, 0, 0, b.happy || (phase === 'ball' ? .3 : 0), look, blink);
    c.restore();
  }
  function drawTray(c) {
    if (L.m === 'count') return;
    const t = tray;
    c.save();
    c.shadowColor = 'rgba(80,40,140,.22)'; c.shadowBlur = 16; c.shadowOffsetY = 6;
    c.fillStyle = '#C9A2FF'; c.beginPath(); c.roundRect(t.x, t.y + 6, t.w, t.h, 30); c.fill();
    c.restore();
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(t.x, t.y, t.w, t.h, 30); c.fill();
    const g = c.createLinearGradient(0, t.y, 0, t.y + t.h); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#F4ECFF');
    c.fillStyle = g; c.beginPath(); c.roundRect(t.x + 6, t.y + 6, t.w - 12, t.h - 12, 24); c.fill();
    c.strokeStyle = '#E2D1FF'; c.lineWidth = 3; c.stroke();
  }
  function render() {
    const c = ctx; if (!c) return;
    c.save();
    if (shake > 0) c.translate(Math.sin(T * 60) * shake * 4, 0);
    drawBg(c);
    for (const p of poles) drawPoleGroup(c, p);
    drawTray(c);
    // الحلقات في الصينية
    const tr = rings.filter(r => !r.pole && r.st !== 'drag' && r.st !== 'fly' && r.st !== 'gone');
    for (const r of tr) if (r.st === 'tray') { c.fillStyle = 'rgba(90,50,150,.16)'; c.beginPath(); c.ellipse(r.x, r.y + (th / 2 + r.R * KY) * r.sc + 3, r.R * r.sc * .9, r.R * r.sc * KY * .7, 0, 0, TAU); c.fill(); }
    tr.sort((a, b) => a.y - b.y).forEach(r => drawRingObj(c, r));
    for (const b of balls) if (!b.pole && b.st !== 'drag' && b.st !== 'fly') drawBallObj(c, b);
    // المتحركة والمسحوبة فوق الكل
    for (const r of rings) if (r.st === 'fly' || (r.pole && r.st === 'fly')) drawRingObj(c, r, r.pole ? r.pole.wAt(r.y) : 0);
    for (const b of balls) if (b.st === 'fly') drawBallObj(c, b);
    if (drag) {
      const r = drag.r;
      c.save(); c.globalAlpha = .25; c.fillStyle = '#3E2470'; c.beginPath(); c.ellipse(r.x, r.y + 70, r.R * .8, r.R * .16, 0, 0, TAU); c.fill(); c.restore();
      if (r.ball) drawBallObj(c, r); else drawRingObj(c, r);
    }
    // تسمية الحلقة المسحوبة
    if (label && drag && drag.r === label) {
      const r = label, col = COLS[r.ci], en = lang === 'en';
      const txt = L.m === 'color' ? (en ? col.en : col.ind) : (en ? SIZE_EN[sizeOf(r)] + ' · ' + col.en : col.ind + ' · ' + SIZE_AR[sizeOf(r)]);
      c.save(); c.font = `900 18px ${FONT}`; c.direction = en ? 'ltr' : 'rtl'; c.textAlign = 'center'; c.textBaseline = 'middle';
      const w = c.measureText(txt).width + 26, y = r.y - th / 2 - r.R * KY - 30;
      c.fillStyle = '#fff'; c.strokeStyle = col.h; c.lineWidth = 3.5; c.beginPath(); c.roundRect(r.x - w / 2, y - 16, w, 32, 16); c.fill(); c.stroke();
      c.fillStyle = '#3E2470'; c.fillText(txt, r.x, y + 1); c.restore();
    }
    // جسيمات
    for (const p of parts) {
      const a = 1 - p.age / p.life;
      c.globalAlpha = Math.min(1, a * 2);
      c.fillStyle = p.col;
      if (p.conf) { c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); c.restore(); }
      else if (p.star) { IKstar(c, p.x, p.y, p.r * 1.6); }
      else { c.beginPath(); c.arc(p.x, p.y, p.r * (0.6 + a * .4), 0, TAU); c.fill(); }
    }
    c.globalAlpha = 1;
    c.restore();
  }
  function IKstar(c, x, y, r) {
    c.beginPath();
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; c.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
    c.closePath(); c.fill();
  }
  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = clamp((now - last) / 1000 || 0, 0, .05); last = now;
    if (paused || document.hidden) return;
    update(dt); render();
  }
  function startLoop() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stopLoop() { running = false; cancelAnimationFrame(raf); }
  let resizeT = 0;
  window.addEventListener('resize', () => {
    if (App.current !== ID) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createRadialGradient(s * .5, s * .3, s * .05, s * .5, s * .5, s * .8);
    g.addColorStop(0, '#E9DDFF'); g.addColorStop(1, '#9B72F2');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.save(); c.globalAlpha = .25; COLS.slice(0, 6).forEach((col, i) => { c.strokeStyle = col.h; c.lineWidth = s * .04; c.beginPath(); c.arc(s * .5, s * .62, s * .5 - i * s * .04, Math.PI, 0); c.stroke(); }); c.restore();
    const x = s * .5, bY = s * .84, t = s * .095, n = 5;
    drawBase(c, x, bY, s * .36, s * .05, null);
    const p = { x, bY, topY: bY - t * n - t * .5, wAt: () => s * .02 };
    drawPoleSeg(c, p, bY, p.topY, true);
    [0, 1, 2, 4, 5].forEach((ci, i) => { c.save(); c.translate(x, bY - t / 2 - t * i); drawRing(c, s * (.32 - i * .045), t, COLS[ci].h, s * .03); c.restore(); });
    drawBall(c, t * .85, x, p.topY - 2, 1);
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'حلقات الهرم', icon2: '🌈', isNew: true, music: 'shapes',
    desc: () => App.g('رتّبي الحلقات الملوّنة على العمود من الأكبر إلى الأصغر', 'رتّب الحلقات الملوّنة على العمود من الأكبر إلى الأصغر'),
    help: () => [
      '🌈 ' + App.g('اسحبي', 'اسحب') + ' الحلقة إلى العمود، أو ' + App.g('المسيها', 'المسها') + ' فتصعد وحدها',
      '🔽 ' + App.g('ابدئي', 'ابدأ') + ' بالحلقة الأكبر ثم الأصغر فالأصغر، والحلقة الخطأ ترتدّ',
      '🟡 في النهاية ' + App.g('ضعي', 'ضع') + ' الكرة في القمة فيبتسم البرج ويرقص',
      '🎨 أنماط أخرى: ترتيب الألوان، عمودان للفرز، عدّ الحلقات، والحلقة الناقصة',
      '🔊 الزر الأصفر يعيد السؤال، و«عربي / English» يبدّل اللغة'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🌈 ${ks.length}/${NL} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      lang = store.get('ringsLang', 'ar') === 'en' ? 'en' : 'ar'; paintLang();
      const pr = loadProg();
      let n = 1; for (let i = 1; i <= pr.unlocked; i++) { n = i; if (!pr.stars[i]) break; }
      startLevel(n);
      render(); startLoop();
    },
    leave() { stopLoop(); drag = null; evs = []; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { backToTray(drag.r); drag = null; label = null; } },
    resume() { paused = false; last = performance.now(); },
    back() { if (lvOv.classList.contains('on')) { act('close'); return true; } return false; },
    /* للاختبار الآلي */
    _state() { return { lvl, mode: L.m, phase, mistakes, done, steps, poles: poles.map(p => ({ wig: p.wig, x: p.x, bY: p.bY, topY: p.topY, n: p.stack.filter(Boolean).length, ci: p.ci })), rings: rings.map(r => ({ x: r.x, y: r.y, s: r.s, ci: r.ci, st: r.st, on: !!r.pole })), balls: balls.map(b => ({ x: b.x, y: b.y, st: b.st })), seq, countN, missS }; },
    _start: n => startLevel(n)
  });
})();
