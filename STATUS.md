# STATUS — Canal314

> Registro vivo do projeto: o que foi feito, o que está pendente e onde cada coisa mora.
> **Atualize este arquivo a cada mudança relevante.**
> Última atualização: 2026-09-21

## Links e acessos

| Recurso | Onde |
|---|---|
| Site (produção) | https://canal314.vercel.app |
| Repositório | https://github.com/simplixTI/canal314 |
| Projeto Vercel | time `simplix`, projeto `canal314` (framework: nextjs; proteção de deploy DESLIGADA) |
| Supabase | projeto `Canal 314` — https://taawisexhlnvuqzybvxq.supabase.co (região West US) |
| Deploy | automático: `git push` na branch `main` → build e publica |
| Env vars | `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Vercel: production+preview; local: `.env.local`) |
| E-mail | Resend, remetente `noreply@canal314.com.br` — `RESEND_API_KEY` (chave **restrita a envio**, só servidor) + `EMAIL_FROM`; helper em `lib/email.ts`, teste com `node scripts/email-test.mjs voce@exemplo.com` |

## Modelo de negócio (decidido em 2026-09-21)

- **Episódios 1–2**: grátis para todos, sem login
- **Episódio 3+**: exige login; desbloqueia avulso com **314Coins** (30 coins/ep) ou tudo com o **314 Pass** (R$19,90/mês)
- **Pacotes de coins**: 200 (R$9,90) · 500 (R$19,90) · 1200 (R$39,90) — checkout ainda MOCK
- **Teasers**: MP4 vertical hospedado no app, grátis sem login (marketing das estreias)
- Trial de 3 dias: **ABANDONADO** (substituído pelo modelo coins+passe)

## Identidade visual

- Estilo: streaming clássico (referência reelshort.com/pt) — hero do carro-chefe + fileiras horizontais; player vertical imersivo
- Cor: preto `#0a0a0a` + branco + **laranja `#FF6A00`** (token `--accent`; laranja = ação/destaque) + **fotos em COR natural** (2026-09: o site saiu do monocromático forçado — pôsteres fotográficos reais coloridos, grade documental suave; figuras históricas mantêm o tom original do registro)
- Tipografia: Oswald (títulos) + Inter (corpo), self-hosted via next/font
- Logo: marca dourada horizontal (sem `invert` — a arte já é para tema escuro), aparada na marca e servida em `public/logo.webp` (63 KB): header e rodapé 54px de altura (172px de largura), login 78px. Masters em `assets/` (horizontal para a tela, quadrada para os ícones); `app/icon.png`, `apple-icon.png` e `favicon.ico` (32→256) saem de `python scripts/generate-icons.py`
- Detalhes: DESIGN.md (sistema completo), PRODUCT.md (verdades do produto), `.impeccable/surfaces/` (contratos)

## Feito ✅

### Plataforma
- [x] App Next.js 15 + Tailwind + Supabase (Auth + Postgres), deploy Vercel via GitHub
- [x] Home: hero do carro-chefe (display_order=1) + fileiras "Novo Lançamento" (prioriza séries com conteúdo), "Mais Assistidos" 🔥, "Religioso", "Político"
- [x] Cards das fileiras expandem no hover (desktop): título, descrição, Reproduzir/Lista/Enviar — mobile sem hover, toque navega
- [x] Página da série: abertura cinematográfica, teaser no topo da lista, chip "Grátis" eps 1–2, cadeado + custo em coins nos 3+
- [x] Player de episódio: vertical fullscreen (9:16 centralizado no desktop), chrome mínimo, anterior/próximo
- [x] Player de teaser: MP4 próprio fullscreen, grátis sem login, para o áudio ao sair da página (fix de ghost audio). Entra **mudo e tocando** (decisão de 2026-09-24: som automático assusta) com botão "Ativar som" em laranja no canto superior direito
- [x] Ações do player: Curtir (laranja + contagem), Lista, Enviar (share/clipboard) — no teaser a curtida vale para a série
- [x] Paywall por variante: anônimo (criar conta) / saldo suficiente (desbloquear 30 coins) / saldo insuficiente (comprar coins) + alternativa 314 Pass
- [x] 314Coins: saldo no header, página `/coins` com 3 pacotes (mock), ledger em `coin_transactions`
- [x] 314 Pass: página `/assinar` rebrandeada, assinatura mock (ativa 30 dias) — pronta para webhook de gateway
- [x] Conta: saldo coins, status do passe, Minha Lista, continuar assistindo, logout
- [x] E-mail de cadastro pela Resend (`POST /api/email/cadastro`, disparado pelo LoginForm logo após o signUp; destinatário vem da sessão, só nos 10 primeiros minutos da conta). Modelo em `lib/email-templates.ts`, envio em `lib/email.ts`
- [x] Nav: Início · Categorias (âncora) · PodCast · Zap da Fé (externo, nova aba → zapdafe.com.br/mensagem)
- [x] **Header mobile padrão ReelShort (2026-09)**: hambúrguer + logo centrada + busca/avatar, abas com underline laranja na ativa; drawer lateral real (seções, 314Coins, 314 Pass, legais, Sair); busca real por título (ilike Supabase, debounce, overlay full-screen). Desktop ≥ lg inalterado
- [x] PodCast: página com episódio do YouTube incorporado (ID XrhcJl8tf5w)
- [x] Rodapé em todas as telas menos o player: marca + copyright + redes, colunas Canal/Assistir/Sobre, barra "314 no detalhe"
- [x] Páginas institucionais `/termos`, `/privacidade`, `/contato` — texto base **sem revisão jurídica**
- [x] Layout fullscreen responsivo (sem coluna de 430px; blocos de texto em max-w próprios)

