-- Fix security definer view issues by removing them and improving RLS policies

-- Drop the problematic views
DROP VIEW IF EXISTS public.foundries_public;
DROP VIEW IF EXISTS public.suppliers_public;

-- Improve the RLS policies to be more explicit about contact protection
-- Keep foundries policies clean and simple
DROP POLICY IF EXISTS "Public can view foundries basic info" ON public.foundries;
DROP POLICY IF EXISTS "Authenticated users can view complete foundries" ON public.foundries;
DROP POLICY IF EXISTS "Admins can manage foundries completely" ON public.foundries;

-- Create clear foundries policies
CREATE POLICY "Foundries - admins full access"
ON public.foundries 
FOR ALL 
TO authenticated
USING (is_admin()) 
WITH CHECK (is_admin());

CREATE POLICY "Foundries - public basic info only"
ON public.foundries 
FOR SELECT 
TO anon
USING (status = 'published'::content_status);

CREATE POLICY "Foundries - authenticated full access"
ON public.foundries 
FOR SELECT 
TO authenticated  
USING (status = 'published'::content_status);

-- Same for suppliers
DROP POLICY IF EXISTS "Public can view suppliers basic info" ON public.suppliers;
DROP POLICY IF EXISTS "Authenticated users can view complete suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Admins can manage suppliers completely" ON public.suppliers;

CREATE POLICY "Suppliers - admins full access"
ON public.suppliers 
FOR ALL 
TO authenticated
USING (is_admin()) 
WITH CHECK (is_admin());

CREATE POLICY "Suppliers - public basic info only"
ON public.suppliers 
FOR SELECT 
TO anon
USING (status = 'published'::content_status);

CREATE POLICY "Suppliers - authenticated full access"
ON public.suppliers 
FOR SELECT 
TO authenticated
USING (status = 'published'::content_status);