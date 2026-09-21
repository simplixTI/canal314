import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <span
        aria-hidden
        className="pointer-events-none absolute select-none font-[family-name:var(--font-display)] text-[12rem] font-bold leading-none text-white/[0.05]"
      >
        404
      </span>
      <h1 className="relative font-[family-name:var(--font-display)] text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
        Página não
        <br />
        encontrada
      </h1>
      <p className="relative mt-4 max-w-xs text-sm leading-relaxed text-white/60">
        A série ou episódio que você procura não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="relative mt-8 bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-black transition hover:bg-white/85"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
