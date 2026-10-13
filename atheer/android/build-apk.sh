#!/usr/bin/env bash
# بناء ملفات APK لكل النسخ دفعة واحدة:
#   ① «ألعاب أثير وبشرى»            ← dist/AtheerBushra-<الإصدار>.apk
#   ② «ألعاب كوتي وريلا وسونى»    ← dist/KutiRilaSony-<الإصدار>.apk
# الألعاب متطابقة في النسختين؛ تختلف الأسماء والشعار واسم الحزمة ومفتاح التوقيع فقط.
# الاستخدام: bash atheer/android/build-apk.sh [atheer|kids3]   (بلا وسيط = كل النسخ)
# يحتاج: aapt2 · javac (JDK 8+) · dalvik-dx · zipalign · apksigner · android.jar
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO="$(cd "$ROOT/.." && pwd)"
AND="$ROOT/android"
ANDROID_JAR="${ANDROID_JAR:-/usr/lib/android-sdk/platforms/android-23/android.jar}"
DX_JAR="${DX_JAR:-$REPO/android/tools/dalvik-dx.jar}"
VERSION_CODE=5
VERSION_NAME=4.0
DIST="$ROOT/dist"
mkdir -p "$DIST"

# build <معرّف النسخة> <اسم الحزمة> <اسم الملف> <مفتاح التوقيع> <كلمة سره> <الاسم المستعار> <مجلد النسخة أو فارغ>
build() {
  local ID=$1 PKG=$2 OUTNAME=$3 KS=$4 KS_PASS=$5 ALIAS=$6 ED=$7
  local OUT="$AND/build/$ID"
  echo "════════ $OUTNAME ($PKG) ════════"
  rm -rf "$OUT"; mkdir -p "$OUT/compiled" "$OUT/gen" "$OUT/classes" "$OUT/assets"

  echo "① نسخ ملفات التطبيق ثم ملفات النسخة (الأسماء والشعار)"
  for item in index.html manifest.json sw.js logo.jpg icon-192.png icon-512.png icon-maskable.png fonts js img; do
    cp -r "$ROOT/$item" "$OUT/assets/"
  done
  [ -n "$ED" ] && cp -r "$ED/web/." "$OUT/assets/"

  echo "② ترجمة الموارد"
  aapt2 compile --dir "$AND/res" -o "$OUT/compiled/base.zip"
  local OVERLAY=()
  if [ -n "$ED" ] && [ -d "$ED/res" ]; then
    aapt2 compile --dir "$ED/res" -o "$OUT/compiled/edition.zip"
    OVERLAY=(-R "$OUT/compiled/edition.zip")
  fi

  echo "③ ربط الحزمة"
  aapt2 link -o "$OUT/base.apk" -I "$ANDROID_JAR" \
    --manifest "$AND/AndroidManifest.xml" \
    -R "$OUT/compiled/base.zip" "${OVERLAY[@]}" --auto-add-overlay \
    -A "$OUT/assets" --java "$OUT/gen" \
    --rename-manifest-package "$PKG" \
    --min-sdk-version 21 --target-sdk-version 34 \
    --version-code $VERSION_CODE --version-name $VERSION_NAME --replace-version

  echo "④ ترجمة جافا وتوليد classes.dex"
  javac -nowarn -source 8 -target 8 -encoding UTF-8 \
    -bootclasspath "$ANDROID_JAR" -classpath "$ANDROID_JAR" -d "$OUT/classes" \
    $(find "$AND/java" "$OUT/gen" -name '*.java')
  java -cp "$DX_JAR" com.android.dx.command.Main --dex --min-sdk-version=21 --output="$OUT/classes.dex" "$OUT/classes"
  ( cd "$OUT" && zip -q -X base.apk classes.dex )

  echo "⑤ محاذاة وتوقيع بمفتاح النسخة"
  [ -f "$KS" ] || keytool -genkeypair -v -keystore "$KS" -storepass "$KS_PASS" -keypass "$KS_PASS" \
    -alias "$ALIAS" -keyalg RSA -keysize 2048 -validity 10950 \
    -dname "CN=$ALIAS Games, OU=Kids Apps, O=$ALIAS, L=Riyadh, C=SA" >/dev/null 2>&1
  zipalign -f -p 4 "$OUT/base.apk" "$OUT/aligned.apk"
  apksigner sign --ks "$KS" --ks-pass "pass:$KS_PASS" --key-pass "pass:$KS_PASS" \
    --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --v4-signing-enabled false \
    --out "$DIST/$OUTNAME-$VERSION_NAME.apk" "$OUT/aligned.apk"
  apksigner verify --print-certs "$DIST/$OUTNAME-$VERSION_NAME.apk" | grep -m1 'SHA-256'
  echo "✅ $DIST/$OUTNAME-$VERSION_NAME.apk ($(du -h "$DIST/$OUTNAME-$VERSION_NAME.apk" | cut -f1))"
}

WHICH="${1:-all}"
if [ "$WHICH" = all ] || [ "$WHICH" = atheer ]; then
  build atheer com.atheer.games AtheerBushra \
    "${KEYSTORE:-$AND/atheer.keystore}" "${KEYSTORE_PASS:-atheer2024}" atheer ""
fi
if [ "$WHICH" = all ] || [ "$WHICH" = kids3 ]; then
  build kids3 com.kutirila.games KutiRilaSony \
    "${KEYSTORE_KIDS3:-$ROOT/editions/kids3/kids3.keystore}" "${KEYSTORE_KIDS3_PASS:-kids3games2024}" kids3 "$ROOT/editions/kids3"
fi
