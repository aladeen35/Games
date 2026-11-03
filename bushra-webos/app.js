/* البشرى لشاشات webOS — تطبيق خفيف بلا أطر عمل، متوافق مع متصفحات الشاشات القديمة (webOS 4+):
   لا async/await ولا ?. ولا ??. التنقل بالريموت مكاني (حسب موضع العناصر)، ويعمل مؤشر Magic Remote أيضًا. */
'use strict';

var KEY = { L: 37, U: 38, R: 39, D: 40, OK: 13, BACK: 461, ESC: 27, BS: 8, RED: 403, GREEN: 404, YELLOW: 405, BLUE: 406,
  PLAY: 415, PAUSE: 19, PP: 179, STOP: 413, FF: 417, RW: 412, CHUP: 33, CHDN: 34 };
var VERSION = '1.0.0';

// ———————————— أدوات ————————————
function $(id) { return document.getElementById(id); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
function enc(s) { return encodeURIComponent(s); }
function ls(k, d) { try { var v = localStorage.getItem('b_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
function save(k, v) { try { localStorage.setItem('b_' + k, JSON.stringify(v)); } catch (e) {} }
function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function hhmm(d) { return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2); }
function dur(s) { s = Math.max(0, Math.floor(s)); var h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60; return (h ? h + ':' + ('0' + m).slice(-2) : m) + ':' + ('0' + s % 60).slice(-2); }
function norm(s) {
  return String(s).toLowerCase().replace(/^[a-z]{2,3}\s*[:|]\s*/, '').replace(/[ًٌٍَُِّْـ]/g, '').replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\b(hd|fhd|uhd|sd|4k|hevc|h265|1080p?|720p?|backup)\b/g, '')
    .replace(/[^0-9a-z؀-ۿ]/g, '');
}
function initial(n) { var w = String(n).replace(/[^؀-ۿA-Za-z0-9 ]/g, ' ').trim().split(/\s+/).filter(function (x) { return x && x !== 'قناة'; }); var t = w.length > 1 ? w[w.length - 1] : (w[0] || '•'); if (t.indexOf('ال') === 0 && t.length > 2) t = t.slice(2); return t.charAt(0).toUpperCase(); }
function b64(s) { try { return decodeURIComponent(escape(atob(s))); } catch (e) { return s || ''; } }
function getJSON(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }); }
function getText(u) { return fetch(u).then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); }); }
var toastT;
function toast(t) { var e = $('toast'); e.textContent = t; e.classList.remove('hide'); clearTimeout(toastT); toastT = setTimeout(function () { e.classList.add('hide'); }, 2600); }

// تخزين القوائم الكبيرة في IndexedDB، والصغيرة في localStorage
var DB = (function () {
  var p;
  function db() {
    return p || (p = new Promise(function (res, rej) {
      var r = indexedDB.open('bushra', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('kv'); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error); };
    }));
  }
  return {
    get: function (k) { return db().then(function (d) { return new Promise(function (res) { var q = d.transaction('kv').objectStore('kv').get(k); q.onsuccess = function () { res(q.result); }; q.onerror = function () { res(undefined); }; }); }).catch(function () { return undefined; }); },
    set: function (k, v) { return db().then(function (d) { return new Promise(function (res) { var t = d.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, k); t.oncomplete = res; t.onerror = res; }); }).catch(function () {}); },
    del: function (k) { return db().then(function (d) { d.transaction('kv', 'readwrite').objectStore('kv').delete(k); }).catch(function () {}); }
  };
})();

// ———————————— الحالة ————————————
var S = {
  sources: ls('sources', []),
  favs: ls('favs', {}),          // id ← نسخة من القناة
  hist: ls('hist', []),          // آخر ما شوهد (الأحدث أولًا)
  set: Object.assign({ autoLast: true, unified: true }, ls('set', {})),
  ch: {},                        // مصدر ← قنواته
  view: 'home', stack: [], loading: {}
};

function channels(kind) {
  var out = [], seen = {};
  S.sources.forEach(function (s) {
    (S.ch[s.id] || []).forEach(function (c) {
      if (kind && c.k !== kind) return;
      // قائمة موحّدة: القناة المكررة في أكثر من قائمة تظهر مرة واحدة (والبقية روابط بديلة)
      if (S.set.unified && c.k === 'live' && S.sources.length > 1) {
        var key = norm(c.n);
        if (key.length > 2) { if (seen[key] && seen[key] !== c.s) return; seen[key] = c.s; }
      }
      out.push(c);
    });
  });
  return out;
}
function alternates(c) {
  var key = norm(c.n), out = [];
  if (key.length < 3) return out;
  S.sources.forEach(function (s) { (S.ch[s.id] || []).forEach(function (x) { if (x.k === 'live' && x.u !== c.u && norm(x.n) === key) out.push(x); }); });
  return out;
}
function byId(id) { for (var i = 0; i < S.sources.length; i++) { var l = S.ch[S.sources[i].id] || []; for (var j = 0; j < l.length; j++) if (l[j].id === id) return l[j]; } return S.favs[id] || null; }
function srcOf(id) { for (var i = 0; i < S.sources.length; i++) if (S.sources[i].id === id) return S.sources[i]; return null; }
function groupsOf(list) { var m = {}, o = []; list.forEach(function (c) { if (!m[c.g]) { m[c.g] = 0; o.push(c.g); } m[c.g]++; }); return o.map(function (g) { return [g, m[g]]; }); }
function isFav(id) { return !!S.favs[id]; }
function toggleFav(c) { if (S.favs[c.id]) { delete S.favs[c.id]; toast('أُزيلت من المفضلة'); } else { S.favs[c.id] = c; toast('أُضيفت إلى المفضلة ★'); } save('favs', S.favs); }

// ———————————— المصادر: M3U و Xtream ————————————
function xtUrl(src, action, extra) { return src.server + '/player_api.php?username=' + enc(src.user) + '&password=' + enc(src.pass) + (action ? '&action=' + action : '') + (extra || ''); }
function fromGetPhp(url) {
  var m = /^(https?:\/\/[^/]+)\/(?:get|player_api)\.php\?(.*)$/i.exec(url.trim());
  if (!m) return null;
  var q = {}; m[2].split('&').forEach(function (p) { var kv = p.split('='); q[kv[0]] = decodeURIComponent(kv[1] || ''); });
  return q.username && q.password ? { server: m[1], user: q.username, pass: q.password } : null;
}

