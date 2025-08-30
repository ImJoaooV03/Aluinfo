
-- 1) Criar tabelas de categorias separadas
create table if not exists public.news_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  description text,
  created_at timestamptz not null default now()
);

-- 2) Habilitar RLS
alter table public.news_categories enable row level security;
alter table public.supplier_categories enable row level security;

-- 3) Políticas de acesso
drop policy if exists "Qualquer um pode ver categorias de notícias" on public.news_categories;
create policy "Qualquer um pode ver categorias de notícias"
  on public.news_categories
  for select
  using (true);

drop policy if exists "Admins podem gerenciar categorias de notícias" on public.news_categories;
create policy "Admins podem gerenciar categorias de notícias"
  on public.news_categories
  for all
  using (is_admin());

drop policy if exists "Qualquer um pode ver categorias de fornecedores" on public.supplier_categories;
create policy "Qualquer um pode ver categorias de fornecedores"
  on public.supplier_categories
  for select
  using (true);

drop policy if exists "Admins podem gerenciar categorias de fornecedores" on public.supplier_categories;
create policy "Admins podem gerenciar categorias de fornecedores"
  on public.supplier_categories
  for all
  using (is_admin());

-- 4) Copiar os dados existentes da tabela 'categories' para as novas tabelas,
-- preservando os IDs para que os relacionamentos atuais continuem válidos
insert into public.news_categories (id, name, slug, description, created_at)
select id, name, slug, description, coalesce(created_at, now())
from public.categories
on conflict (id) do nothing;

insert into public.supplier_categories (id, name, slug, description, created_at)
select id, name, slug, description, coalesce(created_at, now())
from public.categories
on conflict (id) do nothing;

-- 5) Ajustar as FKs dos cadastros para apontar para as novas tabelas
alter table public.news
  drop constraint if exists news_category_id_fkey;

alter table public.news
  add constraint news_category_id_fkey
  foreign key (category_id)
  references public.news_categories (id)
  on delete set null;

alter table public.suppliers
  drop constraint if exists suppliers_category_id_fkey;

alter table public.suppliers
  add constraint suppliers_category_id_fkey
  foreign key (category_id)
  references public.supplier_categories (id)
  on delete set null;

-- 6) Índices úteis (opcional, para ordenação/busca)
create index if not exists idx_news_categories_name on public.news_categories (name);
create index if not exists idx_supplier_categories_name on public.supplier_categories (name);
