
import { ExternalLink } from "lucide-react";
import { useBanners } from "@/hooks/useBanners";
import { useSupabaseBanners } from "@/hooks/useSupabaseBanners";
import { getBannerSlotById } from "@/lib/bannerSlots";

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
      const slot = getBannerSlotById(parseInt(slotKey.split('-')[1]) || 0);
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
    <a href={bannerLink} target="_blank" rel="noopener noreferrer" className="block">
      <BannerContent />
    </a>
  ) : (
    <BannerContent />
  );
};

export default AdBanner;
