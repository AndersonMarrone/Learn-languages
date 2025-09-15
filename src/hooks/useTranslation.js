import { useLanguage } from '../contexts/LanguageContext';
import { pt } from '../translations/pt';
import { en } from '../translations/en';
import { es } from '../translations/es';

const translations = {
  pt,
  en,
  es
};

export const useTranslation = () => {
  const { language } = useLanguage();
  
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        // Fallback para português se a chave não existir
        value = translations.pt;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object') {
            value = value[fallbackKey];
          } else {
            return key; // Retorna a chave se não encontrar tradução
          }
        }
        break;
      }
    }
    
    if (typeof value === 'string') {
      // Substituir parâmetros na string
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] || match;
      });
    }
    
    return value || key;
  };
  
  return { t, language };
};
