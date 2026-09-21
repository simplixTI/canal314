import Link from "next/link";
import { PRICE_LABEL, type AccessDeniedReason } from "@/lib/access";

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

export default function Paywall({ reason }: { reason: AccessDeniedReason }) {
  const message = MESSAGES[reason];
  const href = reason === "anonymous" ? "/login" : "/assinar";
  const cta = reason === "anonymous" ? "Criar conta grátis" : `Assinar ${PRICE_LABEL}`;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-900 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-neutral-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-6 w-6"
            aria-hidden
          >
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
        </div>
        <h1 className="text-xl font-bold">{message.title}</h1>
        <p className="mt-2 text-sm text-neutral-400">{message.body}</p>
        <Link
          href={href}
          className="mt-6 block rounded-full bg-white px-6 py-3 font-semibold text-neutral-950 transition hover:bg-neutral-200"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
