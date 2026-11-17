#!/usr/bin/env python3
"""إزالة خلفية بلون واحد (مثل الكحلي) من صورة شخصية وإخراج PNG شفاف.

الاستخدام: python3 tools/cutout.py in.png out.png [--tol 30]
يزيل فقط الخلفية المتصلة بحواف الصورة، فلا تتأثر المناطق الداكنة داخل الشخصية.
"""
import argparse
import numpy as np
from PIL import Image
from scipy import ndimage


def main():
    p = argparse.ArgumentParser()
    p.add_argument('src'); p.add_argument('dst')
    p.add_argument('--tol', type=float, default=30, help='تسامح لون الخلفية')
    a = p.parse_args()
    im = Image.open(a.src).convert('RGB')
    px = np.asarray(im).astype(np.float32)
    h, w, _ = px.shape
    # لون الخلفية: وسيط حواف الصورة
    border = np.concatenate([px[0], px[-1], px[:, 0], px[:, -1]])
    bg = np.median(border, axis=0)
    dist = np.sqrt(((px - bg) ** 2).sum(axis=2))
    near = dist < a.tol * 1.6
    labels, _ = ndimage.label(near)
    edge_labels = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    bgmask = np.isin(labels, edge_labels[edge_labels != 0])
    # حافة ناعمة: شفافية تدريجية حسب بعد اللون عن الخلفية داخل منطقة الخلفية الموسعة
    soft = ndimage.binary_dilation(bgmask, iterations=2)
    alpha = np.ones((h, w), dtype=np.float32)
    t = np.clip((dist - a.tol * 0.6) / (a.tol * 1.0), 0, 1)
    alpha[soft] = t[soft]
    alpha[bgmask & (dist < a.tol * 0.6)] = 0
    out = np.dstack([px, alpha[..., None] * 255]).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(a.dst)
    kept = (alpha > 0.5).mean() * 100
    print(f'✓ {a.dst}: الخلفية {tuple(int(v) for v in bg)} · بقي {kept:.0f}% من الصورة')


if __name__ == '__main__':
    main()
