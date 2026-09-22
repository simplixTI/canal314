import type { Metadata } from "next";
import LegalPage, { Secao } from "@/components/LegalPage";
import { SITE } from "@/lib/site";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contato — Canal314",
  description: "Fale com o Canal314: dúvidas, pauta, imprensa e parcerias.",
};

const CANAIS = [
  { label: "YouTube", href: SITE.social.youtube, Icon: YouTubeIcon },
  { label: "Instagram", href: SITE.social.instagram, Icon: InstagramIcon },
  { label: "TikTok", href: SITE.social.tiktok, Icon: TikTokIcon },
] as const;

export default function ContatoPage() {
  return (
    <LegalPage
      kicker="Sobre"
      titulo="Contate-nos"
      resumo="Dúvida de cobrança, sugestão de pauta, correção de um episódio ou proposta de parceria — tudo chega pelo mesmo lugar."
    >
      <Secao titulo="E-mail">
        <p>
          <a
            href={`mailto:${SITE.email}`}
            className="text-base text-white/85 underline hover:text-accent"
          >
            {SITE.email}
          </a>
        </p>
        <p>{SITE.atendimento}.</p>
      </Secao>

      <Secao titulo="Oração e mensagem">
        <p>
          Pedidos de oração e mensagens de fé têm casa própria:{" "}
          <a
            href={SITE.zapDaFe}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/80 underline hover:text-accent"
          >
            Zap da Fé ↗
          </a>
          .
        </p>
      </Secao>

      <Secao titulo="Redes">
        <ul className="flex flex-wrap gap-3 pt-1">
          {CANAIS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 border border-white/15 px-4 py-2.5 text-sm text-white/70 transition hover:border-accent hover:text-accent"
              >
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </Secao>

      <Secao titulo="Imprensa">
        <p>
          Para entrevistas, uso de trechos e material de divulgação, escreva
          com o assunto <em className="not-italic text-white/75">Imprensa</em>{" "}
          no mesmo e-mail acima.
        </p>
      </Secao>
    </LegalPage>
  );
}
