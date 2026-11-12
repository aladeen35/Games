// Rug cleaning simulation. Pure logic: no rendering, no DOM. Deterministic for a
// given spec + sequence of calls, which is what the time-lapse replay relies on.
import { MATERIALS, STAINS, STAIN_IDS, CHEMS, CHEM_IDS, NO_MIX } from './content.js';
import { mulberry32, clamp } from './rng.js';

export const RES = 28; // cells per metre
const LAYERS = ['dust', 'soil', 'deep', 'stain', 'setf', 'wet', 'soap', 'foam', 'slurry', 'stress', 'bleed', 'heat', 'dwell', 'pass', 'napX', 'napY'];

function valueNoise(rnd, gw, gh) {
  const g = new Float32Array(gw * gh);
  for (let i = 0; i < g.length; i++) g[i] = rnd();
  return (u, v) => {
    const x = u * (gw - 1), y = v * (gh - 1);
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const x1 = Math.min(gw - 1, x0 + 1), y1 = Math.min(gh - 1, y0 + 1);
    const fx = x - x0, fy = y - y0;
    const a = g[y0 * gw + x0], b = g[y0 * gw + x1], c = g[y1 * gw + x0], d = g[y1 * gw + x1];
    return (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
  };
}

// spec: { seed, w, h, material, dust, soil, deep, stains:[{type,u,v,r,sev}], unstable }
export function createRug(spec) {
  const W = Math.max(8, Math.round(spec.w * RES)), H = Math.max(8, Math.round(spec.h * RES));
  const n = W * H;
  const rug = { spec, W, H, n, mat: MATERIALS[spec.material], time: 0, shrink: 0, diffuseT: 0,
    stainType: new Uint8Array(n), chem: new Uint8Array(n),
    stats: { waterL: 0, spillL: 0, chemMl: {}, strokes: 0, hot: false, harshChem: false } };
  for (const l of LAYERS) rug[l] = new Float32Array(n);
  const rnd = mulberry32(spec.seed);
  const n1 = valueNoise(rnd, 6, 8), n2 = valueNoise(rnd, 14, 18);
  const lane = rnd(); // traffic lane position
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, u = x / (W - 1), v = y / (H - 1);
    const noise = n1(u, v) * 0.65 + n2(u, v) * 0.35;
    const traffic = Math.exp(-Math.pow((u - 0.25 - lane * 0.5) * 3, 2));
    rug.dust[i] = clamp(spec.dust * (0.55 + noise * 0.9));
    rug.soil[i] = clamp(spec.soil * (0.3 + noise * 0.6 + traffic * 0.6));
    rug.deep[i] = clamp(spec.deep * rug.mat.deep * (0.3 + traffic * 0.7 + noise * 0.3));
    const a = rnd() * 6.283;
    rug.napX[i] = Math.cos(a) * 0.6; rug.napY[i] = Math.sin(a) * 0.6;
  }
  for (const s of spec.stains || []) {
    const id = STAIN_IDS.indexOf(s.type) + 1;
    const blobs = 3 + Math.floor(rnd() * 3);
    for (let b = 0; b < blobs; b++) {
      const cx = (s.u + (rnd() - 0.5) * s.r * 0.9 / spec.w) * (W - 1);
      const cy = (s.v + (rnd() - 0.5) * s.r * 0.9 / spec.h) * (H - 1);
      const rr = s.r * RES * (0.45 + rnd() * 0.55);
      forDisc(rug, cx, cy, rr, (i, f) => {
        const val = s.sev * Math.min(1, f * 2.2);
        if (val > rug.stain[i]) { rug.stain[i] = val; rug.stainType[i] = id; }
      });
    }
  }
  rug.initial = measure(rug);
  return rug;
}

function forDisc(rug, cx, cy, r, fn) {
  const x0 = Math.max(0, Math.floor(cx - r)), x1 = Math.min(rug.W - 1, Math.ceil(cx + r));
  const y0 = Math.max(0, Math.floor(cy - r)), y1 = Math.min(rug.H - 1, Math.ceil(cy + r));
  const r2 = r * r;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const d2 = (x - cx) * (x - cx) + (y - cy) * (y - cy);
    if (d2 < r2) fn(y * rug.W + x, 1 - d2 / r2, x, y);
  }
}

// Chemical safety: returns the id of a chemical already on the rug that must not meet `chemId`.
export function mixConflict(rug, chemId) {
  const present = {};
  for (let i = 0; i < rug.n; i += 3) if (rug.soap[i] > 0.15 && rug.chem[i]) present[rug.chem[i]] = (present[rug.chem[i]] || 0) + 1;
  for (const [a, b] of NO_MIX) {
    const other = a === chemId ? b : b === chemId ? a : null;
    if (other && (present[CHEM_IDS.indexOf(other) + 1] || 0) > rug.n / 3 * 0.02) return other;
  }
  return null;
}

