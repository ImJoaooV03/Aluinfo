
-- Habilitar Realtime (enviar linha completa em updates) e adicionar as tabelas na publicação supabase_realtime

-- Notícias
ALTER TABLE public.news REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news;

-- Materiais Técnicos
ALTER TABLE public.technical_materials REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.technical_materials;

-- E-books
ALTER TABLE public.ebooks REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ebooks;

-- Eventos
ALTER TABLE public.events REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;

-- Indicadores LME
ALTER TABLE public.lme_indicators REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lme_indicators;

-- Para a busca reagir em tempo real (já usamos hooks):
ALTER TABLE public.suppliers REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.suppliers;

ALTER TABLE public.foundries REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.foundries;
