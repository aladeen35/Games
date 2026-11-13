/* =====================================================================
   نبراس — محرّك الألعاب. كل نوع نشاط يُسجَّل في N.Games ويُستدعى بنفس الواجهة:
     mount(act, api) → { hint() }
   api: el (منطقة اللعب) · lang · kg · fb(kind, html) · done(result) · praise() · timer
   result: { score: 0..1 (فهم من المحاولة الأولى), hints, revealed }
   لإضافة نوع جديد: N.Games.myType = { mount(act, api) {...} } ثم استخدامه في content.js.
   ===================================================================== */
'use strict';
N.Games = {};
const PAL = ['#19B8B0', '#F28C28', '#5B6BD6', '#D9608F', '#2FA84F', '#B7793E', '#3E8ED0', '#8E5BD6'];
const tfOpts = lang => (lang === 'en' ? ['True ✓', 'False ✗'] : ['صح ✓', 'خطأ ✗']).map(t => ({ t }));

/* ---------------- اختيار من متعدد / صواب وخطأ / اسمع واختر ---------------- */
N.Games.choose = {
  mount(act, api) {
    const base = act.tf ? tfOpts(api.lang) : act.opts.map(N.normOpt);
    let list = base.map((o, i) => ({ o, ok: i === act.a }));
    if (!act.tf) list = shuffle(list);
    const hideText = !!act.say && act.listen;
    const long = list.some(x => x.o.t && x.o.t.length > 16);
    const pics = list.some(x => x.o.e || x.o.shape || x.o.color);
    const cols = long ? 1 : list.length === 3 && pics ? 3 : 2;
    api.el.innerHTML = `<div class="opts" style="--cols:${cols}" dir="${api.lang === 'en' ? 'ltr' : 'rtl'}">${list.map((x, i) => `<button class="opt" data-i="${i}">${N.Vis.opt(x.o, hideText)}<span class="mk"></span></button>`).join('')}</div>`;
    const btns = [...api.el.querySelectorAll('.opt')];
    let wrongs = 0, hints = 0, over = false;
    const finish = (revealed) => {
      over = true;
      api.done({ score: revealed ? 0 : wrongs === 0 ? 1 : 0.5, hints, revealed });
    };
    const reveal = () => {
      const i = list.findIndex(x => x.ok); btns[i].classList.add('reveal'); btns[i].querySelector('.mk').textContent = '✓';
      api.fb('ex', `<b>${esc(N.t('together'))}</b><br>${esc(act.ex || '')}`);
      N.Sound.soft(); finish(true);
    };
    btns.forEach((b, i) => b.onclick = () => {
      if (over || b.disabled) return;
      if (list[i].ok) {
        b.classList.add('ok'); b.querySelector('.mk').textContent = '✓';
        N.Sound.ok(); api.praise(act.ex);
        if (list[i].o.t && api.lang === 'en') N.speak(list[i].o.t, 'en');
        finish(false);
      } else {
        wrongs++; b.classList.add('bad', 'shake'); b.disabled = true; b.querySelector('.mk').textContent = '✗';
        N.Sound.soft();
        const left = btns.filter(x => !x.disabled).length;
        if (wrongs >= 2 || left <= 1) reveal();
        else api.fb('hint', `💡 ${esc(act.hint || N.t('tryAgain'))}`);
      }
    });
    return {
      hint() {
        if (over) return; hints++;
        if (act.hint) { api.fb('hint', `💡 ${esc(act.hint)}`); return; }
        const w = btns.find((b, i) => !list[i].ok && !b.disabled);   // بلا نص تلميح: نحذف خيارًا خاطئًا
        if (w && btns.filter(x => !x.disabled).length > 2) { w.disabled = true; w.style.opacity = .3; }
        else api.fb('hint', `💡 ${esc(N.t('tryAgain'))}`);
      }
    };
  }
};

