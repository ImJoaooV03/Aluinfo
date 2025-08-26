-- Enum para tipos de usuário
CREATE TYPE public.user_role AS ENUM ('admin', 'user');

-- Enum para status de conteúdo
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');

-- Enum para tipos de material técnico
CREATE TYPE public.material_type AS ENUM ('pdf', 'video', 'presentation', 'guide', 'manual');

-- Tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'user',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Tabela de categorias (para notícias, materiais, etc)
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de notícias
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url TEXT,
  author_id UUID REFERENCES public.profiles(user_id),
  category_id UUID REFERENCES public.categories(id),
  status content_status DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de fornecedores
CREATE TABLE public.suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  specialty TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Brasil',
  logo_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  employees_count INTEGER,
  category_id UUID REFERENCES public.categories(id),
  status content_status DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de fundições
CREATE TABLE public.foundries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  specialty TEXT,
  email TEXT,
  phone TEXT,
  website TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'Brasil',
  logo_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  employees_count INTEGER,
  category_id UUID REFERENCES public.categories(id),
  status content_status DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de materiais técnicos
CREATE TABLE public.technical_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size BIGINT,
  file_type material_type,
  download_count INTEGER DEFAULT 0,
  category_id UUID REFERENCES public.categories(id),
  author_id UUID REFERENCES public.profiles(user_id),
  status content_status DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de e-books
CREATE TABLE public.ebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  author TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  file_url TEXT NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  pages_count INTEGER,
  reading_time INTEGER, -- em minutos
  download_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  category_id UUID REFERENCES public.categories(id),
  status content_status DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de eventos
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  venue TEXT,
  website_url TEXT,
  registration_url TEXT,
  price DECIMAL(10,2),
  max_attendees INTEGER,
  category_id UUID REFERENCES public.categories(id),
  status content_status DEFAULT 'published',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de banners/publicidade
CREATE TABLE public.banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  description TEXT,
  position TEXT NOT NULL, -- 'header', 'sidebar', 'footer', 'content'
  is_active BOOLEAN DEFAULT true,
  click_count INTEGER DEFAULT 0,
  impression_count INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de indicadores LME (London Metal Exchange)
CREATE TABLE public.lme_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metal_name TEXT NOT NULL, -- 'Aluminum', 'Copper', 'Lead', etc.
  metal_symbol TEXT NOT NULL, -- 'ALU', 'CU', 'PB', etc.
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  unit TEXT DEFAULT 'tonne', -- 'tonne', 'pound', etc.
  change_amount DECIMAL(10,2),
  change_percent DECIMAL(5,2),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{}', -- preferências de categorias, frequência, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de analytics de visualizações
CREATE TABLE public.analytics_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL, -- 'news', 'material', 'ebook', 'supplier', etc.
  content_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de analytics de cliques em banners
CREATE TABLE public.analytics_banner_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_id UUID NOT NULL REFERENCES public.banners(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,
  referer TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technical_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lme_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_banner_clicks ENABLE ROW LEVEL SECURITY;

-- Função para verificar se usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins podem ver todos os perfis" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Políticas para conteúdo público (leitura)
CREATE POLICY "Qualquer um pode ver categorias" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Qualquer um pode ver notícias publicadas" ON public.news
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Qualquer um pode ver fornecedores publicados" ON public.suppliers
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Qualquer um pode ver fundições publicadas" ON public.foundries
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Qualquer um pode ver materiais técnicos publicados" ON public.technical_materials
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Qualquer um pode ver e-books publicados" ON public.ebooks
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Qualquer um pode ver eventos publicados" ON public.events
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Qualquer um pode ver banners ativos" ON public.banners
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Qualquer um pode ver indicadores LME" ON public.lme_indicators
  FOR SELECT USING (true);

-- Políticas para admins (escrita)
CREATE POLICY "Admins podem gerenciar categorias" ON public.categories
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins podem gerenciar notícias" ON public.news
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins podem gerenciar fornecedores" ON public.suppliers
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins podem gerenciar fundições" ON public.foundries
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins podem gerenciar materiais técnicos" ON public.technical_materials
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins podem gerenciar e-books" ON public.ebooks
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins podem gerenciar eventos" ON public.events
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins podem gerenciar banners" ON public.banners
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins podem gerenciar indicadores LME" ON public.lme_indicators
  FOR ALL USING (public.is_admin());

-- Políticas para newsletter
CREATE POLICY "Qualquer um pode se inscrever na newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários podem ver suas próprias inscrições" ON public.newsletter_subscribers
  FOR SELECT USING (true);

CREATE POLICY "Admins podem gerenciar newsletter" ON public.newsletter_subscribers
  FOR ALL USING (public.is_admin());

-- Políticas para analytics
CREATE POLICY "Qualquer um pode registrar visualizações" ON public.analytics_views
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Qualquer um pode registrar cliques em banners" ON public.analytics_banner_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins podem ver analytics" ON public.analytics_views
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins podem ver analytics de banners" ON public.analytics_banner_clicks
  FOR SELECT USING (public.is_admin());

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_foundries_updated_at
  BEFORE UPDATE ON public.foundries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_technical_materials_updated_at
  BEFORE UPDATE ON public.technical_materials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ebooks_updated_at
  BEFORE UPDATE ON public.ebooks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para incrementar view_count automaticamente
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
$$ LANGUAGE plpgsql;

-- Função para incrementar click_count de banners
CREATE OR REPLACE FUNCTION public.increment_banner_clicks()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.banners SET click_count = click_count + 1 WHERE id = NEW.banner_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para incrementar cliques em banners
CREATE TRIGGER increment_banner_clicks_trigger
  AFTER INSERT ON public.analytics_banner_clicks
  FOR EACH ROW EXECUTE FUNCTION public.increment_banner_clicks();

-- Função para criar perfil automaticamente quando usuário se registra
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Inserir categorias padrão
INSERT INTO public.categories (name, slug, description) VALUES
  ('Notícias Gerais', 'noticias-gerais', 'Notícias gerais do setor'),
  ('Mercado', 'mercado', 'Análises e tendências de mercado'),
  ('Tecnologia', 'tecnologia', 'Inovações e tecnologias'),
  ('Sustentabilidade', 'sustentabilidade', 'Práticas sustentáveis'),
  ('Fornecedores', 'fornecedores', 'Categoria para fornecedores'),
  ('Fundições', 'fundicoes', 'Categoria para fundições'),
  ('Materiais Técnicos', 'materiais-tecnicos', 'Documentos técnicos'),
  ('E-books', 'ebooks', 'Livros digitais'),
  ('Eventos', 'eventos', 'Eventos do setor');

-- Criar índices para performance
CREATE INDEX idx_news_published_at ON public.news(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_news_category ON public.news(category_id);
CREATE INDEX idx_suppliers_city_state ON public.suppliers(city, state);
CREATE INDEX idx_analytics_views_content ON public.analytics_views(content_type, content_id);
CREATE INDEX idx_analytics_views_date ON public.analytics_views(viewed_at DESC);
CREATE INDEX idx_lme_timestamp ON public.lme_indicators(timestamp DESC);
CREATE INDEX idx_banners_position_active ON public.banners(position, is_active);