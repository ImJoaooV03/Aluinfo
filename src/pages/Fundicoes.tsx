
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Star, Factory, Loader2, Shield } from "lucide-react";
import { useState } from "react";
import { useFoundries } from "@/hooks/useFoundries";
import { useFoundryCategories } from "@/hooks/useFoundryCategories";
import { useToast } from "@/hooks/use-toast";

const Fundicoes = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const { foundries, loading, error } = useFoundries(selectedCategoryId || undefined);
  const { categories } = useFoundryCategories();
  const { toast } = useToast();

  const handlePhoneClick = (foundry: any) => {
    if (foundry.contact_info?.masked) {
      toast({
        title: "Login necessário",
        description: "Faça login para ver as informações de contato completas",
        variant: "default",
      });
      return;
    }

    if (!foundry.contact_info?.phone) {
      toast({
        title: "Telefone não disponível",
        description: "Esta fundição não possui telefone cadastrado",
        variant: "destructive",
      });
      return;
    }

    window.location.href = `tel:${foundry.contact_info.phone}`;
  };

  const handleEmailClick = (foundry: any) => {
    if (foundry.contact_info?.masked) {
      toast({
        title: "Login necessário",
        description: "Faça login para ver as informações de contato completas",
        variant: "default",
      });
      return;
    }

    if (!foundry.contact_info?.email) {
      toast({
        title: "Email não disponível",
        description: "Esta fundição não possui email cadastrado",
        variant: "destructive",
      });
      return;
    }

    window.location.href = `mailto:${foundry.contact_info.email}`;
  };

  const handleWebsiteClick = (website: string) => {
    if (!website) {
      toast({
        title: "Website não disponível",
        description: "Esta fundição não possui website cadastrado",
        variant: "destructive",
      });
      return;
    }

    const url = website.startsWith('http') ? website : `https://${website}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
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
          <div className="text-center">
            <p className="text-destructive">Erro ao carregar fundições: {error}</p>
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
            {/* Banner 12 - Fundições Topo */}
            <AdBanner size="large" position="content" slotKey="fundicoes-top" className="mb-8" />
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Fundições</h1>
              <p className="text-muted-foreground text-lg">
                Encontre fundições especializadas para suas necessidades de produção
              </p>
            </div>

            {/* Filtros por categoria */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategoryId === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategoryId("")}
                >
                  Todas
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategoryId === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {foundries.map((foundry) => (
                <Card key={foundry.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        {foundry.logo_url ? (
                          <img 
                            src={foundry.logo_url} 
                            alt={foundry.name}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <Factory className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{foundry.specialty || 'Fundição'}</Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{foundry.rating || 0}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{foundry.name}</CardTitle>
                        <p className="text-sm text-primary font-medium">{foundry.specialty}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {foundry.description}
                    </p>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{foundry.city}, {foundry.state}</span>
                      </div>
                      {foundry.employees_count && (
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Factory className="h-4 w-4" />
                          <span>{foundry.employees_count} funcionários</span>
                        </div>
                      )}
                    </div>

                    {foundry.contact_info?.masked && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Shield className="h-4 w-4" />
                          <span>Faça login para ver informações completas de contato</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePhoneClick(foundry)}
                        title={foundry.contact_info?.masked ? "Login necessário" : foundry.contact_info?.phone || 'Telefone não disponível'}
                        aria-label="Ligar para fundição"
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEmailClick(foundry)}
                        title={foundry.contact_info?.masked ? "Login necessário" : foundry.contact_info?.email || 'Email não disponível'}
                        aria-label="Enviar email para fundição"
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleWebsiteClick(foundry.website)}
                        title={foundry.website ? `Visitar ${foundry.website}` : 'Website não disponível'}
                        aria-label="Visitar website da fundição"
                        disabled={!foundry.website}
                      >
                        <Globe className="h-3 w-3" />
                      </Button>
                    </div>

                    {foundry.contact_info && !foundry.contact_info.masked && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>📞 {foundry.contact_info.phone}</div>
                          <div>📧 {foundry.contact_info.email}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
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
