/* ============================================================
   ألعاب أبو جنان — تتبّع الزوار (Supabase)
   يسجّل زيارة واحدة لكل جلسة: الدولة والمدينة والجهاز والمصدر.
   لا يُخزَّن عنوان IP ولا أي بيانات شخصية.
   ============================================================ */
(function(){
  'use strict';
  window.AJ_SB_URL = 'https://gqjoyzjejyeibbmejcoo.supabase.co';
  window.AJ_SB_KEY = 'sb_publishable_cudHlqS-PCF2-z3kFrai6w_pI6h3RtU';

  window.ajRest = function(pathAndQuery, extraHeaders){
    return fetch(window.AJ_SB_URL + '/rest/v1/' + pathAndQuery, {
      headers: Object.assign({
        apikey: window.AJ_SB_KEY,
        Authorization: 'Bearer ' + window.AJ_SB_KEY,
        Accept: 'application/json',
      }, extraHeaders || {}),
    });
  };

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
    const tries = [
      ['https://get.geojs.io/v1/ip/geo.json', j => ({cc:j.country_code, cn:j.country, city:j.city, region:j.region})],
      ['https://ipwho.is/',                   j => ({cc:j.country_code, cn:j.country, city:j.city, region:j.region})],
      ['https://ipapi.co/json/',              j => ({cc:j.country_code, cn:j.country_name, city:j.city, region:j.region})],
    ];
    for(const [url, pick] of tries){
      try{
        const ctl = new AbortController();
        const t = setTimeout(()=>ctl.abort(), 4500);
        const r = await fetch(url, {signal: ctl.signal});
        clearTimeout(t);
        if(!r.ok) continue;
        const g = pick(await r.json());
        if(g && g.cc) return g;
      }catch(e){}
    }
    return {};
  }
  async function track(){
    try{
      if(sessionStorage.getItem('aj_tracked')) return;
      sessionStorage.setItem('aj_tracked','1');
    }catch(e){}
    const g = await geo();
    const row = {
      country_code: (g.cc||'').slice(0,4),
      country_name: (g.cn||'').slice(0,80),
      city:         (g.city||'').slice(0,80),
      region:       (g.region||'').slice(0,80),
      referrer:     referrerHost().slice(0,120),
      device:       deviceKind(),
      lang:         (navigator.language||'').slice(0,12),
      path:         location.pathname.slice(0,120),
    };
    try{
      await fetch(window.AJ_SB_URL + '/rest/v1/site_visits', {
        method:'POST',
        headers:{
          apikey: window.AJ_SB_KEY,
          Authorization: 'Bearer ' + window.AJ_SB_KEY,
          'Content-Type':'application/json',
          Prefer:'return=minimal',
        },
        body: JSON.stringify(row),
      });
    }catch(e){}
    window.dispatchEvent(new Event('aj-tracked'));
  }

  /* شارة عدّاد الزوار في الصفحة (إن وُجد العنصر) */
  async function paintBadge(){
    const el = document.getElementById('visitCount');
    const cel = document.getElementById('visitCountries');
    if(!el && !cel) return;
    try{
      const r = await window.ajRest('site_stats_totals?select=total,countries');
      if(!r.ok) throw 0;
      const [s] = await r.json();
      if(!s) throw 0;
      if(el)  el.textContent  = Number(s.total||0).toLocaleString('ar-EG');
      if(cel) cel.textContent = Number(s.countries||0).toLocaleString('ar-EG');
    }catch(e){
      if(el)  el.textContent  = '—';
      if(cel) cel.textContent = '—';
    }
  }

  if(document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', () => { track().then(paintBadge); });
  else track().then(paintBadge);
  window.addEventListener('aj-tracked', () => setTimeout(paintBadge, 600));
})();
