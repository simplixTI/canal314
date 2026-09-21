import Link from "next/link";

export default function PodcastPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6">
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-8 select-none font-[family-name:var(--font-display)] text-[16rem] font-bold leading-none text-white/[0.04]"
      >
        314
      </span>
      <div className="relative w-full max-w-sm border border-white/15 p-10 text-center">
        <p className="micro-label text-accent">Em breve</p>
        <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
          PodCast
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-white/60">
          Os episódios do podcast do Canal314 chegam em breve.
        </p>
        <Link
          href="/"
          className="micro-label mt-8 inline-block border border-white/35 px-5 py-3 text-white transition hover:border-accent hover:text-accent"
        >
          Voltar ao catálogo
        </Link>
      </div>
    </div>
  );
}
