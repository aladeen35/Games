/* =====================================================================
   قلعة المكعبات — تتريس مصقول للأطفال
   لوحة 10×20، كيس من 7 قطع، دوران SRS مع ركلات الجدار، قطعة شبحية،
   حفظ قطعة، طابور التالي، تأخير القفل، DAS/ARR، إيماءات وأزرار كبيرة.
   خلف اللوحة قلعة تُبنى طابقًا بعد طابق مع كل مستوى.
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'blocks';
  const COLS = 10, ROWS = 22, HID = 2;            // صفّان مخفيان فوق اللوحة
  const LOCK_MS = 500, MAX_RESETS = 15;
  const DAS = 165, ARR = 45, SOFT_MS = 36;        // لوحة المفاتيح
  const BTN_DAS = 210, BTN_ARR = 80;              // أزرار الشاشة
  const CLEAR_FLASH = 170, CLEAR_DUR = 380;
  const FONT = "'Baloo Bhaijaan 2',system-ui,sans-serif";

  /* ---------- الألوان ---------- */
  const PAL = {
    I: { l: '#C4F7FF', b: '#4FD6F2', d: '#1B97C2' },
    O: { l: '#FFF4B0', b: '#FFD23F', d: '#DE9410' },
    T: { l: '#EBD6FF', b: '#B47CFF', d: '#7442D4' },
    S: { l: '#D2FCCB', b: '#62DB7B', d: '#2B9F55' },
    Z: { l: '#FFD0DC', b: '#FF6B8F', d: '#D13363' },
    J: { l: '#D0DEFF', b: '#5E8DFF', d: '#2C52CF' },
    L: { l: '#FFE0BF', b: '#FF9F45', d: '#D6680F' },
    X: { l: '#F5F1FA', b: '#CBC2D9', d: '#8E85A3' },  // رمادي لنهاية اللعبة
    G: { l: '#F1E7D6', b: '#C2AE8E', d: '#86704F' }   // حجارة التحديات
  };
  const TYPES = 'IJLOSTZ';
  const BASE = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    O: [[1, 1], [1, 1]],
    S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]]
  };
  /* ---------- التحديات ----------
     g: 'clear' = أزل كل الحجارة، 'lines' = أكمل n صفوف — بعدد محدود من القطع p.
     rows: نمط الحجارة (من الأعلى للأسفل، يوضع في قاع اللوحة)، cheese: صفوف بثغرة واحدة (ثابتة بالبذرة).
     s3/s2: أقصى عدد قطع لثلاث/نجمتين، lv: سرعة السقوط. */
  const CHAL = [
    { ic: '🧱', g: 'clear', p: 10, s3: 4, s2: 7, rows: ['####.#####', '####.#####'] },
    { ic: '🎯', g: 'lines', n: 4, p: 16, s3: 11, s2: 13 },
    { ic: '🪜', g: 'clear', p: 14, s3: 7, s2: 10, rows: ['........##', '......####', '....######', '..########'] },
    { ic: '🕳️', g: 'clear', p: 12, s3: 6, s2: 9, rows: ['#########.', '#########.', '#########.', '#########.'] },
    { ic: '🏯', g: 'clear', p: 14, s3: 7, s2: 10, rows: ['##..##..##', '##..##..##', '##..##..##'] },
    { ic: '⚡', g: 'lines', n: 8, p: 28, s3: 22, s2: 25, lv: 3 },
    { ic: '🧀', g: 'clear', p: 18, s3: 11, s2: 14, cheese: 5, seed: 7 },
    { ic: '💎', g: 'clear', p: 18, s3: 11, s2: 14, rows: ['###....###', '##......##', '#........#', '##......##', '###....###'] },
    { ic: '🌋', g: 'clear', p: 20, s3: 12, s2: 16, rows: ['....##....', '...####...', '..######..', '.########.'], lv: 2 },
    { ic: '🚀', g: 'lines', n: 6, p: 20, s3: 16, s2: 18, lv: 6 },
    { ic: '🏔️', g: 'clear', p: 28, s3: 18, s2: 23, cheese: 8, seed: 21, lv: 3 },
    { ic: '👑', g: 'clear', p: 36, s3: 26, s2: 31, cheese: 10, seed: 99, lv: 4 }
  ];
  const loadChal = () => { const p = store.get('blocksChal', null) || {}; return { unlocked: clamp(p.unlocked || 1, 1, CHAL.length), stars: p.stars || {} }; };
  function chalRng(seed) { return () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }; }

  const rotCW = m => m.map((row, y) => row.map((_, x) => m[m.length - 1 - x][y]));
  const CELLS = {};
  for (const t of TYPES) {
    let m = BASE[t]; CELLS[t] = [];
    for (let r = 0; r < 4; r++) {
      const cs = []; m.forEach((row, y) => row.forEach((v, x) => { if (v) cs.push([x, y]); }));
      CELLS[t].push(cs); m = rotCW(m);
    }
  }
  /* جداول ركلات SRS (y للأعلى كما في المعيار؛ تُعكس عند التطبيق) — 3 = L */
  const K_JLSTZ = {
    '01': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], '10': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    '12': [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], '21': [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    '23': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], '32': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
    '30': [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], '03': [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]
  };
  const K_I = {
    '01': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]], '10': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    '12': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]], '21': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
    '23': [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]], '32': [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    '30': [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]], '03': [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]]
  };
  const BOUNDS = {};
  for (const t of TYPES) {
    const cs = CELLS[t][0];
    BOUNDS[t] = { x0: Math.min(...cs.map(c => c[0])), x1: Math.max(...cs.map(c => c[0])), y0: Math.min(...cs.map(c => c[1])), y1: Math.max(...cs.map(c => c[1])) };
  }

  const easeOutBack = p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
  const easeOutCubic = p => 1 - Math.pow(1 - p, 3);
  const hexA = (h, a) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

  /* ---------- رسم مكعب حلوى زجاجي ---------- */
  function drawBlock(g, x, y, s, p) {
    const i = Math.max(.5, s * .035), r = s * .24;
    const gr = g.createLinearGradient(x, y, x, y + s);
    gr.addColorStop(0, p.l); gr.addColorStop(.42, p.b); gr.addColorStop(1, p.d);
    g.beginPath(); g.roundRect(x + i, y + i, s - 2 * i, s - 2 * i, r); g.fillStyle = gr; g.fill();
    g.save(); g.clip();
    const rg = g.createRadialGradient(x + s * .45, y + s * .38, s * .12, x + s * .5, y + s * .5, s * .78);
    rg.addColorStop(0, 'rgba(255,255,255,0)'); rg.addColorStop(.7, hexA(p.d, .12)); rg.addColorStop(1, hexA(p.d, .6));
    g.fillStyle = rg; g.fillRect(x, y, s, s);
    // انعكاس سفلي خفيف (توهّج زجاجي)
    const bg = g.createLinearGradient(0, y + s * .62, 0, y + s);
    bg.addColorStop(0, 'rgba(255,255,255,0)'); bg.addColorStop(1, 'rgba(255,255,255,.28)');
    g.fillStyle = bg; g.fillRect(x, y + s * .62, s, s * .38);
    // لمعة علوية
    const hg = g.createLinearGradient(0, y + s * .08, 0, y + s * .5);
    hg.addColorStop(0, 'rgba(255,255,255,.92)'); hg.addColorStop(1, 'rgba(255,255,255,.06)');
    g.fillStyle = hg; g.beginPath(); g.roundRect(x + s * .14, y + s * .1, s * .72, s * .34, s * .16); g.fill();
    g.restore();
    g.fillStyle = 'rgba(255,255,255,.95)'; g.beginPath(); g.arc(x + s * .27, y + s * .24, s * .055, 0, 7); g.fill();
    g.lineWidth = Math.max(1, s * .045); g.strokeStyle = hexA(p.d, .75);
    g.beginPath(); g.roundRect(x + i, y + i, s - 2 * i, s - 2 * i, r); g.stroke();
  }

  /* ---------- القلعة (تُبنى حسب المستوى) ---------- */
  const CC = { wall: '#FFF8FF', wall2: '#E9DBFA', edge: '#B497D8', brick: 'rgba(180,150,215,.35)', win: '#8C6BC0', glow: '#FFE57A', roofA: '#FFA9D0', roofB: '#E8559A', door: '#FF8DB8' };
  const FLAGC = ['#FF6B8F', '#5E8DFF', '#FFD23F', '#62DB7B', '#B47CFF'];
  function drawCastle(g, cx, gy, u, stage, prog, time) {
    const X = v => cx + v * u, Y = v => gy - v * u;
    const lw = Math.max(1.1, u * .12);
    const wall = (x0, x1, b, t, cren) => {
      const gr = g.createLinearGradient(X(x0), 0, X(x1), 0);
      gr.addColorStop(0, CC.wall); gr.addColorStop(1, CC.wall2);
      g.fillStyle = gr; g.strokeStyle = CC.edge; g.lineWidth = lw; g.lineJoin = 'round';
      g.beginPath(); g.moveTo(X(x0), Y(b)); g.lineTo(X(x0), Y(t));
      if (cren) {
        let n = Math.max(3, Math.round((x1 - x0) / .85)); if (n % 2 === 0) n++;
        const w = (x1 - x0) / n;
        for (let i = 0; i < n; i++) {
          const a = x0 + i * w;
          if (i % 2 === 0) { g.lineTo(X(a), Y(t + .7)); g.lineTo(X(a + w), Y(t + .7)); g.lineTo(X(a + w), Y(t)); }
          else g.lineTo(X(a + w), Y(t));
        }
      } else g.lineTo(X(x1), Y(t));
      g.lineTo(X(x1), Y(b)); g.closePath(); g.fill(); g.stroke();
      // طوب خفيف
      g.strokeStyle = CC.brick; g.lineWidth = Math.max(.8, u * .07); g.beginPath();
      let row = 0;
      for (let y = b + 1; y < t - .3; y += 1.1, row++) {
        for (let x = x0 + (row % 2 ? .5 : 1); x < x1 - .6; x += 2) { g.moveTo(X(x), Y(y)); g.lineTo(X(x + .8), Y(y)); }
      }
      g.stroke();
    };
    const win = (xc, yb, w, h) => {
      g.beginPath(); g.moveTo(X(xc - w / 2), Y(yb)); g.lineTo(X(xc - w / 2), Y(yb + h - w / 2));
      g.arc(X(xc), Y(yb + h - w / 2), w / 2 * u, Math.PI, 0); g.lineTo(X(xc + w / 2), Y(yb)); g.closePath();
      if (stage >= 10) { const gg = g.createRadialGradient(X(xc), Y(yb + h * .5), 0, X(xc), Y(yb + h * .5), h * u); gg.addColorStop(0, '#FFF7C2'); gg.addColorStop(1, CC.glow); g.fillStyle = gg; }
      else g.fillStyle = CC.win;
      g.fill(); g.strokeStyle = CC.edge; g.lineWidth = lw * .8; g.stroke();
    };
    const roof = (x0, x1, b, apex) => {
      const m = (x0 + x1) / 2;
      const gr = g.createLinearGradient(X(x0), 0, X(x1), 0); gr.addColorStop(0, CC.roofA); gr.addColorStop(1, CC.roofB);
      g.fillStyle = gr; g.strokeStyle = '#C23E7E'; g.lineWidth = lw;
      g.beginPath(); g.moveTo(X(x0 - .3), Y(b)); g.quadraticCurveTo(X(m - .2), Y(b + (apex - b) * .45), X(m), Y(apex));
      g.quadraticCurveTo(X(m + .2), Y(b + (apex - b) * .45), X(x1 + .3), Y(b)); g.closePath(); g.fill(); g.stroke();
      // خطوط حلوى
      g.save(); g.clip(); g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = u * .35; g.beginPath();
      for (let k = 1; k < 4; k++) { const yy = b + (apex - b) * k / 4; g.moveTo(X(x0 - 1), Y(yy - .4)); g.lineTo(X(x1 + 1), Y(yy + .4)); }
      g.stroke(); g.restore();
      g.fillStyle = '#FFD23F'; g.beginPath(); g.arc(X(m), Y(apex), u * .32, 0, 7); g.fill();
    };
    const flag = (x, yb, h, col, ph) => {
      g.strokeStyle = '#9A7BC4'; g.lineWidth = Math.max(1, u * .12); g.beginPath(); g.moveTo(X(x), Y(yb)); g.lineTo(X(x), Y(yb + h)); g.stroke();
      const w = Math.sin(time / 260 + ph) * .25;
      g.fillStyle = col; g.beginPath(); g.moveTo(X(x), Y(yb + h));
      g.quadraticCurveTo(X(x + .8), Y(yb + h + w), X(x + 1.7), Y(yb + h - .45 + w * .6));
      g.quadraticCurveTo(X(x + .8), Y(yb + h - .9 + w), X(x), Y(yb + h - .95)); g.closePath(); g.fill();
    };
    const bunting = (xa, ya, xb, yb, sag) => {
      g.strokeStyle = '#B497D8'; g.lineWidth = Math.max(.8, u * .08);
      g.beginPath(); g.moveTo(X(xa), Y(ya)); g.quadraticCurveTo(X((xa + xb) / 2), Y((ya + yb) / 2 - sag * 2), X(xb), Y(yb)); g.stroke();
      const n = 6;
      for (let i = 1; i < n; i++) {
        const t = i / n, mx = (xa + xb) / 2, my = (ya + yb) / 2 - sag * 2;
        const px = (1 - t) * (1 - t) * xa + 2 * (1 - t) * t * mx + t * t * xb;
        const py = (1 - t) * (1 - t) * ya + 2 * (1 - t) * t * my + t * t * yb;
        g.fillStyle = FLAGC[i % FLAGC.length]; g.beginPath();
        g.moveTo(X(px - .3), Y(py)); g.lineTo(X(px + .3), Y(py)); g.lineTo(X(px), Y(py - .7)); g.closePath(); g.fill();
      }
    };
    const comps = [
      { k: 11, base: -2, top: 0, draw() {
        const cols = ['#FF9AA2', '#FFC48C', '#FFF1A0', '#B5EAD7', '#A0D8FF', '#C7B3FF'];
        g.lineWidth = u * .75; g.globalAlpha *= .55;
        cols.forEach((c, i) => { g.strokeStyle = c; g.beginPath(); g.arc(cx, gy, (16 - i * .75) * u, Math.PI, 0); g.stroke(); });
      } },
      { k: 9, base: 0, top: 8.6, draw() {
        wall(-11.2, -8.8, 0, 5.4, true); wall(8.8, 11.2, 0, 5.4, true);
        win(-10, 2.6, .8, 1.5); win(10, 2.6, .8, 1.5);
      } },
      { k: 1, base: 0, top: 5.8, draw() {
        wall(-6, 6, 0, 5, true);
        // البوابة
        g.beginPath(); g.moveTo(X(-1.3), Y(0)); g.lineTo(X(-1.3), Y(2.2)); g.arc(X(0), Y(2.2), 1.3 * u, Math.PI, 0); g.lineTo(X(1.3), Y(0)); g.closePath();
        const dg = g.createLinearGradient(0, Y(3.5), 0, Y(0)); dg.addColorStop(0, '#FFB3D1'); dg.addColorStop(1, CC.door);
        g.fillStyle = dg; g.fill(); g.strokeStyle = '#C94C86'; g.lineWidth = lw; g.stroke();
        g.strokeStyle = 'rgba(201,76,134,.5)'; g.beginPath(); g.moveTo(X(0), Y(0)); g.lineTo(X(0), Y(3.4)); g.stroke();
        g.fillStyle = '#FFD23F'; g.beginPath(); g.arc(X(.45), Y(1.3), u * .16, 0, 7); g.fill();
        win(-3.6, 2.2, .9, 1.6); win(3.6, 2.2, .9, 1.6);
      } },
      { k: 4, base: 5, top: 10.2, draw() { wall(-3.6, 3.6, 5, 9.5, true); win(-1.8, 6.5, .9, 1.7); win(1.8, 6.5, .9, 1.7); } },
      { k: 7, base: 9.5, top: 14.3, draw() {
        wall(-1.7, 1.7, 9.5, 13.6, true);
        g.fillStyle = stage >= 10 ? CC.glow : CC.win; g.beginPath(); g.arc(X(0), Y(11.6), u * .7, 0, 7); g.fill();
        g.strokeStyle = CC.edge; g.lineWidth = lw; g.stroke();
      } },
      { k: 8, base: 13.6, top: 21, draw() { roof(-2, 2, 13.6, 18); flag(0, 18.2, 2.6, '#FF6B8F', 1); } },
      { k: 2, base: 0, top: 9.2, draw() { wall(-8.6, -5.4, 0, 8.5, true); win(-7, 5.3, .9, 1.7); win(-7, 1.6, .9, 1.7); } },
      { k: 3, base: 0, top: 9.2, draw() { wall(5.4, 8.6, 0, 8.5, true); win(7, 5.3, .9, 1.7); win(7, 1.6, .9, 1.7); } },
      { k: 5, base: 8.5, top: 12.4, draw() { roof(-8.8, -5.2, 8.5, 12); roof(5.2, 8.8, 8.5, 12); } },
      { k: 6, base: 12, top: 15, draw() { flag(-7, 12.2, 2.2, '#5E8DFF', 0); flag(7, 12.2, 2.2, '#62DB7B', 2); } },
      { k: 9.5, base: 5.4, top: 8.6, draw() { roof(-11.4, -8.6, 6.1, 8.4); roof(8.6, 11.4, 6.1, 8.4); } },
      { k: 10, base: 4, top: 9, draw() { bunting(-5.4, 7.6, -3.6, 8.6, .3); bunting(3.6, 8.6, 5.4, 7.6, .3); bunting(-8.8, 4.6, -6, 4.4, .25); bunting(6, 4.4, 8.8, 4.6, .25); } }
    ];
    for (const c of comps) {
      const kk = Math.floor(c.k);
      if (kk > stage) continue;
      const p = prog[kk] == null ? 1 : prog[kk];
      if (p <= 0) continue;
      const e = p >= 1 ? 1 : easeOutBack(p);
      g.save();
      if (p < 1) {
        g.beginPath(); g.rect(-1e4, -1e4, 3e4, Y(c.base) + 1e4); g.clip();
        g.translate(0, (1 - e) * (c.top - c.base) * u);
        g.globalAlpha = Math.min(1, p * 2.5);
      }
      c.draw();
      g.restore();
    }
  }

  /* ---------- الشاشة ---------- */
  App.css(`
#blocks{background:#CFE0FF;overflow:hidden}
#blocks .cv{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
#blocks .bar .ib{color:#7A4FC0}
#blocks .bar .chip{min-width:52px;padding:3px 8px;color:#5B3B8C;box-shadow:0 3px 0 rgba(120,80,180,.18)}
#blocks .bar .chip b{font-size:17px;display:inline-block}
#blocks .bar .chip.bump b{animation:blkBump .35s cubic-bezier(.3,1.8,.6,1)}
@keyframes blkBump{40%{transform:scale(1.3)}}
#blocks .ctl{position:absolute;left:0;right:0;bottom:0;z-index:6;direction:ltr;display:flex;justify-content:center;align-items:flex-end;gap:7px;padding:8px 10px max(12px,env(safe-area-inset-bottom));pointer-events:none}
#blocks .ctl button{pointer-events:auto;position:relative;flex:1 1 0;max-width:88px;height:64px;border-radius:22px;font-size:28px;line-height:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;
  background:linear-gradient(#FFFFFF,#ECE2FF);box-shadow:0 5px 0 #C4AEEA,0 9px 16px rgba(110,70,170,.25);transition:transform .06s;touch-action:none}
#blocks .ctl button::before{content:'';position:absolute;left:14%;right:14%;top:5px;height:36%;border-radius:14px;background:linear-gradient(rgba(255,255,255,.9),rgba(255,255,255,0));pointer-events:none}
#blocks .ctl button.on{transform:translateY(4px);box-shadow:0 1px 0 #C4AEEA,0 3px 8px rgba(110,70,170,.2)}
#blocks .ctl .k-rot{background:linear-gradient(#FFD6EA,#FF8DC0);box-shadow:0 5px 0 #DD5596,0 9px 16px rgba(221,85,150,.3)}
#blocks .ctl .k-rot.on{box-shadow:0 1px 0 #DD5596}
#blocks .ctl .k-soft{background:linear-gradient(#E6FFF1,#A5EDC6);box-shadow:0 5px 0 #66C493,0 9px 16px rgba(80,170,120,.25)}
#blocks .ctl .k-soft.on{box-shadow:0 1px 0 #66C493}
#blocks .ctl .k-hard{background:linear-gradient(#E0F4FF,#98D4FF);box-shadow:0 5px 0 #57A8E2,0 9px 16px rgba(70,140,210,.25)}
#blocks .ctl .k-hard.on{box-shadow:0 1px 0 #57A8E2}
#blocks .ctl .k-hold{background:linear-gradient(#FFF6D2,#FFD566);box-shadow:0 5px 0 #E0A92A,0 9px 16px rgba(220,160,40,.25)}
#blocks .ctl .k-hold.on{box-shadow:0 1px 0 #E0A92A}
#blocks .ctl .k-hold.off{filter:grayscale(.8);opacity:.6}
#blocks .ctl .k-hold small{font-size:11px;font-weight:800;color:#8A5A00}
#blocks .ctl .k-hold span{font-size:22px}
#blocks .ctl .sp{flex:0 0 4px}
#blocks .bar .chip small,#blocks .bar .chip b{white-space:nowrap}
@media (max-width:440px){#blocks .bar{gap:5px;padding-left:8px;padding-right:8px}#blocks .bar .ib{width:39px;height:39px;flex:0 0 39px;font-size:18px}#blocks .bar .chip{min-width:44px;padding:3px 6px}#blocks .bar .chip small{font-size:10px}#blocks .bar .chip b{font-size:16px}}
@media (max-width:370px){#blocks .ctl{gap:5px;padding-left:6px;padding-right:6px}#blocks .ctl button{height:58px;font-size:24px;border-radius:18px}#blocks .bar .chip{min-width:46px;padding:3px 6px}#blocks .bar .chip b{font-size:15px}#blocks .bar{gap:6px}}
#blocks .overlay{background:rgba(70,40,120,.38)}
#blocks .panel{border-color:#E6D9FF;box-shadow:0 8px 0 #C9B3EC,0 20px 40px rgba(60,30,110,.3);color:#4E2F7A}
#blocks .panel h3{color:#8A4FD8}
#blocks .panel .big{color:#5B3B8C}
#blocks .panel .btn{background:linear-gradient(#C69AFF,#9B5CF5);box-shadow:0 4px 0 #7340C9}
#blocks .panel .btn.alt{background:#fff;color:#7A4FC0;box-shadow:0 4px 0 #D9C8F5;border-color:#ECE2FF}
#blocks .panel .rec{font-weight:900;color:#E0217F;font-size:19px;margin:2px 0 4px;animation:blkBump .6s ease 2}
#blocks .panel .meta{display:flex;justify-content:center;gap:8px;margin:8px 0 12px;flex-wrap:wrap}
#blocks .cg{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin:10px 0 12px}
#blocks .cb{position:relative;aspect-ratio:1;border-radius:18px;border:0;font-family:inherit;font-weight:900;color:#5B3B8C;
  background:linear-gradient(#FFFFFF,#EBDDFF);box-shadow:0 4px 0 #C9B3EC,0 6px 12px rgba(110,70,170,.18);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2px}
#blocks .cb:active{transform:translateY(3px);box-shadow:0 1px 0 #C9B3EC}
#blocks .cb .n{font-size:12px;opacity:.7;line-height:1}
#blocks .cb .e{font-size:24px;line-height:1.15}
#blocks .cb .s{font-size:10px;letter-spacing:-1px;line-height:1;height:11px}
#blocks .cb .s i{font-style:normal}
#blocks .cb .s i.off{filter:grayscale(1);opacity:.3}
#blocks .cb.cur{outline:3px solid #FF8DC0;outline-offset:2px}
#blocks .cb.lock{background:linear-gradient(#F3F0F7,#DCD6E6);box-shadow:0 4px 0 #BDB5CC;color:#9890A8}
#blocks .cb.lock .e{filter:grayscale(1);opacity:.35}
#blocks .cb.lock::after{content:'🔒';position:absolute;bottom:3px;font-size:14px}
#blocks .chp{width:min(94vw,420px);max-height:88vh;overflow-y:auto;touch-action:pan-y}
#blocks .goal{font-weight:800;font-size:16px;margin:4px 0 10px}
#blocks .panel .meta span{background:#F4EEFF;border-radius:99px;padding:3px 12px;font-weight:800;font-size:15px}
`);

  const root = App.section(ID, `
    <canvas class="cv"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib pausebtn" aria-label="إيقاف مؤقت">⏸️</button>
      <button class="ib chalbtn" aria-label="التحديات">🎯</button>
      <span class="grow"></span>
      <div class="chip c-score"><small>النقاط</small><b>0</b></div>
      <div class="chip c-lines"><small>المستوى 1</small><b>0/10</b></div>
      <div class="chip c-best"><small>الأفضل</small><b>0</b></div>
    </div>
    <div class="ctl">
      <button class="k-mv" data-k="L" aria-label="يسار">⬅️</button>
      <button class="k-mv" data-k="R" aria-label="يمين">➡️</button>
      <button class="k-rot" data-k="rot" aria-label="تدوير">🔄</button>
      <button class="k-soft" data-k="soft" aria-label="إنزال">⬇️</button>
      <button class="k-hard" data-k="hard" aria-label="إسقاط">⏬</button>
      <button class="k-hold" data-k="hold" aria-label="احفظ"><span>📦</span><small>احفظ</small></button>
    </div>
    <div class="overlay ov-pause"><div class="panel">
      <h3>⏸️ استراحة</h3><p class="pmsg"></p>
      <button class="btn b-resume">متابعة ▶️</button><br>
      <button class="btn alt b-restart">من جديد 🔄</button>
      <button class="btn alt b-chal">🎯 التحديات</button>
      <button class="btn alt home">القائمة 🏠</button>
    </div></div>
    <div class="overlay ov-chal"><div class="panel chp">
      <h3>🎯 التحديات</h3><div class="cg"></div>
      <button class="btn b-free">♾️ اللعب الحر</button><br>
      <button class="btn alt b-cclose">✕ إغلاق</button>
    </div></div>
    <div class="overlay ov-over"><div class="panel"></div></div>
  `);
  const cv = root.querySelector('.cv'), bar = root.querySelector('.bar'), ctl = root.querySelector('.ctl');
  const ovPause = root.querySelector('.ov-pause'), ovOver = root.querySelector('.ov-over'), ovChal = root.querySelector('.ov-chal');
  const chipS = root.querySelector('.c-score'), chipL = root.querySelector('.c-lines'), chipB = root.querySelector('.c-best');
  const holdBtn = root.querySelector('.k-hold');

  /* ---------- الحالة ---------- */
  let ctx, W = 1, H = 1, DPR = 1, L = null;
  let bgC = document.createElement('canvas'), boardC = document.createElement('canvas');
  let sprites = {}, whiteSpr = null;
  let G = null, raf = 0, last = 0, running = false, sheetPaused = false, time = 0;
  let parts = [], banners = [], clouds = [];
  const castleProg = Array(12).fill(1);
  let castleStage = 1, fireT = 0;
  const dirs = [], softSrcs = new Set();
  let gest = null;

  const best = () => store.get('blocksBest', 0);

  function newGame(chalN) {
    const def = chalN ? CHAL[chalN - 1] : null;
    G = {
      board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
      bag: [], queue: [], hold: null, canHold: true, cur: null,
      score: 0, lines: 0, level: 1, state: 'play', paused: false,
      lockT: 0, resets: 0, lowest: 0, grav: 0, softT: 0, dasDir: 0, dasT: 0, dasArr: ARR,
      clearing: null, fall: null, landFx: [], rotFx: 0, holdFx: 0, qShift: 0,
      shake: 0, bounce: 0, overT: 0, overShown: false, result: null, best: best(),
      chal: def ? { n: chalN, def, used: 0, total: 0 } : null, won: false
    };
    if (def) {
      G.level = def.lv || 1;
      let rows = def.rows ? def.rows.slice() : [];
      if (def.cheese) {
        const rr = chalRng(def.seed || 1); let prev = -1;
        for (let i = 0; i < def.cheese; i++) {
          let h; do h = Math.floor(rr() * COLS); while (h === prev);
          prev = h; rows.push(Array.from({ length: COLS }, (_, x) => x === h ? '.' : '#').join(''));
        }
      }
      rows.forEach((str, i) => { const y = ROWS - rows.length + i; for (let x = 0; x < COLS; x++) if (str[x] === '#') { G.board[y][x] = 'G'; G.chal.total++; } });
    }
    ovChal.classList.remove('on');
    refill();
    parts = []; banners = [];
    castleStage = 1; castleProg.fill(0); castleProg[0] = 1;
    dirs.length = 0; softSrcs.clear(); gest = null;
    ovPause.classList.remove('on'); ovOver.classList.remove('on');
    spawn();
    hud(true);
  }
  function refill() {
    while (G.queue.length < 5) {
      if (!G.bag.length) {
        G.bag = TYPES.split('');
        for (let i = G.bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [G.bag[i], G.bag[j]] = [G.bag[j], G.bag[i]]; }
      }
      G.queue.push(G.bag.pop());
    }
  }
  function fits(t, r, x, y) {
    for (const [cx, cy] of CELLS[t][r]) {
      const X = x + cx, Y = y + cy;
      if (X < 0 || X >= COLS || Y >= ROWS) return false;
      if (Y >= 0 && G.board[Y][X]) return false;
    }
    return true;
  }
  const garbageLeft = () => { let n = 0; for (const row of G.board) for (const v of row) if (v === 'G') n++; return n; };
  const chalDone = () => G.chal.def.g === 'lines' ? G.lines >= G.chal.def.n : garbageLeft() === 0;
  function spawn(type, fromHold) {
    if (G.chal && (!fromHold || !type)) {
      if (chalDone()) { chalEnd(); return; }
      if (G.chal.used >= G.chal.def.p) { gameOver('pieces'); return; }
      G.chal.used++;
    }
    if (!type) { type = G.queue.shift(); refill(); G.qShift = 1; }
    const c = { t: type, r: 0, x: type === 'O' ? 4 : 3, y: 1 };
    if (!fits(c.t, 0, c.x, c.y)) { c.y = 0; if (!fits(c.t, 0, c.x, c.y)) { G.cur = null; gameOver(); return; } }
    c.vx = c.x; c.vy = c.y - .7;
    G.cur = c; G.lockT = 0; G.resets = 0; G.lowest = c.y; G.grav = 0;
    if (!fromHold) G.canHold = true;
    holdBtn.classList.toggle('off', !G.canHold);
  }
  const grounded = () => !fits(G.cur.t, G.cur.r, G.cur.x, G.cur.y + 1);
  const canAct = () => G && G.state === 'play' && G.cur && !G.clearing && !G.paused && !sheetPaused && running;
  function onManip() {
    if ((G.lockT > 0 || grounded()) && G.resets < MAX_RESETS) { G.lockT = 0; G.resets++; }
  }
  function tryMove(dx, dy, manip) {
    const c = G.cur;
    if (!fits(c.t, c.r, c.x + dx, c.y + dy)) return false;
    c.x += dx; c.y += dy;
    if (c.y > G.lowest) { G.lowest = c.y; G.resets = 0; G.lockT = 0; }
    if (manip) onManip();
    return true;
  }
  function move(dir) {
    if (!canAct()) return false;
    if (tryMove(dir, 0, true)) { Sound.tone(dir > 0 ? 560 : 520, .035, 'triangle', .05); return true; }
    return false;
  }
  function rotate(d) {
    if (!canAct()) return;
    const c = G.cur;
    if (c.t === 'O') { G.rotFx = 1; Sound.tone(700, .05, 'sine', .06, 120); return; }
    const to = (c.r + d + 4) % 4, tb = c.t === 'I' ? K_I : K_JLSTZ;
    for (const [kx, ky] of tb['' + c.r + to]) {
      if (fits(c.t, to, c.x + kx, c.y - ky)) {
        c.x += kx; c.y -= ky; c.r = to;
        if (c.y > G.lowest) { G.lowest = c.y; G.resets = 0; G.lockT = 0; }
        onManip(); G.rotFx = 1;
        Sound.tone(d > 0 ? 760 : 680, .06, 'sine', .09, 260); vibrate(8);
        return;
      }
    }
    Sound.tone(200, .06, 'triangle', .05);
  }
  function hardDrop() {
    if (!canAct()) return;
    const c = G.cur; let d = 0;
    while (fits(c.t, c.r, c.x, c.y + d + 1)) d++;
    // آثار السقوط
    const pal = PAL[c.t];
    const cols = {};
    for (const [cx, cy] of CELLS[c.t][c.r]) { const X = c.x + cx, Y = c.y + cy; if (cols[X] == null || Y < cols[X]) cols[X] = Y; }
    if (d > 0) for (const X in cols) {
      const y0 = Math.max(HID, cols[X]), y1 = cols[X] + d;
      if (y1 > y0) parts.push({ k: 'trail', x: L.bx + (+X + .5) * L.c, y0: L.by + (y0 - HID) * L.c, y1: L.by + (y1 - HID) * L.c, w: L.c * .8, col: pal.b, life: 220, max: 220 });
    }
    c.y += d; c.vy = c.y; c.vx = c.x;
    G.score += 2 * d;
    G.shake = Math.max(G.shake, 2.5);
    Sound.noise(.12, 1600, 300, .1, 1);
    lock(true);
  }
  function doHold() {
    if (!canAct()) return;
    if (!G.canHold) { Sound.error(); return; }
    const t = G.cur.t;
    if (G.hold) { const h = G.hold; G.hold = t; spawn(h, true); } else { G.hold = t; spawn(null, true); }
    G.canHold = false; G.holdFx = 1;
    holdBtn.classList.add('off');
    Sound.tone(520, .12, 'sine', .1, 340); vibrate(10);
  }
  function lock(hard) {
    const c = G.cur; let above = true;
    let minY = 99, maxY = -1, sx = 0;
    for (const [cx, cy] of CELLS[c.t][c.r]) {
      const X = c.x + cx, Y = c.y + cy;
      if (Y >= 0) G.board[Y][X] = c.t;
      if (Y >= HID) above = false;
      G.landFx.push({ x: X, y: Y, t: 0 });
      minY = Math.min(minY, Y); maxY = Math.max(maxY, Y); sx += X;
    }
    G.cur = null;
    Sound.thud(); vibrate(hard ? 18 : 10);
    G.bounce = Math.max(G.bounce, hard ? 1 : .45);
    // غبار صغير تحت القطعة
    const px = L.bx + (sx / 4 + .5) * L.c, py = L.by + (maxY + 1 - HID) * L.c;
    for (let i = 0; i < (hard ? 10 : 4); i++) parts.push({ k: 'dot', x: px + rand(-L.c, L.c), y: py, vx: rand(-90, 90), vy: rand(-120, -30), g: 500, s: rand(2, 4), col: 'rgba(255,255,255,.9)', life: 380, max: 380 });
    if (above) { gameOver(); return; }
    const rows = [];
    for (let y = 0; y < ROWS; y++) if (G.board[y].every(v => v)) rows.push(y);
    if (rows.length) startClear(rows); else spawn();
    hud();
  }
  function startClear(rows) {
    const n = rows.length;
    G.clearing = { rows, t: 0, burst: false };
    const pts = [0, 100, 300, 500, 800][n] * G.level;
    G.score += pts; G.lines += n;
    const cy = L.by + ((rows[0] + rows[n - 1]) / 2 + .5 - HID) * L.c;
    banners.push({ text: '+' + pts, x: L.bx + L.c * 5, y: cy, t: 0, dur: 900, size: L.c * .9, kind: 'float' });
    App.achieve('blocks_line');
    if (n === 4) {
      banners.push({ text: 'رباعية!', sub: '💥', t: 0, dur: 1500, size: L.c * 2.1, kind: 'big', col: ['#FFE066', '#FF6B8F'] });
      G.shake = 9; Sound.boom(); setTimeout(() => Sound.win(), 120); vibrate(45);
      App.achieve('blocks_four'); App.speak('رباعية');
    } else {
      const f = [523, 659, 784, 988];
      for (let i = 0; i < n + 1; i++) Sound.tone(f[i], .14, 'triangle', .12, 0, i * .07);
      Sound.pop(); vibrate(22);
      if (n >= 2) banners.push({ text: n === 2 ? 'سطران!' : 'ثلاثة!', t: 0, dur: 1000, size: L.c * 1.35, kind: 'big', col: n === 2 ? ['#A0F0FF', '#5E8DFF'] : ['#D9FFB0', '#2BB673'] });
    }
    const nl = 1 + Math.floor(G.lines / 10);
    if (!G.chal && nl > G.level) {
      G.level = nl;
      setTimeout(() => {
        if (!G) return;
        banners.push({ text: 'المستوى ' + nl, sub: '🏰 طابق جديد للقلعة!', t: 0, dur: 1800, size: L.c * 1.6, kind: 'big', col: ['#FFD6F0', '#B47CFF'], y: L.by + L.c * 9.5 });
        Sound.star(); setTimeout(() => Sound.win(), 200);
      }, n === 4 ? 900 : 350);
      const ns = Math.min(11, nl);
      for (let k = castleStage + 1; k <= ns; k++) castleProg[k] = -(k - castleStage - 1) * .4;
      if (ns > castleStage) { castleStage = ns; castleBurst(); }
      if (nl >= 5) App.achieve('blocks_lvl5');
    }
  }
  function castleBurst() {
    const u = L.u;
    for (let i = 0; i < 40; i++) {
      const a = rand(0, Math.PI * 2), sp = rand(80, 300);
      parts.push({ k: i % 3 ? 'rect' : 'star', x: L.cx + rand(-6, 6) * u, y: L.gy - rand(4, 14) * u, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 150, g: 300, s: rand(4, 8), rot: rand(0, 6), vr: rand(-8, 8), col: FLAGC[i % 5], life: rand(900, 1500), max: 1500 });
    }
  }
  function finishClear() {
    const rows = G.clearing.rows;
    // انفجار الحلوى (إن لم يحدث)
    const keep = [];
    for (let y = 0; y < ROWS; y++) if (!rows.includes(y)) keep.push(y);
    const nb = [], drop = Array(ROWS).fill(0);
    for (let i = 0; i < rows.length; i++) nb.push(Array(COLS).fill(null));
    keep.forEach(y => nb.push(G.board[y]));
    keep.forEach((y, i) => { drop[rows.length + i] = rows.length + i - y; });
    G.board = nb;
    G.fall = { t: 0, dur: 210, drop };
    G.clearing = null;
    spawn();
    hud();
  }
  function burstRows(rows) {
    const c = L.c;
    for (const y of rows) for (let x = 0; x < COLS; x++) {
      const t = G.board[y][x] || 'T', pal = PAL[t];
      const px = L.bx + (x + .5) * c, py = L.by + (y - HID + .5) * c;
      for (let i = 0; i < 3; i++) {
        const k = i === 0 ? 'dot' : 'rect';
        parts.push({ k, x: px + rand(-c * .3, c * .3), y: py + rand(-c * .3, c * .3), vx: rand(-260, 260), vy: rand(-520, -120), g: 1100,
          s: k === 'dot' ? rand(c * .14, c * .22) : rand(c * .2, c * .34), rot: rand(0, 6), vr: rand(-10, 10), col: i === 2 ? pal.l : pal.b, life: rand(800, 1300), max: 1300 });
      }
      parts.push({ k: 'spark', x: px, y: py, vx: rand(-60, 60), vy: rand(-60, 60), g: 0, s: c * .5, life: 300, max: 300 });
    }
    if (parts.length > 500) parts.splice(0, parts.length - 500);
  }
  function chalEnd() {
    G.state = 'over'; G.won = true; G.overT = 0; G.cur = null;
    dirs.length = 0; softSrcs.clear(); G.dasDir = 0;
    const d = G.chal.def, u = G.chal.used, st = u <= d.s3 ? 3 : u <= d.s2 ? 2 : 1;
    const pr = loadChal(), prev = pr.stars[G.chal.n] || 0;
    if (st > prev) pr.stars[G.chal.n] = st;
    if (G.chal.n >= pr.unlocked) pr.unlocked = Math.min(CHAL.length, G.chal.n + 1);
    store.set('blocksChal', pr);
    G.result = { chal: true, win: true, stars: st, gain: Math.max(0, st - prev) };
    banners.push({ text: App.g('أحسنتِ!', 'أحسنت!'), sub: '🎯', t: 0, dur: 1400, size: L.c * 1.8, kind: 'big', col: ['#FFE066', '#FF8DC0'] });
    Sound.star(); setTimeout(() => Sound.win(), 150); vibrate(30);
    castleBurst();
    hud();
  }
  function gameOver(reason) {
    G.state = 'over'; G.overT = 0; G.cur = null;
    dirs.length = 0; softSrcs.clear(); G.dasDir = 0;
    if (G.chal) { G.result = { chal: true, win: false, stars: 0, reason }; Sound.lose(); vibrate(40); G.shake = 4; hud(); return; }
    const b = best(), rec = G.score > b && G.score > 0;
    if (rec) store.set('blocksBest', G.score);
    G.result = { rec, best: Math.max(b, G.score), stars: Math.floor(G.lines / 4) + (rec ? 3 : 0) };
    Sound.lose(); vibrate(40);
    G.shake = 4;
    hud();
  }
  function awardStars() {
    if (!G || !G.result || G.result.given) return;
    G.result.given = true;
    if (G.result.stars > 0) App.addStars(G.result.stars);
  }
  function chalGoalText(d) {
    return d.g === 'lines' ? `${App.g('أكملي', 'أكمل')} ${d.n} صفوف` : `${App.g('أزيلي', 'أزِل')} كل الحجارة 🪨`;
  }
  function showChalOver() {
    const r = G.result, d = G.chal.def, n = G.chal.n, last = n >= CHAL.length;
    ovOver.querySelector('.panel').innerHTML = r.win ? `
      <h3>🎯 ${App.g('أحسنتِ!', 'أحسنت!')} 🎉</h3>
      <div class="stars3">${[1, 2, 3].map(k => `<span class="${k <= r.stars ? '' : 'off'}">⭐</span>`).join('')}</div>
      <div class="meta"><span>🎯 التحدي ${n}</span><span>🧩 ${G.chal.used} قطعة</span><span>🍬 ${G.score}</span></div>
      ${last ? '' : '<button class="btn b-next">التالي ▶️</button><br>'}
      <button class="btn alt b-again">🔄 مرة أخرى</button>
      <button class="btn alt b-list">🎯 التحديات</button>` : `
      <h3>😮 ${App.g('كدتِ تنجحين!', 'كدت تنجح!')}</h3>
      <div class="big">🧱</div>
      <p>${r.reason === 'pieces' ? 'نفدت القطع 🧩' : 'وصلت المكعبات إلى الأعلى'} — ${App.g('حاولي مرة أخرى!', 'حاول مرة أخرى!')}</p>
      <button class="btn b-again">🔄 مرة أخرى</button><br>
      <button class="btn alt b-list">🎯 التحديات</button>
      <button class="btn alt home">القائمة 🏠</button>`;
    const pnl = ovOver.querySelector('.panel');
    pnl.querySelector('.b-again').onclick = () => { Sound.tap(); newGame(n); };
    pnl.querySelector('.b-list').onclick = () => { Sound.tap(); openChal(); };
    const nb = pnl.querySelector('.b-next'); if (nb) nb.onclick = () => { Sound.tap(); newGame(n + 1); };
    ovOver.classList.add('on');
    if (r.win) {
      App.speak(App.g('أحسنتِ!', 'أحسنت!'));
      if (r.gain) App.addStars(r.gain);
      for (let i = 0; i < 60; i++) parts.push({ k: 'rect', x: rand(0, W), y: rand(-40, 0), vx: rand(-60, 60), vy: rand(60, 240), g: 120, s: rand(5, 9), rot: rand(0, 6), vr: rand(-6, 6), col: FLAGC[i % 5], life: 2600, max: 2600 });
    }
  }
  function openChal() {
    const pr = loadChal(), g = ovChal.querySelector('.cg'), curN = G && G.chal ? G.chal.n : 0;
    g.innerHTML = CHAL.map((d, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="cb${lock ? ' lock' : ''}${n === curN ? ' cur' : ''}" data-c="${n}" aria-label="التحدي ${n}"><span class="n">${n}</span><span class="e">${d.ic}</span>
        <span class="s">${lock ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    g.querySelectorAll('[data-c]').forEach(b => b.onclick = () => {
      const n = +b.dataset.c;
      if (n > loadChal().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startChal(n);
    });
    if (G && G.state === 'play' && !G.paused) setPaused(true);
    ovPause.classList.remove('on'); ovOver.classList.remove('on'); ovChal.classList.add('on');
  }
  function startChal(n) {
    newGame(n);
    const d = CHAL[n - 1];
    banners.push({ text: 'التحدي ' + n, sub: chalGoalText(d) + ` · ${d.p} قطعة`, t: 0, dur: 2200, size: L.c * 1.4, kind: 'big', col: ['#FFD6F0', '#B47CFF'], y: L.by + L.c * 8 });
    Sound.whoosh();
  }
  function closeChal() {
    ovChal.classList.remove('on');
    if (G && G.state === 'play' && G.paused) ovPause.classList.add('on');
    else if (G && G.state === 'over' && G.overShown) ovOver.classList.add('on');
  }
  root.querySelector('.chalbtn').addEventListener('click', () => { Sound.tap(); openChal(); });
  root.querySelector('.b-chal').addEventListener('click', () => { Sound.tap(); openChal(); });
  root.querySelector('.b-cclose').addEventListener('click', () => { Sound.tap(); closeChal(); });
  root.querySelector('.b-free').addEventListener('click', () => { Sound.tap(); ovChal.classList.remove('on'); newGame(); });
  function showOver() {
    if (G.chal) { G.overShown = true; showChalOver(); return; }
    G.overShown = true;
    const r = G.result;
    ovOver.querySelector('.panel').innerHTML = `
      <h3>${r.rec ? '🏆 رقم قياسي!' : '🏰 انتهت اللعبة'}</h3>
      ${r.rec ? `<div class="rec">${App.g('أنتِ بطلة القلعة!', 'أنت بطل القلعة!')} 🎉</div>` : ''}
      <div class="big">${G.score}</div>
      <div class="meta"><span>🧱 ${G.lines} صف</span><span>🏯 المستوى ${G.level}</span><span>🏆 ${r.best}</span></div>
      ${r.stars ? `<p>⭐ +${r.stars} ${r.stars === 1 ? 'نجمة' : 'نجوم'}</p>` : `<p>${App.g('أكملي صفوفًا لتربحي النجوم', 'أكمل صفوفًا لتربح النجوم')} ⭐</p>`}
      <button class="btn b-again">${App.g('العبي مجددًا', 'العب مجددًا')} 🔄</button>
      <button class="btn alt home">القائمة 🏠</button>`;
    ovOver.querySelector('.b-again').onclick = () => { Sound.tap(); newGame(); };
    ovOver.classList.add('on');
    if (r.rec) { Sound.win(); for (let i = 0; i < 60; i++) parts.push({ k: 'rect', x: rand(0, W), y: rand(-40, 0), vx: rand(-60, 60), vy: rand(60, 240), g: 120, s: rand(5, 9), rot: rand(0, 6), vr: rand(-6, 6), col: FLAGC[i % 5], life: 2600, max: 2600 }); }
    awardStars();
  }
  function setPaused(on) {
    if (!G || G.state !== 'play') return;
    G.paused = on;
    dirs.length = 0; softSrcs.clear(); G.dasDir = 0; gest = null;
    root.querySelectorAll('.ctl .on').forEach(b => b.classList.remove('on'));
    if (on) {
      root.querySelector('.pmsg').textContent = App.g('خذي نفسًا، القلعة تنتظرك 🏰', 'خذ نفسًا، القلعة تنتظرك 🏰');
      ovPause.classList.add('on');
    } else ovPause.classList.remove('on');
  }

  /* ---------- الواجهة العلوية ---------- */
  const hudCache = {};
  function hud(force) {
    if (!G) return;
    const set = (chip, k, small, val) => {
      if (!force && hudCache[k] === small + '|' + val) return;
      const old = hudCache[k]; hudCache[k] = small + '|' + val;
      chip.querySelector('small').textContent = small; chip.querySelector('b').textContent = val;
      if (old && !force) { chip.classList.remove('bump'); void chip.offsetWidth; chip.classList.add('bump'); }
    };
    set(chipS, 's', 'النقاط', G.score);
    if (G.chal) {
      const d = G.chal.def;
      set(chipL, 'l', d.g === 'lines' ? 'الصفوف' : 'الحجارة', d.g === 'lines' ? Math.min(G.lines, d.n) + '/' + d.n : garbageLeft());
      set(chipB, 'b', 'القطع', Math.max(0, d.p - G.chal.used));
      return;
    }
    set(chipL, 'l', 'المستوى ' + G.level, G.lines + '/' + G.level * 10);
    set(chipB, 'b', 'الأفضل', Math.max(G.best, G.state === 'over' ? G.score : 0));
  }

  /* ---------- التخطيط والطبقات ---------- */
  function layout() {
    const fc = fitCanvas(cv); ctx = fc.ctx; W = fc.w; H = fc.h; DPR = fc.dpr;
    const sr = root.getBoundingClientRect(), br = bar.getBoundingClientRect(), cr = ctl.getBoundingClientRect();
    const top = br.bottom - sr.top + 6, bottom = cr.top - sr.top - 10;
    const avH = Math.max(200, bottom - top), maxW = Math.min(W, 820), pad = 10, gap = 10;
    const Pmin = W < 380 ? 50 : 56;
    const cA = Math.min((avH - 8) / 20, (maxW - 2 * pad - 2 * gap - 2 * Pmin) / 10);
    const cB = Math.min((avH - 8 - gap) / 22.7, (maxW - 2 * pad) / 10);
    let mode = 'A', c = cA;
    if (cB > cA * 1.08) { mode = 'B'; c = cB; }
    c = Math.max(10, Math.floor(Math.min(c, 46)));
    const bw = c * 10, bh = c * 20, lab = clamp(Math.round(c * .5), 11, 16);
    const bx = Math.round((W - bw) / 2);
    let by, hold, next;
    if (mode === 'B') {
      const S = Math.round(c * 2.7), tot = S + gap + bh;
      by = Math.round(top + (avH - tot) / 2 + S + gap);
      const hw = Math.round(c * 2.9), sy = by - gap - S;
      const ia = S - lab - 4;
      hold = { x: bx, y: sy, w: hw, h: S, slot: { cx: bx + hw / 2, cy: sy + lab + 2 + ia / 2, m: Math.min(hw * .8 / 4, ia * .8 / 2) } };
      const nx = bx + hw + gap, nw = bw - hw - gap, w0 = nw * .38, w1 = nw * .31;
      const m0 = Math.min(w0 * .8 / 4, ia * .82 / 2), m1 = Math.min(w1 * .78 / 4, ia * .66 / 2), cyy = sy + lab + 2 + ia / 2;
      next = { x: nx, y: sy, w: nw, h: S, horiz: true, slots: [
        { cx: nx + w0 / 2, cy: cyy, m: m0 }, { cx: nx + w0 + w1 / 2, cy: cyy, m: m1 },
        { cx: nx + w0 + w1 * 1.5, cy: cyy, m: m1 }, { cx: nx + w0 + w1 * 2.5, cy: cyy, m: m1 }] };
    } else {
      by = Math.round(top + (avH - bh) / 2);
      const P = Math.round(clamp((W - bw) / 2 - gap - pad, Pmin, c * 4.6));
      const hx = bx - gap - P, nx = bx + bw + gap;
      hold = { x: hx, y: by, w: P, h: lab + 6 + P * .72, slot: { cx: hx + P / 2, cy: by + lab + 6 + P * .36, m: P * .19 } };
      const s0 = P * .72, s1 = P * .6, y0 = by + lab + 6;
      next = { x: nx, y: by, w: P, h: lab + 6 + s0 + 2 * s1 + 4, slots: [
        { cx: nx + P / 2, cy: y0 + s0 / 2, m: P * .19 }, { cx: nx + P / 2, cy: y0 + s0 + s1 / 2, m: P * .15 },
        { cx: nx + P / 2, cy: y0 + s0 + s1 * 1.5, m: P * .15 }, { cx: nx + P / 2, cy: y0 + s0 + s1 * 2.5, m: P * .15 }] };
    }
    const gy = Math.min(H - 6, bottom + 18);
    const CW = Math.min(W * .98, Math.max(bw * 2.3, 340));
    L = { c, bx, by, bw, bh, lab, mode, hold, next, gy, cx: W / 2, u: CW / 23.5 };
    // نقوش المكعبات
    sprites = {};
    for (const t in PAL) {
      const s = document.createElement('canvas'); s.width = s.height = Math.ceil(c * DPR);
      const g = s.getContext('2d'); g.scale(DPR, DPR); drawBlock(g, 0, 0, c, PAL[t]); sprites[t] = s;
    }
    whiteSpr = document.createElement('canvas'); whiteSpr.width = whiteSpr.height = Math.ceil(c * DPR);
    { const g = whiteSpr.getContext('2d'); g.scale(DPR, DPR); g.fillStyle = '#fff'; g.beginPath(); g.roundRect(1, 1, c - 2, c - 2, c * .24); g.fill(); }
    paintBg(); paintBoard();
    if (!clouds.length) for (let i = 0; i < 6; i++) clouds.push({ x: Math.random(), y: rand(.06, .42), s: rand(.7, 1.3), v: rand(.004, .012) });
  }
  function paintBg() {
    bgC.width = Math.ceil(W * DPR); bgC.height = Math.ceil(H * DPR);
    const g = bgC.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, 0, 0);
    const sk = g.createLinearGradient(0, 0, 0, H);
    sk.addColorStop(0, '#9CC3FF'); sk.addColorStop(.38, '#C9C4FF'); sk.addColorStop(.7, '#F6CDEB'); sk.addColorStop(1, '#FFE3D4');
    g.fillStyle = sk; g.fillRect(0, 0, W, H);
    const R = Math.max(W, H) * .45, sx = W * .84, sy = H * .14;
    const sun = g.createRadialGradient(sx, sy, 0, sx, sy, R);
    sun.addColorStop(0, 'rgba(255,252,220,.95)'); sun.addColorStop(.12, 'rgba(255,245,200,.7)'); sun.addColorStop(1, 'rgba(255,240,220,0)');
    g.fillStyle = sun; g.fillRect(0, 0, W, H);
    // نجيمات
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 46; i++) {
      const x = rnd() * W, y = rnd() * H * .6, r = rnd() * 1.6 + .5;
      g.fillStyle = `rgba(255,255,255,${.35 + rnd() * .5})`; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    }
    // تلال بعيدة
    const gy = L.gy;
    const hill = (amp, base, col, ph, f) => {
      g.fillStyle = col; g.beginPath(); g.moveTo(0, H);
      for (let x = 0; x <= W + 10; x += 10) g.lineTo(x, base - amp * (.6 + .4 * Math.sin(x * f + ph)));
      g.lineTo(W, H); g.closePath(); g.fill();
    };
    hill(H * .1, gy - H * .06, 'rgba(196,178,255,.55)', 1, .006);
    hill(H * .07, gy - H * .015, 'rgba(176,226,214,.85)', 3, .009);
    const gr = g.createLinearGradient(0, gy, 0, H);
    gr.addColorStop(0, '#A9E6BE'); gr.addColorStop(1, '#86D3A3');
    g.fillStyle = gr; g.beginPath(); g.moveTo(0, gy + 4);
    for (let x = 0; x <= W + 10; x += 12) g.lineTo(x, gy + 3 * Math.sin(x * .05));
    g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill();
    // زهور صغيرة
    for (let i = 0; i < W / 26; i++) {
      const x = rnd() * W, y = gy + 8 + rnd() * (H - gy - 8);
      g.fillStyle = FLAGC[i % 5]; g.globalAlpha = .7; g.beginPath(); g.arc(x, y, 2.2, 0, 7); g.fill(); g.globalAlpha = 1;
    }
  }
  function glassBox(g, x, y, w, h, r, a) {
    g.save();
    g.shadowColor = 'rgba(100,60,170,.28)'; g.shadowBlur = 22; g.shadowOffsetY = 8;
    g.fillStyle = `rgba(252,248,255,${a})`; g.beginPath(); g.roundRect(x, y, w, h, r); g.fill();
    g.restore();
    g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,.95)'; g.beginPath(); g.roundRect(x, y, w, h, r); g.stroke();
    g.lineWidth = 1.5; g.strokeStyle = 'rgba(170,140,220,.55)'; g.beginPath(); g.roundRect(x + 2.5, y + 2.5, w - 5, h - 5, r - 2); g.stroke();
  }
  function paintBoard() {
    boardC.width = Math.ceil(W * DPR); boardC.height = Math.ceil(H * DPR);
    const g = boardC.getContext('2d'); g.setTransform(DPR, 0, 0, DPR, 0, 0);
    const { c, bx, by, bw, bh } = L, p = 6;
    glassBox(g, bx - p, by - p, bw + 2 * p, bh + 2 * p, 16, .58);
    // شبكة
    g.strokeStyle = 'rgba(150,120,210,.14)'; g.lineWidth = 1; g.beginPath();
    for (let x = 1; x < COLS; x++) { g.moveTo(bx + x * c + .5, by + 2); g.lineTo(bx + x * c + .5, by + bh - 2); }
    for (let y = 1; y < 20; y++) { g.moveTo(bx + 2, by + y * c + .5); g.lineTo(bx + bw - 2, by + y * c + .5); }
    g.stroke();
    for (const [b, t] of [[L.hold, 'احفظ'], [L.next, 'التالي']]) {
      glassBox(g, b.x, b.y, b.w, b.h, 14, .72);
      g.fillStyle = '#8A5FC8'; g.font = `800 ${L.lab}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'top';
      g.fillText(t, b.horiz ? b.x + b.w * .19 : b.x + b.w / 2, b.y + 4);
    }
  }

  /* ---------- الحلقة ---------- */
  function loop(t) {
    raf = requestAnimationFrame(loop);
    let dt = t - last; last = t;
    if (dt > 50) dt = 50; if (dt < 0) dt = 0;
    if (document.hidden) return;
    time += dt;
    if (G && !G.paused && !sheetPaused) step(dt);
    fx(dt);
    render();
  }
  const gravMs = lv => Math.max(55, 850 * Math.pow(.82, lv - 1));
  function step(dt) {
    if (G.state !== 'play') return;
    if (G.clearing) {
      G.clearing.t += dt;
      if (!G.clearing.burst && G.clearing.t >= CLEAR_FLASH) { G.clearing.burst = true; burstRows(G.clearing.rows); }
      if (G.clearing.t >= CLEAR_DUR) finishClear();
      return;
    }
    if (!G.cur) return;
    // DAS / ARR
    if (G.dasDir) {
      G.dasT += dt;
      let guard = 0;
      while (G.dasT >= 0 && guard++ < 12) {
        if (!tryMove(G.dasDir, 0, true)) { G.dasT = 0; break; }
        Sound.tone(540, .025, 'triangle', .035);
        G.dasT -= G.dasArr;
      }
    }
    // إنزال ناعم
    if (softSrcs.size) {
      G.softT += dt;
      while (G.softT >= SOFT_MS) {
        G.softT -= SOFT_MS;
        if (tryMove(0, 1, false)) G.score += 1; else { G.softT = 0; break; }
      }
      G.grav = 0;
    } else {
      G.grav += dt;
      const gm = gravMs(G.level);
      while (G.grav >= gm) { G.grav -= gm; if (!tryMove(0, 1, false)) { G.grav = 0; break; } }
    }
    if (!G.cur) return;
    if (grounded()) {
      G.lockT += dt;
      if (G.lockT >= LOCK_MS) { lock(false); return; }
    } else G.lockT = 0;
    hud();
  }
  function fx(dt) {
    const s = dt / 1000;
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.life -= dt;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      if (p.k !== 'trail') { p.vy += (p.g || 0) * s; p.x += p.vx * s; p.y += p.vy * s; if (p.vr) p.rot += p.vr * s; }
    }
    for (let i = banners.length - 1; i >= 0; i--) { banners[i].t += dt; if (banners[i].t >= banners[i].dur) banners.splice(i, 1); }
    for (const c of clouds) { c.x += c.v * s; if (c.x > 1.25) c.x = -.25; }
    for (let k = 1; k <= castleStage; k++) if (castleProg[k] < 1) castleProg[k] = Math.min(1, castleProg[k] + dt / 1000);
    if (castleStage >= 11) {
      fireT -= dt;
      if (fireT <= 0) {
        fireT = rand(1400, 2600);
        const x = L.cx + rand(-9, 9) * L.u, y = L.gy - rand(15, 21) * L.u, col = FLAGC[Math.floor(rand(0, 5))];
        for (let i = 0; i < 26; i++) { const a = i / 26 * 6.283, v = rand(70, 130); parts.push({ k: 'dot', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, g: 60, s: 2.4, col, life: 900, max: 900 }); }
      }
    }
    if (!G) return;
    G.shake *= Math.exp(-dt / 90); if (G.shake < .1) G.shake = 0;
    G.bounce *= Math.exp(-dt / 110); if (G.bounce < .02) G.bounce = 0;
    G.rotFx = Math.max(0, G.rotFx - dt / 120);
    G.holdFx = Math.max(0, G.holdFx - dt / 350);
    G.qShift = Math.max(0, G.qShift - dt / 160);
    for (let i = G.landFx.length - 1; i >= 0; i--) { G.landFx[i].t += dt; if (G.landFx[i].t > 220) G.landFx.splice(i, 1); }
    if (G.fall) { G.fall.t += dt; if (G.fall.t >= G.fall.dur) G.fall = null; }
    if (G.cur) {
      const k = 1 - Math.exp(-dt / 32);
      G.cur.vx += (G.cur.x - G.cur.vx) * k; G.cur.vy += (G.cur.y - G.cur.vy) * k;
      if (Math.abs(G.cur.y - G.cur.vy) > 2.5) G.cur.vy = G.cur.y - 2.5 * Math.sign(G.cur.y - G.cur.vy);
    }
    if (G.state === 'over' && !G.paused && !sheetPaused) {
      G.overT += dt;
      if (G.overT > 1100 && !G.overShown) showOver();
    }
  }

  /* ---------- الرسم ---------- */
  function drawPieceMini(t, cx, cy, m, gray) {
    const b = BOUNDS[t], spr = sprites[gray ? 'X' : t];
    const ox = cx - (b.x0 + b.x1 + 1) / 2 * m, oy = cy - (b.y0 + b.y1 + 1) / 2 * m;
    for (const [x, y] of CELLS[t][0]) ctx.drawImage(spr, ox + x * m, oy + y * m, m, m);
  }
  function render() {
    if (!ctx || !L) return;
    const c = L.c, g = ctx;
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
    g.drawImage(bgC, 0, 0, W, H);
    // غيوم
    for (const cl of clouds) {
      const x = cl.x * W, y = cl.y * H, r = 22 * cl.s * Math.max(1, W / 700);
      g.fillStyle = 'rgba(255,255,255,.82)'; g.beginPath();
      g.arc(x, y, r, 0, 7); g.arc(x + r * 1.1, y + r * .25, r * .8, 0, 7); g.arc(x - r * 1.05, y + r * .3, r * .7, 0, 7); g.arc(x + r * .2, y - r * .5, r * .75, 0, 7);
      g.fill();
      g.fillStyle = 'rgba(220,210,255,.35)'; g.beginPath(); g.ellipse(x, y + r * .7, r * 1.7, r * .25, 0, 0, 7); g.fill();
    }
    drawCastle(g, L.cx, L.gy, L.u, castleStage, castleProg, time);
    if (!G) return;
    const sx = G.shake ? rand(-G.shake, G.shake) : 0, sy = (G.shake ? rand(-G.shake, G.shake) : 0) + Math.sin((1 - G.bounce) * Math.PI * 3) * G.bounce * 3;
    g.save(); g.translate(sx, sy);
    g.drawImage(boardC, 0, 0, W, H);
    const { bx, by, bw, bh } = L;
    // تحذير الخطر
    let danger = false;
    for (let y = HID; y < HID + 4; y++) if (G.board[y].some(v => v)) danger = true;
    if (danger && G.state === 'play') {
      const dg = g.createLinearGradient(0, by, 0, by + c * 6);
      dg.addColorStop(0, `rgba(255,80,120,${.22 + .1 * Math.sin(time / 180)})`); dg.addColorStop(1, 'rgba(255,80,120,0)');
      g.fillStyle = dg; g.fillRect(bx, by, bw, c * 6);
    }
    // شريط تقدّم المستوى
    const pr = G.chal ? (G.chal.def.g === 'lines' ? Math.min(1, G.lines / G.chal.def.n) : 1 - garbageLeft() / Math.max(1, G.chal.total)) : (G.lines % 10) / 10;
    g.fillStyle = 'rgba(180,150,230,.35)'; g.beginPath(); g.roundRect(bx + 4, by + bh + 1.5, bw - 8, 3.5, 2); g.fill();
    if (pr > 0) { const pg = g.createLinearGradient(bx, 0, bx + bw, 0); pg.addColorStop(0, '#FF8DC0'); pg.addColorStop(1, '#FFD23F'); g.fillStyle = pg; g.beginPath(); g.roundRect(bx + 4, by + bh + 1.5, (bw - 8) * pr, 3.5, 2); g.fill(); }

    g.save(); g.beginPath(); g.rect(bx, by, bw, bh); g.clip();
    // المكعبات الثابتة
    const clr = G.clearing, fall = G.fall, fe = fall ? easeOutCubic(fall.t / fall.dur) : 1;
    const overRows = G.state === 'over' && !G.won ? G.overT / 40 : -1;
    for (let y = HID; y < ROWS; y++) {
      const row = G.board[y]; if (!row.some(v => v)) continue;
      const off = fall ? fall.drop[y] * (1 - fe) : 0;
      const yy = by + (y - HID - off) * c;
      const isClr = clr && clr.rows.includes(y);
      const gray = overRows >= 0 && (ROWS - 1 - y) < overRows;
      for (let x = 0; x < COLS; x++) {
        const t = row[x]; if (!t) continue;
        const px = bx + x * c;
        if (isClr) {
          if (clr.t < CLEAR_FLASH) {
            g.drawImage(sprites[t], px, yy, c, c);
            g.globalAlpha = .55 + .45 * Math.sin(clr.t / CLEAR_FLASH * Math.PI);
            g.drawImage(whiteSpr, px, yy, c, c); g.globalAlpha = 1;
          } else {
            const p = (clr.t - CLEAR_FLASH) / (CLEAR_DUR - CLEAR_FLASH), s = c * Math.max(0, 1 - p);
            g.globalAlpha = 1 - p; g.drawImage(whiteSpr, px + (c - s) / 2, yy + (c - s) / 2, s, s); g.globalAlpha = 1;
          }
        } else g.drawImage(sprites[gray ? 'X' : t], px, yy, c, c);
      }
    }
    // وميض الهبوط
    for (const f of G.landFx) {
      if (f.y < HID) continue;
      g.globalAlpha = .6 * (1 - f.t / 220); g.drawImage(whiteSpr, bx + f.x * c, by + (f.y - HID) * c, c, c);
    }
    g.globalAlpha = 1;
    // الشبح والقطعة الحالية
    const cur = G.cur;
    if (cur && G.state === 'play') {
      let gy = cur.y; while (fits(cur.t, cur.r, cur.x, gy + 1)) gy++;
      const pal = PAL[cur.t];
      g.lineWidth = 2; g.setLineDash([]);
      for (const [x, y] of CELLS[cur.t][cur.r]) {
        const px = bx + (cur.vx + x) * c, py = by + (gy + y - HID) * c;
        g.fillStyle = hexA(pal.b, .2); g.strokeStyle = hexA(pal.d, .55);
        g.beginPath(); g.roundRect(px + 2.5, py + 2.5, c - 5, c - 5, c * .22); g.fill(); g.stroke();
      }
      const sc = 1 - .1 * Math.sin(G.rotFx * Math.PI);
      const pcx = bx + (cur.vx + (cur.t === 'I' ? 2 : cur.t === 'O' ? 1 : 1.5)) * c, pcy = by + (cur.vy + (cur.t === 'I' ? 2 : cur.t === 'O' ? 1 : 1.5) - HID) * c;
      g.save(); g.translate(pcx, pcy); g.scale(sc, sc); g.translate(-pcx, -pcy);
      // توهّج تأخير القفل
      const lockP = G.lockT / LOCK_MS;
      for (const [x, y] of CELLS[cur.t][cur.r]) {
        const px = bx + (cur.vx + x) * c, py = by + (cur.vy + y - HID) * c;
        g.drawImage(sprites[cur.t], px, py, c, c);
        if (lockP > 0) { g.globalAlpha = lockP * .45; g.drawImage(whiteSpr, px, py, c, c); g.globalAlpha = 1; }
      }
      g.restore();
    }
    g.restore();

    // الحفظ
    const hs = L.hold.slot;
    if (G.holdFx) { g.fillStyle = `rgba(255,230,120,${G.holdFx * .55})`; g.beginPath(); g.roundRect(L.hold.x + 3, L.hold.y + 3, L.hold.w - 6, L.hold.h - 6, 12); g.fill(); }
    if (G.hold) {
      const sc = 1 + .25 * G.holdFx;
      drawPieceMini(G.hold, hs.cx, hs.cy, hs.m * sc, !G.canHold);
    }
    // التالي
    const nb = L.next;
    g.save(); g.beginPath(); g.roundRect(nb.x + 2, nb.y + L.lab + 2, nb.w - 4, nb.h - L.lab - 4, 12); g.clip();
    const S = nb.slots;
    for (let i = 0; i < 3; i++) {
      const f = i + G.qShift, a = Math.min(3, Math.floor(f)), b = Math.min(3, a + 1), tt = f - a;
      const cx = S[a].cx + (S[b].cx - S[a].cx) * tt, cy = S[a].cy + (S[b].cy - S[a].cy) * tt, m = S[a].m + (S[b].m - S[a].m) * tt;
      if (G.queue[i]) drawPieceMini(G.queue[i], cx, cy, m);
    }
    g.restore();

    // الجسيمات
    for (const p of parts) {
      const a = Math.min(1, p.life / p.max * 1.6);
      g.globalAlpha = a;
      if (p.k === 'trail') {
        const lg = g.createLinearGradient(0, p.y0, 0, p.y1);
        lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(1, hexA(p.col, .55));
        g.fillStyle = lg; g.fillRect(p.x - p.w / 2, p.y0, p.w, p.y1 - p.y0);
      } else if (p.k === 'rect') {
        g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.col; g.fillRect(-p.s / 2, -p.s * .3, p.s, p.s * .6); g.restore();
      } else if (p.k === 'dot') {
        g.fillStyle = p.col; g.beginPath(); g.arc(p.x, p.y, p.s, 0, 7); g.fill();
        if (p.s > 3) { g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.arc(p.x - p.s * .3, p.y - p.s * .3, p.s * .3, 0, 7); g.fill(); }
      } else if (p.k === 'star') {
        g.save(); g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.col; g.beginPath();
        for (let i = 0; i < 10; i++) { const r = i % 2 ? p.s * .45 : p.s, an = i * Math.PI / 5 - Math.PI / 2; g.lineTo(Math.cos(an) * r, Math.sin(an) * r); }
        g.closePath(); g.fill(); g.restore();
      } else if (p.k === 'spark') {
        const r = p.s * (1 - p.life / p.max) + 2;
        const sg = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        sg.addColorStop(0, 'rgba(255,255,255,.95)'); sg.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = sg; g.fillRect(p.x - r, p.y - r, r * 2, r * 2);
      }
    }
    g.globalAlpha = 1;

    // اللافتات
    for (const b of banners) {
      const p = b.t / b.dur;
      if (b.kind === 'float') {
        g.globalAlpha = p > .6 ? (1 - p) / .4 : 1;
        g.font = `900 ${b.size}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.lineWidth = 5; g.strokeStyle = '#fff'; g.lineJoin = 'round';
        const yy = b.y - p * c * 2;
        g.strokeText(b.text, b.x, yy); g.fillStyle = '#9B5CF5'; g.fillText(b.text, b.x, yy);
        g.globalAlpha = 1; continue;
      }
      const sc = p < .18 ? easeOutBack(p / .18) : 1, al = p > .8 ? (1 - p) / .2 : 1;
      const x = bx + bw / 2, y = b.y || by + c * 6.5;
      g.save(); g.globalAlpha = Math.max(0, al); g.translate(x, y); g.scale(sc, sc); g.rotate(-.04 + .04 * Math.sin(time / 200));
      g.font = `900 ${b.size}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle';
      const fg = g.createLinearGradient(0, -b.size / 2, 0, b.size / 2); fg.addColorStop(0, b.col[0]); fg.addColorStop(1, b.col[1]);
      g.lineJoin = 'round';
      g.lineWidth = b.size * .22; g.strokeStyle = 'rgba(90,40,140,.35)'; g.strokeText(b.text, 0, b.size * .06);
      g.lineWidth = b.size * .16; g.strokeStyle = '#fff'; g.strokeText(b.text, 0, 0);
      g.fillStyle = fg; g.fillText(b.text, 0, 0);
      if (b.sub) {
        const fs = Math.max(14, b.size * .36);
        g.font = `800 ${fs}px ${FONT}`; g.lineWidth = 5; g.strokeStyle = '#fff'; g.strokeText(b.sub, 0, b.size * .78);
        g.fillStyle = '#7A4FC0'; g.fillText(b.sub, 0, b.size * .78);
      }
      g.restore();
    }
    g.restore();
  }

  /* ---------- الإدخال ---------- */
  function pressDir(dir, src, das, arr) {
    if (dirs.some(d => d.src === src)) return;
    dirs.push({ src, dir, das, arr });
    if (!canAct()) return;
    G.dasDir = dir; G.dasT = -das; G.dasArr = arr;
    move(dir);
  }
  function releaseDir(src) {
    const i = dirs.findIndex(d => d.src === src); if (i < 0) return;
    dirs.splice(i, 1);
    if (!G) return;
    const t = dirs[dirs.length - 1];
    if (t) { G.dasDir = t.dir; G.dasT = -t.das; G.dasArr = t.arr; } else G.dasDir = 0;
  }
  function softOn(src) { if (!canAct()) return; if (!softSrcs.size) G.softT = SOFT_MS; softSrcs.add(src); }
  function softOff(src) { softSrcs.delete(src); }
  function togglePause() { if (!G || G.state !== 'play') return; Sound.tap(); setPaused(!G.paused); }

  ctl.querySelectorAll('button').forEach(b => {
    const k = b.dataset.k;
    b.addEventListener('pointerdown', e => {
      e.preventDefault();
      try { b.setPointerCapture(e.pointerId); } catch (er) {}
      b.classList.add('on');
      if (k === 'L') pressDir(-1, 'bL', BTN_DAS, BTN_ARR);
      else if (k === 'R') pressDir(1, 'bR', BTN_DAS, BTN_ARR);
      else if (k === 'rot') rotate(1);
      else if (k === 'soft') softOn('b');
      else if (k === 'hard') hardDrop();
      else if (k === 'hold') doHold();
    });
    const up = () => {
      b.classList.remove('on');
      if (k === 'L') releaseDir('bL'); else if (k === 'R') releaseDir('bR'); else if (k === 'soft') softOff('b');
    };
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up); b.addEventListener('lostpointercapture', up);
    b.addEventListener('contextmenu', e => e.preventDefault());
  });

  // إيماءات اللوحة
  const inBox = (b, x, y, m) => x >= b.x - m && x <= b.x + b.w + m && y >= b.y - m && y <= b.y + b.h + m;
  cv.addEventListener('pointerdown', e => {
    if (!G || !L) return;
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (inBox(L.hold, x, y, 6)) { doHold(); return; }
    if (!canAct()) return;
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    gest = { id: e.pointerId, x0: x, y0: y, ax: x, ay: y, t0: performance.now(), mode: null, hist: [{ x, y, t: performance.now() }], moved: false };
  });
  cv.addEventListener('pointermove', e => {
    if (!gest || e.pointerId !== gest.id) return;
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, now = performance.now();
    gest.hist.push({ x, y, t: now }); while (gest.hist.length > 2 && now - gest.hist[0].t > 120) gest.hist.shift();
    if (!canAct()) return;
    const dx = x - gest.x0, dy = y - gest.y0;
    if (!gest.mode && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      gest.mode = Math.abs(dx) > Math.abs(dy) ? 'h' : (dy > 0 ? 'v' : 'up');
      gest.ax = x; gest.ay = y;
    }
    const step = clamp(L.c * .9, 16, 34);
    if (gest.mode === 'h') {
      while (x - gest.ax >= step) { move(1); gest.ax += step; gest.moved = true; }
      while (gest.ax - x >= step) { move(-1); gest.ax -= step; gest.moved = true; }
    } else if (gest.mode === 'v') {
      while (y - gest.ay >= step) { if (G.cur && tryMove(0, 1, false)) { G.score += 1; G.grav = 0; } gest.ay += step; }
    }
  });
  const gestEnd = e => {
    if (!gest || e.pointerId !== gest.id) return;
    const g0 = gest; gest = null;
    if (!canAct()) return;
    const now = performance.now(), dt = now - g0.t0;
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (e.type === 'pointercancel') return;
    if (!g0.mode && dt < 350) { rotate(1); return; }
    if (g0.mode === 'v') {
      const h = g0.hist[0], vt = Math.max(1, now - h.t), vy = (y - h.y) / vt;
      if (vy > .75 && y - g0.y0 > 40 && dt < 600) hardDrop();
    }
  };
  cv.addEventListener('pointerup', gestEnd); cv.addEventListener('pointercancel', gestEnd);

  // لوحة المفاتيح
  window.addEventListener('keydown', e => {
    if (App.current !== ID || !G || $('#sheetWrap').classList.contains('on')) return;
    const k = e.code;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(k)) e.preventDefault();
    if (G.state === 'over') {
      if ((k === 'Enter' || k === 'Space') && G.overShown && !e.repeat && !ovChal.classList.contains('on')) newGame(G.chal ? (G.won ? Math.min(CHAL.length, G.chal.n + 1) : G.chal.n) : undefined);
      return;
    }
    if (k === 'KeyP' || k === 'Escape') { if (!e.repeat) togglePause(); return; }
    if (G.paused) { if ((k === 'Enter' || k === 'Space') && !e.repeat) { Sound.tap(); setPaused(false); } return; }
    if (e.repeat) return;
    if (k === 'ArrowLeft') pressDir(-1, 'kL', DAS, ARR);
    else if (k === 'ArrowRight') pressDir(1, 'kR', DAS, ARR);
    else if (k === 'ArrowDown') softOn('k');
    else if (k === 'ArrowUp' || k === 'KeyX') rotate(1);
    else if (k === 'KeyZ') rotate(-1);
    else if (k === 'Space') hardDrop();
    else if (k === 'KeyC' || k === 'ShiftLeft' || k === 'ShiftRight') doHold();
  });
  window.addEventListener('keyup', e => {
    const k = e.code;
    if (k === 'ArrowLeft') releaseDir('kL'); else if (k === 'ArrowRight') releaseDir('kR'); else if (k === 'ArrowDown') softOff('k');
  });
  window.addEventListener('blur', () => { dirs.length = 0; softSrcs.clear(); if (G) G.dasDir = 0; });

  root.querySelector('.pausebtn').addEventListener('click', togglePause);
  root.querySelector('.b-resume').addEventListener('click', () => { Sound.tap(); setPaused(false); });
  root.querySelector('.b-restart').addEventListener('click', () => { Sound.tap(); newGame(G && G.chal ? G.chal.n : undefined); });
  window.addEventListener('resize', () => { if (App.current === ID && running) layout(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && App.current === ID && G && G.state === 'play' && !G.paused) setPaused(true); });
  if (document.fonts) document.fonts.ready.then(() => { if (App.current === ID && running) layout(); });

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'قلعة المكعبات', icon2: '🧱', isNew: false,
    desc: () => App.g('رتّبي المكعبات وابني القلعة', 'رتّب المكعبات وابنِ القلعة'),
    music: 'blocks',
    help: () => [
      `🧱 ${App.g('رتّبي', 'رتّب')} المكعبات النازلة ${App.g('لتُكملي', 'لتُكمل')} صفًّا كاملًا فيختفي!`,
      `👆 ${App.g('المسي', 'المس')} اللوحة للتدوير، ${App.g('واسحبي', 'واسحب')} يمينًا ويسارًا للتحريك.`,
      `⬇️ ${App.g('اسحبي', 'اسحب')} للأسفل ببطء للإنزال، أو بسرعة لإسقاط القطعة فورًا ⏬`,
      `📦 زر «احفظ» يخبّئ القطعة لوقت لاحق، والأزرار في الأسفل تفعل كل شيء.`,
      `🏰 كل 10 صفوف = مستوى جديد وطابق جديد للقلعة، و4 صفوف معًا = رباعية! 💥`,
      `🎯 زر التحديات: ${App.g('أزيلي', 'أزِل')} الحجارة أو ${App.g('أكملي', 'أكمل')} الصفوف بعدد محدود من القطع واربح النجوم ⭐`
    ],
    icon(g, s) {
      const c = g;
      IK.bg(c, s, ['#E9DCFF', '#A98BFF', '#6C4EE6'], { seed: 6 });
      IK.cloud(c, s * .04, s * .3, s * .3);
      IK.ground(c, s, s * .8, '#9BE08C', '#4FAE55');
      const b = s * .14;
      const piece = (c, t, r, x, y) => { for (const [cx, cy] of CELLS[t][r]) drawBlock(c, x + cx * b, y + cy * b, b, PAL[t]); };
      IK.sticker(c, s, c => {
        drawCastle(c, s * .5, s * .86, s / 33, 8, Array(12).fill(1), 0);
        piece(c, 'T', 0, s * .1, s * .08);
        piece(c, 'L', 1, s * .55, s * .07);
        piece(c, 'O', 0, s * .64, s * .56);
      });
    },
    best() { const b = store.get('blocksBest', 0); return b ? '🏆 أفضل نتيجة: ' + b : ''; },
    enter() {
      running = true; sheetPaused = false;
      layout();
      if (!G || G.state === 'over') newGame();
      else { G.best = best(); hud(true); if (G.state === 'play') setPaused(true); }
      last = performance.now();
      cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
    },
    leave() {
      running = false; cancelAnimationFrame(raf); raf = 0;
      dirs.length = 0; softSrcs.clear(); gest = null;
      if (G) { G.dasDir = 0; if (G.state === 'over' && !G.chal) awardStars(); }
      root.querySelectorAll('.ctl .on').forEach(b => b.classList.remove('on'));
    },
    pause() { sheetPaused = true; dirs.length = 0; softSrcs.clear(); gest = null; if (G) G.dasDir = 0; },
    resume() { sheetPaused = false; last = performance.now(); },
    /* للاختبار الآلي فقط */
    _dbg: { g: () => G, chal: n => startChal(n), open: () => openChal(), drop: () => hardDrop() },
    back() {
      if (ovChal.classList.contains('on')) { closeChal(); return true; }
      if (G && G.state === 'play' && !G.paused) { setPaused(true); return true; }
      return false;
    }
  });
})();
