// One cleaning job from first touch to payment: tools, live warnings, drying, score, cash, time-lapse.
import { TOOLS, SLOTS, CHEMS, CHEM_IDS, ECON, ARCHETYPES, NAMES, STAIN_IDS } from './content.js';
import { createRug, applyTool, step, measure, cleanliness, dryingHours, dryStep, scoreJob, mixConflict, RES } from './sim.js';
import { env as envOf, settleJob, bookPayment, tx, has, skill, chemAvailable, dateOf, seasonOf, hijri } from './state.js';
import { rugCanvas, noteCanvas, logoCanvas } from './patterns.js';
import { t, d, num, sdg, L } from './i18n.js';
import { h, $, modal, toast, bar } from './dom.js';
import { toolSound, sfx, setMusicLevel, startMusic, stopMusic } from './audio.js';
import { app } from './app.js';

export const TICK = 1 / 30;
const ICON = { dry: '🧹', spray: '💦', chem: '🧴', brush: '🪥', rotary: '⚙️', extract: '🧽', groom: '≋' };

// The single code path that advances the simulation, shared by live play and replay.
export function simTick(rug, c, p) {
  if (p) {
    const dx = c.last ? p[0] - c.last[0] : 0, dy = c.last ? p[1] - c.last[1] : 0;
    applyTool(rug, c.tools[c.slot], p[0], p[1], TICK, { pressure: c.set.pressure, temp: c.set.temp, chem: c.set.chem, fast: c.set.fast, dx, dy });
    c.last = p;
  } else c.last = null;
  step(rug, TICK);
}
export function resolveTools(s) {
  const out = {};
  for (const slot of SLOTS) {
    let best = null;
    for (const id in TOOLS) if (TOOLS[id].slot === slot && s.tools[id] && (!best || TOOLS[id].tier > TOOLS[best].tier)) best = id;
    if (best) { out[slot] = { ...TOOLS[best], id: best }; if (best === 'rotary' && s.machine.cond < 0.3) out[slot].power *= 0.65; }
  }
  return out;
}

let ses = null;
export const activeSession = () => ses;

export function startJob(job) {
  const s = app.state, e = envOf(s);
  const rug = createRug(job.spec);
  const tools = resolveTools(s);
  ses = { job, rug, e, c: { tools, slot: 'dry', set: { pressure: 0.6, temp: 0, chem: 'shampoo', fast: false }, last: null },
    rec: { tools, ev: [], dry: null }, heat: 0, locked: false, acc: 0, down: false, pt: null, prev: null, paused: false, hudT: 0, warnT: {}, lastM: measure(rug), overlay: 0,
    used: { machine: false, electric: false }, waterCap: e.water ? Infinity : 25, coach: s.stats.jobs < 3 || app.settings.coach };
  recSet('slot', 'dry');
  app.scene.setEnv(job.own || s.premises !== 'home' ? 'shop' : 'yard');
  app.scene.setLight(Math.min(19, s.hour), e.weather, s.premises !== 'home');
  app.scene.hud = { top: 118, bottom: 214 };
  app.scene.setView('work'); app.scene.setRug(rug, rugCanvas(job.spec));
  app.scene.render(0); ses.before = app.scene.snapshot(256);
  app.mode = 'clean'; buildHud(); startMusic(); setMusicLevel(0);
  if (!e.power) toast(t('warn.nopower'), 'warn', 5000);
  if (!e.water) toast(t('warn.nowater', { n: num(25) }), 'warn', 5000);
  if (e.weather === 'dust' && s.premises === 'home') toast(t('warn.haboob'), 'warn', 5000);
}
function recSet(k, v) { ses.rec.ev.push({ [k]: v }); }
function recFrame(p) {
  const ev = ses.rec.ev;
  if (p) ev.push([Math.round(p[0] * 100), Math.round(p[1] * 100)]);
  else if (typeof ev[ev.length - 1] === 'number') ev[ev.length - 1]++; else ev.push(1);
}

