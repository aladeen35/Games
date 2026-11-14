/* =====================================================================
   نبراس — ألعاب إضافية مبنية على تقنيات تطبيق أثير (memory.js / bubbles.js)
   memory : لعبة الذاكرة — قلب ثلاثي الأبعاد، نظرة «تذكّر» أولى، رفع ووهج عند التطابق، اهتزاز عند الخطأ
   sort   : التصنيف في سلال — سحب العنصر إلى السلة أو لمسه ثم لمس السلة
   pop    : فقاعات لامعة تصعد وتتمايل — المس الفقاعات الصحيحة فقط
   كلها DOM/SVG، والحركة على transform/opacity فقط، وتحترم تقليل الحركة.
   ===================================================================== */
'use strict';

/* ---------------- مؤثرات مشتركة ---------------- */
N.vib = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };
N.fx = {
  /* شرر يتطاير من نقطة (منقول من sparkle/burst في أثير) */
  burst(x, y, color, n = 14) {
    if (N.motionReduced()) return;
    const ring = document.createElement('i'); ring.className = 'fx-ring'; ring.style.cssText = `left:${x}px;top:${y}px;border-color:${color}`;
    document.body.appendChild(ring);
    ring.animate([{ transform: 'translate(-50%,-50%) scale(.2)', opacity: .9 }, { transform: 'translate(-50%,-50%) scale(1.6)', opacity: 0 }], { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' }).onfinish = () => ring.remove();
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i'); p.className = 'fx-dot' + (i % 3 === 0 ? ' star' : '');
      const a = Math.PI * 2 * i / n + Math.random() * .4, d = 34 + Math.random() * 46, sz = 5 + Math.random() * 6;
      p.style.cssText = `left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;background:${i % 2 ? color : '#FFE26B'}`;
      document.body.appendChild(p);
      p.animate([{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }, { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(.3)`, opacity: 0 }],
        { duration: 520 + Math.random() * 200, easing: 'cubic-bezier(.16,1,.3,1)' }).onfinish = () => p.remove();
    }
  },
  at(el, color, n) { const r = el.getBoundingClientRect(); this.burst(r.left + r.width / 2, r.top + r.height / 2, color, n); },
  /* اهتزاز دوراني للخطأ (من أثير: rotate 0→-8→8→0) */
  wobble(el) { if (N.motionReduced() || !el.animate) return; el.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(7deg)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(0)' }], { duration: 360 }); }
};
const optText = o => typeof o === 'string' ? o : (o && o.t) || '';
const BUB = [ // ألوان فقاعات أثير {أساسي، فاتح، داكن}
  ['#FF5A6E', '#FFC9D0', '#C21F3C'], ['#FFC52E', '#FFF0B8', '#D18F00'], ['#4FCF62', '#CFF5D4', '#22963A'],
  ['#3E9DFF', '#C8E2FF', '#1D68C9'], ['#A06BFF', '#E2D3FF', '#6A3FD1'], ['#FF74C2', '#FFD3EA', '#C9358A']
];

/* ---------------- لعبة الذاكرة ---------------- */
N.Games.memory = {
  mount(act, api) {
    const pairs = act.pairs.map(p => [N.normOpt(p[0]), N.normOpt(p[1])]);
    const cards = shuffle(pairs.flatMap((p, i) => [{ o: p[0], k: i }, { o: p[1], k: i }]));
    const long = cards.some(c => optText(c.o).length > 9);
    const cols = cards.length <= 6 ? 3 : long ? 3 : 4;
    api.el.innerHTML = `<p class="small muted" style="text-align:center;margin:0 0 10px" id="memMsg">${esc(api.lang === 'en' ? '👀 Remember the cards!' : '👀 تذكّر أماكن البطاقات!')}</p>
      <div class="mem" style="--cols:${cols}" dir="${api.lang === 'en' ? 'ltr' : 'rtl'}">${cards.map((c, i) => `
        <button class="mcard up" data-i="${i}" aria-label="card"><span class="mc-in"><span class="mc-face mc-back"><i></i></span>
        <span class="mc-face mc-front">${N.Vis.opt(c.o)}</span></span></button>`).join('')}</div>`;
    const els = [...api.el.querySelectorAll('.mcard')];
    let open = [], matched = 0, misses = 0, streak = 0, hints = 0, busy = true, over = false;
    const peek = api.kg ? 2200 : 1500;
    setTimeout(() => { els.forEach(e => e.classList.remove('up')); busy = false; const m = api.el.querySelector('#memMsg'); if (m) m.textContent = api.lang === 'en' ? 'Find the matching pairs' : 'اقلب بطاقتين وابحث عن الزوجين المتطابقين'; }, peek);
    const check = () => {
      const [a, b] = open;
      if (cards[a].k === cards[b].k) {
        [a, b].forEach(i => { els[i].classList.add('matched'); els[i].disabled = true; });
        matched++; streak++; open = []; busy = false;
        N.Sound.match(streak); N.vib(25); N.fx.at(els[b], PAL[matched % PAL.length]);
        const say = optText(cards[a].o) || optText(cards[b].o); if (say) N.speak(say, api.lang);
        if (streak >= 2) api.fb('good', `<span class="i">🌟</span><b>${esc((api.lang === 'en' ? ['Great!', 'Excellent!', 'Amazing!', 'Genius!'] : ['رائع!', 'ممتاز!', 'مذهل!', 'عبقري!'])[Math.min(streak - 2, 3)])}</b>`);
        if (matched === pairs.length) {
          over = true; api.praise(act.ex);
          api.done({ score: misses <= Math.ceil(pairs.length / 2) ? 1 : misses <= pairs.length ? .5 : .25, hints, revealed: false });
        }
      } else {
        misses++; streak = 0; N.Sound.soft(); N.vib(15);
        [a, b].forEach(i => N.fx.wobble(els[i]));
        setTimeout(() => { [a, b].forEach(i => els[i].classList.remove('up')); open = []; busy = false; }, 800);
      }
    };
    els.forEach((e, i) => e.onclick = () => {
      if (busy || over || e.classList.contains('up') || e.classList.contains('matched')) return;
      e.classList.add('up'); N.Sound.tap(); open.push(i);
      if (open.length === 2) { busy = true; setTimeout(check, 320); }
    });
    return {
      hint() {   // نظرة سريعة على زوج واحد
        if (busy || over) return; hints++; busy = true;
        const k = cards.find((c, i) => !els[i].classList.contains('matched')).k;
        const idx = cards.map((c, i) => c.k === k ? i : -1).filter(i => i >= 0 && !els[i].classList.contains('up'));
        idx.forEach(i => els[i].classList.add('up', 'peek'));
        setTimeout(() => { idx.forEach(i => els[i].classList.remove('up', 'peek')); busy = false; }, 1000);
      }
    };
  }
};

/* ---------------- التصنيف في سلال ---------------- */
N.Games.sort = {
  mount(act, api) {
    const bins = act.bins.map(N.normOpt), items = shuffle(act.items.map((it, i) => ({ o: it, bin: it.bin, i })));
    api.el.innerHTML = `<p class="small muted" style="text-align:center;margin:0">${esc(api.lang === 'en' ? 'Drag each card to its basket, or tap the card then the basket' : 'اسحب كل بطاقة إلى سلتها، أو المس البطاقة ثم السلة')}</p>
      <div class="sort-tray" dir="${api.lang === 'en' ? 'ltr' : 'rtl'}">${items.map((x, k) => `<button class="sitem" data-k="${k}">${N.Vis.opt(x.o)}</button>`).join('')}</div>
      <div class="sort-bins" style="--n:${bins.length}" dir="${api.lang === 'en' ? 'ltr' : 'rtl'}">${bins.map((b, j) => `<div class="sbin" data-j="${j}" style="--bc:${PAL[j]}"><div class="sbin-h">${N.Vis.opt(b)}</div><div class="sbin-in"></div><span class="sbin-n">0</span></div>`).join('')}</div>`;
    const iEls = [...api.el.querySelectorAll('.sitem')], bEls = [...api.el.querySelectorAll('.sbin')];
    let sel = null, placed = 0, hints = 0, revealed = false, over = false;
    const errs = {}, bad = new Set();
    const select = k => { iEls.forEach(e => e.classList.remove('sel')); sel = k; if (k != null) { iEls[k].classList.add('sel'); const t = optText(items[k].o); if (t) N.speak(t, api.lang); } };
    const drop = (k, j) => {
      const it = items[k], el = iEls[k];
      if (it.bin === j) {
        const from = el.getBoundingClientRect(), slot = document.createElement('span');
        slot.className = 'smini'; slot.innerHTML = N.Vis.opt(it.o);
        bEls[j].querySelector('.sbin-in').appendChild(slot);
        const to = slot.getBoundingClientRect();
        if (!N.motionReduced() && slot.animate) slot.animate([{ transform: `translate(${from.left - to.left}px,${from.top - to.top}px) scale(1.4)`, opacity: .6 }, { transform: 'none', opacity: 1 }], { duration: 380, easing: 'cubic-bezier(.34,1.56,.64,1)' });
        el.classList.add('gone'); el.disabled = true; placed++;
        const n = bEls[j].querySelector('.sbin-n'); n.textContent = +n.textContent + 1;
        N.Sound.ok(); N.vib(20); N.fx.at(bEls[j], PAL[j], 10); select(null);
        if (placed === items.length) { over = true; api.praise(act.ex); api.done({ score: (items.length - bad.size) / items.length, hints, revealed }); }
      } else {
        bad.add(k); errs[k] = (errs[k] || 0) + 1; N.Sound.soft(); N.vib(15);
        N.fx.wobble(el); N.fx.wobble(bEls[j]);
        if (errs[k] >= 2) { revealed = true; bEls[it.bin].classList.add('flash'); setTimeout(() => bEls[it.bin].classList.remove('flash'), 1800); api.fb('ex', `👀 ${esc(N.t('together'))}`); }
        else api.fb('hint', `💡 ${esc(act.hint || N.t('tryAgain'))}`);
      }
    };
    /* سحب بالإصبع أو لمستان */
    iEls.forEach((el, k) => {
      let sx = 0, sy = 0, drag = false, id = null;
      el.addEventListener('pointerdown', e => { if (over || el.disabled) return; id = e.pointerId; sx = e.clientX; sy = e.clientY; drag = false; try { el.setPointerCapture(id); } catch (err) {} });
      el.addEventListener('pointermove', e => {
        if (e.pointerId !== id) return; const dx = e.clientX - sx, dy = e.clientY - sy;
        if (!drag && Math.hypot(dx, dy) > 8) { drag = true; select(k); el.classList.add('drag'); }
        if (drag) { el.style.transform = `translate(${dx}px,${dy}px) scale(1.08)`; const b = document.elementFromPoint(e.clientX, e.clientY); bEls.forEach(x => x.classList.toggle('over', !!b && x.contains(b))); }
      });
      const end = e => {
        if (e.pointerId !== id) return; id = null;
        if (drag) {
          el.classList.remove('drag'); el.style.transform = ''; bEls.forEach(x => x.classList.remove('over'));
          el.style.visibility = 'hidden'; const b = document.elementFromPoint(e.clientX, e.clientY); el.style.visibility = '';
          const bin = b && b.closest && b.closest('.sbin'); if (bin) drop(k, +bin.dataset.j);
        } else { N.Sound.tap(); select(sel === k ? null : k); }
      };
      el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    });
    bEls.forEach((b, j) => b.addEventListener('click', () => { if (sel != null && !over) drop(sel, j); }));
    return {
      hint() {
        if (over) return; hints++;
        const k = sel != null ? sel : iEls.findIndex(e => !e.disabled); if (k < 0) return;
        select(k); const b = bEls[items[k].bin]; b.classList.add('flash'); setTimeout(() => b.classList.remove('flash'), 1600);
      }
    };
  }
};

/* ---------------- الفقاعات ---------------- */
N.Games.pop = {
  mount(act, api) {
    const items = shuffle(act.items.map(N.normOpt));
    const need = items.filter(x => x.ok).length;
    api.el.innerHTML = `<div class="pop-arena"><div class="pop-count">${N.ic('target', { size: 18, color: '#142B4A' })} <span dir="ltr"><b>0</b> / ${need}</span></div>
      ${items.map((x, k) => { const c = BUB[k % BUB.length]; return `<button class="bub" data-k="${k}" style="--b:${c[0]};--l:${c[1]};--d:${c[2]}"><span class="bub-c">${N.Vis.opt(x)}</span></button>`; }).join('')}</div>`;
    const arena = api.el.querySelector('.pop-arena'), els = [...arena.querySelectorAll('.bub')], cnt = arena.querySelector('.pop-count b');
    let found = 0, wrongs = 0, hints = 0, over = false, raf = 0, last = 0;
    const W = () => arena.clientWidth, H = () => arena.clientHeight;
    const size = Math.max(70, Math.min(96, Math.floor((Math.min(innerWidth, 560) - 40) / 4)));
    const reduced = N.motionReduced();
    const st = els.map((e, k) => {
      e.style.width = e.style.height = size + 'px';
      const cols = Math.max(2, Math.floor(W() / (size + 10)));
      return { x: (k % cols) * (W() - size) / Math.max(1, cols - 1), y: reduced ? 40 + Math.floor(k / cols) * (size + 12) : H() * .15 + (k / items.length) * H() * 1.1, v: 16 + Math.random() * 16, ph: Math.random() * 6, amp: 6 + Math.random() * 10 };
    });
    const place = (e, s, t) => { e.style.transform = `translate3d(${s.x + (reduced ? 0 : Math.sin(t * 1.6 + s.ph) * s.amp)}px,${s.y}px,0)`; };
    const loop = ts => {
      if (!document.body.contains(arena) || over) return;
      const dt = Math.min(.05, (ts - (last || ts)) / 1000); last = ts; const t = ts / 1000;
      els.forEach((e, k) => { if (e.classList.contains('popped')) return; const s = st[k]; s.y -= s.v * dt; if (s.y < -size) { s.y = H() + Math.random() * 30; } place(e, s, t); });
      raf = requestAnimationFrame(loop);
    };
    if (reduced) { arena.style.height = (Math.ceil(items.length / Math.max(2, Math.floor(W() / (size + 10)))) * (size + 12) + 60) + 'px'; els.forEach((e, k) => place(e, st[k], 0)); }
    else raf = requestAnimationFrame(loop);
    els.forEach((e, k) => e.addEventListener('pointerdown', ev => {
      ev.preventDefault();
      if (over || e.classList.contains('popped')) return;
      if (items[k].ok) {
        e.classList.add('popped'); found++; cnt.textContent = found;
        N.Sound.pop(); N.vib(15); N.fx.at(e, BUB[k % BUB.length][0], 12);
        const t = optText(items[k]); if (t) N.speak(t, api.lang);
        if (found === need) { over = true; cancelAnimationFrame(raf); api.praise(act.ex); api.done({ score: wrongs === 0 ? 1 : wrongs <= 1 ? .5 : .25, hints, revealed: false }); }
      } else {
        wrongs++; N.Sound.soft(); N.vib(12); N.fx.wobble(e.querySelector('.bub-c'));
        api.fb('hint', `💡 ${esc(act.hint || N.t('tryAgain'))}`);
      }
    }));
    return {
      hint() { if (over) return; hints++; const k = items.findIndex((x, i) => x.ok && !els[i].classList.contains('popped')); if (k >= 0) { els[k].classList.add('flash'); setTimeout(() => els[k].classList.remove('flash'), 2000); } },
      stop() { cancelAnimationFrame(raf); }
    };
  }
};