/* ---------------- المطابقة (لمس عنصر ثم ما يناسبه — بديل عن السحب) ---------------- */
N.Games.match = {
  mount(act, api) {
    const pairs = act.pairs.map(p => [N.normOpt(p[0]), N.normOpt(p[1])]);
    const L = shuffle(pairs.map((p, i) => ({ o: p[0], i }))), R = shuffle(pairs.map((p, i) => ({ o: p[1], i })));
    api.el.innerHTML = `<p class="small muted" style="text-align:center;margin:0">${esc(N.t('matchHint'))}</p>
      <div class="match" dir="${api.lang === 'en' ? 'ltr' : 'rtl'}"><div class="col">${L.map((x, k) => `<button class="mi" data-s="L" data-k="${k}">${N.Vis.opt(x.o)}</button>`).join('')}</div>
      <div class="col">${R.map((x, k) => `<button class="mi" data-s="R" data-k="${k}">${N.Vis.opt(x.o)}</button>`).join('')}</div></div>`;
    const el = s => [...api.el.querySelectorAll(`.mi[data-s="${s}"]`)];
    const lb = el('L'), rb = el('R');
    let selL = null, selR = null, matched = 0, hints = 0, revealed = false;
    const errs = {}, bad = new Set();
    const clear = () => { lb.concat(rb).forEach(b => b.classList.remove('sel')); selL = selR = null; };
    const tryPair = () => {
      if (selL == null || selR == null) return;
      const a = L[selL], b = R[selR];
      if (a.i === b.i) {
        const c = PAL[matched % PAL.length];
        [lb[selL], rb[selR]].forEach(x => { x.classList.add('done'); x.style.background = c; x.disabled = true; });
        matched++; N.Sound.ok();
        const said = b.o.t || a.o.t; if (said) N.speak(said, api.lang);
        clear();
        if (matched === pairs.length) {
          api.praise(act.ex);
          api.done({ score: (pairs.length - bad.size) / pairs.length, hints, revealed });
        }
      } else {
        N.Sound.soft(); lb[selL].classList.add('shake'); rb[selR].classList.add('shake');
        const l = selL, r = selR; setTimeout(() => { lb[l].classList.remove('shake'); rb[r].classList.remove('shake'); }, 450);
        bad.add(a.i); errs[a.i] = (errs[a.i] || 0) + 1;
        if (errs[a.i] >= 2) {   // بعد خطأين: نُظهر المطابقة الصحيحة
          revealed = true; const k = R.findIndex(x => x.i === a.i); rb[k].classList.add('flash'); setTimeout(() => rb[k].classList.remove('flash'), 1900);
          api.fb('ex', `👀 ${esc(N.t('together'))}`);
        } else api.fb('hint', `💡 ${esc(act.hint || N.t('tryAgain'))}`);
        clear();
      }
    };
    lb.forEach((b, k) => b.onclick = () => { if (b.disabled) return; N.Sound.tap(); lb.forEach(x => x.classList.remove('sel')); selL = k; b.classList.add('sel'); if (L[k].o.t) N.speak(L[k].o.t, api.lang); tryPair(); });
    rb.forEach((b, k) => b.onclick = () => { if (b.disabled) return; N.Sound.tap(); rb.forEach(x => x.classList.remove('sel')); selR = k; b.classList.add('sel'); tryPair(); });
    return {
      hint() {
        hints++;
        const lk = selL != null ? selL : lb.findIndex(b => !b.disabled); if (lk < 0) return;
        const rk = R.findIndex(x => x.i === L[lk].i);
        lb[lk].classList.add('flash'); rb[rk].classList.add('flash');
        setTimeout(() => { lb[lk].classList.remove('flash'); rb[rk].classList.remove('flash'); }, 1900);
      }
    };
  }
};

