-- Create news bucket for storing news images
INSERT INTO storage.buckets (id, name, public) VALUES ('news', 'news', true);

-- Allow public read access to news images
CREATE POLICY "Public read access for news images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'news');

-- Allow admins to upload news images
CREATE POLICY "Admins can upload news images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'news' AND is_admin());

-- Allow admins to update news images
CREATE POLICY "Admins can update news images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'news' AND is_admin());

-- Allow admins to delete news images
CREATE POLICY "Admins can delete news images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'news' AND is_admin());