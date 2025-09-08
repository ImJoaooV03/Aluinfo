
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkAuthAndPermissions = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          if (mounted) {
            navigate('/pt/admin/auth');
          }
          return;
        }

        // Verificar se o usuário tem permissão de admin
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role, email')
          .eq('user_id', session.user.id)
          .single();

        if (profileError || profile?.role !== 'admin') {
          console.log('Usuário sem permissão de admin, fazendo logout');
          await supabase.auth.signOut();
          if (mounted) {
            toast({
              title: "Acesso negado",
              description: "Você não tem permissão para acessar o painel administrativo.",
              variant: "destructive",
            });
            navigate('/pt/admin/auth');
          }
          return;
        }

        if (mounted) {
          setUser(session.user);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        if (mounted) {
          navigate('/pt/admin/auth');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Configurar listener de mudanças de autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_OUT' || !session) {
          if (mounted) {
            setUser(null);
            navigate('/pt/admin/auth');
          }
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (mounted) {
            setUser(session.user);
          }
        }
      }
    );

    // Depois verificar sessão existente
    checkAuthAndPermissions();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center border-b bg-background px-4">
            <SidebarTrigger className="mr-4" />
            <h1 className="font-semibold">Painel Administrativo</h1>
          </header>
          <main className="flex-1 p-6 bg-muted/50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
