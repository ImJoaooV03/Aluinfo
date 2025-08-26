-- CORREÇÃO CRÍTICA DE SEGURANÇA: Proteger informações de contato de fornecedores e fundições

-- Função para mascarar email (mostra apenas primeiro caractere e domínio)
CREATE OR REPLACE FUNCTION public.mask_email(email_address TEXT)
RETURNS TEXT AS $$
BEGIN
  IF email_address IS NULL OR email_address = '' THEN
    RETURN NULL;
  END IF;
  
  -- Extrair partes do email
  DECLARE
    username TEXT;
    domain TEXT;
    at_position INT;
  BEGIN
    at_position := POSITION('@' IN email_address);
    IF at_position = 0 THEN
      RETURN '***'; -- Email inválido
    END IF;
    
    username := SUBSTRING(email_address FROM 1 FOR at_position - 1);
    domain := SUBSTRING(email_address FROM at_position);
    
    -- Mostrar apenas primeiro caractere do username
    RETURN SUBSTRING(username FROM 1 FOR 1) || '***' || domain;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Função para mascarar telefone (mostra apenas os últimos 4 dígitos)
CREATE OR REPLACE FUNCTION public.mask_phone(phone_number TEXT)
RETURNS TEXT AS $$
BEGIN
  IF phone_number IS NULL OR phone_number = '' THEN
    RETURN NULL;
  END IF;
  
  -- Remover caracteres não numéricos para contar dígitos
  DECLARE
    clean_phone TEXT;
    phone_length INT;
  BEGIN
    clean_phone := REGEXP_REPLACE(phone_number, '[^0-9]', '', 'g');
    phone_length := LENGTH(clean_phone);
    
    IF phone_length < 4 THEN
      RETURN '***';
    END IF;
    
    -- Mostrar apenas os últimos 4 dígitos
    RETURN REPEAT('*', phone_length - 4) || SUBSTRING(clean_phone FROM phone_length - 3);
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Criar view segura para fornecedores (com mascaramento para usuários não autenticados)
CREATE OR REPLACE VIEW public.suppliers_public AS
SELECT 
  id,
  name,
  slug,
  description,
  specialty,
  -- Mascarar email e telefone para usuários não autenticados
  CASE 
    WHEN auth.uid() IS NOT NULL OR public.is_admin() THEN email
    ELSE public.mask_email(email)
  END AS email,
  CASE 
    WHEN auth.uid() IS NOT NULL OR public.is_admin() THEN phone
    ELSE public.mask_phone(phone)
  END AS phone,
  website,
  address,
  city,
  state,
  country,
  logo_url,
  rating,
  employees_count,
  category_id,
  status,
  created_at,
  updated_at
FROM public.suppliers
WHERE status = 'published';

-- Criar view segura para fundições (com mascaramento para usuários não autenticados)
CREATE OR REPLACE VIEW public.foundries_public AS
SELECT 
  id,
  name,
  slug,
  description,
  specialty,
  -- Mascarar email e telefone para usuários não autenticados
  CASE 
    WHEN auth.uid() IS NOT NULL OR public.is_admin() THEN email
    ELSE public.mask_email(email)
  END AS email,
  CASE 
    WHEN auth.uid() IS NOT NULL OR public.is_admin() THEN phone
    ELSE public.mask_phone(phone)
  END AS phone,
  website,
  address,
  city,
  state,
  country,
  logo_url,
  rating,
  employees_count,
  category_id,
  status,
  created_at,
  updated_at
FROM public.foundries
WHERE status = 'published';

-- Remover políticas públicas atuais (vulneráveis)
DROP POLICY IF EXISTS "Qualquer um pode ver fornecedores publicados" ON public.suppliers;
DROP POLICY IF EXISTS "Qualquer um pode ver fundições publicadas" ON public.foundries;

-- Criar novas políticas restritivas para as tabelas originais
-- Apenas usuários autenticados e admins podem ver dados completos
CREATE POLICY "Usuários autenticados podem ver fornecedores completos" 
ON public.suppliers 
FOR SELECT 
USING (
  (status = 'published' AND auth.uid() IS NOT NULL) 
  OR public.is_admin()
);

CREATE POLICY "Usuários autenticados podem ver fundições completas" 
ON public.foundries 
FOR SELECT 
USING (
  (status = 'published' AND auth.uid() IS NOT NULL) 
  OR public.is_admin()
);

-- Políticas para as views públicas (dados mascarados)
-- Permitir acesso público às views mascaradas
GRANT SELECT ON public.suppliers_public TO PUBLIC;
GRANT SELECT ON public.foundries_public TO PUBLIC;

-- Habilitar RLS nas views (mesmo sendo views, por segurança)
ALTER VIEW public.suppliers_public SET (security_barrier = true);
ALTER VIEW public.foundries_public SET (security_barrier = true);