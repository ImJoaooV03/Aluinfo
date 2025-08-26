-- Insert sample foundries data to test the security implementation
INSERT INTO foundries (name, slug, specialty, description, email, phone, website, city, state, country, rating, employees_count, status)
VALUES 
  ('Fundição São Paulo', 'fundicao-sao-paulo', 'Ferro Fundido e Aço', 'Uma das maiores fundições do país, especializada em peças de ferro fundido e aço para indústria automotiva e agrícola.', 'comercial@fundicaosp.com.br', '(11) 3456-7890', 'www.fundicaosp.com.br', 'São Paulo', 'SP', 'Brasil', 4.7, 250, 'published'),
  ('Alumínio Premium', 'aluminio-premium', 'Fundição de Alumínio', 'Especializada em fundição de alumínio sob pressão e gravidade, atendendo setores automotivo e aeroespacial.', 'vendas@aluminiopremium.com.br', '(47) 3456-7890', 'www.aluminiopremium.com.br', 'Joinville', 'SC', 'Brasil', 4.9, 180, 'published'),
  ('Bronze & Latão Industrial', 'bronze-latao-industrial', 'Ligas de Cobre', 'Fundição especializada em bronze, latão e outras ligas de cobre para aplicações navais e industriais.', 'contato@bronzelatao.com.br', '(21) 2345-6789', 'www.bronzelatao.com.br', 'Rio de Janeiro', 'RJ', 'Brasil', 4.5, 120, 'published')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample suppliers data to test the security implementation  
INSERT INTO suppliers (name, slug, specialty, description, email, phone, website, city, state, country, rating, employees_count, status)
VALUES
  ('MetalTech Indústria', 'metaltech-industria', 'Equipamentos para Fundição', 'Fabricante líder em equipamentos e máquinas para fundição, com mais de 30 anos de experiência no mercado.', 'contato@metaltech.com.br', '(11) 3456-7890', 'www.metaltech.com.br', 'São Paulo', 'SP', 'Brasil', 4.8, 350, 'published'),
  ('Ligas & Materiais Ltda', 'ligas-materiais', 'Ligas Metálicas Especiais', 'Especializada na produção e fornecimento de ligas metálicas de alta qualidade para diversas aplicações industriais.', 'vendas@ligasmateriais.com.br', '(31) 2345-6789', 'www.ligasmateriais.com.br', 'Belo Horizonte', 'MG', 'Brasil', 4.6, 150, 'published'),
  ('Precision Tools Co.', 'precision-tools', 'Ferramentas de Precisão', 'Fornecedor de ferramentas e instrumentos de precisão para controle de qualidade em processos de fundição.', 'info@precisiontools.com.br', '(51) 3456-7890', 'www.precisiontools.com.br', 'Porto Alegre', 'RS', 'Brasil', 4.9, 80, 'published')
ON CONFLICT (slug) DO NOTHING;