import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { Secao } from "@/components/LegalPage";
import { LEGAL_ATUALIZADO_EM, SITE } from "@/lib/site";

/*
 * TEXTO BASE, NÃO REVISADO POR ADVOGADO.
 * Descreve fielmente como o Canal314 funciona hoje (eps 1–2 grátis, 314Coins,
 * 314 Pass), mas precisa de revisão jurídica antes de valer como contrato —
 * está anotado nas pendências do STATUS.md.
 */

export const metadata: Metadata = {
  title: "Termos de Uso — Canal314",
  description:
    "As regras de uso do Canal314: conta, 314Coins, 314 Pass e conteúdo.",
};

export default function TermosPage() {
  return (
    <LegalPage
      kicker="Sobre"
      titulo="Termos de Uso"
      resumo="As regras de quem assiste e de quem publica no Canal314. Em português claro, na ordem em que você esbarra em cada uma."
      atualizado={LEGAL_ATUALIZADO_EM}
    >
      <Secao titulo="1. O que é o Canal314">
        <p>
          O Canal314 é uma plataforma de micro-documentários verticais sobre
          nomes da fé e da política do Brasil, em episódios de 1 a 2 minutos.
          Ao usar o site você concorda com estes termos.
        </p>
      </Secao>

      <Secao titulo="2. Conta">
        <p>
          Navegar pelo catálogo e assistir aos episódios 1 e 2 de cada série
          não exige cadastro. A partir do episódio 3 é necessário criar uma
          conta com e-mail e senha.
        </p>
        <p>
          Você é responsável por manter sua senha em sigilo e pelo que
          acontece na sua conta. A conta é pessoal e intransferível.
        </p>
      </Secao>

      <Secao titulo="3. 314Coins">
        <p>
          314Coins são créditos de uso interno da plataforma. Cada episódio
          bloqueado custa 30 coins e, uma vez desbloqueado, fica liberado na
          sua conta enquanto o episódio existir no catálogo.
        </p>
        <p>
          Os coins não têm valor monetário fora do Canal314, não são
          convertidos em dinheiro, não são transferidos entre contas e não
          expiram. Pacotes comprados não são estornados depois de creditados,
          salvo nas hipóteses de arrependimento previstas no Código de Defesa
          do Consumidor.
        </p>
      </Secao>

      <Secao titulo="4. 314 Pass">
        <p>
          O 314 Pass é a assinatura mensal que libera todo o catálogo enquanto
          estiver ativa. A cobrança é recorrente e se renova automaticamente
          até você cancelar.
        </p>
        <p>
          O cancelamento pode ser feito a qualquer momento em{" "}
          <Link href="/conta" className="text-white/80 underline hover:text-accent">
            Minha conta
          </Link>
          ; o acesso continua até o fim do período já pago, sem cobrança nova.
        </p>
      </Secao>

      <Secao titulo="5. Conteúdo">
        <p>
          Os episódios, roteiros, capas e a marca Canal314 são protegidos por
          direito autoral. Seu acesso é uma licença pessoal e não exclusiva
          para assistir — não inclui baixar, redistribuir, exibir em público
          nem reaproveitar trechos sem autorização por escrito.
        </p>
        <p>
          O conteúdo é jornalístico e documental. Opiniões de entrevistados
          são deles; correções podem ser pedidas pelos canais de contato.
        </p>
      </Secao>

      <Secao titulo="6. Uso aceitável">
        <p>
          É proibido burlar os bloqueios de acesso, automatizar acessos,
          revender conta ou coins, e usar o serviço para qualquer finalidade
          ilícita.
        </p>
      </Secao>

      <Secao titulo="7. Disponibilidade e mudanças">
        <p>
          O catálogo muda com o tempo: séries entram, episódios são
          atualizados e alguns podem sair. Também podemos alterar preços e
          estes termos — mudanças relevantes são avisadas no site com
          antecedência razoável, e valem para o futuro.
        </p>
      </Secao>

      <Secao titulo="8. Contato e foro">
        <p>
          Dúvidas sobre estes termos:{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="text-white/80 underline hover:text-accent"
          >
            {SITE.email}
          </a>
          .
        </p>
        <p>
          Aplica-se a lei brasileira. Fica eleito o foro do domicílio do
          consumidor para resolver o que não se resolver por conversa.
        </p>
      </Secao>
    </LegalPage>
  );
}
