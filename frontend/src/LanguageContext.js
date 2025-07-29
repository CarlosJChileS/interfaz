import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from './i18n';

const LanguageContext = createContext({ lang: 'es', toggleLang: () => {} });

export function LanguageProvider({ children }) {
  // Cargar idioma desde localStorage o usar 'es' por defecto
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang || 'es';
  });

  // Efecto para sincronizar con i18n al cargar
  useEffect(() => {
    i18n.changeLanguage(lang);
  }, []);

  const toggleLang = () =>
    setLang((l) => {
      const newLang = l === 'es' ? 'en' : 'es';
      i18n.changeLanguage(newLang);
      // Guardar en localStorage
      localStorage.setItem('language', newLang);
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
