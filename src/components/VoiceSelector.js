import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import './VoiceSelector.css';

const VoiceSelector = ({ onVoiceChange, currentVoice, language = 'es' }) => {
  const { t } = useTranslation();
  const [voices, setVoices] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const filteredVoices = availableVoices.filter(voice => {
        // Filtrar vozes por idioma
        const voiceLang = voice.lang.toLowerCase();
        if (language === 'es') {
          return voiceLang.startsWith('es') || voiceLang.includes('spanish');
        } else if (language === 'pt') {
          return voiceLang.startsWith('pt') || voiceLang.includes('portuguese');
        } else if (language === 'en') {
          return voiceLang.startsWith('en') || voiceLang.includes('english');
        }
        return true;
      });
      
      setVoices(filteredVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [language]);

  const handleVoiceSelect = (voice) => {
    onVoiceChange(voice);
    setIsOpen(false);
  };

  const getVoiceDisplayName = (voice) => {
    if (voice.name.includes('Google')) {
      return `Google ${voice.name.split(' ').pop()}`;
    }
    if (voice.name.includes('Microsoft')) {
      return `Microsoft ${voice.name.split(' ').pop()}`;
    }
    return voice.name;
  };

  const getVoiceFlag = (voice) => {
    const lang = voice.lang.toLowerCase();
    if (lang.startsWith('es')) return '🇪🇸';
    if (lang.startsWith('pt')) return '🇧🇷';
    if (lang.startsWith('en')) return '🇺🇸';
    return '🌐';
  };

  const getVoiceCountry = (voice) => {
    const lang = voice.lang.toLowerCase();
    if (lang.includes('es-es')) return 'Espanha';
    if (lang.includes('es-mx')) return 'México';
    if (lang.includes('es-ar')) return 'Argentina';
    if (lang.includes('es-co')) return 'Colômbia';
    if (lang.includes('es-ve')) return 'Venezuela';
    if (lang.includes('es-pe')) return 'Peru';
    if (lang.includes('es-cl')) return 'Chile';
    if (lang.includes('es-uy')) return 'Uruguai';
    if (lang.includes('es-py')) return 'Paraguai';
    if (lang.includes('es-bo')) return 'Bolívia';
    if (lang.includes('es-ec')) return 'Equador';
    if (lang.includes('es-cr')) return 'Costa Rica';
    if (lang.includes('es-pa')) return 'Panamá';
    if (lang.includes('es-gt')) return 'Guatemala';
    if (lang.includes('es-hn')) return 'Honduras';
    if (lang.includes('es-sv')) return 'El Salvador';
    if (lang.includes('es-ni')) return 'Nicarágua';
    if (lang.includes('es-cu')) return 'Cuba';
    if (lang.includes('es-do')) return 'República Dominicana';
    if (lang.includes('es-pr')) return 'Porto Rico';
    if (lang.startsWith('es')) return 'Espanhol (Geral)';
    
    if (lang.includes('pt-br')) return 'Brasil';
    if (lang.includes('pt-pt')) return 'Portugal';
    if (lang.startsWith('pt')) return 'Português (Geral)';
    
    if (lang.includes('en-us')) return 'Estados Unidos';
    if (lang.includes('en-gb')) return 'Reino Unido';
    if (lang.includes('en-au')) return 'Austrália';
    if (lang.includes('en-ca')) return 'Canadá';
    if (lang.includes('en-nz')) return 'Nova Zelândia';
    if (lang.includes('en-ie')) return 'Irlanda';
    if (lang.includes('en-za')) return 'África do Sul';
    if (lang.startsWith('en')) return 'Inglês (Geral)';
    
    return 'Outros';
  };

  const groupVoicesByCountry = (voices) => {
    const grouped = {};
    voices.forEach(voice => {
      const country = getVoiceCountry(voice);
      if (!grouped[country]) {
        grouped[country] = [];
      }
      grouped[country].push(voice);
    });
    return grouped;
  };

  return (
    <div className="voice-selector">
      <button 
        className="voice-selector-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('interface.selectVoice')}
      >
        <span className="voice-icon">▶️</span>
        <span className="voice-name">
          {currentVoice ? getVoiceDisplayName(currentVoice) : 'Voz'}
        </span>
        <span className="voice-flag">
          {currentVoice ? getVoiceFlag(currentVoice) : '🌐'}
        </span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="voice-dropdown">
          <div className="voice-dropdown-header">
            <span>Selecionar Voz</span>
            <button 
              className="close-btn"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
          
          <div className="voice-list">
            {voices.length > 0 ? (
              Object.entries(groupVoicesByCountry(voices)).map(([country, countryVoices]) => (
                <div key={country} className="voice-country-group">
                  <div className="country-header">
                    <span className="country-name">{country}</span>
                    <span className="voice-count">({countryVoices.length})</span>
                  </div>
                  <div className="country-voices">
                    {countryVoices.map((voice, index) => (
                      <button
                        key={`${country}-${index}`}
                        className={`voice-option ${currentVoice === voice ? 'selected' : ''}`}
                        onClick={() => handleVoiceSelect(voice)}
                      >
                        <span className="voice-flag">{getVoiceFlag(voice)}</span>
                        <span className="voice-name">{getVoiceDisplayName(voice)}</span>
                        <span className="voice-lang">{voice.lang}</span>
                        {currentVoice === voice && <span className="check-icon">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-voices">
                <span>Nenhuma voz disponível</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceSelector;
