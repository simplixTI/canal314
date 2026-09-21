import Link from "next/link";
import type { SeriesWithCount } from "@/lib/types";
import { getTeaser } from "@/lib/teasers";
import PosterArt from "./PosterArt";

/**
 * Card de fileira (rail): mini thumb paisagem 16:10 com a capa da série.
 * Séries com episódios são links para /serie/[slug]; séries futuras sem
 * episódios nem teaser não são links e ganham o chip "Em breve".
 * Série com teaser (mesmo sem episódios) é link e mostra "Teaser grátis".
 */
export default function RailCard({ series }: { series: SeriesWithCount }) {
  const playable = series.episode_count > 0;
  const hasTeaser = Boolean(getTeaser(series.slug));
  const clickable = playable || hasTeaser;

  const art = (
    <>
      <div className="relative aspect-[16/10] w-52 overflow-hidden border border-white/10 transition group-hover:border-white/35 sm:w-64">
        <PosterArt
          slug={series.slug}
          title={series.title}
          category={series.category}
          thumbnail={series.thumbnail || undefined}
          size="thumb"
        />
        {!playable && !hasTeaser && (
          <span className="micro-label absolute left-2 top-2 bg-white px-2 py-1 text-[9px] text-black">
            Em breve
          </span>
        )}
        {!playable && hasTeaser && (
          <span className="micro-label absolute left-2 top-2 bg-accent px-2 py-1 text-[9px] text-white">
            Teaser grátis
          </span>
        )}
      </div>
      <p className="mt-2.5 w-52 truncate text-sm font-semibold text-white sm:w-64">
        {series.title}
      </p>
      <p className="mt-0.5 text-xs text-white/50">
        {playable
          ? `${series.episode_count} ${series.episode_count === 1 ? "episódio" : "episódios"}`
          : hasTeaser
            ? "Assista ao teaser"
            : "Em breve no catálogo"}
      </p>
    </>
  );

  if (!clickable) {
    return <div className="shrink-0 cursor-default">{art}</div>;
  }
  return (
    <Link href={`/serie/${series.slug}`} className="group shrink-0">
      {art}
    </Link>
  );
}
