
-- Tornar públicos os buckets materials e ebooks
update storage.buckets
set public = true
where id in ('materials', 'ebooks');

-- Políticas para o bucket 'materials'
-- Leitura pública
create policy "Public read for materials"
on storage.objects
for select
using (bucket_id = 'materials');

-- Inserção apenas por admin
create policy "Admins can insert materials"
on storage.objects
for insert
with check (bucket_id = 'materials' and public.is_admin());

-- Atualização apenas por admin
create policy "Admins can update materials"
on storage.objects
for update
using (bucket_id = 'materials' and public.is_admin())
with check (bucket_id = 'materials' and public.is_admin());

-- Exclusão apenas por admin
create policy "Admins can delete materials"
on storage.objects
for delete
using (bucket_id = 'materials' and public.is_admin());

-- Políticas para o bucket 'ebooks'
-- Leitura pública
create policy "Public read for ebooks"
on storage.objects
for select
using (bucket_id = 'ebooks');

-- Inserção apenas por admin
create policy "Admins can insert ebooks"
on storage.objects
for insert
with check (bucket_id = 'ebooks' and public.is_admin());

-- Atualização apenas por admin
create policy "Admins can update ebooks"
on storage.objects
for update
using (bucket_id = 'ebooks' and public.is_admin())
with check (bucket_id = 'ebooks' and public.is_admin());

-- Exclusão apenas por admin
create policy "Admins can delete ebooks"
on storage.objects
for delete
using (bucket_id = 'ebooks' and public.is_admin());
