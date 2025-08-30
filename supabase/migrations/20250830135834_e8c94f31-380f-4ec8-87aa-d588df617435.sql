-- Fix security definer view issues and implement proper RLS-based access control

-- Drop the problematic views
DROP VIEW IF EXISTS public.suppliers_public;
DROP VIEW IF EXISTS public.foundries_public;

-- Remove the split policies and create single comprehensive policies
DROP POLICY IF EXISTS "Public can view basic supplier info" ON public.suppliers;
DROP POLICY IF EXISTS "Authenticated users can view full supplier info" ON public.suppliers;
DROP POLICY IF EXISTS "Public can view basic foundry info" ON public.foundries;
DROP POLICY IF EXISTS "Authenticated users can view full foundry info" ON public.foundries;

-- Create single comprehensive policies that handle both cases
-- Suppliers policy: authenticated users see all data, unauthenticated see limited data
CREATE POLICY "Suppliers visibility policy" 
ON public.suppliers 
FOR SELECT 
USING (
  status = 'published'::content_status AND
  CASE 
    WHEN auth.uid() IS NOT NULL THEN true  -- Authenticated: full access
    ELSE email IS NULL AND phone IS NULL   -- Unauthenticated: only if contact info is null
  END
);

-- Foundries policy: authenticated users see all data, unauthenticated see limited data  
CREATE POLICY "Foundries visibility policy" 
ON public.foundries 
FOR SELECT 
USING (
  status = 'published'::content_status AND
  CASE 
    WHEN auth.uid() IS NOT NULL THEN true  -- Authenticated: full access
    ELSE email IS NULL AND phone IS NULL   -- Unauthenticated: only if contact info is null
  END
);

-- Add function to get suppliers without contact info for public access
CREATE OR REPLACE FUNCTION public.get_public_suppliers(category_filter uuid DEFAULT NULL)
RETURNS TABLE(
  id uuid,
  name text,
  slug text,
  specialty text,
  description text,
  logo_url text,
  country text,
  state text,
  city text,
  website text,
  rating numeric,
  employees_count integer,
  category_id uuid,
  status content_status,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  SELECT 
    s.id,
    s.name,
    s.slug,
    s.specialty,
    s.description,
    s.logo_url,
    s.country,
    s.state,
    s.city,
    s.website,
    s.rating,
    s.employees_count,
    s.category_id,
    s.status,
    s.created_at,
    s.updated_at
  FROM public.suppliers s
  WHERE s.status = 'published'::content_status
    AND (category_filter IS NULL OR s.category_id = category_filter)
  ORDER BY s.name;
$$;

-- Add function to get foundries without contact info for public access
CREATE OR REPLACE FUNCTION public.get_public_foundries(category_filter uuid DEFAULT NULL)
RETURNS TABLE(
  id uuid,
  name text,
  slug text,
  specialty text,
  description text,
  logo_url text,
  country text,
  state text,
  city text,
  address text,
  website text,
  rating numeric,
  employees_count integer,
  category_id uuid,
  status content_status,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY INVOKER
AS $$
  SELECT 
    f.id,
    f.name,
    f.slug,
    f.specialty,
    f.description,
    f.logo_url,
    f.country,
    f.state,
    f.city,
    f.address,
    f.website,
    f.rating,
    f.employees_count,
    f.category_id,
    f.status,
    f.created_at,
    f.updated_at
  FROM public.foundries f
  WHERE f.status = 'published'::content_status
    AND (category_filter IS NULL OR f.category_id = category_filter)
  ORDER BY f.name;
$$;