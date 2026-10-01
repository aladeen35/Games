"""يحوّل APK بصيغة proto (ناتج aapt2 convert) إلى وحدة base.zip بالتخطيط الذي يطلبه bundletool:
manifest/ و dex/ و res/ و assets/ و root/ و resources.pb."""
import sys, zipfile
SRC, MANIFEST, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
SIG = ('.SF', '.RSA', '.DSA', '.EC')
src = zipfile.ZipFile(SRC)
out = zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED)
counts = {}
for i in src.infolist():
    n = i.filename
    if n.endswith('/'):
        continue
    base = n.split('/')[-1].upper()
    if n.startswith('META-INF/') and (base.endswith(SIG) or base == 'MANIFEST.MF'):
        continue                                    # التوقيعات القديمة لا تدخل الحزمة
    if n == 'AndroidManifest.xml':
        dst, data = 'manifest/AndroidManifest.xml', open(MANIFEST, 'rb').read()
    elif n == 'resources.pb':
        dst, data = n, src.read(i)
    elif n.endswith('.dex') and '/' not in n:
        dst, data = 'dex/' + n, src.read(i)
    elif n.startswith(('res/', 'assets/')):
        dst, data = n, src.read(i)
    else:
        dst, data = 'root/' + n, src.read(i)        # META-INF/*.version و kotlin/ وغيرها
    out.writestr(dst, data)
    counts[dst.split('/')[0]] = counts.get(dst.split('/')[0], 0) + 1
out.close()
print('الوحدة:', counts)
