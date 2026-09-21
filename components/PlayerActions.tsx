"use client";

import { usePlayerActions } from "./usePlayerActions";
import { CheckIcon, HeartIcon, PlusIcon, ShareIcon } from "./icons";

interface PlayerActionsProps {
  /** quando ausente, a curtida vale para a SÉRIE (modo teaser) */
  episodeId?: string;
  seriesId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  initialListed: boolean;
  shareTitle: string;
  /** caminho absoluto da página (ex.: /assistir/slug/1 ou /assistir/slug/teaser) */
  sharePath: string;
}

/**
 * Rail vertical de ações do player mobile (Curtir · Lista · Enviar), na
 * borda direita do palco. Lógica compartilhada em usePlayerActions.
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
  const { liked, likeCount, listed, copied, toggleLike, toggleList, share } =
    usePlayerActions({
      episodeId,
      seriesId,
      initialLiked,
      initialLikeCount,
      initialListed,
      loginNext: sharePath,
    });

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
          onClick={() => share(shareTitle, sharePath)}
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
