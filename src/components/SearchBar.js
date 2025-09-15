import React, { useState } from 'react';
import TranslationControls from './TranslationControls';
import { useTranslation } from '../hooks/useTranslation';
import './SearchBar.css';

const SearchBar = ({ 
  onSearch, 
  onClear, 
  fromLanguage = 'auto',
  toLanguage = 'pt',
  onFromLanguageChange,
  onToLanguageChange,
  onSwapLanguages 
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [searchTerms, setSearchTerms] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      const terms = inputValue
        .split(',')
        .map(term => term.trim())
        .filter(term => term.length > 0);
      
      setSearchTerms(terms);
      onSearch(terms, fromLanguage, toLanguage);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setSearchTerms([]);
    onClear();
  };

  const removeSearchTerm = (indexToRemove) => {
    const newTerms = searchTerms.filter((_, index) => index !== indexToRemove);
    setSearchTerms(newTerms);
    onSearch(newTerms, fromLanguage, toLanguage);
    
    if (newTerms.length === 0) {
      setInputValue('');
    }
  };

  return (
    <div className="search-bar">
      <TranslationControls
        fromLanguage={fromLanguage}
        toLanguage={toLanguage}
        onFromLanguageChange={onFromLanguageChange}
        onToLanguageChange={onToLanguageChange}
        onSwapLanguages={onSwapLanguages}
        disabled={false}
      />
      
      <div className="search-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={t('search.placeholder')}
          className="search-input"
        />
        <div className="search-buttons">
          <button onClick={handleSearch} className="search-btn">
            🔍 {t('search.button')}
          </button>
          {(inputValue || searchTerms.length > 0) && (
            <button onClick={handleClear} className="clear-btn">
              ✕ {t('buttons.clear')}
            </button>
          )}
        </div>
      </div>
      
      {searchTerms.length > 0 && (
        <div className="search-terms">
          <span className="search-terms-label">{t('interface.searchingFor')}</span>
          <div className="terms-list">
            {searchTerms.map((term, index) => (
              <span key={index} className="search-term-tag">
                {term}
                <button
                  onClick={() => removeSearchTerm(index)}
                  className="remove-term-btn"
                  aria-label={`${t('buttons.remove')} termo "${term}"`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
