import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WordCard from './components/WordCard';
import PhraseCard from './components/PhraseCard';
import SearchHistory from './components/SearchHistory';
import VoiceInfo from './components/VoiceInfo';
import ApiKeyConfig from './components/ApiKeyConfig';
import LanguageSelector from './components/LanguageSelector';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './contexts/ToastContext';
import { useTranslation } from './hooks/useTranslation';
import translationService from './services/translationService';
import historyService from './services/historyService';
import { spanishWords } from './data/spanishWords';

function AppContent() {
  const { t } = useTranslation();
  const [searchTerms, setSearchTerms] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResults, setGeminiResults] = useState([]);
  // const [lastValidHistory, setLastValidHistory] = useState([]);
  const [fromLanguage, setFromLanguage] = useState('es');
  const [toLanguage, setToLanguage] = useState('pt');
  const [globalVoice, setGlobalVoice] = useState(null);
  const apiConfigRef = useRef();

  const handleVoiceChange = useCallback((voice) => {
    console.log('🎤 App.js recebeu mudança de voz:', voice ? voice.name : 'null');
    setGlobalVoice(voice);
  }, []);

  useEffect(() => {
    // Verificar se já tem API key configurada ao carregar
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      translationService.setApiKey(savedKey).then(success => {
        console.log('🔧 Inicialização do Gemini:', success ? 'sucesso' : 'falhou');
      });
    }

    // Inicializar cache persistente do histórico
    historyService.initializeCache();
    const initialHistory = historyService.getHistoryOrCache();
    // setLastValidHistory(initialHistory);
    console.log('🚀 Cache persistente inicializado:', initialHistory.length, 'itens');
  }, []);

  useEffect(() => {
    if (searchTerms.length === 0) {
      setSearchResults([]);
      setGeminiResults([]);
      return;
    }

    const performSearch = async () => {
      setIsLoading(true);
      setGeminiResults([]);
      
      // 1. Buscar na base de dados local
      const localResults = spanishWords.filter(word => 
        searchTerms.some(term => 
          word.spanish.toLowerCase().includes(term.toLowerCase()) ||
          word.portuguese.toLowerCase().includes(term.toLowerCase()) ||
          word.english.toLowerCase().includes(term.toLowerCase())
        )
      );
      
      console.log('🔍 Busca na base de dados encontrou:', localResults.length, 'resultados');

      // 2. Buscar no histórico (para termos não encontrados na base)
      const termsNotFoundLocally = searchTerms.filter(term => 
        !localResults.some(word => 
          word.spanish.toLowerCase().includes(term.toLowerCase()) ||
          word.portuguese.toLowerCase().includes(term.toLowerCase()) ||
          word.english.toLowerCase().includes(term.toLowerCase())
        )
      );

      let historyResults = [];
      if (termsNotFoundLocally.length > 0) {
        console.log('🔍 Buscando no histórico para termos:', termsNotFoundLocally);
        
        const fullHistory = historyService.getHistory();
        historyResults = fullHistory.filter(word => 
          termsNotFoundLocally.some(term => 
            word.spanish.toLowerCase().includes(term.toLowerCase()) ||
            word.portuguese?.toLowerCase().includes(term.toLowerCase()) ||
            word.english?.toLowerCase().includes(term.toLowerCase())
          )
        );
        
        console.log('📚 Busca no histórico encontrou:', historyResults.length, 'resultados');
      }

      // Combinar resultados da base de dados e histórico
      const allFoundResults = [...localResults, ...historyResults];
      setSearchResults(allFoundResults);

      // Salvar todos os resultados encontrados no histórico (atualiza contadores)
      console.log('📚 Salvando no histórico:', allFoundResults.length, 'palavras');
      allFoundResults.forEach(word => {
        console.log('💾 Salvando palavra:', word.spanish);
        const saved = historyService.saveToHistory(word);
        console.log('✅ Resultado do salvamento:', saved);
      });

      // Atualizar cache do último histórico válido
      const currentHistory = historyService.getHistory();
      // setLastValidHistory(currentHistory);
      console.log('💾 Cache do histórico atualizado:', currentHistory.length, 'itens');

      // 3. Buscar termos ainda não encontrados no Gemini
      const termsNotFoundAnywhere = searchTerms.filter(term => 
        !allFoundResults.some(word => 
          word.spanish.toLowerCase().includes(term.toLowerCase()) ||
          word.portuguese?.toLowerCase().includes(term.toLowerCase()) ||
          word.english?.toLowerCase().includes(term.toLowerCase())
        )
      );

      // Se ainda há termos não encontrados e tem Gemini configurado, buscar com AI
      if (termsNotFoundAnywhere.length > 0 && translationService.isGeminiAvailable()) {
        console.log('🤖 Iniciando busca com Gemini para termos não encontrados:', termsNotFoundAnywhere);
        try {
          const aiResults = [];
          
          // Buscar apenas termos não encontrados com Gemini
          for (const term of termsNotFoundAnywhere) {
            console.log('🔄 Traduzindo com Gemini:', term);
            const translation = await translationService.translateWord(term, fromLanguage, toLanguage);
            console.log('📝 Resultado do Gemini:', translation);
            
            if (translation && translation.source !== 'not_found') {
              aiResults.push(translation);
            }
          }
          
          console.log('✅ Resultados finais do Gemini:', aiResults.length);
          if (aiResults.length > 0) {
            setGeminiResults(aiResults);
            // Salvar resultados da IA no histórico
            aiResults.forEach(word => {
              historyService.saveToHistory(word);
            });
            
            // Atualizar cache do histórico após IA
            const updatedHistory = historyService.getHistory();
            // setLastValidHistory(updatedHistory);
            console.log('💾 Cache atualizado após IA:', updatedHistory.length, 'itens');
          }
        } catch (error) {
          console.error('❌ Erro na busca com Gemini:', error);
        }
      }
      
      setIsLoading(false);
    };

    performSearch();
  }, [searchTerms, fromLanguage, toLanguage]);


  const handleSearch = (terms, fromLang, toLang) => {
    setSearchTerms(terms);
    if (fromLang !== undefined) setFromLanguage(fromLang);
    if (toLang !== undefined) setToLanguage(toLang);
  };

  const clearSearch = () => {
    setSearchTerms([]);
    setSearchResults([]);
    setGeminiResults([]);
  };

  const handleApiKeySet = (hasKey) => {
    console.log('🔧 API key configurada:', hasKey);
  };

  const handleWordFromHistory = (word) => {
    // Quando uma palavra é selecionada do histórico, fazer nova busca
    setSearchTerms([word.spanish]);
  };

  const handleFromLanguageChange = (langCode) => {
    setFromLanguage(langCode);
    // Se há termos de busca, refazer a busca com o novo idioma
    if (searchTerms.length > 0) {
      // Trigger re-search by updating the dependency
      setSearchTerms([...searchTerms]);
    }
  };

  const handleToLanguageChange = (langCode) => {
    setToLanguage(langCode);
    // Se há termos de busca, refazer a busca com o novo idioma
    if (searchTerms.length > 0) {
      // Trigger re-search by updating the dependency
      setSearchTerms([...searchTerms]);
    }
  };

  const handleSwapLanguages = () => {
    const tempFrom = fromLanguage;
    setFromLanguage(toLanguage);
    setToLanguage(tempFrom);
    
    // Se há termos de busca, refazer a busca com idiomas trocados
    if (searchTerms.length > 0) {
      // Trigger re-search by updating the dependency
      setSearchTerms([...searchTerms]);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">
                <span className="logo-icon">🌍</span>
                <h1>{t('app.title')}</h1>
              </div>
              <p className="tagline">{t('app.subtitle')}</p>
            </div>
            <div className="header-controls">
              <LanguageSelector />
              <div className="header-stats">
                <div className="stat-item">
                  <span className="stat-number">{searchResults.length + geminiResults.length}</span>
                  <span className="stat-label">{t('search.results')}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="search-section">
          <SearchBar 
            onSearch={handleSearch} 
            onClear={clearSearch}
            fromLanguage={fromLanguage}
            toLanguage={toLanguage}
            onFromLanguageChange={handleFromLanguageChange}
            onToLanguageChange={handleToLanguageChange}
            onSwapLanguages={handleSwapLanguages}
          />
        </div>

        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>{t('search.loading')}</p>
          </div>
        )}

        {!isLoading && searchResults.length > 0 && (
          <div className="results-section">
            <div className="section-header">
              <div className="section-title">
                <span className="section-icon">🔍</span>
              </div>
            </div>
            <div className="words-grid">
              {searchResults.map((word, index) => (
                <WordCard 
                  key={`found-${index}`} 
                  word={word} 
                  fromLanguage={fromLanguage}
                  toLanguage={toLanguage}
                  globalVoice={globalVoice}
                />
              ))}
            </div>
          </div>
        )}

        {!isLoading && searchResults.length > 0 && geminiResults.length > 0 && (
          <div className="section-divider"></div>
        )}

        {!isLoading && geminiResults.length > 0 && (
          <div className="results-section">
            <div className="section-header">
              <div className="section-title">
                <span className="section-icon">🤖</span>
                <h2>{t('interface.newTranslations')}</h2>
              </div>
              <div className="section-description">
                {t('interface.aiDescription')}
              </div>
            </div>
            <div className="words-grid">
              {geminiResults.map((item, index) => (
                item.type === 'phrase' ? (
                  <PhraseCard 
                    key={`phrase-${index}`} 
                    phrase={item} 
                    fromLanguage={fromLanguage}
                    toLanguage={toLanguage}
                    globalVoice={globalVoice}
                  />
                ) : (
                  <WordCard 
                    key={`gemini-${index}`} 
                    word={item} 
                    fromLanguage={fromLanguage}
                    toLanguage={toLanguage}
                    globalVoice={globalVoice}
                  />
                )
              ))}
            </div>
          </div>
        )}

        {/* Histórico quando ENCONTRA palavras */}
        {!isLoading && (searchResults.length > 0 || geminiResults.length > 0) && (
          <SearchHistory 
            key="found-results-history" 
            onWordSelect={handleWordFromHistory} 
            instanceId="found-results"
            expandedLimit={8}
            fromLanguage={fromLanguage}
            toLanguage={toLanguage}
            globalVoice={globalVoice}
          />
        )}

        {/* Histórico quando NÃO encontra palavras - EXATAMENTE IGUAL */}
        {!isLoading && searchTerms.length > 0 && searchResults.length === 0 && geminiResults.length === 0 && (
          <>
            <div className="no-results">
              <p>{t('search.noResults')}</p>
              {!translationService.isGeminiAvailable() && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '12px', 
                  backgroundColor: '#fef3c7', 
                  borderRadius: '8px',
                  border: '1px solid #f59e0b'
                }}>
                  <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#92400e' }}>
                    {t('interface.wantToSearch')}
                  </p>
                  <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#92400e' }}>
                    {t('interface.configureDescription')}
                  </p>
                  <button 
                    onClick={() => {
                      // Abrir configuração da API
                      if (apiConfigRef.current) {
                        apiConfigRef.current.openConfig();
                      }
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 8px rgba(245, 158, 11, 0.3)';
                    }}
                  >
                    ⚙️ {t('interface.configureGemini')}
                  </button>
                </div>
              )}
              {translationService.isGeminiAvailable() && (
                <p>{t('interface.tryOtherWords')}</p>
              )}
            </div>
            
            <SearchHistory 
              key="no-results-history" 
              onWordSelect={handleWordFromHistory} 
              instanceId="no-results"
              expandedLimit={50}
              fromLanguage={fromLanguage}
              toLanguage={toLanguage}
              globalVoice={globalVoice}
            />
          </>
        )}

        {searchTerms.length === 0 && (
          <div className="usage-guide">
            <div className="usage-header">
              <div className="usage-icon">🚀</div>
              <h2>{t('usage.title')}</h2>
              <p className="usage-subtitle">{t('usage.subtitle')}</p>
            </div>
            
            <div className="usage-steps">
              <div className="usage-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <div className="step-icon">✍️</div>
                  <h3>{t('usage.step1.title')}</h3>
                  <p>{t('usage.step1.description')}</p>
                </div>
              </div>
              
              <div className="usage-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <div className="step-icon">🌍</div>
                  <h3>{t('usage.step2.title')}</h3>
                  <p>{t('usage.step2.description')}</p>
                </div>
              </div>
              
              <div className="usage-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <div className="step-icon">🔍</div>
                  <h3>{t('usage.step3.title')}</h3>
                  <p>{t('usage.step3.description')}</p>
                </div>
              </div>
              
              <div className="usage-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <div className="step-icon">📢</div>
                  <h3>{t('usage.step4.title')}</h3>
                  <p>{t('usage.step4.description')}</p>
                </div>
              </div>
            </div>
            
            <div className="usage-features">
              <div className="feature-card">
                <div className="feature-icon">🤖</div>
                <h4>{t('usage.features.ai.title')}</h4>
                <p>{t('usage.features.ai.description')}</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h4>{t('usage.features.database.title')}</h4>
                <p>{t('usage.features.database.description')}</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h4>{t('usage.features.multiple.title')}</h4>
                <p>{t('usage.features.multiple.description')}</p>
              </div>
            </div>
          </div>
        )}

        {searchTerms.length === 0 && (
          <SearchHistory 
            key="welcome-screen-history" 
            onWordSelect={handleWordFromHistory} 
            instanceId="welcome-screen"
            expandedLimit={10}
            fromLanguage={fromLanguage}
            toLanguage={toLanguage}
            globalVoice={globalVoice}
          />
        )}

        {/* Botão Ativar IA dentro do container principal */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginTop: '20px',
          padding: '20px 0'
        }}>
          <ApiKeyConfig ref={apiConfigRef} onApiKeySet={handleApiKeySet} />
        </div>
      </div>
      
      {/* Área de controles organizados */}
      <div className="controls-area">
        <VoiceInfo />
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
