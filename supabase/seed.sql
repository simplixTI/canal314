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
    'juscelino-kubitschek',
    'Juscelino Kubitschek',
    'A visão de levar o centro do poder para o coração do Brasil: do sonho de uma nova capital à construção de Brasília.',
    'politico',
    '/thumbnails/juscelino-kubitschek.png',
    2
  ),
  (
    'getulio-vargas',
    'Getúlio Vargas',
    'A trajetória do "pai dos pobres": da Revolução de 1930 ao Estado Novo, as leis trabalhistas e o legado que dividiu o Brasil.',
    'politico',
    null,
    3
  ),
  (
    'padre-cicero',
    'Padre Cícero',
    'A história do padim do sertão: fé, milagres e poder no Juazeiro do Norte do século XIX.',
    'religioso',
    null,
    4
  ),
  (
    'chico-xavier',
    'Chico Xavier',
    'A vida do maior médium do Brasil: a psicografia, a humildade de Pedro Leopoldo e a doutrina que consolou milhões.',
    'religioso',
    null,
    5
  )
on conflict (slug) do nothing;

-- ---------- Séries futuras ("Em breve") ----------
-- Candidatos reais do catálogo futuro, SEM episódios: enchem as fileiras
-- da home e recebem capa tipográfica autoral. Ao produzir a série,
-- insira os episódios e o card vira link automaticamente.
insert into public.series (slug, title, description, category, thumbnail, display_order)
values
  (
    'edir-macedo',
    'Edir Macedo',
    'Do funcionário público ao fundador da Universal: a construção de um império evangélico e a entrada da igreja na política brasileira.',
    'religioso',
    null,
    6
  ),
  (
    'lula',
    'Lula',
    'Do torno mecânico ao Planalto: a trajetória do metalúrgico que mudou a política brasileira — idas, vindas e o retorno.',
    'politico',
    null,
    7
  ),
  (
    'irma-dulce',
    'Irmã Dulce',
    'O anjo bom da Bahia: a vida da primeira santa brasileira dedicada aos mais pobres de Salvador.',
    'religioso',
    null,
    8
  ),
  (
    'jair-bolsonaro',
    'Jair Bolsonaro',
    'Do quartel ao Planalto: o capitão que polarizou o Brasil e redefiniu a direita no país.',
    'politico',
    null,
    9
  ),
  (
    'silas-malafaia',
    'Silas Malafaia',
    'O pastor que virou comentarista político: púlpito, televisão e a nova direita evangélica.',
    'religioso',
    null,
    10
  ),
  (
    'tancredo-neves',
    'Tancredo Neves',
    'O presidente que não tomou posse: a luta pelas Diretas e a redemocratização do Brasil.',
    'politico',
    null,
    11
  ),
  (
    'divaldo-franco',
    'Divaldo Franco',
    'O médium educador: a Mansão do Caminho e uma vida dedicada à psicografia e à infância abandonada.',
    'religioso',
    null,
    12
  ),
  (
    'dom-helder-camara',
    'Dom Hélder Câmara',
    'O bispo dos pobres: coragem profética contra a ditadura e a voz da não-violência no Recife.',
    'politico',
    null,
    13
  )
on conflict (slug) do nothing;

-- ---------- Augusto Cury (com teaser grátis) ----------
insert into public.series (slug, title, description, category, thumbnail, display_order)
values
  (
    'augusto-cury',
    'Augusto Cury: O Homem antes do Candidato',
    'Antes dos palanques e dos votos, a história do homem — a trajetória contada na voz de quem viveu.',
    'politico',
    '/thumbnails/augusto-cury.png',
    14
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
