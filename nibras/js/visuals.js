/* نبراس — المرئيات: الشعار المتجهي، الأشكال، والعناصر التوضيحية داخل الأسئلة */
'use strict';
N.Vis = {
  /* رمز نِبراس: فانوس + كتاب مفتوح + نجمة. mode: color | mono | dark */
  logo(mode = 'color', size = 110) {
    const navy = '#142B4A', tq = mode === 'mono' ? navy : '#19B8B0', gold = mode === 'mono' ? '#fff' : '#FFC857';
    const page = mode === 'dark' ? '#FFFFFF' : mode === 'mono' ? '#fff' : '#FFF8EC';
    const win = mode === 'dark' ? '#0C1C33' : navy;
    const pageStroke = mode === 'mono' ? navy : 'none';
    return `<svg viewBox="0 0 100 124" width="${size}" height="${size * 1.24}" class="lamp" aria-label="NIBRAS">
      <circle cx="50" cy="7" r="4.2" fill="${tq}"/>
      <path d="M29 33 C29 21 40 15 50 11 C60 15 71 21 71 33 Z" fill="${tq}"/>
      <rect x="24" y="35" width="52" height="5" rx="2.5" fill="${tq}"/>
      <path d="M27 43 H73 V92 H27 Z" fill="${tq}"/>
      <path d="M35 92 V60 C35 52 43 48 50 45 C57 48 65 52 65 60 V92 Z" fill="${win}"/>
      <path d="M50 55 C51.5 63 53 65 61 67 C53 69 51.5 71 50 79 C48.5 71 47 69 39 67 C47 65 48.5 63 50 55 Z" fill="${gold}"/>
      <path d="M50 108 C44 96 34 90 21 89 L24 80 C37 81 46 88 50 98 Z" fill="${page}" stroke="${pageStroke}" stroke-width="1.5"/>
      <path d="M50 108 C56 96 66 90 79 89 L76 80 C63 81 54 88 50 98 Z" fill="${page}" stroke="${pageStroke}" stroke-width="1.5"/>
      <path d="M49 114 C42 103 31 98 17 97 L17 91 C33 92 45 99 50 109 C55 99 67 92 83 91 L83 97 C69 98 58 103 51 114 Z" fill="${tq}"/>
      <rect x="37" y="116" width="26" height="6" rx="3" fill="${tq}"/>
    </svg>`;
  },
  /* أشكال «قطعة لعبة» منقولة من لعبة الأشكال في تطبيق أثير (shapes.js: geoFill + bake):
     نفس الهندسة (مركز 40,40 ونصف قطر 36)، تدرّج شعاعي فاتح→أساسي→داكن، طبقة جانبية
     داكنة تعطي سُمكًا، لمعة بيضاوية ونقطة بريق، وزوايا مستديرة بخط بنفس اللون. */
  SHAPES: (() => {
    const R = 36, cx = 40, cy = 40, f = n => (+n).toFixed(1);
    const reg = (n, r, a0, dy = 0) => 'M' + Array.from({ length: n }, (_, i) => f(cx + Math.cos(a0 + i * 2 * Math.PI / n) * r) + ' ' + f(cy + dy + Math.sin(a0 + i * 2 * Math.PI / n) * r)).join(' L') + ' Z';
    const pts = a => 'M' + a.map(p => f(cx + p[0] * R) + ' ' + f(cy + p[1] * R)).join(' L') + ' Z';
    const star = 'M' + Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, r = (i % 2 ? .44 : .92) * R; return f(cx + Math.cos(a) * r) + ' ' + f(cy + .06 * R + Math.sin(a) * r); }).join(' L') + ' Z';
    const P = { // [أساسي، داكن، فاتح] من لوحة ألوان أثير
      cyan: ['#3EC1D3', '#1C8798', '#B6F0F7'], orange: ['#FF8F45', '#D2600F', '#FFD7B8'], blue: ['#4D8BFF', '#2457C8', '#C9DCFF'],
      purple: ['#A77BFF', '#6A3FD1', '#E2D3FF'], yellow: ['#FFC93C', '#E39B0B', '#FFF0B0'], red: ['#FF6B6B', '#D63447', '#FFB4B4'],
      green: ['#7ED957', '#3F9E2A', '#D3F7C2'], pink: ['#FF7EB9', '#D63D86', '#FFD3E7']
    };
    return {
      circle: { d: `M${cx} ${f(cy - .9 * R)} A${f(.9 * R)} ${f(.9 * R)} 0 1 1 ${cx} ${f(cy + .9 * R)} A${f(.9 * R)} ${f(.9 * R)} 0 1 1 ${cx} ${f(cy - .9 * R)} Z`, p: P.cyan },
      square: { d: pts([[-.78, -.78], [.78, -.78], [.78, .78], [-.78, .78]]), p: P.orange, round: 9 },
      rectangle: { d: pts([[-.95, -.54], [.95, -.54], [.95, .54], [-.95, .54]]), p: P.blue, round: 8 },
      triangle: { d: pts([[0, -.8], [.86, .7], [-.86, .7]]), p: P.purple, round: 9 },
      star: { d: star, p: P.yellow, round: 5 },
      heart: { d: `M${cx} ${f(cy + .86 * R)} C${f(cx - 1.32 * R)} ${f(cy - .02 * R)} ${f(cx - .62 * R)} ${f(cy - 1.08 * R)} ${cx} ${f(cy - .48 * R)} C${f(cx + .62 * R)} ${f(cy - 1.08 * R)} ${f(cx + 1.32 * R)} ${f(cy - .02 * R)} ${cx} ${f(cy + .86 * R)} Z`, p: P.red },
      oval: { d: `M${f(cx - .95 * R)} ${cy} A${f(.95 * R)} ${f(.6 * R)} 0 1 1 ${f(cx + .95 * R)} ${cy} A${f(.95 * R)} ${f(.6 * R)} 0 1 1 ${f(cx - .95 * R)} ${cy} Z`, p: P.green },
      hexagon: { d: reg(6, .86 * R, -Math.PI / 2), p: P.pink, round: 6 },
      diamond: { d: pts([[0, -.92], [.62, 0], [0, .92], [-.62, 0]]), p: P.cyan, round: 6 },
      pentagon: { d: reg(5, .86 * R, -Math.PI / 2, .07 * R), p: P.orange, round: 7 }
    };
  })(),
  _sid: 0,
  _shade(hex, amt) { // amt سالب للتغميق وموجب للتفتيح
    const n = parseInt(hex.slice(1), 16), t = amt < 0 ? 0 : 255, a = Math.abs(amt);
    const ch = k => Math.round(((n >> k) & 255) + (t - ((n >> k) & 255)) * a);
    return '#' + [16, 8, 0].map(k => ch(k).toString(16).padStart(2, '0')).join('');
  },
  shape(name, color) {
    if (name === 'rhombus') name = 'diamond';
    if (name === 'rect') name = 'rectangle';
    const S = this.SHAPES[name]; if (!S) return '';
    const [base, dark, light] = color && /^#[0-9a-f]{6}$/i.test(color) ? [color, this._shade(color, -.3), this._shade(color, .6)] : S.p;
    const id = 'shp' + (++this._sid), sw = S.round || 0;
    const body = `d="${S.d}" stroke-linejoin="round" stroke-width="${sw}"`;
    return `<svg viewBox="-4 -4 88 92" class="shape-svg" aria-hidden="true"><defs>
      <radialGradient id="${id}r" cx=".38" cy=".3" r=".75"><stop offset="0" stop-color="${light}"/><stop offset=".45" stop-color="${base}"/><stop offset="1" stop-color="${dark}"/></radialGradient>
      <radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <clipPath id="${id}c"><path d="${S.d}"/></clipPath></defs>
      <path ${body} transform="translate(0 5)" fill="${dark}" stroke="${dark}"/>
      <path ${body} transform="translate(0 5)" fill="#000" stroke="#000" opacity=".18"/>
      <path ${body} fill="url(#${id}r)" stroke="${base}"/>
      <g clip-path="url(#${id}c)"><ellipse cx="32" cy="26" rx="17" ry="9.5" fill="url(#${id}g)" transform="rotate(-28.6 32 26)"/>
      <ellipse cx="28.5" cy="23.5" rx="3.6" ry="2.4" fill="#fff" opacity=".9" transform="rotate(-28.6 28.5 23.5)"/></g>
    </svg>`;
  },
  frac(n, d) {
    const r = 70, cx = 80, cy = 80; let s = '';
    for (let i = 0; i < d; i++) {
      const a0 = -Math.PI / 2 + i * 2 * Math.PI / d, a1 = a0 + 2 * Math.PI / d;
      const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      s += `<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${d === 1 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${i < n ? '#FFC857' : '#F6F0E4'}" stroke="#142B4A" stroke-width="3"/>`;
    }
    return `<svg viewBox="0 0 160 160" width="150" height="150">${s}</svg>`;
  },
  map() {
    return `<div class="vbox" style="padding:8px"><svg viewBox="0 0 300 220" width="100%" style="max-width:360px;display:block;margin:auto" aria-label="map">
      <rect x="2" y="2" width="296" height="216" rx="12" fill="#F4EBD3" stroke="#C9B48A" stroke-width="3"/>
      <path d="M150 214 C170 180 125 150 150 115 C175 80 130 50 150 8" fill="none" stroke="#3E8ED0" stroke-width="9" stroke-linecap="round"/>
      <path d="M140 30 L150 10 L160 30" fill="none" stroke="#1F5FA0" stroke-width="4"/>
      <text x="62" y="122" font-size="34" text-anchor="middle">⛰️</text>
      <text x="232" y="64" font-size="30" text-anchor="middle">⭐</text>
      <text x="232" y="178" font-size="30" text-anchor="middle">🌾</text>
      <g transform="translate(30 36)"><path d="M0 -24 L7 0 L0 -5 L-7 0 Z" fill="#142B4A"/><text x="0" y="16" font-size="15" font-weight="800" text-anchor="middle" fill="#142B4A">${N.lang === 'en' ? 'N' : 'ش'}</text></g>
    </svg>
    <div class="chips" style="justify-content:center;margin-top:6px;font-size:.85rem">
      <span class="pill">〰️ نهر</span><span class="pill">⛰️ جبل</span><span class="pill">⭐ مدينة</span><span class="pill">🌾 مزرعة</span><span class="pill">⬆️ ش = الشمال</span>
    </div><div class="small muted" style="text-align:center">خريطة تخطيطية توضيحية</div></div>`;
  },
  render(v, lang) {
    if (!v) return '';
    const dir = lang === 'en' ? 'ltr' : 'rtl';
    switch (v.k) {
      case 'count': return `<div class="vbox"><div class="vrow">${Array(v.n).fill(`<span>${v.e}</span>`).join('')}</div></div>`;
      case 'big': return `<div class="vrow" style="font-size:4.2rem">${v.e}</div>`;
      case 'pattern': return `<div class="vbox"><div class="vrow" style="direction:${dir};flex-wrap:nowrap;gap:4px;font-size:clamp(1.3rem,${Math.min(9, 60 / (v.seq.length + 1)).toFixed(1)}vw,2.4rem)">${v.seq.map(x => `<span>${x}</span>`).join('')}<span style="border:3px dashed var(--orange);border-radius:12px;padding:0 6px">❓</span></div></div>`;
      case 'sum': return `<div class="vbox"><div class="vrow" style="align-items:center">${'<span>' + v.e.repeat(v.a) + '</span>'}<b style="font-size:2rem;color:var(--orange)">+</b>${'<span>' + v.e.repeat(v.b) + '</span>'}</div></div>`;
      case 'groups': return `<div class="groups">${Array(v.g).fill(`<div>${Array(v.n).fill(`<span>${v.e}</span>`).join('')}</div>`).join('')}</div>`;
      case 'frac': return this.frac(v.n, v.d);
      case 'eq': return `<div class="vbox eq">${esc(v.t)}</div>`;
      case 'sol': return `<div class="vbox steps-sol">${v.lines.map((l, i) => `<div><span class="pill" style="margin-inline-end:10px">${i + 1}</span>${esc(l)}</div>`).join('')}</div>`;
      case 'missing': return `<div class="vbox" style="text-align:center"><div style="font-size:3.4rem">${v.e}</div><div class="row" style="justify-content:center;direction:rtl;gap:8px">${v.parts.map(p => `<span class="slot ${p === '؟' ? '' : 'full'}">${p}</span>`).join('')}</div></div>`;
      case 'text': return `<div class="vbox passage" dir="${dir}">${esc(N.C.texts[v.id])}</div>`;
      case 'table': {
        const t = N.C.tables[v.id];
        return `<div class="vbox"><div class="small muted" style="text-align:center;margin-bottom:6px">${esc(t.cap)}</div><table class="vt"><tr>${t.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr>${t.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</table></div>`;
      }
      case 'map': return this.map();
    }
    return '';
  },
  /* محتوى بطاقة خيار: صورة/شكل/لون/نص */
  opt(o, hideText) {
    let h = '';
    if (o.shape) h += this.shape(o.shape);
    if (o.color) h += `<span class="sw" style="background:${o.color}"></span>`;
    if (o.e) h += `<span class="e">${o.e}</span>`;
    if (o.t && !(hideText && (o.e || o.shape || o.color))) h += `<span${/[\u0600-\u06FF]/.test(o.t) ? '' : ' dir="ltr"'}>${esc(o.t)}</span>`;
    return h;
  }
};
N.normOpt = o => typeof o === 'string' ? { t: o } : o;

