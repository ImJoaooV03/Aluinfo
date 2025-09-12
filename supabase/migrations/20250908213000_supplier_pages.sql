-- Páginas de fornecedores
create table if not exists public.supplier_pages (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  slug text not null unique,
  title text not null,
  content text,
  status content_status default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (supplier_id)
);

alter table public.supplier_pages enable row level security;

create or replace function public.update_supplier_pages_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_supplier_pages_updated_at on public.supplier_pages;
create trigger trg_supplier_pages_updated_at
before update on public.supplier_pages
for each row execute function public.update_supplier_pages_updated_at();

-- Policies
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='supplier_pages' and policyname='Public can view supplier pages'
  ) then
    create policy "Public can view supplier pages"
      on public.supplier_pages for select using (status = 'published');
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='supplier_pages' and policyname='Admins manage supplier pages'
  ) then
    create policy "Admins manage supplier pages"
      on public.supplier_pages for all using (is_admin()) with check (is_admin());
  end if;
end $$;

create index if not exists idx_supplier_pages_slug on public.supplier_pages(slug);

