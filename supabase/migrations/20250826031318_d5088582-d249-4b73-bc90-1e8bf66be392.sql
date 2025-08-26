-- Criar o primeiro usuário admin para testes
-- IMPORTANTE: Trocar senha em produção
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'admin@aluinfo.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Administrador Aluinfo"}',
  false,
  'authenticated'
) ON CONFLICT (email) DO NOTHING;

-- Garantir que o perfil admin seja criado
INSERT INTO public.profiles (
  user_id,
  email,
  full_name,
  role
) 
SELECT 
  id,
  email,
  'Administrador Aluinfo',
  'admin'::user_role
FROM auth.users 
WHERE email = 'admin@aluinfo.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin'::user_role;