import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguageUtils, type SupportedLanguage, languageNames } from "@/utils/i18nUtils";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useLanguageUtils();

  const languages: Array<{ code: SupportedLanguage; name: string; flag: string }> = [
    { code: 'pt', name: languageNames.pt, flag: '/flags/pt.svg' },
    { code: 'es', name: languageNames.es, flag: '/flags/es.svg' },
    { code: 'en', name: languageNames.en, flag: '/flags/en.svg' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <img
            src={languages.find(lang => lang.code === currentLanguage)?.flag}
            alt={languageNames[currentLanguage]}
            className="h-5 w-5 rounded-sm object-cover"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <img
              src={language.flag}
              alt={language.name}
              className="h-4 w-4 rounded-sm object-cover"
            />
            <span className="text-sm">{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;