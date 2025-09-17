class LearningHistoryService {
  constructor() {
    this.storageKey = 'learning_words_history';
    this.maxHistoryItems = 50; // Limite de sessões de aprendizado
  }

  // Salvar uma sessão de aprendizado
  saveLearningSession(words, wordCount) {
    try {
      const history = this.getHistory();
      
      const newSession = {
        id: Date.now() + Math.random(),
        words: words,
        wordCount: wordCount,
        createdAt: new Date().toISOString(),
        sessionNumber: history.length + 1
      };
      
      // Adicionar no início
      history.unshift(newSession);
      
      // Limitar o tamanho do histórico
      if (history.length > this.maxHistoryItems) {
        history.splice(this.maxHistoryItems);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(history));
      console.log('📚 Sessão de aprendizado salva:', wordCount, 'palavras');
      
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent('learningHistoryUpdated', { 
        detail: { history, session: newSession } 
      }));
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar sessão de aprendizado:', error);
      return false;
    }
  }

  // Obter todo o histórico de aprendizado
  getHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Erro ao carregar histórico de aprendizado:', error);
      return [];
    }
  }

  // Obter estatísticas do histórico de aprendizado
  getStats() {
    const history = this.getHistory();
    const totalSessions = history.length;
    const totalWords = history.reduce((sum, session) => sum + session.wordCount, 0);
    const averageWordsPerSession = totalSessions > 0 ? Math.round(totalWords / totalSessions) : 0;
    
    return {
      totalSessions,
      totalWords,
      averageWordsPerSession,
      recentSessions: history.slice(0, 5)
    };
  }

  // Remover uma palavra específica do histórico
  removeWord(wordId) {
    try {
      console.log('🗑️ Iniciando remoção da palavra com wordId:', wordId);
      
      const history = this.getHistory();
      console.log('📊 Histórico completo antes da remoção:', JSON.stringify(history, null, 2));
      
      // Extrair sessionId e index do wordId (formato: "sessionId-index")
      const [sessionId, wordIndex] = wordId.split('-');
      console.log('🔍 SessionId extraído:', sessionId, 'Index:', wordIndex);
      
      // Encontrar e remover a palavra específica
      const updatedHistory = history.map(session => {
        if (session.id.toString() === sessionId && session.words && Array.isArray(session.words)) {
          console.log('🔍 Encontrada sessão correspondente:', session.id);
          const originalLength = session.words.length;
          
          // Remover palavra pelo índice
          const filteredWords = session.words.filter((word, index) => {
            const shouldKeep = index.toString() !== wordIndex;
            console.log('🔍 Palavra', index, ':', word.spanish, 'manter?', shouldKeep);
            return shouldKeep;
          });
          
          console.log('📊 Sessão', session.id, ':', originalLength, '->', filteredWords.length, 'palavras');
          
          return {
            ...session,
            words: filteredWords,
            wordCount: filteredWords.length
          };
        }
        return session;
      }).filter(session => session.words && session.words.length > 0);
      
      console.log('📊 Histórico após remoção da palavra:', updatedHistory.length, 'sessões');
      console.log('📊 Histórico atualizado:', JSON.stringify(updatedHistory, null, 2));
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedHistory));
      
      // Verificar se foi removido
      const afterRemoval = this.getHistory();
      console.log('✅ Histórico após remoção:', afterRemoval.length, 'sessões');
      
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent('learningHistoryUpdated'));
      
      console.log('🗑️ Palavra removida do histórico com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao remover palavra:', error);
      return false;
    }
  }

  // Remover uma sessão específica (método original mantido para compatibilidade)
  removeSession(sessionId) {
    try {
      console.log('🗑️ Iniciando remoção da sessão:', sessionId);
      
      const history = this.getHistory();
      console.log('📊 Histórico antes da remoção:', history.length, 'sessões');
      
      const filtered = history.filter(session => session.id !== sessionId);
      console.log('📊 Histórico após filtro:', filtered.length, 'sessões');
      
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      
      // Verificar se foi removido
      const afterRemoval = this.getHistory();
      console.log('✅ Histórico após remoção:', afterRemoval.length, 'sessões');
      
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent('learningHistoryUpdated'));
      
      console.log('🗑️ Sessão removida do histórico com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao remover sessão:', error);
      return false;
    }
  }

  // Limpar todo o histórico de aprendizado
  clearHistory() {
    try {
      console.log('🧹 Iniciando limpeza do localStorage...');
      console.log('🔑 Chave do storage:', this.storageKey);
      
      // Verificar se existe antes de remover
      const existingData = localStorage.getItem(this.storageKey);
      console.log('📊 Dados existentes antes da limpeza:', existingData ? 'existem' : 'não existem');
      
      localStorage.removeItem(this.storageKey);
      
      // Verificar se foi removido
      const afterRemoval = localStorage.getItem(this.storageKey);
      console.log('✅ Dados após remoção:', afterRemoval ? 'ainda existem' : 'removidos com sucesso');
      
      // Disparar evento personalizado
      window.dispatchEvent(new CustomEvent('learningHistoryUpdated'));
      
      console.log('🧹 Histórico de aprendizado limpo com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar histórico:', error);
      return false;
    }
  }

  // Obter palavras únicas de todas as sessões
  getUniqueWords() {
    const history = this.getHistory();
    const allWords = [];
    
    history.forEach(session => {
      session.words.forEach((word, index) => {
        const wordId = `${session.id}-${index}`;
        allWords.push({
          ...word,
          wordId: wordId, // ID único para cada palavra
          sessionId: session.id,
          sessionDate: session.createdAt,
          sessionNumber: session.sessionNumber
        });
      });
    });
    
    // Remover duplicatas baseado na palavra em espanhol
    const uniqueWords = allWords.reduce((acc, current) => {
      const exists = acc.find(item => 
        item.spanish.toLowerCase() === current.spanish.toLowerCase()
      );
      
      if (!exists) {
        acc.push(current);
      } else {
        // Se já existe, manter o mais recente
        if (new Date(current.sessionDate) > new Date(exists.sessionDate)) {
          const index = acc.indexOf(exists);
          acc[index] = current;
        }
      }
      
      return acc;
    }, []);
    
    // Ordenar em ordem alfabética por palavra em espanhol
    return uniqueWords.sort((a, b) => 
      a.spanish.toLowerCase().localeCompare(b.spanish.toLowerCase())
    );
  }

  // Filtrar palavras por termo de busca
  getFilteredWords(searchTerm = '', limit = 20) {
    const uniqueWords = this.getUniqueWords();
    
    if (!searchTerm) {
      return uniqueWords.slice(0, limit);
    }
    
    const filtered = uniqueWords.filter(word =>
      word.spanish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.portuguese?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.english?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Manter ordem alfabética mesmo após filtro
    return filtered.slice(0, limit);
  }
}

// Instância singleton
const learningHistoryService = new LearningHistoryService();
export default learningHistoryService;
