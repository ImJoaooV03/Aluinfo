
import { ExternalLink } from "lucide-react";

interface AdBannerProps {
  size: "small" | "medium" | "large";
  position: "sidebar" | "content" | "header";
  className?: string;
}

const AdBanner = ({ size, position, className = "" }: AdBannerProps) => {
  const sizeClasses = {
    small: "h-[150px] w-full",
    medium: "h-[150px] w-full",
    large: "h-[150px] w-full"
  };

  const positionText = {
    sidebar: "Espaço Publicitário",
    content: "Publicidade",
    header: "Anúncio"
  };

  return (
    <div className={`banner-ad ${sizeClasses[size]} ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-1">
        <ExternalLink className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">{positionText[position]}</span>
        <span className="text-xs text-muted-foreground/70">
          {size === "small" ? "300x150" : size === "medium" ? "300x150" : "300x150"}
        </span>
      </div>
    </div>
  );
};

export default AdBanner;
