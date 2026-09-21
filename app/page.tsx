import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { listSeries } from "@/lib/data";
import SeriesCard from "@/components/SeriesCard";
import SetupNotice from "@/components/SetupNotice";
import Logo from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();
  const series = supabase ? await listSeries(supabase) : [];

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-neutral-800 px-4 py-14 text-center sm:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <Logo className="h-20 sm:h-28" />
          <p className="mt-6 text-balance text-lg text-neutral-300 sm:text-xl">
            Micro-documentários verticais sobre os grandes nomes da fé e da
            política do Brasil. Episódios de 1 a 2 minutos, direto no seu
            celular.
          </p>
          <Link
            href="/login"
            className="mt-8 rounded-full bg-white px-8 py-3 text-base font-semibold text-neutral-950 transition hover:bg-neutral-200"
          >
            Começar teste grátis
          </Link>
          <p className="mt-3 text-xs text-neutral-500">
            3 dias grátis · 2 episódios liberados por série · sem cartão
          </p>
        </div>
      </section>

      {/* Catálogo */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="mb-6 text-xl font-bold sm:text-2xl">Séries</h2>
        {!supabase ? (
          <SetupNotice />
        ) : series.length === 0 ? (
          <p className="text-sm text-neutral-400">
            Nenhuma série cadastrada ainda. Rode{" "}
            <code className="rounded bg-neutral-800 px-1">supabase/seed.sql</code>{" "}
            no SQL Editor do Supabase para carregar os exemplos.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {series.map((s) => (
              <SeriesCard key={s.id} series={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
