/* =====================================================================
   🎙️ استوديو التسجيل + 🗣️ صوت الجهاز
   يُحمَّل عند الحاجة فقط (من الإعدادات). التسجيلات تُحفظ في IndexedDB عبر MyVoice (core.js):
   تُقصّ أطراف الصمت ويُضبط مستوى الصوت ثم تُحفظ WAV أحادي 22.05kHz (يعمل في كل المتصفحات وWebView).
   ===================================================================== */
'use strict';
const Studio = {
  MAX_SEC: 10, SR: 22050, PAGE: 40,
  GAME_NAMES: { common: 'عبارات عامة', en: 'الإنجليزية' },
  q: '', game: '', shown: 0, rec: null,

  css() {
    if (this._css) return; this._css = true;
    App.css(`
.st-in{width:100%;font:inherit;font-size:16px;font-weight:700;padding:8px 14px;border-radius:16px;border:3px solid var(--t-soft);background:#fff;color:var(--t-ink);outline:none;user-select:text;-webkit-user-select:text}
.st-in:focus{border-color:var(--t-main)}
.st-bar{display:flex;gap:8px;margin:4px 0 10px;flex-wrap:wrap}
.st-bar .st-in{flex:1 1 150px;min-width:0}
.st-note{font-size:13.5px;opacity:.8;text-align:center;margin:-6px 0 10px;line-height:1.6}
.st-g{font-weight:900;font-size:16px;color:var(--t-main-d);margin:12px 4px 6px;display:flex;align-items:center;gap:6px}
.st-g small{font-size:12px;opacity:.6}
.st-r{display:flex;align-items:center;gap:8px;padding:7px 8px 7px 10px;border-radius:18px;background:#fff;border:2px solid var(--t-soft);margin-bottom:7px}
.st-r.mine{border-color:#7DD3A8;background:#F2FFF7}
.st-r.live{border-color:#F2484B;background:#FFF3F3}
.st-t{flex:1;min-width:0;font-size:17px;font-weight:700;line-height:1.5}
.st-t[dir=ltr]{text-align:left;font-size:16px}
.st-t small{display:block;font-size:11.5px;font-weight:700;opacity:.6}
.st-b{width:44px;height:44px;flex:0 0 44px;border-radius:50%;font-size:19px;display:grid;place-items:center;background:var(--t-bg2);border:2px solid var(--t-soft);transition:transform .14s var(--press)}
.st-b:active{transform:scale(.9)}
.st-b.rec{background:linear-gradient(180deg,#FF8A8A,#F2484B);border-color:#fff;color:#fff;box-shadow:0 3px 0 #B3232A}
.st-b[hidden]{display:none}
.st-more{display:block;margin:10px auto 0}
.st-empty{text-align:center;opacity:.7;padding:20px 0;font-weight:700}
.st-sel{font:inherit;font-size:15px;font-weight:700;padding:7px 10px;border-radius:14px;border:3px solid var(--t-soft);background:#fff;color:var(--t-ink);max-width:100%}
.tt-card{border-radius:20px;padding:12px 14px;margin-bottom:10px;background:linear-gradient(180deg,#FFF8DC,#FFEFB8);border:2px solid #FFD95A;font-size:15px;line-height:1.6;font-weight:600}
.tt-card b{display:block;font-size:16px;margin-bottom:2px}
.tt-l{display:flex;flex-direction:column;gap:8px;padding:10px 12px;margin-bottom:10px;border-radius:20px;background:var(--t-bg2);border:2px solid var(--t-soft)}
.tt-l h4{margin:0;font-size:17px;font-weight:900;display:flex;align-items:center;justify-content:space-between;gap:8px}
.tt-s{display:flex;align-items:center;gap:8px;font-weight:800;font-size:14px}
.tt-s span{min-width:64px}
.tt-s input{flex:1;accent-color:var(--t-main)}
.tt-s output{min-width:36px;text-align:center}
`);
  },

  /* ---------- قائمة العبارات ---------- */
  phrases() {
    if (!this._ph) this._ph = (window.VOICE_PHRASES || []).map(([id, text, plain, lang, game]) => ({ id, text, plain, lang, game: String(game || 'common').split(',')[0] || 'common', n: Voice.norm(plain, lang) }));
    return this._ph;
  },
  gameName(g) { return this.GAME_NAMES[g] || (App.games[g] && App.games[g].title) || g; },
  scopeKid() { return gstore.get('myvoiceScope', 'all') === 'kid' ? App.profile.id : null; },
  mine(p) { return MyVoice.map.get(MyVoice.key(p.lang, p.id, this.scopeKid())); },
  bundled(p) { const V = window.VOICE || {}; return !!(V[p.lang] && V[p.lang][p.id]); },

  open() {
    this.css(); Music.stop();
    const P = App.profile, scope = gstore.get('myvoiceScope', 'all');
    const games = [...new Set(this.phrases().map(p => p.game))];
    const seg = (key, opts, val) => `<div class="seg" data-k="${key}">${opts.map(([v, l]) => `<button data-v="${v}" class="${String(v) === String(val) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    const s = App.openSheet(`<h3>🎙️ استوديو التسجيل</h3>
      <p class="st-note">سجّل بصوتك عبارات التطبيق، فيسمعها طفلك بصوتك بدل الصوت الجاهز.<br>اضغط 🔴 وتكلّم، ثم ⏹ للإيقاف.</p>
      <div class="row"><span class="lbl">🎧 استخدم تسجيلاتي</span>${seg('myvoice', [[true, 'نعم'], [false, 'لا']], MyVoice.on)}</div>
      <div class="row"><span class="lbl">👤 التسجيلات الجديدة</span>${seg('myvoiceScope', [['all', 'لكل الأطفال'], ['kid', 'لـ' + App.esc(P.name) + ' فقط']], scope)}</div>
      <div class="st-bar"><input class="st-in" id="stQ" type="search" placeholder="🔍 ابحث عن عبارة…" value="${App.esc(this.q)}" autocomplete="off">
        <select class="st-sel" id="stG"><option value="">كل الألعاب</option><option value="*mine">🎙️ تسجيلاتي فقط</option>${games.map(g => `<option value="${g}" ${g === this.game ? 'selected' : ''}>${App.esc(this.gameName(g))}</option>`).join('')}</select></div>
      <div id="stList"></div>`, () => { this.stopRec(true); const g = App.games[App.current]; Music.play(g ? g.music : 'menu'); });
    if (this.game === '*mine') s.querySelector('#stG').value = '*mine';
    s.querySelectorAll('.seg').forEach(sg => sg.querySelectorAll('button').forEach(b => b.onclick = () => {
      Sound.tap(); const raw = b.dataset.v, v = raw === 'true' ? true : raw === 'false' ? false : raw;
      gstore.set(sg.dataset.k, v); MyVoice.changed();
      sg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); this.list(true);
    }));
    let tm = 0;
    s.querySelector('#stQ').oninput = e => { clearTimeout(tm); tm = setTimeout(() => { this.q = e.target.value; this.list(true); }, 180); };
    s.querySelector('#stG').onchange = e => { this.game = e.target.value; this.list(true); };
    this.list(true);
  },
  /** عرض العبارات المطابقة على دفعات */
  list(reset) {
    const box = $('#stList'); if (!box) return;
    const q = Voice.norm(this.q, 'ar').toLowerCase();
    const all = this.phrases().filter(p => (!this.game || (this.game === '*mine' ? this.mine(p) : p.game === this.game)) && (!q || p.n.toLowerCase().includes(q) || p.id.includes(q)));
    if (reset) { this.shown = 0; box.innerHTML = ''; }
    if (!all.length) { box.innerHTML = '<div class="st-empty">لا توجد عبارات مطابقة</div>'; return; }
    const part = all.slice(this.shown, this.shown + this.PAGE);
    let last = this.shown ? all[this.shown - 1].game : null, html = '';
    for (const p of part) {
      if (p.game !== last) { last = p.game; html += `<div class="st-g">🎮 ${App.esc(this.gameName(p.game))}</div>`; }
      html += this.row(p);
    }
    this.shown += part.length;
    const more = box.querySelector('.st-more'); if (more) more.remove();
    box.insertAdjacentHTML('beforeend', html);
    if (this.shown < all.length) {
      box.insertAdjacentHTML('beforeend', `<button class="tbtn alt sm st-more">عرض المزيد (${all.length - this.shown})</button>`);
      box.querySelector('.st-more').onclick = () => { Sound.tap(); this.list(false); };
    }
    box.querySelectorAll('.st-r:not([data-b])').forEach(r => { r.dataset.b = 1; this.bind(r); });
  },
  row(p) {
    const m = this.mine(p), b = this.bundled(p);
    return `<div class="st-r ${m ? 'mine' : ''}" data-id="${p.id}" data-lang="${p.lang}">
      <div class="st-t" ${p.lang === 'en' ? 'dir="ltr"' : ''}>${App.esc(p.text)}<small>${m ? '🎙️ بصوتك' : b ? '📦 صوت جاهز' : '🗣️ صوت الجهاز'}</small></div>
      <button class="st-b" data-a="play" aria-label="استماع" ${m || b ? '' : 'hidden'}>▶️</button>
      <button class="st-b" data-a="del" aria-label="حذف تسجيلي" ${m ? '' : 'hidden'}>🗑️</button>
      <button class="st-b rec" data-a="rec" aria-label="تسجيل">${m ? '🔁' : '🔴'}</button></div>`;
  },
  find(r) { return this.phrases().find(p => p.id === r.dataset.id && p.lang === r.dataset.lang); },
  refresh(r) {
    const p = this.find(r), tmp = document.createElement('div'); tmp.innerHTML = this.row(p);
    const n = tmp.firstElementChild; r.replaceWith(n); this.bind(n); n.dataset.b = 1; return n;
  },
  bind(r) {
    r.querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
      const p = this.find(r), a = b.dataset.a;
      if (a === 'rec') { if (this.rec && this.rec.row === r) this.stopRec(); else this.startRec(p, r); return; }
      if (a === 'play') { const m = this.mine(p); if (m) this.playRec(m); else Voice.play([p.id], p.lang); return; }
      if (a === 'del') {
        if (b.dataset.arm !== '1') { b.dataset.arm = '1'; b.textContent = '❓'; Sound.tap(); setTimeout(() => { if (b.isConnected) { b.dataset.arm = ''; b.textContent = '🗑️'; } }, 2500); return; }
        Voice.stop(); MyVoice.remove(MyVoice.key(p.lang, p.id, this.scopeKid())).then(() => { Sound.poof(); this.refresh(r); });
      }
    });
  },

  /* ---------- التسجيل ---------- */
  async startRec(p, row) {
    this.stopRec(true);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) { Sound.error(); App.toast('التسجيل غير مدعوم في هذا الجهاز'); return; }
    Voice.stop();
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } }); }
    catch (e) { Sound.error(); App.toast('اسمح للتطبيق باستخدام الميكروفون 🎙️'); return; }
    if (!row.isConnected) { stream.getTracks().forEach(t => t.stop()); return; }
    const type = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'].find(t => { try { return MediaRecorder.isTypeSupported(t); } catch (e) { return false; } });
    let mr; try { mr = new MediaRecorder(stream, type ? { mimeType: type } : undefined); } catch (e) { stream.getTracks().forEach(t => t.stop()); Sound.error(); App.toast('تعذّر بدء التسجيل'); return; }
    const chunks = [], btn = row.querySelector('[data-a=rec]');
    const R = this.rec = { p, row, mr, stream, chunks, cancel: false, t0: Date.now() };
    mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
    mr.onstop = () => { stream.getTracks().forEach(t => t.stop()); if (!R.cancel) this.finish(R, new Blob(chunks, { type: mr.mimeType || type || 'audio/webm' })); };
    mr.start(250);
    row.classList.add('live'); btn.textContent = '⏹';
    if (Fx.on) R.tw = gsap.to(btn, { scale: 1.15, duration: .45, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    R.timer = setTimeout(() => { if (this.rec === R) this.stopRec(); }, this.MAX_SEC * 1000);
  },
  stopRec(cancel) {
    const R = this.rec; if (!R) return; this.rec = null;
    clearTimeout(R.timer); if (R.tw) { R.tw.kill(); gsap.set(R.row.querySelector('[data-a=rec]'), { clearProps: 'transform' }); }
    R.cancel = !!cancel;
    R.row.classList.remove('live');
    try { if (R.mr.state !== 'inactive') R.mr.stop(); else R.stream.getTracks().forEach(t => t.stop()); } catch (e) { R.stream.getTracks().forEach(t => t.stop()); }
    if (cancel && R.row.isConnected) R.row.querySelector('[data-a=rec]').textContent = this.mine(R.p) ? '🔁' : '🔴';
  },
  async finish(R, blob) {
    let wav;
    try { wav = await this.clean(blob); } catch (e) { console.warn(e); }
    if (!wav) { Sound.error(); App.toast('لم يُسمع صوت، حاول مرة أخرى 🎙️'); if (R.row.isConnected) this.refresh(R.row); return; }
    const kid = this.scopeKid(), p = R.p;
    const ok = await MyVoice.save({ key: MyVoice.key(p.lang, p.id, kid), id: p.id, lang: p.lang, plain: p.plain, kid, blob: wav, t: Date.now() });
    if (!ok) { Sound.error(); App.toast('تعذّر حفظ التسجيل'); return; }
    const n = R.row.isConnected ? this.refresh(R.row) : null;
    if (n && Fx.on) gsap.fromTo(n, { scale: .96 }, { scale: 1, duration: .5, ease: 'back.out(3)', clearProps: 'transform' });
    this.playRec(MyVoice.map.get(MyVoice.key(p.lang, p.id, kid))); // استمع لما سجّلته
  },
  async playRec(rec) {
    if (!rec) return; Voice.stop(); const my = Voice.seq;
    try {
      const ac = Sound.ac(true), ab = await rec.blob.arrayBuffer();
      const b = await new Promise((ok, no) => ac.decodeAudioData(ab, ok, no));
      if (my !== Voice.seq) return;
      const src = ac.createBufferSource(); src.buffer = b; src.connect(ac.destination); src.start(); Voice.srcs.push(src);
    } catch (e) { Sound.error(); }
  },
  /** فكّ الترميز ← أحادي ← قصّ الصمت ← ضبط المستوى ← 22.05kHz ← WAV */
  async clean(blob) {
    const ac = Sound.ac(true); if (!ac) throw new Error('no audio');
    const ab = await blob.arrayBuffer();
    const buf = await new Promise((ok, no) => ac.decodeAudioData(ab, ok, no));
    const sr = buf.sampleRate, n = buf.length, ch = buf.numberOfChannels, d = new Float32Array(n);
    for (let c = 0; c < ch; c++) { const x = buf.getChannelData(c); for (let i = 0; i < n; i++) d[i] += x[i] / ch; }
    // طاقة كل 10ms
    const F = Math.max(1, Math.round(sr * .01)), nf = Math.floor(n / F), rms = new Float32Array(nf);
    let top = 0;
    for (let f = 0; f < nf; f++) { let e = 0; for (let i = f * F; i < (f + 1) * F; i++) e += d[i] * d[i]; rms[f] = Math.sqrt(e / F); if (rms[f] > top) top = rms[f]; }
    if (top < .004) return null; // صمت
    const th = Math.max(.006, top * .1);
    let a = 0, b = nf - 1;
    while (a < nf && rms[a] < th) a++;
    while (b > a && rms[b] < th) b--;
    const s0 = Math.max(0, (a - 8) * F), s1 = Math.min(n, (b + 14) * F); // هامش 80ms قبل و140ms بعد
    let seg = d.subarray(s0, s1);
    if (seg.length < sr * .12) return null;
    let peak = 0; for (let i = 0; i < seg.length; i++) peak = Math.max(peak, Math.abs(seg[i]));
    const gain = Math.min(.89 / (peak || 1), 10);
    // إعادة التشكيل إلى 22.05kHz
    const len = Math.max(1, Math.round(seg.length * this.SR / sr));
    const off = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1, len, this.SR);
    const src = off.createBuffer(1, seg.length, sr); src.getChannelData(0).set(seg);
    const bs = off.createBufferSource(); bs.buffer = src; const g = off.createGain(); g.gain.value = gain;
    bs.connect(g).connect(off.destination); bs.start();
    const out = (await off.startRendering()).getChannelData(0);
    const fade = Math.round(this.SR * .008);
    for (let i = 0; i < fade && i < out.length; i++) { out[i] *= i / fade; out[out.length - 1 - i] *= i / fade; }
    return this.wav(out, this.SR);
  },
  wav(x, sr) {
    const dv = new DataView(new ArrayBuffer(44 + x.length * 2)), w = (o, s) => { for (let i = 0; i < s.length; i++) dv.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); dv.setUint32(4, 36 + x.length * 2, true); w(8, 'WAVE'); w(12, 'fmt '); dv.setUint32(16, 16, true);
    dv.setUint16(20, 1, true); dv.setUint16(22, 1, true); dv.setUint32(24, sr, true); dv.setUint32(28, sr * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true);
    w(36, 'data'); dv.setUint32(40, x.length * 2, true);
    for (let i = 0; i < x.length; i++) dv.setInt16(44 + i * 2, Math.max(-1, Math.min(1, x[i])) * 0x7FFF, true);
    return new Blob([dv.buffer], { type: 'audio/wav' });
  },

  /* ---------- 🗣️ صوت الجهاز ---------- */
  SAMPLE: { ar: 'أحسنت يا بطل! هيا نلعب معًا.', en: 'Well done! Let us play together.' },
  voices(lang) {
    const raw = Tts.android ? Tts.androidVoices(lang) : Tts.webVoices().map(v => ({ name: v.name, lang: v.lang, localService: v.localService }));
    return raw.filter(v => Tts.score(v, lang) >= 0).sort((a, b) => Tts.score(b, lang) - Tts.score(a, lang));
  },
  tts() {
    this.css();
    // قائمة أصوات المتصفح قد تصل متأخرة
    if (!Tts.android && window.speechSynthesis && !Tts.webVoices().length && !this._vw) {
      this._vw = true; try { speechSynthesis.addEventListener('voiceschanged', () => { if ($('#ttsBox') && $('#sheetWrap').classList.contains('on')) this.tts(); }); } catch (e) {}
    }
    const B = window.AndroidBridge, ar = this.voices('ar'), good = ar.some(v => Tts.score(v, 'ar') >= 6);
    let info = {}; try { info = B && B.ttsInfo ? JSON.parse(B.ttsInfo()) : {}; } catch (e) {}
    const label = v => App.esc(v.name + (v.lang ? ' · ' + v.lang : '') + (v.network || v.localService === false ? ' 🌐' : ''));
    const block = (lang, title) => {
      const P = Tts.pref(lang), vs = lang === 'ar' ? ar : this.voices(lang), best = vs[0];
      return `<div class="tt-l" data-lang="${lang}"><h4>${title}<button class="tbtn sm" data-try="${lang}">▶️ تجربة</button></h4>
        <select class="st-sel" data-voice="${lang}"><option value="">✨ تلقائي${best ? ' (' + label(best) + ')' : ''}</option>${vs.map(v => `<option value="${App.esc(v.name)}" ${v.name === P.voice ? 'selected' : ''}>${label(v)}</option>`).join('')}</select>
        <label class="tt-s"><span>🐢 السرعة</span><input type="range" min="0.5" max="1.5" step="0.05" value="${P.rate}" data-k="rate"><output>${(+P.rate).toFixed(2)}</output></label>
        <label class="tt-s"><span>🎵 الطبقة</span><input type="range" min="0.5" max="2" step="0.05" value="${P.pitch}" data-k="pitch"><output>${(+P.pitch).toFixed(2)}</output></label></div>`;
    };
    const s = App.openSheet(`<h3>🗣️ صوت الجهاز</h3>
      <p class="st-note">يُستخدم فقط للعبارات التي ليس لها صوت مسجّل.${info.engine ? '<br>المحرّك: ' + App.esc(info.engineLabel || info.engine) : ''}</p>
      ${good ? '' : `<div class="tt-card"><b>💡 لا يوجد صوت عربي جيد على هذا الجهاز</b>
        ثبّت تطبيق «خدمات Google للنطق» (Speech Services by Google)، ثم من إعدادات النطق نزّل بيانات اللغة «العربية» واجعله المحرّك المفضّل.
        ${B && B.openTtsSettings ? `<div class="center" style="margin-top:6px"><button class="tbtn sm" id="ttGet">⬇️ تثبيت خدمات Google للنطق</button><button class="tbtn alt sm" id="ttSet">⚙️ إعدادات النطق</button></div>` : ''}</div>`}
      <div id="ttsBox">${block('ar', '🇸🇦 العربية')}${block('en', '🇬🇧 English')}</div>
      ${good && B && B.openTtsSettings ? '<div class="center"><button class="tbtn alt sm" id="ttSet">⚙️ إعدادات النطق في الجهاز</button></div>' : ''}`);
    s.querySelectorAll('[data-voice]').forEach(sel => sel.onchange = () => { Tts.setPref(sel.dataset.voice, { voice: sel.value }); this.preview(sel.dataset.voice); });
    s.querySelectorAll('.tt-l input[type=range]').forEach(r => {
      const lang = r.closest('.tt-l').dataset.lang;
      r.oninput = () => { r.nextElementSibling.textContent = (+r.value).toFixed(2); };
      r.onchange = () => { Tts.setPref(lang, { [r.dataset.k]: +r.value }); this.preview(lang); };
    });
    s.querySelectorAll('[data-try]').forEach(b => b.onclick = () => this.preview(b.dataset.try));
    const set = s.querySelector('#ttSet'); if (set) set.onclick = () => { Sound.tap(); try { B.openTtsSettings(); } catch (e) {} };
    const get = s.querySelector('#ttGet'); if (get) get.onclick = () => { Sound.tap(); try { B.installTts(); } catch (e) {} };
  },
  /** تجربة الصوت مباشرة عبر محرّك الجهاز (دون المقاطع المسجّلة) */
  preview(lang) {
    const t = this.SAMPLE[lang]; Voice.stop();
    const B = window.AndroidBridge;
    try {
      if (B && (lang === 'en' ? B.speakEn : B.speak)) { lang === 'en' ? B.speakEn(t) : B.speak(t); return; }
      if (!window.speechSynthesis) { App.toast('لا يوجد محرّك نطق في هذا المتصفح'); return; }
      speechSynthesis.cancel();
      const P = Tts.pref(lang), u = new SpeechSynthesisUtterance(t); u.lang = lang === 'en' ? 'en-US' : 'ar-SA'; u.rate = +P.rate; u.pitch = +P.pitch;
      const v = Tts.webVoice(lang); if (v) { u.voice = v; u.lang = v.lang; }
      speechSynthesis.speak(u);
    } catch (e) {}
  }
};
