export const es = {
  // Interface geral
  app: {
    title: "Aprende Idiomas",
    subtitle: "Aprende idiomas de forma fácil y divertida"
  },
  
  // Navegação
  nav: {
    home: "Inicio",
    history: "Historial",
    settings: "Configuración"
  },
  
  // Busca
  search: {
    placeholder: "Escribe una palabra en español...",
    button: "Buscar",
    noResults: "No se encontraron resultados",
    loading: "Cargando...",
    results: "Palabras encontradas"
  },
  
  // Histórico
  history: {
    title: "Historial de Búsquedas",
    empty: "Ninguna palabra en el historial",
    emptyDescription: "Tus palabras buscadas aparecerán aquí",
    clear: "Limpiar Historial",
    clearConfirm: "¿Estás seguro de que quieres limpiar todo el historial? Esta acción no se puede deshacer y perderás todas tus palabras guardadas."
  },
  
  // Configurações
  settings: {
    title: "Configuración",
    language: "Idioma",
    voice: "Voz",
    apiKey: "Clave de API",
    save: "Guardar",
    cancel: "Cancelar",
    apiKeyRequired: "Por favor, ingresa una clave de API válida",
    apiKeyError: "Error al configurar la clave de API. Verifica si la clave es correcta.",
    apiKeyTestSuccess: "¡Clave de API funcionando correctamente!",
    apiKeyTestError: "La clave de API no está funcionando correctamente."
  },
  
  // Controles de tradução
  translation: {
    from: "De",
    to: "Para",
    listen: "Escuchar",
    copy: "Copiar"
  },
  
  // Seletores
  selectors: {
    language: "Seleccionar Idioma",
    voice: "Seleccionar Voz"
  },
  
  // Cartões
  cards: {
    word: "Palabra",
    phrase: "Frase",
    category: "Categoría",
    phonetic: "Fonética",
    example: "Ejemplo",
    translation: "Traducción"
  },
  
  // Botões
  buttons: {
    play: "Reproducir",
    pause: "Pausar",
    stop: "Detener",
    close: "Cerrar",
    confirm: "Confirmar",
    cancel: "Cancelar",
    save: "Guardar",
    edit: "Editar",
    delete: "Eliminar",
    clear: "Limpiar",
    test: "Probar",
    remove: "Eliminar",
    configure: "Configurar",
    activate: "Activar",
    reload: "Recargar",
    export: "Exportar",
    swap: "Intercambiar"
  },
  
  // Mensagens
  messages: {
    success: "¡Éxito!",
    error: "¡Error!",
    warning: "¡Atención!",
    info: "Información",
    copied: "¡Copiado al portapapeles!",
    saved: "¡Configuración guardada!",
    cleared: "¡Historial limpiado!"
  },
  
  // Idiomas
  languages: {
    pt: "Português",
    en: "English",
    es: "Español"
  },
  
  // Categorias
  categories: {
    substantivo: "Sustantivo",
    verbo: "Verbo",
    adjetivo: "Adjetivo",
    adverbio: "Adverbio",
    preposicion: "Preposición",
    conjuncion: "Conjunción",
    interjeccion: "Interjección",
    articulo: "Artículo",
    pronombre: "Pronombre"
  },
  
  // Guia de uso
  usage: {
    title: "Cómo usar el Traductor",
    subtitle: "Aprende a aprovechar al máximo nuestra herramienta de traducción inteligente",
    step1: {
      title: "Escribe tus palabras",
      description: "Escribe palabras o frases completas en el campo de búsqueda"
    },
    step2: {
      title: "Elige los idiomas",
      description: "Selecciona el idioma de origen y destino usando los selectores"
    },
    step3: {
      title: "Busca y traduce",
      description: "Haz clic en \"Traducir\" para buscar en la base de datos y traducir con IA"
    },
    step4: {
      title: "Escucha la pronunciación",
      description: "Usa los botones de audio para escuchar la pronunciación correcta"
    },
    features: {
      ai: {
        title: "IA Inteligente",
        description: "Traducciones automáticas con Gemini AI para palabras no encontradas"
      },
      database: {
        title: "Base Completa",
        description: "Más de 1.400 palabras comunes en español, portugués e inglés"
      },
      multiple: {
        title: "Múltiples Términos",
        description: "Separa múltiples palabras con comas para búsqueda en lote"
      }
    }
  },

  // Textos específicos da interface
  interface: {
    searchingFor: "Buscando:",
    filterHistory: "Filtrar historial...",
    recent: "Recientes",
    frequent: "Frecuentes",
    all: "Todas",
    words: "Palabras",
    clickForDetails: "👆 Haz clic para ver detalles",
    example: "Ejemplo:",
    context: "Contexto:",
    linguisticAnalysis: "Análisis Lingüístico",
    usageTips: "Consejos de uso:",
    removeFromHistory: "Eliminar del historial",
    removeFromHistoryConfirm: "¿Deseas eliminar \"{word}\" de tu historial de búsquedas?",
    yesRemove: "Sí, eliminar",
    yesClear: "Sí, limpiar",
    activateGemini: "🤖 Activar Gemini AI",
    geminiActive: "🤖 Gemini AI Activo",
    configureGemini: "🤖 Configurar Gemini AI",
    geminiConfigured: "¡Gemini AI Configurado!",
    readyToUse: "🚀 ¡Listo para usar!",
    startTranslating: "🎯 Comenzar a Traducir",
    availableFeatures: "✨ Funcionalidades disponibles:",
    privacy: "🔒 Privacidad:",
    privacyText: "Tu clave API se almacena solo localmente en tu navegador y nunca se envía a nuestros servidores.",
    swapLanguages: "Intercambiar idiomas",
    swapLanguagesTooltip: "Intercambiar idiomas de origen y destino",
    cannotSwapAuto: "No se puede intercambiar con \"Detectar idioma\"",
    from: "De:",
    to: "Para:",
    resultsFound: "Resultados Encontrados",
    newTranslations: "Nuevas Traducciones",
    databaseDescription: "Palabras de la base de datos e historial de búsquedas",
    aiDescription: "Traducciones inéditas generadas por IA y añadidas a tu historial",
    tryOtherWords: "Intenta buscar otras palabras o términos en portugués/inglés.",
    wantToSearch: "🤖 ¿Quieres buscar cualquier palabra en español?",
    configureDescription: "¡Configura Gemini AI para traducir automáticamente palabras que no están en nuestra base de datos!",
    removeDuplicates: "Eliminar duplicados",
    selectVoice: "Seleccionar voz",
    closeModal: "Cerrar modal"
  }
};
