import Link from "next/link";

/**
 * Logo raster da marca — ícone dourado sobre preto, feito para o tema
 * escuro (NÃO usar filtro invert). sm = header, lg = login.
 */
const sizes = {
  sm: "h-[45px]",
  lg: "h-[65px]",
} as const;

export default function Logo({ size = "sm" }: { size?: keyof typeof sizes }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Canal314"
      className={`${sizes[size]} w-auto rounded-lg`}
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
