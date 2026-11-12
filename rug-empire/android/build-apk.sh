#!/usr/bin/env bash
# بناء APK موقّع للعبة «إمبراطورية السجاد» (Rug Empire) بلا Gradle:
#   aapt2 (موارد) → javac → d8/dx (classes.dex) → zipalign → apksigner
# الناتج: rug-empire/dist/RugEmpire-<VERSION_NAME>.apk
#
# الاستخدام:  bash rug-empire/android/build-apk.sh
# متغيرات اختيارية:
#   ANDROID_SDK   جذر الـ SDK (الافتراضي: $ANDROID_HOME ثم $ANDROID_SDK_ROOT ثم /opt/android-sdk)
#   BUILD_TOOLS   مجلد build-tools (الافتراضي: أحدث مجلد داخل $ANDROID_SDK/build-tools)
#   ANDROID_JAR   مسار android.jar (الافتراضي: platforms/android-34 ثم أحدث منصة موجودة)
#   WWW_DIR · KEYSTORE · KEYSTORE_PASS · KEY_ALIAS · DX_JAR
set -euo pipefail

VERSION_CODE="${VERSION_CODE:-1}"
VERSION_NAME="${VERSION_NAME:-1.0}"
MIN_SDK=24
TARGET_SDK=34
PKG=com.rugempire.game
OUTNAME=RugEmpire

AND="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$AND/.." && pwd)"
REPO="$(cd "$ROOT/.." && pwd)"
WWW_DIR="${WWW_DIR:-$ROOT/www}"
DIST="$ROOT/dist"
OUT="$AND/build"
KEYSTORE="${KEYSTORE:-$AND/rugempire.keystore}"
KEYSTORE_PASS="${KEYSTORE_PASS:-rugempire2026}"
KEY_ALIAS="${KEY_ALIAS:-rugempire}"
DX_JAR="${DX_JAR:-$REPO/android/tools/dalvik-dx.jar}"

die() { echo "❌ $*" >&2; exit 1; }

# ── ⓪ التحقق من المدخلات والأدوات ───────────────────────────────────────────
[ -f "$WWW_DIR/index.html" ] || die "الملف $WWW_DIR/index.html غير موجود — ابنِ اللعبة أولًا (npm run build) ثم أعد المحاولة."

ANDROID_SDK="${ANDROID_SDK:-${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/opt/android-sdk}}}"
if [ -z "${BUILD_TOOLS:-}" ] && [ -d "$ANDROID_SDK/build-tools" ]; then
  BUILD_TOOLS="$(ls -d "$ANDROID_SDK"/build-tools/*/ 2>/dev/null | sort -V | tail -n1)"
  BUILD_TOOLS="${BUILD_TOOLS%/}"
fi
if [ -z "${ANDROID_JAR:-}" ]; then
  if [ -f "$ANDROID_SDK/platforms/android-$TARGET_SDK/android.jar" ]; then
    ANDROID_JAR="$ANDROID_SDK/platforms/android-$TARGET_SDK/android.jar"
  else
    ANDROID_JAR="$(ls "$ANDROID_SDK"/platforms/android-*/android.jar 2>/dev/null | sort -V | tail -n1 || true)"
  fi
fi
[ -n "${ANDROID_JAR:-}" ] && [ -f "$ANDROID_JAR" ] || die "android.jar غير موجود. اضبط ANDROID_SDK أو ANDROID_JAR (مثال: /opt/android-sdk/platforms/android-34/android.jar)."

# يبحث عن الأداة في BUILD_TOOLS أولًا ثم في PATH
tool() {
  if [ -n "${BUILD_TOOLS:-}" ] && [ -x "$BUILD_TOOLS/$1" ]; then echo "$BUILD_TOOLS/$1"
  elif command -v "$1" >/dev/null 2>&1; then command -v "$1"
  else return 1; fi
}
AAPT2="$(tool aapt2)"         || die "aapt2 غير موجود. اضبط ANDROID_SDK أو BUILD_TOOLS (مثال: /opt/android-sdk/build-tools/34.0.0)."
ZIPALIGN="$(tool zipalign)"   || die "zipalign غير موجود في BUILD_TOOLS."
APKSIGNER="$(tool apksigner)" || die "apksigner غير موجود في BUILD_TOOLS."
D8="$(tool d8 || true)"
[ -n "$D8" ] || [ -f "$DX_JAR" ] || die "لا d8 ولا $DX_JAR موجود لتوليد classes.dex."
for t in javac java keytool zip; do command -v $t >/dev/null 2>&1 || die "الأداة $t غير مثبتة."; done
unset JAVA_TOOL_OPTIONS 2>/dev/null || true   # يمنع رسائل «Picked up JAVA_TOOL_OPTIONS» ولا حاجة للشبكة هنا

