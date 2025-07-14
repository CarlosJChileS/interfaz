import React, { createContext, useContext, useState } from 'react';
import i18n from './i18n';

const LanguageContext = createContext({ lang: 'es', toggleLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es');
  const toggleLang = () =>
    setLang((l) => {
      const newLang = l === 'es' ? 'en' : 'es';
      i18n.changeLanguage(newLang);
      return newLang;
    });
  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