// ---- HUD ----------------------------------------------------------------------------------------
function buildHud() {
  const ui = $('#ui'); ui.replaceChildren();
  const job = ses.job;
  const top = h('div.hud-top',
    h('div.hud-row',
      h('div.stat', h('small', t('hud.cleanliness')), h('b#h-clean', '0%'), bar(0, 'clean')),
      h('div.stat', h('small', t('hud.time')), h('b#h-time', '0:00')),
      h('div.stat', h('small', t('hud.water')), h('b#h-water', '0')),
      h('button.icon-btn', { onclick: helpModal, title: t('hud.help') }, '?'),
      h('button.icon-btn.go', { onclick: finishDialog }, '✓')),
    h('div.chips', job.requests.map((r) => h('span.chip', '📌 ' + t('req.' + r))), job.rush ? h('span.chip.hot', '⏱ ' + t('job.rush')) : null,
      h('span.chip', app.matLabel(job))),
    h('div#coach.coach', { style: { display: ses.coach ? '' : 'none' } }));
  const side = h('div.hud-side',
    h('button.icon-btn', { id: 'ov-dirt', onclick: () => setOverlay(ses.overlay === 1 ? 0 : 1), title: t('hud.dirtview') }, '🔍'),
    has(app.state, 'meter') ? h('button.icon-btn', { id: 'ov-wet', onclick: () => setOverlay(ses.overlay === 2 ? 0 : 2), title: t('hud.wetview') }, '💧') : null,
    has(app.state, 'meter') ? h('button.icon-btn', { id: 'ov-soap', onclick: () => setOverlay(ses.overlay === 3 ? 0 : 3), title: t('hud.soapview') }, '🫧') : null,
    h('button.icon-btn', { onclick: () => { app.scene.setView(app.scene.view === 'top' ? 'work' : 'top'); } , title: t('hud.camera') }, '🎥'),
    h('button.icon-btn', { onclick: () => { ses.coach = !ses.coach; app.settings.coach = ses.coach; app.saveSettings(); $('#coach').style.display = ses.coach ? '' : 'none'; }, title: t('hud.coach') }, '👳🏾‍♂️'));
  const bottom = h('div.hud-bottom', h('div#tool-opts.tool-opts'),
    h('div.toolbar', SLOTS.map((slot) => {
      const def = ses.c.tools[slot];
      return h('button.tool' + (def ? '' : '.locked'), { id: 'tool-' + slot, onclick: () => def ? selectSlot(slot) : toast(t('tool.locked', { name: t('slot.' + slot) })) },
        h('span.ti', ICON[slot]), h('span.tn', def ? t('tool.' + def.id) : t('slot.' + slot)));
    })));
  ui.append(top, side, bottom, h('div#toasts.toasts'));
  selectSlot('dry'); updateHud(true);
}
function setOverlay(m) { ses.overlay = m; app.scene.setOverlay(m); for (const [id, k] of [['ov-dirt', 1], ['ov-wet', 2], ['ov-soap', 3]]) { const b = $('#' + id); if (b) b.classList.toggle('on', m === k); } }
function selectSlot(slot) {
  ses.c.slot = slot; recSet('slot', slot);
  for (const sl of SLOTS) $('#tool-' + sl).classList.toggle('on', sl === slot);
  const o = $('#tool-opts'); o.replaceChildren();
  const def = ses.c.tools[slot], set = ses.c.set;
  const seg = (label, opts, cur, fn) => h('div.seg', h('small', label), opts.map(([v, txt]) => h('button' + (v === cur ? '.on' : ''), { onclick: () => { fn(v); selectSlot(slot); } }, txt)));
  if (def.kind === 'agitate' || def.kind === 'extract')
    o.append(seg(t('opt.pressure'), [[0.3, t('opt.light')], [0.6, t('opt.medium')], [1, t('opt.hard')]], set.pressure, (v) => { set.pressure = v; recSet('pressure', v); }));
  if (def.machine) {
    o.append(seg(t('opt.speed'), [[false, t('opt.slow')], [true, t('opt.fast')]], set.fast, (v) => { set.fast = v; recSet('fast', v); }));
    o.append(h('div.seg', h('small', t('opt.heat')), h('div#h-heat', bar(ses.heat, 'heat'))));
  }
  if (def.kind === 'spray') o.append(seg(t('opt.temp'), [[0, '❄ ' + t('opt.cold')], [1, t('opt.warm')], [2, '🔥 ' + t('opt.hot')]], set.temp, (v) => { set.temp = v; recSet('temp', v); if (v === 2) heatWarn(); }));
  if (def.kind === 'chem') {
    o.append(h('div.chems', CHEM_IDS.filter((c) => chemAvailable(app.state, c)).map((c) => {
      const left = Math.max(0, (app.state.stock[c] || 0) - (ses.rug.stats.chemMl[c] || 0));
      return h('button.chem' + (c === set.chem ? '.on' : '') + (left <= 0 ? '.empty' : ''), { onclick: () => pickChem(c) },
        h('b', t('chem.' + c)), h('small', `pH ${num(CHEMS[c].ph, CHEMS[c].ph % 1 ? 1 : 0)} • ${num(Math.round(left))} ${t('unit.ml')}`));
    })));
  }
  if (def.kind === 'dry' || def.kind === 'groom') o.append(h('div.hint', t('hint.' + def.kind)));
}
function pickChem(c) {
  const other = mixConflict(ses.rug, c);
  if (other) { sfx.bad(); modal([h('h3', '⚠️ ' + t('safety.title')), h('p', t('safety.mix', { a: t('chem.' + c), b: t('chem.' + other) })), h('button.btn', { onclick: (e) => e.target.closest('.modal-wrap').remove() }, t('ok'))]); return; }
  ses.c.set.chem = c; recSet('chem', c); selectSlot('chem');
}
function heatWarn() {
  const types = new Set(ses.job.spec.stains.map((x) => x.type));
  if ((types.has('protein') || types.has('henna')) && (skill(app.state, 'diagnosis') || ses.job.inspected)) toast(t('warn.heatset'), 'warn', 5000);
  else if (ses.rug.mat.shrink > 0.4) toast(t('warn.shrink'), 'warn', 5000);
}
function helpModal() {
  ses.paused = true;
  const m = modal([h('h3', t('help.title')), h('ol.steps', [1, 2, 3, 4, 5, 6, 7].map((k) => h('li', t('help.s' + k)))), h('p.muted', t('help.note')),
    h('button.btn', { onclick: () => { m.close(); ses.paused = false; } }, t('ok'))]);
}

