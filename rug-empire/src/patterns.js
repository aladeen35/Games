// Everything visual that is drawn by code: rug patterns, fictional banknotes, shop logo, ground tiles.
import { mulberry32 } from './rng.js';
import { BRAND_PALETTES } from './content.js';

const PALETTES = [
  ['#8e1b1b', '#1d2f6f', '#e9d8a6', '#d4a23a', '#f4efe2'],
  ['#1f3a6e', '#b8322a', '#f1e3c6', '#2a9d8f', '#e9c46a'],
  ['#6b2737', '#e08e45', '#f8f4e3', '#1b4965', '#bcd4de'],
  ['#264653', '#e76f51', '#f4e9cd', '#2a9d8f', '#e9c46a'],
  ['#7a1f3d', '#f2c14e', '#fbf5e6', '#3d5a80', '#98c1d9'],
  ['#3b2a1a', '#c8553d', '#f0e2c0', '#588157', '#dda15e'],
];

export function rugCanvas(spec, px = 512) {
  const r = mulberry32(spec.seed ^ 0x9e3779b9);
  const W = px, H = Math.min(1024, Math.round(px * spec.h / spec.w));
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true });
  const pal = PALETTES[r.int(PALETTES.length)].slice();
  if (r.chance(0.5)) [pal[0], pal[1]] = [pal[1], pal[0]];
  const [A, B, C, D, E] = pal;
  const bw = W * 0.09;
  g.fillStyle = A; g.fillRect(0, 0, W, H);
  const diamond = (x, y, w, h, fill, stroke) => {
    g.beginPath(); g.moveTo(x, y - h); g.lineTo(x + w, y); g.lineTo(x, y + h); g.lineTo(x - w, y); g.closePath();
    if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = W * 0.008; g.stroke(); }
  };
  const border = (inset, w, col, motif) => {
    g.strokeStyle = col; g.lineWidth = w; g.strokeRect(inset + w / 2, inset + w / 2, W - 2 * inset - w, H - 2 * inset - w);
    if (!motif) return;
    const step = w * 1.15, nx = Math.floor((W - 2 * inset) / step), ny = Math.floor((H - 2 * inset) / step);
    for (let i = 0; i < nx; i++) for (const y of [inset + w / 2, H - inset - w / 2]) diamond(inset + (i + 0.5) * (W - 2 * inset) / nx, y, w * 0.3, w * 0.3, motif);
    for (let j = 0; j < ny; j++) for (const x of [inset + w / 2, W - inset - w / 2]) diamond(x, inset + (j + 0.5) * (H - 2 * inset) / ny, w * 0.3, w * 0.3, motif);
  };
  const p = spec.pattern;
  if (p === 'stripes' || p === 'bursh') {
    const bands = p === 'bursh' ? 22 : 9 + r.int(5); let y = 0, k = 0;
    while (y < H) { const h = H / bands * r.range(0.6, 1.4); g.fillStyle = pal[k++ % (p === 'bursh' ? 3 : 5)]; g.fillRect(0, y, W, h + 1);
      if (p === 'bursh') { g.fillStyle = 'rgba(0,0,0,.12)'; for (let x = 0; x < W; x += 8) g.fillRect(x, y, 3, h); } y += h; }
    if (p === 'stripes') border(0, bw * 0.5, B, E);
  } else if (p === 'kilim') {
    g.fillStyle = C; g.fillRect(bw, bw, W - 2 * bw, H - 2 * bw);
    const rows = Math.round(7 * H / W), cols = 4, cw = (W - 2 * bw) / cols, ch = (H - 2 * bw) / rows;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = bw + (i + 0.5) * cw, y = bw + (j + 0.5) * ch;
      diamond(x, y, cw * 0.48, ch * 0.48, pal[(i + j) % 2 ? 0 : 1]); diamond(x, y, cw * 0.3, ch * 0.3, D); diamond(x, y, cw * 0.13, ch * 0.13, E);
    }
    border(0, bw, B, D); border(bw * 0.85, bw * 0.15, E);
  } else if (p === 'geo') {
    g.fillStyle = E; g.fillRect(0, 0, W, H);
    const s = W / 6;
    for (let y = 0, j = 0; y < H; y += s, j++) for (let x = 0, i = 0; x < W; x += s, i++) {
      g.fillStyle = pal[(i * 7 + j * 3 + r.int(2)) % 4];
      g.beginPath();
      if ((i + j) % 2) { g.moveTo(x, y); g.lineTo(x + s, y); g.lineTo(x, y + s); } else { g.moveTo(x + s, y); g.lineTo(x + s, y + s); g.lineTo(x, y + s); }
      g.closePath(); g.fill();
    }
    border(0, bw * 0.45, A);
  } else if (p === 'prayer') {
    g.fillStyle = B; g.fillRect(bw, bw, W - 2 * bw, H - 2 * bw);
    g.fillStyle = C; g.beginPath(); // mihrab arch
    g.moveTo(bw * 2, H - bw * 2); g.lineTo(bw * 2, H * 0.36); g.quadraticCurveTo(bw * 2, H * 0.16, W / 2, H * 0.1);
    g.quadraticCurveTo(W - bw * 2, H * 0.16, W - bw * 2, H * 0.36); g.lineTo(W - bw * 2, H - bw * 2); g.closePath(); g.fill();
    g.strokeStyle = D; g.lineWidth = W * 0.015; g.stroke();
    diamond(W / 2, H * 0.55, W * 0.12, H * 0.09, A, D); diamond(W / 2, H * 0.55, W * 0.05, H * 0.04, E);
    border(0, bw, A, D);
  } else { // medallion and floral share a field + centre piece
    g.fillStyle = A; g.fillRect(bw, bw, W - 2 * bw, H - 2 * bw);
    if (p === 'floral') for (let k = 0; k < 60; k++) {
      const x = r.range(bw * 1.4, W - bw * 1.4), y = r.range(bw * 1.4, H - bw * 1.4), rad = W * r.range(0.012, 0.028);
      for (let q = 0; q < 6; q++) { g.fillStyle = q % 2 ? D : E; g.beginPath(); g.arc(x + Math.cos(q) * rad, y + Math.sin(q) * rad, rad * 0.6, 0, 7); g.fill(); }
      g.fillStyle = B; g.beginPath(); g.arc(x, y, rad * 0.5, 0, 7); g.fill();
    } else for (let j = 0; j < 9; j++) for (let i = 0; i < 6; i++) diamond(bw * 1.6 + i * (W - bw * 3.2) / 5, bw * 1.8 + j * (H - bw * 3.6) / 8, W * 0.012, W * 0.012, D);
    diamond(W / 2, H / 2, W * 0.34, H * 0.3, B, E); diamond(W / 2, H / 2, W * 0.24, H * 0.21, C, D); diamond(W / 2, H / 2, W * 0.12, H * 0.1, A, E);
    for (const [sx, sy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { // corner spandrels
      g.fillStyle = B; g.beginPath(); const x = sx ? W - bw : bw, y = sy ? H - bw : bw, d = W * 0.2;
      g.moveTo(x, y); g.lineTo(x + (sx ? -d : d), y); g.lineTo(x, y + (sy ? -d : d)); g.closePath(); g.fill();
    }
    border(0, bw, B, D); border(bw * 0.8, bw * 0.2, E);
  }
  // woven grain so the surface never looks like flat print
  const img = g.getImageData(0, 0, W, H), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * 22; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
  return c;
}

// Fictional banknote: clearly a game prop, no real-note layout or security features.
const NOTE_COL = { 500: ['#2a9d8f', '#e8f6f3'], 1000: ['#c47a3d', '#fbf0e3'], 5000: ['#3d5a80', '#e6eef7'], 10000: ['#8e1b4a', '#fbe9f1'] };
export function noteCanvas(value, digits = (n) => String(n)) {
  const c = document.createElement('canvas'); c.width = 220; c.height = 104;
  const g = c.getContext('2d'), [main, bg] = NOTE_COL[value] || ['#555', '#eee'];
  g.fillStyle = bg; g.fillRect(0, 0, 220, 104);
  g.strokeStyle = main; g.lineWidth = 5; g.strokeRect(5, 5, 210, 94);
  g.lineWidth = 1; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(165, 52, 8 + i * 5, 0, 7); g.globalAlpha = 0.25; g.stroke(); } g.globalAlpha = 1;
  g.fillStyle = main; g.beginPath(); g.moveTo(165, 26); g.lineTo(190, 52); g.lineTo(165, 78); g.lineTo(140, 52); g.closePath(); g.fill();
  g.fillStyle = bg; g.beginPath(); g.moveTo(165, 38); g.lineTo(179, 52); g.lineTo(165, 66); g.lineTo(151, 52); g.closePath(); g.fill();
  g.fillStyle = main; g.textAlign = 'left'; g.textBaseline = 'middle';
  g.font = '900 34px Cairo, sans-serif'; g.fillText(digits(value), 16, 44);
  g.font = '700 13px Cairo, sans-serif'; g.fillText('SDG', 16, 72);
  g.font = '700 10px Cairo, sans-serif'; g.textAlign = 'center'; g.fillText('عملة لعبة • GAME PROP', 110, 90);
  return c;
}

