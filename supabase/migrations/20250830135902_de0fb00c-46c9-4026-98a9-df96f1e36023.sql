-- Fix function search path security issue

-- Drop and recreate functions with proper search_path setting
DROP FUNCTION IF EXISTS public.get_public_suppliers(uuid);
DROP FUNCTION IF EXISTS public.get_public_foundries(uuid);

-- Create secure functions with fixed search_path
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
SET search_path TO 'public'
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
SET search_path TO 'public'
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