// Apply a tool for dt seconds centred at (mx,my) metres from the rug's corner.
// opts: { pressure 0..1, temp 0|1|2 (cold/warm/hot), chem id, dx, dy (stroke direction), fast (machine speed) }
export function applyTool(rug, tool, mx, my, dt, opts = {}) {
  const cx = mx * RES, cy = my * RES, r = tool.radius * RES;
  const mat = rug.mat, st = rug.stats;
  const pressure = opts.pressure ?? 0.6;
  let dx = opts.dx || 0, dy = opts.dy || 0;
  const dl = Math.hypot(dx, dy); if (dl > 1e-6) { dx /= dl; dy /= dl; }
  // Fraction of the footprint that is off the rug (used for spills).
  const inside = clamp((Math.min(cx + r, rug.W) - Math.max(cx - r, 0)) / (2 * r)) * clamp((Math.min(cy + r, rug.H) - Math.max(cy - r, 0)) / (2 * r));
  st.strokes += dt;

  if (tool.kind === 'dry') {
    forDisc(rug, cx, cy, r, (i, f) => {
      const k = rug.wet[i] < 0.15 ? 1 : 0.08;
      rug.dust[i] = Math.max(0, rug.dust[i] - tool.power * f * dt * 2.6 * k);
      rug.pass[i] += f * dt * 0.3;
    });
  } else if (tool.kind === 'spray') {
    const temp = opts.temp || 0;
    st.waterL += tool.flow * dt; st.spillL += tool.flow * dt * (1 - inside);
    if (temp === 2) st.hot = true;
    forDisc(rug, cx, cy, r, (i, f) => {
      const add = tool.rate * f * dt;
      rug.wet[i] = Math.min(1.5, rug.wet[i] + add);
      if (rug.dust[i] > 0.001) { // wetting loose dust makes mud that is harder to remove
        const m = Math.min(rug.dust[i], add * 4);
        rug.dust[i] -= m; rug.soil[i] = Math.min(1, rug.soil[i] + m * 0.9);
      }
      const dil = 1 - Math.min(0.9, add * 1.3);
      rug.soap[i] *= dil; rug.slurry[i] *= dil; rug.foam[i] *= 1 - Math.min(0.9, add * 1.2);
      if (tool.wash) { // pressure washer knocks soil loose but is harsh on weak fibres
        const d = Math.min(rug.soil[i], tool.wash * f * dt * mat.release);
        rug.soil[i] -= d; rug.slurry[i] = Math.min(1, rug.slurry[i] + d);
        const over = tool.wash * 1.5 - mat.tolerance;
        if (over > 0) rug.stress[i] = Math.min(1, rug.stress[i] + over * f * dt * 0.35);
      }
      if (temp) rug.heat[i] = Math.max(rug.heat[i], temp === 2 ? 1 : 0.5);
    });
  } else if (tool.kind === 'chem') {
    const id = CHEM_IDS.indexOf(opts.chem) + 1; if (!id) return;
    const c = CHEMS[opts.chem];
    st.chemMl[opts.chem] = (st.chemMl[opts.chem] || 0) + tool.mlps * dt;
    if (c.ph > 9) st.harshChem = true;
    forDisc(rug, cx, cy, r, (i, f) => {
      if (rug.chem[i] !== id) { rug.chem[i] = id; rug.dwell[i] = 0; rug.soap[i] *= 0.5; }
      rug.soap[i] = Math.min(1, rug.soap[i] + tool.rate * f * dt);
      rug.wet[i] = Math.min(1.5, rug.wet[i] + 0.12 * f * dt);
    });
  } else if (tool.kind === 'agitate') {
    const speed = opts.fast ? 1.3 : 1;
    const harsh = tool.harsh * (opts.fast ? 1.2 : 1) * (0.4 + pressure * 0.6);
    forDisc(rug, cx, cy, r, (i, f, x, y) => {
      const wet = Math.min(1, rug.wet[i] * 2), soap = Math.min(1, rug.soap[i] * 1.6);
      const c = rug.chem[i] ? CHEMS[CHEM_IDS[rug.chem[i] - 1]] : null;
      const eff = tool.power * speed * (0.35 + pressure * 0.9) * f * dt;
      // surface soil needs water as lubricant and detergent to let go
      const ds = Math.min(rug.soil[i], eff * (0.015 + 0.985 * wet * (0.2 + 0.8 * soap * (c ? c.soil : 0))) * mat.release * 3.4);
      rug.soil[i] -= ds;
      const dd = Math.min(rug.deep[i], eff * tool.deep * wet * soap * (c ? c.soil : 0) * 1.6);
      rug.deep[i] -= dd;
      let dst = 0;
      if (rug.stain[i] > rug.setf[i] && c && rug.stainType[i]) {
        const sid = STAIN_IDS[rug.stainType[i] - 1], sdef = STAINS[sid];
        const dwellF = clamp(rug.dwell[i] / c.dwellOpt, 0.2, 1);
        const warm = sdef.warmHelps && rug.heat[i] > 0.3 ? 1.4 : 1;
        dst = Math.min(rug.stain[i] - rug.setf[i], eff * c.compat[sid] * dwellF * wet * soap * warm * 6);
        rug.stain[i] -= dst;
      }
      rug.slurry[i] = Math.min(1, rug.slurry[i] + (ds + dd + dst) * 0.6);
      if (c) rug.foam[i] = Math.min(1, rug.foam[i] + eff * soap * wet * c.foam * 5);
      // loose dry dust is just smeared around by scrubbing
      if (rug.dust[i] > 0 && wet < 0.15) rug.dust[i] = Math.max(0, rug.dust[i] - eff * 0.15);
      const over = harsh - mat.tolerance * (wet > 0.25 ? 1 : 0.6);
      if (over > 0) rug.stress[i] = Math.min(1, rug.stress[i] + over * f * dt * 1.2);
      rug.pass[i] += f * dt;
      if (tool.machine) { // rotary leaves a swirl
        const ax = x - cx, ay = y - cy, al = Math.hypot(ax, ay) || 1;
        rug.napX[i] += (-ay / al - rug.napX[i]) * Math.min(1, f * dt * 6);
        rug.napY[i] += (ax / al - rug.napY[i]) * Math.min(1, f * dt * 6);
      } else if (dl > 1e-6) {
        rug.napX[i] += (dx - rug.napX[i]) * Math.min(1, f * dt * 8);
        rug.napY[i] += (dy - rug.napY[i]) * Math.min(1, f * dt * 8);
      }
    });
  } else if (tool.kind === 'extract') {
    forDisc(rug, cx, cy, r, (i, f) => {
      const before = rug.wet[i]; if (before <= tool.floor) { setNap(rug, i, dx, dy, f, dt, dl); return; }
      const after = Math.max(tool.floor, before - tool.rate * (0.5 + pressure * 0.7) * f * dt);
      const k = (before - after) / before;
      rug.wet[i] = after; rug.slurry[i] *= 1 - k; rug.soap[i] *= 1 - k * 0.85; rug.foam[i] *= 1 - Math.min(1, k * 2.5);
      if (rug.bleed[i] < 0.3) rug.bleed[i] *= 1 - k * 0.6; // fresh dye bleed can still be rinsed out
      setNap(rug, i, dx, dy, f, dt, dl);
    });
  } else if (tool.kind === 'groom') {
    forDisc(rug, cx, cy, r, (i, f) => setNap(rug, i, dx, dy, f * 1.5, dt, dl));
  }
}
function setNap(rug, i, dx, dy, f, dt, dl) {
  if (dl < 1e-6) return;
  const k = Math.min(1, f * dt * 9);
  rug.napX[i] += (dx - rug.napX[i]) * k; rug.napY[i] += (dy - rug.napY[i]) * k;
}

