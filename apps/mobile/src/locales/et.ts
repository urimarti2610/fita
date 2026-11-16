import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Raamatukogu",
    intro:
      "Ava raamat või kleebi tekst, et seda rõhutusega lugeda. Sinu failid ja koht, kus pooleli jäid, jäävad sellesse seadmesse.",
    open: "Ava fail",
    paste: "Kleebi tekst",
    empty: "Siin pole veel midagi. Avatud raamatud ja tekstid ilmuvad siia.",
    progress: "{n} % loetud",
    remove: "Eemalda „{title}“ raamatukogust",
    removed: "„{title}“ eemaldati raamatukogust.",
    opening: "Avamine…",
    notSaved:
      "Faili ei õnnestunud seadmesse salvestada. Saad seda praegu lugeda, kuid see ei jää raamatukokku.",
    missing: "Seda raamatut pole enam selles seadmes.",
  },
  paste: {
    heading: "Kleebi tekst",
    title: "Pealkiri (valikuline)",
    text: "Tekst",
    untitled: "Kleebitud tekst",
    read: "Loe",
    cancel: "Tühista",
  },
  reader: {
    library: "Raamatukogu",
    settings: "Seaded",
    previous: "Eelmine",
    next: "Järgmine",
    position: "{n}/{total}",
    empty: "Selles osas pole teksti.",
    emphasis: "Rõhutus",
    textSize: "Teksti suurus",
    sizes: ["Tavaline", "Suur", "Väga suur", "Hiiglaslik"],
    theme: "Teema",
    themes: { system: "Nagu seadmes", light: "Hele", dark: "Tume" },
    language: "Keel",
    deviceLanguage: "Nagu seadmes",
  },
};
