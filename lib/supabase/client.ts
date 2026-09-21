import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

/** Client Supabase para componentes de navegador ("use client"). */
export function createClient() {
  return createBrowserClient(
    SUPABASE_URL || "https://placeholder.supabase.co",
    SUPABASE_ANON_KEY || "placeholder"
  );
}
