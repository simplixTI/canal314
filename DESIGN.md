# DESIGN.md — Canal314

Mundo visual aprovado em 2026-09-21 (direção pinada pelo dono). Contrato de direção: `.impeccable/surfaces/app-page-tsx.md`. Verdades de produto: `PRODUCT.md`.

## Direção

**ReelShort clássico em P&B + laranja.** A home é hero do carro-chefe + fileiras horizontais; o player é fullscreen; a interface recua para chrome mínimo. Canon da categoria (ReelShort/Netflix), executado sem ironia. Estratégia de cor **restrita**: os neutros (preto/branco/cinzas) carregam as superfícies e UM laranja (`#FF6A00`) carrega ações e destaques — CTAs primários, item ativo do nav, chip "Novo", chama de "Mais Assistidos", hovers de links, foco, seleção e caret. Sem gradientes de laranja, sem glow.

## Estratégia de cor (2026-09-21)

- **Acento único:** `--accent: #FF6A00` (hover `#FF7A1A`) — definido em `app/globals.css` (`:root`) e em `tailwind.config.ts` (`colors.accent`, classes `bg-accent`, `text-accent`, `hover:bg-accent-hover`, `border-accent`).
- **Regra de aplicação:** laranja = ações de valor (Reproduzir, Assistir agora, Assinar, Entrar/Cadastrar) + destaques (nav ativo, chip "Novo", chama, hovers de links textuais, focus ring, seleção, caret). Branco/neutro = navegação (voltar, anterior/próximo do player, chips "Grátis" e "Em breve", botões secundários hairline).
- **Contraste:** texto branco bold/uppercase sobre `#FF6A00` nos botões (aprovado pelo dono); texto pequeno sobre laranja usa preto (chip "Novo" — 7.3:1).

## Tokens

| Token | Valor | Uso |
|---|---|---|
| Chão | `#0a0a0a` | superfície do app (coluna) |
| Preto absoluto | `#000` | laterais do desktop, fundo do player |
| Tinta | `#fff` | texto primário, chips invertidos |
| Acento | `#FF6A00` (hover `#FF7A1A`) | CTAs primários, nav ativo, destaques, foco/seleção/caret |
| Hierarquia de cinzas | `white/70`, `white/60`, `white/50`, `white/35` | secundário, meta, legendas, numerais |
| Hairlines | `border-white/10` a `white/15` | divisórias, molduras, coluna |

Definidos em `app/globals.css` (`:root`, utilities `.micro-label`, `.scrim-bottom`, `.scrim-top`, `.scrim-vignette`, `.film-grain`, `.no-scrollbar`).

## Tipografia

- **Display:** Oswald (500/600/700, `next/font/google`, self-hosted) — uppercase, tracking -0.02em, leading 0.92–0.95. Títulos de série, preços, estados vazios. Máx. ~4.6rem nas capas.
- **Corpo e micro-labels:** Inter (400–700) — micro-labels em 11px semibold uppercase tracking 0.22em; corpo 14–15px com medida curta (conteúdo de texto em `max-w-xl`/`max-w-2xl` centrado).
- Variáveis: `--font-display`, `--font-body` (carregadas em `app/layout.tsx`).

## Layout

