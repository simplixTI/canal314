# Gera os assets de marca a partir das duas artes-mestre em assets/.
# Uso: python scripts/generate-icons.py   (requer Pillow)
#
# Duas artes porque são dois trabalhos diferentes:
#   assets/logo-horizontal-master.png  placa larga (~2.9:1) — o logo da tela
#   assets/logo-master.png             badge quadrado — os ícones do sistema
# O wordmark horizontal num canvas quadrado viraria uma tirinha no meio do
# nada; o badge é a mesma marca desenhada para caber em quadrado.
#
# Saídas:
#   public/logo.webp      marca recortada p/ header, login e rodapé (WebP: o
#                         mesmo desenho em PNG pesa 6x, é degradê fotográfico)
#   app/icon.png          512x512 — <link rel="icon"> do Next
#   app/apple-icon.png    180x180 sobre #0a0a0a — iOS não respeita transparência
#   app/favicon.ico       32/48/64/128/256 — sem frame de 16px (ver ICO_SIZES)
#
# As masters NÃO são servidas (ficam fora de public/): são a fonte para regerar.

from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
MASTER_ICONE = ROOT / "assets" / "logo-master.png"
MASTER_LOGO = ROOT / "assets" / "logo-horizontal-master.png"

LOGO_HEIGHT = 288  # header 54px / login 78px, com folga para telas 3x
LOGO_QUALITY = 90
# Sem 16x16 de propósito: a marca é um logotipo com palavra e vira borrão nesse
# tamanho. O piso é 32px (o que telas 2x já pedem); onde o browser precisar de
# 16 ele reduz o 32 sozinho.
ICO_SIZES = (32, 48, 64, 128, 256)
BOOST_UNDER = 64  # abaixo disso o dourado some no downscale; ver realce()
BG = (10, 10, 10)  # --bg do app


def aparar(caminho: Path) -> Image.Image:
    """Abre a master e corta a margem transparente em volta da arte.

    É esse corte que faz a marca crescer na tela sem aumentar a caixa: a
    altura da caixa passa a ser a altura da marca, não a da moldura vazia.
    """
    master = Image.open(caminho).convert("RGBA")
    return master.crop(master.getbbox())


def realce(img: Image.Image) -> Image.Image:
    """Contraste/saturação/nitidez a mais para o 314 sobreviver a 32-48px."""
    rgb = img.convert("RGB")
    rgb = ImageEnhance.Contrast(rgb).enhance(1.18)
    rgb = ImageEnhance.Color(rgb).enhance(1.15)
    rgb = ImageEnhance.Sharpness(rgb).enhance(1.6)
    return Image.merge("RGBA", (*rgb.split(), img.split()[3]))


def quadrado(mark: Image.Image, size: int) -> Image.Image:
    """Centra a marca num canvas quadrado, sem cortar."""
    escala = size / max(mark.width, mark.height)
    w, h = round(mark.width * escala), round(mark.height * escala)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(mark.resize((w, h), Image.LANCZOS), ((size - w) // 2, (size - h) // 2))
    return canvas


# ---------- logo da tela (placa horizontal) ----------
logo = aparar(MASTER_LOGO)
largura = round(logo.width * LOGO_HEIGHT / logo.height)
logo.resize((largura, LOGO_HEIGHT), Image.LANCZOS).save(
    ROOT / "public" / "logo.webp", quality=LOGO_QUALITY, method=6
)

# ---------- ícones do sistema (badge quadrado) ----------
icone = aparar(MASTER_ICONE)

quadrado(icone, 512).save(ROOT / "app" / "icon.png", optimize=True)

apple = Image.new("RGBA", (180, 180), (*BG, 255))
apple.alpha_composite(quadrado(icone, 180))
apple.convert("RGB").save(ROOT / "app" / "apple-icon.png", optimize=True)

frames = [quadrado(icone, s) for s in ICO_SIZES]
frames = [realce(f) if s < BOOST_UNDER else f for s, f in zip(ICO_SIZES, frames)]
frames[-1].save(ROOT / "app" / "favicon.ico", sizes=[(s, s) for s in ICO_SIZES], append_images=frames[:-1])

print(f"logo aparado: {logo.size} -> {largura}x{LOGO_HEIGHT}   icone aparado: {icone.size}")
for p in ("public/logo.webp", "app/icon.png", "app/apple-icon.png", "app/favicon.ico"):
    print(f"  {p}  {(ROOT / p).stat().st_size / 1024:.0f} KB")
