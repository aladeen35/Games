#!/usr/bin/env python3
"""
يستخرج بيانات القبول من صفحة «نتيجة القبول للجامعات» ويبني natija/data/colleges.json.

    python3 tools/build-qabool.py nataij-alqabool-2024.html natija/data/colleges.json

الصفحة تحمل مصفوفة DATA فيها لكل قسم: الجامعات/الولايات، ولكل جامعة صفوف
[اسم التخصص، نسبة القبول، درجة المفاضلة].
التخصص المؤهِّل غير موجود في الملف، فيُستنتج من اسم البرنامج عبر tools/classify.py.
"""
import sys, os, re, json

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from classify import specs_for   # noqa: E402

SECTION_LABELS = [
    "السودانية – بكالريوس",
    "السودانية – ولائي",
    "السعودية",
    "الإمارات",
    "عُمان",
    "بقية الدول",
    "الشهادات الأجنبية",
]


def main(src, dst):
    html = open(src, encoding="utf-8").read()
    m = re.search(r"const DATA = (\[.*?\]);\s*\n", html, re.S)
    if not m:
        raise SystemExit("لم يُعثر على بيانات DATA في الصفحة.")
    data = json.loads(m.group(1))

    unis, uni_id = [], {}
    sections, colleges = [], []

    for i, sec in enumerate(data):
        label = SECTION_LABELS[i] if i < len(SECTION_LABELS) else sec.get("t", "قسم %d" % i)
        # قسم الولائي مجموعته ولايات لا جامعات
        by_state = "ولائي" in label
        sections.append({"id": i, "label": label, "title": sec.get("t", ""),
                         "kind": sec.get("k", ""), "byState": by_state})
        for u in sec["u"]:
            name = u["n"].strip()
            if name not in uni_id:
                uni_id[name] = len(unis)
                unis.append(name)
            for r in u["r"]:
                prog = re.sub(r"\s+", " ", str(r[0])).strip()
                # في قسم الولائي يكون اسم الجامعة ملحقاً باسم البرنامج: «… ولائي - جامعة كذا»
                at = ""
                if by_state:
                    parts = prog.split(" ولائي - ")
                    if len(parts) == 2:
                        prog, at = parts[0].strip(), parts[1].strip()
                specs, matched = specs_for(prog)
                colleges.append({
                    "id": len(colleges) + 1,
                    "sec": i,
                    "u": uni_id[name],
                    "at": at,
                    "n": prog,
                    "p": round(float(r[1]), 1),
                    "c": int(r[2]) if r[2] else 0,
                    "s": specs,
                    "g": 1 if matched else 0,
                })

    db = {
        "source": "ملف نتيجة القبول للجامعات للعام 2024م الصادر عن إدارة القبول",
        "year": 2024,
        "sample": False,
        "specsInferred": True,
        "fields": {
            "sec": "رقم القسم", "u": "رقم الجامعة أو الولاية", "n": "اسم التخصص",
            "p": "نسبة القبول", "c": "درجة المفاضلة (0 = لا توجد)",
            "s": "التخصصات المؤهِّلة", "g": "1 إذا طابقت قاعدة تصنيف معروفة",
            "at": "الجامعة المضيفة في قسم الولائي (فارغ في غيره)",
        },
        "sections": sections,
        "unis": unis,
        "colleges": colleges,
    }
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, separators=(",", ":"))

    print("أقسام: %d | جامعات وولايات: %d | تخصصات: %d" % (len(sections), len(unis), len(colleges)))
    print("بحجم %.0f كيلوبايت" % (os.path.getsize(dst) / 1024))
    for s in sections:
        n = sum(1 for c in colleges if c["sec"] == s["id"])
        print("  - %s: %d" % (s["label"], n))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
