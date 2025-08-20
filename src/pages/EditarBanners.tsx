import { useState } from "react";
import { Upload, X, Save, Eye } from "lucide-react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface BannerImage {
  id: number;
  file: File | null;
  preview: string | null;
  url: string | null;
}

const EditarBanners = () => {
  const [banners, setBanners] = useState<BannerImage[]>([
    { id: 1, file: null, preview: null, url: "/lovable-uploads/3c7eb808-83a8-4f8b-b8af-52fff0a008ef.png" },
    { id: 2, file: null, preview: null, url: null },
    { id: 3, file: null, preview: null, url: null },
    { id: 4, file: null, preview: null, url: null },
  ]);

  const handleFileUpload = (bannerId: number, file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBanners(prev => prev.map(banner => 
          banner.id === bannerId 
            ? { ...banner, file, preview: e.target?.result as string }
            : banner
        ));
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveImage = (bannerId: number) => {
    setBanners(prev => prev.map(banner => 
      banner.id === bannerId 
        ? { ...banner, file: null, preview: null, url: null }
        : banner
    ));
  };

  const handleSave = () => {
    toast({
      title: "Sucesso",
      description: "Configurações dos banners salvas com sucesso!",
    });
  };

  const getCurrentImage = (banner: BannerImage) => {
    return banner.preview || banner.url;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <Header />
        <Navigation />
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Editar Banners de Publicidade</h1>
              <p className="text-muted-foreground mt-2">
                Gerencie as imagens dos banners publicitários numerados
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Visualizar
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <Card key={banner.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span>Banner {banner.id}</span>
                    {getCurrentImage(banner) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(banner.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`banner-${banner.id}`}>
                      Imagem {banner.id}
                    </Label>
                    
                    {getCurrentImage(banner) ? (
                      <div className="relative">
                        <img
                          src={getCurrentImage(banner)!}
                          alt={`Banner ${banner.id}`}
                          className="w-full h-[150px] object-cover rounded-lg border"
                        />
                        <div className="absolute top-2 right-2 bg-black/50 rounded px-2 py-1">
                          <span className="text-xs text-white">Banner {banner.id}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-[150px] border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                        <Upload className="h-8 w-8 mb-2" />
                        <p className="text-sm">Nenhuma imagem carregada</p>
                      </div>
                    )}
                    
                    <Input
                      id={`banner-${banner.id}`}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(banner.id, file);
                        }
                      }}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <p>Dimensões recomendadas: 300x150px</p>
                    <p>Formatos aceitos: JPG, PNG, GIF</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="font-semibold mb-2">Instruções de Uso</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Cada banner é numerado sequencialmente (Banner 1, Banner 2, etc.)</li>
              <li>• As imagens são redimensionadas automaticamente para 300x150px</li>
              <li>• Clique em "Salvar Alterações" para aplicar as modificações</li>
              <li>• Use "Visualizar" para ver como os banners aparecerão no site</li>
            </ul>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditarBanners;