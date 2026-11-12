import sys, os
from PIL import Image, ImageDraw
src, AND = sys.argv[1], sys.argv[2]
NAVY = (0x14, 0x23, 0x4b, 255)
logo = Image.open(src).convert("RGBA")
S = 1024
logo = logo.resize((S, S), Image.LANCZOS)

def rounded(img, radius_frac):
    w = img.size[0]
    m = Image.new("L", (w * 2, w * 2), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, w * 2 - 1, w * 2 - 1], radius=int(w * 2 * radius_frac), fill=255)
    m = m.resize((w, w), Image.LANCZOS)
    out = img.copy(); out.putalpha(m); return out

def circle(img):
    w = img.size[0]
    m = Image.new("L", (w * 2, w * 2), 0)
    ImageDraw.Draw(m).ellipse([0, 0, w * 2 - 1, w * 2 - 1], fill=255)
    m = m.resize((w, w), Image.LANCZOS)
    out = img.copy(); out.putalpha(m); return out

def padded(scale, bg, radius=0.12):
    """logo scaled to `scale` of a 1024 canvas, centred on bg."""
    c = Image.new("RGBA", (S, S), bg)
    n = int(S * scale)
    l = rounded(logo.resize((n, n), Image.LANCZOS), radius)
    c.alpha_composite(l, ((S - n) // 2, (S - n) // 2))
    return c

legacy = rounded(logo, 0.18)                       # square launcher icon (pre-O)
round_ = circle(padded(0.69, NAVY, 0.10))          # round launcher icon (API 25): whole logo inside a navy disc
fg = padded(66 / 108.0, (0, 0, 0, 0), 0.16)        # adaptive foreground: logo inside the 66dp safe zone
dens = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}
for d, k in dens.items():
    p = os.path.join(AND, "res", "mipmap-" + d); os.makedirs(p, exist_ok=True)
    a, f = int(48 * k), int(108 * k)
    legacy.resize((a, a), Image.LANCZOS).save(os.path.join(p, "ic_launcher.png"), optimize=True)
    round_.resize((a, a), Image.LANCZOS).save(os.path.join(p, "ic_launcher_round.png"), optimize=True)
    fg.resize((f, f), Image.LANCZOS).save(os.path.join(p, "ic_launcher_foreground.png"), optimize=True)

p = os.path.join(AND, "res", "drawable-nodpi"); os.makedirs(p, exist_ok=True)
rounded(logo, 0.12).resize((360, 360), Image.LANCZOS).convert("RGBA").save(os.path.join(p, "splash_logo.png"), optimize=True)

w = os.path.join(AND, "web-icons"); os.makedirs(w, exist_ok=True)
rgb = logo.convert("RGB")
rgb.resize((192, 192), Image.LANCZOS).save(os.path.join(w, "icon-192.png"), optimize=True)
rgb.resize((512, 512), Image.LANCZOS).save(os.path.join(w, "icon-512.png"), optimize=True)
# maskable: content inside the central 80% safe circle
padded(0.72, NAVY, 0.14).convert("RGB").resize((512, 512), Image.LANCZOS).save(os.path.join(w, "icon-maskable-512.png"), optimize=True)
q = 86
while True:
    out = os.path.join(w, "logo-512.webp")
    rgb.resize((512, 512), Image.LANCZOS).save(out, "WEBP", quality=q, method=6)
    if os.path.getsize(out) <= 120 * 1024 or q <= 40: break
    q -= 6
print("webp quality", q, os.path.getsize(out))
