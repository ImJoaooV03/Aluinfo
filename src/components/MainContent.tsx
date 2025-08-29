
import { Wrench, TrendingUp, Calendar, BookOpen, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/NewsCard";
import AdBanner from "@/components/AdBanner";
import { Link } from "react-router-dom";
import { useNews } from "@/hooks/useNews";
import { useTechnicalMaterials } from "@/hooks/useTechnicalMaterials";
import { useEbooks } from "@/hooks/useEbooks";
import { useEvents } from "@/hooks/useEvents";
import { useLMEIndicators } from "@/hooks/useLMEIndicators";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const MainContent = () => {
  const { news, loading: newsLoading } = useNews();
  const { materials, loading: materialsLoading } = useTechnicalMaterials();
  const { ebooks, loading: ebooksLoading } = useEbooks();
  const { events, loading: eventsLoading } = useEvents();
  const { indicators, loading: indicatorsLoading } = useLMEIndicators();

  // Get latest items for each section
  const latestNews = news.slice(0, 4);
  const latestMaterials = materials.slice(0, 3);
  const latestEbooks = ebooks.slice(0, 3);
  const upcomingEvents = events.slice(0, 3);
  const latestIndicators = indicators.slice(0, 6);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price || price === 0) return "Gratuito";
    return `R$ ${price.toFixed(2)}`;
  };

  return (
    <div className="space-y-12">
      {/* Banner 1 - Home Topo */}
      <AdBanner size="large" position="content" slotKey="home-top" />

      {/* Seção de Notícias */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Últimas Notícias</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/noticias">Ver todas</Link>
          </Button>
        </div>

        {newsLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {latestNews.map((item, index) => (
              <NewsCard
                key={item.id}
                title={item.title}
                summary={item.excerpt || item.content.substring(0, 200) + '...'}
                author="Portal da Fundição"
                date={formatDate(item.published_at || item.created_at)}
                category="Notícias"
                image={item.featured_image_url || undefined}
                featured={index === 0}
                newsId={item.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Banner 2 - Home Meio */}
      <AdBanner size="medium" position="content" slotKey="home-middle" />

      {/* Seção de Materiais Técnicos */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Wrench className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Materiais Técnicos</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/materiais-tecnicos">Ver todos</Link>
          </Button>
        </div>

        {materialsLoading ? (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
            {latestMaterials.map((material) => (
              <Card key={material.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{material.file_type || 'PDF'}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {material.download_count || 0} downloads
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 text-base">
                    {material.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {material.description || 'Material técnico disponível para download'}
                  </p>
                  <Button size="sm" className="w-full">
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Seção de E-books */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">E-books</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/ebooks">Ver todos</Link>
          </Button>
        </div>

        {ebooksLoading ? (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-56 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
            {latestEbooks.map((ebook) => (
              <Card key={ebook.id} className="hover:shadow-lg transition-shadow">
                {ebook.cover_image_url && (
                  <div className="aspect-video bg-muted">
                    <img 
                      src={ebook.cover_image_url} 
                      alt={ebook.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">E-book</Badge>
                    <span className="text-sm font-medium text-primary">
                      {formatPrice(ebook.price)}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2 text-base">
                    {ebook.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    por {ebook.author}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {ebook.description || 'E-book disponível para download'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    {ebook.pages_count && <span>{ebook.pages_count} páginas</span>}
                    {ebook.download_count && <span>{ebook.download_count} downloads</span>}
                  </div>
                  <Button size="sm" className="w-full">
                    {ebook.price && ebook.price > 0 ? 'Comprar' : 'Download'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Banner 3 - Home Inferior */}
      <AdBanner size="large" position="content" slotKey="home-bottom" />

      {/* Seção de Eventos */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Próximos Eventos</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/eventos">Ver todos</Link>
          </Button>
        </div>

        {eventsLoading ? (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                {event.image_url && (
                  <div className="aspect-video bg-muted">
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">Evento</Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(event.event_date)}
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 text-base">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {event.description || 'Evento do setor de fundição'}
                  </p>
                  {event.location && (
                    <p className="text-xs text-muted-foreground mb-3">
                      📍 {event.location}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    {event.price && (
                      <span className="text-sm font-medium text-primary">
                        {formatPrice(event.price)}
                      </span>
                    )}
                    <Button size="sm" className="ml-auto">
                      Saiba mais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Seção de Indicadores LME */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Indicadores LME</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/lme">Ver todos</Link>
          </Button>
        </div>

        {indicatorsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {latestIndicators.map((indicator) => (
              <Card key={indicator.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {indicator.metal_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {indicator.metal_symbol}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">
                        ${indicator.price.toFixed(2)}
                      </p>
                      {indicator.change_percent && (
                        <p className={`text-sm ${
                          indicator.change_percent >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {indicator.change_percent >= 0 ? '+' : ''}{indicator.change_percent.toFixed(2)}%
                        </p>
                      )}
                    </div>
                  </div>
                  {indicator.timestamp && (
                    <div className="flex items-center text-xs text-muted-foreground mt-2">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(indicator.timestamp)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MainContent;
