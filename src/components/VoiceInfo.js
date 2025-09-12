import React, { useState, useEffect } from 'react';

const VoiceInfo = () => {
  const [voices, setVoices] = useState([]);
  const [showVoices, setShowVoices] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const englishVoices = voices.filter(voice => voice.lang.includes('en'));
  const spanishVoices = voices.filter(voice => voice.lang.includes('es'));
  const portugueseVoices = voices.filter(voice => voice.lang.includes('pt'));

  const testVoice = (voice, text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = 0.75;
    window.speechSynthesis.cancel();
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  if (!showVoices) {
    return (
      <button 
        onClick={() => setShowVoices(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px',
          backgroundColor: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 1000
        }}
      >
        🔊 Ver Vozes
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      maxWidth: '400px',
      maxHeight: '500px',
      overflow: 'auto',
      zIndex: 1000,
      fontSize: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>Vozes Disponíveis</h3>
        <button 
          onClick={() => setShowVoices(false)}
          style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ color: '#2b6cb0', marginBottom: '8px' }}>🇺🇸 Inglês ({englishVoices.length})</h4>
        {englishVoices.map((voice, index) => (
          <div key={index} style={{ 
            padding: '5px', 
            margin: '2px 0', 
            backgroundColor: voice.name.includes('Microsoft') || voice.name.includes('Alex') || voice.name.includes('Samantha') ? '#e6f3ff' : '#f9f9f9',
            borderRadius: '3px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <strong>{voice.name}</strong> ({voice.lang})
              {voice.name.includes('Microsoft') && <span style={{color: '#0066cc'}}> ⭐</span>}
              {voice.name.includes('Alex') && <span style={{color: '#ff6600'}}> 🍎</span>}
              {voice.name.includes('Samantha') && <span style={{color: '#ff6600'}}> 🍎</span>}
            </div>
            <button 
              onClick={() => testVoice(voice, 'Hello, how are you today?')}
              style={{ 
                padding: '2px 8px', 
                fontSize: '10px', 
                backgroundColor: '#667eea', 
                color: 'white', 
                border: 'none', 
                borderRadius: '3px', 
                cursor: 'pointer' 
              }}
            >
              Test
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ color: '#e53e3e', marginBottom: '8px' }}>🇪🇸 Espanhol ({spanishVoices.length})</h4>
        {spanishVoices.slice(0, 3).map((voice, index) => (
          <div key={index} style={{ 
            padding: '5px', 
            margin: '2px 0', 
            backgroundColor: '#f9f9f9',
            borderRadius: '3px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div><strong>{voice.name}</strong> ({voice.lang})</div>
            <button 
              onClick={() => testVoice(voice, 'Hola, ¿cómo estás?')}
              style={{ 
                padding: '2px 8px', 
                fontSize: '10px', 
                backgroundColor: '#667eea', 
                color: 'white', 
                border: 'none', 
                borderRadius: '3px', 
                cursor: 'pointer' 
              }}
            >
              Test
            </button>
          </div>
        ))}
      </div>

      <div>
        <h4 style={{ color: '#38a169', marginBottom: '8px' }}>🇧🇷 Português ({portugueseVoices.length})</h4>
        {portugueseVoices.slice(0, 3).map((voice, index) => (
          <div key={index} style={{ 
            padding: '5px', 
            margin: '2px 0', 
            backgroundColor: '#f9f9f9',
            borderRadius: '3px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div><strong>{voice.name}</strong> ({voice.lang})</div>
            <button 
              onClick={() => testVoice(voice, 'Olá, como você está?')}
              style={{ 
                padding: '2px 8px', 
                fontSize: '10px', 
                backgroundColor: '#667eea', 
                color: 'white', 
                border: 'none', 
                borderRadius: '3px', 
                cursor: 'pointer' 
              }}
            >
              Test
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f4ff', borderRadius: '5px', fontSize: '11px' }}>
        <strong>💡 Dica:</strong> As vozes marcadas com ⭐ (Microsoft) e 🍎 (Apple) geralmente têm melhor qualidade.
      </div>
    </div>
  );
};

export default VoiceInfo;
