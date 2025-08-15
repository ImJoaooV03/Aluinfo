import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Star, Factory, Truck } from "lucide-react";

const Fundicoes = () => {
  const fundicoes = [
    {
      id: 1,
      nome: "Fundição São Paulo",
      especialidade: "Ferro Fundido e Aço",
      descricao: "Uma das maiores fundições do país, especializada em peças de ferro fundido e aço para indústria automotiva e agrícola.",
      categoria: "Ferro Fundido",
      localizacao: "São Paulo, SP",
      telefone: "(11) 3456-7890",
      email: "comercial@fundicaosp.com.br",
      website: "www.fundicaosp.com.br",
      avaliacao: 4.7,
      capacidade: "500 ton/mês",
      certificacoes: ["ISO 9001", "TS 16949"],
      logo: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png",
      especializacoes: ["Blocos de Motor", "Peças Agrícolas", "Componentes Industriais"]
    },
    {
      id: 2,
      nome: "Alumínio Premium",
      especialidade: "Fundição de Alumínio",
      descricao: "Especializada em fundição de alumínio sob pressão e gravidade, atendendo setores automotivo e aeroespacial.",
      categoria: "Alumínio",
      localizacao: "Joinville, SC",
      telefone: "(47) 3456-7890",
      email: "vendas@aluminiopremium.com.br",
      website: "www.aluminiopremium.com.br",
      avaliacao: 4.9,
      capacidade: "300 ton/mês",
      certificacoes: ["ISO 9001", "AS 9100"],
      logo: "/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png",
      especializacoes: ["Peças Automotivas", "Componentes Aeroespaciais", "Carcaças Eletrônicas"]
    },
    {
      id: 3,
      nome: "Bronze & Latão Industrial",
      especialidade: "Ligas de Cobre",
      descricao: "Fundição especializada em bronze, latão e outras ligas de cobre para aplicações navais e industriais.",
      categoria: "Bronze/Latão",
      localizacao: "Rio de Janeiro, RJ",
      telefone: "(21) 2345-6789",
      email: "contato@bronzelatao.com.br",
      website: "www.bronzelatao.com.br",
      avaliacao: 4.5,
      capacidade: "150 ton/mês",
      certificacoes: ["ISO 9001", "Lloyd's Register"],
      logo: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png",
      especializacoes: ["Hélices Navais", "Válvulas Industriais", "Peças Decorativas"]
    },
    {
      id: 4,
      nome: "Precisão Cast",
      especialidade: "Microfusão",
      descricao: "Fundição de precisão por microfusão para peças complexas e de alta precisão dimensional.",
      categoria: "Microfusão",
      localizacao: "Caxias do Sul, RS",
      telefone: "(54) 3456-7890",
      email: "precisao@precisaocast.com.br",
      website: "www.precisaocast.com.br",
      avaliacao: 4.8,
      capacidade: "50 ton/mês",
      certificacoes: ["ISO 9001", "ISO 14001"],
      logo: "/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png",
      especializacoes: ["Turbinas", "Instrumentos Médicos", "Joias"]
    },
    {
      id: 5,
      nome: "Heavy Cast Indústria",
      especialidade: "Peças de Grande Porte",
      descricao: "Especializada em fundição de peças de grande porte para mineração, siderurgia e energia.",
      categoria: "Grande Porte",
      localizacao: "Belo Horizonte, MG",
      telefone: "(31) 2345-6789",
      email: "heavycast@heavycast.com.br",
      website: "www.heavycast.com.br",
      avaliacao: 4.6,
      capacidade: "1000 ton/mês",
      certificacoes: ["ISO 9001", "OHSAS 18001"],
      logo: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png",
      especializacoes: ["Equipamentos de Mineração", "Peças Siderúrgicas", "Turbinas Hidráulicas"]
    },
    {
      id: 6,
      nome: "EcoFund Verde",
      especialidade: "Fundição Sustentável",
      descricao: "Fundição com foco em sustentabilidade, utilizando energia renovável e processos eco-friendly.",
      categoria: "Sustentável",
      localizacao: "Curitiba, PR",
      telefone: "(41) 3456-7890",
      email: "sustentavel@ecofundverde.com.br",
      website: "www.ecofundverde.com.br",
      avaliacao: 4.4,
      capacidade: "200 ton/mês",
      certificacoes: ["ISO 9001", "ISO 14001", "LEED"],
      logo: "/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png",
      especializacoes: ["Peças Eólicas", "Componentes Solares", "Estruturas Verdes"]
    }
  ];

  const categorias = ["Todos", "Ferro Fundido", "Alumínio", "Bronze/Latão", "Microfusão", "Grande Porte", "Sustentável"];

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
              <h1 className="text-4xl font-bold text-foreground mb-4">Fundições</h1>
              <p className="text-muted-foreground text-lg">
                Encontre fundições especializadas para suas necessidades de produção
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

            {/* Banner Meio */}
            <div className="mb-6">
              <AdBanner size="medium" position="content" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {fundicoes.map((fundicao) => (
                <Card key={fundicao.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        <img 
                          src={fundicao.logo} 
                          alt={fundicao.nome}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{fundicao.categoria}</Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{fundicao.avaliacao}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{fundicao.nome}</CardTitle>
                        <p className="text-sm text-primary font-medium">{fundicao.especialidade}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {fundicao.descricao}
                    </p>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{fundicao.localizacao}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Factory className="h-4 w-4" />
                        <span>Capacidade: {fundicao.capacidade}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Certificações:</p>
                      <div className="flex flex-wrap gap-1">
                        {fundicao.certificacoes.map((cert) => (
                          <Badge key={cert} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Especializações:</p>
                      <div className="flex flex-wrap gap-1">
                        {fundicao.especializacoes.slice(0, 2).map((esp) => (
                          <Badge key={esp} variant="outline" className="text-xs">
                            {esp}
                          </Badge>
                        ))}
                        {fundicao.especializacoes.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{fundicao.especializacoes.length - 2}
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

            {/* Banner Final */}
            <div className="mt-8">
              <AdBanner size="large" position="content" />
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

export default Fundicoes;