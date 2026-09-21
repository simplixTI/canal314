import Link from "next/link";

/**
 * Logo da marca — arte branca sobre preto; `mix-blend-screen` faz o fundo
 * preto da imagem sumir sobre o chão escuro do app.
 */
export default function Logo({ className = "h-7" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Canal314"
      className={`${className} w-auto mix-blend-screen`}
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