// ---- pointer input ------------------------------------------------------------------------------
export function pointer(type, x, y) {
  if (!ses || app.mode !== 'clean' || ses.paused) return;
  if (type === 'up') { ses.down = false; return; }
  const p = app.scene.pick(x, y); if (!p) return;
  ses.pt = p; if (type === 'down') ses.down = true;
}

function usable() {
  const def = ses.c.tools[ses.c.slot], st = ses.rug.stats, warn = (k, v) => { if (!(ses.warnT[k] > ses.rug.time)) { ses.warnT[k] = ses.rug.time + 6; toast(t('warn.' + k, v), 'warn'); sfx.bad(); } return false; };
  if (def.electric && !ses.e.power) return warn('nopower');
  if (def.machine && ses.locked) return warn('overheat');
  if (def.kind === 'spray' && st.waterL >= ses.waterCap) return warn('nowater', { n: num(25) });
  if (def.kind === 'chem') {
    const c = ses.c.set.chem;
    if ((app.state.stock[c] || 0) - (st.chemMl[c] || 0) <= 0) return warn('nostock', { name: t('chem.' + c) });
    if (mixConflict(ses.rug, c)) return warn('mix');
  }
  return true;
}

// ---- frame --------------------------------------------------------------------------------------
export function frame(dt) {
  if (!ses) return;
  const sc = app.scene, def = ses.c.tools[ses.c.slot];
  if (!ses.paused && app.mode === 'clean') {
    ses.acc += Math.min(dt, 0.1);
    while (ses.acc >= TICK) {
      ses.acc -= TICK;
      let p = null;
      if (ses.down && ses.pt && usable()) {
        const { w, h: hh } = ses.rug.spec, r = def.radius;
        if (ses.pt.mx > -r && ses.pt.my > -r && ses.pt.mx < w + r && ses.pt.my < hh + r) p = [Math.round(ses.pt.mx * 100) / 100, Math.round(ses.pt.my * 100) / 100];
      }
      if (p && def.machine) { ses.heat = Math.min(1, ses.heat + TICK / (skill(app.state, 'upkeep') ? 70 : 42)); if (ses.heat >= 1) ses.locked = true; ses.used.machine = true; }
      else { ses.heat = Math.max(0, ses.heat - TICK / 22); if (ses.locked && ses.heat < 0.45) ses.locked = false; }
      if (p && def.electric) ses.used.electric = true;
      simTick(ses.rug, ses.c, p); recFrame(p);
      ses.active = !!p;
    }
    sc.updateMasks();
  }
  // visuals + sound follow the pointer every frame
  if (ses.pt && app.mode === 'clean') {
    const pr = ses.prev || ses.pt, on = ses.down && ses.active;
    sc.setTool(ses.c.slot, ses.pt.x, ses.pt.z, on, ses.pt.x - pr.x, ses.pt.z - pr.z, on ? (ses.c.set.fast ? 0.9 : 0.55) : 0);
    if (on) {
      const k = def.kind, i = cellAt(ses.pt.mx, ses.pt.my), wet = i < 0 ? 0 : Math.min(1, ses.rug.wet[i]), foam = i < 0 ? 0 : ses.rug.foam[i];
      if (k === 'spray') sc.emit(ses.pt.x, ses.pt.z, 'water', 4); else if (k === 'chem') sc.emit(ses.pt.x, ses.pt.z, 'chem', 2);
      else if (k === 'dry' && i >= 0 && ses.rug.dust[i] > 0.05) sc.emit(ses.pt.x, ses.pt.z, 'dust', 2);
      else if (k === 'agitate' && foam > 0.3) sc.emit(ses.pt.x + (Math.random() - 0.5) * def.radius, ses.pt.z + (Math.random() - 0.5) * def.radius, 'foam', 1);
      toolSound(k === 'spray' || k === 'chem' ? 'water' : def.machine ? 'motor' : k === 'extract' ? 'squeegee' : 'scrub', wet, foam);
      if (k === 'agitate' && wet < 0.15 && i >= 0 && ses.rug.soil[i] + ses.rug.stain[i] > 0.2) liveWarn('dry');
      if (def.machine && app.settings.haptics !== false && window.AndroidBridge && Math.random() < 0.1) try { window.AndroidBridge.vibrate(15); } catch { /* optional */ }
    } else toolSound(null);
    ses.prev = ses.pt;
  } else toolSound(null);
  ses.hudT -= dt; if (ses.hudT <= 0 && app.mode === 'clean') { ses.hudT = 0.3; updateHud(); }
}
function cellAt(mx, my) { const x = Math.floor(mx * RES), y = Math.floor(my * RES); return x < 0 || y < 0 || x >= ses.rug.W || y >= ses.rug.H ? -1 : y * ses.rug.W + x; }
function liveWarn(k, ms = 4200) { if (ses.warnT[k] > ses.rug.time) return; ses.warnT[k] = ses.rug.time + 9; toast(t('warn.' + k), 'warn', ms); }

