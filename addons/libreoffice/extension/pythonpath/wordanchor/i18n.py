"""Interface text in every supported language.

Menu labels end up in Addons.xcu (LibreOffice's own per-language mechanism,
``xml:lang`` values) and the extension description in description.xml: the build
generates both from this file, so it is the single place to translate. Messages
shown at run time are picked from LibreOffice's interface language.

To add a language, copy the "en" block, translate it and run the build.
"""

MESSAGES = {
    "en": {
        "displayName": "{name}: word emphasis for Writer",
        "description": "Reading aid: gently emphasizes the start of each word to give your eyes an anchor. Read more comfortably, your way. Free, open source, and nothing leaves your computer.",
        "menuDocument": "Emphasize document",
        "menuSelection": "Emphasize selection",
        "menuRemove": "Remove emphasis",
        "menuBold": "Style: bold",
        "menuColor": "Style: colour",
        "menuUnderline": "Style: underline",
        "menuLighter": "Strength: lighter",
        "menuMedium": "Strength: medium",
        "menuStronger": "Strength: stronger",
        "noSelection": "Select some text first.",
        "strengthSet": "Strength: {value}. Use “Emphasize document” again to apply it.",
        "styleSet": "Style: {value}.",
        "styleBold": "bold",
        "styleColor": "colour",
        "styleUnderline": "underline",
        "strengthLighter": "lighter",
        "strengthMedium": "medium",
        "strengthStronger": "stronger",
    },
    "es": {
        "displayName": "{name}: énfasis de palabras para Writer",
        "description": "Ayuda de lectura: destaca suavemente el inicio de cada palabra para que la vista encuentre dónde apoyarse. Lee más cómodo, a tu manera. Libre, gratuito y nada sale de tu ordenador.",
        "menuDocument": "Destacar el documento",
        "menuSelection": "Destacar la selección",
        "menuRemove": "Quitar el énfasis",
        "menuBold": "Estilo: negrita",
        "menuColor": "Estilo: color",
        "menuUnderline": "Estilo: subrayado",
        "menuLighter": "Intensidad: más suave",
        "menuMedium": "Intensidad: media",
        "menuStronger": "Intensidad: más intensa",
        "noSelection": "Selecciona primero un texto.",
        "strengthSet": "Intensidad: {value}. Usa «Destacar el documento» otra vez para aplicarla.",
        "styleSet": "Estilo: {value}.",
        "styleBold": "negrita",
        "styleColor": "color",
        "styleUnderline": "subrayado",
        "strengthLighter": "más suave",
        "strengthMedium": "media",
        "strengthStronger": "más intensa",
    },
    "ca": {
        "displayName": "{name}: èmfasi de paraules per a Writer",
        "description": "Ajuda de lectura: destaca suaument l'inici de cada paraula perquè la vista trobi on recolzar-se. Llegeix més còmode, a la teva manera. Lliure, gratuït i res no surt del teu ordinador.",
        "menuDocument": "Destacar el document",
        "menuSelection": "Destacar la selecció",
        "menuRemove": "Treure l'èmfasi",
        "menuBold": "Estil: negreta",
        "menuColor": "Estil: color",
        "menuUnderline": "Estil: subratllat",
        "menuLighter": "Intensitat: més suau",
        "menuMedium": "Intensitat: mitjana",
        "menuStronger": "Intensitat: més intensa",
        "noSelection": "Selecciona primer un text.",
        "strengthSet": "Intensitat: {value}. Fes servir «Destacar el document» un altre cop per aplicar-la.",
        "styleSet": "Estil: {value}.",
        "styleBold": "negreta",
        "styleColor": "color",
        "styleUnderline": "subratllat",
        "strengthLighter": "més suau",
        "strengthMedium": "mitjana",
        "strengthStronger": "més intensa",
    },
}


def messages_for(locale) -> dict:
    """Messages for a locale such as "ca", "es-ES" or "en_GB"; English otherwise."""
    lang = (locale or "").replace("_", "-").split("-")[0].lower()
    return MESSAGES.get(lang, MESSAGES["en"])
