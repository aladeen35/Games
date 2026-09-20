/* ============================================================
   ألعاب أبو جنان — تتبّع الزوار والتحميلات (Supabase)
   يسجّل زيارة واحدة لكل جلسة، وضغطة كل زر تحميل.
   لا يُخزَّن عنوان IP ولا أي بيانات شخصية.
   ============================================================ */
(function(){
  'use strict';
  window.AJ_SB_URL = 'https://gqjoyzjejyeibbmejcoo.supabase.co';
  window.AJ_SB_KEY = 'sb_publishable_cudHlqS-PCF2-z3kFrai6w_pI6h3RtU';
  const GEO_KEY = 'aj_geo';

  const headers = extra => Object.assign({
    apikey: window.AJ_SB_KEY,
    Authorization: 'Bearer ' + window.AJ_SB_KEY,
  }, extra || {});

  window.ajRest = (pathAndQuery, extraHeaders) =>
    fetch(window.AJ_SB_URL + '/rest/v1/' + pathAndQuery,
          { headers: headers(Object.assign({ Accept: 'application/json' }, extraHeaders || {})) });

  const ajInsert = (table, row) =>
    fetch(window.AJ_SB_URL + '/rest/v1/' + table, {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json', Prefer: 'return=minimal' }),
      body: JSON.stringify(row),
    });
  window.ajInsert = ajInsert;

  function deviceKind(){
    const ua = navigator.userAgent || '';
    if(/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'جهاز لوحي';
    if(/Android/i.test(ua))            return 'أندرويد';
    if(/iPhone|iPod/i.test(ua))        return 'آيفون';
    if(/Windows/i.test(ua))            return 'ويندوز';
    if(/Macintosh|Mac OS X/i.test(ua)) return 'ماك';
    if(/Linux/i.test(ua))              return 'لينكس';
    return 'غير معروف';
  }
  function referrerHost(){
    try{
      if(!document.referrer) return '';
      const h = new URL(document.referrer).hostname;
      return h === location.hostname ? '' : h;
    }catch(e){ return ''; }
  }
  async function geo(){
    try{ const c = sessionStorage.getItem(GEO_KEY); if(c) return JSON.parse(c); }catch(e){}
    const tries = [
      ['https://get.geojs.io/v1/ip/geo.json', j => ({cc:j.country_code, cn:j.country, city:j.city, region:j.region})],
      ['https://ipwho.is/',                   j => ({cc:j.country_code, cn:j.country, city:j.city, region:j.region})],
      ['https://ipapi.co/json/',              j => ({cc:j.country_code, cn:j.country_name, city:j.city, region:j.region})],
    ];
    let g = {};
    for(const [url, pick] of tries){
      try{
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), 4500);
        const r = await fetch(url, {signal: ctl.signal});
        clearTimeout(t);
        if(!r.ok) continue;
        const v = pick(await r.json());
        if(v && v.cc){ g = v; break; }
      }catch(e){}
    }
    try{ sessionStorage.setItem(GEO_KEY, JSON.stringify(g)); }catch(e){}
    return g;
  }
  window.ajGeo = geo;

  /* ---------- زيارة ---------- */
  async function track(){
    try{
      if(sessionStorage.getItem('aj_tracked')) return;
      sessionStorage.setItem('aj_tracked','1');
    }catch(e){}
    const g = await geo();
    try{
      await ajInsert('site_visits', {
        country_code: (g.cc||'').slice(0,4),
        country_name: (g.cn||'').slice(0,80),
        city:         (g.city||'').slice(0,80),
        region:       (g.region||'').slice(0,80),
        referrer:     referrerHost().slice(0,120),
        device:       deviceKind(),
        lang:         (navigator.language||'').slice(0,12),
        path:         location.pathname.slice(0,120),
      });
    }catch(e){}
  }

  /* ---------- تحميل ---------- */
  window.ajLogDownload = async function(kind){
    const g = await geo();
    try{
      await ajInsert('site_downloads', {
        kind: kind,
        country_code: (g.cc||'').slice(0,4),
        country_name: (g.cn||'').slice(0,80),
        city:         (g.city||'').slice(0,80),
        device:       deviceKind(),
      });
    }catch(e){}
    paintDownloads();
  };

  const AR = n => Number(n||0).toLocaleString('ar-EG');
  const setAll = (ids, text) => ids.forEach(id => { const el = document.getElementById(id); if(el) el.textContent = text; });

  const V_IDS = ['visitCount','visitCount2'], C_IDS = ['visitCountries','visitCountries2'];
  async function paintVisits(){
    if(!document.getElementById('visitCount') && !document.getElementById('visitCountries')) return;
    try{
      const r = await window.ajRest('site_stats_totals?select=total,countries');
      if(!r.ok) throw 0;
      const [s] = await r.json();
      if(!s) throw 0;
      setAll(V_IDS, AR(s.total));
      setAll(C_IDS, AR(s.countries));
    }catch(e){ setAll(V_IDS.concat(C_IDS), '—'); }
  }
  async function paintDownloads(){
    if(!document.getElementById('dlWin') && !document.getElementById('dlAnd')) return;
    try{
      const r = await window.ajRest('site_stats_downloads?select=kind,total');
      if(!r.ok) throw 0;
      const rows = await r.json();
      const by = k => { const x = rows.find(v => v.kind === k); return x ? +x.total : 0; };
      const w = by('windows'), a = by('android');
      setAll(['dlWin','dlWin2'], AR(w));
      setAll(['dlAnd','dlAnd2'], AR(a));
      setAll(['kpiDl'], AR(w + a));
    }catch(e){ setAll(['dlWin','dlWin2','dlAnd','dlAnd2','kpiDl'], '—'); }
  }
  window.ajPaintDownloads = paintDownloads;

  function start(){
    paintVisits(); paintDownloads();
    track().then(() => { paintVisits(); paintDownloads(); });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

/* ============================================================
   تقييمات اللاعبين — قراءة المعتمَد، وإرسال رأي جديد للمراجعة،
   وشريط سفلي متحرّك يعرض الآراء.
   ============================================================ */
(function(){
  'use strict';
  const AR = n => Number(n||0).toLocaleString('ar-EG');
  const esc = s => String(s==null?'':s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  window.ajEsc = esc;

  window.ajFlag = cc => (!cc || !/^[A-Za-z]{2}$/.test(cc)) ? ''
    : String.fromCodePoint(...[...cc.toUpperCase()].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));

  window.ajStars = (n, size) => {
    const full = Math.round(Number(n)||0);
    let h = '<span class="stars"' + (size ? ' style="font-size:'+size+'"' : '') + '>';
    for(let i=1;i<=5;i++) h += '<i class="'+(i<=full?'on':'')+'">★</i>';
    return h + '</span>';
  };

  window.ajReviews = async function(game, limit){
    const q = 'site_reviews_public?select=*&limit=' + (limit||30) +
              (game && game!=='all' ? '&game=eq.'+encodeURIComponent(game) : '');
    const r = await window.ajRest(q);
    if(!r.ok) throw new Error('reviews ' + r.status);
    return r.json();
  };
  window.ajReviewStats = async function(){
    const r = await window.ajRest('site_reviews_stats?select=*');
    if(!r.ok) throw new Error('stats ' + r.status);
    const rows = await r.json();
    const by = {}; rows.forEach(x => by[x.game] = x);
    const all = rows.reduce((a,x) => { a.n += +x.n; a.sum += (+x.avg) * (+x.n); return a; }, {n:0, sum:0});
    by.__all = {n: all.n, avg: all.n ? (all.sum/all.n) : 0};
    return by;
  };
  window.ajSendReview = async function(game, name, stars, body){
    const g = await window.ajGeo();
    const r = await window.ajInsert('site_reviews', {
      game: game || 'all',
      name: String(name||'').trim().slice(0,40),
      stars: Math.max(1, Math.min(5, stars|0)),
      body: String(body||'').trim().slice(0,600) || null,
      country_code: (g.cc||'').slice(0,4),
      country_name: (g.cn||'').slice(0,80),
    });
    return r.ok;
  };

  /* ---------- الشريط السفلي المتحرّك ---------- */
  const GAME_AR = {all:'التطبيق', nut:'نط الكلب', sija:'صفرجت', seega:'السيجة الكبرى',
                   wbjn:'ولد بنت جماد نبات', kz:'كوز جوز لوز موز', mn:'أنا مِنو',
                   ludo:'ولِيدو', snake:'السلم والثعبان'};
  window.ajGameName = k => GAME_AR[k] || k;

  window.ajTicker = async function(){
    const bar = document.getElementById('ticker');
    if(!bar) return;
    const track = bar.querySelector('.tkTrack');
    let rows = [];
    try{ rows = await window.ajReviews('all', 25); }catch(e){}
    if(!rows.length){ bar.classList.remove('show'); return; }
    const item = r => '<span class="tkItem">' + window.ajStars(r.stars) +
      '<b>' + esc(r.name) + '</b>' +
      (r.country_code && r.country_code!=='??' ? '<em>' + window.ajFlag(r.country_code) + '</em>' : '') +
      (r.body ? '<span class="tkTxt">«' + esc(r.body) + '»</span>' : '') +
      '<i class="tkG">' + esc(window.ajGameName(r.game)) + '</i></span>';
    const html = rows.map(item).join('');
    track.innerHTML = html + html;                       // نسختان لدوران بلا انقطاع
    const secs = Math.max(26, rows.length * 7);
    track.style.animationDuration = secs + 's';
    bar.classList.add('show');
    document.body.classList.add('hasTicker');
  };
})();
