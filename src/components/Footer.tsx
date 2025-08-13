
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-lead text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png" 
                alt="ALUINFO" 
                className="h-10 w-auto"
              />
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Seu portal de informações sobre o mercado de alumínio. 
              Notícias, materiais técnicos e guias especializados.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-white">Notícias</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Materiais Técnicos</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">E-books</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Fornecedores</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Fundições</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Sobre Nós</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-gray-300">contato@aluinfo.com.br</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-gray-300">(11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-gray-300">São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-300 text-sm mb-4">
              Receba as últimas notícias do mercado de alumínio
            </p>
            <div className="space-y-2">
              <Input 
                placeholder="Seu e-mail" 
                className="bg-white/10 border-white/20 text-white placeholder-white/60"
              />
              <Button className="w-full bg-primary hover:bg-primary/90">
                Inscrever-se
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 ALUINFO. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
