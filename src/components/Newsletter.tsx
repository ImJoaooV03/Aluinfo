import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation(['footer', 'common']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    try {
      // Use the secure subscription function
      const { data, error } = await supabase.rpc('subscribe_to_newsletter', {
        subscriber_email: email.trim(),
        subscriber_name: name.trim() || null
      });

      if (error) {
        console.error('Newsletter subscription error:', error);
        toast({
          title: "Erro",
          description: "Erro ao processar inscrição na newsletter. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      // Handle different response types
      const result = data as { success: boolean; message: string; already_subscribed?: boolean; reactivated?: boolean };
      
      if (result.success) {
        toast({
          title: "Sucesso!",
          description: result.message,
        });
        
        // Clear form only for new subscriptions
        if (!result.already_subscribed) {
          setEmail("");
          setName("");
        }
      } else {
        toast({
          title: "Erro",
          description: result.message || "Erro ao processar inscrição",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao processar inscrição",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-6">
              <Mail className="h-8 w-8 text-orange-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('footer:newsletter')}
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              {t('footer:newsletterText')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
            <div className="flex flex-col gap-3">
              <Input
                type="text"
                placeholder={t('common:name') + ' (opcional)'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/60"
                disabled={isLoading}
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder={t('footer:emailPlaceholder')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? t('common:loading') : t('common:subscribe')}
                </Button>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-3">
              Ao assinar, você concorda com nossa política de privacidade. 
              Cancele a qualquer momento.
            </p>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500 mb-2">5k+</div>
              <div className="text-sm text-slate-400">Assinantes ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500 mb-2">3x</div>
              <div className="text-sm text-slate-400">Por semana</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500 mb-2">100%</div>
              <div className="text-sm text-slate-400">Conteúdo exclusivo</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;