### Conteúdo
- [x] Séries reais: Pastor Everaldo Dias (carro-chefe, capa própria), Getúlio Vargas, Padre Cícero, Chico Xavier, Juscelino Kubitschek (capa própria), Augusto Cury (capa própria, categoria político)
- [x] **Pôsteres fotográficos reais (coloridos) para as 11 séries sem capa** (2026-09): retratos da Wikimedia Commons/Wikipedia, compostos em 720×1280 (crop 9:16, grade documental suave, scrim, título Oswald + micro-label "314 NO DETALHE" + regra laranja) em `public/thumbnails/<slug>.jpg`; proveniência em `public/thumbnails/ATTRIBUTION.md`. PosterArt cai no arquivo por convenção de slug quando `series.thumbnail` está vazio (sem SQL) e NÃO força mais grayscale — o site agora é colorido; figuras históricas mantêm o tom P&B/sépia do registro original
- [x] Séries "Em breve" (não clicáveis sem episódios nem teaser): Edir Macedo, Irmã Dulce, Silas Malafaia, Divaldo Franco, Lula, Jair Bolsonaro, Tancredo Neves, Dom Hélder Câmara — todas com pôster fotográfico próprio
- [x] Teasers no ar: Pastor Everaldo Dias (0:30), Augusto Cury (1:17) e Juscelino Kubitschek (2:13) — em `public/teasers/`
- [x] Hero da home leva ao teaser quando a série tem um (o carro-chefe abre no teaser, não no episódio 1 com YouTube placeholder)

### Banco (Supabase)
- [x] `profiles`, `series`, `episodes`, `subscriptions`, `watch_progress` + trigger de perfil no cadastro
- [x] `episode_likes` (pública p/ contagem), `list_entries`, `series_likes` (curtida de teaser)
- [x] `coin_transactions` (ledger), `episode_unlocks`
- [x] RLS em todas as tabelas

## Pendências ⏳

### Bloqueadas (precisam de você)
- [ ] **Supabase Auth (painel)**: Authentication → Providers → Email → **Confirm email: OFF** (o e-mail de cadastro sai pela Resend, não pelo Supabase); Authentication → URL Configuration → **Site URL** = `https://canal314.vercel.app` e Redirect URLs `https://canal314.vercel.app/**` — hoje está em localhost e todo link de auth (reset de senha, Google) cai lá
- [ ] **Resend**: confirmar que `canal314.com.br` está verificado (DKIM/SPF) — a chave é restrita a envio e não deixa consultar; `node scripts/email-test.mjs voce@exemplo.com` responde na hora
- [ ] **Dados públicos em `lib/site.ts` são PALPITE** — e-mail `contato@canal314.com.br` (domínio ainda não existe) e os @ de YouTube/Instagram/TikTok. O rodapé e `/contato` apontam para lá; corrigir o arquivo conserta o site inteiro
- [ ] **Termos e Privacidade precisam de revisão de advogado** antes de valer como contrato (o texto descreve o produto real, mas foi escrito por IA)
- [ ] **IDs reais do YouTube** dos episódios (hoje todos usam placeholder `dQw4w9WgXcQ`) — passar série + nº do ep + ID; atualizar via SQL Editor (snippet no README)
- [ ] **Vídeo do PodCast está PRIVADO** — mudar para "Não listado" no YouTube Studio, senão ninguém assiste
- [ ] Sobraram em `public/` duas artes sem uso — `logo_.png` (marca preta antiga) e `logo_2.png` (badge quadrado do logo anterior): confirmar se podem ser apagadas

### Produto / técnica
- [ ] Gateway de pagamento REAL (Mercado Pago recomendado: Pix + recorrência) — plugar nos pacotes de coins e no 314 Pass via webhook (`lib/billing/` isolado para isso)
- [ ] Domínio próprio na Vercel + ajustar Site URL/Redirect URLs no Supabase Auth
- [ ] Painel admin (cadastrar séries/episódios sem SQL) — hoje é via SQL Editor/Table Editor
- [ ] Botão "Perguntar" no player (aguarda canal oficial: WhatsApp/contato)
- [ ] Testar fluxo completo de ponta a ponta com conta real: comprar pacote (mock) → desbloquear ep 3 → curtir/listar
- [ ] PWA / app mobile, notificações, analytics (fase futura)

## Operação (cola rápida)

**Rodar SQL no banco**: SQL Editor do Supabase (o CLI perdeu privilégio no projeto — 403; não usar `supabase db query`).

**Trocar vídeo de um episódio**:
```sql
update public.episodes set youtube_id = 'ID_REAL'
where series_id = (select id from public.series where slug = 'SLUG') and number = N;
```

**Adicionar teaser**: comprimir (`ffmpeg -i in.mp4 -vf "scale=720:1280" -c:v libx264 -crf 27 -c:a aac -ar 44100 -b:a 128k -movflags +faststart public/teasers/<slug>.mp4`) → registrar em `lib/teasers.ts`.

**Adicionar série**: insert em `series` (com `thumbnail = '/thumbnails/<slug>.png'` se houver capa) + episódios em `episodes`. Série com 0 episódios aparece "Em breve" e não é clicável (a menos que tenha teaser).

**Estrutura do repo**: README.md (setup/deploy) · PRODUCT.md (produto/marca) · DESIGN.md (design system) · `supabase/schema.sql` + `seed.sql` (idempotentes) · `lib/access.ts` (regras de acesso) · `lib/coins.ts` (pacotes/preços) · `lib/billing/` (pagamento mock→real)
