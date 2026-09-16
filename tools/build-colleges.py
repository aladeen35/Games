#!/usr/bin/env python3
"""
يحوّل جدول دليل القبول (CSV أو Excel) إلى ملف natija/data/colleges.json.

    python3 tools/build-colleges.py <ملف.csv|ملف.xlsx> natija/data/colleges.json \
        --source "دليل القبول للجامعات السودانية 2024" --year 2024

الأعمدة المطلوبة في الجدول (بالعربية، ويقبل أي ترتيب):
    الجامعة | الكلية | النوع | الولاية | المجموعة | التخصصات | نسبة القبول | المصاريف

  النوع      : حكومية أو أهلية
  التخصصات   : تخصص واحد أو أكثر مفصولة بـ + أو ، مثل: هندسية + أحياء
               القيم المعتمدة: أحياء، هندسية، حاسوب، دراسات إسلامية، أدب إنجليزي، فنون وتصميم
  نسبة القبول: رقم عشري مثل 86.5
  المصاريف   : رقم بالجنيه للكليات الأهلية، ويُترك فارغاً للحكومية
"""
import sys, os, re, json, csv, argparse, zipfile

VALID_SPECS = {"أحياء", "هندسية", "حاسوب", "دراسات إسلامية", "أدب إنجليزي", "فنون وتصميم"}

HEADERS = {
    "uni":    ["الجامعة", "اسم الجامعة", "المؤسسة"],
    "name":   ["الكلية", "اسم الكلية", "البرنامج", "التخصص المطلوب"],
    "sector": ["النوع", "القطاع", "نوع الجامعة"],
    "state":  ["الولاية", "الموقع"],
    "group":  ["المجموعة", "المجموعة المؤهلة"],
    "specs":  ["التخصصات", "التخصص", "المواد المؤهلة"],
    "min":    ["نسبة القبول", "النسبة", "الحد الأدنى"],
    "fees":   ["المصاريف", "الرسوم", "الرسوم الدراسية"],
}


def norm(s):
    return re.sub(r"\s+", " ", str(s or "").strip())


def read_rows(path):
    """يقرأ CSV أو xlsx ويُرجع قائمة قواميس بعناوين الأعمدة."""
    if path.lower().endswith((".xlsx", ".xlsm")):
        z = zipfile.ZipFile(path)
        shared = ["".join(re.findall(r"<t[^>]*>(.*?)</t>", si, re.S))
                  for si in re.findall(r"<si>(.*?)</si>",
                                       z.read("xl/sharedStrings.xml").decode("utf-8"), re.S)] \
            if "xl/sharedStrings.xml" in z.namelist() else []
        raw = z.read("xl/worksheets/sheet1.xml").decode("utf-8")
        out = []
        for m in re.finditer(r'<row[^>]*>(.*?)</row>', raw, re.S):
            cells = {}
            for cm in re.finditer(r'<c r="([A-Z]+)\d+"([^>]*)>(?:<v>(.*?)</v>|<is><t[^>]*>(.*?)</t></is>)?</c>',
                                  m.group(1)):
                v = cm.group(3) if cm.group(3) is not None else cm.group(4)
                if v is None:
                    continue
                cells[cm.group(1)] = shared[int(v)] if 't="s"' in cm.group(2) else v
            out.append(cells)
        if not out:
            return []
        cols = sorted({k for r in out for k in r}, key=lambda c: (len(c), c))
        head = [norm(out[0].get(c)) for c in cols]
        return [dict(zip(head, [norm(r.get(c)) for c in cols])) for r in out[1:]]

    with open(path, encoding="utf-8-sig", newline="") as f:
        return [{norm(k): norm(v) for k, v in row.items()} for row in csv.DictReader(f)]


def pick(row, key):
    for h in HEADERS[key]:
        for k in row:
            if norm(k) == h:
                return row[k]
    return ""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--source", default="دليل القبول للجامعات السودانية")
    ap.add_argument("--year", type=int, default=0)
    a = ap.parse_args()

    colleges, problems = [], []
    for i, row in enumerate(read_rows(a.src), start=2):
        name = pick(row, "name")
        if not name:
            continue
        specs = [s for s in re.split(r"[+،,/]", pick(row, "specs")) if norm(s)]
        specs = [norm(s) for s in specs]
        bad = [s for s in specs if s not in VALID_SPECS]
        if bad:
            problems.append("سطر %d: تخصص غير معروف %s" % (i, bad))
        try:
            mn = float(re.sub(r"[^\d.]", "", pick(row, "min")))
        except ValueError:
            problems.append("سطر %d: نسبة قبول غير صالحة لـ «%s»" % (i, name))
            continue
        fees_raw = re.sub(r"[^\d.]", "", pick(row, "fees"))
        sector = pick(row, "sector") or "حكومية"
        colleges.append({
            "id": len(colleges) + 1,
            "uni": pick(row, "uni"),
            "name": name,
            "sector": sector,
            "state": pick(row, "state"),
            "group": pick(row, "group"),
            "specs": [s for s in specs if s in VALID_SPECS],
            "min": mn,
            "fees": float(fees_raw) if fees_raw and sector == "أهلية" else None,
        })

    db = {"source": a.source, "sample": False, "currency": "جنيه سوداني", "colleges": colleges}
    if a.year:
        db["year"] = a.year
    with open(a.dst, "w", encoding="utf-8") as f:
        json.dump(db, f, ensure_ascii=False, indent=1)

    print("كليات: %d → %s" % (len(colleges), a.dst))
    if problems:
        print("\nتنبيهات (%d):" % len(problems))
        for p in problems[:40]:
            print(" -", p)


if __name__ == "__main__":
    main()
