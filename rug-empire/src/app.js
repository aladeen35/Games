// App shell: boot, settings, menus, business hub, showroom. Cleaning itself lives in session.js.
import { ECON, TOOLS, GEAR, CHEMS, CHEM_IDS, ARCHETYPES, NAMES, MATERIALS, SKILLS, RANKS, BRAND_PALETTES, SIZES } from './content.js';
import * as G from './state.js';
import { createRug } from './sim.js';
import { createScene } from './scene.js';
import { rugCanvas, logoCanvas, LOGO_ICONS } from './patterns.js';
import { t, d, num, sdg, L, setLang, dateStr, plural, LANGS } from './i18n.js';
import { h, $, modal, toast, bar } from './dom.js';
import { initAudio, resumeAudio, setSound, sfx } from './audio.js';
import { startJob, frame, frameTimelapse, pointer, playTimelapse, closeTimelapse, speech, beforeAfter, activeSession } from './session.js';

const SET_KEY = 'rugempire.settings', GAL_KEY = 'rugempire.gallery', REP_KEY = 'rugempire.replay.';
const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); return true; } catch { return false; } }, del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } } };
const ACHS = ['first', 'five', 'ten', 'shop', 'sold', 'master'];

export const app = {
  state: null, scene: null, mode: 'menu', tab: 'orders', lastReplay: null,
  settings: { ui: 'ar', dlg: 'ar-SD', sub: 'off', digits: 'latn', sound: true, quality: 1, coach: true, first: true },
  saveSettings() { store.set(SET_KEY, JSON.stringify(app.settings)); },
  saveGame() { if (app.state) G.save(app.state, localStorage); },
  dateLabel(date) { const x = dateStr(date); return x.h ? `${x.g} • ${x.h}` : x.g; },
  matLabel(job) { return job.inspected || G.skill(app.state, 'fibre') || G.has(app.state, 'loupe') ? t('mat.' + job.spec.material) : t(MATERIALS[job.spec.material].delicate || job.spec.material === 'cotton' ? 'matguess.nat' : 'matguess.syn'); },
  gallery() { try { return JSON.parse(store.get(GAL_KEY) || '[]'); } catch { return []; } },
  setGallery(g) { while (!store.set(GAL_KEY, JSON.stringify(g)) && g.length > 1) g.splice(g.findIndex((x) => x.score.stars < 5) >= 0 ? g.findIndex((x) => x.score.stars < 5) : 0, 1); },
  // Every finished rug with 3+ stars is kept for the showroom (CompletedRug in docs/05).
  addGallery(job, score, rug, before, after, rec, late) {
    if (score.stars < 3) return null;
    const s = app.state, date = G.dateOf(s.day), g = app.gallery();
    const e = { id: 'r' + Date.now().toString(36), seed: job.spec.seed, spec: job.spec, pattern: job.spec.pattern, material: job.spec.material,
      sizeCm: { w: Math.round(job.spec.w * 100), h: Math.round(job.spec.h * 100) }, ownership: job.own ? 'owned' : 'customer', rugId: job.rugId || null,
      before, after, score: { total: score.total, stars: score.stars, clean: score.clean, safety: score.safety, coverage: score.coverage, time: score.time, resources: score.moisture, instr: score.instr, site: score.site },
      stats: { minutes: Math.round(rug.time / 6) / 10, waterL: Math.round(rug.stats.waterL), late },
      customer: job.own ? null : { g: job.g, name: job.name, arch: job.arch },
      completedAt: { gameDay: s.day, season: G.seasonOf(s.day), gregorian: date.toISOString().slice(0, 10), hijri: G.hijri(date) }, status: 'gallery' };
    g.push(e); while (g.length > 36) g.splice(g.findIndex((x) => x.score.stars < 5), 1);
    app.setGallery(g);
    const json = JSON.stringify(rec);
    if (json.length < 400000 && store.set(REP_KEY + e.id, json)) {
      const ids = g.filter((x) => store.get(REP_KEY + x.id)).map((x) => x.id);
      while (ids.length > 4) store.del(REP_KEY + ids.shift());
    }
    return e;
  },
  download(blob, name) {
    if (window.AndroidBridge && window.AndroidBridge.saveFile) {
      const fr = new FileReader(); fr.onload = () => { try { window.AndroidBridge.saveFile(String(fr.result).split(',')[1], name, blob.type); } catch { toast(t('tl.unsupported'), 'warn'); } }; fr.readAsDataURL(blob); return;
    }
    const a = h('a', { href: URL.createObjectURL(blob), download: name }); document.body.append(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
  },
  checkAchievements() {
    const s = app.state, a = s.ach, got = (k) => { if (!a[k]) { a[k] = s.day; toast('🏆 ' + t('ach.' + k), 'good', 4500); sfx.good(); } };
    if (s.stats.jobs >= 1) got('first'); if (s.stats.bestScore >= 95) got('five'); if (s.stats.jobs >= 10) got('ten');
    if (s.premises !== 'home') got('shop'); if (s.stats.sold >= 1) got('sold'); if (G.rank(s) >= 6) got('master');
  },
  showHub(tab) { app.mode = 'hub'; if (tab) app.tab = tab; hub(); },
};

// ---- boot ---------------------------------------------------------------------------------------
export function boot() {
  try { Object.assign(app.settings, JSON.parse(store.get(SET_KEY) || '{}')); } catch { /* defaults */ }
  setLang(app.settings); setSound(app.settings.sound);
  const canvas = $('#gl');
  try { app.scene = createScene(canvas); app.scene.setQuality(app.settings.quality); } catch (err) { $('#ui').replaceChildren(h('div.panel', h('h2', 'WebGL'), h('p', String(err)))); return; }
  addEventListener('resize', () => app.scene.resize());
  const pe = (type) => (e) => { if (app.mode !== 'clean') return; if (type === 'down') { resumeAudio(); canvas.setPointerCapture(e.pointerId); } pointer(type, e.clientX, e.clientY); e.preventDefault(); };
  canvas.addEventListener('pointerdown', pe('down')); canvas.addEventListener('pointermove', pe('move'));
  canvas.addEventListener('pointerup', pe('up')); canvas.addEventListener('pointercancel', pe('up'));
  document.addEventListener('pointerdown', () => { initAudio(); resumeAudio(); }, { once: false, passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) app.saveGame(); });
  window.onAndroidBack = () => {
    const m = document.querySelector('.modal-wrap'); if (m) { m.remove(); const ses = activeSession(); if (ses) ses.paused = false; return true; }
    if (app.mode === 'timelapse') { closeTimelapse(); return true; }
    if (app.mode === 'hub' || app.mode === 'showroom' || app.mode === 'settings') { menu(); return true; }
    return app.mode !== 'menu';
  };
  let last = performance.now(), slow = 0;
  const loop = (now) => {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (app.mode === 'clean' || app.mode === 'drying' || app.mode === 'result' || app.mode === 'timelapse' || app.mode === 'show3d') {
      try { if (app.mode === 'timelapse') frameTimelapse(); else frame(dt); app.scene.render(dt); } catch (err) { console.error(err); }
      // adaptive quality: step down if the device cannot hold ~30 fps while cleaning
      if (app.mode === 'clean') { slow = dt > 0.045 ? slow + 1 : Math.max(0, slow - 2); if (slow > 90 && app.scene.quality > 0) { slow = 0; app.settings.quality = app.scene.quality - 1; app.scene.setQuality(app.settings.quality); app.saveSettings(); } }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  app.settings.first ? langScreen() : menu();
}

function langScreen() {
  app.mode = 'menu';
  const pick = (ui, dlg, sub) => { Object.assign(app.settings, { ui, dlg, sub, first: false }); setLang(app.settings); app.saveSettings(); menu(); };
  $('#ui').replaceChildren(h('div.panel.menu', h('img.logo', { src: 'logo.webp', alt: 'Rug Empire' }), h('h2', 'اختر اللغة • Choose language'),
    h('button.btn', { onclick: () => pick('ar', 'ar-SD', 'off') }, 'العربية + حوار سوداني'),
    h('button.btn', { onclick: () => pick('ar-SD', 'ar-SD', 'off') }, 'سوداني كامل'),
    h('button.btn', { onclick: () => pick('ar', 'ar', 'off') }, 'العربية الفصحى'),
    h('button.btn', { onclick: () => pick('en', 'ar-SD', 'en') }, 'English + Sudanese dialogue (subtitled)'),
    h('button.btn', { onclick: () => pick('en', 'en', 'off') }, 'English')));
}

function menu() {
  app.mode = 'menu'; const saved = G.load(localStorage);
  const go = (s) => { app.state = s; app.saveGame(); app.showHub('orders'); if (s.stats.jobs === 0 && s.day === 1) intro(); };
  $('#ui').replaceChildren(h('div.panel.menu', h('img.logo', { src: 'logo.webp', alt: 'Rug Empire' }),
    saved ? h('button.btn', { onclick: () => go(saved) }, t('menu.continue')) : null,
    h('button.btn' + (saved ? '.ghost' : ''), { onclick: () => {
      if (!saved) return go(G.newGame());
      const m = modal([h('h3', t('menu.newq')), h('p', t('menu.newwarn')), h('div.row', h('button.btn.ghost', { onclick: () => m.close() }, t('cancel')), h('button.btn', { onclick: () => { m.close(); go(G.newGame()); } }, t('menu.start')))]);
    } }, saved ? t('menu.new') : t('menu.start')),
    h('button.btn.ghost', { onclick: () => showroom('work') }, '🖼 ' + t('menu.showroom')),
    h('button.btn.ghost', { onclick: settings }, '⚙ ' + t('menu.settings')),
    h('small.muted', t('menu.note'))), h('div#toasts.toasts'));
}
function intro() {
  const m = modal([h('h3', t('intro.title')), h('div.speech', h('span.av', '👳🏾‍♂️'), h('div', h('small', t('npc.tayeb')), (() => { const l = d('intro.tayeb'); return [h('p', { dir: l.rtl ? 'rtl' : 'ltr' }, l.text), l.sub ? h('p.sub', l.sub) : null]; })())),
    h('p', t('intro.body')), h('button.btn', { onclick: () => m.close() }, t('intro.go'))]);
}

function settings() {
  app.mode = 'settings';
  const s = app.settings, back = () => { setLang(s); app.saveSettings(); app.state && app.prev === 'hub' ? app.showHub() : menu(); };
  const sel = (label, key, opts) => h('label.field', h('span', label), h('select', { onchange: (e) => { let v = e.target.value; if (key === 'quality') v = +v; if (key === 'sound') v = v === 'true'; s[key] = v; setLang(s); setSound(s.sound); if (key === 'quality') app.scene.setQuality(v); app.saveSettings(); settings(); } },
    opts.map(([v, txt]) => h('option', { value: String(v), selected: String(s[key]) === String(v) }, txt))));
  const names = { ar: 'العربية الفصحى', 'ar-SD': 'السودانية', en: 'English' };
  $('#ui').replaceChildren(h('div.panel', h('h2', '⚙ ' + t('menu.settings')),
    sel(t('set.ui'), 'ui', LANGS.map((l) => [l, names[l]])), sel(t('set.dlg'), 'dlg', LANGS.map((l) => [l, names[l]])),
    sel(t('set.sub'), 'sub', [['off', t('set.off')], ['ar', names.ar], ['en', names.en]]),
    sel(t('set.digits'), 'digits', [['latn', '123'], ['arab', '١٢٣']]),
    sel(t('set.sound'), 'sound', [[true, t('set.on')], [false, t('set.off')]]),
    sel(t('set.quality'), 'quality', [[0, t('set.q0')], [1, t('set.q1')], [2, t('set.q2')]]),
    h('p.muted', t('set.sample')), speech({ g: 'f', name: 0 }, d('dlg.ask')),
    h('button.btn', { onclick: back }, t('back'))), h('div#toasts.toasts'));
}

// ---- hub ----------------------------------------------------------------------------------------
const WICON = { clear: '☀️', dust: '🌪️', rain: '🌧️' };
function hub() {
  const s = app.state; app.prev = 'hub';
  const tabs = [['orders', '📋'], ['shop', '🛒'], ['market', '🧶'], ['business', '🏪']];
  const body = h('div.hub-body');
  ({ orders: tabOrders, shop: tabShop, market: tabMarket, business: tabBusiness })[app.tab](body, s);
  $('#ui').replaceChildren(h('div.hub',
    h('div.hub-top', h('div.cash', '💵 ' + sdg(s.cash)),
      h('div.meta', h('span', `${t('hub.day')} ${num(s.day)}`), h('span', `${WICON[s.today.weather]} ${t('season.' + G.seasonOf(s.day))}`), h('span', '⭐ ' + t('rank.' + G.rank(s)))),
      h('div.hub-btns', h('button.icon-btn', { onclick: () => showroom('work') }, '🖼'), h('button.icon-btn', { onclick: settings }, '⚙'), h('button.icon-btn', { onclick: () => { app.saveGame(); menu(); } }, '⏏'))),
    body,
    h('div.tabs', tabs.map(([id, ic]) => h('button' + (id === app.tab ? '.on' : ''), { onclick: () => app.showHub(id) }, h('span', ic), h('small', t('tab.' + id)))))), h('div#toasts.toasts'));
}
const custName = (j) => (L.ui === 'en' ? NAMES[j.g + 'En'] : NAMES[j.g])[j.name];
const rugThumb = (spec, px = 72) => { const c = rugCanvas(spec, 96); c.className = 'thumb'; c.style.width = px + 'px'; return c; };
const sizeTxt = (spec) => `${t('size.' + spec.sizeKey)} ${num(spec.w, 1)}×${num(spec.h, 1)} ${t('unit.m')}`;
const hourTxt = (hh) => `${num(Math.floor(hh))}:${String(Math.round((hh % 1) * 60)).padStart(2, '0')}`;

function tabOrders(el, s) {
  const date = G.dateOf(s.day), occ = G.occasion(s.day), late = s.hour >= ECON.dayEnd - 1;
  el.append(h('div.card.day', h('b', app.dateLabel(date)),
    h('div.chips', h('span.chip', '🕐 ' + hourTxt(Math.min(s.hour, 23.75))), h('span.chip', WICON[s.today.weather] + ' ' + t('weather.' + s.today.weather)),
      occ ? h('span.chip.hot', '🌙 ' + t('occ.' + occ)) : null, s.sp > 0 ? h('span.chip.hot', { onclick: () => app.showHub('business') }, '🎓 ' + t('hub.sp', { n: num(s.sp) })) : null),
    s.today.weather !== 'clear' ? h('small', t('weatherd.' + s.today.weather)) : null,
    s.today.events.map((e) => h('small.ev', '• ' + t('ev.' + e)))));
  if (s.offers.length) el.append(h('h3', t('orders.offers')), s.offers.map((o, k) => { const rug = s.rugs.find((x) => x.id === o.rugId);
    return h('div.card.row', rugThumb(rug.spec, 56), h('div.grow', speech({ g: o.g, name: o.buyer }, d(o.haggle ? 'dlg.buyhaggle' : 'dlg.buy', { n: sdg(o.price) })), h('small.muted', t('market.listed', { n: sdg(rug.price) }))),
      h('div.col', h('button.btn.sm', { onclick: () => { G.acceptOffer(s, k); sfx.coin(); syncGallery(rug); app.saveGame(); app.checkAchievements(); hub(); } }, t('accept')), h('button.btn.sm.ghost', { onclick: () => { s.offers.splice(k, 1); hub(); } }, t('decline')))); }));
  el.append(h('h3', t('orders.title')));
  if (!s.orders.length) el.append(h('p.muted', t('orders.none')));
  for (const j of s.orders) el.append(h('div.card.row.order', { onclick: () => orderModal(j) }, rugThumb(j.spec),
    h('div.grow', h('b', `${j.g === 'm' ? '👳🏾‍♂️' : '🧕🏾'} ${custName(j)}`), h('small', `${t('arch.' + j.arch)} • ${t('dist.' + j.district)}`), h('small', sizeTxt(j.spec)),
      h('div.chips', j.rush ? h('span.chip.hot', '⏱ ' + t('job.rush')) : null, h('span.chip', plural(j.expires, 'days')))),
    h('div.price', h('small', t('orders.offer')), h('b', sdg(j.fair)))));
  el.append(h('button.btn.end', { onclick: endDayModal }, (late ? '🌙 ' : '') + t('hub.endday')));
  if (app.lastReplay) el.append(h('button.btn.ghost', { onclick: () => playTimelapse(app.lastReplay.spec, app.lastReplay.rec, () => app.showHub()) }, '🎬 ' + t('showroom.watch')));
}

function orderModal(j) {
  const s = app.state, mat = MATERIALS[j.spec.material], travel = G.travelHours(s, j);
  let quote = j.fair;
  const diag = G.skill(s, 'diagnosis');
  const best = (st) => CHEM_IDS.filter((c) => G.chemAvailable(s, c)).sort((a, b) => CHEMS[b].compat[st] - CHEMS[a].compat[st])[0];
  const line = d(j.rush ? 'dlg.rush' : mat.delicate ? 'dlg.delicate' : 'dlg.ask');
  const out = h('b', sdg(quote));
  const m = modal([speech(j, line),
    h('div.info', rugThumb(j.spec, 84), h('div.grow',
      h('div.rl', h('span', t('job.size')), h('b', sizeTxt(j.spec))),
      h('div.rl', h('span', t('job.material')), h('b', app.matLabel(j))),
      h('div.rl', h('span', t('job.stains')), h('b', j.spec.stains.length ? (diag ? j.spec.stains.map((x) => `${t('stain.' + x.type)} → ${t('chem.' + best(x.type))}`).join('، ') : plural(j.spec.stains.length, 'stains')) : t('job.nostains'))),
      h('div.rl', h('span', t('job.dye')), h('b' + (j.tested && j.spec.unstable ? '.bad' : ''), j.tested ? t(j.spec.unstable ? 'job.unstable' : 'job.stable') : '؟')),
      h('div.rl', h('span', t('job.deadline')), h('b', t('job.hours', { n: num(j.deadline) }))),
      travel ? h('div.rl', h('span', t('job.travel')), h('b', t('job.hours', { n: num(travel, 2) }))) : null)),
    j.requests.length ? h('div.chips', j.requests.map((r) => h('span.chip', '📌 ' + t('req.' + r)))) : null,
    !j.tested ? h('button.btn.ghost.sm', { onclick: () => { j.tested = true; j.inspected = true; s.hour += 0.25; m.close(); orderModal(j); if (j.spec.unstable) { sfx.bad(); toast(t('job.unstablewarn'), 'warn', 6000); } } }, '🧪 ' + t('job.test')) : null,
    h('div.quote', h('span', t('job.quote')), out, G.skill(s, 'haggle') ? h('small', t('job.budget', { n: sdg(j.maxBudget) })) : h('small', t('job.fair', { n: sdg(j.fair) }))),
    h('input', { type: 'range', min: Math.round(j.fair * 0.6 / 500) * 500, max: Math.round(j.fair * 1.7 / 500) * 500, step: 500, value: quote, oninput: (e) => { quote = +e.target.value; out.textContent = sdg(quote); } }),
    h('div.row', h('button.btn.ghost', { onclick: () => m.close() }, t('back')), h('button.btn.ghost', { onclick: () => { s.orders = s.orders.filter((o) => o !== j); m.close(); hub(); } }, t('decline')),
      h('button.btn', { onclick: () => {
        if (s.hour >= ECON.dayEnd - 1) { toast(t('job.toolate'), 'warn'); return; }
        const r = G.negotiate(s, j, quote); m.close();
        if (r.result === 'accept') { j.price = r.price; startJob(j); }
        else if (r.result === 'leave') leave(j);
        else { const m2 = modal([speech(j, d('dlg.counter', { n: sdg(r.price) })), h('div.col',
          h('button.btn', { onclick: () => { m2.close(); j.price = r.price; startJob(j); } }, t('job.takecounter', { n: sdg(r.price) })),
          h('button.btn.ghost', { onclick: () => { m2.close(); const r2 = G.negotiate(s, j, quote, true); if (r2.result === 'accept') { toast(d('dlg.fine').text, 'good'); j.price = quote; startJob(j); } else leave(j); } }, t('job.firm', { n: sdg(quote) })),
          h('button.btn.ghost', { onclick: () => { m2.close(); orderModal(j); } }, t('back')))]); }
      } }, t('job.offer')))], { dismiss: true });
}
function leave(j) { const s = app.state; s.orders = s.orders.filter((o) => o !== j); s.rep[ARCHETYPES[j.arch].track] -= 0.3; sfx.bad(); hub(); modal([speech(j, d('dlg.leave')), h('button.btn', { onclick: (e) => e.target.closest('.modal-wrap').remove() }, t('ok'))]); app.saveGame(); }

function endDayModal() {
  const s = app.state;
  const m = modal([h('h3', t('hub.endday')), h('p', t('hub.endq')), h('div.row', h('button.btn.ghost', { onclick: () => m.close() }, t('cancel')), h('button.btn', { onclick: () => {
    m.close(); const r = G.endDay(s); app.saveGame(); app.checkAchievements(); hub();
    const rows = [];
    if (r.staffIncome) rows.push(['rep.staff', r.staffIncome]); if (r.wages) rows.push(['rep.wages', -r.wages]); if (r.rent) rows.push(['rep.rent', -r.rent]);
    if (r.insurance) rows.push(['rep.insurance', -r.insurance]); if (r.sandouq) rows.push(['rep.sandouq', -r.sandouq]); if (r.payout) rows.push(['rep.payout', r.payout]);
    const m2 = modal([h('h3', `${t('hub.day')} ${num(s.day)}`), h('p', app.dateLabel(G.dateOf(s.day))),
      rows.map(([k, v]) => h('div.rl' + (v < 0 ? '.bad' : ''), h('span', t(k)), h('b', (v < 0 ? '−' : '+') + sdg(Math.abs(v))))),
      r.rentMissed ? h('div.note.bad', t('rep.missed')) : null, r.evicted ? h('div.note.bad', t('rep.evicted')) : null, r.quit ? h('div.note.bad', t('rep.quit')) : null,
      h('div.chips', h('span.chip', WICON[s.today.weather] + ' ' + t('weather.' + s.today.weather))), s.today.events.map((e) => h('small.ev', '• ' + t('ev.' + e))),
      h('button.btn', { onclick: () => m2.close() }, t('continue'))]);
  } }, t('hub.sleep')))]);
}

function buyBtn(price, ok, fn, label) { const s = app.state; return h('button.btn.sm' + (s.cash >= price && ok ? '' : '.off'), { onclick: () => { if (!ok) return; if (fn()) { sfx.coin(); app.saveGame(); app.checkAchievements(); hub(); } else { sfx.bad(); toast(t('shop.nocash'), 'warn'); } } }, label || sdg(price)); }
function tabShop(el, s) {
  el.append(h('h3', t('shop.supplies')), s.today.events.includes('discount') ? h('div.note.good', t('ev.discount')) : null);
  for (const c of CHEM_IDS) { const ok = G.chemAvailable(s, c);
    el.append(h('div.card.row', h('span.big', '🧴'), h('div.grow', h('b', t('chem.' + c)), h('small', t('chemd.' + c)), h('small.muted', `pH ${num(CHEMS[c].ph, CHEMS[c].ph % 1 ? 1 : 0)} • ${t('shop.stock', { n: num(Math.round(s.stock[c] || 0)) })}`)),
      ok ? buyBtn(G.supplyPrice(s, c), true, () => G.buyChem(s, c)) : h('small.lock', '🔒 ' + (c === 'acid' ? t('shop.needskill') : t('shop.needlevel', { n: num(CHEMS[c].unlock) }))))); }
  el.append(h('h3', t('shop.tools')));
  for (const id in TOOLS) if (TOOLS[id].price) el.append(h('div.card.row', h('span.big', '🛠'), h('div.grow', h('b', t('tool.' + id)), h('small', t('toold.' + id))), s.tools[id] ? h('small.own', '✓ ' + t('shop.owned')) : buyBtn(TOOLS[id].price, true, () => G.buyItem(s, id))));
  if (s.tools.rotary) el.append(h('div.card.row', h('span.big', '🔧'), h('div.grow', h('b', t('shop.service')), bar(s.machine.cond, s.machine.cond > 0.5 ? 'good' : s.machine.cond > 0.3 ? 'mid' : 'bad'), h('small', t('shop.serviced'))), buyBtn(ECON.machineService, s.machine.cond < 0.95, () => G.serviceMachine(s))));
  el.append(h('h3', t('shop.gear')));
  for (const id in GEAR) el.append(h('div.card.row', h('span.big', '📦'), h('div.grow', h('b', t('gear.' + id)), h('small', t('geard.' + id))), s.gear[id] ? h('small.own', '✓ ' + t('shop.owned')) : buyBtn(GEAR[id].price, true, () => G.buyItem(s, id))));
}

function syncGallery(rug) { const g = app.gallery(), e = g.find((x) => x.rugId === rug.id); if (e) { e.status = rug.status; e.price = rug.soldFor || rug.price; app.setGallery(g); } }
function tabMarket(el, s) {
  if (s.premises === 'home') { el.append(h('div.card', h('b', t('market.locked')), h('small', t('market.lockedd')))); return; }
  el.append(h('h3', t('market.buy')));
  if (!s.market.length) el.append(h('p.muted', t('market.none')));
  for (const u of s.market) el.append(h('div.card.row', rugThumb(u.spec, 56), h('div.grow', h('b', `${t('pat.' + u.spec.pattern)} • ${t('mat.' + u.spec.material)}`), h('small', sizeTxt(u.spec)), h('small.muted', t('market.value', { n: sdg(u.value) }))), buyBtn(u.cost, true, () => G.buyUsedRug(s, u.id))));
  el.append(h('h3', t('market.mine')));
  const mine = s.rugs.filter((r) => r.status !== 'sold');
  if (!mine.length) el.append(h('p.muted', t('market.empty')));
  for (const r of mine) {
    let act;
    if (!r.clean) act = h('button.btn.sm', { onclick: () => { if (s.hour >= ECON.dayEnd - 1) return toast(t('job.toolate'), 'warn'); const a = r.spec.w * r.spec.h;
      startJob({ id: ++s.jobNo, own: true, rugId: r.id, spec: r.spec, requests: [], rush: false, par: G.parTime(r.spec), waterBudget: Math.round(a * 9), deadline: 99, value: r.value, arch: 'budget', g: 'm', name: 0, district: 'nakheel', inspected: true }); } }, t('market.clean'));
    else if (r.status === 'for-sale') act = h('button.btn.sm.ghost', { onclick: () => { r.status = 'gallery'; syncGallery(r); app.saveGame(); hub(); } }, t('market.unlist'));
    else { const sug = G.suggestedPrice(s, r); let price = sug; const inp = h('input.price-in', { type: 'number', step: 500, min: 500, value: sug, oninput: (e) => { price = Math.round(+e.target.value / 500) * 500; } });
      act = h('div.col', inp, h('button.btn.sm', { onclick: () => { if (G.listRug(s, r.id, price)) { syncGallery(r); app.saveGame(); hub(); } } }, t('showroom.sell'))); }
    el.append(h('div.card.row', rugThumb(r.spec, 56), h('div.grow', h('b', `${t('pat.' + r.spec.pattern)} • ${t('mat.' + r.spec.material)}`), h('small', sizeTxt(r.spec)),
      h('small.muted', r.clean ? `${'★'.repeat(r.stars || 1)} • ${r.status === 'for-sale' ? t('market.listed', { n: sdg(r.price) }) : t('market.suggest', { n: sdg(G.suggestedPrice(s, r)) })}` : t('market.dirty', { n: sdg(r.cost) }))), act));
  }
}

function tabBusiness(el, s) {
  const lang = L.ui === 'en' ? 'en' : 'ar';
  const logo = h('img.brand', { src: logoCanvas(s.brand, 128, lang).toDataURL(), alt: '' });
  el.append(h('div.card', logo, h('div.rl', h('span', t('biz.rank')), h('b', t('rank.' + G.rank(s)))), bar(G.totalRep(s) / (RANKS[Math.min(6, G.rank(s) + 1)] || 1)),
    ['household', 'premium', 'commercial', 'community'].map((k) => h('div.rl', h('span', t('track.' + k)), h('b', num(s.rep[k], 1)))),
    h('div.rl', h('span', t('biz.level')), h('b', `${num(s.level)} • ${num(s.xp)}/${num(150 * (s.level + 1))}`)),
    h('button.btn.sm.ghost', { onclick: brandModal }, '🎨 ' + t('biz.brand'))));
  el.append(h('h3', t('biz.premises')));
  for (const id in ECON.premises) { const p = ECON.premises[id], cur = id === s.premises, ok = G.totalRep(s) >= (p.needRep || 0);
    el.append(h('div.card.row', h('span.big', id === 'home' ? '🏠' : id === 'stall' ? '🏚' : id === 'workshop' ? '🏭' : '🏬'), h('div.grow', h('b', t('prem.' + id)), h('small', t('premd.' + id)),
      p.rent ? h('small.muted', t('biz.rent', { r: sdg(p.rent), d: sdg(p.deposit), n: num(ECON.rentEveryDays) })) : null),
      cur ? h('small.own', '✓ ' + t('biz.here') + (p.rent ? ` • ${t('biz.due', { n: num(Math.max(0, s.rentDue - s.day)) })}` : '')) : id === 'home' ? null : ok ? buyBtn(p.deposit + p.rent, true, () => G.rentPremises(s, id)) : h('small.lock', '🔒 ' + t('biz.needrep', { n: num(p.needRep) })))); }
  el.append(h('h3', t('biz.staff')));
  const racks = ECON.premises[s.premises].racks;
  for (const role of ['helper', 'cleaner']) el.append(h('div.card.row', h('span.big', role === 'helper' ? '🧑🏾‍🔧' : '👷🏾'), h('div.grow', h('b', t('staff.' + role)), h('small', t('staffd.' + role, { w: sdg(ECON[role + 'Wage']) })), s.staff[role] ? bar(s.staff[role].skill / 100, 'good') : null),
    s.staff[role] ? h('button.btn.sm.ghost', { onclick: () => { delete s.staff[role]; app.saveGame(); hub(); } }, t('staff.fire')) : racks ? buyBtn(ECON[role + 'Hire'], true, () => G.hire(s, role)) : h('small.lock', '🔒 ' + t('staff.need'))));
  el.append(h('h3', t('biz.finance')));
  const q = s.sandouq;
  el.append(h('div.card.row', h('span.big', '🤝'), h('div.grow', h('b', t('fin.sandouq')), h('small', t('fin.sandouqd', { n: sdg(50000), m: num(6), tot: sdg(300000) })), q ? h('small.muted', t('fin.sandouqs', { p: num(q.paid), m: num(q.members), k: num(q.turn) })) : null),
    q ? h('small.own', q.received ? '✓ ' + t('fin.received') : '⏳') : s.premises === 'home' ? h('small.lock', '🔒 ' + t('staff.need')) : h('button.btn.sm', { onclick: () => { G.joinSandouq(s); app.saveGame(); hub(); } }, t('fin.join'))));
  el.append(h('div.card.row', h('span.big', '🛡'), h('div.grow', h('b', t('fin.insurance')), h('small', t('fin.insuranced', { n: sdg(ECON.insurance) }))),
    s.premises === 'home' ? h('small.lock', '🔒 ' + t('staff.need')) : h('button.btn.sm' + (s.insured ? '.ghost' : ''), { onclick: () => { G.toggleInsurance(s); app.saveGame(); hub(); } }, s.insured ? t('fin.cancel') : t('fin.buy'))));
  el.append(h('h3', `${t('biz.skills')} (${num(s.sp)})`));
  for (const id in SKILLS) el.append(h('div.card.row', h('span.big', { craft: '🧵', business: '💼', ops: '⚙️' }[SKILLS[id].tree]), h('div.grow', h('b', t('skill.' + id)), h('small', t('skilld.' + id))),
    s.skills[id] ? h('small.own', '✓') : h('button.btn.sm' + (s.sp >= SKILLS[id].cost ? '' : '.off'), { onclick: () => { if (G.learnSkill(s, id)) { sfx.good(); app.saveGame(); hub(); } else toast(t('biz.nosp'), 'warn'); } }, '🎓 ' + num(SKILLS[id].cost))));
  el.append(h('h3', t('biz.ach')), h('div.card', ACHS.map((k) => h('div.rl' + (s.ach[k] ? '' : '.dim'), h('span', (s.ach[k] ? '🏆 ' : '▫ ') + t('ach.' + k)), h('b', s.ach[k] ? `${t('hub.day')} ${num(s.ach[k])}` : '')))));
  el.append(h('h3', t('biz.ledger')), h('div.card.ledger', s.ledger.slice(-25).reverse().map((x) => h('div.rl' + (x.a < 0 ? '.bad' : ''), h('span', `${num(x.d)} • ${t('tx.' + x.t)} ${x.r && x.r[0] === '#' ? x.r : ''}`), h('b', (x.a < 0 ? '−' : '+') + num(Math.abs(x.a))), h('small', num(x.b))))));
}
function brandModal() {
  const s = app.state, b = { ...s.brand }, prev = h('img.brand');
  const upd = () => { prev.src = logoCanvas(b, 128, L.ui === 'en' ? 'en' : 'ar').toDataURL(); };
  const row = (label, n, key, show) => h('div.seg', h('small', label), Array.from({ length: n }, (_, i) => h('button' + (b[key] === i ? '.on' : ''), { onclick: (e) => { b[key] = i; [...e.target.parentElement.querySelectorAll('button')].forEach((x, k) => x.classList.toggle('on', k === i)); upd(); } }, show(i))));
  upd();
  const free = s.stats.jobs === 0;
  const m = modal([h('h3', '🎨 ' + t('biz.brand')), prev,
    h('label.field', h('span', t('brand.ar')), h('input', { value: b.nameAr, maxLength: 24, dir: 'rtl', oninput: (e) => { b.nameAr = e.target.value; upd(); } })),
    h('label.field', h('span', t('brand.en')), h('input', { value: b.nameEn, maxLength: 24, dir: 'ltr', oninput: (e) => { b.nameEn = e.target.value; upd(); } })),
    row(t('brand.icon'), LOGO_ICONS.length, 'icon', (i) => LOGO_ICONS[i]),
    row(t('brand.palette'), BRAND_PALETTES.length, 'palette', (i) => h('i.sw', { style: { background: `linear-gradient(135deg, ${BRAND_PALETTES[i][0]} 50%, ${BRAND_PALETTES[i][2]} 50%)` } })),
    row(t('brand.sign'), 3, 'sign', (i) => ['▢', '⬭', '▭'][i]),
    h('div.row', h('button.btn.ghost', { onclick: () => m.close() }, t('cancel')), h('button.btn', { onclick: () => { if (G.rebrand(s, b, free)) { m.close(); app.saveGame(); hub(); } else toast(t('shop.nocash'), 'warn'); } }, free ? t('save') : `${t('save')} • ${sdg(ECON.rebrandFee)}`))]);
}

// ---- showroom -----------------------------------------------------------------------------------
function showroom(tab) {
  app.mode = 'showroom';
  const g = app.gallery().reverse(), back = () => (app.state && app.prev === 'hub' ? app.showHub() : menu());
  const tabs = ['work', 'market', 'wardrobe', 'community'];
  const body = h('div.hub-body');
  if (tab === 'work' || tab === 'market') {
    const list = tab === 'market' ? g.filter((e) => e.ownership === 'owned') : g;
    const gold = list.filter((e) => e.score.stars === 5), rest = list.filter((e) => e.score.stars < 5);
    const card = (e) => h('button.gcard' + (e.score.stars === 5 ? '.gold' : ''), { onclick: () => showRug(e, tab) }, h('img', { src: e.after, alt: '' }), h('span.stars', '★'.repeat(e.score.stars)), e.status === 'sold' ? h('span.sold', t('showroom.sold')) : e.status === 'for-sale' ? h('span.sale', sdg(e.price)) : null);
    if (!list.length) body.append(h('p.muted.center', t(tab === 'market' ? 'showroom.nomarket' : 'showroom.empty')));
    if (gold.length) body.append(h('h3.goldh', '✦ ' + t('showroom.golden')), h('div.grid', gold.map(card)));
    if (rest.length) body.append(gold.length ? h('h3', t('showroom.myWork')) : null, h('div.grid', rest.map(card)));
  } else body.append(h('div.card', h('b', t('showroom.' + tab)), h('small', t('showroom.' + tab + 'd'))));
  $('#ui').replaceChildren(h('div.hub.hall', h('div.hub-top', h('div.cash', '🖼 ' + t('showroom.title')), h('div.meta', h('span', plural(g.length, 'rugs'))), h('div.hub-btns', h('button.icon-btn', { onclick: back }, '✕'))),
    body, h('div.tabs', tabs.map((id) => h('button' + (id === tab ? '.on' : ''), { onclick: () => showroom(id) }, h('span', { work: '🖼', market: '💰', wardrobe: '👔', community: '🌍' }[id]), h('small', t('showroom.' + (id === 'work' ? 'myWork' : id))))))), h('div#toasts.toasts'));
}
function showRug(e, tab) {
  const sc = app.scene; app.mode = 'show3d';
  const rug = createRug({ ...e.spec, dust: 0, soil: 0, deep: 0, stains: [] });
  for (let i = 0; i < rug.n; i++) { rug.napX[i] = 0; rug.napY[i] = 0.8; }
  sc.setEnv('hall'); sc.setLight(12, 'clear', true); sc.setView('show'); sc.setTool(null); sc.setRug(rug, rugCanvas(e.spec)); sc.resize();
  const rep = store.get(REP_KEY + e.id), s = app.state, own = s && e.rugId ? s.rugs.find((x) => x.id === e.rugId) : null;
  const cust = e.customer ? (L.ui === 'en' ? NAMES[e.customer.g + 'En'] : NAMES[e.customer.g])[e.customer.name] : null;
  const date = new Date(e.completedAt.gregorian + 'T00:00:00Z');
  const close = () => showroom(tab);
  $('#ui').replaceChildren(h('div.show-card',
    h('div.row', h('b.grow', `${t('pat.' + e.pattern)} • ${t('mat.' + e.material)}`), h('span.stars', '★'.repeat(e.score.stars)), h('button.icon-btn', { onclick: close }, '✕')),
    h('small', `${num(e.sizeCm.w)}×${num(e.sizeCm.h)} ${t('unit.cm')} • ${t('showroom.score', { n: num(e.score.total) })} • ${num(e.stats.minutes, 1)} ${t('unit.min')} • ${num(e.stats.waterL)} ${t('unit.l')}`),
    h('small.muted', `${app.dateLabel(date)} • ${t('hub.day')} ${num(e.completedAt.gameDay)} • ${t('season.' + e.completedAt.season)}`),
    cust ? h('small', `${t('showroom.customer')}: ${cust} — ${t('story.' + e.customer.arch)}`) : h('small', t('showroom.owned')),
    beforeAfter(e.before, e.after, e.spec),
    h('div.row', rep ? h('button.btn.sm', { onclick: () => { try { playTimelapse(e.spec, JSON.parse(rep), () => showRug(e, tab)); } catch { toast(t('tl.unsupported'), 'warn'); } } }, '🎬 ' + t('showroom.watch')) : null,
      own && own.clean && own.status === 'gallery' ? h('button.btn.sm', { onclick: () => { G.listRug(s, own.id, G.suggestedPrice(s, own)); syncGallery(own); app.saveGame(); toast(t('market.listed', { n: sdg(own.price) }), 'good'); close(); } }, '💰 ' + t('showroom.sell')) : null,
      e.status === 'sold' ? h('span.sold', t('showroom.sold')) : null)), h('div#toasts.toasts'));
}
export { SIZES };
