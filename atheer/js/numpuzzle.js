/* =====================================================================
   ألغاز الأرقام — لوح خشبي بفتحات على شكل الأرقام، اسحب كل رقم إلى مكانه
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'numpuzzle';
  const TITLE = 'ألغاز الأرقام', ICON2 = '🔢', MUSIC = 'numbers';
  const PROG_KEY = 'numpuzzleProg';
  const BOARD_WOOD = ['#D49255', '#E3A866'];
  const AR_D = '٠١٢٣٤٥٦٧٨٩';
  const AR_N = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const EN_N = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const TRACKS = [
    { id: 'ar', label: '١٢٣', name: 'الأرقام العربية', nameEn: 'Arabic numerals', indic: true },
    { id: 'en', label: '123', name: 'الأرقام الإنجليزية', nameEn: 'English numerals', indic: false }
  ];
  /* مسار الأرقام هو لغة محتوى اللعبة (numpuzzleLang) */
  const LANG_TRACK = true, TITLE_EN = 'Number Puzzle';
  const GROUPS = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 2, 3, 4, 5], [6, 7, 8, 9, 0], [0, 2, 4, 6, 8], [1, 3, 5, 7, 9], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]];
  const LEVELS = { ar: GROUPS, en: GROUPS };
  function ITEM(d, t) {
    const ar = t === 'ar';
    // الصفر الهندي نقطة صغيرة: نجعله معيّنًا متوسط الحجم
    return { ch: ar ? AR_D[d] : String(d), say: ar ? AR_N[d] : EN_N[d], lang: ar ? 'ar' : 'en', col: PAL[(d + 9) % 10], frac: ar && d === 0 ? .5 : 1 };
  }
  const SECTIONS = (t, i) => i === 0 ? '٣ أرقام' : i === 3 ? '٥ أرقام' : i === 7 ? 'كل الأرقام' : '';
  const SECTIONS_EN = (t, i) => i === 0 ? '3 numbers' : i === 3 ? '5 numbers' : i === 7 ? 'All numbers' : '';
  const HINT_EN = 'Drag each number to its place', DESC_EN = 'Put each number in its slot on the board';
  const HELP_EN = () => [
    '👆 Drag each colored number from the tray to the matching slot on the board',
    '🔊 You will hear the number name when you pick it up and when you place it',
    '١٢٣ The switch button at the top changes between Arabic numerals and English numerals 123',
    '⭐ Finish the level with no mistakes to get 3 stars'
  ];
  const HINT = () => App.g('اسحبي كل رقم إلى مكانه', 'اسحب كل رقم إلى مكانه');
  const DESC = () => App.g('ضعي كل رقم في فتحته على اللوح', 'ضع كل رقم في فتحته على اللوح');
  const HELP = () => [
    '👆 ' + App.g('اسحبي', 'اسحب') + ' كل رقم ملوّن من الصينية إلى الفتحة التي تشبهه في اللوح',
    '🔊 ' + App.g('ستسمعين', 'ستسمع') + ' اسم الرقم عندما ' + App.g('تمسكينه', 'تمسكه') + ' وعندما ' + App.g('تضعينه', 'تضعه'),
    '١٢٣ زر التبديل في الأعلى ينقل بين الأرقام العربية والإنجليزية 123',
    '⭐ ' + App.g('أنهي', 'أنهِ') + ' المستوى دون أخطاء ' + App.g('لتحصلي', 'لتحصل') + ' على ٣ نجوم'
  ];
  const ICON = ['٣', '7', ['#2E8BF0', '#1959B5', '#B3D8FF']];
  const FONT_SAMPLES = [AR_D, '0123456789'];

  /* =================== المحرك (لوح خشبي + قطع رموز سميكة) =================== */
  const TAU = Math.PI * 2;
  const GFONT = '"Baloo Bhaijaan 2",system-ui,"Segoe UI",Tahoma,sans-serif';
  const PAL = [
    ['#FF4D5E', '#C41E3A', '#FFB0B8'], ['#FF9A1F', '#CC6600', '#FFD69A'], ['#FFCC1A', '#D19A00', '#FFF2A6'],
    ['#4FC72E', '#2A8A18', '#C2F2AE'], ['#18C2B0', '#0B857A', '#A6F2EA'], ['#2E8BF0', '#1959B5', '#B3D8FF'],
    ['#7457F0', '#472DB3', '#D0C4FF'], ['#BE4DE0', '#8222A3', '#EDBDFA'], ['#FF5AA5', '#C72A74', '#FFC0DD'],
    ['#93CC22', '#628F0E', '#E1F7A6']
  ];

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  };
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  /* تقسيم قائمة إلى مجموعات بحجم n (المجموعة الأخيرة تُكمَّل من آخر القائمة) */
  function chunks(list, n) {
    const out = [];
    for (let i = 0; i < list.length; i += n) out.push(i + n <= list.length ? list.slice(i, i + n) : list.slice(Math.max(0, list.length - n)));
    return out;
  }

  function tint(src, style) {
    const c = mk(src.width, src.height), x = c.getContext('2d');
    x.drawImage(src, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = style; x.fillRect(0, 0, c.width, c.height);
    x.globalCompositeOperation = 'source-over';
    return c;
  }
  function invert(src) {
    const c = mk(src.width, src.height), x = c.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height); x.globalCompositeOperation = 'destination-out'; x.drawImage(src, 0, 0);
    return c;
  }
  /* ظل داخلي يُحسب في لوحة منفصلة ثم يُقصّ بالقناع (آمن على كروم/أندرويد) */
  function innerGlow(x, inv, mask, color, blur, ox, oy) {
    const P = inv.width, t = mk(P, inv.height), c = t.getContext('2d');
    c.shadowColor = color; c.shadowBlur = blur; c.shadowOffsetX = ox + P * 2; c.shadowOffsetY = oy;
    c.drawImage(inv, -P * 2, 0);
    c.shadowColor = 'transparent'; c.globalCompositeOperation = 'destination-in'; c.drawImage(mask, 0, 0);
    x.drawImage(t, 0, 0);
  }
  function rim(x, mask, color, ox, oy) {
    const t = mk(mask.width, mask.height), c = t.getContext('2d');
    c.drawImage(mask, 0, 0); c.globalCompositeOperation = 'destination-out'; c.drawImage(mask, ox, oy);
    c.globalCompositeOperation = 'source-in'; c.fillStyle = color; c.fillRect(0, 0, t.width, t.height);
    x.drawImage(t, 0, 0);
  }
  function dilate(src, d) {
    const c = mk(src.width, src.height), x = c.getContext('2d');
    for (const f of [1, .66, .33]) for (let i = 0; i < 24; i++) { const a = i * TAU / 24; x.drawImage(src, Math.cos(a) * d * f, Math.sin(a) * d * f); }
    x.drawImage(src, 0, 0);
    return tint(c, '#000');
  }
  /* قناع ناعم الحواف من الداخل (للّمعة): تمويه ثم قصّ بالقناع الأصلي */
  function erode(src, d) {
    const c = mk(src.width, src.height), x = c.getContext('2d');
    if ('filter' in x) { x.filter = `blur(${d}px)`; x.drawImage(src, 0, 0); x.filter = 'none'; x.drawImage(c, 0, 0); }
    else x.drawImage(src, 0, 0);
    x.globalCompositeOperation = 'destination-in'; x.drawImage(src, 0, 0);
    return c;
  }
  const glyphFont = fs => `900 ${fs}px ${GFONT}`;

  /* قناع الرمز: نص بخط عريض مستدير يُكبَّر ليملأ المربع ثم يُمدَّد قليلًا */
  function glyphMask(ch, box, P, frac) {
    const c = mk(P, P), x = c.getContext('2d');
    x.direction = 'ltr'; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    let fs = 100; x.font = glyphFont(fs);
    let m = x.measureText(ch);
    const W0 = (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || m.width), H0 = (m.actualBoundingBoxAscent || 70) + (m.actualBoundingBoxDescent || 0);
    fs = fs * box * frac / Math.max(W0, H0, 1);
    x.font = glyphFont(fs); m = x.measureText(ch);
    const L = m.actualBoundingBoxLeft || 0, R = m.actualBoundingBoxRight || m.width, A = m.actualBoundingBoxAscent || fs * .7, D = m.actualBoundingBoxDescent || 0;
    x.fillStyle = '#000';
    x.fillText(ch, Math.round((P - (L + R)) / 2 + L), Math.round((P - (A + D)) / 2 + A));
    return { c, top: (P - (A + D)) / 2, bot: (P + (A + D)) / 2 };
  }

  /* تجهيز صور القطعة والفتحة بحجم S بدقة الجهاز */
  function bake(item, S, dpr) {
    const P = 2 * Math.ceil(S * .75 * dpr);
    const gm = glyphMask(item.ch, S * .8 * dpr, P, item.frac || 1);
    const mask = dilate(gm.c, S * .014 * dpr);
    const inv = invert(mask), col = item.col;
    // الوجه: تدرّج زاهٍ
    const top = mk(P, P), tx = top.getContext('2d');
    { const g = tx.createLinearGradient(P * .3, gm.top, P * .7, gm.bot);
      g.addColorStop(0, col[2]); g.addColorStop(.38, col[0]); g.addColorStop(1, col[1]);
      tx.drawImage(tint(mask, g), 0, 0); }
    innerGlow(tx, inv, mask, 'rgba(0,0,0,.3)', 5 * dpr, -2.5 * dpr, -3 * dpr);
    innerGlow(tx, inv, mask, 'rgba(255,255,255,.55)', 3 * dpr, 2 * dpr, 2.5 * dpr);
    rim(tx, mask, 'rgba(255,255,255,.85)', 1.6 * dpr, 2 * dpr);
    rim(tx, mask, 'rgba(0,0,0,.16)', -1.4 * dpr, -1.6 * dpr);
    // لمعة زجاجية على النصف العلوي
    { const er = erode(mask, S * .05 * dpr), gl = mk(P, P), gx = gl.getContext('2d');
      const h = gm.bot - gm.top, g = gx.createLinearGradient(0, gm.top, 0, gm.top + h * .55);
      g.addColorStop(0, 'rgba(255,255,255,.5)'); g.addColorStop(.7, 'rgba(255,255,255,.1)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      gx.fillStyle = g; gx.fillRect(0, 0, P, P);
      gx.globalCompositeOperation = 'destination-in'; gx.drawImage(er, 0, 0);
      tx.drawImage(gl, 0, 0);
      // نقطة لمعان صغيرة
      const sp = mk(P, P), sx = sp.getContext('2d');
      const sg = sx.createRadialGradient(P * .36, gm.top + h * .14, 0, P * .36, gm.top + h * .14, S * .16 * dpr);
      sg.addColorStop(0, 'rgba(255,255,255,.9)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
      sx.fillStyle = sg; sx.fillRect(0, 0, P, P); sx.globalCompositeOperation = 'destination-in'; sx.drawImage(er, 0, 0);
      tx.drawImage(sp, 0, 0); }
    const side = tint(mask, col[1]);
    { const sx = side.getContext('2d'); sx.globalCompositeOperation = 'source-atop'; sx.fillStyle = 'rgba(0,0,0,.18)'; sx.fillRect(0, 0, P, P); }
    const sideD = tint(mask, col[1]);
    { const sx = sideD.getContext('2d'); sx.globalCompositeOperation = 'source-atop'; sx.fillStyle = 'rgba(0,0,0,.42)'; sx.fillRect(0, 0, P, P); }
    // ظل
    const shadow = mk(P, P), shx = shadow.getContext('2d');
    shx.shadowColor = 'rgba(60,30,5,.5)'; shx.shadowBlur = 6 * dpr; shx.shadowOffsetX = P * 2;
    shx.drawImage(tint(mask, '#000'), -P * 2, 0);
    // الفتحة المحفورة
    const hole = mk(P, P), hx = hole.getContext('2d');
    hx.drawImage(tint(mask, 'rgba(255,226,180,.65)'), 0, Math.round(2 * dpr));
    hx.drawImage(tint(mask, 'rgba(70,35,10,.6)'), 0, -Math.round(1.2 * dpr));
    const hIn = tint(mask, '#4A2810'), hix = hIn.getContext('2d');
    { const g = hix.createLinearGradient(0, 0, 0, P); g.addColorStop(0, '#2E180A'); g.addColorStop(1, '#5C3416');
      hix.globalCompositeOperation = 'source-atop'; hix.fillStyle = g; hix.fillRect(0, 0, P, P); hix.globalCompositeOperation = 'source-over'; }
    innerGlow(hix, inv, mask, 'rgba(0,0,0,.85)', 6 * dpr, 0, 4 * dpr);
    innerGlow(hix, inv, mask, 'rgba(255,200,140,.3)', 2 * dpr, 0, -2 * dpr);
    hx.drawImage(hIn, 0, 0);
    // توهج التلميح
    const glow = mk(P, P), gx = glow.getContext('2d');
    gx.shadowColor = '#FFF27A'; gx.shadowBlur = 10 * dpr; gx.shadowOffsetX = P * 2;
    const yel = tint(mask, '#FFE95C'); gx.drawImage(yel, -P * 2, 0); gx.drawImage(yel, -P * 2, 0);
    return { P, sz: P / dpr, top, side, sideD, shadow, hole, glow };
  }

  /* ---------- رسم الخشب ---------- */
  function woodGrain(x, rx, ry, rw, rh, c1, c2, seed, lineCol) {
    const R = rng(seed);
    const g = x.createLinearGradient(rx, ry, rx + rw * .3, ry + rh);
    g.addColorStop(0, c1); g.addColorStop(.5, c2); g.addColorStop(1, c1);
    x.fillStyle = g; x.fillRect(rx, ry, rw, rh);
    const knots = Array.from({ length: 2 + Math.floor(R() * 2) }, () => ({ x: rx + R() * rw, y: ry + R() * rh, rx: 30 + R() * 50, ry: 8 + R() * 8 }));
    const lines = Math.ceil(rh / 3.2);
    const ph1 = R() * 10, ph2 = R() * 10;
    for (let i = 0; i < lines; i++) {
      const y0 = ry + i * rh / lines + R() * 2;
      x.beginPath();
      for (let xx = rx - 10; xx <= rx + rw + 10; xx += 7) {
        let y = y0 + Math.sin(xx * .008 + ph1 + i * .05) * 5 + Math.sin(xx * .031 + ph2 + i * .21) * 1.6;
        for (const k of knots) {
          const dx = (xx - k.x) / k.rx, dy = (y0 - k.y) / (k.ry * 2.2), f = Math.exp(-dx * dx - dy * dy);
          y += Math.sign(y0 - k.y || 1) * f * k.ry * 1.4;
        }
        xx === rx - 10 ? x.moveTo(xx, y) : x.lineTo(xx, y);
      }
      x.strokeStyle = lineCol.replace('A', (.04 + R() * .14).toFixed(3)); x.lineWidth = .5 + R() * 1.8; x.stroke();
    }
    for (const k of knots) {
      for (let j = 4; j >= 1; j--) {
        x.beginPath(); x.ellipse(k.x, k.y, k.rx * .22 * j / 2.2, k.ry * .5 * j / 2.2, 0, 0, TAU);
        x.strokeStyle = lineCol.replace('A', (.1 + j * .03).toFixed(2)); x.lineWidth = 1.2; x.stroke();
      }
      x.beginPath(); x.ellipse(k.x, k.y, k.rx * .08, k.ry * .2, 0, 0, TAU); x.fillStyle = lineCol.replace('A', '.35'); x.fill();
    }
  }

  /* ---------- الواجهة ---------- */
  const S_ = '#' + ID;
  App.css(`
  ${S_}{background:#FFE9D0;overflow:hidden}
  ${S_} canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  ${S_} .ib{color:#B85A12}
  ${S_} .ib.trk{font-size:15px;font-weight:900;letter-spacing:-.5px;color:#C9560A}
  ${S_} .chip{color:#7A3E10}
  ${S_} .chip b{color:#C25A0E}
  ${S_} .panel{border-color:#FFE0B8;box-shadow:0 8px 0 #E9B680,0 20px 40px rgba(80,40,0,.3);color:#6B3510}
  ${S_} .panel h3{color:#C9560A}
  ${S_} .btn{background:#FF8A3D;box-shadow:0 4px 0 #CF5F12}
  ${S_} .btn.alt{background:#fff;color:#C9560A;box-shadow:0 4px 0 #EFC69A;border-color:#FFE0B8}
  ${S_} .btn:active{box-shadow:0 1px 0 #CF5F12}
  ${S_} .overlay{background:rgba(90,45,10,.35)}
  ${S_} .lvp{width:min(94vw,440px);max-height:86vh;overflow-y:auto;touch-action:pan-y}
  ${S_} .seg{display:flex;justify-content:center;gap:4px;background:#FFF1DE;border-radius:99px;padding:4px;margin:8px auto 2px;width:max-content}
  ${S_} .seg button{padding:6px 18px;border-radius:99px;font-weight:900;font-size:18px;background:transparent;color:#B0703A;line-height:1.2}
  ${S_} .seg button.on{background:linear-gradient(#FFA25E,#FF7A2A);color:#fff;box-shadow:0 3px 0 #CF5F12}
  ${S_} .lvh{font-weight:900;font-size:14px;color:#B0703A;margin:10px 4px 0;text-align:start}
  ${S_} .lvg{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:8px 0 12px}
  ${S_} .lvb{position:relative;aspect-ratio:1;border-radius:20px;background:linear-gradient(#FFD9A8,#F2B572);box-shadow:0 4px 0 #C98744,inset 0 2px 0 rgba(255,255,255,.6);
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#6B3510;font-weight:900;padding:2px}
  ${S_} .lvb:active{transform:translateY(3px);box-shadow:0 1px 0 #C98744}
  ${S_} .lvb .n{font-size:12px;position:absolute;top:3px;right:8px;opacity:.7}
  ${S_} .lvb .e{font-size:clamp(13px,4.1vw,19px);max-width:100%;overflow:hidden;line-height:1.15;white-space:nowrap;direction:ltr;letter-spacing:.5px;text-shadow:0 2px 0 rgba(255,255,255,.6)}
  ${S_} .lvb .e i{font-style:normal;display:inline-block;margin:0 .5px}
  ${S_} .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:12px}
  ${S_} .lvb .s i{font-style:normal}
  ${S_} .lvb .s i.off{filter:grayscale(1);opacity:.3}
  ${S_} .lvb.cur{outline:3px solid #FF8A3D;outline-offset:2px}
  ${S_} .lvb.lock{background:linear-gradient(#E9DCCB,#D5C3AC);box-shadow:0 4px 0 #B5A089;color:#8d7a66}
  ${S_} .lvb.lock .e{filter:grayscale(1);opacity:.35}
  ${S_} .lvb.lock::after{content:'🔒';position:absolute;font-size:18px;bottom:3px}
  @media (max-width:420px){${S_} .bar .chip{min-width:0;padding:2px 9px 3px}${S_} .bar{gap:6px}}
  @media (max-width:380px){${S_}.multi .bar .chip.ms{display:none}}
  ${S_} .hint{top:auto}
  ${S_} .hint span{background:rgba(255,250,240,.95);color:#7A3E10;box-shadow:0 2px 8px rgba(120,60,10,.15)}
  `);
  const multi = TRACKS.length > 1;
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية" data-al="Home">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة" data-al="Help">❓</button>
      <button class="ib lvbtn" aria-label="المستويات" data-al="Levels">🗺️</button>
      ${multi ? '<button class="ib trk" aria-label="تبديل" data-al="Switch"></button>' : ''}
      <span class="grow"></span>
      <div class="chip"><small data-en="Level">المستوى</small><b class="cLv">1</b></div>
      <div class="chip ms"><small data-en="Mistakes">الأخطاء</small><b class="cMs">0</b></div>
    </div>
    <div class="hint"><span class="hintT"></span></div>
    <div class="overlay lvOv"><div class="panel lvp"><h3 data-en="🗺️ Levels">🗺️ المستويات</h3>
      ${multi ? `<div class="seg">${TRACKS.map(t => `<button data-t="${t.id}">${t.label}</button>`).join('')}</div>` : ''}
      <div class="lvl"></div>
      <button class="btn alt" data-a="close" data-en="✕ Close">✕ إغلاق</button></div></div>
    <div class="overlay winOv"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next" data-en="Next ▶️">التالي ▶️</button><br>
      <button class="btn alt" data-a="again" aria-label="من جديد" data-al="Restart">🔄</button><button class="btn alt" data-a="levels" data-en="🗺️ Levels">🗺️ المستويات</button><button class="btn alt home" aria-label="الرئيسية" data-al="Home">🏠</button>
    </div></div>`);
  if (multi) root.classList.add('multi');
  const cv = root.querySelector('canvas.sc');
  const bar = root.querySelector('.bar');
  const hintEl = root.querySelector('.hint'), hintT = root.querySelector('.hintT');
  const lvOv = root.querySelector('.lvOv'), winOv = root.querySelector('.winOv');
  const trkBtn = root.querySelector('.ib.trk');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, S = 80, portrait = true;
  let board = null, tray = null, bgLayer = null;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let track = TRACKS[0].id, lvl = 1, pieces = [], mistakes = 0, over = false, winTimer = 0;
  let drag = null, parts = [], shake = 0, rings = [];
  let holesPos = [], slotsPos = [];
  let fontsReady = false;
  const LV = () => LEVELS[track];
  const trackDef = () => TRACKS.find(t => t.id === track) || TRACKS[0];

  /* التقدّم المحفوظ لكل لاعب ولكل مسار */
  function loadAll() { const p = store.get(PROG_KEY, null); return p && typeof p === 'object' ? p : {}; }
  function loadProg(t = track) {
    const p = loadAll()[t] || {}, stars = p.stars || {};
    return { unlocked: clamp(p.unlocked || 1, 1, LEVELS[t].length), stars };
  }
  function saveProg(pr, t = track) { const all = loadAll(); all[t] = pr; store.set(PROG_KEY, all); }

  /* ---------- التخطيط ---------- */
  function bestGrid(n, w, h) {
    let best = { cols: 1, rows: n, cell: 0 };
    for (let cols = 1; cols <= n; cols++) {
      const rows = Math.ceil(n / cols), cell = Math.min(w / cols, h / rows);
      if (cell > best.cell + .5) best = { cols, rows, cell };
    }
    return best;
  }
  function gridPts(n, r, gr) {
    const pts = [], cw = r.w / gr.cols, ch = r.h / gr.rows;
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / gr.cols), inRow = row === gr.rows - 1 ? n - row * gr.cols : gr.cols;
      const col = i % gr.cols, off = (gr.cols - inRow) * cw / 2;
      pts.push({ x: Math.round((r.x + off + (col + .5) * cw) * dpr) / dpr, y: Math.round((r.y + (row + .5) * ch) * dpr) / dpr });
    }
    return pts;
  }
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const top = bar.getBoundingClientRect().bottom + 4, pad = 14, bottom = H - pad;
    portrait = W / H < 1.05;
    const n = pieces.length || 3;
    if (portrait) {
      const aw = Math.min(W - pad * 2, 620), ax = (W - aw) / 2, ah = bottom - top;
      const bh = Math.round(ah * (n > 6 ? .55 : .58));
      board = { x: ax, y: top, w: aw, h: bh - 12 };
      tray = { x: ax, y: top + bh + 4, w: aw, h: ah - bh - 4 };
    } else {
      const aw = Math.min(W - pad * 2, 1180), ax = (W - aw) / 2, ah = bottom - top;
      const bw = Math.round(aw * .6);
      board = { x: ax, y: top, w: bw - 8, h: ah - 12 };
      tray = { x: ax + bw + 8, y: top, w: aw - bw - 8, h: ah };
    }
    const bi = { x: board.x + 22, y: board.y + 20, w: board.w - 44, h: board.h - 44 };
    const ti = { x: tray.x + 20, y: tray.y + 16, w: tray.w - 40, h: tray.h - 50 };
    const gb = bestGrid(n, bi.w, bi.h), gt = bestGrid(n, ti.w, ti.h);
    S = Math.max(40, Math.min(gb.cell * .86, gt.cell * .88, 170));
    holesPos = gridPts(n, bi, gb); slotsPos = gridPts(n, ti, gt);
    hintEl.style.top = (portrait ? board.y + board.h - 2 : H - 40) + 'px';
    if (!portrait) { hintEl.style.left = board.x + 'px'; hintEl.style.right = (W - board.x - board.w) + 'px'; }
    else { hintEl.style.left = '0'; hintEl.style.right = '0'; }
  }
  function placePieces() {
    for (const p of pieces) {
      p.b = bake(p.it, S, dpr);
      p.hx = holesPos[p.hi].x; p.hy = holesPos[p.hi].y;
      p.homeX = slotsPos[p.si].x; p.homeY = slotsPos[p.si].y;
      if (p.state === 'done' || p.state === 'fly') { p.x = p.hx; p.y = p.hy; p.state = 'done'; p.sc = 1; p.rot = 0; p.pop = 0; }
      else if (p.state !== 'drag') { p.x = p.homeX; p.y = p.homeY; if (p.state === 'back' && p.a >= 0) p.state = 'tray'; }
    }
    buildBg();
  }
  function buildBg() {
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    let g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#FFF3E0'); g.addColorStop(1, '#FFE2C2');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i * 34 < W + 34; i++) { x.fillStyle = i % 2 ? 'rgba(255,255,255,.35)' : 'rgba(255,200,150,.12)'; x.fillRect(i * 34, 0, 17, H); }
    const R = rng(7);
    for (let i = 0; i < 26; i++) { x.fillStyle = ['rgba(255,140,90,.18)', 'rgba(120,200,220,.2)', 'rgba(255,205,80,.22)'][i % 3]; x.beginPath(); x.arc(R() * W, R() * H * .7, 3 + R() * 5, 0, TAU); x.fill(); }
    const fy = portrait ? H * .74 : H * .7;
    g = x.createLinearGradient(0, fy, 0, H); g.addColorStop(0, '#E9C79C'); g.addColorStop(1, '#D9AE7C');
    x.fillStyle = g; x.fillRect(0, fy, W, H - fy);
    x.fillStyle = 'rgba(255,255,255,.5)'; x.fillRect(0, fy, W, 3);
    x.fillStyle = 'rgba(150,95,45,.18)';
    for (let yy = fy + 26, k = 0; yy < H; yy += 26, k++) { x.fillRect(0, yy, W, 1.5); for (let xx = (k % 2) * 70; xx < W; xx += 140) x.fillRect(xx, yy - 26, 1.5, 26); }
    const cx = W / 2, cy = (fy + H) / 2 + 10, rw = Math.min(W * .48, 420), rh = Math.max(30, (H - fy) * .42);
    ['#FFB36B', '#FFE08A', '#8FD6C8', '#FF9AB8', '#FFE9C4'].forEach((c, i) => { x.fillStyle = c; x.beginPath(); x.ellipse(cx, cy, rw * (1 - i * .17), rh * (1 - i * .17), 0, 0, TAU); x.fill(); });
    drawTray(x, tray);
    drawBoard(x, board);
    for (const p of pieces) { const s = p.b.sz; x.drawImage(p.b.hole, p.hx - s / 2, p.hy - s / 2, s, s); }
  }
  function drawBoard(x, b) {
    const rad = 26, th = 12;
    x.save(); x.shadowColor = 'rgba(80,40,10,.38)'; x.shadowBlur = 22; x.shadowOffsetY = 12;
    x.fillStyle = '#7E4A20'; x.beginPath(); x.roundRect(b.x, b.y + th, b.w, b.h, rad); x.fill(); x.restore();
    x.fillStyle = '#8A5426'; x.beginPath(); x.roundRect(b.x, b.y + th, b.w, b.h, rad); x.fill();
    x.save(); x.beginPath(); x.roundRect(b.x, b.y, b.w, b.h, rad); x.clip();
    woodGrain(x, b.x, b.y, b.w, b.h, BOARD_WOOD[0], BOARD_WOOD[1], 11, 'rgba(110,55,15,A)');
    const g = x.createLinearGradient(0, b.y, 0, b.y + b.h); g.addColorStop(0, 'rgba(255,240,210,.25)'); g.addColorStop(.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(90,40,0,.18)');
    x.fillStyle = g; x.fillRect(b.x, b.y, b.w, b.h);
    x.restore();
    x.lineWidth = 3; x.strokeStyle = 'rgba(255,230,190,.7)'; x.beginPath(); x.roundRect(b.x + 1.5, b.y + 1.5, b.w - 3, b.h - 3, rad - 1); x.stroke();
    const ins = 11;
    x.lineWidth = 2.5; x.strokeStyle = 'rgba(95,45,10,.35)'; x.beginPath(); x.roundRect(b.x + ins, b.y + ins, b.w - ins * 2, b.h - ins * 2, rad - 8); x.stroke();
    x.lineWidth = 1.5; x.strokeStyle = 'rgba(255,225,180,.55)'; x.beginPath(); x.roundRect(b.x + ins + 2, b.y + ins + 2, b.w - ins * 2 - 4, b.h - ins * 2 - 4, rad - 10); x.stroke();
    [[b.x + 12, b.y + 12], [b.x + b.w - 12, b.y + 12], [b.x + 12, b.y + b.h - 12], [b.x + b.w - 12, b.y + b.h - 12]].forEach(([sx, sy], i) => {
      const gg = x.createRadialGradient(sx - 1.5, sy - 1.5, .5, sx, sy, 5); gg.addColorStop(0, '#FFF6D8'); gg.addColorStop(1, '#B08A4A');
      x.fillStyle = gg; x.beginPath(); x.arc(sx, sy, 4.5, 0, TAU); x.fill();
      x.strokeStyle = 'rgba(90,60,20,.7)'; x.lineWidth = 1.2; x.beginPath(); const a = .6 + i; x.moveTo(sx - Math.cos(a) * 3, sy - Math.sin(a) * 3); x.lineTo(sx + Math.cos(a) * 3, sy + Math.sin(a) * 3); x.stroke();
    });
  }
  function drawTray(x, t) {
    const rad = 26, th = 10;
    x.save(); x.shadowColor = 'rgba(80,40,10,.28)'; x.shadowBlur = 18; x.shadowOffsetY = 10;
    x.fillStyle = '#C08A4E'; x.beginPath(); x.roundRect(t.x, t.y + th, t.w, t.h - th, rad); x.fill(); x.restore();
    x.save(); x.beginPath(); x.roundRect(t.x, t.y, t.w, t.h - th, rad); x.clip();
    woodGrain(x, t.x, t.y, t.w, t.h, '#EFC487', '#F7D59E', 23, 'rgba(150,90,30,A)');
    x.restore();
    x.lineWidth = 2.5; x.strokeStyle = 'rgba(255,245,220,.8)'; x.beginPath(); x.roundRect(t.x + 1.5, t.y + 1.5, t.w - 3, t.h - th - 3, rad - 1); x.stroke();
    const f = { x: t.x + 12, y: t.y + 12, w: t.w - 24, h: t.h - th - 24 };
    x.save(); x.beginPath(); x.roundRect(f.x, f.y, f.w, f.h, rad - 10); x.clip();
    const g = x.createLinearGradient(0, f.y, 0, f.y + f.h); g.addColorStop(0, '#FFF6E6'); g.addColorStop(1, '#FBE9CC');
    x.fillStyle = g; x.fillRect(f.x, f.y, f.w, f.h);
    const R = rng(5); x.fillStyle = 'rgba(190,140,80,.07)';
    for (let i = 0; i < f.w * f.h / 90; i++) x.fillRect(f.x + R() * f.w, f.y + R() * f.h, 1, 1);
    x.shadowColor = 'rgba(140,90,40,.4)'; x.shadowBlur = 10; x.shadowOffsetY = 4;
    x.lineWidth = 12; x.strokeStyle = '#000'; x.beginPath(); x.roundRect(f.x - 6, f.y - 6, f.w + 12, f.h + 12, rad - 4); x.stroke();
    x.restore();
    x.setLineDash([7, 6]); x.lineWidth = 2; x.strokeStyle = 'rgba(214,160,95,.55)';
    x.beginPath(); x.roundRect(f.x + 7, f.y + 7, f.w - 14, f.h - 14, rad - 16); x.stroke(); x.setLineDash([]);
  }

  /* ---------- المستويات ---------- */
  function startLevel(n) {
    lvl = clamp(n, 1, LV().length);
    clearTimeout(winTimer); winOv.classList.remove('on'); lvOv.classList.remove('on');
    const def = LV()[lvl - 1];
    const hi = shuffle(def.map((_, i) => i)), si = shuffle(def.map((_, i) => i));
    pieces = def.map((k, i) => {
      const it = ITEM(k, track);
      return { it, hi: hi[i], si: si[i], x: 0, y: 0, state: 'back', a: -.25 - i * .08, fx: 0, fy: 0, rot: 0, sc: 1, lift: 0, wob: 0, pop: 0, errs: 0, ph: Math.random() * TAU, flash: 0, hint: 0 };
    });
    mistakes = 0; over = false; drag = null; parts = []; rings = [];
    layout(); placePieces();
    pieces.forEach(p => { p.state = 'back'; p.fx = p.homeX + (portrait ? 0 : W * .3); p.fy = p.homeY + (portrait ? H * .45 : 0); p.x = p.fx; p.y = p.fy; p.wob = 0; });
    updChips();
    const pr = loadProg();
    if (!pr.stars[lvl]) { hintT.textContent = '👆 ' + App.t(HINT(), HINT_EN); hintEl.style.opacity = 1; } else hintEl.style.opacity = 0;
    store.set(PROG_KEY + 'Track', track); store.set(ID + 'Lang', track);
    Sound.whoosh();
  }
  function updChips() {
    root.querySelector('.cLv').textContent = numStr(lvl) + '/' + numStr(LV().length);
    root.querySelector('.cMs').textContent = numStr(mistakes);
    if (trkBtn) { trkBtn.textContent = trackDef().label; trkBtn.setAttribute('aria-label', App.t(trackDef().name, trackDef().nameEn)); }
  }
  /* أرقام الواجهة: هندية في المسار العربي */
  function numStr(n) { return trackDef().indic && App.lang !== 'en' ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n); }
  function lvLabel(def) {
    const chs = def.map(k => ITEM(k, track));
    const show = chs.length <= 3 ? chs : [chs[0], { ch: '…', col: ['#B0703A'] }, chs[chs.length - 1]];
    return show.map(c => `<i style="color:${c.col[0] === '#FFCC1A' ? '#E0A000' : c.col[0]}">${c.ch}</i>`).join(' ');
  }
  function openLevels() {
    const pr = loadProg();
    root.querySelectorAll('.seg [data-t]').forEach(b => b.classList.toggle('on', b.dataset.t === track));
    let html = '', open = false;
    LV().forEach((def, i) => {
      const n = i + 1;
      const sec = App.t(SECTIONS(track, i), SECTIONS_EN(track, i));
      if (sec) { if (open) html += '</div>'; html += `<div class="lvh">${sec}</div><div class="lvg">`; open = true; }
      else if (!open) { html += '<div class="lvg">'; open = true; }
      const s = pr.stars[n] || 0, lock = n > pr.unlocked;
      html += `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="${App.t('المستوى', 'Level')} ${n}"><span class="n">${numStr(n)}</span><span class="e" style="direction:${trackDef().indic ? 'rtl' : 'ltr'}">${lvLabel(def)}</span>
        <span class="s">${lock ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    });
    if (open) html += '</div>';
    const g = root.querySelector('.lvl'); g.innerHTML = html;
    g.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
    const cur = g.querySelector('.lvb.cur'); if (cur) try { cur.scrollIntoView({ block: 'center' }); } catch (e) {}
  }
  function setTrack(t, open) {
    if (t === track || !LEVELS[t]) return;
    track = t; Sound.tap();
    const pr = loadProg();
    if (open) { startLevel(Math.min(pr.unlocked, LV().length)); openLevels(); }
    else startLevel(Math.min(pr.unlocked, LV().length));
    const sp = trackDef().say; if (sp) App.speak(sp[0], sp[1]);
  }
  root.querySelectorAll('.seg [data-t]').forEach(b => b.addEventListener('click', () => setTrack(b.dataset.t, true)));
  if (trkBtn) trkBtn.addEventListener('click', () => { const i = TRACKS.findIndex(t => t.id === track); setTrack(TRACKS[(i + 1) % TRACKS.length].id, false); });

  function winText() {
    root.querySelector('.wT').textContent = App.t(App.g('أحسنتِ!', 'أحسنت!'), 'Well done!') + ' 🎉';
    root.querySelector('.wP').textContent = App.t(App.g('أنهيتِ', 'أنهيتَ') + ` المستوى ${numStr(lvl)}` + (mistakes ? ` · الأخطاء: ${numStr(mistakes)}` : ' دون أي خطأ! 💯'),
      `You finished level ${lvl}` + (mistakes ? ` · Mistakes: ${mistakes}` : ' with no mistakes! 💯'));
  }
  /** ترجمة نصوص الواجهة الثابتة (data-en للنص، data-al لوصف الزر) */
  function trUI() {
    root.querySelectorAll('[data-en]').forEach(e => { if (e.dataset.ar == null) e.dataset.ar = e.textContent; e.textContent = App.t(e.dataset.ar, e.dataset.en); });
    root.querySelectorAll('[data-al]').forEach(e => { if (e.dataset.aral == null) e.dataset.aral = e.getAttribute('aria-label'); e.setAttribute('aria-label', App.t(e.dataset.aral, e.dataset.al)); });
  }
  function win() {
    over = true;
    const pr = loadProg();
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LV().length, lvl + 1);
    saveProg(pr);
    for (let i = 0; i < 140; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 260), rot: rand(0, TAU), vr: rand(-8, 8),
      life: rand(2.5, 4), age: 0, s: rand(6, 11), c: PAL[i % PAL.length][0] });
    Sound.win(); vibrate(30);
    winTimer = setTimeout(() => {
      if (App.current !== ID) return;
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      winText();
      root.querySelector('[data-a="next"]').style.display = lvl < LV().length ? '' : 'none';
      winOv.classList.add('on');
      if (App.lang === 'en') App.speak('Well done!', 'en'); else App.speak(App.g('أحسنتِ!', 'أحسنت!'));
      if (stars > prev) App.addStars(stars - prev);
      App.achieve(ID + '_first');
      if (!mistakes) App.achieve(ID + '_perfect');
      if (TRACKS.every(t => { const p = loadProg(t.id); return LEVELS[t.id].every((_, i) => p.stars[i + 1]); })) App.achieve(ID + '_all');
    }, 1100);
  }

  /* ---------- الجسيمات ---------- */
  function sparkle(x, y, col) {
    for (let i = 0; i < 18; i++) {
      const a = rand(0, TAU), v = rand(80, 260);
      parts.push({ t: i % 3 ? 'star' : 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .9), age: 0, s: rand(5, 10), c: i % 2 ? '#FFE26B' : col });
    }
    rings.push({ x, y, age: 0, life: .45, c: col });
  }
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  const say = p => App.speak(p.it.say, p.it.lang);

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function hit(x, y, states) {
    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i]; if (!states.includes(p.state)) continue;
      if (Math.hypot(p.x - x, p.y - y) < S * .58) return p;
    }
    return null;
  }
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused || drag || winOv.classList.contains('on') || lvOv.classList.contains('on')) return;
    const m = pos(e);
    const p = hit(m.x, m.y, ['tray', 'back']);
    if (p) {
      if (p.state === 'back' && p.a < 0) return;
      try { cv.setPointerCapture(e.pointerId); } catch (er) {}
      drag = { p, id: e.pointerId, ox: p.x - m.x, oy: p.y - m.y, sx: m.x, sy: m.y, tx: p.x, ty: p.y, moved: false, t0: performance.now(), touch: e.pointerType !== 'mouse', lastX: m.x, vx: 0 };
      p.state = 'drag'; p.wob = 0;
      pieces.splice(pieces.indexOf(p), 1); pieces.push(p);
      Sound.tone(520, .08, 'sine', .1, 260); vibrate(10);
      say(p);
      return;
    }
    const d = hit(m.x, m.y, ['done']);
    if (d) { d.pop = 1; Sound.pop(); say(d); sparkle(d.x, d.y, d.it.col[0]); }
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const m = pos(e);
    if (!drag.moved && Math.hypot(m.x - drag.sx, m.y - drag.sy) > 8) { drag.moved = true; if (hintEl.style.opacity !== '0') hintEl.style.opacity = 0; }
    drag.tx = m.x + drag.ox; drag.ty = m.y + drag.oy - (drag.touch && drag.moved ? S * .22 : 0);
    drag.vx = drag.vx * .6 + (m.x - drag.lastX) * .4; drag.lastX = m.x;
  });
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag, p = d.p; drag = null;
    if (!d.moved && performance.now() - d.t0 < 350) { p.pop = 1; Sound.pop(); toTray(p, false); return; }
    const tol = S * .4;
    if (Math.hypot(p.x - p.hx, p.y - p.hy) < tol) { snap(p); return; }
    const wrong = pieces.find(q => q !== p && q.state !== 'done' && Math.hypot(p.x - q.hx, p.y - q.hy) < tol);
    if (wrong) {
      mistakes++; p.errs++; updChips();
      wrong.flash = 1;
      Sound.error(); vibrate(35); shake = Math.max(shake, 4);
      if (p.errs >= 2) p.hint = 3;
      toTray(p, true);
    } else { Sound.slide(); toTray(p, false); }
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);
  function toTray(p, wobble) { p.state = 'back'; p.a = 0; p.fx = p.x; p.fy = p.y; p.wob = wobble ? 1 : 0; }
  function snap(p) { p.state = 'fly'; p.a = 0; p.fx = p.x; p.fy = p.y; p.hint = 0; }

  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < LV().length ? 'next' : 'levels'); }
    else if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? lvOv.classList.remove('on') : openLevels(); }
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

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    const k = 1 - Math.exp(-dt * 28);
    for (const p of pieces) {
      p.pop = Math.max(0, p.pop - dt * 2.6);
      p.flash = Math.max(0, p.flash - dt * 1.8);
      if (p.hint > 0) p.hint = Math.max(0, p.hint - dt);
      if (p.state === 'drag' && drag && drag.p === p) {
        p.x += (drag.tx - p.x) * k; p.y += (drag.ty - p.y) * k;
        p.rot += (clamp(drag.vx * .02, -.3, .3) - p.rot) * k * .5;
        p.lift += (1 - p.lift) * k * .6; p.sc += (1.14 - p.sc) * k * .6;
      } else if (p.state === 'fly') {
        p.a += dt / .2; const t = Math.min(1, p.a), e = ease.outCubic(t);
        p.x = p.fx + (p.hx - p.fx) * e; p.y = p.fy + (p.hy - p.fy) * e;
        p.rot *= 1 - k; p.sc = 1.14 - .14 * e; p.lift = 1 - e;
        if (t >= 1) {
          p.state = 'done'; p.x = p.hx; p.y = p.hy; p.rot = 0; p.sc = 1; p.lift = 0; p.pop = 1;
          Sound.thud(); Sound.pop(); vibrate(25); shake = Math.max(shake, 3);
          sparkle(p.x, p.y, p.it.col[0]); say(p);
          if (pieces.every(q => q.state === 'done')) win();
        }
      } else if (p.state === 'back') {
        p.a += dt / (p.wob ? .55 : .38);
        if (p.a < 0) continue;
        const t = Math.min(1, p.a);
        const tm = p.wob ? clamp((t - .3) / .7, 0, 1) : t;
        const e = p.wob ? ease.outCubic(tm) : ease.outBack(tm);
        p.x = p.fx + (p.homeX - p.fx) * e; p.y = p.fy + (p.homeY - p.fy) * e;
        p.rot = p.wob ? Math.sin(t * 34) * .28 * (1 - t) : p.rot * (1 - k);
        p.lift += (0 - p.lift) * k * .5; p.sc += (1 - p.sc) * k * .5;
        if (t >= 1) { p.state = 'tray'; p.x = p.homeX; p.y = p.homeY; p.rot = 0; }
      } else if (p.state === 'tray') {
        p.x = p.homeX; p.y = p.homeY + Math.sin(T * 2.2 + p.ph) * 1.5;
        p.rot = 0; p.lift *= 1 - k; p.sc += (1 - p.sc) * k;
        if (Math.abs(p.sc - 1) < .003) p.sc = 1; if (p.lift < .005) p.lift = 0;
      }
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.t === 'conf') { q.vy = Math.min(q.vy + 120 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; }
      else { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 300 * dt; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    shake = Math.max(0, shake - dt * 18);
  }

  /* ---------- الرسم ---------- */
  function drawPiece(p, inHole) {
    const b = p.b, sz = b.sz, h = sz / 2;
    const sq = Math.sin((1 - p.pop) * Math.PI * 3) * p.pop * .13;
    // القطعة الساكنة تُرسم 1:1 على بكسلات الجهاز فتبقى حادّة تمامًا
    const still = !sq && Math.abs(p.rot) < .002 && Math.abs(p.sc - 1) < .002 && p.lift < .01;
    const px = Math.round(p.x * dpr) / dpr, py = Math.round(p.y * dpr) / dpr;
    ctx.save(); ctx.translate(px, py);
    if (!inHole) {
      const so = 3 + p.lift * 16;
      ctx.save(); ctx.globalAlpha = .55 - p.lift * .2; ctx.translate(so * .35, so);
      const ss = p.sc * (1 + p.lift * .06); ctx.rotate(p.rot); ctx.scale(ss, ss);
      ctx.drawImage(b.shadow, -h, -h, sz, sz); ctx.restore();
    }
    if (!still) { ctx.rotate(p.rot); ctx.scale(p.sc * (1 + sq), p.sc * (1 - sq)); }
    const th = Math.round((inHole ? 2.5 : S * .11) * dpr);
    if (th > 0) ctx.drawImage(b.sideD, -h, -h + th / dpr, sz, sz);
    for (let i = th - 1; i > 0; i--) ctx.drawImage(b.side, -h, -h + i / dpr, sz, sz);
    ctx.drawImage(b.top, -h, -h, sz, sz);
    ctx.restore();
  }
  function render() {
    ctx.save();
    ctx.fillStyle = '#FFE9D0'; ctx.fillRect(0, 0, W, H);
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    for (const p of pieces) {
      if (p.state === 'done') continue;
      let gA = 0;
      if (drag && drag.moved) { const d = Math.hypot(drag.p.x - p.hx, drag.p.y - p.hy); gA = clamp(1 - d / (S * .9), 0, 1) * .85; }
      const hintOn = pieces.some(q => q.hint > 0 && q.hi === p.hi && q.state !== 'done');
      if (hintOn) gA = Math.max(gA, .45 + .45 * Math.sin(T * 8));
      if (gA > .01) { ctx.save(); ctx.globalAlpha = gA; ctx.drawImage(p.b.glow, p.hx - p.b.sz / 2, p.hy - p.b.sz / 2, p.b.sz, p.b.sz); ctx.drawImage(p.b.hole, p.hx - p.b.sz / 2, p.hy - p.b.sz / 2, p.b.sz, p.b.sz); ctx.restore(); }
      if (p.flash > 0) {
        ctx.save(); ctx.globalAlpha = p.flash; ctx.translate(p.hx, p.hy); ctx.rotate(Math.sin(T * 30) * .1 * p.flash);
        ctx.strokeStyle = '#FF4B4B'; ctx.lineWidth = 7; ctx.lineCap = 'round'; const a = S * .16;
        ctx.beginPath(); ctx.moveTo(-a, -a); ctx.lineTo(a, a); ctx.moveTo(a, -a); ctx.lineTo(-a, a); ctx.stroke(); ctx.restore();
      }
    }
    for (const p of pieces) if (p.state === 'done') drawPiece(p, true);
    for (const p of pieces) if (p.state === 'tray') drawPiece(p, false);
    for (const p of pieces) if (p.state === 'back' || p.state === 'fly') drawPiece(p, false);
    if (drag) drawPiece(drag.p, false);
    for (const r of rings) {
      const t = r.age / r.life;
      ctx.save(); ctx.globalAlpha = 1 - t; ctx.strokeStyle = '#FFF4B0'; ctx.lineWidth = 6 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, S * (.45 + t * .5), 0, TAU); ctx.stroke(); ctx.restore();
    }
    for (const q of parts) {
      const a = 1 - q.age / q.life;
      ctx.save(); ctx.globalAlpha = q.t === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillStyle = q.c;
      if (q.t === 'star') { starPath(ctx, q.s * (.6 + a * .5)); ctx.fill(); }
      else if (q.t === 'dot') { ctx.beginPath(); ctx.arc(0, 0, q.s * .45 * a + 1, 0, TAU); ctx.fill(); }
      else { ctx.scale(1, Math.cos(q.age * 9 + q.rot)); ctx.fillRect(-q.s / 2, -q.s * .3, q.s, q.s * .6); }
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
    if (App.current !== ID || !pieces.length) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); placePieces(); if (!running) render(); }, 60);
  });
  /* الخط العريض قد يتأخر تحميله: نعيد تجهيز القطع بعد وصوله كي تطابق أشكالها الحروف تمامًا */
  function ensureFonts() {
    if (fontsReady || !document.fonts || !document.fonts.load) { fontsReady = true; return; }
    Promise.all(FONT_SAMPLES.map(t => document.fonts.load(glyphFont(60), t))).catch(() => {}).then(() => {
      fontsReady = true;
      if (App.current === ID && pieces.length) { layout(); placePieces(); }
    });
  }

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#FFE7C7'); g.addColorStop(1, '#FFC98F');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    const bx = s * .14, by = s * .2, bw = s * .72, bh = s * .56;
    c.save(); c.shadowColor = 'rgba(90,45,10,.4)'; c.shadowBlur = 10; c.shadowOffsetY = 6;
    c.fillStyle = '#8A5426'; c.beginPath(); c.roundRect(bx, by + 7, bw, bh, 16); c.fill(); c.restore();
    c.save(); c.beginPath(); c.roundRect(bx, by, bw, bh, 16); c.clip();
    woodGrain(c, bx, by, bw, bh, BOARD_WOOD[0], BOARD_WOOD[1], 4, 'rgba(110,55,15,A)'); c.restore();
    c.lineWidth = 2; c.strokeStyle = 'rgba(255,230,190,.8)'; c.beginPath(); c.roundRect(bx + 1, by + 1, bw - 2, bh - 2, 15); c.stroke();
    c.save(); c.direction = 'ltr'; c.textAlign = 'center'; c.textBaseline = 'middle';
    // فتحة
    c.font = glyphFont(s * .36);
    c.fillStyle = 'rgba(255,226,180,.7)'; c.fillText(ICON[0], s * .34, s * .5 + 2);
    c.fillStyle = '#3A1E0C'; c.fillText(ICON[0], s * .34, s * .5);
    // قطعة ملوّنة سميكة
    const [ch, col] = [ICON[1], ICON[2]];
    c.font = glyphFont(s * .46);
    c.save(); c.shadowColor = 'rgba(60,30,5,.45)'; c.shadowBlur = 8; c.shadowOffsetY = 7; c.fillStyle = col[1];
    c.fillText(ch, s * .64, s * .62 + 6); c.restore();
    c.fillStyle = col[1]; for (let i = 5; i > 0; i--) c.fillText(ch, s * .64, s * .62 + i);
    g = c.createLinearGradient(0, s * .42, 0, s * .8); g.addColorStop(0, col[2]); g.addColorStop(.4, col[0]); g.addColorStop(1, col[1]);
    c.fillStyle = g; c.fillText(ch, s * .64, s * .62);
    c.restore();
    c.save(); c.translate(s * .8, s * .24); c.fillStyle = '#FFD84A'; starPath(c, s * .07); c.fill(); c.restore();
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: TITLE, icon2: ICON2, isNew: false, music: MUSIC,
    desc: DESC, help: HELP, icon, titleEn: TITLE_EN, descEn: () => DESC_EN, helpEn: HELP_EN,
    best() {
      let tot = 0, top = 0;
      for (const t of TRACKS) { const pr = loadProg(t.id); for (const n in pr.stars) if (pr.stars[n]) { tot += pr.stars[n]; top++; } }
      return tot ? App.t(`🏆 ${top} مستوى · ⭐ ${tot}`, `🏆 ${top} level${top === 1 ? '' : 's'} · ⭐ ${tot}`) : '';
    },
    enter() {
      paused = false; trUI();
      const st = App.gameLang(ID);
      track = LEVELS[st] ? st : TRACKS[0].id;
      ensureFonts();
      startLevel(Math.min(loadProg().unlocked, LV().length));
      render();
      startLoop();
    },
    onLang(l) {
      trUI();
      if (LANG_TRACK && l !== track && LEVELS[l]) { setTrack(l, lvOv.classList.contains('on')); return; }
      updChips();
      const pr = loadProg();
      if (!pr.stars[lvl]) hintT.textContent = '👆 ' + App.t(HINT(), HINT_EN);
      if (lvOv.classList.contains('on')) openLevels();
      if (winOv.classList.contains('on')) winText();
    },
    leave() { stopLoop(); clearTimeout(winTimer); drag = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { const p = drag.p; drag = null; toTray(p, false); } },
    resume() { paused = false; last = performance.now(); },
    /* للاختبار الآلي فقط */
    _state() { return { track, lvl, mistakes, S, n: LV().length, pieces: pieces.map(p => ({ ch: p.it.ch, state: p.state, x: p.x, y: p.y, hx: p.hx, hy: p.hy })) }; },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    }
  });
})();
