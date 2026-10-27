/* ألعاب أثير وبشرى — Service Worker للعمل دون إنترنت */
const CACHE = 'atheer-games-v10';
const CORE = [
  './', './index.html', './manifest.json', './logo.jpg',
  './icon-192.png', './icon-512.png', './icon-maskable.png',
  './voice/index.js', './voice/phrases.js', './fonts/baloo-arabic.woff2', './fonts/baloo-latin.woff2', './img/albushra.jpg',
  ...[1, 2, 3, 4, 5, 6, 7].map(n => `./img/photos/p${n}.jpg`),
  ...['gsap', 'Flip', 'CustomEase', 'Draggable', 'MotionPathPlugin', 'Physics2DPlugin'].map(n => `./js/vendor/${n}.min.js`),
  ...['edition', 'core', 'jump', 'cosmos', 'chalk', 'blocks', 'bubbles', 'balls', 'shapes', 'candy', 'memory', 'tubes', 'snake', 'slide', 'butterfly', 'letters', 'numbers', 'maze', 'diff', 'taxi', 'cake', 'harakat', 'wordtrain', 'arpuzzle', 'enpuzzle', 'opposites', 'tower', 'penguins', 'numpuzzle', 'balance', 'fractions', 'pattern', 'shadows', 'mothers', 'sudanmap', 'duas', 'studio', 'pegs', 'magicpad', 'rings', 'woodblocks', 'abacus', 'piggybank', 'locks', 'traffic', 'body', 'jobs', 'seasons', 'lifecycle', 'wudu', 'stories'].map(n => `./js/${n}.js`)
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(CORE.map(u => c.add(u)))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('atheer-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

/* الشبكة أولًا للملفات (كي تصل التحديثات)، ثم النسخة المخزّنة عند انقطاع الإنترنت */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok && res.type === 'basic') { const clone = res.clone(); caches.open(CACHE).then(c => c.put(e.request, clone)); }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || (e.request.mode === 'navigate' ? caches.match('./index.html') : undefined)))
  );
});
