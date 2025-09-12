-- Tabela N:N para fundições x categorias
create table if not exists public.foundry_category_links (
  foundry_id uuid not null references public.foundries(id) on delete cascade,
  category_id uuid not null references public.foundry_categories(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (foundry_id, category_id)
);

alter table public.foundry_category_links enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='foundry_category_links' and policyname='Public can view foundry-category links'
  ) then
    create policy "Public can view foundry-category links" on public.foundry_category_links for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='foundry_category_links' and policyname='Admins manage foundry-category links'
  ) then
    create policy "Admins manage foundry-category links" on public.foundry_category_links for all using (is_admin()) with check (is_admin());
  end if;
end $$;

-- Backfill a partir de foundries.category_id
insert into public.foundry_category_links (foundry_id, category_id)
select f.id, f.category_id from public.foundries f
where f.category_id is not null
on conflict do nothing;


