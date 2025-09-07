import React, { useRef, useCallback, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Digite o conteúdo da notícia..."
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const { toast } = useToast();

  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/png,image/jpg,image/jpeg,image/webp');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erro",
          description: "Imagem muito grande. Máximo permitido: 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!['image/png', 'image/jpg', 'image/jpeg', 'image/webp'].includes(file.type)) {
        toast({
          title: "Erro", 
          description: "Formato não suportado. Use PNG, JPG, JPEG ou WebP",
          variant: "destructive",
        });
        return;
      }

      try {
        // Create unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `news/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('news')
          .upload(filePath, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('news')
          .getPublicUrl(filePath);

        // Insert image into editor
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection();
          quill.insertEmbed(range?.index || 0, 'image', publicUrl);
        }

        toast({
          title: "Sucesso",
          description: "Imagem inserida com sucesso!",
        });

      } catch (error: any) {
        console.error('Error uploading image:', error);
        toast({
          title: "Erro",
          description: "Erro ao fazer upload da imagem",
          variant: "destructive",
        });
      }
    };
  }, [toast]);

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), [imageHandler]);

  const formats = useMemo(() => [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'align', 'link', 'image'
  ], []);

  const handleChange = useCallback((content: string) => {
    onChange(content || '');
  }, [onChange]);

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ minHeight: '200px' }}
      />
    </div>
  );
};