-- Permitir que usuários autenticados gerenciem os vínculos N:N de fundições
do $$ begin
  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='foundry_category_links' and policyname='Authenticated can manage foundry-category links'
  ) then
    create policy "Authenticated can manage foundry-category links"
      on public.foundry_category_links
      for all to authenticated using (true) with check (true);
  end if;
end $$;

