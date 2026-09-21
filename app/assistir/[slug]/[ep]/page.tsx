import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getEpisode,
  getProfile,
  getSeriesBySlug,
  getSubscription,
  getUser,
  listEpisodes,
} from "@/lib/data";
import { canWatchEpisode } from "@/lib/access";
import Paywall from "@/components/Paywall";
import SetupNotice from "@/components/SetupNotice";
import { ChevronLeftIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function WatchPage({
  params,
}: {
  params: Promise<{ slug: string; ep: string }>;
}) {
  const { slug, ep } = await params;
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <SetupNotice />
      </div>
    );
  }

  const episodeNumber = Number(ep);
  if (!Number.isInteger(episodeNumber) || episodeNumber < 1) notFound();

  const series = await getSeriesBySlug(supabase, slug);
  if (!series) notFound();

  const episode = await getEpisode(supabase, series.id, episodeNumber);
  if (!episode) notFound();

  // ---- Verificação de acesso (server-side) ----
  const user = await getUser(supabase);
  if (!user) {
    redirect(`/login?next=/assistir/${slug}/${episodeNumber}`);
  }

  const [profile, subscription] = await Promise.all([
    getProfile(supabase, user.id),
    getSubscription(supabase, user.id),
  ]);

  const access = canWatchEpisode(user.id, profile, subscription, episode);
  if (!access.allowed) {
    return <Paywall reason={access.reason} seriesTitle={series.title} seriesSlug={series.slug} />;
  }

  // Registra o progresso ("continuar assistindo") — falha silenciosa é ok
  await supabase.from("watch_progress").upsert({
    user_id: user.id,
    episode_id: episode.id,
    watched_at: new Date().toISOString(),
  });

  const episodes = await listEpisodes(supabase, series.id);
  const prev = episodes.find((e) => e.number === episodeNumber - 1);
  const next = episodes.find((e) => e.number === episodeNumber + 1);

  return (
    <div className="relative h-dvh overflow-hidden bg-black">
      {/* Player vertical 9:16 cobrindo a tela inteira (no desktop, centralizado em 9:16 pela altura) */}
      <div className="absolute inset-0 mx-auto sm:max-w-[56.25dvh] [container-type:size]">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: "max(100cqw, 56.25cqh)", height: "max(100cqh, 177.78cqw)" }}
        >
          <iframe
            key={episode.id}
            src={`https://www.youtube-nocookie.com/embed/${episode.youtube_id}?autoplay=1&rel=0&playsinline=1`}
            title={episode.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </div>

      {/* Chrome superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto sm:max-w-[56.25dvh]">
        <div aria-hidden className="scrim-top absolute inset-0 h-24" />
        <div className="relative flex items-center justify-between px-5 py-4">
          <Link
            href={`/serie/${series.slug}`}
            className="pointer-events-auto flex min-w-0 items-center gap-1.5 text-white/85 transition hover:text-white"
          >
            <ChevronLeftIcon className="h-5 w-5 shrink-0" />
            <span className="truncate text-sm font-semibold">{series.title}</span>
          </Link>
          <span className="micro-label shrink-0 text-white/60">
            Ep {String(episode.number).padStart(2, "0")}/{String(episodes.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Chrome inferior */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto sm:max-w-[56.25dvh]">
        <div aria-hidden className="scrim-bottom absolute inset-0 h-32" />
        <div className="relative px-5 pb-6">
          <p className="text-sm font-medium text-white/85">
            {episode.number}. {episode.title}
          </p>
          <div className="mt-4 flex gap-3">
            {prev ? (
              <Link
                href={`/assistir/${series.slug}/${prev.number}`}
                className="pointer-events-auto flex-1 border border-white/35 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:border-white"
              >
                ← Ep. {prev.number}
              </Link>
            ) : (
              <span className="pointer-events-auto flex-1 border border-white/10 px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-white/25">
                ← Anterior
              </span>
            )}
            {next ? (
              <Link
                href={`/assistir/${series.slug}/${next.number}`}
                className="pointer-events-auto flex-1 bg-white px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-black transition hover:bg-white/85"
              >
                Ep. {next.number} →
              </Link>
            ) : (
              <Link
                href={`/serie/${series.slug}`}
                className="pointer-events-auto flex-1 bg-white px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-black transition hover:bg-white/85"
              >
                Fim da série
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
