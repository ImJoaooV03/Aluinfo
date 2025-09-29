import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import Sidebar from "@/components/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";

const Eventos = () => {
  const { events, loading } = useEvents();

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
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <main className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 md:gap-6">
          <div className="flex-1">
            <AdBanner size="large" position="content" slotKey="eventos-top" className="mb-8" />
            <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Eventos</h1>
          <p className="text-muted-foreground">
            Descubra os próximos eventos do setor de fundição
          </p>
            </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum evento encontrado
            </h3>
            <p className="text-muted-foreground">
              Não há eventos programados no momento.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
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
                  <div className="mb-2">
                    <Badge variant="secondary">Evento</Badge>
                  </div>
                  <CardTitle className="line-clamp-2">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {event.description || 'Evento do setor de fundição'}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {event.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    )}
                    {event.venue && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        📍 {event.venue}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-muted-foreground min-w-0">
                      <Calendar className="h-4 w-4 mr-2 shrink-0" />
                      <span className="truncate">
                        {formatDate(event.start_date)}
                        {event.start_date !== event.end_date && (
                          <span className="ml-1">até {formatDate(event.end_date)}</span>
                        )}
                      </span>
                    </div>
                    {event.max_attendees && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        Máximo {event.max_attendees} participantes
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">
                      {formatPrice(event.price)}
                    </span>
                    {(event.registration_url || event.website_url) ? (
                      <Button size="sm" asChild>
                        <a 
                          href={event.registration_url || event.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          Saiba mais
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    ) : (
                      <Button size="sm" disabled>
                        Saiba mais
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
          </div>
          {/* Sidebar com prefixo específico para a página de eventos */}
          <Sidebar />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Eventos;