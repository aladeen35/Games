/* نط الكلب — service worker: يجعل اللعبة تعمل بلا إنترنت (الوضع المحلي) */
const CACHE = 'nut-alkalb-v4';
const PRECACHE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/logo.png',
  'assets/backdrop.jpg',
  'assets/favicon.png',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/icon-maskable-512.png',
  'assets/sand.jpg',
  'assets/font-kufi.ttf',
  'assets/music.mp3',
  'assets/dog-star.png',
  'assets/dog-spiral.png',
  'assets/dog-diamond.png',
  'assets/dog-circle.png',
  'assets/dog-wave.png',
  'assets/dog-square.png',
  'assets/snd/p1.wav',
  'assets/snd/p2.wav',
  'assets/snd/p3.wav',
  'assets/snd/o1.wav',
  'assets/snd/o2.wav',
  'assets/snd/o3.wav',
  'assets/snd/die.wav',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if(url.origin !== location.origin) return;   // PeerJS/CDN: شبكة مباشرة دائماً
  e.respondWith(
    caches.match(e.request, {ignoreSearch:true}).then(hit => hit ||
      fetch(e.request).then(res => {
        if(res.ok && e.request.method === 'GET'){
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => e.request.mode === 'navigate' ? caches.match('index.html') : undefined)
    )
  );
});
