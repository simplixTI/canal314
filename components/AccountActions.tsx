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
      className="w-full rounded-full border border-neutral-700 px-4 py-2.5 text-sm font-medium transition hover:border-white disabled:opacity-50"
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
        className="text-sm text-neutral-400 underline underline-offset-4 transition hover:text-white disabled:opacity-50"
      >
        {loading ? "Cancelando..." : "Cancelar assinatura"}
      </button>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}
