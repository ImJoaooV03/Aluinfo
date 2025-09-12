
import { ExternalLink } from "lucide-react";
import { useBanners } from "@/hooks/useBanners";
import { useEffect, useRef } from "react";
import { useSupabaseBanners } from "@/hooks/useSupabaseBanners";
import { supabase } from "@/integrations/supabase/client";
import { getBannerSlotByKey } from "@/lib/bannerSlots";

interface AdBannerProps {
  size: "small" | "medium" | "large";
  position: "sidebar" | "content" | "header";
  spaceNumber?: number;
  slotKey?: string;
  className?: string;
}

const AdBanner = ({ size, position, spaceNumber, slotKey, className = "" }: AdBannerProps) => {
  const { getBanner } = useBanners();
  const { getBannerBySlot } = useSupabaseBanners();
  
  const sizeClasses = {
    small: "h-[150px] w-full",
    medium: "h-[150px] w-full",
    large: "h-[150px] w-full"
  };

  const getPositionText = () => {
    // If slotKey is provided, get banner slot info
    if (slotKey) {
      const slot = getBannerSlotByKey(slotKey);
      return slot ? slot.label : slotKey;
    }

    if (spaceNumber) {
      // Para banners grandes (5-10), usar numeração sequencial começando em 1
      if (spaceNumber > 4) {
        return `Banner Grande ${spaceNumber - 4}`;
      }
      // Para banners regulares (1-4)
      return `Banner ${spaceNumber}`;
    }
    
    const baseText = {
      sidebar: "Espaço Publicitário",
      content: "Publicidade", 
      header: "Anúncio"
    };
    
    return baseText[position];
  };

  // Get banner from Supabase if slotKey is provided, otherwise fallback to local storage
  const supabaseBanner = slotKey ? getBannerBySlot(slotKey) : null;
  const localBanner = spaceNumber ? getBanner(spaceNumber) : null;
  
  // Priority: Supabase banner > Local banner
  const bannerImage = supabaseBanner?.image_url || localBanner?.imageUrl;
  const bannerLink = supabaseBanner?.link_url;

  // Impression tracking (once per mount)
  const impressionTracked = useRef(false);
  useEffect(() => {
    const registerImpression = async () => {
      try {
        if (impressionTracked.current) return;
        if (!supabaseBanner?.id) return;
        impressionTracked.current = true;
        await supabase.from('analytics_views').insert({
          content_id: supabaseBanner.id,
          content_type: 'banner',
          user_id: null,
          ip_address: null,
          user_agent: navigator.userAgent,
          referer: document.referrer || null,
        });
      } catch (e) {
        console.error('Erro ao registrar impressão do banner:', e);
      }
    };
    registerImpression();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabaseBanner?.id]);

  const trackClick = async (bannerId: string | undefined) => {
    try {
      if (!bannerId) return;
      await supabase.from('analytics_banner_clicks').insert({
        banner_id: bannerId,
        user_id: null,
        ip_address: null,
        user_agent: navigator.userAgent,
        referer: document.referrer || null,
      });
    } catch (e) {
      // não bloquear navegação em caso de erro
      console.error('Erro ao registrar clique no banner:', e);
    }
  };

  const BannerContent = () => (
    <div className={`banner-ad ${sizeClasses[size]} ${className} relative overflow-hidden rounded-lg border`}>
      {bannerImage ? (
        <>
          <img 
            src={bannerImage} 
            alt={`${getPositionText()}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-black/50 rounded px-2 py-1">
            <span className="text-xs text-white">{getPositionText()}</span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-1 h-full">
          <ExternalLink className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">{getPositionText()}</span>
          <span className="text-xs text-muted-foreground/70">300x150</span>
        </div>
      )}
    </div>
  );

  return bannerLink ? (
    <a
      href={bannerLink}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      onClick={() => trackClick(supabaseBanner?.id)}
    >
      <BannerContent />
    </a>
  ) : (
    <BannerContent />
  );
};

export default AdBanner;
