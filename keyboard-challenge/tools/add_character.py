#!/usr/bin/env python3
"""إضافة شخصية جديدة للعبة من 5 صور شفافة (PNG/WebP).

الاستخدام:
  python3 tools/add_character.py <id> "<الاسم>" --run a.png --error b.png --near c.png --won d.png --lost e.png [--gender f]

ينتج في public/characters/<id>/:
  <pose>.webp       الصورة الكاملة (بالشارة) للمدرب وشاشة النتيجة
  lane-<pose>.webp  الجسم فقط بدون الشارة للمضمار
  thumb.webp        صورة مصغرة لاختيار الشخصية
ثم يحدّث public/characters/characters.json.
يمكن تمرير أكثر من صورة للوضعية الواحدة (حتى 3) لعمل حركة: --run r1.png r2.png r3.png
"""
import argparse, json, os
from PIL import Image

POSES = ['run', 'error', 'near', 'won', 'lost']
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'characters')
FULL_H, LANE_H, THUMB = 640, 150, 220
BADGE_CUT = 0.84   # الشارة في أسفل الصورة: نحتفظ بالجزء العلوي للمضمار


def trim(im):
    a = im.getchannel('A').point(lambda v: 255 if v > 24 else 0)
    box = a.getbbox()
    return im.crop(box) if box else im


def fit_h(im, h):
    return im.resize((max(1, round(im.width * h / im.height)), h), Image.LANCZOS)


def main():
    p = argparse.ArgumentParser()
    p.add_argument('id')
    p.add_argument('name')
    p.add_argument('--gender', default='m', choices=['m', 'f'])
    for pose in POSES:
        p.add_argument(f'--{pose}', nargs='+', required=True)
    args = p.parse_args()

    out = os.path.join(ROOT, args.id)
    os.makedirs(out, exist_ok=True)
    entry = {'id': args.id, 'name': args.name, 'gender': args.gender, 'poses': {}, 'lane': {}, 'thumb': f'{args.id}/thumb.webp'}
    for pose in POSES:
        fulls, lanes = [], []
        for i, src in enumerate(getattr(args, pose)[:3], start=1):
            im = trim(Image.open(src).convert('RGBA'))
            suffix = '' if i == 1 else f'-{i}'
            fit_h(im, FULL_H).save(os.path.join(out, f'{pose}{suffix}.webp'), quality=82, method=6)
            body = trim(im.crop((0, 0, im.width, round(im.height * BADGE_CUT))))
            fit_h(body, LANE_H).save(os.path.join(out, f'lane-{pose}{suffix}.webp'), quality=82, method=6)
            fulls.append(f'{args.id}/{pose}{suffix}.webp')
            lanes.append(f'{args.id}/lane-{pose}{suffix}.webp')
            if pose == 'run' and i == 1:
                head = body.crop((0, 0, body.width, min(body.height, body.width)))
                s = max(head.size)
                sq = Image.new('RGBA', (s, s), (0, 0, 0, 0))
                sq.paste(head, ((s - head.width) // 2, 0))
                sq.resize((THUMB, THUMB), Image.LANCZOS).save(os.path.join(out, 'thumb.webp'), quality=82)
        entry['poses'][pose] = fulls
        entry['lane'][pose] = lanes

    reg_path = os.path.join(ROOT, 'characters.json')
    reg = {'characters': []}
    if os.path.exists(reg_path):
        with open(reg_path, encoding='utf-8') as f:
            reg = json.load(f)
    reg['characters'] = [c for c in reg['characters'] if c['id'] != args.id] + [entry]
    with open(reg_path, 'w', encoding='utf-8') as f:
        json.dump(reg, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f'✓ {args.name} ({args.id}) — {len(reg["characters"])} شخصية في السجل')


if __name__ == '__main__':
    main()
