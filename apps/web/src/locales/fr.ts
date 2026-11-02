import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Français";

export const slugs: Record<PageKey, string> = {
  uses: "pour-qui",
  worksheets: "fiches",
  convert: "convertir",
  privacy: "confidentialite",
  accessibility: "accessibilite",
};

export const strings: Strings = {
  meta: {
    description:
      "Aide à la lecture libre et gratuite pour les personnes avec un TDAH ou une dyslexie : met en évidence le début de chaque mot sur le web et dans vos livres numériques. Tout reste sur votre appareil.",
  },
  nav: {
    skip: "Aller au contenu",
    home: "Accueil",
    convert: "Convertir un livre",
    privacy: "Confidentialité",
    accessibility: "Accessibilité",
    github: "Code source",
    language: "Langue",
    theme: {
      label: "Thème",
      light: "clair",
      dark: "sombre",
    },
  },
  hero: {
    headline: "Lisez à votre façon",
    lede: "Met doucement en évidence le début de chaque mot pour donner un point d’appui à vos yeux. Pour les personnes avec un TDAH, une dyslexie, ou pour toute personne qui s’y sent plus à l’aise. Gratuit, sans compte, et rien ne quitte jamais votre appareil.",
  },
  install: {
    chrome: "Ajouter à Chrome ou Edge",
    firefox: "Ajouter à Firefox",
    preview:
      "Pas encore dans les boutiques. En attendant, vous pouvez installer la version préliminaire depuis GitHub.",
  },
  demo: {
    heading: "Essayez avec votre propre texte",
    intro:
      "Collez n’importe quel texte. Le résultat s’affiche aussitôt, et il n’y a aucune limite de longueur.",
    input: "Votre texte",
    output: "Ce que ça donne",
    sample:
      "Lire devrait être agréable. Certaines personnes perdent le fil, sautent des mots ou se fatiguent avant la fin d’un paragraphe. Marquer le début de chaque mot donne un point d’ancrage à vos yeux : essayez différentes intensités et différents styles jusqu’à trouver le vôtre.",
    strength: "Intensité",
    style: "Style",
    styles: {
      "bold-fade": "Gras et atténué",
      bold: "Gras",
      color: "Couleur",
      underline: "Soulignement",
      fade: "Atténuer le reste",
    },
    more: "Plus d’options",
    every: "Mettre en évidence",
    everyOptions: ["Tous les mots", "1 mot sur 2", "1 mot sur 3"],
    lineHeight: "Interligne",
    maxWidth: "Largeur de ligne maximale",
    pageDefault: "Normal",
    widths: ["Étroite (50 caractères)", "Moyenne (65 caractères)", "Large (80 caractères)"],
  },
  privacy: {
    heading: "Rien ne quitte votre appareil",
    body: [
      "L’extension, cette page et le convertisseur de livres fonctionnent entièrement dans votre navigateur. Il n’y a aucun serveur à qui envoyer quoi que ce soit.",
      "Pas de compte, pas de statistiques, pas de cookies et aucune limite d’utilisation.",
    ],
    more: "Lire la politique de confidentialité",
  },
  faq: {
    heading: "Questions",
    items: [
      {
        q: "Est-ce que ça marche vraiment ?",
        a: [
          "Cela dépend des personnes. Les études publiées jusqu’ici ne montrent pas qu’en moyenne on lise plus vite ou qu’on comprenne mieux avec ce type de mise en évidence.",
          "En revanche, beaucoup de personnes disent que la lecture leur semble plus confortable, qu’elles perdent moins le fil ou qu’il leur est plus facile de se lancer. Nous ne promettons donc pas la vitesse : nous proposons une aide que vous pouvez régler ou désactiver. Essayez la démo et gardez ce qui vous aide.",
        ],
      },
      {
        q: "Est-ce que c’est payant ?",
        a: [
          "Non, et ça ne le sera jamais. Pas de version payante, pas de limite de mots, pas de limite de taille de fichier. C’est un logiciel libre sous licence Apache-2.0.",
        ],
      },
      {
        q: "Puis-je l’utiliser avec mes livres numériques ?",
        a: [
          "Oui. Dans « Convertir un livre », choisissez un fichier EPUB, TXT, Markdown ou HTML et téléchargez une copie avec la mise en évidence. La conversion se fait dans votre navigateur. Les livres avec DRM ne peuvent pas être convertis.",
        ],
      },
      {
        q: "Est-ce que ça marche dans toutes les langues ?",
        a: [
          "Dans toutes les langues qui séparent les mots par des espaces, y compris celles qui s’écrivent de droite à gauche. Le chinois, le japonais, le thaï et les autres écritures sans espaces restent tels quels.",
        ],
      },
      {
        q: "Et si j’utilise un lecteur d’écran ?",
        a: ["Le texte est lu exactement comme avant : aucun caractère n’est ajouté ni supprimé."],
      },
      {
        q: "Est-ce que ça marche sur mon téléphone ?",
        a: ["Oui, avec Firefox pour Android. Une application dédiée viendra plus tard."],
      },
    ],
  },
  footer: {
    license: "Logiciel libre sous licence Apache-2.0.",
  },
  uses: {
    title: "Pour qui",
    intro:
      "Chacun et chacune lit à sa manière. Voici quelques façons d’utiliser l’outil selon qui vous êtes et ce dont vous avez besoin. Elles ont toutes un point commun : c’est une aide facultative, que vous pouvez régler ou désactiver, et qui ne collecte aucune donnée.",
    homeHeading: "Pour qui",
    how: "Comment l’utiliser",
    care: "À garder en tête",
    cases: [
      {
        id: "education",
        title: "Éducation",
        summary:
          "Pour le personnel enseignant, les écoles et les familles qui veulent adapter les lectures sans créer de nouveau matériel.",
        link: "Idées pour la classe et la maison",
        lede: "Pour le personnel enseignant, les équipes d’accompagnement et les familles qui veulent que la lecture demande un peu moins d’effort, sans préparer un matériel différent pour chaque élève.",
        steps: [
          "Adaptez le matériel que vous avez déjà : convertissez des lectures, des notes de cours ou des livres en EPUB, TXT, Markdown ou HTML et partagez-les tels quels.",
          "En classe, projetez la démo avec le texte du jour et essayez ensemble différentes intensités et différents styles. Laissez chaque élève dire ce qui lui convient le mieux.",
          "Sur les ordinateurs de l’école, l’extension fonctionne sans compte ni inscription et ne collecte aucune donnée sur les élèves.",
          "Créez des fiches de lecture en gros caractères avec un cadre sympathique dans « Fiches », puis imprimez-les ou enregistrez-les en PDF.",
          "À la maison, la même extension aide pour les devoirs et la lecture sur le web.",
        ],
        notes: [
          "C’est une aide facultative : elle aide certains élèves et pas d’autres. Laissez chacun et chacune choisir, et la désactiver si besoin.",
          "Elle ne remplace ni l’accompagnement pédagogique ni le diagnostic des troubles des apprentissages.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Orthophonistes et autres professionnels",
        summary:
          "Pour les orthophonistes, psychologues scolaires et conseillers qui cherchent un outil simple à essayer en séance.",
        link: "Comment l’utiliser en séance",
        lede: "Pour les orthophonistes, psychologues scolaires, conseillers et autres professionnels qui accompagnent des personnes ayant des difficultés de lecture.",
        steps: [
          "En séance, collez un texte dans la démo et essayez plusieurs réglages avec la personne. Notez celui qui lui semble le plus confortable : intensité, style, mots mis en évidence, interligne.",
          "Préparez du matériel de travail avec le convertisseur et remettez-le sur papier, à l’écran ou sur une liseuse.",
          "Recommandez l’extension pour la maison, avec les réglages choisis ensemble.",
          "Tout fonctionne sur l’appareil : aucun texte ni aucune donnée de patient ne passe par un serveur.",
        ],
        notes: [
          "Ce n’est ni un traitement ni une méthode de rééducation de la lecture. Cela peut être un soutien parmi d’autres dans votre travail.",
          "Les études ne montrent pas de gain moyen en vitesse ni en compréhension. Présentez-le comme une question de confort et de préférence, et évaluez-le au cas par cas.",
        ],
      },
      {
        id: "adults",
        title: "Adultes",
        summary:
          "Pour les personnes qui veulent se remettre à lire mais n’arrivent pas à se concentrer, perdent le fil ou se fatiguent vite.",
        link: "Comment commencer",
        lede: "Si vous voulez lire davantage mais avez du mal à vous lancer, perdez le fil, relisez trois fois la même phrase ou êtes fatigué·e dès la deuxième page, cela peut vous aider. Et sinon, ce n’est pas grave.",
        steps: [
          "Installez l’extension et activez-la avec Alt+B sur un article qui vous intéresse. Commencez par des textes courts.",
          "Convertissez un livre que vous avez vraiment envie de lire et mettez-le sur votre liseuse ou votre téléphone.",
          "Réglez l’intensité jusqu’à ce que ce soit confortable. Dans « Plus d’options », vous pouvez augmenter l’interligne et réduire la largeur des lignes : pour beaucoup de personnes, cela aide autant que la mise en évidence.",
          "Si un jour cela vous fatigue, désactivez-la. C’est votre façon de lire, pas une règle.",
        ],
        notes: [
          "Ça ne marche pas pour tout le monde, et ce n’est pas grave. Donnez-vous quelques jours avant de décider.",
          "Si vous pensez qu’un TDAH ou une dyslexie pourrait expliquer vos difficultés, en parler à un professionnel peut vous aider.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Fiches de lecture",
    nav: "Fiches",
    intro:
      "Créez des fiches en gros caractères, avec le début de chaque mot mis en évidence et un cadre sympathique. Choisissez un texte d’exemple ou écrivez le vôtre, puis imprimez-le ou téléchargez-le.",
    editor: "Personnaliser la fiche",
    example: "Choisir un texte",
    titleLabel: "Titre",
    textLabel: "Texte",
    theme: "Cadre",
    themes: {
      none: "Sans cadre",
      simple: "Simple",
      clouds: "Nuages",
      garden: "Jardin",
      stars: "Étoiles",
      vehicles: "Voitures et camions",
    },
    size: "Taille du texte",
    sizes: ["Grande", "Très grande", "Énorme"],
    nameDate: "Ajouter le nom et la date",
    name: "Nom",
    date: "Date",
    lines: "Lignes pour écrire",
    linesOptions: ["Aucune", "3 lignes", "6 lignes", "10 lignes"],
    preview: "Aperçu",
    showPageSize: "Afficher la taille de la page",
    pageSizes: { portrait: "A4 portrait (210 × 297 mm)", landscape: "A4 paysage (297 × 210 mm)" },
    pageN: "Page {n}",
    editHint:
      "Vous pouvez écrire directement sur la fiche : cliquez sur le titre ou sur le texte. La mise en évidence s’applique quand vous avez fini.",
    editTitle: "Titre de la fiche",
    editText: "Texte de la fiche",
    print: "Imprimer ou enregistrer en PDF",
    download: "Télécharger la fiche",
    printHint:
      "Pour l’enregistrer en PDF, choisissez « Enregistrer au format PDF » dans la fenêtre d’impression. Elle s’imprime sur fond blanc pour économiser l’encre.",
    downloadHint:
      "Le téléchargement est une page web que vous pouvez ouvrir et imprimer quand vous voulez, même hors ligne.",
    fileName: "fiche",
    tabs: { text: "Texte", layout: "Mise en page", emphasis: "Mise en évidence" },
    myTexts: "Mes textes",
    save: "Enregistrer dans mes textes",
    saved: "« {title} » est enregistré dans mes textes.",
    remove: "Retirer de mes textes",
    removed: "« {title} » a été retiré de mes textes.",
    exportTexts: "Exporter mes textes",
    importTexts: "Importer des textes",
    imported: "Textes importés : {n}.",
    importEmpty:
      "Ce fichier ne contient aucun texte. Utilisez un fichier .md avec des titres « ## », ou un fichier .txt.",
    libraryNote:
      "Vos textes sont enregistrés uniquement dans ce navigateur. Exportez-les pour en garder une copie, les partager ou les transférer sur un autre ordinateur.",
    exportHeading: "Mes textes pour les fiches",
    levelKey: "Niveau",
    textsFileName: "mes-textes-fiches",
    orientation: "Orientation",
    orientations: { portrait: "Portrait", landscape: "Paysage" },
    overflow:
      "La fiche déborde sur une deuxième page. Pour qu’elle tienne sur une seule, raccourcissez le texte, choisissez une taille de texte plus petite ou retirez des lignes.",
  },
  settings: {
    title: "Réglages de lecture",
    open: "Ouvrir les réglages de lecture",
    close: "Fermer",
    note: "Ils s’appliquent à la démo, aux fiches et au convertisseur, et sont enregistrés uniquement dans ce navigateur.",
    presets: "Mes réglages enregistrés",
    empty:
      "Vous n’avez encore enregistré aucun réglage. Donnez un nom aux réglages actuels pour les retrouver en un clic.",
    name: "Nom",
    placeholder: "Par exemple : Lecture en classe",
    save: "Enregistrer",
    apply: "Utiliser les réglages « {name} »",
    remove: "Supprimer « {name} »",
    saved: "Réglages « {name} » enregistrés.",
    removed: "« {name} » a été supprimé.",
    applied: "Réglages actuels : « {name} ».",
    reset: "Revenir aux réglages par défaut",
    restored: "Réglages par défaut rétablis.",
  },
  convert: {
    title: "Convertir un livre",
    intro:
      "Choisissez un livre ou un document et téléchargez une copie avec la mise en évidence. Le fichier ne quitte jamais votre appareil : tout se passe dans ce navigateur, sans limite de taille.",
    pick: "Choisir un fichier",
    drop: "ou déposez-le ici",
    formats: "EPUB, TXT, Markdown ou HTML",
    selected: "Fichier choisi :",
    output: "Format de sortie",
    outputs: { epub: "EPUB (livre numérique)", html: "HTML (page web)", md: "Markdown" },
    options: "Comment mettre en évidence",
    start: "Convertir",
    progress: "Conversion : {n} %",
    cancel: "Annuler",
    cancelled: "Conversion annulée. Rien n’a été enregistré.",
    done: "C’est fait. Votre fichier est prêt.",
    download: "Télécharger {name}",
    errors: {
      unsupported:
        "Ce format ne peut pas être converti. Choisissez un fichier EPUB, TXT, Markdown ou HTML.",
      drm: "Ce livre est protégé par un DRM (protection contre la copie) : il ne peut donc pas être converti. Si vous l’avez acheté, demandez à la boutique si elle peut vous fournir une copie sans DRM.",
      invalid:
        "Ce fichier n’a pas pu être lu. Vérifiez qu’il s’ouvre dans votre liseuse, ou essayez-en un autre.",
      failed:
        "La conversion a échoué ({detail}). Si cela se reproduit, merci de nous le signaler sur GitHub.",
    },
    labels: { part: "Partie", contents: "Sommaire" },
    steps: {
      choose: "Choisissez votre livre",
      adjust: "Réglez l’apparence",
      convert: "Convertissez et téléchargez",
    },
    previewTitle: "Le début de votre livre",
    previewEmpty:
      "Choisissez un fichier et sa première page s’affichera ici, avec la mise en évidence.",
    previewLoading: "Préparation de l’aperçu…",
    previewNote:
      "Aperçu approximatif : chaque liseuse affiche le livre avec sa propre police et sa propre taille.",
    previewNone:
      "Aucun texte n’a été trouvé au début du fichier, mais vous pouvez quand même le convertir.",
    change: "Choisir un autre fichier",
    devices: {
      heading: "Le transférer sur votre liseuse",
      items: [
        {
          name: "Kindle",
          text: "Utilisez Send to Kindle d’Amazon (site web, application ou e-mail) et choisissez le fichier EPUB. Amazon l’adapte pour votre Kindle.",
        },
        {
          name: "Kobo",
          text: "Branchez votre Kobo à l’ordinateur avec le câble USB et copiez-y l’EPUB. Éjectez-la et le livre apparaît dans votre bibliothèque.",
        },
        {
          name: "PocketBook",
          text: "Copiez-le par USB, comme avec une Kobo, ou envoyez-le par e-mail avec le service Send-to-PocketBook.",
        },
      ],
      calibre:
        "Si vous utilisez Calibre, ajoutez le fichier à votre bibliothèque et envoyez-le à votre liseuse comme n’importe quel autre livre.",
    },
  },
  pages: {
    privacy: {
      title: "Confidentialité",
      body: [
        "Nous ne collectons aucune donnée. Aucune.",
        "L’extension, ce site et le convertisseur fonctionnent entièrement sur votre appareil. Ce que vous lisez et les fichiers que vous convertissez ne sont jamais envoyés nulle part : nous n’avons pas de serveurs.",
        "Nous n’utilisons ni statistiques, ni cookies, ni télémétrie, ni polices ou scripts provenant d’autres sites.",
        "L’extension enregistre vos réglages (intensité, style, sites où vous la voulez toujours active) dans le stockage de votre propre navigateur. Si la synchronisation du navigateur est activée, votre navigateur peut les copier d’un appareil à l’autre ; nous ne les voyons jamais.",
        "L’extension ne demande que les autorisations dont elle a besoin. L’accès à un site précis, ou à tous les sites, n’est demandé que lorsque vous choisissez « Toujours sur ce site » ou « Sur tous les sites », et vous pouvez le retirer à tout moment.",
      ],
    },
    accessibility: {
      title: "Accessibilité",
      body: [
        "La mise en évidence ne change jamais ce que lit un lecteur d’écran : le texte est exactement le même, caractère par caractère. Nous le vérifions avec des tests automatisés, et avec NVDA et VoiceOver avant chaque version.",
        "Tout fonctionne uniquement au clavier. L’extension s’active et se désactive avec Alt+B, et vous pouvez changer le raccourci dans les réglages de votre navigateur.",
        "Les couleurs de mise en évidence sont dérivées de la couleur du texte lui-même : le contraste est donc préservé en mode clair, en mode sombre et avec le thème de chaque site.",
        "Ce site utilise la police Atkinson Hyperlegible, conçue pour bien distinguer les lettres, et respecte les préférences de votre système pour le mode sombre et la réduction des animations.",
        "Si vous rencontrez un obstacle, ouvrez un ticket sur GitHub : c’est un bug, et nous le traiterons comme tel.",
      ],
    },
  },
};
