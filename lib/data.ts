import { createClient } from "@/lib/supabase/server";
import type {
  ContinueWatchingItem,
  Episode,
  Profile,
  Series,
  SeriesWithCount,
  Subscription,
} from "./types";

type Supabase = NonNullable<Awaited<ReturnType<typeof createClient>>>;

export async function getUser(supabase: Supabase) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(
  supabase: Supabase,
  userId: string
): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return data;
}

export async function getSubscription(
  supabase: Supabase,
  userId: string
): Promise<Subscription | null> {
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function listSeries(supabase: Supabase): Promise<SeriesWithCount[]> {
  const { data: series } = await supabase
    .from("series")
    .select("*")
    .order("display_order", { ascending: true });

  if (!series || series.length === 0) return [];

  const { data: episodes } = await supabase.from("episodes").select("series_id");

  const counts = new Map<string, number>();
  (episodes ?? []).forEach((ep: { series_id: string }) => {
    counts.set(ep.series_id, (counts.get(ep.series_id) ?? 0) + 1);
  });

  return (series as Series[]).map((s) => ({
    ...s,
    episode_count: counts.get(s.id) ?? 0,
  }));
}

export async function getSeriesBySlug(
  supabase: Supabase,
  slug: string
): Promise<Series | null> {
  const { data } = await supabase
    .from("series")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function listEpisodes(
  supabase: Supabase,
  seriesId: string
): Promise<Episode[]> {
  const { data } = await supabase
    .from("episodes")
    .select("*")
    .eq("series_id", seriesId)
    .order("number", { ascending: true });
  return data ?? [];
}

export async function getEpisode(
  supabase: Supabase,
  seriesId: string,
  number: number
): Promise<Episode | null> {
  const { data } = await supabase
    .from("episodes")
    .select("*")
    .eq("series_id", seriesId)
    .eq("number", number)
    .maybeSingle();
  return data;
}

export async function getContinueWatching(
  supabase: Supabase,
  userId: string
): Promise<ContinueWatchingItem[]> {
  const { data } = await supabase
    .from("watch_progress")
    .select("watched_at, episode:episodes(*, series:series(*))")
    .eq("user_id", userId)
    .order("watched_at", { ascending: false })
    .limit(10);

  if (!data) return [];

  const items: ContinueWatchingItem[] = [];
  for (const row of data) {
    const episode = (Array.isArray(row.episode) ? row.episode[0] : row.episode) as
      | (Episode & { series: Series | Series[] | null })
      | null;
    if (!episode || !episode.series) continue;
    const series = Array.isArray(episode.series) ? episode.series[0] : episode.series;
    if (!series) continue;
    items.push({
      episode: {
        id: episode.id,
        series_id: episode.series_id,
        number: episode.number,
        title: episode.title,
        youtube_id: episode.youtube_id,
        duration_seconds: episode.duration_seconds,
      },
      series,
      watched_at: row.watched_at,
    });
  }
  return items;
}

// ---------- Ações do player: curtidas + Minha Lista ----------

export async function getEpisodeLikeState(
  supabase: Supabase,
  userId: string,
  episodeId: string
): Promise<{ liked: boolean; count: number }> {
  const [{ count }, { data }] = await Promise.all([
    supabase
      .from("episode_likes")
      .select("*", { count: "exact", head: true })
      .eq("episode_id", episodeId),
    supabase
      .from("episode_likes")
      .select("user_id")
      .eq("episode_id", episodeId)
      .eq("user_id", userId)
      .maybeSingle(),
  ]);
  return { liked: Boolean(data), count: count ?? 0 };
}

export async function isSeriesListed(
  supabase: Supabase,
  userId: string,
  seriesId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("list_entries")
    .select("user_id")
    .eq("series_id", seriesId)
    .eq("user_id", userId)
    .maybeSingle();
  return Boolean(data);
}

export async function getMyList(
  supabase: Supabase,
  userId: string
): Promise<Series[]> {
  const { data } = await supabase
    .from("list_entries")
    .select("created_at, series:series(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (!data) return [];

  const items: Series[] = [];
  for (const row of data) {
    const series = (Array.isArray(row.series) ? row.series[0] : row.series) as
      | Series
      | null;
    if (series) items.push(series);
  }
  return items;
}
