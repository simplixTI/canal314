import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscription, getUser } from "@/lib/data";
import { isSubscriptionActive } from "@/lib/access";
import SubscribeButton from "@/components/SubscribeButton";
import SetupNotice from "@/components/SetupNotice";
import { CheckIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

const BENEFITS = [
  "Todos os episódios liberados, sem gastar coins",
  "Novos episódios e séries toda semana",
  "Player vertical otimizado para o celular",
  "Sem anúncios",
  "Cancele quando quiser",
];

export default async function SubscribePage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <SetupNotice />
      </div>
    );
  }

  const user = await getUser(supabase);
  if (!user) redirect("/login?next=/assinar");

  const subscription = await getSubscription(supabase, user.id);
  const active = isSubscriptionActive(subscription);

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-10 -top-8 select-none font-[family-name:var(--font-display)] text-[15rem] font-bold leading-none text-white/[0.04]"
      >
        314
      </span>
      <div className="relative w-full max-w-xs">
        <h1 className="text-center font-[family-name:var(--font-display)] text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
          314 Pass
        </h1>

        <div className="mt-8 flex items-end justify-center gap-2">
          <span className="font-[family-name:var(--font-display)] text-7xl font-semibold leading-none tracking-[-0.02em]">
            19,90
          </span>
          <span className="pb-1.5 text-sm text-white/55">R$/mês</span>
        </div>

        <ul className="mt-8 space-y-4 border-t border-white/10 pt-8">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm">
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span className="text-white/75">{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          {active ? (
            <div className="text-center">
              <p className="border border-white/30 px-4 py-3 text-sm font-semibold">
                Seu 314 Pass já está ativo
              </p>
              <Link
                href="/"
                className="mt-5 inline-block text-sm text-white/60 underline decoration-white/30 transition hover:text-accent"
              >
                Voltar ao catálogo
              </Link>
            </div>
          ) : (
            <SubscribeButton />
          )}
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-white/40">
          Pagamento simulado nesta versão (ambiente de testes). A cobrança real
          será ativada em breve.
        </p>
      </div>
    </div>
  );
}
