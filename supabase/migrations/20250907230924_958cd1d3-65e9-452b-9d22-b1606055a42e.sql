
-- 1) Enum de idiomas
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'language_code') THEN
    CREATE TYPE public.language_code AS ENUM ('pt', 'es', 'en');
  END IF;
END$$;

-- 2) Notícias
CREATE TABLE IF NOT EXISTS public.news_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id uuid NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  title text NOT NULL,
  excerpt text,
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (news_id, lang)
);
ALTER TABLE public.news_translations ENABLE ROW LEVEL SECURITY;

-- Admin ALL
CREATE POLICY IF NOT EXISTS "Admins podem gerenciar traduções de notícias"
  ON public.news_translations
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Público SELECT quando notícia publicada
CREATE POLICY IF NOT EXISTS "Qualquer um pode ver traduções de notícias publicadas"
  ON public.news_translations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.news n
      WHERE n.id = news_id
        AND n.status = 'published'::content_status
    )
  );

-- Trigger updated_at
DROP TRIGGER IF EXISTS news_translations_set_updated_at ON public.news_translations;
CREATE TRIGGER news_translations_set_updated_at
BEFORE UPDATE ON public.news_translations
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- 3) Categorias de notícias
CREATE TABLE IF NOT EXISTS public.news_categories_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.news_categories(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (category_id, lang)
);
ALTER TABLE public.news_categories_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Admins podem gerenciar traduções de categorias de notícias"
  ON public.news_categories_translations
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Qualquer um pode ver traduções de categorias de notícias"
  ON public.news_categories_translations
  FOR SELECT
  USING (true);

DROP TRIGGER IF EXISTS news_categories_translations_set_updated_at ON public.news_categories_translations;
CREATE TRIGGER news_categories_translations_set_updated_at
BEFORE UPDATE ON public.news_categories_translations
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- 4) Materiais técnicos
CREATE TABLE IF NOT EXISTS public.technical_materials_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid NOT NULL REFERENCES public.technical_materials(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (material_id, lang)
);
ALTER TABLE public.technical_materials_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Admins podem gerenciar traduções de materiais técnicos"
  ON public.technical_materials_translations
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Qualquer um pode ver traduções de materiais técnicos publicados"
  ON public.technical_materials_translations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.technical_materials m
      WHERE m.id = material_id
        AND m.status = 'published'::content_status
    )
  );

DROP TRIGGER IF EXISTS technical_materials_translations_set_updated_at ON public.technical_materials_translations;
CREATE TRIGGER technical_materials_translations_set_updated_at
BEFORE UPDATE ON public.technical_materials_translations
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- 5) Ebooks
CREATE TABLE IF NOT EXISTS public.ebooks_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ebook_id uuid NOT NULL REFERENCES public.ebooks(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (ebook_id, lang)
);
ALTER TABLE public.ebooks_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Admins podem gerenciar traduções de ebooks"
  ON public.ebooks_translations
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Qualquer um pode ver traduções de ebooks publicados"
  ON public.ebooks_translations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.ebooks e
      WHERE e.id = ebook_id
        AND e.status = 'published'::content_status
    )
  );

DROP TRIGGER IF EXISTS ebooks_translations_set_updated_at ON public.ebooks_translations;
CREATE TRIGGER ebooks_translations_set_updated_at
BEFORE UPDATE ON public.ebooks_translations
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- 6) Eventos
CREATE TABLE IF NOT EXISTS public.events_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  title text NOT NULL,
  description text,
  location text,
  venue text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (event_id, lang)
);
ALTER TABLE public.events_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Admins podem gerenciar traduções de eventos"
  ON public.events_translations
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Qualquer um pode ver traduções de eventos publicados"
  ON public.events_translations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.events ev
      WHERE ev.id = event_id
        AND ev.status = 'published'::content_status
    )
  );

DROP TRIGGER IF EXISTS events_translations_set_updated_at ON public.events_translations;
CREATE TRIGGER events_translations_set_updated_at
BEFORE UPDATE ON public.events_translations
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- 7) Categorias de fornecedores
CREATE TABLE IF NOT EXISTS public.supplier_categories_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.supplier_categories(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (category_id, lang)
);
ALTER TABLE public.supplier_categories_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Admins podem gerenciar traduções de categorias de fornecedores"
  ON public.supplier_categories_translations
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Qualquer um pode ver traduções de categorias de fornecedores"
  ON public.supplier_categories_translations
  FOR SELECT
  USING (true);

DROP TRIGGER IF EXISTS supplier_categories_translations_set_updated_at ON public.supplier_categories_translations;
CREATE TRIGGER supplier_categories_translations_set_updated_at
BEFORE UPDATE ON public.supplier_categories_translations
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- 8) Categorias de fundições
CREATE TABLE IF NOT EXISTS public.foundry_categories_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.foundry_categories(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (category_id, lang)
);
ALTER TABLE public.foundry_categories_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Admins podem gerenciar traduções de categorias de fundições"
  ON public.foundry_categories_translations
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Qualquer um pode ver traduções de categorias de fundições"
  ON public.foundry_categories_translations
  FOR SELECT
  USING (true);

DROP TRIGGER IF EXISTS foundry_categories_translations_set_updated_at ON public.foundry_categories_translations;
CREATE TRIGGER foundry_categories_translations_set_updated_at
BEFORE UPDATE ON public.foundry_categories_translations
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- 9) Fornecedores
CREATE TABLE IF NOT EXISTS public.suppliers_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  name text NOT NULL,
  description text,
  specialty text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (supplier_id, lang)
);
ALTER TABLE public.suppliers_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Admins podem gerenciar traduções de fornecedores"
  ON public.suppliers_translations
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Qualquer um pode ver traduções de fornecedores publicados"
  ON public.suppliers_translations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.suppliers s
      WHERE s.id = supplier_id
        AND s.status = 'published'::content_status
    )
  );

DROP TRIGGER IF EXISTS suppliers_translations_set_updated_at ON public.suppliers_translations;
CREATE TRIGGER suppliers_translations_set_updated_at
BEFORE UPDATE ON public.suppliers_translations
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();

-- 10) Fundações
CREATE TABLE IF NOT EXISTS public.foundries_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  foundry_id uuid NOT NULL REFERENCES public.foundries(id) ON DELETE CASCADE,
  lang public.language_code NOT NULL,
  name text NOT NULL,
  description text,
  specialty text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (foundry_id, lang)
);
ALTER TABLE public.foundries_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Admins podem gerenciar traduções de fundições"
  ON public.foundries_translations
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY IF NOT EXISTS "Qualquer um pode ver traduções de fundições publicadas"
  ON public.foundries_translations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.foundries f
      WHERE f.id = foundry_id
        AND f.status = 'published'::content_status
    )
  );

DROP TRIGGER IF EXISTS foundries_translations_set_updated_at ON public.foundries_translations;
CREATE TRIGGER foundries_translations_set_updated_at
BEFORE UPDATE ON public.foundries_translations
FOR EACH ROW
EXECUTE PROCEDURE public.update_updated_at_column();
