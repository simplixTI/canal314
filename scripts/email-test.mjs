// Dispara UM e-mail de teste pela Resend para conferir chave + domínio.
// Uso: node scripts/email-test.mjs voce@exemplo.com
// Lê RESEND_API_KEY e EMAIL_FROM de .env.local (não commitado).
import { readFileSync } from "node:fs";
import { Resend } from "resend";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()]),
);

const to = process.argv[2];
if (!to) {
  console.error("informe o destinatário: node scripts/email-test.mjs voce@exemplo.com");
  process.exit(1);
}
if (!env.RESEND_API_KEY) {
  console.error("RESEND_API_KEY ausente em .env.local");
  process.exit(1);
}

const from = env.EMAIL_FROM ?? "Canal314 <noreply@canal314.com.br>";
const { data, error } = await new Resend(env.RESEND_API_KEY).emails.send({
  from,
  to,
  subject: "Teste de envio — Canal314",
  text: `Se este e-mail chegou, o remetente ${from} está funcionando pela Resend.`,
  html: `<p>Se este e-mail chegou, o remetente <b>${from}</b> está funcionando pela Resend.</p>`,
});

if (error) {
  console.error(`✗ Resend recusou: ${error.name} — ${error.message}`);
  process.exit(1);
}
console.log(`✓ enviado de ${from} para ${to} — id ${data.id}`);
