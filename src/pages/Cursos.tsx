import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BookOpen, Users, Award } from "lucide-react";

const Cursos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Cursos</h1>
            <p className="text-xl text-muted-foreground">
              Em breve, ofereceremos cursos especializados para o setor de alumínio
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Em Breve</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground text-lg mb-6">
                Estamos preparando uma plataforma completa de cursos online para profissionais do setor de alumínio.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Conteúdo Especializado</h3>
                  <p className="text-sm text-muted-foreground">
                    Cursos desenvolvidos por especialistas do setor
                  </p>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Comunidade Ativa</h3>
                  <p className="text-sm text-muted-foreground">
                    Interaja com outros profissionais da área
                  </p>
                </div>
                <div className="text-center">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Certificação</h3>
                  <p className="text-sm text-muted-foreground">
                    Certificados reconhecidos no mercado
                  </p>
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-6">
                <h4 className="font-semibold mb-2">Quer ser notificado quando os cursos estiverem disponíveis?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Assine nossa newsletter e seja o primeiro a saber sobre o lançamento!
                </p>
                <a 
                  href="/#newsletter" 
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Assinar Newsletter
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Enquanto isso, explore nossos outros recursos:</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="/artigos-tecnicos" 
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                Artigos Técnicos
              </a>
              <a 
                href="/ebooks" 
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                E-books
              </a>
              <a 
                href="/fornecedores" 
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                Guia de Fornecedores
              </a>
              <a 
                href="/fundicoes" 
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                Guia de Fundições
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cursos;
