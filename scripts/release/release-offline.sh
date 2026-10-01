#!/usr/bin/env bash
# ينتج حزمة Google Play (AAB) وملف APK للتوزيع المباشر دون Android SDK ودون Gradle.
#
# متى يُستخدم: حين تكون خوادم Google للمطوّرين (dl.google.com) غير متاحة. إن كانت متاحة
# فاستخدم scripts/build-playstore.sh (بناء Gradle الكامل) فهو الطريق الرسمي.
#
# الفكرة: نأخذ APK بُني سابقاً بـ Gradle (فيه الكود المترجَم والموارد)، ونستبدل ملفات
# اللعبة داخله بآخر نسخة، ثم نحوّله إلى AAB بأدوات Google الرسمية الموجودة في bundletool
# (aapt2 و bundletool نفسه)، ونضبط رقم الإصدار من android/app/build.gradle.
# ملف APK الناتج يُولَّد من الحزمة نفسها بالطريقة التي يولّد بها متجر Play ملفاته.
#
# الاستخدام:
#   KEYSTORE_PASSWORD=... bash scripts/release/release-offline.sh <base.apk>
#
# حدود هذه الطريقة: تعديلات كود Java/Kotlin لا تدخل إلا ببناء Gradle كامل، لأن الكود
# المترجَم (classes.dex) يؤخذ كما هو من ملف APK الأساس.
set -euo pipefail
cd "$(dirname "$0")/../.."
ROOT="$(pwd)"
HERE="$ROOT/scripts/release"

BASE_APK="${1:?حدّد ملف APK الأساس المبني بـ Gradle}"
KS="${KEYSTORE_PATH:-$ROOT/android/abujanan-release.keystore}"
ALIAS="${KEY_ALIAS:-abujanan}"
: "${KEYSTORE_PASSWORD:?اضبط KEYSTORE_PASSWORD}"
KEYPASS="${KEY_PASSWORD:-$KEYSTORE_PASSWORD}"

CODE=$(grep -oP 'versionCode \K[0-9]+' android/app/build.gradle)
VER=$(grep -oP 'versionName "\K[^"]+' android/app/build.gradle)
BT_VER="1.18.1"
CACHE="$ROOT/.cache/release"; mkdir -p "$CACHE"
WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT
OUT="$ROOT/playstore/release"; mkdir -p "$OUT"

echo "▶ الإصدار $VER (versionCode $CODE)"

# 1) أدوات Google الرسمية: bundletool من صفحة إصداراته على GitHub، و aapt2 المحزوم داخله
BT="$CACHE/bundletool-all-$BT_VER.jar"
[ -f "$BT" ] || curl -fsSL -o "$BT" \
  "https://github.com/google/bundletool/releases/download/$BT_VER/bundletool-all-$BT_VER.jar"
AAPT2="$CACHE/aapt2"
[ -x "$AAPT2" ] || { unzip -o -q -j "$BT" linux/aapt2 -d "$CACHE"; chmod +x "$AAPT2"; }
javac -nowarn -cp "$BT" -d "$CACHE" "$HERE/PatchManifest.java" "$HERE/VerifyApk.java" 2>/dev/null

# 2) آخر نسخة من ملفات اللعبة، ونسخها إلى مشروع أندرويد أيضاً ليبقى متطابقاً
npm run -s build:www
npx cap sync android >/dev/null

# 3) استبدال ملفات اللعبة داخل APK الأساس
python3 "$HERE/repack.py" "$BASE_APK" www "$WORK/fresh.apk"

# 4) تحويل الموارد إلى صيغة proto وضبط رقم الإصدار
"$AAPT2" convert --output-format proto -o "$WORK/proto.apk" "$WORK/fresh.apk"
unzip -o -q "$WORK/proto.apk" AndroidManifest.xml -d "$WORK/mf"
java -cp "$BT:$CACHE" PatchManifest "$WORK/mf/AndroidManifest.xml" "$CODE" "$VER"

# 5) بناء الحزمة وتوقيعها بمفتاح الرفع
python3 "$HERE/module.py" "$WORK/proto.apk" "$WORK/mf/AndroidManifest.xml" "$WORK/base.zip"
AAB="$OUT/AbuJanan-Games-$VER-PlayStore.aab"
rm -f "$AAB"
java -jar "$BT" build-bundle --modules="$WORK/base.zip" --config="$HERE/BundleConfig.json" --output="$AAB"
jarsigner -sigalg SHA256withRSA -digestalg SHA-256 -keystore "$KS" \
  -storepass "$KEYSTORE_PASSWORD" -keypass "$KEYPASS" "$AAB" "$ALIAS" >/dev/null
VERIFY="$(jarsigner -verify "$AAB" 2>&1)"
grep -q "jar verified" <<<"$VERIFY" || { echo "✘ توقيع الحزمة غير صالح"; exit 1; }
java -jar "$BT" validate --bundle="$AAB" >/dev/null

# 6) ملف APK للتوزيع المباشر، مولَّد من الحزمة كما يولّده متجر Play
java -jar "$BT" build-apks --bundle="$AAB" --mode=universal --output="$WORK/u.apks" --aapt2="$AAPT2" \
  --ks="$KS" --ks-pass="pass:$KEYSTORE_PASSWORD" --ks-key-alias="$ALIAS" --key-pass="pass:$KEYPASS"
unzip -o -q "$WORK/u.apks" universal.apk -d "$WORK"
APK="$OUT/AbuJanan-Games-$VER.apk"
cp "$WORK/universal.apk" "$APK"

# 7) فحوص نهائية: الإصدار، ومحتوى اللعبة، والتوقيع
# نحفظ الناتج أولاً: grep -q يغلق الأنبوب مبكراً فيعدّه pipefail فشلاً
BADGING="$("$AAPT2" dump badging "$APK")"
grep -q "versionCode='$CODE' versionName='$VER'" <<<"$BADGING" \
  || { echo "✘ رقم الإصدار داخل APK لا يطابق $VER ($CODE)"; exit 1; }
echo "✔ $(head -1 <<<"$BADGING" | grep -oE "name='[^']+' versionCode='[^']+' versionName='[^']+'")"
bash scripts/verify-bundle.sh "$APK"
java -cp "$BT:$CACHE" VerifyApk "$APK"

echo
echo "✔ جاهز:"
ls -la "$AAB" "$APK"
