/* ============================================================================
   ولعت — طبقة الاتصال
   الحكم = المرجع (host). اللاعبون يرسلون «أفعال» ويستقبلون «حالة» جاهزة.
   ثلاثة أوضاع بنفس البروتوكول:
     solo   — جهاز واحد: الحكم يمرّر الجهاز ويتنقّل بين شاشات اللاعبين (بلا شبكة).
     local  — نفس الجهاز/المتصفح بنوافذ متعددة عبر BroadcastChannel.
     online — أجهزة مختلفة برمز غرفة عبر WebRTC (PeerJS).
   ============================================================================ */
(function (root) {
  'use strict';

  const PREFIX = 'wolaat-room-';
  const noop = () => {};

  /* ─────────────── BroadcastChannel مع بديل عبر localStorage ─────────────── */
  function Bus(name) {
    const listeners = [];
    let bc = null;
    try { bc = new BroadcastChannel(name); } catch (e) { bc = null; }
    const key = 'bus:' + name;
    if (bc) bc.onmessage = (e) => listeners.forEach((f) => f(e.data));
    else {
      root.addEventListener('storage', (e) => {
        if (e.key !== key || !e.newValue) return;
        try { listeners.forEach((f) => f(JSON.parse(e.newValue).m)); } catch (_) {}
      });
    }
    return {
      post(m) {
        if (bc) bc.postMessage(m);
        else try { localStorage.setItem(key, JSON.stringify({ m, n: Math.random() })); } catch (_) {}
      },
      on(f) { listeners.push(f); },
      close() { if (bc) try { bc.close(); } catch (_) {} listeners.length = 0; },
    };
  }

  /* لا يُحمّل PeerJS إلا عند الحاجة للوضع الأونلاين */
  function loadPeer() {
    if (root.Peer) return Promise.resolve(root.Peer);
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'vendor/peerjs.min.js';
      s.onload = () => root.Peer ? res(root.Peer) : rej(new Error('تعذّر تحميل مكتبة الاتصال.'));
      s.onerror = () => rej(new Error('تعذّر تحميل مكتبة الاتصال.'));
      document.head.appendChild(s);
    });
  }

  /* ═══════════════════════════════ الحكم (host) ═══════════════════════════ */
  function Host(mode, code, h) {
    h = Object.assign({ onHello: noop, onAct: noop, onLeave: noop, onStatus: noop }, h || {});
    const conns = new Map();     /* cid → قناة الإرسال */
    let bus = null, peer = null, closed = false;

    function deliver(m) {
      if (!m || m.to !== 'host' || m.room !== code) return;
      if (m.t === 'hello') h.onHello(m.cid, m);
      else if (m.t === 'act') h.onAct(m.cid, m);
      else if (m.t === 'bye') { conns.delete(m.cid); h.onLeave(m.cid); }
    }

    const api = {
      mode, code,
      send(cid, msg) {
        const m = Object.assign({ room: code, from: 'host', to: cid || '*' }, msg);
        if (mode === 'local' && bus) bus.post(m);
        else if (mode === 'online') {
          if (cid) { const c = conns.get(cid); if (c && c.open) try { c.send(m); } catch (_) {} }
          else conns.forEach((c) => { if (c.open) try { c.send(m); } catch (_) {} });
        }
      },
      count() { return mode === 'online' ? conns.size : conns.size; },
      note(cid) { conns.set(cid, conns.get(cid) || { open: true, send: () => {} }); },
      close() {
        closed = true;
        api.send(null, { t: 'bye', reason: 'الحكم أغلق الغرفة.' });
        if (bus) bus.close();
        if (peer) try { peer.destroy(); } catch (_) {}
      },
    };

    if (mode === 'solo') { h.onStatus('ready', 'جهاز واحد — بلا شبكة.'); return Promise.resolve(api); }

    if (mode === 'local') {
      bus = Bus(PREFIX + code);
      bus.on(deliver);
      h.onStatus('ready', 'الغرفة مفتوحة على هذا الجهاز.');
      return Promise.resolve(api);
    }

    /* online */
    h.onStatus('wait', 'جاري فتح الغرفة…');
    return loadPeer().then((Peer) => new Promise((res, rej) => {
      let settled = false;
      peer = new Peer(PREFIX + code, { debug: 0 });
      peer.on('open', () => { settled = true; h.onStatus('ready', 'الغرفة مفتوحة — وزّع الرمز على اللاعبين.'); res(api); });
      peer.on('connection', (c) => {
        c.on('open', () => { c.open = true; });
        c.on('data', (m) => {
          if (m && m.t === 'hello') { c._cid = m.cid; conns.set(m.cid, c); }
          deliver(m);
        });
        c.on('close', () => { if (c._cid) { conns.delete(c._cid); h.onLeave(c._cid); } });
        c.on('error', () => {});
      });
      peer.on('disconnected', () => { if (!closed) { h.onStatus('wait', 'انقطع الاتصال بخادم الغرف — جاري المحاولة…'); try { peer.reconnect(); } catch (_) {} } });
      peer.on('error', (err) => {
        const taken = err && err.type === 'unavailable-id';
        if (!settled) { settled = true; rej(new Error(taken ? 'الرمز مستخدم حاليًا — جرّب رمزًا آخر.' : 'ما قدرنا نفتح الغرفة. تأكّد من الإنترنت.')); }
        else h.onStatus('warn', 'خلل في الاتصال — بعض اللاعبين قد ينقطعون.');
      });
    }));
  }

  /* ══════════════════════════════ اللاعب (client) ══════════════════════════ */
  function Client(mode, code, cid, h) {
    h = Object.assign({ onMsg: noop, onStatus: noop }, h || {});
    let bus = null, peer = null, conn = null, closed = false;

    function deliver(m) {
      if (!m || m.room !== code || m.from !== 'host') return;
      if (m.to !== '*' && m.to !== cid) return;
      h.onMsg(m);
    }

    const api = {
      mode, code, cid,
      send(msg) {
        const m = Object.assign({ room: code, from: cid, cid, to: 'host' }, msg);
        if (mode === 'local' && bus) bus.post(m);
        else if (conn && conn.open) try { conn.send(m); } catch (_) {}
      },
      close() {
        closed = true;
        api.send({ t: 'bye' });
        if (bus) bus.close();
        if (peer) try { peer.destroy(); } catch (_) {}
      },
    };

    if (mode === 'local') {
      bus = Bus(PREFIX + code);
      bus.on(deliver);
      h.onStatus('ready', 'متصل بالغرفة على هذا الجهاز.');
      return Promise.resolve(api);
    }

    h.onStatus('wait', 'جاري الاتصال بالغرفة…');
    return loadPeer().then((Peer) => new Promise((res, rej) => {
      let settled = false;
      peer = new Peer(undefined, { debug: 0 });
      const fail = (msg) => { if (!settled) { settled = true; rej(new Error(msg)); } };
      const to = setTimeout(() => fail('ما لقينا غرفة بهذا الرمز. تأكّد من الرمز ومن الإنترنت.'), 20000);
      peer.on('open', () => {
        conn = peer.connect(PREFIX + code, { reliable: true });
        conn.on('open', () => {
          conn.open = true; clearTimeout(to);
          settled = true; h.onStatus('ready', 'متصل بالغرفة.'); res(api);
        });
        conn.on('data', deliver);
        conn.on('close', () => { if (!closed) h.onStatus('warn', 'انقطع الاتصال بالحكم.'); });
        conn.on('error', () => fail('ما قدرنا نتصل بالغرفة.'));
      });
      peer.on('error', (err) => {
        clearTimeout(to);
        const gone = err && (err.type === 'peer-unavailable');
        fail(gone ? 'ما في غرفة بهذا الرمز الآن.' : 'خلل في الاتصال — تأكّد من الإنترنت.');
        if (settled && !closed) h.onStatus('warn', 'خلل في الاتصال.');
      });
    }));
  }

  root.WolaatNet = { Host, Client, PREFIX };
})(typeof window !== 'undefined' ? window : globalThis);
