import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLanguageUtils, pathWithLang } from "@/utils/i18nUtils";
import { useUniversalSearch } from "@/hooks/useUniversalSearch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, MapPin, User, Download, BookOpen, Building2, Factory } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";

const Busca = () => {
  const { t } = useTranslation(['common', 'navigation']);
  const { currentLanguage } = useLanguageUtils();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get('q') || '';
  
  const { results, loading } = useUniversalSearch(searchTerm);

  useEffect(() => {
    document.title = searchTerm 
      ? `Busca: ${searchTerm} - Aluinfo`
      : 'Busca - Aluinfo';
  }, [searchTerm]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Notícia':
        return <User className="h-4 w-4" />;
      case 'Material Técnico':
        return <BookOpen className="h-4 w-4" />;
      case 'E-book':
        return <BookOpen className="h-4 w-4" />;
      case 'Evento':
        return <Calendar className="h-4 w-4" />;
      case 'Fornecedor':
        return <Building2 className="h-4 w-4" />;
      case 'Fundição':
        return <Factory className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Notícia':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Material Técnico':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'E-book':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Evento':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Fornecedor':
        return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case 'Fundição':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getResultLink = (result: any) => {
    switch (result.type) {
      case 'Notícia':
        return pathWithLang(`noticias/${result.slug}`, currentLanguage);
      case 'Material Técnico':
        return pathWithLang('artigos-tecnicos', currentLanguage);
      case 'E-book':
        return pathWithLang('ebooks', currentLanguage);
      case 'Evento':
        return pathWithLang('eventos', currentLanguage);
      case 'Fornecedor':
        return pathWithLang(`fornecedores/${result.slug}`, currentLanguage);
      case 'Fundição':
        return pathWithLang(`fundicoes/${result.slug}`, currentLanguage);
      default:
        return '#';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 md:gap-6">
          <main className="flex-1">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Search className="h-6 w-6 mr-3 text-primary" />
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {searchTerm ? `Resultados para "${searchTerm}"` : 'Busca'}
                </h1>
              </div>
              {searchTerm && (
                <p className="text-muted-foreground text-sm md:text-base">
                  {loading ? 'Buscando...' : `${results.length} resultado(s) encontrado(s)`}
                </p>
              )}
            </div>

            {!searchTerm ? (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Digite algo para pesquisar
                </h3>
                <p className="text-muted-foreground">
                  Use a barra de pesquisa no topo para encontrar notícias, artigos técnicos, e-books, eventos, fornecedores e fundições.
                </p>
              </div>
            ) : loading ? (
              <div className="grid gap-4 md:gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-40 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum resultado encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Tente usar palavras-chave diferentes ou mais genéricas.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link to={pathWithLang('noticias', currentLanguage)}>
                    <Button variant="outline" size="sm">Ver Notícias</Button>
                  </Link>
                  <Link to={pathWithLang('artigos-tecnicos', currentLanguage)}>
                    <Button variant="outline" size="sm">Ver Artigos Técnicos</Button>
                  </Link>
                  <Link to={pathWithLang('ebooks', currentLanguage)}>
                    <Button variant="outline" size="sm">Ver E-books</Button>
                  </Link>
                  <Link to={pathWithLang('fornecedores', currentLanguage)}>
                    <Button variant="outline" size="sm">Ver Fornecedores</Button>
                  </Link>
                  <Link to={pathWithLang('fundicoes', currentLanguage)}>
                    <Button variant="outline" size="sm">Ver Fundições</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {results.map((result) => (
                  <Link key={`${result.type}-${result.id}`} to={getResultLink(result)}>
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          {result.image && (
                            <div className="w-full md:w-48 h-32 md:h-28 flex-shrink-0 overflow-hidden rounded-lg">
                              <img 
                                src={result.image} 
                                alt={result.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <Badge className={`${getTypeColor(result.type)} flex items-center gap-1`}>
                                {getTypeIcon(result.type)}
                                <span>{result.type}</span>
                              </Badge>
                            </div>

                            <h3 className="font-bold text-lg mb-2 line-clamp-2 text-foreground">
                              {result.title || result.name}
                            </h3>
                            
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {result.summary}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                              {result.date && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(result.date)}</span>
                                </div>
                              )}
                              
                              {result.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{result.location}</span>
                                </div>
                              )}
                              
                              {result.specialty && (
                                <div className="flex items-center gap-1">
                                  <Badge variant="outline" className="text-xs">
                                    {result.specialty}
                                  </Badge>
                                </div>
                              )}
                              
                              {result.downloads !== undefined && result.downloads > 0 && (
                                <div className="flex items-center gap-1">
                                  <Download className="h-3 w-3" />
                                  <span>{result.downloads} downloads</span>
                                </div>
                              )}
                              
                              {result.author && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span>{result.author}</span>
                                </div>
                              )}
                              
                              {result.price && (
                                <Badge variant="secondary" className="text-xs">
                                  {result.price}
                                </Badge>
                              )}
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

export default Busca;

