import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SupabaseBanner {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
  position: string;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
}

export const useSupabaseBanners = () => {
  const [banners, setBanners] = useState<SupabaseBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBanners(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar banners');
    } finally {
      setLoading(false);
    }
  };

  const getBannerBySlot = (slotKey: string): SupabaseBanner | null => {
    const now = new Date();
    
    const banner = banners.find(banner => {
      // Check if banner matches the slot
      if (banner.position !== slotKey) return false;
      
      // Check if banner is active
      if (!banner.is_active) return false;
      
      // Check date range if specified
      if (banner.start_date && new Date(banner.start_date) > now) return false;
      if (banner.end_date && new Date(banner.end_date) < now) return false;
      
      return true;
    });

    return banner || null;
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return {
    banners,
    loading,
    error,
    getBannerBySlot,
    refetch: fetchBanners
  };
};