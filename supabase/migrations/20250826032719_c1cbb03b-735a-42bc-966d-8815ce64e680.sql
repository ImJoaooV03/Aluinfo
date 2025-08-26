-- Fix function search path security warning
CREATE OR REPLACE FUNCTION public.validate_profile_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow role changes if the user is an admin
  IF OLD.role != NEW.role AND NOT is_admin() THEN
    RAISE EXCEPTION 'Unauthorized role change attempt';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;