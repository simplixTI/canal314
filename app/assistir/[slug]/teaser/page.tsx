import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSeriesBySlug } from "@/lib/data";
import { getTeaser } from "@/lib/teasers";
import SetupNotice from "@/components/SetupNotice";
import { ChevronLeftIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function TeaserPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const teaser = getTeaser(slug);
  if (!teaser) notFound();

  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <SetupNotice />
      </div>
    );
  }

  const series = await getSeriesBySlug(supabase, slug);
  if (!series) notFound();

  return (
    <div className="relative h-dvh overflow-hidden bg-black">
      {/* Teaser vertical cobrindo a tela (9:16 centralizado no desktop) */}
      <div className="absolute inset-0 mx-auto sm:max-w-[56.25dvh]">
        <video
          src={teaser.url}
          autoPlay
          playsInline
          controls
          className="h-full w-full object-cover"
        />
      </div>

      {/* Chrome superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto sm:max-w-[56.25dvh]">
        <div aria-hidden className="scrim-top absolute inset-0 h-24" />
        <div className="relative flex items-center justify-between px-5 py-4">
          <Link
            href={`/serie/${series.slug}`}
            className="pointer-events-auto flex min-w-0 items-center gap-1.5 text-white/85 transition hover:text-white"
          >
            <ChevronLeftIcon className="h-5 w-5 shrink-0" />
            <span className="truncate text-sm font-semibold">{series.title}</span>
          </Link>
          <span className="micro-label shrink-0 text-accent">Teaser grátis</span>
        </div>
      </div>

      {/* Chrome inferior */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto sm:max-w-[56.25dvh]">
        <div aria-hidden className="scrim-bottom absolute inset-0 h-32" />
        <div className="relative px-5 pb-6">
          <p className="text-sm font-medium text-white/85">
            Teaser · {teaser.duration} min
          </p>
          <Link
            href={`/assistir/${series.slug}/1`}
            className="pointer-events-auto mt-4 block bg-accent px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-accent-hover"
          >
            Assistir ao episódio 1 →
          </Link>
        </div>
      </div>
    </div>
  );
}
