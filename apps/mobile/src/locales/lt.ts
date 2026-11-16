import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Biblioteka",
    intro:
      "Atidarykite knygą arba įklijuokite tekstą ir skaitykite jį su paryškinimu. Jūsų failai ir vieta, kur sustojote, lieka šiame įrenginyje.",
    open: "Atidaryti failą",
    paste: "Įklijuoti tekstą",
    empty: "Čia dar nieko nėra. Čia atsiras jūsų atidarytos knygos ir tekstai.",
    progress: "Perskaityta {n} %",
    remove: "Pašalinti „{title}“ iš bibliotekos",
    removed: "„{title}“ pašalinta iš bibliotekos.",
    opening: "Atidaroma…",
    notSaved:
      "Nepavyko išsaugoti failo įrenginyje. Galite jį skaityti dabar, bet jis neliks bibliotekoje.",
    missing: "Šios knygos šiame įrenginyje nebėra.",
  },
  paste: {
    heading: "Įklijuoti tekstą",
    title: "Pavadinimas (nebūtinas)",
    text: "Tekstas",
    untitled: "Įklijuotas tekstas",
    read: "Skaityti",
    cancel: "Atšaukti",
  },
  reader: {
    library: "Biblioteka",
    settings: "Nustatymai",
    previous: "Ankstesnis",
    next: "Kitas",
    position: "{n} iš {total}",
    empty: "Šioje dalyje teksto nėra.",
    emphasis: "Paryškinimas",
    textSize: "Teksto dydis",
    sizes: ["Įprastas", "Didelis", "Labai didelis", "Milžiniškas"],
    theme: "Tema",
    themes: { system: "Kaip įrenginyje", light: "Šviesi", dark: "Tamsi" },
    language: "Kalba",
    deviceLanguage: "Kaip įrenginyje",
  },
};
