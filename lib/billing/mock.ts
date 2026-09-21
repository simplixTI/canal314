import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Provedor de cobrança MOCK.
 *
 * Troca futura por gateway real (Mercado Pago / Stripe):
 * 1. Crie `mercadopago.ts` ou `stripe.ts` nesta pasta implementando
 *    a mesma interface `BillingProvider`.
 * 2. O `activate` real deve redirecionar para o checkout do gateway e a
 *    confirmação chegar via webhook (rota em `app/api/webhooks/...`),
 *    que então chama `upsertActiveSubscription` com o provider correto.
 * 3. Ajuste `getBillingProvider()` em `./index.ts` para escolher o provedor
 *    via variável de ambiente (ex.: BILLING_PROVIDER=mercadopago).
 */

const TRIAL_DAYS = 3;

export interface BillingProvider {
  name: string;
  activate(userId: string): Promise<void>;
  cancel(userId: string): Promise<void>;
}

export function createMockProvider(supabase: SupabaseClient): BillingProvider {
  return {
    name: "mock",

    async activate(userId: string) {
      const periodEnd = new Date();
      periodEnd.setDate(periodEnd.getDate() + 30);

      const { error } = await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          status: "active",
          provider: "mock",
          current_period_end: periodEnd.toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (error) throw new Error(error.message);
    },

    async cancel(userId: string) {
      const { error } = await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("user_id", userId);

      if (error) throw new Error(error.message);
    },
  };
}

export { TRIAL_DAYS };
