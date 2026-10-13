/* =====================================================================
   ألغاز الصور المنزلقة — رتّب قطع الصورة بتحريكها نحو الفراغ
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'slide';
  const TAU = Math.PI * 2;
  const PR = 1024;                // دقة الصورة المرسومة
  const SIZES = [3, 4, 5];
  const PAR = { 3: { m: [60, 120], t: [90, 180] }, 4: { m: [200, 400], t: [300, 600] }, 5: { m: [450, 900], t: [600, 1200] } };

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  };
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const fmtT = s => { s = Math.floor(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

  /* ---------- أدوات الرسم ---------- */
  function G(x, x0, y0, x1, y1, ...st) { const g = x.createLinearGradient(x0, y0, x1, y1); st.forEach((c, i) => g.addColorStop(i / (st.length - 1), c)); return g; }
  function RG(x, cx, cy, r0, r1, ...st) { const g = x.createRadialGradient(cx, cy, r0, cx, cy, r1); st.forEach((c, i) => g.addColorStop(i / (st.length - 1), c)); return g; }
  function circ(x, cx, cy, r, f) { x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.fillStyle = f; x.fill(); }
  function ell(x, cx, cy, rx, ry, rot, f) { x.beginPath(); x.ellipse(cx, cy, rx, ry, rot, 0, TAU); x.fillStyle = f; x.fill(); }
  function rr(x, X, Y, w, h, r, f) { x.beginPath(); x.roundRect(X, Y, w, h, r); x.fillStyle = f; x.fill(); }
  function poly(x, pts, f) { x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); x.fillStyle = f; x.fill(); }
  function starPath(x, cx, cy, r, rot = 0, inner = .45, n = 5) { x.beginPath(); for (let i = 0; i < n * 2; i++) { const a = rot - Math.PI / 2 + i * Math.PI / n, rr2 = i % 2 ? r * inner : r; x.lineTo(cx + Math.cos(a) * rr2, cy + Math.sin(a) * rr2); } x.closePath(); }
  function star(x, cx, cy, r, f, rot = 0, inner = .45) { starPath(x, cx, cy, r, rot, inner); x.fillStyle = f; x.fill(); }
  function eye(x, cx, cy, r, lx = .25, ly = .1) {
    circ(x, cx, cy, r, '#fff');
    circ(x, cx + r * lx, cy + r * ly, r * .62, '#2B1B3A');
    circ(x, cx + r * lx - r * .2, cy + r * ly - r * .25, r * .22, '#fff');
  }
  function smile(x, cx, cy, r, w = 6, col = '#5A2A2A') { x.beginPath(); x.arc(cx, cy, r, .2 * Math.PI, .8 * Math.PI); x.strokeStyle = col; x.lineWidth = w; x.lineCap = 'round'; x.stroke(); }
  function cloud(x, cx, cy, s, c1 = '#FFFFFF', c2 = '#D8E7FF') {
    const P = [[-.62, .14, .36], [-.3, -.16, .46], [.12, -.3, .54], [.52, -.06, .42], [.8, .16, .3], [.2, .14, .44], [-.18, .16, .42]];
    x.save();
    x.fillStyle = G(x, 0, cy - s * .85, 0, cy + s * .5, c1, c1, c2);
    x.beginPath(); for (const [a, b, r] of P) { x.moveTo(cx + a * s + r * s, cy + b * s); x.arc(cx + a * s, cy + b * s, r * s, 0, TAU); } x.fill();
    x.globalAlpha = .7; ell(x, cx + s * .02, cy - s * .48, s * .22, s * .09, -.2, '#fff');
    x.restore();
  }
  function sun(x, cx, cy, r, face = true) {
    circ(x, cx, cy, r * 2.6, RG(x, cx, cy, r * .8, r * 2.6, 'rgba(255,240,150,.75)', 'rgba(255,240,150,0)'));
    x.save(); x.translate(cx, cy); x.fillStyle = '#FFD23F';
    for (let i = 0; i < 12; i++) { x.rotate(TAU / 12); x.beginPath(); x.moveTo(-r * .16, -r * 1.12); x.lineTo(0, -r * 1.55); x.lineTo(r * .16, -r * 1.12); x.closePath(); x.fill(); }
    x.restore();
    circ(x, cx, cy, r, RG(x, cx - r * .3, cy - r * .3, r * .1, r * 1.1, '#FFF8C4', '#FFD84A', '#FFB52E'));
    if (face) {
      x.strokeStyle = '#B5651D'; x.lineWidth = r * .09; x.lineCap = 'round';
      [-1, 1].forEach(k => { x.beginPath(); x.arc(cx + k * r * .34, cy - r * .1, r * .13, Math.PI * 1.1, Math.PI * 1.9); x.stroke(); });
      smile(x, cx, cy + r * .08, r * .38, r * .09, '#B5651D');
      circ(x, cx - r * .58, cy + r * .2, r * .14, 'rgba(255,120,90,.45)'); circ(x, cx + r * .58, cy + r * .2, r * .14, 'rgba(255,120,90,.45)');
    }
  }
  function hills(x, y, amp, freq, ph, fill, w = 1000, h = 1000) {
    x.beginPath(); x.moveTo(0, h);
    for (let xx = 0; xx <= w; xx += 10) x.lineTo(xx, y + Math.sin(xx * freq + ph) * amp + Math.sin(xx * freq * 2.3 + ph * 1.7) * amp * .3);
    x.lineTo(w, h); x.closePath(); x.fillStyle = fill; x.fill();
  }
  function tree(x, cx, by, s, c1 = '#5DBB46', c2 = '#3E9A2E') {
    rr(x, cx - s * .1, by - s * .7, s * .2, s * .7, s * .05, G(x, cx - s * .1, 0, cx + s * .1, 0, '#A0673A', '#7A4A26'));
    const g = RG(x, cx - s * .2, by - s * 1.15, s * .1, s * .7, c1, c2);
    x.beginPath(); [[0, -1.05, .45], [-.32, -.8, .34], [.32, -.8, .34], [-.18, -1.3, .32], [.2, -1.28, .3]].forEach(([a, b, r]) => { x.moveTo(cx + a * s + r * s, by + b * s); x.arc(cx + a * s, by + b * s, r * s, 0, TAU); });
    x.fillStyle = g; x.fill();
    x.globalAlpha = .35; ell(x, cx - s * .2, by - s * 1.3, s * .14, s * .08, -.5, '#fff'); x.globalAlpha = 1;
  }
  function leaf(x, bx, by, ang, len, w, col) {
    x.save(); x.translate(bx, by); x.rotate(ang);
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(len * .5, -w, len, 0); x.quadraticCurveTo(len * .5, w, 0, 0); x.fillStyle = col; x.fill();
    x.strokeStyle = 'rgba(0,60,0,.25)'; x.lineWidth = 3; x.beginPath(); x.moveTo(0, 0); x.lineTo(len * .9, 0); x.stroke();
    x.restore();
  }
  function palm(x, bx, by, h, lean) {
    x.save(); x.lineCap = 'round';
    const tx = bx + lean, ty = by - h;
    for (let i = 0; i < 9; i++) {
      const t0 = i / 9, t1 = (i + 1) / 9;
      const p = t => [bx + lean * t * t, by - h * t];
      const [x0, y0] = p(t0), [x1, y1] = p(t1);
      x.strokeStyle = i % 2 ? '#A5713F' : '#8C5A2E'; x.lineWidth = 34 - i * 2;
      x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1, y1); x.stroke();
    }
    [[-2.7, '#3FA34D'], [-2.1, '#4DBA5A'], [-1.4, '#3FA34D'], [-.7, '#4DBA5A'], [-.1, '#3FA34D'], [-1.75, '#5ACB66']].forEach(([a, c]) => {
      x.save(); x.translate(tx, ty); x.rotate(a);
      x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(110, -60, 220, 30); x.quadraticCurveTo(110, 10, 0, 0); x.fillStyle = c; x.fill();
      x.restore();
    });
    circ(x, tx - 12, ty + 14, 16, '#7A4A1E'); circ(x, tx + 14, ty + 18, 16, '#6A3E16');
    x.restore();
  }
  function balloon(x, cx, cy, r, col, dark, sx = 0) {
    x.save();
    x.strokeStyle = 'rgba(90,90,110,.75)'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(cx, cy + r * 1.08); x.bezierCurveTo(cx + 20 + sx * .3, cy + r * 1.8, cx - 20 + sx * .6, cy + r * 2.4, cx + sx, cy + r * 3.4); x.stroke();
    poly(x, [[cx, cy + r * .95], [cx - r * .14, cy + r * 1.12], [cx + r * .14, cy + r * 1.12]], dark);
    ell(x, cx, cy, r * .86, r, 0, RG(x, cx - r * .3, cy - r * .35, r * .1, r * 1.1, '#fff', col, dark));
    x.globalAlpha = .7; ell(x, cx - r * .35, cy - r * .42, r * .16, r * .26, .5, '#fff');
    x.restore();
  }
  function flower(x, cx, cy, r, petal, center, n = 6, stem = 0) {
    if (stem) {
      x.strokeStyle = '#3E9A3A'; x.lineWidth = Math.max(6, r * .16); x.lineCap = 'round';
      x.beginPath(); x.moveTo(cx, cy); x.quadraticCurveTo(cx + r * .3, cy + stem * .5, cx, cy + stem); x.stroke();
      leaf(x, cx + r * .1, cy + stem * .6, -.5, r * 1.1, r * .35, '#4DBA4A');
      leaf(x, cx, cy + stem * .75, Math.PI + .5, r * 1, r * .32, '#45AD43');
    }
    for (let i = 0; i < n; i++) {
      x.save(); x.translate(cx, cy); x.rotate(i * TAU / n);
      ell(x, 0, -r * .55, r * .34, r * .55, 0, G(x, 0, -r * 1.1, 0, 0, petal[0], petal[1]));
      x.restore();
    }
    circ(x, cx, cy, r * .34, RG(x, cx - r * .1, cy - r * .1, r * .02, r * .36, center[0], center[1]));
    x.fillStyle = 'rgba(120,60,0,.35)';
    for (let i = 0; i < 6; i++) { const a = i * TAU / 6; x.beginPath(); x.arc(cx + Math.cos(a) * r * .17, cy + Math.sin(a) * r * .17, r * .04, 0, TAU); x.fill(); }
  }
  function archWin(x, cx, y, w, h, f) {
    x.beginPath(); x.moveTo(cx - w / 2, y + h); x.lineTo(cx - w / 2, y + w / 2); x.arc(cx, y + w / 2, w / 2, Math.PI, 0); x.lineTo(cx + w / 2, y + h); x.closePath(); x.fillStyle = f; x.fill();
  }
  function butterfly(x, cx, cy, s, c1, c2, rot = 0) {
    x.save(); x.translate(cx, cy); x.rotate(rot);
    [-1, 1].forEach(k => {
      ell(x, k * s * .5, -s * .3, s * .55, s * .45, k * .5, G(x, 0, -s * .8, 0, s * .2, c1, c2));
      ell(x, k * s * .38, s * .3, s * .35, s * .3, -k * .4, c2);
      circ(x, k * s * .55, -s * .35, s * .13, 'rgba(255,255,255,.75)');
    });
    ell(x, 0, 0, s * .1, s * .5, 0, '#3B2A4A');
    x.strokeStyle = '#3B2A4A'; x.lineWidth = s * .05; x.lineCap = 'round';
    [-1, 1].forEach(k => { x.beginPath(); x.moveTo(0, -s * .45); x.quadraticCurveTo(k * s * .15, -s * .8, k * s * .3, -s * .85); x.stroke(); });
    x.restore();
  }
  function fish(x, cx, cy, s, c1, c2, flip, stripes) {
    x.save(); x.translate(cx, cy); x.scale(flip ? -1 : 1, 1);
    x.beginPath(); x.moveTo(-s * .75, 0); x.lineTo(-s * 1.38, -s * .5); x.quadraticCurveTo(-s * 1.18, 0, -s * 1.38, s * .5); x.closePath(); x.fillStyle = c2; x.fill();
    x.beginPath(); x.moveTo(-s * .3, -s * .5); x.quadraticCurveTo(0, -s * 1, s * .35, -s * .55); x.closePath(); x.fillStyle = c2; x.fill();
    ell(x, 0, 0, s, s * .62, 0, G(x, 0, -s * .6, 0, s * .6, c1, c2));
    if (stripes) {
      x.save(); x.beginPath(); x.ellipse(0, 0, s, s * .62, 0, 0, TAU); x.clip();
      x.fillStyle = stripes; [-.35, .25].forEach(p => { x.beginPath(); x.ellipse(s * p, 0, s * .1, s * .7, 0, 0, TAU); x.fill(); });
      x.restore();
    }
    x.globalAlpha = .45; ell(x, s * .1, -s * .3, s * .45, s * .12, 0, '#fff'); x.globalAlpha = 1;
    ell(x, -s * .05, s * .18, s * .22, s * .12, .5, c2);
    eye(x, s * .52, -s * .12, s * .17, .3, 0);
    smile(x, s * .74, s * .12, s * .12, s * .05, '#5A2A2A');
    x.restore();
  }

  /* ---------- الصور ---------- */
  function paintCastle(x, R) {
    x.fillStyle = G(x, 0, 0, 0, 1000, '#7EC4FF', '#B9E0FF', '#FFD9EE'); x.fillRect(0, 0, 1000, 1000);
    sun(x, 845, 150, 70);
    const rb = ['#FF6B6B', '#FFA94D', '#FFE066', '#69DB7C', '#4DABF7', '#9775FA'];
    x.save(); x.globalAlpha = .55; x.lineWidth = 30;
    rb.forEach((c, i) => { x.strokeStyle = c; x.beginPath(); x.arc(500, 760, 470 - i * 30, Math.PI, TAU); x.stroke(); }); x.restore();
    cloud(x, 170, 250, 110); cloud(x, 620, 130, 80);
    // الأبراج
    const pink = G(x, 0, 300, 0, 760, '#FFC7E3', '#FF8CC4'), pinkD = G(x, 0, 300, 0, 760, '#FFB0D6', '#E86AA8');
    const tower = (cx, top, w, roofH, roofC) => {
      x.fillStyle = pinkD; x.fillRect(cx - w / 2, top, w, 760 - top);
      x.fillStyle = 'rgba(255,255,255,.25)'; x.fillRect(cx - w / 2, top, w * .22, 760 - top);
      for (let i = 0; i < 4; i++) rr(x, cx - w / 2 + i * w / 4 + 2, top - 26, w / 4 - 8, 30, 4, '#FFB0D6');
      // سقف مخروطي
      poly(x, [[cx - w / 2 - 22, top - 20], [cx, top - 20 - roofH], [cx + w / 2 + 22, top - 20]], G(x, cx - w / 2, 0, cx + w / 2, 0, '#A98BFF', '#6C47E8'));
      x.fillStyle = 'rgba(255,255,255,.3)'; poly(x, [[cx - w / 2 - 22, top - 20], [cx, top - 20 - roofH], [cx - w * .15, top - 20]], 'rgba(255,255,255,.25)');
      x.strokeStyle = '#7A4A26'; x.lineWidth = 6; x.beginPath(); x.moveTo(cx, top - 20 - roofH); x.lineTo(cx, top - 80 - roofH); x.stroke();
      poly(x, [[cx, top - 80 - roofH], [cx + 60, top - 66 - roofH], [cx, top - 50 - roofH]], roofC);
      archWin(x, cx, top + 50, w * .36, w * .55, '#FFE58A');
      x.strokeStyle = '#B04F8C'; x.lineWidth = 6; x.beginPath(); x.moveTo(cx, top + 50); x.lineTo(cx, top + 50 + w * .55); x.stroke();
    };
    tower(270, 380, 120, 150, '#FFD43B');
    tower(730, 380, 120, 150, '#4DD4AC');
    x.fillStyle = pink; x.fillRect(320, 470, 360, 290);
    for (let i = 0; i < 6; i++) rr(x, 322 + i * 60, 440, 46, 36, 5, '#FFC7E3');
    tower(500, 270, 150, 190, '#FF6B9A');
    // حجارة
    x.strokeStyle = 'rgba(190,70,130,.22)'; x.lineWidth = 3;
    for (let y = 520; y < 760; y += 40) for (let xx = 330 + ((y / 40) % 2) * 30; xx < 670; xx += 60) { x.strokeRect(xx, y, 60, 40); }
    // نوافذ وباب
    archWin(x, 390, 540, 60, 80, '#FFE58A'); archWin(x, 610, 540, 60, 80, '#FFE58A');
    [390, 610].forEach(cx => { x.strokeStyle = '#B04F8C'; x.lineWidth = 5; x.beginPath(); x.moveTo(cx, 545); x.lineTo(cx, 620); x.moveTo(cx - 30, 585); x.lineTo(cx + 30, 585); x.stroke(); });
    archWin(x, 500, 610, 120, 150, G(x, 0, 610, 0, 760, '#B5733F', '#7E4A22'));
    x.strokeStyle = 'rgba(70,35,10,.5)'; x.lineWidth = 4; [470, 500, 530].forEach(xx => { x.beginPath(); x.moveTo(xx, 640); x.lineTo(xx, 760); x.stroke(); });
    circ(x, 525, 700, 7, '#FFD43B');
    // الغيوم الأمامية
    x.save();
    const R2 = rng(9);
    for (let i = 0; i < 13; i++) { const cx = -40 + i * 90, cy = 800 + R2() * 50, r = 90 + R2() * 70; circ(x, cx, cy, r, G(x, 0, cy - r, 0, cy + r, '#FFFFFF', '#E3EEFF')); }
    x.fillStyle = G(x, 0, 820, 0, 1000, '#F3F7FF', '#D5E3FF'); x.fillRect(0, 860, 1000, 140);
    for (let i = 0; i < 9; i++) { const cx = 60 + i * 115 + R2() * 30, cy = 930 + R2() * 30; circ(x, cx, cy, 70 + R2() * 30, G(x, 0, cy - 90, 0, cy + 90, '#FFFFFF', '#DCE8FF')); }
    x.restore();
    for (let i = 0; i < 10; i++) star(x, 60 + R() * 880, 40 + R() * 340, 10 + R() * 14, i % 2 ? '#FFF6A8' : '#FFFFFF', R() * TAU);
  }

  function paintSea(x, R) {
    x.fillStyle = G(x, 0, 0, 0, 1000, '#7DF0F5', '#29A9DE', '#155DB0', '#0F3C85'); x.fillRect(0, 0, 1000, 1000);
    x.save(); x.globalAlpha = .13; x.fillStyle = '#fff';
    [[120, 70], [330, 50], [560, 90], [800, 60]].forEach(([a, w]) => poly(x, [[a, 0], [a + w, 0], [a + w * 3 + 120, 1000], [a + w * 1.2 + 80, 1000]], '#fff'));
    x.restore();
    // رمل
    hills(x, 860, 25, .012, 1, G(x, 0, 820, 0, 1000, '#FBE3A6', '#E9BB66'));
    x.fillStyle = 'rgba(180,120,40,.25)'; for (let i = 0; i < 160; i++) { x.beginPath(); x.arc(R() * 1000, 870 + R() * 130, 2 + R() * 3, 0, TAU); x.fill(); }
    // أعشاب بحرية
    x.lineCap = 'round';
    [[70, 880, 360, '#2FBF71'], [130, 900, 260, '#1E9E5A'], [880, 880, 400, '#2FBF71'], [940, 900, 280, '#38D27F'], [620, 900, 180, '#1E9E5A']].forEach(([bx, by, h, c], k) => {
      x.strokeStyle = c; x.lineWidth = 26;
      x.beginPath(); x.moveTo(bx, by);
      for (let t = 0; t <= 1; t += .05) x.lineTo(bx + Math.sin(t * 9 + k) * 26, by - h * t);
      x.stroke();
    });
    // مرجان
    const coral = (bx, by, len, ang, w, c, d) => {
      if (d === 0 || len < 14) return;
      const ex = bx + Math.cos(ang) * len, ey = by + Math.sin(ang) * len;
      x.strokeStyle = c; x.lineWidth = w; x.beginPath(); x.moveTo(bx, by); x.lineTo(ex, ey); x.stroke();
      circ(x, ex, ey, w * .55, c);
      coral(ex, ey, len * .72, ang - .5 + R() * .2, w * .78, c, d - 1);
      coral(ex, ey, len * .72, ang + .5 - R() * .2, w * .78, c, d - 1);
    };
    coral(250, 900, 110, -Math.PI / 2, 30, '#FF6F91', 4);
    coral(760, 910, 90, -Math.PI / 2 - .2, 26, '#FF9F43', 4);
    coral(470, 920, 70, -Math.PI / 2 + .2, 22, '#B57BFF', 3);
    // نجمة البحر وصدفة
    star(x, 560, 930, 46, '#FF8A3D', .3, .48); star(x, 560, 930, 30, '#FFB36B', .3, .48);
    x.save(); x.translate(370, 945); x.fillStyle = '#FFD6E5'; x.beginPath(); x.moveTo(-40, 15); x.arc(0, 15, 40, Math.PI, 0); x.closePath(); x.fill();
    x.strokeStyle = '#E79BB8'; x.lineWidth = 4; for (let i = -2; i <= 2; i++) { x.beginPath(); x.moveTo(0, 15); x.lineTo(i * 16, -20 + Math.abs(i) * 8); x.stroke(); } x.restore();
    // أسماك
    fish(x, 470, 420, 140, '#FF9A3C', '#E8590C', false, 'rgba(255,255,255,.95)');
    fish(x, 200, 220, 80, '#FFE066', '#F59F00', true);
    fish(x, 780, 250, 90, '#C77DFF', '#7B2CBF', true, 'rgba(255,230,255,.7)');
    fish(x, 800, 620, 70, '#4DD4AC', '#0CA678', true);
    fish(x, 230, 650, 65, '#FF8FB1', '#E64980', false);
    // فقاعات
    for (let i = 0; i < 26; i++) {
      const bx = R() * 1000, by = R() * 800, r = 6 + R() * 18;
      x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 3; x.beginPath(); x.arc(bx, by, r, 0, TAU); x.stroke();
      circ(x, bx - r * .35, by - r * .35, r * .25, 'rgba(255,255,255,.85)');
    }
  }

  function paintSpace(x, R) {
    x.fillStyle = RG(x, 500, 450, 50, 800, '#3D2290', '#1B1050', '#0A0626'); x.fillRect(0, 0, 1000, 1000);
    [[250, 650, 320, 'rgba(255,90,200,.22)'], [760, 300, 300, 'rgba(60,200,255,.2)'], [600, 850, 260, 'rgba(160,90,255,.25)']].forEach(([a, b, r, c]) => circ(x, a, b, r, RG(x, a, b, 0, r, c, 'rgba(0,0,0,0)')));
    for (let i = 0; i < 220; i++) circ(x, R() * 1000, R() * 1000, .8 + R() * 2.6, R() < .2 ? '#FFE9A8' : '#FFFFFF');
    for (let i = 0; i < 12; i++) star(x, R() * 1000, R() * 1000, 8 + R() * 10, '#FFF3B0', 0, .3);
    // كوكب بحلقة
    const px = 330, py = 380, pr = 170;
    x.save(); x.translate(px, py); x.rotate(-.35);
    x.lineWidth = 34; x.strokeStyle = 'rgba(255,224,163,.85)'; x.beginPath(); x.ellipse(0, 0, pr * 1.75, pr * .42, 0, Math.PI, TAU); x.stroke();
    x.lineWidth = 12; x.strokeStyle = 'rgba(255,190,120,.8)'; x.beginPath(); x.ellipse(0, 0, pr * 1.45, pr * .33, 0, Math.PI, TAU); x.stroke();
    x.restore();
    circ(x, px, py, pr, RG(x, px - 60, py - 70, 20, pr * 1.2, '#FFD49A', '#FF9F4A', '#D9532B'));
    x.save(); x.beginPath(); x.arc(px, py, pr, 0, TAU); x.clip();
    x.fillStyle = 'rgba(180,60,30,.3)'; [-90, -30, 40, 100].forEach((o, i) => { x.beginPath(); x.ellipse(px, py + o, pr * 1.2, 10 + i * 4, -.35, 0, TAU); x.fill(); });
    x.restore();
    x.save(); x.translate(px, py); x.rotate(-.35);
    x.lineWidth = 34; x.strokeStyle = 'rgba(255,224,163,.95)'; x.beginPath(); x.ellipse(0, 0, pr * 1.75, pr * .42, 0, 0, Math.PI); x.stroke();
    x.lineWidth = 12; x.strokeStyle = 'rgba(255,190,120,.9)'; x.beginPath(); x.ellipse(0, 0, pr * 1.45, pr * .33, 0, 0, Math.PI); x.stroke();
    x.restore();
    // كوكب أزرق
    circ(x, 810, 220, 85, RG(x, 780, 190, 10, 100, '#9FE7FF', '#3BA5F5', '#1C5BC2'));
    x.save(); x.beginPath(); x.arc(810, 220, 85, 0, TAU); x.clip();
    ell(x, 780, 200, 40, 26, .4, '#5ED38A'); ell(x, 845, 260, 34, 20, -.3, '#5ED38A'); ell(x, 830, 165, 18, 10, 0, '#5ED38A'); x.restore();
    // قمر
    circ(x, 820, 780, 120, RG(x, 790, 740, 10, 130, '#FFFFFF', '#D7DCEA', '#9AA3BF'));
    [[780, 740, 22], [860, 800, 28], [800, 830, 16], [860, 720, 14]].forEach(([a, b, r]) => { circ(x, a, b, r, 'rgba(110,118,150,.45)'); circ(x, a - 3, b - 3, r * .8, 'rgba(200,205,225,.6)'); });
    // كوكب بنفسجي
    circ(x, 140, 830, 70, RG(x, 120, 810, 5, 80, '#F4C2FF', '#C266F0', '#7B2FB5'));
    // صاروخ
    x.save(); x.translate(560, 690); x.rotate(.6);
    poly(x, [[-28, 110], [0, 230 + R() * 10], [28, 110]], G(x, 0, 110, 0, 240, '#FFE066', '#FF6B00', 'rgba(255,60,0,0)'));
    poly(x, [[-16, 110], [0, 180], [16, 110]], '#FFF7C2');
    poly(x, [[-45, 40], [-90, 120], [-40, 110]], '#E8384F'); poly(x, [[45, 40], [90, 120], [40, 110]], '#E8384F');
    x.beginPath(); x.moveTo(-45, 110); x.lineTo(-45, -40); x.quadraticCurveTo(-45, -130, 0, -170); x.quadraticCurveTo(45, -130, 45, -40); x.lineTo(45, 110); x.closePath();
    x.fillStyle = G(x, -45, 0, 45, 0, '#FFFFFF', '#E6E9F5', '#AEB6D0'); x.fill();
    x.beginPath(); x.moveTo(-34, -100); x.quadraticCurveTo(0, -125, 34, -100); x.quadraticCurveTo(25, -140, 0, -170); x.quadraticCurveTo(-25, -140, -34, -100); x.fillStyle = '#E8384F'; x.fill();
    circ(x, 0, -30, 30, '#5C6B8A'); circ(x, 0, -30, 22, RG(x, -6, -36, 2, 24, '#CFF4FF', '#4DB6F0'));
    rr(x, -45, 70, 90, 16, 4, '#E8384F');
    x.restore();
  }

  function paintCandy(x, R) {
    x.fillStyle = G(x, 0, 0, 0, 1000, '#BFE9FF', '#FFE0F0', '#FFD0E8'); x.fillRect(0, 0, 1000, 1000);
    cloud(x, 200, 150, 110, '#FFE6F3', '#FFB8DA'); cloud(x, 760, 110, 90, '#FFF0F8', '#FFC7E3');
    hills(x, 560, 40, .007, 2, G(x, 0, 500, 0, 760, '#D8B4FF', '#A77BEA'));
    hills(x, 650, 30, .01, 0, G(x, 0, 600, 0, 800, '#B2F5DC', '#6FD9B2'));
    // نهر الشوكولاتة
    x.beginPath(); x.moveTo(0, 770); for (let xx = 0; xx <= 1000; xx += 10) x.lineTo(xx, 770 + Math.sin(xx * .013) * 14);
    for (let xx = 1000; xx >= 0; xx -= 10) x.lineTo(xx, 860 + Math.sin(xx * .011 + 1) * 12); x.closePath();
    x.fillStyle = G(x, 0, 760, 0, 870, '#A0582E', '#6E3417'); x.fill();
    x.strokeStyle = 'rgba(255,220,190,.4)'; x.lineWidth = 5; x.lineCap = 'round';
    for (let i = 0; i < 7; i++) { const a = 60 + i * 140, b = 800 + (i % 2) * 30; x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo(a + 30, b - 8, a + 60, b); x.stroke(); }
    x.fillStyle = G(x, 0, 850, 0, 1000, '#FFA6CF', '#FF7EB6'); x.beginPath(); x.moveTo(0, 1000);
    for (let xx = 0; xx <= 1000; xx += 10) x.lineTo(xx, 860 + Math.sin(xx * .011 + 1) * 12); x.lineTo(1000, 1000); x.fill();
    const spr = ['#FFE066', '#4DABF7', '#69DB7C', '#FFFFFF', '#9775FA'];
    for (let i = 0; i < 90; i++) { x.save(); x.translate(R() * 1000, 885 + R() * 115); x.rotate(R() * TAU); rr(x, -9, -3, 18, 6, 3, spr[i % 5]); x.restore(); }
    // حلوى العصا
    const cane = (bx, by, h, flip) => {
      x.save(); x.translate(bx, by); x.scale(flip ? -1 : 1, 1); x.lineCap = 'round';
      const path = () => { x.beginPath(); x.moveTo(0, 0); x.lineTo(0, -h); x.arc(45, -h, 45, Math.PI, TAU); x.lineTo(90, -h + 40); };
      x.lineWidth = 36; x.strokeStyle = '#FFFFFF'; path(); x.stroke();
      x.setLineDash([24, 24]); x.strokeStyle = '#F03E3E'; path(); x.stroke(); x.setLineDash([]);
      x.lineWidth = 8; x.strokeStyle = 'rgba(255,255,255,.5)'; x.beginPath(); x.moveTo(-8, -10); x.lineTo(-8, -h); x.stroke();
      x.restore();
    };
    cane(80, 880, 300, false); cane(930, 900, 260, true);
    // مصّاصات
    const lolly = (cx, cy, r, cols, stickH) => {
      rr(x, cx - 9, cy, 18, stickH, 6, G(x, cx - 9, 0, cx + 9, 0, '#FFFFFF', '#E0E0E8'));
      circ(x, cx, cy, r, cols[0]);
      x.save(); x.beginPath(); x.arc(cx, cy, r, 0, TAU); x.clip();
      for (let k = 1; k < cols.length; k++) {
        x.strokeStyle = cols[k]; x.lineWidth = r * .2; x.beginPath();
        for (let a = 0; a < TAU * 3; a += .1) { const rr2 = (a / (TAU * 3)) * r; const aa = a + k * TAU / cols.length; x.lineTo(cx + Math.cos(aa) * rr2, cy + Math.sin(aa) * rr2); }
        x.stroke();
      }
      x.restore();
      x.globalAlpha = .55; ell(x, cx - r * .4, cy - r * .45, r * .25, r * .14, -.6, '#fff'); x.globalAlpha = 1;
    };
    lolly(240, 470, 100, ['#FF6B9A', '#FFFFFF'], 330);
    lolly(790, 420, 120, ['#FFD43B', '#4DABF7', '#FF6B6B', '#69DB7C'], 380);
    // آيس كريم
    x.save(); x.translate(520, 560);
    poly(x, [[-80, 0], [80, 0], [0, 260]], G(x, -80, 0, 80, 0, '#F5C67A', '#D9973F'));
    x.save(); x.beginPath(); x.moveTo(-80, 0); x.lineTo(80, 0); x.lineTo(0, 260); x.closePath(); x.clip();
    x.strokeStyle = 'rgba(150,90,30,.5)'; x.lineWidth = 5; for (let i = -6; i < 6; i++) { x.beginPath(); x.moveTo(i * 30 - 100, 0); x.lineTo(i * 30 + 100, 260); x.stroke(); x.beginPath(); x.moveTo(i * 30 + 100, 0); x.lineTo(i * 30 - 100, 260); x.stroke(); }
    x.restore();
    circ(x, 0, -30, 88, RG(x, -25, -60, 10, 100, '#E8FFF5', '#7FE3BF', '#3FBF94'));
    for (let i = -3; i <= 3; i++) circ(x, i * 26, 30 + Math.abs(i) * -4, 22, '#6FD9B2');
    circ(x, 0, -130, 72, RG(x, -20, -155, 8, 80, '#FFE6F1', '#FF8FC0', '#E0508F'));
    for (let i = -2; i <= 2; i++) circ(x, i * 26, -75, 20, '#FF8FC0');
    circ(x, 0, -210, 26, RG(x, -8, -218, 2, 28, '#FF9A9A', '#E8162E')); x.strokeStyle = '#3A8A2A'; x.lineWidth = 5; x.beginPath(); x.moveTo(0, -232); x.quadraticCurveTo(10, -262, 26, -270); x.stroke();
    x.restore();
    // حلوى الجيلي
    [[360, 900, '#9775FA'], [660, 930, '#FF922B'], [420, 975, '#40C057'], [750, 985, '#4DABF7']].forEach(([cx, cy, c]) => {
      x.beginPath(); x.moveTo(cx - 50, cy + 25); x.quadraticCurveTo(cx - 50, cy - 45, cx, cy - 45); x.quadraticCurveTo(cx + 50, cy - 45, cx + 50, cy + 25); x.closePath();
      x.fillStyle = c; x.fill(); x.globalAlpha = .5; ell(x, cx - 20, cy - 20, 12, 8, -.5, '#fff'); x.globalAlpha = 1;
    });
  }

  function paintFarm(x, R) {
    x.fillStyle = G(x, 0, 0, 0, 700, '#7FCBFF', '#D8F2FF'); x.fillRect(0, 0, 1000, 1000);
    sun(x, 150, 150, 75);
    cloud(x, 480, 150, 90); cloud(x, 820, 230, 75);
    hills(x, 470, 40, .006, 1, G(x, 0, 420, 0, 700, '#A6DF7E', '#7CC657'));
    hills(x, 560, 30, .009, 3, G(x, 0, 520, 0, 760, '#8AD35E', '#5DB13E'));
    // صوامع وحظيرة
    rr(x, 520, 330, 90, 360, 10, G(x, 520, 0, 610, 0, '#C9D6E8', '#8A9AB5'));
    ell(x, 565, 330, 45, 40, 0, '#A9B8D0'); x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(530, 330, 16, 360);
    for (let y = 380; y < 690; y += 50) { x.fillStyle = 'rgba(80,90,120,.25)'; x.fillRect(520, y, 90, 4); }
    poly(x, [[600, 420], [780, 300], [960, 420], [960, 700], [600, 700]], G(x, 600, 0, 960, 0, '#F04A4A', '#C92A2A'));
    poly(x, [[580, 430], [780, 280], [980, 430], [960, 440], [780, 310], [600, 440]], '#FFFFFF');
    poly(x, [[600, 420], [780, 285], [780, 310], [600, 440]], '#7A2B2B');
    rr(x, 720, 520, 120, 180, 4, '#FFFFFF'); rr(x, 732, 532, 96, 168, 2, '#B32424');
    x.strokeStyle = '#FFFFFF'; x.lineWidth = 10; x.beginPath(); x.moveTo(732, 532); x.lineTo(828, 700); x.moveTo(828, 532); x.lineTo(732, 700); x.stroke();
    rr(x, 745, 380, 70, 60, 4, '#FFFFFF'); rr(x, 753, 388, 54, 44, 2, '#FFE58A');
    rr(x, 640, 520, 50, 50, 3, '#FFFFFF'); rr(x, 646, 526, 38, 38, 2, '#FFE58A');
    rr(x, 870, 520, 50, 50, 3, '#FFFFFF'); rr(x, 876, 526, 38, 38, 2, '#FFE58A');
    tree(x, 110, 620, 210, '#6CCB4F', '#3C9A2E');
    tree(x, 420, 600, 150, '#7AD65A', '#45A936');
    // الأرض
    x.fillStyle = G(x, 0, 680, 0, 1000, '#8EDB5E', '#5CB83A'); x.fillRect(0, 690, 1000, 310);
    x.strokeStyle = 'rgba(40,120,30,.35)'; x.lineWidth = 3;
    for (let i = 0; i < 120; i++) { const a = R() * 1000, b = 720 + R() * 280; x.beginPath(); x.moveTo(a, b); x.lineTo(a - 4, b - 14); x.moveTo(a, b); x.lineTo(a + 5, b - 12); x.stroke(); }
    // سياج
    for (let i = 0; i < 12; i++) { const fx = 15 + i * 88; rr(x, fx, 640, 26, 110, 6, '#FFF8EE'); poly(x, [[fx, 642], [fx + 13, 622], [fx + 26, 642]], '#FFF8EE'); }
    rr(x, 0, 665, 1000, 18, 4, '#FBEFDC'); rr(x, 0, 715, 1000, 18, 4, '#FBEFDC');
    // قش
    rr(x, 840, 790, 140, 100, 20, G(x, 0, 790, 0, 890, '#FFE08A', '#E3B23C'));
    x.strokeStyle = 'rgba(160,110,20,.5)'; x.lineWidth = 3; for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(850 + i * 22, 800); x.lineTo(856 + i * 22, 880); x.stroke(); }
    // البقرة
    x.save(); x.translate(360, 800);
    [[-100, 40], [-50, 50], [60, 50], [110, 40]].forEach(([lx, ly]) => { rr(x, lx - 14, ly, 28, 80, 8, '#F4F1EA'); rr(x, lx - 14, ly + 64, 28, 18, 6, '#4A3A30'); });
    ell(x, 0, 0, 170, 100, 0, G(x, 0, -100, 0, 100, '#FFFFFF', '#E7E1D6'));
    x.save(); x.beginPath(); x.ellipse(0, 0, 170, 100, 0, 0, TAU); x.clip();
    ell(x, -60, -30, 55, 40, .4, '#2E2A2A'); ell(x, 70, 20, 45, 35, -.3, '#2E2A2A'); ell(x, -10, 80, 40, 25, 0, '#2E2A2A'); x.restore();
    ell(x, 30, 90, 30, 18, 0, '#FFB3C7');
    x.strokeStyle = '#E7E1D6'; x.lineWidth = 10; x.lineCap = 'round'; x.beginPath(); x.moveTo(-165, -10); x.quadraticCurveTo(-210, 20, -200, 70); x.stroke();
    circ(x, -200, 75, 12, '#2E2A2A');
    x.translate(170, -60);
    ell(x, -40, -55, 30, 14, -.5, '#F4F1EA'); ell(x, 40, -55, 30, 14, .5, '#F4F1EA');
    poly(x, [[-30, -70], [-40, -105], [-18, -75]], '#F2D08A'); poly(x, [[30, -70], [40, -105], [18, -75]], '#F2D08A');
    ell(x, 0, 0, 75, 85, 0, G(x, 0, -85, 0, 85, '#FFFFFF', '#EDE7DC'));
    ell(x, -30, -40, 22, 18, 0, '#2E2A2A');
    ell(x, 0, 45, 60, 40, 0, '#FFB3C7'); circ(x, -20, 45, 8, '#C9708A'); circ(x, 20, 45, 8, '#C9708A');
    eye(x, -26, -12, 14); eye(x, 26, -12, 14);
    x.restore();
    // دجاجة
    x.save(); x.translate(640, 880);
    ell(x, 0, 0, 55, 45, 0, '#FFFFFF'); circ(x, 40, -40, 30, '#FFFFFF');
    poly(x, [[66, -42], [88, -36], [66, -30]], '#FFA62B'); circ(x, 34, -72, 10, '#F03E3E'); circ(x, 46, -70, 9, '#F03E3E');
    eye(x, 48, -46, 7); ell(x, -10, -2, 28, 18, .3, '#EEE9E0');
    x.strokeStyle = '#FFA62B'; x.lineWidth = 6; x.beginPath(); x.moveTo(-10, 42); x.lineTo(-14, 66); x.moveTo(12, 42); x.lineTo(16, 66); x.stroke();
    x.restore();
  }

  function paintRainbow(x, R) {
    x.fillStyle = G(x, 0, 0, 0, 1000, '#5EBCFF', '#A8DDFF', '#FFF2D2'); x.fillRect(0, 0, 1000, 1000);
    const rb = ['#FF4D4D', '#FF9F2E', '#FFE135', '#4CD964', '#3AA0FF', '#5E5CE6', '#B25CFF'];
    x.lineWidth = 50;
    rb.forEach((c, i) => { x.strokeStyle = c; x.beginPath(); x.arc(500, 900, 560 - i * 48, Math.PI, TAU); x.stroke(); });
    x.globalAlpha = .25; x.strokeStyle = '#fff'; x.lineWidth = 8; x.beginPath(); x.arc(500, 900, 578, Math.PI, TAU); x.stroke(); x.globalAlpha = 1;
    cloud(x, 90, 880, 200); cloud(x, 910, 880, 200);
    x.fillStyle = G(x, 0, 900, 0, 1000, '#F7FBFF', '#DCE9FF'); x.fillRect(0, 930, 1000, 70);
    cloud(x, 500, 960, 160);
    cloud(x, 820, 120, 80); cloud(x, 170, 200, 70);
    [[300, 330, 70, '#FF5C8A', '#C2185B', -20], [430, 250, 78, '#FFD43B', '#E67700', 10], [560, 330, 72, '#4DABF7', '#1864AB', 0],
     [690, 260, 76, '#69DB7C', '#2B8A3E', -10], [800, 380, 62, '#B197FC', '#6741D9', -30], [180, 460, 60, '#FF922B', '#D9480F', 20], [500, 470, 64, '#F783AC', '#C2255C', 0]]
      .forEach(([cx, cy, r, c, d, sx]) => balloon(x, cx, cy, r, c, d, sx));
    x.strokeStyle = '#3B3B5A'; x.lineWidth = 6; x.lineCap = 'round';
    [[120, 120], [180, 95], [890, 260]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a - 20, b); x.quadraticCurveTo(a - 10, b - 14, a, b); x.quadraticCurveTo(a + 10, b - 14, a + 20, b); x.stroke(); });
  }

  function paintDino(x, R) {
    x.fillStyle = G(x, 0, 0, 0, 1000, '#FFC38A', '#FFE3B0', '#D9F5D0'); x.fillRect(0, 0, 1000, 1000);
    circ(x, 200, 200, 90, RG(x, 200, 200, 30, 180, 'rgba(255,250,200,1)', 'rgba(255,220,140,0)'));
    circ(x, 200, 200, 60, '#FFF1A8');
    // بركان
    poly(x, [[560, 560], [720, 210], [800, 210], [980, 560]], G(x, 0, 200, 0, 560, '#A0627A', '#6E3B5A'));
    poly(x, [[720, 210], [800, 210], [790, 260], [770, 240], [750, 280], [730, 245]], '#FF6B2C');
    [[760, 150, 50], [800, 90, 60], [740, 40, 55]].forEach(([a, b, r]) => circ(x, a, b, r, 'rgba(150,140,160,.6)'));
    hills(x, 560, 40, .008, 1, G(x, 0, 500, 0, 800, '#4FAF5A', '#2E8A43'));
    palm(x, 90, 760, 420, 60); palm(x, 920, 720, 360, -50);
    x.fillStyle = G(x, 0, 650, 0, 1000, '#A4E07A', '#6CC04A'); x.fillRect(0, 700, 1000, 300);
    hills(x, 700, 18, .02, 0, G(x, 0, 650, 0, 1000, '#A4E07A', '#6CC04A'));
    // الديناصور
    x.save();
    const body = G(x, 0, 520, 0, 860, '#7EE07A', '#3FAE4A');
    // ذيل
    x.beginPath(); x.moveTo(640, 650); x.quadraticCurveTo(820, 640, 930, 560); x.quadraticCurveTo(860, 700, 640, 760); x.closePath(); x.fillStyle = body; x.fill();
    // أرجل
    [[400, 1], [470, 0], [600, 1], [660, 0]].forEach(([lx, back]) => { rr(x, lx - 32, 700, 64, 150, 26, back ? '#3FA048' : '#4CBF55'); [-18, 0, 18].forEach(t => circ(x, lx + t, 848, 10, '#FFF4D6')); });
    ell(x, 530, 690, 200, 125, 0, body);
    ell(x, 520, 740, 140, 60, 0, '#C8F5A0');
    // رقبة
    x.beginPath(); x.moveTo(360, 640); x.bezierCurveTo(300, 520, 270, 420, 300, 330); x.lineTo(390, 330); x.bezierCurveTo(380, 430, 410, 520, 470, 600); x.closePath(); x.fillStyle = body; x.fill();
    // رأس
    ell(x, 330, 300, 105, 75, -.15, G(x, 0, 220, 0, 380, '#86E883', '#4CBF55'));
    eye(x, 300, 270, 24, -.2, .1); eye(x, 365, 268, 20, -.2, .1);
    smile(x, 300, 300, 50, 7, '#2E6B30');
    circ(x, 255, 320, 16, 'rgba(255,120,150,.5)'); circ(x, 236, 285, 5, '#2E6B30');
    // بقع وأشواك
    [[460, 640, 26], [540, 610, 20], [610, 660, 28], [500, 690, 16], [680, 620, 16], [350, 470, 14], [380, 540, 18]].forEach(([a, b, r]) => circ(x, a, b, r, 'rgba(30,110,50,.35)'));
    for (let i = 0; i < 7; i++) { const t = i / 6, a = 380 + t * 340, b = 572 - Math.sin(t * Math.PI) * 10; poly(x, [[a - 18, b + 8], [a, b - 30], [a + 18, b + 8]], '#FF8FB1'); }
    x.restore();
    // بيض
    x.save(); x.translate(820, 880);
    ell(x, 0, 30, 130, 40, 0, '#B07A3E');
    [[-60, 0, '#FFF3DA'], [0, -10, '#E8F5FF'], [60, 0, '#FFE6F0']].forEach(([a, b, c]) => { ell(x, a, b, 40, 52, 0, c); circ(x, a - 10, b - 12, 7, 'rgba(120,80,160,.35)'); circ(x, a + 12, b + 10, 9, 'rgba(120,80,160,.35)'); });
    x.restore();
    flower(x, 150, 900, 30, ['#FFF', '#FFD6E8'], ['#FFE066', '#F59F00'], 6);
    flower(x, 260, 950, 24, ['#FFE066', '#FFB300'], ['#FF922B', '#D9480F'], 6);
  }

  function paintCar(x, R) {
    x.fillStyle = G(x, 0, 0, 0, 700, '#6EC8FF', '#D6F1FF'); x.fillRect(0, 0, 1000, 1000);
    sun(x, 830, 140, 70);
    cloud(x, 220, 140, 95); cloud(x, 560, 220, 70);
    const cols = ['#B9C8F5', '#C9B8F0', '#A9D6F0', '#D3C3F7'];
    for (let i = 0; i < 12; i++) { const w = 70 + R() * 40, h = 120 + R() * 200, bx = i * 85 - 10; rr(x, bx, 560 - h, w, h + 40, 6, cols[i % 4]);
      x.fillStyle = 'rgba(255,255,255,.5)'; for (let yy = 580 - h; yy < 540; yy += 34) for (let xx = bx + 12; xx < bx + w - 18; xx += 24) x.fillRect(xx, yy, 12, 16); }
    hills(x, 560, 22, .01, 2, G(x, 0, 520, 0, 720, '#9CE07A', '#5CB83A'));
    [[90, 640, 140], [330, 620, 110], [880, 640, 150], [650, 610, 95]].forEach(([a, b, s], i) => tree(x, a, b, s, i % 2 ? '#6CCB4F' : '#58B840', '#2F8A2A'));
    // الطريق
    x.fillStyle = '#D9D4C9'; x.fillRect(0, 670, 1000, 22);
    x.fillStyle = G(x, 0, 690, 0, 880, '#626578', '#474A5C'); x.fillRect(0, 690, 1000, 190);
    x.fillStyle = '#FFFFFF'; for (let i = 0; i < 9; i++) rr(x, i * 130 + 20, 780, 80, 14, 7, '#FFF7D6');
    x.fillStyle = '#D9D4C9'; x.fillRect(0, 880, 1000, 16);
    x.fillStyle = G(x, 0, 890, 0, 1000, '#8EDB5E', '#5CB83A'); x.fillRect(0, 896, 1000, 104);
    [[90, 950, '#FF6B9A'], [260, 940, '#FFD43B'], [470, 955, '#B197FC'], [700, 945, '#FF922B'], [900, 955, '#4DABF7']].forEach(([a, b, c]) => flower(x, a, b, 22, [c, c], ['#FFF3B0', '#FFC93C'], 5));
    // خطوط السرعة
    x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = 8; x.lineCap = 'round';
    [[90, 600, 190], [60, 650, 160], [110, 700, 200]].forEach(([a, b, l]) => { x.beginPath(); x.moveTo(a, b); x.lineTo(a + l, b); x.stroke(); });
    // السيارة
    x.save(); x.translate(560, 0);
    ell(x, 0, 770, 290, 22, 0, 'rgba(0,0,0,.3)');
    x.beginPath(); x.moveTo(-170, 590); x.quadraticCurveTo(-140, 470, -40, 465); x.lineTo(80, 465); x.quadraticCurveTo(150, 470, 200, 580); x.closePath();
    x.fillStyle = G(x, 0, 460, 0, 600, '#FF6B7A', '#E03141'); x.fill();
    x.beginPath(); x.moveTo(-140, 585); x.quadraticCurveTo(-118, 495, -45, 492); x.lineTo(-5, 492); x.lineTo(-5, 585); x.closePath(); x.fillStyle = G(x, 0, 490, 0, 590, '#D7F6FF', '#7FD3F5'); x.fill();
    x.beginPath(); x.moveTo(20, 585); x.lineTo(20, 492); x.lineTo(78, 492); x.quadraticCurveTo(130, 496, 168, 585); x.closePath(); x.fill();
    x.globalAlpha = .6; poly(x, [[-100, 580], [-60, 500], [-40, 500], [-80, 580]], '#fff'); x.globalAlpha = 1;
    rr(x, -270, 570, 540, 150, 60, G(x, 0, 570, 0, 720, '#FF7A88', '#E03141', '#B81F2E'));
    x.globalAlpha = .45; rr(x, -230, 585, 440, 18, 9, '#fff'); x.globalAlpha = 1;
    rr(x, -20, 620, 40, 10, 5, '#B81F2E'); rr(x, 110, 620, 40, 10, 5, '#B81F2E');
    ell(x, 255, 625, 18, 26, 0, '#FFF3A0'); x.globalAlpha = .4; poly(x, [[270, 610], [400, 570], [400, 690], [270, 640]], '#FFF7C2'); x.globalAlpha = 1;
    rr(x, -278, 615, 22, 34, 6, '#FF3B3B');
    rr(x, -290, 680, 70, 20, 10, '#C7CCD8'); rr(x, 220, 680, 70, 20, 10, '#C7CCD8');
    [-150, 150].forEach(wx => { circ(x, wx, 725, 72, '#2A2A35'); circ(x, wx, 725, 40, RG(x, wx - 10, 715, 4, 42, '#FFFFFF', '#B8BECD')); circ(x, wx, 725, 12, '#6B7285'); });
    x.restore();
  }

  function paintGarden(x, R) {
    x.fillStyle = G(x, 0, 0, 0, 600, '#8EDCFF', '#E6FAFF'); x.fillRect(0, 0, 1000, 1000);
    sun(x, 160, 140, 70);
    cloud(x, 600, 140, 90); cloud(x, 880, 260, 70);
    // شجيرات
    for (let i = 0; i < 14; i++) circ(x, i * 80, 470 + (i % 3) * 14, 90, i % 2 ? '#5EC24A' : '#4CAF3F');
    // سياج
    for (let i = 0; i < 14; i++) { const fx = 8 + i * 74; rr(x, fx, 450, 46, 230, 6, '#FFFFFF'); poly(x, [[fx, 452], [fx + 23, 418], [fx + 46, 452]], '#FFFFFF'); x.fillStyle = 'rgba(150,170,200,.25)'; x.fillRect(fx + 34, 450, 12, 230); }
    rr(x, 0, 500, 1000, 22, 4, '#F2F4F8'); rr(x, 0, 610, 1000, 22, 4, '#F2F4F8');
    x.fillStyle = G(x, 0, 620, 0, 1000, '#8EDB5E', '#4FAF35'); x.fillRect(0, 640, 1000, 360);
    hills(x, 650, 12, .03, 0, G(x, 0, 620, 0, 1000, '#8EDB5E', '#4FAF35'));
    // زهور
    const P = [[['#FF8FA3', '#E03156']], [['#FFE066', '#F5A300']], [['#C9A7FF', '#7B4BE0']], [['#FFB37A', '#F0680C']], [['#8FD0FF', '#2B7FD8']], [['#FFC2E2', '#F04CA0']]];
    const back = [[70, 640, 34], [190, 660, 30], [320, 630, 36], [450, 660, 30], [580, 640, 34], [720, 660, 32], [850, 635, 36], [960, 660, 30]];
    back.forEach(([a, b, r], i) => flower(x, a, b, r, P[i % 6][0], ['#FFF0A0', '#F5B000'], 6, 70));
    // خزامى
    [[260, 760, '#E03156'], [520, 740, '#F5A300'], [790, 770, '#7B4BE0']].forEach(([a, b, c]) => {
      x.strokeStyle = '#3E9A3A'; x.lineWidth = 10; x.beginPath(); x.moveTo(a, b); x.lineTo(a, b + 200); x.stroke();
      leaf(x, a, b + 150, -1.1, 110, 28, '#4DBA4A');
      x.beginPath(); x.moveTo(a - 45, b - 50); x.lineTo(a - 22, b - 20); x.lineTo(a, b - 55); x.lineTo(a + 22, b - 20); x.lineTo(a + 45, b - 50); x.quadraticCurveTo(a + 50, b + 30, a, b + 30); x.quadraticCurveTo(a - 50, b + 30, a - 45, b - 50);
      x.fillStyle = G(x, a, b - 60, a, b + 30, '#fff', c); x.fill();
    });
    [[110, 850, 80], [400, 880, 90], [660, 870, 76], [900, 860, 84]].forEach(([a, b, r], i) => flower(x, a, b, r, P[(i * 2 + 1) % 6][0], ['#FFF6B0', '#FFB800'], 8, 160));
    butterfly(x, 330, 260, 60, '#FF9AD5', '#E64CA0', -.2);
    butterfly(x, 760, 380, 50, '#FFD43B', '#F08C00', .3);
    // نحلة
    x.save(); x.translate(560, 330);
    ell(x, -10, -40, 26, 18, -.4, 'rgba(230,245,255,.85)'); ell(x, 14, -40, 26, 18, .4, 'rgba(230,245,255,.85)');
    ell(x, 0, 0, 50, 36, 0, '#FFD43B'); x.save(); x.beginPath(); x.ellipse(0, 0, 50, 36, 0, 0, TAU); x.clip();
    x.fillStyle = '#2B2B2B'; [-18, 8].forEach(b => x.fillRect(b, -40, 14, 80)); x.restore();
    eye(x, 34, -6, 8); poly(x, [[-50, 0], [-66, -6], [-66, 6]], '#2B2B2B');
    x.restore();
    x.strokeStyle = 'rgba(80,80,80,.5)'; x.lineWidth = 3; x.setLineDash([8, 10]); x.beginPath(); x.moveTo(470, 350); x.bezierCurveTo(420, 400, 380, 330, 420, 300); x.stroke(); x.setLineDash([]);
  }

  function paintCity(x, R) {
    x.fillStyle = G(x, 0, 0, 0, 820, '#0B1540', '#1E2C78', '#5B3E9E', '#B05BA8'); x.fillRect(0, 0, 1000, 1000);
    for (let i = 0; i < 120; i++) circ(x, R() * 1000, R() * 480, .8 + R() * 2.4, '#FFFFFF');
    circ(x, 790, 170, 170, RG(x, 790, 170, 60, 170, 'rgba(255,245,200,.5)', 'rgba(255,245,200,0)'));
    x.save(); x.beginPath(); x.arc(790, 170, 85, 0, TAU); x.clip(); // هلال
    x.beginPath(); x.rect(690, 70, 200, 200); x.arc(835, 140, 74, 0, TAU); x.fillStyle = RG(x, 770, 150, 10, 90, '#FFFDE8', '#FFE680'); x.fill('evenodd'); x.restore();
    // ألعاب نارية
    [[220, 180, '#FF6BB5'], [450, 110, '#5CE1E6']].forEach(([a, b, c]) => {
      x.strokeStyle = c; x.lineWidth = 6; x.lineCap = 'round';
      for (let i = 0; i < 14; i++) { const an = i * TAU / 14; x.beginPath(); x.moveTo(a + Math.cos(an) * 30, b + Math.sin(an) * 30); x.lineTo(a + Math.cos(an) * 80, b + Math.sin(an) * 80); x.stroke(); }
      circ(x, a, b, 12, '#FFF');
    });
    // مبانٍ خلفية
    for (let i = 0; i < 16; i++) { const w = 60 + R() * 40, h = 180 + R() * 220, bx = i * 66 - 20; rr(x, bx, 800 - h, w, h, 4, '#2A2F6B'); }
    // مبانٍ أمامية
    const cols = ['#5A46C8', '#2E7FD0', '#C04FA8', '#2FA8A0', '#E07A3E', '#8752D9', '#3D5FD6'];
    const blds = [];
    let bx = -10;
    while (bx < 1000) { const w = 110 + R() * 60, h = 220 + R() * 330; blds.push([bx, w, h, cols[blds.length % cols.length]]); bx += w + 8; }
    const drawB = (b, refl) => {
      const [x0, w, h, c] = b, top = 820 - h;
      rr(x, x0, top, w, h, 6, G(x, x0, 0, x0 + w, 0, c, c, 'rgba(0,0,30,.4)'));
      x.fillStyle = G(x, x0, 0, x0 + w, 0, c, shadeC(c));
      x.fillRect(x0, top + 4, w, h - 4);
      if (!refl) { x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(x0, top, 10, h); }
      const R3 = rng(Math.round(x0 * 7 + h));
      for (let yy = top + 26; yy < 800; yy += 40) for (let xx = x0 + 16; xx < x0 + w - 26; xx += 32) rr(x, xx, yy, 18, 24, 3, R3() < .62 ? '#FFE27A' : 'rgba(10,15,50,.45)');
      if (h > 420) { x.strokeStyle = '#9AA0C8'; x.lineWidth = 5; x.beginPath(); x.moveTo(x0 + w / 2, top); x.lineTo(x0 + w / 2, top - 60); x.stroke(); circ(x, x0 + w / 2, top - 62, 9, '#FF4B4B'); }
    };
    blds.forEach(b => drawB(b, false));
    // ماء وانعكاس
    x.fillStyle = G(x, 0, 820, 0, 1000, '#1C2A6A', '#0B1235'); x.fillRect(0, 820, 1000, 180);
    x.save(); x.beginPath(); x.rect(0, 820, 1000, 180); x.clip(); x.globalAlpha = .35; x.translate(0, 1640); x.scale(1, -1); blds.forEach(b => drawB(b, true)); x.restore();
    x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 4; x.lineCap = 'round';
    for (let i = 0; i < 30; i++) { const a = R() * 1000, b = 840 + R() * 150, l = 20 + R() * 50; x.beginPath(); x.moveTo(a, b); x.lineTo(a + l, b); x.stroke(); }
    x.fillStyle = '#3A3F78'; x.fillRect(0, 812, 1000, 10);
  }
  function shadeC(hex) { const n = parseInt(hex.slice(1), 16), f = .72; return `rgb(${(n >> 16 & 255) * f | 0},${(n >> 8 & 255) * f | 0},${(n & 255) * f | 0})`; }

  function paintBeach(x, R) {
    x.fillStyle = G(x, 0, 0, 0, 500, '#4FC1FF', '#BDEEFF'); x.fillRect(0, 0, 1000, 1000);
    sun(x, 830, 140, 75);
    cloud(x, 220, 130, 90); cloud(x, 560, 200, 65);
    x.strokeStyle = '#3B3B5A'; x.lineWidth = 6; x.lineCap = 'round';
    [[420, 110], [470, 140], [660, 90]].forEach(([a, b]) => { x.beginPath(); x.moveTo(a - 22, b); x.quadraticCurveTo(a - 11, b - 15, a, b); x.quadraticCurveTo(a + 11, b - 15, a + 22, b); x.stroke(); });
    // البحر
    x.fillStyle = G(x, 0, 460, 0, 700, '#29B8EE', '#1185CC'); x.fillRect(0, 460, 1000, 260);
    x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 5;
    for (let i = 0; i < 18; i++) { const a = R() * 1000, b = 490 + R() * 180; x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo(a + 18, b - 10, a + 36, b); x.stroke(); }
    // قارب شراعي
    x.save(); x.translate(300, 470);
    x.beginPath(); x.moveTo(-90, 0); x.lineTo(90, 0); x.lineTo(60, 40); x.lineTo(-60, 40); x.closePath(); x.fillStyle = '#8B4A2B'; x.fill();
    x.fillStyle = '#5A2E18'; x.fillRect(-4, -170, 8, 172);
    poly(x, [[8, -165], [8, -10], [100, -10]], '#FFFFFF'); poly(x, [[-8, -150], [-8, -10], [-85, -10]], '#FF5C5C');
    poly(x, [[4, -170], [44, -160], [4, -150]], '#FFD43B');
    x.restore();
    // الرمل
    x.beginPath(); x.moveTo(0, 680); for (let xx = 0; xx <= 1000; xx += 10) x.lineTo(xx, 680 + Math.sin(xx * .012) * 18); x.lineTo(1000, 1000); x.lineTo(0, 1000); x.closePath();
    x.fillStyle = G(x, 0, 660, 0, 1000, '#F0C878', '#FFE4A6', '#F6CF83'); x.fill();
    x.strokeStyle = '#FFFFFF'; x.lineWidth = 12; x.beginPath(); for (let xx = 0; xx <= 1000; xx += 10) x.lineTo(xx, 676 + Math.sin(xx * .012) * 18 + Math.sin(xx * .08) * 4); x.stroke();
    x.fillStyle = 'rgba(190,130,50,.25)'; for (let i = 0; i < 140; i++) { x.beginPath(); x.arc(R() * 1000, 720 + R() * 280, 2 + R() * 3, 0, TAU); x.fill(); }
    // منشفة ومظلة
    x.save(); x.translate(720, 860); x.rotate(-.12);
    rr(x, -150, -50, 300, 110, 10, '#4DABF7'); x.fillStyle = '#FFFFFF'; [-90, -20, 50].forEach(a => x.fillRect(a, -50, 30, 110));
    x.restore();
    x.fillStyle = '#E8E8EE'; x.fillRect(756, 560, 10, 300);
    x.save(); x.translate(760, 570);
    const segs = 8;
    for (let i = 0; i < segs; i++) {
      const a0 = Math.PI + i * Math.PI / segs, a1 = a0 + Math.PI / segs;
      x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, 220, a0, a1); x.closePath(); x.fillStyle = i % 2 ? '#FFFFFF' : '#FF4D6A'; x.fill();
    }
    x.fillStyle = '#FF4D6A'; for (let i = 0; i < segs; i++) { const a = Math.PI + (i + .5) * Math.PI / segs; circ(x, Math.cos(a) * 205, Math.sin(a) * 205 + 18, 22, i % 2 ? '#FFFFFF' : '#FF4D6A'); }
    circ(x, 0, -2, 12, '#FFD43B');
    x.restore();
    // قلعة رمل
    x.save(); x.translate(210, 830);
    const sand = G(x, 0, -200, 0, 80, '#F7D594', '#D9A75A');
    rr(x, -140, -70, 280, 140, 8, sand);
    [[-140, -180, 80], [60, -180, 80], [-40, -230, 80]].forEach(([a, b, w]) => { rr(x, a, b, w, 250, 6, sand); for (let i = 0; i < 3; i++) rr(x, a + i * w / 3 + 2, b - 22, w / 3 - 8, 26, 3, sand); });
    archWin(x, 0, -30, 60, 100, '#A86E2E');
    x.strokeStyle = '#7A4A26'; x.lineWidth = 5; x.beginPath(); x.moveTo(0, -250); x.lineTo(0, -320); x.stroke();
    poly(x, [[0, -320], [50, -305], [0, -290]], '#FF4D6A');
    x.restore();
    // كرة شاطئ
    x.save(); x.translate(470, 900);
    const bc = ['#FF4D4D', '#FFFFFF', '#3AA0FF', '#FFFFFF', '#FFD43B', '#FFFFFF'];
    for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, 75, i * TAU / 6, (i + 1) * TAU / 6); x.closePath(); x.fillStyle = bc[i]; x.fill(); }
    circ(x, 0, 0, 75, RG(x, -25, -25, 5, 80, 'rgba(255,255,255,.4)', 'rgba(255,255,255,0)', 'rgba(0,0,0,.18)'));
    circ(x, 0, 0, 14, '#FFFFFF');
    x.restore();
    // سلطعون
    x.save(); x.translate(900, 960);
    ell(x, 0, 0, 55, 36, 0, '#F2463C');
    x.strokeStyle = '#D02A22'; x.lineWidth = 8; x.lineCap = 'round';
    [-1, 1].forEach(k => { for (let i = 0; i < 3; i++) { x.beginPath(); x.moveTo(k * 40, 5 + i * 10); x.lineTo(k * 72, 20 + i * 14); x.stroke(); } x.beginPath(); x.moveTo(k * 40, -15); x.lineTo(k * 70, -50); x.stroke(); circ(x, k * 74, -58, 18, '#F2463C'); });
    eye(x, -16, -40, 12); eye(x, 16, -40, 12);
    smile(x, 0, -2, 14, 5, '#7A1A14');
    x.restore();
    star(x, 600, 760, 30, '#FF8A3D', .2, .48);
  }

  function paintLogoFallback(x) {
    x.fillStyle = G(x, 0, 0, 1000, 1000, '#FFD6EC', '#C9B8FF'); x.fillRect(0, 0, 1000, 1000);
    const R = rng(3);
    for (let i = 0; i < 18; i++) star(x, R() * 1000, R() * 1000, 20 + R() * 30, ['#FFE066', '#FFFFFF', '#FF8FC0'][i % 3], R() * TAU);
    x.save(); x.translate(500, 520); x.beginPath(); x.moveTo(0, 260); x.bezierCurveTo(-420, 0, -200, -330, 0, -140); x.bezierCurveTo(200, -330, 420, 0, 0, 260);
    x.fillStyle = RG(x, -80, -120, 20, 400, '#FF9AC8', '#FF4FA3', '#D0187A'); x.fill(); x.restore();
    ell(x, 400, 380, 60, 30, -.6, 'rgba(255,255,255,.6)');
  }

  const PICS = [
    { n: 'الشعار', logo: true },
    { n: 'قلعة السحاب', p: paintCastle },
    { n: 'تحت البحر', p: paintSea },
    { n: 'الفضاء', p: paintSpace },
    { n: 'أرض الحلوى', p: paintCandy },
    { n: 'المزرعة', p: paintFarm },
    { n: 'قوس قزح', p: paintRainbow },
    { n: 'الديناصور', p: paintDino },
    { n: 'السيارة', p: paintCar },
    { n: 'حديقة الزهور', p: paintGarden },
    { n: 'المدينة ليلًا', p: paintCity },
    { n: 'الشاطئ', p: paintBeach }
  ];

  /* الشعار يُحمَّل كصورة (يختلف حسب نسخة التطبيق) */
  const logoImg = new Image(); let logoOk = false;
  logoImg.onload = () => { logoOk = true; invalidate(0); };
  logoImg.src = 'logo.jpg';

  const picCache = {};
  function getPic(i, size = PR) {
    const k = i + '_' + size;
    if (picCache[k]) return picCache[k];
    const c = mk(size, size), x = c.getContext('2d');
    x.save(); x.scale(size / 1000, size / 1000);
    const def = PICS[i];
    try {
      if (def.logo) {
        if (logoOk) {
          const iw = logoImg.naturalWidth, ih = logoImg.naturalHeight, s0 = Math.min(iw, ih) / 1.1;
          x.drawImage(logoImg, (iw - s0) / 2, (ih - s0) / 2, s0, s0, 0, 0, 1000, 1000);
        } else paintLogoFallback(x);
      } else def.p(x, rng(i * 977 + 13));
    } catch (e) { console.warn(e); }
    x.restore();
    picCache[k] = c;
    return c;
  }
  function invalidate(i) {
    Object.keys(picCache).filter(k => k.startsWith(i + '_')).forEach(k => delete picCache[k]);
    if (P === i && tiles.length && W) { pic = getPic(P); bakeTiles(); drawPeekThumb(); }
    if (galOv.classList.contains('on')) renderGallery();
  }

  /* ---------- التقدّم ---------- */
  const loadProg = () => { const p = store.get('slideProg', null) || {}; return { b: p.b || {}, last: p.last || null }; };
  const solvedAny = (pr, i) => SIZES.some(n => pr.b[i + '_' + n]);
  const isUnlocked = (pr, i) => i === 0 || solvedAny(pr, i - 1);
  function puzzlesWord(n) { return n === 1 ? 'لغزًا واحدًا' : n === 2 ? 'لغزين' : n <= 10 ? n + ' ألغاز' : n + ' لغزًا'; }

  /* ---------- الواجهة ---------- */
  App.css(`
  #slide{background:#E9E4FF;overflow:hidden}
  #slide canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #slide .ib{color:#5A3CD6}
  #slide .ib.on{background:#7C5CFF;color:#fff;box-shadow:0 3px 0 #4B2FB8}
  #slide .chip{color:#4B2FB8;min-width:70px}
  #slide .chip b{color:#6A44E0;font-variant-numeric:tabular-nums}
  #slide .panel{border-color:#E6DEFF;box-shadow:0 8px 0 #B9A6FF,0 20px 40px rgba(40,20,100,.3);color:#3D2A7A}
  #slide .panel h3{color:#6A44E0}
  #slide .btn{background:#7C5CFF;box-shadow:0 4px 0 #4B2FB8}
  #slide .btn:active{box-shadow:0 1px 0 #4B2FB8}
  #slide .btn.alt{background:#fff;color:#6A44E0;box-shadow:0 4px 0 #CFC2FF;border-color:#E6DEFF}
  #slide .overlay{background:rgba(40,25,100,.4)}
  #slide .wStat{display:flex;justify-content:center;gap:10px;margin:6px 0 4px}
  #slide .wStat div{background:#F3EFFF;border-radius:14px;padding:4px 12px;font-weight:800;font-size:15px}
  #slide .wStat small{display:block;font-size:11px;opacity:.7;font-weight:600}
  #slide .wRec{color:#E8590C;font-weight:800;margin:2px 0 8px;min-height:1em}
  #slide .wThumb{width:120px;height:120px;border-radius:18px;display:block;margin:6px auto 2px;box-shadow:0 0 0 4px #fff,0 0 0 7px #FFD43B,0 8px 18px rgba(60,30,120,.3)}
  #slide .gal{width:min(94vw,600px);max-height:88vh;overflow-y:auto;touch-action:pan-y;padding:16px 12px 14px}
  #slide .gal p{margin:0 0 6px;font-size:14px}
  #slide .gg{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin:8px 0 12px}
  #slide .pc{border-radius:20px;background:#F4F0FF;padding:6px 6px 7px;box-shadow:0 4px 0 #D5C9FF;position:relative;display:flex;flex-direction:column;gap:4px}
  #slide .pc.cur{box-shadow:0 0 0 3px #7C5CFF,0 4px 0 #D5C9FF}
  #slide .pc .th{width:100%;aspect-ratio:1;border-radius:14px;display:block;background:#ddd;box-shadow:inset 0 0 0 1px rgba(0,0,0,.05)}
  #slide .pc .thb{padding:0;background:none;border-radius:14px;position:relative;display:block}
  #slide .pc .thb:active{transform:scale(.97)}
  #slide .pc .nm{font-weight:800;font-size:14px;line-height:1.2;color:#4B2FB8}
  #slide .pc .sz{display:grid;grid-template-columns:repeat(3,1fr);gap:4px}
  #slide .pc .sz button{border-radius:12px;background:#fff;box-shadow:0 3px 0 #CBBEFF;padding:3px 0 2px;line-height:1.15;font-weight:800;color:#5A3CD6;font-size:13px;display:flex;flex-direction:column;align-items:center;min-height:52px}
  #slide .pc .sz button:active{transform:translateY(2px);box-shadow:0 1px 0 #CBBEFF}
  #slide .pc .sz button.done{background:#FFF8DB;box-shadow:0 3px 0 #F2CF5B}
  #slide .pc .sz i{font-style:normal;font-size:8.5px;letter-spacing:-1px;height:11px}
  #slide .pc .sz i .off{filter:grayscale(1);opacity:.3}
  #slide .pc .sz small{font-size:9.5px;font-weight:700;opacity:.75;white-space:nowrap}
  #slide .pc.lock .th{filter:grayscale(1) blur(3px);opacity:.45}
  #slide .pc.lock .lk{position:absolute;inset:0;display:grid;place-items:center;font-size:40px}
  #slide .pc.lock .sz{opacity:.4}
  #slide .foot{position:absolute;left:0;right:0;bottom:0;display:flex;justify-content:center;align-items:center;gap:14px;padding:8px 12px max(12px,env(safe-area-inset-bottom));z-index:5}
  #slide .peek{height:60px;border-radius:30px;background:#fff;padding:5px 18px 5px 6px;display:flex;align-items:center;gap:8px;font-weight:800;color:#5A3CD6;font-size:16px;box-shadow:0 4px 0 #CBBEFF,0 6px 16px rgba(60,30,140,.15);touch-action:none}
  #slide .peek canvas{width:48px;height:48px;border-radius:14px;display:block}
  #slide .peek.on{transform:translateY(3px);box-shadow:0 1px 0 #CBBEFF;background:#F1ECFF}
  #slide .hint{top:auto}
  #slide .hint span{background:rgba(255,255,255,.92);color:#4B2FB8;box-shadow:0 2px 8px rgba(60,30,140,.15)}
  `);
  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib galbtn" aria-label="الألغاز">🖼️</button>
      <span class="grow"></span>
      <div class="chip"><small>الوقت</small><b class="cT">0:00</b></div>
      <div class="chip"><small>الحركات</small><b class="cM">0</b></div>
    </div>
    <div class="hint"><span class="hintT"></span></div>
    <div class="foot">
      <button class="ib rebtn" aria-label="خلط من جديد">🔀</button>
      <button class="peek" aria-label="انظر إلى الصورة"><canvas width="96" height="96"></canvas><span class="peekT">👁️ الصورة</span></button>
      <button class="ib numbtn" aria-label="الأرقام">🔢</button>
    </div>
    <div class="overlay" id="slGal"><div class="panel gal"><h3>🖼️ ألغاز الصور</h3><p class="galP"></p><div class="gg"></div>
      <button class="btn" data-a="close">▶️ متابعة</button></div></div>
    <div class="overlay" id="slWin"><div class="panel">
      <h3 class="wT"></h3><canvas class="wThumb" width="240" height="240"></canvas><div class="stars3 wS"></div>
      <div class="wStat"><div><small>الوقت</small><span class="wTi"></span></div><div><small>الحركات</small><span class="wMo"></span></div></div>
      <div class="wRec"></div>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again" aria-label="مرة أخرى">🔄</button><button class="btn alt" data-a="levels">🖼️ الألغاز</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const bar = root.querySelector('.bar'), foot = root.querySelector('.foot');
  const hintEl = root.querySelector('.hint'), hintT = root.querySelector('.hintT');
  const galOv = root.querySelector('#slGal'), winOv = root.querySelector('#slWin');
  const peekBtn = root.querySelector('.peek'), peekCv = peekBtn.querySelector('canvas'), numBtn = root.querySelector('.numbtn');
  const cT = root.querySelector('.cT'), cM = root.querySelector('.cM');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1;
  let board = null, inner = null, cell = 0, bgLayer = null, sprites = [], shadowSpr = null, pic = null;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let P = 0, N = 3, grid = [], tiles = [], gapR = 2, gapC = 2, moves = 0, time = 0, timing = false;
  let phase = 'intro', introT = 0, scrambled = false, scramble = null, winT = 0, wfx = {}, panelShown = false, result = null;
  let drag = null, parts = [], peek = 0, peekOn = false, nums = false, shine = -1, glow = 0, shake = 0, hintMode = '';

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const top = bar.getBoundingClientRect().bottom + 8;
    const bottom = H - foot.getBoundingClientRect().height - 8;
    const aw = W - 24, ah = bottom - top;
    const s = Math.max(160, Math.min(aw, ah - 28, 640));
    board = { x: (W - s) / 2, y: top + Math.max(0, (ah - s) / 2 - (ah - s > 60 ? 10 : 0)), s };
    const fp = Math.round(s * .045);
    inner = { x: board.x + fp, y: board.y + fp, s: s - fp * 2 };
    cell = inner.s / N;
    const below = bottom - (board.y + board.s);
    hintEl.style.display = below > 26 ? '' : 'none';
    hintEl.style.top = (board.y + board.s + Math.min(14, below / 2 - 12)) + 'px';
  }
  function bakeTiles() {
    pic = getPic(P);
    const s = Math.ceil(cell * dpr), gp = Math.max(1.2, cell * .03) * dpr, rad = cell * .1 * dpr, src = pic.width / N;
    sprites = [];
    for (let k = 0; k < N * N; k++) {
      const c = mk(s, s), x = c.getContext('2d'), r = Math.floor(k / N), cc = k % N;
      x.save(); x.beginPath(); x.roundRect(gp, gp, s - gp * 2, s - gp * 2, rad); x.clip();
      x.drawImage(pic, cc * src, r * src, src, src, 0, 0, s, s);
      x.fillStyle = G(x, 0, 0, 0, s, 'rgba(255,255,255,.3)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0)', 'rgba(0,0,0,.25)'); x.fillRect(0, 0, s, s);
      x.restore();
      x.lineWidth = 2 * dpr; x.strokeStyle = 'rgba(255,255,255,.6)'; x.beginPath(); x.roundRect(gp + dpr, gp + dpr, s - gp * 2 - 2 * dpr, s - gp * 2 - 2 * dpr, rad - dpr); x.stroke();
      x.lineWidth = 1 * dpr; x.strokeStyle = 'rgba(40,20,90,.35)'; x.beginPath(); x.roundRect(gp + .5 * dpr, gp + .5 * dpr, s - gp * 2 - dpr, s - gp * 2 - dpr, rad); x.stroke();
      sprites.push(c);
    }
    // ظل القطعة
    const pad = Math.ceil(cell * .25), S2 = Math.ceil((cell + pad * 2) * dpr);
    shadowSpr = mk(S2, S2); const sx = shadowSpr.getContext('2d');
    sx.shadowColor = 'rgba(20,5,60,.55)'; sx.shadowBlur = cell * .1 * dpr; sx.shadowOffsetX = S2 * 2;
    sx.fillStyle = '#000'; sx.beginPath(); sx.roundRect(pad * dpr + gp - S2 * 2, pad * dpr + gp, s - gp * 2, s - gp * 2, rad); sx.fill();
    shadowSpr.pad = pad;
    buildBg();
  }
  function buildBg() {
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.fillStyle = G(x, 0, 0, W * .3, H, '#F1ECFF', '#E2DBFF', '#D6ECFF'); x.fillRect(0, 0, W, H);
    // نقش خفيف
    x.save(); x.globalAlpha = .5;
    for (let yy = 0, k = 0; yy < H + 40; yy += 46, k++) for (let xx = (k % 2) * 23; xx < W + 40; xx += 46) { x.fillStyle = k % 3 ? 'rgba(255,255,255,.5)' : 'rgba(170,150,255,.18)'; x.beginPath(); x.arc(xx, yy, 3, 0, TAU); x.fill(); }
    x.restore();
    const R = rng(5);
    for (let i = 0; i < 14; i++) circ(x, R() * W, R() * H, 30 + R() * 90, ['rgba(255,170,220,.16)', 'rgba(140,210,255,.18)', 'rgba(255,230,140,.18)'][i % 3]);
    // الإطار
    const b = board, rad = b.s * .055;
    x.save(); x.shadowColor = 'rgba(50,25,120,.35)'; x.shadowBlur = 26; x.shadowOffsetY = 12;
    x.fillStyle = '#C9851F'; x.beginPath(); x.roundRect(b.x, b.y + 6, b.s, b.s, rad); x.fill(); x.restore();
    x.fillStyle = G(x, b.x, b.y, b.x + b.s, b.y + b.s, '#FFE79A', '#F7B733', '#FFD966', '#E79A1E'); x.beginPath(); x.roundRect(b.x, b.y, b.s, b.s, rad); x.fill();
    x.lineWidth = 3; x.strokeStyle = 'rgba(255,255,230,.85)'; x.beginPath(); x.roundRect(b.x + 2, b.y + 2, b.s - 4, b.s - 4, rad - 2); x.stroke();
    // نقاط زخرفية على الإطار
    const fp = inner.x - b.x;
    const gems = ['#FF5C8A', '#4DABF7', '#69DB7C', '#B197FC'];
    [[b.x + fp / 2, b.y + fp / 2], [b.x + b.s - fp / 2, b.y + fp / 2], [b.x + fp / 2, b.y + b.s - fp / 2], [b.x + b.s - fp / 2, b.y + b.s - fp / 2]].forEach(([gx, gy], i) => {
      circ(x, gx, gy, fp * .3, RG(x, gx - fp * .1, gy - fp * .1, 1, fp * .32, '#fff', gems[i], shadeC(['#FF5C8A', '#4DABF7', '#69DB7C', '#B197FC'][i])));
    });
    // الحوض الداخلي
    const ir = Math.max(6, cell * .12);
    x.fillStyle = 'rgba(160,95,10,.55)'; x.beginPath(); x.roundRect(inner.x - 3, inner.y - 3, inner.s + 6, inner.s + 6, ir + 3); x.fill();
    x.save(); x.beginPath(); x.roundRect(inner.x, inner.y, inner.s, inner.s, ir); x.clip();
    x.fillStyle = G(x, 0, inner.y, 0, inner.y + inner.s, '#2E2063', '#3E2C80'); x.fillRect(inner.x, inner.y, inner.s, inner.s);
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      x.fillStyle = 'rgba(255,255,255,.05)'; x.beginPath(); x.roundRect(inner.x + c * cell + cell * .08, inner.y + r * cell + cell * .08, cell * .84, cell * .84, cell * .1); x.fill();
      x.fillStyle = 'rgba(255,255,255,.08)'; x.beginPath(); x.arc(inner.x + (c + .5) * cell, inner.y + (r + .5) * cell, cell * .06, 0, TAU); x.fill();
    }
    x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 14; x.shadowOffsetY = 5;
    x.lineWidth = 14; x.strokeStyle = '#000'; x.beginPath(); x.roundRect(inner.x - 7, inner.y - 7, inner.s + 14, inner.s + 14, ir + 7); x.stroke();
    x.restore();
  }
  function drawPeekThumb() {
    const x = peekCv.getContext('2d'); x.clearRect(0, 0, 96, 96); x.drawImage(getPic(P, 256), 0, 0, 96, 96);
  }

  /* ---------- اللغز ---------- */
  function startPuzzle(p, n) {
    P = clamp(p, 0, PICS.length - 1); N = n;
    winOv.classList.remove('on');
    const pr = loadProg(); pr.last = { p: P, n: N }; store.set('slideProg', pr);
    tiles = []; grid = [];
    for (let k = 0; k < N * N; k++) { const r = Math.floor(k / N), c = k % N; tiles.push({ id: k, r, c, px: c, py: r, fx: c, fy: r, a: 1, d: .16, ez: 0, wig: 0, sq: 0 }); grid.push(k); }
    gapR = gapC = N - 1; grid[N * N - 1] = -1;
    moves = 0; time = 0; timing = false; phase = 'intro'; introT = 0; scrambled = false; winT = 0; wfx = {}; panelShown = false; result = null;
    drag = null; parts = []; shine = -1; glow = 0; peek = 0; peekOn = false; peekBtn.classList.remove('on');
    // الخلط بحركات صحيحة عشوائية (دائمًا قابل للحل)
    const g2 = grid.slice(); let gr = N - 1, gc = N - 1, prev = -1;
    const K = { 3: 90, 4: 220, 5: 400 }[N];
    const solvedish = () => { let m = 0; for (let i = 0; i < N * N - 1; i++) if (g2[i] !== i) m++; return m; };
    for (let i = 0; i < K * 3 && (i < K || solvedish() < (N * N - 1) * .75); i++) {
      const opts = [[-1, 0], [1, 0], [0, -1], [0, 1]].filter(([dr, dc], j) => { const r = gr + dr, c = gc + dc; return r >= 0 && r < N && c >= 0 && c < N && j !== (prev ^ 1); });
      const j0 = Math.floor(Math.random() * opts.length), [dr, dc] = opts[j0];
      prev = [[-1, 0], [1, 0], [0, -1], [0, 1]].findIndex(o => o[0] === dr && o[1] === dc);
      const r = gr + dr, c = gc + dc;
      g2[gr * N + gc] = g2[r * N + c]; g2[r * N + c] = -1; gr = r; gc = c;
    }
    scramble = { g: g2, gr, gc };
    layout(); bakeTiles(); drawPeekThumb(); updChips();
    setHint('🖼️ ' + PICS[P].n + ' · ' + N + '×' + N);
  }
  function doScramble() {
    scrambled = true;
    grid = scramble.g; gapR = scramble.gr; gapC = scramble.gc;
    for (let i = 0; i < N * N; i++) {
      const id = grid[i]; if (id < 0) continue;
      const t = tiles[id]; t.fx = t.px; t.fy = t.py; t.r = Math.floor(i / N); t.c = i % N;
      t.a = -rand(0, .3) - (t.r + t.c) * .02; t.d = .5; t.ez = 1;
    }
    Sound.whoosh();
    for (let i = 0; i < 5; i++) Sound.noise(.08, 500, 1300, .05, 2, .1 + i * .07);
  }
  function setHint(t) { hintT.textContent = t; hintEl.style.opacity = t ? 1 : 0; }
  function updChips() { cT.textContent = fmtT(time); cM.textContent = moves; }
  function isSolved() { for (let i = 0; i < N * N - 1; i++) if (grid[i] !== i) return false; return true; }
  function canPlay() { return phase === 'play' && !paused && !galOv.classList.contains('on') && !winOv.classList.contains('on') && !$('#sheetWrap').classList.contains('on'); }

  /* سلسلة القطع بين الخانة (r,c) والفراغ */
  function chainFrom(r, c) {
    if (r === gapR && c === gapC) return null;
    if (r === gapR) { const dc = Math.sign(gapC - c), ids = []; for (let cc = c; cc !== gapC; cc += dc) ids.push(grid[r * N + cc]); return { ids, dr: 0, dc, r, c }; }
    if (c === gapC) { const dr = Math.sign(gapR - r), ids = []; for (let rr2 = r; rr2 !== gapR; rr2 += dr) ids.push(grid[rr2 * N + c]); return { ids, dr, dc: 0, r, c }; }
    return null;
  }
  function commit(ch, off = 0) {
    for (let i = ch.ids.length - 1; i >= 0; i--) {
      const t = tiles[ch.ids[i]];
      t.fx = t.px + ch.dc * off; t.fy = t.py + ch.dr * off;
      t.c += ch.dc; t.r += ch.dr; grid[t.r * N + t.c] = t.id;
      t.a = 0; t.d = .15 + .02 * ch.ids.length * (1 - off); t.ez = 0;
    }
    grid[ch.r * N + ch.c] = -1; gapR = ch.r; gapC = ch.c;
    moves += ch.ids.length; timing = true; updChips();
    Sound.slide(); Sound.tone(300 + Math.random() * 60, .06, 'sine', .07, 120); vibrate(8);
    if (hintMode === 'tap') { setHint(''); hintMode = ''; }
    if (isSolved()) solved();
  }
  function springBack(ch, off) {
    for (const id of ch.ids) { const t = tiles[id]; t.fx = t.px + ch.dc * off; t.fy = t.py + ch.dr * off; t.a = 0; t.d = .18; t.ez = 1; }
  }
  function wiggle(id) { if (id >= 0) { tiles[id].wig = 1; } Sound.error(); vibrate(15); }

  /* ---------- الحل ---------- */
  function solved() {
    phase = 'win'; winT = -.12; timing = false; drag = null; setHint('');
    const pr = loadProg(), key = P + '_' + N, prev = pr.b[key] || null;
    const par = PAR[N];
    const ms = moves <= par.m[0] ? 3 : moves <= par.m[1] ? 2 : 1, ts = time <= par.t[0] ? 3 : time <= par.t[1] ? 2 : 1;
    const stars = clamp(Math.round((ms + ts) / 2), 1, 3);
    const wasUnlockedNext = P + 1 < PICS.length && isUnlocked(pr, P + 1);
    const rec = { s: Math.max(stars, prev ? prev.s : 0), t: Math.min(time, prev ? prev.t : 1e9), m: Math.min(moves, prev ? prev.m : 1e9) };
    pr.b[key] = rec; store.set('slideProg', pr);
    result = { stars, newStars: Math.max(0, stars - (prev ? prev.s : 0)), recT: !!prev && time < prev.t, recM: !!prev && moves < prev.m, first: !prev,
      unlocked: !wasUnlockedNext && P + 1 < PICS.length };
  }
  function showPanel() {
    panelShown = true;
    const r = result;
    root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنت!') + ' 🎉';
    root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= r.stars ? '' : 'off'}">⭐</span>`).join('');
    root.querySelector('.wTi').textContent = '⏱️ ' + fmtT(time);
    root.querySelector('.wMo').textContent = '👣 ' + moves;
    root.querySelector('.wRec').textContent = r.unlocked ? '🔓 ' + App.g('فتحتِ', 'فتحت') + ' صورة جديدة: ' + PICS[P + 1].n : (r.recT || r.recM) ? '🏆 رقم قياسي جديد!' : r.first ? '' : '';
    const tc = root.querySelector('.wThumb').getContext('2d'); tc.clearRect(0, 0, 240, 240); tc.drawImage(getPic(P, 256), 0, 0, 240, 240);
    const nx = nextOf();
    root.querySelector('[data-a="next"]').style.display = nx ? '' : 'none';
    winOv.classList.add('on');
    if (r.newStars) App.addStars(r.newStars);
    App.achieve('slide_first');
    if (N >= 4) App.achieve('slide_4');
    if (N === 3 && time < 60) App.achieve('slide_fast');
  }
  function nextOf() {
    if (P + 1 < PICS.length) return { p: P + 1, n: N };
    if (N < 5) return { p: 0, n: N + 1 };
    return null;
  }

  /* ---------- معرض الألغاز ---------- */
  function renderGallery() {
    const pr = loadProg();
    const gg = root.querySelector('.gg');
    const solved = Object.keys(pr.b).length;
    root.querySelector('.galP').textContent = solved ? `🏆 ${App.g('حللتِ', 'حللت')} ${puzzlesWord(solved)}` : App.g('اختاري صورة وحجمًا', 'اختر صورة وحجمًا') + ' 👇';
    gg.innerHTML = PICS.map((pc, i) => {
      const lock = !isUnlocked(pr, i);
      return `<div class="pc${lock ? ' lock' : ''}${i === P ? ' cur' : ''}" data-i="${i}">
        <button class="thb" data-p="${i}" aria-label="${pc.n}"><canvas class="th" width="240" height="240"></canvas>${lock ? '<span class="lk">🔒</span>' : ''}</button>
        <div class="nm">${i + 1}. ${pc.n}</div>
        <div class="sz">${SIZES.map(n => {
          const b = pr.b[i + '_' + n];
          return `<button data-p="${i}" data-n="${n}" class="${b ? 'done' : ''}">${n}×${n}<i>${b ? [1, 2, 3].map(k => `<span class="${k <= b.s ? '' : 'off'}">⭐</span>`).join('') : ''}</i>${b ? `<small>⏱${fmtT(b.t)}</small><small>👣${b.m}</small>` : ''}</button>`;
        }).join('')}</div></div>`;
    }).join('');
    gg.querySelectorAll('canvas.th').forEach((c, i) => { const x = c.getContext('2d'); x.drawImage(getPic(i, 256), 0, 0, 240, 240); });
    gg.querySelectorAll('[data-p]').forEach(b => b.onclick = () => {
      const i = +b.dataset.p, p2 = loadProg();
      if (!isUnlocked(p2, i)) {
        Sound.error(); vibrate(20);
        b.closest('.pc').animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(0)' }], { duration: 300 });
        App.toast(App.g('حُلّي', 'حُلّ') + ' لغز «' + PICS[i - 1].n + '» أولًا 🔓'); return;
      }
      let n = +b.dataset.n || 0;
      if (!n) n = SIZES.find(s => !p2.b[i + '_' + s]) || 3;
      Sound.tap(); galOv.classList.remove('on'); startPuzzle(i, n);
    });
  }
  function openGallery() {
    renderGallery(); winOv.classList.remove('on'); galOv.classList.add('on');
    const cur = root.querySelector('.pc.cur'); if (cur) setTimeout(() => { try { cur.scrollIntoView({ block: 'nearest' }); } catch (e) {} }, 30);
  }

  /* ---------- الإدخال ---------- */
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function cellAt(m) {
    const c = Math.floor((m.x - inner.x) / cell), r = Math.floor((m.y - inner.y) / cell);
    return r >= 0 && r < N && c >= 0 && c < N ? { r, c } : null;
  }
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || !canPlay() || drag || peekOn) return;
    const m = pos(e), at = cellAt(m);
    if (!at && !(m.x > board.x - 30 && m.x < board.x + board.s + 30 && m.y > board.y - 30 && m.y < board.y + board.s + 30)) return;
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    const ch = at ? chainFrom(at.r, at.c) : null;
    drag = { id: e.pointerId, sx: m.x, sy: m.y, ch, off: 0, moved: false, t0: performance.now(), at };
    if (ch) { for (const id of ch.ids) tiles[id].sq = 1; Sound.tone(520, .05, 'sine', .06, 200); }
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const m = pos(e), dx = m.x - drag.sx, dy = m.y - drag.sy;
    if (!drag.moved && Math.hypot(dx, dy) > 8) drag.moved = true;
    if (drag.ch) drag.off = clamp((dx * drag.ch.dc + dy * drag.ch.dr) / cell, 0, 1);
    drag.lx = m.x; drag.ly = m.y;
  });
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag; drag = null;
    if (d.ch) for (const id of d.ch.ids) tiles[id].sq = 0;
    if (phase !== 'play') return;
    const m = pos(e), dx = m.x - d.sx, dy = m.y - d.sy, dt = performance.now() - d.t0;
    if (d.ch) {
      if (!d.moved) { commit(d.ch, 0); return; }
      if (d.off > .3 || (d.off > .08 && dt < 260)) { commit(d.ch, d.off); return; }
      if (d.off > 0) { springBack(d.ch, d.off); Sound.tone(260, .06, 'sine', .05); }
      if (d.off > .02) return;
    }
    if (Math.hypot(dx, dy) > 22) {               // سحب: حرّك القطعة المجاورة للفراغ في نفس الاتجاه
      const hz = Math.abs(dx) > Math.abs(dy);
      const dr = hz ? 0 : Math.sign(dy), dc = hz ? Math.sign(dx) : 0;
      const r = gapR - dr, c = gapC - dc;
      if (r >= 0 && r < N && c >= 0 && c < N) commit(chainFrom(r, c), 0); else { Sound.error(); shake = 3; }
      return;
    }
    if (!d.ch && d.at) wiggle(grid[d.at.r * N + d.at.c]);
  };
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', e => { if (drag && drag.ch && e.pointerId === drag.id) { springBack(drag.ch, drag.off); for (const id of drag.ch.ids) tiles[id].sq = 0; } drag = null; });

  const setPeek = on => {
    if (on && (phase === 'intro' && !scrambled)) return;
    if (on === peekOn) return;
    peekOn = on; peekBtn.classList.toggle('on', on);
    if (on) { Sound.tone(700, .1, 'sine', .08, 300); vibrate(10); }
  };
  peekBtn.addEventListener('pointerdown', e => { e.preventDefault(); try { peekBtn.setPointerCapture(e.pointerId); } catch (er) {} setPeek(true); });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => peekBtn.addEventListener(ev, () => setPeek(false)));
  peekBtn.addEventListener('contextmenu', e => e.preventDefault());
  numBtn.addEventListener('click', () => { Sound.tap(); nums = !nums; store.set('slideNums', nums); numBtn.classList.toggle('on', nums); });
  root.querySelector('.rebtn').addEventListener('click', () => { if (galOv.classList.contains('on')) return; Sound.tap(); startPuzzle(P, N); });
  root.querySelector('.galbtn').addEventListener('click', () => { Sound.tap(); openGallery(); });

  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on')) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(nextOf() ? 'next' : 'levels'); } return; }
    if (galOv.classList.contains('on')) { if (e.key === 'Enter') { e.preventDefault(); act('close'); } return; }
    const dirs = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
    if (dirs[e.key]) {
      e.preventDefault(); if (!canPlay()) return;
      const [dr, dc] = dirs[e.key], r = gapR - dr, c = gapC - dc;
      if (r >= 0 && r < N && c >= 0 && c < N) commit(chainFrom(r, c), 0); else Sound.error();
    } else if (e.key === ' ' || e.key === 'p' || e.key === 'P') { e.preventDefault(); setPeek(true); }
    else if (e.key === 'n' || e.key === 'N') numBtn.click();
    else if (e.key === 'g' || e.key === 'G') openGallery();
  });
  window.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'p' || e.key === 'P') setPeek(false); });

  function act(a) {
    Sound.tap();
    if (a === 'next') { const nx = nextOf(); if (nx) startPuzzle(nx.p, nx.n); }
    else if (a === 'again') startPuzzle(P, N);
    else if (a === 'levels') openGallery();
    else if (a === 'close') { galOv.classList.remove('on'); if (phase === 'win' && panelShown) winOv.classList.add('on'); }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    const overlay = galOv.classList.contains('on');
    peek += ((peekOn ? 1 : 0) - peek) * (1 - Math.exp(-dt * 16));
    if (phase === 'intro' && !overlay) {
      introT += dt;
      if (!scrambled && introT > .9) doScramble();
      if (scrambled && tiles.every(t => t.a >= 1)) {
        phase = 'play';
        if (!loadProg().b[P + '_' + N] || !hintMode) { hintMode = 'tap'; setHint('👆 ' + App.g('المسي قطعة بجانب الفراغ أو اسحبيها', 'المس قطعة بجانب الفراغ أو اسحبها')); }
      }
    }
    if (phase === 'play' && timing && !overlay) { time += dt; if (Math.floor(time) !== Math.floor(time - dt)) updChips(); }
    for (const t of tiles) {
      if (t.a < 1) {
        t.a += dt / t.d;
        const k = clamp(t.a, 0, 1), e = t.ez ? ease.outBack(k) : ease.outCubic(k);
        t.px = t.fx + (t.c - t.fx) * e; t.py = t.fy + (t.r - t.fy) * e;
        if (t.a >= 1) { t.px = t.c; t.py = t.r; }
      }
      t.wig = Math.max(0, t.wig - dt * 3);
    }
    if (phase === 'win') {
      winT += dt;
      if (winT > 0 && !wfx.in) { wfx.in = true; Sound.pop(); }
      if (winT > .32 && !wfx.thud) { wfx.thud = true; Sound.thud(); vibrate(25); shake = 4; }
      if (winT > .7 && !wfx.party) {
        wfx.party = true; shine = 0; Sound.win(); vibrate(30);
        App.speak(App.g('أحسنتِ!', 'أحسنت!'));
        const cols = ['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9'];
        for (let i = 0; i < 150; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 260), rot: rand(0, TAU), vr: rand(-8, 8), life: rand(2.5, 4), age: 0, s: rand(6, 11), c: cols[i % 6] });
        for (let i = 0; i < 30; i++) { const a = rand(0, TAU), v = rand(150, 420); parts.push({ t: 'star', x: board.x + board.s / 2, y: board.y + board.s / 2, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, rot: rand(0, TAU), vr: rand(-6, 6), life: rand(.7, 1.2), age: 0, s: rand(7, 13), c: i % 2 ? '#FFE26B' : '#fff' }); }
      }
      if (shine >= 0) shine += dt / 1.1;
      glow = Math.min(1, glow + dt * 1.5);
      if (winT > 1.9 && !panelShown && App.current === ID) showPanel();
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.t === 'conf') { q.vy = Math.min(q.vy + 120 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; }
      else { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 3) + 300 * dt; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
    }
    shake = Math.max(0, shake - dt * 18);
  }

  /* ---------- الرسم ---------- */
  function drawTile(t, ox, oy, alpha = 1, sc = 1) {
    const x = inner.x + (t.px + ox) * cell, y = inner.y + (t.py + oy) * cell;
    const w = Math.sin(t.wig * 22) * t.wig * cell * .05;
    const lift = t.sq ? 1 : 0;
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.translate(x + cell / 2 + w, y + cell / 2); ctx.scale(sc * (1 + lift * .02), sc * (1 + lift * .02));
    const pad = shadowSpr.pad;
    ctx.globalAlpha = alpha * (.75 + lift * .2);
    ctx.drawImage(shadowSpr, -cell / 2 - pad + cell * .03, -cell / 2 - pad + cell * (.05 + lift * .04), cell + pad * 2, cell + pad * 2);
    ctx.globalAlpha = alpha;
    ctx.drawImage(sprites[t.id], -cell / 2, -cell / 2, cell, cell);
    if (lift) { ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.beginPath(); ctx.roundRect(-cell / 2 + 2, -cell / 2 + 2, cell - 4, cell - 4, cell * .1); ctx.fill(); }
    if (nums && phase !== 'win') {
      const r = Math.max(9, cell * .13), cx = -cell / 2 + r + cell * .06, cy = -cell / 2 + r + cell * .06;
      ctx.fillStyle = 'rgba(255,255,255,.92)'; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(90,60,214,.5)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = '#5A3CD6'; ctx.font = `900 ${Math.round(r * 1.25)}px ${getComputedStyle(document.body).fontFamily}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(t.id + 1), cx, cy + r * .08);
    }
    ctx.restore();
  }
  function render() {
    if (!ctx || !bgLayer) return;
    ctx.save();
    ctx.fillStyle = '#E9E4FF'; ctx.fillRect(0, 0, W, H);
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));
    // توهج الإطار عند الحل
    if (glow > 0) {
      ctx.save(); ctx.globalAlpha = glow * (.6 + .4 * Math.sin(T * 4));
      ctx.shadowColor = '#FFE45C'; ctx.shadowBlur = 40; ctx.fillStyle = '#FFE45C';
      ctx.beginPath(); ctx.roundRect(board.x, board.y, board.s, board.s, board.s * .055); ctx.fill(); ctx.restore();
    }
    ctx.drawImage(bgLayer, 0, 0, W, H);
    const last = N * N - 1;
    const ir = Math.max(6, cell * .12);
    ctx.save(); ctx.beginPath(); ctx.roundRect(inner.x, inner.y, inner.s, inner.s, ir); ctx.clip();
    for (const t of tiles) {
      if (t.id === last) continue;
      if (drag && drag.ch && drag.ch.ids.includes(t.id)) continue;
      drawTile(t, 0, 0);
    }
    if (drag && drag.ch) for (const id of drag.ch.ids) drawTile(tiles[id], drag.ch.dc * drag.off, drag.ch.dr * drag.off);
    // القطعة الأخيرة: ظاهرة قبل الخلط، تختفي، ثم تعود عند الحل
    const lt = tiles[last];
    if (phase === 'intro' && !scrambled) { drawTile(lt, 0, 0, 1); }
    else if (phase === 'intro') { const a = 1 - clamp(introT - .9, 0, .3) / .3; if (a > 0) drawTile(lt, 0, 0, a, .8 + a * .2); }
    else if (phase === 'win' && winT > 0) { const k = clamp(winT / .32, 0, 1); drawTile(lt, 0, 0, Math.min(1, k * 2), .5 + ease.outBack(k) * .5); }
    // اختفاء الفواصل: الصورة الكاملة
    if (phase === 'win') {
      const s = clamp((winT - .4) / .45, 0, 1);
      if (s > 0) { ctx.globalAlpha = ease.inOut(s); ctx.drawImage(pic, inner.x, inner.y, inner.s, inner.s); ctx.globalAlpha = 1; }
      if (shine >= 0 && shine < 1) {
        const sx = inner.x - inner.s * .6 + shine * inner.s * 2.2;
        const g = ctx.createLinearGradient(sx - inner.s * .25, inner.y, sx + inner.s * .25, inner.y + inner.s * .3);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.65)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(inner.x, inner.y, inner.s, inner.s);
      }
    }
    // نظرة على الصورة
    if (peek > .01) {
      ctx.globalAlpha = peek; ctx.drawImage(pic, inner.x, inner.y, inner.s, inner.s);
      ctx.fillStyle = `rgba(255,255,255,${.12 * peek})`; ctx.fillRect(inner.x, inner.y, inner.s, inner.s);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    // جسيمات
    for (const q of parts) {
      const a = 1 - q.age / q.life;
      ctx.save(); ctx.globalAlpha = q.t === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillStyle = q.c;
      if (q.t === 'star') { starPath(ctx, 0, 0, q.s * (.6 + a * .5), 0, .45); ctx.fill(); }
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
    if (App.current !== ID || !tiles.length) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); bakeTiles(); render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    c.fillStyle = G(c, 0, 0, s, s, '#E9E1FF', '#C9B8FF'); c.fillRect(0, 0, s, s);
    const pic2 = mk(300, 300), px = pic2.getContext('2d'); px.scale(.3, .3); paintRainbow(px, rng(5));
    const m = s * .17, L = s - m * 2, cs = L / 3, gp = 2.5;
    c.save(); c.shadowColor = 'rgba(60,30,120,.4)'; c.shadowBlur = 8; c.shadowOffsetY = 4;
    c.fillStyle = G(c, m, m, m + L, m + L, '#FFE79A', '#F7B733', '#E79A1E'); c.beginPath(); c.roundRect(m - 7, m - 7, L + 14, L + 14, 12); c.fill(); c.restore();
    c.fillStyle = '#2E2063'; c.beginPath(); c.roundRect(m - 1, m - 1, L + 2, L + 2, 7); c.fill();
    const empty = 8, place = [0, 1, 2, 3, 4, 5, 7, 6]; // قطعتان مبدّلتان
    for (let i = 0; i < 9; i++) {
      if (i === empty) continue;
      const k = place[i], r = Math.floor(i / 3), cc = i % 3, sr = Math.floor(k / 3), sc = k % 3;
      const x0 = m + cc * cs + gp / 2, y0 = m + r * cs + gp / 2, w = cs - gp;
      c.save(); c.beginPath(); c.roundRect(x0, y0, w, w, 4); c.clip();
      c.drawImage(pic2, sc * 100, sr * 100, 100, 100, x0, y0, w, w);
      c.fillStyle = G(c, 0, y0, 0, y0 + w, 'rgba(255,255,255,.3)', 'rgba(255,255,255,0)', 'rgba(0,0,0,.2)'); c.fillRect(x0, y0, w, w);
      c.restore();
    }
    // سهم صغير يشير إلى الفراغ
    const ex = m + 2 * cs + cs / 2, ey = m + 2 * cs + cs / 2;
    c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 3; c.setLineDash([4, 4]); c.beginPath(); c.roundRect(ex - cs / 2 + 4, ey - cs / 2 + 4, cs - 8, cs - 8, 4); c.stroke(); c.setLineDash([]);
    c.fillStyle = '#fff'; c.beginPath(); c.moveTo(ex - 9, ey - 7); c.lineTo(ex + 7, ey); c.lineTo(ex - 9, ey + 7); c.closePath(); c.fill();
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'ألغاز الصور المنزلقة', icon2: '🧩', isNew: true, music: 'slide',
    desc: () => App.g('حرّكي القطع وأعيدي الصورة', 'حرّك القطع وأعِد الصورة'),
    help: () => [
      '👆 ' + App.g('المسي', 'المس') + ' قطعة بجانب الفراغ ' + App.g('لتنزلق', 'لتنزلق') + ' إليه، أو ' + App.g('اسحبيها', 'اسحبها') + ' بإصبعك',
      '↔️ لمس قطعة في نفس الصف أو العمود يحرّك عدة قطع معًا',
      '🎯 ' + App.g('رتّبي', 'رتّب') + ' القطع حتى تكتمل الصورة كما كانت',
      '👁️ ' + App.g('اضغطي مطوّلًا', 'اضغط مطوّلًا') + ' على زر «الصورة» لرؤيتها، و🔢 يُظهر أرقامًا مساعدة',
      '⭐ ' + App.g('حُلّي', 'حُلّ') + ' اللغز بحركات أقل ووقت أقصر لتحصل على 3 نجوم، وكل صورة تفتح التالية!'
    ],
    icon,
    best() {
      const pr = loadProg(), ks = Object.keys(pr.b);
      if (!ks.length) return '';
      const st = ks.reduce((a, k) => a + (pr.b[k].s || 0), 0);
      return `🏆 ${App.g('حللتِ', 'حللت')} ${puzzlesWord(ks.length)} · ⭐ ${st}`;
    },
    enter() {
      paused = false;
      nums = !!store.get('slideNums', false); numBtn.classList.toggle('on', nums);
      const pr = loadProg();
      let p = 0, n = 3;
      if (pr.last && isUnlocked(pr, pr.last.p)) { p = pr.last.p; n = pr.last.n; if (pr.b[p + '_' + n]) { const nx = SIZES.find(s => !pr.b[p + '_' + s]); if (p + 1 < PICS.length && isUnlocked(pr, p + 1)) p = p + 1; else if (nx) n = nx; } }
      hintMode = '';
      startPuzzle(p, n);
      render();
      startLoop();
      openGallery();
    },
    leave() { stopLoop(); drag = null; setPeek(false); winOv.classList.remove('on'); galOv.classList.remove('on'); },
    pause() { paused = true; if (drag && drag.ch) { springBack(drag.ch, drag.off); for (const id of drag.ch.ids) tiles[id].sq = 0; } drag = null; setPeek(false); },
    resume() { paused = false; last = performance.now(); },
    /* للاختبار الآلي فقط */
    _state() { return { P, N, phase, moves, time, gapR, gapC, grid: grid.slice(), inner, cell }; },
    _solve() { // يحل اللغز فورًا (للاختبار)
      if (phase !== 'play') return;
      grid = tiles.map(t => t.id); grid[N * N - 1] = -1; gapR = gapC = N - 1;
      tiles.forEach(t => { t.fx = t.px; t.fy = t.py; t.r = Math.floor(t.id / N); t.c = t.id % N; t.a = 0; t.d = .3; t.ez = 0; });
      moves++; timing = true; solved();
    },
    back() {
      if (galOv.classList.contains('on')) { act('close'); return true; }
      return false;
    }
  });
})();
