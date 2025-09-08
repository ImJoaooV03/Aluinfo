
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
  const { i18n } = useTranslation();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentLang = i18n.language || 'pt';
      
      // Fetch suppliers with optional translations
      const { data, error } = await supabase
        .from('suppliers')
        .select(`
          *,
          suppliers_translations (
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
        filteredData = filteredData.filter(supplier => supplier.category_id === categoryId);
      }

      const suppliersWithTranslations = await Promise.all(
        filteredData.map(async (supplier: any) => {
          // Find translation for current language, fallback to Portuguese, then original
          const currentLangTranslation = supplier.suppliers_translations?.find((t: any) => t.lang === currentLang);
          const ptTranslation = supplier.suppliers_translations?.find((t: any) => t.lang === 'pt');
          const translation = currentLangTranslation || ptTranslation;
          
          // Fetch contact info for each supplier using the existing RPC function
          const { data: contactData } = await supabase.rpc(
            'get_supplier_contact_info',
            { supplier_id: supplier.id }
          );
          
          return {
            ...supplier,
            name: translation?.name || supplier.name,
            description: translation?.description || supplier.description,
            specialty: translation?.specialty || supplier.specialty,
            contact_info: contactData as unknown as SupplierContactInfo,
            // Remove translation array after merging
            suppliers_translations: undefined,
          };
        })
      );

      setSuppliers(suppliersWithTranslations);
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
