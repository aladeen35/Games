/* نط الكلب — service worker: يجعل اللعبة تعمل بلا إنترنت (الوضع المحلي) */
const CACHE = 'nut-alkalb-v14';
const PRECACHE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'assets/logo.png',
  'assets/sufraget-logo.png',
  'assets/seega-logo.png',
  'assets/wbjn-logo.png',
  'assets/kz-logo.png',
  'assets/mino-logo.png',
  'assets/backdrop.jpg',
  'assets/favicon.png',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/icon-maskable-512.png',
  'assets/sand.jpg',
  'assets/font-kufi.ttf',
  'assets/music.mp3',
  'assets/net-supabase.mjs',
  'assets/three.mjs',
  'assets/board3d.mjs',
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
  'assets/mino/1.jpg',
  'assets/mino/2.jpg',
  'assets/mino/3.jpg',
  'assets/mino/4.jpg',
  'assets/mino/5.jpg',
  'assets/mino/6.jpg',
  'assets/mino/7.jpg',
  'assets/mino/8.jpg',
  'assets/mino/9.jpg',
  'assets/mino/10.jpg',
  'assets/mino/11.jpg',
  'assets/mino/12.jpg',
  'assets/mino/13.jpg',
  'assets/mino/14.jpg',
  'assets/mino/15.jpg',
  'assets/mino/16.jpg',
  'assets/mino/17.jpg',
  'assets/mino/18.jpg',
  'assets/mino/19.jpg',
  'assets/mino/20.jpg',
  'assets/mino/21.jpg',
  'assets/mino/22.jpg',
  'assets/mino/23.jpg',
  'assets/mino/24.jpg',
  'assets/mino/25.jpg',
  'assets/mino/26.jpg',
  'assets/mino/27.jpg',
  'assets/mino/28.jpg',
  'assets/mino/29.jpg',
  'assets/mino/30.jpg',
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
