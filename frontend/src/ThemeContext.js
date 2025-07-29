import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ dark: false, toggleDark: () => {} });

export function ThemeProvider({ children }) {
  // Cargar tema desde localStorage o usar false (claro) por defecto
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem('darkTheme');
    return savedTheme === 'true';
  });

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
  }, [dark]);

  const toggleDark = () => setDark(d => {
    const newDarkMode = !d;
    // Guardar en localStorage
    localStorage.setItem('darkTheme', newDarkMode.toString());
    return newDarkMode;
  });

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
