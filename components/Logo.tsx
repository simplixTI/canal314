import Link from "next/link";

/**
 * Logo raster original da marca — o PNG é traço preto sobre fundo
 * transparente (feito para fundos claros); o filtro `invert` o torna
 * branco sobre o tema escuro. sm = header, lg = login.
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
      className={`${sizes[size]} w-auto invert`}
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
