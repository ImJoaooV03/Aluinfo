
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  const [materials, setMaterials] = useState<TechnicalMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('technical_materials')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setMaterials(data || []);
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
  }, []);

  return {
    materials,
    loading,
    error,
    refetch: fetchMaterials
  };
};
