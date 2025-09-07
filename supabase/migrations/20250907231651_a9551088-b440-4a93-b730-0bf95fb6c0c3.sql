
-- 1) Enum de idiomas (cria apenas se não existir)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'language_code') THEN
    CREATE TYPE public.language_code AS ENUM ('pt','es','en');
  END IF;
END$$;

-- 2) Tabelas de traduções
-- 2.1) News
CREATE TABLE IF NOT EXISTS public.news_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (news_id, lang)
);
CREATE INDEX IF NOT EXISTS idx_news_translations_lang ON public.news_translations(lang);
CREATE INDEX IF NOT EXISTS idx_news_translations_news_lang ON public.news_translations(news_id, lang);
CREATE TRIGGER set_updated_at_news_translations
BEFORE UPDATE ON public.news_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2.2) News categories
CREATE TABLE IF NOT EXISTS public.news_categories_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.news_categories(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_id, lang)
);
CREATE INDEX IF NOT EXISTS idx_news_cat_translations_lang ON public.news_categories_translations(lang);
CREATE INDEX IF NOT EXISTS idx_news_cat_translations_cat_lang ON public.news_categories_translations(category_id, lang);
CREATE TRIGGER set_updated_at_news_cat_translations
BEFORE UPDATE ON public.news_categories_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2.3) Ebooks
CREATE TABLE IF NOT EXISTS public.ebooks_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ebook_id UUID NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (ebook_id, lang)
);
CREATE INDEX IF NOT EXISTS idx_ebooks_translations_lang ON public.ebooks_translations(lang);
CREATE INDEX IF NOT EXISTS idx_ebooks_translations_ebook_lang ON public.ebooks_translations(ebook_id, lang);
CREATE TRIGGER set_updated_at_ebooks_translations
BEFORE UPDATE ON public.ebooks_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2.4) Technical materials
CREATE TABLE IF NOT EXISTS public.technical_materials_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES public.technical_materials(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (material_id, lang)
);
CREATE INDEX IF NOT EXISTS idx_tm_translations_lang ON public.technical_materials_translations(lang);
CREATE INDEX IF NOT EXISTS idx_tm_translations_mat_lang ON public.technical_materials_translations(material_id, lang);
CREATE TRIGGER set_updated_at_tm_translations
BEFORE UPDATE ON public.technical_materials_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2.5) Events
CREATE TABLE IF NOT EXISTS public.events_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  venue TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, lang)
);
CREATE INDEX IF NOT EXISTS idx_events_translations_lang ON public.events_translations(lang);
CREATE INDEX IF NOT EXISTS idx_events_translations_event_lang ON public.events_translations(event_id, lang);
CREATE TRIGGER set_updated_at_events_translations
BEFORE UPDATE ON public.events_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2.6) Supplier categories
CREATE TABLE IF NOT EXISTS public.supplier_categories_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.supplier_categories(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_id, lang)
);
CREATE INDEX IF NOT EXISTS idx_sup_cat_translations_lang ON public.supplier_categories_translations(lang);
CREATE INDEX IF NOT EXISTS idx_sup_cat_translations_cat_lang ON public.supplier_categories_translations(category_id, lang);
CREATE TRIGGER set_updated_at_sup_cat_translations
BEFORE UPDATE ON public.supplier_categories_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2.7) Foundry categories
CREATE TABLE IF NOT EXISTS public.foundry_categories_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.foundry_categories(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (category_id, lang)
);
CREATE INDEX IF NOT EXISTS idx_found_cat_translations_lang ON public.foundry_categories_translations(lang);
CREATE INDEX IF NOT EXISTS idx_found_cat_translations_cat_lang ON public.foundry_categories_translations(category_id, lang);
CREATE TRIGGER set_updated_at_found_cat_translations
BEFORE UPDATE ON public.foundry_categories_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2.8) Suppliers (apenas campos textuais)
CREATE TABLE IF NOT EXISTS public.suppliers_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  specialty TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (supplier_id, lang)
);
CREATE INDEX IF NOT EXISTS idx_suppliers_translations_lang ON public.suppliers_translations(lang);
CREATE INDEX IF NOT EXISTS idx_suppliers_translations_sup_lang ON public.suppliers_translations(supplier_id, lang);
CREATE TRIGGER set_updated_at_suppliers_translations
BEFORE UPDATE ON public.suppliers_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2.9) Foundries (apenas campos textuais)
CREATE TABLE IF NOT EXISTS public.foundries_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  foundry_id UUID NOT NULL REFERENCES public.foundries(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  specialty TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (foundry_id, lang)
);
CREATE INDEX IF NOT EXISTS idx_foundries_translations_lang ON public.foundries_translations(lang);
CREATE INDEX IF NOT EXISTS idx_foundries_translations_foundry_lang ON public.foundries_translations(foundry_id, lang);
CREATE TRIGGER set_updated_at_foundries_translations
BEFORE UPDATE ON public.foundries_translations
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) RLS e Políticas
-- Habilitar RLS
ALTER TABLE public.news_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_categories_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebooks_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_materials_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_categories_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundry_categories_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundries_translations ENABLE ROW LEVEL SECURITY;

