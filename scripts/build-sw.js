#!/usr/bin/env node
/* يولّد sw.js بقائمة كل ملفات التطبيق (الرئيسية + الألعاب) للعمل الكامل دون إنترنت */
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');

/* يسرد صور بطاقات «أنا منو» المرفقة مع التطبيق: slug → اسم الملف */
(function cardsManifest() {
  const dir = path.join(root, 'games/anamenu/cards');
  if (!fs.existsSync(dir)) return;
  const map = {};
  for (const f of fs.readdirSync(dir)) {
    const m = /^(.+)\.(png|jpg|jpeg|webp)$/i.exec(f);
    if (m) map[m[1]] = f;
  }
  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(map, null, 2) + '\n');
  console.log('cards/manifest.json:', Object.keys(map).length, 'صورة');
})();
const SKIP = /(^|\/)(README\.md|src|\.git|node_modules|android|www|scripts|\.github)(\/|$)/;
const files = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f), rel = path.relative(root, p).split(path.sep).join('/');
    if (SKIP.test(rel) || f.startsWith('.') || f === 'sw.js' || f === 'package.json' || f === 'package-lock.json' || f === 'capacitor.config.json') continue;
    if (fs.statSync(p).isDirectory()) walk(p); else files.push('./' + rel);
  }
})(root);
files.sort();
const version = 'abujanan-' + new Date().toISOString().slice(0, 10) + '-' + files.length;
const sw = `/* ألعاب أبو جنان — Service Worker (مولَّد بواسطة scripts/build-sw.js) */
const CACHE = '${version}';
const ASSETS = ${JSON.stringify(['./', ...files], null, 0).replace(/","/g, '",\n  "').replace('["', '[\n  "').replace('"]', '"\n]')};

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(ASSETS.map((a) => c.add(a)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
/* cache-first، والشبكة احتياطًا مع تخزين ما يُجلب لاحقًا */
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok && (res.type === 'basic' || res.type === 'cors')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
      return res;
    }).catch(() => { if (e.request.mode === 'navigate') return caches.match('./index.html'); }))
  );
});
`;
fs.writeFileSync(path.join(root, 'sw.js'), sw);
console.log('sw.js:', files.length, 'files,', version);
