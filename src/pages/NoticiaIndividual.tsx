import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, User, Tag, Share2, Eye } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import NewsCard from "@/components/NewsCard";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const NoticiaIndividual = () => {
  const { id } = useParams();

  // Dados mockados da notícia - em um app real, estes viriam de uma API
  const noticia = {
    id: "1",
    title: "Mercado de Alumínio Registra Crescimento de 8% no Primeiro Semestre",
    summary: "Análise completa dos fatores que impulsionaram o crescimento do setor de alumínio no Brasil, incluindo exportações e demanda interna.",
    content: `
      <p>O mercado brasileiro de alumínio apresentou um crescimento robusto de 8% no primeiro semestre de 2024, superando as expectativas iniciais do setor. Segundo dados consolidados pela Associação Brasileira do Alumínio (ABAL), o crescimento foi impulsionado tanto pelo aumento das exportações quanto pela recuperação da demanda interna.</p>
      
      <h3>Fatores do Crescimento</h3>
      <p>Entre os principais fatores que contribuíram para este desempenho positivo, destacam-se:</p>
      
      <ul>
        <li><strong>Aumento das exportações:</strong> As vendas externas cresceram 12% em relação ao mesmo período do ano anterior, com destaque para os mercados americano e europeu.</li>
        <li><strong>Recuperação da construção civil:</strong> O setor da construção civil apresentou sinais de recuperação, aumentando a demanda por perfis e chapas de alumínio.</li>
        <li><strong>Setor automotivo:</strong> A indústria automobilística manteve o consumo estável, com previsão de crescimento para o segundo semestre.</li>
        <li><strong>Investimentos em sustentabilidade:</strong> Empresas aumentaram investimentos em processos de reciclagem e produção sustentável.</li>
      </ul>
      
      <h3>Perspectivas para o Segundo Semestre</h3>
      <p>As perspectivas para o segundo semestre são otimistas, com projeções de crescimento adicional de 5% a 7%. Os analistas apontam que a manutenção dos preços internacionais em patamares favoráveis e a continuidade da recuperação econômica doméstica são fatores-chave para sustentar essa trajetória.</p>
      
      <p>O presidente da ABAL, João Silva, comentou: "Estamos vivenciando um momento único de crescimento sustentado no setor. A combinação de fatores internos e externos tem criado um ambiente favorável para expandir nossa produção e nossa presença no mercado internacional."</p>
      
      <h3>Impacto Regional</h3>
      <p>O crescimento tem sido distribuído de forma equilibrada entre as regiões produtoras. O Sudeste mantém a liderança com 45% da produção nacional, seguido pelo Nordeste com 28% e Sul com 22%. A região Norte, tradicionalmente focada na produção primária, apresentou o maior crescimento percentual: 15%.</p>
      
      <h3>Desafios e Oportunidades</h3>
      <p>Apesar dos resultados positivos, o setor ainda enfrenta desafios importantes, como a volatilidade dos preços da energia elétrica e a necessidade de modernização de algumas plantas industriais. No entanto, as oportunidades de expansão, especialmente no mercado de energias renováveis e economia circular, são promissoras.</p>
    `,
    author: "Carlos Silva",
    date: "15 de agosto de 2024",
    timeAgo: "1h atrás",
    category: "Mercado",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
    views: "2.3k",
    featured: true
  };

  // Notícias relacionadas
  const noticiasRelacionadas = [
    {
      title: "Preços do Alumínio Sobem 3% no Mercado Internacional",
      summary: "Commodity registra alta influenciada por restrições na produção chinesa e aumento da demanda global.",
      author: "Roberto Lima",
      date: "3h atrás",
      category: "Preços",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=250&fit=crop"
    },
    {
      title: "Exportações Brasileiras Crescem 15% no Trimestre",
      summary: "Setor de alumínio impulsiona balança comercial brasileira com forte demanda externa.",
      author: "Marina Costa",
      date: "4h atrás",
      category: "Exportação",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"
    },
    {
      title: "Sustentabilidade: Empresas Investem em Processos Verdes",
      summary: "Indústria do alumínio adota práticas sustentáveis para reduzir impacto ambiental e atender demandas ESG.",
      author: "João Oliveira",
      date: "5h atrás",
      category: "Sustentabilidade",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <Header />
        <Navigation />
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Banner Principal */}
        <div className="mb-6">
          <AdBanner size="large" position="content" />
        </div>

        <div className="flex gap-6">
          {/* Conteúdo Principal */}
          <main className="flex-1">
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
                    {noticia.category}
                  </Badge>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{noticia.views} visualizações</span>
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

                <p className="text-lg text-muted-foreground mb-6">
                  {noticia.summary}
                </p>

                <div className="flex items-center justify-between text-sm text-muted-foreground border-b border-border pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Por {noticia.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{noticia.date} • {noticia.timeAgo}</span>
                    </div>
                  </div>
                </div>
              </header>

              {/* Imagem Principal */}
              {noticia.image && (
                <div className="aspect-video w-full overflow-hidden rounded-lg">
                  <img 
                    src={noticia.image} 
                    alt={noticia.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Banner Meio do Artigo */}
              <AdBanner size="medium" position="content" />

              {/* Conteúdo do Artigo */}
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: noticia.content }}
              />

              {/* Banner Final do Artigo */}
              <AdBanner size="large" position="content" />
            </article>

            {/* Notícias Relacionadas */}
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6 text-lead">Notícias Relacionadas</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {noticiasRelacionadas.map((news, index) => (
                  <NewsCard key={index} {...news} />
                ))}
              </div>
            </section>
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