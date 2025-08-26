
-- 1) Função segura para garantir papel admin ao próprio usuário autenticado
-- - Lê o email do JWT
-- - Se for o email do admin, faz UPSERT no perfil com role = 'admin'
create or replace function public.ensure_admin_self()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  jwt jsonb;
  jwt_email text;
  uid uuid;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  -- Tenta ler o email do JWT
  begin
    jwt := current_setting('request.jwt.claims', true)::jsonb;
    jwt_email := coalesce(jwt->>'email', '');
  exception when others then
    jwt_email := '';
  end;

  -- Se não for o email do admin, não faz nada
  if jwt_email <> 'joaovicrengel@gmail.com' then
    return;
  end if;

  -- UPSERT do perfil com role = 'admin'
  insert into public.profiles (user_id, email, full_name, role)
  values (
    uid,
    jwt_email,
    coalesce(jwt->>'name', 'Administrador do Sistema'),
    'admin'::user_role
  )
  on conflict (user_id)
  do update set
    email = excluded.email,
    role = 'admin'::user_role,
    updated_at = now();
end;
$$;

-- Opcional: garantir permissão de execução (normalmente já é pública)
-- grant execute on function public.ensure_admin_self() to authenticated;

-- 2) Se já existir um perfil com esse email, torna admin imediatamente
update public.profiles
set role = 'admin'::user_role, full_name = coalesce(full_name, 'Administrador do Sistema'), updated_at = now()
where email = 'joaovicrengel@gmail.com';
