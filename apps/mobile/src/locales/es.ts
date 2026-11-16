import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Biblioteca",
    intro:
      "Abre un libro o pega un texto para leerlo con énfasis. Tus archivos y el punto donde lo dejaste se quedan en este dispositivo.",
    open: "Abrir un archivo",
    paste: "Pegar un texto",
    empty: "Aún no hay nada. Aquí aparecerán los libros y textos que abras.",
    progress: "{n} % leído",
    remove: "Quitar «{title}» de la biblioteca",
    removed: "«{title}» se ha quitado de la biblioteca.",
    opening: "Abriendo…",
    notSaved:
      "No se ha podido guardar este archivo en el dispositivo. Puedes leerlo ahora, pero no se quedará en la biblioteca.",
    missing: "Ese libro ya no está en este dispositivo.",
  },
  paste: {
    heading: "Pegar un texto",
    title: "Título (opcional)",
    text: "Texto",
    untitled: "Texto pegado",
    read: "Leer",
    cancel: "Cancelar",
  },
  reader: {
    library: "Biblioteca",
    settings: "Ajustes",
    previous: "Anterior",
    next: "Siguiente",
    position: "{n} de {total}",
    empty: "Esta parte no tiene texto.",
    emphasis: "Énfasis",
    textSize: "Tamaño del texto",
    sizes: ["Normal", "Grande", "Muy grande", "Enorme"],
    theme: "Tema",
    themes: { system: "Como el dispositivo", light: "Claro", dark: "Oscuro" },
    language: "Idioma",
    deviceLanguage: "Como el dispositivo",
  },
};
