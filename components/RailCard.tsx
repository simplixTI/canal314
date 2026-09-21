import Link from "next/link";
import type { SeriesWithCount } from "@/lib/types";
import PosterArt from "./PosterArt";

/**
 * Card de fileira (rail): mini thumb paisagem 16:10 com a capa da série.
 * Séries com episódios são links para /serie/[slug]; séries futuras
 * (zero episódios) não são links e ganham o chip invertido "Em breve".
 */
export default function RailCard({ series }: { series: SeriesWithCount }) {
  const playable = series.episode_count > 0;

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
        {!playable && (
          <span className="micro-label absolute left-2 top-2 bg-white px-2 py-1 text-[9px] text-black">
            Em breve
          </span>
        )}
      </div>
      <p className="mt-2.5 w-52 truncate text-sm font-semibold text-white sm:w-64">
        {series.title}
      </p>
      <p className="mt-0.5 text-xs text-white/50">
        {playable
          ? `${series.episode_count} ${series.episode_count === 1 ? "episódio" : "episódios"}`
          : "Em breve no catálogo"}
      </p>
    </>
  );

  if (!playable) {
    return <div className="shrink-0 cursor-default">{art}</div>;
  }
  return (
    <Link href={`/serie/${series.slug}`} className="group shrink-0">
      {art}
    </Link>
  );
}
