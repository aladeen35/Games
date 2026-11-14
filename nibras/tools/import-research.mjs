#!/usr/bin/env node
/* =====================================================================
   نبراس — استيراد بحث المنهج إلى التطبيق
   يقرأ nibras/research/curriculum-*.json (صيغة research/SCHEMA.md)، يتحقق من
   كل نشاط حسب نوعه ويستبعد غير الصالح، ويكتب js/curriculum-data.js الذي
   يحمّله التطبيق. الترتيب يتبع فهرس الكتاب (الوحدة ثم الدرس).
   الاستخدام: node nibras/tools/import-research.mjs   (أضف --check للتحقق فقط دون كتابة الملف)
   ===================================================================== */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RES = path.join(ROOT, 'research');
const OUT = path.join(ROOT, 'js', 'curriculum-data.js');
const GRADES = ['kg', 'g1', 'g2', 'g3', 'g4', 'g5', 'g6', 'm1', 'm2', 'm3'];
const SUBJECTS = ['ar', 'math', 'sci', 'en', 'soc', 'isl', 'art', 'comp'];
const SHAPES = ['circle', 'square', 'triangle', 'rectangle', 'star', 'heart', 'oval', 'hexagon', 'diamond', 'pentagon'];
const TASHKEEL = /[ً-ٰٟـ]/g;

const log = { files: 0, lessons: 0, soon: 0, acts: 0, dropped: [], byGrade: {} };
const optOk = o => typeof o === 'string' || typeof o === 'number' ? String(o).trim() !== ''
  : o && typeof o === 'object' && (o.t || o.e || (o.shape && SHAPES.includes(o.shape)) || o.color);
const normOpt = o => typeof o === 'number' ? String(o) : o;
const key = o => typeof o === 'object' ? JSON.stringify(o) : String(o);

function checkAct(a) {
  if (!a || typeof a !== 'object' || !a.type || !a.q) return 'missing type/q';
  switch (a.type) {
    case 'choose':
      if (a.tf) { if (a.a !== 0 && a.a !== 1) return 'tf needs a 0/1'; delete a.opts; return null; }
      if (!Array.isArray(a.opts) || a.opts.length < 2 || a.opts.length > 4) return 'choose needs 2–4 opts';
      if (!a.opts.every(optOk)) return 'bad option';
      if (!Number.isInteger(a.a) || a.a < 0 || a.a >= a.opts.length) return 'answer index out of range';
      if (new Set(a.opts.map(key)).size !== a.opts.length) return 'duplicate options';
      a.opts = a.opts.map(normOpt);
      if (a.listen && !a.say) a.listen = false;
      return null;
    case 'match': case 'memory':
      if (!Array.isArray(a.pairs) || a.pairs.length < 2 || a.pairs.length > 6) return a.type + ' needs 2–6 pairs';
      if (!a.pairs.every(p => Array.isArray(p) && p.length === 2 && optOk(p[0]) && optOk(p[1]))) return 'bad pair';
      if (new Set(a.pairs.map(p => key(p[0]))).size !== a.pairs.length || new Set(a.pairs.map(p => key(p[1]))).size !== a.pairs.length) return 'pair sides not unique';
      a.pairs = a.pairs.map(p => p.map(normOpt));
      /* إن حمل الطرفان النص نفسه صارت المطابقة بلا معنى: نُبقي الصورة وحدها في الطرف الآخر */
      a.pairs = a.pairs.map(([x, y]) => {
        const tx = typeof x === 'string' ? x : x.t, ty = typeof y === 'string' ? y : y.t;
        if (tx && ty && tx.trim() === ty.trim()) { if (typeof y === 'object' && y.e) y = { e: y.e }; else if (typeof x === 'object' && x.e) x = { e: x.e }; }
        return [x, y];
      });
      if (new Set(a.pairs.map(p => key(p[1]))).size !== a.pairs.length) return 'pair sides not unique after cleanup';
      return null;
    case 'order':
      if (!['letters', 'words', 'nums', 'steps'].includes(a.mode)) a.mode = 'steps';
      if (!Array.isArray(a.items) || a.items.length < 2 || a.items.length > 6) return 'order needs 2–6 items';
      a.items = a.items.map(x => String(x));
      if (new Set(a.items).size < 2) return 'order items identical';
      /* ترتيب حروف كلمة دون أن يُعرف الهدف: ننطق الكلمة ونُظهر زر «استمع» */
      if (a.mode === 'letters' && !a.say && !a.vis) { a.say = a.items.join(''); a.listen = true; }
      if (a.mode === 'words' && !a.say && !a.vis && a.items.length > 3) { a.say = a.items.join(' '); }
      return null;
    case 'ws': {
      if (!Array.isArray(a.words) || a.words.length < 2 || a.words.length > 7) return 'ws needs 2–7 words';
      for (const w of a.words) {
        if (!w || !w.w) return 'ws word missing';
        w.w = String(w.w).replace(TASHKEEL, '').replace(/\s+/g, '');
        if (/[^A-Za-zء-ي]/.test(w.w)) return 'ws word has non-letters: ' + w.w;
        if (/[a-z]/.test(w.w)) w.w = w.w.toUpperCase();
      }
      const longest = Math.max(...a.words.map(w => Array.from(w.w).length));
      a.size = Math.min(8, Math.max(a.size || 6, longest, 5));
      if (longest > 8) return 'ws word longer than 8';
      a.dirs = a.dirs === 'hvd' ? 'hvd' : 'hv'; a.show = ['pic', 'word', 'both'].includes(a.show) ? a.show : 'both';
      if (a.show === 'pic' && !a.words.every(w => w.e)) a.show = 'both';
      return null;
    }
    case 'sort':
      if (!Array.isArray(a.bins) || a.bins.length < 2 || a.bins.length > 3 || !a.bins.every(optOk)) return 'sort needs 2–3 bins';
      if (!Array.isArray(a.items) || a.items.length < 3 || a.items.length > 9) return 'sort needs 3–9 items';
      if (!a.items.every(it => optOk(it) && Number.isInteger(it.bin) && it.bin >= 0 && it.bin < a.bins.length)) return 'sort item/bin invalid';
      a.bins = a.bins.map(normOpt);
      return null;
    case 'pop':
      if (!Array.isArray(a.items) || a.items.length < 4 || a.items.length > 10) return 'pop needs 4–10 items';
      if (!a.items.every(it => optOk(it) && typeof it.ok === 'boolean')) return 'pop item invalid';
      if (!a.items.some(it => it.ok) || a.items.every(it => it.ok)) return 'pop needs some correct and some wrong';
      return null;
    default: return 'unknown type ' + a.type;
  }
}

