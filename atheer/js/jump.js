/* =====================================================================
   1) فارس السحاب — قفز عمودي لا نهائي
   أزرار توجيه، درع وصاروخ، طيور وغيوم رعدية وبالونات، أربعة عوالم،
   وخمس شخصيات من المتجر.
   ===================================================================== */
(() => {
  App.css(`
  #jump{background:#CFE9FF}
  #jump canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
  #jump .chip{color:#8a3a8f}
  #jump .hint{bottom:calc(max(18px,env(safe-area-inset-bottom)) + 92px);color:#8a3a8f}
  #jump .ctl{position:absolute;bottom:max(16px,env(safe-area-inset-bottom));z-index:6;width:76px;height:76px;border-radius:50%;
    background:rgba(255,255,255,.55);box-shadow:0 4px 0 rgba(138,58,143,.25),inset 0 0 0 3px rgba(255,255,255,.8);font-size:34px;display:grid;place-items:center;backdrop-filter:blur(2px)}
  #jump .ctl.on{background:rgba(255,255,255,.9);transform:translateY(3px)}
  #jump .ctl.l{left:14px} #jump .ctl.r{right:14px}
  #jump .pw{position:absolute;bottom:calc(max(16px,env(safe-area-inset-bottom)) + 10px);z-index:6;display:flex;gap:12px;left:50%;transform:translateX(-50%)}
  #jump .pw button{width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,.85);font-size:26px;position:relative;box-shadow:0 4px 0 rgba(138,58,143,.3)}
  #jump .pw button[disabled]{opacity:.38;filter:grayscale(.7)}
  #jump .pw button:not([disabled]){animation:jglow 1.2s ease-in-out infinite}
  @keyframes jglow{50%{box-shadow:0 4px 0 rgba(138,58,143,.3),0 0 0 6px rgba(255,216,77,.6)}}
  #jump .pw small{position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);background:#FFC531;color:#7a3a00;border-radius:99px;font-size:11px;font-weight:900;padding:0 6px;white-space:nowrap}
  #jump .energy{display:flex;align-items:center;gap:3px;background:rgba(255,255,255,.9);border-radius:18px;padding:6px 10px;font-weight:900;color:#E89B0C;box-shadow:0 3px 0 rgba(0,0,0,.1)}
  #jump .world{position:absolute;top:28%;left:0;right:0;text-align:center;z-index:7;pointer-events:none;opacity:0;font-size:30px;font-weight:900;color:#fff;
    text-shadow:0 3px 0 rgba(138,58,143,.5),0 0 18px rgba(255,140,198,.8)}
  #jump .world.show{animation:jworld 2.6s ease-out}
  #jump .world small{display:block;font-size:16px;opacity:.95}
  @keyframes jworld{0%{opacity:0;transform:scale(.6)}12%{opacity:1;transform:scale(1.08)}20%{transform:scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(-30px)}}
  `);
  const root = App.section('jump', `
    <canvas id="jc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib" id="jPause" aria-label="إيقاف مؤقت">⏸</button>
      <span class="grow"></span>
      <div class="energy" title="طاقة النجوم">⭐<span id="jEnergy">0</span></div>
      <div class="chip"><small>الارتفاع</small><b id="jScore">0</b></div>
      <div class="chip"><small>الأفضل</small><b id="jBest">0</b></div>
    </div>
    <div class="world" id="jWorld"></div>
    <div class="hint" id="jHint"><span id="jHintT"></span></div>
    <button class="ctl l" id="jL" aria-label="يسار">⬅️</button>
    <button class="ctl r" id="jR" aria-label="يمين">➡️</button>
    <div class="pw">
      <button id="jShield" aria-label="درع">🛡️<small>3⭐</small></button>
      <button id="jRocket" aria-label="صاروخ">🚀<small>5⭐</small></button>
    </div>
    <div class="overlay" id="jOver"><div class="panel">
      <h3 id="jOverT">سقط الفارس!</h3>
      <div class="big"><span id="jFinal">0</span> م</div>
      <p id="jOverP"></p>
      <button class="btn" id="jAgain">🔁 مرة أخرى</button>
      <button class="btn alt home">🏠 القائمة</button>
    </div></div>
    <div class="overlay" id="jPaused"><div class="panel">
      <h3>استراحة ☁️</h3><p id="jPauseP"></p>
      <button class="btn" id="jResume">▶️ متابعة</button>
      <button class="btn alt home">🏠 القائمة</button>
    </div></div>`);

  const cv = root.querySelector('#jc');
  let ctx, W, H;
  const G = 1500, JUMP_V = 760, SPRING_V = 1250, MOVE = 430, SHIELD_COST = 3, ROCKET_COST = 5;
  let knight, plats, gems, birds, balloons, parts, camY, maxH, score, best = 0, state = 'idle', raf = 0, last = 0, acc = 0;
  let energy = 0, gemsRun = 0, world = 0, flash = 0, shake = 0, hero = 'hero_knight';
  const input = { keys: { l: 0, r: 0 }, btn: 0, tilt: null, touchX: null };
  let skyStars = [], bgClouds = [];
  const PW = 92, PH = 26;
  const WORLDS = [
    { at: 0,    name: 'عالم السحاب',     sub: 'ابدأ الرحلة نحو القلعة ☁️' },
    { at: 500,  name: 'جسر قوس قزح',     sub: 'انتبه للطيور 🐦' },
    { at: 1500, name: 'قلعة الأحلام',     sub: 'وصلت إلى القلعة! 🏰' },
    { at: 3000, name: 'الفضاء الحالم',    sub: 'أعلى من النجوم 🚀' }
  ];

  function resize() {
    ({ ctx, w: W, h: H } = fitCanvas(cv));
    skyStars = Array.from({ length: 80 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: rand(.6, 1.8), t: Math.random() * 6 }));
    bgClouds = Array.from({ length: 7 }, (_, i) => ({ x: Math.random() * W, y: i * H / 6, s: rand(.6, 1.4), d: rand(.15, .35) }));
  }
  const difficulty = () => clamp(maxH / 4000, 0, 1);

  function makePlat(y, diff, prevType) {
    const r = Math.random();
    let type = 'normal';
    if (diff > .12 && r < .1 + diff * .18) type = 'move';
    else if (diff > .2 && r < .2 + diff * .2) type = 'fade';
    else if (diff > .25 && prevType !== 'storm' && r < .27 + diff * .1) type = 'storm';
    const w = PW * (1 - diff * .25);
    const p = { x: rand(8, W - w - 8), y, w, type, vx: type === 'move' ? rand(50, 90 + diff * 90) * (Math.random() < .5 ? -1 : 1) : 0, alive: true, alpha: 1, squish: 0, spring: null, zap: 0 };
    if (type === 'normal' || type === 'move') if (Math.random() < .08) p.spring = { off: rand(.2, .7), c: 0 };
    return p;
  }

  function reset() {
    best = store.get('jumpBest', 0); hero = App.equipped('hero') || 'hero_knight';
    knight = { x: W / 2 - 18, y: H - 140, vx: 0, vy: -JUMP_V, w: 36, h: 42, face: 1, squash: 0, spin: 0, shield: false, rocket: 0, carry: 0, stun: 0, balloon: null };
    plats = []; gems = []; birds = []; balloons = []; parts = [];
    camY = 0; maxH = 0; score = 0; energy = 0; gemsRun = 0; world = 0; flash = 0; shake = 0;
    plats.push({ x: W / 2 - 60, y: H - 70, w: 120, type: 'normal', vx: 0, alive: true, alpha: 1, squish: 0, spring: null, zap: 0 });
    let y = H - 70;
    while (y > -H) { y -= rand(70, 105); plats.push(makePlat(y, 0)); }
    $('#jScore').textContent = 0; $('#jBest').textContent = best; paintEnergy();
    $('#jOver').classList.remove('on'); $('#jPaused').classList.remove('on');
    $('#jHintT').textContent = App.g('المسي يمين الشاشة أو يسارها، أو استخدمي الأسهم ⬅️ ➡️', 'المس يمين الشاشة أو يسارها، أو استخدم الأسهم ⬅️ ➡️');
    $('#jHint').style.opacity = .9;
    state = 'play';
    banner(0);
  }
  function banner(i) {
    const el = $('#jWorld'), w = WORLDS[i];
    el.innerHTML = `${w.name}<small>${w.sub}</small>`;
    el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  }
  function paintEnergy() {
    $('#jEnergy').textContent = energy;
    $('#jShield').disabled = state !== 'play' || energy < SHIELD_COST || knight.shield;
    $('#jRocket').disabled = state !== 'play' || energy < ROCKET_COST || knight.rocket > 0;
  }
  function useShield() {
    if (state !== 'play' || energy < SHIELD_COST || knight.shield) return;
    energy -= SHIELD_COST; knight.shield = true; Sound.tone(520, .3, 'sine', .15, 400); Sound.tone(780, .3, 'triangle', .08, 300, .05);
    ring(knight.x + knight.w / 2, knight.y + knight.h / 2, '#9FE3FF'); paintEnergy();
  }
  function useRocket() {
    if (state !== 'play' || energy < ROCKET_COST || knight.rocket > 0) return;
    energy -= ROCKET_COST; knight.rocket = 2.4; knight.stun = 0; knight.carry = 0; knight.balloon = null;
    Sound.whoosh(); Sound.tone(200, 1.2, 'sawtooth', .05, 600); App.achieve('jump_rocket'); paintEnergy();
  }

  function step(dt) {
    const k = knight;
    // التوجيه
    let dir = input.keys.r - input.keys.l + input.btn;
    if (input.touchX != null) dir = input.touchX > W / 2 ? 1 : -1;
    if (input.tilt != null && !dir) dir = clamp(input.tilt / 18, -1, 1);
    dir = clamp(dir, -1, 1);
    if (k.stun > 0) { k.stun -= dt; dir *= .25; }
    k.vx += (dir * MOVE - k.vx) * Math.min(1, dt * 10);
    if (Math.abs(dir) > .1) k.face = dir > 0 ? 1 : -1;

    if (k.rocket > 0) {
      k.rocket -= dt; k.vy += (-1150 - k.vy) * Math.min(1, dt * 6);
      if (Math.random() < .8) parts.push({ x: k.x + k.w / 2 + rand(-6, 6), y: k.y + k.h + 4, vx: rand(-40, 40), vy: rand(150, 300), g: 0, life: .4, max: .4, r: rand(4, 8), c: Math.random() < .5 ? '#FFB21E' : '#FF6FB5' });
      if (k.rocket <= 0) k.vy = -600;
    } else if (k.carry > 0) {
      k.carry -= dt; k.vy += (-480 - k.vy) * Math.min(1, dt * 5);
      if (k.carry <= 0) { if (k.balloon) parts.push({ x: k.x + k.w / 2, y: k.y - 50, vx: 0, vy: -120, g: -60, life: 1.5, max: 1.5, r: 14, c: k.balloon, bal: true }); k.balloon = null; }
    } else k.vy += G * dt;
    k.x += k.vx * dt; k.y += k.vy * dt;
    if (k.x > W) k.x -= W + k.w; else if (k.x < -k.w) k.x += W + k.w;
    k.squash *= Math.pow(.001, dt);
    if (k.spin > 0) k.spin = Math.max(0, k.spin - dt * 2.2);
    flash = Math.max(0, flash - dt * 3); shake = Math.max(0, shake - dt * 3);

    const diff = difficulty();
    for (const p of plats) {
      if (p.type === 'move') { p.x += p.vx * dt; if (p.x < 4 || p.x + p.w > W - 4) { p.vx *= -1; p.x = clamp(p.x, 4, W - p.w - 4); } }
      if (!p.alive) p.alpha -= dt * 3;
      p.squish *= Math.pow(.0005, dt); p.zap = Math.max(0, p.zap - dt * 2);
      if (p.spring) p.spring.c *= Math.pow(.001, dt);
    }
    // الهبوط على الغيوم
    if (k.vy > 0 && k.rocket <= 0 && k.carry <= 0) {
      const feet = k.y + k.h, prev = feet - k.vy * dt, cx = k.x + k.w / 2;
      for (const p of plats) {
        if (!p.alive) continue;
        if (cx > p.x - 6 && cx < p.x + p.w + 6 && prev <= p.y + 4 && feet >= p.y - 2) {
          if (p.type === 'storm' && !k.shield) { // صعقة: يمرّ الفارس من خلالها
            if (!p.zap) { p.zap = 1; flash = .6; shake = .5; k.stun = .6; Sound.boom(); vibrate(40); spark(cx, p.y, '#FFE45C', 12); }
            continue;
          }
          if (p.type === 'storm') { k.shield = false; p.type = 'normal'; Sound.poof(); ring(cx, p.y, '#9FE3FF'); paintEnergy(); }
          k.y = p.y - k.h;
          if (p.spring && cx > p.x + p.w * p.spring.off - 18 && cx < p.x + p.w * p.spring.off + 18) {
            k.vy = -SPRING_V; p.spring.c = 1; k.spin = 1; Sound.spring(); spark(cx, p.y, '#FFD84D', 10);
          } else { k.vy = -JUMP_V; Sound.jump(); }
          k.squash = 1; p.squish = 1; puff(cx, p.y);
          if (p.type === 'fade') { p.alive = false; Sound.poof(); }
          break;
        }
      }
    }
    const kcx = k.x + k.w / 2, kcy = k.y + k.h / 2;
    // نجوم الطاقة
    for (const g of gems) {
      if (g.got) continue;
      if (Math.abs(kcx - g.x) < 30 && Math.abs(kcy - g.y) < 32) { g.got = true; energy++; gemsRun++; Sound.star(); spark(g.x, g.y, '#FFD84D', 14); paintEnergy(); }
    }
    // الطيور
    for (const b of birds) {
      b.x += b.vx * dt; b.flap += dt * 12;
      if (b.x < 10 || b.x > W - 10) { b.vx *= -1; b.x = clamp(b.x, 10, W - 10); }
      if (!b.hit && Math.abs(kcx - b.x) < 28 && Math.abs(kcy - b.y) < 24) {
        b.hit = true;
        if (k.rocket > 0) { Sound.poof(); feathers(b.x, b.y); b.gone = true; }
        else if (k.shield) { k.shield = false; Sound.poof(); feathers(b.x, b.y); b.gone = true; ring(kcx, kcy, '#9FE3FF'); paintEnergy(); }
        else { k.vy = Math.max(k.vy, 250); k.stun = .7; k.carry = 0; k.balloon = null; Sound.error(); vibrate(30); feathers(b.x, b.y); shake = .4; }
      }
    }
    // البالونات
    for (const b of balloons) {
      if (b.got) continue;
      b.t += dt;
      if (Math.abs(kcx - b.x) < 30 && Math.abs(kcy - (b.y + Math.sin(b.t * 2) * 6)) < 40 && k.rocket <= 0) {
        b.got = true; k.carry = 1.6; k.balloon = b.c; k.stun = 0; Sound.tone(500, .5, 'sine', .14, 500); spark(b.x, b.y, b.c, 8);
      }
    }

    // الكاميرا
    const line = H * .42;
    if (k.y - camY < line) camY = k.y - line;
    const h = Math.max(0, Math.round((H - 140 - k.y) / 10));
    if (h > maxH) maxH = h;
    if (maxH !== score) {
      score = maxH; $('#jScore').textContent = score;
      if (score > 30) $('#jHint').style.opacity = 0;
      if (score >= 100) App.achieve('jump_100');
      if (score >= 1500) App.achieve('jump_castle');
      if (score >= 3000) App.achieve('jump_space');
      const wi = WORLDS.reduce((a, w, i) => score >= w.at ? i : a, 0);
      if (wi > world) { world = wi; banner(wi); Sound.win(); }
    }

    // توليد المحتوى فوق الشاشة
    let top = Math.min(...plats.map(p => p.y));
    while (top > camY - 120) {
      const gap = rand(72, 92 + diff * 60);
      top -= gap;
      const prev = plats[plats.length - 1];
      plats.push(makePlat(top, diff, prev && prev.type));
      // ضمان طريق ممكن: منصة صلبة كل ثلاث
      const last3 = plats.slice(-3);
      if (!last3.some(p => p.type === 'normal' || p.type === 'move')) plats[plats.length - 1].type = 'normal';
      if (Math.random() < .09) gems.push({ x: rand(30, W - 30), y: top - rand(30, 50), t: Math.random() * 6, got: false });
      if (diff > .12 && Math.random() < .035 + diff * .05 && !birds.some(b => Math.abs(b.y - top) < 200))
        birds.push({ x: rand(30, W - 30), y: top - 40, vx: rand(70, 120 + diff * 80) * (Math.random() < .5 ? -1 : 1), flap: 0, hit: false });
      if (Math.random() < .025) balloons.push({ x: rand(40, W - 40), y: top - 50, c: ['#FF6FB5', '#7FD0FF', '#FFD84D', '#B28BFF'][Math.random() * 4 | 0], t: Math.random() * 6, got: false });
    }
    const below = camY + H + 60;
    plats = plats.filter(p => p.y < below && p.alpha > 0);
    gems = gems.filter(g => g.y < below && !g.got);
    birds = birds.filter(b => b.y < below && !b.gone);
    balloons = balloons.filter(b => b.y < below && !b.got);

    for (const q of parts) { q.x += q.vx * dt; q.y += q.vy * dt; q.vy += q.g * dt; q.life -= dt; if (q.rot != null) q.rot += dt * 6; }
    parts = parts.filter(q => q.life > 0);

    // السقوط
    if (k.y - camY > H + 40) {
      if (k.shield) { // الدرع ينقذ الفارس مرة واحدة
        k.shield = false; k.vy = -SPRING_V * 1.15; k.y = camY + H + 30; k.spin = 1; Sound.spring(); ring(kcx, camY + H - 20, '#9FE3FF');
        App.toast(App.g('🛡️ أنقذكِ الدرع!', '🛡️ أنقذك الدرع!')); paintEnergy();
      } else gameOver();
    }
  }

  function puff(x, y) { for (let i = 0; i < 6; i++) parts.push({ x: x + rand(-20, 20), y, vx: rand(-60, 60), vy: rand(-40, 10), g: 0, life: .45, max: .45, r: rand(5, 9), c: '#fff' }); }
  function spark(x, y, c, n) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = rand(80, 220); parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 300, life: .7, max: .7, r: rand(2, 4), c, star: true }); } }
  function feathers(x, y) { for (let i = 0; i < 9; i++) parts.push({ x, y, vx: rand(-90, 90), vy: rand(-120, 20), g: 160, life: 1.1, max: 1.1, r: 5, c: '#fff', feather: true, rot: Math.random() * 6 }); }
  function ring(x, y, c) { parts.push({ x, y, vx: 0, vy: 0, g: 0, life: .5, max: .5, r: 30, c, ring: true }); }

  function gameOver() {
    state = 'over'; Sound.fall(); vibrate(120); paintEnergy();
    const isBest = score > best;
    if (isBest) { best = score; store.set('jumpBest', best); }
    $('#jBest').textContent = best; $('#jFinal').textContent = score;
    $('#jOverT').textContent = isBest && score > 0 ? '🏆 رقم قياسي جديد!' : 'سقط البطل! ☁️';
    $('#jOverP').textContent = (score < 500 ? App.g('القلعة تنتظرك في الأعلى — حاولي مرة أخرى!', 'القلعة تنتظرك في الأعلى — حاول مرة أخرى!')
      : score < 1500 ? 'رائع! القلعة تقترب 🏰' : score < 3000 ? App.g('مذهل! أنتِ فارسة السماء 👑', 'مذهل! أنت فارس السماء 🛡️') : 'أسطوري! وصلت إلى الفضاء 🚀')
      + (gemsRun ? ` • جمعت ${gemsRun} ⭐` : '');
    const reward = gemsRun + (isBest && score > 200 ? 3 : 0);
    setTimeout(() => { $('#jOver').classList.add('on'); if (reward) App.addStars(reward); }, 450);
  }

  /* ---------- الرسم ---------- */
  function mix(a, b, t) {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = (pa >> 16) + (((pb >> 16) - (pa >> 16)) * t), g = ((pa >> 8) & 255) + ((((pb >> 8) & 255) - ((pa >> 8) & 255)) * t), bl = (pa & 255) + (((pb & 255) - (pa & 255)) * t);
    return `rgb(${r | 0},${g | 0},${bl | 0})`;
  }
  function skyColors(h) {
    const stops = [[0, ['#BFE4FF', '#FFE1F0']], [500, ['#D2C8FF', '#FFE6F4']], [1500, ['#FFB7D5', '#FFE3B0']], [2400, ['#8E7BE0', '#FFB8D9']], [3000, ['#2A1D63', '#7A4CB8']], [5000, ['#0E0A2E', '#3A2470']]];
    let i = 0; while (i < stops.length - 2 && h > stops[i + 1][0]) i++;
    const [h0, c0] = stops[i], [h1, c1] = stops[i + 1], t = clamp((h - h0) / (h1 - h0), 0, 1);
    return [mix(c0[0], c1[0], t), mix(c0[1], c1[1], t)];
  }
  function cloudShape(c, x, y, w, h) {
    c.beginPath(); c.moveTo(x + h * .5, y + h);
    c.arc(x + h * .5, y + h * .5, h * .5, Math.PI * .5, Math.PI * 1.5);
    c.arc(x + w * .3, y + h * .15, h * .55, Math.PI, Math.PI * 1.85);
    c.arc(x + w * .62, y + h * .05, h * .62, Math.PI * 1.1, Math.PI * 1.95);
    c.arc(x + w - h * .5, y + h * .5, h * .5, Math.PI * 1.5, Math.PI * .5);
    c.closePath();
  }
  function drawRainbow(c) {
    const a = clamp((maxH - 300) / 300, 0, 1) * clamp((1900 - maxH) / 500, 0, 1); if (a <= 0) return;
    const cols = ['#FF8FB1', '#FFB86B', '#FFE46B', '#8EE68E', '#7FD0FF', '#B28BFF'];
    c.save(); c.globalAlpha = a * .55; c.lineWidth = Math.min(W, 500) * .035;
    cols.forEach((col, i) => { c.strokeStyle = col; c.beginPath(); c.arc(W / 2, H * .75, Math.min(W, 500) * (.62 - i * .036), Math.PI, 0); c.stroke(); });
    c.restore();
  }
  function drawCastle(c, t) {
    const prog = clamp(maxH / 1500, 0, 1), beyond = Math.max(0, maxH - 1500);
    const s = (.5 + prog * .95) * Math.min(W, 520) / 400;
    const cx = W / 2, by = H * (.42 - prog * .1) + beyond * .35 + Math.sin(t * .6) * 4;
    if (by - 300 * s > H) return;
    c.save(); c.translate(cx, by); c.scale(s, s);
    c.globalAlpha = (.5 + prog * .45) * clamp(1 - beyond / 1600, .15, 1);
    c.fillStyle = 'rgba(255,255,255,.9)'; cloudShape(c, -150, 30, 300, 46); c.fill();
    const wall = '#FFF3FA', shade = '#F6D3E8';
    function tower(x, w, h, r) {
      c.fillStyle = wall; c.fillRect(x - w / 2, 40 - h, w, h);
      c.fillStyle = shade; c.fillRect(x + w / 4, 40 - h, w / 4, h);
      c.fillStyle = r; c.beginPath(); c.moveTo(x - w / 2 - 6, 40 - h); c.lineTo(x, 40 - h - w * 1.3); c.lineTo(x + w / 2 + 6, 40 - h); c.closePath(); c.fill();
      c.fillStyle = '#FFD84D'; c.beginPath(); c.arc(x, 40 - h - w * 1.3, 3.5, 0, 7); c.fill();
      c.fillStyle = maxH > 1300 ? '#FFE680' : '#B78BE8'; c.beginPath(); c.arc(x, 40 - h + 22, w * .14, Math.PI, 0); c.fillRect(x - w * .14, 40 - h + 22, w * .28, 12); c.fill();
    }
    tower(-95, 34, 120, '#C98BF0'); tower(95, 34, 120, '#C98BF0');
    tower(-50, 40, 165, '#FF8CC6'); tower(50, 40, 165, '#FF8CC6');
    tower(0, 54, 215, '#FF6FB5');
    c.fillStyle = wall; c.fillRect(-110, -20, 220, 60);
    for (let i = -110; i < 110; i += 20) c.fillRect(i, -30, 12, 12);
    c.fillStyle = '#C98BF0'; c.beginPath(); c.arc(0, 40, 20, Math.PI, 0); c.lineTo(20, 40); c.fill();
    c.strokeStyle = '#B07BD8'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -245); c.lineTo(0, -275); c.stroke();
    c.fillStyle = '#FF4FA3'; c.beginPath(); c.moveTo(0, -275); c.quadraticCurveTo(14 + Math.sin(t * 4) * 4, -270, 26, -266); c.lineTo(0, -258); c.fill();
    c.restore();
  }
  function drawPlat(c, p, t) {
    const y = p.y - camY, sq = p.squish * 5, h = PH - sq * .4;
    c.save(); c.globalAlpha = clamp(p.alpha, 0, 1);
    c.fillStyle = 'rgba(160,110,200,.18)'; cloudShape(c, p.x + 4, y + 8 + sq, p.w - 8, h * .8); c.fill();
    let top = '#FFFFFF', bot = '#FFE1F1';
    if (p.type === 'move') bot = '#D9EDFF';
    if (p.type === 'fade') { top = 'rgba(255,255,255,.85)'; bot = 'rgba(255,214,236,.6)'; }
    if (p.type === 'storm') { top = p.zap ? '#FFF7C2' : '#9C98B8'; bot = '#5E5A7A'; }
    const gr = c.createLinearGradient(0, y - h * .5, 0, y + h); gr.addColorStop(0, top); gr.addColorStop(1, bot);
    c.fillStyle = gr; cloudShape(c, p.x, y + sq, p.w, h); c.fill();
    if (p.type === 'fade') { c.setLineDash([5, 5]); c.strokeStyle = 'rgba(255,140,198,.8)'; c.lineWidth = 1.6; c.stroke(); c.setLineDash([]); }
    if (p.type !== 'storm') { c.fillStyle = 'rgba(255,255,255,.9)'; c.beginPath(); c.ellipse(p.x + p.w * .32, y + sq + 2, p.w * .12, 3, 0, 0, 7); c.fill(); }
    const fx = p.x + p.w / 2, fy = y + sq + h * .45;
    if (p.type === 'move') {
      c.strokeStyle = '#7A4A8A'; c.lineWidth = 1.6; c.lineCap = 'round';
      c.beginPath(); c.arc(fx - 9, fy, 2.6, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
      c.beginPath(); c.arc(fx + 9, fy, 2.6, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
      c.beginPath(); c.arc(fx, fy + 3, 3, .2, Math.PI - .2); c.stroke();
      c.fillStyle = 'rgba(255,140,180,.6)'; c.beginPath(); c.arc(fx - 15, fy + 4, 3, 0, 7); c.arc(fx + 15, fy + 4, 3, 0, 7); c.fill();
    }
    if (p.type === 'storm') { // وجه غاضب + برق
      c.strokeStyle = '#2E2A44'; c.lineWidth = 2; c.lineCap = 'round';
      c.beginPath(); c.moveTo(fx - 13, fy - 4); c.lineTo(fx - 6, fy - 1); c.moveTo(fx + 13, fy - 4); c.lineTo(fx + 6, fy - 1); c.stroke();
      c.beginPath(); c.arc(fx, fy + 7, 4, Math.PI + .3, -.3); c.stroke();
      const flick = (Math.sin(t * 9 + p.x) > .6) || p.zap > 0;
      c.fillStyle = flick ? '#FFE45C' : 'rgba(255,228,92,.55)';
      c.beginPath(); c.moveTo(fx - 4, y + sq + h + 2); c.lineTo(fx + 4, y + sq + h + 2); c.lineTo(fx, y + sq + h + 11); c.lineTo(fx + 6, y + sq + h + 11); c.lineTo(fx - 4, y + sq + h + 24); c.lineTo(fx - 1, y + sq + h + 13); c.lineTo(fx - 6, y + sq + h + 13); c.closePath(); c.fill();
    }
    if (p.spring) {
      const sx = p.x + p.w * p.spring.off, sy = y + sq - 2, ext = p.spring.c * 12;
      c.strokeStyle = '#C98BF0'; c.lineWidth = 3; c.beginPath();
      for (let i = 0; i <= 4; i++) c.lineTo(sx + (i % 2 ? 6 : -6), sy - i * (3 + ext / 4));
      c.stroke();
      c.fillStyle = '#FF4FA3'; c.beginPath(); c.ellipse(sx, sy - 14 - ext, 11, 4.5, 0, 0, 7); c.fill();
    }
    c.restore();
  }
  function drawBird(c, b, t) {
    const y = b.y - camY, f = Math.sin(b.flap) * 8;
    c.save(); c.translate(b.x, y); c.scale(b.vx > 0 ? 1 : -1, 1);
    c.fillStyle = '#6EC6FF'; c.beginPath(); c.ellipse(0, 0, 14, 10, 0, 0, 7); c.fill();
    c.fillStyle = '#A8E0FF'; c.beginPath(); c.moveTo(-4, -2); c.quadraticCurveTo(-2, -16 - f, 8, -6 - f * .5); c.closePath(); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(7, -3, 4, 0, 7); c.fill();
    c.fillStyle = '#222'; c.beginPath(); c.arc(8, -3, 2, 0, 7); c.fill();
    c.fillStyle = '#FFB21E'; c.beginPath(); c.moveTo(12, 0); c.lineTo(19, 2); c.lineTo(12, 4); c.fill();
    c.fillStyle = '#4AA8E8'; c.beginPath(); c.moveTo(-13, 0); c.lineTo(-20, -5); c.lineTo(-19, 5); c.fill();
    c.restore();
  }
  function drawBalloon(c, x, y, col, t) {
    c.save(); c.strokeStyle = 'rgba(120,80,140,.6)'; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(x, y + 18); c.quadraticCurveTo(x + Math.sin(t * 3) * 5, y + 34, x, y + 48); c.stroke();
    const g = c.createRadialGradient(x - 5, y - 6, 2, x, y, 20); g.addColorStop(0, '#fff'); g.addColorStop(.25, col); g.addColorStop(1, col);
    c.fillStyle = g; c.beginPath(); c.ellipse(x, y, 15, 18, 0, 0, 7); c.fill();
    c.fillStyle = col; c.beginPath(); c.moveTo(x - 3, y + 18); c.lineTo(x + 3, y + 18); c.lineTo(x, y + 22); c.fill();
    c.restore();
  }
  function drawStar(c, x, y, r, fill, stroke, rot) {
    c.save(); c.translate(x, y); c.rotate(rot * .3); c.beginPath();
    for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * .45 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    c.closePath(); c.fillStyle = fill; c.fill(); if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.5; c.stroke(); }
    c.restore();
  }

  /* ---------- الشخصيات (تُرسم حول المركز، القدمان عند y≈+21) ---------- */
  function drawHero(c, id, t) {
    const sway = Math.sin(t * 10);
    const eye = (x, y) => { c.fillStyle = '#3A2048'; c.beginPath(); c.arc(x, y, 1.9, 0, 7); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x + .6, y - .6, .6, 0, 7); c.fill(); };
    const blush = (x, y) => { c.fillStyle = 'rgba(255,120,170,.55)'; c.beginPath(); c.arc(x, y, 2.2, 0, 7); c.fill(); };
    if (id === 'hero_princess') {
      c.fillStyle = '#7A4A2A'; c.beginPath(); c.ellipse(-3, -8, 13, 15, 0, 0, 7); c.fill(); // شعر طويل
      const dress = c.createLinearGradient(0, -4, 0, 22); dress.addColorStop(0, '#FF8CC6'); dress.addColorStop(1, '#E0217F');
      c.fillStyle = dress; c.beginPath(); c.moveTo(-7, -4); c.lineTo(7, -4); c.lineTo(14 + sway, 20); c.lineTo(-14 + sway, 20); c.closePath(); c.fill();
      c.fillStyle = '#fff'; for (let i = -10; i <= 10; i += 5) { c.beginPath(); c.arc(i + sway * .8, 20, 2.5, 0, Math.PI); c.fill(); }
      c.fillStyle = '#FFE0CC'; c.beginPath(); c.arc(0, -12, 10, 0, 7); c.fill();
      c.fillStyle = '#7A4A2A'; c.beginPath(); c.arc(0, -15, 10, Math.PI * 1.05, Math.PI * 1.95); c.fill();
      eye(4, -12); blush(7, -8);
      c.fillStyle = '#FFC531'; c.beginPath(); c.moveTo(-7, -21); c.lineTo(-7, -27); c.lineTo(-3, -23); c.lineTo(0, -29); c.lineTo(3, -23); c.lineTo(7, -27); c.lineTo(7, -21); c.closePath(); c.fill();
      c.fillStyle = '#FF4FA3'; c.beginPath(); c.arc(0, -25, 1.6, 0, 7); c.fill();
      c.strokeStyle = '#C98BF0'; c.lineWidth = 2; c.beginPath(); c.moveTo(10, 2); c.lineTo(17, -12); c.stroke();
      drawStar(c, 17, -14, 5, '#FFD84D', null, t * 3);
    } else if (id === 'hero_bunny') {
      c.fillStyle = '#fff'; c.beginPath(); c.ellipse(-6, -28, 4.5, 12, -.25 + sway * .05, 0, 7); c.ellipse(5, -29, 4.5, 12, .2 - sway * .05, 0, 7); c.fill();
      c.fillStyle = '#FFB3D4'; c.beginPath(); c.ellipse(-6, -28, 2, 8, -.25, 0, 7); c.ellipse(5, -29, 2, 8, .2, 0, 7); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.ellipse(0, 8, 13, 13, 0, 0, 7); c.fill();
      c.beginPath(); c.arc(0, -12, 12, 0, 7); c.fill();
      c.strokeStyle = 'rgba(200,160,190,.6)'; c.lineWidth = 1; c.beginPath(); c.arc(0, -12, 12, 0, 7); c.stroke();
      eye(5, -13); blush(8, -8);
      c.fillStyle = '#FF8CC6'; c.beginPath(); c.arc(10, -10, 1.8, 0, 7); c.fill();
      c.fillStyle = '#FFE0F0'; c.beginPath(); c.ellipse(-6, 20, 6, 3, 0, 0, 7); c.ellipse(6, 20, 6, 3, 0, 0, 7); c.fill();
      c.fillStyle = '#FF9F1C'; c.beginPath(); c.moveTo(10, 4); c.lineTo(18, 0); c.lineTo(14, 10); c.fill();
      c.fillStyle = '#6CC24A'; c.beginPath(); c.ellipse(19, -1, 3, 1.5, -.6, 0, 7); c.fill();
    } else if (id === 'hero_cat') {
      c.strokeStyle = '#F08A3C'; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.moveTo(-10, 12); c.quadraticCurveTo(-24, 6 + sway * 3, -18, -6); c.stroke();
      c.fillStyle = '#FFA75C'; c.beginPath(); c.ellipse(0, 8, 12, 12, 0, 0, 7); c.fill();
      c.beginPath(); c.arc(0, -12, 12, 0, 7); c.fill();
      c.beginPath(); c.moveTo(-11, -16); c.lineTo(-8, -28); c.lineTo(-2, -21); c.fill(); c.beginPath(); c.moveTo(11, -16); c.lineTo(8, -28); c.lineTo(2, -21); c.fill();
      c.fillStyle = '#FFD7B0'; c.beginPath(); c.ellipse(0, 9, 7, 8, 0, 0, 7); c.fill(); c.beginPath(); c.ellipse(5, -8, 6, 4.5, 0, 0, 7); c.fill();
      c.strokeStyle = '#E07A2C'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-5, -23); c.lineTo(-4, -18); c.moveTo(0, -24); c.lineTo(0, -19); c.stroke();
      eye(5, -13); c.fillStyle = '#FF6FA0'; c.beginPath(); c.arc(9, -9, 1.6, 0, 7); c.fill();
      c.strokeStyle = 'rgba(80,40,20,.6)'; c.lineWidth = .8; c.beginPath(); c.moveTo(9, -8); c.lineTo(17, -10); c.moveTo(9, -7); c.lineTo(17, -6); c.stroke();
      c.fillStyle = '#FF4FA3'; c.fillRect(-8, -3, 16, 3); c.fillStyle = '#FFC531'; c.beginPath(); c.arc(0, 1, 2.2, 0, 7); c.fill();
      c.fillStyle = '#FFD7B0'; c.beginPath(); c.ellipse(-6, 20, 5, 3, 0, 0, 7); c.ellipse(6, 20, 5, 3, 0, 0, 7); c.fill();
    } else if (id === 'hero_astro') {
      c.fillStyle = '#C9D3EC'; c.fillRect(-15, -4, 6, 16); // حقيبة
      c.fillStyle = '#F4F7FF'; c.beginPath(); c.roundRect(-11, -4, 22, 20, 7); c.fill();
      c.fillStyle = '#FF6FB5'; c.fillRect(-11, 4, 22, 3);
      c.fillStyle = '#5BC0FF'; c.beginPath(); c.arc(4, 5, 2, 0, 7); c.fill();
      c.fillStyle = '#E3E9F7'; c.fillRect(-9, 14, 7, 8); c.fillRect(2, 14, 7, 8);
      const hg = c.createRadialGradient(-4, -16, 2, 0, -12, 15); hg.addColorStop(0, '#fff'); hg.addColorStop(1, '#C9D3EC');
      c.fillStyle = hg; c.beginPath(); c.arc(0, -12, 14, 0, 7); c.fill();
      const vg = c.createLinearGradient(0, -20, 10, -4); vg.addColorStop(0, '#2B3A7A'); vg.addColorStop(1, '#5A3AA8');
      c.fillStyle = vg; c.beginPath(); c.ellipse(4, -11, 9, 7.5, 0, 0, 7); c.fill();
      c.fillStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.ellipse(1, -14, 3, 1.6, -.5, 0, 7); c.fill();
      c.strokeStyle = '#C9D3EC'; c.lineWidth = 2; c.beginPath(); c.moveTo(-6, -25); c.lineTo(-8, -32); c.stroke();
      c.fillStyle = '#FF4FA3'; c.beginPath(); c.arc(-8, -33, 2.6, 0, 7); c.fill();
    } else { // الفارس
      c.fillStyle = '#FF6FB5';
      c.beginPath(); c.moveTo(-8, -6); c.quadraticCurveTo(-24 - sway * 3, 8, -18, 20 + Math.sin(t * 9) * 2); c.lineTo(4, 14); c.closePath(); c.fill();
      c.fillStyle = '#9AA6C8'; c.fillRect(-9, 12, 7, 9); c.fillRect(2, 12, 7, 9);
      c.fillStyle = '#7A6AA8'; c.fillRect(-10, 19, 9, 4); c.fillRect(1, 19, 9, 4);
      const body = c.createLinearGradient(-12, 0, 12, 0); body.addColorStop(0, '#E3E9FF'); body.addColorStop(1, '#AEB9DE');
      c.fillStyle = body; c.beginPath(); c.roundRect(-12, -4, 24, 19, 7); c.fill();
      c.fillStyle = '#FFD84D'; c.beginPath(); c.moveTo(0, 1); c.lineTo(3, 6); c.lineTo(0, 11); c.lineTo(-3, 6); c.fill();
      const helm = c.createRadialGradient(-4, -16, 2, 0, -12, 15); helm.addColorStop(0, '#FFFFFF'); helm.addColorStop(1, '#B9C3E6');
      c.fillStyle = helm; c.beginPath(); c.arc(0, -12, 13, 0, Math.PI * 2); c.fill();
      c.fillStyle = '#FFE4D2'; c.beginPath(); c.roundRect(-3, -15, 15, 10, 4); c.fill();
      eye(6, -10); blush(9, -7);
      c.strokeStyle = '#8E98C2'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-3, -15); c.lineTo(12, -15); c.stroke();
      c.fillStyle = '#FF4FA3'; c.beginPath(); c.moveTo(-2, -24); c.quadraticCurveTo(-18, -34 + sway * 2, -16, -18); c.quadraticCurveTo(-10, -24, -2, -24); c.fill();
      c.fillStyle = '#FFC531'; c.beginPath(); c.moveTo(-6, -24); c.lineTo(-6, -29); c.lineTo(-3, -26); c.lineTo(0, -31); c.lineTo(3, -26); c.lineTo(6, -29); c.lineTo(6, -24); c.closePath(); c.fill();
      c.save(); c.translate(13, 4); c.rotate(-.6 + Math.sin(t * 6) * .1);
      c.fillStyle = '#EEF2FF'; c.fillRect(-1.5, -18, 4, 16); c.fillStyle = '#FFC531'; c.fillRect(-4, -3, 10, 3); c.fillStyle = '#B07B4A'; c.fillRect(-.5, 0, 2.5, 5);
      c.restore();
    }
  }
  function drawKnight(c, t) {
    const k = knight, x = k.x + k.w / 2, y = k.y - camY + k.h / 2;
    const sq = k.squash * .22, stretch = clamp(-k.vy / 3000, -.08, .12);
    if (k.balloon) drawBalloon(c, x + 6, y - 62, k.balloon, t);
    c.save(); c.translate(x, y + k.h / 2); c.scale(k.face * (1 + sq - stretch), 1 - sq + stretch); c.translate(0, -k.h / 2);
    if (k.spin) c.rotate((1 - k.spin) * Math.PI * 2 * k.face);
    if (k.stun > 0) c.rotate(Math.sin(t * 30) * .15);
    if (k.rocket > 0) { // نار الصاروخ
      const fl = 14 + Math.sin(t * 40) * 5;
      const g = c.createLinearGradient(0, 20, 0, 20 + fl * 2); g.addColorStop(0, '#FFF6B0'); g.addColorStop(.4, '#FFB21E'); g.addColorStop(1, 'rgba(255,79,163,0)');
      c.fillStyle = g; c.beginPath(); c.moveTo(-9, 20); c.quadraticCurveTo(0, 20 + fl * 2.4, 9, 20); c.fill();
      c.fillStyle = '#E3E9FF'; c.beginPath(); c.roundRect(-8, 8, 16, 14, 4); c.fill();
    }
    drawHero(c, hero, t);
    c.restore();
    if (k.shield) {
      c.save(); c.globalAlpha = .55 + Math.sin(t * 5) * .15;
      const g = c.createRadialGradient(x - 8, y - 10, 4, x, y, 34); g.addColorStop(0, 'rgba(255,255,255,.1)'); g.addColorStop(.8, 'rgba(159,227,255,.35)'); g.addColorStop(1, 'rgba(120,200,255,.9)');
      c.fillStyle = g; c.beginPath(); c.arc(x, y, 34, 0, 7); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 2; c.beginPath(); c.arc(x, y, 34, -2.4, -1.6); c.stroke();
      c.restore();
    }
    if (k.stun > 0) for (let i = 0; i < 3; i++) { const a = t * 6 + i * 2.1; drawStar(c, x + Math.cos(a) * 16, y - 34 + Math.sin(a) * 4, 4, '#FFD84D', null, t); }
  }

  function draw(t) {
    const c = ctx;
    c.save();
    if (shake) c.translate(rand(-1, 1) * shake * 8, rand(-1, 1) * shake * 8);
    const [top, bottom] = skyColors(maxH);
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bottom);
    c.fillStyle = g; c.fillRect(-10, -10, W + 20, H + 20);
    const starA = clamp((maxH - 2200) / 1200, 0, 1);
    if (starA > 0) {
      for (const s of skyStars) {
        const yy = ((s.y - camY * .05) % H + H) % H;
        c.globalAlpha = starA * (.5 + .5 * Math.sin(t * 2 + s.t)); c.fillStyle = '#fff';
        c.beginPath(); c.arc(s.x, yy, s.r, 0, 7); c.fill();
      }
      c.globalAlpha = 1;
      if (maxH > 3000) { // كواكب بعيدة
        c.globalAlpha = clamp((maxH - 3000) / 600, 0, .9);
        const pg = c.createRadialGradient(W * .2, H * .25, 4, W * .2, H * .25, 30); pg.addColorStop(0, '#FFE3A3'); pg.addColorStop(1, '#C98B3A');
        c.fillStyle = pg; c.beginPath(); c.arc(W * .2, H * .25, 26, 0, 7); c.fill();
        c.strokeStyle = 'rgba(255,230,170,.8)'; c.lineWidth = 3; c.beginPath(); c.ellipse(W * .2, H * .25, 42, 9, -.3, 0, 7); c.stroke();
        c.globalAlpha = 1;
      }
    }
    c.fillStyle = maxH > 2200 ? 'rgba(255,250,220,.85)' : 'rgba(255,240,200,.75)';
    c.beginPath(); c.arc(W * .82, H * .14, 26, 0, 7); c.fill();
    drawRainbow(c);
    drawCastle(c, t);
    for (const b of bgClouds) {
      const yy = ((b.y - camY * b.d) % (H + 120) + (H + 120)) % (H + 120) - 60;
      c.fillStyle = maxH > 2600 ? 'rgba(200,180,255,.18)' : 'rgba(255,255,255,.45)'; cloudShape(c, b.x - 60 * b.s, yy, 140 * b.s, 34 * b.s); c.fill();
    }
    for (const p of plats) if (p.y - camY > -40 && p.y - camY < H + 40) drawPlat(c, p, t);
    for (const gm of gems) drawStar(c, gm.x, gm.y - camY + Math.sin(t * 3 + gm.t) * 4, 11, '#FFD84D', '#E89B0C', t + gm.t);
    for (const b of balloons) drawBalloon(c, b.x, b.y - camY + Math.sin(b.t * 2) * 6, b.c, t);
    for (const b of birds) drawBird(c, b, t);
    if (knight) drawKnight(c, t);
    for (const q of parts) {
      const a = clamp(q.life / q.max, 0, 1); c.globalAlpha = a; c.fillStyle = q.c;
      if (q.star) drawStar(c, q.x, q.y - camY, q.r * 1.6, q.c, null, 0);
      else if (q.ring) { c.strokeStyle = q.c; c.lineWidth = 4 * a; c.beginPath(); c.arc(q.x, q.y - camY, q.r + (1 - a) * 40, 0, 7); c.stroke(); }
      else if (q.feather) { c.save(); c.translate(q.x, q.y - camY); c.rotate(q.rot); c.fillStyle = '#EAF6FF'; c.beginPath(); c.ellipse(0, 0, 6, 2.5, 0, 0, 7); c.fill(); c.restore(); }
      else if (q.bal) drawBalloon(c, q.x, q.y - camY, q.c, t);
      else { c.beginPath(); c.arc(q.x, q.y - camY, q.r * (1.4 - a * .4), 0, 7); c.fill(); }
    }
    c.globalAlpha = 1;
    c.restore();
    if (flash) { c.fillStyle = `rgba(255,250,200,${flash * .5})`; c.fillRect(0, 0, W, H); }
  }

  function loop(ts) {
    raf = requestAnimationFrame(loop);
    const now = ts / 1000, dt = Math.min(.05, now - (last || now)); last = now;
    if (state === 'play') { acc += dt; while (acc >= 1 / 120) { step(1 / 120); acc -= 1 / 120; } }
    draw(now);
  }

  /* ---------- التحكم ---------- */
  function ptr(e) { if (state !== 'play') return; input.touchX = e.clientX; }
  cv.addEventListener('pointerdown', ptr);
  cv.addEventListener('pointermove', e => { if (input.touchX != null) ptr(e); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => cv.addEventListener(n, () => input.touchX = null));
  [['#jL', -1], ['#jR', 1]].forEach(([sel, d]) => {
    const b = root.querySelector(sel);
    b.addEventListener('pointerdown', e => { e.preventDefault(); input.btn = d; b.classList.add('on'); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => b.addEventListener(n, () => { if (input.btn === d) input.btn = 0; b.classList.remove('on'); }));
  });
  root.querySelector('#jShield').addEventListener('click', useShield);
  root.querySelector('#jRocket').addEventListener('click', useRocket);
  window.addEventListener('keydown', e => {
    if (App.current !== 'jump') return;
    if (e.key === 'ArrowLeft' || e.key === 'a') input.keys.l = 1;
    if (e.key === 'ArrowRight' || e.key === 'd') input.keys.r = 1;
    if (e.key === 's' || e.key === 'ArrowDown') useShield();
    if (e.key === 'w' || e.key === 'ArrowUp') useRocket();
    if ((e.key === ' ' || e.key === 'Enter') && state === 'over') reset();
    if (e.key === 'Escape' || e.key === 'p') togglePause();
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft' || e.key === 'a') input.keys.l = 0;
    if (e.key === 'ArrowRight' || e.key === 'd') input.keys.r = 0;
  });
  window.addEventListener('deviceorientation', e => { if (e.gamma != null && App.current === 'jump') input.tilt = e.gamma; });
  function togglePause() {
    if (state === 'play') { state = 'pause'; $('#jPauseP').textContent = App.g('البطل ينتظرك', 'البطل ينتظرك'); $('#jPaused').classList.add('on'); }
    else if (state === 'pause') { state = 'play'; last = 0; $('#jPaused').classList.remove('on'); }
  }
  root.querySelector('#jPause').addEventListener('click', () => { Sound.tap(); togglePause(); });
  root.querySelector('#jResume').addEventListener('click', () => { Sound.tap(); togglePause(); });
  root.querySelector('#jAgain').addEventListener('click', () => { Sound.tap(); reset(); });
  window.addEventListener('resize', () => { if (App.current === 'jump') { const oldW = W; resize(); if (knight && oldW) { const k = W / oldW; plats.forEach(p => p.x *= k); knight.x *= k; } } });
  document.addEventListener('visibilitychange', () => { if (document.hidden && App.current === 'jump' && state === 'play') togglePause(); });

  /* ---------- عناصر المتجر ---------- */
  const HEROES = [['hero_knight', 'الفارس', 0], ['hero_princess', 'الأميرة', 30], ['hero_bunny', 'الأرنب', 40], ['hero_cat', 'القطة', 40], ['hero_astro', 'رائد الفضاء', 60]];
  HEROES.forEach(([id, name, price]) => App.shopItem({
    cat: 'hero', id, name, price,
    draw(c, s) {
      const g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#C9E8FF'); g.addColorStop(1, '#FFE0F0');
      c.fillStyle = g; c.beginPath(); c.arc(s / 2, s / 2, s / 2, 0, 7); c.fill();
      c.fillStyle = '#fff'; cloudShape(c, s * .18, s * .72, s * .64, s * .16); c.fill();
      c.save(); c.translate(s / 2, s * .5); c.scale(s / 70, s / 70); drawHero(c, id, 0); c.restore();
    }
  }));

  App.register({
    id: 'jump', title: 'فارس السحاب', icon2: '☁️', music: 'sky',
    desc: () => App.g('اقفزي فوق الغيوم نحو قلعة الأحلام!', 'اقفز فوق الغيوم نحو قلعة الأحلام!'),
    help: () => [
      App.g('🦘 البطل يقفز وحده — وجّهيه يمينًا ويسارًا بالأزرار ⬅️ ➡️ أو بلمس جانبي الشاشة أو بإمالة الهاتف.', '🦘 البطل يقفز وحده — وجّهه يمينًا ويسارًا بالأزرار ⬅️ ➡️ أو بلمس جانبي الشاشة أو بإمالة الهاتف.'),
      App.g('⭐ اجمعي النجوم: 3 نجوم تشغّل الدرع 🛡️، و5 نجوم تطلق الصاروخ 🚀.', '⭐ اجمع النجوم: 3 نجوم تشغّل الدرع 🛡️، و5 نجوم تطلق الصاروخ 🚀.'),
      '⚡ الغيوم الرعدية لا تحملك، والطيور 🐦 تدفعك للأسفل — الدرع يحميك وينقذك من السقوط مرة.',
      '🎈 البالونات ترفعك عاليًا، والنوابض ترميك بقوة!',
      '🌈 مرّ بعالم السحاب، ثم جسر قوس قزح، ثم قلعة الأحلام، ثم الفضاء. ويمكنك تغيير البطل من المتجر 🛍️'
    ],
    best() { const b = store.get('jumpBest', 0); return b ? `🏆 أعلى ارتفاع: ${b} م` : ''; },
    enter() { resize(); reset(); last = 0; acc = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); },
    leave() { cancelAnimationFrame(raf); state = 'idle'; input.touchX = null; input.btn = 0; input.keys = { l: 0, r: 0 }; },
    pause() { if (state === 'play') { state = 'held'; } },
    resume() { if (state === 'held') { state = 'play'; last = 0; } },
    back() { if (state === 'pause') { togglePause(); return true; } return false; },
    icon(c) {
      const g = c.createLinearGradient(0, 0, 0, 152); g.addColorStop(0, '#C9E8FF'); g.addColorStop(1, '#FFE0F0');
      c.fillStyle = g; c.fillRect(0, 0, 152, 152);
      c.fillStyle = 'rgba(255,255,255,.95)'; cloudShape(c, 30, 104, 92, 26); c.fill();
      c.save(); c.translate(76, 72); c.scale(1.6, 1.6); drawHero(c, App.equipped('hero') || 'hero_knight', 0); c.restore();
      drawStar(c, 120, 36, 9, '#FFD84D', '#E89B0C', 0);
    }
  });
})();
