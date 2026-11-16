import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Knjižnica",
    intro:
      "Odprite knjigo ali prilepite besedilo, da ga berete s poudarkom. Vaše datoteke in mesto, kjer ste ostali, ostanejo v tej napravi.",
    open: "Odpri datoteko",
    paste: "Prilepi besedilo",
    empty: "Tu še ni ničesar. Knjige in besedila, ki jih odprete, se bodo prikazala tukaj.",
    progress: "Prebrano {n} %",
    remove: "Odstrani »{title}« iz knjižnice",
    removed: "»{title}« je bilo odstranjeno iz knjižnice.",
    opening: "Odpiranje …",
    notSaved:
      "Datoteke ni bilo mogoče shraniti v napravo. Lahko jo preberete zdaj, vendar ne bo ostala v knjižnici.",
    missing: "Te knjige ni več v tej napravi.",
  },
  paste: {
    heading: "Prilepi besedilo",
    title: "Naslov (neobvezno)",
    text: "Besedilo",
    untitled: "Prilepljeno besedilo",
    read: "Beri",
    cancel: "Prekliči",
  },
  reader: {
    library: "Knjižnica",
    settings: "Nastavitve",
    previous: "Prejšnje",
    next: "Naslednje",
    position: "{n} od {total}",
    empty: "Ta del nima besedila.",
    emphasis: "Poudarek",
    textSize: "Velikost besedila",
    sizes: ["Običajna", "Velika", "Zelo velika", "Ogromna"],
    theme: "Tema",
    themes: { system: "Kot naprava", light: "Svetla", dark: "Temna" },
    language: "Jezik",
    deviceLanguage: "Kot naprava",
  },
};
