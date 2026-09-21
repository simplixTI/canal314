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

## Modelo de negócio (decidido em 2026-09-21)

- **Episódios 1–2**: grátis para todos, sem login
- **Episódio 3+**: exige login; desbloqueia avulso com **314Coins** (30 coins/ep) ou tudo com o **314 Pass** (R$19,90/mês)
- **Pacotes de coins**: 200 (R$9,90) · 500 (R$19,90) · 1200 (R$39,90) — checkout ainda MOCK
- **Teasers**: MP4 vertical hospedado no app, grátis sem login (marketing das estreias)
- Trial de 3 dias: **ABANDONADO** (substituído pelo modelo coins+passe)

## Identidade visual

- Estilo: streaming clássico (referência reelshort.com/pt) — hero do carro-chefe + fileiras horizontais; player vertical imersivo
- Cor: preto `#0a0a0a` + branco + **laranja `#FF6A00`** (token `--accent`; laranja = ação/destaque)
- Tipografia: Oswald (títulos) + Inter (corpo), self-hosted via next/font
- Logo: ícone dourado (sem `invert` — a arte já é para tema escuro), recortado na marca e servido em `public/logo.png` (94 KB, era 1,1 MB): header 54px, login 78px. Master em `assets/logo-master.png`; ícones (`app/icon.png`, `apple-icon.png`, `favicon.ico` 16→256) saem de `python scripts/generate-icons.py`
- Detalhes: DESIGN.md (sistema completo), PRODUCT.md (verdades do produto), `.impeccable/surfaces/` (contratos)

## Feito ✅

### Plataforma
- [x] App Next.js 15 + Tailwind + Supabase (Auth + Postgres), deploy Vercel via GitHub
- [x] Home: hero do carro-chefe (display_order=1) + fileiras "Novo Lançamento" (prioriza séries com conteúdo), "Mais Assistidos" 🔥, "Religioso", "Político"
- [x] Cards das fileiras expandem no hover (desktop): título, descrição, Reproduzir/Lista/Enviar — mobile sem hover, toque navega
- [x] Página da série: abertura cinematográfica, teaser no topo da lista, chip "Grátis" eps 1–2, cadeado + custo em coins nos 3+
- [x] Player de episódio: vertical fullscreen (9:16 centralizado no desktop), chrome mínimo, anterior/próximo
- [x] Player de teaser: MP4 próprio fullscreen, grátis sem login, para o áudio ao sair da página (fix de ghost audio)
- [x] Ações do player: Curtir (laranja + contagem), Lista, Enviar (share/clipboard) — no teaser a curtida vale para a série
- [x] Paywall por variante: anônimo (criar conta) / saldo suficiente (desbloquear 30 coins) / saldo insuficiente (comprar coins) + alternativa 314 Pass
- [x] 314Coins: saldo no header, página `/coins` com 3 pacotes (mock), ledger em `coin_transactions`
- [x] 314 Pass: página `/assinar` rebrandeada, assinatura mock (ativa 30 dias) — pronta para webhook de gateway
- [x] Conta: saldo coins, status do passe, Minha Lista, continuar assistindo, logout
- [x] Nav: Início · Categorias (âncora) · PodCast · Zap da Fé (externo, nova aba → zapdafe.com.br/mensagem)
- [x] PodCast: página com episódio do YouTube incorporado (ID XrhcJl8tf5w)
- [x] Layout fullscreen responsivo (sem coluna de 430px; blocos de texto em max-w próprios)

### Conteúdo
- [x] Séries reais: Pastor Everaldo Dias (carro-chefe, capa própria), Getúlio Vargas, Padre Cícero, Chico Xavier, Juscelino Kubitschek (capa própria), Augusto Cury (capa própria, categoria político)
- [x] Séries "Em breve" (thumbs tipográficas autorais, não clicáveis): Edir Macedo, Irmã Dulce, Silas Malafaia, Divaldo Franco, Lula, Jair Bolsonaro, Tancredo Neves, Dom Hélder Câmara
- [x] Teasers no ar: Augusto Cury (1:17) e Juscelino Kubitschek (2:13) — em `public/teasers/`

### Banco (Supabase)
- [x] `profiles`, `series`, `episodes`, `subscriptions`, `watch_progress` + trigger de perfil no cadastro
- [x] `episode_likes` (pública p/ contagem), `list_entries`, `series_likes` (curtida de teaser)
- [x] `coin_transactions` (ledger), `episode_unlocks`
- [x] RLS em todas as tabelas

## Pendências ⏳

### Bloqueadas (precisam de você)
- [ ] **IDs reais do YouTube** dos episódios (hoje todos usam placeholder `dQw4w9WgXcQ`) — passar série + nº do ep + ID; atualizar via SQL Editor (snippet no README)
- [ ] **Vídeo do PodCast está PRIVADO** — mudar para "Não listado" no YouTube Studio, senão ninguém assiste
- [ ] Confirmação de e-mail do Supabase está LIGADA — avaliar desligar em Authentication → Providers → Email (facilita cadastro)
- [ ] Arquivo `public/logo_.png` (marca preta horizontal antiga) continua sem uso — confirmar se pode apagar

### Produto / técnica
- [ ] Gateway de pagamento REAL (Mercado Pago recomendado: Pix + recorrência) — plugar nos pacotes de coins e no 314 Pass via webhook (`lib/billing/` isolado para isso)
- [ ] Domínio próprio na Vercel + ajustar Site URL/Redirect URLs no Supabase Auth
- [ ] Painel admin (cadastrar séries/episódios sem SQL) — hoje é via SQL Editor/Table Editor
- [ ] Botão "Perguntar" no player (aguarda canal oficial: WhatsApp/contato)
- [ ] Capas das séries "Em breve" quando existirem (hoje tipográficas)
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
