#!/usr/bin/env bash
# بناء APK للعبة «تحدي الـ Keyboard مع أبو جنان»
# يحتاج: aapt2 · javac (JDK 8+) · zipalign · apksigner · android.jar ، ومُجمِّع DEX المرفق في ../../android/tools/
# الاستخدام: KB_SERVER_URL=https://my-server.example bash android/build-apk.sh
set -euo pipefail

APP="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AND="$APP/android"
OUT="${OUT_DIR:-$AND/build}"
ANDROID_JAR="${ANDROID_JAR:-/usr/lib/android-sdk/platforms/android-23/android.jar}"
DX_JAR="${DX_JAR:-$APP/../android/tools/dalvik-dx.jar}"
KS="${KEYSTORE:-$AND/keystore/abujinan.keystore}"
KS_PASS="${KEYSTORE_PASS:-abujinan2026}"
VERSION="${VERSION:-2.0}"
CODE="${VERSION_CODE:-2}"
RELEASE="$APP/release"
APK="$RELEASE/AbuJinanKeyboard-$VERSION.apk"

rm -rf "$OUT"; mkdir -p "$OUT/compiled" "$OUT/gen" "$OUT/classes" "$RELEASE" "$(dirname "$KS")"

echo "① بناء الواجهة ونسخها إلى assets"
( cd "$APP" && node scripts/build.js >/dev/null )
cp -r "$APP/dist" "$OUT/assets"
# عنوان الخادم الافتراضي للعب الأونلاين (يمكن تغييره من إعدادات اللعبة)
printf 'window.KB_CONFIG = { serverUrl: %s };\n' "$(node -e 'console.log(JSON.stringify(process.env.KB_SERVER_URL || ""))')" > "$OUT/assets/config.js"

echo "② ترجمة الموارد (aapt2 compile)"
aapt2 compile --dir "$AND/res" -o "$OUT/compiled/res.zip"

echo "③ ربط الحزمة (aapt2 link)"
aapt2 link \
  -o "$OUT/base.apk" \
  -I "$ANDROID_JAR" \
  --manifest "$AND/AndroidManifest.xml" \
  -R "$OUT/compiled/res.zip" \
  -A "$OUT/assets" \
  --java "$OUT/gen" \
  --min-sdk-version 21 \
  --target-sdk-version 34 \
  --version-code "$CODE" --version-name "$VERSION" \
  --auto-add-overlay

echo "④ ترجمة جافا"
javac -nowarn -source 8 -target 8 -encoding UTF-8 \
  -bootclasspath "$ANDROID_JAR" -classpath "$ANDROID_JAR" \
  -d "$OUT/classes" \
  $(find "$AND/java" "$OUT/gen" -name '*.java') 2>&1 | grep -v "^warning\|^Note\|bootstrap class path" || true
[ -f "$OUT/classes/com/abujinan/keyboard/MainActivity.class" ] || { echo "✗ فشل ترجمة جافا"; exit 1; }

echo "⑤ توليد classes.dex"
java -cp "$DX_JAR" com.android.dx.command.Main --dex --min-sdk-version=21 \
  --output="$OUT/classes.dex" "$OUT/classes"

echo "⑥ إضافة الكود إلى الحزمة"
( cd "$OUT" && zip -q -X base.apk classes.dex )

echo "⑦ محاذاة وتوقيع"
[ -f "$KS" ] || keytool -genkeypair -v -keystore "$KS" -storepass "$KS_PASS" -keypass "$KS_PASS" \
  -alias abujinan -keyalg RSA -keysize 2048 -validity 10950 \
  -dname "CN=Abu Jinan Keyboard, OU=Games, O=Abu Jinan, L=Khartoum, C=SD" >/dev/null 2>&1
zipalign -f -p 4 "$OUT/base.apk" "$OUT/aligned.apk"
apksigner sign --ks "$KS" --ks-pass "pass:$KS_PASS" --key-pass "pass:$KS_PASS" \
  --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true \
  --out "$APK" "$OUT/aligned.apk"
apksigner verify "$APK"

echo "✅ جاهز: $APK ($(du -h "$APK" | cut -f1))"
