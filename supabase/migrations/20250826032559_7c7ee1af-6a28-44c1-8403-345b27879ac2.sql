-- Fix Critical Security Issues

-- 1. Revoke anon access to sensitive columns in suppliers and foundries
REVOKE SELECT (email, phone, address) ON public.suppliers FROM anon;
REVOKE SELECT (email, phone, address) ON public.foundries FROM anon;

-- 2. Add WITH CHECK constraint to profiles UPDATE policy to prevent role escalation
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND 
  -- Prevent users from changing their own role unless they're already admin
  (OLD.role = NEW.role OR is_admin())
);

-- 3. Create validation trigger to prevent unauthorized role changes
CREATE OR REPLACE FUNCTION public.validate_profile_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow role changes if the user is an admin
  IF OLD.role != NEW.role AND NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized role change attempt';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for profile role validation
DROP TRIGGER IF EXISTS validate_profile_role_trigger ON public.profiles;
CREATE TRIGGER validate_profile_role_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_profile_role_change();