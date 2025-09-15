import React, { useState, useEffect } from 'react';
import './PhraseCard.css';
import Modal from './Modal';

const PhraseCard = ({ phrase, fromLanguage = 'auto', toLanguage = 'pt' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voices, setVoices] = useState([]);

  // Carregar vozes disponíveis
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Funções para determinar o texto e idioma corretos
  const getOriginalText = () => {
    if (phrase.original) return phrase.original;
    if (fromLanguage === 'es' || fromLanguage === 'auto') return phrase.spanish;
    if (fromLanguage === 'pt') return phrase.portuguese;
    if (fromLanguage === 'en') return phrase.english;
    return phrase.spanish;
  };

  const getTranslationText = () => {
    if (phrase.translation && phrase.targetLanguage === toLanguage) {
      return phrase.translation;
    }
    if (toLanguage === 'pt') return phrase.portuguese;
    if (toLanguage === 'es') return phrase.spanish;
    if (toLanguage === 'en') return phrase.english;
    return phrase.portuguese;
  };

  const getContextText = () => {
    // Para frases, o contexto geralmente está no mesmo idioma da frase original
    // Mas podemos ter diferentes contextos baseados no idioma
    if (phrase.context) return phrase.context;
    return null;
  };

  const getLanguageFlag = (langCode) => {
    const flags = {
      'es': '🇪🇸',
      'pt': '🇧🇷', 
      'en': '🇺🇸',
      'auto': '🔍'
    };
    return flags[langCode] || '🌐';
  };

  const getLanguageName = (langCode) => {
    const names = {
      'es': 'Espanhol',
      'pt': 'Português',
      'en': 'Inglês',
      'auto': 'Detectado'
    };
    return names[langCode] || 'Idioma';
  };

  const playAudio = (text, lang = 'es') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (lang === 'es') {
        utterance.lang = 'es-ES';
        utterance.rate = 0.7; // Mais devagar para frases
        utterance.pitch = 1.0;
        
        const spanishVoice = voices.find(voice => 
          voice.lang.includes('es') && 
          (voice.name.includes('Microsoft') || voice.name.includes('Google') || voice.name.includes('Jorge') || voice.name.includes('Paulina'))
        ) || voices.find(voice => voice.lang.includes('es'));
        
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }
        
      } else if (lang === 'pt') {
        utterance.lang = 'pt-BR';
        utterance.rate = 0.7;
        utterance.pitch = 1.0;
        
        const portugueseVoice = voices.find(voice => 
          voice.lang.includes('pt') && 
          (voice.name.includes('Microsoft') || voice.name.includes('Google') || voice.name.includes('Luciana'))
        ) || voices.find(voice => voice.lang.includes('pt'));
        
        if (portugueseVoice) {
          utterance.voice = portugueseVoice;
        }
        
      } else if (lang === 'en') {
        utterance.lang = 'en-US';
        utterance.rate = 0.7;
        utterance.pitch = 1.0;
        
        const englishVoice = voices.find(voice => 
          voice.lang === 'en-US' && 
          (voice.name.includes('Alex') || voice.name.includes('Samantha') || voice.name.includes('Victoria'))
        ) || voices.find(voice => voice.lang.includes('en-US'));
        
        if (englishVoice) {
          utterance.voice = englishVoice;
        }
      }
      
      window.speechSynthesis.cancel();
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  return (
    <>
      <div className="phrase-card-compact" onClick={handleOpenModal}>
        <div className="word-header">
          <div className="language-indicator">
            <span className="flag">{getLanguageFlag(fromLanguage)}</span>
            <span className="lang-code">{fromLanguage === 'auto' ? 'AUTO' : fromLanguage.toUpperCase()}</span>
          </div>
          <h3 className="original-phrase">{getOriginalText()}</h3>
          <button 
            className="audio-btn"
            onClick={(e) => {
              e.stopPropagation();
              playAudio(getOriginalText(), fromLanguage === 'auto' ? 'es' : fromLanguage);
            }}
            aria-label={`Pronunciar frase em ${getLanguageName(fromLanguage)}`}
          >
            📢
          </button>
        </div>
        
        <div className="translation-preview">
          <div className="translation-header">
            <span className="flag">{getLanguageFlag(toLanguage)}</span>
            <span className="translation-text">{getTranslationText()}</span>
            <button 
              className="audio-btn small"
              onClick={(e) => {
                e.stopPropagation();
                playAudio(getTranslationText(), toLanguage);
              }}
              aria-label={`Pronunciar tradução em ${getLanguageName(toLanguage)}`}
            >
              📢
            </button>
          </div>
        </div>
        
        {phrase.phonetic && (
          <p className="phonetic">/{phrase.phonetic}/</p>
        )}
        
        <span className="category">Frase</span>
        
        {/* Mostrar contexto se disponível */}
        {getContextText() && (
          <div className="example-preview">
            <p className="example-text">💡 {getContextText()}</p>
          </div>
        )}
        
        <div className="click-hint">
          <span>👆 Clique para ver detalhes</span>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={`💬 ${getOriginalText()}`}
      >
        <div className="modal-phrase-content">
          <div className="phrase-translations">
            {/* Frase original */}
            <div className="translation-row">
              <span className="flag">{getLanguageFlag(fromLanguage)}</span>
              <div className="translation-content">
                <p className="translation-text">{getOriginalText()}</p>
                <button 
                  className="audio-btn small"
                  onClick={() => playAudio(getOriginalText(), fromLanguage === 'auto' ? 'es' : fromLanguage)}
                  aria-label={`Pronunciar frase em ${getLanguageName(fromLanguage)}`}
                >
                  📢
                </button>
              </div>
            </div>
            
            {/* Tradução no idioma selecionado */}
            <div className="translation-row">
              <span className="flag">{getLanguageFlag(toLanguage)}</span>
              <div className="translation-content">
                <p className="translation-text">{getTranslationText()}</p>
                <button 
                  className="audio-btn small"
                  onClick={() => playAudio(getTranslationText(), toLanguage)}
                  aria-label={`Pronunciar tradução em ${getLanguageName(toLanguage)}`}
                >
                  📢
                </button>
              </div>
            </div>
          </div>
          
          {phrase.context && (
            <div className="phrase-context">
              <div className="context-header">
                <span className="context-icon">💡</span>
                <span className="context-label">Contexto de uso:</span>
              </div>
              <p className="context-text">{phrase.context}</p>
            </div>
          )}
          
          {phrase.analysis && (
            <div className="linguistic-analysis">
              <div className="analysis-header">
                <span className="analysis-icon">🧠</span>
                <span className="analysis-label">Análise Linguística</span>
                {phrase.commonness && (
                  <span className={`commonness-badge ${phrase.commonness.replace(' ', '-')}`}>
                    {phrase.commonness}
                  </span>
                )}
              </div>
              <p className="analysis-text">{phrase.analysis}</p>
              {phrase.tips && (
                <div className="tips-section">
                  <div className="tips-header">
                    <span className="tips-icon">💡</span>
                    <span className="tips-label">Dicas de uso:</span>
                  </div>
                  <p className="tips-text">{phrase.tips}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default PhraseCard;
