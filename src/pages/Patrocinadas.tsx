import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Clock, Users, Zap } from "lucide-react";

const Patrocinadas = () => {
  const conteudoPatrocinado = [
    {
      id: 1,
      titulo: "Revolucione sua Fundição com IA",
      empresa: "TechCast Solutions",
      descricao: "Descubra como nossa solução de inteligência artificial pode otimizar seus processos de fundição, reduzindo desperdícios em até 30% e aumentando a qualidade das peças.",
      categoria: "Tecnologia",
      tipo: "Produto",
      cta: "Teste Grátis por 30 dias",
      destaque: "Novo",
      beneficios: ["Redução de 30% nos desperdícios", "Melhoria na qualidade", "ROI em 6 meses"],
      imagem: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png",
      promo: "50% OFF no primeiro ano"
    },
    {
      id: 2,
      titulo: "Curso Avançado de Metalurgia",
      empresa: "Instituto de Fundição",
      descricao: "Curso online completo ministrado por especialistas renomados. Certificação reconhecida pela indústria com módulos práticos e teóricos.",
      categoria: "Educação",
      tipo: "Curso",
      cta: "Inscreva-se Agora",
      destaque: "Popular",
      beneficios: ["80 horas de conteúdo", "Certificação incluída", "Suporte 24/7"],
      imagem: "/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png",
      promo: "Últimas vagas disponíveis"
    },
    {
      id: 3,
      titulo: "Equipamento de Inspeção 3D",
      empresa: "Precision Metrology",
      descricao: "Sistema de inspeção 3D de última geração para controle de qualidade em tempo real. Precisão micrométrica garantida.",
      categoria: "Equipamentos",
      tipo: "Produto",
      cta: "Solicitar Demonstração",
      destaque: "Exclusivo",
      beneficios: ["Precisão micrométrica", "Inspeção em tempo real", "Integração com ERP"],
      imagem: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png",
      promo: "Financiamento em 48x"
    },
    {
      id: 4,
      titulo: "Software de Simulação CFD",
      empresa: "FlowSim Dynamics",
      descricao: "Simule o fluxo de metal líquido em seus moldes antes da produção. Evite defeitos e otimize o design dos canais de enchimento.",
      categoria: "Software",
      tipo: "Serviço",
      cta: "Download da Versão Trial",
      destaque: "Trending",
      beneficios: ["Simulação realística", "Redução de defeitos", "Interface intuitiva"],
      imagem: "/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png",
      promo: "Trial gratuito de 15 dias"
    },
    {
      id: 5,
      titulo: "Consultoria em Sustentabilidade",
      empresa: "Green Foundry Consulting",
      descricao: "Torne sua fundição mais sustentável e reduza custos. Implementamos práticas verdes que geram economia real.",
      categoria: "Consultoria",
      tipo: "Serviço",
      cta: "Consultoria Gratuita",
      destaque: "Eco-Friendly",
      beneficios: ["Redução de 40% na energia", "Conformidade ambiental", "Certificação verde"],
      imagem: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png",
      promo: "Primeira consultoria gratuita"
    },
    {
      id: 6,
      titulo: "Sistema de Gestão ERP",
      empresa: "FoundryMax Systems",
      descricao: "ERP especializado para fundições com módulos de produção, qualidade, estoque e financeiro totalmente integrados.",
      categoria: "Software",
      tipo: "Produto",
      cta: "Ver Demonstração",
      destaque: "Líder de Mercado",
      beneficios: ["Módulos integrados", "Relatórios em tempo real", "App mobile incluído"],
      imagem: "/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png",
      promo: "3 meses grátis na implantação"
    }
  ];

  const categorias = ["Todos", "Tecnologia", "Educação", "Equipamentos", "Software", "Consultoria"];
  const tipos = ["Todos", "Produto", "Serviço", "Curso"];

  const getDestaqueColor = (destaque: string) => {
    switch (destaque) {
      case "Novo": return "bg-green-500";
      case "Popular": return "bg-blue-500";
      case "Exclusivo": return "bg-purple-500";
      case "Trending": return "bg-orange-500";
      case "Eco-Friendly": return "bg-emerald-500";
      case "Líder de Mercado": return "bg-yellow-500";
      default: return "bg-primary";
    }
  };

  const getIconForTipo = (tipo: string) => {
    switch (tipo) {
      case "Produto": return <Zap className="h-4 w-4" />;
      case "Serviço": return <Users className="h-4 w-4" />;
      case "Curso": return <Clock className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Conteúdo Patrocinado</h1>
          <p className="text-muted-foreground text-lg">
            Descubra soluções inovadoras e oportunidades especiais para sua empresa
          </p>
        </div>

        <div className="mb-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Filtrar por Categoria:</h3>
            <div className="flex flex-wrap gap-2">
              {categorias.map((categoria) => (
                <Button key={categoria} variant="outline" size="sm">
                  {categoria}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Filtrar por Tipo:</h3>
            <div className="flex flex-wrap gap-2">
              {tipos.map((tipo) => (
                <Button key={tipo} variant="outline" size="sm">
                  {getIconForTipo(tipo)}
                  <span className="ml-1">{tipo}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {conteudoPatrocinado.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-primary/20">
              <div className="aspect-video bg-muted relative">
                <img 
                  src={item.imagem} 
                  alt={item.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className={`text-white ${getDestaqueColor(item.destaque)}`}>
                    {item.destaque}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-white/90">
                    PATROCINADO
                  </Badge>
                </div>
                {item.promo && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <Badge variant="default" className="w-full justify-center bg-red-500 hover:bg-red-600">
                      {item.promo}
                    </Badge>
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{item.categoria}</Badge>
                  <div className="flex items-center space-x-1">
                    {getIconForTipo(item.tipo)}
                    <span className="text-sm font-medium">{item.tipo}</span>
                  </div>
                </div>
                <CardTitle className="line-clamp-2">
                  {item.titulo}
                </CardTitle>
                <p className="text-sm text-primary font-medium">por {item.empresa}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3 mb-4">
                  {item.descricao}
                </p>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Principais Benefícios:</p>
                  <ul className="space-y-1">
                    {item.beneficios.map((beneficio, index) => (
                      <li key={index} className="flex items-center text-sm text-muted-foreground">
                        <Star className="h-3 w-3 mr-2 text-yellow-400 fill-yellow-400" />
                        {beneficio}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full">
                  {item.cta}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Anuncie Conosco</h2>
            <p className="text-muted-foreground mb-6">
              Alcance milhares de profissionais do setor de fundição com seu produto ou serviço.
            </p>
            <Button size="lg">
              Solicitar Informações sobre Publicidade
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Patrocinadas;