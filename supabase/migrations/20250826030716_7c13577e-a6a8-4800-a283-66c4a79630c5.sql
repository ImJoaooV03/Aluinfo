-- Corrigir avisos de segurança: definir search_path nas funções
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.increment_view_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'news' THEN
    UPDATE public.news SET view_count = view_count + 1 WHERE id = NEW.content_id;
  ELSIF TG_TABLE_NAME = 'technical_materials' THEN
    UPDATE public.technical_materials SET download_count = download_count + 1 WHERE id = NEW.content_id;
  ELSIF TG_TABLE_NAME = 'ebooks' THEN
    UPDATE public.ebooks SET download_count = download_count + 1 WHERE id = NEW.content_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.increment_banner_clicks()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.banners SET click_count = click_count + 1 WHERE id = NEW.banner_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;