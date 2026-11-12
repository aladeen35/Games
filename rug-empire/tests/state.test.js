import { describe, it, expect } from 'vitest';
import * as G from '../src/state.js';
import { ECON, TOOLS } from '../src/content.js';
import { STR } from '../src/strings.js';
import { tl } from '../src/i18n.js';

const mem = () => { const m = {}; return { getItem: (k) => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, m }; };
const score = (total, o = {}) => ({ total, stars: total >= 95 ? 5 : total >= 85 ? 4 : total >= 70 ? 3 : total >= 55 ? 2 : 1, damaged: false, ...o });
const used = { chemMl: { shampoo: 120 }, waterL: 14, machine: false, electric: false };

describe('wallet and ledger', () => {
  it('starts with the configured capital and records it', () => { const s = G.newGame(1); expect(s.cash).toBe(ECON.startCash); expect(s.ledger[0]).toMatchObject({ t: 'start', a: ECON.startCash, b: ECON.startCash }); });
  it('rejects non-integer amounts and overdrafts', () => { const s = G.newGame(1); expect(() => G.tx(s, 'x', 10.5)).toThrow(); expect(G.tx(s, 'x', -s.cash - 1)).toBe(false); expect(s.cash).toBe(ECON.startCash); });
  it('ledger balance always reconciles with cash', () => {
    const s = G.newGame(3); G.buyChem(s, 'shampoo'); G.buyItem(s, 'trolley'); G.tx(s, 'job', 15000, '#1');
    let bal = 0; for (const e of s.ledger) { bal += e.a; expect(e.b).toBe(bal); } expect(bal).toBe(s.cash);
  });
  it('cannot buy what it cannot afford or already owns', () => { const s = G.newGame(1); expect(G.buyItem(s, 'rotary')).toBe(false); expect(s.tools.rotary).toBeUndefined(); expect(G.buyItem(s, 'trolley')).toBe(true); expect(G.buyItem(s, 'trolley')).toBe(false); });
});
describe('jobs and progression', () => {
  it('generates valid deterministic bookings', () => { const a = G.newGame(42), b = G.newGame(42); expect(a.orders).toEqual(b.orders); for (const j of a.orders) { expect(j.fair % 500).toBe(0); expect(j.maxBudget).toBeGreaterThanOrEqual(j.fair); } });
  it('negotiation accepts within budget and counters above it', () => {
    const s = G.newGame(5), j = s.orders[0];
    expect(G.negotiate(s, j, j.fair).result).toBe('accept'); const r = G.negotiate(s, j, j.maxBudget + 500); expect(['counter', 'leave']).toContain(r.result); if (r.result === 'counter') expect(r.price).toBeLessThanOrEqual(j.maxBudget);
  });
  it('pays by quality band and books it through the ledger', () => {
    for (const [total, pct] of [[96, 100], [75, 100], [60, 60], [40, 30]]) {
      const s = G.newGame(9), j = s.orders[0]; j.price = 10000; const st = G.settleJob(s, j, score(total), 120, 5, used); G.bookPayment(s, j, st);
      expect(st.pay).toBe(10000 * pct / 100); expect(s.cash).toBe(ECON.startCash + st.pay + st.tip); expect(s.orders.find((o) => o.id === j.id)).toBeUndefined();
    }
  });
  it('a damaged rug pays nothing and raises a claim; insurance covers 70%', () => {
    const a = G.newGame(9), ja = a.orders[0]; ja.price = 10000; const sa = G.settleJob(a, ja, score(50, { damaged: true }), 120, 5, used);
    const b = G.newGame(9); b.insured = true; const jb = b.orders[0]; jb.price = 10000; const sb = G.settleJob(b, jb, score(50, { damaged: true }), 120, 5, used);
    expect(sa.pay).toBe(0); expect(sa.claim).toBeGreaterThan(0); expect(sb.claim).toBeLessThan(sa.claim * 0.4);
  });
  it('consumes chemical stock and never goes negative', () => { const s = G.newGame(9), j = s.orders[0]; G.settleJob(s, j, score(80), 100, 3, { ...used, chemMl: { shampoo: 5000 } }); expect(s.stock.shampoo).toBe(0); });
  it('rent is charged on schedule and two misses evict', () => {
    const s = G.newGame(2); s.rep.household = 50; G.tx(s, 'job', 400000, 't'); expect(G.rentPremises(s, 'stall')).toBe(true);
    G.tx(s, 'x', -s.cash, 'drain'); let evicted = false;
    for (let d = 0; d < 25 && !evicted; d++) evicted = G.endDay(s).evicted;
    expect(evicted).toBe(true); expect(s.premises).toBe('home');
  });
  it('used rugs: buy, clean, list, sell reconciles stock and cash', () => {
    const s = G.newGame(4); s.rep.household = 50; G.tx(s, 'job', 600000, 't'); G.rentPremises(s, 'stall'); G.startDay(s);
    const u = s.market[0], cash0 = s.cash; expect(G.buyUsedRug(s, u.id)).toBe(true); expect(s.cash).toBe(cash0 - u.cost);
    expect(G.listRug(s, u.id, 20000)).toBe(false); // dirty rugs cannot be listed
    G.settleJob(s, { id: 99, own: true, rugId: u.id, arch: 'budget' }, score(90), 100, 3, used);
    expect(G.listRug(s, u.id, 20000)).toBe(true); s.offers = [{ rugId: u.id, price: 20000 }]; const c1 = s.cash;
    expect(G.acceptOffer(s, 0)).toBe(true); expect(s.cash).toBe(c1 + 20000); expect(s.rugs[0].status).toBe('sold'); expect(G.acceptOffer(s, 0)).toBe(false);
  });
  it('the sandouq pays out exactly what members put in', () => {
    const s = G.newGame(6); s.rep.household = 50; G.tx(s, 'job', 5000000, 't'); G.rentPremises(s, 'stall'); G.joinSandouq(s);
    for (let d = 0; d < 80 && s.sandouq; d++) G.endDay(s);
    const q = s.ledger.filter((e) => e.t === 'sandouq'); expect(q.reduce((a, e) => a + e.a, 0)).toBe(0); expect(q.length).toBe(7);
  });
  it('calendar: seasons follow the month and the Hijri date is derived', () => { expect(G.seasonOf(1)).toBe('cool'); expect(G.seasonOf(70)).toBe('rainy'); const h = G.hijri(G.dateOf(1)); expect(h.m).toBeGreaterThan(0); expect(h.y).toBeGreaterThan(1440); });
});
describe('save/load', () => {
  it('round-trips business progress', () => { const st = mem(), s = G.newGame(8); G.buyItem(s, 'trolley'); G.save(s, st); expect(G.load(st)).toEqual(s); });
  it('survives corrupted and old saves', () => {
    const st = mem(); st.setItem(G.SAVE_KEY, '{broken'); expect(G.load(st)).toBe(null);
    st.setItem(G.SAVE_KEY, JSON.stringify({ cash: 1000, ledger: [], seed: 3 })); const s = G.load(st); expect(s.cash).toBe(1000); expect(s.tools.brush).toBe(1); expect(s.v).toBe(G.SAVE_VERSION);
    st.setItem(G.SAVE_KEY, JSON.stringify({ cash: 'x' })); expect(G.load(st)).toBe(null);
  });
});
describe('localisation', () => {
  it('every string has Arabic and English, and placeholders match', () => {
    for (const k in STR) { const [ar, sd, en] = STR[k]; expect(ar, k).toBeTruthy(); expect(en, k).toBeTruthy();
      const ph = (x) => (x.match(/\{\w+\}/g) || []).sort().join(); if (!/\.(one|two)$/.test(k)) expect(ph(en), k).toBe(ph(ar)); if (sd && !/\.(one|two)$/.test(k)) expect(ph(sd), k).toBe(ph(ar)); }
  });
  it('falls back ar-SD -> ar -> en', () => { expect(tl('ar-SD', 'dlg.ask')).toContain('يا زول'); expect(tl('ar-SD', 'sc.clean')).toBe(STR['sc.clean'][0]); expect(tl('en', 'sc.clean')).toBe('Cleaning result'); });
  it('covers every tool, gear and data id used by the UI', () => { for (const id in TOOLS) expect(STR['tool.' + id], id).toBeTruthy(); });
});
