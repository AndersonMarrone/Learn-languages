import React, { useState, useRef, useEffect } from 'react';
import './LanguageSelector.css';

const LANGUAGES = [
  { code: 'auto', name: 'Detectar idioma', flag: '🔍' },
  { code: 'es', name: 'Espanhol', flag: '🇪🇸' },
  { code: 'pt', name: 'Português (Brasil)', flag: '🇧🇷' },
  { code: 'en', name: 'Inglês', flag: '🇺🇸' },
];

const LanguageSelector = ({ 
  selectedLanguage, 
  onLanguageChange, 
  type = 'from', // 'from' ou 'to'
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const selectedLang = LANGUAGES.find(lang => lang.code === selectedLanguage) || LANGUAGES[0];

  // Filtrar idiomas baseado na busca
  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focar no input de busca quando abrir
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const handleToggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleLanguageSelect = (language) => {
    onLanguageChange(language.code);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter' && filteredLanguages.length > 0) {
      handleLanguageSelect(filteredLanguages[0]);
    }
  };

  return (
    <div className={`language-selector ${className} ${type}`} ref={dropdownRef}>
      <button
        className={`language-button ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={handleToggleDropdown}
        disabled={disabled}
        aria-label={`Selecionar idioma ${type === 'from' ? 'de origem' : 'de destino'}`}
      >
        <span className="language-flag">{selectedLang.flag}</span>
        <span className="language-name">{selectedLang.name}</span>
        <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          <div className="search-container">
            <input
              ref={inputRef}
              type="text"
              className="language-search"
              placeholder="Buscar idioma..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="languages-list">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language) => (
                <button
                  key={language.code}
                  className={`language-option ${
                    language.code === selectedLanguage ? 'selected' : ''
                  }`}
                  onClick={() => handleLanguageSelect(language)}
                >
                  <span className="language-flag">{language.flag}</span>
                  <span className="language-name">{language.name}</span>
                  {language.code === selectedLanguage && (
                    <span className="check-icon">✓</span>
                  )}
                </button>
              ))
            ) : (
              <div className="no-results">
                <span>Nenhum idioma encontrado</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
