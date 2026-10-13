/* =====================================================================
   3) إكس أو — طباشير على السبورة
   ثلاثة مستويات للذكاء، تراجع، لوحة 3×3 و4×4 وإكس أو الخارقة،
   رموز بديلة من المتجر، وسلسلة «الأفضل من 5».
   ===================================================================== */
(() => {
  App.css(`
  #chalk{background:#5b3a1e}
  #chalk canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
  #chalk .ib{background:rgba(255,255,255,.12);color:#f4f1e6;box-shadow:0 0 0 2px rgba(255,255,255,.35) inset;filter:url(#rough)}
  #chalk .cmodes{position:absolute;left:0;right:0;bottom:max(40px,calc(env(safe-area-inset-bottom) + 28px));display:flex;justify-content:center;gap:8px;z-index:5;flex-wrap:wrap;padding:0 18px}
  #chalk .cbtn{background:transparent;color:#f4f1e6;font-size:15px;font-weight:700;padding:5px 12px;border-radius:14px;border:2.5px solid rgba(244,241,230,.55);filter:url(#rough);white-space:nowrap}
  #chalk .cbtn.on{border-color:#FFE680;color:#FFE680;background:rgba(255,230,128,.08)}
  #chalk .cbtn[disabled]{opacity:.35}
  #chalk .overlay{background:rgba(10,25,15,.55)}
  #chalk .cpanel{background:#2C4A38;border:5px solid #8A5A2B;border-radius:20px;padding:16px 14px;width:min(94vw,420px);color:#f4f1e6;box-shadow:0 14px 40px rgba(0,0,0,.5);animation:pop .3s cubic-bezier(.3,1.6,.6,1);max-height:90vh;overflow-y:auto;touch-action:pan-y}
  #chalk .cpanel h3{margin:0 0 8px;text-align:center;font-size:24px;color:#FFE680;filter:url(#rough)}
  #chalk .crow{margin:8px 0}
  #chalk .crow b{display:block;font-size:15px;opacity:.85;margin-bottom:4px}
  #chalk .crow div{display:flex;flex-wrap:wrap;gap:6px}
  #chalk .cgo{display:block;margin:12px auto 0;font-size:19px;padding:8px 30px;border-color:#FFE680;color:#FFE680}
  `);
  const root = App.section('chalk', `
    <canvas id="tc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <span class="grow"></span>
      <button class="ib" id="tUndo" aria-label="تراجع">↶</button>
      <button class="ib" id="tReset" aria-label="جولة جديدة">🧽</button>
      <button class="ib" id="tSetup" aria-label="إعداد اللعبة">⚙️</button>
    </div>
    <div class="cmodes" id="tSummary"></div>
    <div class="overlay" id="tSetupO"><div class="cpanel">
      <h3>✏️ إعداد اللعبة</h3>
      <div class="crow"><b>اللاعبون</b><div data-k="mode"></div></div>
      <div class="crow" id="rowLevel"><b>مستوى الذكاء</b><div data-k="level"></div></div>
      <div class="crow"><b>اللوحة</b><div data-k="variant"></div></div>
      <div class="crow" id="rowFirst"><b>من يبدأ؟</b><div data-k="first"></div></div>
      <div class="crow"><b>نوع المباراة</b><div data-k="series"></div></div>
      <button class="cbtn cgo" id="tGo">ابدأ ✏️</button>
    </div></div>`);

  const cv = root.querySelector('#tc');
  let ctx, W, H, dpr;
  let cfg = { mode: 'ai', level: 'hard', variant: '3', first: 'me', series: 'one' };
  let cells, subs, nextB, turn, over, winLine, thinking, hist, aiTimer = null;
  let strokes = [], dust = [], raf = 0, last = 0, message = '', msgAnim = 0, paused = false;
  let scores, pvp = { A: 0, B: 0, d: 0 }, series = { A: 0, B: 0 }, seriesDone = false;
  let G = { x: 0, y: 0, s: 0 }, boardTex = null, erasing = 0, roundToken = 0;
  const CHALK = '#F4F1E6', COL = { A: '#FFE680', B: '#FFB3D4' };
  const SETS = { xo_classic: ['X', 'O'], xo_hearts: ['heart', 'star'], xo_sun: ['sun', 'moon'], xo_pets: ['cat', 'bunny'] };
  const SYMNAME = { X: 'X', O: 'O', heart: 'القلب', star: 'النجمة', sun: 'الشمس', moon: 'القمر', cat: 'القطة', bunny: 'الأرنب' };
  let sym = SETS.xo_classic;

  const L3 = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const L4 = (() => { const L = []; for (let i = 0; i < 4; i++) { L.push([0, 1, 2, 3].map(j => i * 4 + j)); L.push([0, 1, 2, 3].map(j => j * 4 + i)); } L.push([0, 5, 10, 15], [3, 6, 9, 12]); return L; })();
  const isU = () => cfg.variant === 'u';
  const N = () => cfg.variant === '4' ? 4 : 3;
  const LINES = () => cfg.variant === '4' ? L4 : L3;
  const other = p => p === 'A' ? 'B' : 'A';
  const human = () => cfg.first === 'me' ? 'A' : 'B';
  const aiP = () => other(human());
  const pname = p => SYMNAME[sym[p === 'A' ? 0 : 1]];

  /* =================== المنطق =================== */
  function lineWinner(b, lines) {
    for (const l of lines) { const v = b[l[0]]; if (v && v !== 'D' && l.every(i => b[i] === v)) return { p: v, line: l }; }
    return null;
  }
  function winnerSimple(b) { const w = lineWinner(b, LINES()); if (w) return w; return b.every(Boolean) ? { p: 'draw' } : null; }
  function subWinner(c, B) { const s = c.slice(B * 9, B * 9 + 9); const w = lineWinner(s, L3); if (w) return w.p; return s.every(Boolean) ? 'D' : null; }
  function winnerU(st) {
    const w = lineWinner(st.subs, L3); if (w) return w;
    return legalU(st).length ? null : { p: 'draw' };
  }
  function legalU(st) {
    const res = [];
    const boards = st.next >= 0 && !st.subs[st.next] ? [st.next] : [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(B => !st.subs[B]);
    for (const B of boards) for (let j = 0; j < 9; j++) if (!st.cells[B * 9 + j]) res.push(B * 9 + j);
    return res;
  }
  function applyU(st, i, p) {
    const cells = st.cells.slice(); cells[i] = p;
    const subsA = st.subs.slice(), B = i / 9 | 0; subsA[B] = subWinner(cells, B);
    const j = i % 9; return { cells, subs: subsA, next: subsA[j] ? -1 : j };
  }

  /* ---------- الذكاء الاصطناعي ---------- */
  function evalLines(b, lines, ai, base) {
    let s = 0; const op = other(ai);
    for (const l of lines) {
      let a = 0, o = 0; for (const i of l) { if (b[i] === ai) a++; else if (b[i] === op) o++; else if (b[i] === 'D') { a = -9; } }
      if (a < 0) continue;
      if (a && !o) s += Math.pow(base, a); else if (o && !a) s -= Math.pow(base, o) * 1.1;
    }
    return s;
  }
  function searchSimple(b, player, ai, depth, maxD, alpha, beta) {
    const w = winnerSimple(b);
    if (w) return w.p === ai ? 1000 - depth : w.p === 'draw' ? 0 : depth - 1000;
    if (depth >= maxD) return evalLines(b, LINES(), ai, 8);
    const moves = order(b.map((v, i) => v ? -1 : i).filter(i => i >= 0));
    if (player === ai) { let best = -Infinity; for (const i of moves) { b[i] = player; best = Math.max(best, searchSimple(b, other(player), ai, depth + 1, maxD, alpha, beta)); b[i] = null; alpha = Math.max(alpha, best); if (beta <= alpha) break; } return best; }
    let best = Infinity; for (const i of moves) { b[i] = player; best = Math.min(best, searchSimple(b, other(player), ai, depth + 1, maxD, alpha, beta)); b[i] = null; beta = Math.min(beta, best); if (beta <= alpha) break; } return best;
  }
  function order(moves) { // المراكز أولًا لتسريع التقليم
    const n = N(), c = (n - 1) / 2;
    return moves.sort((a, b) => (Math.abs(a % n - c) + Math.abs((a / n | 0) - c)) - (Math.abs(b % n - c) + Math.abs((b / n | 0) - c)));
  }
  function bestSimple(b, ai, maxD) {
    let best = -Infinity, moves = [];
    for (let i = 0; i < b.length; i++) if (!b[i]) {
      b[i] = ai; const s = searchSimple(b, other(ai), ai, 1, maxD, -Infinity, Infinity); b[i] = null;
      if (s > best) { best = s; moves = [i]; } else if (s === best) moves.push(i);
    }
    return moves[Math.random() * moves.length | 0];
  }
  function immediate(b, p) { for (let i = 0; i < b.length; i++) if (!b[i]) { b[i] = p; const w = winnerSimple(b); b[i] = null; if (w && w.p === p) return i; } return -1; }
  function evalU(st, ai) {
    const op = other(ai); let s = 0;
    st.subs.forEach((w, B) => { const wt = B === 4 ? 1.5 : [0, 2, 6, 8].includes(B) ? 1.2 : 1; if (w === ai) s += 100 * wt; else if (w === op) s -= 100 * wt; else if (!w) s += evalLines(st.cells.slice(B * 9, B * 9 + 9), L3, ai, 3) * wt; });
    s += evalLines(st.subs, L3, ai, 6) * 20;
    return s;
  }
  function searchU(st, player, ai, depth, maxD, alpha, beta) {
    const w = winnerU(st);
    if (w) return w.p === ai ? 100000 - depth : w.p === 'draw' ? 0 : depth - 100000;
    const moves = legalU(st);
    if (depth >= maxD || (depth >= maxD - 1 && moves.length > 20)) return evalU(st, ai);
    if (player === ai) { let best = -Infinity; for (const i of moves) { best = Math.max(best, searchU(applyU(st, i, player), other(player), ai, depth + 1, maxD, alpha, beta)); alpha = Math.max(alpha, best); if (beta <= alpha) break; } return best; }
    let best = Infinity; for (const i of moves) { best = Math.min(best, searchU(applyU(st, i, player), other(player), ai, depth + 1, maxD, alpha, beta)); beta = Math.min(beta, best); if (beta <= alpha) break; } return best;
  }
  function chooseAI() {
    const ai = aiP(), lv = cfg.level;
    if (isU()) {
      const st = { cells, subs, next: nextB }, moves = legalU(st);
      if (lv === 'easy') { // يفضّل الفوز بلوحة صغيرة أحيانًا
        if (Math.random() < .5) for (const i of moves) { const s2 = applyU(st, i, ai); if (s2.subs[i / 9 | 0] === ai) return i; }
        return moves[Math.random() * moves.length | 0];
      }
      const maxD = lv === 'medium' ? 2 : (moves.length > 20 ? 3 : 4);
      let best = -Infinity, pick = [];
      for (const i of moves) { const s = searchU(applyU(st, i, ai), other(ai), ai, 1, maxD, -Infinity, Infinity); if (s > best) { best = s; pick = [i]; } else if (s === best) pick.push(i); }
      return pick[Math.random() * pick.length | 0];
    }
    const b = cells.slice(), empty = b.map((v, i) => v ? -1 : i).filter(i => i >= 0);
    if (lv === 'easy') { const w = immediate(b, ai); if (w >= 0 && Math.random() < .5) return w; return empty[Math.random() * empty.length | 0]; }
    if (lv === 'medium') {
      const w = immediate(b, ai); if (w >= 0) return w;
      const bl = immediate(b, other(ai)); if (bl >= 0 && Math.random() < .85) return bl;
      if (Math.random() < .5) return empty[Math.random() * empty.length | 0];
      return bestSimple(b, ai, N() === 3 ? 3 : 2);
    }
    return bestSimple(b, ai, N() === 3 ? 9 : 5);
  }

  /* =================== رسم الطباشير =================== */
  function resize() {
    ({ ctx, w: W, h: H, dpr } = fitCanvas(cv));
    const avail = H - 160 - 150;
    const s = Math.max(200, Math.min(W * (isU() ? .94 : .86), H * .6, isU() ? 520 : 460, avail));
    G = { x: (W - s) / 2, y: 160 + Math.max(0, avail - s) * .3, s };
    makeTexture(); redrawAll();
  }
  function makeTexture() {
    const t = document.createElement('canvas'); t.width = Math.round(W * dpr); t.height = Math.round(H * dpr);
    const c = t.getContext('2d'); c.scale(dpr, dpr);
    const g = c.createRadialGradient(W / 2, H / 2, 50, W / 2, H / 2, Math.max(W, H) * .75);
    g.addColorStop(0, '#355C45'); g.addColorStop(1, '#22402F'); c.fillStyle = g; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 26; i++) { c.fillStyle = `rgba(255,255,255,${rand(.012, .035)})`; c.beginPath(); c.ellipse(rand(0, W), rand(0, H), rand(40, 160), rand(14, 40), rand(-.4, .4), 0, 7); c.fill(); }
    for (let i = 0; i < W * H / 60; i++) { c.fillStyle = `rgba(${Math.random() < .5 ? '255,255,255' : '0,0,0'},${rand(.02, .06)})`; c.fillRect(rand(0, W), rand(0, H), 1, 1); }
    const fw = 12;
    c.strokeStyle = '#8A5A2B'; c.lineWidth = fw * 2; c.strokeRect(0, 0, W, H);
    c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 2; c.strokeRect(fw, fw, W - fw * 2, H - fw * 2);
    c.strokeStyle = 'rgba(255,220,170,.25)'; c.lineWidth = 1.5; c.strokeRect(2, 2, W - 4, H - 4);
    const ty = H - fw - 2;
    c.fillStyle = '#6E4520'; c.fillRect(fw, ty - 6, W - fw * 2, 8);
    c.fillStyle = '#F4F1E6'; c.beginPath(); c.roundRect(W * .18, ty - 12, 36, 7, 3); c.fill();
    c.fillStyle = '#FFB3D4'; c.beginPath(); c.roundRect(W * .18 + 44, ty - 11, 24, 6, 3); c.fill();
    c.fillStyle = '#FFE680'; c.beginPath(); c.roundRect(W * .72, ty - 12, 30, 7, 3); c.fill();
    c.fillStyle = '#6B4A8A'; c.beginPath(); c.roundRect(W * .44, ty - 18, 58, 14, 3); c.fill();
    c.fillStyle = '#ECE2D0'; c.fillRect(W * .44, ty - 8, 58, 4);
    boardTex = t;
  }
  function jitterPath(pts, amp = 1.6) {
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], d = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, d / 5 | 0);
      for (let k = 0; k < n; k++) { const t = k / n; out.push([x0 + (x1 - x0) * t + rand(-amp, amp) * .5, y0 + (y1 - y0) * t + rand(-amp, amp) * .5]); }
    }
    out.push(pts[pts.length - 1]); return out;
  }
  let instant = false;
  function addStroke(pts, color, width, speed, delay = 0, sound = true) {
    const st = { pts: jitterPath(pts, Math.min(1.6, width * .3)), color, width, prog: instant ? 1 : 0, speed, delay: instant ? 0 : delay, seed: Math.random() * 1000, len: 0 };
    for (let i = 1; i < st.pts.length; i++) st.len += Math.hypot(st.pts[i][0] - st.pts[i - 1][0], st.pts[i][1] - st.pts[i - 1][1]);
    strokes.push(st);
    if (sound && !instant) Sound.squeak(Math.min(.6, st.len / speed), delay);
    return st;
  }
  function renderStroke(c, st) {
    const n = st.pts.length, upto = Math.max(1, Math.floor(n * st.prog)); if (upto < 2) return;
    let seed = st.seed; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (let layer = 0; layer < 3; layer++) {
      c.strokeStyle = st.color; c.globalAlpha = [.55, .35, .5][layer]; c.lineWidth = st.width * [1, 1.35, .45][layer];
      c.beginPath();
      for (let i = 0; i < upto; i++) { const [x, y] = st.pts[i], ox = (rnd() - .5) * st.width * .35, oy = (rnd() - .5) * st.width * .35; if (i === 0 || rnd() < .05) c.moveTo(x + ox, y + oy); else c.lineTo(x + ox, y + oy); }
      c.stroke();
    }
    c.globalAlpha = .5; c.fillStyle = st.color;
    for (let i = 0; i < upto; i += 2) { const [x, y] = st.pts[i]; if (rnd() < .6) c.fillRect(x + (rnd() - .5) * st.width * 1.6, y + (rnd() - .5) * st.width * 1.6, 1.1, 1.1); }
    c.globalAlpha = 1;
  }

  /* ---------- الهندسة ---------- */
  function subRect(B) { const bs = G.s / 3, pad = bs * .08; return { x: G.x + (B % 3) * bs + pad, y: G.y + (B / 3 | 0) * bs + pad, s: bs - 2 * pad }; }
  function cellInfo(i) {
    if (isU()) { const r = subRect(i / 9 | 0), j = i % 9, cs = r.s / 3; return { cx: r.x + (j % 3 + .5) * cs, cy: r.y + ((j / 3 | 0) + .5) * cs, size: cs }; }
    const n = N(), cs = G.s / n; return { cx: G.x + (i % n + .5) * cs, cy: G.y + ((i / n | 0) + .5) * cs, size: cs };
  }
  function hit(x, y) {
    if (x < G.x || x > G.x + G.s || y < G.y || y > G.y + G.s) return -1;
    if (isU()) {
      const bs = G.s / 3, B = Math.floor((y - G.y) / bs) * 3 + Math.floor((x - G.x) / bs), r = subRect(B);
      const cx = Math.floor((x - r.x) / (r.s / 3)), cy = Math.floor((y - r.y) / (r.s / 3));
      if (cx < 0 || cx > 2 || cy < 0 || cy > 2) return -1;
      return B * 9 + cy * 3 + cx;
    }
    const n = N(), cs = G.s / n; return Math.floor((y - G.y) / cs) * n + Math.floor((x - G.x) / cs);
  }
  function drawGrid() {
    const { x, y, s } = G;
    if (isU()) {
      const bs = s / 3, w = Math.max(4, s / 70);
      for (let k = 1; k <= 2; k++) {
        addStroke([[x + bs * k + rand(-3, 3), y - 6], [x + bs * k + rand(-3, 3), y + s + 6]], CHALK, w, 1100, (k - 1) * .2);
        addStroke([[x - 6, y + bs * k + rand(-3, 3)], [x + s + 6, y + bs * k + rand(-3, 3)]], CHALK, w, 1100, .4 + (k - 1) * .2);
      }
      for (let B = 0; B < 9; B++) {
        const r = subRect(B), cs = r.s / 3, tw = Math.max(1.6, s / 190);
        for (let k = 1; k <= 2; k++) {
          addStroke([[r.x + cs * k, r.y], [r.x + cs * k, r.y + r.s]], 'rgba(244,241,230,.75)', tw, 1600, .8 + B * .03, false);
          addStroke([[r.x, r.y + cs * k], [r.x + r.s, r.y + cs * k]], 'rgba(244,241,230,.75)', tw, 1600, .8 + B * .03, false);
        }
      }
      return;
    }
    const n = N(), cs = s / n, w = Math.max(4, s / 70);
    for (let k = 1; k < n; k++) {
      addStroke([[x + cs * k + rand(-3, 3), y - 6], [x + cs * k + rand(-4, 4), y + s / 2], [x + cs * k + rand(-3, 3), y + s + 6]], CHALK, w, 900, (k - 1) * .22);
      addStroke([[x - 6, y + cs * k + rand(-3, 3)], [x + s / 2, y + cs * k + rand(-4, 4)], [x + s + 6, y + cs * k + rand(-3, 3)]], CHALK, w, 900, .45 + (k - 1) * .22);
    }
  }
  /* رسم رمز بالطباشير (X، O، قلب، نجمة، شمس، قمر، قطة، أرنب) */
  function symbolStrokes(kind, cx, cy, r, color, w, delay = 0, sound = true) {
    const S = (pts, d = 0, snd = sound) => addStroke(pts, color, w, 700 * Math.max(.6, r / 30), delay + d, snd);
    const circ = (x, y, rr, a0 = -1.5, turn = 2.08, sx = 1, sy = .96, n = 34) => { const p = []; for (let k = 0; k <= n; k++) { const a = a0 + k / (n - 2) * Math.PI * turn; p.push([x + Math.cos(a) * rr * sx, y + Math.sin(a) * rr * sy]); } return p; };
    switch (kind) {
      case 'X': S([[cx - r, cy - r], [cx + r, cy + r]]); S([[cx + r, cy - r], [cx - r, cy + r]], .18); break;
      case 'O': S(circ(cx, cy, r, rand(-1.8, -1.2))); break;
      case 'heart': { const p = []; for (let k = 0; k <= 40; k++) { const t = k / 40 * Math.PI * 2; p.push([cx + r * .066 * 16 * Math.pow(Math.sin(t), 3), cy - r * .066 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) - r * .1]); } S(p); break; }
      case 'star': { const p = []; for (let k = 0; k <= 10; k++) { const a = k * Math.PI / 5 - Math.PI / 2, rr = k % 2 ? r * .45 : r * 1.05; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr + r * .08]); } S(p); break; }
      case 'sun': { S(circ(cx, cy, r * .55)); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; S([[cx + Math.cos(a) * r * .75, cy + Math.sin(a) * r * .75], [cx + Math.cos(a) * r * 1.05, cy + Math.sin(a) * r * 1.05]], .15 + k * .03, k === 0); } break; }
      case 'moon': { const p = []; for (let k = 0; k <= 24; k++) { const a = -Math.PI * .62 + k / 24 * Math.PI * 1.24; p.push([cx - r * .1 + Math.cos(a + Math.PI) * r, cy + Math.sin(a + Math.PI) * r]); } for (let k = 24; k >= 0; k--) { const a = -Math.PI * .5 + k / 24 * Math.PI; p.push([cx - r * .05 + Math.cos(a + Math.PI) * r * .55 - r * .1, cy + Math.sin(a + Math.PI) * r * .8]); } p.push(p[0]); S(p); break; }
      case 'cat': { S(circ(cx, cy + r * .1, r * .78)); S([[cx - r * .7, cy - r * .2], [cx - r * .55, cy - r * .95], [cx - r * .2, cy - r * .62]], .15, false); S([[cx + r * .7, cy - r * .2], [cx + r * .55, cy - r * .95], [cx + r * .2, cy - r * .62]], .22, false);
        S([[cx - r * .25, cy], [cx - r * .2, cy + .1]], .3, false); S([[cx + r * .25, cy], [cx + r * .2, cy + .1]], .32, false);
        S([[cx - r * .1, cy + r * .3], [cx - r * 1, cy + r * .2]], .36, false); S([[cx + r * .1, cy + r * .3], [cx + r * 1, cy + r * .2]], .4, false); break; }
      case 'bunny': { S(circ(cx, cy + r * .3, r * .62)); S(circ(cx - r * .3, cy - r * .55, r * .18, 0, 2.1, 1, 2.4, 24), .15, false); S(circ(cx + r * .3, cy - r * .55, r * .18, 0, 2.1, 1, 2.4, 24), .25, false);
        S([[cx - r * .2, cy + r * .2], [cx - r * .16, cy + r * .24]], .3, false); S([[cx + r * .2, cy + r * .2], [cx + r * .16, cy + r * .24]], .32, false); S([[cx - r * .1, cy + r * .45], [cx, cy + r * .52], [cx + r * .1, cy + r * .45]], .36, false); break; }
    }
  }
  function drawMark(i, p) {
    const { cx, cy, size } = cellInfo(i), r = size * .3, w = Math.max(isU() ? 2.6 : 5, size / (isU() ? 14 : 18));
    symbolStrokes(sym[p === 'A' ? 0 : 1], cx, cy, r, COL[p], w);
    if (!instant) for (let k = 0; k < 10; k++) dust.push({ x: cx + rand(-r, r), y: cy + rand(-r, r), vx: rand(-15, 15), vy: rand(10, 50), life: rand(.6, 1.4), r: rand(.6, 1.8) });
  }
  function drawSubWin(B, p) {
    const r = subRect(B);
    if (p === 'D') { addStroke([[r.x + r.s * .2, r.y + r.s * .5], [r.x + r.s * .8, r.y + r.s * .5]], 'rgba(244,241,230,.6)', r.s / 18, 900, .2); return; }
    symbolStrokes(sym[p === 'A' ? 0 : 1], r.x + r.s / 2, r.y + r.s / 2, r.s * .36, COL[p], Math.max(5, r.s / 12), .25);
  }
  function drawWinLine(l) {
    let a, b;
    if (isU()) { const ra = subRect(l[0]), rb = subRect(l[2]); a = [ra.x + ra.s / 2, ra.y + ra.s / 2]; b = [rb.x + rb.s / 2, rb.y + rb.s / 2]; }
    else { const ia = cellInfo(l[0]), ib = cellInfo(l[l.length - 1]); a = [ia.cx, ia.cy]; b = [ib.cx, ib.cy]; }
    const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy), ex = dx / d * G.s * .12, ey = dy / d * G.s * .12;
    addStroke([[a[0] - ex, a[1] - ey], [(a[0] + b[0]) / 2 + rand(-4, 4), (a[1] + b[1]) / 2 + rand(-4, 4)], [b[0] + ex, b[1] + ey]], '#FFFFFF', Math.max(6, G.s / 40), 900, .1);
    for (let k = 0; k < 40; k++) { const t = Math.random(); dust.push({ x: a[0] + dx * t, y: a[1] + dy * t, vx: rand(-25, 25), vy: rand(10, 60), life: rand(.8, 1.8), r: rand(.8, 2) }); }
  }
  function drawTrophy() {
    const cx = W / 2, cy = G.y + G.s / 2, r = G.s * .28;
    strokes.push({ pts: [], color: '', width: 0, prog: 1, len: 0, delay: 0, seed: 0, veil: true });
    const Y = '#FFE680', w = Math.max(5, G.s / 45);
    addStroke([[cx - r * .8, cy - r * .8], [cx - r * .7, cy], [cx - r * .3, cy + r * .35], [cx + r * .3, cy + r * .35], [cx + r * .7, cy], [cx + r * .8, cy - r * .8], [cx - r * .8, cy - r * .8]], Y, w, 800, .2);
    addStroke([[cx - r * .8, cy - r * .6], [cx - r * 1.15, cy - r * .55], [cx - r * 1.1, cy - r * .15], [cx - r * .72, cy - r * .05]], Y, w * .8, 800, .6, false);
    addStroke([[cx + r * .8, cy - r * .6], [cx + r * 1.15, cy - r * .55], [cx + r * 1.1, cy - r * .15], [cx + r * .72, cy - r * .05]], Y, w * .8, 800, .75, false);
    addStroke([[cx, cy + r * .35], [cx, cy + r * .75]], Y, w, 800, .9, false);
    addStroke([[cx - r * .5, cy + r * .8], [cx + r * .5, cy + r * .8]], Y, w, 800, 1.05, false);
    symbolStrokes('star', cx, cy - r * .35, r * .25, '#FFFFFF', w * .7, 1.2, false);
    for (let k = 0; k < 60; k++) dust.push({ x: cx + rand(-r, r), y: cy + rand(-r, r), vx: rand(-40, 40), vy: rand(-60, 20), life: rand(1, 2), r: rand(.8, 2.2) });
  }

  /* =================== مجرى اللعب =================== */
  function freshState() {
    cells = Array(isU() ? 81 : N() * N()).fill(null); subs = Array(9).fill(null); nextB = -1;
    turn = 'A'; over = false; winLine = null; thinking = false; hist = [];
  }
  function redrawAll() { // يعيد رسم كل شيء فورًا (بعد التراجع أو تغيير الحجم)
    if (!cells) return;
    instant = true; strokes = []; drawGrid();
    cells.forEach((p, i) => { if (p) drawMark(i, p); });
    if (isU()) subs.forEach((w, B) => { if (w) drawSubWin(B, w); });
    if (over && winLine) drawWinLine(winLine);
    instant = false;
  }
  function newRound(withErase = true) {
    const tok = ++roundToken; clearTimeout(aiTimer);
    const go = () => {
      if (tok !== roundToken) return;
      if (seriesDone) { series = { A: 0, B: 0 }; seriesDone = false; }
      freshState(); strokes = []; drawGrid(); setMsg(statusText()); paintSummary();
      if (cfg.mode === 'ai' && aiP() === 'A') aiTurn(1100);
    };
    if (withErase && strokes.length) { erasing = 1; Sound.erase(); for (let k = 0; k < 60; k++) dust.push({ x: rand(G.x, G.x + G.s), y: rand(G.y, G.y + G.s), vx: rand(-30, 30), vy: rand(20, 80), life: rand(.5, 1.5), r: rand(.8, 2.2) }); setTimeout(go, 560); }
    else go();
  }
  function statusText() {
    const where = isU() && nextB >= 0 && !subs[nextB] ? ' — في اللوحة المضيئة' : '';
    if (cfg.mode === 'ai') return turn === human() ? `${App.g('دورك', 'دورك')} يا ${App.profile.name} (${pname(turn)})${where}` : 'الذكاء الاصطناعي يفكّر…';
    return `دور ${pname(turn)}${where}`;
  }
  function setMsg(m) { message = m; msgAnim = 0; }
  function play(i) {
    if (over || cells[i]) return false;
    if (isU() && !legalU({ cells, subs, next: nextB }).includes(i)) { Sound.error(); return false; }
    hist.push({ cells: cells.slice(), subs: subs.slice(), nextB, turn });
    cells[i] = turn; drawMark(i, turn); vibrate(10);
    if (isU()) {
      const B = i / 9 | 0, w = subWinner(cells, B);
      if (w && !subs[B]) { subs[B] = w; drawSubWin(B, w); if (w !== 'D') Sound.star(); }
      nextB = subs[i % 9] ? -1 : i % 9;
    }
    const w = isU() ? winnerU({ cells, subs, next: nextB }) : winnerSimple(cells);
    if (w) { finish(w); paintSummary(); return true; }
    turn = other(turn); setMsg(statusText()); paintSummary();
    return true;
  }
  function aiTurn(delay = 650) {
    thinking = true; setMsg(statusText()); const tok = roundToken;
    aiTimer = setTimeout(() => {
      if (over || App.current !== 'chalk' || tok !== roundToken) { thinking = false; return; }
      if (paused) { aiTurn(300); return; }
      const i = chooseAI(); thinking = false; play(i);
    }, delay);
  }
  function finish(w) {
    over = true; const tok = roundToken;
    if (w.line) { winLine = w.line; setTimeout(() => { if (over && tok === roundToken) drawWinLine(w.line); }, 450); }
    const winP = w.p === 'draw' ? null : w.p;
    if (cfg.mode === 'ai') {
      if (!winP) { scores.d++; setMsg('تعادل! 🤝'); setTimeout(() => Sound.tap(), 400); if (cfg.variant === '3' && cfg.level === 'hard') App.achieve('xo_draw'); App.addStars(1); }
      else if (winP === human()) {
        scores.w++; setMsg(App.g('فزتِ! 🎉', 'فزت! 🎉')); setTimeout(() => Sound.win(), 450);
        App.addStars(cfg.level === 'hard' ? 5 : cfg.level === 'medium' ? 3 : 1);
        if (scores.w >= 5) App.achieve('xo_win5'); if (isU()) App.achieve('xo_ultimate');
      } else { scores.l++; setMsg('فاز الذكاء الاصطناعي 🤖'); setTimeout(() => Sound.lose(), 450); }
      store.set('tttScore', scores);
    } else {
      if (!winP) { pvp.d++; setMsg('تعادل! 🤝'); Sound.tap(); }
      else { pvp[winP]++; setMsg(`فاز ${pname(winP)}! 🎉`); setTimeout(() => Sound.win(), 450); if (isU()) App.achieve('xo_ultimate'); }
    }
    if (cfg.series === 'bo5' && winP) {
      series[winP]++;
      if (series[winP] >= 3) {
        seriesDone = true;
        const champ = cfg.mode === 'ai' ? (winP === human() ? App.profile.name : 'الذكاء الاصطناعي') : pname(winP);
        setTimeout(() => { if (tok !== roundToken) return; drawTrophy(); setMsg(`🏆 ${champ} ${App.g('بطلة', 'بطل')} السلسلة!`); Sound.win(); }, 1500);
        if (cfg.mode === 'pvp' || winP === human()) { App.achieve('xo_series'); App.addStars(5); }
      }
    }
    setTimeout(() => { if (over && tok === roundToken && App.current === 'chalk') setMsg(message + '  •  ' + App.g('المسي', 'المس') + ' للعب مجددًا'); }, seriesDone ? 3000 : 1600);
  }
  function undo() {
    if (!hist.length || thinking || erasing) { Sound.error(); return; }
    let steps = cfg.mode === 'ai' ? (turn === human() || over ? 2 : 1) : 1;
    if (over && cfg.mode === 'ai' && cells.filter(Boolean).length % 2 && turn === human()) steps = 1;
    let s = null; while (steps-- && hist.length) s = hist.pop();
    if (over) { // التراجع عن نهاية جولة يلغي نتيجتها من العدّاد كي لا تُحتسب مرتين
      setMsg(''); over = false; winLine = null;
    }
    ({ cells, subs, nextB, turn } = { cells: s.cells, subs: s.subs, nextB: s.nextB, turn: s.turn });
    if (cfg.mode === 'ai' && turn !== human()) { const t = hist.pop(); if (t) ({ cells, subs, nextB, turn } = { cells: t.cells, subs: t.subs, nextB: t.nextB, turn: t.turn }); }
    Sound.erase(); redrawAll(); setMsg(statusText()); paintSummary();
  }

  cv.addEventListener('pointerdown', e => {
    const r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    if (over) { if (strokes.every(s => s.prog >= 1)) newRound(); return; }
    if (thinking || erasing) return;
    if (cfg.mode === 'ai' && turn !== human()) return;
    const i = hit(x, y); if (i < 0) return;
    if (play(i) && !over && cfg.mode === 'ai') aiTurn();
  });

  /* ---------- الإعداد والملخص ---------- */
  const OPTS = {
    mode: [['ai', '🤖 ضد الذكاء'], ['pvp', '👭 لاعبان']],
    level: [['easy', '🐣 سهل'], ['medium', '🦊 متوسط'], ['hard', '🦁 لا يُقهر']],
    variant: [['3', '3×3'], ['4', '4×4 (أربعة)'], ['u', '🧠 الخارقة']],
    first: [['me', 'أنا أبدأ'], ['ai', 'الذكاء يبدأ']],
    series: [['one', 'جولة واحدة'], ['bo5', '🏆 الأفضل من 5']]
  };
  let pick = null;
  function setupPanel() {
    pick = { ...cfg };
    const paint = () => {
      root.querySelectorAll('#tSetupO [data-k]').forEach(box => {
        const k = box.dataset.k;
        let opts = OPTS[k];
        if (k === 'mode') opts = [['ai', '🤖 ضد الذكاء'], ['pvp', App.g('👭 لاعبتان', '👬 لاعبان')]];
        if (k === 'level') opts = OPTS.level.map(([v, l]) => [v, v === 'hard' && pick.variant !== '3' ? '🦁 صعب' : l]);
        box.innerHTML = opts.map(([v, l]) => `<button class="cbtn ${pick[k] === v ? 'on' : ''}" data-v="${v}">${l}</button>`).join('');
        box.querySelectorAll('button').forEach(b => b.onclick = () => { Sound.tap(); pick[k] = b.dataset.v; paint(); });
      });
      root.querySelector('#rowLevel').style.display = root.querySelector('#rowFirst').style.display = pick.mode === 'ai' ? '' : 'none';
    };
    paint(); root.querySelector('#tSetupO').classList.add('on');
  }
  root.querySelector('#tGo').onclick = () => {
    Sound.tap(); root.querySelector('#tSetupO').classList.remove('on');
    const resized = (pick.variant === 'u') !== isU();
    cfg = { ...pick }; store.set('tttCfg', cfg); series = { A: 0, B: 0 }; seriesDone = false;
    if (resized) resize();
    newRound();
  };
  function paintSummary() {
    const lv = OPTS.level.find(o => o[0] === cfg.level)[1], vr = OPTS.variant.find(o => o[0] === cfg.variant)[1];
    const parts = [cfg.mode === 'ai' ? (cfg.variant !== '3' && cfg.level === 'hard' ? '🦁 صعب' : lv) : App.g('👭 لاعبتان', '👬 لاعبان'), vr];
    if (cfg.series === 'bo5') parts.push(`🏆 ${series.A} : ${series.B}`);
    root.querySelector('#tSummary').innerHTML = parts.map(p => `<button class="cbtn on" data-setup>${p}</button>`).join('');
    root.querySelectorAll('[data-setup]').forEach(b => b.onclick = () => { Sound.tap(); setupPanel(); });
    root.querySelector('#tUndo').disabled = !hist || !hist.length;
  }
  root.querySelector('#tSetup').addEventListener('click', () => { Sound.tap(); setupPanel(); });
  root.querySelector('#tReset').addEventListener('click', () => { Sound.tap(); newRound(); });
  root.querySelector('#tUndo').addEventListener('click', () => { undo(); });

  /* ---------- الحلقة ---------- */
  function chalkText(c, txt, x, y, size, color) {
    c.font = `800 ${size}px 'Baloo Bhaijaan 2',system-ui,sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.direction = 'rtl';
    const tw = c.measureText(txt).width, maxW = W * .88;
    if (tw > maxW) { size = Math.floor(size * maxW / tw); c.font = `800 ${size}px 'Baloo Bhaijaan 2',system-ui,sans-serif`; }
    c.fillStyle = color; c.globalAlpha = .35; c.fillText(txt, x + 1.2, y + 1); c.fillText(txt, x - 1, y - .8);
    c.globalAlpha = .85; c.fillText(txt, x, y); c.globalAlpha = 1;
  }
  function loop(ts) {
    raf = requestAnimationFrame(loop);
    const t = ts / 1000, dt = Math.min(.05, t - (last || t)); last = t;
    const c = ctx;
    c.drawImage(boardTex, 0, 0, W, H);
    chalkText(c, `✏️ ${pname('A')}  ×  ${pname('B')}`, W / 2, Math.max(84, G.y * .42 + 22), Math.min(32, W / 13), CHALK);
    const sy = G.y - 24, sp = Math.min(120, W * .3);
    const cols = cfg.mode === 'ai'
      ? [[App.profile.name, scores.w, COL[human()]], ['تعادل', scores.d, CHALK], ['الذكاء', scores.l, COL[aiP()]]]
      : [[pname('A'), pvp.A, COL.A], ['تعادل', pvp.d, CHALK], [pname('B'), pvp.B, COL.B]];
    cols.forEach(([n, v, col], k) => chalkText(c, `${n}: ${v}`, W / 2 + (1 - k) * sp, sy, 17, col));
    // اللوحة المسموح اللعب فيها في الخارقة
    if (isU() && !over && !erasing) {
      const allowed = nextB >= 0 && !subs[nextB] ? [nextB] : [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(B => !subs[B]);
      c.save(); c.strokeStyle = COL[turn]; c.globalAlpha = .45 + Math.sin(t * 4) * .25; c.lineWidth = 3; c.setLineDash([8, 7]); c.lineDashOffset = -t * 20;
      for (const B of allowed) { const r = subRect(B); c.beginPath(); c.roundRect(r.x - 4, r.y - 4, r.s + 8, r.s + 8, 10); c.stroke(); }
      c.restore();
    }
    for (const st of strokes) {
      if (st.veil) { c.fillStyle = 'rgba(40,70,52,.85)'; c.fillRect(G.x - 20, G.y - 20, G.s + 40, G.s + 40); continue; }
      if (st.delay > 0) { st.delay -= dt; continue; }
      if (st.prog < 1) {
        st.prog = Math.min(1, st.prog + dt * st.speed / Math.max(40, st.len));
        const tip = st.pts[Math.min(st.pts.length - 1, Math.floor(st.pts.length * st.prog))];
        if (Math.random() < .7) dust.push({ x: tip[0] + rand(-3, 3), y: tip[1] + rand(-3, 3), vx: rand(-12, 12), vy: rand(15, 45), life: rand(.5, 1.1), r: rand(.5, 1.5) });
      }
      renderStroke(c, st);
    }
    const active = strokes.find(s => !s.veil && s.delay <= 0 && s.prog > 0 && s.prog < 1);
    if (active) {
      const tip = active.pts[Math.min(active.pts.length - 1, Math.floor(active.pts.length * active.prog))];
      c.save(); c.translate(tip[0], tip[1]); c.rotate(-.7);
      c.fillStyle = active.color; c.beginPath(); c.roundRect(-4, -34, 9, 34, 3); c.fill();
      c.fillStyle = 'rgba(0,0,0,.15)'; c.fillRect(2, -34, 3, 34); c.restore();
    }
    if (erasing > 0) {
      erasing -= dt * 1.7;
      const p = 1 - clamp(erasing, 0, 1), ex = G.x - 40 + (G.s + 80) * p, wob = Math.sin(p * 30) * 18;
      c.fillStyle = 'rgba(48,82,62,.95)'; c.fillRect(G.x - 30, G.y - 30, (G.s + 60) * p, G.s + 60);
      c.save(); c.translate(ex, G.y + G.s / 2 + wob); c.rotate(.15);
      c.fillStyle = '#6B4A8A'; c.beginPath(); c.roundRect(-20, -50, 40, 100, 6); c.fill(); c.fillStyle = '#ECE2D0'; c.fillRect(14, -50, 6, 100);
      c.restore(); if (erasing <= 0) erasing = 0;
    }
    for (const d of dust) { d.x += d.vx * dt; d.y += d.vy * dt; d.vy += 40 * dt; d.vx *= .98; d.life -= dt; c.globalAlpha = clamp(d.life, 0, 1) * .55; c.fillStyle = '#fff'; c.beginPath(); c.arc(d.x, d.y, d.r, 0, 7); c.fill(); }
    c.globalAlpha = 1; dust = dust.filter(d => d.life > 0);
    msgAnim = Math.min(1, msgAnim + dt * 3);
    const my = G.y + G.s + Math.min(46, (H - G.y - G.s) * .3);
    c.globalAlpha = msgAnim; chalkText(c, message, W / 2, my, Math.min(22, W / 18), over ? '#FFFFFF' : CHALK); c.globalAlpha = 1;
    if (cfg.mode === 'ai' && thinking) chalkText(c, '.'.repeat(1 + (t * 3 | 0) % 3), W / 2, my + 24, 22, CHALK);
    root.querySelector('#tUndo').disabled = !hist.length || thinking || !!erasing;
  }
  window.addEventListener('resize', () => { if (App.current === 'chalk') resize(); });

  /* ---------- عناصر المتجر ---------- */
  [['xo_classic', 'إكس وأو', 0], ['xo_hearts', 'قلب ونجمة', 25], ['xo_sun', 'شمس وقمر', 30], ['xo_pets', 'قطة وأرنب', 35]].forEach(([id, name, price]) => App.shopItem({
    cat: 'xo', id, name, price,
    draw(c, s) {
      c.fillStyle = '#2F4A3A'; c.beginPath(); c.roundRect(0, 0, s, s, 14); c.fill();
      const save = strokes; strokes = []; instant = true;
      symbolStrokes(SETS[id][0], s * .3, s * .5, s * .17, COL.A, 3); symbolStrokes(SETS[id][1], s * .7, s * .5, s * .17, COL.B, 3);
      strokes.forEach(st => renderStroke(c, st)); strokes = save; instant = false;
    }
  }));

  App.register({
    id: 'chalk', title: 'إكس أو', icon2: '✏️', music: 'class',
    desc: () => App.g('على سبورة الفصل: العبي مع صديقتك أو مع الذكاء', 'على سبورة الفصل: العب مع صديقك أو مع الذكاء'),
    help: () => [
      App.g('✏️ المسي مربعًا لترسمي رمزك بالطباشير، وأول من يصنع صفًّا كاملًا يفوز.', '✏️ المس مربعًا لترسم رمزك بالطباشير، وأول من يصنع صفًّا كاملًا يفوز.'),
      '⚙️ من الإعداد: اللعب ضد الذكاء (🐣 سهل، 🦊 متوسط، 🦁 لا يُقهر) أو لاعبان على الجهاز نفسه.',
      '🧩 لوحات جديدة: 4×4 بأربعة على التوالي، و🧠 الخارقة: 9 لوحات صغيرة، والمربع الذي تلعب فيه يحدد اللوحة التالية لخصمك!',
      '↶ زر التراجع يلغي آخر حركة، و🧽 يمسح السبورة لجولة جديدة.',
      '🏆 العب سلسلة «الأفضل من 5»، وغيّر الرموز من المتجر 🛍️ (قلب ونجمة، شمس وقمر، قطة وأرنب).'
    ],
    best() { const s = store.get('tttScore', { w: 0, l: 0, d: 0 }); return (s.w + s.l + s.d) ? `🏆 فوز ${s.w} · تعادل ${s.d}` : ''; },
    enter() {
      cfg = { ...cfg, ...store.get('tttCfg', {}) }; if (cfg.mode === 'ai' && store.get('tttMode', null) === 'pvp' && !store.get('tttCfg', null)) cfg.mode = 'pvp';
      scores = store.get('tttScore', { w: 0, l: 0, d: 0 }); sym = SETS[App.equipped('xo')] || SETS.xo_classic;
      series = { A: 0, B: 0 }; seriesDone = false; freshState(); paused = false;
      resize(); last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); newRound(false);
    },
    leave() { cancelAnimationFrame(raf); clearTimeout(aiTimer); roundToken++; over = true; root.querySelector('#tSetupO').classList.remove('on'); },
    pause() { paused = true; }, resume() { paused = false; },
    back() { const o = root.querySelector('#tSetupO'); if (o.classList.contains('on')) { o.classList.remove('on'); return true; } return false; },
    icon(c) {
      c.fillStyle = '#2F4A3A'; c.fillRect(0, 0, 152, 152);
      const save = strokes; strokes = []; instant = true;
      const sk = (pts, col, w) => addStroke(pts, col, w, 1000, 0, false);
      for (let k = 1; k <= 2; k++) { sk([[26 + k * 33, 22], [26 + k * 33, 130]], CHALK, 3.5); sk([[22, 26 + k * 33], [130, 26 + k * 33]], CHALK, 3.5); }
      const set = SETS[App.equipped('xo')] || SETS.xo_classic;
      symbolStrokes(set[0], 43, 43, 10, COL.A, 4.5); symbolStrokes(set[1], 76, 76, 11, COL.B, 4.5); symbolStrokes(set[0], 109, 109, 10, COL.A, 4.5);
      strokes.forEach(st => renderStroke(c, st)); strokes = save; instant = false;
    }
  });
})();
