"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PRICE_LABEL } from "@/lib/access";

export default function SubscribeButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/subscription/activate", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Não foi possível ativar a assinatura.");
      }
      router.push("/conta");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="w-full bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-black transition hover:bg-white/85 disabled:opacity-40"
      >
        {loading ? "Ativando..." : `Assinar ${PRICE_LABEL}`}
      </button>
      {error && (
        <p className="mt-4 border border-white/30 px-4 py-3 text-center text-sm text-white">
          {error}
        </p>
      )}
    </div>
  );
}
