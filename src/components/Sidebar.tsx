
import { TrendingUp, BookOpen, Users, Building2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdBanner from "./AdBanner";

const Sidebar = () => {
  const trendingNews = [
    { title: "Preço do alumínio sobe 3% no mercado internacional", date: "2h atrás" },
    { title: "Nova tecnologia de reciclagem revoluciona setor", date: "4h atrás" },
    { title: "Exportações brasileiras crescem 15% no trimestre", date: "6h atrás" },
    { title: "Sustentabilidade: tendências para 2024", date: "8h atrás" },
  ];

  const popularEbooks = [
    { title: "Guia Completo de Fundição", downloads: "2.3k" },
    { title: "Processos de Extrusão", downloads: "1.8k" },
    { title: "Tratamentos Superficiais", downloads: "1.5k" },
  ];

  const featuredSuppliers = [
    { name: "AlumiBrasil Ltda", category: "Matéria-prima", location: "São Paulo" },
    { name: "TechMetal Solutions", category: "Equipamentos", location: "Rio de Janeiro" },
    { name: "Fundição Moderna", category: "Fundição", location: "Minas Gerais" },
  ];

  return (
    <aside className="w-80 space-y-6">
      {/* Anúncio Topo */}
      <AdBanner size="medium" position="sidebar" />
      
      {/* Notícias em Alta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Em Alta</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trendingNews.map((news, index) => (
              <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                <h4 className="text-sm font-medium mb-1 hover:text-primary cursor-pointer">
                  {news.title}
                </h4>
                <p className="text-xs text-muted-foreground">{news.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Anúncio Meio */}
      <AdBanner size="medium" position="sidebar" />

      {/* E-books Populares */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span>E-books Populares</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {popularEbooks.map((ebook, index) => (
              <div key={index} className="flex items-center justify-between">
                <h4 className="text-sm font-medium hover:text-primary cursor-pointer flex-1">
                  {ebook.title}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {ebook.downloads}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fornecedores Destaque */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Fornecedores Destaque</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {featuredSuppliers.map((supplier, index) => (
              <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                <h4 className="text-sm font-medium mb-1 hover:text-primary cursor-pointer">
                  {supplier.name}
                </h4>
                <p className="text-xs text-muted-foreground">{supplier.category}</p>
                <p className="text-xs text-muted-foreground">{supplier.location}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Anúncio Adicional */}
      <AdBanner size="medium" position="sidebar" />

      {/* Anúncio Final */}
      <AdBanner size="large" position="sidebar" />
    </aside>
  );
};

export default Sidebar;
