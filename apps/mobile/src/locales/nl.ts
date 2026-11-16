import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Bibliotheek",
    intro:
      "Open een boek of plak een tekst om die met nadruk te lezen. Je bestanden en de plek waar je gebleven was, blijven op dit apparaat.",
    open: "Bestand openen",
    paste: "Tekst plakken",
    empty: "Er staat hier nog niets. Boeken en teksten die je opent, verschijnen hier.",
    progress: "{n} % gelezen",
    remove: "‘{title}’ uit de bibliotheek verwijderen",
    removed: "‘{title}’ is uit de bibliotheek verwijderd.",
    opening: "Openen…",
    notSaved:
      "Dit bestand kon niet op het apparaat worden opgeslagen. Je kunt het nu lezen, maar het blijft niet in de bibliotheek.",
    missing: "Dat boek staat niet meer op dit apparaat.",
  },
  paste: {
    heading: "Tekst plakken",
    title: "Titel (optioneel)",
    text: "Tekst",
    untitled: "Geplakte tekst",
    read: "Lezen",
    cancel: "Annuleren",
  },
  reader: {
    library: "Bibliotheek",
    settings: "Instellingen",
    previous: "Vorige",
    next: "Volgende",
    position: "{n} van {total}",
    empty: "Dit deel bevat geen tekst.",
    emphasis: "Nadruk",
    textSize: "Tekstgrootte",
    sizes: ["Normaal", "Groot", "Heel groot", "Enorm"],
    theme: "Thema",
    themes: { system: "Zoals het apparaat", light: "Licht", dark: "Donker" },
    language: "Taal",
    deviceLanguage: "Zoals het apparaat",
  },
};
