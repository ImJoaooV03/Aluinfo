
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import AdBanner from "./AdBanner";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation(['header', 'common']);
  

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Redirect to news page with search parameter
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
    <header className="shadow-lg" style={{ backgroundColor: 'hsl(var(--header-footer))' }}>
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="text-sm text-white">
            {t('header:tagline')}
          </div>
          <div className="flex items-center space-x-4">
            <a href="/#newsletter">
              <Button variant="ghost" size="sm" className="text-sm text-primary hover:text-primary-foreground hover:bg-primary">
                {t('header:newsletter')}
              </Button>
            </a>
            <Link to="/anuncie">
              <Button variant="ghost" size="sm" className="text-sm text-primary hover:text-primary-foreground hover:bg-primary">
                {t('header:advertise')}
              </Button>
            </Link>
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="sm" className="text-sm text-primary hover:text-primary-foreground hover:bg-primary">
                <Settings className="h-3 w-3 mr-1" />
                {t('header:admin')}
              </Button>
            </Link>
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
          <form onSubmit={handleSearch} className="flex items-center ml-8" style={{width: "600px"}}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('common:searchPlaceholder')} 
                className="pl-10 w-full"
              />
              <Button 
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
              >
                {t('header:searchButton')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
