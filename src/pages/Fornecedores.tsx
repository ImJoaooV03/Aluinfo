import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Star, Users, Loader2, Shield, Building } from "lucide-react";
import { useState } from "react";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useSupplierCategories } from "@/hooks/useSupplierCategories";

const Fornecedores = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const { suppliers, loading, error } = useSuppliers(selectedCategoryId || undefined);
  const { categories } = useSupplierCategories();

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
            <p className="text-destructive">Erro ao carregar fornecedores: {error}</p>
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
                <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
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
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{supplier.specialty || 'Fornecedor'}</Badge>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{supplier.rating || 0}</span>
                          </div>
                        </div>
                        <CardTitle className="text-lg">{supplier.name}</CardTitle>
                        <p className="text-sm text-primary font-medium">{supplier.specialty}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {supplier.description}
                    </p>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{supplier.city}, {supplier.state}</span>
                      </div>
                      {supplier.employees_count && (
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{supplier.employees_count} funcionários</span>
                        </div>
                      )}
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
                        title={supplier.contact_info?.phone || 'Telefone não disponível'}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        title={supplier.contact_info?.email || 'Email não disponível'}
                      >
                        <Mail className="h-3 w-3" />
                      </Button>
                      {supplier.website && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(`https://${supplier.website}`, '_blank')}
                        >
                          <Globe className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {supplier.contact_info && !supplier.contact_info.masked && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>📞 {supplier.contact_info.phone}</div>
                          <div>📧 {supplier.contact_info.email}</div>
                        </div>
                      </div>
                    )}
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
