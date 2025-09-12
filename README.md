# 🇪🇸 Buscador de Palabras en Español

Uma aplicação React moderna para buscar e estudar palavras em espanhol, com traduções em português e inglês.

## 🚀 Funcionalidades

- **Busca múltipla**: Pesquise por uma ou várias palavras separadas por vírgula
- **Busca multilíngue**: Encontre palavras buscando em espanhol, português ou inglês
- **Cards interativos**: Clique nos cards para ver as traduções
- **Pronúncia**: Ouça a pronúncia das palavras em diferentes idiomas
- **Interface moderna**: Design responsivo e intuitivo
- **Categorização**: Palavras organizadas por categorias (família, cores, números, etc.)
- **🤖 IA Integrada**: Traduções automáticas com Google Gemini para palavras não encontradas
- **🔊 Vozes otimizadas**: Sistema inteligente de seleção de vozes para melhor qualidade

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🛠️ Instalação

1. Clone ou baixe este projeto
2. Navegue até o diretório do projeto:
   ```bash
   cd Idiomas
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

## 🎯 Como usar

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

2. Abra seu navegador e acesse `http://localhost:3000`

3. Digite uma ou mais palavras no campo de busca (separadas por vírgula)

4. Clique em "Buscar" ou pressione Enter

5. Clique nos cards das palavras para ver as traduções

6. Use o botão de áudio (🔊) para ouvir a pronúncia

## 🤖 Configuração do Gemini AI (Opcional)

Para traduzir automaticamente palavras que não estão na base de dados:

1. **Obtenha uma API key gratuita**:
   - Acesse: [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Faça login com sua conta Google
   - Clique em "Create API Key"
   - Copie a chave gerada

2. **Configure na aplicação**:
   - Clique no botão "🤖 Ativar Gemini AI" no canto inferior esquerdo
   - Cole sua API key
   - Clique em "Salvar"

3. **Agora você pode buscar QUALQUER palavra em espanhol!**
   - A IA traduzirá automaticamente palavras não encontradas
   - Gerará exemplos de uso nos 3 idiomas
   - Fornecerá fonética e categorização

## 🎨 Funcionalidades da Interface

### Busca
- Digite palavras em espanhol, português ou inglês
- Use vírgulas para separar múltiplas palavras
- Remova termos específicos clicando no "x" ao lado deles

### Cards de Palavras
- **Frente**: Mostra a palavra em espanhol, fonética e categoria
- **Verso**: Exibe traduções em português e inglês, com exemplos
- **Áudio**: Pronúncia em diferentes idiomas usando síntese de voz

### Recursos Adicionais
- Design responsivo para mobile e desktop
- Animações suaves e transições
- Interface intuitiva e moderna

## 📚 Conteúdo Incluído

A aplicação inclui um vocabulário básico com:
- Saudações e cortesias
- Família
- Cores
- Números (1-5)
- Comida e bebidas
- Animais
- Casa e cômodos
- Tempo
- Verbos comuns
- Adjetivos básicos

## 🔧 Personalização

Para adicionar mais palavras, edite o arquivo `src/data/spanishWords.js` seguindo o formato:

```javascript
{
  spanish: "palavra em espanhol",
  portuguese: "tradução em português",
  english: "tradução em inglês",
  phonetic: "fonética (opcional)",
  category: "categoria",
  example: "exemplo em espanhol (opcional)",
  exampleTranslation: "tradução do exemplo (opcional)"
}
```

## 🤝 Contribuindo

Sinta-se à vontade para:
- Adicionar mais palavras ao vocabulário
- Melhorar a interface
- Adicionar novas funcionalidades
- Reportar bugs ou sugestões

## 📄 Licença

Este projeto é livre para uso pessoal e educacional.

---

¡Buena suerte con tus estudios de español! 🎓
