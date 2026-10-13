/* =====================================================================
   التاكسي المرح — تاكسي أصفر بعيون متحرّكة يجري على الطريق
   قفز فوق العوائق، جمع النجوم، مغناطيس ودرع ونيترو،
   ومهمّات توصيل الركّاب إلى البيت والمدرسة والمستشفى والسوق والشاطئ والملاهي.
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'taxi', TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';
  const EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

  App.css(`
  #taxi{background:#9ED8FF;overflow:hidden}
  #taxi canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
  #taxi .bar{gap:6px}
  #taxi .chip{color:#B86A00;min-width:54px;padding:3px 8px}
  #taxi .chip b{font-size:17px}
  #taxi .hearts{display:flex;gap:0;background:rgba(255,255,255,.9);border-radius:18px;padding:7px 7px;font-size:15px;box-shadow:0 3px 0 rgba(0,0,0,.1);line-height:1}
  #taxi .hearts span{transition:transform .3s,filter .3s,opacity .3s}
  #taxi .hearts span.off{filter:grayscale(1);opacity:.35;transform:scale(.75)}
  #taxi .hearts span.lost{animation:thl .5s}
  @keyframes thl{0%{transform:scale(1.5)}100%{transform:scale(.75)}}
  #taxi .mis{position:absolute;top:calc(max(10px,env(safe-area-inset-top)) + 56px);left:50%;transform:translateX(-50%) translateY(-8px);z-index:5;
    display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.94);border-radius:22px;padding:6px 14px 6px 10px;min-width:230px;max-width:calc(100% - 24px);
    box-shadow:0 4px 0 rgba(184,106,0,.25),0 8px 20px rgba(0,0,0,.12);opacity:0;transition:opacity .3s,transform .3s;pointer-events:none;color:#6B3A00}
  #taxi .mis.on{opacity:1;transform:translateX(-50%)}
  #taxi .mis.wait{background:#FFF6D6}
  #taxi .mis .em{font-size:30px;line-height:1;filter:drop-shadow(0 2px 0 rgba(0,0,0,.12))}
  #taxi .mis .mb{flex:1;min-width:0}
  #taxi .mis .mt{font-weight:900;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #taxi .mis .pb{height:10px;border-radius:6px;background:#FFE7B0;margin-top:3px;overflow:hidden;position:relative}
  #taxi .mis .pb i{position:absolute;inset:0 auto 0 0;width:0;border-radius:6px;background:linear-gradient(90deg,#FFB21E,#FF7A1A)}
  #taxi .mis .tm{font-weight:900;font-size:19px;min-width:46px;text-align:center;color:#2E7D32}
  #taxi .mis .tm.low{color:#E53935;animation:tlow .5s ease-in-out infinite alternate}
  @keyframes tlow{to{transform:scale(1.15)}}
  #taxi .pups{position:absolute;top:calc(max(10px,env(safe-area-inset-top)) + 112px);left:12px;z-index:5;display:flex;flex-direction:column;gap:6px;pointer-events:none}
  #taxi .pups span{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-size:22px;background:conic-gradient(#FFB21E calc(var(--p)*1turn),rgba(255,255,255,.5) 0);box-shadow:0 2px 0 rgba(0,0,0,.12)}
  #taxi .pups span b{width:34px;height:34px;border-radius:50%;background:#fff;display:grid;place-items:center;font-weight:400}
  #taxi .ctl{position:absolute;bottom:max(16px,env(safe-area-inset-bottom));z-index:6;border-radius:50%;display:grid;place-items:center;align-content:center;
    font-weight:900;color:#6B3A00;-webkit-user-select:none;user-select:none;touch-action:none}
  #taxi .ctl b{display:block;font-size:15px;line-height:1;margin-top:2px}
  #taxi .ctl:active,#taxi .ctl.on{transform:translateY(4px)}
  #taxi .jb{right:16px;width:96px;height:96px;font-size:34px;background:radial-gradient(circle at 35% 30%,#FFF3A8,#FFC21E 60%,#F59E00);box-shadow:0 6px 0 #C77700,0 10px 18px rgba(0,0,0,.2),inset 0 0 0 3px rgba(255,255,255,.5)}
  #taxi .jb.on{box-shadow:0 2px 0 #C77700,inset 0 0 0 3px rgba(255,255,255,.5)}
  #taxi .hb{left:16px;width:70px;height:70px;font-size:28px;bottom:calc(max(16px,env(safe-area-inset-bottom)) + 12px);background:rgba(255,255,255,.9);box-shadow:0 5px 0 rgba(107,58,0,.25)}
  #taxi .hb b{font-size:12px}
  #taxi .sb{left:50%;width:96px;height:96px;margin-left:-48px;font-size:34px;color:#fff;background:radial-gradient(circle at 35% 30%,#FF8A80,#F23B3B 60%,#C62828);
    box-shadow:0 6px 0 #8E1B1B,0 10px 18px rgba(0,0,0,.2),inset 0 0 0 3px rgba(255,255,255,.45);transform:scale(0);transition:transform .25s cubic-bezier(.3,1.6,.6,1);pointer-events:none}
  #taxi .sb.show{transform:scale(1);pointer-events:auto;animation:tsb 1s ease-in-out infinite}
  #taxi .sb.show:active{transform:scale(.95) translateY(4px)}
  @keyframes tsb{50%{box-shadow:0 6px 0 #8E1B1B,0 0 0 10px rgba(255,90,90,.35),inset 0 0 0 3px rgba(255,255,255,.45)}}
  #taxi .hint{bottom:calc(max(16px,env(safe-area-inset-bottom)) + 118px);color:#6B3A00}
  #taxi .zone{position:absolute;top:32%;left:0;right:0;text-align:center;z-index:7;pointer-events:none;opacity:0;font-size:30px;font-weight:900;color:#fff;
    text-shadow:0 3px 0 rgba(184,106,0,.6),0 0 18px rgba(255,200,60,.9)}
  #taxi .zone.show{animation:tzone 2.4s ease-out}
  #taxi .zone small{display:block;font-size:16px}
  @keyframes tzone{0%{opacity:0;transform:scale(.6)}12%{opacity:1;transform:scale(1.08)}20%{transform:scale(1)}80%{opacity:1}100%{opacity:0;transform:translateY(-30px)}}
  #taxi .panel{border-color:#FFE08A;box-shadow:0 8px 0 #FFC94D,0 20px 40px rgba(0,0,0,.25)}
  #taxi .panel h3{color:#D97800}
  #taxi .panel .btn{background:#FFB21E;box-shadow:0 4px 0 #C77700;color:#5A2E00}
  #taxi .panel .btn.alt{background:#fff;color:#C77700;box-shadow:0 4px 0 #FFD98A;border-color:#FFE7B0}
  #taxi .stats{display:flex;justify-content:center;gap:8px;margin:8px 0 6px;flex-wrap:wrap}
  #taxi .stats div{background:#FFF6D6;border-radius:16px;padding:6px 12px;font-weight:900;color:#6B3A00;min-width:76px}
  #taxi .stats small{display:block;font-size:11px;font-weight:700;opacity:.7}
  #taxi .stats b{font-size:20px}
  #taxi .bestl{font-size:14px;font-weight:800;color:#B86A00;margin:-6px 0 12px}
  #taxi .overlay{background:rgba(90,50,0,.3)}
  `);

  const root = App.section(ID, `
    <canvas id="tC"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib" id="tPause" aria-label="إيقاف مؤقت">⏸</button>
      <span class="grow"></span>
      <div class="hearts" id="tHearts"><span>❤️</span><span>❤️</span><span>❤️</span></div>
      <div class="chip"><small>⭐ نجوم</small><b id="tStars">0</b></div>
      <div class="chip"><small>المسافة</small><b id="tDist">0</b></div>
    </div>
    <div class="mis" id="tMis"><span class="em" id="tMisE">🏠</span><div class="mb"><div class="mt" id="tMisT"></div><div class="pb"><i id="tMisP"></i></div></div><div class="tm" id="tMisTm"></div></div>
    <div class="pups" id="tPups"></div>
    <div class="zone" id="tZone"></div>
    <div class="hint" id="tHint"><span id="tHintT"></span></div>
    <button class="ctl hb" id="tHorn" aria-label="بوق">📯<b>بيب!</b></button>
    <button class="ctl sb" id="tStop" aria-label="توقف">🛑<b>توقف</b></button>
    <button class="ctl jb" id="tJump" aria-label="قفز">⬆️<b>قفز</b></button>
    <div class="overlay" id="tOver"><div class="panel">
      <h3 id="tOverT">انتهت الرحلة!</h3>
      <div class="big"><span id="tFinal">0</span> م</div>
      <div class="stats">
        <div><small>توصيلات</small><b id="tFinD">0</b> 🧍</div>
        <div><small>نجوم</small><b id="tFinS">0</b> ⭐</div>
      </div>
      <p id="tOverP"></p>
      <div class="bestl" id="tBestL"></div>
      <button class="btn" id="tAgain">🔁 مرة أخرى</button>
      <button class="btn alt home">🏠 القائمة</button>
    </div></div>
    <div class="overlay" id="tPaused"><div class="panel">
      <h3>استراحة 🚕</h3><p id="tPauseP"></p>
      <button class="btn" id="tResume">▶️ متابعة</button>
      <button class="btn alt home">🏠 القائمة</button>
    </div></div>`);

  /* ---------- ثوابت ---------- */
  const cv = root.querySelector('#tC');
  const TX = 92;                    // موضع التاكسي من يسار الشاشة (وحدات منطقية)
  const JUMP_V = 790, JUMP2_V = 580, G_HOLD = 1850, G_UP = 2200, G_FALL = 3000;
  const DESTS = [
    { e: '🏠', n: 'البيت', to: 'إلى البيت' },
    { e: '🏫', n: 'المدرسة', to: 'إلى المدرسة' },
    { e: '🏥', n: 'المستشفى', to: 'إلى المستشفى' },
    { e: '🛒', n: 'السوق', to: 'إلى السوق' },
    { e: '🏖️', n: 'الشاطئ', to: 'إلى الشاطئ' },
    { e: '🎡', n: 'مدينة الملاهي', to: 'إلى مدينة الملاهي' }
  ];
  const ZONES = [
    { n: '🏙️ المدينة', s: 'شوارع وعمارات ملوّنة' },
    { n: '🏜️ الصحراء', s: 'رمال ونخيل وجِمال' },
    { n: '🌳 الحديقة', s: 'أشجار وزهور وفراشات' }
  ];
  const ZONE_LEN = 1000; // متر لكل منطقة
  const SKIN = ['#FFDCC2', '#F6C9A0', '#D9A066', '#A86B3C', '#7A4A26'];
  const CLOTH = ['#FF6FA8', '#5BB8FF', '#7ED957', '#B48CFF', '#FF9F43', '#FF5E5E', '#2EC4B6', '#FFD43B'];
  const HAIR = ['#3B2416', '#6B3E1F', '#1E1A18', '#B5651D', '#E8C07A'];
  const PUPS = { magnet: { e: '🧲', d: 8 }, shield: { e: '🛡️', d: 0 }, nitro: { e: '🔥', d: 3.6 } };

  let ctx, W = 0, H = 0, S = 1, VW = 500, GY = 0, HB = 0;
  let state = 'idle', raf = 0, last = 0, acc = 0, T = 0;
  let taxi, speed, camX, obs, stars, pups, parts, floats, props, paxList, reserved;
  let nextSpawnX, nextPupX, nextMissionX, waiting, ride, mode, brake, modeT;
  let hearts, deliveries, starCount, distM, best, zoneI, shake, flash, overT, holdJump;
  let uiT = 0, lastMisKey = '';

  const h1 = (i, k = 0) => { const v = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return v - Math.floor(v); };
  const lerp = (a, b, t) => a + (b - a) * t;
  function mix(a, b, t) {
    const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    const r = (pa >> 16) + (((pb >> 16) - (pa >> 16)) * t), g = ((pa >> 8) & 255) + ((((pb >> 8) & 255) - ((pa >> 8) & 255)) * t), bl = (pa & 255) + (((pb & 255) - (pa & 255)) * t);
    return `rgb(${r | 0},${g | 0},${bl | 0})`;
  }
  const sx = x => (x - camX) * S;
  const sy = y => GY - y * S;

  function resize() {
    ({ ctx, w: W, h: H } = fitCanvas(cv));
    S = clamp(Math.min(W / 470, H / 560), .6, 1.6);
    VW = W / S;
    GY = Math.round(H * (W > H ? .76 : .71));
    HB = GY - 30 * S;
  }

  /* ---------- البداية ---------- */
  function newTaxi() {
    return { x: 0, y: 0, vy: 0, ground: true, jumps: 0, squash: 0, inv: 0, hurt: 0, happy: 0, blink: 0, blinkT: 2.5, honk: 0,
      eyes: [{ x: 3, y: 0, vx: 0, vy: 0 }, { x: 3, y: 0, vx: 0, vy: 0 }], wheel: 0, shield: false, magnet: 0, nitro: 0, spin: 0, wet: 0, sad: 0, bob: 0 };
  }
  function reset() {
    const b = store.get('taxiBest', null) || {}; best = { d: b.d || 0, n: b.n || 0 };
    taxi = newTaxi(); speed = 0; camX = -TX;
    obs = []; stars = []; pups = []; parts = []; floats = []; props = []; paxList = []; reserved = [];
    nextSpawnX = 700; nextPupX = 2600 + rand(0, 1200); nextMissionX = 1500;
    waiting = null; ride = null; mode = 'drive'; brake = null; modeT = 0;
    hearts = 3; deliveries = 0; starCount = 0; distM = 0; zoneI = 0; shake = 0; flash = 0; overT = 0; holdJump = false;
    for (let x = 260; x < 640; x += 46) stars.push({ x, y: 22, t: x, got: false });
    paintHearts(); $('#tStars').textContent = 0; $('#tDist').textContent = 0;
    $('#tOver').classList.remove('on'); $('#tPaused').classList.remove('on');
    $('#tMis').classList.remove('on'); $('#tPups').innerHTML = ''; showStop(false);
    $('#tHintT').textContent = App.g('المسي الشاشة أو اضغطي «قفز» لتنطلقي! 🚕', 'المس الشاشة أو اضغط «قفز» لتنطلق! 🚕');
    $('#tHint').style.opacity = 1;
    state = 'ready'; lastMisKey = '';
  }
  function start() {
    state = 'play'; honk(); $('#tHintT').textContent = App.g('اقفزي فوق العوائق ⬆️ واجمعي النجوم ⭐', 'اقفز فوق العوائق ⬆️ واجمع النجوم ⭐');
    setTimeout(() => { if (state === 'play' && distM > 20) $('#tHint').style.opacity = 0; }, 4000);
    banner(0);
  }
  function banner(i) {
    const el = $('#tZone'), z = ZONES[i % 3];
    el.innerHTML = `${z.n}<small>${z.s}</small>`;
    el.classList.remove('show'); void el.offsetWidth; el.classList.add('show');
  }
  function paintHearts(lostI) {
    const sp = $('#tHearts').children;
    for (let i = 0; i < 3; i++) { sp[i].classList.toggle('off', i >= hearts); sp[i].classList.toggle('lost', i === lostI); }
  }
  function showStop(on) { $('#tStop').classList.toggle('show', !!on); }

  /* ---------- التحكم بالقفز ---------- */
  function jumpPress() {
    if (state === 'ready') { start(); return; }
    if (state !== 'play') return;
    holdJump = true;
    const k = taxi;
    if (mode !== 'drive') return;
    if (k.ground) {
      k.vy = JUMP_V; k.ground = false; k.jumps = 1; k.squash = -.6;
      Sound.jump(); dust(k.x - 30, 6); dust(k.x + 30, 6);
      k.eyes.forEach(e => e.vy += 90);
    } else if (k.jumps < 2) {
      k.vy = JUMP2_V; k.jumps = 2; k.spin = 1; k.squash = -.4;
      Sound.tone(560, .16, 'sine', .13, 480); ring(k.x, k.y + 30, '#FFF3B0');
    }
  }
  function jumpRelease() {
    holdJump = false;
  }
  function honk() {
    const k = taxi; if (!k || k.honk > .55) return;
    k.honk = .8;
    Sound.tone(466, .13, 'square', .07); Sound.tone(587, .13, 'square', .05);
    Sound.tone(466, .2, 'square', .07, 0, .17); Sound.tone(587, .2, 'square', .05, 0, .17);
    vibrate(12);
    if (state !== 'play') return;
    // البوق يوقظ القطط ويطيّر الطيور
    for (const o of obs) {
      const d = o.x - k.x;
      if (d > 0 && d < 420 && !o.gone) {
        if (o.type === 'cat' && !o.awake) { o.awake = 1; addFloat(o.x + o.w / 2, 60, '!', '#FF7A1A'); Sound.tone(900, .1, 'sine', .1, 400, .1); }
        if (o.type === 'bird' && !o.awake) { o.awake = 1; Sound.tone(1200, .08, 'sine', .07, 300, .05); }
      }
    }
    if (waiting && waiting.pax.state === 'wait') waiting.pax.excite = 1;
  }

  /* ---------- مهمّات التوصيل ---------- */
  function stopAvailable() {
    if (state !== 'play' || mode !== 'drive' || !waiting || waiting.pax.state !== 'wait') return false;
    const d = waiting.x - taxi.x;
    return d > -50 && d < 720;
  }
  function requestStop() {
    if (!stopAvailable()) return;
    Sound.tone(300, .25, 'triangle', .1, -120); Sound.noise(.35, 1800, 900, .05, 2);
    let target = waiting.x + 26;
    if (target - taxi.x < 40) target = taxi.x + 40;
    beginBrake(target, 'pick');
    showStop(false);
  }
  function beginBrake(target, kind) {
    const d = Math.max(1, target - taxi.x), v = Math.max(speed, 60);
    brake = { target, kind, a: Math.max(650, v * v / (2 * d)) };
    mode = 'brake';
  }
  function spawnStop(x) {
    const look = randLook(), dest = Math.random() * DESTS.length | 0;
    const pax = { look, x: x - 30, d: 0, state: 'wait', t: Math.random() * 6, excite: 0, dest };
    props.push({ kind: 'stop', x });
    paxList.push(pax);
    waiting = { x, pax };
    reserved.push({ a: x - 760, b: x + 260 });
  }
  function boardDone() {
    const pax = waiting.pax, dest = DESTS[pax.dest];
    pax.state = 'in';
    const m = Math.min(220 + deliveries * 70, 900);              // مسافة المهمّة بالأمتار
    const dx = m * 10;
    const vExp = Math.max(260, baseSpeed(distM + m / 2));
    const time = Math.round(dx / vExp * 1.45 + 6);
    ride = { pax, dest: pax.dest, x: taxi.x + dx, from: taxi.x, time, total: time, failed: 0 };
    props.push({ kind: 'dest', x: ride.x, dest: pax.dest });
    reserved.push({ a: ride.x - 900, b: ride.x + 300 });
    waiting = null;
    taxi.happy = 1.6; taxi.squash = .8;
    Sound.pop(); [660, 880, 1100].forEach((f, i) => Sound.tone(f, .12, 'triangle', .1, 0, .05 + i * .07));
    hearts3(taxi.x - 20, 70, 6);
    addFloat(taxi.x, 110, dest.e + ' ' + dest.to, '#B86A00');
    App.speak(dest.to);
  }
  function deliverDone() {
    const r = ride, dest = DESTS[r.dest];
    r.pax.state = 'out'; r.pax.x = taxi.x - 20; r.pax.d = 1; r.pax.t = 0; r.pax.vy = 420; r.pax.y = 0;
    deliveries++;
    const bonus = 5 + Math.floor(r.time / 4);
    starCount += bonus; $('#tStars').textContent = starCount;
    taxi.happy = 2;
    Sound.win(); vibrate(25);
    hearts3(taxi.x - 20, 60, 10); confetti(taxi.x - 10, 90);
    addFloat(taxi.x - 10, 120, `+${bonus} ⭐`, '#E89B0C');
    addFloat(taxi.x + 60, 150, App.g('شكرًا يا بطلة! 💛', 'شكرًا يا بطل! 💛'), '#D9467A');
    App.achieve('taxi_first');
    if (deliveries >= 10) App.achieve('taxi_10');
    ride = null; lastMisKey = '';
    nextMissionX = taxi.x + rand(1100, 1900);
  }
  function rideFailed() {
    const r = ride; if (!r) return;
    r.pax.state = 'poof'; r.pax.t = 0;
    Sound.lose(); taxi.sad = 1.6;
    addFloat(taxi.x, 120, '⏰ انتهى الوقت!', '#E53935');
    const dp = props.find(p => p.kind === 'dest' && p.x === r.x); if (dp) dp.fade = 1;
    puffCloud(taxi.x - 20, 70);
    ride = null; lastMisKey = '';
    nextMissionX = taxi.x + rand(900, 1400);
  }

  /* ---------- الإنشاء ---------- */
  const baseSpeed = m => Math.min(470, 250 + m * .075);
  const diffOf = () => clamp(distM / 3000, 0, 1);
  function inReserved(a, b) { return reserved.find(z => b > z.a && a < z.b); }
  function randLook() {
    const kind = ['hijab', 'pigtails', 'cap', 'grandpa', 'grandma', 'curly', 'ponytail', 'hat'][Math.random() * 8 | 0];
    return {
      kind, skin: SKIN[Math.random() * SKIN.length | 0], hair: kind === 'grandpa' || kind === 'grandma' ? '#E8E8EE' : HAIR[Math.random() * HAIR.length | 0],
      top: CLOTH[Math.random() * CLOTH.length | 0], acc: CLOTH[Math.random() * CLOTH.length | 0],
      dress: ['hijab', 'pigtails', 'grandma', 'ponytail'].includes(kind), small: ['pigtails', 'cap', 'curly'].includes(kind)
    };
  }
  function spawnContent() {
    const diff = diffOf();
    while (nextSpawnX < camX + VW + 300) {
      let x = nextSpawnX;
      const z = inReserved(x - 40, x + 200);
      if (z) { nextSpawnX = z.b + 80; continue; }
      const r = Math.random();
      let made = null;
      if (r < .26) made = add('cone', x, diff > .45 && Math.random() < .4 ? 2 : 1);
      else if (r < .42) made = add('box', x, diff > .35 && Math.random() < .35 ? 2 : 1);
      else if (r < .55) made = add('puddle', x);
      else if (r < .68 && diff > .06) made = add('cat', x);
      else if (r < .82 && diff > .14) made = add('bird', x);
      else if (r < .92 && diff > .1) made = add('hole', x);
      else made = add('cone', x, 1);
      // نجوم: قوس فوق العائق أو خط على الطريق
      if (made.type === 'bird') {
        for (let i = 0; i < 4; i++) stars.push({ x: x - 30 + i * 40, y: 22, t: i, got: false });
      } else if (Math.random() < .7) {
        const cx = made.x + made.w / 2, n = 5;
        for (let i = 0; i < n; i++) { const u = (i / (n - 1)) * 2 - 1; stars.push({ x: cx + u * 95, y: made.h + 45 + 60 * (1 - u * u), t: i, got: false }); }
      }
      const minGap = Math.max(speed, 250) * (1.05 - diff * .15) + 180;
      const gap = minGap + rand(0, 420 * (1 - diff * .55));
      if (Math.random() < .45) { // خط نجوم في الفراغ
        const n = 3 + (Math.random() * 3 | 0), x0 = made.x + made.w + gap * .35;
        for (let i = 0; i < n; i++) stars.push({ x: x0 + i * 40, y: 22, t: i, got: false });
      }
      nextSpawnX = made.x + made.w + gap;
    }
    if (nextPupX < camX + VW + 200) {
      const x = nextPupX;
      if (!inReserved(x - 60, x + 60) && !obs.some(o => Math.abs(o.x - x) < 120)) {
        let types = ['magnet', 'shield', 'nitro'];
        if (taxi.shield) types = ['magnet', 'nitro'];
        pups.push({ x, y: Math.random() < .5 ? 40 : 120, type: types[Math.random() * types.length | 0], t: 0, got: false });
      }
      nextPupX = x + rand(2400, 4200);
    }
    if (!waiting && !ride && mode === 'drive' && nextMissionX < camX + VW + 500) {
      let x = Math.max(nextMissionX, camX + VW + 120);
      // لا تضع الموقف فوق عائق قريب
      for (const o of obs) if (o.x + o.w > x - 760 && o.x < x + 260) x = Math.max(x, o.x + o.w + 780);
      spawnStop(x);
      nextMissionX = Infinity;
    }
  }
  function add(type, x, n = 1) {
    let o;
    if (type === 'cone') o = { w: n === 2 ? 78 : 36, h: 46, n };
    else if (type === 'box') o = { w: 52, h: n === 2 ? 92 : 46, n, face: Math.random() < .5 };
    else if (type === 'puddle') o = { w: 92, h: 6 };
    else if (type === 'cat') o = { w: 56, h: 34, vx: -rand(10, 30), c: ['#FFA75C', '#9AA3B5', '#3D3D46', '#FFF3E6'][Math.random() * 4 | 0] };
    else if (type === 'bird') o = { w: 46, h: 30, y: 108, vx: -rand(40, 70), c: ['#6EC6FF', '#FF8FB1', '#9BE36B'][Math.random() * 3 | 0] };
    else o = { w: 70, h: 4 };
    o = Object.assign({ type, x, y: 0, t: Math.random() * 6, hit: false }, o);
    obs.push(o); return o;
  }

  /* ---------- الجسيمات ---------- */
  function dust(x, y) { for (let i = 0; i < 4; i++) parts.push({ x: x + rand(-8, 8), y: y + rand(0, 6), vx: rand(-90, -20), vy: rand(10, 60), g: -40, life: .5, max: .5, r: rand(5, 9), c: 'rgba(225,210,190,.9)' }); }
  function puffCloud(x, y) { for (let i = 0; i < 12; i++) { const a = Math.random() * TAU; parts.push({ x, y, vx: Math.cos(a) * 90, vy: Math.sin(a) * 90, g: 0, life: .6, max: .6, r: rand(8, 14), c: '#fff' }); } }
  function spark(x, y, c, n) { for (let i = 0; i < n; i++) { const a = Math.random() * TAU, s = rand(80, 240); parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: -500, life: .7, max: .7, r: rand(3, 5), c, star: true }); } }
  function hearts3(x, y, n) { for (let i = 0; i < n; i++) parts.push({ x: x + rand(-20, 20), y: y + rand(-5, 10), vx: rand(-60, 60), vy: rand(80, 170), g: -60, life: 1.3, max: 1.3, r: rand(6, 9), c: ['#FF5E8A', '#FF8FB1', '#FFB0C8'][i % 3], heart: true }); }
  function confetti(x, y) { for (let i = 0; i < 26; i++) { const a = rand(.3, 2.8); parts.push({ x, y, vx: Math.cos(a) * rand(80, 260), vy: Math.sin(a) * rand(160, 360), g: -520, life: 1.4, max: 1.4, r: 4, c: CLOTH[i % CLOTH.length], conf: true, rot: Math.random() * 6 }); } }
  function ring(x, y, c) { parts.push({ x, y, vx: 0, vy: 0, g: 0, life: .5, max: .5, r: 30, c, ring: true }); }
  function splash(x) { for (let i = 0; i < 16; i++) parts.push({ x: x + rand(-30, 30), y: 4, vx: rand(-160, 120), vy: rand(150, 380), g: -1100, life: .8, max: .8, r: rand(3, 6), c: Math.random() < .5 ? '#7FD0FF' : '#BDEBFF' }); }
  function addFloat(x, y, text, c) { floats.push({ x, y, text, c, life: 1.6, max: 1.6 }); }

  /* ---------- التحديث ---------- */
  function hitTaxi(o) {
    const k = taxi;
    if (k.nitro > 0) { knock(o); Sound.boom(); shake = .25; starCount++; $('#tStars').textContent = starCount; return; }
    if (k.inv > 0) return;
    if (k.shield) { k.shield = false; k.inv = .9; knock(o); Sound.poof(); ring(k.x, k.y + 35, '#9FE3FF'); ring(k.x, k.y + 35, '#fff'); paintPups(); return; }
    hearts--; paintHearts(hearts);
    k.inv = 1.9; k.hurt = .9; shake = .55; flash = .5; speed *= .55;
    knock(o); Sound.boom(); Sound.error(); vibrate(40);
    k.eyes.forEach(e => { e.vx += rand(-300, 300); e.vy += rand(-300, 300); });
    addFloat(k.x, 110, '💥 أوه!', '#E53935');
    if (hearts <= 0) { state = 'crash'; overT = 1.3; k.vy = 520; k.ground = false; Sound.fall(); }
  }
  function knock(o) {
    o.gone = true;
    if (o.type === 'puddle' || o.type === 'hole') return;
    parts.push({ x: o.x + o.w / 2, y: o.y + o.h / 2, vx: rand(250, 420), vy: rand(380, 560), g: -1500, life: 1.2, max: 1.2, r: 0, obj: o, rot: 0, vr: rand(6, 12) });
    spark(o.x + o.w / 2, o.y + o.h / 2, '#FFD84D', 8);
  }

  function step(dt) {
    const k = taxi;
    T += dt;
    // السرعة
    const target = state === 'play' ? baseSpeed(distM) * (k.nitro > 0 ? 1.7 : 1) : 0;
    if (mode === 'brake') {
      const rem = brake.target - k.x;
      speed = Math.min(speed, Math.sqrt(Math.max(0, 2 * brake.a * rem)));
      if (rem < .8 || speed < 4) {
        speed = 0; k.x = Math.max(k.x, brake.target - .8);
        mode = brake.kind === 'pick' ? 'board' : 'drop'; modeT = 0; k.squash = .5;
        Sound.tone(220, .12, 'sine', .1, -60);
        if (mode === 'board' && waiting) { waiting.pax.state = 'walk'; }
        if (mode === 'drop' && ride) deliverDone();
      }
    } else if (mode === 'board' || mode === 'drop') {
      speed = 0; modeT += dt;
      if (mode === 'board' && waiting) {
        const p = waiting.pax, door = k.x - 22;
        p.d = Math.min(1, p.d + dt * 2.2);
        p.x += clamp(door - p.x, -150 * dt, 150 * dt);
        if (p.d >= 1 && Math.abs(door - p.x) < 2) { boardDone(); modeT = 0; mode = 'boarded'; }
      }
      if (mode === 'drop' && modeT > 1.1) mode = 'drive';
    } else if (mode === 'boarded') {
      speed = 0; modeT += dt; if (modeT > .55) mode = 'drive';
    } else {
      speed += clamp(target - speed, -900 * dt, (k.nitro > 0 ? 900 : 260) * dt);
    }
    if (state === 'crash') speed *= Math.pow(.2, dt);
    k.x += speed * dt;
    camX = k.x - TX;
    k.wheel += speed * dt / 15;
    distM = Math.max(distM, Math.floor(k.x / 10));

    // القفز والجاذبية
    if (!k.ground) {
      k.vy -= (k.vy > 0 ? (holdJump ? G_HOLD : G_UP) : G_FALL) * dt;
      k.y += k.vy * dt;
      if (k.y <= 0) {
        k.y = 0; const imp = -k.vy;
        k.vy = 0; k.ground = true; k.jumps = 0;
        k.squash = clamp(imp / 1100, .25, 1);
        dust(k.x - 34, 4); dust(k.x + 36, 4);
        Sound.tone(150, .08, 'sine', .12, -50);
        k.eyes.forEach(e => e.vy -= imp * .25);
      }
    }
    k.squash *= Math.pow(.0015, dt);
    if (Math.abs(k.squash) < .01) k.squash = 0;
    k.spin = Math.max(0, k.spin - dt * 2.6);
    k.inv = Math.max(0, k.inv - dt); k.hurt = Math.max(0, k.hurt - dt); k.happy = Math.max(0, k.happy - dt);
    k.honk = Math.max(0, k.honk - dt); k.wet = Math.max(0, k.wet - dt); k.sad = Math.max(0, k.sad - dt);
    k.bob += dt * (6 + speed / 40);
    if (k.magnet > 0) { k.magnet -= dt; if (k.magnet <= 0) paintPups(); }
    if (k.nitro > 0) {
      k.nitro -= dt;
      if (Math.random() < .9) parts.push({ x: k.x - 64, y: k.y + 20 + rand(-4, 4), vx: rand(-260, -160), vy: rand(-20, 40), g: 0, life: .35, max: .35, r: rand(6, 11), c: Math.random() < .5 ? '#FFB21E' : '#FF5A1F', fire: true });
      if (k.nitro <= 0) { k.inv = Math.max(k.inv, 1); paintPups(); }
    }
    // رمش العين
    k.blinkT -= dt; if (k.blinkT <= 0) { k.blink = .14; k.blinkT = rand(2.2, 4.5); }
    k.blink = Math.max(0, k.blink - dt);
    // عيون متحرّكة (googly)
    let lx = 4, ly = 0;
    if (!k.ground) ly = k.vy > 150 ? -4 : k.vy < -250 ? 3 : 0;
    if (waiting && waiting.x - k.x < 500 && waiting.x - k.x > -60 && k.ground) { lx = waiting.x > k.x + 40 ? 4 : -2; ly = -1; }
    if (mode === 'board' || mode === 'drop') { lx = -4; ly = 0; }
    k.eyes.forEach((e, i) => {
      const kk = 140 + i * 30;
      e.vx += ((lx - e.x) * kk - e.vx * 9) * dt; e.vy += ((ly - e.y) * kk - e.vy * 9) * dt;
      e.x += e.vx * dt; e.y += e.vy * dt;
      const m = Math.hypot(e.x, e.y), R = 5.2;
      if (m > R) { e.x *= R / m; e.y *= R / m; const dot = (e.vx * e.x + e.vy * e.y) / R; e.vx -= 1.6 * dot * e.x / R; e.vy -= 1.6 * dot * e.y / R; }
    });
    // دخان العادم
    if (state === 'play' || state === 'ready') {
      const rate = speed < 20 ? .12 : .06;
      if ((T % rate) < dt) parts.push({ x: k.x - 66, y: k.y + 14, vx: -speed * .2 - rand(30, 70), vy: rand(20, 50), g: -20, life: .7, max: .7, r: rand(4, 7), c: 'rgba(210,210,220,.75)', grow: 1 });
    }

    if (state === 'play') {
      if (mode === 'drive') spawnContent();
      // النجوم
      const kcx = k.x + 4, kcy = k.y + 36;
      for (const s of stars) {
        if (s.got) continue;
        if (k.magnet > 0) { const dx = kcx - s.x, dy = kcy - s.y, d = Math.hypot(dx, dy); if (d < 300 && s.x > k.x - 120) { s.x += dx / d * Math.min(d, 650 * dt); s.y += dy / d * Math.min(d, 650 * dt); s.mag = 1; } }
        if (Math.abs(kcx - s.x) < 62 && Math.abs(kcy - s.y) < 46) {
          s.got = true; starCount++; $('#tStars').textContent = starCount;
          Sound.tone(1300 + (starCount % 5) * 90, .07, 'sine', .08); Sound.tone(1950 + (starCount % 5) * 90, .09, 'sine', .04, 0, .04);
          spark(s.x, s.y, '#FFD84D', 5);
        }
      }
      // القوى الخاصة
      for (const p of pups) {
        if (p.got) continue; p.t += dt;
        if (Math.abs(kcx - p.x) < 64 && Math.abs(kcy - (p.y + Math.sin(p.t * 3) * 6)) < 52) {
          p.got = true;
          if (p.type === 'magnet') { k.magnet = PUPS.magnet.d; addFloat(p.x, p.y + 40, '🧲 مغناطيس!', '#E53935'); }
          if (p.type === 'shield') { k.shield = true; addFloat(p.x, p.y + 40, '🛡️ درع!', '#2D8FE0'); }
          if (p.type === 'nitro') { k.nitro = PUPS.nitro.d; addFloat(p.x, p.y + 40, '🔥 نيترو!', '#FF5A1F'); Sound.whoosh(); shake = .2; }
          Sound.star(); ring(p.x, p.y, '#FFF3B0'); spark(p.x, p.y, '#FFD84D', 10); k.happy = Math.max(k.happy, .8);
          paintPups();
        }
      }
      // العوائق
      const L = k.x - 46, R = k.x + 50, B = k.y + 4, Tp = k.y + 84;
      for (const o of obs) {
        o.t += dt;
        if (o.type === 'cat') {
          if (o.awake) { o.awake += dt; o.y += (o.awake < .3 ? 0 : 1) * 200 * dt; o.x += 120 * dt; if (o.awake > 1.2) o.gone = true; }
          else o.x += o.vx * dt;
        }
        if (o.type === 'bird') {
          if (o.awake) { o.awake += dt; o.y += 260 * dt; o.x += 60 * dt; if (o.awake > 1.5) o.gone = true; }
          else { o.x += o.vx * dt; o.y = 108 + Math.sin(o.t * 3) * 5; }
        }
        if (o.gone || o.hit || o.awake) continue;
        if (o.type === 'puddle') {
          if (k.ground && k.x + 30 > o.x && k.x - 30 < o.x + o.w) { o.hit = true; splash(k.x + 20); Sound.noise(.4, 600, 2400, .14, 1); speed *= .78; k.wet = 1.4; k.hurt = .35; addFloat(k.x, 100, '💦 سبلاش!', '#2D8FE0'); }
          continue;
        }
        if (o.type === 'hole') {
          if (k.ground && k.x > o.x + 10 && k.x < o.x + o.w - 10) { o.hit = true; if (k.inv <= 0 && k.nitro <= 0 && !k.shield) { k.vy = 380; k.ground = false; } hitTaxi(o); o.gone = false; o.hit = true; }
          continue;
        }
        const ox0 = o.x + 5, ox1 = o.x + o.w - 5, oy0 = o.y + 2, oy1 = o.y + o.h - 4;
        if (R > ox0 && L < ox1 && Tp > oy0 && B < oy1) { o.hit = true; hitTaxi(o); }
      }
      // المهمّات
      if (waiting && waiting.pax.state === 'wait' && mode === 'drive' && k.x > waiting.x + 60) {
        waiting.pax.state = 'sad'; waiting = null; Sound.tone(330, .3, 'triangle', .1, -100);
        addFloat(k.x - 80, 110, App.g('فاتكِ الراكب! 😢', 'فاتك الراكب! 😢'), '#8E5A00');
        nextMissionX = k.x + rand(900, 1400);
      }
      if (ride) {
        if (mode === 'drive' || mode === 'brake') ride.time -= dt;
        if (ride.time <= 0 && mode === 'drive') rideFailed();
        else if (mode === 'drive' && ride.x - k.x < speed * speed / (2 * 700) + 6) { beginBrake(ride.x, 'drop'); Sound.tone(300, .25, 'triangle', .1, -120); }
      }
      const zi = Math.floor(distM / ZONE_LEN);
      if (zi > zoneI) { zoneI = zi; banner(zi); Sound.win(); }
      if (distM >= 3000) App.achieve('taxi_far');
    }
    // الركّاب خارج السيارة
    for (const p of paxList) {
      p.t += dt; p.excite = Math.max(0, (p.excite || 0) - dt);
      if (p.state === 'out') { p.vy -= 1400 * dt; p.y += p.vy * dt; if (p.y <= 0) { p.y = 0; p.vy = p.t < 1.2 ? 380 : 0; } p.d = Math.max(0, p.d - dt * .8); p.x -= 30 * dt; }
    }
    paxList = paxList.filter(p => p.state !== 'in' || (ride && ride.pax === p)).filter(p => p.x > camX - 120 || p.state === 'in');
    // الجسيمات
    for (const q of parts) {
      q.x += q.vx * dt; q.y += q.vy * dt; q.vy += q.g * dt; q.life -= dt;
      if (q.rot != null) q.rot += (q.vr || 6) * dt;
    }
    parts = parts.filter(q => q.life > 0);
    for (const f of floats) { f.life -= dt; f.y += 40 * dt; }
    floats = floats.filter(f => f.life > 0);
    const cut = camX - 260;
    obs = obs.filter(o => o.x + o.w > cut && !(o.gone && o.type !== 'hole' && o.type !== 'cat' && o.type !== 'bird'));
    obs = obs.filter(o => !(o.gone && (o.type === 'cat' || o.type === 'bird') && o.awake > 1));
    stars = stars.filter(s => !s.got && s.x > cut);
    pups = pups.filter(p => !p.got && p.x > cut);
    props = props.filter(p => p.x > cut - 300);
    reserved = reserved.filter(z => z.b > cut);
    shake = Math.max(0, shake - dt * 2.5); flash = Math.max(0, flash - dt * 2.5);

    if (state === 'crash') { overT -= dt; if (overT <= 0) gameOver(); }
  }

  function paintPups() {
    const k = taxi, el = $('#tPups'); let h = '';
    if (k.shield) h += `<span style="--p:1"><b>🛡️</b></span>`;
    if (k.magnet > 0) h += `<span style="--p:${(k.magnet / PUPS.magnet.d).toFixed(3)}"><b>🧲</b></span>`;
    if (k.nitro > 0) h += `<span style="--p:${(k.nitro / PUPS.nitro.d).toFixed(3)}"><b>🔥</b></span>`;
    if (el.innerHTML !== h) el.innerHTML = h;
  }
  function paintUI() {
    $('#tDist').textContent = distM;
    if (taxi.magnet > 0 || taxi.nitro > 0) paintPups();
    const el = $('#tMis');
    showStop(stopAvailable());
    let key = '';
    if (ride) {
      const d = DESTS[ride.dest], prog = clamp((taxi.x - ride.from) / (ride.x - ride.from), 0, 1), left = Math.max(0, Math.ceil(ride.time));
      key = 'r' + ride.x;
      if (key !== lastMisKey) { $('#tMisE').textContent = d.e; $('#tMisT').textContent = '🧍 ' + d.to; el.classList.remove('wait'); }
      $('#tMisP').style.width = (prog * 100).toFixed(1) + '%';
      const tm = $('#tMisTm'); tm.textContent = '⏱ ' + left; tm.classList.toggle('low', left <= 5);
      const m = Math.max(0, Math.round((ride.x - taxi.x) / 10));
      $('#tMisT').textContent = `🧍 ${d.to} · ${m} م`;
    } else if (waiting && waiting.pax.state === 'wait' && waiting.x - taxi.x < 1100) {
      key = 'w' + waiting.x;
      if (key !== lastMisKey) {
        $('#tMisE').textContent = '🙋'; el.classList.add('wait');
        $('#tMisT').textContent = App.g('راكب ينتظر! اضغطي «توقف» 🛑', 'راكب ينتظر! اضغط «توقف» 🛑');
        $('#tMisP').style.width = '0%'; $('#tMisTm').textContent = DESTS[waiting.pax.dest].e; $('#tMisTm').classList.remove('low');
      }
    }
    if (key !== lastMisKey) { el.classList.toggle('on', !!key); lastMisKey = key; }
  }

  function gameOver() {
    state = 'over'; showStop(false);
    const d = distM, isBest = d > best.d, isBestN = deliveries > best.n;
    if (isBest || isBestN) { best = { d: Math.max(d, best.d), n: Math.max(deliveries, best.n) }; store.set('taxiBest', best); }
    $('#tFinal').textContent = d; $('#tFinD').textContent = deliveries; $('#tFinS').textContent = starCount;
    $('#tOverT').textContent = isBest && d > 50 ? '🏆 رقم قياسي جديد!' : 'انتهت الرحلة! 🚕';
    const msg = deliveries >= 10 ? App.g('أنتِ أمهر سائقة تاكسي في المدينة! 👑', 'أنت أمهر سائق تاكسي في المدينة! 👑')
      : deliveries >= 3 ? 'الركّاب سعداء جدًا بك 😊' : deliveries >= 1 ? App.g('أحسنتِ! وصّلتِ الركّاب بأمان 💛', 'أحسنت! وصّلت الركّاب بأمان 💛')
      : App.g('توقّفي عند الراكب الذي يلوّح لتوصليه 🙋', 'توقّف عند الراكب الذي يلوّح لتوصله 🙋');
    $('#tOverP').textContent = msg;
    $('#tBestL').textContent = `🏆 الأفضل: ${best.d} م · 🧍 ${best.n}`;
    $('#tMis').classList.remove('on'); lastMisKey = '';
    const reward = deliveries + Math.floor(d / 500);
    setTimeout(() => { if (state !== 'over') return; $('#tOver').classList.add('on'); Sound.lose(); if (reward) App.addStars(reward); }, 300);
  }

  /* =====================================================================
     الرسم
     ===================================================================== */
  function star(c, x, y, r, fill, stroke, rot = 0) {
    c.save(); c.translate(x, y); c.rotate(rot); c.beginPath();
    for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, rr = i % 2 ? r * .46 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    c.closePath(); c.fillStyle = fill; c.fill(); if (stroke) { c.strokeStyle = stroke; c.lineWidth = Math.max(1, r * .14); c.lineJoin = 'round'; c.stroke(); }
    c.restore();
  }
  function heart(c, x, y, r, col) {
    c.save(); c.translate(x, y); c.fillStyle = col; c.beginPath();
    c.moveTo(0, r * .35); c.bezierCurveTo(-r * 1.2, -r * .4, -r * .5, -r * 1.2, 0, -r * .45); c.bezierCurveTo(r * .5, -r * 1.2, r * 1.2, -r * .4, 0, r * .35); c.fill(); c.restore();
  }
  function cloud(c, x, y, s) {
    c.beginPath(); c.arc(x, y, 18 * s, 0, TAU); c.arc(x + 20 * s, y - 10 * s, 22 * s, 0, TAU); c.arc(x + 44 * s, y - 2 * s, 17 * s, 0, TAU); c.arc(x + 24 * s, y + 6 * s, 16 * s, 0, TAU); c.fill();
  }

  /* ---------- التاكسي (الأصل عند منتصف الأرض تحته، الأمام = +x) ---------- */
  function bodyPath(c) {
    c.beginPath();
    c.moveTo(-56, -14);
    c.quadraticCurveTo(-64, -16, -63, -30);
    c.lineTo(-62, -46);
    c.quadraticCurveTo(-61, -55, -50, -56);
    c.lineTo(-42, -57);
    c.quadraticCurveTo(-38, -86, -16, -87);
    c.lineTo(12, -87);
    c.quadraticCurveTo(26, -87, 34, -74);
    c.lineTo(44, -57);
    c.quadraticCurveTo(62, -55, 63, -42);
    c.lineTo(64, -24);
    c.quadraticCurveTo(63, -14, 54, -14);
    c.closePath();
  }
  function wheel(c, x, rot) {
    c.save(); c.translate(x, -15);
    c.fillStyle = '#2B2B33'; c.beginPath(); c.arc(0, 0, 15, 0, TAU); c.fill();
    c.fillStyle = '#3C3C47'; c.beginPath(); c.arc(0, 0, 12.5, 0, TAU); c.fill();
    const g = c.createRadialGradient(-2, -3, 1, 0, 0, 9); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#AEB6C8');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, 8.5, 0, TAU); c.fill();
    c.rotate(rot); c.strokeStyle = '#8A93A8'; c.lineWidth = 2; c.lineCap = 'round';
    for (let i = 0; i < 5; i++) { const a = i * TAU / 5; c.beginPath(); c.moveTo(Math.cos(a) * 2.5, Math.sin(a) * 2.5); c.lineTo(Math.cos(a) * 7, Math.sin(a) * 7); c.stroke(); }
    c.fillStyle = '#FFC21E'; c.beginPath(); c.arc(0, 0, 2.6, 0, TAU); c.fill();
    c.restore();
  }
  function drawHead(c, look, mood, t, s = 1) {
    // رأس صغير (للنافذة وللشخصيات) — المركز عند 0،0 ونصف القطر 10*s
    c.save(); c.scale(s, s);
    const k = look.kind;
    if (k === 'hijab') { c.fillStyle = look.acc; c.beginPath(); c.arc(0, -1, 13, 0, TAU); c.fill(); c.beginPath(); c.moveTo(-12, 2); c.quadraticCurveTo(0, 22, 12, 2); c.fill(); }
    if (k === 'pigtails' || k === 'ponytail' || k === 'grandma' || k === 'curly') c.fillStyle = look.hair;
    if (k === 'pigtails') { c.beginPath(); c.arc(-12, 2, 5.5, 0, TAU); c.arc(12, 2, 5.5, 0, TAU); c.fill(); c.fillStyle = look.acc; c.beginPath(); c.arc(-10, -4, 2.6, 0, TAU); c.arc(10, -4, 2.6, 0, TAU); c.fill(); }
    if (k === 'ponytail') { c.beginPath(); c.ellipse(-12, 2, 5, 9, .4 + Math.sin(t * 6) * .15, 0, TAU); c.fill(); }
    if (k === 'grandma') { c.beginPath(); c.arc(0, -12, 6, 0, TAU); c.fill(); }
    c.fillStyle = look.skin; c.beginPath(); c.arc(0, 0, 10, 0, TAU); c.fill();
    if (k === 'hijab') { c.strokeStyle = look.acc; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 10.5, 0, TAU); c.stroke(); }
    c.fillStyle = look.hair;
    if (k === 'pigtails' || k === 'ponytail' || k === 'grandma') { c.beginPath(); c.arc(0, -2, 10.3, Math.PI * 1.02, Math.PI * 1.98); c.quadraticCurveTo(2, -6, -10, -1); c.fill(); }
    if (k === 'curly') { for (let i = 0; i < 7; i++) { const a = Math.PI + i * Math.PI / 6; c.beginPath(); c.arc(Math.cos(a) * 9, Math.sin(a) * 9 - 1, 4.2, 0, TAU); c.fill(); } }
    if (k === 'grandpa') { c.beginPath(); c.arc(-9, -1, 4, 0, TAU); c.arc(9, -1, 4, 0, TAU); c.fill(); c.fillStyle = '#E8E8EE'; c.beginPath(); c.ellipse(0, 4.5, 5, 2, 0, 0, TAU); c.fill(); }
    if (k === 'cap') { c.fillStyle = look.acc; c.beginPath(); c.arc(0, -3, 10.4, Math.PI, 0); c.fill(); c.fillRect(-1, -4.5, 15, 3.2); }
    if (k === 'hat') { c.fillStyle = look.acc; c.beginPath(); c.ellipse(0, -7, 15, 3.4, 0, 0, TAU); c.fill(); c.beginPath(); c.roundRect(-8, -16, 16, 10, 3); c.fill(); c.fillStyle = 'rgba(0,0,0,.2)'; c.fillRect(-8, -9, 16, 2.4); }
    // الوجه
    const ex = 3.8;
    c.fillStyle = '#2B1A12'; c.strokeStyle = '#2B1A12'; c.lineWidth = 1.5; c.lineCap = 'round';
    if (mood === 'happy') { c.beginPath(); c.arc(-ex, 0, 2, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); c.beginPath(); c.arc(ex, 0, 2, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); }
    else { c.beginPath(); c.arc(-ex, -.5, 1.6, 0, TAU); c.arc(ex, -.5, 1.6, 0, TAU); c.fill(); }
    if (k === 'grandpa' || k === 'grandma') { c.strokeStyle = '#5B4A7A'; c.lineWidth = 1; c.beginPath(); c.arc(-ex, -.5, 3, 0, TAU); c.moveTo(ex + 3, -.5); c.arc(ex, -.5, 3, 0, TAU); c.stroke(); }
    c.strokeStyle = '#2B1A12'; c.lineWidth = 1.4;
    if (mood === 'sad') { c.beginPath(); c.arc(0, 7, 3, Math.PI * 1.2, Math.PI * 1.8); c.stroke(); c.fillStyle = '#7FD0FF'; c.beginPath(); c.ellipse(-ex - 1, 3.5, 1.2, 2, 0, 0, TAU); c.fill(); }
    else if (mood === 'wow') { c.fillStyle = '#B03040'; c.beginPath(); c.ellipse(0, 5, 2, 2.6, 0, 0, TAU); c.fill(); }
    else { c.fillStyle = '#B03040'; c.beginPath(); c.arc(0, 3.5, 3.4, .1, Math.PI - .1); c.fill(); }
    c.fillStyle = 'rgba(255,110,140,.45)'; c.beginPath(); c.arc(-7, 3, 2.2, 0, TAU); c.arc(7, 3, 2.2, 0, TAU); c.fill();
    c.restore();
  }
  function drawPerson(c, p, t, mood) {
    // الأقدام عند 0، الطول ~ 58 وحدة
    const L = p.look, sm = L.small ? .86 : 1, walk = p.state === 'walk' || p.state === 'out';
    c.save(); c.scale(sm, sm);
    const sw = walk ? Math.sin(t * 14) : 0;
    c.fillStyle = 'rgba(0,0,0,.15)'; c.beginPath(); c.ellipse(0, 0, 13, 3.5, 0, 0, TAU); c.fill();
    // الساقان
    c.strokeStyle = L.dress ? L.skin : '#3E4A7A'; c.lineWidth = 5; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-4, -18); c.lineTo(-4 + sw * 4, -3); c.moveTo(4, -18); c.lineTo(4 - sw * 4, -3); c.stroke();
    c.fillStyle = '#4A3428'; c.beginPath(); c.ellipse(-3 + sw * 4, -2, 4.5, 2.6, 0, 0, TAU); c.ellipse(5 - sw * 4, -2, 4.5, 2.6, 0, 0, TAU); c.fill();
    // الجسم
    if (L.kind === 'cap') { c.fillStyle = L.acc; c.beginPath(); c.roundRect(-14, -36, 8, 16, 3); c.fill(); }
    const g = c.createLinearGradient(0, -40, 0, -14); g.addColorStop(0, L.top); g.addColorStop(1, mix(L.top.length === 7 ? L.top : '#888888', '#000000', .2));
    c.fillStyle = g; c.beginPath();
    if (L.dress) { c.moveTo(-7, -40); c.lineTo(7, -40); c.lineTo(13, -14); c.lineTo(-13, -14); }
    else { c.roundRect(-9, -40, 18, 24, 6); }
    c.fill();
    if (!L.dress) { c.fillStyle = '#3E4A7A'; c.fillRect(-8.5, -19, 17, 4); }
    // الذراعان
    c.strokeStyle = L.top; c.lineWidth = 5;
    const wave = p.state === 'wait' ? Math.sin(t * (p.excite > 0 ? 18 : 9)) : 0;
    const happyArms = mood === 'happy' && (p.state === 'out');
    c.beginPath(); c.moveTo(-7, -36);
    if (happyArms) c.lineTo(-15, -52 - Math.sin(t * 12) * 3); else c.lineTo(-11, -22);
    c.moveTo(7, -36);
    if (p.state === 'wait') c.lineTo(15 + wave * 3, -54);
    else if (happyArms) c.lineTo(15, -52 + Math.sin(t * 12) * 3);
    else if (mood === 'sad') c.lineTo(10, -22);
    else c.lineTo(11 - sw * 3, -22);
    c.stroke();
    c.fillStyle = L.skin; c.beginPath();
    if (p.state === 'wait') c.arc(15 + wave * 3, -56, 3.4, 0, TAU);
    c.fill();
    if (L.kind === 'grandpa') { c.strokeStyle = '#8B5A2B'; c.lineWidth = 2.2; c.beginPath(); c.moveTo(-12, -22); c.lineTo(-14, -1); c.stroke(); }
    c.save(); c.translate(0, -50); drawHead(c, L, mood, t, 1.05); c.restore();
    c.restore();
  }
  function bubble(c, x, y, s, emoji, t) {
    c.save(); c.translate(x, y + Math.sin(t * 3) * 2 * s); c.scale(s, s);
    c.fillStyle = 'rgba(0,0,0,.12)'; c.beginPath(); c.roundRect(-21, -19, 44, 38, 14); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-22, -22, 44, 38, 14); c.fill();
    c.beginPath(); c.moveTo(-6, 14); c.lineTo(-12, 26); c.lineTo(4, 15); c.fill();
    c.font = `24px ${EMOJI}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(emoji, 0, -2);
    c.restore();
  }

  /** يرسم التاكسي. st = حالة التاكسي، t = الزمن */
  function drawTaxi(c, st, t, pax) {
    const hurt = st.hurt > 0, happy = st.happy > 0 && !hurt, sad = st.sad > 0;
    const honkS = st.honk > .4 ? Math.sin((.8 - st.honk) * 40) * .04 : 0;
    // الظل
    c.save();
    // العادم
    c.fillStyle = '#7C8396'; c.beginPath(); c.roundRect(-70, -22, 10, 5, 2); c.fill();
    if (st.nitro > 0) {
      const fl = 22 + Math.sin(t * 50) * 6;
      const g = c.createLinearGradient(-64, 0, -64 - fl * 2.4, 0); g.addColorStop(0, '#FFF6B0'); g.addColorStop(.35, '#FFB21E'); g.addColorStop(1, 'rgba(255,60,30,0)');
      c.fillStyle = g; c.beginPath(); c.moveTo(-62, -32); c.quadraticCurveTo(-64 - fl * 2.6, -20 + Math.sin(t * 40) * 3, -62, -10); c.fill();
      c.fillStyle = '#fff'; c.globalAlpha = .7; c.beginPath(); c.ellipse(-70, -21, 10, 4, 0, 0, TAU); c.fill(); c.globalAlpha = 1;
    }
    wheel(c, -36, st.wheel); wheel(c, 38, st.wheel);
    c.scale(1 + honkS, 1 - honkS);
    // الجسم
    const bg = c.createLinearGradient(0, -88, 0, -14); bg.addColorStop(0, '#FFE45C'); bg.addColorStop(.55, '#FFC21E'); bg.addColorStop(1, '#F29A00');
    c.fillStyle = bg; bodyPath(c); c.fill();
    c.save(); bodyPath(c); c.clip();
    // شريط المربّعات
    for (let i = 0; i < 16; i++) for (let j = 0; j < 2; j++) { c.fillStyle = (i + j) % 2 ? '#2B2B33' : '#FFFFFF'; c.fillRect(-64 + i * 8, -45 + j * 6, 8, 6); }
    // لمعة علوية
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-8, -82, 34, 4, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(160,80,0,.18)'; c.fillRect(-70, -22, 140, 10);
    c.restore();
    c.strokeStyle = '#C77700'; c.lineWidth = 2; bodyPath(c); c.stroke();
    // خط الباب ومقبضه
    c.strokeStyle = 'rgba(160,90,0,.55)'; c.lineWidth = 1.4; c.beginPath(); c.moveTo(-8, -56); c.lineTo(-8, -20); c.stroke();
    c.fillStyle = '#C77700'; c.beginPath(); c.roundRect(-24, -52, 9, 3, 1.5); c.fill(); c.beginPath(); c.roundRect(14, -52, 9, 3, 1.5); c.fill();
    // النافذة الخلفية والراكب
    c.save(); c.beginPath(); c.moveTo(-36, -58); c.quadraticCurveTo(-33, -80, -16, -81); c.lineTo(-10, -81); c.lineTo(-10, -58); c.closePath();
    const wg = c.createLinearGradient(0, -81, 0, -58); wg.addColorStop(0, '#CFEFFF'); wg.addColorStop(1, '#8CCBF0');
    c.fillStyle = wg; c.fill(); c.clip();
    if (pax) { c.save(); c.translate(-21, -64 + Math.sin(t * 8) * .8); drawHead(c, pax.look, sad ? 'sad' : happy ? 'happy' : 'smile', t, 1.15); c.restore(); }
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.moveTo(-30, -60); c.lineTo(-22, -80); c.lineTo(-17, -80); c.lineTo(-25, -60); c.fill();
    c.restore();
    // الزجاج الأمامي (مكان العيون)
    c.beginPath(); c.moveTo(-5, -58); c.lineTo(-5, -81); c.lineTo(11, -81); c.quadraticCurveTo(22, -81, 29, -71); c.lineTo(38, -58); c.closePath();
    const fg = c.createLinearGradient(0, -81, 0, -58); fg.addColorStop(0, '#DDF5FF'); fg.addColorStop(1, '#9AD4F4');
    c.fillStyle = fg; c.fill();
    // الحواجب
    const browUp = (!st.ground && st.vy > 0) ? 4 : happy ? 2 : 0, browAng = st.nitro > 0 ? .3 : hurt ? -.25 : sad ? -.3 : 0;
    c.strokeStyle = '#5A3300'; c.lineWidth = 3; c.lineCap = 'round';
    [[8, -85, 11], [27, -83, 9]].forEach(([x, y, w], i) => { c.save(); c.translate(x, y - browUp); c.rotate(i ? browAng : -browAng); c.beginPath(); c.moveTo(-w * .6, 0); c.quadraticCurveTo(0, -3, w * .6, 0); c.stroke(); c.restore(); });
    // العيون الكبيرة المتحرّكة
    [[8, -69, 11.5, 0], [27, -68, 10, 1]].forEach(([x, y, r, i]) => {
      c.save(); c.translate(x, y);
      if (hurt) { // عيون مغمضة من الألم > <
        c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
        c.strokeStyle = '#2B1A12'; c.lineWidth = 3; c.beginPath();
        const d = i ? -1 : 1; c.moveTo(-r * .5 * d, -r * .45); c.lineTo(r * .4 * d, 0); c.lineTo(-r * .5 * d, r * .45); c.stroke();
      } else if (happy) { // ^ ^
        c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
        c.strokeStyle = '#2B1A12'; c.lineWidth = 3.4; c.beginPath(); c.arc(0, r * .3, r * .55, Math.PI * 1.15, Math.PI * 1.85); c.stroke();
      } else {
        const g = c.createRadialGradient(-r * .3, -r * .35, 1, 0, 0, r); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#E2E8F0');
        c.fillStyle = g; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
        c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 1.2; c.stroke();
        const e = st.eyes[i], pr = r * .5;
        c.fillStyle = '#1E1A22'; c.beginPath(); c.arc(e.x * r / 11, e.y * r / 11, pr, 0, TAU); c.fill();
        c.fillStyle = '#fff'; c.beginPath(); c.arc(e.x * r / 11 - pr * .35, e.y * r / 11 - pr * .4, pr * .32, 0, TAU); c.fill();
        // الجفن: رمش أو حزن
        const lid = st.blink > 0 ? 1 : sad ? .45 : st.nitro > 0 ? .3 : 0;
        if (lid) { c.save(); c.beginPath(); c.arc(0, 0, r + .5, 0, TAU); c.clip(); c.fillStyle = '#FFD233'; c.fillRect(-r - 1, -r - 1, r * 2 + 2, (r * 2 + 2) * lid); c.strokeStyle = '#C77700'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-r, -r - 1 + (r * 2 + 2) * lid); c.lineTo(r, -r - 1 + (r * 2 + 2) * lid); c.stroke(); c.restore(); }
      }
      c.restore();
    });
    // الأنف المضحك (المصدّ)
    const ng = c.createRadialGradient(64, -33, 1, 66, -30, 10); ng.addColorStop(0, '#FFB3A8'); ng.addColorStop(.5, '#FF5E5E'); ng.addColorStop(1, '#C62828');
    c.fillStyle = ng; c.beginPath(); c.ellipse(66, -30, 8.5 + (st.honk > .4 ? 2 : 0), 7.5 + (st.honk > .4 ? 1.5 : 0), 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.ellipse(64, -33.5, 2.6, 1.6, -.4, 0, TAU); c.fill();
    // الفم
    c.strokeStyle = '#7A3A00'; c.lineWidth = 2.4; c.lineCap = 'round';
    if (hurt) { c.beginPath(); c.moveTo(44, -21); for (let i = 1; i <= 4; i++) c.lineTo(44 + i * 4, -21 + (i % 2 ? -2 : 2)); c.stroke(); }
    else if (!st.ground && st.vy > 0 || st.honk > .4) { c.fillStyle = '#7A1F1F'; c.beginPath(); c.ellipse(52, -21, 4, 4.5, 0, 0, TAU); c.fill(); }
    else if (sad) { c.beginPath(); c.arc(52, -16, 6, Math.PI * 1.2, Math.PI * 1.8); c.stroke(); }
    else {
      c.fillStyle = '#7A1F1F'; c.beginPath(); c.moveTo(43, -25); c.quadraticCurveTo(52, happy ? -12 : -16, 59, -24); c.closePath(); c.fill();
      c.fillStyle = '#fff'; c.fillRect(46, -24.5, 9, 2.2);
    }
    // المصباح الأمامي والخلفي
    c.fillStyle = '#FFF8D0'; c.beginPath(); c.ellipse(58, -46, 4, 3, .2, 0, TAU); c.fill();
    c.fillStyle = '#FF5E5E'; c.beginPath(); c.roundRect(-64, -48, 4, 8, 2); c.fill();
    // لوحة «تاكسي»
    c.fillStyle = '#C77700'; c.fillRect(-4, -91, 3, 5);
    const sg = c.createLinearGradient(0, -104, 0, -89); sg.addColorStop(0, '#FFFFFF'); sg.addColorStop(1, '#FFE7A3');
    c.fillStyle = sg; c.beginPath(); c.roundRect(-20, -104, 34, 14, 5); c.fill();
    c.strokeStyle = '#C77700'; c.lineWidth = 1.5; c.stroke();
    c.fillStyle = '#B85A00'; c.font = `900 10px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('تاكسي', -3, -96.5);
    c.restore();
  }

  /* ---------- العوائق ---------- */
  function drawObs(c, o, t) {
    c.save();
    if (o.type === 'cone') {
      for (let i = 0; i < o.n; i++) {
        c.save(); c.translate(18 + i * 42, 0);
        c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(0, 0, 20, 4, 0, 0, TAU); c.fill();
        c.fillStyle = '#E8660C'; c.beginPath(); c.roundRect(-18, -6, 36, 6, 2); c.fill();
        const g = c.createLinearGradient(-12, 0, 12, 0); g.addColorStop(0, '#FF9A3C'); g.addColorStop(.5, '#FF7A1A'); g.addColorStop(1, '#D9580A');
        c.fillStyle = g; c.beginPath(); c.moveTo(-13, -6); c.lineTo(-3, -46); c.quadraticCurveTo(0, -48, 3, -46); c.lineTo(13, -6); c.closePath(); c.fill();
        c.fillStyle = '#fff'; c.beginPath(); c.moveTo(-10, -16); c.lineTo(-7.5, -26); c.lineTo(7.5, -26); c.lineTo(10, -16); c.fill();
        c.beginPath(); c.moveTo(-6, -32); c.lineTo(-4.6, -38); c.lineTo(4.6, -38); c.lineTo(6, -32); c.fill();
        c.restore();
      }
    } else if (o.type === 'box') {
      const n = o.n;
      c.fillStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.ellipse(26, 0, 30, 5, 0, 0, TAU); c.fill();
      for (let i = 0; i < n; i++) {
        const y = -46 * (i + 1), wob = i ? Math.sin(t * 3 + o.t) * 1.5 : 0;
        c.save(); c.translate(wob, 0);
        const g = c.createLinearGradient(0, y, 0, y + 46); g.addColorStop(0, '#E8B878'); g.addColorStop(1, '#C48A4A');
        c.fillStyle = g; c.beginPath(); c.roundRect(2, y + 1, 48, 45, 4); c.fill();
        c.strokeStyle = '#9A6A34'; c.lineWidth = 1.6; c.stroke();
        c.fillStyle = 'rgba(255,240,200,.75)'; c.fillRect(21, y + 1, 10, 45);
        if (o.face && i === n - 1) { // صندوق نعسان
          c.strokeStyle = '#5A3A1A'; c.lineWidth = 2; c.beginPath(); c.arc(14, y + 22, 3.5, .2, Math.PI - .2); c.moveTo(42, y + 22); c.arc(38, y + 22, 3.5, .2, Math.PI - .2); c.stroke();
          c.fillStyle = 'rgba(255,120,120,.5)'; c.beginPath(); c.arc(10, y + 30, 3, 0, TAU); c.arc(42, y + 30, 3, 0, TAU); c.fill();
        } else { c.fillStyle = '#9A6A34'; c.font = `bold 12px ${EMOJI}`; c.textAlign = 'center'; c.fillText('↑↑', 11, y + 14); }
        c.restore();
      }
    } else if (o.type === 'puddle') {
      const g = c.createRadialGradient(o.w / 2, 2, 4, o.w / 2, 2, o.w / 2); g.addColorStop(0, '#BDEBFF'); g.addColorStop(1, '#4FA8E0');
      c.fillStyle = o.hit ? 'rgba(79,168,224,.5)' : g; c.beginPath(); c.ellipse(o.w / 2, 2, o.w / 2, 9, 0, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1.5;
      const r = (t * 1.3 + o.t) % 1;
      c.globalAlpha = 1 - r; c.beginPath(); c.ellipse(o.w * .4, 2, 8 + r * 22, 2 + r * 4, 0, 0, TAU); c.stroke(); c.globalAlpha = 1;
      c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.ellipse(o.w * .7, 0, 9, 2, 0, 0, TAU); c.fill();
    } else if (o.type === 'hole') {
      c.fillStyle = '#2A2A30'; c.beginPath(); c.ellipse(o.w / 2, 4, o.w / 2, 10, 0, 0, TAU); c.fill();
      c.fillStyle = '#16161A'; c.beginPath(); c.ellipse(o.w / 2, 6, o.w / 2 - 6, 7, 0, 0, TAU); c.fill();
      c.strokeStyle = '#3A3A44'; c.lineWidth = 2; c.beginPath(); c.moveTo(-4, 0); c.lineTo(-14, -3); c.moveTo(o.w + 2, 4); c.lineTo(o.w + 12, 8); c.stroke();
      // لافتة تحذير صغيرة قبل الحفرة
      c.save(); c.translate(-40, 0);
      c.fillStyle = '#7C8396'; c.fillRect(-1.5, -40, 3, 40);
      c.fillStyle = '#FFD43B'; c.beginPath(); c.moveTo(0, -60); c.lineTo(13, -38); c.lineTo(-13, -38); c.closePath(); c.fill();
      c.strokeStyle = '#2B2B33'; c.lineWidth = 2; c.stroke();
      c.fillStyle = '#2B2B33'; c.fillRect(-1.2, -54, 2.4, 9); c.fillRect(-1.2, -43, 2.4, 2.4);
      c.restore();
    } else if (o.type === 'cat') {
      const aw = o.awake;
      c.translate(o.w / 2, 0);
      if (!aw) { c.fillStyle = 'rgba(0,0,0,.15)'; c.beginPath(); c.ellipse(0, 0, 28, 4, 0, 0, TAU); c.fill(); }
      const step = Math.sin(t * 8 + o.t);
      // الذيل
      c.strokeStyle = o.c; c.lineWidth = 6; c.lineCap = 'round';
      c.beginPath(); c.moveTo(20, -14); c.quadraticCurveTo(34, -18 + Math.sin(t * 3) * 5, 30, -32); c.stroke();
      // الأرجل
      c.strokeStyle = o.c; c.lineWidth = 5;
      c.beginPath(); c.moveTo(-12, -10); c.lineTo(-12 + step * 3, -2); c.moveTo(12, -10); c.lineTo(12 - step * 3, -2); c.stroke();
      // الجسم
      c.fillStyle = o.c; c.beginPath(); c.ellipse(4, -16, 22, 11, 0, 0, TAU); c.fill();
      c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(2, -10, 12, 4, 0, 0, TAU); c.fill();
      // الرأس (يتجه يسارًا نحو التاكسي)
      c.save(); c.translate(-20, -26);
      c.beginPath(); c.moveTo(-10, -6); c.lineTo(-9, -18); c.lineTo(-2, -10); c.moveTo(10, -6); c.lineTo(9, -18); c.lineTo(2, -10); c.fill();
      c.beginPath(); c.arc(0, -2, 12, 0, TAU); c.fill();
      c.fillStyle = '#FFB0C8'; c.beginPath(); c.moveTo(-7.5, -10); c.lineTo(-7, -15); c.lineTo(-4, -10.5); c.moveTo(7.5, -10); c.lineTo(7, -15); c.lineTo(4, -10.5); c.fill();
      c.strokeStyle = o.c === '#3D3D46' ? '#fff' : '#3A2418'; c.fillStyle = c.strokeStyle; c.lineWidth = 1.8;
      if (aw) { c.beginPath(); c.arc(-4.5, -3, 3, 0, TAU); c.arc(4.5, -3, 3, 0, TAU); c.fill(); }
      else { c.beginPath(); c.arc(-4.5, -3, 2.6, .2, Math.PI - .2); c.stroke(); c.beginPath(); c.arc(4.5, -3, 2.6, .2, Math.PI - .2); c.stroke(); }
      c.fillStyle = '#FF6FA0'; c.beginPath(); c.arc(0, 1, 1.8, 0, TAU); c.fill();
      c.lineWidth = .9; c.beginPath(); c.moveTo(-3, 2); c.lineTo(-13, 0); c.moveTo(-3, 3); c.lineTo(-13, 4); c.moveTo(3, 2); c.lineTo(13, 0); c.moveTo(3, 3); c.lineTo(13, 4); c.stroke();
      c.restore();
      if (!aw) { // Zzz
        c.fillStyle = '#5B6CFF'; c.font = `900 13px ${FONT}`; c.textAlign = 'center';
        for (let i = 0; i < 3; i++) { const p = (t * .6 + i / 3) % 1; c.globalAlpha = 1 - p; c.font = `900 ${10 + p * 8}px ${FONT}`; c.fillText('z', -14 + p * 14, -44 - p * 26); }
        c.globalAlpha = 1;
      }
    } else if (o.type === 'bird') {
      const f = Math.sin(t * 14 + o.t) * 9;
      c.translate(o.w / 2, -o.h / 2);
      // ظل على الأرض
      c.save(); c.translate(0, o.y + 14); c.fillStyle = 'rgba(0,0,0,.12)'; c.beginPath(); c.ellipse(0, 0, 16, 3, 0, 0, TAU); c.fill(); c.restore();
      c.scale(-1, 1);
      c.fillStyle = o.c; c.beginPath(); c.ellipse(0, 0, 18, 12, 0, 0, TAU); c.fill();
      c.fillStyle = mix(o.c, '#FFFFFF', .45); c.beginPath(); c.moveTo(-6, -2); c.quadraticCurveTo(-2, -20 - f, 10, -6 - f * .5); c.closePath(); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(9, -4, 5, 0, TAU); c.fill();
      c.fillStyle = '#222'; c.beginPath(); c.arc(10.5, -4, 2.4, 0, TAU); c.fill();
      c.fillStyle = '#FFB21E'; c.beginPath(); c.moveTo(16, -1); c.lineTo(25, 2); c.lineTo(16, 5); c.fill();
      c.fillStyle = mix(o.c, '#000000', .2); c.beginPath(); c.moveTo(-16, 0); c.lineTo(-25, -6); c.lineTo(-24, 6); c.fill();
    }
    c.restore();
  }

  /* ---------- الخلفيات ---------- */
  const ZSKY = [['#7CC8FF', '#DDF3FF'], ['#FFB86B', '#FFEFC9'], ['#8FDCFF', '#E7FFE9']];
  const ZGROUND = ['#C9CDD8', '#F2CF8A', '#8ED46B'];
  const ZBOTTOM = [['#D8DCE6', '#BFC4D2'], ['#F6D99A', '#E7BD6E'], ['#7CCB5B', '#5DAE45']];
  function layer(c, p, sw, fn) {
    const o = camX * S * p, i0 = Math.floor(o / sw) - 1, i1 = Math.ceil((o + W) / sw) + 1;
    for (let i = i0; i <= i1; i++) fn(i, i * sw - o);
  }
  /* كل عنصر خلفية يأخذ منطقة الطريق التي دخل فيها الشاشة، فتتبدّل المناظر بانسياب */
  function zoneLayer(c, p, sw, fn) {
    layer(c, p, sw, (i, x) => {
      const enter = (i * sw - W) / (S * p) + TX;
      fn(Math.floor(Math.max(0, enter / 10) / ZONE_LEN) % 3, i, x);
    });
  }
  function drawScenery(c, t) {
    const B = HB, BH = HB;
    const u = Math.max(S, BH / 380);
    const COLS = ['#FF8FA3', '#FFB86B', '#7FD0FF', '#B9A2FF', '#8EE68E', '#FFD86B'];
    // الطبقة البعيدة
    zoneLayer(c, .12, 90 * u, (z, i, x) => {
      if (z === 0) {
        const h = BH * (.22 + h1(i, 1) * .3), w = 66 * u;
        c.fillStyle = '#A9C8EC'; c.fillRect(x, B - h, w, h);
        if (h1(i, 2) < .3) c.fillRect(x + w * .45, B - h - 18 * u, 3 * u, 18 * u);
        c.fillStyle = 'rgba(255,255,255,.35)';
        for (let yy = B - h + 8 * u; yy < B - 10 * u; yy += 14 * u) for (let xx = x + 7 * u; xx < x + w - 8 * u; xx += 12 * u) c.fillRect(xx, yy, 5 * u, 6 * u);
      } else if (z === 1) {
        c.fillStyle = h1(i, 16) < .5 ? '#F4C27A' : '#F0B866';
        c.beginPath(); c.ellipse(x + 45 * u, B + 4, 120 * u, BH * (.12 + h1(i, 17) * .12), 0, Math.PI, 0); c.fill();
      } else {
        c.fillStyle = h1(i, 10) < .5 ? '#9FDE8A' : '#8CD47A';
        c.beginPath(); c.ellipse(x + 45 * u, B + 4, 130 * u, BH * (.14 + h1(i, 11) * .14), 0, Math.PI, 0); c.fill();
      }
    });
    // الطبقة الوسطى
    zoneLayer(c, .32, 140 * u, (z, i, x) => {
      if (z === 0) {
        const h = BH * (.16 + h1(i, 3) * .16), w = 116 * u, col = COLS[Math.floor(h1(i, 4) * COLS.length)];
        const g = c.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, col); g.addColorStop(1, mix(col, '#000000', .12));
        c.fillStyle = g; c.beginPath(); c.roundRect(x, B - h, w, h + 2, [8 * u, 8 * u, 0, 0]); c.fill();
        c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(x, B - h, w, 5 * u);
        for (let yy = B - h + 12 * u; yy < B - 40 * u; yy += 22 * u) for (let k = 0; k < 3; k++) {
          const wx = x + 14 * u + k * 34 * u;
          c.fillStyle = '#FFF6D8'; c.beginPath(); c.roundRect(wx, yy, 18 * u, 13 * u, 3 * u); c.fill();
          c.fillStyle = 'rgba(80,140,200,.35)'; c.fillRect(wx, yy + 7 * u, 18 * u, 6 * u);
        }
        c.fillStyle = mix(col, '#000000', .35); c.beginPath(); c.roundRect(x + w * .42, B - 24 * u, 18 * u, 24 * u, [6 * u, 6 * u, 0, 0]); c.fill();
        if (h1(i, 5) < .5) {
          for (let k = 0; k < 6; k++) { c.fillStyle = k % 2 ? '#fff' : '#FF5E5E'; c.beginPath(); c.moveTo(x + k * w / 6, B - 32 * u); c.lineTo(x + (k + 1) * w / 6, B - 32 * u); c.lineTo(x + (k + 1) * w / 6, B - 26 * u); c.arc(x + (k + .5) * w / 6, B - 26 * u, w / 12, 0, Math.PI); c.fill(); }
        }
      } else if (z === 1) {
        const r = h1(i, 7);
        if (r < .45) {
          const s = (.6 + h1(i, 8) * .5) * u * 70;
          c.fillStyle = '#E8AE5C'; c.beginPath(); c.moveTo(x, B); c.lineTo(x + s, B - s * 1.05); c.lineTo(x + s * 2, B); c.fill();
          c.fillStyle = '#C98B3A'; c.beginPath(); c.moveTo(x + s, B - s * 1.05); c.lineTo(x + s * 2, B); c.lineTo(x + s * 1.25, B); c.fill();
          c.strokeStyle = 'rgba(160,100,40,.35)'; c.lineWidth = 1.5 * u;
          for (let k = 1; k < 5; k++) { const yy = B - s * 1.05 * k / 5, hw = s * (1 - k / 5); c.beginPath(); c.moveTo(x + s - hw, yy); c.lineTo(x + s + hw * .25, yy); c.stroke(); }
        } else if (r < .75) {
          const s = u * .9, cx = x + 60 * u, cy = B - 4 * u, st = Math.sin(T * 3 + i);
          c.fillStyle = '#C98B3A'; c.strokeStyle = '#C98B3A'; c.lineWidth = 5 * s; c.lineCap = 'round';
          c.beginPath(); for (const lx of [-18, -10, 12, 20]) { c.moveTo(cx + lx * s, cy - 24 * s); c.lineTo(cx + lx * s + st * 2, cy); } c.stroke();
          c.beginPath(); c.ellipse(cx, cy - 30 * s, 26 * s, 11 * s, 0, 0, TAU); c.fill();
          c.beginPath(); c.arc(cx - 6 * s, cy - 40 * s, 10 * s, Math.PI, 0); c.arc(cx + 10 * s, cy - 38 * s, 8 * s, Math.PI, 0); c.fill();
          c.lineWidth = 7 * s; c.beginPath(); c.moveTo(cx - 22 * s, cy - 32 * s); c.quadraticCurveTo(cx - 34 * s, cy - 40 * s, cx - 34 * s, cy - 56 * s); c.stroke();
          c.beginPath(); c.ellipse(cx - 38 * s, cy - 58 * s, 8 * s, 5 * s, 0, 0, TAU); c.fill();
          c.fillStyle = '#3A2418'; c.beginPath(); c.arc(cx - 40 * s, cy - 60 * s, 1.5 * s, 0, TAU); c.fill();
        }
      } else {
        const h = (60 + h1(i, 12) * 50) * u, r = (26 + h1(i, 13) * 14) * u, tx = x + 60 * u;
        c.fillStyle = '#8A5A34'; c.fillRect(tx - 4 * u, B - h, 9 * u, h);
        const col = h1(i, 14) < .3 ? '#FF9FC8' : h1(i, 14) < .45 ? '#FFC94D' : '#4FBF5A';
        c.fillStyle = col;
        c.beginPath(); c.arc(tx, B - h - r * .3, r, 0, TAU); c.arc(tx - r * .7, B - h + r * .2, r * .7, 0, TAU); c.arc(tx + r * .7, B - h + r * .2, r * .7, 0, TAU); c.fill();
        c.fillStyle = 'rgba(255,255,255,.22)'; c.beginPath(); c.arc(tx - r * .35, B - h - r * .65, r * .32, 0, TAU); c.fill();
      }
    });
    // الطبقة القريبة
    zoneLayer(c, .72, 210 * S, (z, i, x) => {
      const r = h1(i, z === 0 ? 6 : z === 1 ? 9 : 15);
      if (z === 0) {
        if (r < .5) {
          c.fillStyle = '#5A6378'; c.fillRect(x, B - 110 * S, 5 * S, 110 * S);
          c.beginPath(); c.moveTo(x + 2 * S, B - 110 * S); c.quadraticCurveTo(x + 4 * S, B - 124 * S, x + 26 * S, B - 120 * S); c.lineTo(x + 26 * S, B - 116 * S); c.lineTo(x + 5 * S, B - 110 * S); c.fill();
          c.fillStyle = '#FFF2B0'; c.beginPath(); c.ellipse(x + 26 * S, B - 114 * S, 8 * S, 4 * S, 0, 0, TAU); c.fill();
        } else {
          c.fillStyle = '#8A5A34'; c.fillRect(x + 8 * S, B - 40 * S, 6 * S, 40 * S);
          c.fillStyle = '#4FBF5A'; c.beginPath(); c.arc(x + 11 * S, B - 52 * S, 20 * S, 0, TAU); c.fill();
          c.fillStyle = 'rgba(255,255,255,.2)'; c.beginPath(); c.arc(x + 4 * S, B - 60 * S, 7 * S, 0, TAU); c.fill();
        }
      } else if (z === 1) {
        if (r < .45) {
          c.fillStyle = '#4FAE5A'; c.strokeStyle = '#4FAE5A'; c.lineCap = 'round';
          c.beginPath(); c.roundRect(x, B - 70 * S, 16 * S, 70 * S, 8 * S); c.fill();
          c.lineWidth = 9 * S; c.beginPath(); c.moveTo(x, B - 36 * S); c.lineTo(x - 12 * S, B - 36 * S); c.lineTo(x - 12 * S, B - 54 * S);
          c.moveTo(x + 16 * S, B - 46 * S); c.lineTo(x + 28 * S, B - 46 * S); c.lineTo(x + 28 * S, B - 62 * S); c.stroke();
          c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(x + 3 * S, B - 64 * S, 3 * S, 56 * S);
          c.fillStyle = '#FF7AB0'; c.beginPath(); c.arc(x + 8 * S, B - 72 * S, 5 * S, 0, TAU); c.fill();
        } else if (r < .8) {
          c.strokeStyle = '#A0703C'; c.lineWidth = 7 * S; c.lineCap = 'round';
          c.beginPath(); c.moveTo(x, B); c.quadraticCurveTo(x + 10 * S, B - 50 * S, x + 4 * S, B - 100 * S); c.stroke();
          c.fillStyle = '#3FA34D';
          for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * .55 + Math.sin(T * 2 + i) * .04; c.save(); c.translate(x + 4 * S, B - 100 * S); c.rotate(a); c.beginPath(); c.ellipse(24 * S, 0, 26 * S, 6 * S, .25, 0, TAU); c.fill(); c.restore(); }
          c.fillStyle = '#7A4A1E'; c.beginPath(); c.arc(x, B - 96 * S, 4 * S, 0, TAU); c.arc(x + 8 * S, B - 95 * S, 4 * S, 0, TAU); c.fill();
        } else { c.fillStyle = '#C9A06A'; c.beginPath(); c.ellipse(x, B, 18 * S, 12 * S, 0, Math.PI, 0); c.fill(); }
      } else {
        if (r < .5) {
          c.fillStyle = '#3FA34D'; c.beginPath(); c.arc(x, B, 18 * S, Math.PI, 0); c.arc(x + 22 * S, B, 15 * S, Math.PI, 0); c.fill();
          for (let k = 0; k < 4; k++) { c.fillStyle = ['#FF6FA8', '#FFD43B', '#fff', '#B48CFF'][(i + k) & 3]; c.beginPath(); c.arc(x - 8 * S + k * 10 * S, B - 12 * S - (k % 2) * 6 * S, 3.4 * S, 0, TAU); c.fill(); }
        } else if (r < .7) {
          c.fillStyle = '#B7793F'; c.fillRect(x, B - 22 * S, 50 * S, 5 * S); c.fillRect(x, B - 34 * S, 50 * S, 5 * S);
          c.fillStyle = '#5A6378'; c.fillRect(x + 4 * S, B - 22 * S, 4 * S, 22 * S); c.fillRect(x + 42 * S, B - 22 * S, 4 * S, 22 * S);
        } else {
          const fx = x + 20 * S, fy = B - 60 * S + Math.sin(T * 2 + i) * 12 * S, f = Math.abs(Math.sin(T * 12 + i));
          c.fillStyle = ['#FF8FB1', '#7FD0FF', '#FFD43B'][((i % 3) + 3) % 3];
          c.beginPath(); c.ellipse(fx - 5 * S * f, fy, 6 * S * f + 1, 7 * S, 0, 0, TAU); c.ellipse(fx + 5 * S * f, fy, 6 * S * f + 1, 7 * S, 0, 0, TAU); c.fill();
          c.fillStyle = '#3A2418'; c.fillRect(fx - 1, fy - 6 * S, 2, 12 * S);
        }
      }
    });
  }
  function skyFor(z) { return ZSKY[z]; }
  function drawBackground(c, t) {
    const zf = distM / ZONE_LEN, zA = Math.floor(zf) % 3, frac = zf - Math.floor(zf);
    const blend = clamp((frac - .85) / .15, 0, 1), zB = (zA + 1) % 3;
    const [a0, a1] = skyFor(zA), [b0, b1] = skyFor(zB);
    const g = c.createLinearGradient(0, 0, 0, HB); g.addColorStop(0, mix(a0, b0, blend)); g.addColorStop(1, mix(a1, b1, blend));
    c.fillStyle = g; c.fillRect(-20, -20, W + 40, HB + 22);
    // الشمس
    const sunX = W * .8, sunY = HB * .28;
    const sg = c.createRadialGradient(sunX, sunY, 4, sunX, sunY, 70); sg.addColorStop(0, 'rgba(255,250,210,1)'); sg.addColorStop(.35, 'rgba(255,230,120,.9)'); sg.addColorStop(1, 'rgba(255,230,120,0)');
    c.fillStyle = sg; c.beginPath(); c.arc(sunX, sunY, 70, 0, TAU); c.fill();
    // غيوم
    c.fillStyle = 'rgba(255,255,255,.85)';
    for (let i = 0; i < 5; i++) {
      const span = W + 260, x = ((i * 233 - camX * S * .05 - t * 8) % span + span) % span - 130;
      cloud(c, x, HB * (.12 + (i % 3) * .12), .8 + (i % 2) * .5);
    }
    drawScenery(c, t);
    // الرصيف خلف الطريق
    c.fillStyle = mix(ZGROUND[zA], ZGROUND[zB], blend); c.fillRect(-10, HB - 10 * S, W + 20, 12 * S);
    c.fillStyle = 'rgba(0,0,0,.08)'; c.fillRect(-10, HB - 2 * S, W + 20, 2 * S);
  }
  function drawRoad(c) {
    const top = HB, bot = GY + 40 * S;
    const g = c.createLinearGradient(0, top, 0, bot); g.addColorStop(0, '#666B7A'); g.addColorStop(1, '#4A4E5C');
    c.fillStyle = g; c.fillRect(-10, top, W + 20, bot - top);
    c.fillStyle = '#F1F1F5'; c.fillRect(-10, top, W + 20, 3 * S);
    // خط منقّط
    const dl = 50 * S, gap = 40 * S, o = (camX * S) % (dl + gap);
    c.fillStyle = '#FFE066';
    for (let x = -o - dl; x < W + dl; x += dl + gap) c.fillRect(x, top + 12 * S, dl, 4 * S);
    // حافة الرصيف الأمامية (مخطّطة)
    const cw = 40 * S, o2 = (camX * S) % (cw * 2);
    for (let x = -o2 - cw * 2; x < W + cw * 2; x += cw) { c.fillStyle = Math.round((x + o2) / cw) % 2 ? '#F23B3B' : '#FFFFFF'; c.fillRect(x, bot, cw, 8 * S); }
    // الأرض أسفل الطريق
    const zf = distM / ZONE_LEN, zA = Math.floor(zf) % 3, blend = clamp((zf - Math.floor(zf) - .9) / .1, 0, 1), zB = (zA + 1) % 3;
    const bg = c.createLinearGradient(0, bot + 8 * S, 0, H); bg.addColorStop(0, mix(ZBOTTOM[zA][0], ZBOTTOM[zB][0], blend)); bg.addColorStop(1, mix(ZBOTTOM[zA][1], ZBOTTOM[zB][1], blend));
    c.fillStyle = bg; c.fillRect(-10, bot + 8 * S, W + 20, H - bot);
    // نقوش متحرّكة على الأرض
    const tw = 60 * S, o3 = (camX * S) % tw;
    c.fillStyle = 'rgba(255,255,255,.18)';
    for (let x = -o3 - tw; x < W + tw; x += tw) for (let r = 0; r < 4; r++) { const yy = bot + 22 * S + r * 34 * S; if (yy > H) break; c.fillRect(x + (r % 2) * tw / 2, yy, tw * .45, 3 * S); }
  }

  /* ---------- مبانٍ الوجهات والمواقف ---------- */
  function drawStop(c, p, t) {
    c.save(); c.translate(sx(p.x), HB); c.scale(S, S);
    // مظلّة
    c.fillStyle = 'rgba(120,200,255,.35)'; c.fillRect(-70, -70, 56, 60);
    c.fillStyle = '#5A6378'; c.fillRect(-72, -74, 4, 74); c.fillRect(-16, -74, 4, 74);
    c.fillStyle = '#2D8FE0'; c.beginPath(); c.roundRect(-78, -82, 72, 10, 4); c.fill();
    c.fillStyle = '#B7793F'; c.fillRect(-66, -26, 48, 5);
    // العمود واللافتة
    c.fillStyle = '#7C8396'; c.fillRect(-2, -110, 4, 110);
    c.fillStyle = '#2D8FE0'; c.beginPath(); c.arc(0, -116, 15, 0, TAU); c.fill();
    c.strokeStyle = '#fff'; c.lineWidth = 2.5; c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-8, -124, 16, 13, 3); c.fill();
    c.fillStyle = '#2D8FE0'; c.fillRect(-6, -122, 12, 5); c.fillStyle = '#2B2B33'; c.beginPath(); c.arc(-4, -110, 2, 0, TAU); c.arc(4, -110, 2, 0, TAU); c.fill();
    c.restore();
  }
  function drawDest(c, p, t) {
    const d = p.dest, x = sx(p.x);
    if (x < -300 * S || x > W + 300 * S) return;
    c.save(); c.translate(x, HB); c.scale(S, S);
    if (p.fade) c.globalAlpha = .35;
    const bx = 30;
    if (d === 0) { // بيت
      c.fillStyle = '#FFF0DC'; c.fillRect(bx - 60, -90, 120, 90);
      c.fillStyle = '#FF6B5E'; c.beginPath(); c.moveTo(bx - 72, -86); c.lineTo(bx, -140); c.lineTo(bx + 72, -86); c.closePath(); c.fill();
      c.fillStyle = '#8A5A34'; c.beginPath(); c.roundRect(bx - 12, -46, 26, 46, [10, 10, 0, 0]); c.fill();
      c.fillStyle = '#9ED8FF'; c.fillRect(bx - 48, -66, 24, 22); c.fillRect(bx + 26, -66, 24, 22);
      c.fillStyle = '#B7793F'; c.fillRect(bx + 34, -132, 12, 26);
    } else if (d === 1) { // مدرسة
      c.fillStyle = '#FFE08A'; c.fillRect(bx - 80, -100, 160, 100);
      c.fillStyle = '#E8A93C'; c.fillRect(bx - 80, -106, 160, 10);
      c.fillStyle = '#FFE08A'; c.beginPath(); c.moveTo(bx - 26, -106); c.lineTo(bx, -136); c.lineTo(bx + 26, -106); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(bx, -116, 8, 0, TAU); c.fill(); c.strokeStyle = '#333'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(bx, -116); c.lineTo(bx, -121); c.moveTo(bx, -116); c.lineTo(bx + 4, -116); c.stroke();
      for (let k = 0; k < 4; k++) { c.fillStyle = '#9ED8FF'; c.fillRect(bx - 70 + k * 38, -86, 24, 20); }
      c.fillStyle = '#5BB8FF'; c.fillRect(bx - 14, -44, 28, 44);
      c.fillStyle = '#7C8396'; c.fillRect(bx + 90, -150, 3, 150); c.fillStyle = '#3FB43A'; c.fillRect(bx + 93, -150, 30, 18);
    } else if (d === 2) { // مستشفى
      c.fillStyle = '#FFFFFF'; c.fillRect(bx - 70, -130, 140, 130);
      c.fillStyle = '#DDE7F2'; c.fillRect(bx + 40, -130, 30, 130);
      c.fillStyle = '#F23B3B'; c.fillRect(bx - 8, -122, 16, 40); c.fillRect(bx - 20, -110, 40, 16);
      for (let k = 0; k < 3; k++) { c.fillStyle = '#9ED8FF'; c.fillRect(bx - 60 + k * 44, -70, 28, 20); }
      c.fillStyle = '#7FD0FF'; c.fillRect(bx - 18, -40, 36, 40);
    } else if (d === 3) { // سوق
      c.fillStyle = '#B9F0C5'; c.fillRect(bx - 76, -96, 152, 96);
      for (let k = 0; k < 8; k++) { c.fillStyle = k % 2 ? '#fff' : '#3FB43A'; c.beginPath(); c.moveTo(bx - 80 + k * 20, -98); c.lineTo(bx - 60 + k * 20, -98); c.lineTo(bx - 60 + k * 20, -86); c.arc(bx - 70 + k * 20, -86, 10, 0, Math.PI); c.fill(); }
      c.fillStyle = '#fff'; c.fillRect(bx - 60, -66, 120, 34);
      ['#FF5E5E', '#FFD43B', '#7ED957', '#FF9F43', '#B48CFF'].forEach((col, k) => { c.fillStyle = col; c.beginPath(); c.arc(bx - 46 + k * 23, -40, 8, 0, TAU); c.fill(); });
      c.fillStyle = '#3FB43A'; c.beginPath(); c.roundRect(bx - 50, -122, 100, 22, 8); c.fill();
    } else if (d === 4) { // شاطئ
      c.fillStyle = '#5BC0FF'; c.fillRect(bx - 110, -40, 220, 40);
      c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 2; c.beginPath();
      for (let x2 = -110; x2 < 110; x2 += 20) c.arc(bx + x2 + 10 + Math.sin(t * 2) * 4, -30, 6, Math.PI, 0); c.stroke();
      c.fillStyle = '#FFE3A3'; c.beginPath(); c.ellipse(bx, 0, 110, 14, 0, Math.PI, 0); c.fill();
      c.fillStyle = '#7C8396'; c.fillRect(bx - 30, -100, 3, 100);
      for (let k = 0; k < 6; k++) { c.fillStyle = k % 2 ? '#fff' : '#FF5E8A'; c.beginPath(); c.moveTo(bx - 29, -104); c.arc(bx - 29, -100, 46, Math.PI + k * Math.PI / 6, Math.PI + (k + 1) * Math.PI / 6); c.closePath(); c.fill(); }
      c.fillStyle = '#FFD43B'; c.beginPath(); c.arc(bx + 50, -10, 9, 0, TAU); c.fill();
    } else { // مدينة ملاهي
      const cx = bx, cy = -96, r = 70;
      c.strokeStyle = '#B48CFF'; c.lineWidth = 5; c.beginPath(); c.moveTo(cx - 40, 0); c.lineTo(cx, cy); c.lineTo(cx + 40, 0); c.stroke();
      c.strokeStyle = '#FF6FA8'; c.lineWidth = 4; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.stroke();
      c.lineWidth = 1.5;
      for (let k = 0; k < 8; k++) {
        const a = t * .5 + k * TAU / 8, px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
        c.strokeStyle = '#FFB0D0'; c.beginPath(); c.moveTo(cx, cy); c.lineTo(px, py); c.stroke();
        c.fillStyle = CLOTH[k % CLOTH.length]; c.beginPath(); c.roundRect(px - 8, py, 16, 12, 4); c.fill();
      }
      c.fillStyle = '#FFD43B'; c.beginPath(); c.arc(cx, cy, 7, 0, TAU); c.fill();
    }
    // لافتة الوجهة
    c.fillStyle = '#7C8396'; c.fillRect(-72, -64, 4, 64);
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-96, -104, 52, 42, 12); c.fill();
    c.strokeStyle = '#FFB21E'; c.lineWidth = 3; c.stroke();
    c.font = `28px ${EMOJI}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(DESTS[d].e, -70, -82);
    c.restore();
  }

  function draw(t) {
    const c = ctx; if (!c || !taxi) return;
    c.save();
    if (shake) c.translate(rand(-1, 1) * shake * 9, rand(-1, 1) * shake * 9);
    drawBackground(c, t);
    for (const p of props) if (p.kind === 'stop') drawStop(c, p, t);
    for (const p of props) if (p.kind === 'dest') drawDest(c, p, t);
    // الركّاب على الرصيف
    for (const p of paxList) {
      if (p.state === 'in') continue;
      const x = sx(p.x), y = lerp(HB, GY - 4 * S, p.d) - (p.y || 0) * S;
      if (x < -60 || x > W + 60) continue;
      const mood = p.state === 'sad' ? 'sad' : p.state === 'out' ? 'happy' : p.excite > 0 ? 'wow' : 'smile';
      if (p.state === 'poof') continue;
      c.save(); c.translate(x, y); c.scale(S * (1 + p.d * .1), S * (1 + p.d * .1));
      if (p.state === 'out') c.scale(-1, 1);
      drawPerson(c, p, t + p.t, mood);
      c.restore();
      if (p.state === 'wait') bubble(c, x + 26 * S, y - 82 * S, S, DESTS[p.dest].e, t + p.t);
      if (p.state === 'sad') bubble(c, x + 22 * S, y - 80 * S, S * .85, '😢', t);
      if (p.state === 'out' && p.t < 2) bubble(c, x - 24 * S, y - 82 * S, S * .9, '💛', t);
    }
    drawRoad(c);
    for (const p of props) if (p.kind === 'dest' && !p.fade) { // علامة مكان النزول
      const x = sx(p.x) - 22 * S, a = .45 + Math.sin(t * 5) * .15;
      c.fillStyle = `rgba(255,224,102,${a})`; c.beginPath(); c.ellipse(x, GY + 4 * S, 66 * S, 10 * S, 0, 0, TAU); c.fill();
      c.strokeStyle = `rgba(255,255,255,${a + .2})`; c.lineWidth = 2 * S; c.setLineDash([8 * S, 6 * S]); c.stroke(); c.setLineDash([]);
    }
    // النجوم
    for (const s of stars) {
      const x = sx(s.x); if (x < -30 || x > W + 30) continue;
      const y = sy(s.y + Math.sin(t * 4 + s.t) * 3);
      c.fillStyle = 'rgba(0,0,0,.08)'; c.beginPath(); c.ellipse(x, GY + 2 * S, 8 * S, 2 * S, 0, 0, TAU); c.fill();
      star(c, x, y, 12 * S, '#FFD84D', '#E89B0C', Math.sin(t * 2 + s.t) * .25);
      c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.arc(x - 3 * S, y - 3 * S, 2.2 * S, 0, TAU); c.fill();
    }
    // القوى الخاصة
    for (const p of pups) {
      const x = sx(p.x); if (x < -40 || x > W + 40) continue;
      const y = sy(p.y + Math.sin(p.t * 3 + t * 3) * 6);
      const r = 22 * S;
      const g = c.createRadialGradient(x - r * .3, y - r * .4, 2, x, y, r * 1.6);
      g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.6, p.type === 'magnet' ? 'rgba(255,140,140,.6)' : p.type === 'shield' ? 'rgba(140,210,255,.6)' : 'rgba(255,190,90,.6)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 1.6, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 2.5 * S; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
      c.font = `${Math.round(24 * S)}px ${EMOJI}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(PUPS[p.type].e, x, y + 1);
      c.strokeStyle = 'rgba(255,255,255,.7)'; c.beginPath(); c.arc(x, y, r + 6 * S + Math.sin(t * 6) * 2 * S, -1, .2); c.stroke();
    }
    // العوائق
    for (const o of obs) {
      if (o.gone && !o.awake && o.type !== 'hole') continue;
      const x = sx(o.x); if (x < -150 || x > W + 150) continue;
      c.save(); c.translate(x, sy(o.y)); c.scale(S, S); drawObs(c, o, t);
      c.restore();
    }
    // التاكسي
    const k = taxi;
    if (!(k.inv > 0 && k.nitro <= 0 && Math.floor(t * 14) % 2 && state !== 'crash')) {
      const x = sx(k.x), y = sy(k.y);
      // ظل
      const sh = clamp(1 - k.y / 300, .3, 1);
      c.fillStyle = `rgba(0,0,0,${.2 * sh})`; c.beginPath(); c.ellipse(x, GY + 2 * S, 62 * S * sh, 7 * S * sh, 0, 0, TAU); c.fill();
      c.save(); c.translate(x, y);
      const sq = k.squash * .14, stretch = k.ground ? 0 : clamp(k.vy / 6000, -.06, .1);
      const bob = k.ground && speed > 10 ? Math.sin(k.bob) * 1.2 : 0;
      c.scale(S * (1 + sq - stretch), S * (1 - sq + stretch));
      c.translate(0, bob);
      let rot = 0;
      if (!k.ground) rot = -clamp(k.vy / 4000, -.12, .14);
      if (k.spin > 0) rot -= (1 - k.spin) * TAU;
      if (state === 'crash') rot = Math.sin(t * 20) * .1;
      if (k.hurt > 0 && k.ground) rot += Math.sin(t * 40) * .04;
      if (rot) { c.translate(0, -45); c.rotate(rot); c.translate(0, 45); }
      drawTaxi(c, k, t, ride && ride.pax && ride.pax.state === 'in' ? ride.pax : null);
      if (k.wet > 0) { c.fillStyle = '#7FD0FF'; for (let i = 0; i < 4; i++) { const p = (t * 1.5 + i / 4) % 1; c.globalAlpha = (1 - p) * clamp(k.wet, 0, 1); c.beginPath(); c.ellipse(-40 + i * 26, -50 + p * 40, 2.2, 3.4, 0, 0, TAU); c.fill(); } c.globalAlpha = 1; }
      c.restore();
      if (k.honk > 0) { // موجات البوق
        c.save(); c.strokeStyle = `rgba(255,255,255,${k.honk})`; c.lineWidth = 3 * S; c.lineCap = 'round';
        for (let i = 0; i < 3; i++) { const r = (14 + i * 12 + (.8 - k.honk) * 40) * S; c.beginPath(); c.arc(x + 70 * S, y - 30 * S, r, -.6, .6); c.stroke(); }
        c.restore();
      }
      if (k.shield) {
        c.save(); c.globalAlpha = .55 + Math.sin(t * 5) * .12;
        const cx = x, cy = y - 48 * S, rr = 82 * S;
        const g = c.createRadialGradient(cx - 20 * S, cy - 26 * S, 6, cx, cy, rr); g.addColorStop(0, 'rgba(255,255,255,.08)'); g.addColorStop(.8, 'rgba(159,227,255,.3)'); g.addColorStop(1, 'rgba(110,190,255,.85)');
        c.fillStyle = g; c.beginPath(); c.ellipse(cx, cy, rr, rr * .78, 0, 0, TAU); c.fill();
        c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 3 * S; c.beginPath(); c.ellipse(cx, cy, rr, rr * .78, 0, -2.5, -1.7); c.stroke();
        c.restore();
      }
      if (k.magnet > 0) {
        c.save(); c.globalAlpha = .25 + Math.sin(t * 8) * .1; c.strokeStyle = '#FF5E5E'; c.lineWidth = 2 * S; c.setLineDash([6 * S, 8 * S]); c.lineDashOffset = -t * 40;
        c.beginPath(); c.arc(x, y - 40 * S, 110 * S, 0, TAU); c.stroke(); c.restore();
      }
      if (state === 'crash' || k.hurt > .3) for (let i = 0; i < 3; i++) { const a = t * 6 + i * 2.1; star(c, x + Math.cos(a) * 30 * S, y - 112 * S + Math.sin(a) * 6 * S, 6 * S, '#FFD84D', null, t); }
    }
    // الجسيمات
    for (const q of parts) {
      const a = clamp(q.life / q.max, 0, 1), x = sx(q.x), y = sy(q.y);
      c.globalAlpha = q.obj ? 1 : a;
      if (q.obj) { c.save(); c.translate(x, y); c.rotate(q.rot); c.scale(S, S); c.translate(-q.obj.w / 2, q.obj.h / 2); drawObs(c, Object.assign({}, q.obj, { gone: false, awake: 0 }), t); c.restore(); }
      else if (q.star) star(c, x, y, q.r * 1.6 * S, q.c, null, 0);
      else if (q.heart) heart(c, x, y, q.r * S, q.c);
      else if (q.ring) { c.strokeStyle = q.c; c.lineWidth = 4 * a * S; c.beginPath(); c.arc(x, y, (q.r + (1 - a) * 50) * S, 0, TAU); c.stroke(); }
      else if (q.conf) { c.save(); c.translate(x, y); c.rotate(q.rot); c.fillStyle = q.c; c.fillRect(-4 * S, -2 * S, 8 * S, 4 * S); c.restore(); }
      else { c.fillStyle = q.c; c.beginPath(); c.arc(x, y, q.r * S * (q.grow ? 1 + (1 - a) * 1.4 : q.fire ? .5 + a * .7 : 1.4 - a * .4), 0, TAU); c.fill(); }
    }
    c.globalAlpha = 1;
    // نصوص طائرة
    c.textAlign = 'center'; c.textBaseline = 'middle';
    for (const f of floats) {
      const a = clamp(f.life / f.max * 2, 0, 1), pop = 1 + Math.max(0, f.life - f.max + .2) * 2;
      c.globalAlpha = a; c.font = `900 ${Math.round(20 * S * pop)}px ${FONT}`;
      const x = clamp(sx(f.x), 90, W - 90), y = sy(f.y);
      c.lineWidth = 5; c.strokeStyle = '#fff'; c.lineJoin = 'round'; c.strokeText(f.text, x, y);
      c.fillStyle = f.c; c.fillText(f.text, x, y);
    }
    c.globalAlpha = 1;
    c.restore();
    if (flash) { c.fillStyle = `rgba(255,120,120,${flash * .35})`; c.fillRect(0, 0, W, H); }
  }

  function loop(ts) {
    raf = requestAnimationFrame(loop);
    const now = ts / 1000, dt = Math.min(.05, now - (last || now)); last = now;
    if (document.hidden) return;
    if (state === 'play' || state === 'ready' || state === 'crash' || state === 'over') {
      if (state === 'over' || state === 'ready') { // حركة خفيفة فقط
        T += dt; taxi.blinkT -= dt; if (taxi.blinkT <= 0) { taxi.blink = .14; taxi.blinkT = rand(2.2, 4.5); } taxi.blink = Math.max(0, taxi.blink - dt);
        taxi.honk = Math.max(0, taxi.honk - dt); taxi.bob += dt * 4;
        if (state === 'ready' && (T % .14) < dt) parts.push({ x: taxi.x - 66, y: 14, vx: -rand(30, 60), vy: rand(20, 50), g: -20, life: .8, max: .8, r: rand(4, 7), c: 'rgba(210,210,220,.75)', grow: 1 });
        for (const q of parts) { q.x += q.vx * dt; q.y += q.vy * dt; q.vy += q.g * dt; q.life -= dt; if (q.rot != null) q.rot += (q.vr || 6) * dt; }
        parts = parts.filter(q => q.life > 0);
        for (const f of floats) { f.life -= dt; f.y += 40 * dt; } floats = floats.filter(f => f.life > 0);
      } else { acc += dt; while (acc >= 1 / 120) { step(1 / 120); acc -= 1 / 120; if (state !== 'play' && state !== 'crash') break; } }
      uiT -= dt; if (uiT <= 0 && state === 'play') { uiT = .1; paintUI(); }
    }
    draw(now);
  }

  /* ---------- التحكم ---------- */
  let ptrId = null;
  cv.addEventListener('pointerdown', e => {
    if (state === 'ready') { start(); return; }
    if (state !== 'play') return;
    // لمس الراكب المنتظر = توقف
    if (stopAvailable()) {
      const px = sx(waiting.pax.x), py = HB - 30 * S;
      if (Math.abs(e.clientX - cv.getBoundingClientRect().left - px) < 60 * S && Math.abs(e.clientY - cv.getBoundingClientRect().top - py) < 70 * S) { requestStop(); return; }
    }
    ptrId = e.pointerId; jumpPress();
  });
  ['pointerup', 'pointercancel'].forEach(n => cv.addEventListener(n, e => { if (e.pointerId === ptrId) { ptrId = null; jumpRelease(); } }));
  const jb = root.querySelector('#tJump');
  jb.addEventListener('pointerdown', e => { e.preventDefault(); jb.classList.add('on'); jumpPress(); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(n => jb.addEventListener(n, () => { if (jb.classList.contains('on')) { jb.classList.remove('on'); jumpRelease(); } }));
  root.querySelector('#tHorn').addEventListener('pointerdown', e => { e.preventDefault(); honk(); if (state === 'ready') start(); });
  root.querySelector('#tStop').addEventListener('pointerdown', e => { e.preventDefault(); requestStop(); });
  let keyJump = false;
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    const k = e.key;
    if (k === ' ' || k === 'ArrowUp' || k === 'w' || k === 'W') {
      e.preventDefault();
      if (state === 'over') { if (k === ' ') reset(); return; }
      if (!keyJump) { keyJump = true; jumpPress(); }
    }
    if (k === 'ArrowDown' || k === 's' || k === 'S') { e.preventDefault(); requestStop(); }
    if (k === 'h' || k === 'H' || k === 'b' || k === 'B') honk();
    if (k === 'Enter' && state === 'over') reset();
    if (k === 'p' || k === 'P' || k === 'Escape') togglePause();
  });
  window.addEventListener('keyup', e => {
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { if (keyJump) { keyJump = false; jumpRelease(); } }
  });
  function togglePause() {
    if (state === 'play') { state = 'pause'; jumpRelease(); $('#tPauseP').textContent = App.g('التاكسي ينتظركِ… 🚕💤', 'التاكسي ينتظرك… 🚕💤'); $('#tPaused').classList.add('on'); }
    else if (state === 'pause') { state = 'play'; last = 0; $('#tPaused').classList.remove('on'); }
  }
  root.querySelector('#tPause').addEventListener('click', () => { Sound.tap(); togglePause(); });
  root.querySelector('#tResume').addEventListener('click', () => { Sound.tap(); togglePause(); });
  root.querySelector('#tAgain').addEventListener('click', () => { Sound.tap(); reset(); });
  window.addEventListener('resize', () => { if (App.current === ID) resize(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && App.current === ID && state === 'play') togglePause(); });

  /* ---------- أيقونة القائمة ---------- */
  const iconTaxi = { y: 0, vy: 0, ground: true, hurt: 0, happy: 0, sad: 0, honk: 0, nitro: 0, blink: 0, wheel: .4, eyes: [{ x: 3, y: -1.5 }, { x: 3, y: -1.5 }] };

  App.register({
    id: ID, title: 'التاكسي المرح', icon2: '🚕', isNew: true, music: 'taxi',
    desc: () => App.g('قودي التاكسي ووصّلي الركّاب!', 'قُد التاكسي ووصّل الركّاب!'),
    help: () => [
      App.g('⬆️ المسي الشاشة أو اضغطي «قفز» ليقفز التاكسي — اضغطي مرتين لقفزة مزدوجة!', '⬆️ المس الشاشة أو اضغط «قفز» ليقفز التاكسي — اضغط مرتين لقفزة مزدوجة!'),
      App.g('🚧 اقفزي فوق الأقماع والصناديق والحُفر والقطط النائمة، ولا تقفزي تحت الطيور 🐦', '🚧 اقفز فوق الأقماع والصناديق والحُفر والقطط النائمة، ولا تقفز تحت الطيور 🐦'),
      App.g('🙋 إذا رأيتِ راكبًا يلوّح اضغطي «توقف» 🛑، ثم أوصليه إلى وجهته قبل انتهاء الوقت ⏱', '🙋 إذا رأيت راكبًا يلوّح اضغط «توقف» 🛑، ثم أوصله إلى وجهته قبل انتهاء الوقت ⏱'),
      '⭐ اجمع النجوم، و🧲 المغناطيس يجذبها، و🛡️ الدرع يحميك، و🔥 النيترو يجعلك سريعًا جدًا!',
      '📯 زر البوق يوقظ القطط النائمة فتبتعد عن الطريق — ولديك 3 قلوب ❤️'
    ],
    best() { const b = store.get('taxiBest', null); return b && (b.d || b.n) ? `🏆 ${b.d || 0} م · 🧍 ${b.n || 0}` : ''; },
    enter() { resize(); reset(); last = 0; acc = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(loop); },
    leave() { cancelAnimationFrame(raf); if (state !== 'over') state = 'idle'; holdJump = false; keyJump = false; showStop(false); },
    pause() { if (state === 'play') { state = 'held'; jumpRelease(); } },
    resume() { if (state === 'held') { state = 'play'; last = 0; } },
    back() { if (state === 'pause') { togglePause(); return true; } return false; },
    /* للاختبار الآلي فقط */
    _dbg() { return { state, mode, distM, hearts, deliveries, starCount, waiting: !!waiting, ride: !!ride, speed, x: taxi && taxi.x }; },
    _god() { hearts = 99; },
    _warp(m) { taxi.x = m * 10; distM = m; camX = taxi.x - TX; nextSpawnX = taxi.x + 600; nextMissionX = taxi.x + 400; zoneI = Math.floor(m / ZONE_LEN); },
    icon(c) {
      const g = c.createLinearGradient(0, 0, 0, 152); g.addColorStop(0, '#7CC8FF'); g.addColorStop(1, '#DDF3FF');
      c.fillStyle = g; c.fillRect(0, 0, 152, 152);
      c.fillStyle = 'rgba(255,255,255,.9)'; cloud(c, 18, 40, .7);
      c.fillStyle = '#5A5F6E'; c.fillRect(0, 112, 152, 40);
      c.fillStyle = '#FFE066'; for (let x = 4; x < 152; x += 40) c.fillRect(x, 128, 24, 4);
      c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(78, 118, 56, 6, 0, 0, TAU); c.fill();
      c.save(); c.translate(78, 116); c.scale(.86, .86); drawTaxi(c, iconTaxi, 0, null); c.restore();
      star(c, 124, 34, 15, '#FFD84D', '#E89B0C', .2);
      c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(120, 30, 3, 0, TAU); c.fill();
    }
  });
})();
