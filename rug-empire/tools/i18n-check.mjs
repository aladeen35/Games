// Reports string keys used in the code but missing from strings.js, and entries missing a language.
import { readFileSync, readdirSync } from 'node:fs';
import { STR } from '../src/strings.js';
import * as C from '../src/content.js';
const dir = new URL('../src/', import.meta.url).pathname;
const used = new Set();
for (const f of readdirSync(dir)) if (f.endsWith('.js') && f !== 'strings.js') for (const m of readFileSync(dir + f, 'utf8').matchAll(/\b(?:t|d|plural)\('([a-zA-Z0-9_.]+)'\s*[,)]/g)) used.add(m[1]);
for (const b of ['days', 'stains', 'rugs']) { used.delete(b); for (const f of ['one', 'two', 'few', 'many']) used.add(`${b}.${f}`); }
const dyn = { mat: C.MATERIALS, stain: C.STAINS, chem: C.CHEMS, chemd: C.CHEMS, tool: C.TOOLS, gear: C.GEAR, geard: C.GEAR, arch: C.ARCHETYPES, story: C.ARCHETYPES, dist: C.DISTRICTS, season: C.SEASONS, ev: C.EVENTS, skill: C.SKILLS, skilld: C.SKILLS, size: C.SIZES, prem: C.ECON.premises, premd: C.ECON.premises };
for (const p in dyn) for (const id in dyn[p]) used.add(`${p}.${id}`);
for (const id of C.REQUESTS) used.add('req.' + id); for (const id of C.PATTERNS) used.add('pat.' + id); for (const id of C.SLOTS) used.add('slot.' + id);
for (let i = 0; i < C.RANKS.length; i++) used.add('rank.' + i);
for (const id in C.TOOLS) if (C.TOOLS[id].price) used.add('toold.' + id);
let bad = 0;
for (const k of used) if (!STR[k]) { console.log('MISSING', k); bad++; }
for (const k in STR) { if (!STR[k][0] || !STR[k][2]) { console.log('INCOMPLETE', k); bad++; } }
const unused = Object.keys(STR).filter((k) => !used.has(k) && !/^(dlg|coach|warn|why|band|sc|dry|dryd|lvl|tx|rep|track|occ|weather|weatherd|ach|help|hint|staff|staffd|tab|showroom|matguess)\./.test(k));
console.log(`${Object.keys(STR).length} strings, ${used.size} static keys checked, ${bad} problems` + (unused.length ? `, possibly unused: ${unused.join(' ')}` : ''));
process.exit(bad ? 1 : 0);
