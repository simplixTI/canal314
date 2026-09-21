# Canal314

Plataforma de streaming de **micro-documentários verticais** (episódios de 1–2 minutos) sobre grandes nomes religiosos e políticos do Brasil — no estilo ReelShort.

## Como funciona

- **Catálogo aberto**: qualquer pessoa navega pelas séries e episódios.
- **Teste grátis de 3 dias**: ao criar a conta, o usuário assiste aos **2 primeiros episódios de cada série** gratuitamente.
- **Assinatura R$19,90/mês**: libera todos os episódios. Nesta versão o pagamento é **simulado (mock)** — a arquitetura já está pronta para plugar Mercado Pago ou Stripe via webhook.
- **Vídeos**: hospedados no YouTube como **não listados** e incorporados em um player vertical 9:16.

## Stack

- [Next.js 14](https://nextjs.org/) (App Router) + TypeScript + Tailwind CSS
- [Supabase](https://supabase.com/) — Auth (e-mail/senha + Google) e Postgres
- Deploy recomendado: [Vercel](https://vercel.com/)

## Pré-requisitos

- Node.js 18+
- Conta gratuita no [Supabase](https://supabase.com/)

## Configuração do Supabase (passo a passo)

1. Acesse [supabase.com](https://supabase.com), crie uma conta e clique em **New project**. Escolha nome, senha do banco e região (ex.: `South America (São Paulo)`).
2. Com o projeto criado, abra o **SQL Editor** (menu lateral) e clique em **New query**.
3. Cole todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e clique em **Run**. Isso cria as tabelas (`profiles`, `series`, `episodes`, `subscriptions`, `watch_progress`), as políticas de segurança (RLS) e o gatilho que cria o perfil automaticamente a cada novo cadastro.
4. Crie outra query, cole o conteúdo de [`supabase/seed.sql`](supabase/seed.sql) e clique em **Run**. Isso carrega 3 séries de exemplo (Getúlio Vargas, Padre Cícero, Chico Xavier) com 5 episódios cada.
5. Vá em **Project Settings → API** e copie:
   - **Project URL**
   - **anon public** key
6. Na raiz do projeto, copie `.env.local.example` para `.env.local` e preencha:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA-CHAVE-ANON-PUBLICA
   ```

### Login com Google (opcional)

1. No Supabase, vá em **Authentication → Providers → Google** e ative.
2. Siga as instruções do painel para criar as credenciais OAuth no [Google Cloud Console](https://console.cloud.google.com/) e cole o Client ID/Secret.
3. Adicione a URL de callback exibida pelo Supabase nas URLs autorizadas do Google.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

> Sem o `.env.local` o app compila e renderiza normalmente, mas mostra um aviso de "Supabase não configurado" no lugar do catálogo.

## Trocando os vídeos de exemplo

O seed usa IDs de YouTube placeholder. Quando seus episódios estiverem no YouTube (envie como **Não listado**), atualize pelo SQL Editor:

```sql
update public.episodes
set youtube_id = 'ID_DO_SEU_VIDEO'
where series_id = (select id from public.series where slug = 'getulio-vargas')
  and number = 1;
```

O ID é a parte depois de `watch?v=` na URL do vídeo (ex.: `dQw4w9WgXcQ`).

Para adicionar novas séries/episódios, basta inserir linhas nas tabelas `series` e `episodes` (SQL Editor ou Table Editor do Supabase).

## Miniaturas das séries

Os pôsteres ficam em `public/thumbnails/`. Para trocar ou adicionar uma miniatura:

1. Salve a imagem (idealmente vertical, ex.: 941×1672) em `public/thumbnails/<slug-da-serie>.jpg` (ou `.png`) e faça commit no repositório.
2. Aponte a série para o arquivo, pelo SQL Editor:

```sql
update public.series
set thumbnail = '/thumbnails/pastor-everaldo-dias.png'
where slug = 'pastor-everaldo-dias';
```

Se `thumbnail` estiver vazio (`null`), o catálogo mostra um pôster tipográfico com o título da série.

## Deploy na Vercel

1. Crie um repositório no GitHub e suba o código:

   ```bash
   git init
   git add .
   git commit -m "Canal314"
   git remote add origin https://github.com/SEU-USUARIO/canal314.git
   git push -u origin main
   ```

2. Em [vercel.com](https://vercel.com), clique em **Add New → Project** e importe o repositório.
3. Em **Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os mesmos valores do `.env.local`.
4. Clique em **Deploy**.
5. Para usar domínio próprio: em **Settings → Domains**, adicione seu domínio e configure os registros DNS indicados (tipo `A` para `76.76.21.21` ou `CNAME` para `cname.vercel-dns.com`) no painel do seu registrador.
6. No Supabase, em **Authentication → URL Configuration**, defina a **Site URL** como o domínio de produção e adicione-o em **Redirect URLs** (necessário para login com Google e confirmação de e-mail).

## Estrutura do projeto

```
app/
  page.tsx                  Home: hero + catálogo
  serie/[slug]/             Detalhe da série + lista de episódios
  assistir/[slug]/[ep]/     Player vertical 9:16 (com verificação de acesso)
  login/                    Login e cadastro (e-mail/senha + Google)
  assinar/                  Paywall / checkout simulado
  conta/                    Status do plano, continuar assistindo, sair
  api/subscription/         Ativar/cancelar assinatura (mock, webhook-ready)
lib/
  access.ts                 Regras de acesso (trial x assinatura)
  billing/                  Provedor de cobrança (mock; plugável)
  supabase/                 Clients (server e browser)
supabase/
  schema.sql                Tabelas + RLS + gatilho de perfil
  seed.sql                  Séries e episódios de exemplo
```

## Próximos passos

- **Pagamento real**: criar um provider em `lib/billing/` (Mercado Pago ou Stripe), redirecionar para o checkout do gateway e confirmar a assinatura via webhook (nova rota em `app/api/webhooks/`) usando a *service role key*.
- **Painel admin**: interface para gerenciar séries/episódios sem SQL.
- **PWA / app mobile**, notificações de novos episódios e analytics.
