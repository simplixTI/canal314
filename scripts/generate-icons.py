# Gera os assets de marca a partir de assets/logo-master.png (1254x1254, ícone dourado).
# Uso: python scripts/generate-icons.py   (requer Pillow)
#
# Saídas:
#   public/logo.png       marca recortada (sem a margem transparente) p/ header e login
#   app/icon.png          512x512 — <link rel="icon"> do Next
#   app/apple-icon.png    180x180 sobre #0a0a0a — iOS não respeita transparência
#   app/favicon.ico       16/32/48/64/128/256 — tamanhos pequenos recebem realce
#
# O master NÃO é servido (fica fora de public/): ele é a fonte para regerar tudo.

from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
MASTER = ROOT / "assets" / "logo-master.png"

LOGO_HEIGHT = 288  # header 54px / login 78px com folga para telas 3x
ICO_SIZES = (16, 32, 48, 64, 128, 256)
BOOST_UNDER = 64  # abaixo disso o dourado some no downscale; ver realce()
BG = (10, 10, 10)  # --bg do app


def realce(img: Image.Image) -> Image.Image:
    """Contraste/saturação/nitidez a mais para o 314 sobreviver a 16-48px."""
    rgb = img.convert("RGB")
    rgb = ImageEnhance.Contrast(rgb).enhance(1.18)
    rgb = ImageEnhance.Color(rgb).enhance(1.15)
    rgb = ImageEnhance.Sharpness(rgb).enhance(1.6)
    return Image.merge("RGBA", (*rgb.split(), img.split()[3]))


def quadrado(mark: Image.Image, size: int) -> Image.Image:
    """Centra a marca (969x928, quase quadrada) num canvas quadrado, sem cortar."""
    escala = size / max(mark.width, mark.height)
    w, h = round(mark.width * escala), round(mark.height * escala)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(mark.resize((w, h), Image.LANCZOS), ((size - w) // 2, (size - h) // 2))
    return canvas


master = Image.open(MASTER).convert("RGBA")
# A arte vem com ~25% de margem transparente: cortar é o que faz a marca crescer
# na tela sem aumentar a caixa do header.
mark = master.crop(master.getbbox())

w = round(mark.width * LOGO_HEIGHT / mark.height)
mark.resize((w, LOGO_HEIGHT), Image.LANCZOS).save(ROOT / "public" / "logo.png", optimize=True)

quadrado(mark, 512).save(ROOT / "app" / "icon.png", optimize=True)

apple = Image.new("RGBA", (180, 180), (*BG, 255))
apple.alpha_composite(quadrado(mark, 180))
apple.convert("RGB").save(ROOT / "app" / "apple-icon.png", optimize=True)

frames = [quadrado(mark, s) for s in ICO_SIZES]
frames = [realce(f) if s < BOOST_UNDER else f for s, f in zip(ICO_SIZES, frames)]
frames[-1].save(ROOT / "app" / "favicon.ico", sizes=[(s, s) for s in ICO_SIZES], append_images=frames[:-1])

print(f"marca recortada: {mark.size} (master {master.size})")
for p in ("public/logo.png", "app/icon.png", "app/apple-icon.png", "app/favicon.ico"):
    print(f"  {p}  {(ROOT / p).stat().st_size / 1024:.0f} KB")
