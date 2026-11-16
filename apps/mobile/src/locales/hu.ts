import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Könyvtár",
    intro:
      "Nyiss meg egy könyvet, vagy illessz be egy szöveget, hogy kiemeléssel olvashasd. A fájljaid és az, hogy hol tartasz, ezen az eszközön maradnak.",
    open: "Fájl megnyitása",
    paste: "Szöveg beillesztése",
    empty: "Itt még nincs semmi. A megnyitott könyvek és szövegek itt jelennek meg.",
    progress: "{n} % elolvasva",
    remove: "„{title}” eltávolítása a könyvtárból",
    removed: "„{title}” eltávolítva a könyvtárból.",
    opening: "Megnyitás…",
    notSaved:
      "A fájlt nem sikerült menteni az eszközre. Most elolvashatod, de nem marad a könyvtárban.",
    missing: "Ez a könyv már nincs ezen az eszközön.",
  },
  paste: {
    heading: "Szöveg beillesztése",
    title: "Cím (nem kötelező)",
    text: "Szöveg",
    untitled: "Beillesztett szöveg",
    read: "Olvasás",
    cancel: "Mégse",
  },
  reader: {
    library: "Könyvtár",
    settings: "Beállítások",
    previous: "Előző",
    next: "Következő",
    position: "{n}/{total}",
    empty: "Ebben a részben nincs szöveg.",
    emphasis: "Kiemelés",
    textSize: "Szövegméret",
    sizes: ["Normál", "Nagy", "Nagyon nagy", "Óriási"],
    theme: "Téma",
    themes: { system: "Mint az eszközön", light: "Világos", dark: "Sötét" },
    language: "Nyelv",
    deviceLanguage: "Mint az eszközön",
  },
};
