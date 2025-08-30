
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";

export default function AdminAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkExistingAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();

          if (profile?.role === 'admin') {
            if (mounted) {
              navigate('/admin/dashboard');
            }
            return;
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação existente:', error);
      } finally {
        if (mounted) {
          setCheckingAuth(false);
        }
      }
    };

    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed in AdminAuth:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user && mounted) {
          // Verificar se é admin e redirecionar
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('user_id', session.user.id)
              .single();

            if (profile?.role === 'admin') {
              navigate('/admin/dashboard');
            }
          } catch (error) {
            console.error('Erro ao verificar perfil após login:', error);
          }
        }
      }
    );

    // Verificar se já está logado
    checkExistingAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Tentando fazer login com:', email);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        console.error('Erro de autenticação:', authError);
        toast({
          title: "Erro no login",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (!authData.user) {
        toast({
          title: "Erro",
          description: "Falha na autenticação. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      console.log('Login bem-sucedido, verificando permissões...');

      // Note: Admin role must now be set manually by an existing admin
      // The auto-admin backdoor has been removed for security

      // Verificar o perfil atualizado
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, email, full_name')
        .eq('user_id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar perfil:', profileError);
        await supabase.auth.signOut();
        toast({
          title: "Erro",
          description: "Erro ao verificar permissões do usuário.",
          variant: "destructive",
        });
        return;
      }

      if (profile?.role !== 'admin') {
        console.log('Usuário não é admin:', profile);
        await supabase.auth.signOut();
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão para acessar o painel administrativo.",
          variant: "destructive",
        });
        return;
      }

      console.log('Login como admin confirmado, redirecionando...');
      
      toast({
        title: "Login realizado",
        description: `Bem-vindo, ${profile.full_name || profile.email}!`,
      });
      
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Erro geral no login:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro inesperado ao fazer login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Painel Administrativo</CardTitle>
          <CardDescription>
            Faça login para acessar o painel de administração do Aluinfo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="joaovicrengel@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
