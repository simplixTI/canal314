import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPack } from "@/lib/coins";

export const dynamic = "force-dynamic";

/**
 * Compra MOCK de um pacote de 314Coins: insere a linha de ledger
 * (kind='purchase', pack_id) com o valor do pacote.
 *
 * Gateway real (futuro): esta rota passa a criar a preferência de
 * pagamento e o +amount passa a ser inserido pelo webhook de confirmação
 * (Mercado Pago/Stripe) com a service role key — o formato da linha de
 * ledger já é o definitivo.
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

  let packId: string | undefined;
  try {
    const body = await request.json();
    packId = typeof body?.packId === "string" ? body.packId : undefined;
  } catch {
    // body inválido
  }
  const pack = packId ? getPack(packId) : undefined;
  if (!pack) {
    return NextResponse.json({ error: "Pacote inválido." }, { status: 400 });
  }

  const { error } = await supabase.from("coin_transactions").insert({
    user_id: user.id,
    amount: pack.coins,
    kind: "purchase",
    pack_id: pack.id,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, coins: pack.coins });
}
