/* إعدادات التطبيق: تطبيق واحد للأطفال الخمسة.
   الأطفال هنا يُضافون عند أول تشغيل (أو يُدمجون مع الموجودين في التحديث)، وبعدها تُدار القائمة من الشاشة الرئيسية.
   en: الاسم بالإنجليزية (يظهر في الواجهة الإنجليزية ما دام الاسم العربي لم يُغيَّر).
   المعرّفات ثابتة لأن نتائج كل طفل محفوظة بها. gender: girl | boy */
window.EDITION = {
  id: 'family',
  title: 'ألعاب أطفالنا',
  titleEn: 'Our Kids Games',
  names: 'أثير وبشرى وكوتي وريلا وسونى',
  namesEn: 'Atheer, Bushra, Kuti, Rila and Sony',
  profiles: [
    { id: 'atheer',  name: 'أثير', en: 'Atheer', gender: 'girl', theme: 'girls', av: '👑' },
    { id: 'bushra',  name: 'بشرى', en: 'Bushra', gender: 'girl', theme: 'girls', av: '⭐' },
    { id: 'kuti',    name: 'كوتي', en: 'Kuti', gender: 'boy',  theme: 'boys',  av: '🚗' },
    { id: 'rila',    name: 'ريلا', en: 'Rila', gender: 'girl', theme: 'girls', av: '🎀' },
    { id: 'owaison', name: 'سونى', en: 'Sony', gender: 'boy',  theme: 'boys',  av: '🦖' }
  ]
};
