// Business state: wallet + central ledger, calendar, weather, bookings, progression, save/load.
// No DOM and no rendering; storage is injected so the same code runs in tests and the balance bot.
import { ECON, TOOLS, GEAR, CHEMS, CHEM_IDS, BOTTLE_ML, ARCHETYPES, DISTRICTS, SEASONS, EVENTS, SIZES, PATTERNS, MATERIALS,
  STAIN_IDS, REQUESTS, SKILLS, RANKS, NAMES, BRAND_DEFAULT, RUG_VALUE_PER_M2, USED_RUG_MARKUP } from './content.js';
import { mulberry32, clamp } from './rng.js';

export const SAVE_VERSION = 3;
export const SAVE_KEY = 'rugempire.save.v1';
const DAY_MS = 86400000;
const EPOCH = Date.UTC(2027, 0, 1);

export function newGame(seed = (Date.now() & 0x7fffffff)) {
  const s = {
    v: SAVE_VERSION, seed, rngState: seed, cash: 0, ledger: [], day: 1, hour: ECON.dayStart,
    rep: { household: 0, premium: 0, commercial: 0, community: 0 }, xp: 0, level: 0, sp: 0, skills: {},
    tools: { beater: 1, bucket: 1, chem: 1, brush: 1, squeegee: 1, comb: 1 }, gear: {},
    stock: { shampoo: 1000, alkaline: 300 }, machine: { cond: 1 },
    premises: 'home', rentDue: 0, missedRent: 0, insured: false, staff: {},
    brand: { ...BRAND_DEFAULT }, orders: [], jobNo: 0, rugs: [], market: [], offers: [],
    sandouq: null, today: { events: [], weather: 'clear' }, news: [],
    stats: { jobs: 0, perfect: 0, earned: 0, damaged: 0, sold: 0, water: 0, bestScore: 0 }, ach: {},
    tutorial: 0,
  };
  tx(s, 'start', ECON.startCash, 'capital');
  startDay(s, true);
  return s;
}

// --- money: every balance change goes through here -------------------------------------------
export function tx(s, type, amount, ref = '') {
  if (!Number.isInteger(amount)) throw new Error('SDG amounts must be integers');
  if (s.cash + amount < 0) return false;
  s.cash += amount;
  s.ledger.push({ d: s.day, t: type, a: amount, b: s.cash, r: ref });
  if (s.ledger.length > 300) s.ledger.splice(0, s.ledger.length - 300);
  if (amount > 0 && type !== 'start' && type !== 'sandouq') s.stats.earned += amount;
  return true;
}
export const canAfford = (s, amount) => s.cash >= amount;

// --- helpers ----------------------------------------------------------------------------------
function rng(s) { // advances and persists the stream so reloads do not reroll outcomes
  const r = mulberry32(s.rngState);
  s.rngState = (s.rngState * 1664525 + 1013904223) >>> 0;
  return r;
}
export const totalRep = (s) => Math.max(0, s.rep.household + s.rep.premium + s.rep.commercial + s.rep.community);
export function rank(s) { const r = totalRep(s); let k = 0; for (let i = 0; i < RANKS.length; i++) if (r >= RANKS[i]) k = i; return k; }
export const has = (s, id) => !!(s.tools[id] || s.gear[id]);
export const skill = (s, id) => !!s.skills[id];

