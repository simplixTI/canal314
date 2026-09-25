import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";
import { emailCadastro } from "@/lib/email-templates";

export const dynamic = "force-dynamic";

/** Só quem acabou de criar a conta pode pedir o e-mail de cadastro. */
const JANELA_MS = 10 * 60 * 1000;

/**
 * Dispara o e-mail de boas-vindas pela Resend logo após o cadastro.
 * O Supabase não envia e-mail nenhum (confirmação desligada no painel).
 *
 * O destinatário sai da SESSÃO, nunca do body: ninguém dispara e-mail em
 * nome de outra pessoa. E só vale nos primeiros minutos da conta, para a
 * rota não virar um botão de "me manda de novo" infinito.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase não configurado." }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const idade = Date.now() - new Date(user.created_at).getTime();
  if (idade > JANELA_MS) {
    return NextResponse.json({ error: "Conta já não é nova." }, { status: 409 });
  }

  try {
    const origin = new URL(request.url).origin;
    const { id } = await sendEmail({ to: user.email, ...emailCadastro(origin) });
    return NextResponse.json({ ok: true, id });
  } catch (err) {
    // Falha de e-mail não pode travar o cadastro — o usuário já está dentro.
    console.error("[email/cadastro]", err);
    return NextResponse.json({ error: "Não foi possível enviar o e-mail." }, { status: 502 });
  }
}
