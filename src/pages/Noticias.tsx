import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

const Noticias = () => {
  const noticias = [
    {
      id: 1,
      titulo: "Novas Tecnologias em Fundição Revolucionam a Indústria",
      resumo: "Descoberta de novos materiais e processos promete aumentar a eficiência e reduzir custos na produção de fundidos.",
      data: "15 de Janeiro, 2024",
      autor: "João Silva",
      categoria: "Tecnologia",
      imagem: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png"
    },
    {
      id: 2,
      titulo: "Sustentabilidade na Fundição: Práticas Verdes em Foco",
      resumo: "Empresas do setor adotam práticas sustentáveis para reduzir impacto ambiental e aumentar competitividade.",
      data: "12 de Janeiro, 2024",
      autor: "Maria Santos",
      categoria: "Sustentabilidade",
      imagem: "/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png"
    },
    {
      id: 3,
      titulo: "Mercado de Fundição Cresce 15% no Último Trimestre",
      resumo: "Setor apresenta crescimento significativo impulsionado pela demanda da indústria automotiva.",
      data: "10 de Janeiro, 2024",
      autor: "Carlos Oliveira",
      categoria: "Mercado",
      imagem: "/lovable-uploads/885334ae-0873-4973-826d-dffaf8fd1f05.png"
    }
  ];

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

            {/* Banner Meio */}
            <div className="mb-6">
              <AdBanner size="medium" position="content" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {noticias.map((noticia) => (
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

export default Noticias;