/* =====================================================================
   الشاشة الرئيسية الحيّة
   1) خلفية بطبقات (سماء، شمس/قمر، غيوم بثلاثة أعماق، تلال، عابرون) تتبع ساعة الجهاز:
      صباح ← ظهر ← غروب ← ليل بنجوم وقمر، مع مزج ناعم للألوان وصبغة الثيم (بناتي/ولادي).
      إعداد «الخلفية: تلقائي/نهار/ليل» (app:sky).
   2) اختلاف المنظور: الطبقات تتحرك بسرعات مختلفة مع التمرير وميل الجهاز ومؤشر الفأرة
      (transform فقط، حلقة rAF واحدة تعمل عند الحاجة وتتوقف وحدها).
   3) أيقونات حيّة: حركة توقيع قصيرة حين تظهر البطاقة (IntersectionObserver، مرة لكل ظهور،
      لا أثناء التمرير السريع) ولمعة هادئة على اللعبة المقترحة. رسم الأيقونات يبقى مخزّنًا؛
      نحرّك الغلاف فقط.
   كل شيء يتوقف حين تُفتح لعبة أو يُخفى التبويب، ويحترم «تقليل الحركة».
   ===================================================================== */
'use strict';

window.Home = (function () {
  const HEX = h => { const n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; };
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const lerp = (a, b, t) => a + (b - a) * t;

  /* لوحات الألوان: 4 ألوان للسماء (من الأعلى)، غيمة وظلها، 3 تلال (البعيد ← القريب)، لون الشمس ووهجها */
  const P = (sky, cloud, cs, hill, sun, glow, o) => Object.assign({ sky: sky.map(HEX), cloud: HEX(cloud), cs: HEX(cs), hill: hill.map(HEX), sun: HEX(sun), glow: HEX(glow) }, o);
  const PAL = {
    girls: {
      morning: P(['#FFA4C4', '#FFCBCB', '#FFE9DC', '#FFF2E4'], '#FFFFFF', '#FFD9E4', ['#F7B4D2', '#C4E8B2', '#9FDC9A'], '#FFC94F', '#FFC890', { night: 0, orb: 25, clo: 1 }),
      noon:    P(['#FFB0D8', '#FFD6EB', '#FFF0F8', '#FFF7FB'], '#FFFFFF', '#FFDDEE', ['#F7B9DC', '#BDEAB8', '#93DC9A'], '#FFD84D', '#FFECAA', { night: 0, orb: 14, clo: 1 }),
      sunset:  P(['#B987E0', '#FF97B4', '#FFBE98', '#FFDDB4'], '#FFE8EE', '#FFB5C6', ['#D58CC6', '#B88BCB', '#9670B8'], '#FF9448', '#FF9A5E', { night: 0, orb: 29, clo: .95 }),
      night:   P(['#22154E', '#3A2270', '#643C90', '#8452A2'], '#8D70BA', '#6C509E', ['#5B3B8C', '#42296E', '#2E1D55'], '#FFF3C4', '#FFF0C8', { night: 1, orb: 16, clo: .55 })
    },
    boys: {
      morning: P(['#86C8FF', '#C6E5FF', '#FFEED2', '#FFF5E4'], '#FFFFFF', '#DCEBFF', ['#A9D4F7', '#A9E3B6', '#7ED391'], '#FFC94F', '#FFD08E', { night: 0, orb: 25, clo: 1 }),
      noon:    P(['#6BB8FF', '#B6DCFF', '#E7F4FF', '#F3FAFF'], '#FFFFFF', '#D6E8FF', ['#9CCBF5', '#A2E2B4', '#79D28D'], '#FFD84D', '#FFECAA', { night: 0, orb: 14, clo: 1 }),
      sunset:  P(['#5B7CE0', '#B598E0', '#FFB088', '#FFDAAC'], '#FFEBE0', '#F6BFAE', ['#8090D8', '#6D7EC6', '#5767B0'], '#FF9448', '#FF9A5E', { night: 0, orb: 29, clo: .95 }),
      night:   P(['#0A1840', '#152E6C', '#2C5198', '#426EB4'], '#6283C2', '#4868A8', ['#28478C', '#1B3472', '#122552'], '#FFF3C4', '#FFF0C8', { night: 1, orb: 16, clo: .55 })
    }
  };
  /* مفاتيح اليوم (بالساعة): بينها مزج خطّي ناعم */
  const KEYS = [[0, 'night'], [4.6, 'night'], [6.4, 'morning'], [9.5, 'morning'], [11.5, 'noon'], [15.4, 'noon'], [17.6, 'sunset'], [18.7, 'sunset'], [20.2, 'night'], [24, 'night']];

  const H = {
    ready: false, reduce: false, active: false, suggested: null,
    cur: { x: 0, y: 0, s: 0 }, tgt: { x: 0, y: 0, s: 0 }, raf: 0, layers: [], vh: 0,
    vel: 0, lastS: 0, lastT: 0, lastScroll: 0,
    shown: new Set(), pending: new Set(), flushT: 0, quietUntil: 0, io: null,
    sig: '', flyCall: null, flyTl: null,

    /* ---------- الإعداد (مرة واحدة، عند أول بناء للقائمة) ---------- */
    init() {
      if (this.ready) return; this.ready = true;
      this.menu = document.getElementById('menu'); this.sky = document.getElementById('sky'); this.fly = document.getElementById('skFly');
      if (!this.menu || !this.sky) return;
      try { const mq = matchMedia('(prefers-reduced-motion: reduce)'); this.reduce = mq.matches; (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(() => { this.reduce = mq.matches; this.sync(); }); } catch (e) {}
      this.layers = [].map.call(this.sky.querySelectorAll('.sk-l'), el => ({ el, d: +el.dataset.d || 0, r: +el.dataset.r || 0 }));
      this.vh = innerHeight;
      this.stars(); this.trees();
      let rt = 0;
      addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { this.vh = innerHeight; this.stars(); this.kick(); }, 200); });
      /* التمرير: نسجّل الهدف والسرعة فقط؛ الكتابة في rAF */
      this.menu.addEventListener('scroll', () => {
        const s = this.menu.scrollTop, t = performance.now(), dt = t - this.lastT;
        if (dt > 0) this.vel = lerp(this.vel, Math.abs(s - this.lastS) / Math.min(dt, 100), .5);
        this.lastS = s; this.lastT = this.lastScroll = t; this.tgt.s = s;
        this.kick(); this.flushSoon();
      }, { passive: true });
      /* ميل الجهاز (اختياري ومحدود) ومؤشر الفأرة على الحاسوب */
      let b0 = null;
      addEventListener('deviceorientation', e => {
        if (!this.active || e.gamma == null || e.beta == null) return;
        if (b0 == null) b0 = e.beta;
        b0 = lerp(b0, e.beta, .01); // يتكيّف ببطء مع طريقة حمل الجهاز
        this.tgt.x = clamp(e.gamma / 28, -1, 1); this.tgt.y = clamp((e.beta - b0) / 28, -1, 1); this.kick();
      }, { passive: true });
      this.menu.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        this.tgt.x = clamp(e.clientX / innerWidth * 2 - 1, -1, 1); this.tgt.y = clamp(e.clientY / innerHeight * 2 - 1, -1, 1); this.kick();
      }, { passive: true });
      document.addEventListener('visibilitychange', () => { if (!document.hidden) this.paint(); this.sync(); });
      setInterval(() => { if (this.active) this.paint(); }, 60000);
      /* شريط الأقسام اللاصق: خلفية بلون السماء فقط حين يلتصق (حارس بلا قياسات أثناء التمرير) */
      const cats = document.getElementById('cats');
      if (cats && window.IntersectionObserver) {
        const g = document.createElement('i'); g.style.cssText = 'display:block;width:1px;height:1px;margin-bottom:-1px;pointer-events:none'; cats.parentNode.insertBefore(g, cats);
        new IntersectionObserver(es => { const e = es[es.length - 1]; cats.classList.toggle('stuck', !e.isIntersecting && e.boundingClientRect.top < 40); }, { root: this.menu, rootMargin: '-8px 0px 0px 0px' }).observe(g);
      }
      if (window.IntersectionObserver) this.io = new IntersectionObserver(es => this.seen(es), { root: this.menu, threshold: .8 });
    },

    /* ---------- الوقت والألوان ---------- */
    hour() {
      const m = gstore.get('sky', 'auto');
      if (m === 'day') return 13; if (m === 'night') return 23;
      const d = new Date(); return d.getHours() + d.getMinutes() / 60;
    },
    palette() {
      const set = PAL[document.documentElement.dataset.theme === 'boys' ? 'boys' : 'girls'], h = this.hour();
      let i = 0; while (i < KEYS.length - 2 && h >= KEYS[i + 1][0]) i++;
      const A = set[KEYS[i][1]], B = set[KEYS[i + 1][1]];
      let t = clamp((h - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0]), 0, 1); t = t * t * (3 - 2 * t);
      return {
        sky: A.sky.map((c, k) => mix(c, B.sky[k], t)), hill: A.hill.map((c, k) => mix(c, B.hill[k], t)),
        cloud: mix(A.cloud, B.cloud, t), cs: mix(A.cs, B.cs, t), sun: mix(A.sun, B.sun, t), glow: mix(A.glow, B.glow, t),
        night: lerp(A.night, B.night, t), orb: lerp(A.orb, B.orb, t), clo: lerp(A.clo, B.clo, t)
      };
    },
    /** تلوين المشهد حسب الساعة والثيم (يكتب فقط إن تغيّر شيء) */
    paint() {
      if (!this.menu) return;
      const p = this.palette(), rgb = c => 'rgb(' + c.join(',') + ')', hx = c => '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
      const v = {
        '--sky1': rgb(p.sky[0]), '--sky2': rgb(p.sky[1]), '--sky3': rgb(p.sky[2]), '--sky4': rgb(p.sky[3]),
        '--hill1': rgb(p.hill[0]), '--hill2': rgb(p.hill[1]), '--hill3': rgb(p.hill[2]),
        '--cloud': rgb(p.cloud), '--cloud-s': rgb(p.cs), '--cl-o': p.clo.toFixed(2), '--sun': rgb(p.sun), '--glow': p.glow.join(','),
        '--night': p.night.toFixed(3), '--orb-y': p.orb.toFixed(1)
      };
      const sig = JSON.stringify(v); if (sig === this.sig) return; this.sig = sig;
      const st = this.menu.style; Object.keys(v).forEach(k => st.setProperty(k, v[k]));
      this.night = p.night > .5;
      this.menu.dataset.sky = this.night ? 'night' : 'day';
      this.sky.querySelector('.sk-stars').style.display = p.night < .02 ? 'none' : '';
      // أندرويد: شريطا النظام يتبعان أعلى السماء وأقرب تلّة
      try { if (window.AndroidBridge && AndroidBridge.setBars) AndroidBridge.setBars(hx(p.sky[0]), hx(p.hill[2])); } catch (e) {}
    },
    /** نجوم ثابتة المواضع (box-shadow) في ثلاث مجموعات تتلألأ بإيقاعات مختلفة */
    stars() {
      const W = Math.max(innerWidth, 320), Hh = innerHeight * .6; let seed = 7;
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      [].forEach.call(this.sky.querySelectorAll('.sk-stars i'), el => {
        const n = Math.round(clamp(W / 26, 12, 34)), a = [];
        for (let i = 0; i < n; i++) a.push(`${Math.round(rnd() * W)}px ${Math.round(rnd() * Hh)}px 0 ${rnd() < .25 ? 1 : 0}px rgba(255,255,255,${(.55 + rnd() * .45).toFixed(2)})`);
        el.style.boxShadow = a.join(',');
      });
    },
    /** أشجار صغيرة على التلّة الوسطى: تُثبَّت على منحناها بأي قياس للشاشة */
    trees() {
      const L = this.sky.querySelector('.sk-h2'), path = L && L.querySelector('path'); if (!path || !path.getTotalLength) return;
      try {
        const len = path.getTotalLength(), yAt = x => { let a = 0, b = len * .6; for (let i = 0; i < 18; i++) { const m = (a + b) / 2; if (path.getPointAtLength(m).x < x) a = m; else b = m; } return path.getPointAtLength(a).y; };
        [[210, 1], [330, 0], [905, 1], [1010, 0], [1275, 0]].forEach(([x, big]) => {
          const t = document.createElement('i'); t.className = 'tree' + (big ? '' : ' s');
          t.style.left = (x / 1440 * 100).toFixed(2) + '%'; t.style.top = `calc(${(yAt(x) / 320 * 100).toFixed(2)}% - 42px)`; L.appendChild(t);
        });
      } catch (e) {}
    },

    /* ---------- اختلاف المنظور (rAF واحد يعمل عند الحاجة) ---------- */
    kick() { if (!this.raf && this.active && !this.reduce) this.raf = requestAnimationFrame(() => this.tick()); },
    tick() {
      this.raf = 0;
      const c = this.cur, t = this.tgt;
      c.x += (t.x - c.x) * .1; c.y += (t.y - c.y) * .1; c.s += (t.s - c.s) * .35;
      const done = Math.abs(t.x - c.x) < .002 && Math.abs(t.y - c.y) < .002 && Math.abs(t.s - c.s) < .5;
      if (done) { c.x = t.x; c.y = t.y; c.s = t.s; }
      const rise = c.s / (c.s + 650) * this.vh;
      for (let i = 0; i < this.layers.length; i++) {
        const l = this.layers[i];
        l.el.style.transform = `translate3d(${(-c.x * l.d * 26).toFixed(1)}px,${(-c.y * l.d * 14 - rise * l.r).toFixed(1)}px,0)`;
      }
      if (!done) this.raf = requestAnimationFrame(() => this.tick());
    },

    /* ---------- تشغيل/إيقاف حسب الحالة ---------- */
    sync() {
      if (!this.sky) return;
      const on = window.App && App.current === 'menu' && !document.hidden;
      this.active = !!on;
      this.sky.classList.toggle('paused', !on);
      this.sky.classList.toggle('par', !!on && !this.reduce);
      const play = on && !this.reduce && !!window.gsap;
      if (!play) {
        if (this.raf) { cancelAnimationFrame(this.raf); this.raf = 0; }
        if (this.flyCall) { this.flyCall.kill(); this.flyCall = null; }
        if (this.flyTl) this.flyTl.pause();
        if (this.reduce) { this.layers.forEach(l => { l.el.style.transform = ''; }); if (this.flyTl) { this.flyTl.kill(); this.flyTl = null; this.fly.innerHTML = ''; } }
      } else {
        this.kick();
        if (this.flyTl) this.flyTl.play();
        else if (!this.flyCall) this.flyCall = gsap.delayedCall(rand(3, 6), () => this.cross());
      }
    },
    onShow() { this.init(); this.sync(); if (this.active) this.paint(); },
    refresh() { this.init(); this.paint(); },

    /* ---------- العابرون: طائر/سرب، فراشة، بالون — وفي الليل شهاب ---------- */
    SVG: {
      bird: c => `<svg width="30" height="16" viewBox="0 0 30 16"><g fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"><path class="w" d="M2 13Q8 3 15 13"/><path class="w" d="M15 13Q22 3 28 13"/></g></svg>`,
      fly: (a, b) => `<svg width="30" height="24" viewBox="0 0 30 24"><g class="bw"><ellipse cx="8" cy="8" rx="7" ry="7.5" fill="${a}"/><ellipse cx="9" cy="18" rx="5" ry="5" fill="${b}"/></g><g class="bw r"><ellipse cx="22" cy="8" rx="7" ry="7.5" fill="${a}"/><ellipse cx="21" cy="18" rx="5" ry="5" fill="${b}"/></g><rect x="13.6" y="3" width="2.8" height="18" rx="1.4" fill="#5A3A5A"/></svg>`,
      balloon: c => `<svg width="34" height="74" viewBox="0 0 34 74"><path d="M17 42Q13 56 18 72" fill="none" stroke="rgba(90,60,110,.45)" stroke-width="1.6"/><ellipse cx="17" cy="21" rx="15" ry="19" fill="${c}"/><path d="M13 39h8l-4 5z" fill="${c}"/><ellipse cx="11" cy="13" rx="4" ry="7" fill="rgba(255,255,255,.55)" transform="rotate(-24 11 13)"/></svg>`,
      star: () => `<svg width="120" height="6" viewBox="0 0 120 6"><defs><linearGradient id="skSt"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><rect width="118" height="3" y="1.5" rx="1.5" fill="url(#skSt)"/><circle cx="117" cy="3" r="3" fill="#fff"/></svg>`
    },
    cross() {
      this.flyCall = null;
      if (!this.active || this.reduce || !window.gsap) return;
      const W = innerWidth, Hh = innerHeight, boys = document.documentElement.dataset.theme === 'boys';
      const mk = (html, n) => { const els = []; for (let i = 0; i < (n || 1); i++) { const e = document.createElement('i'); e.className = 'fly'; e.innerHTML = html; this.fly.appendChild(e); els.push(e); } return els; };
      this.fly.innerHTML = '';
      const tl = this.flyTl = gsap.timeline({ onComplete: () => { this.fly.innerHTML = ''; this.flyTl = null; if (this.active) this.flyCall = gsap.delayedCall(rand(7, 15), () => this.cross()); } });
      const dir = Math.random() < .5 ? 1 : -1, x0 = dir > 0 ? -70 : W + 70, x1 = dir > 0 ? W + 70 : -70;
      const kind = this.night ? (Math.random() < .75 ? 'star' : 'bird') : ['bird', 'bird', 'fly', 'balloon'][Math.floor(Math.random() * 4)];
      if (kind === 'star') {
        const [e] = mk(this.SVG.star()), x = rand(.15, .7) * W, y = rand(.04, .22) * Hh;
        tl.set(e, { x, y, rotation: 24, scaleX: dir, transformOrigin: '100% 50%', autoAlpha: 0 })
          .to(e, { autoAlpha: 1, duration: .15 })
          .to(e, { x: x + 190 * dir, y: y + 86, duration: .8, ease: 'power1.in' }, 0)
          .to(e, { autoAlpha: 0, duration: .25 }, .55);
      } else if (kind === 'bird') {
        const n = 1 + Math.floor(Math.random() * 3), els = mk(this.SVG.bird(this.night ? 'rgba(255,255,255,.55)' : 'rgba(70,50,110,.5)'), n);
        const y = rand(.1, .34) * Hh, dur = rand(10, 14);
        els.forEach((e, i) => {
          const oy = y + i * 16 * (i % 2 ? 1 : -1), sc = 1 - i * .16;
          tl.set(e, { x: x0 - i * 34 * dir, y: oy, scale: sc, autoAlpha: 1 }, 0)
            .to(e, { x: x1 - i * 34 * dir, duration: dur, ease: 'none' }, 0)
            .to(e, { y: oy - 22, duration: dur / 6, ease: 'sine.inOut', repeat: 5, yoyo: true }, 0);
        });
      } else if (kind === 'fly') {
        const pal = boys ? [['#FFB648', '#FF8A3D'], ['#7CCBFF', '#4A9BF0']] : [['#FF8CC6', '#FFC531'], ['#C79BFF', '#FF8CC6']], c = pal[Math.floor(Math.random() * pal.length)];
        const [e] = mk(this.SVG.fly(c[0], c[1])), y = rand(.42, .66) * Hh, dur = rand(13, 17);
        tl.set(e, { x: x0, y, rotation: 12 * dir, autoAlpha: 1 }, 0)
          .to(e, { x: x1, duration: dur, ease: 'none' }, 0)
          .to(e, { y: y - 46, rotation: -8 * dir, duration: dur / 8, ease: 'sine.inOut', repeat: 7, yoyo: true }, 0);
      } else {
        const cs = ['#FF6FAE', '#FFC531', '#5AA2FF', '#45C46A', '#A77BFF'], [e] = mk(this.SVG.balloon(cs[Math.floor(Math.random() * cs.length)]));
        const x = rand(.08, .86) * W, dur = rand(15, 19);
        tl.set(e, { x, y: Hh + 20, rotation: -5, transformOrigin: '50% 20%', autoAlpha: 1 }, 0)
          .to(e, { y: -100, duration: dur, ease: 'none' }, 0)
          .to(e, { x: x + 34 * dir, rotation: 5, duration: dur / 6, ease: 'sine.inOut', repeat: 5, yoyo: true }, 0);
      }
    },

    /* ---------- الأيقونات الحيّة ---------- */
    /** اللعبة المقترحة: أول لعبة جديدة لم تُجرَّب، ثم أول لعبة لم تُجرَّب، ثم لعبة اليوم بالتناوب. يمكن لغيرنا ضبطها بـ Home.suggest(id). */
    pick() {
      const order = App.order || [], played = store.get('played', []);
      if (!order.length) return null;
      const d = new Date(), day = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
      return order.find(id => App.games[id].isNew && !played.includes(id)) || order.find(id => !played.includes(id)) || order[day % order.length];
    },
    suggest(id) { this.forced = id || null; this.mark(); },
    mark() {
      const box = document.getElementById('cards'); if (!box) return;
      const id = (this.forced && App.games[this.forced]) ? this.forced : this.pick();
      this.suggested = id;
      [].forEach.call(box.querySelectorAll('.card.sug'), c => { if (c.dataset.go !== id) c.classList.remove('sug'); });
      const c = id && box.querySelector('.card[data-go="' + id + '"]'); if (c) c.classList.add('sug');
    },
    /** بعد كل بناء للقائمة: تلوين، علامة المقترحة، ومراقبة الأيقونات الجديدة */
    afterRender() {
      this.init(); this.sync(); this.paint(); this.mark();
      if (!this.io) return;
      this.io.disconnect(); this.pending.clear();
      this.quietUntil = performance.now() + 700; // لا نزاحم حركة دخول البطاقات
      [].forEach.call(document.querySelectorAll('#cards .card .ic'), el => this.io.observe(el));
    },
    seen(es) {
      es.forEach(e => {
        const el = e.target, card = el.parentNode, id = card && card.dataset.go; if (!id) return;
        if (e.isIntersecting) { if (!this.shown.has(id)) this.pending.add(el); }
        else { this.shown.delete(id); this.pending.delete(el); }
      });
      this.flushSoon();
    },
    flushSoon() { if (!this.flushT && this.pending.size) this.flushT = setTimeout(() => { this.flushT = 0; this.flush(); }, 140); },
    flush() {
      if (!this.pending.size) return;
      const now = performance.now();
      if (now - this.lastScroll > 120) this.vel = 0;
      // أثناء التمرير السريع أو حركة الدخول: ننتظر حتى يهدأ
      if (this.vel > 1.1 || now < this.quietUntil || (window.Fx && Fx.intro)) { this.flushSoon(); return; }
      const els = [...this.pending].filter(el => el.isConnected); this.pending.clear();
      els.forEach(el => this.shown.add(el.parentNode.dataset.go));
      if (this.reduce || !this.active || !window.gsap || !els.length) return;
      const rc = els.map(el => el.getBoundingClientRect()), rtl = document.documentElement.dir === 'rtl';
      const idx = els.map((_, i) => i).sort((a, b) => (rc[a].top - rc[b].top) || (rtl ? rc[b].left - rc[a].left : rc[a].left - rc[b].left)).slice(0, 10);
      const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
      idx.forEach((k, n) => this.move(tl, els[k], n * .075));
    },
    /** حركة التوقيع: كل لعبة لها حركتها الثابتة (اهتزاز، قفزة، رمشة، لمعة) */
    move(tl, el, at) {
      const id = el.parentNode.dataset.go; let h = 0; for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
      const C = { clearProps: 'transform' };
      switch (h % 4) {
        case 0: // اهتزاز
          tl.to(el, { keyframes: [{ rotation: -9, duration: .12 }, { rotation: 7, duration: .14 }, { rotation: -4, duration: .12 }, { rotation: 0, duration: .16 }], ease: 'sine.inOut', ...C }, at); break;
        case 1: // قفزة
          tl.to(el, { y: -12, scaleX: .95, scaleY: 1.06, duration: .2, ease: 'power2.out' }, at)
            .to(el, { y: 0, scaleX: 1, scaleY: 1, duration: .5, ease: 'bounce.out', ...C }, at + .2); break;
        case 2: // رمشة
          tl.to(el, { scaleY: .78, scaleX: 1.06, duration: .1, ease: 'power2.in' }, at)
            .to(el, { scaleY: 1, scaleX: 1, duration: .45, ease: 'elastic.out(1.1,0.4)', ...C }, at + .1); break;
        default: { // لمعة
          const s = el.querySelector('.shn'); if (!s || el.parentNode.classList.contains('sug')) { tl.fromTo(el, { scale: 1 }, { scale: 1.08, duration: .16, yoyo: true, repeat: 1, ease: 'sine.inOut', ...C }, at); break; }
          tl.fromTo(s, { x: 0, xPercent: -260, skewX: -18 }, { x: 0, xPercent: 360, skewX: -18, duration: .7, ease: 'power1.inOut', clearProps: 'transform' }, at)
            .fromTo(el, { scale: 1 }, { scale: 1.05, duration: .22, yoyo: true, repeat: 1, ease: 'sine.inOut', ...C }, at);
        }
      }
    }
  };
  return H;
})();
