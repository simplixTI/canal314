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
import { PlayIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
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
    <div className="mx-auto w-full max-w-xl px-6 pb-16 pt-24">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold uppercase leading-[0.95] tracking-[-0.02em]">
        Minha conta
      </h1>
      <p className="mt-3 text-sm text-white/55">{user.email}</p>

      {/* Status do plano */}
      <section className="mt-10 border border-white/15 p-6">
        <p className="micro-label text-white/50">Seu plano</p>
        {active ? (
          <div className="mt-4">
            <p className="font-[family-name:var(--font-display)] text-2xl font-semibold uppercase tracking-[-0.02em]">
              Assinatura ativa
            </p>
            <p className="mt-2 text-sm text-white/55">
              {subscription?.provider === "mock"
                ? "Assinatura simulada (ambiente de testes)"
                : `Via ${subscription?.provider}`}
              {subscription?.current_period_end &&
                ` · válida até ${new Date(subscription.current_period_end).toLocaleDateString("pt-BR")}`}
            </p>
            <div className="mt-5">
              <CancelSubscriptionButton />
            </div>
          </div>
        ) : trial ? (
          <div className="mt-4">
            <p className="font-[family-name:var(--font-display)] text-2xl font-semibold uppercase tracking-[-0.02em]">
              Teste grátis ativo
            </p>
            <p className="mt-2 text-sm text-white/55">
              Restam {daysLeft} {daysLeft === 1 ? "dia" : "dias"} · episódios 1 e
              2 de cada série liberados
            </p>
            <Link
              href="/assinar"
              className="mt-5 block bg-accent px-6 py-3.5 text-center text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-accent-hover"
            >
              Assinar agora
            </Link>
          </div>
        ) : (
          <div className="mt-4">
            <p className="font-[family-name:var(--font-display)] text-2xl font-semibold uppercase tracking-[-0.02em]">
              Teste expirado
            </p>
            <p className="mt-2 text-sm text-white/55">
              {profile
                ? `Terminou em ${trialEndsAt(profile).toLocaleDateString("pt-BR")}.`
                : ""}{" "}
              Assine para continuar assistindo.
            </p>
            <Link
              href="/assinar"
              className="mt-5 block bg-accent px-6 py-3.5 text-center text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-accent-hover"
            >
              Assinar R$19,90/mês
            </Link>
          </div>
        )}
      </section>

      {/* Continuar assistindo */}
      <section className="mt-10">
        <p className="micro-label text-white/50">Continuar assistindo</p>
        {continueWatching.length === 0 ? (
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            Você ainda não assistiu nenhum episódio.{" "}
            <Link
              href="/"
              className="text-white underline decoration-white/40 transition hover:text-accent hover:decoration-accent"
            >
              Explorar séries
            </Link>
          </p>
        ) : (
          <ol className="mt-4 border-t border-white/10">
            {continueWatching.map((item) => (
              <li key={item.episode.id}>
                <Link
                  href={`/assistir/${item.series.slug}/${item.episode.number}`}
                  className="group flex items-center gap-4 border-b border-white/10 py-4 transition hover:bg-white/[0.04]"
                >
                  <span className="w-8 shrink-0 font-[family-name:var(--font-display)] text-2xl font-medium text-white/35 transition group-hover:text-white/70">
                    {String(item.episode.number).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {item.series.title} — {item.episode.title}
                    </span>
                    <span className="mt-1 block text-xs text-white/50">
                      {formatDuration(item.episode.duration_seconds)} min · visto
                      em {new Date(item.watched_at).toLocaleDateString("pt-BR")}
                    </span>
                  </span>
                  <PlayIcon className="h-4 w-4 shrink-0 text-white/40 transition group-hover:text-white" />
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="mt-12">
        <LogoutButton />
      </div>
    </div>
  );
}
