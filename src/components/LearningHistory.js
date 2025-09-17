import React, { useState, useEffect } from 'react';
import './LearningHistory.css';
import learningHistoryService from '../services/learningHistoryService';
import LearningWordCard from './LearningWordCard';
import ConfirmModal from './ConfirmModal';

const LearningHistory = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  const [notes, setNotes] = useState({});
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning'
  });

  // Carregar histórico e estatísticas
  useEffect(() => {
    loadHistory();
    loadStats();
    loadNotes();
    
    // Escutar atualizações do histórico de aprendizado
    const handleLearningHistoryUpdate = () => {
      console.log('🔄 Evento learningHistoryUpdated recebido, recarregando dados...');
      loadHistory();
      loadStats();
    };
    
    window.addEventListener('learningHistoryUpdated', handleLearningHistoryUpdate);
    
    return () => {
      window.removeEventListener('learningHistoryUpdated', handleLearningHistoryUpdate);
    };
  }, []);

  const loadHistory = () => {
    console.log('📚 Carregando histórico...');
    const historyData = learningHistoryService.getFilteredWords(searchTerm, 20);
    console.log('📊 Dados carregados:', historyData.length, 'itens');
    setHistory(historyData);
  };

  const loadStats = () => {
    const statsData = learningHistoryService.getStats();
    setStats(statsData);
  };

  const loadNotes = () => {
    const savedNotes = JSON.parse(localStorage.getItem('learning_notes') || '{}');
    setNotes(savedNotes);
  };

  // Filtrar histórico quando o termo de busca muda
  useEffect(() => {
    loadHistory();
  }, [searchTerm]);

  // Monitorar mudanças no estado history
  useEffect(() => {
    console.log('🔄 Estado history atualizado:', history.length, 'itens');
  }, [history]);

  // Função helper para mostrar modal de confirmação
  const showConfirmModal = (title, message, onConfirm, type = 'warning') => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      type
    });
  };

  // Função para fechar modal
  const closeConfirmModal = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  const clearHistory = () => {
    console.log('🔄 Iniciando limpeza do histórico...');
    console.log('📊 Histórico atual:', history.length, 'itens');
    
    showConfirmModal(
      'Limpar Histórico',
      'Tem certeza que deseja limpar todo o histórico de aprendizado? Esta ação não pode ser desfeita.',
      () => {
        // Limpar o histórico no serviço
        const success = learningHistoryService.clearHistory();
        console.log('✅ Resultado da limpeza do serviço:', success);
        
        // Limpar o estado local imediatamente
        setHistory([]);
        setStats({
          totalSessions: 0,
          totalWords: 0,
          averageWordsPerSession: 0,
          recentSessions: []
        });
        setSearchTerm('');
        setSelectedWord(null);
        
        // Forçar re-renderização da página
        window.dispatchEvent(new CustomEvent('learningHistoryUpdated'));
        
        // Re-renderizar a página após um pequeno delay
        setTimeout(() => {
          window.location.reload();
          console.log('🔄 Página re-renderizada após limpeza do histórico');
        }, 500);
        
        console.log('🧹 Histórico limpo e página será re-renderizada');
      },
      'danger'
    );
  };

  const removeItem = (id) => {
    console.log('🗑️ Tentando remover palavra com ID:', id);
    console.log('🔍 Tipo do ID:', typeof id);
    console.log('🔍 ID contém hífen?', id.includes ? id.includes('-') : 'N/A');
    
    showConfirmModal(
      'Remover Palavra',
      'Tem certeza que deseja remover esta palavra do histórico?',
      () => {
        console.log('✅ Confirmação recebida, removendo palavra...');
        
        let success;
        if (id.includes && id.includes('-')) {
          // É um wordId (formato: sessionId-index)
          console.log('🔧 Usando removeWord com wordId');
          success = learningHistoryService.removeWord(id);
        } else {
          // É um sessionId (fallback)
          console.log('🔧 Usando removeSession com sessionId (fallback)');
          success = learningHistoryService.removeSession(id);
        }
        
        console.log('📊 Resultado da remoção:', success ? 'sucesso' : 'falhou');
        
        // Recarregar dados
        loadHistory();
        loadStats();
        
        // Forçar re-renderização
        window.dispatchEvent(new CustomEvent('learningHistoryUpdated'));
        
        console.log('🗑️ Palavra removida e dados recarregados');
      },
      'warning'
    );
  };

  const handleWordClick = (word) => {
    setSelectedWord(word);
  };

  const handleCloseWordCard = () => {
    setSelectedWord(null);
  };

  const handleSaveNote = (wordId, note) => {
    setNotes(prev => ({
      ...prev,
      [wordId]: note
    }));
    
    // Salvar no localStorage para persistência
    const savedNotes = JSON.parse(localStorage.getItem('learning_notes') || '{}');
    savedNotes[wordId] = note;
    localStorage.setItem('learning_notes', JSON.stringify(savedNotes));
  };

  // Função para buscar anotações de uma palavra em qualquer formato
  const findNoteForWord = (word) => {
    const savedNotes = JSON.parse(localStorage.getItem('learning_notes') || '{}');
    
    // Tentar diferentes formatos de ID
    const possibleIds = [
      word.spanish, // Formato simples
      `${word.spanish}-history`, // Formato do histórico
      // Buscar por padrões da página de aprendizado
      ...Object.keys(savedNotes).filter(key => 
        key.startsWith(word.spanish) && key.includes('-')
      )
    ];
    
    // Retornar a primeira anotação encontrada
    for (const id of possibleIds) {
      if (savedNotes[id]) {
        return savedNotes[id];
      }
    }
    
    return '';
  };

  return (
    <div className="learning-history">
      <div className="history-header">
        <div className="history-title-section">
          <h3 className="history-title">
            <span className="history-icon">📚</span>
            Histórico de Aprendizado
          </h3>
          <button
            className="toggle-history-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="toggle-icon">
              {isExpanded ? '▼' : '▶'}
            </span>
            {isExpanded ? 'Recolher' : 'Expandir'}
          </button>
        </div>
        
        {stats && (
          <div className="history-stats">
            
            <div className="stat-item">
              <span className="stat-number">{stats.totalWords}</span>
              <span className="stat-label">Palavras</span>
            </div>
            
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="history-content">
          <div className="history-controls">
            <div className="search-control">
              <input
                type="text"
                placeholder="Buscar no histórico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="history-search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {history && history.length > 0 ? (
            <div className="history-list">
              {history.map((word, index) => (
                <div key={word.wordId || `${word.sessionId}-${index}`} className="history-item">
                  <div 
                    className="history-item-content clickable"
                    onClick={() => handleWordClick(word)}
                    title="Clique para ver detalhes e anotações"
                  >
                    <div className="history-word">
                      <span className="spanish-word">{word.spanish}</span>
                      <span className="portuguese-word">{word.portuguese}</span>
                      {word.english && (
                        <span className="english-word">({word.english})</span>
                      )}
                    </div>
                    
                    <div className="history-meta">
                      <span className="session-info">
                        Sessão #{word.sessionNumber}
                      </span>
                      <span className="session-date">
                        {formatDate(word.sessionDate)}
                      </span>
                    </div>
                    
                    <div className="click-hint">
                      <span className="click-icon">👁️</span>
                      <span className="click-text">Clique para ver detalhes</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('🔘 Botão X clicado para palavra:', word.spanish);
                      console.log('📊 Dados completos da palavra:', JSON.stringify(word, null, 2));
                      console.log('🔑 wordId encontrado:', word.wordId);
                      console.log('🔑 wordId é undefined?', word.wordId === undefined);
                      console.log('🔑 wordId é null?', word.wordId === null);
                      
                      if (word.wordId) {
                        removeItem(word.wordId);
                      } else {
                        console.error('❌ wordId não encontrado! Usando sessionId como fallback:', word.sessionId);
                        removeItem(word.sessionId);
                      }
                    }}
                    className="remove-item-btn"
                    title="Remover palavra do histórico"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="history-empty">
              <div className="empty-icon">📝</div>
              <p>
                {searchTerm 
                  ? `Nenhum resultado encontrado para "${searchTerm}"`
                  : 'Nenhuma palavra gerada ainda'
                }
              </p>
              <p className="empty-hint">
                {searchTerm 
                  ? 'Tente um termo diferente'
                  : 'Gere palavras na página de aprendizado para ver seu histórico aqui'
                }
              </p>
            </div>
          )}

        </div>
      )}

      {/* Botão de limpar histórico fora da caixa */}
      <div className="history-external-actions">
        <button
          onClick={() => {
            console.log('🔘 Botão limpar historico clicado!');
            clearHistory();
          }}
          className="clear-history-btn"
          disabled={history.length === 0}
        >
          <span className="btn-icon">🗑️</span>
          limpar historico
        </button>
        
        
      </div>

      {/* Card de palavra selecionada */}
      {selectedWord && (
        <div className="selected-word-overlay">
          <div className="selected-word-container">
            <div className="selected-word-header">
              <h3>Palavra Selecionada</h3>
              <button 
                onClick={handleCloseWordCard}
                className="close-word-btn"
                title="Fechar"
              >
                ✕
              </button>
            </div>
            <div className="selected-word-content">
              <LearningWordCard
                word={selectedWord}
                wordId={`${selectedWord.spanish}-history`}
                note={findNoteForWord(selectedWord)}
                onSaveNote={(note) => handleSaveNote(`${selectedWord.spanish}-history`, note)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={closeConfirmModal}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />
    </div>
  );
};

export default LearningHistory;
