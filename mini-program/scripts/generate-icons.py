#!/usr/bin/env python3
"""Generate TabBar and in-app UI icons for the mini-program."""
from pathlib import Path

try:
    from PIL import Image, ImageDraw
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pillow', '-q'])
    from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent / 'src' / 'assets' / 'icons'
TAB_DIR = ROOT
UI_DIR = ROOT / 'ui'
TAB_DIR.mkdir(parents=True, exist_ok=True)
UI_DIR.mkdir(parents=True, exist_ok=True)

GRAY = '#999999'
ACTIVE = '#667eea'
WHITE = '#FFFFFF'
GREEN = '#07C160'


def hex_rgb(color: str) -> tuple[int, int, int]:
    c = color.lstrip('#')
    return tuple(int(c[i:i + 2], 16) for i in (0, 2, 4))


def new_canvas(size: int, transparent=True):
    mode = 'RGBA' if transparent else 'RGB'
    return Image.new(mode, (size, size), (0, 0, 0, 0) if transparent else (255, 255, 255))


def save(img: Image.Image, path: Path):
    img.save(path, 'PNG')
    print('  ✓', path.relative_to(ROOT.parent.parent.parent))


def draw_home(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    m = size * 0.18
    roof = [(size * 0.5, m), (size - m, size * 0.42), (m, size * 0.42)]
    d.polygon(roof, fill=c)
    body = (size * 0.24, size * 0.4, size * 0.76, size * 0.82)
    d.rounded_rectangle(body, radius=size * 0.06, fill=c)
    door = (size * 0.42, size * 0.55, size * 0.58, size * 0.82)
    d.rounded_rectangle(door, radius=size * 0.04, fill=(255, 255, 255, 255) if color != WHITE else (*hex_rgb(GRAY), 255))


def draw_cart(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    w = size * 0.08
    d.rounded_rectangle((size * 0.18, size * 0.28, size * 0.72, size * 0.36), radius=w, fill=c)
    d.rounded_rectangle((size * 0.22, size * 0.34, size * 0.78, size * 0.72), radius=size * 0.08, outline=c, width=max(2, int(w)))
    d.ellipse((size * 0.28, size * 0.74, size * 0.4, size * 0.86), fill=c)
    d.ellipse((size * 0.6, size * 0.74, size * 0.72, size * 0.86), fill=c)


def draw_order(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    w = max(2, int(size * 0.07))
    d.rounded_rectangle((size * 0.22, size * 0.16, size * 0.78, size * 0.84), radius=size * 0.08, outline=c, width=w)
    for i, y in enumerate([0.34, 0.5, 0.66]):
        x1, x2 = size * 0.32, size * (0.68 if i < 2 else 0.52)
        d.rounded_rectangle((x1, size * y, x2, size * y + size * 0.06), radius=size * 0.03, fill=c)


def draw_profile(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    d.ellipse((size * 0.34, size * 0.18, size * 0.66, size * 0.5), fill=c)
    d.pieslice((size * 0.22, size * 0.52, size * 0.78, size * 0.98), 200, 340, fill=c)


def draw_search(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    w = max(2, int(size * 0.08))
    d.ellipse((size * 0.16, size * 0.16, size * 0.58, size * 0.58), outline=c, width=w)
    d.line((size * 0.54, size * 0.54, size * 0.82, size * 0.82), fill=c, width=w)


def draw_location(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    d.ellipse((size * 0.28, size * 0.14, size * 0.72, size * 0.58), fill=c)
    d.polygon([(size * 0.5, size * 0.84), (size * 0.32, size * 0.52), (size * 0.68, size * 0.52)], fill=c)
    d.ellipse((size * 0.42, size * 0.28, size * 0.58, size * 0.44), fill=(255, 255, 255, 255))


def draw_bell(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    w = max(2, int(size * 0.07))
    d.arc((size * 0.22, size * 0.18, size * 0.78, size * 0.62), 200, 340, fill=c, width=w)
    d.line((size * 0.22, size * 0.48, size * 0.78, size * 0.48), fill=c, width=w)
    d.ellipse((size * 0.44, size * 0.72, size * 0.56, size * 0.8), fill=c)


def draw_star(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    cx, cy, r = size * 0.5, size * 0.5, size * 0.34
    import math
    pts = []
    for i in range(10):
        ang = math.pi / 2 + i * math.pi / 5
        rad = r if i % 2 == 0 else r * 0.42
        pts.append((cx + rad * math.cos(ang), cy - rad * math.sin(ang)))
    d.polygon(pts, fill=c)


def draw_back(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    w = max(3, int(size * 0.09))
    d.line((size * 0.62, size * 0.18, size * 0.3, size * 0.5), fill=c, width=w)
    d.line((size * 0.3, size * 0.5, size * 0.62, size * 0.82), fill=c, width=w)


def draw_plus(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    w = max(3, int(size * 0.1))
    cx, cy = size * 0.5, size * 0.5
    d.line((cx, size * 0.22, cx, size * 0.78), fill=c, width=w)
    d.line((size * 0.22, cy, size * 0.78, cy), fill=c, width=w)


def draw_minus(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    w = max(3, int(size * 0.1))
    d.line((size * 0.22, size * 0.5, size * 0.78, size * 0.5), fill=c, width=w)


def draw_trash(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    w = max(2, int(size * 0.07))
    d.line((size * 0.3, size * 0.24, size * 0.7, size * 0.24), fill=c, width=w)
    d.line((size * 0.38, size * 0.16, size * 0.62, size * 0.16), fill=c, width=w)
    d.rounded_rectangle((size * 0.28, size * 0.28, size * 0.72, size * 0.82), radius=size * 0.06, outline=c, width=w)


def draw_wechat(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    d.ellipse((size * 0.12, size * 0.22, size * 0.58, size * 0.62), fill=c)
    d.ellipse((size * 0.42, size * 0.38, size * 0.88, size * 0.78), fill=c)
    for x in (0.28, 0.42):
        d.ellipse((size * x, size * 0.38, size * (x + 0.08), size * 0.46), fill=(255, 255, 255, 255))
    for x in (0.52, 0.66):
        d.ellipse((size * x, size * 0.52, size * (x + 0.08), size * 0.6), fill=(255, 255, 255, 255))


def draw_phone(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    w = max(2, int(size * 0.07))
    d.rounded_rectangle((size * 0.3, size * 0.14, size * 0.7, size * 0.86), radius=size * 0.1, outline=c, width=w)
    d.ellipse((size * 0.44, size * 0.72, size * 0.56, size * 0.8), fill=c)


def draw_clock(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    w = max(2, int(size * 0.07))
    d.ellipse((size * 0.16, size * 0.16, size * 0.84, size * 0.84), outline=c, width=w)
    d.line((size * 0.5, size * 0.5, size * 0.5, size * 0.3), fill=c, width=w)
    d.line((size * 0.5, size * 0.5, size * 0.66, size * 0.5), fill=c, width=w)


def draw_gift(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    d.rounded_rectangle((size * 0.18, size * 0.38, size * 0.82, size * 0.82), radius=size * 0.06, fill=c)
    d.rectangle((size * 0.18, size * 0.3, size * 0.82, size * 0.44), fill=c)
    d.rectangle((size * 0.46, size * 0.3, size * 0.54, size * 0.82), fill=(255, 255, 255, 180))


def draw_settings(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    w = max(2, int(size * 0.07))
    cx, cy = size * 0.5, size * 0.5
    d.ellipse((cx - size * 0.14, cy - size * 0.14, cx + size * 0.14, cy + size * 0.14), outline=c, width=w)
    for i in range(8):
        import math
        ang = i * math.pi / 4
        x1 = cx + math.cos(ang) * size * 0.2
        y1 = cy + math.sin(ang) * size * 0.2
        x2 = cx + math.cos(ang) * size * 0.34
        y2 = cy + math.sin(ang) * size * 0.34
        d.line((x1, y1, x2, y2), fill=c, width=w)


def draw_help(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    w = max(2, int(size * 0.08))
    d.ellipse((size * 0.18, size * 0.18, size * 0.82, size * 0.82), outline=c, width=w)
    d.arc((size * 0.34, size * 0.28, size * 0.66, size * 0.52), 200, 340, fill=c, width=w)
    d.ellipse((size * 0.46, size * 0.66, size * 0.54, size * 0.74), fill=c)


def draw_empty(d: ImageDraw.ImageDraw, color: str, size: int):
    c = hex_rgb(color)
    w = max(2, int(size * 0.07))
    d.rounded_rectangle((size * 0.22, size * 0.28, size * 0.78, size * 0.82), radius=size * 0.08, outline=c, width=w)
    d.line((size * 0.22, size * 0.36, size * 0.78, size * 0.36), fill=c, width=w)


def make_icon(draw_fn, name: str, color: str, size: int, folder: Path):
    img = new_canvas(size)
    draw_fn(ImageDraw.Draw(img), color, size)
    save(img, folder / f'{name}.png')


def main():
    print('Generating TabBar icons (81px)...')
    tab_size = 81
    tab_items = [
        ('home', draw_home),
        ('cart', draw_cart),
        ('order', draw_order),
        ('profile', draw_profile),
    ]
    for name, fn in tab_items:
        make_icon(fn, name, GRAY, tab_size, TAB_DIR)
        make_icon(fn, f'{name}-active', ACTIVE, tab_size, TAB_DIR)

    print('Generating UI icons (64px)...')
    ui_size = 64
    ui_items = [
        ('search', draw_search), ('location', draw_location), ('bell', draw_bell),
        ('star', draw_star), ('back', draw_back), ('plus', draw_plus), ('minus', draw_minus),
        ('trash', draw_trash), ('wechat', draw_wechat), ('phone', draw_phone),
        ('clock', draw_clock), ('gift', draw_gift), ('settings', draw_settings),
        ('help', draw_help), ('empty', draw_empty), ('order', draw_order),
        ('cart', draw_cart), ('profile', draw_profile), ('home', draw_home),
    ]
    for name, fn in ui_items:
        make_icon(fn, name, GRAY, ui_size, UI_DIR)
        make_icon(fn, f'{name}-active', ACTIVE, ui_size, UI_DIR)

    make_icon(draw_wechat, 'wechat-white', WHITE, ui_size, UI_DIR)
    make_icon(draw_phone, 'phone-white', WHITE, ui_size, UI_DIR)
    make_icon(draw_star, 'star-white', WHITE, ui_size, UI_DIR)

    print('Done.')


if __name__ == '__main__':
    main()
