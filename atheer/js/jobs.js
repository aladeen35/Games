/* =====================================================================
   المهن — شخصيات لطيفة لعشرين مهنة
   أنشطة: تعرّف على المهن، لمن هذه الأداة؟، أين يعمل؟، من أنا؟ (ألغاز)،
   ألبس العامل (القبعة ثم الزي)
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'jobs';
  const TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,"Segoe UI",Tahoma,sans-serif';
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  /* ---------- الأماكن ---------- */
  const PLACES = {
    hospital:  { ar: 'المستشفى', en: 'hospital', enp: 'at the hospital', e: '🏥', c: '#5BC0EB' },
    school:    { ar: 'المدرسة', en: 'school', enp: 'at the school', e: '🏫', c: '#FFB347' },
    police:    { ar: 'مركز الشرطة', en: 'police station', enp: 'at the police station', e: '🚨', c: '#5C7CFA' },
    fire:      { ar: 'مركز الإطفاء', en: 'fire station', enp: 'at the fire station', e: '🚒', c: '#FF6B6B' },
    airport:   { ar: 'المطار', en: 'airport', enp: 'at the airport', e: '🛫', c: '#74C0FC' },
    farm:      { ar: 'المزرعة', en: 'farm', enp: 'on the farm', e: '🌾', c: '#8CD867' },
    restaurant:{ ar: 'المطعم', en: 'restaurant', enp: 'at the restaurant', e: '🍽️', c: '#FF9F68' },
    factory:   { ar: 'المصنع', en: 'factory', enp: 'at the factory', e: '🏭', c: '#A5B4C8' },
    dental:    { ar: 'عيادة الأسنان', en: 'dental clinic', enp: 'at the dental clinic', e: '🦷', c: '#63E6BE' },
    garage:    { ar: 'ورشة السيارات', en: 'garage', enp: 'at the garage', e: '🚗', c: '#94A3B8' },
    bakery:    { ar: 'المخبز', en: 'bakery', enp: 'at the bakery', e: '🥐', c: '#F4C27A' },
    sea:       { ar: 'البحر', en: 'sea', enp: 'at sea', e: '🌊', c: '#4DABF7' },
    space:     { ar: 'الفضاء', en: 'space', enp: 'in space', e: '🪐', c: '#7950F2' },
    vetclinic: { ar: 'عيادة الحيوانات', en: 'animal clinic', enp: 'at the animal clinic', e: '🐾', c: '#69DB7C' },
    desert:    { ar: 'الصحراء', en: 'desert', enp: 'in the desert', e: '🏜️', c: '#F2B263' },
    site:      { ar: 'موقع البناء', en: 'building site', enp: 'at the building site', e: '🏗️', c: '#FFA94D' },
    tailorshop:{ ar: 'محل الخياطة', en: 'tailor shop', enp: 'at the tailor shop', e: '🧵', c: '#F783AC' },
    barbershop:{ ar: 'صالون الحلاقة', en: 'barber shop', enp: 'at the barber shop', e: '💈', c: '#E599F7' },
    pharmacy:  { ar: 'الصيدلية', en: 'pharmacy', enp: 'at the pharmacy', e: '🏪', c: '#38D9A9' }
  };
  for (const k in PLACES) PLACES[k].id = k;

  /* ---------- المهن ----------
     f: أنثى، skin: لون البشرة، hair: short|curly|hijab|bald، hc: لون الشعر/الحجاب
     hat: نوع القبعة، u: الزي { s: القميص، p: البنطال، coat/apron/vest/stripes/tie/badge/overall/thobe/suit }
     tool: الأداة (رمز + اسم) */
  const SKINS = ['#F3CBA5', '#E2AE84', '#C98D62', '#9C6644'];
  const JOBS = {
    doctor:     { ar: 'الطبيب', en: 'doctor', f: 0, skin: 1, hair: 'short', hc: '#2B1B12', hat: 'none', u: { s: '#4DB6AC', p: '#37474F', coat: 1, steth: 1 }, tool: { e: '🩺', ar: 'السماعة', en: 'stethoscope' }, place: 'hospital',
      rid: ['أعالج المرضى وأفحصهم بالسماعة', 'I check sick people with my stethoscope'] },
    nurse:      { ar: 'الممرضة', en: 'nurse', f: 1, skin: 0, hair: 'hijab', hc: '#F48FB1', hat: 'nurse', u: { s: '#90CAF9', p: '#90CAF9' }, tool: { e: '💉', ar: 'الحقنة', en: 'syringe' }, place: 'hospital',
      rid: ['أساعد الطبيب وأعتني بالمرضى', 'I help the doctor and care for patients'] },
    teacher:    { ar: 'المعلمة', en: 'teacher', f: 1, skin: 2, hair: 'hijab', hc: '#9575CD', hat: 'none', glasses: 1, u: { s: '#FFB74D', p: '#5D4037', cardigan: '#7E57C2' }, tool: { e: '📚', ar: 'الكتب', en: 'books' }, place: 'school',
      rid: ['أعلم الأطفال القراءة والكتابة', 'I teach children to read and write'] },
    police:     { ar: 'الشرطي', en: 'police officer', f: 0, skin: 2, hair: 'short', hc: '#1A1A1A', hat: 'cap', hatc: '#1E3A8A', must: 1, u: { s: '#2E4C9E', p: '#1E3A8A', badge: 1, tie: '#0F1F4F' }, tool: { e: '🚓', ar: 'سيارة الشرطة', en: 'police car' }, place: 'police',
      rid: ['أحافظ على الأمن وأنظم المرور', 'I keep everyone safe and direct traffic'] },
    firefighter:{ ar: 'رجل الإطفاء', en: 'firefighter', f: 0, skin: 1, hair: 'short', hc: '#4E342E', hat: 'fire', u: { s: '#D84315', p: '#3E2723', stripes: 1 }, tool: { e: '🧯', ar: 'طفاية الحريق', en: 'fire extinguisher' }, place: 'fire',
      rid: ['أطفئ الحرائق بالماء', 'I put out fires with water'] },
    pilot:      { ar: 'الطيار', en: 'pilot', f: 0, skin: 0, hair: 'short', hc: '#5D4037', hat: 'cap', hatc: '#102A5C', wings: 1, u: { s: '#FFFFFF', p: '#102A5C', tie: '#102A5C', epaulet: 1 }, tool: { e: '✈️', ar: 'الطائرة', en: 'airplane' }, place: 'airport',
      rid: ['أقود الطائرة في السماء', 'I fly the airplane in the sky'] },
    farmer:     { ar: 'المزارع', en: 'farmer', f: 0, skin: 2, hair: 'short', hc: '#3E2723', hat: 'straw', u: { s: '#E57373', p: '#1976D2', overall: '#1976D2', plaid: 1 }, tool: { e: '🚜', ar: 'الجرار', en: 'tractor' }, place: 'farm',
      rid: ['أزرع الخضار وأسقي النباتات', 'I grow vegetables and water the plants'] },
    chef:       { ar: 'الطاهي', en: 'chef', f: 0, skin: 1, hair: 'short', hc: '#212121', hat: 'toque', must: 1, u: { s: '#FFFFFF', p: '#424242', apron: 1, scarf: '#E53935', dbl: 1 }, tool: { e: '🍳', ar: 'المقلاة', en: 'frying pan' }, place: 'restaurant',
      rid: ['أطبخ الطعام اللذيذ', 'I cook yummy food'] },
    engineer:   { ar: 'المهندسة', en: 'engineer', f: 1, skin: 1, hair: 'hijab', hc: '#26A69A', hat: 'hard', hatc: '#FFFFFF', u: { s: '#42A5F5', p: '#455A64', vest: 1 }, tool: { e: '📐', ar: 'المسطرة', en: 'ruler' }, place: 'factory',
      rid: ['أرسم المباني والجسور وأصممها', 'I design buildings and bridges'] },
    dentist:    { ar: 'طبيبة الأسنان', en: 'dentist', f: 1, skin: 0, hair: 'hijab', hc: '#4FC3F7', hat: 'scrub', hatc: '#4DD0E1', mask: 1, u: { s: '#4DD0E1', p: '#4DD0E1', coat: 1 }, tool: { e: '🪥', ar: 'فرشاة الأسنان', en: 'toothbrush' }, place: 'dental',
      rid: ['أعالج الأسنان وأنظفها', 'I look after your teeth'] },
    mechanic:   { ar: 'الميكانيكي', en: 'mechanic', f: 0, skin: 3, hair: 'short', hc: '#1A1A1A', hat: 'capback', hatc: '#E53935', u: { s: '#607D8B', p: '#607D8B', overall: '#546E7A', grease: 1 }, tool: { e: '🔧', ar: 'مفتاح الربط', en: 'wrench' }, place: 'garage',
      rid: ['أصلح السيارات المعطلة', 'I fix broken cars'] },
    baker:      { ar: 'الخباز', en: 'baker', f: 0, skin: 0, hair: 'short', hc: '#8D6E63', hat: 'baker', u: { s: '#FFF3E0', p: '#8D6E63', apron: 1, flour: 1 }, tool: { e: '🥖', ar: 'الخبز', en: 'bread' }, place: 'bakery',
      rid: ['أخبز الخبز والكعك في الفرن', 'I bake bread and cakes in the oven'] },
    fisherman:  { ar: 'الصياد', en: 'fisherman', f: 0, skin: 3, hair: 'short', hc: '#212121', hat: 'bucket', hatc: '#FBC02D', beard: 1, u: { s: '#FBC02D', p: '#1565C0', rain: 1 }, tool: { e: '🎣', ar: 'الصنارة', en: 'fishing rod' }, place: 'sea',
      rid: ['أصطاد السمك من البحر', 'I catch fish from the sea'] },
    astronaut:  { ar: 'رائد الفضاء', en: 'astronaut', f: 0, skin: 1, hair: 'short', hc: '#3E2723', hat: 'astro', u: { s: '#F5F5F5', p: '#E0E0E0', suit: 1 }, tool: { e: '🚀', ar: 'الصاروخ', en: 'rocket' }, place: 'space',
      rid: ['أسافر بالصاروخ إلى الفضاء', 'I travel to space in a rocket'] },
    vet:        { ar: 'الطبيبة البيطرية', en: 'vet', f: 1, skin: 3, hair: 'hijab', hc: '#81C784', hat: 'none', u: { s: '#66BB6A', p: '#388E3C', paw: 1 }, tool: { e: '🐶', ar: 'الجرو', en: 'puppy' }, place: 'vetclinic',
      rid: ['أعالج الحيوانات المريضة', 'I help sick animals'] },
    shepherd:   { ar: 'الراعي', en: 'shepherd', f: 0, skin: 2, hair: 'short', hc: '#1A1A1A', hat: 'ghutra', beard: 1, u: { s: '#FAFAFA', p: '#FAFAFA', thobe: 1 }, tool: { e: '🐑', ar: 'الخروف', en: 'sheep' }, place: 'desert',
      rid: ['أرعى الغنم والإبل في الصحراء', 'I look after sheep and camels in the desert'] },
    builder:    { ar: 'عامل البناء', en: 'builder', f: 0, skin: 2, hair: 'short', hc: '#3E2723', hat: 'hard', hatc: '#FFB300', u: { s: '#90A4AE', p: '#5D4037', vest: 1 }, tool: { e: '🧱', ar: 'الطوب', en: 'bricks' }, place: 'site',
      rid: ['أبني البيوت بالطوب', 'I build houses with bricks'] },
    tailor:     { ar: 'الخياطة', en: 'tailor', f: 1, skin: 1, hair: 'hijab', hc: '#EC407A', hat: 'none', u: { s: '#F8BBD0', p: '#AD1457', tape: 1 }, tool: { e: '🪡', ar: 'الإبرة والخيط', en: 'needle and thread' }, place: 'tailorshop',
      rid: ['أخيط الملابس بالإبرة والخيط', 'I sew clothes with a needle and thread'] },
    barber:     { ar: 'الحلاق', en: 'barber', f: 0, skin: 1, hair: 'curly', hc: '#212121', hat: 'none', must: 1, u: { s: '#FFFFFF', p: '#263238', vestDark: 1 }, tool: { e: '✂️', ar: 'المقص', en: 'scissors' }, place: 'barbershop',
      rid: ['أقص الشعر بالمقص', 'I cut hair with scissors'] },
    pharmacist: { ar: 'الصيدلانية', en: 'pharmacist', f: 1, skin: 2, hair: 'hijab', hc: '#5C6BC0', hat: 'none', glasses: 1, u: { s: '#B39DDB', p: '#3949AB', coat: 1 }, tool: { e: '💊', ar: 'الدواء', en: 'medicine' }, place: 'pharmacy',
      rid: ['أعطي الناس الدواء في الصيدلية', 'I give people medicine at the pharmacy'] }
  };
  for (const k in JOBS) JOBS[k].id = k;
  const ALL = Object.keys(JOBS);
  const HATTED = ALL.filter(k => JOBS[k].hat !== 'none');

  /* ---------- المستويات ---------- */
  const SET1 = ['doctor', 'teacher', 'police', 'firefighter', 'chef'];
  const SET2 = ['pilot', 'farmer', 'nurse', 'baker', 'astronaut'];
  const SET3 = ['engineer', 'dentist', 'mechanic', 'fisherman', 'vet'];
  const SET4 = ['shepherd', 'builder', 'tailor', 'barber', 'pharmacist'];
  const LEVELS = [
    { m: 'learn', jobs: SET1 },
    { m: 'tool', jobs: SET1, q: 5 },
    { m: 'place', jobs: SET1, q: 5 },
    { m: 'learn', jobs: SET2 },
    { m: 'riddle', jobs: [...SET1, ...SET2], q: 5 },
    { m: 'dress', jobs: ['firefighter', 'chef', 'police', 'astronaut'], q: 4 },
    { m: 'learn', jobs: SET3 },
    { m: 'tool', jobs: [...SET1, ...SET2, ...SET3], q: 6 },
    { m: 'place', jobs: [...SET2, ...SET3], q: 6 },
    { m: 'learn', jobs: SET4 },
    { m: 'dress', jobs: ['farmer', 'builder', 'pilot', 'nurse', 'baker', 'fisherman', 'shepherd', 'engineer'], q: 5 },
    { m: 'mix', jobs: ALL, q: 9 }
  ];
  const MODE = {
    learn: { i: '🎓', ar: 'تعرّف' }, tool: { i: '🧰', ar: 'لمن هذا؟' }, place: { i: '🏢', ar: 'أين يعمل؟' },
    riddle: { i: '❓', ar: 'من أنا؟' }, dress: { i: '👷', ar: 'ألبسه' }, mix: { i: '🏆', ar: 'تحدٍّ' }
  };

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeOutBack = t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const plain = s => s.replace(/[ً-ْ]/g, '');
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const shade = (hex, f) => App.shade(hex, f);
  const loadProg = () => { const p = store.get('jobsProg', null) || {}; return { stars: p.stars || {}, unlocked: p.unlocked || 1, met: p.met || [] }; };
  let lang = 'ar';
  const num = n => lang === 'ar' ? String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(n);

  /* ---------- النطق (جمل مركّبة من مقاطع قصيرة) ---------- */
  const say = (ar, en) => lang === 'ar' ? App.speak(plain(ar)) : App.speak(en, 'en');
  const jName = j => lang === 'ar' ? j.ar : cap(j.en);
  const worksAr = j => (j.f ? 'تعمل في' : 'يعمل في');
  const sentence = j => [`${j.ar} ${worksAr(j)} ${PLACES[j.place].ar}`, `The ${j.en} works ${PLACES[j.place].enp}`];
  const sayGood = () => say(App.g('أحسنتِ!', 'أحسنتَ!'), 'Well done!');

  /* ---------- ملصقات الرموز ---------- */
  let dpr = 1;
  const bakeCache = new Map();
  function bake(e, size) {
    const px = Math.max(8, Math.round(size * dpr)), key = e + '|' + px;
    let c = bakeCache.get(key); if (c) return c;
    const pad = Math.round(px * .15), S = px + pad * 2;
    const g = mk(S, S), x = g.getContext('2d');
    x.font = `${Math.round(px * .86)}px ${EMOJI_FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(e, S / 2, S / 2 + px * .04);
    const sil = mk(S, S), sx = sil.getContext('2d');
    sx.drawImage(g, 0, 0); sx.globalCompositeOperation = 'source-in'; sx.fillStyle = '#fff'; sx.fillRect(0, 0, S, S);
    c = mk(S, S); const cx = c.getContext('2d');
    const r = Math.max(2, px * .05);
    cx.save(); cx.shadowColor = 'rgba(30,30,70,.3)'; cx.shadowBlur = px * .05; cx.shadowOffsetY = px * .03;
    for (let i = 0; i < 16; i++) { const a = i / 16 * TAU; cx.drawImage(sil, Math.cos(a) * r, Math.sin(a) * r); }
    cx.restore();
    cx.drawImage(g, 0, 0);
    if (bakeCache.size > 150) bakeCache.clear();
    bakeCache.set(key, c);
    return c;
  }
  function emoji(c, e, x, y, size, rot = 0, alpha = 1) {
    const b = bake(e, size), s = size * 1.3;
    c.save(); c.globalAlpha *= alpha; c.translate(x, y); if (rot) c.rotate(rot); c.drawImage(b, -s / 2, -s / 2, s, s); c.restore();
  }

  /* =====================================================================
     رسم الشخصيات (وحدات محلية: مركز الرأس عند 0,0 ونصف قطره 32، القدمان عند y≈100)
     ===================================================================== */
  function ball(c, x, y, rx, ry, c0, c1, c2) {
    const g = c.createRadialGradient(x - rx * .35, y - ry * .45, Math.min(rx, ry) * .1, x, y, Math.max(rx, ry) * 1.1);
    g.addColorStop(0, c0); g.addColorStop(.6, c1); g.addColorStop(1, c2);
    c.fillStyle = g; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, TAU); c.fill();
  }
  const tone = col => [shade(col, .45), col, shade(col, -.28)];
  function limb(c, x1, y1, x2, y2, w, col) {
    c.lineCap = 'round';
    c.strokeStyle = shade(col, -.35); c.lineWidth = w + 2.4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    c.strokeStyle = col; c.lineWidth = w; c.stroke();
    c.strokeStyle = shade(col, .4); c.globalAlpha = .55; c.lineWidth = w * .3; c.beginPath(); c.moveTo(x1 - w * .2, y1); c.lineTo(x2 - w * .2, y2); c.stroke(); c.globalAlpha = 1;
  }
  /* st: { hat, uni } — في وضع «ألبسه» يرسم العامل بملابس عادية حتى يُختار الصحيح */
  function drawWorker(c, j, st = {}) {
    const hat = st.hat !== false, uni = st.uni !== false;
    const SK = SKINS[j.skin], u = uni ? j.u : { s: '#CFD8DC', p: '#78909C' };
    const sk = tone(SK);
    const thobe = uni && u.thobe, suit = uni && u.suit;
    // ظل
    const sg = c.createRadialGradient(0, 100, 2, 0, 100, 40); sg.addColorStop(0, 'rgba(30,20,60,.3)'); sg.addColorStop(1, 'rgba(30,20,60,0)');
    c.save(); c.translate(0, 100); c.scale(1, .25); c.fillStyle = sg; c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.fill(); c.restore();
    // الغترة / الحجاب خلف الجسم
    if (hat && j.hat === 'ghutra') drawGhutraBack(c);
    if (j.hair === 'hijab') { ball(c, 0, 18, 37, 40, ...tone(j.hc)); }
    // الساقان والحذاء
    if (!thobe) {
      for (const s of [-1, 1]) limb(c, s * 9, 62, s * 10, 90, 13, u.p);
    }
    for (const s of [-1, 1]) {
      const shoe = suit ? '#BDBDBD' : uni && j.id === 'firefighter' ? '#212121' : uni && j.id === 'fisherman' ? '#FBC02D' : '#5D4037';
      ball(c, s * 12, 95, 11, 6.5, ...tone(shoe));
    }
    // الجذع
    const torso = () => { c.beginPath(); c.moveTo(-17, 30); c.quadraticCurveTo(-27, 32, -26, 46); c.lineTo(-25, thobe ? 92 : 66); c.quadraticCurveTo(0, thobe ? 97 : 71, 25, thobe ? 92 : 66); c.lineTo(26, 46); c.quadraticCurveTo(27, 32, 17, 30); c.closePath(); };
    const tg = c.createLinearGradient(-26, 0, 26, 0); const ts = tone(u.s); tg.addColorStop(0, ts[2]); tg.addColorStop(.35, ts[0]); tg.addColorStop(.7, ts[1]); tg.addColorStop(1, ts[2]);
    c.fillStyle = shade(u.s, -.35); c.save(); c.translate(0, 1.5); torso(); c.fill(); c.restore();
    c.fillStyle = tg; torso(); c.fill();
    c.save(); torso(); c.clip();
    if (uni) torsoDetails(c, j, u);
    c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.ellipse(-10, 44, 6, 14, -.2, 0, TAU); c.fill();
    c.restore();
    // الذراعان
    const arm = uni && u.coat ? '#FFFFFF' : uni && u.cardigan ? u.cardigan : u.s;
    for (const s of [-1, 1]) {
      limb(c, s * 22, 36, s * 31, 58, 11, arm);
      if (uni && u.stripes) { c.strokeStyle = '#FFEB3B'; c.lineWidth = 3; c.beginPath(); c.moveTo(s * 25 - 5, 50); c.lineTo(s * 30 + 5, 50); c.stroke(); }
      const gloves = suit || (uni && j.id === 'firefighter');
      ball(c, s * 32, 61, 6.5, 6.5, ...(gloves ? tone(suit ? '#E0E0E0' : '#5D4037') : sk));
    }
    // الرقبة والرأس
    if (j.hair !== 'hijab') { c.fillStyle = sk[2]; c.fillRect(-6, 24, 12, 8); }
    if (hat && j.hat === 'astro') drawAstroBack(c);
    // الأذنان
    if (j.hair !== 'hijab' && !(hat && j.hat === 'ghutra')) for (const s of [-1, 1]) { ball(c, s * 30, 4, 6, 8, ...sk); c.fillStyle = 'rgba(200,110,90,.4)'; c.beginPath(); c.ellipse(s * 30, 4, 3, 5, 0, 0, TAU); c.fill(); }
    // الوجه
    c.fillStyle = shade(SK, -.4); c.beginPath(); c.arc(0, 0, 31.5, 0, TAU); c.fill();
    const fg = c.createRadialGradient(-10, -12, 4, 0, 0, 34); fg.addColorStop(0, shade(SK, .4)); fg.addColorStop(.6, SK); fg.addColorStop(1, shade(SK, -.2));
    c.fillStyle = fg; c.beginPath(); c.arc(0, 0, 30, 0, TAU); c.fill();
    // الشعر
    if (j.hair === 'hijab') drawHijabFront(c, j.hc);
    else if (!(hat && (j.hat === 'ghutra'))) drawHair(c, j, hat);
    // الملامح
    face(c, j, SK, uni);
    // القبعة
    if (hat) drawHat(c, j.hat, j);
    if (uni && u.steth) drawSteth(c);
    if (uni && u.tape) { c.strokeStyle = '#FFD54F'; c.lineWidth = 4; c.beginPath(); c.moveTo(-14, 30); c.quadraticCurveTo(-20, 52, -16, 64); c.moveTo(14, 30); c.quadraticCurveTo(20, 52, 16, 64); c.stroke();
      c.strokeStyle = '#5D4037'; c.lineWidth = 1; for (let y = 36; y < 62; y += 4) { c.beginPath(); c.moveTo(-18 - (y > 50 ? 1 : 0), y); c.lineTo(-15, y); c.stroke(); } }
    if (uni && u.scarf) { c.fillStyle = u.scarf; c.beginPath(); c.ellipse(0, 31, 13, 5, 0, 0, TAU); c.fill(); c.beginPath(); c.moveTo(4, 32); c.lineTo(12, 44); c.lineTo(5, 44); c.closePath(); c.fill(); }
  }
  function torsoDetails(c, j, u) {
    if (u.plaid) { c.strokeStyle = 'rgba(120,20,20,.35)'; c.lineWidth = 2; for (let x = -30; x < 30; x += 7) { c.beginPath(); c.moveTo(x, 28); c.lineTo(x, 70); c.stroke(); } for (let y = 32; y < 70; y += 7) { c.beginPath(); c.moveTo(-30, y); c.lineTo(30, y); c.stroke(); } }
    if (u.overall) { c.fillStyle = u.overall; c.beginPath(); c.roundRect(-16, 46, 32, 26, 4); c.fill(); c.fillRect(-15, 30, 6, 18); c.fillRect(9, 30, 6, 18);
      c.fillStyle = '#FFD54F'; c.beginPath(); c.arc(-12, 47, 2.2, 0, TAU); c.arc(12, 47, 2.2, 0, TAU); c.fill(); c.fillStyle = shade(u.overall, -.2); c.fillRect(-7, 52, 14, 9); }
    if (u.grease) { c.fillStyle = 'rgba(30,30,30,.35)'; c.beginPath(); c.arc(10, 60, 3, 0, TAU); c.arc(-14, 40, 2, 0, TAU); c.fill(); }
    if (u.coat) {
      c.fillStyle = '#FFFFFF'; c.beginPath(); c.moveTo(-28, 28); c.lineTo(-6, 30); c.lineTo(-3, 72); c.lineTo(-30, 72); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(28, 28); c.lineTo(6, 30); c.lineTo(3, 72); c.lineTo(30, 72); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(120,140,170,.45)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-6, 30); c.lineTo(-12, 44); c.lineTo(-3, 50); c.moveTo(6, 30); c.lineTo(12, 44); c.lineTo(3, 50); c.stroke();
      c.fillStyle = 'rgba(120,140,170,.25)'; c.fillRect(-24, 56, 12, 2); c.fillRect(13, 40, 9, 2);
      if (j.id === 'doctor' || j.id === 'pharmacist') { c.fillStyle = '#E53935'; c.fillRect(15, 44, 6, 2); c.fillRect(17, 42, 2, 6); }
    }
    if (u.cardigan) { c.fillStyle = u.cardigan; c.beginPath(); c.moveTo(-28, 28); c.lineTo(-8, 30); c.lineTo(-6, 72); c.lineTo(-30, 72); c.closePath(); c.moveTo(28, 28); c.lineTo(8, 30); c.lineTo(6, 72); c.lineTo(30, 72); c.closePath(); c.fill();
      c.fillStyle = '#FFF'; for (const y of [44, 54, 64]) { c.beginPath(); c.arc(-9, y, 1.6, 0, TAU); c.fill(); } }
    if (u.apron) { c.fillStyle = '#FFFFFF'; c.beginPath(); c.roundRect(-15, 38, 30, 36, 6); c.fill(); c.strokeStyle = 'rgba(0,0,0,.08)'; c.lineWidth = 2; c.strokeRect(-9, 54, 18, 10);
      if (u.flour) { c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.arc(-18, 46, 3, 0, TAU); c.arc(16, 60, 2.5, 0, TAU); c.fill(); } }
    if (u.dbl) { c.fillStyle = '#BDBDBD'; for (const y of [38, 46]) for (const x of [-8, 8]) { c.beginPath(); c.arc(x, y - 4, 1.8, 0, TAU); c.fill(); } }
    if (u.vest) { const v = '#FF8F00'; c.fillStyle = v; c.beginPath(); c.moveTo(-28, 30); c.lineTo(-6, 31); c.lineTo(-5, 72); c.lineTo(-30, 72); c.closePath(); c.moveTo(28, 30); c.lineTo(6, 31); c.lineTo(5, 72); c.lineTo(30, 72); c.closePath(); c.fill();
      c.fillStyle = '#FFF59D'; c.fillRect(-30, 52, 25, 4); c.fillRect(5, 52, 25, 4); c.fillRect(-30, 62, 25, 4); c.fillRect(5, 62, 25, 4); }
    if (u.vestDark) { c.fillStyle = '#263238'; c.beginPath(); c.moveTo(-28, 30); c.lineTo(-5, 34); c.lineTo(-3, 72); c.lineTo(-30, 72); c.closePath(); c.moveTo(28, 30); c.lineTo(5, 34); c.lineTo(3, 72); c.lineTo(30, 72); c.closePath(); c.fill(); c.fillStyle = '#B0BEC5'; c.fillRect(-14, 38, 8, 2); }
    if (u.stripes) { c.fillStyle = '#FFEB3B'; c.fillRect(-30, 54, 60, 5); c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(-30, 54, 60, 1.5); c.fillStyle = '#FFEB3B'; c.fillRect(-15, 30, 4, 24); c.fillRect(11, 30, 4, 24); }
    if (u.tie) { c.fillStyle = u.tie; c.beginPath(); c.moveTo(-3, 31); c.lineTo(3, 31); c.lineTo(4, 50); c.lineTo(0, 55); c.lineTo(-4, 50); c.closePath(); c.fill(); }
    if (u.epaulet) { c.fillStyle = '#FFC107'; c.fillRect(-25, 32, 9, 3); c.fillRect(16, 32, 9, 3); c.fillStyle = '#102A5C'; c.fillRect(-25, 35, 9, 2); c.fillRect(16, 35, 9, 2); }
    if (u.badge) { c.save(); c.translate(-13, 44); c.fillStyle = '#FFC107'; c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 2.6 : 6; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.fill(); c.restore();
      c.fillStyle = shade(u.s, -.25); c.fillRect(8, 40, 11, 8); }
    if (u.rain) { c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 32); c.lineTo(0, 72); c.stroke(); c.fillStyle = '#E0E0E0'; for (const y of [42, 54, 64]) { c.beginPath(); c.arc(3, y, 1.8, 0, TAU); c.fill(); } }
    if (u.suit) { c.fillStyle = '#90A4AE'; c.beginPath(); c.roundRect(-11, 40, 22, 14, 3); c.fill(); c.fillStyle = '#EF5350'; c.beginPath(); c.arc(-5, 47, 2.4, 0, TAU); c.fill(); c.fillStyle = '#66BB6A'; c.beginPath(); c.arc(1, 47, 2.4, 0, TAU); c.fill(); c.fillStyle = '#42A5F5'; c.beginPath(); c.arc(7, 47, 2.4, 0, TAU); c.fill();
      c.fillStyle = '#1E88E5'; c.beginPath(); c.arc(-19, 36, 4, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.fillRect(-21, 35.4, 4, 1.2); c.fillStyle = 'rgba(0,0,0,.12)'; c.fillRect(-30, 60, 60, 3); }
    if (u.thobe) { c.strokeStyle = 'rgba(0,0,0,.08)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, 32); c.lineTo(0, 50); c.stroke(); c.fillStyle = '#E0E0E0'; c.beginPath(); c.arc(0, 38, 1.4, 0, TAU); c.arc(0, 45, 1.4, 0, TAU); c.fill(); }
    if (u.paw) { c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(12, 46, 3.4, 0, TAU); c.arc(8, 41, 1.6, 0, TAU); c.arc(12, 39.5, 1.6, 0, TAU); c.arc(16, 41, 1.6, 0, TAU); c.fill(); }
  }
  function drawSteth(c) {
    c.strokeStyle = '#37474F'; c.lineWidth = 2.6; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-10, 30); c.quadraticCurveTo(-12, 46, 0, 50); c.quadraticCurveTo(12, 46, 10, 30); c.stroke();
    c.beginPath(); c.moveTo(0, 50); c.quadraticCurveTo(2, 58, 8, 60); c.stroke();
    ball(c, 9, 61, 4, 4, '#ECEFF1', '#90A4AE', '#546E7A');
  }
  function drawHair(c, j, hat) {
    const hc = j.hc, hl = shade(hc, .3);
    const g = c.createLinearGradient(0, -34, 0, -6); g.addColorStop(0, hl); g.addColorStop(1, hc);
    c.fillStyle = g;
    if (j.hair === 'curly') {
      c.beginPath(); for (let i = 0; i <= 8; i++) { const a = Math.PI * (1.05 + i * .9 / 8); c.moveTo(Math.cos(a) * 28 + 7, Math.sin(a) * 28); c.arc(Math.cos(a) * 28, Math.sin(a) * 28, 8, 0, TAU); } c.fill();
      return;
    }
    c.beginPath(); c.arc(0, 0, 31.5, Math.PI * 1.02, Math.PI * 1.98);
    c.quadraticCurveTo(26, -10, 20, -12); c.quadraticCurveTo(8, -20, -2, -11); c.quadraticCurveTo(-12, -18, -24, -9); c.quadraticCurveTo(-30, -6, -31, -1); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(-12, -24, 8, 3, -.4, 0, TAU); c.fill();
  }
  function drawHijabFront(c, col) {
    const t = tone(col);
    // إطار الوجه
    c.save(); c.beginPath(); c.arc(0, 0, 34, 0, TAU); c.arc(0, 3, 25, 0, TAU, true); c.clip('evenodd');
    ball(c, 0, -2, 35, 36, ...t); c.restore();
    c.strokeStyle = shade(col, -.25); c.lineWidth = 1.5; c.beginPath(); c.arc(0, 3, 25, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
    c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(-16, -22, 9, 4, -.6, 0, TAU); c.fill();
    // طرف أسفل الذقن
    c.fillStyle = t[1]; c.beginPath(); c.moveTo(-20, 22); c.quadraticCurveTo(0, 36, 20, 22); c.lineTo(22, 34); c.quadraticCurveTo(0, 42, -22, 34); c.closePath(); c.fill();
  }
  function drawGhutraBack(c) {
    c.fillStyle = '#F5F5F5'; c.beginPath(); c.moveTo(-34, -10); c.quadraticCurveTo(-42, 20, -30, 44); c.lineTo(30, 44); c.quadraticCurveTo(42, 20, 34, -10); c.closePath(); c.fill();
    c.save(); c.clip(); c.strokeStyle = 'rgba(220,40,40,.75)'; c.lineWidth = 2.4;
    for (let i = -60; i < 60; i += 6) { c.beginPath(); c.moveTo(i, -20); c.lineTo(i + 40, 50); c.stroke(); c.beginPath(); c.moveTo(i + 40, -20); c.lineTo(i, 50); c.stroke(); }
    c.restore();
  }
  function drawAstroBack(c) {
    c.fillStyle = '#ECEFF1'; c.beginPath(); c.ellipse(0, 30, 26, 7, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(180,220,255,.25)'; c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.fill();
  }
  function face(c, j, SK) {
    // الخدّان
    for (const s of [-1, 1]) { const g = c.createRadialGradient(s * 17, 10, 1, s * 17, 10, 7); g.addColorStop(0, 'rgba(255,110,120,.45)'); g.addColorStop(1, 'rgba(255,110,120,0)'); c.fillStyle = g; c.beginPath(); c.arc(s * 17, 10, 7, 0, TAU); c.fill(); }
    // العينان
    for (const s of [-1, 1]) {
      c.fillStyle = '#2B1A12'; c.beginPath(); c.ellipse(s * 10.5, 0, 4.4, 5.4, 0, 0, TAU); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(s * 10.5 - 1.4, -1.8, 1.7, 0, TAU); c.fill();
      c.beginPath(); c.arc(s * 10.5 + 1.3, 1.6, .8, 0, TAU); c.fill();
      c.strokeStyle = shade(SK, -.5); c.lineWidth = 1.6; c.lineCap = 'round'; c.beginPath(); c.moveTo(s * 6.5, -10); c.quadraticCurveTo(s * 10.5, -12.5, s * 14.5, -10); c.stroke();
    }
    if (j.glasses) { c.strokeStyle = '#4A2C6B'; c.lineWidth = 1.8; for (const s of [-1, 1]) { c.beginPath(); c.roundRect(s * 10.5 - 7, -6.5, 14, 12, 4); c.stroke(); } c.beginPath(); c.moveTo(-3.5, -1); c.lineTo(3.5, -1); c.stroke(); }
    // الأنف والفم
    c.fillStyle = shade(SK, -.15); c.beginPath(); c.ellipse(0, 6, 3, 2.3, 0, 0, TAU); c.fill();
    if (j.mask) {
      c.fillStyle = '#B2EBF2'; c.beginPath(); c.roundRect(-14, 6, 28, 14, 6); c.fill();
      c.strokeStyle = '#80DEEA'; c.lineWidth = 1; for (const y of [10, 14]) { c.beginPath(); c.moveTo(-12, y); c.lineTo(12, y); c.stroke(); }
      c.strokeStyle = '#E0F7FA'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-14, 9); c.lineTo(-27, 3); c.moveTo(14, 9); c.lineTo(27, 3); c.stroke();
      return;
    }
    c.fillStyle = '#8A2B2B'; c.beginPath(); c.moveTo(-6, 12); c.quadraticCurveTo(0, 13.5, 6, 12); c.quadraticCurveTo(0, 21, -6, 12); c.fill();
    c.fillStyle = '#FF8A95'; c.beginPath(); c.ellipse(0, 16.5, 3, 1.6, 0, 0, TAU); c.fill();
    if (j.must) { c.fillStyle = j.hc; c.beginPath(); c.moveTo(0, 9); c.quadraticCurveTo(-6, 7, -10, 11); c.quadraticCurveTo(-5, 12, 0, 10.5); c.quadraticCurveTo(5, 12, 10, 11); c.quadraticCurveTo(6, 7, 0, 9); c.fill(); }
    if (j.beard) { c.fillStyle = shade(j.hc, .1); c.globalAlpha = .9; c.beginPath(); c.moveTo(-25, 8); c.quadraticCurveTo(-22, 30, 0, 31); c.quadraticCurveTo(22, 30, 25, 8); c.quadraticCurveTo(18, 20, 8, 20); c.quadraticCurveTo(0, 22, -8, 20); c.quadraticCurveTo(-18, 20, -25, 8); c.fill(); c.globalAlpha = 1;
      c.fillStyle = '#8A2B2B'; c.beginPath(); c.ellipse(0, 16, 4, 2, 0, 0, Math.PI); c.fill(); }
  }
  function drawHat(c, type, j) {
    const hc = (j && j.hatc) || '#1E3A8A';
    c.save();
    switch (type) {
      case 'cap': {
        ball(c, 0, -26, 33, 13, ...tone(hc));
        c.fillStyle = shade(hc, -.15); c.fillRect(-29, -22, 58, 7);
        c.fillStyle = '#111'; c.beginPath(); c.ellipse(0, -14, 27, 5.5, 0, 0, Math.PI); c.fill();
        c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(-4, -14.5, 18, 2, 0, 0, Math.PI); c.fill();
        if (j && j.wings) { c.fillStyle = '#FFC107'; c.beginPath(); c.ellipse(-7, -27, 7, 2.5, .2, 0, TAU); c.ellipse(7, -27, 7, 2.5, -.2, 0, TAU); c.fill(); }
        ball(c, 0, -27, 4.5, 4.5, '#FFF3C4', '#FFC107', '#C58F00');
        break;
      }
      case 'nurse': {
        c.fillStyle = '#fff'; c.beginPath(); c.moveTo(-18, -26); c.lineTo(18, -26); c.lineTo(14, -40); c.lineTo(-14, -40); c.closePath(); c.fill();
        c.strokeStyle = 'rgba(0,0,0,.1)'; c.lineWidth = 1; c.stroke();
        c.fillStyle = '#E53935'; c.fillRect(-2, -38, 4, 10); c.fillRect(-5, -35, 10, 4);
        break;
      }
      case 'fire': {
        c.fillStyle = shade('#D32F2F', -.3); c.beginPath(); c.ellipse(0, -16, 40, 9, 0, 0, TAU); c.fill();
        ball(c, 0, -16, 39, 8, '#FF8A80', '#E53935', '#B71C1C');
        ball(c, 0, -28, 29, 20, '#FF8A80', '#E53935', '#B71C1C');
        c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -47); c.lineTo(0, -18); c.stroke();
        ball(c, 0, -26, 8, 9, '#FFF3C4', '#FFC107', '#C58F00');
        c.fillStyle = '#B71C1C'; c.font = `900 9px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('1', 0, -25);
        break;
      }
      case 'hard': {
        const t = tone(hc);
        c.fillStyle = t[2]; c.beginPath(); c.ellipse(0, -16, 37, 7, 0, 0, TAU); c.fill();
        ball(c, 0, -17, 36, 6, ...t);
        ball(c, 0, -26, 29, 19, ...t);
        c.fillStyle = t[0]; c.beginPath(); c.roundRect(-4, -46, 8, 26, 4); c.fill();
        break;
      }
      case 'toque': {
        c.fillStyle = '#F5F5F5'; c.fillRect(-22, -32, 44, 14);
        ball(c, -14, -44, 15, 15, '#fff', '#F5F5F5', '#CFD8DC'); ball(c, 14, -44, 15, 15, '#fff', '#F5F5F5', '#CFD8DC'); ball(c, 0, -54, 18, 18, '#fff', '#F5F5F5', '#CFD8DC');
        c.fillStyle = '#ECEFF1'; c.beginPath(); c.roundRect(-23, -32, 46, 14, 4); c.fill();
        c.strokeStyle = 'rgba(0,0,0,.08)'; c.lineWidth = 1; c.beginPath(); c.moveTo(-8, -32); c.lineTo(-8, -19); c.moveTo(8, -32); c.lineTo(8, -19); c.stroke();
        break;
      }
      case 'baker': {
        ball(c, -10, -34, 13, 11, '#fff', '#F5F5F5', '#CFD8DC'); ball(c, 10, -34, 13, 11, '#fff', '#F5F5F5', '#CFD8DC'); ball(c, 0, -38, 14, 12, '#fff', '#F5F5F5', '#CFD8DC');
        c.fillStyle = '#ECEFF1'; c.beginPath(); c.roundRect(-24, -29, 48, 10, 4); c.fill();
        break;
      }
      case 'straw': {
        c.fillStyle = '#C59A3E'; c.beginPath(); c.ellipse(0, -17, 47, 10, 0, 0, TAU); c.fill();
        ball(c, 0, -18, 45, 8.5, '#FFF0B3', '#F2CC6B', '#C59A3E');
        ball(c, 0, -28, 24, 16, '#FFF0B3', '#F2CC6B', '#C59A3E');
        c.fillStyle = '#D84315'; c.fillRect(-23, -24, 46, 5);
        c.strokeStyle = 'rgba(160,110,30,.4)'; c.lineWidth = 1; for (let i = -40; i <= 40; i += 8) { c.beginPath(); c.moveTo(i, -20); c.lineTo(i * 1.1, -13); c.stroke(); }
        break;
      }
      case 'ghutra': {
        c.fillStyle = '#FAFAFA'; c.beginPath(); c.arc(0, 0, 34, Math.PI * .95, Math.PI * 2.05); c.lineTo(32, 10); c.quadraticCurveTo(27, -6, 0, -12); c.quadraticCurveTo(-27, -6, -32, 10); c.closePath(); c.fill();
        c.save(); c.clip(); c.strokeStyle = 'rgba(220,40,40,.75)'; c.lineWidth = 2.4;
        for (let i = -70; i < 70; i += 6) { c.beginPath(); c.moveTo(i, -40); c.lineTo(i + 40, 20); c.stroke(); c.beginPath(); c.moveTo(i + 40, -40); c.lineTo(i, 20); c.stroke(); }
        c.restore();
        c.strokeStyle = '#212121'; c.lineWidth = 4.5; c.beginPath(); c.ellipse(0, -24, 25, 6, 0, 0, TAU); c.stroke();
        c.strokeStyle = 'rgba(255,255,255,.25)'; c.lineWidth = 1.2; c.beginPath(); c.ellipse(0, -25.5, 25, 6, 0, Math.PI * 1.1, Math.PI * 1.6); c.stroke();
        break;
      }
      case 'bucket': {
        const t = tone(hc);
        c.fillStyle = t[2]; c.beginPath(); c.moveTo(-40, -12); c.lineTo(40, -12); c.lineTo(32, -22); c.lineTo(-32, -22); c.closePath(); c.fill();
        ball(c, 0, -30, 26, 15, ...t);
        c.fillStyle = shade(hc, -.12); c.fillRect(-26, -24, 52, 4);
        break;
      }
      case 'astro': {
        c.strokeStyle = '#ECEFF1'; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 40, 0, TAU); c.stroke();
        c.strokeStyle = '#B0BEC5'; c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, 42.5, 0, TAU); c.stroke();
        const g = c.createRadialGradient(-14, -18, 2, 0, 0, 40); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.4, 'rgba(200,230,255,.15)'); g.addColorStop(1, 'rgba(120,180,255,.3)');
        c.fillStyle = g; c.beginPath(); c.arc(0, 0, 38, 0, TAU); c.fill();
        c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.arc(0, 0, 32, Math.PI * 1.15, Math.PI * 1.4); c.stroke();
        c.fillStyle = '#EF5350'; c.beginPath(); c.arc(30, -26, 3, 0, TAU); c.fill();
        break;
      }
      case 'capback': {
        ball(c, 0, -24, 31, 12, ...tone(hc));
        c.fillStyle = shade(hc, -.25); c.beginPath(); c.ellipse(22, -18, 14, 4.5, .5, 0, TAU); c.fill();
        c.fillStyle = '#fff'; c.beginPath(); c.arc(-4, -27, 3, 0, TAU); c.fill();
        break;
      }
      case 'scrub': {
        const t = tone(hc);
        c.save(); c.beginPath(); c.arc(0, 0, 35, Math.PI, TAU); c.lineTo(35, -12); c.quadraticCurveTo(0, -20, -35, -12); c.closePath(); c.clip();
        ball(c, 0, -10, 35, 34, ...t); c.restore();
        c.fillStyle = 'rgba(255,255,255,.4)'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(-20 + i * 8, -24 + (i % 2) * 5, 1.6, 0, TAU); c.fill(); }
        break;
      }
    }
    c.restore();
  }

  /* مخزن صور الشخصيات */
  const sprCache = new Map();
  function sprite(j, st, h) {
    const px = Math.max(16, Math.round(h * dpr)), key = j.id + '|' + (st.hat !== false ? 1 : 0) + (st.uni !== false ? 1 : 0) + (st.sil ? 's' : '') + '|' + px;
    let cv = sprCache.get(key); if (cv) return cv;
    const k = px / 180, Wd = Math.ceil(110 * k), c2 = mk(Wd, px), c = c2.getContext('2d');
    c.translate(Wd / 2, 72 * k); c.scale(k, k);
    drawWorker(c, j, st);
    if (st.sil) { c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'source-in'; c.fillStyle = '#5B4B8A'; c.fillRect(0, 0, Wd, px); }
    if (sprCache.size > 120) sprCache.clear();
    sprCache.set(key, c2);
    return c2;
  }
  /* يرسم الشخصية بقدميها عند (x,y) وبارتفاع h */
  function drawSprite(c, j, st, x, y, h, o = {}) {
    const s = sprite(j, st, h), w = s.width / s.height * h;
    c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.scale(o.sx || 1, o.sy || 1); if (o.alpha != null) c.globalAlpha *= o.alpha;
    c.drawImage(s, -w / 2, -h * (172 / 180), w, h);
    // رمش
    if (o.blink && !st.sil && j.hat !== 'astro') {
      const k = h / 180, fy = -h * (172 / 180) + 72 * k;
      c.fillStyle = SKINS[j.skin];
      for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * 10.5 * k, fy, 5.4 * k, 6.2 * k, 0, 0, TAU); c.fill(); }
      c.strokeStyle = '#2B1A12'; c.lineWidth = 1.6 * k; for (const sd of [-1, 1]) { c.beginPath(); c.arc(sd * 10.5 * k, fy, 4 * k, .2, Math.PI - .2); c.stroke(); }
    }
    c.restore();
    return { handX: x + 32 * (h / 180), handY: y - h * (172 / 180) + 133 * (h / 180) };
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #jobs{background:#CFE8FF;overflow:hidden;color:#26315C}
  #jobs canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #jobs .ib{color:#3B5BDB}
  #jobs .lng{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 rgba(40,70,160,.2),0 8px 16px rgba(30,50,120,.15)}
  #jobs .lng button{min-width:64px;padding:6px 11px;border-radius:99px;font-weight:900;font-size:17px;background:#EEF3FF;color:#3B5BDB;line-height:1.25}
  #jobs .lng button[data-l=en]{font-family:system-ui,"Segoe UI",sans-serif;font-size:16px}
  #jobs .lng button.on{background:linear-gradient(#748FFC,#4263EB);color:#fff;box-shadow:0 3px 0 #2B44B5;text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #jobs .pbar{position:absolute;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 58px);z-index:4;display:flex;gap:4px;padding:6px 9px;border-radius:99px;
    background:rgba(255,255,255,.92);box-shadow:0 3px 0 rgba(40,70,160,.15),0 6px 14px rgba(30,50,120,.1);max-width:calc(100% - 24px)}
  #jobs .pbar i{width:26px;height:12px;border-radius:6px;background:#E3E9F5;box-shadow:inset 0 2px 2px rgba(0,0,0,.08);flex:0 1 26px;min-width:8px}
  #jobs .pbar i.on{background:linear-gradient(#FFC861,#FF8A1F);box-shadow:0 2px 0 #D06A00;animation:jbPop .45s cubic-bezier(.3,1.8,.5,1)}
  #jobs .pbar i.cur{background:#FFE7B5;box-shadow:0 0 0 2px #FFB35C}
  @keyframes jbPop{40%{transform:scale(1.5,1.3)}}
  #jobs .ask{position:absolute;z-index:5;left:50%;transform:translateX(-50%);bottom:max(12px,env(safe-area-inset-bottom));width:min(calc(100% - 24px),600px);
    display:flex;align-items:center;gap:10px;padding:9px 12px 9px 10px;border-radius:30px;background:linear-gradient(180deg,#fff 0,#fff 70%,#F1F5FF 100%);
    border:4px solid #A5B8FF;box-shadow:0 7px 0 #6F86E8,0 14px 24px rgba(30,50,120,.22)}
  #jobs .spk{width:62px;height:62px;flex:0 0 62px;border-radius:50%;font-size:28px;display:grid;place-items:center;
    background:radial-gradient(circle at 35% 30%,#FFE98A,#FFC21A 60%,#E9A300);border:3px solid #FFF4C4;box-shadow:0 5px 0 #C98600,0 8px 14px rgba(0,0,0,.18),inset 0 2px 0 rgba(255,255,255,.6);transition:transform .14s var(--press)}
  #jobs .spk:active{transform:translateY(3px) scale(1.06,.92);box-shadow:0 2px 0 #C98600}
  #jobs .spk.pulse{animation:jbSpk 1s ease-in-out 2}
  @keyframes jbSpk{50%{transform:scale(1.13)}}
  #jobs .aq{flex:1;min-width:0;display:flex;align-items:center;gap:8px;font-weight:900;color:#26315C;font-size:clamp(18px,5.4vw,26px);line-height:1.15}
  #jobs .aq .ai{font-size:clamp(32px,9vw,44px);line-height:1;font-family:${EMOJI_FONT};filter:drop-shadow(0 3px 0 rgba(40,70,160,.18));flex:none}
  #jobs .aq .at{min-width:0}
  #jobs .aq .at small{display:block;font-size:14px;font-weight:800;color:#4263EB;opacity:.9;line-height:1.25}
  #jobs .aq .at.en{direction:ltr;text-align:left;font-family:system-ui,"Segoe UI",sans-serif;font-weight:800}
  #jobs .nextb{flex:none;height:58px;padding:0 18px;border-radius:99px;font-size:22px;font-weight:900;color:#fff;display:none;align-items:center;gap:4px;
    background:linear-gradient(#8CE36B,#3FB52E 60%,#2E9A20);border:3px solid #E8FFD9;box-shadow:0 5px 0 #237A17,0 8px 14px rgba(30,100,20,.25);text-shadow:0 1px 0 rgba(0,0,0,.2);transition:transform .14s var(--press)}
  #jobs .nextb.on{display:flex}
  #jobs .nextb.pulse{animation:jbSpk 1s ease-in-out infinite}
  #jobs .nextb:active{transform:translateY(3px) scale(1.05,.92);box-shadow:0 2px 0 #237A17}
  #jobs .overlay{background:radial-gradient(circle at 50% 45%,rgba(30,50,120,.25),rgba(20,30,80,.5))}
  #jobs .panel{border:5px solid #C5D0FF;box-shadow:0 8px 0 #7B91EE,0 20px 40px rgba(10,20,80,.3);color:#26315C;background:linear-gradient(180deg,#fff 0,#fff 70%,#F1F5FF 100%)}
  #jobs .panel h3{color:#3B5BDB;text-shadow:0 3px 0 #DDE4FF}
  #jobs .btn{background:linear-gradient(#748FFC,#4263EB 60%,#3651D4);box-shadow:0 5px 0 #2B44B5,0 8px 12px rgba(40,70,200,.25)}
  #jobs .btn:active{box-shadow:0 1px 0 #2B44B5}
  #jobs .btn.alt{background:#fff;color:#3B5BDB;box-shadow:0 5px 0 #C5D0FF;border:3px solid #E3E9FF}
  #jobs .wkid{white-space:nowrap;letter-spacing:4px;font-size:40px;line-height:1.1;font-family:${EMOJI_FONT}}
  #jobs .lvp{width:min(94vw,460px);max-height:90vh;overflow-y:auto;touch-action:pan-y;padding:16px 12px 14px}
  #jobs .lvg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:10px 0 12px}
  #jobs .lvb{position:relative;border-radius:22px;background:linear-gradient(#fff,#F3F6FF);border:3px solid #C5D0FF;box-shadow:0 5px 0 #8EA2F0;
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#26315C;font-weight:900;padding:8px 2px 6px;gap:1px;min-height:104px}
  #jobs .lvb.m-tool{border-color:#FFD8A8;box-shadow:0 5px 0 #F2A65A;background:linear-gradient(#fff,#FFF6EC)}
  #jobs .lvb.m-place{border-color:#B2F2BB;box-shadow:0 5px 0 #69C47A;background:linear-gradient(#fff,#EFFFF2)}
  #jobs .lvb.m-riddle{border-color:#E5DBFF;box-shadow:0 5px 0 #A98BEE;background:linear-gradient(#fff,#F7F2FF)}
  #jobs .lvb.m-dress{border-color:#FFC9C9;box-shadow:0 5px 0 #F08080;background:linear-gradient(#fff,#FFF2F2)}
  #jobs .lvb.m-mix{border-color:#FFE08A;box-shadow:0 5px 0 #F2B630;background:linear-gradient(#fff,#FFF8DD)}
  #jobs .lvb:active{transform:translateY(3px)}
  #jobs .lvb .n{position:absolute;top:4px;right:6px;width:24px;height:24px;border-radius:50%;background:#4263EB;color:#fff;font-size:14px;display:grid;place-items:center;box-shadow:0 2px 0 #2B44B5}
  #jobs .lvb .e{font-size:30px;line-height:1.15;font-family:${EMOJI_FONT}}
  #jobs .lvb b{font-size:13px;line-height:1.15}
  #jobs .lvb small{font-size:15px;line-height:1.1;font-family:${EMOJI_FONT};letter-spacing:-2px}
  #jobs .lvb .s{font-size:12px;letter-spacing:-1px;line-height:1;height:13px}
  #jobs .lvb .s i{font-style:normal}
  #jobs .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #jobs .lvb.cur{outline:3px solid #FF9A1F;outline-offset:2px}
  #jobs .lvb.lock{filter:grayscale(.85);opacity:.6}
  #jobs .lvb.lock::after{content:'🔒';position:absolute;font-size:22px;top:30px}
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
    <div class="ask">
      <button class="spk" aria-label="اسمع مرة أخرى">🔊</button>
      <div class="aq"><span class="ai"></span><span class="at"></span></div>
      <button class="nextb" aria-label="التالي">التالي ◀</button>
    </div>
    <div class="overlay" id="jbLv"><div class="panel lvp"><h3>🔢 المستويات</h3><div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="jbWin"><div class="panel">
      <h3 class="wT"></h3><div class="wkid"></div><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄</button><button class="btn alt" data-a="levels">🔢 المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const pbar = root.querySelector('.pbar'), askEl = root.querySelector('.ask'), spkBtn = root.querySelector('.spk');
  const aiEl = root.querySelector('.ai'), atEl = root.querySelector('.at'), nextBtn = root.querySelector('.nextb');
  const lvOv = root.querySelector('#jbLv'), winOv = root.querySelector('#jbWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, portrait = true;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, def = LEVELS[0], bgLayer = null, bgKey = '';
  let stage = { x: 0, y: 0, w: 0, h: 0 }, opt = { x: 0, y: 0, w: 0, h: 0 };
  let qs = [], qi = 0, cur = null, cards = [], mistakes = 0, wrongNow = 0, over = false, lock = 0, hintT = 0, idleT = 0;
  let subj = null, parts = [], rings = [], tasks = [], flyers = [], shake = 0, blinkAt = 2, blinkT = -1;
  let learnI = 0;

  function later(s, fn) { tasks.push({ t: s, fn }); }

  /* ---------- الخلفية: مدينة صغيرة ---------- */
  function buildBg() {
    const key = W + 'x' + H + '|' + dpr + '|' + Math.round(stage.y + stage.h);
    if (bgKey === key && bgLayer) return;
    bgKey = key;
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    const gy = stage.y + stage.h * .9;
    let g = x.createLinearGradient(0, 0, 0, gy); g.addColorStop(0, '#8FD0FF'); g.addColorStop(1, '#E3F4FF');
    x.fillStyle = g; x.fillRect(0, 0, W, gy + 2);
    const u = Math.min(W, H) / 10;
    // شمس وغيوم
    g = x.createRadialGradient(W * .85, gy * .25, 4, W * .85, gy * .25, u * 2); g.addColorStop(0, 'rgba(255,245,180,.9)'); g.addColorStop(1, 'rgba(255,245,180,0)'); x.fillStyle = g; x.fillRect(0, 0, W, gy);
    IK.cloud(x, W * .08, gy * .35, u * 1.6); IK.cloud(x, W * .58, gy * .2, u * 1.2); if (!portrait) IK.cloud(x, W * .32, gy * .45, u * 1.1);
    // مبانٍ بعيدة مستديرة
    let sd = 7; const R = () => (sd = (sd * 9301 + 49297) % 233280) / 233280;
    const cols = ['#B9D7F5', '#C8E0F7', '#A9CBEF', '#D2E6FA'];
    for (let bx = -10; bx < W + 10;) {
      const bw = u * (.9 + R() * .9), bh = u * (1.2 + R() * 2.2);
      x.fillStyle = cols[Math.floor(R() * 4)]; x.beginPath(); x.roundRect(bx, gy - bh, bw, bh + 4, [u * .25, u * .25, 0, 0]); x.fill();
      x.fillStyle = 'rgba(255,255,255,.55)';
      for (let wy = gy - bh + u * .3; wy < gy - u * .4; wy += u * .5) for (let wx = bx + u * .2; wx < bx + bw - u * .3; wx += u * .38) { x.beginPath(); x.roundRect(wx, wy, u * .2, u * .26, 3); x.fill(); }
      bx += bw + u * .12;
    }
    // الأرض: رصيف وعشب
    g = x.createLinearGradient(0, gy, 0, H); g.addColorStop(0, '#A8E07C'); g.addColorStop(1, '#6CC24A');
    x.fillStyle = g; x.fillRect(0, gy, W, H - gy);
    g = x.createLinearGradient(0, gy, 0, gy + u * .5); g.addColorStop(0, '#F1E6D8'); g.addColorStop(1, '#DCCBB5');
    x.fillStyle = g; x.fillRect(0, gy, W, u * .5);
    x.fillStyle = 'rgba(160,130,100,.35)'; for (let i = 0; i < W; i += u * .9) x.fillRect(i, gy, 2, u * .5);
    x.fillStyle = 'rgba(255,255,255,.4)'; x.fillRect(0, gy, W, 3);
    // لوحة الخيارات خلفية فاتحة
    for (let i = 0; i < 30; i++) { const fx = R() * W, fy = gy + u * .7 + R() * (H - gy); x.fillStyle = ['#FF8FB1', '#FFD36B', '#fff', '#B9A2FF'][i % 4]; x.beginPath(); x.arc(fx, fy, 2 + R() * 2.5, 0, TAU); x.fill(); }
  }

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    portrait = W / H < 1.05;
    const top = pbar.getBoundingClientRect().bottom + 8;
    const bot = askEl.getBoundingClientRect().top - 12;
    const av = Math.max(200, bot - top), aw = Math.min(W - 24, 900);
    const sh = av * (portrait ? .47 : .56);
    stage = { x: (W - aw) / 2, y: top, w: aw, h: sh };
    opt = { x: (W - aw) / 2, y: top + sh + 6, w: aw, h: av - sh - 6 };
    placeCards();
    buildBg();
  }
  function placeCards() {
    const n = cards.length; if (!n) return;
    const gap = 12, cw = Math.min((opt.w - gap * (n - 1)) / n, portrait ? 170 : 210), ch = Math.min(opt.h - 10, cw * 1.35);
    const tw = cw * n + gap * (n - 1), x0 = W / 2 - tw / 2;
    // RTL: البطاقة الأولى على اليمين
    cards.forEach((c, i) => { c.w = cw; c.h = ch; c.x = x0 + (n - 1 - i) * (cw + gap) + cw / 2; c.y = opt.y + (opt.h - ch) / 2 + ch / 2; });
  }

  /* ---------- الأسئلة ---------- */
  function setProg() {
    const n = def.m === 'learn' ? def.jobs.length : qs.length;
    const k = def.m === 'learn' ? learnI + (over ? 1 : 0) : qi;
    pbar.innerHTML = Array.from({ length: n }, (_, i) => `<i class="${i < k ? 'on' : i === k && !over ? 'cur' : ''}"></i>`).join('');
  }
  function pickOthers(j, pool, n, sameKey) {
    const others = shuffle(pool.filter(k => k !== j.id && (!sameKey || JOBS[k][sameKey] !== j[sameKey])));
    return others.slice(0, n);
  }
  function buildQuestions() {
    const m = def.m;
    if (m === 'learn') return def.jobs.map(id => ({ type: 'learn', job: id }));
    const types = m === 'mix' ? ['tool', 'place', 'riddle'] : m === 'dress' ? ['dress'] : [m];
    const jobs = shuffle(def.jobs.slice()).slice(0, def.q);
    while (jobs.length < def.q) jobs.push(def.jobs[Math.floor(Math.random() * def.jobs.length)]);
    return jobs.map((id, i) => ({ type: types[i % types.length], job: id }));
  }
  function startLevel(n) {
    lvl = clamp(n, 1, LEVELS.length); def = LEVELS[lvl - 1];
    over = false; mistakes = 0; qi = 0; cur = null; lock = 0; learnI = 0;
    tasks = []; parts = []; flyers = []; cards = []; subj = null;
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    qs = buildQuestions();
    if (window.gsap) gsap.killTweensOf(root.querySelector('.aq'));
    later(.25, ask);
    setProg();
  }
  function mkCard(kind, id, extra = {}) { return Object.assign({ kind, id, x: W / 2, y: H, w: 100, h: 130, pop: 0, delay: 0, sh: 0, state: '', glow: 0, bounce: 0 }, extra); }
  function ask() {
    if (over) return;
    cur = qs[qi]; wrongNow = 0; hintT = 0; idleT = 0; lock = 0;
    if (!cur) return;
    const j = JOBS[cur.job];
    cards = []; nextBtn.classList.remove('on', 'pulse');
    const pool = def.m === 'mix' ? ALL : def.jobs.length >= 3 ? def.jobs : ALL;
    if (cur.type === 'learn') {
      subj = { kind: 'learn', job: j.id, t: 0 };
      cards = [mkCard('tool', j.id), mkCard('place', j.place)];
      nextBtn.classList.add('on');
      const pr = loadProg(); if (!pr.met.includes(j.id)) { pr.met.push(j.id); store.set('jobsProg', pr); if (pr.met.length >= ALL.length) App.achieve('jobs_meet_all'); }
    } else if (cur.type === 'tool' || cur.type === 'riddle') {
      subj = { kind: cur.type, job: j.id, t: 0 };
      const others = pickOthers(j, pool.length >= 3 ? pool : ALL, 2);
      cards = shuffle([j.id, ...others]).map(id => mkCard('worker', id));
    } else if (cur.type === 'place') {
      subj = { kind: 'place', job: j.id, t: 0 };
      const others = pickOthers(j, ALL, 2, 'place').map(k => JOBS[k].place).filter((p, i, a) => a.indexOf(p) === i);
      while (others.length < 2) { const p = Object.keys(PLACES)[Math.floor(Math.random() * 19)]; if (p !== j.place && !others.includes(p)) others.push(p); }
      cards = shuffle([j.place, ...others]).map(id => mkCard('place', id));
    } else if (cur.type === 'dress') {
      subj = { kind: 'dress', job: j.id, t: 0, hat: j.hat === 'none', uni: false, step: j.hat === 'none' ? 'uni' : 'hat' };
      dressCards();
    }
    cards.forEach((c, i) => c.delay = .15 + i * .08);
    placeCards();
    showQ(); setProg(); sayQ();
    if (window.gsap && typeof Fx !== 'undefined' && Fx.on) gsap.fromTo(root.querySelector('.aq'), { scale: .85 }, { scale: 1, duration: .55, ease: 'elastic.out(1,0.5)', clearProps: 'transform' });
  }
  function dressCards() {
    const j = JOBS[cur.job];
    if (subj.step === 'hat') {
      const others = shuffle(HATTED.filter(k => JOBS[k].hat !== j.hat)).filter((k, i, a) => a.findIndex(x => JOBS[x].hat === JOBS[k].hat) === i).slice(0, 2);
      cards = shuffle([j.id, ...others]).map(id => mkCard('hat', id));
    } else {
      const others = shuffle(ALL.filter(k => k !== j.id && JOBS[k].u.s !== j.u.s)).slice(0, 2);
      cards = shuffle([j.id, ...others]).map(id => mkCard('uni', id));
    }
    cards.forEach((c, i) => c.delay = .1 + i * .08);
    placeCards();
  }
  function qText() {
    const j = JOBS[cur.job], f = j.f;
    switch (cur.type) {
      case 'learn': return [j.ar, j.en, `${worksAr(j)} ${PLACES[j.place].ar}`, `works ${PLACES[j.place].enp}`];
      case 'tool': return ['لمن هذا؟', 'Whose is this?', lang === 'ar' ? j.tool.ar : cap(j.tool.en), ''];
      case 'place': return [`${f ? 'أين تعمل' : 'أين يعمل'} ${j.ar}؟`, `Where does the ${j.en} work?`, '', ''];
      case 'riddle': return ['من أنا؟', 'Who am I?', j.rid[0], j.rid[1]];
      case 'dress': return subj.step === 'hat'
        ? [`${App.g('اختاري', 'اختر')} قبعة ${j.ar}`, `Choose the hat for the ${j.en}`, '', '']
        : [`${App.g('اختاري', 'اختر')} زي ${j.ar}`, `Choose the uniform for the ${j.en}`, '', ''];
    }
  }
  function showQ() {
    if (!cur) return;
    const j = JOBS[cur.job], t = qText();
    const icon = { learn: j.tool.e, tool: '🧰', place: PLACES[j.place].e, riddle: '❓', dress: subj && subj.step === 'hat' ? '🎩' : '👕' }[cur.type];
    aiEl.textContent = cur.type === 'place' ? '🏢' : icon;
    atEl.className = 'at' + (lang === 'en' ? ' en' : '');
    let main = lang === 'ar' ? t[0] : t[1], sub = '';
    if (cur.type === 'learn') sub = lang === 'ar' ? t[2] : t[3];
    if (cur.type === 'riddle') { sub = main; main = lang === 'ar' ? t[2] : t[3]; }
    if (cur.type === 'learn' && lang === 'en') main = cap(main);
    atEl.innerHTML = App.esc(main) + (sub ? `<small>${App.esc(sub)}</small>` : '');
  }
  function sayQ() {
    if (!cur) return;
    const j = JOBS[cur.job];
    switch (cur.type) {
      case 'learn': { const s = sentence(j); say(s[0], s[1]); break; }
      case 'tool': say('لمن هذا؟', 'Whose is this?'); break;
      case 'place': say(`${j.f ? 'أين تعمل' : 'أين يعمل'} ${j.ar}؟`, `Where does the ${j.en} work?`); break;
      case 'riddle': say(`${j.rid[0]}. من أنا؟`, `${j.rid[1]}. Who am I?`); break;
      case 'dress': { const t = qText(); say(t[0], t[1]); break; }
    }
    spkBtn.classList.remove('pulse'); void spkBtn.offsetWidth; spkBtn.classList.add('pulse');
  }
  function isRight(c) {
    const j = JOBS[cur.job];
    if (cur.type === 'place') return c.id === j.place;
    if (cur.type === 'dress') return c.id === j.id;
    return c.id === j.id;
  }

  /* ---------- الاختيار ---------- */
  function pickCard(c) {
    idleT = 0;
    if (cur.type === 'learn') {
      c.bounce = 1; Sound.pop();
      if (c.kind === 'tool') { const t = JOBS[c.id].tool; say(t.ar, t.en); }
      else { const p = PLACES[c.id]; say(p.ar, p.en); }
      return;
    }
    if (lock > 0 || c.state) return;
    if (isRight(c)) right(c); else wrong(c);
  }
  function right(c) {
    const j = JOBS[cur.job];
    lock = 99; c.state = 'ok'; c.bounce = 1; c.glow = 1;
    cards.forEach(o => { if (o !== c && !o.state) o.state = 'fade'; });
    Sound.star(); vibrate(15);
    burst(c.x, c.y - c.h * .1, '#7ED957', 18);
    if (cur.type === 'dress') {
      flyTo(c, subjCenter(), () => {
        if (subj.step === 'hat') subj.hat = true; else subj.uni = true;
        Sound.pop(); poof(subjCenter().x, subjCenter().y); subj.t = 0; subj.jump = 1;
        if (subj.step === 'hat' && !subj.uni) { later(.5, () => { subj.step = 'uni'; lock = 0; wrongNow = 0; dressCards(); showQ(); sayQ(); }); }
        else { say(j.ar, cap(j.en)); finishQ(1.5); }
      });
      say(App.g('أحسنتِ!', 'أحسنتَ!'), 'Well done!');
      return;
    }
    if (cur.type === 'tool') {
      flyers.push({ e: j.tool.e, x0: subjCenter().x, y0: subjCenter().y, x1: c.x + c.w * .22, y1: c.y + c.h * .05, t: 0, d: .6, s: 0 });
      say(j.ar, cap(j.en));
    } else if (cur.type === 'place') {
      subj.jump = 1; subj.t = 0;
      const s = sentence(j); say(s[0], s[1]);
    } else {
      subj.reveal = 1;
      say('أنا ' + j.ar, `I am the ${j.en}`);
    }
    finishQ(cur.type === 'place' ? 2.4 : 1.8);
  }
  function finishQ(d) {
    later(d, () => { qi++; setProg(); if (qi >= qs.length) win(); else { cards.forEach(c => c.state = c.state || 'fade'); later(.2, ask); } });
  }
  function wrong(c) {
    mistakes++; wrongNow++; lock = .6;
    c.state = 'bad'; c.sh = 1;
    Sound.error(); vibrate(30);
    if (c.kind === 'worker') { const o = JOBS[c.id]; say(o.ar, cap(o.en)); }
    else if (c.kind === 'place') { const p = PLACES[c.id]; say(p.ar, p.en); }
    if (wrongNow >= 2) hintT = 4;
  }
  function subjCenter() { return { x: W / 2, y: stage.y + stage.h * .5 }; }
  function flyTo(c, to, done) { flyers.push({ card: c, x0: c.x, y0: c.y, x1: to.x, y1: to.y, t: 0, d: .5, s: 0, done }); }
  function burst(x, y, col, n = 14) {
    for (let i = 0; i < n; i++) { const a = rand(0, TAU), v = rand(80, 240); parts.push({ t: 'star', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.5, .9), age: 0, s: rand(5, 9), c: i % 2 ? '#FFE26B' : col }); }
    rings.push({ x, y, age: 0, life: .45 });
  }
  function poof(x, y) { for (let i = 0; i < 14; i++) { const a = rand(0, TAU), v = rand(40, 140); parts.push({ t: 'puff', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, rot: 0, vr: 0, life: .6, age: 0, s: rand(8, 16), c: '#fff' }); } burst(x, y, '#FFB3D4', 10); }

  /* ---------- الفوز والمستويات ---------- */
  function win() {
    if (over) return;
    over = true; cur = null; nextBtn.classList.remove('on', 'pulse');
    const pr = loadProg();
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(LEVELS.length, lvl + 1);
    store.set('jobsProg', pr);
    setProg();
    for (let i = 0; i < 120; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 240), rot: rand(0, TAU), vr: rand(-8, 8), life: rand(2.5, 4), age: 0, s: rand(6, 11), c: ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9'][i % 6] });
    Sound.win();
    aiEl.style.display = ''; aiEl.textContent = '🏆'; atEl.className = 'at'; atEl.textContent = App.g('أحسنتِ!', 'أحسنتَ!');
    subj = { kind: 'parade', t: 0, jobs: def.jobs.slice(0, 5) };
    cards = [];
    later(1.3, () => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنتَ!') + ' 🎉';
      root.querySelector('.wkid').textContent = def.jobs.slice(0, 4).map(k => JOBS[k].tool.e).join(' ');
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      const msg = { learn: App.g('تعرّفتِ', 'تعرّفتَ') + ' على مهن جديدة', tool: App.g('عرفتِ', 'عرفتَ') + ' أداة كل مهنة', place: App.g('عرفتِ', 'عرفتَ') + ' أين يعمل كل واحد', riddle: App.g('حللتِ', 'حللتَ') + ' كل الألغاز', dress: App.g('ألبستِ', 'ألبستَ') + ' كل العمّال', mix: App.g('أنهيتِ', 'أنهيتَ') + ' التحدّي الكبير' }[def.m];
      root.querySelector('.wP').textContent = msg + (mistakes || def.m === 'learn' ? '' : ' دون أخطاء! 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < LEVELS.length ? '' : 'none';
      winOv.classList.add('on');
      if (typeof Fx !== 'undefined' && Fx.overlayIn) Fx.overlayIn(winOv);
      sayGood();
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('jobs_first');
      if (def.m === 'riddle' && !mistakes) App.achieve('jobs_riddles');
      if (def.m === 'dress') App.achieve('jobs_dress');
      if (LEVELS.every((_, i) => pr.stars[i + 1])) App.achieve('jobs_all');
    });
  }
  function openLevels() {
    const pr = loadProg(), g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lk = n > pr.unlocked, M = MODE[L.m];
      return `<button class="lvb m-${L.m}${lk ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}"><span class="n">${num(n)}</span>
        <span class="e">${M.i}</span><b>${M.ar}</b><small>${L.jobs.slice(0, 4).map(k => JOBS[k].tool.e).join('')}</small>
        <span class="s">${lk ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    g.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
    if (typeof Fx !== 'undefined' && Fx.overlayIn) Fx.overlayIn(lvOv);
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
  spkBtn.addEventListener('click', () => { if (paused || !cur) return; Sound.tap(); sayQ(); });
  nextBtn.addEventListener('click', () => {
    if (paused || blocked() || !cur || cur.type !== 'learn' || lock > 0) return;
    Sound.whoosh(); lock = .5;
    cards.forEach(c => c.state = 'fade');
    if (learnI + 1 >= qs.length) { nextBtn.classList.remove('on'); win(); return; }
    learnI++; qi++; setProg();
    later(.25, ask);
  });
  function setLang(l) {
    lang = l === 'en' ? 'en' : 'ar'; store.set('jobsLang', lang);
    root.querySelectorAll('.lng button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
    showQ();
  }
  root.querySelectorAll('.lng button').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.l === lang) return;
    Sound.tap(); setLang(b.dataset.l); sayQ();
  }));

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  const blocked = () => App.current !== ID || paused || winOv.classList.contains('on') || lvOv.classList.contains('on');
  cv.addEventListener('pointerdown', e => {
    if (blocked() || !cur) return;
    const p = pos(e);
    for (const c of cards) {
      if (c.state === 'fade' || c.pop < .5) continue;
      if (Math.abs(p.x - c.x) < c.w / 2 && Math.abs(p.y - c.y) < c.h / 2) { pickCard(c); return; }
    }
    // لمس الشخصية في المسرح
    const sc = subjCenter();
    if (Math.abs(p.x - sc.x) < stage.h * .35 && p.y > stage.y && p.y < stage.y + stage.h && subj) {
      subj.jump = 1; subj.t = 0; Sound.pop(); idleT = 0;
      if (cur.type === 'learn') { const j = JOBS[cur.job]; say(j.ar, cap(j.en)); later(1.2, () => { if (cur && cur.type === 'learn' && cur.job === j.id) nextBtn.classList.add('pulse'); }); }
      else sayQ();
    }
  });
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on')) { if (e.key === 'Enter' || e.key === ' ') { act(lvl < LEVELS.length ? 'next' : 'again'); e.preventDefault(); } return; }
    if (blocked() || !cur) return;
    if (e.key === ' ') { sayQ(); e.preventDefault(); }
    else if (e.key === 'Enter' && cur.type === 'learn') nextBtn.click();
    else if (/^[1-3]$/.test(e.key)) { const c = cards[+e.key - 1]; if (c && c.state !== 'fade') pickCard(c); }
  });

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt; idleT += dt;
    if (cv.clientWidth && (Math.abs(cv.clientWidth - W) > 1 || Math.abs(cv.clientHeight - H) > 1)) { bgKey = ''; layout(); }
    for (let i = tasks.length - 1; i >= 0; i--) { const k = tasks[i]; k.t -= dt; if (k.t <= 0) { tasks.splice(i, 1); k.fn(); } }
    if (lock > 0 && lock < 50) lock -= dt;
    if (hintT > 0) hintT -= dt;
    blinkAt -= dt; if (blinkT >= 0) { blinkT += dt; if (blinkT > .15) blinkT = -1; } else if (blinkAt <= 0) { blinkT = 0; blinkAt = rand(2, 4.5); }
    if (subj) { subj.t += dt; if (subj.jump) subj.jump = Math.max(0, subj.jump - dt * 1.4); if (subj.reveal != null) subj.reveal = Math.min(1, subj.reveal + dt * 3); }
    for (const c of cards) {
      if (c.delay > 0) { c.delay -= dt; continue; }
      if (c.state === 'fade') c.pop = Math.max(0, c.pop - dt * 4); else c.pop = Math.min(1, c.pop + dt * 3);
      c.sh = Math.max(0, c.sh - dt * 2.2); c.bounce = Math.max(0, c.bounce - dt * 2); c.glow = Math.max(0, c.glow - dt * .5);
    }
    cards = cards.filter(c => !(c.state === 'fade' && c.pop <= 0 && c.delay <= 0));
    for (let i = flyers.length - 1; i >= 0; i--) {
      const f = flyers[i]; f.t += dt / f.d;
      if (f.t >= 1) { flyers.splice(i, 1); if (f.card) f.card.state = 'fade', f.card.pop = 0; if (f.done) f.done(); if (!f.card) burst(f.x1, f.y1, '#FFE26B', 8); }
    }
    if (cur && !over && lock <= 0 && idleT > 10) { idleT = 0; sayQ(); if (cur.type !== 'learn') hintT = Math.max(hintT, 2); else nextBtn.classList.add('pulse'); }
    for (const q of parts) {
      q.age += dt; q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
      if (q.t === 'star') { q.vy += 400 * dt; q.vx *= .98; } else if (q.t === 'conf') q.vx += Math.sin(q.age * 3 + q.rot) * 20 * dt; else if (q.t === 'puff') { q.vx *= .9; q.vy *= .9; }
    }
    parts = parts.filter(q => q.age < q.life && q.y < H + 40);
    for (const r of rings) r.age += dt; rings = rings.filter(r => r.age < r.life);
    shake = Math.max(0, shake - dt * 30);
  }

  /* ---------- الرسم ---------- */
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  function plate(x, y, w, h, col) {
    // بطاقة بيضاء سميكة بحافة ملوّنة (أسلوب لعبة ثلاثية الأبعاد)
    const r = Math.min(26, w * .18);
    ctx.save();
    ctx.shadowColor = 'rgba(20,30,80,.25)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 8;
    ctx.fillStyle = shade(col, -.25); ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2 + 6, w, h, r); ctx.fill();
    ctx.restore();
    const g = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2); g.addColorStop(0, '#fff'); g.addColorStop(.7, '#fff'); g.addColorStop(1, shade(col, .82));
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, r); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(x - w / 2 + 2.5, y - h / 2 + 2.5, w - 5, h - 5, r - 2); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.roundRect(x - w / 2 + 10, y - h / 2 + 7, w - 20, 6, 3); ctx.fill();
  }
  function label(t, x, y, size, col, en) {
    ctx.font = `900 ${size}px ${en ? 'system-ui,"Segoe UI",sans-serif' : FONT}`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    let s = size; while (ctx.measureText(t).width > size * 9 && s > 10) { s -= 1; ctx.font = `900 ${s}px ${en ? 'system-ui,"Segoe UI",sans-serif' : FONT}`; }
    ctx.lineWidth = 4; ctx.strokeStyle = '#fff'; ctx.lineJoin = 'round'; ctx.strokeText(t, x, y);
    ctx.fillStyle = col; ctx.fillText(t, x, y);
  }
  function fitLabel(t, x, y, maxW, size, col) {
    const en = lang === 'en';
    ctx.font = `900 ${size}px ${en ? 'system-ui,"Segoe UI",sans-serif' : FONT}`;
    let s = size; while (ctx.measureText(t).width > maxW && s > 9) { s -= 1; ctx.font = `900 ${s}px ${en ? 'system-ui,"Segoe UI",sans-serif' : FONT}`; }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(t, x, y);
  }
  function drawCard(c) {
    if (c.pop <= 0) return;
    const k = c.state === 'fade' ? c.pop : easeOutBack(c.pop), bo = Math.sin(c.bounce * Math.PI) * .12;
    const sx = c.sh > 0 ? Math.sin(c.sh * 30) * 8 * c.sh : 0;
    const x = c.x + sx, y = c.y - Math.sin(c.bounce * Math.PI) * 12;
    let col = '#748FFC';
    if (c.kind === 'place') col = PLACES[c.id].c;
    if (c.kind === 'worker' || c.kind === 'hat' || c.kind === 'uni') col = ['#748FFC', '#FF922B', '#20C997', '#F06595', '#845EF7'][ALL.indexOf(c.id) % 5];
    if (c.kind === 'tool') col = '#FFA94D';
    if (c.state === 'ok') col = '#40C057';
    if (c.state === 'bad') col = '#ADB5BD';
    ctx.save(); ctx.translate(x, y); ctx.scale(k * (1 + bo), k * (1 - bo * .6)); ctx.translate(-x, -y);
    if (c.state === 'bad') ctx.globalAlpha = .6;
    // توهّج التلميح
    const right = cur && cur.type !== 'learn' && isRight(c);
    if ((hintT > 0 && right && !c.state) || c.glow > 0) {
      ctx.save(); ctx.shadowColor = c.glow > 0 ? '#8CE99A' : '#FFD43B'; ctx.shadowBlur = 30 + Math.sin(T * 8) * 10;
      ctx.fillStyle = c.glow > 0 ? '#8CE99A' : '#FFD43B'; ctx.beginPath(); ctx.roundRect(x - c.w / 2 - 4, y - c.h / 2 - 4, c.w + 8, c.h + 14, 28); ctx.fill(); ctx.restore();
    }
    plate(x, y, c.w, c.h, col);
    const fs = clamp(c.w * .13, 12, 19);
    if (c.kind === 'worker') {
      const j = JOBS[c.id], hh = c.h * .74;
      drawSprite(ctx, j, {}, x, y + c.h * .25, hh, { blink: blinkT >= 0, sy: 1 + Math.sin(T * 3 + c.x) * .012 });
      if (c.state === 'ok' && cur && cur.type === 'tool') emoji(ctx, j.tool.e, x + c.w * .24, y + c.h * .07, c.w * .22);
      ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.beginPath(); ctx.roundRect(x - c.w / 2 + 6, y + c.h * .3, c.w - 12, c.h * .17, 10); ctx.fill();
      fitLabel(jName(j), x, y + c.h * .385, c.w - 16, fs, '#26315C');
    } else if (c.kind === 'place' || c.kind === 'tool') {
      const isP = c.kind === 'place', P = isP ? PLACES[c.id] : JOBS[c.id].tool;
      if (isP) {
        const g = ctx.createLinearGradient(0, y - c.h / 2, 0, y + c.h * .25); g.addColorStop(0, shade(P.c, .55)); g.addColorStop(1, shade(P.c, .2));
        ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x - c.w / 2 + 9, y - c.h / 2 + 9, c.w - 18, c.h * .62, 16); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(x, y + c.h * .02, c.w * .38, c.h * .07, 0, 0, TAU); ctx.fill();
      }
      emoji(ctx, P.e, x, y - c.h * .14 + Math.sin(T * 2.4 + c.x) * 2, Math.min(c.w * .52, c.h * .4));
      fitLabel(lang === 'ar' ? P.ar : cap(P.en), x, y + c.h * .34, c.w - 16, fs, '#26315C');
    } else if (c.kind === 'hat') {
      const j = JOBS[c.id], s = Math.min(c.w, c.h) / 95;
      ctx.save(); ctx.translate(x, y + c.h * .1); ctx.scale(s, s); drawHat(ctx, j.hat, j); ctx.restore();
    } else if (c.kind === 'uni') {
      const j = JOBS[c.id], s = Math.min(c.w / 75, c.h / 95);
      ctx.save(); ctx.translate(x, y - c.h * .35); ctx.scale(s, s);
      ctx.beginPath(); ctx.rect(-50, 25, 100, 80); ctx.clip();
      const jj = Object.assign({}, j, { hair: 'bald', skin: j.skin });
      drawUniOnly(ctx, jj);
      ctx.restore();
    }
    if (c.state === 'ok') { ctx.font = `${fs * 1.6}px ${EMOJI_FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('✅', x + c.w / 2 - 10, y - c.h / 2 + 10); }
    if (c.state === 'bad') { ctx.globalAlpha = 1; ctx.font = `${fs * 1.6}px ${EMOJI_FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('❌', x + c.w / 2 - 10, y - c.h / 2 + 10); }
    ctx.restore();
  }
  /* الزي وحده (الجذع والذراعان) لبطاقات «ألبسه» */
  function drawUniOnly(c, j) {
    const u = j.u;
    const torso = () => { c.beginPath(); c.moveTo(-17, 30); c.quadraticCurveTo(-27, 32, -26, 46); c.lineTo(-25, 72); c.quadraticCurveTo(0, 77, 25, 72); c.lineTo(26, 46); c.quadraticCurveTo(27, 32, 17, 30); c.closePath(); };
    const ts = tone(u.s), tg = c.createLinearGradient(-26, 0, 26, 0); tg.addColorStop(0, ts[2]); tg.addColorStop(.35, ts[0]); tg.addColorStop(.7, ts[1]); tg.addColorStop(1, ts[2]);
    const arm = u.coat ? '#FFFFFF' : u.cardigan ? u.cardigan : u.s;
    for (const s of [-1, 1]) limb(c, s * 22, 36, s * 31, 60, 11, arm);
    c.fillStyle = shade(u.s, -.35); c.save(); c.translate(0, 1.5); torso(); c.fill(); c.restore();
    c.fillStyle = tg; torso(); c.fill();
    c.save(); torso(); c.clip(); torsoDetails(c, j, u); c.restore();
    c.fillStyle = 'rgba(0,0,0,.12)'; c.beginPath(); c.ellipse(0, 30, 10, 4, 0, 0, Math.PI); c.fill();
    if (u.steth) drawSteth(c);
    if (u.scarf) { c.fillStyle = u.scarf; c.beginPath(); c.ellipse(0, 31, 13, 5, 0, 0, TAU); c.fill(); }
  }
  function drawStage() {
    if (!subj) return;
    const sc = subjCenter(), h = stage.h * .92, baseY = stage.y + stage.h * .97;
    const jump = subj.jump ? Math.sin(subj.jump * Math.PI) * h * .12 : 0;
    const breath = 1 + Math.sin(T * 2.5) * .012;
    if (subj.kind === 'parade') {
      const js = subj.jobs, n = js.length, hw = Math.min(stage.w / n, h * .55);
      js.forEach((id, i) => { const x = W / 2 + (i - (n - 1) / 2) * hw; const jy = Math.abs(Math.sin(T * 5 + i)) * h * .06; drawSprite(ctx, JOBS[id], {}, x, baseY - jy, h * .8, { blink: blinkT >= 0 }); });
      return;
    }
    const j = JOBS[subj.job];
    if (subj.kind === 'learn' || subj.kind === 'place' || subj.kind === 'dress') {
      // منصّة
      ctx.save(); ctx.translate(sc.x, baseY); ctx.scale(1, .22);
      const g = ctx.createRadialGradient(0, -10, 4, 0, 0, h * .38); g.addColorStop(0, '#FFFFFF'); g.addColorStop(.8, '#DDE4FF'); g.addColorStop(1, '#B4C2FF');
      ctx.fillStyle = '#8EA2F0'; ctx.beginPath(); ctx.arc(0, 30, h * .38, 0, TAU); ctx.fill();
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, h * .38, 0, TAU); ctx.fill(); ctx.restore();
      const st = subj.kind === 'dress' ? { hat: subj.hat, uni: subj.uni } : {};
      const r = drawSprite(ctx, j, st, sc.x, baseY - jump, h, { blink: blinkT >= 0, sy: breath, sx: 1 / breath * (subj.jump ? 1 + Math.sin(subj.jump * Math.PI * 2) * .04 : 1) });
      if (subj.kind !== 'dress' || (subj.hat && subj.uni)) emoji(ctx, j.tool.e, r.handX + h * .04, r.handY - jump - h * .03, h * .2, Math.sin(T * 2) * .1);
      if (subj.kind === 'place') { // فقاعة تفكير
        const bx = sc.x + h * .36, by = stage.y + h * .2;
        ctx.save(); ctx.fillStyle = '#fff'; ctx.shadowColor = 'rgba(20,30,80,.2)'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(bx, by, h * .14, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(bx - h * .13, by + h * .17, h * .035, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(bx - h * .2, by + h * .25, h * .02, 0, TAU); ctx.fill(); ctx.restore();
        const done = cur && cards.some(c => c.state === 'ok');
        if (done) emoji(ctx, PLACES[j.place].e, bx, by, h * .17); else label('؟', bx, by + 2, h * .16, '#4263EB');
      }
      return;
    }
    if (subj.kind === 'tool') {
      const s = h * .5, by = sc.y + Math.sin(T * 2.2) * 5;
      const done = cards.some(c => c.state === 'ok');
      plate(sc.x, by, s * 1.3, s * 1.3, '#FFA94D');
      if (!done) emoji(ctx, j.tool.e, sc.x, by - s * .08, s * .75, Math.sin(T * 1.5) * .08);
      fitLabel(lang === 'ar' ? j.tool.ar : cap(j.tool.en), sc.x, by + s * .47, s * 1.2, clamp(s * .14, 13, 20), '#26315C');
      label('؟', sc.x + s * .7, by - s * .62, s * .3, '#FF922B');
      return;
    }
    if (subj.kind === 'riddle') {
      const rv = subj.reveal || 0, by = baseY;
      const s = sprite(j, { sil: true }, h * .9);
      ctx.save(); ctx.globalAlpha = 1 - rv; drawSprite(ctx, j, { sil: true }, sc.x, by, h * .9, { sy: breath }); ctx.restore();
      if (rv > 0) { ctx.save(); ctx.globalAlpha = rv; drawSprite(ctx, j, {}, sc.x, by - Math.sin(rv * Math.PI) * h * .1, h * .9, { blink: blinkT >= 0, sy: breath }); ctx.restore(); }
      if (rv < 1) label('؟', sc.x, stage.y + h * .35, h * .3, '#FFFFFF');
      // موجات الصوت
      const sx = sc.x - h * .42, sy = stage.y + h * .3;
      emoji(ctx, '🔊', sx, sy, h * .14);
      ctx.strokeStyle = 'rgba(66,99,235,.6)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) { const a = ((T * 1.4 + i / 3) % 1); ctx.globalAlpha = 1 - a; ctx.beginPath(); ctx.arc(sx, sy, h * (.1 + a * .15), -.6, .6); ctx.stroke(); }
      ctx.globalAlpha = 1;
      void s;
    }
  }
  function render() {
    if (!ctx) return;
    ctx.save();
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake) * .5);
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    drawStage();
    for (const c of cards) drawCard(c);
    for (const f of flyers) {
      const t = Math.min(1, f.t), e = t * t * (3 - 2 * t), x = lerp(f.x0, f.x1, e), y = lerp(f.y0, f.y1, e) - Math.sin(t * Math.PI) * 80;
      if (f.card) { ctx.save(); ctx.globalAlpha = 1 - t * .6; const c = f.card; const s0 = 1 - t * .4; ctx.translate(x, y); ctx.scale(s0, s0); ctx.translate(-x, -y);
        const tmp = { ...c, x, y, state: '', pop: 1, sh: 0, bounce: 0, glow: 0 }; drawCard(tmp); ctx.restore(); }
      else emoji(ctx, f.e, x, y, 50 * (1 - t * .3), t * TAU);
    }
    for (const r of rings) { const t = r.age / r.life; ctx.strokeStyle = `rgba(255,255,255,${(1 - t) * .9})`; ctx.lineWidth = 4 * (1 - t) + 1; ctx.beginPath(); ctx.arc(r.x, r.y, 10 + t * 60, 0, TAU); ctx.stroke(); }
    for (const q of parts) {
      const t = q.age / q.life;
      ctx.save(); ctx.translate(q.x, q.y);
      if (q.t === 'conf') { ctx.rotate(q.rot); ctx.globalAlpha = Math.min(1, (q.life - q.age) * 2); ctx.fillStyle = q.c; ctx.fillRect(-q.s / 2, -q.s / 4, q.s, q.s / 2); }
      else if (q.t === 'puff') { ctx.globalAlpha = (1 - t) * .9; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, q.s * (1 + t), 0, TAU); ctx.fill(); }
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
    clearTimeout(resizeT); resizeT = setTimeout(() => { bgKey = ''; bakeCache.clear(); sprCache.clear(); layout(); if (!running) render(); }, 80);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    IK.bg(c, s, ['#D6E8FF', '#8FB8FF', '#4F7DF0'], { seed: 9 });
    IK.ground(c, s, s * .8, '#A8E07C', '#5DB03A');
    IK.shadow(c, s * .5, s * .9, s * .34, s * .07);
    IK.sticker(c, s, x => {
      const k = s / 230;
      x.save(); x.translate(s * .34, s * .4); x.scale(k, k); drawWorker(x, JOBS.firefighter, {}); x.restore();
      x.save(); x.translate(s * .68, s * .42); x.scale(k * .95, k * .95); drawWorker(x, JOBS.doctor, {}); x.restore();
    });
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'المهن', icon2: '👩‍⚕️', isNew: true, music: 'taxi',
    desc: () => App.g('تعرّفي على الطبيب والطيار والمزارع…', 'تعرّف على الطبيب والطيار والمزارع…'),
    help: () => [
      '👩‍⚕️ ' + App.g('تعرّفي', 'تعرّف') + ' على عشرين مهنة: من يعمل في المستشفى؟ ومن يقود الطائرة؟',
      '🧰 «لمن هذا؟»: ' + App.g('المسي', 'المس') + ' صاحب الأداة',
      '🏢 «أين يعمل؟»: ' + App.g('اختاري', 'اختر') + ' مكان العمل',
      '❓ «من أنا؟»: ' + App.g('اسمعي', 'اسمع') + ' اللغز ثم ' + App.g('اختاري', 'اختر') + ' الجواب',
      '👷 «ألبسه»: ' + App.g('اختاري', 'اختر') + ' القبعة ثم الزي · 🌍 عربي / English'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 ${ks.length}/${LEVELS.length} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      lang = store.get('jobsLang', 'ar') === 'en' ? 'en' : 'ar';
      root.querySelectorAll('.lng button').forEach(b => b.classList.toggle('on', b.dataset.l === lang));
      bakeCache.clear(); sprCache.clear();
      layout();
      const pr = loadProg();
      startLevel(Math.min(pr.unlocked, LEVELS.length));
      render(); startLoop();
    },
    leave() { stopLoop(); tasks = []; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; },
    resume() { paused = false; last = performance.now(); },
    back() { if (lvOv.classList.contains('on')) { act('close'); return true; } return false; },
    /* للاختبار الآلي فقط */
    _state() { return { lvl, mode: def.m, qi, n: qs.length, cur: cur && { ...cur }, step: subj && subj.step, mistakes, over, lang, cards: cards.map(c => ({ kind: c.kind, id: c.id, x: c.x, y: c.y, w: c.w, h: c.h, pop: c.pop, state: c.state, right: !!(cur && cur.type !== 'learn' && isRight(c)) })) }; }
  });
})();
