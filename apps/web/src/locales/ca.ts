import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Català";

export const slugs: Record<PageKey, string> = {
  uses: "per-a-qui",
  worksheets: "fitxes",
  convert: "convertir",
  privacy: "privacitat",
  accessibility: "accessibilitat",
};

export const strings: Strings = {
  meta: {
    description:
      "Ajuda de lectura lliure i gratuïta per a persones amb TDAH i dislèxia: destaca l'inici de cada paraula al web i als teus llibres electrònics. Tot al teu dispositiu.",
  },
  nav: {
    skip: "Salta al contingut",
    home: "Inici",
    convert: "Convertir un llibre",
    privacy: "Privacitat",
    accessibility: "Accessibilitat",
    github: "Codi font",
    language: "Idioma",
    theme: { label: "Tema", light: "clar", dark: "fosc" },
  },
  hero: {
    headline: "Llegeix a la teva manera",
    lede: "Destaca suaument l'inici de cada paraula perquè la vista trobi on recolzar-se. Per a persones amb TDAH, dislèxia o qualsevol que ho trobi més còmode. Gratis, sense comptes i sense que res surti del teu dispositiu.",
  },
  install: {
    chrome: "Afegir a Chrome o Edge",
    firefox: "Afegir a Firefox",
    preview:
      "Encara no és a les botigues. Mentrestant pots instal·lar la versió de prova des de GitHub.",
  },
  demo: {
    heading: "Prova-ho amb el teu text",
    intro: "Enganxa qualsevol text. El resultat canvia a l'instant, i no hi ha límit de llargada.",
    input: "El teu text",
    output: "Així es llegeix",
    sample:
      "Llegir hauria de ser còmode. Algunes persones perden la línia, se salten paraules o es cansen abans d'acabar el paràgraf. Marcar el principi de cada paraula dona a la vista un punt de suport: prova diferents intensitats i estils fins a trobar el teu.",
    strength: "Intensitat",
    style: "Estil",
    styles: {
      "bold-fade": "Negreta i atenuar",
      bold: "Negreta",
      color: "Color",
      underline: "Subratllat",
      fade: "Atenuar la resta",
    },
    more: "Més opcions",
    every: "Destacar",
    everyOptions: ["Totes les paraules", "1 de cada 2 paraules", "1 de cada 3 paraules"],
    lineHeight: "Interlineat",
    maxWidth: "Amplada màxima de línia",
    pageDefault: "Normal",
    widths: ["Estreta (50 caràcters)", "Mitjana (65 caràcters)", "Ampla (80 caràcters)"],
  },
  privacy: {
    heading: "Res no surt del teu dispositiu",
    body: [
      "L'extensió, aquesta pàgina i el convertidor de llibres funcionen sencers al teu navegador. No hi ha cap servidor on enviar res.",
      "Sense comptes, sense analítica, sense galetes i sense límits d'ús.",
    ],
    more: "Llegeix la política de privacitat",
  },
  faq: {
    heading: "Preguntes freqüents",
    items: [
      {
        q: "Funciona de veritat?",
        a: [
          "Depèn de la persona. Els estudis publicats fins ara no mostren que, de mitjana, es llegeixi més ràpid ni que s'entengui millor amb aquest tipus d'èmfasi.",
          "El que sí que expliquen moltes persones és que els resulta més còmode, que perden menys la línia o que els costa menys començar a llegir. Per això no prometem velocitat: oferim una ajuda que pots ajustar o apagar. Prova la demo i queda't amb el que et serveixi.",
        ],
      },
      {
        q: "Costa alguna cosa?",
        a: [
          "No, i no ho farà. No hi ha versió de pagament, ni límit de paraules, ni de mida de fitxer. És programari lliure amb llicència Apache-2.0.",
        ],
      },
      {
        q: "El puc fer servir amb els meus llibres electrònics?",
        a: [
          "Sí. A «Convertir un llibre» tries un EPUB, TXT, Markdown o HTML i en descarregues una còpia amb l'èmfasi. La conversió es fa al teu navegador. Els llibres amb DRM no es poden convertir.",
        ],
      },
      {
        q: "Funciona en qualsevol idioma?",
        a: [
          "En tots els idiomes que separen les paraules amb espais, inclosos els que s'escriuen de dreta a esquerra. El xinès, el japonès, el tailandès i altres escriptures sense espais es deixen tal com són.",
        ],
      },
      {
        q: "I si faig servir un lector de pantalla?",
        a: [
          "El text es llegeix exactament igual que abans: no s'hi afegeix ni s'hi treu cap caràcter.",
        ],
      },
      {
        q: "Funciona al mòbil?",
        a: ["Sí, amb Firefox per a Android. Una aplicació pròpia arribarà més endavant."],
      },
    ],
  },
  footer: {
    license: "Programari lliure amb llicència Apache-2.0.",
  },
  uses: {
    title: "Per a qui és",
    intro:
      "Cada persona llegeix a la seva manera. Aquestes són algunes maneres de fer servir l'eina segons qui ets i per a què la necessites. Totes tenen una cosa en comú: és una ajuda opcional, que s'ajusta o s'apaga, i que no recull cap dada.",
    homeHeading: "Per a qui és",
    how: "Com fer-ho servir",
    care: "A tenir en compte",
    cases: [
      {
        id: "educacio",
        title: "Educació",
        summary:
          "Per a docents, centres i famílies que volen adaptar les lectures sense crear materials nous.",
        link: "Idees per a l'aula i per a casa",
        lede: "Per a docents, equips d'orientació i famílies que volen que llegir costi una mica menys, sense preparar materials diferents per a cada alumne.",
        steps: [
          "Adapta els materials que ja tens: converteix lectures, apunts o llibres en EPUB, TXT, Markdown o HTML i comparteix-los tal com són.",
          "A classe, projecta la demo amb el text del dia i proveu junts diferents intensitats i estils. Que cada alumne digui què li resulta més còmode.",
          "Als ordinadors del centre, l'extensió funciona sense comptes ni registres i no recull dades de l'alumnat.",
          "Crea fitxes de lectura amb lletra grossa i un marc amable a «Fitxes», i imprimeix-les o desa-les en PDF.",
          "A casa, la mateixa extensió serveix per als deures i les lectures al web.",
        ],
        notes: [
          "És una ajuda opcional: a uns alumnes els serveix i a d'altres no. Deixa que cadascú triï i que la pugui apagar.",
          "No substitueix la intervenció educativa ni el diagnòstic de dificultats d'aprenentatge.",
        ],
      },
      {
        id: "logopedia",
        title: "Logopèdia i altres professionals",
        summary:
          "Per a logopedes, psicopedagogs i orientadors que busquen una eina senzilla per provar en sessió.",
        link: "Com fer-ho servir a la consulta",
        lede: "Per a logopedes, psicopedagogs, orientadors i altres professionals que acompanyen persones amb dificultats de lectura.",
        steps: [
          "En sessió, enganxa un text a la demo i prova diverses configuracions amb la persona. Anota quina li resulta més còmoda: intensitat, estil, paraules destacades, interlineat.",
          "Prepara els materials de treball amb el convertidor i lliura'ls en paper, en pantalla o al lector de llibres electrònics.",
          "Recomana l'extensió per a casa amb la configuració que hàgiu triat junts.",
          "Tot funciona al dispositiu: cap text ni cap dada de pacients passa per un servidor.",
        ],
        notes: [
          "No és un tractament ni un mètode de reeducació lectora. Pot ser un suport dins de la teva intervenció.",
          "Els estudis no mostren que, de mitjana, millori la velocitat ni la comprensió. Planteja-ho com una qüestió de comoditat i preferència, i valora-ho cas per cas.",
        ],
      },
      {
        id: "persones-adultes",
        title: "Persones adultes",
        summary:
          "Per a qui vol tornar a llegir i es troba que no es concentra, perd la línia o es cansa de seguida.",
        link: "Com començar",
        lede: "Si vols llegir més però et costa començar, perds la línia, llegeixes la mateixa frase tres vegades o et canses a la segona pàgina, potser això t'ajuda. I si no, no passa res.",
        steps: [
          "Instal·la l'extensió i activa-la amb Alt+B en un article que t'interessi. Comença per textos curts.",
          "Converteix un llibre que tinguis ganes de llegir i passa'l al teu lector o al mòbil.",
          "Ajusta la intensitat fins que et resulti còmode. A «Més opcions» pots augmentar l'interlineat i estrènyer les línies: a molta gent l'ajuda tant com l'èmfasi.",
          "Si un dia et cansa, apaga-ho. És la teva manera de llegir, no una norma.",
        ],
        notes: [
          "No a tothom li funciona, i està bé. Prova-ho uns quants dies abans de decidir.",
          "Si creus que hi pot haver TDAH o dislèxia darrere de les teves dificultats, parlar-ne amb un professional et pot ajudar.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Fitxes de lectura",
    nav: "Fitxes",
    intro:
      "Prepara fitxes amb lletra grossa, l'inici de cada paraula destacat i un marc amable. Tria un text d'exemple o escriu el teu, i després imprimeix-la o descarrega-la.",
    editor: "Personalitza la fitxa",
    example: "Triar text",
    titleLabel: "Títol",
    textLabel: "Text",
    theme: "Marc",
    themes: {
      none: "Sense marc",
      simple: "Senzill",
      clouds: "Núvols",
      garden: "Jardí",
      stars: "Estrelles",
      vehicles: "Cotxes i camions",
    },
    size: "Mida de la lletra",
    sizes: ["Grossa", "Molt grossa", "Enorme"],
    nameDate: "Afegir nom i data",
    name: "Nom",
    date: "Data",
    lines: "Línies per escriure",
    linesOptions: ["Cap", "3 línies", "6 línies", "10 línies"],
    preview: "Previsualització",
    showPageSize: "Mostrar la mida de la pàgina",
    pageSizes: {
      portrait: "A4 vertical (210 × 297 mm)",
      landscape: "A4 horitzontal (297 × 210 mm)",
    },
    pageN: "Pàgina {n}",
    editHint:
      "Pots escriure directament a la fitxa: fes clic al títol o al text. L'èmfasi s'aplica en acabar.",
    editTitle: "Títol de la fitxa",
    editText: "Text de la fitxa",
    print: "Imprimir o desar en PDF",
    download: "Descarregar la fitxa",
    printHint:
      "Per desar-la en PDF, tria «Desa com a PDF» al diàleg d'impressió. S'imprimeix sobre fons blanc, per gastar menys tinta.",
    downloadHint:
      "La descàrrega és una pàgina web que pots obrir i imprimir quan vulguis, també sense connexió.",
    fileName: "fitxa",
    tabs: { text: "Text", layout: "Disseny", emphasis: "Èmfasi" },
    myTexts: "Els meus textos",
    save: "Desar als meus textos",
    saved: "«{title}» està desat als meus textos.",
    remove: "Treure dels meus textos",
    removed: "«{title}» s'ha tret dels meus textos.",
    exportTexts: "Exportar els meus textos",
    importTexts: "Importar textos",
    imported: "Textos importats: {n}.",
    importEmpty:
      "No hi ha cap text en aquest fitxer. Fes servir un .md amb títols «## » o un .txt.",
    libraryNote:
      "Els teus textos es desen només en aquest navegador. Exporta'ls per tenir-ne una còpia, compartir-los o passar-los a un altre ordinador.",
    exportHeading: "Els meus textos per a fitxes",
    levelKey: "Nivell",
    textsFileName: "els-meus-textos-fitxes",
    orientation: "Orientació",
    orientations: { portrait: "Vertical", landscape: "Horitzontal" },
    overflow:
      "La fitxa ocupa més d'una pàgina. Perquè hi càpiga en una, escurça el text, redueix la mida de la lletra o treu línies.",
  },
  settings: {
    title: "Ajustos de lectura",
    open: "Obrir els ajustos de lectura",
    close: "Tancar",
    note: "S'apliquen a la demo, les fitxes i el convertidor, i es desen només en aquest navegador.",
    presets: "Els meus ajustos desats",
    empty: "Encara no has desat cap ajust. Posa nom als actuals per tornar-hi amb un clic.",
    name: "Nom",
    placeholder: "Per exemple: Lectura a classe",
    save: "Desar",
    apply: "Fer servir els ajustos «{name}»",
    remove: "Esborrar «{name}»",
    saved: "Ajustos «{name}» desats.",
    removed: "«{name}» s'ha esborrat.",
    applied: "Ara fas servir «{name}».",
    reset: "Tornar als ajustos predeterminats",
    restored: "Ajustos predeterminats restaurats.",
  },
  convert: {
    title: "Convertir un llibre",
    intro:
      "Tria un llibre o un document i descarrega'n una còpia amb l'èmfasi. El fitxer no surt del teu dispositiu: tot es fa en aquest navegador, sense límit de mida.",
    pick: "Tria un fitxer",
    drop: "o arrossega'l aquí",
    formats: "EPUB, TXT, Markdown o HTML",
    selected: "Fitxer triat:",
    output: "Format del resultat",
    outputs: { epub: "EPUB (llibre electrònic)", html: "HTML (pàgina web)", md: "Markdown" },
    options: "Com destacar",
    start: "Convertir",
    progress: "Convertint: {n} %",
    cancel: "Cancel·lar",
    cancelled: "Conversió cancel·lada. No s'ha desat res.",
    done: "Fet. El fitxer està preparat.",
    download: "Descarregar {name}",
    errors: {
      unsupported: "Aquest format no es pot convertir. Tria un fitxer EPUB, TXT, Markdown o HTML.",
      drm: "Aquest llibre té DRM (protecció anticòpia) i no es pot convertir. Si el vas comprar, pregunta a la botiga si te'n poden donar una còpia sense DRM.",
      invalid:
        "No s'ha pogut llegir aquest fitxer. Comprova que s'obre al teu lector o prova'n un altre.",
      failed: "La conversió ha fallat ({detail}). Si torna a passar, explica'ns-ho a GitHub.",
    },
    labels: { part: "Part", contents: "Índex" },
    steps: {
      choose: "Tria el llibre",
      adjust: "Ajusta com es veu",
      convert: "Converteix i descarrega",
    },
    previewTitle: "Així començarà el teu llibre",
    previewEmpty: "Tria un fitxer i aquí en veuràs la primera pàgina amb l'èmfasi.",
    previewLoading: "Preparant la previsualització…",
    previewNote: "Vista aproximada: cada lector mostra el llibre amb la seva pròpia lletra i mida.",
    previewNone: "No s'ha trobat text al principi del fitxer, però el pots convertir igualment.",
    change: "Triar un altre fitxer",
    devices: {
      heading: "Com passar-lo al teu lector",
      items: [
        {
          name: "Kindle",
          text: "Fes servir «Envia a Kindle» d'Amazon (des del web, l'aplicació o per correu) i tria el fitxer EPUB. Amazon l'adapta al teu Kindle.",
        },
        {
          name: "Kobo",
          text: "Connecta el Kobo a l'ordinador amb el cable USB i copia l'EPUB al lector. Expulsa'l i apareixerà a la teva biblioteca.",
        },
        {
          name: "PocketBook",
          text: "Copia'l per USB, igual que en un Kobo, o envia'l per correu amb el servei Send-to-PocketBook.",
        },
      ],
      calibre:
        "Si fas servir Calibre, afegeix el fitxer a la teva biblioteca i envia'l al lector com qualsevol altre llibre.",
    },
  },
  pages: {
    privacy: {
      title: "Privacitat",
      body: [
        "No recollim cap dada. Cap.",
        "L'extensió, aquest web i el convertidor funcionen sencers al teu dispositiu. El que llegeixes i els fitxers que converteixes no s'envien enlloc: no tenim servidors.",
        "No fem servir analítica, galetes, telemetria ni fonts o scripts d'altres llocs.",
        "L'extensió desa els teus ajustos (intensitat, estil, llocs on la vols sempre activa) a l'emmagatzematge del teu propi navegador. Si tens la sincronització del navegador activada, el navegador els pot copiar entre els teus dispositius; nosaltres no els veiem.",
        "L'extensió només demana els permisos imprescindibles. L'accés a un lloc concret, o a tots, només es demana quan tries «Sempre en aquest lloc» o «A tots els llocs», i el pots retirar quan vulguis.",
      ],
    },
    accessibility: {
      title: "Accessibilitat",
      body: [
        "L'èmfasi no canvia mai el que llegeix un lector de pantalla: el text és exactament el mateix, caràcter a caràcter. Ho comprovem amb proves automàtiques i amb NVDA i VoiceOver abans de cada versió.",
        "Tot es pot fer servir només amb el teclat. L'extensió s'activa i es desactiva amb Alt+B, i pots canviar la drecera als ajustos del navegador.",
        "Els colors de l'èmfasi es calculen a partir del color del mateix text, de manera que mantenen el contrast en mode clar, en mode fosc i en els temes de cada web.",
        "Aquest web fa servir la tipografia Atkinson Hyperlegible, pensada per distingir bé cada lletra, i respecta el mode fosc del sistema i la preferència de reduir el moviment.",
        "Si trobes una barrera, obre una incidència a GitHub: és un error, i el tractarem com a tal.",
      ],
    },
  },
};
