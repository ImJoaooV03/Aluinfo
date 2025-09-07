import { useLocation, useNavigate } from 'react-router-dom';
import i18n from '@/i18n/i18n';

export type SupportedLanguage = 'pt' | 'es' | 'en';

export const supportedLanguages: SupportedLanguage[] = ['pt', 'es', 'en'];

export const languageNames = {
  pt: 'Português',
  es: 'Español', 
  en: 'English'
};

export const getLanguageFromPath = (pathname: string): SupportedLanguage => {
  const segments = pathname.split('/');
  const langSegment = segments[1];
  
  if (supportedLanguages.includes(langSegment as SupportedLanguage)) {
    return langSegment as SupportedLanguage;
  }
  
  return 'pt'; // Default language
};

export const getPathWithoutLanguage = (pathname: string): string => {
  const segments = pathname.split('/');
  const langSegment = segments[1];
  
  if (supportedLanguages.includes(langSegment as SupportedLanguage)) {
    return '/' + segments.slice(2).join('/');
  }
  
  return pathname;
};

export const pathWithLang = (path: string, lang: SupportedLanguage): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // If path is empty or just "/", return the language prefix
  if (!cleanPath || cleanPath === '/') {
    return `/${lang}`;
  }
  
  return `/${lang}/${cleanPath}`;
};

export const useLanguageUtils = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentLanguage = getLanguageFromPath(location.pathname);
  const pathWithoutLanguage = getPathWithoutLanguage(location.pathname);
  
  const changeLanguage = (newLang: SupportedLanguage) => {
    // Update i18n language
    i18n.changeLanguage(newLang);
    
    // Navigate to the same path with new language
    const newPath = pathWithLang(pathWithoutLanguage, newLang);
    navigate(newPath);
  };
  
  return {
    currentLanguage,
    pathWithoutLanguage,
    changeLanguage
  };
};

// Date and number formatting utilities
export const formatDate = (date: Date | string, lang: SupportedLanguage = 'pt'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const localeMap = {
    pt: 'pt-BR',
    es: 'es-ES',
    en: 'en-US'
  };
  
  return new Intl.DateTimeFormat(localeMap[lang], options).format(dateObj);
};

export const formatNumber = (number: number, lang: SupportedLanguage = 'pt'): string => {
  const localeMap = {
    pt: 'pt-BR',
    es: 'es-ES', 
    en: 'en-US'
  };
  
  return new Intl.NumberFormat(localeMap[lang]).format(number);
};

export const formatPrice = (price: number, currency: string = 'USD', lang: SupportedLanguage = 'pt'): string => {
  const localeMap = {
    pt: 'pt-BR',
    es: 'es-ES',
    en: 'en-US'
  };
  
  return new Intl.NumberFormat(localeMap[lang], {
    style: 'currency',
    currency: currency
  }).format(price);
};