/* ---------------- الترتيب (حروف، كلمات، أعداد، خطوات) ---------------- */
N.Games.order = {
  mount(act, api) {
    const items = act.items, n = items.length, steps = act.mode === 'steps';
    const dir = act.dir || (api.lang === 'en' ? 'ltr' : 'rtl');
    let bank = shuffle(items.map((t, i) => ({ t, id: i })));
    if (n > 1) while (bank.every((x, i) => x.t === items[i])) bank = shuffle(bank);
    const slots = Array(n).fill(null), locked = Array(n).fill(false);
    let tries = 0, hints = 0, busy = false, over = false;
    api.el.innerHTML = `<p class="small muted" style="text-align:center;margin:0">${esc(N.t('orderHint'))}</p>
      <div class="slots ${steps ? 'steps' : ''}" dir="${dir}"></div>
      ${act.mode === 'letters' ? '<div class="joined" dir="rtl"></div>' : ''}
      <div class="bank ${steps ? 'steps' : ''}" dir="${dir}"></div>`;
    const sEl = api.el.querySelector('.slots'), bEl = api.el.querySelector('.bank'), jEl = api.el.querySelector('.joined');
    const draw = () => {
      sEl.innerHTML = slots.map((x, i) => `<button class="slot ${x ? 'full' : ''} ${locked[i] ? 'ok' : ''}" data-i="${i}">${steps ? `<span class="n">${i + 1}</span>` : ''}${x ? esc(x.t) : ''}</button>`).join('');
      const used = new Set(slots.filter(Boolean).map(x => x.id));
      bEl.innerHTML = bank.map(x => `<button class="tilebtn ${used.has(x.id) ? 'used' : ''}" data-id="${x.id}"><bdi>${esc(x.t)}</bdi></button>`).join('');
      if (jEl) jEl.textContent = slots.map(x => x ? x.t : '').join('');
      sEl.querySelectorAll('.slot').forEach(b => b.onclick = () => { const i = +b.dataset.i; if (busy || over || locked[i] || !slots[i]) return; slots[i] = null; N.Sound.tap(); draw(); });
      bEl.querySelectorAll('.tilebtn').forEach(b => b.onclick = () => {
        if (busy || over) return; const id = +b.dataset.id; if (slots.some(x => x && x.id === id)) return;
        const i = slots.findIndex(x => !x); if (i < 0) return;
        slots[i] = bank.find(x => x.id === id); N.Sound.place();
        if (act.mode === 'letters' || act.mode === 'words') N.speak(slots[i].t, api.lang);
        draw(); if (slots.every(Boolean)) check();
      });
    };
    const win = (revealed) => {
      over = true; draw();
      if (act.mode !== 'nums') N.speak(act.say || items.join(act.mode === 'letters' ? '' : ' '), api.lang);
      if (!revealed) { N.Sound.ok(); api.praise(act.ex); }
      api.done({ score: revealed ? 0 : tries === 0 ? 1 : tries === 1 ? 0.5 : 0.25, hints, revealed });
    };
    const check = () => {
      const okv = slots.map((x, i) => x.t === items[i]);
      if (okv.every(Boolean)) { okv.forEach((_, i) => locked[i] = true); return win(false); }
      tries++; busy = true; N.Sound.soft();
      okv.forEach((v, i) => { const b = sEl.children[i]; b.classList.add(v ? 'ok' : 'bad'); if (v) locked[i] = true; });
      setTimeout(() => {
        busy = false;
        if (tries >= 3) {  // كشف الترتيب الصحيح بعد 3 محاولات
          items.forEach((t, i) => { slots[i] = bank.find(x => x.t === t && !slots.slice(0, i).some(s => s && s.id === x.id)); locked[i] = true; });
          api.fb('ex', `<b>${esc(N.t('together'))}</b> ${esc(act.ex || '')}`); return win(true);
        }
        slots.forEach((x, i) => { if (!locked[i]) slots[i] = null; });
        api.fb('hint', `💡 ${esc(act.hint || N.t('tryAgain'))}`); draw();
      }, 800);
    };
    draw();
    return {
      hint() {
        if (over || busy) return; hints++;
        const i = locked.findIndex(v => !v); if (i < 0) return;
        slots.forEach((x, k) => { if (!locked[k]) slots[k] = null; });
        const used = new Set(slots.filter(Boolean).map(x => x.id));
        slots[i] = bank.find(x => x.t === items[i] && !used.has(x.id)); locked[i] = true;
        N.Sound.place(); draw();
        if (locked.every(Boolean)) win(false);
      }
    };
  }
};

