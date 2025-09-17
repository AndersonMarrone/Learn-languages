import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🌍</span>
          <span className="logo-text">Idiomas</span>
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <span className="nav-icon">🔍</span>
            <span className="nav-text">Buscar</span>
          </Link>
          
          <Link 
            to="/aprender" 
            className={`nav-link ${location.pathname === '/aprender' ? 'active' : ''}`}
          >
            <span className="nav-icon">📚</span>
            <span className="nav-text">Aprender</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
