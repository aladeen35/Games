/* =====================================================================
   نبراس — طبقة الأيقونات المتحركة (Kubai Icons, MIT)
   ---------------------------------------------------------------------
   في أي قالب اكتب: N.ic('settings', { size: 22, color: '#fff' })
   فيُنتج عنصرًا نائبًا <i class="ki">، ويحوّله مراقب DOM تلقائيًا إلى
   أيقونة SVG متعددة الطبقات. عند لمس الزر الحاوي يؤدي الشيء حركته
   (الترس يدور، القفل ينفتح...) ثم يعود — لأن الهاتف لا يملك «تمرير مؤشر».
   data-auto: تكرار الحركة تلقائيًا (رسوم الترحيب) ما لم تُقلَّل الحركة.
   عند عدم دعم color-mix() في WebView قديم نعرض بديلًا من الإيموجي.
   ===================================================================== */
'use strict';
(function () {
  const FALLBACK = {
    settings: '⚙️', users: '👪', backpack: '🎒', sliders: '🎚️', 'book-open': '📖', repeat: '🔁', trophy: '🏆', book: '📖',
    calculator: '🔢', microscope: '🔬', languages: '🔤', globe: '🗺️', palette: '🎨', lantern: '🏮', monitor: '💻',
    sprout: '🌱', 'alphabet-blocks': '🔤', building: '🏙️', castle: '🏰', flask: '🧪', play: '▶', target: '🎯', sync: '🔁',
    store: '🛍️', 'shopping-bag': '🛍️', abacus: '🧮', 'book-open-star': '📚', map: '🗺️', calendar: '📅', volume: '🔊',
    lightbulb: '💡', 'rotate-ccw': '↺', lock: '🔒', 'lock-open': '🔓', 'book-marked': '📘', type: '🔠', speech: '🗣️',
    bell: '🔔', eye: '◐', timer: '⏱️', hourglass: '⏳', gamepad: '🎮', 'arrow-left': '←', 'arrow-right': '→',
    'chevron-left': '‹', 'chevron-right': '›', star: '⭐', medal: '🏅', award: '🏅', sparkles: '✨', ban: '🚫', gift: '🎁'
  };
  let ok = false;
  try { ok = !!(window.KI && window.CSS && CSS.supports('color', 'color-mix(in srgb, red 50%, blue)')); } catch (e) {}
  const reduced = () => (window.N && N.DB && N.DB.data && N.DB.data.settings.motion) || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  N.ic = function (name, o) {
    o = o || {};
    const size = o.size || 24, color = o.color || '';
    if (!o.variant && /^#fff(fff)?$/i.test(color)) o = Object.assign({}, o, { variant: 'soft' });   // الأبيض الصريح يفقد التفاصيل؛ النسخة الناعمة تُبقي الخطوط
    if (!ok || !KI.icons[name]) return `<span class="ki-fb" style="font-size:${Math.round(size * .85)}px">${FALLBACK[name] || '•'}</span>`;
    return `<i class="ki${o.cls ? ' ' + o.cls : ''}" data-ki="${name}" data-s="${size}" data-c="${color}"${o.variant ? ` data-v="${o.variant}"` : ''}${o.auto ? ' data-auto="1"' : ''} style="width:${size}px;height:${size}px"></i>`;
  };
  N.ic.ok = ok;

  function hydrate(root) {
    if (!ok) return;
    (root.querySelectorAll ? root : document).querySelectorAll('i.ki[data-ki]').forEach(ph => {
      const icon = KI.icons[ph.dataset.ki]; if (!icon) return;
      const opt = { size: +ph.dataset.s || 24, trigger: 'none' };
      if (ph.dataset.c) opt.color = ph.dataset.c;
      if (ph.dataset.v) opt.variant = ph.dataset.v;
      let svg;
      try { svg = KI.createIcon(icon, opt); } catch (e) { return; }
      svg.classList.add('ki-svg');
      ph.replaceWith(svg);
      let ctl = svg.kubai; try { if (!ctl) ctl = KI.animate(svg, icon); } catch (e) {}
      if (!ctl) return;
      if (ph.dataset.auto) {          // حركة متكررة هادئة لرسوم الترحيب
        let on = false;
        const t = setInterval(() => { if (!document.body.contains(svg)) return clearInterval(t); if (reduced()) return; on = !on; ctl.hover(on); }, 1500);
        return;
      }
      const host = svg.closest('button, .li, .opt, .tile, a') || svg.parentElement;
      if (!host || host.__kiBound) { if (host) host.__kiCtl.push(ctl); return; }
      host.__kiBound = true; host.__kiCtl = [ctl];
      let tm = null;
      const play = () => { if (reduced()) return; clearTimeout(tm); host.__kiCtl.forEach(c => c.hover(true)); tm = setTimeout(() => host.__kiCtl.forEach(c => c.hover(false)), 520); };
      host.addEventListener('pointerdown', play, { passive: true });
      host.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && !reduced()) host.__kiCtl.forEach(c => c.hover(true)); });
      host.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') host.__kiCtl.forEach(c => c.hover(false)); });
    });
  }
  N.ic.hydrate = hydrate;
  let queued = false;
  const mo = new MutationObserver(() => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; hydrate(document); }); });
  document.addEventListener('DOMContentLoaded', () => { mo.observe(document.body, { childList: true, subtree: true }); hydrate(document); });
  if (document.body) { mo.observe(document.body, { childList: true, subtree: true }); }
})();
