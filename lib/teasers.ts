/**
 * Teasers gratuitos das séries (MP4 verticais hospedados no app).
 * Teaser é conteúdo de marketing: grátis para todos, sem login.
 * Ao adicionar um teaser: suba o MP4 em public/teasers/<slug>.mp4
 * e registre aqui.
 */
export const TEASERS: Record<string, { url: string; duration: string }> = {
  "augusto-cury": { url: "/teasers/augusto-cury.mp4", duration: "1:17" },
  "juscelino-kubitschek": {
    url: "/teasers/juscelino-kubitschek.mp4",
    duration: "2:13",
  },
};

export function getTeaser(slug: string) {
  return TEASERS[slug] ?? null;
}
