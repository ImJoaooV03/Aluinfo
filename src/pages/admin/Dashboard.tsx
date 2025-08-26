import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, FileText, Calendar, Image, TrendingUp, Users, Eye, MousePointer } from "lucide-react";

interface DashboardStats {
  newsCount: number;
  materialsCount: number;
  eventsCount: number;
  bannersCount: number;
  subscribersCount: number;
  totalViews: number;
  totalClicks: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    newsCount: 0,
    materialsCount: 0,
    eventsCount: 0,
    bannersCount: 0,
    subscribersCount: 0,
    totalViews: 0,
    totalClicks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const [
        newsResult,
        materialsResult,
        eventsResult,
        bannersResult,
        subscribersResult,
        viewsResult,
        clicksResult,
      ] = await Promise.all([
        supabase.from('news').select('id', { count: 'exact' }),
        supabase.from('technical_materials').select('id', { count: 'exact' }),
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('banners').select('id', { count: 'exact' }),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact' }),
        supabase.from('analytics_views').select('id', { count: 'exact' }),
        supabase.from('analytics_banner_clicks').select('id', { count: 'exact' }),
      ]);

      setStats({
        newsCount: newsResult.count || 0,
        materialsCount: materialsResult.count || 0,
        eventsCount: eventsResult.count || 0,
        bannersCount: bannersResult.count || 0,
        subscribersCount: subscribersResult.count || 0,
        totalViews: viewsResult.count || 0,
        totalClicks: clicksResult.count || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Notícias",
      value: stats.newsCount,
      description: "Total de notícias publicadas",
      icon: Newspaper,
      color: "text-blue-600",
    },
    {
      title: "Materiais Técnicos",
      value: stats.materialsCount,
      description: "Documentos disponíveis",
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Eventos",
      value: stats.eventsCount,
      description: "Eventos cadastrados",
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      title: "Banners",
      value: stats.bannersCount,
      description: "Banners ativos",
      icon: Image,
      color: "text-yellow-600",
    },
    {
      title: "Assinantes Newsletter",
      value: stats.subscribersCount,
      description: "Total de inscritos",
      icon: Users,
      color: "text-indigo-600",
    },
    {
      title: "Visualizações",
      value: stats.totalViews,
      description: "Total de visualizações",
      icon: Eye,
      color: "text-red-600",
    },
    {
      title: "Cliques em Banners",
      value: stats.totalClicks,
      description: "Total de cliques",
      icon: MousePointer,
      color: "text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel administrativo do Aluinfo
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Recentes</CardTitle>
            <CardDescription>
              Métricas de engajamento dos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Taxa de cliques em banners</span>
                <span className="font-medium">
                  {stats.totalViews > 0 
                    ? ((stats.totalClicks / stats.totalViews) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Média de visualizações por notícia</span>
                <span className="font-medium">
                  {stats.newsCount > 0 
                    ? Math.round(stats.totalViews / stats.newsCount)
                    : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Links para as tarefas mais comuns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                • <a href="/admin/noticias" className="text-primary hover:underline">Criar nova notícia</a>
              </div>
              <div className="text-sm">
                • <a href="/admin/banners" className="text-primary hover:underline">Gerenciar banners</a>
              </div>
              <div className="text-sm">
                • <a href="/admin/eventos" className="text-primary hover:underline">Adicionar evento</a>
              </div>
              <div className="text-sm">
                • <a href="/admin/lme" className="text-primary hover:underline">Atualizar indicadores LME</a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}