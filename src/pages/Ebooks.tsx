
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Download, Clock } from "lucide-react";
import { useEbooks } from "@/hooks/useEbooks";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DownloadGateDialog } from "@/components/DownloadGateDialog";

const Ebooks = () => {
  const { ebooks, loading, error } = useEbooks();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [pendingEbook, setPendingEbook] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const filteredEbooks = selectedCategory === "all" 
    ? ebooks 
    : ebooks.filter(ebook => ebook.category_id === selectedCategory);

  const handleDownload = async (ebook: any) => {
    try {
      // Registrar analytics de download
      await supabase
        .from('analytics_views')
        .insert([{
          content_type: 'ebooks',
          content_id: ebook.id,
          user_id: null, // Pode ser implementado com auth
          ip_address: null,
          user_agent: navigator.userAgent,
          referer: document.referrer || null
        }]);

      // Abrir o arquivo para download
      window.open(ebook.file_url, '_blank');
    } catch (error) {
      console.error('Erro ao registrar download:', error);
      // Mesmo com erro de analytics, permite o download
      window.open(ebook.file_url, '_blank');
    }
  };

  const formatReadingTime = (minutes: number | null) => {
    if (!minutes) return "N/D";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return "Geral";
    const category = categories.find((cat: any) => cat.id === categoryId);
    return category ? (category as any).name : "Geral";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando e-books...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <p className="text-destructive mb-4">Erro ao carregar e-books</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <main className="flex-1">
            {/* Banner 10 - E-books Topo */}
            <AdBanner size="large" position="content" slotKey="ebooks-top" className="mb-8" />
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">E-books</h1>
              <p className="text-muted-foreground text-lg">
                Biblioteca digital com os melhores e-books sobre fundição e metalurgia
              </p>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={selectedCategory === "all" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                >
                  Todos
                </Button>
                {categories.map((category: any) => (
                  <Button 
                    key={category.id} 
                    variant={selectedCategory === category.id ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {filteredEbooks.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum e-book encontrado</h3>
                <p className="text-muted-foreground">
                  {selectedCategory === "all" 
                    ? "Ainda não há e-books disponíveis." 
                    : "Não há e-books nesta categoria."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {filteredEbooks.map((ebook) => (
                  <Card key={ebook.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-muted relative">
                      {ebook.cover_image_url ? (
                        <img 
                          src={ebook.cover_image_url} 
                          alt={ebook.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant={ebook.price === null || ebook.price === 0 ? "default" : "secondary"}>
                          {ebook.price === null || ebook.price === 0 ? "Gratuito" : `R$ ${ebook.price.toFixed(2)}`}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{getCategoryName(ebook.category_id)}</Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{ebook.rating || 0}</span>
                        </div>
                      </div>
                      <CardTitle className="line-clamp-2">
                        {ebook.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">por {ebook.author}</p>
                    </CardHeader>
                    <CardContent>
                      {ebook.description && (
                        <p className="text-muted-foreground line-clamp-2 mb-4">
                          {ebook.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{ebook.pages_count || "N/D"} páginas</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatReadingTime(ebook.reading_time)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{ebook.download_count || 0} downloads</span>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full"
                        onClick={() => {
                          setPendingEbook(ebook);
                          setIsGateOpen(true);
                        }}
                      >
                        {ebook.price === null || ebook.price === 0 ? "Download Gratuito" : "Comprar"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
      
      <Footer />
      
      {pendingEbook && (
        <DownloadGateDialog
          open={isGateOpen}
          onOpenChange={setIsGateOpen}
          contentType="ebooks"
          contentId={pendingEbook.id}
          fileUrl={pendingEbook.file_url}
          title={pendingEbook.title}
          onDownloadComplete={() => {
            // Limpar pending ebook
            setPendingEbook(null);
          }}
        />
      )}
    </div>
  );
};

export default Ebooks;