// Passive processes: dwell timers, foam collapse, heat loss, dye bleed, over-dwell damage.
export function step(rug, dt) {
  const mat = rug.mat, unstable = rug.spec.unstable;
  rug.time += dt;
  const foamK = Math.exp(-dt * 0.12), heatK = Math.exp(-dt / 25);
  let hotWet = 0;
  for (let i = 0; i < rug.n; i++) {
    rug.foam[i] *= foamK; rug.heat[i] *= heatK;
    const wet = rug.wet[i];
    if (wet > 0.1 && rug.soap[i] > 0.05 && rug.chem[i]) {
      rug.dwell[i] += dt;
      const c = CHEMS[CHEM_IDS[rug.chem[i] - 1]];
      if (rug.dwell[i] > c.dwellMax) rug.stress[i] = Math.min(1, rug.stress[i] + dt * 0.006 * rug.soap[i]);
      if (c.ph > mat.maxPH) { // chemistry too alkaline for this fibre
        const ex = (c.ph - mat.maxPH) * rug.soap[i];
        rug.stress[i] = Math.min(1, rug.stress[i] + ex * dt * 0.004);
        rug.bleed[i] = Math.min(1, rug.bleed[i] + ex * (1 - mat.fast) * dt * (unstable ? 0.03 : 0.008));
      }
      if (c.rinseAid && rug.bleed[i] < 0.5) rug.bleed[i] = Math.max(0, rug.bleed[i] - dt * 0.01);
    }
    if (rug.heat[i] > 0.7 && wet > 0.2) {
      hotWet++;
      if (rug.stainType[i] && STAINS[STAIN_IDS[rug.stainType[i] - 1]].heatSets) // hot water sets protein and henna
        rug.setf[i] = Math.min(rug.stain[i], rug.setf[i] + dt * 0.25 * rug.stain[i]);
      rug.bleed[i] = Math.min(1, rug.bleed[i] + (1 - mat.fast) * dt * (unstable ? 0.05 : 0.006));
    } else if (unstable && wet > 0.6) {
      rug.bleed[i] = Math.min(1, rug.bleed[i] + (1 - mat.fast) * dt * 0.0012);
    }
  }
  if (mat.shrink && hotWet) rug.shrink = Math.min(1, rug.shrink + mat.shrink * (hotWet / rug.n) * dt * 0.03);
  rug.diffuseT += dt;
  if (rug.diffuseT > 0.3) { rug.diffuseT = 0; diffuse(rug, rug.bleed, 0.18, 0.2); }
}
// Wet cells let dye creep into their neighbours.
function diffuse(rug, layer, k, wetMin) {
  const { W, H, wet } = rug;
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const i = y * W + x;
    if (wet[i] < wetMin) continue;
    const m = Math.max(layer[i - 1], layer[i + 1], layer[i - W], layer[i + W]);
    if (m > layer[i]) layer[i] += (m - layer[i]) * k * 0.5;
  }
}

