-- ============================================================
-- Canal314 — Schema do banco de dados (Supabase / Postgres)
-- Rode este arquivo no SQL Editor do Supabase ANTES do seed.sql
-- ============================================================

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  trial_started_at timestamptz not null default now()
);

-- Cria o perfil automaticamente quando um usuário se cadastra
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- series ----------
create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  category text not null check (category in ('religioso', 'politico')),
  thumbnail text,
  display_order int not null default 0
);

-- ---------- episodes ----------
create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.series (id) on delete cascade,
  number int not null,
  title text not null,
  youtube_id text not null,
  duration_seconds int not null default 90,
  unique (series_id, number)
);

-- ---------- subscriptions ----------
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  status text not null default 'trialing'
    check (status in ('trialing', 'active', 'canceled', 'expired')),
  provider text not null default 'mock'
    check (provider in ('mock', 'mercadopago', 'stripe')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();

-- ---------- watch_progress ----------
create table if not exists public.watch_progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  episode_id uuid not null references public.episodes (id) on delete cascade,
  watched_at timestamptz not null default now(),
  primary key (user_id, episode_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.series enable row level security;
alter table public.episodes enable row level security;
alter table public.subscriptions enable row level security;
alter table public.watch_progress enable row level security;

-- profiles: usuário lê/atualiza apenas o próprio perfil
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- series e episodes: leitura pública (catálogo aberto)
create policy "series_select_public"
  on public.series for select
  using (true);

create policy "episodes_select_public"
  on public.episodes for select
  using (true);

-- subscriptions: usuário lê e escreve apenas a própria assinatura
-- (escrita necessária para o fluxo mock; com gateway real, a escrita
--  passa a ser feita pelo webhook com a service role key)
create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "subscriptions_insert_own"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "subscriptions_update_own"
  on public.subscriptions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- watch_progress: usuário lê e escreve apenas o próprio progresso
create policy "watch_progress_select_own"
  on public.watch_progress for select
  using (auth.uid() = user_id);

create policy "watch_progress_insert_own"
  on public.watch_progress for insert
  with check (auth.uid() = user_id);

create policy "watch_progress_update_own"
  on public.watch_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- Ações do player (2026-09): curtidas de episódio + "Minha Lista"
-- ============================================================

-- episode_likes: curtida do usuário em um episódio
create table if not exists public.episode_likes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  episode_id uuid not null references public.episodes (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, episode_id)
);

-- list_entries: série salva na "Minha Lista" do usuário
create table if not exists public.list_entries (
  user_id uuid not null references public.profiles (id) on delete cascade,
  series_id uuid not null references public.series (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, series_id)
);

alter table public.episode_likes enable row level security;
alter table public.list_entries enable row level security;

-- episode_likes: leitura pública (contagem de curtidas não é sensível);
-- escrita apenas na própria linha
drop policy if exists "episode_likes_select_public" on public.episode_likes;
create policy "episode_likes_select_public"
  on public.episode_likes for select
  using (true);

drop policy if exists "episode_likes_insert_own" on public.episode_likes;
create policy "episode_likes_insert_own"
  on public.episode_likes for insert
  with check (auth.uid() = user_id);

drop policy if exists "episode_likes_delete_own" on public.episode_likes;
create policy "episode_likes_delete_own"
  on public.episode_likes for delete
  using (auth.uid() = user_id);

-- list_entries: usuário lê e escreve apenas as próprias linhas
drop policy if exists "list_entries_select_own" on public.list_entries;
create policy "list_entries_select_own"
  on public.list_entries for select
  using (auth.uid() = user_id);

drop policy if exists "list_entries_insert_own" on public.list_entries;
create policy "list_entries_insert_own"
  on public.list_entries for insert
  with check (auth.uid() = user_id);

drop policy if exists "list_entries_delete_own" on public.list_entries;
create policy "list_entries_delete_own"
  on public.list_entries for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 314Coins (2026-09): ledger de moedas + episódios desbloqueados
-- ============================================================

-- coin_transactions: ledger de 314Coins do usuário
-- amount > 0 = compra (kind='purchase'); amount < 0 = gasto (kind='unlock')
create table if not exists public.coin_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount int not null,
  kind text not null check (kind in ('purchase', 'unlock')),
  episode_id uuid references public.episodes (id) on delete set null,
  pack_id text,
  created_at timestamptz not null default now()
);

-- episode_unlocks: episódio avulso desbloqueado com coins
create table if not exists public.episode_unlocks (
  user_id uuid not null references public.profiles (id) on delete cascade,
  episode_id uuid not null references public.episodes (id) on delete cascade,
  coins_spent int not null,
  created_at timestamptz not null default now(),
  primary key (user_id, episode_id)
);

alter table public.coin_transactions enable row level security;
alter table public.episode_unlocks enable row level security;

-- coin_transactions: usuário lê e insere apenas as próprias linhas
drop policy if exists "coin_transactions_select_own" on public.coin_transactions;
create policy "coin_transactions_select_own"
  on public.coin_transactions for select
  using (auth.uid() = user_id);

drop policy if exists "coin_transactions_insert_own" on public.coin_transactions;
create policy "coin_transactions_insert_own"
  on public.coin_transactions for insert
  with check (auth.uid() = user_id);

-- episode_unlocks: usuário lê e insere apenas as próprias linhas
drop policy if exists "episode_unlocks_select_own" on public.episode_unlocks;
create policy "episode_unlocks_select_own"
  on public.episode_unlocks for select
  using (auth.uid() = user_id);

drop policy if exists "episode_unlocks_insert_own" on public.episode_unlocks;
create policy "episode_unlocks_insert_own"
  on public.episode_unlocks for insert
  with check (auth.uid() = user_id);

-- ============================================================
-- Curtida de série (teaser, 2026-09)
-- ============================================================

-- series_likes: curtida do usuário na série (usado no player do teaser)
create table if not exists public.series_likes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  series_id uuid not null references public.series (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, series_id)
);

alter table public.series_likes enable row level security;

-- leitura pública (contagem); escrita apenas na própria linha
drop policy if exists "series_likes_select_public" on public.series_likes;
create policy "series_likes_select_public"
  on public.series_likes for select
  using (true);

drop policy if exists "series_likes_insert_own" on public.series_likes;
create policy "series_likes_insert_own"
  on public.series_likes for insert
  with check (auth.uid() = user_id);

drop policy if exists "series_likes_delete_own" on public.series_likes;
create policy "series_likes_delete_own"
  on public.series_likes for delete
  using (auth.uid() = user_id);
