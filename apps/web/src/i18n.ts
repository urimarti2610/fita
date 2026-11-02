export const LANGS = ["es", "ca", "en"] as const;
export type Lang = (typeof LANGS)[number];
export type PageKey = "uses" | "convert" | "privacy" | "accessibility";

/** Localized slugs for each page. */
export const SLUGS: Record<Lang, Record<PageKey, string>> = {
  es: {
    uses: "para-quien",
    convert: "convertir",
    privacy: "privacidad",
    accessibility: "accesibilidad",
  },
  ca: {
    uses: "per-a-qui",
    convert: "convertir",
    privacy: "privacitat",
    accessibility: "accessibilitat",
  },
  en: {
    uses: "who-its-for",
    convert: "convert",
    privacy: "privacy",
    accessibility: "accessibility",
  },
};

export const LANG_NAMES: Record<Lang, string> = { es: "Español", ca: "Català", en: "English" };

const es = {
  meta: {
    description:
      "Ayuda de lectura libre y gratuita para personas con TDAH y dislexia: destaca el inicio de cada palabra en la web y en tus ebooks. Todo en tu dispositivo.",
  },
  nav: {
    skip: "Saltar al contenido",
    home: "Inicio",
    convert: "Convertir un libro",
    privacy: "Privacidad",
    accessibility: "Accesibilidad",
    github: "Código fuente",
    language: "Idioma",
  },
  hero: {
    headline: "Lee a tu manera",
    lede: "Destaca suavemente el inicio de cada palabra para que la vista encuentre dónde apoyarse. Para personas con TDAH, dislexia o cualquiera que lo encuentre más cómodo. Gratis, sin cuentas y sin que nada salga de tu dispositivo.",
  },
  install: {
    chrome: "Añadir a Chrome o Edge",
    firefox: "Añadir a Firefox",
    preview:
      "Todavía no está en las tiendas. Mientras tanto puedes instalar la versión de prueba desde GitHub.",
  },
  demo: {
    heading: "Pruébalo con tu texto",
    intro: "Pega cualquier texto. El resultado cambia al momento, y no hay límite de longitud.",
    input: "Tu texto",
    output: "Así se lee",
    sample:
      "Leer debería ser cómodo. Algunas personas pierden la línea, saltan palabras o se cansan antes de acabar el párrafo. Marcar el principio de cada palabra da a la vista un punto de apoyo: prueba distintas intensidades y estilos hasta encontrar el tuyo.",
    strength: "Intensidad",
    style: "Estilo",
    styles: {
      "bold-fade": "Negrita y atenuar",
      bold: "Negrita",
      color: "Color",
      underline: "Subrayado",
      fade: "Atenuar el resto",
    },
    more: "Más opciones",
    every: "Destacar",
    everyOptions: ["Todas las palabras", "1 de cada 2 palabras", "1 de cada 3 palabras"],
    lineHeight: "Interlineado",
    maxWidth: "Ancho máximo de línea",
    pageDefault: "Normal",
    widths: ["Estrecho (50 caracteres)", "Medio (65 caracteres)", "Ancho (80 caracteres)"],
  },
  privacy: {
    heading: "Nada sale de tu dispositivo",
    body: [
      "La extensión, esta página y el conversor de libros funcionan enteros en tu navegador. No hay servidor al que enviar nada.",
      "Sin cuentas, sin analítica, sin cookies y sin límites de uso.",
    ],
    more: "Lee la política de privacidad",
  },
  faq: {
    heading: "Preguntas frecuentes",
    items: [
      {
        q: "¿Funciona de verdad?",
        a: [
          "Depende de la persona. Los estudios publicados hasta ahora no muestran que, de media, se lea más rápido ni que se entienda mejor con este tipo de énfasis.",
          "Lo que sí cuentan muchas personas es que les resulta más cómodo, que pierden menos la línea o que les cuesta menos empezar a leer. Por eso no prometemos velocidad: ofrecemos una ayuda que puedes ajustar o apagar. Prueba la demo y quédate con lo que te sirva.",
        ],
      },
      {
        q: "¿Cuesta algo?",
        a: [
          "No, y no lo hará. No hay versión de pago, ni límite de palabras, ni de tamaño de archivo. Es software libre con licencia MPL-2.0.",
        ],
      },
      {
        q: "¿Puedo usarlo con mis ebooks?",
        a: [
          "Sí. En «Convertir un libro» eliges un EPUB, TXT, Markdown o HTML y descargas una copia con el énfasis. La conversión se hace en tu navegador. Los libros con DRM no se pueden convertir.",
        ],
      },
      {
        q: "¿Funciona en cualquier idioma?",
        a: [
          "En todos los idiomas que separan las palabras con espacios, incluidos los que se escriben de derecha a izquierda. El chino, el japonés, el tailandés y otras escrituras sin espacios se dejan tal cual.",
        ],
      },
      {
        q: "¿Y si uso un lector de pantalla?",
        a: [
          "El texto se lee exactamente igual que antes: no se añade ni se quita ningún carácter.",
        ],
      },
      {
        q: "¿Funciona en el móvil?",
        a: ["Sí, con Firefox para Android. Una aplicación propia llegará más adelante."],
      },
    ],
  },
  footer: {
    license: "Software libre con licencia MPL-2.0.",
  },
  uses: {
    title: "Para quién es",
    intro:
      "Cada persona lee a su manera. Estas son algunas formas de usar la herramienta según quién eres y para qué la necesitas. Todas tienen algo en común: es una ayuda opcional, que se ajusta o se apaga, y que no recoge ningún dato.",
    homeHeading: "Para quién es",
    how: "Cómo usarlo",
    care: "A tener en cuenta",
    cases: [
      {
        id: "educacion",
        title: "Educación",
        summary:
          "Para docentes, centros y familias que quieren adaptar las lecturas sin crear materiales nuevos.",
        link: "Ideas para el aula y para casa",
        lede: "Para docentes, equipos de orientación y familias que quieren que leer cueste un poco menos, sin preparar materiales distintos para cada alumno.",
        steps: [
          "Adapta los materiales que ya tienes: convierte lecturas, apuntes o libros en EPUB, TXT, Markdown o HTML y compártelos tal cual.",
          "En clase, proyecta la demo con el texto del día y probad juntos distintas intensidades y estilos. Que cada alumno diga qué le resulta más cómodo.",
          "En los ordenadores del centro, la extensión funciona sin cuentas ni registros y no recoge datos del alumnado.",
          "En casa, la misma extensión sirve para los deberes y las lecturas en la web.",
        ],
        notes: [
          "Es una ayuda opcional: a unos alumnos les sirve y a otros no. Deja que cada uno elija y que pueda apagarla.",
          "No sustituye la intervención educativa ni el diagnóstico de dificultades de aprendizaje.",
        ],
      },
      {
        id: "logopedia",
        title: "Logopedia y otros profesionales",
        summary:
          "Para logopedas, psicopedagogos y orientadores que buscan una herramienta sencilla para probar en sesión.",
        link: "Cómo usarlo en consulta",
        lede: "Para logopedas, psicopedagogos, orientadores y otros profesionales que acompañan a personas con dificultades de lectura.",
        steps: [
          "En sesión, pega un texto en la demo y prueba varias configuraciones con la persona. Anota cuál le resulta más cómoda: intensidad, estilo, palabras destacadas, interlineado.",
          "Prepara los materiales de trabajo con el conversor y entrégalos en papel, en pantalla o en el lector de libros electrónicos.",
          "Recomienda la extensión para casa con la configuración que hayáis elegido juntos.",
          "Todo funciona en el dispositivo: ningún texto ni dato de pacientes pasa por un servidor.",
        ],
        notes: [
          "No es un tratamiento ni un método de reeducación lectora. Puede ser un apoyo dentro de tu intervención.",
          "Los estudios no muestran que, de media, mejore la velocidad ni la comprensión. Plantéalo como una cuestión de comodidad y preferencia, y valóralo caso por caso.",
        ],
      },
      {
        id: "personas-adultas",
        title: "Personas adultas",
        summary:
          "Para quien quiere volver a leer y se encuentra con que no se concentra, pierde la línea o se cansa enseguida.",
        link: "Cómo empezar",
        lede: "Si quieres leer más pero te cuesta empezar, pierdes la línea, lees la misma frase tres veces o te cansas a la segunda página, puede que esto te ayude. Y si no, no pasa nada.",
        steps: [
          "Instala la extensión y actívala con Alt+B en un artículo que te interese. Empieza por textos cortos.",
          "Convierte un libro que tengas ganas de leer y pásalo a tu lector o a tu móvil.",
          "Ajusta la intensidad hasta que te resulte cómodo. En «Más opciones» puedes aumentar el interlineado y estrechar las líneas: a mucha gente le ayuda tanto como el énfasis.",
          "Si un día te cansa, apágalo. Es tu forma de leer, no una norma.",
        ],
        notes: [
          "No a todo el mundo le funciona, y está bien. Pruébalo unos días antes de decidir.",
          "Si crees que puede haber TDAH o dislexia detrás de tus dificultades, hablarlo con un profesional puede ayudarte.",
        ],
      },
    ],
  },
  convert: {
    title: "Convertir un libro",
    intro:
      "Elige un libro o un documento y descarga una copia con el énfasis. El archivo no sale de tu dispositivo: todo se hace en este navegador, sin límite de tamaño.",
    pick: "Elige un archivo",
    drop: "o arrástralo aquí",
    formats: "EPUB, TXT, Markdown o HTML",
    selected: "Archivo elegido:",
    output: "Formato del resultado",
    outputs: { epub: "EPUB (libro electrónico)", html: "HTML (página web)", md: "Markdown" },
    options: "Cómo destacar",
    start: "Convertir",
    progress: "Convirtiendo: {n} %",
    cancel: "Cancelar",
    cancelled: "Conversión cancelada. No se ha guardado nada.",
    done: "Listo. El archivo está preparado.",
    download: "Descargar {name}",
    errors: {
      unsupported:
        "Este formato no se puede convertir. Elige un archivo EPUB, TXT, Markdown o HTML.",
      drm: "Este libro tiene DRM (protección anticopia) y no se puede convertir. Si lo compraste, pregunta en la tienda si te pueden dar una copia sin DRM.",
      invalid:
        "No se ha podido leer este archivo. Comprueba que se abre en tu lector o prueba con otro.",
      failed: "La conversión ha fallado ({detail}). Si vuelve a pasar, cuéntanoslo en GitHub.",
    },
    labels: { part: "Parte", contents: "Índice" },
    devices: {
      heading: "Cómo pasarlo a tu lector",
      items: [
        {
          name: "Kindle",
          text: "Usa «Enviar a Kindle» de Amazon (desde la web, la aplicación o por correo) y elige el archivo EPUB. Amazon lo adapta a tu Kindle.",
        },
        {
          name: "Kobo",
          text: "Conecta el Kobo al ordenador con el cable USB y copia el EPUB en el lector. Expúlsalo y aparecerá en tu biblioteca.",
        },
        {
          name: "PocketBook",
          text: "Cópialo por USB, igual que en un Kobo, o envíalo por correo con el servicio Send-to-PocketBook.",
        },
      ],
      calibre:
        "Si usas Calibre, añade el archivo a tu biblioteca y envíalo al lector como cualquier otro libro.",
    },
  },
  pages: {
    privacy: {
      title: "Privacidad",
      body: [
        "No recogemos ningún dato. Ninguno.",
        "La extensión, esta web y el conversor funcionan enteros en tu dispositivo. Lo que lees y los archivos que conviertes no se envían a ningún sitio: no tenemos servidores.",
        "No usamos analítica, cookies, telemetría ni fuentes o scripts de otros sitios.",
        "La extensión guarda tus ajustes (intensidad, estilo, sitios donde la quieres siempre activa) en el almacenamiento de tu propio navegador. Si tienes la sincronización del navegador activada, tu navegador puede copiarlos entre tus dispositivos; nosotros no los vemos.",
        "La extensión solo pide los permisos imprescindibles. El acceso a un sitio concreto, o a todos, solo se pide cuando eliges «Siempre en este sitio» o «En todos los sitios», y puedes retirarlo cuando quieras.",
      ],
    },
    accessibility: {
      title: "Accesibilidad",
      body: [
        "El énfasis nunca cambia lo que lee un lector de pantalla: el texto es exactamente el mismo, carácter a carácter. Lo comprobamos con pruebas automáticas y con NVDA y VoiceOver antes de cada versión.",
        "Todo se puede usar solo con teclado. La extensión se activa y desactiva con Alt+B, y puedes cambiar el atajo en los ajustes del navegador.",
        "Los colores del énfasis se calculan a partir del color del propio texto, así que mantienen el contraste en modo claro, en modo oscuro y en los temas de cada web.",
        "Esta web usa la tipografía Atkinson Hyperlegible, pensada para distinguir bien cada letra, respeta el modo oscuro del sistema y la preferencia de reducir el movimiento.",
        "Si encuentras una barrera, abre una incidencia en GitHub: es un error, y lo trataremos como tal.",
      ],
    },
  },
};

