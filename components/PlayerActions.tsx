"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  CheckIcon,
  HeartIcon,
  PlusIcon,
  ShareIcon,
} from "./icons";

interface PlayerActionsProps {
  episodeId: string;
  seriesId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  initialListed: boolean;
  shareTitle: string;
  /** caminho absoluto da página do episódio (ex.: /assistir/slug/1) */
  sharePath: string;
}

/**
 * Rail vertical de ações do player (Curtir · Lista · Enviar), na borda
 * direita do palco. Todas as ações são reais e otimistas: a UI responde
 * na hora e desfaz se o Supabase falhar.
 */
export default function PlayerActions({
  episodeId,
  seriesId,
  initialLiked,
  initialLikeCount,
  initialListed,
  shareTitle,
  sharePath,
}: PlayerActionsProps) {
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
      router.push(`/login?next=${sharePath}`);
      return;
    }
    const supabase = createClient();
    const { error } = nextLiked
      ? await supabase.from("episode_likes").insert({ user_id: userId, episode_id: episodeId })
      : await supabase.from("episode_likes").delete().eq("user_id", userId).eq("episode_id", episodeId);

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
      router.push(`/login?next=${sharePath}`);
      return;
    }
    const supabase = createClient();
    const { error } = nextListed
      ? await supabase.from("list_entries").insert({ user_id: userId, series_id: seriesId })
      : await supabase.from("list_entries").delete().eq("user_id", userId).eq("series_id", seriesId);

    if (error) setListed(!nextListed);
  }

  async function share() {
    const url = `${window.location.origin}${sharePath}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url });
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

  const buttonClass =
    "pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border bg-black/40 backdrop-blur-sm transition";
  const captionClass = "micro-label text-[9px] text-white/60";

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Curtir */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={toggleLike}
          aria-label={liked ? "Remover curtida" : "Curtir episódio"}
          aria-pressed={liked}
          className={`${buttonClass} ${
            liked
              ? "border-accent text-accent"
              : "border-white/30 text-white/80 hover:border-white"
          }`}
        >
          <HeartIcon filled={liked} className="h-5 w-5" />
        </button>
        <span className="text-[11px] font-semibold text-white/80">{likeCount}</span>
        <span className={captionClass}>Curtir</span>
      </div>

      {/* Minha Lista */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={toggleList}
          aria-label={listed ? "Remover série da Minha Lista" : "Adicionar série à Minha Lista"}
          aria-pressed={listed}
          className={`${buttonClass} ${
            listed
              ? "border-white bg-white text-black"
              : "border-white/30 text-white/80 hover:border-white"
          }`}
        >
          {listed ? <CheckIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
        </button>
        <span className={captionClass}>Lista</span>
      </div>

      {/* Enviar */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={share}
          aria-label="Compartilhar episódio"
          className={`${buttonClass} border-white/30 text-white/80 hover:border-white`}
        >
          <ShareIcon className="h-5 w-5" />
        </button>
        <span className={captionClass}>{copied ? "Link copiado" : "Enviar"}</span>
      </div>
    </div>
  );
}
