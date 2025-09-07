
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export interface SupplierCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export const useSupplierCategories = () => {
  const { i18n } = useTranslation();
  const [categories, setCategories] = useState<SupplierCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentLang = i18n.language || 'pt';
      
      const { data, error: fetchError } = await supabase
        .from('supplier_categories')
        .select(`
          *,
          supplier_categories_translations!inner (
            name,
            description
          )
        `)
        .eq('supplier_categories_translations.lang', currentLang)
        .order('name');

      if (fetchError) throw fetchError;

      // Merge base data with translations
      const categoriesWithTranslations = (data || []).map((category: any) => {
        const translation = category.supplier_categories_translations?.[0];
        
        return {
          ...category,
          name: translation?.name || category.name,
          description: translation?.description || category.description,
          // Remove translation array after merging
          supplier_categories_translations: undefined,
        };
      });

      setCategories(categoriesWithTranslations);
    } catch (err) {
      console.error('Error fetching supplier categories:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();

    // Real-time updates
    const channel = supabase
      .channel('supplier_categories_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'supplier_categories'
        },
        () => {
          fetchCategories();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [i18n.language]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};
