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
  // Always return 'pt' since we're not using language prefixes anymore
  return 'pt';
};

export const getPathWithoutLanguage = (pathname: string): string => {
  // Strip language prefix if present for compatibility
  const segments = pathname.split('/');
  const langSegment = segments[1];
  
  if (supportedLanguages.includes(langSegment as SupportedLanguage)) {
    return '/' + segments.slice(2).join('/');
  }
  
  return pathname;
};

export const pathWithLang = (path: string, lang: SupportedLanguage): string => {
  // Return clean path without language prefix
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // If path is empty or just "/", return root
  if (!path || path === '/' || cleanPath === '/') {
    return '/';
  }
  
  return cleanPath;
};

export const useLanguageUtils = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentLanguage = getLanguageFromPath(location.pathname);
  const pathWithoutLanguage = getPathWithoutLanguage(location.pathname);
  
  const changeLanguage = (newLang: SupportedLanguage) => {
    // No-op since we're not using language switching anymore
    // Keep the function for compatibility but don't navigate
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

export const formatPrice = (price: number, currency: string = 'BRL', lang: SupportedLanguage = 'pt'): string => {
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