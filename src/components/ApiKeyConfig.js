import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import translationService from '../services/translationService';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from '../hooks/useTranslation';

const ApiKeyConfig = forwardRef(({ onApiKeySet }, ref) => {
  const { t } = useTranslation();
  const { showError, showSuccess, showWarning } = useToast();
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // Verificar se já tem API key configurada
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      // Configurar de forma assíncrona
      translationService.setApiKey(savedKey).then(success => {
        setIsConfigured(success);
        console.log('🔧 API key carregada do localStorage:', success ? 'sucesso' : 'falhou');
      });
    }
  }, []);

  // Expor função para o componente pai
  useImperativeHandle(ref, () => ({
    openConfig: () => {
      setShowConfig(true);
    }
  }));

  const showSuccessNotification = () => {
    setShowSuccessModal(true);
    setShowConfig(false); // Fechar modal de configuração
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      showError(t('settings.apiKeyRequired') || 'Por favor, insira uma API key válida');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔧 Tentando configurar API key...');
      const success = await translationService.setApiKey(apiKey);
      
      if (success) {
        localStorage.setItem('gemini_api_key', apiKey);
        setIsConfigured(true);
        setShowConfig(false);
        
        if (onApiKeySet) {
          onApiKeySet(true);
        }
        
        // Mostrar notificação de sucesso mais elegante
        showSuccessNotification();
      } else {
        // Verificar console para erro específico
        console.log('🔍 Verificando logs do console para detalhes do erro...');
        showError(t('settings.apiKeyError') || 'Erro ao configurar API key. Verifique se a chave está correta.');
      }
    } catch (error) {
      console.error('❌ Erro ao configurar API key:', error);
      showError(t('settings.apiKeyError') || `Erro ao configurar API key: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setIsConfigured(false);
    translationService.setApiKey('');
    
    if (onApiKeySet) {
      onApiKeySet(false);
    }
  };

  const getApiKeyInstructions = () => {
    return (
      <div style={{ 
        backgroundColor: '#f0f4ff', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '15px',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#2b6cb0' }}>📝 Como obter sua API key do Google Gemini:</h4>
        <ol style={{ margin: '0', paddingLeft: '20px' }}>
          <li>Acesse: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{color: '#2b6cb0'}}>Google AI Studio</a></li>
          <li>Faça login com sua conta Google</li>
          <li>Clique em "Create API Key"</li>
          <li><strong>IMPORTANTE:</strong> Certifique-se de que a chave tem acesso ao Gemini 1.5</li>
          <li>Copie a chave gerada (deve começar com "AIza...")</li>
        </ol>
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#fef3c7', 
          borderRadius: '6px',
          border: '1px solid #f59e0b'
        }}>
          <p style={{ margin: '0', fontSize: '12px', color: '#92400e' }}>
            <strong>⚠️ Problemas comuns:</strong>
          </p>
          <ul style={{ margin: '5px 0 0 0', paddingLeft: '15px', fontSize: '12px', color: '#92400e' }}>
            <li>API key sem acesso ao Gemini 1.5</li>
            <li>Quota excedida (limite gratuito)</li>
            <li>Região não suportada</li>
          </ul>
        </div>
        <p style={{ margin: '10px 0 0 0', fontSize: '12px', color: '#666' }}>
          <strong>💡 Dica:</strong> A API do Gemini tem um plano gratuito generoso para uso pessoal.
        </p>
      </div>
    );
  };

  if (!showConfig && !isConfigured) {
    return (
      <button 
        onClick={() => setShowConfig(true)}
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          padding: '10px 16px',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseOver={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
        }}
        onMouseOut={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
        }}
      >
        🤖 {t('interface.activateGemini').replace('🤖 ', '')}
      </button>
    );
  }

  if (isConfigured && !showConfig) {
    return (
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: '#10b981',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
        }}>
          <span>{t('interface.geminiActive')}</span>
          <button
            onClick={() => setShowConfig(true)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              borderRadius: '4px',
              padding: '2px 6px',
              cursor: 'pointer',
              fontSize: '10px'
            }}
          >
            ⚙️
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      zIndex: 1001,
      minWidth: '500px',
      maxWidth: '90vw'
    }}>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: -1
        }}
        onClick={() => setShowConfig(false)}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#2d3748' }}>{t('interface.configureGemini')}</h3>
        <button 
          onClick={() => setShowConfig(false)}
          style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
        >
          ✕
        </button>
      </div>

      {getApiKeyInstructions()}

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
          API Key do Google Gemini:
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Cole sua API key aqui..."
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontFamily: 'monospace'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        {isConfigured && (
          <button
            onClick={async () => {
              const testResult = await translationService.translateWord('madrugada');
              console.log('🧪 Teste do Gemini:', testResult);
              if (testResult.source === 'gemini') {
                showSuccess(t('settings.apiKeyTestSuccess') || 'API key funcionando corretamente!');
              } else {
                showError(t('settings.apiKeyTestError') || 'API key não está funcionando corretamente.');
              }
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🧪 {t('buttons.test')}
          </button>
        )}
        {isConfigured && (
          <button
            onClick={handleRemoveApiKey}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🗑️ {t('buttons.remove')}
          </button>
        )}
        <button
          onClick={handleSaveApiKey}
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#9ca3af' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {isLoading ? '⏳ Configurando...' : `✅ ${t('buttons.save')}`}
        </button>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fef3c7', 
        borderRadius: '8px',
        fontSize: '13px',
        color: '#92400e'
      }}>
        <strong>{t('interface.privacy')}</strong> {t('interface.privacyText')}
      </div>

      {/* Modal de sucesso elegante - mesmo estilo do Modal.js */}
      {showSuccessModal && (
        <div 
          className="modal-overlay" 
          onClick={() => setShowSuccessModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              animation: 'modalSlideIn 0.3s ease-out'
            }}
          >
            <div 
              className="modal-header"
              style={{
                padding: '25px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎉</div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
                {t('interface.geminiConfigured')}
              </h2>
            </div>
            
            <div className="modal-body" style={{ padding: '30px' }}>
              <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <h3 style={{ color: '#059669', fontSize: '1.3rem', margin: '0 0 15px 0' }}>
                  {t('interface.readyToUse')}
                </h3>
                <p style={{ color: '#374151', fontSize: '1rem', lineHeight: '1.6', margin: '0 0 10px 0' }}>
                  Sua API key foi configurada e validada com sucesso.
                </p>
                <p style={{ color: '#374151', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
                  Agora você pode buscar <strong>qualquer palavra em espanhol</strong> e receber traduções inteligentes!
                </p>
              </div>
              
              <div 
                style={{
                  background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid #22c55e'
                }}
              >
                <h4 style={{ color: '#166534', fontSize: '1.1rem', margin: '0 0 15px 0' }}>
                  {t('interface.availableFeatures')}
                </h4>
                <ul style={{ color: '#15803d', margin: 0, paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>🔤 Tradução de palavras individuais</li>
                  <li style={{ marginBottom: '8px' }}>💬 Tradução de frases completas</li>
                  <li style={{ marginBottom: '8px' }}>🧠 Análise linguística detalhada</li>
                  <li style={{ marginBottom: '8px' }}>💡 Dicas de uso e contexto</li>
                  <li style={{ marginBottom: '0' }}>📊 Indicador de frequência de uso</li>
                </ul>
              </div>
            </div>
            
            <div 
              className="modal-footer"
              style={{
                padding: '20px 25px',
                background: 'rgba(248, 250, 252, 0.8)',
                borderTop: '1px solid rgba(203, 213, 224, 0.3)',
                textAlign: 'center'
              }}
            >
              <button 
                onClick={() => setShowSuccessModal(false)}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
{t('interface.startTranslating')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default ApiKeyConfig;
