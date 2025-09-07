
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export interface News {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  view_count: number | null;
  published_at: string | null;
  status: string;
  category_id: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
  news_categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export const useNews = () => {
  const { i18n } = useTranslation();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentLang = i18n.language || 'pt';
      
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          news_categories(
            id,
            name,
            slug
          )
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        throw error;
      }

      // TODO: Fetch translations once types are updated
      // For now, return original content
      setNews(data || []);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar notícias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    // Set up real-time subscription
    const channel = supabase
      .channel('news-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news'
        },
        (payload) => {
          console.log('News change detected:', payload);
          fetchNews();
        }
      )
      .subscribe();

    return () => {
      console.log('Removing realtime channel for news');
      supabase.removeChannel(channel);
    };
  }, [i18n.language]);

  return {
    news,
    loading,
    error,
    refetch: fetchNews
  };
};
