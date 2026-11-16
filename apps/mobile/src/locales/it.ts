import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Biblioteca",
    intro:
      "Apri un libro o incolla un testo per leggerlo con l’evidenziazione. I tuoi file e il punto in cui ti sei fermato restano su questo dispositivo.",
    open: "Apri un file",
    paste: "Incolla un testo",
    empty: "Qui non c’è ancora niente. I libri e i testi che apri compariranno qui.",
    progress: "{n} % letto",
    remove: "Rimuovi «{title}» dalla biblioteca",
    removed: "«{title}» è stato rimosso dalla biblioteca.",
    opening: "Apertura…",
    notSaved:
      "Non è stato possibile salvare il file sul dispositivo. Puoi leggerlo ora, ma non resterà nella biblioteca.",
    missing: "Questo libro non è più su questo dispositivo.",
  },
  paste: {
    heading: "Incolla un testo",
    title: "Titolo (facoltativo)",
    text: "Testo",
    untitled: "Testo incollato",
    read: "Leggi",
    cancel: "Annulla",
  },
  reader: {
    library: "Biblioteca",
    settings: "Impostazioni",
    previous: "Precedente",
    next: "Successivo",
    position: "{n} di {total}",
    empty: "Questa parte non contiene testo.",
    emphasis: "Evidenziazione",
    textSize: "Dimensione del testo",
    sizes: ["Normale", "Grande", "Molto grande", "Enorme"],
    theme: "Tema",
    themes: { system: "Come il dispositivo", light: "Chiaro", dark: "Scuro" },
    language: "Lingua",
    deviceLanguage: "Come il dispositivo",
  },
};
