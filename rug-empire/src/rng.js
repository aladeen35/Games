// Small deterministic RNG so jobs and rugs can be regenerated from a seed.
export function mulberry32(seed) {
  let a = seed >>> 0;
  const f = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  f.int = (n) => Math.floor(f() * n);
  f.pick = (arr) => arr[Math.floor(f() * arr.length)];
  f.range = (a2, b) => a2 + f() * (b - a2);
  f.chance = (p) => f() < p;
  f.weighted = (items, w) => {
    let total = 0;
    for (const it of items) total += w(it);
    let r = f() * total;
    for (const it of items) { r -= w(it); if (r <= 0) return it; }
    return items[items.length - 1];
  };
  return f;
}
export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
