import React, { useState, useEffect } from 'react';
import historyService from '../services/historyService';
import WordCard from './WordCard';
import PhraseCard from './PhraseCard';
import ConfirmModal from './ConfirmModal';
import { useTranslation } from '../hooks/useTranslation';
import './SearchHistory.css';

const SearchHistory = ({ 
  onWordSelect, 
  instanceId = 'default', 
  expandedLimit = 10,
  fromLanguage = 'auto',
  toLanguage = 'pt',
  globalVoice = null
}) => {
  const { t } = useTranslation();
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
    if (globalVoice) {
      console.log('🎤 SearchHistory recebeu voz global:', globalVoice.name);
    }
  }, [globalVoice]);

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
      title: t('interface.removeFromHistory'),
      message: t('interface.removeFromHistoryConfirm').replace('{word}', wordText),
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
      title: t('history.clear'),
      message: t('history.clearConfirm'),
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
          <h2>{t('history.title')}</h2>
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
            <span className="stat-label">{t('interface.words')}</span>
          </div>
        </div>
      </div>

      {showHistory && (
        <div className="history-content">
          <div className="history-controls">
              <div className="search-filter">
                <input
                  type="text"
                  placeholder={t('interface.filterHistory')}
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
                  🕒 {t('interface.recent')}
                </button>
                <button
                  className={`tab-btn ${viewMode === 'frequent' ? 'active' : ''}`}
                  onClick={() => setViewMode('frequent')}
                >
                  🔥 {t('interface.frequent')}
                </button>
                <button
                  className={`tab-btn ${viewMode === 'all' ? 'active' : ''}`}
                  onClick={() => setViewMode('all')}
                >
                  📋 {t('interface.all')}
                </button>
              </div>

            <div className="history-actions">
              <button 
                onClick={() => {
                  console.log('🔄 Reload manual do histórico');
                  loadHistory();
                }}
                className="action-btn reload-btn"
                title={t('buttons.reload')}
              >
                ↻
              </button>
              <button 
                onClick={handleRemoveDuplicates}
                className="action-btn dedupe-btn"
                title={t('interface.removeDuplicates')}
              >
                🔄
              </button>
              <button 
                onClick={handleExportHistory}
                className="action-btn export-btn"
                title={t('buttons.export')}
              >
                📥
              </button>
              <button 
                onClick={handleClearHistory}
                className="action-btn clear-btn"
                title={t('buttons.clear')}
              >
                🗑️
              </button>
            </div>
            </div>

          <div className="history-items">
            {history.length === 0 ? (
              <div className="empty-history">
                <span className="empty-icon">📚</span>
                <h3>{t('history.empty')}</h3>
                <p>{t('history.emptyDescription')}</p>
              </div>
            ) : filteredHistory.length > 0 ? (
              <div className="history-grid">
                {filteredHistory.map((item) => (
                  <div key={item.id} className="history-item-wrapper">
                    <div className="history-item-header">
                      <div className="item-meta">
                        <span className="search-date">
                          {new Date(item.searchedAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.spanish)}
                        className="remove-item-btn"
                        title={t('interface.removeFromHistory')}
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
                          globalVoice={globalVoice}
                        />
                      ) : (
                        <WordCard 
                          word={item} 
                          fromLanguage={fromLanguage}
                          toLanguage={toLanguage}
                          globalVoice={globalVoice}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results-history">
                <p>{t('search.noResults')}</p>
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
        confirmText={confirmModal.type === 'danger' ? t('interface.yesClear') : t('interface.yesRemove')}
        cancelText={t('buttons.cancel')}
      />
    </div>
  );
};

export default SearchHistory;
