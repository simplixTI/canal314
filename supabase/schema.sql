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
  thumbnail text not null default '',
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
