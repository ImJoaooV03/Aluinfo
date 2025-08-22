
import NewsCard from "./NewsCard";
import AdBanner from "./AdBanner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, GraduationCap, Calendar, Download } from "lucide-react";

const MainContent = () => {

  const featuredNews = [
    {
      title: "Mercado de Alumínio Registra Crescimento de 8% no Primeiro Semestre",
      summary: "Análise completa dos fatores que impulsionaram o crescimento do setor de alumínio no Brasil, incluindo exportações e demanda interna.",
      author: "Carlos Silva",
      date: "1h atrás",
      category: "Mercado",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop",
      featured: true
    },
    {
      title: "Nova Tecnologia de Reciclagem Promete Revolucionar Setor",
      summary: "Processo inovador desenvolvido por startup brasileira pode aumentar em 40% a eficiência da reciclagem de alumínio.",
      author: "Ana Santos",
      date: "2h atrás",
      category: "Tecnologia",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop",
      featured: true
    }
  ];

  const regularNews = [
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
    },
    {
      title: "Inovações em Ligas de Alumínio para Construção Civil",
      summary: "Novos materiais prometem maior durabilidade e resistência para aplicações na construção civil.",
      author: "Pedro Fernandes",
      date: "6h atrás",
      category: "Materiais",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=250&fit=crop"
    },
    {
      title: "Fundições Brasileiras Modernizam Equipamentos",
      summary: "Investimentos em tecnologia visam aumentar produtividade e qualidade dos produtos finais.",
      author: "Lucia Martins",
      date: "7h atrás",
      category: "Fundição"
    },
    {
      title: "Curso Online: Tratamentos Superficiais em Alumínio",
      summary: "Nova formação técnica aborda as principais técnicas de acabamento e proteção superficial.",
      author: "Dr. Miguel Torres",
      date: "8h atrás",
      category: "Educação"
    }
  ];

  const technicalMaterials = [
    {
      title: "Normas ABNT para Alumínio",
      type: "PDF",
      description: "Compilação das principais normas técnicas brasileiras para produtos de alumínio",
      downloads: "3.2k"
    },
    {
      title: "Tabela de Propriedades Mecânicas",
      type: "Excel",
      description: "Dados técnicos completos das principais ligas de alumínio",
      downloads: "2.8k"
    },
    {
      title: "Guia de Soldagem TIG",
      type: "PDF",
      description: "Manual técnico para soldagem de alumínio com processo TIG",
      downloads: "2.1k"
    }
  ];

  const courses = [
    {
      title: "Fundição de Alumínio - Básico",
      duration: "40h",
      level: "Básico",
      price: "R$ 299",
      instructor: "Prof. João Silva"
    },
    {
      title: "Tratamentos Superficiais Avançados",
      duration: "60h",
      level: "Avançado",
      price: "R$ 450",
      instructor: "Dra. Maria Santos"
    },
    {
      title: "Reciclagem e Sustentabilidade",
      duration: "30h",
      level: "Intermediário",
      price: "R$ 200",
      instructor: "Eng. Pedro Costa"
    }
  ];

  const upcomingEvents = [
    {
      title: "FEAL 2024 - Feira Brasileira do Alumínio",
      date: "15-18 de Outubro",
      location: "São Paulo Expo",
      description: "A maior feira da América Latina dedicada ao setor do alumínio"
    },
    {
      title: "Congresso Internacional de Fundição",
      date: "22-24 de Novembro",
      location: "Centro de Convenções - RJ",
      description: "Evento técnico sobre inovações em processos de fundição"
    },
    {
      title: "Summit Sustentabilidade no Alumínio",
      date: "5-7 de Dezembro",
      location: "Centro de Eventos - SP",
      description: "Discussões sobre práticas sustentáveis na indústria do alumínio"
    }
  ];

  return (
    <main className="flex-1 space-y-6">
      {/* Anúncio Topo - Banner Grande 1 */}
      <AdBanner size="medium" position="content" spaceNumber={5} />

      {/* Notícias Destaque */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-lead">Notícias Destaque</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {featuredNews.map((news, index) => (
            <NewsCard key={index} {...news} />
          ))}
        </div>
      </section>

      {/* Anúncio Entre Seções - Banner Grande 2 */}
      <AdBanner size="large" position="content" spaceNumber={6} />

      {/* Materiais Técnicos */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-lead">Materiais Técnicos</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicalMaterials.map((material, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg">{material.title}</span>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {material.type}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{material.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{material.downloads} downloads</span>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Baixar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Anúncio Meio - Banner Grande 3 */}
      <AdBanner size="medium" position="content" spaceNumber={7} />

      {/* Próximos Eventos */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-lead">Próximos Eventos</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingEvents.map((event, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span className="text-lg">{event.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Data:</span>
                    <span className="text-primary">{event.date}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Local:</span>
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-6">
          <Button variant="outline">Ver Todos os Eventos</Button>
        </div>
      </section>

      {/* Anúncio Entre Seções - Banner Grande 4 */}
      <AdBanner size="large" position="content" spaceNumber={8} />

      {/* Cursos */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-lead">Cursos Online</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-lg">{course.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Duração:</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Nível:</span>
                    <span>{course.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Instrutor:</span>
                    <span>{course.instructor}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{course.price}</span>
                  <Button size="sm">Inscrever-se</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Anúncio Entre Seções - Banner Grande 5 */}
      <AdBanner size="medium" position="content" spaceNumber={9} />

      {/* Últimas Notícias */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-lead">Últimas Notícias</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularNews.map((news, index) => (
            <NewsCard key={index} {...news} />
          ))}
        </div>
      </section>


      {/* Botão Carregar Mais */}
      <div className="text-center pt-8">
        <Button variant="outline" className="px-8">
          Carregar Mais Notícias
        </Button>
      </div>
    </main>
  );
};

export default MainContent;
