"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyPackButton({
  packId,
  popular,
}: {
  packId: string;
  popular?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/coins/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      if (res.status === 401) {
        router.push("/login?next=/coins");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Não foi possível concluir a compra.");
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
        onClick={handleBuy}
        disabled={loading}
        className={`w-full px-6 py-3.5 text-xs font-bold uppercase tracking-[0.14em] transition disabled:opacity-40 ${
          popular
            ? "bg-accent text-white hover:bg-accent-hover"
            : "border border-white/35 text-white hover:border-accent hover:text-accent"
        }`}
      >
        {loading ? "Comprando..." : "Comprar"}
      </button>
      {error && (
        <p className="mt-3 border border-white/30 px-3 py-2 text-center text-xs text-white">
          {error}
        </p>
      )}
    </div>
  );
}
