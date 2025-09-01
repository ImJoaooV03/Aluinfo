
import { Clock, User, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface NewsCardProps {
  title: string;
  summary: string;
  author: string;
  date: string;
  category: string;
  image?: string;
  featured?: boolean;
  slug?: string;
  newsId?: string;
}

const NewsCard = ({ 
  title, 
  summary, 
  author, 
  date, 
  category, 
  image,
  featured = false,
  slug,
  newsId
}: NewsCardProps) => {
  // Create link based on slug or ID
  const linkTo = slug ? `/noticias/${slug}` : `/noticias/${newsId || '1'}`;

  return (
    <Link to={linkTo} className="block">
      <Card className={`hover:shadow-lg transition-shadow duration-300 ${featured ? 'border-primary' : ''}`}>
      <CardContent className="p-0">
        {image && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Tag className="h-3 w-3 mr-1" />
              {category}
            </Badge>
            {featured && (
              <Badge variant="default" className="bg-primary">
                Destaque
              </Badge>
            )}
          </div>

          <h3 className={`font-bold mb-2 line-clamp-2 ${featured ? 'text-lg' : 'text-base'}`}>
            {title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
            {summary}
          </p>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <User className="h-3 w-3" />
              <span>{author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{date}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};

export default NewsCard;
