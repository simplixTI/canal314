# DESIGN.md — Canal314

Mundo visual aprovado em 2026-09-21 (direção pinada pelo dono). Contrato de direção: `.impeccable/surfaces/app-page-tsx.md`. Verdades de produto: `PRODUCT.md`.

## Direção

**ReelShort clássico em P&B + laranja + fotos em cor.** A home é hero do carro-chefe + fileiras horizontais; o player é fullscreen; a interface recua para chrome mínimo. Canon da categoria (ReelShort/Netflix), executado sem ironia. Estratégia de cor **restrita**: os neutros (preto/branco/cinzas) carregam as superfícies, UM laranja (`#FF6A00`) carrega ações e destaques — CTAs primários, item ativo do nav, chip "Novo", chama de "Mais Assistidos", hovers de links, foco, seleção, caret — e a **fotografia real entra em cor natural** (2026-09, decisão do dono: o site saiu do monocromático forçado; pôsteres fotográficos com grade documental suave, sem duotonos nem filtros pesados; figuras históricas mantêm o tom P&B/sépia do registro original). Sem gradientes de laranja, sem glow.

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
- **Home `/`**: home de streaming clássica (referência do dono: reelshort.com/pt) — hero do carro-chefe (`display_order=1`) em ~88dvh com arte P&B edge-to-edge, scrims da esquerda e de baixo, conteúdo à esquerda em `max-w-[560px]`: badges (chip "Novo" laranja + chip hairline de categoria), título display gigante, descrição com clamp de 2 linhas, meta (N episódios · 1–2 min), pill laranja "▶ Reproduzir" + link hairline "Teste grátis". Abaixo, fileiras horizontais roláveis (`no-scrollbar`) de mini-thumbs 16:10 (PosterArt `size="thumb"`): "Novo Lançamento", "Mais Assistidos" (ícone de chama SVG), "Religioso" e "Político". Séries futuras (0 episódios) levam chip invertido "Em breve", não são links e mostram "Em breve no catálogo" na meta; séries com teaser levam chip laranja "Teaser grátis". **Hover-expand (desktop, `hover: hover` + `pointer: fine`)**: após ~400ms de hover num card da fileira, abre um painel de preview em `position:fixed` (z-50, ~1.35× a largura do card, cap 360px, clamped à viewport com margem 8px, entrada scale/fade 150ms com reduced-motion) — pôster 16:10, micro-label categoria + meta, título Oswald, descrição clamp 3, pill laranja "▶ Reproduzir" (ou chip "Em breve") + botões circulares Lista (otimista, `list_entries`) e Enviar (navigator.share/clipboard). Fecha ao sair do card+preview (150ms de graça), Esc, ou scroll da página/fileira. Mobile/toque: sem preview, toque navega. O feed vertical snap-scroll foi rejeitado pelo dono e removido (2026-09).
- **`/serie/[slug]`**: abertura de 58dvh com a arte, ficha (categoria/meta/descrição), lista de episódios em fileiras numeradas (numeral display 01, título, duração; chip "Grátis" invertido branco nos eps 1–2; cadeado + custo "30" com CoinIcon nos demais) em coluna `max-w-2xl`, CTA fixa no rodapé.
- **`/coins`**: saldo em número Oswald grande com CoinIcon laranja, 3 pacotes (o do meio marcado "Mais popular" com borda laranja), botões "Comprar".
- **Paywall**: variantes do modelo 314Coins — anônimo (criar conta), saldo ≥ 30 (botão laranja "Desbloquear este episódio · 30" + link 314 Pass), saldo < 30 ("Saldo insuficiente" → comprar coins).
- **`/assistir/[slug]/[ep]`** — dois layouts por breakpoint. **Mobile/tablet (< lg)**: player imersivo — iframe 9:16 em *cover* sobre toda a viewport (container queries `cqw/cqh`), palco e chrome limitados a `56.25dvh` no `sm:`, chrome superior (voltar + título + contador) e inferior (título + anterior/próximo) sobre scrims, e rail vertical de ações na borda direita (Curtir · Lista · Enviar, `components/PlayerActions.tsx`; Curtir ativo em laranja com contagem). **Desktop (lg:)**: layout watch estilo ReelShort — duas colunas em `h-dvh`: à esquerda o palco 9:16 pela altura (`aspect-[9/16] inset-y-6`, centrado) com botão voltar circular hairline; à direita a sidebar `w-[440px]` rolável (`components/EpisodeSidebar.tsx`) com breadcrumb micro-label, título Oswald "Episódio N — …", bloco "Sobre a série", chips (categoria/N episódios/1–2 min), ações horizontais (mesma lógica do rail) e grade numerada de episódios (atual em laranja, 1–2 hairline, 3+ com cadeado; célula "Teaser" quando há). O iframe só é montado no breakpoint ativo (`components/PlayerFrame.tsx`, matchMedia) — sem isso os dois layouts carregariam dois players com autoplay. A lógica Curtir/Lista/Enviar vive em `components/usePlayerActions.ts` (toggles otimistas, redirect de login, share com fallback "Link copiado"), compartilhada pelo rail e pela sidebar; sem `episodeId` a curtida vale para a série (modo teaser, `series_likes`).
- **`/login`, `/assinar`, `/conta`, paywall, 404**: mesma gramática — título display centrado, micro-labels, inputs com hairline inferior, botões primários laranja sólido (Entrar/Cadastrar/Assinar), secundários hairline, divisórias hairline, marca "314" gigante a 4–5% de opacidade.
- **Rodapé**: `components/Footer.tsx` — marca (logo, uma linha do que o Canal314 é, copyright e três redes em botões circulares hairline) mais três colunas de links (Canal · Assistir · Sobre) e uma barra final com o selo "314 no detalhe". Duas colunas já no celular, quatro a partir de `lg`. Marca d'água 314 só no desktop. Some em `/assistir`, como o header. Destinos e @ vivem em `lib/site.ts`.
- **Páginas institucionais**: `/termos`, `/privacidade`, `/contato` na casca `components/LegalPage.tsx` — micro-label laranja, título display, medida de leitura `max-w-2xl` e seções com heading em micro-label.
- **Player de teaser** (`components/TeaserVideo.tsx`): entra tocando e **mudo** — som automático assusta, e mudo é o que faz o autoplay ser permitido. Controle de som à mostra no canto superior direito do palco (`top-[72px] right-3`, abaixo da linha do título e longe da rail social): enquanto mudo, botão circular em laranja + etiqueta micro-label "Ativar som"; com som, vira o botão neutro da casa (`border-white/30`). Ligar o som também destrava a reprodução se o autoplay tiver sido barrado.
- **Header**: chrome fixo sobre scrim superior, por breakpoint; some na rota `/assistir`. **Desktop (≥ lg)**: logo + nav inline (Início · Categorias · PodCast · Zap da Fé ↗ externo) à esquerda, coin chip + Conta/Entrar à direita; item ativo em laranja. **Mobile (< lg)**, padrão ReelShort: linha 1 com hambúrguer à esquerda (abre o drawer), logo centrada, busca + avatar à direita (círculo com a inicial do e-mail logado; ícone user-circle deslogado); linha 2 com as abas (micro-label, ativa em laranja + barra underline 2px laranja). **Drawer** (`components/MobileDrawer.tsx`): slide-in esquerdo 85%/max-320px, `#0c0c0c`, hairline, backdrop, Esc/navegação fecha, scroll travado — logo, saldo 314Coins (logado), links das seções, 314 Pass em laranja, Conta/Entrar, Termos/Privacidade/Contato, Sair. **Busca real** (`components/SearchOverlay.tsx`): overlay full-screen, input com hairline e autofoco, debounce 300ms, `ilike` em `series.title` via browser client, resultados com thumb + categoria (regra "Em breve" do RailCard), estados de dica/loading shimmer/vazio.

