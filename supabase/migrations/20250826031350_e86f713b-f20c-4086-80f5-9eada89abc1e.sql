-- Primeiro, vamos verificar se há constraint única no email
ALTER TABLE public.profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Inserir dados de exemplo nas categorias (se ainda não existem)
INSERT INTO public.categories (name, slug, description) VALUES
  ('Análises', 'analises', 'Análises de mercado'),
  ('Cotações', 'cotacoes', 'Cotações e preços'),
  ('Relatórios', 'relatorios', 'Relatórios técnicos')
ON CONFLICT (slug) DO NOTHING;

-- Inserir alguns indicadores LME de exemplo
INSERT INTO public.lme_indicators (metal_name, metal_symbol, price, currency, unit, change_amount, change_percent) VALUES
  ('Aluminium', 'ALU', 2450.50, BRL, 'tonne', 15.25, 0.63),
  ('Copper', 'CU', 8750.75, BRL, 'tonne', -42.50, -0.48),
  ('Lead', 'PB', 2125.00, BRL, 'tonne', 8.75, 0.41),
  ('Nickel', 'NI', 18500.25, BRL, 'tonne', 125.50, 0.68),
  ('Tin', 'SN', 32750.00, BRL, 'tonne', -225.75, -0.68),
  ('Zinc', 'ZN', 2875.50, BRL, 'tonne', 18.25, 0.64);