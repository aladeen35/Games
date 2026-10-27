/* =====================================================================
   الوضوء والصلاة — تعلّم خطوات الوضوء والصلاة بهدوء
   تعلّم مع حركة وقطرات ماء وعدّ، ترتيب البطاقات بالسحب، المس العضو،
   أوضاع ركعة واحدة، وأسماء الصلوات الخمس مع مشاهد السماء
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'wudu';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,"Segoe UI",Tahoma,sans-serif';
  const EN_FONT = 'system-ui,"Segoe UI",Roboto,sans-serif';
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  /* ---------- المحتوى ----------
     ar: العنوان بالتشكيل، en: بالإنجليزية، part: العضو (لسؤال «المس»)، n: عدد المرات، lr: اليمنى ثم اليسرى
     say: ما يُقال (بالعربية دائمًا)، sen: معناه بالإنجليزية، d/de: شرح قصير */
  const WUDU = [
    { id: 'niyyah', ic: '💭', ar: 'النِّيَّةُ', en: 'Intention', d: 'نَنْوِي الوُضُوءَ بِقُلُوبِنَا', de: 'We intend wudu in our hearts' },
    { id: 'bism', ic: '🤲', ar: 'بِسْمِ اللَّهِ', en: 'Say Bismillah', say: 'بِسْمِ اللَّهِ', sen: 'In the name of Allah' },
    { id: 'hands', ic: '🙌', ar: 'غَسْلُ الكَفَّيْنِ', en: 'Wash the hands', part: 'hands', n: 3 },
    { id: 'mouth', ic: '👄', ar: 'المَضْمَضَةُ', en: 'Rinse the mouth', part: 'mouth', n: 3 },
    { id: 'nose', ic: '👃', ar: 'الاسْتِنْشَاقُ وَالاسْتِنْثَارُ', en: 'Rinse the nose', part: 'nose', n: 3 },
    { id: 'face', ic: '😊', ar: 'غَسْلُ الوَجْهِ', en: 'Wash the face', part: 'face', n: 3 },
    { id: 'arms', ic: '💪', ar: 'غَسْلُ اليَدَيْنِ إِلَى المِرْفَقَيْنِ', en: 'Wash the arms to the elbows', part: 'arms', n: 3, lr: true },
    { id: 'head', ic: '💆', ar: 'مَسْحُ الرَّأْسِ', en: 'Wipe the head', part: 'head', n: 1, wipe: true },
    { id: 'ears', ic: '👂', ar: 'مَسْحُ الأُذُنَيْنِ', en: 'Wipe the ears', part: 'ears', n: 1, wipe: true },
    { id: 'feet', ic: '🦶', ar: 'غَسْلُ الرِّجْلَيْنِ إِلَى الكَعْبَيْنِ', en: 'Wash the feet to the ankles', part: 'feet', n: 3, lr: true },
    { id: 'shahada', ic: '☝️', ar: 'الشَّهَادَةُ بَعْدَ الوُضُوءِ', en: 'The Shahada after wudu',
      say: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
      sen: 'I bear witness that there is no god but Allah, alone without partner, and that Muhammad is His servant and Messenger' }
  ];
  const PRAYER = [
    { id: 'takbir', ic: '🙌', ar: 'القِيَامُ وَتَكْبِيرَةُ الإِحْرَامِ', en: 'Stand and say Allahu Akbar', pose: 'takbir', say: 'اللَّهُ أَكْبَرُ', sen: 'Allah is the Greatest' },
    { id: 'fatiha', ic: '📖', ar: 'قِرَاءَةُ الفَاتِحَةِ', en: 'Recite Al-Fatiha', pose: 'stand', say: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', sen: 'All praise is for Allah, Lord of all the worlds' },
    { id: 'ruku', ic: '🙇', ar: 'الرُّكُوعُ', en: 'Bowing (Ruku)', pose: 'ruku', say: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', sen: 'Glory be to my Lord, the Most Great' },
    { id: 'rise', ic: '🧍', ar: 'الرَّفْعُ مِنَ الرُّكُوعِ', en: 'Rising from bowing', pose: 'rise', say: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ', sen: 'Allah hears whoever praises Him. Our Lord, to You is all praise' },
    { id: 'sujud', ic: '🛐', ar: 'السُّجُودُ', en: 'Prostration (Sujud)', pose: 'sujud', say: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', sen: 'Glory be to my Lord, the Most High' },
    { id: 'jalsa', ic: '🧎', ar: 'الجُلُوسُ بَيْنَ السَّجْدَتَيْنِ', en: 'Sitting between the prostrations', pose: 'sit', say: 'رَبِّ اغْفِرْ لِي', sen: 'My Lord, forgive me' },
    { id: 'sujud2', ic: '🛐', ar: 'السَّجْدَةُ الثَّانِيَةُ', en: 'The second prostration', pose: 'sujud', say: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', sen: 'Glory be to my Lord, the Most High' },
    { id: 'tash', ic: '☝️', ar: 'التَّشَهُّدُ', en: 'Tashahhud', pose: 'tash', say: 'التَّحِيَّاتُ لِلَّهِ', sen: 'All greetings are for Allah' },
    { id: 'salam', ic: '👋', ar: 'التَّسْلِيمُ', en: 'Taslim', pose: 'salam', say: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ', sen: 'Peace and the mercy of Allah be upon you' }
  ];
  const TIMES = [
    { id: 'fajr', ar: 'الفَجْرُ', en: 'Fajr', t: 'عِنْدَ الفَجْرِ، قَبْلَ شُرُوقِ الشَّمْسِ', te: 'At dawn, before sunrise', rk: 2, rka: 'رَكْعَتَانِ', rke: '2 rak\'ahs' },
    { id: 'dhuhr', ar: 'الظُّهْرُ', en: 'Dhuhr', t: 'فِي وَسَطِ النَّهَارِ، وَالشَّمْسُ عَالِيَةٌ', te: 'At midday, when the sun is high', rk: 4, rka: 'أَرْبَعُ رَكَعَاتٍ', rke: '4 rak\'ahs' },
    { id: 'asr', ar: 'العَصْرُ', en: 'Asr', t: 'بَعْدَ الظُّهْرِ، حِينَ تَمِيلُ الشَّمْسُ', te: 'In the afternoon, as the sun goes lower', rk: 4, rka: 'أَرْبَعُ رَكَعَاتٍ', rke: '4 rak\'ahs' },
    { id: 'maghrib', ar: 'المَغْرِبُ', en: 'Maghrib', t: 'عِنْدَ غُرُوبِ الشَّمْسِ', te: 'At sunset', rk: 3, rka: 'ثَلَاثُ رَكَعَاتٍ', rke: '3 rak\'ahs' },
    { id: 'isha', ar: 'العِشَاءُ', en: 'Isha', t: 'فِي اللَّيْلِ، حِينَ تَظْهَرُ النُّجُومُ', te: 'At night, when the stars come out', rk: 4, rka: 'أَرْبَعُ رَكَعَاتٍ', rke: '4 rak\'ahs' }
  ];
  const PARTS = { hands: 'الكَفَّانِ', mouth: 'الفَمُ', nose: 'الأَنْفُ', face: 'الوَجْهُ', arms: 'اليَدَانِ إِلَى المِرْفَقَيْنِ', head: 'الرَّأْسُ', ears: 'الأُذُنَانِ', feet: 'الرِّجْلَانِ' };
  const PARTS_EN = { hands: 'the hands', mouth: 'the mouth', nose: 'the nose', face: 'the face', arms: 'the arms', head: 'the head', ears: 'the ears', feet: 'the feet' };

  const LEVELS = [
    { k: 'learnW', ic: '💧', t: 'تعلّم الوضوء', te: 'Learn wudu' },
    { k: 'tap', ic: '👆', t: 'أين نغسل؟', te: 'Where?' },
    { k: 'orderW', ic: '🧩', t: 'ترتيب الوضوء ١', te: 'Wudu order 1', a: 0, b: 6 },
    { k: 'orderW', ic: '🧩', t: 'ترتيب الوضوء ٢', te: 'Wudu order 2', a: 5, b: 11 },
    { k: 'next', ic: '➡️', t: 'ماذا بعد؟', te: 'What next?' },
    { k: 'learnP', ic: '🕌', t: 'تعلّم الصلاة', te: 'Learn prayer' },
    { k: 'orderP', ic: '🧩', t: 'ترتيب الصلاة ١', te: 'Prayer order 1', a: 0, b: 5 },
    { k: 'orderP', ic: '🧩', t: 'ترتيب الصلاة ٢', te: 'Prayer order 2', a: 0, b: 9 },
    { k: 'times', ic: '🌅', t: 'أوقات الصلاة', te: 'Prayer times' }
  ];

  /* ---------- أدوات ---------- */
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const plain = s => String(s).replace(/[ً-ْٰ]/g, '');
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const loadProg = () => { const p = store.get('wuduProg', null) || {}; return { stars: p.stars || {} }; };
  let lang = 'ar';
  const num = n => lang === 'ar' ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const isGirl = () => App.g(true, false);
  function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
  function grad(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; }
  function rgrad(c, x, y, r, stops) { const g = c.createRadialGradient(x - r * .35, y - r * .4, r * .08, x, y, r * 1.05); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; }
  function emo(c, e, x, y, s) { c.save(); c.font = `${s}px ${EMOJI_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(e, x, y); c.restore(); }
  function shadowE(c, x, y, rx, ry, a = .18) { const g = c.createRadialGradient(x, y, 0, x, y, rx); g.addColorStop(0, `rgba(30,40,70,${a})`); g.addColorStop(1, 'rgba(30,40,70,0)'); c.save(); c.translate(x, y); c.scale(1, ry / rx); c.fillStyle = g; c.beginPath(); c.arc(0, 0, rx, 0, TAU); c.fill(); c.restore(); }
  function star5(c, x, y, r, rot = 0) { c.beginPath(); for (let k = 0; k < 10; k++) { const rad = k % 2 ? r * .45 : r, a = -Math.PI / 2 + rot + k * Math.PI / 5; c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); } c.closePath(); }
  function capsule(c, x1, y1, x2, y2, w, col) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }

  const SKIN = ['#FFE7D3', '#FBC9A3', '#E7A47C'];
  const LOOKS = {
    girl: { top: ['#B9A4FF', '#8C72E8', '#6A51C7'], dress: true, hair: ['#6E4127', '#45240F'], bow: '#FF7EB0', pants: ['#8C72E8', '#6A51C7'],
      robe: ['#F4F0FF', '#DCD3F7', '#BFB2EA'], scarf: ['#FFFFFF', '#EDE7FA', '#D4CAF0'], trim: '#B9A4FF' },
    boy: { top: ['#7CD3F2', '#39A9D6', '#1F86B5'], dress: false, hair: ['#4A2E1C', '#2A170B'], pants: ['#5F7397', '#43557A'],
      robe: ['#FFFFFF', '#EAF1F6', '#CFDCE6'], cap: ['#FFFFFF', '#E3ECF2'], trim: '#9CC9E0' }
  };
  const look = () => LOOKS[isGirl() ? 'girl' : 'boy'];

  /* =====================================================================
     الطفل من الأمام (للوضوء). الأصل = بين القدمين على الأرض، u = وحدة الحجم
     أطراف الطفل: R = اليمنى (يسار الشاشة، x سالب)، L = اليسرى
     ===================================================================== */
  const G = {
    sh: { R: [-.98, -3.9], L: [.98, -3.9] }, up: 1.12, fore: 1.12,
    head: [0, -5.5], hr: 1.22, eye: [.43, -5.42], nose: [0, -5.1], mouth: [0, -4.75], ear: [1.24, -5.38],
    hip: { R: [-.5, -2.2], L: [.5, -2.2] }, foot: { R: [-.58, -.22], L: [.58, -.22] },
    idle: { R: [-1.9, -1.95], L: [1.9, -1.95] }
  };
  function ik(side, tx, ty) {
    const s = side === 'R' ? -1 : 1, [sx, sy] = G.sh[side], L1 = G.up, L2 = G.fore;
    let dx = tx - sx, dy = ty - sy, d = Math.hypot(dx, dy);
    const dm = L1 + L2 - .02; if (d > dm) { dx *= dm / d; dy *= dm / d; d = dm; }
    d = Math.max(d, .25);
    const th = Math.atan2(dy, dx), al = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    const a = th + (s < 0 ? al : -al);
    return { sx, sy, ex: sx + Math.cos(a) * L1, ey: sy + Math.sin(a) * L1, hx: sx + dx, hy: sy + dy };
  }
  /* o: {hR,hL:[x,y], eyes, mouth, puff, liftR, liftL, finger, glow:{part:a}, wet:{part:a}, T} */
  function kidFront(c, x, y, u, o = {}) {
    const L = look(), girl = isGirl(), T = o.T || 0, glow = o.glow || {}, wet = o.wet || {};
    c.save(); c.translate(x, y); c.scale(u, u);
    const P = (px, py) => [px, py];
    shadowE(c, 0, 0, 2.4, .45, .22);
    const glowAt = (a, fn) => { if (!a) return; c.save(); c.shadowColor = `rgba(90,210,255,${.9 * a})`; c.shadowBlur = 26 * a * u / 40; c.globalAlpha = a; fn(); c.restore(); };
    /* الساقان والقدمان */
    for (const sd of ['R', 'L']) {
      const s = sd === 'R' ? -1 : 1, lift = (sd === 'R' ? o.liftR : o.liftL) || 0;
      const [hx, hy] = G.hip[sd], [fx, fy0] = G.foot[sd], fy = fy0 - lift * .55;
      // الساق
      capsule(c, hx, hy, fx, fy - .25, .62, '#E9AE86');
      capsule(c, hx, hy, fx, fy - .25, .5, grad(c, 0, hy, 0, fy, [SKIN[1], SKIN[1], SKIN[2]]));
      if (!L.dress) { // سروال مرفوع حتى منتصف الساق
        c.fillStyle = grad(c, hx - .4, 0, hx + .4, 0, L.pants); rr(c, hx - .36 + s * .02, hy - .1, .72, 1.3, .22); c.fill();
        c.fillStyle = 'rgba(255,255,255,.25)'; rr(c, hx - .36 + s * .02, hy + 1.0, .72, .18, .09); c.fill();
      }
      // القدم
      glowAt(glow.feet && (!o.side || o.side === sd) ? glow.feet : 0, () => { c.fillStyle = '#9BE3FF'; c.beginPath(); c.ellipse(fx + s * .1, fy, .62, .36, 0, 0, TAU); c.fill(); });
      c.save(); c.shadowColor = 'rgba(60,30,30,.25)'; c.shadowBlur = 3; c.shadowOffsetY = 1;
      c.fillStyle = rgrad(c, fx + s * .1, fy - .1, .6, SKIN); c.beginPath(); c.ellipse(fx + s * .1, fy, .55, .3, 0, 0, TAU); c.fill(); c.restore();
      c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(fx + s * .02, fy - .12, .25, .08, 0, 0, TAU); c.fill();
      c.fillStyle = '#F2A98A'; for (let k = 0; k < 4; k++) { c.beginPath(); c.arc(fx + s * (-.18 + k * .14) + s * .1, fy + .2, .07, 0, TAU); c.fill(); }
      if (wet.feet && (!wet.side || wet.side === sd)) shimmer(c, fx + s * .1, fy - .1, .5, wet.feet, T);
    }
    /* الجسم */
    c.save(); c.shadowColor = 'rgba(40,40,90,.25)'; c.shadowBlur = .3 * 10; c.shadowOffsetY = .1;
    c.fillStyle = grad(c, -1.2, -4, 1.2, -1.2, L.top);
    c.beginPath();
    if (L.dress) {
      c.moveTo(-.85, -4.05); c.quadraticCurveTo(0, -4.25, .85, -4.05); c.quadraticCurveTo(1.05, -3.0, 1.0, -2.6);
      c.quadraticCurveTo(1.25, -1.8, 1.4, -1.15); c.quadraticCurveTo(0, -.85, -1.4, -1.15); c.quadraticCurveTo(-1.25, -1.8, -1.0, -2.6); c.quadraticCurveTo(-1.05, -3.0, -.85, -4.05);
    } else {
      c.moveTo(-.9, -4.05); c.quadraticCurveTo(0, -4.22, .9, -4.05); c.quadraticCurveTo(1.05, -3.0, .95, -2.0); c.quadraticCurveTo(0, -1.85, -.95, -2.0); c.quadraticCurveTo(-1.05, -3.0, -.9, -4.05);
    }
    c.fill(); c.restore();
    c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(-.45, -3.4, .2, .5, .25, 0, TAU); c.fill();
    if (L.dress) { c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = .1; c.beginPath(); c.moveTo(-1.32, -1.3); c.quadraticCurveTo(0, -1.0, 1.32, -1.3); c.stroke(); c.fillStyle = L.bow; c.beginPath(); c.arc(0, -3.75, .14, 0, TAU); c.fill(); }
    else { c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.moveTo(-.32, -4.08); c.lineTo(0, -3.78); c.lineTo(.32, -4.08); c.closePath(); c.fill(); }
    // القلب (للنية)
    if (o.heart) { const k = o.heart, p = 1 + Math.sin(T * 5) * .08; c.save(); c.translate(.3, -3.35); c.scale(p * k, p * k); c.shadowColor = 'rgba(255,120,160,.9)'; c.shadowBlur = 12; c.fillStyle = '#FF6B9A'; c.beginPath(); c.moveTo(0, .28); c.bezierCurveTo(-.5, -.05, -.25, -.45, 0, -.18); c.bezierCurveTo(.25, -.45, .5, -.05, 0, .28); c.fill(); c.restore(); }
    /* الرأس */
    const [hx, hy] = G.head, hr = G.hr;
    c.fillStyle = SKIN[1]; rr(c, -.22, -4.35, .44, .4, .12); c.fill();
    if (girl) { // كعكتان من الشعر
      for (const s of [-1, 1]) { c.fillStyle = rgrad(c, hx + s * .95, hy - 1.0, .45, [L.hair[0], L.hair[0], L.hair[1]]); c.beginPath(); c.arc(hx + s * .95, hy - 1.0, .45, 0, TAU); c.fill(); c.fillStyle = L.bow; c.beginPath(); c.ellipse(hx + s * .7, hy - .72, .2, .12, s * .7, 0, TAU); c.fill(); }
    }
    // الأذنان
    for (const s of [-1, 1]) {
      const ex = G.ear[0] * s, ey = G.ear[1];
      glowAt(glow.ears || 0, () => { c.fillStyle = '#9BE3FF'; c.beginPath(); c.arc(ex, ey, .42, 0, TAU); c.fill(); });
      c.fillStyle = rgrad(c, ex, ey, .3, SKIN); c.beginPath(); c.ellipse(ex, ey, .26, .33, 0, 0, TAU); c.fill();
      c.fillStyle = 'rgba(220,130,100,.45)'; c.beginPath(); c.ellipse(ex + s * .03, ey, .12, .18, 0, 0, TAU); c.fill();
      if (wet.ears) shimmer(c, ex, ey, .3, wet.ears, T + s);
    }
    glowAt(glow.face || 0, () => { c.fillStyle = '#9BE3FF'; c.beginPath(); c.arc(hx, hy + .15, hr * .98, 0, TAU); c.fill(); });
    glowAt(glow.head || 0, () => { c.fillStyle = '#9BE3FF'; c.beginPath(); c.arc(hx, hy - .2, hr * 1.05, Math.PI, TAU); c.fill(); });
    c.save(); c.shadowColor = 'rgba(80,40,30,.22)'; c.shadowBlur = 4; c.shadowOffsetY = 1.5;
    c.fillStyle = rgrad(c, hx, hy, hr, SKIN); c.beginPath(); c.arc(hx, hy, hr, 0, TAU); c.fill(); c.restore();
    // الشعر
    c.fillStyle = grad(c, 0, hy - hr, 0, hy, L.hair);
    c.beginPath(); c.arc(hx, hy, hr * 1.03, Math.PI * 1.04, Math.PI * 1.96);
    if (girl) { c.quadraticCurveTo(hx + .75, hy - .5, hx + .05, hy - .62); c.quadraticCurveTo(hx - .6, hy - .45, hx - hr * 1.0, hy - .15); }
    else { c.lineTo(hx + .95, hy - .5); c.quadraticCurveTo(hx + .3, hy - .72, hx - .2, hy - .5); c.quadraticCurveTo(hx - .7, hy - .58, hx - hr * 1.0, hy - .2); }
    c.closePath(); c.fill();
    if (!girl) { c.beginPath(); c.moveTo(hx - .1, hy - hr); c.quadraticCurveTo(hx + .1, hy - hr - .4, hx + .4, hy - hr - .2); c.quadraticCurveTo(hx + .12, hy - hr - .12, hx + .12, hy - hr + .06); c.fill(); }
    c.fillStyle = 'rgba(255,255,255,.22)'; c.beginPath(); c.ellipse(hx - .45, hy - .85, .32, .1, -.4, 0, TAU); c.fill();
    if (wet.head) shimmer(c, hx, hy - .9, .7, wet.head, T);
    // الوجه
    const blink = !o.eyes && Math.sin(T * 1.3) > .985;
    const eyes = blink ? 'closed' : (o.eyes || 'open');
    c.lineCap = 'round';
    for (const s of [-1, 1]) {
      const ex = s * G.eye[0], ey = G.eye[1] + (o.lookUp ? -.08 : 0);
      c.strokeStyle = '#3A2318'; c.fillStyle = '#2A1810'; c.lineWidth = .1;
      if (eyes === 'open') { c.beginPath(); c.ellipse(ex, ey, .14, .18, 0, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(ex - .045, ey - .07, .05, 0, TAU); c.fill(); }
      else if (eyes === 'closed') { c.beginPath(); c.arc(ex, ey - .03, .14, .25, Math.PI - .25); c.stroke(); }
      else if (eyes === 'happy') { c.beginPath(); c.arc(ex, ey + .07, .14, Math.PI + .25, -.25); c.stroke(); }
    }
    c.fillStyle = 'rgba(255,120,140,.38)'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * .66, -5.08, .2 + (o.puff || 0) * .08, .12, 0, 0, TAU); c.fill(); }
    if (o.puff) { c.fillStyle = 'rgba(255,200,170,.6)'; for (const s of [-1, 1]) { c.beginPath(); c.arc(s * .55, -4.9, .2 * o.puff, 0, TAU); c.fill(); } }
    glowAt(glow.nose || 0, () => { c.fillStyle = '#9BE3FF'; c.beginPath(); c.arc(G.nose[0], G.nose[1], .3, 0, TAU); c.fill(); });
    c.fillStyle = '#EFA37F'; c.beginPath(); c.ellipse(G.nose[0], G.nose[1], .11, .08, 0, 0, TAU); c.fill();
    glowAt(glow.mouth || 0, () => { c.fillStyle = '#9BE3FF'; c.beginPath(); c.ellipse(G.mouth[0], G.mouth[1], .38, .26, 0, 0, TAU); c.fill(); });
    const my = G.mouth[1], m = o.mouth || 'smile';
    c.strokeStyle = '#9A3A2A'; c.fillStyle = '#B5473A'; c.lineWidth = .08;
    if (m === 'smile') { c.beginPath(); c.arc(0, my - .14, .22, .4, Math.PI - .4); c.stroke(); }
    else if (m === 'open') { c.beginPath(); c.moveTo(-.2, my - .05); c.quadraticCurveTo(0, my + .3, .2, my - .05); c.closePath(); c.fill(); }
    else if (m === 'puff') { c.beginPath(); c.ellipse(0, my, .1, .07, 0, 0, TAU); c.fill(); }
    else { c.beginPath(); c.moveTo(-.12, my); c.lineTo(.12, my); c.stroke(); }
    if (wet.face) shimmer(c, 0, -5.0, .8, wet.face, T);
    if (wet.mouth) shimmer(c, 0, my, .3, wet.mouth, T);
    if (wet.nose) shimmer(c, 0, G.nose[1], .25, wet.nose, T);
    /* الذراعان */
    const hands = {};
    for (const sd of ['R', 'L']) {
      const t = (sd === 'R' ? o.hR : o.hL) || G.idle[sd];
      const a = ik(sd, t[0], t[1]);
      const ga = (glow.arms && (!o.side || o.side === sd)) ? glow.arms : 0;
      glowAt(ga, () => capsule(c, a.ex, a.ey, a.hx, a.hy, .75, '#9BE3FF'));
      capsule(c, a.sx, a.sy, a.ex, a.ey, .46, 'rgba(60,30,40,.15)');
      capsule(c, a.sx, a.sy, a.ex, a.ey, .4, SKIN[1]);
      capsule(c, a.ex, a.ey, a.hx, a.hy, .37, SKIN[1]);
      c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.arc(lerp(a.ex, a.hx, .4) - .05, lerp(a.ey, a.hy, .4) - .05, .08, 0, TAU); c.fill();
      // كمّ قصير مرفوع
      capsule(c, a.sx, a.sy, lerp(a.sx, a.ex, .55), lerp(a.sy, a.ey, .55), .56, L.top[1]);
      capsule(c, lerp(a.sx, a.ex, .45), lerp(a.sy, a.ey, .45), lerp(a.sx, a.ex, .58), lerp(a.sy, a.ey, .58), .6, L.top[0]);
      if (wet.arms && (!wet.side || wet.side === sd)) shimmer(c, lerp(a.ex, a.hx, .5), lerp(a.ey, a.hy, .5), .45, wet.arms, T);
      glowAt(glow.hands || 0, () => { c.fillStyle = '#9BE3FF'; c.beginPath(); c.arc(a.hx, a.hy, .42, 0, TAU); c.fill(); });
      c.fillStyle = rgrad(c, a.hx, a.hy, .3, SKIN); c.beginPath(); c.arc(a.hx, a.hy, .28, 0, TAU); c.fill();
      if (o.finger === sd) { capsule(c, a.hx, a.hy - .1, a.hx, a.hy - .55, .14, SKIN[1]); }
      if (wet.hands) shimmer(c, a.hx, a.hy, .3, wet.hands, T + (sd === 'R' ? 0 : 2));
      hands[sd] = [a.hx, a.hy]; hands[sd + 'e'] = [a.ex, a.ey];
    }
    c.restore();
    return hands;
  }
  /* لمعان الماء على العضو المغسول */
  function shimmer(c, x, y, r, a, T) {
    c.save(); c.globalAlpha = clamp(a, 0, 1);
    for (let i = 0; i < 3; i++) {
      const k = (T * .8 + i / 3) % 1, px = x + Math.cos(i * 2.1 + T) * r * .7, py = y + Math.sin(i * 1.7 + T * 1.3) * r * .5;
      c.fillStyle = `rgba(255,255,255,${Math.sin(k * Math.PI)})`;
      c.beginPath(); for (let q = 0; q < 4; q++) { const an = q * Math.PI / 2; c.quadraticCurveTo(px + Math.cos(an + Math.PI / 4) * .03, py + Math.sin(an + Math.PI / 4) * .03, px + Math.cos(an + Math.PI / 2) * r * .3 * k, py + Math.sin(an + Math.PI / 2) * r * .3 * k); } c.fill();
    }
    c.fillStyle = 'rgba(150,225,255,.35)'; c.beginPath(); c.arc(x, y, r * .55, 0, TAU); c.fill();
    c.restore();
  }

  /* =====================================================================
     الطفل من الجانب (للصلاة)، يتجه إلى اليمين (نحو القبلة في المشهد)
     ===================================================================== */
  const POSES = {
    stand:  { H: [0, -2.05], K: [.05, -1.05], A: [0, -.2], Tt: [.75, -.05], S: [.05, -4.05], C: [.18, -5.3], E: [.45, -3.05], W: [.85, -3.5], turn: 0 },
    takbir: { H: [0, -2.05], K: [.05, -1.05], A: [0, -.2], Tt: [.75, -.05], S: [.05, -4.05], C: [.18, -5.3], E: [.5, -3.45], W: [.65, -4.9], turn: 0 },
    rise:   { H: [0, -2.05], K: [.05, -1.05], A: [0, -.2], Tt: [.75, -.05], S: [.05, -4.05], C: [.18, -5.3], E: [.15, -3.0], W: [.25, -2.05], turn: 0 },
    ruku:   { H: [-.15, -2.05], K: [.1, -1.05], A: [0, -.2], Tt: [.75, -.05], S: [1.85, -2.25], C: [3.0, -2.15], E: [1.3, -1.6], W: [.45, -1.2], turn: 0 },
    sujud:  { H: [.1, -1.75], K: [.75, -.35], A: [-.75, -.38], Tt: [-1.15, -.05], S: [2.05, -1.0], C: [3.0, -1.05], E: [2.4, -.75], W: [2.95, -.2], turn: 0 },
    sit:    { H: [-.3, -.95], K: [1.25, -.38], A: [-.85, -.3], Tt: [-1.35, -.06], S: [-.15, -2.95], C: [.05, -4.2], E: [.3, -1.85], W: [1.0, -1.15], turn: 0 },
    tash:   { H: [-.3, -.95], K: [1.25, -.38], A: [-.85, -.3], Tt: [-1.35, -.06], S: [-.15, -2.95], C: [.05, -4.2], E: [.3, -1.85], W: [1.0, -1.2], turn: 0, finger: 1 },
    salam:  { H: [-.3, -.95], K: [1.25, -.38], A: [-.85, -.3], Tt: [-1.35, -.06], S: [-.15, -2.95], C: [.05, -4.2], E: [.3, -1.85], W: [1.0, -1.15], turn: 0 }
  };
  const JOINTS = ['H', 'K', 'A', 'Tt', 'S', 'C', 'E', 'W'];
  const clonePose = p => { const o = { turn: p.turn || 0, finger: p.finger || 0 }; for (const j of JOINTS) o[j] = p[j].slice(); return o; };
  function blendPose(cur, tgt, k) { for (const j of JOINTS) { cur[j][0] = lerp(cur[j][0], tgt[j][0], k); cur[j][1] = lerp(cur[j][1], tgt[j][1], k); } cur.turn = lerp(cur.turn, tgt.turn || 0, k); cur.finger = lerp(cur.finger, tgt.finger || 0, k); }
  function kidSide(c, x, y, u, p, o = {}) {
    const L = look(), girl = isGirl(), T = o.T || 0;
    c.save(); c.translate(x, y); c.scale(u, u);
    shadowE(c, (p.H[0] + p.C[0]) / 2, 0, 2.2, .3, .2);
    const robe = grad(c, 0, -5, 0, 0, L.robe), far = 'rgba(70,60,110,.18)';
    // الطرفان البعيدان (أغمق قليلًا)
    capsule(c, p.H[0] - .08, p.H[1], p.K[0] - .08, p.K[1], 1.0, L.robe[2]);
    capsule(c, p.K[0] - .08, p.K[1], p.A[0] - .08, p.A[1], .9, L.robe[2]);
    capsule(c, p.S[0] - .1, p.S[1] + .1, p.E[0] - .15, p.E[1], .5, L.robe[2]);
    capsule(c, p.E[0] - .15, p.E[1], p.W[0] - .15, p.W[1], .44, L.robe[2]);
    c.fillStyle = SKIN[2]; c.beginPath(); c.arc(p.W[0] - .15, p.W[1], .26, 0, TAU); c.fill();
    // القدم
    const foot = (dx, col) => { c.save(); c.lineCap = 'round'; capsule(c, p.A[0] + dx, p.A[1], p.Tt[0] + dx, p.Tt[1], .42, col); c.restore(); };
    foot(-.06, SKIN[2]); foot(0, SKIN[1]);
    // الجسم: جذع وفخذ وساق بلون الثوب
    c.save(); c.shadowColor = 'rgba(40,40,90,.22)'; c.shadowBlur = 5; c.shadowOffsetY = 1.5;
    capsule(c, p.H[0], p.H[1], p.S[0], p.S[1], 1.55, robe);
    capsule(c, p.H[0], p.H[1], p.K[0], p.K[1], 1.1, robe);
    capsule(c, p.K[0], p.K[1], p.A[0], p.A[1], .98, robe);
    c.restore();
    // ذيل الثوب عند الوقوف
    const standing = p.A[1] - p.H[1] > 1.6;
    if (standing) { c.fillStyle = robe; c.beginPath(); c.moveTo(p.H[0] - .7, p.H[1]); c.lineTo(p.H[0] + .75, p.H[1]); c.lineTo(p.A[0] + .85, p.A[1] - .05); c.quadraticCurveTo(p.A[0], p.A[1] + .12, p.A[0] - .8, p.A[1] - .05); c.closePath(); c.fill(); }
    c.strokeStyle = L.trim; c.lineWidth = .12; c.lineCap = 'round';
    if (standing) { c.beginPath(); c.moveTo(p.A[0] - .75, p.A[1] - .12); c.quadraticCurveTo(p.A[0], p.A[1] + .02, p.A[0] + .8, p.A[1] - .12); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); const mx = lerp(p.H[0], p.S[0], .55) - .3, my = lerp(p.H[1], p.S[1], .55); c.ellipse(mx, my, .16, .5, Math.atan2(p.S[0] - p.H[0], -(p.S[1] - p.H[1])), 0, TAU); c.fill();
    // الرأس
    const [cx, cy] = p.C, ang = Math.atan2(p.C[1] - p.S[1], p.C[0] - p.S[0]) + Math.PI / 2; // ميل الرأس مع الظهر
    c.save(); c.translate(cx, cy); c.rotate(clamp(ang, -.2, 1.5) * .9);
    const turn = p.turn; // >0 نحو المشاهد (يمين الطفل)، <0 بعيدًا
    if (girl) {
      // خمار الصلاة
      c.save(); c.shadowColor = 'rgba(60,40,90,.2)'; c.shadowBlur = 4; c.shadowOffsetY = 1;
      c.fillStyle = rgrad(c, -.1, -.1, 1.45, L.scarf); c.beginPath(); c.arc(-.08, .02, 1.36, 0, TAU); c.fill();
      c.beginPath(); c.moveTo(-1.3, .2); c.quadraticCurveTo(-1.5, 1.4, -.9, 1.9); c.lineTo(.9, 1.7); c.quadraticCurveTo(1.25, 1.1, 1.15, .5); c.closePath(); c.fill(); c.restore();
      c.strokeStyle = L.trim; c.lineWidth = .1; c.beginPath(); c.arc(-.08, .02, 1.3, -1.9, .5); c.stroke();
      if (turn > -.5) { // الوجه داخل الخمار
        const fx = .28 - turn * .3, fw = .78 + turn * .12;
        c.fillStyle = rgrad(c, fx, .05, .95, SKIN); c.beginPath(); c.ellipse(fx, .08, fw, .95, 0, 0, TAU); c.fill();
      }
    } else {
      c.save(); c.shadowColor = 'rgba(80,40,30,.22)'; c.shadowBlur = 4; c.shadowOffsetY = 1;
      c.fillStyle = rgrad(c, 0, 0, 1.15, SKIN); c.beginPath(); c.arc(0, 0, 1.15, 0, TAU); c.fill(); c.restore();
      if (turn > -.5) { c.fillStyle = grad(c, 0, -1.2, 0, 0, L.hair); c.beginPath(); c.arc(0, 0, 1.18, Math.PI * .92, Math.PI * 1.75); c.quadraticCurveTo(-.2, -.55, -.75, .1); c.closePath(); c.fill(); }
      else { c.fillStyle = grad(c, 0, -1.2, 0, 0, L.hair); c.beginPath(); c.arc(0, 0, 1.18, Math.PI * .6, Math.PI * 2.1); c.quadraticCurveTo(.3, -.2, -.2, .9); c.closePath(); c.fill(); }
      // طاقية بيضاء
      c.fillStyle = grad(c, 0, -1.3, 0, -.4, L.cap); c.beginPath(); c.ellipse(-.05, -.62, 1.08, .62, -.12, Math.PI, TAU); c.fill();
      c.strokeStyle = 'rgba(150,180,200,.6)'; c.lineWidth = .06; for (let k = 0; k < 3; k++) { c.beginPath(); c.ellipse(-.05, -.66, .9 - k * .25, .45 - k * .12, -.12, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
      if (turn <= .5 && turn > -.5) { c.fillStyle = rgrad(c, -.35, .05, .25, SKIN); c.beginPath(); c.ellipse(-.3, .1, .2, .28, 0, 0, TAU); c.fill(); c.fillStyle = 'rgba(220,130,100,.4)'; c.beginPath(); c.ellipse(-.3, .1, .09, .15, 0, 0, TAU); c.fill(); }
    }
    // ملامح الوجه
    const eyesClosed = o.eyes === 'closed' || (Math.sin(T * 1.2) > .985);
    c.fillStyle = '#2A1810'; c.strokeStyle = '#3A2318'; c.lineWidth = .09; c.lineCap = 'round';
    const eye = (ex, ey) => { if (eyesClosed || o.calm) { c.beginPath(); c.arc(ex, ey - .02, .11, .3, Math.PI - .3); c.stroke(); } else { c.beginPath(); c.ellipse(ex, ey, .1, .14, 0, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(ex - .03, ey - .05, .035, 0, TAU); c.fill(); c.fillStyle = '#2A1810'; } };
    if (turn > .5) { // الوجه نحو المشاهد (التسليمة الأولى)
      eye(.08, -.05); eye(.62, -.05);
      c.fillStyle = 'rgba(255,120,140,.38)'; c.beginPath(); c.ellipse(-.1, .3, .16, .1, 0, 0, TAU); c.ellipse(.8, .3, .16, .1, 0, 0, TAU); c.fill();
      c.strokeStyle = '#9A3A2A'; c.lineWidth = .07; c.beginPath(); c.arc(.35, .3, .18, .4, Math.PI - .4); c.stroke();
    } else if (turn > -.5) {
      eye(.62, -.05);
      c.fillStyle = 'rgba(255,120,140,.38)'; c.beginPath(); c.ellipse(.5, .32, .17, .1, 0, 0, TAU); c.fill();
      c.fillStyle = SKIN[1]; c.beginPath(); c.ellipse(1.08, .12, .13, .12, 0, 0, TAU); c.fill(); // الأنف
      c.strokeStyle = '#9A3A2A'; c.lineWidth = .07; c.beginPath(); c.arc(.82, .38, .14, .5, Math.PI - .7); c.stroke();
    }
    c.restore();
    // الذراع القريبة
    c.save(); c.shadowColor = 'rgba(40,40,90,.2)'; c.shadowBlur = 3; c.shadowOffsetY = 1;
    capsule(c, p.S[0], p.S[1] + .1, p.E[0], p.E[1], .55, robe);
    capsule(c, p.E[0], p.E[1], p.W[0], p.W[1], .48, robe); c.restore();
    c.fillStyle = rgrad(c, p.W[0], p.W[1], .3, SKIN); c.beginPath(); c.arc(p.W[0], p.W[1], .28, 0, TAU); c.fill();
    if (p.finger > .3) capsule(c, p.W[0] + .05, p.W[1] - .1, p.W[0] + .2, p.W[1] - .1 - .5 * p.finger, .13, SKIN[1]);
    c.restore();
  }

  /* =====================================================================
     الخلفيات
     ===================================================================== */
  function wuduRoom(c, W, H, T) {
    const fy = H * .8;
    c.fillStyle = grad(c, 0, 0, 0, fy, ['#E6F6FB', '#D2EEF6']); c.fillRect(0, 0, W, fy);
    // بلاط هندسي ناعم
    const ts = Math.max(28, W / 11);
    c.save(); c.globalAlpha = .55;
    for (let y = ts * .5; y < fy - ts * .3; y += ts) for (let x = ((y / ts) % 2) * ts * .5; x < W + ts; x += ts) {
      c.save(); c.translate(x, y); c.rotate(Math.PI / 4); c.strokeStyle = 'rgba(80,170,200,.35)'; c.lineWidth = 1.5; c.strokeRect(-ts * .22, -ts * .22, ts * .44, ts * .44); c.restore();
      c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(x, y, 2.2, 0, TAU); c.fill();
    }
    c.restore();
    // شريط زخرفي
    c.fillStyle = grad(c, 0, fy - 26, 0, fy, ['#5EC2DE', '#3AA1C4']); c.fillRect(0, fy - 22, W, 22);
    c.fillStyle = 'rgba(255,255,255,.5)'; for (let x = 8; x < W; x += 22) { c.beginPath(); c.moveTo(x, fy - 11); c.lineTo(x + 6, fy - 17); c.lineTo(x + 12, fy - 11); c.lineTo(x + 6, fy - 5); c.closePath(); c.fill(); }
    // الأرضية
    c.fillStyle = grad(c, 0, fy, 0, H, ['#BFE2EC', '#A3D2E0']); c.fillRect(0, fy, W, H - fy);
    c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 1.5;
    for (let i = -8; i <= 8; i++) { c.beginPath(); c.moveTo(W / 2 + i * W * .07, fy); c.lineTo(W / 2 + i * W * .2, H); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(0, fy, W, 3);
    // صنبور على الجدار
    const tx = W * .86, ty = H * .2, s = Math.min(W, H) / 300;
    c.save(); c.translate(tx, ty); c.scale(s, s);
    c.fillStyle = grad(c, 0, -14, 0, 14, ['#F4F8FB', '#B7C7D3']); rr(c, -16, -14, 32, 28, 10); c.fill();
    c.fillStyle = grad(c, -30, 0, 0, 0, ['#DDE7EE', '#AEBFCC']); rr(c, -40, -6, 34, 12, 6); c.fill(); rr(c, -44, -6, 10, 22, 5); c.fill();
    c.fillStyle = '#FFD45C'; c.beginPath(); c.arc(0, -20, 7, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.arc(-2, -22, 2.5, 0, TAU); c.fill();
    c.restore();
    // منشفة ونبتة
    c.save(); c.translate(W * .1, H * .42); c.scale(s, s);
    c.fillStyle = '#C9A06A'; rr(c, -26, -40, 52, 6, 3); c.fill();
    c.fillStyle = grad(c, -20, 0, 20, 0, ['#FFE08A', '#F6C14A']); rr(c, -20, -36, 40, 64, 8); c.fill();
    c.fillStyle = 'rgba(255,255,255,.45)'; for (let k = 0; k < 3; k++) c.fillRect(-20, 10 + k * 5, 40, 2);
    c.restore();
  }
  function prayerRoom(c, W, H, T, dir = 1) {
    const fy = H * .78;
    c.fillStyle = grad(c, 0, 0, 0, fy, ['#FFF6E6', '#F8E6C8']); c.fillRect(0, 0, W, fy);
    // نافذة مقوّسة
    const ax = dir > 0 ? W * .8 : W * .2, aw = Math.min(W * .26, H * .3), ah = fy * .62, ay = fy - ah - fy * .08;
    c.save(); c.shadowColor = 'rgba(120,80,20,.18)'; c.shadowBlur = 10;
    c.fillStyle = '#fff'; c.beginPath(); c.moveTo(ax - aw / 2 - 8, fy - fy * .08); c.lineTo(ax - aw / 2 - 8, ay + aw * .5); c.arc(ax, ay + aw * .5, aw / 2 + 8, Math.PI, TAU); c.lineTo(ax + aw / 2 + 8, fy - fy * .08); c.closePath(); c.fill(); c.restore();
    c.fillStyle = grad(c, 0, ay, 0, fy, ['#7FC8F0', '#CBEBFA', '#FFF1CF']); c.beginPath(); c.moveTo(ax - aw / 2, fy - fy * .08); c.lineTo(ax - aw / 2, ay + aw * .5); c.arc(ax, ay + aw * .5, aw / 2, Math.PI, TAU); c.lineTo(ax + aw / 2, fy - fy * .08); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.75)'; c.fillRect(ax - 2, ay, 4, ah); c.fillRect(ax - aw / 2, ay + ah * .55, aw, 4);
    // فانوس معلّق
    const lx = dir > 0 ? W * .2 : W * .8, ly = H * .1 + Math.sin(T * 1.2) * 2;
    c.strokeStyle = '#C49A4A'; c.lineWidth = 2; c.beginPath(); c.moveTo(lx, 0); c.lineTo(lx, ly); c.stroke();
    const gl = c.createRadialGradient(lx, ly + 22, 2, lx, ly + 22, 60); gl.addColorStop(0, 'rgba(255,215,120,.55)'); gl.addColorStop(1, 'rgba(255,215,120,0)'); c.fillStyle = gl; c.beginPath(); c.arc(lx, ly + 22, 60, 0, TAU); c.fill();
    c.fillStyle = grad(c, lx - 12, 0, lx + 12, 0, ['#F2C14E', '#D99A1E']); c.beginPath(); c.moveTo(lx - 8, ly); c.lineTo(lx + 8, ly); c.lineTo(lx + 14, ly + 12); c.lineTo(lx + 12, ly + 32); c.lineTo(lx - 12, ly + 32); c.lineTo(lx - 14, ly + 12); c.closePath(); c.fill();
    c.fillStyle = '#FFF2B8'; rr(c, lx - 7, ly + 12, 14, 16, 4); c.fill();
    // شريط زخرفي
    c.fillStyle = 'rgba(200,150,70,.25)'; c.fillRect(0, fy - 14, W, 14);
    c.fillStyle = 'rgba(255,255,255,.6)'; for (let x = 6; x < W; x += 18) { star5(c, x, fy - 7, 4, 0); c.fill(); }
    // الأرضية: سجاد ناعم
    c.fillStyle = grad(c, 0, fy, 0, H, ['#E3C99E', '#CDAE7E']); c.fillRect(0, fy, W, H - fy);
  }
  function mat(c, x0, x1, y, u) {
    const h = .5 * u;
    shadowE(c, (x0 + x1) / 2, y + h * .6, (x1 - x0) * .6, h, .2);
    c.fillStyle = grad(c, 0, y - h * .3, 0, y + h, ['#3FA88A', '#25806A']); rr(c, x0, y - h * .25, x1 - x0, h, h * .3); c.fill();
    c.fillStyle = '#F2C14E'; rr(c, x0 + 4, y - h * .1, x1 - x0 - 8, h * .14, 2); c.fill(); rr(c, x0 + 4, y + h * .45, x1 - x0 - 8, h * .1, 2); c.fill();
    c.strokeStyle = '#F2C14E'; c.lineWidth = 2; for (let x = x0 - 6; x > x0 - 14; x -= 4) { c.beginPath(); c.moveTo(x + 6, y); c.lineTo(x, y + h * .3); c.stroke(); }
  }

  /* ---------- سماء أوقات الصلاة ---------- */
  const SKY = {
    fajr:    { sky: ['#1B2459', '#4B3F8F', '#E98AA3', '#FFD3A6'], sun: [.82, 1.02], sunC: '#FFB37A', ground: ['#2E3B5E', '#1E2846'], stars: .7, moon: [.2, .25, .5] },
    dhuhr:   { sky: ['#3FA3F0', '#7CC6F7', '#C9ECFF', '#EAF8FF'], sun: [.5, .16], sunC: '#FFE15C', ground: ['#E8C98C', '#D2AE6C'], stars: 0, clouds: 1 },
    asr:     { sky: ['#5EA9E6', '#A6D3F0', '#FBE3A9', '#FFE9B8'], sun: [.24, .38], sunC: '#FFC84A', ground: ['#D9B278', '#C49A5E'], stars: 0, clouds: .6 },
    maghrib: { sky: ['#4B3A8C', '#C2588A', '#FF8A5C', '#FFC46B'], sun: [.18, .8], sunC: '#FF6F3C', ground: ['#5A3C4E', '#3E2838'], stars: .15 },
    isha:    { sky: ['#0B1230', '#18235A', '#2B3A7A', '#3B4A8C'], sun: null, ground: ['#1A2142', '#10162E'], stars: 1, moon: [.76, .2, 1] }
  };
  function skyScene(c, W, H, id, T) {
    const S = SKY[id], gy = H * .74;
    c.fillStyle = grad(c, 0, 0, 0, gy, S.sky); c.fillRect(0, 0, W, gy + 2);
    if (S.stars) for (let i = 0; i < 26; i++) {
      const x = ((i * 97) % 100) / 100 * W, y = ((i * 41) % 100) / 100 * gy * .7, a = S.stars * (.4 + .6 * Math.abs(Math.sin(T * 1.5 + i)));
      c.fillStyle = `rgba(255,248,210,${a})`; star5(c, x, y, 1.5 + (i % 3), i); c.fill();
    }
    if (S.moon) { const [mx, my, a] = S.moon; c.save(); c.globalAlpha = a; c.shadowColor = '#FFF3B0'; c.shadowBlur = 20; c.fillStyle = '#FFF1B8'; c.beginPath(); c.arc(W * mx, H * my, H * .07, 0, TAU); c.fill(); c.restore(); c.fillStyle = S.sky[0]; c.globalAlpha = a; c.beginPath(); c.arc(W * mx + H * .035, H * my - H * .02, H * .065, 0, TAU); c.fill(); c.globalAlpha = 1; }
    if (S.sun) {
      const [sx, sy] = S.sun, X = W * sx, Y = H * sy, R = H * .085;
      const g = c.createRadialGradient(X, Y, R * .3, X, Y, R * 3.2); g.addColorStop(0, S.sunC + 'AA'); g.addColorStop(1, S.sunC + '00'); c.fillStyle = g; c.beginPath(); c.arc(X, Y, R * 3.2, 0, TAU); c.fill();
      if (id === 'dhuhr') { c.save(); c.translate(X, Y); c.rotate(T * .2); c.strokeStyle = 'rgba(255,230,120,.7)'; c.lineWidth = 3; c.lineCap = 'round'; for (let k = 0; k < 12; k++) { c.rotate(TAU / 12); c.beginPath(); c.moveTo(R * 1.25, 0); c.lineTo(R * 1.6, 0); c.stroke(); } c.restore(); }
      c.fillStyle = rgrad(c, X, Y, R, ['#FFF7CF', S.sunC, S.sunC]); c.beginPath(); c.arc(X, Y, R, 0, TAU); c.fill();
    }
    if (S.clouds) { c.globalAlpha = S.clouds; puff(c, W * .2 + Math.sin(T * .2) * 8, H * .2, H * .05); puff(c, W * .78 + Math.sin(T * .25 + 1) * 8, H * .32, H * .04); c.globalAlpha = 1; }
    // مسجد ونخيل كظلال
    const sil = id === 'dhuhr' || id === 'asr' ? ['#F6E7C8', '#E2C99A'] : null;
    const mc = sil ? grad(c, 0, gy - H * .3, 0, gy, sil) : (id === 'isha' ? '#141B3D' : id === 'fajr' ? '#26305C' : '#4A2F45');
    mosque(c, W * .5, gy, H * .3, mc, id, T);
    palm(c, W * .1, gy, H * .26, sil ? '#5C8A3A' : mc); palm(c, W * .9, gy, H * .22, sil ? '#5C8A3A' : mc);
    c.fillStyle = grad(c, 0, gy, 0, H, S.ground); c.fillRect(0, gy, W, H - gy);
    if (sil) { c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(0, gy, W, 3); }
    // ظل المسجد يتغير مع الشمس
    if (id === 'asr' || id === 'dhuhr') { c.fillStyle = 'rgba(80,50,20,.18)'; c.beginPath(); const L = id === 'asr' ? H * .3 : H * .06; c.ellipse(W * .5 + L * .7, gy + 8, H * .2 + L, 7, 0, 0, TAU); c.fill(); }
  }
  function puff(c, x, y, s) {
    const B = [[-1, .2, .55], [-.4, -.2, .75], [.3, -.25, .7], [.9, .15, .55], [0, .25, .6]];
    c.fillStyle = '#fff'; c.beginPath(); for (const [a, b, r] of B) { c.moveTo(x + a * s + r * s, y + b * s); c.arc(x + a * s, y + b * s, r * s, 0, TAU); } c.fill();
  }
  function mosque(c, x, gy, h, col, id, T) {
    c.fillStyle = col;
    const w = h * 1.1;
    rr(c, x - w / 2, gy - h * .45, w, h * .45 + 2, 4); c.fill();
    c.beginPath(); c.ellipse(x, gy - h * .45, w * .3, h * .38, 0, Math.PI, TAU); c.fill(); // القبة
    c.fillRect(x - 1.5, gy - h * .93, 3, h * .12);
    c.beginPath(); c.arc(x + 3, gy - h * .97, h * .04, Math.PI * .6, Math.PI * 1.6); c.arc(x + 5, gy - h * .975, h * .032, Math.PI * 1.5, Math.PI * .65, true); c.fill();
    for (const s of [-1, 1]) { // المئذنتان
      const mx = x + s * w * .62; rr(c, mx - h * .06, gy - h * .95, h * .12, h * .95, 3); c.fill();
      c.beginPath(); c.moveTo(mx - h * .08, gy - h * .95); c.lineTo(mx, gy - h * 1.12); c.lineTo(mx + h * .08, gy - h * .95); c.fill();
      rr(c, mx - h * .09, gy - h * .7, h * .18, h * .04, 2); c.fill();
    }
    // نوافذ مضيئة
    const lit = id === 'isha' || id === 'fajr' || id === 'maghrib';
    c.fillStyle = lit ? `rgba(255,214,110,${.75 + .2 * Math.sin(T * 2)})` : 'rgba(120,90,50,.35)';
    for (let k = -2; k <= 2; k++) { const wx = x + k * w * .17; c.beginPath(); c.moveTo(wx - h * .035, gy - h * .08); c.lineTo(wx - h * .035, gy - h * .25); c.arc(wx, gy - h * .25, h * .035, Math.PI, TAU); c.lineTo(wx + h * .035, gy - h * .08); c.fill(); }
  }
  function palm(c, x, gy, h, col) {
    c.strokeStyle = col; c.lineWidth = h * .07; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x, gy); c.quadraticCurveTo(x + h * .1, gy - h * .5, x + h * .04, gy - h); c.stroke();
    c.fillStyle = col;
    for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * .55; c.save(); c.translate(x + h * .04, gy - h); c.rotate(a); c.beginPath(); c.ellipse(h * .25, 0, h * .28, h * .06, .25, 0, TAU); c.fill(); c.restore(); }
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #wudu{background:linear-gradient(#E4F5FB,#FFF9EC);overflow:hidden;color:#1F4250}
  #wudu::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 12% 18%,rgba(255,255,255,.85),transparent 40%),radial-gradient(circle at 88% 82%,rgba(255,224,150,.35),transparent 45%);pointer-events:none}
  #wudu .ib{color:#1F86B5}
  #wudu .lang{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 rgba(20,80,110,.16),0 8px 16px rgba(20,80,110,.12)}
  #wudu .lang button{min-width:64px;padding:6px 12px;border-radius:99px;font-weight:900;font-size:17px;background:#EDF7FB;color:#25779C;line-height:1.25}
  #wudu .lang button[data-l=en]{font-family:${EN_FONT};font-size:16px}
  #wudu .lang button.on{background:linear-gradient(#4CC3EE,#1F94C8);color:#fff;box-shadow:0 3px 0 #156E97}
  #wudu .prog{position:absolute;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 58px);display:flex;gap:5px;padding:6px 10px;background:rgba(255,255,255,.92);border-radius:99px;z-index:4;box-shadow:0 3px 0 rgba(0,0,0,.06),0 6px 14px rgba(0,0,0,.06);max-width:calc(100% - 24px)}
  #wudu .prog i{width:22px;height:11px;border-radius:6px;background:#E1EBEF;box-shadow:inset 0 2px 0 rgba(0,0,0,.07);flex:0 1 22px}
  #wudu .prog i.on{background:linear-gradient(#FFD36B,#F2A20F);box-shadow:0 2px 0 #C67F00;animation:wuPop .45s cubic-bezier(.3,1.8,.5,1)}
  #wudu .prog i.cur{background:linear-gradient(#8FDCF7,#3BB2E0);box-shadow:0 2px 0 #1F86B5}
  #wudu .prog i.no{background:linear-gradient(#FFB4A8,#F27A68);box-shadow:0 2px 0 #C2503F}
  @keyframes wuPop{40%{transform:scale(1.5,1.3)}}
  #wudu .main{position:absolute;left:0;right:0;bottom:0;top:calc(max(10px,env(safe-area-inset-top)) + 90px);display:flex;flex-direction:column;align-items:center;gap:10px;padding:0 14px max(14px,env(safe-area-inset-bottom));overflow-y:auto;touch-action:pan-y}
  #wudu .main>:first-child{margin-top:auto}#wudu .main>:last-child{margin-bottom:auto}
  #wudu .stage{width:min(100%,520px);flex:none;display:flex;flex-direction:column;align-items:center;gap:8px}
  #wudu .scard{position:relative;width:100%;aspect-ratio:4/3;border-radius:30px;background:#fff;padding:7px;box-shadow:0 7px 0 #A8D8E8,0 14px 28px rgba(20,80,110,.18);border:4px solid #D3EEF7}
  #wudu .scard.sq{aspect-ratio:1/1}
  #wudu .scard.wide{aspect-ratio:16/9}
  #wudu .scard canvas{width:100%;height:100%;display:block;border-radius:22px;touch-action:none}
  #wudu .side{width:min(100%,520px);display:flex;flex-direction:column;gap:9px;align-items:stretch}
  #wudu .hidden{display:none!important}
  #wudu .lbox{position:relative;background:linear-gradient(#FFFFFF,#F5FCFF);border-radius:26px;border:4px solid #CFEAF4;box-shadow:0 6px 0 #9FD3E6,0 12px 22px rgba(20,80,110,.12);padding:10px 14px 12px;text-align:center}
  #wudu .lbox .st{display:flex;align-items:center;justify-content:center;gap:8px;font-size:clamp(21px,6vw,29px);font-weight:900;color:#17627F;line-height:1.35}
  #wudu .lbox .st .n{flex:none;width:34px;height:34px;border-radius:50%;background:linear-gradient(#FFE08A,#F6B92B);color:#6B4300;font-size:17px;display:grid;place-items:center;box-shadow:0 3px 0 #C98A0B}
  #wudu .lbox .st .ic{font-family:${EMOJI_FONT};font-size:28px}
  #wudu .lbox.en .st,#wudu .lbox.en .sub{direction:ltr;font-family:${EN_FONT}}
  #wudu .lbox .say{font-size:clamp(19px,5.4vw,25px);font-weight:900;color:#4A3B1C;line-height:1.75;margin-top:4px;direction:rtl}
  #wudu .lbox .say span{transition:color .25s,text-shadow .25s}
  #wudu .lbox .say span.on{color:#0E86B5;text-shadow:0 0 14px rgba(80,200,255,.55)}
  #wudu .lbox .sub{font-size:15px;font-weight:700;color:#5C7A86;line-height:1.35;margin-top:2px}
  #wudu .lbox .sub:empty,#wudu .lbox .say:empty{display:none}
  #wudu .lbox .cnt{display:flex;gap:8px;justify-content:center;margin-top:6px}
  #wudu .lbox .cnt:empty{display:none}
  #wudu .lbox .cnt b{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#EAF6FB;color:#9DBFCC;font-size:18px;border:3px solid #D5EDF6;transition:all .25s}
  #wudu .lbox .cnt b.on{background:linear-gradient(#7FD6F7,#2FA6DA);color:#fff;border-color:#BDEBFB;transform:scale(1.12);box-shadow:0 3px 0 #1C7BA6}
  #wudu .lbox .cnt em{font-style:normal;font-weight:900;color:#2E7FA0;align-self:center;font-size:16px;padding:0 4px}
  #wudu .nav{display:flex;gap:10px;justify-content:center;align-items:center}
  #wudu .nb{height:52px;border-radius:26px;font-size:18px;font-weight:900;padding:0 18px;background:#fff;color:#1F86B5;box-shadow:0 4px 0 #BFDDE9;border:3px solid #DDF0F7;display:flex;align-items:center;gap:6px;white-space:nowrap}
  #wudu .nb:active{transform:translateY(3px);box-shadow:0 1px 0 #BFDDE9}
  #wudu .nb.go{background:linear-gradient(#4CC3EE,#1F94C8);color:#fff;box-shadow:0 4px 0 #156E97;border-color:#A6E3F8;flex:1;justify-content:center;max-width:260px}
  #wudu .nb.go.glow{animation:wuGlow .9s ease-in-out infinite alternate}
  @keyframes wuGlow{to{transform:scale(1.04);box-shadow:0 4px 0 #156E97,0 0 22px rgba(60,190,240,.7)}}
  #wudu .nb.play{width:52px;padding:0;justify-content:center;font-size:22px}
  #wudu .ask{display:flex;align-items:center;justify-content:center;gap:10px;background:#fff;border-radius:24px;border:4px solid #CFEAF4;box-shadow:0 6px 0 #9FD3E6;padding:8px 12px;min-height:66px}
  #wudu .ask .sayb{width:48px;height:48px;flex:0 0 48px;font-size:22px}
  #wudu .ask .at{flex:1;text-align:center;font-weight:900;font-size:clamp(19px,5.4vw,25px);color:#17627F;line-height:1.35}
  #wudu .ask .at small{display:block;font-size:14px;color:#6A8B97;font-weight:800}
  #wudu .ask.en .at{direction:ltr;font-family:${EN_FONT}}
  #wudu .ask .ai{font-family:${EMOJI_FONT};font-size:34px;flex:none}
  #wudu .ask.shake{animation:wuShake .4s}
  @keyframes wuShake{20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
  /* الترتيب */
  #wudu .ord{display:flex;flex-direction:column;gap:8px}
  #wudu .slots,#wudu .tray{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
  #wudu .slots.c2{grid-template-columns:repeat(2,1fr)}
  #wudu .tray{min-height:40px;padding:8px;border-radius:22px;background:rgba(255,255,255,.55);border:3px dashed #BFE0EC}
  #wudu .slot{position:relative;min-height:72px;border-radius:18px;background:rgba(255,255,255,.7);border:3px dashed #A9D6E6;display:grid;place-items:center}
  #wudu .slot>.sn{position:absolute;top:-8px;right:-6px;width:24px;height:24px;border-radius:50%;background:linear-gradient(#FFE08A,#F6B92B);color:#6B4300;font-weight:900;font-size:13px;display:grid;place-items:center;box-shadow:0 2px 0 #C98A0B;z-index:2}
  #wudu .ord.en .slot>.sn{right:auto;left:-6px}
  #wudu .slot.next{border-color:#3BB2E0;background:rgba(220,244,252,.9);animation:wuSlot 1.1s ease-in-out infinite alternate}
  @keyframes wuSlot{to{box-shadow:0 0 0 4px rgba(59,178,224,.25)}}
  #wudu .slot.hot{background:#D7F3FF;border-style:solid}
  #wudu .wc{position:relative;width:100%;min-height:72px;border-radius:18px;background:#fff;border:3px solid #CFE6EF;box-shadow:0 4px 0 #B5D6E3;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px 3px;gap:1px;cursor:grab;user-select:none;-webkit-user-select:none;touch-action:none;color:#1F5469}
  #wudu .wc .ci{font-family:${EMOJI_FONT};font-size:24px;line-height:1.1}
  #wudu .wc canvas{width:56px;height:38px}
  #wudu .wc .cl{font-size:12.5px;font-weight:900;line-height:1.2;text-align:center}
  #wudu .ord.en .wc .cl{font-family:${EN_FONT};font-size:11.5px}
  #wudu .wc.drag{position:fixed;z-index:50;pointer-events:none;box-shadow:0 12px 24px rgba(20,80,110,.3);border-color:#3BB2E0}
  #wudu .wc.ghost{opacity:.25}
  #wudu .wc.done{background:linear-gradient(#F0FFF6,#DDF8E8);border-color:#7ED9A4;box-shadow:0 4px 0 #5DBF86;cursor:default}
  #wudu .wc.bad{animation:wuShake .4s;border-color:#F28B7B}
  /* أوقات الصلاة */
  #wudu .choices{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}
  #wudu .tc{background:#fff;border-radius:20px;border:3px solid #DCEBF0;box-shadow:0 5px 0 #C2DCE6;padding:10px 4px;font-weight:900;font-size:clamp(19px,5.3vw,24px);color:#1E4E62;min-height:62px}
  #wudu .tc.en{font-family:${EN_FONT};font-size:18px}
  #wudu .tc:active{transform:translateY(3px);box-shadow:0 2px 0 #C2DCE6}
  #wudu .tc.ok{background:#E3F9EA;border-color:#4CC37A;box-shadow:0 5px 0 #34A35F}
  #wudu .tc.no{background:#FFEDEA;border-color:#F28B7B;box-shadow:0 5px 0 #D9675A;opacity:.6;animation:wuShake .4s}
  #wudu .tc.dim{opacity:.45}
  #wudu .rk{display:flex;gap:6px;justify-content:center;margin-top:6px;align-items:center;font-weight:900;color:#7A5A18;font-size:15px}
  #wudu .rk i{width:16px;height:16px;border-radius:50%;background:linear-gradient(#FFE08A,#F2A20F);box-shadow:0 2px 0 #C67F00}
  /* اللوحات */
  #wudu .overlay{background:radial-gradient(circle at 50% 45%,rgba(20,70,100,.25),rgba(10,40,60,.5))}
  #wudu .panel{border:5px solid #D3EEF7;box-shadow:0 8px 0 #9FD3E6,0 20px 40px rgba(10,50,80,.3);color:#1F4250}
  #wudu .panel h3{color:#1A7FAE;text-shadow:0 3px 0 #D8F0F9}
  #wudu .btn{background:linear-gradient(#4CC3EE,#1F94C8);box-shadow:0 5px 0 #156E97,0 8px 12px rgba(20,120,170,.25)}
  #wudu .btn:active{box-shadow:0 1px 0 #156E97}
  #wudu .btn.alt{background:#fff;color:#1F86B5;box-shadow:0 5px 0 #BFDDE9;border:3px solid #DDF0F7}
  #wudu .lvp{width:min(94vw,460px);max-height:88vh;overflow-y:auto;touch-action:pan-y}
  #wudu .lvh{font-weight:900;color:#2E7FA0;margin:10px 0 4px;font-size:16px;text-align:right}
  #wudu .lvg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:4px 0 10px}
  #wudu .lvb{position:relative;border-radius:20px;background:#fff;border:3px solid #D3EEF7;box-shadow:0 5px 0 #A8D8E8;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#1A6A8C;font-weight:900;padding:8px 4px 6px;gap:1px}
  #wudu .lvb:active{transform:translateY(3px)}
  #wudu .lvb .e{font-size:30px;line-height:1.2;font-family:${EMOJI_FONT}}
  #wudu .lvb .t{font-size:13px;line-height:1.2}
  #wudu .lvb .s{font-size:11px;letter-spacing:-1px;height:12px;line-height:1}
  #wudu .lvb .s i{font-style:normal}#wudu .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #wudu .lvb.cur{outline:3px solid #F2A20F;outline-offset:2px}
  #wudu .lvb.pr{border-color:#F3E2BC;box-shadow:0 5px 0 #E3C98E;color:#8A5A12}
  @media (orientation:landscape) and (min-width:700px){
    #wudu .main{flex-direction:row;justify-content:center;align-items:center;gap:26px;padding-top:4px}
    #wudu .stage{width:min(46vw,calc((100vh - 140px) * 1.33),560px)}
    #wudu .scard.sq~*,#wudu .stage.sqs{width:min(44vw,calc(100vh - 140px),560px)}
    #wudu .side{width:min(44vw,480px)}
    #wudu .main>*{margin-top:auto!important;margin-bottom:auto!important}
  }
  `);
  const root = App.section(ID, `
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🔢</button>
      <span class="grow"></span>
      <div class="lang"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="prog"></div>
    <div class="main">
      <div class="stage"><div class="scard sq"><canvas></canvas></div></div>
      <div class="side">
        <div class="learn">
          <div class="lbox"><div class="st"><span class="n"></span><span class="ic"></span><span class="tt"></span></div><div class="say"></div><div class="sub"></div><div class="cnt"></div></div>
          <div class="nav" style="margin-top:12px">
            <button class="nb prev" aria-label="السابق">▶</button>
            <button class="ib snd nb play" aria-label="اسمع">🔊</button>
            <button class="nb go"></button>
          </div>
        </div>
        <div class="quiz hidden">
          <div class="ask"><button class="ib snd sayb" aria-label="اسمع">🔊</button><span class="at"></span><span class="ai"></span></div>
          <div class="choices hidden"></div>
        </div>
        <div class="ord hidden"><div class="slots"></div><div class="tray"></div></div>
      </div>
    </div>
    <div class="overlay" id="wuLv"><div class="panel lvp"><h3>🔢 المستويات</h3>
      <div class="lvh">💧 الوضوء</div><div class="lvg g1"></div>
      <div class="lvh">🕌 الصلاة</div><div class="lvg g2"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="wuWin"><div class="panel">
      <h3 class="wT"></h3><div class="wI" style="font-size:54px;line-height:1.1;font-family:${EMOJI_FONT}">🕌</div><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('.scard canvas'), scard = root.querySelector('.scard'), stageEl = root.querySelector('.stage');
  const progEl = root.querySelector('.prog');
  const learnEl = root.querySelector('.learn'), quizEl = root.querySelector('.quiz'), ordEl = root.querySelector('.ord');
  const lbox = root.querySelector('.lbox'), stN = lbox.querySelector('.n'), stIc = lbox.querySelector('.ic'), stT = lbox.querySelector('.tt');
  const sayEl = lbox.querySelector('.say'), subEl = lbox.querySelector('.sub'), cntEl = lbox.querySelector('.cnt');
  const goBtn = root.querySelector('.nb.go'), prevBtn = root.querySelector('.nb.prev');
  const askEl = root.querySelector('.ask'), askT = askEl.querySelector('.at'), askI = askEl.querySelector('.ai'), choicesEl = root.querySelector('.choices');
  const slotsEl = root.querySelector('.slots'), trayEl = root.querySelector('.tray');
  const lvOv = root.querySelector('#wuLv'), winOv = root.querySelector('#wuWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, def = LEVELS[0], mode = 'learn', over = false, mistakes = 0;
  let tasks = [], drops = [], sparks = [], pops = [], kara = null;
  let view = 'front';            // front | side | sky
  let li = 0, list = [], tries = 0, qs = [], qi = 0, answered = false, pstates = [];
  let sub = 'learn';             // للأوقات: learn | quiz
  // حالة الطفل من الأمام
  const kf = { hR: G.idle.R.slice(), hL: G.idle.L.slice(), tR: G.idle.R.slice(), tL: G.idle.L.slice(), eyes: null, mouth: 'smile', puff: 0, puffT: 0, liftR: 0, liftL: 0, liftRT: 0, liftLT: 0, finger: null, heart: 0, heartT: 0, glow: {}, glowT: {}, wet: {}, side: null, motion: null, lookUp: false, bubble: null };
  const ks = { pose: clonePose(POSES.stand), tgt: POSES.stand, turnT: 0 };
  let skyId = 'fajr', skyFade = 1, act = null; // act = الخطوة الجارية في المشهد
  function later(s, fn) { tasks.push({ t: s, fn }); }
  function clearTasks() { tasks = []; kara = null; }

  /* ---------- النطق ---------- */
  function say(ar, en) { if (lang === 'en' && en) App.speak(en, 'en'); else App.speak(plain(ar)); }
  const NUM_AR = ['', 'واحد', 'اثنان', 'ثلاثة'], NUM_EN = ['', 'one', 'two', 'three'];
  const sayNum = k => lang === 'en' ? App.speak(NUM_EN[k], 'en') : App.speak(NUM_AR[k]);
  const durAr = s => .8 + plain(s).split(/\s+/).length * .6;
  const durEn = s => .6 + s.split(/\s+/).length * .36;
  /* قراءة نص «ما يُقال» بالعربية مع تظليل الكلمات */
  function readSay(text, after) {
    const d = durAr(text); App.speak(plain(text));
    kara = { t: 0, d, n: text.split(' ').length };
    if (after) later(d + .4, after);
    return d;
  }
  function setSayHtml(text) { sayEl.innerHTML = text ? text.split(' ').map(w => `<span>${esc(w)}</span>`).join(' ') : ''; }

  /* ---------- التخطيط ---------- */
  function layout() { const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; }
  function setAspect(a) {
    scard.classList.toggle('sq', a === 'sq'); scard.classList.toggle('wide', a === 'wide');
    stageEl.classList.toggle('sqs', a === 'sq');
    requestAnimationFrame(() => layout());
  }
  function setProg(n, states, cur) {
    progEl.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    progEl.innerHTML = Array.from({ length: n }, (_, i) => `<i class="${states[i] || (i === cur ? 'cur' : '')}"></i>`).join('');
    progEl.style.display = n ? '' : 'none';
  }
  function showPanel(p) {
    learnEl.classList.toggle('hidden', p !== 'learn');
    quizEl.classList.toggle('hidden', p !== 'quiz');
    ordEl.classList.toggle('hidden', p !== 'ord');
  }

  /* =====================================================================
     تشغيل خطوة وضوء على الطفل (للتعلّم ولعرض الإجابة)
     ===================================================================== */
  function resetKid() {
    kf.tR = G.idle.R.slice(); kf.tL = G.idle.L.slice(); kf.eyes = null; kf.mouth = 'smile'; kf.puffT = 0; kf.liftRT = 0; kf.liftLT = 0;
    kf.finger = null; kf.heartT = 0; kf.glowT = {}; kf.side = null; kf.motion = null; kf.lookUp = false; kf.bubble = null;
  }
  /* يضبط وضع الطفل لخطوة ما. side: R|L للخطوات اليمنى/اليسرى */
  function poseStep(st, side) {
    resetKid(); act = st ? { id: st.id, side, t: 0 } : null;
    if (!st) return;
    const id = st.id;
    if (id === 'niyyah') { kf.tR = [-.3, -3.2]; kf.tL = [.35, -3.35]; kf.eyes = 'closed'; kf.heartT = 1; }
    else if (id === 'bism') { kf.tR = [-1.45, -2.75]; kf.tL = [1.45, -2.75]; kf.mouth = 'open'; kf.bubble = { ar: 'بِسْمِ اللَّهِ', t: 0 }; }
    else if (id === 'hands') { kf.motion = 'rub'; kf.glowT.hands = 1; }
    else if (id === 'mouth') { kf.motion = 'mouth'; kf.glowT.mouth = 1; kf.mouth = 'puff'; kf.puffT = 1; }
    else if (id === 'nose') { kf.motion = 'nose'; kf.glowT.nose = 1; }
    else if (id === 'face') { kf.motion = 'face'; kf.glowT.face = 1; kf.eyes = 'closed'; }
    else if (id === 'arms') { kf.motion = side === 'L' ? 'armL' : 'armR'; kf.glowT.arms = 1; kf.side = side || 'R'; }
    else if (id === 'head') { kf.motion = 'head'; kf.glowT.head = 1; kf.eyes = 'happy'; }
    else if (id === 'ears') { kf.motion = 'ears'; kf.glowT.ears = 1; }
    else if (id === 'feet') { kf.side = side || 'R'; kf.glowT.feet = 1; if (kf.side === 'R') kf.liftRT = 1; else kf.liftLT = 1; kf.tR = [-1.5, -2.6]; kf.tL = [1.5, -2.6]; }
    else if (id === 'shahada') { kf.finger = 'R'; kf.tR = [-.85, -4.35]; kf.tL = [1.75, -2.0]; kf.lookUp = true; kf.mouth = 'open'; }
  }
  /* نقطة صب الماء للخطوة الحالية (بوحدات الطفل) */
  function pourPoint() {
    if (!act) return null;
    const id = act.id, sd = kf.side === 'L' ? 1 : -1;
    if (id === 'hands') return [0, -2.55];
    if (id === 'mouth' || id === 'nose') return [kf.hR[0], kf.hR[1] - .1];
    if (id === 'face') return [0, -5.6];
    if (id === 'arms') { const a = ik(kf.side || 'R', ...(kf.side === 'L' ? kf.hL : kf.hR)); return [lerp(a.ex, a.hx, .5), Math.min(a.ey, a.hy) - .2]; }
    if (id === 'feet') return [sd * .7, -.6 - (kf.side === 'L' ? kf.liftL : kf.liftR) * .55];
    return null;
  }
  function kidGeom() { const u = Math.min(H / 7.9, W / 6.2); return { x: W / 2, y: H * .935, u }; }
  function pour(n = 18) {
    const p = pourPoint(); if (!p) return;
    const g = kidGeom(), X = g.x + p[0] * g.u, Y = g.y + p[1] * g.u;
    const sx = X + g.u * 1.7, sy = Y - g.u * 2.1;
    for (let i = 0; i < n; i++) { const ft = rand(.3, .42), tx = X + rand(-g.u * .3, g.u * .3), ty = Y + rand(-g.u * .15, g.u * .2); drops.push({ x: sx + rand(-2, 2), y: sy, vx: (tx - sx) / ft, vy: (ty - sy - 450 * ft * ft) / ft, ty, r: rand(2.2, 4.2) * g.u / 45, life: 2, splashed: false, delay: i * .045 }); }
    Sound.noise(.5, 600, 2400, .05, 1.2); Sound.tone(rand(900, 1300), .12, 'sine', .05, 400);
    // لمعان مبلل يبقى قليلًا
    const part = act.id; kf.wet[part] = 1; if (part === 'arms' || part === 'feet') kf.wet.side = kf.side;
  }
  function popCount(k) {
    const p = pourPoint() || [0, -4]; const g = kidGeom();
    pops.push({ x: clamp(g.x + p[0] * g.u + (p[0] <= 0 ? -g.u * 1.9 : g.u * 1.9), g.u, W - g.u), y: g.y + p[1] * g.u - g.u * .3, txt: num(k), t: 0 });
    cntEl.querySelectorAll('b').forEach((b, i) => b.classList.toggle('on', i < k));
  }
  function sparkleAt(x, y, n = 18, cols = ['#FFE07A', '#8FE3FF', '#fff', '#A8F0C6']) {
    for (let i = 0; i < n; i++) { const a = Math.random() * TAU, v = 50 + Math.random() * 140; sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, life: .8 + Math.random() * .5, age: 0, s: 3 + Math.random() * 4, c: cols[i % cols.length] }); }
  }

  /* =====================================================================
     وضع التعلّم (وضوء / صلاة / أوقات)
     ===================================================================== */
  function learnList() { return def.k === 'learnW' ? WUDU : def.k === 'learnP' ? PRAYER : TIMES; }
  function startLearn() {
    list = learnList(); li = 0; mode = 'learn'; showPanel('learn');
    view = def.k === 'learnW' ? 'front' : def.k === 'learnP' ? 'side' : 'sky';
    setAspect(view === 'sky' ? '' : 'sq');
    showLearn();
  }
  function showLearn() {
    clearTasks(); const st = list[li], en = lang === 'en';
    lbox.classList.toggle('en', en);
    stN.textContent = num(li + 1); stIc.textContent = st.ic || '';
    stIc.style.display = st.ic ? '' : 'none';
    stT.textContent = en ? st.en : st.ar;
    cntEl.innerHTML = ''; subEl.textContent = ''; setSayHtml('');
    setProg(list.length, list.map((_, i) => i < li ? 'on' : ''), li);
    prevBtn.style.visibility = li > 0 ? '' : 'hidden';
    const lastOne = li >= list.length - 1;
    goBtn.textContent = lastOne ? (def.k === 'times' ? 'هيا نختبر! ◀' : 'إنهاء ✓') : 'التالي ◀';
    goBtn.classList.remove('glow');
    if (view === 'front') runWudu(st);
    else if (view === 'side') runPrayer(st);
    else runTime(st);
  }
  function runWudu(st) {
    poseStep(st, st.lr ? 'R' : null); kf.wet = {};
    const en = lang === 'en';
    if (st.d) subEl.textContent = en ? st.de : st.d;
    if (st.say) { setSayHtml(st.say); if (en) subEl.textContent = st.sen; }
    if (st.n) {
      const lab = st.n === 1 ? (en ? 'once' : 'مَرَّةً وَاحِدَةً') : (en ? `${st.n} times` : 'ثَلَاثَ مَرَّاتٍ');
      const dots = Array.from({ length: st.n }, (_, i) => `<b>${num(i + 1)}</b>`).join('');
      cntEl.innerHTML = (st.lr ? `<em class="sd">${en ? 'Right' : 'اليُمْنَى'}</em>` : '') + dots + (st.n === 1 ? `<em>${lab}</em>` : '');
    }
    say(st.ar, st.en);
    let t = (en ? durEn(st.en) : durAr(st.ar)) + .3;
    if (st.id === 'niyyah') { later(t, () => say(st.d, st.de)); t += 3; }
    else if (st.say) { later(t, () => { readSay(st.say); if (en) later(durAr(st.say) + .3, () => App.speak(st.sen, 'en')); }); t += durAr(st.say) + (en ? durEn(st.sen) + .4 : 0) + .4; }
    if (st.n && !st.wipe) {
      const sides = st.lr ? ['R', 'L'] : [null];
      sides.forEach((sd, si) => {
        if (st.lr) {
          later(t, () => {
            poseStep(st, sd); const lab = cntEl.querySelector('.sd'); if (lab) lab.textContent = sd === 'R' ? (en ? 'Right' : 'اليُمْنَى') : (en ? 'Left' : 'اليُسْرَى');
            cntEl.querySelectorAll('b').forEach(b => b.classList.remove('on'));
            say(sd === 'R' ? 'اليمنى' : 'اليسرى', sd === 'R' ? 'Right' : 'Left');
          });
          t += 1.3;
        }
        for (let k = 1; k <= st.n; k++) { later(t, () => { pour(); popCount(k); sayNum(k); }); t += 1.35; }
      });
    } else if (st.wipe) {
      later(t, () => { kf.wet[st.id] = 1; popCount(1); Sound.tone(700, .3, 'sine', .06, 300); sayNum(1); }); t += 2.2;
    }
    later(t + .2, () => { goBtn.classList.add('glow'); if (st.part) sparkleAt(...partPx(st.part)); Sound.star(); });
  }
  function runPrayer(st) {
    ks.tgt = POSES[st.pose]; ks.turnT = 0;
    const en = lang === 'en';
    setSayHtml(st.say); subEl.textContent = en ? st.sen : '';
    say(st.ar, st.en);
    let t = (en ? durEn(st.en) : durAr(st.ar)) + .4;
    if (st.id === 'salam') {
      later(t, () => { ks.turnT = 1; readSay(st.say); });
      t += durAr(st.say) + .5;
      later(t, () => { ks.turnT = -1; readSay(st.say); });
      t += durAr(st.say) + .4;
      later(t, () => { ks.turnT = 0; });
    } else { later(t, () => readSay(st.say)); t += durAr(st.say) + .4; }
    if (en) { later(t, () => App.speak(st.sen, 'en')); t += durEn(st.sen) + .3; }
    later(t, () => { goBtn.classList.add('glow'); Sound.tone(660, .5, 'sine', .06); Sound.tone(990, .6, 'sine', .04, 0, .12); });
  }
  function runTime(st) {
    skyId = st.id; skyFade = 0;
    const en = lang === 'en';
    setSayHtml(''); subEl.textContent = en ? st.te : st.t;
    cntEl.innerHTML = Array.from({ length: st.rk }, () => '<i></i>').join('');
    cntEl.className = 'cnt rk'; cntEl.insertAdjacentHTML('beforeend', `<span>${en ? st.rke : st.rka}</span>`);
    say(st.ar, st.en);
    later((en ? durEn(st.en) : durAr(st.ar)) + .3, () => say(st.t, st.te));
    later(4.5, () => goBtn.classList.add('glow'));
  }
  goBtn.addEventListener('click', () => {
    Sound.tap(); cntEl.className = 'cnt';
    if (li < list.length - 1) { li++; showLearn(); return; }
    if (def.k === 'times') { startTimesQuiz(); return; }
    clearTasks(); win(3);
  });
  prevBtn.addEventListener('click', () => { if (li > 0) { Sound.tap(); cntEl.className = 'cnt'; li--; showLearn(); } });
  root.querySelector('.nb.play').addEventListener('click', () => { cntEl.className = 'cnt'; showLearn(); });

  /* =====================================================================
     المس العضو (أين نغسل؟ / ماذا بعد؟)
     ===================================================================== */
  const TAP_STEPS = WUDU.filter(s => s.part);
  function startTap() {
    mode = 'tap'; view = 'front'; showPanel('quiz'); choicesEl.classList.add('hidden'); setAspect('sq');
    qs = def.k === 'next' ? TAP_STEPS.slice() : shuffle(TAP_STEPS.slice()); qi = 0; pstates = []; mistakes = 0;
    resetKid(); kf.wet = {}; act = null;
    later(.4, askTap);
  }
  function askTap() {
    if (qi >= qs.length) { win(); return; }
    answered = false; tries = 0; resetKid(); act = null;
    if (def.k === 'tap') kf.wet = {};
    setProg(qs.length, pstates, qi);
    const st = qs[qi], en = lang === 'en';
    askEl.classList.toggle('en', en);
    if (def.k === 'tap') {
      askI.textContent = st.ic;
      askT.innerHTML = `${esc(en ? st.en : st.ar)}<small>${en ? 'Where? Tap the body' : App.g('المسي', 'المس') + ' المكان على الجسم'}</small>`;
      say(st.ar, st.en);
      later((en ? durEn(st.en) : durAr(st.ar)) + .2, () => say(st.wipe ? 'أين نمسح؟' : 'أين نغسل؟', st.wipe ? 'Where do we wipe?' : 'Where do we wash?'));
    } else {
      askI.textContent = '🤔';
      const q = qi === 0 ? (en ? 'What do we wash first?' : 'ماذا نغسل أوّلًا؟') : (en ? 'What comes next?' : 'وماذا بعد ذلك؟');
      askT.innerHTML = `${esc(q)}<small>${en ? 'Tap the body' : App.g('المسي', 'المس') + ' المكان على الجسم'}</small>`;
      say(q, q);
    }
  }
  /* مناطق الجسم بوحدات الطفل (الوضع الساكن) */
  function hitParts(px, py) {
    const g = kidGeom(), x = (px - g.x) / g.u, y = (py - g.y) / g.u, out = [];
    const inC = (cx, cy, r) => Math.hypot(x - cx, y - cy) < r;
    const inE = (cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1;
    if (inC(0, G.nose[1], .34)) out.push('nose');
    if (inE(0, G.mouth[1], .45, .3)) out.push('mouth');
    if (inC(-G.ear[0] - .05, G.ear[1], .5) || inC(G.ear[0] + .05, G.ear[1], .5)) out.push('ears');
    if (inE(0, -5.15, 1.05, .95)) out.push('face');
    if (inC(0, -5.5, 1.45) && y < -5.8) out.push('head');
    for (const sd of ['R', 'L']) {
      const a = ik(sd, ...G.idle[sd]);
      if (inC(a.hx, a.hy, .55)) out.push('hands');
      const dx = a.hx - a.ex, dy = a.hy - a.ey, L2 = dx * dx + dy * dy, t = clamp(((x - a.ex) * dx + (y - a.ey) * dy) / L2, 0, 1);
      if (Math.hypot(x - (a.ex + dx * t), y - (a.ey + dy * t)) < .45) out.push('arms');
      if (inE(G.foot[sd][0] + (sd === 'R' ? -.1 : .1), G.foot[sd][1] - .1, .8, .55)) out.push('feet');
    }
    return out;
  }
  function partPx(part) {
    const g = kidGeom(), a = ik('R', ...G.idle.R), P = { hands: [a.hx, a.hy], mouth: G.mouth, nose: G.nose, face: [.55, -4.9], arms: [lerp(a.ex, a.hx, .45), lerp(a.ey, a.hy, .45)], head: [.2, -6.45], ears: [-G.ear[0], G.ear[1]], feet: [G.foot.R[0], G.foot.R[1]] }[part] || [0, -3];
    return [g.x + P[0] * g.u, g.y + P[1] * g.u];
  }
  function tapAt(px, py) {
    if (mode !== 'tap' || answered || over || paused) return;
    const st = qs[qi], hit = hitParts(px, py);
    if (!hit.length) { Sound.tap(); sparkleAt(px, py, 5, ['#fff', '#BFEAFF']); return; }
    if (hit.includes(st.part)) {
      answered = true; clearTasks();
      pstates[qi] = tries ? 'no' : 'on'; setProg(qs.length, pstates, -1);
      Sound.star(); vibrate(20); sparkleAt(...partPx(st.part), 24);
      poseStep(st, st.lr ? 'R' : null);
      const en = lang === 'en';
      if (def.k === 'next') { askI.textContent = st.ic; askT.innerHTML = `${esc(en ? st.en : st.ar)}`; }
      say(st.ar, st.en);
      let t = .4;
      if (!st.wipe) { later(t, () => pour()); later(t + 1.1, () => pour(10)); }
      t = Math.max(2.4, (en ? durEn(st.en) : durAr(st.ar)) + .6);
      later(t, () => { qi++; askTap(); });
    } else {
      mistakes++; tries++; Sound.error(); vibrate(30);
      askEl.classList.remove('shake'); void askEl.offsetWidth; askEl.classList.add('shake');
      const g = kidGeom(); pops.push({ x: px, y: py - g.u * .4, txt: '✗', t: 0, bad: true });
      later(.25, () => lang === 'ar' ? App.speak(App.g('حاولي مرة أخرى.', 'حاول مرة أخرى.')) : App.speak('Try again!', 'en'));
      if (tries >= 2) { kf.glowT[st.part] = .8; later(1.6, () => { if (!answered) kf.glowT = {}; }); }
    }
  }
  let downAt = null;
  cv.addEventListener('pointerdown', e => {
    const r = cv.getBoundingClientRect(); downAt = [e.clientX - r.left, e.clientY - r.top];
    if (mode === 'tap') tapAt(...downAt);
    else if (view === 'front' && mode === 'learn') { const h = hitParts(...downAt); if (h.length) { sparkleAt(...downAt, 8); Sound.pop(); } }
  });

  /* =====================================================================
     ترتيب البطاقات بالسحب
     ===================================================================== */
  let ordList = [], ordNext = 0, drag = null;
  function startOrder() {
    mode = 'order'; showPanel('ord'); setAspect('wide');
    const src = def.k === 'orderW' ? WUDU : PRAYER;
    view = def.k === 'orderW' ? 'front' : 'side';
    ordList = src.slice(def.a, def.b); ordNext = 0; mistakes = 0; pstates = [];
    resetKid(); kf.wet = {}; act = null; ks.tgt = POSES.stand; ks.turnT = 0;
    buildOrder();
    const en = lang === 'en';
    later(.4, () => lang === 'en' ? App.speak('Put the steps in order', 'en') : App.speak(App.g('رتّبي الخطوات', 'رتّب الخطوات')));
    setProg(ordList.length, pstates, 0);
    void en;
  }
  function cardHTML(st, i) {
    const en = lang === 'en';
    const pic = def.k === 'orderP' ? `<canvas data-pose="${st.pose}"></canvas>` : `<span class="ci">${st.ic}</span>`;
    return `<div class="wc" data-i="${i}">${pic}<span class="cl">${esc(en ? st.en : plain(st.ar))}</span></div>`;
  }
  function buildOrder() {
    const en = lang === 'en';
    ordEl.classList.toggle('en', en);
    slotsEl.style.direction = trayEl.style.direction = en ? 'ltr' : 'rtl';
    slotsEl.innerHTML = ordList.map((_, i) => `<div class="slot${i === ordNext ? ' next' : ''}" data-s="${i}"><span class="sn">${num(i + 1)}</span>${i < ordNext ? cardHTML(ordList[i], i).replace('class="wc"', 'class="wc done"') : ''}</div>`).join('');
    const rest = shuffle(ordList.map((s, i) => i).filter(i => i >= ordNext));
    trayEl.innerHTML = rest.map(i => cardHTML(ordList[i], i)).join('');
    trayEl.style.display = rest.length ? '' : 'none';
    root.querySelectorAll('.ord canvas[data-pose]').forEach(drawPoseThumb);
    trayEl.querySelectorAll('.wc').forEach((el, k) => {
      if (window.gsap) gsap.from(el, { scale: .6, opacity: 0, duration: .35, delay: k * .04, ease: 'back.out(2)' });
      el.addEventListener('pointerdown', e => dragStart(e, el));
    });
  }
  function drawPoseThumb(cvs) {
    const f = fitCanvas(cvs), c = f.ctx; c.clearRect(0, 0, f.w, f.h);
    const p = clonePose(POSES[cvs.dataset.pose] || POSES.stand); if (cvs.dataset.pose === 'salam') p.turn = 1;
    const u = f.h / 7.2; mat(c, f.w * .5 - 1.7 * u, f.w * .5 + 3.6 * u, f.h * .9, u * .7);
    kidSide(c, f.w * .5 - .8 * u, f.h * .9, u, p, { calm: true });
  }
  function dragStart(e, el) {
    if (drag || over || paused) return;
    e.preventDefault();
    const r = el.getBoundingClientRect();
    const clone = el.cloneNode(true); clone.classList.add('drag');
    clone.style.width = r.width + 'px'; clone.style.left = r.left + 'px'; clone.style.top = r.top + 'px';
    const pc = clone.querySelector('canvas'); if (pc) { const oc = el.querySelector('canvas'); pc.width = oc.width; pc.height = oc.height; pc.getContext('2d').drawImage(oc, 0, 0); }
    root.appendChild(clone); el.classList.add('ghost');
    drag = { el, clone, sx: e.clientX, sy: e.clientY, ox: e.clientX - r.left, oy: e.clientY - r.top, moved: false, id: e.pointerId, r };
    Sound.tap(); if (window.gsap) gsap.to(clone, { scale: 1.08, rotation: -3, duration: .15 });
  }
  function slotAt(x, y) {
    let best = null;
    slotsEl.querySelectorAll('.slot').forEach(s => { const r = s.getBoundingClientRect(); if (x >= r.left - 6 && x <= r.right + 6 && y >= r.top - 6 && y <= r.bottom + 6) best = s; });
    return best;
  }
  window.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (Math.hypot(dx, dy) > 8) drag.moved = true;
    drag.clone.style.left = (e.clientX - drag.ox) + 'px'; drag.clone.style.top = (e.clientY - drag.oy) + 'px';
    const s = slotAt(e.clientX, e.clientY);
    slotsEl.querySelectorAll('.slot').forEach(x => x.classList.toggle('hot', x === s && +x.dataset.s >= ordNext));
  });
  const endDrag = e => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const d = drag; drag = null;
    slotsEl.querySelectorAll('.slot').forEach(x => x.classList.remove('hot'));
    const i = +d.el.dataset.i;
    let target = d.moved ? slotAt(e.clientX, e.clientY) : slotsEl.querySelector(`.slot[data-s="${ordNext}"]`);
    if (d.moved && !target) { flyBack(d); return; }
    const si = target ? +target.dataset.s : -1;
    if (si === ordNext && i === ordNext) place(d, target);
    else if (si >= 0 && si < ordNext) flyBack(d);
    else { // خطأ
      mistakes++; pstates[ordNext] = 'no'; Sound.error(); vibrate(30);
      flyBack(d, true);
      lang === 'ar' ? App.speak(App.g('حاولي مرة أخرى.', 'حاول مرة أخرى.')) : App.speak('Try again!', 'en');
    }
  };
  window.addEventListener('pointerup', endDrag); window.addEventListener('pointercancel', endDrag);
  function flyBack(d, bad) {
    const r = d.el.getBoundingClientRect();
    const fin = () => { d.clone.remove(); d.el.classList.remove('ghost'); if (bad) { d.el.classList.remove('bad'); void d.el.offsetWidth; d.el.classList.add('bad'); } };
    if (window.gsap) gsap.to(d.clone, { left: r.left, top: r.top, scale: 1, rotation: 0, duration: .3, ease: 'power2.out', onComplete: fin }); else fin();
  }
  function place(d, slot) {
    const r = slot.getBoundingClientRect(), st = ordList[ordNext];
    const fin = () => {
      d.clone.remove(); d.el.remove();
      slot.classList.remove('next'); slot.insertAdjacentHTML('beforeend', cardHTML(st, ordNext).replace('class="wc"', 'class="wc done"'));
      const pc = slot.querySelector('canvas[data-pose]'); if (pc) drawPoseThumb(pc);
      if (window.gsap) gsap.from(slot.querySelector('.wc'), { scale: 1.25, duration: .45, ease: 'elastic.out(1,.5)' });
      if (pstates[ordNext] !== 'no') pstates[ordNext] = 'on';
      ordNext++;
      const nx = slotsEl.querySelector(`.slot[data-s="${ordNext}"]`); if (nx) nx.classList.add('next');
      if (!trayEl.querySelector('.wc')) trayEl.style.display = 'none';
      setProg(ordList.length, pstates, ordNext);
      // المشهد يعرض الخطوة
      clearTasks();
      if (view === 'front') { poseStep(st, st.lr ? 'R' : null); if (st.n && !st.wipe) later(.2, () => pour()); }
      else { ks.tgt = POSES[st.pose]; ks.turnT = st.pose === 'salam' ? 1 : 0; }
      say(st.ar, st.en);
      Sound.star(); vibrate(15);
      if (ordNext >= ordList.length) later(1.8, () => win());
    };
    if (window.gsap) gsap.to(d.clone, { left: r.left + (r.width - d.r.width) / 2, top: r.top + (r.height - d.r.height) / 2, scale: 1, rotation: 0, duration: .25, ease: 'power2.out', onComplete: fin }); else fin();
  }

  /* =====================================================================
     أوقات الصلاة: تعلّم ثم اختبار
     ===================================================================== */
  function startTimes() { sub = 'learn'; startLearn(); }
  function startTimesQuiz() {
    clearTasks(); sub = 'quiz'; mode = 'times'; showPanel('quiz'); choicesEl.classList.remove('hidden');
    qs = shuffle(TIMES.slice()); qi = 0; pstates = []; mistakes = 0;
    later(.3, askTime);
  }
  function askTime() {
    if (qi >= qs.length) { win(); return; }
    answered = false; tries = 0;
    const st = qs[qi], en = lang === 'en';
    skyId = st.id; skyFade = 0;
    setProg(qs.length, pstates, qi);
    askEl.classList.toggle('en', en);
    askI.textContent = '🕌';
    askT.innerHTML = esc(en ? 'Which prayer is it?' : 'أيُّ صلاةٍ هذه؟');
    const opts = shuffle([st, ...shuffle(TIMES.filter(x => x !== st)).slice(0, 2)]);
    choicesEl.innerHTML = opts.map(x => `<button class="tc${en ? ' en' : ''}" data-id="${x.id}">${esc(en ? x.en : x.ar)}</button>`).join('');
    choicesEl.querySelectorAll('.tc').forEach((b, i) => {
      if (window.gsap) gsap.from(b, { y: 16, opacity: 0, duration: .35, delay: i * .08, ease: 'back.out(2)' });
      b.addEventListener('click', () => pickTime(b));
    });
    say('أيُّ صلاةٍ هذه؟', 'Which prayer is it?');
  }
  function pickTime(b) {
    if (answered || paused || b.classList.contains('no')) return;
    const st = qs[qi];
    if (b.dataset.id === st.id) {
      answered = true; b.classList.add('ok'); clearTasks();
      choicesEl.querySelectorAll('.tc').forEach(x => { if (x !== b) x.classList.add('dim'); });
      pstates[qi] = tries ? 'no' : 'on'; setProg(qs.length, pstates, -1);
      Sound.star(); vibrate(20); sparkleAt(W / 2, H * .4, 26);
      say(st.ar, st.en);
      later(1.2, () => say(st.t, st.te));
      later(1.2 + (lang === 'en' ? durEn(st.te) : durAr(st.t)) + .4, () => { qi++; askTime(); });
    } else {
      mistakes++; tries++; b.classList.add('no'); Sound.error(); vibrate(30);
      later(.25, () => lang === 'ar' ? App.speak(App.g('حاولي مرة أخرى.', 'حاول مرة أخرى.')) : App.speak('Try again!', 'en'));
    }
  }

  /* =====================================================================
     المستويات والفوز
     ===================================================================== */
  function startLevel(n) {
    lvl = clamp(n, 1, LEVELS.length); def = LEVELS[lvl - 1];
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    clearTasks(); over = false; mistakes = 0; drops = []; pops = []; cntEl.className = 'cnt';
    resetKid(); kf.wet = {}; act = null; ks.tgt = POSES.stand; ks.turnT = 0;
    if (def.k === 'learnW' || def.k === 'learnP') startLearn();
    else if (def.k === 'times') startTimes();
    else if (def.k === 'tap' || def.k === 'next') startTap();
    else startOrder();
    store.set('wuduLast', lvl);
    Sound.whoosh();
  }
  function win(force) {
    if (over) return;
    over = true; clearTasks();
    const pr = loadProg();
    const stars = force || (mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1);
    const prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    store.set('wuduProg', pr);
    Sound.win(); sparkleAt(W / 2, H * .4, 30); sparkleAt(W * .3, H * .3, 16); sparkleAt(W * .7, H * .3, 16);
    if (view === 'front') { resetKid(); kf.eyes = 'happy'; kf.mouth = 'open'; kf.tR = [-1.6, -5.6]; kf.tL = [1.6, -5.6]; }
    later(1, () => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = 'ما شاء الله! ' + App.g('أحسنتِ', 'أحسنتَ') + ' 🌟';
      root.querySelector('.wI').textContent = def.ic;
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      const done = { learnW: App.g('تعلّمتِ', 'تعلّمتَ') + ' خطوات الوضوء 💧', learnP: App.g('تعلّمتِ', 'تعلّمتَ') + ' خطوات الركعة 🕌', times: App.g('عرفتِ', 'عرفتَ') + ' أوقات الصلوات الخمس 🌅' }[def.k];
      root.querySelector('.wP').textContent = done || (App.g('أنهيتِ', 'أنهيتَ') + ` «${def.t}»` + (mistakes ? '' : ' دون أخطاء! 💯'));
      root.querySelector('[data-a="next"]').style.display = lvl < LEVELS.length ? '' : 'none';
      winOv.classList.add('on');
      lang === 'ar' ? App.speak(App.g('أحسنتِ!', 'أحسنتَ!')) : App.speak('Well done!', 'en');
      if (stars > prev) App.addStars(stars - prev + 1);
      App.achieve('wudu_first');
      if (def.k === 'learnW' || (def.k === 'orderW' && pr.stars[3] && pr.stars[4])) App.achieve('wudu_wudu');
      if (def.k === 'learnP' || (def.k === 'orderP' && pr.stars[7] && pr.stars[8])) App.achieve('wudu_prayer');
      if (def.k === 'times') App.achieve('wudu_times');
      if (LEVELS.every((_, i) => pr.stars[i + 1])) App.achieve('wudu_all');
    });
  }
  function openLevels() {
    const pr = loadProg();
    const btn = (L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, en = lang === 'en';
      return `<button class="lvb${n === lvl ? ' cur' : ''}${n > 5 ? ' pr' : ''}" data-l="${n}"><span class="e">${L.ic}</span><span class="t">${L.t}</span>
        <span class="s">${[1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    };
    root.querySelector('.lvg.g1').innerHTML = LEVELS.slice(0, 5).map((L, i) => btn(L, i)).join('');
    root.querySelector('.lvg.g2').innerHTML = LEVELS.slice(5).map((L, i) => btn(L, i + 5)).join('');
    root.querySelectorAll('#wuLv [data-l]').forEach(b => b.onclick = () => { Sound.tap(); startLevel(+b.dataset.l); });
    winOv.classList.remove('on'); lvOv.classList.add('on');
  }
  function actBtn(a) {
    Sound.tap();
    if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
    else if (a === 'close') { lvOv.classList.remove('on'); if (over) winOv.classList.add('on'); }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => actBtn(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });
  askEl.querySelector('.sayb').addEventListener('click', () => {
    if (answered || over) return; clearTasks();
    if (mode === 'tap') askTap(); else if (mode === 'times') say('أيُّ صلاةٍ هذه؟', 'Which prayer is it?');
  });
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'ar'; store.set('wuduLang', lang);
    root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
  }
  root.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === lang) return;
    Sound.tap(); setLang(b.dataset.l); cntEl.className = 'cnt';
    if (over) return;
    if (mode === 'learn') showLearn();
    else if (mode === 'tap') { if (!answered) { clearTasks(); askTap(); } }
    else if (mode === 'times') { if (!answered) { clearTasks(); askTime(); } }
    else if (mode === 'order') { buildOrder(); setProg(ordList.length, pstates, ordNext); }
  }));
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); actBtn(lvl < LEVELS.length ? 'next' : 'levels'); return; }
    if (lvOv.classList.contains('on') || winOv.classList.contains('on')) return;
    if (mode === 'learn') { if (e.key === 'Enter' || e.key === 'ArrowLeft') goBtn.click(); else if (e.key === 'ArrowRight') prevBtn.click(); }
    else if (mode === 'times') { const k = parseInt(e.key, 10), cs = choicesEl.querySelectorAll('.tc'); if (k >= 1 && k <= cs.length) pickTime(cs[k - 1]); }
    else if (mode === 'order' && (e.key === 'Enter' || e.key === ' ')) { // يضع البطاقة الصحيحة التالية كتلميح
      e.preventDefault(); const el = trayEl.querySelector(`.wc[data-i="${ordNext}"]`); if (el) { el.classList.remove('bad'); void el.offsetWidth; el.classList.add('bad'); }
    }
  });

  /* =====================================================================
     الحلقة والرسم
     ===================================================================== */
  function updateKid(dt) {
    const k = 1 - Math.exp(-dt * 7);
    let tR = kf.tR, tL = kf.tL;
    const t = T;
    if (kf.motion === 'rub') { const o = Math.sin(t * 9) * .25; tR = [-.28 + o, -2.45]; tL = [.28 + o, -2.45 + Math.sin(t * 9) * .08]; }
    else if (kf.motion === 'mouth') { tR = [-.15, -4.62 + Math.sin(t * 3) * .05]; tL = G.idle.L; }
    else if (kf.motion === 'nose') { tR = [-.1, -4.98 + Math.sin(t * 4) * .06]; tL = [.6, -3.0]; }
    else if (kf.motion === 'face') { const o = Math.sin(t * 4) * .35; tR = [-.72, -5.05 + o]; tL = [.72, -5.05 + o]; }
    else if (kf.motion === 'armR') { tR = [-.05, -2.95]; const s = (Math.sin(t * 3) + 1) / 2; tL = [lerp(-.05, -1.25, s), lerp(-2.95, -2.75, s) - .2]; }
    else if (kf.motion === 'armL') { tL = [.05, -2.95]; const s = (Math.sin(t * 3) + 1) / 2; tR = [lerp(.05, 1.25, s), lerp(-2.95, -2.75, s) - .2]; }
    else if (kf.motion === 'head') { const s = (Math.sin(t * 2.6) + 1) / 2; tR = [-.4, lerp(-6.3, -5.85, s)]; tL = [.4, lerp(-6.3, -5.85, s)]; }
    else if (kf.motion === 'ears') { const o = Math.sin(t * 6) * .05; tR = [-1.32, -5.3 + o]; tL = [1.32, -5.3 - o]; }
    for (let i = 0; i < 2; i++) { kf.hR[i] = lerp(kf.hR[i], tR[i], k); kf.hL[i] = lerp(kf.hL[i], tL[i], k); }
    kf.puff = lerp(kf.puff, kf.puffT ? .8 + Math.sin(t * 6) * .2 : 0, k);
    kf.liftR = lerp(kf.liftR, kf.liftRT, k); kf.liftL = lerp(kf.liftL, kf.liftLT, k);
    kf.heart = lerp(kf.heart, kf.heartT, k);
    for (const p of ['hands', 'mouth', 'nose', 'face', 'arms', 'head', 'ears', 'feet']) {
      const tg = kf.glowT[p] ? kf.glowT[p] * (.55 + .25 * Math.sin(t * 4)) : 0;
      kf.glow[p] = lerp(kf.glow[p] || 0, tg, k);
      if (kf.wet[p]) kf.wet[p] = Math.max(mode === 'tap' && def.k === 'next' ? .45 : 0, kf.wet[p] - dt * .12);
    }
    if (kf.bubble) kf.bubble.t += dt;
    // التنفس للصلاة
    const kp = 1 - Math.exp(-dt * 3.2);
    blendPose(ks.pose, ks.tgt, kp);
    ks.pose.turn = lerp(ks.pose.turn, ks.turnT, 1 - Math.exp(-dt * 5));
  }
  function update(dt) {
    T += dt; skyFade = Math.min(1, skyFade + dt * 2);
    for (let i = tasks.length - 1; i >= 0; i--) { const t = tasks[i]; t.t -= dt; if (t.t <= 0) { tasks.splice(i, 1); t.fn(); } }
    updateKid(dt);
    if (kara) {
      kara.t += dt;
      const sp = sayEl.querySelectorAll('span'), k = Math.min(kara.n, Math.floor(kara.t / kara.d * kara.n + .35));
      sp.forEach((s, i) => s.classList.toggle('on', i < k && kara.t < kara.d + .6));
      if (kara.t > kara.d + 1.2) kara = null;
    }
    for (let i = drops.length - 1; i >= 0; i--) {
      const d = drops[i]; d.life -= dt;
      if (d.delay > 0) { d.delay -= dt; continue; }
      if (!d.splashed) { d.vy += 900 * dt; d.x += d.vx * dt; d.y += d.vy * dt; if (d.y >= d.ty) { d.splashed = true; d.life = .35; for (let k = 0; k < 2; k++) sparks.push({ x: d.x, y: d.y, vx: rand(-60, 60), vy: rand(-90, -30), life: .35, age: 0, s: d.r * .8, c: '#BFEFFF', drop: true }); } }
      if (d.life <= 0) drops.splice(i, 1);
    }
    for (let i = sparks.length - 1; i >= 0; i--) { const q = sparks[i]; q.age += dt; if (q.age > q.life) { sparks.splice(i, 1); continue; } q.vy += (q.drop ? 500 : 160) * dt; q.x += q.vx * dt; q.y += q.vy * dt; }
    for (let i = pops.length - 1; i >= 0; i--) { pops[i].t += dt; if (pops[i].t > 1.1) pops.splice(i, 1); }
  }
  function drawJug(c, x, y, u, tilt) {
    c.save(); c.translate(x, y); c.rotate(tilt); c.scale(u / 40, u / 40);
    c.shadowColor = 'rgba(40,60,90,.25)'; c.shadowBlur = 8; c.shadowOffsetY = 3;
    c.fillStyle = grad(c, -20, 0, 20, 0, ['#FFE7A0', '#F2B93B', '#C9871A']);
    c.beginPath(); c.moveTo(-10, -26); c.lineTo(10, -26); c.quadraticCurveTo(26, 0, 16, 22); c.lineTo(-16, 22); c.quadraticCurveTo(-26, 0, -10, -26); c.fill();
    c.shadowColor = 'transparent';
    c.beginPath(); c.moveTo(-18, -2); c.quadraticCurveTo(-38, -10, -44, -26); c.lineTo(-38, -28); c.quadraticCurveTo(-30, -14, -16, -10); c.closePath(); c.fill();
    c.strokeStyle = '#C9871A'; c.lineWidth = 5; c.beginPath(); c.arc(20, -2, 12, -1.3, 1.3); c.stroke();
    c.fillStyle = '#E8A92A'; rr(c, -13, -32, 26, 8, 4); c.fill();
    c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(-8, -6, 4, 12, .2, 0, TAU); c.fill();
    c.restore();
  }
  function render() {
    if (!ctx) return;
    const c = ctx; c.save(); c.clearRect(0, 0, W, H);
    if (view === 'front') {
      wuduRoom(c, W, H, T);
      const g = kidGeom();
      kidFront(c, g.x, g.y, g.u, { T, hR: kf.hR, hL: kf.hL, eyes: kf.eyes, mouth: kf.mouth, puff: kf.puff, liftR: kf.liftR, liftL: kf.liftL, finger: kf.finger, heart: kf.heart, glow: kf.glow, wet: kf.wet, side: kf.side, lookUp: kf.lookUp });
      // الإبريق يصب فوق العضو
      const p = pourPoint();
      if (p && drops.length) { const k = g.u * .75 / 40, jx = g.x + p[0] * g.u + g.u * 1.7 + 51.6 * k, jy = g.y + p[1] * g.u - g.u * 2.1; drawJug(c, jx, jy, g.u * .75, -.55); }
      if (kf.bubble) bubble(c, g.x + g.u * 2.2, g.y - g.u * 6.6, plain(kf.bubble.ar), Math.min(1, kf.bubble.t * 3));
      if (kf.finger) { const a = Math.min(1, (act ? act.t : 0)); void a; }
    } else if (view === 'side') {
      prayerRoom(c, W, H, T, 1);
      const u = Math.min(H / 8.3, W / 7.6), fx = W * .4, fy = H * .88;
      mat(c, fx - 2.2 * u, fx + 4.6 * u, fy, u);
      kidSide(c, fx, fy, u, ks.pose, { T, calm: true });
    } else {
      skyScene(c, W, H, skyId, T);
      if (skyFade < 1) { c.fillStyle = `rgba(255,255,255,${(1 - skyFade) * .8})`; c.fillRect(0, 0, W, H); }
      // اسم الصلاة على لافتة (في التعلّم فقط)
      if (mode === 'learn') { const st = TIMES.find(x => x.id === skyId); label(c, W / 2, H * .88, lang === 'en' ? st.en : plain(st.ar)); }
    }
    // القطرات
    for (const d of drops) {
      if (d.splashed || d.delay > 0) continue;
      c.fillStyle = 'rgba(120,205,250,.9)'; c.beginPath(); c.moveTo(d.x, d.y - d.r * 2.2); c.quadraticCurveTo(d.x + d.r, d.y - d.r * .2, d.x, d.y + d.r); c.quadraticCurveTo(d.x - d.r, d.y - d.r * .2, d.x, d.y - d.r * 2.2); c.fill();
      c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.arc(d.x - d.r * .3, d.y - d.r * .3, d.r * .3, 0, TAU); c.fill();
    }
    for (const q of sparks) {
      c.globalAlpha = 1 - q.age / q.life; c.fillStyle = q.c;
      if (q.drop) { c.beginPath(); c.arc(q.x, q.y, q.s, 0, TAU); c.fill(); }
      else { star5(c, q.x, q.y, q.s, q.age * 4); c.fill(); }
    }
    c.globalAlpha = 1;
    for (const p of pops) {
      const k = p.t, s = k < .25 ? ease(k / .25) * 1.15 : 1.15 - Math.min(.15, (k - .25)), a = k > .8 ? 1 - (k - .8) / .3 : 1, R = Math.min(W, H) * .07;
      c.save(); c.globalAlpha = Math.max(0, a); c.translate(p.x, p.y - k * 18); c.scale(s, s);
      c.shadowColor = 'rgba(20,80,120,.3)'; c.shadowBlur = 8; c.shadowOffsetY = 3;
      c.fillStyle = p.bad ? '#FF8A7A' : '#fff'; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill(); c.shadowColor = 'transparent';
      c.strokeStyle = p.bad ? '#fff' : '#3BB2E0'; c.lineWidth = 4; c.beginPath(); c.arc(0, 0, R - 2, 0, TAU); c.stroke();
      c.fillStyle = p.bad ? '#fff' : '#1F86B5'; c.font = `900 ${R * 1.15}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(p.txt, 0, R * .08);
      c.restore();
    }
    // إطار ناعم
    const vg = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .45, W / 2, H / 2, Math.max(W, H) * .75); vg.addColorStop(0, 'rgba(255,255,255,0)'); vg.addColorStop(1, 'rgba(30,60,90,.14)');
    c.fillStyle = vg; c.fillRect(0, 0, W, H);
    c.restore();
  }
  function bubble(c, x, y, txt, a) {
    c.save(); c.globalAlpha = a; c.font = `900 ${Math.max(16, H * .055)}px ${FONT}`; c.direction = 'rtl';
    const w = c.measureText(txt).width + 26, h = Math.max(16, H * .055) * 1.8;
    x = clamp(x, w / 2 + 6, W - w / 2 - 6);
    c.shadowColor = 'rgba(0,0,0,.15)'; c.shadowBlur = 8; c.shadowOffsetY = 3;
    c.fillStyle = '#fff'; rr(c, x - w / 2, y - h / 2, w, h, h / 2); c.fill(); c.shadowColor = 'transparent';
    c.beginPath(); c.moveTo(x - w * .25, y + h / 2 - 3); c.lineTo(x - w * .35, y + h / 2 + 12); c.lineTo(x - w * .12, y + h / 2 - 3); c.fill();
    c.fillStyle = '#17627F'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, x, y + 1); c.restore();
  }
  function label(c, x, y, txt) {
    c.save(); const fs = Math.max(18, H * .075); c.font = `900 ${fs}px ${lang === 'en' ? EN_FONT : FONT}`;
    const w = c.measureText(txt).width + 40, h = fs * 1.6;
    c.shadowColor = 'rgba(0,0,0,.25)'; c.shadowBlur = 10; c.shadowOffsetY = 4;
    c.fillStyle = '#fff'; rr(c, x - w / 2, y - h / 2, w, h, h / 2); c.fill(); c.shadowColor = 'transparent';
    c.strokeStyle = '#F2B93B'; c.lineWidth = 4; rr(c, x - w / 2 + 3, y - h / 2 + 3, w - 6, h - 6, h / 2); c.stroke();
    c.fillStyle = '#7A4A00'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, x, y + 2); c.restore();
  }
  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
    if (paused || document.hidden) return;
    if (act) act.t += dt;
    update(dt); render();
  }
  function startLoop() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stopLoop() { running = false; cancelAnimationFrame(raf); }
  let resizeT = 0;
  window.addEventListener('resize', () => { if (App.current !== ID) return; clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); render(); if (mode === 'order') root.querySelectorAll('.ord canvas[data-pose]').forEach(drawPoseThumb); }, 80); });
  if (window.ResizeObserver) new ResizeObserver(() => { if (App.current === ID && running) { layout(); } }).observe(scard);

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#5CC8EE'); g.addColorStop(1, '#BDEBFA');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.save(); c.globalAlpha = .9; mosque(c, s * .72, s * .78, s * .42, 'rgba(255,255,255,.85)', 'dhuhr', 0); c.restore();
    c.fillStyle = grad(c, 0, s * .78, 0, s, ['#9FD6E8', '#7FC2DA']); c.fillRect(0, s * .78, s, s * .22);
    c.save(); kidFront(c, s * .36, s * .97, s * .118, { T: 0, hR: [-.28, -2.5], hL: [.28, -2.5], eyes: 'happy', glow: { hands: .5 } }); c.restore();
    drawJug(c, s * .55, s * .36, s * .13, -.55);
    for (let i = 0; i < 5; i++) { const x = s * (.32 + (i % 2) * .06), y = s * (.47 + i * .045); c.fillStyle = 'rgba(255,255,255,.95)'; c.beginPath(); c.moveTo(x, y - 6); c.quadraticCurveTo(x + 3.5, y, x, y + 3); c.quadraticCurveTo(x - 3.5, y, x, y - 6); c.fill(); }
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'الوضوء والصلاة', icon2: '🕌', isNew: true, music: 'tubes',
    desc: () => App.g('تعلّمي الوضوء والصلاة خطوة بخطوة', 'تعلّم الوضوء والصلاة خطوة بخطوة'),
    help: () => [
      '💧 «تعلّم الوضوء» يعرض كل خطوة مع الماء والعدّ: ١، ٢، ٣',
      '🧩 ' + App.g('اسحبي', 'اسحب') + ' البطاقات إلى أماكنها بالترتيب الصحيح',
      '👆 ' + App.g('المسي', 'المس') + ' العضو الصحيح على جسم الطفل',
      '🕌 ' + App.g('تعلّمي', 'تعلّم') + ' أوضاع الركعة وأسماء الصلوات الخمس وأوقاتها',
      '🌍 زر «English» يعرض أسماء الخطوات بالإنجليزية'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks2 = Object.keys(pr.stars).filter(n => pr.stars[n]);
      if (!ks2.length) return '';
      return `🕌 ${ks2.length}/${LEVELS.length} · ⭐ ${ks2.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      setLang(store.get('wuduLang', 'ar'));
      layout();
      startLevel(store.get('wuduLast', 1));
      requestAnimationFrame(() => { layout(); render(); });
      startLoop();
    },
    leave() { stopLoop(); clearTasks(); if (drag) { drag.clone.remove(); drag = null; } winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { actBtn('close'); return true; }
      return false;
    },
    _state() { return { lvl, k: def.k, mode, li, qi, q: qs.length, ordNext, mistakes, over, lang, cur: qs[qi] && qs[qi].id }; },
    _tapPart(part) { const p = partPx(part); const r = cv.getBoundingClientRect(); return [r.left + p[0], r.top + p[1]]; }
  });
})();
