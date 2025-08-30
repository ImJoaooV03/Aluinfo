import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Users, FileText, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DownloadLead {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
  preferences: any;
  content_title?: string;
}

interface DownloadStats {
  totalDownloads: number;
  ebooksDownloads: number;
  materialsDownloads: number;
  todayDownloads: number;
}

export default function AdminDownloads() {
  const [downloads, setDownloads] = useState<DownloadLead[]>([]);
  const [stats, setStats] = useState<DownloadStats>({
    totalDownloads: 0,
    ebooksDownloads: 0,
    materialsDownloads: 0,
    todayDownloads: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDownloads();
    loadStats();
  }, []);

  const loadDownloads = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .not('preferences', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Filter downloads and enrich with content titles
      const downloadLeads = await Promise.all(
        (data || [])
          .filter(item => {
            const prefs = item.preferences as any;
            return prefs?.source === 'download';
          })
          .map(async (item) => {
            let content_title = 'Conteúdo não encontrado';
            const prefs = item.preferences as any;
            
            if (prefs?.content_type && prefs?.content_id) {
              try {
                if (prefs.content_type === 'ebook') {
                  const { data: ebook } = await supabase
                    .from('ebooks')
                    .select('title')
                    .eq('id', prefs.content_id)
                    .single();
                  content_title = ebook?.title || 'E-book não encontrado';
                } else if (prefs.content_type === 'technical_material') {
                  const { data: material } = await supabase
                    .from('technical_materials')
                    .select('title')
                    .eq('id', prefs.content_id)
                    .single();
                  content_title = material?.title || 'Material não encontrado';
                }
              } catch (error) {
                console.error('Error fetching content title:', error);
              }
            }

            return {
              ...item,
              content_title,
            } as DownloadLead;
          })
      );

      setDownloads(downloadLeads);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .not('preferences', 'is', null);

      if (error) throw error;

      const downloadLeads = (data || []).filter(item => {
        const prefs = item.preferences as any;
        return prefs?.source === 'download';
      });
      const today = new Date().toDateString();
      
      const stats = {
        totalDownloads: downloadLeads.length,
        ebooksDownloads: downloadLeads.filter(item => {
          const prefs = item.preferences as any;
          return prefs?.content_type === 'ebook';
        }).length,
        materialsDownloads: downloadLeads.filter(item => {
          const prefs = item.preferences as any;
          return prefs?.content_type === 'technical_material';
        }).length,
        todayDownloads: downloadLeads.filter(item => 
          new Date(item.created_at).toDateString() === today
        ).length,
      };

      setStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const getContentTypeBadge = (contentType: string) => {
    const config = {
      ebook: { label: 'E-book', variant: 'default' as const, icon: BookOpen },
      technical_material: { label: 'Material Técnico', variant: 'secondary' as const, icon: FileText },
    };

    const typeConfig = config[contentType as keyof typeof config] || { 
      label: 'Desconhecido', 
      variant: 'destructive' as const, 
      icon: FileText 
    };

    return (
      <Badge variant={typeConfig.variant} className="flex items-center gap-1">
        <typeConfig.icon className="h-3 w-3" />
        {typeConfig.label}
      </Badge>
    );
  };

  const statCards = [
    {
      title: "Total de Downloads",
      value: stats.totalDownloads,
      description: "Downloads realizados",
      icon: Download,
      color: "text-blue-600",
    },
    {
      title: "E-books",
      value: stats.ebooksDownloads,
      description: "Downloads de e-books",
      icon: BookOpen,
      color: "text-green-600",
    },
    {
      title: "Materiais Técnicos",
      value: stats.materialsDownloads,
      description: "Downloads de materiais",
      icon: FileText,
      color: "text-purple-600",
    },
    {
      title: "Hoje",
      value: stats.todayDownloads,
      description: "Downloads de hoje",
      icon: Users,
      color: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Downloads</h1>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Downloads</h1>
        <p className="text-muted-foreground">
          Leads gerados através dos downloads de e-books e materiais técnicos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leads de Download</CardTitle>
          <CardDescription>
            {downloads.length} lead{downloads.length !== 1 ? 's' : ''} gerado{downloads.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Conteúdo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {downloads.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {new Date(item.created_at).toLocaleString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.name || '-'}
                  </TableCell>
                  <TableCell>
                    {item.email}
                  </TableCell>
                  <TableCell>
                    {(item.preferences as any)?.phone || '-'}
                  </TableCell>
                  <TableCell>
                    {(item.preferences as any)?.content_type && 
                      getContentTypeBadge((item.preferences as any).content_type)
                    }
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {item.content_title}
                  </TableCell>
                </TableRow>
              ))}
              {downloads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Nenhum download registrado ainda
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}