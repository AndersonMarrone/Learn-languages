import React, { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WordCard from './components/WordCard';
import VoiceInfo from './components/VoiceInfo';
import ApiKeyConfig from './components/ApiKeyConfig';
import translationService from './services/translationService';
import { spanishWords } from './data/spanishWords';

function App() {
  const [searchTerms, setSearchTerms] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [geminiResults, setGeminiResults] = useState([]);

  useEffect(() => {
    // Verificar se já tem API key configurada ao carregar
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      translationService.setApiKey(savedKey).then(success => {
        console.log('🔧 Inicialização do Gemini:', success ? 'sucesso' : 'falhou');
      });
    }
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
      
      // Buscar na base de dados local
      const localResults = spanishWords.filter(word => 
        searchTerms.some(term => 
          word.spanish.toLowerCase().includes(term.toLowerCase()) ||
          word.portuguese.toLowerCase().includes(term.toLowerCase()) ||
          word.english.toLowerCase().includes(term.toLowerCase())
        )
      );
      
      setSearchResults(localResults);
      console.log('🔍 Busca local encontrou:', localResults.length, 'resultados');

      // Se não encontrou resultados locais e tem Gemini configurado, buscar com AI
      if (localResults.length === 0 && translationService.isGeminiAvailable()) {
        console.log('🤖 Iniciando busca com Gemini para:', searchTerms);
        try {
          const aiResults = [];
          
          // Buscar cada termo com Gemini
          for (const term of searchTerms) {
            console.log('🔄 Traduzindo com Gemini:', term);
            const translation = await translationService.translateWord(term);
            console.log('📝 Resultado do Gemini:', translation);
            
            if (translation && translation.source !== 'not_found') {
              aiResults.push(translation);
            }
          }
          
          console.log('✅ Resultados finais do Gemini:', aiResults.length);
          if (aiResults.length > 0) {
            setGeminiResults(aiResults);
          }
        } catch (error) {
          console.error('❌ Erro na busca com Gemini:', error);
        }
      }
      
      setIsLoading(false);
    };

    performSearch();
  }, [searchTerms]);


  const handleSearch = (terms) => {
    setSearchTerms(terms);
  };

  const clearSearch = () => {
    setSearchTerms([]);
    setSearchResults([]);
    setGeminiResults([]);
  };

  const handleApiKeySet = (hasKey) => {
    console.log('🔧 API key configurada:', hasKey);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo">
                <span className="logo-icon">🌟</span>
                <h1>Buscar Palavras em Espanhol</h1>
              </div>
              <p className="tagline">Aprenda espanhol de forma inteligente com IA</p>
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
          <SearchBar onSearch={handleSearch} onClear={clearSearch} />
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
                <span className="section-icon">📚</span>
                <h2>Base de Dados</h2>
                <span className="result-count">{searchResults.length} palavras</span>
              </div>
              <div className="section-description">
                Palavras encontradas em nossa base de dados curada
              </div>
            </div>
            <div className="words-grid">
              {searchResults.map((word, index) => (
                <WordCard key={`local-${index}`} word={word} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && searchResults.length > 0 && geminiResults.length > 0 && (
          <div className="section-divider"></div>
        )}

        {!isLoading && geminiResults.length > 0 && (
          <div className="results-section ai-section">
            <div className="section-header">
              <div className="section-title">
                <span className="section-icon">🤖</span>
                <h2>Traduções IA</h2>
                <span className="result-count ai-badge">{geminiResults.length} palavras</span>
              </div>
              <div className="section-description">
                Traduções inteligentes geradas pelo Google Gemini
              </div>
            </div>
            <div className="ai-notice">
              <div className="notice-content">
                <span className="notice-icon">✨</span>
                <div className="notice-text">
                  <strong>Powered by AI</strong>
                  <p>Estas traduções foram geradas automaticamente quando não encontramos a palavra em nossa base de dados.</p>
                </div>
              </div>
            </div>
            <div className="words-grid">
              {geminiResults.map((word, index) => (
                <WordCard key={`gemini-${index}`} word={word} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && searchTerms.length > 0 && searchResults.length === 0 && geminiResults.length === 0 && (
          <div className="no-results">
            <p>Nenhuma palavra encontrada para os termos pesquisados.</p>
            {!translationService.isGeminiAvailable() ? (
              <div style={{ 
                marginTop: '20px', 
                padding: '15px', 
                backgroundColor: '#fef3c7', 
                borderRadius: '8px',
                border: '1px solid #f59e0b'
              }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: '600', color: '#92400e' }}>
                  🤖 Quer buscar qualquer palavra em espanhol?
                </p>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#92400e' }}>
                  Configure o Gemini AI para traduzir automaticamente palavras que não estão na nossa base de dados!
                </p>
              </div>
            ) : (
              <p>Tente buscar por outras palavras ou termos em português/inglês.</p>
            )}
          </div>
        )}

        {searchTerms.length === 0 && (
          <div className="welcome-message">
            <h3>Como usar:</h3>
            <ul>
              <li>Digite uma ou mais palavras separadas por vírgula</li>
              <li>Busque em espanhol, português ou inglês</li>
              <li>Use os resultados para estudar vocabulário</li>
            </ul>
          </div>
        )}
      </div>
      
      {/* Área de controles organizados */}
      <div className="controls-area">
        <VoiceInfo />
        <ApiKeyConfig onApiKeySet={handleApiKeySet} />
      </div>
    </div>
  );
}

export default App;