function updateHud(first) {
  const m = measure(ses.rug), last = ses.lastM, c = cleanliness(ses.rug);
  $('#h-clean').textContent = num(Math.round(c * 100)) + '%'; $('.bar.clean i').style.width = c * 100 + '%';
  const tt = Math.floor(ses.rug.time); $('#h-time').textContent = `${num(Math.floor(tt / 60))}:${String(tt % 60).padStart(2, '0')}`;
  $('#h-time').classList.toggle('late', ses.rug.time > ses.job.par);
  $('#h-water').textContent = num(Math.round(ses.rug.stats.waterL)) + ' ' + t('unit.l');
  const hb = $('#h-heat i'); if (hb) { hb.style.width = ses.heat * 100 + '%'; hb.parentElement.classList.toggle('hot', ses.locked); }
  setMusicLevel(c);
  if (!first) { // explain consequences while they are still fixable
    if (m.stress - last.stress > 0.0008) liveWarn('stress');
    if (m.bleed > 0.004 && m.bleed - last.bleed > 0.0004) liveWarn('bleed', 6000);
    if (m.wet > 1.05) liveWarn('overwet');
    if (m.soap > 0.7) liveWarn('chem');
    if (last.dust - m.dust > 0.01 && m.soil > last.soil + 0.005) liveWarn('mud', 6000);
    if (ses.heat > 0.82 && !ses.locked) liveWarn('heat');
  }
  ses.lastM = m;
  if (ses.coach) $('#coach').textContent = '👳🏾‍♂️ ' + d('coach.' + coachStep(m)).text;
}
function coachStep(m) {
  const st = ses.rug.stats;
  if (m.dust > 0.06 && m.wet < 0.1) return 'dust';
  if (m.dirt > ses.rug.initial.dirt * 0.25 || m.stain > ses.rug.initial.stain * 0.3) {
    if (m.wet < 0.35) return 'wet';
    if (m.soap < 0.18 && m.soil + m.stain > 0.05) return m.stain > 0.03 && m.soil < 0.08 ? 'spot' : 'soap';
    return 'scrub';
  }
  if (m.slurry > 0.03 || m.soap > 0.06) return st.waterL < 1 ? 'wet' : 'rinse';
  if (m.wet > 0.45) return 'extract';
  if (m.nap < 0.6) return 'groom';
  return 'done';
}

