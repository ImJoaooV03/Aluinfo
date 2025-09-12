-- Tabela N:N para fornecedores x categorias
create table if not exists public.supplier_category_links (
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  category_id uuid not null references public.supplier_categories(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (supplier_id, category_id)
);

alter table public.supplier_category_links enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='supplier_category_links' and policyname='Public can view supplier-category links'
  ) then
    create policy "Public can view supplier-category links" on public.supplier_category_links for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='supplier_category_links' and policyname='Admins manage supplier-category links'
  ) then
    create policy "Admins manage supplier-category links" on public.supplier_category_links for all using (is_admin()) with check (is_admin());
  end if;
end $$;

-- Backfill a partir de suppliers.category_id
insert into public.supplier_category_links (supplier_id, category_id)
select s.id, s.category_id from public.suppliers s
where s.category_id is not null
on conflict do nothing;


