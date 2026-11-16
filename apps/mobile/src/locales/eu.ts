import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Liburutegia",
    intro:
      "Ireki liburu bat edo itsatsi testu bat enfasiarekin irakurtzeko. Zure fitxategiak eta irakurtzeari utzi zenion lekua gailu honetan geratzen dira.",
    open: "Ireki fitxategi bat",
    paste: "Itsatsi testu bat",
    empty: "Oraindik ez dago ezer. Irekitzen dituzun liburuak eta testuak hemen agertuko dira.",
    progress: "% {n} irakurrita",
    remove: "Kendu «{title}» liburutegitik",
    removed: "«{title}» liburutegitik kendu da.",
    opening: "Irekitzen…",
    notSaved:
      "Ezin izan da fitxategia gailuan gorde. Orain irakur dezakezu, baina ez da liburutegian geratuko.",
    missing: "Liburu hori jada ez dago gailu honetan.",
  },
  paste: {
    heading: "Itsatsi testu bat",
    title: "Izenburua (aukerakoa)",
    text: "Testua",
    untitled: "Itsatsitako testua",
    read: "Irakurri",
    cancel: "Utzi",
  },
  reader: {
    library: "Liburutegia",
    settings: "Ezarpenak",
    previous: "Aurrekoa",
    next: "Hurrengoa",
    position: "{n}/{total}",
    empty: "Atal honek ez du testurik.",
    emphasis: "Enfasia",
    textSize: "Testuaren tamaina",
    sizes: ["Normala", "Handia", "Oso handia", "Erraldoia"],
    theme: "Gaia",
    themes: { system: "Gailuaren berdina", light: "Argia", dark: "Iluna" },
    language: "Hizkuntza",
    deviceLanguage: "Gailuaren berdina",
  },
};
