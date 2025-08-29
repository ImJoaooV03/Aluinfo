
-- Função que incrementa contadores após registrar analytics de visualizações/downloads
CREATE OR REPLACE FUNCTION public.increment_counters_on_view()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Incrementa contadores conforme o tipo de conteúdo
  IF NEW.content_type = 'news' THEN
    UPDATE public.news
      SET view_count = COALESCE(view_count, 0) + 1
      WHERE id = NEW.content_id;
  ELSIF NEW.content_type = 'technical_materials' THEN
    UPDATE public.technical_materials
      SET download_count = COALESCE(download_count, 0) + 1
      WHERE id = NEW.content_id;
  ELSIF NEW.content_type = 'ebooks' THEN
    UPDATE public.ebooks
      SET download_count = COALESCE(download_count, 0) + 1
      WHERE id = NEW.content_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Remove a trigger antiga (se existir) para evitar duplicidade
DROP TRIGGER IF EXISTS analytics_views_increment_counters ON public.analytics_views;

-- Cria a trigger para rodar após cada INSERT em analytics_views
CREATE TRIGGER analytics_views_increment_counters
AFTER INSERT ON public.analytics_views
FOR EACH ROW
EXECUTE FUNCTION public.increment_counters_on_view();
