#!/usr/bin/env bash
# فحص وقائي: يتحقق أن كل معرّفات UUID في كود أندرويد صالحة
# (معرّف غير صالح يُسقط التطبيق فور فتحه لأنه يُنفَّذ عند تحميل الكلاس)
set -e
cd "$(dirname "$0")/.."
ok=1
while IFS= read -r u; do
  if [[ ! "$u" =~ ^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$ ]]; then
    echo "❌ معرّف UUID غير صالح: $u"
    ok=0
  else
    echo "✓ UUID صالح: $u"
  fi
done < <(grep -rho 'UUID\.fromString("[^"]*")' android/app/src/main/java | sed 's/.*"\(.*\)".*/\1/')
[ "$ok" = "1" ] || { echo "أوقفت البناء بسبب معرّف غير صالح"; exit 1; }
echo "فحص كود أندرويد: سليم"
