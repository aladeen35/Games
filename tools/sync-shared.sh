#!/usr/bin/env bash
# ينسخ نظام التصميم المشترك داخل مجلد الموقع ليصبح مجلد natija/ قابلاً للرفع
# إلى Netlify كما هو، بلا اعتماد على أي ملف خارجه.
#
#   bash tools/sync-shared.sh
#
# المصدر الوحيد للتصميم يبقى shared/ في جذر المستودع — عدّل هناك ثم شغّل هذا الأمر.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf natija/shared
mkdir -p natija/shared
cp -r shared/. natija/shared/
echo "تمت مزامنة natija/shared من shared/ ($(du -sh natija/shared | cut -f1))"
