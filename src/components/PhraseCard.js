import React, { useState, useEffect } from 'react';
import './PhraseCard.css';
import Modal from './Modal';

const PhraseCard = ({ phrase }) => {
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
          <h3 className="spanish-word">{phrase.spanish}</h3>
          <button 
            className="audio-btn"
            onClick={(e) => {
              e.stopPropagation();
              playAudio(phrase.spanish, 'es');
            }}
            aria-label="Pronunciar frase em espanhol"
          >
            📢
          </button>
        </div>
        
        {phrase.phonetic && (
          <p className="phonetic">/{phrase.phonetic}/</p>
        )}
        
        <span className="category">Frase</span>
        
        <div className="click-hint">
          <span>👆 Clique para ver a tradução</span>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={`💬 ${phrase.spanish}`}
      >
        <div className="modal-phrase-content">
          <div className="phrase-translations">
            <div className="translation-row">
              <span className="flag">🇪🇸</span>
              <div className="translation-content">
                <p className="translation-text">{phrase.spanish}</p>
                <button 
                  className="audio-btn small"
                  onClick={() => playAudio(phrase.spanish, 'es')}
                  aria-label="Pronunciar frase em espanhol"
                >
                  📢
                </button>
              </div>
            </div>
            
            <div className="translation-row">
              <span className="flag">🇧🇷</span>
              <div className="translation-content">
                <p className="translation-text">{phrase.portuguese}</p>
                <button 
                  className="audio-btn small"
                  onClick={() => playAudio(phrase.portuguese, 'pt')}
                  aria-label="Pronunciar tradução em português"
                >
                  📢
                </button>
              </div>
            </div>
            
            <div className="translation-row">
              <span className="flag">🇺🇸</span>
              <div className="translation-content">
                <p className="translation-text">{phrase.english}</p>
                <button 
                  className="audio-btn small"
                  onClick={() => playAudio(phrase.english, 'en')}
                  aria-label="Pronunciar tradução em inglês"
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
