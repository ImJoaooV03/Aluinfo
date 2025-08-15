import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, FileText, BookOpen, Users, Factory, Search as SearchIcon } from "lucide-react";

const Noticias = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search');

  // Dados mockados para demonstração - em uma aplicação real, viriam de uma API
  const allContent = {
    noticias: [
      {
        id: 1,
        titulo: "Mercado de Alumínio Registra Crescimento de 8% no Primeiro Semestre",
        resumo: "Análise completa dos fatores que impulsionaram o crescimento do setor de alumínio no Brasil, incluindo exportações e demanda interna.",
        data: "15 de Janeiro, 2024",
        autor: "João Silva",
        categoria: "Mercado",
        tipo: "Notícia",
        imagem: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png"
      },
      {
        id: 2,
        titulo: "Sustentabilidade na Fundição: Práticas Verdes em Foco",
        resumo: "Empresas do setor adotam práticas sustentáveis para reduzir impacto ambiental e aumentar competitividade.",
        data: "12 de Janeiro, 2024",
        autor: "Maria Santos",
        categoria: "Sustentabilidade",
        tipo: "Notícia",
        imagem: "/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png"
      },
      {
        id: 3,
        titulo: "Mercado de Fundição Cresce 15% no Último Trimestre",
        resumo: "Setor apresenta crescimento significativo impulsionado pela demanda da indústria automotiva.",
        data: "10 de Janeiro, 2024",
        autor: "Carlos Oliveira",
        categoria: "Mercado",
        tipo: "Notícia",
        imagem: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png"
      }
    ],
    materiais: [
      {
        id: 1,
        titulo: "Manual de Fundição em Areia - Análise de Mercado",
        resumo: "Documento técnico abrangente sobre processos de fundição em areia, incluindo análise de mercado atual.",
        categoria: "Processos",
        tipo: "Material Técnico",
        downloads: 1250
      },
      {
        id: 2,
        titulo: "Relatório de Mercado - Tendências 2024",
        resumo: "Análise detalhada das tendências do mercado de fundição para 2024.",
        categoria: "Mercado",
        tipo: "Material Técnico",
        downloads: 890
      }
    ],
    ebooks: [
      {
        id: 1,
        titulo: "Fundição Moderna: Análise de Mercado Global",
        autor: "Dr. Roberto Machado",
        resumo: "E-book completo com análise do mercado global de fundição e tendências futuras.",
        categoria: "Mercado",
        tipo: "E-book",
        preco: "Gratuito",
        paginas: 285
      },
      {
        id: 2,
        titulo: "Sustentabilidade na Indústria de Fundição",
        autor: "Dra. Marina Costa",
        resumo: "Abordagem sobre práticas sustentáveis, reciclagem de materiais e redução de impacto ambiental.",
        categoria: "Sustentabilidade",
        tipo: "E-book",
        preco: "R$ 19,90",
        paginas: 165
      }
    ],
    fornecedores: [
      {
        id: 1,
        nome: "MetalTech Indústria",
        especialidade: "Equipamentos para Fundição",
        resumo: "Fabricante líder em equipamentos e máquinas para fundição, com presença forte no mercado nacional.",
        categoria: "Equipamentos",
        tipo: "Fornecedor",
        localizacao: "São Paulo, SP"
      }
    ],
    fundicoes: [
      {
        id: 1,
        nome: "Fundição São Paulo",
        especialidade: "Ferro Fundido e Aço",
        resumo: "Uma das maiores fundições do país, com forte presença no mercado automotivo e agrícola.",
        categoria: "Ferro Fundido",
        tipo: "Fundição",
        localizacao: "São Paulo, SP"
      }
    ]
  };

  // Função para filtrar conteúdo baseado no termo de pesquisa
  const filterContent = (term: string) => {
    if (!term) return [];
    
    const searchLower = term.toLowerCase();
    const results: any[] = [];
    
    // Buscar em notícias
    allContent.noticias.forEach(item => {
      if (item.titulo.toLowerCase().includes(searchLower) || 
          item.resumo.toLowerCase().includes(searchLower) ||
          item.categoria.toLowerCase().includes(searchLower)) {
        results.push(item);
      }
    });
    
    // Buscar em materiais técnicos
    allContent.materiais.forEach(item => {
      if (item.titulo.toLowerCase().includes(searchLower) || 
          item.resumo.toLowerCase().includes(searchLower) ||
          item.categoria.toLowerCase().includes(searchLower)) {
        results.push(item);
      }
    });
    
    // Buscar em e-books
    allContent.ebooks.forEach(item => {
      if (item.titulo.toLowerCase().includes(searchLower) || 
          item.resumo.toLowerCase().includes(searchLower) ||
          item.categoria.toLowerCase().includes(searchLower)) {
        results.push(item);
      }
    });
    
    // Buscar em fornecedores
    allContent.fornecedores.forEach(item => {
      if (item.nome.toLowerCase().includes(searchLower) || 
          item.resumo.toLowerCase().includes(searchLower) ||
          item.especialidade.toLowerCase().includes(searchLower)) {
        results.push(item);
      }
    });
    
    // Buscar em fundições
    allContent.fundicoes.forEach(item => {
      if (item.nome.toLowerCase().includes(searchLower) || 
          item.resumo.toLowerCase().includes(searchLower) ||
          item.especialidade.toLowerCase().includes(searchLower)) {
        results.push(item);
      }
    });
    
    return results;
  };

  const searchResults = searchTerm ? filterContent(searchTerm) : [];
  
  const getIconByType = (tipo: string) => {
    switch (tipo) {
      case 'Notícia': return <Clock className="h-4 w-4" />;
      case 'Material Técnico': return <FileText className="h-4 w-4" />;
      case 'E-book': return <BookOpen className="h-4 w-4" />;
      case 'Fornecedor': return <Users className="h-4 w-4" />;
      case 'Fundição': return <Factory className="h-4 w-4" />;
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
          {/* Banner Principal */}
          <div className="mb-8">
            <AdBanner size="large" position="content" />
          </div>

          <div className="flex gap-6">
            <main className="flex-1">
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

              {searchResults.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                  {searchResults.map((result, index) => (
                    <Card key={`${result.tipo}-${result.id || index}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {result.imagem && (
                        <div className="aspect-video bg-muted">
                          <img 
                            src={result.imagem} 
                            alt={result.titulo || result.nome}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getIconByType(result.tipo)}
                            <Badge variant="secondary">{result.tipo}</Badge>
                          </div>
                          <Badge variant="outline">{result.categoria}</Badge>
                        </div>
                        <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer">
                          {result.titulo || result.nome}
                        </CardTitle>
                        {result.autor && (
                          <p className="text-sm text-muted-foreground">por {result.autor}</p>
                        )}
                        {result.especialidade && (
                          <p className="text-sm text-primary font-medium">{result.especialidade}</p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {result.resumo}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          {result.data && (
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{result.data}</span>
                            </div>
                          )}
                          {result.autor && (
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{result.autor}</span>
                            </div>
                          )}
                          {result.downloads && (
                            <span>{result.downloads} downloads</span>
                          )}
                          {result.preco && (
                            <span className="font-medium">{result.preco}</span>
                          )}
                          {result.localizacao && (
                            <span>{result.localizacao}</span>
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
                  <Button variant="outline" onClick={() => window.history.back()}>
                    Voltar
                  </Button>
                </div>
              )}
            </main>

            {/* Sidebar */}
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
        {/* Banner Principal */}
        <div className="mb-8">
          <AdBanner size="large" position="content" />
        </div>

        <div className="flex gap-6">
          <main className="flex-1">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Notícias</h1>
              <p className="text-muted-foreground text-lg">
                Fique atualizado com as últimas novidades do setor de fundição
              </p>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {["Todos", "Tecnologia", "Sustentabilidade", "Mercado"].map((categoria) => (
                  <Button key={categoria} variant="outline" size="sm">
                    {categoria}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {allContent.noticias.map((noticia) => (
                <Card key={noticia.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted">
                    <img 
                      src={noticia.imagem} 
                      alt={noticia.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{noticia.categoria}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {noticia.data}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2 hover:text-primary cursor-pointer">
                      {noticia.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {noticia.resumo}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-4 w-4 mr-1" />
                      {noticia.autor}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Noticias;