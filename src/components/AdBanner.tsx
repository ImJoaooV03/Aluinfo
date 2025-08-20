
import { ExternalLink } from "lucide-react";

interface AdBannerProps {
  size: "small" | "medium" | "large";
  position: "sidebar" | "content" | "header";
  spaceNumber?: number;
  className?: string;
}

const AdBanner = ({ size, position, spaceNumber, className = "" }: AdBannerProps) => {
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

  return (
    <div className={`banner-ad ${sizeClasses[size]} ${className} relative overflow-hidden rounded-lg border`}>
      <img 
        src="/lovable-uploads/3c7eb808-83a8-4f8b-b8af-52fff0a008ef.png" 
        alt="ChemTrend - Release Agent Products"
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 right-2 bg-black/50 rounded px-2 py-1">
        <span className="text-xs text-white">{getPositionText()}</span>
      </div>
    </div>
  );
};

export default AdBanner;
