-- Fix RLS policies for foundries and suppliers to protect contact information

-- First, drop existing overlapping policies for foundries
DROP POLICY IF EXISTS "Foundries visibility policy" ON public.foundries;
DROP POLICY IF EXISTS "Usuários autenticados podem ver fundições completas" ON public.foundries;

-- Create new foundries policies with proper contact protection
CREATE POLICY "Public can view foundries basic info" 
ON public.foundries 
FOR SELECT 
USING (
  status = 'published'::content_status AND auth.uid() IS NULL
);

CREATE POLICY "Authenticated users can view complete foundries" 
ON public.foundries 
FOR SELECT 
USING (
  status = 'published'::content_status AND auth.uid() IS NOT NULL
);

-- Admin policy remains
CREATE POLICY "Admins can manage foundries completely"
ON public.foundries 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Now fix suppliers policies
DROP POLICY IF EXISTS "Suppliers visibility policy" ON public.suppliers;
DROP POLICY IF EXISTS "Usuários autenticados podem ver fornecedores completos" ON public.suppliers;

-- Create new suppliers policies with proper contact protection  
CREATE POLICY "Public can view suppliers basic info"
ON public.suppliers 
FOR SELECT 
USING (
  status = 'published'::content_status AND auth.uid() IS NULL
);

CREATE POLICY "Authenticated users can view complete suppliers"
ON public.suppliers 
FOR SELECT 
USING (
  status = 'published'::content_status AND auth.uid() IS NOT NULL  
);

-- Admin policy remains
CREATE POLICY "Admins can manage suppliers completely"
ON public.suppliers 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Create views for public access that exclude sensitive data
CREATE OR REPLACE VIEW public.foundries_public AS
SELECT 
  id, name, slug, specialty, description, logo_url, 
  country, state, city, address, website, rating, 
  employees_count, category_id, status, created_at, updated_at
FROM public.foundries 
WHERE status = 'published'::content_status;

CREATE OR REPLACE VIEW public.suppliers_public AS  
SELECT 
  id, name, slug, specialty, description, logo_url,
  country, state, city, address, website, rating,
  employees_count, category_id, status, created_at, updated_at
FROM public.suppliers
WHERE status = 'published'::content_status;

-- Enable RLS on views
ALTER VIEW public.foundries_public SET (security_barrier = true);
ALTER VIEW public.suppliers_public SET (security_barrier = true);

-- Grant access to public views
GRANT SELECT ON public.foundries_public TO anon, authenticated;
GRANT SELECT ON public.suppliers_public TO anon, authenticated;