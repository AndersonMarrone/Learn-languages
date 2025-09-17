import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LanguageSelector from './LanguageSelector';
import ApiKeyConfig from './ApiKeyConfig';
import { useTranslation } from '../hooks/useTranslation';
import './Navigation.css';

const Navigation = ({ apiConfigRef, onApiKeySet }) => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🌍</span>
          <span className="logo-text">Idiomas</span>
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/traduzir" 
            className={`nav-link main-button ${location.pathname === '/traduzir' ? 'active' : ''}`}
          >
            <span className="nav-icon">🔍</span>
            <span className="nav-text">{t('nav.search')}</span>
          </Link>
          
          <Link 
            to="/" 
            className={`nav-link main-button ${location.pathname === '/' || location.pathname === '/aprender' ? 'active' : ''}`}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-text">{t('nav.learn')}</span>
          </Link>
        </div>

        <div className="nav-controls">
          <LanguageSelector />
          <ApiKeyConfig ref={apiConfigRef} onApiKeySet={onApiKeySet} />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
