-- Create trigger to increment news view count when analytics_views is inserted
CREATE OR REPLACE FUNCTION public.increment_news_view_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only increment if content_type is 'news'
  IF NEW.content_type = 'news' THEN
    UPDATE public.news
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE id = NEW.content_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger that fires after insert on analytics_views
CREATE TRIGGER trigger_increment_news_view_count
  AFTER INSERT ON public.analytics_views
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_news_view_count();