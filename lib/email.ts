import { Resend } from "resend";

/**
 * Disparo de e-mail transacional via Resend, sempre de noreply@canal314.com.br.
 *
 * SÓ NO SERVIDOR (route handlers, server actions, server components): a chave
 * RESEND_API_KEY é secreta e nunca pode virar NEXT_PUBLIC_. O guard abaixo
 * derruba na hora se alguém importar isto num componente cliente.
 *
 * Env: RESEND_API_KEY (restrita a envio) e EMAIL_FROM (remetente exibido).
 * O domínio precisa estar verificado na Resend (DKIM/SPF), senão ela recusa.
 */

if (typeof window !== "undefined") {
  throw new Error("lib/email.ts é só do servidor — não importe em componente cliente");
}

const FROM = process.env.EMAIL_FROM ?? "Canal314 <noreply@canal314.com.br>";

let client: Resend | null = null;
function resend(): Resend {
  if (!client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY não configurada");
    client = new Resend(key);
  }
  return client;
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  /** corpo em HTML; `text` é o fallback para clientes sem HTML */
  html: string;
  text?: string;
  /** para onde vai a resposta do destinatário (noreply não recebe) */
  replyTo?: string;
}

/** Envia e devolve o id da mensagem na Resend. Lança erro se a API recusar. */
export async function sendEmail(input: SendEmailInput): Promise<{ id: string }> {
  const { data, error } = await resend().emails.send({
    from: FROM,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
    replyTo: input.replyTo,
  });
  if (error || !data) {
    throw new Error(`Resend recusou o envio: ${error?.name ?? "?"} — ${error?.message ?? "sem detalhe"}`);
  }
  return { id: data.id };
}
