import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Kirjasto",
    intro:
      "Avaa kirja tai liitä teksti lukeaksesi sen korostettuna. Tiedostosi ja kohta, johon jäit, pysyvät tässä laitteessa.",
    open: "Avaa tiedosto",
    paste: "Liitä teksti",
    empty: "Täällä ei ole vielä mitään. Avaamasi kirjat ja tekstit näkyvät tässä.",
    progress: "{n} % luettu",
    remove: "Poista ”{title}” kirjastosta",
    removed: "”{title}” poistettiin kirjastosta.",
    opening: "Avataan…",
    notSaved:
      "Tiedostoa ei voitu tallentaa laitteeseen. Voit lukea sen nyt, mutta se ei jää kirjastoon.",
    missing: "Kirja ei ole enää tässä laitteessa.",
  },
  paste: {
    heading: "Liitä teksti",
    title: "Otsikko (valinnainen)",
    text: "Teksti",
    untitled: "Liitetty teksti",
    read: "Lue",
    cancel: "Peruuta",
  },
  reader: {
    library: "Kirjasto",
    settings: "Asetukset",
    previous: "Edellinen",
    next: "Seuraava",
    position: "{n}/{total}",
    empty: "Tässä osassa ei ole tekstiä.",
    emphasis: "Korostus",
    textSize: "Tekstin koko",
    sizes: ["Normaali", "Suuri", "Hyvin suuri", "Valtava"],
    theme: "Teema",
    themes: { system: "Kuten laitteessa", light: "Vaalea", dark: "Tumma" },
    language: "Kieli",
    deviceLanguage: "Kuten laitteessa",
  },
};
