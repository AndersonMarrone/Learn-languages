#!/usr/bin/env python3
"""
Script para corrigir TODOS os exemplos genéricos restantes no arquivo spanishWords.js
"""

import re
import json

def create_comprehensive_examples():
    """Cria exemplos melhores para todas as palavras restantes"""
    
    better_examples = {
        "aceite": {
            "example": "El aceite de oliva es muy saludable",
            "exampleTranslation": "O azeite de oliva é muito saudável",
            "exampleEnglish": "Olive oil is very healthy"
        },
        "aceituna": {
            "example": "Me gustan las aceitunas verdes",
            "exampleTranslation": "Gosto de azeitonas verdes",
            "exampleEnglish": "I like green olives"
        },
        "aceleración": {
            "example": "La aceleración del coche es impresionante",
            "exampleTranslation": "A aceleração do carro é impressionante",
            "exampleEnglish": "The car's acceleration is impressive"
        },
        "acelerador": {
            "example": "Pisó el acelerador con fuerza",
            "exampleTranslation": "Ele pisou no acelerador com força",
            "exampleEnglish": "He stepped on the accelerator hard"
        },
        "acelerar": {
            "example": "Voy a acelerar el proceso",
            "exampleTranslation": "Vou acelerar o processo",
            "exampleEnglish": "I'm going to speed up the process"
        },
        "acelga": {
            "example": "La acelga es muy nutritiva",
            "exampleTranslation": "A acelga é muito nutritiva",
            "exampleEnglish": "Swiss chard is very nutritious"
        },
        "acémila": {
            "example": "La acémila cargaba el equipaje",
            "exampleTranslation": "A mula carregava a bagagem",
            "exampleEnglish": "The mule carried the luggage"
        },
        "acendrar": {
            "example": "Voy a acendrar la chimenea",
            "exampleTranslation": "Vou acender a lareira",
            "exampleEnglish": "I'm going to light the fireplace"
        },
        "acento": {
            "example": "Tiene un acento muy marcado",
            "exampleTranslation": "Ele tem um sotaque muito marcado",
            "exampleEnglish": "He has a very strong accent"
        },
        "acentuación": {
            "example": "La acentuación es importante en español",
            "exampleTranslation": "A acentuação é importante em espanhol",
            "exampleEnglish": "Accentuation is important in Spanish"
        },
        "acentuar": {
            "example": "Debes acentuar la palabra correctamente",
            "exampleTranslation": "Você deve acentuar a palavra corretamente",
            "exampleEnglish": "You must accent the word correctly"
        },
        "acepción": {
            "example": "Esta palabra tiene varias acepciones",
            "exampleTranslation": "Esta palavra tem várias acepções",
            "exampleEnglish": "This word has several meanings"
        },
        "aceptable": {
            "example": "El precio es aceptable",
            "exampleTranslation": "O preço é aceitável",
            "exampleEnglish": "The price is acceptable"
        },
        "aceptación": {
            "example": "La aceptación del proyecto fue unánime",
            "exampleTranslation": "A aceitação do projeto foi unânime",
            "exampleEnglish": "The project's acceptance was unanimous"
        },
        "aceptar": {
            "example": "Voy a aceptar la oferta",
            "exampleTranslation": "Vou aceitar a oferta",
            "exampleEnglish": "I'm going to accept the offer"
        },
        "acequia": {
            "example": "La acequia riega los campos",
            "exampleTranslation": "A vala irriga os campos",
            "exampleEnglish": "The irrigation ditch waters the fields"
        },
        "acequiar": {
            "example": "Voy a acequiar el jardín",
            "exampleTranslation": "Vou irrigar o jardim",
            "exampleEnglish": "I'm going to irrigate the garden"
        },
        "acera": {
            "example": "Caminé por la acera",
            "exampleTranslation": "Caminhei pela calçada",
            "exampleEnglish": "I walked on the sidewalk"
        },
        "aceración": {
            "example": "La aceración del metal es compleja",
            "exampleTranslation": "A aceração do metal é complexa",
            "exampleEnglish": "Metal aceration is complex"
        },
        "acerado": {
            "example": "El acero acerado es muy resistente",
            "exampleTranslation": "O aço temperado é muito resistente",
            "exampleEnglish": "Tempered steel is very resistant"
        },
        "acerar": {
            "example": "Voy a acerar la hoja",
            "exampleTranslation": "Vou temperar a lâmina",
            "exampleEnglish": "I'm going to temper the blade"
        },
        "acerbo": {
            "example": "Su comentario fue muy acerbo",
            "exampleTranslation": "Seu comentário foi muito ácido",
            "exampleEnglish": "His comment was very harsh"
        },
        "acerca": {
            "example": "Quiero hablar acerca del proyecto",
            "exampleTranslation": "Quero falar sobre o projeto",
            "exampleEnglish": "I want to talk about the project"
        },
        "acercamiento": {
            "example": "El acercamiento entre los países es positivo",
            "exampleTranslation": "A aproximação entre os países é positiva",
            "exampleEnglish": "The rapprochement between countries is positive"
        },
        "acercar": {
            "example": "Voy a acercar la silla",
            "exampleTranslation": "Vou aproximar a cadeira",
            "exampleEnglish": "I'm going to move the chair closer"
        },
        "acero": {
            "example": "El acero es muy resistente",
            "exampleTranslation": "O aço é muito resistente",
            "exampleEnglish": "Steel is very resistant"
        },
        "acérrimo": {
            "example": "Es un acérrimo defensor de los derechos",
            "exampleTranslation": "Ele é um defensor ferrenho dos direitos",
            "exampleEnglish": "He is a staunch defender of rights"
        },
        "acertar": {
            "example": "Voy a acertar en el blanco",
            "exampleTranslation": "Vou acertar no alvo",
            "exampleEnglish": "I'm going to hit the target"
        },
        "acervo": {
            "example": "El acervo cultural es muy rico",
            "exampleTranslation": "O acervo cultural é muito rico",
            "exampleEnglish": "The cultural heritage is very rich"
        },
        "acetato": {
            "example": "El acetato es un material sintético",
            "exampleTranslation": "O acetato é um material sintético",
            "exampleEnglish": "Acetate is a synthetic material"
        },
        "acético": {
            "example": "El ácido acético es muy común",
            "exampleTranslation": "O ácido acético é muito comum",
            "exampleEnglish": "Acetic acid is very common"
        },
        "acetileno": {
            "example": "El acetileno se usa en soldadura",
            "exampleTranslation": "O acetileno é usado em soldagem",
            "exampleEnglish": "Acetylene is used in welding"
        },
        "acetona": {
            "example": "La acetona disuelve la pintura",
            "exampleTranslation": "A acetona dissolve a tinta",
            "exampleEnglish": "Acetone dissolves paint"
        },
        "achacar": {
            "example": "No debes achacar tus errores a otros",
            "exampleTranslation": "Você não deve culpar outros pelos seus erros",
            "exampleEnglish": "You shouldn't blame others for your mistakes"
        },
        "achaque": {
            "example": "Tiene algunos achaques de salud",
            "exampleTranslation": "Ele tem alguns problemas de saúde",
            "exampleEnglish": "He has some health problems"
        },
        "achicoria": {
            "example": "La achicoria es una planta medicinal",
            "exampleTranslation": "A chicória é uma planta medicinal",
            "exampleEnglish": "Chicory is a medicinal plant"
        },
        "aciago": {
            "example": "Fue un día aciago para la empresa",
            "exampleTranslation": "Foi um dia funesto para a empresa",
            "exampleEnglish": "It was a disastrous day for the company"
        },
        "acicate": {
            "example": "El premio es un acicate para estudiar",
            "exampleTranslation": "O prêmio é um incentivo para estudar",
            "exampleEnglish": "The prize is an incentive to study"
        },
        "acicular": {
            "example": "Las hojas aciculares son típicas de los pinos",
            "exampleTranslation": "As folhas aciculares são típicas dos pinheiros",
            "exampleEnglish": "Needle-like leaves are typical of pines"
        },
        "acidez": {
            "example": "La acidez del limón es muy alta",
            "exampleTranslation": "A acidez do limão é muito alta",
            "exampleEnglish": "The acidity of lemon is very high"
        },
        "ácido": {
            "example": "El ácido cítrico es natural",
            "exampleTranslation": "O ácido cítrico é natural",
            "exampleEnglish": "Citric acid is natural"
        },
        "acidosis": {
            "example": "La acidosis puede ser peligrosa",
            "exampleTranslation": "A acidose pode ser perigosa",
            "exampleEnglish": "Acidosis can be dangerous"
        },
        "acidular": {
            "example": "Voy a acidular el agua",
            "exampleTranslation": "Vou acidificar a água",
            "exampleEnglish": "I'm going to acidify the water"
        },
        "acídulo": {
            "example": "El sabor acídulo es refrescante",
            "exampleTranslation": "O sabor ácido é refrescante",
            "exampleEnglish": "The sour taste is refreshing"
        },
        "acierto": {
            "example": "Fue un acierto contratar a ese empleado",
            "exampleTranslation": "Foi um acerto contratar esse funcionário",
            "exampleEnglish": "It was a good decision to hire that employee"
        },
        "ácimo": {
            "example": "El pan ácimo es tradicional en Pascua",
            "exampleTranslation": "O pão ázimo é tradicional na Páscoa",
            "exampleEnglish": "Unleavened bread is traditional at Easter"
        },
        "aclamación": {
            "example": "La aclamación del público fue emocionante",
            "exampleTranslation": "A aclamação do público foi emocionante",
            "exampleEnglish": "The audience's acclamation was exciting"
        },
        "aclamar": {
            "example": "El público aclamó al artista",
            "exampleTranslation": "O público aclamou o artista",
            "exampleEnglish": "The audience acclaimed the artist"
        },
        "aclaración": {
            "example": "Necesito una aclaración sobre el tema",
            "exampleTranslation": "Preciso de um esclarecimento sobre o tema",
            "exampleEnglish": "I need clarification on the topic"
        },
        "aclarar": {
            "example": "Voy a aclarar la situación",
            "exampleTranslation": "Vou esclarecer a situação",
            "exampleEnglish": "I'm going to clarify the situation"
        },
        "aclimatación": {
            "example": "La aclimatación al clima es gradual",
            "exampleTranslation": "A aclimatação ao clima é gradual",
            "exampleEnglish": "Acclimatization to the climate is gradual"
        },
        "aclimatar": {
            "example": "Voy a aclimatar las plantas",
            "exampleTranslation": "Vou aclimatar as plantas",
            "exampleEnglish": "I'm going to acclimate the plants"
        },
        "acné": {
            "example": "El acné es común en la adolescencia",
            "exampleTranslation": "A acne é comum na adolescência",
            "exampleEnglish": "Acne is common in adolescence"
        },
        "acobardar": {
            "example": "No te dejes acobardar por las dificultades",
            "exampleTranslation": "Não se deixe intimidar pelas dificuldades",
            "exampleEnglish": "Don't let difficulties intimidate you"
        },
        "acogedor": {
            "example": "La casa es muy acogedora",
            "exampleTranslation": "A casa é muito aconchegante",
            "exampleEnglish": "The house is very cozy"
        },
        "acoger": {
            "example": "Voy a acoger a los refugiados",
            "exampleTranslation": "Vou acolher os refugiados",
            "exampleEnglish": "I'm going to welcome the refugees"
        },
        "acogida": {
            "example": "La acogida fue muy cálida",
            "exampleTranslation": "A recepção foi muito calorosa",
            "exampleEnglish": "The welcome was very warm"
        },
        "acolchonar": {
            "example": "Voy a acolchonar el sofá",
            "exampleTranslation": "Vou estofar o sofá",
            "exampleEnglish": "I'm going to upholster the sofa"
        },
        "acólito": {
            "example": "El acólito ayudó en la misa",
            "exampleTranslation": "O acólito ajudou na missa",
            "exampleEnglish": "The acolyte helped in the mass"
        },
        "acometer": {
            "example": "Voy a acometer el proyecto",
            "exampleTranslation": "Vou empreender o projeto",
            "exampleEnglish": "I'm going to undertake the project"
        },
        "acometida": {
            "example": "La acometida del enemigo fue feroz",
            "exampleTranslation": "O ataque do inimigo foi feroz",
            "exampleEnglish": "The enemy's attack was fierce"
        },
        "acomodación": {
            "example": "La acomodación es muy cómoda",
            "exampleTranslation": "A acomodação é muito confortável",
            "exampleEnglish": "The accommodation is very comfortable"
        },
        "acomodado": {
            "example": "Está muy acomodado en su trabajo",
            "exampleTranslation": "Ele está muito acomodado no trabalho",
            "exampleEnglish": "He is very comfortable in his job"
        },
        "acomodar": {
            "example": "Voy a acomodar los muebles",
            "exampleTranslation": "Vou acomodar os móveis",
            "exampleEnglish": "I'm going to arrange the furniture"
        },
        "acompañado": {
            "example": "Voy acompañado de mi familia",
            "exampleTranslation": "Vou acompanhado da minha família",
            "exampleEnglish": "I'm accompanied by my family"
        },
        "acompañamiento": {
            "example": "El acompañamiento musical es hermoso",
            "exampleTranslation": "O acompanhamento musical é lindo",
            "exampleEnglish": "The musical accompaniment is beautiful"
        },
        "acompañanta": {
            "example": "La acompañanta es muy amable",
            "exampleTranslation": "A acompanhante é muito gentil",
            "exampleEnglish": "The companion is very kind"
        },
        "acompañante": {
            "example": "Mi acompañante es muy divertido",
            "exampleTranslation": "Meu acompanhante é muito divertido",
            "exampleEnglish": "My companion is very funny"
        },
        "acompañar": {
            "example": "Voy a acompañar a mi madre",
            "exampleTranslation": "Vou acompanhar minha mãe",
            "exampleEnglish": "I'm going to accompany my mother"
        },
        "acondicionado": {
            "example": "El aire acondicionado está roto",
            "exampleTranslation": "O ar condicionado está quebrado",
            "exampleEnglish": "The air conditioning is broken"
        },
        "acondicionar": {
            "example": "Voy a acondicionar la habitación",
            "exampleTranslation": "Vou condicionar o quarto",
            "exampleEnglish": "I'm going to condition the room"
        },
        "acongojar": {
            "example": "La noticia me acongoja",
            "exampleTranslation": "A notícia me angustia",
            "exampleEnglish": "The news distresses me"
        },
        "aconsejable": {
            "example": "Es aconsejable hacer ejercicio",
            "exampleTranslation": "É aconselhável fazer exercício",
            "exampleEnglish": "It's advisable to exercise"
        },
        "aconsejar": {
            "example": "Te voy a aconsejar sobre el tema",
            "exampleTranslation": "Vou te aconselhar sobre o tema",
            "exampleEnglish": "I'm going to advise you on the topic"
        },
        "acontecer": {
            "example": "¿Qué va a acontecer mañana?",
            "exampleTranslation": "O que vai acontecer amanhã?",
            "exampleEnglish": "What will happen tomorrow?"
        },
        "acontecimiento": {
            "example": "Fue un acontecimiento histórico",
            "exampleTranslation": "Foi um acontecimento histórico",
            "exampleEnglish": "It was a historical event"
        },
        "acoplado": {
            "example": "El remolque está acoplado al camión",
            "exampleTranslation": "O reboque está acoplado ao caminhão",
            "exampleEnglish": "The trailer is coupled to the truck"
        },
        "acoplamiento": {
            "example": "El acoplamiento de las piezas es perfecto",
            "exampleTranslation": "O acoplamento das peças é perfeito",
            "exampleEnglish": "The coupling of the parts is perfect"
        },
        "acoplar": {
            "example": "Voy a acoplar las piezas",
            "exampleTranslation": "Vou acoplar as peças",
            "exampleEnglish": "I'm going to couple the parts"
        },
        "acorazado": {
            "example": "El acorazado es un barco de guerra",
            "exampleTranslation": "O encouraçado é um navio de guerra",
            "exampleEnglish": "The battleship is a warship"
        },
        "acordar": {
            "example": "Voy a acordar la reunión",
            "exampleTranslation": "Vou marcar a reunião",
            "exampleEnglish": "I'm going to schedule the meeting"
        },
        "acorde": {
            "example": "El acorde musical es hermoso",
            "exampleTranslation": "O acorde musical é lindo",
            "exampleEnglish": "The musical chord is beautiful"
        },
        "acordeón": {
            "example": "El acordeón es un instrumento musical",
            "exampleTranslation": "O acordeão é um instrumento musical",
            "exampleEnglish": "The accordion is a musical instrument"
        },
        "acordeonista": {
            "example": "El acordeonista toca muy bien",
            "exampleTranslation": "O acordeonista toca muito bem",
            "exampleEnglish": "The accordionist plays very well"
        },
        "acorralamiento": {
            "example": "El acorralamiento del animal fue exitoso",
            "exampleTranslation": "O encurralamento do animal foi bem-sucedido",
            "exampleEnglish": "The animal's corralling was successful"
        },
        "acorralar": {
            "example": "Voy a acorralar al animal",
            "exampleTranslation": "Vou encurralar o animal",
            "exampleEnglish": "I'm going to corral the animal"
        },
        "acortamiento": {
            "example": "El acortamiento del texto es necesario",
            "exampleTranslation": "O encurtamento do texto é necessário",
            "exampleEnglish": "Shortening the text is necessary"
        },
        "acortar": {
            "example": "Voy a acortar el vestido",
            "exampleTranslation": "Vou encurtar o vestido",
            "exampleEnglish": "I'm going to shorten the dress"
        },
        "acosado": {
            "example": "Se siente acosado por la prensa",
            "exampleTranslation": "Ele se sente perseguido pela imprensa",
            "exampleEnglish": "He feels harassed by the press"
        },
        "acosar": {
            "example": "No debes acosar a nadie",
            "exampleTranslation": "Você não deve assediar ninguém",
            "exampleEnglish": "You shouldn't harass anyone"
        },
        "acostar": {
            "example": "Voy a acostar a mi hijo",
            "exampleTranslation": "Vou deitar meu filho",
            "exampleEnglish": "I'm going to put my son to bed"
        },
        "acostumbrar": {
            "example": "Voy a acostumbrar al perro",
            "exampleTranslation": "Vou acostumar o cachorro",
            "exampleEnglish": "I'm going to get the dog used to it"
        },
        "acotar": {
            "example": "Voy a acotar el terreno",
            "exampleTranslation": "Vou demarcar o terreno",
            "exampleEnglish": "I'm going to mark the land"
        },
        "acre": {
            "example": "El olor acre es desagradable",
            "exampleTranslation": "O cheiro acre é desagradável",
            "exampleEnglish": "The acrid smell is unpleasant"
        },
        "acrecentar": {
            "example": "Voy a acrecentar mis conocimientos",
            "exampleTranslation": "Vou aumentar meus conhecimentos",
            "exampleEnglish": "I'm going to increase my knowledge"
        },
        "acreditar": {
            "example": "Voy a acreditar mi experiencia",
            "exampleTranslation": "Vou credenciar minha experiência",
            "exampleEnglish": "I'm going to accredit my experience"
        },
        "acreedor": {
            "example": "El acreedor exige el pago",
            "exampleTranslation": "O credor exige o pagamento",
            "exampleEnglish": "The creditor demands payment"
        },
        "acribillar": {
            "example": "Voy a acribillar a preguntas",
            "exampleTranslation": "Vou bombardear com perguntas",
            "exampleEnglish": "I'm going to bombard with questions"
        }
    }
    
    return better_examples

