"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full border border-white/35 px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-white disabled:opacity-40"
    >
      {loading ? "Saindo..." : "Sair da conta"}
    </button>
  );
}

export function CancelSubscriptionButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    if (!window.confirm("Tem certeza que deseja cancelar a assinatura?")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subscription/cancel", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Não foi possível cancelar.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleCancel}
        disabled={loading}
        className="text-sm text-white/55 underline decoration-white/30 underline-offset-4 transition hover:text-accent disabled:opacity-40"
      >
        {loading ? "Cancelando..." : "Cancelar assinatura"}
      </button>
      {error && (
        <p className="mt-3 border border-white/30 px-4 py-3 text-sm text-white">
          {error}
        </p>
      )}
    </div>
  );
}
