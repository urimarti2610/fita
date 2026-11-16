import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Biblioteca",
    intro:
      "Abra um livro ou cole um texto para o ler com destaque. Os seus ficheiros e o ponto onde parou ficam neste dispositivo.",
    open: "Abrir um ficheiro",
    paste: "Colar um texto",
    empty: "Ainda não há nada aqui. Os livros e textos que abrir aparecerão aqui.",
    progress: "{n} % lido",
    remove: "Remover «{title}» da biblioteca",
    removed: "«{title}» foi removido da biblioteca.",
    opening: "A abrir…",
    notSaved:
      "Não foi possível guardar este ficheiro no dispositivo. Pode lê-lo agora, mas não ficará na biblioteca.",
    missing: "Esse livro já não está neste dispositivo.",
  },
  paste: {
    heading: "Colar um texto",
    title: "Título (opcional)",
    text: "Texto",
    untitled: "Texto colado",
    read: "Ler",
    cancel: "Cancelar",
  },
  reader: {
    library: "Biblioteca",
    settings: "Definições",
    previous: "Anterior",
    next: "Seguinte",
    position: "{n} de {total}",
    empty: "Esta parte não tem texto.",
    emphasis: "Destaque",
    textSize: "Tamanho do texto",
    sizes: ["Normal", "Grande", "Muito grande", "Enorme"],
    theme: "Tema",
    themes: { system: "Como o dispositivo", light: "Claro", dark: "Escuro" },
    language: "Idioma",
    deviceLanguage: "Como o dispositivo",
  },
};
