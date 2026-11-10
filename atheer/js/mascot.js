/* =====================================================================
   البطريق المرافق (Mascot) — شخصية حيّة ترافق الطفل في التطبيق كله
   ---------------------------------------------------------------------
   SVG واحد مُفصَّل (جسم، رأس، عيون، حواجب، منقار، زعانف، أقدام، طبقات ملابس)
   تحرّكه GSAP (transform/opacity فقط). كل شيء اختياري: إن لم يُحمَّل GSAP
   فكل دوال window.Mascot لا تفعل شيئًا.

   window.Mascot = { show(opts), hide(), say(ar, en, opts), cheer(level), encourage(),
                     pointAt(elOrXY), think(), sleep(), wake(), setOutfit(id), mount(container),
                     setEnabled(bool), enabled, outfit }

   الربط مع التطبيق دون تعديل core.js: نلفّ App.renderMenu / App.show / App.shopSheet /
   App.settings / App.speak و Sound.error، ونراقب ظهور نوافذ الفوز (.overlay.on).
   ===================================================================== */
(function () {
  'use strict';
  const G = window.gsap;
  const noop = () => {};
  if (!G || typeof App === 'undefined') {
    window.Mascot = { show: noop, hide: noop, say: noop, cheer: noop, encourage: noop, pointAt: noop, think: noop, sleep: noop, wake: noop, setOutfit: noop, mount: noop, setEnabled: noop, enabled: false, outfit: null };
    return;
  }
  const CAT = 'penguin', VB_W = 200, VB_H = 232, RATIO = VB_H / VB_W;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = a => a[(Math.random() * a.length) | 0];
  const T = (ar, en) => App.t(ar, en);

  /* ------------------------------------------------------------------
     الملابس: كل زيّ قطع SVG توضع في طبقات (خلف الجسم، على الجسم، عند الرقبة، على الرأس)
     ------------------------------------------------------------------ */
  const OUTFITS = [
    { id: 'pg_none', name: 'بطريق كما هو', nameEn: 'Just penguin', price: 0 },
    { id: 'pg_scarf', name: 'وشاح دافئ', nameEn: 'Cosy scarf', price: 20,
      neck: `<path d="M124 152 L140 190 L122 196 L110 160Z" fill="#E8334F"/><path d="M125 180 l12 -4 M127 187 l12 -4" stroke="#FFD0D8" stroke-width="3" stroke-linecap="round"/>
        <path d="M122 196 l2 8 M128 194 l2 8 M134 192 l2 8 M140 190 l2 8" stroke="#E8334F" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M50 134 Q100 166 150 134 L153 150 Q100 184 47 150Z" fill="#F4455F"/>
        <path d="M66 147 l-3 15 M84 155 l-2 15 M100 158 l0 15 M116 155 l2 15 M134 147 l3 15" stroke="#FFD0D8" stroke-width="4" stroke-linecap="round" opacity=".9"/>
        <path d="M50 134 Q100 166 150 134" fill="none" stroke="#FF8A9B" stroke-width="3" stroke-linecap="round"/>` },
    { id: 'pg_bow', name: 'ربطة عنق', nameEn: 'Bow tie', price: 25,
      neck: `<path d="M100 156 L76 142 Q71 156 76 170Z" fill="#E8375B"/><path d="M100 156 L124 142 Q129 156 124 170Z" fill="#E8375B"/>
        <path d="M100 156 L78 147 Q76 152 77 158Z M100 156 L122 147 Q124 152 123 158Z" fill="#FF7C96" opacity=".8"/>
        <circle cx="100" cy="156" r="7" fill="#C81E45"/><circle cx="98" cy="154" r="2.2" fill="#FF9DB0"/>` },
    { id: 'pg_shades', name: 'نظارة شمسية', nameEn: 'Sunglasses', price: 30,
      head: `<path d="M56 86 Q100 78 144 86" fill="none" stroke="#12152E" stroke-width="5" stroke-linecap="round"/>
        <rect x="55" y="80" width="42" height="30" rx="13" fill="url(#mcG_UID)"/><rect x="103" y="80" width="42" height="30" rx="13" fill="url(#mcG_UID)"/>
        <rect x="55" y="80" width="42" height="30" rx="13" fill="none" stroke="#12152E" stroke-width="3"/><rect x="103" y="80" width="42" height="30" rx="13" fill="none" stroke="#12152E" stroke-width="3"/>
        <path d="M63 88 l10 -4 M67 96 l14 -7 M111 88 l10 -4 M115 96 l14 -7" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/>` },
    { id: 'pg_phones', name: 'سماعات', nameEn: 'Headphones', price: 35, hat: 1,
      head: `<path d="M40 84 Q38 18 100 18 Q162 18 160 84" fill="none" stroke="#FF5C8A" stroke-width="10" stroke-linecap="round"/>
        <path d="M46 60 Q52 26 100 24" fill="none" stroke="#FFA9C2" stroke-width="3" stroke-linecap="round" opacity=".8"/>
        <rect x="24" y="68" width="26" height="44" rx="12" fill="#FF5C8A"/><rect x="150" y="68" width="26" height="44" rx="12" fill="#FF5C8A"/>
        <rect x="24" y="76" width="11" height="28" rx="5.5" fill="#D93468"/><rect x="165" y="76" width="11" height="28" rx="5.5" fill="#D93468"/>
        <path d="M43 76 v22 M157 76 v22" stroke="#FFA9C2" stroke-width="3" stroke-linecap="round" opacity=".8"/>` },
    { id: 'pg_grad', name: 'قبعة التخرّج', nameEn: 'Graduation cap', price: 40, hat: 1,
      head: `<g transform="rotate(-7 100 40)"><path d="M62 34 L62 52 Q100 40 138 52 L138 34Z" fill="#23283F"/>
        <path d="M100 6 L166 28 L100 50 L34 28Z" fill="#363D5E"/><path d="M100 6 L166 28 L100 31 L34 28Z" fill="#4A5380"/>
        <circle cx="100" cy="28" r="4.5" fill="#FFC531"/><path d="M100 28 Q130 30 150 34 L151 60" fill="none" stroke="#FFC531" stroke-width="3" stroke-linecap="round"/>
        <path d="M146 58 h10 l2 16 h-14Z" fill="#FFC531"/><path d="M149 62 v10 M153 62 v10" stroke="#D98A00" stroke-width="1.6"/></g>` },
    { id: 'pg_crown', name: 'تاج ملكي', nameEn: 'Royal crown', price: 50, hat: 1,
      head: `<path d="M64 44 L58 10 L80 27 L100 2 L120 27 L142 10 L136 44 Q100 33 64 44Z" fill="url(#mcK_UID)" stroke="#D98A00" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M65 44 Q100 33 135 44 L134 37 Q100 26 66 37Z" fill="#F2A90F"/>
        <circle cx="58" cy="10" r="5" fill="#FF6FA5"/><circle cx="100" cy="3" r="6" fill="#6FB0FF"/><circle cx="142" cy="10" r="5" fill="#FF6FA5"/>
        <circle cx="100" cy="33" r="5" fill="#F0445A"/><circle cx="80" cy="37" r="3.6" fill="#59C9A5"/><circle cx="120" cy="37" r="3.6" fill="#59C9A5"/>
        <path d="M70 26 l4 10 M98 14 l-4 8" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>` },
    { id: 'pg_hero', name: 'البطل الخارق', nameEn: 'Superhero', price: 60,
      back: `<path d="M56 134 C24 160 14 200 22 226 Q60 214 100 222 Q140 214 178 226 C186 200 176 160 144 134Z" fill="url(#mcC_UID)"/>
        <path d="M40 176 Q36 204 40 218 M160 176 Q164 204 160 218" stroke="#B81D38" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`,
      body: `<path d="M100 160 L118 168 Q118 190 100 200 Q82 190 82 168Z" fill="#FFC531" stroke="#E89B0C" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M100 168 l3.6 7.2 8 1.2 -5.8 5.6 1.4 8 -7.2 -3.8 -7.2 3.8 1.4 -8 -5.8 -5.6 8 -1.2Z" fill="#F0445A"/>`,
      neck: `<path d="M52 134 Q100 164 148 134 L150 146 Q100 177 50 146Z" fill="#F0445A"/><circle cx="100" cy="158" r="7.5" fill="#FFC531" stroke="#E89B0C" stroke-width="2"/>` },
    { id: 'pg_sudan', name: 'عِمّة وصديري سوداني', nameEn: 'Sudanese emma & vest', price: 60, hat: 1,
      body: `<path d="M56 132 C46 156 44 192 54 213 L86 218 C86 192 88 168 97 146 Q76 148 56 132Z" fill="url(#mcV_UID)"/>
        <path d="M144 132 C154 156 156 192 146 213 L114 218 C114 192 112 168 103 146 Q124 148 144 132Z" fill="url(#mcV_UID)"/>
        <path d="M97 146 C88 168 86 192 86 218 M103 146 C112 168 114 192 114 218" fill="none" stroke="#F4D58A" stroke-width="3" stroke-linecap="round"/>
        <circle cx="91" cy="172" r="2.8" fill="#F4D58A"/><circle cx="89" cy="188" r="2.8" fill="#F4D58A"/><circle cx="89" cy="204" r="2.8" fill="#F4D58A"/>
        <path d="M62 190 h16 M122 190 h16" stroke="#F4D58A" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>`,
      head: `<path d="M38 62 C28 16 70 0 100 0 C130 0 172 16 162 62 C146 44 54 44 38 62Z" fill="url(#mcT_UID)" stroke="#C3C9DC" stroke-width="2" stroke-linejoin="round"/>
        <path d="M44 50 Q92 12 156 44 M42 38 Q76 6 132 8 M70 8 Q118 22 160 30 M58 20 Q104 34 158 54" fill="none" stroke="#C3C9DC" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M150 50 Q166 60 160 80 Q154 70 148 62Z" fill="#fff" stroke="#C3C9DC" stroke-width="2" stroke-linejoin="round"/>` }
  ];
  const outfitById = id => OUTFITS.find(o => o.id === id) || OUTFITS[0];
  const part = (o, k, uid) => (o[k] || '').replace(/_UID/g, uid);

  /* ------------------------------------------------------------------
     الرسم: بطريق كحلي مستدير، عيون كبيرة، خدود وردية، منقار وأقدام برتقالية
     ------------------------------------------------------------------ */
  function figure(uid, outfit, standalone) {
    const o = outfitById(outfit), hid = ' visibility="hidden"';
    return `<svg ${standalone ? `xmlns="http://www.w3.org/2000/svg" width="${VB_W * 2}" height="${VB_H * 2}" ` : ''}viewBox="0 0 ${VB_W} ${VB_H}" aria-hidden="true" focusable="false">
<defs>
  <linearGradient id="mcB${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A63C4"/><stop offset=".5" stop-color="#2D3E8E"/><stop offset="1" stop-color="#18215A"/></linearGradient>
  <radialGradient id="mcH${uid}" cx=".38" cy=".28" r=".85"><stop offset="0" stop-color="#6480E0"/><stop offset=".45" stop-color="#3349A0"/><stop offset="1" stop-color="#1B2562"/></radialGradient>
  <linearGradient id="mcW${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#E3EAFF"/></linearGradient>
  <linearGradient id="mcO${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFCB5C"/><stop offset="1" stop-color="#F5841A"/></linearGradient>
  <linearGradient id="mcF${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3D54B2"/><stop offset="1" stop-color="#1C2766"/></linearGradient>
  <linearGradient id="mcG${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B3157"/><stop offset="1" stop-color="#0E1128"/></linearGradient>
  <linearGradient id="mcK${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE98A"/><stop offset="1" stop-color="#F7B21B"/></linearGradient>
  <linearGradient id="mcC${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F7506A"/><stop offset="1" stop-color="#C92442"/></linearGradient>
  <linearGradient id="mcV${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08A4A"/><stop offset="1" stop-color="#8A5A26"/></linearGradient>
  <linearGradient id="mcT${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#E8EBF5"/></linearGradient>
</defs>
<ellipse class="m-shadow" cx="100" cy="225" rx="58" ry="7" fill="#28326E" opacity=".2"/>
<g class="m-all">
  <g class="m-acc-back">${part(o, 'back', uid)}</g>
  <g class="m-footL"><ellipse cx="74" cy="217" rx="24" ry="9.5" fill="url(#mcO${uid})"/><path d="M62 221 v-5 M74 223 v-6" stroke="#D96A0C" stroke-width="2.4" stroke-linecap="round" opacity=".6"/></g>
  <g class="m-footR"><ellipse cx="126" cy="217" rx="24" ry="9.5" fill="url(#mcO${uid})"/><path d="M138 221 v-5 M126 223 v-6" stroke="#D96A0C" stroke-width="2.4" stroke-linecap="round" opacity=".6"/></g>
  <g class="m-sq"><g class="m-br">
    <ellipse cx="100" cy="162" rx="58" ry="58" fill="url(#mcB${uid})"/>
    <ellipse cx="100" cy="171" rx="41" ry="44" fill="url(#mcW${uid})"/>
    <g class="m-acc-body">${part(o, 'body', uid)}</g>
    <g class="m-flipL"><path d="M55 124 C40 124 25 150 23 172 C22 185 34 189 42 179 C52 165 61 146 61 133 C61 127 59 124 55 124Z" fill="url(#mcF${uid})"/><path d="M33 150 Q27 164 28 174" stroke="#7088E6" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/></g>
    <g class="m-flipR"><g transform="matrix(-1 0 0 1 200 0)"><path d="M55 124 C40 124 25 150 23 172 C22 185 34 189 42 179 C52 165 61 146 61 133 C61 127 59 124 55 124Z" fill="url(#mcF${uid})"/><path d="M33 150 Q27 164 28 174" stroke="#7088E6" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/></g></g>
    <g class="m-head">
      <path class="m-tuft" d="M95 28 Q88 10 101 6 Q98 15 103 20 Q106 12 114 12 Q108 20 109 29Z" fill="#3349A0"${o.hat ? hid : ''}/>
      <circle cx="100" cy="86" r="62" fill="url(#mcH${uid})"/>
      <path d="M46 92 a31 31 0 0 1 54 -20.8 a31 31 0 0 1 54 20.8 q4 14 -6 28 q-14 20 -48 20 q-34 0 -48 -20 q-10 -14 -6 -28Z" fill="url(#mcW${uid})"/>
      <g class="m-cheeks"><ellipse class="m-chk" cx="61" cy="115" rx="10.5" ry="7" fill="#FF8FB0" opacity=".85"/><ellipse class="m-chk" cx="139" cy="115" rx="10.5" ry="7" fill="#FF8FB0" opacity=".85"/></g>
      <g class="m-eyes">
        <g class="m-open">
          <g class="m-eyeL"><ellipse cx="77" cy="93" rx="12.5" ry="15.5" fill="#10163A"/><circle cx="72.5" cy="87" r="5" fill="#fff"/><circle cx="81.5" cy="99" r="2.4" fill="#fff" opacity=".85"/></g>
          <g class="m-eyeR"><ellipse cx="123" cy="93" rx="12.5" ry="15.5" fill="#10163A"/><circle cx="118.5" cy="87" r="5" fill="#fff"/><circle cx="127.5" cy="99" r="2.4" fill="#fff" opacity=".85"/></g>
        </g>
        <g class="m-happy"${hid}><path d="M65 97 Q77 80 89 97 M111 97 Q123 80 135 97" fill="none" stroke="#10163A" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/></g>
        <g class="m-sleepy"${hid}><path d="M65 92 Q77 103 89 92 M111 92 Q123 103 135 92" fill="none" stroke="#10163A" stroke-width="5" stroke-linecap="round"/></g>
      </g>
      <path class="m-browL" d="M66 71 Q76 65 86 70" fill="none" stroke="#2D3E8E" stroke-width="3.6" stroke-linecap="round"/>
      <path class="m-browR" d="M114 70 Q124 65 134 71" fill="none" stroke="#2D3E8E" stroke-width="3.6" stroke-linecap="round"/>
      <g class="m-mouth"><ellipse cx="100" cy="119" rx="9.5" ry="8" fill="#A93A25"/><ellipse cx="100" cy="123" rx="5.5" ry="3.2" fill="#FF8FA3"/></g>
      <path d="M84 108 Q100 98 116 108 Q111 121 100 122 Q89 121 84 108Z" fill="url(#mcO${uid})"/>
      <path d="M90 106 Q100 101 108 105" fill="none" stroke="#FFE7A8" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>
      <ellipse cx="72" cy="44" rx="20" ry="9" transform="rotate(-30 72 44)" fill="#fff" opacity=".16"/>
      <g class="m-acc-head">${part(o, 'head', uid)}</g>
    </g>
    <g class="m-acc-neck">${part(o, 'neck', uid)}</g>
  </g></g>
</g>
<g class="m-fx"${hid}>
  <g class="m-zzz" font-family="Baloo Bhaijaan 2,system-ui,sans-serif" font-weight="900" fill="#5B74E0" stroke="#fff" stroke-width="4" paint-order="stroke" stroke-linejoin="round">
    <text class="m-z" x="150" y="44" font-size="22">z</text><text class="m-z" x="150" y="44" font-size="26">z</text><text class="m-z" x="150" y="44" font-size="30">Z</text></g>
  <g class="m-dots"><circle class="m-dot" cx="156" cy="40" r="5" fill="#fff" stroke="#9DB2EE" stroke-width="2.5"/><circle class="m-dot" cx="168" cy="22" r="7.5" fill="#fff" stroke="#9DB2EE" stroke-width="2.5"/>
    <g class="m-dot"><ellipse cx="184" cy="-4" rx="20" ry="14" fill="#fff" stroke="#9DB2EE" stroke-width="2.5"/><text x="184" y="3" font-size="18" text-anchor="middle" font-family="Baloo Bhaijaan 2,system-ui,sans-serif" font-weight="900" fill="#5B74E0">?</text></g></g>
  <g class="m-stars">${[0, 1, 2, 3, 4, 5].map(i => `<path class="m-star" d="M0 -9 L2.6 -3 L9 -2.6 L4.2 1.6 L5.6 8 L0 4.6 L-5.6 8 L-4.2 1.6 L-9 -2.6 L-2.6 -3Z" fill="${['#FFC531', '#FF6FA5', '#6FB0FF'][i % 3]}" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>`).join('')}</g>
  <g class="m-hearts">${[0, 1, 2].map(() => `<path class="m-heart" d="M0 7 C-10 -1 -7 -9 0 -4 C7 -9 10 -1 0 7Z" fill="#FF5C8A" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>`).join('')}</g>
</g></svg>`;
  }

  /* صور مصغّرة للمتجر (SVG ثابت يُرسم على canvas) */
  const thumbs = {};
  function thumb(id) {
    if (thumbs[id]) return thumbs[id];
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(figure('t', id, true));
    return (thumbs[id] = img);
  }

  /* ------------------------------------------------------------------
     التسجيل في المتجر + الأنماط
     ------------------------------------------------------------------ */
  App.shopCats[CAT] = { title: 'ملابس البطريق', te: 'Penguin outfits', icon: '🐧' };
  OUTFITS.forEach(o => App.shopItem({
    cat: CAT, id: o.id, name: o.name, nameEn: o.nameEn, price: o.price,
    draw(c, s) {
      const g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#CDE6FF'); g.addColorStop(1, '#F1F6FF');
      c.fillStyle = g; c.beginPath(); c.arc(s / 2, s / 2, s / 2, 0, 7); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.ellipse(s / 2, s * .93, s * .42, s * .13, 0, 0, 7); c.fill();
      const img = thumb(o.id), h = s * .86, w = h / RATIO;
      const paint = () => { try { c.drawImage(img, (s - w) / 2, s * .085, w, h); } catch (e) {} };
      if (img.complete && img.naturalWidth) paint(); else img.addEventListener('load', paint, { once: true });
    }
  }));

  App.css(`
  .mc{position:relative;width:var(--ms,112px);pointer-events:none;-webkit-tap-highlight-color:transparent;visibility:hidden;transform-origin:50% 100%}
  .mc-fig{display:block;width:100%;aspect-ratio:${VB_W}/${VB_H};pointer-events:auto;cursor:pointer;touch-action:manipulation;border-radius:46% 46% 40% 40%;
    filter:drop-shadow(0 3px 0 rgba(255,255,255,.55))}
  .mc.nohit .mc-fig{pointer-events:none;cursor:default}
  .mc-fig svg{display:block;width:100%;height:100%;overflow:visible;pointer-events:none}
  .mc-bub{position:absolute;bottom:calc(100% - 4px);left:50%;width:max-content;max-width:min(236px,72vw);padding:6px 14px 7px;border-radius:20px;background:#fff;color:#24346E;
    font:900 16px/1.35 var(--font);text-align:center;border:3px solid #BFD0FF;box-shadow:0 4px 0 #9DB2EE,0 8px 16px rgba(30,50,120,.2);visibility:hidden;pointer-events:none;
    white-space:normal;transform-origin:50% 100%;z-index:2}
  .mc-bub::after{content:'';position:absolute;top:100%;left:calc(50% + var(--tx,0px));margin-left:-8px;width:16px;height:16px;background:#fff;border:3px solid #BFD0FF;border-top:0;border-left:0;
    transform:translateY(-9px) rotate(45deg);border-radius:0 0 5px 0}
  .mc-bub.side-r::after,.mc-bub.side-l::after{top:50%;margin-top:-8px!important;left:auto;margin:0;transform:none}
  .mc-bub.side-r::after{right:100%;margin-right:-9px;border:3px solid #BFD0FF;border-top:0;border-right:0;transform:rotate(45deg);border-radius:0 0 0 5px}
  .mc-bub.side-l::after{left:100%;margin-left:-9px;transform:rotate(-45deg)}
  #mascotLayer{position:fixed;inset:0;z-index:40;pointer-events:none;overflow:hidden}
  #mascotLayer .mc{position:absolute;left:0;top:0;will-change:transform}
  /* مكانه الافتراضي في الشاشة الرئيسية: واقف أمام طرف الشعار (جوال) / بعد التحية (شاشات عريضة) */
  #mascotHome.mc-auto{position:relative;width:0;height:0;flex:0 0 auto;margin-top:-8px;z-index:3;pointer-events:none}
  #mascotHome.mc-auto .mc{position:absolute;bottom:-4px;inset-inline-start:calc(min(23vw,100px) - 30px);--ms:clamp(96px,27vw,116px)}
  @media (min-width:720px){
    #mascotHome.mc-auto{order:5;width:150px;height:174px;margin-top:0;align-self:center}
    #mascotHome.mc-auto .mc{position:relative;bottom:auto;inset-inline-start:auto;--ms:150px}
    html.mc-home .hero-txt{max-width:calc(100% - 434px)}
  }
  #mascotSpot>.mc{position:absolute;left:50%;bottom:-6px;margin-left:calc(var(--ms) / -2);--ms:86px}
  @media (min-width:720px){#mascotSpot>.mc{--ms:104px}}
  html.mc-off #mascotHome,html.mc-off #mascotLayer{display:none}
  `);

  /* ------------------------------------------------------------------
     الحالة
     ------------------------------------------------------------------ */
  let root, fig, bub, bubTxt, layer, P = null, ready = false;
  let enabled = gstore.get('mascot', true) !== false;
  let reduce = false;
  let mode = 'none';          // none | home | float
  let visible = false, floatKind = '', winOv = null, hideCall = null, bubCall = null, popTw = null;
  let act = null, busy = false, sleeping = false, sleepT = 0;
  let breath = null, blinkC = null, lookC = null, eyeX = null, eyeY = null;
  let customMount = null, homeHidden = false, outfitId = 'pg_none';
  let rectDirty = true, cx = 0, cy = 0, lastPtr = 0, lastEnc = 0, errT = 0, ownSpeak = false, lastTap = -1;
  let fPos = { x: 0, y: 0, S: 100 };
  const greeted = new Set();
  try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function build() {
    if (ready) return true;
    try {
      root = document.createElement('div'); root.className = 'mc'; root.id = 'mascot';
      root.innerHTML = `<div class="mc-bub" role="status"><span></span></div><div class="mc-fig">${figure('m', outfitId)}</div>`;
      bub = root.firstChild; bubTxt = bub.firstChild; fig = root.lastChild;
      layer = document.createElement('div'); layer.id = 'mascotLayer'; layer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(layer); layer.appendChild(root);
      const q = s => fig.querySelector(s), qa = s => [...fig.querySelectorAll(s)];
      P = {
        shadow: q('.m-shadow'), all: q('.m-all'), sq: q('.m-sq'), br: q('.m-br'), head: q('.m-head'), eyes: q('.m-eyes'), open: q('.m-open'),
        eyeL: q('.m-eyeL'), eyeR: q('.m-eyeR'), happy: q('.m-happy'), sleepy: q('.m-sleepy'), browL: q('.m-browL'), browR: q('.m-browR'),
        mouth: q('.m-mouth'), cheeks: qa('.m-chk'), flipL: q('.m-flipL'), flipR: q('.m-flipR'), footL: q('.m-footL'), footR: q('.m-footR'), tuft: q('.m-tuft'),
        fx: q('.m-fx'), zs: qa('.m-z'), dots: qa('.m-dot'), stars: qa('.m-star'), hearts: qa('.m-heart'),
        aBack: q('.m-acc-back'), aBody: q('.m-acc-body'), aNeck: q('.m-acc-neck'), aHead: q('.m-acc-head')
      };
      G.set(P.shadow, { svgOrigin: '100 225' });
      G.set(P.all, { svgOrigin: '100 222' });
      G.set([P.sq, P.br], { svgOrigin: '100 220' });
      G.set(P.head, { svgOrigin: '100 142' });
      G.set(P.flipL, { svgOrigin: '55 130' }); G.set(P.flipR, { svgOrigin: '145 130' });
      G.set(P.footL, { svgOrigin: '74 219' }); G.set(P.footR, { svgOrigin: '126 219' });
      G.set(P.eyeL, { svgOrigin: '77 93' }); G.set(P.eyeR, { svgOrigin: '123 93' });
      G.set(P.mouth, { svgOrigin: '100 112', scaleY: .05 });
      G.set(P.browL, { svgOrigin: '76 68' }); G.set(P.browR, { svgOrigin: '124 68' });
      G.set(P.cheeks[0], { svgOrigin: '61 115' }); G.set(P.cheeks[1], { svgOrigin: '139 115' });
      G.set([P.happy, P.sleepy], { autoAlpha: 0 });
      G.set(P.fx, { autoAlpha: 1 });
      G.set([...P.zs, ...P.dots, ...P.stars, ...P.hearts], { autoAlpha: 0 });
      G.set(root, { autoAlpha: 0 });
      G.set(bub, { xPercent: -50, autoAlpha: 0 });
      eyeX = G.quickTo(P.eyes, 'x', { duration: .3, ease: 'power2.out' });
      eyeY = G.quickTo(P.eyes, 'y', { duration: .3, ease: 'power2.out' });
      fig.addEventListener('click', onTap);
      window.addEventListener('pointerdown', onPointer, { passive: true });
      window.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('resize', () => { rectDirty = true; if (mode === 'float' && winOv) placeWin(winOv, false); }, { passive: true });
      const menu = document.getElementById('menu'); if (menu) menu.addEventListener('scroll', () => { rectDirty = true; }, { passive: true });
      document.addEventListener('visibilitychange', loops);
      G.matchMedia().add({ r: '(prefers-reduced-motion: reduce)', f: '(prefers-reduced-motion: no-preference)' }, ctx => {
        reduce = !!ctx.conditions.r; if (ready) { stopAct(); loops(); }
      });
      ready = true;
    } catch (e) { console.warn('Mascot', e); ready = false; }
    return ready;
  }

  /* ------------------------------------------------------------------
     الحلقات الهادئة (تنفّس، رمش، التفات) — تتوقف كلها حين لا يُرى
     ------------------------------------------------------------------ */
  const live = () => ready && enabled && visible && !document.hidden && !reduce;
  function loops() {
    if (!ready) return;
    if (blinkC) { blinkC.kill(); blinkC = null; }
    if (lookC) { lookC.kill(); lookC = null; }
    if (!live()) {
      if (breath) breath.pause();
      if (act && (document.hidden || !visible)) act.pause();
      return;
    }
    if (!breath) breath = G.to(P.br, { scaleY: 1.028, scaleX: .988, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    else breath.play();
    if (act && act.paused() && !act._held) act.play();
    blinkC = G.delayedCall(rnd(1.5, 4), blink);
    lookC = G.delayedCall(rnd(5, 9), look);
  }
  function blink() {
    blinkC = null; if (!live()) return;
    if (!sleeping) G.to([P.eyeL, P.eyeR], { scaleY: .08, duration: .07, ease: 'power1.in', yoyo: true, repeat: Math.random() < .25 ? 3 : 1 });
    blinkC = G.delayedCall(rnd(2.2, 5.5), blink);
  }
  function look() {
    lookC = null; if (!live()) return;
    if (!busy && !sleeping && performance.now() - lastPtr > 2500) {
      const d = Math.random() < .5 ? -1 : 1;
      if (Math.random() < .55) { eyeX(5 * d); eyeY(rnd(-2, 1)); G.delayedCall(rnd(.8, 1.4), () => { if (!busy) { eyeX(0); eyeY(0); } }); }
      else G.to(P.head, { rotation: 6 * d, duration: .5, ease: 'sine.inOut', yoyo: true, repeat: 1, repeatDelay: rnd(.5, 1.1) });
    }
    lookC = G.delayedCall(rnd(5, 10), look);
  }
  /* العيون تتابع الإصبع */
  function onPointer(e) {
    if (!ready) return;
    if (e.type === 'pointerdown') {
      armSleep();
      if (sleeping && !(fig && fig.contains(e.target))) wake();
    }
    if (!live() || sleeping) return;
    lastPtr = performance.now();
    if (rectDirty) { const r = fig.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height * .4; rectDirty = false; }
    const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 90);
    eyeX(dx / d * 5.5 * k); eyeY(dy / d * 4.5 * k);
  }

  /* ------------------------------------------------------------------
     الحركات
     ------------------------------------------------------------------ */
  function neutral(tl, d) {
    const v = { duration: d, ease: 'power2.out' };
    tl.to(P.all, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1, ...v }, 0)
      .to(P.sq, { scaleX: 1, scaleY: 1, ...v }, 0)
      .to(P.head, { rotation: 0, x: 0, y: 0, ...v }, 0)
      .to([P.flipL, P.flipR, P.footL, P.footR, P.browL, P.browR], { rotation: 0, x: 0, y: 0, ...v }, 0)
      .to(P.mouth, { scaleY: .05, ...v }, 0)
      .to(P.cheeks, { scale: 1, ...v }, 0)
      .to(P.shadow, { scaleX: 1, opacity: .2, ...v }, 0)
      .to([P.eyeL, P.eyeR], { scaleX: 1, scaleY: 1, ...v }, 0)
      .to([...P.zs, ...P.dots, ...P.stars, ...P.hearts], { autoAlpha: 0, duration: Math.min(d, .15) }, 0)
      .set(P.open, { autoAlpha: 1 }, 0).set([P.happy, P.sleepy], { autoAlpha: 0 }, 0);
    return tl;
  }
  const face = (tl, name, t) => tl.set(P.open, { autoAlpha: name === 'open' ? 1 : 0 }, t).set(P.happy, { autoAlpha: name === 'happy' ? 1 : 0 }, t).set(P.sleepy, { autoAlpha: name === 'sleepy' ? 1 : 0 }, t);
  const talk = (tl, t, n) => tl.to(P.mouth, { scaleY: 1, duration: .11, ease: 'sine.inOut', yoyo: true, repeat: (n || 3) * 2 - 1 }, t);
  function hopIn(tl, t, h, d) {
    d = d || .24;
    tl.to(P.sq, { scaleY: .86, scaleX: 1.1, duration: .1, ease: 'power2.out' }, t)
      .to(P.sq, { scaleY: 1.1, scaleX: .93, duration: d, ease: 'power2.out' }, t + .1)
      .to(P.all, { y: -h, duration: d, ease: 'power2.out' }, t + .1)
      .to(P.shadow, { scaleX: .68, opacity: .1, duration: d, ease: 'power2.out' }, t + .1)
      .to(P.all, { y: 0, duration: d * .85, ease: 'power2.in' }, t + .1 + d)
      .to(P.shadow, { scaleX: 1, opacity: .2, duration: d * .85, ease: 'power2.in' }, t + .1 + d)
      .to(P.sq, { scaleY: .88, scaleX: 1.09, duration: .08, ease: 'power1.out' }, t + .1 + d * 1.85)
      .to(P.sq, { scaleY: 1, scaleX: 1, duration: .5, ease: 'elastic.out(1.1,0.45)' }, t + .18 + d * 1.85);
    return t + .1 + d * 1.85;
  }
  function starBurst(tl, t) {
    P.stars.forEach((s, i) => {
      const a = (-150 + i * 24 + rnd(-8, 8)) * Math.PI / 180, r = rnd(74, 104);
      tl.fromTo(s, { x: 100, y: 70, scale: .2, rotation: 0, autoAlpha: 1 }, { x: 100 + Math.cos(a) * r, y: 70 + Math.sin(a) * r, scale: rnd(1.1, 1.7), rotation: rnd(-160, 160), duration: .6, ease: 'power2.out' }, t + i * .03)
        .to(s, { autoAlpha: 0, scale: .4, duration: .25, ease: 'power1.in' }, t + .5 + i * .03);
    });
  }
  const ACTS = {
    wave(tl) {
      face(tl, 'happy', 0);
      tl.to(P.flipR, { rotation: -150, duration: .3, ease: 'back.out(2)' }, 0)
        .to(P.head, { rotation: 7, duration: .3 }, 0)
        .to(P.sq, { scaleY: 1.04, scaleX: .97, duration: .3 }, 0)
        .addLabel('pose', .3)
        .to(P.flipR, { rotation: -112, duration: .15, ease: 'sine.inOut', yoyo: true, repeat: 7 }, .3)
        .to(P.all, { rotation: 3, duration: .3, ease: 'sine.inOut', yoyo: true, repeat: 3 }, .3);
      talk(tl, .35, 4);
      face(tl, 'open', 1.3);
      tl.to({}, { duration: .25 }, 1.5);
    },
    hop(tl) { face(tl, 'happy', 0); tl.to([P.flipL], { rotation: 60, duration: .2 }, .1).to([P.flipR], { rotation: -60, duration: .2 }, .1); tl.addLabel('pose', .3); hopIn(tl, 0, 36); hopIn(tl, .62, 22, .18); },
    spin(tl) {
      face(tl, 'happy', 0);
      tl.to(P.flipL, { rotation: 95, duration: .2 }, 0).to(P.flipR, { rotation: -95, duration: .2 }, 0).addLabel('pose', .2);
      hopIn(tl, 0, 30, .34);
      tl.to(P.all, { scaleX: -1, duration: .17, ease: 'sine.inOut' }, .1).to(P.all, { scaleX: 1, duration: .17, ease: 'sine.inOut' }, .27)
        .to(P.all, { scaleX: -1, duration: .17, ease: 'sine.inOut' }, .44).to(P.all, { scaleX: 1, duration: .17, ease: 'sine.inOut' }, .61);
      tl.to({}, { duration: .3 }, 1.1);
    },
    giggle(tl) {
      face(tl, 'happy', 0);
      tl.to(P.cheeks, { scale: 1.3, duration: .2 }, 0)
        .to(P.flipL, { rotation: -42, duration: .15 }, 0).to(P.flipR, { rotation: 42, duration: .15 }, 0).addLabel('pose', .15)
        .to(P.all, { rotation: 4, duration: .07, ease: 'sine.inOut', yoyo: true, repeat: 9 }, .05)
        .to(P.sq, { scaleY: .95, scaleX: 1.04, duration: .09, ease: 'sine.inOut', yoyo: true, repeat: 7 }, .05)
        .to(P.head, { y: 3, duration: .09, ease: 'sine.inOut', yoyo: true, repeat: 7 }, .05);
      talk(tl, .05, 4);
      tl.to({}, { duration: .2 }, 1);
    },
    love(tl) {
      face(tl, 'happy', 0);
      tl.to(P.cheeks, { scale: 1.35, duration: .25 }, 0).to(P.head, { rotation: -8, duration: .3 }, 0)
        .to(P.flipL, { rotation: -46, duration: .25 }, 0).to(P.flipR, { rotation: 46, duration: .25 }, 0).addLabel('pose', .3)
        .to(P.sq, { scaleY: 1.05, scaleX: .96, duration: .35, ease: 'sine.inOut', yoyo: true, repeat: 3 }, .1);
      P.hearts.forEach((h, i) => {
        const x = 100 + (i - 1) * 46;
        tl.fromTo(h, { x, y: 40, scale: .3, autoAlpha: 0 }, { y: -14 - i * 6, x: x + rnd(-10, 10), scale: 1.7, autoAlpha: 1, duration: .7, ease: 'power2.out' }, .15 + i * .16)
          .to(h, { autoAlpha: 0, y: '-=14', duration: .3 }, .8 + i * .16);
      });
      tl.to({}, { duration: .2 }, 1.5);
    },
    clap(tl) {
      face(tl, 'happy', 0);
      tl.to(P.flipL, { rotation: -62, duration: .18, ease: 'power2.out' }, 0).to(P.flipR, { rotation: 62, duration: .18, ease: 'power2.out' }, 0)
        .addLabel('pose', .18)
        .to(P.flipL, { rotation: -36, duration: .1, ease: 'sine.inOut', yoyo: true, repeat: 7 }, .18).to(P.flipR, { rotation: 36, duration: .1, ease: 'sine.inOut', yoyo: true, repeat: 7 }, .18)
        .to(P.sq, { scaleY: .96, scaleX: 1.03, duration: .1, ease: 'sine.inOut', yoyo: true, repeat: 7 }, .18)
        .to(P.head, { rotation: 5, duration: .2, ease: 'sine.inOut', yoyo: true, repeat: 3 }, .18);
      starBurst(tl, .2);
      tl.to({}, { duration: .2 }, 1.1);
    },
    /* فرحة الفوز: قفزة كبيرة ونجوم ثم رقصة متكرّرة */
    cheer(tl, o) {
      const lv = o.level || 2;
      face(tl, 'happy', 0);
      tl.to(P.flipL, { rotation: 150, duration: .22, ease: 'back.out(2)' }, .08).to(P.flipR, { rotation: -150, duration: .22, ease: 'back.out(2)' }, .08)
        .to(P.mouth, { scaleY: 1, duration: .15 }, .1).addLabel('pose', .32);
      const t0 = hopIn(tl, 0, lv >= 3 ? 46 : 34, .3);
      starBurst(tl, .3);
      if (lv >= 3) tl.to(P.all, { scaleX: -1, duration: .16, ease: 'sine.inOut' }, .12).to(P.all, { scaleX: 1, duration: .16, ease: 'sine.inOut' }, .28);
      const d = G.timeline({ repeat: o.loop ? -1 : (lv >= 3 ? 3 : lv >= 2 ? 2 : 0), defaults: { ease: 'sine.inOut' } }), b = .3;
      [-1, 1].forEach((s, i) => {
        const t = i * b * 2;
        d.to(P.all, { rotation: 8 * s, duration: b }, t).to(P.all, { rotation: 0, duration: b }, t + b)
          .to(P.all, { y: -13, duration: b, ease: 'power2.out' }, t).to(P.all, { y: 0, duration: b, ease: 'power2.in' }, t + b)
          .to(P.sq, { scaleY: 1.06, scaleX: .96, duration: b }, t).to(P.sq, { scaleY: .95, scaleX: 1.05, duration: b * .5 }, t + b).to(P.sq, { scaleY: 1, scaleX: 1, duration: b * .5 }, t + b * 1.5)
          .to(P.flipL, { rotation: s < 0 ? 165 : 118, duration: b }, t).to(P.flipR, { rotation: s < 0 ? -118 : -165, duration: b }, t)
          .to(P.flipL, { rotation: 140, duration: b }, t + b).to(P.flipR, { rotation: -140, duration: b }, t + b)
          .to(P.head, { rotation: -6 * s, duration: b }, t).to(P.head, { rotation: 0, duration: b }, t + b)
          .to(P.footL, { y: s < 0 ? -5 : 0, duration: b }, t).to(P.footR, { y: s > 0 ? -5 : 0, duration: b }, t)
          .to([P.footL, P.footR], { y: 0, duration: b }, t + b);
      });
      tl.add(d, t0 + .25);
    },
    /* تشجيع لطيف بعد خطأ */
    encourage(tl) {
      tl.to(P.head, { rotation: -8, duration: .3 }, 0)
        .to(P.browL, { rotation: -12, y: -2, duration: .25 }, 0).to(P.browR, { rotation: 12, y: -2, duration: .25 }, 0)
        .to(P.flipL, { rotation: 128, duration: .3, ease: 'back.out(2.2)' }, .05)
        .to(P.cheeks, { scale: 1.2, duration: .3 }, 0)
        .addLabel('pose', .35)
        .to(P.flipL, { rotation: 104, duration: .2, ease: 'sine.inOut', yoyo: true, repeat: 5 }, .35)
        .to(P.head, { y: 3, duration: .2, ease: 'sine.inOut', yoyo: true, repeat: 5 }, .35)
        .to(P.sq, { scaleY: 1.04, scaleX: .97, duration: .2, ease: 'sine.inOut', yoyo: true, repeat: 5 }, .35);
      talk(tl, .3, 5);
      face(tl, 'happy', 1.3);
      tl.to({}, { duration: .5 }, 1.6);
    },
    think(tl, o) {
      tl.to(P.head, { rotation: -11, duration: .4 }, 0).to(P.eyes, { x: 5, y: -5, duration: .3 }, 0)
        .to(P.browL, { y: -4, rotation: -8, duration: .3 }, 0).to(P.browR, { y: 1, duration: .3 }, 0)
        .to(P.flipR, { rotation: -34, duration: .3 }, 0).to(P.footR, { rotation: -14, duration: .3 }, .1)
        .addLabel('pose', .9)
        .fromTo(P.dots, { autoAlpha: 0, scale: .2, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: .3, ease: 'back.out(2.5)', stagger: .18 }, .15)
        .to(P.dots[2], { y: -4, duration: .6, ease: 'sine.inOut', yoyo: true, repeat: 2 * Math.max(1, Math.round((o.hold || 2.4) / 1.2)) - 1 }, .8)
        .to(P.footR, { rotation: 0, duration: .16, ease: 'sine.inOut', yoyo: true, repeat: 5, repeatDelay: .12 }, .5)
        .to(P.dots, { autoAlpha: 0, scale: .4, duration: .2, stagger: -.06 }, '>')
        .to(P.eyes, { x: 0, y: 0, duration: .2 }, '<');
    },
    sleep(tl) {
      face(tl, 'sleepy', .35);
      tl.to([P.eyeL, P.eyeR], { scaleY: .1, duration: .35 }, 0)
        .to(P.head, { rotation: 9, y: 5, duration: .8, ease: 'sine.inOut' }, 0)
        .to(P.sq, { scaleY: .965, scaleX: 1.02, duration: .8, ease: 'sine.inOut' }, 0)
        .to([P.flipL], { rotation: -8, duration: .6 }, 0).to([P.flipR], { rotation: 8, duration: .6 }, 0)
        .to(P.eyes, { x: 0, y: 0, duration: .3 }, 0)
        .addLabel('pose', .85);
      const z = G.timeline({ repeat: -1 });
      P.zs.forEach((el, i) => z.fromTo(el, { x: 0, y: 0, scale: .5, rotation: -10, transformOrigin: '50% 50%' }, { x: 26 + i * 4, y: -44, scale: 1.15, rotation: 12, duration: 2.1, ease: 'sine.out' }, i * .7)
        .fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: .35 }, i * .7).to(el, { autoAlpha: 0, duration: .5 }, i * .7 + 1.6));
      const s = G.timeline({ repeat: -1, yoyo: true }).to(P.head, { y: 8, rotation: 11, duration: 1.9, ease: 'sine.inOut' }).to(P.mouth, { scaleY: .5, duration: 1.9, ease: 'sine.inOut' }, 0);
      tl.add(z, .7).add(s, .85);
    },
    wake(tl) {
      tl.set([P.eyeL, P.eyeR], { scaleY: .1 }, 0);
      face(tl, 'open', 0);
      tl.to([P.eyeL, P.eyeR], { scaleY: 1.18, scaleX: 1.1, duration: .16, ease: 'back.out(3)' }, 0)
        .to(P.browL, { y: -5, duration: .15 }, 0).to(P.browR, { y: -5, duration: .15 }, 0).addLabel('pose', .2);
      hopIn(tl, 0, 18, .16);
      tl.to([P.eyeL, P.eyeR], { scaleY: .08, duration: .07, yoyo: true, repeat: 3 }, .62)
        .to([P.eyeL, P.eyeR], { scaleY: 1, scaleX: 1, duration: .2 }, .95)
        .to([P.flipL], { rotation: 120, duration: .3, ease: 'back.out(2)' }, .7).to([P.flipR], { rotation: -120, duration: .3, ease: 'back.out(2)' }, .7)
        .to(P.sq, { scaleY: 1.07, scaleX: .95, duration: .3 }, .7).to(P.mouth, { scaleY: 1, duration: .25 }, .7)
        .to({}, { duration: .35 }, 1);
    },
    point(tl, o) {
      const L = o.side < 0, f = L ? P.flipL : P.flipR;
      tl.to(f, { rotation: o.rot, duration: .35, ease: 'back.out(1.8)' }, 0)
        .to(P.head, { rotation: clampN(o.side * 9, -10, 10), duration: .3 }, 0)
        .to(P.eyes, { x: o.ex, y: o.ey, duration: .25 }, 0)
        .to(P.all, { rotation: o.side * 4, duration: .3 }, 0)
        .to(P.mouth, { scaleY: .8, duration: .2 }, .1)
        .addLabel('pose', .4)
        .to(f, { rotation: o.rot + (L ? -9 : 9), duration: .22, ease: 'sine.inOut', yoyo: true, repeat: 2 * Math.round((o.hold || 2.4) / .44) - 1 }, .4)
        .to(P.eyes, { x: 0, y: 0, duration: .2 }, '>');
    }
  };
  const clampN = (v, a, b) => Math.max(a, Math.min(b, v));
  /** إيقاف كل حركات أجزاء الجسم (عدا التنفّس) قبل حركة جديدة */
  const rig = () => [P.all, P.sq, P.head, P.eyes, P.eyeL, P.eyeR, P.flipL, P.flipR, P.footL, P.footR, P.browL, P.browR, P.mouth, P.shadow, P.open, P.happy, P.sleepy, ...P.cheeks, ...P.zs, ...P.dots, ...P.stars, ...P.hearts];
  const calm = () => G.killTweensOf(rig());

  function stopAct() {
    if (act) { act.kill(); act = null; }
    busy = false; sleeping = false;
    if (ready) { calm(); neutral(G.timeline(), 0); }
  }
  /** تشغيل حركة. مع تقليل الحركة: وضعية ثابتة لفترة ثم عودة */
  function play(name, o) {
    if (!ready || !enabled) return null;
    o = o || {};
    if (act) { act.kill(); act = null; }
    sleeping = name === 'sleep'; busy = true;
    calm();
    if (reduce) neutral(G.timeline(), 0);
    const sub = G.timeline(); ACTS[name](sub, o);
    if (reduce) {
      sub.pause(); sub.seek(sub.labels.pose != null ? 'pose' : 0, false);
      act = sub; act._held = true;
      if (!o.loop && name !== 'sleep') G.delayedCall(o.hold || 1.8, () => { if (act === sub) idle(); });
      return sub;
    }
    const tl = G.timeline({ onComplete: () => { if (act === tl) idle(); } });
    neutral(tl, .14); tl.add(sub, .12);
    act = tl;
    if (!live()) tl.pause();
    return tl;
  }
  function idle() {
    if (act) { act.kill(); act = null; }
    busy = false; sleeping = false;
    if (mode === 'float' && floatKind === 'win' && winOv && visible) { play('cheer', { level: 2, loop: true }); return; }
    calm(); neutral(G.timeline(), reduce ? 0 : .35);
  }

  /* ------------------------------------------------------------------
     فقاعة الكلام
     ------------------------------------------------------------------ */
  /* عناصر لا تغطيها الفقاعة (مفتاح اللغة، الشريط العلوي، صف الأطفال، الشعار) */
  const AVOID = '#mLang, .topbar, #kids, #logo, .panel';
  const hit = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  function bubble(text, hold) {
    if (!ready || !visible) return;
    if (bubCall) { bubCall.kill(); bubCall = null; }
    bubTxt.textContent = text;
    bub.dir = App.lang === 'en' ? 'ltr' : 'rtl';
    G.killTweensOf(bub);
    bub.classList.remove('side-l', 'side-r'); bub.style.maxWidth = '';
    G.set(bub, { x: 0, y: 0, xPercent: -50, scale: 1, transformOrigin: '50% 100%' });
    // كل القراءات أولًا ثم الكتابة: فوق البطريق إن كان المكان خاليًا، وإلا بجانبه
    const r = root.getBoundingClientRect(), W = innerWidth, sc = r.width / (root.offsetWidth || r.width) || 1;
    const avoid = [...document.querySelectorAll(AVOID)].filter(e => e.offsetParent && !root.contains(e) && !(winOv && winOv.contains(e) && mode !== 'float')).map(e => e.getBoundingClientRect());
    let bw = bub.offsetWidth * sc, bh = bub.offsetHeight * sc;
    const c = r.left + r.width / 2;
    let shift = 0;
    if (c - bw / 2 < 8) shift = 8 - (c - bw / 2); else if (c + bw / 2 > W - 8) shift = (W - 8) - (c + bw / 2);
    const top = r.top - bh + 4 * sc, above = { left: c - bw / 2 + shift, right: c + bw / 2 + shift, top, bottom: top + bh };
    if (top >= 2 && !avoid.some(a => hit(above, a))) {
      shift /= sc;
      bub.style.setProperty('--tx', clampN(-shift, -bw / sc / 2 + 22, bw / sc / 2 - 22) + 'px');
      show(shift, 0);
    } else {
      // بجانب الرأس، في الجهة الأوسع
      // الجهة الأوسع، مع تفضيل الجهة التي لا تغطي التحية إن اتسعت للفقاعة
      const room = { l: r.left - 6, r: W - r.right - 6 }, he = document.getElementById('hello'), hr = he && he.offsetParent ? he.getBoundingClientRect() : null;
      let right = room.r >= room.l;
      if (hr) { const helloRight = hr.left + hr.width / 2 > c; if (helloRight === right && (helloRight ? room.l : room.r) + r.width * .1 >= 150) right = !right; }
      const sp = (right ? room.r : room.l) + r.width * .1;
      if (sp < 110) { G.set(bub, { autoAlpha: 0 }); return; }
      bub.style.maxWidth = Math.min(236, sp) / sc + 'px';
      bw = bub.offsetWidth; bh = bub.offsetHeight;
      bub.classList.add(right ? 'side-r' : 'side-l');
      const w = root.offsetWidth, H = w * RATIO, x = right ? w * .9 : -bw + w * .1;
      G.set(bub, { xPercent: 0, transformOrigin: right ? '0% 60%' : '100% 60%' });
      // الفقاعة عند مستوى الرأس، وتنزل قليلًا إن اصطدمت بشيء
      let y = H * .42 + bh / 2;
      const box = () => ({ left: r.left + x * sc, right: r.left + (x + bw) * sc, top: r.top + (y - bh) * sc, bottom: r.top + y * sc });
      for (let k = 0; k < 8 && avoid.some(a => hit(box(), a)); k++) y += 10;
      show(x, y, true);
    }
    function show(x, y, side) {
      if (side) G.set(bub, { left: 0, xPercent: 0 });
      else G.set(bub, { clearProps: 'left' });
      if (reduce) G.set(bub, { x, y, autoAlpha: 1 });
      else G.fromTo(bub, { x, y, scale: .4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .38, ease: 'back.out(2)' });
    }
    bubCall = G.delayedCall(hold || clampN(1.4 + text.length * .07, 2, 4.5), hideBubble);
  }
  function hideBubble() {
    if (bubCall) { bubCall.kill(); bubCall = null; }
    if (!ready) return;
    G.killTweensOf(bub);
    if (reduce) G.set(bub, { autoAlpha: 0 }); else G.to(bub, { scale: .6, autoAlpha: 0, duration: .18, ease: 'power2.in' });
  }
  function speak(text) {
    ownSpeak = true;
    try { App.speak(text, App.lang); } catch (e) {}
    ownSpeak = false;
  }

  /* ------------------------------------------------------------------
     الظهور: في الشاشة الرئيسية (داخل الصفحة) أو عائمًا فوق الألعاب
     ------------------------------------------------------------------ */
  function homeMount() {
    if (customMount && customMount.isConnected) return customMount;
    const spot = document.getElementById('mascotSpot'); // مكان محجوز له بجانب التحية (index.html)
    if (spot) return spot;
    let m = document.getElementById('mascotHome');
    if (!m) {
      const hero = document.querySelector('#menu .hero'); if (!hero) return null;
      m = document.createElement('div'); m.id = 'mascotHome'; m.className = 'mc-auto';
      const logo = hero.querySelector('#logo');
      hero.insertBefore(m, logo ? logo.nextSibling : hero.firstChild);
    }
    return m;
  }
  function setVisible(v) { visible = v; rectDirty = true; loops(); }
  function clearFloat() {
    if (hideCall) { hideCall.kill(); hideCall = null; }
    if (popTw) { popTw.kill(); popTw = null; }
    winOv = null; floatKind = '';
  }
  function toHome(pop) {
    if (!build() || !enabled) return;
    const m = homeMount(); if (!m) return;
    clearFloat();
    const was = mode === 'home' && root.parentNode === m;
    if (!was) {
      stopAct(); hideBubble();
      G.killTweensOf(root); m.appendChild(root);
      root.classList.remove('nohit'); root.style.removeProperty('--ms');
      G.set(root, { clearProps: 'transform' });
      mode = 'home';
    }
    document.documentElement.classList.add('mc-home');
    if (homeHidden) { G.set(root, { autoAlpha: 0 }); setVisible(false); return; }
    if (!was || !visible) {
      if (pop && !reduce) popTw = G.fromTo(root, { scale: .2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .55, ease: 'back.out(1.9)', clearProps: 'transform' });
      else G.set(root, { autoAlpha: 1 });
    }
    setVisible(true); armSleep();
  }
  function leaveHome() {
    if (!ready) return;
    clearTimeout(sleepT);
    if (mode !== 'home') return;
    stopAct(); hideBubble(); G.killTweensOf(root);
    G.set(root, { autoAlpha: 0 }); layer.appendChild(root);
    mode = 'none'; setVisible(false);
  }
  /** إظهاره عائمًا عند (x, y) = الزاوية العليا اليسرى، بحجم size */
  function toFloat(x, y, size, o) {
    if (!build() || !enabled) return false;
    o = o || {};
    clearFloat();
    if (mode === 'home') { stopAct(); hideBubble(); }
    G.killTweensOf(root);
    if (root.parentNode !== layer) layer.appendChild(root);
    mode = 'float'; floatKind = o.kind || 'show';
    root.style.setProperty('--ms', size + 'px');
    root.classList.toggle('nohit', !o.hit);
    const H = size * RATIO;
    fPos = { x, y, S: size };
    if (reduce) G.set(root, { x, y, scale: 1, autoAlpha: 1 });
    else if (o.from === 'below') popTw = G.fromTo(root, { x, y: y + H + 30, scale: 1, autoAlpha: 1 }, { y, duration: .5, ease: 'back.out(1.5)' });
    else popTw = G.fromTo(root, { x, y, scale: .2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .5, ease: 'back.out(1.9)' });
    setVisible(true);
    if (o.hold) hideCall = G.delayedCall(o.hold, hideFloat);
    return true;
  }
  function hideFloat() {
    if (!ready || mode !== 'float') return;
    const kind = floatKind;
    clearFloat(); hideBubble();
    const done = () => { if (mode !== 'float') return; stopAct(); G.set(root, { autoAlpha: 0 }); mode = 'none'; setVisible(false); if (App.current === 'menu') toHome(true); };
    if (reduce) { done(); return; }
    mode = 'float';
    popTw = kind === 'peek' ? G.to(root, { y: '+=' + (root.offsetHeight + 40), duration: .3, ease: 'power2.in', onComplete: done })
      : G.to(root, { scale: .2, autoAlpha: 0, duration: .22, ease: 'power2.in', onComplete: done });
  }
  /* زاوية سفلية صغيرة داخل اللعبة */
  function peek(o) {
    o = o || {};
    const size = o.size || clampN(Math.round(Math.min(innerWidth, innerHeight) * .22), 72, 104), H = size * RATIO;
    const left = o.corner ? /l/.test(o.corner) : document.documentElement.dir === 'rtl';
    const x = o.x != null ? o.x : (left ? 10 : innerWidth - size - 10), y = o.y != null ? o.y : innerHeight - H - 10;
    return toFloat(x, y, size, { kind: o.kind || 'peek', from: o.x != null ? '' : 'below', hold: o.hold == null ? 3.2 : o.hold, hit: !!o.hit });
  }

  /* ------------------------------------------------------------------
     نافذة الفوز: يرقص واقفًا على حافة اللوحة العليا (أو بجانبها) دون أن يغطي أزرارها
     ------------------------------------------------------------------ */
  function panelRect(o) {
    const p = o.querySelector('.panel'); if (!p || !p.offsetParent) return null;
    let x = 0, y = 0, el = p;
    while (el && el !== o) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    const r = o.getBoundingClientRect();
    if (el !== o) { const b = p.getBoundingClientRect(); return { left: b.left, top: b.top, width: b.width, height: b.height, right: b.right, bottom: b.bottom }; }
    return { left: r.left + x, top: r.top + y, width: p.offsetWidth, height: p.offsetHeight, right: r.left + x + p.offsetWidth, bottom: r.top + y + p.offsetHeight };
  }
  function winSpot(o) {
    const r = panelRect(o); if (!r) return null;
    const W = innerWidth, Ht = innerHeight, rtl = document.documentElement.dir === 'rtl';
    let S = clampN(Math.round(Math.min(W, Ht) * .27), 78, 124), H = S * RATIO;
    const top = 6;
    // فوق اللوحة (يقف على حافتها)
    const above = r.top - top;
    if (above >= 70 * RATIO) {
      if (above < H - 8) { S = Math.floor((above + 8) / RATIO); H = S * RATIO; }
      return { x: rtl ? r.left + 14 : r.right - S - 14, y: r.top - H + 9, S, bubble: above - H > 52 };
    }
    // بجانبها
    const side = Math.max(r.left, W - r.right);
    if (side >= 80) {
      S = Math.min(S, Math.floor(side - 8)); H = S * RATIO;
      const leftSide = r.left >= W - r.right ? !rtl || W - r.right < 80 : rtl && r.left >= 80;
      return { x: (r.left >= 80 && (leftSide || W - r.right < 80)) ? r.left - S - 2 : r.right + 2, y: Math.min(Ht - H - 6, r.bottom - H), S, bubble: true };
    }
    // تحتها
    if (Ht - r.bottom >= 66 * RATIO) { S = Math.min(S, Math.floor((Ht - r.bottom - 6) / RATIO)); return { x: rtl ? r.left + 10 : r.right - S - 10, y: r.bottom + 2, S, bubble: false }; }
    return null;
  }
  function placeWin(o, fresh) {
    const s = winSpot(o); if (!s) { if (!fresh) hideFloat(); return false; }
    if (fresh) { if (!toFloat(s.x, s.y, s.S, { kind: 'win', hit: true })) return false; winOv = o; }
    else { root.style.setProperty('--ms', s.S + 'px'); G.set(root, { x: s.x, y: s.y }); fPos = { x: s.x, y: s.y, S: s.S }; rectDirty = true; }
    return s;
  }
  const CHEERS = [[() => App.g('أحسنتِ! 🌟', 'أحسنتَ! 🌟'), 'Well done! 🌟'], [() => 'رائع! 🎉', 'Awesome! 🎉'], [() => App.g('يا بطلة! 💪', 'يا بطل! 💪'), 'Superstar! 💪'], [() => 'ممتاز! ⭐', 'Great job! ⭐'], [() => 'مذهل! ✨', 'Amazing! ✨']];
  const TRIES = [[() => App.g('حاولي مرة أخرى، أنتِ تقدرين! 💪', 'حاول مرة أخرى، أنت تقدر! 💪'), 'Try again, you can do it! 💪'], [() => App.g('قريبة جدًا! جرّبي ثانية 🌟', 'قريب جدًا! جرّب ثانية 🌟'), 'So close! Have another go 🌟'],
    [() => App.g('لا بأس، أنتِ رائعة! 💖', 'لا بأس، أنت رائع! 💙'), "It's okay, you're doing great! 💖"]];
  const TAPS = [[() => 'هههه! 😄', 'Hee hee! 😄'], [() => 'يا سلام! 🎈', 'Wheee! 🎈'], [() => 'هيا نلعب! 🎮', "Let's play! 🎮"], [() => App.g('أحبّكِ! 💖', 'أحبّك! 💙'), 'I like you! 💖'], [() => 'أنا بطريق! 🐧', "I'm a penguin! 🐧"]];
  const phrase = list => { const p = pick(list); return T(p[0](), p[1]); };

  function onOverlay(o) {
    if (!enabled || App.current === 'menu' || !o.classList.contains('on')) return;
    const stars = o.querySelector('.stars3');
    let next = null; try { next = App.findNext(o); } catch (e) {}
    if (stars || next) {
      let lv = 3;
      if (stars && stars.children.length) lv = clampN([...stars.children].filter(s => !s.classList.contains('off')).length, 1, 3);
      const s = placeWin(o, true); if (!s) return;
      lastEnc = performance.now();
      play('cheer', { level: lv, loop: true });
      if (s.bubble) G.delayedCall(.45, () => { if (winOv === o && visible) bubble(phrase(CHEERS), 2.6); });
    } else if (/حاول|مرة أخرى|try again/i.test(o.textContent || '') && o.querySelector('.panel')) {
      const s = placeWin(o, true); if (!s) return;
      floatKind = 'lose'; lastEnc = performance.now();
      play('encourage');
      if (s.bubble) G.delayedCall(.45, () => { if (winOv === o && visible) bubble(phrase(TRIES), 3.2); });
    }
  }
  function watchOverlays() {
    if (!window.MutationObserver) return;
    new MutationObserver(rs => {
      for (const r of rs) {
        const o = r.target;
        if (!o.classList || !o.classList.contains('overlay')) continue;
        const on = o.classList.contains('on');
        if (on === !!o._mcOn) continue;
        o._mcOn = on;
        if (on) setTimeout(() => { if (o.classList.contains('on') && winOv !== o) onOverlay(o); }, 380); // بعد أن ترسم اللعبة محتوى اللوحة
        else if (winOv === o) hideFloat();
      }
    }).observe(document.body, { attributes: true, attributeFilter: ['class'], subtree: true });
  }

  /* ------------------------------------------------------------------
     التشجيع التلقائي داخل الألعاب (محدود التكرار)
     ------------------------------------------------------------------ */
  function auto(kind) {
    if (!enabled || !ready || App.current === 'menu' || document.hidden) return;
    const now = performance.now();
    if (mode === 'float' && visible) return;
    if (document.getElementById('sheetWrap').classList.contains('on')) return;
    if (kind === 'err') { // خطآن متقاربان قبل أن يظهر
      const near = now - errT < 12000; errT = now;
      if (!near || now - lastEnc < 26000) return;
    } else if (now - lastEnc < 16000) return;
    lastEnc = now; errT = 0;
    if (!peek({ hold: 3.4 })) return;
    play('encourage');
    G.delayedCall(.4, () => { if (mode === 'float' && floatKind === 'peek') bubble(phrase(TRIES), 2.8); });
  }

  /* ------------------------------------------------------------------
     لمس البطريق + النوم
     ------------------------------------------------------------------ */
  function onTap(e) {
    if (!enabled || !visible) return;
    e.stopPropagation();
    if (sleeping) { wake(); return; }
    armSleep();
    const names = ['giggle', 'hop', 'spin', 'love', 'wave', 'clap'];
    let i; do { i = (Math.random() * names.length) | 0; } while (i === lastTap); lastTap = i;
    const n = names[i];
    try { if (n === 'hop' || n === 'spin') Sound.jump(); else if (n === 'giggle') Sound.squeak(.3); else Sound.pop(); } catch (er) {}
    try { vibrate(12); } catch (er) {}
    play(n);
    if (mode === 'home' && (n === 'giggle' || n === 'love' || Math.random() < .35)) bubble(n === 'love' ? T(TAPS[3][0](), TAPS[3][1]) : phrase(TAPS), 1.8);
  }
  function armSleep() {
    clearTimeout(sleepT);
    if (mode !== 'home' || !enabled) return;
    sleepT = setTimeout(() => {
      if (mode !== 'home' || !visible || document.hidden || App.current !== 'menu') return;
      if (busy && !sleeping) { armSleep(); return; }
      if (!sleeping) api.sleep();
    }, 40000);
  }
  function wake() {
    if (!ready || !sleeping) return;
    try { Sound.pop(); } catch (e) {}
    play('wake'); armSleep();
  }

  function greet() {
    const k = App.profile; if (!k || greeted.has(k.id) || !visible || mode !== 'home') return;
    greeted.add(k.id);
    const text = T(`أهلًا يا ${k.name}!`, `Hi, ${App.kidName(k)}!`);
    play('wave'); bubble(text + ' 👋', 3); speak(text);
  }

  /* ------------------------------------------------------------------
     الملابس
     ------------------------------------------------------------------ */
  function applyOutfit(id, fun) {
    const o = outfitById(id);
    if (o.id === outfitId && ready) return;
    outfitId = o.id;
    if (!ready) return;
    P.aBack.innerHTML = part(o, 'back', 'm'); P.aBody.innerHTML = part(o, 'body', 'm');
    P.aNeck.innerHTML = part(o, 'neck', 'm'); P.aHead.innerHTML = part(o, 'head', 'm');
    P.tuft.style.display = o.hat ? 'none' : '';
    if (fun && visible && !sleeping) play('spin');
  }
  const savedOutfit = () => { try { const id = App.equipped(CAT); return App.owns(id) ? id : 'pg_none'; } catch (e) { return 'pg_none'; } };

  /* ------------------------------------------------------------------
     الواجهة العامة
     ------------------------------------------------------------------ */
  const api = {
    get enabled() { return enabled; },
    get outfit() { return outfitId; },
    get state() { return { mode, visible, busy, sleeping, kind: floatKind, reduce }; },
    OUTFITS,
    /** إظهاره. في القائمة: مكانه المعتاد. داخل لعبة: زاوية صغيرة {corner:'bl'|'br', x, y, size, hold (ث، 0 = يبقى), hit} */
    show(o) {
      if (!enabled) return;
      o = o || {};
      if (App.current === 'menu' && o.x == null && !o.corner) { homeHidden = false; toHome(true); return; }
      peek({ kind: 'show', hold: o.hold == null ? 0 : o.hold, corner: o.corner, x: o.x, y: o.y, size: o.size, hit: o.hit !== false });
    },
    hide() {
      if (!ready) return;
      if (mode === 'float') hideFloat();
      else if (mode === 'home') { homeHidden = true; stopAct(); hideBubble(); G.set(root, { autoAlpha: 0 }); setVisible(false); }
    },
    /** فقاعة كلام. opts: { speak: true لينطقها, hold: ثوانٍ, anim: false } */
    say(ar, en, o) {
      if (!enabled || !build()) return;
      o = o || {};
      const text = T(ar, en); if (!text) return;
      if (!visible) { if (App.current === 'menu') { homeHidden = false; toHome(true); } else if (!peek({ hold: (o.hold || 3) + .6 })) return; }
      if (sleeping) play('wake');
      else if (o.anim !== false && !busy) { const t = play('wave'); if (t && mode !== 'home') { /* تلويحة قصيرة */ } }
      bubble(text, o.hold);
      if (o.speak) speak(text);
    },
    /** فرحة: 1 تصفيق، 2 قفزة ورقصة، 3 احتفال كامل */
    cheer(level) {
      if (!enabled || !build()) return;
      const lv = clampN(level == null ? 2 : level | 0, 1, 3);
      if (!visible) { if (App.current === 'menu') { homeHidden = false; toHome(true); } else if (!peek({ hold: lv >= 3 ? 4.4 : 3.2 })) return; }
      if (lv === 1) play('clap'); else play('cheer', { level: lv });
      try { if (lv >= 2 && Fx.on && Fx.burst) { const r = fig.getBoundingClientRect(); Fx.burst(r.left + r.width / 2, r.top + r.height * .3, lv * 3, ['⭐', '✨']); } } catch (e) {}
    },
    /** تشجيع لطيف بعد خطأ (لا ينطق كي لا يقاطع صوت اللعبة) */
    encourage() {
      if (!enabled || !build()) return;
      if (!visible) { if (App.current === 'menu') { homeHidden = false; toHome(true); } else if (!peek({ hold: 3.4 })) return; }
      lastEnc = performance.now();
      play('encourage'); bubble(phrase(TRIES), 2.8);
    },
    /** يشير إلى عنصر أو نقطة {x, y} (إحداثيات الشاشة) */
    pointAt(t, o) {
      if (!enabled || !build() || !t) return;
      o = o || {};
      let tx, ty;
      if (t.getBoundingClientRect) { const r = t.getBoundingClientRect(); tx = r.left + r.width / 2; ty = r.top + r.height / 2; }
      else if (Array.isArray(t)) { tx = +t[0]; ty = +t[1]; } else { tx = +t.x; ty = +t.y; }
      if (!isFinite(tx) || !isFinite(ty)) return;
      const hold = o.hold || 2.4;
      if (!visible) {
        if (App.current === 'menu') { homeHidden = false; toHome(true); }
        else if (!peek({ hold: hold + 1, corner: tx > innerWidth / 2 ? 'bl' : 'br' })) return;
      }
      const r = root.getBoundingClientRect();
      // بعد حركة الدخول يكون موضعه النهائي معروفًا من x/y
      const fx = mode === 'float' ? fPos.x : r.left, w = mode === 'float' ? fPos.S : r.width, k = w / VB_W;
      const fy = mode === 'float' ? fPos.y : r.top;
      const side = tx < fx + w / 2 ? -1 : 1, sx = fx + (side < 0 ? 55 : 145) * k, sy = fy + 130 * k;
      const ang = Math.atan2(ty - sy, tx - sx) * 180 / Math.PI;       // اتجاه الهدف (0 = يمين، 90 = أسفل)
      const base = side < 0 ? 112 : 68;                                // اتجاه الزعنفة وهي مرتخية
      let rot = ang - base; while (rot > 180) rot -= 360; while (rot < -180) rot += 360;
      const d = Math.hypot(tx - sx, ty - sy) || 1;
      play('point', { side, rot, hold, ex: (tx - sx) / d * 5.5, ey: (ty - sy) / d * 4.5 });
    },
    think(hold) {
      if (!enabled || !build()) return;
      if (!visible) { if (App.current === 'menu') { homeHidden = false; toHome(true); } else if (!peek({ hold: (hold || 2.4) + 1.2 })) return; }
      play('think', { hold: hold || 2.4 });
    },
    sleep() { if (!enabled || !ready || !visible || sleeping) return; hideBubble(); play('sleep'); },
    wake() { wake(); },
    /** تغيير الزيّ (يُحفظ للطفل الحالي إن كان يملكه) */
    setOutfit(id) {
      const o = outfitById(id);
      try { if (App.profile && App.owns(o.id)) store.set('eq:' + CAT, o.id); } catch (e) {}
      applyOutfit(o.id, true);
    },
    /** مكان مخصّص له في الشاشة الرئيسية (عنصر أو محدِّد). بلا وسيط: المكان الافتراضي */
    mount(container) {
      customMount = typeof container === 'string' ? document.querySelector(container) : container || null;
      if (ready && mode === 'home') { mode = 'none'; }
      if (App.current === 'menu' && enabled && App.profile) toHome(false);
    },
    setEnabled(v) {
      enabled = !!v; gstore.set('mascot', enabled);
      document.documentElement.classList.toggle('mc-off', !enabled);
      if (!enabled) {
        clearTimeout(sleepT);
        if (ready) { clearFloat(); stopAct(); hideBubble(); G.killTweensOf(root); G.set(root, { autoAlpha: 0 }); layer.appendChild(root); mode = 'none'; setVisible(false); }
        document.documentElement.classList.remove('mc-home');
      } else sync();
    }
  };
  window.Mascot = api;
  document.documentElement.classList.toggle('mc-off', !enabled);

  /* ------------------------------------------------------------------
     الربط مع التطبيق (لفّ الدوال دون تعديلها)
     ------------------------------------------------------------------ */
  let lastKid = null, booted = false;
  function sync() {
    if (!enabled || !App.profile) return;
    if (!build()) return;
    applyOutfit(savedOutfit(), false);
    if (App.current !== 'menu') { leaveHome(); return; }
    if (mode === 'float') { clearFloat(); stopAct(); hideBubble(); G.killTweensOf(root); G.set(root, { autoAlpha: 0 }); mode = 'none'; setVisible(false); }
    const kid = App.profile.id, changed = lastKid !== kid, first = !booted; lastKid = kid; booted = true;
    const hi = () => { if (App.current === 'menu' && enabled && !sleeping) greet(); };
    if (first && window.Splash && Splash.active) {
      // ينتظر خلف شاشة البداية ثم يقفز إلى مكانه ويحيّي
      toHome(false); G.set(root, { autoAlpha: 0 });
      Splash.onEnd(() => {
        if (mode !== 'home' || homeHidden) return;
        if (reduce) G.set(root, { autoAlpha: 1 });
        else popTw = G.fromTo(root, { scale: .2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: .6, delay: .55, ease: 'back.out(1.9)', clearProps: 'transform' });
        setTimeout(hi, 1250);
      });
      return;
    }
    toHome(true);
    if (changed || first) setTimeout(hi, first ? 900 : 350);
  }
  const wrap = (obj, name, after) => {
    const orig = obj[name]; if (typeof orig !== 'function') return;
    obj[name] = function () { const r = orig.apply(this, arguments); try { after.apply(this, arguments); } catch (e) { console.warn('Mascot', e); } return r; };
  };
  wrap(App, 'renderMenu', sync);
  wrap(App, 'show', () => { if (mode === 'float') { clearFloat(); if (ready) { stopAct(); hideBubble(); G.killTweensOf(root); G.set(root, { autoAlpha: 0 }); mode = 'none'; setVisible(false); } } lastEnc = performance.now() - 20000; errT = 0; sync(); });
  wrap(App, 'shopSheet', () => { if (enabled && ready) applyOutfit(savedOutfit(), true); });
  wrap(App, 'speak', text => { if (!ownSpeak && typeof text === 'string' && /حاول|جرّب|try again/i.test(text)) auto('try'); });
  wrap(Sound, 'error', () => auto('err'));
  /* صف «الشخصية المرافقة» في الإعدادات */
  wrap(App, 'settings', function () {
    const s = document.getElementById('sheet'); if (!s || s.querySelector('[data-k="mascot"]')) return;
    const row = document.createElement('div'); row.className = 'row';
    row.innerHTML = `<span class="lbl">🐧 ${T('الشخصية المرافقة', 'Companion')}</span><div class="seg" data-k="mascot"><button data-v="1" class="${enabled ? 'on' : ''}">${T('تشغيل', 'On')}</button><button data-v="0" class="${enabled ? '' : 'on'}">${T('إيقاف', 'Off')}</button></div>`;
    const vib = s.querySelector('.seg[data-k="vib"]'), ref = vib && vib.closest('.row');
    if (ref) ref.after(row); else { const rows = s.querySelectorAll('.row'); if (rows.length) rows[rows.length - 1].after(row); else s.appendChild(row); }
    row.querySelectorAll('button').forEach(b => b.onclick = () => { try { Sound.tap(); } catch (e) {} api.setEnabled(b.dataset.v === '1'); App.settings(); });
  });
  watchOverlays();
})();
