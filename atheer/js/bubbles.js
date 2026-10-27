/* =====================================================================
   مدفع الفقاعات — صوّب الفقاعات، اجمع 3 من نفس اللون، وحرّر الحيوانات
   شبكة سداسية، خط تصويب يرتدّ عن الجدران، سقف ينزل، 40 مرحلة + وضع بلا نهاية.
   ===================================================================== */
(() => {
  'use strict';
  const ID = 'bubbles';
  const TAU = Math.PI * 2;
  const COLS = 11, MAXR = 18;
  const FONT = "'Baloo Bhaijaan 2',system-ui,sans-serif";
  const LET = 'RYGBPK';

  /* ---------- الألوان (لكل لون رمز أبيض صغير لمن يصعب عليه تمييز الألوان) ---------- */
  const COL = [
    { b: '#FF5A6E', l: '#FFC9D0', d: '#C21F3C' },  // أحمر ♥
    { b: '#FFC52E', l: '#FFF4BC', d: '#D48A00' },  // أصفر ★
    { b: '#4FCF62', l: '#D4F8CC', d: '#1F8F43' },  // أخضر ▲
    { b: '#3E9DFF', l: '#CBE6FF', d: '#1A5CC4' },  // أزرق 💧
    { b: '#A06BFF', l: '#E6D6FF', d: '#6331C9' },  // بنفسجي ◆
    { b: '#FF74C2', l: '#FFD9EE', d: '#CC3289' }   // وردي ✿
  ];
  const ANIMALS = ['كتكوت', 'أرنب', 'قطة', 'باندا', 'ضفدع', 'خنزير صغير'];

  /* ---------- المراحل: صفوف زوجية 11 خانة، فردية 10 (مزاحة نصف فقاعة) ---------- */
  const LEVELS = [
    { ic: '🫧', rows: ['RRRYYYYYBBB', 'RRRYYyYBBB', 'BBBRRRRRYYY', 'BBbRRRRYYy', '..YYY.BBB..'] },
    { ic: '🐣', rows: ['YYYBBBBBYYY', 'RRYYBBBYYR', '.BRRRYRRRB.', '.BBYYYYBB.', '..RRyYYRR..', '..BBBBBB..', '....YbY....'] },
    { ic: '💧', rows: ['RRYYBBRRYYB', 'RYYBBRRYYB', 'YYBBRRYYBBR', 'YBBRRYYbBR', 'BBRRyYBBRRY', '.BRRYYBBR.'] },
    { ic: '❤️', rows: ['YYBBGGGBBYY', '.RRRGGRRR.', 'RRYRRRRRYRR', '.RRYYrYRR.', '..RRYYYRR..', '...RRBRR..', '....RRR....', '....rR....', '.....B.....'] },
    { ic: '⭐', rows: ['BBBGGYGGBBB', 'BBGGYYGGBB', '.RRGYyYGRR.', '.RRBYYBRR.', '..RRbBBRR..', '...GGGGG..', '....GgG....'] },
    { ic: '🐸', rows: ['GGGRRRRRGGG', 'GGBBBBBBGG', 'YYBBYyYBBYY', 'YRRYYYYRRY', '.RRGGgGGRR.', '..BBBBBBB.', '...YYYYY...'] },
    { ic: '🌙', rows: ['GGRRGGRRGGR', 'YYYBBBBBBB', 'YYYYGBBBBRR', '.YYyGGBBRR', '..YYYGGRRR.', '...YYGrRR.', '....YYGG...', '.....YY...'] },
    { ic: '🌸', rows: ['YYGGYYGGYYG', '.PP.GG.PP.', 'PPYPPGPPYPP', '.PPPGGPPP.', '..BBGGGBB..', '.BBbRRBBB.', '..RRRrRRR..', '...RRRRR..'] },
    { ic: '🐠', rows: ['BBPPBBBPPBB', 'BB.YYYY.BB', 'B.YYYYYY.B.', '..YYyYYPP.', '.RYYYYYPPP.', '..YYYYYPP.', '...YYRYY...'] },
    { ic: '🌈', rows: ['RRRRRRRRRRR', 'RYYYYYYYYR', 'RYGGGGGGGYR', 'RYGBBBBGYR', 'RYGBPpPBGYR', 'RYGB..BGyR', 'RYG.....GYR', 'rY......YR'] },
    { ic: '🐼', rows: ['BBPPPPPPPBB', 'BbPPPPPPbB', '.PPYYPYYPP.', '.PYyPPyYP.', '.PPPPRPPPP.', '..PPRRPP..', '...GPPPG...', '....GG....'] },
    { ic: '🍄', rows: ['GGBBGGGBBGG', 'RRRRRRRRRR', 'RRYYRRRYYRR', 'RYYRRRYYRR', '.RRRRRYYR..', '...BPPPB..', '...BPpPB...', '...BBBB...'] },
    { ic: '👑', rows: ['PPYYPPPYYPP', 'YRYYBYYGYY', 'YYYYKYYYYYY', 'YK.YYYY.KY', 'Y...PPP...Y', '....PyP...', '.....K.....'] },
    { ic: '🦋', rows: ['KKKKGGGKKKK', 'KPPKGGKPPK', 'KPPPKGKPPPK', '.KPPKGKPK.', '..KKBGBKK..', '.BBBGGBBB.', '.BYYBGBYYB.', '..BBb.BBB.'] },
    { ic: '🍭', rows: ['RRYYGGBBPPK', 'KRRYYGGBBP', 'PKKRRYYGGBB', 'PPKKrRYYGG', 'BBPPKKRRYYG', '.BPPKKRRY.', '..BBPPkKR..'] },
    { ic: '🐙', rows: ['GGGPPPPPGGG', 'GGPPPPPPGG', '.PPpPPPpPP.', '.PPPPPPPP.', '.P.P.P.P.P.', '.K.K.K.K.K', '..Y.R.B.Y..'] },
    { ic: '🌻', rows: ['GGKKGGGKKGG', 'GYYYGGYYYG', 'YYBBBbBBBYY', 'YBBRRRRBBY', 'YBBRPpPRBBY', 'YYBBRRBBYY', '.YYKKKKKYY.'] },
    { ic: '🎂', rows: ['KKPPKKKPPKK', 'PPPPPPPPPP', 'YYYYyYYYYYY', 'BBBBBBBBBB', 'GGGGGgGGGGG', 'RRRRRRRRRR', '.K.Y.R.B.P.'] },
    { ic: '🐳', rows: ['BBRRGGYYPPK', 'KBBRRGGYYP', 'PKKBBRRGGYY', 'PPKKbBRRGG', 'YYPPKKBBRRG', 'YYyPKKBBRR', 'GGYYPPkKBBR', 'GGYYPPKKBB'] },
    { ic: '🏆', rows: ['KKRRYYGGBBP', 'PKRRYGGBBP', 'PPKKRYGBBPP', 'BPKrRYGbPB', 'BBPKRYyGPBB', 'GBPKRYGPBG', 'GGBPKkRPBGG', '.GBPKRPBG.', '..GBPkPBG..'] },
    /* ---- المراحل 21–40 (أُضيفت لاحقًا؛ تبقى أرقام المراحل القديمة كما هي) ---- */
    { ic: '🏰', rows: ['PPYPPYPPYPP', 'PBBBBBBBBP', '.BBYBBBYBB.', '.BBBBrBBBB', '.BBYKKKYBB.', '.BBBKKKBBB', '.RRBKkKBRR.', '.RRBBBBRR.', '..GGGGGGG..'] },
    { ic: '🚀', rows: ['GGKKRRRKKGG', 'KKKRRRRKKK', 'KKKRYYYRKKK', 'KKKRYyRKKK', 'KKKRYYYRKKK', 'KKRRRRRRKK', 'KRR.RRR.RRK', '..YYYYYY..', '...PPpPP...', '....PP....'] },
    { ic: '🐟', rows: ['BBBBBBBBBBB', 'BBYYYYBBBY', 'BYYYYYYBBYY', 'YKYYRYYYYY', 'YYYYyYRYYYB', '.YYYYYYYYY', '.BYYRYYBYY.', '..BYYYBBY.', '...PPPP.GG.'] },
    { ic: '🌷', rows: ['GGGGGGGGGGG', 'RRGPPGYYGR', 'RRRGPPGYYGR', 'RrRGPpGYyG', '.RRGGPPGYG.', '..GGGGGGG.', '..BBGBBGBB.', '.BBBBBBBBB', '..BGBGBGB..'] },
    { ic: '🔺', rows: ['GGBBGGGBBGG', 'BBYYYYYYBB', '.YYKKKKKYY.', '.YYKKKKYY.', '..YYKKKYY..', '..YYKkYY..', '...YYKYY...', '...YYYY...', '....YyY....', '....RR....'] },
    { ic: '😊', rows: ['GGBYYYYYBGG', 'BBYYYYYYBB', 'BYYKYYYKYYB', 'BYKkYYKkYB', 'BYYYYYYYYYB', 'BYRYYYYRYB', '.BYRRRRRYB.', '.BYYYYYYB.', '..BBYYYBB..'] },
    { ic: '☂️', rows: ['GGGGGGGGGGG', 'GGPRPRPRGG', 'GPRPRPRPRPG', 'PRPRPRPRPR', 'RPRPRpRPRPR', '....KK....', '.....K.....', '....KK....', '...KK......', '...k......'] },
    { ic: '🚗', rows: ['GGBBBBBBBGG', 'BBBBBBBBBB', 'BBBRRRRRBBB', 'BBRBBRBBRB', '.RRRRRRRRR.', 'RRRYRRRRYR', 'RRRRRRRRRRR', '.KKyRRRKkK', '..KK...KK..'] },
    { ic: '🌳', rows: ['BBBBGGGBBYY', 'BBBGGGGBBB', 'BBGGRGGGGBB', 'BGGGGGRGGB', 'BGGRGGGGGRB', '.GGGGgGGGG', '..GGGGRGG..', '....KK....', '....KKK....', '...KKKK...'] },
    { ic: '🦉', rows: ['GGGGGGGGGGG', 'GKKGGGGKKG', 'GKKKKKKKKKG', 'KYYKKKYYKK', 'KYBYKKKYBYK', 'KYYKRRKYYK', 'KKKKKRKKKKK', '.KPPpPPPK.', '.KPKPPPKPK.', '..KKKKKKK.'] },
    { ic: '🐱', rows: ['BBBBBBBBBBB', 'PBBBBBBBBP', 'PPBBBBBBBPP', 'PPPPPPPPPP', 'PPGGPPPGGPP', 'PGkPPPGkPP', 'PPPPPRPPPPP', 'KKPRRRPKKK', '.PPPPPPPPP.', '..PPPPPP..'] },
    { ic: '🏠', rows: ['BBBBBBBBBBB', 'BBBBRRBBBB', 'BBBRRRRRBBB', 'BBRRRRRRBB', 'BRRRRRRRRRB', '.YYYYYYYYY', '.YBBYYYBBY.', '.YBBYKYBBY', '.YYYYKKYYY.', '.GGGGgGGGG', 'GGGGGGGGGGG'] },
    { ic: '🌉', rows: ['BBBBBBBBBBB', 'PBBPBBPBBP', 'RRRRRRRRRRR', 'RYRYRYRYRY', 'RYRYRyRYRYR', 'R.R.RR.R.R', 'R.R.....R.R', 'RBB.....BB', 'RBBb...bBBR', 'GBGB..BGBG'] },
    { ic: '🍉', rows: ['BBBBBBBBBBB', 'GGGGGGGGGG', 'GGGGGGGGGGG', 'YYYYYYYYYY', '.RRKRRRKRR.', '.RRRRKRRRR', '..RKRrRKR..', '..RRRRRR..', '...RRKRR...', '....RR....'] },
    { ic: '🍦', rows: ['BBBBRRRBBBB', 'BBBPPPPBBB', 'BBPPPpPPBBB', 'BPPPPPPPPB', '.YYYYYYYYY.', '.YYYYyYYYY', '..YYYYYYY..', '..YKYKYKY.', '...YKYKY...', '...YYYY...', '....YY.....'] },
    { ic: '🐉', rows: ['KKKKKKKKKKK', 'KGGGKKGGGK', 'GGRGGGGGRGG', 'GGRRGGRRGG', 'GGYYGgGYYGG', '.GGGGGGGGG', '.GPGPGPGPG.', '..GGGGGGG.', '..BGBGBGB..', '...GgGGG..', '....GG.....'] },
    { ic: '✨', rows: ['PPPPPPPPPPP', 'PYPPYYPPYP', 'PPYPYYYPYPP', 'BPPYYYYPPB', 'BBYYYyYYYBB', 'BPPYYYYPPB', 'PPYPYYYPYPP', 'PYPPYYPPYP', 'PPPPPKPPPPP', 'GGGGkKGGGG'] },
    { ic: '❄️', rows: ['GGKKGGGKKGG', 'KKBKKKKBKK', 'BKKBKKKBKKB', '.BKBBBBKB.', 'BBBBYbYBBBB', '.BKBBBBKB.', 'BKKBKKKBKKB', 'KKBKKKKBKK', 'KKKKKbKKKKK', '...PPPP...'] },
    { ic: '☀️', rows: ['BBBBBBBBBBB', 'BBYBBBBYBB', 'BBBYYYYYBBB', 'BBYRRRRYBB', 'YYYRRrRRYYY', 'BBYRRRRYBB', 'BBBYYYYYBBB', 'BBYBBBBYBB', 'BYBBBYBBBYB', '.GGGGGGGG.', '..PP.P.PP..'] },
    { ic: '👑', rows: ['KKPPKKKPPKK', 'YYYYYYYYYY', 'YRYYGYYBYRY', 'YYYPYYPYYY', 'YYBYYyYYGYY', 'YKYYRRYYKY', 'YKK.YYY.KKY', 'Y.K.YkY.KY', 'Y..KYYYK..Y', 'R...Y.Y...', 'r..........'] }
  ];
  const NL = LEVELS.length, ENDLESS = NL + 1;

  /* ---------- أدوات ---------- */
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  const ease = {
    outCubic: t => 1 - Math.pow(1 - t, 3),
    outBack: t => { const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  };
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  /* التقدّم: الحفظ القديم (قبل المراحل 21–40) كان يعني unlocked = 21 «بلا نهاية مفتوح»؛ نحافظ عليه بالعلم endless */
  const OLD_ENDLESS = 21;
  const loadProg = () => {
    const p = store.get('bubblesProg', null) || {};
    const unlocked = clamp(p.unlocked || 1, 1, ENDLESS);
    const endlessOpen = !!p.endless || unlocked >= ENDLESS || (!p.v && (p.unlocked || 1) >= OLD_ENDLESS);
    return { v: 2, unlocked, stars: p.stars || {}, endless: endlessOpen };
  };

  function heartPath(c, s) {
    c.beginPath(); c.moveTo(0, s * .9);
    c.bezierCurveTo(-s * 1.4, 0, -s * .7, -s * 1.1, 0, -s * .45);
    c.bezierCurveTo(s * .7, -s * 1.1, s * 1.4, 0, 0, s * .9); c.closePath();
  }
  function starPath(c, s, inner = .45) { c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? s * inner : s; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); }
  /* رمز اللون داخل الفقاعة */
  function symbol(c, ci, s) {
    c.beginPath();
    switch (ci) {
      case 0: heartPath(c, s * .85); c.translate(0, 0); break;
      case 1: starPath(c, s * 1.05, .48); break;
      case 2: c.moveTo(0, -s * .95); c.lineTo(s * .95, s * .75); c.lineTo(-s * .95, s * .75); c.closePath(); break;
      case 3: c.moveTo(0, -s * 1.05); c.bezierCurveTo(s * .3, -s * .5, s * .85, -s * .05, s * .85, s * .35); c.arc(0, s * .35, s * .85, 0, Math.PI); c.bezierCurveTo(-s * .85, -s * .05, -s * .3, -s * .5, 0, -s * 1.05); break;
      case 4: c.moveTo(0, -s); c.lineTo(s * .75, 0); c.lineTo(0, s); c.lineTo(-s * .75, 0); c.closePath(); break;
      case 5: for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU / 5; c.moveTo(Math.cos(a) * s * .55 + s * .42, Math.sin(a) * s * .55); c.arc(Math.cos(a) * s * .55, Math.sin(a) * s * .55, s * .42, 0, TAU); } break;
    }
    c.fill();
  }

  /* ---------- الحيوانات الصغيرة (مرسومة بالكانفاس) ---------- */
  function drawAnimal(c, k, u) {
    c.save();
    c.lineJoin = 'round'; c.lineCap = 'round';
    const ink = 'rgba(70,35,50,.4)';
    const eye = (x, y, s) => { c.fillStyle = '#2A1B2C'; c.beginPath(); c.arc(x, y, s, 0, TAU); c.fill(); c.fillStyle = '#fff'; c.beginPath(); c.arc(x - s * .32, y - s * .36, s * .4, 0, TAU); c.fill(); };
    const blush = (x, y) => { c.fillStyle = 'rgba(255,105,140,.55)'; c.beginPath(); c.ellipse(x, y, u * .18, u * .1, 0, 0, TAU); c.fill(); };
    const face = (col, rx = u, ry = u) => { c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, TAU); c.fill(); c.strokeStyle = ink; c.lineWidth = u * .08; c.stroke(); };
    const smile = (y, w) => { c.strokeStyle = '#5A2A35'; c.lineWidth = u * .07; c.beginPath(); c.arc(-w / 2, y, w / 2, .2, Math.PI - .2); c.stroke(); c.beginPath(); c.arc(w / 2, y, w / 2, .2, Math.PI - .2); c.stroke(); };
    const tri = (pts, fill) => { c.fillStyle = fill; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0] * u, p[1] * u) : c.moveTo(p[0] * u, p[1] * u)); c.closePath(); c.fill(); };
    switch (k) {
      case 0: { // كتكوت
        c.strokeStyle = '#E2A300'; c.lineWidth = u * .12;
        c.beginPath(); c.moveTo(0, -u * .9); c.quadraticCurveTo(-u * .1, -u * 1.35, -u * .3, -u * 1.25); c.moveTo(0, -u * .9); c.quadraticCurveTo(u * .15, -u * 1.4, u * .32, -u * 1.22); c.stroke();
        face('#FFE45C');
        eye(-u * .36, -u * .12, u * .15); eye(u * .36, -u * .12, u * .15);
        tri([[-.2, .12], [.2, .12], [0, .4]], '#FF8F1F');
        blush(-u * .62, u * .26); blush(u * .62, u * .26);
        break;
      }
      case 1: { // أرنب
        for (const s of [-1, 1]) {
          c.save(); c.translate(s * u * .4, -u * .95); c.rotate(s * .18);
          c.fillStyle = '#FFFFFF'; c.beginPath(); c.ellipse(0, 0, u * .26, u * .58, 0, 0, TAU); c.fill(); c.strokeStyle = ink; c.lineWidth = u * .08; c.stroke();
          c.fillStyle = '#FFAFC8'; c.beginPath(); c.ellipse(0, u * .05, u * .12, u * .4, 0, 0, TAU); c.fill(); c.restore();
        }
        face('#FFFFFF');
        eye(-u * .35, -u * .1, u * .14); eye(u * .35, -u * .1, u * .14);
        c.fillStyle = '#FF7FA6'; c.beginPath(); c.ellipse(0, u * .16, u * .12, u * .08, 0, 0, TAU); c.fill();
        smile(u * .22, u * .22); blush(-u * .6, u * .25); blush(u * .6, u * .25);
        break;
      }
      case 2: { // قطة
        for (const s of [-1, 1]) {
          tri([[s * .25, -.85], [s * .95, -1.05], [s * .88, -.3]], '#FFAE5C');
          tri([[s * .4, -.78], [s * .85, -.9], [s * .8, -.45]], '#FFC0D2');
        }
        face('#FFAE5C');
        c.strokeStyle = '#E07B20'; c.lineWidth = u * .09;
        c.beginPath(); for (const x of [-.22, 0, .22]) { c.moveTo(x * u, -u * .9); c.lineTo(x * u, -u * .6); } c.stroke();
        eye(-u * .36, -u * .1, u * .15); eye(u * .36, -u * .1, u * .15);
        tri([[-.1, .12], [.1, .12], [0, .24]], '#FF6F96');
        smile(u * .26, u * .2);
        c.strokeStyle = 'rgba(90,50,30,.7)'; c.lineWidth = u * .05; c.beginPath();
        for (const s of [-1, 1]) { c.moveTo(s * u * .38, u * .2); c.lineTo(s * u * 1.0, u * .1); c.moveTo(s * u * .38, u * .3); c.lineTo(s * u * 1.0, u * .36); }
        c.stroke();
        break;
      }
      case 3: { // باندا
        c.fillStyle = '#2E2C38'; for (const s of [-1, 1]) { c.beginPath(); c.arc(s * u * .7, -u * .72, u * .3, 0, TAU); c.fill(); }
        face('#FFFFFF');
        c.fillStyle = '#2E2C38';
        for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * u * .37, -u * .04, u * .21, u * .28, s * .55, 0, TAU); c.fill(); }
        c.fillStyle = '#fff'; for (const s of [-1, 1]) { c.beginPath(); c.arc(s * u * .35, -u * .08, u * .085, 0, TAU); c.fill(); }
        c.fillStyle = '#2E2C38'; c.beginPath(); c.ellipse(0, u * .26, u * .13, u * .08, 0, 0, TAU); c.fill();
        smile(u * .34, u * .18); blush(-u * .66, u * .3); blush(u * .66, u * .3);
        break;
      }
      case 4: { // ضفدع
        c.fillStyle = '#74D266'; c.strokeStyle = ink; c.lineWidth = u * .08;
        for (const s of [-1, 1]) { c.beginPath(); c.arc(s * u * .46, -u * .62, u * .34, 0, TAU); c.fill(); c.stroke(); }
        face('#74D266', u * 1.05, u * .82);
        c.fillStyle = '#74D266'; for (const s of [-1, 1]) { c.beginPath(); c.arc(s * u * .46, -u * .62, u * .3, 0, TAU); c.fill(); }
        for (const s of [-1, 1]) { c.fillStyle = '#fff'; c.beginPath(); c.arc(s * u * .46, -u * .64, u * .22, 0, TAU); c.fill(); eye(s * u * .46, -u * .62, u * .12); }
        c.strokeStyle = '#2F6B2A'; c.lineWidth = u * .08; c.beginPath(); c.arc(0, u * .02, u * .48, .35, Math.PI - .35); c.stroke();
        blush(-u * .66, u * .2); blush(u * .66, u * .2);
        break;
      }
      default: { // خنزير صغير
        for (const s of [-1, 1]) tri([[s * .3, -.8], [s * .9, -1.0], [s * .85, -.35]], '#FF9DB9');
        face('#FFC4D6');
        eye(-u * .38, -u * .22, u * .13); eye(u * .38, -u * .22, u * .13);
        c.fillStyle = '#FF98B6'; c.beginPath(); c.ellipse(0, u * .22, u * .36, u * .26, 0, 0, TAU); c.fill(); c.strokeStyle = 'rgba(200,70,110,.5)'; c.lineWidth = u * .06; c.stroke();
        c.fillStyle = '#B83E68'; for (const s of [-1, 1]) { c.beginPath(); c.ellipse(s * u * .12, u * .22, u * .06, u * .09, 0, 0, TAU); c.fill(); }
        blush(-u * .66, u * .16); blush(u * .66, u * .16);
      }
    }
    c.restore();
  }

  /* ---------- رسم الفقاعة اللامعة (تُخبز مسبقًا) ---------- */
  function paintBubble(x, ci, a, r) {
    const col = COL[ci];
    let g = x.createRadialGradient(-r * .32, -r * .38, r * .05, 0, 0, r);
    g.addColorStop(0, col.l); g.addColorStop(.5, col.b); g.addColorStop(1, col.d);
    x.fillStyle = g; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill();
    // لمعان الحافة كغشاء الصابون
    g = x.createRadialGradient(0, 0, r * .62, 0, 0, r);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.8, 'rgba(255,255,255,.06)'); g.addColorStop(1, 'rgba(255,255,255,.5)');
    x.fillStyle = g; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.fill();
    // انعكاس سفلي
    x.save(); x.strokeStyle = 'rgba(255,255,255,.4)'; x.lineWidth = r * .11; x.lineCap = 'round';
    x.beginPath(); x.arc(0, 0, r * .76, .22 * Math.PI, .62 * Math.PI); x.stroke(); x.restore();
    if (a < 0) {
      x.save(); x.fillStyle = 'rgba(255,255,255,.9)'; x.shadowColor = col.d; x.shadowBlur = r * .18; x.shadowOffsetY = r * .04;
      x.translate(0, r * .04); symbol(x, ci, r * .34); x.restore();
    } else {
      x.save(); x.fillStyle = 'rgba(255,255,255,.35)'; x.beginPath(); x.arc(0, r * .05, r * .68, 0, TAU); x.fill(); x.restore();
      x.save(); x.translate(0, r * .14); drawAnimal(x, a, r * .55); x.restore();
    }
    // اللمعة الكبيرة
    x.save(); x.translate(-r * .38, -r * .45); x.rotate(-.7);
    g = x.createRadialGradient(0, 0, 0, 0, 0, r * .34);
    g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(.6, 'rgba(255,255,255,.7)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.scale(1, .5); x.fillStyle = g; x.beginPath(); x.arc(0, 0, r * .34, 0, TAU); x.fill(); x.restore();
    x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.arc(-r * .66, -r * .08, r * .065, 0, TAU); x.fill();
    // الحافة
    x.strokeStyle = 'rgba(255,255,255,.65)'; x.lineWidth = r * .07; x.beginPath(); x.arc(0, 0, r * .965, 0, TAU); x.stroke();
    x.strokeStyle = col.d + '88'; x.lineWidth = r * .05; x.beginPath(); x.arc(0, 0, r, 0, TAU); x.stroke();
  }
  function bakeBubble(ci, a, D, dpr) {
    const P = Math.ceil(D * dpr * 1.04), c = mk(P, P), x = c.getContext('2d');
    x.translate(P / 2, P / 2); x.scale(dpr, dpr);
    paintBubble(x, ci, a, D / 2 * .96);
    return c;
  }

  /* ---------- الواجهة ---------- */
  App.css(`
  #bubbles{background:#DCEBFF;overflow:hidden}
  #bubbles canvas.bc{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none}
  #bubbles .ib{color:#4B5BD6}
  #bubbles .chip{color:#3D3A8C}
  #bubbles .chip b{color:#6A4BF0}
  #bubbles .panel{border-color:#DCD4FF;box-shadow:0 8px 0 #B9AEF5,0 20px 40px rgba(40,30,120,.3);color:#3A2F7A}
  #bubbles .panel h3{color:#6A45E8}
  #bubbles .btn{background:linear-gradient(#8F7BFF,#6C55F2);box-shadow:0 4px 0 #4935C2}
  #bubbles .btn.alt{background:#fff;color:#6A45E8;box-shadow:0 4px 0 #CFC6FF;border-color:#E2DCFF}
  #bubbles .btn:active{box-shadow:0 1px 0 #4935C2}
  #bubbles .overlay{background:rgba(40,40,110,.35)}
  #bubbles .panel .an{font-size:15px;margin:-6px 0 10px;opacity:.85}
  #bubbles .lvp{width:min(94vw,440px);max-height:88vh;overflow-y:auto;touch-action:pan-y}
  #bubbles .lvg{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin:10px 0 10px}
  #bubbles .lvb{position:relative;aspect-ratio:1;border-radius:50%;
    background:radial-gradient(circle at 34% 30%,#fff 0 9%,#D8EEFF 10%,#9CCBFF 55%,#6E9CF2 100%);
    box-shadow:0 4px 0 #5576D0,inset 0 -4px 8px rgba(40,60,160,.25);
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#24308A;font-weight:900;padding:2px}
  #bubbles .lvb:active{transform:translateY(3px);box-shadow:0 1px 0 #5576D0}
  #bubbles .lvb .n{font-size:12px;line-height:1;opacity:.75}
  #bubbles .lvb .e{font-size:22px;line-height:1.1}
  #bubbles .lvb .s{font-size:9px;letter-spacing:-1px;line-height:1;height:10px}
  #bubbles .lvb .s i{font-style:normal}
  #bubbles .lvb .s i.off{filter:grayscale(1);opacity:.3}
  #bubbles .lvb.cur{outline:3px solid #FF74C2;outline-offset:2px}
  #bubbles .lvb.lock{background:radial-gradient(circle at 34% 30%,#fff 0 9%,#EEEAF5 10%,#CFC9DE 60%,#ADA6C2 100%);box-shadow:0 4px 0 #8F88A6;color:#7d7590}
  #bubbles .lvb.lock .e{filter:grayscale(1);opacity:.35;font-size:18px}
  #bubbles .lvb.lock::after{content:'🔒';position:absolute;font-size:15px;bottom:2px}
  #bubbles .lvend{width:100%;margin:0 0 12px;padding:10px;border-radius:20px;font-size:18px;font-weight:900;color:#fff;
    background:linear-gradient(90deg,#FF5A6E,#FFC52E,#4FCF62,#3E9DFF,#A06BFF,#FF74C2);box-shadow:0 4px 0 #6B57C9;text-shadow:0 1px 2px rgba(0,0,0,.35)}
  #bubbles .lvend.lock{filter:grayscale(1);opacity:.55}
  #bubbles .lvend small{display:block;font-size:12px;font-weight:700;opacity:.95}
  #bubbles .hint{top:auto}
  #bubbles .hint span{background:rgba(255,255,255,.9);color:#3D3A8C;box-shadow:0 2px 8px rgba(60,60,160,.18)}
  `);
  const root = App.section(ID, `
    <canvas class="bc"></canvas>
    <div class="bar">
      <button class="ib home" aria-label="الرئيسية" data-aen="Home">🏠</button>
      <button class="ib helpbtn" aria-label="مساعدة" data-aen="Help">❓</button>
      <button class="ib lvbtn" aria-label="المراحل" data-aen="Levels">🔢</button>
      <span class="grow"></span>
      <div class="chip"><small data-en="Level">المرحلة</small><b class="cLv">1</b></div>
      <div class="chip"><small data-en="Score">النقاط</small><b class="cSc">0</b></div>
    </div>
    <div class="hint"><span class="hintT"></span></div>
    <div class="overlay" id="bbLv"><div class="panel lvp"><h3 data-en="🔢 Levels">🔢 المراحل</h3><div class="lvg"></div>
      <button class="lvend" data-l="${ENDLESS}"><span data-en="♾️ Endless">♾️ بلا نهاية</span><small class="lvendS"></small></button>
      <button class="btn alt" data-a="close" data-en="✕ Close">✕ إغلاق</button></div></div>
    <div class="overlay" id="bbWin"><div class="panel">
      <h3 class="wT"></h3><div class="stars3 wS"></div><p class="wP"></p><div class="an wA"></div>
      <button class="btn" data-a="next">التالي ▶️</button><br>
      <button class="btn alt" data-a="levels" data-en="🔢 Levels">🔢 المراحل</button><button class="btn alt home" aria-label="الرئيسية" data-aen="Home">🏠</button>
    </div></div>
    <div class="overlay" id="bbLose"><div class="panel">
      <h3 class="lT"></h3><div class="big lB"></div><p class="lP"></p>
      <button class="btn" data-a="again" data-en="🔄 Try again">🔄 مرة أخرى</button><br>
      <button class="btn alt" data-a="levels" data-en="🔢 Levels">🔢 المراحل</button><button class="btn alt home" aria-label="الرئيسية" data-aen="Home">🏠</button>
    </div></div>`);
  /* نصوص الواجهة الثابتة: data-en للنص و data-aen للوصف (aria/title) */
  function i18n() {
    root.querySelectorAll('[data-en]').forEach(el => { if (el.dataset.ar == null) el.dataset.ar = el.textContent; el.textContent = App.t(el.dataset.ar, el.dataset.en); });
    root.querySelectorAll('[data-aen]').forEach(el => {
      if (el.dataset.aar == null) el.dataset.aar = el.getAttribute('aria-label') || el.title || '';
      const v = App.t(el.dataset.aar, el.dataset.aen); if (el.hasAttribute('aria-label')) el.setAttribute('aria-label', v); if (el.title) el.title = v;
    });
  }
  let winPaint = null, losePaint = null;
  const hintText = () => '👆 ' + App.t(App.g('اسحبي للتصويب ثم اتركي للإطلاق', 'اسحب للتصويب ثم اترك للإطلاق'), 'Drag to aim, then let go to shoot');
  const cv = root.querySelector('canvas.bc');
  const bar = root.querySelector('.bar');
  const hintEl = root.querySelector('.hint'), hintT = root.querySelector('.hintT');
  const lvOv = root.querySelector('#bbLv'), winOv = root.querySelector('#bbWin'), loseOv = root.querySelector('#bbLose');
  const cLv = root.querySelector('.cLv'), cSc = root.querySelector('.cSc');

  /* ---------- الحالة ---------- */
  let ctx, W = 0, H = 0, dpr = 1;
  let D = 34, R = 17, RH = 29.4, FL = 0, FW = 374, fieldTop = 70, cannonX = 0, cannonY = 0, dangerY = 0, maxRows = 12, barBottom = 60;
  let spr = [], sprA = [], bgLayer = null, bgBubbles = [];
  let raf = 0, last = 0, T = 0, running = false, paused = false;
  let grid = [], par = 0, ceilRows = 0, yOff = 0;
  let level = 1, endless = false, score = 0, shots = 0, misses = 0, missMax = 8, startCount = 1, rescued = 0, animalSeq = 0;
  let cur = null, nxt = null, aimA = -Math.PI / 2, aiming = null, flying = null, aimPath = null, aimDirty = true;
  let state = 'play', endTimer = 0, endWait = 0, nColorsEndless = 5;
  let pops = [], falls = [], parts = [], texts = [], freed = [], rings = [];
  let reload = 1, swapA = 0, recoil = 0, shake = 0, warnPulse = 0, ceilFlash = 0, hintShown = false;

  /* ---------- الشبكة ---------- */
  const shifted = r => ((r + par) & 1) === 1;
  const nCols = r => shifted(r) ? COLS - 1 : COLS;
  const valid = (r, c) => r >= 0 && c >= 0 && c < nCols(r);
  const get = (r, c) => (grid[r] && valid(r, c)) ? grid[r][c] : null;
  const rowY = r => fieldTop + ceilRows * RH + yOff + R + r * RH;
  const cellX = (r, c) => FL + R + c * D + (shifted(r) ? R : 0);
  function neighbors(r, c) {
    const o = [[r, c - 1], [r, c + 1]], a = shifted(r) ? [c, c + 1] : [c - 1, c];
    for (const rr of [r - 1, r + 1]) for (const cc of a) o.push([rr, cc]);
    return o.filter(([rr, cc]) => valid(rr, cc));
  }
  function ensureRow(r) { while (grid.length <= r) grid.push(new Array(COLS).fill(null)); }
  function trimRows() { while (grid.length && grid[grid.length - 1].every(v => !v)) grid.pop(); }
  function each(fn) { for (let r = 0; r < grid.length; r++) for (let c = 0; c < COLS; c++) if (grid[r][c]) fn(grid[r][c], r, c); }
  function count() { let n = 0; each(() => n++); return n; }
  function colorsOnBoard() { const s = new Set(); each(b => s.add(b.c)); return s; }
  function lowestRow() { let lo = -1; each((b, r) => { if (r > lo) lo = r; }); return lo; }
  function pickColor() {
    const s = [...colorsOnBoard()];
    if (!s.length) return Math.floor(Math.random() * (endless ? nColorsEndless : 3));
    return s[Math.floor(Math.random() * s.length)];
  }
  const mkCell = (c, a) => ({ c, a, sq: 0, ox: 0, oy: 0 });

  /* ---------- التخطيط ---------- */
  function layout() {
    const f = fitCanvas(cv); ctx = f.ctx; W = f.w; H = f.h; dpr = f.dpr;
    barBottom = bar.getBoundingClientRect().bottom;
    const top = barBottom + 6;
    D = Math.min((Math.min(W - 16, 540)) / COLS, (H - top - 12) / 15.2);
    R = D / 2; RH = D * Math.sqrt(3) / 2; FW = D * COLS; FL = (W - FW) / 2;
    cannonX = W / 2; cannonY = H - 12 - D * 1.5;
    const dz = cannonY - D * 1.3;
    let rowsFit = Math.floor((dz - top - D) / RH) + 1;
    if (rowsFit > MAXR) {
      const extra = (rowsFit - MAXR) * RH, aimExtra = Math.min(extra, D * 2.5);
      dangerY = dz - aimExtra; maxRows = MAXR;
      fieldTop = dangerY - D - (MAXR - 1) * RH;
    } else { maxRows = rowsFit; fieldTop = top; dangerY = fieldTop + D + (maxRows - 1) * RH; }
    spr = COL.map((_, ci) => bakeBubble(ci, -1, D, dpr));
    sprA = COL.map((_, ci) => ANIMALS.map((_, a) => bakeBubble(ci, a, D, dpr)));
    buildBg();
    if (!bgBubbles.length) for (let i = 0; i < 22; i++) bgBubbles.push({ x: Math.random(), y: Math.random(), r: rand(3, 14), v: rand(.015, .05), ph: rand(0, TAU) });
    hintEl.style.top = (dangerY - 40) + 'px';
    aimDirty = true;
  }

  function buildBg() {
    bgLayer = mk(W * dpr, H * dpr);
    const x = bgLayer.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    let g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#E8E2FF'); g.addColorStop(.45, '#CFE8FF'); g.addColorStop(1, '#AEEFE4');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // أشعة ضوء ناعمة
    x.save(); x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 6; i++) {
      const sx = W * (.1 + i * .17);
      g = x.createLinearGradient(sx, 0, sx + H * .3, H);
      g.addColorStop(0, 'rgba(255,255,255,.12)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.beginPath(); x.moveTo(sx - 20, 0); x.lineTo(sx + 30 + i * 6, 0); x.lineTo(sx + H * .35 + 60, H); x.lineTo(sx + H * .35 - 40, H); x.closePath(); x.fill();
    }
    x.restore();
    // كثبان رملية وأعشاب بحرية
    const sy = cannonY + D * .95;
    const R2 = rng(5);
    for (let k = 0; k < 9; k++) {
      const bx = R2() * W, h = D * (1.4 + R2() * 2.2);
      x.strokeStyle = ['#7FD6A8', '#9BE3B8', '#6CC79C'][k % 3]; x.lineWidth = 5 + R2() * 4; x.lineCap = 'round';
      x.beginPath(); x.moveTo(bx, sy + 8);
      for (let t = 1; t <= 6; t++) x.lineTo(bx + Math.sin(t * 1.3 + k) * 6, sy + 8 - h * t / 6);
      x.stroke();
    }
    g = x.createLinearGradient(0, sy - 10, 0, H); g.addColorStop(0, '#FFEFD2'); g.addColorStop(1, '#F7D9AA');
    x.fillStyle = g; x.beginPath(); x.moveTo(0, H);
    for (let xx = 0; xx <= W + 20; xx += 20) x.lineTo(xx, sy + Math.sin(xx * .012) * 8 + Math.sin(xx * .031 + 1) * 4);
    x.lineTo(W, H); x.closePath(); x.fill();
    x.fillStyle = 'rgba(210,160,100,.25)';
    for (let i = 0; i < W / 9; i++) { x.beginPath(); x.arc(R2() * W, sy + 10 + R2() * (H - sy), 1 + R2() * 1.6, 0, TAU); x.fill(); }
    // أصداف ونجوم بحر صغيرة
    for (let i = 0; i < Math.max(2, W / 260); i++) {
      const px = R2() * W, py = sy + 14 + R2() * Math.max(4, H - sy - 24);
      if (Math.abs(px - cannonX) < D * 3.6) continue;
      x.save(); x.translate(px, py); x.rotate(R2() * TAU); x.fillStyle = i % 2 ? '#FF9FB6' : '#FFB86B'; starPath(x, D * .28, .5); x.fill(); x.restore();
    }
    // لوح اللعب الشفاف
    x.save();
    x.shadowColor = 'rgba(60,70,160,.18)'; x.shadowBlur = 20;
    x.fillStyle = 'rgba(255,255,255,.22)'; x.beginPath(); x.roundRect(FL - 6, 0, FW + 12, dangerY + D * .6, [0, 0, 22, 22]); x.fill();
    x.restore();
    x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 2; x.beginPath(); x.roundRect(FL - 6, -4, FW + 12, dangerY + D * .6 + 4, [0, 0, 22, 22]); x.stroke();
    // الجداران
    for (const wx of [FL - 6, FL + FW + 6]) {
      g = x.createLinearGradient(wx - 4, 0, wx + 4, 0); g.addColorStop(0, '#B7A8FF'); g.addColorStop(.5, '#F2EEFF'); g.addColorStop(1, '#9C8BF2');
      x.fillStyle = g; x.beginPath(); x.roundRect(wx - 4, 0, 8, dangerY + D * .2, 4); x.fill();
    }
  }

  /* ---------- المراحل ---------- */
  function loadLevel(n) {
    level = n; endless = n >= ENDLESS;
    grid = []; par = 0; ceilRows = 0; yOff = 0; animalSeq = 0;
    if (!endless) {
      LEVELS[n - 1].rows.forEach((s, r) => {
        ensureRow(r);
        for (let c = 0; c < nCols(r) && c < s.length; c++) {
          const ch = s[c]; if (ch === '.') continue;
          const ci = LET.indexOf(ch.toUpperCase()); if (ci < 0) continue;
          grid[r][c] = mkCell(ci, ch !== ch.toUpperCase() ? (animalSeq++ % ANIMALS.length) : -1);
        }
      });
      missMax = n <= 5 ? 8 : n <= 12 ? 7 : n <= 30 ? 6 : 5;
    } else {
      nColorsEndless = 5;
      for (let r = 0; r < 6; r++) genRow(r);
      missMax = 5;
    }
    startCount = count();
  }
  function genRow(r) {
    ensureRow(r);
    for (let c = 0; c < nCols(r); c++) {
      let ci;
      const nb = neighbors(r, c).map(([rr, cc]) => get(rr, cc)).filter(Boolean);
      if (nb.length && Math.random() < .5) ci = nb[Math.floor(Math.random() * nb.length)].c;
      else ci = Math.floor(Math.random() * nColorsEndless);
      grid[r][c] = mkCell(ci, Math.random() < .07 ? (animalSeq++ % ANIMALS.length) : -1);
    }
  }
  function startLevel(n) {
    clearTimeout(endTimer);
    [winOv, loseOv, lvOv].forEach(o => o.classList.remove('on'));
    loadLevel(n);
    score = 0; shots = 0; misses = 0; rescued = 0; state = 'play';
    pops = []; falls = []; parts = []; texts = []; freed = []; rings = [];
    flying = null; aiming = null; aimA = -Math.PI / 2; reload = 1; recoil = 0;
    cur = { c: pickColor() }; nxt = { c: pickColor() };
    // دخول المرحلة: الفقاعات تنزل من الأعلى
    yOff = -RH * 3;
    updChips(); aimDirty = true;
    if (!hintShown) { hintT.textContent = hintText(); hintEl.style.opacity = 1; }
    else hintEl.style.opacity = 0;
    Sound.whoosh();
  }
  function updChips() {
    cLv.textContent = endless ? '∞' : level;
    cSc.textContent = score;
  }

  /* ---------- التصويب والمسار ---------- */
  function collide(x, y) {
    if (y <= rowY(0)) return true;
    const rf = Math.floor((y - rowY(0)) / RH), lim = D * .8, l2 = lim * lim;
    for (let r = Math.max(0, rf - 1); r <= rf + 2 && r < grid.length; r++) {
      const ry = rowY(r), dy = y - ry; if (dy * dy > l2) continue;
      for (let c = 0; c < COLS; c++) {
        if (!grid[r][c]) continue;
        const dx = x - cellX(r, c);
        if (dx * dx + dy * dy < l2) return true;
      }
    }
    return false;
  }
  /* يتتبّع المسار من المدفع: يرتدّ عن الجدران ويتوقف عند أول اصطدام */
  function trace(a, maxB) {
    let x = cannonX, y = cannonY, dx = Math.cos(a), dy = Math.sin(a), b = 0;
    const pts = [{ x, y }], step = R * .3, minX = FL + R, maxX = FL + FW - R;
    for (let i = 0; i < 6000; i++) {
      x += dx * step; y += dy * step;
      if (x < minX) { const k = (minX - x) / Math.abs(dx); pts.push({ x: minX, y: y - dy * k, bounce: true }); x = 2 * minX - x; dx = -dx; if (++b > maxB) return { pts, end: null }; }
      else if (x > maxX) { const k = (x - maxX) / Math.abs(dx); pts.push({ x: maxX, y: y - dy * k, bounce: true }); x = 2 * maxX - x; dx = -dx; if (++b > maxB) return { pts, end: null }; }
      if (collide(x, y)) { pts.push({ x, y }); return { pts, end: { x, y } }; }
    }
    return { pts, end: null };
  }
  function snapCell(x, y) {
    const rf = Math.round((y - rowY(0)) / RH);
    let best = null, bestN = null;
    for (let r = Math.max(0, rf - 1); r <= rf + 1; r++) {
      for (let c = 0; c < nCols(r); c++) {
        if (get(r, c)) continue;
        const d = Math.hypot(x - cellX(r, c), y - rowY(r));
        const att = r === 0 || neighbors(r, c).some(([rr, cc]) => get(rr, cc));
        if (att && (!bestN || d < bestN.d)) bestN = { r, c, d };
        if (!best || d < best.d) best = { r, c, d };
      }
    }
    return bestN && bestN.d < D * 1.3 ? bestN : best;
  }
  function setAim(px, py) {
    let dx = px - cannonX, dy = py - cannonY;
    if (dy > -D * .4) dy = -D * .4;
    const a = clamp(Math.atan2(dy, dx), -Math.PI + .2, -.2);
    if (a !== aimA) { aimA = a; aimDirty = true; }
  }
  const canShoot = () => state === 'play' && !flying && cur && reload >= .7 && Math.abs(yOff) < 2 && !paused;

  function shoot() {
    if (!canShoot()) return;
    const tr = trace(aimA, 80);
    if (!tr.end) return;
    flying = { pts: tr.pts, seg: 0, x: cannonX, y: cannonY, c: cur.c, a: aimA, sq: 0 };
    cur = nxt; nxt = { c: pickColor() }; reload = 0;
    shots++; recoil = 1;
    Sound.tone(260, .12, 'triangle', .14, 520); Sound.noise(.12, 600, 2400, .06, 1.5); vibrate(12);
    if (hintEl.style.opacity !== '0') { hintEl.style.opacity = 0; hintShown = true; }
  }
  function swap() {
    if (state !== 'play' || !cur || !nxt || reload < .7) return;
    const t = cur.c; cur.c = nxt.c; nxt.c = t; swapA = 1;
    Sound.tone(520, .07, 'sine', .1, 260); Sound.tone(780, .07, 'sine', .08, -200, .06); vibrate(8);
  }

  /* ---------- الهبوط والانفجار ---------- */
  function land(fx, fy, ci) {
    const cell = snapCell(fx, fy);
    if (!cell) { flying = null; return; }
    const { r, c } = cell;
    ensureRow(r);
    const b = mkCell(ci, -1); b.ox = fx - cellX(r, c); b.oy = fy - rowY(r); b.sq = 1;
    grid[r][c] = b;
    for (const [rr, cc] of neighbors(r, c)) { const n = get(rr, cc); if (n) { n.sq = Math.max(n.sq, .7); const dx = cellX(rr, cc) - cellX(r, c), dy = rowY(rr) - rowY(r), d = Math.hypot(dx, dy) || 1; n.ox += dx / d * R * .22; n.oy += dy / d * R * .22; } }
    // مجموعة نفس اللون
    const grp = [[r, c]], seen = new Set([r + ',' + c]);
    for (let i = 0; i < grp.length; i++) {
      for (const [rr, cc] of neighbors(grp[i][0], grp[i][1])) {
        const n = get(rr, cc), k = rr + ',' + cc;
        if (n && n.c === ci && !seen.has(k)) { seen.add(k); grp.push([rr, cc]); }
      }
    }
    if (grp.length >= 3) {
      let sx = 0, sy = 0;
      grp.forEach(([rr, cc], i) => {
        const n = grid[rr][cc], x = cellX(rr, cc), y = rowY(rr);
        sx += x; sy += y;
        pops.push({ x, y, c: n.c, a: n.a, delay: i * .045, idx: i });
        grid[rr][cc] = null;
      });
      const pts = grp.length * 10;
      score += pts;
      addText(sx / grp.length, sy / grp.length, '+' + pts, COL[ci].d, 1);
      // الفقاعات المعلّقة تسقط
      const fl = dropFloaters(grp.length * .045 + .05);
      if (fl > 0) {
        const bonus = fl * 20 * (fl >= 6 ? 2 : 1);
        score += bonus;
        setTimeout(() => { if (state !== 'lost') addText(FL + FW / 2, rowY(Math.max(1, r)) + D, '+' + bonus + (fl >= 6 ? ' ' + App.t(App.g('رائعة!', 'رائع!'), 'Great!') : ''), '#FF4FA3', 1.35); }, 250);
        if (fl >= 10) App.achieve('bub_drop');
      }
      misses = 0; shake = Math.max(shake, Math.min(7, 2 + grp.length * .4 + fl * .3));
      vibrate(20);
    } else {
      Sound.tone(180, .1, 'sine', .16, -60); Sound.noise(.05, 800, 1600, .04, 2);
      misses++;
      if (misses >= missMax) { misses = 0; setTimeout(pushCeiling, 220); }
    }
    trimRows(); updChips();
    afterChange();
  }
  function dropFloaters(delay0) {
    const seen = new Set(), st = [];
    if (grid[0]) for (let c = 0; c < COLS; c++) if (grid[0][c]) { seen.add('0,' + c); st.push([0, c]); }
    while (st.length) {
      const [r, c] = st.pop();
      for (const [rr, cc] of neighbors(r, c)) { const k = rr + ',' + cc; if (get(rr, cc) && !seen.has(k)) { seen.add(k); st.push([rr, cc]); } }
    }
    let n = 0;
    each((b, r, c) => {
      if (seen.has(r + ',' + c)) return;
      falls.push({ x: cellX(r, c), y: rowY(r), c: b.c, a: b.a, vx: rand(-1.6, 1.6) * D, vy: rand(-3.5, -1) * D, rot: 0, vr: rand(-3, 3), delay: delay0 + n * .012, bounced: false });
      grid[r][c] = null; n++;
    });
    return n;
  }
  function afterChange() {
    if (state !== 'play') return;
    if (count() === 0) {
      if (!endless) { winLevel(); return; }
      score += 500; updChips(); addText(FL + FW / 2, rowY(2), '+500 ' + App.t(App.g('مذهلة!', 'مذهل!'), 'Amazing!'), '#6A45E8', 1.5); Sound.star();
      for (let i = 0; i < 4; i++) pushRow();
    }
    if (endless) {
      if (score > 4000) nColorsEndless = 6;
      if (count() < 18) setTimeout(() => { if (state === 'play') pushRow(); }, 300);
    }
    checkLose();
    // ألوان الفقاعات الجاهزة يجب أن تكون موجودة على اللوح
    const s = colorsOnBoard();
    if (cur && !s.has(cur.c)) { cur.c = pickColor(); swapA = 1; }
    if (nxt && !s.has(nxt.c)) { nxt.c = pickColor(); }
    aimDirty = true;
  }
  function pushCeiling() {
    if (state !== 'play') return;
    if (endless) { pushRow(); return; }
    ceilRows++; yOff -= RH; ceilFlash = 1;
    Sound.thud(); Sound.noise(.3, 300, 120, .12, 1); shake = Math.max(shake, 6); vibrate(30);
    aimDirty = true;
    checkLose();
  }
  function pushRow() {
    grid.unshift(new Array(COLS).fill(null)); par ^= 1;
    genRow(0); yOff -= RH;
    Sound.tone(200, .25, 'triangle', .12, -80); shake = Math.max(shake, 4);
    aimDirty = true;
    checkLose();
  }
  function checkLose() {
    if (state !== 'play') return;
    const lo = lowestRow();
    if (lo >= 0 && ceilRows + lo >= maxRows) loseLevel();
  }

  /* ---------- الفوز والخسارة ---------- */
  function starsFor() {
    const parN = Math.ceil(startCount / 2.6) + 2;
    return shots <= parN ? 3 : shots <= Math.ceil(parN * 1.6) ? 2 : 1;
  }
  function winLevel() {
    state = 'won'; flying = null; aiming = null;
    const stars = starsFor();
    const pr = loadProg(), prev = pr.stars[level] || 0;
    if (stars > prev) pr.stars[level] = stars;
    if (level >= pr.unlocked) pr.unlocked = Math.min(ENDLESS, level + 1);
    if (level >= NL) pr.endless = true;
    store.set('bubblesProg', pr);
    hintShown = true;
    setTimeout(() => {
      if (App.current !== ID || state !== 'won') return;
      for (let i = 0; i < 150; i++) parts.push({ t: 'conf', x: rand(0, W), y: rand(-H * .4, -10), vx: rand(-60, 60), vy: rand(80, 260), rot: rand(0, TAU), vr: rand(-8, 8), life: rand(2.5, 4), age: 0, s: rand(6, 11), c: COL[i % 6].b });
      Sound.win(); vibrate(30);
    }, 500);
    endTimer = setTimeout(() => {
      if (App.current !== ID || state !== 'won') return;
      (winPaint = () => {
        root.querySelector('.wT').textContent = App.t(App.g('أحسنتِ!', 'أحسنت!'), 'Well done!') + ' 🎉';
        root.querySelector('.wS').innerHTML = [1, 2, 3].map(k => `<span class="${k <= stars ? '' : 'off'}">⭐</span>`).join('');
        root.querySelector('.wP').textContent = App.t(`المرحلة ${level} · النقاط ${score} · الرميات ${shots}`, `Level ${level} · Score ${score} · Shots ${shots}`);
        root.querySelector('.wA').textContent = rescued ? App.t(`🐣 ${App.g('حرّرتِ', 'حرّرتَ')} ${rescued === 1 ? 'حيوانًا واحدًا' : rescued === 2 ? 'حيوانين' : rescued <= 10 ? rescued + ' حيوانات' : rescued + ' حيوانًا'}`, `🐣 You freed ${rescued === 1 ? 'one animal' : rescued + ' animals'}`) : '';
        root.querySelector('[data-a="next"]').textContent = level < NL ? App.t('التالي ▶️', 'Next ▶️') : App.t('♾️ بلا نهاية', '♾️ Endless');
      })();
      winOv.classList.add('on');
      if (App.lang === 'en') App.speak('Well done!', 'en'); else App.speak(App.g('أحسنتِ!', 'أحسنت!'));
      if (stars > prev) App.addStars(stars - prev);
      App.achieve('bub_first');
      if (level >= 10) App.achieve('bub_lvl10');
    }, 1700);
  }
  function loseLevel() {
    state = 'lost'; flying = null; aiming = null;
    Sound.lose(); vibrate(40); shake = 8;
    // كل الفقاعات تسقط
    let i = 0;
    for (let r = grid.length - 1; r >= 0; r--) for (let c = 0; c < COLS; c++) {
      const b = grid[r][c]; if (!b) continue;
      falls.push({ x: cellX(r, c), y: rowY(r), c: b.c, a: b.a, vx: rand(-1, 1) * D, vy: rand(-2, 0) * D, rot: 0, vr: rand(-3, 3), delay: .5 + i++ * .015, bounced: false, nofree: false });
      grid[r][c] = null;
    }
    let best = 0, isBest = false;
    if (endless) {
      best = store.get('bubblesEndless', 0);
      if (score > best) { isBest = best > 0 || score > 0; store.set('bubblesEndless', score); }
    }
    endTimer = setTimeout(() => {
      if (App.current !== ID || state !== 'lost') return;
      (losePaint = () => {
        root.querySelector('.lT').textContent = endless ? (isBest ? App.t('🏆 رقم قياسي جديد!', '🏆 New record!') : App.t('♾️ انتهت الجولة', '♾️ Round over')) : App.t('😮 وصلت الفقاعات إلى الخط!', '😮 The bubbles reached the line!');
        root.querySelector('.lB').textContent = endless ? score : '🫧';
        root.querySelector('.lP').textContent = endless ? App.t(`أفضل نتيجة: ${Math.max(best, score)}`, `Best score: ${Math.max(best, score)}`) : App.t(App.g('حاولي مرة أخرى، ستنجحين!', 'حاول مرة أخرى، ستنجح!'), 'Try again, you can do it!');
      })();
      loseOv.classList.add('on');
      if (endless && isBest && score >= 500) App.addStars(clamp(Math.floor(score / 1500), 1, 5));
    }, 1900);
  }

  /* ---------- مؤثرات ---------- */
  function addText(x, y, txt, col, size) { texts.push({ x, y, txt, col, size, age: 0, life: 1.2 }); }
  function burst(x, y, ci) {
    const col = COL[ci];
    for (let i = 0; i < 10; i++) {
      const a = rand(0, TAU), v = rand(.8, 3.2) * D;
      parts.push({ t: i % 3 ? 'drop' : 'spark', x: x + Math.cos(a) * R * .5, y: y + Math.sin(a) * R * .5, vx: Math.cos(a) * v, vy: Math.sin(a) * v - D, rot: 0, vr: 0, life: rand(.35, .7), age: 0, s: rand(.12, .24) * D, c: i % 2 ? col.b : col.l });
    }
    rings.push({ x, y, age: 0, life: .35, c: col.l });
  }
  function freeAnimal(x, y, a) {
    rescued++;
    freed.push({ x, y, a, age: 0, life: 2.4, vx: rand(-.4, .4) * D, ph: rand(0, TAU) });
    Sound.tone(880, .12, 'sine', .1, 400, .05); Sound.tone(1320, .14, 'sine', .08, 300, .14);
  }

  /* ---------- قائمة المراحل ---------- */
  function openLevels() {
    const pr = loadProg();
    const g = root.querySelector('.lvg');
    g.innerHTML = LEVELS.map((L, i) => {
      const n = i + 1, s = pr.stars[n] || 0, lock = n > pr.unlocked;
      return `<button class="lvb${lock ? ' lock' : ''}${n === level && !endless ? ' cur' : ''}" data-l="${n}" aria-label="${App.t('المرحلة', 'Level')} ${n}"><span class="n">${n}</span><span class="e">${L.ic}</span>
        <span class="s">${lock ? '' : [1, 2, 3].map(k => `<i class="${k <= s ? '' : 'off'}">⭐</i>`).join('')}</span></button>`;
    }).join('');
    const eb = root.querySelector('.lvend');
    eb.classList.toggle('lock', !pr.endless);
    const best = store.get('bubblesEndless', 0);
    root.querySelector('.lvendS').textContent = !pr.endless ? '🔒 ' + App.t(App.g('أنهي', 'أنهِ') + ` المرحلة ${NL} لفتحها`, `Finish level ${NL} to unlock`) : (best ? App.t(`أفضل نتيجة: ${best}`, `Best score: ${best}`) : App.t('فقاعات لا تنتهي!', 'Never-ending bubbles!'));
    winOv.classList.remove('on'); loseOv.classList.remove('on'); lvOv.classList.add('on');
  }
  root.querySelector('#bbLv').addEventListener('click', e => {
    const b = e.target.closest('[data-l]'); if (!b) return;
    const n = +b.dataset.l;
    const pr = loadProg();
    if (n >= ENDLESS ? !pr.endless : n > pr.unlocked) { Sound.error(); vibrate(20); b.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 300 }); return; }
    Sound.tap(); startLevel(n);
  });
  function act(a) {
    Sound.tap();
    if (a === 'next') startLevel(Math.min(ENDLESS, level + 1));
    else if (a === 'again') startLevel(level);
    else if (a === 'levels') openLevels();
    else if (a === 'close') { lvOv.classList.remove('on'); if (state === 'won') winOv.classList.add('on'); else if (state === 'lost') loseOv.classList.add('on'); }
  }
  root.querySelectorAll('[data-a]').forEach(b => b.addEventListener('click', () => act(b.dataset.a)));
  root.querySelector('.lvbtn').addEventListener('click', () => { Sound.tap(); openLevels(); });
  const overlayOn = () => lvOv.classList.contains('on') || winOv.classList.contains('on') || loseOv.classList.contains('on');

  /* ---------- الإدخال ---------- */
  const nextPos = () => ({ x: cannonX - D * 2.5, y: cannonY + D * .55 });
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  cv.addEventListener('pointerdown', e => {
    if (App.current !== ID || paused || state !== 'play' || overlayOn()) return;
    const m = pos(e), np = nextPos();
    if (Math.hypot(m.x - np.x, m.y - np.y) < D * .95) { swap(); return; }
    if (Math.hypot(m.x - cannonX, m.y - cannonY) < D * .7) { swap(); return; }
    aiming = { id: e.pointerId };
    try { cv.setPointerCapture(e.pointerId); } catch (er) {}
    setAim(m.x, m.y);
  });
  cv.addEventListener('pointermove', e => {
    if (App.current !== ID || paused || state !== 'play') return;
    if (aiming && e.pointerId === aiming.id) { const m = pos(e); setAim(m.x, m.y); }
    else if (!aiming && e.pointerType === 'mouse') { const m = pos(e); if (m.y < cannonY - D * .3) setAim(m.x, m.y); }
  });
  const endAim = e => {
    if (!aiming || e.pointerId !== aiming.id) return;
    aiming = null;
    const m = pos(e);
    if (e.type === 'pointerup' && m.y < cannonY + D * .2) shoot();
  };
  cv.addEventListener('pointerup', endAim);
  cv.addEventListener('pointercancel', endAim);
  window.addEventListener('keydown', e => {
    if (App.current !== ID || $('#sheetWrap').classList.contains('on')) return;
    if (winOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act('next'); return; }
    if (loseOv.classList.contains('on') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); act('again'); return; }
    if (e.key === 'l' || e.key === 'L') { lvOv.classList.contains('on') ? act('close') : openLevels(); return; }
    if (overlayOn() || state !== 'play' || paused) return;
    if (e.key === 'ArrowLeft') { aimA = clamp(aimA - .045, -Math.PI + .2, -.2); aimDirty = true; e.preventDefault(); }
    else if (e.key === 'ArrowRight') { aimA = clamp(aimA + .045, -Math.PI + .2, -.2); aimDirty = true; e.preventDefault(); }
    else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'Enter') { e.preventDefault(); shoot(); }
    else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S' || e.key === 'x' || e.key === 'X') { e.preventDefault(); swap(); }
  });

  /* ---------- التحديث ---------- */
  function popSound(i) {
    const f = 520 * Math.pow(1.075, Math.min(i, 18));
    Sound.tone(f, .09, 'sine', .13, f * .6); if (i % 2 === 0) Sound.noise(.05, 2200, 3600, .045, 2);
  }
  function update(dt) {
    T += dt;
    yOff *= Math.exp(-dt * 9); if (Math.abs(yOff) < .3) yOff = 0;
    reload = Math.min(1, reload + dt / .22);
    swapA = Math.max(0, swapA - dt * 4); recoil = Math.max(0, recoil - dt * 5); ceilFlash = Math.max(0, ceilFlash - dt * 2);
    shake = Math.max(0, shake - dt * 20);
    const kb = Math.exp(-dt * 14);
    each(b => { b.sq = Math.max(0, b.sq - dt * 2.2); b.ox *= kb; b.oy *= kb; });
    // الفقاعة الطائرة
    if (flying) {
      flying.t = (flying.t || 0) + dt;
      let dist = D * 40 * (1 + flying.t * 1.5) * dt;
      while (flying && dist > 0) {
        const tg = flying.pts[flying.seg + 1];
        if (!tg) { const f = flying; flying = null; land(f.x, f.y, f.c); break; }
        const d = Math.hypot(tg.x - flying.x, tg.y - flying.y);
        if (d <= dist) {
          flying.x = tg.x; flying.y = tg.y; flying.seg++; dist -= d;
          if (tg.bounce) { flying.sq = 1; Sound.tone(900, .04, 'sine', .07, -300); }
        } else { flying.x += (tg.x - flying.x) / d * dist; flying.y += (tg.y - flying.y) / d * dist; dist = 0; }
      }
      if (flying) flying.sq = Math.max(0, flying.sq - dt * 6);
    }
    // الانفجارات المتتابعة
    for (let i = pops.length - 1; i >= 0; i--) {
      const p = pops[i]; p.delay -= dt;
      if (p.delay <= 0) { burst(p.x, p.y, p.c); popSound(p.idx); if (p.a >= 0) freeAnimal(p.x, p.y, p.a); pops.splice(i, 1); }
    }
    // السقوط
    const g = D * 55, floor = cannonY + D * .9;
    let thuds = 0;
    for (let i = falls.length - 1; i >= 0; i--) {
      const f = falls[i];
      if (f.delay > 0) { f.delay -= dt; continue; }
      f.vy += g * dt; f.x += f.vx * dt; f.y += f.vy * dt; f.rot += f.vr * dt;
      if (f.x < FL + R) { f.x = FL + R; f.vx = Math.abs(f.vx) * .6; }
      if (f.x > FL + FW - R) { f.x = FL + FW - R; f.vx = -Math.abs(f.vx) * .6; }
      if (!f.bounced && f.y > floor) {
        f.y = floor; f.vy = -Math.abs(f.vy) * .42; f.vx *= 1.3; f.bounced = true;
        if (thuds++ < 2) { Sound.tone(rand(300, 420), .07, 'sine', .08, 200); }
        if (f.a >= 0) { burst(f.x, f.y, f.c); freeAnimal(f.x, f.y, f.a); falls.splice(i, 1); continue; }
      }
      if (f.y > H + D) falls.splice(i, 1);
    }
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.age += dt;
      if (q.age > q.life) { parts.splice(i, 1); continue; }
      if (q.t === 'conf') { q.vy = Math.min(q.vy + 120 * dt, 260); q.vx += Math.sin(T * 3 + i) * 40 * dt; }
      else { q.vx *= 1 - dt * 3; q.vy = q.vy * (1 - dt * 2) + D * 14 * dt; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.rot += q.vr * dt;
    }
    for (let i = rings.length - 1; i >= 0; i--) { rings[i].age += dt; if (rings[i].age > rings[i].life) rings.splice(i, 1); }
    for (let i = texts.length - 1; i >= 0; i--) { const t = texts[i]; t.age += dt; t.y -= D * 1.1 * dt; if (t.age > t.life) texts.splice(i, 1); }
    for (let i = freed.length - 1; i >= 0; i--) { const a = freed[i]; a.age += dt; a.y -= D * (1.2 + a.age * 1.6) * dt; a.x += a.vx * dt + Math.sin(a.age * 5 + a.ph) * D * .6 * dt; if (a.age > a.life) freed.splice(i, 1); }
    for (const b of bgBubbles) { b.y -= b.v * dt; if (b.y < -.05) { b.y = 1.05; b.x = Math.random(); } }
    if (state === 'play') {
      const lo = lowestRow();
      warnPulse = lo >= 0 && maxRows - (ceilRows + lo) <= 2 ? 1 : 0;
    }
  }

  /* ---------- الرسم ---------- */
  function drawSpr(ci, a, x, y, s, rot) {
    const img = a >= 0 ? sprA[ci][a] : spr[ci], sz = D * 1.04 * s;
    if (rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.drawImage(img, -sz / 2, -sz / 2, sz, sz); ctx.restore(); }
    else ctx.drawImage(img, x - sz / 2, y - sz / 2, sz, sz);
  }
  function drawCeiling() {
    const pb = fieldTop + Math.max(0, ceilRows * RH + yOff);
    const x0 = FL - 6, w = FW + 12;
    ctx.save();
    ctx.shadowColor = 'rgba(70,50,160,.3)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
    let g = ctx.createLinearGradient(0, 0, 0, pb);
    g.addColorStop(0, '#C8B9FF'); g.addColorStop(1, ceilFlash > 0 ? '#C5A9FF' : '#A890F7');
    ctx.fillStyle = g; ctx.beginPath(); ctx.rect(x0, -10, w, pb + 10); ctx.fill();
    ctx.restore();
    ctx.save(); ctx.beginPath(); ctx.rect(x0, -10, w, pb + 10); ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,.13)'; ctx.lineWidth = D * .35;
    for (let xx = x0 - pb; xx < x0 + w + 20; xx += D * .9) { ctx.beginPath(); ctx.moveTo(xx, -10); ctx.lineTo(xx + pb + 10, pb); ctx.stroke(); }
    // نجوم صغيرة على اللوح
    if (pb - fieldTop > -1) {
      const R2 = rng(3);
      for (let i = 0; i < 14; i++) { const sx = x0 + R2() * w, sy = R2() * (pb - D * .5); ctx.save(); ctx.translate(sx, sy); ctx.rotate(T * .3 + i); ctx.fillStyle = `rgba(255,255,255,${.35 + .25 * Math.sin(T * 2 + i)})`; starPath(ctx, D * (.1 + R2() * .1), .45); ctx.fill(); ctx.restore(); }
    }
    ctx.restore();
    if (ceilFlash > 0) { ctx.fillStyle = `rgba(255,255,255,${ceilFlash * .35})`; ctx.fillRect(x0, 0, w, pb); }
    // حافة مسننة كالغيمة
    ctx.fillStyle = '#F4F0FF';
    ctx.fillRect(x0, pb - D * .14, w, D * .14);
    ctx.beginPath();
    const n = COLS * 2, sw = w / n;
    for (let i = 0; i < n; i++) { ctx.moveTo(x0 + i * sw + sw, pb); ctx.arc(x0 + i * sw + sw / 2, pb, sw / 2, 0, Math.PI); }
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,100,210,.35)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x0, pb - D * .14); ctx.lineTo(x0 + w, pb - D * .14); ctx.stroke();
  }
  function drawDanger() {
    const pulse = warnPulse ? .5 + .5 * Math.sin(T * 9) : 0;
    ctx.save();
    ctx.setLineDash([D * .3, D * .22]); ctx.lineDashOffset = -T * D * .6;
    ctx.strokeStyle = warnPulse ? `rgba(255,60,100,${.6 + pulse * .4})` : 'rgba(255,110,150,.45)';
    ctx.lineWidth = warnPulse ? 3 + pulse * 2 : 2.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(FL, dangerY); ctx.lineTo(FL + FW, dangerY); ctx.stroke();
    ctx.restore();
    if (warnPulse) { const g = ctx.createLinearGradient(0, dangerY - D * 2, 0, dangerY); g.addColorStop(0, 'rgba(255,60,100,0)'); g.addColorStop(1, `rgba(255,60,100,${.12 + pulse * .1})`); ctx.fillStyle = g; ctx.fillRect(FL, dangerY - D * 2, FW, D * 2); }
  }
  function drawAim() {
    if (state !== 'play' || flying || !cur || overlayOn()) return;
    aimPath = trace(aimA, 2);
    const pts = aimPath.pts, col = COL[cur.c];
    const sp = D * .55, off = (T * D * 2.2) % sp;
    let total = 0;
    ctx.save();
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], L = Math.hypot(b.x - a.x, b.y - a.y);
      for (let d = (sp - ((total - off + sp * 1000) % sp)) % sp; d <= L; d += sp) {
        const k = total + d; if (k < D * .9) continue;
        const x = a.x + (b.x - a.x) * d / L, y = a.y + (b.y - a.y) * d / L;
        ctx.globalAlpha = Math.max(.2, 1 - k / (H * 1.4));
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, D * .13, 0, TAU); ctx.fill();
        ctx.fillStyle = col.b; ctx.beginPath(); ctx.arc(x, y, D * .085, 0, TAU); ctx.fill();
      }
      total += L;
    }
    ctx.restore();
    if (aimPath.end) {
      const cell = snapCell(aimPath.end.x, aimPath.end.y);
      if (cell) {
        const x = cellX(cell.r, cell.c), y = rowY(cell.r);
        ctx.save(); ctx.globalAlpha = .45 + .15 * Math.sin(T * 6);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.setLineDash([D * .16, D * .12]);
        ctx.fillStyle = col.b + '55';
        ctx.beginPath(); ctx.arc(x, y, R * .9, 0, TAU); ctx.fill(); ctx.stroke(); ctx.restore();
      }
    }
  }
  function drawCannon() {
    const cx = cannonX, cy = cannonY;
    ctx.save(); ctx.fillStyle = 'rgba(120,80,40,.18)'; ctx.beginPath(); ctx.ellipse(cx, cy + D * 1.32, D * 1.5, D * .26, 0, 0, TAU); ctx.fill(); ctx.restore();
    // الماسورة
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(aimA + Math.PI / 2);
    const rk = recoil * D * .28, bw = D * .8, bl = D * 1.55;
    let g = ctx.createLinearGradient(-bw / 2, 0, bw / 2, 0);
    g.addColorStop(0, '#4D8BEA'); g.addColorStop(.32, '#D4ECFF'); g.addColorStop(.55, '#7DBBFF'); g.addColorStop(1, '#3466CC');
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-bw / 2, -bl + rk, bw, bl, bw * .28); ctx.fill();
    ctx.strokeStyle = 'rgba(30,60,150,.45)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(-bw / 2 + 2, -bl * .62 + rk, bw - 4, D * .1);
    g = ctx.createLinearGradient(-bw * .62, 0, bw * .62, 0);
    g.addColorStop(0, '#F2A900'); g.addColorStop(.35, '#FFF1A6'); g.addColorStop(1, '#E39500');
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-bw * .62, -bl + rk - D * .1, bw * 1.24, D * .34, D * .15); ctx.fill();
    ctx.strokeStyle = 'rgba(150,90,0,.4)'; ctx.stroke();
    ctx.restore();
    // العجلات
    for (const s of [-1, 1]) {
      const wx = cx + s * D * 1.0, wy = cy + D * 1.12, a = (s > 0 ? 1 : -1) * aimA * 2;
      g = ctx.createRadialGradient(wx - D * .1, wy - D * .1, 1, wx, wy, D * .36);
      g.addColorStop(0, '#A898FF'); g.addColorStop(1, '#5C49C8');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(wx, wy, D * .35, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 2;
      ctx.beginPath(); for (let k = 0; k < 3; k++) { const aa = a + k * TAU / 3; ctx.moveTo(wx, wy); ctx.lineTo(wx + Math.cos(aa) * D * .24, wy + Math.sin(aa) * D * .24); } ctx.stroke();
      ctx.fillStyle = '#FFE36B'; ctx.beginPath(); ctx.arc(wx, wy, D * .1, 0, TAU); ctx.fill();
    }
    // الجسم اللطيف
    const by = cy + D * .62, sq = 1 + recoil * .06;
    ctx.save(); ctx.translate(cx, by); ctx.scale(sq, 2 - sq);
    g = ctx.createRadialGradient(-D * .4, -D * .45, D * .1, 0, 0, D * 1.3);
    g.addColorStop(0, '#FFD6EA'); g.addColorStop(.5, '#FF8EC0'); g.addColorStop(1, '#E2508F');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, D * 1.22, D * .82, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(170,40,100,.35)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.ellipse(-D * .55, -D * .45, D * .32, D * .13, -.4, 0, TAU); ctx.fill();
    // الوجه
    const px = Math.cos(aimA) * D * .06, py = Math.sin(aimA) * D * .05;
    const blink = (T % 4) > 3.88 ? .15 : 1;
    for (const s of [-1, 1]) {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(s * D * .38, D * .02, D * .17, D * .19 * blink, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = '#2A1B3C'; ctx.beginPath(); ctx.ellipse(s * D * .38 + px, D * .04 + py, D * .1, D * .11 * blink, 0, 0, TAU); ctx.fill();
      if (blink > .5) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s * D * .38 + px - D * .035, D * .0 + py, D * .035, 0, TAU); ctx.fill(); }
      ctx.fillStyle = 'rgba(255,90,140,.55)'; ctx.beginPath(); ctx.ellipse(s * D * .72, D * .26, D * .16, D * .09, 0, 0, TAU); ctx.fill();
    }
    ctx.strokeStyle = '#8A1F52'; ctx.lineWidth = D * .07; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, D * .22, D * .14, .2 * Math.PI, .8 * Math.PI); ctx.stroke();
    ctx.restore();
    // الفقاعة الجاهزة
    const np = nextPos();
    if (cur && state === 'play') {
      const t = ease.outBack(Math.min(1, reload));
      const x = np.x + (cx - np.x) * t, y = np.y + (cy - np.y) * t;
      const s = (.75 + .25 * t) * (1 + Math.sin(swapA * Math.PI * 2) * .15 * swapA);
      drawSpr(cur.c, -1, x, y, s);
    }
    // الفقاعة التالية على صدفة
    ctx.save(); ctx.translate(np.x, np.y + D * .42);
    g = ctx.createLinearGradient(0, -D * .2, 0, D * .25); g.addColorStop(0, '#FFF3D4'); g.addColorStop(1, '#F5C98A');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, D * .62, D * .22, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(190,130,60,.5)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();
    if (nxt && state === 'play' && reload >= 1) drawSpr(nxt.c, -1, np.x, np.y + Math.sin(T * 3) * 1.5, .72 * (1 + swapA * .2));
    else if (nxt && state === 'play') drawSpr(nxt.c, -1, np.x, np.y, .72 * Math.min(1, reload));
    // سهم التبديل
    ctx.save(); ctx.translate(np.x, np.y); ctx.rotate(-swapA * Math.PI);
    ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = D * .08; ctx.lineCap = 'round';
    for (const s of [0, Math.PI]) {
      ctx.beginPath(); ctx.arc(0, 0, D * .52, s + .35, s + 1.35); ctx.stroke();
      const ax = Math.cos(s + 1.35) * D * .52, ay = Math.sin(s + 1.35) * D * .52;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + Math.cos(s + 1.35 - 2.2) * D * .14, ay + Math.sin(s + 1.35 - 2.2) * D * .14); ctx.stroke();
    }
    ctx.restore();
    // نقاط الرميات قبل نزول السقف
    if (state === 'play' || state === 'won') {
      const n = missMax, gap = D * .4, x0 = cx + D * 1.85, y0 = cy + D * .62;
      for (let i = 0; i < n; i++) {
        const x = x0 + (i % 4) * gap, y = y0 + Math.floor(i / 4) * gap - (n > 4 ? gap / 2 : 0);
        const on = i < misses, last = misses === n - 1;
        ctx.beginPath(); ctx.arc(x, y, D * .13 * (on && last ? 1 + .15 * Math.sin(T * 12) : 1), 0, TAU);
        ctx.fillStyle = on ? (last ? '#FF3D6E' : '#FF8FB0') : 'rgba(255,255,255,.75)'; ctx.fill();
        ctx.strokeStyle = on ? 'rgba(180,30,80,.5)' : 'rgba(120,100,210,.45)'; ctx.lineWidth = 1.5; ctx.stroke();
      }
    }
  }
  function render() {
    ctx.save();
    ctx.fillStyle = '#DCEBFF'; ctx.fillRect(0, 0, W, H);
    if (shake > 0) ctx.translate(rand(-shake, shake) * .6, rand(-shake, shake) * .6);
    if (bgLayer) ctx.drawImage(bgLayer, 0, 0, W, H);
    // فقاعات الخلفية
    for (const b of bgBubbles) {
      const x = b.x * W + Math.sin(T * .8 + b.ph) * 10, y = b.y * H;
      ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.5; ctx.fillStyle = 'rgba(255,255,255,.12)';
      ctx.beginPath(); ctx.arc(x, y, b.r, 0, TAU); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(x - b.r * .35, y - b.r * .35, b.r * .22, 0, TAU); ctx.fill();
    }
    drawDanger();
    // الشبكة
    const warn = state === 'play' && misses === missMax - 1;
    for (let r = 0; r < grid.length; r++) for (let c = 0; c < COLS; c++) {
      const b = grid[r][c]; if (!b) continue;
      let x = cellX(r, c) + b.ox, y = rowY(r) + b.oy;
      if (warn) x += Math.sin(T * 40 + r * 1.3) * 1.2;
      const s = 1 + Math.sin(b.sq * Math.PI * 3) * .1 * b.sq;
      drawSpr(b.c, b.a, x, y, s);
    }
    for (const p of pops) { const k = clamp(1 - p.delay / .08, 0, 1); drawSpr(p.c, p.a, p.x, p.y, 1 + k * .2 + Math.sin(T * 50) * .03); }
    for (const f of falls) drawSpr(f.c, f.a, f.x, f.y, 1, f.rot);
    drawCeiling();
    drawAim();
    drawCannon();
    if (flying) {
      const s = 1 + flying.sq * .12;
      ctx.save(); ctx.globalAlpha = .25; const p0 = flying.pts[flying.seg];
      if (p0) { const dx = flying.x - p0.x, dy = flying.y - p0.y, L = Math.hypot(dx, dy) || 1; for (let k = 1; k <= 2; k++) drawSpr(flying.c, -1, flying.x - dx / L * Math.min(L, R * .8 * k), flying.y - dy / L * Math.min(L, R * .8 * k), 1 - k * .1); }
      ctx.restore();
      drawSpr(flying.c, -1, flying.x, flying.y, s);
    }
    for (const r of rings) {
      const t = r.age / r.life;
      ctx.save(); ctx.globalAlpha = 1 - t; ctx.strokeStyle = r.c; ctx.lineWidth = 4 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, R * (.8 + t * 1.1), 0, TAU); ctx.stroke(); ctx.restore();
    }
    for (const q of parts) {
      const a = 1 - q.age / q.life;
      ctx.save(); ctx.globalAlpha = q.t === 'conf' ? Math.min(1, a * 3) : a; ctx.translate(q.x, q.y); ctx.rotate(q.rot); ctx.fillStyle = q.c;
      if (q.t === 'spark') { starPath(ctx, q.s * (.6 + a * .6), .45); ctx.fill(); }
      else if (q.t === 'drop') { ctx.beginPath(); ctx.arc(0, 0, q.s * (.4 + a * .6), 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(-q.s * .25, -q.s * .25, q.s * .2, 0, TAU); ctx.fill(); }
      else { ctx.scale(1, Math.cos(q.age * 9 + q.rot)); ctx.fillRect(-q.s / 2, -q.s * .3, q.s, q.s * .6); }
      ctx.restore();
    }
    // الحيوانات المحرّرة
    for (const a of freed) {
      const t = a.age / a.life, sIn = ease.outBack(Math.min(1, a.age / .35));
      ctx.save(); ctx.globalAlpha = t > .75 ? (1 - t) / .25 : 1;
      ctx.translate(a.x, a.y); ctx.rotate(Math.sin(a.age * 6 + a.ph) * .18); ctx.scale(sIn, sIn);
      drawAnimal(ctx, a.a, D * .36);
      ctx.translate(D * .38, -D * .62); const hs = 1 + Math.sin(a.age * 10) * .12; ctx.scale(hs, hs);
      ctx.fillStyle = '#FF4F7A'; heartPath(ctx, D * .17); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.beginPath(); ctx.arc(-D * .06, -D * .06, D * .035, 0, TAU); ctx.fill();
      ctx.restore();
    }
    // نصوص النقاط
    for (const t of texts) {
      const k = t.age / t.life, s = ease.outBack(Math.min(1, t.age / .25));
      ctx.save(); ctx.globalAlpha = k > .7 ? (1 - k) / .3 : 1; ctx.translate(t.x, t.y); ctx.scale(s, s);
      ctx.font = `900 ${Math.round(D * .62 * t.size)}px ${FONT}`; ctx.direction = 'ltr'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 5; ctx.strokeStyle = '#fff'; ctx.lineJoin = 'round'; ctx.strokeText(t.txt, 0, 0);
      ctx.fillStyle = t.col; ctx.fillText(t.txt, 0, 0);
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
    if (App.current !== ID) return;
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      if (flying) { nxt = cur; cur = { c: flying.c }; flying = null; shots--; reload = 1; }
      pops.forEach(p => { p.delay = 0; }); falls = []; parts = parts.filter(p => p.t === 'conf');
      layout(); if (!running) render();
    }, 80);
  });

  /* ---------- أيقونة القائمة ---------- */
  function icon(c, s) {
    IK.bg(c, s, ['#D8F7FF', '#6ED3F7', '#2A8FE0'], { seed: 8 });
    IK.ground(c, s, s * .84, '#FFE6B3', '#F7C46B');
    const r = s * .118;
    const cluster = [[.27, .2, 0], [.5, .19, 1], [.73, .2, 3], [.385, .39, 5], [.615, .39, 0], [.5, .58, 2]];
    const cx = s * .5, cy = s * .82;
    IK.shadow(c, cx, cy + s * .12, s * .22, s * .04, .3);
    IK.sticker(c, s, c => {
      for (const [x, y, ci] of cluster) { c.save(); c.translate(x * s, y * s); paintBubble(c, ci, ci === 1 ? 0 : -1, r); c.restore(); }
      c.save(); c.translate(cx, cy - s * .04); c.rotate(-.35);
      let g = c.createLinearGradient(-s * .07, 0, s * .07, 0); g.addColorStop(0, '#4D8BEA'); g.addColorStop(.35, '#D4ECFF'); g.addColorStop(1, '#3466CC');
      c.fillStyle = g; c.beginPath(); c.roundRect(-s * .07, -s * .21, s * .14, s * .21, s * .045); c.fill();
      c.fillStyle = '#FFC93C'; c.beginPath(); c.roundRect(-s * .09, -s * .235, s * .18, s * .06, s * .028); c.fill();
      c.restore();
      g = c.createRadialGradient(cx - s * .05, cy - s * .02, 2, cx, cy + s * .04, s * .2);
      g.addColorStop(0, '#FFE0F0'); g.addColorStop(.55, '#FF8EC0'); g.addColorStop(1, '#E2508F');
      c.fillStyle = g; c.beginPath(); c.ellipse(cx, cy + s * .05, s * .23, s * .14, 0, 0, IK.TAU); c.fill();
      for (const k of [-1, 1]) { c.fillStyle = '#fff'; c.beginPath(); c.arc(cx + k * s * .075, cy + s * .06, s * .034, 0, IK.TAU); c.fill(); c.fillStyle = '#2A1B3C'; c.beginPath(); c.arc(cx + k * s * .075, cy + s * .055, s * .019, 0, IK.TAU); c.fill(); }
      c.save(); c.translate(cx, cy - s * .045); paintBubble(c, 3, -1, s * .065); c.restore();
    });
  }

  /* ---------- التسجيل ---------- */
  App.register({
    id: ID, title: 'مدفع الفقاعات', titleEn: 'Bubble Shooter', icon2: '🫧', isNew: false, music: 'bubbles',
    desc: () => App.g('صوّبي وفجّري الفقاعات وحرّري الحيوانات', 'صوّب وفجّر الفقاعات وحرّر الحيوانات'),
    descEn: () => 'Aim, pop the bubbles and free the animals',
    helpEn: () => [
      '👆 Drag your finger to aim, then let go to shoot the bubble (it bounces off the walls!)',
      '🫧 Match 3 or more bubbles of the same color to pop them, and the hanging ones fall too',
      '🐣 Free the little animals trapped inside the bubbles',
      '🔄 Tap the next bubble to swap it',
      '⚠️ Every few shots without a pop the ceiling comes down — don\'t let the bubbles reach the line!'
    ],
    help: () => [
      '👆 ' + App.g('اسحبي إصبعك للتصويب ثم اتركيه', 'اسحب إصبعك للتصويب ثم اتركه') + ' لإطلاق الفقاعة (تقفز عن الجدران!)',
      '🫧 ' + App.g('اجمعي', 'اجمع') + ' 3 فقاعات أو أكثر من اللون نفسه لتنفجر، والمعلّقة تسقط معها',
      '🐣 ' + App.g('حرّري', 'حرّر') + ' الحيوانات الصغيرة المحبوسة داخل الفقاعات',
      '🔄 ' + App.g('المسي', 'المس') + ' الفقاعة التالية لتبديلها',
      '⚠️ كل بضع رميات بلا انفجار ينزل السقف، فلا ' + App.g('تدعي', 'تدع') + ' الفقاعات تصل إلى الخط!'
    ],
    icon,
    best() {
      const pr = loadProg(); const ks = Object.keys(pr.stars).map(Number).filter(n => pr.stars[n]);
      if (!ks.length) return '';
      return `🏆 ${App.t('المرحلة', 'Level')} ${Math.max(...ks)} · ⭐ ${ks.reduce((a, n) => a + pr.stars[n], 0)}`;
    },
    onLang() {
      i18n(); hintT.textContent = hintText();
      if (winOv.classList.contains('on') && winPaint) winPaint();
      if (loseOv.classList.contains('on') && losePaint) losePaint();
      if (lvOv.classList.contains('on')) openLevels();
    },
    enter() {
      i18n(); hintT.textContent = hintText();
      paused = false;
      layout();
      startLevel(Math.min(loadProg().unlocked, ENDLESS));
      render();
      startLoop();
    },
    leave() { stopLoop(); clearTimeout(endTimer); aiming = null; [winOv, loseOv, lvOv].forEach(o => o.classList.remove('on')); },
    pause() { paused = true; aiming = null; },
    resume() { paused = false; last = performance.now(); },
    back() {
      if (lvOv.classList.contains('on')) { act('close'); return true; }
      return false;
    },
    /* للاختبار الآلي فقط */
    _dbg: {
      st: () => ({ state, level, endless, count: count(), shots, score, misses, missMax, ceilRows, maxRows, lowest: lowestRow(), cur: cur && cur.c, nxt: nxt && nxt.c, flying: !!flying, D, rescued, yOff }),
      start: n => startLevel(n),
      aim: a => { aimA = a; },
      shoot: () => shoot(),
      push: () => pushCeiling(),
      bestAngle() {
        if (!cur) return null;
        let best = null;
        for (let a = -Math.PI + .2; a < -.2; a += .006) {
          const tr = trace(a, 80); if (!tr.end) continue;
          const cell = snapCell(tr.end.x, tr.end.y); if (!cell) continue;
          ensureRow(cell.r); grid[cell.r][cell.c] = mkCell(cur.c, -1);
          const seen = new Set([cell.r + ',' + cell.c]), q = [[cell.r, cell.c]];
          for (let i = 0; i < q.length; i++) for (const [rr, cc] of neighbors(q[i][0], q[i][1])) { const n = get(rr, cc), k = rr + ',' + cc; if (n && n.c === cur.c && !seen.has(k)) { seen.add(k); q.push([rr, cc]); } }
          grid[cell.r][cell.c] = null; trimRows();
          const sc = (q.length >= 3 ? q.length * 10 : q.length) - cell.r * .01;
          if (!best || sc > best.sc) best = { a, sc };
        }
        return best && best.a;
      }
    }
  });
})();