// ---- finish, drying, score ----------------------------------------------------------------------
function finishDialog() {
  ses.paused = true; toolSound(null);
  const s = app.state, e = ses.e, m = measure(ses.rug), c = cleanliness(ses.rug);
  const outdoor = s.premises === 'home' && !ses.job.own;
  const methods = [];
  if (outdoor || true) { if (e.weather !== 'rain' && s.hour < 17.5) methods.push('sun'); }
  methods.push('shade');
  if (has(s, 'fans') && e.power) methods.push('fans');
  if (ECON.premises[s.premises].racks) methods.push('rack');
  const lvl = (v, a, b) => (v < a ? 'good' : v < b ? 'mid' : 'bad');
  const row = (label, cls, txt) => h('div.check.' + cls, h('span', label), h('b', txt));
  const mdl = modal([h('h3', t('finish.title')),
    row(t('finish.clean'), lvl(1 - c, 0.08, 0.25), num(Math.round(c * 100)) + '%'),
    row(t('finish.wet'), lvl(m.wet, 0.4, 0.75), t('lvl.' + lvl(m.wet, 0.4, 0.75))),
    row(t('finish.residue'), lvl(m.soap + m.slurry, 0.05, 0.15), t('lvl.' + lvl(m.soap + m.slurry, 0.05, 0.15))),
    row(t('finish.edges'), lvl(m.edgeDirt - m.dirt, 0.04, 0.12), t('lvl.' + lvl(m.edgeDirt - m.dirt, 0.04, 0.12))),
    h('p.muted', t('finish.pick')),
    h('div.methods', methods.map((id) => {
      const hrs = dryingHours(ses.rug, { method: id, temp: e.temp, humid: e.humid });
      return h('button.method', { onclick: () => { mdl.close(); runDrying(id, hrs); } }, h('b', t('dry.' + id)),
        h('small', skill(s, 'drying') ? t('dry.forecast', { n: num(hrs, 1) }) : t('dryd.' + id)), ses.job.own ? null : h('small' + (hrs > ses.job.deadline ? '.bad' : ''), skill(s, 'drying') && hrs > ses.job.deadline ? t('dry.late') : ''));
    })),
    h('button.btn.ghost', { onclick: () => { mdl.close(); ses.paused = false; } }, t('finish.back'))]);
}
function runDrying(method, hours) {
  const s = app.state, e = ses.e, sc = app.scene;
  app.mode = 'drying'; $('#ui').replaceChildren(h('div.banner', h('b', t('dry.running')), h('span', t('dry.' + method))), h('div#toasts.toasts'));
  sc.setTool(null); sc.setOverlay(0); sc.setView('top');
  const pre = measure(ses.rug), steps = 24, outdoor = s.premises === 'home' && !ses.job.own && method !== 'fans';
  const denv = { method, temp: e.temp, humid: e.humid, hours, dust: outdoor && e.weather === 'dust' ? 0.3 : 0 };
  ses.rec.dry = denv; let k = 0;
  const iv = setInterval(() => {
    dryStep(ses.rug, denv, k, steps); sc.updateMasks(); k++;
    if (k >= steps) { clearInterval(iv); setTimeout(() => showResult(pre, hours, method), 500); }
  }, 120);
}
function showResult(pre, hours, method) {
  const s = app.state, job = ses.job, sc = app.scene;
  const late = !job.own && hours > job.deadline;
  const score = scoreJob(ses.rug, pre, { par: job.par, requests: job.requests, waterBudget: job.waterBudget, late });
  sc.render(0); const after = sc.snapshot(256);
  stopMusic(); (score.total >= 70 ? sfx.good : sfx.bad)();
  const st = settleJob(s, job, score, ses.rug.time, hours, { chemMl: ses.rug.stats.chemMl, waterL: ses.rug.stats.waterL, machine: ses.used.machine, electric: ses.used.electric });
  const entry = app.addGallery(job, score, ses.rug, ses.before, after, ses.rec, late);
  app.mode = 'result';
  const notes = [];
  if (pre.wet > 0.6 && ses.rug.initial.deep > 0.1) notes.push('wick');
  if (pre.slurry > 0.04) notes.push('redeposit');
  if (pre.soap > 0.08) notes.push('residue');
  if (score.m.bleed > 0.01) notes.push('bleed');
  if (score.m.stress > 0.02) notes.push('stress');
  if (score.m.shrink > 0.03) notes.push('shrink');
  if (score.m.fade > 0.05) notes.push('fade');
  if (late) notes.push('late');
  if (ses.rec.dry.dust) notes.push('haboob');
  if (score.stainLeft > 0.3) notes.push('stains');
  const cats = [['clean', 30], ['safety', 20], ['coverage', 15], ['moisture', 10], ['time', 10], ['instr', 10], ['site', 5]];
  const react = job.own ? null : d('dlg.' + (score.damaged ? 'damaged' : score.total >= 85 ? 'happy' : score.total >= 70 ? 'ok' : score.total >= 55 ? 'unhappy' : 'angry'));
  $('#ui').replaceChildren(h('div.panel.result',
    h('div.score', h('div.ring', { style: { '--p': score.total } }, h('b', num(score.total))), h('div', h('div.stars', '★'.repeat(score.stars) + '☆'.repeat(5 - score.stars)), h('h2', t('band.' + score.stars)))),
    beforeAfter(ses.before, after, job.spec),
    h('div.cats', cats.map(([k, max]) => h('div.cat', h('span', t('sc.' + k)), bar(score[k] / max, score[k] / max > 0.75 ? 'good' : score[k] / max > 0.45 ? 'mid' : 'bad'), h('b', `${num(score[k], 1)}/${num(max)}`)))),
    score.failed.length ? h('div.notes', score.failed.map((r) => h('div.note.bad', '✗ ' + t('req.' + r)))) : null,
    notes.length ? h('div.notes', notes.map((n) => h('div.note', '• ' + t('why.' + n)))) : null,
    react ? speech(job, react) : h('p.muted', t('result.own')),
    st.leveled ? h('div.note.good', '⬆ ' + t('result.level', { n: num(s.level) })) : null,
    entry ? h('div.note.good', '🖼 ' + t('result.gallery')) : null,
    h('button.btn', { onclick: () => (job.own ? done(st) : payment(st, score)) }, job.own ? t('continue') : st.pay + st.tip > 0 ? t('result.collect') : t('continue'))),
  h('div#toasts.toasts'));
}
export function speech(job, line) {
  const name = (L.ui === 'en' ? NAMES[job.g + 'En'] : NAMES[job.g])[job.name];
  return h('div.speech', h('span.av', job.g === 'm' ? '👳🏾‍♂️' : '🧕🏾'), h('div', h('small', name), h('p', { dir: line.rtl ? 'rtl' : 'ltr' }, line.text), line.sub ? h('p.sub', line.sub) : null));
}
export function beforeAfter(before, after, spec) {
  const el = h('div.ba', { style: { aspectRatio: `${spec.w} / ${spec.h}` } }, h('img', { src: after, draggable: false }), h('img.ba-top', { src: before, draggable: false }), h('div.ba-knob'),
    h('span.ba-l', t('showroom.before')), h('span.ba-r', t('showroom.after')));
  const mv = (e) => { const r = el.getBoundingClientRect(); el.style.setProperty('--f', Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * 100 + '%'); e.preventDefault(); };
  el.addEventListener('pointerdown', (e) => { el.setPointerCapture(e.pointerId); mv(e); el.onpointermove = mv; });
  el.addEventListener('pointerup', () => { el.onpointermove = null; });
  return el;
}

