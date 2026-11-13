#!/usr/bin/env bash
# بناء APK لتطبيق «نِبراس» ← nibras/dist/Nibras-<الإصدار>.apk
# الاستخدام: bash nibras/android/build-apk.sh
# يحتاج: aapt2 · javac (JDK 8+) · dalvik-dx · zipalign · apksigner · android.jar
# ⚠️ لا تغيّر مفتاح التوقيع nibras.keystore وإلا لن تُثبَّت التحديثات فوق النسخة القديمة.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO="$(cd "$ROOT/.." && pwd)"
AND="$ROOT/android"
ANDROID_JAR="${ANDROID_JAR:-/usr/lib/android-sdk/platforms/android-23/android.jar}"
DX_JAR="${DX_JAR:-$REPO/android/tools/dalvik-dx.jar}"
VERSION_CODE=1
VERSION_NAME=0.1
PKG=com.nibras.learn
KS="${KEYSTORE:-$AND/nibras.keystore}"
KS_PASS="${KEYSTORE_PASS:-nibras2026}"
ALIAS=nibras
DIST="$ROOT/dist"; OUT="$AND/build"
mkdir -p "$DIST"; rm -rf "$OUT"; mkdir -p "$OUT/compiled" "$OUT/gen" "$OUT/classes" "$OUT/assets"

echo "① نسخ ملفات التطبيق"
for item in index.html manifest.json sw.js icon-192.png icon-512.png icon-maskable.png fonts js; do cp -r "$ROOT/$item" "$OUT/assets/"; done

echo "② ترجمة الموارد وربط الحزمة"
aapt2 compile --dir "$AND/res" -o "$OUT/compiled/res.zip"
aapt2 link -o "$OUT/base.apk" -I "$ANDROID_JAR" --manifest "$AND/AndroidManifest.xml" \
  -R "$OUT/compiled/res.zip" --auto-add-overlay -A "$OUT/assets" --java "$OUT/gen" \
  --min-sdk-version 21 --target-sdk-version 34 \
  --version-code $VERSION_CODE --version-name $VERSION_NAME --replace-version

echo "③ ترجمة جافا وتوليد classes.dex"
javac -nowarn -source 8 -target 8 -encoding UTF-8 -bootclasspath "$ANDROID_JAR" -classpath "$ANDROID_JAR" \
  -d "$OUT/classes" $(find "$AND/java" "$OUT/gen" -name '*.java')
java -cp "$DX_JAR" com.android.dx.command.Main --dex --min-sdk-version=21 --output="$OUT/classes.dex" "$OUT/classes"
( cd "$OUT" && zip -q -X base.apk classes.dex )

echo "④ محاذاة وتوقيع"
[ -f "$KS" ] || keytool -genkeypair -v -keystore "$KS" -storepass "$KS_PASS" -keypass "$KS_PASS" \
  -alias "$ALIAS" -keyalg RSA -keysize 2048 -validity 10950 \
  -dname "CN=Nibras Learning, OU=EdTech, O=Nibras, L=Khartoum, C=SD" >/dev/null 2>&1
zipalign -f -p 4 "$OUT/base.apk" "$OUT/aligned.apk"
apksigner sign --ks "$KS" --ks-pass "pass:$KS_PASS" --key-pass "pass:$KS_PASS" \
  --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --v4-signing-enabled false \
  --out "$DIST/Nibras-$VERSION_NAME.apk" "$OUT/aligned.apk"
apksigner verify --print-certs "$DIST/Nibras-$VERSION_NAME.apk" | grep -m1 'SHA-256'
rm -rf "$OUT"
echo "✅ $DIST/Nibras-$VERSION_NAME.apk ($(du -h "$DIST/Nibras-$VERSION_NAME.apk" | cut -f1))"
