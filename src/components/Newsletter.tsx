import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send } from "lucide-react";

const Newsletter = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
    console.log("Newsletter subscription submitted");
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
              Mantenha-se Atualizado
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Receba as últimas notícias, tendências e insights do mercado de alumínio 
              diretamente em seu e-mail. Seja o primeiro a saber sobre inovações, 
              eventos e oportunidades no setor.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="h-12 text-base"
                  required
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="h-12 px-8 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Send className="h-4 w-4 mr-2" />
                Assinar
              </Button>
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