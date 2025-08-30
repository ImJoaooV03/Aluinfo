
-- 1) Tabela de categorias de fundições
CREATE TABLE IF NOT EXISTS public.foundry_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Garantir unicidade básica
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_constraint
    WHERE  conname = 'foundry_categories_slug_unique'
  ) THEN
    ALTER TABLE public.foundry_categories
      ADD CONSTRAINT foundry_categories_slug_unique UNIQUE (slug);
  END IF;
END$$;

-- 2) RLS e políticas
ALTER TABLE public.foundry_categories ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'foundry_categories'
      AND policyname = 'Qualquer um pode ver categorias de fundições'
  ) THEN
    CREATE POLICY "Qualquer um pode ver categorias de fundições"
      ON public.foundry_categories
      FOR SELECT
      USING (true);
  END IF;
END$$;

-- Admins podem gerenciar
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'foundry_categories'
      AND policyname = 'Admins podem gerenciar categorias de fundições'
  ) THEN
    CREATE POLICY "Admins podem gerenciar categorias de fundições"
      ON public.foundry_categories
      FOR ALL
      USING (is_admin());
  END IF;
END$$;

-- 3) Popular categorias iniciais copiando da tabela categories, preservando IDs
INSERT INTO public.foundry_categories (id, name, slug, description, created_at)
SELECT c.id, c.name, c.slug, c.description, COALESCE(c.created_at, now())
FROM public.categories c
ON CONFLICT (id) DO NOTHING;

-- 4) Ajustar a FK em foundries.category_id para apontar para foundry_categories
DO $$
BEGIN
  -- Remover constraint antiga se existir (nome comum)
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'foundries_category_id_fkey'
  ) THEN
    ALTER TABLE public.foundries DROP CONSTRAINT foundries_category_id_fkey;
  END IF;
END$$;

ALTER TABLE public.foundries
  ADD CONSTRAINT foundries_category_id_fkey
  FOREIGN KEY (category_id)
  REFERENCES public.foundry_categories(id)
  ON UPDATE CASCADE
  ON DELETE SET NULL;
