"""يعيد بناء ملف APK بعد استبدال ملفات اللعبة (assets/public) بآخر نسخة.
يحافظ على نوع الضغط لكل ملف وعلى محاذاة 4 بايت للملفات غير المضغوطة،
لأن أندرويد 11 فما فوق يشترط أن يكون resources.arsc غير مضغوط ومحاذى."""
import os, struct, sys, zipfile, binascii, zlib

SRC_APK, WWW, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
ALIGN = 4
src = zipfile.ZipFile(SRC_APK)

newfiles = {}
for root, _, files in os.walk(WWW):
    for f in files:
        p = os.path.join(root, f)
        rel = 'assets/public/' + os.path.relpath(p, WWW).replace(os.sep, '/')
        newfiles[rel] = open(p, 'rb').read()

entries, seen = [], set()
for i in src.infolist():
    base = i.filename.split('/')[-1].upper()
    if i.filename.startswith('META-INF/') and (base.endswith(('.SF', '.RSA', '.DSA', '.EC')) or base == 'MANIFEST.MF'):
        continue                                     # توقيعات قديمة تُحذف
    if i.filename.startswith('assets/public/'):
        if i.filename in newfiles:
            data = newfiles[i.filename]; seen.add(i.filename)
        else:
            data = src.read(i)                       # ملفات يولّدها Capacitor (cordova.js)
    else:
        data = src.read(i)
    entries.append((i.filename, data, i.compress_type))
for name, data in newfiles.items():
    if name not in seen:
        entries.append((name, data, zipfile.ZIP_DEFLATED))

out = open(OUT, 'wb'); central = []
for name, data, ctype in entries:
    nb = name.encode('utf-8'); crc = binascii.crc32(data) & 0xffffffff
    if ctype == zipfile.ZIP_DEFLATED:
        co = zlib.compressobj(9, zlib.DEFLATED, -15)
        blob = co.compress(data) + co.flush(); extra = b''
    else:
        blob = data
        pad = (ALIGN - ((out.tell() + 30 + len(nb)) % ALIGN)) % ALIGN
        extra = b'\x00' * pad
    hdr_off = out.tell()
    out.write(struct.pack('<IHHHHHIIIHH', 0x04034b50, 20, 0, ctype, 0, 0,
                          crc, len(blob), len(data), len(nb), len(extra)))
    out.write(nb); out.write(extra); out.write(blob)
    central.append((nb, ctype, crc, len(blob), len(data), extra, hdr_off))

cd_off = out.tell()
for nb, ctype, crc, csize, usize, extra, hdr_off in central:
    out.write(struct.pack('<IHHHHHHIIIHHHHHII', 0x02014b50, 20, 20, 0, ctype, 0, 0,
                          crc, csize, usize, len(nb), len(extra), 0, 0, 0, 0, hdr_off))
    out.write(nb); out.write(extra)
out.write(struct.pack('<IHHHHIIH', 0x06054b50, 0, 0, len(central), len(central),
                      out.tell() - cd_off, cd_off, 0))
out.close()

z = zipfile.ZipFile(OUT)
assert z.testzip() is None, 'zip تالف'
bad = [i.filename for i in z.infolist() if i.compress_type == 0 and
       (i.header_offset + 30 + len(i.filename.encode()) + len(i.extra)) % ALIGN]
old = {i.filename for i in src.infolist() if not (i.filename.startswith('META-INF/') and
      (i.filename.split('/')[-1].upper().endswith(('.SF','.RSA','.DSA','.EC')) or i.filename.endswith('MANIFEST.MF')))}
new = {i.filename for i in z.infolist()}
print('مُدخلات:', len(z.infolist()), '| غير محاذاة:', len(bad),
      '| محذوف:', sorted(old-new) or 'لا شيء', '| مضاف:', sorted(new-old) or 'لا شيء')
print('resources.arsc غير مضغوط:', all(i.compress_type==0 for i in z.infolist() if i.filename=='resources.arsc'))
