import React, { useState, useEffect } from 'react';
import './WordCard.css';
import Modal from './Modal';

const WordCard = ({ word, fromLanguage = 'auto', toLanguage = 'pt' }) => {
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

  // Funções para determinar o texto e idioma corretos
  const getOriginalText = () => {
    // Determinar o texto original baseado no idioma de origem
    if (word.original) return word.original; // Para traduções novas do Gemini
    
    // Para compatibilidade com dados antigos
    if (fromLanguage === 'es' || fromLanguage === 'auto') return word.spanish;
    if (fromLanguage === 'pt') return word.portuguese;
    if (fromLanguage === 'en') return word.english;
    return word.spanish; // Fallback
  };

  const getTranslationText = () => {
    // Determinar a tradução baseada no idioma de destino
    if (word.translation && word.targetLanguage === toLanguage) {
      return word.translation; // Para traduções novas do Gemini
    }
    
    // Para compatibilidade com dados antigos
    if (toLanguage === 'pt') return word.portuguese;
    if (toLanguage === 'es') return word.spanish;
    if (toLanguage === 'en') return word.english;
    return word.portuguese; // Fallback
  };

  const getExampleText = () => {
    // Retornar exemplo no idioma de origem
    if (fromLanguage === 'es' || fromLanguage === 'auto') return word.example;
    if (fromLanguage === 'pt') return word.exampleTranslation;
    if (fromLanguage === 'en') return word.exampleEnglish;
    return word.example; // Fallback
  };

  const getExampleTranslation = () => {
    // Retornar tradução do exemplo baseada no idioma de destino
    if (toLanguage === 'pt') return word.exampleTranslation;
    if (toLanguage === 'es') return word.example;
    if (toLanguage === 'en') return word.exampleEnglish;
    return word.exampleTranslation; // Fallback
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
          <div className="language-indicator">
            <span className="flag">{getLanguageFlag(fromLanguage)}</span>
            <span className="lang-code">{fromLanguage === 'auto' ? 'AUTO' : fromLanguage.toUpperCase()}</span>
          </div>
          <h3 className="original-word">{getOriginalText()}</h3>
          <button 
            className="audio-btn"
            onClick={(e) => {
              e.stopPropagation();
              playAudio(getOriginalText(), fromLanguage === 'auto' ? 'es' : fromLanguage);
            }}
            aria-label={`Pronunciar palavra em ${getLanguageName(fromLanguage)}`}
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
        
        {word.phonetic && (
          <p className="phonetic">/{word.phonetic}/</p>
        )}
        
        {word.category && (
          <span className="category">{word.category}</span>
        )}
        
        {/* Mostrar exemplo traduzido se disponível */}
        {getExampleTranslation() && (
          <div className="example-preview">
            <p className="example-text example-translated">"{getExampleTranslation()}"</p>
          </div>
        )}
        
        <div className="click-hint">
          <span>👆 Clique para ver detalhes</span>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={`📖 ${getOriginalText()}`}
      >
        <div className="modal-translations">
          {/* Palavra/frase original */}
          <div className="translation-item">
            <span className="flag">{getLanguageFlag(fromLanguage)}</span>
            <div className="translation-content">
              <p className="translation">{getOriginalText()}</p>
              <button 
                className="audio-btn small"
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(getOriginalText(), fromLanguage === 'auto' ? 'es' : fromLanguage);
                }}
                aria-label={`Pronunciar palavra em ${getLanguageName(fromLanguage)}`}
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
                    playAudio(word.example, fromLanguage === 'auto' ? 'es' : fromLanguage);
                  }}
                  aria-label={`Pronunciar exemplo em ${getLanguageName(fromLanguage)}`}
                >
                  📢
                </button>
              </div>
            )}
          </div>
          
          {/* Tradução no idioma selecionado */}
          <div className="translation-item">
            <span className="flag">{getLanguageFlag(toLanguage)}</span>
            <div className="translation-content">
              <p className="translation">{getTranslationText()}</p>
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
            {/* Mostrar exemplo traduzido se disponível */}
            {((toLanguage === 'pt' && word.exampleTranslation) || 
              (toLanguage === 'en' && word.exampleEnglish) || 
              (toLanguage === 'es' && word.example)) && (
              <div className="flag-example">
                <p className="example-sentence">"{
                  toLanguage === 'pt' ? word.exampleTranslation :
                  toLanguage === 'en' ? word.exampleEnglish :
                  word.example
                }"</p>
                <button 
                  className="audio-btn example-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    const exampleText = toLanguage === 'pt' ? word.exampleTranslation :
                                       toLanguage === 'en' ? word.exampleEnglish :
                                       word.example;
                    playAudio(exampleText, toLanguage);
                  }}
                  aria-label={`Pronunciar exemplo em ${getLanguageName(toLanguage)}`}
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