export function dryingHours(rug, env) {
  const m = measure(rug);
  const method = { sun: 1.7, shade: 1, fans: 2.3, rack: 1.5 }[env.method] || 1;
  const weather = env.temp * (1 - env.humid * 0.65);
  return Math.max(0.5, (m.wet * rug.mat.absorb * 16) / (method * weather * rug.mat.dry));
}

// Drying is split in `steps` slices so the scene can animate it. Call with k = 0..steps-1.
export function dryStep(rug, env, k, steps) {
  const frac = 1 / (steps - k); // fraction of the remaining water removed this slice
  const { W, H } = rug;
  const hours = env.hours ?? dryingHours(rug, env);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const edge = Math.min(x, y, W - 1 - x, H - 1 - y) < 3 ? 1.6 : 1; // edges dry first
    const w0 = rug.wet[i];
    const w1 = Math.max(0, w0 * (1 - Math.min(1, frac * edge)));
    const lost = w0 - w1;
    // capillary wicking: evaporating water drags deep dirt up to the tips
    const wick = Math.min(rug.deep[i], rug.deep[i] * lost * 0.75);
    rug.deep[i] -= wick; rug.soil[i] = Math.min(1, rug.soil[i] + wick * 0.9);
    // dirty water left in the pile dries back into the fibres
    const red = rug.slurry[i] * Math.min(1, frac);
    rug.slurry[i] -= red; rug.soil[i] = Math.min(1, rug.soil[i] + red * 0.75);
    rug.foam[i] *= 0.5;
    if (rug.spec.unstable && w0 > 0.5 && hours > 8) rug.bleed[i] = Math.min(1, rug.bleed[i] + (1 - rug.mat.fast) * 0.02);
    rug.wet[i] = w1;
  }
  if (env.method === 'sun' && rug.mat.fast < 0.5 && hours > 6) rug.fade = Math.min(1, (rug.fade || 0) + 0.25 / steps);
  if (env.dust && k === steps - 1) for (let i = 0; i < rug.n; i++) rug.dust[i] = Math.min(1, rug.dust[i] + env.dust * 0.6);
  diffuse(rug, rug.bleed, 0.2, 0.3);
}

