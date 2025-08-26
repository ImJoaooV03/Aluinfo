import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-blue-background.jpg";
const HeroSection = () => {
  return <section 
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 relative"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="container mx-auto px-4 text-center">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
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
      </div>
    </section>;
};
export default HeroSection;