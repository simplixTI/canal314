"use client";

import Link from "next/link";
import { FREE_EPISODES_PER_SERIES, UNLOCK_COST } from "@/lib/access";
import { usePlayerActions } from "./usePlayerActions";
import { categoryLabel } from "./PosterArt";
import {
  CheckIcon,
  CoinIcon,
  HeartIcon,
  LockIcon,
  PlusIcon,
  ShareIcon,
} from "./icons";

interface EpisodeSidebarProps {
  series: {
    id: string;
    slug: string;
    title: string;
    category: string;
    description: string;
  };
  episode: {
    id: string;
    number: number;
    title: string;
  };
  episodeNumbers: number[];
  initialLiked: boolean;
  initialLikeCount: number;
  initialListed: boolean;
  hasTeaser: boolean;
}

/**
 * Sidebar desktop da página de episódio (layout ReelShort watch):
 * breadcrumb, título, sinopse da série, chips, ações reais
 * (Curtir · Lista · Enviar — mesma lógica do rail mobile) e grade
 * numerada de episódios com o atual em laranja.
 */
export default function EpisodeSidebar({
  series,
  episode,
  episodeNumbers,
  initialLiked,
  initialLikeCount,
  initialListed,
  hasTeaser,
}: EpisodeSidebarProps) {
  const sharePath = `/assistir/${series.slug}/${episode.number}`;
  const { liked, likeCount, listed, copied, toggleLike, toggleList, share } =
    usePlayerActions({
      episodeId: episode.id,
      seriesId: series.id,
      initialLiked,
      initialLikeCount,
      initialListed,
      loginNext: sharePath,
    });

  return (
    <div>
      {/* Breadcrumb */}
      <p className="micro-label text-white/45">
        <Link href="/" className="transition hover:text-accent">
          Início
        </Link>
        <span className="mx-2 text-white/25">/</span>
        <Link href={`/serie/${series.slug}`} className="transition hover:text-accent">
          {series.title}
        </Link>
        <span className="mx-2 text-white/25">/</span>
        <span className="text-white/70">Episódio {episode.number}</span>
      </p>

      {/* Título */}
      <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
        Episódio {episode.number} — {episode.title}
      </h1>
      <p className="mt-3 text-sm text-white/55">{series.title}</p>

      {/* Sinopse da série */}
      <p className="micro-label mt-8 text-white/50">Sobre a série</p>
      <p className="mt-3 text-sm leading-relaxed text-white/60">
        {series.description}
      </p>

      {/* Chips */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="micro-label border border-white/30 px-2.5 py-1.5 text-[10px] text-white/85">
          {categoryLabel(series.category)}
        </span>
        <span className="micro-label border border-white/15 px-2.5 py-1.5 text-[10px] text-white/60">
          {episodeNumbers.length}{" "}
          {episodeNumbers.length === 1 ? "episódio" : "episódios"}
        </span>
        <span className="micro-label border border-white/15 px-2.5 py-1.5 text-[10px] text-white/60">
          1–2 min
        </span>
      </div>

      {/* Ações */}
      <div className="mt-7 flex items-center gap-6 border-b border-white/10 pb-7">
        <button
          onClick={toggleLike}
          aria-label={liked ? "Remover curtida" : "Curtir episódio"}
          aria-pressed={liked}
          className="group flex items-center gap-2"
        >
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
              liked
                ? "border-accent text-accent"
                : "border-white/30 text-white/80 group-hover:border-white"
            }`}
          >
            <HeartIcon filled={liked} className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold text-white/80">{likeCount}</span>
          <span className="micro-label text-[9px] text-white/50">Curtir</span>
        </button>
        <button
          onClick={toggleList}
          aria-label={listed ? "Remover série da Minha Lista" : "Adicionar série à Minha Lista"}
          aria-pressed={listed}
          className="group flex items-center gap-2"
        >
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${
              listed
                ? "border-white bg-white text-black"
                : "border-white/30 text-white/80 group-hover:border-white"
            }`}
          >
            {listed ? <CheckIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
          </span>
          <span className="micro-label text-[9px] text-white/50">Lista</span>
        </button>
        <button
          onClick={() =>
            share(
              `${series.title} — Ep. ${episode.number}: ${episode.title}`,
              sharePath
            )
          }
          aria-label="Compartilhar episódio"
          className="group flex items-center gap-2"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white/80 transition group-hover:border-white">
            <ShareIcon className="h-5 w-5" />
          </span>
          <span className="micro-label text-[9px] text-white/50">
            {copied ? "Link copiado" : "Enviar"}
          </span>
        </button>
      </div>

      {/* Grade de episódios */}
      <p className="micro-label mt-7 text-white/50">
        Episódios · {episodeNumbers.length}
      </p>
      <div className="mt-4 grid grid-cols-6 gap-2">
        {hasTeaser && (
          <Link
            href={`/assistir/${series.slug}/teaser`}
            className="flex h-11 items-center justify-center border border-white/25 text-[10px] font-semibold uppercase tracking-wide text-white/70 transition hover:border-accent hover:text-accent"
          >
            Teaser
          </Link>
        )}
        {episodeNumbers.map((n) => {
          const current = n === episode.number;
          const free = n <= FREE_EPISODES_PER_SERIES;
          return (
            <Link
              key={n}
              href={`/assistir/${series.slug}/${n}`}
              aria-current={current ? "page" : undefined}
              aria-label={
                free ? `Episódio ${n}` : `Episódio ${n} (bloqueado, ${UNLOCK_COST} coins)`
              }
              className={`flex h-11 items-center justify-center gap-1 text-sm font-semibold transition ${
                current
                  ? "bg-accent text-white"
                  : free
                    ? "border border-white/25 text-white/80 hover:border-white"
                    : "border border-white/15 text-white/45 hover:border-accent hover:text-accent"
              }`}
            >
              {n}
              {!free && !current && <LockIcon className="h-3 w-3" />}
            </Link>
          );
        })}
      </div>
      <p className="mt-4 flex items-center gap-1.5 text-xs text-white/40">
        Episódios 1 e 2 grátis · demais com 314 Pass ou {UNLOCK_COST}
        <CoinIcon className="h-3.5 w-3.5 text-accent" />
      </p>
    </div>
  );
}
