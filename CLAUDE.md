# ملاحظات المشروع

## ألعاب الأطفال (`atheer/`)
- **تطبيق واحد موحّد** اسمه «ألعاب أطفالنا» للأطفال الخمسة معًا: أثير وبشرى وريلا (بنات)، وكوتي وسونى (أولاد). الأطفال ومعرّفاتهم في `atheer/js/edition.js`، والشعار `atheer/logo.jpg`.
- الحزمة `com.atheer.games` والمفتاح `atheer/android/atheer.keystore` (كي يُثبَّت التحديث فوق النسخة القديمة «ألعاب أثير وبشرى» مع بقاء النتائج). **لا تغيّر المفتاح ولا اسم الحزمة.**
- نسخة «كوتي وريلا وسونى» القديمة (`com.kutirila.games`، `atheer/editions/kids3/`) متوقفة ولا تُبنى إلا عند الحاجة بالأمر `bash atheer/android/build-apk.sh kids3`.
- البناء: `bash atheer/android/build-apk.sh` يُخرج `atheer/dist/OurKidsGames-<الإصدار>.apk`؛ أرسل الملف للمستخدم بعد كل تحديث.
- ارفع `VERSION_CODE`/`VERSION_NAME` في `atheer/android/build-apk.sh` مع كل إصدار جديد.
- أي تعديل على الألعاب يكون في `atheer/js/*.js` المشتركة.
