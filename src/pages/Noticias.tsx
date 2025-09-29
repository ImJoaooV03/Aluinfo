import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguageUtils, pathWithLang } from "@/utils/i18nUtils";
import { useNews } from "@/hooks/useNews";
import { useNewsCategories } from "@/hooks/useNewsCategories";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, User, Calendar, Tag, ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import AdBanner from "@/components/AdBanner";

const Noticias = () => {
  const { t } = useTranslation(['common', 'navigation']);
  const { currentLanguage } = useLanguageUtils();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  const { news, loading: newsLoading } = useNews();
  const { categories, loading: categoriesLoading } = useNewsCategories();

  // Filter news based on category and search
  const filteredNews = news.filter(noticia => {
    const matchesCategory = selectedCategory === 'all' || noticia.category_id === selectedCategory;
    const matchesSearch = !searchTerm || 
      noticia.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ search: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Se há um parâmetro de busca, mostrar resultados de busca
  if (searchParams.get('search')) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 md:gap-6">
            <main className="flex-1">
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Search className="h-5 w-5 mr-2 text-muted-foreground" />
                  <h1 className="text-2xl font-bold text-foreground">
                    Resultados da busca: "{searchParams.get('search')}"
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  {filteredNews.length} resultado(s) encontrado(s)
                </p>
              </div>

              {newsLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhum resultado encontrado
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Tente ajustar os termos de busca ou explorar outras categorias.
                  </p>
                  <Link to={pathWithLang('noticias', currentLanguage)}>
                    <Button variant="outline">
                      Ver todas as notícias
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredNews.map((noticia) => (
                    <Link key={noticia.id} to={pathWithLang(`noticia/${noticia.slug}`, currentLanguage)}>
                      <Card className="hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="p-0">
                          {noticia.featured_image_url && (
                            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                              <img 
                                src={noticia.featured_image_url} 
                                alt={noticia.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="secondary" className="bg-primary/10 text-primary">
                                <Tag className="h-3 w-3 mr-1" />
                                {noticia.news_categories?.name || 'Notícias'}
                              </Badge>
                            </div>

                            <h3 className="font-bold mb-2 line-clamp-2 text-base">
                              {noticia.title}
                            </h3>
                            
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                              {noticia.excerpt || noticia.content.substring(0, 200) + '...'}
                            </p>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center space-x-2">
                                <User className="h-3 w-3" />
                                <span>Portal da Fundição</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(noticia.published_at || noticia.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}

              {filteredNews.length > 0 && (
                <div className="mt-8 text-center">
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
      
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 md:gap-6">
          <main className="flex-1">
            {/* Banner 17 - Notícias Topo */}
            <AdBanner size="large" position="content" slotKey="noticias-top" className="mb-6 md:mb-8" />
            <div className="mb-6 md:mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Notícias</h1>
              <p className="text-muted-foreground text-base md:text-lg">
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

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar notícias..." 
                  className="pl-10"
                />
              </div>
            </form>

            {newsLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredNews.map((noticia) => (
                  <Link key={noticia.id} to={pathWithLang(`noticia/${noticia.slug}`, currentLanguage)}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-0">
                        {noticia.featured_image_url && (
                          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                            <img 
                              src={noticia.featured_image_url} 
                              alt={noticia.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        
                        <div className="p-3 md:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {noticia.news_categories?.name || 'Notícias'}
                            </Badge>
                          </div>

                          <h3 className="font-bold mb-2 line-clamp-2 text-sm md:text-base">
                            {noticia.title}
                          </h3>
                          
                          <p className="text-muted-foreground text-xs md:text-sm mb-3 line-clamp-3">
                            {noticia.excerpt || noticia.content.substring(0, 200) + '...'}
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground gap-2">
                            <div className="flex items-center space-x-2">
                              <User className="h-3 w-3" />
                              <span className="truncate">Portal da Fundição</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(noticia.published_at || noticia.created_at)}</span>
                            </div>
                          </div>
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
