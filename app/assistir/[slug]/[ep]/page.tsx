import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getCoinBalance,
  getEpisode,
  getEpisodeLikeState,
  getEpisodeUnlock,
  getSeriesBySlug,
  getSubscription,
  getUser,
  isSeriesListed,
  listEpisodes,
} from "@/lib/data";
import {
  canWatchEpisode,
  isSubscriptionActive,
} from "@/lib/access";
import Paywall from "@/components/Paywall";
import PlayerActions from "@/components/PlayerActions";
import PlayerFrame from "@/components/PlayerFrame";
import EpisodeSidebar from "@/components/EpisodeSidebar";
import SetupNotice from "@/components/SetupNotice";
import { getTeaser } from "@/lib/teasers";
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
  // Episódios 1 e 2 são grátis para todos, inclusive anônimos.
  const user = await getUser(supabase);

  let hasPass = false;
  let unlocked = false;
  let coinBalance = 0;
  if (user) {
    const [subscription, balance, hasUnlock] = await Promise.all([
      getSubscription(supabase, user.id),
      getCoinBalance(supabase, user.id),
      getEpisodeUnlock(supabase, user.id, episode.id),
    ]);
    hasPass = isSubscriptionActive(subscription);
    coinBalance = balance;
    unlocked = hasUnlock;
  }

  const access = canWatchEpisode(user?.id ?? null, hasPass, unlocked, episode);
  if (!access.allowed) {
    return (
      <Paywall
        reason={access.reason}
        seriesTitle={series.title}
        seriesSlug={series.slug}
        episodeId={episode.id}
        coinBalance={coinBalance}
        loginNext={`/assistir/${slug}/${episodeNumber}`}
      />
    );
  }

  // Registra o progresso ("continuar assistindo") — apenas logado
  if (user) {
    await supabase.from("watch_progress").upsert({
      user_id: user.id,
      episode_id: episode.id,
      watched_at: new Date().toISOString(),
    });
  }

  const episodes = await listEpisodes(supabase, series.id);
  const prev = episodes.find((e) => e.number === episodeNumber - 1);
  const next = episodes.find((e) => e.number === episodeNumber + 1);

  const likeState = await getEpisodeLikeState(supabase, user?.id ?? null, episode.id);
  const listed = user ? await isSeriesListed(supabase, user.id, series.id) : false;

  return (
    <div className="relative h-dvh overflow-hidden bg-black">
      {/* ================= Mobile/tablet: player imersivo ================= */}
      <div className="relative h-full lg:hidden">
        {/* Player vertical 9:16 cobrindo a tela inteira */}
        <div className="absolute inset-0 mx-auto sm:max-w-[56.25dvh] [container-type:size]">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: "max(100cqw, 56.25cqh)", height: "max(100cqh, 177.78cqw)" }}
          >
            <PlayerFrame
              key={`m-${episode.id}`}
              youtubeId={episode.youtube_id}
              title={episode.title}
              variant="mobile"
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

        {/* Rail de ações: Curtir · Lista · Enviar (borda direita do palco) */}
        <div className="pointer-events-none absolute inset-0 z-20 mx-auto sm:max-w-[56.25dvh]">
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <PlayerActions
              episodeId={episode.id}
              seriesId={series.id}
              initialLiked={likeState.liked}
              initialLikeCount={likeState.count}
              initialListed={listed}
              shareTitle={`${series.title} — Ep. ${episode.number}: ${episode.title}`}
              sharePath={`/assistir/${series.slug}/${episode.number}`}
            />
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

      {/* ================= Desktop: layout watch (player + sidebar) ================= */}
      <div className="hidden h-full lg:flex">
        {/* Coluna do player */}
        <div className="relative flex-1">
          <Link
            href={`/serie/${series.slug}`}
            aria-label={`Voltar para ${series.title}`}
            className="absolute left-6 top-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white/80 transition hover:border-accent hover:text-accent"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
          {/* Palco 9:16 pela altura da viewport (padding 24px), centrado */}
          <div className="absolute inset-y-6 left-1/2 aspect-[9/16] max-w-full -translate-x-1/2 overflow-hidden bg-black">
            <PlayerFrame
              key={`d-${episode.id}`}
              youtubeId={episode.youtube_id}
              title={episode.title}
              variant="desktop"
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-[440px] shrink-0 overflow-y-auto border-l border-white/10 px-8 py-8">
          <EpisodeSidebar
            series={{
              id: series.id,
              slug: series.slug,
              title: series.title,
              category: series.category,
              description: series.description,
            }}
            episode={{
              id: episode.id,
              number: episode.number,
              title: episode.title,
            }}
            episodeNumbers={episodes.map((e) => e.number)}
            initialLiked={likeState.liked}
            initialLikeCount={likeState.count}
            initialListed={listed}
            hasTeaser={Boolean(getTeaser(series.slug))}
          />
        </aside>
      </div>
    </div>
  );
}
