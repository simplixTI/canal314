import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSeriesBySlug, listEpisodes } from "@/lib/data";
import { FREE_EPISODES_PER_SERIES, UNLOCK_COST, formatDuration } from "@/lib/access";
import { getTeaser } from "@/lib/teasers";
import PosterArt, { categoryLabel } from "@/components/PosterArt";
import SetupNotice from "@/components/SetupNotice";
import { ChevronLeftIcon, CoinIcon, LockIcon, PlayIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <SetupNotice />
      </div>
    );
  }

  const series = await getSeriesBySlug(supabase, slug);
  if (!series) notFound();

  const episodes = await listEpisodes(supabase, series.id);
  const teaser = getTeaser(slug);
  const hasPhoto = Boolean(series.thumbnail);

  return (
    <div className="pb-32">
      {/* Abertura cinematográfica */}
      <div className="relative h-[58dvh] overflow-hidden">
        <PosterArt
          slug={series.slug}
          title={series.title}
          category={series.category}
          thumbnail={series.thumbnail || undefined}
          priority
        />
        {hasPhoto && (
          <div aria-hidden className="scrim-bottom absolute inset-0" />
        )}
        <Link
          href="/"
          className="absolute left-5 top-24 flex items-center gap-1 text-white/80 transition hover:text-white"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="micro-label">Catálogo</span>
        </Link>
        {hasPhoto && (
          <div className="absolute inset-x-0 bottom-0 px-6 pb-6">
            <div className="mx-auto w-full max-w-2xl">
              <p className="micro-label text-white/70">
                {categoryLabel(series.category)}
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
                {series.title}
              </h1>
              <p className="mt-3 text-sm text-white/60">
                {episodes.length}{" "}
                {episodes.length === 1 ? "episódio" : "episódios"} · 1–2 min cada
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Capas tipográficas carregam o título na arte; aqui vai a ficha da série */}
      {!hasPhoto && (
        <div className="mx-auto mt-6 w-full max-w-2xl px-6">
          <p className="micro-label text-white/50">
            {categoryLabel(series.category)} · {episodes.length}{" "}
            {episodes.length === 1 ? "episódio" : "episódios"} · 1–2 min cada
          </p>
          <div className="mt-4 h-px w-16 bg-white/25" aria-hidden />
        </div>
      )}

      <p className="mx-auto mt-6 w-full max-w-2xl px-6 text-sm leading-relaxed text-white/70">
        {series.description}
      </p>

      {/* Episódios */}
      <div className="mx-auto mt-10 w-full max-w-2xl">
        <p className="micro-label px-6 text-white/50">Episódios</p>
        <ol className="mt-4 border-t border-white/10">
          {teaser && (
            <li>
              <Link
                href={`/assistir/${series.slug}/teaser`}
                className="group flex items-center gap-5 border-b border-white/10 px-6 py-5 transition hover:bg-white/[0.04]"
              >
                <span className="w-8 shrink-0 font-[family-name:var(--font-display)] text-2xl font-medium text-accent">
                  ▶
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2.5">
                    <span className="truncate text-[15px] font-semibold text-white">
                      Teaser
                    </span>
                    <span className="micro-label shrink-0 bg-accent px-2 py-1 text-[9px] text-white">
                      Grátis
                    </span>
                  </span>
                  <span className="mt-1 block text-xs text-white/50">
                    {teaser.duration} min · sem login
                  </span>
                </span>
                <PlayIcon className="h-4 w-4 shrink-0 text-white/40 transition group-hover:text-white" />
              </Link>
            </li>
          )}
          {episodes.map((ep) => {
            const free = ep.number <= FREE_EPISODES_PER_SERIES;
            return (
              <li key={ep.id}>
                <Link
                  href={`/assistir/${series.slug}/${ep.number}`}
                  className="group flex items-center gap-5 border-b border-white/10 px-6 py-5 transition hover:bg-white/[0.04]"
                >
                  <span className="w-8 shrink-0 font-[family-name:var(--font-display)] text-2xl font-medium text-white/35 transition group-hover:text-white/70">
                    {String(ep.number).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2.5">
                      <span className="truncate text-[15px] font-semibold text-white">
                        {ep.title}
                      </span>
                      {free ? (
                        <span className="micro-label shrink-0 bg-white px-2 py-1 text-[9px] text-black">
                          Grátis
                        </span>
                      ) : (
                        <span className="flex shrink-0 items-center gap-1.5 text-white/40">
                          <LockIcon className="h-4 w-4" />
                          <span className="flex items-center gap-1 text-xs font-semibold">
                            {UNLOCK_COST}
                            <CoinIcon className="h-3.5 w-3.5 text-accent" />
                          </span>
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-xs text-white/50">
                      {formatDuration(ep.duration_seconds)} min
                    </span>
                  </span>
                  <PlayIcon className="h-4 w-4 shrink-0 text-white/40 transition group-hover:text-white" />
                </Link>
              </li>
            );
          })}
        </ol>
        <p className="mt-5 px-6 text-xs leading-relaxed text-white/45">
          Episódios 1 e 2 grátis para todos · desbloqueie os demais com
          314Coins ou libere tudo com o 314 Pass
        </p>
      </div>

      {/* CTA fixa no rodapé */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a0a0a]/95 px-6 py-4 backdrop-blur-sm">
        <Link
          href={
            episodes.length > 0
              ? `/assistir/${series.slug}/1`
              : `/assistir/${series.slug}/teaser`
          }
          className="mx-auto block w-full max-w-2xl bg-accent px-6 py-4 text-center text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-accent-hover"
        >
          {episodes.length > 0 ? "Assistir agora" : "Assistir ao teaser"}
        </Link>
      </div>
    </div>
  );
}
