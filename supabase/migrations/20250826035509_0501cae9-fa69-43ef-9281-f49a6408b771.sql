-- Remove the views that have security definer issues
DROP VIEW IF EXISTS public.foundries_public;
DROP VIEW IF EXISTS public.suppliers_public;

-- Update the RLS policies to directly mask sensitive data in the main tables
DROP POLICY IF EXISTS "Visualização pública limitada de fundições" ON public.foundries;
DROP POLICY IF EXISTS "Visualização pública limitada de fornecedores" ON public.suppliers;

-- Create new RLS policies that restrict public access to sensitive fields through application logic
CREATE POLICY "Visualização pública limitada de fundições" 
ON public.foundries 
FOR SELECT 
USING (status = 'published'::content_status);

CREATE POLICY "Visualização pública limitada de fornecedores" 
ON public.suppliers 
FOR SELECT 
USING (status = 'published'::content_status);

-- Create secure functions to get masked contact info
CREATE OR REPLACE FUNCTION public.get_foundry_contact_info(foundry_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  contact_info jsonb;
BEGIN
  -- If user is authenticated, return full contact info
  IF auth.uid() IS NOT NULL THEN
    SELECT jsonb_build_object(
      'email', email,
      'phone', phone,
      'masked', false
    )
    INTO contact_info
    FROM foundries
    WHERE id = foundry_id AND status = 'published'::content_status;
  ELSE
    -- If not authenticated, return masked contact info
    SELECT jsonb_build_object(
      'email', mask_email(email),
      'phone', mask_phone(phone),
      'masked', true
    )
    INTO contact_info
    FROM foundries
    WHERE id = foundry_id AND status = 'published'::content_status;
  END IF;
  
  RETURN COALESCE(contact_info, '{}'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_supplier_contact_info(supplier_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  contact_info jsonb;
BEGIN
  -- If user is authenticated, return full contact info
  IF auth.uid() IS NOT NULL THEN
    SELECT jsonb_build_object(
      'email', email,
      'phone', phone,
      'masked', false
    )
    INTO contact_info
    FROM suppliers
    WHERE id = supplier_id AND status = 'published'::content_status;
  ELSE
    -- If not authenticated, return masked contact info
    SELECT jsonb_build_object(
      'email', mask_email(email),
      'phone', mask_phone(phone),
      'masked', true
    )
    INTO contact_info
    FROM suppliers
    WHERE id = supplier_id AND status = 'published'::content_status;
  END IF;
  
  RETURN COALESCE(contact_info, '{}'::jsonb);
END;
$$;