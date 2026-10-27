#!/usr/bin/env bash
# تنزيل أدوات البناء الكبيرة مرة واحدة (لا تُحفظ في المستودع):
#   android-36.jar  ← منصة Android 16 (API 36) للترجمة وربط الموارد، مطلوبة لـ Google Play (targetSdk 36)
#   bundletool.jar  ← أداة Google الرسمية لبناء ملف AAB للرفع على Google Play
set -euo pipefail
T="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/android/tools/sdk"
mkdir -p "$T"
if [ ! -f "$T/android-36.jar" ]; then
  tmp="$(mktemp -d)"
  git clone -q --depth 1 --filter=blob:none --sparse https://github.com/Sable/android-platforms "$tmp/p"
  ( cd "$tmp/p" && git sparse-checkout set android-36 )
  cp "$tmp/p/android-36/android.jar" "$T/android-36.jar"; rm -rf "$tmp"
fi
[ -f "$T/bundletool.jar" ] || curl -sSL -o "$T/bundletool.jar" https://github.com/google/bundletool/releases/download/1.17.2/bundletool-all-1.17.2.jar
ls -la "$T"
