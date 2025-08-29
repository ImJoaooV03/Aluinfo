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
import { useState } from "react";

const MateriaisTecnicos = () => {
  const { materials, loading, refetch } = useTechnicalMaterials();
  const { toast } = useToast();
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>({});

  const handleDownload = (material: any) => {
    // Validar se há arquivo disponível
    if (!material.file_url) {
      toast({
        title: "Arquivo indisponível",
        description: "Este material não possui arquivo para download.",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileUrl = enforceHttps(material.file_url);
      
      // Otimisticamente atualizar o contador no UI
      setDownloadCounts(prev => ({
        ...prev,
        [material.id]: (downloadCounts[material.id] || material.download_count || 0) + 1
      }));

      // Método 1: Tentar window.open
      let downloadStarted = false;
      try {
        const newWindow = window.open(fileUrl, '_blank', 'noopener,noreferrer');
        if (newWindow) {
          downloadStarted = true;
          toast({
            title: "Download iniciado",
            description: `O arquivo "${material.title}" foi aberto em uma nova aba.`,
          });
        }
      } catch (e) {
        console.log('window.open falhou, tentando fallback');
      }

      // Método 2: Fallback com elemento <a>
      if (!downloadStarted) {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        document.body.appendChild(link);
        
        try {
          link.click();
          downloadStarted = true;
          toast({
            title: "Download iniciado",
            description: `O arquivo "${material.title}" está sendo baixado.`,
          });
        } catch (e) {
          console.log('Link click falhou, usando location.href');
        } finally {
          document.body.removeChild(link);
        }
      }

      // Método 3: Último recurso - abrir na mesma aba
      if (!downloadStarted) {
        window.location.href = fileUrl;
      }

      // Registrar analytics em background (não bloqueia download)
      supabase.auth.getUser().then(({ data: userData }) => {
        return supabase
          .from('analytics_views')
          .insert({
            content_type: 'technical_materials',
            content_id: material.id,
            user_id: userData?.user?.id || null,
            ip_address: null,
            user_agent: window.navigator.userAgent,
            referer: window.location.href,
          });
      }).then(() => {
        // Refetch após analytics para sincronizar contador real
        setTimeout(() => {
          refetch();
        }, 500);
      }).catch((err) => {
        console.error('Erro ao registrar analytics:', err);
      });

    } catch (error) {
      console.error('Erro no download:', error);
      // Reverter contador otimista em caso de erro
      setDownloadCounts(prev => ({
        ...prev,
        [material.id]: Math.max(0, (downloadCounts[material.id] || material.download_count || 0) - 1)
      }));
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
                           <span>{downloadCounts[material.id] || material.download_count || 0} downloads</span>
                         </div>
                         <Button 
                           className="w-full" 
                           onClick={() => handleDownload(material)}
                           disabled={!material.file_url}
                         >
                           <Download className="h-4 w-4 mr-2" />
                           {material.file_url ? 'Download' : 'Arquivo indisponível'}
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
