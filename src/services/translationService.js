import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuração da API key (você precisará adicionar sua própria chave)
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'sua-api-key-aqui';

class TranslationService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.initializeGemini();
  }

  initializeGemini() {
    try {
      if (API_KEY && API_KEY !== 'sua-api-key-aqui') {
        this.genAI = new GoogleGenerativeAI(API_KEY);
        // Usar o modelo correto: gemini-1.5-flash ou gemini-1.5-pro
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log('✅ Gemini AI inicializado com sucesso');
      } else {
        console.warn('⚠️ API key do Gemini não configurada');
      }
    } catch (error) {
      console.error('❌ Erro ao inicializar Gemini:', error);
    }
  }

  async translateWord(word, fromLang = 'auto', toLang = 'pt') {
    console.log('🤖 TranslationService.translateWord chamado para:', word);
    console.log('🌐 Idioma origem:', fromLang, '→ destino:', toLang);
    console.log('🔧 Model disponível?', !!this.model);
    console.log('🔧 GenAI disponível?', !!this.genAI);
    
    if (!this.model) {
      console.warn('⚠️ Gemini não disponível, usando tradução de fallback');
      return this.getFallbackTranslation(word, fromLang, toLang);
    }

    try {
      console.log('📤 Enviando prompt para Gemini...');
      
      // Detectar se é palavra ou frase
      const isPhrase = word.includes(' ') || word.length > 20;
      
      // Mapear códigos de idioma para nomes
      const languageNames = {
        'auto': 'detectar automaticamente',
        'es': 'espanhol',
        'pt': 'português brasileiro',
        'en': 'inglês americano'
      };

      const fromLanguageName = languageNames[fromLang] || 'idioma desconhecido';
      const toLanguageName = languageNames[toLang] || 'português brasileiro';

      const prompt = isPhrase ? 
        `Você é um linguista especializado. Analise a frase "${word}" que está em ${fromLanguageName} e traduza para ${toLanguageName}. Forneça as informações no formato JSON exato abaixo.

IMPORTANTE: Responda APENAS com o JSON válido, sem explicações ou texto adicional.

{
  "original": "${word}",
  "translation": "tradução para ${toLanguageName}",
  "originalLanguage": "${fromLang}",
  "targetLanguage": "${toLang}",
  "type": "phrase",
  "context": "contexto ou situação de uso",
  "analysis": "análise detalhada explicando se é uma expressão comum, literal, idiomática, ou se há peculiaridades. Mencione se faz sentido gramaticalmente, se é usado no dia a dia, ou se pode ser um mal-entendido",
  "commonness": "muito comum|comum|pouco comum|raro|não é uma expressão padrão",
  "tips": "dicas práticas sobre uso, variações regionais ou expressões similares mais comuns",
  "source": "gemini_ai"
}`
        : `Você é um linguista especializado. Analise a palavra "${word}" que está em ${fromLanguageName} e traduza para ${toLanguageName}. Forneça as informações no formato JSON exato abaixo.

IMPORTANTE: Responda APENAS com o JSON válido, sem explicações ou texto adicional.

{
  "original": "${word}",
  "translation": "tradução para ${toLanguageName}",
  "originalLanguage": "${fromLang}",
  "targetLanguage": "${toLang}",
  "phonetic": "fonética IPA da palavra original",
  "category": "categoria gramatical",
  "example": "exemplo de uso na língua original",
  "exampleTranslation": "tradução do exemplo para ${toLanguageName}",
  "analysis": "análise linguística explicando peculiaridades, uso regional, formalidade, ou se há algo interessante sobre esta palavra",
  "commonness": "muito comum|comum|pouco comum|raro|arcaico",
  "tips": "dicas sobre uso correto, sinônimos mais comuns, ou variações regionais",
  "confidence": "alta",
  "source": "gemini_ai"
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('📥 Resposta bruta do Gemini:', text);

      // Limpar a resposta removendo markdown se houver
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\s*/, '').replace(/```\s*$/, '');
      }
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\s*/, '').replace(/```\s*$/, '');
      }

      console.log('🧹 Texto limpo:', cleanText);

      // Tentar parsear o JSON da resposta
      try {
        const translationData = JSON.parse(cleanText);
        console.log('✅ JSON parseado com sucesso:', translationData);
        
        // Validar se tem os campos essenciais
        if (translationData.original && translationData.translation) {
          console.log('✅ Tradução completa obtida via Gemini');
          
          // Manter compatibilidade com o formato antigo para componentes existentes
          const compatibleData = {
            ...translationData,
            spanish: translationData.original, // Para compatibilidade
            portuguese: translationData.originalLanguage === 'pt' ? translationData.original : translationData.translation,
            english: translationData.originalLanguage === 'en' ? translationData.original : (translationData.targetLanguage === 'en' ? translationData.translation : ''),
            source: 'gemini',
            timestamp: new Date().toISOString()
          };
          
          return compatibleData;
        } else {
          console.error('❌ Resposta incompleta do Gemini - campos faltando');
          throw new Error('Resposta incompleta do Gemini');
        }
      } catch (parseError) {
        console.error('❌ Erro ao parsear JSON do Gemini:', parseError);
        console.log('🔍 Tentando extrair JSON da resposta...');
        
        // Tentar extrair JSON da resposta se estiver misturado com texto
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const extractedJson = JSON.parse(jsonMatch[0]);
            console.log('✅ JSON extraído com sucesso:', extractedJson);
            
            // Aplicar a mesma compatibilidade
            const compatibleExtracted = {
              ...extractedJson,
              spanish: extractedJson.original || extractedJson.spanish,
              portuguese: extractedJson.originalLanguage === 'pt' ? extractedJson.original : extractedJson.translation || extractedJson.portuguese,
              english: extractedJson.originalLanguage === 'en' ? extractedJson.original : (extractedJson.targetLanguage === 'en' ? extractedJson.translation : extractedJson.english || ''),
              source: 'gemini',
              timestamp: new Date().toISOString()
            };
            
            return compatibleExtracted;
          } catch (extractError) {
            console.error('❌ Erro ao extrair JSON:', extractError);
          }
        }
        
        return this.getFallbackTranslation(word, fromLang, toLang);
      }

    } catch (error) {
      console.error('❌ Erro geral na tradução com Gemini:', error);
      console.error('❌ Detalhes do erro:', error.message);
      return this.getFallbackTranslation(word, fromLang, toLang);
    }
  }

  getFallbackTranslation(word, fromLang = 'auto', toLang = 'pt') {
    // Tradução básica de fallback para casos comuns
    const basicTranslations = {
      // Verbos comuns
      'amar': { pt: 'amar', en: 'to love', category: 'verbo' },
      'odiar': { pt: 'odiar', en: 'to hate', category: 'verbo' },
      'esperar': { pt: 'esperar', en: 'to wait/hope', category: 'verbo' },
      'ayudar': { pt: 'ajudar', en: 'to help', category: 'verbo' },
      
      // Substantivos comuns
      'casa': { pt: 'casa', en: 'house', category: 'substantivo' },
      'agua': { pt: 'água', en: 'water', category: 'substantivo' },
      'fuego': { pt: 'fogo', en: 'fire', category: 'substantivo' },
      'tierra': { pt: 'terra', en: 'earth', category: 'substantivo' },
      
      // Adjetivos comuns
      'hermoso': { pt: 'lindo', en: 'beautiful', category: 'adjetivo' },
      'fácil': { pt: 'fácil', en: 'easy', category: 'adjetivo' },
      'difícil': { pt: 'difícil', en: 'difficult', category: 'adjetivo' },
    };

    const basic = basicTranslations[word.toLowerCase()];
    
    if (basic) {
      // Determinar a tradução baseada no idioma de destino
      let translation = '';
      if (toLang === 'pt') {
        translation = basic.pt;
      } else if (toLang === 'en') {
        translation = basic.en;
      } else {
        translation = basic.pt; // Default para português
      }

      return {
        original: word,
        translation: translation,
        originalLanguage: fromLang,
        targetLanguage: toLang,
        spanish: word, // Para compatibilidade
        portuguese: basic.pt,
        english: basic.en,
        phonetic: '',
        category: basic.category,
        example: `Ejemplo con ${word}`,
        exampleTranslation: `Exemplo com ${basic.pt}`,
        exampleEnglish: `Example with ${basic.en}`,
        source: 'fallback',
        confidence: 'baixa'
      };
    }

    // Se não encontrou nem no fallback
    const notFoundTranslation = toLang === 'en' 
      ? `[Translation not found: ${word}]`
      : toLang === 'es' 
      ? `[Traducción no encontrada: ${word}]`
      : `[Tradução não encontrada: ${word}]`;

    return {
      original: word,
      translation: notFoundTranslation,
      originalLanguage: fromLang,
      targetLanguage: toLang,
      spanish: word, // Para compatibilidade
      portuguese: `[Tradução não encontrada: ${word}]`,
      english: `[Translation not found: ${word}]`,
      phonetic: '',
      category: 'desconhecido',
      example: `No se encontró ejemplo para "${word}"`,
      exampleTranslation: `Exemplo não encontrado para "${word}"`,
      exampleEnglish: `Example not found for "${word}"`,
      source: 'not_found',
      confidence: 'nenhuma'
    };
  }

  // Método para verificar se o Gemini está disponível
  isGeminiAvailable() {
    return this.model !== null;
  }

  // Método para configurar a API key dinamicamente
  async setApiKey(apiKey) {
    console.log('🔧 Configurando API key do Gemini...');
    
    if (!apiKey || !apiKey.trim()) {
      console.error('❌ API key vazia ou inválida');
      return false;
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      
      // Tentar diferentes modelos disponíveis
      let modelName = "gemini-1.5-flash";
      try {
        this.model = this.genAI.getGenerativeModel({ model: modelName });
      } catch (modelError) {
        console.log('⚠️ Modelo gemini-1.5-flash não disponível, tentando gemini-1.5-pro...');
        modelName = "gemini-1.5-pro";
        try {
          this.model = this.genAI.getGenerativeModel({ model: modelName });
        } catch (modelError2) {
          console.log('⚠️ Modelo gemini-1.5-pro não disponível, tentando gemini-pro...');
          modelName = "gemini-pro";
          this.model = this.genAI.getGenerativeModel({ model: modelName });
        }
      }
      
      // Testar a API key fazendo uma requisição simples
      console.log(`🧪 Testando API key com modelo ${modelName}...`);
      const testResult = await this.model.generateContent("Traduza 'hola' para português: apenas responda 'olá'");
      const testResponse = await testResult.response;
      const testText = testResponse.text();
      
      console.log('✅ Teste da API key bem-sucedido:', testText);
      console.log(`✅ API key do Gemini configurada e validada com modelo ${modelName}`);
      return true;
    } catch (error) {
      console.error('❌ Erro ao configurar/testar API key:', error);
      console.error('❌ Detalhes:', error.message);
      
      // Verificar se é problema de quota ou permissão
      if (error.message.includes('quota') || error.message.includes('QUOTA_EXCEEDED')) {
        console.error('💰 Erro de quota: Você pode ter excedido o limite gratuito da API');
      } else if (error.message.includes('permission') || error.message.includes('PERMISSION_DENIED')) {
        console.error('🔒 Erro de permissão: Verifique se sua API key tem acesso ao Gemini');
      } else if (error.message.includes('not found') || error.message.includes('404')) {
        console.error('🔍 Modelo não encontrado: A API key pode estar incorreta ou sem acesso');
      }
      
      // Resetar em caso de erro
      this.genAI = null;
      this.model = null;
      
      return false;
    }
  }
}

// Criar instância singleton
const translationService = new TranslationService();

export default translationService;
