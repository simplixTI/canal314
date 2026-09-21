import type { Episode, Subscription } from "./types";

export const FREE_EPISODES_PER_SERIES = 2;
export const PRICE_LABEL = "R$19,90/mês";
/** Custo em 314Coins para desbloquear um episódio avulso. */
export const UNLOCK_COST = 30;

export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  if (subscription.status !== "active") return false;
  if (!subscription.current_period_end) return false;
  return new Date(subscription.current_period_end).getTime() > Date.now();
}

export type AccessDeniedReason = "anonymous" | "locked";

export type AccessResult =
  | { allowed: true }
  | { allowed: false; reason: AccessDeniedReason };

/**
 * Regras de acesso aos episódios (modelo 314Coins + 314 Pass):
 * 1. Episódios 1 e 2 de cada série: grátis para todos, sem login.
 * 2. Episódio 3+: exige login.
 * 3. Logado, assiste se: (a) 314 Pass ativo, ou (b) episódio
 *    desbloqueado com 314Coins.
 */
export function canWatchEpisode(
  userId: string | null,
  hasPass: boolean,
  episodeUnlocked: boolean,
  episode: Pick<Episode, "number">
): AccessResult {
  if (episode.number <= FREE_EPISODES_PER_SERIES) return { allowed: true };
  if (!userId) return { allowed: false, reason: "anonymous" };
  if (hasPass || episodeUnlocked) return { allowed: true };
  return { allowed: false, reason: "locked" };
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
