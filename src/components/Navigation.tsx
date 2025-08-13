
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Newspaper, 
  FileText, 
  BookOpen, 
  Users, 
  Factory, 
  Star,
  ChevronDown
} from "lucide-react";

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("noticias");

  const navItems = [
    { id: "noticias", label: "Notícias", icon: Newspaper },
    { id: "materiais", label: "Materiais Técnicos", icon: FileText },
    { id: "ebooks", label: "E-books", icon: BookOpen },
    { id: "fornecedores", label: "Fornecedores", icon: Users },
    { id: "fundicoes", label: "Fundições", icon: Factory },
    { id: "patrocinadas", label: "Patrocinadas", icon: Star },
  ];

  return (
    <nav className="bg-lead-light shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center space-x-2 text-sm h-10 ${
                    activeSection === item.id 
                      ? "bg-primary text-white hover:bg-primary/90" 
                      : "text-white hover:bg-white/10"
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
