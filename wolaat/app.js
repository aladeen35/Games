/* ============================================================================
   ولعت — الواجهة والربط
   شاشتان: لوحة تحكم الحكم (يرى كل شيء ويمنح النقاط) وشاشة اللاعب (نرده وكروته).
   ============================================================================ */
(function () {
  'use strict';
  const W = window.Wolaat;
  const NET = window.WolaatNet;
  const SAVE = 'wolaat:save';
  const EXTRA = 'wolaat:extraCards';
  const PREFS = 'wolaat:prefs';
  const CIDK = 'wolaat:cid';

  /* ═══════════════════════════ أدوات صغيرة ═══════════════════════════ */
  const $ = (id) => document.getElementById(id);
  const esc = (t) => String(t == null ? '' : t)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const AR = (n) => String(n);
  function el(tag, cls, html) {
    const d = document.createElement(tag);
    if (cls) d.className = cls;
    if (html != null) d.innerHTML = html;
    return d;
  }
  function toast(msg, ms) {
    const t = el('div', '', esc(msg));
    $('toast').appendChild(t);
    setTimeout(() => { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 320); }, ms || 2400);
  }
  function dialog(title, body, btns) {
    $('m-title').innerHTML = title;
    $('m-body').innerHTML = body;
    const box = $('m-btns'); box.innerHTML = '';
    (btns || [{ label: 'تمام' }]).forEach((b) => {
      const x = el('button', 'btn ' + (b.cls || 'ghost'), b.label);
      x.onclick = () => { if (!b.keep) closeDialog(); if (b.fn) b.fn(); };
      box.appendChild(x);
    });
    $('modal').classList.add('show');
  }
  const closeDialog = () => $('modal').classList.remove('show');
  $('modal').addEventListener('click', (e) => { if (e.target.id === 'modal') closeDialog(); });

  const prefs = Object.assign({ sound: true }, readJSON(PREFS) || {});
  function readJSON(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function writeJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  const savePrefs = () => writeJSON(PREFS, prefs);

  /* ═══════════════════════════ الأصوات (بلا ملفات) ═══════════════════════ */
  const Snd = {
    ctx: null,
    ready() {
      if (!prefs.sound) return null;
      if (!this.ctx) { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; this.ctx = new C(); }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },
    tone(f, at, dur, type, vol) {
      const c = this.ready(); if (!c) return;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, c.currentTime + at);
      g.gain.linearRampToValueAtTime(vol == null ? .18 : vol, c.currentTime + at + .015);
      g.gain.exponentialRampToValueAtTime(.0001, c.currentTime + at + dur);
      o.connect(g); g.connect(c.destination);
      o.start(c.currentTime + at); o.stop(c.currentTime + at + dur + .02);
    },
    noise(at, dur, vol, hp) {
      const c = this.ready(); if (!c) return;
      const n = Math.floor(c.sampleRate * dur);
      const b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = c.createBufferSource(); src.buffer = b;
      const f = c.createBiquadFilter(); f.type = hp ? 'highpass' : 'lowpass'; f.frequency.value = hp || 900;
      const g = c.createGain(); g.gain.value = vol == null ? .2 : vol;
      src.connect(f); f.connect(g); g.connect(c.destination);
      src.start(c.currentTime + at);
    },
    play(name) {
      if (!prefs.sound) return;
      switch (name) {
        case 'dice':    for (let i = 0; i < 5; i++) this.noise(i * .07, .06, .11, 2600); break;
        case 'card':    this.tone(760, 0, .09, 'triangle', .13); this.tone(1150, .06, .1, 'triangle', .1); break;
        case 'good':    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, i * .07, .3, 'triangle', .16)); break;
        case 'partial': this.tone(523, 0, .2, 'triangle', .15); this.tone(659, .09, .26, 'triangle', .13); break;
        case 'bad':     [392, 330, 247].forEach((f, i) => this.tone(f, i * .08, .3, 'sawtooth', .12)); break;
        case 'hababa':  this.tone(90, 0, .55, 'sawtooth', .25); this.noise(0, .5, .22, 0);
                        [660, 880, 1320].forEach((f, i) => this.tone(f, .1 + i * .05, .3, 'square', .09)); break;
        case 'request': this.tone(880, 0, .1, 'square', .12); this.tone(660, .1, .14, 'square', .1); break;
        case 'final':   [440, 554, 659, 880].forEach((f, i) => this.tone(f, i * .1, .45, 'sawtooth', .13)); break;
        case 'win':     [523, 659, 784, 1046, 1318].forEach((f, i) => this.tone(f, i * .11, .55, 'triangle', .18));
                        this.noise(.1, .5, .12, 3000); break;
        case 'start':   [392, 523, 659].forEach((f, i) => this.tone(f, i * .09, .35, 'triangle', .16)); break;
        case 'tick':    this.tone(1400, 0, .05, 'square', .09); break;
        case 'tile':    this.tone(520, 0, .1, 'sine', .12); break;
        case 'join':    this.tone(680, 0, .1, 'triangle', .12); this.tone(920, .07, .12, 'triangle', .1); break;
      }
    },
  };

  /* ═══════════════════════════ مؤثرات بصرية ═══════════════════════════ */
  const FX = (function () {
    const cv = $('fx'); const cx = cv.getContext('2d');
    let parts = [], raf = 0;
    function size() { cv.width = innerWidth; cv.height = innerHeight; }
    addEventListener('resize', size); size();
    function loop() {
      cx.clearRect(0, 0, cv.width, cv.height);
      parts = parts.filter((p) => p.life > 0);
      parts.forEach((p) => {
        p.life--; p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= .99; p.r += p.vr;
        cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.globalAlpha = Math.max(0, Math.min(1, p.life / 28));
        cx.fillStyle = p.c;
        if (p.shape === 'c') { cx.beginPath(); cx.arc(0, 0, p.s, 0, 7); cx.fill(); }
        else cx.fillRect(-p.s, -p.s / 2, p.s * 2, p.s);
        cx.restore();
      });
      if (parts.length) raf = requestAnimationFrame(loop);
      else { cancelAnimationFrame(raf); raf = 0; cx.clearRect(0, 0, cv.width, cv.height); }
    }
    function push(list) { parts = parts.concat(list); if (!raf) raf = requestAnimationFrame(loop); }
    return {
      confetti(n) {
        const cols = ['#F2B21A', '#FFD860', '#2E9E5B', '#2F6FB5', '#C6342E', '#FBF0DC'];
        push(Array.from({ length: n || 90 }, () => ({
          x: Math.random() * cv.width, y: -20 - Math.random() * 90,
          vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 4, g: .06,
          s: 3 + Math.random() * 5, r: Math.random() * 6, vr: (Math.random() - .5) * .3,
          life: 90 + Math.random() * 70, c: cols[Math.floor(Math.random() * cols.length)], shape: Math.random() < .4 ? 'c' : 'r',
        })));
      },
      burst() {
        const cx0 = cv.width / 2, cy0 = cv.height / 2;
        const cols = ['#FFD860', '#F2B21A', '#E8762C', '#C6342E', '#FFF3D6'];
        push(Array.from({ length: 70 }, () => {
          const a = Math.random() * 7, sp = 3 + Math.random() * 10;
          return { x: cx0, y: cy0, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, g: .12,
            s: 3 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .5,
            life: 40 + Math.random() * 30, c: cols[Math.floor(Math.random() * cols.length)], shape: Math.random() < .6 ? 'c' : 'r' };
        }));
      },
    };
  })();

  /* ═══════════════════════════ حالة التطبيق ═══════════════════════════ */
  let role = null;            /* 'judge' | 'player' */
  let S = null;               /* الحالة (كاملة عند الحكم، منقّاة عند اللاعب) */
  let host = null, client = null;
  let myPid = null;           /* هوية اللاعب في وضع اللاعب */
  let soloPid = null;         /* في وضع الجهاز الواحد: شاشة أي لاعب مفتوحة */
  let undoStack = [];
  let setupPlayers = [];      /* لاعبون يضيفهم الحكم قبل البدء */
  let cfg = { mode: 'solo', target: 50, judgeName: '', sealed: false };
  let lastCue = null, rollingUntil = 0, netMsg = '';
  let picking = null;         /* { kind:'tile'|'player', cb } */
  let awardVal = 0, awardKey = '';

  const ICON = { green: '🐆', orange: '🦌', red: '🦁', blue: '🦅', purple: '🐈‍⬛', gold: '🐕' };
  const hexOf = (c) => (W.COLORS.find((x) => x.id === c) || W.COLORS[0]).hex;
  const iconOf = (c) => ICON[c] || '🐕';
  /* هوية العميل لكل نافذة على حدة (sessionStorage): تصمد أمام تحديث الصفحة،
     ولا تتصادم لو فتح نفس الجهاز أكثر من نافذة لاعب في وضع «نوافذ متعددة». */
  const cid = (function () {
    let v = null;
    try { v = sessionStorage.getItem(CIDK); } catch (e) {}
    if (!v) {
      v = 'c' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
      try { sessionStorage.setItem(CIDK, v); } catch (e) {}
    }
    return v;
  })();

  /* الكروت المضافة على هذا الجهاز */
  (function loadExtra() {
    const x = readJSON(EXTRA);
    if (x) { window.WOLAAT_EXTRA_CARDS = x; W.refreshCards(); }
  })();

  /* ═══════════════════════════ التنقّل بين الشاشات ═══════════════════════ */
  function show(id) {
    picking = null;
    document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === id));
    document.body.classList.toggle('needs-landscape', id === 'v-judge' || id === 'v-play');
    if (id === 'v-judge') { buildBoard($('jz-board')); renderJudge(); }
    if (id === 'v-play')  { buildBoard($('pl-board')); renderPlay(); }
  }
  document.querySelectorAll('[data-go]').forEach((b) => b.onclick = () => show(b.dataset.go));

  /* ═══════════════════════════ الرقعة ═══════════════════════════ */
  const MID_SVG = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="wnile" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#6BC3E0"/><stop offset="1" stop-color="#2A7CA6"/></linearGradient>
      <linearGradient id="wpyr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#EBD3A4"/><stop offset="1" stop-color="#9E7442"/></linearGradient>
      <linearGradient id="wsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#F6E3BC" stop-opacity=".9"/><stop offset="1" stop-color="#E9CB99" stop-opacity="0"/></linearGradient>
    </defs>
    <rect x="0" y="0" width="100" height="46" fill="url(#wsky)"/>
    <circle cx="24" cy="20" r="7" fill="#F6C860" opacity=".55"/>

    <!-- الأهرامات النوبية -->
    <g fill="url(#wpyr)">
      <path d="M58 52 L68 28 L78 52 Z"/><path d="M74 52 L81 35 L88 52 Z"/><path d="M48 52 L55 37 L62 52 Z"/>
    </g>
    <g stroke="#8A5230" stroke-width=".5" fill="none" opacity=".5">
      <path d="M68 28 V52"/><path d="M81 35 V52"/><path d="M55 37 V52"/></g>

    <!-- النيل -->
    <path d="M0 58 C20 50 34 66 52 58 C70 50 84 66 100 58 L100 80 C84 88 70 72 52 80 C34 88 20 72 0 80 Z"
          fill="url(#wnile)" opacity=".88"/>
    <path d="M0 62 C20 54 34 70 52 62 C70 54 84 70 100 62" fill="none" stroke="#CDEBF8" stroke-width=".6" opacity=".65"/>
    <path d="M0 73 C20 65 34 81 52 73 C70 65 84 81 100 73" fill="none" stroke="#CDEBF8" stroke-width=".45" opacity=".4"/>

    <!-- مركب نيلي -->
    <g><path d="M40 68 L47 54 L47 68 Z" fill="#FBF0DC"/><path d="M48 56 L54 68 L48 68 Z" fill="#F2E0C0"/>
       <path d="M47 52 V68" stroke="#8A5230" stroke-width=".55"/>
       <path d="M36 68 q11 5 22 0 q-11 4 -22 0z" fill="#7A4222"/></g>

    <!-- نخلة -->
    <g fill="#6E8F3A"><path d="M10 40 q5 -11 11 -2 q-6 -5 -11 2z"/><path d="M10 40 q11 -7 13 3 q-7 -7 -13 -3z"/>
       <path d="M10 40 q-2 -12 7 -8 q-6 1 -7 8z"/></g>
    <path d="M20 39 l1.3 19 h1.6 l-1.3 -19z" fill="#8A5230"/>

    <!-- راكوبة -->
    <g><path d="M78 84 h16 v1.4 h-16z" fill="#8A5230"/>
       <path d="M77 84 l9 -5.5 l9 5.5z" fill="#B98B4E"/>
       <path d="M79.5 84 v6 h1.2 v-6z M91 84 v6 h1.2 v-6z" fill="#8A5230"/></g>

    <!-- جبنة وفناجين -->
    <g fill="#9E5B2E" opacity=".9"><path d="M14 88 q1.6 -6 5 0 q-2.4 3 -5 0z"/><path d="M18.6 84.6 q3 1.4 .6 3.4" fill="none" stroke="#9E5B2E" stroke-width=".7"/>
       <circle cx="24" cy="89" r="1.5" fill="#FBF0DC"/><circle cx="28" cy="89" r="1.5" fill="#FBF0DC"/></g>

    <!-- زخرفة سودانية أعلى وأسفل -->
    <g opacity=".45" stroke="#8A5230" stroke-width=".5" fill="none">
      <path d="M3 8 h94"/><path d="M3 93 h94"/>
      <path d="M5 4.5 l4 3.5 l-4 3.5z M13 4.5 l4 3.5 l-4 3.5z M21 4.5 l4 3.5 l-4 3.5z"/>
      <path d="M95 4.5 l-4 3.5 l4 3.5z M87 4.5 l-4 3.5 l4 3.5z M79 4.5 l-4 3.5 l4 3.5z"/>
    </g>
    <g opacity=".35" fill="#8A5230">
      <path d="M46 3 l3 3 l-3 3 l-3 -3z"/><path d="M54 3 l3 3 l-3 3 l-3 -3z"/>
      <path d="M46 91 l3 3 l-3 3 l-3 -3z"/><path d="M54 91 l3 3 l-3 3 l-3 -3z"/>
    </g></svg>`;

  function buildBoard(box) {
    if (box.dataset.built) return;
    box.dataset.built = '1';
    box.innerHTML = '';
    const mid = el('div', 'board-mid');
    mid.innerHTML = MID_SVG +
      `<img class="mid-logo" src="assets/logo.webp" alt="ولعت">` +
      `<div class="mid-note">من البداية للنهاية… وما تثق في تقدّمك</div>`;
    box.appendChild(mid);
    for (let i = 0; i < W.N; i++) {
      const t = W.BOARD[i], m = W.TYPES[t.t], c = W.tileCell(i);
      const d = el('div', 'tile t-' + t.t + (i % 10 === 0 ? ' corner' : ''));
      d.style.gridRow = c.r; d.style.gridColumn = c.c;
      d.dataset.i = i;
      d.title = W.tileName(i);
      const label = t.t === 'start' ? 'البداية' : t.t === 'end' ? 'النهاية'
        : t.label ? t.label : (i % 10 === 0 ? m.name : '');
      d.innerHTML = `<div class="lab"><div class="em">${m.emoji}</div>${label ? esc(label) : ''}</div>`
        + `<div class="tokens"></div>`;
      d.onclick = () => {
        if (picking && picking.kind === 'tile') { const cb = picking.cb; picking = null; renderAll(); cb(i); }
      };
      box.appendChild(d);
    }
  }

  function paintBoard(box, st) {
    if (!st) return;
    const tiles = box.querySelectorAll('.tile');
    const byTile = {};
    st.players.forEach((p, idx) => { (byTile[p.pos] = byTile[p.pos] || []).push({ p, idx }); });
    const curId = st.players[st.turn] ? st.players[st.turn].id : null;
    tiles.forEach((d) => {
      const i = +d.dataset.i;
      const holder = d.querySelector('.tokens');
      const list = byTile[i] || [];
      holder.innerHTML = list.map(({ p }) =>
        `<div class="token${p.id === curId ? ' turn' : ''}" style="background:${hexOf(p.color)}" title="${esc(p.name)}">${p.seat}</div>`
      ).join('');
      d.classList.toggle('here', list.some((x) => x.p.id === curId));
      d.classList.toggle('pick', !!(picking && picking.kind === 'tile'));
    });
  }

  /* ═══════════════════════════ عناصر مشتركة ═══════════════════════════ */
  function diceHTML(n) {
    const pips = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] }[n] || [];
    return Array.from({ length: 9 }, (_, i) => pips.includes(i) ? '<i></i>' : '<span></span>').join('');
  }
  function paintDice(box, n) {
    const rolling = Date.now() < rollingUntil;
    const face = rolling ? 1 + Math.floor(Math.random() * 6) : (n || 0);
    box.className = 'dice' + (rolling ? ' rolling' : '') + (face ? '' : ' empty');
    box.innerHTML = face ? diceHTML(face) : '؟';
    if (rolling) setTimeout(() => paintDice(box, n), 70);
  }
  function cardFaceHTML(kind, card, opts) {
    opts = opts || {};
    if (kind === 'tile') {
      const t = W.BOARD[opts.tile], m = W.TYPES[t.t];
      return `<div class="card tile">
        <div class="ct">${esc(m.name)}</div>
        <div class="cq"><div><div style="font-size:2.2em">${m.emoji}</div>
          <div style="margin-top:8px">${esc(tileDesc(opts.tile))}</div></div></div>
        <div class="cf"><span class="cat">خانة رقم ${AR(opts.tile)}</span></div></div>`;
    }
    if (!card) return '';
    if (kind === 'asalni') return `<div class="card asalni">
      <div class="ct">أسألني</div><div class="cq">${esc(card.q)}</div>
      <div class="cf"><span class="pts">${AR(card.pts || 10)} نقاط</span>${card.cat ? `<span class="cat">${esc(card.cat)}</span>` : ''}</div></div>`;
    if (kind === 'arkiz') return `<div class="card arkiz">
      <div class="ct">أركز</div><div class="cq">${esc(card.text)}</div>
      <div class="cf"><span class="pts">${AR(card.pts || 10)} نقاط</span>${card.sec ? `<span class="cat">⏱️ ${AR(card.sec)} ثانية</span>` : ''}</div></div>`;
    if (kind === 'salakt') return `<div class="card salakt${card.kind === 'fakakt' ? ' bad' : ''}">
      <div class="ct">${card.kind === 'fakakt' ? 'فككت 💀' : 'سلكت 😎'}</div>
      <div class="cq">${esc(card.text)}</div><div class="cf"><span class="cat">يا سلكت يا فككت</span></div></div>`;
    if (kind === 'hababa') return `<div class="card hababa">
      <div class="ct">كرت الهبابة</div>
      <div class="cq"><div><div style="font-size:1.15em;color:var(--gold-2)">${esc(card.title)}</div>
        <div style="margin-top:6px">${esc(card.text)}</div></div></div>
      <div class="cf"><span class="cat">${card.timing === 'own' ? 'يُستخدم في دورك' : 'يُستخدم في أي وقت'}</span></div></div>`;
    return '';
  }
  /** صيغة عريضة للكرت — يقرأها الحكم بوضوح داخل عمود ضيّق */
  function cardStripHTML(kind, card, opts) {
    opts = opts || {};
    const back = (t) => `<div class="mini" style="background-image:url('assets/back-${t}.webp')"></div>`;
    if (kind === 'asalni') return `<div class="strip asalni"><div class="sh">
      ${back('asalni')}<span class="st">أسألني</span><span class="pts">${AR(card.pts || 10)} نقاط</span>
      ${card.cat ? `<span class="cat">${esc(card.cat)}</span>` : ''}</div>
      <div class="sq">${esc(card.q)}</div></div>`;
    if (kind === 'arkiz') return `<div class="strip arkiz"><div class="sh">
      ${back('arkiz')}<span class="st">أركز</span><span class="pts">${AR(card.pts || 10)} نقاط</span>
      ${card.sec ? `<span class="cat">⏱️ ${AR(card.sec)}″</span>` : ''}</div>
      <div class="sq">${esc(card.text)}</div></div>`;
    if (kind === 'salakt') return `<div class="strip salakt${card.kind === 'fakakt' ? ' bad' : ''}"><div class="sh">
      ${back('salakt')}<span class="st">${card.kind === 'fakakt' ? 'فككت 💀' : 'سلكت 😎'}</span>
      <span class="cat">يا سلكت يا فككت</span></div>
      <div class="sq">${esc(card.text)}</div></div>`;
    if (kind === 'hababa') return `<div class="strip hababa"><div class="sh">
      ${back('hababa')}<span class="st">${esc(card.title)}</span>
      <span class="cat">${card.timing === 'own' ? 'في دوره' : 'أي وقت'}</span></div>
      <div class="sq">${esc(card.text)}</div></div>`;
    if (kind === 'tile') {
      const t = W.BOARD[opts.tile], m = W.TYPES[t.t];
      return `<div class="strip tile"><div class="sh">
        <span class="st">${m.emoji} ${esc(m.name)}</span><span class="cat">خانة ${AR(opts.tile)}</span></div>
        <div class="sq">${esc(tileDesc(opts.tile))}</div></div>`;
    }
    return '';
  }

  /** الكرت بصيغتيه: وجه ٢:٣ للشاشات الواسعة، وشريط عريض للشاشات القصيرة */
  function cardBothHTML(kind, card, opts) {
    return `<div class="cardwrap">${cardFaceHTML(kind, card, opts)}</div>`
         + `<div class="stripwrap">${cardStripHTML(kind, card, opts)}</div>`;
  }

  function tileDesc(i) {
    const t = W.BOARD[i];
    const f = t.fx || {};
    const bits = [];
    if (f.pts) bits.push((f.pts > 0 ? 'يكسب ' : 'يخسر ') + Math.abs(f.pts) + ' نقطة');
    if (f.move) bits.push((f.move > 0 ? 'يتقدّم ' : 'يرجع ') + Math.abs(f.move) + ' خانات');
    if (f.skip) bits.push('يفقد دوره القادم');
    if (f.shield) bits.push('حماية من الهبابة لدور');
    if (f.extraRoll) bits.push('يرمي النرد مرة أخرى');
    if (f.giveHababa) bits.push('يكسب كرت هبابة');
    if (f.moveTo === 'choice') bits.push('ينتقل إلى أي خانة يختارها');
    if (f.swapPos === 'choice') bits.push('يبدّل مكانه مع لاعب يختاره');
    return bits.length ? bits.join(' + ') + '.' : 'بداية الطريق — منها تنطلق.';
  }
  function miniCard(type, i, faceUp, forJudge) {
    const back = 'assets/back-' + (type === 'hababa' ? 'hababa' : type) + '.webp';
    const card = i == null ? null : W.cardData(type, i);
    const shown = (faceUp || forJudge) && card;
    return `<div class="mini${shown ? '' : ' down'}" style="background-image:url('${back}')" title="${shown ? esc(card.title || '') : 'كرت مغلق'}">
      ${shown ? `<div class="tagline">${esc((card.title || '').slice(0, 12))}</div>` : '<div class="lock">🔒</div>'}</div>`;
  }
  function badgesHTML(p) {
    const b = [];
    if (p.skip > 0)   b.push('<span class="bdg">🌴 يفقد دورًا</span>');
    if (p.shield > 0) b.push('<span class="bdg">🛡️ محمي ×' + AR(p.shield) + '</span>');
    if (p.block > 0)  b.push('<span class="bdg">🚫 هبابة مقفولة</span>');
    if (p.double)     b.push('<span class="bdg">✖️2 مضاعف</span>');
    if (p.connected === false) b.push('<span class="bdg">📴 منقطع</span>');
    return b.length ? `<div class="badges">${b.join('')}</div>` : '';
  }

  /* ═══════════════════════════ الشاشة الرئيسية ═══════════════════════════ */
  function renderHome() {
    const src = W.decksSource();
    const total = src.asalni.length + src.arkiz.length + src.salakt.length + src.hababa.length;
    $('home-note').innerHTML = `المجموعة الحالية: ${AR(total)} كرت — `
      + `أسألني ${AR(src.asalni.length)} · أركز ${AR(src.arkiz.length)} · يا سلكت يا فككت ${AR(src.salakt.length)} · هبابة ${AR(src.hababa.length)}`;
    $('b-resume').classList.toggle('hidden', !readJSON(SAVE));
  }
  $('b-judge').onclick = () => { Snd.ready(); openSetup(); };
  $('b-join').onclick  = () => { Snd.ready(); show('v-join'); $('j-name').focus(); };
  $('b-rules').onclick = () => { renderRules(); show('v-rules'); };
  $('b-cards').onclick = () => { renderCards(); show('v-cards'); };
  $('b-resume').onclick = () => {
    const sv = readJSON(SAVE);
    if (!sv || !sv.S) { toast('ما في لعبة محفوظة.'); return; }
    role = 'judge'; S = sv.S; cfg.mode = S.mode; undoStack = [];
    startHost(true).then(() => { show(S.phase === 'lobby' ? 'v-lobby' : 'v-judge'); renderAll(); })
      .catch((e) => { toast(e.message || 'ما قدرنا نفتح الغرفة.'); S.mode = 'solo'; startHost(true).then(() => show('v-judge')); });
  };

  /* ═══════════════════════════ إعداد الحكم ═══════════════════════════ */
  function openSetup() {
    if (!setupPlayers.length) setupPlayers = [{ name: '', color: 'green' }, { name: '', color: 'orange' }];
    cfg.judgeName = cfg.judgeName || '';
    $('f-judge').value = cfg.judgeName;
    paintSetup(); show('v-setup');
  }
  function paintSetup() {
    document.querySelectorAll('.mode-opt').forEach((b) => {
      const on = b.dataset.mode === cfg.mode;
      b.classList.toggle('info', on); b.classList.toggle('ghost', !on);
    });
    document.querySelectorAll('.tgt-opt').forEach((b) => {
      const on = +b.dataset.t === cfg.target;
      b.classList.toggle('ok', on); b.classList.toggle('ghost', !on);
    });
    const sb = $('f-sealed');
    sb.textContent = cfg.sealed ? '🔒 كرت البداية: مغلق تمامًا' : '👁️ كرت البداية: مغلق مع اطّلاع صاحبه';
    sb.classList.toggle('info', cfg.sealed); sb.classList.toggle('ghost', !cfg.sealed);
    const box = $('setup-players'); box.innerHTML = '';
    setupPlayers.forEach((p, i) => {
      const row = el('div', 'pcard');
      const taken = setupPlayers.filter((_, j) => j !== i).map((x) => x.color);
      row.innerHTML = `<div class="top">
        <div class="avatar" style="background:${hexOf(p.color)}">${iconOf(p.color)}</div>
        <input class="field grow" style="padding:6px 10px;font-size:14px" maxlength="18"
               placeholder="اسم اللاعب ${AR(i + 1)}" value="${esc(p.name)}">
        <button class="btn xs no">✕</button></div>
        <div class="row" style="gap:4px;flex-wrap:wrap">${W.COLORS.map((c) =>
          `<button class="btn xs" data-c="${c.id}" ${taken.includes(c.id) ? 'disabled' : ''}
            style="background:${c.hex};color:#fff;box-shadow:0 2px 0 rgba(0,0,0,.4);${p.color === c.id ? 'outline:2px solid var(--gold-2)' : ''}"
            title="${esc(c.name)}">${iconOf(c.id)}</button>`).join('')}</div>`;
      row.querySelector('input').oninput = (e) => { p.name = e.target.value; };
      row.querySelector('.btn.no').onclick = () => { setupPlayers.splice(i, 1); paintSetup(); };
      row.querySelectorAll('[data-c]').forEach((b) => b.onclick = () => { p.color = b.dataset.c; paintSetup(); });
      box.appendChild(row);
    });
    $('b-addp').disabled = setupPlayers.length >= 6;
    $('setup-hint').textContent = cfg.mode === 'solo'
      ? 'وضع الجهاز الواحد: أضف كل اللاعبين هنا (٢ على الأقل).'
      : 'اللاعبون يقدروا ينضموا بالرمز، وتقدر تضيف بعضهم هنا مقدّمًا.';
  }
  document.querySelectorAll('.mode-opt').forEach((b) => b.onclick = () => { cfg.mode = b.dataset.mode; paintSetup(); });
  document.querySelectorAll('.tgt-opt').forEach((b) => b.onclick = () => { cfg.target = +b.dataset.t; paintSetup(); });
  $('b-addp').onclick = () => {
    const taken = setupPlayers.map((x) => x.color);
    const free = W.COLORS.find((c) => !taken.includes(c.id));
    setupPlayers.push({ name: '', color: free ? free.id : 'green' }); paintSetup();
  };
  $('f-judge').oninput = (e) => { cfg.judgeName = e.target.value; };
  $('f-sealed').onclick = () => { cfg.sealed = !cfg.sealed; paintSetup(); };

  $('b-create').onclick = function () {
    const named = setupPlayers.filter((p) => true);
    if (cfg.mode === 'solo' && named.length < 2) { toast('لازم لاعبين اثنين على الأقل.'); return; }
    role = 'judge'; myPid = null; soloPid = null; undoStack = [];
    S = W.create({ mode: cfg.mode, target: cfg.target, sealed: cfg.sealed, judgeName: (cfg.judgeName || '').trim() || 'الحكم' });
    named.forEach((p, i) => W.addPlayer(S, { name: p.name || ('لاعب ' + (i + 1)), color: p.color }));
    this.disabled = true;
    startHost(false).then(() => { this.disabled = false; show('v-lobby'); renderLobby(); })
      .catch((e) => { this.disabled = false; dialog('ما قدرنا نفتح الغرفة', `<div>${esc(e.message)}</div>`, [{ label: 'تمام', cls: 'ok' }]); });
  };

  /* ═══════════════════════════ الحكم = المرجع ═══════════════════════════ */
  function startHost(silent) {
    if (host) { try { host.close(); } catch (e) {} host = null; }
    return NET.Host(S.mode, S.code, {
      onHello: (c, m) => {
        let p = S.players.find((x) => x.cid === c);
        if (!p) {
          const free = S.players.find((x) => !x.cid && !x.claimed && (m.name || '').trim() && x.name === (m.name || '').trim());
          if (free) p = free;
        }
        if (!p) {
          if (S.phase !== 'lobby') { host.send(c, { t: 'bye', reason: 'اللعبة بدأت — ما في مقاعد فاضية.' }); return; }
          const r = W.addPlayer(S, { name: m.name, color: m.color });
          if (!r.ok) { host.send(c, { t: 'bye', reason: r.msg }); return; }
          p = r.player;
        }
        p.cid = c; p.connected = true;
        if (m.name && S.phase === 'lobby') p.name = String(m.name).slice(0, 18) || p.name;
        host.note(c);
        host.send(c, { t: 'welcome', pid: p.id, code: S.code });
        Snd.play('join'); broadcast(); renderAll();
      },
      onAct: (c, m) => {
        const p = S.players.find((x) => x.cid === c);
        if (!p) { host.send(c, { t: 'toast', text: 'ما لقيناك في الغرفة — جرّب تدخل من جديد.' }); return; }
        doAct(p.id, m.act, m);
      },
      onLeave: (c) => { const p = S.players.find((x) => x.cid === c); if (p) { p.connected = false; broadcast(); renderAll(); } },
      onStatus: (k, msg) => { netMsg = msg || ''; if (document.querySelector('#v-lobby.active')) renderLobby(); },
    }).then((h) => { host = h; if (!silent) toast('الغرفة فتحت — الرمز ' + S.code); return h; });
  }

  /** كل الأفعال القادمة من اللاعبين (أو من الحكم عنهم) تمرّ من هنا */
  function doAct(pid, act, m) {
    m = m || {};
    let r = { ok: true };
    if (act === 'roll') {
      snapshot();
      rollingUntil = Date.now() + 620;
      r = W.roll(S, pid);
      if (r.ok) setTimeout(() => { renderAll(); broadcast(); }, 650);
    } else if (act === 'hababa') {
      snapshot();
      r = W.requestHababa(S, pid, m.uid, m.target, m.tile);
    } else if (act === 'chat') {
      W.chat(S, pid, m.text);
    } else if (act === 'peek') {
      const card = W.peek(S, pid, m.uid);
      const p = S.players.find((x) => x.id === pid);
      if (p && p.cid && host) host.send(p.cid, { t: 'peek', uid: m.uid, card });
      return { ok: true, card };
    }
    if (!r.ok && r.msg) {
      const p = S.players.find((x) => x.id === pid);
      if (p && p.cid && host) host.send(p.cid, { t: 'toast', text: r.msg });
      else toast(r.msg);
    }
    renderAll(); broadcast(); autosave();
    return r;
  }

  function broadcast() {
    if (!host || S.mode === 'solo') return;
    S.players.forEach((p) => { if (p.cid) host.send(p.cid, { t: 'state', st: W.viewFor(S, p.id) }); });
  }
  function snapshot() { if (role !== 'judge') return; undoStack.push(W.clone(S)); if (undoStack.length > 15) undoStack.shift(); }
  function autosave() { if (role === 'judge' && S) writeJSON(SAVE, { S: S, at: Date.now() }); }

  /* ═══════════════════════════ اللاعب = عميل ═══════════════════════════ */
  $('b-dojoin').onclick = function () {
    const code = ($('j-code').value || '').trim().toUpperCase();
    const name = ($('j-name').value || '').trim();
    if (!code) { toast('اكتب رمز الغرفة.'); return; }
    if (!name) { toast('اكتب اسمك.'); return; }
    this.disabled = true; $('j-status').textContent = 'جاري الاتصال…';
    role = 'player'; S = null; myPid = null;
    /* نجرّب نفس الجهاز أولًا (أسرع وبلا إنترنت) ثم الأونلاين */
    tryJoin('local', code, name)
      .catch(() => tryJoin('online', code, name))
      .then(() => { this.disabled = false; })
      .catch((e) => { this.disabled = false; $('j-status').textContent = e.message || 'ما قدرنا ندخل الغرفة.'; });
  };
  function tryJoin(mode, code, name) {
    return new Promise((res, rej) => {
      let done = false;
      NET.Client(mode, code, cid, {
        onStatus: (k, msg) => { if (!done) $('j-status').textContent = msg; },
        onMsg: (m) => {
          if (m.t === 'welcome') {
            done = true; myPid = m.pid; $('j-status').textContent = 'داخل الغرفة ✓';
            res(); toast('دخلت الغرفة ' + code);
          } else if (m.t === 'state') {
            S = m.st; if (!done) { done = true; res(); }
            renderAll();
          } else if (m.t === 'toast') toast(m.text);
          else if (m.t === 'peek') showPeek(m.uid, m.card);
          else if (m.t === 'bye') { dialog('انتهى الاتصال', `<div>${esc(m.reason || 'الحكم أغلق الغرفة.')}</div>`, [{ label: 'للرئيسية', cls: 'ok', fn: () => show('v-home') }]); }
        },
      }).then((c) => {
        client = c;
        c.send({ t: 'hello', name, color: null });
        setTimeout(() => { if (!done) { try { c.close(); } catch (e) {} rej(new Error('ما في غرفة بهذا الرمز على ' + (mode === 'local' ? 'هذا الجهاز' : 'الإنترنت') + '.')); } }, mode === 'local' ? 1200 : 21000);
      }).catch(rej);
    });
  }
  function sendAct(act, extra) {
    const m = Object.assign({ t: 'act', act }, extra || {});
    if (role === 'judge') return doAct(soloPid || (S.players[S.turn] && S.players[S.turn].id), act, m);
    if (client) client.send(m);
    return { ok: true };
  }

  /* ═══════════════════════════ غرفة الانتظار ═══════════════════════════ */
  function renderLobby() {
    if (!S) return;
    $('lb-code').textContent = S.code;
    $('lb-count').textContent = AR(S.players.length);
    $('lb-mode').textContent = { solo: '📱 جهاز واحد', local: '🖥️ نوافذ متعددة', online: '🌐 أجهزة مختلفة' }[S.mode] || '';
    $('lb-help').innerHTML = S.mode === 'solo'
      ? 'الجهاز يبقى مع الحكم، وفي دور كل لاعب يفتح له الحكم شاشته الخاصة.'
      : (S.mode === 'local'
        ? 'كل لاعب يفتح اللعبة في نافذة جديدة على هذا الجهاز ← «انضم كلاعب» ← يكتب الرمز.'
        : 'كل لاعب يفتح نفس الرابط بجواله ← «انضم كلاعب» ← يكتب الرمز.');
    const box = $('lb-players'); box.innerHTML = '';
    S.players.forEach((p) => {
      const d = el('div', 'pcard' + (p.connected === false ? ' off' : ''));
      d.innerHTML = `<div class="top">
        <div class="avatar" style="background:${hexOf(p.color)}">${iconOf(p.color)}</div>
        <div class="grow"><div class="pname">${esc(p.name)}</div>
        <div class="pmeta">${esc((W.COLORS.find((c) => c.id === p.color) || {}).name || '')}${p.cid ? ' · متصل' : ''}</div></div>
        ${role === 'judge' ? '<button class="btn xs no">✕</button>' : ''}</div>`;
      const x = d.querySelector('.btn.no');
      if (x) x.onclick = () => { W.removePlayer(S, p.id); renderLobby(); broadcast(); };
      box.appendChild(d);
    });
    const canStart = role === 'judge' && S.players.length >= 2;
    $('b-start').disabled = !canStart;
    $('b-start').classList.toggle('hidden', role !== 'judge');
    $('lb-status').textContent = role !== 'judge'
      ? 'في انتظار الحكم يبدأ اللعبة…'
      : (S.players.length < 2
          ? 'محتاجين لاعبين اثنين على الأقل. ' + netMsg
          : 'جاهزين — اضغط «ولّعها!». ' + netMsg);
  }
  $('b-copy').onclick = () => {
    const t = S ? S.code : '';
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(() => toast('انتسخ الرمز: ' + t), () => toast('الرمز: ' + t));
    else toast('الرمز: ' + t);
  };
  $('b-start').onclick = () => {
    const r = W.start(S);
    if (!r.ok) { toast(r.msg); return; }
    undoStack = []; autosave(); broadcast();
    FX.confetti(50); Snd.play('start');
    show('v-judge'); renderAll();
  };
  $('b-leave').onclick = () => {
    dialog('خروج من الغرفة', '<div>تأكيد الخروج؟ اللعبة الحالية تُحفظ عند الحكم.</div>', [
      { label: 'إلغاء' },
      { label: 'خروج', cls: 'no', fn: () => {
        if (host) { try { host.close(); } catch (e) {} host = null; }
        if (client) { try { client.close(); } catch (e) {} client = null; }
        role = null; show('v-home'); renderHome();
      } },
    ]);
  };

  /* ═══════════════════════════ لوحة تحكم الحكم ═══════════════════════════ */
  function renderJudge() {
    if (!S || role !== 'judge') return;
    $('jz-code').textContent = '🔑 ' + S.code;
    $('jz-round').textContent = 'الجولة ' + AR(S.round);
    $('jz-target').textContent = '🎯 ' + AR(S.target);
    $('jz-final').style.display = S.final ? '' : 'none';
    $('jz-dice').textContent = 'النرد: ' + (S.dice ? AR(S.dice) : '—');
    const c = W.cur(S);
    $('jz-turn').textContent = c ? c.name : '—';
    paintBoard($('jz-board'), S);
    renderJudgePlayers();
    renderJudgeEvent();
    renderLog($('jz-log'));
    $('b-undo').disabled = !undoStack.length;
  }

  function renderJudgePlayers() {
    const box = $('jz-players'); box.innerHTML = '';
    const curId = W.cur(S) ? W.cur(S).id : null;
    S.players.forEach((p) => {
      const d = el('div', 'pcard' + (p.id === curId ? ' turn' : '') + (p.connected === false ? ' off' : ''));
      d.innerHTML = `<div class="top">
          <div class="avatar" style="background:${hexOf(p.color)}">${iconOf(p.color)}</div>
          <div class="grow"><div class="pname">${esc(p.name)}</div>
            <div class="pmeta">خانة ${AR(p.pos)} · ${esc(W.TYPES[W.BOARD[p.pos].t].name)}${p.laps ? ' · لفّات ' + AR(p.laps) : ''}</div></div>
          <div class="score">${AR(p.score)}</div>
        </div>
        ${badgesHTML(p)}
        <div class="hand">${p.hand.map((h) => miniCard('hababa', h.i, h.faceUp, true)).join('') || '<span class="tiny muted">ما في كروت هبابة</span>'}</div>
        <div class="row" style="gap:4px;flex-wrap:wrap">
          <button class="btn xs ok" data-a="+">+5</button>
          <button class="btn xs no" data-a="-">−5</button>
          <button class="btn xs ghost" data-a="edit">✏️ نقاط</button>
          <button class="btn xs ghost" data-a="hab">🔥 كرت</button>
          <button class="btn xs ghost" data-a="turn">▶️ الدور</button>
          ${S.mode === 'solo' ? '<button class="btn xs info" data-a="screen">📱 شاشته</button>' : ''}
        </div>`;
      d.querySelectorAll('.hand .mini').forEach((mc, k) => {
        mc.onclick = () => {
          const h = p.hand[k]; const card = W.cardData('hababa', h.i);
          dialog('كرت ' + esc(p.name), `<div class="cardwrap" style="height:44vh">${cardFaceHTML('hababa', card)}</div>
            <div class="tiny muted" style="text-align:center;margin-top:6px">${h.faceUp ? 'مفتوح — الكل يشوفه' : 'مغلق — بس صاحبه والحكم'}</div>`,
            [{ label: 'إغلاق' }]);
        };
      });
      d.querySelectorAll('[data-a]').forEach((b) => b.onclick = () => {
        const a = b.dataset.a;
        if (a === '+' || a === '-') { snapshot(); W.adjust(S, p.id, a === '+' ? 5 : -5); after(); }
        else if (a === 'edit') askPoints(p);
        else if (a === 'hab') { snapshot(); W.grantHababa(S, p.id); Snd.play('card'); after(); }
        else if (a === 'turn') { snapshot(); W.forceTurn(S, p.id); after(); }
        else if (a === 'screen') openSolo(p.id);
      });
      box.appendChild(d);
    });
  }
  function after() { renderAll(); broadcast(); autosave(); }

  function askPoints(p) {
    dialog('نقاط ' + esc(p.name), `<div class="col" style="gap:8px">
      <div class="sm muted">الرصيد الحالي: <b style="color:var(--gold-2)">${AR(p.score)}</b></div>
      <label class="lbl">اكتب رصيدًا جديدًا</label>
      <input class="field" id="pp-val" type="number" inputmode="numeric" value="${AR(p.score)}" style="text-align:center;font-size:22px">
      <div class="row" style="flex-wrap:wrap;justify-content:center">
        ${[-15, -10, -5, -1, 1, 5, 10, 15].map((n) => `<button class="btn xs ${n > 0 ? 'ok' : 'no'}" data-d="${n}">${n > 0 ? '+' : '−'}${Math.abs(n)}</button>`).join('')}
      </div></div>`, [
      { label: 'إلغاء' },
      { label: 'حفظ الرصيد', cls: 'ok', keep: true, fn: null },
    ]);
    const inp = $('pp-val');
    $('m-body').querySelectorAll('[data-d]').forEach((b) => b.onclick = () => { inp.value = String(Math.max(0, (+inp.value || 0) + (+b.dataset.d))); });
    const btns = $('m-btns').querySelectorAll('button');
    btns[btns.length - 1].onclick = () => {
      snapshot();
      const v = Math.max(0, Math.round(+inp.value || 0));
      W.adjust(S, p.id, v - p.score);
      closeDialog(); after();
    };
  }

  function renderJudgeEvent() {
    const box = $('jz-event'); box.innerHTML = '';
    const head = $('jz-evt-h');

    if (S.phase === 'over') {
      head.textContent = 'انتهت اللعبة';
      box.appendChild(el('div', '', winnerHTML()));
      const b = el('button', 'btn ok', '🔄 لعبة جديدة');
      b.onclick = newGame; box.appendChild(b);
      return;
    }

    /* ١) طلب استخدام كرت هبابة — الأولوية */
    if (S.request) {
      const rq = S.request, p = W.byId(S, rq.pid), tg = rq.target ? W.byId(S, rq.target) : null;
      head.textContent = '🔥 طلب استخدام هبابة';
      box.innerHTML = `<div class="turnbar mine">${esc(p.name)} يبغى يولّعها</div>
        ${cardStripHTML('hababa', rq.card)}
        ${tg ? `<div class="chip">🎯 الهدف: ${esc(tg.name)}</div>` : ''}
        ${rq.tile != null ? `<div class="chip">📍 الخانة: ${AR(rq.tile)} — ${esc(W.TYPES[W.BOARD[rq.tile].t].name)}</div>` : ''}`;
      const dec = el('div', 'decide', '');
      const row = el('div', 'row', '');
      const yes = el('button', 'btn ok', '✅ اسمح واستخدم');
      yes.onclick = () => { snapshot(); W.decideHababa(S, true, null); Snd.play('hababa'); FX.burst(); after(); };
      const no = el('button', 'btn no', '❌ ارفض');
      no.onclick = () => { snapshot(); W.decideHababa(S, false); after(); };
      row.appendChild(yes); row.appendChild(no); dec.appendChild(row);
      /* هل عند الهدف كرت الدرع؟ */
      if (tg) {
        const has = tg.hand.some((h) => { const cd = W.cardData('hababa', h.i); return cd && cd.fx && cd.fx.counter; });
        if (has) {
          const cb = el('button', 'btn sm info', '🛡️ ' + tg.name + ' فتح الدرع (يُلغي الكرت)');
          cb.onclick = () => { snapshot(); W.decideHababa(S, true, tg.id); Snd.play('hababa'); after(); };
          dec.appendChild(cb);
        }
      }
      box.appendChild(dec);
      return;
    }

    const pen = S.pending;
    const c = W.cur(S);

    /* ٢) ما في حدث — ننتظر رمي النرد */
    if (!pen) {
      head.textContent = 'الدور الحالي';
      box.innerHTML = `<div class="turnbar">دور <b style="color:var(--gold-2)">${esc(c ? c.name : '—')}</b></div>`;
      const dc = el('div', 'dice'); box.appendChild(dc); paintDice(dc, S.dice);
      const hint = el('div', 'sm muted', S.mode === 'solo'
        ? 'افتح شاشة اللاعب من القائمة على اليمين، أو ارمِ النرد عنه من هنا.'
        : 'اللاعب يرمي النرد من جهازه — أو ارمِ عنه إذا احتاج.');
      hint.style.textAlign = 'center'; box.appendChild(hint);
      if (S.mode === 'solo' && c) {
        const b = el('button', 'btn info', '📱 افتح شاشة ' + c.name);
        b.onclick = () => openSolo(c.id); box.appendChild(b);
      }
      return;
    }

    const p = W.byId(S, pen.pid);
    head.textContent = { asalni: '❓ أسألني', arkiz: '🎯 أركز', salakt: '🔗 يا سلكت يا فككت', gain: '🔥 كرت هبابة', tile: '📍 خانة حدث' }[pen.kind] || 'حدث';

    box.appendChild(el('div', 'turnbar' + (pen.quizFor ? ' mine' : ''), pen.quizFor
      ? `سؤال من <b>${esc((W.byId(S, pen.quizFor) || {}).name || '')}</b> إلى <b>${esc(p.name)}</b>`
      : `<b style="color:var(--gold-2)">${esc(p.name)}</b>${pen.forced ? ' — تحدي إجباري بلا نقاط' : ''}`));

    /* ٣) أسألني / أركز */
    if (pen.kind === 'asalni' || pen.kind === 'arkiz') {
      box.appendChild(el('div', 'wfull', cardStripHTML(pen.kind, pen.card)));

      /* الإجابة النموذجية والمؤقّت والأزرار كلها في الشريط الثابت — الحكم يشوفها دائمًا */
      const dec = el('div', 'decide', '');
      if (pen.kind === 'asalni') {
        dec.appendChild(el('div', 'answer', `<div class="ah">الإجابة النموذجية (تظهر للحكم فقط)</div>${esc(pen.card.a || '—')}`));
      }
      if (pen.kind === 'arkiz' && pen.timer && pen.timer.sec) {
        const t = pen.timer;
        const left = t.running ? Math.max(0, Math.ceil((t.endsAt - Date.now()) / 1000)) : t.left;
        const trow = el('div', 'row', '');
        trow.appendChild(el('div', 'timer' + (left <= 0 ? ' done' : (left <= 5 ? ' warn' : '')), left <= 0 ? 'انتهى' : AR(left) + '″'));
        const b1 = el('button', 'btn sm ' + (t.running ? 'no' : 'ok'), t.running ? '⏸️ أوقف' : '▶️ ابدأ');
        b1.onclick = () => { W.timer(S, t.running ? 'pause' : 'start'); Snd.play('tick'); after(); };
        const b2 = el('button', 'btn sm ghost', '🔄 صفّر');
        b2.onclick = () => { W.timer(S, 'reset'); after(); };
        trow.appendChild(b1); trow.appendChild(b2); dec.appendChild(trow);
      }

      if (pen.forced) {
        const b = el('button', 'btn lg ok', '✔️ خلّص التحدي — واصل اللعب');
        b.onclick = () => { snapshot(); W.resolve(S, { award: 0 }); after(); };
        dec.appendChild(b); box.appendChild(dec);
        return;
      }

      const max = pen.max;
      const key = pen.kind + ':' + pen.ci + ':' + pen.pid;
      if (awardKey !== key) { awardKey = key; awardVal = Math.round(max / 2); }

      const full = el('button', 'btn ok', `✅ تأكيد الإجابة الصحيحة (${AR(max)} نقاط)`);
      full.onclick = () => resolveAward(max);
      const zero = el('button', 'btn no', '❌ تأكيد الإجابة الخاطئة (٠ نقطة)');
      zero.onclick = () => resolveAward(0);
      const conf = el('div', 'confirm', '');
      conf.appendChild(full); conf.appendChild(zero); dec.appendChild(conf);

      const aw = el('div', 'award', '');
      const minus = el('button', 'btn xs no stepper', '−');
      const numTxt = () => `${AR(awardVal)}<span class="of">من ${AR(max)}</span>`;
      const num = el('div', 'num', numTxt());
      const plus = el('button', 'btn xs ok stepper', '+');
      const give = el('button', 'btn info sm', '➗ منح نقاط جزئية');
      minus.onclick = () => { awardVal = Math.max(0, awardVal - 1); num.innerHTML = numTxt(); };
      plus.onclick  = () => { awardVal = Math.min(max, awardVal + 1); num.innerHTML = numTxt(); };
      give.onclick  = () => resolveAward(awardVal);
      aw.appendChild(minus); aw.appendChild(num); aw.appendChild(plus); aw.appendChild(give);
      dec.appendChild(aw);
      dec.appendChild(el('div', 'tiny muted', 'مثال: إجابة ناقصة ← امنحه ٥ من ١٠ بدل النقاط الكاملة.'));
      box.appendChild(dec);
      return;
    }

    /* ٤) كرت حظ أو خانة حدث */
    if (pen.kind === 'salakt' || pen.kind === 'tile') {
      const card = pen.kind === 'salakt' ? pen.card : null;
      box.appendChild(el('div', 'wfull', pen.kind === 'salakt'
        ? cardStripHTML('salakt', card)
        : cardStripHTML('tile', null, { tile: pen.tile })));
      const need = pen.need;
      let target = null, tile = null;
      const run = el('button', 'btn lg ok', '⚡ نفّذ');
      if (need === 'player') {
        box.appendChild(el('div', 'lbl', 'اختر اللاعب المستهدف'));
        const row = el('div', 'row', ''); row.style.flexWrap = 'wrap'; row.style.justifyContent = 'center';
        S.players.filter((x) => x.id !== pen.pid).forEach((x) => {
          const b = el('button', 'btn sm ghost', iconOf(x.color) + ' ' + esc(x.name));
          b.onclick = () => { target = x.id; row.querySelectorAll('button').forEach((y) => y.classList.add('ghost')); b.classList.remove('ghost'); b.classList.add('info'); run.disabled = false; };
          row.appendChild(b);
        });
        box.appendChild(row); run.disabled = true;
      } else if (need === 'tile') {
        const note = el('div', 'lbl', 'اضغط على أي خانة في الرقعة');
        box.appendChild(note);
        run.disabled = true;
        picking = { kind: 'tile', cb: (i) => { tile = i; note.textContent = 'الخانة المختارة: ' + AR(i) + ' — ' + W.TYPES[W.BOARD[i].t].name; run.disabled = false; } };
        paintBoard($('jz-board'), S);
      }
      run.onclick = () => { snapshot(); picking = null; W.resolve(S, { ok: true, target, tile }); Snd.play(card && card.kind === 'fakakt' ? 'bad' : 'good'); after(); };
      const skip = el('button', 'btn sm ghost', '⏭️ ألغِ الكرت وواصل');
      skip.onclick = () => { snapshot(); picking = null; W.resolve(S, { ok: false }); after(); };
      const dec = el('div', 'decide', '');
      dec.appendChild(run); dec.appendChild(skip); box.appendChild(dec);
      return;
    }

    /* ٥) كسب كرت هبابة */
    if (pen.kind === 'gain') {
      box.appendChild(el('div', 'wfull', cardStripHTML('hababa', pen.card)));
      box.appendChild(el('div', 'tiny muted', `يده فيها ${AR(p.hand.length)} من ${AR(W.MAX_HAND)} كروت.`));
      const yes = el('button', 'btn lg ok', '🎁 سلّمه الكرت');
      yes.onclick = () => { snapshot(); W.resolve(S, { ok: true }); Snd.play('card'); after(); };
      const no = el('button', 'btn sm ghost', '⏭️ ألغِ');
      no.onclick = () => { snapshot(); W.resolve(S, { ok: false }); after(); };
      const dec = el('div', 'decide', '');
      dec.appendChild(yes); dec.appendChild(no); box.appendChild(dec);
    }
  }
  function resolveAward(n) {
    snapshot();
    const max = S.pending ? S.pending.max : 0;
    W.resolve(S, { award: n });
    Snd.play(n >= max && max > 0 ? 'good' : (n > 0 ? 'partial' : 'bad'));
    if (n >= max && max > 0) FX.confetti(28);
    after();
  }

  $('b-jroll').onclick = () => { const c = W.cur(S); if (c) doAct(c.id, 'roll', {}); };
  $('b-jskip').onclick = () => { snapshot(); W.skipTurn(S); after(); };
  $('b-undo').onclick = () => {
    if (!undoStack.length) return;
    S = undoStack.pop(); toast('رجعنا خطوة.'); after();
  };
  $('b-save').onclick = () => { autosave(); toast('اللعبة انحفظت على هذا الجهاز.'); };
  $('b-jchat').onclick = () => openChat();
  $('b-jmenu').onclick = () => openMenu(true);

  /* ═══════════════════════════ شاشة اللاعب ═══════════════════════════ */
  function myPidNow() { return role === 'judge' ? soloPid : (S && (S.me || myPid)); }
  /** حالة شاشة اللاعب: منقّاة دائمًا — حتى لو كان الحكم هو من يعرضها */
  function playView() {
    if (!S) return null;
    return role === 'judge' ? W.viewFor(S, soloPid) : S;
  }
  function meView(st) {
    st = st || playView();
    if (!st) return null;
    return st.players.find((p) => p.id === myPidNow()) || null;
  }
  function openSolo(pid) {
    const p = W.byId(S, pid); if (!p) return;
    dialog('مرّر الجهاز', `<div style="text-align:center" class="col">
      <div style="font-size:44px">${iconOf(p.color)}</div>
      <div style="font-size:21px;font-weight:900;color:var(--gold-2)">${esc(p.name)}</div>
      <div class="sm muted">كروتك المغلقة ما تظهر لغيرك — تأكد ما في زول شايف الشاشة.</div></div>`,
      [{ label: 'رجوع' }, { label: 'أنا ' + esc(p.name) + ' — افتح شاشتي', cls: 'ok', fn: () => { soloPid = pid; show('v-play'); } }]);
  }
  function renderPlay() {
    if (!S) return;
    const st = playView();
    const me = meView(st);
    paintBoard($('pl-board'), st);
    $('pl-code').textContent = '🔑 ' + st.code;
    $('pl-round').textContent = 'الجولة ' + AR(st.round);
    $('b-back-judge').classList.toggle('hidden', !(role === 'judge'));

    /* النتائج أعلى الشاشة: نتيجتي ونتيجة أقوى خصم */
    const others = st.players.filter((p) => !me || p.id !== me.id).sort((a, b) => b.score - a.score);
    const rival = others[0];
    $('pl-scores').innerHTML =
      (me ? `<div class="sbox mine"><span class="l">درجاتك</span><span class="v">${AR(me.score)}</span></div>` : '') +
      (rival ? `<div class="sbox"><span class="l">درجة الخصم (${esc(rival.name)})</span><span class="v">${AR(rival.score)}</span></div>` : '') +
      `<div class="sbox"><span class="l">الهدف</span><span class="v">${AR(st.target)}</span></div>` +
      (st.final ? `<div class="sbox" style="border-color:#E4645C"><span class="l">🔥 جولة أخيرة</span></div>` : '');

    /* الترتيب */
    $('pl-rank').innerHTML = st.players.slice().sort((a, b) => b.score - a.score).map((p, i) => `
      <div class="row" style="gap:6px">
        <div class="avatar" style="width:22px;height:22px;font-size:11px;background:${hexOf(p.color)}">${iconOf(p.color)}</div>
        <div class="grow sm" style="font-weight:900">${esc(p.name)}${me && p.id === me.id ? ' <span class="tiny muted">(أنت)</span>' : ''}</div>
        <div class="chip" style="font-size:13px;color:var(--gold-2)">${AR(p.score)}</div>
      </div>${badgesHTML(p)}`).join('');

    /* لافتة الدور */
    const c = st.players[st.turn];
    const mine = !!(me && c && c.id === me.id);
    const tb = $('pl-turnbar');
    tb.className = 'turnbar' + (mine ? ' mine' : '');
    tb.innerHTML = st.phase === 'over' ? '🏆 انتهت اللعبة'
      : mine ? '🎲 دورك — ولّعها!' : `دور <b style="color:var(--gold-2)">${esc(c ? c.name : '—')}</b>`;

    renderPlayAction(st, me, mine);
    renderPlayHand(st, me);
  }

  function renderPlayAction(st, me, mine) {
    const box = $('pl-action'); box.innerHTML = '';

    if (st.phase === 'over') { box.innerHTML = winnerHTML(st); return; }

    if (st.request) {
      const rq = st.request, p = st.players.find((x) => x.id === rq.pid);
      box.innerHTML = `<div class="chip" style="background:rgba(198,52,46,.5)">🔥 ${esc(p ? p.name : '')} طلب استخدام هبابة</div>
        ${cardBothHTML('hababa', rq.card)}
        <div class="sm muted">في انتظار موافقة الحكم…</div>`;
      return;
    }

    const pen = st.pending;

    if (pen) {
      const p = st.players.find((x) => x.id === pen.pid);
      const forMe = !!(me && pen.pid === me.id);
      box.appendChild(el('div', 'chip', forMe ? '🔔 الحدث عليك' : 'الحدث على ' + esc(p ? p.name : '')));
      if (pen.kind === 'asalni' || pen.kind === 'arkiz') {
        box.appendChild(el('div', 'wfull', cardBothHTML(pen.kind, pen.card)));
        if (pen.kind === 'arkiz' && pen.timer && pen.timer.sec) {
          const t = pen.timer;
          const left = t.running ? Math.max(0, Math.ceil((t.endsAt - Date.now()) / 1000)) : t.left;
          box.appendChild(el('div', 'timer' + (left <= 0 ? ' done' : (left <= 5 ? ' warn' : '')), left <= 0 ? 'انتهى' : AR(left) + '″'));
        }
        box.appendChild(el('div', 'sm muted', forMe
          ? (pen.kind === 'asalni' ? 'قول إجابتك بصوت عالي — الحكم يقيّمها ويمنحك النقاط.' : 'نفّذ التحدي قبل ما يخلص الوقت.')
          : 'الحكم بيقيّم إجابته الآن…'));
      } else if (pen.kind === 'salakt') {
        box.appendChild(el('div', 'wfull', cardBothHTML('salakt', pen.card)));
      } else if (pen.kind === 'gain') {
        box.appendChild(el('div', 'wfull', cardBothHTML('hababa', pen.card)));
        if (forMe) box.appendChild(el('div', 'sm muted', 'كرت هبابة جاي ليك — خبّيه لوقته.'));
      } else {
        box.appendChild(el('div', 'wfull', cardBothHTML('tile', null, { tile: pen.tile })));
      }
      box.appendChild(phrasesRow());
      return;
    }

    /* النرد */
    const dc = el('div', 'dice'); box.appendChild(dc); paintDice(dc, st.dice);
    if (mine) {
      const b = el('button', 'btn lg ok', '🎲 رمي النرد');
      b.onclick = () => { Snd.ready(); Snd.play('dice'); rollingUntil = Date.now() + 620; paintDice(dc, st.dice); sendAct('roll'); };
      box.appendChild(b);
    } else {
      box.appendChild(el('div', 'sm muted', 'انتظر دورك… ويمكنك استخدام كرت هبابة في أي وقت مسموح.'));
    }
    box.appendChild(phrasesRow());
  }

  function phrasesRow() {
    const list = (window.WOLAAT_CARDS && window.WOLAAT_CARDS.phrases) || [];
    const row = el('div', 'row', ''); row.style.flexWrap = 'wrap'; row.style.justifyContent = 'center'; row.style.gap = '4px';
    list.slice(0, 6).forEach((t) => {
      const b = el('button', 'btn xs ghost', esc(t));
      b.onclick = () => sendAct('chat', { text: t });
      row.appendChild(b);
    });
    const more = el('button', 'btn xs ghost', '💬 الونسة');
    more.onclick = () => openChat();
    row.appendChild(more);
    return row;
  }

  function renderPlayHand(st, me) {
    const box = $('pl-hand'); box.innerHTML = '';
    $('pl-handnote').textContent = me ? AR(me.hand.length) + ' من ' + AR(W.MAX_HAND) + ' كروت' : '';
    if (!me) { box.innerHTML = '<div class="sm muted">شاشة متابعة فقط.</div>'; return; }
    if (!me.hand.length) { box.innerHTML = '<div class="sm muted">ما في كروت هبابة في يدك حاليًا.</div>'; return; }

    me.hand.forEach((h) => {
      const card = h.i != null ? W.cardData('hababa', h.i) : null;
      const d = el('div', 'pcard');
      d.innerHTML = `<div class="top">
          ${miniCard('hababa', h.i, true, false)}
          <div class="grow">
            <div class="pname">${card ? esc(card.title) : 'كرت مغلق'}</div>
            <div class="pmeta">${h.opening ? '🔒 كرت البداية — مغلق عن الجميع' : '👁️ مكتسب — مفتوح للجميع'}</div>
          </div></div>
        <div class="tiny" style="line-height:1.6">${card ? esc(card.text) : (st.sealed ? 'كرت مغلق تمامًا — يتكشّف لحظة استخدامه.' : 'اضغط «اطّلع» لترى كرتك — إنت والحكم بس.')}</div>`;
      const row = el('div', 'row', ''); row.style.flexWrap = 'wrap'; row.style.gap = '4px';
      if (!card) {
        if (st.sealed) {
          const use = el('button', 'btn xs no', '🔥 استخدمه مغلقًا');
          use.disabled = me.block > 0;
          use.onclick = () => dialog('كرت مغلق', '<div class="sm">هذا كرت البداية — مغلق تمامًا حتى عليك. تستخدمه على البركة؟</div>',
            [{ label: 'لسّع' }, { label: '🔥 ولّعها', cls: 'no', fn: () => { sendAct('hababa', { uid: h.uid }); toast('انتظر موافقة الحكم…'); } }]);
          row.appendChild(use);
        } else {
          const pk = el('button', 'btn xs info', '👁️ اطّلع على كرتك');
          pk.onclick = () => { const r = sendAct('peek', { uid: h.uid }); if (r && r.card) showPeek(h.uid, r.card); };
          row.appendChild(pk);
        }
      } else {
        const canNow = card.timing !== 'own' || (st.players[st.turn] && st.players[st.turn].id === me.id);
        const use = el('button', 'btn xs ' + (canNow ? 'no' : 'ghost'), '🔥 استخدم الكرت');
        use.disabled = !canNow || me.block > 0;
        use.onclick = () => useHababa(st, me, h, card);
        row.appendChild(use);
        if (!canNow) row.appendChild(el('span', 'tiny muted', 'في دورك فقط'));
        if (me.block > 0) row.appendChild(el('span', 'tiny muted', 'ممنوع مؤقتًا'));
      }
      d.appendChild(row);
      box.appendChild(d);
    });
  }
  function showPeek(uid, card) {
    if (!card) { toast('ما لقينا الكرت.'); return; }
    dialog('كرتك المغلق', `<div class="cardwrap" style="height:44vh">${cardFaceHTML('hababa', card)}</div>
      <div class="tiny muted" style="text-align:center;margin-top:6px">شوفته إنت والحكم بس — بقية اللاعبين ما يعرفوه.</div>`,
      [{ label: 'إغلاق' }, { label: '🔥 استخدمه الآن', cls: 'no', fn: () => {
        const st = playView();
        const me = meView(st); const h = me && me.hand.find((x) => x.uid === uid);
        if (me && h) useHababa(st, me, h, card);
      } }]);
  }
  function useHababa(st, me, h, card) {
    const need = W.needs(card.fx);
    if (need === 'player') {
      const others = st.players.filter((p) => p.id !== me.id);
      dialog('اختر الهدف', `<div class="sm muted" style="margin-bottom:8px">${esc(card.title)} — ${esc(card.text)}</div>
        <div class="row" style="flex-wrap:wrap" id="hp-row">${others.map((p) =>
          `<button class="btn sm ghost" data-p="${p.id}">${iconOf(p.color)} ${esc(p.name)} <span class="tiny">(${AR(p.score)})</span></button>`).join('')}</div>`,
        [{ label: 'إلغاء' }]);
      $('m-body').querySelectorAll('[data-p]').forEach((b) => b.onclick = () => {
        closeDialog(); sendAct('hababa', { uid: h.uid, target: b.dataset.p }); toast('انتظر موافقة الحكم…');
      });
      return;
    }
    if (need === 'tile') {
      toast('اضغط على الخانة اللي تبغاها في الرقعة.');
      picking = { kind: 'tile', cb: (i) => { sendAct('hababa', { uid: h.uid, tile: i }); toast('انتظر موافقة الحكم…'); } };
      paintBoard($('pl-board'), st);
      return;
    }
    dialog('تأكيد', `<div class="sm">تبغى تستخدم <b>${esc(card.title)}</b>؟<br>${esc(card.text)}</div>`, [
      { label: 'لسّع' },
      { label: '🔥 ولّعها', cls: 'no', fn: () => { sendAct('hababa', { uid: h.uid }); toast('انتظر موافقة الحكم…'); } },
    ]);
  }

  /* ═══════════════════════════ الونسة والقوائم ═══════════════════════════ */
  function openChat() {
    const list = (window.WOLAAT_CARDS && window.WOLAAT_CARDS.phrases) || [];
    const msgs = (S && S.chat) || [];
    dialog('💬 الونسة', `
      <div class="chatbox" style="max-height:34vh;overflow-y:auto;background:rgba(0,0,0,.25);border-radius:12px" id="ch-list">
        ${msgs.length ? msgs.map((m) => `<div><b>${esc(m.name)}:</b> ${esc(m.text)}</div>`).join('') : '<div class="muted sm">ما في ونسة بعد.</div>'}
      </div>
      <div class="row" style="margin-top:8px"><input class="field grow" id="ch-in" placeholder="اكتب كلمتك…" maxlength="140">
        <button class="btn sm ok" id="ch-send">إرسال</button></div>
      <div class="phrases">${list.map((t, i) => `<button class="btn xs ghost" data-ph="${i}">${esc(t)}</button>`).join('')}</div>`,
      [{ label: 'إغلاق' }]);
    const send = (t) => {
      if (!t) return;
      if (role === 'judge' && !soloPid) { W.chat(S, 'judge', t); after(); } else sendAct('chat', { text: t });
      closeDialog();
    };
    $('ch-send').onclick = () => send($('ch-in').value.trim());
    $('ch-in').onkeydown = (e) => { if (e.key === 'Enter') send($('ch-in').value.trim()); };
    $('m-body').querySelectorAll('[data-ph]').forEach((b) => b.onclick = () => send(list[+b.dataset.ph]));
  }

  function openMenu(isJudge) {
    const rows = [];
    rows.push(`<button class="btn sm ghost" data-m="rules">📖 القواعد</button>`);
    rows.push(`<button class="btn sm ghost" data-m="sound">${prefs.sound ? '🔊 الأصوات: شغّالة' : '🔇 الأصوات: مقفولة'}</button>`);
    if (isJudge) {
      rows.push(`<button class="btn sm ghost" data-m="log">📜 سجل الجولة</button>`);
      rows.push(`<button class="btn sm ghost" data-m="save">💾 حفظ اللعبة</button>`);
      rows.push(`<button class="btn sm ghost" data-m="lobby">👥 غرفة الانتظار</button>`);
      rows.push(`<button class="btn sm no" data-m="new">🔄 لعبة جديدة</button>`);
    }
    rows.push(`<button class="btn sm no" data-m="home">🚪 خروج للرئيسية</button>`);
    dialog('☰ القائمة', `<div class="col" style="gap:6px">${rows.join('')}</div>`, [{ label: 'إغلاق' }]);
    $('m-body').querySelectorAll('[data-m]').forEach((b) => b.onclick = () => {
      const m = b.dataset.m; closeDialog();
      if (m === 'rules') { renderRules(); show('v-rules'); }
      else if (m === 'sound') { prefs.sound = !prefs.sound; savePrefs(); toast(prefs.sound ? 'الأصوات شغّالة.' : 'الأصوات مقفولة.'); }
      else if (m === 'log') {
        dialog('📜 سجل الجولة', `<div class="logbox" style="max-height:56vh;overflow-y:auto">${
          (S.log || []).slice(0, 60).map((l) => `<div class="k-${l.kind || 'n'}">${esc(l.text)}</div>`).join('') ||
          '<div class="muted sm">ما في أحداث بعد.</div>'}</div>`, [{ label: 'إغلاق' }]);
      }
      else if (m === 'save') { autosave(); toast('انحفظت.'); }
      else if (m === 'lobby') { show('v-lobby'); renderLobby(); }
      else if (m === 'new') newGame();
      else if (m === 'home') {
        if (host) { try { host.close(); } catch (e) {} host = null; }
        if (client) { try { client.close(); } catch (e) {} client = null; }
        role = null; soloPid = null; show('v-home'); renderHome();
      }
    });
  }
  $('b-pmenu').onclick = () => openMenu(false);
  $('b-pchat').onclick = () => openChat();

  function newGame() {
    dialog('لعبة جديدة', '<div>نبدأ من جديد بنفس اللاعبين ونفس الرمز؟</div>', [
      { label: 'إلغاء' },
      { label: 'ابدأ من جديد', cls: 'ok', fn: () => {
        const r = W.start(S);
        if (!r.ok) { toast(r.msg); return; }
        undoStack = []; soloPid = null; show('v-judge'); after(); FX.confetti(40); Snd.play('start');
      } },
    ]);
  }

  function winnerHTML(st) {
    st = st || S;
    const rank = st.players.slice().sort((a, b) => b.score - a.score || b.laps - a.laps);
    const w = rank[0];
    return `<div class="winner">
      <div class="crown">🏆</div>
      <div class="wname">${esc(w ? w.name : '—')}</div>
      <div class="chip" style="font-size:14px">🔥 الولّاع — ${AR(w ? w.score : 0)} نقطة</div>
      <div class="rank">${rank.map((p, i) => `<div class="r${i === 0 ? ' first' : ''}">
        <div class="avatar" style="width:24px;height:24px;font-size:12px;background:${hexOf(p.color)}">${iconOf(p.color)}</div>
        <div class="grow sm" style="font-weight:900">${AR(i + 1)}. ${esc(p.name)}</div>
        <div class="chip" style="color:var(--gold-2)">${AR(p.score)}</div></div>`).join('')}</div></div>`;
  }

  function renderLog(box) {
    box.innerHTML = (S.log || []).slice(0, 26).map((l) => `<div class="k-${l.kind || 'n'}">${esc(l.text)}</div>`).join('');
  }

  /* ═══════════════════════════ القواعد ═══════════════════════════ */
  function renderRules() {
    const src = W.decksSource();
    $('rules-body').innerHTML = `
    <div class="panel pad" style="max-width:900px;margin:0 auto">
      <h2 style="color:var(--gold-2);margin:0 0 6px">🔥 ولعت — باختصار</h2>
      <p>ارمِ الزهرة ← تحرّك ← واجه الحدث ← اجمع النقاط ← استخدم <b>الهبابة</b> في الوقت المناسب ←
      وما تثق في تقدّمك حتى آخر جولة. أول واحد يوصل <b>${AR(S ? S.target : 50)}</b> نقطة يفتح
      <b>الجولة الأخيرة</b>، وبعدها صاحب أعلى رصيد يأخذ لقب <b style="color:var(--gold-2)">الولّاع</b>.</p>

      <h3 style="color:var(--gold-2)">من يلعب؟</h3>
      <p>ثلاثة أشخاص أو أكثر: <b>حكم</b> واحد يفتح الغرفة ويدير الجولة، و<b>لاعبان</b> على الأقل (حتى ستة).</p>
      <ul>
        <li><b>الحكم</b> يرى الرقعة كاملة ومواقع اللاعبين وكل الكروت — حتى المغلقة — والإجابات النموذجية،
            وهو من يؤكّد الإجابات والتحديات ويمنح النقاط كاملة أو <b>جزئية</b> (مثلًا ٥ من ١٠ لإجابة ناقصة).</li>
        <li><b>اللاعب</b> يرى الرقعة ونرده في دوره والكرت المطروح في الجولة، ونتيجته ونتيجة الخصم فوق،
            وكروت الهبابة: المكتسب <b>مفتوح</b>، وكرت البداية <b>مغلق دائمًا</b> عن الجميع — يستخدمه في أي جولة أو في آخر اللعبة.</li>
      </ul>

      <h3 style="color:var(--gold-2)">الخانات</h3>
      <ul>
        <li>🔵 <b>أسألني</b> — سؤال عن السودان بنقاط ٥ / ١٠ / ١٥، والحكم يقيّم الإجابة.</li>
        <li>🟠 <b>أركز</b> — تحدي بمؤقّت: تمثيل، سرعة، ذاكرة، ارتجال.</li>
        <li>🟢 <b>يا سلكت يا فككت</b> — حظ يرفعك أو يوقعك، ينفّذ فورًا.</li>
        <li>🔴 <b>كرت هبابة</b> — تكسب كرتًا استراتيجيًا تحتفظ به لوقته (٣ كروت كحد أقصى).</li>
        <li>💰 <b>جكة</b> نقاط فورية · 💥 <b>فككت</b> خصم فوري · 🌴 <b>ريح ضهرك</b> تفقد دورك</li>
        <li>🛺 <b>الركشة</b> تقدّم سريع · 🛖 <b>الراكوبة</b> حماية ورمية إضافية · 🚪 <b>النفاج</b> انتقال أو تبديل</li>
        <li>🏁 <b>النهاية</b> ١٠ نقاط وكرت هبابة · واللفّة الكاملة حول الرقعة تعطي ٥ نقاط.</li>
      </ul>

      <h3 style="color:var(--gold-2)">الهبابة — روح اللعبة</h3>
      <p>كل لاعب يبدأ بكرت هبابة <b>مغلق</b>، ويكسب غيره من الخانات الحمراء وكروت الحظ.
      بعض الكروت تُستخدم <b>في أي وقت</b> — حتى في دور غيرك — وبعضها في دورك فقط.
      كل استخدام يمرّ على الحكم للموافقة، ومن عنده <b>كرت الدرع</b> يقدر يلغي الكرت المستخدم ضده.</p>

      <h3 style="color:var(--gold-2)">الجولة الأخيرة</h3>
      <p>الوصول للهدف ما يعني الفوز: تبدأ جولة أخيرة يقدر فيها الجميع يولّعوا كروت الهبابة،
      وكرت <b>الفرملة</b> يضيف جولة كاملة إضافية. بعد انتهائها تُحتسب النتائج.</p>

      <h3 style="color:var(--gold-2)">طرق اللعب</h3>
      <ul>
        <li>📱 <b>جهاز واحد</b> — الجهاز مع الحكم، وفي دور كل لاعب يفتح له شاشته الخاصة. بدون إنترنت.</li>
        <li>🖥️ <b>نوافذ متعددة</b> — نافذة لكل لاعب على نفس الجهاز. بدون إنترنت.</li>
        <li>🌐 <b>أجهزة مختلفة</b> — كل واحد بجواله برمز الغرفة. يحتاج إنترنت.</li>
      </ul>
      <p class="tiny muted">المجموعة الحالية: أسألني ${AR(src.asalni.length)} · أركز ${AR(src.arkiz.length)} ·
      يا سلكت يا فككت ${AR(src.salakt.length)} · هبابة ${AR(src.hababa.length)}.
      تضيف كروتًا جديدة من ملف <b>cards.js</b> أو من شاشة «الكروت».</p>
    </div>`;
  }

  /* ═══════════════════════════ إدارة الكروت ═══════════════════════════ */
  function renderCards() {
    const base = window.WOLAAT_CARDS || {}, extra = window.WOLAAT_EXTRA_CARDS || {};
    const rows = [['asalni', 'أسألني', '🔵'], ['arkiz', 'أركز', '🟠'], ['salakt', 'يا سلكت يا فككت', '🟢'], ['hababa', 'الهبابة', '🔴']];
    $('cd-counts').innerHTML = rows.map(([k, n, e]) => `
      <div class="row" style="justify-content:space-between;background:rgba(0,0,0,.25);padding:5px 9px;border-radius:11px">
        <span>${e} ${n}</span>
        <span class="chip">${AR((base[k] || []).length)}${(extra[k] || []).length ? ' + ' + AR(extra[k].length) : ''}</span>
      </div>`).join('') + `<div class="tiny muted">النسخة: ${esc(base.version || '—')}</div>`;
    $('cd-status').textContent = '';
  }
  $('b-cd-sample').onclick = () => {
    $('cd-json').value = JSON.stringify({
      asalni: [{ q: 'سؤالك هنا؟', a: 'الإجابة النموذجية', pts: 10, cat: 'تاريخ' }],
      arkiz:  [{ text: 'نص التحدي', pts: 10, sec: 20 }],
      salakt: [{ kind: 'salakt', text: 'سلكت! تقدّم خانتين.', fx: { move: 2 } }],
      hababa: [{ title: 'اسم الكرت', text: 'شرح الكرت', fx: { pts: 10 }, timing: 'anytime' }],
    }, null, 2);
    $('cd-status').textContent = 'عدّل النموذج ثم اضغط «أضف الكروت».';
  };
  $('b-cd-add').onclick = () => {
    let j;
    try { j = JSON.parse($('cd-json').value); }
    catch (e) { $('cd-status').innerHTML = '<span style="color:#FFA9A0">JSON غير صحيح — راجع الأقواس والفواصل.</span>'; return; }
    const cur = window.WOLAAT_EXTRA_CARDS || {};
    let added = 0;
    ['asalni', 'arkiz', 'salakt', 'hababa'].forEach((k) => {
      if (!Array.isArray(j[k])) return;
      cur[k] = (cur[k] || []).concat(j[k]); added += j[k].length;
    });
    if (!added) { $('cd-status').innerHTML = '<span style="color:#FFA9A0">ما لقينا كروت — لازم مفاتيح asalni / arkiz / salakt / hababa.</span>'; return; }
    window.WOLAAT_EXTRA_CARDS = cur; writeJSON(EXTRA, cur); W.refreshCards();
    $('cd-json').value = ''; renderCards(); renderHome();
    $('cd-status').innerHTML = `<span style="color:#9DE8B8">تمّت إضافة ${AR(added)} كرت على هذا الجهاز ✓</span>`;
    toast('انضافت ' + added + ' كرت.');
  };
  $('cd-file').onchange = (e) => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { $('cd-json').value = String(r.result || ''); $('cd-status').textContent = 'الملف انقرأ — اضغط «أضف الكروت».'; };
    r.readAsText(f, 'utf-8');
  };
  $('b-cd-clear').onclick = () => {
    dialog('مسح الكروت المضافة', '<div>الكروت المضافة على هذا الجهاز بس — كروت cards.js تبقى.</div>', [
      { label: 'إلغاء' },
      { label: 'امسح', cls: 'no', fn: () => {
        window.WOLAAT_EXTRA_CARDS = {}; try { localStorage.removeItem(EXTRA); } catch (e) {}
        W.refreshCards(); renderCards(); renderHome(); toast('انمسحت.');
      } },
    ]);
  };

  /* ═══════════════════════════ الحلقة العامة ═══════════════════════════ */
  function renderAll() {
    if (!S) return;
    const active = document.querySelector('.view.active');
    const id = active ? active.id : '';
    if (S.phase === 'lobby' && (id === 'v-judge' || id === 'v-play')) { show('v-lobby'); }
    if (id === 'v-lobby' && S.phase !== 'lobby') { show(role === 'judge' ? 'v-judge' : 'v-play'); return; }
    if (id === 'v-lobby') renderLobby();
    if (id === 'v-judge') renderJudge();
    if (id === 'v-play')  renderPlay();
    if (role === 'player' && S.phase !== 'lobby' && id !== 'v-play' && id !== 'v-rules' && id !== 'v-cards') show('v-play');
    handleCue();
  }
  function handleCue() {
    if (!S || !S.cue) return;
    const k = S.cue.at;
    if (lastCue === k) return;
    lastCue = k;
    Snd.play(S.cue.name);
    if (S.cue.name === 'win') FX.confetti(140);
    if (S.cue.name === 'hababa') FX.burst();
    if (S.cue.name === 'final') FX.confetti(40);
  }

  /* مؤقّت العرض: يحدّث العدّاد التنازلي وأنيميشن النرد */
  setInterval(() => {
    const active = document.querySelector('.view.active');
    if (!S || !active) return;
    const pen = S.pending;
    if (pen && pen.timer && pen.timer.running) {
      if (active.id === 'v-judge') {
        const left = Math.max(0, Math.ceil((pen.timer.endsAt - Date.now()) / 1000));
        const tm = $('jz-event').querySelector('.timer');
        if (tm) { tm.textContent = left <= 0 ? 'انتهى' : AR(left) + '″'; tm.className = 'timer' + (left <= 0 ? ' done' : (left <= 5 ? ' warn' : '')); }
        if (left <= 0 && role === 'judge') { W.timer(S, 'pause'); Snd.play('bad'); renderJudge(); broadcast(); }
      } else if (active.id === 'v-play') {
        const left = Math.max(0, Math.ceil((pen.timer.endsAt - Date.now()) / 1000));
        const tm = $('pl-action').querySelector('.timer');
        if (tm) { tm.textContent = left <= 0 ? 'انتهى' : AR(left) + '″'; tm.className = 'timer' + (left <= 0 ? ' done' : (left <= 5 ? ' warn' : '')); }
      }
    }
  }, 250);

  /* ═══════════════════════════ الإقلاع ═══════════════════════════ */
  const bj = el('button', 'btn xs info hidden', '↩️ للحكم');
  bj.id = 'b-back-judge';
  bj.onclick = () => { soloPid = null; picking = null; show('v-judge'); };
  document.querySelector('#v-play .topbar').insertBefore(bj, $('pl-code'));

  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDialog(); });
  renderHome();
  if ('serviceWorker' in navigator) {
    addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
  /* رمز غرفة من الرابط: index.html#AB12 */
  if (location.hash.length > 1) {
    const c = location.hash.slice(1).toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (c) { show('v-join'); $('j-code').value = c; }
  }
})();
