#!/usr/bin/env bash
# بناء ملف APK قابل للتثبيت من تطبيق «عالم الألوان مع جنان»
# يحتاج: aapt2 · javac (JDK 8+) · dalvik-dx · zipalign · apksigner · android.jar
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AND="$ROOT/android"
OUT="${OUT_DIR:-$AND/build}"
ANDROID_JAR="${ANDROID_JAR:-/usr/lib/android-sdk/platforms/android-23/android.jar}"
DX_JAR="${DX_JAR:-$AND/tools/dalvik-dx.jar}"
KS="${KEYSTORE:-$OUT/jinan.keystore}"
KS_PASS="${KEYSTORE_PASS:-jinan2024}"
APK="$OUT/JinanColors.apk"

rm -rf "$OUT"; mkdir -p "$OUT/compiled" "$OUT/gen" "$OUT/classes" "$OUT/assets"

echo "① نسخ ملفات التطبيق إلى assets"
for item in index.html manifest.json sw.js icon-192.png icon-512.png icon-maskable.png fonts pages vendor; do
  cp -r "$ROOT/$item" "$OUT/assets/"
done

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
  --version-code 1 --version-name 1.0 \
  --auto-add-overlay

echo "④ ترجمة جافا"
javac -nowarn -source 8 -target 8 -encoding UTF-8 \
  -bootclasspath "$ANDROID_JAR" -classpath "$ANDROID_JAR" \
  -d "$OUT/classes" \
  $(find "$AND/java" "$OUT/gen" -name '*.java')

echo "⑤ توليد classes.dex"
java -cp "$DX_JAR" com.android.dx.command.Main --dex --min-sdk-version=21 \
  --output="$OUT/classes.dex" "$OUT/classes"

echo "⑥ إضافة الكود إلى الحزمة"
( cd "$OUT" && zip -q -X "$(basename "$OUT/base.apk")" classes.dex )

echo "⑦ محاذاة وتوقيع"
[ -f "$KS" ] || keytool -genkeypair -v -keystore "$KS" -storepass "$KS_PASS" -keypass "$KS_PASS" \
  -alias jinan -keyalg RSA -keysize 2048 -validity 10950 \
  -dname "CN=Jinan Colors, OU=Kids Apps, O=Jinan, L=Riyadh, C=SA" >/dev/null 2>&1
zipalign -f -p 4 "$OUT/base.apk" "$OUT/aligned.apk"
apksigner sign --ks "$KS" --ks-pass "pass:$KS_PASS" --key-pass "pass:$KS_PASS" \
  --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true \
  --out "$APK" "$OUT/aligned.apk"
apksigner verify --print-certs "$APK" | head -4

echo "✅ جاهز: $APK ($(du -h "$APK" | cut -f1))"
