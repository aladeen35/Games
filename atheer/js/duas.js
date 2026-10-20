/* =====================================================================
   أدعيتي الصغيرة — مشاهد يومية مرسومة، واختيار الدعاء المناسب
   + وضع «تعلّم» يعرض كل دعاء ويقرؤه مع تظليل الكلمات
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'duas';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,"Segoe UI",Tahoma,sans-serif';
  const EN_FONT = 'system-ui,"Segoe UI",Roboto,sans-serif';
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  /* ---------- الأدعية (أدعية صحيحة قصيرة مشهورة) ----------
     t: النص بالتشكيل الكامل (للعرض)، p: النص كما يُمرَّر للنطق، en: المعنى بالإنجليزية
     fam: عائلة النص (لا تجتمع بطاقتان من العائلة نفسها في سؤال واحد) */
  const DUAS = [
    { id: 'eat', sc: 'eat', i: '🍽️', ca: 'قبل الأكل', ce: 'Before eating', fam: 'bism',
      t: 'بِسْمِ اللَّهِ', p: 'بسم الله', en: 'In the name of Allah' },
    { id: 'done', sc: 'done', i: '😋', ca: 'بعد الأكل', ce: 'After eating', fam: 'hamd',
      t: 'الْحَمْدُ لِلَّهِ', p: 'الحمد لله', en: 'All praise is for Allah' },
    { id: 'sleep', sc: 'sleep', i: '🌙', ca: 'قبل النوم', ce: 'Before sleeping', fam: 'sleep',
      t: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', p: 'باسمك اللهم أموت وأحيا', en: 'In Your name, O Allah, I die and I live' },
    { id: 'wake', sc: 'wake', i: '☀️', ca: 'عند الاستيقاظ', ce: 'When waking up', fam: 'hamd',
      t: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', p: 'الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور',
      en: 'Praise be to Allah who gave us life after He took it, and to Him is the return' },
    { id: 'out', sc: 'out', i: '🚪', ca: 'عند الخروج من البيت', ce: 'Leaving home', fam: 'bism',
      t: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', p: 'بسم الله توكلت على الله ولا حول ولا قوة إلا بالله',
      en: 'In the name of Allah, I trust in Allah, and there is no power and no strength except with Allah' },
    { id: 'in', sc: 'in', i: '🏠', ca: 'عند دخول البيت', ce: 'Entering home', fam: 'bism',
      t: 'بِسْمِ اللَّهِ', p: 'بسم الله', en: 'In the name of Allah' },
    { id: 'wcin', sc: 'wcin', i: '🚻', ca: 'عند دخول الخلاء', ce: 'Entering the bathroom', fam: 'wc',
      t: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ', p: 'اللهم إني أعوذ بك من الخبث والخبائث',
      en: 'O Allah, I seek refuge in You from all evil and evil ones' },
    { id: 'wcout', sc: 'wcout', i: '🧼', ca: 'عند الخروج من الخلاء', ce: 'Leaving the bathroom', fam: 'ghufran',
      t: 'غُفْرَانَكَ', p: 'غفرانك', en: 'I ask for Your forgiveness' },
    { id: 'dress', sc: 'dress', i: '👕', ca: 'عند لبس الثوب', ce: 'Getting dressed', fam: 'hamd',
      t: 'الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ', p: 'الحمد لله الذي كساني هذا ورزقنيه من غير حول مني ولا قوة',
      en: 'Praise be to Allah who clothed me with this and gave it to me, without any power or strength from me' },
    { id: 'sneeze', sc: 'sneeze', i: '🤧', ca: 'إذا عطستُ', ce: 'When I sneeze', fam: 'hamd',
      t: 'الْحَمْدُ لِلَّهِ', p: 'الحمد لله', en: 'All praise is for Allah' },
    { id: 'hear', sc: 'hear', i: '👂', ca: 'إذا عطس أخي وقال: الحمد لله', ce: 'When my brother sneezes and says Alhamdulillah', fam: 'rahm',
      t: 'يَرْحَمُكَ اللَّهُ', p: 'يرحمك الله', en: 'May Allah have mercy on you' },
    { id: 'reply', sc: 'reply', i: '💬', ca: 'إذا قال لي أخي: يرحمك الله', ce: 'When my brother says: Yarhamukallah', fam: 'hidaya',
      t: 'يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ', p: 'يهديكم الله ويصلح بالكم', en: 'May Allah guide you and set your affairs right' },
    { id: 'car', sc: 'car', i: '🚗', ca: 'عند ركوب السيارة', ce: 'Riding in a car', fam: 'subhan',
      t: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ', p: 'سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون',
      en: 'Glory be to Him who made this serve us, we could not have done it ourselves, and to our Lord we will return' },
    { id: 'rain', sc: 'rain', i: '🌧️', ca: 'عند نزول المطر', ce: 'When it rains', fam: 'rain',
      t: 'اللَّهُمَّ صَيِّبًا نَافِعًا', p: 'اللهم صيبا نافعا', en: 'O Allah, make it a helpful rain' },
    { id: 'study', sc: 'study', i: '📚', ca: 'قبل المذاكرة', ce: 'Before studying', fam: 'ilm',
      t: 'رَبِّ زِدْنِي عِلْمًا', p: 'رب زدني علما', en: 'My Lord, increase me in knowledge' }
  ];
  const BY = Object.fromEntries(DUAS.map(d => [d.id, d]));

  const LEVELS = [
    { ic: '🍽️', t: 'الطعام', ids: ['eat', 'done'], ch: 2, q: 4 },
    { ic: '🌙', t: 'النوم', ids: ['sleep', 'wake'], ch: 2, q: 4 },
    { ic: '🚪', t: 'البيت', ids: ['out', 'in'], ch: 2, q: 4 },
    { ic: '🚻', t: 'الخلاء', ids: ['wcin', 'wcout'], ch: 3, q: 4 },
    { ic: '🤧', t: 'العطاس', ids: ['sneeze', 'hear', 'reply'], ch: 3, q: 5 },
    { ic: '👕', t: 'اللباس والمذاكرة', ids: ['dress', 'study'], ch: 3, q: 4 },
    { ic: '🚗', t: 'السفر والمطر', ids: ['car', 'rain'], ch: 3, q: 4 },
    { ic: '⭐', t: 'مراجعة', ids: ['eat', 'done', 'sleep', 'wake', 'out', 'wcin', 'wcout'], ch: 3, q: 7, review: true },
    { ic: '🏆', t: 'كل الأدعية', ids: DUAS.map(d => d.id), ch: 3, q: 10, review: true }
  ];

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const lerp = (a, b, t) => a + (b - a) * t;
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const loadProg = () => { const p = store.get('duasProg', null) || {}; return { stars: p.stars || {}, unlocked: p.unlocked || 1 }; };
  let lang = 'ar';
  const num = n => lang === 'ar' ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const arDur = d => .9 + d.p.split(' ').length * .62;
  const enDur = s => .6 + s.split(' ').length * .36;

  /* =====================================================================
     رسم الشخصيات والمشاهد (إحداثيات افتراضية 400×300)
     ===================================================================== */
  const VW = 400, VH = 300;
  function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
  function grad(c, x0, y0, x1, y1, stops) { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; }
  function rgrad(c, x, y, r, stops) { const g = c.createRadialGradient(x - r * .35, y - r * .4, r * .1, x, y, r * 1.05); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; }
  function emo(c, e, x, y, s, rot) { c.save(); c.translate(x, y); if (rot) c.rotate(rot); c.font = `${s}px ${EMOJI_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(e, 0, 0); c.restore(); }
  function shadow(c, x, y, rx, ry, a = .18) { c.fillStyle = `rgba(40,30,60,${a})`; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill(); }

  /* ألوان الطفلين: البطل حسب ثيم اللاعب، والصديق بالألوان الأخرى */
  const LOOK = {
    girl: { girl: true, top: ['#FF9CC4', '#F06A9C', '#C94677'], hair: ['#7A4A2E', '#4E2C18'], bow: '#FF5C8A' },
    boy:  { girl: false, top: ['#7FC0FF', '#3D8BFD', '#2462C9'], hair: ['#5A3A24', '#33200F'], pants: ['#5C6FA8', '#3E4E80'] }
  };
  const hero = () => LOOK[App.theme === 'boys' ? 'boy' : 'girl'];
  const buddy = () => LOOK[App.theme === 'boys' ? 'girl' : 'boy'];

  /* الطفل: (x,y) = الوركان، u = وحدة الحجم (نصف قطر الرأس)
     o.hL / o.hR = موضع اليد [x,y] بوحدات u بالنسبة للوركين، o.eyes: open|closed|happy|squeeze|down، o.mouth: smile|open|o|line */
  function arm(c, side, tx, ty, u, sleeve) {
    const sx = side * .6 * u, sy = -1.45 * u, L1 = .72 * u, L2 = .7 * u;
    let dx = tx * u - sx, dy = ty * u - sy, d = Math.hypot(dx, dy);
    const dm = L1 + L2 - .02 * u; if (d > dm) { dx *= dm / d; dy *= dm / d; d = dm; }
    d = Math.max(d, .2 * u);
    const th = Math.atan2(dy, dx), al = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1));
    const a = th + (side < 0 ? al : -al);
    const ex = sx + Math.cos(a) * L1, ey = sy + Math.sin(a) * L1, hx = sx + dx, hy = sy + dy;
    c.lineCap = 'round';
    c.strokeStyle = 'rgba(60,30,40,.22)'; c.lineWidth = .36 * u; c.beginPath(); c.moveTo(sx, sy); c.lineTo(ex, ey); c.lineTo(hx, hy); c.stroke();
    c.strokeStyle = '#F4BE97'; c.lineWidth = .28 * u; c.beginPath(); c.moveTo(ex, ey); c.lineTo(hx, hy); c.stroke();
    c.strokeStyle = sleeve; c.lineWidth = .33 * u; c.beginPath(); c.moveTo(sx, sy); c.lineTo(lerp(sx, ex, 1.05), lerp(sy, ey, 1.05)); c.stroke();
    c.fillStyle = rgrad(c, hx, hy, .2 * u, ['#FFE6D2', '#F7C29C', '#E5A47A']); c.beginPath(); c.arc(hx, hy, .2 * u, 0, TAU); c.fill();
    return { x: hx, y: hy };
  }
  function kid(c, x, y, u, o = {}) {
    const L = o.look || hero(), t = o.T || 0;
    c.save(); c.translate(x, y); if (o.tilt) c.rotate(o.tilt);
    const breath = Math.sin(t * 2.2 + (o.ph || 0)) * .025;
    // الساقان
    if (o.legs !== 'none') {
      const sw = o.legs === 'walk' ? Math.sin(t * 6) * .25 : 0;
      for (const s of [-1, 1]) {
        c.save(); c.translate(s * .32 * u, -.1 * u); c.rotate(s * sw);
        c.fillStyle = L.girl ? '#F7C29C' : grad(c, 0, 0, 0, u, L.pants);
        rr(c, -.19 * u, 0, .38 * u, 1.05 * u, .18 * u); c.fill();
        c.fillStyle = L.girl ? '#fff' : '#fff'; rr(c, -.2 * u, .78 * u, .4 * u, .16 * u, .06 * u); c.fill();
        c.fillStyle = grad(c, 0, .9 * u, 0, 1.2 * u, L.girl ? ['#FF7AA8', '#D94F82'] : ['#5C5C6E', '#33333F']);
        c.beginPath(); c.ellipse(.06 * u * s, 1.05 * u, .3 * u, .17 * u, 0, 0, TAU); c.fill();
        c.restore();
      }
    }
    c.scale(1, 1 + breath);
    // الجسم
    c.save(); c.shadowColor = 'rgba(60,30,60,.25)'; c.shadowBlur = .3 * u; c.shadowOffsetY = .1 * u;
    c.fillStyle = grad(c, -u, -1.7 * u, u, .3 * u, L.top);
    if (L.girl) {
      c.beginPath(); c.moveTo(-.55 * u, -1.72 * u); c.quadraticCurveTo(0, -1.85 * u, .55 * u, -1.72 * u);
      c.quadraticCurveTo(.8 * u, -.6 * u, 1.0 * u, .25 * u); c.quadraticCurveTo(0, .45 * u, -1.0 * u, .25 * u); c.quadraticCurveTo(-.8 * u, -.6 * u, -.55 * u, -1.72 * u); c.fill();
    } else { rr(c, -.72 * u, -1.75 * u, 1.44 * u, 1.85 * u, .5 * u); c.fill(); }
    c.restore();
    c.fillStyle = 'rgba(255,255,255,.28)'; c.beginPath(); c.ellipse(-.3 * u, -1.25 * u, .18 * u, .4 * u, .3, 0, TAU); c.fill();
    if (L.girl) { c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.arc(0, -1.55 * u, .12 * u, 0, TAU); c.fill(); }
    else { c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.moveTo(-.3 * u, -1.74 * u); c.lineTo(0, -1.45 * u); c.lineTo(.3 * u, -1.74 * u); c.closePath(); c.fill(); }
    // الذراعان الخلفيتان (إن طُلب)
    const sleeve = L.top[1];
    const hands = {};
    if (o.back) { hands.l = arm(c, -1, ...(o.hL || [-.75, -.15]), u, sleeve); hands.r = arm(c, 1, ...(o.hR || [.75, -.15]), u, sleeve); }
    // الرأس
    const hx = 0, hy = -2.55 * u;
    c.fillStyle = '#F2B48A'; rr(c, -.18 * u, -1.95 * u, .36 * u, .3 * u, .1 * u); c.fill();
    if (L.girl) { // ضفيرتان
      for (const s of [-1, 1]) {
        c.fillStyle = rgrad(c, hx + s * 1.02 * u, hy + .1 * u, .4 * u, [L.hair[0], L.hair[0], L.hair[1]]); c.beginPath(); c.arc(hx + s * 1.02 * u, hy + .1 * u, .4 * u, 0, TAU); c.fill();
        c.fillStyle = L.bow; c.beginPath(); c.ellipse(hx + s * .86 * u, hy - .3 * u, .2 * u, .12 * u, s * .6, 0, TAU); c.fill();
      }
    }
    c.save(); c.shadowColor = 'rgba(60,30,30,.25)'; c.shadowBlur = .25 * u; c.shadowOffsetY = .08 * u;
    c.fillStyle = rgrad(c, hx, hy, u, ['#FFE9D8', '#FBCBA6', '#E9A981']); c.beginPath(); c.arc(hx, hy, u, 0, TAU); c.fill(); c.restore();
    // الشعر
    c.fillStyle = grad(c, 0, hy - u, 0, hy, L.hair);
    c.beginPath(); c.arc(hx, hy, u * 1.03, Math.PI * 1.02, Math.PI * 1.98);
    if (L.girl) { c.quadraticCurveTo(hx + .7 * u, hy - .35 * u, hx + .1 * u, hy - .55 * u); c.quadraticCurveTo(hx - .5 * u, hy - .3 * u, hx - 1.0 * u, hy - .05 * u); }
    else { c.lineTo(hx + .85 * u, hy - .45 * u); c.quadraticCurveTo(hx + .3 * u, hy - .62 * u, hx - .2 * u, hy - .45 * u); c.quadraticCurveTo(hx - .65 * u, hy - .5 * u, hx - 1.0 * u, hy - .1 * u); }
    c.closePath(); c.fill();
    if (!L.girl) { c.beginPath(); c.moveTo(hx - .1 * u, hy - u); c.quadraticCurveTo(hx + .1 * u, hy - 1.35 * u, hx + .35 * u, hy - 1.15 * u); c.quadraticCurveTo(hx + .1 * u, hy - 1.1 * u, hx + .1 * u, hy - .95 * u); c.fill(); }
    c.fillStyle = 'rgba(255,255,255,.22)'; c.beginPath(); c.ellipse(hx - .4 * u, hy - .72 * u, .3 * u, .1 * u, -.4, 0, TAU); c.fill();
    // الوجه
    const blink = o.eyes === 'open' || !o.eyes ? (Math.sin(t * 1.3 + (o.ph || 0)) > .985) : false;
    const lx = (o.lookX || 0) * .08 * u, ly = (o.lookY || 0) * .06 * u;
    c.strokeStyle = '#3A2318'; c.fillStyle = '#2A1810'; c.lineWidth = .1 * u; c.lineCap = 'round';
    for (const s of [-1, 1]) {
      const ex = hx + s * .36 * u, ey = hy + .02 * u;
      const e = blink ? 'closed' : (o.eyes || 'open');
      c.beginPath();
      if (e === 'open' || e === 'down') {
        c.ellipse(ex + lx, ey + ly + (e === 'down' ? .06 * u : 0), .13 * u, e === 'down' ? .1 * u : .17 * u, 0, 0, TAU); c.fill();
        c.fillStyle = '#fff'; c.beginPath(); c.arc(ex + lx - .04 * u, ey + ly - .06 * u, .045 * u, 0, TAU); c.fill(); c.fillStyle = '#2A1810';
      } else if (e === 'closed') { c.arc(ex, ey - .02 * u, .14 * u, .2, Math.PI - .2); c.stroke(); }
      else if (e === 'happy') { c.arc(ex, ey + .06 * u, .14 * u, Math.PI + .2, -.2); c.stroke(); }
      else if (e === 'squeeze') { c.moveTo(ex - s * .14 * u, ey - .1 * u); c.lineTo(ex + s * .06 * u, ey); c.lineTo(ex - s * .14 * u, ey + .1 * u); c.stroke(); }
    }
    c.fillStyle = 'rgba(255,110,130,.4)'; c.beginPath(); c.ellipse(hx - .58 * u, hy + .3 * u, .17 * u, .1 * u, 0, 0, TAU); c.ellipse(hx + .58 * u, hy + .3 * u, .17 * u, .1 * u, 0, 0, TAU); c.fill();
    const my = hy + .45 * u, m = o.mouth || 'smile';
    c.strokeStyle = '#9A3A2A'; c.fillStyle = '#B5473A'; c.lineWidth = .08 * u;
    if (m === 'smile') { c.beginPath(); c.arc(hx, my - .12 * u, .2 * u, .35, Math.PI - .35); c.stroke(); }
    else if (m === 'open') { c.beginPath(); c.moveTo(hx - .2 * u, my - .04 * u); c.quadraticCurveTo(hx, my + .3 * u, hx + .2 * u, my - .04 * u); c.closePath(); c.fill(); c.fillStyle = '#FF8F9A'; c.beginPath(); c.ellipse(hx, my + .1 * u, .1 * u, .05 * u, 0, 0, TAU); c.fill(); }
    else if (m === 'o') { c.beginPath(); c.ellipse(hx, my, .1 * u, .14 * u, 0, 0, TAU); c.fill(); }
    else { c.beginPath(); c.moveTo(hx - .12 * u, my); c.lineTo(hx + .12 * u, my); c.stroke(); }
    // الذراعان
    if (!o.back && o.arms !== false) { hands.l = arm(c, -1, ...(o.hL || [-.75, -.15]), u, sleeve); hands.r = arm(c, 1, ...(o.hR || [.75, -.15]), u, sleeve); }
    c.restore();
    return hands;
  }

  /* ---------- الخلفيات ---------- */
  function room(c, wall, floor, fy = 222) {
    c.fillStyle = grad(c, 0, 0, 0, fy, wall); c.fillRect(0, 0, VW, fy);
    c.fillStyle = 'rgba(255,255,255,.18)'; for (let x = 10; x < VW; x += 40) c.fillRect(x, 0, 16, fy);
    c.fillStyle = grad(c, 0, fy, 0, VH, floor); c.fillRect(0, fy, VW, VH - fy);
    c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(0, fy - 6, VW, 6); c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(0, fy, VW, 3);
    c.strokeStyle = 'rgba(0,0,0,.05)'; c.lineWidth = 2;
    for (let i = -6; i <= 6; i++) { c.beginPath(); c.moveTo(VW / 2 + i * 30, fy); c.lineTo(VW / 2 + i * 70, VH); c.stroke(); }
  }
  function sky(c, top, bot, gy) {
    c.fillStyle = grad(c, 0, 0, 0, gy, [top, bot]); c.fillRect(0, 0, VW, gy);
  }
  function puff(c, x, y, s, col = '#fff', sh = 'rgba(150,180,220,.5)') {
    const B = [[-1, .2, .55], [-.4, -.2, .75], [.3, -.25, .7], [.9, .15, .55], [0, .25, .6]];
    c.fillStyle = col; c.beginPath(); for (const [a, b, r] of B) { c.moveTo(x + a * s + r * s, y + b * s); c.arc(x + a * s, y + b * s, r * s, 0, TAU); } c.fill();
    c.fillStyle = grad(c, 0, y - s, 0, y + s * .9, ['rgba(255,255,255,0)', 'rgba(255,255,255,0)', sh]);
    c.beginPath(); for (const [a, b, r] of B) { c.moveTo(x + a * s + r * s, y + b * s); c.arc(x + a * s, y + b * s, r * s, 0, TAU); } c.fill();
  }
  function windowFrame(c, x, y, w, h, inner) {
    c.save(); c.shadowColor = 'rgba(0,0,0,.2)'; c.shadowBlur = 8; c.shadowOffsetY = 3;
    c.fillStyle = '#fff'; rr(c, x - 7, y - 7, w + 14, h + 14, 14); c.fill(); c.restore();
    c.save(); rr(c, x, y, w, h, 9); c.clip(); inner(); c.restore();
    c.fillStyle = '#fff'; c.fillRect(x + w / 2 - 3, y, 6, h); c.fillRect(x, y + h / 2 - 3, w, 6);
    c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.moveTo(x + 8, y + h - 8); c.lineTo(x + w * .35, y + 8); c.lineTo(x + w * .45, y + 8); c.lineTo(x + 18, y + h - 8); c.fill();
  }
  function door(c, x, y, w, h, open, col = ['#C98B55', '#A26A3A'], outside) {
    c.fillStyle = '#F4E6D2'; rr(c, x - 8, y - 8, w + 16, h + 8, [12, 12, 0, 0]); c.fill();
    c.fillStyle = 'rgba(0,0,0,.1)'; c.fillRect(x - 8, y + h - 3, w + 16, 3);
    if (open) {
      c.save(); rr(c, x, y, w, h, [6, 6, 0, 0]); c.clip();
      if (outside) outside(); else { c.fillStyle = grad(c, 0, y, 0, y + h, ['#BFE8FF', '#FFF7D6']); c.fillRect(x, y, w, h); }
      c.restore();
      c.fillStyle = grad(c, x, 0, x + w * .35, 0, col);
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + w * open, y + 10); c.lineTo(x + w * open, y + h - 4); c.lineTo(x, y + h); c.closePath(); c.fill();
      c.fillStyle = '#FFD45C'; c.beginPath(); c.arc(x + w * open - 7, y + h * .55, 3.5, 0, TAU); c.fill();
    } else {
      c.fillStyle = grad(c, x, 0, x + w, 0, col); rr(c, x, y, w, h, [6, 6, 0, 0]); c.fill();
      c.strokeStyle = 'rgba(80,40,10,.25)'; c.lineWidth = 2; rr(c, x + 8, y + 10, w - 16, h * .38, 5); c.stroke(); rr(c, x + 8, y + h * .5, w - 16, h * .42, 5); c.stroke();
      c.fillStyle = '#FFD45C'; c.beginPath(); c.arc(x + w - 11, y + h * .55, 4, 0, TAU); c.fill();
      c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(x + 3, y + 3, 5, h - 6);
    }
  }
  function table(c, y, x0 = 60, x1 = 340) {
    shadow(c, (x0 + x1) / 2, VH - 6, (x1 - x0) * .55, 10, .15);
    c.fillStyle = grad(c, 0, y + 14, 0, VH, ['#C88A52', '#9C6234']); c.fillRect(x0 + 16, y + 14, x1 - x0 - 32, VH - y);
    c.save(); c.shadowColor = 'rgba(60,30,10,.3)'; c.shadowBlur = 10; c.shadowOffsetY = 5;
    c.fillStyle = grad(c, 0, y, 0, y + 18, ['#F0B97E', '#D18F55']); rr(c, x0, y, x1 - x0, 18, 9); c.fill(); c.restore();
    c.fillStyle = 'rgba(255,255,255,.35)'; rr(c, x0 + 10, y + 3, x1 - x0 - 20, 4, 2); c.fill();
  }
  function plate(c, x, y, s, food) {
    shadow(c, x, y + 4, s * 1.1, s * .25, .15);
    c.fillStyle = grad(c, 0, y - s * .3, 0, y + s * .3, ['#FFFFFF', '#DDE6F0']); c.beginPath(); c.ellipse(x, y, s, s * .3, 0, 0, TAU); c.fill();
    c.fillStyle = '#EEF3F8'; c.beginPath(); c.ellipse(x, y - 1, s * .7, s * .2, 0, 0, TAU); c.fill();
    if (food) emo(c, food, x, y - s * .38, s * 1.05);
  }
  function stars(c, n, t, area) {
    for (let i = 0; i < n; i++) {
      const x = area[0] + ((i * 73) % 100) / 100 * area[2], y = area[1] + ((i * 37) % 100) / 100 * area[3];
      const a = .5 + .5 * Math.sin(t * 2 + i);
      c.fillStyle = `rgba(255,240,170,${.4 + a * .6})`; c.save(); c.translate(x, y); c.rotate(i);
      c.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? 1.4 : 3.6, an = k * Math.PI / 5; c.lineTo(Math.cos(an) * r, Math.sin(an) * r); } c.fill(); c.restore();
    }
  }
  function bubbleText(c, x, y, txt, col, size = 15) {
    c.save(); c.font = `900 ${size}px ${FONT}`; c.direction = 'rtl';
    const w = c.measureText(txt).width + 24, h = size * 1.8;
    c.shadowColor = 'rgba(0,0,0,.15)'; c.shadowBlur = 6; c.shadowOffsetY = 2;
    c.fillStyle = '#fff'; rr(c, x - w / 2, y - h / 2, w, h, h / 2); c.fill();
    c.shadowColor = 'transparent'; c.beginPath(); c.moveTo(x - 6, y + h / 2 - 2); c.lineTo(x - 12, y + h / 2 + 12); c.lineTo(x + 6, y + h / 2 - 2); c.fill();
    c.strokeStyle = col; c.lineWidth = 2.5; rr(c, x - w / 2, y - h / 2, w, h, h / 2); c.stroke();
    c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, x, y + 1); c.restore();
  }

  /* ---------- المشاهد ---------- */
  const SCENES = {
    eat(c, t) {
      room(c, ['#FFF1D6', '#FFE2B0'], ['#E8C79A', '#D3A877']);
      windowFrame(c, 36, 40, 86, 70, () => { sky(c, '#8FD3FF', '#E1F5FF', 110); puff(c, 70, 70, 14); });
      emo(c, '🪴', 345, 190, 44);
      kid(c, 200, 238, 25, { T: t, hR: [.25, -2.15 + Math.sin(t * 3) * .12], hL: [-.95, -.75], eyes: 'happy', mouth: 'o' });
      table(c, 218);
      plate(c, 200, 222, 44, '🍲');
      for (let i = 0; i < 3; i++) { const k = (t * .6 + i / 3) % 1; c.strokeStyle = `rgba(255,255,255,${.8 * (1 - k)})`; c.lineWidth = 3; c.beginPath(); c.moveTo(186 + i * 14, 196 - k * 30); c.quadraticCurveTo(180 + i * 14 + Math.sin(t * 3 + i) * 6, 186 - k * 30, 186 + i * 14, 176 - k * 30); c.stroke(); }
      emo(c, '🥤', 295, 205, 30); emo(c, '🍎', 108, 210, 28);
    },
    done(c, t) {
      room(c, ['#FFF1D6', '#FFE2B0'], ['#E8C79A', '#D3A877']);
      windowFrame(c, 278, 40, 86, 70, () => { sky(c, '#8FD3FF', '#E1F5FF', 110); puff(c, 320, 72, 14); });
      const up = Math.sin(t * 2.4) * .1;
      kid(c, 200, 238, 25, { T: t, hR: [1.0, -2.9 + up], hL: [-1.0, -2.9 + up], eyes: 'happy', mouth: 'open' });
      table(c, 218);
      plate(c, 200, 222, 44, null);
      c.fillStyle = '#E6B26A'; for (const [dx, dy] of [[-12, 0], [6, 2], [16, -2]]) { c.beginPath(); c.arc(200 + dx, 220 + dy, 2, 0, TAU); c.fill(); }
      emo(c, '🥄', 254, 214, 26, -.6);
      for (let i = 0; i < 3; i++) { const k = (t * .5 + i / 3) % 1; c.globalAlpha = 1 - k; emo(c, '✨', 140 + i * 60, 120 - k * 40, 16); c.globalAlpha = 1; }
    },
    sleep(c, t) {
      room(c, ['#3C3F8F', '#5A5DB0'], ['#4A4A8A', '#363670']);
      windowFrame(c, 270, 34, 96, 76, () => { sky(c, '#1B1F5C', '#3B3F99', 110); stars(c, 9, t, [275, 40, 86, 60]); emo(c, '🌙', 340, 62, 26); });
      // السرير
      c.fillStyle = grad(c, 0, 120, 0, 230, ['#FFB4CE', '#E27AA3']); rr(c, 50, 120, 22, 120, 10); c.fill();
      shadow(c, 190, 268, 150, 14, .25);
      c.fillStyle = grad(c, 0, 190, 0, 260, ['#C99DFF', '#8E5ED6']); rr(c, 50, 196, 290, 64, 18); c.fill();
      c.fillStyle = '#fff'; rr(c, 72, 166, 82, 40, 20); c.fill();
      c.save(); c.translate(118, 172); c.rotate(-.25);
      kid(c, 0, 62, 21, { T: t, eyes: 'closed', mouth: 'smile', arms: false, legs: 'none' }); c.restore();
      const bl = Math.sin(t * 1.6) * 2;
      c.fillStyle = grad(c, 0, 180, 0, 250, ['#8FD0FF', '#4C9BE8']); c.beginPath(); c.moveTo(118, 196 + bl); c.quadraticCurveTo(240, 168 + bl, 336, 196); c.lineTo(336, 246); c.lineTo(118, 246); c.closePath(); c.fill();
      c.fillStyle = 'rgba(255,255,255,.35)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(150 + i * 32, 214 + (i % 2) * 10, 5, 0, TAU); c.fill(); }
      for (let i = 0; i < 3; i++) { const k = (t * .45 + i / 3) % 1; c.save(); c.globalAlpha = Math.sin(k * Math.PI); c.font = `900 ${12 + k * 12}px ${EN_FONT}`; c.fillStyle = '#E8E6FF'; c.fillText('z', 150 + k * 40, 130 - k * 50); c.restore(); }
    },
    wake(c, t) {
      room(c, ['#FFE9C2', '#FFD49A'], ['#E8C79A', '#D3A877']);
      const rise = Math.min(1, (t % 8) / 3);
      windowFrame(c, 270, 34, 96, 76, () => { sky(c, '#FFB86B', '#FFE7A8', 110); c.fillStyle = '#FFD84A'; c.beginPath(); c.arc(318, 120 - rise * 50, 22, 0, TAU); c.fill(); puff(c, 290, 60, 10); });
      c.fillStyle = grad(c, 0, 120, 0, 230, ['#FFB4CE', '#E27AA3']); rr(c, 50, 120, 22, 120, 10); c.fill();
      shadow(c, 190, 268, 150, 14, .2);
      c.fillStyle = grad(c, 0, 190, 0, 260, ['#C99DFF', '#8E5ED6']); rr(c, 50, 196, 290, 64, 18); c.fill();
      c.fillStyle = '#fff'; rr(c, 72, 160, 70, 40, 20); c.fill();
      const st = Math.sin(t * 2) * .15;
      kid(c, 168, 214, 24, { T: t, hL: [-1.05, -3.7 + st], hR: [1.05, -3.7 + st], eyes: 'happy', mouth: 'o', legs: 'none' });
      c.fillStyle = grad(c, 0, 190, 0, 250, ['#8FD0FF', '#4C9BE8']); c.beginPath(); c.moveTo(110, 206); c.quadraticCurveTo(240, 186, 336, 200); c.lineTo(336, 246); c.lineTo(110, 246); c.closePath(); c.fill();
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + t * .5; c.strokeStyle = 'rgba(255,200,60,.5)'; c.lineWidth = 3; c.beginPath(); c.moveTo(168 + Math.cos(a) * 62, 150 + Math.sin(a) * 62); c.lineTo(168 + Math.cos(a) * 72, 150 + Math.sin(a) * 72); c.stroke(); }
    },
    out(c, t) {
      sky(c, '#8FD3FF', '#E1F5FF', 200); puff(c, 70, 50, 16); puff(c, 330, 70, 12);
      c.fillStyle = grad(c, 0, 196, 0, VH, ['#A4E36A', '#5DBB3A']); c.fillRect(0, 196, VW, VH - 196);
      // واجهة البيت
      c.fillStyle = grad(c, 0, 60, 0, 210, ['#FFF4E0', '#F6D9B0']); rr(c, 40, 70, 220, 140, 8); c.fill();
      c.fillStyle = '#E56B5B'; c.beginPath(); c.moveTo(26, 76); c.lineTo(150, 18); c.lineTo(274, 76); c.closePath(); c.fill();
      windowFrame(c, 60, 100, 46, 40, () => { c.fillStyle = '#BEE6FF'; c.fillRect(60, 100, 46, 40); });
      door(c, 160, 110, 66, 100, .45, undefined, () => { c.fillStyle = grad(c, 0, 110, 0, 210, ['#FFE9C2', '#F2C98F']); c.fillRect(160, 110, 66, 100); });
      c.fillStyle = '#D8C3A5'; c.beginPath(); c.moveTo(170, 210); c.lineTo(216, 210); c.lineTo(260, VH); c.lineTo(150, VH); c.closePath(); c.fill();
      emo(c, '🌳', 345, 170, 70); emo(c, '🌷', 30, 222, 22); emo(c, '🌼', 120, 228, 18);
      const w = Math.sin(t * 6) * .35;
      const h = kid(c, 240, 238, 23, { T: t, hR: [1.25, -2.75 + w], hL: [-.5, -1.2], legs: 'walk', mouth: 'open', eyes: 'happy' });
      emo(c, '🎒', 218, 196, 28);
    },
    in(c, t) {
      room(c, ['#E3F6EE', '#C8EBDD'], ['#E8C79A', '#D3A877']);
      emo(c, '🛋️', 90, 190, 70); emo(c, '🖼️', 90, 80, 40);
      door(c, 270, 92, 76, 130, .4, undefined, () => { sky(c, '#8FD3FF', '#E8F8FF', 222); c.fillStyle = '#7CCB5A'; c.fillRect(270, 190, 76, 40); });
      c.fillStyle = '#B9E3F5'; rr(c, 230, 240, 120, 14, 7); c.fill();
      const w = Math.sin(t * 5) * .3;
      kid(c, 236, 236, 24, { T: t, hL: [-1.25, -2.8 + w], hR: [.8, -.4], legs: 'walk', mouth: 'open', eyes: 'happy', lookX: -1 });
      bubbleText(c, 150, 92, 'السلام عليكم 👋', '#1E8E72', 14);
    },
    wcin(c, t) {
      room(c, ['#E6F4FF', '#CDE6F7'], ['#BFD6E8', '#9FBBD3']);
      c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 1.5; for (let y = 20; y < 216; y += 26) { c.beginPath(); c.moveTo(0, y); c.lineTo(VW, y); c.stroke(); }
      door(c, 228, 70, 92, 152, 0, ['#8ED1C2', '#5CB3A2']);
      c.fillStyle = '#fff'; rr(c, 252, 86, 44, 30, 8); c.fill(); emo(c, '🚻', 274, 101, 22);
      const st = Math.sin(t * 3) * .1;
      kid(c, 150, 238, 25, { T: t, hL: [-.7, -.2], hR: [.85, -.4 + st], lookX: 1, eyes: 'open', mouth: 'smile' });
      emo(c, '🧴', 362, 200, 26);
    },
    wcout(c, t) {
      room(c, ['#E6F4FF', '#CDE6F7'], ['#BFD6E8', '#9FBBD3']);
      c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = 1.5; for (let y = 20; y < 216; y += 26) { c.beginPath(); c.moveTo(0, y); c.lineTo(VW, y); c.stroke(); }
      door(c, 60, 70, 92, 152, .45, ['#8ED1C2', '#5CB3A2'], () => { c.fillStyle = '#DDF0FA'; c.fillRect(60, 70, 92, 152); emo(c, '🚽', 110, 190, 40); });
      c.fillStyle = '#fff'; rr(c, 160, 86, 40, 28, 8); c.fill(); emo(c, '🚻', 180, 100, 20);
      kid(c, 250, 238, 25, { T: t, hL: [-.3, -.55], hR: [.3, -.55], eyes: 'happy', mouth: 'smile', legs: 'walk' });
      for (let i = 0; i < 5; i++) { const k = (t * .4 + i / 5) % 1; c.globalAlpha = 1 - k; c.strokeStyle = '#8FD3FF'; c.fillStyle = 'rgba(200,235,255,.5)'; c.lineWidth = 2; c.beginPath(); c.arc(230 + i * 12 + Math.sin(t * 2 + i) * 6, 200 - k * 90, 5 + i % 3 * 2, 0, TAU); c.fill(); c.stroke(); c.globalAlpha = 1; }
    },
    dress(c, t) {
      room(c, ['#F4ECFF', '#E2D2FF'], ['#E8C79A', '#D3A877']);
      // خزانة
      c.fillStyle = grad(c, 40, 0, 140, 0, ['#F2C48A', '#D59A5A']); rr(c, 34, 60, 110, 162, 10); c.fill();
      c.strokeStyle = 'rgba(100,60,20,.3)'; c.lineWidth = 2; c.beginPath(); c.moveTo(89, 66); c.lineTo(89, 216); c.stroke();
      c.fillStyle = '#FFE08A'; c.beginPath(); c.arc(82, 140, 4, 0, TAU); c.arc(96, 140, 4, 0, TAU); c.fill();
      emo(c, '🪞', 340, 150, 60);
      const pull = (Math.sin(t * 1.6) + 1) / 2;
      kid(c, 215, 238, 25, { T: t, hL: [-.55, -3.55 + pull * .5], hR: [.55, -3.55 + pull * .5], eyes: 'happy', mouth: 'smile' });
      emo(c, '👕', 215, 238 - 25 * (3.75 - pull * .5), 46);
      for (let i = 0; i < 4; i++) { const k = (t * .5 + i / 4) % 1; c.globalAlpha = Math.sin(k * Math.PI); emo(c, '✨', 160 + i * 34, 90 - k * 30 + (i % 2) * 20, 13); c.globalAlpha = 1; }
    },
    sneeze(c, t) {
      room(c, ['#FFF6D9', '#FFE9AE'], ['#E8C79A', '#D3A877']);
      windowFrame(c, 40, 44, 80, 66, () => { sky(c, '#8FD3FF', '#E1F5FF', 110); puff(c, 76, 76, 12); });
      const ph = (t % 3) / 3, ach = ph > .55 && ph < .8;
      kid(c, 210, 238, 26, { T: t, tilt: ach ? .12 : -.05, hR: [.18, -2.15], hL: [-.8, -.2], eyes: ach ? 'squeeze' : 'closed', mouth: ach ? 'open' : 'o' });
      c.fillStyle = '#fff'; c.save(); c.translate(214, 238 - 26 * 2.12); c.rotate(.2); rr(c, -9, -8, 22, 18, 5); c.fill(); c.strokeStyle = '#D6E6F2'; c.lineWidth = 1.5; c.stroke(); c.restore();
      if (ach) {
        c.strokeStyle = '#FF9F43'; c.lineWidth = 3; c.lineCap = 'round';
        for (let i = 0; i < 5; i++) { const a = -.9 + i * .45; c.beginPath(); c.moveTo(246 + Math.cos(a) * 18, 168 + Math.sin(a) * 18); c.lineTo(246 + Math.cos(a) * 34, 168 + Math.sin(a) * 34); c.stroke(); }
        c.save(); c.font = `900 22px ${EN_FONT}`; c.fillStyle = '#FF7A3D'; c.fillText('Achoo!', 270, 110); c.restore();
      }
      emo(c, '🧻', 330, 210, 34);
    },
    hear(c, t) {
      room(c, ['#E8F7EC', '#CFEED8'], ['#E8C79A', '#D3A877']);
      emo(c, '🪴', 40, 196, 44);
      const ph = (t % 3) / 3, ach = ph > .5 && ph < .75;
      kid(c, 300, 238, 21, { look: buddy(), T: t, ph: 2, tilt: ach ? .14 : 0, hL: [-.15, -2.1], hR: [.8, -.2], eyes: ach ? 'squeeze' : 'closed', mouth: ach ? 'open' : 'o' });
      if (ach) { c.save(); c.font = `900 18px ${EN_FONT}`; c.fillStyle = '#FF7A3D'; c.fillText('Achoo!', 248, 120); c.restore(); }
      else bubbleText(c, 300, 118, 'الحمد لله', '#1E8E72', 13);
      kid(c, 130, 238, 25, { T: t, hL: [-.9, -1.3], hR: [.95, -1.3], eyes: 'open', mouth: 'smile', lookX: 1.4 });
    },
    reply(c, t) {
      room(c, ['#E8F7EC', '#CFEED8'], ['#E8C79A', '#D3A877']);
      emo(c, '🖼️', 345, 70, 36);
      kid(c, 300, 238, 22, { look: buddy(), T: t, ph: 2, hL: [-.95, -1.4], hR: [.8, -.2], eyes: 'happy', mouth: 'open', lookX: -1.4 });
      bubbleText(c, 292, 112, 'يرحمك الله', '#1E8E72', 13);
      kid(c, 135, 238, 25, { T: t, hL: [-.75, -.2], hR: [.8, -.9], eyes: 'happy', mouth: 'smile', lookX: 1.4 });
      c.fillStyle = '#fff'; rr(c, 150, 200, 18, 15, 4); c.fill();
    },
    car(c, t) {
      sky(c, '#8FD3FF', '#E8F8FF', 190);
      const sh = (t * 60) % 400;
      for (const [x, s] of [[80, 16], [260, 12], [420, 14]]) puff(c, ((x - sh * .2) % 460 + 460) % 460 - 30, 50 + s, s);
      c.fillStyle = '#9EDB7E'; c.beginPath(); c.moveTo(0, 190); for (let i = 0; i <= 20; i++) c.lineTo(i * 20, 175 + Math.sin(i * .9 + t * .3) * 8); c.lineTo(VW, 200); c.lineTo(0, 200); c.fill();
      for (let i = 0; i < 5; i++) emo(c, '🌳', ((i * 110 - sh * .6) % 550 + 550) % 550 - 40, 172, 40);
      c.fillStyle = '#6B7280'; c.fillRect(0, 200, VW, 100); c.fillStyle = '#9EDB7E'; c.fillRect(0, 196, VW, 8);
      c.fillStyle = '#FFF'; for (let i = 0; i < 8; i++) { const x = ((i * 70 - sh * 2) % 560 + 560) % 560 - 60; c.fillRect(x, 262, 36, 6); }
      // السيارة
      const bob = Math.sin(t * 14) * 1.2, cx = 200, cy = 230 + bob;
      shadow(c, cx, 262, 120, 10, .3);
      c.fillStyle = grad(c, 0, cy - 90, 0, cy, ['#FF8A8A', '#E5484D']);
      c.beginPath(); c.moveTo(cx - 110, cy); c.lineTo(cx - 112, cy - 36); c.quadraticCurveTo(cx - 108, cy - 48, cx - 90, cy - 50);
      c.lineTo(cx - 60, cy - 92); c.quadraticCurveTo(cx - 52, cy - 100, cx - 38, cy - 100); c.lineTo(cx + 40, cy - 100); c.quadraticCurveTo(cx + 56, cy - 100, cx + 66, cy - 88);
      c.lineTo(cx + 92, cy - 52); c.quadraticCurveTo(cx + 114, cy - 50, cx + 116, cy - 32); c.lineTo(cx + 114, cy); c.closePath(); c.fill();
      // النافذة والطفل
      c.save(); c.beginPath(); c.moveTo(cx - 50, cy - 52); c.lineTo(cx - 34, cy - 88); c.lineTo(cx + 36, cy - 88); c.lineTo(cx + 62, cy - 52); c.closePath();
      c.fillStyle = '#CFEFFF'; c.fill(); c.clip();
      kid(c, cx + 6, cy + 2, 17, { T: t, eyes: 'happy', mouth: 'open', hR: [.9, -1.4], hL: [-.7, -1.2] });
      c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.moveTo(cx - 30, cy - 52); c.lineTo(cx - 14, cy - 88); c.lineTo(cx - 2, cy - 88); c.lineTo(cx - 18, cy - 52); c.fill();
      c.restore();
      c.fillStyle = 'rgba(255,255,255,.35)'; rr(c, cx - 96, cy - 44, 190, 6, 3); c.fill();
      c.fillStyle = '#FFE08A'; c.beginPath(); c.ellipse(cx + 110, cy - 26, 6, 8, 0, 0, TAU); c.fill();
      for (const wx of [cx - 66, cx + 70]) {
        c.fillStyle = '#2D2F36'; c.beginPath(); c.arc(wx, cy + 2, 22, 0, TAU); c.fill();
        c.fillStyle = '#C9CED8'; c.beginPath(); c.arc(wx, cy + 2, 10, 0, TAU); c.fill();
        c.strokeStyle = '#8B93A1'; c.lineWidth = 2.5; c.save(); c.translate(wx, cy + 2); c.rotate(t * 10); c.beginPath(); c.moveTo(-9, 0); c.lineTo(9, 0); c.moveTo(0, -9); c.lineTo(0, 9); c.stroke(); c.restore();
      }
      for (let i = 0; i < 3; i++) { const k = (t * 2 + i / 3) % 1; c.globalAlpha = 1 - k; c.fillStyle = '#E5E7EB'; c.beginPath(); c.arc(cx - 122 - k * 40, cy - 10 - k * 6, 5 + k * 6, 0, TAU); c.fill(); c.globalAlpha = 1; }
    },
    rain(c, t) {
      sky(c, '#9FB8D6', '#DCE7F2', 205);
      puff(c, 90, 52, 22, '#EEF3F8', 'rgba(120,140,170,.6)'); puff(c, 290, 40, 26, '#EEF3F8', 'rgba(120,140,170,.6)');
      c.fillStyle = grad(c, 0, 200, 0, VH, ['#8FD06A', '#4FA53A']); c.fillRect(0, 200, VW, VH - 200);
      c.fillStyle = 'rgba(120,180,230,.6)'; c.beginPath(); c.ellipse(90, 262, 46, 10, 0, 0, TAU); c.ellipse(320, 276, 36, 8, 0, 0, TAU); c.fill();
      emo(c, '🌻', 40, 216, 30); emo(c, '🌷', 360, 214, 26); emo(c, '🌱', 300, 236, 22);
      c.strokeStyle = 'rgba(70,130,210,.65)'; c.lineWidth = 2; c.lineCap = 'round';
      for (let i = 0; i < 46; i++) { const x = (i * 53) % VW, y = ((i * 97 + t * 260) % 300) - 20; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 3, y + 11); c.stroke(); }
      const hd = kid(c, 200, 238, 25, { T: t, hR: [.55, -1.7], hL: [-1.25, -1.9], eyes: 'happy', mouth: 'open', lookY: -1 });
      // المظلة
      const ux = 200 + 25 * .55, uy = 238 - 25 * 1.7;
      c.strokeStyle = '#6B4A2E'; c.lineWidth = 4; c.beginPath(); c.moveTo(ux, uy + 8); c.lineTo(ux - 6, uy - 92); c.stroke();
      const cx = ux - 8, cy = uy - 96, R = 72, cols = ['#FF6B8B', '#FFC93C', '#4FC3F7', '#7ED957', '#B28DFF'];
      for (let i = 0; i < 5; i++) {
        c.fillStyle = cols[i]; c.beginPath(); c.moveTo(cx, cy);
        c.arc(cx, cy, R, Math.PI + i * Math.PI / 5, Math.PI + (i + 1) * Math.PI / 5); c.closePath(); c.fill();
      }
      c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.arc(cx, cy, R, Math.PI, Math.PI * 1.45); c.lineTo(cx, cy); c.fill();
      c.fillStyle = '#9FB8D6'; for (let i = 0; i < 5; i++) { c.beginPath(); c.arc(cx - R + R * .2 + i * R * .4, cy + 2, R * .2, Math.PI, 0); c.fill(); }
      for (let i = 0; i < 4; i++) { const k = (t * 1.5 + i / 4) % 1; c.fillStyle = `rgba(80,150,230,${1 - k})`; c.beginPath(); c.arc(200 - 25 * 1.25 + (i - 1.5) * 6, 238 - 25 * 1.9 - 30 + k * 26, 2.5, 0, TAU); c.fill(); }
    },
    study(c, t) {
      room(c, ['#E9F1FF', '#D5E3FF'], ['#E8C79A', '#D3A877']);
      emo(c, '🗺️', 80, 70, 48); emo(c, '🕰️', 330, 60, 34);
      kid(c, 200, 238, 25, { T: t, hL: [-.55, -.95], hR: [.6, -.95 + Math.sin(t * 4) * .06], eyes: 'down', mouth: 'smile' });
      table(c, 214, 70, 330);
      c.save(); c.translate(200, 212); c.fillStyle = '#fff'; c.beginPath(); c.moveTo(-50, 0); c.quadraticCurveTo(-25, -12, 0, -4); c.quadraticCurveTo(25, -12, 50, 0); c.lineTo(50, 6); c.lineTo(-50, 6); c.fill();
      c.strokeStyle = '#4C9BE8'; c.lineWidth = 3; c.beginPath(); c.moveTo(-50, 5); c.lineTo(50, 5); c.stroke();
      c.strokeStyle = 'rgba(80,100,140,.4)'; c.lineWidth = 1.5; for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-42, -2 - i * 3 + 2); c.lineTo(-10, -4 - i * 3 + 2); c.moveTo(10, -4 - i * 3 + 2); c.lineTo(42, -2 - i * 3 + 2); c.stroke(); }
      c.restore();
      emo(c, '✏️', 270, 204, 26, .8); emo(c, '📚', 120, 196, 34);
      // مصباح
      c.fillStyle = '#5A6B8C'; c.fillRect(312, 150, 5, 64); c.fillStyle = grad(c, 0, 130, 0, 160, ['#FFD45C', '#F2A90F']); c.beginPath(); c.moveTo(296, 156); c.lineTo(334, 156); c.lineTo(324, 130); c.lineTo(306, 130); c.fill();
      c.fillStyle = 'rgba(255,230,140,.25)'; c.beginPath(); c.moveTo(298, 158); c.lineTo(332, 158); c.lineTo(360, 214); c.lineTo(260, 214); c.fill();
      for (let i = 0; i < 3; i++) { const k = (t * .4 + i / 3) % 1; c.globalAlpha = Math.sin(k * Math.PI); emo(c, ['💡', '⭐', '🌟'][i], 150 + i * 50, 120 - k * 40, 16); c.globalAlpha = 1; }
    }
  };

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #duas{background:linear-gradient(#E3F7F1,#FFF8EA);overflow:hidden;color:#24433B}
  #duas::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 15% 20%,rgba(255,255,255,.8),transparent 40%),radial-gradient(circle at 85% 80%,rgba(255,226,160,.35),transparent 45%);pointer-events:none}
  #duas .ib{color:#178A73}
  #duas .lang{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 rgba(20,90,70,.16),0 8px 16px rgba(20,90,70,.12)}
  #duas .lang button{min-width:64px;padding:6px 12px;border-radius:99px;font-weight:900;font-size:17px;background:#EEF8F4;color:#2E7A64;line-height:1.25}
  #duas .lang button[data-l=en]{font-family:${EN_FONT};font-size:16px}
  #duas .lang button.on{background:linear-gradient(#3FCBA8,#159C80);color:#fff;box-shadow:0 3px 0 #0E6F5A}
  #duas .prog{position:absolute;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 58px);display:flex;gap:5px;padding:6px 10px;background:rgba(255,255,255,.92);border-radius:99px;z-index:4;box-shadow:0 3px 0 rgba(0,0,0,.06),0 6px 14px rgba(0,0,0,.06)}
  #duas .prog i{width:22px;height:11px;border-radius:6px;background:#E2E9E6;box-shadow:inset 0 2px 0 rgba(0,0,0,.07)}
  #duas .prog i.on{background:linear-gradient(#FFD36B,#F2A20F);box-shadow:0 2px 0 #C67F00;animation:duPop .45s cubic-bezier(.3,1.8,.5,1)}
  #duas .prog i.no{background:linear-gradient(#FFB4A8,#F27A68);box-shadow:0 2px 0 #C2503F}
  @keyframes duPop{40%{transform:scale(1.5,1.3)}}
  #duas .main{position:absolute;left:0;right:0;bottom:0;top:calc(max(10px,env(safe-area-inset-top)) + 92px);display:flex;flex-direction:column;align-items:center;gap:10px;padding:0 14px max(14px,env(safe-area-inset-bottom));overflow-y:auto;touch-action:pan-y}
  #duas .stage{width:min(100%,520px);flex:none;display:flex;flex-direction:column;align-items:center;gap:8px}
  #duas .cap{display:inline-flex;align-items:center;gap:8px;background:#fff;border-radius:99px;padding:5px 16px 5px 6px;font-weight:900;font-size:19px;color:#146B59;box-shadow:0 4px 0 #BFE9DC,0 6px 14px rgba(20,90,70,.1);border:3px solid #DDF5EC;max-width:100%}
  #duas .cap .ci{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#E9FAF4;font-size:20px;font-family:${EMOJI_FONT};flex:none}
  #duas .cap.en{direction:ltr;font-family:${EN_FONT};font-size:17px;padding:5px 6px 5px 16px}
  #duas .scard{position:relative;width:100%;aspect-ratio:4/3;border-radius:30px;background:#fff;padding:8px;box-shadow:0 7px 0 #A9DCCB,0 14px 28px rgba(20,90,70,.18);border:4px solid #CFEFE3}
  #duas .scard canvas{width:100%;height:100%;display:block;border-radius:22px}
  #duas .side{width:min(100%,520px);display:flex;flex-direction:column;gap:9px;align-items:stretch}
  #duas .ask{display:flex;align-items:center;justify-content:center;gap:8px;font-weight:900;font-size:19px;color:#1C6B5A}
  #duas .ask.en{font-family:${EN_FONT};direction:ltr}
  #duas .ask .sayb{width:46px;height:46px;flex:0 0 46px;font-size:21px}
  #duas .card{position:relative;background:#fff;border-radius:22px;border:3px solid #DDEFE8;box-shadow:0 5px 0 #C5E3D8,0 8px 16px rgba(20,80,60,.08);padding:10px 14px 10px 54px;text-align:right;font-weight:800;font-size:clamp(19px,5.4vw,25px);line-height:1.75;color:#1E3E36;transition:background .2s,border-color .2s;min-height:62px}
  #duas .card::after{content:'';position:absolute;left:14px;top:50%;margin-top:-14px;width:28px;height:28px;border-radius:50%;border:3px solid #CFE6DE;background:#F6FBF9}
  #duas .card small{display:block;direction:ltr;text-align:left;font-family:${EN_FONT};font-size:14px;line-height:1.3;color:#5C7D73;font-weight:700;margin-top:2px}
  #duas .card:active{transform:translateY(3px);box-shadow:0 2px 0 #C5E3D8}
  #duas .card.ok{background:#E3F9EA;border-color:#4CC37A;box-shadow:0 5px 0 #34A35F;animation:pop .4s cubic-bezier(.3,1.8,.6,1)}
  #duas .card.ok::after{content:'✓';border-color:#34A35F;background:#4CC37A;color:#fff;font-size:18px;font-weight:900;display:grid;place-items:center}
  #duas .card.no{background:#FFEDEA;border-color:#F28B7B;box-shadow:0 5px 0 #D9675A;animation:duShake .4s;opacity:.7}
  #duas .card.dim{opacity:.45}
  @keyframes duShake{20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
  #duas .lbox{background:linear-gradient(#FFFFFF,#FFFBF1);border-radius:26px;border:4px solid #F6E3B4;box-shadow:0 6px 0 #EBCB82,0 12px 22px rgba(120,90,20,.12);padding:12px 14px 12px;text-align:center}
  #duas .lbox .du{font-size:clamp(24px,7vw,34px);font-weight:900;line-height:1.8;color:#3F3A2A;direction:rtl}
  #duas .lbox .du span{transition:color .25s,text-shadow .25s;border-radius:8px;padding:0 1px}
  #duas .lbox .du span.on{color:#0E8C70;text-shadow:0 0 14px rgba(60,220,170,.55)}
  #duas .lbox .mean{direction:ltr;font-family:${EN_FONT};font-size:16px;font-weight:700;color:#6B6248;margin-top:4px;line-height:1.4}
  #duas .lbox .mean span.on{color:#C47A00}
  #duas .lbox .mean:empty{display:none}
  #duas .nav{display:flex;gap:10px;justify-content:center;align-items:center}
  #duas .nb{height:50px;border-radius:25px;font-size:18px;font-weight:900;padding:0 18px;background:#fff;color:#178A73;box-shadow:0 4px 0 #BFE3D6;border:3px solid #DDF3EB;display:flex;align-items:center;gap:6px;white-space:nowrap}
  #duas .nb:active{transform:translateY(3px);box-shadow:0 1px 0 #BFE3D6}
  #duas .nb.go{background:linear-gradient(#3FCBA8,#159C80);color:#fff;box-shadow:0 4px 0 #0E6F5A;border-color:#8FE6CF;flex:1;justify-content:center;max-width:260px}
  #duas .nb.go.glow{animation:duGlow .9s ease-in-out infinite alternate}
  @keyframes duGlow{to{transform:scale(1.04);box-shadow:0 4px 0 #0E6F5A,0 0 22px rgba(40,200,160,.7)}}
  #duas .nb.play{width:50px;padding:0;justify-content:center;font-size:22px}
  #duas .lcount{font-weight:900;color:#5C8A7C;font-size:15px}
  #duas .hidden{display:none!important}
  #duas .overlay{background:radial-gradient(circle at 50% 45%,rgba(20,80,70,.25),rgba(10,50,45,.5))}
  #duas .panel{border:5px solid #CFEFE3;box-shadow:0 8px 0 #8ED3BD,0 20px 40px rgba(10,60,50,.3);color:#24433B}
  #duas .panel h3{color:#159C80;text-shadow:0 3px 0 #D4F4EA}
  #duas .btn{background:linear-gradient(#3FCBA8,#159C80);box-shadow:0 5px 0 #0E6F5A,0 8px 12px rgba(20,120,100,.25)}
  #duas .btn:active{box-shadow:0 1px 0 #0E6F5A}
  #duas .btn.alt{background:#fff;color:#178A73;box-shadow:0 5px 0 #BFE3D6;border:3px solid #DDF3EB}
  #duas .lvp{width:min(94vw,440px);max-height:88vh;overflow-y:auto;touch-action:pan-y}
  #duas .lvg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:10px 0 12px}
  #duas .lvb{position:relative;border-radius:20px;background:#fff;border:3px solid #CFEFE3;box-shadow:0 5px 0 #A9DCCB;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#1C6B5A;font-weight:900;padding:8px 4px 6px;gap:1px}
  #duas .lvb:active{transform:translateY(3px)}
  #duas .lvb .n{font-size:13px;position:absolute;top:3px;right:9px;opacity:.6}
  #duas .lvb .e{font-size:30px;line-height:1.2;font-family:${EMOJI_FONT}}
  #duas .lvb .t{font-size:13px;line-height:1.2}
  #duas .lvb .s{font-size:11px;letter-spacing:-1px;height:12px;line-height:1}
  #duas .lvb .s i{font-style:normal}#duas .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #duas .lvb.cur{outline:3px solid #F2A20F;outline-offset:2px}
  #duas .lvb.lock{background:#EEF2F0;border-color:#DCE3E0;box-shadow:0 5px 0 #C8D2CE;color:#8A9893}
  #duas .lvb.lock .e{filter:grayscale(1);opacity:.35}
  #duas .lvb.lock::after{content:'🔒';position:absolute;font-size:16px;top:4px;left:7px}
  #duas .learnb{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:11px;border-radius:18px;background:linear-gradient(#FFE08A,#F6B92B);color:#6B4300;font-size:18px;font-weight:900;box-shadow:0 4px 0 #C98A0B;margin-bottom:8px}
  #duas .wdu{font-size:24px;font-weight:900;color:#3F3A2A;line-height:1.7;margin:4px 0 2px}
  @media (orientation:landscape) and (min-width:700px){
    #duas .main{flex-direction:row;justify-content:center;align-items:center;gap:26px;padding-top:6px}
    #duas .stage{width:min(46vw,calc((100vh - 150px) * 1.33),560px)}
    #duas .side{width:min(42vw,480px)}
  }
  `);
  const root = App.section(ID, `
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🔢</button>
      <button class="ib bookb" aria-label="تعلّم الأدعية">📖</button>
      <span class="grow"></span>
      <div class="lang"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="prog"></div>
    <div class="main">
      <div class="stage"><div class="cap"><span class="ci"></span><span class="ct"></span></div><div class="scard"><canvas></canvas></div></div>
      <div class="side">
        <div class="quiz">
          <div class="ask"><button class="ib snd sayb" aria-label="اسمع">🔊</button><span class="at"></span></div>
          <div class="cards" style="display:flex;flex-direction:column;gap:10px;margin-top:8px"></div>
        </div>
        <div class="learn hidden">
          <div class="lbox"><div class="du"></div><div class="mean"></div></div>
          <div class="nav" style="margin-top:12px">
            <button class="nb prev" aria-label="السابق">▶</button>
            <button class="ib snd nb play" aria-label="اسمع">🔊</button>
            <button class="nb go"></button>
          </div>
          <div class="lcount" style="text-align:center;margin-top:8px"></div>
        </div>
      </div>
    </div>
    <div class="overlay" id="duLv"><div class="panel lvp"><h3>🔢 المستويات</h3>
      <button class="learnb" data-a="book">📖 تعلّم كل الأدعية</button><div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="duWin"><div class="panel">
      <h3 class="wT"></h3><div style="font-size:54px;line-height:1.1;font-family:${EMOJI_FONT}">🤲</div><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('.scard canvas');
  const progEl = root.querySelector('.prog'), capEl = root.querySelector('.cap');
  const quizEl = root.querySelector('.quiz'), learnEl = root.querySelector('.learn');
  const cardsEl = root.querySelector('.cards'), askT = root.querySelector('.at'), askEl = root.querySelector('.ask');
  const duEl = root.querySelector('.lbox .du'), meanEl = root.querySelector('.lbox .mean');
  const goBtn = root.querySelector('.nb.go'), prevBtn = root.querySelector('.nb.prev'), cntEl = root.querySelector('.lcount');
  const lvOv = root.querySelector('#duLv'), winOv = root.querySelector('#duWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, def = LEVELS[0], mode = 'quiz';   // quiz | intro (تعلّم قبل الأسئلة) | book (كتاب الأدعية)
  let cur = DUAS[0], qs = [], qi = 0, mistakes = 0, over = false, answered = false, tries = 0;
  let li = 0, list = [], tasks = [], kara = null, sceneT = 0, flash = 0, sparkles = [];
  function later(s, fn) { tasks.push({ t: s, fn }); }

  /* ---------- النطق ---------- */
  const sayCap = d => lang === 'ar' ? App.speak(d.ca) : App.speak(d.ce, 'en');
  const sayAsk = () => lang === 'ar' ? App.speak('ماذا نقول؟') : App.speak('What do we say?', 'en');
  /* يقرأ الدعاء بالعربية مع تظليل الكلمات، ثم معناه بالإنجليزية في وضع English */
  function readDua(d, after) {
    const a = arDur(d), e = lang === 'en' ? enDur(d.en) : 0;
    App.speak(d.p);
    kara = { d, t: 0, a, e, n: d.t.split(' ').length, ne: d.en.split(' ').length };
    if (lang === 'en') later(a + .35, () => { if (kara && kara.d === d) App.speak(d.en, 'en'); });
    const total = a + (e ? e + .35 : 0);
    if (after) later(total + .5, after);
    return total;
  }
  function showDua(d) {
    duEl.innerHTML = d.t.split(' ').map(w => `<span>${esc(w)}</span>`).join(' ');
    meanEl.innerHTML = lang === 'en' ? d.en.split(' ').map(w => `<span>${esc(w)}</span>`).join(' ') : '';
  }

  /* ---------- اللوحة والمشهد ---------- */
  function setScene(d) {
    cur = d; sceneT = 0; flash = 1;
    capEl.classList.toggle('en', lang === 'en');
    capEl.querySelector('.ci').textContent = d.i;
    capEl.querySelector('.ct').textContent = lang === 'ar' ? d.ca : d.ce;
  }
  function layout() { const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr; }
  function setProg(n, states) {
    progEl.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    progEl.innerHTML = Array.from({ length: n }, (_, i) => `<i class="${states[i] || ''}"></i>`).join('');
    progEl.style.display = n ? '' : 'none';
  }
  let pstates = [];

  /* ---------- المستوى ---------- */
  function startLevel(n, skipIntro) {
    lvl = clamp(n, 1, LEVELS.length); def = LEVELS[lvl - 1];
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    tasks = []; kara = null; mistakes = 0; over = false;
    qs = []; let prev = null;
    while (qs.length < def.q) {
      const bag = shuffle(def.ids.slice());
      for (const id of bag) { if (qs.length >= def.q) break; if (id === prev && bag.length > 1) continue; qs.push(id); prev = id; }
    }
    qi = 0; pstates = [];
    setProg(def.q, pstates);
    if (!def.review && !skipIntro) { list = def.ids.map(id => BY[id]); li = 0; setMode('intro'); showLearn(); }
    else { setMode('quiz'); later(.3, ask); }
    Sound.whoosh();
  }
  function setMode(m) {
    mode = m;
    quizEl.classList.toggle('hidden', m !== 'quiz');
    learnEl.classList.toggle('hidden', m === 'quiz');
    progEl.style.visibility = m === 'book' ? 'hidden' : '';
  }
  /* ----- التعلّم ----- */
  function showLearn() {
    const d = list[li]; tasks = []; kara = null;
    setScene(d); showDua(d);
    prevBtn.style.visibility = li > 0 ? '' : 'hidden';
    const lastOne = li >= list.length - 1;
    goBtn.textContent = mode === 'intro' ? (lastOne ? 'هيا نختبر! ◀' : 'التالي ◀') : (lastOne ? 'إغلاق ✓' : 'التالي ◀');
    goBtn.classList.remove('glow');
    cntEl.textContent = `${num(li + 1)} / ${num(list.length)}`;
    if (mode === 'book') { const seen = store.get('duasSeen', []); if (!seen.includes(d.id)) { seen.push(d.id); store.set('duasSeen', seen); if (seen.length >= DUAS.length) App.achieve('duas_learn'); } }
    sayCap(d);
    later(lang === 'ar' ? 1.5 : 1.6, () => readDua(d, () => goBtn.classList.add('glow')));
  }
  goBtn.addEventListener('click', () => {
    Sound.tap();
    if (li < list.length - 1) { li++; showLearn(); return; }
    if (mode === 'intro') { setMode('quiz'); tasks = []; kara = null; later(.2, ask); }
    else { // نهاية الكتاب
      setMode('quiz'); tasks = []; kara = null; startLevel(lvl, true);
    }
  });
  prevBtn.addEventListener('click', () => { if (li > 0) { Sound.tap(); li--; showLearn(); } });
  root.querySelector('.nb.play').addEventListener('click', () => { const d = list[li]; tasks = []; showDua(d); readDua(d, () => goBtn.classList.add('glow')); });
  function openBook(start = 0) {
    lvOv.classList.remove('on'); winOv.classList.remove('on');
    list = DUAS.slice(); li = start; setMode('book'); showLearn();
  }

  /* ----- الأسئلة ----- */
  function ask() {
    if (qi >= qs.length) { win(); return; }
    const d = BY[qs[qi]]; answered = false; tries = 0; kara = null;
    setScene(d);
    // البطاقات: الصحيحة + بدائل من عائلات مختلفة
    const seenTxt = new Set([d.p]), seenFam = new Set([d.fam]);
    const pool = shuffle(DUAS.filter(x => def.ids.includes(x.id))).concat(shuffle(DUAS.filter(x => !def.ids.includes(x.id))));
    const opts = [d];
    for (const x of pool) {
      if (opts.length >= def.ch) break;
      if (seenTxt.has(x.p) || seenFam.has(x.fam)) continue;
      seenTxt.add(x.p); seenFam.add(x.fam); opts.push(x);
    }
    shuffle(opts);
    askEl.classList.toggle('en', lang === 'en');
    askT.textContent = lang === 'ar' ? 'ماذا نقول؟ 🤔' : 'What do we say? 🤔';
    cardsEl.innerHTML = opts.map(x => `<button class="card" data-id="${x.id}">${esc(x.t)}${lang === 'en' ? `<small>${esc(x.en)}</small>` : ''}</button>`).join('');
    cardsEl.querySelectorAll('.card').forEach((b, i) => {
      b.animate([{ opacity: 0, transform: 'translateY(16px) scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 320, delay: 80 * i, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'backwards' });
      b.addEventListener('click', () => pick(b));
    });
    sayCap(d); later(1.7, sayAsk);
  }
  function pick(b) {
    if (answered || paused || b.classList.contains('no')) return;
    const d = BY[qs[qi]], x = BY[b.dataset.id];
    tasks = [];
    if (x.p === d.p) {
      answered = true; b.classList.add('ok');
      cardsEl.querySelectorAll('.card').forEach(c => { if (c !== b) c.classList.add('dim'); });
      pstates[qi] = tries ? 'no' : 'on'; setProg(def.q, pstates);
      Sound.star(); vibrate(20); burst();
      // عرض الدعاء مع القراءة
      b.innerHTML = d.t.split(' ').map(w => `<span>${esc(w)}</span>`).join(' ') + (lang === 'en' ? `<small>${d.en.split(' ').map(w => `<span>${esc(w)}</span>`).join(' ')}</small>` : '');
      karaEl = b;
      later(.35, () => readDua(d, () => { qi++; ask(); }));
    } else {
      mistakes++; tries++; b.classList.add('no'); Sound.error(); vibrate(30);
      later(.3, () => lang === 'ar' ? App.speak(App.g('حاولي مرة أخرى.', 'حاول مرة أخرى.')) : App.speak('Try again!', 'en'));
    }
  }
  let karaEl = null;
  function burst() {
    for (let i = 0; i < 26; i++) { const a = Math.random() * TAU, v = 60 + Math.random() * 160; sparkles.push({ x: VW / 2, y: VH * .45, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, life: .9 + Math.random() * .5, age: 0, s: 3 + Math.random() * 5, c: ['#FFD84A', '#7FE0C4', '#FF9EC4', '#fff'][i % 4] }); }
  }

  /* ---------- الفوز والمستويات ---------- */
  function win() {
    over = true;
    const pr = loadProg();
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('duasProg', pr);
    Sound.win(); burst(); burst();
    later(.9, () => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = 'ما شاء الله! ' + App.g('أحسنتِ', 'أحسنتَ') + ' 🎉';
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wP').textContent = App.g('حفظتِ', 'حفظتَ') + ` أدعية «${def.t}»` + (mistakes ? '' : ' دون أخطاء! 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < LEVELS.length ? '' : 'none';
      winOv.classList.add('on');
      lang === 'ar' ? App.speak(App.g('أحسنتِ!', 'أحسنتَ!')) : App.speak('Well done!', 'en');
      if (stars > prev) App.addStars(stars - prev + 1);
      App.achieve('duas_first');
      if (LEVELS.every((_, i) => pr.stars[i + 1])) App.achieve('duas_all');
    });
  }
  function openLevels() {
    const pr = loadProg(), g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}"><span class="n">${num(n)}</span>
        <span class="e">${L.ic}</span><span class="t">${L.t}</span>
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
    else if (a === 'again') startLevel(lvl, true);
    else if (a === 'levels') openLevels();
    else if (a === 'book') openBook(0);
    else if (a === 'close') { lvOv.classList.remove('on'); if (over) winOv.classList.add('on'); }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });
  root.querySelector('.bookb').addEventListener('click', () => { Sound.tap(); openBook(Math.max(0, DUAS.indexOf(cur))); });
  root.querySelector('.ask .sayb').addEventListener('click', () => { if (answered) return; tasks = []; sayCap(cur); later(1.6, sayAsk); });
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'ar'; store.set('duasLang', lang);
    root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
  }
  root.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === lang) return;
    Sound.tap(); setLang(b.dataset.l); tasks = []; kara = null;
    setProg(def.q, pstates);
    if (mode === 'quiz') { if (!answered && !over) ask(); }
    else showLearn();
  }));
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < LEVELS.length ? 'next' : 'levels'); return; }
    if (lvOv.classList.contains('on') || winOv.classList.contains('on')) return;
    if (mode === 'quiz') { const k = parseInt(e.key, 10), cs = cardsEl.querySelectorAll('.card'); if (k >= 1 && k <= cs.length) pick(cs[k - 1]); }
    else if (e.key === 'Enter' || e.key === 'ArrowLeft') goBtn.click();
    else if (e.key === 'ArrowRight') prevBtn.click();
  });

  /* ---------- الحلقة ---------- */
  function update(dt) {
    T += dt; sceneT += dt; flash = Math.max(0, flash - dt * 2.5);
    for (let i = tasks.length - 1; i >= 0; i--) { const t = tasks[i]; t.t -= dt; if (t.t <= 0) { tasks.splice(i, 1); t.fn(); } }
    if (kara) {
      kara.t += dt;
      const host = mode === 'quiz' ? karaEl : learnEl;
      if (host) {
        const arSp = host.querySelectorAll(mode === 'quiz' ? ':scope > span' : '.du span');
        const k = Math.min(kara.n, Math.floor(kara.t / kara.a * kara.n + .35));
        arSp.forEach((s, i) => s.classList.toggle('on', i < k && kara.t < kara.a + .6));
        if (kara.e) {
          const enSp = host.querySelectorAll(mode === 'quiz' ? 'small span' : '.mean span');
          const te = kara.t - kara.a - .35, ke = te < 0 ? 0 : Math.min(kara.ne, Math.floor(te / kara.e * kara.ne + .35));
          enSp.forEach((s, i) => s.classList.toggle('on', i < ke && te < kara.e + .6));
        }
        if (kara.t > kara.a + kara.e + 1.5) kara = null;
      }
    }
    for (let i = sparkles.length - 1; i >= 0; i--) { const q = sparkles[i]; q.age += dt; if (q.age > q.life) { sparkles.splice(i, 1); continue; } q.vy += 160 * dt; q.x += q.vx * dt; q.y += q.vy * dt; }
  }
  function render() {
    if (!ctx) return;
    ctx.save(); ctx.clearRect(0, 0, W, H);
    const s = Math.max(W / VW, H / VH);
    ctx.translate((W - VW * s) / 2, (H - VH * s) / 2); ctx.scale(s, s);
    try { (SCENES[cur.sc] || SCENES.eat)(ctx, sceneT); } catch (e) { console.warn(e); }
    // تظليل ناعم للحواف (إطار لعبة)
    const g = ctx.createRadialGradient(VW / 2, VH / 2, VH * .45, VW / 2, VH / 2, VW * .75); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(40,60,80,.18)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
    if (kara && kara.t < kara.a) { // هالة لطيفة أثناء القراءة
      const a = .25 + .15 * Math.sin(T * 4);
      ctx.fillStyle = `rgba(255,236,150,${a * .5})`; ctx.fillRect(0, 0, VW, VH);
      for (let i = 0; i < 6; i++) { const k = (T * .35 + i / 6) % 1; ctx.globalAlpha = Math.sin(k * Math.PI); ctx.fillStyle = '#FFF4B8'; ctx.beginPath(); ctx.arc(30 + i * 68, VH - k * VH, 3 + (i % 3), 0, TAU); ctx.fill(); }
      ctx.globalAlpha = 1;
    }
    for (const q of sparkles) { ctx.globalAlpha = 1 - q.age / q.life; ctx.fillStyle = q.c; ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.age * 4); ctx.beginPath(); for (let k = 0; k < 10; k++) { const r = k % 2 ? q.s * .45 : q.s, an = -Math.PI / 2 + k * Math.PI / 5; ctx.lineTo(Math.cos(an) * r, Math.sin(an) * r); } ctx.fill(); ctx.restore(); }
    ctx.globalAlpha = 1;
    if (flash > 0) { ctx.fillStyle = `rgba(255,255,255,${flash * .6})`; ctx.fillRect(0, 0, VW, VH); }
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
  window.addEventListener('resize', () => { if (App.current !== ID) return; clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); render(); }, 80); });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#2E3C8C'); g.addColorStop(1, '#5C6FD6');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    c.save(); c.scale(s / VW * 1.0, s / VW * 1.0);
    stars(c, 10, 1.3, [20, 20, 360, 150]);
    c.restore();
    c.fillStyle = '#FFE08A'; c.beginPath(); c.arc(s * .74, s * .26, s * .12, 0, TAU); c.fill();
    c.fillStyle = '#3C4BA8'; c.beginPath(); c.arc(s * .79, s * .22, s * .11, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.ellipse(s * .5, s * 1.05, s * .7, s * .4, 0, 0, TAU); c.fill();
    c.save(); c.translate(s * .5, s * .98); kid(c, 0, 0, s * .13, { T: 0, hL: [-.75, -1.9], hR: [.75, -1.9], eyes: 'happy', mouth: 'smile' }); c.restore();
    c.save(); c.shadowColor = 'rgba(255,220,120,.8)'; c.shadowBlur = 12;
    emo(c, '✨', s * .22, s * .3, s * .14); c.restore();
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'أدعيتي الصغيرة', icon2: '🤲', isNew: true, music: 'tubes',
    desc: () => App.g('تعلّمي أدعية اليوم بالصور', 'تعلّم أدعية اليوم بالصور'),
    help: () => [
      '🖼️ ' + App.g('انظري', 'انظر') + ' إلى المشهد: متى نقول هذا الدعاء؟',
      '🤲 ' + App.g('اختاري', 'اختر') + ' الدعاء المناسب من البطاقات',
      '📖 زر الكتاب يعرض كل الأدعية مع قراءتها بهدوء',
      '🌍 في «English» ' + App.g('تسمعين', 'تسمع') + ' الدعاء بالعربية ثم معناه بالإنجليزية',
      '⭐ بلا أخطاء = 3 نجوم'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🤲 ${ks.length}/${LEVELS.length} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      setLang(store.get('duasLang', 'ar'));
      layout();
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, LEVELS.length));
      requestAnimationFrame(() => { layout(); render(); });
      startLoop();
    },
    leave() { stopLoop(); tasks = []; kara = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      if (mode === 'book') { setMode('quiz'); tasks = []; kara = null; startLevel(lvl, true); return true; }
      return false;
    },
    _state() { return { lvl, mode, qi, q: qs.length, cur: cur.id, answered, mistakes, over, lang }; }
  });
})();