## Movimento

Um momento autoral: a deixa de scroll (`cue-drop`, ease-out exponencial 2.1s) + entrada `rise-in` do primeiro card. `prefers-reduced-motion` desativa ambos.

## Superfícies do navegador

Seleção laranja (fundo `#FF6A00`, texto preto), caret laranja, scrollbar fina escura (oculta nas fileiras), focus ring laranja 2px offset 3px, underline offset 4px. Em `app/globals.css`.

## Assets e proveniência

| Asset | Origem |
|---|---|
| `assets/logo-horizontal-master.png` | Master do logo de tela (2172×724, marca dourada ~3.2:1, sem moldura) — **fora de `public/`**, não é servido |
| `assets/logo-master.png` | Master do badge quadrado (1254×1254, mesma marca em quadrado) — fonte dos ícones de sistema; o wordmark horizontal num canvas quadrado viraria uma tirinha no meio do nada |
| `public/logo.webp`, `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico` | Gerados por `python scripts/generate-icons.py`: a master é recortada na arte (a margem transparente sai fora), então a caixa do logo = a marca. `logo.webp` 916×288 (63 KB — o mesmo desenho em PNG pesa 267 KB, é degradê fotográfico); `.ico` traz 32→256 px — sem frame de 16 (logotipo com palavra vira borrão nesse tamanho, e telas 2x já pedem 32), com realce de contraste abaixo de 64 px para o "314" sobreviver ao downscale |
| `components/Logo.tsx` | Renderiza a marca dourada **sem filtro `invert`** (a arte já é para tema escuro), com `width`/`height` reais para segurar o layout no carregamento. Tamanhos: header e rodapé `h-[54px]` (172 px de largura), login `h-[78px]` |
| `public/thumbnails/*.jpg` (11 séries) | Pôsteres fotográficos reais compostos (2026-09): retratos da Wikimedia Commons/Wikipedia em 720×1280, crop 9:16 com viés para o terço superior, grade documental (contraste +10%, saturação leve, vinheta sutil), scrim inferior, micro-label "314 NO DETALHE" + regra laranja + título Oswald Bold branco. Proveniência: `public/thumbnails/ATTRIBUTION.md`. `PosterArt` usa o arquivo por convenção de slug quando `series.thumbnail` está vazio |
| `public/thumbnails/pastor-everaldo-dias.png` e demais artes do dono | Arte comissionada; PosterArt renderiza fotos **em cor** (o `grayscale` forçado foi removido em 2026-09), crop `object-[50%_15%]`, brightness 0.95 |
| `public/noise.png` | Gerado por `scripts/generate-noise.mjs` (tile 180×180 determinístico, seed 0x314) — grão de filme do app e dos pôsteres |
| Capas tipográficas (fallback) | Autorais em `components/PosterArt.tsx`: tipo condensado, selo "314 NO DETALHE", moldura hairline, marca 314, grão — usadas só quando não existe JPG nem thumbnail |
| Ícones | SVG autoral em `components/icons.tsx` (stroke 1.5, currentColor) |

## Revisão

Rodadas de screenshot (Playwright, dev tooling em `scripts/screenshot*.mjs`) em `.impeccable/review/`: home mobile/desktop, cards tipográficos, série (foto e tipográfica), player, paywall, login, assinar. Detector `impeccable detect app components`: 0 achados. Build limpo.
