import { SITE } from "./site";

/**
 * Modelos de e-mail. HTML de e-mail é 2005: tabela, estilo inline, fonte de
 * sistema, fundo claro — cliente de e-mail não respeita o tema escuro do site,
 * então a marca entra pelo laranja e pela voz, não pelo preto.
 */

const ACCENT = "#FF6A00";
const INK = "#0a0a0a";
const MUTED = "#6b6b6b";

function layout(titulo: string, corpo: string, origin: string): string {
  return `<!doctype html>
<html lang="pt-BR">
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:${INK}">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f4">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff">
        <tr><td style="background:${INK};padding:22px 28px">
          <img src="${origin}/logo.webp" alt="Canal314" height="40" style="display:block;height:40px;width:auto;border:0">
        </td></tr>
        <tr><td style="padding:32px 28px 8px">
          <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:${ACCENT}">${SITE.selo}</p>
          <h1 style="margin:0;font-size:26px;line-height:1.15;font-weight:800;letter-spacing:-0.01em">${titulo}</h1>
        </td></tr>
        <tr><td style="padding:8px 28px 32px;font-size:15px;line-height:1.6">${corpo}</td></tr>
        <tr><td style="padding:18px 28px;border-top:1px solid #e6e6e6;font-size:12px;line-height:1.6;color:${MUTED}">
          Você recebeu este e-mail porque criou uma conta no Canal314.
          Dúvidas: <a href="mailto:${SITE.email}" style="color:${MUTED}">${SITE.email}</a><br>
          © ${new Date().getFullYear()} ${SITE.nome}. Todos os direitos reservados.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function botao(label: string, href: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin:22px 0 6px"><tr>
    <td style="background:${ACCENT};border-radius:999px">
      <a href="${href}" style="display:inline-block;padding:14px 28px;font-size:13px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#ffffff;text-decoration:none">${label}</a>
    </td></tr></table>`;
}

export interface EmailPronto {
  subject: string;
  html: string;
  text: string;
}

/** Boas-vindas logo após o cadastro. `origin` é a URL pública do site. */
export function emailCadastro(origin: string): EmailPronto {
  const subject = "Sua conta no Canal314 está pronta";
  const corpo = `
    <p style="margin:0 0 14px">Bem-vindo. Aqui as histórias dos grandes nomes da fé e da política do Brasil são contadas em episódios de 1 a 2 minutos — na vertical, na voz de quem viveu.</p>
    <p style="margin:0 0 14px">Como funciona:</p>
    <ul style="margin:0 0 14px;padding-left:20px">
      <li style="margin-bottom:6px"><b>Episódios 1 e 2</b> de toda série são grátis.</li>
      <li style="margin-bottom:6px">Do 3 em diante, desbloqueie por <b>30 314Coins</b> cada — ou assine o <b>314 Pass</b> e veja tudo.</li>
      <li>Teasers são sempre grátis, sem login.</li>
    </ul>
    ${botao("Começar a assistir", origin)}
  `;
  const text = [
    "Bem-vindo ao Canal314.",
    "",
    "Histórias dos grandes nomes da fé e da política do Brasil em episódios de 1 a 2 minutos, na vertical, na voz de quem viveu.",
    "",
    "Como funciona:",
    "- Episódios 1 e 2 de toda série são grátis.",
    "- Do 3 em diante, desbloqueie por 30 314Coins cada, ou assine o 314 Pass e veja tudo.",
    "- Teasers são sempre grátis, sem login.",
    "",
    `Começar a assistir: ${origin}`,
    "",
    `Dúvidas: ${SITE.email}`,
  ].join("\n");
  return { subject, html: layout("Sua conta está pronta", corpo, origin), text };
}
