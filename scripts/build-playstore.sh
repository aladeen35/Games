#!/usr/bin/env bash
# يبني حزمة Google Play (AAB) ويتحقّق من محتواها، ثم يجمع كل ملفات المتجر في مجلد واحد.
#
# يحتاج Android SDK (platform 36 و build-tools 36) ويحتاج الوصول إلى dl.google.com
# لتنزيل أدوات أندرويد ومكتبات Gradle. شغّله هكذا:
#     ANDROID_SDK_ROOT=/path/to/sdk bash scripts/build-playstore.sh
set -euo pipefail
cd "$(dirname "$0")/.."

OUT="playstore/release"
mkdir -p "$OUT"

VER=$(grep -oP 'versionName "\K[^"]+' android/app/build.gradle)
CODE=$(grep -oP 'versionCode \K[0-9]+' android/app/build.gradle)
echo "▶ بناء الإصدار $VER (versionCode $CODE)"

: "${ANDROID_SDK_ROOT:?اضبط ANDROID_SDK_ROOT على مسار Android SDK}"
export ANDROID_HOME="$ANDROID_SDK_ROOT"

# 1) تجميع ملفات اللعبة ونسخها إلى مشروع أندرويد — الخطوة التي يجب ألا تُتخطّى أبداً
npm run build:www
npx cap sync android

# 2) فحص أن المحزوم هو آخر نسخة فعلاً (وليس www قديماً)
bash scripts/verify-bundle.sh

# 3) بناء AAB موقّعاً للمتجر، و APK للتوزيع المباشر
( cd android && ./gradlew --no-daemon bundleRelease assembleRelease )

AAB="android/app/build/outputs/bundle/release/app-release.aab"
APK="android/app/build/outputs/apk/release/app-release.apk"
[ -f "$AAB" ] || { echo "✘ لم يُنتَج ملف AAB"; exit 1; }

# 4) فحص محتوى APK (نفس ملفات AAB) للتأكد من عدم حزم نسخة قديمة
bash scripts/verify-bundle.sh "$APK"

cp "$AAB" "$OUT/AbuJanan-Games-$VER-PlayStore.aab"
cp "$APK" "$OUT/AbuJanan-Games-$VER.apk"

# 5) جمع ملفات المتجر بجانب الحزمة
cp -r playstore/out/. "$OUT/"
cp playstore/listing-ar.txt playstore/listing-en.txt playstore/console-answers.md "$OUT/"

BT="$(ls -d "$ANDROID_SDK_ROOT"/build-tools/*/ | tail -1)"
echo
echo "▶ بصمة التوقيع:"
"$BT/apksigner" verify --print-certs "$OUT/AbuJanan-Games-$VER.apk" | grep -i "SHA-256 digest" || true
echo
echo "✔ جاهز في $OUT"
ls -la "$OUT"
