
import { useState } from "react";
import { 
  LayoutDashboard, 
  Newspaper, 
  FileText, 
  Calendar, 
  Image, 
  TrendingUp,
  LogOut,
  Users,
  Settings,
  Home,
  BookOpen,
  Download
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Notícias", url: "/admin/noticias", icon: Newspaper },
  { title: "Materiais Técnicos", url: "/admin/materiais", icon: FileText },
  { title: "E-books", url: "/admin/ebooks", icon: BookOpen },
  { title: "Eventos", url: "/admin/eventos", icon: Calendar },
  { title: "Banners", url: "/admin/banners", icon: Image },
  { title: "Indicadores LME", url: "/admin/lme", icon: TrendingUp },
  { title: "Downloads", url: "/admin/downloads", icon: Download },
  { title: "Newsletter", url: "/admin/newsletter", icon: Users },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;
  const isExpanded = menuItems.some((i) => isActive(i.url));
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50";

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate('/admin/auth');
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  const handleGoToSite = () => {
    navigate('/');
  };

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarHeader className="border-b p-4">
        {!collapsed && (
          <div className="font-bold text-lg text-primary">
            Aluinfo Admin
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gestão de Conteúdo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t space-y-2">
        <Button 
          variant="outline" 
          onClick={handleGoToSite}
          className="w-full justify-start"
        >
          <Home className="mr-2 h-4 w-4" />
          {!collapsed && "Voltar ao site"}
        </Button>
        
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && "Sair"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
