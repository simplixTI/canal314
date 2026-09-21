import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSeriesBySlug, listEpisodes } from "@/lib/data";
import { FREE_EPISODES_PER_SERIES, formatDuration } from "@/lib/access";
import { CategoryBadge } from "@/components/SeriesCard";
import SetupNotice from "@/components/SetupNotice";

export const dynamic = "force-dynamic";

function LockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4 text-neutral-500"
      aria-label="Bloqueado"
    >
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <SetupNotice />
      </div>
    );
  }

  const series = await getSeriesBySlug(supabase, slug);
  if (!series) notFound();

  const episodes = await listEpisodes(supabase, series.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/"
        className="text-sm text-neutral-400 transition hover:text-white"
      >
        ← Voltar ao catálogo
      </Link>

      <div className="mt-6 flex gap-5">
        {series.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={series.thumbnail}
            alt={series.title}
            className="w-32 shrink-0 self-start rounded-xl border border-neutral-800 object-cover"
          />
        ) : null}
        <div>
          <div className="flex items-center gap-3">
            <CategoryBadge category={series.category} />
            <span className="text-xs text-neutral-500">
              {episodes.length}{" "}
              {episodes.length === 1 ? "episódio" : "episódios"}
            </span>
          </div>

          <h1 className="mt-2 text-3xl font-black tracking-tight">
            {series.title}
          </h1>
          <p className="mt-3 text-neutral-300">{series.description}</p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {episodes.map((ep) => {
          const free = ep.number <= FREE_EPISODES_PER_SERIES;
          return (
            <Link
              key={ep.id}
              href={`/assistir/${series.slug}/${ep.number}`}
              className="flex items-center gap-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4 transition hover:border-neutral-500"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-lg font-bold text-neutral-300">
                {ep.number}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="truncate font-semibold">{ep.title}</h2>
                  {free ? (
                    <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-950">
                      Grátis
                    </span>
                  ) : (
                    <LockIcon />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Episódio {ep.number} · {formatDuration(ep.duration_seconds)} min
                </p>
              </div>
              <span className="shrink-0 text-neutral-500" aria-hidden>
                ▶
              </span>
            </Link>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-neutral-500">
        Episódios 1 e 2 liberados no teste grátis · assine para liberar todos
      </p>
    </div>
  );
}
