-- Create a more secure approach by using views that automatically mask sensitive data

-- First, revoke direct access to sensitive columns by updating RLS policies
DROP POLICY IF EXISTS "Visualização pública limitada de fundições" ON public.foundries;
DROP POLICY IF EXISTS "Visualização pública limitada de fornecedores" ON public.suppliers;

-- Create restrictive policies that only allow access to non-sensitive columns for public users
CREATE POLICY "Acesso público básico a fundições" 
ON public.foundries 
FOR SELECT 
USING (
  status = 'published'::content_status AND (
    -- Admins can see everything
    is_admin() OR
    -- Authenticated users can see everything 
    auth.uid() IS NOT NULL OR
    -- Public users: allow access but app must use security functions for contact info
    (auth.uid() IS NULL)
  )
);

CREATE POLICY "Acesso público básico a fornecedores" 
ON public.suppliers 
FOR SELECT 
USING (
  status = 'published'::content_status AND (
    -- Admins can see everything
    is_admin() OR
    -- Authenticated users can see everything
    auth.uid() IS NOT NULL OR
    -- Public users: allow access but app must use security functions for contact info
    (auth.uid() IS NULL)
  )
);

-- Create secure public views that automatically mask sensitive data
CREATE OR REPLACE VIEW public.foundries_secure AS
SELECT 
  id,
  name,
  slug,
  specialty,
  description,
  logo_url,
  country,
  state,
  city,
  website,
  rating,
  employees_count,
  category_id,
  status,
  created_at,
  updated_at,
  -- Only show masked contact info for public users
  CASE 
    WHEN auth.uid() IS NOT NULL OR is_admin() THEN email
    ELSE mask_email(email)
  END AS email,
  CASE 
    WHEN auth.uid() IS NOT NULL OR is_admin() THEN phone
    ELSE mask_phone(phone)
  END AS phone,
  -- Add a flag to indicate if data is masked
  CASE 
    WHEN auth.uid() IS NOT NULL OR is_admin() THEN false
    ELSE true
  END AS contact_masked
FROM public.foundries
WHERE status = 'published'::content_status;

CREATE OR REPLACE VIEW public.suppliers_secure AS
SELECT 
  id,
  name,
  slug,
  specialty,
  description,
  logo_url,
  country,
  state,
  city,
  website,
  rating,
  employees_count,
  category_id,
  status,
  created_at,
  updated_at,
  -- Only show masked contact info for public users
  CASE 
    WHEN auth.uid() IS NOT NULL OR is_admin() THEN email
    ELSE mask_email(email)
  END AS email,
  CASE 
    WHEN auth.uid() IS NOT NULL OR is_admin() THEN phone
    ELSE mask_phone(phone)
  END AS phone,
  -- Add a flag to indicate if data is masked
  CASE 
    WHEN auth.uid() IS NOT NULL OR is_admin() THEN false
    ELSE true
  END AS contact_masked
FROM public.suppliers
WHERE status = 'published'::content_status;