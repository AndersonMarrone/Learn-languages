class HistoryService {
  constructor() {
    this.storageKey = 'spanish_words_history';
    this.cacheKey = 'spanish_words_history_cache'; // Também localStorage para persistência
    this.maxHistoryItems = 100; // Limite de itens no histórico
    this.globalCache = null; // Cache em memória
  }

  // Salvar uma palavra/frase no histórico
  saveToHistory(item) {
    try {
      const history = this.getHistory();
      
      // Verificar se já existe (evitar duplicatas)
      const existingIndex = history.findIndex(h => 
        h.spanish.toLowerCase() === item.spanish.toLowerCase()
      );
      
      if (existingIndex !== -1) {
        // Se existe, atualizar timestamp e mover para o topo
        history[existingIndex] = {
          ...history[existingIndex],
          ...item,
          searchedAt: new Date().toISOString(),
          searchCount: (history[existingIndex].searchCount || 1) + 1
        };
        // Mover para o início
        const updatedItem = history.splice(existingIndex, 1)[0];
        history.unshift(updatedItem);
      } else {
        // Se não existe, adicionar no início
        const newItem = {
          ...item,
          searchedAt: new Date().toISOString(),
          searchCount: 1,
          id: Date.now() + Math.random() // ID único
        };
        history.unshift(newItem);
      }
      
      // Limitar o tamanho do histórico
      if (history.length > this.maxHistoryItems) {
        history.splice(this.maxHistoryItems);
      }
      
      localStorage.setItem(this.storageKey, JSON.stringify(history));
      console.log('📚 Item salvo no histórico:', item.spanish);
      
      // Atualizar cache global
      this.updateGlobalCache(history);
      
      // Disparar evento personalizado para notificar componentes
      window.dispatchEvent(new CustomEvent('historyUpdated', { 
        detail: { history, item } 
      }));
      
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar no histórico:', error);
      return false;
    }
  }

  // Atualizar cache global (persistente)
  updateGlobalCache(history) {
    try {
      this.globalCache = [...history];
      localStorage.setItem(this.cacheKey, JSON.stringify(history));
      console.log('💾 Cache global persistente atualizado:', history.length, 'itens');
    } catch (error) {
      console.error('❌ Erro ao atualizar cache:', error);
    }
  }

  // Obter cache global
  getGlobalCache() {
    try {
      // Primeiro tentar cache em memória
      if (this.globalCache && this.globalCache.length > 0) {
        console.log('📋 Usando cache em memória:', this.globalCache.length, 'itens');
        return this.globalCache;
      }
      
      // Depois tentar localStorage cache (persistente)
      const cached = localStorage.getItem(this.cacheKey);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        this.globalCache = parsedCache;
        console.log('📋 Usando cache persistente do localStorage:', parsedCache.length, 'itens');
        return parsedCache;
      }
      
      console.log('📋 Nenhum cache disponível');
      return [];
    } catch (error) {
      console.error('❌ Erro ao carregar cache:', error);
      return [];
    }
  }

  // Obter todo o histórico
  getHistory() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      const history = stored ? JSON.parse(stored) : [];
      
      // Se histórico real existe, atualizar cache
      if (history.length > 0) {
        this.updateGlobalCache(history);
      }
      
      return history;
    } catch (error) {
      console.error('❌ Erro ao carregar histórico:', error);
      return [];
    }
  }

  // Inicializar cache se não existir
  initializeCache() {
    const realHistory = this.getHistory();
    if (realHistory.length > 0) {
      this.updateGlobalCache(realHistory);
      console.log('🚀 Cache inicializado com dados existentes:', realHistory.length, 'itens');
    } else {
      // Se não há histórico, verificar se há cache
      const cachedHistory = this.getGlobalCache();
      if (cachedHistory.length === 0) {
        console.log('🚀 Primeiro uso - nenhum histórico disponível');
      } else {
        console.log('🚀 Cache encontrado:', cachedHistory.length, 'itens');
      }
    }
  }

  // Função para adicionar dados de exemplo (para teste)
  addSampleData() {
    const sampleData = [
      {
        id: Date.now(),
        spanish: 'casa',
        portuguese: 'casa',
        english: 'house',
        searchedAt: new Date().toISOString(),
        searchCount: 1,
        source: 'database'
      }
    ];
    
    sampleData.forEach(item => this.saveToHistory(item));
    console.log('📚 Dados de exemplo adicionados');
  }

  // Obter histórico garantido (nunca vazio)
  getHistoryOrCache() {
    const realHistory = this.getHistory();
    
    if (realHistory.length > 0) {
      console.log('📚 Retornando histórico real:', realHistory.length, 'itens');
      return realHistory;
    }
    
    const cachedHistory = this.getGlobalCache();
    if (cachedHistory.length > 0) {
      console.log('📚 Retornando histórico do cache persistente:', cachedHistory.length, 'itens');
      return cachedHistory;
    }
    
    console.log('📚 Nenhum histórico disponível - primeiro uso');
    return [];
  }

  // Obter histórico filtrado (sem duplicatas)
  getFilteredHistory(searchTerm = '', limit = 20) {
    const history = this.getHistory();
    
    // Remover duplicatas baseado na palavra em espanhol
    const uniqueHistory = history.reduce((acc, current) => {
      const exists = acc.find(item => 
        item.spanish.toLowerCase() === current.spanish.toLowerCase()
      );
      
      if (!exists) {
        acc.push(current);
      } else {
        // Se já existe, manter o que tem maior searchCount
        if ((current.searchCount || 1) > (exists.searchCount || 1)) {
          const index = acc.indexOf(exists);
          acc[index] = current;
        }
      }
      
      return acc;
    }, []);
    
    if (!searchTerm) {
      return uniqueHistory.slice(0, limit);
    }
    
    const filtered = uniqueHistory.filter(item =>
      item.spanish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.portuguese?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.english?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filtered.slice(0, limit);
  }

  // Obter estatísticas do histórico
  getHistoryStats() {
    const history = this.getHistory();
    const uniqueHistory = this.getFilteredHistory('', 1000); // Todas as palavras únicas
    
    return {
      totalWords: uniqueHistory.length,
      totalSearches: history.reduce((sum, item) => sum + (item.searchCount || 1), 0),
      recentWords: uniqueHistory.slice(0, 5),
      mostSearched: [...uniqueHistory]
        .sort((a, b) => (b.searchCount || 1) - (a.searchCount || 1))
        .slice(0, 5)
    };
  }

  // Remover item do histórico
  removeFromHistory(itemId) {
    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.id !== itemId);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      console.log('🗑️ Item removido do histórico');
      return true;
    } catch (error) {
      console.error('❌ Erro ao remover do histórico:', error);
      return false;
    }
  }

  // Limpar duplicatas do histórico existente
  removeDuplicates() {
    try {
      const history = this.getHistory();
      const uniqueHistory = this.getFilteredHistory('', 1000); // Usar a função que já remove duplicatas
      
      localStorage.setItem(this.storageKey, JSON.stringify(uniqueHistory));
      console.log('🧹 Duplicatas removidas do histórico');
      return true;
    } catch (error) {
      console.error('❌ Erro ao remover duplicatas:', error);
      return false;
    }
  }

  // Limpar todo o histórico
  clearHistory() {
    try {
      localStorage.removeItem(this.storageKey);
      console.log('🧹 Histórico limpo');
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar histórico:', error);
      return false;
    }
  }

  // Exportar histórico (para backup)
  exportHistory() {
    const history = this.getHistory();
    const dataStr = JSON.stringify(history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `spanish_words_history_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  // Importar histórico (de backup)
  importHistory(jsonData) {
    try {
      const importedHistory = JSON.parse(jsonData);
      if (Array.isArray(importedHistory)) {
        localStorage.setItem(this.storageKey, JSON.stringify(importedHistory));
        console.log('📥 Histórico importado com sucesso');
        return true;
      }
      throw new Error('Formato inválido');
    } catch (error) {
      console.error('❌ Erro ao importar histórico:', error);
      return false;
    }
  }
}

// Instância singleton
const historyService = new HistoryService();
export default historyService;
