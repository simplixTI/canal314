-- ============================================================
-- Canal314 — Dados de exemplo (seed)
-- Rode no SQL Editor do Supabase DEPOIS do schema.sql
--
-- ⚠️ IMPORTANTE: os youtube_id abaixo são PLACEHOLDERS.
-- Substitua cada um pelo ID real dos seus vídeos NÃO LISTADOS
-- do YouTube (a parte depois de "watch?v=" na URL).
-- Ex.: update public.episodes set youtube_id = 'SEU_ID_REAL'
--      where ... ;
-- ============================================================

insert into public.series (slug, title, description, category, thumbnail, display_order)
values
  (
    'pastor-everaldo-dias',
    'Pastor Everaldo Dias: Do Poder à Prisão',
    'Fé, família e a campanha à Presidência em 2014 — e a queda que levou o pastor à prisão. Uma série na voz de quem viveu.',
    'religioso',
    '/thumbnails/pastor-everaldo-dias.png',
    1
  ),
  (
    'getulio-vargas',
    'Getúlio Vargas',
    'A trajetória do "pai dos pobres": da Revolução de 1930 ao Estado Novo, as leis trabalhistas e o legado que dividiu o Brasil.',
    'politico',
    null,
    2
  ),
  (
    'padre-cicero',
    'Padre Cícero',
    'A história do padim do sertão: fé, milagres e poder no Juazeiro do Norte do século XIX.',
    'religioso',
    null,
    3
  ),
  (
    'chico-xavier',
    'Chico Xavier',
    'A vida do maior médium do Brasil: a psicografia, a humildade de Pedro Leopoldo e a doutrina que consolou milhões.',
    'religioso',
    null,
    4
  )
on conflict (slug) do nothing;

-- ---------- Pastor Everaldo Dias ----------
insert into public.episodes (series_id, number, title, youtube_id, duration_seconds)
select s.id, e.number, e.title, e.youtube_id, e.duration_seconds
from public.series s
join (values
  (1, 'O menino de Acari', 'dQw4w9WgXcQ', 95),
  (2, 'A fé que virou missão', 'dQw4w9WgXcQ', 100),
  (3, 'Fé, família e Presidência: 2014', 'dQw4w9WgXcQ', 90),
  (4, 'Do poder à prisão', 'dQw4w9WgXcQ', 105),
  (5, 'Um dia de cada vez: o recomeço', 'dQw4w9WgXcQ', 110)
) as e(number, title, youtube_id, duration_seconds) on true
where s.slug = 'pastor-everaldo-dias'
on conflict (series_id, number) do nothing;

-- ---------- Getúlio Vargas ----------
insert into public.episodes (series_id, number, title, youtube_id, duration_seconds)
select s.id, e.number, e.title, e.youtube_id, e.duration_seconds
from public.series s
join (values
  (1, 'O gaúcho que chegou ao poder', 'dQw4w9WgXcQ', 95),
  (2, 'A Revolução de 1930', 'dQw4w9WgXcQ', 100),
  (3, 'O Estado Novo', 'dQw4w9WgXcQ', 90),
  (4, 'A CLT e o voto feminino', 'dQw4w9WgXcQ', 105),
  (5, 'A carta-testamento', 'dQw4w9WgXcQ', 110)
) as e(number, title, youtube_id, duration_seconds) on true
where s.slug = 'getulio-vargas'
on conflict (series_id, number) do nothing;

-- ---------- Padre Cícero ----------
insert into public.episodes (series_id, number, title, youtube_id, duration_seconds)
select s.id, e.number, e.title, e.youtube_id, e.duration_seconds
from public.series s
join (values
  (1, 'O menino do Crato', 'dQw4w9WgXcQ', 92),
  (2, 'O milagre da hóstia', 'dQw4w9WgXcQ', 98),
  (3, 'Juazeiro, a nova Jerusalém', 'dQw4w9WgXcQ', 102),
  (4, 'O padre que virou político', 'dQw4w9WgXcQ', 96),
  (5, 'O legado do padim', 'dQw4w9WgXcQ', 108)
) as e(number, title, youtube_id, duration_seconds) on true
where s.slug = 'padre-cicero'
on conflict (series_id, number) do nothing;

-- ---------- Chico Xavier ----------
insert into public.episodes (series_id, number, title, youtube_id, duration_seconds)
select s.id, e.number, e.title, e.youtube_id, e.duration_seconds
from public.series s
join (values
  (1, 'A infância em Pedro Leopoldo', 'dQw4w9WgXcQ', 94),
  (2, 'O primeiro livro psicografado', 'dQw4w9WgXcQ', 99),
  (3, 'O caso Humberto de Campos', 'dQw4w9WgXcQ', 104),
  (4, 'Pinga-fogo e a fama nacional', 'dQw4w9WgXcQ', 97),
  (5, 'A missão de Uberaba', 'dQw4w9WgXcQ', 112)
) as e(number, title, youtube_id, duration_seconds) on true
where s.slug = 'chico-xavier'
on conflict (series_id, number) do nothing;
