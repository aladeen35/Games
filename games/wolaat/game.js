/* ============================================================================
   ولعت — محرّك اللعبة (منطق خالص، بلا واجهة)
   الحكم هو المرجع: كل الحسابات تجري على جهازه ثم تُبثّ للاعبين.
   ============================================================================ */
(function (root) {
  'use strict';

  /* ─────────────────────────── أنواع الخانات ─────────────────────────── */
  const TYPES = {
    start:   { name: 'البداية',           emoji: '🚩', cls: 'start' },
    asalni:  { name: 'أسألني',            emoji: '❓', cls: 'asalni' },
    arkiz:   { name: 'أركز',              emoji: '🎯', cls: 'arkiz' },
    salakt:  { name: 'يا سلكت يا فككت',   emoji: '🔗', cls: 'salakt' },
    hababa:  { name: 'كرت هبابة',         emoji: '🔥', cls: 'hababa' },
    jakka:   { name: 'جكة',               emoji: '💰', cls: 'bonus' },
    fakakt:  { name: 'فككت',              emoji: '💥', cls: 'malus' },
    reeh:    { name: 'ريح ضهرك',          emoji: '🌴', cls: 'rest' },
    rakshah: { name: 'الركشة',            emoji: '🛺', cls: 'move' },
    rakoba:  { name: 'الراكوبة',          emoji: '🛖', cls: 'rest' },
    nafaj:   { name: 'النفاج',            emoji: '🚪', cls: 'warp' },
    end:     { name: 'النهاية',           emoji: '🏁', cls: 'end' },
  };

  /* ───────────────── الرقعة: 40 خانة على محيط مربع 11×11 ─────────────────
     البداية في أعلى اليمين، والحركة يمين ← يسار (باتجاه القراءة العربية).
     الأركان: 0 البداية، 10 الركشة، 20 النهاية، 30 الراكوبة.               */
  const BOARD = [
    { t: 'start'                                     }, /* 0  */
    { t: 'asalni'                                    }, /* 1  */
    { t: 'arkiz'                                     }, /* 2  */
    { t: 'salakt'                                    }, /* 3  */
    { t: 'jakka',   fx: { pts: 5 },  label: '+5'     }, /* 4  */
    { t: 'asalni'                                    }, /* 5  */
    { t: 'reeh',    fx: { skip: 1 }                  }, /* 6  */
    { t: 'arkiz'                                     }, /* 7  */
    { t: 'nafaj',   fx: { moveTo: 'choice' }         }, /* 8  */
    { t: 'fakakt',  fx: { pts: -5 }, label: '−5'     }, /* 9  */
    { t: 'rakshah', fx: { move: 5 }                  }, /* 10 ركن */
    { t: 'asalni'                                    }, /* 11 */
    { t: 'arkiz'                                     }, /* 12 */
    { t: 'salakt'                                    }, /* 13 */
    { t: 'hababa'                                    }, /* 14 */
    { t: 'asalni'                                    }, /* 15 */
    { t: 'arkiz'                                     }, /* 16 */
    { t: 'jakka',   fx: { pts: 10 }, label: '+10'    }, /* 17 */
    { t: 'salakt'                                    }, /* 18 */
    { t: 'asalni'                                    }, /* 19 */
    { t: 'end',     fx: { pts: 10, giveHababa: 1 }   }, /* 20 ركن */
    { t: 'arkiz'                                     }, /* 21 */
    { t: 'salakt'                                    }, /* 22 */
    { t: 'asalni'                                    }, /* 23 */
    { t: 'fakakt',  fx: { pts: -10 }, label: '−10'   }, /* 24 */
    { t: 'arkiz'                                     }, /* 25 */
    { t: 'hababa'                                    }, /* 26 */
    { t: 'asalni'                                    }, /* 27 */
    { t: 'salakt'                                    }, /* 28 */
    { t: 'reeh',    fx: { skip: 1 }                  }, /* 29 */
    { t: 'rakoba',  fx: { shield: 1, extraRoll: true } }, /* 30 ركن */
    { t: 'arkiz'                                     }, /* 31 */
    { t: 'asalni'                                    }, /* 32 */
    { t: 'salakt'                                    }, /* 33 */
    { t: 'nafaj',   fx: { swapPos: 'choice' }        }, /* 34 */
    { t: 'arkiz'                                     }, /* 35 */
    { t: 'jakka',   fx: { pts: 5 },  label: '+5'     }, /* 36 */
    { t: 'asalni'                                    }, /* 37 */
    { t: 'hababa'                                    }, /* 38 */
    { t: 'salakt'                                    }, /* 39 */
  ];

  const N = BOARD.length;        /* 40 */
  const GRID = 11;               /* 11×11 → محيطه 40 خانة بالضبط */
  const END_TILE = 20;
  const MAX_HAND = 3;            /* أقصى عدد كروت هبابة في اليد */

  /** موقع الخانة على شبكة 11×11 (صفوف/أعمدة تبدأ من 1) */
  function tileCell(i) {
    if (i <= 10)  return { r: 1, c: GRID - i };
    if (i <= 20)  return { r: 1 + (i - 10), c: 1 };
    if (i <= 30)  return { r: GRID, c: 1 + (i - 20) };
    return { r: GRID - (i - 30), c: GRID };
  }

  const COLORS = [
    { id: 'green',  name: 'النمر الأخضر',    hex: '#2E9E5B' },
    { id: 'orange', name: 'الغزال البرتقالي', hex: '#E8762C' },
    { id: 'red',    name: 'الأسد الأحمر',     hex: '#D33A34' },
    { id: 'blue',   name: 'الصقر الأزرق',     hex: '#2F6FB5' },
    { id: 'purple', name: 'الفهد البنفسجي',   hex: '#8659B5' },
    { id: 'gold',   name: 'السلوقي الذهبي',   hex: '#D9A21B' },
  ];

  /* ───────────────────────────── أدوات ───────────────────────────── */
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const rnd = (n) => Math.floor(Math.random() * n);
  function shuffled(n) {
    const a = Array.from({ length: n }, (_, i) => i);
    for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function code4() {
    const L = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    return Array.from({ length: 4 }, () => L[rnd(L.length)]).join('');
  }

  /* مجموعات الكروت المتاحة (بيانات cards.js + أي كروت مضافة من الإعدادات) */
  let _srcCache = null, _srcKey = '';
  function decksSource() {
    const base = root.WOLAAT_CARDS || {};
    const extra = root.WOLAAT_EXTRA_CARDS || {};
    const key = (base.version || '') + '|' + (extra.version || '') + '|' +
      ['asalni', 'arkiz', 'salakt', 'hababa'].map((k) => (base[k] || []).length + '.' + (extra[k] || []).length).join(',');
    if (_srcCache && _srcKey === key) return _srcCache;
    const join = (k) => (base[k] || []).concat(extra[k] || []);
    _srcKey = key;
    _srcCache = { asalni: join('asalni'), arkiz: join('arkiz'), salakt: join('salakt'), hababa: join('hababa') };
    return _srcCache;
  }
  function refreshCards() { _srcCache = null; _srcKey = ''; }

  /* ───────────────────────── إنشاء اللعبة ───────────────────────── */
  function create(opts) {
    opts = opts || {};
    const src = decksSource();
    return {
      v: 1,
      code: opts.code || code4(),
      mode: opts.mode || 'solo',
      target: opts.target || 50,
      judgeName: opts.judgeName || 'الحكم',
      sealed: !!opts.sealed,   /* كرت البداية مغلق تمامًا حتى على صاحبه */
      phase: 'lobby',
      players: [],
      turn: 0,
      round: 1,
      dice: null,
      pending: null,
      request: null,          /* طلب استخدام هبابة ينتظر موافقة الحكم */
      decks: {
        asalni: shuffled(src.asalni.length),
        arkiz:  shuffled(src.arkiz.length),
        salakt: shuffled(src.salakt.length),
        hababa: shuffled(src.hababa.length),
      },
      discard: { asalni: [], arkiz: [], salakt: [], hababa: [] },
      counts: { asalni: src.asalni.length, arkiz: src.arkiz.length, salakt: src.salakt.length, hababa: src.hababa.length },
      uidSeq: 1,
      final: false,
      finalBy: null,
      finalLeft: 0,
      winner: null,
      log: [],
      chat: [],
      cue: null,              /* إشارة صوت/أثر بصري لآخر حدث */
    };
  }

  function addPlayer(s, p) {
    if (s.players.length >= 6) return { ok: false, msg: 'أقصى عدد لاعبين ستة.' };
    if (s.phase !== 'lobby')   return { ok: false, msg: 'اللعبة بدأت — ما في إضافة لاعبين.' };
    const taken = s.players.map((x) => x.color);
    const color = (p.color && !taken.includes(p.color)) ? p.color
      : (COLORS.find((c) => !taken.includes(c.id)) || COLORS[0]).id;
    const pl = {
      id: p.id || ('p' + (s.players.length + 1)),
      name: (p.name || '').trim() || ('لاعب ' + (s.players.length + 1)),
      color, pos: 0, score: 0, hand: [],
      skip: 0, shield: 0, block: 0, double: false,
      laps: 0, connected: true, seat: s.players.length + 1,
    };
    s.players.push(pl);
    log(s, `دخل ${pl.name} الغرفة.`, 'join');
    return { ok: true, player: pl };
  }

  function removePlayer(s, id) {
    if (s.phase !== 'lobby') { const p = byId(s, id); if (p) p.connected = false; return; }
    s.players = s.players.filter((p) => p.id !== id);
    s.players.forEach((p, i) => { p.seat = i + 1; });
  }

  function start(s) {
    if (s.players.length < 2) return { ok: false, msg: 'لازم لاعبين اثنين على الأقل غير الحكم.' };
    /* كل لاعب يبدأ بكرت هبابة واحد — مغلق دائمًا عن بقية اللاعبين */
    s.players.forEach((p) => {
      p.pos = 0; p.score = 0; p.hand = []; p.skip = 0; p.shield = 0; p.block = 0; p.double = false; p.laps = 0;
      const c = draw(s, 'hababa'); if (c != null) p.hand.push({ uid: s.uidSeq++, i: c, faceUp: false, opening: true });
    });
    s.phase = 'playing';
    s.turn = 0; s.round = 1; s.dice = null; s.pending = null; s.request = null;
    s.final = false; s.finalBy = null; s.finalLeft = 0; s.winner = null;
    cue(s, 'start');
    log(s, `ولعت! الهدف ${s.target} نقطة. يبدأ ${s.players[0].name}.`, 'big');
    return { ok: true };
  }

  /* ───────────────────────────── الكروت ───────────────────────────── */
  function draw(s, type) {
    if (!s.counts[type]) return null;
    if (!s.decks[type].length) {                      /* خلط المرمي من جديد */
      s.decks[type] = s.discard[type].length ? s.discard[type].slice() : shuffled(s.counts[type]);
      s.discard[type] = [];
      for (let i = s.decks[type].length - 1; i > 0; i--) {
        const j = rnd(i + 1); const d = s.decks[type];[d[i], d[j]] = [d[j], d[i]];
      }
    }
    return s.decks[type].pop();
  }
  function cardData(type, i) {
    const src = decksSource();
    return (src[type] || [])[i] || null;
  }
  function toss(s, type, i) { if (i != null) s.discard[type].push(i); }

  /* ───────────────────────────── مساعدات ───────────────────────────── */
  const byId = (s, id) => s.players.find((p) => p.id === id) || null;
  const cur = (s) => s.players[s.turn] || null;
  function leader(s, exceptId) {
    return s.players.filter((p) => p.id !== exceptId).sort((a, b) => b.score - a.score || b.pos - a.pos)[0] || null;
  }
  function lastPlace(s, exceptId) {
    return s.players.filter((p) => p.id !== exceptId).sort((a, b) => a.score - b.score || a.pos - b.pos)[0] || null;
  }
  function log(s, text, kind) {
    s.log.unshift({ text, kind: kind || '', at: Date.now() });
    if (s.log.length > 80) s.log.pop();
  }
  function cue(s, name) { s.cue = { name, at: Date.now() + Math.random() }; }

  function addPts(s, p, n, why) {
    if (!p || !n) return;
    if (n > 0 && p.double) { n *= 2; p.double = false; log(s, `${p.name}: النقاط مضاعفة!`, 'fx'); }
    p.score = Math.max(0, p.score + n);
    log(s, `${p.name} ${n > 0 ? '+' : '−'}${Math.abs(n)} نقطة${why ? ' — ' + why : ''}`, n > 0 ? 'plus' : 'minus');
  }

  /** يحرّك اللاعب مع منح مكافأة اللفّة عند عبور البداية */
  function moveBy(s, p, n) {
    if (!n) return p.pos;
    const before = p.pos;
    let pos = (before + n) % N; if (pos < 0) pos += N;
    if (n > 0 && before + n >= N) { p.laps++; addPts(s, p, 5, 'لفّة كاملة حول الرقعة'); }
    p.pos = pos;
    return pos;
  }

  function nearestOfType(from, type) {
    for (let k = 1; k <= N; k++) { const i = (from + k) % N; if (BOARD[i].t === type) return i; }
    return from;
  }

  /* هل يحتاج هذا التأثير اختيار هدف؟ → 'player' | 'tile' | null */
  function needs(fx) {
    if (!fx) return null;
    if (fx.moveTo === 'choice') return 'tile';
    const P = ['swapScore', 'swapPos'];
    for (const k of P) if (fx[k] === 'choice') return 'player';
    const O = ['targetPts', 'targetMove', 'targetSkip', 'blockHababa'];
    for (const k of O) if (fx[k] && fx[k].who === 'choice') return 'player';
    if (fx.steal && fx.steal.from === 'choice') return 'player';
    if (fx.quiz === 'choice') return 'player';
    return null;
  }

  function pickTarget(s, who, self) {
    if (who === 'leader') return leader(s, self.id);
    if (who === 'last')   return lastPlace(s, self.id);
    if (who === 'self')   return self;
    return null;
  }

  /** يطبّق تأثير كرت/خانة. opts = { target: pid, tile: idx } */
  function apply(s, fx, p, opts) {
    opts = opts || {};
    const out = { extraRoll: false, quiz: null };
    if (!fx || !p) return out;
    const tgtChosen = opts.target ? byId(s, opts.target) : null;

    if (fx.pts) addPts(s, p, fx.pts);

    if (fx.steal) {
      const amt = fx.steal.amount;
      const victims = fx.steal.from === 'all'
        ? s.players.filter((x) => x.id !== p.id)
        : [fx.steal.from === 'choice' ? tgtChosen : pickTarget(s, fx.steal.from, p)].filter(Boolean);
      victims.forEach((v) => {
        if (v.shield > 0) { log(s, `${v.name} محمي — الكرت ما أثّر فيه.`, 'fx'); return; }
        const take = amt === 'half' ? Math.floor(v.score / 2) : Math.min(amt, v.score);
        if (!take) return;
        v.score -= take; p.score += take;
        log(s, `${p.name} سحب ${take} نقطة من ${v.name}.`, 'fx');
      });
      cue(s, 'hababa');
    }

    if (fx.swapScore) {
      const v = fx.swapScore === 'choice' ? tgtChosen : pickTarget(s, fx.swapScore, p);
      if (v && v.shield <= 0) { const t = p.score; p.score = v.score; v.score = t; log(s, `تبديل نقاط: ${p.name} ↔ ${v.name}`, 'fx'); cue(s, 'hababa'); }
      else if (v) log(s, `${v.name} محمي — ما تم التبديل.`, 'fx');
    }

    if (fx.swapPos) {
      const v = fx.swapPos === 'choice' ? tgtChosen : pickTarget(s, fx.swapPos, p);
      if (v && v.shield <= 0) { const t = p.pos; p.pos = v.pos; v.pos = t; log(s, `تبديل مواقع: ${p.name} ↔ ${v.name}`, 'fx'); cue(s, 'hababa'); }
      else if (v) log(s, `${v.name} محمي — ما تم التبديل.`, 'fx');
    }

    if (fx.targetPts) {
      const v = fx.targetPts.who === 'choice' ? tgtChosen : pickTarget(s, fx.targetPts.who, p);
      if (v) {
        if (fx.targetPts.pts < 0 && v.shield > 0) log(s, `${v.name} محمي — ما تأثّر.`, 'fx');
        else addPts(s, v, fx.targetPts.pts);
      }
    }

    if (fx.targetMove) {
      const v = fx.targetMove.who === 'choice' ? tgtChosen : pickTarget(s, fx.targetMove.who, p);
      if (v) {
        if (v.shield > 0) log(s, `${v.name} محمي — ما اتحرّك.`, 'fx');
        else { moveBy(s, v, fx.targetMove.n); log(s, `${v.name} ${fx.targetMove.n > 0 ? 'تقدّم' : 'رجع'} ${Math.abs(fx.targetMove.n)} خانات.`, 'fx'); }
      }
    }

    if (fx.targetSkip) {
      const v = fx.targetSkip.who === 'choice' ? tgtChosen : pickTarget(s, fx.targetSkip.who, p);
      if (v) {
        if (v.shield > 0) log(s, `${v.name} محمي — دوره سليم.`, 'fx');
        else { v.skip += fx.targetSkip.n; log(s, `${v.name} يفقد دوره القادم.`, 'fx'); }
      }
    }

    if (fx.blockHababa) {
      const v = fx.blockHababa.who === 'choice' ? tgtChosen : pickTarget(s, fx.blockHababa.who, p) || p;
      if (v) { v.block += fx.blockHababa.n; log(s, `${v.name} ممنوع من استخدام الهبابة لـ${fx.blockHababa.n} جولة.`, 'fx'); }
    }

    if (fx.moveTo !== undefined && fx.moveTo !== 'choice') { p.pos = ((fx.moveTo % N) + N) % N; log(s, `${p.name} انتقل إلى ${tileName(p.pos)}.`, 'fx'); }
    if (fx.moveTo === 'choice' && opts.tile != null) { p.pos = ((opts.tile % N) + N) % N; log(s, `${p.name} فتح ليه النفاج ونزل في ${tileName(p.pos)}.`, 'fx'); }
    if (fx.moveToNearest) { p.pos = nearestOfType(p.pos, fx.moveToNearest); log(s, `${p.name} انتقل إلى ${tileName(p.pos)}.`, 'fx'); }
    if (fx.move) { moveBy(s, p, fx.move); log(s, `${p.name} ${fx.move > 0 ? 'تقدّم' : 'رجع'} ${Math.abs(fx.move)} خانات.`, 'fx'); }

    if (fx.skip)   { p.skip += fx.skip; log(s, `${p.name} يفقد دوره القادم.`, 'fx'); }
    if (fx.shield) { p.shield += fx.shield; log(s, `${p.name} صار محمي من الهبابة لـ${fx.shield} دور.`, 'fx'); }
    if (fx.double) { p.double = true; log(s, `${p.name}: نقاط دوره القادم مضاعفة.`, 'fx'); }

    if (fx.giveHababa) {
      for (let k = 0; k < fx.giveHababa; k++) {
        if (p.hand.length >= MAX_HAND) { addPts(s, p, 5, 'يده مليانة كروت هبابة'); continue; }
        const c = draw(s, 'hababa');
        if (c == null) break;
        p.hand.push({ uid: s.uidSeq++, i: c, faceUp: true, opening: false });
        log(s, `${p.name} كسب كرت هبابة.`, 'fx'); cue(s, 'card');
      }
    }

    if (fx.extraRound) { s.finalLeft += s.players.length; log(s, 'الفرملة! جولة كاملة إضافية.', 'big'); cue(s, 'hababa'); }
    if (fx.extraRoll)  out.extraRoll = true;
    if (fx.quiz)       out.quiz = fx.quiz === 'choice' ? (opts.target || null) : null;

    return out;
  }

  const tileName = (i) => {
    const t = BOARD[i];
    return TYPES[t.t].name + (t.label ? ' ' + t.label : '') + ` (${i})`;
  };

  /* ───────────────────────────── رمي النرد ───────────────────────────── */
  function roll(s, pid, forced) {
    if (s.phase !== 'playing') return { ok: false, msg: 'اللعبة مو شغّالة.' };
    if (s.pending)             return { ok: false, msg: 'في حدث لسّع ما انحلّ.' };
    const p = cur(s);
    if (!p) return { ok: false, msg: 'ما في لاعب.' };
    if (pid && pid !== p.id && pid !== 'judge') return { ok: false, msg: 'مو دورك.' };

    const d = forced || (1 + rnd(6));
    s.dice = d;
    cue(s, 'dice');
    log(s, `${p.name} رمى النرد: ${d}`, 'dice');
    const from = p.pos;
    moveBy(s, p, d);
    landOn(s, p, from);
    return { ok: true, dice: d };
  }

  /** يبني الحدث المعلّق حسب الخانة التي وقف عليها اللاعب */
  function landOn(s, p, from) {
    const tile = BOARD[p.pos];
    log(s, `${p.name} وقف على ${tileName(p.pos)}.`, 'land');

    if (tile.t === 'asalni' || tile.t === 'arkiz') {
      const type = tile.t;
      const i = draw(s, type);
      const card = cardData(type, i);
      if (!card) { s.pending = null; nextTurn(s); return; }
      s.pending = {
        kind: type, pid: p.id, ci: i, card,
        max: card.pts || 10, award: card.pts || 10,
        timer: type === 'arkiz' ? { sec: card.sec || 0, left: card.sec || 0, running: false, endsAt: null } : null,
        from,
      };
      cue(s, 'card');
      return;
    }

    if (tile.t === 'salakt') {
      const i = draw(s, 'salakt');
      const card = cardData('salakt', i);
      if (!card) { nextTurn(s); return; }
      s.pending = { kind: 'salakt', pid: p.id, ci: i, card, need: needs(card.fx), from };
      cue(s, card.kind === 'salakt' ? 'good' : 'bad');
      return;
    }

    if (tile.t === 'hababa') {
      const i = draw(s, 'hababa');
      const card = cardData('hababa', i);
      if (!card) { nextTurn(s); return; }
      s.pending = { kind: 'gain', pid: p.id, ci: i, card, from };
      cue(s, 'card');
      return;
    }

    /* خانات الأحداث المباشرة */
    s.pending = { kind: 'tile', pid: p.id, tile: p.pos, t: tile.t, card: null, fx: tile.fx || null, need: needs(tile.fx), from };
    cue(s, tile.t === 'jakka' ? 'good' : (tile.t === 'fakakt' ? 'bad' : 'tile'));
  }

  /* ─────────────────────── حلّ الحدث المعلّق (الحكم) ───────────────────────
     dec = { award: n, ok: bool, target: pid, tile: idx }                    */
  function resolve(s, dec) {
    dec = dec || {};
    const pen = s.pending;
    if (!pen) return { ok: false, msg: 'ما في حدث معلّق.' };
    const p = byId(s, pen.pid);
    let extra = false;

    if (pen.kind === 'asalni' || pen.kind === 'arkiz') {
      const max = pen.max;
      let a = dec.award != null ? Math.round(dec.award) : (dec.ok ? max : 0);
      a = Math.max(0, Math.min(max, a));
      if (pen.forced) a = 0;                      /* تحدي إجباري بلا نقاط */
      addPts(s, p, a, a === max ? 'إجابة كاملة' : (a > 0 ? 'إجابة ناقصة' : 'ما وفّق'));
      cue(s, a >= max ? 'good' : (a > 0 ? 'partial' : 'bad'));
      toss(s, pen.kind, pen.ci);
      if (pen.quizFor) {                          /* كرت الونسة: الخصم أخطأ */
        const asker = byId(s, pen.quizFor);
        if (a === 0 && asker) addPts(s, asker, max, 'الونسة: الخصم ما عرف');
      }
      s.pending = null;
      if (pen.thenExtraRoll) { s.dice = null; return { ok: true }; }
      nextTurn(s); return { ok: true };
    }

    if (pen.kind === 'salakt' || pen.kind === 'tile') {
      const fx = pen.kind === 'salakt' ? pen.card.fx : pen.fx;
      if (dec.ok === false) { log(s, 'الحكم ألغى تنفيذ الكرت.', 'judge'); }
      else {
        const r = apply(s, fx, p, { target: dec.target, tile: dec.tile });
        extra = r.extraRoll;
        if (fx && fx.forceChallenge) {            /* تحدي أركز إجباري */
          const i = draw(s, 'arkiz'); const card = cardData('arkiz', i);
          if (card) {
            toss(s, 'salakt', pen.ci);
            s.pending = { kind: 'arkiz', pid: p.id, ci: i, card, max: 0, award: 0, forced: true,
              timer: { sec: card.sec || 0, left: card.sec || 0, running: false, endsAt: null } };
            return { ok: true };
          }
        }
      }
      if (pen.kind === 'salakt') toss(s, 'salakt', pen.ci);
      s.pending = null;
      if (extra) { s.dice = null; log(s, `${p.name} يرمي النرد مرة أخرى.`, 'fx'); return { ok: true }; }
      nextTurn(s); return { ok: true };
    }

    if (pen.kind === 'gain') {
      if (dec.ok === false) { toss(s, 'hababa', pen.ci); log(s, 'الحكم ألغى منح كرت الهبابة.', 'judge'); }
      else if (p.hand.length >= MAX_HAND) { toss(s, 'hababa', pen.ci); addPts(s, p, 5, 'يده مليانة كروت هبابة'); }
      else { p.hand.push({ uid: s.uidSeq++, i: pen.ci, faceUp: true, opening: false }); log(s, `${p.name} كسب «${pen.card.title}».`, 'fx'); cue(s, 'card'); }
      s.pending = null; nextTurn(s); return { ok: true };
    }

    return { ok: false, msg: 'نوع حدث غير معروف.' };
  }

  /* مؤقّت تحدي أركز */
  function timer(s, action) {
    const pen = s.pending;
    if (!pen || !pen.timer) return { ok: false };
    const t = pen.timer;
    if (action === 'start') { t.running = true; t.endsAt = Date.now() + t.left * 1000; cue(s, 'tick'); }
    else if (action === 'pause') { if (t.running) { t.left = Math.max(0, Math.round((t.endsAt - Date.now()) / 1000)); t.running = false; t.endsAt = null; } }
    else if (action === 'reset') { t.left = t.sec; t.running = false; t.endsAt = null; }
    return { ok: true };
  }

  /* ─────────────────────── استخدام كرت الهبابة ─────────────────────── */
  function requestHababa(s, pid, uid, target, tile) {
    const p = byId(s, pid);
    if (!p) return { ok: false, msg: 'لاعب غير موجود.' };
    if (s.phase !== 'playing') return { ok: false, msg: 'اللعبة مو شغّالة.' };
    if (p.block > 0) return { ok: false, msg: 'ممنوع تستخدم الهبابة حاليًا.' };
    if (s.request) return { ok: false, msg: 'في طلب هبابة لسّع عند الحكم.' };
    const h = p.hand.find((c) => c.uid === uid);
    if (!h) return { ok: false, msg: 'الكرت مو في يدك.' };
    const card = cardData('hababa', h.i);
    if (!card) return { ok: false, msg: 'كرت غير معروف.' };
    if (card.timing === 'own' && cur(s) && cur(s).id !== pid) return { ok: false, msg: 'هذا الكرت يُستخدم في دورك فقط.' };
    if (card.timing === 'own' && s.pending) return { ok: false, msg: 'استخدمه قبل رمي النرد أو بعد ما يخلص الحدث.' };
    const need = needs(card.fx);
    if (need === 'player' && !target) return { ok: false, msg: 'اختر لاعبًا أولًا.' };
    if (need === 'tile' && tile == null) return { ok: false, msg: 'اختر خانة أولًا.' };

    s.request = { pid, uid, ci: h.i, card, target: target || null, tile: (tile == null ? null : tile), at: Date.now() };
    log(s, `${p.name} طلب استخدام «${card.title}».`, 'req');
    cue(s, 'request');
    return { ok: true };
  }

  function decideHababa(s, ok, counterBy) {
    const rq = s.request;
    if (!rq) return { ok: false, msg: 'ما في طلب.' };
    const p = byId(s, rq.pid);
    s.request = null;

    if (!ok) { log(s, `الحكم رفض استخدام «${rq.card.title}».`, 'judge'); return { ok: true }; }

    /* الدرع: اللاعب المستهدف يُلغي الكرت */
    if (counterBy) {
      const v = byId(s, counterBy);
      const shield = v && v.hand.find((c) => { const cd = cardData('hababa', c.i); return cd && cd.fx && cd.fx.counter; });
      if (v && shield) {
        v.hand = v.hand.filter((c) => c.uid !== shield.uid); toss(s, 'hababa', shield.i);
        p.hand = p.hand.filter((c) => c.uid !== rq.uid);     toss(s, 'hababa', rq.ci);
        log(s, `${v.name} فتح الدرع وألغى «${rq.card.title}»!`, 'big');
        cue(s, 'hababa');
        return { ok: true };
      }
    }

    p.hand = p.hand.filter((c) => c.uid !== rq.uid);
    toss(s, 'hababa', rq.ci);
    log(s, `🔥 ${p.name} ولّعها بـ«${rq.card.title}» — ${rq.card.text}`, 'big');
    const r = apply(s, rq.card.fx, p, { target: rq.target, tile: rq.tile });
    cue(s, 'hababa');

    if (r.quiz) {                                  /* كرت الونسة */
      const v = byId(s, r.quiz);
      const i = draw(s, 'asalni'); const card = cardData('asalni', i);
      if (v && card) {
        s.pending = { kind: 'asalni', pid: v.id, ci: i, card, max: card.pts || 10, award: card.pts || 10, quizFor: p.id, thenExtraRoll: false };
        log(s, `${p.name} سأل ${v.name} سؤال أسألني.`, 'fx');
        return { ok: true };
      }
    }
    if (r.extraRoll && cur(s) && cur(s).id === p.id) s.dice = null;
    checkEnd(s);
    return { ok: true };
  }

  /** كشف اللاعب لكرته المغلق (يظهر له وحده) — لا يغيّر حالة اللعبة */
  function peek(s, pid, uid) {
    if (s.sealed) return null;
    const p = byId(s, pid); if (!p) return null;
    const h = p.hand.find((c) => c.uid === uid); if (!h) return null;
    return cardData('hababa', h.i);
  }

  /* ───────────────────────── تدوير الأدوار ───────────────────────── */
  function nextTurn(s) {
    s.dice = null;
    if (checkEnd(s)) return;

    const n = s.players.length;
    /* عدّادات نهاية الدور للاعب الحالي */
    const p = cur(s);
    if (p) { if (p.shield > 0) p.shield--; if (p.block > 0) p.block--; }

    for (let k = 1; k <= n + 1; k++) {
      const i = (s.turn + k) % n;
      if (i === 0) s.round++;
      const q = s.players[i];
      if (q.skip > 0) { q.skip--; log(s, `${q.name} فقد دوره — ريّح ضهرك.`, 'skip'); continue; }
      s.turn = i;
      if (s.final) {
        s.finalLeft--;
        if (s.finalLeft <= 0) { finish(s); return; }
        log(s, `جولة أخيرة — باقي ${s.finalLeft} دور. الآن ${q.name}.`, 'final');
      }
      return;
    }
    finish(s);
  }

  /** يفعّل الجولة الأخيرة عند وصول لاعب للهدف */
  function checkEnd(s) {
    if (s.phase !== 'playing') return true;
    if (s.final) return false;
    const hit = s.players.find((p) => p.score >= s.target);
    if (!hit) return false;
    s.final = true; s.finalBy = hit.id; s.finalLeft = s.players.length;
    log(s, `🔥 ${hit.name} وصل ${s.target} نقطة! جولة أخيرة — الهبابة مسموحة للكل.`, 'big');
    cue(s, 'final');
    return false;
  }

  function finish(s) {
    s.phase = 'over';
    const rank = s.players.slice().sort((a, b) => b.score - a.score || b.laps - a.laps || b.pos - a.pos);
    s.winner = rank[0] ? rank[0].id : null;
    if (rank[0]) log(s, `🏆 ${rank[0].name} هو الولّاع برصيد ${rank[0].score} نقطة!`, 'big');
    cue(s, 'win');
  }

  /* أدوات الحكم اليدوية */
  function adjust(s, pid, delta) {
    const p = byId(s, pid); if (!p) return { ok: false };
    addPts(s, p, delta, 'تعديل من الحكم');
    checkEnd(s); return { ok: true };
  }
  function forceTurn(s, pid) {
    const i = s.players.findIndex((p) => p.id === pid);
    if (i < 0) return { ok: false };
    s.turn = i; s.pending = null; s.dice = null;
    log(s, `الحكم نقل الدور إلى ${s.players[i].name}.`, 'judge');
    return { ok: true };
  }
  function skipTurn(s) {
    const p = cur(s); if (!p) return { ok: false };
    s.pending = null; log(s, `الحكم تخطّى دور ${p.name}.`, 'judge');
    nextTurn(s); return { ok: true };
  }
  function grantHababa(s, pid) {
    const p = byId(s, pid); if (!p) return { ok: false };
    apply(s, { giveHababa: 1 }, p, {}); return { ok: true };
  }
  function chat(s, pid, text) {
    const p = pid === 'judge' ? { name: s.judgeName, color: 'judge' } : byId(s, pid);
    if (!p || !text) return;
    s.chat.unshift({ name: p.name, color: p.color, text: String(text).slice(0, 140), at: Date.now() });
    if (s.chat.length > 40) s.chat.pop();
  }

  /* ───────────────── حالة مُنقّاة للاعب (تخفي ما لا يراه) ─────────────────
     الحكم يرى كل شيء؛ اللاعب لا يرى الإجابة النموذجية ولا كروت غيره المغلقة. */
  function viewFor(s, pid) {
    const v = clone(s);
    v.me = pid;
    delete v.decks; delete v.discard;      /* ما حدا يشوف ترتيب الكروت الجاية */
    v.players.forEach((p) => {
      /* كرت البداية يظهر مغلقًا للجميع — وصاحبه يطّلع عليه بطلب peek */
      p.hand = p.hand.map((c) => ({ uid: c.uid, faceUp: c.faceUp, opening: c.opening, i: c.faceUp ? c.i : null }));
    });
    if (v.pending && v.pending.card && v.pending.kind === 'asalni') {
      v.pending = Object.assign({}, v.pending, { card: Object.assign({}, v.pending.card, { a: null }) });
    }
    return v;
  }

  root.Wolaat = {
    TYPES, BOARD, COLORS, N, GRID, END_TILE, MAX_HAND,
    tileCell, tileName, create, addPlayer, removePlayer, start,
    roll, resolve, timer, requestHababa, decideHababa, peek,
    adjust, forceTurn, skipTurn, grantHababa, chat, nextTurn,
    cardData, decksSource, refreshCards, viewFor, byId, cur, leader, needs, clone, code4, apply,
  };
})(typeof window !== 'undefined' ? window : globalThis);
