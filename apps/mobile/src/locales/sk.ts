import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Knižnica",
    intro:
      "Otvorte knihu alebo vložte text a čítajte ho so zvýraznením. Vaše súbory aj miesto, kde ste prestali čítať, zostávajú v tomto zariadení.",
    open: "Otvoriť súbor",
    paste: "Vložiť text",
    empty: "Zatiaľ tu nič nie je. Knihy a texty, ktoré otvoríte, sa zobrazia tu.",
    progress: "Prečítané {n} %",
    remove: "Odstrániť „{title}“ z knižnice",
    removed: "„{title}“ bolo odstránené z knižnice.",
    opening: "Otvára sa…",
    notSaved:
      "Súbor sa nepodarilo uložiť do zariadenia. Môžete ho čítať teraz, ale v knižnici nezostane.",
    missing: "Táto kniha už v zariadení nie je.",
  },
  paste: {
    heading: "Vložiť text",
    title: "Názov (nepovinný)",
    text: "Text",
    untitled: "Vložený text",
    read: "Čítať",
    cancel: "Zrušiť",
  },
  reader: {
    library: "Knižnica",
    settings: "Nastavenia",
    previous: "Predchádzajúca",
    next: "Ďalšia",
    position: "{n} z {total}",
    empty: "Táto časť neobsahuje text.",
    emphasis: "Zvýraznenie",
    textSize: "Veľkosť textu",
    sizes: ["Normálna", "Veľká", "Veľmi veľká", "Obrovská"],
    theme: "Motív",
    themes: { system: "Podľa zariadenia", light: "Svetlý", dark: "Tmavý" },
    language: "Jazyk",
    deviceLanguage: "Podľa zariadenia",
  },
};
