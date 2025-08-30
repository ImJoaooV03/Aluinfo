import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SupplierContactInfo {
  email: string;
  phone: string;
  masked: boolean;
}

export interface Supplier {
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
  contact_info?: SupplierContactInfo;
}

export const useSuppliers = (categoryId?: string) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch suppliers data WITHOUT sensitive contact information
      let query = supabase
        .from('suppliers')
        .select('id, name, slug, specialty, description, logo_url, country, state, city, website, rating, employees_count, category_id, status, created_at, updated_at')
        .eq('status', 'published');

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data: suppliersData, error: suppliersError } = await query.order('name');

      if (suppliersError) {
        throw suppliersError;
      }

      // Fetch contact info for each supplier
      const suppliersWithContact = await Promise.all(
        (suppliersData || []).map(async (supplier) => {
          const { data: contactData } = await supabase.rpc(
            'get_supplier_contact_info',
            { supplier_id: supplier.id }
          );

          return {
            ...supplier,
            contact_info: contactData as unknown as SupplierContactInfo,
          };
        })
      );

      setSuppliers(suppliersWithContact);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [categoryId]);

  return {
    suppliers,
    loading,
    error,
    refetch: fetchSuppliers,
  };
};