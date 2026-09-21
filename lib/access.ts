import type { Episode, Profile, Subscription } from "./types";

export const TRIAL_DAYS = 3;
export const FREE_EPISODES_PER_SERIES = 2;
export const PRICE_LABEL = "R$19,90/mês";

export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  if (subscription.status !== "active") return false;
  if (!subscription.current_period_end) return false;
  return new Date(subscription.current_period_end).getTime() > Date.now();
}

export function trialEndsAt(profile: Profile): Date {
  const end = new Date(profile.trial_started_at);
  end.setDate(end.getDate() + TRIAL_DAYS);
  return end;
}

export function isTrialActive(profile: Profile | null): boolean {
  if (!profile) return false;
  return trialEndsAt(profile).getTime() > Date.now();
}

/** Dias restantes de trial (0 quando expirado). Arredonda para cima. */
export function trialDaysRemaining(profile: Profile | null): number {
  if (!profile) return 0;
  const ms = trialEndsAt(profile).getTime() - Date.now();
  if (ms <= 0) return 0;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export type AccessDeniedReason = "anonymous" | "trial_episode_locked" | "trial_expired";

export type AccessResult =
  | { allowed: true }
  | { allowed: false; reason: AccessDeniedReason };

/**
 * Regras de acesso aos episódios:
 * 1. Anônimo: navega o catálogo, mas episódio exige login.
 * 2. Trial ativo: episódios 1 e 2 de cada série grátis; 3+ bloqueado.
 * 3. Trial expirado sem assinatura: tudo bloqueado.
 * 4. Assinatura ativa: acesso total.
 */
export function canWatchEpisode(
  userId: string | null,
  profile: Profile | null,
  subscription: Subscription | null,
  episode: Pick<Episode, "number">
): AccessResult {
  if (!userId) return { allowed: false, reason: "anonymous" };
  if (isSubscriptionActive(subscription)) return { allowed: true };
  if (isTrialActive(profile)) {
    if (episode.number <= FREE_EPISODES_PER_SERIES) return { allowed: true };
    return { allowed: false, reason: "trial_episode_locked" };
  }
  return { allowed: false, reason: "trial_expired" };
}

export function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}
