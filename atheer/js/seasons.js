/* =====================================================================
   الفصول والطقس — مشهد حيّ يتبدّل بين الصيف والخريف والشتاء والربيع،
   وطقس مشمس/غائم/ماطر/عاصف/رعدي/مثلج/هبوب.
   أنشطة: ألبِس الطفل لطقس اليوم، ماذا نفعل في كل فصل؟، أيّ فصل هذا؟،
   والنشرة الجوية. ووضع حرّ «العب بالطقس».
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'seasons';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,"Segoe UI",Tahoma,sans-serif';
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  /* ---------- المحتوى التعليمي ---------- */
  const SEAS = {
    summer: { ar: 'الصيف', in: 'في الصيف', en: 'Summer', c: '#FF9F1C' },
    autumn: { ar: 'الخريف', in: 'في الخريف', en: 'Autumn', c: '#E8590C' },
    winter: { ar: 'الشتاء', in: 'في الشتاء', en: 'Winter', c: '#3B8BEB' },
    spring: { ar: 'الربيع', in: 'في الربيع', en: 'Spring', c: '#E64980' }
  };
  const SEA_ORDER = ['summer', 'autumn', 'winter', 'spring'];
  const WX = {
    sunny:  { ar: 'مشمس', en: 'Sunny',  sen: 'الجو مشمس', sen_en: 'It is sunny', c: '#FFA41B' },
    cloudy: { ar: 'غائم', en: 'Cloudy', sen: 'الجو غائم', sen_en: 'It is cloudy', c: '#7F95B2' },
    rainy:  { ar: 'ماطر', en: 'Rainy',  sen: 'الجو ماطر', sen_en: 'It is rainy', c: '#3D8BFD' },
    windy:  { ar: 'عاصف', en: 'Windy',  sen: 'الجو عاصف', sen_en: 'It is windy', c: '#20B2AA' },
    stormy: { ar: 'رعدي', en: 'Stormy', sen: 'الجو رعدي', sen_en: 'It is stormy', c: '#6F5BD6' },
    snowy:  { ar: 'مثلج', en: 'Snowy',  sen: 'الجو مثلج', sen_en: 'It is snowy', c: '#4FA3E0' },
    haboob: { ar: 'هبوب', en: 'Dusty',  sen: 'هبوب الجو مغبر', sen_en: 'A dust storm! It is dusty', c: '#C7772E' }
  };
  const WX_ORDER = ['sunny', 'cloudy', 'rainy', 'windy', 'stormy', 'snowy', 'haboob'];
  const TEMP = {
    hot:  { ar: 'حار', and: 'وحار', en: 'hot', c: '#F03E3E' },
    mild: { ar: 'معتدل', and: 'ومعتدل', en: 'warm', c: '#40C057' },
    cold: { ar: 'بارد', and: 'وبارد', en: 'cold', c: '#339AF0' }
  };
  const ITEMS = {
    sunhat:     { ar: 'قبعة', en: 'Sun hat', c: '#F59F00' },
    sunglasses: { ar: 'نظارة شمسية', en: 'Sunglasses', c: '#495057' },
    tshirt:     { ar: 'قميص قصير', en: 'T-shirt', c: '#12B886' },
    shorts:     { ar: 'بنطال قصير', en: 'Shorts', c: '#3B7DD8' },
    coat:       { ar: 'معطف', en: 'Coat', c: '#E8483F' },
    scarf:      { ar: 'وشاح', en: 'Scarf', c: '#D6336C' },
    gloves:     { ar: 'قفازات', en: 'Gloves', c: '#F76707' },
    boots:      { ar: 'حذاء طويل', en: 'Boots', c: '#2F9E44' },
    raincoat:   { ar: 'معطف المطر', en: 'Raincoat', c: '#F2B705' },
    umbrella:   { ar: 'مظلة', en: 'Umbrella', c: '#7048E8' }
  };
  const ITEM_ORDER = Object.keys(ITEMS);
  /* ماذا نلبس في كل طقس */
  const DRESS = {
    sunny:  { s: 'summer', need: ['sunhat', 'sunglasses', 'tshirt', 'shorts'], t: 'hot' },
    rainy:  { s: 'autumn', need: ['raincoat', 'boots', 'umbrella'], t: 'mild' },
    snowy:  { s: 'winter', need: ['coat', 'scarf', 'gloves', 'boots'], t: 'cold' },
    haboob: { s: 'summer', need: ['sunglasses', 'scarf'], t: 'hot' },
    windy:  { s: 'autumn', need: ['coat', 'scarf'], t: 'mild' }
  };
  const ACTS = {
    swim:    { s: 'summer', e: '🏊', ar: 'نسبح', en: 'Swim' },
    juice:   { s: 'summer', e: '🧃', ar: 'نشرب العصير البارد', en: 'Drink cold juice', sh: 'عصير بارد', sh_en: 'Cold juice' },
    kite:    { s: 'autumn', e: '🪁', ar: 'نطير الطائرة الورقية', en: 'Fly a kite', sh: 'طائرة ورقية', sh_en: 'Kite' },
    leaves:  { s: 'autumn', e: '🍂', ar: 'نجمع أوراق الشجر', en: 'Collect leaves', sh: 'أوراق الشجر', sh_en: 'Leaves' },
    snowman: { s: 'winter', e: '⛄', ar: 'نصنع رجل الثلج', en: 'Build a snowman', sh: 'رجل الثلج', sh_en: 'Snowman' },
    milk:    { s: 'winter', e: '☕', ar: 'نشرب الحليب الساخن', en: 'Drink warm milk', sh: 'حليب ساخن', sh_en: 'Warm milk' },
    plant:   { s: 'spring', e: '🌷', ar: 'نزرع الزهور', en: 'Plant flowers', sh: 'نزرع الزهور', sh_en: 'Plant flowers' },
    bfly:    { s: 'spring', e: '🦋', ar: 'نشاهد الفراشات', en: 'Watch butterflies', sh: 'الفراشات', sh_en: 'Butterflies' }
  };
  /* طقس يناسب كل فصل (لسؤال «أيّ فصل هذا؟») */
  const SEASON_WX = { summer: ['sunny'], autumn: ['windy'], winter: ['snowy'], spring: ['sunny'] };
  /* فصل وحرارة تناسب كل طقس (للنشرة الجوية) */
  const WX_SCENE = {
    sunny: [['summer', 'hot'], ['spring', 'mild']], cloudy: [['autumn', 'mild'], ['spring', 'mild']],
    rainy: [['autumn', 'mild'], ['winter', 'cold']], windy: [['autumn', 'mild'], ['winter', 'cold']],
    stormy: [['autumn', 'mild'], ['summer', 'hot']], snowy: [['winter', 'cold']], haboob: [['summer', 'hot']]
  };

  const LEVELS = [
    { m: 'dress', w: ['sunny'] },
    { m: 'season', q: 4 },
    { m: 'dress', w: ['rainy'] },
    { m: 'acts', ss: ['summer', 'winter'], a: ['swim', 'juice', 'snowman', 'milk'] },
    { m: 'report', q: 4, pool: ['sunny', 'cloudy', 'rainy', 'snowy'] },
    { m: 'dress', w: ['snowy'] },
    { m: 'season', q: 6 },
    { m: 'acts', ss: ['summer', 'autumn', 'winter', 'spring'], a: ['swim', 'juice', 'kite', 'leaves', 'snowman', 'milk', 'plant', 'bfly'] },
    { m: 'dress', w: ['haboob'] },
    { m: 'report', q: 5, pool: WX_ORDER, temp: true },
    { m: 'dress', w: ['windy'] },
    { m: 'dress', w: ['rainy', 'sunny', 'snowy'] }
  ];
  const MODE_IC = { dress: '👕', season: '🍂', acts: '🎒', report: '📺' };

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function rng(seed) { let s = Math.max(1, seed | 0) % 2147483647; return () => ((s = (s * 16807) % 2147483647) / 2147483647); }
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const hex2 = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; };
  const mix = (a, b, t) => { const A = hex2(a), B = hex2(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, '0')).join(''); };
  const shade = (h, f) => App.shade ? App.shade(h, f) : h;
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2))); };
  const loadProg = () => { const p = store.get('seasonsProg', null) || {}; return { stars: p.stars || {}, unlocked: p.unlocked || 1 }; };
  let lang = 'ar';
  const num = n => lang === 'ar' ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);
  const say = (ar, en) => lang === 'ar' ? App.speak(ar) : App.speak(en, 'en');
  const L = o => lang === 'ar' ? o.ar : o.en;
  const isGirl = () => { const g = App.profile && App.profile.gender; return g ? g !== 'boy' : App.theme !== 'boys'; };
  function ball(x, cx, cy, r, c1, c2, c3) {
    const g = x.createRadialGradient(cx - r * .4, cy - r * .45, r * .1, cx, cy, r * 1.05);
    g.addColorStop(0, c1); g.addColorStop(.55, c2); g.addColorStop(1, c3);
    x.fillStyle = g; x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fill();
  }
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }

  /* ---------- ملصقات (رسم + حافة بيضاء + ظل) ---------- */
  let dpr = 1;
  const bakeCache = new Map();
  /** draw(x, S) يرسم في لوحة مربعة طولها S بكسل، المركز S/2 */
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
    if (bakeCache.size > 220) bakeCache.clear();
    bakeCache.set(k, c);
    return c;
  }
  const emojiDraw = e => (x, S, px) => { x.font = `${Math.round(px * .84)}px ${EMOJI_FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(e, S / 2, S / 2 + px * .05); };
  const vecDraw = fn => (x, S, px) => { x.translate(S / 2, S / 2); fn(x, px); };
  /** رسم ملصق متمركز عند (x,y) بحجم size */
  function sticker(c, key, draw, x, y, size, o = {}) {
    const img = bake(key, size, draw), sz = img.width / dpr;
    c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot);
    const sq = o.sq || 0, sc = o.sc || 1; c.scale(sc * (1 + sq), sc * (1 - sq));
    if (o.alpha != null) c.globalAlpha *= o.alpha;
    c.drawImage(img, -sz / 2, -sz / 2, sz, sz); c.restore();
  }

  /* =====================================================================
     رسومات الملابس (أيقونات)
     ===================================================================== */
  const ICON = {
    sunhat(c, s) {
      let g = c.createLinearGradient(0, -s * .1, 0, s * .3); g.addColorStop(0, '#FFE9A8'); g.addColorStop(1, '#E2A43A');
      c.fillStyle = g; c.beginPath(); c.ellipse(0, s * .12, s * .47, s * .17, 0, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(160,100,20,.35)'; c.lineWidth = s * .015; c.beginPath(); c.ellipse(0, s * .12, s * .38, s * .12, 0, 0, TAU); c.stroke();
      g = c.createLinearGradient(-s * .25, 0, s * .25, 0); g.addColorStop(0, '#FFE39A'); g.addColorStop(1, '#D9952C');
      c.fillStyle = g; c.beginPath(); c.ellipse(0, s * .08, s * .25, s * .3, 0, Math.PI, 0); c.closePath(); c.fill();
      c.fillStyle = '#F2557A'; c.beginPath(); c.moveTo(-s * .25, s * .06); c.lineTo(s * .25, s * .06); c.lineTo(s * .245, -s * .03); c.lineTo(-s * .245, -s * .03); c.closePath(); c.fill();
      ball(c, s * .16, s * .02, s * .07, '#FFF', '#FF8FB1', '#E64980');
      c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(-s * .1, -s * .1, s * .06, s * .1, -.4, 0, TAU); c.fill();
    },
    sunglasses(c, s) {
      c.lineCap = 'round';
      c.strokeStyle = '#222'; c.lineWidth = s * .05;
      c.beginPath(); c.moveTo(-s * .44, -s * .06); c.lineTo(-s * .48, -s * .12); c.moveTo(s * .44, -s * .06); c.lineTo(s * .48, -s * .12); c.stroke();
      c.beginPath(); c.arc(0, s * .02, s * .07, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
      for (const sd of [-1, 1]) {
        c.fillStyle = '#1D1F26'; rr(c, sd > 0 ? s * .04 : -s * .44, -s * .1, s * .4, s * .3, s * .12); c.fill();
        const g = c.createLinearGradient(0, -s * .08, 0, s * .18); g.addColorStop(0, '#5C6BC0'); g.addColorStop(1, '#141A33');
        c.fillStyle = g; rr(c, (sd > 0 ? s * .04 : -s * .44) + s * .03, -s * .07, s * .34, s * .24, s * .1); c.fill();
        c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse((sd > 0 ? s * .16 : -s * .28), -s * .01, s * .07, s * .03, -.5, 0, TAU); c.fill();
      }
    },
    tshirt(c, s) {
      const col = '#20C997', d = '#0CA678';
      c.fillStyle = d;
      c.beginPath(); c.moveTo(-s * .16, -s * .32); c.lineTo(-s * .44, -s * .18); c.lineTo(-s * .36, s * .02); c.lineTo(-s * .25, -s * .03); c.lineTo(-s * .25, s * .36);
      c.lineTo(s * .25, s * .36); c.lineTo(s * .25, -s * .03); c.lineTo(s * .36, s * .02); c.lineTo(s * .44, -s * .18); c.lineTo(s * .16, -s * .32);
      c.quadraticCurveTo(0, -s * .18, -s * .16, -s * .32); c.closePath(); c.fill();
      const g = c.createLinearGradient(0, -s * .3, 0, s * .36); g.addColorStop(0, '#63E6BE'); g.addColorStop(1, col);
      c.save(); c.clip(); c.fillStyle = g; c.fillRect(-s * .5, -s * .5, s, s * .84); c.restore();
      c.save(); c.translate(0, s * .1); c.fillStyle = '#FFD43B'; starPath(c, s * .12); c.fill(); c.restore();
      c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = s * .03; c.beginPath(); c.moveTo(-s * .14, -s * .28); c.quadraticCurveTo(0, -s * .16, s * .14, -s * .28); c.stroke();
    },
    shorts(c, s) {
      const g = c.createLinearGradient(0, -s * .25, 0, s * .3); g.addColorStop(0, '#74A9F5'); g.addColorStop(1, '#2F6FD0');
      c.fillStyle = g; c.beginPath(); c.moveTo(-s * .34, -s * .22); c.lineTo(s * .34, -s * .22); c.lineTo(s * .4, s * .3); c.lineTo(s * .06, s * .3); c.lineTo(0, -s * .02); c.lineTo(-s * .06, s * .3); c.lineTo(-s * .4, s * .3); c.closePath(); c.fill();
      c.fillStyle = '#1F4E9E'; rr(c, -s * .35, -s * .28, s * .7, s * .1, s * .04); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = s * .02; c.setLineDash([s * .04, s * .03]);
      c.beginPath(); c.moveTo(-s * .37, s * .24); c.lineTo(-s * .08, s * .24); c.moveTo(s * .08, s * .24); c.lineTo(s * .37, s * .24); c.stroke(); c.setLineDash([]);
    },
    coat(c, s) { coatIcon(c, s, ['#FF8A80', '#E8483F', '#B02A23'], false); },
    raincoat(c, s) { coatIcon(c, s, ['#FFE066', '#F2B705', '#C98D00'], true); },
    scarf(c, s) {
      c.lineCap = 'round';
      const stripe = (x0, y0, x1, y1, w) => {
        c.strokeStyle = '#C2255C'; c.lineWidth = w; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
        c.strokeStyle = '#fff'; c.lineWidth = w * .22; c.setLineDash([w * .25, w * .45]); c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.setLineDash([]);
      };
      c.strokeStyle = '#E64980'; c.lineWidth = s * .17; c.beginPath(); c.ellipse(0, -s * .12, s * .3, s * .14, 0, 0, TAU); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = s * .04; c.beginPath(); c.ellipse(0, -s * .15, s * .3, s * .13, 0, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
      stripe(s * .1, -s * .02, s * .2, s * .34, s * .15); stripe(-s * .02, 0, -s * .08, s * .36, s * .15);
      c.strokeStyle = '#FFD43B'; c.lineWidth = s * .025;
      for (const [x, y] of [[s * .2, s * .42], [-s * .08, s * .44]]) for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(x + i * s * .025, y - s * .03); c.lineTo(x + i * s * .03, y + s * .04); c.stroke(); }
    },
    gloves(c, s) {
      for (const sd of [-1, 1]) {
        c.save(); c.translate(sd * s * .2, 0); c.rotate(sd * .18); c.scale(sd, 1);
        const g = c.createLinearGradient(-s * .15, -s * .3, s * .15, s * .2); g.addColorStop(0, '#FFA94D'); g.addColorStop(1, '#E8590C');
        c.fillStyle = g; rr(c, -s * .14, -s * .3, s * .28, s * .44, s * .14); c.fill();
        c.beginPath(); c.ellipse(-s * .15, -s * .02, s * .07, s * .12, -.5, 0, TAU); c.fill();
        c.fillStyle = '#fff'; rr(c, -s * .16, s * .1, s * .32, s * .12, s * .05); c.fill();
        c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(-s * .16, s * .17, s * .32, s * .05);
        c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.ellipse(s * .04, -s * .18, s * .05, s * .08, 0, 0, TAU); c.fill();
        c.restore();
      }
    },
    boots(c, s) {
      for (const sd of [-1, 1]) {
        c.save(); c.translate(sd * s * .19, 0);
        const g = c.createLinearGradient(-s * .1, 0, s * .15, 0); g.addColorStop(0, '#69DB7C'); g.addColorStop(1, '#2B8A3E');
        c.fillStyle = g; c.beginPath(); c.moveTo(-s * .1, -s * .34); c.lineTo(s * .1, -s * .34); c.lineTo(s * .1, s * .14);
        c.quadraticCurveTo(s * .26, s * .15, s * .26, s * .27); c.lineTo(-s * .1, s * .27); c.closePath(); c.fill();
        c.fillStyle = '#1B5E20'; rr(c, -s * .12, s * .25, s * .4, s * .08, s * .03); c.fill();
        c.fillStyle = '#B2F2BB'; rr(c, -s * .12, -s * .38, s * .24, s * .08, s * .04); c.fill();
        c.fillStyle = 'rgba(255,255,255,.4)'; rr(c, -s * .07, -s * .26, s * .04, s * .3, s * .02); c.fill();
        c.restore();
      }
    },
    umbrella(c, s) {
      c.lineCap = 'round';
      c.strokeStyle = '#5C3D2E'; c.lineWidth = s * .05; c.beginPath(); c.moveTo(0, -s * .1); c.lineTo(0, s * .3); c.arc(-s * .07, s * .3, s * .07, 0, Math.PI); c.stroke();
      canopy(c, 0, -s * .02, s * .46, s * .36, ['#9775FA', '#7048E8', '#E5DBFF']);
    }
  };
  function coatIcon(c, s, col, hood) {
    const g = c.createLinearGradient(-s * .3, 0, s * .3, 0); g.addColorStop(0, col[0]); g.addColorStop(.6, col[1]); g.addColorStop(1, col[2]);
    if (hood) { c.fillStyle = col[2]; c.beginPath(); c.arc(0, -s * .3, s * .16, Math.PI, 0); c.fill(); }
    c.fillStyle = g;
    c.save(); c.translate(-s * .27, -s * .22); c.rotate(.35); rr(c, -s * .08, 0, s * .16, s * .46, s * .08); c.fill(); c.restore();
    c.save(); c.translate(s * .27, -s * .22); c.rotate(-.35); rr(c, -s * .08, 0, s * .16, s * .46, s * .08); c.fill(); c.restore();
    c.beginPath(); c.moveTo(-s * .2, -s * .32); c.lineTo(s * .2, -s * .32); c.lineTo(s * .28, s * .4); c.lineTo(-s * .28, s * .4); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = s * .02; c.beginPath(); c.moveTo(0, -s * .26); c.lineTo(0, s * .4); c.stroke();
    if (!hood) {
      c.strokeStyle = 'rgba(0,0,0,.1)'; c.lineWidth = s * .015;
      for (const y of [-.08, .08, .24]) { c.beginPath(); c.moveTo(-s * .24, s * y); c.lineTo(s * .24, s * y); c.stroke(); }
      for (const y of [-.14, .02, .18]) ball(c, s * .06, s * y, s * .028, '#fff', '#5C3D2E', '#3B2414');
      c.fillStyle = '#fff';
      for (let i = -3; i <= 3; i++) { c.beginPath(); c.arc(i * s * .055, -s * .32 + Math.abs(i) * s * .01, s * .05, 0, TAU); c.fill(); }
    } else {
      c.fillStyle = col[2]; for (const y of [-.12, .04, .2]) { rr(c, -s * .05, s * y, s * .1, s * .035, s * .015); c.fill(); }
      c.fillStyle = 'rgba(255,255,255,.35)'; rr(c, -s * .23, s * .3, s * .46, s * .03, s * .01); c.fill();
    }
    c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(-s * .12, -s * .1, s * .04, s * .16, .1, 0, TAU); c.fill();
  }
  function canopy(c, x, y, r, h, col) {
    const n = 6;
    c.save(); c.translate(x, y);
    c.beginPath(); c.moveTo(-r, 0);
    c.quadraticCurveTo(-r * .95, -h * 1.05, 0, -h); c.quadraticCurveTo(r * .95, -h * 1.05, r, 0);
    for (let i = n; i > 0; i--) { const x0 = -r + (i / n) * 2 * r, x1 = -r + ((i - 1) / n) * 2 * r; c.quadraticCurveTo((x0 + x1) / 2, -h * .18, x1, 0); }
    c.closePath();
    const g = c.createLinearGradient(0, -h, 0, 0); g.addColorStop(0, col[0]); g.addColorStop(1, col[1]);
    c.fillStyle = g; c.fill();
    c.save(); c.clip();
    c.fillStyle = col[2]; c.globalAlpha = .55;
    for (let i = 0; i < n; i += 2) { const x0 = -r + (i / n) * 2 * r, x1 = -r + ((i + 1) / n) * 2 * r; c.beginPath(); c.moveTo(0, -h); c.lineTo(x0, 0); c.lineTo(x1, 0); c.closePath(); c.fill(); }
    c.restore();
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-r * .35, -h * .62, r * .2, h * .12, -.5, 0, TAU); c.fill();
    c.fillStyle = '#5C3D2E'; c.beginPath(); c.arc(0, -h - r * .04, r * .05, 0, TAU); c.fill();
    c.restore();
  }

  /* ---------- أيقونات الطقس والفصول والحرارة ---------- */
  function sunIcon(c, s, face = true) {
    c.save(); c.fillStyle = '#FFC93C';
    for (let i = 0; i < 10; i++) { c.rotate(TAU / 10); c.beginPath(); c.moveTo(-s * .07, -s * .3); c.lineTo(0, -s * .47); c.lineTo(s * .07, -s * .3); c.closePath(); c.fill(); }
    c.restore();
    ball(c, 0, 0, s * .3, '#FFF6C2', '#FFD43B', '#F59F00');
    if (face) {
      c.fillStyle = '#7A3E00'; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * s * .1, -s * .04, s * .03, s * .045, 0, 0, TAU); c.fill(); }
      c.strokeStyle = '#7A3E00'; c.lineWidth = s * .03; c.lineCap = 'round'; c.beginPath(); c.arc(0, s * .03, s * .1, .4, Math.PI - .4); c.stroke();
      c.fillStyle = 'rgba(255,110,90,.45)'; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * s * .18, s * .06, s * .05, s * .03, 0, 0, TAU); c.fill(); }
    }
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
  function flake(c, x, y, r, col = '#74C0FC', w) {
    c.save(); c.translate(x, y); c.strokeStyle = col; c.lineWidth = w || r * .22; c.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      c.rotate(TAU / 6); c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -r);
      c.moveTo(0, -r * .55); c.lineTo(-r * .28, -r * .8); c.moveTo(0, -r * .55); c.lineTo(r * .28, -r * .8); c.stroke();
    }
    c.restore();
  }
  function leafShape(c, x, y, s, rot, col) {
    c.save(); c.translate(x, y); c.rotate(rot);
    c.fillStyle = col; c.beginPath(); c.moveTo(0, -s);
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * .62; c.lineTo(Math.cos(a) * s, Math.sin(a) * s); c.lineTo(Math.cos(a + .31) * s * .55, Math.sin(a + .31) * s * .55); }
    c.lineTo(0, s * .3); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(120,40,0,.45)'; c.lineWidth = s * .08; c.beginPath(); c.moveTo(0, s * .7); c.lineTo(0, -s * .7); c.stroke();
    c.restore();
  }
  const WXI = {
    sunny(c, s) { sunIcon(c, s * 1.05); },
    cloudy(c, s) { c.save(); c.translate(s * .14, -s * .12); sunIcon(c, s * .6, false); c.restore(); cloudIcon(c, -s * .04, s * .08, s * .95); },
    rainy(c, s) { cloudIcon(c, 0, -s * .1, s * .9, ['#E9EEF5', '#A5B4C8']); for (const [x, y] of [[-.22, .26], [0, .34], [.22, .26]]) drop(c, x * s, y * s, s * .09); },
    windy(c, s) {
      c.lineCap = 'round'; c.strokeStyle = '#38D9A9'; c.lineWidth = s * .075;
      for (const [y, l, r] of [[-.2, .36, .1], [0, .44, .12], [.2, .3, .09]]) { c.beginPath(); c.moveTo(-s * .42, y * s); c.lineTo(s * (l - .42), y * s); c.arc(s * (l - .42), (y - r) * s, r * s, Math.PI / 2, -Math.PI * .7, true); c.stroke(); }
      leafShape(c, s * .32, s * .3, s * .12, .8, '#FF922B');
    },
    stormy(c, s) {
      cloudIcon(c, 0, -s * .12, s * .92, ['#9AA5B8', '#4A5468']);
      c.fillStyle = '#FFD43B'; c.strokeStyle = '#F08C00'; c.lineWidth = s * .02; c.lineJoin = 'round';
      c.beginPath(); c.moveTo(s * .02, s * .02); c.lineTo(-s * .12, s * .24); c.lineTo(-s * .01, s * .24); c.lineTo(-s * .08, s * .44); c.lineTo(s * .14, s * .16); c.lineTo(s * .03, s * .16); c.lineTo(s * .12, s * .02); c.closePath(); c.fill(); c.stroke();
      drop(c, -s * .26, s * .26, s * .07); drop(c, s * .27, s * .3, s * .07);
    },
    snowy(c, s) { cloudIcon(c, 0, -s * .14, s * .85, ['#FFFFFF', '#C5D6EA']); flake(c, -s * .2, s * .26, s * .1, '#4DABF7'); flake(c, s * .04, s * .34, s * .1, '#4DABF7'); flake(c, s * .26, s * .22, s * .09, '#4DABF7'); },
    haboob(c, s) {
      c.save(); c.globalAlpha = .7; c.translate(s * .2, -s * .22); ball(c, 0, 0, s * .14, '#FFF3D6', '#FFC078', '#E8590C'); c.restore();
      const cols = ['#E9B872', '#D08C3E', '#B86A2A'];
      c.fillStyle = cols[1]; c.beginPath(); c.moveTo(-s * .46, s * .36);
      for (let i = 0; i <= 8; i++) { const x = -s * .46 + i * s * .115; c.lineTo(x, -s * .04 - Math.sin(i * 1.3) * s * .12 - (i % 2) * s * .08); }
      c.lineTo(s * .46, s * .36); c.closePath(); c.fill();
      ball(c, -s * .2, s * .02, s * .2, cols[0], cols[1], cols[2]); ball(c, s * .1, -s * .02, s * .22, cols[0], cols[1], cols[2]); ball(c, s * .3, s * .12, s * .16, cols[0], cols[1], cols[2]);
      c.fillStyle = '#C47A35'; rr(c, -s * .46, s * .14, s * .92, s * .22, s * .08); c.fill();
      c.fillStyle = 'rgba(255,240,210,.7)'; for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(-s * .38 + i * s * .095, s * .22 + (i % 3) * s * .04, s * .018, 0, TAU); c.fill(); }
      c.strokeStyle = 'rgba(255,240,210,.8)'; c.lineWidth = s * .03; c.lineCap = 'round';
      for (const y of [-.02, .08]) { c.beginPath(); c.moveTo(-s * .4, y * s); c.lineTo(-s * .1, y * s); c.stroke(); }
    }
  };
  const SEI = {
    summer(c, s) { sunIcon(c, s); },
    autumn(c, s) { leafShape(c, -s * .08, s * .02, s * .34, -.3, '#F76707'); leafShape(c, s * .2, -s * .1, s * .2, .5, '#FAB005'); },
    winter(c, s) { flake(c, 0, 0, s * .4, '#339AF0', s * .07); ball(c, 0, 0, s * .06, '#fff', '#A5D8FF', '#4DABF7'); },
    spring(c, s) {
      c.strokeStyle = '#37B24D'; c.lineWidth = s * .06; c.beginPath(); c.moveTo(0, s * .1); c.quadraticCurveTo(s * .04, s * .3, 0, s * .46); c.stroke();
      c.fillStyle = '#51CF66'; c.beginPath(); c.ellipse(s * .12, s * .32, s * .1, s * .05, -.5, 0, TAU); c.fill();
      for (let i = 0; i < 5; i++) { const a = i / 5 * TAU - Math.PI / 2; ball(c, Math.cos(a) * s * .17, -s * .06 + Math.sin(a) * s * .17, s * .14, '#FFE3EF', '#F783AC', '#D6336C'); }
      ball(c, 0, -s * .06, s * .1, '#FFF9DB', '#FFD43B', '#F08C00');
    }
  };
  const TEMPI = {
    hot(c, s) { thermo(c, s, .9, '#F03E3E'); sunIcon2(c, s * .26, -s * .26, s * .18); },
    mild(c, s) { thermo(c, s, .55, '#40C057'); },
    cold(c, s) { thermo(c, s, .2, '#339AF0'); flake(c, s * .26, -s * .26, s * .12, '#74C0FC', s * .03); }
  };
  function sunIcon2(c, x, y, r) { c.save(); c.translate(x, y); sunIcon(c, r * 2, false); c.restore(); }
  function thermo(c, s, lv, col) {
    c.save(); c.translate(-s * .06, 0);
    c.fillStyle = '#fff'; c.strokeStyle = '#ADB5BD'; c.lineWidth = s * .035;
    rr(c, -s * .09, -s * .42, s * .18, s * .62, s * .09); c.fill(); c.stroke();
    c.beginPath(); c.arc(0, s * .28, s * .16, 0, TAU); c.fill(); c.stroke();
    c.fillStyle = '#fff'; rr(c, -s * .07, -s * .1, s * .14, s * .3, s * .05); c.fill();
    const top = lerp(s * .16, -s * .36, lv);
    ball(c, 0, s * .28, s * .12, mix(col, '#ffffff', .5), col, shade(col, -.3));
    c.fillStyle = col; rr(c, -s * .045, top, s * .09, s * .3 - top, s * .045); c.fill();
    c.strokeStyle = '#868E96'; c.lineWidth = s * .02;
    for (let i = 0; i < 4; i++) { const y = -s * .3 + i * s * .12; c.beginPath(); c.moveTo(s * .1, y); c.lineTo(s * .16, y); c.stroke(); }
    c.restore();
  }

  /* =====================================================================
     المشهد الحيّ (يُرسم في أي مستطيل)
     ===================================================================== */
  const WP = {
    sunny:  { sun: 1,   clouds: 2, dark: 0,   rain: 0,   snow: 0, wind: .15, dust: 0, light: 0 },
    cloudy: { sun: .3,  clouds: 6, dark: .2,  rain: 0,   snow: 0, wind: .3,  dust: 0, light: 0 },
    rainy:  { sun: 0,   clouds: 7, dark: .45, rain: 1,   snow: 0, wind: .3,  dust: 0, light: 0 },
    windy:  { sun: .75, clouds: 4, dark: .05, rain: 0,   snow: 0, wind: 1,   dust: 0, light: 0 },
    stormy: { sun: 0,   clouds: 8, dark: .85, rain: 1.4, snow: 0, wind: .8,  dust: 0, light: 1 },
    snowy:  { sun: .1,  clouds: 5, dark: .15, rain: 0,   snow: 1, wind: .2,  dust: 0, light: 0 },
    haboob: { sun: .5,  clouds: 0, dark: 0,   rain: 0,   snow: 0, wind: 1.2, dust: 1, light: 0 }
  };
  function skyCols(se, wx) {
    if (wx === 'sunny') return { summer: ['#2FA8FF', '#BFE9FF'], spring: ['#5CC2FF', '#E3F7FF'], autumn: ['#6CB8EE', '#FCE4C4'], winter: ['#94C6F0', '#EEF6FF'] }[se];
    return { cloudy: ['#8CB0D2', '#DCE7F0'], rainy: ['#7487A0', '#C1CDDA'], windy: ['#6FC0F0', '#E3F3FA'], stormy: ['#36415A', '#76839A'], snowy: ['#A9BED6', '#F0F5FA'], haboob: ['#B46F33', '#E7B97A'] }[wx];
  }
  const HILL = { summer: ['#BEDB6E', '#93C552'], spring: ['#8EE07A', '#4FBF5A'], autumn: ['#E6B565', '#C98B3E'], winter: ['#F2F7FC', '#C9D9EC'] };
  const GROUND = { summer: ['#CFE57F', '#8DBF45'], spring: ['#9BE57D', '#45AD48'], autumn: ['#E5C67E', '#B68A42'], winter: ['#FAFCFF', '#D2E0F0'] };
  const tint = (col, se, wx) => { const p = WP[wx]; let c = col; if (wx === 'haboob') c = mix(c, '#D39A5A', .55); if (p.dark) c = mix(c, '#4A5568', p.dark * .45); return c; };

  const bgCache = new Map();
  function getBg(se, wx, w, h, hz, mini) {
    const key = [se, wx, w, h, Math.round(hz), dpr, mini ? 1 : 0].join('|');
    let c = bgCache.get(key); if (c) return c;
    c = buildBg(se, wx, w, h, hz, mini);
    if (bgCache.size > 26) bgCache.delete(bgCache.keys().next().value);
    bgCache.set(key, c); return c;
  }
  function house(x, cx, gy, s, se, wx) {
    x.fillStyle = 'rgba(30,40,20,.2)'; x.beginPath(); x.ellipse(cx, gy, s * .7, s * .1, 0, 0, TAU); x.fill();
    const w = s, h = s * .58;
    let g = x.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0); g.addColorStop(0, tint('#FFF1D6', se, wx)); g.addColorStop(1, tint('#E9C994', se, wx));
    x.fillStyle = g; rr(x, cx - w / 2, gy - h, w, h, s * .04); x.fill();
    x.fillStyle = tint('#A84B2F', se, wx); rr(x, cx + w * .2, gy - h - s * .42, s * .13, s * .3, s * .02); x.fill();
    x.fillStyle = tint('#C2412D', se, wx); x.beginPath(); x.moveTo(cx - w * .62, gy - h + 3); x.lineTo(cx, gy - h - s * .45); x.lineTo(cx + w * .62, gy - h + 3); x.closePath(); x.fill();
    x.fillStyle = tint('#E8604A', se, wx); x.beginPath(); x.moveTo(cx - w * .55, gy - h + 2); x.lineTo(cx, gy - h - s * .38); x.lineTo(cx + w * .55, gy - h + 2); x.closePath(); x.fill();
    if (se === 'winter') {
      x.fillStyle = '#fff'; x.beginPath(); x.moveTo(cx - w * .64, gy - h + 4); x.lineTo(cx, gy - h - s * .47); x.lineTo(cx + w * .64, gy - h + 4);
      for (let i = 8; i >= 0; i--) x.lineTo(cx - w * .64 + i * w * .16, gy - h + 4 + (i % 2 ? s * .07 : s * .02)); x.closePath(); x.fill();
      x.fillStyle = 'rgba(200,225,250,.9)'; for (let i = 0; i < 6; i++) { const ix = cx - w * .5 + i * w * .2; x.beginPath(); x.moveTo(ix - 2, gy - h + 6); x.lineTo(ix + 2, gy - h + 6); x.lineTo(ix, gy - h + 6 + s * (.06 + (i % 3) * .03)); x.fill(); }
    }
    // باب ونافذة
    x.fillStyle = tint('#4C6EF5', se, wx); rr(x, cx - w * .32, gy - h * .62, w * .2, h * .62, [s * .1, s * .1, 0, 0]); x.fill();
    x.fillStyle = '#FFD43B'; x.beginPath(); x.arc(cx - w * .16, gy - h * .3, s * .018, 0, TAU); x.fill();
    const lit = WP[wx].dark > .3 || wx === 'haboob';
    x.fillStyle = '#fff'; rr(x, cx + w * .05, gy - h * .72, w * .26, h * .36, s * .03); x.fill();
    x.fillStyle = lit ? '#FFE066' : tint('#9BD8FF', se, wx); rr(x, cx + w * .07, gy - h * .69, w * .22, h * .3, s * .02); x.fill();
    x.fillStyle = '#fff'; x.fillRect(cx + w * .175, gy - h * .7, s * .015, h * .32); x.fillRect(cx + w * .06, gy - h * .55, w * .24, s * .015);
    if (se === 'spring' || se === 'summer') for (let i = 0; i < 3; i++) ball(x, cx + w * .09 + i * w * .085, gy - h * .36, s * .035, '#fff', ['#FF8FB1', '#FFD43B', '#B197FC'][i], '#C2255C');
  }
  function flower(x, cx, cy, s, col) {
    x.strokeStyle = '#2F9E44'; x.lineWidth = Math.max(1, s * .14); x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx, cy + s * 1.1); x.stroke();
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; ball(x, cx + Math.cos(a) * s * .34, cy + Math.sin(a) * s * .34, s * .28, '#fff', col, shade(col, -.2)); }
    ball(x, cx, cy, s * .2, '#FFF6B0', '#FFC93C', '#E89A10');
  }
  function sunflower(x, cx, gy, s) {
    x.strokeStyle = '#2F9E44'; x.lineWidth = s * .08; x.beginPath(); x.moveTo(cx, gy); x.quadraticCurveTo(cx + s * .05, gy - s * .5, cx, gy - s); x.stroke();
    x.fillStyle = '#40C057'; x.beginPath(); x.ellipse(cx + s * .12, gy - s * .45, s * .14, s * .06, -.5, 0, TAU); x.fill();
    x.save(); x.translate(cx, gy - s);
    x.fillStyle = '#FCC419'; for (let i = 0; i < 12; i++) { x.rotate(TAU / 12); x.beginPath(); x.ellipse(0, -s * .2, s * .07, s * .14, 0, 0, TAU); x.fill(); }
    ball(x, 0, 0, s * .14, '#A0522D', '#6B3A1E', '#3E2010');
    x.restore();
  }
  function bush(x, cx, gy, s, c) {
    x.fillStyle = 'rgba(20,50,10,.18)'; x.beginPath(); x.ellipse(cx, gy, s * .9, s * .18, 0, 0, TAU); x.fill();
    ball(x, cx - s * .45, gy - s * .3, s * .42, c[0], c[1], c[2]); ball(x, cx + s * .45, gy - s * .28, s * .4, c[0], c[1], c[2]); ball(x, cx, gy - s * .5, s * .52, c[0], c[1], c[2]);
  }
  function buildBg(se, wx, w, h, hz, mini) {
    const cv = mk(w * dpr, h * dpr), x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const R = rng(SEA_ORDER.indexOf(se) * 31 + 7), p = WP[wx];
    const sk = skyCols(se, wx);
    let g = x.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, sk[0]); g.addColorStop(1, sk[1]);
    x.fillStyle = g; x.fillRect(0, 0, w, hz + 4);
    const u = Math.min(w, h * 1.1) / 10;
    // تلال بعيدة
    const hc = HILL[se].map(c => tint(c, se, wx));
    for (let k = 0; k < 2; k++) {
      const amp = (h - hz) * (k ? .22 : .38) + hz * .06, yb = hz + 3;
      g = x.createLinearGradient(0, yb - amp, 0, yb); g.addColorStop(0, hc[k]); g.addColorStop(1, hc[1 - k]);
      x.fillStyle = g; x.beginPath(); x.moveTo(0, yb);
      const ph = R() * 6, fr = k ? 2.6 : 1.7;
      for (let i = 0; i <= 40; i++) { const xx = w * i / 40; x.lineTo(xx, yb - amp * (.45 + .55 * Math.sin(i / 40 * TAU * fr / 2 + ph))); }
      x.lineTo(w, yb); x.fill();
      if (se === 'winter' && k === 0) { x.fillStyle = 'rgba(255,255,255,.6)'; x.fill(); }
    }
    // الأرض
    const gc = GROUND[se].map(c => tint(c, se, wx));
    g = x.createLinearGradient(0, hz, 0, h); g.addColorStop(0, gc[0]); g.addColorStop(1, gc[1]);
    x.fillStyle = g; x.fillRect(0, hz, w, h - hz);
    // طريق منحنٍ بمنظور
    const pathC = se === 'winter' ? '#E3ECF7' : tint('#F3D9A4', se, wx);
    x.fillStyle = pathC; x.beginPath();
    x.moveTo(w * .2, hz + 2); x.lineTo(w * .26, hz + 2);
    x.bezierCurveTo(w * .4, lerp(hz, h, .35), w * .75, lerp(hz, h, .55), w * .7, h);
    x.lineTo(w * .3, h); x.bezierCurveTo(w * .45, lerp(hz, h, .6), w * .2, lerp(hz, h, .3), w * .2, hz + 2); x.fill();
    x.fillStyle = 'rgba(255,255,255,.25)'; for (let i = 0; i < 9; i++) { const t = i / 9, yy = lerp(hz + 8, h, t * t); x.beginPath(); x.ellipse(lerp(w * .25, w * .5, t) + (R() - .5) * 20, yy, 3 + t * 8, 1.5 + t * 3, 0, 0, TAU); x.fill(); }
    // ضوء ناعم وأفق
    g = x.createLinearGradient(0, hz, 0, hz + 26); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, hz, w, 26);
    house(x, w * .16, hz + (h - hz) * .06, u * (mini ? 2.1 : 1.6), se, wx);
    // زينة الفصل
    const bc = { summer: ['#C0EB75', '#74B816', '#2B8A3E'], spring: ['#B2F2BB', '#40C057', '#2B8A3E'], autumn: ['#FFD8A8', '#F08C00', '#A84300'], winter: ['#FFFFFF', '#DDE8F5', '#A9BED6'] }[se].map(c => tint(c, se, wx));
    bush(x, -u * .2, h + u * .15, u * 1.2, bc); bush(x, w + u * .3, h + u * .2, u * 1.3, bc);
    if (se === 'spring') {
      const fc = ['#FF7BAC', '#FFB03A', '#B78CFF', '#FF6B6B', '#74C0FC'];
      for (let i = 0; i < (mini ? 10 : 18); i++) { const fx = R() * w, fy = lerp(hz + 12, h - 6, .2 + R() * .8); flower(x, fx, fy, u * (.1 + (fy - hz) / (h - hz) * .1), tint(fc[i % 5], se, wx)); }
    } else if (se === 'summer') {
      for (let i = 0; i < 3; i++) sunflower(x, w * (.36 + i * .07), lerp(hz, h, .2 + i * .03), u * (.8 + i * .12));
      // كرة شاطئ
      const bx = w * .58, by = lerp(hz, h, .4), br = u * .32;
      x.fillStyle = 'rgba(0,0,0,.15)'; x.beginPath(); x.ellipse(bx, by + br * .9, br, br * .25, 0, 0, TAU); x.fill();
      ball(x, bx, by, br, '#fff', '#FF6B6B', '#C92A2A');
      x.fillStyle = '#FFD43B'; x.beginPath(); x.moveTo(bx, by); x.arc(bx, by, br, -1.2, -.4); x.fill(); x.fillStyle = '#4DABF7'; x.beginPath(); x.moveTo(bx, by); x.arc(bx, by, br, .9, 1.7); x.fill();
      x.fillStyle = 'rgba(255,255,255,.5)'; x.beginPath(); x.arc(bx - br * .35, by - br * .35, br * .2, 0, TAU); x.fill();
    } else if (se === 'autumn') {
      const lc = ['#F76707', '#FAB005', '#E03131', '#D9480F'];
      for (let i = 0; i < 3; i++) { const lx = w * (.38 + i * .15), ly = lerp(hz, h, .35 + i * .12), ls = u * (.5 + i * .12);
        x.fillStyle = 'rgba(80,40,0,.15)'; x.beginPath(); x.ellipse(lx, ly, ls * 1.1, ls * .25, 0, 0, TAU); x.fill();
        for (let j = 0; j < 14; j++) leafShape(x, lx + (R() - .5) * ls * 1.6, ly - R() * ls * .5, ls * .22, R() * 6, tint(lc[j % 4], se, wx)); }
      for (let j = 0; j < 22; j++) leafShape(x, R() * w, lerp(hz + 8, h, R()), u * .12, R() * 6, tint(lc[j % 4], se, wx));
    } else {
      for (let i = 0; i < 4; i++) { const sx = w * (.35 + i * .17), sy = lerp(hz, h, .3 + (i % 2) * .3), ss = u * (.6 + (i % 3) * .2);
        g = x.createRadialGradient(sx - ss * .3, sy - ss * .5, 2, sx, sy, ss); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#C8D8EC');
        x.fillStyle = g; x.beginPath(); x.ellipse(sx, sy, ss, ss * .35, 0, Math.PI, 0); x.fill(); }
    }
    if (p.rain) { // برك ماء
      for (let i = 0; i < 4; i++) { const px = w * (.3 + R() * .6), py = lerp(hz, h, .3 + R() * .6), pw = u * (.5 + R() * .4);
        x.fillStyle = 'rgba(70,110,170,.35)'; x.beginPath(); x.ellipse(px, py, pw, pw * .22, 0, 0, TAU); x.fill();
        x.strokeStyle = 'rgba(255,255,255,.5)'; x.lineWidth = 1.5; x.beginPath(); x.ellipse(px - pw * .2, py - pw * .03, pw * .4, pw * .07, 0, Math.PI, TAU); x.stroke(); }
    }
    // عشب
    if (se !== 'winter') for (let i = 0; i < (mini ? 20 : 50); i++) {
      const fx = R() * w, fy = lerp(hz + 10, h, R()), s = 3 + (fy - hz) / (h - hz) * 7;
      x.strokeStyle = tint(se === 'autumn' ? 'rgba(140,90,20,.4)' : 'rgba(30,110,30,.35)', se, wx); x.lineWidth = 1.6;
      x.beginPath(); x.moveTo(fx - s * .5, fy - s); x.lineTo(fx, fy); x.lineTo(fx + s * .4, fy - s * 1.1); x.stroke();
    }
    if (p.dark) { x.fillStyle = `rgba(25,35,60,${p.dark * .16})`; x.fillRect(0, 0, w, h); }
    return cv;
  }
  /* شجرة الفصل (لوحة منفصلة تتمايل مع الريح) */
  const treeCache = new Map();
  function getTree(se, wx, size) {
    const key = se + '|' + wx + '|' + Math.round(size) + '|' + dpr;
    let c = treeCache.get(key); if (c) return c;
    const W = size * 1.15, H = size * 1.06;
    c = mk(W * dpr, H * dpr); const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const R = rng(13 + SEA_ORDER.indexOf(se)), s = size, bx = W / 2, by = H - 2;
    x.fillStyle = 'rgba(20,40,10,.2)'; x.beginPath(); x.ellipse(bx, by - s * .02, s * .38, s * .06, 0, 0, TAU); x.fill();
    const tc = tint('#8B5A2B', se, wx), tcd = tint('#5E3A17', se, wx);
    const tg = x.createLinearGradient(bx - s * .08, 0, bx + s * .08, 0); tg.addColorStop(0, tint('#B07A45', se, wx)); tg.addColorStop(1, tcd);
    x.fillStyle = tg; x.beginPath(); x.moveTo(bx - s * .08, by); x.quadraticCurveTo(bx - s * .04, by - s * .3, bx - s * .045, by - s * .55); x.lineTo(bx + s * .045, by - s * .55); x.quadraticCurveTo(bx + s * .04, by - s * .3, bx + s * .08, by); x.closePath(); x.fill();
    x.strokeStyle = tc; x.lineCap = 'round';
    const br = [[-.32, -.82, .035], [.3, -.85, .035], [-.12, -.98, .03], [.12, -1.0, .028], [-.38, -.62, .025], [.36, -.66, .025]];
    for (const [ex, ey, lw] of br) { x.lineWidth = s * lw; x.beginPath(); x.moveTo(bx, by - s * .5); x.quadraticCurveTo(bx + ex * s * .3, by - s * .65, bx + ex * s, by + ey * s * .92); x.stroke(); }
    if (se === 'winter') {
      x.strokeStyle = '#fff'; x.lineWidth = s * .018;
      for (const [ex, ey] of br) { x.beginPath(); x.moveTo(bx + ex * s * .45, by - s * .66); x.quadraticCurveTo(bx + ex * s * .7, by + ey * s * .85 - 3, bx + ex * s, by + ey * s * .92 - 2); x.stroke(); }
      x.fillStyle = '#fff'; x.beginPath(); x.ellipse(bx, by - s * .03, s * .3, s * .05, 0, Math.PI, 0); x.fill();
      return treeCache.set(key, c), c;
    }
    const pal = { summer: [['#B6EE7A', '#4CAF2E', '#1E6B1E']], spring: [['#D3F9A8', '#69C850', '#2F8A2A']], autumn: [['#FFE08A', '#FAB005', '#C77B00'], ['#FFC9A0', '#F76707', '#A33C00'], ['#FFB3A6', '#E03131', '#8F1D1D']] }[se];
    const blobs = [[0, -.82, .3], [-.25, -.7, .24], [.25, -.72, .25], [-.15, -.98, .22], [.16, -1.0, .22], [-.36, -.88, .17], [.38, -.86, .17], [0, -.62, .2]];
    for (let i = 0; i < blobs.length; i++) {
      const [ox, oy, r] = blobs[i], p = pal[i % pal.length].map(c => tint(c, se, wx));
      if (se === 'autumn' && i === 7) continue;
      ball(x, bx + ox * s, by + oy * s * .92, r * s * (se === 'autumn' ? .92 : 1), p[0], p[1], p[2]);
    }
    if (se === 'spring') for (let i = 0; i < 26; i++) {
      const a = R() * TAU, d = Math.sqrt(R()) * s * .4, px = bx + Math.cos(a) * d * 1.1, py = by - s * .8 * .92 + Math.sin(a) * d * .75;
      for (let k = 0; k < 5; k++) { const aa = k / 5 * TAU; x.fillStyle = tint(i % 3 ? '#FFC9DE' : '#FFFFFF', se, wx); x.beginPath(); x.arc(px + Math.cos(aa) * s * .016, py + Math.sin(aa) * s * .016, s * .016, 0, TAU); x.fill(); }
      x.fillStyle = '#F06595'; x.beginPath(); x.arc(px, py, s * .009, 0, TAU); x.fill();
    }
    if (se === 'summer') for (let i = 0; i < 7; i++) { const a = R() * TAU, d = R() * s * .3; ball(x, bx + Math.cos(a) * d, by - s * .78 + Math.sin(a) * d * .6, s * .035, '#FFF', '#FF6B6B', '#C92A2A'); }
    if (treeCache.size > 20) treeCache.delete(treeCache.keys().next().value);
    treeCache.set(key, c); return c;
  }
  const cloudCache = new Map();
  function cloudSprite(size, tone) {
    const key = Math.round(size / 4) * 4 + '|' + tone + '|' + dpr;
    let c = cloudCache.get(key); if (c) return c;
    const s = Math.round(size / 4) * 4, W = s * 2.3, H = s * 1.5;
    c = mk(W * dpr, H * dpr); const x = c.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const blobs = [[-1, .15, .55], [-.45, -.2, .75], [.2, -.3, .8], [.8, .05, .6], [.25, .2, .7], [-.4, .25, .6]];
    const cx = W / 2, cy = H * .55, k = s * .5;
    const top = tone ? '#9AA6BA' : '#FFFFFF', bot = tone ? '#5B6579' : '#C9DAEC';
    x.fillStyle = top; x.beginPath(); for (const [a, b, r] of blobs) { x.moveTo(cx + a * k + r * k, cy + b * k); x.arc(cx + a * k, cy + b * k, r * k, 0, TAU); } x.fill();
    const g = x.createLinearGradient(0, cy - k, 0, cy + k); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,0)'); g.addColorStop(1, bot);
    x.globalCompositeOperation = 'source-atop'; x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = tone ? 'rgba(255,255,255,.15)' : 'rgba(255,255,255,.9)'; x.beginPath(); x.ellipse(cx - k * .3, cy - k * .55, k * .4, k * .16, -.2, 0, TAU); x.fill();
    cloudCache.set(key, c); return c;
  }
  let dustSprite = null;
  function getDust() {
    if (dustSprite) return dustSprite;
    const s = 128; dustSprite = mk(s, s); const x = dustSprite.getContext('2d');
    const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); g.addColorStop(0, 'rgba(196,128,62,.55)'); g.addColorStop(1, 'rgba(196,128,62,0)');
    x.fillStyle = g; x.fillRect(0, 0, s, s); return dustSprite;
  }

  function makeScene(mini) {
    const S = {
      se: 'summer', wx: 'sunny', w: 1, h: 1, hz: 0.5, top: 0, layers: [], parts: [], clouds: [], bflies: [],
      p: Object.assign({}, WP.sunny), t: Math.random() * 20, flash: 0, bolt: null, nextBolt: 2.5, acc: {}, mini
    };
    S.mkLayer = () => {
      const tsz = Math.min(S.w * (S.mini ? .4 : .4), (S.h - S.top) * (S.mini ? .62 : .5), 330);
      return { se: S.se, wx: S.wx, bg: getBg(S.se, S.wx, S.w, S.h, S.hz, S.mini), tree: getTree(S.se, S.wx, tsz), tsz, a: 0 };
    };
    S.resize = (w, h, hzr, top = 0) => {
      const nh = Math.round(top + (h - top) * hzr);
      if (S.layers.length && S.w === Math.max(10, Math.round(w)) && S.h === Math.max(10, Math.round(h)) && S.hz === nh && S.top === top) return;
      S.w = Math.max(10, Math.round(w)); S.h = Math.max(10, Math.round(h)); S.top = top; S.hz = Math.round(top + (h - top) * hzr);
      const l = S.mkLayer(); l.a = 1; S.layers = [l];
      S.parts = S.parts.filter(q => q.x < S.w && q.y < S.h);
      S.initClouds();
    };
    S.initClouds = () => {
      S.clouds = [];
      const n = 9;
      for (let i = 0; i < n; i++) S.clouds.push({ x: rand(-S.w * .1, S.w * 1.1), y: lerp(S.top + 10, S.hz * .78, (i % 4) / 3 + rand(-.08, .08)), s: rand(.75, 1.25), a: 0, v: rand(.6, 1.2), i });
    };
    S.set = (se, wx, instant) => {
      if (se === S.se && wx === S.wx && S.layers.length) return;
      S.se = se; S.wx = wx;
      if (S.w < 20) return;
      const l = S.mkLayer();
      if (instant) { l.a = 1; S.layers = [l]; Object.assign(S.p, WP[wx]); S.clouds.forEach(c => { c.a = c.i < WP[wx].clouds ? 1 : 0; }); }
      else S.layers.push(l);
      if (S.layers.length > 3) S.layers.splice(0, S.layers.length - 3);
    };
    const area = () => (S.w * S.h) / (390 * 700);
    const spawn = (k, rate, fn) => { S.acc[k] = (S.acc[k] || 0) + rate; while (S.acc[k] >= 1) { S.acc[k] -= 1; if (S.parts.length < 520) fn(); } };
    S.update = dt => {
      S.t += dt;
      const top = S.layers[S.layers.length - 1];
      if (top && top.a < 1) { top.a = Math.min(1, top.a + dt / .9); if (top.a >= 1) S.layers = [top]; }
      const T = WP[S.wx], k = 1 - Math.exp(-dt * 1.6);
      for (const n in T) S.p[n] += (T[n] - S.p[n]) * k;
      const p = S.p, A = area(), sc = S.mini ? .6 : 1, wind = p.wind;
      for (const c of S.clouds) {
        const want = c.i < T.clouds ? 1 : 0; c.a += (want - c.a) * (1 - Math.exp(-dt * 1.2));
        c.x += (8 + wind * 50) * c.v * dt * (S.mini ? .5 : 1);
        if (c.x > S.w * 1.25) c.x = -S.w * .25;
      }
      const gy = () => rand(S.hz + 4, S.h);
      if (p.rain > .03) spawn('r', 260 * p.rain * A * dt, () => S.parts.push({ t: 'rain', x: rand(-S.w * .2, S.w), y: rand(-30, S.hz * .3), vx: 120 + wind * 180, vy: rand(700, 900) * Math.max(.6, S.h / 700), gy: gy(), l: rand(10, 18) * sc, life: 3, age: 0 }));
      if (p.snow > .03) spawn('s', 55 * p.snow * A * dt, () => S.parts.push({ t: 'snow', x: rand(-20, S.w + 20), y: rand(-20, 0), vy: rand(30, 70), r: rand(1.6, 4.2) * sc, ph: rand(0, TAU), life: 14, age: 0 }));
      if (S.se === 'autumn') spawn('l', (1.6 + wind * 5) * A * dt * (S.mini ? 2 : 1), () => S.parts.push(leafP(wind > .6)));
      else if (S.se === 'spring' && p.dust < .2) spawn('p', 1.8 * A * dt * (S.mini ? 2 : 1), () => S.parts.push(Object.assign(leafP(false), { t: 'petal', c: pick(['#FFC9DE', '#FFFFFF', '#FFA8C5']) })));
      else if (wind > .7 && S.se !== 'winter' && p.dust < .3) spawn('l', wind * 3 * A * dt, () => S.parts.push(Object.assign(leafP(true), { c: pick(['#69DB7C', '#40C057', '#94D82D']) })));
      if (p.dust > .05) spawn('d', 150 * p.dust * A * dt, () => S.parts.push({ t: 'dust', x: -10, y: rand(S.top, S.h), vx: rand(220, 420) * (S.w / 400), vy: rand(-20, 20), r: rand(1, 2.6) * sc, life: 4, age: 0 }));
      if (wind > .6) spawn('w', (wind - .5) * 2.2 * dt * (S.mini ? .6 : 1), () => S.parts.push({ t: 'wind', x: -S.w * .2, y: rand(S.top + 20, S.h * .85), l: rand(.25, .45) * S.w, vx: S.w * rand(.9, 1.4), life: 2.4, age: 0, a: rand(0, TAU) }));
      // البرق
      if (p.light > .5) { S.nextBolt -= dt; if (S.nextBolt <= 0) { S.nextBolt = rand(2.6, 5); S.flash = 1; S.bolt = boltPath(); if (!S.mini && App.current === ID && !paused) { Sound.noise(1.2, 220, 60, .22, .7, .15); Sound.tone(60, .8, 'sine', .14, -20, .15); } } }
      S.flash = Math.max(0, S.flash - dt * 2.6);
      // فراشات الربيع
      const wantB = S.se === 'spring' && (S.wx === 'sunny' || S.wx === 'cloudy') ? (S.mini ? 1 : 3) : 0;
      while (S.bflies.length < wantB) S.bflies.push({ x: rand(S.w * .2, S.w * .8), y: rand(S.hz - 30, lerp(S.hz, S.h, .5)), ph: rand(0, TAU), c: pick(['#FF8FB1', '#FFD43B', '#B197FC', '#74C0FC']), a: 0, die: false });
      S.bflies.forEach((b, i) => { if (i >= wantB) b.die = true; b.a = clamp(b.a + (b.die ? -dt : dt), 0, 1); b.ph += dt; b.x += Math.cos(b.ph * .7 + i) * 30 * dt; b.y += Math.sin(b.ph * 1.3 + i) * 22 * dt; b.x = clamp(b.x, 10, S.w - 10); b.y = clamp(b.y, S.hz - 60, S.h - 20); });
      S.bflies = S.bflies.filter(b => !(b.die && b.a <= 0));
      for (let i = S.parts.length - 1; i >= 0; i--) {
        const q = S.parts[i]; q.age += dt;
        if (q.t === 'rain') { q.x += q.vx * dt; q.y += q.vy * dt; if (q.y >= q.gy) { if (q.gy < S.h - 2 && S.parts.length < 520) S.parts.push({ t: 'spl', x: q.x, y: q.gy, life: .28, age: 0, s: sc }); S.parts.splice(i, 1); continue; } }
        else if (q.t === 'snow') { q.y += q.vy * dt; q.x += (Math.sin(S.t * 1.5 + q.ph) * 18 + wind * 60) * dt; if (q.y > S.h + 5) q.age = q.life; }
        else if (q.t === 'leaf' || q.t === 'petal') { q.vx += (wind * 90 - q.vx * .4) * dt; q.x += (q.vx + Math.sin(S.t * 2 + q.ph) * 30) * dt; q.y += q.vy * dt; q.rot += q.vr * dt; if (q.y > q.gy) { q.vy = 0; q.vr = 0; q.vx *= .9; } }
        else if (q.t === 'dust') { q.x += q.vx * dt; q.y += q.vy * dt; }
        else if (q.t === 'wind') { q.x += q.vx * dt; }
        if (q.age > q.life || q.x > S.w + 60) S.parts.splice(i, 1);
      }
    };
    function leafP(edge) {
      const tl = S.layers[S.layers.length - 1], tx = S.w * .82, ty = S.hz + (S.h - S.hz) * .14 - (tl ? tl.tsz * .8 : 60);
      return { t: 'leaf', x: edge ? -10 : tx + rand(-30, 30), y: edge ? rand(S.top + 20, S.h * .7) : ty + rand(-20, 30), vx: edge ? rand(80, 160) : rand(-20, 20), vy: rand(25, 55), rot: rand(0, TAU), vr: rand(-3, 3), ph: rand(0, TAU), gy: rand(S.hz + 10, S.h - 4), s: rand(4, 7) * (S.mini ? .7 : 1), c: pick(['#F76707', '#FAB005', '#E03131', '#D9480F']), life: 9, age: 0 };
    }
    function boltPath() {
      const pts = []; let x = rand(S.w * .3, S.w * .7), y = S.top; const end = S.hz * rand(.7, .95);
      pts.push([x, y]); while (y < end) { y += rand(14, 30); x += rand(-22, 22); pts.push([x, y]); }
      return pts;
    }
    S.draw = (c, ox = 0, oy = 0) => {
      c.save(); c.translate(ox, oy);
      for (const l of S.layers) { c.globalAlpha = S.layers.length > 1 && l !== S.layers[0] ? l.a : 1; c.drawImage(l.bg, 0, 0, S.w, S.h); }
      c.globalAlpha = 1;
      const p = S.p, u = Math.min(S.w, S.h) / 10;
      // الشمس
      if (p.sun > .02) {
        const sx = S.w * .78, sy = Math.max(S.top + u * 1.1, S.hz * .3), sr = u * (S.mini ? .75 : .85);
        c.save(); c.globalAlpha = Math.min(1, p.sun) * (1 - p.dust * .45);
        const g = c.createRadialGradient(sx, sy, sr * .3, sx, sy, sr * 3.2); g.addColorStop(0, p.dust > .5 ? 'rgba(255,220,170,.6)' : 'rgba(255,245,180,.75)'); g.addColorStop(1, 'rgba(255,245,180,0)');
        c.fillStyle = g; c.fillRect(sx - sr * 3.2, sy - sr * 3.2, sr * 6.4, sr * 6.4);
        c.translate(sx, sy);
        if (p.dust < .5) { c.save(); c.rotate(S.t * .25); c.fillStyle = 'rgba(255,212,59,.9)'; for (let i = 0; i < 12; i++) { c.rotate(TAU / 12); const l = sr * (1.45 + .12 * Math.sin(S.t * 3 + i)); c.beginPath(); c.moveTo(-sr * .16, -sr * 1.05); c.lineTo(0, -l); c.lineTo(sr * .16, -sr * 1.05); c.closePath(); c.fill(); } c.restore(); }
        ball(c, 0, 0, sr, p.dust > .5 ? '#FFF4E0' : '#FFFBE0', p.dust > .5 ? '#FFD8A8' : '#FFD84A', p.dust > .5 ? '#F0A060' : '#FFAA1E');
        if (p.dust < .5 && !S.mini) {
          c.fillStyle = '#8A4B00'; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * sr * .32, -sr * .1, sr * .08, sr * (Math.sin(S.t * 1.3) > .97 ? .02 : .12), 0, 0, TAU); c.fill(); }
          c.strokeStyle = '#8A4B00'; c.lineWidth = sr * .08; c.lineCap = 'round'; c.beginPath(); c.arc(0, sr * .08, sr * .32, .35, Math.PI - .35); c.stroke();
          c.fillStyle = 'rgba(255,110,80,.4)'; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * sr * .56, sr * .18, sr * .14, sr * .08, 0, 0, TAU); c.fill(); }
        }
        c.restore();
      }
      // الغيوم
      for (const cl of S.clouds) {
        if (cl.a < .02) continue;
        const sz = u * 1.25 * cl.s * (S.mini ? .8 : 1), w = sz * 2.3, h = sz * 1.5;
        const y = cl.y + Math.sin(S.t * .5 + cl.i) * 3;
        c.globalAlpha = cl.a * (1 - Math.min(1, p.dark * 1.2)); c.drawImage(cloudSprite(sz, 0), cl.x - w / 2, y - h / 2, w, h);
        if (p.dark > .02) { c.globalAlpha = cl.a * Math.min(1, p.dark * 1.2); c.drawImage(cloudSprite(sz, 1), cl.x - w / 2, y - h / 2, w, h); }
      }
      c.globalAlpha = 1;
      if (S.bolt && S.flash > .35) {
        c.save(); c.strokeStyle = '#FFF9DB'; c.shadowColor = '#FFE066'; c.shadowBlur = 16; c.lineWidth = 4; c.lineJoin = 'round';
        c.beginPath(); S.bolt.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore();
      }
      // الشجرة
      for (const l of S.layers) {
        const a = S.layers.length > 1 && l !== S.layers[0] ? l.a : 1;
        const tw = l.tree.width / dpr, th = l.tree.height / dpr, bx = S.w * .82, by = S.hz + (S.h - S.hz) * .14;
        const sk = Math.sin(S.t * 1.7) * .02 * (1 + p.wind * 2) + p.wind * .05;
        c.save(); c.globalAlpha = a; c.translate(bx, by); c.transform(1, 0, -sk, 1, 0, 0); c.drawImage(l.tree, -tw / 2, -th, tw, th); c.restore();
      }
      // الفراشات
      for (const b of S.bflies) {
        const s = u * (S.mini ? .22 : .28), f = Math.abs(Math.sin(S.t * 14 + b.ph));
        c.save(); c.globalAlpha = b.a; c.translate(b.x, b.y); c.rotate(Math.cos(b.ph * .7) * .3);
        c.fillStyle = b.c; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * s * .5 * f, -s * .2, s * .5 * f, s * .55, sd * .3, 0, TAU); c.fill(); c.beginPath(); c.ellipse(sd * s * .4 * f, s * .3, s * .35 * f, s * .35, 0, 0, TAU); c.fill(); }
        c.fillStyle = '#343A40'; c.beginPath(); c.ellipse(0, 0, s * .1, s * .45, 0, 0, TAU); c.fill(); c.restore();
      }
      // الجسيمات
      c.lineCap = 'round';
      for (const q of S.parts) {
        if (q.t === 'rain') { c.strokeStyle = 'rgba(210,230,255,.75)'; c.lineWidth = 1.6 * (S.mini ? .8 : 1); const k = q.l / Math.hypot(q.vx, q.vy); c.beginPath(); c.moveTo(q.x, q.y); c.lineTo(q.x - q.vx * k, q.y - q.vy * k); c.stroke(); }
        else if (q.t === 'spl') { const t = q.age / q.life; c.strokeStyle = `rgba(230,240,255,${.8 * (1 - t)})`; c.lineWidth = 1.2; c.beginPath(); c.ellipse(q.x, q.y, (2 + t * 9) * q.s, (1 + t * 3) * q.s, 0, 0, TAU); c.stroke(); }
        else if (q.t === 'snow') { c.fillStyle = 'rgba(255,255,255,.95)'; c.beginPath(); c.arc(q.x, q.y, q.r, 0, TAU); c.fill(); }
        else if (q.t === 'leaf') leafShape(c, q.x, q.y, q.s, q.rot, q.c);
        else if (q.t === 'petal') { c.save(); c.translate(q.x, q.y); c.rotate(q.rot); c.fillStyle = q.c; c.beginPath(); c.ellipse(0, 0, q.s * .7, q.s * .4, 0, 0, TAU); c.fill(); c.restore(); }
        else if (q.t === 'dust') { c.fillStyle = 'rgba(160,100,40,.55)'; c.beginPath(); c.arc(q.x, q.y, q.r, 0, TAU); c.fill(); }
        else if (q.t === 'wind') { const t = q.age / q.life; c.strokeStyle = `rgba(255,255,255,${.7 * Math.sin(Math.PI * Math.min(1, t * 1.2))})`; c.lineWidth = S.mini ? 2 : 3; c.beginPath(); c.moveTo(q.x, q.y); for (let i = 1; i <= 10; i++) { const xx = q.x - q.l * i / 10; c.lineTo(xx, q.y + Math.sin(i * .6 + q.a) * 6); } c.stroke(); c.beginPath(); c.arc(q.x + 8, q.y - 8, 8, Math.PI * .5, Math.PI * 2.2); c.stroke(); }
      }
      // غبار الهبوب
      if (p.dust > .02) {
        const ds = getDust(), A = p.dust;
        const g = c.createLinearGradient(0, 0, 0, S.h); g.addColorStop(0, `rgba(190,120,55,${.5 * A})`); g.addColorStop(1, `rgba(215,160,95,${.42 * A})`);
        c.fillStyle = g; c.fillRect(0, 0, S.w, S.h);
        c.globalAlpha = A;
        for (let i = 0; i < 7; i++) { const r = Math.max(S.w, S.h) * (.25 + (i % 3) * .1), x = ((S.t * (60 + i * 25) + i * 300) % (S.w + r * 2)) - r, y = S.h * (.2 + (i * .13) % .8); c.drawImage(ds, x - r, y - r, r * 2, r * 2); }
        c.globalAlpha = 1;
      }
      if (S.flash > 0) { c.fillStyle = `rgba(255,255,240,${S.flash * .45})`; c.fillRect(0, 0, S.w, S.h); }
      c.restore();
    };
    return S;
  }

  /* =====================================================================
     الطفل (يُرسم بالكامل) — s = الطول بالبكسل، (x,y) = بين القدمين
     ===================================================================== */
  const SKIN = ['#C99067', '#A86B45', '#7E4A2B'], HAIR = '#2B1B14';
  function limb(c, x0, y0, x1, y1, w, col) { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); }
  function drawKid(c, x, y, s, k) {
    const u = s / 100, W = k.worn, has = id => W.has(id), girl = k.girl;
    c.save();
    c.fillStyle = 'rgba(20,30,10,.25)'; c.beginPath(); c.ellipse(x, y, 22 * u * (1 - (k.jump || 0) * .004), 5 * u, 0, 0, TAU); c.fill();
    const sh = k.shiver ? Math.sin(k.t * 48) * k.shiver * 1.1 * u : 0;
    const br = Math.sin(k.t * 2.2) * .012;
    c.translate(x + sh, y - (k.jump || 0) * u); c.scale(u * (1 - br * .5), u * (1 + br));
    c.lineCap = 'round'; c.lineJoin = 'round';
    const hood = has('raincoat') && !has('sunhat');
    const umb = has('umbrella');
    const skin = (x0, y0, r) => { const g = c.createRadialGradient(x0 - r * .4, y0 - r * .4, r * .1, x0, y0, r); g.addColorStop(0, SKIN[0]); g.addColorStop(.6, SKIN[1]); g.addColorStop(1, SKIN[2]); return g; };
    // شعر خلفي
    if (girl && !hood) { ball(c, -15, -86, 9, '#5A3A2A', HAIR, '#120A06'); ball(c, 15, -86, 9, '#5A3A2A', HAIR, '#120A06'); }
    if (hood) { c.fillStyle = '#E0A800'; c.beginPath(); c.arc(0, -73, 21.5, 0, TAU); c.fill(); }
    // الساقان
    const pants = '#8C7AE6';
    for (const sd of [-1, 1]) {
      const lx = sd * 6.2;
      if (has('shorts')) { c.fillStyle = skin(lx, -15, 10); rr(c, lx - 4.3, -30, 8.6, 27, 4.3); c.fill(); }
      else { const g = c.createLinearGradient(lx - 5, 0, lx + 5, 0); g.addColorStop(0, '#A79BF0'); g.addColorStop(1, '#6D5DD3'); c.fillStyle = g; rr(c, lx - 4.6, -30, 9.2, 27, 4.6); c.fill(); }
    }
    // الحذاء
    for (const sd of [-1, 1]) {
      const lx = sd * 6.2;
      if (has('boots')) {
        const g = c.createLinearGradient(lx - 6, 0, lx + 6, 0); g.addColorStop(0, '#69DB7C'); g.addColorStop(1, '#2B8A3E');
        c.fillStyle = g; rr(c, lx - 5.6, -16, 11.2, 13, 3); c.fill();
        c.fillStyle = '#2B8A3E'; c.beginPath(); c.ellipse(lx + sd * 2.2, -2.8, 7.6, 3.6, 0, 0, TAU); c.fill();
        c.fillStyle = '#B2F2BB'; rr(c, lx - 6, -17.5, 12, 3.4, 1.7); c.fill();
        c.fillStyle = 'rgba(255,255,255,.35)'; rr(c, lx - 3.6, -13, 1.6, 8, .8); c.fill();
      } else {
        c.fillStyle = '#F8F9FA'; c.beginPath(); c.ellipse(lx + sd * 2, -3.2, 6.8, 3.8, 0, 0, TAU); c.fill();
        c.fillStyle = girl ? '#F06595' : '#339AF0'; c.beginPath(); c.ellipse(lx + sd * 2, -4.2, 6, 3, 0, Math.PI, TAU); c.fill();
        c.fillStyle = '#868E96'; c.fillRect(lx + sd * 2 - 6.5, -1.4, 13, 1.2);
      }
    }
    if (has('shorts')) {
      const g = c.createLinearGradient(0, -32, 0, -16); g.addColorStop(0, '#74A9F5'); g.addColorStop(1, '#2F6FD0');
      c.fillStyle = g; c.beginPath(); c.moveTo(-13, -33); c.lineTo(13, -33); c.lineTo(13.5, -18); c.lineTo(1.5, -18); c.lineTo(0, -24); c.lineTo(-1.5, -18); c.lineTo(-13.5, -18); c.closePath(); c.fill();
    }
    // الجذع
    const top = has('coat') ? 'coat' : has('raincoat') ? 'raincoat' : has('tshirt') ? 'tshirt' : 'base';
    const TC = { coat: ['#FF8A80', '#E8483F', '#B02A23'], raincoat: ['#FFE066', '#F2B705', '#C98D00'], tshirt: ['#63E6BE', '#20C997', '#0CA678'], base: ['#F1F3F5', '#DEE2E6', '#ADB5BD'] }[top];
    const long = top === 'coat' || top === 'raincoat';
    c.fillStyle = skin(0, -57, 5); rr(c, -3.5, -60, 7, 6, 2); c.fill();
    const tg = c.createLinearGradient(-14, 0, 14, 0); tg.addColorStop(0, TC[0]); tg.addColorStop(.55, TC[1]); tg.addColorStop(1, TC[2]);
    c.fillStyle = tg; c.beginPath();
    const bot = long ? -17 : -29, bw = long ? 15.5 : 13;
    c.moveTo(-11, -57); c.quadraticCurveTo(-14.5, -56, -14, -50); c.lineTo(-bw, bot); c.quadraticCurveTo(0, bot + 2, bw, bot); c.lineTo(14, -50); c.quadraticCurveTo(14.5, -56, 11, -57); c.quadraticCurveTo(0, -54, -11, -57); c.closePath(); c.fill();
    if (top === 'coat') {
      c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = .8; for (const yy of [-46, -37, -28]) { c.beginPath(); c.moveTo(-13.5, yy); c.quadraticCurveTo(0, yy + 1.5, 13.5, yy); c.stroke(); }
      for (const yy of [-50, -42, -34, -26]) ball(c, 0, yy, 1.4, '#fff', '#5C3D2E', '#3B2414');
      c.fillStyle = '#fff'; for (let i = -4; i <= 4; i++) { c.beginPath(); c.arc(i * 2.6, -56 + Math.abs(i) * .3, 2.3, 0, TAU); c.fill(); }
    } else if (top === 'raincoat') {
      c.strokeStyle = '#C98D00'; c.lineWidth = .9; c.beginPath(); c.moveTo(0, -55); c.lineTo(0, -18); c.stroke();
      c.fillStyle = '#C98D00'; for (const yy of [-48, -39, -30]) { rr(c, -2.4, yy, 4.8, 1.8, .9); c.fill(); }
      c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-8, -42, 1.8, 9, .1, 0, TAU); c.fill();
    } else if (top === 'tshirt') {
      c.save(); c.translate(0, -43); c.fillStyle = '#FFD43B'; starPath(c, 4.5); c.fill(); c.restore();
    }
    // الذراعان
    const hands = [];
    for (const sd of [-1, 1]) {
      const sx = sd * 12.5, sy = -53;
      const up = sd === 1 && umb, wave = sd === -1 && k.wave > 0;
      let hx = sd * 21 + (k.armSwing || 0) * sd, hy = -32;
      if (up) { hx = 17; hy = -63; }
      if (wave) { hx = -24 + Math.sin(k.t * 14) * 3; hy = -70; }
      if (long || top === 'base') limb(c, sx, sy, hx, hy, 8, TC[top === 'base' ? 1 : 1]);
      else { limb(c, sx, sy, hx, hy, 7, SKIN[1]); limb(c, sx, sy, lerp(sx, hx, .35), lerp(sy, hy, .35), 8.4, TC[1]); }
      if (long || top === 'base') { c.strokeStyle = 'rgba(255,255,255,.3)'; c.lineWidth = 2; c.beginPath(); c.moveTo(sx - sd * 1.5, sy + 1); c.lineTo(lerp(sx, hx, .7) - sd * 1.5, lerp(sy, hy, .7)); c.stroke(); }
      hands.push([hx, hy, sd]);
    }
    // المظلة (العصا) قبل اليد
    if (umb) { c.strokeStyle = '#5C3D2E'; c.lineWidth = 1.8; c.beginPath(); c.moveTo(17, -58); c.lineTo(14, -112); c.stroke(); }
    for (const [hx, hy, sd] of hands) {
      if (has('gloves')) {
        const g = c.createRadialGradient(hx - 1.5, hy - 1.5, .5, hx, hy, 5.5); g.addColorStop(0, '#FFC078'); g.addColorStop(1, '#E8590C');
        c.fillStyle = g; c.beginPath(); c.ellipse(hx, hy + .5, 5, 5.6, 0, 0, TAU); c.fill();
        c.beginPath(); c.ellipse(hx - sd * 4, hy - 1, 1.9, 2.8, sd * .5, 0, TAU); c.fill();
        c.fillStyle = '#fff'; rr(c, hx - 5, hy - 6.5, 10, 2.6, 1.3); c.fill();
      } else { c.fillStyle = skin(hx, hy, 4.4); c.beginPath(); c.arc(hx, hy, 4.2, 0, TAU); c.fill(); }
    }
    // الوشاح
    if (has('scarf') && !k.scarfUp) {
      c.fillStyle = '#E64980'; rr(c, -12, -60, 24, 7, 3.5); c.fill();
      c.fillStyle = '#C2255C'; rr(c, 3, -56, 6.5, 17, 2.5); c.fill();
      c.fillStyle = '#fff'; for (const yy of [-51, -45]) c.fillRect(3, yy, 6.5, 1.6);
      c.fillStyle = 'rgba(255,255,255,.35)'; rr(c, -10, -59, 18, 1.6, .8); c.fill();
    }
    // الرأس
    c.fillStyle = skin(-16, -72, 4); c.beginPath(); c.arc(-16.3, -71, 3.6, 0, TAU); c.arc(16.3, -71, 3.6, 0, TAU); c.fill();
    c.fillStyle = skin(0, -72, 18); c.beginPath(); c.arc(0, -72, 17, 0, TAU); c.fill();
    // الوجه
    const blink = k.blink > 0, squint = k.squint;
    c.fillStyle = '#1A0F0A'; c.strokeStyle = '#1A0F0A'; c.lineWidth = 1.5;
    for (const sd of [-1, 1]) {
      const ex = sd * 6, ey = -72 + (k.look || 0);
      if (squint) { c.beginPath(); c.moveTo(ex - 2.6, ey - 1.6); c.lineTo(ex + sd * .6, ey); c.lineTo(ex - 2.6, ey + 1.6); c.stroke(); }
      else if (blink) { c.beginPath(); c.moveTo(ex - 2.4, ey); c.quadraticCurveTo(ex, ey + 1.6, ex + 2.4, ey); c.stroke(); }
      else { c.beginPath(); c.ellipse(ex, ey, 2.3, 2.9, 0, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(ex - .8, ey - 1.1, .9, 0, TAU); c.fill(); c.fillStyle = '#1A0F0A'; }
      if (girl) { c.lineWidth = .9; c.beginPath(); c.moveTo(ex + sd * 2.1, ey - 1.4); c.lineTo(ex + sd * 3.6, ey - 2.3); c.stroke(); c.lineWidth = 1.5; }
    }
    c.fillStyle = 'rgba(255,120,120,.4)'; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * 10, -66.5, 3, 1.8, 0, 0, TAU); c.fill(); }
    const mood = k.mood == null ? 1 : k.mood;
    c.strokeStyle = '#5C1F12'; c.lineWidth = 1.5;
    if (mood > .75) { c.fillStyle = '#7A2618'; c.beginPath(); c.moveTo(-4.5, -64.5); c.quadraticCurveTo(0, -58, 4.5, -64.5); c.closePath(); c.fill(); c.fillStyle = '#FF8787'; c.beginPath(); c.ellipse(0, -61.6, 2.2, 1, 0, 0, TAU); c.fill(); }
    else if (mood > .4) { c.beginPath(); c.arc(0, -66, 3.6, .5, Math.PI - .5); c.stroke(); }
    else { c.beginPath(); c.moveTo(-3.5, -62.5); c.quadraticCurveTo(-1.5, -64.5, 0, -63); c.quadraticCurveTo(1.5, -61.5, 3.5, -63); c.stroke(); }
    // الشعر الأمامي
    if (!hood) {
      c.fillStyle = HAIR;
      if (girl) { c.beginPath(); c.arc(0, -73, 17.6, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(8, -80, 0, -78); c.quadraticCurveTo(-9, -81, -17, -76); c.closePath(); c.fill();
        c.fillStyle = '#F06595'; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * 12.5, -83, 3, 2, sd * .6, 0, TAU); c.fill(); } }
      else { for (let i = 0; i < 9; i++) { const a = Math.PI * (1.08 + i * .105); c.beginPath(); c.arc(Math.cos(a) * 15.5, -73 + Math.sin(a) * 15.5, 4.6, 0, TAU); c.fill(); } c.beginPath(); c.arc(0, -75, 15, Math.PI, TAU); c.fill(); }
      c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.ellipse(-6, -86, 5, 1.8, -.3, 0, TAU); c.fill();
    } else {
      c.strokeStyle = '#F2B705'; c.lineWidth = 4.2; c.beginPath(); c.arc(0, -73, 18.6, Math.PI * .92, Math.PI * 2.08); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = 1.2; c.beginPath(); c.arc(0, -73, 19.8, Math.PI * 1.2, Math.PI * 1.5); c.stroke();
    }
    if (has('scarf') && k.scarfUp) {
      c.fillStyle = '#E64980'; rr(c, -15, -70.5, 30, 11.5, 5.5); c.fill();
      c.fillStyle = '#C2255C'; rr(c, -12, -61, 24, 6, 3); c.fill();
      c.fillStyle = 'rgba(255,255,255,.5)'; for (const xx of [-8, 0, 8]) c.fillRect(xx, -70, 1.6, 11);
    }
    if (has('sunglasses')) { c.save(); c.translate(0, -72.5); c.scale(.42, .42); ICON.sunglasses(c, 40); c.restore(); }
    if (has('sunhat')) { c.save(); c.translate(0, -88); c.scale(1, 1); ICON.sunhat(c, 50); c.restore(); }
    if (umb) canopy(c, 14, -106, 36, 26, ['#9775FA', '#7048E8', '#E5DBFF']);
    c.restore();
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #seasons{background:#BFE6FF;overflow:hidden;color:#24364F}
  #seasons canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #seasons .ib{color:#1C7ED6}
  #seasons .lang{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 rgba(20,60,120,.18),0 8px 16px rgba(20,60,120,.15)}
  #seasons .lang button{min-width:62px;padding:6px 11px;border-radius:99px;font-weight:900;font-size:16px;background:#EAF4FF;color:#1C5FA8;line-height:1.25}
  #seasons .lang button.on{background:linear-gradient(#5CB8FF,#1C7ED6);color:#fff;box-shadow:0 3px 0 #155DA8;text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #seasons .prog{position:absolute;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 58px);display:flex;gap:5px;padding:6px 10px;background:rgba(255,255,255,.92);border-radius:99px;z-index:4;box-shadow:0 3px 0 rgba(0,0,0,.08),0 6px 14px rgba(0,0,0,.1)}
  #seasons .prog:empty{display:none}
  #seasons .prog i{width:22px;height:11px;border-radius:6px;background:#E2E8EE;box-shadow:inset 0 2px 0 rgba(0,0,0,.08);transition:background .3s}
  #seasons .prog i.on{background:linear-gradient(#FFD43B,#FF922B);box-shadow:0 2px 0 #D9480F;animation:seaPop .45s cubic-bezier(.3,1.8,.5,1)}
  @keyframes seaPop{40%{transform:scale(1.5,1.3)}}
  #seasons .sayb{position:absolute;z-index:5;width:60px;height:60px;flex:none;font-size:27px;top:calc(max(10px,env(safe-area-inset-top)) + 54px);left:max(12px,env(safe-area-inset-left))}
  #seasons .hint{top:calc(max(10px,env(safe-area-inset-top)) + 96px)}
  #seasons .hint span{color:#1C5FA8;font-size:15px}
  #seasons .overlay{background:radial-gradient(circle at 50% 45%,rgba(20,60,120,.25),rgba(10,30,70,.5))}
  #seasons .panel{border:5px solid #BFE0FF;box-shadow:0 8px 0 #74B4F0,0 20px 40px rgba(10,40,90,.3);color:#24364F;background:linear-gradient(180deg,#fff 0%,#fff 70%,#EEF6FF 100%)}
  #seasons .panel h3{color:#1C7ED6;text-shadow:0 3px 0 #D6EBFF}
  #seasons .btn{background:linear-gradient(#FFB938,#FF8A1F);box-shadow:0 5px 0 #D9600B,0 8px 12px rgba(217,96,11,.25)}
  #seasons .btn:active{box-shadow:0 1px 0 #D9600B}
  #seasons .btn.alt{background:#fff;color:#1C7ED6;box-shadow:0 5px 0 #BFE0FF;border:3px solid #DDEEFF}
  #seasons .wic{font-size:46px;line-height:1.1;margin:2px 0}
  #seasons .lvp{width:min(94vw,440px);max-height:88vh;overflow-y:auto;touch-action:pan-y}
  #seasons .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:10px 0 12px}
  #seasons .lvb{position:relative;aspect-ratio:.9;border-radius:20px;background:#fff;border:3px solid #C5E3FF;box-shadow:0 5px 0 #8CC4F5;
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#1C5FA8;font-weight:900;padding:2px}
  #seasons .lvb.m-season{border-color:#FFD8A8;box-shadow:0 5px 0 #F5A65B}
  #seasons .lvb.m-acts{border-color:#D3F9D8;box-shadow:0 5px 0 #8CE99A}
  #seasons .lvb.m-report{border-color:#E5DBFF;box-shadow:0 5px 0 #B197FC}
  #seasons .lvb:active{transform:translateY(3px)}
  #seasons .lvb .n{font-size:13px;position:absolute;top:2px;right:8px;opacity:.7}
  #seasons .lvb .e{font-size:30px;line-height:1.15}
  #seasons .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:12px}
  #seasons .lvb .s i{font-style:normal}
  #seasons .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #seasons .lvb.cur{outline:3px solid #FF922B;outline-offset:2px}
  #seasons .lvb.lock{background:#EEF1F4;border-color:#DDE3EA;box-shadow:0 5px 0 #C5CED8;color:#8A96A3}
  #seasons .lvb.lock .e{filter:grayscale(1);opacity:.35}
  #seasons .lvb.lock::after{content:'🔒';position:absolute;font-size:18px;bottom:3px}
  #seasons .playb{display:block;width:100%;margin:0 0 4px;padding:10px;border-radius:20px;font-weight:900;font-size:18px;color:#fff;background:linear-gradient(#69DB7C,#2F9E44);box-shadow:0 5px 0 #237A35;border:3px solid #fff}
  #seasons .playb:active{transform:translateY(3px);box-shadow:0 2px 0 #237A35}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🔢</button>
      <button class="ib playbtn" aria-label="العب بالطقس">🎨</button>
      <span class="grow"></span>
      <div class="lang"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="prog"></div>
    <button class="ib snd sayb" aria-label="اسمع مرة أخرى">🔊</button>
    <div class="hint"><span class="hintT"></span></div>
    <div class="overlay" id="seLv"><div class="panel lvp"><h3>🔢 المستويات</h3>
      <button class="playb" data-a="play">🎨 العب بالطقس</button>
      <div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="seWin"><div class="panel">
      <h3 class="wT"></h3><div class="wic"></div><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const progEl = root.querySelector('.prog'), sayBtn = root.querySelector('.sayb');
  const hintEl = root.querySelector('.hint'), hintT = root.querySelector('.hintT');
  const lvOv = root.querySelector('#seLv'), winOv = root.querySelector('#seWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, portrait = true, topY = 110;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, def = LEVELS[0], mode = 'dress';
  let total = 0, done = 0, mistakes = 0, over = false, idleT = 0, shake = 0;
  let tasks = [], parts = [], rings = [], drag = null;
  const scene = makeScene(false);
  let minis = [];                     // مشاهد الفصول الصغيرة (وضع الأنشطة)
  let cards = [];                     // البطاقات القابلة للسحب/اللمس
  let kid = null;                     // الطفل
  let Q = null;                       // حالة السؤال الحالي
  let dropZone = null;                // منطقة الإفلات (لوحة الطفل)
  let slots = [];                     // خانات النشرة الجوية
  let palette = [];                   // أزرار الوضع الحر

  const later = (s, fn) => tasks.push({ t: s, fn });

  /* ---------- النطق ---------- */
  const sayGood = () => say(App.g('أحسنتِ!', 'أحسنتَ!'), 'Well done!');
  const sayTry = () => say(App.g('حاولي مرة أخرى.', 'حاول مرة أخرى.'), 'Try again!');
  const sayWx = w => say(WX[w].sen, WX[w].sen_en);
  function askCurrent() {
    if (mode === 'dress' && Q) say(WX[Q.wx].sen + ' ماذا نلبس؟', WX[Q.wx].sen_en + '. What should we wear?');
    else if (mode === 'season') say('أي فصل هذا؟', 'Which season is it?');
    else if (mode === 'acts') say('ماذا نفعل في كل فصل؟', 'What do we do in each season?');
    else if (mode === 'report') say('كيف الطقس اليوم؟', 'What is the weather today?');
    else if (mode === 'play') sayWx(scene.wx);
  }

  /* ---------- البطاقات ---------- */
  function mkCard(kind, id, o = {}) {
    return Object.assign({ kind, id, hx: 0, hy: 0, x: 0, y: 0, w: 60, h: 60, st: 'tray', t: 0, fx: 0, fy: 0, tx: 0, ty: 0, pop: 0, shake: 0, glow: 0, sc: 1, intro: 0, done: false, hide: false }, o);
  }
  function cardColor(cd) {
    if (cd.kind === 'item') return ITEMS[cd.id].c;
    if (cd.kind === 'act') return SEAS[ACTS[cd.id].s] ? '#20A4F3' : '#20A4F3';
    if (cd.kind === 'sea') return SEAS[cd.id].c;
    if (cd.kind === 'wx') return WX[cd.id].c;
    if (cd.kind === 'temp') return TEMP[cd.id].c;
    return '#339AF0';
  }
  function cardLabel(cd) {
    if (cd.kind === 'item') return L(ITEMS[cd.id]);
    if (cd.kind === 'act') { const a = ACTS[cd.id]; return lang === 'ar' ? (a.sh || a.ar) : (a.sh_en || a.en); }
    if (cd.kind === 'sea') return L(SEAS[cd.id]);
    if (cd.kind === 'wx') return L(WX[cd.id]);
    if (cd.kind === 'temp') return L(TEMP[cd.id]);
    return '';
  }
  function cardArt(cd) {
    if (cd.kind === 'item') return ['it:' + cd.id, vecDraw(ICON[cd.id])];
    if (cd.kind === 'act') return ['e:' + ACTS[cd.id].e, emojiDraw(ACTS[cd.id].e)];
    if (cd.kind === 'sea') return ['se:' + cd.id, vecDraw(SEI[cd.id])];
    if (cd.kind === 'wx') return ['wx:' + cd.id, vecDraw(WXI[cd.id])];
    if (cd.kind === 'temp') return ['tp:' + cd.id, vecDraw(TEMPI[cd.id])];
  }
  function speakCard(cd) {
    if (cd.kind === 'item') say(ITEMS[cd.id].ar, ITEMS[cd.id].en);
    else if (cd.kind === 'act') say(ACTS[cd.id].ar, ACTS[cd.id].en);
    else if (cd.kind === 'sea') say(SEAS[cd.id].ar, SEAS[cd.id].en);
    else if (cd.kind === 'wx') say(WX[cd.id].ar, WX[cd.id].en);
    else if (cd.kind === 'temp') say(TEMP[cd.id].ar, TEMP[cd.id].en);
  }
  /* بطاقة بيضاء سميكة بحافة ملوّنة (أسلوب اللعبة المجسّمة) */
  function drawCardBox(c, x, y, w, h, col, o = {}) {
    const r = Math.min(w, h) * .24, d = Math.max(3, h * .07), b = Math.max(3, Math.min(w, h) * .055);
    c.save();
    c.shadowColor = 'rgba(20,30,60,.25)'; c.shadowBlur = o.lift ? 18 : 8; c.shadowOffsetY = o.lift ? 10 : 4;
    c.fillStyle = shade(col, -.28); rr(c, x, y + d, w, h, r); c.fill(); c.restore();
    c.fillStyle = col; rr(c, x, y, w, h, r); c.fill();
    const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, o.tint || mix(col, '#ffffff', .88));
    c.fillStyle = g; rr(c, x + b, y + b, w - 2 * b, h - 2 * b, r - b * .7); c.fill();
    c.fillStyle = 'rgba(255,255,255,.55)'; rr(c, x + w * .18, y + b * .35, w * .64, b * .5, b * .25); c.fill();
  }
  function textFit(c, t, x, y, maxW, size, col, weight = 900) {
    let s = size; c.font = `${weight} ${s}px ${FONT}`;
    while (s > 9 && c.measureText(t).width > maxW) { s -= 1; c.font = `${weight} ${s}px ${FONT}`; }
    c.fillStyle = col; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = lang === 'ar' ? 'rtl' : 'ltr'; c.fillText(t, x, y);
  }
  function drawCard(cd) {
    if (cd.hide) return;
    const it = cd.intro < 1 ? ease.outBack(clamp(cd.intro, 0, 1)) : 1; if (it <= 0) return;
    const lift = cd.st === 'drag';
    const sq = Math.sin((1 - cd.pop) * Math.PI * 3) * cd.pop * .12;
    const sx = cd.shake > 0 ? Math.sin(cd.shake * 40) * 8 * cd.shake : 0;
    const s = it * cd.sc * (lift ? 1.1 : 1);
    ctx.save(); ctx.translate(cd.x + sx, cd.y); ctx.scale(s * (1 + sq), s * (1 - sq)); if (lift) ctx.rotate(cd.rot || 0);
    const w = cd.w, h = cd.h, col = cardColor(cd);
    if (cd.glow > 0) { ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(T * 9); ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 22; ctx.fillStyle = '#FFE066'; rr(ctx, -w / 2 - 5, -h / 2 - 5, w + 10, h + 10, Math.min(w, h) * .28); ctx.fill(); ctx.restore(); }
    drawCardBox(ctx, -w / 2, -h / 2, w, h, cd.ok ? '#40C057' : col, { lift });
    const [key, dr] = cardArt(cd), lab = cd.noLabel ? '' : cardLabel(cd);
    const art = Math.min(w * .72, (lab ? h * .62 : h * .78));
    sticker(ctx, key, dr, 0, lab ? -h * .12 : -h * .02, art);
    if (lab) textFit(ctx, lab, 0, h * .32, w * .86, Math.max(11, Math.min(17, h * .16)), shade(col, -.35));
    if (cd.ok) { ctx.fillStyle = '#40C057'; ctx.beginPath(); ctx.arc(w * .38, -h * .38, Math.min(w, h) * .13, 0, TAU); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(w * .32, -h * .38); ctx.lineTo(w * .37, -h * .33); ctx.lineTo(w * .45, -h * .44); ctx.stroke(); }
    ctx.restore();
  }
  function cardHit(cd, x, y, pad = 0) { return !cd.hide && Math.abs(x - cd.x) < cd.w / 2 + pad && Math.abs(y - cd.y) < cd.h / 2 + pad; }
  function sendBack(cd) { cd.st = 'back'; cd.t = 0; cd.fx = cd.x; cd.fy = cd.y; }
  function flyTo(cd, x, y, sc, cb) { cd.st = 'fly'; cd.t = 0; cd.fx = cd.x; cd.fy = cd.y; cd.tx = x; cd.ty = y; cd.fsc = cd.sc; cd.tsc = sc; cd.cb = cb; }

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    portrait = W / H < 1.05;
    const pb = progEl.getBoundingClientRect();
    topY = (pb.height ? pb.bottom : 80) + 8;
    const hzr = mode === 'report' ? (portrait ? .3 : .42) : mode === 'season' ? (portrait ? .45 : .5) : portrait ? .38 : .45;
    scene.resize(W, H, hzr, mode === 'acts' ? 0 : Math.max(0, topY - 40));
    if (mode === 'dress' || mode === 'play') layoutDress();
    else if (mode === 'season') layoutSeason();
    else if (mode === 'acts') layoutActs();
    else if (mode === 'report') layoutReport();
  }
  function trayGrid(list, cols, x0, x1, y0, cw, ch, gap) {
    const rows = Math.ceil(list.length / cols);
    list.forEach((cd, i) => {
      const r = Math.floor(i / cols), inRow = Math.min(cols, list.length - r * cols), j = i - r * cols;
      const rowW = inRow * cw + (inRow - 1) * gap, sx = (x0 + x1) / 2 - rowW / 2;
      const jj = lang === 'ar' ? inRow - 1 - j : j;
      cd.hx = sx + jj * (cw + gap) + cw / 2; cd.hy = y0 + r * (ch + gap) + ch / 2; cd.w = cw; cd.h = ch;
      if (cd.st === 'tray' || cd.st === 'init') { cd.x = cd.hx; cd.y = cd.hy; cd.st = 'tray'; }
    });
    return rows * ch + (rows - 1) * gap;
  }
  function layoutDress() {
    const bottom = H - Math.max(12, safeB());
    let trayTop;
    if (mode === 'play') {
      const n1 = 4, n2 = 7;
      const cw = Math.min(portrait ? (W - 24 - 6 * 6) / 4 : 92, 96), ch = cw * .95;
      const cw2 = portrait ? Math.min((W - 24 - 3 * 6) / 4, 96) : Math.min((W - 40 - 6 * 8) / 7, 96), ch2 = cw2 * .95;
      const rows2 = portrait ? 2 : 1;
      const tot = ch + 10 + rows2 * ch2 + (rows2 - 1) * 8;
      trayTop = bottom - tot - 8;
      trayGrid(palette.filter(p => p.kind === 'sea'), n1, 12, W - 12, trayTop, cw, ch, 8);
      trayGrid(palette.filter(p => p.kind === 'wx'), portrait ? 4 : n2, 12, W - 12, trayTop + ch + 12, cw2, ch2, 8);
    } else {
      const cols = portrait ? 5 : 10, gap = portrait ? 7 : 10;
      const cw = Math.min((W - 24 - (cols - 1) * gap) / cols, portrait ? 84 : 104), ch = cw * 1.08;
      const rows = Math.ceil(cards.length / cols);
      trayTop = bottom - (rows * ch + (rows - 1) * gap) - 6;
      trayGrid(cards, cols, 12, W - 12, trayTop, cw, ch, gap);
    }
    const ks = clamp(Math.min((trayTop - topY - 20) * .95, W * (portrait ? .62 : .3)), 150, 430);
    if (kid) { kid.s = ks; kid.x = W / 2; kid.y = trayTop - 18; }
    dropZone = kid ? { x: kid.x - ks * .36, y: kid.y - ks * 1.08, w: ks * .72, h: ks * 1.1 } : null;
    trayRect = { y: trayTop - 10 };
  }
  let trayRect = { y: 0 };
  const safeB = () => { const v = parseFloat(getComputedStyle(root).getPropertyValue('--sab')) || 0; return v; };
  function layoutSeason() {
    const bottom = H - 14;
    const cols = portrait ? 2 : 4, gap = 12;
    const cw = Math.min((Math.min(W, 900) - 28 - (cols - 1) * gap) / cols, portrait ? 170 : 190), ch = Math.min(cw * (portrait ? .78 : .9), portrait ? 128 : 160);
    const rows = Math.ceil(cards.length / cols), th = rows * ch + (rows - 1) * gap;
    trayGrid(cards, cols, 14, W - 14, bottom - th - 6, cw, ch, gap);
    trayRect = { y: bottom - th - 16 };
  }
  function layoutActs() {
    const n = def.ss.length, gap = 10;
    const cols = portrait ? (n === 2 ? 2 : 2) : n, rows = Math.ceil(n / cols);
    const ncards = cards.length;
    const ccols = portrait ? 4 : Math.min(8, ncards), crow = Math.ceil(ncards / ccols);
    const cw = Math.min((Math.min(W, 1000) - 24 - (ccols - 1) * 8) / ccols, portrait ? 92 : 108), ch = cw * 1.08;
    const trayH = crow * ch + (crow - 1) * 8;
    const bottom = H - 14, trayTop = bottom - trayH - 4;
    trayGrid(cards.filter(c => !c.done), ccols, 12, W - 12, trayTop, cw, ch, 8);
    trayRect = { y: trayTop - 12 };
    const areaTop = topY + 4, areaBot = trayTop - 22, aw = Math.min(W - 24, portrait ? 520 : 1100);
    const fw = (aw - (cols - 1) * gap) / cols, fh = Math.min((areaBot - areaTop - (rows - 1) * gap) / rows, fw * (portrait ? 1.75 : 1.1));
    const totalH = rows * fh + (rows - 1) * gap, y0 = areaTop + (areaBot - areaTop - totalH) / 2, x0 = (W - aw) / 2;
    minis.forEach((m, i) => {
      const r = Math.floor(i / cols), j = i % cols, jj = lang === 'ar' ? cols - 1 - j : j;
      m.x = x0 + jj * (fw + gap); m.y = y0 + r * (fh + gap); m.w = fw; m.h = fh;
      m.sc.resize(fw, fh, .52, 0);
      m.placed.forEach((cd, k) => placeInFrame(m, cd, k, true));
    });
  }
  function placeInFrame(m, cd, k, now) {
    const per = 4, s = Math.min(m.w / (per + .6), m.h * .3), row = Math.floor(k / per), j = k % per;
    const x = m.x + m.w / 2 + (j - (Math.min(per, Math.max(1, m.placed.length - row * per)) - 1) / 2) * s * 1.05 * (lang === 'ar' ? -1 : 1);
    const y = m.y + m.h - s * .62 - row * s * 1.02;
    cd.fsc = cd.sc; cd.tsc = s / cd.w;
    if (now) { cd.x = x; cd.y = y; cd.sc = s / cd.w; cd.st = 'placed'; } else { cd.tx = x; cd.ty = y; }
    return { x, y, sc: s / cd.w };
  }
  function layoutReport() {
    const bottom = H - 14;
    const n = Math.max(cards.length, (portrait ? 4 : 5) + (def.temp ? 3 : 0)), cols = portrait ? 4 : n;
    const cw = Math.min((Math.min(W, 1000) - 24 - (cols - 1) * 8) / cols, portrait ? 88 : 104), ch = cw * 1.05;
    const rows = Math.ceil(n / cols), th = rows * ch + (rows - 1) * 8;
    const trayTop = bottom - th - 4;
    trayGrid(cards, cols, 12, W - 12, trayTop, cw, ch, 8);
    trayRect = { y: trayTop - 12 };
    // لوحة النشرة
    const bw = Math.min(W - 28, portrait ? 360 : 460), bh = Math.min(portrait ? 175 : 190, (trayTop - topY) * .5);
    const bx = (W - bw) / 2 + (portrait ? 0 : 60), by = trayTop - 22 - bh;
    board = { x: bx, y: by, w: bw, h: bh };
    const ns = def.temp ? 2 : 1, ss = Math.min(bh * .58, (bw - 30) / ns - 16);
    slots.forEach((sl, i) => {
      const jj = lang === 'ar' ? ns - 1 - i : i;
      sl.w = ss; sl.h = ss; sl.x = bx + bw / 2 + (jj - (ns - 1) / 2) * (ss + 26); sl.y = by + bh * .58;
      if (sl.card) { sl.card.x = sl.x; sl.card.y = sl.y; sl.card.w = ss * .92; sl.card.h = ss * .92; }
    });
    if (kid) { kid.s = clamp(portrait ? bh * 1.05 : bh * 1.3, 120, 260); kid.x = portrait ? bx + kid.s * .3 + 4 : bx - kid.s * .32; kid.y = by + (portrait ? 2 : bh); }
  }
  let board = null;

  /* ---------- المستويات ---------- */
  function setProg() {
    progEl.style.direction = lang === 'ar' ? 'rtl' : 'ltr';
    progEl.innerHTML = mode === 'play' ? '' : Array.from({ length: total }, (_, i) => `<i class="${i < done ? 'on' : ''}"></i>`).join('');
  }
  function bumpProg() { const i = progEl.children[done - 1]; if (i) i.classList.add('on'); }
  function showHint(t) { hintT.textContent = t; hintEl.style.opacity = 1; }
  function hideHint() { hintEl.style.opacity = 0; }
  function resetLevelState() {
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    tasks = []; parts = []; rings = []; drag = null; over = false; mistakes = 0; done = 0; idleT = 0;
    cards = []; minis = []; slots = []; palette = []; kid = null; Q = null; board = null;
  }
  function newKid() { return { x: 0, y: 0, s: 200, worn: new Set(), girl: isGirl(), t: 0, jump: 0, jv: 0, blink: 0, nb: 2, wave: 0, mood: .6, shiver: 0, squint: false, scarfUp: false, react: 0 }; }
  function startLevel(n) {
    lvl = clamp(n, 1, LEVELS.length); def = LEVELS[lvl - 1]; mode = def.m;
    resetLevelState();
    if (mode === 'dress') {
      total = def.w.reduce((a, w) => a + DRESS[w].need.length, 0);
      kid = newKid();
      cards = shuffle(ITEM_ORDER.slice()).map((id, i) => mkCard('item', id, { intro: -i * .05 }));
      Q = { round: 0, wx: def.w[0], errs: 0 };
      scene.set(DRESS[Q.wx].s, Q.wx, true);
      layout();
      later(.5, askCurrent);
      showHint('👆 ' + App.g('اسحبي', 'اسحب') + ' الملابس المناسبة إلى ' + App.g('الطفلة', 'الطفل'));
    } else if (mode === 'season') {
      total = def.q;
      cards = SEA_ORDER.map((id, i) => mkCard('sea', id, { intro: -i * .07 }));
      Q = { q: 0, target: null, last: null, answered: false, tries: 0 };
      const s0 = pick(SEA_ORDER); scene.set(s0, pick(SEASON_WX[s0]), true);
      layout();
      later(.3, nextSeasonQ);
      showHint('👀 ' + App.g('انظري', 'انظر') + ' إلى المشهد… أيّ فصل هذا؟');
    } else if (mode === 'acts') {
      total = def.a.length;
      minis = def.ss.map(id => { const sc = makeScene(true); sc.se = id; sc.wx = SEASON_WX[id][0]; Object.assign(sc.p, WP[sc.wx]); return { id, sc, placed: [], x: 0, y: 0, w: 10, h: 10, glow: 0, shake: 0, pop: 0 }; });
      cards = shuffle(def.a.slice()).map((id, i) => mkCard('act', id, { intro: -i * .06 }));
      scene.set('spring', 'sunny', true);
      layout();
      later(.4, askCurrent);
      showHint('👆 ' + App.g('اسحبي', 'اسحب') + ' كل نشاط إلى فصله');
    } else if (mode === 'report') {
      total = def.q;
      kid = newKid(); kid.wave = 1;
      Q = { q: 0, wx: null, temp: null, used: [] };
      scene.set('summer', 'sunny', true);
      layout();
      later(.3, nextReportQ);
      showHint('📺 ' + App.g('أنتِ', 'أنت') + ' مذيع' + App.g('ة', '') + ' النشرة الجوية!');
    }
    setProg();
    Sound.whoosh();
  }
  function startPlay() {
    resetLevelState(); mode = 'play'; total = 0;
    kid = newKid(); kid.wave = 1.5;
    palette = [...SEA_ORDER.map(id => mkCard('sea', id, { noLabel: false })), ...WX_ORDER.map(id => mkCard('wx', id))];
    palette.forEach((p, i) => { p.intro = -i * .04; });
    cards = palette;
    const se = scene.se || 'spring', wx = scene.wx || 'sunny';
    scene.set(se, wx, true);
    layout(); dressFor(se, wx);
    setProg(); hideHint();
    showHint('🎨 ' + App.g('غيّري', 'غيّر') + ' الفصل والطقس كما ' + App.g('تحبين', 'تحب'));
    later(4, hideHint);
    Sound.whoosh();
  }
  function dressFor(se, wx) {
    if (!kid) return;
    const d = DRESS[wx] || (wx === 'stormy' ? { need: ['raincoat', 'boots'] } : wx === 'cloudy' ? { need: se === 'winter' ? ['coat', 'scarf'] : [] } : null);
    let need = d ? d.need.slice() : [];
    if (wx === 'sunny' && se === 'winter') need = ['coat', 'scarf', 'gloves', 'sunglasses'];
    else if (wx === 'sunny' && se === 'spring') need = ['tshirt', 'sunglasses'];
    else if (wx === 'sunny' && se === 'autumn') need = ['coat'];
    else if (wx === 'rainy' && se === 'winter') need = ['raincoat', 'boots', 'umbrella', 'gloves'];
    kid.worn = new Set(need); kid.jump = 6; kid.jv = 0;
    kid.scarfUp = wx === 'haboob';
  }

  /* ----- الطفل: ردود فعل الطقس ----- */
  function kidUpdate(dt) {
    if (!kid) return;
    kid.t += dt;
    kid.nb -= dt; if (kid.nb <= 0) { kid.blink = .12; kid.nb = rand(2, 4.5); }
    kid.blink = Math.max(0, kid.blink - dt);
    kid.wave = Math.max(0, kid.wave - dt);
    if (kid.jump > 0 || kid.jv) { kid.jv -= 300 * dt; kid.jump += kid.jv * dt; if (kid.jump <= 0) { kid.jump = 0; kid.jv = 0; } }
    kid.react = Math.max(0, kid.react - dt);
    if (mode === 'dress' && Q) {
      const need = DRESS[Q.wx].need, got = need.filter(i => kid.worn.has(i)).length, comfort = got / need.length;
      kid.mood = kid.react > 0 ? 1 : comfort >= 1 ? 1 : .2 + comfort * .5;
      kid.shiver = (Q.wx === 'snowy' || Q.wx === 'windy') ? (1 - comfort) : 0;
      kid.squint = Q.wx === 'haboob' && !kid.worn.has('sunglasses');
      kid.scarfUp = Q.wx === 'haboob';
      if (Q.wx === 'sunny' && comfort < 1 && Math.random() < dt * 2.2 * (1 - comfort)) parts.push({ t: 'sweat', x: kid.x + rand(-1, 1) * kid.s * .12, y: kid.y - kid.s * .82, vx: rand(-20, 20), vy: -30, life: .9, age: 0, s: kid.s * .025 });
      if ((Q.wx === 'rainy') && !kid.worn.has('umbrella') && Math.random() < dt * 4) parts.push({ t: 'drip', x: kid.x + rand(-1, 1) * kid.s * .15, y: kid.y - kid.s * .9, vx: 0, vy: 60, life: .6, age: 0, s: kid.s * .02 });
    } else if (mode === 'report' || mode === 'play') { kid.mood = 1; kid.shiver = 0; kid.squint = false; }
  }

  /* ----- وضع الملابس ----- */
  function tryWear(cd) {
    const need = DRESS[Q.wx].need;
    if (need.includes(cd.id) && !kid.worn.has(cd.id)) {
      flyTo(cd, kid.x, kid.y - kid.s * .55, .3, () => {
        cd.hide = true; cd.st = 'worn';
        kid.worn.add(cd.id); kid.jump = 4; kid.jv = 120; kid.react = 1.2;
        Sound.pop(); Sound.star(); vibrate(20);
        sparkle(kid.x, kid.y - kid.s * .55, ITEMS[cd.id].c);
        done++; bumpProg(); hideHint();
        say(ITEMS[cd.id].ar, ITEMS[cd.id].en);
        if (need.every(i => kid.worn.has(i))) later(.9, roundDone);
      });
    } else {
      mistakes++; Q.errs++; cd.shake = 1; shake = 4; sendBack(cd);
      kid.react = 0; kid.look = 0; Sound.error(); vibrate(30);
      parts.push({ t: 'no', x: kid.x + kid.s * .22, y: kid.y - kid.s * 1.02, life: 1, age: 0, s: kid.s * .12 });
      later(.3, sayTry);
      if (Q.errs >= 2) glowNeeded();
    }
  }
  function glowNeeded() {
    const need = DRESS[Q.wx].need.filter(i => !kid.worn.has(i));
    const cd = cards.find(c => c.id === need[0] && !c.hide); if (cd) cd.glow = 4;
  }
  function roundDone() {
    kid.jump = 1; kid.jv = 220; kid.wave = 1.6; Sound.win();
    for (let i = 0; i < 16; i++) parts.push(confP(kid.x, kid.y - kid.s * .6));
    sayGood();
    Q.round++;
    if (Q.round >= def.w.length) { later(1.6, win); return; }
    later(2.2, () => {
      // خلع الملابس وإعادتها إلى الصندوق
      kid.worn.forEach(id => { const cd = cards.find(c => c.id === id); if (cd) { cd.hide = false; cd.x = kid.x; cd.y = kid.y - kid.s * .5; cd.sc = .3; cd.st = 'back'; cd.t = 0; cd.fx = cd.x; cd.fy = cd.y; } });
      kid.worn = new Set(); Sound.whoosh();
      Q.wx = def.w[Q.round]; Q.errs = 0;
      scene.set(DRESS[Q.wx].s, Q.wx);
      later(1.1, askCurrent);
    });
  }

  /* ----- وضع «أيّ فصل هذا؟» ----- */
  function nextSeasonQ() {
    if (Q.q >= def.q) { win(); return; }
    let pool = SEA_ORDER.filter(s => s !== Q.last);
    if (Q.q === 0) pool = pool.filter(s => s !== scene.se);
    const target = pick(pool); Q.target = target; Q.last = target; Q.answered = false; Q.tries = 0;
    cards.forEach(cd => { cd.ok = false; cd.glow = 0; });
    scene.set(target, pick(SEASON_WX[target]));
    later(1.1, askCurrent);
  }
  function answerSeason(cd) {
    if (Q.answered) return;
    if (cd.id === Q.target) {
      Q.answered = true; Q.q++; done++; bumpProg(); hideHint();
      cd.ok = true; cd.pop = 1; Sound.star(); vibrate(20); sparkle(cd.x, cd.y, SEAS[cd.id].c);
      say(SEAS[cd.id].ar, SEAS[cd.id].en);
      later(2.2, nextSeasonQ);
    } else {
      mistakes++; Q.tries++; cd.shake = 1; shake = 3; Sound.error(); vibrate(30);
      say(SEAS[cd.id].ar, SEAS[cd.id].en); later(.9, sayTry);
      if (Q.tries >= 2) { const r = cards.find(c => c.id === Q.target); if (r) r.glow = 4; }
    }
  }

  /* ----- وضع الأنشطة ----- */
  function miniAt(x, y) { return minis.find(m => x >= m.x && x <= m.x + m.w && y >= m.y && y <= m.y + m.h); }
  function dropAct(cd) {
    const m = miniAt(cd.x, cd.y);
    if (!m) { sendBack(cd); Sound.slide(); return; }
    if (ACTS[cd.id].s === m.id) {
      cd.done = true; m.placed.push(cd); m.pop = 1;
      const p = placeInFrame(m, cd, m.placed.length - 1, false);
      flyTo(cd, p.x, p.y, p.sc, () => { cd.st = 'placed'; });
      cd.noLabel = true;
      Sound.pop(); Sound.star(); vibrate(20); sparkle(p.x, p.y, SEAS[m.id].c);
      done++; bumpProg(); hideHint();
      say(SEAS[m.id].in + ' ' + ACTS[cd.id].ar, 'In ' + SEAS[m.id].en.toLowerCase() + ', we ' + ACTS[cd.id].en.toLowerCase());
      later(.45, () => { const rest = cards.filter(c => !c.done); layoutActsTray(); rest.forEach(c => { if (c.st === 'tray') { c.st = 'back'; c.t = 0; c.fx = c.x; c.fy = c.y; } }); });
      if (cards.every(c => c.done)) later(2.2, win);
    } else {
      mistakes++; m.shake = 1; cd.shake = 1; shake = 3; sendBack(cd); Sound.error(); vibrate(30);
      later(.3, sayTry);
      cd.errs = (cd.errs || 0) + 1;
      if (cd.errs >= 2) { const r = minis.find(q => q.id === ACTS[cd.id].s); if (r) r.glow = 4; }
    }
  }
  function layoutActsTray() {
    const keep = minis.map(m => ({ x: m.x, y: m.y, w: m.w, h: m.h }));
    layoutActs();
    minis.forEach((m, i) => Object.assign(m, keep[i]));
  }

  /* ----- وضع النشرة الجوية ----- */
  function nextReportQ() {
    if (Q.q >= def.q) { win(); return; }
    let pool = def.pool.filter(w => !Q.used.includes(w)); if (!pool.length) pool = def.pool.filter(w => w !== Q.wx);
    const wx = pick(pool); Q.used.push(wx);
    const [se, tp] = pick(WX_SCENE[wx]);
    Q.wx = wx; Q.temp = tp; Q.filled = 0; Q.tries = 0;
    scene.set(se, wx);
    const others = shuffle(WX_ORDER.filter(w => w !== wx)).slice(0, portrait ? 3 : 4);
    cards = shuffle([wx, ...others]).map((id, i) => mkCard('wx', id, { intro: -i * .06 - .3 }));
    if (def.temp) cards.push(...['hot', 'mild', 'cold'].map((id, i) => mkCard('temp', id, { intro: -.6 - i * .06 })));
    slots = [{ kind: 'wx', want: wx, card: null }];
    if (def.temp) slots.push({ kind: 'temp', want: tp, card: null });
    layout();
    later(1.2, askCurrent);
  }
  function slotAt(x, y) { return slots.find(s => Math.abs(x - s.x) < s.w * .7 && Math.abs(y - s.y) < s.h * .7); }
  function dropToken(cd, tapped) {
    let sl = tapped ? slots.find(s => s.kind === cd.kind && !s.card) : slotAt(cd.x, cd.y);
    if (!sl) { sendBack(cd); Sound.slide(); return; }
    if (sl.card || sl.kind !== cd.kind || sl.want !== cd.id) {
      mistakes++; Q.tries++; cd.shake = 1; shake = 3; sendBack(cd); Sound.error(); vibrate(30);
      say(cd.kind === 'wx' ? WX[cd.id].ar : TEMP[cd.id].ar, cd.kind === 'wx' ? WX[cd.id].en : TEMP[cd.id].en); later(.9, sayTry);
      if (Q.tries >= 2) { const r = cards.find(c => c.kind === sl.kind && c.id === sl.want); if (r) r.glow = 4; }
      return;
    }
    sl.card = cd; cd.done = true;
    flyTo(cd, sl.x, sl.y, (sl.w * .92) / cd.w, () => { cd.st = 'placed'; });
    Sound.pop(); vibrate(15); sparkle(sl.x, sl.y, cd.kind === 'wx' ? WX[cd.id].c : TEMP[cd.id].c);
    Q.filled++;
    if (Q.filled >= slots.length) {
      Q.q++; done++; bumpProg(); hideHint(); kid.wave = 1.6; kid.jump = 1; kid.jv = 160;
      Sound.star();
      const ar = 'اليوم ' + WX[Q.wx].sen + (def.temp ? ' ' + TEMP[Q.temp].and : ''), en = 'Today ' + WX[Q.wx].sen_en.charAt(0).toLowerCase() + WX[Q.wx].sen_en.slice(1) + (def.temp ? ' and ' + TEMP[Q.temp].en : '');
      later(.3, () => say(ar, en));
      later(3.2, () => { cards.forEach(c => { if (!c.done) c.hide = true; }); nextReportQ(); });
    } else say(cd.kind === 'wx' ? WX[cd.id].ar : TEMP[cd.id].ar, cd.kind === 'wx' ? WX[cd.id].en : TEMP[cd.id].en);
  }

  /* ----- الوضع الحرّ ----- */
  function playTap(cd) {
    cd.pop = 1; Sound.tap(); vibrate(10);
    if (cd.kind === 'sea') {
      const wx = scene.wx === 'snowy' && cd.id !== 'winter' ? SEASON_WX[cd.id][0] : (cd.id === 'winter' && scene.wx !== 'snowy' && Math.random() < .5 ? 'snowy' : scene.wx);
      scene.set(cd.id, wx); dressFor(cd.id, wx);
      say(SEAS[cd.id].ar, SEAS[cd.id].en);
    } else {
      let se = scene.se;
      if (cd.id === 'snowy') se = 'winter'; else if (cd.id === 'haboob') se = 'summer'; else if (se === 'winter' && cd.id === 'sunny' && false) se = 'spring';
      scene.set(se, cd.id); dressFor(se, cd.id);
      sayWx(cd.id);
    }
    sparkle(cd.x, cd.y, cardColor(cd));
    store.set('seasonsPlayed', (store.get('seasonsPlayed', 0) || 0) + 1);
    const seen = new Set(store.get('seasonsSeen', [])); seen.add(scene.se + '|' + scene.wx); store.set('seasonsSeen', [...seen]);
    if (seen.size >= 10) App.achieve('seasons_play');
  }

  /* ---------- الفوز ---------- */
  function win() {
    if (over) return;
    over = true;
    const pr = loadProg();
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('seasonsProg', pr);
    for (let i = 0; i < 130; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 240), rot: rand(0, TAU), vr: rand(-8, 8), life: rand(2.5, 4), age: 0, s: rand(6, 11), c: ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9'][i % 6] });
    Sound.win();
    later(1.3, () => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنتَ!') + ' 🎉';
      root.querySelector('.wic').textContent = { dress: '👕🧥☂️', season: '☀️🍂❄️🌸', acts: '🏊⛄🌷', report: '📺☀️🌧️' }[mode];
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      const msg = { dress: App.g('ألبستِ', 'ألبستَ') + App.g(' الطفلة', ' الطفل') + ' ملابس مناسبة للطقس', season: App.g('عرفتِ', 'عرفتَ') + ' كل الفصول', acts: App.g('رتّبتِ', 'رتّبتَ') + ' أنشطة الفصول', report: App.g('قدّمتِ', 'قدّمتَ') + ' النشرة الجوية' }[mode];
      root.querySelector('.wP').textContent = msg + (mistakes ? '' : ' دون أخطاء! 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < LEVELS.length ? '' : 'none';
      winOv.classList.add('on');
      if (window.gsap) try { gsap.fromTo(root.querySelector('#seWin .wic'), { scale: .3, rotation: -20 }, { scale: 1, rotation: 0, duration: .8, ease: 'elastic.out(1,0.45)' }); } catch (e) {}
      sayGood();
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('seasons_first');
      if (mode === 'dress' && def.w.includes('haboob')) App.achieve('seasons_haboob');
      if (mode === 'report' && !mistakes) App.achieve('seasons_reporter');
      if (LEVELS.every((_, i) => pr.stars[i + 1])) App.achieve('seasons_all');
    });
  }
  function openLevels() {
    const pr = loadProg(), g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((Lv, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lvb m-${Lv.m}${lock ? ' lock' : ''}${n === lvl && mode !== 'play' ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}"><span class="n">${num(n)}</span>
        <span class="e">${MODE_IC[Lv.m]}</span>
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
    else if (a === 'play') startPlay();
    else if (a === 'close') { lvOv.classList.remove('on'); if (over) winOv.classList.add('on'); }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });
  root.querySelector('.playbtn').addEventListener('click', () => { Sound.tap(); if (mode === 'play') { startLevel(Math.min(loadProg().unlocked, LEVELS.length)); } else startPlay(); });
  sayBtn.addEventListener('click', () => { if (paused) return; Sound.tap(); askCurrent(); });
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'ar'; store.set('seasonsLang', lang);
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
  const confP = (x, y) => { const a = -Math.PI / 2 + rand(-1.2, 1.2), v = rand(150, 320); return { t: 'conf', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, rot: rand(0, TAU), vr: rand(-8, 8), life: rand(1.2, 2), age: 0, s: rand(6, 10), c: pick(['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9']) }; };

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  const blocked = () => App.current !== ID || paused || winOv.classList.contains('on') || lvOv.classList.contains('on') || over;
  const draggable = cd => cd.st === 'tray' || cd.st === 'back';
  cv.addEventListener('pointerdown', e => {
    if (blocked() || drag) return;
    const p = pos(e); idleT = 0;
    if (mode === 'play') { const cd = palette.find(c => cardHit(c, p.x, p.y, 4)); if (cd) playTap(cd); else if (kid && hitKid(p)) kidTap(); return; }
    if (mode === 'season') { const cd = cards.find(c => cardHit(c, p.x, p.y, 4)); if (cd) answerSeason(cd); return; }
    const cd = [...cards].reverse().find(c => !c.done && draggable(c) && cardHit(c, p.x, p.y, 4));
    if (cd) {
      try { cv.setPointerCapture(e.pointerId); } catch (er) {}
      drag = { id: e.pointerId, cd, ox: cd.x - p.x, oy: cd.y - p.y, sx: p.x, sy: p.y, moved: false, t0: performance.now(), lx: p.x, vx: 0, touch: e.pointerType !== 'mouse' };
      cd.st = 'drag'; cd.tx = cd.x; cd.ty = cd.y; cd.rot = 0;
      cards.splice(cards.indexOf(cd), 1); cards.push(cd);
      Sound.tone(600, .08, 'sine', .1, 300); vibrate(10);
      return;
    }
    if (kid && mode === 'dress' && hitKid(p)) kidTap();
  });
  function hitKid(p) { return Math.abs(p.x - kid.x) < kid.s * .3 && p.y < kid.y && p.y > kid.y - kid.s; }
  function kidTap() { kid.jump = 1; kid.jv = 150; kid.wave = 1.2; Sound.tone(700, .1, 'sine', .1, 400); askCurrent(); }
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const p = pos(e);
    if (!drag.moved && Math.hypot(p.x - drag.sx, p.y - drag.sy) > 8) { drag.moved = true; speakCard(drag.cd); }
    drag.cd.tx = p.x + drag.ox; drag.cd.ty = p.y + drag.oy - (drag.touch && drag.moved ? 26 : 0);
    drag.vx = drag.vx * .6 + (p.x - drag.lx) * .4; drag.lx = p.x;
  });
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag, cd = d.cd; drag = null;
    if (!d.moved && performance.now() - d.t0 < 350) {
      cd.pop = 1; speakCard(cd);
      if (mode === 'report') { cd.x = cd.tx; cd.y = cd.ty; dropToken(cd, true); return; }
      sendBack(cd); return;
    }
    if (mode === 'dress') {
      const z = dropZone;
      if (z && cd.x > z.x - 20 && cd.x < z.x + z.w + 20 && cd.y > z.y - 20 && cd.y < z.y + z.h + 10) tryWear(cd);
      else { sendBack(cd); Sound.slide(); }
    } else if (mode === 'acts') dropAct(cd);
    else if (mode === 'report') dropToken(cd, false);
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', e => { if (drag && e.pointerId === drag.id) { const cd = drag.cd; drag = null; sendBack(cd); } });
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act(lvl < LEVELS.length ? 'next' : 'levels'); return; }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? lvOv.classList.remove('on') : openLevels(); return; }
    if (blocked()) return;
    if (e.key === 'r' || e.key === 'R') { askCurrent(); return; }
    const k = parseInt(e.key, 10); if (!(k >= 1)) return;
    const list = (mode === 'play' ? palette : cards).filter(c => !c.done && !c.hide);
    const cd = list[k - 1]; if (!cd) return;
    if (mode === 'play') playTap(cd);
    else if (mode === 'season') answerSeason(cd);
    else if (mode === 'dress') { cd.x = kid.x; cd.y = kid.y - kid.s * .5; tryWear(cd); }
    else if (mode === 'report') dropToken(cd, true);
    else if (mode === 'acts') { const m = minis.find(q => q.id === ACTS[cd.id].s) || minis[0]; cd.x = m.x + m.w / 2; cd.y = m.y + m.h / 2; dropAct(cd); }
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    for (let i = tasks.length - 1; i >= 0; i--) { const t = tasks[i]; t.t -= dt; if (t.t <= 0) { tasks.splice(i, 1); t.fn(); } }
    scene.update(dt);
    minis.forEach(m => { m.sc.update(dt); m.glow = Math.max(0, m.glow - dt); m.shake = Math.max(0, m.shake - dt * 2.2); m.pop = Math.max(0, m.pop - dt * 2.4); });
    kidUpdate(dt);
    const k = 1 - Math.exp(-dt * 24);
    for (const cd of cards) {
      cd.intro = Math.min(1, cd.intro + dt / .4);
      cd.pop = Math.max(0, cd.pop - dt * 2.4); cd.shake = Math.max(0, cd.shake - dt * 2.4); cd.glow = Math.max(0, cd.glow - dt);
      if (cd.st === 'drag') { cd.x += (cd.tx - cd.x) * k; cd.y += (cd.ty - cd.y) * k; cd.rot += (clamp((drag ? drag.vx : 0) * .02, -.25, .25) - cd.rot) * k * .5; }
      else if (cd.st === 'back') {
        cd.t += dt / .38; const t = Math.min(1, cd.t), e = ease.outBack(t);
        cd.x = lerp(cd.fx, cd.hx, e); cd.y = lerp(cd.fy, cd.hy, e); cd.sc += (1 - cd.sc) * k;
        if (t >= 1) { cd.st = 'tray'; cd.sc = 1; }
      } else if (cd.st === 'fly') {
        cd.t += dt / .32; const t = Math.min(1, cd.t), e = ease.outCubic(t);
        cd.x = lerp(cd.fx, cd.tx, e); cd.y = lerp(cd.fy, cd.ty, e) - Math.sin(t * Math.PI) * 30; cd.sc = lerp(cd.fsc, cd.tsc, e);
        if (t >= 1) { cd.st = 'done'; cd.pop = 1; const cb = cd.cb; cd.cb = null; if (cb) cb(); }
      } else if (cd.st === 'placed' && mode === 'acts') {
        const m = minis.find(q => q.placed.includes(cd));
        if (m && cd.tx) { cd.x += (cd.tx - cd.x) * k * .5; cd.y += (cd.ty - cd.y) * k * .5; }
      }
    }
    if (mode === 'dress' && !over && Q && !drag) { idleT += dt; if (idleT > 10) { idleT = 0; glowNeeded(); askCurrent(); } }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.t === 'conf') { q.vy = Math.min(q.vy + 260 * dt, 260); q.vx *= 1 - dt; q.vx += Math.sin(T * 3 + i) * 40 * dt; q.rot += q.vr * dt; }
      else if (q.t === 'sweat' || q.t === 'drip') { q.vy += 300 * dt; }
      else if (q.t === 'no') { }
      else { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 300 * dt; q.rot += q.vr * dt; }
      if (q.vx != null) { q.x += q.vx * dt; q.y += q.vy * dt; }
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    shake = Math.max(0, shake - dt * 16);
  }

  /* ---------- الرسم ---------- */
  function label(text, x, y, col, size) {
    ctx.save();
    ctx.font = `900 ${size}px ${FONT}`; ctx.direction = lang === 'ar' ? 'rtl' : 'ltr';
    const w = ctx.measureText(text).width + size * 1.4, h = size * 1.6;
    ctx.fillStyle = 'rgba(0,0,0,.14)'; rr(ctx, x - w / 2, y - h / 2 + 3, w, h, h / 2); ctx.fill();
    ctx.fillStyle = '#fff'; rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x, y + size * .05);
    ctx.restore();
    return w;
  }
  function shelf(y) {
    const g = ctx.createLinearGradient(0, y, 0, H); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,.75)');
    ctx.fillStyle = g; rr(ctx, 6, y, W - 12, H - y + 30, 26); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 3; ctx.stroke();
  }
  function drawWeatherBadge() {
    // شارة الطقس الحالي (أعلى المشهد)
    if (mode !== 'dress' || !Q) return;
    const s = clamp(W * .15, 50, 74), x = s * .75 + 10, y = Math.max(topY + s * .55, sayBtn.getBoundingClientRect().bottom + s * .75);
    ctx.save(); ctx.translate(x, y + Math.sin(T * 2) * 3);
    ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.shadowColor = 'rgba(0,0,0,.18)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
    ctx.beginPath(); ctx.arc(0, 0, s * .62, 0, TAU); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.strokeStyle = WX[Q.wx].c; ctx.lineWidth = 4; ctx.stroke();
    ctx.restore();
    sticker(ctx, 'wx:' + Q.wx, vecDraw(WXI[Q.wx]), x, y + Math.sin(T * 2) * 3, s * .8);
    label(L(WX[Q.wx]), x, y + s * .78, shade(WX[Q.wx].c, -.25), clamp(s * .22, 12, 16));
  }
  function drawMini(m) {
    const sx = m.shake > 0 ? Math.sin(m.shake * 40) * 7 * m.shake : 0, sq = Math.sin((1 - m.pop) * Math.PI * 3) * m.pop * .04;
    const col = SEAS[m.id].c, b = 6, r = 22;
    ctx.save(); ctx.translate(m.x + m.w / 2 + sx, m.y + m.h / 2); ctx.scale(1 + sq, 1 - sq); ctx.translate(-m.w / 2, -m.h / 2);
    if (m.glow > 0) { ctx.save(); ctx.globalAlpha = .5 + .5 * Math.sin(T * 9); ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 24; ctx.fillStyle = '#FFE066'; rr(ctx, -8, -8, m.w + 16, m.h + 16, r + 6); ctx.fill(); ctx.restore(); }
    ctx.save(); ctx.shadowColor = 'rgba(20,30,60,.3)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 6; ctx.fillStyle = shade(col, -.3); rr(ctx, -b, -b + 6, m.w + b * 2, m.h + b * 2, r); ctx.fill(); ctx.restore();
    ctx.fillStyle = col; rr(ctx, -b, -b, m.w + b * 2, m.h + b * 2, r); ctx.fill();
    ctx.fillStyle = '#fff'; rr(ctx, -b + 3, -b + 3, m.w + b * 2 - 6, m.h + b * 2 - 6, r - 2); ctx.fill();
    ctx.save(); rr(ctx, 0, 0, m.w, m.h, r - 5); ctx.clip(); m.sc.draw(ctx, 0, 0); ctx.restore();
    // اسم الفصل
    const ls = clamp(m.w * .11, 13, 19);
    ctx.save(); ctx.font = `900 ${ls}px ${FONT}`; ctx.direction = lang === 'ar' ? 'rtl' : 'ltr';
    const tw = ctx.measureText(L(SEAS[m.id])).width + ls * 2.8, th = ls * 1.7;
    const lx = m.w / 2 - tw / 2, ly = -th * .35;
    ctx.fillStyle = shade(col, -.25); rr(ctx, lx, ly + 3, tw, th, th / 2); ctx.fill();
    ctx.fillStyle = col; rr(ctx, lx, ly, tw, th, th / 2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(L(SEAS[m.id]), m.w / 2 + (lang === 'ar' ? -ls * .55 : ls * .55), ly + th / 2 + 1);
    ctx.restore();
    sticker(ctx, 'se:' + m.id, vecDraw(SEI[m.id]), m.w / 2 + (lang === 'ar' ? 1 : -1) * (tw / 2 - ls * .85), ly + th / 2, ls * 1.5);
    ctx.restore();
  }
  function drawBoard() {
    if (!board) return;
    const { x, y, w, h } = board;
    // شاشة النشرة: لوح أبيض سميك بحافة بنفسجية
    ctx.save(); ctx.shadowColor = 'rgba(20,20,60,.3)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#5F3DC4'; rr(ctx, x, y + 8, w, h, 26); ctx.fill(); ctx.restore();
    ctx.fillStyle = '#7950F2'; rr(ctx, x, y, w, h, 26); ctx.fill();
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#F3F0FF');
    ctx.fillStyle = g; rr(ctx, x + 6, y + 6, w - 12, h - 12, 21); ctx.fill();
    // عنوان
    const ts = clamp(h * .12, 14, 21);
    const tx0 = portrait ? x + w * .4 : x + w * .18, tw = portrait ? w * .56 : w * .64;
    ctx.fillStyle = '#7950F2'; rr(ctx, tx0, y - ts * .7, tw, ts * 1.7, ts * .85); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke();
    textFit(ctx, (lang === 'ar' ? 'النشرة الجوية' : 'Weather Report') + ' 📺', tx0 + tw / 2, y + ts * .16, tw * .9, ts, '#fff');
    // على الهواء
    ctx.fillStyle = Math.sin(T * 4) > 0 ? '#FA5252' : '#FFA8A8'; ctx.beginPath(); ctx.arc(x + w - 24, y + 26, 7, 0, TAU); ctx.fill();
    // الخانات
    for (const sl of slots) {
      const filled = !!sl.card, hov = drag && !filled && slotAt(drag.cd.x, drag.cd.y) === sl;
      ctx.save(); ctx.setLineDash(filled ? [] : [8, 7]); ctx.lineWidth = 4;
      ctx.strokeStyle = hov ? '#FAB005' : '#B197FC'; ctx.fillStyle = hov ? 'rgba(255,224,102,.35)' : 'rgba(177,151,252,.12)';
      rr(ctx, sl.x - sl.w / 2, sl.y - sl.h / 2, sl.w, sl.h, sl.w * .22); ctx.fill(); if (!filled) ctx.stroke(); ctx.restore();
      if (!filled) {
        ctx.globalAlpha = .35 + .15 * Math.sin(T * 3);
        textFit(ctx, sl.kind === 'wx' ? '?' : '🌡️', sl.x, sl.y, sl.w, sl.w * .45, '#7950F2'); ctx.globalAlpha = 1;
      }
      textFit(ctx, sl.kind === 'wx' ? (lang === 'ar' ? 'الطقس' : 'Weather') : (lang === 'ar' ? 'الحرارة' : 'Temperature'), sl.x, sl.y - sl.h / 2 - 10, sl.w + 30, clamp(sl.w * .16, 11, 15), '#5F3DC4');
    }
  }
  function render() {
    ctx.save();
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    if (mode === 'acts') {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#9BD7FF'); g.addColorStop(1, '#E7F6FF');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,255,255,.35)'; for (let i = 0; i < 14; i++) { ctx.beginPath(); ctx.arc((i * 137) % W, (i * 89 + 40) % H, 10 + (i % 4) * 8, 0, TAU); ctx.fill(); }
      minis.forEach(drawMini);
    } else scene.draw(ctx);
    if (mode !== 'report' && mode !== 'acts' && trayRect.y) shelf(trayRect.y);
    if (mode === 'acts') shelf(trayRect.y);
    if (mode === 'report') { shelf(trayRect.y); drawBoard(); }
    if (kid) {
      if (dropZone && drag && mode === 'dress') {
        const z = dropZone, over_ = drag.cd.x > z.x - 20 && drag.cd.x < z.x + z.w + 20 && drag.cd.y > z.y - 20 && drag.cd.y < z.y + z.h + 10;
        ctx.save(); ctx.globalAlpha = over_ ? .9 : .45; ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.setLineDash([10, 8]);
        ctx.beginPath(); ctx.ellipse(kid.x, kid.y - kid.s * .5, kid.s * .4, kid.s * .58, 0, 0, TAU); ctx.stroke(); ctx.restore();
      }
      drawKid(ctx, kid.x, kid.y, kid.s, kid);
    }
    drawWeatherBadge();
    // البطاقات (الموضوعة أولًا ثم الصندوق ثم المسحوبة)
    const order = cards.slice().sort((a, b) => (a.st === 'drag') - (b.st === 'drag') || (a.st === 'fly') - (b.st === 'fly'));
    for (const cd of order) drawCard(cd);
    if (mode === 'season' && Q && !Q.answered) {
      // سؤال فوق البطاقات
      const qs = clamp(W * .045, 15, 22);
      label(lang === 'ar' ? 'أيّ فصل هذا؟' : 'Which season is it?', W / 2, trayRect.y - qs * 1.2, '#1C7ED6', qs);
    }
    // الجسيمات
    for (const r of rings) { const t = r.age / r.life; ctx.strokeStyle = `rgba(255,255,255,${(1 - t) * .9})`; ctx.lineWidth = 4 * (1 - t) + 1; ctx.beginPath(); ctx.arc(r.x, r.y, 10 + t * 60, 0, TAU); ctx.stroke(); }
    for (const q of parts) {
      const t = q.age / q.life;
      ctx.save(); ctx.translate(q.x, q.y);
      if (q.t === 'conf') { ctx.rotate(q.rot); ctx.globalAlpha = Math.min(1, (q.life - q.age) * 2); ctx.fillStyle = q.c; ctx.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); }
      else if (q.t === 'sweat' || q.t === 'drip') { ctx.globalAlpha = 1 - t; drop(ctx, 0, 0, q.s * 1.6, q.t === 'sweat' ? '#74C0FC' : '#A5D8FF'); }
      else if (q.t === 'no') { ctx.globalAlpha = t > .7 ? (1 - t) / .3 : 1; const s = q.s * (1 + .2 * Math.sin(Math.min(1, t * 3) * Math.PI)); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, s * .8, 0, TAU); ctx.fill(); ctx.strokeStyle = '#FA5252'; ctx.lineWidth = s * .2; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-s * .35, -s * .35); ctx.lineTo(s * .35, s * .35); ctx.moveTo(s * .35, -s * .35); ctx.lineTo(-s * .35, s * .35); ctx.stroke(); }
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
    // أربعة فصول في دائرة واحدة
    const q = [['#7FD3FF', '#BFEFFF'], ['#FFC078', '#FFE8CC'], ['#A5C8EE', '#EEF5FF'], ['#9BE57D', '#E6FCD8']];
    const ang = [[-Math.PI, -Math.PI / 2], [-Math.PI / 2, 0], [0, Math.PI / 2], [Math.PI / 2, Math.PI]];
    q.forEach((cl, i) => {
      const g = c.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s * .75); g.addColorStop(0, cl[1]); g.addColorStop(1, cl[0]);
      c.fillStyle = g; c.beginPath(); c.moveTo(s / 2, s / 2); c.arc(s / 2, s / 2, s, ang[i][0], ang[i][1]); c.closePath(); c.fill();
    });
    c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = s * .025; c.beginPath(); c.moveTo(0, s / 2); c.lineTo(s, s / 2); c.moveTo(s / 2, 0); c.lineTo(s / 2, s); c.stroke();
    c.save(); c.shadowColor = 'rgba(0,0,0,.2)'; c.shadowBlur = 6; c.shadowOffsetY = 3;
    c.save(); c.translate(s * .27, s * .27); sunIcon(c, s * .4); c.restore();
    c.save(); c.translate(s * .73, s * .27); SEI.autumn(c, s * .42); c.restore();
    c.save(); c.translate(s * .73, s * .73); flake(c, 0, 0, s * .15, '#1C7ED6', s * .03); c.restore();
    c.save(); c.translate(s * .27, s * .73); SEI.spring(c, s * .38); c.restore();
    c.restore();
    c.save(); c.translate(s * .5, s * .52); cloudIcon(c, 0, 0, s * .42); c.restore();
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'الفصول والطقس', icon2: '⛅', isNew: true, music: 'shapes',
    desc: () => App.g('تعرّفي على الفصول وألبسي الطفل حسب الطقس', 'تعرّف على الفصول وألبِس الطفل حسب الطقس'),
    help: () => [
      '☀️🍂❄️🌸 الصيف والخريف والشتاء والربيع… ' + App.g('شاهدي', 'شاهد') + ' كيف يتغيّر المشهد',
      '👕 ' + App.g('اسحبي', 'اسحب') + ' الملابس المناسبة للطقس إلى الطفل',
      '🎒 ' + App.g('ضعي', 'ضع') + ' كل نشاط في فصله، و' + App.g('اعرفي', 'اعرف') + ' أيّ فصل في الصورة',
      '📺 ' + App.g('كوني', 'كن') + ' مذيع' + App.g('ة', '') + ' النشرة الجوية، و🎨 ' + App.g('العبي', 'العب') + ' بالطقس كما ' + App.g('تحبين', 'تحب'),
      '🌍 ' + App.g('بدّلي', 'بدّل') + ' بين «عربي» و«English»'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 ${ks.length}/${LEVELS.length} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      setLang(store.get('seasonsLang', 'ar'));
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
        lvl, mode, done, total, mistakes, over, lang, W, H,
        q: Q && { wx: Q.wx, target: Q.target, temp: Q.temp, round: Q.round },
        kid: kid && { x: kid.x, y: kid.y, s: kid.s, worn: [...kid.worn] },
        need: mode === 'dress' && Q ? DRESS[Q.wx].need : null,
        cards: cards.map(c => ({ kind: c.kind, id: c.id, x: c.x, y: c.y, st: c.st, done: c.done, hide: c.hide, s: c.kind === 'act' ? ACTS[c.id].s : null })),
        minis: minis.map(m => ({ id: m.id, x: m.x + m.w / 2, y: m.y + m.h / 2 })),
        slots: slots.map(s => ({ kind: s.kind, want: s.want, x: s.x, y: s.y }))
      };
    }
  });
})();
