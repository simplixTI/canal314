import Link from "next/link";

/**
 * Marca raster — ícone dourado sobre preto, feito para o tema escuro
 * (NÃO usar filtro invert). O arquivo já vem recortado na arte (sem a margem
 * transparente do master), então a altura da caixa é a altura da marca.
 * sm = header, lg = login. Regerar com `python scripts/generate-icons.py`.
 */
const sizes = {
  sm: "h-[54px]",
  lg: "h-[78px]",
} as const;

export default function Logo({ size = "sm" }: { size?: keyof typeof sizes }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Canal314"
      width={301}
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
