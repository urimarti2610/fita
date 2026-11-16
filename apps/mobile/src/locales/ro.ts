import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Bibliotecă",
    intro:
      "Deschide o carte sau lipește un text ca să-l citești cu evidențiere. Fișierele tale și locul unde ai rămas rămân pe acest dispozitiv.",
    open: "Deschide un fișier",
    paste: "Lipește un text",
    empty: "Aici nu este încă nimic. Cărțile și textele pe care le deschizi vor apărea aici.",
    progress: "{n} % citit",
    remove: "Elimină „{title}” din bibliotecă",
    removed: "„{title}” a fost eliminat din bibliotecă.",
    opening: "Se deschide…",
    notSaved:
      "Fișierul nu a putut fi salvat pe dispozitiv. Îl poți citi acum, dar nu va rămâne în bibliotecă.",
    missing: "Cartea aceasta nu mai este pe acest dispozitiv.",
  },
  paste: {
    heading: "Lipește un text",
    title: "Titlu (opțional)",
    text: "Text",
    untitled: "Text lipit",
    read: "Citește",
    cancel: "Anulează",
  },
  reader: {
    library: "Bibliotecă",
    settings: "Setări",
    previous: "Anterior",
    next: "Următor",
    position: "{n} din {total}",
    empty: "Această parte nu are text.",
    emphasis: "Evidențiere",
    textSize: "Dimensiunea textului",
    sizes: ["Normală", "Mare", "Foarte mare", "Uriașă"],
    theme: "Temă",
    themes: { system: "Ca dispozitivul", light: "Luminoasă", dark: "Întunecată" },
    language: "Limbă",
    deviceLanguage: "Ca dispozitivul",
  },
};
