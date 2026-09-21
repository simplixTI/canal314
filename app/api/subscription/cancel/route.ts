import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getBillingProvider } from "@/lib/billing";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = createClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase não configurado." },
      { status: 503 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const provider = getBillingProvider(supabase);
    await provider.cancel(user.id);
    return NextResponse.json({ ok: true, provider: provider.name });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erro ao cancelar assinatura." },
      { status: 500 }
    );
  }
}
