/* =============================================================================
   ألعاب أبو جنان — الطبقة المشتركة بين كل الألعاب
   -----------------------------------------------------------------------------
   • زر «الرئيسية» العائم للعودة إلى قائمة الألعاب.
   • زر الرجوع في أندرويد (Capacitor): اللعبة تسجّل AbuJanan.onBack إن أرادت
     التعامل معه بنفسها، وإلا نعود إلى القائمة الرئيسية.
   • جسر البلوتوث (BluetoothLink) بواجهة واحدة لكل الألعاب:
       AbuJanan.bt.available()            هل نسخة التطبيق تدعم البلوتوث؟
       AbuJanan.bt.prepare()              أذونات + تشغيل البلوتوث (Promise)
       AbuJanan.bt.host(handlers)         افتح غرفة واستقبل الأجهزة
       AbuJanan.bt.pick(opts)             نافذة اختيار جهاز المضيف (Promise<device>)
       AbuJanan.bt.connect(id, handlers)  اتصل بالمضيف
     كل اتصال يُرجِع { send(obj, toId?), peers(), close() }.
     الرسائل كائنات JSON، وتُسلَّم عبر handlers.onData(obj, fromId).
   ============================================================================ */
(function (root) {
  'use strict';
  if (root.AbuJanan) return;

  const script = document.currentScript;
  const HUB = (script && script.dataset.hub) || '../../index.html';
  const CAP = () => root.Capacitor || null;
  const isNative = () => { const c = CAP(); return !!(c && c.isNativePlatform && c.isNativePlatform()); };
  const plugin = (n) => { const c = CAP(); return (c && c.Plugins && c.Plugins[n]) || null; };
  const BTP = () => plugin('BluetoothLink');
  const APP = () => plugin('App');

  /* ───────────────────────── أنماط مشتركة ───────────────────────── */
  const CSS = `
  .aj-home{position:fixed;z-index:9990;top:calc(env(safe-area-inset-top,0px) + 8px);left:calc(env(safe-area-inset-left,0px) + 8px);
    width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;
    background:rgba(20,20,28,.55);color:#fff;font-size:20px;line-height:1;border:1.5px solid rgba(255,255,255,.35);
    box-shadow:0 3px 10px rgba(0,0,0,.25);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);opacity:.85;transition:transform .12s,opacity .2s}
  .aj-home:active{transform:scale(.92)} .aj-home:hover{opacity:1}
  .aj-home.aj-light{background:rgba(255,255,255,.8);color:#333;border-color:rgba(0,0,0,.15)}
  .aj-home.aj-br{top:auto;left:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 10px);right:calc(env(safe-area-inset-right,0px) + 10px)}
  .aj-home.aj-bl{top:auto;bottom:calc(env(safe-area-inset-bottom,0px) + 10px)}
  .aj-home.aj-tr{left:auto;right:calc(env(safe-area-inset-right,0px) + 8px)}
  .aj-ov{position:fixed;inset:0;z-index:99990;background:rgba(10,8,14,.72);display:flex;align-items:center;justify-content:center;padding:16px;
    direction:rtl;font-family:'Baloo Bhaijaan 2','Segoe UI',Tahoma,sans-serif;color:#2a2230;-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}
  .aj-box{background:#fff8ee;border-radius:22px;width:min(460px,100%);max-height:92vh;overflow:auto;padding:18px 18px 14px;
    box-shadow:0 18px 50px rgba(0,0,0,.4);border:3px solid #2ec4b6}
  .aj-box h3{margin:0 0 6px;font-size:22px;color:#1f7a72;display:flex;align-items:center;gap:8px}
  .aj-box p{margin:6px 0 10px;font-size:15px;line-height:1.6;color:#5a4a44}
  .aj-list{display:flex;flex-direction:column;gap:8px;margin:8px 0}
  .aj-dev{display:flex;align-items:center;gap:10px;width:100%;text-align:start;border:2px solid #e6d9c7;background:#fff;border-radius:14px;
    padding:12px 14px;font:inherit;font-size:17px;font-weight:700;color:#2a2230;cursor:pointer}
  .aj-dev:active{transform:scale(.98);background:#f3fffd;border-color:#2ec4b6}
  .aj-dev small{margin-inline-start:auto;opacity:.5;font-size:12px;direction:ltr}
  .aj-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
  .aj-btn{flex:1;border:0;border-radius:14px;padding:12px 14px;font:inherit;font-size:16px;font-weight:800;cursor:pointer;
    background:#2ec4b6;color:#fff;box-shadow:0 3px 0 #1f8f85}
  .aj-btn.ghost{background:#efe6d8;color:#5a4a44;box-shadow:0 3px 0 #d8ccb9}
  .aj-btn:active{transform:translateY(2px);box-shadow:none}
  .aj-btn:disabled{opacity:.55;cursor:default}
  .aj-hint{font-size:13px;color:#8a6f5e;margin:4px 0 0;line-height:1.6}
  .aj-spin{display:inline-block;width:14px;height:14px;border:2px solid #2ec4b6;border-top-color:transparent;border-radius:50%;
    animation:ajspin .8s linear infinite;vertical-align:middle;margin-inline-start:6px}
  @keyframes ajspin{to{transform:rotate(360deg)}}
  .aj-toast{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 22px);transform:translateX(-50%);z-index:99999;
    background:rgba(30,26,36,.92);color:#fff;padding:10px 18px;border-radius:14px;font-size:15px;max-width:90vw;text-align:center;
    direction:rtl;font-family:'Baloo Bhaijaan 2','Segoe UI',Tahoma,sans-serif;opacity:0;transition:opacity .25s;pointer-events:none}
  .aj-toast.show{opacity:1}`;
  function injectCSS() {
    if (document.getElementById('aj-css')) return;
    const st = document.createElement('style'); st.id = 'aj-css'; st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  /* ───────────────────────── أدوات صغيرة ───────────────────────── */
  const esc = (t) => String(t == null ? '' : t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let toastEl = null, toastT = null;
  function toast(msg, ms) {
    injectCSS();
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'aj-toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('show'), ms || 2800);
  }
  const ready = (fn) => (document.body ? fn() : document.addEventListener('DOMContentLoaded', fn));

  /* ───────────────────────── زر الرئيسية ───────────────────────── */
  function goHome() {
    try { if (AJ.bt._link) AJ.bt._link.close(); } catch (e) {}
    location.href = HUB;
  }
  function addHomeButton(opts) {
    opts = opts || {};
    ready(() => {
      injectCSS();
      if (document.querySelector('.aj-home')) return;
      const a = document.createElement('a');
      a.className = 'aj-home' + (opts.light ? ' aj-light' : '') + (opts.pos ? ' aj-' + opts.pos : '');
      a.href = HUB; a.title = 'الرئيسية — ألعاب أبو جنان'; a.setAttribute('aria-label', a.title);
      a.textContent = '🏠';
      if (opts.style) Object.assign(a.style, opts.style);
      a.addEventListener('click', (e) => {
        e.preventDefault();
        if (AJ.confirmHome) {
          if (!confirm(typeof AJ.confirmHome === 'string' ? AJ.confirmHome : 'الرجوع إلى قائمة الألعاب؟')) return;
        }
        goHome();
      });
      document.body.appendChild(a);
    });
  }

  /* ───────────────────────── زر الرجوع (أندرويد) ───────────────────────── */
  function installBack() {
    const A = APP();
    if (A && A.addListener) {
      A.addListener('backButton', () => {
        try { if (AJ.onBack && AJ.onBack() === true) return; } catch (e) {}
        if (AJ.isHub) {
          if (confirm('هل تريد الخروج من ألعاب أبو جنان؟')) { try { A.exitApp(); } catch (e) {} }
        } else goHome();
      });
    }
  }

  /* ───────────────────────── البلوتوث ───────────────────────── */
  function listen(BT, ev, fn) {
    const h = BT.addListener(ev, fn);
    return () => { try { h && h.then ? h.then((x) => x.remove()) : h.remove(); } catch (e) {} };
  }

  /** أذونات + تشغيل البلوتوث. يرفض بـ Error برسالة عربية. */
  function prepare() {
    const BT = BTP();
    if (!BT) return Promise.reject(new Error('اللعب بالبلوتوث متاح في نسخة التطبيق (APK) فقط.'));
    return BT.isAvailable().catch(() => ({ available: true, enabled: true })).then((a) => {
      if (a && a.available === false) throw new Error('هذا الجهاز لا يدعم البلوتوث.');
      return BT.checkPerms().catch(() => ({ granted: false }));
    }).then((p) => {
      if (p && p.granted) return true;
      return BT.requestPerms().then((r) => {
        if (!r || !r.granted) throw new Error('لم تُمنح أذونات البلوتوث. امنحها من إعدادات الهاتف ← التطبيقات ← ألعاب أبو جنان ← الأذونات.');
        return true;
      });
    }).then(() => BT.isAvailable().catch(() => ({ enabled: true }))).then((a) => {
      if (a && a.enabled === false) { try { BT.enable(); } catch (e) {} }
      return true;
    });
  }

  /** يربط مستمعي الأحداث ويعيد كائن اتصال موحّد */
  function makeLink(BT, h) {
    h = Object.assign({ onData() {}, onJoin() {}, onLeave() {}, onError() {} }, h || {});
    const offs = [];
    const peers = new Map();
    offs.push(listen(BT, 'data', (e) => {
      let d; try { d = JSON.parse(e.msg); } catch (x) { return; }
      h.onData(d, e.from);
    }));
    offs.push(listen(BT, 'peerJoin', (e) => { peers.set(e.id, e.name || 'جهاز'); h.onJoin(e.id, e.name || 'جهاز'); }));
    offs.push(listen(BT, 'peerLeave', (e) => { peers.delete(e.id); h.onLeave(e.id); }));
    offs.push(listen(BT, 'btError', (e) => h.onError((e && e.error) || 'خلل في البلوتوث')));
    const link = {
      send(obj, to) { try { BT.send({ to: to || undefined, msg: JSON.stringify(obj) }); } catch (e) {} },
      peers() { return Array.from(peers, ([id, name]) => ({ id, name })); },
      close() {
        offs.forEach((f) => f()); offs.length = 0;
        try { BT.stop(); } catch (e) {}
        if (AJ.bt._link === link) AJ.bt._link = null;
      },
    };
    AJ.bt._link = link;
    return link;
  }

  /** المضيف: يجعل الجهاز ظاهرًا ويستقبل الاتصالات */
  function host(h) {
    return prepare().then(() => {
      const BT = BTP();
      if (AJ.bt._link) AJ.bt._link.close();
      const link = makeLink(BT, h);
      return BT.startHost().then((r) => { link.name = (r && r.name) || 'جهازي'; return link; })
        .catch((err) => { link.close(); throw new Error('تعذّر تشغيل البلوتوث: ' + ((err && err.message) || err)); });
    });
  }

  /** الضيف: يتصل بجهاز المضيف */
  function connect(id, h) {
    return prepare().then(() => {
      const BT = BTP();
      if (AJ.bt._link) AJ.bt._link.close();
      const link = makeLink(BT, h);
      return BT.connect({ id }).then(() => link)
        .catch(() => { link.close(); throw new Error('تعذّر الاتصال بالمضيف — تأكد أنه فتح الغرفة وأن الجهازين قريبان، ثم أعد المحاولة.'); });
    });
  }

  function deviceName() {
    const BT = BTP();
    if (!BT) return Promise.resolve('جهازي');
    return BT.deviceName().then((r) => (r && r.name) || 'جهازي').catch(() => 'جهازي');
  }

  /** نافذة اختيار جهاز المضيف. تُرجِع Promise<{id,name}> وترفض عند الإلغاء. */
  function pick(opts) {
    opts = opts || {};
    injectCSS();
    return prepare().then(() => new Promise((resolve, reject) => {
      const BT = BTP();
      const ov = document.createElement('div'); ov.className = 'aj-ov';
      ov.innerHTML = `<div class="aj-box" role="dialog" aria-modal="true">
        <h3>📶 ${esc(opts.title || 'اختر جهاز المضيف')}</h3>
        <p>${esc(opts.text || 'شغّل البلوتوث في الجهازين وقرّبهما. يجب أن يكون المضيف قد فتح الغرفة أولًا.')}</p>
        <div class="aj-hint" id="aj-msg">جارٍ البحث عن الأجهزة <span class="aj-spin"></span></div>
        <div class="aj-list" id="aj-list"></div>
        <div class="aj-row">
          <button class="aj-btn" id="aj-rescan">🔄 إعادة البحث</button>
          <button class="aj-btn ghost" id="aj-cancel">إلغاء</button>
        </div>
        <p class="aj-hint">لا يظهر جهاز المضيف؟ اطلب منه الضغط على «إظهار جهازي» ثم أعد البحث.</p>
      </div>`;
      document.body.appendChild(ov);
      const list = ov.querySelector('#aj-list'), msg = ov.querySelector('#aj-msg');
      let devs = [], off = null, timer = null, done = false;
      const finish = (fn) => { if (done) return; done = true; clearTimeout(timer); if (off) off(); ov.remove(); fn(); };
      function paint() {
        list.innerHTML = '';
        if (!devs.length) { list.innerHTML = '<div class="aj-hint">لم يُعثر على أجهزة بعد…</div>'; return; }
        devs.forEach((d) => {
          const b = document.createElement('button'); b.className = 'aj-dev';
          b.innerHTML = `📱 <span>${esc(d.name || 'جهاز')}</span><small>${esc((d.id || '').slice(-5))}</small>`;
          b.onclick = () => finish(() => resolve({ id: d.id, name: d.name || 'جهاز' }));
          list.appendChild(b);
        });
      }
      function scan() {
        devs = []; paint();
        msg.innerHTML = 'جارٍ البحث عن الأجهزة <span class="aj-spin"></span>';
        if (!off) off = listen(BT, 'deviceFound', (d) => { if (!devs.some((x) => x.id === d.id)) { devs.push(d); paint(); } });
        BT.scan().then((r) => {
          ((r && r.devices) || []).forEach((d) => { if (!devs.some((x) => x.id === d.id)) devs.push(d); });
          paint();
          clearTimeout(timer);
          timer = setTimeout(() => { msg.textContent = devs.length ? 'اختر جهاز المضيف من القائمة:' : 'لم يُعثر على أجهزة — تأكد أن المضيف فتح الغرفة ثم أعد البحث.'; }, 10000);
        }).catch((err) => { msg.textContent = 'تعذّر البحث: ' + ((err && err.message) || err); });
      }
      ov.querySelector('#aj-rescan').onclick = scan;
      ov.querySelector('#aj-cancel').onclick = () => finish(() => reject(new Error('cancelled')));
      scan();
    }));
  }

  function makeDiscoverable() {
    const BT = BTP(); if (!BT) return Promise.resolve();
    return BT.makeDiscoverable().catch(() => {});
  }

  const AJ = {
    HUB, isHub: false, isNative: isNative(), onBack: null, confirmHome: null,
    toast, goHome, addHomeButton,
    bt: { _link: null, available: () => !!BTP(), prepare, host, connect, pick, deviceName, makeDiscoverable },
  };
  root.AbuJanan = AJ;
  injectCSS();
  ready(installBack);
})(window);
