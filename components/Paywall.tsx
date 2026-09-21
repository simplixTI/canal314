import Link from "next/link";
import { PRICE_LABEL, type AccessDeniedReason } from "@/lib/access";
import { LockIcon } from "./icons";

const MESSAGES: Record<AccessDeniedReason, { title: string; body: string }> = {
  anonymous: {
    title: "Entre para assistir",
    body: "Crie sua conta grátis e assista aos 2 primeiros episódios de cada série.",
  },
  trial_episode_locked: {
    title: "Episódio exclusivo para assinantes",
    body: `No período de teste você assiste aos 2 primeiros episódios de cada série. Assine por ${PRICE_LABEL} para liberar tudo.`,
  },
  trial_expired: {
    title: "Seu teste grátis terminou",
    body: `Assine por ${PRICE_LABEL} e continue assistindo a todas as séries, sem limites.`,
  },
};

export default function Paywall({
  reason,
  seriesTitle,
  seriesSlug,
}: {
  reason: AccessDeniedReason;
  seriesTitle?: string;
  seriesSlug?: string;
}) {
  const message = MESSAGES[reason];
  const href = reason === "anonymous" ? "/login" : "/assinar";
  const cta = reason === "anonymous" ? "Criar conta grátis" : `Assinar ${PRICE_LABEL}`;

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6">
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-8 select-none font-[family-name:var(--font-display)] text-[16rem] font-bold leading-none text-white/[0.04]"
      >
        314
      </span>
      <div className="relative w-full max-w-xs text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/25">
          <LockIcon className="h-6 w-6 text-white" />
        </div>
        <h1 className="mt-8 font-[family-name:var(--font-display)] text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
          {message.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/60">{message.body}</p>
        <Link
          href={href}
          className="mt-8 block bg-accent px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-accent-hover"
        >
          {cta}
        </Link>
        {seriesTitle && seriesSlug && (
          <Link
            href={`/serie/${seriesSlug}`}
            className="mt-5 inline-block text-sm text-white/60 underline decoration-white/30 transition hover:text-accent"
          >
            Voltar para {seriesTitle}
          </Link>
        )}
      </div>
    </div>
  );
}
