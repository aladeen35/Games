#!/usr/bin/env bash
# يتأكد أن ما بداخل التطبيق هو فعلاً آخر نسخة من اللعبة.
# سبب وجوده: تشغيل «npx cap sync» وحده ينسخ مجلد www القديم، فيخرج تطبيق
# بلا الميزات الجديدة رغم أن الكود محدّث — وهذا ما حصل في الإصدار 1.4.0.
set -e
cd "$(dirname "$0")/.."

fail() { echo "✘ $1" >&2; exit 1; }

SRC="index.html"
WWW="www/index.html"
BUNDLE="android/app/src/main/assets/public/index.html"

[ -f "$WWW" ] || fail "مجلد www غير موجود — شغّل: npm run build:www"
cmp -s "$SRC" "$WWW" || fail "www/index.html لا يطابق index.html — شغّل: npm run build:www"

if [ -f "$BUNDLE" ]; then
  cmp -s "$SRC" "$BUNDLE" \
    || fail "نسخة أندرويد المحزومة قديمة — شغّل: npm run sync"
fi

# فحص أخير على ملف APK نفسه إن مُرّر مساره
if [ -n "$1" ]; then
  [ -f "$1" ] || fail "ملف APK غير موجود: $1"
  TMP="$(mktemp -d)"
  unzip -p "$1" assets/public/index.html > "$TMP/apk-index.html" 2>/dev/null \
    || fail "تعذّر قراءة index.html من داخل $1"
  cmp -s "$SRC" "$TMP/apk-index.html" \
    || fail "ملف APK يحتوي نسخة قديمة من اللعبة — أعد: npm run apk"
  rm -rf "$TMP"
  echo "✔ ملف APK يحتوي آخر نسخة من اللعبة"
fi

echo "✔ الملفات المحزومة مطابقة لآخر نسخة"
