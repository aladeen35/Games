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
    $('#pSay').innerHTML = N.ic('volume', { size: 26, color: '#fff' });
    $('#pHint').innerHTML = N.ic('lightbulb', { size: 26, color: '#fff' });
    $('#pRetry').innerHTML = N.ic('rotate-ccw', { size: 26, color: '#fff' });
    $('#pSay').onclick = () => this.sayAct();
    $('#pHint').onclick = () => { if (this.run && this.run.ctrl && !this.run.doneAct) { this.run.ctrl.hint(); N.Sound.tap(); } };
    $('#pRetry').onclick = () => { if (this.run && !this.run.doneAct) this.renderAct(true); };
    if (!N.DB.data.kids.length || !N.DB.data.settings.welcomed) this.startOnboard(); else this.home();
  },
  show(id) {
    const changed = this.cur !== id;
    document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
    this.cur = id; const s = $('#' + id); if (s) s.scrollTop = 0;
    document.querySelectorAll('.meaning').forEach(m => m.remove());
    if (!s) return;
    /* انتقال الشاشة: صعود خفيف مع ظهور (transform + opacity فقط). عند تقليل الحركة: ظهور فقط */
    const rm = N.motionReduced();
    if (changed && s.animate) s.animate(rm ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translateY(18px) scale(.985)' }, { opacity: 1, transform: 'none' }],
      { duration: rm ? 150 : 340, easing: 'cubic-bezier(.16,1,.3,1)' });
    /* دخول متدرّج لعناصر القائمة */
    let i = 0;
    s.querySelectorAll('.panel .in > *, .panel .list > .li, .panel .list > .badge, .wbot > *').forEach(el => { el.style.setProperty('--i', Math.min(i++, 14)); el.classList.add('stg'); });
    /* مؤشر التبويب المنزلق */
    const ind = s.querySelector('.tabs .ind');
    if (ind) {
      const sign = document.documentElement.dir === 'rtl' ? -1 : 1, at = k => `translateX(${sign * k * 100}%)`;
      ind.style.transform = at(+ind.dataset.from);
      requestAnimationFrame(() => requestAnimationFrame(() => { ind.style.transform = at(+ind.dataset.to); }));
    }
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
    const o = this.ob, last = 2, S = $('#onboard');
    const sl = [
      { illu: N.Vis.logo('color', 130), fl: ['star', 'book-open', 'sparkles'], h: 'نِبراس · NIBRAS', p: `${T('tagline')}<br>${T('welcomeSub')}` },
      { illu: N.ic('gamepad', { size: 128, color: '#19B8B0', auto: true }), fl: ['alphabet-blocks', 'star', 'trophy'], h: T('w2t'), list: [['🔤', T('w2a')], ['⭐', T('w2b')], ['💡', T('w2c')]] },
      { illu: N.ic('map', { size: 128, color: '#F5A04A', auto: true }), fl: ['sprout', 'castle', 'flask'], h: T('w3t'), list: C.worlds.map(w => [w.e, N.tn(w.name)]), p: '🔒 ' + T('w3a') }
    ][o.step];
    const pos = [['12%', '14%'], ['8%', '72%'], ['78%', '20%']];
    S.innerHTML = `<div class="wtop">
        <div class="langsw">${[['ar', 'ع'], ['en', 'EN']].map(l => `<button data-l="${l[0]}" class="${N.lang === l[0] ? 'on' : ''}">${l[1]}</button>`).join('')}</div>
        <div class="illu">${sl.illu}${sl.fl.map((f, i) => `<span class="fl" style="top:${pos[i][0]};left:${pos[i][1]};animation-delay:${i * .6}s">${N.ic(f, { size: 38, color: ['#FFC857', '#19B8B0', '#F2545B'][i] })}</span>`).join('')}</div>
      </div>
      <div class="wbot">
        <h1>${sl.h}</h1>
        ${sl.list ? `<div class="wlist">${sl.list.map(x => `<div><span class="e">${x[0]}</span><span>${x[1]}</span></div>`).join('')}</div>` : ''}
        ${sl.p ? `<p>${sl.p}</p>` : ''}
        <div class="dots">${[0, 1, 2].map(i => `<i class="${i === o.step ? 'on' : ''}"></i>`).join('')}</div>
        <button class="btn ${o.step === last ? 'coral' : ''}" id="obNext">${o.step === last ? T('startLearning') : T('next')} ${N.lang === 'ar' ? '←' : '→'}</button>
        ${o.step < last ? `<button class="wskip" id="obSkip">${T('skip')}</button>` : ''}
      </div>`;
    S.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { N.DB.data.settings.lang = b.dataset.l; N.DB.save(); N.applySettings(); this.renderOb(); });
    $('#obNext').onclick = () => { N.Sound.tap(); if (o.step === last) this.enter(); else { o.step++; this.renderOb(); } };
    const sk = $('#obSkip'); if (sk) sk.onclick = () => this.enter();
  },
  gradeSheet() {
    const k = kid();
    this.sheet(`<div class="sh">${N.ic('backpack', { size: 30, color: '#19B8B0' })}<h3>${T('chooseGrade')}</h3><button class="ib" data-close>✕</button></div>
      ${C.stages.map(st => `<h3 style="margin:10px 0 6px">${st.e} ${N.tn(st.name)}</h3><div class="grid2">${C.grades.filter(g => g.stage === st.id).map(g => { const n = lessonsOf(g.id).length; return `<button class="choice ${g.id === k.grade ? 'on' : ''}" data-g="${g.id}" style="flex-direction:column;gap:0">${N.tn(g.name)}<small class="muted" style="font-size:.72rem">${n ? n + ' ' + T('lessonsN') : T('comingSoon')}</small></button>`; }).join('')}</div>`).join('')}`);
    $('#sheet').querySelectorAll('[data-g]').forEach(b => b.onclick = () => { k.grade = b.dataset.g; N.DB.save(); this.vg = null; this.closeSheet(); this.home(); });
  },

  /* ============================ الرئيسية (تبويبات: تعلّم · مراجعة · إنجازاتي) ============================ */
  tab: 'learn',
  hdr(left, title, sub, right, extra) {
    return `<div class="hdr"><div class="in"><div class="hbar">${left || '<span style="width:44px"></span>'}<div class="t">${title}${sub ? `<small>${sub}</small>` : ''}</div>${right || '<span style="width:44px"></span>'}</div>${extra || ''}</div></div>`;
  },
  row(o) {
    return `<button class="li" ${o.attr || ''}><span class="av" style="background-color:${o.bg || 'var(--tq-l)'}">${o.ic ? N.ic(o.ic, { size: 30, color: o.icc || 'var(--tq)' }) : o.e}${o.cnt ? `<span class="cnt">${o.cnt}</span>` : ''}</span>
      <span class="tx"><b ${o.dir ? `dir="${o.dir}"` : ''}>${o.t}</b>${o.s ? `<small>${o.s}</small>` : ''}${o.bar != null ? `<span class="mini"><i style="width:${o.bar}%;background:${o.barc || 'var(--tq)'}"></i></span>` : ''}</span>
      ${o.end != null ? `<span class="end">${o.end}</span>` : ''}${o.chev === false ? '' : `<span class="chev">${N.lang === 'ar' ? '‹' : '›'}</span>`}</button>`;
  },
  home() {
    if (!kid()) return this.enter();
    N.applySettings();
    if (N.Time.over()) return this.rest();
    const k = kid(), p = prog(), vg = this.vg || k.grade, g = C.gradeById[vg];
    const next = this.nextLesson(k.grade), dueSk = N.Mastery.due(p), due = dueSk.length + p.wrong.length;
    const tab = this.tab, S = $('#home');
    const TABS = [['learn', T('tabLearn'), 'book-open'], ['review', T('tabReview') + (due ? ` (${due})` : ''), 'repeat'], ['me', T('tabMe'), 'trophy']];
    const ti = TABS.findIndex(t => t[0] === tab), pi = this.prevTab != null ? this.prevTab : ti; this.prevTab = ti;
    const tabs = `<div class="tabs"><span class="ind" data-from="${pi}" data-to="${ti}"></span>${TABS.map(t => `<button data-tab="${t[0]}" class="${tab === t[0] ? 'on' : ''}">${N.ic(t[2], { size: 20, color: tab === t[0] ? '#FFC857' : '#8FA3C0' })}<span>${t[1]}</span></button>`).join('')}</div>`;
    const head = this.hdr(`<button class="hi" id="hSet" aria-label="${T('settings')}">${N.ic('settings', { size: 24, color: '#7FE3DD' })}</button>`,
      `<h2>نِبراس</h2>`, `<button id="hGrade" class="gradebtn">${N.ic('backpack', { size: 16, color: '#FFC857' })} ${gradeName(k.grade)} ▾</button>`,
      `<button class="hi" id="hPar" aria-label="${T('parent')}">${N.ic('users', { size: 24, color: '#7FE3DD' })}</button>`, tabs);
    let body = '', fab = '';
    if (tab === 'learn') {
      const subs = C.stageSubjects[g.stage];
      const worlds = this.allWorlds ? C.worlds : C.worlds.slice(0, 3);
      body = `
        ${vg !== k.grade ? `<div class="list">${this.row({ e: '👀', bg: 'var(--orange-l)', t: `${T('browsing')}: ${gradeName(vg)}`, s: T('backMine'), attr: 'id="hMine"' })}</div>` : ''}
        ${vg === k.grade ? `<div class="sec"><div class="grow"><h3>${T('continueLearning')}</h3><small>${T('continueSub')}</small></div></div>
        <div class="list">${next ? this.row({ ic: subjOf(next.subject).ic, icc: subjOf(next.subject).color, bg: subjOf(next.subject).color + '1F', t: esc(next.title), dir: next.lang === 'en' ? 'ltr' : 'rtl', s: `${N.tn(subjOf(next.subject).name)} · ${esc(next.unit)}`, end: '▶', attr: 'id="hGo"' })
          : this.row({ e: '🏆', bg: '#FFF4D6', t: T('allDone'), chev: false })}</div>` : ''}
        <div class="sec"><div class="grow"><h3>${T('subjects')}</h3><small>${gradeName(vg)}</small></div><button class="act" id="hGrade2" aria-label="${T('changeGrade')}">${N.ic('sliders', { size: 22, color: '#142B4A' })}</button></div>
        <div class="list">${subs.map(s => {
          const all = lessonsOf(vg, s), ls = all.filter(l => !l.soon), d = ls.filter(l => p.lessons[l.id]).length, SB = subjOf(s);
          const stars = ls.reduce((a, l) => a + (p.lessons[l.id] ? p.lessons[l.id].stars : 0), 0);
          return this.row({ ic: SB.ic, icc: SB.color, bg: SB.color + '1F', t: N.tn(SB.name), s: ls.length ? T('lessonsCount', { d, n: ls.length }) : all.length ? T('tocOnly', { n: all.length }) : (SB.note ? N.tn(SB.note) : T('comingSoon')),
            bar: ls.length ? Math.round(100 * d / ls.length) : null, barc: SB.color, end: ls.length ? `⭐ ${stars}<small>${d}/${ls.length}</small>` : '', attr: `data-s="${s}"` });
        }).join('')}</div>
        <div class="sec"><div class="grow"><h3>${T('worlds')}</h3><small>${T('worldsSub')}</small></div></div>
        <div class="list">${worlds.map(w => { const gs = C.grades.filter(x => x.world === w.id), n = C.lessons.filter(l => gs.some(x => x.id === l.grade)).length;
          return this.row({ ic: w.ic, icc: w.bg, bg: w.bg + '1F', t: N.tn(w.name), s: gs.map(x => N.tn(x.name)).join(' · '), end: n ? `<small>${n} ${T('lessonsN')}</small>` : '', attr: `data-w="${w.id}"`, cnt: gs.some(x => x.id === k.grade) ? '●' : '' }); }).join('')}</div>
        <button class="more" id="hMore">${this.allWorlds ? T('seeLess') : T('seeMore')} ${N.lang === 'ar' ? '‹' : '›'}</button>`;
      if (next && vg === k.grade) fab = `<button class="fab" id="hFab" aria-label="${T('continueLearning')}">${N.ic('play', { size: 30, color: '#fff' })}</button>`;
    } else if (tab === 'review') {
      const dailyDone = p.daily === today();
      const all = Object.keys(p.skills);
      body = `<div class="sec"><div class="grow"><h3>${T('challenges')}</h3><small>${T('challengesSub')}</small></div></div>
        <div class="list">
          ${this.row({ ic: 'target', icc: '#F28C28', bg: 'var(--orange-l)', t: T('dailyChallenge'), s: dailyDone ? T('dailyDone') : T('dailySub'), end: dailyDone ? '✓' : '+15 ✨', attr: 'id="hDaily"' })}
          ${this.row({ ic: 'sync', icc: '#19B8B0', bg: 'var(--tq-l)', t: T('smartReview'), s: due ? T('reviewSub', { n: due }) : T('reviewNone'), cnt: due || '', attr: 'id="hRev"' })}
        </div>
        <div class="sec"><div class="grow"><h3>${T('dueSkills')}</h3><small>${T('spacedSub')}</small></div></div>
        <div class="list">${dueSk.length ? dueSk.map(id => { const l = N.skillLesson(id), st = N.Mastery.state(p.skills[id]);
          return this.row({ ic: l ? subjOf(l.subject).ic : 'book', icc: l ? subjOf(l.subject).color : '#19B8B0', bg: N.Mastery.COLORS[st] + '22', t: esc(N.skillName(id)), s: l ? esc(l.title) : '', end: `<span style="color:${N.Mastery.COLORS[st]}">● ${T('m_' + st)}</span>`, attr: l ? `data-l="${l.id}"` : '' }); }).join('')
          : this.row({ e: '🎉', bg: 'var(--ok-l)', t: T('noneDue'), chev: false })}</div>
        <div class="sec"><div class="grow"><h3>${T('mySkills')}</h3><small>${all.length} ${N.lang === 'ar' ? 'مهارة' : 'skills'}</small></div></div>
        <div class="list">${all.length ? all.map(id => { const l = N.skillLesson(id), st = N.Mastery.state(p.skills[id]);
          return this.row({ ic: l ? subjOf(l.subject).ic : 'book', icc: l ? subjOf(l.subject).color : '#19B8B0', bg: N.Mastery.COLORS[st] + '22', t: esc(N.skillName(id)), s: `${Math.round(p.skills[id].score * 100)}%`, bar: Math.round(p.skills[id].score * 100), barc: N.Mastery.COLORS[st], end: `<span style="color:${N.Mastery.COLORS[st]}">${T('m_' + st)}</span>`, attr: l ? `data-l="${l.id}"` : '' }); }).join('')
          : this.row({ e: '🌱', bg: 'var(--tq-l)', t: T('noSkills'), chev: false })}</div>`;
      fab = `<button class="fab coral" id="hFab" aria-label="${T('smartReview')}">${N.ic('sync', { size: 30, color: '#fff' })}</button>`;
    } else {
      const lessons = Object.keys(p.lessons).length, starsT = Object.values(p.lessons).reduce((s, x) => s + x.stars, 0);
      body = `<div class="list">${this.row({ e: k.av, bg: 'var(--tq-l)', t: gradeName(k.grade), s: `<bdi>✨ ${k.xp}</bdi> · <bdi>🪙 ${k.coins}</bdi>`, end: `<small>${T('changeAvatar')}</small>`, attr: 'id="hShop"' })}</div>
        <div class="stat"><div><b>${lessons}</b><small>${T('lessonsDone')}</small></div><div><b>${starsT}</b><small>${T('starsTotal')}</small></div><div><b>${p.badges.length}/${N.BADGES.length}</b><small>${T('badges')}</small></div></div>
        <div class="sec"><div class="grow"><h3>${T('badges')}</h3></div></div>
        <div class="list">${N.BADGES.map(b => `<div class="badge ${p.badges.includes(b.id) ? '' : 'lock'}"><span class="bi">${N.ic(b.ic, { size: 30, color: p.badges.includes(b.id) ? '#19B8B0' : '#9AA3B8' })}</span><div class="grow"><b>${N.tn(b.name)}</b><small>${N.tn(b.d)}</small></div>${p.badges.includes(b.id) ? '✅' : '🔒'}</div>`).join('')}</div>
        <div class="sec"><div class="grow"><h3>${T('settings')}</h3></div></div>
        <div class="list">
          ${this.row({ ic: 'shopping-bag', icc: '#E0A000', bg: '#FFF4D6', t: T('shop'), s: T('shopSub'), attr: 'id="hShop2"' })}
          ${this.row({ ic: 'settings', icc: '#142B4A', bg: 'var(--bg)', t: T('a11y'), s: `${T('fontSize')} · ${T('readAloud')} · ${T('lang')}`, attr: 'id="hSet2"' })}
          ${this.row({ ic: 'users', icc: '#142B4A', bg: 'var(--bg)', t: T('parent'), s: `${T('report')} · ${T('timeLimit')}`, attr: 'id="hPar2"' })}
        </div>
        <p class="disclaimer">${N.Vis.logo('mono', 26)}<br>${T('curriculum')}: ${C.version} — ${T('protoNote')}</p>`;
    }
    S.innerHTML = `${head}<div class="panel"><div class="in">${body}</div></div>${fab}`;
    this.show('home');
    const on = (id, f) => { const e = $('#' + id); if (e) e.onclick = f; };
    S.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { this.tab = b.dataset.tab; N.Sound.tap(); this.home(); });
    on('hSet', () => this.settingsSheet()); on('hSet2', () => this.settingsSheet());
    on('hPar', () => this.gate(() => this.parentSheet())); on('hPar2', () => this.gate(() => this.parentSheet()));
    on('hGrade', () => this.gradeSheet()); on('hGrade2', () => this.gradeSheet());
    on('hMine', () => { this.vg = null; this.home(); });
    on('hGo', () => this.intro(next));
    on('hDaily', () => this.startDaily()); on('hRev', () => this.startReview());
    on('hShop', () => this.shopSheet()); on('hShop2', () => this.shopSheet());
    on('hMore', () => { this.allWorlds = !this.allWorlds; this.home(); });
    on('hFab', () => tab === 'review' ? this.startReview() : this.intro(next));
    S.querySelectorAll('[data-s]').forEach(b => b.onclick = () => {
      const s = b.dataset.s, SB = subjOf(s);
      if (!lessonsOf(vg, s).length) { N.toast(SB.note ? N.tn(SB.note) : T('comingSoon')); return; }
      this.openPath(vg, s);
    });
    S.querySelectorAll('[data-w]').forEach(b => b.onclick = () => this.worldSheet(b.dataset.w));
    S.querySelectorAll('[data-l]').forEach(b => b.onclick = () => this.intro(C.lessonById[b.dataset.l]));
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
    if (l.soon) return false;   // درس من الفهرس بلا أنشطة بعد
    const ls = lessonsOf(l.grade, l.subject).filter(x => !x.soon), i = ls.indexOf(l), p = prog();
    return i <= 0 || !!p.lessons[ls[i - 1].id] || !!p.lessons[l.id];
  },

  /* ============================ خريطة المسار ============================ */
  openPath(grade, subject) { this.path = { grade, subject }; this.renderPath(); },
  renderPath() {
    if (N.Time.over()) return this.rest();
    const { grade, subject } = this.path, p = prog();
    const ls = lessonsOf(grade, subject), S = subjOf(subject), w = C.worldById[C.gradeById[grade].world];
    const W = Math.min(innerWidth - 36, 520), pts = [], flags = [];
    let y = 30, lastUnit = null, curIdx = ls.findIndex(l => !p.lessons[l.id] && this.unlocked(l));
    ls.forEach((l, i) => {
      if (l.unit !== lastUnit) { flags.push({ y, t: l.unit }); y += 60; lastUnit = l.unit; }
      pts.push({ x: W * [0.5, 0.74, 0.5, 0.26][i % 4], y: y + 50, l, i }); y += 180;
    });
    const H = y + 20, d = ls.filter(l => p.lessons[l.id]).length, starsT = ls.reduce((a, l) => a + (p.lessons[l.id] ? p.lessons[l.id].stars : 0), 0);
    const trail = pts.slice(1).map((q, i) => { const a = pts[i]; const done = p.lessons[a.l.id] && p.lessons[q.l.id]; return `<line x1="${a.x}" y1="${a.y}" x2="${q.x}" y2="${q.y}" stroke="${done ? '#19B8B0' : '#C7CDDD'}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${done ? '' : '1 14'}"/>`; }).join('');
    const sec = $('#path');
    sec.innerHTML = this.hdr(`<button class="hi" id="pBack">${N.ic(N.lang === 'ar' ? 'arrow-right' : 'arrow-left', { size: 22, color: '#7FE3DD' })}</button>`, `<h2 class="ttl">${N.ic(S.ic, { size: 26, color: '#FFC857' })} ${N.tn(S.name)}</h2>`, `${N.tn(w.name)} · ${gradeName(grade)}`, '',
        ls.length ? `<div class="row" style="justify-content:center;gap:8px"><span class="chipg">${N.ic('book-open', { size: 16, color: '#7FE3DD' })} ${T('lessonsCount', { d, n: ls.length })}</span><span class="chipg">${N.ic('star', { size: 16, color: '#FFC857' })} ${starsT} / ${ls.length * 3}</span></div>` : '')
      + `<div class="panel"><div class="in">${ls.length ? `<div class="pmap" style="height:${H}px;width:${W}px"><svg class="trail" viewBox="0 0 ${W} ${H}">${trail}</svg>
      ${flags.map(f => `<div class="unitflag" style="top:${f.y}px">${N.ic('book-marked', { size: 16, color: '#FFC857' })} ${esc(f.t)}</div>`).join('')}
      ${pts.map(q => {
        const r = p.lessons[q.l.id], un = this.unlocked(q.l), st = N.Mastery.state(p.skills[q.l.skill[0]]);
        const cls = r ? 'done' : (q.i === curIdx ? 'cur' : 'open');
        return `<button class="node ${q.l.soon ? 'soon' : un ? cls : ''}" data-i="${q.i}" style="left:${q.x}px;top:${q.y}px">${q.l.soon ? N.ic('hourglass', { size: 30, color: '#B4BBCB' }) : un ? (r ? '✓' : q.i + 1) : N.ic('lock', { size: 32, color: '#9AA3B8' })}${st !== 'none' ? `<span class="ms" style="background:${N.Mastery.COLORS[st]}" title="${T('m_' + st)}"></span>` : ''}</button>
          <div class="nlabel" style="left:${q.x}px;top:${q.y + 52}px" dir="${q.l.lang === 'en' ? 'ltr' : 'rtl'}">${esc(q.l.title)}<small>${q.l.soon ? T('comingSoon') : r ? '⭐'.repeat(r.stars) + '☆'.repeat(3 - r.stars) : (un ? '' : '🔒')} ${st !== 'none' ? '· ' + T('m_' + st) : ''}</small></div>`;
      }).join('')}</div>` : `<div class="empty">${T('noContent').replace('\n', '<br>')}</div>`}</div></div>`;
    this.show('path');
    $('#pBack').onclick = () => this.home();
    sec.querySelectorAll('.node').forEach(b => b.onclick = () => this.intro(ls[+b.dataset.i]));
    const cur = sec.querySelector('.node.cur'); if (cur) setTimeout(() => cur.scrollIntoView({ block: 'center', behavior: 'smooth' }), 80);
  },
  /* مصدر الدرس ودرجة التحقق منه — شفافية للمعلم وولي الأمر */
  sourceInfo(l) {
    const src = l.source, ref = src && src.ref && C.sources[src.ref];
    let badge;
    if (src && src.verified) badge = `<span class="pill" style="background:var(--ok-l);color:#14603B">✓ ${T('srcVerified')}</span>`;
    else if (l.status === 'curriculum_draft') badge = `<span class="pill" style="background:var(--orange-l);color:#8A4B00">${T(l.topicOnly ? 'srcTopic' : 'srcUnverified')}</span>`;
    else badge = `<span class="pill">${T('srcProto')}</span>`;
    const book = src && src.book ? `<span class="pill">${N.ic('book', { size: 16, color: '#19B8B0' })} ${esc(src.book)}${src.edition ? ' · ' + esc(src.edition) : ''}${src.pages ? ' · ' + T('page') + ' ' + esc(src.pages) : ''}</span>` : '';
    return `<div class="chips" style="margin-bottom:10px">${badge}${book}${ref && ref.title ? `<span class="pill small">${esc(ref.title)}</span>` : ''}</div>`;
  },

  /* ============================ بطاقة الدرس ============================ */
  intro(l) {
    const p = prog(), r = p.lessons[l.id], un = this.unlocked(l), st = N.Mastery.state(p.skills[l.skill[0]]), S = subjOf(l.subject);
    const dir = l.lang === 'en' ? 'ltr' : 'rtl';
    this.sheet(`<div class="sh"><span class="av" style="background-color:${S.color}1F">${N.ic(S.ic, { size: 30, color: S.color })}</span><h3 dir="${dir}">${esc(l.title)}</h3><button class="ib" data-close>✕</button></div>
      <div class="chips" style="margin-bottom:10px"><span class="pill">${T('unit')}: ${esc(l.unit)}</span><span class="pill">${gradeName(l.grade)}</span>${N.Mastery.badge(st)}${r ? `<span class="pill">${'⭐'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)}</span>` : ''}</div>
      <div class="fb ex on" style="margin-bottom:10px"><span class="i">${N.ic('target', { size: 26, color: '#F28C28' })}</span><div><b>${T('goal')}</b><br><span dir="${dir}">${esc(l.outcome)}</span></div></div>
      ${l.example ? `<div class="fb good on" style="margin-bottom:10px"><span class="i">${l.example.e}</span><div><b>${T('example')}</b><br><span dir="${dir}">${esc(l.example.t)}</span></div></div>` : ''}
      ${this.sourceInfo(l)}
      ${l.soon ? '' : `<p class="small muted">${l.acts.length} ${N.lang === 'ar' ? 'أنشطة' : 'activities'} · ${esc(l.skill[1])}</p>`}
      ${l.soon ? `<div class="fb hint on">${N.ic('hourglass', { size: 22, color: '#D99A12' })} ${T(l.subject === 'isl' ? 'islPending' : 'soonLesson')}</div>` : un ? `<button class="btn block ${r ? 'ghost' : 'ok'}" id="iGo">${r ? N.ic('rotate-ccw', { size: 20, color: '#142B4A' }) + ' ' + T('replayLesson') : N.ic('play', { size: 20, color: '#fff' }) + ' ' + T('startLesson')}</button>` : `<div class="fb hint on">🔒 ${T('locked')}</div>`}`);
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
    let items = []; pool.filter(l => !l.soon).forEach(l => l.acts.forEach((a, i) => { if (a.type === 'choose' || a.type === 'match') items.push({ act: a, lesson: l, i }); }));
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
    /* انتقال بين الأنشطة: النشاط الجديد ينزلق من جهة القراءة */
    if (st.animate) { const rm = N.motionReduced(), dx = (document.documentElement.dir === 'rtl' ? -1 : 1) * 28;
      st.animate(rm ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: `translateX(${dx}px)` }, { opacity: 1, transform: 'none' }], { duration: rm ? 150 : 320, easing: 'cubic-bezier(.16,1,.3,1)' }); }
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
    $('#result').innerHTML = this.hdr(`<button class="hi" id="rX">✕</button>`, `<h2 dir="${l && l.lang === 'en' ? 'ltr' : 'rtl'}">${esc(l ? l.title : R.title)}</h2>`, T('result'), '',
      `<h1 style="text-align:center;font-size:1.7rem;color:#fff">${kg ? T('kgPraise') : titles[nStars]}</h1>
       <div class="rstars">${star(stars.u, T('starU'), T('starUd'))}${star(stars.i, T('starI'), T('starId'))}${star(stars.a, T('starA'), T('starAd'))}</div>
       <div class="row" style="justify-content:center;gap:8px;flex-wrap:wrap"><span class="xp">✨ ${T('xpGain', { n: xp })}</span>${st ? N.Mastery.badge(st) : ''}</div>`)
      + `<div class="panel"><div class="in">
      <div class="sec"><div class="grow"><h3>📘 ${T('learned')}</h3></div></div>
      <div class="list"><ul class="learned">${learned.map(x => `<li><span class="e">${x.e || '•'}</span><span>${esc(x.t)}</span></li>`).join('')}</ul></div>
      ${wrong.length ? `<div class="sec"><div class="grow"><h3>🔁 ${T('toReview')}</h3></div></div><div class="list"><ul class="learned">${wrong.map(r => `<li><span class="e" style="background:var(--orange-l)">💡</span><span>${esc(r.ref.act.q)}${r.ref.act.ex ? '<br><small class="muted">' + esc(r.ref.act.ex) + '</small>' : ''}</span></li>`).join('')}</ul></div>` : ''}
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:6px">
        ${next && this.unlocked(next) ? `<button class="btn block" id="rNext">▶ ${T('nextLesson')}: ${esc(next.title)}</button>` : ''}
        ${l ? `<button class="btn ghost block" id="rAgain">🔁 ${T('replay')}</button>` : ''}
        <div class="grid2">${l ? `<button class="btn ghost" id="rMap">🗺️ ${T('toMap')}</button>` : ''}<button class="btn ghost" id="rHome" ${l ? '' : 'style="grid-column:span 2"'}>🏠 ${T('home')}</button></div>
      </div></div></div>`;
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
    $('#rX').onclick = () => l ? this.openPath(l.grade, l.subject) : this.home();
  },

  /* ============================ النوافذ ============================ */
  sheet(html) {
    $('#sheetWrap').classList.remove('out');
    $('#sheet').innerHTML = html; $('#sheetWrap').classList.add('on');
    $('#sheet').querySelectorAll('[data-close]').forEach(b => b.onclick = () => this.closeSheet());
  },
  closeSheet() {
    const w = $('#sheetWrap'); if (!w.classList.contains('on') || w.classList.contains('out')) return;
    /* الخروج أسرع من الدخول (ease-in قصير) ثم الإخفاء */
    w.classList.add('out');
    setTimeout(() => { w.classList.remove('on', 'out'); }, N.motionReduced() ? 10 : 190);
  },
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
    this.sheet(`<div class="sh">${N.ic('settings', { size: 30, color: '#142B4A' })}<h3>${T('settings')} · ${T('a11y')}</h3><button class="ib" data-close>✕</button></div>
      <div class="setrow"><span class="lbl">${N.ic('languages', { size: 22, color: '#19B8B0' })} ${T('lang')}</span>${this.seg('lang', s.lang, [['ar', 'العربية'], ['en', 'English']])}</div>
      <div class="setrow"><span class="lbl">${N.ic('type', { size: 22, color: '#19B8B0' })} ${T('fontSize')}</span>${this.seg('font', s.font, [['n', T('fN')], ['l', T('fL')], ['xl', T('fXL')]])}</div>
      <div class="setrow"><span class="lbl">${N.ic('speech', { size: 22, color: '#19B8B0' })} ${T('readAloud')}</span>${this.seg('read', s.read, [['auto', N.lang === 'ar' ? 'تلقائي' : 'Auto'], ['on', T('on')], ['off', T('off')]])}</div>
      <div class="setrow"><span class="lbl">${N.ic('bell', { size: 22, color: '#19B8B0' })} ${T('sfx')}</span>${this.seg('sfx', s.sfx, [[true, T('on')], [false, T('off')]])}</div>
      <div class="setrow"><span class="lbl">${N.ic('eye', { size: 22, color: '#19B8B0' })} ${T('contrast')}</span>${this.seg('contrast', s.contrast, [[true, T('on')], [false, T('off')]])}</div>
      <div class="setrow"><span class="lbl">${N.ic('sliders', { size: 22, color: '#19B8B0' })} ${T('motion')}</span>${this.seg('motion', s.motion, [[true, T('on')], [false, T('off')]])}</div>`);
    this.bindSeg((k, v) => { s[k] = v === 'true' ? true : v === 'false' ? false : v; N.DB.save(); N.applySettings(); this.settingsSheet(); if (this.cur === 'home') this.home(); });
  },
  badgesSheet() {
    const p = prog();
    this.sheet(`<div class="sh">${N.ic('trophy', { size: 30, color: '#E0A000' })}<h3>${T('achievements')}</h3><button class="ib" data-close>✕</button></div>
      <div class="stat"><div><b>${Object.keys(p.lessons).length}</b><small>${T('lessonsDone')}</small></div><div><b>${Object.values(p.lessons).reduce((s, x) => s + x.stars, 0)}</b><small>${T('starsTotal')}</small></div><div><b>${kid().xp}</b><small>XP</small></div></div>
      ${N.BADGES.map(b => `<div class="badge ${p.badges.includes(b.id) ? '' : 'lock'}"><span class="bi">${N.ic(b.ic, { size: 30, color: p.badges.includes(b.id) ? '#19B8B0' : '#9AA3B8' })}</span><div class="grow"><b>${N.tn(b.name)}</b><small>${N.tn(b.d)}</small></div>${p.badges.includes(b.id) ? '✅' : '🔒'}</div>`).join('')}`);
  },
  shopSheet() {
    const k = kid();
    this.sheet(`<div class="sh">${N.ic('shopping-bag', { size: 30, color: '#E0A000' })}<h3>${T('shop')}</h3><span class="xp">🪙 ${k.coins}</span><button class="ib" data-close>✕</button></div>
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
    this.sheet(`<div class="sh">${N.ic('users', { size: 30, color: '#142B4A' })}<h3>${T('parentGate')}</h3><button class="ib" data-close>✕</button></div>
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
    this.sheet(`<div class="sh">${N.ic('users', { size: 30, color: '#142B4A' })}<h3>${T('parent')}</h3><button class="ib" data-close>✕</button></div>
      <div class="card"><h3>${T('report')}</h3>
        <div class="stat"><div><b>${Object.keys(p.lessons).length}</b><small>${T('lessonsDone')}</small></div><div><b>${Object.values(p.lessons).reduce((s, x) => s + x.stars, 0)}</b><small>${T('starsTotal')}</small></div><div><b>${N.Time.minutes(k)}</b><small>${T('minutesToday')}</small></div></div>
        <div class="setrow"><span class="lbl">${T('changeGrade')}</span><select class="field" id="pGrade" style="max-width:200px;min-height:44px;font-size:1rem">${stageG.map(g => `<option value="${g.id}" ${g.id === k.grade ? 'selected' : ''}>${N.tn(g.name)}</option>`).join('')}</select></div>
        <h3 style="margin:10px 0 4px">⚠️ ${T('needSupport')}</h3>
        ${support.length ? support.map(x => `<div class="sk"><span class="nm">${esc(N.skillName(x.id))}</span>${N.Mastery.badge(x.st)}</div>`).join('') : `<p class="small muted">—</p>`}
        <h3 style="margin:10px 0 4px">📊 ${N.lang === 'ar' ? 'كل المهارات' : 'All skills'}</h3>
        ${skills.length ? skills.map(x => `<div class="sk"><span class="nm">${esc(N.skillName(x.id))}<small>${Math.round(x.s.score * 100)}% · ${x.s.sessions}×</small></span>${N.Mastery.badge(x.st)}</div>`).join('') : `<p class="small muted">${T('noSkills')}</p>`}
      </div>
      <div class="card" style="margin-top:12px">
        <div class="setrow"><span class="lbl">${N.ic('timer', { size: 22, color: '#19B8B0' })} ${T('timeLimit')}</span>${this.seg('limit', par.limit, [[0, T('unlimited')], [15, '15' + T('min')], [30, '30' + T('min')], [45, '45' + T('min')], [60, '60' + T('min')]])}</div>
        <div class="setrow"><span class="lbl">${N.ic('lock-open', { size: 22, color: '#19B8B0' })} ${T('unlockAll')}</span>${this.seg('unlockAll', par.unlockAll, [[true, T('on')], [false, T('off')]])}</div>
        <div class="setrow"><span class="lbl">${N.ic('hourglass', { size: 22, color: '#19B8B0' })} ${T('allowTimer')}<small>${T('allowTimerSub')}</small></span>${this.seg('allowTimer', par.allowTimer, [[true, T('on')], [false, T('off')]])}</div>
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
