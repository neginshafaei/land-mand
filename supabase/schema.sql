create extension if not exists pgcrypto;

create table if not exists public.users (
  id bigint primary key,
  username text,
  first_name text,
  balance integer not null default 1000,
  last_claim timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.lands (
  id uuid primary key default gen_random_uuid(),
  x integer not null,
  y integer not null,
  owner_id bigint references public.users(id) on delete set null,
  rarity text not null default 'Common',
  income_per_hour integer not null default 1,
  level integer not null default 1,
  for_sale boolean not null default false,
  sale_price integer,
  created_at timestamptz not null default now(),
  unique (x, y),
  check (rarity in ('Common', 'Rare', 'Epic', 'Legendary')),
  check (income_per_hour >= 0),
  check (level >= 1),
  check (sale_price is null or sale_price > 0)
);

create index if not exists lands_owner_id_idx on public.lands(owner_id);
create index if not exists lands_for_sale_idx on public.lands(for_sale) where for_sale = true;

alter table public.users
  add column if not exists username text,
  add column if not exists first_name text,
  add column if not exists balance integer not null default 1000,
  add column if not exists last_claim timestamptz not null default now(),
  add column if not exists created_at timestamptz not null default now();

alter table public.users
  alter column balance set default 1000;

alter table public.lands
  add column if not exists rarity text not null default 'Common',
  add column if not exists income_per_hour integer not null default 1,
  add column if not exists level integer not null default 1,
  add column if not exists for_sale boolean not null default false,
  add column if not exists sale_price integer,
  add column if not exists created_at timestamptz not null default now();

insert into public.lands (x, y)
select x, y
from generate_series(0, 19) as x
cross join generate_series(0, 19) as y
on conflict (x, y) do nothing;

notify pgrst, 'reload schema';