export const LOGO_ICONS = ['💧', '🧵', '✨', '🕌', '🌙', '🪣'];
export function logoCanvas(brand, size = 256, lang = 'ar') {
  const c = document.createElement('canvas'); c.width = size * 2; c.height = size;
  const g = c.getContext('2d'), pal = BRAND_PALETTES[brand.palette % BRAND_PALETTES.length];
  g.fillStyle = pal[0];
  const rad = brand.sign === 1 ? size * 0.5 : brand.sign === 2 ? 0 : size * 0.16;
  g.beginPath(); g.roundRect(4, 4, size * 2 - 8, size - 8, rad); g.fill();
  g.strokeStyle = pal[3]; g.lineWidth = size * 0.035; g.stroke();
  // rug-in-a-droplet mark
  const cx = size * 0.36, cy = size * 0.5, s = size * 0.26;
  g.fillStyle = pal[2]; g.beginPath(); g.moveTo(cx, cy - s * 1.25); g.bezierCurveTo(cx + s * 1.3, cy, cx + s, cy + s, cx, cy + s);
  g.bezierCurveTo(cx - s, cy + s, cx - s * 1.3, cy, cx, cy - s * 1.25); g.fill();
  g.fillStyle = pal[1]; g.font = `${size * 0.26}px sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(LOGO_ICONS[brand.icon % LOGO_ICONS.length], cx, cy + s * 0.15);
  const name = (lang === 'en' ? brand.nameEn || brand.nameAr : brand.nameAr || brand.nameEn) || '';
  g.fillStyle = pal[1]; let fs = size * 0.2; g.font = `900 ${fs}px Cairo, sans-serif`;
  while (g.measureText(name).width > size * 1.15 && fs > 10) { fs -= 2; g.font = `900 ${fs}px Cairo, sans-serif`; }
  g.fillText(name, size * 1.3, cy);
  return c;
}

export function groundCanvas(kind) {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d'), r = mulberry32(kind === 'shop' ? 5 : 9);
  const tiles = kind === 'yard' ? 4 : 8, s = 512 / tiles;
  for (let j = 0; j < tiles; j++) for (let i = 0; i < tiles; i++) {
    const v = r.range(-8, 8);
    g.fillStyle = kind === 'yard' ? `rgb(${196 + v},${172 + v},${138 + v})` : kind === 'hall' ? ((i + j) % 2 ? `rgb(${52 + v},${44 + v},${40 + v})` : `rgb(${92 + v},${74 + v},${58 + v})`) : `rgb(${226 + v},${228 + v},${226 + v})`;
    g.fillRect(i * s, j * s, s, s);
    g.strokeStyle = kind === 'yard' ? 'rgba(90,70,50,.5)' : 'rgba(60,70,80,.35)'; g.lineWidth = 2; g.strokeRect(i * s, j * s, s, s);
  }
  for (let k = 0; k < 2500; k++) { g.fillStyle = `rgba(${r.chance(0.5) ? 0 : 255},${r.chance(0.5) ? 0 : 255},200,${r.range(0.01, 0.05)})`; g.fillRect(r.int(512), r.int(512), 2, 2); }
  return c;
}
