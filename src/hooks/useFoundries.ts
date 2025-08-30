
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [foundries, setFoundries] = useState<Foundry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFoundries = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is authenticated to determine access level
      const { data: { session } } = await supabase.auth.getSession();
      
      let foundriesData: any[] = [];
      
      if (session?.user) {
        // Authenticated users get full access including contact info
        let query = supabase
          .from('foundries')
          .select('id, name, slug, specialty, description, logo_url, country, state, city, address, website, rating, employees_count, category_id, status, created_at, updated_at, email, phone')
          .eq('status', 'published');

        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }

        const { data, error: foundriesError } = await query.order('name');
        if (foundriesError) throw foundriesError;
        foundriesData = data || [];
      } else {
        // Unauthenticated users get safe public data only
        const { data, error: foundriesError } = await supabase.rpc(
          'get_public_foundries',
          { category_filter: categoryId || null }
        );
        if (foundriesError) throw foundriesError;
        foundriesData = data || [];
      }

      // Fetch contact info for each foundry using the existing RPC function
      const foundriesWithContact = await Promise.all(
        (foundriesData || []).map(async (foundry) => {
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

      setFoundries(foundriesWithContact);
    } catch (err) {
      console.error('Error fetching foundries:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
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
  }, [categoryId]);

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
