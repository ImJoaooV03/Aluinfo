
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="text-sidebar-foreground" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company info */}
          <div className="lg:col-span-1">
            <img 
              src="/lovable-uploads/d3511c4a-0b98-48cc-89b9-33bdc5d980d2.png" 
              alt="ALUINFO" 
              className="h-20 w-auto mb-4"
            />
            <p className="text-sm mb-6">
              O portal global que conecta toda a cadeia produtiva do alumínio. Fornecedores, fundições, compradores e profissionais unidos em uma só plataforma.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 text-primary mr-2" />
                contato@aluinfo.com.br
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 text-primary mr-2" />
                +55 11 3000-0000
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 text-primary mr-2" />
                São Paulo, Brasil
              </div>
            </div>
          </div>

          {/* Portal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Portal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Como Funciona</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Serviços */}
          <div>
            <h3 className="text-white font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/fornecedores" className="hover:text-primary transition-colors">Guia de Fornecedores</a></li>
              <li><a href="/fundicoes" className="hover:text-primary transition-colors">Guia de Fundições</a></li>
              <li><a href="/materiais" className="hover:text-primary transition-colors">Materiais Técnicos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Anuncie Conosco</a></li>
            </ul>
          </div>

          {/* Educação */}
          <div>
            <h3 className="text-white font-semibold mb-4">Educação</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Cursos Online</a></li>
              <li><a href="/ebooks" className="hover:text-primary transition-colors">Ebooks</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Certificações</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Webinars</a></li>
            </ul>
          </div>

          {/* Mercado */}
          <div>
            <h3 className="text-white font-semibold mb-4">Mercado</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/noticias" className="hover:text-primary transition-colors">Notícias</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Análises</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cotações</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Relatórios</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter section */}
        <div className="border-t border-gray-600 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-white font-semibold mb-2">Mantenha-se Atualizado</h3>
              <p className="text-sm">Receba as principais notícias do setor diretamente no seu email</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-white mt-4 md:mt-0">
              Assinar Newsletter
            </Button>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-gray-600 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400">
              © 2024 ALUINFO. Todos os direitos reservados. • 
              <a href="#" className="hover:text-primary transition-colors ml-2">Termos de Uso</a> • 
              <a href="#" className="hover:text-primary transition-colors ml-2">Política de Privacidade</a>
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
