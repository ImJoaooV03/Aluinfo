import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import AdBanner from "@/components/AdBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Globe, ArrowLeft, Factory } from "lucide-react";
import DOMPurify from "dompurify";

interface Foundry {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  website: string | null;
}

const FundicaoIndividual = () => {
  const { slug } = useParams();
  const [foundry, setFoundry] = useState<Foundry | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<{ title: string; content: string } | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('foundries')
          .select('id, name, slug, description, logo_url, country, state, city, address, website')
          .eq('slug', slug)
          .eq('status', 'published')
          .single();
        if (error || !data) return;
        setFoundry(data as Foundry);
        const { data: foundryPage } = await supabase
          .from('foundry_pages')
          .select('title, content')
          .eq('foundry_id', data.id)
          .maybeSingle();
        if (foundryPage) setPage({ title: foundryPage.title, content: foundryPage.content || '' });
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
        <div className="container mx-auto px-4 py-10">
          <div className="h-24 bg-muted animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (!foundry) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Navigation />
        <div className="container mx-auto px-4 py-10 text-center">
          <h2 className="text-xl font-semibold">Fundição não encontrada</h2>
          <Link to="/fundicoes">
            <Button className="mt-4">Voltar</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fullAddress = [foundry.address, [foundry.city, foundry.state].filter(Boolean).join(', ')].filter(Boolean).join(' — ');

  const contentHtml = page?.content ? DOMPurify.sanitize(page.content) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <main className="flex-1">
            <AdBanner size="large" position="content" slotKey="fundicao-top" className="mb-6" />

            <Link to="/fundicoes" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Fundições
            </Link>

            <Card className="mt-4">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded bg-muted flex items-center justify-center overflow-hidden">
                    {foundry.logo_url ? (
                      <img src={foundry.logo_url} alt={foundry.name} className="w-14 h-14 object-contain" />
                    ) : (
                      <Factory className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl">{page?.title || foundry.name}</CardTitle>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {contentHtml ? (
                  <div className="prose prose-neutral max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
                ) : (
                  foundry.description && (
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{foundry.description}</p>
                  )
                )}

                {(foundry.address || foundry.city || foundry.state) && (
                  <div className="flex items-start text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                    <span>{fullAddress}</span>
                  </div>
                )}

                <div className="text-sm">
                  <div className="text-muted-foreground mb-1">Website</div>
                  {foundry.website ? (
                    <a className="inline-flex items-center text-primary hover:underline" href={foundry.website.startsWith('http') ? foundry.website : `https://${foundry.website}`} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" /> Visitar site
                    </a>
                  ) : (
                    <div className="flex items-center text-muted-foreground"><Globe className="h-4 w-4 mr-2" /> —</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
          <Sidebar slotKeyPrefix="fundicao" />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FundicaoIndividual;


