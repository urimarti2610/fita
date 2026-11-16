import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Bibliotek",
    intro:
      "Öppna en bok eller klistra in en text för att läsa den med betoning. Dina filer och var du slutade läsa stannar på den här enheten.",
    open: "Öppna en fil",
    paste: "Klistra in en text",
    empty: "Här finns inget ännu. Böcker och texter du öppnar visas här.",
    progress: "{n} % läst",
    remove: "Ta bort ”{title}” från biblioteket",
    removed: "”{title}” togs bort från biblioteket.",
    opening: "Öppnar…",
    notSaved:
      "Filen kunde inte sparas på enheten. Du kan läsa den nu, men den stannar inte i biblioteket.",
    missing: "Den boken finns inte längre på enheten.",
  },
  paste: {
    heading: "Klistra in en text",
    title: "Titel (valfri)",
    text: "Text",
    untitled: "Inklistrad text",
    read: "Läs",
    cancel: "Avbryt",
  },
  reader: {
    library: "Bibliotek",
    settings: "Inställningar",
    previous: "Föregående",
    next: "Nästa",
    position: "{n} av {total}",
    empty: "Den här delen har ingen text.",
    emphasis: "Betoning",
    textSize: "Textstorlek",
    sizes: ["Normal", "Stor", "Mycket stor", "Jättestor"],
    theme: "Tema",
    themes: { system: "Som enheten", light: "Ljust", dark: "Mörkt" },
    language: "Språk",
    deviceLanguage: "Som enheten",
  },
};
