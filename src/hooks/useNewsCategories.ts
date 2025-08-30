
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export const useNewsCategories = () => {
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('news_categories')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;

      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching news categories:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    // Real-time updates
    const channel = supabase
      .channel('news_categories_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'news_categories'
        },
        () => {
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};
