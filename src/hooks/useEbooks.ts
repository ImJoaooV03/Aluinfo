
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEbooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setEbooks(data || []);
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
  }, []);

  return {
    ebooks,
    loading,
    error,
    refetch: fetchEbooks
  };
};
