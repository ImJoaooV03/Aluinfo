
-- 1) Bucket de Storage para e-books (público para permitir download)
insert into storage.buckets (id, name, public)
values ('ebooks', 'ebooks', true)
on conflict (id) do update set public = true;

-- 2) Políticas de acesso no Storage para o bucket 'ebooks'
-- Leitura pública (download de arquivos)
create policy "Public pode ler arquivos de e-books"
on storage.objects
for select
using (bucket_id = 'ebooks');

-- Apenas administradores podem ENVIAR (inserir) arquivos
create policy "Admins podem enviar arquivos de e-books"
on storage.objects
for insert
with check (
  bucket_id = 'ebooks'
  and exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

-- Apenas administradores podem ATUALIZAR arquivos
create policy "Admins podem atualizar arquivos de e-books"
on storage.objects
for update
using (
  bucket_id = 'ebooks'
  and exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
)
with check (
  bucket_id = 'ebooks'
  and exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

-- Apenas administradores podem DELETAR arquivos
create policy "Admins podem deletar arquivos de e-books"
on storage.objects
for delete
using (
  bucket_id = 'ebooks'
  and exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  )
);

-- 3) (Opcional, recomendado) Habilitar Realtime completo na tabela ebooks
do $$
begin
  -- Garante envio de dados completos nas mudanças (útil para realtime de updates)
  begin
    execute 'alter table public.ebooks replica identity full';
  exception when others then
    -- ignora se já estiver configurado
    null;
  end;

  -- Adiciona a tabela à publicação supabase_realtime se ainda não estiver
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'ebooks'
  ) then
    execute 'alter publication supabase_realtime add table public.ebooks';
  end if;
end $$;
