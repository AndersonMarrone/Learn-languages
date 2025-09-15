#!/usr/bin/env python3
"""
Script para corrigir TODOS os exemplos genéricos restantes no arquivo spanishWords.js
"""

import re
import json

def create_comprehensive_examples():
    """Cria exemplos melhores para todas as palavras restantes"""
    
    better_examples = {
        "abstracción": {
            "example": "La abstracción es un concepto filosófico",
            "exampleTranslation": "A abstração é um conceito filosófico",
            "exampleEnglish": "Abstraction is a philosophical concept"
        },
        "abstracto": {
            "example": "El arte abstracto es muy interesante",
            "exampleTranslation": "A arte abstrata é muito interessante",
            "exampleEnglish": "Abstract art is very interesting"
        },
        "abstraer": {
            "example": "Es difícil abstraer la idea principal",
            "exampleTranslation": "É difícil abstrair a ideia principal",
            "exampleEnglish": "It's difficult to abstract the main idea"
        },
        "abstraído": {
            "example": "Está abstraído en sus pensamientos",
            "exampleTranslation": "Ele está abstraído em seus pensamentos",
            "exampleEnglish": "He is absorbed in his thoughts"
        },
        "absuelto": {
            "example": "El acusado fue absuelto",
            "exampleTranslation": "O acusado foi absolvido",
            "exampleEnglish": "The defendant was acquitted"
        },
        "absurdo": {
            "example": "Esa idea es completamente absurda",
            "exampleTranslation": "Essa ideia é completamente absurda",
            "exampleEnglish": "That idea is completely absurd"
        },
        "abúlico": {
            "example": "Se siente abúlico y sin energía",
            "exampleTranslation": "Ele se sente abúlico e sem energia",
            "exampleEnglish": "He feels listless and without energy"
        },
        "abultar": {
            "example": "El paquete abulta mucho",
            "exampleTranslation": "O pacote é muito volumoso",
            "exampleEnglish": "The package is very bulky"
        },
        "abundante": {
            "example": "Hay abundante comida en la mesa",
            "exampleTranslation": "Há comida abundante na mesa",
            "exampleEnglish": "There is abundant food on the table"
        },
        "abundar": {
            "example": "Los problemas abundan en esta empresa",
            "exampleTranslation": "Os problemas abundam nesta empresa",
            "exampleEnglish": "Problems abound in this company"
        },
        "aburrido": {
            "example": "Estoy muy aburrido en casa",
            "exampleTranslation": "Estou muito entediado em casa",
            "exampleEnglish": "I'm very bored at home"
        },
        "aburrir": {
            "example": "Esta película me aburre",
            "exampleTranslation": "Este filme me entedia",
            "exampleEnglish": "This movie bores me"
        },
        "abusar": {
            "example": "No debes abusar de la confianza",
            "exampleTranslation": "Você não deve abusar da confiança",
            "exampleEnglish": "You shouldn't abuse trust"
        },
        "abusivo": {
            "example": "El comportamiento abusivo es inaceptable",
            "exampleTranslation": "O comportamento abusivo é inaceitável",
            "exampleEnglish": "Abusive behavior is unacceptable"
        },
        "abyección": {
            "example": "La abyección moral es terrible",
            "exampleTranslation": "A abjeção moral é terrível",
            "exampleEnglish": "Moral abjection is terrible"
        },
        "abyecto": {
            "example": "Su comportamiento fue abyecto",
            "exampleTranslation": "Seu comportamento foi abjeto",
            "exampleEnglish": "His behavior was abject"
        },
        "acá": {
            "example": "Ven acá, por favor",
            "exampleTranslation": "Venha cá, por favor",
            "exampleEnglish": "Come here, please"
        },
        "acabado": {
            "example": "El trabajo está bien acabado",
            "exampleTranslation": "O trabalho está bem acabado",
            "exampleEnglish": "The work is well finished"
        },
        "acabar": {
            "example": "Voy a acabar mi tarea",
            "exampleTranslation": "Vou terminar minha tarefa",
            "exampleEnglish": "I'm going to finish my task"
        },
        "acadêmico": {
            "example": "El año académico comienza en septiembre",
            "exampleTranslation": "O ano acadêmico começa em setembro",
            "exampleEnglish": "The academic year begins in September"
        },
        "acrílico": {
            "example": "La pintura acrílica es muy resistente",
            "exampleTranslation": "A tinta acrílica é muito resistente",
            "exampleEnglish": "Acrylic paint is very resistant"
        },
        "acrisolado": {
            "example": "El oro acrisolado es muy puro",
            "exampleTranslation": "O ouro refinado é muito puro",
            "exampleEnglish": "Refined gold is very pure"
        },
        "acrisolar": {
            "example": "Voy a acrisolar el metal",
            "exampleTranslation": "Vou refinar o metal",
            "exampleEnglish": "I'm going to refine the metal"
        },
        "acritud": {
            "example": "La acritud de su comentario fue evidente",
            "exampleTranslation": "A acidez do seu comentário foi evidente",
            "exampleEnglish": "The harshness of his comment was evident"
        },
        "acrobacia": {
            "example": "La acrobacia del circo es impresionante",
            "exampleTranslation": "A acrobacia do circo é impressionante",
            "exampleEnglish": "The circus acrobatics are impressive"
        },
        "acróbata": {
            "example": "El acróbata realizó una pirueta",
            "exampleTranslation": "O acrobata realizou uma pirueta",
            "exampleEnglish": "The acrobat performed a pirouette"
        },
        "acrobático": {
            "example": "El salto acrobático fue perfecto",
            "exampleTranslation": "O salto acrobático foi perfeito",
            "exampleEnglish": "The acrobatic jump was perfect"
        },
        "acrópolis": {
            "example": "La acrópolis de Atenas es famosa",
            "exampleTranslation": "A acrópole de Atenas é famosa",
            "exampleEnglish": "The Acropolis of Athens is famous"
        },
        "acróstico": {
            "example": "El acróstico es un tipo de poema",
            "exampleTranslation": "O acróstico é um tipo de poema",
            "exampleEnglish": "The acrostic is a type of poem"
        },
        "acta": {
            "example": "El acta de la reunión está lista",
            "exampleTranslation": "A ata da reunião está pronta",
            "exampleEnglish": "The meeting minutes are ready"
        },
        "actitud": {
            "example": "Su actitud es muy positiva",
            "exampleTranslation": "Sua atitude é muito positiva",
            "exampleEnglish": "His attitude is very positive"
        },
        "activar": {
            "example": "Voy a activar la alarma",
            "exampleTranslation": "Vou ativar o alarme",
            "exampleEnglish": "I'm going to activate the alarm"
        },
        "actividad": {
            "example": "La actividad física es importante",
            "exampleTranslation": "A atividade física é importante",
            "exampleEnglish": "Physical activity is important"
        },
        "activista": {
            "example": "El activista lucha por los derechos",
            "exampleTranslation": "O ativista luta pelos direitos",
            "exampleEnglish": "The activist fights for rights"
        },
        "activo": {
            "example": "Está muy activo en el trabajo",
            "exampleTranslation": "Ele está muito ativo no trabalho",
            "exampleEnglish": "He is very active at work"
        },
        "acto": {
            "example": "El acto de graduación fue emocionante",
            "exampleTranslation": "A cerimônia de formatura foi emocionante",
            "exampleEnglish": "The graduation ceremony was exciting"
        },
        "actor": {
            "example": "El actor interpretó el papel perfectamente",
            "exampleTranslation": "O ator interpretou o papel perfeitamente",
            "exampleEnglish": "The actor played the role perfectly"
        },
        "actora": {
            "example": "La actora recibió un premio",
            "exampleTranslation": "A atriz recebeu um prêmio",
            "exampleEnglish": "The actress received an award"
        },
        "actriz": {
            "example": "La actriz es muy talentosa",
            "exampleTranslation": "A atriz é muito talentosa",
            "exampleEnglish": "The actress is very talented"
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
