import React, { useState, useEffect } from 'react';
import './LearningPage.css';
import LearningWordCard from './LearningWordCard';
import { spanishWords } from '../data/spanishWords';
import { useTranslation } from '../hooks/useTranslation';

const LearningPage = () => {
  const { t } = useTranslation();
  const [wordCount, setWordCount] = useState(10);
  const [generatedWords, setGeneratedWords] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [notes, setNotes] = useState({}); // Para armazenar anotações de cada palavra

  // Função para gerar palavras aleatórias
  const generateRandomWords = () => {
    setIsGenerating(true);
    
    // Simular um pequeno delay para melhor UX
    setTimeout(() => {
      // Filtrar palavras que têm todas as informações necessárias
      const validWords = spanishWords.filter(word => 
        word.spanish && 
        word.portuguese && 
        word.phonetic && 
        word.example && 
        word.exampleTranslation
      );
      
      // Embaralhar e pegar a quantidade solicitada
      const shuffled = [...validWords].sort(() => Math.random() - 0.5);
      const selectedWords = shuffled.slice(0, wordCount);
      
      setGeneratedWords(selectedWords);
      setIsGenerating(false);
    }, 500);
  };

  // Função para salvar anotações
  const saveNote = (wordId, note) => {
    setNotes(prev => ({
      ...prev,
      [wordId]: note
    }));
    
    // Salvar no localStorage para persistência
    const savedNotes = JSON.parse(localStorage.getItem('learning_notes') || '{}');
    savedNotes[wordId] = note;
    localStorage.setItem('learning_notes', JSON.stringify(savedNotes));
  };

  // Carregar anotações salvas ao inicializar
  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('learning_notes') || '{}');
    setNotes(savedNotes);
  }, []);

  // Limpar palavras geradas
  const clearWords = () => {
    setGeneratedWords([]);
  };

  return (
    <div className="learning-page">
      <div className="page-content">
        <header className="learning-header">
          <div className="learning-title-section">
            <h1 className="learning-title">
              <span className="title-icon">📚</span>
              Aprendizado de Palavras
            </h1>
            <p className="learning-subtitle">
              Gere palavras aleatórias em espanhol para praticar e fazer anotações
            </p>
          </div>
        </header>

        <div className="learning-controls">
          <div className="word-count-control">
            <label htmlFor="wordCount" className="control-label">
              Número de palavras (0-50):
            </label>
            <div className="input-group">
              <input
                id="wordCount"
                type="number"
                min="0"
                max="50"
                value={wordCount}
                onChange={(e) => setWordCount(Math.max(0, Math.min(50, parseInt(e.target.value) || 0)))}
                className="word-count-input"
                disabled={isGenerating}
              />
              <button
                onClick={generateRandomWords}
                disabled={isGenerating || wordCount === 0}
                className="generate-btn"
              >
                {isGenerating ? (
                  <>
                    <span className="spinner-small"></span>
                    Gerando...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🎲</span>
                    Gerar Palavras
                  </>
                )}
              </button>
            </div>
          </div>

          {generatedWords.length > 0 && (
            <div className="results-controls">
              <div className="results-info">
                <span className="results-count">
                  {generatedWords.length} palavra{generatedWords.length !== 1 ? 's' : ''} gerada{generatedWords.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={clearWords}
                className="clear-btn"
              >
                <span className="btn-icon">🗑️</span>
                Limpar
              </button>
            </div>
          )}
        </div>

        {isGenerating && (
          <div className="generating-overlay">
            <div className="generating-content">
              <div className="spinner-large"></div>
              <p>Gerando palavras aleatórias...</p>
            </div>
          </div>
        )}

        {generatedWords.length > 0 && (
          <div className="learning-results">
            <div className="results-header">
              <h2 className="results-title">
                <span className="section-icon">📖</span>
                Palavras para Aprender
              </h2>
              <p className="results-description">
                Clique em cada card para ver detalhes e fazer anotações
              </p>
            </div>
            
            <div className="learning-words-grid">
              {generatedWords.map((word, index) => (
                <LearningWordCard
                  key={`learning-${index}`}
                  word={word}
                  wordId={`${word.spanish}-${index}`}
                  note={notes[`${word.spanish}-${index}`] || ''}
                  onSaveNote={(note) => saveNote(`${word.spanish}-${index}`, note)}
                />
              ))}
            </div>
          </div>
        )}

        {generatedWords.length === 0 && !isGenerating && (
          <div className="learning-welcome">
            <div className="welcome-content">
              <div className="welcome-icon">🎯</div>
              <h2>Pronto para Aprender?</h2>
              <p>
                Escolha quantas palavras você quer estudar (de 1 a 50) e clique em "Gerar Palavras" 
                para começar sua sessão de aprendizado.
              </p>
              <div className="welcome-features">
                <div className="feature-item">
                  <span className="feature-icon">🎲</span>
                  <span>Palavras aleatórias do banco de dados</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📝</span>
                  <span>Anotações pessoais em cada palavra</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔊</span>
                  <span>Pronúncia com áudio</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📚</span>
                  <span>Exemplos de uso em contexto</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPage;
