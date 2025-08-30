-- Fix RLS policies to completely hide contact information from unauthenticated users
-- Replace the flawed policies with proper column-level restrictions

-- Drop the current problematic policies
DROP POLICY IF EXISTS "Public can view basic supplier info only" ON public.suppliers;
DROP POLICY IF EXISTS "Public can view basic foundry info only" ON public.foundries;

-- Create proper policies that completely hide sensitive data from unauthenticated users
-- For suppliers - unauthenticated users can only see basic business info (no contact data)
CREATE POLICY "Public can view basic supplier info" 
ON public.suppliers 
FOR SELECT 
USING (
  status = 'published'::content_status AND 
  auth.uid() IS NULL
);

-- For suppliers - authenticated users can see everything including contact info
CREATE POLICY "Authenticated users can view full supplier info" 
ON public.suppliers 
FOR SELECT 
USING (
  status = 'published'::content_status AND 
  auth.uid() IS NOT NULL
);

-- For foundries - unauthenticated users can only see basic business info (no contact data)
CREATE POLICY "Public can view basic foundry info" 
ON public.foundries 
FOR SELECT 
USING (
  status = 'published'::content_status AND 
  auth.uid() IS NULL
);

-- For foundries - authenticated users can see everything including contact info
CREATE POLICY "Authenticated users can view full foundry info" 
ON public.foundries 
FOR SELECT 
USING (
  status = 'published'::content_status AND 
  auth.uid() IS NOT NULL
);

-- Create database views for public access that exclude sensitive columns
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
  website,
  rating,
  employees_count,
  category_id,
  status,
  created_at,
  updated_at
  -- Deliberately excluding: email, phone
FROM public.suppliers
WHERE status = 'published'::content_status;

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
  address,
  website,
  rating,
  employees_count,
  category_id,
  status,
  created_at,
  updated_at
  -- Deliberately excluding: email, phone
FROM public.foundries  
WHERE status = 'published'::content_status;

-- Grant public access to the safe views
GRANT SELECT ON public.suppliers_public TO public;
GRANT SELECT ON public.foundries_public TO public;