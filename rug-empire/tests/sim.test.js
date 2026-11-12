import { describe, it, expect } from 'vitest';
import { createRug, applyTool, step, measure, cleanliness, dryStep, dryingHours, scoreJob, mixConflict } from '../src/sim.js';
import { TOOLS } from '../src/content.js';

const spec = (o = {}) => ({ seed: 7, w: 1.2, h: 1.7, material: 'polypropylene', dust: 0.6, soil: 0.6, deep: 0.4, stains: [{ type: 'tea', u: 0.5, v: 0.5, r: 0.2, sev: 0.9 }], unstable: false, ...o });
// sweep the whole rug with a tool for `passes` passes
function sweep(rug, tool, passes = 1, opts = {}) {
  const dt = 1 / 30, { w, h } = rug.spec;
  for (let p = 0; p < passes; p++) for (let y = 0; y <= h + 0.01; y += tool.radius * 0.9) for (let x = 0; x <= w + 0.01; x += 0.03) { applyTool(rug, tool, x, y, dt, { dx: 1, dy: 0, ...opts }); step(rug, dt); }
}
function fullWash(rug, o = {}) {
  sweep(rug, TOOLS.beater, 2);
  sweep(rug, TOOLS.bucket, 1, { temp: o.temp || 0 });
  sweep(rug, TOOLS.chem, 1, { chem: o.chem || 'shampoo' });
  sweep(rug, o.scrub || TOOLS.brush, o.scrubPasses || 3, { pressure: o.pressure ?? 0.6 });
  sweep(rug, TOOLS.bucket, 1); sweep(rug, TOOLS.squeegee, 3); sweep(rug, TOOLS.comb, 1);
}
const job = { par: 9999, requests: [], waterBudget: 999, late: false };
function finish(rug) { const pre = measure(rug); for (let k = 0; k < 24; k++) dryStep(rug, { method: 'shade', temp: 1, humid: 0.2 }, k, 24); return scoreJob(rug, pre, job); }

describe('cleaning simulation', () => {
  it('is deterministic for the same seed and inputs', () => {
    const a = createRug(spec()), b = createRug(spec()); fullWash(a); fullWash(b);
    expect(Array.from(a.soil)).toEqual(Array.from(b.soil)); expect(measure(a)).toEqual(measure(b));
  });
  it('a tool only affects cells inside its footprint', () => {
    const rug = createRug(spec()); const before = Float32Array.from(rug.wet);
    applyTool(rug, TOOLS.bucket, 0.3, 0.3, 0.5, {});
    for (let y = 0; y < rug.H; y++) for (let x = 0; x < rug.W; x++) { const d = Math.hypot(x / 28 - 0.3, y / 28 - 0.3); if (d > TOOLS.bucket.radius + 0.05) expect(rug.wet[y * rug.W + x]).toBe(before[y * rug.W + x]); }
    expect(measure(rug).wet).toBeGreaterThan(0);
  });
  it('a correct wash cleans the rug and scores well', () => {
    const rug = createRug(spec()); fullWash(rug);
    expect(cleanliness(rug)).toBeGreaterThan(0.75);
    const s = finish(rug); expect(s.total).toBeGreaterThanOrEqual(70); expect(s.safety).toBeGreaterThan(18);
  });
  it('scrubbing without water or detergent barely cleans', () => {
    const rug = createRug(spec()); sweep(rug, TOOLS.brush, 3, { pressure: 0.6 });
    expect(measure(rug).soil).toBeGreaterThan(rug.initial.soil * 0.8);
  });
  it('wetting loose dust turns it into mud', () => {
    const a = createRug(spec()), b = createRug(spec());
    sweep(a, TOOLS.bucket, 1); sweep(b, TOOLS.beater, 2); sweep(b, TOOLS.bucket, 1);
    expect(measure(a).soil).toBeGreaterThan(measure(b).soil + 0.1);
  });
  it('materials respond differently: hard rotary scrubbing damages handwoven, not polypropylene', () => {
    const tough = createRug(spec()), fine = createRug(spec({ material: 'handwoven' }));
    for (const r of [tough, fine]) fullWash(r, { scrub: TOOLS.rotary, pressure: 1, scrubPasses: 2 });
    expect(measure(tough).stress).toBeLessThan(0.005); expect(measure(fine).stress).toBeGreaterThan(0.05);
    expect(finish(fine).total).toBeLessThan(70); // looks clean but damaged must not score high
  });
  it('alkaline chemistry makes an unstable wool dye bleed; neutral shampoo does not', () => {
    const bad = createRug(spec({ material: 'wool', unstable: true })), ok = createRug(spec({ material: 'wool', unstable: true }));
    fullWash(bad, { chem: 'alkaline', pressure: 0.3 }); fullWash(ok, { chem: 'shampoo', pressure: 0.3 });
    expect(measure(bad).bleed).toBeGreaterThan(measure(ok).bleed * 3 + 0.005);
  });
  it('hot water sets protein stains so they can no longer be removed', () => {
    const st = [{ type: 'protein', u: 0.5, v: 0.5, r: 0.25, sev: 1 }];
    const hot = createRug(spec({ stains: st })), cold = createRug(spec({ stains: st }));
    fullWash(hot, { chem: 'enzyme', temp: 2 }); fullWash(cold, { chem: 'enzyme', temp: 0 });
    expect(measure(hot).stain).toBeGreaterThan(measure(cold).stain * 1.5);
  });
  it('the right chemistry beats the wrong one on a stain', () => {
    const st = [{ type: 'ink', u: 0.5, v: 0.5, r: 0.25, sev: 1 }];
    const right = createRug(spec({ stains: st })), wrong = createRug(spec({ stains: st }));
    fullWash(right, { chem: 'solvent' }); fullWash(wrong, { chem: 'shampoo' });
    expect(measure(right).stain).toBeLessThan(measure(wrong).stain * 0.6);
  });
  it('leaving the rug soaked wicks deep soil up while drying and takes longer', () => {
    const soaked = createRug(spec({ deep: 0.9, material: 'shag' })), dryish = createRug(spec({ deep: 0.9, material: 'shag' }));
    sweep(soaked, TOOLS.bucket, 2); sweep(dryish, TOOLS.bucket, 2); sweep(dryish, TOOLS.wetvac, 3);
    const env = { method: 'shade', temp: 1, humid: 0.2 };
    expect(dryingHours(soaked, env)).toBeGreaterThan(dryingHours(dryish, env) * 2);
    const s0 = measure(soaked).soil, d0 = measure(dryish).soil;
    for (let k = 0; k < 24; k++) { dryStep(soaked, env, k, 24); dryStep(dryish, env, k, 24); }
    expect(measure(soaked).soil - s0).toBeGreaterThan((measure(dryish).soil - d0) * 2);
    expect(measure(soaked).wet).toBeLessThan(0.01);
  });
  it('blocks chemicals that must not be mixed', () => {
    const rug = createRug(spec()); sweep(rug, TOOLS.bucket, 1); sweep(rug, TOOLS.chem, 1, { chem: 'oxy' });
    expect(mixConflict(rug, 'acid')).toBe('oxy'); expect(mixConflict(rug, 'shampoo')).toBe(null);
  });
  it('failed customer requests cost instruction points', () => {
    const rug = createRug(spec()); fullWash(rug, { chem: 'alkaline' });
    const pre = measure(rug); const s = scoreJob(rug, pre, { ...job, requests: ['nochem'] });
    expect(s.failed).toContain('nochem'); expect(s.instr).toBe(0);
  });
});
