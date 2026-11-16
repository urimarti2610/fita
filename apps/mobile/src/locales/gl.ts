import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Biblioteca",
    intro:
      "Abre un libro ou pega un texto para lelo con énfase. Os teus ficheiros e o punto onde o deixaches quedan neste dispositivo.",
    open: "Abrir un ficheiro",
    paste: "Pegar un texto",
    empty: "Aínda non hai nada. Aquí aparecerán os libros e textos que abras.",
    progress: "{n} % lido",
    remove: "Quitar «{title}» da biblioteca",
    removed: "Quitouse «{title}» da biblioteca.",
    opening: "Abrindo…",
    notSaved:
      "Non se puido gardar este ficheiro no dispositivo. Podes lelo agora, pero non quedará na biblioteca.",
    missing: "Ese libro xa non está neste dispositivo.",
  },
  paste: {
    heading: "Pegar un texto",
    title: "Título (opcional)",
    text: "Texto",
    untitled: "Texto pegado",
    read: "Ler",
    cancel: "Cancelar",
  },
  reader: {
    library: "Biblioteca",
    settings: "Axustes",
    previous: "Anterior",
    next: "Seguinte",
    position: "{n} de {total}",
    empty: "Esta parte non ten texto.",
    emphasis: "Énfase",
    textSize: "Tamaño do texto",
    sizes: ["Normal", "Grande", "Moi grande", "Enorme"],
    theme: "Tema",
    themes: { system: "Coma o dispositivo", light: "Claro", dark: "Escuro" },
    language: "Idioma",
    deviceLanguage: "Coma o dispositivo",
  },
};
