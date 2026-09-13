/* ألعاب أبو جنان — Service Worker (مولَّد بواسطة scripts/build-sw.js) */
const CACHE = 'abujanan-2026-09-13-49';
const ASSETS = [
  "./",
  "./docs/screens/anamenu-card.jpg",
  "./docs/screens/bt-anamenu.jpg",
  "./docs/screens/bt-bell.jpg",
  "./docs/screens/bt-wolaat.jpg",
  "./docs/screens/hub.jpg",
  "./games/anamenu/cards.js",
  "./games/anamenu/cards/manifest.json",
  "./games/anamenu/index.html",
  "./games/bell/icons/apple-touch-icon.png",
  "./games/bell/icons/icon-192.png",
  "./games/bell/icons/icon-512.png",
  "./games/bell/icons/icon-maskable-512.png",
  "./games/bell/index.html",
  "./games/bell/manifest.webmanifest",
  "./games/colors/icon-192.png",
  "./games/colors/icon-512.png",
  "./games/colors/index.html",
  "./games/colors/manifest.json",
  "./games/colors/vendor/pdf.min.js",
  "./games/colors/vendor/pdf.worker.min.js",
  "./games/khartoum/assets/logo.svg",
  "./games/khartoum/index.html",
  "./games/khartoum/js/game.js",
  "./games/khartoum/lib/three.min.js",
  "./games/wolaat/app.js",
  "./games/wolaat/assets/back-arkiz.webp",
  "./games/wolaat/assets/back-asalni.webp",
  "./games/wolaat/assets/back-hababa.webp",
  "./games/wolaat/assets/back-salakt.webp",
  "./games/wolaat/assets/logo-sm.webp",
  "./games/wolaat/assets/logo.webp",
  "./games/wolaat/cards.js",
  "./games/wolaat/game.js",
  "./games/wolaat/icon-192.png",
  "./games/wolaat/icon-512.png",
  "./games/wolaat/index.html",
  "./games/wolaat/manifest.json",
  "./games/wolaat/net.js",
  "./games/wolaat/vendor/peerjs.min.js",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/logo.png",
  "./index.html",
  "./manifest.webmanifest",
  "./shared/abujanan.js",
  "./shared/fonts/baloo-arabic.woff2",
  "./shared/fonts/baloo-latin.woff2"
];

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
