-- Reforça is_admin() para aceitar claim JWT OU perfil em public.profiles
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select
    coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role' = 'admin', false)
    or exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.role = 'admin'
    );
$$;

