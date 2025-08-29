
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
}

export const useNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) {
        throw error;
      }

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
  }, []);

  return {
    news,
    loading,
    error,
    refetch: fetchNews
  };
};
