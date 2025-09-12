-- Seed admin user (idempotente) para ambiente local/CLI
-- ATENÇÃO: Para produção/instância remota, use o dashboard do Supabase (Auth > Add user)
-- e depois promova o perfil para 'admin' com segurança usando função/consulta protegida.

do $$
declare
  v_user_id uuid;
begin
  -- 1) Certifique-se de que a extensão pgcrypto existe para crypt/gen_salt
  -- Em alguns ambientes locais do supabase/init já vem habilitado. Ignorar erro se já existir.
  begin
    perform 1 from pg_extension where extname = 'pgcrypto';
    if not found then
      create extension if not exists pgcrypto;
    end if;
  exception when others then
    -- continuar mesmo se não for possível criar (ex.: ambiente gerenciado)
    null;
  end;

  -- 2) Tentar obter usuário existente por email
  select id into v_user_id from auth.users where email = 'admin@aluinfo.com' limit 1;

  -- 3) Se não existir, criar usuário diretamente em auth.users (uso local)
  if v_user_id is null then
    insert into auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      aud,
      role,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmation_token,
      email_change_token,
      phone_change_token,
      recovery_token
    ) values (
      gen_random_uuid(),
      '00000000-0000-0000-0000-000000000000',
      'admin@aluinfo.com',
      crypt('admin@aluinfo.com', gen_salt('bf')),
      now(),
      now(),
      now(),
      'authenticated',
      'authenticated',
      '{"provider":"email","providers":["email"]}',
      '{}',
      false,
      '',
      '',
      '',
      ''
    ) returning id into v_user_id;
  else
    -- Se já existe, garantir a senha definida (uso local). Em produção, altere via painel.
    update auth.users
       set encrypted_password = crypt('admin@aluinfo.com', gen_salt('bf')),
           updated_at = now()
     where id = v_user_id;
  end if;

  -- 4) Garantir perfil na tabela public.profiles (evitar UPDATE para não acionar trigger de validação)
  -- 4a) Primeiro tentar inserir caso não exista
  insert into public.profiles (user_id, email, full_name, role)
  values (
    v_user_id,
    'admin@aluinfo.com',
    'Administrador',
    'admin'
  )
  on conflict (user_id) do nothing;

  -- 4b) Se já existir e não for admin, recriar o perfil com role admin
  if exists (select 1 from public.profiles where user_id = v_user_id and role != 'admin') then
    delete from public.profiles where user_id = v_user_id;
    insert into public.profiles (user_id, email, full_name, role)
    values (
      v_user_id,
      'admin@aluinfo.com',
      'Administrador',
      'admin'
    );
  end if;
end $$;