-- Admin policies (gerais)
CREATE POLICY IF NOT EXISTS "Admins manage news_translations"
  ON public.news_translations FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Admins manage news_categories_translations"
  ON public.news_categories_translations FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Admins manage ebooks_translations"
  ON public.ebooks_translations FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Admins manage technical_materials_translations"
  ON public.technical_materials_translations FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Admins manage events_translations"
  ON public.events_translations FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Admins manage supplier_categories_translations"
  ON public.supplier_categories_translations FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Admins manage foundry_categories_translations"
  ON public.foundry_categories_translations FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Admins manage suppliers_translations"
  ON public.suppliers_translations FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Admins manage foundries_translations"
  ON public.foundries_translations FOR ALL
  USING (is_admin()) WITH CHECK (is_admin());

-- Public SELECT policies
-- News translations: apenas quando a notícia base estiver publicada
CREATE POLICY IF NOT EXISTS "Public can view news translations when base is published"
  ON public.news_translations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.news n
    WHERE n.id = news_id
      AND n.status = 'published'::content_status
  ) OR is_admin());

-- News categories: público pode ver sempre
CREATE POLICY IF NOT EXISTS "Public can view news_categories translations"
  ON public.news_categories_translations FOR SELECT
  USING (true);

-- Ebooks translations: base publicada
CREATE POLICY IF NOT EXISTS "Public can view ebooks translations when base is published"
  ON public.ebooks_translations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.ebooks e
    WHERE e.id = ebook_id
      AND e.status = 'published'::content_status
  ) OR is_admin());

-- Technical materials: base publicada
CREATE POLICY IF NOT EXISTS "Public can view technical materials translations when base is published"
  ON public.technical_materials_translations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.technical_materials m
    WHERE m.id = material_id
      AND m.status = 'published'::content_status
  ) OR is_admin());

-- Events: base publicada
CREATE POLICY IF NOT EXISTS "Public can view events translations when base is published"
  ON public.events_translations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.events ev
    WHERE ev.id = event_id
      AND ev.status = 'published'::content_status
  ) OR is_admin());

-- Supplier categories: público pode ver sempre
CREATE POLICY IF NOT EXISTS "Public can view supplier_categories translations"
  ON public.supplier_categories_translations FOR SELECT
  USING (true);

-- Foundry categories: público pode ver sempre
CREATE POLICY IF NOT EXISTS "Public can view foundry_categories translations"
  ON public.foundry_categories_translations FOR SELECT
  USING (true);

-- Suppliers translations: base publicada
CREATE POLICY IF NOT EXISTS "Public can view suppliers translations when base is published"
  ON public.suppliers_translations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.suppliers s
    WHERE s.id = supplier_id
      AND s.status = 'published'::content_status
  ) OR is_admin());

-- Foundries translations: base publicada
CREATE POLICY IF NOT EXISTS "Public can view foundries translations when base is published"
  ON public.foundries_translations FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.foundries f
    WHERE f.id = foundry_id
      AND f.status = 'published'::content_status
  ) OR is_admin());

-- 4) Backfill: criar registros 'pt' com os dados atuais
INSERT INTO public.news_translations (news_id, lang, title, excerpt, content)
SELECT id, 'pt'::public.language_code, title, excerpt, content
FROM public.news
ON CONFLICT (news_id, lang) DO NOTHING;

INSERT INTO public.news_categories_translations (category_id, lang, name, description)
SELECT id, 'pt'::public.language_code, name, description
FROM public.news_categories
ON CONFLICT (category_id, lang) DO NOTHING;

INSERT INTO public.ebooks_translations (ebook_id, lang, title, description)
SELECT id, 'pt'::public.language_code, title, description
FROM public.ebooks
ON CONFLICT (ebook_id, lang) DO NOTHING;

INSERT INTO public.technical_materials_translations (material_id, lang, title, description)
SELECT id, 'pt'::public.language_code, title, description
FROM public.technical_materials
ON CONFLICT (material_id, lang) DO NOTHING;

INSERT INTO public.events_translations (event_id, lang, title, description, location, venue)
SELECT id, 'pt'::public.language_code, title, description, location, venue
FROM public.events
ON CONFLICT (event_id, lang) DO NOTHING;

INSERT INTO public.supplier_categories_translations (category_id, lang, name, description)
SELECT id, 'pt'::public.language_code, name, description
FROM public.supplier_categories
ON CONFLICT (category_id, lang) DO NOTHING;

INSERT INTO public.foundry_categories_translations (category_id, lang, name, description)
SELECT id, 'pt'::public.language_code, name, description
FROM public.foundry_categories
ON CONFLICT (category_id, lang) DO NOTHING;

INSERT INTO public.suppliers_translations (supplier_id, lang, name, description, specialty)
SELECT id, 'pt'::public.language_code, name, description, specialty
FROM public.suppliers
ON CONFLICT (supplier_id, lang) DO NOTHING;

INSERT INTO public.foundries_translations (foundry_id, lang, name, description, specialty)
SELECT id, 'pt'::public.language_code, name, description, specialty
FROM public.foundries
ON CONFLICT (foundry_id, lang) DO NOTHING;
