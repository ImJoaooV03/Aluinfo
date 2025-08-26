-- Criar usuário admin para o sistema
-- Nota: Em um ambiente real, use senhas mais seguras

DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Inserir usuário na tabela auth.users (simulando registro)
    -- Em produção, isso seria feito através do registro normal do Supabase
    INSERT INTO auth.users (
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
    ) VALUES (
        gen_random_uuid(),
        '00000000-0000-0000-0000-000000000000',
        'admin@aluinfo.com',
        crypt('admin123', gen_salt('bf')),
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
    ) RETURNING id INTO admin_user_id;

    -- Inserir perfil do admin
    INSERT INTO public.profiles (
        user_id,
        email,
        full_name,
        role
    ) VALUES (
        admin_user_id,
        'admin@aluinfo.com',
        'Administrador do Sistema',
        'admin'
    );

END $$;