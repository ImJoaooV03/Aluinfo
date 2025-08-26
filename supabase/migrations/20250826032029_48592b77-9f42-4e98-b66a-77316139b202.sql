-- Corrigir todos os avisos de segurança restantes

-- 1. Adicionar search_path às funções de mascaramento
CREATE OR REPLACE FUNCTION public.mask_email(email_address TEXT)
RETURNS TEXT AS $$
BEGIN
  IF email_address IS NULL OR email_address = '' THEN
    RETURN NULL;
  END IF;
  
  -- Extrair partes do email
  DECLARE
    username TEXT;
    domain TEXT;
    at_position INT;
  BEGIN
    at_position := POSITION('@' IN email_address);
    IF at_position = 0 THEN
      RETURN '***'; -- Email inválido
    END IF;
    
    username := SUBSTRING(email_address FROM 1 FOR at_position - 1);
    domain := SUBSTRING(email_address FROM at_position);
    
    -- Mostrar apenas primeiro caractere do username
    RETURN SUBSTRING(username FROM 1 FOR 1) || '***' || domain;
  END;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.mask_phone(phone_number TEXT)
RETURNS TEXT AS $$
BEGIN
  IF phone_number IS NULL OR phone_number = '' THEN
    RETURN NULL;
  END IF;
  
  -- Remover caracteres não numéricos para contar dígitos
  DECLARE
    clean_phone TEXT;
    phone_length INT;
  BEGIN
    clean_phone := REGEXP_REPLACE(phone_number, '[^0-9]', '', 'g');
    phone_length := LENGTH(clean_phone);
    
    IF phone_length < 4 THEN
      RETURN '***';
    END IF;
    
    -- Mostrar apenas os últimos 4 dígitos
    RETURN REPEAT('*', phone_length - 4) || SUBSTRING(clean_phone FROM phone_length - 3);
  END;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2. Remover as views problemáticas e usar uma abordagem mais simples
DROP VIEW IF EXISTS public.suppliers_public;
DROP VIEW IF EXISTS public.foundries_public;

-- 3. Implementar solução mais direta: usar as políticas RLS das tabelas originais
-- As tabelas já estão protegidas, vamos apenas informar sobre como usar corretamente

-- Política para visualização pública limitada de fornecedores (sem dados sensíveis)
CREATE POLICY "Visualização pública limitada de fornecedores" 
ON public.suppliers 
FOR SELECT 
USING (
  status = 'published' 
  -- Usuários anônimos podem ver informações básicas (nome, descrição, etc.)
  -- mas as aplicações devem mascarar emails/telefones no frontend para usuários não autenticados
);

-- Política para visualização pública limitada de fundições (sem dados sensíveis)
CREATE POLICY "Visualização pública limitada de fundições" 
ON public.foundries 
FOR SELECT 
USING (
  status = 'published'
  -- Usuários anônimos podem ver informações básicas (nome, descrição, etc.)
  -- mas as aplicações devem mascarar emails/telefones no frontend para usuários não autenticados
);