/* ---------------- البحث عن الكلمات (عربي من اليمين لليسار، وإنجليزي) ---------------- */
N.Games.ws = {
  AR: 'ابتثجحخدذرزسشصضطظعغفقكلمنهوي',
  EN: 'ABCDEFGHIJKLMNOPRSTUVWY',
  build(words, size, dirs, lang) {
    const rtl = lang !== 'en';
    const D = [[rtl ? -1 : 1, 0], [0, 1]]; if (dirs.includes('d')) D.push([rtl ? -1 : 1, 1]);
    for (let attempt = 0; attempt < 80; attempt++) {
      const g = Array.from({ length: size }, () => Array(size).fill(null)), pos = [];
      let ok = true;
      for (const w of words.slice().sort((a, b) => b.length - a.length)) {
        let placed = false;
        for (let t = 0; t < 200 && !placed; t++) {
          const [dx, dy] = D[Math.floor(Math.random() * D.length)];
          const x0 = Math.floor(Math.random() * size), y0 = Math.floor(Math.random() * size);
          const xe = x0 + dx * (w.length - 1), ye = y0 + dy * (w.length - 1);
          if (xe < 0 || xe >= size || ye >= size) continue;
          let fits = true;
          for (let k = 0; k < w.length; k++) { const c = g[y0 + dy * k][x0 + dx * k]; if (c && c !== w[k]) { fits = false; break; } }
          if (!fits) continue;
          const cells = [];
          for (let k = 0; k < w.length; k++) { g[y0 + dy * k][x0 + dx * k] = w[k]; cells.push((y0 + dy * k) * size + x0 + dx * k); }
          pos.push({ w, cells }); placed = true;
        }
        if (!placed) { ok = false; break; }
      }
      if (ok) {
        const AB = lang === 'en' ? this.EN : this.AR;
        return { grid: g.flat().map(c => c || AB[Math.floor(Math.random() * AB.length)]), pos };
      }
    }
    return this.build(words, size + 1, dirs, lang);
  },
  mount(act, api) {
    const words = act.words.map(w => Object.assign({}, w, { L: Array.from(w.w) }));
    let size = Math.max(act.size || 6, ...words.map(w => w.L.length));
    const B = this.build(words.map(w => w.L), size, act.dirs || 'hv', api.lang);
    size = Math.round(Math.sqrt(B.grid.length));
    const show = act.show || 'both';
    api.el.innerHTML = `<div class="wwords" dir="${api.lang === 'en' ? 'ltr' : 'rtl'}">${words.map((w, i) =>
        `<span class="ww" data-i="${i}">${show !== 'word' ? `<span class="e">${w.e || ''}</span>` : ''}<span class="wt">${show === 'pic' ? '' : esc(w.w)}</span></span>`).join('')}</div>
      <div class="grid" style="grid-template-columns:repeat(${size},1fr)">${B.grid.map((c, i) => `<div class="cell" data-i="${i}">${esc(c)}</div>`).join('')}</div>
      <p class="small muted" style="text-align:center;margin:0">${esc(N.t('tapStart'))}</p>`;
    const grid = api.el.querySelector('.grid'), cells = [...grid.children], chips = [...api.el.querySelectorAll('.ww')];
    const found = new Set(); let hints = 0, start = null, cur = null, moved = false, tapStart = null, over = false;
    const t0 = Date.now(); let tick = null;
    if (api.timer) tick = setInterval(() => { if (!document.body.contains(grid)) return clearInterval(tick); api.timer(Math.floor((Date.now() - t0) / 1000)); }, 500);
    const at = (x, y) => { const e = document.elementFromPoint(x, y); return e && e.classList.contains('cell') && grid.contains(e) ? +e.dataset.i : null; };
    const line = (a, b) => {
      const ax = a % size, ay = Math.floor(a / size); let dx = b % size - ax, dy = Math.floor(b / size) - ay;
      const len = Math.max(Math.abs(dx), Math.abs(dy)); if (!len) return [a];
      const ang = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4);
      const sx = Math.round(Math.cos(ang)), sy = Math.round(Math.sin(ang)), out = [];
      for (let k = 0; k <= len; k++) { const x = ax + sx * k, y = ay + sy * k; if (x < 0 || y < 0 || x >= size || y >= size) break; out.push(y * size + x); }
      return out;
    };
    const paint = sel => cells.forEach((c, i) => c.classList.toggle('sel', sel.includes(i)));
    const evalSel = sel => {
      paint([]);
      if (sel.length < 2) return;
      const s = sel.map(i => B.grid[i]).join(''), r = sel.map(i => B.grid[i]).reverse().join('');
      const wi = words.findIndex((w, i) => !found.has(i) && (w.L.join('') === s || w.L.join('') === r));
      if (wi < 0) { N.Sound.soft(); return; }
      found.add(wi); const col = PAL[found.size % PAL.length];
      sel.forEach(i => { cells[i].classList.add('found'); cells[i].style.background = col; });
      const w = words[wi]; chips[wi].classList.add('found'); chips[wi].querySelector('.wt').textContent = w.w;
      N.Sound.found(); N.speak(w.w.toLowerCase(), api.lang);
      if (w.m) {
        const m = document.createElement('div'); m.className = 'meaning';
        m.innerHTML = `<b>${w.e || ''} ${esc(w.w)}</b><div>${esc(w.m)}</div>`; document.body.appendChild(m); setTimeout(() => m.remove(), 2600);
      }
      if (found.size === words.length) {
        over = true; clearInterval(tick);
        api.done({ score: hints > words.length / 2 ? 0.5 : 1, hints, revealed: false, secs: Math.floor((Date.now() - t0) / 1000) });
        api.praise(); api.learned(words.map(w => ({ e: w.e, t: w.w + (w.m ? ': ' + w.m : '') })));
      }
    };
    grid.addEventListener('pointerdown', e => {
      if (over) return; const i = at(e.clientX, e.clientY); if (i == null) return;
      grid.setPointerCapture(e.pointerId); start = cur = i; moved = false; paint(tapStart != null ? line(tapStart, i) : [i]);
    });
    grid.addEventListener('pointermove', e => {
      if (start == null) return; const i = at(e.clientX, e.clientY); if (i == null || i === cur) return;
      cur = i; moved = true; tapStart = null; paint(line(start, cur));
    });
    const up = () => {
      if (start == null) return;
      if (!moved) {
        if (tapStart == null) { tapStart = start; paint([start]); N.Sound.tap(); }
        else { const sel = line(tapStart, start); tapStart = null; evalSel(sel); }
      } else evalSel(line(start, cur));
      start = cur = null;
    };
    grid.addEventListener('pointerup', up); grid.addEventListener('pointercancel', () => { start = null; paint([]); });
    return {
      hint() {
        if (over) return; const wi = words.findIndex((w, i) => !found.has(i)); if (wi < 0) return; hints++;
        const p = B.pos.find(p => p.w.join('') === words[wi].L.join(''));
        const c = cells[p.cells[0]]; c.classList.add('hintc'); setTimeout(() => c.classList.remove('hintc'), 2500);
        N.speak(words[wi].w.toLowerCase(), api.lang);
      },
      stop() { clearInterval(tick); }
    };
  }
};
