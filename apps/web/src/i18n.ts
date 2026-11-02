export const LANGS = ["es", "ca", "en"] as const;
export type Lang = (typeof LANGS)[number];
export type PageKey = "convert" | "privacy" | "accessibility";

/** Localized slugs for each page. */
export const SLUGS: Record<Lang, Record<PageKey, string>> = {
  es: { convert: "convertir", privacy: "privacidad", accessibility: "accesibilidad" },
  ca: { convert: "convertir", privacy: "privacitat", accessibility: "accessibilitat" },
  en: { convert: "convert", privacy: "privacy", accessibility: "accessibility" },
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
    styles: { bold: "Negrita", color: "Color", underline: "Subrayado", fade: "Atenuar el resto" },
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
    styles: { bold: "Negreta", color: "Color", underline: "Subratllat", fade: "Atenuar la resta" },
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
    styles: { bold: "Bold", color: "Colour", underline: "Underline", fade: "Fade the rest" },
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
export function href(lang: Lang, page?: PageKey): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  return page ? `${base}${lang}/${SLUGS[lang][page]}/` : `${base}${lang}/`;
}

/** Plain text pages rendered by [lang]/[page].astro. */
export const TEXT_PAGES = ["privacy", "accessibility"] as const satisfies PageKey[];
