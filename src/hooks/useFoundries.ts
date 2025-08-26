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
  website: string | null;
  rating: number | null;
  employees_count: number | null;
  category_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  contact_info?: FoundryContactInfo;
}

export const useFoundries = () => {
  const [foundries, setFoundries] = useState<Foundry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFoundries = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch foundries data
      const { data: foundriesData, error: foundriesError } = await supabase
        .from('foundries')
        .select('*')
        .eq('status', 'published')
        .order('name');

      if (foundriesError) {
        throw foundriesError;
      }

      // Fetch contact info for each foundry
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

  useEffect(() => {
    fetchFoundries();
  }, []);

  return {
    foundries,
    loading,
    error,
    refetch: fetchFoundries,
  };
};