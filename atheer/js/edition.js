/* إعدادات التطبيق: تطبيق واحد للأطفال الخمسة.
   الأطفال هنا يُضافون عند أول تشغيل (أو يُدمجون مع الموجودين في التحديث)، وبعدها تُدار القائمة من الشاشة الرئيسية.
   المعرّفات ثابتة لأن نتائج كل طفل محفوظة بها. gender: girl | boy */
window.EDITION = {
  id: 'family',
  title: 'ألعاب أطفالنا',
  names: 'أثير وبشرى وكوتي وريلا وسونى',
  profiles: [
    { id: 'atheer',  name: 'أثير', gender: 'girl', theme: 'girls', av: '👑' },
    { id: 'bushra',  name: 'بشرى', gender: 'girl', theme: 'girls', av: '⭐' },
    { id: 'kuti',    name: 'كوتي', gender: 'boy',  theme: 'boys',  av: '🚗' },
    { id: 'rila',    name: 'ريلا', gender: 'girl', theme: 'girls', av: '🎀' },
    { id: 'owaison', name: 'سونى', gender: 'boy',  theme: 'boys',  av: '🦖' }
  ]
};
