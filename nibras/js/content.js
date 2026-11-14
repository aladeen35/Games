/* =====================================================================
   نبراس — بيانات المنهج والمحتوى (منفصلة تمامًا عن محرّك الألعاب)
   ---------------------------------------------------------------------
   كل درس سجلّ مستقل بالحقول التي تطلبها لوحة إدارة المحتوى لاحقًا:
   id · grade · subject · unit · title · outcome (ناتج التعلم) · skill
   diff (الصعوبة) · source (الكتاب/الصفحة) · status (حالة الاعتماد) · acts
   ---------------------------------------------------------------------
   أنواع الأنشطة (محرّك الألعاب في games.js — تُضاف أنواع جديدة دون تعديل هذا الملف):
   choose  : اختيار (q, say?, listen?, tf?, vis?, opts, a, hint, ex, apply?)
   match   : مطابقة (q, pairs:[[يمين, يسار], ...])
   order   : ترتيب (q, items بالترتيب الصحيح, mode: letters|words|nums|steps, vis?)
   ws      : بحث عن الكلمات (q, words:[{w, e, m}], size, dirs: hv|hvd, show: pic|word|both)
   memory  : لعبة الذاكرة (q, pairs:[[a, b], ...]) — games2.js
   sort    : التصنيف في سلال (q, bins:[...], items:[{t, e, bin}]) — games2.js
   pop     : فقاعات؛ المس الصحيح فقط (q, items:[{t, e, ok}]) — games2.js
   الأشكال المرسومة: circle square rectangle triangle star heart oval hexagon diamond pentagon
   ---------------------------------------------------------------------
   دروس المنهج الفعلية تأتي من research/ عبر tools/import-research.mjs ← js/curriculum-data.js،
   وتحلّ محل الدروس النموذجية أدناه للصف والمادة اللذين تغطيهما.
   ---------------------------------------------------------------------
   ⚠️ كل المحتوى هنا نموذجي توضيحي (status: 'prototype_only') وليس نصوصًا من الكتب
   المدرسية. يجب ربط كل درس برقم الكتاب وإصداره والوحدة والصفحة ومراجعته قبل اعتماده.
   ===================================================================== */
