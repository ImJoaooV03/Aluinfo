-- Permitir que usuários autenticados cadastrem/atualizem fundições (com checagem mínima)
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='public' and tablename='foundries' and policyname='Authenticated can insert/update foundries'
  ) then
    create policy "Authenticated can insert/update foundries"
      on public.foundries
      for insert to authenticated with check (true);
    create policy "Authenticated can update foundries"
      on public.foundries
      for update to authenticated using (true) with check (true);
  end if;
end $$;

