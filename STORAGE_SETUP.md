# Configuração do Storage para Imagens de Notícias

Para que o upload de imagens funcione no painel administrativo, você precisa criar um bucket de storage no Supabase.

## Passos para configurar:

1. **Acesse o painel do Supabase**
   - Vá para https://app.supabase.com
   - Selecione seu projeto

2. **Navegue até Storage**
   - No menu lateral, clique em "Storage"
   - Clique em "New bucket"

3. **Crie o bucket `news-images`**
   - Nome do bucket: `news-images`
   - Marque a opção "Public bucket" (para que as imagens sejam acessíveis publicamente)
   - Clique em "Create bucket"

4. **Configure as políticas de acesso** (RLS Policies)
   
   Clique no bucket criado e vá em "Policies", depois clique em "New Policy":

   ### Política 1: Upload (INSERT)
   - Nome: `Authenticated users can upload news images`
   - Allowed operation: INSERT
   - Target roles: authenticated
   - WITH CHECK expression:
   ```sql
   bucket_id = 'news-images'
   ```

   ### Política 2: Visualização (SELECT)
   - Nome: `Anyone can view news images`
   - Allowed operation: SELECT
   - Target roles: public
   - USING expression:
   ```sql
   bucket_id = 'news-images'
   ```

   ### Política 3: Atualização (UPDATE)
   - Nome: `Authenticated users can update news images`
   - Allowed operation: UPDATE
   - Target roles: authenticated
   - USING expression:
   ```sql
   bucket_id = 'news-images'
   ```
   - WITH CHECK expression:
   ```sql
   bucket_id = 'news-images'
   ```

   ### Política 4: Exclusão (DELETE)
   - Nome: `Authenticated users can delete news images`
   - Allowed operation: DELETE
   - Target roles: authenticated
   - USING expression:
   ```sql
   bucket_id = 'news-images'
   ```

5. **Configure limites (opcional)**
   - Tamanho máximo: 5MB
   - Tipos permitidos: image/jpeg, image/jpg, image/png

## Alternativa: Executar SQL

Se preferir, você pode executar este SQL no SQL Editor do Supabase:

```sql
-- Criar bucket para imagens de notícias
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-images',
  'news-images',
  true,
  5242880, -- 5MB em bytes
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
```

## Testando

Após configurar o bucket:
1. Acesse o painel administrativo
2. Vá em "Gestão de Notícias"
3. Clique em "Nova Notícia"
4. Na seção "Imagens", arraste e solte uma imagem ou clique para selecionar
5. A imagem deve ser enviada e você verá um preview

Pronto! Agora o upload de imagens está funcionando. 🎉 