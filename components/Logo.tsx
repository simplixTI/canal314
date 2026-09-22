import Link from "next/link";

/**
 * Marca raster — marca dourada horizontal (~3.2:1) sobre preto, feita para o
 * tema escuro (NÃO usar filtro invert). O arquivo já vem recortado na arte
 * (sem a margem transparente da master), então a altura da caixa é a altura
 * da marca. sm = header e rodapé, lg = login.
 *
 * Regerar com `python scripts/generate-icons.py` — se trocar a arte, conferir
 * `width`/`height` abaixo: são a proporção real do arquivo, e é o que segura
 * o layout enquanto a imagem carrega.
 */
const sizes = {
  sm: "h-[54px]",
  lg: "h-[78px]",
} as const;

export default function Logo({ size = "sm" }: { size?: keyof typeof sizes }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.webp"
      alt="Canal314"
      width={916}
      height={288}
      className={`${sizes[size]} w-auto`}
    />
  );
}

export function LogoLink() {
  return (
    <Link href="/" aria-label="Canal314 — página inicial" className="shrink-0">
      <Logo />
    </Link>
  );
}
