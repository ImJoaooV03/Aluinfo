import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DownloadGateDialog } from "@/components/DownloadGateDialog";
import { useActiveMediaKit } from "@/hooks/useMediaKits";
import { 
  MessageCircle, 
  Download, 
  Users, 
  TrendingUp, 
  Globe,
  Target,
  Zap,
  Award,
  BarChart3,
  Eye,
  MousePointer
} from "lucide-react";

const Anuncie = () => {
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const { data: activeMediaKit } = useActiveMediaKit();

  const handleContactSpecialist = () => {
    // Default WhatsApp contact - can be made configurable later
    const phoneNumber = "5511999999999"; // Replace with actual number
    const message = "Olá! Gostaria de saber mais sobre oportunidades de anúncio no Portal Aluinfo.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadMediaKit = () => {
    if (activeMediaKit) {
      setShowDownloadDialog(true);
    } else {
      // Fallback if no media kit is available
      alert("Mídia kit não disponível no momento. Entre em contato conosco para mais informações.");
    }
  };

  const stats = [
    { label: "Visitantes Mensais", value: "50K+", icon: Users },
    { label: "Visualizações de Página", value: "200K+", icon: Eye },
    { label: "Taxa de Engajamento", value: "75%", icon: MousePointer },
    { label: "Crescimento Mensal", value: "15%", icon: TrendingUp },
  ];

  const adTypes = [
    {
      title: "Banner Display",
      description: "Anúncios visuais em posições estratégicas do site",
      features: ["Alta visibilidade", "Formato responsivo", "Relatórios detalhados"],
      icon: BarChart3
    },
    {
      title: "Conteúdo Patrocinado",
      description: "Artigos e conteúdos promocionais integrados",
      features: ["Engajamento natural", "SEO otimizado", "Credibilidade"],
      icon: Award
    },
    {
      title: "Newsletter",
      description: "Espaços publicitários na nossa newsletter semanal",
      features: ["Público qualificado", "Alta taxa de abertura", "Segmentação"],
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <Header />
        <Navigation />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-white/20 text-white border-white/30">
            Oportunidades de Publicidade
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Anuncie no Portal
            <span className="block text-primary-foreground/90">Aluinfo</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Conecte-se com profissionais da indústria do alumínio e fundição. 
            Maximize sua visibilidade no maior portal especializado do setor.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleContactSpecialist}
              className="bg-white text-orange-600 hover:bg-white/90 hover:text-orange-700 px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Fale com um Especialista
            </Button>
            <Button 
              size="lg" 
              onClick={handleDownloadMediaKit}
              className="bg-white text-orange-600 hover:bg-white/90 hover:text-orange-700 px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              <Download className="mr-2 h-5 w-5" />
              Baixe o Mídia Kit
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Números que Impressionam
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <Icon className="h-8 w-8 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* O Portal Aluinfo Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">O Portal Aluinfo</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Somos a principal referência em informações sobre alumínio e fundição no Brasil. 
                Nosso portal conecta fornecedores, fundições, profissionais e empresas do setor, 
                oferecendo conteúdo especializado e oportunidades de negócio.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Globe className="h-6 w-6 text-primary mr-3" />
                  <span>Alcance nacional e internacional</span>
                </div>
                <div className="flex items-center">
                  <Target className="h-6 w-6 text-primary mr-3" />
                  <span>Público altamente segmentado</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-primary mr-3" />
                  <span>Autoridade reconhecida no setor</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Por que escolher o Aluinfo?</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Audiência qualificada e engajada</li>
                <li>• Conteúdo técnico especializado</li>
                <li>• Plataforma confiável e estabelecida</li>
                <li>• ROI comprovado para anunciantes</li>
                <li>• Suporte dedicado para campanhas</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Formatos de Anúncio */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Formatos de Anúncio Disponíveis
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {adTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <Icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                  <p className="text-muted-foreground mb-4">{type.description}</p>
                  <ul className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary to-primary/80">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Pronto para Impulsionar seu Negócio?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudar sua empresa 
            a alcançar novos patamares no mercado do alumínio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={handleContactSpecialist}
              className="bg-white text-orange-600 hover:bg-white/90 hover:text-orange-700 px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Fale com um Especialista
            </Button>
            <Button 
              size="lg" 
              onClick={handleDownloadMediaKit}
              className="bg-white text-orange-600 hover:bg-white/90 hover:text-orange-700 px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              <Download className="mr-2 h-5 w-5" />
              Baixe o Mídia Kit
            </Button>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Download Gate Dialog */}
      {activeMediaKit && (
        <DownloadGateDialog
          open={showDownloadDialog}
          onOpenChange={setShowDownloadDialog}
          contentType="media_kit"
          contentId={activeMediaKit.id}
          fileUrl={activeMediaKit.file_url}
          title={activeMediaKit.title}
        />
      )}
    </div>
  );
};

export default Anuncie;