def fix_all_remaining_examples_in_file(file_path):
    """Corrige todos os exemplos genéricos restantes no arquivo"""
    
    better_examples = create_comprehensive_examples()
    
    # Ler o arquivo
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Contar quantas substituições foram feitas
    substitutions = 0
    
    # Padrão para encontrar exemplos genéricos em português
    pattern_pt = r'exampleTranslation: "Exemplo com (\w+)"'
    
    def replace_example_pt(match):
        nonlocal substitutions
        word = match.group(1)
        if word in better_examples:
            substitutions += 1
            example_data = better_examples[word]
            return f'exampleTranslation: "{example_data["exampleTranslation"]}"'
        return match.group(0)
    
    # Substituir exemplos genéricos em português
    new_content = re.sub(pattern_pt, replace_example_pt, content)
    
    # Padrão para encontrar exemplos genéricos em espanhol
    pattern_es = r'example: "El (\w+)"'
    
    def replace_example_es(match):
        nonlocal substitutions
        word = match.group(1)
        if word in better_examples:
            substitutions += 1
            example_data = better_examples[word]
            return f'example: "{example_data["example"]}"'
        return match.group(0)
    
    # Substituir exemplos genéricos em espanhol
    new_content = re.sub(pattern_es, replace_example_es, new_content)
    
    # Padrão para encontrar exemplos genéricos em inglês
    pattern_en = r'exampleEnglish: "Example with (\w+)"'
    
    def replace_example_en(match):
        nonlocal substitutions
        word = match.group(1)
        if word in better_examples:
            substitutions += 1
            example_data = better_examples[word]
            return f'exampleEnglish: "{example_data["exampleEnglish"]}"'
        return match.group(0)
    
    # Substituir exemplos genéricos em inglês
    new_content = re.sub(pattern_en, replace_example_en, new_content)
    
    # Escrever o arquivo modificado
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Correção completa! {substitutions} exemplos foram melhorados.")
    print(f"Total de palavras com exemplos melhorados: {len(better_examples)}")

if __name__ == "__main__":
    file_path = "src/data/spanishWords.js"
    fix_all_remaining_examples_in_file(file_path)
