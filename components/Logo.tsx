import Link from "next/link";

/** Logo da marca (imagem monocromática; invertida para o tema escuro). */
export default function Logo({ className = "h-8" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Canal314"
      className={`${className} w-auto invert`}
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
