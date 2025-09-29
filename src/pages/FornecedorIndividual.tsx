import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import AdBanner from "@/components/AdBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone, Globe, ArrowLeft, Flag } from "lucide-react";
import DOMPurify from "dompurify";

interface Supplier {
  id: string;
  name: string;
  slug: string;
  specialty: string | null;
  description: string | null;
  logo_url: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  category_id: string | null;
  created_at: string;
}

const FornecedorIndividual = () => {
  const { slug } = useParams();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        console.log('Loading supplier with slug:', slug);
        
        // Get supplier data
        const { data: supplierData, error: supplierError } = await supabase
          .from('suppliers')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();
          
        console.log('Supplier query result:', { supplierData, error: supplierError });
        
        if (supplierError) {
          console.error('Error fetching supplier:', supplierError);
          return;
        }
        
        if (!supplierData) {
          console.log('No supplier found with slug:', slug);
          return;
        }
        
        console.log('Found supplier:', supplierData);
        setSupplier(supplierData as Supplier);
        
        // Get page content
        const { data: pageData } = await supabase
          .from('supplier_pages')
          .select('title, content')
          .eq('supplier_id', supplierData.id)
          .maybeSingle();
        setPage(pageData);
        
        console.log('Page data:', pageData);
        
      } catch (error) {
        console.error('Error in load function:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <p className="text-destructive mb-4">Fornecedor não encontrado</p>
              <p className="text-muted-foreground mb-6">
                O fornecedor que você está procurando não existe ou foi removido.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Slug procurado: {slug}
              </p>
              <Link to="/fornecedores">
                <Button className="mt-4">Voltar</Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const fullAddress = [supplier.address, [supplier.city, supplier.state].filter(Boolean).join(', ')].filter(Boolean).join(' — ');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <main className="flex-1">
            <AdBanner size="large" position="content" slotKey="fornecedores-top" className="mb-6" />

            <Link to="/fornecedores" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Fornecedores
            </Link>

            <Card className="mt-4">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center overflow-hidden">
                    {supplier.logo_url ? (
                      <img src={supplier.logo_url} alt={supplier.name} className="w-14 h-14 object-contain" />
                    ) : (
                      <span className="text-sm text-muted-foreground">Sem logo</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{page?.title || supplier.name}</CardTitle>
                      {supplier.country && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Flag className="h-4 w-4 mr-1" /> {supplier.country}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {supplier.specialty && (
                        <Badge variant="outline">{supplier.specialty}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {(page?.content || supplier.description) && (() => {
                  const contentHtml = (page?.content || supplier.description) ? DOMPurify.sanitize(page?.content || supplier.description || "") : null;
                  return contentHtml ? (
                    <div className="text-muted-foreground leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
                  ) : null;
                })()}

                {(supplier.address || supplier.city || supplier.state) && (
                  <div className="flex items-start text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                    <span>{fullAddress}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="text-sm">
                    <div className="text-muted-foreground mb-1">E-mail</div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <span>{supplier.email || '—'}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground mb-1">Telefone</div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{supplier.phone || '—'}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div className="text-muted-foreground mb-1">Website</div>
                    {supplier.website ? (
                      <a className="inline-flex items-center text-primary hover:underline" href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" /> Visitar site
                      </a>
                    ) : (
                      <div className="flex items-center text-muted-foreground"><Globe className="h-4 w-4 mr-2" /> —</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
          <Sidebar />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FornecedorIndividual;
