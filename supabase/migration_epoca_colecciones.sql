-- ═══════════════════════════════════════════════════════════════
-- La Doce Chapina — Época y colecciones de productos
-- Correr UNA vez en Supabase → SQL Editor. No borra ni cambia datos existentes.
-- ═══════════════════════════════════════════════════════════════

-- Época de la camisa (una sola por producto)
alter table public.products
  add column if not exists era text;

alter table public.products
  drop constraint if exists products_era_check;
alter table public.products
  add constraint products_era_check
  check (era is null or era in ('Actual','2020s','2010s','2000s','90s','80s y antes'));

-- Colecciones (puede tener varias)
alter table public.products
  add column if not exists collections text[] not null default '{}';

-- Índices para que los filtros del catálogo sean rápidos
create index if not exists products_era_idx on public.products (era);
create index if not exists products_team_idx on public.products (team);
create index if not exists products_collections_idx on public.products using gin (collections);
