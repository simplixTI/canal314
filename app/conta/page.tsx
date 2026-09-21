import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getContinueWatching,
  getProfile,
  getSubscription,
  getUser,
} from "@/lib/data";
import {
  formatDuration,
  isSubscriptionActive,
  isTrialActive,
  trialDaysRemaining,
  trialEndsAt,
} from "@/lib/access";
import {
  CancelSubscriptionButton,
  LogoutButton,
} from "@/components/AccountActions";
import SetupNotice from "@/components/SetupNotice";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = createClient();
  if (!supabase) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <SetupNotice />
      </div>
    );
  }

  const user = await getUser(supabase);
  if (!user) redirect("/login?next=/conta");

  const [profile, subscription, continueWatching] = await Promise.all([
    getProfile(supabase, user.id),
    getSubscription(supabase, user.id),
    getContinueWatching(supabase, user.id),
  ]);

  const active = isSubscriptionActive(subscription);
  const trial = isTrialActive(profile);
  const daysLeft = trialDaysRemaining(profile);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">Minha conta</h1>
      <p className="mt-1 text-sm text-neutral-400">{user.email}</p>

      {/* Status do plano */}
      <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Seu plano
        </h2>
        {active ? (
          <div className="mt-3">
            <p className="font-semibold">
              Assinatura ativa ✓{" "}
              <span className="text-sm font-normal text-neutral-400">
                ({subscription?.provider === "mock" ? "simulada" : subscription?.provider})
              </span>
            </p>
            {subscription?.current_period_end && (
              <p className="mt-1 text-sm text-neutral-400">
                Válida até{" "}
                {new Date(subscription.current_period_end).toLocaleDateString("pt-BR")}
              </p>
            )}
            <div className="mt-4">
              <CancelSubscriptionButton />
            </div>
          </div>
        ) : trial ? (
          <div className="mt-3">
            <p className="font-semibold">Teste grátis ativo</p>
            <p className="mt-1 text-sm text-neutral-400">
              Restam {daysLeft} {daysLeft === 1 ? "dia" : "dias"} · episódios 1 e 2
              de cada série liberados
            </p>
            <Link
              href="/assinar"
              className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              Assinar agora
            </Link>
          </div>
        ) : (
          <div className="mt-3">
            <p className="font-semibold">Teste grátis expirado</p>
            <p className="mt-1 text-sm text-neutral-400">
              {profile
                ? `Terminou em ${trialEndsAt(profile).toLocaleDateString("pt-BR")}.`
                : ""}{" "}
              Assine para continuar assistindo.
            </p>
            <Link
              href="/assinar"
              className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              Assinar R$19,90/mês
            </Link>
          </div>
        )}
      </section>

      {/* Continuar assistindo */}
      <section className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">
          Continuar assistindo
        </h2>
        {continueWatching.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-500">
            Você ainda não assistiu nenhum episódio.{" "}
            <Link href="/" className="underline underline-offset-4">
              Explorar séries
            </Link>
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {continueWatching.map((item) => (
              <li key={item.episode.id}>
                <Link
                  href={`/assistir/${item.series.slug}/${item.episode.number}`}
                  className="flex items-center gap-3 rounded-lg border border-neutral-800 px-3 py-2.5 transition hover:border-neutral-500"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-800 text-sm font-bold">
                    {item.episode.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {item.series.title} — {item.episode.title}
                    </span>
                    <span className="block text-xs text-neutral-500">
                      {formatDuration(item.episode.duration_seconds)} min · visto em{" "}
                      {new Date(item.watched_at).toLocaleDateString("pt-BR")}
                    </span>
                  </span>
                  <span className="text-neutral-500" aria-hidden>
                    ▶
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6">
        <LogoutButton />
      </div>
    </div>
  );
}
