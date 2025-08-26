import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Video, Image } from "lucide-react";

const MateriaisTecnicos = () => {
  const materiais = [
    {
      id: 1,
      titulo: "Manual de Fundição em Areia - Guia Completo",
      descricao: "Documento técnico abrangente sobre processos de fundição em areia, incluindo materiais, técnicas e controle de qualidade.",
      tipo: "PDF",
      categoria: "Processos",
      tamanho: "2.5 MB",
      downloads: 1250,
      icon: FileText
    },
    {
      id: 2,
      titulo: "Vídeo Tutorial: Moldagem em Coquilha",
      descricao: "Tutorial em vídeo demonstrando técnicas avançadas de moldagem em coquilha para peças de precisão.",
      tipo: "Vídeo",
      categoria: "Tutorial",
      tamanho: "45 MB",
      downloads: 890,
      icon: Video
    },
    {
      id: 3,
      titulo: "Catálogo de Defeitos em Peças Fundidas",
      descricao: "Catálogo visual com os principais defeitos encontrados em peças fundidas e suas causas.",
      tipo: "PDF",
      categoria: "Qualidade",
      tamanho: "8.2 MB",
      downloads: 2100,
      icon: Image
    },
    {
      id: 4,
      titulo: "Normas Técnicas ABNT para Fundição",
      descricao: "Compilação das principais normas técnicas brasileiras aplicáveis ao setor de fundição.",
      tipo: "PDF",
      categoria: "Normas",
      tamanho: "1.8 MB",
      downloads: 1580,
      icon: FileText
    },
    {
      id: 5,
      titulo: "Calculadora de Propriedades de Ligas",
      descricao: "Ferramenta para cálculo de propriedades mecânicas e térmicas de diferentes ligas metálicas.",
      tipo: "Excel",
      categoria: "Ferramentas",
      tamanho: "0.5 MB",
      downloads: 720,
      icon: FileText
    },
    {
      id: 6,
      titulo: "Guia de Segurança em Fundições",
      descricao: "Manual completo sobre práticas de segurança e prevenção de acidentes em ambientes de fundição.",
      tipo: "PDF",
      categoria: "Segurança",
      tamanho: "3.1 MB",
      downloads: 950,
      icon: FileText
    }
  ];

  const categorias = ["Todos", "Processos", "Tutorial", "Qualidade", "Normas", "Ferramentas", "Segurança"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <main className="flex-1">
            {/* Banner 13 - Materiais Técnicos Topo */}
            <AdBanner size="large" position="content" slotKey="materiais-top" className="mb-8" />
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Materiais Técnicos</h1>
              <p className="text-muted-foreground text-lg">
                Acesse documentos técnicos, manuais e ferramentas especializadas para o setor de fundição
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {materiais.map((material) => {
                const IconComponent = material.icon;
                return (
                  <Card key={material.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-6 w-6 text-primary" />
                          <Badge variant="secondary">{material.tipo}</Badge>
                        </div>
                        <Badge variant="outline">{material.categoria}</Badge>
                      </div>
                      <CardTitle className="line-clamp-2">
                        {material.titulo}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3 mb-4">
                        {material.descricao}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span>{material.tamanho}</span>
                        <span>{material.downloads} downloads</span>
                      </div>
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
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

export default MateriaisTecnicos;