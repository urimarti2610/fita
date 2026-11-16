import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Bibliotek",
    intro:
      "Åbn en bog eller indsæt en tekst for at læse den med fremhævning. Dine filer og stedet, hvor du slap, bliver på denne enhed.",
    open: "Åbn en fil",
    paste: "Indsæt en tekst",
    empty: "Her er intet endnu. Bøger og tekster, du åbner, vises her.",
    progress: "{n} % læst",
    remove: "Fjern “{title}” fra biblioteket",
    removed: "“{title}” blev fjernet fra biblioteket.",
    opening: "Åbner…",
    notSaved:
      "Filen kunne ikke gemmes på enheden. Du kan læse den nu, men den bliver ikke i biblioteket.",
    missing: "Den bog findes ikke længere på enheden.",
  },
  paste: {
    heading: "Indsæt en tekst",
    title: "Titel (valgfri)",
    text: "Tekst",
    untitled: "Indsat tekst",
    read: "Læs",
    cancel: "Annuller",
  },
  reader: {
    library: "Bibliotek",
    settings: "Indstillinger",
    previous: "Forrige",
    next: "Næste",
    position: "{n} af {total}",
    empty: "Denne del har ingen tekst.",
    emphasis: "Fremhævning",
    textSize: "Tekststørrelse",
    sizes: ["Normal", "Stor", "Meget stor", "Kæmpe"],
    theme: "Tema",
    themes: { system: "Som enheden", light: "Lyst", dark: "Mørkt" },
    language: "Sprog",
    deviceLanguage: "Som enheden",
  },
};
