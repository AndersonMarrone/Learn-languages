import React, { useState, useEffect } from 'react';
import './PhraseCard.css';
import Modal from './Modal';
import { useTranslation } from '../hooks/useTranslation';

const PhraseCard = ({ phrase, fromLanguage = 'auto', toLanguage = 'pt', globalVoice = null }) => {
  const { t } = useTranslation();
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

  const getEnhancedContext = () => {
    // Criar contextos mais úteis e educativos para frases
    const enhancedContexts = {
      // Frases de cumprimento
      'hola': { es: 'Se usa para cumprimentar alguém', pt: 'Usado para cumprimentar alguém' },
      'buenos días': { es: 'Cumprimento matinal formal', pt: 'Cumprimento matinal formal' },
      'buenas tardes': { es: 'Cumprimento vespertino', pt: 'Cumprimento vespertino' },
      'buenas noches': { es: 'Cumprimento noturno ou despedida', pt: 'Cumprimento noturno ou despedida' },
      'adiós': { es: 'Despedida formal', pt: 'Despedida formal' },
      'hasta luego': { es: 'Despedida informal - "até logo"', pt: 'Despedida informal - "até logo"' },
      
      // Frases de cortesia
      'por favor': { es: 'Expressão de cortesia ao pedir algo', pt: 'Expressão de cortesia ao pedir algo' },
      'gracias': { es: 'Agradecimento', pt: 'Agradecimento' },
      'de nada': { es: 'Resposta ao agradecimento', pt: 'Resposta ao agradecimento' },
      'perdón': { es: 'Pedido de desculpas', pt: 'Pedido de desculpas' },
      'disculpe': { es: 'Pedido de desculpas formal', pt: 'Pedido de desculpas formal' },
      
      // Frases de necessidade
      'tengo hambre': { es: 'Expressa necessidade de comer', pt: 'Expressa necessidade de comer' },
      'tengo sed': { es: 'Expressa necessidade de beber', pt: 'Expressa necessidade de beber' },
      'tengo sueño': { es: 'Expressa necessidade de dormir', pt: 'Expressa necessidade de dormir' },
      'tengo frío': { es: 'Expressa sensação de frio', pt: 'Expressa sensação de frio' },
      'tengo calor': { es: 'Expressa sensação de calor', pt: 'Expressa sensação de calor' },
      
      // Frases de localização
      'dónde está': { es: 'Pergunta sobre localização', pt: 'Pergunta sobre localização' },
      'cómo llegar': { es: 'Pergunta sobre direções', pt: 'Pergunta sobre direções' },
      'estoy perdido': { es: 'Expressa que está perdido', pt: 'Expressa que está perdido' },
      
      // Frases de tempo
      'qué hora es': { es: 'Pergunta sobre o horário', pt: 'Pergunta sobre o horário' },
      'es tarde': { es: 'Indica que está atrasado', pt: 'Indica que está atrasado' },
      'es temprano': { es: 'Indica que está cedo', pt: 'Indica que está cedo' },
      
      // Frases de compras
      'cuánto cuesta': { es: 'Pergunta sobre preço', pt: 'Pergunta sobre preço' },
      'quiero comprar': { es: 'Expressa intenção de comprar', pt: 'Expressa intenção de comprar' },
      'necesito ayuda': { es: 'Pede ajuda', pt: 'Pede ajuda' }
    };

    const phraseKey = phrase.spanish?.toLowerCase();
    if (enhancedContexts[phraseKey]) {
      return enhancedContexts[phraseKey];
    }
    
    // Fallback para contexto original
    return phrase.context;
  };

  const getContextText = () => {
    const context = getEnhancedContext();
    if (context) return context;
    return null;
  };

  const getLanguageFlag = (langCode) => {
    const flags = {
      'es': '🇪🇸',
      'pt': '🇧🇷', 
      'en': '🇺🇸',
      'auto': '🇪🇸' // Mostrar bandeira da Espanha para auto-detect
    };
    return flags[langCode] || '🌐';
  };

  const getLanguageName = (langCode) => {
    const names = {
      'es': 'Espanhol',
      'pt': 'Português',
      'en': 'Inglês',
      'auto': '' // Não mostrar texto para auto-detect, apenas a bandeira
    };
    return names[langCode] || 'Idioma';
  };

  const playAudio = (text, lang = 'es') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      console.log('🎤 PhraseCard playAudio - globalVoice:', globalVoice ? globalVoice.name : 'null');
      
      // SEMPRE usar a voz global selecionada se disponível
      if (globalVoice) {
        utterance.voice = globalVoice;
        utterance.lang = globalVoice.lang; // Usar o idioma da voz selecionada
        console.log('🎤 Usando voz global:', globalVoice.name, 'para texto:', text);
      } else {
        // Fallback: configurar idioma e buscar melhor voz se não há voz global
        if (lang === 'es') {
          utterance.lang = 'es-ES';
          // Priorizar vozes mais naturais (Microsoft > Google > outras)
          const spanishVoice = voices.find(voice => 
            voice.lang.includes('es') && voice.name.includes('Microsoft')
          ) || voices.find(voice => 
            voice.lang.includes('es') && voice.name.includes('Google')
          ) || voices.find(voice => 
            voice.lang.includes('es') && voice.name.includes('Natural')
          ) || voices.find(voice => voice.lang.includes('es'));
          if (spanishVoice) utterance.voice = spanishVoice;
        } else if (lang === 'pt') {
          utterance.lang = 'pt-BR';
          // Priorizar vozes mais naturais (Microsoft > Google > outras)
          const portugueseVoice = voices.find(voice => 
            voice.lang.includes('pt') && voice.name.includes('Microsoft')
          ) || voices.find(voice => 
            voice.lang.includes('pt') && voice.name.includes('Google')
          ) || voices.find(voice => 
            voice.lang.includes('pt') && voice.name.includes('Natural')
          ) || voices.find(voice => voice.lang.includes('pt'));
          if (portugueseVoice) utterance.voice = portugueseVoice;
        } else if (lang === 'en') {
          utterance.lang = 'en-US';
          // Priorizar vozes mais naturais (Microsoft > Google > outras)
          const englishVoice = voices.find(voice => 
            voice.lang.includes('en') && voice.name.includes('Microsoft')
          ) || voices.find(voice => 
            voice.lang.includes('en') && voice.name.includes('Google')
          ) || voices.find(voice => 
            voice.lang.includes('en') && voice.name.includes('Natural')
          ) || voices.find(voice => voice.lang.includes('en'));
          if (englishVoice) utterance.voice = englishVoice;
        }
      }
      
      // Configurações de voz mais naturais para frases
      utterance.rate = 0.65; // Mais devagar para frases (mais natural)
      utterance.pitch = 0.9; // Ligeiramente mais grave
      utterance.volume = 0.9; // Volume um pouco mais alto
      
      // Adicionar pausas naturais nas frases
      utterance.text = utterance.text.replace(/\./g, '. ');
      utterance.text = utterance.text.replace(/,/g, ', ');
      utterance.text = utterance.text.replace(/;/g, '; ');
      utterance.text = utterance.text.replace(/:/g, ': ');
      
      window.speechSynthesis.cancel();
      setTimeout(() => {
        // Verificar se a voz ainda está disponível
        if (utterance.voice && utterance.voice.name) {
          window.speechSynthesis.speak(utterance);
        } else {
          // Fallback: usar voz padrão se a selecionada não estiver disponível
          const defaultVoice = voices.find(voice => voice.lang.includes(utterance.lang.split('-')[0]));
          if (defaultVoice) {
            utterance.voice = defaultVoice;
          }
          window.speechSynthesis.speak(utterance);
        }
      }, 150);
    }
  };

  return (
    <>
      <div className="phrase-card-simple" onClick={handleOpenModal}>
        <div className="phrase-header">
          <div className="language-info">
            <span className="flag">{getLanguageFlag(fromLanguage)}</span>
            <span className="lang-name">{getLanguageName(fromLanguage)}</span>
          </div>
          <h3 className="phrase-text">{getOriginalText()}</h3>
          <button 
            className="audio-btn"
            onClick={(e) => {
              e.stopPropagation();
              playAudio(getOriginalText(), fromLanguage === 'auto' ? 'es' : fromLanguage);
            }}
            aria-label={`Pronunciar frase em ${getLanguageName(fromLanguage)}`}
          >
            ▶️
          </button>
        </div>
        
        <div className="translation-info">
          <div className="language-info">
            <span className="flag">{getLanguageFlag(toLanguage)}</span>
            <span className="lang-name">{getLanguageName(toLanguage)}</span>
          </div>
          <h4 className="translation-text">{getTranslationText()}</h4>
          <button 
            className="audio-btn"
            onClick={(e) => {
              e.stopPropagation();
              playAudio(getTranslationText(), toLanguage);
            }}
            aria-label={`Pronunciar tradução em ${getLanguageName(toLanguage)}`}
          >
            ▶️
          </button>
        </div>
        
        {phrase.phonetic && (
          <p className="phonetic">/{phrase.phonetic}/</p>
        )}
        
        <span className="category">{t('cards.phrase')}</span>
        
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
                  ▶️
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
                  ▶️
                </button>
              </div>
            </div>
          </div>
          
          
          {phrase.analysis && (
            <div className="linguistic-analysis">
              <div className="analysis-header">
                <span className="analysis-icon">🧠</span>
                <span className="analysis-label">{t('interface.linguisticAnalysis')}</span>
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
                  <span className="tips-label">{t('interface.usageTips')}</span>
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
