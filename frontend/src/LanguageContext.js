import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext({ lang: 'es', toggleLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('es');
  const toggleLang = () => setLang((l) => (l === 'es' ? 'en' : 'es'));
  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
