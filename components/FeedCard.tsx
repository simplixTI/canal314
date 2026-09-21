import Link from "next/link";
import type { SeriesWithCount } from "@/lib/types";
import PosterArt, { categoryLabel } from "./PosterArt";
import { ChevronDownIcon } from "./icons";

/**
 * Uma série no feed vertical: pôster sangrando de borda a borda,
 * scrim preto no terço inferior, bloco de conteúdo e deixa de scroll.
 * Capas tipográficas já carregam o título na arte — a barra de info
 * não repete o título; capas fotográficas recebem o título em display.
 */
export default function FeedCard({
  series,
  first,
  last,
}: {
  series: SeriesWithCount;
  first?: boolean;
  last?: boolean;
}) {
  const hasPhoto = Boolean(series.thumbnail);

  return (
    <section className="relative h-dvh snap-start overflow-hidden">
      <Link
        href={`/serie/${series.slug}`}
        aria-label={`Abrir a série ${series.title}`}
        className="absolute inset-0"
      >
        <PosterArt
          slug={series.slug}
          title={series.title}
          category={series.category}
          thumbnail={series.thumbnail || undefined}
          priority={first}
        />
      </Link>

      {hasPhoto && (
        <div aria-hidden className="scrim-bottom pointer-events-none absolute inset-0" />
      )}

      <div className={`absolute inset-x-0 bottom-0 px-6 pb-12 ${first ? "rise-in" : ""}`}>
        <div className="mx-auto w-full max-w-xl">
        {hasPhoto && (
          <>
            <p className="micro-label text-white/70">
              {categoryLabel(series.category)}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-white">
              {series.title}
            </h2>
          </>
        )}
        <p className={`text-sm text-white/60 ${hasPhoto ? "mt-3" : ""}`}>
          {series.episode_count}{" "}
          {series.episode_count === 1 ? "episódio" : "episódios"} · 1–2 min cada
        </p>

        <div className="mt-6 flex items-center gap-5">
          <Link
            href={`/serie/${series.slug}`}
            className="flex-1 bg-white px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.14em] text-black transition hover:bg-white/85"
          >
            Assistir agora
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-white/80 underline decoration-white/40 transition hover:text-white hover:decoration-white"
          >
            Teste grátis
          </Link>
        </div>
        </div>
      </div>

      {!last && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-2 flex flex-col items-center gap-0.5 text-white/70"
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">
            Deslize
          </span>
          <ChevronDownIcon className="scroll-cue h-4 w-4" />
        </div>
      )}
    </section>
  );
}
