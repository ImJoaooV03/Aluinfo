
import { ExternalLink } from "lucide-react";
import { useBanners } from "@/hooks/useBanners";

interface AdBannerProps {
  size: "small" | "medium" | "large";
  position: "sidebar" | "content" | "header";
  spaceNumber?: number;
  className?: string;
}

const AdBanner = ({ size, position, spaceNumber, className = "" }: AdBannerProps) => {
  const { getBanner } = useBanners();
  
  const sizeClasses = {
    small: "h-[150px] w-full",
    medium: "h-[150px] w-full",
    large: "h-[150px] w-full"
  };

  const getPositionText = () => {
    if (spaceNumber) {
      return `Banner ${spaceNumber}`;
    }
    
    const baseText = {
      sidebar: "Espaço Publicitário",
      content: "Publicidade", 
      header: "Anúncio"
    };
    
    return baseText[position];
  };

  // Busca a imagem do banner se tiver spaceNumber
  const bannerData = spaceNumber ? getBanner(spaceNumber) : null;
  const bannerImage = bannerData?.imageUrl;

  return (
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
};

export default AdBanner;