function loadXtream(src) {
  var sid = src.id;
  return getJSON(xtUrl(src)).then(function (j) {
    if (!j || !j.user_info || String(j.user_info.auth) === '0') throw new Error('بيانات الدخول غير صحيحة');
    var exp = parseInt(j.user_info.exp_date, 10);
    src.note = exp ? 'ينتهي ' + new Date(exp * 1000).toLocaleDateString('ar') : '';
    function cats(a) { return getJSON(xtUrl(src, a)).then(function (l) { var m = {}; (l || []).forEach(function (c) { m[c.category_id] = c.category_name; }); return m; }).catch(function () { return {}; }); }
    function list(a) { return getJSON(xtUrl(src, a)).catch(function () { return []; }); }
    return Promise.all([cats('get_live_categories'), list('get_live_streams'), cats('get_vod_categories'), list('get_vod_streams'), cats('get_series_categories'), list('get_series')]);
  }).then(function (r) {
    var out = [], base = src.server, u = enc(src.user), p = enc(src.pass);
    (r[1] || []).forEach(function (s) { out.push({ id: sid + ':l' + s.stream_id, s: sid, n: String(s.name || '').trim(), g: r[0][s.category_id] || 'قنوات', u: base + '/live/' + u + '/' + p + '/' + s.stream_id + '.m3u8', l: s.stream_icon || '', k: 'live', x: s.stream_id, no: parseInt(s.num, 10) || 0 }); });
    (r[3] || []).forEach(function (s) { out.push({ id: sid + ':v' + s.stream_id, s: sid, n: String(s.name || '').trim(), g: r[2][s.category_id] || 'أفلام', u: base + '/movie/' + u + '/' + p + '/' + s.stream_id + '.' + (s.container_extension || 'mp4'), l: s.stream_icon || '', k: 'vod', x: s.stream_id }); });
    (r[5] || []).forEach(function (s) { out.push({ id: sid + ':s' + s.series_id, s: sid, n: String(s.name || '').trim(), g: r[4][s.category_id] || 'مسلسلات', u: '', l: s.cover || '', k: 'series', x: s.series_id }); });
    return out;
  });
}

function parseM3u(text, sid) {
  var out = [], meta = null, lines = text.split(/\r?\n/);
  for (var i = 0; i < lines.length; i++) {
    var l = lines[i].trim();
    if (l.indexOf('#EXTINF') === 0) {
      var attr = function (k) { var m = new RegExp(k + '="([^"]*)"').exec(l); return m ? m[1] : ''; };
      var c = l.lastIndexOf('",'); var n = c >= 0 ? l.slice(c + 2) : l.slice(l.indexOf(',') + 1);
      meta = { n: n.trim() || attr('tvg-name'), g: attr('group-title') || 'بلا مجموعة', l: attr('tvg-logo') };
    } else if (l && l[0] !== '#' && meta) {
      var low = l.toLowerCase().split('?')[0];
      var vod = /\/(movie|series)\//.test(low) || /\.(mp4|mkv|avi|mov|m4v)$/.test(low);
      out.push({ id: sid + ':' + out.length + ':' + meta.n.length, s: sid, n: meta.n, g: meta.g, u: l, l: meta.l, k: vod ? 'vod' : 'live', no: 0 });
      meta = null;
    }
  }
  return out;
}

function refresh(src) {
  S.loading[src.id] = true;
  var p = src.type === 'xtream' ? loadXtream(src) : getText(src.url).then(function (t) {
    if (t.indexOf('#EXT') < 0) throw new Error('الرابط ليس قائمة M3U');
    return parseM3u(t, src.id);
  });
  return p.then(function (list) {
    if (!list.length) throw new Error('القائمة فارغة');
    S.ch[src.id] = list;
    src.at = Date.now();
    src.count = list.length;
    src.err = '';
    save('sources', S.sources);
    return DB.set('ch_' + src.id, list).then(function () { return list; });
  }).catch(function (e) {
    src.err = e.message || 'تعذر الوصول للمصدر';
    save('sources', S.sources);
    throw e;
  }).then(function (l) { S.loading[src.id] = false; return l; }, function (e) { S.loading[src.id] = false; throw e; });
}