/* =====================================================================
   طابع المادة في شجرة الدروس: نقشة خلفية خاصة بكل مادة + أيقونات زخرفية
   النقشة بلاط SVG شفاف بلون المادة (140×140)، والأيقونات تطفو بجانب المسار.
   ===================================================================== */
N.Theme = {
  MOTIFS: {
    ar: ['book-open', 'type', 'speech', 'book'], math: ['calculator', 'abacus', 'target', 'timer'],
    sci: ['microscope', 'flask', 'sprout', 'lightbulb'], en: ['languages', 'alphabet-blocks', 'speech', 'volume'],
    soc: ['globe', 'map', 'castle', 'building'], art: ['palette', 'sparkles', 'star', 'gift'],
    isl: ['lantern', 'book-marked', 'calendar', 'star'], comp: ['monitor', 'gamepad', 'lightbulb', 'settings']
  },
  pattern(subject, c) {
    const o = (v) => `fill="${c}" fill-opacity="${v}"`, so = (v, w = 2) => `fill="none" stroke="${c}" stroke-opacity="${v}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
    const T = (x, y, s, ch, r = 0, f = 'serif') => `<text x="${x}" y="${y}" font-size="${s}" font-family="${f}" font-weight="700" ${o(.13)} transform="rotate(${r} ${x} ${y})" text-anchor="middle">${ch}</text>`;
    let g = '';
    switch (subject) {
      case 'ar': g = T(28, 40, 30, 'ب', -12) + T(100, 34, 26, 'ض', 10) + T(64, 92, 34, 'ع', -6) + T(24, 124, 24, 'ن', 14) + T(112, 118, 28, 'م', -10); break;
      case 'math': g = [20, 40, 60, 80, 100, 120].map(v => `<path d="M${v} 0V140M0 ${v}H140" ${so(.06, 1)}/>`).join('') +
        `<path d="M22 22h14M29 15v14" ${so(.2, 3)}/><path d="M98 30h14" ${so(.2, 3)}/><path d="M60 92l10 10M70 92l-10 10" ${so(.2, 3)}/><path d="M108 104h12M114 98v0M114 110v0" ${so(.22, 3.4)}/><path d="M24 112h14M24 118h14" ${so(.2, 3)}/>`; break;
      case 'sci': g = `<g transform="translate(36 38)"><ellipse rx="22" ry="8" ${so(.16)}/><ellipse rx="22" ry="8" transform="rotate(60)" ${so(.16)}/><ellipse rx="22" ry="8" transform="rotate(-60)" ${so(.16)}/><circle r="3.5" ${o(.25)}/></g>` +
        `<path d="M86 96l10-6 10 6v12l-10 6-10-6z M106 96l10-6 10 6v12l-10 6-10-6z" ${so(.14)}/><circle cx="104" cy="32" r="6" ${so(.14)}/><circle cx="116" cy="46" r="3.5" ${so(.14)}/><circle cx="30" cy="110" r="8" ${so(.12)}/>`; break;
      case 'en': g = T(26, 42, 30, 'A', -10, 'sans-serif') + T(102, 36, 26, 'b', 12, 'sans-serif') + T(66, 94, 32, 'C', -4, 'sans-serif') + T(24, 126, 22, 'e', 10, 'sans-serif') + T(114, 122, 28, 'K', -12, 'sans-serif'); break;
      case 'soc': g = `<path d="M20 70c0-30 40-44 60-30s46 6 50 30-30 50-60 46S20 100 20 70z" ${so(.1)}/><path d="M38 70c0-18 26-28 40-18s30 4 32 18-20 32-40 30-32-12-32-30z" ${so(.12)}/><path d="M56 70c0-8 12-12 20-8s14 2 14 8-8 14-18 13-16-5-16-13z" ${so(.14)}/>` +
        `<g transform="translate(116 24)"><path d="M0-11 3-3 11 0 3 3 0 11-3 3-11 0-3-3z" ${o(.2)}/></g>`; break;
      case 'art': g = `<path d="M30 30c10-12 30-6 28 8s-22 20-30 10-8-10 2-18z" ${o(.12)}/><circle cx="104" cy="40" r="10" fill="#FFC857" fill-opacity=".18"/><circle cx="96" cy="104" r="14" ${o(.1)}/><path d="M20 110q20-24 44-6t40-12" ${so(.16, 4)}/><circle cx="60" cy="70" r="4" fill="#F2545B" fill-opacity=".18"/>`; break;
      case 'isl': { const star = (x, y, r) => `<g transform="translate(${x} ${y})"><rect x="${-r}" y="${-r}" width="${2 * r}" height="${2 * r}" ${so(.14, 1.6)}/><rect x="${-r}" y="${-r}" width="${2 * r}" height="${2 * r}" transform="rotate(45)" ${so(.14, 1.6)}/><circle r="${r * .38}" ${so(.12, 1.4)}/></g>`;
        g = star(70, 70, 26) + star(0, 0, 18) + star(140, 0, 18) + star(0, 140, 18) + star(140, 140, 18); break; }
      case 'comp': g = `<path d="M10 30H50V70H90V30H130M30 140V100H70V120M110 140V96H140M0 96H20" ${so(.13)}/>` + [[50, 30], [90, 70], [130, 30], [30, 100], [70, 120], [110, 96], [20, 96]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.5" ${o(.2)}/>`).join(''); break;
      default: g = `<circle cx="70" cy="70" r="20" ${so(.1)}/>`;
    }
    return `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">${g}</svg>`)}")`;
  },
  vars(subject, color) {
    const V = N.Vis;
    return `--sc:${color};--sc-d:${V._shade(color, -.28)};--sc-l:${V._shade(color, .35)};--sc-t:${V._shade(color, .88)};--pat:${this.pattern(subject, color)}`;
  }
};
