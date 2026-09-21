"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UNLOCK_COST } from "@/lib/access";
import { CoinIcon } from "./icons";

export default function UnlockButton({ episodeId }: { episodeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUnlock() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/coins/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeId }),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (res.status === 402) {
        router.push("/coins");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Não foi possível desbloquear.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleUnlock}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2.5 bg-accent px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-accent-hover disabled:opacity-40"
      >
        {loading ? (
          "Desbloqueando..."
        ) : (
          <>
            Desbloquear este episódio · {UNLOCK_COST}
            <CoinIcon className="h-4 w-4" />
          </>
        )}
      </button>
      {error && (
        <p className="mt-4 border border-white/30 px-4 py-3 text-center text-sm text-white">
          {error}
        </p>
      )}
    </div>
  );
}
