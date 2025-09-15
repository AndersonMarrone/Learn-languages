import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WordCard from './components/WordCard';
import PhraseCard from './components/PhraseCard';
import SearchHistory from './components/SearchHistory';
import VoiceInfo from './components/VoiceInfo';
import ApiKeyConfig from './components/ApiKeyConfig';
import translationService from './services/translationService';
import historyService from './services/historyService';
import { spanishWords } from './data/spanishWords';

function App() {
  const [searchTerms, setSearchTerms] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResults, setGeminiResults] = useState([]);
  const [lastValidHistory, setLastValidHistory] = useState([]);
  const [fromLanguage, setFromLanguage] = useState('auto');
  const [toLanguage, setToLanguage] = useState('pt');
  const apiConfigRef = useRef();

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
    setLastValidHistory(initialHistory);
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
      setLastValidHistory(currentHistory);
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
            setLastValidHistory(updatedHistory);
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
    if (fromLanguage !== 'auto' && toLanguage !== 'auto') {
      const tempFrom = fromLanguage;
      setFromLanguage(toLanguage);
      setToLanguage(tempFrom);
      
      // Se há termos de busca, refazer a busca com idiomas trocados
      if (searchTerms.length > 0) {
        // Trigger re-search by updating the dependency
        setSearchTerms([...searchTerms]);
      }
    }
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">
               
                <h1>Tradutor</h1>
              </div>
              <p className="tagline">Aprenda idiomas de forma inteligente com IA</p>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <span className="stat-number">{searchResults.length + geminiResults.length}</span>
                <span className="stat-label">Palavras encontradas</span>
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
            <p>Buscando palavras...</p>
          </div>
        )}

        {!isLoading && searchResults.length > 0 && (
          <div className="results-section">
            <div className="section-header">
              <div className="section-title">
                <span className="section-icon">🔍</span>
                <h2>Resultados Encontrados</h2>
                <span className="result-count">{searchResults.length} palavras</span>
              </div>
              <div className="section-description">
                Palavras da base de dados e histórico de buscas
              </div>
            </div>
            <div className="words-grid">
              {searchResults.map((word, index) => (
                <WordCard 
                  key={`found-${index}`} 
                  word={word} 
                  fromLanguage={fromLanguage}
                  toLanguage={toLanguage}
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
                <h2>Novas Traduções</h2>
                <span className="result-count ai-badge">{geminiResults.length} palavras</span>
              </div>
              <div className="section-description">
                Traduções inéditas geradas pela IA e adicionadas ao seu histórico
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
                  />
                ) : (
                  <WordCard 
                    key={`gemini-${index}`} 
                    word={item} 
                    fromLanguage={fromLanguage}
                    toLanguage={toLanguage}
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
          />
        )}

        {/* Histórico quando NÃO encontra palavras - EXATAMENTE IGUAL */}
        {!isLoading && searchTerms.length > 0 && searchResults.length === 0 && geminiResults.length === 0 && (
          <>
            <div className="no-results">
              <p>Nenhuma palavra encontrada para os termos pesquisados.</p>
              {!translationService.isGeminiAvailable() && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '12px', 
                  backgroundColor: '#fef3c7', 
                  borderRadius: '8px',
                  border: '1px solid #f59e0b'
                }}>
                  <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#92400e' }}>
                    🤖 Quer buscar qualquer palavra em espanhol?
                  </p>
                  <p style={{ margin: '0 0 15px 0', fontSize: '14px', color: '#92400e' }}>
                    Configure o Gemini AI para traduzir automaticamente palavras que não estão na nossa base de dados!
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
                    ⚙️ Configurar Gemini AI
                  </button>
                </div>
              )}
              {translationService.isGeminiAvailable() && (
                <p>Tente buscar por outras palavras ou termos em português/inglês.</p>
              )}
            </div>
            
            <SearchHistory 
              key="no-results-history" 
              onWordSelect={handleWordFromHistory} 
              instanceId="no-results"
              expandedLimit={50}
            />
          </>
        )}

        {searchTerms.length === 0 && (
          <div className="welcome-message">
            <h3>Como usar:</h3>
            <ul>
              <li>Digite palavras ou frases completas</li>
              <li>Busque em espanhol, português ou inglês</li>
              <li>Separe múltiplos termos por vírgula</li>
              <li>Frases são traduzidas automaticamente com IA</li>
              <li>Use os botões 📢 para ouvir a pronúncia</li>
            </ul>
          </div>
        )}

        {searchTerms.length === 0 && (
          <SearchHistory 
            key="welcome-screen-history" 
            onWordSelect={handleWordFromHistory} 
            instanceId="welcome-screen"
            expandedLimit={10}
          />
        )}
      </div>
      
      {/* Área de controles organizados */}
      <div className="controls-area">
        <VoiceInfo />
        <ApiKeyConfig ref={apiConfigRef} onApiKeySet={handleApiKeySet} />
      </div>
    </div>
  );
}

export default App;
