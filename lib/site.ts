/**
 * Dados públicos da marca — footer e páginas institucionais leem daqui.
 *
 * ⚠️ Os valores abaixo são PALPITES até o dono confirmar (ver STATUS.md):
 * o domínio próprio ainda não existe e os @ das redes não foram informados.
 * Corrigir aqui conserta o site inteiro — não há URL de rede social nem
 * e-mail escrito em nenhum outro arquivo.
 */
export const SITE = {
  nome: "Canal314",
  selo: "314 no detalhe",
  email: "contato@canal314.com.br",
  atendimento: "Segunda a sexta, das 9h às 18h (horário de Brasília)",
  zapDaFe: "https://zapdafe.com.br/mensagem",
  social: {
    youtube: "https://www.youtube.com/@canal314",
    instagram: "https://www.instagram.com/canal314",
    tiktok: "https://www.tiktok.com/@canal314",
  },
} as const;

/** Data da última revisão dos textos institucionais (termos e privacidade). */
export const LEGAL_ATUALIZADO_EM = "21 de setembro de 2026";