export function dateOf(day) { return new Date(EPOCH + (day - 1) * ECON.calendarStep * DAY_MS); }
let hijriFmt;
export function hijri(date) {
  try {
    hijriFmt ||= new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { month: 'numeric', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    const p = {}; for (const part of hijriFmt.formatToParts(date)) p[part.type] = parseInt(part.value, 10);
    if (p.month) return { y: p.year, m: p.month, d: p.day };
  } catch { /* fall through */ }
  return { y: 1448, m: 1, d: 1 };
}
export function seasonOf(day) {
  const m = dateOf(day).getUTCMonth() + 1;
  for (const id in SEASONS) if (SEASONS[id].months.includes(m)) return id;
  return 'cool';
}
// Islamic-calendar demand: the run-up to both Eids is the busiest time of the year.
export function occasion(day) {
  const h = hijri(dateOf(day));
  if (h.m === 9 && h.d >= 15) return 'preEid';
  if (h.m === 9) return 'ramadan';
  if (h.m === 10 && h.d <= 3) return 'eid';
  if (h.m === 12 && h.d <= 9) return 'preAdha';
  if (h.m === 12 && h.d <= 13) return 'eid';
  return null;
}
export function env(s) {
  const se = SEASONS[seasonOf(s.day)], w = s.today.weather;
  return { season: seasonOf(s.day), weather: w, temp: se.temp * (w === 'rain' ? 0.85 : 1), humid: w === 'rain' ? 0.9 : se.humid,
    indoor: ECON.premises[s.premises].indoor, power: !s.today.events.includes('powercut') || has(s, 'generator'),
    water: !s.today.events.includes('watercut') || has(s, 'tank') };
}

// --- day cycle --------------------------------------------------------------------------------
export function startDay(s, first = false) {
  const r = rng(s), se = SEASONS[seasonOf(s.day)];
  s.hour = ECON.dayStart;
  s.today = { events: [], weather: r.chance(se.rain) ? 'rain' : r.chance(se.dust) ? 'dust' : 'clear' };
  if (!first) for (const id in EVENTS) {
    const e = EVENTS[id];
    if ((!e.needs || has(s, e.needs)) && r.chance(e.p)) s.today.events.push(id);
  }
  const occ = occasion(s.day);
  const demand = se.demand * (occ === 'preEid' || occ === 'preAdha' ? 1.7 : occ === 'ramadan' ? 0.8 : 1) * (s.today.events.includes('referral') ? 1.5 : 1);
  s.orders = s.orders.filter((o) => (o.expires -= 1) > 0);
  // word of mouth: a poor reputation thins out bookings, a strong one adds a few
  let want = Math.round((ECON.premises[s.premises].jobsPerDay + (skill(s, 'marketing') ? 1 : 0)) * demand * clamp(0.85 + totalRep(s) / 150, 0.5, 1.3));
  if (first) want = 2;
  for (let k = 0; k < want && s.orders.length < 7; k++) s.orders.push(genJob(s, r, first && k === 0));
  // used-rug offers and walk-in buyers
  s.market = [];
  if (s.premises !== 'home') for (let k = 0; k < 2 + (occ ? 1 : 0); k++) s.market.push(genUsedRug(s, r));
  s.offers = [];
  for (const rug of s.rugs) if (rug.status === 'for-sale') {
    const fair = suggestedPrice(s, rug), ratio = rug.price / fair;
    const visit = (ECON.premises[s.premises].showroom ? 0.6 : 0.35) * (occ ? 1.4 : 1);
    if (!r.chance(visit)) continue;
    if (ratio <= 0.9 || r.chance(clamp(1.5 - ratio))) s.offers.push({ rugId: rug.id, price: rug.price, buyer: r.int(12), g: r.chance(0.5) ? 'm' : 'f' });
    else if (ratio < 1.6) s.offers.push({ rugId: rug.id, price: Math.round(Math.min(rug.price, fair) * r.range(0.8, 0.95) / 500) * 500, buyer: r.int(12), g: r.chance(0.5) ? 'm' : 'f', haggle: true });
  }
}

export function genSpec(r, o = {}) {
  const sizeKey = o.size || r.pick(Object.keys(SIZES)), size = SIZES[sizeKey];
  const material = o.material || r.pick(Object.keys(MATERIALS));
  const nst = o.stains ?? r.weighted([0, 1, 2, 3], (k) => [2, 4, 3, 1][k]);
  const stains = [];
  for (let k = 0; k < nst; k++) stains.push({ type: r.weighted(STAIN_IDS, (t) => (t === 'tea' || t === 'grease' ? 3 : t === 'old' || t === 'henna' ? 1 : 2)),
    u: r.range(0.15, 0.85), v: r.range(0.12, 0.88), r: r.range(0.14, 0.28), sev: r.range(0.55, 1) });
  const unstableP = { handwoven: 0.5, wool: 0.3, cotton: 0.25 }[material] ?? 0.03;
  return { seed: r.int(1e9), sizeKey, w: size.w, h: size.h, material, pattern: o.pattern || (sizeKey === 'prayer' ? 'prayer' : r.pick(PATTERNS)),
    dust: r.range(0.25, 0.9), soil: r.range(0.3, 0.85), deep: r.range(0.15, 0.7), stains, unstable: r.chance(unstableP) };
}

export function genJob(s, r, easy = false) {
  const rep = totalRep(s);
  const aid = easy ? 'budget' : r.weighted(Object.keys(ARCHETYPES).filter((a) => ARCHETYPES[a].minRep <= rep), (a) => ARCHETYPES[a].weight);
  const a = ARCHETYPES[aid];
  const spec = genSpec(r, easy ? { size: 'small', material: 'polypropylene', stains: 1 } : { size: r.pick(a.sizes), material: r.pick(a.mats) });
  if (easy) { spec.unstable = false; spec.stains[0].type = 'tea'; }
  const mat = MATERIALS[spec.material], cls = SIZES[spec.sizeKey].cls, occ = occasion(s.day);
  const rush = !easy && r.chance((a.rush || 0.15) + (occ === 'preEid' || occ === 'preAdha' ? 0.35 : 0));
  let fair = ECON.jobBase[cls] + (mat.delicate ? ECON.delicateFee : 0) + spec.stains.length * 800;
  fair = Math.round(fair * a.budget * (rush ? 1 + ECON.rushPct / 100 : 1) / 500) * 500;
  const requests = [];
  if (!easy) {
    const pool = REQUESTS.filter((q) => (q !== 'stainfree' || spec.stains.length) && (q !== 'dryfast' || rush));
    if (mat.delicate && r.chance(0.6)) requests.push('gentle');
    if (r.chance(0.55)) { const q = r.pick(pool); if (!requests.includes(q)) requests.push(q); }
  }
  const area = spec.w * spec.h;
  const districts = Object.keys(DISTRICTS).filter((d) => DISTRICTS[d].minRep <= rep);
  return { id: ++s.jobNo, arch: aid, g: r.chance(0.5) ? 'm' : 'f', name: r.int(12), district: easy ? 'nakheel' : r.pick(districts), spec, rush, fair,
    maxBudget: Math.round(fair * r.range(1.05, 1.35) / 500) * 500, requests, deadline: rush ? 8 : 30, expires: rush ? 1 : 3,
    par: parTime(spec), waterBudget: Math.round(area * 9), value: rugValue(spec),
    price: 0, inspected: false, tested: false };
}

export function parTime(spec) { return Math.round(spec.w * spec.h * 60 + spec.stains.length * 15 + 40); }
export function rugValue(spec) { return Math.round(spec.w * spec.h * RUG_VALUE_PER_M2 * MATERIALS[spec.material].value / 500) * 500; }

// Quote handling: accept, counter-offer, or walk away. Deterministic per job+quote.
export function negotiate(s, job, quote, firm = false) {
  const a = ARCHETYPES[job.arch], r = mulberry32(job.id * 7919 + quote + (firm ? 13 : 0));
  if (quote <= job.maxBudget) return { result: 'accept', price: quote };
  const over = quote / job.maxBudget - 1;
  if (firm) {
    const p = clamp(a.patience * 0.6 + totalRep(s) / 200 - over * 2.2);
    return r.chance(p) ? { result: 'accept', price: quote } : { result: 'leave' };
  }
  // the further above their ceiling you ask, the likelier they walk; the counter-offer anchors on the usual price
  if (over > 0.15 && r.chance(Math.min(0.85, over * (1.6 - a.patience)))) return { result: 'leave' };
  return { result: 'counter', price: Math.round(job.fair * 0.95 / 500) * 500 };
}

export function travelHours(s, job) {
  if (job.own || (s.premises !== 'home' && !has(s, 'tuktuk'))) return 0; // customers drop rugs at the workshop
  const k = has(s, 'tuktuk') ? 0.35 : has(s, 'trolley') ? 0.8 : 1;
  return Math.round(DISTRICTS[job.district].travel * 2 * k * (s.today.events.includes('puncture') ? 2 : 1) * 4) / 4;
}

// Called when the cleaning + drying of a customer job is finished. Returns the settlement.
export function settleJob(s, job, score, workSeconds, dryHours, used) {
  const a = ARCHETYPES[job.arch];
  for (const c in used.chemMl) s.stock[c] = Math.max(0, Math.round((s.stock[c] || 0) - used.chemMl[c]));
  s.stats.water += Math.round(used.waterL);
  if (used.machine) s.machine.cond = Math.max(0, s.machine.cond - (skill(s, 'upkeep') ? 0.012 : 0.025));
  s.hour += travelHours(s, job) + Math.max(0.75, workSeconds / 100);
  if (has(s, 'tuktuk') && travelHours(s, job) > 0) tx(s, 'fuel', -Math.min(s.cash, ECON.fuelPerTrip), '#' + job.id);
  if (used.electric) tx(s, 'power', -Math.min(s.cash, ECON.electricityPerJob), '#' + job.id);
  let pay = 0, claim = 0, tip = 0;
  if (job.own) { // the player's own stock rug: no customer, the result is the rug's condition
    const rug = s.rugs.find((x) => x.id === job.rugId);
    if (rug) { rug.clean = true; rug.score = score.total; rug.stars = score.stars; rug.status = 'gallery'; rug.damaged = score.damaged; }
  } else {
    const pct = score.damaged ? 0 : score.total >= 70 ? 100 : score.total >= 55 ? 60 : 30;
    pay = Math.round(job.price * pct / 100 / 500) * 500;
    if (score.total >= 85) tip = Math.round(job.price * (score.total >= 95 ? 0.15 : 0.08) / 500) * 500;
    if (score.damaged) { claim = Math.round(job.value * 0.5 * (s.insured ? 0.3 : 1) / 500) * 500; s.stats.damaged++; }
    const delta = clamp((score.total - a.expect) / (score.total < a.expect ? 5 : 8), -5, 3.5) - (score.damaged ? 3 : 0) + (score.total >= 70 ? 0.3 : 0);
    s.rep[a.track] = Math.max(-5, s.rep[a.track] + delta);
  }
  s.stats.jobs++; if (score.total >= 95) s.stats.perfect++;
  s.stats.bestScore = Math.max(s.stats.bestScore, score.total);
  s.xp += score.total;
  let leveled = false;
  while (s.xp >= 150 * (s.level + 1)) { s.xp -= 150 * (s.level + 1); s.level++; s.sp++; leveled = true; }
  s.orders = s.orders.filter((o) => o.id !== job.id);
  return { pay, tip, claim, leveled, dryHours };
}
// Payment and claims are booked separately once the cash interaction is done.
export function bookPayment(s, job, st) {
  if (st.pay + st.tip > 0) tx(s, 'job', st.pay + st.tip, '#' + job.id);
  if (st.claim > 0) tx(s, 'claim', -Math.min(s.cash, st.claim), '#' + job.id);
}

export function endDay(s) {
  const report = { wages: 0, staffIncome: 0, rent: 0, evicted: false, sandouq: 0, payout: 0, insurance: 0 };
  const r = rng(s);
  for (const role of ['helper', 'cleaner']) if (s.staff[role]) {
    const wage = ECON[role + 'Wage'];
    if (tx(s, 'wage', -wage, role)) {
      report.wages += wage;
      const st = s.staff[role];
      const q = clamp(st.skill + r.range(-8, 8), 40, 96);
      const inc = Math.round(ECON.jobBase[role === 'helper' ? 'S' : 'M'] * (q >= 70 ? 1 : 0.7) / 500) * 500;
      tx(s, 'staffjob', inc, role); report.staffIncome += inc;
      s.rep.household = Math.max(-5, s.rep.household + (q - 72) / 40);
      st.skill = Math.min(92, st.skill + 0.4); // apprentices learn on the job
    } else { delete s.staff[role]; report.quit = role; }
  }
  s.day++;
  if (s.premises !== 'home' && s.day >= s.rentDue) {
    const p = ECON.premises[s.premises];
    if (tx(s, 'rent', -p.rent, s.premises)) { report.rent = p.rent; s.missedRent = 0; }
    else if (++s.missedRent >= 2) { s.premises = 'home'; s.staff = {}; s.missedRent = 0; report.evicted = true; for (const x of s.rugs) if (x.status === 'for-sale') x.status = 'gallery'; }
    else report.rentMissed = true;
    s.rentDue = s.day + ECON.rentEveryDays;
    if (s.insured) { if (tx(s, 'insurance', -ECON.insurance, '')) report.insurance = ECON.insurance; else s.insured = false; }
    if (s.sandouq && s.sandouq.paid < s.sandouq.members) {
      const q = s.sandouq;
      if (tx(s, 'sandouq', -q.share, 'share ' + (q.paid + 1))) { q.paid++; report.sandouq = q.share; } else { q.missed = (q.missed || 0) + 1; }
      if (q.paid === q.turn && !q.received) { tx(s, 'sandouq', q.share * q.members, 'payout'); q.received = true; report.payout = q.share * q.members; }
      if (q.paid >= q.members) s.sandouq = null;
    }
  }
  startDay(s);
  return report;
}

// --- purchases --------------------------------------------------------------------------------
export function supplyPrice(s, chem) {
  return Math.round(CHEMS[chem].price * (skill(s, 'suppliers') ? 0.85 : 1) * (s.today.events.includes('discount') ? 0.75 : 1) / 50) * 50;
}
export function chemAvailable(s, chem) { return s.level >= CHEMS[chem].unlock && (chem !== 'acid' || skill(s, 'acidrinse')); }
export function buyChem(s, chem) {
  if (!chemAvailable(s, chem) || !tx(s, 'supplies', -supplyPrice(s, chem), chem)) return false;
  s.stock[chem] = (s.stock[chem] || 0) + BOTTLE_ML; return true;
}
export function buyItem(s, id) {
  const def = TOOLS[id] || GEAR[id]; if (!def || has(s, id)) return false;
  if (!tx(s, 'equipment', -def.price, id)) return false;
  if (TOOLS[id]) s.tools[id] = 1; else s.gear[id] = 1;
  return true;
}
export function serviceMachine(s) { if (!tx(s, 'service', -ECON.machineService, 'rotary')) return false; s.machine.cond = 1; return true; }
export function rentPremises(s, id) {
  const p = ECON.premises[id]; if (!p || id === s.premises || totalRep(s) < (p.needRep || 0)) return false;
  if (!tx(s, 'deposit', -(p.deposit + p.rent), id)) return false;
  s.premises = id; s.rentDue = s.day + ECON.rentEveryDays; s.missedRent = 0; return true;
}
export function hire(s, role) {
  if (s.staff[role] || !ECON.premises[s.premises].racks) return false;
  if (!tx(s, 'hire', -ECON[role + 'Hire'], role)) return false;
  s.staff[role] = { skill: role === 'helper' ? 62 : 76 }; return true;
}
export function learnSkill(s, id) {
  const d = SKILLS[id]; if (!d || s.skills[id] || s.sp < d.cost) return false;
  s.sp -= d.cost; s.skills[id] = 1; return true;
}
export function joinSandouq(s, share = 50000) {
  if (s.sandouq || s.premises === 'home') return false;
  const r = rng(s); s.sandouq = { share, members: 6, paid: 0, turn: 2 + r.int(3), received: false }; return true;
}
export function toggleInsurance(s) { s.insured = !s.insured; return s.insured; }
export function rebrand(s, brand, free = false) {
  if (!free && !tx(s, 'brand', -ECON.rebrandFee, 'rebrand')) return false;
  s.brand = { ...s.brand, ...brand }; return true;
}

// --- used rugs: buy dirty, clean, sell --------------------------------------------------------
function genUsedRug(s, r) {
  const spec = genSpec(r); spec.dust = Math.max(spec.dust, 0.6); spec.soil = Math.max(spec.soil, 0.55);
  const value = rugValue(spec);
  return { id: 'u' + s.day + '-' + r.int(1e6), spec, value, cost: Math.round(value * USED_RUG_MARKUP.buy * r.range(0.8, 1.2) / 500) * 500 };
}
export function buyUsedRug(s, id) {
  const k = s.market.findIndex((m) => m.id === id); if (k < 0) return false;
  const m = s.market[k]; if (!tx(s, 'stock', -m.cost, m.id)) return false;
  s.market.splice(k, 1);
  s.rugs.push({ id: m.id, spec: m.spec, value: m.value, cost: m.cost, clean: false, status: 'stock', ownership: 'owned', day: s.day });
  return true;
}
export function suggestedPrice(s, rug) {
  const occ = occasion(s.day);
  const q = rug.damaged ? 0.4 : 0.55 + (rug.score || 0) / 100 * 0.65;
  return Math.round(rug.value * q * (occ === 'preEid' || occ === 'preAdha' ? 1.2 : 1) / 500) * 500;
}
export function listRug(s, id, price) {
  const rug = s.rugs.find((x) => x.id === id);
  if (!rug || !rug.clean || rug.ownership !== 'owned' || rug.status === 'sold' || !Number.isInteger(price) || price <= 0) return false;
  rug.status = 'for-sale'; rug.price = price; return true;
}
export function acceptOffer(s, k) {
  const o = s.offers[k]; if (!o) return false;
  const rug = s.rugs.find((x) => x.id === o.rugId); if (!rug || rug.status !== 'for-sale') return false;
  tx(s, 'sale', o.price, rug.id); rug.status = 'sold'; rug.soldFor = o.price; s.stats.sold++;
  s.offers = s.offers.filter((x) => x.rugId !== o.rugId);
  s.rep.premium += 0.3; return true;
}

// --- persistence ------------------------------------------------------------------------------
export function save(s, storage) { try { storage.setItem(SAVE_KEY, JSON.stringify(s)); return true; } catch { return false; } }
export function load(storage) {
  let raw; try { raw = storage.getItem(SAVE_KEY); } catch { return null; }
  if (!raw) return null;
  try { return migrate(JSON.parse(raw)); } catch { return null; } // corrupted save: start clean rather than crash
}
export function migrate(s) {
  if (!s || typeof s !== 'object' || !Number.isInteger(s.cash) || !Array.isArray(s.ledger)) return null;
  const base = newGame(s.seed || 1);
  for (const k in base) if (s[k] === undefined) s[k] = base[k];
  for (const k in base.stats) if (s.stats[k] === undefined) s.stats[k] = base.stats[k];
  for (const k in base.rep) if (typeof s.rep[k] !== 'number') s.rep[k] = 0;
  s.v = SAVE_VERSION;
  return s;
}
export { CHEM_IDS };
