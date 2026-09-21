import type { SupabaseClient } from "@supabase/supabase-js";
import { createMockProvider, type BillingProvider } from "./mock";

/**
 * Ponto único de seleção do provedor de cobrança.
 * Hoje só existe o mock; para plugar Mercado Pago/Stripe, leia
 * `process.env.BILLING_PROVIDER` aqui e retorne o provider correspondente.
 */
export function getBillingProvider(supabase: SupabaseClient): BillingProvider {
  return createMockProvider(supabase);
}
