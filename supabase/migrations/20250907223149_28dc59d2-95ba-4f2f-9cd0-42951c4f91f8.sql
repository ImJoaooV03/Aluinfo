-- Fix critical security issue: Add missing trigger for profile role validation
CREATE TRIGGER validate_profile_role_change_trigger
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_profile_role_change();

-- Secure newsletter unsubscribe function with token requirement
CREATE OR REPLACE FUNCTION public.unsubscribe_from_newsletter(subscriber_email text, unsubscribe_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  stored_token text;
BEGIN
  -- Input validation
  IF subscriber_email IS NULL OR subscriber_email = '' OR unsubscribe_token IS NULL OR unsubscribe_token = '' THEN
    RETURN jsonb_build_object(
      'success', false, 
      'message', 'Email e token são obrigatórios'
    );
  END IF;

  -- Get stored token (in production, this should be a secure hash)
  -- For now, we'll use email-based token validation
  stored_token := encode(digest(subscriber_email || 'aluinfo_secret', 'sha256'), 'hex');
  
  -- Validate token
  IF unsubscribe_token != stored_token THEN
    RETURN jsonb_build_object(
      'success', false, 
      'message', 'Token inválido'
    );
  END IF;

  -- Process unsubscribe
  UPDATE newsletter_subscribers 
  SET is_active = false, unsubscribed_at = now()
  WHERE email = lower(trim(subscriber_email)) AND is_active = true;
  
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

-- Revoke EXECUTE privileges from PUBLIC for sensitive functions
REVOKE EXECUTE ON FUNCTION public.create_admin_user(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.validate_profile_role_change() FROM PUBLIC;

-- Grant specific privileges only to authenticated users where needed
GRANT EXECUTE ON FUNCTION public.subscribe_to_newsletter(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.unsubscribe_from_newsletter(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_newsletter_subscription() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_supplier_contact_info(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_foundry_contact_info(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_suppliers(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_foundries(uuid) TO authenticated;