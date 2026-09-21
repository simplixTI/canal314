"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface UsePlayerActionsArgs {
  /** quando ausente, a curtida vale para a SÉRIE (modo teaser) */
  episodeId?: string;
  seriesId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  initialListed: boolean;
  /** para onde voltar após o login, se a ação exigir sessão */
  loginNext: string;
}

/**
 * Lógica compartilhada das ações do player (Curtir · Lista · Enviar):
 * toggles otimistas com rollback, redirect para login sem sessão e
 * compartilhamento com fallback de clipboard. Usada pelo rail mobile
 * (PlayerActions) e pela sidebar desktop (EpisodeSidebar).
 */
export function usePlayerActions({
  episodeId,
  seriesId,
  initialLiked,
  initialLikeCount,
  initialListed,
  loginNext,
}: UsePlayerActionsArgs) {
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [listed, setListed] = useState(initialListed);
  const [copied, setCopied] = useState(false);

  async function getUserId(): Promise<string | null> {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id ?? null;
  }

  async function toggleLike() {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((c) => c + (nextLiked ? 1 : -1));

    const userId = await getUserId();
    if (!userId) {
      router.push(`/login?next=${loginNext}`);
      return;
    }
    const supabase = createClient();
    const { error } = episodeId
      ? nextLiked
        ? await supabase.from("episode_likes").insert({ user_id: userId, episode_id: episodeId })
        : await supabase.from("episode_likes").delete().eq("user_id", userId).eq("episode_id", episodeId)
      : nextLiked
        ? await supabase.from("series_likes").insert({ user_id: userId, series_id: seriesId })
        : await supabase.from("series_likes").delete().eq("user_id", userId).eq("series_id", seriesId);

    if (error) {
      setLiked(!nextLiked);
      setLikeCount((c) => c + (nextLiked ? -1 : 1));
    }
  }

  async function toggleList() {
    const nextListed = !listed;
    setListed(nextListed);

    const userId = await getUserId();
    if (!userId) {
      router.push(`/login?next=${loginNext}`);
      return;
    }
    const supabase = createClient();
    const { error } = nextListed
      ? await supabase.from("list_entries").insert({ user_id: userId, series_id: seriesId })
      : await supabase.from("list_entries").delete().eq("user_id", userId).eq("series_id", seriesId);

    if (error) setListed(!nextListed);
  }

  async function share(title: string, path: string) {
    const url = `${window.location.origin}${path}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // usuário cancelou o compartilhamento — nada a fazer
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard indisponível — sem ação
    }
  }

  return { liked, likeCount, listed, copied, toggleLike, toggleList, share };
}
