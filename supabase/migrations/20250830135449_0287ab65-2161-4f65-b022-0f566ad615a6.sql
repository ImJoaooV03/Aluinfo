-- Fix PII exposure for suppliers and foundries
-- Remove overly permissive public access policies

-- Drop existing problematic policies for suppliers
DROP POLICY IF EXISTS "Acesso público básico a fornecedores" ON public.suppliers;

-- Create more restrictive policy for suppliers - only basic info for unauthenticated users
CREATE POLICY "Public can view basic supplier info only" 
ON public.suppliers 
FOR SELECT 
USING (
  status = 'published'::content_status AND (
    -- Authenticated users get full access
    auth.uid() IS NOT NULL OR 
    -- Unauthenticated users only get basic info (no contact details)
    (auth.uid() IS NULL AND email IS NULL AND phone IS NULL)
  )
);

-- Drop existing problematic policies for foundries  
DROP POLICY IF EXISTS "Acesso público básico a fundições" ON public.foundries;

-- Create more restrictive policy for foundries - only basic info for unauthenticated users
CREATE POLICY "Public can view basic foundry info only" 
ON public.foundries 
FOR SELECT 
USING (
  status = 'published'::content_status AND (
    -- Authenticated users get full access
    auth.uid() IS NOT NULL OR 
    -- Unauthenticated users only get basic info (no contact details)  
    (auth.uid() IS NULL AND email IS NULL AND phone IS NULL)
  )
);

-- Update storage bucket policies to restrict access to paid content
-- First, update buckets to be private
UPDATE storage.buckets SET public = false WHERE id IN ('materials', 'ebooks');

-- Create policy for materials bucket - only authenticated users
CREATE POLICY "Authenticated users can download materials" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'materials' AND auth.uid() IS NOT NULL);

-- Create policy for ebooks bucket - only authenticated users  
CREATE POLICY "Authenticated users can download ebooks" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'ebooks' AND auth.uid() IS NOT NULL);

-- Remove the auto-admin backdoor - drop trigger first, then function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_admin_user_signup() CASCADE;
DROP FUNCTION IF EXISTS public.ensure_admin_self();

-- Create a secure admin creation function that requires explicit admin approval
CREATE OR REPLACE FUNCTION public.create_admin_user(target_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only existing admins can create new admins
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can create admin users';
  END IF;
  
  -- Update the user's role to admin
  UPDATE public.profiles 
  SET role = 'admin'::user_role, updated_at = now()
  WHERE email = target_email;
  
  -- If no profile exists, we can't make them admin
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', target_email;
  END IF;
END;
$$;

-- Restore the original secure user creation trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'user'::user_role -- All new users default to 'user' role
  );
  RETURN NEW;
END;
$$;

-- Recreate the trigger for new user handling
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();