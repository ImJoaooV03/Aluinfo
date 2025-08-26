-- CORREÇÃO CRÍTICA DE SEGURANÇA: Proteger emails dos assinantes da newsletter

-- Remover a política vulnerável que permite acesso público aos emails
DROP POLICY IF EXISTS "Usuários podem ver suas próprias inscrições" ON public.newsletter_subscribers;

-- Criar nova política restritiva para SELECT - apenas admins podem ver os dados
CREATE POLICY "Apenas admins podem visualizar assinantes" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (public.is_admin());

-- Manter a política de INSERT para permitir inscrições públicas (segura)
-- A política "Qualquer um pode se inscrever na newsletter" já existe e está correta

-- Política para usuários autenticados consultarem apenas seu próprio status de inscrição
CREATE POLICY "Usuários podem ver apenas sua própria inscrição" 
ON public.newsletter_subscribers 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND email = (
    SELECT email FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- Política para permitir que usuários atualizem apenas sua própria inscrição (unsubscribe)
CREATE POLICY "Usuários podem atualizar sua própria inscrição" 
ON public.newsletter_subscribers 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL 
  AND email = (
    SELECT email FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);

-- Adicionar índice para melhorar performance nas consultas de email
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);