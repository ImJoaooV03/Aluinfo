
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export interface FoundryContactInfo {
  email: string;
  phone: string;
  masked: boolean;
}

export interface Foundry {
  id: string;
  name: string;
  slug: string;
  specialty: string | null;
  description: string | null;
  logo_url: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  rating: number | null;
  employees_count: number | null;
  category_id: string | null;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  contact_info?: FoundryContactInfo;
}

export const useFoundries = (categoryId?: string) => {
  const { i18n } = useTranslation();
  const [foundries, setFoundries] = useState<Foundry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFoundries = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentLang = i18n.language || 'pt';
      
      // Fetch foundries with optional translations
      const { data, error } = await supabase
        .from('foundries')
        .select(`
          *,
          foundries_translations (
            name,
            description,
            specialty
          )
        `)
        .eq('status', 'published')
        .order('name');

      if (error) {
        throw error;
      }

      // Filter by category if selected and merge translations
      let filteredData = data || [];
      if (categoryId) {
        filteredData = filteredData.filter(foundry => foundry.category_id === categoryId);
      }

      const foundriesWithTranslations = await Promise.all(
        filteredData.map(async (foundry: any) => {
          // Find translation for current language, fallback to Portuguese, then original
          const currentLangTranslation = foundry.foundries_translations?.find((t: any) => t.lang === currentLang);
          const ptTranslation = foundry.foundries_translations?.find((t: any) => t.lang === 'pt');
          const translation = currentLangTranslation || ptTranslation;
          
          // Fetch contact info for each foundry using the existing RPC function
          const { data: contactData } = await supabase.rpc(
            'get_foundry_contact_info',
            { foundry_id: foundry.id }
          );
          
          return {
            ...foundry,
            name: translation?.name || foundry.name,
            description: translation?.description || foundry.description,
            specialty: translation?.specialty || foundry.specialty,
            contact_info: contactData as unknown as FoundryContactInfo,
            // Remove translation array after merging
            foundries_translations: undefined,
          };
        })
      );

      setFoundries(foundriesWithTranslations);
    } catch (err) {
      console.error('Error fetching foundries:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar fundições');
    } finally {
      setLoading(false);
    }
  };

  const createFoundry = async (foundryData: Omit<Foundry, 'id' | 'created_at' | 'updated_at' | 'contact_info'>) => {
    try {
      const { data, error: createError } = await supabase
        .from('foundries')
        .insert([foundryData])
        .select()
        .single();

      if (createError) throw createError;

      await fetchFoundries();
      return { data, error: null };
    } catch (err) {
      console.error('Error creating foundry:', err);
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const updateFoundry = async (id: string, updates: Partial<Omit<Foundry, 'id' | 'created_at' | 'updated_at' | 'contact_info'>>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('foundries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchFoundries();
      return { data, error: null };
    } catch (err) {
      console.error('Error updating foundry:', err);
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  const deleteFoundry = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('foundries')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await fetchFoundries();
      return { error: null };
    } catch (err) {
      console.error('Error deleting foundry:', err);
      return { error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  useEffect(() => {
    fetchFoundries();
  }, [categoryId, i18n.language]);

  return {
    foundries,
    loading,
    error,
    refetch: fetchFoundries,
    createFoundry,
    updateFoundry,
    deleteFoundry,
  };
};
