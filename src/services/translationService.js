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

  async translateWord(word, fromLang = 'auto', toLangs = ['pt', 'en']) {
    console.log('🤖 TranslationService.translateWord chamado para:', word);
    console.log('🔧 Model disponível?', !!this.model);
    console.log('🔧 GenAI disponível?', !!this.genAI);
    
    if (!this.model) {
      console.warn('⚠️ Gemini não disponível, usando tradução de fallback');
      return this.getFallbackTranslation(word);
    }

    try {
      console.log('📤 Enviando prompt para Gemini...');
      
      const prompt = `Você é um tradutor especializado em espanhol. Traduza a palavra "${word}" e forneça as informações no formato JSON exato abaixo.

IMPORTANTE: Responda APENAS com o JSON válido, sem explicações ou texto adicional.

{
  "spanish": "${word}",
  "portuguese": "tradução em português brasileiro",
  "english": "tradução em inglês americano",
  "phonetic": "fonética IPA em espanhol",
  "category": "categoria gramatical",
  "example": "exemplo de uso em espanhol",
  "exampleTranslation": "tradução do exemplo em português",
  "exampleEnglish": "tradução do exemplo em inglês",
  "confidence": "alta"
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
        if (translationData.spanish && translationData.portuguese && translationData.english) {
          console.log('✅ Tradução completa obtida via Gemini');
          return {
            ...translationData,
            source: 'gemini',
            timestamp: new Date().toISOString()
          };
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
            return {
              ...extractedJson,
              source: 'gemini',
              timestamp: new Date().toISOString()
            };
          } catch (extractError) {
            console.error('❌ Erro ao extrair JSON:', extractError);
          }
        }
        
        return this.getFallbackTranslation(word);
      }

    } catch (error) {
      console.error('❌ Erro geral na tradução com Gemini:', error);
      console.error('❌ Detalhes do erro:', error.message);
      return this.getFallbackTranslation(word);
    }
  }

  getFallbackTranslation(word) {
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
      return {
        spanish: word,
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
    return {
      spanish: word,
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
