export type Category = "religioso" | "politico";

export interface Series {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Category;
  thumbnail: string;
  display_order: number;
}

export interface Episode {
  id: string;
  series_id: string;
  number: number;
  title: string;
  youtube_id: string;
  duration_seconds: number;
}

export interface Profile {
  id: string;
  email: string | null;
  trial_started_at: string;
}

export type SubscriptionStatus = "trialing" | "active" | "canceled" | "expired";

export interface Subscription {
  id: string;
  user_id: string;
  status: SubscriptionStatus;
  provider: string;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface WatchProgress {
  user_id: string;
  episode_id: string;
  watched_at: string;
}

export interface SeriesWithCount extends Series {
  episode_count: number;
}

export interface ContinueWatchingItem {
  episode: Episode;
  series: Series;
  watched_at: string;
}
