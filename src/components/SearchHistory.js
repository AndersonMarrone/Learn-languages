import React, { useState, useEffect } from 'react';
import historyService from '../services/historyService';
import WordCard from './WordCard';
import PhraseCard from './PhraseCard';
import ConfirmModal from './ConfirmModal';
import './SearchHistory.css';

const SearchHistory = ({ 
  onWordSelect, 
  instanceId = 'default', 
  expandedLimit = 10,
  fromLanguage = 'auto',
  toLanguage = 'pt'
}) => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [stats, setStats] = useState({});
  const [viewMode, setViewMode] = useState('recent'); // 'recent' | 'frequent' | 'all'
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning'
  });

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    // Recarregar quando a instância muda
    loadHistory();
  }, [instanceId]);

  useEffect(() => {
    filterHistory();
  }, [history, searchFilter, viewMode]);

  // Adicionar listener para storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      console.log(`🔄 [${instanceId}] Storage mudou, recarregando`);
      loadHistory();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('historyUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('historyUpdated', handleStorageChange);
    };
  }, [instanceId]);

  const loadHistory = () => {
    // Usar função garantida que sempre retorna dados
    const historyData = historyService.getHistoryOrCache();
    
    const statsData = {
      totalWords: historyData.length,
      totalSearches: historyData.reduce((sum, item) => sum + (item.searchCount || 1), 0),
      recentWords: historyData.slice(0, 5),
      mostSearched: [...historyData].sort((a, b) => (b.searchCount || 1) - (a.searchCount || 1)).slice(0, 5)
    };
    
    console.log(`📚 [${instanceId}] CARREGANDO histórico:`, historyData.length, 'itens');
    console.log(`📊 [${instanceId}] Stats:`, statsData);
    console.log(`🔍 [${instanceId}] showHistory:`, showHistory);
    
    setHistory(historyData);
    setStats(statsData);
  };

  const filterHistory = () => {
    let filtered = [];
    
    switch (viewMode) {
      case 'recent':
        // Se histórico está expandido (showHistory = true), mostrar mais itens
        const limit = showHistory ? expandedLimit * 2 : expandedLimit;
        filtered = historyService.getFilteredHistory(searchFilter, limit);
        break;
      case 'frequent':
        // Usar histórico único e ordenar por frequência
        const uniqueHistory = historyService.getFilteredHistory('', 1000);
        filtered = uniqueHistory
          .filter(item =>
            !searchFilter || 
            item.spanish.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.portuguese?.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.english?.toLowerCase().includes(searchFilter.toLowerCase())
          )
          .sort((a, b) => (b.searchCount || 1) - (a.searchCount || 1))
          .slice(0, showHistory ? expandedLimit * 2 : expandedLimit);
        break;
      case 'all':
        filtered = historyService.getFilteredHistory(searchFilter, showHistory ? expandedLimit * 3 : expandedLimit * 2);
        break;
      default:
        filtered = historyService.getFilteredHistory(searchFilter, 10);
    }
    
    setFilteredHistory(filtered);
  };

  const handleWordClick = (word) => {
    if (onWordSelect) {
      onWordSelect(word);
    }
  };

  const handleRemoveItem = (itemId, wordText) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remover do Histórico',
      message: `Deseja remover "${wordText}" do seu histórico de buscas?`,
      type: 'warning',
      onConfirm: () => {
        historyService.removeFromHistory(itemId);
        loadHistory();
      }
    });
  };

  const handleRemoveDuplicates = () => {
    historyService.removeDuplicates();
    loadHistory();
  };

  const handleClearHistory = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Limpar Histórico',
      message: 'Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita e você perderá todas as suas palavras salvas.',
      type: 'danger',
      onConfirm: () => {
        historyService.clearHistory();
        loadHistory();
      }
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleExportHistory = () => {
    historyService.exportHistory();
  };

  return (
    <div className="search-history">
      <div className="history-header">
        <div className="history-title">
          <span className="history-icon">📚</span>
          <h2>Histórico de Buscas</h2>
          <button 
            className="toggle-history-btn"
            onClick={() => setShowHistory(!showHistory)}
          >
            {showHistory ? '▼' : '▶'}
          </button>
        </div>
        
        <div className="history-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.totalWords || 0}</span>
            <span className="stat-label">Palavras</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.totalSearches || 0}</span>
            <span className="stat-label">Buscas</span>
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="history-content">
          <div className="history-controls">
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Filtrar histórico..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="filter-input"
                />
              </div>
              
              <div className="view-mode-tabs">
                <button
                  className={`tab-btn ${viewMode === 'recent' ? 'active' : ''}`}
                  onClick={() => setViewMode('recent')}
                >
                  🕒 Recentes
                </button>
                <button
                  className={`tab-btn ${viewMode === 'frequent' ? 'active' : ''}`}
                  onClick={() => setViewMode('frequent')}
                >
                  🔥 Frequentes
                </button>
                <button
                  className={`tab-btn ${viewMode === 'all' ? 'active' : ''}`}
                  onClick={() => setViewMode('all')}
                >
                  📋 Todas
                </button>
              </div>

            <div className="history-actions">
              <button 
                onClick={() => {
                  console.log('🔄 Reload manual do histórico');
                  loadHistory();
                }}
                className="action-btn reload-btn"
                title="Recarregar histórico"
              >
                ↻
              </button>
              <button 
                onClick={() => {
                  console.log('🧪 Adicionando dados de teste');
                  historyService.addSampleData();
                  loadHistory();
                }}
                className="action-btn test-btn"
                title="Adicionar dados de teste"
              >
                🧪
              </button>
              <button 
                onClick={handleRemoveDuplicates}
                className="action-btn dedupe-btn"
                title="Remover duplicatas"
              >
                🔄
              </button>
              <button 
                onClick={handleExportHistory}
                className="action-btn export-btn"
                title="Exportar histórico"
              >
                📥
              </button>
              <button 
                onClick={handleClearHistory}
                className="action-btn clear-btn"
                title="Limpar histórico"
              >
                🗑️
              </button>
            </div>
            </div>

          <div className="history-items">
            {history.length === 0 ? (
              <div className="empty-history">
                <span className="empty-icon">📚</span>
                <h3>Nenhuma palavra no histórico</h3>
                <p>Suas palavras pesquisadas aparecerão aqui</p>
              </div>
            ) : filteredHistory.length > 0 ? (
              <div className="history-grid">
                {filteredHistory.map((item) => (
                  <div key={item.id} className="history-item-wrapper">
                    <div className="history-item-header">
                      <div className="item-meta">
                        <span className="search-count">
                          {item.searchCount > 1 && `${item.searchCount}x`}
                        </span>
                        <span className="search-date">
                          {new Date(item.searchedAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.spanish)}
                        className="remove-item-btn"
                        title="Remover do histórico"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="history-card-wrapper">
                      {item.type === 'phrase' ? (
                        <PhraseCard 
                          phrase={item} 
                          fromLanguage={fromLanguage}
                          toLanguage={toLanguage}
                        />
                      ) : (
                        <WordCard 
                          word={item} 
                          fromLanguage={fromLanguage}
                          toLanguage={toLanguage}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results-history">
                <p>Nenhuma palavra encontrada no histórico</p>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText={confirmModal.type === 'danger' ? 'Sim, limpar' : 'Sim, remover'}
        cancelText="Cancelar"
      />
    </div>
  );
};

export default SearchHistory;
