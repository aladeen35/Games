# إمبراطورية السجاد — بناء تطبيق أندرويد (APK)

غلاف WebView أصلي للعبة الموجودة في `rug-empire/www`، يُبنى بلا Gradle:
`aapt2 → javac → d8 (أو dalvik-dx) → zipalign → apksigner`.

- الحزمة: `com.rugempire.game` · الحد الأدنى Android 7.0 (API 24) · الهدف API 34.
- الناتج: `rug-empire/dist/RugEmpire-<الإصدار>.apk` موقّع (v1 + v2 + v3).

## البناء من الهاتف (GitHub Actions)

1. ادفع أي تعديل داخل `rug-empire/` أو افتح تبويب **Actions ← Rug Empire APK ← Run workflow**.
2. بعد انتهاء التشغيل افتح صفحته وانزل إلى **Artifacts** ونزّل `RugEmpire-apk` (ملف zip بداخله الـ APK).
3. فك الضغط وثبّت الـ APK (اسمح بـ«التثبيت من مصادر غير معروفة» عند الطلب).

## البناء محليًا

```bash
bash rug-empire/android/build-apk.sh
```

المتطلبات: JDK 17 أو أحدث (`javac`, `keytool`) و`zip` وأجزاء من Android SDK:

| المطلوب | المكان الافتراضي |
|---|---|
| build-tools (aapt2, zipalign, apksigner, d8) | `/opt/android-sdk/build-tools/34.0.0` |
| `android.jar` للمنصة 34 | `/opt/android-sdk/platforms/android-34/android.jar` |

إن كان الـ SDK في مكان آخر فاضبط المتغيرات:

```bash
ANDROID_SDK=/path/to/sdk bash rug-empire/android/build-apk.sh          # يختار أحدث build-tools ومنصة 34
BUILD_TOOLS=/path/to/build-tools/34.0.0 ANDROID_JAR=/path/to/android.jar bash rug-empire/android/build-apk.sh
```

(يُقرأ أيضًا `ANDROID_HOME` و`ANDROID_SDK_ROOT`.) تثبيت الـ SDK بلا Android Studio:

```bash
mkdir -p /opt/android-sdk/build-tools /opt/android-sdk/platforms && cd /tmp
curl -fO https://dl.google.com/android/repository/build-tools_r34-linux.zip
curl -fO https://dl.google.com/android/repository/platform-34-ext7_r03.zip
unzip -q build-tools_r34-linux.zip -d /opt/android-sdk/build-tools && mv /opt/android-sdk/build-tools/android-14 /opt/android-sdk/build-tools/34.0.0
unzip -q platform-34-ext7_r03.zip -d /opt/android-sdk/platforms
```

## إصدار جديد

ارفع `VERSION_CODE` (رقم صحيح يزيد كل مرة) و`VERSION_NAME` في أعلى `build-apk.sh` ثم ابنِ.

## مفتاح التوقيع

`rugempire.keystore` (الاسم المستعار `rugempire`، كلمة السر `rugempire2026`) محفوظ في المستودع عمدًا.
**لا تغيّره ولا تحذفه**؛ وإلا لن تُثبَّت التحديثات فوق النسخة القديمة.

## ما يوفّره الغلاف للعبة

- اللعبة تُحمَّل من `https://appassets.rugempire.game/index.html` (نطاق وهمي يقرأ من `assets/www`، بلا إنترنت). ملفات `*.map` لا تدخل الـ APK.
- `window.AndroidBridge`:
  - `saveFile(base64, filename, mime)` ← يحفظ في «التنزيلات/RugEmpire» (أندرويد 10+) أو مجلد التطبيق الخارجي (أقدم).
  - للملفات الكبيرة: `beginFile(filename, mime)` ← `appendFile(id, base64)` … ← `finishFile(id)` (و`cancelFile(id)`)، أو مباشرة `window.AndroidSaveBlob(blob, filename)`.
  - `vibrate(ms)` · `share(text)` · `isAndroidApp()`.
- روابط `<a download>` على `blob:` أو `data:` تُحوَّل تلقائيًا إلى الحفظ عبر الجسر.
- زر الرجوع: يستدعي `window.onAndroidBack()`؛ إن أعادت `true` فاللعبة عالجته، وإلا «اضغط مرة أخرى للخروج».

## الأيقونات

`python3 make-icons.py <الشعار.png> rug-empire/android` يعيد توليد `res/mipmap-*` و`web-icons/` (أيقونات الويب تُنسخ يدويًا إلى `www`).
