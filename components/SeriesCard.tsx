import Link from "next/link";
import type { SeriesWithCount } from "@/lib/types";

export function CategoryBadge({ category }: { category: string }) {
  const label = category === "religioso" ? "Religioso" : "Político";
  return (
    <span className="rounded-full border border-neutral-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-200">
      {label}
    </span>
  );
}

export default function SeriesCard({ series }: { series: SeriesWithCount }) {
  return (
    <Link
      href={`/serie/${series.slug}`}
      className="group block overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition hover:border-neutral-500"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-neutral-800">
        {series.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={series.thumbnail}
            alt={series.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-b from-neutral-800 to-neutral-950 p-4 text-center">
            <span className="text-4xl font-black tracking-tight text-neutral-700">
              314
            </span>
            <span className="text-lg font-bold leading-tight text-neutral-100">
              {series.title}
            </span>
          </div>
        )}
        <div className="absolute left-2 top-2">
          <CategoryBadge category={series.category} />
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold leading-snug">{series.title}</h3>
        <p className="mt-1 text-xs text-neutral-400">
          {series.episode_count}{" "}
          {series.episode_count === 1 ? "episódio" : "episódios"}
        </p>
      </div>
    </Link>
  );
}
