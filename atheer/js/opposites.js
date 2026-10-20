/* =====================================================================
   الأضداد — بطاقات تنقلب: اختر عكس الصورة، ولعبة ذاكرة تطابق الأضداد
   ثنائي اللغة: عربي / English (يُحفظ لكل لاعب)
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'opposites';
  const TAU = Math.PI * 2;
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';

  /* ---------- الأزواج ---------- */
  const PAIRS = [
    { k: 'size', ar: ['كبير', 'صغير'], en: ['big', 'small'], c: ['#4CC76A', '#2E9A49'] },
    { k: 'temp', ar: ['حار', 'بارد'], en: ['hot', 'cold'], c: ['#FF7A3D', '#D9541A'] },
    { k: 'day', ar: ['نهار', 'ليل'], en: ['day', 'night'], c: ['#3E9BFF', '#2163C9'] },
    { k: 'updown', ar: ['فوق', 'تحت'], en: ['up', 'down'], c: ['#B26BFF', '#8442D6'] },
    { k: 'full', ar: ['ممتلئ', 'فارغ'], en: ['full', 'empty'], c: ['#16B5C9', '#0B8696'] },
    { k: 'speed', ar: ['سريع', 'بطيء'], en: ['fast', 'slow'], c: ['#FF5C7A', '#D13355'] },
    { k: 'mood', ar: ['سعيد', 'حزين'], en: ['happy', 'sad'], c: ['#F5B700', '#C98D00'] },
    { k: 'door', ar: ['مفتوح', 'مغلق'], en: ['open', 'closed'], c: ['#E8772E', '#B8550F'] },
    { k: 'len', ar: ['طويل', 'قصير'], en: ['long', 'short'], c: ['#7048E8', '#4F2BC2'] },
    { k: 'wet', ar: ['مبلل', 'جاف'], en: ['wet', 'dry'], c: ['#3D8BFF', '#2163C9'] },
    { k: 'weight', ar: ['ثقيل', 'خفيف'], en: ['heavy', 'light'], c: ['#6C6790', '#45406A'] },
    { k: 'inout', ar: ['داخل', 'خارج'], en: ['in', 'out'], c: ['#24B47E', '#138A5E'] },
    { k: 'clean', ar: ['نظيف', 'متسخ'], en: ['clean', 'dirty'], c: ['#FF6FA8', '#D13D7C'] },
    { k: 'many', ar: ['كثير', 'قليل'], en: ['many', 'few'], c: ['#E64980', '#B02A5E'] },
    { k: 'near', ar: ['قريب', 'بعيد'], en: ['near', 'far'], c: ['#0CA678', '#087F5B'] }
  ];
  // المستويات: نوع (c: اختر العكس، m: ذاكرة)
  const LV = [
    { m: 'c', set: [0, 1, 2, 3, 4], opts: 2, n: 5 },
    { m: 'c', set: [5, 6, 7, 8, 9], opts: 2, n: 5 },
    { m: 'c', set: [10, 11, 12, 13, 14], opts: 2, n: 5 },
    { m: 'c', set: null, opts: 3, n: 6 },
    { m: 'c', set: null, opts: 3, n: 8 },
    { m: 'm', pairs: 3 }, { m: 'm', pairs: 4 }, { m: 'm', pairs: 6 }, { m: 'm', pairs: 8 }
  ];
  const NL = LV.length, NC = LV.filter(l => l.m === 'c').length;

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const outBack = t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  function mix(a, b, t) { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; }
  const AD = '٠١٢٣٤٥٦٧٨٩';
  const numL = (n, lg) => lg === 'ar' ? String(n).replace(/\d/g, d => AD[d]) : String(n);
  function starPath(c, s) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  function loadProg() { const p = store.get('oppositesProg', null) || {}; return { uc: clamp(p.uc || 1, 1, NC), um: clamp(p.um || NC + 1, NC + 1, NL), stars: p.stars || {} }; }
  const fr = (x, k = 1) => x - Math.floor(x / k) * k;

  let dpr = 1;
  const ecache = new Map();
  function emojiImg(e, size) {
    size = Math.max(8, Math.round(size / 4) * 4);
    const key = e + '|' + size + '|' + dpr;
    let c = ecache.get(key); if (c) return c;
    if (ecache.size > 260) ecache.clear();
    const P = Math.ceil(size * 1.3 * dpr); c = mk(P, P); const x = c.getContext('2d');
    x.direction = 'ltr';
    let fs = size * dpr; x.font = `${fs}px ${EMOJI_FONT}`;
    let m = x.measureText(e);
    const w = (m.actualBoundingBoxLeft || 0) + (m.actualBoundingBoxRight || m.width), h = (m.actualBoundingBoxAscent || fs * .8) + (m.actualBoundingBoxDescent || fs * .2);
    fs *= Math.min(1.25, size * dpr / Math.max(w, h, 1)); x.font = `${fs}px ${EMOJI_FONT}`; m = x.measureText(e);
    const L = m.actualBoundingBoxLeft || m.width / 2, R = m.actualBoundingBoxRight || m.width / 2;
    const A = m.actualBoundingBoxAscent || fs * .8, D = m.actualBoundingBoxDescent || fs * .2;
    x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.fillText(e, P / 2 + (L - R) / 2, P / 2 + (A - D) / 2);
    c.sz = P / dpr; ecache.set(key, c);
    return c;
  }
  function emo(c, e, x, y, size, o = {}) {
    const im = emojiImg(e, size);
    c.save(); c.translate(x, y); if (o.rot) c.rotate(o.rot); if (o.sx || o.sy) c.scale(o.sx || 1, o.sy || 1);
    if (o.filter) c.filter = o.filter;
    c.drawImage(im, -im.sz / 2, -im.sz / 2, im.sz, im.sz); c.restore();
  }
  function shadowE(c, x, y, w, a = .22) { c.fillStyle = `rgba(30,20,50,${a})`; c.beginPath(); c.ellipse(x, y, w, w * .22, 0, 0, TAU); c.fill(); }
  function vgrad(c, w, h, a, b, stop) { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, a); g.addColorStop(stop || 1, b); c.fillStyle = g; c.fillRect(0, 0, w, h); }
  function ground(c, w, h, y, a, b) { const g = c.createLinearGradient(0, y, 0, h); g.addColorStop(0, a); g.addColorStop(1, b); c.fillStyle = g; c.beginPath(); c.ellipse(w / 2, y + h * .5, w * 1.1, h * .52, 0, Math.PI, 0); c.lineTo(w, h); c.lineTo(0, h); c.fill(); c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(w / 2, y + h * .02, w * .6, h * .03, 0, 0, TAU); c.fill(); }
  function arrow(c, x, y, s, up, col) {
    c.save(); c.translate(x, y); if (!up) c.rotate(Math.PI);
    const g = c.createLinearGradient(0, -s, 0, s); g.addColorStop(0, mix(col, '#FFFFFF', .45)); g.addColorStop(1, col);
    c.beginPath(); c.moveTo(0, -s); c.lineTo(s * .75, -s * .1); c.lineTo(s * .3, -s * .1); c.lineTo(s * .3, s * .85); c.quadraticCurveTo(0, s, -s * .3, s * .85); c.lineTo(-s * .3, -s * .1); c.lineTo(-s * .75, -s * .1); c.closePath();
    c.lineJoin = 'round'; c.lineWidth = s * .16; c.strokeStyle = '#fff'; c.stroke(); c.fillStyle = g; c.fill();
    c.restore();
  }
  function sunDisk(c, x, y, r, t) {
    c.save(); c.translate(x, y); c.rotate(t * .4);
    c.fillStyle = 'rgba(255,214,60,.55)';
    for (let i = 0; i < 12; i++) { c.rotate(TAU / 12); c.beginPath(); c.moveTo(-r * .16, -r * 1.1); c.lineTo(0, -r * 1.55); c.lineTo(r * .16, -r * 1.1); c.fill(); }
    c.restore();
    const g = c.createRadialGradient(x - r * .3, y - r * .35, r * .1, x, y, r); g.addColorStop(0, '#FFF7C2'); g.addColorStop(.55, '#FFD43B'); g.addColorStop(1, '#F59F00');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
  }
  function glass(c, x, y, w, h, fill, t) {
    const tw = w, bw = w * .78;
    const path = () => { c.beginPath(); c.moveTo(x - tw / 2, y - h / 2); c.lineTo(x + tw / 2, y - h / 2); c.lineTo(x + bw / 2, y + h / 2); c.quadraticCurveTo(x, y + h / 2 + h * .06, x - bw / 2, y + h / 2); c.closePath(); };
    shadowE(c, x, y + h / 2 + 2, w * .55);
    c.fillStyle = 'rgba(255,255,255,.35)'; path(); c.fill();
    if (fill > 0) {
      c.save(); path(); c.clip();
      const ly = y + h / 2 - h * fill;
      const g = c.createLinearGradient(0, ly, 0, y + h / 2); g.addColorStop(0, '#7FD3FF'); g.addColorStop(1, '#1E88E5');
      c.fillStyle = g; c.beginPath(); c.moveTo(x - w, y + h);
      for (let xx = -w; xx <= w; xx += 3) c.lineTo(x + xx, ly + Math.sin(xx * .12 + t * 5) * h * .018);
      c.lineTo(x + w, y + h); c.fill();
      c.fillStyle = 'rgba(255,255,255,.7)';
      for (let i = 0; i < 5; i++) { const p = fr(t * .35 + i * .21); c.beginPath(); c.arc(x - w * .25 + (i * 37 % 50) / 50 * w * .5, y + h / 2 - p * h * fill * .95, w * .025 + i % 2 * w * .012, 0, TAU); c.fill(); }
      c.restore();
    }
    c.lineWidth = Math.max(2, w * .045); c.strokeStyle = 'rgba(120,150,190,.85)'; path(); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = Math.max(2, w * .05); c.lineCap = 'round';
    c.beginPath(); c.moveTo(x - tw * .32, y - h * .38); c.lineTo(x - bw * .3, y + h * .3); c.stroke();
  }
  function pencil(c, x, y, len, th, t) {
    c.save(); c.translate(x, y); c.rotate(Math.sin(t * 2) * .04);
    const L = len / 2, cone = th * 1.4;
    shadowE(c, 0, th * .9, L * .9, .16);
    // الممحاة
    c.fillStyle = '#FF8FB1'; c.beginPath(); c.roundRect(-L, -th / 2, th * .9, th, [th * .35, 0, 0, th * .35]); c.fill();
    c.fillStyle = '#C9CED9'; c.fillRect(-L + th * .8, -th / 2, th * .5, th);
    c.fillStyle = 'rgba(0,0,0,.15)'; c.fillRect(-L + th * .95, -th / 2, th * .08, th); c.fillRect(-L + th * 1.12, -th / 2, th * .08, th);
    // الجسم
    const g = c.createLinearGradient(0, -th / 2, 0, th / 2); g.addColorStop(0, '#FFE680'); g.addColorStop(.5, '#FFC531'); g.addColorStop(1, '#E09A00');
    c.fillStyle = g; c.fillRect(-L + th * 1.3, -th / 2, len - th * 1.3 - cone, th);
    c.fillStyle = 'rgba(255,255,255,.45)'; c.fillRect(-L + th * 1.3, -th * .32, len - th * 1.3 - cone, th * .14);
    // الرأس الخشبي
    c.fillStyle = '#F4D3A1'; c.beginPath(); c.moveTo(L - cone, -th / 2); c.lineTo(L, 0); c.lineTo(L - cone, th / 2); c.closePath(); c.fill();
    c.fillStyle = '#3B3355'; c.beginPath(); c.moveTo(L - cone * .35, -th * .18); c.lineTo(L, 0); c.lineTo(L - cone * .35, th * .18); c.closePath(); c.fill();
    c.restore();
  }
  function door(c, w, h, open, t) {
    const dw = w * .46, dh = h * .66, x0 = w / 2 - dw / 2, y0 = h * .88 - dh;
    // إطار
    c.fillStyle = '#8A5A3A'; c.beginPath(); c.roundRect(x0 - dw * .1, y0 - dw * .1, dw * 1.2, dh + dw * .1, [dw * .12, dw * .12, 0, 0]); c.fill();
    if (open) {
      const g = c.createLinearGradient(0, y0, 0, y0 + dh); g.addColorStop(0, '#FFF6C4'); g.addColorStop(1, '#FFD43B');
      c.fillStyle = g; c.fillRect(x0, y0, dw, dh);
      // ضوء يخرج
      c.fillStyle = 'rgba(255,240,150,.35)'; c.beginPath(); c.moveTo(x0, y0 + dh); c.lineTo(x0 + dw, y0 + dh); c.lineTo(x0 + dw * 1.6, h); c.lineTo(x0 - dw * .6, h); c.fill();
      emo(c, '🐱', x0 + dw * .55, y0 + dh * .72, dh * .38, { rot: Math.sin(t * 2) * .08 });
      const sw = .28 + Math.sin(t * 1.5) * .05;
      c.fillStyle = '#C47A3E'; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0 - dw * sw, y0 + dh * .06); c.lineTo(x0 - dw * sw, y0 + dh * .94); c.lineTo(x0, y0 + dh); c.closePath(); c.fill();
      c.fillStyle = '#FFC93C'; c.beginPath(); c.arc(x0 - dw * sw * .8, y0 + dh * .52, dw * .035, 0, TAU); c.fill();
    } else {
      const g = c.createLinearGradient(x0, 0, x0 + dw, 0); g.addColorStop(0, '#C47A3E'); g.addColorStop(1, '#A35F2A');
      c.fillStyle = g; c.fillRect(x0, y0, dw, dh);
      c.strokeStyle = 'rgba(0,0,0,.15)'; c.lineWidth = 3;
      c.strokeRect(x0 + dw * .15, y0 + dh * .08, dw * .7, dh * .36); c.strokeRect(x0 + dw * .15, y0 + dh * .52, dw * .7, dh * .4);
      c.fillStyle = '#FFC93C'; c.beginPath(); c.arc(x0 + dw * .82, y0 + dh * .5, dw * .06, 0, TAU); c.fill();
      c.fillStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.arc(x0 + dw * .8, y0 + dh * .49, dw * .02, 0, TAU); c.fill();
    }
  }
  function cage(c, x, y, s, front, openDoor) {
    const r = s * .42, by = y + s * .38;
    c.strokeStyle = '#B98A2A'; c.lineWidth = Math.max(2, s * .028);
    if (!front) {
      c.fillStyle = 'rgba(255,240,200,.35)'; c.beginPath(); c.arc(x, by - s * .5, r, Math.PI, 0); c.lineTo(x + r, by); c.lineTo(x - r, by); c.fill();
      return;
    }
    for (let i = -3; i <= 3; i++) {
      const bx = x + i * r / 3.5;
      if (openDoor && i >= 1 && i <= 2) continue;
      const topY = by - s * .5 - Math.sqrt(Math.max(0, r * r - (bx - x) * (bx - x)));
      c.beginPath(); c.moveTo(bx, by); c.lineTo(bx, topY); c.stroke();
    }
    c.beginPath(); c.arc(x, by - s * .5, r, Math.PI, 0); c.stroke();
    c.fillStyle = '#D9A93A'; c.beginPath(); c.roundRect(x - r * 1.1, by - s * .03, r * 2.2, s * .08, s * .03); c.fill();
    c.beginPath(); c.arc(x, by - s * .5 - r - s * .04, s * .05, 0, TAU); c.stroke();
    if (openDoor) {
      c.fillStyle = 'rgba(185,138,42,.9)';
      c.save(); c.translate(x + r * .3, by - s * .05); c.rotate(-.9);
      for (let i = 0; i < 3; i++) c.fillRect(i * r * .14, -r * .9, Math.max(2, s * .022), r * .9);
      c.fillRect(0, -r * .9, r * .3, Math.max(2, s * .022)); c.restore();
    }
  }
  function mud(c, x, y, s, t) {
    c.fillStyle = 'rgba(122,82,42,.92)';
    [[-.25, -.1, .12], [.2, .05, .1], [-.05, .22, .09], [.28, -.25, .07], [-.3, .25, .06], [.05, -.3, .05]].forEach(([dx, dy, r]) => {
      c.beginPath(); c.ellipse(x + dx * s, y + dy * s, r * s, r * s * .8, dx * 3, 0, TAU); c.fill();
    });
    c.fillStyle = '#2E2A4A';
    for (let i = 0; i < 3; i++) { const a = t * (2 + i) + i * 2; c.beginPath(); c.arc(x + Math.cos(a) * s * .55, y - s * .35 + Math.sin(a * 1.3) * s * .18, Math.max(1.5, s * .025), 0, TAU); c.fill(); }
  }

  /* رسم الصورة المتحركة لكل جانب داخل مستطيل (0..w,0..h) */
  function illo(c, k, side, w, h, t) {
    const m = Math.min(w, h);
    switch (k) {
      case 'size': {
        vgrad(c, w, h, '#DFF6FF', '#BDE8FF'); ground(c, w, h, h * .72, '#9BDB8C', '#5DBB5E');
        if (side === 0) { shadowE(c, w / 2, h * .86, m * .3); emo(c, '🐘', w / 2, h * .56 + Math.sin(t * 2) * m * .015, m * .64); }
        else { const x = w / 2 + Math.sin(t * 3) * m * .12; shadowE(c, x, h * .84, m * .09); emo(c, '🐭', x, h * .76 - Math.abs(Math.sin(t * 9)) * m * .03, m * .22, { sx: Math.cos(t * 3) > 0 ? -1 : 1 }); }
        break;
      }
      case 'temp': {
        if (side === 0) {
          vgrad(c, w, h, '#FFE3A3', '#FF9A5C');
          c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = m * .025; c.lineCap = 'round';
          for (let i = 0; i < 3; i++) { const x = w * (.3 + i * .2), p = fr(t * .6 + i * .33); c.globalAlpha = 1 - p; c.beginPath(); for (let yy = 0; yy < h * .25; yy += 3) c.lineTo(x + Math.sin(yy * .15 + t * 6) * m * .03, h * .35 - p * h * .2 - yy); c.stroke(); }
          c.globalAlpha = 1;
          shadowE(c, w / 2, h * .86, m * .22);
          emo(c, '🔥', w / 2, h * .6, m * .58, { sx: 1 + Math.sin(t * 9) * .04, sy: 1 + Math.sin(t * 11) * .06 });
        } else {
          vgrad(c, w, h, '#E3F4FF', '#A8D8FF'); ground(c, w, h, h * .76, '#FFFFFF', '#DCEBFA');
          emo(c, '⛄', w / 2, h * .55, m * .6, { rot: Math.sin(t * 1.5) * .04 });
          c.fillStyle = '#fff';
          for (let i = 0; i < 14; i++) { const p = fr(t * .18 + i * .071); c.beginPath(); c.arc(fr(i * .37 + Math.sin(t + i) * .02) * w, p * h, m * (.012 + (i % 3) * .006), 0, TAU); c.fill(); }
        }
        break;
      }
      case 'day': {
        if (side === 0) {
          vgrad(c, w, h, '#6EC3FF', '#D4F0FF');
          sunDisk(c, w * .68, h * .3, m * .14, t);
          IK.cloud(c, fr(t * .03) * (w + m * .6) - m * .5, h * .5, m * .45, '#fff', 'rgba(170,200,235,.5)');
          ground(c, w, h, h * .78, '#9BDB8C', '#5DBB5E');
        } else {
          vgrad(c, w, h, '#1B2A6B', '#3B4CA8');
          for (let i = 0; i < 12; i++) { c.globalAlpha = .5 + .5 * Math.sin(t * 3 + i * 1.7); c.fillStyle = '#FFF6C4'; c.save(); c.translate(fr(i * .53) * w, fr(i * .29) * h * .65); starPath(c, m * (.018 + i % 3 * .008)); c.fill(); c.restore(); }
          c.globalAlpha = 1;
          const g = c.createRadialGradient(w * .62, h * .3, 0, w * .62, h * .3, m * .3); g.addColorStop(0, 'rgba(255,240,170,.35)'); g.addColorStop(1, 'rgba(255,240,170,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
          emo(c, '🌙', w * .62, h * .3 + Math.sin(t * 1.4) * m * .02, m * .32);
          ground(c, w, h, h * .78, '#2F5E52', '#1C3D36');
        }
        break;
      }
      case 'updown': {
        vgrad(c, w, h, '#EFE3FF', '#D3BCFF'); ground(c, w, h, h * .84, '#9BDB8C', '#5DBB5E');
        const lx = w * .58, top = h * .12, bot = h * .9, lw = m * .26;
        c.strokeStyle = '#B5793F'; c.lineWidth = m * .04; c.lineCap = 'round';
        c.beginPath(); c.moveTo(lx - lw / 2, top); c.lineTo(lx - lw / 2, bot); c.moveTo(lx + lw / 2, top); c.lineTo(lx + lw / 2, bot); c.stroke();
        c.lineWidth = m * .028; for (let y = top + m * .08; y < bot; y += m * .11) { c.beginPath(); c.moveTo(lx - lw / 2, y); c.lineTo(lx + lw / 2, y); c.stroke(); }
        const cy = side === 0 ? top + m * .08 : bot - m * .12;
        emo(c, '🐱', lx, cy + Math.sin(t * 3) * m * .015, m * .28);
        arrow(c, w * .22, h * .5 + (side === 0 ? -1 : 1) * fr(t * .8) * m * .12, m * .17, side === 0, side === 0 ? '#4CC76A' : '#FF7A3D');
        break;
      }
      case 'full': {
        vgrad(c, w, h, '#E3FBFF', '#B7EEF5');
        c.fillStyle = 'rgba(0,120,140,.15)'; c.fillRect(0, h * .8, w, h * .2);
        glass(c, w / 2, h * .52, m * .48, m * .6, side === 0 ? .82 : 0, t);
        break;
      }
      case 'speed': {
        vgrad(c, w, h, '#FFF1E0', '#FFD9B0'); ground(c, w, h, h * .74, '#9BDB8C', '#5DBB5E');
        if (side === 0) {
          const p = fr(t * .55), x = w * 1.15 - p * w * 1.3, y = h * .66 - Math.abs(Math.sin(p * 14)) * m * .14;
          c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = m * .025; c.lineCap = 'round';
          for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(x + m * .2, y - m * .08 + i * m * .07); c.lineTo(x + m * .2 + m * (.15 + i * .05), y - m * .08 + i * m * .07); c.stroke(); }
          shadowE(c, x, h * .84, m * .12);
          emo(c, '🐇', x, y, m * .34, { rot: -.15 });
        } else {
          const x = w * .8 - fr(t * .05) * w * .6;
          shadowE(c, x, h * .83, m * .16);
          emo(c, '🐢', x, h * .72, m * .36, { rot: Math.sin(t * 2) * .03 });
          c.fillStyle = 'rgba(120,80,40,.7)'; c.font = `900 ${m * .1}px ${FONT}`; c.textAlign = 'center'; c.fillText('z', x + m * .2, h * .5 - fr(t * .5) * m * .1);
        }
        break;
      }
      case 'mood': {
        if (side === 0) {
          vgrad(c, w, h, '#FFF6C4', '#FFD86B');
          c.save(); c.translate(w / 2, h * .5); c.rotate(t * .5); c.fillStyle = 'rgba(255,255,255,.35)';
          for (let i = 0; i < 10; i++) { c.rotate(TAU / 10); c.beginPath(); c.moveTo(0, 0); c.lineTo(-m * .1, -m); c.lineTo(m * .1, -m); c.fill(); }
          c.restore();
          const b = Math.abs(Math.sin(t * 3.2));
          shadowE(c, w / 2, h * .86, m * .2 * (1 - b * .3));
          emo(c, '😄', w / 2, h * .55 - b * m * .1, m * .5, { sx: 1 + (1 - b) * .06, sy: 1 - (1 - b) * .06 });
        } else {
          vgrad(c, w, h, '#C9D6E8', '#9FB3CF');
          IK.cloud(c, w * .2, h * .22, m * .6, '#E2E8F2', 'rgba(110,130,160,.5)');
          c.strokeStyle = 'rgba(80,120,200,.7)'; c.lineWidth = m * .015;
          for (let i = 0; i < 6; i++) { const p = fr(t * .9 + i * .17), x = w * (.28 + i * .09); c.beginPath(); c.moveTo(x, h * .3 + p * h * .25); c.lineTo(x - m * .02, h * .34 + p * h * .25); c.stroke(); }
          emo(c, '😢', w / 2, h * .64, m * .48, { rot: Math.sin(t * 1.2) * .05 });
        }
        break;
      }
      case 'door': {
        vgrad(c, w, h, '#FFE8D1', '#F5C9A0');
        c.fillStyle = '#E3A876'; c.fillRect(0, h * .88, w, h * .12);
        door(c, w, h, side === 0, t);
        break;
      }
      case 'len': {
        vgrad(c, w, h, '#F3EDFF', '#DCD0FF');
        c.strokeStyle = 'rgba(112,72,232,.12)'; c.lineWidth = 1;
        for (let y = h * .15; y < h; y += m * .09) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
        const len = side === 0 ? w * .86 : w * .3;
        pencil(c, w / 2, h * .48, len, m * .12, t);
        // مسطرة
        c.fillStyle = '#FFE680'; c.beginPath(); c.roundRect(w * .06, h * .72, w * .88, m * .1, 4); c.fill();
        c.fillStyle = 'rgba(120,80,0,.6)'; for (let i = 0; i <= 10; i++) c.fillRect(w * .08 + i * w * .084, h * .72, 1.5, m * (i % 5 ? .035 : .06));
        break;
      }
      case 'wet': {
        if (side === 0) {
          vgrad(c, w, h, '#A9C3DB', '#D7E6F2'); ground(c, w, h, h * .8, '#8FB8A0', '#6A9C82');
          c.fillStyle = 'rgba(70,130,220,.35)'; c.beginPath(); c.ellipse(w / 2, h * .88, m * .34, m * .06, 0, 0, TAU); c.fill();
          c.strokeStyle = 'rgba(70,130,220,.5)'; c.lineWidth = 1.5; const rp = fr(t * .8); c.beginPath(); c.ellipse(w * .3, h * .9, m * .1 * rp, m * .02 * rp, 0, 0, TAU); c.stroke();
          emo(c, '🐶', w / 2, h * .66, m * .38, { rot: Math.sin(t * 8) * .03 });
          IK.cloud(c, w * .15, h * .2, m * .7, '#EEF3F8', 'rgba(100,120,150,.5)');
          c.fillStyle = '#3D8BFF';
          for (let i = 0; i < 10; i++) { const p = fr(t * 1.1 + i * .13), x = w * (.18 + (i * .083) % .66); c.beginPath(); c.ellipse(x, h * .28 + p * h * .55, m * .012, m * .026, 0, 0, TAU); c.fill(); }
        } else {
          vgrad(c, w, h, '#FFF3C4', '#FFE09A'); ground(c, w, h, h * .8, '#C9E59A', '#9CCB6A');
          sunDisk(c, w * .8, h * .18, m * .09, t);
          emo(c, '🐶', w / 2, h * .66 + Math.sin(t * 2) * m * .01, m * .38);
          for (let i = 0; i < 3; i++) { c.globalAlpha = .5 + .5 * Math.sin(t * 4 + i * 2); IK.sparkle(c, w * (.25 + i * .25), h * (.42 - (i % 2) * .1), m * .06); }
          c.globalAlpha = 1;
        }
        break;
      }
      case 'weight': {
        vgrad(c, w, h, '#EDEBF5', '#D3D0E3');
        if (side === 0) {
          const sq = .5 + .5 * Math.sin(t * 2.4);
          const cw = m * .7, chh = m * (.12 - sq * .03), cy = h * .86 - chh;
          c.fillStyle = '#FF8FB1'; c.beginPath(); c.roundRect(w / 2 - cw / 2 - sq * m * .03, cy, cw + sq * m * .06, chh, chh / 2); c.fill();
          c.fillStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.roundRect(w / 2 - cw * .4, cy + 2, cw * .8, chh * .3, chh * .15); c.fill();
          const ww = m * .5, wh = m * .4, wy = cy - wh;
          c.lineWidth = m * .07; c.strokeStyle = '#45406A'; c.beginPath(); c.arc(w / 2, wy + wh * .05, ww * .28, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
          const g = c.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, '#8A85AD'); g.addColorStop(.5, '#5A5580'); g.addColorStop(1, '#2E2A4A');
          c.fillStyle = g; c.beginPath(); c.moveTo(w / 2 - ww * .35, wy); c.lineTo(w / 2 + ww * .35, wy); c.lineTo(w / 2 + ww * .5, wy + wh); c.lineTo(w / 2 - ww * .5, wy + wh); c.closePath(); c.fill();
          c.fillStyle = '#fff'; c.font = `900 ${m * .14}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr'; c.fillText('10kg', w / 2, wy + wh * .58);
          c.strokeStyle = 'rgba(80,70,120,.5)'; c.lineWidth = 2;
          for (const s of [-1, 1]) { c.beginPath(); c.moveTo(w / 2 + s * cw * .55, cy - m * .02); c.lineTo(w / 2 + s * cw * .7, cy - m * .08); c.stroke(); }
        } else {
          const p = fr(t * .12), x = w / 2 + Math.sin(t * 1.6) * m * .22, y = h * .15 + p * h * .65;
          c.globalAlpha = Math.min(1, (1 - p) * 4, p * 8);
          emo(c, '🪶', x, y, m * .4, { rot: Math.sin(t * 1.6) * .5 });
          c.globalAlpha = 1;
        }
        break;
      }
      case 'inout': {
        vgrad(c, w, h, '#E1F8EE', '#B5EBD3');
        const cx = side === 0 ? w / 2 : w * .4, s = m * .82;
        cage(c, cx, h * .45, s, false);
        if (side === 0) { emo(c, '🐦', cx, h * .5 + Math.sin(t * 3) * m * .02, m * .3); cage(c, cx, h * .45, s, true, false); }
        else {
          cage(c, cx, h * .45, s, true, true);
          const a = t * 1.3; emo(c, '🐦', w * .7 + Math.cos(a) * m * .14, h * .26 + Math.sin(a * 2) * m * .06, m * .26, { sx: Math.sin(a) > 0 ? 1 : -1, rot: Math.sin(t * 10) * .1 });
        }
        break;
      }
      case 'clean': {
        if (side === 0) {
          vgrad(c, w, h, '#E3F6FF', '#BFE6FF');
          c.fillStyle = 'rgba(120,190,240,.3)'; c.beginPath(); c.ellipse(w / 2, h * .86, m * .38, m * .07, 0, 0, TAU); c.fill();
          emo(c, '🐷', w / 2, h * .58, m * .52, { rot: Math.sin(t * 2) * .04 });
          for (let i = 0; i < 6; i++) {
            const p = fr(t * .3 + i * .17), x = w * (.15 + (i * .14) % .7), y = h * .8 - p * h * .7, r = m * (.03 + (i % 3) * .015);
            c.globalAlpha = 1 - p; c.strokeStyle = 'rgba(255,255,255,.95)'; c.lineWidth = 1.5; c.fillStyle = 'rgba(255,255,255,.25)';
            c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.stroke();
          }
          c.globalAlpha = 1;
          for (let i = 0; i < 2; i++) { c.globalAlpha = .5 + .5 * Math.sin(t * 5 + i * 3); IK.sparkle(c, w * (.3 + i * .42), h * (.28 + i * .1), m * .07); }
          c.globalAlpha = 1;
        } else {
          vgrad(c, w, h, '#F2E3CF', '#D9BC96');
          c.fillStyle = '#8A5A2E'; c.beginPath(); c.ellipse(w / 2, h * .86, m * .4, m * .08, 0, 0, TAU); c.fill();
          emo(c, '🐷', w / 2, h * .58, m * .52, { rot: Math.sin(t * 1.2) * .03 });
          mud(c, w / 2, h * .6, m * .5, t);
        }
        break;
      }
      case 'many': {
        vgrad(c, w, h, '#FFE8F0', '#FFC9DC');
        c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(w / 2, h * .8, m * .44, m * .1, 0, 0, TAU); c.fill();
        const pts = side === 0 ? [[-.3, .1], [-.1, .1], [.1, .1], [.3, .1], [-.2, -.08], [0, -.08], [.2, -.08], [-.1, -.26], [.1, -.26]] : [[-.12, .1], [.12, .1]];
        pts.forEach(([dx, dy], i) => { const b = Math.max(0, Math.sin(t * 4 - i * .6)) * m * .03; emo(c, '🍎', w / 2 + dx * m, h * .62 + dy * m - b, m * .2); });
        break;
      }
      case 'near': {
        vgrad(c, w, h, '#BEE6FF', '#E8F7FF');
        const hy = h * .42;
        c.fillStyle = '#8AD67A'; c.fillRect(0, hy, w, h - hy);
        c.fillStyle = '#A6B0C2'; c.beginPath(); c.moveTo(w * .47, hy); c.lineTo(w * .53, hy); c.lineTo(w * .9, h); c.lineTo(w * .1, h); c.fill();
        c.fillStyle = '#fff'; for (let i = 0; i < 5; i++) { const a = i / 5, b = (i + .5) / 5; const y1 = hy + (h - hy) * a * a, y2 = hy + (h - hy) * b * b; c.beginPath(); c.moveTo(w / 2 - 1 - a * m * .02, y1); c.lineTo(w / 2 + 1 + a * m * .02, y1); c.lineTo(w / 2 + 1 + b * m * .02, y2); c.lineTo(w / 2 - 1 - b * m * .02, y2); c.fill(); }
        c.fillStyle = 'rgba(80,150,80,.6)'; c.beginPath(); c.ellipse(w * .3, hy, w * .3, h * .04, 0, Math.PI, 0); c.fill(); c.beginPath(); c.ellipse(w * .78, hy, w * .25, h * .035, 0, Math.PI, 0); c.fill();
        if (side === 0) { shadowE(c, w * .22, h * .92, m * .2); emo(c, '🌳', w * .22, h * .64, m * .62, { rot: Math.sin(t * 1.5) * .02 }); }
        else { emo(c, '🌳', w * .62, hy - m * .02, m * .12, { rot: Math.sin(t * 1.5) * .03 }); }
        break;
      }
    }
  }

  /* ---------- البطاقات ---------- */
  function drawCardBack(c, w, h, col, t) {
    const r = Math.min(w, h) * .14;
    let g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, '#FF8FB8'); g.addColorStop(1, '#D6336C');
    c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, r); c.fill();
    c.save(); c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, r); c.clip();
    c.fillStyle = 'rgba(255,255,255,.14)';
    const s = Math.min(w, h) * .18;
    for (let y = -h / 2; y < h / 2 + s; y += s) for (let x = -w / 2 + ((y / s) & 1 ? s / 2 : 0); x < w / 2 + s; x += s) { c.beginPath(); c.arc(x, y, s * .16, 0, TAU); c.fill(); }
    c.restore();
    c.lineWidth = Math.max(3, w * .045); c.strokeStyle = '#fff'; c.beginPath(); c.roundRect(-w / 2 + w * .06, -h / 2 + w * .06, w - w * .12, h - w * .12, r * .7); c.stroke();
    const rr = Math.min(w, h) * .2;
    c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, rr, 0, TAU); c.fill();
    c.fillStyle = '#D6336C'; c.font = `900 ${rr * 1.3}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
    c.fillText('?', 0, rr * .08);
  }
  // card: {p, side, x, y, w, h, flip, sc, glow, bad, shake}
  function drawCard(c, cd, t) {
    if (cd.alpha === 0) return;
    const P = PAIRS[cd.p], [c1, c2] = P.c;
    const f = clamp(cd.flip, 0, 1), sx = Math.abs(Math.cos(f * Math.PI)), face = f >= .5;
    const w = cd.w, h = cd.h, r = Math.min(w, h) * .14, lift = Math.sin(f * Math.PI) * h * .06;
    const sh = cd.shake > 0 ? Math.sin(cd.shake * 40) * cd.shake * w * .05 : 0;
    c.save(); c.translate(cd.x + sh, cd.y - lift); c.scale((cd.sc || 1) * Math.max(.02, sx), cd.sc || 1);
    if (cd.alpha != null) c.globalAlpha = cd.alpha;
    // ظل وعمق
    c.save(); c.shadowColor = 'rgba(40,20,60,.3)'; c.shadowBlur = 14 + lift; c.shadowOffsetY = 7 + lift * .5;
    c.fillStyle = face ? c2 : '#A61E4D'; c.beginPath(); c.roundRect(-w / 2, -h / 2 + h * .035, w, h, r); c.fill(); c.restore();
    if (!face) { drawCardBack(c, w, h, c1, t); c.restore(); return; }
    if (cd.glow > 0) { c.save(); c.shadowColor = '#FFD43B'; c.shadowBlur = 30 * cd.glow; c.fillStyle = '#FFD43B'; c.beginPath(); c.roundRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8, r + 4); c.fill(); c.restore(); }
    let g = c.createLinearGradient(0, -h / 2, 0, h / 2); g.addColorStop(0, mix(c1, '#FFFFFF', .35)); g.addColorStop(1, c1);
    c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, r); c.fill();
    const bw = w * .045;
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-w / 2 + bw, -h / 2 + bw, w - bw * 2, h - bw * 2, r * .8); c.fill();
    // الصورة
    const ip = bw * 1.9, iw = w - ip * 2, ih = h - ip * 2 - h * .2;
    c.save(); c.beginPath(); c.roundRect(-w / 2 + ip, -h / 2 + ip, iw, ih, r * .6); c.clip();
    c.translate(-w / 2 + ip, -h / 2 + ip);
    try { illo(c, P.k, cd.side, iw, ih, t + cd.p * 1.3); } catch (e) { /* */ }
    c.restore();
    c.strokeStyle = 'rgba(0,0,0,.06)'; c.lineWidth = 2; c.beginPath(); c.roundRect(-w / 2 + ip, -h / 2 + ip, iw, ih, r * .6); c.stroke();
    // الكلمة
    const word = P[lang][cd.side];
    let fs = h * .13; c.font = `900 ${fs}px ${FONT}`; c.direction = lang === 'ar' ? 'rtl' : 'ltr';
    const tw = c.measureText(word).width; if (tw > iw * .95) { fs *= iw * .95 / tw; c.font = `900 ${fs}px ${FONT}`; }
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = mix(c2, '#1A0F30', .35); c.fillText(word, 0, h / 2 - ip - h * .095);
    // لمعة
    g = c.createLinearGradient(0, -h / 2, 0, -h / 2 + h * .3); g.addColorStop(0, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2 + bw, -h / 2 + bw, w - bw * 2, h * .25, r * .8); c.fill();
    if (cd.bad > 0) {
      c.fillStyle = `rgba(255,255,255,${cd.bad * .55})`; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, r); c.fill();
      c.globalAlpha *= cd.bad; c.fillStyle = '#F03E3E'; c.beginPath(); c.arc(w * .3, -h * .32, w * .12, 0, TAU); c.fill();
      c.strokeStyle = '#fff'; c.lineWidth = w * .03; c.lineCap = 'round'; const q = w * .05;
      c.beginPath(); c.moveTo(w * .3 - q, -h * .32 - q); c.lineTo(w * .3 + q, -h * .32 + q); c.moveTo(w * .3 + q, -h * .32 - q); c.lineTo(w * .3 - q, -h * .32 + q); c.stroke();
    }
    if (cd.ok) {
      c.fillStyle = '#37B24D'; c.beginPath(); c.arc(w * .34, -h * .36, w * .11, 0, TAU); c.fill();
      c.strokeStyle = '#fff'; c.lineWidth = w * .03; c.lineCap = 'round'; c.lineJoin = 'round'; const q = w * .05;
      c.beginPath(); c.moveTo(w * .34 - q, -h * .36); c.lineTo(w * .34 - q * .2, -h * .36 + q * .8); c.lineTo(w * .34 + q * 1.1, -h * .36 - q * .8); c.stroke();
    }
    c.restore();
  }
  function drawSlot(c, x, y, w, h, t, hl) {
    const r = Math.min(w, h) * .14, p = .5 + .5 * Math.sin(t * 4);
    c.save();
    c.fillStyle = hl ? 'rgba(255,255,255,.85)' : `rgba(255,255,255,${.45 + p * .15})`;
    c.strokeStyle = hl ? '#FFB020' : '#fff'; c.lineWidth = 5; c.setLineDash([w * .07, w * .05]);
    c.beginPath(); c.roundRect(x - w / 2, y - h / 2, w, h, r); c.fill(); c.stroke(); c.setLineDash([]);
    c.fillStyle = hl ? '#FFB020' : 'rgba(214,51,108,.55)'; c.font = `900 ${h * .4}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
    c.fillText('?', x, y + h * .03 + Math.sin(t * 3) * 3);
    c.restore();
  }

  /* ---------- الواجهة ---------- */
  App.css(`
  #opposites{background:#FFE3EE;overflow:hidden}
  #opposites canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #opposites .ib{color:#D6336C}
  #opposites .lang{display:flex;background:rgba(255,255,255,.95);border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;
    box-shadow:0 4px 0 rgba(160,30,80,.18),0 7px 12px rgba(160,30,80,.14)}
  #opposites .lang button{padding:6px 14px;border-radius:99px;font-weight:900;font-size:17px;background:transparent;color:#A61E4D;line-height:1.2;transition:transform .14s var(--press)}
  #opposites .lang button.on{background:linear-gradient(#FF8FB8,#E64980 60%,#C2255C);color:#fff;box-shadow:0 3px 0 #A61E4D,inset 0 2px 0 rgba(255,255,255,.4);text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #opposites .lang button:active{transform:scale(.92)}
  #opposites .prog{position:absolute;z-index:4;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 58px);
    width:min(calc(100% - 32px),420px);height:16px;display:flex;gap:5px;padding:3px;border-radius:99px;background:rgba(255,255,255,.75);
    box-shadow:0 3px 0 rgba(160,30,80,.15),inset 0 1px 2px rgba(0,0,0,.08)}
  #opposites .prog i{flex:1;border-radius:99px;background:#F5DCE6;box-shadow:inset 0 2px 2px rgba(0,0,0,.08)}
  #opposites .prog i.on{background:linear-gradient(#8CE58F,#3DBE52);box-shadow:inset 0 2px 0 rgba(255,255,255,.5),0 1px 0 #2A9440;animation:opPop .4s}
  #opposites .prog i.cur{background:linear-gradient(#FFE07A,#FFC234)}
  @keyframes opPop{40%{transform:scaleY(1.6)}}
  #opposites .q{position:absolute;z-index:4;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 84px);
    white-space:nowrap;font-weight:900;font-size:clamp(20px,5.6vw,28px);color:#A61E4D;background:#fff;border-radius:99px;padding:4px 22px;
    box-shadow:0 4px 0 #FFB3CF,0 8px 16px rgba(160,30,80,.15);border:3px solid #FFE0EC;transition:opacity .3s}
  #opposites .q.off{opacity:0}
  #opposites .q b{color:#E8590C}
  #opposites .q.en{direction:ltr}
  #opposites .spk{position:absolute;z-index:4;width:64px;height:64px;border-radius:50%;font-size:28px;display:grid;place-items:center;
    bottom:calc(max(12px,env(safe-area-inset-bottom)) + 4px);background:radial-gradient(circle at 35% 30%,#FFF3A8 0,#FFD43B 40%,#F5A900 100%);border:4px solid #FFF6CC;color:#7A3E00;
    box-shadow:0 5px 0 #C98500,0 10px 16px rgba(150,90,0,.35);transition:transform .14s var(--press)}
  #opposites .spk:active{transform:translateY(4px) scale(1.06,.9);box-shadow:0 1px 0 #C98500}
  #opposites .lvbtn .cnt{background:#D6336C}
  #opposites .panel{border-color:#FFC2D8;box-shadow:0 10px 0 #E64980,0 24px 44px rgba(80,0,40,.32),inset 0 0 0 3px #fff}
  #opposites .panel h3{color:#C2255C}
  #opposites .overlay{background:radial-gradient(circle at 50% 45%,rgba(120,20,70,.25),rgba(60,10,40,.55))}
  #opposites .lvp{width:min(94vw,440px);max-height:calc(100% - 20px);overflow-y:auto;touch-action:pan-y}
  #opposites .lvp .lang{display:inline-flex;margin:2px auto 10px;box-shadow:0 3px 0 #FFC2D8;border-color:#FFE0EC;background:#FFF0F5}
  #opposites .tier{display:flex;align-items:center;gap:8px;margin:6px 2px;font-weight:900;font-size:16px;color:#A61E4D}
  #opposites .tier::after{content:'';flex:1;height:5px;border-radius:5px;background:repeating-linear-gradient(90deg,#FFC2D8 0 9px,transparent 9px 15px)}
  #opposites .lvg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:6px}
  #opposites .lvg.m{grid-template-columns:repeat(4,1fr)}
  #opposites .lv{position:relative;height:74px;border-radius:22px;font-weight:900;font-size:26px;color:#fff;line-height:1;padding-bottom:12px;
    background:linear-gradient(var(--l),var(--c));border:3px solid #fff;box-shadow:0 5px 0 var(--d),0 9px 14px rgba(0,0,0,.15);text-shadow:0 2px 0 rgba(0,0,0,.2);transition:transform .14s var(--press)}
  #opposites .lv:active{transform:translateY(3px) scale(1.04,.94)}
  #opposites .lv small{display:block;font-size:12px;margin-top:2px;opacity:.9}
  #opposites .lv .s{position:absolute;bottom:5px;left:0;right:0;font-size:13px;letter-spacing:-1px;text-shadow:none}
  #opposites .lv .s i{font-style:normal}
  #opposites .lv .s i.off{filter:grayscale(1);opacity:.35}
  #opposites .lv.cur::before{content:'';position:absolute;inset:-8px;border-radius:28px;border:4px solid #FF8FB8;animation:opRing 1.2s infinite}
  @keyframes opRing{0%{transform:scale(.92);opacity:1}100%{transform:scale(1.15);opacity:0}}
  #opposites .lv.lock{--c:#CFC6D8;--l:#E6E0EC;--d:#A99DB6;color:#8C8098;text-shadow:none}
  #opposites .lv.lock::after{content:'🔒';position:absolute;top:-8px;left:-6px;font-size:18px}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🗺️<span class="cnt">١</span></button>
      <span class="grow"></span>
      <div class="lang top"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="prog"></div>
    <div class="q off"></div>
    <button class="spk" aria-label="أعد السؤال">🔊</button>
    <div class="overlay" id="opLv"><div class="panel lvp"><h3>🔀 المستويات</h3>
      <div class="lang"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
      <div class="lvl"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="opWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again" aria-label="أعد">🔄</button><button class="btn alt" data-a="levels">🗺️ المستويات</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const progEl = root.querySelector('.prog'), qEl = root.querySelector('.q'), spk = root.querySelector('.spk');
  const lvOv = root.querySelector('#opLv'), winOv = root.querySelector('#opWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, top = 100;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lang = 'ar', lvl = 1, L = LV[0], phase = 'idle', mistakes = 0;
  let rounds = [], ri = 0, R = null, cards = [], parts = [], drag = null, shake = 0, G = {};
  let open = [], matched = 0, moves = 0, busy = false;
  const timers = [];
  const later = (ms, f) => { const id = setTimeout(() => { const i = timers.indexOf(id); if (i >= 0) timers.splice(i, 1); if (App.current === ID) f(); }, ms); timers.push(id); };
  const clearTimers = () => { timers.forEach(clearTimeout); timers.length = 0; };
  const isAr = () => lang === 'ar';
  const say = t => App.speak(t, isAr() ? 'ar' : 'en');
  const wordOf = (p, s) => PAIRS[p][lang][s];
  const praise = () => isAr() ? App.speak(App.g('أحسنتِ!', 'أحسنت!')) : App.speak('Great job!', 'en');

  /* ---------- التخطيط ---------- */
  function measure() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const pb = progEl.getBoundingClientRect().bottom || 92;
    top = pb + 6;
  }
  function layoutChoose() {
    const land = W > H * 1.15, PW = Math.min(W - 24, land ? 1100 : 760);
    const qh = 56, sb = 90; // مساحة السؤال، وزر الصوت في الأسفل
    const avail = H - top - qh - (land ? 24 : sb);
    const n = R && R.opts.length ? R.opts.length : L.opts;
    let cw, ow;
    if (land) {
      // الزوج على جانب والخيارات على الجانب الآخر
      cw = Math.min((PW * .55 - 40) / 2, avail / 1.25, 260);
      ow = Math.min((PW * .42 - 20) / Math.min(n, 2) - 16, (avail - 14) / (n > 2 ? 2 : 1) / 1.25 - 10, cw * .85);
      G = { land, cw, ch: cw * 1.25, ow, oh: ow * 1.25 };
      const pcx = W / 2 + (isAr() ? 1 : -1) * PW * .22, ocx = W / 2 - (isAr() ? 1 : -1) * PW * .27, cy = top + qh + avail / 2;
      G.main = { x: pcx + (isAr() ? 1 : -1) * (cw / 2 + 14), y: cy };
      G.slot = { x: pcx - (isAr() ? 1 : -1) * (cw / 2 + 14), y: cy };
      G.opts = Array.from({ length: n }, (_, i) => {
        const cols = n > 2 ? 2 : n, r = Math.floor(i / cols), ci = i % cols, inRow = Math.min(cols, n - r * cols), rows = Math.ceil(n / cols);
        return { x: ocx + (isAr() ? 1 : -1) * ((inRow - 1) / 2 - ci) * (ow + 16), y: cy + (r - (rows - 1) / 2) * (ow * 1.25 + 16) };
      });
    } else {
      cw = Math.min((PW - 30) / 2, 260);
      ow = Math.min((PW - (n - 1) * 14) / n, cw * .9, 200);
      let k = Math.min(1, avail / (cw * 1.25 + ow * 1.25 + 40));
      cw *= k; ow *= k;
      G = { land, cw, ch: cw * 1.25, ow, oh: ow * 1.25 };
      const gap = (avail - G.ch - G.oh) / 3;
      const py = top + qh + gap + G.ch / 2, oy = py + G.ch / 2 + gap + G.oh / 2;
      G.main = { x: W / 2 + (isAr() ? 1 : -1) * (cw / 2 + 12), y: py };
      G.slot = { x: W / 2 - (isAr() ? 1 : -1) * (cw / 2 + 12), y: py };
      G.opts = Array.from({ length: n }, (_, i) => ({ x: W / 2 + (isAr() ? 1 : -1) * ((n - 1) / 2 - i) * (ow + 14), y: oy }));
    }
  }
  function safeBottom() { const d = document.createElement('div'); d.style.cssText = 'position:fixed;bottom:0;padding-bottom:env(safe-area-inset-bottom);visibility:hidden'; document.body.appendChild(d); const v = d.offsetHeight || 0; d.remove(); return v; }
  function layoutMemory() {
    const n = L.pairs * 2, land = W > H * 1.15;
    const PW = Math.min(W - 20, 900), AH = H - top - 24 - safeBottom(), g = 12;
    let best = null;
    for (let cols = 2; cols <= 8; cols++) {
      const rows = Math.ceil(n / cols);
      const cw = Math.min((PW - (cols - 1) * g) / cols, ((AH - (rows - 1) * g) / rows) / 1.25, 210);
      if (!best || cw > best.cw) best = { cols, rows, cw };
    }
    G = { land, cols: best.cols, rows: best.rows, cw: best.cw, ch: best.cw * 1.25, g };
    const tw = best.cols * best.cw + (best.cols - 1) * g, th = best.rows * G.ch + (best.rows - 1) * g;
    const y0 = top + 8 + (AH - th) / 2;
    G.cells = Array.from({ length: n }, (_, i) => {
      const r = Math.floor(i / best.cols), ci = i % best.cols, inRow = Math.min(best.cols, n - r * best.cols);
      const rw = inRow * best.cw + (inRow - 1) * g;
      const x0 = W / 2 + (isAr() ? 1 : -1) * (rw / 2 - best.cw / 2);
      return { x: x0 - (isAr() ? 1 : -1) * ci * (best.cw + g), y: y0 + G.ch / 2 + r * (G.ch + g) };
    });
    void tw;
  }
  function layout() {
    measure();
    if (L.m === 'c') {
      layoutChoose();
      if (R) {
        R.main.tx = G.main.x; R.main.ty = G.main.y; R.main.w = G.cw; R.main.h = G.ch;
        R.opts.forEach((o, i) => {
          o.hx = G.opts[i].x; o.hy = G.opts[i].y;
          if (o.won) { o.tx = G.slot.x; o.ty = G.slot.y; o.tw = G.cw; o.th = G.ch; }
          else if (!o.out) { o.tx = o.hx; o.ty = o.hy; o.tw = G.ow; o.th = G.oh; }
        });
      }
    } else {
      layoutMemory();
      cards.forEach((cd, i) => { cd.tx = G.cells[i].x; cd.ty = G.cells[i].y; cd.tw = G.cw; cd.th = G.ch; });
    }
    spk.style.left = isAr() ? 'max(14px, env(safe-area-inset-left))' : 'auto';
    spk.style.right = isAr() ? 'auto' : 'max(14px, env(safe-area-inset-right))';
    spk.style.display = L.m === 'c' ? '' : 'none';
  }

  /* ---------- الجولات ---------- */
  function mkCard(p, side, x, y, w, h) { return { p, side, x, y, w, h, tx: x, ty: y, tw: w, th: h, flip: 0, ft: 0, sc: 1, glow: 0, bad: 0, shake: 0 }; }
  function startLevel(n) {
    lvl = clamp(n, 1, NL); L = LV[lvl - 1];
    clearTimers(); winOv.classList.remove('on'); lvOv.classList.remove('on');
    mistakes = 0; parts = []; drag = null; R = null; cards = []; open = []; matched = 0; moves = 0; busy = false; phase = 'play';
    root.querySelector('.lvbtn .cnt').textContent = L.m === 'm' ? '🧠' : numL(lvl, lang);
    progEl.style.direction = isAr() ? 'rtl' : 'ltr';
    if (L.m === 'c') {
      const set = shuffle((L.set || PAIRS.map((_, i) => i)).slice());
      rounds = []; for (let i = 0; i < L.n; i++) rounds.push(set[i % set.length]);
      ri = 0; layout(); renderProg(); startRound();
    } else {
      qEl.classList.add('off');
      const ps = shuffle(PAIRS.map((_, i) => i)).slice(0, L.pairs);
      const deck = shuffle(ps.flatMap(p => [[p, 0], [p, 1]]));
      layout();
      cards = deck.map(([p, s], i) => { const c = mkCard(p, s, W / 2, H + 200, G.cw, G.ch); c.tx = G.cells[i].x; c.ty = G.cells[i].y; c.delay = T + .1 + i * .06; return c; });
      renderProg();
      later(400, () => say(isAr() ? 'طابق الأضداد' : 'Match the opposites'));
      Sound.whoosh();
    }
  }
  function renderProg() {
    const n = L.m === 'c' ? rounds.length : L.pairs, k = L.m === 'c' ? ri : matched;
    progEl.innerHTML = Array.from({ length: n }, (_, i) => `<i class="${i < k ? 'on' : i === k ? 'cur' : ''}"></i>`).join('');
  }
  function startRound() {
    const p = rounds[ri], side = Math.random() < .5 ? 0 : 1;
    const others = shuffle(PAIRS.map((_, i) => i).filter(i => i !== p)).slice(0, L.opts - 1);
    const optsDef = shuffle([[p, 1 - side, true], ...others.map(o => [o, Math.random() < .5 ? 0 : 1, false])]);
    R = { p, side, opts: [], wrong: 0, done: false };
    layoutChoose();
    R.main = mkCard(p, side, G.main.x, -G.ch, G.cw, G.ch); R.main.tx = G.main.x; R.main.ty = G.main.y; R.main.ft = 1; R.main.delay = T;
    R.opts = optsDef.map(([op, os, ok], i) => {
      const c = mkCard(op, os, G.opts[i].x, H + G.oh, G.ow, G.oh);
      c.hx = G.opts[i].x; c.hy = G.opts[i].y; c.tx = c.hx; c.ty = c.hy; c.correct = ok; c.delay = T + .45 + i * .12;
      return c;
    });
    cards = [R.main, ...R.opts];
    renderProg(); showQ();
    Sound.whoosh();
    later(300, () => Sound.slide());
    later(700, askQ);
  }
  function showQ() {
    const wd = wordOf(R.p, R.side);
    qEl.classList.toggle('en', !isAr());
    qEl.innerHTML = isAr() ? `ما عكس «<b>${wd}</b>»؟` : `The opposite of “<b>${wd}</b>”?`;
    qEl.classList.remove('off');
  }
  function askQ() {
    if (!R) return;
    const wd = wordOf(R.p, R.side);
    isAr() ? App.speak('ما عكس ' + wd) : App.speak('What is the opposite of ' + wd, 'en');
  }
  function choose(o) {
    if (!R || R.done || o.bad > .3 || o.out) return;
    if (o.correct) {
      R.done = true; o.won = true; o.ok = true;
      o.tx = G.slot.x; o.ty = G.slot.y; o.tw = G.cw; o.th = G.ch;
      Sound.pop(); vibrate(20);
      R.opts.forEach(q => { if (q !== o) { q.out = true; q.tx = q.x; q.ty = H + q.h; q.ft = 0; } });
      later(380, () => {
        R.main.glow = 1; o.glow = 1; R.main.ok = true;
        Sound.star(); setTimeout(() => Sound.coin(), 120);
        burst(G.main.x, G.main.y, 22); burst(G.slot.x, G.slot.y, 22);
        App.speak(isAr() ? wordOf(R.p, R.side) + ' ' + wordOf(R.p, 1 - R.side) : wordOf(R.p, R.side) + ' ' + wordOf(R.p, 1 - R.side), isAr() ? 'ar' : 'en');
      });
      ri++; renderProg();
      later(2400, () => {
        cards.forEach(c => { c.tx = c.x + (isAr() ? -1 : 1) * W; });
        Sound.whoosh();
        later(450, () => { if (ri >= rounds.length) levelWin(); else startRound(); });
      });
    } else {
      mistakes++; R.wrong++;
      o.shake = 1; o.bad = 1; shake = 4;
      Sound.error(); vibrate(30);
      say(wordOf(o.p, o.side));
      o.tx = o.hx; o.ty = o.hy;
      if (R.wrong >= 2) R.opts.forEach(q => { if (q.correct) q.hint = T + 5; });
    }
  }
  /* ---------- الذاكرة ---------- */
  function flipCard(cd) {
    if (busy || cd.ft === 1 || cd.matched || T < (cd.delay || 0) + .3) return;
    cd.ft = 1; Sound.tone(520, .08, 'triangle', .1, 200); vibrate(8);
    say(wordOf(cd.p, cd.side));
    open.push(cd);
    if (open.length === 2) {
      moves++; busy = true;
      const [a, b] = open;
      if (a.p === b.p) {
        later(500, () => {
          a.matched = b.matched = true; a.glow = b.glow = 1; a.ok = b.ok = true;
          Sound.star(); burst(a.x, a.y, 16); burst(b.x, b.y, 16); vibrate(20);
          const first = a.side === 0 ? a : b, second = first === a ? b : a;
          App.speak(wordOf(first.p, 0) + ' ' + wordOf(second.p, 1), isAr() ? 'ar' : 'en');
          matched++; renderProg(); open = []; busy = false;
          if (matched >= L.pairs) later(1500, levelWin);
        });
      } else {
        mistakes++;
        later(1100, () => { a.ft = 0; b.ft = 0; a.shake = b.shake = .6; Sound.tone(300, .12, 'triangle', .08, -60); open = []; busy = false; });
      }
    }
  }
  /* ---------- النهاية ---------- */
  function levelWin() {
    phase = 'over'; qEl.classList.add('off');
    const pr = loadProg(), key = 'l' + lvl;
    const stars = L.m === 'c' ? (mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1) : (mistakes <= Math.ceil(L.pairs / 2) ? 3 : mistakes <= L.pairs + 1 ? 2 : 1);
    const prev = pr.stars[key] || 0;
    if (stars > prev) pr.stars[key] = stars;
    if (L.m === 'c' && lvl >= pr.uc && lvl < NC) pr.uc = lvl + 1;
    if (L.m === 'm' && lvl >= pr.um && lvl < NL) pr.um = lvl + 1;
    store.set('oppositesProg', pr);
    Sound.win(); confetti(140);
    later(700, () => {
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنت!') + ' 🎉';
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wP').textContent = L.m === 'c'
        ? `🔀 ${App.g('عرفتِ', 'عرفتَ')} ${numL(rounds.length, lang)} أضداد` + (mistakes ? ` · الأخطاء: ${numL(mistakes, lang)}` : ' دون أي خطأ! 💯')
        : `🧠 ${App.g('طابقتِ', 'طابقتَ')} ${numL(L.pairs, lang)} أزواج في ${numL(moves, lang)} محاولة`;
      const nx = root.querySelector('[data-a="next"]');
      nx.style.display = (lvl === NC || lvl === NL) ? 'none' : '';
      winOv.classList.add('on');
      praise();
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('opposites_first');
      if (L.m === 'm') App.achieve('opposites_memory');
      if (Array.from({ length: NL }, (_, i) => pr.stars['l' + (i + 1)]).every(Boolean)) App.achieve('opposites_all');
    });
  }

  /* ---------- الجسيمات ---------- */
  function burst(x, y, n) {
    for (let i = 0; i < n; i++) { const a = rand(0, TAU), v = rand(90, 280); parts.push({ t: Math.random() < .5 ? 'star' : 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, s: rand(4, 9), age: 0, life: rand(.5, .9), c: pick(['#FFD43B', '#FF7A2E', '#3E9BFF', '#4CC76A', '#FF5C7A']), rot: rand(0, TAU), g: 400 }); }
  }
  function confetti(n) {
    for (let i = 0; i < n; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-60, -10), vx: rand(-40, 40), vy: rand(60, 180), s: rand(6, 11), age: 0, life: rand(2, 3.2), c: pick(['#FFD43B', '#FF7A2E', '#3E9BFF', '#4CC76A', '#FF5C7A', '#B26BFF']), rot: rand(0, TAU), vr: rand(-6, 6), g: 30 });
  }

  /* ---------- القائمة/المستويات ---------- */
  function paintLang() { root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang)); }
  function setLang(l, fromPanel) {
    if (l === lang) return;
    lang = l; store.set('oppositesLang', lang); paintLang(); Sound.tap();
    if (fromPanel) { renderLevels(); return; }
    progEl.style.direction = isAr() ? 'rtl' : 'ltr';
    root.querySelector('.lvbtn .cnt').textContent = L.m === 'm' ? '🧠' : numL(lvl, lang);
    if (L.m === 'c' && R && phase === 'play') { layout(); R.main.tx = G.main.x; showQ(); askQ(); }
    else layout();
  }
  function renderLevels() {
    const pr = loadProg(), box = root.querySelector('.lvl');
    const btn = (n, lock, l, c, d, lab) => {
      const s = pr.stars['l' + n] || 0;
      return `<button class="lv${lock ? ' lock' : ''}${n === lvl && phase !== 'idle' ? ' cur' : ''}" data-l="${n}" style="--l:${l};--c:${c};--d:${d}" aria-label="المستوى ${n}">${lab}
        <span class="s">${lock ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    };
    let html = `<div class="tier">🔀 ${App.g('اختاري', 'اختر')} العكس</div><div class="lvg">`;
    for (let n = 1; n <= NC; n++) html += btn(n, n > pr.uc, '#FF9EC2', '#E64980', '#A61E4D', numL(n, lang));
    html += `</div><div class="tier">🧠 لعبة الذاكرة</div><div class="lvg m">`;
    for (let n = NC + 1; n <= NL; n++) html += btn(n, n > pr.um, '#B794FF', '#7048E8', '#4F2BC2', `${numL(LV[n - 1].pairs * 2, lang)}<small>بطاقات</small>`);
    box.innerHTML = html + '</div>';
    box.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l, p = loadProg();
      if (n <= NC ? n > p.uc : n > p.um) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
  }
  function openLevels() { paintLang(); renderLevels(); winOv.classList.remove('on'); lvOv.classList.add('on'); }
  function act(a) {
    Sound.tap();
    if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
    else if (a === 'close') {
      lvOv.classList.remove('on');
      if (phase === 'over') winOv.classList.add('on');
      else { progEl.style.direction = isAr() ? 'rtl' : 'ltr'; root.querySelector('.lvbtn .cnt').textContent = L.m === 'm' ? '🧠' : numL(lvl, lang); layout(); if (R && L.m === 'c') showQ(); }
    }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });
  root.querySelectorAll('.lang.top button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l, false)));
  root.querySelectorAll('.lvp .lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l, true)));
  spk.addEventListener('click', () => { Sound.tap(); if (R && !R.done) askQ(); });
  qEl.addEventListener('click', () => { if (R && !R.done) askQ(); });

  /* ---------- الإدخال ---------- */
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const hit = (cd, m) => Math.abs(m.x - cd.x) < cd.w / 2 && Math.abs(m.y - cd.y) < cd.h / 2;
  cv.addEventListener('pointerdown', e => {
    if (paused || phase !== 'play' || drag) return;
    Sound.ac(true);
    const m = pos(e);
    if (L.m === 'm') { const cd = cards.find(c => hit(c, m)); if (cd) flipCard(cd); return; }
    if (!R) return;
    if (hit(R.main, m)) { say(wordOf(R.main.p, R.main.side)); R.main.sc = 1.06; return; }
    if (R.done) return;
    const o = R.opts.find(c => !c.out && hit(c, m) && T > c.delay + .4);
    if (!o) return;
    drag = { o, id: e.pointerId, ox: o.x - m.x, oy: o.y - m.y, sx: m.x, sy: m.y, moved: false, over: false };
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    Sound.tap();
    cards.splice(cards.indexOf(o), 1); cards.push(o);
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || drag.id !== e.pointerId) return;
    const m = pos(e);
    if (!drag.moved && Math.hypot(m.x - drag.sx, m.y - drag.sy) > 10) drag.moved = true;
    if (drag.moved) { drag.o.tx = drag.o.x = m.x + drag.ox; drag.o.ty = drag.o.y = m.y + drag.oy; drag.over = Math.abs(drag.o.x - G.slot.x) < G.cw * .8 && Math.abs(drag.o.y - G.slot.y) < G.ch * .8; }
  });
  const endDrag = e => {
    if (!drag || drag.id !== e.pointerId) return;
    const d = drag; drag = null;
    if (!d.moved) { choose(d.o); return; }
    if (d.over) choose(d.o);
    else { d.o.tx = d.o.hx; d.o.ty = d.o.hy; Sound.slide(); }
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', e => { if (drag && drag.id === e.pointerId) { drag.o.tx = drag.o.hx; drag.o.ty = drag.o.hy; drag = null; } });
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on')) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(lvl === NC || lvl === NL ? 'levels' : 'next'); } return; }
    if (lvOv.classList.contains('on') || phase !== 'play') return;
    const n = +e.key;
    if (L.m === 'c' && R && n >= 1 && n <= R.opts.length) { const o = R.opts.slice().sort((a, b) => isAr() ? b.hx - a.hx : a.hx - b.hx)[n - 1]; if (o) choose(o); }
    else if (e.key === ' ') { e.preventDefault(); if (R) askQ(); }
  });

  /* ---------- التحديث والرسم ---------- */
  function update(dt) {
    T += dt;
    if (shake > 0) shake = Math.max(0, shake - dt * 18);
    const k = 1 - Math.exp(-dt * 12);
    for (const cd of cards) {
      if (cd.delay && T < cd.delay) continue;
      if (!(drag && drag.o === cd && drag.moved)) { cd.x += (cd.tx - cd.x) * k; cd.y += (cd.ty - cd.y) * k; }
      cd.w += (cd.tw - cd.w) * k; cd.h += (cd.th - cd.h) * k;
      if (L.m === 'c' && cd !== R?.main && !cd.out && cd.ft === 0 && T > cd.delay + .25) cd.ft = 1;
      const fs = dt * 3.6; cd.flip += clamp(cd.ft - cd.flip, -fs, fs);
      if (cd.flip > .48 && cd.flip < .52 && !cd.fl) { cd.fl = 1; }
      cd.sc += ((drag && drag.o === cd && drag.moved ? 1.08 : 1) - cd.sc) * k;
      cd.glow = Math.max(0, cd.glow - dt * .6);
      cd.bad = Math.max(0, cd.bad - dt * .9);
      cd.shake = Math.max(0, cd.shake - dt * 2.5);
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.age += dt;
      if (p.age >= p.life) { parts.splice(i, 1); continue; }
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += (p.g || 0) * dt; if (p.vr) p.rot += p.vr * dt;
    }
  }
  let bgC = null, bgKey = '';
  function buildBg() {
    const key = W + 'x' + H + dpr; if (key === bgKey) return; bgKey = key;
    bgC = mk(W * dpr, H * dpr); const c = bgC.getContext('2d'); c.scale(dpr, dpr);
    let g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#FFD6E6'); g.addColorStop(.5, '#FFEAF2'); g.addColorStop(1, '#FFF6E8');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    g = c.createRadialGradient(W / 2, H * .45, 0, W / 2, H * .45, Math.max(W, H) * .7); g.addColorStop(0, 'rgba(255,255,255,.7)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // نقوش ناعمة
    let sd = 5; const Rr = () => (sd = (sd * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 26; i++) {
      const x = Rr() * W, y = Rr() * H, s = 6 + Rr() * 14;
      c.globalAlpha = .18 + Rr() * .2; c.fillStyle = ['#FF8FB8', '#FFD43B', '#8FD3FF', '#B794FF'][i % 4];
      c.save(); c.translate(x, y); c.rotate(Rr() * TAU); if (i % 3) { c.beginPath(); c.arc(0, 0, s * .5, 0, TAU); c.fill(); } else { starPath(c, s * .7); c.fill(); } c.restore();
    }
    c.globalAlpha = 1;
    // طاولة سفلية
    g = c.createLinearGradient(0, H - 70, 0, H); g.addColorStop(0, 'rgba(255,200,220,0)'); g.addColorStop(1, 'rgba(255,170,200,.45)');
    c.fillStyle = g; c.fillRect(0, H - 70, W, 70);
  }
  function render() {
    if (!ctx) return;
    buildBg();
    const c = ctx;
    c.save();
    if (shake > 0) c.translate(rand(-shake, shake), 0);
    c.drawImage(bgC, 0, 0, W, H);
    if (L.m === 'c' && R) {
      // لوح الزوج
      const bx = (G.main.x + G.slot.x) / 2, by = G.main.y, bw = Math.min(G.cw * 2 + 44, W - 8), bh = G.ch + 30;
      c.save(); c.shadowColor = 'rgba(160,30,80,.18)'; c.shadowBlur = 20; c.shadowOffsetY = 8;
      c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 34); c.fill(); c.restore();
      c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 3; c.beginPath(); c.roundRect(bx - bw / 2, by - bh / 2, bw, bh, 34); c.stroke();
      if (!R.opts.some(o => o.won && Math.hypot(o.x - G.slot.x, o.y - G.slot.y) < 30)) drawSlot(c, G.slot.x, G.slot.y, G.cw, G.ch, T, drag && drag.over);
    }
    for (const cd of cards) {
      if (cd.delay && T < cd.delay) continue;
      if (cd.hint > T && !cd.won) { c.save(); c.globalAlpha = .4 + .3 * Math.sin(T * 8); c.fillStyle = '#FFD43B'; c.beginPath(); c.roundRect(cd.x - cd.w / 2 - 8, cd.y - cd.h / 2 - 8, cd.w + 16, cd.h + 16, cd.w * .18); c.fill(); c.restore(); }
      drawCard(c, cd, T);
    }
    if (L.m === 'c' && R) {
      // سهم التضاد بين البطاقتين
      if (Math.abs(R.main.x - G.main.x) < 30 && Math.abs(R.main.y - G.main.y) < 30) {
      const ax = (G.main.x + G.slot.x) / 2, ay = G.main.y, ar = Math.min(26, G.cw * .14) * (R.main.ok ? 1 + Math.sin(T * 8) * .1 : 1);
      c.save(); c.shadowColor = 'rgba(0,0,0,.2)'; c.shadowBlur = 6; c.shadowOffsetY = 3;
      c.fillStyle = R.main.ok ? '#37B24D' : '#fff'; c.beginPath(); c.arc(ax, ay, ar, 0, TAU); c.fill(); c.restore();
      c.fillStyle = R.main.ok ? '#fff' : '#D6336C'; c.font = `900 ${ar * 1.2}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'ltr';
      c.fillText('⇄', ax, ay + ar * .05);
      }
    }
    for (const p of parts) {
      const a = 1 - p.age / p.life;
      c.save(); c.globalAlpha = p.t === 'conf' ? Math.min(1, a * 3) : a; c.translate(p.x, p.y); c.rotate(p.rot); c.fillStyle = p.c;
      if (p.t === 'star') { starPath(c, p.s * (.6 + a * .5)); c.fill(); }
      else if (p.t === 'dot') { c.beginPath(); c.arc(0, 0, p.s * .45 * a + 1, 0, TAU); c.fill(); }
      else { c.scale(1, Math.cos(p.age * 9 + p.rot)); c.fillRect(-p.s / 2, -p.s * .3, p.s, p.s * .6); }
      c.restore();
    }
    c.restore();
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
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); cards.forEach(c => { c.x = c.tx; c.y = c.ty; c.w = c.tw; c.h = c.th; }); render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    IK.bg(c, s, ['#FFE3EE', '#FF8FB8', '#C2255C'], { seed: 9 });
    const sv = dpr; dpr = 2;
    IK.sticker(c, s, x => {
      const a = { p: 0, side: 0, x: s * .33, y: s * .5, w: s * .4, h: s * .5, flip: 1, sc: 1, glow: 0, bad: 0, shake: 0 };
      const b = { ...a, side: 1, x: s * .67, y: s * .56 };
      x.save(); x.translate(a.x, a.y); x.rotate(-.12); x.translate(-a.x, -a.y); drawCard(x, a, .5); x.restore();
      x.save(); x.translate(b.x, b.y); x.rotate(.12); x.translate(-b.x, -b.y); drawCard(x, b, .5); x.restore();
    }, { line: 0 });
    dpr = sv;
    IK.sparkle(c, s * .5, s * .14, 8);
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'الأضداد', icon2: '🔀', isNew: true, music: 'memory',
    desc: () => App.g('اقلبي البطاقات واختاري عكس كل صورة', 'اقلب البطاقات واختر عكس كل صورة'),
    help: () => [
      '👀 ' + App.g('انظري', 'انظر') + ' إلى البطاقة الكبيرة و' + App.g('اسمعي', 'اسمع') + ' الكلمة: كبير، حار، نهار…',
      '👆 ' + App.g('اختاري', 'اختر') + ' عكسها من البطاقات في الأسفل، ' + App.g('المسيها', 'المسها') + ' أو ' + App.g('اسحبيها', 'اسحبها') + ' إلى مكان ❓',
      '🧠 في لعبة الذاكرة ' + App.g('اقلبي', 'اقلب') + ' بطاقتين، وإذا كانتا ضدين تبقيان مقلوبتين',
      '🔊 الزر الأصفر يعيد السؤال، و🌍 ' + App.g('اختاري', 'اختر') + ' «عربي» أو «English» من الأعلى'
    ],
    icon,
    best() {
      const pr = loadProg(), ks = Object.keys(pr.stars).filter(k => pr.stars[k]);
      return ks.length ? `🔀 ${ks.length} مستوى · ⭐ ${ks.reduce((a, k) => a + pr.stars[k], 0)}` : '';
    },
    enter() {
      paused = false;
      lang = store.get('oppositesLang', 'ar') === 'en' ? 'en' : 'ar';
      paintLang();
      startLevel(loadProg().uc);
      render(); startLoop();
    },
    leave() { stopLoop(); clearTimers(); drag = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { drag.o.tx = drag.o.hx; drag.o.ty = drag.o.hy; drag = null; } },
    resume() { paused = false; last = performance.now(); },
    back() { if (lvOv.classList.contains('on')) { act('close'); return true; } return false; },
    /* للاختبار الآلي فقط */
    _state() {
      return { lang, lvl, mode: L.m, phase, mistakes, ri, matched, done: R && R.done, slot: G.slot, main: R && { x: R.main.x, y: R.main.y, p: R.p },
        opts: R ? R.opts.map(o => ({ x: o.x, y: o.y, correct: !!o.correct, ready: T > o.delay + .5, out: !!o.out })) : [],
        cards: cards.map(c => ({ x: c.tx, y: c.ty, p: c.p, side: c.side, up: c.ft === 1, matched: !!c.matched })) };
    },
    _illo: illo, _pairs: PAIRS
  });
})();
