
-- 1) Tabela de whitelist de administradores por email
create table if not exists public.admin_whitelist (
  email text primary key,
  created_at timestamptz default now()
);

alter table public.admin_whitelist enable row level security;

-- Política: apenas admins podem gerenciar/visualizar a whitelist
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname='public' and tablename='admin_whitelist' and policyname='Admins podem gerenciar lista de admins'
  ) then
    create policy "Admins podem gerenciar lista de admins"
      on public.admin_whitelist
      for all
      using (is_admin())
      with check (is_admin());
  end if;
end
$$;

-- Inserir o email solicitado na whitelist (idempotente)
insert into public.admin_whitelist (email)
values ('joaovicrengel@gmail.com')
on conflict (email) do nothing;

-- 2) Trigger para criar perfil automaticamente ao criar usuário (se ainda não existir)
do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'on_auth_user_created'
  ) then
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  end if;
end
$$;

-- 3) Função/trigger para promover automaticamente a admin se o email estiver na whitelist
create or replace function public.promote_admin_from_whitelist()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.admin_whitelist w where w.email = new.email) then
    update public.profiles
       set role = 'admin'
     where id = new.id;
  end if;
  return new;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'on_profile_created_promote_admin'
  ) then
    create trigger on_profile_created_promote_admin
      after insert on public.profiles
      for each row execute procedure public.promote_admin_from_whitelist();
  end if;
end
$$;

-- 4) Caso o usuário já exista, garantir perfil e promovê-lo agora
-- Criar perfil se não existir (com role admin)
insert into public.profiles (user_id, email, full_name, role)
select u.id,
       u.email,
       coalesce(u.raw_user_meta_data->>'full_name', u.email),
       'admin'
  from auth.users u
  left join public.profiles p on p.user_id = u.id
 where u.email = 'joaovicrengel@gmail.com'
   and p.user_id is null;

-- Promover perfil existente para admin (idempotente)
update public.profiles
   set role = 'admin'
 where email = 'joaovicrengel@gmail.com';
