import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Loader2 } from "lucide-react";

export default function CreateAdmin() {
  const [email, setEmail] = useState("admin@aluinfo.com");
  const [password, setPassword] = useState("admin123");
  const [fullName, setFullName] = useState("Administrador do Sistema");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (authError) {
        toast({
          title: "Erro ao criar usuário",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (authData.user) {
        // 2. Atualizar o perfil para admin (o trigger handle_new_user já criou o perfil)
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: 'admin',
            full_name: fullName 
          })
          .eq('user_id', authData.user.id);

        if (profileError) {
          console.error('Erro ao atualizar perfil:', profileError);
        }

        toast({
          title: "Sucesso!",
          description: "Usuário admin criado com sucesso. Você pode fazer login agora.",
        });

        // Limpar formulário
        setEmail("");
        setPassword("");
        setFullName("");
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro inesperado ao criar admin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4">
            <UserPlus className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Criar Administrador</CardTitle>
          <CardDescription>
            Crie o primeiro usuário administrador do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAdmin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Nome do administrador"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@aluinfo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Escolha uma senha segura"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Administrador"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}