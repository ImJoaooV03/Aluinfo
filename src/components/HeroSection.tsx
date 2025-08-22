import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Users, TrendingUp } from "lucide-react";
const HeroSection = () => {
  const stats = [{
    icon: Globe,
    value: "+50",
    label: "Países Conectados"
  }, {
    icon: Users,
    value: "+10K",
    label: "Empresas Registradas"
  }, {
    icon: TrendingUp,
    value: "+1M",
    label: "Visualizações Mensais"
  }];
  return <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl font-bold mb-6 leading-tight md:text-7xl">
            O Portal Global do Mercado de Alumínio
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed md:text-xl">
            Conectamos fornecedores, fundições e profissionais do setor em uma plataforma única.<br />
            Acesse notícias, materiais técnicos, cursos e encontre os melhores parceiros para seu negócio.
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold">
              Explore o Portal →
            </Button>
            <Button size="lg" variant="outline" className="border-white hover:bg-white px-8 py-3 text-lg font-semibold text-black">
              Anuncie Conosco
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <IconComponent className="h-8 w-8 text-orange-500 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-slate-400">{stat.label}</div>
                </CardContent>
              </Card>;
        })}
        </div>
      </div>
    </section>;
};
export default HeroSection;