import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import commonPT from '@/locales/pt/common.json';
import commonES from '@/locales/es/common.json';
import commonEN from '@/locales/en/common.json';

import headerPT from '@/locales/pt/header.json';
import headerES from '@/locales/es/header.json';
import headerEN from '@/locales/en/header.json';

import navigationPT from '@/locales/pt/navigation.json';
import navigationES from '@/locales/es/navigation.json';
import navigationEN from '@/locales/en/navigation.json';

import homePT from '@/locales/pt/home.json';
import homeES from '@/locales/es/home.json';
import homeEN from '@/locales/en/home.json';

import footerPT from '@/locales/pt/footer.json';
import footerES from '@/locales/es/footer.json';
import footerEN from '@/locales/en/footer.json';

const resources = {
  pt: {
    common: commonPT,
    header: headerPT,
    navigation: navigationPT,
    home: homePT,
    footer: footerPT,
  },
  es: {
    common: commonES,
    header: headerES,
    navigation: navigationES,
    home: homeES,
    footer: footerES,
  },
  en: {
    common: commonEN,
    header: headerEN,
    navigation: navigationEN,
    home: homeEN,
    footer: footerEN,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // Default language
    fallbackLng: 'pt',
    debug: false,
    
    // Detection options
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },

    interpolation: {
      escapeValue: false,
    },

    // Use namespace
    defaultNS: 'common',
    ns: ['common', 'header', 'navigation', 'home', 'footer'],
  });

export default i18n;