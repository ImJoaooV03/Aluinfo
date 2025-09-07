
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export interface Ebook {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string | null;
  cover_image_url: string | null;
  file_url: string;
  price: number | null;
  pages_count: number | null;
  reading_time: number | null;
  download_count: number | null;
  rating: number | null;
  status: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useEbooks = () => {
  const { i18n } = useTranslation();
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEbooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentLang = i18n.language || 'pt';
      
      const { data, error } = await supabase
        .from('ebooks')
        .select(`
          *,
          ebooks_translations!inner (
            title,
            description
          )
        `)
        .eq('status', 'published')
        .eq('ebooks_translations.lang', currentLang)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Merge base data with translations
      const ebooksWithTranslations = (data || []).map((ebook: any) => {
        const translation = ebook.ebooks_translations?.[0];
        
        return {
          ...ebook,
          title: translation?.title || ebook.title,
          description: translation?.description || ebook.description,
          // Remove translation array after merging
          ebooks_translations: undefined,
        };
      });

      setEbooks(ebooksWithTranslations);
    } catch (err) {
      console.error('Error fetching ebooks:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar e-books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEbooks();

    // Set up real-time subscription
    const channel = supabase
      .channel('ebooks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ebooks'
        },
        (payload) => {
          console.log('Ebooks change detected:', payload);
          fetchEbooks();
        }
      )
      .subscribe();

    return () => {
      console.log('Removing realtime channel for ebooks');
      supabase.removeChannel(channel);
    };
  }, [i18n.language]);

  return {
    ebooks,
    loading,
    error,
    refetch: fetchEbooks
  };
};
