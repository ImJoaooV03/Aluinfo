
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home,
  Newspaper, 
  FileText, 
  BookOpen, 
  Users, 
  Factory,
  TrendingUp,
  ChevronDown
} from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: "inicio", label: "Início", icon: Home, path: "/" },
    { id: "noticias", label: "Notícias", icon: Newspaper, path: "/noticias" },
    { id: "materiais", label: "Materiais Técnicos", icon: FileText, path: "/materiais" },
    { id: "ebooks", label: "E-books", icon: BookOpen, path: "/ebooks" },
    { id: "fornecedores", label: "Fornecedores", icon: Users, path: "/fornecedores" },
    { id: "fundicoes", label: "Fundições", icon: Factory, path: "/fundicoes" },
    { id: "lme", label: "LME", icon: TrendingUp, path: "/lme" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="shadow-md sticky top-0 z-40" style={{ backgroundColor: 'hsl(var(--header-footer))' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={isActive(item.path) ? "default" : "ghost"}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 text-sm h-10 ${
                    isActive(item.path) 
                      ? "bg-primary text-white hover:bg-primary/90" 
                      : "text-white hover:bg-primary hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:bg-white/10 text-sm">
              Mais Categorias
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
