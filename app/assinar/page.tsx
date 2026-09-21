import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile, getSubscription, getUser } from "@/lib/data";
import {
  isSubscriptionActive,
  isTrialActive,
  trialDaysRemaining,
} from "@/lib/access";
import SubscribeButton from "@/components/SubscribeButton";
import SetupNotice from "@/components/SetupNotice";

export const dynamic = "force-dynamic";

const BENEFITS = [
  "Acesso a todos os episódios de todas as séries",
  "Novos episódios e séries toda semana",
  "Player vertical otimizado para o celular",
  "Sem anúncios",
  "Cancele quando quiser",
];

export default async function SubscribePage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <SetupNotice />
      </div>
    );
  }

  const user = await getUser(supabase);
  if (!user) redirect("/login?next=/assinar");

  const [profile, subscription] = await Promise.all([
    getProfile(supabase, user.id),
    getSubscription(supabase, user.id),
  ]);

  const active = isSubscriptionActive(subscription);
  const trial = isTrialActive(profile);

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-900 p-8">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Canal314 Premium
        </p>
        <div className="mt-4 text-center">
          <span className="text-5xl font-black tracking-tight">R$19,90</span>
          <span className="text-neutral-400">/mês</span>
        </div>

        {trial && (
          <p className="mt-3 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-center text-xs text-neutral-300">
            Seu teste grátis ainda tem {trialDaysRemaining(profile)}{" "}
            {trialDaysRemaining(profile) === 1 ? "dia" : "dias"} — assine agora e
            libere tudo.
          </p>
        )}

        <ul className="mt-6 space-y-3">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 font-bold" aria-hidden>
                ✓
              </span>
              <span className="text-neutral-200">{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          {active ? (
            <div className="text-center">
              <p className="rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-sm">
                Sua assinatura já está ativa ✓
              </p>
              <Link
                href="/"
                className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
              >
                Voltar ao catálogo
              </Link>
            </div>
          ) : (
            <SubscribeButton />
          )}
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-neutral-500">
          Pagamento simulado nesta versão (ambiente de testes). A cobrança real
          será ativada em breve.
        </p>
      </div>
    </div>
  );
}
