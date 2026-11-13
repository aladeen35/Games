/* نبراس — نصوص الواجهة بالعربية والإنجليزية. محتوى الدروس نفسه بلغة الدرس. */
'use strict';
window.N = window.N || {};

N.STR = {
  ar: {
    appName: 'نِبراس', tagline: 'نتعلّم باللعب.. ونكتشف المستقبل',
    welcome: 'أهلًا بك في نبراس', welcomeSub: 'رحلة تعلّم ممتعة من الروضة إلى المتوسطة',
    chooseLang: 'اختر لغة الواجهة', childName: 'ما اسم المتعلّم؟', namePh: 'الاسم الأول فقط',
    nameNote: 'لا نطلب أي بيانات أخرى. كل شيء يُحفظ على هذا الجهاز فقط.',
    chooseAvatar: 'اختر شخصيتك', chooseStage: 'اختر المرحلة', chooseGrade: 'اختر الصف',
    curVer: 'إصدار المحتوى', start: 'لنبدأ!', next: 'التالي', back: 'رجوع', cancel: 'إلغاء', save: 'حفظ', close: 'إغلاق',
    hello: 'مرحبًا يا {n}', helloAnon: 'مرحبًا بك في نِبراس',
    w2t: 'نتعلّم باللعب', w2a: 'ألعاب كلمات ومطابقة وترتيب واختيار مرتبطة بالدروس', w2b: 'نجوم للفهم والاستقلالية والتطبيق', w2c: 'بلا مؤقت إجباري ولا عقاب على الخطأ: تلميح ثم شرح ثم محاولة جديدة',
    w3t: 'خمسة عوالم تعليمية', w3a: 'يعمل دون إنترنت، ودون حسابات أو بيانات شخصية', skip: 'تخطٍّ', startLearning: 'ابدأ التعلّم', continueLearning: 'تابع التعلّم', continueSub: 'الدرس المقترح لك الآن',
    allDone: 'أنهيت كل دروس صفّك! راجع أو جرّب عالمًا آخر', go: 'ابدأ',
    dailyChallenge: 'تحدّي اليوم', dailySub: '3 أسئلة سريعة', dailyDone: 'أنجزته اليوم ✓',
    smartReview: 'مراجعة ذكية', reviewSub: '{n} مهارات حان وقت مراجعتها', reviewNone: 'لا مراجعات مستحقة الآن',
    subjects: 'المواد الدراسية', worlds: 'العوالم التعليمية', achievements: 'إنجازاتي', shop: 'المتجر',
    parent: 'ولي الأمر', settings: 'الإعدادات', lessonsCount: '{d} من {n} دروس',
    comingSoon: 'المحتوى قيد الإعداد', noContent: 'لا توجد دروس لهذه المادة في هذا الصف بعد.\nجرّب مادة أخرى أو صفًا آخر.',
    unit: 'الوحدة', lesson: 'الدرس', lessonsN: 'دروس', goal: 'هدف الدرس', example: 'مثال توضيحي', startLesson: 'ابدأ الدرس',
    replayLesson: 'أعد الدرس للمراجعة', locked: 'أكمل الدرس السابق أولًا (يمكن لولي الأمر فتح كل الدروس)',
    hint: 'تلميح', listen: 'استمع', retry: 'إعادة', check: 'تحقّق', nextQ: 'التالي', finish: 'إنهاء',
    good: ['أحسنت!', 'رائع!', 'ممتاز!', 'إجابة صحيحة!', 'عمل جميل!'],
    tryAgain: 'حاول مرة أخرى، أنت قريب!', together: 'لنتعلّمها معًا 👇', correctIs: 'الإجابة الصحيحة موضّحة',
    explain: 'الشرح', tf: ['صح', 'خطأ'], tapStart: 'اسحب على الحروف أو المس أول حرف ثم آخر حرف',
    findAll: 'ابحث عن كل الكلمات', matchHint: 'المس عنصرًا ثم المس ما يناسبه',
    orderHint: 'المس البطاقات بالترتيب الصحيح، والمس بطاقة في الأعلى لإرجاعها',
    result: 'نتيجة الدرس', starU: 'نجمة الفهم', starUd: 'إجابات صحيحة عن الأسئلة الأساسية',
    starI: 'نجمة الاستقلالية', starId: 'إكمال النشاط دون اعتماد كبير على التلميحات',
    starA: 'نجمة التطبيق', starAd: 'النجاح في السؤال التطبيقي',
    learned: 'ما تعلّمته اليوم', toReview: 'سنراجع هذا لاحقًا', xpGain: '+{n} نقطة خبرة',
    nextLesson: 'الدرس التالي', replay: 'أعد المحاولة', toMap: 'خريطة الدروس', home: 'الرئيسية',
    kgPraise: 'لعبت وتعلّمت! 🌟', points: 'نقطة',
    m_none: 'لم تبدأ', m_learn: 'قيد التعلّم', m_support: 'تحتاج إلى دعم', m_near: 'قريبة من الإتقان', m_mastered: 'متقنة', m_review: 'تحتاج مراجعة',
    timer: 'تحدّي الوقت', timerSub: 'اختياري، لا يؤثر في النجوم', best: 'أفضل وقت',
    a11y: 'سهولة الاستخدام', fontSize: 'حجم الخط', contrast: 'تباين مرتفع', motion: 'تقليل الحركة',
    readAloud: 'قراءة الأسئلة صوتيًا', sfx: 'المؤثرات الصوتية', lang: 'اللغة', on: 'تشغيل', off: 'إيقاف',
    fN: 'عادي', fL: 'كبير', fXL: 'أكبر',
    parentGate: 'منطقة ولي الأمر', gateQ: 'كم يساوي {a} × {b}؟', wrongGate: 'إجابة غير صحيحة',
    children: 'الأبناء', addChild: 'إضافة طفل', switchChild: 'تبديل المتعلّم', grade: 'الصف', changeGrade: 'تغيير الصف',
    report: 'تقرير المهارات', needSupport: 'مهارات تحتاج دعمًا', noSkills: 'لم يبدأ أي مهارة بعد',
    lessonsDone: 'دروس مكتملة', starsTotal: 'نجوم', minutesToday: 'دقائق اليوم',
    timeLimit: 'حدّ الاستخدام اليومي', unlimited: 'بلا حد', min: 'د',
    unlockAll: 'فتح كل الدروس', allowTimer: 'السماح بتحدّي الوقت', allowTimerSub: 'لا يظهر في الروضة والصفين الأول والثاني',
    delChild: 'حذف هذا الطفل وبياناته', delAll: 'حذف كل البيانات من الجهاز', confirmDel: 'هل أنت متأكد؟ لا يمكن التراجع.',
    privacy: 'الخصوصية: لا إعلانات، لا محادثات، لا مشاركة صور، ولا إرسال لأي بيانات خارج الجهاز.',
    restTitle: 'وقت الراحة 🌙', restSub: 'انتهى وقت اللعب المحدد لليوم. أحسنت! نلتقي غدًا.', restParent: 'ولي الأمر: تمديد الوقت',
    badges: 'الشارات', shopSub: 'استخدم نقاطك لشراء شخصيات جديدة', buy: 'شراء', use: 'استخدام', inUse: 'مستخدمة', notEnough: 'نقاطك لا تكفي بعد',
    worldOpen: 'افتح العالم', review: 'مراجعة', daily: 'تحدّي اليوم', mixed: 'تحدّي المراجعة المختلط',
    protoNote: 'محتوى نموذجي توضيحي لأغراض الاختبار، يجب مطابقته مع الكتب والإصدارات الرسمية السارية قبل اعتماده. التطبيق غير معتمد رسميًا من وزارة التربية والتعليم.',
    stars: 'نجوم', of: 'من', newBadge: 'شارة جديدة: {n}', mastered: 'أتقنت مهارة: {n} 🎉',
    yes: 'نعم', no: 'لا', profileOf: 'ملف {n}', curriculum: 'المنهج'
  },
  en: {
    appName: 'NIBRAS', tagline: 'Learn Through Play. Discover the Future.',
    welcome: 'Welcome to Nibras', welcomeSub: 'A fun learning journey from KG to middle school',
    chooseLang: 'Choose interface language', childName: "What is the learner's name?", namePh: 'First name only',
    nameNote: 'We ask for nothing else. Everything stays on this device.',
    chooseAvatar: 'Pick your character', chooseStage: 'Choose stage', chooseGrade: 'Choose grade',
    curVer: 'Content version', start: "Let's go!", next: 'Next', back: 'Back', cancel: 'Cancel', save: 'Save', close: 'Close',
    hello: 'Hi {n}', helloAnon: 'Welcome to Nibras',
    w2t: 'We learn through play', w2a: 'Word, matching, ordering and choice games linked to lessons', w2b: 'Stars for understanding, independence and application', w2c: 'No forced timer and no penalty for mistakes: a hint, an explanation, then another try',
    w3t: 'Five learning worlds', w3a: 'Works offline, with no accounts or personal data', skip: 'Skip', startLearning: 'Start learning', continueLearning: 'Continue learning', continueSub: 'Your suggested lesson',
    allDone: 'You finished all lessons in your grade! Review or explore another world', go: 'Start',
    dailyChallenge: "Today's challenge", dailySub: '3 quick questions', dailyDone: 'Done today ✓',
    smartReview: 'Smart review', reviewSub: '{n} skills are due for review', reviewNone: 'Nothing due right now',
    subjects: 'Subjects', worlds: 'Learning worlds', achievements: 'My achievements', shop: 'Shop',
    parent: 'Parent', settings: 'Settings', lessonsCount: '{d} of {n} lessons',
    comingSoon: 'Content in preparation', noContent: 'No lessons for this subject in this grade yet.\nTry another subject or grade.',
    unit: 'Unit', lesson: 'Lesson', lessonsN: 'lessons', goal: 'Lesson goal', example: 'Example', startLesson: 'Start lesson',
    replayLesson: 'Replay to review', locked: 'Finish the previous lesson first (a parent can unlock all)',
    hint: 'Hint', listen: 'Listen', retry: 'Retry', check: 'Check', nextQ: 'Next', finish: 'Finish',
    good: ['Well done!', 'Great!', 'Excellent!', 'Correct!', 'Nice work!'],
    tryAgain: "Try again, you're close!", together: "Let's learn it together 👇", correctIs: 'The correct answer is shown',
    explain: 'Explanation', tf: ['True', 'False'], tapStart: 'Drag across letters, or tap the first then the last letter',
    findAll: 'Find all the words', matchHint: 'Tap an item, then tap its match',
    orderHint: 'Tap the cards in the right order; tap a placed card to return it',
    result: 'Lesson result', starU: 'Understanding', starUd: 'Correct answers to the core questions',
    starI: 'Independence', starId: 'Finished without relying much on hints',
    starA: 'Application', starAd: 'Solved the applied question',
    learned: 'What you learned', toReview: "We'll review this later", xpGain: '+{n} XP',
    nextLesson: 'Next lesson', replay: 'Try again', toMap: 'Lesson map', home: 'Home',
    kgPraise: 'You played and learned! 🌟', points: 'points',
    m_none: 'Not started', m_learn: 'Learning', m_support: 'Needs support', m_near: 'Almost mastered', m_mastered: 'Mastered', m_review: 'Needs review',
    timer: 'Time challenge', timerSub: 'Optional, does not affect stars', best: 'Best time',
    a11y: 'Accessibility', fontSize: 'Text size', contrast: 'High contrast', motion: 'Reduce motion',
    readAloud: 'Read questions aloud', sfx: 'Sound effects', lang: 'Language', on: 'On', off: 'Off',
    fN: 'Normal', fL: 'Large', fXL: 'Larger',
    parentGate: 'Parent area', gateQ: 'What is {a} × {b}?', wrongGate: 'Incorrect answer',
    children: 'Children', addChild: 'Add child', switchChild: 'Switch learner', grade: 'Grade', changeGrade: 'Change grade',
    report: 'Skills report', needSupport: 'Skills needing support', noSkills: 'No skills started yet',
    lessonsDone: 'Lessons done', starsTotal: 'Stars', minutesToday: 'Minutes today',
    timeLimit: 'Daily time limit', unlimited: 'No limit', min: 'm',
    unlockAll: 'Unlock all lessons', allowTimer: 'Allow time challenge', allowTimerSub: 'Never shown in KG, Grade 1 and 2',
    delChild: "Delete this child's data", delAll: 'Delete all data on this device', confirmDel: 'Are you sure? This cannot be undone.',
    privacy: 'Privacy: no ads, no chat, no photo sharing, and no data leaves this device.',
    restTitle: 'Rest time 🌙', restSub: "Today's play time is over. Well done! See you tomorrow.", restParent: 'Parent: extend time',
    badges: 'Badges', shopSub: 'Spend your points on new characters', buy: 'Buy', use: 'Use', inUse: 'In use', notEnough: 'Not enough points yet',
    worldOpen: 'Open world', review: 'Review', daily: "Today's challenge", mixed: 'Mixed review challenge',
    protoNote: 'Illustrative prototype content for testing. It must be checked against the official current textbooks before use. The app is not officially endorsed by the Ministry of Education.',
    stars: 'stars', of: 'of', newBadge: 'New badge: {n}', mastered: 'Skill mastered: {n} 🎉',
    yes: 'Yes', no: 'No', profileOf: "{n}'s profile", curriculum: 'Curriculum'
  }
};

N.lang = 'ar';
N.t = function (k, vars) {
  let s = (N.STR[N.lang] && N.STR[N.lang][k]);
  if (s == null) s = N.STR.ar[k];
  if (s == null) return k;
  if (vars && typeof s === 'string') s = s.replace(/\{(\w+)\}/g, (m, v) => vars[v] != null ? vars[v] : m);
  return s;
};
/* اسم ثنائي اللغة {ar, en} */
N.tn = function (o) { return o == null ? '' : typeof o === 'string' ? o : (o[N.lang] || o.ar || o.en || ''); };
/* الأرقام الغربية افتراضيًا؛ تُغيَّر هنا إن اعتمد الكتاب المدرسي أرقامًا مشرقية */
N.num = function (n) { return String(n); };
