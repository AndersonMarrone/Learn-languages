import React, { useState, useEffect } from 'react';
import './WordCard.css';

const WordCard = ({ word }) => {
  const [isFlipped, setIsFlipped] = useState(false);
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

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
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
    <div className={`word-card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <div className="word-card-inner">
        <div className="word-card-front">
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
        
        <div className="word-card-back">
          <div className="translations">
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
            </div>
          </div>
          
          {word.example && (
            <div className="example">
              <div className="example-item">
                <p className="example-text">"{word.example}"</p>
                <button 
                  className="audio-btn example-audio"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(word.example, 'es');
                  }}
                  aria-label="Pronunciar exemplo em espanhol"
                >
                  📢
                </button>
              </div>
              {word.exampleTranslation && (
                <div className="example-item">
                  <p className="example-translation">"{word.exampleTranslation}"</p>
                  <button 
                    className="audio-btn example-audio"
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(word.exampleTranslation, 'pt');
                    }}
                    aria-label="Pronunciar tradução do exemplo"
                  >
                    📢
                  </button>
                </div>
              )}
              {word.exampleEnglish && (
                <div className="example-item">
                  <p className="example-english">"{word.exampleEnglish}"</p>
                  <button 
                    className="audio-btn example-audio"
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
          )}
          
          <div className="click-hint">
            <span>👆 Clique para voltar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCard;
