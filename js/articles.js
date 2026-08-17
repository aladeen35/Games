/* ===== المقالات المتجددة: RSS / NewsAPI مع تخزين مؤقت 24 ساعة ===== */

/* ضعي مفتاح NewsAPI.org هنا لتفعيل جلب الأخبار الصحية (اختياري) */
const NEWSAPI_KEY = "";

/* خلاصات RSS تُجلب عبر rss2json (خدمة مجانية تتجاوز قيود CORS) */
const RSS_FEEDS = [
  "https://www.medicalnewstoday.com/rss/marketing/pregnancy.xml",
  "https://www.sciencedaily.com/rss/health_medicine/pregnancy_and_childbirth.xml",
];

const CACHE_KEY = "hamli_articles_cache";
const CACHE_TTL = 24 * 60 * 60 * 1000; /* تحديث تلقائي كل 24 ساعة */

async function fetchRSS(feedUrl) {
  const api = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(feedUrl);
  const res = await fetch(api);
  if (!res.ok) throw new Error("RSS fetch failed");
  const data = await res.json();
  if (data.status !== "ok") throw new Error("RSS parse failed");
  return data.items.slice(0, 4).map((item) => ({
    title: item.title,
    desc: (item.description || "").replace(/<[^>]+>/g, "").slice(0, 160),
    link: item.link,
    source: data.feed?.title || "مصدر خارجي",
  }));
}

async function fetchNewsAPI() {
  const api = "https://newsapi.org/v2/everything?q=pregnancy%20health%20OR%20maternal%20care&language=en&sortBy=publishedAt&pageSize=6&apiKey=" + NEWSAPI_KEY;
  const res = await fetch(api);
  if (!res.ok) throw new Error("NewsAPI failed");
  const data = await res.json();
  return (data.articles || []).map((a) => ({
    title: a.title,
    desc: (a.description || "").slice(0, 160),
    link: a.url,
    source: a.source?.name || "NewsAPI",
  }));
}

async function loadLiveArticles() {
  /* التخزين المؤقت أولاً */
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    if (cached && Date.now() - cached.ts < CACHE_TTL && cached.items.length) {
      return { items: cached.items, fromCache: true };
    }
  } catch { /* تجاهل كاش تالف */ }

  const sources = NEWSAPI_KEY ? [fetchNewsAPI()] : RSS_FEEDS.map(fetchRSS);
  const results = await Promise.allSettled(sources);
  const items = results.filter((r) => r.status === "fulfilled").flatMap((r) => r.value).slice(0, 8);

  if (items.length) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items }));
  }
  return { items, fromCache: false };
}

function renderLiveArticles(items, fromCache) {
  const grid = document.getElementById("live-articles");
  const status = document.getElementById("live-status");
  if (!items.length) {
    status.textContent = "📡 تعذر جلب المقالات الخارجية حالياً — استمتعي بمقالاتنا المختارة أدناه";
    return;
  }

  status.innerHTML = '<span class="dot">●</span> ';
  status.append(
    fromCache
      ? "مقالات محدثة (من الذاكرة المؤقتة — تتجدد تلقائياً كل 24 ساعة)"
      : "مقالات مجلوبة الآن من مصادر طبية عالمية — تتجدد تلقائياً كل 24 ساعة"
  );

  items.forEach((item) => {
    const a = document.createElement("a");
    a.className = "clipping";
    a.href = item.link;
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML = "<h3></h3><p></p><div class='clip-source'></div>";
    a.querySelector("h3").textContent = item.title;
    a.querySelector("p").textContent = item.desc + "…";
    a.querySelector(".clip-source").textContent = "✂️ " + item.source;
    grid.appendChild(a);
  });
}

if (document.getElementById("live-articles")) {
  loadLiveArticles()
    .then(({ items, fromCache }) => renderLiveArticles(items, fromCache))
    .catch(() => renderLiveArticles([], false));
}
