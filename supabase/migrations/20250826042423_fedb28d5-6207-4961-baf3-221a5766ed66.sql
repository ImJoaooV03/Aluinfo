
-- 1) Buckets públicos (leitura) e com escrita restrita a admin
insert into storage.buckets (id, name, public) values ('banners', 'banners', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values ('materials', 'materials', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values ('events', 'events', true)
on conflict (id) do nothing;

-- 2) Políticas de leitura pública por bucket
create policy "Public read banners"
  on storage.objects for select
  using (bucket_id = 'banners');

create policy "Public read materials"
  on storage.objects for select
  using (bucket_id = 'materials');

create policy "Public read events"
  on storage.objects for select
  using (bucket_id = 'events');

-- 3) Políticas de gestão total (insert/update/delete) apenas para admins autenticados
-- BANNERS
create policy "Admin full access banners"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'banners' and public.is_admin())
  with check (bucket_id = 'banners' and public.is_admin());

-- MATERIALS
create policy "Admin full access materials"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'materials' and public.is_admin())
  with check (bucket_id = 'materials' and public.is_admin());

-- EVENTS
create policy "Admin full access events"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'events' and public.is_admin())
  with check (bucket_id = 'events' and public.is_admin());
