
import { Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="bg-card shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-40">
          {/* Logo and Title */}
          <div className="flex items-center space-x-8">
            <img 
              src="/lovable-uploads/2ca1f8d8-a33c-4033-ab60-b9636f11f86a.png" 
              alt="ALUINFO" 
              className="h-32 w-auto"
            />
            <div>
              <h1 className="text-3xl font-bold text-primary">PORTAL ALUINFO</h1>
              <p className="text-xl text-muted-foreground">CONECTANDO O FUTURO DO ALUMÍNIO</p>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-muted">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden text-foreground hover:bg-muted">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
