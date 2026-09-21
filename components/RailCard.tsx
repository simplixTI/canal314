"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SeriesWithCount } from "@/lib/types";
import { getTeaser } from "@/lib/teasers";
import { createClient } from "@/lib/supabase/client";
import PosterArt, { categoryLabel } from "./PosterArt";
import { CheckIcon, PlayIcon, PlusIcon, ShareIcon } from "./icons";

const OPEN_DELAY = 400;
const CLOSE_GRACE = 150;

/**
 * Card de fileira (rail): mini thumb paisagem 16:10 com a capa da série.
 * Desktop (hover: hover + pointer: fine): após ~400ms de hover, abre um
 * painel de preview em position:fixed sobre o card (escapa do overflow da
 * fileira) — pôster, ficha da série e ações reais (Reproduzir, Lista,
 * Enviar). Mobile/toque: nada muda, o toque navega como antes.
 */
export default function RailCard({ series }: { series: SeriesWithCount }) {
  const router = useRouter();
  const playable = series.episode_count > 0;
  const teaser = getTeaser(series.slug);
  const clickable = playable || Boolean(teaser);

  const cardRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const suppressUntilReenter = useRef(false);
  const hoverCapable = useRef(false);

  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number; width: number } | null>(null);
  const [listed, setListed] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    hoverCapable.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onScroll() {
      // Fecha na hora e não reabre até o mouse sair e reentrar no card
      suppressUntilReenter.current = true;
      window.clearTimeout(openTimer.current);
      setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  async function fetchListed() {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("list_entries")
      .select("user_id")
      .eq("user_id", user.id)
      .eq("series_id", series.id)
      .maybeSingle();
    setListed(Boolean(data));
  }

  function handleEnter() {
    if (!hoverCapable.current) return;
    suppressUntilReenter.current = false;
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => {
      if (suppressUntilReenter.current) return;
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const width = Math.min(rect.width * 1.35, 360);
      const left = Math.min(
        Math.max(rect.left + rect.width / 2 - width / 2, 8),
        vw - width - 8
      );
      const estHeight = width * 0.625 + 260;
      const top = Math.min(
        Math.max(rect.top - 8, 8),
        Math.max(vh - estHeight - 8, 8)
      );
      setPos({ left, top, width });
      setOpen(true);
      fetchListed();
    }, OPEN_DELAY);
  }

  function handleLeave() {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_GRACE);
  }

  function cancelClose() {
    window.clearTimeout(closeTimer.current);
  }

  async function toggleList() {
    const next = !listed;
    setListed(next);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setListed(listed);
      router.push("/login?next=/");
      return;
    }
    const { error } = next
      ? await supabase
          .from("list_entries")
          .insert({ user_id: user.id, series_id: series.id })
      : await supabase
          .from("list_entries")
          .delete()
          .eq("user_id", user.id)
          .eq("series_id", series.id);
    if (error) setListed(!next);
  }

  async function share() {
    const url = `${window.location.origin}/serie/${series.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: series.title, url });
      } catch {
        // usuário cancelou — nada a fazer
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

  const art = (
    <>
      <div className="relative aspect-[16/10] w-52 overflow-hidden border border-white/10 transition group-hover:border-white/35 sm:w-64">
        <PosterArt
          slug={series.slug}
          title={series.title}
          category={series.category}
          thumbnail={series.thumbnail || undefined}
          size="thumb"
        />
        {!playable && !teaser && (
          <span className="micro-label absolute left-2 top-2 bg-white px-2 py-1 text-[9px] text-black">
            Em breve
          </span>
        )}
        {!playable && teaser && (
          <span className="micro-label absolute left-2 top-2 bg-accent px-2 py-1 text-[9px] text-white">
            Teaser grátis
          </span>
        )}
      </div>
      <p className="mt-2.5 w-52 truncate text-sm font-semibold text-white sm:w-64">
        {series.title}
      </p>
      <p className="mt-0.5 text-xs text-white/50">
        {playable
          ? `${series.episode_count} ${series.episode_count === 1 ? "episódio" : "episódios"}`
          : teaser
            ? "Assista ao teaser"
            : "Em breve no catálogo"}
      </p>
    </>
  );

  return (
    <div
      ref={cardRef}
      className="shrink-0"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {clickable ? (
        <Link href={`/serie/${series.slug}`} className="group block">
          {art}
        </Link>
      ) : (
        <div className="cursor-default">{art}</div>
      )}

      {open && pos && (
        <div
          role="dialog"
          aria-label={`Preview da série ${series.title}`}
          className="preview-in fixed z-50 border border-white/15 bg-[#0c0c0c] shadow-[0_16px_48px_rgba(0,0,0,0.7)]"
          style={{ left: pos.left, top: pos.top, width: pos.width }}
          onMouseEnter={cancelClose}
          onMouseLeave={handleLeave}
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <PosterArt
              slug={series.slug}
              title={series.title}
              category={series.category}
              thumbnail={series.thumbnail || undefined}
              size="thumb"
            />
          </div>
          <div className="p-4">
            <p className="micro-label text-white/50">
              {categoryLabel(series.category)} · {series.episode_count}{" "}
              {series.episode_count === 1 ? "episódio" : "episódios"} · 1–2 min
            </p>
            <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-white">
              {series.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/60">
              {series.description}
            </p>

            <div className="mt-4 flex items-center gap-2.5">
              {playable ? (
                <Link
                  href={`/assistir/${series.slug}/1`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-accent-hover"
                >
                  <PlayIcon className="h-3.5 w-3.5" />
                  Reproduzir
                </Link>
              ) : teaser ? (
                <Link
                  href={`/assistir/${series.slug}/teaser`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-accent-hover"
                >
                  <PlayIcon className="h-3.5 w-3.5" />
                  Reproduzir
                </Link>
              ) : (
                <span className="micro-label flex flex-1 items-center justify-center bg-white px-5 py-3 text-[9px] text-black">
                  Em breve
                </span>
              )}
              <button
                onClick={toggleList}
                aria-label={
                  listed
                    ? "Remover série da Minha Lista"
                    : "Adicionar série à Minha Lista"
                }
                aria-pressed={listed}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
                  listed
                    ? "border-white bg-white text-black"
                    : "border-white/30 text-white/80 hover:border-white"
                }`}
              >
                {listed ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  <PlusIcon className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={share}
                aria-label="Compartilhar série"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white/80 transition hover:border-white"
              >
                <ShareIcon className="h-4 w-4" />
              </button>
            </div>
            {copied && (
              <p className="micro-label mt-3 text-center text-[9px] text-accent">
                Link copiado
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
