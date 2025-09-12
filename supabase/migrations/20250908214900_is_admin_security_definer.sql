-- Definição segura de is_admin() para evitar loops de RLS
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  claims jsonb := '{}'::jsonb;
begin
  begin
    claims := nullif(current_setting('request.jwt.claims', true), '')::jsonb;
  exception when others then
    claims := '{}'::jsonb;
  end;

  if coalesce((claims ->> 'role') = 'admin', false) then
    return true;
  end if;

  return exists (
    select 1 from public.profiles p
    where p.user_id = auth.uid() and p.role = 'admin'
  );
end;
$$;

grant execute on function public.is_admin() to anon, authenticated;

