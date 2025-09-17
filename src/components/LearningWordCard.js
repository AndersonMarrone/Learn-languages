import React, { useState, useEffect } from 'react';
import './LearningWordCard.css';
import Modal from './Modal';
import { useTranslation } from '../hooks/useTranslation';

const LearningWordCard = ({ word, wordId, note = '', onSaveNote, globalVoice = null }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voices, setVoices] = useState([]);
  const [currentNote, setCurrentNote] = useState(note);
  const [isEditingNote, setIsEditingNote] = useState(false);

  // Carregar vozes disponíveis
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

  // Atualizar nota quando prop mudar
  useEffect(() => {
    setCurrentNote(note);
  }, [note]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditingNote(false);
  };

  const handleSaveNote = () => {
    onSaveNote(currentNote);
    setIsEditingNote(false);
  };

  const handleCancelEdit = () => {
    setCurrentNote(note);
    setIsEditingNote(false);
  };

  // Funções para determinar o texto e idioma corretos
  const getOriginalText = () => {
    if (word.original) return word.original;
    return word.spanish;
  };

  const getTranslationText = () => {
    if (word.translation && word.targetLanguage === 'pt') {
      return word.translation;
    }
    return word.portuguese;
  };

  const getEnhancedExample = () => {
    const enhancedExamples = {
      'el': { es: 'El niño juega en el parque', pt: 'O menino brinca no parque' },
      'la': { es: 'La niña lee un libro', pt: 'A menina lê um livro' },
      'un': { es: 'Un perro corre por la calle', pt: 'Um cachorro corre pela rua' },
      'una': { es: 'Una flor crece en el jardín', pt: 'Uma flor cresce no jardim' },
      'a': { es: 'Voy a la escuela todos los días', pt: 'Vou à escola todos os dias' },
      'de': { es: 'El libro de mi hermana', pt: 'O livro da minha irmã' },
      'en': { es: 'Estoy en casa ahora', pt: 'Estou em casa agora' },
      'con': { es: 'Voy al cine con mis amigos', pt: 'Vou ao cinema com meus amigos' },
      'por': { es: 'Camino por el parque', pt: 'Ando pelo parque' },
      'sin': { es: 'Café sin azúcar por favor', pt: 'Café sem açúcar por favor' },
      'para': { es: 'Este regalo es para ti', pt: 'Este presente é para você' },
      'hasta': { es: 'Trabajo hasta las seis', pt: 'Trabalho até as seis' },
      'sobre': { es: 'Hablamos sobre el proyecto', pt: 'Falamos sobre o projeto' },
      'ser': { es: 'Soy estudiante de español', pt: 'Sou estudante de espanhol' },
      'estar': { es: 'Estoy muy contento hoy', pt: 'Estou muito feliz hoje' },
      'tener': { es: 'Tengo hambre y sed', pt: 'Tenho fome e sede' },
      'hacer': { es: 'Hago mi tarea por la noche', pt: 'Faço minha lição à noite' },
      'ir': { es: 'Voy al supermercado', pt: 'Vou ao supermercado' },
      'venir': { es: 'Vienes a mi fiesta', pt: 'Você vem à minha festa' },
      'poder': { es: 'Puedo ayudarte con eso', pt: 'Posso te ajudar com isso' },
      'querer': { es: 'Quiero aprender español', pt: 'Quero aprender espanhol' },
      'saber': { es: 'Sé que es importante', pt: 'Sei que é importante' },
      'decir': { es: 'Digo la verdad siempre', pt: 'Digo a verdade sempre' },
      'ver': { es: 'Veo una película interesante', pt: 'Vejo um filme interessante' },
      'dar': { es: 'Te doy un regalo', pt: 'Te dou um presente' },
      'hablar': { es: 'Hablo español muy bien', pt: 'Falo espanhol muito bem' },
      'comer': { es: 'Como frutas todos los días', pt: 'Como frutas todos os dias' },
      'beber': { es: 'Bebo agua en el desayuno', pt: 'Bebo água no café da manhã' },
      'dormir': { es: 'Duermo ocho horas cada noche', pt: 'Durmo oito horas cada noite' },
      'vivir': { es: 'Vivo en una ciudad grande', pt: 'Vivo em uma cidade grande' },
      'trabajar': { es: 'Trabajo en una oficina', pt: 'Trabalho em um escritório' },
      'estudiar': { es: 'Estudio español por la mañana', pt: 'Estudo espanhol pela manhã' },
      'aprender': { es: 'Aprendo nuevas palabras', pt: 'Aprendo palavras novas' },
      'casa': { es: 'Mi casa es muy cómoda', pt: 'Minha casa é muito confortável' },
      'agua': { es: 'Bebo agua todos los días', pt: 'Bebo água todos os dias' },
      'tiempo': { es: 'No tengo tiempo para eso', pt: 'Não tenho tempo para isso' },
      'trabajo': { es: 'Mi trabajo es muy interesante', pt: 'Meu trabalho é muito interessante' },
      'familia': { es: 'Mi familia vive en Madrid', pt: 'Minha família vive em Madrid' },
      'amigo': { es: 'Mi mejor amigo es muy divertido', pt: 'Meu melhor amigo é muito divertido' },
      'comida': { es: 'La comida española es deliciosa', pt: 'A comida espanhola é deliciosa' },
      'dinero': { es: 'Necesito dinero para viajar', pt: 'Preciso de dinheiro para viajar' },
      'libro': { es: 'Este libro es muy interesante', pt: 'Este livro é muito interessante' },
      'coche': { es: 'Mi coche es azul', pt: 'Meu carro é azul' },
      'bueno': { es: 'Este restaurante es muy bueno', pt: 'Este restaurante é muito bom' },
      'malo': { es: 'El tiempo está malo hoy', pt: 'O tempo está ruim hoje' },
      'grande': { es: 'Tengo una casa grande', pt: 'Tenho uma casa grande' },
      'pequeño': { es: 'Mi perro es muy pequeño', pt: 'Meu cachorro é muito pequeno' },
      'nuevo': { es: 'Compré un coche nuevo', pt: 'Comprei um carro novo' },
      'viejo': { es: 'Mi abuelo es muy viejo', pt: 'Meu avô é muito velho' },
      'joven': { es: 'Soy joven y tengo energía', pt: 'Sou jovem e tenho energia' },
      'fácil': { es: 'Este ejercicio es muy fácil', pt: 'Este exercício é muito fácil' },
      'difícil': { es: 'El examen fue muy difícil', pt: 'A prova foi muito difícil' },
      'importante': { es: 'Es importante estudiar', pt: 'É importante estudar' },
      'bonito': { es: 'El paisaje es muy bonito', pt: 'A paisagem é muito bonita' },
      'feo': { es: 'Este edificio es muy feo', pt: 'Este prédio é muito feio' },
      'alto': { es: 'Mi hermano es muy alto', pt: 'Meu irmão é muito alto' },
      'bajo': { es: 'La mesa es muy baja', pt: 'A mesa é muito baixa' },
      'rápido': { es: 'El coche es muy rápido', pt: 'O carro é muito rápido' },
      'lento': { es: 'El autobús es muy lento', pt: 'O ônibus é muito lento' },
      'caliente': { es: 'El café está muy caliente', pt: 'O café está muito quente' },
      'frío': { es: 'El agua está muy fría', pt: 'A água está muito fria' },
      'rico': { es: 'La comida está muy rica', pt: 'A comida está muito gostosa' },
      'pobre': { es: 'Esa familia es muy pobre', pt: 'Essa família é muito pobre' }
    };

    const wordKey = word.spanish?.toLowerCase();
    if (enhancedExamples[wordKey]) {
      return enhancedExamples[wordKey];
    }
    
    return {
      es: word.example,
      pt: word.exampleTranslation
    };
  };

  const getExampleText = () => {
    const examples = getEnhancedExample();
    return examples.es;
  };

  const getExampleTranslation = () => {
    const examples = getEnhancedExample();
    return examples.pt;
  };

  const getLanguageFlag = (langCode) => {
    const flags = {
      'es': '🇪🇸',
      'pt': '🇧🇷', 
      'en': '🇺🇸'
    };
    return flags[langCode] || '🌐';
  };

  const getLanguageName = (langCode) => {
    const names = {
      'es': 'Espanhol',
      'pt': 'Português',
      'en': 'Inglês'
    };
    return names[langCode] || 'Idioma';
  };

  const getPhoneticExplanation = (phonetic) => {
    if (!phonetic) return null;
    
    const explanations = {
      'kon': 'kon = "con" (como em "conectar")',
      'se': 'se = "se" (sílaba tônica, marcada com ˈ)',
      'xos': 'xos = "jos" (o "x" em espanhol soa como "j" em português)',
      'hola': 'hola = "o-la" (H é mudo em espanhol)',
      'gra': 'gra = "gra" (como em "grato")',
      'θjas': 'θjas = "thias" (θ é o som "th" inglês)',
      'es': 'es = "es" (como em "escola")',
      'pa': 'pa = "pa" (como em "pato")',
      'ɲa': 'ɲa = "nha" (ɲ é o som "nh" português)',
      'la': 'la = "la" (como em "lata")',
      'o': 'o = "o" (como em "ovo")',
      'a': 'a = "a" (como em "água")',
      'e': 'e = "e" (como em "ele")',
      'i': 'i = "i" (como em "índio")',
      'u': 'u = "u" (como em "urso")',
      'b': 'b = "b" (como em "bola")',
      'd': 'd = "d" (como em "dado")',
      'f': 'f = "f" (como em "faca")',
      'g': 'g = "g" (como em "gato")',
      'k': 'k = "k" (como em "casa")',
      'l': 'l = "l" (como em "lua")',
      'm': 'm = "m" (como em "mão")',
      'n': 'n = "n" (como em "não")',
      'p': 'p = "p" (como em "pato")',
      'r': 'r = "r" (como em "rato")',
      's': 's = "s" (como em "sapo")',
      't': 't = "t" (como em "tato")',
      'v': 'v = "v" (como em "vaca")',
      'w': 'w = "w" (como em "watt")',
      'j': 'j = "j" (como em "jato")',
      'x': 'x = "j" (em espanhol, x soa como j português)',
      'y': 'y = "i" (em espanhol, y soa como i)',
      'z': 'z = "s" (em espanhol, z soa como s)',
      'c': 'c = "k" (antes de a, o, u) ou "s" (antes de e, i)',
      'qu': 'qu = "k" (como em "que")',
      'ch': 'ch = "tch" (como em "tchau")',
      'll': 'll = "lh" (como em "filho")',
      'ʎ': 'ʎ = "lh" (som do "ll" em espanhol, como em "filho")',
      'ñ': 'ñ = "nh" (como em "ninho")',
      'ɲ': 'ɲ = "nh" (som do "ñ" em espanhol, como em "ninho")',
      'rr': 'rr = "rr" (r forte, como em "carro")',
      'ɾ': 'ɾ = "r" (r simples, como em "rato")',
      'β': 'β = "b" (b suave entre vogais)',
      'ð': 'ð = "d" (d suave entre vogais)',
      'ɣ': 'ɣ = "g" (g suave entre vogais)',
      'ʝ': 'ʝ = "i" (som do "y" em espanhol)',
      'ʧ': 'ʧ = "tch" (som do "ch" em espanhol)',
      'ʤ': 'ʤ = "dj" (som do "j" em algumas palavras)'
    };

    const parts = phonetic.split(/[.ˈ]/).filter(part => part.length > 0);
    const explanations_list = [];
    const processed_sounds = new Set();
    
    parts.forEach(part => {
      if (explanations[part]) {
        if (!processed_sounds.has(part)) {
          explanations_list.push(explanations[part]);
          processed_sounds.add(part);
        }
      } else {
        const sounds = part.split('');
        sounds.forEach(sound => {
          if (explanations[sound] && !processed_sounds.has(sound)) {
            explanations_list.push(explanations[sound]);
            processed_sounds.add(sound);
          }
        });
      }
    });

    return explanations_list.length > 0 ? explanations_list : null;
  };

  const playAudio = (text, lang = 'es') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (globalVoice) {
        utterance.voice = globalVoice;
        utterance.lang = globalVoice.lang;
      } else {
        if (lang === 'es') {
          utterance.lang = 'es-ES';
          const spanishVoice = voices.find(voice => 
            voice.lang.includes('es') && voice.name.includes('Microsoft')
          ) || voices.find(voice => 
            voice.lang.includes('es') && voice.name.includes('Google')
          ) || voices.find(voice => 
            voice.lang.includes('es') && voice.name.includes('Natural')
          ) || voices.find(voice => voice.lang.includes('es'));
          if (spanishVoice) utterance.voice = spanishVoice;
        } else if (lang === 'pt') {
          utterance.lang = 'pt-BR';
          const portugueseVoice = voices.find(voice => 
            voice.lang.includes('pt') && voice.name.includes('Microsoft')
          ) || voices.find(voice => 
            voice.lang.includes('pt') && voice.name.includes('Google')
          ) || voices.find(voice => 
            voice.lang.includes('pt') && voice.name.includes('Natural')
          ) || voices.find(voice => voice.lang.includes('pt'));
          if (portugueseVoice) utterance.voice = portugueseVoice;
        } else if (lang === 'en') {
          utterance.lang = 'en-US';
          const englishVoice = voices.find(voice => 
            voice.lang.includes('en') && voice.name.includes('Microsoft')
          ) || voices.find(voice => 
            voice.lang.includes('en') && voice.name.includes('Google')
          ) || voices.find(voice => 
            voice.lang.includes('en') && voice.name.includes('Natural')
          ) || voices.find(voice => voice.lang.includes('en'));
          if (englishVoice) utterance.voice = englishVoice;
        }
      }
      
      utterance.rate = 0.75;
      utterance.pitch = 0.95;
      utterance.volume = 0.9;
      
      utterance.text = utterance.text.replace(/\./g, '. ');
      utterance.text = utterance.text.replace(/,/g, ', ');
      
      window.speechSynthesis.cancel();
      
      setTimeout(() => {
        if (utterance.voice && utterance.voice.name) {
          window.speechSynthesis.speak(utterance);
        } else {
          const defaultVoice = voices.find(voice => voice.lang.includes(utterance.lang.split('-')[0]));
          if (defaultVoice) {
            utterance.voice = defaultVoice;
          }
          window.speechSynthesis.speak(utterance);
        }
      }, 150);
    }
  };

  return (
    <>
      <div className="learning-word-card" onClick={handleOpenModal}>
        <div className="learning-card-header">
          <div className="learning-language-info">
            <span className="learning-flag">{getLanguageFlag('es')}</span>
            <span className="learning-lang-name">Espanhol</span>
          </div>
          <h3 className="learning-word-text">{getOriginalText()}</h3>
          <button 
            className="learning-audio-btn"
            onClick={(e) => {
              e.stopPropagation();
              playAudio(getOriginalText(), 'es');
            }}
            aria-label="Pronunciar palavra em espanhol"
          >
            ▶️
          </button>
        </div>
        
        <div className="learning-translation-info">
          <div className="learning-language-info">
            <span className="learning-flag">{getLanguageFlag('pt')}</span>
            <span className="learning-lang-name">Português</span>
          </div>
          <h4 className="learning-translation-text">{getTranslationText()}</h4>
          <button 
            className="learning-audio-btn"
            onClick={(e) => {
              e.stopPropagation();
              playAudio(getTranslationText(), 'pt');
            }}
            aria-label="Pronunciar tradução em português"
          >
            ▶️
          </button>
        </div>
        
        {word.phonetic && (
          <div className="learning-phonetic-section">
            <p className="learning-phonetic">/{word.phonetic}/</p>
            {getPhoneticExplanation(word.phonetic) && (
              <div className="learning-phonetic-explanation">
                {getPhoneticExplanation(word.phonetic).map((explanation, index) => (
                  <p key={index} className="learning-explanation-item">{explanation}</p>
                ))}
                <p className="learning-phonetic-result">
                  Então /{word.phonetic}/ = "{word.phonetic.replace(/[.ˈ]/g, '-').toLowerCase()}" ({getOriginalText()})
                </p>
              </div>
            )}
          </div>
        )}
        
        {word.category && (
          <span className="learning-category">{t(`categories.${word.category}`) || word.category}</span>
        )}

        {/* Indicador de anotação */}
        {currentNote && (
          <div className="learning-note-indicator">
            <span className="note-icon">📝</span>
            <span className="note-preview">
              {currentNote.length > 50 ? `${currentNote.substring(0, 50)}...` : currentNote}
            </span>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={`📖 ${getOriginalText()}`}
      >
        <div className="learning-modal-content">
          <div className="learning-modal-translations">
            {/* Palavra/frase original */}
            <div className="learning-translation-item">
              <span className="learning-flag">{getLanguageFlag('es')}</span>
              <div className="learning-translation-content">
                <p className="learning-translation">{getOriginalText()}</p>
                <button 
                  className="learning-audio-btn small"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(getOriginalText(), 'es');
                  }}
                  aria-label="Pronunciar palavra em espanhol"
                >
                  ▶️
                </button>
              </div>
            </div>
            
            {/* Tradução no idioma selecionado */}
            <div className="learning-translation-item">
              <span className="learning-flag">{getLanguageFlag('pt')}</span>
              <div className="learning-translation-content">
                <p className="learning-translation">{getTranslationText()}</p>
                <button 
                  className="learning-audio-btn small"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(getTranslationText(), 'pt');
                  }}
                  aria-label="Pronunciar tradução em português"
                >
                  ▶️
                </button>
              </div>
            </div>
          </div>
          
          {/* Exemplo de uso */}
          <div className="learning-example-section">
            <h4 className="learning-example-title">
              <span className="example-icon">💬</span>
              Exemplo de uso:
            </h4>
            <div className="learning-example-content">
              <p className="learning-example-text">{getExampleText()}</p>
              <p className="learning-example-translation">{getExampleTranslation()}</p>
            </div>
          </div>

          {/* Análise linguística se disponível */}
          {word.analysis && (
            <div className="learning-linguistic-analysis">
              <div className="learning-analysis-header">
                <span className="learning-analysis-icon">🧠</span>
                <span className="learning-analysis-label">Análise Linguística</span>
                {word.commonness && (
                  <span className={`learning-commonness-badge ${word.commonness.replace(' ', '-')}`}>
                    {word.commonness}
                  </span>
                )}
              </div>
              <p className="learning-analysis-text">{word.analysis}</p>
              {word.tips && (
                <div className="learning-tips-section">
                  <div className="learning-tips-header">
                    <span className="learning-tips-icon">💡</span>
                    <span className="learning-tips-label">Dicas de uso</span>
                  </div>
                  <p className="learning-tips-text">{word.tips}</p>
                </div>
              )}
            </div>
          )}

          {/* Seção de anotações */}
          <div className="learning-notes-section">
            <div className="learning-notes-header">
              <span className="notes-icon">📝</span>
              <span className="notes-label">Suas anotações</span>
            </div>
            
            {!isEditingNote ? (
              <div className="learning-notes-display">
                {currentNote ? (
                  <div className="learning-note-content">
                    <p className="learning-note-text">{currentNote}</p>
                    <button 
                      className="learning-edit-note-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingNote(true);
                      }}
                    >
                      ✏️ Editar
                    </button>
                  </div>
                ) : (
                  <div className="learning-no-note">
                    <p className="learning-no-note-text">Nenhuma anotação ainda</p>
                    <button 
                      className="learning-add-note-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditingNote(true);
                      }}
                    >
                      ➕ Adicionar anotação
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="learning-notes-edit">
                <textarea
                  className="learning-note-textarea"
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Digite suas anotações sobre esta palavra..."
                  rows="4"
                  autoFocus
                />
                <div className="learning-note-actions">
                  <button 
                    className="learning-save-note-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveNote();
                    }}
                  >
                    💾 Salvar
                  </button>
                  <button 
                    className="learning-cancel-note-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelEdit();
                    }}
                  >
                    ❌ Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LearningWordCard;
