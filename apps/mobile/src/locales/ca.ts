import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Biblioteca",
    intro:
      "Obre un llibre o enganxa un text per llegir-lo amb èmfasi. Els teus fitxers i el punt on ho vas deixar es queden en aquest dispositiu.",
    open: "Obrir un fitxer",
    paste: "Enganxar un text",
    empty: "Encara no hi ha res. Aquí apareixeran els llibres i textos que obris.",
    progress: "{n} % llegit",
    remove: "Treure «{title}» de la biblioteca",
    removed: "«{title}» s'ha tret de la biblioteca.",
    opening: "Obrint…",
    notSaved:
      "No s'ha pogut desar aquest fitxer al dispositiu. El pots llegir ara, però no es quedarà a la biblioteca.",
    missing: "Aquest llibre ja no és en aquest dispositiu.",
  },
  paste: {
    heading: "Enganxar un text",
    title: "Títol (opcional)",
    text: "Text",
    untitled: "Text enganxat",
    read: "Llegir",
    cancel: "Cancel·lar",
  },
  reader: {
    library: "Biblioteca",
    settings: "Ajustos",
    previous: "Anterior",
    next: "Següent",
    position: "{n} de {total}",
    empty: "Aquesta part no té text.",
    emphasis: "Èmfasi",
    textSize: "Mida del text",
    sizes: ["Normal", "Gran", "Molt gran", "Enorme"],
    theme: "Tema",
    themes: { system: "Com el dispositiu", light: "Clar", dark: "Fosc" },
    language: "Idioma",
    deviceLanguage: "Com el dispositiu",
  },
};
