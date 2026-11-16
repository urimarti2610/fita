import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Bibliotēka",
    intro:
      "Atveriet grāmatu vai ielīmējiet tekstu, lai to lasītu ar izcēlumu. Jūsu faili un vieta, kur apstājāties, paliek šajā ierīcē.",
    open: "Atvērt failu",
    paste: "Ielīmēt tekstu",
    empty: "Šeit vēl nekā nav. Šeit parādīsies atvērtās grāmatas un teksti.",
    progress: "Izlasīti {n} %",
    remove: "Noņemt “{title}” no bibliotēkas",
    removed: "“{title}” tika noņemts no bibliotēkas.",
    opening: "Atver…",
    notSaved: "Failu neizdevās saglabāt ierīcē. Varat to lasīt tagad, bet tas nepaliks bibliotēkā.",
    missing: "Šīs grāmatas šajā ierīcē vairs nav.",
  },
  paste: {
    heading: "Ielīmēt tekstu",
    title: "Nosaukums (nav obligāts)",
    text: "Teksts",
    untitled: "Ielīmēts teksts",
    read: "Lasīt",
    cancel: "Atcelt",
  },
  reader: {
    library: "Bibliotēka",
    settings: "Iestatījumi",
    previous: "Iepriekšējā",
    next: "Nākamā",
    position: "{n} no {total}",
    empty: "Šajā daļā nav teksta.",
    emphasis: "Izcēlums",
    textSize: "Teksta lielums",
    sizes: ["Parasts", "Liels", "Ļoti liels", "Milzīgs"],
    theme: "Motīvs",
    themes: { system: "Kā ierīcē", light: "Gaišs", dark: "Tumšs" },
    language: "Valoda",
    deviceLanguage: "Kā ierīcē",
  },
};
