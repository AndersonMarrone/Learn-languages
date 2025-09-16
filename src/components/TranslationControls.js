import React from 'react';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';
import './TranslationControls.css';

const TranslationControls = ({
  fromLanguage,
  toLanguage,
  onFromLanguageChange,
  onToLanguageChange,
  onSwapLanguages,
  disabled = false
}) => {
  const { t } = useTranslation();
  const handleSwap = () => {
    if (!disabled) {
      onSwapLanguages();
    }
  };

  const canSwap = fromLanguage !== toLanguage;

  return (
    <div className="translation-controls">
      <div className="language-selectors">
        <div className="selector-container">
          <label className="selector-label">{t('interface.from')}</label>
          <LanguageSelector
            selectedLanguage={fromLanguage}
            onLanguageChange={onFromLanguageChange}
            type="from"
            disabled={disabled}
            className="from-selector"
          />
        </div>

        <div className="swap-container">
          <button
            className={`swap-button ${canSwap && !disabled ? 'enabled' : 'disabled'}`}
            onClick={handleSwap}
            disabled={!canSwap || disabled}
            aria-label={t('interface.swapLanguages')}
            title={
              !canSwap 
                ? t('interface.cannotSwapAuto')
                : t('interface.swapLanguagesTooltip')
            }
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="swap-icon"
            >
              <path 
                d="M16 17L21 12L16 7M8 7L3 12L8 17M21 12H3" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="selector-container">
          <label className="selector-label">{t('interface.to')}</label>
          <LanguageSelector
            selectedLanguage={toLanguage}
            onLanguageChange={onToLanguageChange}
            type="to"
            disabled={disabled}
            className="to-selector"
          />
        </div>
      </div>
    </div>
  );
};

export default TranslationControls;
