import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UNLOCK_COST } from "@/lib/access";

export const dynamic = "force-dynamic";

/**
 * Desbloqueia um episódio avulso com 314Coins.
 * Re-lê o saldo dentro do handler antes de gravar (unlock + ledger -30).
 * Uma corrida simples é aceitável no MVP: o pior caso é um débito a mais
 * que poderá ser estornado; com gateway real, mover para RPC transacional.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase não configurado." }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let episodeId: string | undefined;
  try {
    const body = await request.json();
    episodeId = typeof body?.episodeId === "string" ? body.episodeId : undefined;
  } catch {
    // body inválido
  }
  if (!episodeId) {
    return NextResponse.json({ error: "episodeId obrigatório." }, { status: 400 });
  }

  // Já desbloqueado? Responde ok sem cobrar de novo.
  const { data: existing } = await supabase
    .from("episode_unlocks")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("episode_id", episodeId)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ ok: true, alreadyUnlocked: true });
  }

  const { data: ledger } = await supabase
    .from("coin_transactions")
    .select("amount")
    .eq("user_id", user.id);
  const balance = (ledger ?? []).reduce(
    (sum: number, row: { amount: number }) => sum + row.amount,
    0
  );
  if (balance < UNLOCK_COST) {
    return NextResponse.json({ error: "Saldo insuficiente." }, { status: 402 });
  }

  const { error: unlockError } = await supabase.from("episode_unlocks").insert({
    user_id: user.id,
    episode_id: episodeId,
    coins_spent: UNLOCK_COST,
  });
  if (unlockError) {
    // Conflito de PK = já desbloqueado em outra aba
    if (unlockError.code === "23505") {
      return NextResponse.json({ ok: true, alreadyUnlocked: true });
    }
    return NextResponse.json({ error: unlockError.message }, { status: 500 });
  }

  const { error: ledgerError } = await supabase.from("coin_transactions").insert({
    user_id: user.id,
    amount: -UNLOCK_COST,
    kind: "unlock",
    episode_id: episodeId,
  });
  if (ledgerError) {
    return NextResponse.json({ error: ledgerError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, balance: balance - UNLOCK_COST });
}
