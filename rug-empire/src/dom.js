import { sfx } from './audio.js';
export const $ = (sel, root = document) => root.querySelector(sel);
// h('div.card', {onclick}, child, ...) -> element. Strings become text nodes (never HTML).
export function h(spec, attrs, ...kids) {
  const [head, ...cls] = spec.split('.');
  const [tag, id] = head.split('#');
  const el = document.createElement(tag || 'div');
  if (id) el.id = id;
  if (cls.length) el.className = cls.join(' ');
  if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
  for (const k in attrs || {}) {
    const v = attrs[k]; if (v === null || v === undefined || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), k === 'onclick' ? (e) => { sfx.tap(); v(e); } : v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k in el && k !== 'list') el[k] = v; else el.setAttribute(k, v);
  }
  const add = (c) => { if (c === null || c === undefined || c === false) return; if (Array.isArray(c)) c.forEach(add); else el.append(c instanceof Node ? c : String(c)); };
  kids.forEach(add);
  return el;
}
export function modal(content, opts = {}) {
  const wrap = h('div.modal-wrap' + (opts.cls ? '.' + opts.cls : ''), h('div.modal', content));
  if (opts.dismiss) wrap.addEventListener('click', (e) => { if (e.target === wrap) { wrap.remove(); opts.onclose && opts.onclose(); } });
  document.getElementById('ui').append(wrap);
  return { el: wrap, close: () => wrap.remove() };
}
let toastBox;
export function toast(text, kind = '', ms = 3200) {
  toastBox = document.getElementById('toasts');
  const el = h('div.toast' + (kind ? '.' + kind : ''), text);
  toastBox.append(el); while (toastBox.children.length > 3) toastBox.firstChild.remove();
  setTimeout(() => el.classList.add('out'), ms - 400); setTimeout(() => el.remove(), ms);
}
export const bar = (v, cls = '') => h('div.bar' + (cls ? '.' + cls : ''), h('i', { style: { width: Math.round(Math.max(0, Math.min(1, v)) * 100) + '%' } }));
