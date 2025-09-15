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
