import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Download, Clock } from "lucide-react";

const Ebooks = () => {
  const ebooks = [
    {
      id: 1,
      titulo: "Fundição Moderna: Do Básico ao Avançado",
      autor: "Dr. Roberto Machado",
      descricao: "E-book completo abordando desde os fundamentos da fundição até as tecnologias mais avançadas do setor.",
      categoria: "Técnico",
      paginas: 285,
      avaliacao: 4.8,
      downloads: 3200,
      preco: "Gratuito",
      capa: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png",
      tempoLeitura: "6-8 horas"
    },
    {
      id: 2,
      titulo: "Metalurgia e Ligas: Guia Prático",
      autor: "Prof. Ana Silva",
      descricao: "Guia prático sobre propriedades metalúrgicas e aplicações de diferentes ligas na indústria de fundição.",
      categoria: "Metalurgia",
      paginas: 180,
      avaliacao: 4.6,
      downloads: 2150,
      preco: "R$ 29,90",
      capa: "/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png",
      tempoLeitura: "4-5 horas"
    },
    {
      id: 3,
      titulo: "Controle de Qualidade em Fundição",
      autor: "Eng. Carlos Santos",
      descricao: "Manual especializado em técnicas de controle de qualidade, inspeção e testes para peças fundidas.",
      categoria: "Qualidade",
      paginas: 220,
      avaliacao: 4.9,
      downloads: 1890,
      preco: "Gratuito",
      capa: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png",
      tempoLeitura: "5-6 horas"
    },
    {
      id: 4,
      titulo: "Sustentabilidade na Indústria de Fundição",
      autor: "Dra. Marina Costa",
      descricao: "Abordagem sobre práticas sustentáveis, reciclagem de materiais e redução de impacto ambiental.",
      categoria: "Sustentabilidade",
      paginas: 165,
      avaliacao: 4.5,
      downloads: 1420,
      preco: "R$ 19,90",
      capa: "/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png",
      tempoLeitura: "3-4 horas"
    },
    {
      id: 5,
      titulo: "Automação e Indústria 4.0 em Fundições",
      autor: "Prof. João Oliveira",
      descricao: "Explorando as tecnologias da Indústria 4.0 e sua aplicação em processos de fundição modernos.",
      categoria: "Tecnologia",
      paginas: 195,
      avaliacao: 4.7,
      downloads: 980,
      preco: "R$ 39,90",
      capa: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png",
      tempoLeitura: "4-5 horas"
    },
    {
      id: 6,
      titulo: "Segurança e Saúde Ocupacional",
      autor: "Eng. Paula Lima",
      descricao: "Guia completo sobre normas de segurança, equipamentos de proteção e prevenção de acidentes.",
      categoria: "Segurança",
      paginas: 145,
      avaliacao: 4.4,
      downloads: 1650,
      preco: "Gratuito",
      capa: "/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png",
      tempoLeitura: "3-4 horas"
    }
  ];

  const categorias = ["Todos", "Técnico", "Metalurgia", "Qualidade", "Sustentabilidade", "Tecnologia", "Segurança"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">E-books</h1>
          <p className="text-muted-foreground text-lg">
            Biblioteca digital com os melhores e-books sobre fundição e metalurgia
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
          {ebooks.map((ebook) => (
            <Card key={ebook.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[3/4] bg-muted relative">
                <img 
                  src={ebook.capa} 
                  alt={ebook.titulo}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={ebook.preco === "Gratuito" ? "default" : "secondary"}>
                    {ebook.preco}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{ebook.categoria}</Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{ebook.avaliacao}</span>
                  </div>
                </div>
                <CardTitle className="line-clamp-2">
                  {ebook.titulo}
                </CardTitle>
                <p className="text-sm text-muted-foreground">por {ebook.autor}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {ebook.descricao}
                </p>
                
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{ebook.paginas} páginas</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{ebook.tempoLeitura}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>{ebook.downloads} downloads</span>
                  </div>
                </div>
                
                <Button className="w-full">
                  {ebook.preco === "Gratuito" ? "Download Gratuito" : "Comprar"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Ebooks;