export function measure(rug) {
  const m = { dust: 0, soil: 0, deep: 0, stain: 0, wet: 0, soap: 0, slurry: 0, stress: 0, bleed: 0, foam: 0, maxStress: 0, dirt: 0, edgeDirt: 0, napX: 0, napY: 0, stainCells: 0 };
  const { W, H, n } = rug; let edgeN = 0;
  const gx = 4, gy = 6, reg = new Float32Array(gx * gy), regN = new Float32Array(gx * gy);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x;
    m.dust += rug.dust[i]; m.soil += rug.soil[i]; m.deep += rug.deep[i]; m.stain += rug.stain[i];
    m.wet += rug.wet[i]; m.soap += rug.soap[i]; m.slurry += rug.slurry[i]; m.stress += rug.stress[i];
    m.bleed += rug.bleed[i]; m.foam += rug.foam[i]; m.napX += rug.napX[i]; m.napY += rug.napY[i];
    if (rug.stress[i] > m.maxStress) m.maxStress = rug.stress[i];
    if (rug.stain[i] > 0.12) m.stainCells++;
    const d = Math.min(1, rug.dust[i] + rug.soil[i] + rug.stain[i] * 1.2);
    m.dirt += d;
    const r = Math.min(gy - 1, Math.floor(y / H * gy)) * gx + Math.min(gx - 1, Math.floor(x / W * gx));
    reg[r] += d; regN[r]++;
    if (Math.min(x, y, W - 1 - x, H - 1 - y) < 3) { m.edgeDirt += d; edgeN++; }
  }
  for (const k of ['dust', 'soil', 'deep', 'stain', 'wet', 'soap', 'slurry', 'stress', 'bleed', 'foam', 'dirt', 'napX', 'napY']) m[k] /= n;
  m.edgeDirt /= edgeN || 1; m.stainCells /= n;
  let worst = 0; for (let r = 0; r < reg.length; r++) worst = Math.max(worst, reg[r] / (regN[r] || 1));
  m.worstRegion = worst; m.nap = Math.hypot(m.napX, m.napY); m.shrink = rug.shrink; m.fade = rug.fade || 0;
  return m;
}

export function cleanliness(rug) {
  const m = measure(rug);
  return clamp(1 - m.dirt / Math.max(0.02, rug.initial.dirt));
}

// Job score out of 100. `pre` is measure() taken right before drying, `job` carries par time, requests, lateness.
export function scoreJob(rug, pre, job) {
  const m = measure(rug), init = rug.initial;
  const remain = clamp(m.dirt / Math.max(0.02, init.dirt));
  const stainLeft = init.stain > 0.002 ? clamp(m.stain / init.stain) : 0;
  const clean = 30 * clamp(1 - remain * 0.8 - stainLeft * 0.35) ** 1.3;
  const harm = clamp(m.stress * 4 + m.maxStress * 0.35 + m.bleed * 7 + m.shrink * 2.5 + m.fade * 0.8);
  const safety = 20 * (1 - harm);
  const uneven = clamp((m.worstRegion - m.dirt) * 3.5 + Math.max(0, m.edgeDirt - m.dirt) * 2.5);
  const coverage = 15 * (1 - uneven) * clamp(1.15 - remain);
  const moisture = clamp(10 * (1 - clamp((pre.wet - 0.3) / 0.6)) - clamp(pre.soap * 12) * 5 - clamp(pre.slurry * 10) * 3, 0, 10);
  const over = rug.time / Math.max(1, job.par) - 1;
  const time = clamp(10 * (1 - clamp(over)) - (job.late ? 5 : 0), 0, 10);
  let instr = 10;
  const failed = [];
  for (const rq of job.requests || []) {
    let ok = true;
    if (rq === 'nochem') ok = !rug.stats.harshChem;
    else if (rq === 'savewater') ok = rug.stats.waterL <= job.waterBudget;
    else if (rq === 'gentle') ok = m.stress < 0.01 && !rug.stats.hot;
    else if (rq === 'stainfree') ok = stainLeft < 0.12;
    else if (rq === 'dryfast') ok = !job.late && pre.wet < 0.45;
    else if (rq === 'tidy') ok = rug.stats.spillL < 3;
    if (!ok) { instr -= 10 / job.requests.length; failed.push(rq); }
  }
  const site = clamp(5 - clamp(rug.stats.spillL / 12) * 4 - (1 - clamp(m.nap * 1.4)) * 1.5, 0, 5);
  let total = clean + safety + coverage + moisture + time + instr + site;
  if (safety < 8) total = Math.min(total, 54); else if (safety < 14) total = Math.min(total, 69);
  total = Math.round(clamp(total, 0, 100));
  const stars = total >= 95 ? 5 : total >= 85 ? 4 : total >= 70 ? 3 : total >= 55 ? 2 : 1;
  const r1 = (v) => Math.round(v * 10) / 10;
  return { total, stars, clean: r1(clean), safety: r1(safety), coverage: r1(coverage), moisture: r1(moisture), time: r1(time), instr: r1(Math.max(0, instr)), site: r1(site),
    failed, remain, stainLeft, harm, damaged: safety < 8, m };
}
