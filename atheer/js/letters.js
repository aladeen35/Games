/* =====================================================================
   حروفي — تتبّع الحروف العربية والإنجليزية بالإصبع
   يُستخرج مسار كل حرف آليًا من الخط نفسه (هيكل الحرف) ثم يتتبّعه الطفل
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'letters';
  const TAU = Math.PI * 2;
  const FONT_NAME = '"Baloo Bhaijaan 2"';
  const FONT = `${FONT_NAME},system-ui,"Segoe UI",Tahoma,sans-serif`;
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  /* ---------- البيانات ---------- */
  // [الحرف، اسمه، كلمة، رمز]
  const AR = [
    ['أ', 'ألف', 'أرنب', '🐰'], ['ب', 'باء', 'بطة', '🦆'], ['ت', 'تاء', 'تفاحة', '🍎'], ['ث', 'ثاء', 'ثعلب', '🦊'],
    ['ج', 'جيم', 'جمل', '🐪'], ['ح', 'حاء', 'حصان', '🐴'], ['خ', 'خاء', 'خروف', '🐑'], ['د', 'دال', 'دب', '🐻'],
    ['ذ', 'ذال', 'ذرة', '🌽'], ['ر', 'راء', 'رمّان', '#pom'], ['ز', 'زاي', 'زرافة', '🦒'], ['س', 'سين', 'سمكة', '🐟'],
    ['ش', 'شين', 'شمس', '☀️'], ['ص', 'صاد', 'صقر', '🦅'], ['ض', 'ضاد', 'ضفدع', '🐸'], ['ط', 'طاء', 'طائرة', '✈️'],
    ['ظ', 'ظاء', 'ظرف', '✉️'], ['ع', 'عين', 'عنب', '🍇'], ['غ', 'غين', 'غيمة', '☁️'], ['ف', 'فاء', 'فراشة', '🦋'],
    ['ق', 'قاف', 'قطة', '🐱'], ['ك', 'كاف', 'كلب', '🐶'], ['ل', 'لام', 'ليمون', '🍋'], ['م', 'ميم', 'موز', '🍌'],
    ['ن', 'نون', 'نحلة', '🐝'], ['ه', 'هاء', 'هدية', '🎁'], ['و', 'واو', 'وردة', '🌹'], ['ي', 'ياء', 'يد', '✋']
  ].map(([c, n, w, e]) => ({ c, n, w, e, a: 'ar' }));
  const EN = [
    ['Apple', '🍎'], ['Ball', '⚽'], ['Cat', '🐱'], ['Dog', '🐶'], ['Egg', '🥚'], ['Fish', '🐟'], ['Grapes', '🍇'],
    ['Hat', '🎩'], ['Ice cream', '🍦'], ['Juice', '🧃'], ['Kite', '🪁|#kite'], ['Lion', '🦁'], ['Moon', '🌙'], ['Nest', '🪺|🐣'],
    ['Orange', '🍊'], ['Pig', '🐷'], ['Queen', '👸'], ['Rainbow', '🌈'], ['Sun', '☀️'], ['Tiger', '🐯'], ['Umbrella', '☂️'],
    ['Violin', '🎻'], ['Whale', '🐳'], ['Xylophone', '#xylo'], ['Yo-yo', '🪀|#yoyo'], ['Zebra', '🦓']
  ].map(([w, e], i) => { const C = String.fromCharCode(65 + i); return { c: C, l: C.toLowerCase(), n: C, w, e, a: 'en' }; });
  const SETS = { ar: AR, en: EN };
  const JOIN = 'بتثجحخسشصضطظعغفقكلمنهي';
  const COLORS = [
    { n: 'أحمر', e: 'Red', c: '#F2484B', d: '#B8222A', l: '#FF9C8F' },
    { n: 'برتقالي', e: 'Orange', c: '#FF9425', d: '#C9600A', l: '#FFC67A' },
    { n: 'أخضر', e: 'Green', c: '#3DBE5B', d: '#1F8A3B', l: '#9BE7A5' },
    { n: 'أزرق', e: 'Blue', c: '#2F8CF0', d: '#1A5DB8', l: '#92C6FF' },
    { n: 'بنفسجي', e: 'Purple', c: '#9A5BE6', d: '#6631B0', l: '#CDAEFF' },
    { n: 'وردي', e: 'Pink', c: '#FF5FA8', d: '#C92E78', l: '#FFB0D4' }
  ];
  const BADGE = ['#FF6B5B', '#2EB5A8', '#FFB020', '#8E6CF0', '#3F9BF5', '#F06AAE', '#5CC46A'];
  const QUIZ_N = 5, QUIZ_UNLOCK = 5;

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    outElastic: t => t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * TAU / 3) + 1
  };
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function starPath(c, s, inner = .45) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * inner : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  const loadProg = () => { const p = store.get('lettersProg', null) || {}; return { ar: p.ar || {}, en: p.en || {} }; };
  const countOf = (p, a) => SETS[a].filter(it => p[a][it.c]).length;
  const label = it => it.a === 'en' ? it.c + it.l : it.c;
  const sfxOn = () => gstore.get('sfx', true);

  const speakEn = text => App.speak(text, 'en');

  const sayName = it => it.a === 'ar' ? App.speak(it.n) : speakEn(it.c);
  const sayWord = it => it.a === 'ar' ? App.speak(it.w) : speakEn(it.w);

  /* هل يدعم الجهاز هذا الرمز التعبيري الملوّن؟ */
  const emoOK = {};
  function emojiSupported(e) {
    if (e in emoOK) return emoOK[e];
    let ok = true;
    try {
      const c = mk(32, 32), x = c.getContext('2d', { willReadFrequently: true });
      x.font = `26px ${EMOJI_FONT}`; x.textBaseline = 'middle'; x.textAlign = 'center'; x.fillText(e, 16, 17);
      const d = x.getImageData(0, 0, 32, 32).data; let col = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 60 && (Math.abs(d[i] - d[i + 1]) > 35 || Math.abs(d[i + 1] - d[i + 2]) > 35)) col++;
      ok = col > 12;
    } catch (er) {}
    return (emoOK[e] = ok);
  }

  /* ---------- صور مرسومة لما ليس له رمز تعبيري ---------- */
  function drawPic(key, S) {
    const c = mk(S, S), x = c.getContext('2d'); x.translate(S / 2, S / 2); x.scale(S / 100, S / 100);
    x.lineJoin = x.lineCap = 'round';
    if (key === 'pom') {
      let g = x.createRadialGradient(-12, -6, 4, 0, 6, 44); g.addColorStop(0, '#FF7C7C'); g.addColorStop(.6, '#D8202F'); g.addColorStop(1, '#8E0E1D');
      x.fillStyle = '#9E1422'; x.beginPath(); x.moveTo(-10, -30); x.lineTo(-14, -42); x.lineTo(-5, -36); x.lineTo(0, -46); x.lineTo(5, -36); x.lineTo(14, -42); x.lineTo(10, -30); x.closePath(); x.fill();
      x.fillStyle = g; x.beginPath(); x.arc(0, 8, 38, 0, TAU); x.fill();
      x.fillStyle = 'rgba(255,255,255,.55)'; x.beginPath(); x.ellipse(-16, -6, 7, 12, .6, 0, TAU); x.fill();
      x.fillStyle = '#3E8E2F'; x.beginPath(); x.ellipse(18, -38, 14, 6, -.5, 0, TAU); x.fill();
    } else if (key === 'xylo') {
      x.rotate(-.25);
      const cols = ['#F2484B', '#FF9425', '#FFD23A', '#3DBE5B', '#2F8CF0', '#9A5BE6'];
      x.fillStyle = '#8A5A2B'; x.fillRect(-42, -20, 84, 6); x.fillRect(-42, 16, 84, 6);
      cols.forEach((cc, i) => { const h = 52 - i * 5, px = -38 + i * 14; x.fillStyle = cc; x.beginPath(); x.roundRect(px, -h / 2 + 1, 11, h, 3); x.fill(); x.fillStyle = 'rgba(255,255,255,.45)'; x.fillRect(px + 2, -h / 2 + 4, 3, h - 8); x.fillStyle = '#5a3a1a'; x.beginPath(); x.arc(px + 5.5, -17, 1.6, 0, TAU); x.arc(px + 5.5, 19, 1.6, 0, TAU); x.fill(); });
      x.strokeStyle = '#B07A3A'; x.lineWidth = 3.5; x.beginPath(); x.moveTo(10, -30); x.lineTo(34, -48); x.stroke();
      x.fillStyle = '#FF5FA8'; x.beginPath(); x.arc(8, -28, 6, 0, TAU); x.fill();
    } else if (key === 'kite') {
      x.strokeStyle = '#7A5A3A'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 30); x.bezierCurveTo(-20, 40, 20, 46, -4, 50); x.stroke();
      [[0, -46, 30, 0, '#FF5FA8'], [30, 0, 0, 30, '#FFB020'], [0, 30, -30, 0, '#2F8CF0'], [-30, 0, 0, -46, '#3DBE5B']].forEach(([a, b, cc, d, col]) => { x.fillStyle = col; x.beginPath(); x.moveTo(0, -4); x.lineTo(a, b); x.lineTo(cc, d); x.closePath(); x.fill(); });
      x.fillStyle = '#F2484B'; [[-4, 40], [6, 46]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(a - 6, b - 5); x.lineTo(a - 6, b + 5); x.closePath(); x.fill(); });
    } else if (key === 'yoyo') {
      x.strokeStyle = '#555'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, -48); x.lineTo(0, -6); x.stroke();
      const g = x.createRadialGradient(-8, 4, 2, 0, 10, 34); g.addColorStop(0, '#FF8A8A'); g.addColorStop(1, '#C3172A');
      x.fillStyle = g; x.beginPath(); x.arc(0, 10, 32, 0, TAU); x.fill();
      x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = 4; x.beginPath(); x.arc(0, 10, 20, 0, TAU); x.stroke();
      x.fillStyle = '#FFD23A'; x.beginPath(); x.arc(0, 10, 8, 0, TAU); x.fill();
    }
    return c;
  }
  function picFor(it) {
    for (const opt of it.e.split('|')) {
      if (opt[0] === '#') return { pic: opt.slice(1) };
      if (emojiSupported(opt)) return { emo: opt };
    }
    return { emo: it.e.split('|')[0] };
  }

  /* =====================================================================
     تحليل شكل الحرف: قناع → هيكل → خطوط كتابة مرتّبة + نقاط عيّنة
     ===================================================================== */
  const cache = {};
  let fontReady = false, fontWaiting = null;
  function ensureFont() {
    if (fontReady) return Promise.resolve();
    if (fontWaiting) return fontWaiting;
    const p = (document.fonts && document.fonts.load)
      ? Promise.all([document.fonts.load(`800 100px ${FONT_NAME}`, 'بأA'), document.fonts.load(`800 100px ${FONT_NAME}`, 'a')]).catch(() => {})
      : Promise.resolve();
    fontWaiting = Promise.race([p, new Promise(r => setTimeout(r, 2500))]).then(() => { fontReady = true; });
    return fontWaiting;
  }

  function chamfer(src, w, h, target) {
    // مسافة كل بكسل إلى أقرب بكسل قيمته = target
    const INF = 1e9, d = new Float32Array(w * h), D = 1.4142;
    for (let i = 0; i < w * h; i++) d[i] = src[i] === target ? 0 : INF;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x; let v = d[i]; if (!v) continue;
      if (x > 0) v = Math.min(v, d[i - 1] + 1);
      if (y > 0) { v = Math.min(v, d[i - w] + 1); if (x > 0) v = Math.min(v, d[i - w - 1] + D); if (x < w - 1) v = Math.min(v, d[i - w + 1] + D); }
      d[i] = v;
    }
    for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
      const i = y * w + x; let v = d[i]; if (!v) continue;
      if (x < w - 1) v = Math.min(v, d[i + 1] + 1);
      if (y < h - 1) { v = Math.min(v, d[i + w] + 1); if (x < w - 1) v = Math.min(v, d[i + w + 1] + D); if (x > 0) v = Math.min(v, d[i + w - 1] + D); }
      d[i] = v;
    }
    return d;
  }
  function thin(m, w, h) {
    const img = m.slice(), del = []; let changed = true, guard = 0;
    while (changed && guard++ < 200) {
      changed = false;
      for (let pass = 0; pass < 2; pass++) {
        del.length = 0;
        for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
          const i = y * w + x; if (!img[i]) continue;
          const p2 = img[i - w], p3 = img[i - w + 1], p4 = img[i + 1], p5 = img[i + w + 1], p6 = img[i + w], p7 = img[i + w - 1], p8 = img[i - 1], p9 = img[i - w - 1];
          const B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9; if (B < 2 || B > 6) continue;
          const A = (!p2 && p3 ? 1 : 0) + (!p3 && p4 ? 1 : 0) + (!p4 && p5 ? 1 : 0) + (!p5 && p6 ? 1 : 0) + (!p6 && p7 ? 1 : 0) + (!p7 && p8 ? 1 : 0) + (!p8 && p9 ? 1 : 0) + (!p9 && p2 ? 1 : 0);
          if (A !== 1) continue;
          if (pass === 0) { if (p2 && p4 && p6) continue; if (p4 && p6 && p8) continue; }
          else { if (p2 && p4 && p8) continue; if (p2 && p6 && p8) continue; }
          del.push(i);
        }
        for (const i of del) img[i] = 0;
        if (del.length) changed = true;
      }
    }
    return img;
  }
  const N8 = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];

  function analyze(it) {
    const key = it.a + it.c;
    if (cache[key]) return cache[key];
    const F = 200;
    // 1) رسم أولي لمعرفة حدود الحرف
    const c1 = mk(760, 420), x1 = c1.getContext('2d', { willReadFrequently: true });
    x1.font = `800 ${F}px ${FONT}`; x1.direction = 'ltr'; x1.textAlign = 'left'; x1.textBaseline = 'alphabetic';
    const draws = [];
    if (it.a === 'en') {
      const wA = x1.measureText(it.c).width;
      draws.push([it.c, 60, 290], [it.l, 60 + wA + F * .14, 290]);
    } else draws.push([it.c, 280, 280]);
    x1.fillStyle = '#000'; draws.forEach(([t, x, y]) => x1.fillText(t, x, y));
    let d = x1.getImageData(0, 0, c1.width, c1.height).data;
    let bx0 = 1e9, by0 = 1e9, bx1 = -1, by1 = -1;
    for (let y = 0; y < c1.height; y++) for (let x = 0; x < c1.width; x++) if (d[(y * c1.width + x) * 4 + 3] > 100) { if (x < bx0) bx0 = x; if (x > bx1) bx1 = x; if (y < by0) by0 = y; if (y > by1) by1 = y; }
    if (bx1 < 0) { bx0 = 0; by0 = 0; bx1 = 100; by1 = 100; }
    const bw = bx1 - bx0 + 1, bh = by1 - by0 + 1;
    // 2) إعادة الرسم بدقة التحليل
    const k = it.a === 'en' ? 150 / bh : 150 / Math.max(bw, bh), pad = 14;
    const gw = Math.ceil(bw * k + pad * 2), gh = Math.ceil(bh * k + pad * 2);
    const tx = pad - bx0 * k, ty = pad - by0 * k;
    const c2 = mk(gw, gh), x2 = c2.getContext('2d', { willReadFrequently: true });
    x2.translate(tx, ty); x2.scale(k, k);
    x2.font = `800 ${F}px ${FONT}`; x2.direction = 'ltr'; x2.textAlign = 'left'; x2.textBaseline = 'alphabetic'; x2.fillStyle = '#000';
    draws.forEach(([t, x, y]) => x2.fillText(t, x, y));
    d = x2.getImageData(0, 0, gw, gh).data;
    const N = gw * gh, mask = new Uint8Array(N);
    for (let i = 0; i < N; i++) mask[i] = d[i * 4 + 3] > 110 ? 1 : 0;
    for (let x = 0; x < gw; x++) { mask[x] = 0; mask[N - 1 - x] = 0; }
    for (let y = 0; y < gh; y++) { mask[y * gw] = 0; mask[y * gw + gw - 1] = 0; }
    const outD = chamfer(mask, gw, gh, 1);  // المسافة إلى الحرف
    const inD = chamfer(mask, gw, gh, 0);   // العمق داخل الحرف

    // 3) المكوّنات المتصلة: النقاط الصغيرة تُعامل كنقاط لمس
    const comp = new Int32Array(N).fill(-1), comps = [];
    for (let i = 0; i < N; i++) {
      if (!mask[i] || comp[i] >= 0) continue;
      const id = comps.length, q = [i]; comp[i] = id; let a = 0, sx = 0, sy = 0, x0 = 1e9, y0 = 1e9, xx1 = -1, yy1 = -1;
      while (q.length) {
        const j = q.pop(), x = j % gw, y = (j / gw) | 0; a++; sx += x; sy += y;
        if (x < x0) x0 = x; if (x > xx1) xx1 = x; if (y < y0) y0 = y; if (y > yy1) yy1 = y;
        for (const [dx, dy] of N8) { const n = j + dy * gw + dx; if (mask[n] && comp[n] < 0) { comp[n] = id; q.push(n); } }
      }
      comps.push({ id, a, cx: sx / a, cy: sy / a, w: xx1 - x0 + 1, h: yy1 - y0 + 1, x0 });
    }
    const big = Math.max(bw * k, bh * k);
    const refH = it.a === 'en' ? bh * k : big;
    comps.forEach(c => { c.dot = Math.max(c.w, c.h) < refH * .3 && c.a > 6 && c.w / c.h < 2.4 && c.h / c.w < 2.4; c.tiny = c.a <= 6; });

    // 4) الهيكل
    let sk = thin(mask, gw, gh);
    for (let i = 0; i < N; i++) if (sk[i] && (comps[comp[i]].dot || comps[comp[i]].tiny)) sk[i] = 0;
    // سُمك الخط
    const depths = []; for (let i = 0; i < N; i++) if (sk[i]) depths.push(inD[i]);
    depths.sort((a, b) => a - b);
    const sw = Math.max(6, (depths.length ? depths[(depths.length / 2) | 0] : 8) * 2);
    const strokes = buildStrokes(sk, gw, gh, sw, comp, comps, it.a);
    // النقاط
    comps.filter(c => c.dot).forEach(c => strokes.push({ dot: true, x: c.cx, y: c.cy, r: Math.max(c.w, c.h) / 2, comp: c.id, len: 0 }));
    orderStrokes(strokes, comps, it.a);
    // عيّنات للتحقق
    const samples = [], step = Math.max(3, sw * .35);
    strokes.forEach((s, si) => {
      s.si = si; s.n0 = samples.length;
      if (s.dot) { samples.push({ x: s.x, y: s.y, si, w: 3, cov: 0 }); }
      else {
        let acc = step;
        for (let i = 0; i < s.pts.length; i++) {
          if (i) acc += Math.hypot(s.pts[i][0] - s.pts[i - 1][0], s.pts[i][1] - s.pts[i - 1][1]);
          if (acc >= step || i === s.pts.length - 1) { acc = 0; samples.push({ x: s.pts[i][0], y: s.pts[i][1], si, w: 1, cov: 0 }); }
        }
      }
      s.n1 = samples.length;
    });
    const r = { it, F, k, tx, ty, gw, gh, draws, sw, strokes, samples, outD, totalW: samples.reduce((a, s) => a + s.w, 0) };
    cache[key] = r;
    return r;
  }

  function buildStrokes(sk, w, h, sw, comp, comps, alpha) {
    const N = w * h, CN = new Int8Array(N);
    const on = (x, y) => x >= 0 && y >= 0 && x < w && y < h && sk[y * w + x];
    for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
      const i = y * w + x; if (!sk[i]) continue;
      let t = 0; for (let n = 0; n < 8; n++) { const a = on(x + N8[n][0], y + N8[n][1]), b = on(x + N8[(n + 1) % 8][0], y + N8[(n + 1) % 8][1]); if (!a && b) t++; }
      let deg = 0; for (const [dx, dy] of N8) if (on(x + dx, y + dy)) deg++;
      CN[i] = deg === 0 ? 0 : t;
    }
    const isNode = i => sk[i] && CN[i] !== 2;
    // تجميع بكسلات العُقد المتجاورة
    const cl = new Int32Array(N).fill(-1), nodes = [];
    for (let i = 0; i < N; i++) {
      if (!isNode(i) || cl[i] >= 0) continue;
      const id = nodes.length, q = [i], px = []; cl[i] = id;
      while (q.length) { const j = q.pop(); px.push(j); const x = j % w, y = (j / w) | 0; if (CN[j] < 3) continue; for (const [dx, dy] of N8) { const n = j + dy * w + dx; if (isNode(n) && CN[n] >= 3 && cl[n] < 0) { cl[n] = id; q.push(n); } } }
      let sx = 0, sy = 0; px.forEach(j => { sx += j % w; sy += (j / w) | 0; });
      nodes.push({ id, x: sx / px.length, y: sy / px.length, end: px.length === 1 && CN[i] === 1, edges: [] });
    }
    const visited = new Uint8Array(N), edges = [], seen = new Set();
    const nbrs = j => { const x = j % w, y = (j / w) | 0, a = [], b = []; for (let n = 0; n < 8; n++) { const [dx, dy] = N8[n]; if (on(x + dx, y + dy)) (n % 2 ? b : a).push(j + dy * w + dx); } return a.concat(b); };
    const P = j => [j % w, (j / w) | 0];
    for (let i = 0; i < N; i++) {
      if (!isNode(i)) continue;
      for (const nb of nbrs(i)) {
        if (isNode(nb)) {
          if (cl[nb] !== cl[i]) { const kk = Math.min(cl[i], cl[nb]) + ':' + Math.max(cl[i], cl[nb]); if (!seen.has(kk)) { seen.add(kk); edges.push({ a: cl[i], b: cl[nb], pts: [P(i), P(nb)] }); } }
          continue;
        }
        if (visited[nb]) continue;
        const path = [P(i), P(nb)]; visited[nb] = 1; let prev = i, cur = nb, end = -1;
        for (let g = 0; g < 5000; g++) {
          const ns = nbrs(cur).filter(q => q !== prev);
          const nn = ns.find(q => isNode(q) && !(cl[q] === cl[i] && path.length < 4));
          if (nn !== undefined) { path.push(P(nn)); end = cl[nn]; break; }
          const nx = ns.find(q => !visited[q] && !isNode(q));
          if (nx === undefined) break;
          visited[nx] = 1; path.push(P(nx)); prev = cur; cur = nx;
        }
        edges.push({ a: cl[i], b: end, pts: path });
      }
    }
    // حلقات مغلقة بلا عُقد (مثل O)
    for (let i = 0; i < N; i++) {
      if (!sk[i] || visited[i] || isNode(i)) continue;
      const path = [P(i)]; visited[i] = 1; let cur = i;
      for (let g = 0; g < 5000; g++) { const nx = nbrs(cur).find(q => !visited[q] && !isNode(q)); if (nx === undefined) break; visited[nx] = 1; path.push(P(nx)); cur = nx; }
      if (path.length > 8) { path.push(path[0]); edges.push({ a: -1, b: -1, pts: path, loop: true }); }
    }
    // دمج التقاطعات المتلاصقة (مثل وسط X)
    const par = nodes.map((_, i) => i), fnd = i => par[i] === i ? i : (par[i] = fnd(par[i]));
    edges.forEach(e => { e.len = plen(e.pts); if (e.a >= 0 && e.b >= 0 && e.a !== e.b && !nodes[e.a].end && !nodes[e.b].end && e.len < sw * .6) { par[fnd(e.b)] = fnd(e.a); e.dead = true; } });
    edges.forEach(e => { if (e.a >= 0) e.a = fnd(e.a); if (e.b >= 0) e.b = fnd(e.b); });
    // إزالة الزوائد القصيرة
    edges.forEach((e, k) => { e.k = k; if (e.dead) return; if (e.a >= 0) nodes[e.a].edges.push(e); if (e.b >= 0 && e.b !== e.a) nodes[e.b].edges.push(e); });
    const alive = e => !e.dead;
    let pruned = true, rounds = 0;
    while (pruned && rounds++ < 3) {
      pruned = false;
      edges.forEach(e => {
        if (e.dead) return;
        const A = e.a >= 0 ? nodes[e.a] : null, B = e.b >= 0 ? nodes[e.b] : null;
        const degA = A ? A.edges.filter(alive).length : 0, degB = B ? B.edges.filter(alive).length : 0;
        const spur = (degA === 1 && degB >= 3) || (degB === 1 && degA >= 3);
        if ((spur && e.len < sw * .85) || e.len < 2.5) { e.dead = true; pruned = true; }
      });
    }
    let live = edges.filter(alive);
    // تنعيم
    live.forEach(e => { e.pts = smooth(e.pts, e.loop); e.len = plen(e.pts); });
    live = live.filter(e => e.len > sw * .3);
    // بناء الخطوط بالمشي عبر العُقد بأقل انعطاف
    const left = new Set(live);
    const score = (x, y) => alpha === 'ar' ? y - x * .55 : y * 1.0 + x * .45;
    const strokes = [];
    const degOf = n => n < 0 ? 0 : nodes[n].edges.filter(e => left.has(e)).length;
    while (left.size) {
      let best = null;
      left.forEach(e => {
        if (e.loop) return;
        [[e.a, false], [e.b, true]].forEach(([n, rev]) => {
          const d = degOf(n), p = rev ? e.pts[e.pts.length - 1] : e.pts[0];
          const s = score(p[0], p[1]) + (d === 1 || n < 0 ? 0 : 1000);
          if (!best || s < best.s) best = { e, rev, s, n };
        });
      });
      let pts;
      if (!best) {
        const e = [...left][0]; left.delete(e);
        pts = e.pts.slice(0, -1);
        let ti = 0; pts.forEach((p, i) => { if (p[1] < pts[ti][1]) ti = i; });
        pts = pts.slice(ti).concat(pts.slice(0, ti)); pts.push(pts[0]);
        if (pts[Math.min(5, pts.length - 1)][0] > pts[0][0]) pts.reverse();
        strokes.push({ pts, comp: comp[(Math.round(pts[0][1]) * w + Math.round(pts[0][0]))] });
        continue;
      }
      let e = best.e; left.delete(e); const fromJ = best.n >= 0 && nodes[best.n].edges.filter(alive).length > 1;
      pts = best.rev ? e.pts.slice().reverse() : e.pts.slice();
      let node = best.rev ? e.a : e.b;
      for (let g = 0; g < 20 && node >= 0; g++) {
        const cand = nodes[node].edges.filter(x => left.has(x));
        if (!cand.length) break;
        const L = pts.length, q = pts[Math.max(0, L - 10)], inA = Math.atan2(pts[L - 1][1] - q[1], pts[L - 1][0] - q[0]);
        let pick = null;
        cand.forEach(x => {
          const fw = x.a === node, o = fw ? x.pts : x.pts.slice().reverse();
          const r = o[Math.min(9, o.length - 1)], outA = Math.atan2(r[1] - o[0][1], r[0] - o[0][0]);
          let t = Math.abs(outA - inA); if (t > Math.PI) t = TAU - t;
          if (!pick || t < pick.t) pick = { x, o, t, nx: fw ? x.b : x.a };
        });
        if (pick.t > 1.35) break;
        left.delete(pick.x); pts = pts.concat(pick.o.slice(1)); node = pick.nx;
      }
      strokes.push({ pts, j: fromJ, comp: comp[(Math.round(pts[0][1]) * w + Math.round(pts[0][0]))] });
    }
    strokes.forEach(s => { s.len = plen(s.pts); });
    return strokes.filter(s => s.len > (s.j ? sw * 1.3 : sw * .5));
  }
  function plen(p) { let l = 0; for (let i = 1; i < p.length; i++) l += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return l; }
  function smooth(p, loop) {
    if (p.length < 5) return p.map(q => [q[0], q[1]]);
    let a = p.map(q => [q[0], q[1]]);
    for (let it = 0; it < 3; it++) {
      const b = a.map(q => [q[0], q[1]]);
      for (let i = 1; i < a.length - 1; i++) { b[i][0] = (a[i - 1][0] + a[i][0] * 2 + a[i + 1][0]) / 4; b[i][1] = (a[i - 1][1] + a[i][1] * 2 + a[i + 1][1]) / 4; }
      a = b;
    }
    // إعادة أخذ العيّنات بخطوة ثابتة
    const out = [a[0]], st = 2; let acc = 0;
    for (let i = 1; i < a.length; i++) { acc += Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]); if (acc >= st) { out.push(a[i]); acc = 0; } }
    if (out[out.length - 1] !== a[a.length - 1]) out.push(a[a.length - 1]);
    return out;
  }
  function orderStrokes(strokes, comps, alpha) {
    const compX = c => (comps[c] ? comps[c].x0 : 0);
    strokes.sort((A, B) => {
      if (A.dot !== B.dot) return A.dot ? 1 : -1;
      const a = A.dot ? [A.x, A.y] : A.pts[0], b = B.dot ? [B.x, B.y] : B.pts[0];
      if (alpha === 'en') {
        const ca = compX(A.comp), cb = compX(B.comp);
        if (Math.abs(ca - cb) > 20 && A.comp !== B.comp) return ca - cb;
        if (!A.dot && A.j !== B.j) return A.j ? 1 : -1;
        return (a[1] + a[0] * .3) - (b[1] + b[0] * .3);
      }
      return (a[1] - a[0] * .6) - (b[1] - b[0] * .6);
    });
  }

  /* =====================================================================
     الواجهة
     ===================================================================== */
  App.css(`
  #letters{background:#FFF4DE;overflow:hidden;color:#5B3A29}
  #letters canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #letters .ib{color:#D9573B}
  #letters .ib.lgrid{font-size:19px;font-weight:900}
  #letters .ib .cnt{background:#2EB5A8}
  #letters .lang{display:flex;background:rgba(255,255,255,.92);border-radius:99px;padding:3px;gap:3px;box-shadow:0 3px 0 rgba(0,0,0,.1)}
  #letters .lang button{padding:5px 12px;border-radius:99px;font-weight:900;font-size:15px;background:transparent;color:#8A5A3A;line-height:1.3}
  #letters .lang button.on{background:linear-gradient(#FF8A6B,#E8553A);color:#fff;box-shadow:0 2px 0 #B23A22}
  #letters .bot{position:absolute;left:0;right:0;bottom:0;z-index:5;display:flex;flex-direction:column;align-items:center;gap:6px;padding:0 10px max(10px,env(safe-area-inset-bottom))}
  #letters .pal{display:flex;align-items:flex-end;gap:7px;height:62px;padding-top:6px}
  #letters .cr{width:38px;height:58px;position:relative;transition:transform .2s cubic-bezier(.3,1.6,.6,1);transform:translateY(10px);filter:drop-shadow(0 3px 2px rgba(90,50,20,.25))}
  #letters .cr i{position:absolute;inset:0;clip-path:polygon(38% 0,62% 0,100% 30%,100% 100%,0 100%,0 30%);background:linear-gradient(90deg,var(--d) 0 18%,var(--c) 18% 70%,var(--l) 70% 82%,var(--c) 82%)}
  #letters .cr b{position:absolute;left:0;right:0;top:40%;height:34%;background:repeating-linear-gradient(90deg,rgba(255,255,255,.28) 0 4px,transparent 4px 8px),var(--d);border-radius:2px}
  #letters .cr.on{transform:translateY(-4px) rotate(-6deg)}
  #letters .cr.on::after{content:'';position:absolute;left:50%;bottom:-8px;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:#5B3A29}
  #letters .er{width:44px;height:44px;border-radius:14px;background:#fff;font-size:22px;display:grid;place-items:center;box-shadow:0 3px 0 #EBCFA8;margin-inline-start:4px;align-self:center}
  #letters .er:active{transform:translateY(2px)}
  #letters .nav{display:flex;gap:10px;align-items:center;width:100%;max-width:560px}
  #letters .nb{height:46px;border-radius:23px;font-size:18px;font-weight:900;padding:0 16px;background:#fff;color:#C2452B;box-shadow:0 4px 0 #EBCFA8;display:flex;align-items:center;gap:6px;white-space:nowrap}
  #letters .nb:active{transform:translateY(3px);box-shadow:0 1px 0 #EBCFA8}
  #letters .nb.next{flex:1;justify-content:center;background:linear-gradient(#FF9A6E,#EE5E3C);color:#fff;box-shadow:0 4px 0 #B8402A}
  #letters .nb.next.glow{animation:lePulse .8s ease-in-out infinite alternate}
  @keyframes lePulse{to{transform:scale(1.05);box-shadow:0 4px 0 #B8402A,0 0 22px rgba(255,140,80,.85)}}
  #letters .nb.say{width:46px;padding:0;justify-content:center;font-size:21px}
  #letters .hint{top:calc(max(10px,env(safe-area-inset-top)) + 58px);opacity:0}
  #letters .hint.on{opacity:1}
  #letters .hint span{background:#fff;color:#B23A22;box-shadow:0 3px 10px rgba(120,60,20,.2);display:inline-block;max-width:92vw}
  #letters .overlay{background:rgba(90,50,20,.38)}
  #letters .panel{border-color:#FFE2B8;box-shadow:0 8px 0 #F2C48A,0 20px 40px rgba(90,50,20,.3);color:#5B3A29;background:linear-gradient(#FFFFFF,#FFF8EC)}
  #letters .panel h3{color:#D9573B}
  #letters .btn{background:linear-gradient(#FF9A6E,#EE5E3C);box-shadow:0 4px 0 #B8402A}
  #letters .btn:active{box-shadow:0 1px 0 #B8402A}
  #letters .btn.alt{background:#fff;color:#C2452B;box-shadow:0 4px 0 #F2C48A;border-color:#FFE2B8}
  #letters .btn.teal{background:linear-gradient(#4FD1C3,#24A397);box-shadow:0 4px 0 #157A70}
  #letters .wordp{width:min(92vw,380px)}
  #letters .wordp .pic{width:150px;height:150px;margin:2px auto 0;display:grid;place-items:center;font-size:118px;line-height:1;font-family:${EMOJI_FONT};animation:leBob 2.4s ease-in-out infinite}
  #letters .wordp .pic canvas{width:140px;height:140px}
  @keyframes leBob{50%{transform:translateY(-6px) rotate(-3deg)}}
  #letters .wordp .w{font-size:54px;font-weight:900;line-height:1.25;margin:2px 0 0;color:#5B3A29;font-family:${FONT}}
  #letters .wordp .w.en{direction:ltr;font-size:48px}
  #letters .wordp .w em{font-style:normal;color:#EE5E3C;text-shadow:0 3px 0 #FFD9A8}
  #letters .wordp .ln{font-size:16px;font-weight:800;opacity:.75;margin-bottom:10px}
  #letters .gridp{width:min(94vw,470px);max-height:90vh;overflow-y:auto;touch-action:pan-y;padding:16px 12px 14px}
  #letters .gridp .lang{display:inline-flex;margin:4px auto 8px;background:#FFF0DA;box-shadow:none}
  #letters .lg{display:grid;grid-template-columns:repeat(7,1fr);gap:7px;margin:4px 0 12px}
  #letters .lg.en{direction:ltr}
  #letters .lt{position:relative;aspect-ratio:.86;border-radius:14px;background:#fff;border:2px dashed #F0C894;font-weight:900;font-size:clamp(20px,6vw,28px);color:#8A5A3A;display:grid;place-items:center;padding:0;line-height:1;font-family:${FONT}}
  #letters .lg.en .lt{font-size:clamp(16px,4.6vw,22px)}
  #letters .lt:active{transform:scale(.94)}
  #letters .lt.done{background:linear-gradient(#FFF2C6,#FFD978);border:2px solid #F2B33A;color:#B5521F}
  #letters .lt.done::after{content:'⭐';position:absolute;top:-7px;left:-5px;font-size:15px;filter:drop-shadow(0 1px 1px rgba(0,0,0,.25))}
  #letters .lt.cur{outline:3px solid #EE5E3C;outline-offset:2px}
  #letters .qz{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:10px;border-radius:18px;background:linear-gradient(#4FD1C3,#24A397);color:#fff;font-size:19px;font-weight:900;box-shadow:0 4px 0 #157A70;margin-bottom:8px}
  #letters .qz.lock{background:#EFE6D8;color:#A08A70;box-shadow:0 4px 0 #D9C9B0}
  #letters .qz small{font-size:13px;font-weight:700;opacity:.9}
  #letters .gp{font-size:14px;font-weight:800;opacity:.8;margin:0 0 6px}
  #letters .quizp{width:min(94vw,420px);padding:18px 14px 14px}
  #letters .quizp h3{font-size:26px}
  #letters .quizp .dots{display:flex;justify-content:center;gap:6px;margin:2px 0 8px}
  #letters .quizp .dots i{width:14px;height:14px;border-radius:50%;background:#F0E2CC}
  #letters .quizp .dots i.ok{background:#3DBE5B}#letters .quizp .dots i.no{background:#F2484B}#letters .quizp .dots i.cur{background:#FFB020;transform:scale(1.25)}
  #letters .qg{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:8px 0 12px}
  #letters .qt{aspect-ratio:1.15;border-radius:22px;background:#fff;border:3px solid #FFE2B8;box-shadow:0 5px 0 #F2C48A;font-size:64px;font-weight:900;color:#5B3A29;display:grid;place-items:center;line-height:1;font-family:${FONT};transition:background .2s}
  #letters .qt.en{direction:ltr;font-size:50px}
  #letters .qt:active{transform:translateY(3px)}
  #letters .qt.ok{background:#D8F7DE;border-color:#3DBE5B;color:#1F8A3B;animation:pop .4s cubic-bezier(.3,1.8,.6,1)}
  #letters .qt.no{background:#FFE1DE;border-color:#F2484B;animation:leShake .4s}
  @keyframes leShake{20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
  #letters .qsay{display:inline-grid;place-items:center;width:46px;height:46px;border-radius:50%;background:#FFF0DA;font-size:22px;vertical-align:middle;margin-inline-start:6px}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lgrid" aria-label="كل الحروف">🔤<span class="cnt">0</span></button>
      <span class="grow"></span>
      <div class="lang top"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="hint"><span class="hintT"></span></div>
    <div class="bot">
      <div class="pal">${COLORS.map((c, i) => `<button class="cr" data-c="${i}" aria-label="${c.n}" style="--c:${c.c};--d:${c.d};--l:${c.l}"><i></i><b></b></button>`).join('')}
        <button class="er" aria-label="امسح">🧽</button></div>
      <div class="nav">
        <button class="nb prev" aria-label="السابق">▶</button>
        <button class="nb say" aria-label="اسمع">🔊</button>
        <button class="nb next" data-ar="التالي ◀" data-en="Next ▶">التالي ◀</button>
      </div>
    </div>
    <div class="overlay" id="leWord"><div class="panel wordp"></div></div>
    <div class="overlay" id="leGrid"><div class="panel gridp"></div></div>
    <div class="overlay" id="leQuiz"><div class="panel quizp"></div></div>`);
  const cv = root.querySelector('canvas.sc');
  const bar = root.querySelector('.bar'), bot = root.querySelector('.bot');
  const hintEl = root.querySelector('.hint'), hintT = root.querySelector('.hintT');
  const cntEl = root.querySelector('.lgrid .cnt'), nextBtn = root.querySelector('.nb.next');
  const wordOv = root.querySelector('#leWord'), wordP = wordOv.querySelector('.panel');
  function relabel() {
    root.querySelectorAll('[data-ar]').forEach(el => { el.textContent = App.t(el.dataset.ar, el.dataset.en); });
    root.querySelector('.nb.prev').textContent = App.t('▶', '◀');
    [['.home', 'الرئيسية', 'Home'], ['.helpbtn', 'مساعدة', 'Help'], ['.lgrid', 'كل الحروف', 'All letters'], ['.er', 'امسح', 'Erase'], ['.nb.prev', 'السابق', 'Previous'], ['.nb.say', 'اسمع', 'Listen']]
      .forEach(([q, a, e]) => root.querySelectorAll(q).forEach(b => b.setAttribute('aria-label', App.t(a, e))));
    root.querySelectorAll('.cr').forEach((b, i) => b.setAttribute('aria-label', App.t(COLORS[i].n, COLORS[i].e)));
  }
  const gridOv = root.querySelector('#leGrid'), gridP = gridOv.querySelector('.panel');
  const quizOv = root.querySelector('#leQuiz'), quizP = quizOv.querySelector('.panel');
  const crs = [...root.querySelectorAll('.cr')];

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let alpha = 'ar', idx = { ar: 0, en: 0 }, color = 0;
  let A = null;              // تحليل الحرف الحالي
  let card = { x: 0, y: 0, w: 0, h: 0 }, gs = 1, gox = 0, goy = 0;
  let ink = [], curInk = null, pid = null, inPts = 0, outPts = 0;
  let done = false, doneT = 0, wordTimer = 0, idleT = 0, letterT = 0, shake = 0, lastScratch = 0;
  let parts = [], strokeDone = [], hintTimer = 0;
  let bgLayer = null, inkCv = null, inkCtx = null, fillCv = null, fillCtx = null, brushes = [];
  let quiz = null;

  const curSet = () => SETS[alpha];
  const curIt = () => curSet()[idx[alpha]];

  /* ---------- طبقات مرسومة مسبقًا ---------- */
  function bakeBrushes() {
    brushes = COLORS.map(col => {
      const S = 64, c = mk(S, S), x = c.getContext('2d');
      const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      g.addColorStop(0, col.c); g.addColorStop(.8, col.c); g.addColorStop(1, col.c + '00');
      x.fillStyle = g; x.beginPath(); x.arc(S / 2, S / 2, S / 2, 0, TAU); x.fill();
      // حبيبات الشمع
      const id = x.getImageData(0, 0, S, S), d = id.data;
      for (let i = 0; i < d.length; i += 4) { const n = Math.random(); if (n < .08) d[i + 3] *= .5; else if (n < .2) d[i + 3] *= .82; }
      x.putImageData(id, 0, 0);
      x.globalCompositeOperation = 'source-atop';
      x.strokeStyle = col.d; x.globalAlpha = .25; x.lineWidth = 1;
      for (let i = 0; i < 9; i++) { const yy = rand(4, S - 4); x.beginPath(); x.moveTo(0, yy); x.lineTo(S, yy + rand(-6, 6)); x.stroke(); }
      x.fillStyle = col.l; x.globalAlpha = .35; for (let i = 0; i < 14; i++) { x.beginPath(); x.arc(rand(8, S - 8), rand(8, S - 8), rand(1, 2.4), 0, TAU); x.fill(); }
      return c;
    });
  }
  function bakeBg() {
    bgLayer = mk(W * dpr, H * dpr); const x = bgLayer.getContext('2d'); x.scale(dpr, dpr);
    let g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#FFF6E4'); g.addColorStop(1, '#FCE7C8');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // سطور الدفتر
    x.strokeStyle = 'rgba(120,170,220,.32)'; x.lineWidth = 1.5;
    for (let y = 92; y < H; y += 30) { x.beginPath(); x.moveTo(0, y); x.lineTo(W, y); x.stroke(); }
    x.strokeStyle = 'rgba(240,110,110,.45)'; x.lineWidth = 2;
    x.beginPath(); x.moveTo(W - 34, 0); x.lineTo(W - 34, H); x.stroke(); x.beginPath(); x.moveTo(W - 39, 0); x.lineTo(W - 39, H); x.stroke();
    // ثقوب
    for (let y = 120; y < H - 40; y += 110) {
      x.fillStyle = 'rgba(160,110,60,.14)'; x.beginPath(); x.arc(14, y + 1.5, 7, 0, TAU); x.fill();
      x.fillStyle = '#F2DDBB'; x.beginPath(); x.arc(14, y, 7, 0, TAU); x.fill();
    }
    // رسومات صغيرة
    const doodle = [['#FFB0C8', 'heart'], ['#9ED8F5', 'star'], ['#FFD47A', 'star'], ['#B7E4A5', 'circ'], ['#D6C1FF', 'heart']];
    for (let i = 0; i < 14; i++) {
      const [c, t] = doodle[i % doodle.length], px = rand(24, W - 50), py = rand(70, H - 20);
      x.save(); x.translate(px, py); x.rotate(rand(-.5, .5)); x.globalAlpha = .55; x.strokeStyle = c; x.fillStyle = c; x.lineWidth = 2.4;
      if (t === 'star') { starPath(x, rand(7, 11)); x.stroke(); }
      else if (t === 'heart') { const r = rand(6, 9); x.beginPath(); x.moveTo(0, r * .9); x.bezierCurveTo(-r * 1.4, 0, -r * .65, -r * 1.1, 0, -r * .42); x.bezierCurveTo(r * .65, -r * 1.1, r * 1.4, 0, 0, r * .9); x.fill(); }
      else { x.beginPath(); x.arc(0, 0, rand(4, 7), 0, TAU); x.stroke(); }
      x.restore();
    }
    // الورقة
    const { x: cx, y: cy, w: cw, h: ch } = card;
    x.save(); x.shadowColor = 'rgba(120,70,20,.22)'; x.shadowBlur = 18; x.shadowOffsetY = 8;
    x.fillStyle = '#FFFDF7'; x.beginPath(); x.roundRect(cx, cy, cw, ch, 26); x.fill(); x.restore();
    x.save(); x.beginPath(); x.roundRect(cx, cy, cw, ch, 26); x.clip();
    // شبكة نقاط ناعمة
    x.fillStyle = 'rgba(230,190,140,.35)';
    for (let yy = cy + 18; yy < cy + ch; yy += 22) for (let xx = cx + 18; xx < cx + cw; xx += 22) { x.beginPath(); x.arc(xx, yy, 1.3, 0, TAU); x.fill(); }
    g = x.createLinearGradient(0, cy, 0, cy + 60); g.addColorStop(0, 'rgba(255,214,160,.35)'); g.addColorStop(1, 'rgba(255,214,160,0)');
    x.fillStyle = g; x.fillRect(cx, cy, cw, 60);
    x.restore();
    x.strokeStyle = '#F4D9B0'; x.lineWidth = 3; x.setLineDash([10, 7]); x.beginPath(); x.roundRect(cx + 8, cy + 8, cw - 16, ch - 16, 20); x.stroke(); x.setLineDash([]);
    // شريط لاصق
    [[cx + 26, cy - 4, -.35, '#FFD9A0'], [cx + cw - 26, cy - 4, .35, '#B9E6E0']].forEach(([px, py, r, c]) => {
      x.save(); x.translate(px, py); x.rotate(r); x.globalAlpha = .82; x.fillStyle = c; x.fillRect(-30, -11, 60, 22);
      x.globalAlpha = .4; x.fillStyle = '#fff'; x.fillRect(-30, -11, 60, 5); x.restore();
    });
  }

  function layout() {
    const r = fitCanvas(cv); ctx = r.ctx; W = r.w; H = r.h; dpr = r.dpr;
    const top = bar.offsetHeight + 4, bh = bot.offsetHeight + 6;
    const cw = Math.min(W - 24, 640), ch = Math.max(160, H - top - bh - 4);
    card = { x: (W - cw) / 2, y: top, w: cw, h: Math.min(ch, Math.max(cw * 1.35, 300)) };
    card.y = top + Math.max(0, (ch - card.h) / 2);
    bakeBg();
    hintEl.style.top = (card.y + card.h - 46) + 'px';
    inkCv = mk(W * dpr, H * dpr); inkCtx = inkCv.getContext('2d'); inkCtx.scale(dpr, dpr);
    fillCv = mk(W * dpr, H * dpr); fillCtx = fillCv.getContext('2d');
    fitGlyph(); redrawInk();
  }
  function fitGlyph() {
    if (!A) return;
    const ax = card.x + 16, ay = card.y + 64, aw = card.w - 32, ah = card.h - 64 - 18;
    gs = Math.min(aw / A.gw, ah / A.gh, A.it.a === 'en' ? 5 : 4.2);
    gox = ax + (aw - A.gw * gs) / 2; goy = ay + (ah - A.gh * gs) / 2;
  }
  const toG = (px, py) => [(px - gox) / gs, (py - goy) / gs];
  const toS = (gx, gy) => [gox + gx * gs, goy + gy * gs];
  const brushR = () => clamp(A.sw * gs * .5, 9, 40);

  /* ---------- الحبر ---------- */
  function stamp(x, y, col) {
    const r = brushR(), b = brushes[col];
    inkCtx.save(); inkCtx.translate(x, y); inkCtx.rotate(Math.random() * TAU);
    inkCtx.drawImage(b, -r, -r, r * 2, r * 2); inkCtx.restore();
    if (Math.random() < .14) { // لمعان دائم
      inkCtx.fillStyle = Math.random() < .5 ? 'rgba(255,255,255,.9)' : 'rgba(255,236,150,.95)';
      inkCtx.save(); inkCtx.translate(x + rand(-r, r) * .6, y + rand(-r, r) * .6); starPath(inkCtx, rand(1.6, 3.2), .4); inkCtx.fill(); inkCtx.restore();
    }
  }
  function inkSeg(p0, p1, col) {
    const [x0, y0] = toS(p0[0], p0[1]), [x1, y1] = toS(p1[0], p1[1]);
    const d = Math.hypot(x1 - x0, y1 - y0), st = Math.max(1.5, brushR() * .28), n = Math.max(1, Math.ceil(d / st));
    for (let i = 1; i <= n; i++) stamp(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, col);
  }
  function redrawInk() {
    if (!inkCtx) return;
    inkCtx.clearRect(0, 0, W, H);
    if (!A) return;
    ink.forEach(s => { if (s.p.length === 1) { const [x, y] = toS(s.p[0][0], s.p[0][1]); stamp(x, y, s.c); } for (let i = 1; i < s.p.length; i++) inkSeg(s.p[i - 1], s.p[i], s.c); });
  }

  /* ---------- التغطية ---------- */
  function coverAt(gx, gy) {
    const R = A.sw * .75 + 3;
    const rr = R * R;
    let newly = false;
    for (const s of A.samples) {
      if (s.cov) continue;
      const st = A.strokes[s.si], lim = st.dot ? (st.r + A.sw * .6 + 4) ** 2 : rr;
      const dx = s.x - gx, dy = s.y - gy;
      if (dx * dx + dy * dy <= lim) { s.cov = 1; newly = true; }
    }
    const xi = Math.round(gx), yi = Math.round(gy);
    const dd = (xi < 0 || yi < 0 || xi >= A.gw || yi >= A.gh) ? 1e9 : A.outD[yi * A.gw + xi];
    if (dd <= A.sw * .55 + 2) inPts++; else outPts++;
    if (newly) checkStrokes();
  }
  function coverage() { let c = 0; for (const s of A.samples) if (s.cov) c += s.w; return A.totalW ? c / A.totalW : 0; }
  function strokeCov(st) { let c = 0, n = 0; for (let i = st.n0; i < st.n1; i++) { n++; if (A.samples[i].cov) c++; } return n ? c / n : 1; }
  function checkStrokes() {
    A.strokes.forEach((st, i) => {
      if (strokeDone[i]) return;
      if (strokeCov(st) >= (st.dot ? 1 : .8)) {
        strokeDone[i] = 1;
        const p = st.dot ? [st.x, st.y] : st.pts[st.pts.length - 1], [sx, sy] = toS(p[0], p[1]);
        burst(sx, sy, 10, COLORS[color].c);
        Sound.tone(520 + i * 120, .14, 'triangle', .14, 300); vibrate(12);
      }
    });
  }
  const curStroke = () => { if (!A) return -1; for (let i = 0; i < A.strokes.length; i++) if (!strokeDone[i]) return i; return -1; };

  /* ---------- الانتقال بين الحروف ---------- */
  function setLetter(i, speak = true) {
    const set = curSet();
    idx[alpha] = (i + set.length) % set.length;
    saveState();
    A = null; ink = []; curInk = null; pid = null; done = false; doneT = 0; inPts = outPts = 0; strokeDone = []; parts = []; letterT = 0; idleT = 0;
    clearTimeout(wordTimer); nextBtn.classList.remove('glow');
    const it = curIt();
    ensureFont().then(() => {
      if (curIt() !== it) return;
      A = analyze(it);
      A.samples.forEach(s => { s.cov = 0; });
      strokeDone = A.strokes.map(() => 0);
      fitGlyph(); redrawInk();
    });
    if (speak) setTimeout(() => { if (App.current === ID && curIt() === it) sayName(it); }, 250);
    updateUI();
  }
  function saveState() { store.set('lettersPos', { alpha, ar: idx.ar, en: idx.en, color }); }
  function updateUI() {
    root.querySelectorAll('.lang.top button').forEach(b => b.classList.toggle('on', b.dataset.l === alpha));
    crs.forEach((b, i) => b.classList.toggle('on', i === color));
    const p = loadProg(); cntEl.textContent = countOf(p, alpha);
  }
  function clearInk() {
    if (!A || done) return;
    ink = []; curInk = null; inPts = outPts = 0; A.samples.forEach(s => { s.cov = 0; }); strokeDone = A.strokes.map(() => 0);
    redrawInk(); Sound.whoosh(); idleT = 0;
  }
  function hint(t, ms = 2200) { hintT.textContent = t; hintEl.classList.add('on'); clearTimeout(hintTimer); hintTimer = setTimeout(() => hintEl.classList.remove('on'), ms); }

  function tryComplete(force) {
    if (!A || done) return;
    const cov = coverage();
    const inR = inPts + outPts ? inPts / (inPts + outPts) : 1;
    if (cov >= .97 || (force && cov >= .8)) {
      if (inR < .5) { hint('✋ ' + App.t(App.g('حاولي', 'حاول') + ' أن ' + App.g('تبقي', 'تبقى') + ' على الحرف، ثم ' + App.g('امسحي', 'امسح') + ' 🧽 ' + App.g('وأعيدي', 'وأعد'), 'Try to stay on the letter, then erase 🧽 and try again')); Sound.error(); return; }
      complete();
    } else if (force && cov > .45 && cov < .8) {
      const ci = curStroke();
      if (ci >= 0) hint('👉 ' + App.t(App.g('أكملي', 'أكمل') + ' الخط رقم ' + (ci + 1), 'Finish line number ' + (ci + 1)), 1600);
    }
  }
  function complete() {
    done = true; doneT = 0; shake = 6;
    const it = curIt(), p = loadProg(), first = !p[alpha][it.c];
    Sound.win(); vibrate(30);
    sayName(it);
    for (const s of A.samples) { if (Math.random() < .5) { const [x, y] = toS(s.x, s.y); burst(x, y, 2, COLORS[color].c); } }
    const cx = card.x + card.w / 2, cy = card.y + card.h / 2;
    for (let i = 0; i < 40; i++) { const a = rand(0, TAU), v = rand(160, 520); parts.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, life: rand(.9, 1.6), t: 0, s: rand(5, 11), c: ['#FFD23A', '#FF6B5B', '#2EB5A8', '#9A5BE6', '#FF5FA8', '#3DBE5B'][i % 6], k: i % 3 ? 'star' : 'conf', r: rand(0, TAU), vr: rand(-8, 8) }); }
    if (first) {
      p[alpha][it.c] = 1; store.set('lettersProg', p);
      setTimeout(() => App.addStars(1), 500);
      App.achieve('let_first');
      if (countOf(p, 'ar') >= AR.length) App.achieve('let_ar');
      if (countOf(p, 'en') >= EN.length) App.achieve('let_en');
      if (countOf(p, alpha) === QUIZ_UNLOCK) setTimeout(() => App.toast('🎯 ' + App.t('فُتحت لعبة «أين حرف…؟»', 'Unlocked: «Where is the letter…?»')), 1800);
    }
    updateUI();
    nextBtn.classList.add('glow');
    wordTimer = setTimeout(showWord, 1700);
  }

  /* ---------- بطاقة الكلمة ---------- */
  function wordHTML(it) {
    if (it.a === 'en') return `<span class="w en"><em>${it.w[0]}</em>${it.w.slice(1)}</span>`;
    const f = it.w[0], rest = it.w.slice(1), j = JOIN.includes(f) ? '‍' : '';
    return `<span class="w"><em>${f}${j}</em>${j}${rest}</span>`;
  }
  function showWord() {
    if (App.current !== ID || !done) return;
    const it = curIt(), pic = picFor(it);
    wordP.innerHTML = `<h3>${App.t(App.g('أحسنتِ', 'أحسنت'), 'Well done')}! 🌟</h3>
      <div class="pic">${pic.emo ? pic.emo : ''}</div>
      <div>${wordHTML(it)}</div>
      <div class="ln">${App.lang === 'en'
        ? (it.a === 'ar' ? `<bdi>${it.w}</bdi> starts with the letter <bdi>${it.n}</bdi> «<bdi>${it.c}</bdi>»` : `${it.w} starts with the letter ${it.c}`)
        : (it.a === 'ar' ? `${it.w} تبدأ بحرف ${it.n} «${it.c}»` : `<bdi>${it.w}</bdi> تبدأ بحرف <bdi>${it.c}</bdi>`)}</div>
      <button class="btn alt" data-a="say">🔊</button><button class="btn alt" data-a="again">🔁 ${App.t('مرة أخرى', 'Again')}</button>
      <button class="btn" data-a="next">${App.t('التالي ◀', 'Next ▶')}</button>`;
    if (pic.pic) { const c = drawPic(pic.pic, 280); wordP.querySelector('.pic').appendChild(c); }
    wordP.querySelector('.w').classList.toggle('en', it.a === 'en');
    wordOv.classList.add('on');
    Sound.pop();
    setTimeout(() => { if (wordOv.classList.contains('on')) sayWord(it); }, 900);
  }
  wordP.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; const it = curIt();
    Sound.tap();
    if (b.dataset.a === 'say') sayWord(it);
    else if (b.dataset.a === 'again') { wordOv.classList.remove('on'); setLetter(idx[alpha], false); }
    else if (b.dataset.a === 'next') { wordOv.classList.remove('on'); goNext(); }
  });
  function goNext() {
    const set = curSet(), p = loadProg();
    let n = idx[alpha] + 1;
    setLetter(n);
    Sound.slide();
  }

  /* ---------- شبكة الحروف ---------- */
  function openGrid() {
    const p = loadProg(), n = countOf(p, alpha), set = curSet();
    gridP.innerHTML = `<h3>🔤 ${App.t('حروفي', 'My Letters')}</h3>
      <div class="lang"><button data-l="ar" class="${alpha === 'ar' ? 'on' : ''}">عربي</button><button data-l="en" class="${alpha === 'en' ? 'on' : ''}">English</button></div>
      <p class="gp">⭐ ${n} ${App.t('من', 'of')} ${set.length}</p>
      <div class="lg ${alpha}">${set.map((it, i) => `<button class="lt ${p[alpha][it.c] ? 'done' : ''} ${i === idx[alpha] ? 'cur' : ''}" data-i="${i}">${alpha === 'en' ? it.c + it.l : it.c}</button>`).join('')}</div>
      ${n >= QUIZ_UNLOCK ? `<button class="qz" data-a="quiz">🎯 ${App.t('أين حرف…؟', 'Where is the letter…?')}</button>` : `<button class="qz lock" data-a="lock">🔒 ${App.t('أين حرف…؟', 'Where is the letter…?')} <small>(${App.t(`${App.g('تتبّعي', 'تتبّع')} ${QUIZ_UNLOCK - n} ${QUIZ_UNLOCK - n > 2 ? 'حروف' : 'حرفًا'} أخرى`, `trace ${QUIZ_UNLOCK - n} more ${QUIZ_UNLOCK - n === 1 ? 'letter' : 'letters'}`)})</small></button>`}
      <button class="btn alt" data-a="close">✕ ${App.t('إغلاق', 'Close')}</button>`;
    gridOv.classList.add('on');
  }
  gridP.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.l) { if (b.dataset.l !== alpha) { Sound.tap(); store.set(ID + 'Lang', b.dataset.l); switchAlpha(b.dataset.l, false); openGrid(); } return; }
    if (b.dataset.i != null) { Sound.pop(); gridOv.classList.remove('on'); wordOv.classList.remove('on'); setLetter(+b.dataset.i); return; }
    if (b.dataset.a === 'close') { Sound.tap(); gridOv.classList.remove('on'); }
    else if (b.dataset.a === 'lock') { Sound.error(); b.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], { duration: 300 }); }
    else if (b.dataset.a === 'quiz') { Sound.tap(); gridOv.classList.remove('on'); startQuiz(); }
  });
  function switchAlpha(a, speak = true) {
    if (a === alpha) return;
    alpha = a; wordOv.classList.remove('on');
    setLetter(idx[alpha], speak);
  }

  /* ---------- اختبار «أين حرف…؟» ---------- */
  function startQuiz() {
    const p = loadProg(), set = curSet();
    const traced = set.filter(it => p[alpha][it.c]);
    const qs = shuffle(traced.slice()).slice(0, QUIZ_N);
    while (qs.length < QUIZ_N) qs.push(traced[(Math.random() * traced.length) | 0]);
    quiz = { a: alpha, qs, i: 0, res: [], wrong: false, lock: false };
    quizOv.classList.add('on'); showQ();
  }
  function promptQ(it) {
    if (it.a === 'ar') App.speak('أين حرف ال' + it.n + '؟'); else speakEn('Where is the letter ' + it.c + '?');
  }
  function showQ() {
    const q = quiz, it = q.qs[q.i], set = SETS[q.a];
    const others = shuffle(set.filter(x => x !== it)).slice(0, 3);
    q.opts = shuffle([it, ...others]); q.wrong = false; q.lock = false;
    quizP.innerHTML = `<h3>🎯 ${q.a === 'ar' ? 'أين حرف ال' + it.n + '؟' : 'Where is the letter ' + it.c + '?'} <button class="qsay" data-a="say" aria-label="${App.t('اسمع', 'Listen')}">🔊</button></h3>
      <div class="dots">${q.qs.map((_, i) => `<i class="${i < q.i ? (q.res[i] ? 'ok' : 'no') : i === q.i ? 'cur' : ''}"></i>`).join('')}</div>
      <div class="qg">${q.opts.map((o, i) => `<button class="qt ${q.a}" data-i="${i}">${q.a === 'en' ? o.c + o.l : o.c}</button>`).join('')}</div>
      <button class="btn alt" data-a="close">✕ ${App.t('إنهاء', 'Finish')}</button>`;
    setTimeout(() => { if (quiz === q) promptQ(it); }, 250);
  }
  quizP.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || !quiz) return;
    const q = quiz, it = q.qs[q.i];
    if (b.dataset.a === 'say') { promptQ(it); return; }
    if (b.dataset.a === 'close') { Sound.tap(); quizOv.classList.remove('on'); quiz = null; return; }
    if (b.dataset.a === 'again') { Sound.tap(); startQuiz(); return; }
    if (b.dataset.i == null || q.lock) return;
    const o = q.opts[+b.dataset.i];
    if (o === it) {
      q.lock = true; b.classList.add('ok'); Sound.star ? Sound.star() : Sound.coin(); vibrate(15);
      q.res[q.i] = !q.wrong;
      setTimeout(() => sayName(it), 150);
      setTimeout(() => { if (quiz !== q) return; q.i++; if (q.i >= q.qs.length) endQuiz(); else showQ(); }, 1100);
    } else {
      q.wrong = true; b.classList.remove('no'); void b.offsetWidth; b.classList.add('no'); Sound.error(); vibrate(25);
      setTimeout(() => sayName(o), 100);
    }
  });
  function endQuiz() {
    const q = quiz, ok = q.res.filter(Boolean).length, st = ok >= 5 ? 3 : ok >= 3 ? 2 : 1;
    const best = store.get('lettersQuiz', 0);
    if (ok > best) store.set('lettersQuiz', ok);
    quizP.innerHTML = `<h3>${ok >= 4 ? App.t(App.g('رائعة', 'رائع'), 'Awesome') + '! 🎉' : App.t(App.g('أحسنتِ', 'أحسنت'), 'Well done') + '! 👏'}</h3>
      <div class="stars3">${[0, 1, 2].map(i => `<span class="${i < st ? '' : 'off'}">⭐</span>`).join('')}</div>
      <div class="big">${ok} / ${q.qs.length}</div><p>${App.t('إجابات صحيحة من أول مرة', 'right on the first try')}</p>
      <button class="btn teal" data-a="again">🔁 ${App.t('مرة أخرى', 'Again')}</button><button class="btn alt" data-a="close">✕ ${App.t('إغلاق', 'Close')}</button>`;
    Sound.win();
    if (ok >= 3) App.addStars(ok >= 5 ? 2 : 1);
  }

  /* ---------- الإدخال ---------- */
  cv.addEventListener('pointerdown', e => {
    if (paused || !A || pid !== null) return;
    const px = e.offsetX, py = e.offsetY;
    if (px < card.x || px > card.x + card.w || py < card.y || py > card.y + card.h) return;
    if (done) { Sound.pop(); sayName(curIt()); burst(px, py, 8, COLORS[color].c); return; }
    pid = e.pointerId; try { cv.setPointerCapture(pid); } catch (er) {}
    const g = toG(px, py);
    curInk = { c: color, p: [g] }; ink.push(curInk);
    stamp(px, py, color); coverAt(g[0], g[1]); idleT = 0;
    Sound.tone(700, .05, 'sine', .05);
  });
  cv.addEventListener('pointermove', e => {
    if (e.pointerId !== pid || !curInk) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of (evs.length ? evs : [e])) {
      const g = toG(ev.offsetX, ev.offsetY), lp = curInk.p[curInk.p.length - 1];
      const d = Math.hypot(g[0] - lp[0], g[1] - lp[1]);
      if (d * gs < 2) continue;
      // عيّنات بينية للتغطية
      const n = Math.max(1, Math.ceil(d / 2));
      for (let i = 1; i <= n; i++) coverAt(lp[0] + (g[0] - lp[0]) * i / n, lp[1] + (g[1] - lp[1]) * i / n);
      inkSeg(lp, g, color); curInk.p.push(g);
      if (Math.random() < .35) { const [sx, sy] = toS(g[0], g[1]); parts.push({ x: sx + rand(-8, 8), y: sy + rand(-8, 8), vx: rand(-30, 30), vy: rand(-60, -10), life: rand(.4, .8), t: 0, s: rand(2.5, 5), c: Math.random() < .5 ? '#FFFFFF' : '#FFE27A', k: 'glit', r: rand(0, TAU), vr: rand(-4, 4) }); }
    }
    const now = performance.now();
    if (now - lastScratch > 70 && sfxOn()) { lastScratch = now; Sound.noise(.05, 1600, 3200, .025, 2); }
    if (coverage() >= .97) { endStroke(); }
  });
  function endStroke() {
    if (pid !== null) { try { cv.releasePointerCapture(pid); } catch (er) {} }
    pid = null; curInk = null; idleT = 0;
    tryComplete(true);
  }
  cv.addEventListener('pointerup', e => { if (e.pointerId === pid) endStroke(); });
  cv.addEventListener('pointercancel', e => { if (e.pointerId === pid) endStroke(); });

  bar.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('lgrid')) { Sound.tap(); openGrid(); }
    else if (b.dataset.l) { Sound.tap(); store.set(ID + 'Lang', b.dataset.l); switchAlpha(b.dataset.l); }
  });
  bot.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('cr')) { color = +b.dataset.c; saveState(); updateUI(); Sound.tone(500 + color * 70, .08, 'triangle', .12); vibrate(8); }
    else if (b.classList.contains('er')) clearInk();
    else if (b.classList.contains('say')) { if (curIt()) sayName(curIt()); Sound.tap(); }
    else if (b.classList.contains('prev')) { Sound.slide(); setLetter(idx[alpha] - 1); }
    else if (b.classList.contains('next')) { wordOv.classList.remove('on'); goNext(); }
  });
  window.addEventListener('keydown', e => {
    if (App.current !== ID || paused || $('#sheetWrap').classList.contains('on')) return;
    if (quizOv.classList.contains('on') || gridOv.classList.contains('on')) return;
    if (e.key === 'ArrowLeft') { wordOv.classList.remove('on'); goNext(); }
    else if (e.key === 'ArrowRight') { wordOv.classList.remove('on'); setLetter(idx[alpha] - 1); }
    else if (e.key === ' ') { e.preventDefault(); sayName(curIt()); }
    else if (e.key === 'Delete' || e.key === 'Backspace') clearInk();
  });
  window.addEventListener('resize', () => { if (App.current === ID) layout(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) last = performance.now(); });

  /* ---------- جسيمات ---------- */
  function burst(x, y, n, c) {
    for (let i = 0; i < n; i++) { const a = rand(0, TAU), v = rand(60, 240); parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 40, life: rand(.5, 1), t: 0, s: rand(3, 7), c: i % 3 ? c : '#FFE27A', k: 'star', r: rand(0, TAU), vr: rand(-6, 6) }); }
  }

  /* ---------- الحلقة ---------- */
  function startLoop() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); }
  function stopLoop() { running = false; cancelAnimationFrame(raf); }
  function loop(now) {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    let dt = Math.min(.05, (now - last) / 1000); last = now;
    if (paused || document.hidden) return;
    T += dt; letterT += dt; idleT += dt;
    if (done) doneT += dt;
    shake *= Math.pow(.02, dt);
    parts = parts.filter(p => (p.t += dt) < p.life);
    parts.forEach(p => { p.x += p.vx * dt; p.y += p.vy * dt; if (p.k !== 'glit') p.vy += 520 * dt; p.vx *= .985; p.r += p.vr * dt; });
    render();
  }

  function glyphPath(c, fill) {
    c.save(); c.translate(gox, goy); c.scale(gs, gs); c.translate(A.tx, A.ty); c.scale(A.k, A.k);
    c.font = `800 ${A.F}px ${FONT}`; c.direction = 'ltr'; c.textAlign = 'left'; c.textBaseline = 'alphabetic';
    c.fillStyle = fill; A.draws.forEach(([t, x, y]) => c.fillText(t, x, y));
    c.restore();
  }
  function strokeAt(st, d) { // نقطة واتجاه على مسافة d من بداية الخط
    const p = st.pts; let acc = 0;
    for (let i = 1; i < p.length; i++) {
      const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
      if (acc + l >= d) { const t = (d - acc) / (l || 1); return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * t, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * t, Math.atan2(p[i][1] - p[i - 1][1], p[i][0] - p[i - 1][0])]; }
      acc += l;
    }
    const n = p.length - 1; return [p[n][0], p[n][1], Math.atan2(p[n][1] - p[Math.max(0, n - 1)][1], p[n][0] - p[Math.max(0, n - 1)][0])];
  }

  function render() {
    const c = ctx; if (!c) return;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);
    if (bgLayer) c.drawImage(bgLayer, 0, 0, W, H);
    const sx = shake > .3 ? rand(-shake, shake) : 0, sy = shake > .3 ? rand(-shake, shake) : 0;
    c.save(); c.translate(sx, sy);
    const it = curIt();
    // اسم الحرف
    const pillW = Math.min(card.w - 90, 240), px = card.x + card.w / 2;
    c.save(); c.translate(px, card.y + 34);
    const bounce = 1 + Math.max(0, .25 * Math.sin(Math.min(1, letterT * 2.5) * Math.PI) * (1 - Math.min(1, letterT * 2.5)));
    c.scale(bounce, bounce);
    c.fillStyle = '#FFE9C9'; c.beginPath(); c.roundRect(-pillW / 2, -19, pillW, 38, 19); c.fill();
    c.fillStyle = '#C2452B'; c.font = `900 21px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.direction = it.a === 'en' ? 'ltr' : 'rtl';
    c.fillText(it.a === 'ar' ? `${it.c}  ·  ${it.n}` : `${it.c} ${it.l}  ·  ${it.w}`, 0, 1);
    c.restore();
    if (!A) { c.fillStyle = '#C9A57A'; c.font = `800 22px ${FONT}`; c.textAlign = 'center'; c.fillText('…', card.x + card.w / 2, card.y + card.h / 2); c.restore(); drawParts(c); return; }

    const pop = Math.min(1, letterT * 3), gsc = .85 + .15 * ease.outBack(pop);
    const gcx = gox + A.gw * gs / 2, gcy = goy + A.gh * gs / 2;
    c.save(); c.translate(gcx, gcy); c.scale(gsc, gsc); c.translate(-gcx, -gcy);
    // ظلّ الحرف الباهت
    glyphPath(c, done ? 'rgba(240,215,180,.55)' : '#F4E9DA');
    // الحبر
    if (inkCv) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = done ? Math.max(.25, 1 - doneT * 1.2) : 1; c.drawImage(inkCv, sx * dpr, sy * dpr); c.restore(); }
    if (!done) drawGuide(c);
    else drawFill(c);
    c.restore();
    c.restore();
    drawParts(c);
  }

  function drawGuide(c) {
    const cur = curStroke(), sw = A.sw * gs;
    const dotR = clamp(sw * .09, 2.2, 4.5), gap = clamp(sw * .34, 9, 18);
    // نقاط المسار
    A.strokes.forEach((st, i) => {
      const isCur = i === cur, fin = strokeDone[i];
      if (st.dot) {
        const [x, y] = toS(st.x, st.y), r = Math.max(st.r * gs, 8);
        c.strokeStyle = fin ? 'rgba(61,190,91,.5)' : isCur ? '#E8553A' : 'rgba(160,120,90,.45)'; c.lineWidth = 3; c.setLineDash([5, 5]);
        c.lineDashOffset = -T * 20;
        c.beginPath(); c.arc(x, y, r + (isCur ? 3 + Math.sin(T * 6) * 2 : 0), 0, TAU); c.stroke(); c.setLineDash([]);
        return;
      }
      const L = st.len * gs, n = Math.max(2, Math.floor(L / gap));
      c.fillStyle = fin ? 'rgba(61,190,91,.35)' : isCur ? 'rgba(232,85,58,.7)' : 'rgba(150,110,80,.42)';
      for (let k = 0; k <= n; k++) { const [gx, gy] = strokeAt(st, st.len * k / n), [x, y] = toS(gx, gy); c.beginPath(); c.arc(x, y, dotR, 0, TAU); c.fill(); }
      // أسهم الاتجاه
      if (!fin) {
        const ag = clamp(sw * 1.6, 46, 90) / gs, off = isCur ? (T * 30 / gs) % ag : ag * .5;
        c.strokeStyle = isCur ? '#E8553A' : 'rgba(150,110,80,.5)'; c.lineWidth = isCur ? 3.5 : 2.5; c.lineCap = c.lineJoin = 'round';
        for (let d = off + ag * .6; d < st.len - ag * .25; d += ag) {
          const [gx, gy, a] = strokeAt(st, d), [x, y] = toS(gx, gy), s = clamp(sw * .22, 6, 11);
          c.save(); c.translate(x, y); c.rotate(a); c.beginPath(); c.moveTo(-s * .6, -s); c.lineTo(s * .5, 0); c.lineTo(-s * .6, s); c.stroke(); c.restore();
        }
      }
    });
    // أرقام البداية
    A.strokes.forEach((st, i) => {
      if (strokeDone[i]) return;
      const isCur = i === cur;
      const p = st.dot ? [st.x, st.y - Math.max(st.r, 4) - 10 / gs] : st.pts[0], [x, y] = toS(p[0], p[1]);
      const r = (isCur ? 14 : 11.5) * (isCur ? 1 + .08 * Math.sin(T * 6) : 1);
      c.save(); c.translate(x, y);
      if (isCur) { c.fillStyle = 'rgba(255,170,120,.3)'; c.beginPath(); c.arc(0, 0, r + 7 + Math.sin(T * 6) * 3, 0, TAU); c.fill(); }
      c.fillStyle = 'rgba(90,50,20,.2)'; c.beginPath(); c.arc(0, 2, r, 0, TAU); c.fill();
      c.fillStyle = BADGE[i % BADGE.length]; c.globalAlpha = isCur ? 1 : .75; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
      c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.stroke(); c.globalAlpha = 1;
      c.fillStyle = '#fff'; c.font = `900 ${Math.round(r * 1.25)}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
      c.fillText(String(i + 1), 0, 1.5);
      c.restore();
    });
    // إصبع إرشادي عند السكون
    if (cur >= 0 && pid === null && idleT > 2) {
      const st = A.strokes[cur], cyc = (idleT - 2) % 3.2, t = clamp(cyc / 2.2, 0, 1);
      let x, y;
      if (st.dot) { [x, y] = toS(st.x, st.y); }
      else { const [gx, gy] = strokeAt(st, st.len * ease.outCubic(t) * .999); [x, y] = toS(gx, gy); }
      const a = cyc < 2.4 ? 1 : Math.max(0, 1 - (cyc - 2.4) * 2);
      c.save(); c.globalAlpha = a * .9; c.translate(x, y);
      const tap = st.dot ? 1 + .15 * Math.sin(T * 8) : 1;
      c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.arc(0, 0, 15 * tap, 0, TAU); c.fill();
      c.fillStyle = '#E8553A'; c.beginPath(); c.arc(0, 0, 9 * tap, 0, TAU); c.fill();
      c.font = `30px ${EMOJI_FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('👆', 10, 26);
      c.restore();
    }
  }
  function drawFill(c) {
    const col = COLORS[color], t = clamp(doneT / .7, 0, 1);
    const cx = gox + A.gw * gs / 2, cy = goy + A.gh * gs / 2, R = Math.hypot(A.gw, A.gh) * gs * .6 * ease.outCubic(t);
    const sc = 1 + .12 * Math.sin(Math.min(1, doneT * 1.6) * Math.PI) ;
    c.save(); c.translate(cx, cy); c.scale(sc, sc); c.translate(-cx, -cy);
    c.save(); c.beginPath(); c.arc(cx, cy, Math.max(1, R), 0, TAU); c.clip();
    c.save(); c.translate(0, 5); glyphPath(c, col.d); c.restore();
    const f = fillCtx; f.setTransform(1, 0, 0, 1, 0, 0); f.clearRect(0, 0, fillCv.width, fillCv.height); f.setTransform(dpr, 0, 0, dpr, 0, 0);
    glyphPath(f, col.c);
    f.globalCompositeOperation = 'source-atop';
    const g = f.createLinearGradient(0, goy, 0, goy + A.gh * gs); g.addColorStop(0, col.l); g.addColorStop(.5, col.c); g.addColorStop(1, col.d);
    f.fillStyle = g; f.fillRect(0, 0, W, H);
    // لمعة متحركة
    const sh = ((doneT * .6) % 1.6) - .3, sxp = gox + A.gw * gs * sh;
    const g2 = f.createLinearGradient(sxp - 60, 0, sxp + 60, 0); g2.addColorStop(0, 'rgba(255,255,255,0)'); g2.addColorStop(.5, 'rgba(255,255,255,.55)'); g2.addColorStop(1, 'rgba(255,255,255,0)');
    f.fillStyle = g2; f.fillRect(0, 0, W, H);
    f.globalCompositeOperation = 'source-over';
    c.drawImage(fillCv, 0, 0, W, H);
    c.restore();
    c.restore();
    // نجوم صغيرة متلألئة حول الحرف
    for (let i = 0; i < 6; i++) {
      const s = A.samples[(i * 7 + ((T * 1.5) | 0) * 3) % A.samples.length]; if (!s) break;
      const [x, y] = toS(s.x, s.y), tw = Math.abs(Math.sin(T * 4 + i * 1.7));
      c.save(); c.translate(x + Math.sin(i * 3) * 12, y + Math.cos(i * 5) * 12); c.rotate(T + i); c.globalAlpha = tw * Math.min(1, doneT * 2);
      c.fillStyle = i % 2 ? '#FFFFFF' : '#FFE27A'; starPath(c, 5 + tw * 6, .4); c.fill(); c.restore();
    }
  }
  function drawParts(c) {
    parts.forEach(p => {
      const a = 1 - p.t / p.life;
      c.save(); c.globalAlpha = Math.max(0, a); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c;
      if (p.k === 'conf') c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
      else { starPath(c, p.s * (p.k === 'glit' ? a : 1), .42); c.fill(); }
      c.restore();
    });
  }

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    IK.bg(c, s, ['#FFF2DA', '#FFB86B', '#F2733A'], { seed: 17 });
    c.textBaseline = 'alphabetic'; c.direction = 'ltr'; c.textAlign = 'center';
    const txt = (c, t, x, y, sz, col, dk, rot) => {
      c.save(); c.translate(x, y); c.rotate(rot); c.font = `900 ${sz}px ${FONT}`;
      c.fillStyle = dk; c.fillText(t, 0, s * .025);
      const gg = c.createLinearGradient(0, -sz * .7, 0, 0); gg.addColorStop(0, col[0]); gg.addColorStop(1, col[1]);
      c.fillStyle = gg; c.fillText(t, 0, 0); c.restore();
    };
    IK.sticker(c, s, c => {
      c.textBaseline = 'alphabetic'; c.direction = 'ltr'; c.textAlign = 'center';
      txt(c, 'أ', s * .66, s * .8, s * .6, ['#FF9C9C', '#E8303A'], '#A51A22', .08);
      txt(c, 'A', s * .3, s * .6, s * .48, ['#9CD8FF', '#2F8CF0'], '#1A5DB8', -.12);
      c.save(); c.translate(s * .36, s * .84); c.rotate(-.75);
      const L = s * .5, wd = s * .11;
      c.fillStyle = '#3DBE5B'; c.beginPath(); c.roundRect(-L / 2, -wd / 2, L, wd, wd * .3); c.fill();
      c.fillStyle = '#1F8A3B'; c.fillRect(-L * .2, -wd / 2, L * .38, wd);
      c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(-L / 2 + 3, -wd / 2 + 2, L - 3, wd * .25);
      c.fillStyle = '#F4D9A6'; c.beginPath(); c.moveTo(L / 2, -wd / 2); c.lineTo(L / 2 + wd * 1.1, 0); c.lineTo(L / 2, wd / 2); c.closePath(); c.fill();
      c.fillStyle = '#3DBE5B'; c.beginPath(); c.moveTo(L / 2 + wd * .7, -wd * .18); c.lineTo(L / 2 + wd * 1.1, 0); c.lineTo(L / 2 + wd * .7, wd * .18); c.closePath(); c.fill();
      c.restore();
    });
    c.fillStyle = '#FFE14D'; c.save(); c.translate(s * .84, s * .18); starPath(c, s * .075, .45); c.fill(); c.restore();
    IK.sparkle(c, s * .14, s * .16, 8);
  }

  bakeBrushes();

  App.register({
    id: ID, title: 'حروفي', icon2: '✍️', isNew: false, music: 'letters',
    titleEn: 'My Letters',
    desc: () => App.g('تتبّعي الحروف العربية والإنجليزية بإصبعك', 'تتبّع الحروف العربية والإنجليزية بإصبعك'),
    descEn: () => 'Trace Arabic and English letters with your finger',
    helpEn: () => [
      '✍️ Start at number 1 and slide your finger over the dots in the direction of the arrows',
      '🖍️ Choose the pen color at the bottom, and 🧽 to erase and start again',
      '🌟 When you finish a letter it lights up and you hear its name and a word that starts with it',
      '🔤 Switch between «عربي» and «English», and use the 🔤 button to see all the letters and your stars',
      '🎯 After tracing 5 letters «Where is the letter…?» opens: listen and touch the right letter'
    ],
    help: () => [
      '✍️ ' + App.g('ابدئي', 'ابدأ') + ' من الرقم 1 ' + App.g('واسحبي', 'واسحب') + ' إصبعك على النقاط باتجاه الأسهم',
      '🖍️ ' + App.g('اختاري', 'اختر') + ' لون القلم من الأسفل، و🧽 لمسح الرسم والبدء من جديد',
      '🌟 عند إكمال الحرف يتلوّن ' + App.g('وتسمعين', 'وتسمع') + ' اسمه وكلمة تبدأ به',
      '🔤 ' + App.g('بدّلي', 'بدّل') + ' بين «عربي» و«English»، ومن زر 🔤 ' + App.g('شاهدي', 'شاهد') + ' كل الحروف ونجومك',
      '🎯 بعد تتبّع 5 حروف تُفتح لعبة «أين حرف…؟»: ' + App.g('اسمعي', 'اسمع') + ' ' + App.g('والمسي', 'والمس') + ' الحرف الصحيح'
    ],
    icon,
    best() {
      const p = loadProg(), a = countOf(p, 'ar'), e = countOf(p, 'en');
      if (!a && !e) return '';
      return `🏆 ${App.t('عربي', 'Arabic')} ${a}/${AR.length} · English ${e}/${EN.length}`;
    },
    enter() {
      paused = false;
      const pos = store.get('lettersPos', null) || {};
      alpha = App.gameLang(ID); relabel();
      idx = { ar: clamp(pos.ar | 0, 0, AR.length - 1), en: clamp(pos.en | 0, 0, EN.length - 1) };
      color = clamp(pos.color | 0, 0, COLORS.length - 1);
      wordOv.classList.remove('on'); gridOv.classList.remove('on'); quizOv.classList.remove('on'); quiz = null;
      layout();
      setLetter(idx[alpha], false);
      requestAnimationFrame(() => { if (App.current === ID) layout(); });
      startLoop();
    },
    onLang(l) {
      relabel(); hintEl.classList.remove('on'); hintT.textContent = '';
      if (quizOv.classList.contains('on')) { quizOv.classList.remove('on'); quiz = null; }
      if (l !== alpha) { switchAlpha(l, true); } else updateUI();
      if (gridOv.classList.contains('on')) openGrid();
      if (wordOv.classList.contains('on')) showWord();
    },
    leave() {
      stopLoop(); clearTimeout(wordTimer); pid = null; curInk = null; quiz = null;
      wordOv.classList.remove('on'); gridOv.classList.remove('on'); quizOv.classList.remove('on');
      try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
    },
    pause() { paused = true; },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (quizOv.classList.contains('on')) { quizOv.classList.remove('on'); quiz = null; return true; }
      if (gridOv.classList.contains('on')) { gridOv.classList.remove('on'); return true; }
      if (wordOv.classList.contains('on')) { wordOv.classList.remove('on'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() { return { alpha, idx: idx[alpha], done, A: A && { gw: A.gw, gh: A.gh, sw: A.sw, n: A.samples.length, strokes: A.strokes.map(s => s.dot ? { dot: 1, x: s.x, y: s.y } : { len: Math.round(s.len), a: s.pts[0], b: s.pts[s.pts.length - 1] }) }, cov: A ? coverage() : 0, gs, gox, goy }; },
    _samples() { return A ? A.strokes.map(s => s.dot ? [[s.x, s.y]] : s.pts.filter((_, i) => i % 3 === 0).concat([s.pts[s.pts.length - 1]])).map(l => l.map(p => toS(p[0], p[1]))) : []; },
    _analyze(a, i) { return analyze(SETS[a][i]); }
  });
})();
