/* ===== حاسبة حملي — Service Worker ===== */

const CACHE_NAME = "hamli-v1";

/* هيكل التطبيق: يُخزن كاملاً عند التثبيت ليعمل دون إنترنت */
const APP_SHELL = [
  "./",
  "./index.html",
  "./calculator.html",
  "./weeks.html",
  "./tools.html",
  "./health.html",
  "./community.html",
  "./css/style.css",
  "./js/app.js",
  "./js/family.js",
  "./js/weeks.js",
  "./js/tools.js",
  "./js/articles.js",
  "./fonts/NotoKufiArabic-Regular.ttf",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./manifest.webmanifest",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;

  /* المقالات الخارجية: الشبكة أولاً (لها كاش 24 ساعة خاص بها في localStorage) */
  if (url.origin !== location.origin) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  /* ملفات التطبيق: الكاش أولاً مع تحديث بالخلفية (stale-while-revalidate) */
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const refresh = fetch(event.request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || refresh;
    })
  );
});
