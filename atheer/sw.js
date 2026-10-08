/* ألعاب أثير — Service Worker للعمل دون إنترنت */
const CACHE = 'atheer-games-v1';
const CORE = [
  './', './index.html', './manifest.json', './logo.jpg',
  './icon-192.png', './icon-512.png', './icon-maskable.png',
  './fonts/baloo-arabic.woff2', './fonts/baloo-latin.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(CORE.map(u => c.add(u)))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('atheer-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok && res.type === 'basic') { const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); }
      return res;
    }).catch(() => { if (e.request.mode === 'navigate') return caches.match('./index.html'); }))
  );
});
