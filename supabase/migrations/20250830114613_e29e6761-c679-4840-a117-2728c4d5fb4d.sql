-- Remove the redundant trigger and function that's causing double increment
DROP TRIGGER IF EXISTS trigger_increment_news_view_count ON public.analytics_views;
DROP FUNCTION IF EXISTS public.increment_news_view_count();