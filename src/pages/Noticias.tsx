import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, Search as SearchIcon, Tag } from "lucide-react";
import { useUniversalSearch } from "@/hooks/useUniversalSearch";
import { useNews } from "@/hooks/useNews";
import { useNewsCategories } from "@/hooks/useNewsCategories";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLanguageUtils, pathWithLang } from "@/utils/i18nUtils";

const Noticias = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { currentLanguage } = useLanguageUtils();

  const { results: searchResults, loading: searchLoading } = useUniversalSearch(searchTerm || '');
  const { news, loading: newsLoading } = useNews();
  const { categories } = useNewsCategories();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM, yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getIconByType = (tipo: string) => {
    switch (tipo) {
      case 'Notícia': return <Clock className="h-4 w-4" />;
      case 'Material Técnico': return <Clock className="h-4 w-4" />;
      case 'E-book': return <Clock className="h-4 w-4" />;
      case 'Evento': return <Clock className="h-4 w-4" />;
      case 'Fornecedor': return <Clock className="h-4 w-4" />;
      case 'Fundição': return <Clock className="h-4 w-4" />;
      default: return <SearchIcon className="h-4 w-4" />;
    }
  };

  // Se há termo de busca, mostrar página de resultados
  if (searchTerm) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-6">
            <main className="flex-1">
              {/* Banner 17 - Notícias Topo */}
              <AdBanner size="large" position="content" slotKey="noticias-top" className="mb-8" />
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <SearchIcon className="h-6 w-6 text-primary" />
                  <h1 className="text-4xl font-bold text-foreground">Resultados da Pesquisa</h1>
                </div>
                <p className="text-muted-foreground text-lg mb-2">
                  Resultados para: <span className="font-semibold text-primary">"{searchTerm}"</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                </p>
              </div>

              {searchLoading ? (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                  {searchResults.map((result, index) => (
                    <Card key={`${result.type}-${result.id}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {result.image && (
                        <div className="aspect-video bg-muted">
                          <img 
                            src={result.image} 
                            alt={result.title || result.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getIconByType(result.type)}
                            <Badge variant="secondary">{result.type}</Badge>
                          </div>
                          {result.category && <Badge variant="outline">{result.category}</Badge>}
                        </div>
                        <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer">
                          {result.title || result.name}
                        </CardTitle>
                        {result.author && (
                          <p className="text-sm text-muted-foreground">por {result.author}</p>
                        )}
                        {result.specialty && (
                          <p className="text-sm text-primary font-medium">{result.specialty}</p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {result.summary}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          {result.date && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(result.date)}</span>
                            </div>
                          )}
                          {result.author && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{result.author}</span>
                            </div>
                          )}
                          {result.downloads && (
                            <span>{result.downloads} downloads</span>
                          )}
                          {result.price && (
                            <span className="font-medium">{result.price}</span>
                          )}
                          {result.location && (
                            <span>{result.location}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-muted-foreground mb-6">
                    Não encontramos resultados para "{searchTerm}". Tente usar termos diferentes ou mais gerais.
                  </p>
                  <Link to={pathWithLang('noticias', currentLanguage)}>
                    <Button variant="outline">
                      Voltar
                    </Button>
                  </Link>
                </div>
              )}
            </main>

            <Sidebar />
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // Página normal de notícias
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <main className="flex-1">
            {/* Banner 17 - Notícias Topo */}
            <AdBanner size="large" position="content" slotKey="noticias-top" className="mb-8" />
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Notícias</h1>
              <p className="text-muted-foreground text-lg">
                Fique atualizado com as últimas novidades do setor de fundição
              </p>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <Button 
                  key="all"
                  variant={selectedCategory === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedCategory('all')}
                >
                  Todos
                </Button>
                {categories.map((categoria) => (
                  <Button 
                    key={categoria.id}
                    variant={selectedCategory === categoria.id ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedCategory(categoria.id)}
                  >
                    {categoria.name}
                  </Button>
                ))}
              </div>
            </div>

            {newsLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {news
                    .filter((noticia) => selectedCategory === 'all' || noticia.category_id === selectedCategory)
                    .map((noticia) => (
                    <Link key={noticia.id} to={pathWithLang(`noticia/${noticia.slug}`, currentLanguage)}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      {noticia.featured_image_url && (
                        <div className="aspect-video bg-muted">
                          <img 
                            src={noticia.featured_image_url} 
                            alt={noticia.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              <Tag className="h-3 w-3 mr-1" />
                              {noticia.news_categories?.name || 'Sem categoria'}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatDate(noticia.published_at || noticia.created_at)}
                          </div>
                        </div>
                        <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer">
                          {noticia.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {noticia.excerpt || noticia.content.substring(0, 200) + '...'}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-4 w-4 mr-1" />
                          Portal da Fundição
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </main>

          <Sidebar />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Noticias;
