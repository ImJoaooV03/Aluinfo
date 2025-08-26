
-- Garante que exista um perfil para o email indicado, criando se necessário, já como admin
insert into public.profiles (user_id, email, full_name, role)
select u.id,
       u.email,
       coalesce(u.raw_user_meta_data->>'full_name', u.email),
       'admin'::user_role
from auth.users u
left join public.profiles p on p.user_id = u.id
where u.email = 'joaovicrengel@gmail.com'
  and p.user_id is null;

-- Força a atualização do papel para admin (idempotente)
update public.profiles
   set role = 'admin'::user_role
 where email = 'joaovicrengel@gmail.com';