'use strict';
(function () {
const E = (e, t) => ({ e, t });          // صورة (إيموجي) + نص
const S = (shape, t) => ({ shape, t });  // شكل هندسي مرسوم
const C = (color, t) => ({ color, t });  // لون
const rep = (e, n) => Array(n).fill(e).join('');

N.C = {
  version: '0.1-prototype',
  stages: [
    { id: 'kg', name: { ar: 'رياض الأطفال', en: 'Kindergarten' }, e: '🌱' },
    { id: 'pri', name: { ar: 'المرحلة الابتدائية', en: 'Primary' }, e: '📘' },
    { id: 'mid', name: { ar: 'المرحلة المتوسطة', en: 'Middle school' }, e: '🔬' }
  ],
  grades: [
    { id: 'kg', stage: 'kg', name: { ar: 'الروضة', en: 'KG' }, world: 'w1' },
    { id: 'g1', stage: 'pri', name: { ar: 'الصف الأول', en: 'Grade 1' }, world: 'w2' },
    { id: 'g2', stage: 'pri', name: { ar: 'الصف الثاني', en: 'Grade 2' }, world: 'w2' },
    { id: 'g3', stage: 'pri', name: { ar: 'الصف الثالث', en: 'Grade 3' }, world: 'w3' },
    { id: 'g4', stage: 'pri', name: { ar: 'الصف الرابع', en: 'Grade 4' }, world: 'w3' },
    { id: 'g5', stage: 'pri', name: { ar: 'الصف الخامس', en: 'Grade 5' }, world: 'w4' },
    { id: 'g6', stage: 'pri', name: { ar: 'الصف السادس', en: 'Grade 6' }, world: 'w4' },
    { id: 'm1', stage: 'mid', name: { ar: 'الأول المتوسط', en: 'Middle 1' }, world: 'w5' },
    { id: 'm2', stage: 'mid', name: { ar: 'الثاني المتوسط', en: 'Middle 2' }, world: 'w5' },
    { id: 'm3', stage: 'mid', name: { ar: 'الثالث المتوسط', en: 'Middle 3' }, world: 'w5' }
  ],
  worlds: [
    { id: 'w1', ic: 'sprout', name: { ar: 'حديقة الاكتشاف', en: 'Discovery Garden' }, e: '🌳', bg: '#58B868' },
    { id: 'w2', ic: 'alphabet-blocks', name: { ar: 'قرية الحروف والأعداد', en: 'Letters & Numbers Village' }, e: '🏡', bg: '#1BBFAF' },
    { id: 'w3', ic: 'building', name: { ar: 'مدينة المعرفة', en: 'City of Knowledge' }, e: '🏙️', bg: '#3E8ED0' },
    { id: 'w4', ic: 'castle', name: { ar: 'مملكة العلوم والمهارات', en: 'Kingdom of Science & Skills' }, e: '🏰', bg: '#7B68C8' },
    { id: 'w5', ic: 'flask', name: { ar: 'مختبر العقول', en: 'Minds Lab' }, e: '🧪', bg: '#2C3E66' }
  ],
  subjects: {
    ar:   { ic: 'book', name: { ar: 'اللغة العربية', en: 'Arabic' }, e: '📖', color: '#12A5A0' },
    math: { ic: 'calculator', name: { ar: 'الرياضيات', en: 'Mathematics' }, e: '🔢', color: '#F28C28' },
    sci:  { ic: 'microscope', name: { ar: 'العلوم', en: 'Science' }, e: '🔬', color: '#2FA84F' },
    en:   { ic: 'languages', name: { ar: 'اللغة الإنجليزية', en: 'English' }, e: '🔤', color: '#5B6BD6' },
    soc:  { ic: 'globe', name: { ar: 'التاريخ والجغرافيا', en: 'History & Geography' }, e: '🗺️', color: '#B7793E' },
    art:  { ic: 'palette', name: { ar: 'الأشكال والألوان', en: 'Shapes & Colours' }, e: '🎨', color: '#D9608F' },
    isl:  { ic: 'lantern', name: { ar: 'التربية الإسلامية', en: 'Islamic Studies' }, e: '🕌', color: '#3A8F6B',
            note: { ar: 'يُضاف بعد مراجعة النصوص من مختصين', en: 'Added after specialist review of texts' } },
    comp: { ic: 'monitor', name: { ar: 'الحاسوب', en: 'Computer' }, e: '💻', color: '#4A6FA5' }
  },
  /* المواد التي تظهر لكل مرحلة (تُضبط من لوحة الإدارة مستقبلًا حسب المقرر الفعلي) */
  stageSubjects: {
    kg: ['ar', 'math', 'sci', 'art'],
    pri: ['ar', 'math', 'sci', 'en', 'soc', 'isl'],
    mid: ['ar', 'math', 'sci', 'en', 'soc', 'isl', 'comp']
  },

  lessons: [
  /* ======================= الروضة — حديقة الاكتشاف ======================= */
  { id: 'kg-art-1', grade: 'kg', subject: 'art', unit: 'الأشكال', title: 'الدائرة والمربع والمثلث',
    outcome: 'يتعرّف الطفل إلى الدائرة والمربع والمثلث', skill: ['kg.shapes', 'التعرّف إلى الأشكال الأساسية'],
    example: { e: '⚪', t: 'هذه دائرة. هي مستديرة مثل البرتقالة 🍊' },
    acts: [
      { type: 'choose', listen: true, q: 'اضغط على الدائرة', opts: [S('circle'), S('square'), S('triangle')], a: 0, hint: 'الدائرة مستديرة وليس لها زوايا', ex: 'الدائرة شكل مستدير' },
      { type: 'choose', listen: true, q: 'اضغط على المثلث', opts: [S('square'), S('triangle'), S('circle')], a: 1, hint: 'المثلث له ثلاثة أضلاع', ex: 'المثلث له ثلاثة أضلاع وثلاث زوايا' },
      { type: 'choose', listen: true, q: 'اضغط على المربع', opts: [S('triangle'), S('circle'), S('square')], a: 2, hint: 'المربع له أربعة أضلاع متساوية', ex: 'المربع له أربعة أضلاع متساوية' },
      { type: 'match', q: 'صِل كل شكل بشيء يشبهه', pairs: [[S('circle'), E('🍊', 'برتقالة')], [S('triangle'), E('⛺', 'خيمة')], [S('square'), E('🎁', 'هدية')]], hint: 'البرتقالة مستديرة مثل الدائرة' },
      { type: 'choose', apply: true, q: 'أيّ شيء مستدير مثل الدائرة؟', opts: [E('⚽', 'كرة'), E('⛺', 'خيمة'), E('🎁', 'هدية')], a: 0, hint: 'ابحث عن شيء ليس له زوايا', ex: 'الكرة مستديرة مثل الدائرة' }
    ] },
  { id: 'kg-art-2', grade: 'kg', subject: 'art', unit: 'الألوان', title: 'الأحمر والأزرق والأصفر والأخضر',
    outcome: 'يميّز الطفل الألوان الأساسية', skill: ['kg.colors', 'تمييز الألوان'],
    example: { e: '🍅', t: 'الطماطم لونها أحمر' },
    acts: [
      { type: 'choose', listen: true, q: 'اضغط على اللون الأحمر', opts: [C('#E53935'), C('#1E88E5'), C('#FDD835')], a: 0, hint: 'لون الطماطم 🍅', ex: 'هذا هو اللون الأحمر' },
      { type: 'choose', listen: true, q: 'اضغط على اللون الأخضر', opts: [C('#1E88E5'), C('#43A047'), C('#E53935')], a: 1, hint: 'لون أوراق الشجر 🌿', ex: 'هذا هو اللون الأخضر' },
      { type: 'choose', listen: true, q: 'اضغط على اللون الأصفر', opts: [C('#43A047'), C('#E53935'), C('#FDD835')], a: 2, hint: 'لون الموز 🍌', ex: 'هذا هو اللون الأصفر' },
      { type: 'match', q: 'صِل كل فاكهة بلونها', pairs: [[E('🍌', 'موز'), C('#FDD835', 'أصفر')], [E('🍅', 'طماطم'), C('#E53935', 'أحمر')], [E('🥒', 'خيار'), C('#43A047', 'أخضر')]] },
      { type: 'choose', apply: true, listen: true, q: 'ما لون السماء في يوم صحو؟', opts: [C('#E53935', 'أحمر'), C('#1E88E5', 'أزرق'), C('#43A047', 'أخضر')], a: 1, hint: 'انظر إلى السماء نهارًا ☀️', ex: 'السماء في اليوم الصحو زرقاء' }
    ] },
  { id: 'kg-math-1', grade: 'kg', subject: 'math', unit: 'الأعداد', title: 'العدّ حتى 5',
    outcome: 'يعدّ الطفل الأشياء حتى 5', skill: ['kg.count5', 'العدّ حتى 5'],
    example: { e: '🐪🐪', t: 'نعدّ: واحد، اثنان. هنا جملان' },
    acts: [
      { type: 'choose', listen: true, q: 'كم جملًا ترى؟', vis: { k: 'count', e: '🐪', n: 3 }, opts: ['2', '3', '4'], a: 1, hint: 'المس كل جمل وأنت تعدّ', ex: 'واحد، اثنان، ثلاثة: 3 جمال' },
      { type: 'choose', listen: true, q: 'كم سمكة ترى؟', vis: { k: 'count', e: '🐟', n: 5 }, opts: ['4', '5', '3'], a: 1, hint: 'عدّ ببطء', ex: 'هنا 5 سمكات' },
      { type: 'choose', listen: true, q: 'كم ثمرة مانجو ترى؟', vis: { k: 'count', e: '🥭', n: 2 }, opts: ['1', '2', '3'], a: 1, ex: 'هنا ثمرتا مانجو: 2' },
      { type: 'order', mode: 'nums', q: 'رتّب الأعداد من 1 إلى 5', items: ['1', '2', '3', '4', '5'], hint: 'ابدأ بالعدد 1' },
      { type: 'choose', apply: true, listen: true, q: 'أيّ مجموعة فيها 4 برتقالات؟', opts: [E(rep('🍊', 3)), E(rep('🍊', 4)), E(rep('🍊', 2))], a: 1, hint: 'عدّ كل مجموعة', ex: 'هذه المجموعة فيها 4 برتقالات' }
    ] },
  { id: 'kg-math-2', grade: 'kg', subject: 'math', unit: 'الأنماط', title: 'أكمل النمط',
    outcome: 'يكمل الطفل نمطًا بسيطًا من صور وأشكال', skill: ['kg.pattern', 'إكمال الأنماط والتسلسل'],
    example: { e: '🔴🔵🔴🔵', t: 'أحمر، أزرق، أحمر، أزرق... النمط يتكرر' },
    acts: [
      { type: 'choose', listen: true, q: 'ما الذي يأتي بعد ذلك؟', vis: { k: 'pattern', seq: ['🔴', '🔵', '🔴', '🔵', '🔴'] }, opts: [E('🔵'), E('🔴'), E('🟢')], a: 0, hint: 'بعد الأحمر يأتي...', ex: 'أحمر ثم أزرق، يتكرر' },
      { type: 'choose', listen: true, q: 'ما الذي يأتي بعد ذلك؟', vis: { k: 'pattern', seq: ['⭐', '⭐', '🌙', '⭐', '⭐'] }, opts: [E('🌙'), E('⭐'), E('☀️')], a: 0, hint: 'نجمتان ثم...', ex: 'نجمتان ثم قمر، يتكرر' },
      { type: 'choose', listen: true, q: 'ما الشكل التالي؟', vis: { k: 'pattern', seq: ['🔺', '🟦', '🔺', '🟦'] }, opts: [E('🟦'), E('🔺'), E('⚪')], a: 1, ex: 'مثلث ثم مربع، يتكرر' },
      { type: 'order', mode: 'steps', q: 'رتّب الصور: ماذا يحدث أولًا؟', items: ['🥚 بيضة', '🐣 تفقس البيضة', '🐥 كتكوت صغير', '🐓 دجاجة كبيرة'], hint: 'كل شيء يبدأ من البيضة' },
      { type: 'choose', apply: true, listen: true, q: 'أكمل النمط', vis: { k: 'pattern', seq: ['🍌', '🍎', '🍎', '🍌', '🍎', '🍎', '🍌'] }, opts: [E('🍎'), E('🍌'), E('🍇')], a: 0, hint: 'موزة ثم تفاحتان', ex: 'موزة ثم تفاحتان، يتكرر' }
    ] },
  { id: 'kg-ar-1', grade: 'kg', subject: 'ar', unit: 'الحروف', title: 'حروف أ ب ت',
    outcome: 'يتعرّف الطفل إلى أشكال الحروف أ، ب، ت وأصواتها', skill: ['kg.letters1', 'التعرّف إلى الحروف أ ب ت'],
    example: { e: '🦆', t: 'بـ بطة: كلمة بطة تبدأ بحرف الباء' },
    acts: [
      { type: 'choose', listen: true, q: 'أين حرف الباء؟', opts: ['أ', 'ب', 'ت'], a: 1, hint: 'الباء تحتها نقطة واحدة', ex: 'هذا حرف الباء: ب' },
      { type: 'choose', listen: true, q: 'أين حرف الألف؟', opts: ['ت', 'ب', 'أ'], a: 2, hint: 'الألف خط واقف', ex: 'هذا حرف الألف: أ' },
      { type: 'choose', listen: true, q: 'أيّ صورة تبدأ بحرف الباء؟', opts: [E('🦆', 'بطة'), E('🐇', 'أرنب'), E('🍎', 'تفاحة')], a: 0, hint: 'بـ... بطة', ex: 'بطة تبدأ بحرف الباء' },
      { type: 'match', q: 'صِل كل حرف بصورة تبدأ به', pairs: [['أ', E('🐇', 'أرنب')], ['ب', E('🦆', 'بطة')], ['ت', E('🍎', 'تفاحة')]], hint: 'أرنب تبدأ بالألف' },
      { type: 'choose', apply: true, listen: true, q: 'أيّ صورة تبدأ بحرف التاء؟', opts: [E('🏠', 'بيت'), E('🐊', 'تمساح'), E('🦁', 'أسد')], a: 1, hint: 'تـ... تمساح', ex: 'تمساح تبدأ بحرف التاء' }
    ] },
  { id: 'kg-sci-1', grade: 'kg', subject: 'sci', unit: 'الحيوانات من حولنا', title: 'أين تعيش الحيوانات؟',
    outcome: 'يربط الطفل بين حيوانات من البيئة السودانية وأماكن عيشها', skill: ['kg.animals', 'الحيوانات وبيئاتها'],
    example: { e: '🐪', t: 'الجمل يعيش في الصحراء' },
    acts: [
      { type: 'choose', listen: true, q: 'أين يعيش التمساح؟', opts: [E('🌊', 'النهر'), E('🏜️', 'الصحراء'), E('🌳', 'الشجرة')], a: 0, hint: 'التمساح يحب الماء', ex: 'التمساح يعيش في النهر' },
      { type: 'match', q: 'صِل كل حيوان بمكان عيشه', pairs: [[E('🐪', 'جمل'), E('🏜️', 'الصحراء')], [E('🐟', 'سمكة'), E('🌊', 'النهر')], [E('🐄', 'بقرة'), E('🏡', 'المزرعة')], [E('🐦', 'عصفور'), E('🌳', 'الشجرة')]] },
      { type: 'choose', listen: true, q: 'أيّ حيوان يعطينا الحليب؟', opts: [E('🐊', 'تمساح'), E('🐄', 'بقرة'), E('🐟', 'سمكة')], a: 1, ex: 'البقرة تعطينا الحليب 🥛' },
      { type: 'choose', listen: true, tf: true, q: 'الجمل يمشي في الصحراء مسافات طويلة', vis: { k: 'big', e: '🐪🏜️' }, a: 0, ex: 'صحيح! الجمل صبور ويتحمّل العطش' },
      { type: 'choose', apply: true, listen: true, q: 'أيّ حيوان يسبح في نهر النيل؟', opts: [E('🐪', 'جمل'), E('🐓', 'دجاجة'), E('🐟', 'سمكة')], a: 2, hint: 'من يعيش في الماء؟', ex: 'السمك يسبح في نهر النيل' }
    ] },

  /* ================== الصفان الأول والثاني — قرية الحروف والأعداد ================== */
  { id: 'g1-ar-1', grade: 'g1', subject: 'ar', unit: 'الحروف والأصوات', title: 'صوت الحرف وصورته',
    outcome: 'يربط المتعلّم صوت الحرف بشكله', skill: ['g1.ar.sounds', 'ربط الصوت بالحرف'],
    example: { e: '🥭', t: 'مَـ ... مانجو. أول صوت في «مانجو» هو حرف الميم' },
    acts: [
      { type: 'choose', listen: true, q: 'استمع: أيّ حرف تسمع؟', say: 'مَ', opts: ['م', 'ن', 'ل'], a: 0, hint: 'اضغط زر الصوت 🔊 لتسمع مرة أخرى', ex: 'سمعت صوت حرف الميم: مَ' },
      { type: 'choose', listen: true, q: 'استمع: أيّ حرف تسمع؟', say: 'نَ', opts: ['ل', 'ن', 'م'], a: 1, hint: 'النون فوقها نقطة', ex: 'سمعت صوت حرف النون: نَ' },
      { type: 'choose', q: 'أيّ كلمة تبدأ بحرف الميم؟', opts: [E('🥭', 'مانجو'), E('🐟', 'سمكة'), E('🏠', 'بيت')], a: 0, ex: 'مانجو تبدأ بحرف الميم' },
      { type: 'ws', q: 'ابحث عن كلمات فيها حرف الميم', size: 5, dirs: 'hv', show: 'both',
        words: [{ w: 'قمر', e: '🌙', m: 'يضيء السماء ليلًا' }, { w: 'نمر', e: '🐅', m: 'حيوان مفترس مخطّط' }, { w: 'موز', e: '🍌', m: 'فاكهة صفراء' }] },
      { type: 'choose', apply: true, q: 'أيّ صورة تبدأ بحرف النون؟', opts: [E('🌙', 'قمر'), E('🐝', 'نحلة'), E('🍌', 'موز')], a: 1, hint: 'نَـ...', ex: 'نحلة تبدأ بحرف النون' }
    ] },
  { id: 'g1-ar-2', grade: 'g1', subject: 'ar', unit: 'الكلمات', title: 'كوّن الكلمة',
    outcome: 'يكوّن المتعلّم كلمات من حروفها', skill: ['g1.ar.build', 'تكوين الكلمات من الحروف'],
    example: { e: '🏠', t: 'ب + ي + ت = بيت' },
    acts: [
      { type: 'order', mode: 'letters', q: 'رتّب الحروف لتكوّن اسم الصورة', say: 'بيت', vis: { k: 'big', e: '🏠' }, items: ['ب', 'ي', 'ت'], hint: 'أول حرف هو الباء' },
      { type: 'order', mode: 'letters', q: 'رتّب الحروف لتكوّن اسم الصورة', say: 'جمل', vis: { k: 'big', e: '🐪' }, items: ['ج', 'م', 'ل'], hint: 'أول حرف هو الجيم' },
      { type: 'order', mode: 'letters', q: 'رتّب الحروف لتكوّن اسم الصورة', say: 'نهر', vis: { k: 'big', e: '🌊' }, items: ['ن', 'ه', 'ر'], hint: 'أول حرف هو النون' },
      { type: 'choose', q: 'اختر الحرف الناقص', say: 'قمر', vis: { k: 'missing', e: '🌙', parts: ['ق', '؟', 'ر'] }, opts: ['م', 'ن', 'ب'], a: 0, hint: 'قَـ مَـ ر', ex: 'قمر = ق + م + ر' },
      { type: 'order', mode: 'letters', apply: true, q: 'رتّب الحروف لتكوّن اسم الصورة', say: 'مانجو', vis: { k: 'big', e: '🥭' }, items: ['م', 'ا', 'ن', 'ج', 'و'], hint: 'ما..نـ..جو' }
    ] },
  { id: 'g1-ar-3', grade: 'g1', subject: 'ar', unit: 'الكلمات', title: 'كلمات من بيئتنا',
    outcome: 'يتعرّف المتعلّم كلمات من بيئته ويفهم معانيها', skill: ['g1.ar.vocab', 'مفردات من البيئة السودانية'],
    example: { e: '🌊', t: 'نهر: ماء عذب يجري، مثل نهر النيل' },
    acts: [
      { type: 'ws', q: 'انظر إلى الصور وابحث عن أسمائها', size: 6, dirs: 'hv', show: 'pic',
        words: [{ w: 'نهر', e: '🌊', m: 'ماء عذب يجري في مجرى طويل، مثل نهر النيل' }, { w: 'جمل', e: '🐪', m: 'حيوان صبور يعيش في الصحراء' },
                { w: 'بيت', e: '🏠', m: 'المكان الذي نسكن فيه' }, { w: 'قمر', e: '🌙', m: 'يضيء السماء ليلًا' }, { w: 'تمر', e: '🌴', m: 'ثمر النخيل الحلو' }] },
      { type: 'choose', q: 'ما معنى كلمة «نهر»؟', vis: { k: 'big', e: '🌊' }, opts: ['ماء عذب يجري في مجرى طويل', 'أرض واسعة فيها رمال', 'بيت كبير'], a: 0, ex: 'النهر ماء عذب يجري، مثل نهر النيل' },
      { type: 'choose', q: 'ما اسم النهر الكبير الذي يجري في السودان؟', opts: ['النيل', 'القمر', 'الجمل'], a: 0, ex: 'نهر النيل يجري في السودان' },
      { type: 'choose', apply: true, q: 'اختر الجملة الصحيحة', opts: ['نشرب الماء من النهر', 'يطير الجمل في السماء', 'نسكن في القمر'], a: 0, hint: 'فكّر: أيّ جملة تحدث فعلًا؟', ex: 'نشرب الماء العذب من النهر' }
    ] },
  { id: 'g1-math-1', grade: 'g1', subject: 'math', unit: 'الجمع', title: 'الجمع حتى 10',
    outcome: 'يجمع المتعلّم عددين مجموعهما لا يتجاوز 10', skill: ['g1.math.add10', 'الجمع حتى 10'],
    example: { e: '🥭🥭 + 🥭', t: 'ثمرتان ومعهما ثمرة: 2 + 1 = 3' },
    acts: [
      { type: 'choose', q: 'كم ثمرة مانجو معًا؟', vis: { k: 'sum', e: '🥭', a: 2, b: 3 }, opts: ['4', '5', '6'], a: 1, hint: 'عدّ كل الثمار', ex: '2 + 3 = 5' },
      { type: 'choose', q: 'كم ماعزًا معًا؟', vis: { k: 'sum', e: '🐐', a: 4, b: 2 }, opts: ['5', '6', '7'], a: 1, ex: '4 + 2 = 6' },
      { type: 'choose', q: 'ما ناتج الجمع؟', vis: { k: 'eq', t: '3 + 4 = ?' }, opts: ['6', '7', '8'], a: 1, hint: 'ابدأ من 4 وعدّ 3 خطوات', ex: '3 + 4 = 7' },
      { type: 'match', q: 'صِل كل عملية بناتجها', pairs: [['2 + 2', '4'], ['5 + 1', '6'], ['3 + 0', '3'], ['4 + 4', '8']] },
      { type: 'choose', apply: true, q: 'اشترت أمي من السوق 5 برتقالات، ثم اشترت 3 أخرى. كم برتقالة اشترت؟', opts: ['7', '8', '9'], a: 1, hint: 'اجمع 5 و 3', ex: '5 + 3 = 8 برتقالات' }
    ] },
  { id: 'g1-math-2', grade: 'g1', subject: 'math', unit: 'الأعداد', title: 'المقارنة والترتيب',
    outcome: 'يقارن المتعلّم بين الأعداد ويرتّبها', skill: ['g1.math.compare', 'مقارنة الأعداد وترتيبها'],
    example: { e: '🐑🐑🐑 > 🐑', t: '3 أكبر من 1' },
    acts: [
      { type: 'choose', q: 'أيّ عدد أكبر؟', opts: ['7', '4'], a: 0, ex: '7 أكبر من 4' },
      { type: 'choose', q: 'أيّ مجموعة فيها عدد أقل؟', opts: [E(rep('🐑', 5)), E(rep('🐑', 2))], a: 1, ex: '2 أقل من 5' },
      { type: 'order', mode: 'nums', q: 'رتّب الأعداد من الأصغر إلى الأكبر', items: ['2', '5', '7', '9'], hint: 'ابدأ بأصغر عدد' },
      { type: 'choose', q: 'اختر الإشارة المناسبة', vis: { k: 'eq', t: '6 ◻ 3' }, opts: ['>', '<', '='], a: 0, hint: 'الفم المفتوح يأكل العدد الأكبر', ex: '6 > 3 أي 6 أكبر من 3' },
      { type: 'choose', apply: true, q: 'عند علي 8 أقلام، وعند منى 6 أقلام. من عنده أقلام أكثر؟', opts: ['علي', 'منى'], a: 0, ex: '8 أكبر من 6، إذن عند علي أقلام أكثر' }
    ] },
  { id: 'g1-sci-1', grade: 'g1', subject: 'sci', unit: 'جسمي', title: 'حواسي الخمس',
    outcome: 'يربط المتعلّم كل حاسة بعضوها', skill: ['g1.sci.senses', 'الحواس الخمس'],
    example: { e: '👁️', t: 'نرى بالعين' },
    acts: [
      { type: 'match', q: 'صِل كل عضو بالحاسة', pairs: [[E('👁️', 'العين'), 'أرى'], [E('👂', 'الأذن'), 'أسمع'], [E('👃', 'الأنف'), 'أشمّ'], [E('👅', 'اللسان'), 'أتذوّق'], [E('✋', 'اليد'), 'ألمس']] },
      { type: 'choose', q: 'بماذا نسمع صوت جرس المدرسة؟', opts: [E('👂', 'الأذن'), E('👁️', 'العين'), E('✋', 'اليد')], a: 0, ex: 'نسمع بالأذن' },
      { type: 'choose', tf: true, q: 'نتذوّق طعم العسل بالأنف', a: 1, ex: 'نتذوّق باللسان، ونشمّ بالأنف' },
      { type: 'choose', apply: true, q: 'عرفت أن الخبز ساخن قبل أن تأكله لأنك لمسته. أيّ حاسة استخدمت؟', opts: ['اللمس', 'السمع', 'البصر'], a: 0, ex: 'استخدمت حاسة اللمس باليد' }
    ] },
  { id: 'g1-en-1', grade: 'g1', subject: 'en', unit: 'Animals', title: 'Animal words', lang: 'en',
    outcome: 'Recognise and say the names of common animals', skill: ['g1.en.animals', 'Animal vocabulary'],
    example: { e: '🐱', t: 'cat' },
    acts: [
      { type: 'choose', listen: true, q: 'Listen and choose', say: 'cat', opts: [E('🐱', 'cat'), E('🐶', 'dog'), E('🐟', 'fish')], a: 0, hint: 'Press 🔊 to listen again', ex: 'cat 🐱' },
      { type: 'choose', listen: true, q: 'Listen and choose', say: 'dog', opts: [E('🐟', 'fish'), E('🐦', 'bird'), E('🐶', 'dog')], a: 2, ex: 'dog 🐶' },
      { type: 'match', q: 'Match the word to the picture', pairs: [['cat', E('🐱')], ['bird', E('🐦')], ['fish', E('🐟')], ['camel', E('🐪')]] },
      { type: 'ws', q: 'Find the animal words', size: 6, dirs: 'hv', show: 'both',
        words: [{ w: 'CAT', e: '🐱', m: 'cat — قطة' }, { w: 'DOG', e: '🐶', m: 'dog — كلب' }, { w: 'FISH', e: '🐟', m: 'fish — سمكة' }, { w: 'BIRD', e: '🐦', m: 'bird — عصفور' }] },
      { type: 'choose', apply: true, q: 'Which animal can fly?', opts: [E('🐱', 'cat'), E('🐦', 'bird'), E('🐟', 'fish')], a: 1, ex: 'A bird can fly.' }
    ] },
  { id: 'g2-ar-1', grade: 'g2', subject: 'ar', unit: 'المعاني', title: 'الأضداد',
    outcome: 'يتعرّف المتعلّم الكلمة وضدها', skill: ['g2.ar.opposites', 'الأضداد'],
    example: { e: '🐘 🐜', t: 'الفيل كبير ↔ النملة صغيرة' },
    acts: [
      { type: 'match', q: 'صِل كل كلمة بضدها', pairs: [['كبير', 'صغير'], ['طويل', 'قصير'], ['حارّ', 'بارد'], ['نهار', 'ليل']] },
      { type: 'choose', q: 'ما ضد كلمة «سريع»؟', opts: ['بطيء', 'قوي', 'جميل'], a: 0, ex: 'سريع ↔ بطيء' },
      { type: 'choose', q: 'ما ضد كلمة «نظيف»؟', opts: ['متّسخ', 'جديد', 'لامع'], a: 0, ex: 'نظيف ↔ متّسخ' },
      { type: 'choose', apply: true, q: 'أكمل: الفيل حيوان كبير، والنملة حشرة ...', vis: { k: 'big', e: '🐘 🐜' }, opts: ['صغيرة', 'طويلة', 'سريعة'], a: 0, ex: 'كبير ↔ صغير' }
    ] },
  { id: 'g2-math-1', grade: 'g2', subject: 'math', unit: 'القيمة المنزلية', title: 'الآحاد والعشرات',
    outcome: 'يحلّل المتعلّم العدد إلى عشرات وآحاد', skill: ['g2.math.place', 'الآحاد والعشرات'],
    example: { e: '🔟🔟🔟 + 4', t: '34 = 3 عشرات و 4 آحاد' },
    acts: [
      { type: 'choose', q: 'العدد 34 يتكوّن من:', opts: ['3 عشرات و 4 آحاد', '4 عشرات و 3 آحاد', '34 عشرة'], a: 0, ex: 'الرقم 3 في منزلة العشرات، والرقم 4 في منزلة الآحاد' },
      { type: 'choose', q: 'كم عشرة في العدد 70؟', opts: ['7', '70', '0'], a: 0, ex: '70 = 7 عشرات' },
      { type: 'order', mode: 'nums', q: 'رتّب الأعداد من الأصغر إلى الأكبر', items: ['19', '45', '54', '91'], hint: 'قارن رقم العشرات أولًا' },
      { type: 'choose', apply: true, q: 'عند بائع الخبز كيسان في كل منهما 10 أرغفة، و 5 أرغفة خارج الأكياس. كم رغيفًا عنده؟', opts: ['25', '52', '12'], a: 0, hint: 'عشرتان و 5 آحاد', ex: '10 + 10 + 5 = 25 رغيفًا' }
    ] },

  /* ================== الصفان الثالث والرابع — مدينة المعرفة ================== */
  { id: 'g3-ar-1', grade: 'g3', subject: 'ar', unit: 'الإملاء', title: 'اكتشف الخطأ الإملائي',
    outcome: 'يميّز المتعلّم الكتابة الإملائية الصحيحة لكلمات شائعة', skill: ['g3.ar.spelling', 'الإملاء: كلمات شائعة'],
    example: { e: '✍️', t: 'نكتب «هذا» دون ألف بعد الهاء رغم أننا ننطقها' },
    acts: [
      { type: 'choose', q: 'اختر الكلمة المكتوبة بشكل صحيح', opts: ['هذا', 'هاذا'], a: 0, ex: 'تُكتب «هذا» دون ألف بعد الهاء رغم أننا ننطقها' },
      { type: 'choose', q: 'اختر الكلمة المكتوبة بشكل صحيح', opts: ['لاكن', 'لكن'], a: 1, ex: 'تُكتب «لكن» دون ألف بعد اللام' },
      { type: 'choose', q: 'اختر الكتابة الصحيحة', vis: { k: 'big', e: '🌳' }, opts: ['شجرة', 'شجرت'], a: 0, hint: 'الاسم المفرد المؤنث', ex: 'التاء في آخر الاسم المفرد المؤنث تُكتب مربوطة: شجرة' },
      { type: 'choose', q: 'اختر الكتابة الصحيحة', vis: { k: 'big', e: '☀️' }, opts: ['اشّمس', 'الشّمس'], a: 1, ex: 'اللام الشمسية تُكتب ولا تُنطق: الشّمس' },
      { type: 'choose', apply: true, q: 'أيّ جملة خالية من الأخطاء الإملائية؟', opts: ['ذهبتُ إلى المدرسة صباحًا', 'هاذا الولد ذهب إلى المدرسة', 'ذهبتُ إلى المدرسة لاكن متأخرًا'], a: 0, ex: 'الجملة الأولى صحيحة. الصواب: «هذا» و«لكن»' }
    ] },
  { id: 'g4-math-1', grade: 'g4', subject: 'math', unit: 'الضرب', title: 'الضرب: مجموعات متساوية',
    outcome: 'يفهم المتعلّم الضرب بوصفه جمع مجموعات متساوية', skill: ['g4.math.mult', 'الضرب كمجموعات متساوية'],
    example: { e: '🥭🥭 🥭🥭', t: 'مجموعتان في كل منهما ثمرتان: 2 × 2 = 4' },
    acts: [
      { type: 'choose', q: 'كم ثمرة مانجو في كل المجموعات؟', vis: { k: 'groups', e: '🥭', g: 3, n: 4 }, opts: ['7', '12', '10'], a: 1, hint: '3 مجموعات في كل منها 4', ex: '4 + 4 + 4 = 12' },
      { type: 'choose', q: 'أيّ عملية تعبّر عن هذه المجموعات؟', vis: { k: 'groups', e: '🥭', g: 3, n: 4 }, opts: ['3 × 4', '3 + 4', '4 − 3'], a: 0, ex: '3 مجموعات × 4 في كل مجموعة = 3 × 4' },
      { type: 'match', q: 'صِل كل عملية ضرب بناتجها', pairs: [['2 × 5', '10'], ['4 × 3', '12'], ['3 × 3', '9'], ['5 × 4', '20']] },
      { type: 'choose', tf: true, q: '4 × 3 يساوي 3 × 4', a: 0, ex: 'صحيح: تبديل ترتيب العددين في الضرب لا يغيّر الناتج' },
      { type: 'choose', apply: true, q: 'في حديقة المدرسة 5 صفوف، في كل صف 6 أشجار ليمون. كم شجرة في الحديقة؟', opts: ['30', '11', '25'], a: 0, hint: '5 مجموعات في كل منها 6', ex: '5 × 6 = 30 شجرة' }
    ] },
  { id: 'g4-math-2', grade: 'g4', subject: 'math', unit: 'الكسور', title: 'الكسور: الجزء من الكل',
    outcome: 'يعبّر المتعلّم عن الجزء من الكل بكسر', skill: ['g4.math.frac', 'الكسور البسيطة'],
    example: { e: '🫓', t: 'قُسّمت الكِسرة إلى 4 أجزاء متساوية، فكل جزء = 1/4' },
    acts: [
      { type: 'choose', q: 'ما الكسر الذي يمثّل الجزء الملوّن؟', vis: { k: 'frac', n: 1, d: 4 }, opts: ['1/4', '1/2', '3/4'], a: 0, ex: 'جزء واحد ملوّن من 4 أجزاء متساوية = 1/4' },
      { type: 'choose', q: 'ما الكسر الذي يمثّل الجزء الملوّن؟', vis: { k: 'frac', n: 3, d: 4 }, opts: ['1/4', '3/4', '4/3'], a: 1, hint: 'كم جزءًا ملوّنًا؟ ومن كم؟', ex: '3 أجزاء ملوّنة من 4 = 3/4' },
      { type: 'choose', q: 'ما الكسر الذي يمثّل الجزء الملوّن؟', vis: { k: 'frac', n: 1, d: 2 }, opts: ['1/3', '2/1', '1/2'], a: 2, ex: 'جزء من جزأين متساويين = 1/2' },
      { type: 'choose', q: 'أيّ الكسرين أكبر؟', opts: ['1/2', '1/4'], a: 0, hint: 'تخيّل كِسرة مقسومة إلى جزأين وأخرى إلى 4 أجزاء', ex: 'إذا كان البسط 1 فكلما صغر المقام كبر الجزء: 1/2 أكبر من 1/4' },
      { type: 'choose', apply: true, q: 'قُسّمت كِسرة إلى 4 أجزاء متساوية، وأكل أحمد جزءًا واحدًا. ما الكسر الذي أكله؟', opts: ['1/4', '4/1', '1/3'], a: 0, ex: 'جزء واحد من 4 = 1/4' }
    ] },
  { id: 'g4-ar-1', grade: 'g4', subject: 'ar', unit: 'القراءة والفهم', title: 'اقرأ ثم أجب: نهر النيل',
    outcome: 'يفهم المتعلّم نصًا قصيرًا ويستخرج منه المعلومات', skill: ['g4.ar.reading', 'فهم المقروء'],
    acts: [
      { type: 'choose', q: 'أين يلتقي النيل الأزرق والنيل الأبيض؟', vis: { k: 'text', id: 'nile' }, opts: ['الخرطوم', 'بورتسودان', 'كسلا'], a: 0, hint: 'اقرأ السطر الأول من النص', ex: 'يلتقي النيلان في مدينة الخرطوم' },
      { type: 'choose', q: 'إلى أيّ اتجاه يجري النيل بعد الخرطوم؟', vis: { k: 'text', id: 'nile' }, opts: ['الشمال', 'الجنوب', 'الغرب'], a: 0, ex: 'يجري النيل شمالًا نحو مصر' },
      { type: 'choose', q: 'ما معنى «ريّ الحقول»؟', vis: { k: 'text', id: 'nile' }, opts: ['سقي الأرض الزراعية بالماء', 'حصاد المحصول', 'بيع الخضروات'], a: 0, ex: 'الريّ هو سقي الأرض الزراعية' },
      { type: 'order', mode: 'steps', q: 'رتّب الأحداث كما وردت في النص', items: ['يلتقي النيلان في الخرطوم', 'يجري النيل شمالًا', 'يصل النيل إلى مصر'] },
      { type: 'choose', apply: true, q: 'لماذا يحتاج المزارعون إلى نهر النيل؟', vis: { k: 'text', id: 'nile' }, opts: ['لريّ حقولهم وزراعة المحاصيل', 'للسباحة فقط', 'لأنه يضيء ليلًا'], a: 0, ex: 'يعتمد المزارعون على مياه النيل في الريّ والزراعة' }
    ] },
  { id: 'g4-sci-1', grade: 'g4', subject: 'sci', unit: 'تصنيف الكائنات', title: 'ماذا تأكل الحيوانات؟',
    outcome: 'يصنّف المتعلّم الحيوانات حسب غذائها', skill: ['g4.sci.diet', 'تصنيف الحيوانات حسب الغذاء'],
    example: { e: '🐐🌿', t: 'الماعز يأكل الأعشاب، فهو من آكلات الأعشاب' },
    acts: [
      { type: 'match', q: 'صِل كل حيوان بغذائه', pairs: [[E('🦁', 'أسد'), E('🥩', 'لحم')], [E('🐐', 'ماعز'), E('🌿', 'أعشاب')], [E('🐦', 'عصفور'), E('🌾', 'حبوب')]] },
      { type: 'choose', q: 'الأسد من آكلات ...', opts: ['اللحوم', 'الأعشاب'], a: 0, ex: 'الأسد يصطاد الحيوانات ويأكل لحمها' },
      { type: 'choose', q: 'أيّ هذه الحيوانات من آكلات الأعشاب؟', opts: [E('🐪', 'جمل'), E('🦁', 'أسد'), E('🐊', 'تمساح')], a: 0, ex: 'الجمل يأكل النباتات والأعشاب' },
      { type: 'choose', tf: true, q: 'الماعز من آكلات اللحوم', a: 1, ex: 'خطأ: الماعز من آكلات الأعشاب' },
      { type: 'choose', apply: true, q: 'حيوان له أنياب قوية حادّة لتمزيق الطعام. إلى أيّ مجموعة ينتمي على الأرجح؟', opts: ['آكلات اللحوم', 'آكلات الأعشاب', 'لا يمكن معرفة ذلك'], a: 0, hint: 'ما فائدة الأنياب الحادّة؟', ex: 'الأنياب الحادّة تساعد آكلات اللحوم على تمزيق اللحم' }
    ] },
  { id: 'g4-en-1', grade: 'g4', subject: 'en', unit: 'Sentences', title: 'Build the sentence', lang: 'en',
    outcome: 'Order words to make correct simple sentences', skill: ['g4.en.sentences', 'Simple sentence order'],
    example: { e: '🏫', t: 'I + go + to + school = I go to school.' },
    acts: [
      { type: 'order', mode: 'words', q: 'Put the words in order', items: ['I', 'go', 'to', 'school'], hint: 'Start with "I"' },
      { type: 'order', mode: 'words', q: 'Put the words in order', items: ['The', 'Nile', 'is', 'long'], hint: 'Start with "The"' },
      { type: 'choose', q: 'Choose the missing word: They ___ football every day.', opts: ['play', 'plays', 'playing'], a: 0, ex: 'They play (no -s with they).' },
      { type: 'choose', q: 'Choose the missing word: I ___ a student.', opts: ['am', 'is', 'are'], a: 0, ex: 'I am…' },
      { type: 'order', mode: 'words', apply: true, q: 'Put the words in order', items: ['We', 'eat', 'mangoes', 'in', 'summer'], hint: 'Who? does what? what? when?' }
    ] },
  { id: 'g4-soc-1', grade: 'g4', subject: 'soc', unit: 'وطني السودان', title: 'مدن وأنهار',
    outcome: 'يتعرّف المتعلّم مدنًا ومعالم جغرافية في السودان', skill: ['g4.soc.cities', 'مدن ومعالم السودان'],
    acts: [
      { type: 'choose', q: 'ما عاصمة السودان؟', opts: ['الخرطوم', 'بورتسودان', 'كسلا'], a: 0, ex: 'الخرطوم هي العاصمة' },
      { type: 'choose', q: 'على أيّ بحر تقع مدينة بورتسودان؟', opts: ['البحر الأحمر', 'البحر المتوسط'], a: 0, ex: 'بورتسودان ميناء على البحر الأحمر' },
      { type: 'match', q: 'صِل كل مدينة بما تشتهر به', pairs: [['الخرطوم', 'ملتقى النيلين'], ['بورتسودان', 'ميناء على البحر الأحمر'], ['كسلا', 'جبال التاكا']] },
      { type: 'choose', tf: true, q: 'يجري نهر النيل من الشمال إلى الجنوب', a: 1, ex: 'خطأ: يجري النيل من الجنوب إلى الشمال حتى يصبّ في البحر المتوسط' },
      { type: 'choose', apply: true, q: 'تريد شحن بضاعة بسفينة كبيرة عبر البحر. أيّ مدينة سودانية تختار؟', opts: ['بورتسودان', 'الخرطوم', 'كسلا'], a: 0, hint: 'أيّ مدينة تقع على البحر؟', ex: 'بورتسودان هي الميناء الرئيسي على البحر الأحمر' }
    ] },

  /* ================== الصفان الخامس والسادس — مملكة العلوم والمهارات ================== */
  { id: 'g6-sci-1', grade: 'g6', subject: 'sci', unit: 'الماء في الطبيعة', title: 'دورة الماء: السبب والنتيجة',
    outcome: 'يفسّر المتعلّم مراحل دورة الماء والعلاقة بين السبب والنتيجة', skill: ['g6.sci.watercycle', 'دورة الماء والتفسير العلمي'],
    example: { e: '☀️💧☁️🌧️', t: 'حرارة الشمس ← تبخّر ← تكاثف ← هطول' },
    acts: [
      { type: 'choose', q: 'ماذا يحدث لماء النهر عندما تسخّنه الشمس؟', opts: ['يتبخّر ويصعد إلى الجو', 'يتجمّد', 'يختفي إلى الأبد'], a: 0, ex: 'الحرارة تحوّل الماء السائل إلى بخار' },
      { type: 'order', mode: 'steps', q: 'رتّب مراحل دورة الماء', items: ['يتبخّر الماء من الأنهار والبحار بحرارة الشمس', 'يبرد البخار في الأعلى ويتكاثف فتتكوّن السحب', 'تهطل الأمطار', 'يجري الماء في الأنهار ويعود إلى البحار'], hint: 'البداية دائمًا من حرارة الشمس' },
      { type: 'match', q: 'صِل كل مصطلح بتعريفه', pairs: [['التبخّر', 'تحوّل الماء من سائل إلى بخار'], ['التكاثف', 'تحوّل البخار إلى قطرات ماء'], ['الهطول', 'نزول الماء من السحب مطرًا']] },
      { type: 'choose', q: 'لماذا تجفّ الملابس المغسولة أسرع في اليوم الحار؟', opts: ['لأن الحرارة تزيد سرعة التبخّر', 'لأن الهواء الحار يحمل الماء إلى الملابس', 'لأن الملابس تتكاثف'], a: 0, ex: 'كلما زادت الحرارة زادت سرعة تبخّر الماء' },
      { type: 'choose', apply: true, q: 'وضعت سعاد كوبًا باردًا جدًا على الطاولة، فظهرت قطرات ماء على سطحه الخارجي. ما التفسير؟', opts: ['تكاثف بخار الماء الموجود في الهواء على السطح البارد', 'تسرّب الماء من داخل الكوب', 'تبخّر الماء من الكوب'], a: 0, hint: 'ماذا يحدث للبخار عندما يبرد؟', ex: 'بخار الماء في الهواء يبرد عند ملامسة الكوب فيتكاثف قطرات' }
    ] },
  { id: 'g6-math-1', grade: 'g6', subject: 'math', unit: 'البيانات', title: 'اقرأ الجدول واستنتج',
    outcome: 'يقرأ المتعلّم بيانات من جدول ويستنتج منها', skill: ['g6.math.tables', 'قراءة الجداول وتفسيرها'],
    acts: [
      { type: 'choose', q: 'في أيّ شهر زُرع أكبر عدد من الأشجار؟', vis: { k: 'table', id: 'trees' }, opts: ['يناير', 'فبراير', 'أبريل'], a: 1, ex: 'فبراير: 18 شجرة' },
      { type: 'choose', q: 'كم شجرة زُرعت في مارس وأبريل معًا؟', vis: { k: 'table', id: 'trees' }, opts: ['24', '21', '27'], a: 0, ex: '9 + 15 = 24' },
      { type: 'choose', q: 'بكم يزيد عدد أشجار فبراير على يناير؟', vis: { k: 'table', id: 'trees' }, opts: ['6', '30', '5'], a: 0, hint: 'اطرح الأصغر من الأكبر', ex: '18 − 12 = 6' },
      { type: 'choose', apply: true, q: 'ما مجموع الأشجار المزروعة في الأشهر الأربعة؟', vis: { k: 'table', id: 'trees' }, opts: ['54', '45', '64'], a: 0, ex: '12 + 18 + 9 + 15 = 54' }
    ] },

  /* ================== المرحلة المتوسطة — مختبر العقول ================== */
  { id: 'm1-en-1', grade: 'm1', subject: 'en', unit: 'At the market', title: 'Market vocabulary', lang: 'en',
    outcome: 'Understand and use market vocabulary in context', skill: ['m1.en.market', 'Vocabulary: shopping'],
    acts: [
      { type: 'choose', listen: true, q: 'Listen. Where does the speaker buy vegetables?', say: 'I buy fresh vegetables at the market every Friday.', opts: ['at the market', 'at school', 'at the hospital'], a: 0, ex: '"I buy fresh vegetables at the market."' },
      { type: 'choose', q: 'Choose the word that fits: The mangoes are ___. They are ready to eat.', opts: ['ripe', 'broken', 'angry'], a: 0, ex: 'Ripe fruit is ready to eat.' },
      { type: 'match', q: 'Match each word to its meaning', pairs: [['cheap', 'costs little money'], ['expensive', 'costs a lot of money'], ['seller', 'a person who sells things'], ['customer', 'a person who buys things']] },
      { type: 'order', mode: 'words', q: 'Put the words in order to make a question', items: ['How', 'much', 'are', 'these', 'bananas', '?'], hint: 'Start with "How much"' },
      { type: 'choose', apply: true, q: "What does Amna's father always choose?", vis: { k: 'text', id: 'amna' }, opts: ['the freshest vegetables', 'the cheapest bread', 'big onions only'], a: 0, ex: '"Her father always chooses the freshest vegetables."' }
    ] },
  { id: 'm1-math-1', grade: 'm1', subject: 'math', unit: 'الجبر', title: 'المعادلات من الدرجة الأولى',
    outcome: 'يحلّ المتعلّم معادلات بسيطة ويكتشف الأخطاء في خطوات الحل', skill: ['m1.math.equations', 'حل المعادلات البسيطة'],
    example: { e: '⚖️', t: 'x + 2 = 5  ←  x = 5 − 2 = 3' },
    acts: [
      { type: 'choose', q: 'حلّ المعادلة', vis: { k: 'eq', t: 'x + 5 = 12' }, opts: ['7', '17', '5'], a: 0, ex: 'x = 12 − 5 = 7' },
      { type: 'choose', q: 'حلّ المعادلة', vis: { k: 'eq', t: '3x = 18' }, opts: ['6', '15', '54'], a: 0, ex: 'x = 18 ÷ 3 = 6' },
      { type: 'choose', q: 'اكتشف الخطأ: في أيّ خطوة يوجد الخطأ؟', vis: { k: 'sol', lines: ['2x + 4 = 10', '2x = 10 + 4', '2x = 14', 'x = 7'] }, opts: ['الخطوة 2', 'الخطوة 3', 'الخطوة 4'], a: 0, hint: 'ماذا نفعل بالعدد 4 عند نقله للطرف الآخر؟', ex: 'نطرح 4 من الطرفين: 2x = 10 − 4 = 6، إذن x = 3' },
      { type: 'order', mode: 'steps', dir: 'ltr', q: 'رتّب خطوات حل المعادلة', items: ['x − 3 = 9', 'x = 9 + 3', 'x = 12'] },
      { type: 'choose', apply: true, q: 'اشترى عمر 3 كراسات بالسعر نفسه ودفع 450 جنيهًا. إذا كان سعر الكراسة x، فما قيمة x؟', opts: ['150', '135', '1350'], a: 0, hint: 'اكتب المعادلة: 3x = 450', ex: '3x = 450 ⇐ x = 150 جنيهًا' }
    ] },
  { id: 'm1-sci-1', grade: 'm1', subject: 'sci', unit: 'المادة', title: 'حالات المادة',
    outcome: 'يصف المتعلّم خصائص حالات المادة ويفسّر ظواهر مرتبطة بها', skill: ['m1.sci.matter', 'حالات المادة وخصائصها'],
    acts: [
      { type: 'match', q: 'صِل كل مادة بحالتها', pairs: [[E('🧊', 'الجليد'), 'صلبة'], [E('💧', 'الماء'), 'سائلة'], [E('♨️', 'بخار الماء'), 'غازية']] },
      { type: 'choose', q: 'أيّ حالة تأخذ شكل الإناء الذي توضع فيه ولها حجم ثابت؟', opts: ['السائلة', 'الصلبة', 'الغازية'], a: 0, ex: 'السائل له حجم ثابت وشكل متغيّر' },
      { type: 'order', mode: 'steps', q: 'رتّب خطوات تجربة تحويل الجليد إلى بخار', items: ['ضع مكعبات الجليد في إناء', 'سخّن الإناء بإشراف المعلّم', 'لاحظ انصهار الجليد وتحوّله إلى ماء', 'استمر في التسخين ولاحظ تصاعد البخار'] },
      { type: 'choose', tf: true, q: 'تتحرك جزيئات الغاز أبطأ من جزيئات المادة الصلبة', a: 1, ex: 'خطأ: جزيئات الغاز أسرع حركة وأكثر تباعدًا' },
      { type: 'choose', apply: true, q: 'لماذا يُترك فراغ صغير عند ملء زجاجة ماء قبل وضعها في الفريزر؟', opts: ['لأن الماء يتمدّد عندما يتجمّد', 'لأن الماء يتبخّر في الفريزر', 'لأن الجليد أثقل من الماء'], a: 0, ex: 'الماء يزداد حجمه عند التجمّد، فقد تنكسر الزجاجة الممتلئة' }
    ] },
  { id: 'm3-soc-1', grade: 'm3', subject: 'soc', unit: 'مهارات الخرائط', title: 'اقرأ الخريطة واستنتج',
    outcome: 'يقرأ المتعلّم مفتاح الخريطة والاتجاهات ويستنتج منها', skill: ['m3.soc.maps', 'قراءة الخرائط والاتجاهات'],
    acts: [
      { type: 'choose', q: 'حسب مفتاح الخريطة، ماذا يمثّل الرمز ⛰️؟', vis: { k: 'map' }, opts: ['جبل', 'مدينة', 'مزرعة'], a: 0, ex: 'انظر إلى مفتاح الخريطة أسفلها' },
      { type: 'choose', q: 'في أيّ اتجاه يقع الجبل بالنسبة إلى النهر؟', vis: { k: 'map' }, opts: ['الغرب', 'الشرق', 'الشمال'], a: 0, hint: 'سهم الشمال يشير إلى أعلى الخريطة؛ فأين الغرب؟', ex: 'الجبل على يسار النهر، أي غربه' },
      { type: 'choose', q: 'يشير السهم على النهر إلى اتجاه جريانه. أين يقع منبع النهر في هذه الخريطة؟', vis: { k: 'map' }, opts: ['في الجنوب', 'في الشمال', 'في الشرق'], a: 0, ex: 'النهر يجري نحو الشمال، فمنبعه في الجنوب' },
      { type: 'choose', q: 'سافر تاجر من المدينة ⭐ إلى المزرعة 🌾. في أيّ اتجاه سافر؟', vis: { k: 'map' }, opts: ['الجنوب', 'الشمال', 'الغرب'], a: 0, ex: 'المزرعة تحت المدينة على الخريطة، أي جنوبها' },
      { type: 'choose', apply: true, q: 'لماذا اختار المزارعون مكان المزرعة 🌾 قرب النهر؟ اختر الاستنتاج المدعوم بالخريطة', vis: { k: 'map' }, opts: ['لسهولة ريّ الأرض من النهر', 'لأن الجبل يحميها من المطر', 'لأنها بعيدة عن المدينة'], a: 0, ex: 'القرب من مصدر الماء يسهّل الريّ' }
    ] }
  ],

  /* نصوص القراءة والجداول المشتركة بين الأسئلة */
  texts: {
    nile: 'يلتقي النيلُ الأزرقُ والنيلُ الأبيضُ في مدينة الخرطوم، ثم يجري نهرُ النيل شمالًا حتى يصل إلى مصر. ويعتمد كثيرٌ من المزارعين على مياه النيل في ريّ حقولهم وزراعة الذرة والخضروات.',
    amna: 'Amna goes to the market in Omdurman every Friday with her father. They buy tomatoes, onions and bread. Her father always chooses the freshest vegetables.'
  },
  tables: {
    trees: { cap: 'أشجار المانجو التي زرعتها مدرسة (بيانات توضيحية)', head: ['الشهر', 'عدد الأشجار'], rows: [['يناير', 12], ['فبراير', 18], ['مارس', 9], ['أبريل', 15]] }
  }
};

/* دمج بحث المنهج (js/curriculum-data.js المولَّد من research/): حيث توجد دروس من البحث لصف ومادة
   تحلّ محل الدروس النموذجية لذلك الصف والمادة، وتُرتَّب حسب فهرس الكتاب. */
if (window.NIBRAS_CUR && Array.isArray(NIBRAS_CUR.lessons) && NIBRAS_CUR.lessons.length) {
  const covered = new Set(NIBRAS_CUR.lessons.filter(l => !l.soon).map(l => l.grade + '/' + l.subject));
  N.C.lessons = N.C.lessons.filter(l => !covered.has(l.grade + '/' + l.subject)).concat(NIBRAS_CUR.lessons);
  N.C.sources = NIBRAS_CUR.sources || {};
  N.C.version = NIBRAS_CUR.version || N.C.version;
}
N.C.sources = N.C.sources || {};

/* فهارس مساعدة */
N.C.lessonById = {};
N.C.lessons.forEach((l, i) => { l.idx = i; l.lang = l.lang || 'ar'; l.status = l.status || 'prototype_only'; l.diff = l.diff || 1; l.source = l.source || null; N.C.lessonById[l.id] = l; });
N.C.gradeById = {}; N.C.grades.forEach(g => N.C.gradeById[g.id] = g);
N.C.worldById = {}; N.C.worlds.forEach(w => N.C.worldById[w.id] = w);
})();
