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

export const dynamic = "force-dynamic";

export default async function WatchPage({
  params,
}: {
  params: { slug: string; ep: string };
}) {
  const supabase = createClient();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <SetupNotice />
      </div>
    );
  }

  const episodeNumber = Number(params.ep);
  if (!Number.isInteger(episodeNumber) || episodeNumber < 1) notFound();

  const series = await getSeriesBySlug(supabase, params.slug);
  if (!series) notFound();

  const episode = await getEpisode(supabase, series.id, episodeNumber);
  if (!episode) notFound();

  // ---- Verificação de acesso (server-side) ----
  const user = await getUser(supabase);
  if (!user) {
    redirect(`/login?next=/assistir/${params.slug}/${episodeNumber}`);
  }

  const [profile, subscription] = await Promise.all([
    getProfile(supabase, user.id),
    getSubscription(supabase, user.id),
  ]);

  const access = canWatchEpisode(user.id, profile, subscription, episode);
  if (!access.allowed) {
    return <Paywall reason={access.reason} />;
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
    <div className="mx-auto max-w-md px-4 py-6">
      <div className="mb-4 flex items-center justify-between text-sm">
        <Link
          href={`/serie/${series.slug}`}
          className="text-neutral-400 transition hover:text-white"
        >
          ← {series.title}
        </Link>
        <span className="text-neutral-500">
          Ep. {episode.number}/{episodes.length}
        </span>
      </div>

      {/* Player vertical 9:16 */}
      <div className="relative mx-auto aspect-[9/16] w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-800 bg-black">
        <iframe
          key={episode.id}
          src={`https://www.youtube-nocookie.com/embed/${episode.youtube_id}?autoplay=1&rel=0&playsinline=1`}
          title={episode.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <h1 className="mt-4 text-center text-lg font-bold">
        {episode.number}. {episode.title}
      </h1>

      {/* Navegação entre episódios */}
      <div className="mt-4 flex gap-3">
        {prev ? (
          <Link
            href={`/assistir/${series.slug}/${prev.number}`}
            className="flex-1 rounded-full border border-neutral-700 px-4 py-2.5 text-center text-sm font-medium transition hover:border-white"
          >
            ← Ep. {prev.number}
          </Link>
        ) : (
          <span className="flex-1 rounded-full border border-neutral-800 px-4 py-2.5 text-center text-sm text-neutral-700">
            ← Anterior
          </span>
        )}
        {next ? (
          <Link
            href={`/assistir/${series.slug}/${next.number}`}
            className="flex-1 rounded-full bg-white px-4 py-2.5 text-center text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
          >
            Próximo Ep. {next.number} →
          </Link>
        ) : (
          <Link
            href={`/serie/${series.slug}`}
            className="flex-1 rounded-full bg-white px-4 py-2.5 text-center text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
          >
            Fim da série ✓
          </Link>
        )}
      </div>
    </div>
  );
}