export type Strings = typeof es;

const ca: Strings = {
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
          "No, i no ho farà. No hi ha versió de pagament, ni límit de paraules, ni de mida de fitxer. És programari lliure amb llicència MPL-2.0.",
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
    license: "Programari lliure amb llicència MPL-2.0.",
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
      failed: "La conversió ha fallat ({detail}). Si torna a passar, explica-ho a GitHub.",
    },
    labels: { part: "Part", contents: "Índex" },
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

const en: Strings = {
  meta: {
    description:
      "Free, open-source reading aid for people with ADHD and dyslexia: emphasizes the start of each word on the web and in your ebooks. Everything stays on your device.",
  },
  nav: {
    skip: "Skip to content",
    home: "Home",
    convert: "Convert a book",
    privacy: "Privacy",
    accessibility: "Accessibility",
    github: "Source code",
    language: "Language",
  },
  hero: {
    headline: "Read your way",
    lede: "Gently emphasizes the start of each word so your eyes have somewhere to land. For people with ADHD, dyslexia, or anyone who finds it more comfortable. Free, no accounts, and nothing ever leaves your device.",
  },
  install: {
    chrome: "Add to Chrome or Edge",
    firefox: "Add to Firefox",
    preview: "Not in the stores yet. Meanwhile, you can install the preview version from GitHub.",
  },
  demo: {
    heading: "Try it with your own text",
    intro: "Paste any text. The result updates instantly, and there is no length limit.",
    input: "Your text",
    output: "How it reads",
    sample:
      "Reading should feel comfortable. Some people lose their place, skip words or tire before the end of a paragraph. Marking the start of each word gives your eyes an anchor: try different strengths and styles until you find yours.",
    strength: "Strength",
    style: "Style",
    styles: {
      "bold-fade": "Bold and fade",
      bold: "Bold",
      color: "Colour",
      underline: "Underline",
      fade: "Fade the rest",
    },
    more: "More options",
    every: "Emphasize",
    everyOptions: ["Every word", "1 of every 2 words", "1 of every 3 words"],
    lineHeight: "Line spacing",
    maxWidth: "Maximum line width",
    pageDefault: "Normal",
    widths: ["Narrow (50 characters)", "Medium (65 characters)", "Wide (80 characters)"],
  },
  privacy: {
    heading: "Nothing leaves your device",
    body: [
      "The extension, this page and the book converter run entirely in your browser. There is no server to send anything to.",
      "No accounts, no analytics, no cookies and no usage limits.",
    ],
    more: "Read the privacy policy",
  },
  faq: {
    heading: "Questions",
    items: [
      {
        q: "Does it really work?",
        a: [
          "It depends on the person. Published studies so far do not show that, on average, people read faster or understand more with this kind of emphasis.",
          "What many people do report is that reading feels more comfortable, that they lose their place less, or that it is easier to get started. So we don't promise speed: we offer an aid you can tune or switch off. Try the demo and keep whatever helps.",
        ],
      },
      {
        q: "Does it cost anything?",
        a: [
          "No, and it never will. No paid tier, no word limit, no file size limit. It is free software under the MPL-2.0 licence.",
        ],
      },
      {
        q: "Can I use it with my ebooks?",
        a: [
          "Yes. In “Convert a book” you pick an EPUB, TXT, Markdown or HTML file and download a copy with emphasis. The conversion happens in your browser. Books with DRM cannot be converted.",
        ],
      },
      {
        q: "Does it work in any language?",
        a: [
          "In every language that separates words with spaces, including right-to-left scripts. Chinese, Japanese, Thai and other scripts without spaces are left as they are.",
        ],
      },
      {
        q: "What if I use a screen reader?",
        a: ["The text reads exactly as before: no characters are added or removed."],
      },
      {
        q: "Does it work on my phone?",
        a: ["Yes, with Firefox for Android. A dedicated app will come later."],
      },
    ],
  },
  footer: {
    license: "Free software under the MPL-2.0 licence.",
  },
  uses: {
    title: "Who it's for",
    intro:
      "Everyone reads in their own way. Here are some ways to use the tool depending on who you are and what you need it for. They all have one thing in common: it is an optional aid that you can tune or switch off, and it collects no data.",
    homeHeading: "Who it's for",
    how: "How to use it",
    care: "Keep in mind",
    cases: [
      {
        id: "education",
        title: "Education",
        summary:
          "For teachers, schools and families who want to adapt reading material without creating new material.",
        link: "Ideas for the classroom and home",
        lede: "For teachers, learning support teams and families who want reading to take a little less effort, without preparing different material for every student.",
        steps: [
          "Adapt the material you already have: convert readings, notes or books in EPUB, TXT, Markdown or HTML and share them as they are.",
          "In class, project the demo with the day's text and try different strengths and styles together. Let each student say what feels most comfortable.",
          "On school computers, the extension works without accounts or sign-ups and collects no student data.",
          "At home, the same extension helps with homework and reading on the web.",
        ],
        notes: [
          "It is an optional aid: it helps some students and not others. Let each one choose, and switch it off if they want.",
          "It does not replace educational support or the diagnosis of learning difficulties.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Speech therapists and other professionals",
        summary:
          "For speech and language therapists, educational psychologists and counsellors looking for a simple tool to try in sessions.",
        link: "How to use it in sessions",
        lede: "For speech and language therapists, educational psychologists, counsellors and other professionals who support people with reading difficulties.",
        steps: [
          "In a session, paste a text into the demo and try several settings with the person. Note which one feels most comfortable: strength, style, emphasized words, line spacing.",
          "Prepare working material with the converter and hand it out on paper, on screen or on an ebook reader.",
          "Recommend the extension for home use, with the settings you chose together.",
          "Everything runs on the device: no text or patient data ever goes through a server.",
        ],
        notes: [
          "It is not a treatment or a reading intervention method. It can be one support within your work.",
          "Studies do not show an average gain in speed or comprehension. Present it as a matter of comfort and preference, and assess it case by case.",
        ],
      },
      {
        id: "adults",
        title: "Adults",
        summary:
          "For people who want to get back into reading but can't focus, lose their place or tire quickly.",
        link: "How to get started",
        lede: "If you want to read more but struggle to get started, lose your place, read the same sentence three times or get tired by page two, this might help. And if it doesn't, that's fine.",
        steps: [
          "Install the extension and turn it on with Alt+B on an article you care about. Start with short texts.",
          "Convert a book you actually want to read and put it on your ereader or phone.",
          "Adjust the strength until it feels comfortable. Under “More options” you can add line spacing and narrow the lines: for many people that helps as much as the emphasis.",
          "If it tires you one day, switch it off. It is your way of reading, not a rule.",
        ],
        notes: [
          "It doesn't work for everyone, and that's fine. Give it a few days before deciding.",
          "If you think ADHD or dyslexia might be behind your difficulties, talking to a professional can help.",
        ],
      },
    ],
  },
  convert: {
    title: "Convert a book",
    intro:
      "Pick a book or a document and download a copy with emphasis. The file never leaves your device: everything happens in this browser, with no size limit.",
    pick: "Choose a file",
    drop: "or drop it here",
    formats: "EPUB, TXT, Markdown or HTML",
    selected: "Chosen file:",
    output: "Output format",
    outputs: { epub: "EPUB (ebook)", html: "HTML (web page)", md: "Markdown" },
    options: "How to emphasize",
    start: "Convert",
    progress: "Converting: {n} %",
    cancel: "Cancel",
    cancelled: "Conversion cancelled. Nothing was saved.",
    done: "Done. Your file is ready.",
    download: "Download {name}",
    errors: {
      unsupported: "This format can't be converted. Choose an EPUB, TXT, Markdown or HTML file.",
      drm: "This book has DRM (copy protection), so it can't be converted. If you bought it, ask the store whether they can give you a DRM-free copy.",
      invalid:
        "This file couldn't be read. Check that it opens in your reader, or try another one.",
      failed: "The conversion failed ({detail}). If it happens again, please tell us on GitHub.",
    },
    labels: { part: "Part", contents: "Contents" },
    devices: {
      heading: "Getting it onto your reader",
      items: [
        {
          name: "Kindle",
          text: "Use Amazon's Send to Kindle (website, app or email) and choose the EPUB file. Amazon adapts it for your Kindle.",
        },
        {
          name: "Kobo",
          text: "Connect your Kobo to your computer with the USB cable and copy the EPUB onto it. Eject it and the book appears in your library.",
        },
        {
          name: "PocketBook",
          text: "Copy it over USB, as with a Kobo, or email it with the Send-to-PocketBook service.",
        },
      ],
      calibre:
        "If you use Calibre, add the file to your library and send it to your reader like any other book.",
    },
  },
  pages: {
    privacy: {
      title: "Privacy",
      body: [
        "We collect no data. None.",
        "The extension, this website and the converter run entirely on your device. What you read and the files you convert are never sent anywhere: we have no servers.",
        "We use no analytics, cookies, telemetry, or fonts and scripts from other sites.",
        "The extension stores your settings (strength, style, sites where you want it always on) in your own browser's storage. If browser sync is on, your browser may copy them between your devices; we never see them.",
        "The extension asks only for the permissions it needs. Access to a specific site, or to all sites, is requested only when you choose “Always on this site” or “On all sites”, and you can revoke it at any time.",
      ],
    },
    accessibility: {
      title: "Accessibility",
      body: [
        "Emphasis never changes what a screen reader reads: the text is exactly the same, character by character. We check this with automated tests, and with NVDA and VoiceOver before each release.",
        "Everything works with the keyboard alone. The extension toggles with Alt+B, and you can change the shortcut in your browser's settings.",
        "Emphasis colours are derived from the text's own colour, so contrast holds in light mode, dark mode and each site's theme.",
        "This website uses the Atkinson Hyperlegible typeface, designed to tell letters apart clearly, and follows your system's dark mode and reduced-motion preferences.",
        "If you hit a barrier, please open an issue on GitHub: it is a bug, and we will treat it as one.",
      ],
    },
  },
};

export const STRINGS: Record<Lang, Strings> = { es, ca, en };

export function isLang(value: string | undefined): value is Lang {
  return (LANGS as readonly string[]).includes(value ?? "");
}

/** URL for a page in a language, honouring the configured base path. */
export function href(lang: Lang, page?: PageKey, anchor?: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  const path = page ? `${base}${lang}/${SLUGS[lang][page]}/` : `${base}${lang}/`;
  return anchor ? `${path}#${anchor}` : path;
}

/** Pages rendered by [lang]/[page].astro. */
export const PAGES = ["uses", "convert", "privacy", "accessibility"] as const satisfies PageKey[];
