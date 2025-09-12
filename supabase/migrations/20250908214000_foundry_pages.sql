-- Páginas de fundições
create table if not exists public.foundry_pages (
  id uuid primary key default gen_random_uuid(),
  foundry_id uuid not null references public.foundries(id) on delete cascade,
  slug text not null unique,
  title text not null,
  content text,
  status content_status default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (foundry_id)
);

alter table public.foundry_pages enable row level security;

create or replace function public.update_foundry_pages_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_foundry_pages_updated_at on public.foundry_pages;
create trigger trg_foundry_pages_updated_at
before update on public.foundry_pages
for each row execute function public.update_foundry_pages_updated_at();

-- Policies
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='foundry_pages' and policyname='Public can view foundry pages'
  ) then
    create policy "Public can view foundry pages"
      on public.foundry_pages for select using (status = 'published');
  end if;

  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='foundry_pages' and policyname='Admins manage foundry pages'
  ) then
    create policy "Admins manage foundry pages"
      on public.foundry_pages for all using (is_admin()) with check (is_admin());
  end if;
end $$;

create index if not exists idx_foundry_pages_slug on public.foundry_pages(slug);

