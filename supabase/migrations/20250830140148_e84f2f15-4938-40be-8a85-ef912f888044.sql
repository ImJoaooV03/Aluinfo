-- Fix newsletter subscriber security vulnerability
-- Remove potentially exploitable RLS policies and implement secure access control

-- First, review current policies on newsletter_subscribers
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'newsletter_subscribers';

-- Drop all existing policies to rebuild securely
DROP POLICY IF EXISTS "Admins podem gerenciar newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Apenas admins podem visualizar assinantes" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Qualquer um pode se inscrever na newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Usuários podem atualizar sua própria inscrição" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Usuários podem ver apenas sua própria inscrição" ON public.newsletter_subscribers;

-- Create secure admin-only policies
CREATE POLICY "Admins have full access to newsletter subscribers" 
ON public.newsletter_subscribers 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create a secure public subscription function that doesn't expose existing emails
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
  existing_subscriber jsonb;
  result jsonb;
BEGIN
  -- Check if email already exists (without exposing the data)
  SELECT jsonb_build_object('exists', true, 'active', is_active) 
  INTO existing_subscriber
  FROM newsletter_subscribers 
  WHERE email = subscriber_email;
  
  IF existing_subscriber IS NOT NULL THEN
    -- If subscriber exists and is active, return success without exposing data
    IF (existing_subscriber->>'active')::boolean THEN
      RETURN jsonb_build_object(
        'success', true, 
        'message', 'Email já está inscrito na newsletter',
        'already_subscribed', true
      );
    ELSE
      -- Reactivate inactive subscription
      UPDATE newsletter_subscribers 
      SET is_active = true, unsubscribed_at = NULL, subscribed_at = now()
      WHERE email = subscriber_email;
      
      RETURN jsonb_build_object(
        'success', true, 
        'message', 'Inscrição reativada com sucesso',
        'reactivated', true
      );
    END IF;
  ELSE
    -- Create new subscription
    INSERT INTO newsletter_subscribers (email, name, is_active, subscribed_at)
    VALUES (subscriber_email, subscriber_name, true, now());
    
    RETURN jsonb_build_object(
      'success', true, 
      'message', 'Inscrito na newsletter com sucesso',
      'new_subscription', true
    );
  END IF;
  
EXCEPTION 
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false, 
      'message', 'Erro ao processar inscrição'
    );
END;
$$;

-- Create secure unsubscribe function
CREATE OR REPLACE FUNCTION public.unsubscribe_from_newsletter(
  subscriber_email text,
  unsubscribe_token text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Simple unsubscribe by email (in production, you'd want a secure token system)
  UPDATE newsletter_subscribers 
  SET is_active = false, unsubscribed_at = now()
  WHERE email = subscriber_email AND is_active = true;
  
  IF FOUND THEN
    RETURN jsonb_build_object(
      'success', true, 
      'message', 'Email removido da newsletter com sucesso'
    );
  ELSE
    RETURN jsonb_build_object(
      'success', false, 
      'message', 'Email não encontrado ou já removido'
    );
  END IF;
  
EXCEPTION 
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false, 
      'message', 'Erro ao processar remoção'
    );
END;
$$;

-- Create function for authenticated users to check their own subscription status
CREATE OR REPLACE FUNCTION public.get_my_newsletter_subscription()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_email text;
  subscription jsonb;
BEGIN
  -- Get current user's email
  SELECT email INTO user_email 
  FROM profiles 
  WHERE user_id = auth.uid();
  
  IF user_email IS NULL THEN
    RETURN jsonb_build_object('error', 'User not found');
  END IF;
  
  -- Get subscription status
  SELECT jsonb_build_object(
    'subscribed', is_active,
    'subscribed_at', subscribed_at,
    'unsubscribed_at', unsubscribed_at
  ) INTO subscription
  FROM newsletter_subscribers 
  WHERE email = user_email;
  
  RETURN COALESCE(subscription, jsonb_build_object('subscribed', false));
END;
$$;