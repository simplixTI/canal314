import { createClient } from "@/lib/supabase/server";
import { listSeries } from "@/lib/data";
import FeedCard from "@/components/FeedCard";
import SetupNotice from "@/components/SetupNotice";

export const dynamic = "force-dynamic";

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

  return (
    <div className="no-scrollbar h-dvh snap-y snap-mandatory overflow-y-auto">
      {series.map((s, i) => (
        <FeedCard
          key={s.id}
          series={s}
          first={i === 0}
          last={i === series.length - 1}
        />
      ))}
    </div>
  );
}
