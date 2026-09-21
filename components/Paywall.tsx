import Link from "next/link";
import { UNLOCK_COST, PRICE_LABEL, type AccessDeniedReason } from "@/lib/access";
import UnlockButton from "./UnlockButton";
import { CoinIcon, LockIcon } from "./icons";

interface PaywallProps {
  reason: AccessDeniedReason;
  seriesTitle?: string;
  seriesSlug?: string;
  episodeId?: string;
  coinBalance?: number;
  loginNext?: string;
}

/**
 * Bloqueio de episódio (modelo 314Coins + 314 Pass):
 * (a) anônimo no ep 3+ → criar conta;
 * (b) logado com saldo ≥ 30 → desbloquear com coins;
 * (c) logado com saldo < 30 → comprar 314Coins.
 */
export default function Paywall({
  reason,
  seriesTitle,
  seriesSlug,
  episodeId,
  coinBalance = 0,
  loginNext = "/",
}: PaywallProps) {
  const canAfford = coinBalance >= UNLOCK_COST;

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

        {reason === "anonymous" ? (
          <>
            <h1 className="mt-8 font-[family-name:var(--font-display)] text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
              Crie sua conta para continuar
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Os episódios 1 e 2 são grátis para todos. Para seguir assistindo,
              entre ou crie sua conta grátis.
            </p>
            <Link
              href={`/login?next=${loginNext}`}
              className="mt-8 block bg-accent px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-accent-hover"
            >
              Entrar ou criar conta
            </Link>
          </>
        ) : canAfford && episodeId ? (
          <>
            <h1 className="mt-8 font-[family-name:var(--font-display)] text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
              Episódio bloqueado
            </h1>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm leading-relaxed text-white/60">
              Saldo: {coinBalance}
              <CoinIcon className="h-4 w-4 text-accent" />
            </p>
            <div className="mt-8">
              <UnlockButton episodeId={episodeId} />
            </div>
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/15" />
              <span className="micro-label text-white/40">ou</span>
              <div className="h-px flex-1 bg-white/15" />
            </div>
            <Link
              href="/assinar"
              className="text-sm text-white/70 underline decoration-white/30 transition hover:text-accent"
            >
              Libere tudo com o 314 Pass · {PRICE_LABEL}
            </Link>
          </>
        ) : (
          <>
            <h1 className="mt-8 font-[family-name:var(--font-display)] text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
              Saldo insuficiente
            </h1>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm leading-relaxed text-white/60">
              Você tem {coinBalance}
              <CoinIcon className="h-4 w-4" /> e este episódio custa {UNLOCK_COST}
              <CoinIcon className="h-4 w-4 text-accent" />
            </p>
            <Link
              href="/coins"
              className="mt-8 block bg-accent px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-accent-hover"
            >
              Comprar 314Coins
            </Link>
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/15" />
              <span className="micro-label text-white/40">ou</span>
              <div className="h-px flex-1 bg-white/15" />
            </div>
            <Link
              href="/assinar"
              className="text-sm text-white/70 underline decoration-white/30 transition hover:text-accent"
            >
              Libere tudo com o 314 Pass · {PRICE_LABEL}
            </Link>
          </>
        )}

        {seriesTitle && seriesSlug && (
          <Link
            href={`/serie/${seriesSlug}`}
            className="mt-6 inline-block text-sm text-white/50 underline decoration-white/20 transition hover:text-accent"
          >
            Voltar para {seriesTitle}
          </Link>
        )}
      </div>
    </div>
  );
}