// ---- cash ---------------------------------------------------------------------------------------
function breakdown(amount) { const out = []; for (const n of ECON.notes) while (amount >= n) { out.push(n); amount -= n; } return out; }
function payment(st, score) {
  const s = app.state, job = ses.job, due = st.pay + st.tip;
  if (due <= 0) { bookPayment(s, job, st); return done(st); }
  const r = (job.id * 2654435761) >>> 0;
  const tender = r % 3 === 0 ? due : Math.ceil(due / (r % 2 ? 10000 : 5000)) * (r % 2 ? 10000 : 5000);
  const change = tender - due; let given = [];
  const dig = (n) => num(n);
  const draw = () => {
    const sum = given.reduce((a, b) => a + b, 0);
    $('#ui').replaceChildren(h('div.panel.pay',
      h('h2', t('pay.title')), speech(job, d(st.tip ? 'dlg.tip' : 'dlg.pay')),
      h('div.due', h('span', t('pay.due')), h('b', sdg(due)), st.tip ? h('small', t('pay.tip', { n: sdg(st.tip) })) : null),
      h('small.muted', t('pay.handed', { n: sdg(tender) })),
      h('div.notes-row', breakdown(tender).map((n) => noteCanvas(n, dig))),
      change > 0 ? [h('div.due', h('span', t('cash.change')), h('b', sdg(change)), h('small', t('pay.given', { n: sdg(sum) }))),
        h('div.notes-row.given', given.map((n, i) => { const c = noteCanvas(n, dig); c.onclick = () => { given.splice(i, 1); draw(); }; return c; })),
        h('small.muted', t('pay.drawer')),
        h('div.notes-row.drawer', ECON.notes.slice().reverse().map((n) => { const c = noteCanvas(n, dig); c.onclick = () => { sfx.note(); given.push(n); draw(); }; return c; })),
        h('div.row', h('button.btn.ghost', { onclick: () => { given = breakdown(change); draw(); } }, t('pay.auto')),
          h('button.btn', { onclick: () => {
            if (sum < change) { sfx.bad(); toast(d('dlg.shortchange').text, 'warn'); return; }
            bookPayment(s, job, st);
            if (sum > change) { tx(s, 'change', -Math.min(s.cash, sum - change), '#' + job.id); toast(t('pay.over', { n: sdg(sum - change) }), 'warn', 4500); }
            else if (given.length) s.rep.community += 0.1;
            receipt(st, tender, change);
          } }, t('pay.confirm')))]
        : h('button.btn', { onclick: () => { bookPayment(s, job, st); receipt(st, tender, 0); } }, t('pay.take'))),
    h('div#toasts.toasts'));
  };
  draw();
}
function receipt(st, tender, change) {
  const s = app.state, job = ses.job; sfx.coin();
  const ds = dateOf(s.day), lang = L.ui === 'en' ? 'en' : 'ar';
  $('#ui').replaceChildren(h('div.panel.pay', h('div.receipt',
    h('img', { src: logoCanvas(s.brand, 128, lang).toDataURL(), alt: '' }),
    h('div.rl', h('span', t('rc.no')), h('b', '#' + num(job.id))),
    h('div.rl', h('span', t('rc.service')), h('b', t('rc.wash', { size: t('size.' + job.spec.sizeKey) }))),
    h('div.rl', h('span', t('rc.date')), h('b', app.dateLabel(ds))),
    h('div.rl', h('span', t('rc.total')), h('b', sdg(st.pay))), st.tip ? h('div.rl', h('span', t('rc.tip')), h('b', sdg(st.tip))) : null,
    h('div.rl', h('span', t('rc.paid')), h('b', sdg(tender))), h('div.rl', h('span', t('cash.change')), h('b', sdg(change))),
    st.claim ? h('div.rl.bad', h('span', t('rc.claim')), h('b', '−' + sdg(st.claim))) : null,
    h('small', t('rc.thanks'))),
  h('button.btn', { onclick: () => done(st) }, t('continue'))), h('div#toasts.toasts'));
}
function done(st) {
  const s = app.state, job = ses.job, rec = ses.rec, spec = job.spec;
  ses = null; app.scene.setTool(null); app.saveGame(); app.checkAchievements();
  app.showHub('orders');
  if (st.claim) toast(t('claim.note', { n: sdg(st.claim) }), 'warn', 6000);
  app.lastReplay = { spec, rec };
}

