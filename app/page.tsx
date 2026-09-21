import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { listSeries } from "@/lib/data";
import type { SeriesWithCount } from "@/lib/types";
import PosterArt, { categoryLabel } from "@/components/PosterArt";
import RailCard from "@/components/RailCard";
import SetupNotice from "@/components/SetupNotice";
import { FlameIcon, PlayIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

function Rail({
  title,
  flame,
  items,
  id,
}: {
  title: string;
  flame?: boolean;
  items: SeriesWithCount[];
  id?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section id={id} className="mt-12 scroll-mt-16">
      <div className="flex items-center gap-2 px-6">
        {flame && <FlameIcon className="h-4 w-4 text-accent" />}
        <h2 className="micro-label text-white/80">{title}</h2>
        <div className="ml-2 h-px flex-1 bg-white/10" aria-hidden />
      </div>
      <div className="no-scrollbar mt-5 flex gap-4 overflow-x-auto px-6 pb-2">
        {items.map((s) => (
          <RailCard key={s.id} series={s} />
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const supabase = await createClient();
  const series = supabase ? await listSeries(supabase) : [];

  if (!supabase) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <SetupNotice />
      </div>
    );
  }

  if (series.length === 0) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <p className="micro-label text-white/50">Catálogo</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-semibold uppercase tracking-[-0.02em]">
          Em breve
        </h1>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
          Nenhuma série cadastrada ainda. Rode{" "}
          <code className="border border-white/20 px-1.5 py-0.5 text-white/80">
            supabase/seed.sql
          </code>{" "}
          no SQL Editor do Supabase para carregar o catálogo.
        </p>
      </div>
    );
  }

  const hero = series.find((s) => s.display_order === 1) ?? series[0];
  const novidades = [...series]
    .sort((a, b) => b.display_order - a.display_order)
    .slice(0, 8);
  const maisAssistidos = [...series]
    .sort(
      (a, b) =>
        b.episode_count - a.episode_count || a.display_order - b.display_order
    )
    .slice(0, 8);
  const religioso = series.filter((s) => s.category === "religioso");
  const politico = series.filter((s) => s.category === "politico");

  return (
    <div className="pb-20">
      {/* Hero do carro-chefe */}
      <div className="relative h-[88dvh] overflow-hidden">
        <PosterArt
          slug={hero.slug}
          title={hero.title}
          category={hero.category}
          thumbnail={hero.thumbnail || undefined}
          priority
        />
        <div aria-hidden className="scrim-left absolute inset-0" />
        <div aria-hidden className="scrim-bottom absolute inset-0" />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-14">
          <div className="max-w-[560px]">
            <div className="flex items-center gap-2.5">
              <span className="micro-label bg-accent px-2.5 py-1.5 text-[10px] font-bold text-black">
                Novo
              </span>
              <span className="micro-label border border-white/35 px-2.5 py-1.5 text-[10px] text-white/85">
                {categoryLabel(hero.category)}
              </span>
            </div>
            <h1 className="mt-5 font-[family-name:var(--font-display)] text-5xl font-semibold uppercase leading-[0.95] tracking-[-0.02em] text-white">
              {hero.title}
            </h1>
            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-white/70">
              {hero.description}
            </p>
            <p className="mt-3 text-sm text-white/55">
              {hero.episode_count}{" "}
              {hero.episode_count === 1 ? "episódio" : "episódios"} · 1–2 min cada
            </p>
            <div className="mt-7 flex items-center gap-4">
              <Link
                href={`/assistir/${hero.slug}/1`}
                className="flex items-center gap-2.5 whitespace-nowrap rounded-full bg-accent px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-accent-hover"
              >
                <PlayIcon className="h-4 w-4" />
                Reproduzir
              </Link>
              <Link
                href="/login"
                className="whitespace-nowrap rounded-full border border-white/40 px-6 py-4 text-sm font-semibold text-white transition hover:border-accent hover:text-accent"
              >
                Criar conta grátis
              </Link>
            </div>
            <p className="mt-5 text-xs text-white/45">
              Episódios 1 e 2 grátis · desbloqueie com 314Coins · ou assine o
              314 Pass
            </p>
          </div>
        </div>
      </div>

      {/* Fileiras */}
      <Rail title="Novo Lançamento" items={novidades} />
      <Rail title="Mais Assistidos" flame items={maisAssistidos} />
      <Rail title="Religioso" items={religioso} id="categorias" />
      <Rail title="Político" items={politico} />
    </div>
  );
}