- **Largura total (fullscreen) em todos os viewports**: sem coluna de celular — o feed e o player sangram de borda a borda; blocos de texto/CTA ficam em colunas centradas `max-w-xl`/`max-w-2xl`. O app é mobile-first e responsivo.
- **Home `/`**: home de streaming clássica (referência do dono: reelshort.com/pt) — hero do carro-chefe (`display_order=1`) em ~88dvh com arte P&B edge-to-edge, scrims da esquerda e de baixo, conteúdo à esquerda em `max-w-[560px]`: badges (chip "Novo" laranja + chip hairline de categoria), título display gigante, descrição com clamp de 2 linhas, meta (N episódios · 1–2 min), pill laranja "▶ Reproduzir" + link hairline "Teste grátis". Abaixo, fileiras horizontais roláveis (`no-scrollbar`) de mini-thumbs 16:10 (PosterArt `size="thumb"`): "Novo Lançamento", "Mais Assistidos" (ícone de chama SVG), "Religioso" e "Político". Séries futuras (0 episódios) levam chip invertido "Em breve", não são links e mostram "Em breve no catálogo" na meta. O feed vertical snap-scroll foi rejeitado pelo dono e removido (2026-09).
- **`/serie/[slug]`**: abertura de 58dvh com a arte, ficha (categoria/meta/descrição), lista de episódios em fileiras numeradas (numeral display 01, título, duração; chip "Grátis" invertido branco nos eps 1–2; cadeado + custo "30" com CoinIcon nos demais) em coluna `max-w-2xl`, CTA fixa no rodapé.
- **`/coins`**: saldo em número Oswald grande com CoinIcon laranja, 3 pacotes (o do meio marcado "Mais popular" com borda laranja), botões "Comprar".
- **Paywall**: variantes do modelo 314Coins — anônimo (criar conta), saldo ≥ 30 (botão laranja "Desbloquear este episódio · 30" + link 314 Pass), saldo < 30 ("Saldo insuficiente" → comprar coins).
- **`/assistir/[slug]/[ep]`**: iframe 9:16 em *cover* sobre toda a viewport (container queries `cqw/cqh`); no desktop (`sm:`) o palco e o chrome ficam limitados a `56.25dvh` de largura (proporção 9:16 pela altura), centralizados. Chrome superior (voltar + título + contador Ep NN/NN) e inferior (título do ep + anterior/próximo) sobre scrims. Rail vertical de ações na borda direita do palco (Curtir · Lista · Enviar, `components/PlayerActions.tsx`): botões circulares hairline branco/80 com micro-legenda; Curtir ativo preenche em laranja e mostra a contagem; Lista adiciona/remove a série em `list_entries` (check invertido quando salva); Enviar usa `navigator.share` com fallback de clipboard ("Link copiado"). Toggles otimistas com rollback.
- **`/login`, `/assinar`, `/conta`, paywall, 404**: mesma gramática — título display centrado, micro-labels, inputs com hairline inferior, botões primários laranja sólido (Entrar/Cadastrar/Assinar), secundários hairline, divisórias hairline, marca "314" gigante a 4–5% de opacidade.
- **Header**: chrome mínimo fixo (logo + nav Início · Categorias · PodCast à esquerda, Entrar/Conta à direita) sobre scrim superior; item ativo em laranja; some na rota `/assistir` (player tem chrome próprio).

## Movimento

Um momento autoral: a deixa de scroll (`cue-drop`, ease-out exponencial 2.1s) + entrada `rise-in` do primeiro card. `prefers-reduced-motion` desativa ambos.

## Superfícies do navegador

Seleção laranja (fundo `#FF6A00`, texto preto), caret laranja, scrollbar fina escura (oculta nas fileiras), focus ring laranja 2px offset 3px, underline offset 4px. Em `app/globals.css`.

## Assets e proveniência

| Asset | Origem |
|---|---|
| `public/logo.png` | Marca raster original do dono — traço preto sobre transparência; na UI usa-se o filtro `invert` (branco sobre o tema escuro). Tamanhos: header `h-9`, login `h-[52px]` |
| Marca tipográfica (`components/Logo.tsx`) | MicIcon desenhado + "canal" em micro-label sobre "314!" em Oswald bold — usada no header e no login, tamanhos `sm`/`lg` |
| `public/thumbnails/pastor-everaldo-dias.png` | Foto/pôster real do dono; renderizada sempre em P&B (`grayscale`), crop `object-[50%_15%]` |
| `public/noise.png` | Gerado por `scripts/generate-noise.mjs` (tile 180×180 determinístico, seed 0x314) — grão de filme do app e dos pôsteres |
| Capas tipográficas (Getúlio Vargas, Padre Cícero, Chico Xavier + fallback) | Autorais em `components/PosterArt.tsx`: tipo condensado, selo "314 NO DETALHE", moldura hairline, marca 314, grão — uma composição por série, como capas de livro |
| Ícones | SVG autoral em `components/icons.tsx` (stroke 1.5, currentColor) |

## Revisão

Rodadas de screenshot (Playwright, dev tooling em `scripts/screenshot*.mjs`) em `.impeccable/review/`: home mobile/desktop, cards tipográficos, série (foto e tipográfica), player, paywall, login, assinar. Detector `impeccable detect app components`: 0 achados. Build limpo.
