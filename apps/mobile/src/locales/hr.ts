import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Knjižnica",
    intro:
      "Otvorite knjigu ili zalijepite tekst da biste ga čitali s naglaskom. Vaše datoteke i mjesto na kojem ste stali ostaju na ovom uređaju.",
    open: "Otvori datoteku",
    paste: "Zalijepi tekst",
    empty: "Ovdje još nema ničega. Knjige i tekstovi koje otvorite pojavit će se ovdje.",
    progress: "Pročitano {n} %",
    remove: "Ukloni „{title}” iz knjižnice",
    removed: "„{title}” uklonjeno je iz knjižnice.",
    opening: "Otvaranje…",
    notSaved:
      "Datoteku nije bilo moguće spremiti na uređaj. Možete je čitati sada, ali neće ostati u knjižnici.",
    missing: "Ta knjiga više nije na ovom uređaju.",
  },
  paste: {
    heading: "Zalijepi tekst",
    title: "Naslov (neobavezno)",
    text: "Tekst",
    untitled: "Zalijepljeni tekst",
    read: "Čitaj",
    cancel: "Odustani",
  },
  reader: {
    library: "Knjižnica",
    settings: "Postavke",
    previous: "Prethodno",
    next: "Sljedeće",
    position: "{n} od {total}",
    empty: "Ovaj dio nema teksta.",
    emphasis: "Naglasak",
    textSize: "Veličina teksta",
    sizes: ["Normalna", "Velika", "Vrlo velika", "Ogromna"],
    theme: "Tema",
    themes: { system: "Kao uređaj", light: "Svijetla", dark: "Tamna" },
    language: "Jezik",
    deviceLanguage: "Kao uređaj",
  },
};
