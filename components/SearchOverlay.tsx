"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getTeaser } from "@/lib/teasers";
import type { Series } from "@/lib/types";
import PosterArt, { categoryLabel } from "./PosterArt";
import { SearchIcon, XIcon } from "./icons";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Busca real de séries por título (ilike no Supabase, debounce 300ms).
 * Overlay full-screen preto; Esc/X/backdrop fecham; fecha ao navegar.
 */
export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<(Series & { episode_count: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Fecha ao navegar
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Autofocus + Esc + trava de scroll
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // Busca com debounce
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = window.setTimeout(async () => {
      const supabase = createClient();
      const [{ data: series }, { data: episodes }] = await Promise.all([
        supabase.from("series").select("*").ilike("title", `%${q}%`).limit(10),
        supabase.from("episodes").select("series_id"),
      ]);
      const counts = new Map<string, number>();
      (episodes ?? []).forEach((ep: { series_id: string }) => {
        counts.set(ep.series_id, (counts.get(ep.series_id) ?? 0) + 1);
      });
      setResults(
        ((series ?? []) as Series[]).map((s) => ({
          ...s,
          episode_count: counts.get(s.id) ?? 0,
        }))
      );
      setSearched(true);
      setLoading(false);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Buscar séries"
      className="fixed inset-0 z-[70] flex flex-col bg-[#0a0a0a] lg:hidden"
    >
      {/* Campo */}
      <div className="flex items-center gap-3 border-b border-white/15 px-5 py-4">
        <SearchIcon className="h-5 w-5 shrink-0 text-white/50" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque por título"
          aria-label="Buscar série por título"
          className="w-full bg-transparent text-base text-white outline-none placeholder:text-white/35"
        />
        <button
          onClick={onClose}
          aria-label="Fechar busca"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/70 transition hover:border-white hover:text-white"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Resultados */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {query.trim().length < 2 ? (
          <p className="mt-8 text-center text-sm text-white/45">
            Busque por título — ex.: &quot;Vargas&quot;, &quot;Cícero&quot;,
            &quot;Lula&quot;
          </p>
        ) : loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex animate-pulse items-center gap-4">
                <div className="aspect-[16/10] w-24 bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-2/3 bg-white/10" />
                  <div className="h-2.5 w-1/3 bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : searched && results.length === 0 ? (
          <p className="mt-8 text-center text-sm text-white/45">
            Nenhuma série encontrada para &quot;{query.trim()}&quot;.
          </p>
        ) : (
          <ol className="space-y-1">
            {results.map((s) => {
              const playable = s.episode_count > 0 || Boolean(getTeaser(s.slug));
              const row = (
                <>
                  <div className="relative aspect-[16/10] w-24 shrink-0 overflow-hidden border border-white/10">
                    <PosterArt
                      slug={s.slug}
                      title={s.title}
                      category={s.category}
                      thumbnail={s.thumbnail || `/thumbnails/${s.slug}.jpg`}
                      size="thumb"
                    />
                  </div>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white">
                      {s.title}
                    </span>
                    <span className="micro-label mt-1 block text-[9px] text-white/50">
                      {categoryLabel(s.category)}
                    </span>
                  </span>
                </>
              );
              return (
                <li key={s.id}>
                  {playable ? (
                    <Link
                      href={`/serie/${s.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 py-2.5 transition hover:bg-white/[0.04]"
                    >
                      {row}
                    </Link>
                  ) : (
                    <div className="flex cursor-default items-center gap-4 py-2.5">
                      {row}
                      <span className="micro-label shrink-0 bg-white px-2 py-1 text-[9px] text-black">
                        Em breve
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
