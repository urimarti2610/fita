import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Bibliothek",
    intro:
      "Öffne ein Buch oder füge einen Text ein, um ihn mit Hervorhebung zu lesen. Deine Dateien und die Stelle, an der du aufgehört hast, bleiben auf diesem Gerät.",
    open: "Datei öffnen",
    paste: "Text einfügen",
    empty: "Hier ist noch nichts. Bücher und Texte, die du öffnest, erscheinen hier.",
    progress: "{n} % gelesen",
    remove: "„{title}“ aus der Bibliothek entfernen",
    removed: "„{title}“ wurde aus der Bibliothek entfernt.",
    opening: "Wird geöffnet…",
    notSaved:
      "Diese Datei konnte nicht auf dem Gerät gespeichert werden. Du kannst sie jetzt lesen, aber sie bleibt nicht in der Bibliothek.",
    missing: "Dieses Buch ist nicht mehr auf diesem Gerät.",
  },
  paste: {
    heading: "Text einfügen",
    title: "Titel (optional)",
    text: "Text",
    untitled: "Eingefügter Text",
    read: "Lesen",
    cancel: "Abbrechen",
  },
  reader: {
    library: "Bibliothek",
    settings: "Einstellungen",
    previous: "Zurück",
    next: "Weiter",
    position: "{n} von {total}",
    empty: "Dieser Teil enthält keinen Text.",
    emphasis: "Hervorhebung",
    textSize: "Textgröße",
    sizes: ["Normal", "Groß", "Sehr groß", "Riesig"],
    theme: "Design",
    themes: { system: "Wie das Gerät", light: "Hell", dark: "Dunkel" },
    language: "Sprache",
    deviceLanguage: "Wie das Gerät",
  },
};
