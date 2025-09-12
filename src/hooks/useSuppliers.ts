
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

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
  address: string | null;
  website: string | null;
  rating: number | null;
  employees_count: number | null;
  category_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  contact_info?: SupplierContactInfo;
  supplier_categories?: { name: string } | null;
  categories?: { category_id: string; name: string }[];
}

export const useSuppliers = (categoryId?: string) => {
  const { i18n } = useTranslation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentLang = i18n.language || 'pt';
      
      // Fetch suppliers without translations
      // Primeira tentativa: com relação N:N
      let data: any[] | null = null;
      try {
        const withLinks = await supabase
          .from('suppliers')
          .select(`
            id, name, slug, specialty, description, logo_url, country, state, city, address, website, rating, employees_count, category_id, status, created_at, updated_at,
            supplier_categories!suppliers_category_id_fkey(name),
            categories:supplier_category_links(
              category_id,
              supplier_categories(name)
            )
          `)
          .eq('status', 'published')
          .order('name');
        if (withLinks.error) throw withLinks.error;
        data = withLinks.data as any[];
      } catch (e) {
        // Fallback: sem a relação N:N (caso a tabela não exista ainda)
        const fallback = await supabase
          .from('suppliers')
          .select(`id, name, slug, specialty, description, logo_url, country, state, city, address, website, rating, employees_count, category_id, status, created_at, updated_at, supplier_categories!suppliers_category_id_fkey(name)`) 
          .eq('status', 'published')
          .order('name');
        if (fallback.error) throw fallback.error;
        data = fallback.data as any[];
      }

      // Filter by category if selected and merge translations
      let filteredData = data || [];
      if (categoryId) {
        filteredData = filteredData.filter(supplier => {
          if (supplier.category_id === categoryId) return true;
          const links = (supplier as any).categories as any[] | undefined;
          return links?.some((l) => l?.category_id === categoryId);
        });
      }

      const suppliersWithContactInfo = await Promise.all(
        filteredData.map(async (supplier: any) => {
          // Fetch contact info for each supplier using the existing RPC function
          const { data: contactData } = await supabase.rpc(
            'get_supplier_contact_info',
            { supplier_id: supplier.id }
          );
          
          const categories = ((supplier as any).categories || []).map((c: any) => ({
            category_id: c?.category_id,
            name: c?.supplier_categories?.name,
          }));
          return {
            ...supplier,
            contact_info: contactData as unknown as SupplierContactInfo,
            categories,
          };
        })
      );

      setSuppliers(suppliersWithContactInfo);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [categoryId, i18n.language]);

  return {
    suppliers,
    loading,
    error,
    refetch: fetchSuppliers,
  };
};
