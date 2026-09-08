#!/usr/bin/env bash
# يجمع ملفات اللعبة في مجلد www ليحزمها Capacitor داخل التطبيق
set -e
cd "$(dirname "$0")/.."
rm -rf www && mkdir -p www
cp index.html manifest.webmanifest www/
cp -r assets www/
# داخل التطبيق الأصلي لا حاجة لـ service worker (الملفات محزومة أصلاً)
sed -i "s|<script src=\"sw-register.js\"></script>||" www/index.html 2>/dev/null || true
echo "www ready: $(du -sh www | cut -f1)"
