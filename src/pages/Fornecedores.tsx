import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Star, Users, Loader2, Shield, Building, Flag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useSupplierCategories } from "@/hooks/useSupplierCategories";
import { useToast } from "@/hooks/use-toast";

const Fornecedores = () => {
  const countryToEmoji = (name?: string) => {
    if (!name) return "";
    const norm = name.toLowerCase().trim();
    const map: Record<string, string> = {
      "brasil": "BR",
      "brazil": "BR",
      "argentina": "AR",
      "chile": "CL",
      "paraguai": "PY",
      "uruguai": "UY",
      "portugal": "PT",
      "espanha": "ES",
      "spain": "ES",
      "estados unidos": "US",
      "eua": "US",
      "united states": "US",
      "méxico": "MX",
      "mexico": "MX",
      "alemanha": "DE",
      "germany": "DE",
      "itália": "IT",
      "italia": "IT",
      "frança": "FR",
      "france": "FR",
      "china": "CN",
      "japão": "JP",
      "japao": "JP",
      "índia": "IN",
      "india": "IN",
      "canadá": "CA",
      "canada": "CA",
      "reino unido": "GB",
      "uk": "GB",
      "inglaterra": "GB",
    };
    const code = map[norm];
    if (!code) return "";
    const upper = code.toUpperCase();
    const emoji = upper
      .split("")
      .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
      .join("");
    return emoji;
  };

  const countryToDDI = (name?: string) => {
    if (!name) return "55";
    const norm = name.toLowerCase().trim();
    const map: Record<string, string> = {
      "brasil": "55",
      "brazil": "55",
      "argentina": "54",
      "chile": "56",
      "paraguai": "595",
      "uruguai": "598",
      "portugal": "351",
      "espanha": "34",
      "spain": "34",
      "estados unidos": "1",
      "eua": "1",
      "united states": "1",
      "méxico": "52",
      "mexico": "52",
      "alemanha": "49",
      "germany": "49",
      "itália": "39",
      "italia": "39",
      "frança": "33",
      "france": "33",
      "china": "86",
      "japão": "81",
      "japao": "81",
      "índia": "91",
      "india": "91",
      "canadá": "1",
      "canada": "1",
      "reino unido": "44",
      "uk": "44",
      "inglaterra": "44",
    };
    return map[norm] || "55";
  };

  const formatPhone = (raw: string | undefined, country?: string) => {
    if (!raw) return "—";
    const digits = raw.replace(/[^0-9+]/g, "");
    // Se já começa com +, respeita mas normaliza partes
    const ddi = countryToDDI(country);
    // Extrair DDD e número do restante
    const m = digits.match(/(\d{2,3})?\D*([0-9]{2,3})?\D*([0-9]{7,9})/);
    let ddd = "";
    let num = "";
    if (m) {
      if (m[2]) ddd = m[2];
      else if (m[1] && m[1] !== ddi) ddd = m[1];
      num = m[3] || "";
    }
    if (!ddd && digits.length >= 10) {
      ddd = digits.slice(-10, -8);
      num = digits.slice(-8);
    }
    if (num.length === 8) num = `${num.slice(0,4)}-${num.slice(4)}`;
    if (num.length === 9) num = `${num.slice(0,5)}-${num.slice(5)}`;
    return `+${ddi} (${ddd || ""}) ${num}`.replace(/\s+/g, ' ').trim();
  };
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const { suppliers, loading, error } = useSuppliers(selectedCategoryId || undefined);
  const { categories } = useSupplierCategories();
  const { toast } = useToast();

  const handlePhoneClick = (supplier: any) => {
    if (supplier.contact_info?.masked) {
      toast({
        title: "Login necessário",
        description: "Faça login para ver as informações de contato completas",
        variant: "default",
      });
      return;
    }

    if (!supplier.contact_info?.phone) {
      toast({
        title: "Telefone não disponível",
        description: "Este fornecedor não possui telefone cadastrado",
        variant: "destructive",
      });
      return;
    }

    window.location.href = `tel:${supplier.contact_info.phone}`;
  };

  const handleEmailClick = (supplier: any) => {
    if (supplier.contact_info?.masked) {
      toast({
        title: "Login necessário",
        description: "Faça login para ver as informações de contato completas",
        variant: "default",
      });
      return;
    }

    if (!supplier.contact_info?.email) {
      toast({
        title: "Email não disponível",
        description: "Este fornecedor não possui email cadastrado",
        variant: "destructive",
      });
      return;
    }

    window.location.href = `mailto:${supplier.contact_info.email}`;
  };

  const handleWebsiteClick = (website: string) => {
    if (!website) {
      toast({
        title: "Website não disponível",
        description: "Este fornecedor não possui website cadastrado",
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
                Não foi possível carregar os fornecedores. Tente novamente mais tarde.
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
            <AdBanner size="large" position="content" slotKey="fornecedores-top" className="mb-8" />
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Fornecedores</h1>
              <p className="text-muted-foreground text-lg">
                Encontre os melhores fornecedores e parceiros para sua empresa
              </p>
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <Button 
                  key="todos" 
                  variant={selectedCategoryId === "" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setSelectedCategoryId("")}
                >
                  Todos
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
              {suppliers.map((supplier) => (
                <Card key={supplier.id} className="group overflow-hidden border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        {supplier.logo_url ? (
                          <img 
                            src={supplier.logo_url} 
                            alt={supplier.name}
                            className="w-12 h-12 object-contain"
                          />
                        ) : (
                          <Building className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <CardTitle className="text-lg">{supplier.name}</CardTitle>
                          {supplier.country && (
                            <div className="flex items-center text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                              <span className="mr-1">{countryToEmoji(supplier.country)}</span>
                              <span className="font-medium">{supplier.country}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {(() => {
                            const names: string[] = [];
                            if (supplier.supplier_categories?.name) names.push(supplier.supplier_categories.name);
                            if (supplier.categories?.length) {
                              supplier.categories.forEach((c) => c.name && names.push(c.name));
                            }
                            const unique = Array.from(new Set(names));
                            const firstTwo = unique.slice(0, 2);
                            return (
                              <>
                                {firstTwo.map((n) => (
                                  <Badge key={n} variant="secondary">{n}</Badge>
                                ))}
                                {unique.length > 2 && (
                                  <span className="text-xs text-muted-foreground">entre outras…</span>
                                )}
                              </>
                            );
                          })()}
                          {supplier.specialty && (
                            <Badge variant="outline">{supplier.specialty}</Badge>
                          )}
                          {supplier.rating && (
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{supplier.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm mb-4">
                      {(supplier.address || supplier.city || supplier.state) && (
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {[supplier.address, [supplier.city, supplier.state].filter(Boolean).join(', ')].filter(Boolean).join(' — ')}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-4 text-muted-foreground text-sm">
                        <div title={supplier.contact_info?.masked ? 'Login necessário' : supplier.contact_info?.email || 'Email não disponível'}>
                          <Mail className="inline h-4 w-4 mr-1" />
                          <span>{supplier.contact_info?.masked ? 'Oculto' : (supplier.contact_info?.email || '—')}</span>
                        </div>
                        <div title={supplier.contact_info?.masked ? 'Login necessário' : supplier.contact_info?.phone || 'Telefone não disponível'}>
                          <Phone className="inline h-4 w-4 mr-1" />
                          <span>
                            {supplier.contact_info?.masked ? 'Oculto' : formatPhone(supplier.contact_info?.phone, supplier.country)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {supplier.contact_info?.masked && (
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
                        onClick={() => handlePhoneClick(supplier)}
                        title={supplier.contact_info?.masked ? "Login necessário" : supplier.contact_info?.phone || 'Telefone não disponível'}
                        aria-label="Ligar para fornecedor"
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEmailClick(supplier)}
                        title={supplier.contact_info?.masked ? "Login necessário" : supplier.contact_info?.email || 'Email não disponível'}
                        aria-label="Enviar email para fornecedor"
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleWebsiteClick(supplier.website)}
                        title={supplier.website ? `Visitar ${supplier.website}` : 'Website não disponível'}
                        aria-label="Visitar website do fornecedor"
                        disabled={!supplier.website}
                      >
                        <Globe className="h-3 w-3" />
                      </Button>
                      <Link to={`/fornecedores/${supplier.slug}`} className="col-span-3">
                        <Button className="w-full mt-2 group/btn">
                          + Informações
                          <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-0.5" />
                        </Button>
                      </Link>
                    </div>

                    {/* Informações detalhadas removidas do card conforme solicitado */}
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>

          <Sidebar />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Fornecedores;
