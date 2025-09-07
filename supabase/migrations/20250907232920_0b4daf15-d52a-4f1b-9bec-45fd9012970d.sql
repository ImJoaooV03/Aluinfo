-- 1) Enum for language codes
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'language_code') THEN
    CREATE TYPE public.language_code AS ENUM ('pt','es','en');
  END IF;
END $$;

-- Helper: updated_at trigger function (reuse if exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2) Translation tables
CREATE TABLE IF NOT EXISTS public.news_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  title TEXT,
  excerpt TEXT,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (news_id, lang)
);

CREATE TABLE IF NOT EXISTS public.ebooks_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ebook_id UUID NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (ebook_id, lang)
);

CREATE TABLE IF NOT EXISTS public.events_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  title TEXT,
  description TEXT,
  venue TEXT,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, lang)
);

CREATE TABLE IF NOT EXISTS public.technical_materials_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES public.technical_materials(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (material_id, lang)
);

CREATE TABLE IF NOT EXISTS public.news_categories_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.news_categories(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_id, lang)
);

-- Triggers for updated_at
CREATE TRIGGER trg_news_translations_updated
BEFORE UPDATE ON public.news_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_ebooks_translations_updated
BEFORE UPDATE ON public.ebooks_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_events_translations_updated
BEFORE UPDATE ON public.events_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_technical_materials_translations_updated
BEFORE UPDATE ON public.technical_materials_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_news_categories_translations_updated
BEFORE UPDATE ON public.news_categories_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Enable RLS and policies (open read, admin manage)
ALTER TABLE public.news_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebooks_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_materials_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_categories_translations ENABLE ROW LEVEL SECURITY;

-- Admin ALL policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='news_translations' AND policyname='Admins manage news translations'
  ) THEN
    CREATE POLICY "Admins manage news translations" ON public.news_translations FOR ALL USING (is_admin()) WITH CHECK (is_admin());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ebooks_translations' AND policyname='Admins manage ebooks translations'
  ) THEN
    CREATE POLICY "Admins manage ebooks translations" ON public.ebooks_translations FOR ALL USING (is_admin()) WITH CHECK (is_admin());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='events_translations' AND policyname='Admins manage events translations'
  ) THEN
    CREATE POLICY "Admins manage events translations" ON public.events_translations FOR ALL USING (is_admin()) WITH CHECK (is_admin());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='technical_materials_translations' AND policyname='Admins manage technical materials translations'
  ) THEN
    CREATE POLICY "Admins manage technical materials translations" ON public.technical_materials_translations FOR ALL USING (is_admin()) WITH CHECK (is_admin());
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='news_categories_translations' AND policyname='Admins manage news categories translations'
  ) THEN
    CREATE POLICY "Admins manage news categories translations" ON public.news_categories_translations FOR ALL USING (is_admin()) WITH CHECK (is_admin());
  END IF;
END $$;

-- Public SELECT policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='news_translations' AND policyname='Public can read news translations'
  ) THEN
    CREATE POLICY "Public can read news translations" ON public.news_translations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ebooks_translations' AND policyname='Public can read ebooks translations'
  ) THEN
    CREATE POLICY "Public can read ebooks translations" ON public.ebooks_translations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='events_translations' AND policyname='Public can read events translations'
  ) THEN
    CREATE POLICY "Public can read events translations" ON public.events_translations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='technical_materials_translations' AND policyname='Public can read technical materials translations'
  ) THEN
    CREATE POLICY "Public can read technical materials translations" ON public.technical_materials_translations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='news_categories_translations' AND policyname='Public can read news categories translations'
  ) THEN
    CREATE POLICY "Public can read news categories translations" ON public.news_categories_translations FOR SELECT USING (true);
  END IF;
END $$;

-- 4) Backfill translations from base data
-- NEWS
INSERT INTO public.news_translations (news_id, lang, title, excerpt, content)
SELECT n.id, l, n.title, n.excerpt, n.content
FROM public.news n
CROSS JOIN (SELECT unnest(ARRAY['pt'::public.language_code,'es'::public.language_code,'en'::public.language_code]) AS l) langs
ON CONFLICT (news_id, lang) DO NOTHING;

-- EBOOKS
INSERT INTO public.ebooks_translations (ebook_id, lang, title, description)
SELECT e.id, l, e.title, e.description
FROM public.ebooks e
CROSS JOIN (SELECT unnest(ARRAY['pt'::public.language_code,'es'::public.language_code,'en'::public.language_code]) AS l) langs
ON CONFLICT (ebook_id, lang) DO NOTHING;

-- EVENTS
INSERT INTO public.events_translations (event_id, lang, title, description, venue, location)
SELECT ev.id, l, ev.title, ev.description, ev.venue, ev.location
FROM public.events ev
CROSS JOIN (SELECT unnest(ARRAY['pt'::public.language_code,'es'::public.language_code,'en'::public.language_code]) AS l) langs
ON CONFLICT (event_id, lang) DO NOTHING;

-- TECHNICAL MATERIALS
INSERT INTO public.technical_materials_translations (material_id, lang, title, description)
SELECT tm.id, l, tm.title, tm.description
FROM public.technical_materials tm
CROSS JOIN (SELECT unnest(ARRAY['pt'::public.language_code,'es'::public.language_code,'en'::public.language_code]) AS l) langs
ON CONFLICT (material_id, lang) DO NOTHING;

-- NEWS CATEGORIES
INSERT INTO public.news_categories_translations (category_id, lang, name, description)
SELECT c.id, l, c.name, c.description
FROM public.news_categories c
CROSS JOIN (SELECT unnest(ARRAY['pt'::public.language_code,'es'::public.language_code,'en'::public.language_code]) AS l) langs
ON CONFLICT (category_id, lang) DO NOTHING;
