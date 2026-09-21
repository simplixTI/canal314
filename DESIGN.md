# DESIGN.md — Canal314

Mundo visual aprovado em 2026-09-21 (direção pinada pelo dono). Contrato de direção: `.impeccable/surfaces/app-page-tsx.md`. Verdades de produto: `PRODUCT.md`.

## Direção

**ReelShort imersivo em preto e branco puro.** O catálogo é um feed vertical de pôsteres em tela cheia com scroll-snap; o player é fullscreen; a interface recua para chrome mínimo. Canon da categoria (ReelShort/Netflix), executado sem ironia. Zero cor em qualquer estado — ênfase vem de inversão (fundo branco/tinta preta), peso e escala, nunca de matiz.

## Tokens

| Token | Valor | Uso |
|---|---|---|
| Chão | `#0a0a0a` | superfície do app (coluna) |
| Preto absoluto | `#000` | laterais do desktop, fundo do player |
| Tinta | `#fff` | texto primário, CTAs sólidos |
| Hierarquia de cinzas | `white/70`, `white/60`, `white/50`, `white/35` | secundário, meta, legendas, numerais |
| Hairlines | `border-white/10` a `white/15` | divisórias, molduras, coluna |

Definidos em `app/globals.css` (`:root`, utilities `.micro-label`, `.scrim-bottom`, `.scrim-top`, `.scrim-vignette`, `.film-grain`, `.no-scrollbar`).

## Tipografia

- **Display:** Oswald (500/600/700, `next/font/google`, self-hosted) — uppercase, tracking -0.02em, leading 0.92–0.95. Títulos de série, preços, estados vazios. Máx. ~4.6rem nas capas.
- **Corpo e micro-labels:** Inter (400–700) — micro-labels em 11px semibold uppercase tracking 0.22em; corpo 14–15px com medida curta (conteúdo de texto em `max-w-xl`/`max-w-2xl` centrado).
- Variáveis: `--font-display`, `--font-body` (carregadas em `app/layout.tsx`).

## Layout

- **Largura total (fullscreen) em todos os viewports**: sem coluna de celular — o feed e o player sangram de borda a borda; blocos de texto/CTA ficam em colunas centradas `max-w-xl`/`max-w-2xl`. O app é mobile-first e responsivo.
- **Home `/`**: container `h-dvh snap-y snap-mandatory`, cada série em seção de `100dvh` — pôster edge-to-edge, scrim preto, micro-label categoria, título display, meta (N episódios · 1–2 min), CTA branco sólido "Assistir agora" + link "Teste grátis", deixa de scroll ("Deslize" + chevron animado). Capas tipográficas carregam o título na arte e não recebem scrim nem título sobreposto (evita duplicidade); capas fotográficas recebem scrim + título.
- **`/serie/[slug]`**: abertura de 58dvh com a arte, ficha (categoria/meta/descrição), lista de episódios em fileiras numeradas (numeral display 01, título, duração; chip "Grátis" invertido branco nos eps 1–2; cadeado nos demais) em coluna `max-w-2xl`, CTA fixa no rodapé.
- **`/assistir/[slug]/[ep]`**: iframe 9:16 em *cover* sobre toda a viewport (container queries `cqw/cqh`); no desktop (`sm:`) o palco e o chrome ficam limitados a `56.25dvh` de largura (proporção 9:16 pela altura), centralizados. Chrome superior (voltar + título + contador Ep NN/NN) e inferior (título do ep + anterior/próximo) sobre scrims.
- **`/login`, `/assinar`, `/conta`, paywall, 404**: mesma gramática — título display centrado, micro-labels, inputs com hairline inferior, botões brancos sólidos, divisórias hairline, marca "314" gigante a 4–5% de opacidade.
- **Header**: chrome mínimo fixo (logo pequena + Entrar/Conta) sobre scrim superior; some na rota `/assistir` (player tem chrome próprio).

## Movimento

Um momento autoral: a deixa de scroll (`cue-drop`, ease-out exponencial 2.1s) + entrada `rise-in` do primeiro card. `prefers-reduced-motion` desativa ambos.

## Superfícies do navegador

Seleção invertida (branco/preto), caret branco, scrollbar fina escura (oculta no feed), focus ring branco 2px offset 3px, underline offset 4px. Em `app/globals.css`.

## Assets e proveniência

| Asset | Origem |
|---|---|
| `public/logo.png` | Marca do dono (branca sobre preto); renderizada com `mix-blend-screen` para o fundo preto da arte sumir |
| `public/thumbnails/pastor-everaldo-dias.png` | Foto/pôster real do dono; renderizada sempre em P&B (`grayscale`), crop `object-[50%_15%]` |
| `public/noise.png` | Gerado por `scripts/generate-noise.mjs` (tile 180×180 determinístico, seed 0x314) — grão de filme do app e dos pôsteres |
| Capas tipográficas (Getúlio Vargas, Padre Cícero, Chico Xavier + fallback) | Autorais em `components/PosterArt.tsx`: tipo condensado, selo "314 NO DETALHE", moldura hairline, marca 314, grão — uma composição por série, como capas de livro |
| Ícones | SVG autoral em `components/icons.tsx` (stroke 1.5, currentColor) |

## Revisão

Rodadas de screenshot (Playwright, dev tooling em `scripts/screenshot*.mjs`) em `.impeccable/review/`: home mobile/desktop, cards tipográficos, série (foto e tipográfica), player, paywall, login, assinar. Detector `impeccable detect app components`: 0 achados. Build limpo.
