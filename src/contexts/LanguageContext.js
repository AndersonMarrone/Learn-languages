import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Verificar se há idioma salvo no localStorage
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && ['pt', 'en', 'es'].includes(savedLanguage)) {
      return savedLanguage;
    }
    // Idioma padrão baseado no navegador
    const browserLanguage = navigator.language.split('-')[0];
    return ['pt', 'en', 'es'].includes(browserLanguage) ? browserLanguage : 'pt';
  });

  useEffect(() => {
    // Salvar idioma no localStorage quando mudar
    localStorage.setItem('app-language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (['pt', 'en', 'es'].includes(newLanguage)) {
      setLanguage(newLanguage);
    }
  };

  const value = {
    language,
    changeLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
