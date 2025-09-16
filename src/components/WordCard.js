import React, { useState, useEffect } from 'react';
import './WordCard.css';
import Modal from './Modal';
import { useTranslation } from '../hooks/useTranslation';

const WordCard = ({ word, fromLanguage = 'auto', toLanguage = 'pt', globalVoice = null }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [voices, setVoices] = useState([]);

  // Carregar vozes disponíveis
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    // Carregar vozes imediatamente
    loadVoices();
    
    // Também carregar quando as vozes estiverem prontas
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Funções para determinar o texto e idioma corretos
  const getOriginalText = () => {
    // Determinar o texto original baseado no idioma de origem
    if (word.original) return word.original; // Para traduções novas do Gemini
    
    // Para compatibilidade com dados antigos
    if (fromLanguage === 'es' || fromLanguage === 'auto') return word.spanish;
    if (fromLanguage === 'pt') return word.portuguese;
    if (fromLanguage === 'en') return word.english;
    return word.spanish; // Fallback
  };

  const getTranslationText = () => {
    // Determinar a tradução baseada no idioma de destino
    if (word.translation && word.targetLanguage === toLanguage) {
      return word.translation; // Para traduções novas do Gemini
    }
    
    // Para compatibilidade com dados antigos
    if (toLanguage === 'pt') return word.portuguese;
    if (toLanguage === 'es') return word.spanish;
    if (toLanguage === 'en') return word.english;
    return word.portuguese; // Fallback
  };

  const getEnhancedExample = () => {
    // Criar exemplos mais úteis e contextuais baseados na palavra
    const enhancedExamples = {
      // Artigos
      'el': { es: 'El niño juega en el parque', pt: 'O menino brinca no parque' },
      'la': { es: 'La niña lee un libro', pt: 'A menina lê um livro' },
      'un': { es: 'Un perro corre por la calle', pt: 'Um cachorro corre pela rua' },
      'una': { es: 'Una flor crece en el jardín', pt: 'Uma flor cresce no jardim' },
      
      // Preposições
      'a': { es: 'Voy a la escuela todos los días', pt: 'Vou à escola todos os dias' },
      'de': { es: 'El libro de mi hermana', pt: 'O livro da minha irmã' },
      'en': { es: 'Estoy en casa ahora', pt: 'Estou em casa agora' },
      'con': { es: 'Voy al cine con mis amigos', pt: 'Vou ao cinema com meus amigos' },
      'por': { es: 'Camino por el parque', pt: 'Ando pelo parque' },
      'sin': { es: 'Café sin azúcar por favor', pt: 'Café sem açúcar por favor' },
      'para': { es: 'Este regalo es para ti', pt: 'Este presente é para você' },
      'hasta': { es: 'Trabajo hasta las seis', pt: 'Trabalho até as seis' },
      'sobre': { es: 'Hablamos sobre el proyecto', pt: 'Falamos sobre o projeto' },
      
      // Verbos comuns
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
      
      // Substantivos comuns
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
      'niñera': { es: 'La niñera cuida a los niños mientras trabajo', pt: 'A babá cuida das crianças enquanto eu trabalho' },
      'niño': { es: 'El niño juega en el parque', pt: 'O menino brinca no parque' },
      'niña': { es: 'La niña lee un cuento', pt: 'A menina lê uma história' },
      'padre': { es: 'Mi padre trabaja mucho', pt: 'Meu pai trabalha muito' },
      'madre': { es: 'Mi madre cocina muy bien', pt: 'Minha mãe cozinha muito bem' },
      'hermano': { es: 'Mi hermano es mayor que yo', pt: 'Meu irmão é mais velho que eu' },
      'hermana': { es: 'Mi hermana estudia medicina', pt: 'Minha irmã estuda medicina' },
      'escuela': { es: 'Voy a la escuela en autobús', pt: 'Vou à escola de ônibus' },
      'universidad': { es: 'Estudio en la universidad', pt: 'Estudo na universidade' },
      'hospital': { es: 'El hospital está cerca', pt: 'O hospital está perto' },
      'restaurante': { es: 'Cenamos en un restaurante', pt: 'Jantamos em um restaurante' },
      'tienda': { es: 'Compro ropa en la tienda', pt: 'Compro roupas na loja' },
      'calle': { es: 'Vivo en una calle tranquila', pt: 'Vivo em uma rua tranquila' },
      'ciudad': { es: 'Madrid es una ciudad grande', pt: 'Madrid é uma cidade grande' },
      'país': { es: 'España es mi país favorito', pt: 'Espanha é meu país favorito' },
      
      // Adjetivos
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
      'pobre': { es: 'Esa familia es muy pobre', pt: 'Essa família é muito pobre' },
      
      // Pronomes
      'yo': { es: 'Yo soy estudiante', pt: 'Eu sou estudante' },
      'tú': { es: 'Tú eres muy inteligente', pt: 'Você é muito inteligente' },
      'él': { es: 'Él trabaja en el banco', pt: 'Ele trabalha no banco' },
      'ella': { es: 'Ella estudia medicina', pt: 'Ela estuda medicina' },
      'nosotros': { es: 'Nosotros vamos al cine', pt: 'Nós vamos ao cinema' },
      'vosotros': { es: 'Vosotros sois muy simpáticos', pt: 'Vocês são muito simpáticos' },
      'ellos': { es: 'Ellos viven en Madrid', pt: 'Eles vivem em Madrid' },
      'ellas': { es: 'Ellas son hermanas', pt: 'Elas são irmãs' },
      
      // Números
      'uno': { es: 'Tengo un perro', pt: 'Tenho um cachorro' },
      'dos': { es: 'Compré dos libros', pt: 'Comprei dois livros' },
      'tres': { es: 'Vivo en el piso tres', pt: 'Vivo no terceiro andar' },
      'cuatro': { es: 'Son las cuatro de la tarde', pt: 'São quatro da tarde' },
      'cinco': { es: 'Tengo cinco hermanos', pt: 'Tenho cinco irmãos' },
      'diez': { es: 'El examen vale diez puntos', pt: 'A prova vale dez pontos' },
      'cien': { es: 'Tengo cien euros', pt: 'Tenho cem euros' },
      'mil': { es: 'El coche cuesta mil euros', pt: 'O carro custa mil euros' }
    };

    const wordKey = word.spanish?.toLowerCase();
    if (enhancedExamples[wordKey]) {
      return enhancedExamples[wordKey];
    }
    
    // Fallback para exemplos originais
    return {
      es: word.example,
      pt: word.exampleTranslation
    };
  };

  const getExampleText = () => {
    const examples = getEnhancedExample();
    if (fromLanguage === 'es' || fromLanguage === 'auto') return examples.es;
    if (fromLanguage === 'pt') return examples.pt;
    return examples.es; // Fallback
  };

  const getExampleTranslation = () => {
    const examples = getEnhancedExample();
    if (toLanguage === 'pt') return examples.pt;
    if (toLanguage === 'es') return examples.es;
    return examples.pt; // Fallback
  };


  const getLanguageFlag = (langCode) => {
    const flags = {
      'es': '🇪🇸',
      'pt': '🇧🇷', 
      'en': '🇺🇸',
      'auto': '🇪🇸' // Mostrar bandeira da Espanha para auto-detect
    };
    return flags[langCode] || '🌐';
  };

  const getLanguageName = (langCode) => {
    const names = {
      'es': 'Espanhol',
      'pt': 'Português',
      'en': 'Inglês',
      'auto': '' // Não mostrar texto para auto-detect, apenas a bandeira
    };
    return names[langCode] || 'Idioma';
  };

  const getPhoneticExplanation = (phonetic) => {
    if (!phonetic) return null;
    
    // Explicações detalhadas para sons comuns em espanhol
    const explanations = {
      // Sons básicos
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
      'ñ': 'ñ = "nh" (como em "ninho")',
      'rr': 'rr = "rr" (r forte, como em "carro")'
    };

    // Dividir a transcrição em partes
    const parts = phonetic.split(/[.ˈ]/).filter(part => part.length > 0);
    const explanations_list = [];
    
    parts.forEach(part => {
      if (explanations[part]) {
        explanations_list.push(explanations[part]);
      } else {
        // Para partes não mapeadas, tentar explicar sons individuais
        const sounds = part.split('');
        sounds.forEach(sound => {
          if (explanations[sound]) {
            explanations_list.push(explanations[sound]);
          }
        });
      }
    });

    return explanations_list.length > 0 ? explanations_list : null;
  };

  const playAudio = (text, lang = 'es') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      console.log('🎤 WordCard playAudio - globalVoice:', globalVoice ? globalVoice.name : 'null');
      
      // SEMPRE usar a voz global selecionada se disponível
      if (globalVoice) {
        utterance.voice = globalVoice;
        utterance.lang = globalVoice.lang; // Usar o idioma da voz selecionada
        console.log('🎤 Usando voz global:', globalVoice.name, 'para texto:', text);
      } else {
        // Fallback: configurar idioma e buscar melhor voz se não há voz global
        if (lang === 'es') {
          utterance.lang = 'es-ES';
          // Priorizar vozes mais naturais (Microsoft > Google > outras)
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
          // Priorizar vozes mais naturais (Microsoft > Google > outras)
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
          // Priorizar vozes mais naturais (Microsoft > Google > outras)
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
      
      // Configurações de voz mais naturais
      utterance.rate = 0.75; // Mais devagar para parecer mais natural
      utterance.pitch = 0.95; // Ligeiramente mais grave
      utterance.volume = 0.9; // Volume um pouco mais alto
      
      // Adicionar pausas naturais
      utterance.text = utterance.text.replace(/\./g, '. ');
      utterance.text = utterance.text.replace(/,/g, ', ');
      
      // Parar qualquer fala anterior
      window.speechSynthesis.cancel();
      
      // Aguardar um pouco mais para garantir que a voz esteja pronta
      setTimeout(() => {
        // Verificar se a voz ainda está disponível
        if (utterance.voice && utterance.voice.name) {
          window.speechSynthesis.speak(utterance);
        } else {
          // Fallback: usar voz padrão se a selecionada não estiver disponível
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
      <div className="word-card-simple" onClick={handleOpenModal}>
        <div className="word-header">
          <div className="language-info">
            <span className="flag">{getLanguageFlag(fromLanguage)}</span>
            <span className="lang-name">{getLanguageName(fromLanguage)}</span>
          </div>
          <h3 className="word-text">{getOriginalText()}</h3>
          <button 
            className="audio-btn"
            onClick={(e) => {
              e.stopPropagation();
              playAudio(getOriginalText(), fromLanguage === 'auto' ? 'es' : fromLanguage);
            }}
            aria-label={`Pronunciar palavra em ${getLanguageName(fromLanguage)}`}
          >
            ▶️
          </button>
        </div>
        
        <div className="translation-info">
          <div className="language-info">
            <span className="flag">{getLanguageFlag(toLanguage)}</span>
            <span className="lang-name">{getLanguageName(toLanguage)}</span>
          </div>
          <h4 className="translation-text">{getTranslationText()}</h4>
          <button 
            className="audio-btn"
            onClick={(e) => {
              e.stopPropagation();
              playAudio(getTranslationText(), toLanguage);
            }}
            aria-label={`Pronunciar tradução em ${getLanguageName(toLanguage)}`}
          >
            ▶️
          </button>
        </div>
        
        {word.phonetic && (
          <div className="phonetic-section">
            <p className="phonetic">/{word.phonetic}/</p>
            {getPhoneticExplanation(word.phonetic) && (
              <div className="phonetic-explanation">
                {getPhoneticExplanation(word.phonetic).map((explanation, index) => (
                  <p key={index} className="explanation-item">{explanation}</p>
                ))}
                <p className="phonetic-result">
                  Então /{word.phonetic}/ = "{word.phonetic.replace(/[.ˈ]/g, '-').toLowerCase()}" ({getOriginalText()})
                </p>
              </div>
            )}
          </div>
        )}
        
        {word.category && (
          <span className="category">{t(`categories.${word.category}`) || word.category}</span>
        )}
        
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={`📖 ${getOriginalText()}`}
      >
        <div className="modal-translations">
          {/* Palavra/frase original */}
          <div className="translation-item">
            <span className="flag">{getLanguageFlag(fromLanguage)}</span>
            <div className="translation-content">
              <p className="translation">{getOriginalText()}</p>
              <button 
                className="audio-btn small"
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(getOriginalText(), fromLanguage === 'auto' ? 'es' : fromLanguage);
                }}
                aria-label={`Pronunciar palavra em ${getLanguageName(fromLanguage)}`}
              >
                ▶️
              </button>
            </div>
          </div>
          
          {/* Tradução no idioma selecionado */}
          <div className="translation-item">
            <span className="flag">{getLanguageFlag(toLanguage)}</span>
            <div className="translation-content">
              <p className="translation">{getTranslationText()}</p>
              <button 
                className="audio-btn small"
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(getTranslationText(), toLanguage);
                }}
                aria-label={`Pronunciar tradução em ${getLanguageName(toLanguage)}`}
              >
                ▶️
              </button>
            </div>
          </div>
        </div>
        
        {word.analysis && (
          <div className="linguistic-analysis">
            <div className="analysis-header">
              <span className="analysis-icon">🧠</span>
              <span className="analysis-label">{t('interface.linguisticAnalysis')}</span>
              {word.commonness && (
                <span className={`commonness-badge ${word.commonness.replace(' ', '-')}`}>
                  {word.commonness}
                </span>
              )}
            </div>
            <p className="analysis-text">{word.analysis}</p>
            {word.tips && (
              <div className="tips-section">
                <div className="tips-header">
                  <span className="tips-icon">💡</span>
                  <span className="tips-label">{t('interface.usageTips')}</span>
                </div>
                <p className="tips-text">{word.tips}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default WordCard;
