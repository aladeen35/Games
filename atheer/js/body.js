/* =====================================================================
   أجزاء الجسم — طفل/طفلة كبير مرسوم يتنفّس ويرمش ويتفاعل مع اللمس
   أوضاع: تعلّم (المس أي جزء)، ابحث (المسي الأنف)، الحواس (بماذا نشمّ؟)،
   ألبسني (القبعة ← الرأس)
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'body';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,"Segoe UI",Tahoma,sans-serif';
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  /* ---------- أجزاء الجسم ----------
     ar: الصيغة بعد «المسي» (منصوبة)، arn: صيغة الاسم وحده (مرفوعة) */
  const PARTS = {
    head:      { ar: 'الرأس', en: 'head', e: '🙆' },
    hair:      { ar: 'الشعر', en: 'hair', e: '💇' },
    eyes:      { ar: 'العينين', arn: 'العينان', en: 'eyes', e: '👀' },
    ears:      { ar: 'الأذنين', arn: 'الأذنان', en: 'ears', e: '👂' },
    nose:      { ar: 'الأنف', en: 'nose', e: '👃' },
    mouth:     { ar: 'الفم', en: 'mouth', e: '👄' },
    teeth:     { ar: 'الأسنان', en: 'teeth', e: '🦷' },
    tongue:    { ar: 'اللسان', en: 'tongue', e: '👅' },
    cheeks:    { ar: 'الخدين', arn: 'الخدان', en: 'cheeks', e: '😊' },
    chin:      { ar: 'الذقن', en: 'chin', e: '🤔' },
    neck:      { ar: 'الرقبة', en: 'neck', e: '🦒' },
    shoulders: { ar: 'الكتفين', arn: 'الكتفان', en: 'shoulders', e: '🤷' },
    arms:      { ar: 'الذراعين', arn: 'الذراعان', en: 'arms', e: '🙌' },
    elbows:    { ar: 'المرفقين', arn: 'المرفقان', en: 'elbows', e: '💪' },
    hands:     { ar: 'اليدين', arn: 'اليدان', en: 'hands', e: '✋' },
    fingers:   { ar: 'الأصابع', en: 'fingers', e: '🖐️' },
    tummy:     { ar: 'البطن', en: 'tummy', e: '😆' },
    knees:     { ar: 'الركبتين', arn: 'الركبتان', en: 'knees', e: '🧎' },
    legs:      { ar: 'الرجلين', arn: 'الرجلان', en: 'legs', e: '🦵' },
    feet:      { ar: 'القدمين', arn: 'القدمان', en: 'feet', e: '🦶' },
    toes:      { ar: 'أصابع القدمين', en: 'toes', e: '🦶' },
    back:      { ar: 'الظهر', en: 'back', e: '🎒' }
  };
  for (const k in PARTS) PARTS[k].id = k;
  const ALL_PARTS = Object.keys(PARTS);
  /* إجابات مقبولة (لمس جزء أدقّ داخل الجزء المطلوب يُعدّ صحيحًا) */
  const ACCEPT = { head: ['head', 'hair'], hands: ['hands', 'fingers'], feet: ['feet', 'toes'], legs: ['legs', 'knees'], arms: ['arms', 'elbows'], mouth: ['mouth', 'teeth', 'tongue'] };
  const FRONT_ONLY = ['eyes', 'nose', 'mouth', 'teeth', 'tongue', 'cheeks', 'chin', 'tummy', 'toes'];

  /* ---------- الحواس ---------- */
  const SENSES = {
    smell: { ar: 'بماذا نشم؟', en: 'What do we smell with?', cue: '🌹', ok: ['nose'] },
    see:   { ar: 'بماذا نرى؟', en: 'What do we see with?', cue: '🌈', ok: ['eyes'] },
    hear:  { ar: 'بماذا نسمع؟', en: 'What do we hear with?', cue: '🎵', ok: ['ears'] },
    taste: { ar: 'بماذا نتذوق؟', en: 'What do we taste with?', cue: '🍦', ok: ['tongue', 'mouth'], open: true },
    touch: { ar: 'بماذا نلمس؟', en: 'What do we touch with?', cue: '🧸', ok: ['hands', 'fingers'] },
    walk:  { ar: 'بماذا نمشي؟', en: 'What do we walk with?', cue: '🚶', ok: ['feet', 'legs', 'toes', 'knees'] },
    chew:  { ar: 'بماذا نمضغ؟', en: 'What do we chew with?', cue: '🍎', ok: ['teeth', 'mouth'], open: true },
    clap:  { ar: 'بماذا نصفق؟', en: 'What do we clap with?', cue: '👏', ok: ['hands', 'fingers'] },
    think: { ar: 'بماذا نفكر؟', en: 'What do we think with?', cue: '💭', ok: ['head', 'hair'] },
    kick:  { ar: 'بماذا نركل الكرة؟', en: 'What do we kick the ball with?', cue: '⚽', ok: ['feet', 'toes', 'legs'] },
    hug:   { ar: 'بماذا نعانق؟', en: 'What do we hug with?', cue: '🤗', ok: ['arms', 'hands', 'elbows'] }
  };

  /* ---------- الملابس والإكسسوارات ---------- */
  const ITEMS = {
    hat:        { ar: 'القبعة', en: 'hat', e: () => girl ? '👒' : '🧢', ok: ['head', 'hair'], slot: 'head', v: 'wear' },
    crown:      { ar: 'التاج', en: 'crown', e: () => '👑', ok: ['head', 'hair'], slot: 'head', v: 'put' },
    glasses:    { ar: 'النظارة', en: 'glasses', e: () => '👓', ok: ['eyes', 'nose'], slot: 'eyes', v: 'wear' },
    scarf:      { ar: 'الوشاح', en: 'scarf', e: () => '🧣', ok: ['neck'], slot: 'neck', v: 'wear' },
    gloves:     { ar: 'القفازات', en: 'gloves', e: () => '🧤', ok: ['hands', 'fingers'], slot: 'hands', v: 'wear' },
    shoes:      { ar: 'الحذاء', en: 'shoes', e: () => '👟', ok: ['feet', 'toes'], slot: 'feet', v: 'wear' },
    socks:      { ar: 'الجوارب', en: 'socks', e: () => '🧦', ok: ['feet', 'toes'], slot: 'feet', v: 'wear' },
    watch:      { ar: 'الساعة', en: 'watch', e: () => '⌚', ok: ['hands', 'arms'], slot: 'wrist', v: 'wear' },
    ring:       { ar: 'الخاتم', en: 'ring', e: () => '💍', ok: ['fingers', 'hands'], slot: 'finger', v: 'wear' },
    backpack:   { ar: 'الحقيبة', en: 'backpack', e: () => '🎒', ok: ['back', 'shoulders'], slot: 'back', v: 'carry' },
    headphones: { ar: 'السماعات', en: 'headphones', e: () => '🎧', ok: ['ears'], slot: 'ears', v: 'put' }
  };
  const VERB = { wear: ['أين نلبس', 'Where do we wear the'], put: ['أين نضع', 'Where do we put the'], carry: ['أين نحمل', 'Where do we carry the'] };

  /* ---------- المستويات ---------- */
  const LEVELS = [
    { m: 'learn', t: 'الوجه', parts: ['head', 'hair', 'eyes', 'ears', 'nose', 'mouth', 'cheeks', 'chin'] },
    { m: 'find', t: 'الوجه', parts: ['head', 'eyes', 'ears', 'nose', 'mouth', 'hair'], q: 5 },
    { m: 'learn', t: 'الجسم', parts: ['neck', 'shoulders', 'arms', 'elbows', 'hands', 'fingers', 'tummy', 'legs', 'knees', 'feet', 'toes', 'back'] },
    { m: 'find', t: 'الجسم', parts: ['hands', 'feet', 'tummy', 'arms', 'legs', 'neck'], q: 6 },
    { m: 'senses', t: 'الحواس الخمس', set: ['smell', 'see', 'hear', 'taste', 'touch'], q: 5 },
    { m: 'dress', t: 'ألبسني', set: ['hat', 'shoes', 'gloves', 'glasses', 'scarf'], q: 5 },
    { m: 'find', t: 'التفاصيل', parts: ['teeth', 'tongue', 'cheeks', 'chin', 'elbows', 'fingers', 'knees', 'toes', 'shoulders'], q: 6 },
    { m: 'find', t: 'لِفّ واستدر', parts: ['back', 'shoulders', 'neck', 'knees', 'elbows', 'hair', 'nose'], q: 6, back: true },
    { m: 'senses', t: 'ماذا نفعل؟', set: ['walk', 'chew', 'clap', 'think', 'kick', 'hug', 'smell', 'hear'], q: 6 },
    { m: 'dress', t: 'إكسسوارات', set: ['crown', 'socks', 'watch', 'ring', 'backpack', 'headphones'], q: 6 },
    { m: 'find', t: 'كل الجسم', parts: ALL_PARTS, q: 8, back: true },
    { m: 'mix', t: 'التحدّي الكبير', q: 9 }
  ];
  const MODE = {
    learn: { i: '🎓', ar: 'تعلّم' }, find: { i: '👆', ar: 'ابحث' }, senses: { i: '👃', ar: 'الحواس' }, dress: { i: '👕', ar: 'ألبسني' }, mix: { i: '🏆', ar: 'تحدٍّ' }
  };

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const plain = s => s.replace(/[ً-ْ]/g, '');
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const loadProg = () => { const p = store.get('bodyProg', null) || {}; return { stars: p.stars || {}, unlocked: p.unlocked || 1, seen: p.seen || [] }; };
  let lang = 'ar';
  const num = n => lang === 'ar' ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
  let girl = true;

  /* ---------- النطق ---------- */
  const say = (ar, en) => lang === 'ar' ? App.speak(plain(ar)) : App.speak(en, 'en');
  const partName = (p, nom) => lang === 'ar' ? (nom && p.arn ? p.arn : p.ar) : p.en;
  const sayPart = (p) => say(p.arn || p.ar, p.en);
  const sayGood = () => say(App.g('أحسنتِ!', 'أحسنتَ!'), 'Well done!');
  const sayTry = () => say(App.g('حاولي مرة أخرى.', 'حاول مرة أخرى.'), 'Try again!');

  /* ---------- ملصقات الرموز (حافة بيضاء) ---------- */
  const bakeCache = new Map();
  function bake(e, size, flip) {
    const px = Math.max(8, Math.round(size * dpr)), key = e + '|' + px + (flip ? 'f' : '');
    let c = bakeCache.get(key); if (c) return c;
    const pad = Math.round(px * .15), S = px + pad * 2;
    const g = mk(S, S), x = g.getContext('2d');
    x.font = `${Math.round(px * .86)}px ${EMOJI_FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle';
    if (flip) { x.translate(S, 0); x.scale(-1, 1); }
    x.fillText(e, S / 2, S / 2 + px * .04);
    const sil = mk(S, S), sx = sil.getContext('2d');
    sx.drawImage(g, 0, 0); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = '#fff'; sx.fillRect(0, 0, S, S);
    c = mk(S, S); const cx = c.getContext('2d');
    const r = Math.max(2, px * .045);
    cx.save(); cx.shadowColor = 'rgba(60,30,40,.28)'; cx.shadowBlur = px * .05; cx.shadowOffsetY = px * .025;
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; cx.drawImage(sil, Math.cos(a) * r, Math.sin(a) * r); }
    cx.restore();
    cx.drawImage(g, 0, 0);
    if (bakeCache.size > 120) bakeCache.clear();
    bakeCache.set(key, c);
    return c;
  }
  function drawEmoji(e, x, y, size, rot = 0, flip = false, alpha = 1) {
    const b = bake(e, size, flip), s = size * 1.3;
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.drawImage(b, -s / 2, -s / 2, s, s); ctx.restore();
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #body{background:#FFE6D2;overflow:hidden;color:#5A2A3A}
  #body canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #body .ib{color:#D9512F}
  #body .lng{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 rgba(160,60,40,.2),0 8px 16px rgba(120,40,30,.15)}
  #body .lng button{min-width:64px;padding:6px 11px;border-radius:99px;font-weight:900;font-size:17px;background:#FFF1EA;color:#C2502E;line-height:1.25}
  #body .lng button[data-l=en]{font-family:system-ui,"Segoe UI",sans-serif;font-size:16px}
  #body .lng button.on{background:linear-gradient(#FF9C7A,#FF6B47);color:#fff;box-shadow:0 3px 0 #C9431F;text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #body .pbar{position:absolute;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 58px);z-index:4;display:flex;gap:4px;padding:6px 9px;border-radius:99px;
    background:rgba(255,255,255,.92);box-shadow:0 3px 0 rgba(160,60,40,.15),0 6px 14px rgba(120,40,30,.1);max-width:calc(100% - 24px)}
  #body .pbar i{width:24px;height:12px;border-radius:6px;background:#F1E2DA;box-shadow:inset 0 2px 2px rgba(0,0,0,.08);flex:0 1 24px;min-width:8px}
  #body .pbar i.on{background:linear-gradient(#FFC861,#FF8A1F);box-shadow:0 2px 0 #D06A00;animation:bdPop .45s cubic-bezier(.3,1.8,.5,1)}
  #body .pbar i.cur{background:#FFE7B5;box-shadow:0 0 0 2px #FFB35C}
  @keyframes bdPop{40%{transform:scale(1.5,1.3)}}
  #body .ask{position:absolute;z-index:5;left:50%;transform:translateX(-50%);bottom:max(12px,env(safe-area-inset-bottom));width:min(calc(100% - 24px),560px);
    display:flex;align-items:center;gap:10px;padding:9px 12px 9px 10px;border-radius:30px;background:linear-gradient(180deg,#fff 0,#fff 70%,#FFF4EE 100%);
    border:4px solid #FFB59C;box-shadow:0 7px 0 #F08A6A,0 14px 24px rgba(120,40,30,.22)}
  #body .spk{width:62px;height:62px;flex:0 0 62px;border-radius:50%;font-size:28px;display:grid;place-items:center;
    background:radial-gradient(circle at 35% 30%,#FFE98A,#FFC21A 60%,#E9A300);border:3px solid #FFF4C4;box-shadow:0 5px 0 #C98600,0 8px 14px rgba(0,0,0,.18),inset 0 2px 0 rgba(255,255,255,.6);transition:transform .14s var(--press)}
  #body .spk:active{transform:translateY(3px) scale(1.06,.92);box-shadow:0 2px 0 #C98600}
  #body .spk.pulse{animation:bdSpk 1s ease-in-out 2}
  @keyframes bdSpk{50%{transform:scale(1.13)}}
  #body .aq{flex:1;min-width:0;display:flex;align-items:center;gap:8px;font-weight:900;color:#7A2E3A;font-size:clamp(19px,5.6vw,27px);line-height:1.15}
  #body .aq .ai{font-size:clamp(34px,10vw,46px);line-height:1;font-family:${EMOJI_FONT};filter:drop-shadow(0 3px 0 rgba(160,60,40,.18));flex:none}
  #body .aq .at{min-width:0}
  #body .aq .at small{display:block;font-size:13px;font-weight:800;color:#C2502E;opacity:.85;line-height:1.2}
  #body .aq .at.en{font-family:system-ui,"Segoe UI",sans-serif;font-weight:800}
  #body .item{flex:none;width:76px;height:76px;border-radius:24px;display:none;place-items:center;font-size:48px;font-family:${EMOJI_FONT};cursor:grab;
    background:linear-gradient(#FFF7D9,#FFE79A);border:3px solid #fff;box-shadow:0 5px 0 #E9B940,0 8px 14px rgba(0,0,0,.15);touch-action:none}
  #body .item.on{display:grid;animation:bdWob 1.6s ease-in-out infinite}
  #body .item.drag{opacity:.25;animation:none}
  @keyframes bdWob{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg) scale(1.05)}}
  #body .ghost{position:fixed;z-index:30;width:90px;height:90px;margin:-45px 0 0 -45px;display:grid;place-items:center;font-size:62px;font-family:${EMOJI_FONT};pointer-events:none;
    filter:drop-shadow(0 0 0 #fff) drop-shadow(0 8px 10px rgba(0,0,0,.3));display:none}
  #body .turnb{position:absolute;z-index:5;width:60px;height:60px;flex:none;font-size:28px;right:max(14px,env(safe-area-inset-right));color:#7A3E00;
    background:linear-gradient(180deg,#B8F0FF,#5CC8F2 60%,#2EA5D8);border-color:#E6FAFF;box-shadow:0 5px 0 #1C82B0,0 8px 14px rgba(20,90,130,.3)}
  #body .turnb.pulse{animation:bdTurn 1s ease-in-out infinite}
  @keyframes bdTurn{50%{transform:scale(1.15) rotate(25deg)}}
  #body .overlay{background:radial-gradient(circle at 50% 45%,rgba(120,40,30,.25),rgba(80,20,30,.5))}
  #body .panel{border:5px solid #FFC9B5;box-shadow:0 8px 0 #F08A6A,0 20px 40px rgba(80,20,10,.3);color:#5A2A3A;background:linear-gradient(180deg,#fff 0,#fff 70%,#FFF3EC 100%)}
  #body .panel h3{color:#E2552F;text-shadow:0 3px 0 #FFE0D3}
  #body .btn{background:linear-gradient(#FF9C7A,#FF6B47 60%,#EE5230);box-shadow:0 5px 0 #C9431F,0 8px 12px rgba(200,70,30,.25)}
  #body .btn:active{box-shadow:0 1px 0 #C9431F}
  #body .btn.alt{background:#fff;color:#D9512F;box-shadow:0 5px 0 #FFC9B5;border:3px solid #FFE3D8}
  #body .wkid{font-size:50px;line-height:1.1;font-family:${EMOJI_FONT}}
  #body .lvp{width:min(94vw,460px);max-height:90vh;overflow-y:auto;touch-action:pan-y;padding:16px 12px 14px}
  #body .lvg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:10px 0 12px}
  #body .lvb{position:relative;border-radius:22px;background:linear-gradient(#fff,#FFF4EE);border:3px solid #FFC9B5;box-shadow:0 5px 0 #F3A68C;
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#7A2E3A;font-weight:900;padding:8px 2px 6px;gap:1px;min-height:104px}
  #body .lvb.m-find{border-color:#BFE3FF;box-shadow:0 5px 0 #8CC3EE;background:linear-gradient(#fff,#F0F8FF)}
  #body .lvb.m-senses{border-color:#D9C8FF;box-shadow:0 5px 0 #AF95F0;background:linear-gradient(#fff,#F6F1FF)}
  #body .lvb.m-dress{border-color:#C8F0C0;box-shadow:0 5px 0 #8FD283;background:linear-gradient(#fff,#F1FFEE)}
  #body .lvb.m-mix{border-color:#FFE08A;box-shadow:0 5px 0 #F2B630;background:linear-gradient(#fff,#FFF8DD)}
  #body .lvb:active{transform:translateY(3px)}
  #body .lvb .n{position:absolute;top:4px;right:6px;width:24px;height:24px;border-radius:50%;background:#FF7A59;color:#fff;font-size:14px;display:grid;place-items:center;box-shadow:0 2px 0 #C9431F}
  #body .lvb .e{font-size:32px;line-height:1.15;font-family:${EMOJI_FONT}}
  #body .lvb b{font-size:13px;line-height:1.15}
  #body .lvb small{font-size:11px;opacity:.7;font-weight:800}
  #body .lvb .s{font-size:12px;letter-spacing:-1px;line-height:1;height:13px}
  #body .lvb .s i{font-style:normal}
  #body .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #body .lvb.cur{outline:3px solid #FF9A1F;outline-offset:2px}
  #body .lvb.lock{filter:grayscale(.85);opacity:.6}
  #body .lvb.lock::after{content:'🔒';position:absolute;font-size:22px;top:30px}
  @media (min-width:720px){#body .ask{padding:10px 16px 10px 12px}}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🔢</button>
      <span class="grow"></span>
      <div class="lng"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="pbar"></div>
    <button class="ib turnb" aria-label="استدر">🔄</button>
    <div class="ask">
      <button class="spk" aria-label="اسمع مرة أخرى">🔊</button>
      <div class="aq"><span class="ai"></span><span class="at"></span></div>
      <div class="item" aria-label="اسحب"></div>
    </div>
    <div class="ghost"></div>
    <div class="overlay" id="bdLv"><div class="panel lvp"><h3>🔢 المستويات</h3><div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="bdWin"><div class="panel">
      <h3 class="wT"></h3><div class="wkid"></div><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const pbar = root.querySelector('.pbar'), askEl = root.querySelector('.ask'), spkBtn = root.querySelector('.spk');
  const aiEl = root.querySelector('.ai'), atEl = root.querySelector('.at'), itemEl = root.querySelector('.item'), ghost = root.querySelector('.ghost');
  const turnBtn = root.querySelector('.turnb');
  const lvOv = root.querySelector('#bdLv'), winOv = root.querySelector('#bdWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, portrait = true;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, def = LEVELS[0], bgLayer = null, bgKey = '';
  let CX = 0, TOPY = 0, K = 2;              // موضع الطفل ومقياسه
  let view = 'front', flip = 0, flipTo = null; // الاستدارة
  let reacts = [], parts = [], rings = [], tags = [], tasks = [];
  let qs = [], qi = 0, cur = null, mistakes = 0, wrongNow = 0, over = false, lock = 0;
  let seen = new Set(), worn = {}, shake = 0, idleT = 0, nextBlink = 2, blinkT = -1, look = { x: 0, y: 0, tx: 0, ty: 0 };
  let hintT = 0, sayTok = 0, drag = null;
  const P = {}; // الوضعية الحالية

  function later(s, fn) { tasks.push({ t: s, fn }); }

  /* =====================================================================
     هندسة الطفل (وحدات محلية: الرأس عند y≈14، القدمان عند y≈266)
     ===================================================================== */
  const SK = { base: '#ECB78E', dark: '#C98A60', light: '#FAD8BC', line: '#B27450', blush: 'rgba(255,110,120,' };
  const HAIR = { base: '#3B2418', light: '#6E4630', dark: '#24140C' };
  const outfit = () => girl
    ? { shirt: ['#FF9CC8', '#FF6FAE', '#E2498E'], low: ['#B095FF', '#8B6CF0', '#6A4CD0'], emb: '#FFE66B' }
    : { shirt: ['#7CC4FF', '#3F9BFF', '#2577D9'], low: ['#5F6FB8', '#3E4C94', '#2C3873'], emb: '#FFD23F' };

  function computePose() {
    const z = ['blink', 'happy', 'brow', 'noseW', 'earW', 'hairB', 'headRot', 'headDY', 'faceDX', 'faceDY', 'mo', 'teeth', 'tongue', 'cheek', 'shrug',
      'aL1', 'aL2', 'aR1', 'aR2', 'fingerW', 'giggle', 'squat', 'liftL', 'liftR', 'tiptoe', 'bodyDX', 'shimmy', 'sparkleEyes'];
    for (const k of z) P[k] = 0;
    // تنفّس ورمش
    P.breath = Math.sin(T * 2.3);
    if (blinkT >= 0) { const b = blinkT / .16; P.blink = b < .5 ? b * 2 : 2 - b * 2; }
    for (const r of reacts) {
      const t = r.t, d = r.d, u = clamp(t / d, 0, 1), e = Math.sin(Math.PI * u), hold = Math.min(1, t / .18, (d - t) / .25);
      switch (r.k) {
        case 'nose': P.noseW += Math.sin(t * 34) * e; P.faceDY -= e * 1.5; break;
        case 'eyes': { const ph = t % .5; P.blink = Math.max(P.blink, ph < .16 ? Math.sin(ph / .16 * Math.PI) : 0); P.brow += e; P.sparkleEyes = Math.max(P.sparkleEyes, hold); break; }
        case 'ears': P.earW += Math.sin(t * 20) * e; break;
        case 'hair': P.hairB += Math.sin(t * 15) * e; P.headDY -= Math.abs(Math.sin(t * 15)) * 3 * e; break;
        case 'head': P.headRot += Math.sin(t * 9) * .13 * e; break;
        case 'mouth': P.mo = Math.max(P.mo, hold); P.brow += hold * .6; break;
        case 'teeth': P.teeth = Math.max(P.teeth, hold); P.mo = Math.max(P.mo, hold * .5); break;
        case 'tongue': P.tongue = Math.max(P.tongue, hold); P.mo = Math.max(P.mo, hold * .55); P.happy = Math.max(P.happy, hold); break;
        case 'cheeks': P.cheek = Math.max(P.cheek, hold); break;
        case 'chin': P.faceDY -= hold * 4; P.headRot += Math.sin(t * 6) * .05 * e; P.brow += hold * .5; break;
        case 'neck': P.faceDX += Math.sin(t * 7) * 8 * e; P.headRot += Math.sin(t * 7) * .06 * e; break;
        case 'shoulders': P.shrug += Math.abs(Math.sin(t * 6.5)) * e; P.brow += e * .7; break;
        case 'arms': { const f = Math.abs(Math.sin(t * 6.5)) * e; P.aL1 += f * 1.35; P.aR1 += f * 1.35; break; }
        case 'elbows': P.aL1 += 1.15 * hold; P.aR1 += 1.15 * hold; P.aL2 += 1.95 * hold; P.aR2 += 1.95 * hold; break;
        case 'hands': P.aR1 += 2.15 * hold; P.aR2 += (.25 + Math.sin(t * 13) * .5) * hold; break;
        case 'fingers': P.fingerW = Math.max(P.fingerW, hold); P.aL1 += .55 * hold; P.aR1 += .55 * hold; P.aL2 += .5 * hold; P.aR2 += .5 * hold; break;
        case 'tummy': P.giggle = Math.max(P.giggle, hold); P.happy = Math.max(P.happy, hold); P.mo = Math.max(P.mo, hold * .7); P.bodyDX += Math.sin(t * 38) * 1.8 * hold; break;
        case 'knees': P.squat += Math.abs(Math.sin(t * 5.2)) * e; break;
        case 'legs': P.liftL += Math.max(0, Math.sin(t * 6)) * e; P.liftR += Math.max(0, -Math.sin(t * 6)) * e; break;
        case 'feet': { const ph = (t % .55) / .55; P.liftR += ph < .55 ? Math.sin(ph / .55 * Math.PI / 2) * .8 : Math.max(0, 1 - (ph - .55) * 12) * .8; break; }
        case 'toes': P.tiptoe = Math.max(P.tiptoe, hold); P.aL1 += .3 * hold; P.aR1 += .3 * hold; break;
        case 'back': P.shimmy += Math.sin(t * 13) * e; break;
        case 'happy': P.happy = Math.max(P.happy, hold); P.mo = Math.max(P.mo, hold * .45); break;
        case 'no': P.faceDX += Math.sin(t * 16) * 5 * e; P.brow -= e * .6; break;
        case 'aah': P.mo = Math.max(P.mo, hold * .85); P.teeth = Math.max(P.teeth, hold * .35); break;
      }
    }
    // عند سؤال الأسنان/اللسان يفتح الطفل فمه «آآآ»
    if (cur && cur.open && !over) { P.mo = Math.max(P.mo, .85); P.teeth = Math.max(P.teeth, .35); }
  }

  /* نقاط الذراع والساق وفق الوضعية */
  function geo() {
    const g = {};
    const sq = P.squat * 9, tip = P.tiptoe * 7, br = P.breath;
    g.bodyY = sq - tip;                    // إزاحة الجذع والرأس
    g.bodyX = P.bodyDX + P.shimmy * 3;
    g.headX = g.bodyX + P.faceDX * .35;
    g.headY = g.bodyY + P.headDY + br * 1.1 + P.shrug * 5;
    g.head = { x: g.headX, y: 64 + g.headY, r: 50 };
    g.sh = P.shrug * 8;
    for (const s of [-1, 1]) {
      const L = s < 0 ? 'L' : 'R';
      const S = { x: g.bodyX + s * 35, y: 133 + g.bodyY - g.sh + br * .6 };
      const A = .3 + P['a' + L + '1'], B = A + .14 + P['a' + L + '2'];
      const E = { x: S.x + s * Math.sin(A) * 29, y: S.y + Math.cos(A) * 29 };
      const Wr = { x: E.x + s * Math.sin(B) * 26, y: E.y + Math.cos(B) * 26 };
      const Hc = { x: Wr.x + s * Math.sin(B) * 8, y: Wr.y + Math.cos(B) * 8, a: B };
      g['S' + L] = S; g['E' + L] = E; g['W' + L] = Wr; g['H' + L] = Hc;
      // الساق
      const lift = P['lift' + L];
      const hip = { x: g.bodyX * .5 + s * 14, y: 198 + g.bodyY };
      const la = s * (lift * .55 + P.squat * .18);
      const kn = { x: hip.x + Math.sin(la) * 27 + s * P.squat * 6, y: hip.y + Math.cos(la) * 27 - lift * 6 };
      const an = { x: s * 18 + Math.sin(la) * 6, y: 250 - tip - lift * 22 };
      g['hip' + L] = hip; g['kn' + L] = kn; g['an' + L] = an;
      g['ft' + L] = { x: an.x + s * 4, y: an.y + 8 };
    }
    return g;
  }
  let G = null;

  /* ---------- رسم ---------- */
  function limb(c, pts, w, col, dark, light) {
    c.lineCap = 'round'; c.lineJoin = 'round';
    const path = () => { c.beginPath(); c.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i].x, pts[i].y); };
    path(); c.strokeStyle = dark; c.lineWidth = w + 3; c.stroke();
    path(); c.strokeStyle = col; c.lineWidth = w; c.stroke();
    c.save(); c.translate(-w * .18, -w * .1); path(); c.strokeStyle = light; c.lineWidth = w * .3; c.globalAlpha = .7; c.stroke(); c.restore();
  }
  function blob(c, x, y, rx, ry, cols, rot = 0) {
    const g = c.createRadialGradient(x - rx * .35, y - ry * .45, Math.min(rx, ry) * .1, x, y, Math.max(rx, ry) * 1.1);
    g.addColorStop(0, cols[0]); g.addColorStop(.6, cols[1]); g.addColorStop(1, cols[2]);
    c.fillStyle = g; c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, TAU); c.fill();
  }
  function drawHand(c, H, s, glove) {
    const a = H.a, dir = { x: s * Math.sin(a), y: Math.cos(a) };
    const col = glove ? ['#FFB3C7', '#FF6F91', '#D9456B'] : [SK.light, SK.base, SK.dark];
    // الأصابع
    c.lineCap = 'round';
    for (let i = 0; i < 4; i++) {
      const sp = (i - 1.5) * .3 + (P.fingerW ? Math.sin(T * 22 + i * 1.7) * .22 * P.fingerW : 0);
      const fa = Math.atan2(dir.y, dir.x) + sp * s;
      const len = i === 0 || i === 3 ? 11 : 13.5;
      const bx = H.x + dir.x * 4, by = H.y + dir.y * 4;
      c.strokeStyle = glove ? col[2] : SK.line; c.lineWidth = 7.4;
      c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + Math.cos(fa) * len, by + Math.sin(fa) * len); c.stroke();
      c.strokeStyle = col[1]; c.lineWidth = 5.4; c.stroke();
    }
    // الإبهام (نحو الجسم)
    const ta = Math.atan2(dir.y, dir.x) - s * 1.1;
    c.strokeStyle = glove ? col[2] : SK.line; c.lineWidth = 7.4; c.beginPath(); c.moveTo(H.x, H.y); c.lineTo(H.x + Math.cos(ta) * 10, H.y + Math.sin(ta) * 10); c.stroke();
    c.strokeStyle = col[1]; c.lineWidth = 5.4; c.stroke();
    c.fillStyle = glove ? col[2] : SK.line; c.beginPath(); c.arc(H.x, H.y, 10.2, 0, TAU); c.fill();
    blob(c, H.x, H.y, 8.6, 8.6, col);
  }
  function drawArm(c, s, front) {
    const L = s < 0 ? 'L' : 'R', S = G['S' + L], E = G['E' + L], Wr = G['W' + L], H = G['H' + L];
    const o = outfit();
    limb(c, [E, Wr], 14, SK.base, SK.line, SK.light);
    // الكم القصير
    const mid = { x: lerp(S.x, E.x, .62), y: lerp(S.y, E.y, .62) };
    limb(c, [S, mid], 19, o.shirt[1], o.shirt[2], o.shirt[0]);
    limb(c, [mid, E], 14.5, SK.base, SK.line, SK.light);
    if (worn.wrist && s < 0 && front) drawEmoji(worn.wrist, Wr.x, Wr.y, 15, H.a * -s * .3);
    drawHand(c, H, s, !!worn.hands);
    if (worn.finger && s > 0 && front) drawEmoji('💍', H.x + s * Math.sin(H.a) * 9, H.y + Math.cos(H.a) * 9, 11);
  }
  function drawLeg(c, s, front) {
    const L = s < 0 ? 'L' : 'R', hip = G['hip' + L], kn = G['kn' + L], an = G['an' + L], ft = G['ft' + L];
    limb(c, [hip, kn, an], 17, SK.base, SK.line, SK.light);
    // الركبة
    c.fillStyle = 'rgba(255,255,255,.28)'; c.beginPath(); c.ellipse(kn.x - 2, kn.y - 1, 4.5, 3, 0, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(178,116,80,.45)'; c.lineWidth = 1.4; c.beginPath(); c.arc(kn.x, kn.y + 1, 5, .3, Math.PI - .3); c.stroke();
    // القدم
    const fx = ft.x, fy = ft.y, tip = P.tiptoe;
    const socks = worn.feet === '🧦', shoes = worn.feet === '👟';
    const col = socks ? ['#FFFFFF', '#FFE07A', '#E9B940'] : [SK.light, SK.base, SK.dark];
    c.fillStyle = socks ? '#D9A520' : SK.line; c.beginPath(); c.ellipse(fx, fy, 16.5, 10.5 - tip * 3, s * .12, 0, TAU); c.fill();
    blob(c, fx, fy - .5, 15, 9.2 - tip * 3, col, s * .12);
    if (front && !socks && !shoes) {
      for (let i = 0; i < 5; i++) {
        const tx = fx - s * 9 + s * i * 4.6 - s * 1, ty = fy + 5.5 - tip * 2 - Math.abs(i - 1) * .4;
        const r = i === 0 ? 3.3 : 2.5 - i * .1;
        c.fillStyle = SK.line; c.beginPath(); c.arc(tx, ty, r + .9, 0, TAU); c.fill();
        blob(c, tx, ty, r, r, [SK.light, SK.base, SK.dark]);
      }
    }
    if (shoes) drawEmoji('👟', fx + s * 2, fy - 3, 36, 0, s < 0);
  }
  function drawTorso(c, front) {
    const o = outfit(), y0 = 118 + G.bodyY - G.sh * .5, y1 = 202 + G.bodyY, x = G.bodyX;
    const br = P.breath * 1.3;
    c.save(); c.translate(x, 0);
    // الجذع
    const g = c.createLinearGradient(-36, 0, 36, 0); g.addColorStop(0, o.shirt[2]); g.addColorStop(.35, o.shirt[0]); g.addColorStop(.6, o.shirt[1]); g.addColorStop(1, o.shirt[2]);
    const pth = () => { c.beginPath(); c.moveTo(-14, y0 - 2); c.quadraticCurveTo(-37 - br * .3, y0 + 2, -38 - br * .4, y0 + 22); c.quadraticCurveTo(-36 - br, y1 - 30, -33, y1 - 4);
      c.quadraticCurveTo(0, y1 + 4, 33, y1 - 4); c.quadraticCurveTo(36 + br, y1 - 30, 38 + br * .4, y0 + 22); c.quadraticCurveTo(37 + br * .3, y0 + 2, 14, y0 - 2); c.closePath(); };
    c.fillStyle = o.shirt[2]; c.save(); c.translate(0, 2); pth(); c.fill(); c.restore();
    pth(); c.fillStyle = g; c.fill();
    c.save(); pth(); c.clip();
    c.fillStyle = 'rgba(255,255,255,.22)'; c.beginPath(); c.ellipse(-14, y0 + 26, 12, 26, -.2, 0, TAU); c.fill();
    if (P.giggle) { c.fillStyle = `rgba(255,255,255,${.15 * P.giggle})`; c.beginPath(); c.ellipse(0, y0 + 52, 26 + Math.sin(T * 40) * 2, 20, 0, 0, TAU); c.fill(); }
    c.restore();
    if (front) {
      // ياقة ونجمة/قلب
      c.fillStyle = '#fff'; c.beginPath(); c.moveTo(-15, y0 - 1); c.quadraticCurveTo(-8, y0 + 12, 0, y0 + 9); c.quadraticCurveTo(8, y0 + 12, 15, y0 - 1); c.quadraticCurveTo(0, y0 + 4, -15, y0 - 1); c.fill();
      c.save(); c.translate(0, y0 + 34 + br * .5);
      c.fillStyle = 'rgba(0,0,0,.12)'; c.translate(0, 1.5); shapeEmb(c, girl); c.fill(); c.translate(0, -1.5);
      const eg = c.createLinearGradient(0, -10, 0, 10); eg.addColorStop(0, '#FFF6B0'); eg.addColorStop(1, o.emb);
      c.fillStyle = eg; shapeEmb(c, girl); c.fill();
      c.restore();
    } else {
      c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, y0 + 10); c.lineTo(0, y1 - 8); c.stroke();
    }
    // التنورة / الشورت
    const lg = c.createLinearGradient(0, y1 - 14, 0, y1 + 18); lg.addColorStop(0, o.low[0]); lg.addColorStop(.5, o.low[1]); lg.addColorStop(1, o.low[2]);
    c.fillStyle = lg;
    if (girl) {
      c.beginPath(); c.moveTo(-33, y1 - 12); c.lineTo(33, y1 - 12); c.quadraticCurveTo(44, y1 + 6, 47, y1 + 18);
      for (let i = 0; i <= 6; i++) { const xx = 47 - i * 94 / 6; c.quadraticCurveTo(xx + 7.8, y1 + 23, xx, y1 + 18); }
      c.quadraticCurveTo(-44, y1 + 6, -33, y1 - 12); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 2; for (const xx of [-20, 0, 20]) { c.beginPath(); c.moveTo(xx * .7, y1 - 8); c.lineTo(xx, y1 + 16); c.stroke(); }
    } else {
      c.beginPath(); c.moveTo(-33, y1 - 12); c.lineTo(33, y1 - 12); c.lineTo(35, y1 + 14); c.quadraticCurveTo(20, y1 + 18, 4, y1 + 14); c.lineTo(0, y1 + 4); c.lineTo(-4, y1 + 14); c.quadraticCurveTo(-20, y1 + 18, -35, y1 + 14); c.closePath(); c.fill();
      c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(-33, y1 - 12, 66, 4);
    }
    c.restore();
  }
  function shapeEmb(c, heart) {
    c.beginPath();
    if (heart) { const s = 10; c.moveTo(0, s * .8); c.bezierCurveTo(-s * 1.4, -s * .2, -s * .6, -s * 1.2, 0, -s * .45); c.bezierCurveTo(s * .6, -s * 1.2, s * 1.4, -s * .2, 0, s * .8); }
    else for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 5 : 11; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
    c.closePath();
  }
  function drawNeck(c) {
    const x = G.headX * .6 + G.bodyX * .4, y = 104 + G.headY;
    c.fillStyle = SK.line; c.beginPath(); c.roundRect(x - 11, y, 22, 24 + G.bodyY - G.headY, 8); c.fill();
    const g = c.createLinearGradient(x - 10, 0, x + 10, 0); g.addColorStop(0, SK.dark); g.addColorStop(.4, SK.base); g.addColorStop(1, SK.dark);
    c.fillStyle = g; c.beginPath(); c.roundRect(x - 9.5, y, 19, 23 + G.bodyY - G.headY, 7); c.fill();
    c.fillStyle = 'rgba(120,60,30,.25)'; c.beginPath(); c.ellipse(x, y + 4, 10, 4, 0, 0, Math.PI); c.fill();
    if (worn.neck) {
      const yy = 120 + G.bodyY - G.sh * .5;
      const sg = c.createLinearGradient(0, yy - 8, 0, yy + 8); sg.addColorStop(0, '#FF8080'); sg.addColorStop(1, '#D93A3A');
      c.fillStyle = sg; c.beginPath(); c.roundRect(G.bodyX - 25, yy - 8, 50, 15, 8); c.fill();
      c.fillStyle = 'rgba(255,255,255,.35)'; for (let i = -18; i < 22; i += 10) c.fillRect(G.bodyX + i, yy - 7, 4, 13);
      c.fillStyle = '#E04848'; c.beginPath(); c.roundRect(G.bodyX + 9, yy, 12, 34, 5); c.fill();
      c.fillStyle = '#fff'; for (let i = 0; i < 3; i++) c.fillRect(G.bodyX + 10 + i * 4, yy + 30, 2, 6);
    }
  }
  function drawEar(c, s) {
    const h = G.head, x = h.x + s * 49, y = h.y + 6;
    c.save(); c.translate(x, y); c.rotate(s * (.15 + P.earW * .35)); c.scale(1 + Math.abs(P.earW) * .15, 1 + Math.abs(P.earW) * .15);
    c.fillStyle = SK.line; c.beginPath(); c.ellipse(0, 0, 11, 13.5, 0, 0, TAU); c.fill();
    blob(c, 0, 0, 9.8, 12.3, [SK.light, SK.base, SK.dark]);
    c.fillStyle = 'rgba(210,120,100,.55)'; c.beginPath(); c.ellipse(s * -1, 1, 5, 7.5, 0, 0, TAU); c.fill();
    c.restore();
  }
  function hairTopPath(c, h) {
    c.beginPath();
    c.arc(h.x, h.y, h.r + 3.5, Math.PI * .97, Math.PI * 2.03);
    // الغرّة
    const y = h.y - 14, x = h.x;
    if (girl) {
      c.quadraticCurveTo(x + 46, y + 8, x + 40, y + 14);
      c.quadraticCurveTo(x + 22, y - 4, x + 6, y + 10);
      c.quadraticCurveTo(x - 10, y - 2, x - 26, y + 12);
      c.quadraticCurveTo(x - 40, y + 2, x - 48, y + 20);
    } else {
      c.quadraticCurveTo(x + 50, y + 4, x + 42, y + 8);
      for (let i = 0; i < 5; i++) { const a = x + 42 - (i + 1) * 17; c.quadraticCurveTo(a + 8.5, y + 2 + (i % 2) * 3, a, y + 10 - (i % 2) * 2); }
    }
    c.closePath();
  }
  function drawHead(c, front) {
    const h = G.head, o = outfit();
    c.save(); c.translate(h.x, h.y + 40); c.rotate(P.headRot + P.shimmy * .04); c.translate(-h.x, -(h.y + 40));
    // شعر خلفي للبنت + ضفيرتان
    if (girl) {
      const sw = P.hairB * .4 + Math.sin(T * 2) * .04;
      for (const s of [-1, 1]) {
        c.save(); c.translate(h.x + s * 44, h.y - 26); c.rotate(-s * (.62 + sw));
        blob(c, 0, 30, 14, 24, [HAIR.light, HAIR.base, HAIR.dark]);
        blob(c, 0, 55, 11, 13, [HAIR.light, HAIR.base, HAIR.dark]);
        c.fillStyle = 'rgba(255,255,255,.2)'; c.beginPath(); c.ellipse(-4, 24, 3, 12, 0, 0, TAU); c.fill();
        // فيونكة
        c.fillStyle = '#FF4F9A';
        c.beginPath(); c.moveTo(0, 6); c.lineTo(-12, -4); c.lineTo(-12, 14); c.closePath(); c.moveTo(0, 6); c.lineTo(12, -4); c.lineTo(12, 14); c.closePath(); c.fill();
        blob(c, 0, 6, 5, 5, ['#FFB3D4', '#FF4F9A', '#D92F7A']);
        c.restore();
      }
    }
    if (front) { drawEar(c, -1); drawEar(c, 1); }
    // الرأس
    c.fillStyle = SK.line; c.beginPath(); c.arc(h.x, h.y, h.r + 1.8, 0, TAU); c.fill();
    const g = c.createRadialGradient(h.x - 16, h.y - 18, 6, h.x, h.y, h.r * 1.08);
    g.addColorStop(0, '#FFE4CC'); g.addColorStop(.55, SK.base); g.addColorStop(1, SK.dark);
    c.fillStyle = g; c.beginPath(); c.arc(h.x, h.y, h.r, 0, TAU); c.fill();
    if (front) drawFace(c, h);
    // الشعر
    if (front) {
      c.fillStyle = HAIR.dark; c.save(); c.translate(0, 2); hairTopPath(c, h); c.fill(); c.restore();
      const hg = c.createLinearGradient(0, h.y - h.r, 0, h.y); hg.addColorStop(0, HAIR.light); hg.addColorStop(1, HAIR.base);
      c.fillStyle = hg; hairTopPath(c, h); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.arc(h.x, h.y, h.r - 6, Math.PI * 1.18, Math.PI * 1.42); c.stroke();
    } else {
      const hg = c.createRadialGradient(h.x - 14, h.y - 22, 4, h.x, h.y, h.r * 1.1);
      hg.addColorStop(0, HAIR.light); hg.addColorStop(.6, HAIR.base); hg.addColorStop(1, HAIR.dark);
      c.fillStyle = hg; c.beginPath(); c.arc(h.x, h.y - 1, h.r + 3.5, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 3; c.lineCap = 'round';
      for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(h.x + i * 8, h.y - 44); c.quadraticCurveTo(h.x + i * 14, h.y - 10, h.x + i * 16, h.y + 36); c.stroke(); }
      drawEar(c, -1); drawEar(c, 1);
    }
    // تاج الشعر المرتد (خصلة)
    const tb = P.hairB * 6;
    c.save(); c.translate(h.x + 6, h.y - h.r - 1); c.rotate(.3 + P.hairB * .4);
    c.fillStyle = HAIR.base; c.beginPath(); c.moveTo(-5, 4); c.quadraticCurveTo(-8 - tb * .3, -14 - tb, 8, -16 - tb); c.quadraticCurveTo(-1, -6, 5, 4); c.fill();
    c.restore();
    // الإكسسوارات على الرأس
    if (worn.ears) { // سماعات
      c.strokeStyle = '#4A4A6A'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.arc(h.x, h.y + 4, h.r + 5, Math.PI * 1.06, Math.PI * 1.94); c.stroke();
      for (const s of [-1, 1]) { blob(c, h.x + s * 52, h.y + 6, 10, 15, ['#9FA8FF', '#5B66E0', '#3A43A8']); c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(h.x + s * 50, h.y, 3, 6, 0, 0, TAU); c.fill(); }
    }
    if (front && worn.eyes) drawEmoji('👓', h.x + P.faceDX, h.y + P.faceDY + 2, 60);
    if (worn.head) drawEmoji(worn.head, h.x + 2, h.y - h.r + (worn.head === '👑' ? -8 : 0), worn.head === '👑' ? 54 : 78, -.06);
    c.restore();
  }
  function drawFace(c, h) {
    const fx = h.x + P.faceDX, fy = h.y + P.faceDY;
    // الخدّان
    const ck = .35 + P.cheek * .45 + P.happy * .15;
    for (const s of [-1, 1]) {
      const r = 9 + P.cheek * 5;
      const g = c.createRadialGradient(fx + s * 31, fy + 22, 1, fx + s * 31, fy + 22, r);
      g.addColorStop(0, SK.blush + ck + ')'); g.addColorStop(1, SK.blush + '0)');
      c.fillStyle = g; c.beginPath(); c.arc(fx + s * 31, fy + 22, r, 0, TAU); c.fill();
    }
    // الحاجبان
    c.strokeStyle = HAIR.base; c.lineWidth = 3.4; c.lineCap = 'round';
    for (const s of [-1, 1]) { const by = fy - 18 - P.brow * 5; c.beginPath(); c.moveTo(fx + s * 11, by + 1); c.quadraticCurveTo(fx + s * 18, by - 4, fx + s * 26, by + 1); c.stroke(); }
    // العينان
    for (const s of [-1, 1]) drawEye(c, fx + s * 18, fy, s);
    // الأنف
    c.save(); c.translate(fx, fy + 15); c.scale(1 + P.noseW * .25, 1 - P.noseW * .18);
    c.fillStyle = 'rgba(178,100,70,.35)'; c.beginPath(); c.ellipse(0, 1.5, 6.5, 5, 0, 0, TAU); c.fill();
    blob(c, 0, 0, 6, 4.6, ['#FFE2CC', '#F0B48C', '#D69068']);
    c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(-2, -1.5, 1.6, 0, TAU); c.fill();
    c.restore();
    // الفم
    drawMouth(c, fx, fy + 29);
    // الذقن (لمعة خفيفة)
    c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.ellipse(fx, fy + 44, 9, 3.5, 0, 0, TAU); c.fill();
  }
  function drawEye(c, x, y, s) {
    const happy = P.happy;
    if (happy > .5) {
      c.strokeStyle = '#3A2018'; c.lineWidth = 3.6; c.lineCap = 'round';
      c.beginPath(); c.arc(x, y + 4, 8, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
      return;
    }
    const rx = 10.5, ry = 12.5;
    c.save();
    c.fillStyle = 'rgba(120,60,40,.25)'; c.beginPath(); c.ellipse(x, y + 1, rx + 1.5, ry + 1.5, 0, 0, TAU); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill();
    c.clip();
    const lx = x + look.x * 3.2, ly = y + look.y * 3.4 + 1;
    const ig = c.createRadialGradient(lx - 2, ly - 3, 1, lx, ly, 8.5);
    ig.addColorStop(0, '#9A6440'); ig.addColorStop(.6, '#5A3420'); ig.addColorStop(1, '#2A160C');
    c.fillStyle = ig; c.beginPath(); c.arc(lx, ly, 8.2, 0, TAU); c.fill();
    c.fillStyle = '#140A06'; c.beginPath(); c.arc(lx, ly, 4.4, 0, TAU); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(lx - 3, ly - 3.4, 2.8, 0, TAU); c.fill();
    c.beginPath(); c.arc(lx + 2.6, ly + 2.6, 1.3, 0, TAU); c.fill();
    if (P.sparkleEyes) { c.globalAlpha = P.sparkleEyes; IK.sparkle(c, lx + 2, ly - 2, 5 + Math.sin(T * 12) * 1.5, '#fff'); c.globalAlpha = 1; }
    // الجفن (رمش)
    const b = clamp(P.blink, 0, 1);
    if (b > 0) { c.fillStyle = SK.base; c.fillRect(x - rx - 2, y - ry - 2, rx * 2 + 4, (ry * 2 + 4) * b); }
    c.restore();
    c.strokeStyle = '#3A2018'; c.lineWidth = 2.6; c.lineCap = 'round';
    const ly2 = y - ry + (ry * 2) * clamp(P.blink, 0, 1);
    if (b > .85) { c.beginPath(); c.arc(x, y + 2, 9, Math.PI * .15, Math.PI * .85); c.stroke(); }
    else { c.beginPath(); c.ellipse(x, y, rx, ry, 0, Math.PI * 1.12, Math.PI * 1.88); c.stroke();
      c.beginPath(); c.moveTo(x + s * 8.5, ly2 + 3); c.lineTo(x + s * 12.5, ly2 - 1); c.stroke(); }
  }
  /* الفم: يعيد مستطيلات الأسنان واللسان للفحص */
  let mouthBox = null;
  function drawMouth(c, x, y) {
    const mo = clamp(P.mo, 0, 1), te = clamp(P.teeth, 0, 1), tg = clamp(P.tongue, 0, 1);
    if (mo < .08 && te < .08) {
      mouthBox = null;
      c.strokeStyle = '#8A3A2A'; c.lineWidth = 3.2; c.lineCap = 'round';
      c.beginPath(); c.moveTo(x - 9, y - 1); c.quadraticCurveTo(x, y + 8 + P.happy * 3, x + 9, y - 1); c.stroke();
      return;
    }
    const w = 10 + te * 5 + mo * 2, h = 3 + mo * 10 + te * 3;
    const pth = () => { c.beginPath(); c.moveTo(x - w, y - 2); c.quadraticCurveTo(x, y + 1 - te * 2, x + w, y - 2); c.quadraticCurveTo(x + w * .9, y + h * 1.5, x, y + h * 1.6); c.quadraticCurveTo(x - w * .9, y + h * 1.5, x - w, y - 2); c.closePath(); };
    pth(); c.fillStyle = '#7A1E2E'; c.fill();
    c.save(); pth(); c.clip();
    // الأسنان
    const tH = 3.5 + te * 3.5 + mo * 1.5;
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(x - w, y - 4, w * 2, tH + 4, 3); c.fill();
    c.strokeStyle = 'rgba(180,180,200,.6)'; c.lineWidth = 1; for (let i = -2; i <= 2; i++) { if (!i) continue; c.beginPath(); c.moveTo(x + i * w / 3, y - 2); c.lineTo(x + i * w / 3, y + tH - .5); c.stroke(); }
    // اللسان
    const tgY = y + h * 1.25;
    blob(c, x, tgY, w * .62, h * .55 + 2, ['#FFB0B8', '#FF6F86', '#D9455E']);
    c.restore();
    c.strokeStyle = '#8A3A2A'; c.lineWidth = 2.4; pth(); c.stroke();
    if (tg > .05) {
      const L = 6 + tg * 12;
      c.fillStyle = '#E04A66'; c.beginPath(); c.roundRect(x - 8, y + h, 16, L + 1, [0, 0, 9, 9]); c.fill();
      c.fillStyle = '#FF7D95'; c.beginPath(); c.roundRect(x - 7, y + h, 14, L, [0, 0, 8, 8]); c.fill();
      c.strokeStyle = 'rgba(160,30,60,.5)'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x, y + h + 2); c.lineTo(x, y + h + L - 4); c.stroke();
    }
    if (te > .5 && P.teeth > .5) { c.globalAlpha = te; IK.sparkle(c, x + w * .6, y, 5 + Math.sin(T * 14) * 2, '#fff'); c.globalAlpha = 1; }
    mouthBox = { x, y, w, h, tH, tg };
  }
  function drawBackpack(c, front) {
    const x = G.bodyX, y = 150 + G.bodyY;
    if (front) {
      // أحزمة فقط من الأمام + أطراف الحقيبة
      c.fillStyle = '#E8762E'; for (const s of [-1, 1]) { c.beginPath(); c.roundRect(x + s * 22 - 4, 121 + G.bodyY - G.sh, 8, 52, 4); c.fill(); }
      return;
    }
    c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.roundRect(x - 30, y - 26, 60, 66, 16); c.fill();
    const g = c.createLinearGradient(0, y - 30, 0, y + 40); g.addColorStop(0, '#FFB45E'); g.addColorStop(1, '#E8762E');
    c.fillStyle = g; c.beginPath(); c.roundRect(x - 29, y - 30, 58, 66, 16); c.fill();
    c.fillStyle = '#FFCF8A'; c.beginPath(); c.roundRect(x - 20, y + 6, 40, 24, 9); c.fill();
    c.fillStyle = '#C85A1A'; c.fillRect(x - 6, y + 4, 12, 4);
    c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.roundRect(x - 24, y - 26, 10, 40, 5); c.fill();
  }
  function drawKid() {
    const front = view === 'front';
    const sx = Math.abs(Math.cos(flip * Math.PI)) * .92 + .08;
    ctx.save();
    ctx.translate(CX, TOPY);
    ctx.scale(K, K);
    // ظل
    const sh = ctx.createRadialGradient(0, 262, 4, 0, 262, 70);
    sh.addColorStop(0, `rgba(90,30,30,${.32 - P.tiptoe * .08})`); sh.addColorStop(1, 'rgba(90,30,30,0)');
    ctx.save(); ctx.translate(0, 262); ctx.scale(1, .22); ctx.translate(0, -262); ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(0, 262, 70, 0, TAU); ctx.fill(); ctx.restore();
    ctx.scale(sx, 1);
    const c = ctx;
    drawLeg(c, -1, front); drawLeg(c, 1, front);
    if (!front) { drawArm(c, -1, front); drawArm(c, 1, front); }
    drawNeck(c);
    drawTorso(c, front);
    if (worn.back) drawBackpack(c, front);
    if (front) { drawArm(c, -1, front); drawArm(c, 1, front); }
    if (!front) drawNeck(c);
    drawHead(c, front);
    ctx.restore();
  }

  /* ---------- تحديد الجزء الملموس ---------- */
  function toLocal(px, py) { const sx = Math.abs(Math.cos(flip * Math.PI)) * .92 + .08; return { x: (px - CX) / K / sx, y: (py - TOPY) / K }; }
  const dist = (a, b, x, y) => Math.hypot(a - x, b - y);
  function segDist(p, a, b) { const dx = b.x - a.x, dy = b.y - a.y, l = dx * dx + dy * dy || 1; const t = clamp(((p.x - a.x) * dx + (p.y - a.y) * dy) / l, 0, 1); return Math.hypot(p.x - (a.x + dx * t), p.y - (a.y + dy * t)); }
  function hitPart(px, py) {
    if (!G) return null;
    const p = toLocal(px, py), x = p.x, y = p.y, h = G.head, front = view === 'front';
    const fx = h.x + P.faceDX, fy = h.y + P.faceDY;
    const sides = [-1, 1].map(s => s < 0 ? 'L' : 'R');
    // اليدان والأصابع أولًا (قد تكون فوق الوجه أثناء التلويح)
    for (const L of sides) {
      const H = G['H' + L], s = L === 'L' ? -1 : 1, d = { x: s * Math.sin(H.a), y: Math.cos(H.a) };
      if (dist(H.x + d.x * 14, H.y + d.y * 14, x, y) < 10) return 'fingers';
      if (dist(H.x, H.y, x, y) < 13) return 'hands';
    }
    if (front) {
      if (mouthBox) {
        const m = mouthBox, my = m.y + P.faceDY * 0;
        if (Math.abs(x - m.x) < m.w + 3 && y > my - 7 && y < my + m.tH + 2) return 'teeth';
        if (Math.abs(x - m.x) < m.w + 3 && y >= my + m.tH + 2 && y < my + m.h * 1.7 + m.tg * 18 + 3) return 'tongue';
      }
      if (dist(fx, fy + 15, x, y) < 9.5) return 'nose';
      for (const s of [-1, 1]) if (dist(fx + s * 18, fy, x, y) < 13) return 'eyes';
      if (Math.abs(x - fx) < 15 && Math.abs(y - (fy + 30)) < 9) return 'mouth';
      for (const s of [-1, 1]) if (dist(fx + s * 31, fy + 22, x, y) < 11) return 'cheeks';
      if (Math.abs(x - fx) < 17 && y > fy + 38 && y < h.y + h.r + 5) return 'chin';
    }
    for (const s of [-1, 1]) if (dist(h.x + s * 50, h.y + 6, x, y) < 12) return 'ears';
    if (girl) for (const s of [-1, 1]) if (dist(h.x + s * 64, h.y - 6, x, y) < 18) return 'hair';
    const dh = dist(h.x, h.y, x, y);
    if (dh < h.r + 5) {
      if (!front) return y < h.y + 20 ? 'hair' : 'head';
      if (y < h.y - 20) return 'hair';
      return 'head';
    }
    for (const L of sides) {
      if (dist(G['E' + L].x, G['E' + L].y, x, y) < 11) return 'elbows';
      if (dist(G['kn' + L].x, G['kn' + L].y, x, y) < 11) return 'knees';
    }
    for (const L of sides) {
      const ft = G['ft' + L], s = L === 'L' ? -1 : 1;
      if (front && Math.abs(y - (ft.y + 5)) < 6 && Math.abs(x - (ft.x - s * 1)) < 14) return 'toes';
      if (Math.abs(x - ft.x) < 18 && Math.abs(y - ft.y) < 12) return 'feet';
    }
    const nx = G.headX * .6 + G.bodyX * .4;
    if (Math.abs(x - nx) < 12 && y > h.y + h.r - 4 && y < 124 + G.bodyY) return 'neck';
    for (const L of sides) if (dist(G['S' + L].x, G['S' + L].y - 3, x, y) < 13) return 'shoulders';
    for (const L of sides) if (segDist(p, G['S' + L], G['W' + L]) < 11) return 'arms';
    if (Math.abs(x - G.bodyX) < 38 && y > 118 + G.bodyY && y < 214 + G.bodyY) return front ? 'tummy' : 'back';
    for (const L of sides) if (segDist(p, G['hip' + L], G['an' + L]) < 11) return 'legs';
    return null;
  }
  /* مكان جزء على الشاشة (للبطاقة والتلميح) */
  function partPos(id) {
    const h = G.head, fx = h.x + P.faceDX, fy = h.y + P.faceDY;
    const sx = Math.abs(Math.cos(flip * Math.PI)) * .92 + .08;
    const L = { head: [h.x, h.y - 10], hair: [h.x, h.y - 42], eyes: [fx + 18, fy], ears: [h.x + 50, h.y + 6], nose: [fx, fy + 15], mouth: [fx, fy + 30], teeth: [fx, fy + 31], tongue: [fx, fy + 40],
      cheeks: [fx + 31, fy + 22], chin: [fx, fy + 44], neck: [G.bodyX, 114 + G.bodyY], shoulders: [G.SR.x, G.SR.y - 4], arms: [lerp(G.SR.x, G.ER.x, .5), lerp(G.SR.y, G.ER.y, .5)],
      elbows: [G.ER.x, G.ER.y], hands: [G.HR.x, G.HR.y], fingers: [G.HR.x + Math.sin(G.HR.a) * 12, G.HR.y + Math.cos(G.HR.a) * 12], tummy: [G.bodyX, 168 + G.bodyY], back: [G.bodyX, 160 + G.bodyY],
      knees: [G.knR.x, G.knR.y], legs: [lerp(G.knR.x, G.anR.x, .5), lerp(G.knR.y, G.anR.y, .5)], feet: [G.ftR.x, G.ftR.y], toes: [G.ftR.x, G.ftR.y + 5] }[id] || [0, 130];
    return { x: CX + L[0] * K * sx, y: TOPY + L[1] * K };
  }
  const partVisible = id => view === 'front' ? id !== 'back' : !FRONT_ONLY.includes(id);

  /* ---------- الاستدارة ---------- */
  function turn(to) {
    if (flipTo) return;
    to = to || (view === 'front' ? 'back' : 'front');
    if (to === view) return;
    flipTo = to; flip = 0; Sound.whoosh(); vibrate(10);
    turnBtn.classList.remove('pulse');
  }

  /* ---------- الخلفية: غرفة لعب ---------- */
  function buildBg() {
    const key = W + 'x' + H + '|' + dpr + '|' + Math.round(TOPY) + '|' + Math.round(K * 100);
    if (bgKey === key && bgLayer) return;
    bgKey = key;
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const floorY = TOPY + 236 * K;
    // الجدار
    let g = x.createLinearGradient(0, 0, 0, floorY); g.addColorStop(0, '#FFD9C2'); g.addColorStop(1, '#FFF1E6');
    x.fillStyle = g; x.fillRect(0, 0, W, floorY + 2);
    // نقش ورق الجدران
    for (let yy = 30, r = 0; yy < floorY - 20; yy += 46, r++) for (let xx = (r % 2) * 30; xx < W; xx += 60) {
      x.fillStyle = r % 2 ? 'rgba(255,255,255,.55)' : 'rgba(255,170,140,.22)';
      if (r % 3 === 0) { x.save(); x.translate(xx, yy); IK.sparkle(x, 0, 0, 7, x.fillStyle); x.restore(); }
      else { x.beginPath(); x.arc(xx, yy, 4, 0, TAU); x.fill(); }
    }
    // شريط زخرفي
    const by = floorY - 46;
    g = x.createLinearGradient(0, by, 0, by + 16); g.addColorStop(0, '#FFC4A8'); g.addColorStop(1, '#FFA987');
    x.fillStyle = g; x.fillRect(0, by, W, 16); x.fillStyle = 'rgba(255,255,255,.5)'; x.fillRect(0, by, W, 3);
    x.fillStyle = '#fff'; x.fillRect(0, by + 16, W, floorY - by - 16);
    x.fillStyle = 'rgba(230,170,150,.4)'; x.fillRect(0, floorY - 6, W, 6);
    // النافذة
    const u = Math.min(W, H) / 10;
    const narrow = portrait && W < 600;
    const wx = narrow ? W * .04 : W * .12, wy = Math.max(TOPY + 10, H * .17), ww = narrow ? u * 1.9 : u * 2.6, wh = narrow ? u * 2.4 : u * 2.8;
    x.save(); x.shadowColor = 'rgba(150,70,50,.25)'; x.shadowBlur = 14; x.shadowOffsetY = 6;
    x.fillStyle = '#fff'; x.beginPath(); x.roundRect(wx - 8, wy - 8, ww + 16, wh + 16, 18); x.fill(); x.restore();
    g = x.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#7CCBFF'); g.addColorStop(1, '#D6F0FF');
    x.fillStyle = g; x.beginPath(); x.roundRect(wx, wy, ww, wh, 12); x.fill();
    x.save(); x.beginPath(); x.roundRect(wx, wy, ww, wh, 12); x.clip();
    IK.cloud(x, wx + ww * .1, wy + wh * .35, ww * .55);
    IK.cloud(x, wx + ww * .5, wy + wh * .7, ww * .45);
    x.fillStyle = '#FFD84A'; x.beginPath(); x.arc(wx + ww * .82, wy + wh * .2, ww * .1, 0, TAU); x.fill();
    g = x.createLinearGradient(0, wy + wh * .8, 0, wy + wh); g.addColorStop(0, '#9EE07A'); g.addColorStop(1, '#5DBB3A'); x.fillStyle = g;
    x.beginPath(); x.ellipse(wx + ww * .3, wy + wh * 1.02, ww * .6, wh * .18, 0, 0, TAU); x.fill();
    x.restore();
    x.fillStyle = '#fff'; x.fillRect(wx + ww / 2 - 3, wy, 6, wh); x.fillRect(wx, wy + wh / 2 - 3, ww, 6);
    // ستارة صغيرة
    for (const s of [0, 1]) {
      const cx0 = s ? wx + ww + 4 : wx - 4;
      g = x.createLinearGradient(cx0 - 12, 0, cx0 + 12, 0); g.addColorStop(0, '#FF9CC8'); g.addColorStop(.5, '#FFC2DD'); g.addColorStop(1, '#FF8ABD');
      x.fillStyle = g; x.beginPath(); x.moveTo(cx0 - 12, wy - 12); x.lineTo(cx0 + 12, wy - 12); x.quadraticCurveTo(cx0 + (s ? -4 : 4), wy + wh * .5, cx0 + 10, wy + wh + 4); x.lineTo(cx0 - 10, wy + wh + 4); x.quadraticCurveTo(cx0 + (s ? 4 : -4), wy + wh * .5, cx0 - 12, wy - 12); x.fill();
    }
    x.fillStyle = '#C98A60'; x.beginPath(); x.roundRect(wx - 24, wy - 18, ww + 48, 8, 4); x.fill();
    // مقياس الطول (زرافة)
    const rx = narrow ? W - u * 1.3 : W * .82, ry = TOPY + 30 * K, rh = floorY - ry - 4, rw = narrow ? u * .7 : u * .9;
    x.save(); x.shadowColor = 'rgba(150,70,50,.22)'; x.shadowBlur = 10; x.shadowOffsetY = 4;
    const cols = ['#FF6B6B', '#FFB03A', '#FFE14D', '#7ED957', '#4FC3F7', '#A77BFF'];
    for (let i = 0; i < 6; i++) { x.fillStyle = cols[i]; x.beginPath(); x.roundRect(rx, ry + rh * i / 6, rw, rh / 6 + 1, i === 0 ? [10, 10, 0, 0] : i === 5 ? [0, 0, 10, 10] : 0); x.fill(); }
    x.restore();
    x.fillStyle = 'rgba(255,255,255,.85)';
    for (let i = 1; i < 18; i++) { const yy = ry + rh * i / 18; x.fillRect(rx, yy - 1, i % 3 ? rw * .3 : rw * .55, 2); }
    x.fillStyle = 'rgba(255,255,255,.3)'; x.fillRect(rx + rw * .65, ry + 6, rw * .14, rh - 12);
    x.font = `${rw * 1.1}px ${EMOJI_FONT}`; x.textAlign = 'center'; x.textBaseline = 'bottom'; x.fillText('🦒', rx + rw / 2, ry + 4);
    // الأرضية الخشبية بمنظور
    g = x.createLinearGradient(0, floorY, 0, H); g.addColorStop(0, '#F2C48E'); g.addColorStop(1, '#DDA066');
    x.fillStyle = g; x.fillRect(0, floorY, W, H - floorY);
    x.save(); x.beginPath(); x.rect(0, floorY, W, H - floorY); x.clip();
    const vx = W / 2, vy = floorY - H * .9;
    x.strokeStyle = 'rgba(160,90,40,.22)'; x.lineWidth = 2;
    for (let i = -16; i <= 16; i++) { const bx = W / 2 + i * W * .08; const t1 = (floorY - vy) / (H - vy); x.beginPath(); x.moveTo(lerp(vx, bx, t1), floorY); x.lineTo(bx, H); x.stroke(); }
    g = x.createLinearGradient(0, floorY, 0, floorY + 24); g.addColorStop(0, 'rgba(120,60,20,.25)'); g.addColorStop(1, 'rgba(120,60,20,0)'); x.fillStyle = g; x.fillRect(0, floorY, W, 24);
    x.restore();
    // سجادة دائرية تحت الطفل
    const ry2 = TOPY + 262 * K, rr = Math.min(W * .46, 150 * K);
    x.save(); x.translate(CX, ry2); x.scale(1, .26);
    x.fillStyle = 'rgba(120,50,30,.18)'; x.beginPath(); x.arc(0, 14, rr * 1.02, 0, TAU); x.fill();
    const rc = ['#FF8FB1', '#FFD36B', '#8FD8FF', '#B9A2FF'];
    for (let i = 0; i < 4; i++) { x.fillStyle = rc[i]; x.beginPath(); x.arc(0, 0, rr * (1 - i * .22), 0, TAU); x.fill(); }
    x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 6; x.setLineDash([14, 12]);
    x.beginPath(); x.arc(0, 0, rr * .9, 0, TAU); x.stroke();
    x.restore();
    // ألعاب على الأرض
    const toyY = Math.min(H - 20, ry2 + 12);
    x.font = `${u * .75}px ${EMOJI_FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle';
    if (!narrow) { x.fillText('🧸', W * .14, toyY - u * .2); x.fillText('🪀', W * .88, toyY); x.fillText('🚂', W * .25, toyY + u * .3); }
  }

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    portrait = W / H < 1.05;
    const top = pbar.getBoundingClientRect().bottom + (portrait ? 14 : 8);
    const bot = askEl.getBoundingClientRect().top - (portrait ? 18 : 12);
    const avH = Math.max(120, bot - top), avW = W - 30;
    K = Math.min(avH / 272, avW / 175, 3.2);
    CX = W / 2;
    TOPY = top + (avH - 272 * K) * .5;
    turnBtn.style.top = Math.round(Math.max(top, bot - 70)) + 'px';
    buildBg();
  }

  /* ---------- المستوى والأسئلة ---------- */
  function setProg() {
    const n = def.m === 'learn' ? def.parts.length : qs.length;
    const k = def.m === 'learn' ? def.parts.filter(p => seen.has(p)).length : qi;
    pbar.innerHTML = Array.from({ length: n }, (_, i) => `<i class="${i < k ? 'on' : i === k && def.m !== 'learn' && !over ? 'cur' : ''}"></i>`).join('');
  }
  function mkQ(type, id) {
    if (type === 'find') { const p = PARTS[id]; return { type, id, ok: ACCEPT[id] || [id], icon: p.e, open: id === 'teeth' || id === 'tongue', part: id }; }
    if (type === 'sense') { const s = SENSES[id]; return { type, id, ok: s.ok, icon: s.cue, open: !!s.open, part: s.ok[0] }; }
    const it = ITEMS[id]; return { type: 'dress', id, ok: it.ok, icon: it.e(), part: it.ok[0], slot: it.slot };
  }
  function buildQuestions() {
    const m = def.m;
    if (m === 'learn') return [];
    if (m === 'find') {
      let pool = shuffle(def.parts.slice());
      if (def.back && !pool.slice(0, def.q).includes('back')) pool = ['back', ...pool.filter(p => p !== 'back')].slice(0, def.q).sort(() => Math.random() - .5);
      return pool.slice(0, def.q).map(id => mkQ('find', id));
    }
    if (m === 'senses') return shuffle(def.set.slice()).slice(0, def.q).map(id => mkQ('sense', id));
    if (m === 'dress') return dressSet(def.set, def.q);
    // تحدٍّ مختلط
    const f = shuffle(ALL_PARTS.slice()).slice(0, 3).map(id => mkQ('find', id));
    const s = shuffle(Object.keys(SENSES)).slice(0, 3).map(id => mkQ('sense', id));
    const d = dressSet(Object.keys(ITEMS), 3);
    return shuffle([...f, ...s, ...d]);
  }
  function dressSet(set, q) {
    const out = [], used = new Set();
    for (const id of shuffle(set.slice())) { const sl = ITEMS[id].slot; if (used.has(sl)) continue; used.add(sl); out.push(mkQ('dress', id)); if (out.length >= q) break; }
    return out;
  }
  function startLevel(n) {
    lvl = clamp(n, 1, LEVELS.length); def = LEVELS[lvl - 1];
    over = false; mistakes = 0; wrongNow = 0; qi = 0; cur = null; lock = 0; hintT = 0; idleT = 0;
    worn = {}; seen = new Set(); reacts = []; tags = []; tasks = []; parts = [];
    if (view !== 'front') { view = 'front'; flip = 0; flipTo = null; }
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    qs = buildQuestions();
    setProg();
    turnBtn.classList.remove('pulse');
    react('happy', 1.2);
    if (def.m === 'learn') { showLearn(); later(.5, () => say(App.g('المسي', 'المس') + ' أي جزء', 'Touch any part')); }
    else later(.45, ask);
  }
  function showLearn(last) {
    itemEl.classList.remove('on');
    const n = def.parts.filter(p => seen.has(p)).length;
    aiEl.textContent = last ? last.e : '👆';
    atEl.className = 'at' + (lang === 'en' ? ' en' : '');
    if (last) atEl.innerHTML = `${App.esc(lang === 'ar' ? (last.arn || last.ar) : cap(last.en))}<small>${num(n)} ${lang === 'ar' ? 'من' : 'of'} ${num(def.parts.length)}</small>`;
    else atEl.innerHTML = `${lang === 'ar' ? App.g('المسي', 'المس') + ' أي جزء' : 'Touch any part'}<small>${lang === 'ar' ? App.g('لتسمعي', 'لتسمع') + ' اسمه' : 'to hear its name'} (${num(n)} ${lang === 'ar' ? 'من' : 'of'} ${num(def.parts.length)})</small>`;
  }
  function qText(q) {
    if (!q) return ['', ''];
    if (q.type === 'find') { const p = PARTS[q.id]; return [App.g('المسي', 'المس') + ' ' + p.ar, 'Touch the ' + p.en]; }
    if (q.type === 'sense') { const s = SENSES[q.id]; return [s.ar, s.en]; }
    const it = ITEMS[q.id], v = VERB[it.v]; return [v[0] + ' ' + it.ar + '؟', v[1] + ' ' + it.en + '?'];
  }
  function showQ() {
    const q = cur; if (!q) return;
    const [ar, en] = qText(q);
    aiEl.textContent = q.type === 'dress' ? '' : q.icon;
    aiEl.style.display = q.type === 'dress' ? 'none' : '';
    atEl.className = 'at' + (lang === 'en' ? ' en' : '');
    const sub = q.type === 'find' ? (lang === 'ar' ? '' : '') : q.type === 'sense' ? (lang === 'ar' ? 'الحواس' : 'Senses') : (lang === 'ar' ? App.g('اسحبيها', 'اسحبها') + ' أو ' + App.g('المسي', 'المس') + ' مكانها' : 'Drag it or touch the place');
    atEl.innerHTML = App.esc(lang === 'ar' ? ar : en) + (sub ? `<small>${App.esc(sub)}</small>` : '');
    itemEl.textContent = q.type === 'dress' ? q.icon : '';
    itemEl.classList.toggle('on', q.type === 'dress');
  }
  function sayQ() {
    if (!cur) return;
    const [ar, en] = qText(cur);
    say(ar, en);
    spkBtn.classList.remove('pulse'); void spkBtn.offsetWidth; spkBtn.classList.add('pulse');
  }
  function ask() {
    if (over) return;
    cur = qs[qi]; wrongNow = 0; hintT = 0; idleT = 0; lock = 0;
    if (!cur) return;
    showQ(); setProg(); sayQ();
    if (window.gsap && Fx.on) gsap.fromTo(askEl, { scale: .9 }, { scale: 1, duration: .5, ease: 'elastic.out(1,0.5)', clearProps: 'scale' });
  }

  /* ---------- التفاعل ---------- */
  const DUR = { nose: 1, eyes: 1.1, ears: 1.1, hair: 1.1, head: 1.1, mouth: 1.6, teeth: 1.6, tongue: 1.5, cheeks: 1.2, chin: 1.2, neck: 1.3, shoulders: 1.2, arms: 1.3, elbows: 1.5,
    hands: 1.6, fingers: 1.4, tummy: 1.5, knees: 1.3, legs: 1.2, feet: 1.15, toes: 1.3, back: 1.2, happy: 1, no: .45, aah: 1.4 };
  function react(k, d) {
    reacts = reacts.filter(r => r.k !== k);
    reacts.push({ k, t: 0, d: d || DUR[k] || 1, fired: {} });
    // أصوات التفاعل
    switch (k) {
      case 'nose': Sound.noise(.12, 1800, 4200, .07, 1); Sound.noise(.12, 1800, 4200, .07, 1, .18); break;
      case 'eyes': Sound.tone(1500, .05, 'sine', .08); Sound.tone(1700, .05, 'sine', .08, 0, .5); break;
      case 'ears': Sound.tone(520, .25, 'triangle', .1, 260); break;
      case 'hair': case 'head': Sound.spring(); break;
      case 'mouth': Sound.tone(523, .6, 'triangle', .1, 0); Sound.tone(659, .5, 'sine', .05, 0, .1); break;
      case 'teeth': Sound.tone(2200, .08, 'sine', .08); Sound.tone(2900, .1, 'sine', .07, 0, .07); break;
      case 'tongue': Sound.noise(.45, 120, 260, .22, 3); Sound.tone(85, .4, 'square', .05, 20); break;
      case 'cheeks': Sound.tone(300, .25, 'sine', .14, 300); Sound.pop(); break;
      case 'chin': Sound.tone(700, .2, 'sine', .1, 400); break;
      case 'neck': Sound.tone(440, .12, 'sine', .08, 120); Sound.tone(440, .12, 'sine', .08, -120, .2); break;
      case 'shoulders': Sound.tone(392, .14, 'triangle', .1, 200); Sound.tone(392, .14, 'triangle', .1, 200, .45); break;
      case 'arms': Sound.whoosh(); break;
      case 'elbows': Sound.tone(260, .3, 'triangle', .12, 260); break;
      case 'hands': Sound.whoosh(); break;
      case 'fingers': [0, 1, 2, 3].forEach(i => Sound.tone(900 + i * 140, .05, 'sine', .07, 0, i * .07)); break;
      case 'tummy': for (let i = 0; i < 7; i++) Sound.tone(880 + (i % 2) * 260 + rand(-40, 40), .08, 'sine', .09, 150, i * .11); break;
      case 'knees': Sound.tone(220, .2, 'sine', .14, 220); Sound.tone(220, .2, 'sine', .14, 220, .6); break;
      case 'legs': Sound.whoosh(); break;
      case 'toes': Sound.tone(600, .5, 'sine', .08, 600); break;
      case 'back': Sound.noise(.4, 600, 1400, .06, 1.5); break;
    }
  }
  function burst(x, y, col, n = 14) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU), v = rand(80, 240);
      parts.push({ t: 'star', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .9), age: 0, s: rand(5, 9), c: i % 2 ? '#FFE26B' : col });
    }
    rings.push({ x, y, age: 0, life: .45 });
  }
  function floatText(txt, x, y, col) { parts.push({ t: 'txt', txt, x, y, vx: rand(-20, 20), vy: -70, rot: rand(-.3, .3), vr: 0, life: 1, age: 0, s: 22, c: col }); }
  function addTag(id, ok) {
    const p = PARTS[id], pos = partPos(id);
    tags = tags.filter(t => t.age < t.life - .3);
    tags.push({ id, txt: lang === 'ar' ? (p.arn || p.ar) : cap(p.en), x: pos.x, y: pos.y, age: 0, life: 2.2, ok, e: p.e });
  }
  /* حركات الطفل عند لمس كل جزء (+ مؤثرات) */
  function partReact(id, at) {
    react(id);
    const pos = at || partPos(id);
    if (id === 'tummy') { for (let i = 0; i < 4; i++) later(i * .25, () => floatText(lang === 'ar' ? 'هههه' : 'hehe', pos.x + rand(-30, 30), pos.y - 20, '#FF5C8A')); }
    if (id === 'mouth') floatText('♪', pos.x + 20, pos.y, '#8B5CF6');
    if (id === 'feet') { later(.28, () => { shake = 6; Sound.thud(); vibrate(25); dust(); }); later(.83, () => { shake = 5; Sound.thud(); dust(); }); }
    if (id === 'hands') later(.2, () => floatText('👋', pos.x + 30, pos.y - 20));
    if (id === 'back') floatText('✨', pos.x, pos.y, '#fff');
  }
  function dust() { const f = partPos('feet'); for (let i = 0; i < 8; i++) parts.push({ t: 'dust', x: f.x + rand(-20, 20), y: f.y + 6, vx: rand(-80, 80), vy: rand(-50, -10), rot: 0, vr: 0, life: .6, age: 0, s: rand(5, 9), c: '#fff' }); }

  function onPart(id, px, py) {
    idleT = 0;
    if (def.m === 'learn') {
      partReact(id, { x: px, y: py });
      if (id === 'mouth') react('aah', 2.2);
      addTag(id, true);
      sayPart(PARTS[id]);
      if (def.parts.includes(id) && !seen.has(id)) {
        seen.add(id); Sound.star(); burst(px, py, '#FF8A5C', 10);
        setProg();
        if (def.parts.every(p => seen.has(p))) later(1.4, win);
      }
      const pr = loadProg(); if (!pr.seen.includes(id)) { pr.seen.push(id); store.set('bodyProg', pr); if (pr.seen.length >= ALL_PARTS.length) App.achieve('body_explorer'); }
      showLearn(PARTS[id]);
      return;
    }
    if (!cur || lock > 0 || over) return;
    if (cur.ok.includes(id)) correct(id, px, py);
    else wrong(id, px, py);
  }
  function correct(id, px, py) {
    lock = 99;
    const q = cur;
    if (q.type === 'dress') { worn[q.slot] = q.icon; Sound.pop(); itemEl.classList.remove('on'); }
    partReact(id, { x: px, y: py });
    react('happy', 1.4);
    addTag(q.type === 'find' ? q.id : id, true);
    burst(px, py, '#7ED957', 18);
    Sound.star(); vibrate(15);
    if (q.type === 'find') sayPart(PARTS[q.id]); else sayPart(PARTS[id]);
    qi++; setProg();
    const needTurnBack = view === 'back';
    later(needTurnBack ? 1.1 : 1.3, () => { if (view === 'back') turn('front'); });
    later(needTurnBack ? 1.9 : 1.5, () => { if (qi >= qs.length) win(); else ask(); });
  }
  function wrong(id, px, py) {
    mistakes++; wrongNow++;
    lock = .7;
    Sound.error(); vibrate(30);
    react('no');
    tags = tags.filter(t => t.age < t.life - .3);
    const p = PARTS[id];
    tags.push({ id, txt: lang === 'ar' ? (p.arn || p.ar) : cap(p.en), x: px, y: py, age: 0, life: 1.4, ok: false, e: p.e });
    if (wrongNow === 1) sayPart(p);
    else later(.1, sayQ);
    if (cur.type === 'dress' && window.gsap && Fx.on) gsap.fromTo(itemEl, { x: -8 }, { x: 0, duration: .5, ease: 'elastic.out(1.2,0.3)', clearProps: 'x' });
    if (wrongNow >= 2) hintT = 3;
  }
  function needsTurn() {
    if (!cur) return false;
    const vis = cur.ok.some(partVisible);
    return !vis;
  }

  /* ---------- الفوز والمستويات ---------- */
  function win() {
    if (over) return;
    over = true; cur = null; itemEl.classList.remove('on');
    const pr = loadProg();
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('bodyProg', pr);
    setProg();
    for (let i = 0; i < 120; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 240), rot: rand(0, TAU), vr: rand(-8, 8), life: rand(2.5, 4), age: 0, s: rand(6, 11), c: ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9'][i % 6] });
    Sound.win(); react('tummy', 1.6); react('hands', 1.8);
    later(1.4, () => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنتَ!') + ' 🎉';
      root.querySelector('.wkid').textContent = { learn: '🎓🧒', find: '👆✨', senses: '👃👀👂', dress: '👒👟🧤', mix: '🏆🧒' }[def.m];
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      const msg = { learn: App.g('تعرّفتِ', 'تعرّفتَ') + ' على كل الأجزاء', find: App.g('وجدتِ', 'وجدتَ') + ' كل الأجزاء', senses: App.g('عرفتِ', 'عرفتَ') + ' الحواس', dress: App.g('ألبستِ', 'ألبستَ') + ' الطفل كل شيء', mix: App.g('أنهيتِ', 'أنهيتَ') + ' التحدّي الكبير' }[def.m];
      root.querySelector('.wP').textContent = msg + (mistakes ? '' : ' دون أخطاء! 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < LEVELS.length ? '' : 'none';
      winOv.classList.add('on');
      if (window.Fx && Fx.overlayIn) Fx.overlayIn(winOv);
      sayGood();
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('body_first');
      if (def.m === 'senses' && !mistakes) App.achieve('body_senses');
      if (def.m === 'dress') App.achieve('body_dress');
      if (LEVELS.every((_, i) => pr.stars[i + 1])) App.achieve('body_all');
    });
  }
  function openLevels() {
    const pr = loadProg(), g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lk = n > pr.unlocked, M = MODE[L.m];
      return `<button class="lvb m-${L.m}${lk ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}"><span class="n">${num(n)}</span>
        <span class="e">${M.i}</span><b>${M.ar}</b><small>${App.esc(L.t)}</small>
        <span class="s">${lk ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    g.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
    if (window.Fx && Fx.overlayIn) Fx.overlayIn(lvOv);
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
  spkBtn.addEventListener('click', () => {
    if (paused) return;
    Sound.tap();
    if (def.m === 'learn') say(App.g('المسي', 'المس') + ' أي جزء', 'Touch any part');
    else sayQ();
  });
  turnBtn.addEventListener('click', () => { if (paused || blocked()) return; idleT = 0; turn(); });
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'ar'; store.set('bodyLang', lang);
    root.querySelectorAll('.lng button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
    if (def.m === 'learn') showLearn(); else showQ();
  }
  root.querySelectorAll('.lng button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === lang) return;
    Sound.tap(); setLang(b.dataset.l);
    if (def.m === 'learn') say(App.g('المسي', 'المس') + ' أي جزء', 'Touch any part'); else sayQ();
  }));

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  const blocked = () => App.current !== ID || paused || winOv.classList.contains('on') || lvOv.classList.contains('on');
  function tapAt(x, y) {
    if (flipTo) return;
    look.tx = clamp((x - CX) / (K * 80), -1, 1); look.ty = clamp((y - (TOPY + 64 * K)) / (K * 80), -1, 1);
    const id = hitPart(x, y);
    if (!id) { if (def.m !== 'learn' && cur && needsTurn()) turnBtn.classList.add('pulse'); return null; }
    onPart(id, x, y);
    return id;
  }
  cv.addEventListener('pointerdown', e => {
    if (blocked()) return;
    Sound.ac && Sound.ac(true);
    const p = pos(e);
    tapAt(p.x, p.y);
  });
  // سحب قطعة الملابس
  itemEl.addEventListener('pointerdown', e => {
    if (blocked() || !cur || cur.type !== 'dress' || lock > 0) return;
    e.preventDefault();
    try { itemEl.setPointerCapture(e.pointerId); } catch (er) {}
    drag = { id: e.pointerId, moved: false, sx: e.clientX, sy: e.clientY };
    ghost.textContent = cur.icon; ghost.style.display = 'grid';
    ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px';
    itemEl.classList.add('drag'); Sound.tap();
  });
  itemEl.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 8) drag.moved = true;
    ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px';
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    look.tx = clamp((x - CX) / (K * 80), -1, 1); look.ty = clamp((y - (TOPY + 64 * K)) / (K * 80), -1, 1);
  });
  function endItemDrag(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const moved = drag.moved; drag = null;
    ghost.style.display = 'none'; itemEl.classList.remove('drag');
    if (!moved || blocked() || !cur || cur.type !== 'dress') { if (!moved) sayQ(); return; }
    const r = cv.getBoundingClientRect();
    const id = tapAt(e.clientX - r.left, e.clientY - r.top - 10);
    if (!id) { Sound.slide(); }
  }
  itemEl.addEventListener('pointerup', endItemDrag);
  itemEl.addEventListener('pointercancel', e => { if (drag && e.pointerId === drag.id) { drag = null; ghost.style.display = 'none'; itemEl.classList.remove('drag'); } });
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (e.key === ' ' || e.key === 'Enter') { if (winOv.classList.contains('on')) act(lvl < LEVELS.length ? 'next' : 'again'); else if (!blocked()) sayQ(); e.preventDefault(); }
    else if ((e.key === 't' || e.key === 'T' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !blocked()) turn();
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt; idleT += dt;
    if (cv.clientWidth && (Math.abs(cv.clientWidth - W) > 1 || Math.abs(cv.clientHeight - H) > 1)) { bgKey = ''; layout(); }
    for (let i = tasks.length - 1; i >= 0; i--) { const k = tasks[i]; k.t -= dt; if (k.t <= 0) { tasks.splice(i, 1); k.fn(); } }
    if (lock > 0 && lock < 50) lock -= dt;
    for (const r of reacts) r.t += dt;
    reacts = reacts.filter(r => r.t < r.d);
    // رمش تلقائي
    nextBlink -= dt;
    if (blinkT >= 0) { blinkT += dt; if (blinkT > .16) blinkT = -1; }
    else if (nextBlink <= 0) { blinkT = 0; nextBlink = rand(2.2, 4.8); if (Math.random() < .2) nextBlink = .25; }
    // النظر: يتبع الإصبع ثم يعود ببطء
    if (idleT > 1.6) { look.tx = Math.sin(T * .5) * .4; look.ty = Math.sin(T * .37) * .2 + .1; }
    look.x += (look.tx - look.x) * Math.min(1, dt * 8); look.y += (look.ty - look.y) * Math.min(1, dt * 8);
    // الاستدارة
    if (flipTo) {
      flip += dt / .55;
      if (flip >= .5 && view !== flipTo) { view = flipTo; react('happy', .8); }
      if (flip >= 1) { flip = 0; flipTo = null; if (view === 'back' && !over) react('back', 1); }
    }
    // تلميح بعد خطأين: نبض الجزء المطلوب
    if (hintT > 0) hintT -= dt;
    if (cur && !over && needsTurn() && (wrongNow >= 1 || idleT > 3)) turnBtn.classList.add('pulse');
    // تذكير عند الخمول
    if (cur && !over && idleT > 9 && lock <= 0) { idleT = 0; sayQ(); hintT = Math.max(hintT, 2); }
    if (def.m === 'learn' && !over && idleT > 10) { idleT = 0; partReact(['hands', 'tummy', 'ears', 'hair'][Math.floor(rand(0, 4))]); }
    computePose();
    G = geo();
    for (const t of tags) t.age += dt;
    tags = tags.filter(t => t.age < t.life);
    for (const q of parts) {
      q.age += dt; q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
      if (q.t === 'star') { q.vy += 400 * dt; q.vx *= .98; }
      else if (q.t === 'conf') { q.vx += Math.sin(q.age * 3 + q.rot) * 20 * dt; }
      else if (q.t === 'dust') { q.vy += 60 * dt; q.vx *= .95; }
    }
    parts = parts.filter(q => q.age < q.life && q.y < H + 40);
    for (const r of rings) r.age += dt;
    rings = rings.filter(r => r.age < r.life);
    shake = Math.max(0, shake - dt * 30);
  }

  /* ---------- الرسم ---------- */
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  function drawTag(t) {
    const k = t.age < .35 ? easeOutBack(t.age / .35) : 1, a = t.age > t.life - .3 ? (t.life - t.age) / .3 : 1;
    const fs = clamp(K * 9.5, 17, 28);
    ctx.save(); ctx.globalAlpha = clamp(a, 0, 1);
    ctx.font = `900 ${fs}px ${FONT}`;
    const tw = ctx.measureText(t.txt).width, w = tw + fs * 1.9, h = fs * 1.75;
    // ضع البطاقة إلى الجانب الأبعد عن مركز الطفل
    const side = t.x >= CX ? 1 : -1;
    let bx = t.x + side * (w / 2 + fs * 1.3), by = t.y - fs * 1.6 - t.age * 6;
    bx = clamp(bx, w / 2 + 8, W - w / 2 - 8); by = clamp(by, h / 2 + 70, H - h / 2 - 8);
    // الخط الواصل
    ctx.strokeStyle = t.ok ? 'rgba(255,255,255,.95)' : 'rgba(255,255,255,.8)'; ctx.lineWidth = 4; ctx.setLineDash([2, 6]); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(t.x, t.y); ctx.lineTo(bx, by); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = t.ok ? '#FF7A59' : '#9AA3B5'; ctx.beginPath(); ctx.arc(t.x, t.y, 6, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.translate(bx, by); ctx.scale(k, k);
    const col = t.ok ? '#FF8A5C' : '#B8C0CF', colD = t.ok ? '#E2552F' : '#8A93A6';
    ctx.fillStyle = colD; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2 + 5, w, h, h / 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-w / 2 + 2, -h / 2 + 2, w - 4, h - 4, h / 2 - 2); ctx.stroke();
    ctx.fillStyle = t.ok ? '#7A2E3A' : '#6B7385'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(t.txt, 0, fs * .06);
    if (!t.ok) { ctx.font = `900 ${fs * .8}px ${FONT}`; ctx.fillStyle = '#F2484B'; ctx.fillText('✕', -w / 2 + fs * .1, -h / 2 + fs * .1); }
    ctx.restore();
  }
  function drawHint() {
    if (!cur || over || hintT <= 0) return;
    const id = cur.ok.find(partVisible); if (!id) return;
    const p = partPos(id), t = T * 4;
    const r = K * 14 + Math.sin(t) * 5;
    ctx.save();
    ctx.strokeStyle = `rgba(255,220,80,${.6 + Math.sin(t) * .3})`; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.font = `${K * 15}px ${EMOJI_FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText('👆', p.x + 6, p.y + r * .4 + Math.sin(t) * 4);
    ctx.restore();
  }
  function render() {
    if (!ctx) return;
    ctx.save();
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake) * .5);
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    if (!G) { computePose(); G = geo(); }
    drawKid();
    drawHint();
    for (const r of rings) { const t = r.age / r.life; ctx.strokeStyle = `rgba(255,255,255,${(1 - t) * .9})`; ctx.lineWidth = 4 * (1 - t) + 1; ctx.beginPath(); ctx.arc(r.x, r.y, 10 + t * 60, 0, TAU); ctx.stroke(); }
    for (const t of tags) drawTag(t);
    for (const q of parts) {
      const t = q.age / q.life;
      ctx.save(); ctx.translate(q.x, q.y);
      if (q.t === 'conf') { ctx.rotate(q.rot); ctx.globalAlpha = Math.min(1, (q.life - q.age) * 2); ctx.fillStyle = q.c; ctx.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); }
      else if (q.t === 'txt') {
        ctx.rotate(q.rot); ctx.globalAlpha = 1 - t * t; const s = 1 + Math.sin(Math.min(1, t * 4) * Math.PI) * .25; ctx.scale(s, s);
        ctx.font = `900 ${q.s}px ${/\p{Extended_Pictographic}/u.test(q.txt) ? EMOJI_FONT : FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.lineJoin = 'round'; ctx.strokeText(q.txt, 0, 0); ctx.fillStyle = q.c || '#FF5C8A'; ctx.fillText(q.txt, 0, 0);
      }
      else if (q.t === 'dust') { ctx.globalAlpha = (1 - t) * .8; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, q.s * (1 + t), 0, TAU); ctx.fill(); }
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
    clearTimeout(resizeT); resizeT = setTimeout(() => { bgKey = ''; bakeCache.clear(); layout(); if (!running) render(); }, 80);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    IK.bg(c, s, ['#FFE3D1', '#FFB59C', '#FF8A6A'], { seed: 5 });
    IK.ground(c, s, s * .8, '#FFD0B8', '#F59C7C');
    IK.shadow(c, s * .5, s * .9, s * .3, s * .07);
    IK.sticker(c, s, x => {
      x.save(); x.translate(s * .5, s * .5);
      const r = s * .27;
      // أذنان
      for (const k of [-1, 1]) { x.fillStyle = '#E3A57A'; x.beginPath(); x.ellipse(k * r * .98, r * .1, r * .2, r * .26, 0, 0, TAU); x.fill(); }
      const g = x.createRadialGradient(-r * .3, -r * .35, r * .1, 0, 0, r * 1.1); g.addColorStop(0, '#FFE4CC'); g.addColorStop(.6, '#ECB78E'); g.addColorStop(1, '#C98A60');
      x.fillStyle = g; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill();
      x.fillStyle = '#3B2418'; x.beginPath(); x.arc(0, 0, r * 1.06, Math.PI * .97, Math.PI * 2.03); x.quadraticCurveTo(r * .5, -r * .3, 0, -r * .2); x.quadraticCurveTo(-r * .5, -r * .5, -r, -r * .05); x.fill();
      for (const k of [-1, 1]) {
        x.fillStyle = '#fff'; x.beginPath(); x.ellipse(k * r * .36, r * .05, r * .2, r * .24, 0, 0, TAU); x.fill();
        x.fillStyle = '#4A2A18'; x.beginPath(); x.arc(k * r * .36, r * .1, r * .14, 0, TAU); x.fill();
        x.fillStyle = '#fff'; x.beginPath(); x.arc(k * r * .36 - r * .05, r * .03, r * .05, 0, TAU); x.fill();
        x.fillStyle = 'rgba(255,110,120,.45)'; x.beginPath(); x.arc(k * r * .62, r * .45, r * .14, 0, TAU); x.fill();
      }
      x.fillStyle = '#E79A72'; x.beginPath(); x.ellipse(0, r * .32, r * .12, r * .09, 0, 0, TAU); x.fill();
      x.fillStyle = '#7A1E2E'; x.beginPath(); x.moveTo(-r * .25, r * .52); x.quadraticCurveTo(0, r * .58, r * .25, r * .52); x.quadraticCurveTo(0, r * .9, -r * .25, r * .52); x.fill();
      x.fillStyle = '#FF7D95'; x.beginPath(); x.ellipse(0, r * .72, r * .12, r * .08, 0, 0, TAU); x.fill();
      x.restore();
      x.font = `${s * .22}px ${EMOJI_FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText('👆', s * .78, s * .7);
    });
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'أجزاء الجسم', icon2: '🧒', isNew: true, music: 'shapes',
    desc: () => App.g('المسي الأنف والعينين وتعرّفي على جسمك', 'المس الأنف والعينين وتعرّف على جسمك'),
    help: () => [
      '🧒 ' + App.g('المسي', 'المس') + ' أي جزء من جسم الطفل ' + App.g('لتسمعي', 'لتسمع') + ' اسمه، وسيتحرّك ويضحك!',
      '👆 في «ابحث» ' + App.g('اسمعي', 'اسمع') + ' السؤال ثم ' + App.g('المسي', 'المس') + ' الجزء المطلوب',
      '👃 في «الحواس»: بماذا نشمّ؟ بماذا نسمع؟',
      '👒 في «ألبسني» ' + App.g('اسحبي', 'اسحب') + ' القبعة إلى الرأس والحذاء إلى القدمين',
      '🔄 زر الاستدارة يُريك الظهر · 🌍 عربي / English'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 ${ks.length}/${LEVELS.length} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      girl = App.g(true, false);
      lang = store.get('bodyLang', 'ar') === 'en' ? 'en' : 'ar';
      root.querySelectorAll('.lng button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
      bakeCache.clear();
      layout();
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, LEVELS.length));
      computePose(); G = geo(); render(); startLoop();
    },
    leave() { stopLoop(); sayTok++; tasks = []; drag = null; ghost.style.display = 'none'; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { drag = null; ghost.style.display = 'none'; itemEl.classList.remove('drag'); } },
    resume() { paused = false; last = performance.now(); },
    back() { if (lvOv.classList.contains('on')) { act('close'); return true; } return false; },
    /* للاختبار الآلي فقط */
    _state() { return { lvl, mode: def.m, qi, n: qs.length, cur: cur && { type: cur.type, id: cur.id, ok: cur.ok }, mistakes, over, view, girl, lang, seen: [...seen], worn }; },
    _pos(id) { return partPos(id); },
    _hit(x, y) { return hitPart(x, y); }
  });
})();
