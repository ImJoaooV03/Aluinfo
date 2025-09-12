
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export interface FoundryCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export const useFoundryCategories = () => {
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState<FoundryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentLang = i18n.language || 'pt';
      
      const { data, error: fetchError } = await supabase
        .from('foundry_categories')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;

      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching foundry categories:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Omit<FoundryCategory, 'id' | 'created_at'>) => {
    try {
      const { data, error: createError } = await supabase
        .from('foundry_categories')
        .insert([categoryData])
        .select()
        .single();

      if (createError) throw createError;

      await fetchCategories();
      return { data, error: null };
    } catch (err) {
      console.error('Error creating foundry category:', err);
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateCategory = async (id: string, updates: Partial<Omit<FoundryCategory, 'id' | 'created_at'>>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('foundry_categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchCategories();
      return { data, error: null };
    } catch (err) {
      console.error('Error updating foundry category:', err);
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const linkCategories = async (foundryId: string, categoryIds: string[]) => {
    const unique = Array.from(new Set(categoryIds));
    await supabase.from('foundry_category_links').delete().eq('foundry_id', foundryId);
    if (unique.length) {
      const rows = unique.map((id) => ({ foundry_id: foundryId, category_id: id }));
      await supabase.from('foundry_category_links').insert(rows);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('foundry_categories')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchCategories();
      return { error: null };
    } catch (err) {
      console.error('Error deleting foundry category:', err);
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [i18n.language]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    linkCategories,
    updateCategory,
    deleteCategory,
  };
};
