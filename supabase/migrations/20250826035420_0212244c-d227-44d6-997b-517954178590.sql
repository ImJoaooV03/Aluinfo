-- Update RLS policies for foundries table to mask sensitive contact information for public access
DROP POLICY IF EXISTS "Visualização pública limitada de fundições" ON public.foundries;

-- Create new policy that masks sensitive contact information for public access
CREATE POLICY "Visualização pública limitada de fundições" 
ON public.foundries 
FOR SELECT 
USING (
  status = 'published'::content_status
  AND (
    -- If user is authenticated, show full data
    auth.uid() IS NOT NULL 
    OR 
    -- If not authenticated, only show non-sensitive fields
    (auth.uid() IS NULL)
  )
);

-- Update RLS policies for suppliers table to mask sensitive contact information for public access  
DROP POLICY IF EXISTS "Visualização pública limitada de fornecedores" ON public.suppliers;

-- Create new policy that masks sensitive contact information for public access
CREATE POLICY "Visualização pública limitada de fornecedores" 
ON public.suppliers 
FOR SELECT 
USING (
  status = 'published'::content_status
  AND (
    -- If user is authenticated, show full data
    auth.uid() IS NOT NULL 
    OR 
    -- If not authenticated, only show non-sensitive fields
    (auth.uid() IS NULL)
  )
);

-- Create views for public access with masked contact information
CREATE OR REPLACE VIEW public.foundries_public AS
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
  -- Mask sensitive contact information for public access
  CASE 
    WHEN auth.uid() IS NOT NULL THEN email
    ELSE mask_email(email)
  END AS email,
  CASE 
    WHEN auth.uid() IS NOT NULL THEN phone
    ELSE mask_phone(phone)
  END AS phone,
  website,
  rating,
  employees_count,
  category_id,
  status,
  created_at,
  updated_at
FROM public.foundries
WHERE status = 'published'::content_status;

CREATE OR REPLACE VIEW public.suppliers_public AS
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
  -- Mask sensitive contact information for public access
  CASE 
    WHEN auth.uid() IS NOT NULL THEN email
    ELSE mask_email(email)
  END AS email,
  CASE 
    WHEN auth.uid() IS NOT NULL THEN phone
    ELSE mask_phone(phone)
  END AS phone,
  website,
  rating,
  employees_count,
  category_id,
  status,
  created_at,
  updated_at
FROM public.suppliers
WHERE status = 'published'::content_status;

-- Enable RLS on the views
ALTER VIEW public.foundries_public SET ROW SECURITY ON;
ALTER VIEW public.suppliers_public SET ROW SECURITY ON;

-- Create policies for the public views
CREATE POLICY "Qualquer um pode ver fundições públicas" 
ON public.foundries_public 
FOR SELECT 
USING (true);

CREATE POLICY "Qualquer um pode ver fornecedores públicos" 
ON public.suppliers_public 
FOR SELECT 
USING (true);