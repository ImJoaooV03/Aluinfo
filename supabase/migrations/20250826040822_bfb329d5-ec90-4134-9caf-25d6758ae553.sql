-- Create admin user profile with the specified credentials
-- Note: The actual user signup needs to be done through Supabase dashboard for security
-- This creates the profile entry for when the user is created

-- Insert or update the admin profile
INSERT INTO public.profiles (user_id, email, full_name, role)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, -- Temporary UUID, will be updated when real user is created
  'joaovicrengel@gmail.com',
  'João Victor Rengel',
  'admin'::user_role
)
ON CONFLICT (email) 
DO UPDATE SET 
  role = 'admin'::user_role,
  full_name = 'João Victor Rengel',
  updated_at = now();

-- Create a function to set admin role when the specific user signs up
CREATE OR REPLACE FUNCTION public.handle_admin_user_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if this is the admin email
  IF NEW.email = 'joaovicrengel@gmail.com' THEN
    -- Update or insert the profile with admin role
    INSERT INTO public.profiles (user_id, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'João Victor Rengel'),
      'admin'::user_role
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      role = 'admin'::user_role,
      email = NEW.email,
      updated_at = now();
  ELSE
    -- For any other user, use the existing handle_new_user function behavior
    INSERT INTO public.profiles (user_id, email, full_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      'user'::user_role
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      email = NEW.email,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Replace the existing trigger with the admin-aware one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_user_signup();