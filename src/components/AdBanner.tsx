
import { ExternalLink } from "lucide-react";

interface AdBannerProps {
  size: "small" | "medium" | "large";
  position: "sidebar" | "content" | "header";
  className?: string;
}

const AdBanner = ({ size, position, className = "" }: AdBannerProps) => {
  const sizeClasses = {
    small: "h-24 w-full",
    medium: "h-32 w-full",
    large: "h-48 w-full"
  };

  const positionText = {
    sidebar: "Espaço Publicitário",
    content: "Publicidade",
    header: "Anúncio"
  };

  return (
    <div className={`banner-ad ${sizeClasses[size]} ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-2">
        <ExternalLink className="h-6 w-6 text-slate-400" />
        <span className="text-sm text-slate-500">{positionText[position]}</span>
        <span className="text-xs text-slate-400">
          {size === "small" ? "300x120" : size === "medium" ? "300x160" : "300x240"}
        </span>
      </div>
    </div>
  );
};

export default AdBanner;
