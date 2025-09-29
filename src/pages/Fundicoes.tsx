
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Star, Factory, Loader2, Shield, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useFoundries } from "@/hooks/useFoundries";
import { useFoundryCategories } from "@/hooks/useFoundryCategories";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Fundicoes = () => {
  // Filtro single-select (como solicitado)
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
        <div className="container mx-auto px-4 py-4 md:py-8">
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
        <div className="container mx-auto px-4 py-4 md:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center p-8 bg-destructive/10 border border-destructive/20 rounded-lg max-w-md">
              <h2 className="text-2xl font-bold text-destructive mb-4">Erro ao Carregar</h2>
              <p className="text-destructive text-lg">
                Não foi possível carregar as fundições. Tente novamente mais tarde.
              </p>
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
      
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 md:gap-6">
          <main className="flex-1">
            {/* Banner 12 - Fundições Topo */}
            <AdBanner size="large" position="content" slotKey="fundicoes-top" className="mb-8" />
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Fundições</h1>
              <p className="text-muted-foreground text-lg">
                Encontre fundições especializadas para suas necessidades de produção
              </p>
            </div>

            {/* Filtros por categoria (single-select) */}
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
                        <div className="flex items-center justify-between mb-1">
                          <CardTitle className="text-lg">{foundry.name}</CardTitle>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {(() => {
                            const names: string[] = [];
                            if (foundry.foundry_categories?.name) names.push(foundry.foundry_categories.name);
                            if (foundry.categories?.length) {
                              foundry.categories.forEach((c: any) => {
                                if (c?.name) names.push(c.name as string);
                                else if (c?.foundry_categories?.name) names.push(c.foundry_categories.name as string);
                              });
                            }
                            const unique = Array.from(new Set(names));
                            const firstTwo = unique.slice(0, 2);
                            return (
                              <>
                                {firstTwo.map((n) => (
                                  <Badge key={n} variant="secondary">{n}</Badge>
                                ))}
                                {unique.length > 2 && (
                                  <span className="text-xs text-muted-foreground">Entre outras…</span>
                                )}
                              </>
                            );
                          })()}
                          {foundry.specialty && (
                            <Badge variant="outline">{foundry.specialty}</Badge>
                          )}
                          {typeof foundry.rating === 'number' && foundry.rating > 0 && (
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{foundry.rating}</span>
                            </div>
                          )}
                        </div>
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
                        <span>{[foundry.address, [foundry.city, foundry.state].filter(Boolean).join(', ')].filter(Boolean).join(' — ')}</span>
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

                    {/* Contatos acima dos botões */}
                    {foundry.contact_info && !foundry.contact_info.masked && (
                      <div className="text-sm text-muted-foreground mb-3 flex flex-wrap gap-6">
                        <div className="flex items-center"><Phone className="h-4 w-4 mr-2" /> {foundry.contact_info.phone}</div>
                        <div className="flex items-center"><Mail className="h-4 w-4 mr-2" /> {foundry.contact_info.email}</div>
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
                      <Link to={`/fundicoes/${foundry.slug}`} className="col-span-3">
                        <Button className="w-full mt-2 group/btn">
                          + Informações
                          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-0.5" />
                        </Button>
                      </Link>
                    </div>

                    {/* removido bloco duplicado de contatos abaixo */}
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
