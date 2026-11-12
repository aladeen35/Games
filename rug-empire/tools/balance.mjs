// Headless economy check: bot players run many virtual days without graphics.
// Usage: node tools/balance.mjs [days=180] [runs=40]
import * as G from '../src/state.js';
import { ECON, TOOLS, GEAR } from '../src/content.js';
import { mulberry32 } from '../src/rng.js';
const DAYS = +process.argv[2] || 180, RUNS = +process.argv[3] || 40;
const BOTS = {
  careful: { mean: 84, sd: 6, jobs: 2, damage: 0.005, quote: 1.0, trade: false },
  rushed: { mean: 66, sd: 11, jobs: 4, damage: 0.06, quote: 1.15, trade: false },
  trader: { mean: 78, sd: 8, jobs: 2, damage: 0.02, quote: 1.05, trade: true },
  greedy: { mean: 84, sd: 6, jobs: 2, damage: 0.005, quote: 1.6, trade: false }, // always overprices: must not be the best plan
};
const BUY = ['trolley', 'hose', 'softbrush', 'vacuum', 'meter', 'rotary', 'wetvac', 'fans', 'tank', 'generator', 'washer', 'tuktuk'];
const PREM = ['stall', 'workshop', 'centre'];
function run(bot, seed) {
  const b = BOTS[bot], r = mulberry32(seed * 977 + 13), s = G.newGame(seed), log = { prem: {}, rotary: null, evicted: 0, broke: 0 };
  const gauss = () => (r() + r() + r() + r() - 2) * 1.7;
  for (let day = 1; day <= DAYS; day++) {
    const bonus = (s.tools.rotary ? 4 : 0) + (s.tools.wetvac ? 3 : 0) + (s.tools.softbrush ? 2 : 0) + Math.min(6, s.level);
    let done = 0;
    for (const j of s.orders.slice()) {
      if (done >= b.jobs || s.hour >= ECON.dayEnd - 1) break;
      const quote = Math.round(j.fair * b.quote / 500) * 500; let res = G.negotiate(s, j, quote);
      if (res.result === 'counter') res = { result: 'accept', price: res.price };
      if (res.result !== 'accept') { s.orders = s.orders.filter((o) => o !== j); s.rep.household -= 0.3; continue; }
      j.price = res.price;
      const total = Math.max(20, Math.min(100, Math.round(b.mean + bonus + gauss() * b.sd))), damaged = r() < b.damage;
      const used = { chemMl: { shampoo: 150 * j.spec.w * j.spec.h / 2 }, waterL: 20, machine: !!s.tools.rotary, electric: !!s.tools.rotary };
      if ((s.stock.shampoo || 0) < 300) G.buyChem(s, 'shampoo');
      const st = G.settleJob(s, j, { total: damaged ? Math.min(total, 50) : total, stars: 3, damaged }, j.par * 1.1, 6, used); G.bookPayment(s, j, st); done++;
    }
    if (b.trade && s.premises !== 'home') {
      for (const u of s.market.slice(0, 1)) if (s.cash > u.cost * 3) { G.buyUsedRug(s, u.id); const rug = s.rugs[s.rugs.length - 1]; G.settleJob(s, { id: ++s.jobNo, own: true, rugId: rug.id, arch: 'budget' }, { total: 82, stars: 3, damaged: false }, 150, 6, { chemMl: { shampoo: 200 }, waterL: 20 }); G.listRug(s, rug.id, G.suggestedPrice(s, rug)); }
      while (s.offers.length) G.acceptOffer(s, 0);
    }
    if (s.machine.cond < 0.4) G.serviceMachine(s);
    const reserve = s.premises === 'home' ? 15000 : ECON.premises[s.premises].rent * 1.5 + 20000;
    for (const id of BUY) { const d = TOOLS[id] || GEAR[id]; if (!G.has(s, id) && s.cash > d.price + reserve) { G.buyItem(s, id); if (id === 'rotary') log.rotary = day; break; } }
    const next = PREM[PREM.indexOf(s.premises) + 1];
    if (next) { const p = ECON.premises[next]; if (G.totalRep(s) >= p.needRep && s.cash > p.deposit + p.rent * 3 && G.rentPremises(s, next)) log.prem[next] = day; }
    for (const id of ['marketing', 'suppliers', 'upkeep', 'haggle']) G.learnSkill(s, id);
    if (s.premises !== 'home' && ECON.premises[s.premises].racks && !s.staff.helper && s.cash > 150000) G.hire(s, 'helper');
    const rep = G.endDay(s); if (rep.evicted) log.evicted++;
    if (s.cash < 2000 && !s.orders.length) log.broke++;
    let bal = 0; for (const e of s.ledger.slice(-5)) bal = e.b; if (s.ledger.length && bal !== s.cash) throw new Error('ledger mismatch');
  }
  return { ...log, cash: s.cash, earned: s.stats.earned, rep: G.totalRep(s), rank: G.rank(s), jobs: s.stats.jobs };
}
const med = (a) => { const v = a.filter((x) => x !== null && x !== undefined).sort((x, y) => x - y); return v.length ? v[Math.floor(v.length / 2)] : '—'; };
console.log(`Balance report: ${RUNS} runs × ${DAYS} working days per bot\n`);
console.log('bot      | stall day | workshop | centre | rotary | median cash | median earned | rank | evictions | broke-days');
const out = {};
for (const bot in BOTS) {
  const rs = []; for (let i = 1; i <= RUNS; i++) rs.push(run(bot, i));
  out[bot] = med(rs.map((x) => x.earned));
  console.log([bot.padEnd(8), String(med(rs.map((x) => x.prem.stall))).padStart(9), String(med(rs.map((x) => x.prem.workshop))).padStart(8), String(med(rs.map((x) => x.prem.centre))).padStart(6), String(med(rs.map((x) => x.rotary))).padStart(6),
    String(med(rs.map((x) => x.cash)).toLocaleString()).padStart(11), String(out[bot].toLocaleString()).padStart(13), String(med(rs.map((x) => x.rank))).padStart(4), String(rs.reduce((a, x) => a + x.evicted, 0)).padStart(9), String(rs.reduce((a, x) => a + x.broke, 0)).padStart(10)].join(' | '));
}
const issues = [];
if (out.greedy > out.careful * 1.1) issues.push('overpricing beats careful work');
if (out.rushed > out.careful * 1.5) issues.push('rushed low-quality work beats careful work by a wide margin');
console.log(issues.length ? '\nISSUES: ' + issues.join('; ') : '\nNo dominant exploit found by these bots.');
