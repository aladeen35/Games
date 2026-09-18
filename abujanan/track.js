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

  async function paintVisits(){
    if(!document.getElementById('visitCount') && !document.getElementById('visitCountries')) return;
    try{
      const r = await window.ajRest('site_stats_totals?select=total,countries');
      if(!r.ok) throw 0;
      const [s] = await r.json();
      if(!s) throw 0;
      setAll(['visitCount'], AR(s.total));
      setAll(['visitCountries'], AR(s.countries));
    }catch(e){ setAll(['visitCount','visitCountries'], '—'); }
  }
  async function paintDownloads(){
    if(!document.getElementById('dlWin') && !document.getElementById('dlAnd')) return;
    try{
      const r = await window.ajRest('site_stats_downloads?select=kind,total');
      if(!r.ok) throw 0;
      const rows = await r.json();
      const by = k => { const x = rows.find(v => v.kind === k); return x ? x.total : 0; };
      setAll(['dlWin','dlWin2'], AR(by('windows')));
      setAll(['dlAnd','dlAnd2'], AR(by('android')));
    }catch(e){ setAll(['dlWin','dlWin2','dlAnd','dlAnd2'], '—'); }
  }
  window.ajPaintDownloads = paintDownloads;

  function start(){
    paintVisits(); paintDownloads();
    track().then(() => { paintVisits(); paintDownloads(); });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
