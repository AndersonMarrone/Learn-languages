import React from 'react';

const WelcomePage = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        padding: '60px 40px',
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ marginBottom: '50px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <span style={{ fontSize: '3rem' }}>🌍</span>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0'
            }}>Idiomas</h1>
          </div>
          <p style={{
            fontSize: '1.2rem',
            color: '#64748b',
            margin: '0',
            fontWeight: '500'
          }}>
            Aprenda espanhol de forma interativa e eficiente
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'white',
              padding: '30px 24px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>Tradutor Inteligente</h3>
              <p style={{ color: '#64748b', margin: '0', lineHeight: '1.6' }}>Traduza palavras e frases com precisão usando nossa base de dados e IA</p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '30px 24px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📚</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>Aprendizado Personalizado</h3>
              <p style={{ color: '#64748b', margin: '0', lineHeight: '1.6' }}>Gere palavras aleatórias para estudar e faça anotações pessoais</p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '30px 24px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔊</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>Pronúncia com Áudio</h3>
              <p style={{ color: '#64748b', margin: '0', lineHeight: '1.6' }}>Ouça a pronúncia correta de cada palavra em espanhol</p>
            </div>
            
            <div style={{
              background: 'white',
              padding: '30px 24px',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📊</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: '0 0 12px 0' }}>Histórico de Progresso</h3>
              <p style={{ color: '#64748b', margin: '0', lineHeight: '1.6' }}>Acompanhe seu progresso e revise palavras estudadas</p>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap',
            marginTop: '20px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '2rem', fontWeight: '700', color: '#667eea', marginBottom: '4px' }}>10,000+</span>
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Palavras</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '2rem', fontWeight: '700', color: '#667eea', marginBottom: '4px' }}>100%</span>
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Gratuito</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '2rem', fontWeight: '700', color: '#667eea', marginBottom: '4px' }}>24/7</span>
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: '500' }}>Disponível</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
