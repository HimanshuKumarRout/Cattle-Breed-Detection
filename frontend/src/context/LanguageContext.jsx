import { createContext, useContext, useState, useEffect } from 'react';
import { translate, formatDigits, LANGUAGES } from '../i18n';

const LanguageContext = createContext();

const STORAGE_KEY = 'cattle_ai_lang';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  });

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    localStorage.setItem(STORAGE_KEY, langCode);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key, fallback = '') => {
    return translate(language, key, fallback);
  };

  const formatNum = (val) => {
    return formatDigits(val, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatNum, formatDigits, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