function addSource(o) {
  var x = o.url ? fromGetPhp(o.url) : null;
  var src = x ? { type: 'xtream', server: x.server, user: x.user, pass: x.pass } : (o.url ? { type: 'm3u', url: o.url.trim() } : { type: 'xtream', server: o.server.trim().replace(/\/+$/, ''), user: o.user.trim(), pass: o.pass });
  if (src.type === 'xtream' && src.server.indexOf('http') !== 0) src.server = 'http://' + src.server;
  src.id = 's' + Date.now().toString(36);
  src.name = o.name || (src.type === 'xtream' ? 'حساب ' + src.server.replace(/^https?:\/\//, '') : src.url.replace(/^https?:\/\//, '').split('/')[0]);
  S.sources.push(src);
  return refresh(src).then(function (l) { return l; }, function (e) { S.sources.pop(); save('sources', S.sources); throw e; });
}

// دليل البرامج المختصر لقنوات Xtream (الآن والقادم)
var EPG = {};
function shortEpg(c) {
  var src = srcOf(c.s);
  if (!src || src.type !== 'xtream' || !c.x) return Promise.resolve([]);
  var hit = EPG[c.id];
  if (hit && Date.now() - hit.at < 600000) return Promise.resolve(hit.l);
  return getJSON(xtUrl(src, 'get_short_epg', '&stream_id=' + c.x + '&limit=4')).then(function (j) {
    var l = ((j && j.epg_listings) || []).map(function (e) {
      return { t: b64(e.title), d: b64(e.description), a: new Date((+e.start_timestamp) * 1000), b: new Date((+e.stop_timestamp) * 1000) };
    }).filter(function (e) { return e.b > new Date(); });
    EPG[c.id] = { at: Date.now(), l: l };
    return l;
  }).catch(function () { return []; });
}

// ———————————— السجل ————————————
function histOf(key) { for (var i = 0; i < S.hist.length; i++) if (S.hist[i].key === key) return S.hist[i]; return null; }
function record(it, pos, len) {
  var h = histOf(it.key);
  if (h) S.hist.splice(S.hist.indexOf(h), 1);
  h = Object.assign(h || {}, { key: it.key, title: it.title, sub: it.sub || '', url: it.url, logo: it.logo || '', live: it.live, chId: it.chId || '', srcId: it.srcId || '', series: it.series || '', at: Date.now() });
  if (pos != null) { h.pos = pos; h.len = len; }
  S.hist.unshift(h);
  if (S.hist.length > 60) S.hist.length = 60;
  save('hist', S.hist);
}
function resumable(h) { return !h.live && h.len > 60 && h.pos > 15 && h.pos / h.len < 0.95; }
function itemOf(c) { return { key: c.id, title: c.n, sub: c.g, url: c.u, logo: c.l, live: c.k === 'live', chId: c.id, srcId: c.s }; }

// ———————————— التنقل بالريموت ————————————
var F = {
  cur: null,
  scope: function () {
    if (!$('layer').classList.contains('hide')) return $('layer');
    if (!$('player').classList.contains('hide')) return $('plist').classList.contains('hide') ? null : $('plist');
    return document.body;
  },
  items: function () { var s = this.scope(); return s ? Array.prototype.slice.call(s.querySelectorAll('.f')).filter(function (e) { return e.offsetParent !== null; }) : []; },
  set: function (e, noScroll) {
    if (!e) return;
    if (this.cur) this.cur.classList.remove('focus');
    this.cur = e;
    e.classList.add('focus');
    if (!noScroll) {
      if (e.scrollIntoViewIfNeeded) e.scrollIntoViewIfNeeded(true); else e.scrollIntoView(false);
    }
    if (e._onfocus) e._onfocus();
  },
  move: function (dir) {
    var list = this.items(), cur = this.cur;
    if (!cur || list.indexOf(cur) < 0) { this.set(list[0]); return; }
    var r = cur.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, best = null, bs = 1e9;
    var nav = $('nav'), curNav = nav.contains(cur);
    list.forEach(function (e) {
      if (e === cur) return;
      // أعلى/أسفل لا يقفزان بين الشريط الجانبي والمحتوى
      if ((dir === 'U' || dir === 'D') && nav.contains(e) !== curNav) return;
      var q = e.getBoundingClientRect(), x = q.left + q.width / 2, y = q.top + q.height / 2, dx = x - cx, dy = y - cy, main, side;
      if (dir === 'L') { if (q.right > r.left + 2 && dx >= -2) return; main = -dx; side = Math.abs(dy); }
      else if (dir === 'R') { if (q.left < r.right - 2 && dx <= 2) return; main = dx; side = Math.abs(dy); }
      else if (dir === 'U') { if (q.bottom > r.top + 2 && dy >= -2) return; main = -dy; side = Math.abs(dx); }
      else { if (q.top < r.bottom - 2 && dy <= 2) return; main = dy; side = Math.abs(dx); }
      var s = main + side * 2.2;
      if (s < bs) { bs = s; best = e; }
    });
    if (best) this.set(best);
  },
  first: function (root) { var e = (root || document).querySelector('.f'); if (e) this.set(e); }
};
// يجعل العنصر قابلًا للتركيز والتفعيل بالريموت والمؤشر
function act(e, fn, onfocus) {
  e.classList.add('f');
  e._act = fn;
  if (onfocus) e._onfocus = onfocus;
  e.addEventListener('mouseover', function () { F.set(e, true); });
  e.addEventListener('click', function () { F.set(e, true); fn(); });
  return e;
}

// ———————————— الواجهة ————————————
var NAV = [['home', '⌂', 'الرئيسية'], ['live', '📡', 'مباشر'], ['vod', '🎬', 'أفلام'], ['series', '🎞️', 'مسلسلات'], ['search', '🔍', 'بحث'], ['lists', '☰', 'قوائمي']];
function buildNav() {
  var n = $('nav');
  n.innerHTML = '<div class="logo"><img src="largeIcon.png"><b>البشرى</b></div>';
  NAV.forEach(function (x) {
    var e = el('div', 'ni' + (S.view === x[0] ? ' on' : ''), '<i>' + x[1] + '</i>' + x[2]);
    e.dataset.v = x[0];
    act(e, function () { go(x[0]); });
    n.appendChild(e);
  });
  var clk = el('div', 'muted', '');
  clk.style.cssText = 'position:absolute;bottom:2rem;font-size:1.4rem;width:13.6rem;text-align:center';
  n.appendChild(clk);
  (function tick() { clk.textContent = hhmm(new Date()); setTimeout(tick, 15000); })();
}
function go(v, keepStack) {
  if (!keepStack) S.stack = [];
  S.view = v;
  Array.prototype.forEach.call(document.querySelectorAll('.ni'), function (e) { e.classList.toggle('on', e.dataset.v === v); });
  render();
}
function view() { var m = $('main'); m.innerHTML = ''; var v = el('div', 'view'); m.appendChild(v); return v; }
function render(focusFirst) {
  var fn = { home: vHome, live: vLive, vod: vCatalog, series: vCatalog, search: vSearch, lists: vLists, show: vShow }[S.view] || vHome;
  fn();
  if (focusFirst !== false) { var f = $('main').querySelector('.f'); if (f) F.set(f); }
}

function logoBox(c, cls) {
  var img = el('div', 'img');
  if (c.l) img.innerHTML = '<img src="' + esc(c.l) + '" onerror="this.parentNode.innerHTML=\'<span class=ini>' + esc(initial(c.n)) + '</span>\'">';
  else img.innerHTML = '<span class="ini">' + esc(initial(c.n)) + '</span>';
  return img;
}
function chCard(c, queue) {
  var e = el('div', 'card ch-c');
  var img = logoBox(c);
  img.insertAdjacentHTML('beforeend', '<span class="badge">مباشر</span>' + (isFav(c.id) ? '<span class="star">★</span>' : '') + (c.no ? '<span class="num">' + c.no + '</span>' : ''));
  e.appendChild(img);
  e.appendChild(el('div', 'nm', esc(c.n)));
  e.appendChild(el('div', 'sub', esc(c.g)));
  return act(e, function () { open(c, queue); });
}
function posterCard(c, queue) {
  var e = el('div', 'card poster-c');
  var img = el('div', 'img');
  if (c.l) img.style.backgroundImage = 'url("' + c.l.replace(/"/g, '%22') + '")';
  else img.innerHTML = '<div class="cname">' + esc(c.n) + '</div>';
  var h = histOf(c.id);
  if (h && resumable(h)) img.insertAdjacentHTML('beforeend', '<div class="prog"><i style="width:' + Math.round(100 * h.pos / h.len) + '%"></i></div>');
  if (isFav(c.id)) img.insertAdjacentHTML('beforeend', '<span class="star">★</span>');
  e.appendChild(img);
  e.appendChild(el('div', 'nm', esc(c.n)));
  return act(e, function () { open(c, queue); });
}
function histCard(h) {
  var e = el('div', 'card wide-c');
  var img = el('div', 'img');
  if (h.logo && !h.live) img.style.backgroundImage = 'url("' + h.logo.replace(/"/g, '%22') + '")';
  else img.innerHTML = h.logo ? '<img src="' + esc(h.logo) + '" style="position:absolute;inset:25% 30%;width:40%;height:50%;object-fit:contain">' : '<span class="ini" style="position:absolute;top:35%;width:100%;text-align:center">' + esc(initial(h.title)) + '</span>';
  if (h.live) img.insertAdjacentHTML('beforeend', '<span class="badge">مباشر</span>');
  if (resumable(h)) img.insertAdjacentHTML('beforeend', '<div class="prog"><i style="width:' + Math.round(100 * h.pos / h.len) + '%"></i></div>');
  e.appendChild(img);
  e.appendChild(el('div', 'nm', esc(h.title)));
  e.appendChild(el('div', 'sub', resumable(h) ? 'متبقٍ ' + Math.max(1, Math.round((h.len - h.pos) / 60)) + ' دقيقة' : esc(h.sub)));
  return act(e, function () { play(h, null); });
}
function row(parent, title, items, make, sub) {
  if (!items.length) return;
  parent.appendChild(el('h2', '', esc(title) + (sub ? ' <small>' + esc(sub) + '</small>' : '')));
  var r = el('div', 'row');
  items.forEach(function (x) { r.appendChild(make(x)); });
  parent.appendChild(r);
}
function empty(parent, title, body, btn) {
  var e = el('div', 'empty', '<b>' + esc(title) + '</b>' + esc(body) + '<br><br>');
  if (btn) e.appendChild(act(el('span', 'btn gold', esc(btn)), function () { go('lists'); }));
  parent.appendChild(e);
}

// الرئيسية: بطل + تابع المشاهدة + المفضلة + القنوات + الجديد
function vHome() {
  var v = view();
  if (!S.sources.length && !S.hist.length) return empty(v, 'أهلًا بك في البشرى', 'أضف رابط قائمة M3U أو حساب مزود لتظهر قنواتك وأفلامك هنا.', 'أضف قائمة');
  var live = channels('live'), vod = channels('vod'), ser = channels('series');
  var favs = Object.keys(S.favs).map(function (k) { return S.favs[k]; });
  var cont = S.hist.filter(resumable);
  var hero = cont[0] || S.hist[0];
  var hc = !hero && (favs[0] || vod[vod.length - 1] || live[0]);
  if (hero || hc) {
    var it = hero || itemOf(hc);
    var hd = el('div', 'hero');
    var img = it.logo || '';
    hd.innerHTML = '<div class="bg" style="background-image:url(\'' + esc(img) + '\')"></div>' +
      (img ? '<div class="poster" style="background-image:url(\'' + esc(img) + '\');' + (it.live ? 'background-size:60%;background-repeat:no-repeat' : '') + '"></div>' : '') +
      '<div class="txt"><div class="eye">' + (hero ? (resumable(hero) ? 'أكمل المشاهدة' : 'شاهدته مؤخرًا') : 'مقترح لك') + '</div><div class="t">' + esc(it.title) + '</div><div class="s">' + esc(it.sub || '') + '</div></div>';
    var txt = hd.querySelector('.txt');
    txt.appendChild(act(el('span', 'btn gold', '▶ ' + (hero && resumable(hero) ? 'أكمل' : (it.live ? 'شاهد الآن' : 'تشغيل'))), function () { hero ? play(hero, null) : open(hc, null); }));
    if (hc || (hero && hero.chId && byId(hero.chId))) {
      txt.appendChild(act(el('span', 'btn', '★ المفضلة'), function () { var c = hc || byId(hero.chId); if (c) toggleFav(c); }));
    }
    v.appendChild(hd);
  }
  row(v, 'تابع المشاهدة', S.hist.slice(0, 15), histCard);
  row(v, 'مفضلتي', favs, function (c) { return c.k === 'live' ? chCard(c, favs.filter(function (x) { return x.k === 'live'; })) : posterCard(c, favs); });
  row(v, 'قنوات مباشرة', live.slice(0, 24), function (c) { return chCard(c, live); }, live.length + ' قناة');
  row(v, 'أفلام جديدة', vod.slice(-24).reverse(), function (c) { return posterCard(c, vod); });
  row(v, 'مسلسلات جديدة', ser.slice(-24).reverse(), function (c) { return posterCard(c, ser); });
}

// المباشر: المجموعات، القنوات، ولوحة الآن والقادم
function vLive() {
  var v = view();
  v.style.padding = '2.4rem 3rem 0';
  var live = channels('live');
  if (!live.length) return empty(v, 'لا توجد قنوات بعد', 'أضف قائمة أو حساب مزود من «قوائمي».', 'أضف قائمة');
  var wrap = el('div', 'live'); wrap.style.height = 'calc(100% - 1rem)';
  var gs = el('div', 'groups'), chs = el('div', 'chs'), side = el('div', 'side');
  wrap.appendChild(gs); wrap.appendChild(chs); wrap.appendChild(side); v.appendChild(wrap);
  var favs = live.filter(function (c) { return isFav(c.id); });
  var groups = [['الكل', live.length]].concat(favs.length ? [['★ المفضلة', favs.length]] : [], groupsOf(live));
  var g = S.group && groups.some(function (x) { return x[0] === S.group; }) ? S.group : 'الكل';
  var sideT;
  function showSide(c) {
    clearTimeout(sideT);
    sideT = setTimeout(function () {
      side.innerHTML = '<div class="big" style="background-image:url(\'' + esc(c.l) + '\')"></div><h1 style="font-size:1.8rem">' + esc(c.n) + '</h1><div class="muted" style="font-size:1.2rem">' + esc(c.g) + '</div><div id="sepg" class="muted" style="margin-top:1.4rem;font-size:1.2rem">…</div>';
      shortEpg(c).then(function (l) {
        var box = $('sepg'); if (!box) return;
        if (!l.length) { box.textContent = 'لا تتوفر بيانات دليل البرامج لهذه القناة.'; return; }
        box.innerHTML = l.slice(0, 3).map(function (e, i) {
          var now = new Date(), on = e.a <= now && now < e.b;
          return '<div class="ep' + (on ? ' now' : '') + '"><small>' + (on ? 'الآن · ' : '') + hhmm(e.a) + ' – ' + hhmm(e.b) + '</small><b>' + esc(e.t) + '</b>' +
            (on ? '<div class="bar"><i style="width:' + Math.round(100 * (now - e.a) / (e.b - e.a)) + '%"></i></div>' : '') + (i === 0 && e.d ? '<small>' + esc(e.d.slice(0, 140)) + '</small>' : '') + '</div>';
        }).join('');
      });
    }, 350);
  }
  function fill(name) {
    S.group = g = name;
    Array.prototype.forEach.call(gs.children, function (e) { e.classList.toggle('on', e._g === g); });
    var list = g === 'الكل' ? live : g === '★ المفضلة' ? favs : live.filter(function (c) { return c.g === g; });
    chs.innerHTML = '';
    var shown = 0;
    function more() {
      list.slice(shown, shown + 200).forEach(function (c, i) {
        var e = el('div', 'li', '<span class="no">' + (c.no || shown + i + 1) + '</span><div class="lg" style="background-image:url(\'' + esc(c.l) + '\')">' + (c.l ? '' : esc(initial(c.n))) + '</div><span class="n">' + esc(c.n) + '</span>' + (isFav(c.id) ? '<span class="fav">★</span>' : ''));
        chs.appendChild(act(e, function () { open(c, list); }, function () { showSide(c); }));
      });
      shown += 200;
      if (shown < list.length) {
        var m = el('div', 'li', '<span class="n" style="text-align:center;color:#2EE6D6">عرض المزيد (' + (list.length - shown) + ')</span>');
        chs.appendChild(act(m, function () { chs.removeChild(m); more(); F.set(chs.children[shown - 200]); }));
      }
    }
    more();
  }
  groups.forEach(function (x) {
    var e = el('div', 'chip', '<span>' + esc(x[0]) + '</span><span class="muted">' + x[1] + '</span>');
    e._g = x[0];
    gs.appendChild(act(e, function () { fill(x[0]); F.set(chs.firstChild); }));
  });
  fill(g);
  setTimeout(function () { var f = chs.querySelector('.f'); if (f) F.set(f); }, 0);
}

// الأفلام والمسلسلات: شرائح المجموعات + شبكة ملصقات
function vCatalog() {
  var kind = S.view, v = view();
  var all = channels(kind);
  v.appendChild(el('h1', '', (kind === 'vod' ? 'الأفلام' : 'المسلسلات') + ' <small class="muted" style="font-size:1.2rem">' + all.length + '</small>'));
  if (!all.length) return empty(v, kind === 'vod' ? 'لا توجد أفلام' : 'لا توجد مسلسلات', 'تظهر هنا أفلام ومسلسلات حسابات المزودين وقوائم M3U.', 'أضف حسابًا');
  var gl = groupsOf(all), chips = el('div', 'row'), grid = el('div', 'grid');
  v.appendChild(chips); v.appendChild(grid);
  var cur = S['g_' + kind] || 'الكل';
  function fill(g) {
    S['g_' + kind] = cur = g;
    Array.prototype.forEach.call(chips.children, function (e) { e.classList.toggle('on', e._g === g); });
    var list = g === 'الكل' ? all.slice().reverse() : all.filter(function (c) { return c.g === g; });
    grid.innerHTML = '';
    var shown = 0;
    function more() {
      list.slice(shown, shown + 60).forEach(function (c) { grid.appendChild(posterCard(c, list)); });
      shown += 60;
      if (shown < list.length) {
        var m = el('div', 'card poster-c', '<div class="img" style="display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:#2EE6D6">عرض المزيد<br>+' + (list.length - shown) + '</div>');
        grid.appendChild(act(m, function () { grid.removeChild(m); more(); F.set(grid.children[shown - 60]); }));
      }
    }
    more();
  }
  [['الكل', all.length]].concat(gl).forEach(function (x) {
    var e = el('div', 'chip', esc(x[0]) + ' <span class="muted">' + x[1] + '</span>');
    e.style.cssText = 'flex-shrink:0;margin:0';
    e._g = x[0];
    chips.appendChild(act(e, function () { fill(x[0]); }));
  });
  fill(cur);
}

// صفحة المسلسل: المواسم والحلقات من حساب Xtream
function vShow() {
  var c = S.show, v = view(), src = srcOf(c.s);
  v.appendChild(el('div', 'empty', 'جارٍ تحميل الحلقات…'));
  getJSON(xtUrl(src, 'get_series_info', '&series_id=' + c.x)).then(function (j) {
    if (S.view !== 'show' || S.show !== c) return;
    var info = j.info || {}, seasons = {}, keys = [];
    var eps = j.episodes || {};
    Object.keys(eps).forEach(function (k) { (eps[k] || []).forEach(function (e) { var s = +(e.season || k) || 1; if (!seasons[s]) { seasons[s] = []; keys.push(s); } seasons[s].push(e); }); });
    keys.sort(function (a, b) { return a - b; });
    v.innerHTML = '';
    var cover = info.cover || c.l;
    var hd = el('div', 'hero');
    hd.innerHTML = '<div class="bg" style="background-image:url(\'' + esc(cover) + '\')"></div><div class="poster" style="background-image:url(\'' + esc(cover) + '\')"></div><div class="txt"><div class="eye">مسلسل · ' + keys.length + ' موسم</div><div class="t">' + esc(info.name || c.n) + '</div><div class="s">' + esc(String(info.plot || '').slice(0, 260)) + '</div></div>';
    v.appendChild(hd);
    function epItem(e, s) {
      var url = src.server + '/series/' + enc(src.user) + '/' + enc(src.pass) + '/' + e.id + '.' + (e.container_extension || 'mp4');
      return { key: c.id + ':e' + e.id, title: c.n + ' — الحلقة ' + (e.episode_num || ''), sub: 'الموسم ' + s + ' · الحلقة ' + (e.episode_num || ''), url: url, logo: cover, live: false, srcId: c.s, series: c.id };
    }
    // الحلقة التي يكمل منها: آخر حلقة شوهدت من هذا المسلسل
    var last = S.hist.filter(function (h) { return h.series === c.id; })[0];
    var txt = hd.querySelector('.txt');
    var firstS = keys[0];
    if (firstS != null) {
      txt.appendChild(act(el('span', 'btn gold', last ? '▶ أكمل: ' + esc(last.sub) : '▶ الحلقة الأولى'), function () {
        if (last) { var q = queueFor(last.key); play(last, q); } else play(epItem(seasons[firstS][0], firstS), seasons[firstS].map(function (e) { return epItem(e, firstS); }));
      }));
    }
    txt.appendChild(act(el('span', 'btn', isFav(c.id) ? '★ في المفضلة' : '☆ المفضلة'), function () { toggleFav(c); }));
    var all = {};
    keys.forEach(function (s) {
      var q = seasons[s].map(function (e) { return epItem(e, s); });
      q.forEach(function (it) { all[it.key] = q; });
      v.appendChild(el('h2', '', 'الموسم ' + s + ' <small>' + q.length + ' حلقة</small>'));
      var r = el('div', 'row');
      q.forEach(function (it, i) {
        var e = seasons[s][i], h = histOf(it.key);
        var cd = el('div', 'card wide-c');
        var img = el('div', 'img');
        var pic = (e.info && e.info.movie_image) || cover;
        img.style.backgroundImage = 'url("' + String(pic).replace(/"/g, '%22') + '")';
        img.innerHTML = '<div class="cname">الحلقة ' + esc(e.episode_num) + '</div>' + (h && h.len ? '<div class="prog"><i style="width:' + Math.round(100 * h.pos / h.len) + '%"></i></div>' : '');
        cd.appendChild(img);
        cd.appendChild(el('div', 'nm', esc(e.title || it.title)));
        r.appendChild(act(cd, function () { play(it, q); }));
      });
      v.appendChild(r);
    });
    function queueFor(k) { return all[k] || null; }
    F.first($('main'));
  }).catch(function () { v.innerHTML = ''; empty(v, 'تعذر تحميل الحلقات', 'تحقق من الاتصال بالإنترنت ثم أعد المحاولة.'); });
}

// البحث: لوحة مفاتيح الشاشة + نتائج فورية
function vSearch() {
  var v = view();
  v.appendChild(el('h1', '', 'بحث'));
  var inp = el('input', 'inp');
  inp.placeholder = 'اسم قناة أو فيلم أو مسلسل';
  inp.value = S.q || '';
  v.appendChild(act(inp, function () { inp.focus(); }));
  var res = el('div', '');
  v.appendChild(res);
  var t;
  function run() {
    var q = norm(inp.value);
    S.q = inp.value;
    res.innerHTML = '';
    if (q.length < 2) { res.appendChild(el('div', 'muted', 'اكتب حرفين على الأقل.')); return; }
    var all = channels(), hit = all.filter(function (c) { return norm(c.n).indexOf(q) >= 0; });
    var live = hit.filter(function (c) { return c.k === 'live'; }), other = hit.filter(function (c) { return c.k !== 'live'; });
    if (!hit.length) { res.appendChild(el('div', 'empty', '<b>لا نتائج</b>جرّب كلمة أقصر أو الاسم بالإنجليزية.')); return; }
    row(res, 'قنوات', live.slice(0, 40), function (c) { return chCard(c, live); }, live.length + '');
    row(res, 'أفلام ومسلسلات', other.slice(0, 40), function (c) { return posterCard(c, other); }, other.length + '');
  }
  inp.addEventListener('input', function () { clearTimeout(t); t = setTimeout(run, 300); });
  run();
}

// قوائمي: إضافة المصادر وإدارتها والإعدادات
function vLists() {
  var v = view();
  v.appendChild(el('h1', '', 'قوائمي والإعدادات'));
  S.sources.forEach(function (s) {
    var e = el('div', 'src', '<span class="n">' + esc(s.name) + '<br><small class="muted">' + (S.loading[s.id] ? 'جارٍ التحديث…' : (s.count || 0) + ' عنصر' + (s.note ? ' · ' + esc(s.note) : '') + (s.err ? ' · ⚠ ' + esc(s.err) : '')) + '</small></span>');
    e.appendChild(act(el('span', 'btn', '⟳ تحديث'), function () { toast('جارٍ تحديث «' + s.name + '»…'); refresh(s).then(function () { toast('تم التحديث'); render(); }, function (er) { toast('تعذر التحديث: ' + er.message); render(); }); }));
    e.appendChild(act(el('span', 'btn', '✕ حذف'), function () { confirmDlg('حذف «' + s.name + '»؟', function () { S.sources = S.sources.filter(function (x) { return x !== s; }); delete S.ch[s.id]; DB.del('ch_' + s.id); save('sources', S.sources); render(); }); }));
    v.appendChild(e);
  });
  v.appendChild(el('h2', '', 'إضافة رابط قائمة M3U'));
  var url = el('input', 'inp ltr'); url.placeholder = 'http://…/playlist.m3u  أو  get.php?username=…';
  v.appendChild(act(url, function () { url.focus(); }));
  v.appendChild(act(el('span', 'btn gold', '＋ إضافة القائمة'), function () { if (url.value.trim()) doAdd({ url: url.value }); }));
  v.appendChild(el('h2', '', 'إضافة حساب مزود (Xtream)'));
  var sv = el('input', 'inp ltr'); sv.placeholder = 'http://server.com:8080';
  var us = el('input', 'inp ltr'); us.placeholder = 'اسم المستخدم';
  var pw = el('input', 'inp ltr'); pw.placeholder = 'كلمة المرور'; pw.type = 'password';
  [sv, us, pw].forEach(function (i) { v.appendChild(act(i, function () { i.focus(); })); });
  v.appendChild(act(el('span', 'btn gold', '＋ إضافة الحساب'), function () { if (sv.value.trim() && us.value.trim()) doAdd({ server: sv.value, user: us.value, pass: pw.value }); }));
  v.appendChild(el('h2', '', 'الإعدادات'));
  [['autoLast', 'تشغيل آخر قناة عند فتح التطبيق'], ['unified', 'قائمة موحّدة: القناة المكررة تظهر مرة واحدة']].forEach(function (x) {
    var e = el('div', 'src', '<span class="n">' + x[1] + '</span><span class="btn">' + (S.set[x[0]] ? '✓ مفعّل' : 'متوقف') + '</span>');
    v.appendChild(act(e, function () { S.set[x[0]] = !S.set[x[0]]; save('set', S.set); render(false); F.first($('main')); }));
  });
  v.appendChild(act(el('div', 'src', '<span class="n">مسح سجل المشاهدة <small class="muted">(' + S.hist.length + ')</small></span>'), function () { S.hist = []; save('hist', S.hist); toast('مُسح السجل'); render(false); }));
  v.appendChild(el('p', 'muted', 'البشرى ' + VERSION + ' لشاشات webOS — أداة تشغيل فقط ولا يوفّر أي محتوى. بياناتك محفوظة على هذه الشاشة فقط.'));
}
function doAdd(o) {
  toast('جارٍ اختبار المصدر…');
  addSource(o).then(function (l) { toast('أُضيفت القائمة: ' + l.length + ' عنصر'); go('home'); }, function (e) { toast('تعذر الإضافة: ' + (e.message || 'تحقق من الرابط')); });
}
function confirmDlg(title, yes) {
  var L = $('layer');
  L.innerHTML = '';
  var d = el('div', 'dlg', '<h1>' + esc(title) + '</h1>');
  d.appendChild(act(el('span', 'btn gold', 'نعم'), function () { closeLayer(); yes(); }));
  d.appendChild(act(el('span', 'btn', 'إلغاء'), closeLayer));
  L.appendChild(d);
  L.classList.remove('hide');
  F.first(L);
}
var layerBack;
function closeLayer() { $('layer').classList.add('hide'); $('layer').innerHTML = ''; F.cur = null; F.first($('main')); }

// يفتح العنصر: مسلسل ← صفحته، غير ذلك ← المشغل
function open(c, queue) {
  if (c.k === 'series') { S.stack.push(S.view); S.show = c; go('show', true); return; }
  var q = queue ? queue.filter(function (x) { return x.k !== 'series'; }).map(itemOf) : null;
  play(itemOf(c), q);
}

// ———————————— المشغل ————————————
var V = $('video'), P = { q: null, i: -1, it: null, hls: null, osdT: null, tried: {}, sleep: 0, sleepT: null, digits: '', digT: null, connT: null, saveT: 0 };

function play(it, queue) {
  P.q = queue && queue.length ? queue : null;
  P.i = P.q ? P.q.map(function (x) { return x.key; }).indexOf(it.key) : -1;
  P.tried = {};
  $('player').classList.remove('hide');
  $('plist').classList.add('hide');
  start(it);
}
function start(it, isAlt) {
  P.it = it;
  if (!isAlt) P.tried = {};
  P.tried[it.url] = 1;
  $('pmsg').classList.add('hide');
  $('pspin').classList.remove('hide');
  if (P.hls) { P.hls.destroy(); P.hls = null; }
  V.removeAttribute('src');
  try { V.load(); } catch (e) {}
  var m3u8 = /\.m3u8(\?|$)/i.test(it.url);
  if (m3u8 && !V.canPlayType('application/vnd.apple.mpegurl') && window.Hls && Hls.isSupported()) {
    var h = new Hls({ enableWorker: true, backBufferLength: 30 });
    P.hls = h;
    h.on(Hls.Events.ERROR, function (_, d) { if (d.fatal) fail(); });
    h.loadSource(it.url);
    h.attachMedia(V);
  } else {
    V.src = it.url;
  }
  var h0 = histOf(it.key);
  if (h0 && resumable(h0)) {
    var once = function () { V.removeEventListener('loadedmetadata', once); try { V.currentTime = h0.pos; } catch (e) {} };
    V.addEventListener('loadedmetadata', once);
  }
  var pr = V.play(); if (pr && pr.catch) pr.catch(function () {});
  record(it);
  if (it.live) save('last', it);
  clearTimeout(P.connT);
  P.connT = setTimeout(function () { if (V.readyState < 3) fail(); }, 25000);
  osd(true);
}
function fail() {
  if ($('player').classList.contains('hide')) return;
  clearTimeout(P.connT);
  $('pspin').classList.add('hide');
  // قناة لا تعمل: نسختها من قائمة أخرى تلقائيًا
  var c = P.it.chId && byId(P.it.chId);
  if (c && P.it.live) {
    var alt = alternates(c).filter(function (x) { return !P.tried[x.u]; })[0];
    if (alt) { toast('القناة لا تعمل — التحويل إلى نسخة من «' + (srcOf(alt.s) || {}).name + '»'); var it = itemOf(alt); it.key = P.it.key; start(it, true); return; }
  }
  var m = $('pmsg');
  m.innerHTML = '<b>تعذر تشغيل البث</b>المصدر غير متاح الآن أو الرابط منتهٍ.<br><span class="muted">OK لإعادة المحاولة' + (P.q ? ' · CH+/CH− لقناة أخرى' : '') + ' · رجوع للخروج</span>';
  m.classList.remove('hide');
}
V.addEventListener('playing', function () { $('pspin').classList.add('hide'); $('pmsg').classList.add('hide'); clearTimeout(P.connT); });
V.addEventListener('waiting', function () { $('pspin').classList.remove('hide'); });
V.addEventListener('error', fail);
V.addEventListener('timeupdate', function () {
  if (!P.it || P.it.live || !V.duration || !isFinite(V.duration)) return;
  if (Date.now() - P.saveT > 5000) { P.saveT = Date.now(); record(P.it, V.currentTime, V.duration); }
  if (!$('posd').classList.contains('off')) drawBar();
});
V.addEventListener('ended', function () {
  if (P.it && !P.it.live) record(P.it, V.duration, V.duration);
  if (P.q && P.i >= 0 && P.i + 1 < P.q.length && !P.it.live) { toast('الحلقة التالية'); step(1); }
});

function drawBar() {
  var b = $('pbar'); if (!b) return;
  if (P.it.live) return;
  var d = V.duration || 0;
  b.style.width = d ? (100 * V.currentTime / d) + '%' : '0';
  $('ptime').innerHTML = '<span>' + dur(V.currentTime) + '</span><span>-' + dur(Math.max(0, d - V.currentTime)) + '</span>';
}
function osd(show) {
  var o = $('posd');
  clearTimeout(P.osdT);
  if (!show) { o.classList.add('off'); return; }
  var it = P.it, c = it.chId && byId(it.chId);
  o.innerHTML = '<div class="ptop"><div class="lg" style="background-image:url(\'' + esc(it.logo) + '\')"></div><div style="flex:1"><div class="t">' + (P.i >= 0 && it.live ? '<span class="muted">' + (P.i + 1) + '</span> ' : '') + esc(it.title) +
    (it.live ? ' <span class="badge" style="position:static">مباشر</span>' : '') + (c && isFav(c.id) ? ' <span style="color:#F7C04F">★</span>' : '') + '</div><div class="s" id="psub">' + esc(it.sub || '') + '</div></div><div class="t" style="font-weight:400">' + hhmm(new Date()) + '</div></div>' +
    '<div class="pbot">' + (it.live ? '<div id="pnext"></div>' : '<div class="times" id="ptime"></div><div class="track"><i id="pbar"></i></div>') +
    '<div class="keys"><span><b style="background:#FF5F6D"></b>المفضلة</span><span><b style="background:#58D68D"></b>القنوات</span><span><b style="background:#F7C04F"></b>الصوت</span><span><b style="background:#3D7BFF"></b>مؤقت النوم' + (P.sleep ? ' (' + P.sleep + ' د)' : '') + '</span>' +
    (it.live ? '<span>CH± أو ▲▼ للتنقل · ◀ قائمة القنوات</span>' : '<span>◀ ▶ تقديم وتأخير · OK إيقاف/تشغيل</span>') + '</div></div>';
  o.classList.remove('off');
  if (!it.live) drawBar();
  if (it.live && c) shortEpg(c).then(function (l) {
    if (P.it !== it || !l.length) return;
    var now = new Date(), cur = l[0].a <= now ? l[0] : null, nx = cur ? l[1] : l[0];
    var s = $('psub'), n = $('pnext');
    if (s && cur) s.innerHTML = 'الآن: ' + esc(cur.t) + ' · ' + hhmm(cur.a) + ' – ' + hhmm(cur.b) + '<div class="bar" style="width:30rem"><i style="width:' + Math.round(100 * (now - cur.a) / (cur.b - cur.a)) + '%"></i></div>';
    if (n && nx) n.innerHTML = '<span class="next">التالي ' + hhmm(nx.a) + ': ' + esc(nx.t) + '</span><br><br>';
  });
  P.osdT = setTimeout(function () { o.classList.add('off'); }, 5000);
}
function step(d) {
  if (!P.q) return;
  P.i = (P.i + d + P.q.length) % P.q.length;
  start(P.q[P.i]);
}
function seek(s) {
  if (P.it.live || !V.duration) return;
  V.currentTime = Math.max(0, Math.min(V.duration - 1, V.currentTime + s));
  osd(true);
}
function closePlayer() {
  if (P.it && !P.it.live && V.duration) record(P.it, V.currentTime, V.duration);
  if (P.hls) { P.hls.destroy(); P.hls = null; }
  V.pause(); V.removeAttribute('src'); try { V.load(); } catch (e) {}
  clearTimeout(P.connT);
  $('player').classList.add('hide');
  render(false);
  F.cur = null;
  F.first($('main'));
}
function toggleList() {
  var pl = $('plist');
  if (!pl.classList.contains('hide')) { pl.classList.add('hide'); F.cur = null; return; }
  if (!P.q) return;
  pl.innerHTML = '<h2 style="margin-top:0">القنوات</h2>';
  var start0 = Math.max(0, P.i - 60), slice = P.q.slice(start0, start0 + 160), cur = null;
  slice.forEach(function (it, k) {
    var i = start0 + k;
    var e = el('div', 'li', '<span class="no">' + (i + 1) + '</span><div class="lg" style="background-image:url(\'' + esc(it.logo) + '\')">' + (it.logo ? '' : esc(initial(it.title))) + '</div><span class="n">' + esc(it.title) + '</span>');
    act(e, function () { P.i = i; pl.classList.add('hide'); start(it); });
    if (i === P.i) cur = e;
    pl.appendChild(e);
  });
  pl.classList.remove('hide');
  F.set(cur || pl.querySelector('.f'));
}
function cycleAudio() {
  var t = V.audioTracks;
  if (P.hls && P.hls.audioTracks && P.hls.audioTracks.length > 1) { P.hls.audioTrack = (P.hls.audioTrack + 1) % P.hls.audioTracks.length; toast('الصوت: ' + (P.hls.audioTracks[P.hls.audioTrack].name || P.hls.audioTrack + 1)); return; }
  if (!t || t.length < 2) { toast('مسار صوت واحد متاح'); return; }
  var i = 0; for (var k = 0; k < t.length; k++) if (t[k].enabled) i = k;
  var n = (i + 1) % t.length;
  for (var j = 0; j < t.length; j++) t[j].enabled = j === n;
  toast('الصوت: ' + (t[n].label || t[n].language || n + 1));
}
function cycleSleep() {
  var opts = [0, 30, 60, 90, 120];
  P.sleep = opts[(opts.indexOf(P.sleep) + 1) % opts.length];
  clearTimeout(P.sleepT);
  if (P.sleep) P.sleepT = setTimeout(function () { closePlayer(); toast('توقف التشغيل بمؤقت النوم'); }, P.sleep * 60000);
  toast(P.sleep ? 'مؤقت النوم: ' + P.sleep + ' دقيقة' : 'أُلغي مؤقت النوم');
  osd(true);
}
function digit(d) {
  if (!P.q) return;
  P.digits += d;
  var n = $('pnum'); n.textContent = P.digits; n.classList.remove('hide');
  clearTimeout(P.digT);
  P.digT = setTimeout(function () {
    var num = parseInt(P.digits, 10), idx = -1;
    P.digits = ''; n.classList.add('hide');
    for (var i = 0; i < P.q.length; i++) { var c = byId(P.q[i].chId); if (c && c.no === num) { idx = i; break; } }
    if (idx < 0 && num >= 1 && num <= P.q.length) idx = num - 1;
    if (idx >= 0) { P.i = idx; start(P.q[idx]); } else toast('لا توجد القناة ' + num);
  }, 1300);
}
function playerKey(k) {
  var listOpen = !$('plist').classList.contains('hide');
  if (listOpen) {
    if (k === KEY.BACK || k === KEY.ESC || k === KEY.BS || k === KEY.GREEN || k === KEY.R) { toggleList(); return; }
    if (k === KEY.U) F.move('U'); else if (k === KEY.D) F.move('D'); else if (k === KEY.OK && F.cur) F.cur._act();
    return;
  }
  var live = P.it && P.it.live;
  if (k >= 48 && k <= 57) return digit(String(k - 48));
  switch (k) {
    case KEY.BACK: case KEY.ESC: case KEY.BS:
      if (!$('posd').classList.contains('off') && live) { osd(false); return; }
      return closePlayer();
    case KEY.OK:
      if (!$('pmsg').classList.contains('hide')) return start(P.it);
      if (!live && !$('posd').classList.contains('off')) { V.paused ? V.play() : V.pause(); }
      return osd(true);
    case KEY.PLAY: V.play(); return osd(true);
    case KEY.PAUSE: V.pause(); return osd(true);
    case KEY.PP: V.paused ? V.play() : V.pause(); return osd(true);
    case KEY.STOP: return closePlayer();
    case KEY.CHUP: return live ? step(-1) : step(1);
    case KEY.CHDN: return live ? step(1) : step(-1);
    case KEY.U: return live ? step(-1) : osd(true);
    case KEY.D: return live ? step(1) : osd(true);
    case KEY.L: return live ? toggleList() : seek(-10);
    case KEY.R: return live ? osd(true) : seek(10);
    case KEY.RW: return seek(-30);
    case KEY.FF: return seek(30);
    case KEY.RED: { var c = P.it.chId && byId(P.it.chId); if (c) { toggleFav(c); osd(true); } return; }
    case KEY.GREEN: return toggleList();
    case KEY.YELLOW: return cycleAudio();
    case KEY.BLUE: return cycleSleep();
  }
}

// ———————————— لوحة المفاتيح والريموت ————————————
var exitAt = 0;
document.addEventListener('keydown', function (ev) {
  var k = ev.keyCode;
  var ae = document.activeElement;
  // داخل حقل الكتابة: الأسهم يمين/يسار للنص، وأعلى/أسفل ورجوع للخروج من الحقل
  if (ae && ae.tagName === 'INPUT') {
    if (k === KEY.U || k === KEY.D || k === KEY.BACK || k === KEY.OK || k === KEY.ESC) { ae.blur(); if (k === KEY.U || k === KEY.D) F.move(k === KEY.U ? 'U' : 'D'); ev.preventDefault(); }
    return;
  }
  ev.preventDefault();
  if (!$('player').classList.contains('hide')) return playerKey(k);
  if (!$('layer').classList.contains('hide')) {
    if (k === KEY.BACK || k === KEY.ESC || k === KEY.BS) return closeLayer();
  }
  switch (k) {
    case KEY.L: return F.move('L');
    case KEY.R: return F.move('R');
    case KEY.U: return F.move('U');
    case KEY.D: return F.move('D');
    case KEY.OK: if (F.cur && F.cur._act) F.cur._act(); return;
    case KEY.CHUP: case KEY.CHDN: { var last = ls('last', null); if (last) play(last, null); return; }
    case KEY.BACK: case KEY.ESC: case KEY.BS:
      if (S.stack.length) return go(S.stack.pop(), true);
      if (F.cur && F.cur.parentNode !== $('nav')) { var n = document.querySelector('.ni.on'); if (n) return F.set(n); }
      if (S.view !== 'home') return go('home');
      if (Date.now() - exitAt < 2500) { try { window.close(); } catch (e) {} return; }
      exitAt = Date.now();
      return toast('اضغط رجوع مرة أخرى للخروج');
  }
});
// مؤشر Magic Remote يختفي ويظهر: لا نفقد مكان التركيز
document.addEventListener('webOSMouse', function () {});

// ———————————— البدء ————————————
function boot() {
  buildNav();
  Promise.all(S.sources.map(function (s) {
    return DB.get('ch_' + s.id).then(function (l) {
      if (l && l.length) S.ch[s.id] = l;
      // تحديث يومي في الخلفية، مع إبقاء آخر نسخة ناجحة
      if (!l || !l.length || !s.at || Date.now() - s.at > 86400000) return refresh(s).catch(function () {});
    });
  })).then(function () {
    if (!S.sources.length) { go('lists'); return; }
    go('home');
    var last = ls('last', null);
    if (S.set.autoLast && last) play(last, channels('live').filter(function (c) { return c.g === (byId(last.chId) || {}).g; }).map(itemOf));
  });
  render();
}
boot();
