import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, onClear }) => {
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
      onSearch(terms);
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
    onSearch(newTerms);
    
    if (newTerms.length === 0) {
      setInputValue('');
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Digite uma ou mais palavras separadas por vírgula..."
          className="search-input"
        />
        <div className="search-buttons">
          <button onClick={handleSearch} className="search-btn">
            🔍 Buscar
          </button>
          {(inputValue || searchTerms.length > 0) && (
            <button onClick={handleClear} className="clear-btn">
              ✕ Limpar
            </button>
          )}
        </div>
      </div>
      
      {searchTerms.length > 0 && (
        <div className="search-terms">
          <span className="search-terms-label">Buscando por:</span>
          <div className="terms-list">
            {searchTerms.map((term, index) => (
              <span key={index} className="search-term-tag">
                {term}
                <button
                  onClick={() => removeSearchTerm(index)}
                  className="remove-term-btn"
                  aria-label={`Remover termo "${term}"`}
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
