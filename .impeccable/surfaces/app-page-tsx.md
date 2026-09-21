---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/serie/[slug]/page.tsx","app/assistir/[slug]/[ep]/page.tsx","app/login/page.tsx","app/assinar/page.tsx"]
---

# Surface brief — home (catálogo) + superfícies do app

Escopo: home `/`, `/serie/[slug]`, `/assistir/[slug]/[ep]`, `/login`, `/assinar`, `/conta`, header, player.
Modo: Persuade (home converte para trial) com player Experience (imersão total).
Direção: PINADA pelo dono — "ReelShort imersivo" + "preto e branco puro" (canon da categoria, executado com fidelidade total, barra de craft = ReelShort/Netflix).

## Direction contract

THESIS: O catálogo é uma home de streaming clássica (referência explícita do dono: reelshort.com/pt) — hero cinematográfico do carro-chefe seguido de fileiras horizontais de mini-thumbs (Novo Lançamento, Mais Assistidos, por categoria). Recusa o feed vertical snap-scroll (rejeitado pelo dono em 2026-09) e o arranjo "hero + grid de cards pequenos".

OWN-WORLD: P&B + laranja restrito. Chão quase-preto (#0a0a0a), tinta branca, cinzas neutros para hierarquia, hairlines 1px em branco a 8-12%. UM acento laranja (#FF6A00, hover #FF7A1A) carrega ações e destaques: CTAs primários, item ativo do nav, chip "Novo", chama de "Mais Assistidos", hovers de links, foco, seleção, caret — sem gradientes nem glow; todo o resto permanece P&B (chips "Grátis"/"Em breve" invertidos, scrims, grão). Tipografia condensada pesada para títulos de série (display), micro-labels uppercase tracking largo, corpo em grotesk neutro. Grão de filme sutil e scrims de gradiente preto sobre a arte.

STORY: o visitante entende em 3 segundos: "são micro-documentários verticais sobre figuras reais da fé e da política; posso assistir agora de graça". Acredita pela escala cinematográfica da arte e pelos números concretos (N episódios, 1-2 min, 3 dias grátis). Age: CTA primário sempre visível.

FIRST VIEWPORT (mobile 390px, o viewport principal): hero do carro-chefe (display_order=1, Pastor Everaldo Dias) ocupando ~88dvh com a arte fotográfica em P&B sangrando de borda a borda; scrims de gradiente da esquerda e de baixo; coluna de conteúdo à esquerda (max-w ~560px): fileira de badges (chip invertido "Novo" + chip hairline de categoria), título display gigante, descrição em 2 linhas (clamp), linha meta (N episódios · 1-2 min), pill branco grande "▶ Reproduzir" + link hairline "Teste grátis". Abaixo: fileiras horizontais roláveis (no-scrollbar) de mini-thumbs 16:10 — "Novo Lançamento", "Mais Assistidos" (ícone de chama SVG monocromático), "Religioso", "Político"; séries futuras (0 episódios) levam chip invertido "Em breve" e não são links. Desktop: layout full-width como o reelshort.com (o app foi ampliado para largura total pelo dono; hero com arte cinematográfica em toda a largura e conteúdo à esquerda).

FORM: canon da categoria (vertical streaming feed), pinado pelo brief. Seed 8edad5e5 reconhecido; a pinagem do usuário prevalece sobre o roll.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
