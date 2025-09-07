
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

export interface TechnicalMaterial {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  download_count: number | null;
  status: string;
  author_id: string | null;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export const useTechnicalMaterials = () => {
  const { i18n } = useTranslation();
  const [materials, setMaterials] = useState<TechnicalMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentLang = i18n.language || 'pt';
      
      const { data, error } = await supabase
        .from('technical_materials')
        .select(`
          *,
          technical_materials_translations!inner (
            title,
            description
          )
        `)
        .eq('status', 'published')
        .eq('technical_materials_translations.lang', currentLang)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Merge base data with translations
      const materialsWithTranslations = (data || []).map((material: any) => {
        const translation = material.technical_materials_translations?.[0];
        
        return {
          ...material,
          title: translation?.title || material.title,
          description: translation?.description || material.description,
          // Remove translation array after merging
          technical_materials_translations: undefined,
        };
      });

      setMaterials(materialsWithTranslations);
    } catch (err) {
      console.error('Error fetching technical materials:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar materiais técnicos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();

    // Set up real-time subscription para atualizações de download_count
    const channel = supabase
      .channel('technical-materials-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'technical_materials'
        },
        (payload) => {
          console.log('Technical materials change detected:', payload);
          // Para updates, apenas atualize o material específico se possível
          if (payload.eventType === 'UPDATE' && payload.new) {
            setMaterials(prev => prev.map(material => 
              material.id === payload.new.id 
                ? { ...material, download_count: payload.new.download_count }
                : material
            ));
          } else {
            // Para outros eventos, refetch todos os dados
            fetchMaterials();
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Removing realtime channel for technical materials');
      supabase.removeChannel(channel);
    };
  }, [i18n.language]);

  return {
    materials,
    loading,
    error,
    refetch: fetchMaterials
  };
};
