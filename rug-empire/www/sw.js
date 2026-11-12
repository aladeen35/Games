// Offline cache for the PWA build. Bump CACHE on every release.
const CACHE = 'rug-empire-1.0.0';
const FILES = ['./', 'index.html', 'style.css', 'game.js', 'logo.webp', 'manifest.json', 'icon-192.png', 'icon-512.png',
  'fonts/cairo-arabic-400-normal.woff2', 'fonts/cairo-arabic-700-normal.woff2', 'fonts/cairo-arabic-900-normal.woff2',
  'fonts/cairo-latin-400-normal.woff2', 'fonts/cairo-latin-700-normal.woff2', 'fonts/cairo-latin-900-normal.woff2'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => { if (e.request.method !== 'GET') return; e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request))); });
