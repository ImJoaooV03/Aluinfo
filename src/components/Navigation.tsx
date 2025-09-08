
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useLanguageUtils, pathWithLang } from "@/utils/i18nUtils";
import { 
  Home,
  Newspaper, 
  FileText, 
  BookOpen, 
  Users, 
  Factory,
  TrendingUp,
  ChevronDown,
  Megaphone
} from "lucide-react";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('navigation');
  const { currentLanguage, pathWithoutLanguage } = useLanguageUtils();

  const navItems = [
    { id: "inicio", label: t('home'), icon: Home, path: "" },
    { id: "noticias", label: t('news'), icon: Newspaper, path: "noticias" },
    { id: "materiais", label: t('technicalMaterials'), icon: FileText, path: "artigos-tecnicos" },
    { id: "ebooks", label: t('ebooks'), icon: BookOpen, path: "ebooks" },
    { id: "fornecedores", label: t('suppliers'), icon: Users, path: "fornecedores" },
    { id: "fundicoes", label: t('foundries'), icon: Factory, path: "fundicoes" },
    { id: "anuncie", label: t('advertise'), icon: Megaphone, path: "anuncie" },
  ];

  const isActive = (path: string) => {
    const fullPath = pathWithLang(path, currentLanguage);
    return location.pathname === fullPath;
  };

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
                  onClick={() => navigate(pathWithLang(item.path, currentLanguage))}
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
              {t('moreCategories')}
              <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
