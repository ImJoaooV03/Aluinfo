-- Incrementar impressões de banners quando analytics_views registrar content_type = 'banner'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'increment_banner_impressions'
  ) THEN
    CREATE OR REPLACE FUNCTION public.increment_banner_impressions()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
    BEGIN
      IF NEW.content_type = 'banner' THEN
        UPDATE public.banners
          SET impression_count = COALESCE(impression_count, 0) + 1
          WHERE id = NEW.content_id;
      END IF;
      RETURN NEW;
    END;
    $$;
  END IF;

  -- Criar trigger (idempotente)
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'analytics_views_increment_banner_impressions'
  ) THEN
    CREATE TRIGGER analytics_views_increment_banner_impressions
    AFTER INSERT ON public.analytics_views
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_banner_impressions();
  END IF;
END $$;