// ---- time-lapse replay --------------------------------------------------------------------------
let tl = null;
export function playTimelapse(spec, rec, onClose) {
  const sc = app.scene, s = app.state;
  const total = rec.ev.reduce((a, e) => a + (typeof e === 'number' ? e : Array.isArray(e) ? 1 : 0), 0);
  tl = { spec, rec, i: 0, idle: 0, total, done: 0, c: null, rug: null, speed: Math.max(4, Math.ceil(total / (60 * 18))), mul: 1, dryK: -1, recorder: null, onClose };
  document.body.classList.add('tl'); app.mode = 'timelapse';
  sc.setEnv('shop'); sc.setLight(11, 'clear', true); sc.hud = { top: 0, bottom: 0 };
  const restart = () => {
    tl.rug = createRug(spec); tl.c = { tools: rec.tools, slot: 'dry', set: { pressure: 0.6, temp: 0, chem: 'shampoo', fast: false }, last: null };
    tl.i = 0; tl.idle = 0; tl.done = 0; tl.dryK = -1; tl.hold = 0;
    sc.setView('top'); sc.setRug(tl.rug, rugCanvas(spec)); sc.resize();
  };
  tl.restart = restart; restart();
  sc.setMark(logoCanvas(s.brand, 128, L.ui === 'en' ? 'en' : 'ar'));
  const canRec = !!(window.MediaRecorder && sc.renderer.domElement.captureStream);
  $('#ui').replaceChildren(h('div.tl-ui', h('div.tl-bar', bar(0, 'clean')),
    h('div.tl-ctl',
      h('button.btn.ghost', { onclick: () => { tl.mul = tl.mul === 1 ? 2 : tl.mul === 2 ? 0.5 : 1; $('#tl-speed').textContent = '×' + num(tl.mul, tl.mul < 1 ? 1 : 0); }, id: 'tl-speed' }, '×1'),
      h('button.btn.ghost', { onclick: restart }, '↺'),
      canRec ? h('button.btn', { id: 'tl-rec', onclick: exportVideo }, '⬇ ' + t('tl.export')) : null,
      h('button.btn.ghost', { onclick: closeTimelapse }, '✕'))), h('div#toasts.toasts'));
}
export function frameTimelapse() {
  if (!tl) return;
  const sc = app.scene, ev = tl.rec.ev;
  let n = Math.max(1, Math.round(tl.speed * tl.mul));
  while (n-- > 0 && tl.i < ev.length) {
    const e = ev[tl.i];
    if (typeof e === 'number') { simTick(tl.rug, tl.c, null); tl.done++; if (++tl.idle >= e) { tl.idle = 0; tl.i++; } }
    else if (Array.isArray(e)) { const p = [e[0] / 100, e[1] / 100]; simTick(tl.rug, tl.c, p); tl.done++; tl.i++; tl.pt = p; }
    else { const k = Object.keys(e)[0]; if (k === 'slot') tl.c.slot = e[k]; else tl.c.set[k] = e[k]; tl.i++; }
  }
  if (tl.i >= ev.length) {
    if (tl.rec.dry && tl.dryK < 24) { if (tl.dryK >= 0 && tl.hold++ % 4 === 0) dryStep(tl.rug, tl.rec.dry, tl.dryK, 24); if (tl.hold % 4 === 1 || tl.dryK < 0) tl.dryK++; sc.setTool(null); }
    else if (tl.recorder && tl.hold++ > 150) stopRecording();
  } else if (tl.pt) { const w = tl.spec.w, hh = tl.spec.h; sc.setTool(tl.c.slot, tl.pt[0] - w / 2, tl.pt[1] - hh / 2, true, 0, 0, 0.8); }
  sc.updateMasks();
  const b = $('.tl-bar i'); if (b) b.style.width = Math.min(100, tl.done / Math.max(1, tl.total) * 100) + '%';
}
function exportVideo() {
  const cv = app.scene.renderer.domElement;
  try {
    const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'].find((m) => MediaRecorder.isTypeSupported(m));
    const stream = cv.captureStream(30), chunks = [];
    const mr = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 4e6 });
    mr.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    mr.onstop = () => app.download(new Blob(chunks, { type: mime.split(';')[0] }), `rug-empire-timelapse.${mime.includes('mp4') ? 'mp4' : 'webm'}`);
    tl.recorder = mr; tl.restart(); mr.start(); $('#tl-rec').disabled = true; toast(t('tl.recording'));
  } catch { toast(t('tl.unsupported'), 'warn'); }
}
function stopRecording() { const mr = tl.recorder; tl.recorder = null; try { mr.stop(); } catch { /* already stopped */ } const b = $('#tl-rec'); if (b) b.disabled = false; toast(t('tl.saved')); }
export function closeTimelapse() {
  if (!tl) return; if (tl.recorder) stopRecording();
  const cb = tl.onClose; tl = null; app.scene.setMark(null); document.body.classList.remove('tl'); app.scene.setTool(null); app.scene.resize(); cb && cb();
}
export { STAIN_IDS, seasonOf, hijri };
