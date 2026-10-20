/* =====================================================================
   2) دمج الأجرام — 2048 فضائية
   تلميح، قنبلة نجمية، تبديل، أحجام شبكة 3–6، تحدٍّ زمني، وموسوعة الأجرام.
   ===================================================================== */
(() => {
  const CELESTIAL = [
    { v: 2,    name: 'غبار نجمي',   c: ['#C9C3D9', '#7C7396'], kind: 'dust',   fact: 'الغبار النجمي حبيبات صغيرة جدًا تسبح في الفضاء، ومنها تتكوّن النجوم والكواكب.' },
    { v: 4,    name: 'كويكب',        c: ['#B8A08A', '#5E4A3C'], kind: 'rock',   fact: 'الكويكبات صخور فضائية، يدور أكثرها حول الشمس بين المريخ والمشتري.' },
    { v: 8,    name: 'مذنّب',        c: ['#BDF3FF', '#3AA6D8'], kind: 'comet',  fact: 'المذنّب كرة من الجليد والغبار، وحين يقترب من الشمس يظهر له ذيل لامع طويل.' },
    { v: 16,   name: 'قمر صغير',     c: ['#F2F0E6', '#9C988A'], kind: 'moon',   fact: 'لبعض الكواكب أقمار صغيرة جدًا، مثل قمري المريخ: فوبوس وديموس.' },
    { v: 32,   name: 'قمر',          c: ['#FFF6D6', '#C7B98A'], kind: 'moon2',  fact: 'القمر يدور حول الأرض، ويبدو منيرًا لأنه يعكس ضوء الشمس.' },
    { v: 64,   name: 'كوكب أحمر',    c: ['#FF9B6A', '#A8381E'], kind: 'mars',   fact: 'المريخ هو الكوكب الأحمر، ولونه بسبب الصدأ في تربته!' },
    { v: 128,  name: 'كوكب أزرق',    c: ['#7FD8FF', '#1E5FB8'], kind: 'earth',  fact: 'الأرض هي الكوكب الأزرق لأن الماء يغطي معظم سطحها، وهي بيتنا الجميل.' },
    { v: 256,  name: 'كوكب الحلقات', c: ['#FFE3A3', '#C98B3A'], kind: 'ring',   fact: 'زحل مشهور بحلقاته الجميلة المصنوعة من الجليد والصخور.' },
    { v: 512,  name: 'عملاق غازي',   c: ['#FFC9A8', '#B05A3A'], kind: 'giant',  fact: 'المشتري أكبر كواكب المجموعة الشمسية، ويتّسع لأكثر من 1000 كرة بحجم الأرض!' },
    { v: 1024, name: 'نجم',          c: ['#FFFBD0', '#FFB21E'], kind: 'star',   fact: 'النجوم كرات ضخمة من الغاز المتوهّج، وبعضها أكبر من الشمس بكثير.' },
    { v: 2048, name: 'شمس متوهّجة',  c: ['#FFFFFF', '#FF8A00'], kind: 'sun',    fact: 'الشمس نجم قريب منا تمنحنا الضوء والدفء، ويصل ضوؤها إلينا في نحو 8 دقائق.' },
    { v: 4096, name: 'عملاق أزرق',   c: ['#FFFFFF', '#3A7BFF'], kind: 'blue',   fact: 'العمالقة الزرقاء نجوم شديدة الحرارة واللمعان، ولونها أزرق لأنها أسخن من الشمس.' },
    { v: 8192, name: 'مجرّة',        c: ['#FFD6F5', '#7A3AFF'], kind: 'galaxy', fact: 'المجرّة مدينة من مليارات النجوم، ونحن نعيش في مجرّة درب التبانة.' }
  ];
  const lvl = v => Math.log2(v) - 1;

  App.css(`
  #cosmos{background:#0B0824;color:#fff}
  #cosmos canvas.sky{position:absolute;inset:0;width:100%;height:100%}
  #cosmos .bar .chip{background:rgba(255,255,255,.1);color:#fff;box-shadow:0 0 0 1px rgba(255,255,255,.18) inset}
  #cosmos .ib{background:rgba(255,255,255,.12);color:#fff;box-shadow:0 0 0 1px rgba(255,255,255,.2) inset}
  #cosmos .ib.act{background:rgba(255,200,60,.35);box-shadow:0 0 0 2px #FFD84D inset,0 0 16px #FFB21E}
  #cosmos .cwrap{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:70px 14px max(14px,env(safe-area-inset-bottom));gap:10px}
  #cosmos .ctitle{font-size:21px;font-weight:800;text-shadow:0 0 14px #9b7bff;display:flex;gap:8px;align-items:center}
  #cosmos .ctitle small{font-size:12px;font-weight:700;background:rgba(255,255,255,.12);border-radius:99px;padding:1px 10px}
  #cosmos .goal{font-size:13px;opacity:.75;margin-top:-8px;text-align:center}
  #cosmos .tools{display:flex;gap:12px;justify-content:center}
  #cosmos .tools .ib{width:52px;height:52px;flex-basis:52px;font-size:24px}
  #cBoard{--gap:10px;position:relative;width:min(92vw,56vh,440px);aspect-ratio:1;border-radius:22px;padding:var(--gap);direction:ltr;
    background:rgba(40,28,100,.45);box-shadow:0 0 0 2px rgba(160,140,255,.25) inset,0 0 40px rgba(110,80,255,.25)}
  #cBoard.target{box-shadow:0 0 0 3px #FFD84D inset,0 0 40px rgba(255,200,60,.45)}
  #cosmos .cell{position:absolute;border-radius:14px;background:rgba(255,255,255,.05);box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}
  #cosmos .tile{position:absolute;left:0;top:0;display:grid;place-items:center;transition:transform .12s ease-in-out;z-index:2}
  #cosmos .tile .orb{width:84%;height:84%;border-radius:50%;position:relative;display:grid;place-items:center}
  #cosmos .tile .num{position:absolute;bottom:-2%;left:50%;transform:translateX(-50%);font-weight:900;font-size:calc(var(--ts) * .2);line-height:1;
    padding:2px 7px 1px;border-radius:99px;background:rgba(10,6,40,.6);color:#fff;white-space:nowrap;direction:ltr}
  #cosmos .tile.new .orb{animation:cAppear .2s ease-out}
  #cosmos .tile.merged .orb{animation:cMerge .25s ease-out}
  #cosmos .tile.sel{filter:drop-shadow(0 0 10px #FFD84D) brightness(1.2)}
  #cosmos .tile.boom{animation:cBoom .35s ease-in forwards}
  @keyframes cAppear{from{transform:scale(0)}}
  @keyframes cMerge{0%{transform:scale(.8)}50%{transform:scale(1.22)}100%{transform:scale(1)}}
  @keyframes cBoom{to{transform:scale(1.6);opacity:0;filter:brightness(3)}}
  @keyframes cspin{to{transform:rotate(360deg)}}
  #cosmos .arrow{position:absolute;inset:0;display:grid;place-items:center;font-size:110px;z-index:5;pointer-events:none;opacity:0;text-shadow:0 0 30px #FFD84D}
  #cosmos .arrow.show{animation:cArrow 1.4s ease-out}
  @keyframes cArrow{0%{opacity:0;transform:scale(.5)}20%{opacity:1;transform:scale(1.05)}70%{opacity:1}100%{opacity:0}}
  #cosmos .toast{position:absolute;top:20%;left:50%;transform:translateX(-50%);z-index:10;font-weight:900;font-size:24px;color:#fff;text-shadow:0 0 16px #ffcc33,0 0 4px #ff8a00;pointer-events:none;white-space:nowrap;opacity:0}
  #cosmos .toast.show{animation:cToast 1.6s ease-out}
  @keyframes cToast{0%{opacity:0;transform:translate(-50%,10px) scale(.8)}15%{opacity:1;transform:translate(-50%,0) scale(1.05)}80%{opacity:1}100%{opacity:0;transform:translate(-50%,-20px)}}
  #cosmos .panel{background:#1B1342;color:#fff;border-color:#4B3A9A;box-shadow:0 8px 0 #2E2270,0 20px 40px rgba(0,0,0,.5)}
  #cosmos .panel h3{color:#FFD84D}#cosmos .panel .big{color:#fff}
  #cosmos .opt{display:flex;gap:6px;justify-content:center;margin:6px 0 12px;flex-wrap:wrap}
  #cosmos .opt button{padding:6px 14px;border-radius:99px;background:rgba(255,255,255,.1);color:#fff;font-weight:800;font-size:16px}
  #cosmos .opt button.on{background:#FFD84D;color:#3a2a00}
  #cosmos .ency{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;max-height:58vh;overflow-y:auto;touch-action:pan-y;text-align:center;padding:2px}
  #cosmos .ency div{background:rgba(255,255,255,.07);border-radius:16px;padding:8px}
  #cosmos .ency i{display:block;width:46px;height:46px;border-radius:50%;margin:2px auto 4px}
  #cosmos .ency b{display:block;font-size:14px}
  #cosmos .ency small{display:block;font-size:11.5px;line-height:1.45;opacity:.85}
  #cosmos .ency .lock{opacity:.35}
  #cosmos .ency .lock i{filter:grayscale(1) brightness(.4)}
  `);
  const root = App.section('cosmos', `
    <canvas class="sky" id="cSky"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib" id="cMode" aria-label="الأوضاع">📐</button>
      <button class="ib" id="cBook" aria-label="الموسوعة">📖</button>
      <span class="grow"></span>
      <div class="chip"><small>النقاط</small><b id="cScore">0</b></div>
      <div class="chip"><small id="cBestL">الأفضل</small><b id="cBest">0</b></div>
    </div>
    <div class="cwrap">
      <div class="ctitle">✨ دمج الأجرام ✨ <small id="cInfo">4×4</small></div>
      <div class="goal" id="cGoal"></div>
      <div id="cBoard"><div class="arrow" id="cArrow"></div></div>
      <div class="tools">
        <button class="ib" id="cUndo" aria-label="تراجع">↶</button>
        <button class="ib" id="cHint" aria-label="تلميح">💡<span class="cnt" id="nHint">3</span></button>
        <button class="ib" id="cBomb" aria-label="قنبلة نجمية">💥<span class="cnt" id="nBomb">1</span></button>
        <button class="ib" id="cSwap" aria-label="تبديل">🔀<span class="cnt" id="nSwap">1</span></button>
        <button class="ib" id="cNew" aria-label="لعبة جديدة">🔄</button>
      </div>
    </div>
    <div class="toast" id="cToast"></div>
    <div class="overlay" id="cOver"><div class="panel">
      <h3 id="cOverT"></h3><div class="big" id="cFinal"></div><p id="cOverP"></p>
      <button class="btn" id="cAgain">🔁 مجرّة جديدة</button>
      <button class="btn alt" id="cKeep" style="display:none">🚀 متابعة اللعب</button>
      <button class="btn alt home">🏠 القائمة</button>
    </div></div>
    <div class="overlay" id="cModes"><div class="panel">
      <h3>📐 اختر المجرّة</h3>
      <p style="margin:0">حجم الشبكة</p><div class="opt" id="oSize"></div>
      <p style="margin:0">الوضع</p><div class="opt" id="oMode"></div>
      <button class="btn" id="oGo">🚀 ابدأ</button><button class="btn alt" id="oX">إغلاق</button>
    </div></div>
    <div class="overlay" id="cEncy"><div class="panel" style="width:min(94vw,480px)">
      <h3>📖 موسوعة الأجرام</h3><div class="ency" id="cEncyL"></div>
      <button class="btn" id="cEncyX" style="margin-top:10px">إغلاق</button>
    </div></div>`);

  const board = root.querySelector('#cBoard');
  let N = 4, mode = 'classic', grid, score, best, bestTile, won, keepGoing, busy = false, hist = [], idc = 0;
  let powers = { hint: 3, bomb: 1, swap: 1 }, nextPower = 1000, target = null, swapFirst = null;
  let timeLeft = 0, timer = null, ended = false;
  let sky, stars = [], skyRaf = 0, shooting = [], geo = { ts: 80, gap: 10 }, lastT = 0, paused = false;
  const sfx = () => mode === 'timed' ? `cosmosTimed_${N}` : N === 4 ? 'cosmos' : `cosmos${N}`;

  /* ---------- رسم الأجرام بأسلوب CSS ---------- */
  function orbStyle(level) {
    const d = CELESTIAL[Math.min(level, CELESTIAL.length - 1)], [a, b] = d.c;
    let bg = `radial-gradient(circle at 35% 30%,${a},${b} 70%)`, sh = '0 0 0 transparent', extra = '';
    switch (d.kind) {
      case 'dust': bg = `radial-gradient(circle at 30% 30%,#fff 0 6%,transparent 7%),radial-gradient(circle at 65% 60%,#E6E0F5 0 8%,transparent 9%),radial-gradient(circle at 40% 70%,#B3A9CF 0 7%,transparent 8%),radial-gradient(circle,rgba(180,170,220,.35),transparent 70%)`; break;
      case 'rock': bg = `radial-gradient(circle at 60% 60%,rgba(0,0,0,.25) 0 10%,transparent 11%),radial-gradient(circle at 35% 45%,rgba(0,0,0,.2) 0 8%,transparent 9%),radial-gradient(ellipse at 35% 30%,${a},${b} 75%)`; extra = 'border-radius:46% 54% 42% 58%/55% 45% 55% 45%;width:70%;height:64%;'; break;
      case 'comet': bg = `radial-gradient(circle at 70% 35%,#fff 0 14%,${a} 22%,transparent 34%),linear-gradient(225deg,transparent 30%,rgba(130,220,255,.65) 45%,transparent 85%)`; sh = '0 0 12px rgba(120,220,255,.6)'; break;
      case 'moon': case 'moon2': bg = `radial-gradient(circle at 62% 40%,rgba(0,0,0,.13) 0 9%,transparent 10%),radial-gradient(circle at 38% 65%,rgba(0,0,0,.12) 0 12%,transparent 13%),radial-gradient(circle at 70% 70%,rgba(0,0,0,.1) 0 6%,transparent 7%),radial-gradient(circle at 35% 30%,${a},${b} 80%)`; sh = `0 0 ${d.kind === 'moon2' ? 18 : 8}px rgba(255,250,220,.45)`; if (d.kind === 'moon') extra = 'width:72%;height:72%;'; break;
      case 'mars': bg = `linear-gradient(170deg,transparent 40%,rgba(120,30,10,.25) 42% 50%,transparent 52%),radial-gradient(circle at 35% 30%,${a},${b} 78%)`; sh = '0 0 14px rgba(255,120,80,.4)'; break;
      case 'earth': bg = `radial-gradient(ellipse at 30% 40%,#5BD07A 0 14%,transparent 15%),radial-gradient(ellipse at 65% 65%,#4CBF6B 0 12%,transparent 13%),radial-gradient(ellipse at 60% 25%,rgba(255,255,255,.7) 0 7%,transparent 8%),radial-gradient(circle at 35% 30%,${a},${b} 78%)`; sh = '0 0 18px rgba(90,180,255,.55)'; break;
      case 'ring': sh = '0 0 16px rgba(255,210,120,.45)'; extra = 'width:66%;height:66%;'; break;
      case 'giant': bg = `repeating-linear-gradient(175deg,rgba(255,255,255,0) 0 9%,rgba(150,60,30,.28) 9% 15%,rgba(255,230,200,.25) 15% 19%),radial-gradient(circle at 35% 30%,${a},${b} 80%)`; sh = '0 0 22px rgba(255,170,120,.5)'; extra = 'width:90%;height:90%;'; break;
      case 'star': bg = `radial-gradient(circle,#fff 0 25%,${a} 40%,${b} 75%)`; sh = '0 0 24px 6px rgba(255,200,60,.75)'; break;
      case 'sun': bg = `radial-gradient(circle,#fff 0 22%,#FFE680 38%,${b} 78%)`; sh = '0 0 30px 10px rgba(255,150,30,.85),0 0 60px 18px rgba(255,90,0,.35)'; extra = 'width:92%;height:92%;'; break;
      case 'blue': bg = `radial-gradient(circle,#fff 0 25%,#BFD6FF 42%,${b} 80%)`; sh = '0 0 30px 10px rgba(90,150,255,.8)'; break;
      case 'galaxy': bg = 'conic-gradient(from 0deg,#FFD6F5,#7A3AFF,#3AD6FF,#FFD6F5,#7A3AFF,#3AD6FF,#FFD6F5)'; sh = '0 0 30px 10px rgba(180,100,255,.7)'; break;
    }
    return { bg, sh, extra, d };
  }
  function orbHTML(level) {
    const { bg, sh, extra, d } = orbStyle(level);
    let inner = '';
    if (d.kind === 'ring') inner = `<span style="position:absolute;left:-28%;right:-28%;top:42%;height:18%;border-radius:50%;border:3px solid rgba(255,230,170,.9);border-top-color:transparent;transform:rotate(-14deg)"></span><span style="position:absolute;left:-28%;right:-28%;top:42%;height:18%;border-radius:50%;border:3px solid rgba(255,230,170,.9);border-bottom-color:transparent;transform:rotate(-14deg);z-index:-1"></span>`;
    if (d.kind === 'sun' || d.kind === 'star' || d.kind === 'blue') inner = `<span style="position:absolute;inset:-14%;border-radius:50%;background:repeating-conic-gradient(rgba(255,230,120,.55) 0 8deg,transparent 8deg 22deg);z-index:-1;animation:cspin 8s linear infinite;mask:radial-gradient(circle,transparent 45%,#000 50%,transparent 72%);-webkit-mask:radial-gradient(circle,transparent 45%,#000 50%,transparent 72%)"></span>`;
    const anim = d.kind === 'galaxy' ? 'animation:cspin 6s linear infinite;' : '';
    return `<div class="orb" style="background:${bg};box-shadow:${sh};${extra}${anim}">${inner}</div><div class="num">${d.v}</div>`;
  }

  /* ---------- الشبكة ---------- */
  function buildCells() {
    board.querySelectorAll('.cell,.tile').forEach(e => e.remove());
    for (let i = 0; i < N * N; i++) { const d = document.createElement('div'); d.className = 'cell'; board.appendChild(d); }
    board.style.setProperty('--gap', (N >= 6 ? 6 : N === 5 ? 8 : 10) + 'px');
  }
  function layout() {
    const size = board.clientWidth, gap = parseFloat(getComputedStyle(board).getPropertyValue('--gap')) || 10;
    const ts = (size - gap * (N + 1)) / N;
    board.querySelectorAll('.cell').forEach((d, i) => {
      const r = Math.floor(i / N), c = i % N;
      Object.assign(d.style, { width: ts + 'px', height: ts + 'px', left: gap + c * (ts + gap) + 'px', top: gap + r * (ts + gap) + 'px' });
    });
    board.style.setProperty('--ts', ts + 'px');
    return { ts, gap };
  }
  const pos = (r, c) => `translate(${geo.gap + c * (geo.ts + geo.gap)}px,${geo.gap + r * (geo.ts + geo.gap)}px)`;
  function newTileEl(t, cls) {
    const el = document.createElement('div'); el.className = 'tile ' + (cls || '');
    el.style.width = el.style.height = geo.ts + 'px'; el.style.transform = pos(t.r, t.c);
    el.innerHTML = orbHTML(lvl(t.v)); board.appendChild(el); t.el = el;
  }
  function addRandom() {
    const empty = []; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (!grid[r][c]) empty.push([r, c]);
    if (!empty.length) return;
    const [r, c] = empty[Math.random() * empty.length | 0];
    const t = { id: ++idc, v: Math.random() < .9 ? 2 : 4, r, c }; grid[r][c] = t; newTileEl(t, 'new');
  }
  const matrix = () => grid.map(row => row.map(t => t ? t.v : 0));
  function snapshot() { return { g: matrix(), score, powers: { ...powers }, nextPower }; }
  function restore(s) {
    board.querySelectorAll('.tile').forEach(e => e.remove());
    grid = s.g.map((row, r) => row.map((v, c) => { if (!v) return null; const t = { id: ++idc, v, r, c }; newTileEl(t); return t; }));
    score = s.score; if (s.powers) powers = { ...s.powers }; if (s.nextPower) nextPower = s.nextPower;
    paint();
  }
  function save() { if (mode === 'classic') store.set(sfx() + 'State', { ...snapshot(), won, keepGoing }); }
  function reset(fromSave) {
    stopTimer(); clearTarget();
    buildCells(); geo = layout();
    grid = Array.from({ length: N }, () => Array(N).fill(null)); score = 0; won = false; keepGoing = false; hist = []; ended = false;
    powers = { hint: 3, bomb: 1, swap: 1 }; nextPower = 1000;
    best = store.get(sfx() + 'Best', 0); bestTile = store.get('cosmosBestTile', 0);
    const sv = fromSave && mode === 'classic' && store.get(sfx() + 'State', null);
    if (sv && sv.g && sv.g.length === N && sv.g.flat().some(v => v)) { restore(sv); won = sv.won; keepGoing = sv.keepGoing; }
    else { addRandom(); addRandom(); save(); }
    if (mode === 'timed') { timeLeft = 180; startTimer(); }
    $('#cInfo').textContent = `${N}×${N} · ${mode === 'timed' ? '⏱️ تحدٍّ زمني' : 'كلاسيكي'}`;
    $('#cGoal').textContent = mode === 'timed' ? App.g('اجمعي أكبر عدد من النقاط قبل نهاية الوقت!', 'اجمع أكبر عدد من النقاط قبل نهاية الوقت!') : App.g('اسحبي لتحريك الأجرام — جرمان متشابهان يندمجان في جرم أكبر', 'اسحب لتحريك الأجرام — جرمان متشابهان يندمجان في جرم أكبر');
    paint(); $('#cOver').classList.remove('on');
  }
  function paint() {
    $('#cScore').textContent = score;
    if (mode === 'timed') { $('#cBestL').textContent = 'الوقت'; $('#cBest').textContent = `${Math.floor(timeLeft / 60)}:${String(Math.max(0, timeLeft | 0) % 60).padStart(2, '0')}`; }
    else { if (score > best) { best = score; store.set(sfx() + 'Best', best); } $('#cBestL').textContent = 'الأفضل'; $('#cBest').textContent = best; }
    $('#nHint').textContent = powers.hint; $('#nBomb').textContent = powers.bomb; $('#nSwap').textContent = powers.swap;
    $('#cHint').disabled = !powers.hint; $('#cBomb').disabled = !powers.bomb; $('#cSwap').disabled = !powers.swap;
    $('#cUndo').disabled = !hist.length || mode === 'timed';
  }
  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      if (paused || App.current !== 'cosmos' || ended) return;
      timeLeft -= .25; paint();
      if (timeLeft <= 10 && Math.abs(timeLeft % 1) < .01 && timeLeft > 0) Sound.tone(880, .08, 'square', .05);
      if (timeLeft <= 0) end('time');
    }, 250);
  }
  function stopTimer() { if (timer) clearInterval(timer); timer = null; }

  /* منطق تحريك نقي (للتلميح) */
  function slide(m, dir) {
    const n = m.length, out = m.map(r => r.slice()); let moved = false, gain = 0;
    const get = (i, j) => dir === 0 ? [i, j] : dir === 2 ? [i, n - 1 - j] : dir === 1 ? [j, i] : [n - 1 - j, i];
    for (let i = 0; i < n; i++) {
      const line = []; for (let j = 0; j < n; j++) { const [r, c] = get(i, j); if (m[r][c]) line.push(m[r][c]); }
      const res = [];
      for (let k = 0; k < line.length; k++) { if (line[k] === line[k + 1]) { res.push(line[k] * 2); gain += line[k] * 2; k++; } else res.push(line[k]); }
      for (let j = 0; j < n; j++) { const [r, c] = get(i, j), v = res[j] || 0; if (out[r][c] !== v) moved = true; out[r][c] = v; }
    }
    return { m: out, moved, gain };
  }
  function heur(m) {
    const n = m.length; let empty = 0, mx = 0, smooth = 0, mono = 0;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const v = m[r][c]; if (!v) { empty++; continue; } mx = Math.max(mx, v);
      const l = Math.log2(v);
      if (c < n - 1 && m[r][c + 1]) smooth -= Math.abs(l - Math.log2(m[r][c + 1]));
      if (r < n - 1 && m[r + 1][c]) smooth -= Math.abs(l - Math.log2(m[r + 1][c]));
    }
    for (let r = 0; r < n; r++) { let a = 0, b = 0; for (let c = 0; c < n - 1; c++) { const x = m[r][c] ? Math.log2(m[r][c]) : 0, y = m[r][c + 1] ? Math.log2(m[r][c + 1]) : 0; if (x > y) a += x - y; else b += y - x; } mono -= Math.min(a, b); }
    for (let c = 0; c < n; c++) { let a = 0, b = 0; for (let r = 0; r < n - 1; r++) { const x = m[r][c] ? Math.log2(m[r][c]) : 0, y = m[r + 1][c] ? Math.log2(m[r + 1][c]) : 0; if (x > y) a += x - y; else b += y - x; } mono -= Math.min(a, b); }
    const corner = [m[0][0], m[0][n - 1], m[n - 1][0], m[n - 1][n - 1]].includes(mx) ? Math.log2(mx) * 2 : 0;
    return empty * 2.7 + smooth * .1 + mono * 1 + corner;
  }
  function bestDir() {
    const m = matrix(); let bd = -1, bs = -Infinity;
    for (let d = 0; d < 4; d++) {
      const r = slide(m, d); if (!r.moved) continue;
      const empties = []; r.m.forEach((row, i) => row.forEach((v, j) => { if (!v) empties.push([i, j]); }));
      const sample = empties.sort(() => Math.random() - .5).slice(0, 6); let tot = 0;
      for (const [i, j] of sample) {
        const m2 = r.m.map(x => x.slice()); m2[i][j] = 2; let b2 = -Infinity;
        for (let d2 = 0; d2 < 4; d2++) { const r2 = slide(m2, d2); if (r2.moved) b2 = Math.max(b2, heur(r2.m) + Math.log2(r2.gain + 1) * .5); }
        tot += b2 === -Infinity ? -100 : b2;
      }
      const s = (sample.length ? tot / sample.length : heur(r.m)) + Math.log2(r.gain + 1) * .5;
      if (s > bs) { bs = s; bd = d; }
    }
    return bd;
  }

  function move(dir) { // 0 يسار، 1 أعلى، 2 يمين، 3 أسفل
    if (busy || ended || $('#cOver').classList.contains('on') || target) return;
    const before = snapshot();
    const vec = [[0, -1], [-1, 0], [0, 1], [1, 0]][dir];
    const rows = [...Array(N).keys()], cols = [...Array(N).keys()];
    if (vec[0] === 1) rows.reverse(); if (vec[1] === 1) cols.reverse();
    let moved = false, gained = 0, topMerge = -1;
    const merged = new Set(), dying = [];
    for (const r of rows) for (const c of cols) {
      const t = grid[r][c]; if (!t) continue;
      let nr = r, nc = c, gone = false;
      while (true) {
        const rr = nr + vec[0], cc = nc + vec[1];
        if (rr < 0 || rr >= N || cc < 0 || cc >= N) break;
        const o = grid[rr][cc];
        if (!o) { nr = rr; nc = cc; continue; }
        if (o.v === t.v && !merged.has(o.id)) {
          grid[r][c] = null; o.v *= 2; merged.add(o.id); gained += o.v; topMerge = Math.max(topMerge, lvl(o.v));
          t.r = rr; t.c = cc; t.el.style.transform = pos(rr, cc); t.el.style.zIndex = 1; dying.push({ t, o }); moved = true; gone = true;
        }
        break;
      }
      if (gone) continue;
      if (nr !== r || nc !== c) { grid[r][c] = null; grid[nr][nc] = t; t.r = nr; t.c = nc; t.el.style.transform = pos(nr, nc); moved = true; }
    }
    if (!moved) return;
    hist.push(before); if (hist.length > 20) hist.shift();
    busy = true; Sound.slide();
    setTimeout(() => {
      for (const { t, o } of dying) {
        t.el.remove(); o.el.innerHTML = orbHTML(lvl(o.v));
        o.el.classList.remove('new', 'merged'); void o.el.offsetWidth; o.el.classList.add('merged');
        sparkle(o.r, o.c, lvl(o.v));
      }
      if (topMerge >= 0) { Sound.merge(topMerge); vibrate(12); }
      score += gained;
      while (score >= nextPower) { // مكافأة القدرات كل 1000 نقطة
        nextPower += 1000; powers.hint++; if ((nextPower / 1000) % 2) powers.swap++; else powers.bomb++;
        toast('🎁 قدرة جديدة!'); Sound.star();
      }
      const mt = maxTile();
      if (mt >= 32) App.achieve('cosmos_moon');
      if (mt >= 128) App.achieve('cosmos_planet');
      if (mt >= 2048) App.achieve('cosmos_sun');
      if (mt > bestTile) { bestTile = mt; store.set('cosmosBestTile', bestTile); if (mt >= 16) { toast(`✨ ${CELESTIAL[lvl(mt)].name} جديد!`); App.addStars(2); } }
      addRandom(); paint(); save(); busy = false;
      if (mode === 'classic' && !won && !keepGoing && mt >= 2048) { won = true; save(); end('win'); }
      else if (!canMove()) {
        if (powers.bomb || powers.swap) toast(App.g('اللوحة ممتلئة! استخدمي 💥 أو 🔀', 'اللوحة ممتلئة! استخدم 💥 أو 🔀'));
        else end('full');
      }
    }, 125);
  }
  function maxTile() { let m = 0; if (grid) for (const row of grid) for (const t of row) if (t) m = Math.max(m, t.v); return m; }
  function canMove() {
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const t = grid[r][c]; if (!t) return true;
      if (c < N - 1 && grid[r][c + 1] && grid[r][c + 1].v === t.v) return true;
      if (r < N - 1 && grid[r + 1][c] && grid[r + 1][c].v === t.v) return true;
    }
    return false;
  }
  function end(why) {
    if (ended && why !== 'win') return;
    const mt = maxTile(), d = CELESTIAL[lvl(mt)];
    if (why !== 'win') { ended = true; stopTimer(); }
    $('#cOverT').textContent = why === 'win' ? App.g('☀️ صنعتِ شمسًا متوهّجة!', '☀️ صنعت شمسًا متوهّجة!') : why === 'time' ? '⏱️ انتهى الوقت!' : 'امتلأت المجرّة! 🌌';
    $('#cFinal').textContent = why === 'time' ? score : d ? d.name : mt;
    $('#cOverP').textContent = why === 'win' ? `النقاط: ${score} — تابع اللعب لصنع عملاق أزرق!` : why === 'time' ? `أكبر جرم: ${d ? d.name : mt}` : `أكبر جرم صنعته • النقاط: ${score}`;
    $('#cKeep').style.display = why === 'win' ? '' : 'none';
    why === 'win' ? Sound.win() : Sound.lose();
    if (why === 'win') App.addStars(10);
    if (why === 'time') {
      const tb = store.get(sfx() + 'Best', 0);
      if (score > tb) { store.set(sfx() + 'Best', score); $('#cOverP').textContent += ' • 🏆 رقم قياسي!'; }
      if (score >= 2000) App.achieve('cosmos_timed');
      const s = Math.floor(score / 1000); if (s) App.addStars(s);
    }
    if (why === 'full' && mode === 'classic') store.set(sfx() + 'State', null);
    setTimeout(() => $('#cOver').classList.add('on'), 350);
  }
  function sparkle(r, c, level) {
    const rect = board.getBoundingClientRect(), x = rect.left + geo.gap + c * (geo.ts + geo.gap) + geo.ts / 2, y = rect.top + geo.gap + r * (geo.ts + geo.gap) + geo.ts / 2;
    for (let i = 0; i < 6 + level; i++) { const a = Math.random() * 6.28, s = rand(30, 60 + level * 6); shooting.push({ x, y, vx: Math.cos(a) * s * 2.2, vy: Math.sin(a) * s * 2.2, life: .6, spark: true, hue: CELESTIAL[Math.min(level, 12)].c[1] }); }
  }
  function toast(t) { const el = $('#cToast'); el.textContent = t; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); }

  /* ---------- القدرات ---------- */
  function clearTarget() {
    target = null; if (swapFirst && swapFirst.el) swapFirst.el.classList.remove('sel'); swapFirst = null;
    board.classList.remove('target'); root.querySelectorAll('.tools .ib').forEach(b => b.classList.remove('act'));
  }
  function arm(kind) {
    if (busy || ended) return;
    if (target === kind) { clearTarget(); return; }
    if (!powers[kind]) { Sound.error(); return; }
    clearTarget(); target = kind; board.classList.add('target'); $(kind === 'bomb' ? '#cBomb' : '#cSwap').classList.add('act');
    toast(kind === 'bomb' ? App.g('اختاري جرمًا لتفجيره 💥', 'اختر جرمًا لتفجيره 💥') : App.g('اختاري جرمين لتبديلهما 🔀', 'اختر جرمين لتبديلهما 🔀'));
  }
  function tileAt(e) {
    const r0 = board.getBoundingClientRect(), x = e.clientX - r0.left - geo.gap, y = e.clientY - r0.top - geo.gap;
    const c = Math.floor(x / (geo.ts + geo.gap)), r = Math.floor(y / (geo.ts + geo.gap));
    return r >= 0 && r < N && c >= 0 && c < N ? grid[r][c] : null;
  }
  function useOn(t) {
    if (!t) return;
    if (target === 'bomb') {
      if (grid.flat().filter(Boolean).length < 2) { Sound.error(); return; }
      hist.push(snapshot()); powers.bomb--; grid[t.r][t.c] = null; t.el.classList.add('boom'); setTimeout(() => t.el.remove(), 350);
      sparkle(t.r, t.c, 9); Sound.boom(); vibrate(40); clearTarget(); paint(); save();
      if (!canMove() && !powers.bomb && !powers.swap) end('full');
    } else if (target === 'swap') {
      if (!swapFirst) { swapFirst = t; t.el.classList.add('sel'); Sound.tap(); return; }
      if (swapFirst === t) { t.el.classList.remove('sel'); swapFirst = null; return; }
      hist.push(snapshot()); powers.swap--;
      const a = swapFirst, b = t; [a.r, b.r] = [b.r, a.r]; [a.c, b.c] = [b.c, a.c];
      grid[a.r][a.c] = a; grid[b.r][b.c] = b; a.el.style.transform = pos(a.r, a.c); b.el.style.transform = pos(b.r, b.c);
      Sound.whoosh(); clearTarget(); paint(); save();
      if (!canMove() && !powers.bomb && !powers.swap) end('full');
    }
  }
  function hint() {
    if (busy || ended || !powers.hint) { if (!powers.hint) Sound.error(); return; }
    const d = bestDir(); if (d < 0) return;
    powers.hint--; paint(); Sound.star();
    const a = $('#cArrow'); a.textContent = ['⬅️', '⬆️', '➡️', '⬇️'][d]; a.classList.remove('show'); void a.offsetWidth; a.classList.add('show');
  }

  /* ---------- النوافذ ---------- */
  let pickN = 4, pickMode = 'classic';
  function modesPanel() {
    pickN = N; pickMode = mode;
    const draw = () => {
      $('#oSize').innerHTML = [3, 4, 5, 6].map(n => `<button data-n="${n}" class="${n === pickN ? 'on' : ''}">${n}×${n}</button>`).join('');
      $('#oMode').innerHTML = [['classic', '♾️ كلاسيكي'], ['timed', '⏱️ 3 دقائق']].map(([m, l]) => `<button data-m="${m}" class="${m === pickMode ? 'on' : ''}">${l}</button>`).join('');
      $('#oSize').querySelectorAll('button').forEach(b => b.onclick = () => { Sound.tap(); pickN = +b.dataset.n; draw(); });
      $('#oMode').querySelectorAll('button').forEach(b => b.onclick = () => { Sound.tap(); pickMode = b.dataset.m; draw(); });
    };
    draw(); $('#cModes').classList.add('on');
  }
  function encyPanel() {
    const bt = Math.max(store.get('cosmosBestTile', 0), maxTile());
    $('#cEncyL').innerHTML = CELESTIAL.map((d, i) => {
      const open = d.v <= bt, { bg, sh } = orbStyle(i);
      return `<div class="${open ? '' : 'lock'}"><i style="background:${bg};box-shadow:${sh}"></i><b>${open ? d.name : '؟؟؟'} · ${d.v}</b><small>${open ? d.fact : App.g('اصنعي هذا الجرم لتكتشفي سرّه', 'اصنع هذا الجرم لتكتشف سرّه')}</small></div>`;
    }).join('');
    $('#cEncy').classList.add('on');
  }

  /* ---------- السماء الليلية ---------- */
  function skyResize() {
    sky = fitCanvas($('#cSky'));
    stars = Array.from({ length: Math.round(sky.w * sky.h / 2200) }, () => ({ x: Math.random() * sky.w, y: Math.random() * sky.h, r: Math.random() < .1 ? rand(1.2, 2.2) : rand(.3, 1.1), t: Math.random() * 6, s: rand(.5, 2.5) }));
  }
  function skyLoop(ts) {
    skyRaf = requestAnimationFrame(skyLoop);
    const t = ts / 1000, dt = Math.min(.05, t - (lastT || t)); lastT = t;
    const c = sky.ctx, { w, h } = sky;
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#05041A'); g.addColorStop(.6, '#160C3D'); g.addColorStop(1, '#2A0F4A');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    const neb = (x, y, r, col) => { const rg = c.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, col); rg.addColorStop(1, 'transparent'); c.fillStyle = rg; c.fillRect(x - r, y - r, r * 2, r * 2); };
    neb(w * .2, h * .25, w * .55, 'rgba(255,79,163,.13)'); neb(w * .85, h * .7, w * .6, 'rgba(90,120,255,.14)'); neb(w * .5, h * .95, w * .4, 'rgba(180,90,255,.12)');
    for (const s of stars) {
      c.globalAlpha = .35 + .65 * Math.abs(Math.sin(t * s.s * .6 + s.t)); c.fillStyle = '#fff'; c.beginPath(); c.arc(s.x, s.y, s.r, 0, 7); c.fill();
      if (s.r > 1.5) { c.globalAlpha *= .5; c.fillRect(s.x - s.r * 3, s.y - .4, s.r * 6, .8); c.fillRect(s.x - .4, s.y - s.r * 3, .8, s.r * 6); }
    }
    c.globalAlpha = 1;
    if (Math.random() < dt * .25) shooting.push({ x: rand(0, w), y: rand(0, h * .4), vx: rand(-500, -300), vy: rand(150, 260), life: 1 });
    for (const p of shooting) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt * (p.spark ? 1.6 : .9);
      if (p.spark) { p.vx *= .93; p.vy *= .93; c.globalAlpha = clamp(p.life / .6, 0, 1); c.fillStyle = p.hue; c.beginPath(); c.arc(p.x, p.y, 2.4, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(p.x, p.y, 1, 0, 7); c.fill(); }
      else { const gr = c.createLinearGradient(p.x, p.y, p.x - p.vx * .15, p.y - p.vy * .15); gr.addColorStop(0, `rgba(255,255,255,${clamp(p.life, 0, 1)})`); gr.addColorStop(1, 'transparent'); c.strokeStyle = gr; c.lineWidth = 2; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - p.vx * .15, p.y - p.vy * .15); c.stroke(); }
    }
    c.globalAlpha = 1; shooting = shooting.filter(p => p.life > 0);
  }

  /* ---------- الإدخال ---------- */
  let sx = null, sy = null;
  root.addEventListener('pointerdown', e => { if (e.target.closest('button,.overlay')) return; sx = e.clientX; sy = e.clientY; });
  root.addEventListener('pointerup', e => {
    if (sx == null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (target) { if (Math.hypot(dx, dy) < 20) useOn(tileAt(e)); return; }
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
    move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 2 : 0) : (dy > 0 ? 3 : 1));
  });
  root.addEventListener('pointercancel', () => sx = null);
  window.addEventListener('keydown', e => {
    if (App.current !== 'cosmos' || $('#sheetWrap').classList.contains('on')) return;
    const m = { ArrowLeft: 0, ArrowUp: 1, ArrowRight: 2, ArrowDown: 3, a: 0, w: 1, d: 2, s: 3 }[e.key];
    if (m != null) { e.preventDefault(); move(m); }
    if (e.key === 'h') hint();
  });
  const on = (id, f) => root.querySelector(id).addEventListener('click', () => { Sound.tap(); f(); });
  on('#cNew', () => { if (mode === 'classic') store.set(sfx() + 'State', null); reset(false); });
  on('#cAgain', () => { if (mode === 'classic') store.set(sfx() + 'State', null); reset(false); });
  on('#cKeep', () => { keepGoing = true; save(); $('#cOver').classList.remove('on'); });
  on('#cUndo', () => { if (busy || !hist.length || mode === 'timed') return; clearTarget(); $('#cOver').classList.remove('on'); ended = false; restore(hist.pop()); save(); });
  on('#cHint', hint);
  on('#cBomb', () => arm('bomb'));
  on('#cSwap', () => arm('swap'));
  on('#cMode', modesPanel);
  on('#cBook', encyPanel);
  on('#oX', () => $('#cModes').classList.remove('on'));
  on('#oGo', () => { $('#cModes').classList.remove('on'); N = pickN; mode = pickMode; store.set('cosmosN', N); store.set('cosmosMode', mode); reset(true); });
  on('#cEncyX', () => $('#cEncy').classList.remove('on'));
  window.addEventListener('resize', () => {
    if (App.current !== 'cosmos') return;
    skyResize(); geo = layout();
    grid.flat().forEach(t => { if (t) { t.el.style.width = t.el.style.height = geo.ts + 'px'; t.el.style.transition = 'none'; t.el.style.transform = pos(t.r, t.c); void t.el.offsetWidth; t.el.style.transition = ''; } });
  });

  App.register({
    id: 'cosmos', title: 'دمج الأجرام', icon2: '🌌', music: 'space',
    desc: () => App.g('ادمجي الكويكبات حتى تصنعي شمسًا متوهّجة', 'ادمج الكويكبات حتى تصنع شمسًا متوهّجة'),
    help: () => [
      App.g('👆 اسحبي في أي اتجاه فتتحرك كل الأجرام معًا، أو استخدمي الأسهم.', '👆 اسحب في أي اتجاه فتتحرك كل الأجرام معًا، أو استخدم الأسهم.'),
      '✨ جرمان متشابهان يندمجان: غبار ← كويكب ← مذنّب ← قمر ← كوكب ← نجم ← شمس متوهّجة!',
      '💡 التلميح يقترح أفضل حركة، 💥 القنبلة تزيل جرمًا، 🔀 التبديل يبدّل مكان جرمين. وتحصل على المزيد كل 1000 نقطة.',
      '📐 اختر حجم الشبكة (3×3 حتى 6×6) أو وضع التحدي الزمني لمدة 3 دقائق.',
      App.g('📖 كل جرم تصنعينه يفتح بطاقة في الموسوعة فيها معلومة عن الفضاء.', '📖 كل جرم تصنعه يفتح بطاقة في الموسوعة فيها معلومة عن الفضاء.')
    ],
    best() { const b = store.get('cosmosBestTile', 0); return b ? `🏆 أكبر جرم: ${CELESTIAL[lvl(b)] ? CELESTIAL[lvl(b)].name : b}` : ''; },
    enter() {
      skyResize(); N = store.get('cosmosN', 4); mode = store.get('cosmosMode', 'classic');
      reset(true); paused = false; lastT = 0; cancelAnimationFrame(skyRaf); skyRaf = requestAnimationFrame(skyLoop);
    },
    leave() { cancelAnimationFrame(skyRaf); stopTimer(); clearTarget(); ['#cOver', '#cModes', '#cEncy'].forEach(s => $(s).classList.remove('on')); },
    pause() { paused = true; }, resume() { paused = false; },
    back() {
      for (const s of ['#cModes', '#cEncy']) if ($(s).classList.contains('on')) { $(s).classList.remove('on'); return true; }
      if (target) { clearTarget(); return true; }
      return false;
    },
    icon(c) {
      const s = 152;
      IK.bg(c, s, ['#8A6BFF', '#4B2AB0', '#1B0E52'], { rays: .07, seed: 9 });
      let sd = 7; const rr = () => (sd = (sd * 9301 + 49297) % 233280) / 233280;
      for (let i = 0; i < 26; i++) { c.fillStyle = `rgba(255,255,255,${.3 + rr() * .6})`; c.beginPath(); c.arc(rr() * s, rr() * s, .6 + rr() * 1.3, 0, 7); c.fill(); }
      const ball = (c, x, y, r, a, b, d) => { const g = c.createRadialGradient(x - r * .35, y - r * .4, r * .05, x, y, r); g.addColorStop(0, a); g.addColorStop(.6, b); g.addColorStop(1, d); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
        c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.ellipse(x - r * .35, y - r * .45, r * .3, r * .17, -.5, 0, 7); c.fill(); };
      c.save(); c.globalAlpha = .55; const gl = c.createRadialGradient(96, 58, 10, 96, 58, 62); gl.addColorStop(0, '#FFD45A'); gl.addColorStop(1, 'rgba(255,160,40,0)'); c.fillStyle = gl; c.fillRect(0, 0, s, s); c.restore();
      IK.sticker(c, s, c => {
        ball(c, 96, 58, 34, '#FFF6C0', '#FFB21E', '#F06A00');
        ball(c, 46, 104, 25, '#C8F0FF', '#3A9BF0', '#1C4FB0');
        c.strokeStyle = '#7ED957'; c.lineWidth = 5; c.beginPath(); c.ellipse(46, 104, 38, 9, -.35, .15, Math.PI - .3); c.stroke();
        ball(c, 116, 118, 13, '#FFFFFF', '#D6D2C4', '#9C988A');
        ball(c, 34, 40, 9, '#FFD6F0', '#E879C4', '#A0407F');
      }, { line: 3.5, shadow: 'rgba(0,0,0,.45)' });
      IK.sparkle(c, 128, 22, 8); IK.sparkle(c, 70, 128, 6);
    }
  });
})();
