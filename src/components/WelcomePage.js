import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simular carregamento inicial
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-header">
          <div className="welcome-logo">
            <span className="logo-icon">🌍</span>
            <h1 className="logo-text">Idiomas</h1>
          </div>
          <p className="welcome-subtitle">
            Aprenda espanhol de forma interativa e eficiente
          </p>
        </div>

        <div className="welcome-content">
          <div className="welcome-features">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Tradutor Inteligente</h3>
              <p>Traduza palavras e frases com precisão usando nossa base de dados e IA</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Aprendizado Personalizado</h3>
              <p>Gere palavras aleatórias para estudar e faça anotações pessoais</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔊</div>
              <h3>Pronúncia com Áudio</h3>
              <p>Ouça a pronúncia correta de cada palavra em espanhol</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Histórico de Progresso</h3>
              <p>Acompanhe seu progresso e revise palavras estudadas</p>
            </div>
          </div>


          <div className="welcome-stats">
            <div className="stat-item">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Palavras</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Gratuito</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Disponível</span>
            </div>
          </div>
        </div>

        {!isLoaded && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Carregando...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
