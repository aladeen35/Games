#!/usr/bin/env bash
# يجمع ملفات اللعبة داخل desktop/app لتحزمها Electron
set -e
cd "$(dirname "$0")/.."
rm -rf desktop/app && mkdir -p desktop/app
cp index.html manifest.webmanifest sw.js desktop/app/
cp -r assets desktop/app/
echo "desktop/app ready: $(du -sh desktop/app | cut -f1)"
