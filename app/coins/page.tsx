import { createClient } from "@/lib/supabase/server";
import { getCoinBalance, getUser } from "@/lib/data";
import { COIN_PACKS } from "@/lib/coins";
import { UNLOCK_COST } from "@/lib/access";
import BuyPackButton from "@/components/BuyPackButton";
import SetupNotice from "@/components/SetupNotice";
import { CoinIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function CoinsPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <SetupNotice />
      </div>
    );
  }

  const user = await getUser(supabase);
  const balance = user ? await getCoinBalance(supabase, user.id) : null;

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 pb-16 pt-32">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-10 -top-8 select-none font-[family-name:var(--font-display)] text-[15rem] font-bold leading-none text-white/[0.04]"
      >
        314
      </span>
      <div className="relative w-full max-w-sm">
        <h1 className="text-center font-[family-name:var(--font-display)] text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
          314Coins
        </h1>
        <p className="mt-3 text-center text-sm text-white/55">
          Desbloqueie episódios avulsos · {UNLOCK_COST} coins por episódio
        </p>

        {/* Saldo */}
        <div className="mt-8 flex items-center justify-center gap-3 border border-white/15 px-6 py-5">
          <CoinIcon className="h-8 w-8 text-accent" />
          {balance !== null ? (
            <>
              <span className="font-[family-name:var(--font-display)] text-5xl font-semibold leading-none tracking-[-0.02em]">
                {balance}
              </span>
              <span className="micro-label text-white/50">seu saldo</span>
            </>
          ) : (
            <span className="text-sm text-white/55">
              Entre para ver seu saldo e comprar coins
            </span>
          )}
        </div>

        {/* Pacotes */}
        <div className="mt-8 space-y-3">
          {COIN_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`relative border p-5 ${
                pack.popular ? "border-accent" : "border-white/15"
              }`}
            >
              {pack.popular && (
                <span className="micro-label absolute -top-2.5 left-4 bg-[#0a0a0a] px-2 text-[9px] text-accent">
                  Mais popular
                </span>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CoinIcon className="h-7 w-7 text-accent" />
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-2xl font-semibold leading-none">
                      {pack.coins}
                    </p>
                    <p className="mt-1 text-xs text-white/50">coins</p>
                  </div>
                </div>
                <p className="font-[family-name:var(--font-display)] text-xl font-medium text-white/85">
                  {pack.priceLabel}
                </p>
              </div>
              <div className="mt-4">
                <BuyPackButton packId={pack.id} popular={pack.popular} />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-white/40">
          Pagamento simulado — gateway real em breve.
        </p>
      </div>
    </div>
  );
}
