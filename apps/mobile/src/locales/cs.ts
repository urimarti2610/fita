import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Knihovna",
    intro:
      "Otevřete knihu nebo vložte text a čtěte ho se zvýrazněním. Vaše soubory i místo, kde jste přestali číst, zůstávají v tomto zařízení.",
    open: "Otevřít soubor",
    paste: "Vložit text",
    empty: "Zatím tu nic není. Knihy a texty, které otevřete, se objeví zde.",
    progress: "Přečteno {n} %",
    remove: "Odebrat „{title}“ z knihovny",
    removed: "„{title}“ bylo odebráno z knihovny.",
    opening: "Otevírání…",
    notSaved:
      "Soubor se nepodařilo uložit do zařízení. Můžete ho číst hned, ale v knihovně nezůstane.",
    missing: "Tato kniha už v zařízení není.",
  },
  paste: {
    heading: "Vložit text",
    title: "Název (nepovinný)",
    text: "Text",
    untitled: "Vložený text",
    read: "Číst",
    cancel: "Zrušit",
  },
  reader: {
    library: "Knihovna",
    settings: "Nastavení",
    previous: "Předchozí",
    next: "Další",
    position: "{n} z {total}",
    empty: "Tato část nemá žádný text.",
    emphasis: "Zvýraznění",
    textSize: "Velikost textu",
    sizes: ["Normální", "Velký", "Velmi velký", "Obrovský"],
    theme: "Motiv",
    themes: { system: "Podle zařízení", light: "Světlý", dark: "Tmavý" },
    language: "Jazyk",
    deviceLanguage: "Podle zařízení",
  },
};
