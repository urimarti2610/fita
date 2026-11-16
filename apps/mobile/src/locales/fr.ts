import type { AppStrings } from "./en";

export const strings: AppStrings = {
  library: {
    heading: "Bibliothèque",
    intro:
      "Ouvrez un livre ou collez un texte pour le lire avec mise en évidence. Vos fichiers et l’endroit où vous vous êtes arrêté restent sur cet appareil.",
    open: "Ouvrir un fichier",
    paste: "Coller un texte",
    empty: "Il n’y a encore rien ici. Les livres et textes que vous ouvrez apparaîtront ici.",
    progress: "{n} % lu",
    remove: "Retirer « {title} » de la bibliothèque",
    removed: "« {title} » a été retiré de la bibliothèque.",
    opening: "Ouverture…",
    notSaved:
      "Ce fichier n’a pas pu être enregistré sur l’appareil. Vous pouvez le lire maintenant, mais il ne restera pas dans la bibliothèque.",
    missing: "Ce livre n’est plus sur cet appareil.",
  },
  paste: {
    heading: "Coller un texte",
    title: "Titre (facultatif)",
    text: "Texte",
    untitled: "Texte collé",
    read: "Lire",
    cancel: "Annuler",
  },
  reader: {
    library: "Bibliothèque",
    settings: "Réglages",
    previous: "Précédent",
    next: "Suivant",
    position: "{n} sur {total}",
    empty: "Cette partie ne contient pas de texte.",
    emphasis: "Mise en évidence",
    textSize: "Taille du texte",
    sizes: ["Normale", "Grande", "Très grande", "Énorme"],
    theme: "Thème",
    themes: { system: "Comme l’appareil", light: "Clair", dark: "Sombre" },
    language: "Langue",
    deviceLanguage: "Comme l’appareil",
  },
};
