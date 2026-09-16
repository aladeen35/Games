#!/usr/bin/env python3
"""
يحوّل كشف نتائج الشهادة الثانوية (xlsx) إلى ملف بيانات مضغوط للموقع.

    python3 tools/build-students.py <ملف.xlsx> natija/data/students.json

صيغة الملف الناتج (مضغوطة لتقليل الحجم):
  C: أسماء المواد
  T: مفردات الأسماء (كل اسم يتكرّر مرة واحدة)
  S: أسماء المدارس
  R: سجل لكل طالب  "رقم~أسماء~مدرسة~نوع~حالة~مواد~درجات"
     الأسماء والمدرسة والمواد مخزّنة كأرقام بالنظام 36.
"""
import sys, re, json, zipfile, collections

SUBJECT_COLS = [
    ("H", "اللغة العربية"), ("I", "اللغة الإنجليزية"), ("J", "التربية الإسلامية"),
    ("K", "التربية المسيحية"), ("L", "الرياضيات المتخصصة"), ("M", "الفيزياء"),
    ("N", "الكيمياء"), ("O", "الأحياء"), ("P", "العلوم الهندسية"),
    ("Q", "علوم الحاسوب"), ("R", "العلوم الأسرية"), ("S", "الرياضيات الأساسية"),
    ("T", "الجغرافيا"), ("U", "التاريخ"), ("V", "الدراسات الإسلامية"),
    ("W", "الأدب الإنجليزي"), ("X", "اللغة الفرنسية"), ("Y", "الفنون والتصميم"),
]
B36 = "0123456789abcdefghijklmnopqrstuvwxyz"


def to36(n):
    if n == 0:
        return "0"
    out = ""
    while n:
        out = B36[n % 36] + out
        n //= 36
    return out


def clean(s):
    return re.sub(r"\s+", " ", (s or "").strip())


def read_sheet(path):
    z = zipfile.ZipFile(path)
    shared = [
        "".join(re.findall(r"<t[^>]*>(.*?)</t>", si, re.S))
        for si in re.findall(r"<si>(.*?)</si>", z.read("xl/sharedStrings.xml").decode("utf-8"), re.S)
    ]
    raw = z.read("xl/worksheets/sheet1.xml").decode("utf-8")
    row_re = re.compile(r'<row r="(\d+)"[^>]*>(.*?)</row>', re.S)
    cell_re = re.compile(r'<c r="([A-Z]+)\d+"([^>]*)>(?:<v>(.*?)</v>)?</c>')
    for m in row_re.finditer(raw):
        if m.group(1) == "1":
            continue
        cells = {}
        for cm in cell_re.finditer(m.group(2)):
            v = cm.group(3)
            if v is None:
                continue
            cells[cm.group(1)] = shared[int(v)] if 't="s"' in cm.group(2) else v
        yield cells


def main(src, dst):
    names, schools = {}, {}
    rows, stats = [], collections.Counter()

    def name_id(tok):
        if tok not in names:
            names[tok] = len(names)
        return names[tok]

    def school_id(tok):
        if tok not in schools:
            schools[tok] = len(schools)
        return schools[tok]

    for c in read_sheet(src):
        seat = clean(c.get("C"))
        if not seat.isdigit():
            continue
        parts = [clean(c.get(k)) for k in "DEFG"]
        parts = [p for p in parts if p]
        idx, marks = "", []
        for col, _ in SUBJECT_COLS:
            v = clean(c.get(col))
            if v == "":
                continue
            idx += to36(next(i for i, (cc, _) in enumerate(SUBJECT_COLS) if cc == col))
            marks.append(re.sub(r"\.0+$", "", v))
        sex = "1" if clean(c.get("Z")) == "1" else "0"   # 1 = طالبة، 0 = طالب
        status = clean(c.get("AB")) or "?"
        rows.append("~".join([
            seat,
            ".".join(to36(name_id(p)) for p in parts),
            to36(school_id(clean(c.get("B")))),
            sex,
            status,
            idx,
            ",".join(marks),
        ]))
        stats[status] += 1

    db = {
        "C": [n for _, n in SUBJECT_COLS],
        "T": list(names.keys()),
        "S": list(schools.keys()),
        "R": rows,
    }
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, separators=(",", ":"))
    print("طلاب:", len(rows), "| مدارس:", len(schools), "| مفردات أسماء:", len(names))
    print("الحالات:", dict(stats))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
