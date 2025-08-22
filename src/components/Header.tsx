
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdBanner from "./AdBanner";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Simular busca - redirecionar para página de notícias com parâmetro de busca
      navigate(`/noticias?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as any);
    }
  };
  return (
    <header className="shadow-lg" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="text-sm text-muted-foreground">
            Portal Global do Mercado de Alumínio
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-sm text-primary hover:text-primary-foreground hover:bg-primary">
              Newsletter
            </Button>
            <Button variant="ghost" size="sm" className="text-sm text-primary hover:text-primary-foreground hover:bg-primary">
              Anuncie Conosco
            </Button>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/d3511c4a-0b98-48cc-89b9-33bdc5d980d2.png" 
              alt="ALUINFO" 
              className="h-10 w-auto"
            />
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex items-center max-w-md w-full mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Buscar no portal..." 
                className="pl-10 w-full"
              />
              <Button 
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
              >
                Buscar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
