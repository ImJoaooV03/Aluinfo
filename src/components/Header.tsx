
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="shadow-lg" style={{ backgroundColor: '#1a1a1a' }}>
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="text-sm text-muted-foreground">
            Portal Global do Mercado de Alumínio
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-foreground">
              Newsletter
            </Button>
            <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-foreground">
              Anuncie Conosco
            </Button>
          </div>
        </div>

        {/* Main header */}
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/2904d3c0-599a-438f-ba03-8efa385447af.png" 
              alt="ALUINFO" 
              className="h-80 w-auto"
            />
          </div>

          {/* Search Bar */}
          <div className="flex items-center max-w-md w-full mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Buscar no portal..." 
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
