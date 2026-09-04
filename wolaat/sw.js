/* ولعت — Service Worker: اللعبة تعمل بالكامل دون إنترنت */
const CACHE = 'wolaat-v1';
const CORE = [
  './', './index.html', './manifest.json',
  './cards.js', './game.js', './net.js', './app.js',
  './icon-192.png', './icon-512.png',
  './fonts/baloo-arabic.woff2', './fonts/baloo-latin.woff2',
  './assets/logo.webp', './assets/logo-sm.webp',
  './assets/back-asalni.webp', './assets/back-arkiz.webp',
  './assets/back-salakt.webp', './assets/back-hababa.webp'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* cache-first، ويخزّن ما يُجلب لاحقًا (مثل مكتبة الاتصال عند أول لعب أونلاين) */
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).then((res) => {
      if (res.ok && (res.type === 'basic' || res.type === 'cors')) {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
      }
      return res;
    }).catch(() => {
      if (e.request.mode === 'navigate') return caches.match('./index.html');
    }))
  );
});
