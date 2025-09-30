-- Criar bucket para imagens de notícias
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-images',
  'news-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir que usuários autenticados façam upload
CREATE POLICY "Authenticated users can upload news images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news-images');

-- Política para permitir que todos vejam as imagens (público)
CREATE POLICY "Anyone can view news images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'news-images');

-- Política para permitir que usuários autenticados atualizem suas imagens
CREATE POLICY "Authenticated users can update news images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'news-images')
WITH CHECK (bucket_id = 'news-images');

-- Política para permitir que usuários autenticados excluam suas imagens
CREATE POLICY "Authenticated users can delete news images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'news-images'); 