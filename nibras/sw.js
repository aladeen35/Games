/* نِبراس — Service Worker: يعمل التطبيق كاملًا دون إنترنت بعد أول تحميل */
const CACHE = 'nibras-v5';
const CORE = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './icon-maskable.png',
  './fonts/thmanyah-serif-text-bold.otf', './fonts/brygada1918-bold.woff2',
  './vendor/kubai-icons.js',
  ...['i18n', 'curriculum-data', 'content', 'core', 'icons', 'visuals', 'games', 'games2', 'app'].map(n => `./js/${n}.js`)];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(CORE.map(u => c.add(u)))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('nibras-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(res => {
    if (res.ok && res.type === 'basic') { const c = res.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); }
    return res;
  }).catch(() => caches.match(e.request).then(r => r || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined))));
});
