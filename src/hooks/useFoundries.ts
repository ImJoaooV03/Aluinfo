
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
  foundry_categories?: { name: string } | null;
  categories?: { category_id: string; name: string }[];
}

export const useFoundries = (categoryIds?: string | string[]) => {
  const { i18n } = useTranslation();
  const [foundries, setFoundries] = useState<Foundry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFoundries = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentLang = i18n.language || 'pt';
      
      // Buscar fundições com embed do nome da categoria
      const { data, error } = await supabase
        .from('foundries')
        .select(`
          *,
          foundry_categories:foundry_categories!foundries_category_id_fkey(name),
          categories:foundry_category_links(category_id, foundry_categories(name))
        `) 
        .eq('status', 'published')
        .order('name');

      if (error) {
        throw error;
      }

      // Filter by category if selected and merge translations
      let filteredData = data || [];
      const selected = Array.isArray(categoryIds) ? categoryIds.filter(Boolean) : (categoryIds ? [categoryIds] : []);
      if (selected.length === 1) {
        const id = selected[0];
        filteredData = filteredData.filter((foundry: any) => {
          const direct = foundry.category_id === id;
          const viaLinks = Array.isArray(foundry.categories) && foundry.categories.some((c: any) => c?.category_id === id);
          return direct || viaLinks;
        });
      } else if (selected.length > 1) {
        filteredData = filteredData.filter((foundry: any) => {
          const foundryCatIds = [
            ...(foundry.category_id ? [foundry.category_id] : []),
            ...((foundry.categories || []).map((c: any) => c?.category_id).filter(Boolean))
          ];
          // match se contém todas as selecionadas (AND)
          return selected.every((id) => foundryCatIds.includes(id));
        });
      }

      const foundriesWithContactInfo = await Promise.all(
        filteredData.map(async (foundry: any) => {
          // Fetch contact info for each foundry using the existing RPC function
          const { data: contactData } = await supabase.rpc(
            'get_foundry_contact_info',
            { foundry_id: foundry.id }
          );
          
          return {
            ...foundry,
            contact_info: contactData as unknown as FoundryContactInfo,
          };
        })
      );

      setFoundries(foundriesWithContactInfo);
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
      const { data, error: deleteError } = await supabase
        .from('foundries')
        .delete()
        .eq('id', id)
        .select('id');

      if (deleteError) throw deleteError;

      await fetchFoundries();
      return { error: null, deleted: Array.isArray(data) && data.length > 0 };
    } catch (err) {
      console.error('Error deleting foundry:', err);
      return { error: err instanceof Error ? err.message : 'An error occurred', deleted: false };
    }
  };

  useEffect(() => {
    fetchFoundries();
  }, [Array.isArray(categoryIds) ? categoryIds.join(',') : categoryIds, i18n.language]);

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
