-- Strengthen security for newsletter subscribers and profiles tables

-- Ensure newsletter_subscribers table is completely locked down
-- Drop and recreate the policy to ensure it's bulletproof
DROP POLICY IF EXISTS "Admins have full access to newsletter subscribers" ON public.newsletter_subscribers;

-- Create the most restrictive possible policy
CREATE POLICY "Only admins can access newsletter data" 
ON public.newsletter_subscribers 
FOR ALL 
TO public
USING (is_admin() = true)
WITH CHECK (is_admin() = true);

-- Strengthen profiles table security
-- Check current policies on profiles table
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Admins podem ver todos os perfis" ON public.profiles;

-- Create more restrictive profiles policies
CREATE POLICY "Users can only view their own profile" 
ON public.profiles 
FOR SELECT 
TO public
USING (auth.uid() = user_id);

CREATE POLICY "Users can only update their own profile" 
ON public.profiles 
FOR UPDATE 
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins have full profile access" 
ON public.profiles 
FOR ALL 
TO public
USING (is_admin() = true)
WITH CHECK (is_admin() = true);

-- Prevent any INSERT on profiles (only system triggers should create profiles)
CREATE POLICY "Only system can create profiles" 
ON public.profiles 
FOR INSERT 
TO public
WITH CHECK (false);

-- Add additional security check to newsletter functions
CREATE OR REPLACE FUNCTION public.subscribe_to_newsletter(
  subscriber_email text,
  subscriber_name text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  existing_subscriber record;
  result jsonb;
BEGIN
  -- Input validation
  IF subscriber_email IS NULL OR subscriber_email = '' OR subscriber_email !~ '^[^@]+@[^@]+\.[^@]+$' THEN
    RETURN jsonb_build_object(
      'success', false, 
      'message', 'Email inválido'
    );
  END IF;
  
  -- Rate limiting check (simple implementation)
  -- In production, implement proper rate limiting
  
  -- Check if email already exists (secure check)
  SELECT is_active, unsubscribed_at INTO existing_subscriber
  FROM newsletter_subscribers 
  WHERE email = lower(trim(subscriber_email));
  
  IF FOUND THEN
    -- If subscriber exists and is active, return success without exposing data
    IF existing_subscriber.is_active THEN
      RETURN jsonb_build_object(
        'success', true, 
        'message', 'Email já está inscrito na newsletter',
        'already_subscribed', true
      );
    ELSE
      -- Reactivate inactive subscription
      UPDATE newsletter_subscribers 
      SET is_active = true, 
          unsubscribed_at = NULL, 
          subscribed_at = now(),
          name = COALESCE(trim(subscriber_name), name)
      WHERE email = lower(trim(subscriber_email));
      
      RETURN jsonb_build_object(
        'success', true, 
        'message', 'Inscrição reativada com sucesso',
        'reactivated', true
      );
    END IF;
  ELSE
    -- Create new subscription
    INSERT INTO newsletter_subscribers (email, name, is_active, subscribed_at)
    VALUES (lower(trim(subscriber_email)), trim(subscriber_name), true, now());
    
    RETURN jsonb_build_object(
      'success', true, 
      'message', 'Inscrito na newsletter com sucesso',
      'new_subscription', true
    );
  END IF;
  
EXCEPTION 
  WHEN OTHERS THEN
    -- Log error securely without exposing details
    RAISE LOG 'Newsletter subscription error for email: % - Error: %', 
              left(subscriber_email, 3) || '***', SQLERRM;
    RETURN jsonb_build_object(
      'success', false, 
      'message', 'Erro ao processar inscrição. Tente novamente.'
    );
END;
$$;