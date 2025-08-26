-- Corrigir problemas de segurança das views
-- Remover security_barrier das views para evitar problemas de segurança

-- Recriar as views sem security_barrier
DROP VIEW IF EXISTS public.suppliers_public;
DROP VIEW IF EXISTS public.foundries_public;

-- Recriar view segura para fornecedores (sem security_barrier)
CREATE VIEW public.suppliers_public AS
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

-- Recriar view segura para fundições (sem security_barrier)
CREATE VIEW public.foundries_public AS
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

-- Garantir permissões públicas nas views
GRANT SELECT ON public.suppliers_public TO PUBLIC;
GRANT SELECT ON public.foundries_public TO PUBLIC;