import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Star, Users } from "lucide-react";

const Fornecedores = () => {
  const fornecedores = [
    {
      id: 1,
      nome: "MetalTech Indústria",
      especialidade: "Equipamentos para Fundição",
      descricao: "Fabricante líder em equipamentos e máquinas para fundição, com mais de 30 anos de experiência no mercado.",
      categoria: "Equipamentos",
      localizacao: "São Paulo, SP",
      telefone: "(11) 3456-7890",
      email: "contato@metaltech.com.br",
      website: "www.metaltech.com.br",
      avaliacao: 4.8,
      colaboradores: "200-500",
      logo: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png",
      servicos: ["Fornos", "Máquinas de Moldagem", "Sistemas de Filtração"]
    },
    {
      id: 2,
      nome: "Ligas & Materiais Ltda",
      especialidade: "Ligas Metálicas Especiais",
      descricao: "Especializada na produção e fornecimento de ligas metálicas de alta qualidade para diversas aplicações industriais.",
      categoria: "Materiais",
      localizacao: "Belo Horizonte, MG",
      telefone: "(31) 2345-6789",
      email: "vendas@ligasmateriais.com.br",
      website: "www.ligasmateriais.com.br",
      avaliacao: 4.6,
      colaboradores: "100-200",
      logo: "/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png",
      servicos: ["Ligas de Alumínio", "Ferro Fundido", "Ligas Especiais"]
    },
    {
      id: 3,
      nome: "Precision Tools Co.",
      especialidade: "Ferramentas de Precisão",
      descricao: "Fornecedor de ferramentas e instrumentos de precisão para controle de qualidade em processos de fundição.",
      categoria: "Ferramentas",
      localizacao: "Porto Alegre, RS",
      telefone: "(51) 3456-7890",
      email: "info@precisiontools.com.br",
      website: "www.precisiontools.com.br",
      avaliacao: 4.9,
      colaboradores: "50-100",
      logo: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png",
      servicos: ["Instrumentos de Medição", "Ferramentas de Corte", "Equipamentos de Teste"]
    },
    {
      id: 4,
      nome: "EcoFund Soluções",
      especialidade: "Soluções Ambientais",
      descricao: "Consultoria e equipamentos para gestão ambiental e sustentabilidade em indústrias de fundição.",
      categoria: "Ambiental",
      localizacao: "Curitiba, PR",
      telefone: "(41) 2345-6789",
      email: "contato@ecofund.com.br",
      website: "www.ecofund.com.br",
      avaliacao: 4.5,
      colaboradores: "20-50",
      logo: "/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png",
      servicos: ["Sistemas de Filtração", "Consultoria Ambiental", "Reciclagem"]
    },
    {
      id: 5,
      nome: "AutoFund Sistemas",
      especialidade: "Automação Industrial",
      descricao: "Desenvolvimento de sistemas de automação e controle para otimização de processos de fundição.",
      categoria: "Automação",
      localizacao: "Campinas, SP",
      telefone: "(19) 3456-7890",
      email: "vendas@autofund.com.br",
      website: "www.autofund.com.br",
      avaliacao: 4.7,
      colaboradores: "100-200",
      logo: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png",
      servicos: ["Sistemas de Controle", "Robótica", "Software Industrial"]
    },
    {
      id: 6,
      nome: "SafeCast Equipamentos",
      especialidade: "Equipamentos de Segurança",
      descricao: "Fornecedor especializado em equipamentos de proteção individual e coletiva para fundições.",
      categoria: "Segurança",
      localizacao: "Rio de Janeiro, RJ",
      telefone: "(21) 2345-6789",
      email: "seguranca@safecast.com.br",
      website: "www.safecast.com.br",
      avaliacao: 4.4,
      colaboradores: "50-100",
      logo: "/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png",
      servicos: ["EPIs", "Sistemas de Ventilação", "Treinamentos"]
    }
  ];

  const categorias = ["Todos", "Equipamentos", "Materiais", "Ferramentas", "Ambiental", "Automação", "Segurança"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Fornecedores</h1>
          <p className="text-muted-foreground text-lg">
            Encontre os melhores fornecedores e parceiros para sua empresa
          </p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categorias.map((categoria) => (
              <Button key={categoria} variant="outline" size="sm">
                {categoria}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {fornecedores.map((fornecedor) => (
            <Card key={fornecedor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <img 
                      src={fornecedor.logo} 
                      alt={fornecedor.nome}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">{fornecedor.categoria}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{fornecedor.avaliacao}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{fornecedor.nome}</CardTitle>
                    <p className="text-sm text-primary font-medium">{fornecedor.especialidade}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {fornecedor.descricao}
                </p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{fornecedor.localizacao}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{fornecedor.colaboradores} funcionários</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Principais Serviços:</p>
                  <div className="flex flex-wrap gap-1">
                    {fornecedor.servicos.slice(0, 2).map((servico) => (
                      <Badge key={servico} variant="outline" className="text-xs">
                        {servico}
                      </Badge>
                    ))}
                    {fornecedor.servicos.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{fornecedor.servicos.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Globe className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Fornecedores;