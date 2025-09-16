import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
import './LanguageSelector.css';

const LanguageSelector = ({ 
  selectedLanguage, 
  onLanguageChange, 
  type = 'global',
  disabled = false,
  className = ''
}) => {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Se recebeu props, usar elas; senão usar contexto global
  const currentLanguageCode = selectedLanguage !== undefined ? selectedLanguage : language;
  const handleLanguageChange = onLanguageChange || changeLanguage;

  const languages = [
    { code: 'pt', name: t('languages.pt'), flag: '🇧🇷' },
    { code: 'es', name: t('languages.es'), flag: '🇪🇸' }
  ];

  // Para selects de tradução, adicionar opção "auto" no from
  const availableLanguages = type === 'from' 
    ? [{ code: 'auto', name: t('languages.auto'), flag: '🌐' }, ...languages]
    : languages;

  const currentLanguage = availableLanguages.find(lang => lang.code === currentLanguageCode);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (langCode) => {
    handleLanguageChange(langCode);
    setIsOpen(false);
  };

  return (
    <div className={`language-selector ${className}`} ref={dropdownRef}>
      <button
        className={`language-button ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label={t('selectors.language')}
      >
        <span className="language-flag">{currentLanguage?.flag}</span>
        <span className="language-name">{currentLanguage?.name}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${currentLanguageCode === lang.code ? 'active' : ''}`}
              onClick={() => handleLanguageSelect(lang.code)}
            >
              <span className="language-flag">{lang.flag}</span>
              <span className="language-name">{lang.name}</span>
              {currentLanguageCode === lang.code && <span className="checkmark">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;