APK="$DIST/$OUTNAME-$VERSION_NAME.apk"
echo "════════ $OUTNAME $VERSION_NAME ($VERSION_CODE) · $PKG ════════"
echo "   build-tools: ${BUILD_TOOLS:-PATH}"
echo "   android.jar: $ANDROID_JAR"
rm -rf "$OUT"; mkdir -p "$OUT/compiled" "$OUT/gen" "$OUT/classes" "$OUT/dex" "$OUT/assets/www" "$DIST"

echo "① نسخ ملفات اللعبة إلى assets/www (بلا ‎*.map)"
cp -R "$WWW_DIR/." "$OUT/assets/www/"
find "$OUT/assets/www" \( -name '*.map' -o -name '.DS_Store' -o -name 'Thumbs.db' \) -type f -delete
[ -f "$OUT/assets/www/index.html" ] || die "فشل نسخ index.html"
echo "   $(find "$OUT/assets/www" -type f | wc -l) ملف · $(du -sh "$OUT/assets/www" | cut -f1)"

echo "② ترجمة الموارد"
"$AAPT2" compile --dir "$AND/res" -o "$OUT/compiled/res.zip"

echo "③ ربط الحزمة"
"$AAPT2" link -o "$OUT/base.apk" -I "$ANDROID_JAR" \
  --manifest "$AND/AndroidManifest.xml" \
  -R "$OUT/compiled/res.zip" --auto-add-overlay \
  -A "$OUT/assets" --java "$OUT/gen" \
  --min-sdk-version $MIN_SDK --target-sdk-version $TARGET_SDK \
  --version-code "$VERSION_CODE" --version-name "$VERSION_NAME" --replace-version \
  -0 png -0 jpg -0 jpeg -0 webp -0 gif -0 ogg -0 mp3 -0 m4a -0 webm -0 mp4 -0 woff -0 woff2

echo "④ ترجمة جافا وتوليد classes.dex"
find "$AND/java" "$OUT/gen" -name '*.java' > "$OUT/sources.txt"
javac -nowarn -Xlint:-options -source 8 -target 8 -encoding UTF-8 \
  -bootclasspath "$ANDROID_JAR" -classpath "$ANDROID_JAR" -d "$OUT/classes" @"$OUT/sources.txt"
# d8 أولًا؛ وإن فشل (d8 34.0.0 يتعطل مع ملفات javac 21: ‏MethodParameters بلا اسم) نرجع إلى dalvik-dx من المستودع
find "$OUT/classes" -name '*.class' > "$OUT/classes.txt"
if [ -n "$D8" ] && "$D8" --release --min-api $MIN_SDK --lib "$ANDROID_JAR" --output "$OUT/dex" @"$OUT/classes.txt" 2>"$OUT/d8.log"; then
  echo "   dex: d8"
else
  [ -f "$DX_JAR" ] || { cat "$OUT/d8.log" >&2 2>/dev/null; die "فشل d8 ولا يوجد $DX_JAR"; }
  echo "   dex: dalvik-dx (d8 غير متاح أو فشل — التفاصيل في $OUT/d8.log)"
  rm -f "$OUT/dex/classes.dex"
  java -cp "$DX_JAR" com.android.dx.command.Main --dex --min-sdk-version=$MIN_SDK \
    --output="$OUT/dex/classes.dex" "$OUT/classes"
fi
[ -f "$OUT/dex/classes.dex" ] || die "لم يتولد classes.dex"
( cd "$OUT/dex" && zip -q -X ../base.apk classes.dex )

echo "⑤ محاذاة وتوقيع (v1 + v2 + v3)"
if [ ! -f "$KEYSTORE" ]; then
  echo "   إنشاء مفتاح توقيع جديد: $KEYSTORE"
  keytool -genkeypair -keystore "$KEYSTORE" -storetype PKCS12 \
    -storepass "$KEYSTORE_PASS" -keypass "$KEYSTORE_PASS" \
    -alias "$KEY_ALIAS" -keyalg RSA -keysize 2048 -validity 10950 \
    -dname "CN=Rug Empire, OU=Games, O=Rug Empire, L=Riyadh, C=SA" >/dev/null 2>&1
fi
"$ZIPALIGN" -f -p 4 "$OUT/base.apk" "$OUT/aligned.apk"
"$APKSIGNER" sign --ks "$KEYSTORE" --ks-key-alias "$KEY_ALIAS" \
  --ks-pass "pass:$KEYSTORE_PASS" --key-pass "pass:$KEYSTORE_PASS" \
  --min-sdk-version $MIN_SDK \
  --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --v4-signing-enabled false \
  --out "$APK" "$OUT/aligned.apk"

echo "⑥ التحقق"
"$ZIPALIGN" -c -p 4 "$APK" || die "المحاذاة غير سليمة"
"$APKSIGNER" verify --print-certs "$APK" | grep -m1 'SHA-256'
"$AAPT2" dump badging "$APK" | grep -E "^(package|sdkVersion|targetSdkVersion|launchable-activity)"
echo "✅ $APK ($(du -h "$APK" | cut -f1))"
