import type { PageKey } from "../i18n";

export const name = "Español";

export const slugs: Record<PageKey, string> = {
  uses: "para-quien",
  worksheets: "fichas",
  convert: "convertir",
  privacy: "privacidad",
  accessibility: "accesibilidad",
};

export const strings = {
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
    theme: { label: "Tema", light: "claro", dark: "oscuro" },
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
          "Crea fichas de lectura con letra grande y un marco amable en «Fichas», e imprímelas o guárdalas en PDF.",
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
  worksheets: {
    title: "Fichas de lectura",
    nav: "Fichas",
    intro:
      "Prepara fichas con letra grande, el inicio de cada palabra destacado y un marco amable. Elige un texto de ejemplo o escribe el tuyo, y luego imprímela o descárgala.",
    editor: "Personaliza la ficha",
    example: "Elegir texto",
    titleLabel: "Título",
    textLabel: "Texto",
    theme: "Marco",
    themes: {
      none: "Sin marco",
      simple: "Sencillo",
      clouds: "Nubes",
      garden: "Jardín",
      stars: "Estrellas",
      vehicles: "Coches y camiones",
    },
    size: "Tamaño de letra",
    sizes: ["Grande", "Muy grande", "Enorme"],
    nameDate: "Añadir nombre y fecha",
    name: "Nombre",
    date: "Fecha",
    lines: "Líneas para escribir",
    linesOptions: ["Ninguna", "3 líneas", "6 líneas", "10 líneas"],
    preview: "Vista previa",
    showPageSize: "Mostrar tamaño de página",
    pageSizes: {
      portrait: "A4 vertical (210 × 297 mm)",
      landscape: "A4 horizontal (297 × 210 mm)",
    },
    pageN: "Página {n}",
    editHint:
      "Puedes escribir directamente en la ficha: haz clic en el título o en el texto. El énfasis se aplica al terminar.",
    editTitle: "Título de la ficha",
    editText: "Texto de la ficha",
    print: "Imprimir o guardar en PDF",
    download: "Descargar la ficha",
    printHint:
      "Para guardarla en PDF, elige «Guardar como PDF» en el diálogo de impresión. Se imprime sobre fondo blanco, para gastar menos tinta.",
    downloadHint:
      "La descarga es una página web que puedes abrir e imprimir cuando quieras, también sin conexión.",
    fileName: "ficha",
    tabs: { text: "Texto", layout: "Diseño", emphasis: "Énfasis" },
    myTexts: "Mis textos",
    save: "Guardar en mis textos",
    saved: "«{title}» está guardado en mis textos.",
    remove: "Quitar de mis textos",
    removed: "«{title}» se ha quitado de mis textos.",
    exportTexts: "Exportar mis textos",
    importTexts: "Importar textos",
    imported: "Textos importados: {n}.",
    importEmpty: "No hay ningún texto en ese archivo. Usa un .md con títulos «## » o un .txt.",
    libraryNote:
      "Tus textos se guardan solo en este navegador. Expórtalos para tener una copia, compartirlos o pasarlos a otro ordenador.",
    exportHeading: "Mis textos para fichas",
    levelKey: "Nivel",
    textsFileName: "mis-textos-fichas",
    orientation: "Orientación",
    orientations: { portrait: "Vertical", landscape: "Horizontal" },
    overflow:
      "La ficha ocupa más de una página. Para que quepa en una, acorta el texto, reduce el tamaño de letra o quita líneas.",
  },
  settings: {
    title: "Ajustes de lectura",
    open: "Abrir los ajustes de lectura",
    close: "Cerrar",
    note: "Se aplican en la demo, las fichas y el conversor, y se guardan solo en este navegador.",
    presets: "Mis ajustes guardados",
    empty:
      "Aún no has guardado ningún ajuste. Ponle nombre a los actuales para volver a ellos con un clic.",
    name: "Nombre",
    placeholder: "Por ejemplo: Lectura en clase",
    save: "Guardar",
    apply: "Usar los ajustes «{name}»",
    remove: "Borrar «{name}»",
    saved: "Ajustes «{name}» guardados.",
    removed: "«{name}» se ha borrado.",
    applied: "Ahora usas «{name}».",
    reset: "Volver a los ajustes predeterminados",
    restored: "Ajustes predeterminados restaurados.",
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
    steps: {
      choose: "Elige el libro",
      adjust: "Ajusta cómo se ve",
      convert: "Convierte y descarga",
    },
    previewTitle: "Así empezará tu libro",
    previewEmpty: "Elige un archivo y aquí verás su primera página con el énfasis.",
    previewLoading: "Preparando la vista previa…",
    previewNote: "Vista aproximada: cada lector muestra el libro con su propia letra y tamaño.",
    previewNone:
      "No se ha encontrado texto al principio del archivo, pero puedes convertirlo igualmente.",
    change: "Elegir otro archivo",
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
        "Esta web usa la tipografía Atkinson Hyperlegible, pensada para distinguir bien cada letra, y respeta el modo oscuro del sistema y la preferencia de reducir el movimiento.",
        "Si encuentras una barrera, abre una incidencia en GitHub: es un error, y lo trataremos como tal.",
      ],
    },
  },
};

export type Strings = typeof strings;
