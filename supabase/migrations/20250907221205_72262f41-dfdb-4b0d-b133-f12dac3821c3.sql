
-- 1) Tabela para Mídia Kit
create table if not exists public.media_kits (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  status content_status default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger de updated_at
drop trigger if exists trg_media_kits_updated_at on public.media_kits;
create trigger trg_media_kits_updated_at
before update on public.media_kits
for each row
execute function public.update_updated_at_column();

-- RLS e Políticas
alter table public.media_kits enable row level security;

-- Admins podem gerenciar tudo
drop policy if exists "Admins podem gerenciar mídia kits" on public.media_kits;
create policy "Admins podem gerenciar mídia kits"
  on public.media_kits
  for all
  using (is_admin())
  with check (is_admin());

-- Público pode ver mídia kits publicados
drop policy if exists "Qualquer um pode ver mídia kits publicados" on public.media_kits;
create policy "Qualquer um pode ver mídia kits publicados"
  on public.media_kits
  for select
  using ((status = 'published'::content_status) or is_admin());

-- 2) Storage bucket para Mídia Kit (público)
insert into storage.buckets (id, name, public)
values ('media_kits', 'media_kits', true)
on conflict (id) do nothing;

-- Políticas do storage para o bucket 'media_kits'
-- Leitura pública de objetos do bucket media_kits
drop policy if exists "Public read access to media_kits" on storage.objects;
create policy "Public read access to media_kits"
  on storage.objects
  for select
  using (bucket_id = 'media_kits');

-- Admins podem inserir no bucket media_kits
drop policy if exists "Admins can insert media_kits" on storage.objects;
create policy "Admins can insert media_kits"
  on storage.objects
  for insert
  with check (bucket_id = 'media_kits' and is_admin());

-- Admins podem atualizar objetos no bucket media_kits
drop policy if exists "Admins can update media_kits" on storage.objects;
create policy "Admins can update media_kits"
  on storage.objects
  for update
  using (bucket_id = 'media_kits' and is_admin())
  with check (bucket_id = 'media_kits' and is_admin());

-- Admins podem deletar objetos no bucket media_kits
drop policy if exists "Admins can delete media_kits" on storage.objects;
create policy "Admins can delete media_kits"
  on storage.objects
  for delete
  using (bucket_id = 'media_kits' and is_admin());
