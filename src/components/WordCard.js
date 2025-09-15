import React, { useState, useEffect } from 'react';
import './WordCard.css';
import Modal from './Modal';

const WordCard = ({ word }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voices, setVoices] = useState([]);

  // Carregar vozes disponíveis
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Carregar vozes imediatamente
    loadVoices();
    
    // Também carregar quando as vozes estiverem prontas
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
      
      // Configurar idioma com opções específicas e buscar melhor voz
      if (lang === 'es') {
        utterance.lang = 'es-ES';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        
        // Buscar melhor voz em espanhol
        const spanishVoice = voices.find(voice => 
          voice.lang.includes('es') && 
          (voice.name.includes('Microsoft') || voice.name.includes('Google') || voice.name.includes('Jorge') || voice.name.includes('Paulina'))
        ) || voices.find(voice => voice.lang.includes('es'));
        
        if (spanishVoice) {
          utterance.voice = spanishVoice;
        }
        
      } else if (lang === 'pt') {
        utterance.lang = 'pt-BR';
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        
        // Buscar melhor voz em português
        const portugueseVoice = voices.find(voice => 
          voice.lang.includes('pt') && 
          (voice.name.includes('Microsoft') || voice.name.includes('Google') || voice.name.includes('Luciana'))
        ) || voices.find(voice => voice.lang.includes('pt'));
        
        if (portugueseVoice) {
          utterance.voice = portugueseVoice;
        }
        
      } else if (lang === 'en') {
        utterance.lang = 'en-US';
        utterance.rate = 0.75; // Velocidade otimizada para compreensão
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Buscar a MELHOR voz em inglês americano disponível
        let englishVoice = null;
        
        // Prioridade 1: Vozes nativas de alta qualidade
        englishVoice = voices.find(voice => 
          voice.lang === 'en-US' && 
          (voice.name.includes('Alex') || voice.name.includes('Samantha') || voice.name.includes('Victoria'))
        );
        
        // Prioridade 2: Vozes Microsoft de qualidade
        if (!englishVoice) {
          englishVoice = voices.find(voice => 
            voice.lang.includes('en-US') && 
            voice.name.includes('Microsoft') &&
            (voice.name.includes('Zira') || voice.name.includes('David') || voice.name.includes('Mark'))
          );
        }
        
        // Prioridade 3: Vozes Google
        if (!englishVoice) {
          englishVoice = voices.find(voice => 
            voice.lang.includes('en-US') && 
            voice.name.includes('Google')
          );
        }
        
        // Prioridade 4: Qualquer voz en-US
        if (!englishVoice) {
          englishVoice = voices.find(voice => voice.lang === 'en-US');
        }
        
        // Prioridade 5: Qualquer voz que contenha 'en'
        if (!englishVoice) {
          englishVoice = voices.find(voice => voice.lang.includes('en'));
        }
        
        if (englishVoice) {
          utterance.voice = englishVoice;
          console.log('Usando voz em inglês:', englishVoice.name, englishVoice.lang);
        }
      }
      
      // Parar qualquer fala anterior
      window.speechSynthesis.cancel();
      
      // Reproduzir com um pequeno delay para garantir que a voz esteja pronta
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  return (
    <>
      <div className="word-card-compact" onClick={handleOpenModal}>
        <div className="word-header">
          <h3 className="spanish-word">{word.spanish}</h3>
          <button 
            className="audio-btn"
            onClick={(e) => {
              e.stopPropagation();
              playAudio(word.spanish, 'es');
            }}
            aria-label="Pronunciar palavra em espanhol"
          >
            📢
          </button>
        </div>
        
        {word.phonetic && (
          <p className="phonetic">/{word.phonetic}/</p>
        )}
        
        {word.category && (
          <span className="category">{word.category}</span>
        )}
        
        <div className="click-hint">
          <span>👆 Clique para ver a tradução</span>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={`📖 ${word.spanish}`}
      >
        <div className="modal-translations">
          <div className="translation-item">
            <span className="flag">🇪🇸</span>
            <div className="translation-content">
              <p className="translation">{word.spanish}</p>
              <button 
                className="audio-btn small"
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(word.spanish, 'es');
                }}
                aria-label="Pronunciar palavra em espanhol"
              >
                📢
              </button>
            </div>
            {word.example && (
              <div className="flag-example">
                <p className="example-sentence">"{word.example}"</p>
                <button 
                  className="audio-btn example-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(word.example, 'es');
                  }}
                  aria-label="Pronunciar exemplo em espanhol"
                >
                  📢
                </button>
              </div>
            )}
          </div>
          
          <div className="translation-item">
            <span className="flag">🇧🇷</span>
            <div className="translation-content">
              <p className="translation">{word.portuguese}</p>
              <button 
                className="audio-btn small"
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(word.portuguese, 'pt');
                }}
                aria-label="Pronunciar tradução em português"
              >
                📢
              </button>
            </div>
            {word.exampleTranslation && (
              <div className="flag-example">
                <p className="example-sentence">"{word.exampleTranslation}"</p>
                <button 
                  className="audio-btn example-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(word.exampleTranslation, 'pt');
                  }}
                  aria-label="Pronunciar exemplo em português"
                >
                  📢
                </button>
              </div>
            )}
          </div>
          
          <div className="translation-item">
            <span className="flag">🇺🇸</span>
            <div className="translation-content">
              <p className="translation">{word.english}</p>
              <button 
                className="audio-btn small"
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(word.english, 'en');
                }}
                aria-label="Pronunciar tradução em inglês"
              >
                📢
              </button>
            </div>
            {word.exampleEnglish && (
              <div className="flag-example">
                <p className="example-sentence">"{word.exampleEnglish}"</p>
                <button 
                  className="audio-btn example-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(word.exampleEnglish, 'en');
                  }}
                  aria-label="Pronunciar exemplo em inglês"
                >
                  📢
                </button>
              </div>
            )}
          </div>
        </div>
        
        {word.analysis && (
          <div className="linguistic-analysis">
            <div className="analysis-header">
              <span className="analysis-icon">🧠</span>
              <span className="analysis-label">Análise Linguística</span>
              {word.commonness && (
                <span className={`commonness-badge ${word.commonness.replace(' ', '-')}`}>
                  {word.commonness}
                </span>
              )}
            </div>
            <p className="analysis-text">{word.analysis}</p>
            {word.tips && (
              <div className="tips-section">
                <div className="tips-header">
                  <span className="tips-icon">💡</span>
                  <span className="tips-label">Dicas de uso:</span>
                </div>
                <p className="tips-text">{word.tips}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default WordCard;
