/* =====================================================================
   حصّالتي — نقود لعب (جنيه سوداني أو ريال سعودي) وحصّالة وردية ودكّان صغير
   التعرّف على العملات، العدّ في الحصّالة، الدفع بالمبلغ الصحيح، الباقي،
   والادّخار لشراء لعبة — بالعربية (١٢٣) أو الإنجليزية (123)
   النقود هنا رسوم لعب مبسّطة (ليست نسخًا من العملات الحقيقية)
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'piggybank', TAU = Math.PI * 2;
  const FONT = '"Baloo Bhaijaan 2",system-ui,sans-serif';
  const EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  const AD = '٠١٢٣٤٥٦٧٨٩';
  const WAR = ['صفر', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة',
    'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر', 'عشرون'];
  const WEN = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
    'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  const TAR = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون', 'مئة'];
  const TEN = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety', 'one hundred'];
  const arNum = n => n <= 20 ? WAR[n] : n % 10 === 0 ? TAR[n / 10] : WAR[n % 10] + ' و' + TAR[Math.floor(n / 10)];
  const enNum = n => n <= 20 ? WEN[n] : n % 10 === 0 ? TEN[n / 10] : TEN[Math.floor(n / 10)] + ' ' + WEN[n % 10];

  /* العملتان: ألوان مبسّطة يسهل تمييزها، ورموز لطيفة (نخلة / نيل وشمس) */
  const CUR = {
    sdg: {
      coins: [1, 2], notes: [5, 10, 20, 50], ar1: 'جنيه', ar2: 'جنيهان', arPl: 'جنيهات', arAcc: 'جنيها', en1: 'pound', enPl: 'pounds',
      abAr: 'ج.س', abEn: 'SDG', name: 'جنيه سوداني', motif: 'nile', flag: '🇸🇩',
      col: { 1: ['#FFE9A0', '#E5B23A', '#A9761A'], 2: ['#F4F7FB', '#BCC5D2', '#7D8898'], 5: '#C47A3D', 10: '#E0505A', 20: '#2FA36B', 50: '#7E5BD6' }
    },
    sar: {
      coins: [1, 2], notes: [5, 10, 50, 100], ar1: 'ريال', ar2: 'ريالان', arPl: 'ريالات', arAcc: 'ريالا', en1: 'riyal', enPl: 'riyals',
      abAr: 'ر.س', abEn: 'SAR', name: 'ريال سعودي', motif: 'palm', flag: '🇸🇦',
      col: { 1: ['#F4F7FB', '#BCC5D2', '#7D8898', '#E5B23A'], 2: ['#FFE9A0', '#E5B23A', '#A9761A', '#BCC5D2'], 5: '#8E5BD6', 10: '#9C7448', 50: '#2FA36B', 100: '#E0505A' }
    }
  };
  const ITEMS = [
    { e: '🍎', ar: 'تفاحة', en: 'Apple', p: [1, 4] }, { e: '🍌', ar: 'موزة', en: 'Banana', p: [1, 4] }, { e: '🍊', ar: 'برتقالة', en: 'Orange', p: [1, 5] },
    { e: '🧃', ar: 'عصير', en: 'Juice', p: [2, 8] }, { e: '🍦', ar: 'آيس كريم', en: 'Ice cream', p: [3, 10] }, { e: '🍉', ar: 'بطيخ', en: 'Watermelon', p: [4, 15] },
    { e: '🍇', ar: 'عنب', en: 'Grapes', p: [3, 12] }, { e: '🎈', ar: 'بالون', en: 'Balloon', p: [1, 6] }, { e: '⚽', ar: 'كرة', en: 'Ball', p: [5, 25] },
    { e: '🧸', ar: 'دبدوب', en: 'Teddy bear', p: [8, 50] }, { e: '🚗', ar: 'سيارة', en: 'Car', p: [8, 50] }, { e: '🪁', ar: 'طائرة ورقية', en: 'Kite', p: [5, 30] },
    { e: '🥁', ar: 'طبل', en: 'Drum', p: [10, 50] }, { e: '🎁', ar: 'هدية', en: 'Gift', p: [10, 50] }, { e: '🚲', ar: 'دراجة', en: 'Bicycle', p: [15, 50] }
  ];
  /* المستويات */
  const LV = [
    { k: ['find', 'find', 'find', 'find', 'find'], den: [1, 2, 5], ic: '🔍' },
    { k: ['find', 'find', 'find', 'find', 'find'], den: 'all', ic: '🔍' },
    { k: ['count', 'count', 'count', 'count', 'count'], den: [1], tot: [3, 8], ic: '🐷' },
    { k: ['count', 'count', 'count', 'count', 'count'], den: [1, 2], tot: [4, 12], ic: '🐷' },
    { k: ['pay', 'pay', 'pay', 'pay', 'pay'], den: [1, 2], price: [2, 6], ic: '🛒' },
    { k: ['pay', 'pay', 'count', 'pay', 'pay'], den: [1, 2, 5], price: [5, 10], tot: [6, 15], ic: '🛒' },
    { k: ['count', 'count', 'count', 'count', 'count'], den: [1, 2, 5, 10], tot: [10, 25], ic: '🐷' },
    { k: ['pay', 'pay', 'pay', 'pay', 'pay'], den: [1, 2, 5, 10], price: [8, 20], ic: '🛒' },
    { k: ['change', 'change', 'change', 'change', 'change'], pay: [5, 10], chg: [1, 5], ic: '🪙' },
    { k: ['change', 'change', 'change', 'change', 'change'], pay: 'big', chg: [1, 9], ic: '🪙' },
    { k: ['save', 'save', 'save', 'save', 'save'], goal: [12, 20], ic: '🎯' },
    { k: ['find', 'count', 'pay', 'change', 'pay'], den: [1, 2, 5, 10], price: [6, 20], tot: [8, 25], pay: 'big', chg: [1, 9], ic: '🏆' }
  ];
  const NL = LV.length, ROUNDS = 5;
  const CARDC = [['#FF9A3D', '#E86F0C'], ['#4D9BFF', '#1F6FE0'], ['#A66BFF', '#7A3EE0']];

  /* ---------- أدوات ---------- */
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const ease = { io: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, out: t => 1 - Math.pow(1 - t, 3), outBack: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); } };
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  function mix(a, b, t) { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join(''); }
  function starPath(c, x, y, s, rot = 0) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + rot + i * Math.PI / 5, r = i % 2 ? s * .45 : s; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); }
  const G = () => window.gsap && !(window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) ? window.gsap : null;
  const loadProg = () => { const p = store.get('piggybankProg', null) || {}; return { unlocked: clamp(p.unlocked || 1, 1, NL), stars: p.stars || {} }; };

  let lang = 'ar', cur = 'sdg';
  const isAr = () => lang === 'ar';
  const C = () => CUR[cur];
  const dg = n => isAr() ? String(n).replace(/\d/g, d => AD[d]) : String(n);
  const isCoin = v => C().coins.includes(v);
  const allDen = () => C().coins.concat(C().notes);
  function say(ar, en) { if (isAr()) App.speak(ar); else App.speak(en, 'en'); }
  function arAmt(n) { const c = C(); if (n === 1) return c.ar1 + ' واحد'; if (n === 2) return c.ar2; if (n === 100) return 'مئة ' + c.ar1; return arNum(n) + ' ' + (n <= 10 ? c.arPl : c.arAcc); }
  const enAmt = n => enNum(n) + ' ' + (n === 1 ? C().en1 : C().enPl);
  const sayAmt = n => say(arAmt(n), enAmt(n));
  const sayNum = n => say(arNum(n), enNum(n));
  const unitTxt = n => isAr() ? (n >= 3 && n <= 10 ? C().arPl : C().ar1) : (n === 1 ? C().en1 : C().enPl);
  const abbr = () => isAr() ? C().abAr : C().abEn;
  const praise = () => say(App.g('أحسنتِ!', 'أحسنت!'), 'Great job!');
  const tryAgain = () => say(App.g('حاولي مرة أخرى', 'حاول مرة أخرى'), 'Try again!');
  /* تفكيك مبلغ إلى أكبر فئات ممكنة */
  function decompose(n, den) { const out = []; den = den.slice().sort((a, b) => b - a); for (const d of den) while (n >= d) { out.push(d); n -= d; } return n ? null : out; }

  /* ---------- الواجهة ---------- */
  App.css(`
  #piggybank{background:#E3F6EE;overflow:hidden;color:#20504A}
  #piggybank canvas.sc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #piggybank .ib{color:#1E8C7A}
  #piggybank .curb{font-size:15px;font-weight:900;color:#B0156A;overflow:hidden;padding:0}
  #piggybank .curb img{width:36px;height:36px;display:block}
  #piggybank .lang{display:flex;background:#fff;border-radius:99px;padding:4px;gap:3px;border:3px solid #fff;box-shadow:0 4px 0 rgba(20,90,70,.2),0 8px 16px rgba(20,80,60,.15)}
  #piggybank .lang button{min-width:56px;padding:6px 10px;border-radius:99px;font-weight:900;font-size:17px;background:#EAF7F2;color:#2B8C76;line-height:1.25}
  #piggybank .lang button[data-l=en]{font-family:system-ui,"Segoe UI",sans-serif;font-size:15px}
  #piggybank .lang button.on{background:linear-gradient(#FF8CC6,#F0479A);color:#fff;box-shadow:0 3px 0 #B9236C;text-shadow:0 1px 0 rgba(0,0,0,.2)}
  #piggybank .prog{position:absolute;z-index:4;left:50%;transform:translateX(-50%);top:calc(max(10px,env(safe-area-inset-top)) + 56px);
    display:flex;gap:5px;width:min(calc(100% - 40px),330px);height:16px;padding:3px;background:rgba(255,255,255,.92);border-radius:99px;box-shadow:0 3px 0 rgba(20,90,70,.12),0 6px 12px rgba(20,80,60,.1)}
  #piggybank .prog i{flex:1;border-radius:99px;background:#D8ECE5;box-shadow:inset 0 2px 2px rgba(0,0,0,.08)}
  #piggybank .prog i.on{background:linear-gradient(#8CE58F,#3DBE52);box-shadow:inset 0 2px 0 rgba(255,255,255,.5),0 1px 0 #2A9440;animation:pbPop .45s cubic-bezier(.3,1.8,.5,1)}
  #piggybank .prog i.cur{background:linear-gradient(#FFE07A,#FFC234)}
  @keyframes pbPop{40%{transform:scale(1.25,1.5)}}
  #piggybank .ban{position:absolute;z-index:4;top:calc(max(10px,env(safe-area-inset-top)) + 82px);left:50%;transform:translateX(-50%);width:min(calc(100% - 24px),560px);
    background:#fff;border:4px solid #BFE9DA;border-radius:24px;box-shadow:0 5px 0 #7FCFB5,0 12px 24px rgba(20,90,70,.14);padding:5px 14px;color:#1F5E52;
    font-weight:900;font-size:clamp(18px,5vw,24px);min-height:54px;display:flex;align-items:center;justify-content:center;gap:8px;text-align:center;line-height:1.25;cursor:pointer;transition:opacity .3s}
  #piggybank .ban.off{opacity:0;pointer-events:none}
  #piggybank .ban .eq{unicode-bidi:isolate;display:inline-flex;gap:6px;align-items:center;font-size:1.1em;color:#E0457F}
  #piggybank .ban .eq b{min-width:1.1em;padding:0 7px;border-radius:12px;background:#FFEAF3;box-shadow:inset 0 -3px 0 #FFC7DE}
  #piggybank .ban .eq b.q{background:#FFE58A;color:#9A5A00;box-shadow:inset 0 -3px 0 #F2C14E}
  #piggybank .ban .eq i{font-style:normal;opacity:.8}
  #piggybank .ban small{font-size:.62em;opacity:.75}
  #piggybank .ban.bump{animation:pbBump .5s}
  #piggybank .ban.shake{animation:pbShake .45s}
  @keyframes pbBump{30%{transform:translateX(-50%) scale(1.06)}}
  @keyframes pbShake{20%{transform:translateX(calc(-50% - 9px))}45%{transform:translateX(calc(-50% + 8px))}70%{transform:translateX(calc(-50% - 5px))}}
  #piggybank .foot{position:absolute;left:0;right:0;bottom:0;z-index:4;padding:0 12px max(14px,env(safe-area-inset-bottom));display:flex;justify-content:center;pointer-events:none}
  #piggybank .ctl{width:min(100%,620px);display:flex;align-items:center;justify-content:center;gap:12px;min-height:96px}
  #piggybank .cards{display:flex;gap:10px;justify-content:center;flex:1}
  #piggybank .cd{pointer-events:auto;flex:0 1 112px;min-width:0;min-height:92px;border-radius:24px;background:linear-gradient(#fff 0%,#fff 70%,#F2FBF7 100%);border:5px solid var(--c);
    box-shadow:0 7px 0 var(--d),0 14px 20px rgba(20,80,60,.2);color:var(--d);font-weight:900;line-height:1;padding:6px 4px;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;transition:transform .16s cubic-bezier(.3,1.7,.55,1),box-shadow .16s,opacity .3s}
  #piggybank .cd b{font-size:40px;line-height:1}
  #piggybank .cd small{font-size:13px;opacity:.8}
  #piggybank .cd img{width:100%;max-width:92px;height:42px;object-fit:contain;display:block}
  #piggybank .cd:active{transform:translateY(5px) scale(1.04,.95);box-shadow:0 2px 0 var(--d)}
  #piggybank .cd.no{animation:pbNo .45s;filter:saturate(.3);opacity:.5}
  #piggybank .cd.ok{background:linear-gradient(#E9FFE6,#BFF5B8);border-color:#3DBE52;color:#1E8A35;box-shadow:0 7px 0 #1E8A35,0 0 0 6px rgba(80,220,100,.35)}
  #piggybank .cd.hint{animation:pbGlow 1s ease-in-out infinite}
  @keyframes pbNo{20%{transform:translateX(-8px) rotate(-4deg)}45%{transform:translateX(7px) rotate(3deg)}70%{transform:translateX(-4px)}}
  @keyframes pbGlow{50%{box-shadow:0 7px 0 var(--d),0 0 0 8px rgba(255,214,60,.75)}}
  #piggybank .done{pointer-events:auto;height:64px;padding:0 30px;border-radius:99px;font-size:25px;font-weight:900;color:#fff;
    background:linear-gradient(#78E584,#2DB84A);box-shadow:0 6px 0 #1E8A35,0 12px 20px rgba(20,120,40,.28),inset 0 3px 0 rgba(255,255,255,.45);border:3px solid rgba(255,255,255,.8);
    text-shadow:0 2px 0 rgba(0,90,20,.35);transition:transform .25s cubic-bezier(.3,1.6,.6,1),opacity .2s}
  #piggybank .done:active{transform:translateY(4px);box-shadow:0 2px 0 #1E8A35}
  #piggybank .off2{display:none!important}
  #piggybank .spk{pointer-events:auto;flex:0 0 62px;width:62px;height:62px;border-radius:50%;border:3px solid #FFF4C4;
    background:radial-gradient(circle at 35% 28%,#FFF6B8,#FFD21E 48%,#F0A400);box-shadow:0 5px 0 #C98500,0 10px 18px rgba(160,100,0,.28),inset 0 2px 0 rgba(255,255,255,.6);font-size:27px;display:grid;place-items:center}
  #piggybank .spk:active{transform:translateY(3px);box-shadow:0 2px 0 #C98500}
  #piggybank .spk.talk{animation:pbTalk .5s}
  @keyframes pbTalk{30%{transform:scale(1.15)}60%{transform:scale(.95)}}
  #piggybank .overlay{background:radial-gradient(circle at 50% 45%,rgba(20,80,60,.25),rgba(10,50,40,.5))}
  #piggybank .panel{border:5px solid #FFC7DE;box-shadow:0 9px 0 #F26DB0,0 22px 40px rgba(60,0,30,.3);color:#3A2440}
  #piggybank .panel h3{color:#E0217F}
  #piggybank .lvp{width:min(94vw,450px);max-height:90vh;overflow-y:auto;touch-action:pan-y}
  #piggybank .curs{display:flex;gap:8px;justify-content:center;margin:4px 0 6px}
  #piggybank .curs button{flex:1;max-width:190px;padding:8px 6px;border-radius:20px;font-weight:900;font-size:16px;background:#fff;border:3px solid #E6EEF0;box-shadow:0 4px 0 #D3DEE2;color:#4A5C66;display:flex;align-items:center;justify-content:center;gap:6px}
  #piggybank .curs button img{width:30px;height:30px}
  #piggybank .curs button.on{border-color:#3DBE9A;box-shadow:0 4px 0 #24967A;background:#EBFFF7;color:#1C7A63}
  #piggybank .lvg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:10px 0 12px}
  #piggybank .lvb{position:relative;aspect-ratio:.9;border-radius:20px;background:#fff;border:3px solid #BFE9DA;box-shadow:0 5px 0 #7FCFB5;
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#1F6E5E;font-weight:900;gap:1px}
  #piggybank .lvb:active{transform:translateY(3px);box-shadow:0 2px 0 #7FCFB5}
  #piggybank .lvb .n{font-size:13px;position:absolute;top:3px;right:8px;opacity:.65}
  #piggybank .lvb .e{font-size:28px;line-height:1.15}
  #piggybank .lvb .s{font-size:11px;letter-spacing:-1px;line-height:1;height:12px}
  #piggybank .lvb .s i{font-style:normal}
  #piggybank .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #piggybank .lvb.cur{outline:3px solid #FF4FA3;outline-offset:2px}
  #piggybank .lvb.lock{background:#EEF2F1;border-color:#DCE4E2;box-shadow:0 5px 0 #C8D3D0;color:#8A9A96}
  #piggybank .lvb.lock .e{filter:grayscale(1);opacity:.35}
  #piggybank .lvb.lock::after{content:'🔒';position:absolute;font-size:16px;bottom:2px;left:4px}
  @media (max-width:375px){#piggybank .bar{gap:6px}#piggybank .lang button{min-width:46px;padding:6px 7px}#piggybank .cd{flex-basis:104px}#piggybank .cd b{font-size:34px}#piggybank .cd img{width:84px}}
  `);

  const root = App.section(ID, `
    <canvas class="sc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة">❓</button>
      <button class="ib lvbtn" aria-label="المستويات">🗺️</button>
      <button class="ib curb" aria-label="العملة"></button>
      <span class="grow"></span>
      <div class="lang" role="group" aria-label="اللغة"><button data-l="ar">عربي</button><button data-l="en">English</button></div>
    </div>
    <div class="prog"></div>
    <div class="ban off" role="button" aria-label="إعادة السؤال"></div>
    <div class="foot"><div class="ctl">
      <div class="cards"></div>
      <button class="done off2" aria-label="ادفع"></button>
      <button class="spk" aria-label="إعادة الصوت">🔊</button>
    </div></div>
    <div class="overlay" id="pbLv"><div class="panel lvp"><h3>🐷 المستويات</h3>
      <div class="curs"><button data-c="sdg"></button><button data-c="sar"></button></div>
      <div class="lvg"></div>
      <button class="btn alt" data-a="close">✕ إغلاق</button></div></div>
    <div class="overlay" id="pbWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="again">🔄 مرة أخرى</button><button class="btn alt" data-a="levels">🗺️</button><button class="btn alt home" aria-label="الرئيسية">🏠</button>
    </div></div>`);
  const cv = root.querySelector('canvas.sc');
  const ban = root.querySelector('.ban'), progEl = root.querySelector('.prog'), cardsEl = root.querySelector('.cards');
  const doneBtn = root.querySelector('.done'), spkBtn = root.querySelector('.spk'), curBtn = root.querySelector('.curb');
  const lvOv = root.querySelector('#pbLv'), winOv = root.querySelector('#pbWin');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1, bg = null;
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let lvl = 1, qi = 0, R = null, mistakes = 0, fails = 0, phase = 'idle';
  let money = [], parts = [], timers = [], drag = null, shake = 0;
  let S = null; // التخطيط
  let pig = { x: 0, y: 0, s: 100, wig: 0, sq: 0, blink: 0, blinkAt: 2, total: 0, show: false, hop: 0 };
  let tray = null, item = null, bub = { v: 0, pop: 0 }, saveTot = 0, saveGoal = 0, saveItem = null, banT = 0;

  function later(s, fn) { timers.push({ at: T + s, fn }); }
  function clearLater() { timers = []; }

  /* ---------- رسم النقود (مع ذاكرة مؤقتة) ---------- */
  const cache = new Map();
  function palm(c, x, y, s, col) {
    c.save(); c.translate(x, y); c.strokeStyle = col; c.fillStyle = col; c.lineCap = 'round';
    c.lineWidth = s * .14; c.beginPath(); c.moveTo(0, s * .55); c.quadraticCurveTo(s * .08, s * .1, 0, -s * .2); c.stroke();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i - 2) * .55;
      c.beginPath(); c.moveTo(0, -s * .2); c.quadraticCurveTo(Math.cos(a) * s * .35, -s * .2 + Math.sin(a) * s * .45 - s * .1, Math.cos(a) * s * .55, -s * .2 + Math.sin(a) * s * .35 + s * .12);
      c.lineWidth = s * .12; c.stroke();
    }
    c.restore();
  }
  function nile(c, x, y, s, col) {
    c.save(); c.translate(x, y); c.strokeStyle = col; c.fillStyle = col; c.lineCap = 'round';
    c.beginPath(); c.arc(0, -s * .12, s * .22, 0, TAU); c.fill();
    c.lineWidth = s * .06;
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.beginPath(); c.moveTo(Math.cos(a) * s * .3, -s * .12 + Math.sin(a) * s * .3); c.lineTo(Math.cos(a) * s * .4, -s * .12 + Math.sin(a) * s * .4); c.stroke(); }
    c.lineWidth = s * .09;
    for (let k = 0; k < 2; k++) { c.beginPath(); for (let i = 0; i <= 12; i++) { const xx = -s * .55 + i * s * 1.1 / 12; c.lineTo(xx, s * (.32 + k * .2) + Math.sin(i * 1.1) * s * .05); } c.stroke(); }
    c.restore();
  }
  function motif(c, x, y, s, col) { if (C().motif === 'palm') palm(c, x, y, s, col); else nile(c, x, y, s, col); }
  /* يرسم ورقة/عملة في لوحة منفصلة بحجم معطى */
  function moneyCanvas(v, size) {
    const key = cur + v + '|' + Math.round(size) + lang;
    if (cache.has(key)) return cache.get(key);
    const coin = isCoin(v), k = 2;
    const w = coin ? size * 2 : size * 3.2, h = coin ? size * 2 : size * 1.62, pad = size * .2;
    const cnv = document.createElement('canvas'); cnv.width = Math.ceil((w + pad * 2) * k); cnv.height = Math.ceil((h + pad * 2) * k);
    const c = cnv.getContext('2d'); c.scale(k, k); c.translate(pad + w / 2, pad + h / 2);
    const txt = dg(v);
    if (coin) {
      const cc = C().col[v], r = size;
      // الحافة الخارجية
      let g = c.createRadialGradient(-r * .3, -r * .35, r * .1, 0, 0, r);
      const ringCol = cc[3] ? [mix(cc[3], '#ffffff', .5), cc[3], mix(cc[3], '#000000', .35)] : cc;
      g.addColorStop(0, ringCol[0]); g.addColorStop(.6, ringCol[1]); g.addColorStop(1, ringCol[2]);
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = r * .05;
      for (let i = 0; i < 36; i++) { const a = i / 36 * TAU; c.beginPath(); c.moveTo(Math.cos(a) * r * .9, Math.sin(a) * r * .9); c.lineTo(Math.cos(a) * r * .98, Math.sin(a) * r * .98); c.stroke(); }
      // الوسط
      g = c.createRadialGradient(-r * .25, -r * .3, r * .05, 0, 0, r * .8);
      g.addColorStop(0, cc[0]); g.addColorStop(.65, cc[1]); g.addColorStop(1, cc[2]);
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, r * .78, 0, TAU); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.6)'; c.lineWidth = r * .04; c.beginPath(); c.arc(0, 0, r * .72, Math.PI * 1.05, Math.PI * 1.75); c.stroke();
      c.strokeStyle = 'rgba(0,0,0,.18)'; c.beginPath(); c.arc(0, 0, r * .72, Math.PI * .05, Math.PI * .75); c.stroke();
      motif(c, 0, -r * .42, r * .38, 'rgba(0,0,0,.2)');
      c.font = `900 ${r * .95}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillStyle = 'rgba(255,255,255,.65)'; c.fillText(txt, r * .03, r * .2);
      c.fillStyle = mix(cc[2], '#000000', .25); c.fillText(txt, 0, r * .16);
      c.font = `800 ${r * .26}px ${FONT}`; c.fillStyle = 'rgba(0,0,0,.35)'; c.fillText(abbr(), 0, r * .6);
      // لمعة
      c.fillStyle = 'rgba(255,255,255,.45)'; c.beginPath(); c.ellipse(-r * .38, -r * .5, r * .2, r * .1, -.7, 0, TAU); c.fill();
    } else {
      const base = C().col[v], rr = h * .14;
      let g = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
      g.addColorStop(0, mix(base, '#ffffff', .35)); g.addColorStop(.5, base); g.addColorStop(1, mix(base, '#000000', .2));
      c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, rr); c.fill();
      // نقش بسيط: خطوط متموجة خفيفة
      c.save(); c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, rr); c.clip();
      c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = h * .025;
      for (let k2 = 0; k2 < 6; k2++) { c.beginPath(); for (let i = 0; i <= 20; i++) { const x = -w / 2 + i * w / 20; c.lineTo(x, -h / 2 + h * (k2 + .5) / 6 + Math.sin(i * .7 + k2) * h * .04); } c.stroke(); }
      c.restore();
      // الإطار الداخلي
      c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = h * .04; c.setLineDash([h * .08, h * .05]);
      c.beginPath(); c.roundRect(-w / 2 + h * .08, -h / 2 + h * .08, w - h * .16, h - h * .16, rr * .7); c.stroke(); c.setLineDash([]);
      // دائرة الرمز
      const ex = -w * .17;
      c.fillStyle = 'rgba(255,255,255,.88)'; c.beginPath(); c.arc(ex, 0, h * .3, 0, TAU); c.fill();
      motif(c, ex, h * .02, h * .36, base);
      // الرقم الكبير
      c.font = `900 ${h * .52}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillStyle = 'rgba(0,0,0,.2)'; c.fillText(txt, w * .23, h * .02 + h * .04);
      c.fillStyle = '#fff'; c.fillText(txt, w * .23, h * .02);
      c.font = `800 ${h * .17}px ${FONT}`; c.fillStyle = 'rgba(255,255,255,.95)';
      c.fillText(isAr() ? (v >= 3 && v <= 10 ? C().arPl : C().ar1) : (C().enPl), w * .23, h * .33);
      c.font = `900 ${h * .17}px ${FONT}`; c.fillText(txt, -w * .4, -h * .3); c.fillText(txt, -w * .4, h * .3);
      // لمعة
      g = c.createLinearGradient(0, -h / 2, 0, 0); g.addColorStop(0, 'rgba(255,255,255,.3)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = g; c.beginPath(); c.roundRect(-w / 2 + 2, -h / 2 + 2, w - 4, h * .45, rr); c.fill();
      c.strokeStyle = mix(base, '#000000', .3); c.lineWidth = 1.5; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, rr); c.stroke();
    }
    const out = { cnv, w: w + pad * 2, h: h + pad * 2, bw: w, bh: h };
    if (cache.size > 120) cache.clear();
    cache.set(key, out);
    return out;
  }
  function drawMoneyAt(c, v, x, y, size, rot = 0, sx = 1, sy = 1, alpha = 1) {
    const m = moneyCanvas(v, size);
    c.save(); c.globalAlpha = alpha; c.translate(x, y); c.rotate(rot); c.scale(sx, sy);
    c.shadowColor = 'rgba(20,60,50,.28)'; c.shadowBlur = size * .25; c.shadowOffsetY = size * .12;
    c.drawImage(m.cnv, -m.w / 2, -m.h / 2, m.w, m.h);
    c.restore();
  }
  const stickers = new Map();
  function emojiSticker(ch, size) {
    const key = ch + '|' + Math.round(size);
    if (stickers.has(key)) return stickers.get(key);
    const k = 2, S2 = Math.ceil(size * 1.5 * k), a = document.createElement('canvas'); a.width = a.height = S2;
    const ac = a.getContext('2d'); ac.font = `${size * k}px ${EMOJI}`; ac.textAlign = 'center'; ac.textBaseline = 'middle'; ac.fillText(ch, S2 / 2, S2 / 2 + size * k * .06);
    const o = document.createElement('canvas'); o.width = o.height = S2; const oc = o.getContext('2d');
    const line = size * k * .07;
    for (let i = 0; i < 16; i++) { const t = i / 16 * TAU; oc.drawImage(a, Math.cos(t) * line, Math.sin(t) * line); }
    oc.globalCompositeOperation = 'source-in'; oc.fillStyle = '#fff'; oc.fillRect(0, 0, S2, S2);
    oc.globalCompositeOperation = 'source-over'; oc.drawImage(a, 0, 0);
    const out = { cnv: o, s: S2 / k };
    if (stickers.size > 60) stickers.clear();
    stickers.set(key, out); return out;
  }
  function drawEmoji(c, ch, x, y, size, rot = 0, sc = 1) {
    const st = emojiSticker(ch, size);
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(sc, sc);
    c.shadowColor = 'rgba(20,60,50,.3)'; c.shadowBlur = size * .15; c.shadowOffsetY = size * .08;
    c.drawImage(st.cnv, -st.s / 2, -st.s / 2, st.s, st.s); c.restore();
  }
  /* صورة صغيرة لمجموعة نقود (لبطاقات الباقي وزر العملة) */
  function groupImg(v, wpx, hpx) {
    const parts2 = decompose(v, allDen()) || [v];
    const cnv = document.createElement('canvas'); cnv.width = wpx * 2; cnv.height = hpx * 2;
    const c = cnv.getContext('2d'); c.scale(2, 2);
    const n = parts2.length, size = hpx * .36;
    const items = parts2.map(d => ({ d, w: isCoin(d) ? size * 2 : size * 3.2 }));
    const totalW = items.reduce((a, b) => a + b.w, 0);
    const step = n > 1 ? Math.min((wpx - items[0].w) / (n - 1), items[0].w * .7) : 0;
    let x = wpx / 2 - (step * (n - 1)) / 2;
    if (!totalW) return '';
    items.forEach((it, i) => { drawMoneyAt(c, it.d, x + i * step, hpx / 2, isCoin(it.d) ? size : size * .8, (i - (n - 1) / 2) * .08); });
    return cnv.toDataURL();
  }
  function paintCurBtn() {
    curBtn.innerHTML = `<img alt="" src="${groupImg(1, 40, 40)}">`;
    root.querySelectorAll('.curs button').forEach(b => {
      const c0 = cur; cur = b.dataset.c;
      b.innerHTML = `<img alt="" src="${groupImg(1, 34, 34)}">${C().name}`;
      cur = c0; b.classList.toggle('on', b.dataset.c === cur);
    });
  }

  /* ---------- الحصّالة ---------- */
  function drawPiggy(c, x, y, s, wig, sq, blink, happy) {
    c.save(); c.translate(x, y);
    // ظل
    c.fillStyle = 'rgba(20,70,55,.22)'; c.beginPath(); c.ellipse(0, 0, s * .48, s * .07, 0, 0, TAU); c.fill();
    const rot = Math.sin(wig * 22) * .12 * wig;
    c.rotate(rot); c.scale(1 + sq * .12, 1 - sq * .12);
    const by = -s * .4, rx = s * .5, ry = s * .36;
    const face = isAr() ? -1 : 1; // يتجه الوجه نحو بداية القراءة
    c.scale(face, 1);
    // الأرجل
    const legG = c.createLinearGradient(0, -s * .15, 0, 0); legG.addColorStop(0, '#F27BAE'); legG.addColorStop(1, '#D9558F');
    [-.3, -.1, .14, .32].forEach((k, i) => { c.fillStyle = i % 2 ? '#E7699F' : legG; c.beginPath(); c.roundRect(s * k - s * .07, -s * .16, s * .14, s * .16, s * .05); c.fill(); c.fillStyle = '#B83F74'; c.beginPath(); c.roundRect(s * k - s * .07, -s * .04, s * .14, s * .045, s * .02); c.fill(); });
    // الذيل
    c.strokeStyle = '#E7699F'; c.lineWidth = s * .035; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-rx * .95, by - s * .02); c.bezierCurveTo(-rx * 1.25, by - s * .14, -rx * 1.05, by - s * .26, -rx * 1.15, by - s * .1); c.bezierCurveTo(-rx * 1.25, by + s * .02, -rx * 1.35, by - s * .1, -rx * 1.28, by - s * .16); c.stroke();
    // الجسم
    let g = c.createRadialGradient(-rx * .2, by - ry * .5, s * .05, 0, by, rx * 1.1);
    g.addColorStop(0, '#FFD3E6'); g.addColorStop(.5, '#FF9CC8'); g.addColorStop(1, '#E2609A');
    c.fillStyle = g; c.beginPath(); c.ellipse(0, by, rx, ry, 0, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(180,50,110,.35)'; c.lineWidth = s * .012; c.stroke();
    // الأذنان
    [[rx * .25, -1], [rx * .5, 1]].forEach(([ex, k]) => {
      c.fillStyle = k > 0 ? '#F07AAE' : '#E7699F';
      c.beginPath(); c.moveTo(ex - s * .09, by - ry * .78); c.quadraticCurveTo(ex - s * .02, by - ry * 1.45, ex + s * .1, by - ry * 1.12); c.quadraticCurveTo(ex + s * .06, by - ry * .85, ex + s * .04, by - ry * .72); c.closePath(); c.fill();
      c.fillStyle = '#FFC2DC'; c.beginPath(); c.moveTo(ex - s * .05, by - ry * .82); c.quadraticCurveTo(ex, by - ry * 1.25, ex + s * .06, by - ry * 1.05); c.closePath(); c.fill();
    });
    // فتحة النقود
    c.fillStyle = '#9C2E63'; c.beginPath(); c.roundRect(-s * .14, by - ry * .97, s * .26, s * .045, s * .02); c.fill();
    c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.roundRect(-s * .14, by - ry * .97 + s * .04, s * .26, s * .012, s * .006); c.fill();
    // البطن والخد
    c.fillStyle = 'rgba(255,255,255,.35)'; c.beginPath(); c.ellipse(-rx * .25, by - ry * .45, rx * .35, ry * .2, -.3, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,90,140,.35)'; c.beginPath(); c.ellipse(rx * .55, by + ry * .2, s * .07, s * .045, 0, 0, TAU); c.fill();
    // الأنف
    g = c.createRadialGradient(rx * .9, by - s * .02, s * .01, rx * .95, by, s * .14);
    g.addColorStop(0, '#FFC0DA'); g.addColorStop(1, '#EE6EA6');
    c.fillStyle = g; c.beginPath(); c.ellipse(rx * .95, by + s * .02, s * .1, s * .13, 0, 0, TAU); c.fill();
    c.fillStyle = '#B83F74'; c.beginPath(); c.ellipse(rx * .93, by - s * .02, s * .018, s * .03, 0, 0, TAU); c.ellipse(rx * .99, by + s * .06, s * .018, s * .03, 0, 0, TAU); c.fill();
    // العين
    const ex = rx * .58, ey = by - ry * .3;
    if (blink > 0 || happy) {
      c.strokeStyle = '#4A1530'; c.lineWidth = s * .022; c.beginPath(); c.arc(ex, ey + (happy ? s * .02 : 0), s * .035, happy ? Math.PI * 1.1 : 0, happy ? Math.PI * 1.9 : Math.PI); c.stroke();
    } else {
      c.fillStyle = '#3A1026'; c.beginPath(); c.ellipse(ex, ey, s * .035, s * .045, 0, 0, TAU); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(ex - s * .01, ey - s * .015, s * .013, 0, TAU); c.fill();
    }
    // الفم
    c.strokeStyle = '#B83F74'; c.lineWidth = s * .015; c.beginPath(); c.arc(rx * .7, by + ry * .4, s * .04, .2, Math.PI * .8); c.stroke();
    c.restore();
  }

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    const topY = Math.max(ban.getBoundingClientRect().bottom || 140, 120) + 6;
    const botY = (root.querySelector('.ctl').getBoundingClientRect().top || H - 110) - 8;
    const sw = Math.min(W - 20, 760), sh = botY - topY;
    const u = clamp(Math.min(sw / 8.6, sh / 8), 22, 44);
    S = { topY, botY, sw, sh, sx: (W - sw) / 2, cx: W / 2, u, portrait: W / H < 1.05 };
    placeScene(true);
    bg = null;
  }
  const dirX = () => isAr() ? 1 : -1; // في العربية تبدأ الأشياء من اليمين
  function placeScene(snap) {
    if (!S || !R) return;
    const { topY, sh, sw, cx, u } = S, t = R.type;
    const ps = clamp(Math.min(sw * .42, sh * (t === 'find' ? .26 : .32)), 80, 210);
    pig.s = ps; pig.show = t === 'count' || t === 'save' || t === 'find';
    if (t === 'count') { pig.x = cx; pig.y = topY + sh * .5; }
    else if (t === 'save') { pig.x = cx - dirX() * sw * .12; pig.y = topY + sh * .6; }
    else if (t === 'find') { pig.x = cx; pig.y = topY + sh * .97; }
    S.counterY = t === 'find' ? topY + sh * .72 : topY + sh * .58;
    if (t === 'pay' || t === 'change') {
      item = item || {};
      item.x = cx + dirX() * sw * .2; item.y = topY + sh * .2; item.s = clamp(u * 2.4, 60, 110);
      const tw = Math.min(sw * .86, 440), th = clamp(u * 2.4, 66, 110);
      tray = { x: cx, y: topY + sh * .45, w: tw, h: th };
    } else if (t === 'save') {
      item = item || {}; item.x = cx + dirX() * sw * .28; item.y = topY + sh * .24; item.s = clamp(u * 2.1, 56, 100); tray = null;
    } else { tray = null; }
    layoutMoney(snap);
  }
  function wallZone() {
    const { topY, sh, botY } = S, t = R.type;
    if (t === 'find') return { y0: topY + sh * .1, y1: topY + sh * .62 };
    if (t === 'count') return { y0: topY + sh * .62, y1: botY };
    if (t === 'save') return { y0: topY + sh * .68, y1: botY };
    return { y0: topY + sh * .66, y1: botY };
  }
  function layoutMoney(snap) {
    const z = wallZone(), u = S.u;
    const list = money.filter(m => m.st === 'wallet');
    let size = R.type === 'find' ? u * 1.25 : u, rowsL, rh;
    const maxW = Math.min(S.sw, 600);
    for (let it = 0; it < 8; it++) {
      const wOf = m => (isCoin(m.v) ? size * 2.1 : size * 2.8) + size * .25;
      rowsL = []; let rowA = [], rw = 0;
      list.forEach(m => { const w = wOf(m); if (rowA.length && rw + w > maxW) { rowsL.push(rowA); rowA = []; rw = 0; } rowA.push(m); rw += w; });
      if (rowA.length) rowsL.push(rowA);
      rh = Math.min((z.y1 - z.y0) / Math.max(1, rowsL.length), size * 2.6);
      if (rh >= size * 2.2 || size < 16) break;
      size *= .9;
    }
    const wOf = m => (isCoin(m.v) ? size * 2.1 : size * 2.8) + size * .25;
    const y0 = (z.y0 + z.y1) / 2 - rh * rowsL.length / 2 + rh / 2;
    rowsL.forEach((row, k) => {
      const tw = row.reduce((a, m) => a + wOf(m), 0);
      let x = S.cx + dirX() * tw / 2;
      row.forEach(m => {
        const w = wOf(m); x -= dirX() * w / 2;
        m.hx = x; m.hy = y0 + k * rh; m.size = isCoin(m.v) ? size : size * .82;
        if (snap) { m.x = m.hx; m.y = m.hy; } else if (!m.fly && !m.drag) flyTo(m, m.hx, m.hy, .3, 0);
        x -= dirX() * w / 2;
      });
    });
    layoutTray(snap);
  }
  function layoutTray(snap) {
    if (!tray) return;
    const list = money.filter(m => m.st === 'tray');
    const n = list.length; if (!n) return;
    const step = Math.min(S.u * 1.6, (tray.w - S.u * 3) / Math.max(1, n - 1));
    list.forEach((m, i) => {
      const x = tray.x + dirX() * (step * (n - 1) / 2 - i * step), y = tray.y - S.u * .05 + (i % 2) * 4;
      m.hx = x; m.hy = y; m.size = isCoin(m.v) ? S.u * .9 : S.u * .7;
      if (snap) { m.x = x; m.y = y; } else if (!m.drag && (!m.fly || m.fly.to === 'tray')) flyTo(m, x, y, .25, 20, m.fly && m.fly.to);
    });
  }
  function flyTo(m, x, y, d, arc = 60, to = null, onEnd = null) { m.fly = { x0: m.x, y0: m.y, x1: x, y1: y, t: 0, d, arc, to, onEnd }; }

  /* ---------- توليد الجولات ---------- */
  function denList(L) {
    const all = allDen();
    if (L.den === 'all' || !L.den) return all.filter(v => v <= 100);
    const out = L.den.filter(v => all.includes(v));
    return out.length ? out : all.slice(0, 3);
  }
  function itemFor(price, toy) {
    let pool = ITEMS.filter(it => price >= it.p[0] && price <= it.p[1] && (!toy || it.p[1] >= 30));
    if (!pool.length) pool = ITEMS.filter(it => price <= it.p[1]);
    return pick(pool.length ? pool : ITEMS);
  }
  let lastV = -1;
  function genRound(L, type) {
    const r = { type };
    if (type === 'find') {
      const den = denList(L); let v, g = 0; do { v = pick(den); } while (v === lastV && g++ < 20); lastV = v;
      const others = shuffle(allDen().filter(d => d !== v)).slice(0, 2);
      r.v = v; r.opts = shuffle([v, ...others]);
    } else if (type === 'count') {
      const den = denList(L), [lo, hi] = L.tot; let tot = ri(lo, hi), coins = [];
      let guard = 0;
      while (tot > 0 && guard++ < 99) { const ok = den.filter(d => d <= tot); const d = pick(ok.length > 1 && Math.random() < .55 ? ok.slice(0, -1) : ok); coins.push(d); tot -= d; }
      if (coins.length > 9) coins = decompose(coins.reduce((a, b) => a + b, 0), den);
      r.coins = shuffle(coins); r.N = coins.reduce((a, b) => a + b, 0);
      r.ch = makeChoices(r.N, 1, 100);
    } else if (type === 'pay') {
      const den = denList(L); const [lo, hi] = L.price; r.P = ri(lo, hi);
      const base = decompose(r.P, den) || [];
      // محفظة: طريقة صحيحة + نقود إضافية
      const extra = [];
      const smalls = den.filter(d => d <= Math.max(2, r.P / 2));
      for (let i = 0; i < 2; i++) extra.push(pick(smalls.length ? smalls : den));
      const big = den.filter(d => d > r.P / 2 && d <= r.P * 2); if (big.length && Math.random() < .7) extra.push(pick(big));
      r.wallet = shuffle(base.concat(extra)).slice(0, 10);
      if ((r.wallet.reduce((a, b) => a + b, 0)) < r.P || !subsetSum(r.wallet, r.P)) r.wallet = shuffle(base.concat(extra.slice(0, 1)));
      r.it = itemFor(r.P);
    } else if (type === 'change') {
      let notes = C().notes.filter(v => L.pay === 'big' ? v >= 10 && v <= 50 : (L.pay || []).includes(v));
      if (!notes.length) notes = [10];
      r.M = pick(notes); const [c0, c1] = L.chg; r.N = ri(c0, Math.min(c1, r.M - 1)); r.P = r.M - r.N;
      r.ch = makeChoices(r.N, 1, r.M - 1);
      r.it = itemFor(r.P);
    } else if (type === 'save') {
      if (qi === 0 || !saveGoal) {
        saveGoal = ri(L.goal[0], L.goal[1]); saveTot = 0; saveItem = itemFor(saveGoal, true);
        // تقسيم الهدف إلى خمس دفعات
        const k = []; let left = saveGoal;
        for (let i = 0; i < ROUNDS - 1; i++) { const rem = ROUNDS - 1 - i; const d = clamp(Math.round(left / (rem + 1) + ri(-1, 1)), 1, left - rem); k.push(d); left -= d; }
        k.push(left); R && (R.dep = k);
        r.deps = k;
      }
      r.deps = r.deps || (R && R.deps) || [saveGoal - saveTot];
      const d = qi < ROUNDS - 1 ? r.deps[qi] : saveGoal - saveTot;
      r.d = d; r.coins = shuffle(decompose(d, [1, 2, 5]) || [d]);
      r.N = saveGoal - saveTot - d; r.ch = r.N > 0 ? makeChoices(r.N, 1, saveGoal) : null;
      r.it = saveItem;
    }
    return r;
  }
  function subsetSum(arr, target) {
    const can = new Set([0]); for (const v of arr) for (const s of [...can]) if (s + v <= target) can.add(s + v);
    return can.has(target);
  }
  function makeChoices(ans, mn, mx) {
    const c = [ans], cand = shuffle([ans - 1, ans + 1, ans - 2, ans + 2]).concat([ans + 3, ans - 3, ans + 5]);
    for (const v of cand) { if (c.length >= 3) break; if (v >= mn && v <= mx && !c.includes(v)) c.push(v); }
    for (let v = mn; c.length < 3; v++) if (!c.includes(v)) c.push(v);
    return shuffle(c);
  }

  /* ---------- الجولات ---------- */
  function setBanner(bump = true) {
    const t = R.type;
    let h = '';
    if (t === 'find') h = isAr() ? `🔍 أين <span class="eq"><b>${dg(R.v)}</b></span> ${unitTxt(R.v)}؟` : `🔍 Where is <span class="eq"><b>${dg(R.v)}</b></span> ${unitTxt(R.v)}?`;
    else if (t === 'count') h = phase === 'ask' ? (isAr() ? '🐷 كم في الحصّالة؟' : '🐷 How much is inside?') : (isAr() ? `🐷 ${App.g('ضعي', 'ضع')} النقود في الحصّالة` : '🐷 Put the money in the piggy bank');
    else if (t === 'pay') h = (isAr() ? `🛒 ${App.g('ادفعي', 'ادفع')}` : '🛒 Pay') + ` <span class="eq"><b>${dg(R.P)}</b></span> <small>${unitTxt(R.P)}</small>`;
    else if (t === 'change') {
      const q = phase === 'ask' || phase === 'done' ? `<b>${dg(R.M)}</b><i>−</i><b>${dg(R.P)}</b><i>=</i><b class="q">${phase === 'done' ? dg(R.N) : '?'}</b>` : `<b>${dg(R.M)}</b>`;
      h = (phase === 'ask' || phase === 'done' ? (isAr() ? '🪙 الباقي' : '🪙 Change') : (isAr() ? `🛒 ${App.g('ادفعي', 'ادفع')}` : '🛒 Pay')) + ` <span class="eq">${q}</span>`;
    } else if (t === 'save') h = phase === 'ask' ? (isAr() ? '🎯 كم نحتاج بعد؟' : '🎯 How much more?') : (isAr() ? `🎯 ${App.g('ادّخري', 'ادّخر')} <span class="eq"><b>${dg(saveGoal)}</b></span> <small>${unitTxt(saveGoal)}</small>` : `🎯 Save <span class="eq"><b>${dg(saveGoal)}</b></span> <small>${unitTxt(saveGoal)}</small>`);
    ban.innerHTML = h; ban.style.direction = isAr() ? 'rtl' : 'ltr';
    ban.classList.remove('off');
    if (bump) { ban.classList.remove('bump'); void ban.offsetWidth; ban.classList.add('bump'); }
  }
  function sayPrompt() {
    if (!R || phase === 'over') return;
    spkBtn.classList.remove('talk'); void spkBtn.offsetWidth; spkBtn.classList.add('talk');
    const t = R.type;
    const put = () => say(App.g('ضعي النقود في الحصالة', 'ضع النقود في الحصالة'), 'Put the money in the piggy bank');
    if (t === 'find') say('أين ' + arAmt(R.v) + '؟', 'Where is ' + enAmt(R.v) + '?');
    else if (t === 'count') { if (phase === 'ask') say('كم في الحصالة؟', 'How much is in the piggy bank?'); else put(); }
    else if (t === 'pay') say(App.g('ادفعي', 'ادفع') + ' ' + arAmt(R.P), 'Pay ' + enAmt(R.P));
    else if (t === 'change') { if (phase === 'ask') say('كم الباقي؟', 'How much change?'); else say(App.g('ادفعي', 'ادفع') + ' ' + arAmt(R.M), 'Pay ' + enAmt(R.M)); }
    else if (t === 'save') { if (phase === 'ask') say('كم نحتاج بعد؟', 'How much more do we need?'); else put(); }
  }
  function renderProg() {
    progEl.style.direction = isAr() ? 'rtl' : 'ltr';
    progEl.innerHTML = Array.from({ length: ROUNDS }, (_, i) => `<i class="${i < qi ? 'on' : i === qi && phase !== 'over' ? 'cur' : ''}"></i>`).join('');
  }
  function showCards(list, img) {
    cardsEl.innerHTML = (list || []).map((v, i) => `<button class="cd" data-v="${v}" style="--c:${CARDC[i][0]};--d:${CARDC[i][1]}" aria-label="${v}">${img ? `<img alt="" src="${groupImg(v, 96, 44)}">` : ''}<b>${dg(v)}</b><small>${unitTxt(v)}</small></button>`).join('');
    cardsEl.querySelectorAll('.cd').forEach(b => b.onclick = () => pickCard(b));
    const g = G();
    if (g && list) g.fromTo(cardsEl.children, { y: 70, scale: .5, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: .5, ease: 'back.out(1.8)', stagger: .08, clearProps: 'transform' });
  }
  function showDone(on) { doneBtn.classList.toggle('off2', !on); doneBtn.textContent = isAr() ? App.g('ادفعي', 'ادفع') + ' ✓' : 'Pay ✓'; }

  function mkMoney(v, x, y) { return { v, x, y, hx: x, hy: y, size: S ? S.u : 30, st: 'wallet', fly: null, drag: false, rot: rand(-.12, .12), wob: 0, hl: 0, sc: 1, at: 0 }; }
  function startRound() {
    clearLater(); drag = null; fails = 0; parts = parts.filter(p => p.k === 'conf');
    const L = LV[lvl - 1], type = L.k[qi];
    if (type !== 'save') { saveGoal = 0; }
    R = genRound(L, type);
    if (type === 'save' && R.deps) R.deps = R.deps;
    item = null; pig.total = type === 'save' ? saveTot : 0; pig.wig = 0;
    showCards(null); showDone(false);
    phase = 'enter'; setBanner(); renderProg();
    let vals = [];
    if (type === 'find') vals = R.opts; else if (type === 'count' || type === 'save') vals = R.coins; else if (type === 'pay') vals = R.wallet; else if (type === 'change') vals = [R.M];
    money = vals.map(v => mkMoney(v, 0, 0));
    layout();
    // دخول النقود من أسفل الشاشة
    money.forEach((m, i) => { m.y = H + 80; m.x = m.hx + rand(-30, 30); flyTo(m, m.hx, m.hy, .5 + i * .05, 40); });
    if (item) { item.pop = 0; }
    bub = { v: pig.total, pop: 0 };
    Sound.whoosh();
    later(.9, () => { phase = 'play'; if (type === 'pay') showDone(true); sayPrompt(); });
  }
  function startLevel(n) {
    lvl = clamp(n, 1, NL); qi = 0; mistakes = 0; parts = []; saveGoal = 0; saveTot = 0;
    winOv.classList.remove('on'); lvOv.classList.remove('on');
    startRound();
  }
  function roundSolved(delay) {
    phase = 'solved'; showDone(false);
    qi++; renderProg();
    if (qi >= ROUNDS) { later(delay * .8, win); return; }
    later(delay, () => {
      const g = G(); if (g) g.to(cardsEl.children, { y: 60, autoAlpha: 0, duration: .25, stagger: .04 });
      money.forEach(m => { if (m.st !== 'gone') flyTo(m, m.x + rand(-40, 40), H + 120, .45, -30); });
      Sound.whoosh();
      later(.5, startRound);
    });
  }
  const starsFor = m => m === 0 ? 3 : m <= 2 ? 2 : 1;
  function win() {
    phase = 'over'; showDone(false); ban.classList.add('off'); renderProg();
    const pr = loadProg(), stars = starsFor(mistakes), prev = pr.stars[lvl] || 0;
    if (stars > prev) pr.stars[lvl] = stars;
    if (lvl >= pr.unlocked) pr.unlocked = Math.min(NL, lvl + 1);
    store.set('piggybankProg', pr);
    const curs = store.get('piggybankCurs', []); if (!curs.includes(cur)) { curs.push(cur); store.set('piggybankCurs', curs); }
    confetti(150); Sound.win(); vibrate(30); pig.wig = 1; pig.hop = 1;
    coinRain(24);
    later(1.2, () => {
      if (App.current !== ID) return;
      root.querySelector('.wT').textContent = App.g('أحسنتِ!', 'أحسنت!') + ' 🎉';
      root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
      root.querySelector('.wP').textContent = App.g('أنهيتِ', 'أنهيتَ') + ` المستوى ${dg(lvl)}` + (mistakes ? ` · الأخطاء: ${dg(mistakes)}` : ' دون أي خطأ! 💯');
      root.querySelector('[data-a="next"]').style.display = lvl < NL ? '' : 'none';
      winOv.classList.add('on');
      const g = G(); if (g) g.from(winOv.querySelector('.panel'), { scale: .6, rotation: -6, duration: .6, ease: 'elastic.out(1,.55)' });
      praise();
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('piggybank_first');
      if (!isAr()) App.achieve('piggybank_en');
      if (curs.length >= 2) App.achieve('piggybank_both');
      if (Array.from({ length: NL }, (_, i) => pr.stars[i + 1]).every(Boolean)) App.achieve('piggybank_all');
    });
  }
  function openLevels() {
    paintCurBtn();
    const pr = loadProg(), grid = root.querySelector('.lvg');
    grid.innerHTML = LV.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lvb${lock ? ' lock' : ''}${n === lvl ? ' cur' : ''}" data-l="${n}" aria-label="المستوى ${n}"><span class="n">${dg(n)}</span>
        <span class="e">${L.ic}</span>
        <span class="s">${lock ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    grid.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
      const n = +b.dataset.l;
      if (n > loadProg().unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-10deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
      Sound.tap(); startLevel(n);
    });
    winOv.classList.remove('on'); lvOv.classList.add('on');
  }
  function setCur(c) {
    if (c === cur || !CUR[c]) return;
    cur = c; store.set('piggybankCur', c); Sound.coin(); paintCurBtn();
    const g = G(); if (g) g.fromTo(curBtn, { rotationY: 180 }, { rotationY: 0, duration: .5, ease: 'back.out(2)' });
    say(C().name === 'جنيه سوداني' ? 'جنيه سوداني' : 'ريال سعودي', C().name === 'جنيه سوداني' ? 'Sudanese pound' : 'Saudi riyal');
  }

  /* ---------- منطق اللعب ---------- */
  function sendToTarget(m) {
    const t = R.type;
    if (t === 'count' || t === 'save') {
      m.st = 'fly'; m.wob = 0;
      const sx = pig.x - (isAr() ? -1 : 1) * pig.s * .01, sy = pig.y - pig.s * .4 - pig.s * .36 * .97;
      flyTo(m, sx, sy - 6, .5, 90, 'pig', () => dropped(m));
      Sound.whoosh(); vibrate(8);
    } else if (t === 'pay') {
      m.st = 'tray'; Sound.slide(); Sound.tone(900, .05, 'sine', .07, 300); vibrate(8);
      layoutTray(false); layoutMoney(false); bub.v = trayTotal(); bub.pop = 1;
      sayNum(trayTotal());
    } else if (t === 'change') {
      m.st = 'tray'; layoutTray(false); Sound.slide(); vibrate(8); bub.v = R.M;
      phase = 'wait';
      later(.6, () => { clink(); sayAmt(R.M); });
      later(1.6, () => { phase = 'ask'; setBanner(); showCards(R.ch, true); sayPrompt(); });
    }
  }
  const trayTotal = () => money.filter(m => m.st === 'tray').reduce((a, m) => a + m.v, 0);
  function clink() {
    Sound.tone(2100, .06, 'triangle', .09); Sound.tone(3150, .14, 'sine', .05, 0, .03); Sound.tone(1580, .1, 'triangle', .05, 0, .07);
  }
  function dropped(m) {
    m.st = 'gone'; pig.wig = 1; pig.sq = .6; pig.total += m.v; bub.v = pig.total; bub.pop = 1;
    if (isCoin(m.v)) clink(); else { Sound.noise(.12, 1500, 3000, .06, 2); Sound.tone(700, .08, 'sine', .06, 200); }
    sparkle(pig.x, pig.y - pig.s * .78, 6);
    sayNum(pig.total);
    if (R.type === 'save') saveTot = pig.total;
    if (!money.some(x => x.st === 'wallet' || x.st === 'fly')) {
      if (R.type === 'count') {
        phase = 'wait';
        later(1, () => { phase = 'ask'; setBanner(); showCards(R.ch, false); sayPrompt(); bub.hide = true; });
      } else if (R.type === 'save') {
        phase = 'wait';
        if (saveTot >= saveGoal) later(.9, goalReached);
        else later(1, () => { phase = 'ask'; setBanner(); showCards(R.ch, false); sayPrompt(); });
      }
    }
  }
  function goalReached() {
    phase = 'solved'; App.achieve('piggybank_saver');
    say('جمعنا ' + arAmt(saveGoal), 'We saved ' + enAmt(saveGoal));
    pig.wig = 1; pig.hop = 1; coinRain(16); confetti(70); Sound.win();
    if (item) item.pop = 1;
    later(1.8, praise);
    roundSolved(3);
  }
  function checkPay() {
    if (phase !== 'play' || R.type !== 'pay') return;
    const t = trayTotal();
    if (t === R.P) {
      phase = 'solved'; showDone(false);
      Sound.star(); vibrate(20); App.achieve('piggybank_shop');
      sayAmt(R.P);
      money.filter(m => m.st === 'tray').forEach((m, i) => later(.15 + i * .08, () => { m.st = 'fly'; flyTo(m, item.x, item.y - item.s * .2, .45, 70, 'gone', () => { m.st = 'gone'; clink(); }); }));
      later(.9, () => { item.pop = 1; sparkle(item.x, item.y, 16); confetti(50); praise(); Sound.coin(); });
      roundSolved(2.6);
    } else {
      mistakes++; fails++; Sound.error(); vibrate(25); shake = 5;
      ban.classList.remove('shake'); void ban.offsetWidth; ban.classList.add('shake');
      if (t > R.P) say('هذا كثير', "That's too much"); else say('هذا لا يكفي', 'Not enough');
      if (fails >= 2) later(1.4, payHint);
    }
  }
  function payHint() {
    if (phase !== 'play') return;
    // نعيد ما في الصحن ونضيء طريقة صحيحة
    money.forEach(m => { if (m.st === 'tray') m.st = 'wallet'; });
    layoutMoney(false); bub.v = 0;
    const pool = money.filter(m => m.st === 'wallet').sort((a, b) => b.v - a.v);
    let left = R.P; const chosen = [];
    // بحث بسيط عن مجموعة جزئية
    const rec = (i, l) => { if (l === 0) return true; if (i >= pool.length || l < 0) return false; chosen.push(pool[i]); if (rec(i + 1, l - pool[i].v)) return true; chosen.pop(); return rec(i + 1, l); };
    if (rec(0, left)) chosen.forEach((m, i) => later(i * .25, () => { m.hl = 2.5; m.wob = .6; Sound.tone(880 + i * 90, .08, 'sine', .07); }));
  }
  function pickCard(b) {
    if (phase !== 'ask' || b.classList.contains('no')) return;
    Sound.ac(true);
    const v = +b.dataset.v;
    if (v === R.N) {
      b.classList.add('ok'); cardsEl.querySelectorAll('.cd').forEach(x => { if (x !== b) x.style.opacity = '.35'; });
      Sound.star(); vibrate(20); phase = 'done'; setBanner(false);
      const r = b.getBoundingClientRect(); sparkle(r.left + r.width / 2, r.top + r.height / 2, 16);
      sayAmt(R.N);
      if (R.type === 'change') {
        // الباقي يطير من الصحن إلى المحفظة
        const parts2 = decompose(R.N, allDen()) || [R.N];
        const tr = money.find(m => m.st === 'tray');
        if (tr) { tr.st = 'fly'; flyTo(tr, item.x, item.y - item.s * .1, .45, 60, 'gone', () => { tr.st = 'gone'; clink(); }); }
        parts2.forEach((d, i) => later(.5 + i * .25, () => { const m = mkMoney(d, item.x, item.y); m.size = isCoin(d) ? S.u : S.u * .78; money.push(m); m.st = 'show'; const z = wallZone(); flyTo(m, S.cx + dirX() * ((i - (parts2.length - 1) / 2) * -S.u * 2.2), (z.y0 + z.y1) / 2, .5, 80, null, () => clink()); }));
        later(.9 + parts2.length * .25, () => { praise(); confetti(40); item.pop = 1; });
        roundSolved(2.6 + parts2.length * .2); return;
      }
      if (R.type === 'count') { pig.wig = 1; pig.hop = 1; }
      later(1.1, () => { praise(); confetti(50); Sound.coin(); });
      roundSolved(2.4);
    } else {
      mistakes++; fails++;
      b.classList.add('no'); Sound.error(); vibrate(20); shake = 4;
      tryAgain();
      if (fails >= 2) cardsEl.querySelectorAll('.cd').forEach(x => x.classList.toggle('hint', +x.dataset.v === R.N));
    }
  }
  function tapFind(m) {
    if (m.v === R.v) {
      phase = 'solved';
      m.st = 'fly'; m.hl = 1;
      flyTo(m, pig.x, pig.y - pig.s * .75, .6, 120, 'pig', () => { m.st = 'gone'; pig.wig = 1; pig.sq = .6; pig.hop = 1; clink(); sparkle(pig.x, pig.y - pig.s * .8, 14); });
      Sound.star(); vibrate(20); sayAmt(m.v);
      later(1.3, () => { praise(); confetti(40); });
      roundSolved(2.3);
    } else {
      mistakes++; fails++; m.wob = 1; Sound.error(); vibrate(20);
      sayAmt(m.v);
      if (fails >= 2) { const t = money.find(x => x.v === R.v); if (t) t.hl = 3; }
      later(1.4, () => { if (phase === 'play') sayPrompt(); });
    }
  }

  /* ---------- مؤثرات ---------- */
  function sparkle(x, y, n) {
    for (let i = 0; i < n; i++) { const a = Math.random() * TAU, s = rand(80, 230); parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 80, g: 420, life: .9, max: .9, r: rand(4, 7), c: pick(['#FFD84A', '#FFF3A0', '#FF9FC6', '#9FD8FF']), k: 'star', rot: rand(0, 6) }); }
  }
  function confetti(n) {
    const cols = ['#FF4FA3', '#FFB31A', '#36C26A', '#3D8BFF', '#9B5CF6', '#FF7A2E', '#1DB8C9'];
    for (let i = 0; i < n; i++) parts.push({ x: rand(0, W), y: rand(-60, -10), vx: rand(-50, 50), vy: rand(60, 220), g: 160, life: 2.6, max: 2.6, r: rand(4, 7), c: pick(cols), k: 'conf', rot: rand(0, 6), vr: rand(-8, 8) });
  }
  function coinRain(n) {
    for (let i = 0; i < n; i++) parts.push({ x: rand(0, W), y: rand(-200, -20), vx: rand(-30, 30), vy: rand(80, 260), g: 380, life: 2.4, max: 2.4, r: S ? S.u * .45 : 14, k: 'coin', v: pick(C().coins), rot: rand(0, 6), vr: rand(-6, 6) });
  }

  /* ---------- الرسم ---------- */
  function buildBg() {
    const cnv = document.createElement('canvas'); cnv.width = Math.max(1, Math.round(W * dpr)); cnv.height = Math.max(1, Math.round(H * dpr));
    const c = cnv.getContext('2d'); c.scale(dpr, dpr);
    const cy = S.counterY;
    let g = c.createLinearGradient(0, 0, 0, cy); g.addColorStop(0, '#C9EFE2'); g.addColorStop(.6, '#E6F8F1'); g.addColorStop(1, '#F4FCF8');
    c.fillStyle = g; c.fillRect(0, 0, W, cy);
    // ورق جدران منقّط
    c.fillStyle = 'rgba(255,255,255,.55)';
    for (let y = 18; y < cy; y += 34) for (let x = (y / 34 % 2) * 17 + 8; x < W; x += 34) { c.beginPath(); c.arc(x, y, 3.2, 0, TAU); c.fill(); }
    // المظلّة المخططة أعلى الدكّان
    const aw = S.topY - 8, stripe = clamp(W / 12, 34, 70);
    const ay = Math.min(aw * .55, 90);
    for (let x = 0, k = 0; x < W + stripe; x += stripe, k++) {
      c.fillStyle = k % 2 ? '#FFFFFF' : '#FF6FA8';
      c.beginPath(); c.moveTo(x, 0); c.lineTo(x + stripe, 0); c.lineTo(x + stripe, ay); c.arc(x + stripe / 2, ay, stripe / 2, 0, Math.PI); c.closePath(); c.fill();
    }
    g = c.createLinearGradient(0, 0, 0, ay + stripe / 2); g.addColorStop(0, 'rgba(0,0,0,.08)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.fillRect(0, 0, W, ay + stripe / 2);
    c.fillStyle = 'rgba(120,20,70,.12)'; c.fillRect(0, ay + stripe / 2, W, 4);
    // رفوف جانبية مع فواكه وألعاب للزينة
    const shelfY = [S.topY + S.sh * .3, S.topY + S.sh * .5];
    const deco = ['🍎', '🍌', '🧃', '🍊', '🧸', '🎈', '🍇', '🍦'];
    let di = 0;
    if (W - S.sw > 160) {
      [[8, S.sx - 10], [S.sx + S.sw + 10, W - 8]].forEach(([x0, x1]) => {
        if (x1 - x0 < 70) return;
        shelfY.forEach(sy => {
          if (sy > cy - 30) return;
          c.fillStyle = 'rgba(80,40,10,.15)'; c.fillRect(x0, sy + 10, x1 - x0, 6);
          const wg = c.createLinearGradient(0, sy, 0, sy + 12); wg.addColorStop(0, '#E2A060'); wg.addColorStop(1, '#B06A2C');
          c.fillStyle = wg; c.beginPath(); c.roundRect(x0, sy, x1 - x0, 12, 4); c.fill();
          const n = Math.floor((x1 - x0) / 56);
          for (let i = 0; i < n; i++) drawEmoji(c, deco[di++ % deco.length], x0 + (i + .5) * (x1 - x0) / n, sy - 20, 34);
        });
      });
    }
    // الطاولة (الكاونتر)
    g = c.createLinearGradient(0, cy, 0, H); g.addColorStop(0, '#F0B070'); g.addColorStop(.05, '#DB9450'); g.addColorStop(1, '#B46A2E');
    c.fillStyle = g; c.fillRect(0, cy, W, H - cy);
    c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(0, cy, W, 3);
    c.fillStyle = 'rgba(90,40,10,.18)'; c.fillRect(0, cy + 14, W, 5);
    c.strokeStyle = 'rgba(120,60,20,.13)'; c.lineWidth = 2;
    for (let y = cy + 34; y < H; y += 24) { c.beginPath(); for (let x = 0; x <= W; x += 30) c.lineTo(x, y + Math.sin(x * .02 + y) * 3); c.stroke(); }
    // لوح القماش الأخضر تحت النقود
    const z = wallZone();
    if (R.type !== 'find') {
      const mw = Math.min(S.sw, 620), mh = z.y1 - z.y0 + 8;
      c.fillStyle = 'rgba(60,30,10,.18)'; c.beginPath(); c.roundRect(S.cx - mw / 2 + 3, z.y0 - 2, mw, mh, 22); c.fill();
      g = c.createLinearGradient(0, z.y0, 0, z.y1); g.addColorStop(0, '#5FC79C'); g.addColorStop(1, '#3BA67C');
      c.fillStyle = g; c.beginPath(); c.roundRect(S.cx - mw / 2, z.y0 - 6, mw, mh, 22); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = 2; c.setLineDash([7, 6]);
      c.beginPath(); c.roundRect(S.cx - mw / 2 + 8, z.y0 + 2, mw - 16, mh - 16, 16); c.stroke(); c.setLineDash([]);
    }
    // رف تحت الحصالة
    if (pig.show && pig.y < cy - 10) {
      const sw2 = pig.s * 1.35, sy = pig.y;
      c.fillStyle = 'rgba(80,40,10,.15)'; c.fillRect(pig.x - sw2 / 2 + 4, sy + 8, sw2, 8);
      const wg = c.createLinearGradient(0, sy, 0, sy + 14); wg.addColorStop(0, '#E8A868'); wg.addColorStop(1, '#B06A2C');
      c.fillStyle = wg; c.beginPath(); c.roundRect(pig.x - sw2 / 2, sy, sw2, 14, 5); c.fill();
      c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(pig.x - sw2 / 2 + 4, sy + 2, sw2 - 8, 2);
    }
    return cnv;
  }
  function drawTray(c) {
    if (!tray) return;
    const { x, y, w, h } = tray;
    c.fillStyle = 'rgba(30,70,55,.18)'; c.beginPath(); c.ellipse(x, y + h * .42, w * .5, h * .26, 0, 0, TAU); c.fill();
    let g = c.createLinearGradient(0, y - h * .4, 0, y + h * .4); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#DCEFF0');
    c.fillStyle = g; c.beginPath(); c.ellipse(x, y, w * .5, h * .42, 0, 0, TAU); c.fill();
    c.strokeStyle = '#9FD3C6'; c.lineWidth = 4; c.stroke();
    g = c.createLinearGradient(0, y - h * .3, 0, y + h * .3); g.addColorStop(0, '#E2F3F1'); g.addColorStop(1, '#F7FCFB');
    c.fillStyle = g; c.beginPath(); c.ellipse(x, y + 2, w * .44, h * .32, 0, 0, TAU); c.fill();
    if (!money.some(m => m.st === 'tray')) {
      c.font = `800 ${clamp(h * .22, 13, 20)}px ${FONT}`; c.fillStyle = 'rgba(40,120,100,.45)'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(isAr() ? (R.type === 'change' ? '⬇ ' + App.g('ادفعي', 'ادفع') + ' هنا' : '⬇ ' + App.g('ضعي', 'ضع') + ' النقود هنا') : '⬇ Put money here', x, y + 2);
    }
  }
  function priceTag(c, x, y, v, s) {
    const t = dg(v), sub = abbr();
    c.save(); c.translate(x, y); c.rotate(dirX() * -.08);
    const w = s * (t.length > 1 ? 1.25 : 1.05), h = s * .95;
    c.strokeStyle = '#B0886A'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, -h * .5); c.lineTo(-dirX() * s * .35, -h * .95); c.stroke();
    c.fillStyle = '#E0457F'; c.beginPath(); c.roundRect(-w / 2, -h / 2 + 4, w, h, s * .2); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.roundRect(-w / 2, -h / 2, w, h, s * .2); c.fill();
    c.strokeStyle = '#FF9CC6'; c.lineWidth = 3; c.stroke();
    c.fillStyle = '#FFD0E3'; c.beginPath(); c.arc(0, -h * .36, s * .05, 0, TAU); c.fill();
    c.font = `900 ${s * .52}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#C2185B'; c.fillText(t, 0, -h * .02);
    c.font = `800 ${s * .2}px ${FONT}`; c.fillStyle = '#E0457F'; c.fillText(sub, 0, h * .3);
    c.restore();
  }
  function drawItem(c) {
    if (!item || !R.it) return;
    const k = item.pop ? 1 + Math.sin(Math.min(1, item.pop) * Math.PI) * .3 : 1;
    const bob = Math.sin(T * 2) * 3;
    // منصة صغيرة
    c.fillStyle = 'rgba(30,70,55,.18)'; c.beginPath(); c.ellipse(item.x, item.y + item.s * .5, item.s * .55, item.s * .1, 0, 0, TAU); c.fill();
    drawEmoji(c, R.it.e, item.x, item.y + bob, item.s, Math.sin(T * 1.5) * .04, k);
    const v = R.type === 'save' ? saveGoal : R.P;
    priceTag(c, item.x - dirX() * item.s * .95, item.y - item.s * .05, v, clamp(item.s * .6, 40, 64));
    if (R.type === 'save') {
      // عدّاد الادخار
      const mw = Math.min(S.sw * .7, 340), mx = S.cx, my = S.topY + 16, mh = 20;
      const f = clamp(saveTot / saveGoal, 0, 1);
      c.fillStyle = 'rgba(30,70,55,.15)'; c.beginPath(); c.roundRect(mx - mw / 2, my - mh / 2 + 3, mw, mh, 9); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.roundRect(mx - mw / 2, my - mh / 2, mw, mh, 9); c.fill();
      if (f > 0) {
        const g = c.createLinearGradient(0, my - mh / 2, 0, my + mh / 2); g.addColorStop(0, '#FF9CC6'); g.addColorStop(1, '#F0479A');
        c.fillStyle = g; c.beginPath();
        if (isAr()) c.roundRect(mx + mw / 2 - 3 - (mw - 6) * f, my - mh / 2 + 3, (mw - 6) * f, mh - 6, 6); else c.roundRect(mx - mw / 2 + 3, my - mh / 2 + 3, (mw - 6) * f, mh - 6, 6);
        c.fill();
      }
      c.font = `900 15px ${FONT}`; c.fillStyle = '#7A1F4E'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(isAr() ? `${dg(saveTot)} / ${dg(saveGoal)}` : `${saveTot} / ${saveGoal}`, mx, my + 1);
    }
  }
  function drawBubble(c, x, y, r, v, q) {
    const k = 1 + Math.sin(Math.min(1, bub.pop) * Math.PI) * .22;
    c.save(); c.translate(x, y); c.scale(k, k);
    c.fillStyle = '#F26DB0'; c.beginPath(); c.arc(0, 4, r, 0, TAU); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill();
    c.strokeStyle = '#FFC7DE'; c.lineWidth = 4; c.beginPath(); c.arc(0, 0, r - 2, 0, TAU); c.stroke();
    const t = q ? (isAr() ? '؟' : '?') : dg(v);
    c.font = `900 ${r * (t.length > 1 ? .95 : 1.15)}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillStyle = '#C2185B'; c.fillText(t, 0, r * .1);
    c.restore();
  }
  function drawMoney(c) {
    const list = money.filter(m => m.st !== 'gone').sort((a, b) => (a.drag ? 1 : 0) - (b.drag ? 1 : 0) || (a.fly ? 1 : 0) - (b.fly ? 1 : 0));
    list.forEach(m => {
      const wob = m.wob > 0 ? Math.sin(m.wob * 30) * .25 * m.wob : 0;
      let sx = 1, sy = 1, sc = m.drag ? 1.12 : 1;
      if (m.fly && m.fly.to === 'pig') { const k = clamp(m.fly.t / m.fly.d, 0, 1); sc *= 1 - k * .35; if (isCoin(m.v)) sx = 1 - Math.max(0, k - .6) * 2; }
      if (m.hl > 0) { const a = Math.min(1, m.hl) * (.5 + Math.sin(T * 8) * .3); c.fillStyle = `rgba(255,220,60,${a})`; c.beginPath(); c.ellipse(m.x, m.y, m.size * (isCoin(m.v) ? 1.35 : 2), m.size * (isCoin(m.v) ? 1.35 : 1.15), 0, 0, TAU); c.fill(); }
      drawMoneyAt(c, m.v, m.x, m.y, m.size, m.rot + wob, sx * sc, sy * sc);
    });
  }
  function drawParts(c) {
    for (const q of parts) {
      const a = clamp(q.life / q.max, 0, 1);
      c.globalAlpha = q.k === 'conf' || q.k === 'coin' ? Math.min(1, a * 2) : a;
      if (q.k === 'star') { c.fillStyle = q.c; starPath(c, q.x, q.y, q.r, q.rot); c.fill(); }
      else if (q.k === 'conf') { c.save(); c.translate(q.x, q.y); c.rotate(q.rot); c.fillStyle = q.c; c.fillRect(-q.r, -q.r * .45, q.r * 2, q.r * .9); c.restore(); }
      else if (q.k === 'coin') drawMoneyAt(c, q.v, q.x, q.y, q.r, 0, Math.cos(q.rot), 1);
    }
    c.globalAlpha = 1;
  }
  function render() {
    if (!ctx || !S || !R) return;
    const c = ctx;
    if (!bg) bg = buildBg();
    c.save();
    if (shake > .2) c.translate(rand(-shake, shake), rand(-shake, shake) * .5);
    c.drawImage(bg, 0, 0, W, H);
    drawItem(c);
    drawTray(c);
    if (pig.show) {
      const hop = pig.hop > 0 ? Math.sin(pig.hop * Math.PI) * pig.s * .12 : 0;
      drawPiggy(c, pig.x, pig.y - hop, pig.s, pig.wig, pig.sq, pig.blink, phase === 'over' || pig.hop > 0);
      if (R.type !== 'find') drawBubble(c, pig.x + dirX() * -pig.s * .62, pig.y - pig.s * .85, clamp(pig.s * .19, 22, 38), pig.total, phase === 'ask');
    }
    if (tray && R.type === 'pay') { const br = clamp(S.u * .8, 22, 34); drawBubble(c, clamp(tray.x - dirX() * (tray.w * .5 - br * .3), br + 6, W - br - 6), tray.y - tray.h * .62, br, trayTotal(), false); }
    drawMoney(c);
    drawParts(c);
    c.restore();
  }

  /* ---------- التحديث ---------- */
  function update(dt) {
    T += dt;
    if (timers.length) {
      const due = timers.filter(t => t.at <= T);
      if (due.length) { timers = timers.filter(t => t.at > T); due.forEach(t => t.fn()); }
    }
    for (const m of money) {
      if (m.fly && !m.drag) {
        const f = m.fly; f.t += dt;
        const k = clamp(f.t / f.d, 0, 1), e = ease.io(k);
        m.x = f.x0 + (f.x1 - f.x0) * e; m.y = f.y0 + (f.y1 - f.y0) * e - Math.sin(k * Math.PI) * f.arc;
        if (k >= 1) { m.fly = null; if (f.onEnd) f.onEnd(); }
      }
      m.wob = Math.max(0, m.wob - dt * 1.8); m.hl = Math.max(0, m.hl - dt * .5);
    }
    pig.wig = Math.max(0, pig.wig - dt * 1.3); pig.sq = Math.max(0, pig.sq - dt * 2.5); pig.hop = Math.max(0, pig.hop - dt * 1.6);
    pig.blink = Math.max(0, pig.blink - dt); if (T > pig.blinkAt) { pig.blink = .14; pig.blinkAt = T + rand(2, 5); }
    if (phase === 'over' && pig.hop <= 0 && Math.random() < dt * .8) { pig.hop = 1; pig.wig = .6; }
    if (item && item.pop) { item.pop += dt * 2; if (item.pop > 1) item.pop = 0; }
    bub.pop = bub.pop > 0 ? bub.pop + dt * 3 : 0; if (bub.pop > 1) bub.pop = 0;
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.life -= dt;
      if (q.life <= 0) { parts.splice(i, 1); continue; }
      q.vy += q.g * dt; q.x += q.vx * dt; q.y += q.vy * dt;
      if (q.rot != null) q.rot += (q.vr || 2) * dt;
    }
    shake *= Math.pow(.003, dt);
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

  /* ---------- الإدخال ---------- */
  const pos = e => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  function hitMoney(x, y) {
    const list = money.filter(m => m.st === 'wallet' || m.st === 'tray').slice().reverse();
    for (const m of list) {
      const coin = isCoin(m.v), hw = coin ? m.size * 1.05 : m.size * 1.7, hh = coin ? m.size * 1.05 : m.size * .9;
      if (Math.abs(x - m.x) < hw && Math.abs(y - m.y) < hh) return m;
    }
    return null;
  }
  function overTarget(m) {
    if (R.type === 'pay' || R.type === 'change') return tray && Math.abs(m.x - tray.x) < tray.w * .55 && Math.abs(m.y - tray.y) < tray.h * .9;
    if (R.type === 'count' || R.type === 'save') return Math.hypot(m.x - pig.x, m.y - (pig.y - pig.s * .45)) < pig.s * .65;
    return false;
  }
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused || !R) return;
    Sound.ac(true);
    const { x, y } = pos(e);
    // لمس السلعة يقول اسمها، ولمس الحصالة يجعلها تهتز
    if (item && R.it && Math.hypot(x - item.x, y - item.y) < item.s * .6) { item.pop = .01; say(R.it.ar, R.it.en); Sound.pop(); return; }
    if (pig.show && Math.hypot(x - pig.x, y - (pig.y - pig.s * .4)) < pig.s * .5 && !hitMoney(x, y)) { pig.wig = .8; Sound.tone(500, .1, 'sine', .08, 200); if (phase !== 'ask' && R.type !== 'find' && pig.total) sayAmt(pig.total); return; }
    if (phase !== 'play') return;
    const m = hitMoney(x, y); if (!m) return;
    if (R.type === 'find') { tapFind(m); return; }
    drag = { m, id: e.pointerId, sx: x, sy: y, ox: x - m.x, oy: y - m.y, moved: false };
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
  });
  cv.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const { x, y } = pos(e), m = drag.m;
    if (!drag.moved && Math.hypot(x - drag.sx, y - drag.sy) > 9) { drag.moved = true; m.drag = true; m.fly = null; Sound.tone(800, .04, 'sine', .06, 200); }
    if (drag.moved) { m.x = x - drag.ox; m.y = y - drag.oy; }
  });
  function endDrag(e) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    const d = drag, m = d.m; drag = null; m.drag = false;
    if (phase !== 'play') { flyTo(m, m.hx, m.hy, .3, 10); return; }
    if (!d.moved) {
      if (m.st === 'tray' && R.type === 'pay') { m.st = 'wallet'; layoutMoney(false); Sound.tone(600, .06, 'sine', .07, -200); bub.v = trayTotal(); bub.pop = 1; return; }
      if (m.st === 'wallet') sendToTarget(m);
      return;
    }
    if (m.st === 'wallet' && overTarget(m)) { sendToTarget(m); return; }
    if (m.st === 'tray' && !overTarget(m) && R.type === 'pay') { m.st = 'wallet'; layoutMoney(false); bub.v = trayTotal(); return; }
    flyTo(m, m.hx, m.hy, .3, 10); Sound.tone(500, .05, 'sine', .05);
  }
  cv.addEventListener('pointerup', endDrag);
  cv.addEventListener('pointercancel', endDrag);

  doneBtn.onclick = () => { Sound.ac(true); checkPay(); };
  spkBtn.onclick = () => { Sound.ac(true); if (R && phase !== 'over') sayPrompt(); };
  ban.onclick = () => { if (R && phase !== 'over') sayPrompt(); };
  curBtn.onclick = () => { Sound.ac(true); setCur(cur === 'sdg' ? 'sar' : 'sdg'); if (R) startLevel(lvl); };
  root.querySelectorAll('.curs button').forEach(b => b.onclick = () => { setCur(b.dataset.c); openLevels(); });
  root.querySelectorAll('.lang button').forEach(b => b.onclick = () => {
    const l = b.dataset.l; if (l === lang) return;
    lang = l; store.set('piggybankLang', l); Sound.tap(); paintLang(); paintCurBtn();
    if (!R) return;
    placeScene(false); bg = null; setBanner(); renderProg(); showDone(!doneBtn.classList.contains('off2'));
    cardsEl.querySelectorAll('.cd').forEach(c => { c.querySelector('b').textContent = dg(+c.dataset.v); c.querySelector('small').textContent = unitTxt(+c.dataset.v); const im = c.querySelector('img'); if (im) im.src = groupImg(+c.dataset.v, 96, 44); });
    if (phase === 'play' || phase === 'ask') sayPrompt();
  });
  function paintLang() { root.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === lang)); }
  root.querySelector('.lvbtn').onclick = () => { Sound.tap(); openLevels(); };
  root.addEventListener('click', e => {
    const b = e.target.closest('[data-a]'); if (!b) return;
    const a = b.dataset.a; Sound.tap();
    if (a === 'close') { lvOv.classList.remove('on'); if (phase === 'over') winOv.classList.add('on'); }
    else if (a === 'next') startLevel(lvl + 1);
    else if (a === 'again') startLevel(lvl);
    else if (a === 'levels') openLevels();
  });
  window.addEventListener('keydown', e => {
    if (App.current !== ID || paused || lvOv.classList.contains('on') || winOv.classList.contains('on') || !R) return;
    if (e.key === 'Enter') { if (R.type === 'pay') checkPay(); else sayPrompt(); e.preventDefault(); }
    else if (e.key === ' ') { sayPrompt(); e.preventDefault(); }
    else if (/^[1-9]$/.test(e.key)) {
      const k = +e.key - 1;
      if (phase === 'ask') { const b = cardsEl.children[k]; if (b) pickCard(b); }
      else if (phase === 'play') { const m = money.filter(x => x.st === 'wallet')[k]; if (m) { if (R.type === 'find') tapFind(m); else sendToTarget(m); } }
    }
  });
  let resizeT = 0;
  window.addEventListener('resize', () => {
    if (App.current !== ID) return;
    clearTimeout(resizeT); resizeT = setTimeout(() => { layout(); render(); }, 60);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    let g = c.createRadialGradient(s * .5, s * .3, s * .05, s * .5, s * .5, s * .8);
    g.addColorStop(0, '#E9FFF6'); g.addColorStop(.6, '#9FE3C8'); g.addColorStop(1, '#3FB98E');
    c.fillStyle = g; c.fillRect(0, 0, s, s);
    const sv = { lang, cur }; lang = 'ar'; cur = store.get('piggybankCur', 'sdg') === 'sar' ? 'sar' : 'sdg';
    try {
      drawMoneyAt(c, C().notes[1], s * .3, s * .3, s * .12, -.3);
      drawPiggy(c, s * .52, s * .9, s * .78, 0, 0, 0, true);
      drawMoneyAt(c, 1, s * .54, s * .2, s * .13, 0, .9, 1);
    } finally { lang = sv.lang; cur = sv.cur; }
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'حصّالتي', icon2: '🐷', isNew: true, music: 'candy',
    desc: () => App.g('تعلّمي النقود واشتري من الدكّان', 'تعلّم النقود واشترِ من الدكّان'),
    help: () => [
      '🪙 ' + App.g('اختاري', 'اختر') + ' العملة من الزر الدائري: جنيه سوداني أو ريال سعودي (نقود لعب)',
      '🐷 ' + App.g('اسحبي', 'اسحب') + ' النقود أو ' + App.g('المسيها', 'المسها') + ' فتقفز إلى الحصّالة، ثم ' + App.g('قولي', 'قل') + ' كم فيها',
      '🛒 في الدكّان ' + App.g('ضعي', 'ضع') + ' في الصحن ثمن السلعة بالضبط ثم ' + App.g('اضغطي', 'اضغط') + ' «ادفع ✓»',
      '🪙 في «الباقي» ' + App.g('اختاري', 'اختر') + ' كم يعيد لك البائع، وفي «الادّخار» ' + App.g('اجمعي', 'اجمع') + ' ثمن اللعبة',
      '🔤 زر «عربي / English» يغيّر الأرقام والنطق، و🔊 يعيد السؤال'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 المستوى ${Math.max(...ks)} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    enter() {
      paused = false;
      lang = store.get('piggybankLang', 'ar') === 'en' ? 'en' : 'ar'; paintLang();
      cur = store.get('piggybankCur', 'sdg') === 'sar' ? 'sar' : 'sdg'; paintCurBtn();
      startLevel(Math.min(loadProg().unlocked, NL));
      render(); startLoop();
    },
    leave() { stopLoop(); clearLater(); drag = null; winOv.classList.remove('on'); lvOv.classList.remove('on'); },
    pause() { paused = true; if (drag) { drag.m.drag = false; flyTo(drag.m, drag.m.hx, drag.m.hy, .2, 0); drag = null; } },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { lvOv.classList.remove('on'); if (phase === 'over') winOv.classList.add('on'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _state() {
      return { lvl, qi, phase, mistakes, lang, cur, type: R && R.type, v: R && R.v, N: R && R.N, P: R && R.P, M: R && R.M, saveTot, saveGoal, pig: { x: pig.x, y: pig.y, s: pig.s, total: pig.total },
        tray, money: money.map(m => ({ v: m.v, x: m.x, y: m.y, st: m.st })) };
    },
    _go(l, q) { lvl = l; qi = q || 0; mistakes = 0; winOv.classList.remove('on'); lvOv.classList.remove('on'); startRound(); }
  });
})();
