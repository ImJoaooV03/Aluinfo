import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, User, Tag, Share2, Eye } from "lucide-react";
import DOMPurify from "dompurify";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import NewsCard from "@/components/NewsCard";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image_url: string | null;
  view_count: number | null;
  published_at: string | null;
  status: string;
  category_id: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

const NoticiaIndividual = () => {
  const { slug } = useParams();
  const [noticia, setNoticia] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const viewTrackedRef = useRef(false);

  useEffect(() => {
    const fetchNews = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        
        // Fetch the main news article by slug
        const { data: newsData, error: newsError } = await supabase
          .from('news')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();

        if (newsError || !newsData) {
          setNotFound(true);
          return;
        }

        setNoticia(newsData);

        // Track the view only once per page load
        if (!viewTrackedRef.current) {
          viewTrackedRef.current = true;
          try {
            await supabase
              .from('analytics_views')
              .insert({
                content_id: newsData.id,
                content_type: 'news',
                user_id: null, // Could be set if user is authenticated
                ip_address: null, // Could be captured if needed
                user_agent: navigator.userAgent,
                referer: document.referrer || null
              });
          } catch (viewError) {
            console.error('Error tracking view:', viewError);
            // Don't fail the whole page if view tracking fails
          }
        }

        // Fetch related news (exclude current article)
        const { data: relatedData } = await supabase
          .from('news')
          .select('*')
          .eq('status', 'published')
          .neq('id', newsData.id)
          .order('published_at', { ascending: false })
          .limit(3);

        setRelatedNews(relatedData || []);

      } catch (error) {
        console.error('Error fetching news:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [slug]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50">
          <Header />
          <Navigation />
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-12 bg-muted rounded w-3/4"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !noticia) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50">
          <Header />
          <Navigation />
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Notícia não encontrada</h1>
            <p className="text-muted-foreground mb-6">
              A notícia que você está procurando não existe ou foi removida.
            </p>
            <Link to="/noticias">
              <Button>Voltar para Notícias</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <Header />
        <Navigation />
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Conteúdo Principal */}
          <main className="flex-1">  
            {/* Banner 14 - Notícia Topo */}
            <AdBanner size="large" position="content" slotKey="noticia-top" className="mb-8" />
            
            {/* Breadcrumb */}
            <div className="mb-6">
              <Link 
                to="/noticias"
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Notícias
              </Link>
            </div>

            {/* Artigo */}
            <article className="space-y-6">
              {/* Cabeçalho do Artigo */}
              <header>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Tag className="h-3 w-3 mr-1" />
                    Notícia
                  </Badge>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{noticia.view_count || 0} visualizações</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Compartilhar
                    </Button>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-lead">
                  {noticia.title}
                </h1>

                {noticia.excerpt && (
                  <p className="text-lg text-muted-foreground mb-6">
                    {noticia.excerpt}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground border-b border-border pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Portal da Fundição</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(noticia.published_at || noticia.created_at)}</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Imagem Principal */}
              {noticia.featured_image_url && (
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img 
                    src={noticia.featured_image_url} 
                    alt={noticia.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Banner 15 - Notícia Meio */}
              <AdBanner size="medium" position="content" slotKey="noticia-middle" />

              {/* Conteúdo do Artigo */}
              <div 
                className="prose prose-lg max-w-none whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(noticia.content) }}
              />

              {/* Banner 16 - Notícia Final */}
              <AdBanner size="large" position="content" slotKey="noticia-bottom" />
            </article>

            {/* Notícias Relacionadas */}
            {relatedNews.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-lead">Outras Notícias</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedNews.map((news) => (
                    <NewsCard 
                      key={news.id}
                      title={news.title}
                      summary={news.excerpt || news.content.substring(0, 200) + '...'}
                      author="Portal da Fundição"
                      date={formatDate(news.published_at || news.created_at)}
                      category="Notícia"
                      image={news.featured_image_url || undefined}
                      slug={news.slug}
                    />
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NoticiaIndividual;