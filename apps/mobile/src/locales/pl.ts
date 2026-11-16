import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Biblioteka",
    intro:
      "Otwórz książkę lub wklej tekst, aby czytać go z wyróżnieniem. Twoje pliki i miejsce, w którym skończyłeś, zostają na tym urządzeniu.",
    open: "Otwórz plik",
    paste: "Wklej tekst",
    empty: "Na razie nic tu nie ma. Tutaj pojawią się otwarte książki i teksty.",
    progress: "Przeczytano {n} %",
    remove: "Usuń „{title}” z biblioteki",
    removed: "Usunięto „{title}” z biblioteki.",
    opening: "Otwieranie…",
    notSaved:
      "Nie udało się zapisać pliku na urządzeniu. Możesz go przeczytać teraz, ale nie zostanie w bibliotece.",
    missing: "Tej książki nie ma już na tym urządzeniu.",
  },
  paste: {
    heading: "Wklej tekst",
    title: "Tytuł (opcjonalnie)",
    text: "Tekst",
    untitled: "Wklejony tekst",
    read: "Czytaj",
    cancel: "Anuluj",
  },
  reader: {
    library: "Biblioteka",
    settings: "Ustawienia",
    previous: "Poprzedni",
    next: "Następny",
    position: "{n} z {total}",
    empty: "Ta część nie zawiera tekstu.",
    emphasis: "Wyróżnienie",
    textSize: "Rozmiar tekstu",
    sizes: ["Normalny", "Duży", "Bardzo duży", "Ogromny"],
    theme: "Motyw",
    themes: { system: "Jak w urządzeniu", light: "Jasny", dark: "Ciemny" },
    language: "Język",
    deviceLanguage: "Jak w urządzeniu",
  },
};
