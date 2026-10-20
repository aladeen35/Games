/* =====================================================================
   سباق الحركات — اسمع المقطع (حرف + حركة) وقُد السيارة عبر الباب الصحيح
   طريق ثلاثي الأبعاد زائف، بوابة بثلاثة أبواب، وبطاقات اختيار في الأسفل
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'harakat';
  const TAU = Math.PI * 2;
  const FONT = "'Baloo Bhaijaan 2',system-ui,'Segoe UI',Tahoma,sans-serif";
  const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
    inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pick = a => a[Math.random() * a.length | 0];

  /* ---------- الحروف والحركات ---------- */
  const LETTERS = [['ب', 'ba'], ['ت', 'ta'], ['ث', 'tha'], ['ج', 'jim'], ['ح', 'ha'], ['خ', 'kha'], ['د', 'dal'], ['ذ', 'dhal'], ['ر', 'ra'],
    ['ز', 'zay'], ['س', 'sin'], ['ش', 'shin'], ['ص', 'sad'], ['ض', 'dad'], ['ط', 'tta'], ['ظ', 'dha'], ['ع', 'ayn'], ['غ', 'ghayn'], ['ف', 'fa'],
    ['ق', 'qaf'], ['ك', 'kaf'], ['ل', 'lam'], ['م', 'mim'], ['ن', 'nun'], ['ه', 'haa'], ['و', 'waw'], ['ي', 'ya']].map(([c, id]) => ({ c, id }));
  const LBY = {}; LETTERS.forEach(L => LBY[L.c] = L);
  const FA = 'َ', DA = 'ُ', KA = 'ِ', SK = 'ْ', TF = 'ً', TD = 'ٌ', TK = 'ٍ';
  /* d: النص المعروض · s: النص المنطوق (الساكن يُنطق مسبوقًا بهمزة: «أَبْ»، وتنوين الفتح بألف: «بًا») */
  const KINDS = {
    a:  { d: c => c + FA,       s: c => c + FA },
    u:  { d: c => c + DA,       s: c => c + DA },
    i:  { d: c => c + KA,       s: c => c + KA },
    aa: { d: c => c + FA + 'ا', s: c => c + FA + 'ا' },
    uu: { d: c => c + DA + 'و', s: c => c + DA + 'و' },
    ii: { d: c => c + KA + 'ي', s: c => c + KA + 'ي' },
    s:  { d: c => c + SK,       s: c => 'أَ' + c + SK },
    an: { d: c => c + TF,       s: c => c + TF + 'ا' },
    un: { d: c => c + TD,       s: c => c + TD },
    in: { d: c => c + TK,       s: c => c + TK }
  };
  const KORDER = ['a', 'u', 'i', 'aa', 'uu', 'ii', 's', 'an', 'un', 'in'];
  const SHORT = ['a', 'u', 'i'], LONG = ['aa', 'uu', 'ii'], TAN = ['an', 'un', 'in'];
  const syl = (L, k) => ({ L, k, txt: KINDS[k].d(L.c), say: KINDS[k].s(L.c), id: `harakat_${L.id}_${k}` });

  /* ---------- الفصول والمستويات ---------- */
  const MIX = [
    { ls: 'بتث', ks: SHORT }, { ls: 'جحخ', ks: SHORT }, { ls: 'دذرز', ks: SHORT }, { ls: 'سشصض', ks: SHORT },
    { ls: 'طظعغ', ks: SHORT }, { ls: 'فقكل', ks: SHORT }, { ls: 'منهوي', ks: SHORT },
    { ls: 'بتثن', ks: SHORT.concat(LONG) }, { ls: 'جحخه', ks: SHORT.concat(LONG) },
    { ls: 'دذرز', ks: KORDER }, { ls: 'سصثش', ks: KORDER }, { ls: 'كقعغ', ks: KORDER }
  ];
  const CH = [
    { id: 'short', t: 'الفتحة والضمة والكسرة', tab: 'بَ بُ بِ', n: LETTERS.length, col: '#FF8A2A' },
    { id: 'long',  t: 'المدود',                tab: 'بَا بُو بِي', n: LETTERS.length, col: '#3D8BFF' },
    { id: 'sk',    t: 'السكون والتنوين',       tab: 'بْ بٌ', n: LETTERS.length, col: '#9B5CF6' },
    { id: 'mix',   t: 'خلط الحروف',            tab: 'بَ تَ', n: MIX.length, col: '#20B486' }
  ];
  const levelLabel = (c, i) => c === 3 ? MIX[i].ls.split('').join(' ') : c === 0 ? LETTERS[i].c + FA : c === 1 ? LETTERS[i].c + FA + 'ا' : LETTERS[i].c + SK;
  const QN = 10;

  /** توليد أسئلة الجولة: لكل سؤال المقطع المطلوب وثلاثة خيارات موزّعة على المسارات */
  function makeQuestions(c, i) {
    const out = []; let prevTxt = '', prevAns = -1;
    const bagOf = arr => { let b = []; while (b.length < QN + 4) b = b.concat(shuffle(arr.slice())); return b; };
    let bag;
    if (c === 0) bag = bagOf(SHORT);
    else if (c === 1) bag = bagOf(['aa', 'uu', 'ii', 'aa', 'uu', 'ii', 'a', 'u', 'i']);
    else if (c === 2) bag = bagOf(['s', 's', 'an', 'un', 'in', 'an', 'un', 'in', 'a', 'u', 'i']);
    else bag = bagOf(MIX[i].ks);
    for (let q = 0; q < QN; q++) {
      let tgt, opts;
      for (let tries = 0; tries < 30; tries++) {
        const k = bag[(q + tries) % bag.length];
        if (c < 3) {
          const L = LETTERS[i]; tgt = syl(L, k);
          let ks;
          if (c === 0) ks = SHORT.slice();
          else if (c === 1) {
            const partner = { a: 'aa', u: 'uu', i: 'ii', aa: 'a', uu: 'u', ii: 'i' }[k];
            const rest = shuffle(['a', 'u', 'i', 'aa', 'uu', 'ii'].filter(x => x !== k && x !== partner));
            ks = [k, partner, rest[0]];
          } else {
            const P = {
              s: [pick(SHORT), pick(TAN)], an: [pick(['a', 'aa']), pick(['un', 'in'])], un: ['u', pick(['an', 'in'])], in: ['i', pick(['an', 'un'])],
              a: ['an', 's'], u: ['un', 's'], i: ['in', 's']
            }[k];
            ks = [k].concat(P);
          }
          opts = ks.map(kk => syl(L, kk));
        } else {
          const ls = MIX[i].ls.split('').map(ch => LBY[ch]);
          const L = pick(ls); tgt = syl(L, k);
          const others = shuffle(ls.filter(x => x !== L));
          const o1 = syl(others[0], k);
          let o2;
          if (MIX[i].ks.length > 3 && Math.random() < .5) o2 = syl(L, pick(MIX[i].ks.filter(x => x !== k)));
          else if (others[1] && Math.random() < .6) o2 = syl(others[1], pick(MIX[i].ks));
          else o2 = syl(pick(Math.random() < .5 ? [L] : others), pick(MIX[i].ks.filter(x => x !== k)));
          opts = [tgt, o1, o2];
        }
        const txts = opts.map(o => o.txt);
        if (new Set(txts).size !== 3) continue;
        if (tgt.txt === prevTxt && tries < 25) continue;
        break;
      }
      opts = shuffle(opts);
      let ans = opts.findIndex(o => o.txt === tgt.txt);
      if (ans === prevAns && Math.random() < .55) { const j = (ans + 1 + (Math.random() * 2 | 0)) % 3; [opts[ans], opts[j]] = [opts[j], opts[ans]]; ans = j; }
      prevTxt = tgt.txt; prevAns = ans;
      out.push({ tgt, opts, ans });
    }
    return out;
  }

  /* ---------- التقدّم المحفوظ ---------- */
  const lkey = (c, i) => c + '-' + i;
  const loadProg = () => { const p = store.get('harakatProg', null) || {}; p.s = p.s || {}; return p; };
  const doneIn = (p, c) => { let n = 0; for (let i = 0; i < CH[c].n; i++) if (p.s[lkey(c, i)]) n++; return n; };
  const chapOpen = (p, c) => c === 0 || doneIn(p, c - 1) >= 3;
  const isOpen = (p, c, i) => chapOpen(p, c) && (i === 0 || !!p.s[lkey(c, i - 1)]);
  const gems = () => store.get('harakatGems', 0);

  /* ---------- الألوان ---------- */
  const LANE = [
    { m: '#FF8A2A', d: '#D9620B', l: '#FFC08A', g: 'rgba(255,138,42,' },
    { m: '#3D8BFF', d: '#1E62D0', l: '#9CC4FF', g: 'rgba(61,139,255,' },
    { m: '#9B5CF6', d: '#6F32CF', l: '#CDB0FF', g: 'rgba(155,92,246,' }
  ];
  const OK = '#36C24A', BAD = '#FF8A1F', INK = '#33264F';

  /* ---------- الواجهة ---------- */
  App.css(`
  #harakat{background:#86CDF8;overflow:hidden}
  #harakat canvas.hc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #harakat .bar{flex-wrap:wrap;row-gap:7px}
  #harakat .ib{color:#1E62D0}
  #harakat .prog{order:10;flex:1 0 100%;max-width:560px;margin:0 auto;display:flex;gap:4px;padding:4px;border-radius:99px;
    background:rgba(255,255,255,.5);box-shadow:inset 0 2px 5px rgba(20,70,140,.18),0 2px 0 rgba(255,255,255,.6)}
  #harakat .prog i{flex:1;height:13px;border-radius:99px;background:rgba(255,255,255,.92);box-shadow:inset 0 -2px 0 rgba(30,80,150,.12);transition:background .35s,transform .35s}
  #harakat .prog i.cur{background:#FFE58A;animation:hkPulse 1s ease-in-out infinite}
  #harakat .prog i.ok{background:linear-gradient(#8BEA74,#3DBB3A);box-shadow:inset 0 -2px 0 rgba(0,90,0,.25);animation:hkPop .4s}
  #harakat .prog i.bad{background:linear-gradient(#FFC070,#FF8A1F);box-shadow:inset 0 -2px 0 rgba(140,60,0,.25);animation:hkPop .4s}
  @keyframes hkPulse{50%{transform:scaleY(1.35)}}
  @keyframes hkPop{40%{transform:scale(1.25,1.6)}}
  #harakat .gem{display:flex;align-items:center;gap:5px;height:40px;background:rgba(255,255,255,.94);border-radius:99px;padding:0 14px 0 10px;font-weight:900;font-size:20px;color:#1E62D0;box-shadow:0 3px 0 rgba(0,0,0,.12)}
  #harakat .gem .gi{font-size:20px;filter:drop-shadow(0 1px 0 #fff)}
  #harakat .gem.pop{animation:hkGem .35s}
  @keyframes hkGem{40%{transform:scale(1.22)}}
  #harakat .overlay{background:rgba(20,50,100,.38)}
  #harakat .panel{border-color:#D4E7FF;box-shadow:0 8px 0 #9CC4FF,0 20px 40px rgba(0,30,80,.3);color:#24406B}
  #harakat .panel h3{color:#1E62D0}
  #harakat .btn{background:#3D8BFF;box-shadow:0 4px 0 #1E62D0}
  #harakat .btn:active{box-shadow:0 1px 0 #1E62D0}
  #harakat .btn.alt{background:#fff;color:#1E62D0;box-shadow:0 4px 0 #BBD6FF;border-color:#D4E7FF}
  #harakat .btn.go{background:#36C24A;box-shadow:0 4px 0 #23902F;font-size:21px;padding:11px 30px}
  #harakat .wG{direction:ltr;font-size:22px;font-weight:900;color:#1E62D0;margin:2px 0 4px}
  #harakat .lvp{width:min(94vw,460px);max-height:88vh;overflow-y:auto;touch-action:pan-y;padding:18px 14px 14px}
  #harakat .tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:8px 0 6px}
  #harakat .tab{border-radius:16px;padding:6px 2px 4px;background:#EEF5FF;color:#24406B;font-weight:900;font-size:17px;line-height:1.25;box-shadow:0 3px 0 #C9DDF7;border:3px solid transparent}
  #harakat .tab small{display:block;font-size:10.5px;font-weight:700;opacity:.75;line-height:1.2}
  #harakat .tab.on{background:#fff;border-color:var(--c);box-shadow:0 3px 0 var(--c)}
  #harakat .tab.lock{opacity:.45;filter:grayscale(.7)}
  #harakat .chT{font-weight:900;font-size:17px;margin:6px 0 2px}
  #harakat .lvg{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:8px 0 12px}
  #harakat .lvb{position:relative;aspect-ratio:1;border-radius:18px;background:#fff;border:3px solid var(--c);box-shadow:0 4px 0 var(--d);
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#33264F;font-weight:900;padding:2px}
  #harakat .lvb:active{transform:translateY(3px);box-shadow:0 1px 0 var(--d)}
  #harakat .lvb .e{font-size:25px;line-height:1.05;margin-top:2px}
  #harakat .lvb .e.sm{font-size:14px;letter-spacing:1px}
  #harakat .lvb .s{font-size:10px;letter-spacing:-1px;line-height:1;height:11px}
  #harakat .lvb .s i{font-style:normal}
  #harakat .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #harakat .lvb.cur{outline:3px solid #FFC531;outline-offset:2px}
  #harakat .lvb.lock{background:#E9EEF6;border-color:#C9D3E2;box-shadow:0 4px 0 #B7C2D3;color:#8C98AB}
  #harakat .lvb.lock .e{opacity:.35}
  #harakat .lvb.lock::after{content:'🔒';position:absolute;font-size:13px;bottom:3px;left:5px}
  #harakat .hpb{position:absolute;bottom:0;height:env(safe-area-inset-bottom);width:1px;visibility:hidden}
  `);
  const root = App.section(ID, `
    <canvas class="hc"></canvas>
    <div class="hpb"></div>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🗺️</button>
      <span class="grow"></span>
      <div class="gem"><span class="gi">💎</span><b class="gN">٠</b></div>
      <button class="ib pbtn" aria-label="إيقاف مؤقت">⏸️</button>
      <div class="prog">${'<i></i>'.repeat(QN)}</div>
    </div>
    <div class="overlay" id="hkPause"><div class="panel">
      <h3>⏸️ استراحة</h3><p class="pP"></p>
      <button class="btn go" data-a="resume">▶️ متابعة</button><br>
      <button class="btn alt" data-a="again">🔄 من جديد</button><button class="btn alt" data-a="levels">🗺️ المستويات</button>
    </div></div>
    <div class="overlay" id="hkLv"><div class="panel lvp"><h3>🗺️ المستويات</h3>
      <div class="tabs"></div><div class="chT"></div><div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="hkWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><div class="wG"></div><p class="wP"></p>
      <button class="btn go" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again" aria-label="من جديد">🔄</button><button class="btn alt" data-a="levels" aria-label="المستويات">🗺️</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.hc');
  const segs = [...root.querySelectorAll('.prog i')];
  const gemEl = root.querySelector('.gem'), gemN = root.querySelector('.gN');
  const pauseOv = root.querySelector('#hkPause'), lvOv = root.querySelector('#hkLv'), winOv = root.querySelector('#hkWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1;
  let raf = 0, last = 0, T = 0, paused = false;
  // الإسقاط المنظوري
  let hy = 300, P = 400, S = 200, cx = 0, Lc = 100, zCar = 1.8, gy = 600, camX = 0, playW = 400;
  const CAMH = 2.3, ZFAR = 72, ZNEAR = .38;
  // عناصر الواجهة على الكانفاس
  let UI = { cards: [], arrows: [], spk: null, sky: null };
  let bgLayer = null, bgPad = 0, sprites = null, clouds = [];
  // اللعب
  let lv = { c: 0, i: 0 }, Q = [], qi = 0, results = [], phase = 'idle', cdT = 0, lastCd = 0;
  let gates = [], cur = null, nextT = -1, chosen = false, waitT = 0, bumpT = 0, boostT = 0, braking = false;
  let v = 0, trav = 0, shake = 0, roundGems = 0, finT = 0;
  const car = { x: 0, vx: 0, lane: 1, wob: 0, squash: 0, edge: 0, stopShake: 0 };
  let props = [], parts = [], lines = [];
  let skyC = { pop: 0, speak: 0, reveal: 0, revealTxt: '', revealOk: true, press: 0 };
  let cardFx = [0, 1, 2].map(() => ({ lift: 0, press: 0, res: '', rt: 0, shake: 0 }));
  let btnFx = { l: 0, r: 0, spk: 0 };
  let sayTimer = 0, winTimer = 0, swipe = null;

  /* ---------- النطق ---------- */
  const sfxOn = () => gstore.get('sfx', true);
  /** نطق مقطع واحد: التسجيل المخصّص له إن وُجد (بالمعرّف مباشرة، لأن التطبيع يحذف التشكيل)، وإلا محرّك النطق */
  function speakSyl(sy) {
    skyC.speak = 1.2;
    if (!sfxOn()) return;
    try { if (typeof Voice !== 'undefined' && window.VOICE && VOICE.ar && VOICE.ar[sy.id]) { Voice.play([sy.id], 'ar'); return; } } catch (e) {}
    try { if (typeof Voice !== 'undefined') Voice.stop(); } catch (e) {}
    try {
      if (window.AndroidBridge && AndroidBridge.speak) { AndroidBridge.speak(sy.say); return; }
      if (window.speechSynthesis) {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(sy.say); u.lang = 'ar-SA'; u.rate = .8; u.pitch = 1.15;
        const vo = speechSynthesis.getVoices().find(x => /^ar/i.test(x.lang)); if (vo) u.voice = vo;
        speechSynthesis.speak(u);
      }
    } catch (e) {}
  }
  const listenPhrase = () => lv.c === 3 ? App.g('اسمعي واختاري الصوت الصحيح', 'اسمع واختر الصوت الصحيح') : App.g('اسمعي واختاري الحركة', 'اسمع واختر الحركة');
  function sayLater(fn, ms) { clearTimeout(sayTimer); sayTimer = setTimeout(() => { if (App.current === ID && !paused) fn(); }, ms); }

  /* ---------- الإسقاط ---------- */
  const sx = (X, z) => cx + (X - camX) * S / z;
  const sy = z => hy + P / z;

  /* ---------- التخطيط ---------- */
  function resize() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const sb = root.querySelector('.hpb').offsetHeight || 0;
    const barB = (root.querySelector('.prog').getBoundingClientRect().bottom || 100);
    playW = Math.min(W, Math.max(340, H * .78));
    cx = W / 2;
    const br = clamp(playW * .085, 27, 36);
    const by = H - sb - 12 - br;
    const gap = clamp(playW * .03, 8, 14);
    const cw = Math.min(136, (playW - 28 - gap * 2) / 3), ch = cw * .9;
    const cy = by - br - 10 - ch / 2;
    UI.cards = [0, 1, 2].map(i => ({ x: cx + (i - 1) * (cw + gap), y: cy, w: cw, h: ch }));
    UI.arrows = [{ x: cx - playW / 2 + 14 + br, y: by, r: br, d: -1 }, { x: cx + playW / 2 - 14 - br, y: by, r: br, d: 1 }];
    UI.spk = { x: cx, y: by + 2, r: br * .92 };
    // السيارة فوق البطاقات، والأفق يُحسب من ارتفاع الكاميرا الثابت
    gy = cy - ch / 2 - 12;
    Lc = Math.min(playW * .29, (gy - H * .36) / CAMH);
    hy = gy - CAMH * Lc;
    zCar = 1.75; S = Lc * zCar; P = CAMH * S;
    const skyH = hy - barB;
    const sw = clamp(Math.min(playW * .28, skyH * .62), 64, 140);
    UI.sky = { x: cx, y: barB + Math.max(sw * .58, skyH * .44), w: sw, h: sw * 1.02 };
    buildBg();
    if (!sprites) sprites = buildSprites();
  }

  /* ---------- الخلفية الثابتة (سماء، مدينة، تلال) ---------- */
  function seeded(seed) { let s = seed * 9301 + 49297; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
  function buildBg() {
    bgPad = Math.round(W * .12);
    const bw = W + bgPad * 2, bh = Math.ceil(hy + 4);
    const c = document.createElement('canvas'); c.width = Math.round(bw * dpr); c.height = Math.round(bh * dpr);
    const x = c.getContext('2d'); x.scale(dpr, dpr);
    const g = x.createLinearGradient(0, 0, 0, bh);
    g.addColorStop(0, '#4FA8F0'); g.addColorStop(.55, '#8ED0FA'); g.addColorStop(1, '#D8F0FF');
    x.fillStyle = g; x.fillRect(0, 0, bw, bh);
    // شمس ناعمة
    const sg = x.createRadialGradient(bw * .78, bh * .3, 0, bw * .78, bh * .3, bh * .5);
    sg.addColorStop(0, 'rgba(255,255,230,.75)'); sg.addColorStop(.25, 'rgba(255,250,210,.25)'); sg.addColorStop(1, 'rgba(255,250,210,0)');
    x.fillStyle = sg; x.fillRect(0, 0, bw, bh);
    const r = seeded(7), u = clamp(Lc / 100, .6, 1.4);
    const base = bh - 3;
    // مبانٍ بعيدة
    const cols = ['#A9CFF2', '#F3BFCB', '#CBB9F0', '#F5DCAE', '#AEE2D6', '#E3ECF8', '#BFD8F7', '#F7C9A9'];
    const drawCity = (alpha, hk, yo) => {
      let px = -10;
      while (px < bw + 10) {
        const w = (16 + r() * 26) * u, h = (18 + r() * 52) * u * hk * (1 - .45 * Math.exp(-Math.pow((px - bw / 2) / (bw * .12), 2)));
        const col = cols[r() * cols.length | 0];
        x.globalAlpha = alpha;
        x.fillStyle = col; x.beginPath(); x.roundRect(px, base - h - yo, w, h + yo + 2, [3 * u, 3 * u, 0, 0]); x.fill();
        x.fillStyle = 'rgba(40,70,120,.13)'; x.fillRect(px + w * .72, base - h - yo + 2, w * .28, h + yo);
        x.fillStyle = 'rgba(255,255,255,.55)';
        const ww = 3 * u, wh = 4 * u;
        for (let yy = base - h - yo + 5 * u; yy < base - 6 * u; yy += 8 * u)
          for (let xx = px + 4 * u; xx < px + w * .7 - ww; xx += 7 * u) if (r() < .8) x.fillRect(xx, yy, ww, wh);
        if (r() < .25) { x.fillStyle = col; x.fillRect(px + w * .45, base - h - yo - 8 * u, 2 * u, 8 * u); }
        px += w + (r() < .3 ? 6 * u : 1);
      }
      x.globalAlpha = 1;
    };
    drawCity(.75, .9, 6 * u); drawCity(1, 1, 0);
    // تلال
    const hill = (col, amp, yo, ph, n) => {
      x.fillStyle = col; x.beginPath(); x.moveTo(0, bh);
      for (let xx = 0; xx <= bw; xx += 6) {
        const t = xx / bw;
        x.lineTo(xx, base - yo - amp * (.55 + .45 * Math.sin(t * TAU * n + ph)) * (.6 + .4 * Math.sin(t * 17 + ph)));
      }
      x.lineTo(bw, bh); x.closePath(); x.fill();
    };
    hill('#A8DE80', 22 * u, 0, 1.3, 2.2);
    // أشجار بعيدة صغيرة على التلال
    for (let i = 0; i < 46; i++) {
      const tx = r() * bw; if (Math.abs(tx - bw / 2) < bw * .06) continue;
      const tr = (3 + r() * 4) * u, ty = base - 4 * u - r() * 10 * u;
      x.fillStyle = r() < .5 ? '#5DAE45' : '#4C9C3B';
      x.beginPath(); x.arc(tx, ty, tr, 0, TAU); x.fill();
      x.fillStyle = 'rgba(255,255,255,.18)'; x.beginPath(); x.arc(tx - tr * .3, ty - tr * .3, tr * .45, 0, TAU); x.fill();
    }
    hill('#8ED364', 10 * u, -2, 4.1, 3.3);
    bgLayer = c;
    // غيوم
    if (!clouds.length) for (let i = 0; i < 5; i++) clouds.push({ x: Math.random(), y: rand(.15, .75), s: rand(.7, 1.25), v: rand(.006, .014), spr: i % 3 });
  }

  /* ---------- رسومات العناصر المرسومة مسبقًا ---------- */
  function sprite(w, h, fn) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const x = c.getContext('2d'); fn(x, w, h); return c;
  }
  function facet(x, cx0, cy0, r, n, rot, cLight, cDark) {
    const pts = [];
    for (let i = 0; i < n; i++) { const a = rot + i / n * TAU; pts.push([cx0 + Math.cos(a) * r * (1 + (i % 2 ? .06 : -.04)), cy0 + Math.sin(a) * r * (i % 3 ? 1 : .94)]); }
    for (let i = 0; i < n; i++) {
      const p1 = pts[i], p2 = pts[(i + 1) % n];
      const mid = Math.atan2((p1[1] + p2[1]) / 2 - cy0, (p1[0] + p2[0]) / 2 - cx0);
      const lit = (Math.cos(mid - Math.PI * 1.2) + 1) / 2;
      x.fillStyle = mixC(cDark, cLight, lit);
      x.beginPath(); x.moveTo(cx0 - r * .12, cy0 - r * .18); x.lineTo(p1[0], p1[1]); x.lineTo(p2[0], p2[1]); x.closePath(); x.fill();
      x.strokeStyle = x.fillStyle; x.lineWidth = 1; x.stroke();
    }
  }
  function hex2(c) { const n = parseInt(c.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; }
  function mixC(a, b, t) { const A = hex2(a), B = hex2(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`; }
  function buildSprites() {
    const sp = {};
    const tree = (light, dark, kind) => sprite(200, 300, (x, w, h) => {
      // جذع
      const tg = x.createLinearGradient(w / 2 - 12, 0, w / 2 + 12, 0); tg.addColorStop(0, '#A0693A'); tg.addColorStop(1, '#6E4220');
      x.fillStyle = tg; x.beginPath(); x.moveTo(w / 2 - 11, h); x.lineTo(w / 2 - 7, h - 130); x.lineTo(w / 2 + 7, h - 130); x.lineTo(w / 2 + 11, h); x.closePath(); x.fill();
      if (kind === 'pine') {
        [[h - 100, 82, 95], [h - 165, 64, 82], [h - 220, 44, 70]].forEach(([by, hw, th]) => {
          x.fillStyle = dark; x.beginPath(); x.moveTo(w / 2, by - th); x.lineTo(w / 2 + hw, by); x.lineTo(w / 2, by + 6); x.closePath(); x.fill();
          x.fillStyle = light; x.beginPath(); x.moveTo(w / 2, by - th); x.lineTo(w / 2 - hw, by); x.lineTo(w / 2, by + 6); x.closePath(); x.fill();
          x.fillStyle = 'rgba(255,255,255,.18)'; x.beginPath(); x.moveTo(w / 2, by - th); x.lineTo(w / 2 - hw * .45, by - th * .45); x.lineTo(w / 2, by - th * .3); x.closePath(); x.fill();
        });
      } else {
        facet(x, w / 2 + 22, h - 150, 52, 7, .3, light, dark);
        facet(x, w / 2 - 26, h - 140, 50, 7, 1.1, light, dark);
        facet(x, w / 2, h - 200, 66, 8, .7, light, dark);
        x.fillStyle = 'rgba(255,255,255,.16)'; x.beginPath(); x.ellipse(w / 2 - 22, h - 228, 22, 13, -.5, 0, TAU); x.fill();
      }
    });
    sp.trees = [tree('#7BD350', '#3E9B33'), tree('#5FC24A', '#2F8430'), tree('#6FCB57', '#2E7D3A', 'pine'), tree('#9BD84B', '#5A9E2A')];
    sp.bush = sprite(200, 110, (x, w, h) => {
      facet(x, 60, 70, 40, 7, .2, '#86D85B', '#3F9A36'); facet(x, 140, 72, 38, 7, .9, '#86D85B', '#3F9A36'); facet(x, 100, 58, 48, 8, .5, '#93E066', '#45A23A');
      [[70, 50, '#FF6B8A'], [120, 44, '#FFD447'], [150, 64, '#fff'], [92, 74, '#FF9BD0']].forEach(([a, b, col]) => { x.fillStyle = col; x.beginPath(); x.arc(a, b, 5, 0, TAU); x.fill(); });
    });
    const lamp = dir => sprite(160, 320, (x, w, h) => {
      const px = dir > 0 ? 40 : w - 40;
      x.fillStyle = '#3A4256'; x.beginPath(); x.roundRect(px - 5, 40, 10, h - 40, 4); x.fill();
      x.fillStyle = '#566078'; x.fillRect(px - 2, 44, 3, h - 50);
      x.strokeStyle = '#3A4256'; x.lineWidth = 8; x.lineCap = 'round';
      x.beginPath(); x.moveTo(px, 50); x.quadraticCurveTo(px, 24, px + dir * 34, 24); x.lineTo(px + dir * 70, 24); x.stroke();
      x.fillStyle = '#2E3546'; x.beginPath(); x.roundRect(px + dir * 70 - 18, 18, 36, 12, 5); x.fill();
      x.fillStyle = '#FFF4C2'; x.beginPath(); x.ellipse(px + dir * 70, 31, 13, 4, 0, 0, TAU); x.fill();
      x.fillStyle = '#2E3546'; x.beginPath(); x.roundRect(px - 10, h - 16, 20, 16, 4); x.fill();
    });
    sp.lampR = lamp(-1); sp.lampL = lamp(1);
    sp.flowers = sprite(120, 60, (x, w, h) => {
      for (let i = 0; i < 9; i++) {
        const fx = 12 + i * 11 + (i % 2) * 4, fy = 30 + (i % 3) * 9;
        x.strokeStyle = '#3F9A36'; x.lineWidth = 3; x.beginPath(); x.moveTo(fx, fy); x.lineTo(fx, h); x.stroke();
        x.fillStyle = ['#FF6B8A', '#FFD447', '#FFFFFF', '#B78CFF'][i % 4];
        for (let k = 0; k < 5; k++) { const a = k / 5 * TAU; x.beginPath(); x.arc(fx + Math.cos(a) * 4, fy + Math.sin(a) * 4, 3.2, 0, TAU); x.fill(); }
        x.fillStyle = '#FFB020'; x.beginPath(); x.arc(fx, fy, 2.4, 0, TAU); x.fill();
      }
    });
    sp.clouds = [0, 1, 2].map(k => sprite(260, 120, (x, w, h) => {
      const blobs = [[[70, 78, 38], [120, 58, 50], [175, 72, 40], [210, 86, 26], [40, 92, 22]], [[80, 72, 44], [140, 66, 46], [190, 84, 30], [45, 90, 24]], [[90, 80, 34], [130, 62, 42], [175, 82, 30]]][k];
      x.save(); x.translate(0, 6); x.fillStyle = 'rgba(120,170,220,.35)';
      blobs.forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r, 0, TAU); x.fill(); }); x.restore();
      const g = x.createLinearGradient(0, 20, 0, 115); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#E3F1FF');
      x.fillStyle = g; blobs.forEach(([a, b, r]) => { x.beginPath(); x.arc(a, b, r, 0, TAU); x.fill(); });
      x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.ellipse(110, 40, 26, 10, -.2, 0, TAU); x.fill();
    }));
    return sp;
  }

  /* ---------- عناصر جانب الطريق ---------- */
  function newProp(z) {
    const side = Math.random() < .5 ? -1 : 1, r = Math.random();
    if (r < .16) return { t: 'lamp', side, X: side * 2.05, z, h: 2.7 };
    if (r < .3) return { t: 'flowers', side, X: side * rand(2.3, 3.4), z, h: .32 };
    if (r < .45) return { t: 'bush', side, X: side * rand(2.4, 3.6), z, h: rand(.55, .75) };
    return { t: 'tree', v: Math.random() * 4 | 0, side, X: side * rand(2.6, 6.5), z, h: rand(2.1, 3.1) };
  }
  function initProps() {
    props = [];
    for (let z = 1; z < ZFAR; z += rand(1.1, 2.2)) props.push(newProp(z));
  }

  /* ---------- رسم الطريق ---------- */
  function quad(X1, X2, z1, z2) {
    ctx.moveTo(sx(X1, z1), sy(z1)); ctx.lineTo(sx(X2, z1), sy(z1)); ctx.lineTo(sx(X2, z2), sy(z2)); ctx.lineTo(sx(X1, z2), sy(z2)); ctx.closePath();
  }
  /** تقسيم المسافة [zA,zB] إلى خطوط متحركة بطول period، تُعيد الزوجية لكل جزء */
  function stripes(period, zA, zB, cb) {
    let z = zA;
    while (z < zB) {
      const w = z + trav, m = Math.floor(w / period + 1e-6);
      const zn = Math.min(zB, (m + 1) * period - trav);
      cb(z, zn, m & 1);
      z = zn + 1e-6;
    }
  }
  function drawGround() {
    // أشرطة العشب المتحركة
    ctx.fillStyle = 'rgba(40,120,30,.09)';
    ctx.beginPath();
    stripes(2.6, ZNEAR, 40, (z1, z2, p) => { if (p) { const y1 = sy(z1), y2 = sy(z2); ctx.rect(0, y2, W, y1 - y2 + .5); } });
    ctx.fill();
    // رصيف رملي
    ctx.fillStyle = '#F2E2C2';
    ctx.beginPath(); quad(-2.2, -1.72, ZNEAR, ZFAR); quad(1.72, 2.2, ZNEAR, ZFAR); ctx.fill();
    ctx.fillStyle = 'rgba(190,160,110,.35)';
    ctx.beginPath(); stripes(1.2, ZNEAR, 30, (z1, z2, p) => { if (p) { quad(-2.2, -1.72, z1, Math.min(z2, z1 + .06)); quad(1.72, 2.2, z1, Math.min(z2, z1 + .06)); } }); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.beginPath(); quad(-2.24, -2.18, ZNEAR, ZFAR); quad(2.18, 2.24, ZNEAR, ZFAR); ctx.fill();
    // الإسفلت
    const rg = ctx.createLinearGradient(0, hy, 0, H);
    rg.addColorStop(0, '#9EA6B6'); rg.addColorStop(.3, '#7A8193'); rg.addColorStop(1, '#565C6C');
    ctx.fillStyle = rg; ctx.beginPath(); quad(-1.5, 1.5, ZNEAR, ZFAR); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,.035)';
    ctx.beginPath(); stripes(3.2, ZNEAR, 30, (z1, z2, p) => { if (p) quad(-1.5, 1.5, z1, z2); }); ctx.fill();
    // آثار الإطارات الخفيفة
    ctx.fillStyle = 'rgba(30,30,45,.06)';
    ctx.beginPath(); for (const X of [-1.25, -.75, -.25, .25, .75, 1.25]) quad(X - .07, X + .07, ZNEAR, ZFAR); ctx.fill();
    // الحافة الحمراء والبيضاء
    ctx.fillStyle = '#F6F2F2'; ctx.beginPath(); quad(-1.74, -1.5, ZNEAR, ZFAR); quad(1.5, 1.74, ZNEAR, ZFAR); ctx.fill();
    ctx.fillStyle = '#E8434F';
    ctx.beginPath(); stripes(.85, ZNEAR, 46, (z1, z2, p) => { if (p) { quad(-1.74, -1.5, z1, z2); quad(1.5, 1.74, z1, z2); } }); ctx.fill();
    ctx.fillStyle = 'rgba(232,67,79,.5)'; ctx.beginPath(); quad(-1.74, -1.5, 46, ZFAR); quad(1.5, 1.74, 46, ZFAR); ctx.fill();
    // ظل جانبي داخلي للحافة
    ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.beginPath(); quad(-1.5, -1.42, ZNEAR, ZFAR); quad(1.42, 1.5, ZNEAR, ZFAR); ctx.fill();
    // خط أبيض متصل
    ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); quad(-1.4, -1.34, ZNEAR, ZFAR); quad(1.34, 1.4, ZNEAR, ZFAR); ctx.fill();
    // خطوط المسارات المتقطعة
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); stripes(1.7, ZNEAR, 56, (z1, z2, p) => { if (!p) { quad(-.535, -.465, z1, z2); quad(.465, .535, z1, z2); } }); ctx.fill();
    // ضباب الأفق
    const hz = ctx.createLinearGradient(0, hy - 6, 0, hy + 46);
    hz.addColorStop(0, 'rgba(225,242,255,.85)'); hz.addColorStop(1, 'rgba(225,242,255,0)');
    ctx.fillStyle = hz; ctx.fillRect(0, hy - 6, W, 52);
  }

  /* ---------- البوابة ---------- */
  function drawGate(g) {
    const z = g.z; if (z < .45 || z > ZFAR) return;
    const s = S / z, x0 = sx(0, z), y0 = sy(z);
    let a = clamp((ZFAR - 8 - z) / 10, 0, 1);
    if (z < zCar) a *= clamp((z - .5) / (zCar - .5), 0, 1);
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x0, y0);
    const U = v => v * s;
    // ظل أرضي
    ctx.fillStyle = 'rgba(30,40,70,.18)';
    ctx.beginPath(); ctx.ellipse(0, U(.02), U(2.05), U(.12), 0, 0, TAU); ctx.fill();
    // القوس الأحمر
    const archPath = () => {
      ctx.beginPath(); ctx.moveTo(U(-1.95), 0); ctx.lineTo(U(-1.95), U(-1.9));
      ctx.ellipse(0, U(-1.9), U(1.95), U(1.25), 0, Math.PI, TAU, false);
      ctx.lineTo(U(1.95), 0); ctx.lineTo(U(1.68), 0); ctx.lineTo(U(1.68), U(-1.9));
      ctx.ellipse(0, U(-1.9), U(1.68), U(1.0), 0, 0, Math.PI, true);
      ctx.lineTo(U(-1.68), 0); ctx.closePath();
    };
    const fin = g.kind === 'finish';
    const ag = ctx.createLinearGradient(0, U(-3.2), 0, 0);
    if (fin) { ag.addColorStop(0, '#FFD84A'); ag.addColorStop(1, '#F0A20E'); } else { ag.addColorStop(0, '#FF6B74'); ag.addColorStop(1, '#D42E3C'); }
    ctx.fillStyle = ag; archPath(); ctx.fill();
    ctx.lineWidth = Math.max(1, U(.04)); ctx.strokeStyle = fin ? '#C27C00' : '#A51E2B'; ctx.stroke();
    // أشرطة بيضاء على القوس
    ctx.save(); archPath(); ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,.92)'; ctx.lineWidth = U(.12); ctx.setLineDash([U(.22), U(.22)]); ctx.lineDashOffset = -T * 0;
    ctx.beginPath(); ctx.moveTo(U(-1.815), 0); ctx.lineTo(U(-1.815), U(-1.9));
    ctx.ellipse(0, U(-1.9), U(1.815), U(1.125), 0, Math.PI, TAU, false); ctx.lineTo(U(1.815), 0); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.beginPath(); ctx.ellipse(U(-.6), U(-3.0), U(.9), U(.12), -.15, 0, TAU); ctx.fill();
    ctx.restore();
    // العارضة
    const bg = ctx.createLinearGradient(0, U(-2.02), 0, U(-1.72));
    bg.addColorStop(0, '#FFFFFF'); bg.addColorStop(1, '#C9D4E6');
    ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(U(-1.7), U(-2.02), U(3.4), U(.3), U(.06)); ctx.fill();
    if (fin) {
      // لافتة خط النهاية بالمربعات
      const cs = .18, rows = 2, ncol = Math.round(3.2 / cs);
      for (let r = 0; r < rows; r++) for (let k = 0; k < ncol; k++) {
        ctx.fillStyle = (r + k) & 1 ? '#222838' : '#FFFFFF';
        ctx.fillRect(U(-1.6 + k * cs), U(-2.0 + r * cs * .8 - .2), U(cs) + .5, U(cs * .8) + .5);
      }
      if (s > 6) {
        ctx.font = `900 ${U(.62)}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('🏁', 0, U(-2.75));
      }
      ctx.restore(); return;
    }
    // الأبواب
    for (let i = 0; i < 3; i++) {
      const d = g.doors[i], L = LANE[i];
      const a0 = -1.5 + i + .08, a1 = -.5 + i - .08, mid = (a0 + a1) / 2;
      if (d.burst >= 1) continue;
      ctx.save();
      const op = ease.inOut(clamp(d.open, 0, 1));
      const wob = Math.sin(d.wob * 22) * d.wob * .12;
      ctx.translate(U(mid), U(-.86 - op * 1.2));
      ctx.scale(1 + wob, 1 - wob * .6);
      ctx.globalAlpha *= (1 - op) * (1 - d.burst);
      const hw = U((a1 - a0) / 2), hh = U(.86);
      const dg = ctx.createLinearGradient(0, -hh, 0, hh);
      dg.addColorStop(0, L.g + '.55)'); dg.addColorStop(1, L.g + '.82)');
      ctx.fillStyle = dg; ctx.beginPath(); ctx.roundRect(-hw, -hh, hw * 2, hh * 2, U(.08)); ctx.fill();
      if (d.flash > 0) { ctx.fillStyle = `rgba(255,90,60,${d.flash * .5})`; ctx.fill(); }
      ctx.strokeStyle = L.d; ctx.lineWidth = Math.max(1, U(.05)); ctx.stroke();
      // لمعة زجاجية
      ctx.fillStyle = 'rgba(255,255,255,.28)';
      ctx.beginPath(); ctx.moveTo(-hw * .7, hh); ctx.lineTo(-hw * .2, hh); ctx.lineTo(hw * .7, -hh); ctx.lineTo(hw * .2, -hh); ctx.closePath(); ctx.fill();
      ctx.restore();
    }
    // إطار الباب الصحيح بعد الإجابة
    if (g.res) {
      const i = g.q.ans, a0 = -1.5 + i + .04, a1 = -.5 + i - .04;
      ctx.save(); ctx.globalAlpha *= .6 + .4 * Math.sin(T * 10);
      ctx.strokeStyle = '#5BF06A'; ctx.lineWidth = U(.09); ctx.shadowColor = '#5BF06A'; ctx.shadowBlur = U(.4);
      ctx.beginPath(); ctx.roundRect(U(a0), U(-1.74), U(a1 - a0), U(1.74), U(.08)); ctx.stroke(); ctx.restore();
    }
    // الأعمدة
    for (const X of [-1.5, -.5, .5, 1.5]) {
      const pg = ctx.createLinearGradient(U(X - .08), 0, U(X + .08), 0);
      pg.addColorStop(0, '#FFFFFF'); pg.addColorStop(1, '#B9C6DB');
      ctx.fillStyle = pg; ctx.beginPath(); ctx.roundRect(U(X - .08), U(-1.78), U(.16), U(1.78), U(.04)); ctx.fill();
    }
    // اللافتات
    for (let i = 0; i < 3; i++) {
      const d = g.doors[i]; if (d.burst >= 1) continue;
      const op = ease.inOut(clamp(d.open, 0, 1));
      ctx.save(); ctx.globalAlpha *= (1 - op) * (1 - d.burst);
      const X = -1 + i, cyy = -1.06 - op * 1.2, w = .74, h = .6;
      ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.roundRect(U(X - w / 2), U(cyy - h / 2 + .05), U(w), U(h), U(.14)); ctx.fill();
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(U(X - w / 2), U(cyy - h / 2), U(w), U(h), U(.14)); ctx.fill();
      ctx.strokeStyle = LANE[i].m; ctx.lineWidth = U(.07); ctx.stroke();
      if (s > 9) {
        ctx.fillStyle = INK; ctx.font = `900 ${U(.4)}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(g.q.opts[i].txt, U(X), U(cyy + .03));
      }
      ctx.restore();
    }
    // شارة رقم السؤال أعلى القوس
    if (s > 10) {
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(0, U(-3.12), U(.27), 0, TAU); ctx.fill();
      ctx.strokeStyle = '#FFC531'; ctx.lineWidth = U(.06); ctx.stroke();
      ctx.fillStyle = '#D42E3C'; ctx.font = `900 ${U(.3)}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(AR(g.n), 0, U(-3.1));
    }
    ctx.restore();
  }

  /* ---------- السيارة ---------- */
  function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
  function drawCar() {
    const s = S / zCar, w = s * .8;
    let x = sx(car.x, zCar), y = gy;
    const sp = clamp(v / 8, 0, 1.6);
    const bob = Math.abs(Math.sin(T * 17)) * sp * w * .012 + car.stopShake * Math.sin(T * 55) * w * .006;
    const tilt = clamp(car.vx * .045, -.2, .2) + Math.sin(car.wob * 26) * car.wob * .14;
    const sq = car.squash;
    ctx.save();
    ctx.translate(x, y);
    // ظل
    const sh = ctx.createRadialGradient(0, 0, 0, 0, 0, w * .66);
    sh.addColorStop(0, 'rgba(20,25,40,.45)'); sh.addColorStop(1, 'rgba(20,25,40,0)');
    ctx.fillStyle = sh; ctx.save(); ctx.scale(1, .2); ctx.beginPath(); ctx.arc(0, 0, w * .66, 0, TAU); ctx.fill(); ctx.restore();
    ctx.translate(0, -bob); ctx.rotate(tilt); ctx.scale(1 + sq * .08, 1 - sq * .08);
    const u = w;
    // العجلات
    for (const side of [-1, 1]) {
      const wx = side * u * .4;
      const wg = ctx.createLinearGradient(wx - u * .12, 0, wx + u * .12, 0);
      wg.addColorStop(0, '#3B4152'); wg.addColorStop(.5, '#22262F'); wg.addColorStop(1, '#14161C');
      ctx.fillStyle = wg; rr(wx - u * .12, -u * .3, u * .24, u * .3, u * .07); ctx.fill();
      ctx.save(); rr(wx - u * .12, -u * .3, u * .24, u * .3, u * .07); ctx.clip();
      ctx.fillStyle = 'rgba(255,255,255,.12)';
      const off = (trav * 3) % 1;
      for (let k = -1; k < 4; k++) ctx.fillRect(wx - u * .12, -u * .3 + (k + off) * u * .08, u * .24, u * .025);
      ctx.restore();
    }
    // الهيكل السفلي
    const bg = ctx.createLinearGradient(0, -u * .66, 0, -u * .1);
    bg.addColorStop(0, '#FF6A6F'); bg.addColorStop(.55, '#F0333F'); bg.addColorStop(1, '#B81E2B');
    ctx.fillStyle = bg; rr(-u * .52, -u * .66, u * 1.04, u * .52, u * .17); ctx.fill();
    // انتفاخ فوق العجلات
    for (const side of [-1, 1]) {
      ctx.fillStyle = '#E02C39'; ctx.beginPath(); ctx.ellipse(side * u * .4, -u * .3, u * .17, u * .1, 0, Math.PI, TAU); ctx.fill();
    }
    // خط لمعان علوي
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = u * .025; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-u * .38, -u * .62); ctx.lineTo(u * .38, -u * .62); ctx.stroke();
    // المصابيح الخلفية
    const br = braking || bumpT > 0;
    for (const side of [-1, 1]) {
      if (br) { ctx.save(); ctx.shadowColor = '#FF2020'; ctx.shadowBlur = u * .25; }
      const lg = ctx.createLinearGradient(0, -u * .54, 0, -u * .4);
      lg.addColorStop(0, br ? '#FFD0C0' : '#FFB199'); lg.addColorStop(1, br ? '#FF3B2A' : '#E0442E');
      ctx.fillStyle = lg; rr(side > 0 ? u * .3 : -u * .46, -u * .55, u * .16, u * .13, u * .05); ctx.fill();
      if (br) ctx.restore();
      ctx.fillStyle = 'rgba(255,255,255,.6)'; rr(side > 0 ? u * .32 : -u * .44, -u * .535, u * .06, u * .035, u * .02); ctx.fill();
    }
    // المصد
    const pg = ctx.createLinearGradient(0, -u * .26, 0, -u * .1);
    pg.addColorStop(0, '#FFFFFF'); pg.addColorStop(1, '#BAC3D3');
    ctx.fillStyle = pg; rr(-u * .47, -u * .25, u * .94, u * .14, u * .07); ctx.fill();
    // اللوحة
    ctx.fillStyle = '#FFD43B'; rr(-u * .14, -u * .42, u * .28, u * .12, u * .03); ctx.fill();
    ctx.strokeStyle = '#E0A800'; ctx.lineWidth = Math.max(1, u * .012); ctx.stroke();
    ctx.fillStyle = '#5A3A00'; ctx.font = `900 ${u * .085}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('١٢٣', 0, -u * .355);
    // أنبوب العادم
    ctx.fillStyle = '#7B8396'; rr(-u * .36, -u * .14, u * .1, u * .06, u * .03); ctx.fill();
    ctx.fillStyle = '#2A2E38'; ctx.beginPath(); ctx.ellipse(-u * .31, -u * .11, u * .03, u * .02, 0, 0, TAU); ctx.fill();
    // المقصورة
    const cg = ctx.createLinearGradient(0, -u * 1.02, 0, -u * .62);
    cg.addColorStop(0, '#FF7C80'); cg.addColorStop(1, '#E8323E');
    ctx.fillStyle = cg; rr(-u * .39, -u * .98, u * .78, u * .4, u * .15); ctx.fill();
    // المرايا
    for (const side of [-1, 1]) { ctx.fillStyle = '#D62A37'; rr(side > 0 ? u * .37 : -u * .47, -u * .74, u * .1, u * .08, u * .03); ctx.fill(); }
    // الزجاج الخلفي
    const gg = ctx.createLinearGradient(0, -u * .92, 0, -u * .66);
    gg.addColorStop(0, '#5D6E90'); gg.addColorStop(1, '#253049');
    ctx.fillStyle = gg; rr(-u * .3, -u * .91, u * .6, u * .26, u * .08); ctx.fill();
    ctx.save(); rr(-u * .3, -u * .91, u * .6, u * .26, u * .08); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,.22)';
    ctx.beginPath(); ctx.moveTo(-u * .12, -u * .91); ctx.lineTo(u * .02, -u * .91); ctx.lineTo(-u * .16, -u * .65); ctx.lineTo(-u * .3, -u * .65); ctx.closePath(); ctx.fill();
    ctx.fillRect(u * .08, -u * .91, u * .05, u * .3);
    ctx.restore();
    // السقف الأبيض
    const rg = ctx.createLinearGradient(0, -u * 1.04, 0, -u * .92);
    rg.addColorStop(0, '#FFFFFF'); rg.addColorStop(1, '#D8DEEA');
    ctx.fillStyle = rg; rr(-u * .36, -u * 1.04, u * .72, u * .13, u * .065); ctx.fill();
    ctx.restore();
  }

  /* ---------- واجهة الكانفاس: البطاقة الطائرة والبطاقات والأزرار ---------- */
  function speakerGlyph(x, y, s, col, wave) {
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(-s * .5, -s * .16); ctx.lineTo(-s * .26, -s * .16); ctx.lineTo(s * .02, -s * .42); ctx.lineTo(s * .02, s * .42); ctx.lineTo(-s * .26, s * .16); ctx.lineTo(-s * .5, s * .16); ctx.closePath();
    ctx.lineWidth = s * .08; ctx.stroke(); ctx.fill();
    ctx.lineWidth = s * .09;
    for (let k = 0; k < 2; k++) {
      const a = wave > 0 ? .35 + .65 * Math.max(0, Math.sin(T * 9 - k * 1.2)) : 1;
      ctx.globalAlpha = a;
      ctx.beginPath(); ctx.arc(s * .02, 0, s * (.24 + k * .2), -.85, .85); ctx.stroke();
    }
    ctx.restore();
  }
  function drawSkyCard() {
    const c = UI.sky; if (!c) return;
    const pop = skyC.pop > 0 ? ease.outBack(1 - skyC.pop) : 1;
    const by = Math.sin(T * 2.1) * c.h * .04, rot = Math.sin(T * 1.4) * .04;
    const flip = skyC.reveal > 0 ? Math.cos(Math.min(1, skyC.reveal) * Math.PI) : 1; // 1→-1
    const sc = (1 + (skyC.speak > 0 ? Math.sin(skyC.speak * 12) * .03 : 0) - skyC.press * .08) * Math.max(.05, pop);
    ctx.save(); ctx.translate(c.x, c.y + by); ctx.rotate(rot); ctx.scale(sc * Math.max(.04, Math.abs(flip)), sc);
    const w = c.w, h = c.h, r = w * .2;
    ctx.fillStyle = 'rgba(30,70,140,.18)'; rr(-w / 2 + 4, -h / 2 + h * .1, w, h, r); ctx.fill();
    ctx.fillStyle = '#C5D5EE'; rr(-w / 2, -h / 2 + h * .06, w, h, r); ctx.fill();
    const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#EEF3FB');
    ctx.fillStyle = g; rr(-w / 2, -h / 2, w, h, r); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 2; ctx.stroke();
    if (flip < 0 && skyC.revealTxt) {
      ctx.scale(-1, 1);
      ctx.fillStyle = skyC.revealOk ? OK : BAD; rr(-w * .38, h * .26, w * .76, h * .09, h * .045); ctx.fill();
      ctx.fillStyle = INK; ctx.font = `900 ${h * .5}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(skyC.revealTxt, 0, -h * .02);
    } else {
      speakerGlyph(w * .04, -h * .08, w * .46, '#3D8BFF', skyC.speak);
      ctx.fillStyle = '#9CC4FF'; rr(-w * .3, h * .26, w * .6, h * .09, h * .045); ctx.fill();
      ctx.fillStyle = '#3D8BFF'; rr(-w * .3, h * .26, w * .6 * (skyC.speak > 0 ? clamp(1.2 - skyC.speak, 0, 1) : 1) , h * .09, h * .045); ctx.fill();
    }
    ctx.restore();
  }
  function drawCards() {
    const q = cur && cur.kind === 'q' ? cur.q : null;
    const hint = q && !chosen && !cur.res && waitT > 2.2;
    const appear = q ? clamp(1 - (cur.z - zCar) / 50 + .6, 0, 1) : 0;
    UI.cards.forEach((c, i) => {
      const f = cardFx[i], L = LANE[i];
      const sel = car.lane === i && q;
      f.lift = lerp(f.lift, sel ? 1 : 0, .2);
      const pulse = hint ? Math.max(0, Math.sin(T * 6 - i * .9)) * .06 : 0;
      const shk = f.shake > 0 ? Math.sin(f.shake * 40) * f.shake * 8 : 0;
      const sc = (1 + pulse - f.press * .1 + (f.res === 'ok' ? Math.sin(Math.min(1, f.rt) * Math.PI) * .12 : 0)) * (q ? ease.outBack(clamp(appear, 0, 1)) : .0001);
      if (sc < .02) return;
      ctx.save(); ctx.translate(c.x + shk, c.y - f.lift * 8); ctx.scale(sc, sc); ctx.rotate((i - 1) * .02);
      const w = c.w, h = c.h, r = w * .2, edge = h * .08;
      ctx.fillStyle = 'rgba(20,30,60,.28)'; rr(-w / 2 + 3, -h / 2 + edge + 6, w, h, r); ctx.fill();
      ctx.fillStyle = f.res === 'ok' ? '#23902F' : f.res === 'bad' ? '#C65F00' : L.d;
      rr(-w / 2, -h / 2 + edge, w, h, r); ctx.fill();
      const bc = f.res === 'ok' ? OK : f.res === 'bad' ? BAD : L.m;
      ctx.fillStyle = bc; rr(-w / 2, -h / 2, w, h, r); ctx.fill();
      const ig = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
      ig.addColorStop(0, '#FFFFFF'); ig.addColorStop(1, f.res === 'ok' ? '#E6FFE6' : '#F1F4FA');
      const bw = w * .075;
      ctx.fillStyle = ig; rr(-w / 2 + bw, -h / 2 + bw, w - bw * 2, h - bw * 2, r * .75); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.55)'; rr(-w / 2 + bw * 1.6, -h / 2 + bw * 1.3, w - bw * 3.2, h * .14, h * .07); ctx.fill();
      if (sel && !f.res) {
        ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 3; rr(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8, r + 4); ctx.stroke();
      }
      if (q) {
        ctx.fillStyle = INK; ctx.font = `900 ${h * .5}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(q.opts[i].txt, 0, h * .03);
      }
      if (f.res === 'ok') { ctx.font = `${h * .26}px sans-serif`; ctx.fillText('✅', w * .36, -h * .38); }
      ctx.restore();
    });
  }
  function roundBtn(b, press, face, edgeC, draw) {
    ctx.save(); ctx.translate(b.x, b.y + press * 4); ctx.scale(1 - press * .08, 1 - press * .08);
    ctx.fillStyle = 'rgba(20,30,60,.25)'; ctx.beginPath(); ctx.ellipse(0, b.r * .9, b.r * .95, b.r * .3, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = edgeC; ctx.beginPath(); ctx.arc(0, b.r * .12 * (1 - press), b.r, 0, TAU); ctx.fill();
    const g = ctx.createLinearGradient(0, -b.r, 0, b.r); g.addColorStop(0, face[0]); g.addColorStop(1, face[1]);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, b.r, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.ellipse(-b.r * .25, -b.r * .5, b.r * .42, b.r * .2, -.4, 0, TAU); ctx.fill();
    draw(); ctx.restore();
  }
  function drawButtons() {
    UI.arrows.forEach(b => {
      const pr = b.d < 0 ? btnFx.l : btnFx.r;
      roundBtn(b, pr, ['#FFFFFF', '#DCE4F1'], '#A9B7CE', () => {
        ctx.strokeStyle = '#4A5A7A'; ctx.lineWidth = b.r * .2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const d = b.d, k = b.r * .3;
        ctx.beginPath(); ctx.moveTo(-d * k * .3 + d * k * .2, -k); ctx.lineTo(d * k * .9, 0); ctx.lineTo(-d * k * .3 + d * k * .2, k); ctx.stroke();
      });
    });
    const s = UI.spk;
    roundBtn(s, btnFx.spk, ['#FFE36B', '#FFB914'], '#D98E00', () => speakerGlyph(s.r * .08, 0, s.r * .95, '#7A4A00', skyC.speak));
  }

  /* ---------- الجسيمات ---------- */
  function burst(x, y, col, n, big) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, TAU), sp = rand(80, big ? 420 : 260);
      parts.push({ t: Math.random() < .5 ? 'star' : 'conf', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 120, g: 520, rot: rand(0, TAU), vr: rand(-9, 9),
        life: rand(.6, 1.1), age: 0, s: rand(5, big ? 13 : 9), c: Math.random() < .5 ? col : pick(['#FFD447', '#FFFFFF', '#5BF06A', '#FF7EB9']) });
    }
  }
  function puff(x, y, s, col) { parts.push({ t: 'puff', x, y, vx: rand(-30, 30), vy: rand(20, 60), g: 0, life: rand(.4, .7), age: 0, s, c: col || 'rgba(230,234,242,' }); }
  function textPop(x, y, txt, col) { parts.push({ t: 'txt', x, y, vx: 0, vy: -70, g: 0, life: 1.1, age: 0, s: 26, txt, c: col }); }
  function gemFly(x, y) {
    const r = gemEl.getBoundingClientRect(), cr = cv.getBoundingClientRect();
    parts.push({ t: 'gem', x0: x, y0: y, x1: r.left - cr.left + 22, y1: r.top - cr.top + r.height / 2, age: 0, life: .9, s: 30 });
  }
  function confetti(n) {
    for (let i = 0; i < n; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .3, -10), vx: rand(-60, 60), vy: rand(80, 240), g: 60, rot: rand(0, TAU), vr: rand(-8, 8),
      life: rand(2.2, 3.6), age: 0, s: rand(6, 11), c: pick(['#FF6B6B', '#FFC93C', '#3EC1D3', '#7ED957', '#A77BFF', '#FF7EB9']) });
  }
  function starPath(r) {
    ctx.beginPath();
    for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr2 = k % 2 ? r * .45 : r; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); }
    ctx.closePath();
  }
  function updParts(dt) {
    for (const p of parts) {
      p.age += dt;
      if (p.t === 'gem') continue;
      p.vy += (p.g || 0) * dt; p.x += p.vx * dt; p.y += p.vy * dt; if (p.vr) p.rot += p.vr * dt;
      if (p.t === 'puff') { p.y += v * 4 * dt; p.vx *= .96; }
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      if (p.age >= p.life) {
        if (p.t === 'gem') { gemEl.classList.remove('pop'); void gemEl.offsetWidth; gemEl.classList.add('pop'); gemN.textContent = AR(gems()); Sound.tone(1568, .1, 'sine', .1); }
        parts.splice(i, 1);
      }
    }
    for (const l of lines) l.r += l.v * dt;
    for (let i = lines.length - 1; i >= 0; i--) if (lines[i].r > Math.max(W, H)) lines.splice(i, 1);
  }
  function drawParts() {
    for (const p of parts) {
      const k = p.age / p.life;
      ctx.save();
      if (p.t === 'puff') {
        ctx.globalAlpha = (1 - k) * .8; ctx.fillStyle = p.c + '1)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s * (.6 + k * 1.4), 0, TAU); ctx.fill();
      } else if (p.t === 'star') {
        ctx.globalAlpha = 1 - k * k; ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; starPath(p.s); ctx.fill();
      } else if (p.t === 'conf') {
        ctx.globalAlpha = Math.min(1, (1 - k) * 3); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        ctx.fillRect(-p.s / 2, -p.s * .3, p.s, p.s * .6 * Math.abs(Math.cos(p.rot * 1.3)) + 1);
      } else if (p.t === 'txt') {
        ctx.globalAlpha = Math.min(1, (1 - k) * 2.5); ctx.translate(p.x, p.y); const sc = k < .15 ? ease.outBack(k / .15) : 1; ctx.scale(sc, sc);
        ctx.font = `900 ${p.s}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'ltr';
        ctx.lineWidth = 6; ctx.strokeStyle = '#fff'; ctx.lineJoin = 'round'; ctx.strokeText(p.txt, 0, 0); ctx.fillStyle = p.c; ctx.fillText(p.txt, 0, 0);
      } else if (p.t === 'gem') {
        const e = ease.inOut(Math.min(1, k));
        const x = lerp(p.x0, p.x1, e), y = lerp(p.y0, p.y1, e) - Math.sin(e * Math.PI) * 90;
        ctx.translate(x, y); const sc = 1 + Math.sin(e * Math.PI) * .5; ctx.scale(sc, sc); ctx.rotate(Math.sin(T * 12) * .2);
        drawGem(p.s);
      }
      ctx.restore();
    }
    if (lines.length) {
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineCap = 'round';
      for (const l of lines) {
        const x1 = cx + Math.cos(l.a) * l.r, y1 = hy + Math.sin(l.a) * l.r * .7;
        const x2 = cx + Math.cos(l.a) * (l.r + l.len), y2 = hy + Math.sin(l.a) * (l.r + l.len) * .7;
        ctx.lineWidth = l.w; ctx.globalAlpha = clamp(l.r / 200, 0, .8);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }
      ctx.restore();
    }
  }
  function drawGem(s) {
    const h = s * .5;
    const pts = [[-h, -h * .35], [-h * .5, -h * .9], [h * .5, -h * .9], [h, -h * .35], [0, h]];
    ctx.fillStyle = '#2C8CFF'; ctx.beginPath(); pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#7CC4FF'; ctx.beginPath(); ctx.moveTo(-h, -h * .35); ctx.lineTo(-h * .5, -h * .9); ctx.lineTo(0, -h * .35); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(h, -h * .35); ctx.lineTo(h * .5, -h * .9); ctx.lineTo(0, -h * .35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#B9E2FF'; ctx.beginPath(); ctx.moveTo(-h * .5, -h * .9); ctx.lineTo(h * .5, -h * .9); ctx.lineTo(0, -h * .35); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1A63D0'; ctx.beginPath(); ctx.moveTo(0, -h * .35); ctx.lineTo(h, -h * .35); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.beginPath(); pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.closePath(); ctx.stroke();
  }

  /* ---------- المستويات والجولات ---------- */
  function setSegs() {
    segs.forEach((s, i) => { s.className = results[i] === true ? 'ok' : results[i] === false ? 'bad' : (i === qi && phase === 'run' ? 'cur' : ''); });
  }
  function startLevel(c, i) {
    lv = { c, i };
    clearTimeout(winTimer); clearTimeout(sayTimer);
    [winOv, lvOv, pauseOv].forEach(o => o.classList.remove('on'));
    paused = false;
    Q = makeQuestions(c, i); qi = 0; results = []; roundGems = 0;
    gates = []; cur = null; nextT = -1; chosen = false; waitT = 0; bumpT = 0; boostT = 0; finT = 0; braking = false;
    phase = 'count'; cdT = 3.9; lastCd = 4; v = 0;
    car.lane = 1; car.x = 0; car.vx = 0; car.wob = 0;
    skyC.reveal = 0; skyC.revealTxt = ''; skyC.pop = 1;
    cardFx.forEach(f => { f.res = ''; f.rt = 0; f.shake = 0; });
    parts = []; lines = [];
    const pr = loadProg(); pr.last = lkey(c, i); store.set('harakatProg', pr);
    setSegs(); gemN.textContent = AR(gems());
    App.speak(listenPhrase());
  }
  function spawnQ() {
    const q = Q[qi];
    cur = { kind: 'q', z: 50, q, n: qi + 1, res: null, doors: [0, 1, 2].map(() => ({ open: 0, burst: 0, wob: 0, flash: 0 })) };
    gates.push(cur);
    chosen = false; waitT = 0; braking = false;
    skyC.reveal = 0; skyC.pop = 1;
    cardFx.forEach(f => { f.res = ''; f.rt = 0; f.shake = 0; f.press = 0; });
    phase = 'run'; setSegs();
    Sound.tone(880, .09, 'sine', .08); Sound.tone(1320, .12, 'sine', .07, 0, .08);
    sayLater(() => speakSyl(q.tgt), 220);
  }
  function spawnFinish() {
    cur = { kind: 'finish', z: 26, n: 0, doors: [] }; gates.push(cur); phase = 'fin'; setSegs();
  }
  function resolve() {
    const g = cur, q = g.q, lane = car.lane, ok = lane === q.ans;
    g.res = { lane, ok }; results[qi] = ok; setSegs();
    const dx = sx(-1 + lane, g.z), dy = sy(g.z) - S / g.z * .9;
    skyC.reveal = .0001; skyC.revealTxt = q.tgt.txt; skyC.revealOk = ok;
    if (ok) {
      g.doors[lane].burst = .001;
      burst(dx, dy, LANE[lane].m, 34, true);
      boostT = 1.25; v = Math.max(v, 9); car.squash = 1;
      cardFx[lane].res = 'ok'; cardFx[lane].rt = 0;
      store.set('harakatGems', gems() + 1); roundGems++;
      gemFly(dx, dy); textPop(dx + 34, dy - 24, '+١', '#1E62D0');
      Sound.star(); Sound.whoosh(); vibrate(18);
      for (let k = 0; k < 14; k++) lines.push({ a: rand(0, TAU), r: rand(40, 160), v: rand(900, 1500), len: rand(40, 90), w: rand(2, 4) });
      const streak = (() => { let n = 0; for (let k = qi; k >= 0 && results[k] === true; k--) n++; return n; })();
      if (streak && streak % 3 === 0) sayLater(() => App.speak(App.g('أحسنتِ!', 'أحسنت!')), 450);
    } else {
      bumpT = .7; v = Math.min(v, 1.2); car.wob = 1; car.squash = -1; shake = 7;
      const d = g.doors[lane]; d.wob = 1; d.flash = 1;
      cardFx[lane].res = 'bad'; cardFx[lane].shake = 1;
      cardFx[q.ans].res = 'ok'; cardFx[q.ans].rt = 0;
      Sound.thud(); Sound.tone(300, .25, 'triangle', .12, -120); vibrate(40);
      for (let k = 0; k < 8; k++) puff(dx + rand(-20, 20), dy + S / g.z * .7, rand(6, 12));
      sayLater(() => speakSyl(q.tgt), 500);
    }
  }
  function finishRound() {
    phase = 'end';
    const right = results.filter(Boolean).length, miss = QN - right;
    const stars = miss === 0 ? 3 : miss <= 2 ? 2 : 1;
    const pr = loadProg(), k = lkey(lv.c, lv.i), prev = pr.s[k] || 0;
    if (stars > prev) pr.s[k] = stars;
    store.set('harakatProg', pr);
    confetti(150); Sound.win(); vibrate(30);
    winTimer = setTimeout(() => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = (stars === 3 ? App.g('رائعة!', 'رائع!') : App.g('أحسنتِ!', 'أحسنت!')) + ' 🏆';
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(n => `<span class="${n <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wG').textContent = `💎 +${AR(roundGems)}`;
      root.querySelector('.wP').textContent = `${App.g('أصبتِ', 'أصبتَ')} ${AR(right)} من ${AR(QN)}` + (miss ? '' : ' 💯');
      root.querySelector('[data-a="next"]').style.display = nextLevel() ? '' : 'none';
      winOv.classList.add('on');
      App.speak(App.g('أحسنتِ!', 'أحسنت!'));
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('harakat_first');
      if (!miss) App.achieve('harakat_perfect');
      if (gems() >= 100) App.achieve('harakat_gems');
      if (lv.c === 3) App.achieve('harakat_mix');
      if (lv.c === 0 && doneIn(pr, 0) >= CH[0].n) App.achieve('harakat_short_all');
    }, 1200);
  }
  function nextLevel() {
    const pr = loadProg();
    if (lv.i + 1 < CH[lv.c].n && isOpen(pr, lv.c, lv.i + 1)) return { c: lv.c, i: lv.i + 1 };
    for (let c = lv.c + 1; c < CH.length; c++) if (isOpen(pr, c, 0)) {
      for (let i = 0; i < CH[c].n; i++) if (isOpen(pr, c, i) && !pr.s[lkey(c, i)]) return { c, i };
    }
    return null;
  }
  function defaultLevel() {
    const pr = loadProg();
    if (pr.last) { const [c, i] = pr.last.split('-').map(Number); if (CH[c] && i < CH[c].n && isOpen(pr, c, i)) return pr.s[pr.last] ? (nextOf(pr, c, i) || { c, i }) : { c, i }; }
    return { c: 0, i: 0 };
  }
  function nextOf(pr, c, i) { return i + 1 < CH[c].n && isOpen(pr, c, i + 1) ? { c, i: i + 1 } : null; }

  /* ---------- شاشة المستويات ---------- */
  let lvTab = 0;
  function openLevels(tab) {
    const pr = loadProg();
    if (tab == null) tab = lv.c;
    lvTab = tab;
    root.querySelector('#hkLv .tabs').innerHTML = CH.map((C, c) => `<button class="tab${c === tab ? ' on' : ''}${chapOpen(pr, c) ? '' : ' lock'}" data-t="${c}" style="--c:${C.col}">${C.tab}<small>${C.t}</small></button>`).join('');
    const C = CH[tab];
    root.querySelector('#hkLv .chT').innerHTML = `${C.t} <small style="opacity:.6">· ${AR(doneIn(pr, tab))} من ${AR(C.n)}</small>` + (chapOpen(pr, tab) ? '' : `<br><small style="opacity:.7">🔒 ${App.g('أنهي', 'أنهِ')} ٣ مستويات من الفصل السابق</small>`);
    const dark = { '#FF8A2A': '#D9620B', '#3D8BFF': '#1E62D0', '#9B5CF6': '#6F32CF', '#20B486': '#11815F' }[C.col];
    root.querySelector('#hkLv .lvg').innerHTML = Array.from({ length: C.n }, (_, i) => {
      const s = pr.s[lkey(tab, i)] || 0, open = isOpen(pr, tab, i), lab = levelLabel(tab, i);
      return `<button class="lvb${open ? '' : ' lock'}${tab === lv.c && i === lv.i ? ' cur' : ''}" data-l="${i}" style="--c:${C.col};--d:${dark}" aria-label="المستوى ${i + 1}">
        <span class="e${tab === 3 ? ' sm' : ''}">${lab}</span><span class="s">${open ? [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('') : ''}</span></button>`;
    }).join('');
    root.querySelectorAll('#hkLv .tab').forEach(b => b.onclick = () => { Sound.tap(); openLevels(+b.dataset.t); });
    root.querySelectorAll('#hkLv .lvb').forEach(b => b.onclick = () => {
      const i = +b.dataset.l;
      if (!isOpen(loadProg(), lvTab, i)) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(lvTab, i);
    });
    paused = true; winOv.classList.remove('on'); pauseOv.classList.remove('on'); lvOv.classList.add('on');
    const cE = root.querySelector('#hkLv .lvb.cur'); if (cE) setTimeout(() => cE.scrollIntoView({ block: 'nearest' }), 30);
  }
  function openPause() {
    if (phase === 'end') return;
    paused = true;
    root.querySelector('.pP').textContent = `${CH[lv.c].t} · ${levelLabel(lv.c, lv.i)}`;
    pauseOv.classList.add('on');
  }
  function act(a) {
    Sound.tap();
    if (a === 'resume') { pauseOv.classList.remove('on'); paused = false; last = performance.now(); }
    else if (a === 'again') startLevel(lv.c, lv.i);
    else if (a === 'levels') openLevels();
    else if (a === 'next') { const n = nextLevel(); if (n) startLevel(n.c, n.i); else openLevels(); }
    else if (a === 'close') { lvOv.classList.remove('on'); if (phase === 'end') winOv.classList.add('on'); else { paused = false; last = performance.now(); } }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });
  root.querySelector('.pbtn').addEventListener('click', () => { Sound.tap(); openPause(); });

  /* ---------- التحكم ---------- */
  const locked = () => !!(cur && cur.kind === 'q' && cur.res && cur.z > zCar - .8);
  function steer(d) {
    if (paused || phase === 'end') return;
    if (locked()) return;
    const n = clamp(car.lane + d, 0, 2);
    if (d < 0) btnFx.l = 1; else btnFx.r = 1;
    if (n === car.lane) { car.edge = d; car.wob = Math.max(car.wob, .35); Sound.tone(200, .08, 'sine', .1); return; }
    car.lane = n; markChosen();
    Sound.slide(); Sound.tone(520 + n * 80, .07, 'triangle', .06);
    const x = sx(car.x, zCar);
    for (let k = 0; k < 3; k++) puff(x - d * Lc * .3, gy - 4, rand(5, 9));
  }
  function choose(i) {
    if (paused || phase === 'end') return;
    cardFx[i].press = 1;
    if (locked() || !(cur && cur.kind === 'q')) { Sound.tap(); return; }
    if (car.lane !== i) { Sound.slide(); const x = sx(car.x, zCar); for (let k = 0; k < 3; k++) puff(x, gy - 4, rand(5, 9)); }
    car.lane = i; markChosen(); Sound.tap(); vibrate(10);
  }
  function markChosen() { if (cur && cur.kind === 'q' && !cur.res) { chosen = true; waitT = 0; } }
  function replay() {
    if (paused) return;
    if (cur && cur.kind === 'q') speakSyl(cur.q.tgt); else if (phase === 'count') App.speak(listenPhrase());
  }
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused) return;
    const x = e.clientX, y = e.clientY;
    for (const b of UI.arrows) if (Math.hypot(x - b.x, y - b.y) < b.r * 1.25) { steer(b.d); return; }
    const s = UI.spk; if (Math.hypot(x - s.x, y - s.y) < s.r * 1.25) { btnFx.spk = 1; Sound.tap(); replay(); return; }
    const k = UI.sky; if (k && Math.abs(x - k.x) < k.w * .65 && Math.abs(y - k.y) < k.h * .65) { skyC.press = 1; replay(); return; }
    for (let i = 0; i < 3; i++) { const c = UI.cards[i]; if (Math.abs(x - c.x) < c.w / 2 + 4 && Math.abs(y - c.y) < c.h / 2 + 8) { choose(i); return; } }
    swipe = { id: e.pointerId, x, y, t: performance.now(), done: false };
  });
  cv.addEventListener('pointermove', e => {
    if (!swipe || swipe.id !== e.pointerId || swipe.done) return;
    const dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.2) { swipe.done = true; steer(dx < 0 ? -1 : 1); }
  });
  const endSwipe = e => { if (swipe && swipe.id === e.pointerId) swipe = null; };
  cv.addEventListener('pointerup', endSwipe); cv.addEventListener('pointercancel', endSwipe);
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on')) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(nextLevel() ? 'next' : 'levels'); } return; }
    if (pauseOv.classList.contains('on')) { if (e.key === 'Enter' || e.key === ' ' || e.key === 'p' || e.key === 'P') { e.preventDefault(); act('resume'); } return; }
    if (lvOv.classList.contains('on')) return;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') { e.preventDefault(); steer(-1); }
    else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') { e.preventDefault(); steer(1); }
    else if (e.key === '1' || e.key === '2' || e.key === '3') choose(+e.key - 1);
    else if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowUp') { e.preventDefault(); btnFx.spk = 1; replay(); }
    else if (e.key === 'p' || e.key === 'P') openPause();
  });
  window.addEventListener('resize', () => { if (App.current === ID) resize(); });

  /* ---------- التحديث ---------- */
  const BASE = 7.2, BOOST = 15, STOPD = 1.7;
  function update(dt) {
    T += dt;
    // العدّ التنازلي
    if (phase === 'count') {
      cdT -= dt;
      const n = Math.ceil(cdT);
      if (n !== lastCd && n <= 3 && n >= 1) { Sound.tone(660, .14, 'square', .06); car.squash = .6; }
      if (n <= 0 && lastCd > 0) { Sound.tone(1320, .3, 'square', .07); Sound.whoosh(); spawnQ(); car.squash = 1; for (let k = 0; k < 6; k++) puff(sx(car.x, zCar) + rand(-30, 30), gy, rand(8, 14)); }
      lastCd = n;
    }
    // السرعة المستهدفة
    let tv = phase === 'count' || phase === 'end' ? 0 : BASE;
    if (boostT > 0) { boostT -= dt; tv = BOOST; }
    if (bumpT > 0) {
      bumpT -= dt; tv = 0;
      if (bumpT <= .3 && cur && cur.res && !cur.res.ok) cur.doors[cur.res.lane].open = Math.max(cur.doors[cur.res.lane].open, .001);
    }
    if (phase === 'fin' && cur && cur.z < zCar) { finT += dt; tv = Math.max(0, BASE * (1 - finT)); }
    v += (tv - v) * (1 - Math.exp(-dt * (tv > v ? 2.2 : 4)));
    // كبح قبل البوابة إن لم يختر الطفل بعد
    braking = false;
    if (cur && cur.kind === 'q' && !cur.res && !chosen) {
      const d = cur.z - (zCar + STOPD);
      const vmax = Math.sqrt(2 * 8 * Math.max(0, d));
      if (v > vmax) { v = vmax; braking = d < 4; }
      if (v < .25 && d < .5) {
        waitT += dt;
        if (waitT > 7) { waitT = 2.3; speakSyl(cur.q.tgt); }
      }
    }
    car.stopShake = v < .5 && phase !== 'end' ? 1 : 0;
    const dz = v * dt;
    trav += dz;
    for (const g of gates) g.z -= dz;
    for (const p of props) { p.z -= dz; if (p.z < ZNEAR + .1) Object.assign(p, newProp(p.z + ZFAR - 2)); }
    // الإجابة عند الوصول إلى البوابة
    if (cur && cur.kind === 'q' && !cur.res && cur.z <= zCar + .55) resolve();
    if (cur) for (const d of cur.doors) {
      if (d.burst > 0) d.burst = Math.min(1, d.burst + dt * 4);
      if (d.open > 0) d.open = Math.min(1, d.open + dt * 3);
      d.wob = Math.max(0, d.wob - dt * 1.6); d.flash = Math.max(0, d.flash - dt * 1.5);
    }
    // سؤال تالٍ
    if (cur && cur.kind === 'q' && cur.res && cur.z < zCar - .3 && nextT < 0) nextT = .55;
    if (nextT >= 0) {
      nextT -= dt;
      if (nextT < 0) { nextT = -1; qi++; if (qi < QN) spawnQ(); else spawnFinish(); }
    }
    if (cur && cur.kind === 'finish' && phase === 'fin' && cur.z < zCar - .2 && !cur.passed) { cur.passed = true; finishRound(); phase = 'end'; }
    gates = gates.filter(g => g.z > .4);
    // السيارة
    const tx = car.lane - 1;
    car.vx += ((tx - car.x) * 110 - car.vx * 17) * dt;
    car.x += car.vx * dt;
    car.wob = Math.max(0, car.wob - dt * 1.4);
    car.squash *= Math.exp(-dt * 7);
    camX = car.x * .4;
    // العادم
    if (Math.random() < dt * (3 + v * .8) && phase !== 'end') {
      const u = S / zCar * .8; puff(sx(car.x, zCar) - u * .31, gy - u * .1, rand(3, 6) * (u / 80), boostT > 0 ? 'rgba(160,210,255,' : undefined);
    }
    if (boostT > 0 && Math.random() < dt * 30) lines.push({ a: rand(0, TAU), r: rand(60, 200), v: rand(900, 1500), len: rand(40, 90), w: rand(1.5, 3.5) });
    // تأثيرات الواجهة
    skyC.pop = Math.max(0, skyC.pop - dt * 2.4);
    skyC.speak = Math.max(0, skyC.speak - dt);
    skyC.press = Math.max(0, skyC.press - dt * 5);
    if (skyC.reveal > 0) skyC.reveal = Math.min(1, skyC.reveal + dt * 3.5);
    for (const f of cardFx) { f.press = Math.max(0, f.press - dt * 5); f.shake = Math.max(0, f.shake - dt * 2); f.rt += dt * 2.5; }
    btnFx.l = Math.max(0, btnFx.l - dt * 5); btnFx.r = Math.max(0, btnFx.r - dt * 5); btnFx.spk = Math.max(0, btnFx.spk - dt * 5);
    shake = Math.max(0, shake - dt * 18);
    for (const cl of clouds) { cl.x += cl.v * dt * (1 + v * .03); if (cl.x > 1.2) cl.x = -.25; }
    updParts(dt);
  }

  /* ---------- الرسم ---------- */
  function render() {
    if (!ctx) return;
    ctx.save();
    if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake) * .6);
    // الخلفية
    ctx.fillStyle = '#7CCB55'; ctx.fillRect(-10, hy - 2, W + 20, H - hy + 12);
    const gg = ctx.createLinearGradient(0, hy, 0, H);
    gg.addColorStop(0, '#A3DE78'); gg.addColorStop(.4, '#86D25D'); gg.addColorStop(1, '#5DB840');
    ctx.fillStyle = gg; ctx.fillRect(-10, hy, W + 20, H - hy + 10);
    if (bgLayer) ctx.drawImage(bgLayer, -bgPad - camX * Lc * .25, 0, bgLayer.width / dpr, bgLayer.height / dpr);
    // الغيوم
    if (sprites) for (const cl of clouds) {
      const sp = sprites.clouds[cl.spr], w = clamp(W * .3, 120, 260) * cl.s, h = w * sp.height / sp.width;
      ctx.globalAlpha = .95; ctx.drawImage(sp, cl.x * (W + w) - w - camX * 6, cl.y * (hy - 20) * .8 + 10, w, h); ctx.globalAlpha = 1;
    }
    drawGround();
    // العناصر مرتّبة من البعيد إلى القريب
    const list = [];
    for (const p of props) if (p.z < ZFAR - 1) list.push(p);
    for (const g of gates) list.push({ t: 'gate', z: g.z, g });
    list.push({ t: 'car', z: zCar - .001 });
    list.sort((a, b) => b.z - a.z);
    for (const o of list) {
      if (o.t === 'gate') drawGate(o.g);
      else if (o.t === 'car') drawCar();
      else drawProp(o);
    }
    drawParts();
    ctx.restore();
    // الواجهة
    drawSkyCard();
    drawCards();
    drawButtons();
    if (phase === 'count') drawCountdown();
  }
  function drawProp(p) {
    if (!sprites || p.z < ZNEAR + .1) return;
    const s = S / p.z, x = sx(p.X, p.z), y = sy(p.z);
    let img = p.t === 'tree' ? sprites.trees[p.v] : p.t === 'bush' ? sprites.bush : p.t === 'flowers' ? sprites.flowers : (p.side > 0 ? sprites.lampR : sprites.lampL);
    const h = p.h * s, w = h * img.width / img.height;
    if (h < 1.5 || x + w < -20 || x - w > W + 20 || y - h > H) return;
    const a = clamp((ZFAR - 1 - p.z) / 8, 0, 1);
    ctx.globalAlpha = a;
    if (p.t === 'tree' || p.t === 'bush') { ctx.fillStyle = 'rgba(30,80,20,.22)'; ctx.beginPath(); ctx.ellipse(x, y, w * .38, w * .07, 0, 0, TAU); ctx.fill(); }
    let ox = 0;
    if (p.t === 'lamp') ox = p.side > 0 ? w * (.5 - 40 / 160) : -w * (.5 - 40 / 160);
    ctx.drawImage(img, x - w / 2 - ox, y - h, w, h);
    ctx.globalAlpha = 1;
  }
  function drawCountdown() {
    const n = Math.ceil(cdT);
    if (n > 3) return;
    const f = n - cdT; // 0..1 داخل كل ثانية
    const txt = n >= 1 ? AR(n) : 'انطلق!';
    const sc = ease.outBack(clamp(f * 3, 0, 1)) * (1 + f * .15);
    ctx.save(); ctx.translate(cx, hy - (hy - UI.sky.y) * .1 + 40); ctx.scale(sc, sc); ctx.globalAlpha = clamp((1 - f) * 3, 0, 1);
    ctx.font = `900 ${n >= 1 ? 92 : 64}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round'; ctx.lineWidth = 14; ctx.strokeStyle = '#fff'; ctx.strokeText(txt, 0, 0);
    ctx.fillStyle = n === 3 ? '#FF5964' : n === 2 ? '#FF9F1C' : n === 1 ? '#FFC531' : '#36C24A'; ctx.fillText(txt, 0, 0);
    ctx.restore();
  }

  /* ---------- الحلقة ---------- */
  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(.05, (now - last) / 1000 || 0); last = now;
    if (document.hidden) return;
    if (!paused) update(dt);
    render();
  }
  function startLoop() { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(loop); }
  function stopLoop() { cancelAnimationFrame(raf); raf = 0; }

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    const g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#5AB2F2'); g.addColorStop(.45, '#BDE6FF'); g.addColorStop(.46, '#9FDC70'); g.addColorStop(1, '#5DB840');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    const hz = s * .45;
    c.fillStyle = '#7A8193'; c.beginPath(); c.moveTo(s * .47, hz); c.lineTo(s * .53, hz); c.lineTo(s * 1.05, s); c.lineTo(-s * .05, s); c.closePath(); c.fill();
    c.fillStyle = '#E8434F'; c.beginPath(); c.moveTo(s * .47, hz); c.lineTo(s * .465, hz); c.lineTo(-s * .12, s); c.lineTo(-s * .05, s); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(s * .53, hz); c.lineTo(s * .535, hz); c.lineTo(s * 1.12, s); c.lineTo(s * 1.05, s); c.closePath(); c.fill();
    c.fillStyle = '#fff'; for (let k = 0; k < 4; k++) { const t0 = .1 + k * .24, t1 = t0 + .1; c.beginPath(); c.moveTo(s * .5 - 1, hz + (s - hz) * t0); c.lineTo(s * .5 + 1, hz + (s - hz) * t0); c.lineTo(s * .5 + 1 + 3 * t1, hz + (s - hz) * t1); c.lineTo(s * .5 - 1 - 3 * t1, hz + (s - hz) * t1); c.closePath(); c.fill(); }
    // القوس
    c.strokeStyle = '#E23A48'; c.lineWidth = s * .05; c.beginPath(); c.moveTo(s * .3, hz + s * .12); c.lineTo(s * .3, hz - s * .03); c.ellipse(s * .5, hz - s * .03, s * .2, s * .16, 0, Math.PI, TAU); c.lineTo(s * .7, hz + s * .12); c.stroke();
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(s * .38, hz - s * .1, s * .24, s * .14, s * .03); c.fill();
    c.strokeStyle = '#9B5CF6'; c.lineWidth = 2.5; c.stroke();
    c.fillStyle = INK; c.font = `900 ${s * .12}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('بَ', s * .5, hz - s * .03);
    // السيارة
    const u = s * .4, x = s * .5, y = s * .93;
    c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(x, y, u * .6, u * .1, 0, 0, TAU); c.fill();
    c.fillStyle = '#22262F'; c.beginPath(); c.roundRect(x - u * .52, y - u * .3, u * .24, u * .3, u * .07); c.roundRect(x + u * .28, y - u * .3, u * .24, u * .3, u * .07); c.fill();
    const bg = c.createLinearGradient(0, y - u * .66, 0, y - u * .1); bg.addColorStop(0, '#FF6A6F'); bg.addColorStop(1, '#C9202D');
    c.fillStyle = bg; c.beginPath(); c.roundRect(x - u * .52, y - u * .66, u * 1.04, u * .52, u * .17); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(x - u * .47, y - u * .25, u * .94, u * .14, u * .07); c.fill();
    c.fillStyle = '#FFB199'; c.beginPath(); c.roundRect(x - u * .46, y - u * .55, u * .16, u * .13, u * .05); c.roundRect(x + u * .3, y - u * .55, u * .16, u * .13, u * .05); c.fill();
    c.fillStyle = '#F0434E'; c.beginPath(); c.roundRect(x - u * .39, y - u * .98, u * .78, u * .4, u * .15); c.fill();
    c.fillStyle = '#2E3A55'; c.beginPath(); c.roundRect(x - u * .3, y - u * .91, u * .6, u * .26, u * .08); c.fill();
    c.fillStyle = '#F4F6FB'; c.beginPath(); c.roundRect(x - u * .36, y - u * 1.04, u * .72, u * .13, u * .065); c.fill();
    c.fillStyle = '#FFD43B'; c.beginPath(); c.roundRect(x - u * .14, y - u * .42, u * .28, u * .12, u * .03); c.fill();
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'سباق الحركات', icon2: '🏎️', isNew: true, music: 'taxi',
    desc: () => App.g('اسمعي الحركة وقودي السيارة إلى بابها', 'اسمع الحركة وقُد السيارة إلى بابها'),
    help: () => [
      '🔊 ' + App.g('اسمعي', 'اسمع') + ' الصوت جيدًا، مثل «بَ» أو «بُو» أو «بٌ»',
      '🏎️ ' + App.g('حرّكي', 'حرّك') + ' السيارة بالسهمين ⬅️ ➡️ أو ' + App.g('المسي', 'المس') + ' البطاقة الصحيحة في الأسفل',
      '🚪 ' + App.g('ادخلي', 'ادخل') + ' من باب الحركة الصحيحة ' + App.g('لتربحي', 'لتربح') + ' ماسة 💎',
      '🟡 الزر الأصفر أو البطاقة الطائرة يعيدان الصوت',
      '🗺️ المستويات: الفتحة والضمة والكسرة، ثم المدود، ثم السكون والتنوين، ثم خلط الحروف'
    ],
    icon,
    best() {
      const pr = loadProg(), st = Object.values(pr.s).reduce((a, n) => a + n, 0), gm = gems();
      if (!st && !gm) return '';
      return `💎 ${AR(gm)} · ⭐ ${AR(st)}`;
    },
    enter() {
      paused = false;
      resize();
      if (!props.length) initProps();
      const d = defaultLevel();
      startLevel(d.c, d.i);
      startLoop();
    },
    leave() {
      stopLoop(); clearTimeout(winTimer); clearTimeout(sayTimer); swipe = null;
      [winOv, lvOv, pauseOv].forEach(o => o.classList.remove('on'));
      try { if (typeof Voice !== 'undefined') Voice.stop(); if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) {}
    },
    pause() { paused = true; },
    resume() { if (!pauseOv.classList.contains('on') && !lvOv.classList.contains('on')) { paused = false; last = performance.now(); } },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      if (pauseOv.classList.contains('on')) { act('resume'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() { return { phase, qi, lane: car.lane, ans: cur && cur.q ? cur.q.ans : -1, gz: cur ? cur.z : null, res: results.slice(), chosen, v, zCar, lv, tgt: cur && cur.q ? cur.q.tgt.txt : '', opts: cur && cur.q ? cur.q.opts.map(o => o.txt) : [] }; },
    _ui() { return UI; },
    _qs: makeQuestions, _syl: syl, _LETTERS: LETTERS, _KORDER: KORDER
  });
})();
