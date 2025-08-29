import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Video, Image } from "lucide-react";
import { useTechnicalMaterials } from "@/hooks/useTechnicalMaterials";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { enforceHttps } from "@/utils/httpsUtils";
const MateriaisTecnicos = () => {
  const { materials, loading, refetch } = useTechnicalMaterials();
  const { toast } = useToast();

  const handleDownload = async (material: any) => {
    try {
      // Preabre uma aba para evitar bloqueio de pop-up
      const fileUrl = enforceHttps(material.file_url);
      let newWindow: Window | null = null;
      try {
        newWindow = window.open('about:blank', '_blank');
      } catch (e) {
        newWindow = null;
      }

      // Registra o download no analytics sem bloquear a navegação
      const { data: userData } = await supabase.auth.getUser();
      supabase
        .from('analytics_views')
        .insert({
          content_type: 'technical_materials',
          content_id: material.id,
          user_id: userData?.user?.id || null,
          ip_address: null,
          user_agent: window.navigator.userAgent,
          referer: window.location.href,
        })
        .then(
          () => {
            // Atualiza a lista para mostrar o novo contador após registrar
            setTimeout(() => {
              refetch();
            }, 300);
          },
          (err) => {
            console.error('Erro ao registrar download:', err);
            // Mesmo com erro no analytics, continua o download
          }
        );

      // Abre/navega para o arquivo
      if (newWindow) {
        try {
          newWindow.location.href = fileUrl;
        } catch {
          window.open(fileUrl, '_blank');
        }
        toast({
          title: "Download iniciado",
          description: `O arquivo "${material.title}" foi aberto em uma nova aba.`,
        });
      } else {
        // Fallback: se a nova aba foi bloqueada, abre no mesmo separador
        window.location.href = fileUrl;
      }

    } catch (error) {
      console.error('Erro no download:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível processar o download. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getIconByType = (fileType: string | null) => {
    switch (fileType?.toLowerCase()) {
      case 'video':
      case 'mp4':
      case 'avi':
      case 'mov':
        return Video;
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return Image;
      default:
        return FileText;
    }
  };

  const formatFileSize = (sizeInBytes: number | null) => {
    if (!sizeInBytes) return 'N/A';
    
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {materials.map((material) => {
                  const IconComponent = getIconByType(material.file_type);
                  return (
                    <Card key={material.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <IconComponent className="h-6 w-6 text-primary" />
                            <Badge variant="secondary">{material.file_type || 'PDF'}</Badge>
                          </div>
                          <Badge variant="outline">Material</Badge>
                        </div>
                        <CardTitle className="line-clamp-2">
                          {material.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {material.description || 'Material técnico disponível para download'}
                        </p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span>{formatFileSize(material.file_size)}</span>
                          <span>{material.download_count || 0} downloads</span>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => handleDownload(material)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {!loading && materials.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhum material encontrado</h3>
                <p className="text-muted-foreground">
                  Ainda não há materiais técnicos disponíveis. Volte em breve!
                </p>
              </div>
            )}
          </main>

          <Sidebar />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MateriaisTecnicos;
