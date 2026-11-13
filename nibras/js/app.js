/* =====================================================================
   نبراس — الشاشات وتسلسل النشاط:
   التسجيل ← الرئيسية ← خريطة المسار ← بطاقة الدرس (الهدف + مثال) ← الأنشطة
   (تغذية راجعة وتلميح وشرح) ← النتيجة (نجوم الفهم/الاستقلالية/التطبيق + ما تعلّمته)
   ← تحديث الإتقان والمراجعة ← اقتراح الدرس التالي.
   ===================================================================== */
'use strict';
const C = N.C, T = N.t;
const kid = () => N.Kids.cur;
const prog = () => N.Kids.prog();
const subjOf = id => C.subjects[id];
const lessonsOf = (g, s) => C.lessons.filter(l => l.grade === g && (!s || l.subject === s));
const gradeName = id => N.tn(C.gradeById[id] && C.gradeById[id].name);

N.App = {
  vg: null,          // الصف المعروض حاليًا (يمكن تصفّح صفوف أخرى للمراجعة)
  run: null,         // الجلسة الجارية
  stack: [],

  init() {
    N.DB.load(); N.applySettings(); N.Time.start();
    window.__androidBack = () => this.back();
    document.addEventListener('visibilitychange', () => { if (document.hidden) N.DB.flush(); });
    $('#sheetWrap').addEventListener('click', e => { if (e.target.id === 'sheetWrap') this.closeSheet(); });
    $('#pClose').onclick = () => this.leavePlay();
    $('#pSay').onclick = () => this.sayAct();
    $('#pHint').onclick = () => { if (this.run && this.run.ctrl && !this.run.doneAct) { this.run.ctrl.hint(); N.Sound.tap(); } };
    $('#pRetry').onclick = () => { if (this.run && !this.run.doneAct) this.renderAct(true); };
    if (!N.DB.data.kids.length || !N.DB.data.settings.welcomed) this.startOnboard(); else this.home();
  },
  show(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
    this.cur = id; const s = $('#' + id); if (s) s.scrollTop = 0;
    document.querySelectorAll('.meaning').forEach(m => m.remove());
  },
  back() {
    if ($('#sheetWrap').classList.contains('on')) { this.closeSheet(); return 'ok'; }
    if (this.cur === 'play') { this.leavePlay(); return 'ok'; }
    if (this.cur === 'result' || this.cur === 'path') { this.home(); return 'ok'; }
    if (this.cur === 'onboard' && this.ob.step > 0) { this.ob.step--; this.renderOb(); return 'ok'; }
    return 'exit';
  },

  /* ============================ شاشات الترحيب (بلا حسابات) ============================
     لا تسجيل ولا أسماء: يُنشأ ملف محلي مجهول تلقائيًا ويُغيَّر الصف من الرئيسية بلمسة. */
  startOnboard() { this.ob = { step: 0 }; this.show('onboard'); this.renderOb(); },
  enter() {
    const d = N.DB.data;
    if (!d.kids.length) N.Kids.add('', N.AVATARS[0].e, 'g1');
    d.settings.welcomed = true; N.DB.save(); N.applySettings(); this.vg = null; N.confetti(); this.home();
  },
  renderOb() {
    const o = this.ob, W = $('#obWrap'), last = 2;
    const dots = `<div class="steps">${[0, 1, 2].map(i => `<i class="${i === o.step ? 'on' : ''}"></i>`).join('')}</div>`;
    const lang = `<div class="seg" style="align-self:center">${[['ar', 'العربية'], ['en', 'English']].map(l => `<button data-l="${l[0]}" class="${N.lang === l[0] ? 'on' : ''}">${l[1]}</button>`).join('')}</div>`;
    let h = '';
    if (o.step === 0) {
      h = `${lang}<div class="brand" style="margin-top:20px">${N.Vis.logo('color', 140)}<h1>نِبراس · NIBRAS</h1>
        <div class="tag">نتعلّم باللعب.. ونكتشف المستقبل</div><div class="tag ltr">Learn Through Play. Discover the Future.</div></div>
        <p style="text-align:center;font-size:1.1rem;font-weight:700">${T('welcomeSub')}</p>`;
    } else if (o.step === 1) {
      h = `<div style="text-align:center;font-size:4.5rem;margin-top:20px">🎮</div><h2 style="text-align:center">${T('w2t')}</h2>
        <div class="card"><ul class="learned">
          <li><span class="e">🔤</span><span>${T('w2a')}</span></li>
          <li><span class="e">⭐</span><span>${T('w2b')}</span></li>
          <li><span class="e">💡</span><span>${T('w2c')}</span></li></ul></div>`;
    } else {
      h = `<div style="text-align:center;font-size:4.5rem;margin-top:20px">🗺️</div><h2 style="text-align:center">${T('w3t')}</h2>
        <div class="card"><ul class="learned">${C.worlds.map(w => `<li><span class="e">${w.e}</span><span><b>${N.tn(w.name)}</b><br><small class="muted">${C.grades.filter(g => g.world === w.id).map(g => N.tn(g.name)).join(' · ')}</small></span></li>`).join('')}</ul></div>
        <p class="small muted" style="text-align:center">🔒 ${T('w3a')}</p>`;
    }
    W.innerHTML = `${h}${dots}
      <button class="btn block ${o.step === last ? 'ok' : ''}" id="obNext">${o.step === last ? T('startLearning') + ' 🚀' : T('next')}</button>
      ${o.step < last ? `<button class="btn ghost block" id="obSkip">${T('skip')}</button>` : ''}`;
    W.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { N.DB.data.settings.lang = b.dataset.l; N.DB.save(); N.applySettings(); this.renderOb(); });
    $('#obNext').onclick = () => { N.Sound.tap(); if (o.step === last) this.enter(); else { o.step++; this.renderOb(); } };
    const sk = $('#obSkip'); if (sk) sk.onclick = () => this.enter();
  },
  gradeSheet() {
    const k = kid();
    this.sheet(`<div class="sh"><span style="font-size:1.6rem">🎒</span><h3>${T('chooseGrade')}</h3><button class="ib" data-close>✕</button></div>
      ${C.stages.map(st => `<h3 style="margin:10px 0 6px">${st.e} ${N.tn(st.name)}</h3><div class="grid2">${C.grades.filter(g => g.stage === st.id).map(g => { const n = lessonsOf(g.id).length; return `<button class="choice ${g.id === k.grade ? 'on' : ''}" data-g="${g.id}" style="flex-direction:column;gap:0">${N.tn(g.name)}<small class="muted" style="font-size:.72rem">${n ? n + ' ' + T('lessonsN') : T('comingSoon')}</small></button>`; }).join('')}</div>`).join('')}`);
    $('#sheet').querySelectorAll('[data-g]').forEach(b => b.onclick = () => { k.grade = b.dataset.g; N.DB.save(); this.vg = null; this.closeSheet(); this.home(); });
  },

  /* ============================ الرئيسية ============================ */
  home() {
    if (!kid()) return this.enter();
    N.applySettings();
    if (N.Time.over()) return this.rest();
    const k = kid(), p = prog(), vg = this.vg || k.grade, g = C.gradeById[vg];
    const subs = C.stageSubjects[g.stage];
    const next = this.nextLesson(k.grade);
    const due = N.Mastery.due(p).length + p.wrong.length;
    const dailyDone = p.daily === today();
    const W = $('#homeWrap');
    W.innerHTML = `
      <div class="topbar">
        <button class="who" id="hWho"><span class="av">${k.av}</span><span>${gradeName(k.grade)} ▾<small>${T('changeGrade')}</small></span></button>
        <div class="grow"></div>
        <span class="xp">✨ ${k.xp}</span>
        <button class="ib" id="hSet" aria-label="${T('settings')}">⚙️</button>
        <button class="ib" id="hPar" aria-label="${T('parent')}">👪</button>
      </div>
      <h2>${k.name ? T('hello', { n: esc(k.name) }) : T('helloAnon')} 👋</h2>
      ${vg !== k.grade ? `<button class="pill" id="hMine" style="align-self:flex-start;background:var(--orange-l)">👀 ${gradeName(vg)} — ${N.lang === 'ar' ? 'العودة إلى صفي' : 'Back to my grade'} ✕</button>` : ''}
      ${vg === k.grade ? (next ? `<div class="hero"><span class="e">${subjOf(next.subject).e}</span><div class="grow"><small style="opacity:.85">${T('continueLearning')} · ${N.tn(subjOf(next.subject).name)}</small><h2 dir="${next.lang === 'en' ? 'ltr' : 'rtl'}">${esc(next.title)}</h2><p>${esc(next.unit)}</p><button class="btn" id="hGo">${T('go')} ▶</button></div></div>`
        : `<div class="hero"><span class="e">🏆</span><div class="grow"><h2>${T('allDone')}</h2></div></div>`) : ''}
      <div class="tiles">
        <button class="tile daily" id="hDaily"><span class="e">🎯</span><b>${T('dailyChallenge')}</b><small>${dailyDone ? T('dailyDone') : T('dailySub')}</small></button>
        <button class="tile" id="hRev"><span class="e">🔁</span><b>${T('smartReview')}</b><small>${due ? T('reviewSub', { n: due }) : T('reviewNone')}</small>${due ? `<span class="ib" style="position:absolute;top:8px;left:8px;width:28px;height:28px;flex-basis:28px;font-size:.8rem;background:var(--orange);color:#fff">${due}</span>` : ''}</button>
      </div>
      <div class="sec"><h3>${T('subjects')} · ${gradeName(vg)}</h3></div>
      <div class="tiles">${subs.map(s => {
        const ls = lessonsOf(vg, s), d = ls.filter(l => p.lessons[l.id]).length, S = subjOf(s);
        return `<button class="tile" data-s="${s}" style="border-color:${S.color}40"><span class="e">${S.e}</span><b>${N.tn(S.name)}</b>
          <small>${ls.length ? T('lessonsCount', { d, n: ls.length }) : (S.note ? N.tn(S.note) : T('comingSoon'))}</small>
          ${ls.length ? `<div class="bar"><i style="width:${Math.round(100 * d / ls.length)}%;background:${S.color}"></i></div>` : ''}</button>`;
      }).join('')}</div>
      <div class="sec"><h3>${T('worlds')}</h3></div>
      <div class="worldbar">${C.worlds.map(w => { const gs = C.grades.filter(g => g.world === w.id); return `<button class="wb ${gs.some(x => x.id === vg) ? 'on' : ''}" data-w="${w.id}"><span class="e">${w.e}</span><b>${N.tn(w.name)}</b><small>${gs.map(x => N.tn(x.name)).join(' · ')}</small></button>`; }).join('')}</div>
      <div class="tiles">
        <button class="tile" id="hBadge"><span class="e">🏅</span><b>${T('achievements')}</b><small>${p.badges.length} / ${N.BADGES.length} ${T('badges')}</small></button>
        <button class="tile" id="hShop"><span class="e">🛍️</span><b>${T('shop')}</b><small>${T('shopSub')}</small></button>
      </div>
      <p class="disclaimer">${N.Vis.logo('mono', 26)}<br>${T('curriculum')}: ${C.version} — ${T('protoNote')}</p>`;
    this.show('home');
    $('#hWho').onclick = () => this.gradeSheet();
    $('#hSet').onclick = () => this.settingsSheet();
    $('#hPar').onclick = () => this.gate(() => this.parentSheet());
    const mine = $('#hMine'); if (mine) mine.onclick = () => { this.vg = null; this.home(); };
    const go = $('#hGo'); if (go) go.onclick = () => this.intro(next);
    $('#hDaily').onclick = () => this.startDaily();
    $('#hRev').onclick = () => this.startReview();
    $('#hBadge').onclick = () => this.badgesSheet();
    $('#hShop').onclick = () => this.shopSheet();
    W.querySelectorAll('[data-s]').forEach(b => b.onclick = () => {
      const s = b.dataset.s, S = subjOf(s);
      if (!lessonsOf(vg, s).length) { N.toast(S.note ? N.tn(S.note) : T('comingSoon')); return; }
      this.openPath(vg, s);
    });
    W.querySelectorAll('[data-w]').forEach(b => b.onclick = () => this.worldSheet(b.dataset.w));
  },
  nextLesson(grade) {
    const p = prog(), subs = C.stageSubjects[C.gradeById[grade].stage];
    const last = p.lastSubject;
    const order = last ? [last].concat(subs.filter(s => s !== last)) : subs;
    for (const s of order) { const l = lessonsOf(grade, s).find(l => !p.lessons[l.id] && this.unlocked(l)); if (l) return l; }
    return null;
  },
  unlocked(l) {
    if (N.DB.data.parent.unlockAll) return true;
    const ls = lessonsOf(l.grade, l.subject), i = ls.indexOf(l), p = prog();
    return i <= 0 || !!p.lessons[ls[i - 1].id] || !!p.lessons[l.id];
  },

  /* ============================ خريطة المسار ============================ */
  openPath(grade, subject) { this.path = { grade, subject }; this.renderPath(); },
  renderPath() {
    if (N.Time.over()) return this.rest();
    const { grade, subject } = this.path, p = prog();
    const ls = lessonsOf(grade, subject), S = subjOf(subject), w = C.worldById[C.gradeById[grade].world];
    const W = Math.min(innerWidth, 520), pts = [], flags = [];
    let y = 70, lastUnit = null, curIdx = ls.findIndex(l => !p.lessons[l.id] && this.unlocked(l));
    ls.forEach((l, i) => {
      if (l.unit !== lastUnit) { flags.push({ y: y - 10, t: l.unit }); y += 50; lastUnit = l.unit; }
      pts.push({ x: W * [0.5, 0.72, 0.5, 0.28][i % 4], y: y + 50, l, i }); y += 190;
    });
    const H = y + 40;
    const trail = pts.slice(1).map((q, i) => { const a = pts[i]; const done = p.lessons[a.l.id] && p.lessons[q.l.id]; return `<line x1="${a.x}" y1="${a.y}" x2="${q.x}" y2="${q.y}" stroke="${done ? '#7BE08F' : 'rgba(255,255,255,.55)'}" stroke-width="9" stroke-linecap="round" stroke-dasharray="${done ? '' : '2 16'}"/>`; }).join('');
    const sec = $('#path'); sec.style.setProperty('--pbg', w.bg);
    sec.innerHTML = `<div class="phead"><button class="ib" id="pBack">${N.lang === 'ar' ? '→' : '←'}</button><div><h2>${S.e} ${N.tn(S.name)}</h2><small>${w.e} ${N.tn(w.name)} · ${gradeName(grade)}</small></div></div>
      ${ls.length ? `<div class="pmap" style="height:${H}px;width:${W}px"><svg class="trail" viewBox="0 0 ${W} ${H}">${trail}</svg>
      ${flags.map(f => `<div class="unitflag" style="top:${f.y}px">📘 ${esc(f.t)}</div>`).join('')}
      ${pts.map(q => {
        const r = p.lessons[q.l.id], un = this.unlocked(q.l), st = N.Mastery.state(p.skills[q.l.skill[0]]);
        const cls = r ? 'done' : (q.i === curIdx ? 'cur' : 'open');
        return `<button class="node ${un ? cls : ''}" data-i="${q.i}" style="left:${q.x}px;top:${q.y}px">${un ? (r ? '✓' : q.i + 1) : '🔒'}${st !== 'none' ? `<span class="ms" style="background:${N.Mastery.COLORS[st]}" title="${T('m_' + st)}"></span>` : ''}</button>
          <div class="nlabel" style="left:${q.x}px;top:${q.y + 56}px" dir="${q.l.lang === 'en' ? 'ltr' : 'rtl'}">${esc(q.l.title)}<small>${r ? '⭐'.repeat(r.stars) + '☆'.repeat(3 - r.stars) : (un ? '' : '🔒')} ${st !== 'none' ? '· ' + T('m_' + st) : ''}</small></div>`;
      }).join('')}</div>` : `<div class="empty">${T('noContent').replace('\n', '<br>')}</div>`}`;
    this.show('path');
    $('#pBack').onclick = () => this.home();
    sec.querySelectorAll('.node').forEach(b => b.onclick = () => this.intro(ls[+b.dataset.i]));
    const cur = sec.querySelector('.node.cur'); if (cur) setTimeout(() => cur.scrollIntoView({ block: 'center', behavior: 'smooth' }), 80);
  },

  /* ============================ بطاقة الدرس ============================ */
  intro(l) {
    const p = prog(), r = p.lessons[l.id], un = this.unlocked(l), st = N.Mastery.state(p.skills[l.skill[0]]), S = subjOf(l.subject);
    const dir = l.lang === 'en' ? 'ltr' : 'rtl';
    this.sheet(`<div class="sh"><span style="font-size:2rem">${S.e}</span><h3 dir="${dir}">${esc(l.title)}</h3><button class="ib" data-close>✕</button></div>
      <div class="chips" style="margin-bottom:10px"><span class="pill">${T('unit')}: ${esc(l.unit)}</span><span class="pill">${gradeName(l.grade)}</span>${N.Mastery.badge(st)}${r ? `<span class="pill">${'⭐'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)}</span>` : ''}</div>
      <div class="fb ex on" style="margin-bottom:10px"><span class="i">🎯</span><div><b>${T('goal')}</b><br><span dir="${dir}">${esc(l.outcome)}</span></div></div>
      ${l.example ? `<div class="fb good on" style="margin-bottom:10px"><span class="i">${l.example.e}</span><div><b>${T('example')}</b><br><span dir="${dir}">${esc(l.example.t)}</span></div></div>` : ''}
      <p class="small muted">${l.acts.length} ${N.lang === 'ar' ? 'أنشطة' : 'activities'} · ${esc(l.skill[1])}</p>
      ${un ? `<button class="btn block ${r ? 'ghost' : 'ok'}" id="iGo">${r ? '🔁 ' + T('replayLesson') : '▶ ' + T('startLesson')}</button>` : `<div class="fb hint on">🔒 ${T('locked')}</div>`}`);
    if (l.example) N.speak(l.example.t, l.lang);
    const go = $('#iGo'); if (go) go.onclick = () => { this.closeSheet(); this.startLesson(l); };
  },

  /* ============================ تشغيل النشاط ============================ */
  startLesson(l) {
    if (N.Time.over()) return this.rest();
    this.begin({ kind: 'lesson', lesson: l, title: l.title, items: l.acts.map((a, i) => ({ act: a, lesson: l, i })) });
  },
  startDaily() {
    const k = kid(), g = C.gradeById[k.grade];
    let pool = C.lessons.filter(l => l.grade === k.grade);
    if (!pool.length) pool = C.lessons.filter(l => C.gradeById[l.grade].stage === g.stage);
    let items = []; pool.forEach(l => l.acts.forEach((a, i) => { if (a.type === 'choose' || a.type === 'match') items.push({ act: a, lesson: l, i }); }));
    let seed = [...(today() + k.id)].reduce((s, c) => (s * 31 + c.charCodeAt(0)) >>> 0, 7);
    const rnd = () => (seed = (seed * 1103515245 + 12345) >>> 0) / 4294967296;
    items = items.map(x => [rnd(), x]).sort((a, b) => a[0] - b[0]).slice(0, 3).map(x => x[1]);
    if (!items.length) return N.toast(T('comingSoon'));
    this.begin({ kind: 'daily', title: T('daily'), items });
  },
  startReview() {
    const p = prog(); let items = [];
    p.wrong.forEach(w => { const l = C.lessonById[w.l]; if (l && l.acts[w.a]) items.push({ act: l.acts[w.a], lesson: l, i: w.a }); });
    N.Mastery.due(p).forEach(id => { const l = N.skillLesson(id); if (!l) return; shuffle(l.acts.map((a, i) => ({ act: a, lesson: l, i })).filter(x => x.act.type !== 'ws')).slice(0, 2).forEach(x => items.push(x)); });
    if (!items.length) {   // لا شيء مستحق: تحدّي مراجعة مختلط من الدروس المكتملة
      Object.keys(p.lessons).forEach(id => { const l = C.lessonById[id]; if (l) l.acts.forEach((a, i) => { if (a.type !== 'ws') items.push({ act: a, lesson: l, i }); }); });
      if (!items.length) return N.toast(T('reviewNone'));
      items = shuffle(items);
    }
    const seen = new Set(); items = items.filter(x => { const k = x.lesson.id + ':' + x.i; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 6);
    this.begin({ kind: 'review', title: T('mixed'), items });
  },
  begin(run) {
    this.run = Object.assign(run, { idx: 0, results: [], learned: [] });
    this.show('play'); this.renderAct();
  },
  timerAllowed(it) { return N.DB.data.parent.allowTimer && !['kg', 'g1', 'g2'].includes(it.lesson.grade) && it.act.type === 'ws'; },
  renderAct(retry) {
    const R = this.run, it = R.items[R.idx], a = it.act, lang = it.lesson.lang, dir = lang === 'en' ? 'ltr' : 'rtl';
    if (R.ctrl && R.ctrl.stop) R.ctrl.stop();
    R.doneAct = false;
    $('#pTitle').textContent = (R.kind === 'lesson' ? '' : R.title + ' · ') + it.lesson.title;
    $('#pProg').style.width = (100 * R.idx / R.items.length) + '%';
    $('#pTimer').textContent = '';
    $('#pFoot').innerHTML = '';
    const st = $('#pStage');
    st.innerHTML = `<div class="q" dir="${dir}"><h2>${esc(a.q)}${a.apply ? ` <span class="pill" style="background:var(--orange-l);vertical-align:middle">🧩 ${lang === 'en' ? 'Apply' : 'تطبيق'}</span>` : ''}</h2></div>
      ${a.listen && a.say ? `<button class="btn or" id="bigSay" style="align-self:center">🔊 ${lang === 'en' ? 'Listen' : 'استمع'}</button>` : ''}
      ${a.vis ? `<div class="vis">${N.Vis.render(a.vis, lang)}</div>` : ''}
      <div class="game"></div><div class="fb" id="fb"></div>`;
    const bs = $('#bigSay'); if (bs) bs.onclick = () => this.sayAct();
    const fb = $('#fb');
    const api = {
      el: st.querySelector('.game'), lang, kg: it.lesson.grade === 'kg',
      fb: (kind, html) => { fb.className = 'fb on ' + kind; fb.innerHTML = html; setTimeout(() => fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 50); if (kind !== 'good' && N.readAloud()) N.speak(fb.textContent.replace(/[💡👀]/g, ''), lang); },
      praise: ex => {
        const g = N.STR[lang === 'en' ? 'en' : 'ar'].good, pr = g[Math.floor(Math.random() * g.length)];
        fb.className = 'fb on good'; fb.innerHTML = `<span class="i">🌟</span><div><b>${pr}</b>${ex ? '<br>' + esc(ex) : ''}</div>`;
        if (N.readAloud() || api.kg) setTimeout(() => N.speak(pr, lang), 400);
      },
      learned: list => R.learned.push(...list),
      timer: this.timerAllowed(it) ? s => { $('#pTimer').textContent = '⏱ ' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); } : null,
      done: res => this.actDone(res)
    };
    const G = N.Games[a.type];
    R.ctrl = G ? G.mount(a, api) : null;
    if (!G) st.querySelector('.game').textContent = 'Unknown activity type: ' + a.type;
    if (retry && R.results[R.idx]) R.results[R.idx] = null;
    if (a.listen || N.readAloud()) setTimeout(() => this.sayAct(), 350);
  },
  sayAct() {
    const R = this.run; if (!R) return; const it = R.items[R.idx], a = it.act;
    N.speak(a.listen && a.say ? a.say : a.q, it.lesson.lang);
  },
  actDone(res) {
    const R = this.run, it = R.items[R.idx];
    if (R.doneAct) return; R.doneAct = true;
    if (R.ctrl && R.ctrl.stop) R.ctrl.stop();
    res.apply = !!it.act.apply; res.ref = it;
    if (res.secs != null && this.timerAllowed(it)) {
      const p = prog(), key = it.lesson.id + ':' + it.i, b = p.best[key];
      if (!b || res.secs < b) { p.best[key] = res.secs; if (b) N.toast('⏱ ' + T('best') + ': ' + res.secs + 's'); }
    }
    R.results[R.idx] = res;
    $('#pProg').style.width = (100 * (R.idx + 1) / R.items.length) + '%';
    const last = R.idx === R.items.length - 1;
    $('#pFoot').innerHTML = `<button class="btn ${last ? 'ok' : ''}" id="pNext" style="min-width:200px">${last ? T('finish') + ' 🏁' : T('nextQ') + (N.lang === 'ar' ? ' ←' : ' →')}</button>`;
    $('#pNext').onclick = () => { N.Sound.tap(); if (last) this.finish(); else { R.idx++; this.renderAct(); $('#play').scrollTop = 0; } };
  },
  leavePlay() {
    const R = this.run; if (R && R.ctrl && R.ctrl.stop) R.ctrl.stop();
    try { speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
    this.run = null;
    if (R && R.kind === 'lesson') this.openPath(R.lesson.grade, R.lesson.subject); else this.home();
  },

  /* ============================ النتيجة والتقييم ============================ */
  finish() {
    const R = this.run, k = kid(), p = prog(), res = R.results.filter(Boolean);
    const avg = a => a.length ? a.reduce((s, r) => s + r.score, 0) / a.length : 0;
    const core = res.filter(r => !r.apply), app = res.filter(r => r.apply);
    const u = avg(core.length ? core : res);
    const hints = res.reduce((s, r) => s + (r.hints || 0), 0), reveals = res.filter(r => r.revealed).length;
    const stars = {
      u: u >= 0.7,
      i: hints <= Math.max(1, Math.floor(res.length / 4)) && reveals === 0,
      a: app.length ? app.every(r => r.score >= 0.5) : u >= 0.9
    };
    const nStars = (stars.u ? 1 : 0) + (stars.i ? 1 : 0) + (stars.a ? 1 : 0);
    /* نقاط الخبرة: إكمال النشاط، الإجابة الصحيحة، تصحيح الخطأ بعد فهمه، التطبيق، المراجعة */
    let xp = 20 + nStars * 10;
    res.forEach(r => { xp += r.score >= 1 ? 10 : r.score >= 0.5 ? 5 : 2; if (r.apply && r.score >= 0.5) xp += 10; });
    if (R.kind === 'review') { xp += 15; p.reviews++; }
    if (R.kind === 'daily' && p.daily !== today()) { xp += 15; p.daily = today(); }
    /* الإتقان: يُحدَّث لكل مهارة على حدة */
    const bySkill = {};
    res.forEach(r => { const id = r.ref.lesson.skill[0]; (bySkill[id] = bySkill[id] || []).push(r.score); });
    const masteredNow = [];
    Object.keys(bySkill).forEach(id => {
      const ch = N.Mastery.update(p, id, bySkill[id].reduce((a, b) => a + b, 0) / bySkill[id].length);
      if (ch.after === 'mastered' && ch.before !== 'mastered') { masteredNow.push(id); xp += 50; }
    });
    /* بنك الأخطاء للمراجعة المتباعدة */
    res.forEach(r => {
      const key = { l: r.ref.lesson.id, a: r.ref.i }, ix = p.wrong.findIndex(w => w.l === key.l && w.a === key.a);
      if (r.score < 0.5 || r.revealed) { if (ix < 0) p.wrong.push(key); }
      else if (ix >= 0 && R.kind !== 'lesson') p.wrong.splice(ix, 1);
      else if (ix >= 0 && r.score >= 1) p.wrong.splice(ix, 1);
    });
    if (p.wrong.length > 30) p.wrong = p.wrong.slice(-30);
    if (R.kind === 'lesson') {
      const l = R.lesson, old = p.lessons[l.id];
      p.lessons[l.id] = { stars: Math.max(nStars, old ? old.stars : 0), last: nStars, plays: (old ? old.plays : 0) + 1, at: Date.now(), ver: C.version };
      p.lastSubject = l.subject;
    }
    /* سجل المحاولات (بمعرّف فريد لمنع التكرار عند المزامنة مستقبلًا) */
    p.attempts.push({ id: uid(), at: Date.now(), kind: R.kind, lesson: R.lesson ? R.lesson.id : null, items: res.map(r => [r.ref.lesson.id, r.ref.i, r.score, r.hints || 0]), stars: nStars, ver: C.version });
    if (p.attempts.length > 300) p.attempts = p.attempts.slice(-300);
    if (!p.days.includes(today())) p.days.push(today()); if (p.days.length > 60) p.days = p.days.slice(-60);
    k.xp += xp; k.coins += xp;
    const newBadges = N.checkBadges(p);
    N.DB.save();
    this.showResult(R, stars, nStars, xp, masteredNow, newBadges, res);
  },
  showResult(R, stars, nStars, xp, masteredNow, newBadges, res) {
    const l = R.lesson, p = prog(), kg = l ? l.grade === 'kg' : kid().grade === 'kg';
    const titles = N.lang === 'ar' ? ['أحسنت المحاولة!', 'عمل جيد!', 'رائع جدًا!', 'أداء مميز!'] : ['Good try!', 'Good work!', 'Great job!', 'Outstanding!'];
    const learned = [];
    if (l) learned.push({ e: '🎯', t: l.outcome });
    R.learned.forEach(x => learned.push(x));
    if (!l) { const ls = [...new Set(res.map(r => r.ref.lesson))]; ls.forEach(x => learned.push({ e: subjOf(x.subject).e, t: x.skill[1] })); }
    const wrong = res.filter(r => r.score < 0.5 || r.revealed);
    const next = l ? (() => { const ls = lessonsOf(l.grade, l.subject); return ls[ls.indexOf(l) + 1]; })() : null;
    const st = l ? N.Mastery.state(p.skills[l.skill[0]]) : null;
    const star = (on, n, d) => `<div class="rstar ${on ? 'on' : ''}"><span class="s">⭐</span><b>${n}</b><small>${d}</small></div>`;
    $('#resWrap').innerHTML = `
      <h1 class="rtitle" style="margin-top:10px">${kg ? T('kgPraise') : titles[nStars]}</h1>
      <p class="muted" style="text-align:center;margin:0" dir="${l && l.lang === 'en' ? 'ltr' : 'rtl'}">${esc(l ? l.title : R.title)}</p>
      <div class="rstars">${star(stars.u, T('starU'), T('starUd'))}${star(stars.i, T('starI'), T('starId'))}${star(stars.a, T('starA'), T('starAd'))}</div>
      <div class="row" style="justify-content:center;gap:8px;flex-wrap:wrap"><span class="xp">✨ ${T('xpGain', { n: xp })}</span>${st ? N.Mastery.badge(st) : ''}</div>
      <div class="card"><h3 style="margin-bottom:8px">📘 ${T('learned')}</h3><ul class="learned">${learned.map(x => `<li><span class="e">${x.e || '•'}</span><span>${esc(x.t)}</span></li>`).join('')}</ul></div>
      ${wrong.length ? `<div class="card"><h3 style="margin-bottom:8px">🔁 ${T('toReview')}</h3><ul class="learned">${wrong.map(r => `<li><span class="e">💡</span><span>${esc(r.ref.act.q)}${r.ref.act.ex ? '<br><small class="muted">' + esc(r.ref.act.ex) + '</small>' : ''}</span></li>`).join('')}</ul></div>` : ''}
      <div style="display:flex;flex-direction:column;gap:10px">
        ${next && this.unlocked(next) ? `<button class="btn ok block" id="rNext">▶ ${T('nextLesson')}: ${esc(next.title)}</button>` : ''}
        ${l ? `<button class="btn ghost block" id="rAgain">🔁 ${T('replay')}</button>` : ''}
        <div class="grid2">${l ? `<button class="btn ghost" id="rMap">🗺️ ${T('toMap')}</button>` : ''}<button class="btn ghost" id="rHome" ${l ? '' : 'style="grid-column:span 2"'}>🏠 ${T('home')}</button></div>
      </div>`;
    this.show('result'); this.run = null;
    N.Sound.win(); if (nStars) N.confetti();
    [stars.u, stars.i, stars.a].forEach((on, i) => { if (on) setTimeout(() => N.Sound.star(i), 400 + i * 250); });
    if (kg) N.speak(N.lang === 'ar' ? 'لعبت وتعلّمت! أحسنت' : 'Well done!', N.lang);
    masteredNow.forEach((id, i) => setTimeout(() => N.toast(T('mastered', { n: N.skillName(id) })), 1200 + i * 900));
    newBadges.forEach((b, i) => setTimeout(() => N.toast(b.e + ' ' + T('newBadge', { n: N.tn(b.name) })), 2000 + i * 900));
    const rn = $('#rNext'); if (rn) rn.onclick = () => this.intro(next);
    const ra = $('#rAgain'); if (ra) ra.onclick = () => this.startLesson(l);
    const rm = $('#rMap'); if (rm) rm.onclick = () => this.openPath(l.grade, l.subject);
    $('#rHome').onclick = () => this.home();
  },

  /* ============================ النوافذ ============================ */
  sheet(html) {
    $('#sheet').innerHTML = html; $('#sheetWrap').classList.add('on');
    $('#sheet').querySelectorAll('[data-close]').forEach(b => b.onclick = () => this.closeSheet());
  },
  closeSheet() { $('#sheetWrap').classList.remove('on'); },
  seg(name, cur, opts) { return `<div class="seg" data-seg="${name}">${opts.map(o => `<button data-v="${o[0]}" class="${String(cur) === String(o[0]) ? 'on' : ''}">${o[1]}</button>`).join('')}</div>`; },
  bindSeg(fn) { $('#sheet').querySelectorAll('[data-seg]').forEach(s => s.querySelectorAll('button').forEach(b => b.onclick = () => fn(s.dataset.seg, b.dataset.v))); },

  worldSheet(wid) {
    const w = C.worldById[wid], gs = C.grades.filter(g => g.world === wid);
    this.sheet(`<div class="sh"><span style="font-size:2rem">${w.e}</span><h3>${N.tn(w.name)}</h3><button class="ib" data-close>✕</button></div>
      <div style="display:flex;flex-direction:column;gap:10px">${gs.map(g => { const n = lessonsOf(g.id).length; return `<button class="choice" data-g="${g.id}" style="justify-content:space-between">${N.tn(g.name)}<small class="muted">${n ? n + ' ' + T('lessonsN') : T('comingSoon')}</small></button>`; }).join('')}</div>`);
    $('#sheet').querySelectorAll('[data-g]').forEach(b => b.onclick = () => { this.vg = b.dataset.g === kid().grade ? null : b.dataset.g; this.closeSheet(); this.home(); });
  },
  settingsSheet() {
    const s = N.DB.data.settings;
    this.sheet(`<div class="sh"><span style="font-size:1.6rem">⚙️</span><h3>${T('settings')} · ${T('a11y')}</h3><button class="ib" data-close>✕</button></div>
      <div class="setrow"><span class="lbl">🌐 ${T('lang')}</span>${this.seg('lang', s.lang, [['ar', 'العربية'], ['en', 'English']])}</div>
      <div class="setrow"><span class="lbl">🔠 ${T('fontSize')}</span>${this.seg('font', s.font, [['n', T('fN')], ['l', T('fL')], ['xl', T('fXL')]])}</div>
      <div class="setrow"><span class="lbl">🗣️ ${T('readAloud')}</span>${this.seg('read', s.read, [['auto', N.lang === 'ar' ? 'تلقائي' : 'Auto'], ['on', T('on')], ['off', T('off')]])}</div>
      <div class="setrow"><span class="lbl">🔔 ${T('sfx')}</span>${this.seg('sfx', s.sfx, [[true, T('on')], [false, T('off')]])}</div>
      <div class="setrow"><span class="lbl">◐ ${T('contrast')}</span>${this.seg('contrast', s.contrast, [[true, T('on')], [false, T('off')]])}</div>
      <div class="setrow"><span class="lbl">🐢 ${T('motion')}</span>${this.seg('motion', s.motion, [[true, T('on')], [false, T('off')]])}</div>`);
    this.bindSeg((k, v) => { s[k] = v === 'true' ? true : v === 'false' ? false : v; N.DB.save(); N.applySettings(); this.settingsSheet(); if (this.cur === 'home') this.home(); });
  },
  badgesSheet() {
    const p = prog();
    this.sheet(`<div class="sh"><span style="font-size:1.6rem">🏅</span><h3>${T('achievements')}</h3><button class="ib" data-close>✕</button></div>
      <div class="stat"><div><b>${Object.keys(p.lessons).length}</b><small>${T('lessonsDone')}</small></div><div><b>${Object.values(p.lessons).reduce((s, x) => s + x.stars, 0)}</b><small>${T('starsTotal')}</small></div><div><b>${kid().xp}</b><small>XP</small></div></div>
      ${N.BADGES.map(b => `<div class="badge ${p.badges.includes(b.id) ? '' : 'lock'}"><span class="bi">${b.e}</span><div class="grow"><b>${N.tn(b.name)}</b><small>${N.tn(b.d)}</small></div>${p.badges.includes(b.id) ? '✅' : '🔒'}</div>`).join('')}`);
  },
  shopSheet() {
    const k = kid();
    this.sheet(`<div class="sh"><span style="font-size:1.6rem">🛍️</span><h3>${T('shop')}</h3><span class="xp">🪙 ${k.coins}</span><button class="ib" data-close>✕</button></div>
      <p class="small muted">${T('shopSub')}</p>
      <div class="avatars">${N.AVATARS.map(a => { const own = !a.p || k.owned.includes(a.e); return `<button class="${a.e === k.av ? 'on' : ''}" data-a="${a.e}" data-p="${a.p}">${a.e}${own ? '' : `<span class="lockp">🪙${a.p}</span>`}</button>`; }).join('')}</div>`);
    $('#sheet').querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
      const e = b.dataset.a, pr = +b.dataset.p, own = !pr || k.owned.includes(e);
      if (!own) { if (k.coins < pr) return N.toast(T('notEnough')); k.coins -= pr; k.owned.push(e); N.Sound.ok(); }
      k.av = e; N.DB.save(); this.shopSheet(); this.home();
    });
  },

  /* ---------------- منطقة ولي الأمر ---------------- */
  gate(ok) {
    const a = 3 + Math.floor(Math.random() * 7), b = 6 + Math.floor(Math.random() * 4);
    this.sheet(`<div class="sh"><span style="font-size:1.6rem">👪</span><h3>${T('parentGate')}</h3><button class="ib" data-close>✕</button></div>
      <p style="font-weight:800;font-size:1.3rem;text-align:center">${T('gateQ', { a, b })}</p>
      <input class="field" id="gA" inputmode="numeric" autocomplete="off" style="text-align:center">
      <button class="btn block" id="gGo" style="margin-top:12px">${T('next')}</button>`);
    const go = () => { if (+$('#gA').value === a * b) ok(); else { N.toast(T('wrongGate')); $('#gA').value = ''; } };
    $('#gGo').onclick = go; $('#gA').onkeydown = e => { if (e.key === 'Enter') go(); };
  },
  parentSheet(kidId) {
    const d = N.DB.data, par = d.parent, k = d.kids.find(x => x.id === kidId) || kid(), p = N.Kids.prog(k);
    const skills = Object.keys(p.skills).map(id => ({ id, st: N.Mastery.state(p.skills[id]), s: p.skills[id] }));
    const support = skills.filter(x => x.st === 'support' || x.st === 'review');
    const stageG = C.grades.filter(g => true);
    this.sheet(`<div class="sh"><span style="font-size:1.6rem">👪</span><h3>${T('parent')}</h3><button class="ib" data-close>✕</button></div>
      <div class="card"><h3>${T('report')}</h3>
        <div class="stat"><div><b>${Object.keys(p.lessons).length}</b><small>${T('lessonsDone')}</small></div><div><b>${Object.values(p.lessons).reduce((s, x) => s + x.stars, 0)}</b><small>${T('starsTotal')}</small></div><div><b>${N.Time.minutes(k)}</b><small>${T('minutesToday')}</small></div></div>
        <div class="setrow"><span class="lbl">${T('changeGrade')}</span><select class="field" id="pGrade" style="max-width:200px;min-height:44px;font-size:1rem">${stageG.map(g => `<option value="${g.id}" ${g.id === k.grade ? 'selected' : ''}>${N.tn(g.name)}</option>`).join('')}</select></div>
        <h3 style="margin:10px 0 4px">⚠️ ${T('needSupport')}</h3>
        ${support.length ? support.map(x => `<div class="sk"><span class="nm">${esc(N.skillName(x.id))}</span>${N.Mastery.badge(x.st)}</div>`).join('') : `<p class="small muted">—</p>`}
        <h3 style="margin:10px 0 4px">📊 ${N.lang === 'ar' ? 'كل المهارات' : 'All skills'}</h3>
        ${skills.length ? skills.map(x => `<div class="sk"><span class="nm">${esc(N.skillName(x.id))}<small>${Math.round(x.s.score * 100)}% · ${x.s.sessions}×</small></span>${N.Mastery.badge(x.st)}</div>`).join('') : `<p class="small muted">${T('noSkills')}</p>`}
      </div>
      <div class="card" style="margin-top:12px">
        <div class="setrow"><span class="lbl">⏰ ${T('timeLimit')}</span>${this.seg('limit', par.limit, [[0, T('unlimited')], [15, '15' + T('min')], [30, '30' + T('min')], [45, '45' + T('min')], [60, '60' + T('min')]])}</div>
        <div class="setrow"><span class="lbl">🔓 ${T('unlockAll')}</span>${this.seg('unlockAll', par.unlockAll, [[true, T('on')], [false, T('off')]])}</div>
        <div class="setrow"><span class="lbl">⏱️ ${T('allowTimer')}<small>${T('allowTimerSub')}</small></span>${this.seg('allowTimer', par.allowTimer, [[true, T('on')], [false, T('off')]])}</div>
      </div>
      <p class="small muted" style="margin-top:12px">🔒 ${T('privacy')}</p>
      <button class="btn ghost block" id="pWipe" style="color:var(--err)">⚠️ ${T('delAll')}</button>`);
    const S = $('#sheet');
    $('#pGrade').onchange = e => { k.grade = e.target.value; N.DB.save(); N.applySettings(); this.vg = null; N.toast('✓ ' + gradeName(k.grade)); };
    $('#pWipe').onclick = () => { if (confirm(T('confirmDel'))) { N.DB.wipe(); this.closeSheet(); N.applySettings(); this.startOnboard(); } };
    this.bindSeg((key, v) => { par[key] = v === 'true' ? true : v === 'false' ? false : +v; N.DB.save(); this.parentSheet(k.id); });
    this.onSheetClose = () => this.home();
  },
  rest() {
    $('#restWrap').innerHTML = `<div style="font-size:5rem">🌙</div><h1>${T('restTitle')}</h1><p class="muted">${T('restSub')}</p>
      <button class="btn ghost" id="rsPar">👪 ${T('restParent')}</button>`;
    this.show('rest');
    $('#rsPar').onclick = () => this.gate(() => {
      const par = N.DB.data.parent, key = kid().id + ':' + today(); par.extra = par.extra || {}; par.extra[key] = (par.extra[key] || 0) + 15; N.DB.save(); this.closeSheet(); this.home();
    });
  }
};

/* إغلاق نافذة ولي الأمر يحدّث الرئيسية */
const _close = N.App.closeSheet.bind(N.App);
N.App.closeSheet = function () { _close(); if (this.onSheetClose) { const f = this.onSheetClose; this.onSheetClose = null; if (this.cur === 'home') f(); } };

N.App.init();
