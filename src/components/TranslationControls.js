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
          <div className="fixed-language-display">
            <span className="language-flag">🇪🇸</span>
            <span className="language-name">{t('languages.es')}</span>
          </div>
        </div>

        <div className="selector-container">
          <label className="selector-label">{t('interface.to')}</label>
          <div className="fixed-language-display">
            <span className="language-flag">🇧🇷</span>
            <span className="language-name">{t('languages.pt')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationControls;
