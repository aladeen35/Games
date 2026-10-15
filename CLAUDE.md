# ملاحظات المشروع

## ألعاب الأطفال (`atheer/`)
- التطبيق نفسه له **نسختان** بألعاب متطابقة تمامًا، ولا تختلفان إلا في الأسماء والشعار واسم التطبيق ومفتاح التوقيع:
  - «ألعاب أثير وبشرى» (`com.atheer.games`) ← الإعدادات في `atheer/js/edition.js`، والمفتاح `atheer/android/atheer.keystore`.
  - «ألعاب كوتي وريلا وسونى» (`com.kutirila.games`): ريلا بنت، وكوتي وسونى ولدان ← `atheer/editions/kids3/` (ملفات الويب والموارد والمفتاح `kids3.keystore`).
- **عند أي تحديث: ابنِ النسختين معًا دائمًا** بالأمر `bash atheer/android/build-apk.sh` وأرسل ملفي APK الاثنين للمستخدم. لكل نسخة توقيع مختلف، ولا تغيّر المفاتيح وإلا لن تُثبَّت التحديثات فوق النسخ القديمة.
- ارفع `versionCode`/`VERSION_NAME` في `atheer/android/build-apk.sh` مع كل إصدار جديد.
- أي تعديل على الألعاب يكون في `atheer/js/*.js` المشتركة، لا داخل مجلد نسخة.

## مشغّل «البشرى» للفيديو و IPTV (`bushra/`)
- تطبيق **Flutter** واحد للجوال (أندرويد/iOS) و Android TV والويب. الحزمة `com.albushra.player`، والمفتاح `bushra/android/bushra.keystore` (لا تغيّره).
- المشغل: `lib/player/engine.dart` واجهة موحدة؛ `engine_native.dart` (video_player/ExoPlayer) و`engine_web.dart` (HLS.js و mpegts.js من `web/vendor/`).
- نمطا تصميم: «هادئ» (`BPalette.darkP`) و«سينمائي» (`BPalette.cinematicP` + `widgets/backdrop.dart`) في `lib/core/theme.dart`.
- لا تستدعِ `notifyListeners` مباشرة أثناء البناء؛ `AppStore.notifyListeners` يؤجلها تلقائيًا، فلا تتجاوزه.
- بيئة السحابة هنا تمنع `dl.google.com`، فلا يُبنى APK محليًا؛ يبنيه `.github/workflows/bushra.yml` على GitHub وينشره في Releases.
- نسخة الويب المنشورة في `bushra/app/`: `flutter build web --release --no-web-resources-cdn --base-href /Games/bushra/app/` ثم انسخ `build/web` إليها واحذف من `canvaskit/` ملفات `skwasm*` و`wimp*` و`webparagraph` و`*.symbols`.
- رابط التجربة المباشر: https://aladeen35.github.io/Games/bushra-player/ — من فرع `gh-pages` (موقع فيه مجلدات أخرى، فلا تلمس غير `bushra-player/`). للنشر: ابنِ بـ`--base-href /Games/bushra-player/` وانسخ الناتج (بعد تنظيف canvaskit) إلى `bushra-player/` في `gh-pages`.
- ارفع `version` في `bushra/pubspec.yaml` مع كل إصدار.
