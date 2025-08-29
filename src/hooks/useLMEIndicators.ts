
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LMEIndicator {
  id: string;
  metal_name: string;
  metal_symbol: string;
  price: number;
  currency: string | null;
  unit: string | null;
  change_amount: number | null;
  change_percent: number | null;
  timestamp: string | null;
  created_at: string;
}

export const useLMEIndicators = () => {
  const [indicators, setIndicators] = useState<LMEIndicator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIndicators = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('lme_indicators')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        throw error;
      }

      setIndicators(data || []);
    } catch (err) {
      console.error('Error fetching LME indicators:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar indicadores LME');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndicators();

    // Set up real-time subscription
    const channel = supabase
      .channel('lme-indicators-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lme_indicators'
        },
        (payload) => {
          console.log('LME indicators change detected:', payload);
          fetchIndicators();
        }
      )
      .subscribe();

    return () => {
      console.log('Removing realtime channel for LME indicators');
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    indicators,
    loading,
    error,
    refetch: fetchIndicators
  };
};
