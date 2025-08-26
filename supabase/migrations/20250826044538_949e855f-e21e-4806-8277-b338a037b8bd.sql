
-- Habilitar Realtime na tabela de banners
-- 1) Garantir que UPDATE/DELETE enviem o registro completo
ALTER TABLE public.banners REPLICA IDENTITY FULL;

-- 2) Adicionar a tabela à publicação supabase_realtime
-- Se a tabela já estiver na publicação, este comando será idempotente
ALTER PUBLICATION supabase_realtime ADD TABLE public.banners;
