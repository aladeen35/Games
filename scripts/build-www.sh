#!/usr/bin/env bash
# يجمع ملفات التطبيق (الرئيسية + كل الألعاب) في مجلد www ليحزمها Capacitor داخل APK
set -e
cd "$(dirname "$0")/.."
rm -rf www && mkdir -p www
cp index.html manifest.webmanifest www/
cp -r icons shared games www/
# داخل التطبيق الأصلي لا حاجة لملفات المصدر/القوالب/الوثائق
find www -name "README.md" -delete
rm -rf www/games/bell/src
echo "www ready: $(du -sh www | cut -f1)"
