import { useState, useEffect } from 'react';

export interface BannerData {
  id: number;
  imageUrl: string | null;
  title: string;
}

const STORAGE_KEY = 'aluinfo-banners';

const defaultBanners: BannerData[] = [
  { id: 1, imageUrl: '/lovable-uploads/3c7eb808-83a8-4f8b-b8af-52fff0a008ef.png', title: 'Banner 1' },
  { id: 2, imageUrl: null, title: 'Banner 2' },
  { id: 3, imageUrl: null, title: 'Banner 3' },
  { id: 4, imageUrl: null, title: 'Banner 4' },
];

export const useBanners = () => {
  const [banners, setBanners] = useState<BannerData[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultBanners;
    } catch {
      return defaultBanners;
    }
  });

  const updateBanner = (id: number, imageUrl: string | null) => {
    setBanners(prev => {
      const updated = prev.map(banner => 
        banner.id === id ? { ...banner, imageUrl } : banner
      );
      
      // Salva no localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Erro ao salvar banners:', error);
      }
      
      return updated;
    });
  };

  const getBanner = (id: number) => {
    return banners.find(banner => banner.id === id);
  };

  const resetBanners = () => {
    setBanners(defaultBanners);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBanners));
    } catch (error) {
      console.error('Erro ao resetar banners:', error);
    }
  };

  return {
    banners,
    updateBanner,
    getBanner,
    resetBanners
  };
};