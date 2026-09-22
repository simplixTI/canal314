import type { Metadata } from "next";
import LegalPage, { Secao } from "@/components/LegalPage";
import { LEGAL_ATUALIZADO_EM, SITE } from "@/lib/site";

/*
 * TEXTO BASE, NÃO REVISADO POR ADVOGADO.
 * O inventário de dados abaixo reflete o schema real (profiles, watch_progress,
 * episode_likes, list_entries, coin_transactions, episode_unlocks, subscriptions)
 * e os terceiros que o app realmente usa. Se o schema mudar, esta página muda.
 */

export const metadata: Metadata = {
  title: "Política de Privacidade — Canal314",
  description:
    "Quais dados o Canal314 coleta, por quê, com quem compartilha e como exercer seus direitos.",
};

export default function PrivacidadePage() {
  return (
    <LegalPage
      kicker="Sobre"
      titulo="Privacidade"
      resumo="O que guardamos, por que guardamos e como você manda apagar. Sem letra miúda: a lista abaixo é a lista inteira."
      atualizado={LEGAL_ATUALIZADO_EM}
    >
      <Secao titulo="1. Quem trata seus dados">
        <p>
          O Canal314 é o controlador dos dados tratados neste site, nos termos
          da Lei Geral de Proteção de Dados (Lei 13.709/2018). Contato para
          assuntos de privacidade:{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="text-white/80 underline hover:text-accent"
          >
            {SITE.email}
          </a>
          .
        </p>
      </Secao>

      <Secao titulo="2. O que coletamos">
        <p>
          <strong className="font-semibold text-white/75">Sem cadastro:</strong>{" "}
          nada que identifique você. Navegar pelo catálogo e assistir aos
          episódios grátis não cria registro pessoal.
        </p>
        <p>
          <strong className="font-semibold text-white/75">Com conta:</strong>{" "}
          e-mail e senha (a senha é guardada com hash pelo provedor de
          autenticação, nunca em texto), episódios assistidos e onde você
          parou, curtidas, sua lista, compras de 314Coins, episódios
          desbloqueados e status do 314 Pass.
        </p>
      </Secao>

      <Secao titulo="3. Para que usamos">
        <p>
          Para executar o contrato: autenticar seu acesso, liberar os
          episódios que você tem direito de ver, retomar de onde parou e
          manter o saldo de coins correto.
        </p>
        <p>
          Também usamos dados agregados de audiência (quantas curtidas um
          episódio recebeu, quais séries são mais vistas) para decidir o que
          produzir — nesse uso os números são coletivos, não individuais.
        </p>
      </Secao>

      <Secao titulo="4. Com quem compartilhamos">
        <p>
          Com os fornecedores necessários para o site existir: Supabase (banco
          de dados e autenticação), Vercel (hospedagem) e YouTube, que serve
          os vídeos em modo não listado — o player usa o domínio sem cookies
          de rastreio (youtube-nocookie.com). Quando houver pagamento real, o
          gateway contratado receberá apenas o necessário para cobrar.
        </p>
        <p>Não vendemos dados pessoais, para ninguém, em nenhuma hipótese.</p>
      </Secao>

      <Secao titulo="5. Cookies">
        <p>
          Usamos apenas os cookies de sessão que mantêm você logado. Não há
          cookie de publicidade nem de rastreamento de terceiros neste site.
        </p>
      </Secao>

      <Secao titulo="6. Seus direitos">
        <p>
          Você pode pedir confirmação, acesso, correção, portabilidade,
          anonimização ou exclusão dos seus dados, além de revogar
          consentimento. Basta escrever para{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="text-white/80 underline hover:text-accent"
          >
            {SITE.email}
          </a>
          . Respondemos em até 15 dias.
        </p>
        <p>
          Excluir a conta apaga seus dados pessoais e o histórico ligado a
          ela. Registros de transações podem ser mantidos pelo prazo que a lei
          fiscal exige.
        </p>
      </Secao>

      <Secao titulo="7. Segurança e retenção">
        <p>
          O acesso ao banco é restrito por políticas de segurança em nível de
          linha: cada pessoa só alcança os próprios registros. Guardamos os
          dados enquanto sua conta existir e pelos prazos legais aplicáveis.
        </p>
      </Secao>

      <Secao titulo="8. Menores">
        <p>
          O serviço é destinado a maiores de 18 anos. Não coletamos
          intencionalmente dados de crianças e adolescentes; se isso
          acontecer, avise que apagamos.
        </p>
      </Secao>
    </LegalPage>
  );
}