const out = { version: null, sources: {}, structure: {}, lessons: [] };
/* ملفات أنشطة إضافية research/acts-*.json: { "lessons": { "<معرّف الدرس>": [أنشطة] } }
   تُكمل دروس الفهرس التي لا أنشطة لها (المعرّف: grade-subject-u<الوحدة>-l<الدرس>) */
const overlay = {};
for (const f of (fs.existsSync(RES) ? fs.readdirSync(RES) : []).filter(f => /^acts-.*\.json$/.test(f)).sort()) {
  try { const o = JSON.parse(fs.readFileSync(path.join(RES, f), 'utf8')); Object.assign(overlay, o.lessons || {}); log.overlayFiles = (log.overlayFiles || 0) + 1; }
  catch (e) { console.error('✗ JSON غير صالح:', f, e.message); process.exitCode = 1; }
}
const files = fs.existsSync(RES) ? fs.readdirSync(RES).filter(f => /^curriculum-.*\.json$/.test(f)).sort() : [];
for (const f of files) {
  let data;
  try { data = JSON.parse(fs.readFileSync(path.join(RES, f), 'utf8')); } catch (e) { console.error('✗ JSON غير صالح:', f, e.message); process.exitCode = 1; continue; }
  log.files++;
  const tag = f.replace(/^curriculum-|\.json$/g, '');
  out.structure[tag] = data.structure_notes || '';
  const srcs = {};
  (data.sources || []).forEach(s => { const id = tag + ':' + s.id; srcs[s.id] = id; out.sources[id] = { title: s.title, url: s.url, official: !!s.official }; });
  for (const g of data.grades || []) {
    if (!GRADES.includes(g.grade)) { log.dropped.push(`${f}: unknown grade ${g.grade}`); continue; }
    const bookIdx = {};   // صف واحد قد يضم كتابين للمادة نفسها (مثل التاريخ والجغرافيا): نميّز الثاني بـ @b2
    for (const sb of g.subjects || []) {
      if (!SUBJECTS.includes(sb.subject)) { log.dropped.push(`${f}: unknown subject ${sb.subject}`); continue; }
      const book = sb.book || {};
      { const k = sb.subject + ':' + (book.title || ''); if (!bookIdx[k]) bookIdx[k] = Object.keys(bookIdx).filter(x => x.startsWith(sb.subject + ':')).length + 1; }
      (sb.units || []).forEach((u, ui) => (u.lessons || []).forEach((l, li) => {
        const unitNo = u.unit_no || ui + 1, lessonNo = l.lesson_no || li + 1;
        const bi = bookIdx[sb.subject + ':' + (sb.book && sb.book.title || '')], id = `${g.grade}-${sb.subject}-u${unitNo}-l${lessonNo}` + (bi > 1 ? '@b' + bi : '');
        const acts = [];
        ((l.acts && l.acts.length) ? l.acts : (overlay[id] || [])).forEach((a, ai) => { const err = checkAct(a); if (err) log.dropped.push(`${id} act${ai + 1}: ${err}`); else acts.push(a); });
        if (acts.length && !acts.some(a => a.apply)) acts[acts.length - 1].apply = true;
        const isl = sb.subject === 'isl';
        /* بعض الوكلاء يميّزون الموضوعات غير المأخوذة من فهرس ببادئة؛ نحوّلها إلى علَم */
        const PREFIX = /^\s*(?:(?:موضوع عام مقترح|\(?ليس من فهرس الكتاب\)?)\s*[:：\-–—]?\s*)+/;
        const topicOnly = !l.title || PREFIX.test(l.title);
        if (l.title) l.title = l.title.replace(PREFIX, '');
        if (u.title && /وحدة مقترحة/.test(u.title)) u.title = null;
        const lesson = {
          id, grade: g.grade, subject: sb.subject, unit: u.title || (sb.subject === 'en' ? 'Topics' : 'موضوعات عامة'), unitNo, lessonNo,
          title: l.title || l.skill || `الدرس ${lessonNo}`, topicOnly: topicOnly || !l.verified, outcome: l.outcome || l.title || '', skill: [id, l.skill || l.title || id],
          lang: l.lang || (sb.subject === 'en' ? 'en' : 'ar'),
          acts: isl ? [] : acts, soon: isl || !acts.length,
          source: { book: book.title || null, edition: book.edition || null, pages: l.pages || null, ref: srcs[l.source] || srcs[book.source] || null, verified: !!(l.verified && sb.toc_verified !== false) },
          status: 'curriculum_draft'
        };
        out.lessons.push(lesson);
        log.lessons++; if (lesson.soon) log.soon++; log.acts += lesson.acts.length;
        const k = `${g.grade}/${sb.subject}`; log.byGrade[k] = log.byGrade[k] || { lessons: 0, playable: 0, acts: 0, verified: 0 };
        log.byGrade[k].lessons++; if (!lesson.soon) log.byGrade[k].playable++; log.byGrade[k].acts += lesson.acts.length; if (lesson.source.verified) log.byGrade[k].verified++;
      }));
    }
  }
}
{ const seen = new Set(), dup = out.lessons.filter(l => seen.has(l.id) || !seen.add(l.id)).map(l => l.id);
  if (dup.length) { console.error('✗ معرّفات دروس مكررة:', dup.join(', ')); process.exitCode = 1; } }
out.lessons.sort((a, b) => GRADES.indexOf(a.grade) - GRADES.indexOf(b.grade) || SUBJECTS.indexOf(a.subject) - SUBJECTS.indexOf(b.subject) || a.unitNo - b.unitNo || a.lessonNo - b.lessonNo);
out.version = 'curriculum-' + new Date().toISOString().slice(0, 10);
if (!process.argv.includes('--check')) fs.writeFileSync(OUT, `/* مُولَّد آليًا بواسطة tools/import-research.mjs من research/curriculum-*.json — لا تعدّله يدويًا */\nwindow.NIBRAS_CUR = ${JSON.stringify(out)};\n`);
console.log(`ملفات: ${log.files} (+${log.overlayFiles || 0} ملف أنشطة) · دروس: ${log.lessons} (قيد الإعداد ${log.soon}) · أنشطة: ${log.acts} · مستبعد: ${log.dropped.length}`);
console.table(log.byGrade);
if (log.dropped.length) console.log('مستبعد:\n  ' + log.dropped.join('\n  '));
