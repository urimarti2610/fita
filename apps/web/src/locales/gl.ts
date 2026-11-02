import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Galego";

export const slugs: Record<PageKey, string> = {
  uses: "para-quen",
  worksheets: "fichas",
  convert: "converter",
  privacy: "privacidade",
  accessibility: "accesibilidade",
};

export const strings: Strings = {
  meta: {
    description:
      "Axuda de lectura libre e gratuíta para persoas con TDAH e dislexia: destaca o inicio de cada palabra na web e nos teus libros electrónicos. Todo queda no teu dispositivo.",
  },
  nav: {
    skip: "Ir ao contido",
    home: "Inicio",
    convert: "Converter un libro",
    privacy: "Privacidade",
    accessibility: "Accesibilidade",
    github: "Código fonte",
    language: "Idioma",
    theme: {
      label: "Tema",
      light: "claro",
      dark: "escuro",
    },
  },
  hero: {
    headline: "Le ao teu xeito",
    lede: "Destaca suavemente o inicio de cada palabra para que a vista teña onde apoiarse. Para persoas con TDAH, con dislexia ou para calquera que o atope máis cómodo. Gratis, sen contas e sen que nada saia do teu dispositivo.",
  },
  install: {
    chrome: "Engadir a Chrome ou Edge",
    firefox: "Engadir a Firefox",
    preview:
      "Aínda non está nas tendas. Mentres tanto, podes instalar a versión de proba desde GitHub.",
  },
  demo: {
    heading: "Próbao co teu texto",
    intro: "Pega calquera texto. O resultado cambia ao momento e non hai límite de lonxitude.",
    input: "O teu texto",
    output: "Como se le",
    sample:
      "Ler debería ser cómodo. Hai quen perde o fío, salta palabras ou se cansa antes de rematar un parágrafo. Marcar o inicio de cada palabra dálle á vista un punto de apoio: proba distintas intensidades e estilos ata atopar o teu.",
    strength: "Intensidade",
    style: "Estilo",
    styles: {
      "bold-fade": "Negra e atenuado",
      bold: "Negra",
      color: "Cor",
      underline: "Subliñado",
      fade: "Atenuar o resto",
    },
    more: "Máis opcións",
    every: "Destacar",
    everyOptions: ["Todas as palabras", "1 de cada 2 palabras", "1 de cada 3 palabras"],
    lineHeight: "Espazo entre liñas",
    maxWidth: "Largura máxima da liña",
    pageDefault: "Normal",
    widths: ["Estreita (50 caracteres)", "Media (65 caracteres)", "Ancha (80 caracteres)"],
  },
  privacy: {
    heading: "Nada sae do teu dispositivo",
    body: [
      "A extensión, esta páxina e o conversor de libros funcionan enteiramente no teu navegador. Non hai ningún servidor ao que enviar nada.",
      "Sen contas, sen analítica, sen cookies e sen límites de uso.",
    ],
    more: "Ler a política de privacidade",
  },
  faq: {
    heading: "Preguntas",
    items: [
      {
        q: "Funciona de verdade?",
        a: [
          "Depende da persoa. Os estudos publicados ata agora non mostran que, de media, se lea máis rápido nin se entenda mellor con este tipo de énfase.",
          "O que si conta moita xente é que ler resulta máis cómodo, que se perde menos o fío ou que custa menos comezar. Por iso non prometemos velocidade: ofrecemos unha axuda que podes axustar ou desactivar. Proba a demostración e quédate co que che sirva.",
        ],
      },
      {
        q: "Custa algo?",
        a: [
          "Non, e nunca custará. Sen versión de pago, sen límite de palabras nin de tamaño de ficheiro. É software libre baixo a licenza Apache-2.0.",
        ],
      },
      {
        q: "Podo usalo cos meus libros electrónicos?",
        a: [
          "Si. En «Converter un libro» escolles un ficheiro EPUB, TXT, Markdown ou HTML e descargas unha copia con énfase. A conversión faise no teu navegador. Os libros con DRM non se poden converter.",
        ],
      },
      {
        q: "Funciona en calquera idioma?",
        a: [
          "En todos os idiomas que separan as palabras con espazos, incluídas as escritas de dereita a esquerda. O chinés, o xaponés, o tailandés e outras escritas sen espazos quedan como están.",
        ],
      },
      {
        q: "E se uso un lector de pantalla?",
        a: [
          "O texto lese exactamente igual que antes: non se engade nin se quita ningún carácter.",
        ],
      },
      {
        q: "Funciona no móbil?",
        a: ["Si, con Firefox para Android. Máis adiante haberá unha aplicación propia."],
      },
    ],
  },
  footer: {
    license: "Software libre baixo a licenza Apache-2.0.",
  },
  uses: {
    title: "Para quen é",
    intro:
      "Cada persoa le ao seu xeito. Aquí tes algunhas formas de usar a ferramenta segundo quen sexas e para que a necesites. Todas teñen algo en común: é unha axuda opcional que podes axustar ou desactivar, e non recolle ningún dato.",
    homeHeading: "Para quen é",
    how: "Como usala",
    care: "Ten en conta",
    cases: [
      {
        id: "education",
        title: "Educación",
        summary:
          "Para o profesorado, os centros educativos e as familias que queren adaptar as lecturas sen crear material novo.",
        link: "Ideas para a aula e para a casa",
        lede: "Para o profesorado, os equipos de apoio e as familias que queren que ler custe un pouco menos, sen preparar material diferente para cada alumno ou alumna.",
        steps: [
          "Adapta o material que xa tes: converte lecturas, apuntamentos ou libros en EPUB, TXT, Markdown ou HTML e compárteos tal cal.",
          "Na aula, proxecta a demostración co texto do día e probade en grupo distintas intensidades e estilos. Deixa que cada estudante diga cal lle resulta máis cómodo.",
          "Nos ordenadores do centro, a extensión funciona sen contas nin rexistros e non recolle ningún dato do alumnado.",
          "Fai fichas de lectura con letra grande e un marco amable en «Fichas», e despois imprímeas ou gárdaas en PDF.",
          "Na casa, a mesma extensión axuda cos deberes e coa lectura na web.",
        ],
        notes: [
          "É unha axuda opcional: a algúns estudantes axúdalles e a outros non. Deixa que cada quen escolla e que a desactive se quere.",
          "Non substitúe o apoio educativo nin o diagnóstico das dificultades de aprendizaxe.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopedia e outras profesións",
        summary:
          "Para logopedas e profesionais da psicopedagoxía e da orientación que buscan unha ferramenta sinxela para probar nas sesións.",
        link: "Como usala nas sesións",
        lede: "Para logopedas, profesionais da psicopedagoxía e da orientación e outros perfís profesionais que acompañan persoas con dificultades de lectura.",
        steps: [
          "Nunha sesión, pega un texto na demostración e proba varias configuracións coa persoa. Anota cal lle resulta máis cómoda: intensidade, estilo, palabras destacadas, espazo entre liñas.",
          "Prepara material de traballo co conversor e entrégao en papel, en pantalla ou nun lector de libros electrónicos.",
          "Recomenda a extensión para usala na casa, coa configuración que escollestes na sesión.",
          "Todo funciona no dispositivo: ningún texto nin dato de pacientes pasa nunca por un servidor.",
        ],
        notes: [
          "Non é un tratamento nin un método de intervención na lectura. Pode ser un apoio máis dentro do teu traballo.",
          "Os estudos non mostran unha mellora media de velocidade nin de comprensión. Preséntao como unha cuestión de comodidade e preferencia, e valórao caso por caso.",
        ],
      },
      {
        id: "adults",
        title: "Persoas adultas",
        summary:
          "Para quen quere volver ler pero non consegue concentrarse, perde o fío ou se cansa axiña.",
        link: "Como comezar",
        lede: "Se queres ler máis pero che custa comezar, perdes o fío, les a mesma frase tres veces ou te cansas na segunda páxina, isto pode axudarche. E se non, non pasa nada.",
        steps: [
          "Instala a extensión e actívaa con Alt+B nun artigo que che interese. Comeza con textos curtos.",
          "Converte un libro que teñas ganas de ler de verdade e pásao ao teu lector de libros electrónicos ou ao móbil.",
          "Axusta a intensidade ata que che resulte cómoda. En «Máis opcións» podes engadir espazo entre liñas e estreitar as liñas: para moita xente iso axuda tanto como a énfase.",
          "Se algún día te cansa, desactívaa. É a túa forma de ler, non unha norma.",
        ],
        notes: [
          "Non lle funciona a todo o mundo, e non pasa nada. Dálle uns días antes de decidir.",
          "Se pensas que detrás das túas dificultades pode haber TDAH ou dislexia, buscar apoio profesional pode axudarche.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Fichas de lectura",
    nav: "Fichas",
    intro:
      "Fai fichas con letra grande, o inicio de cada palabra destacado e un marco amable. Escolle un texto de exemplo ou escribe o teu, e despois imprímeo ou descárgao.",
    editor: "Personaliza a ficha",
    example: "Escolle un texto",
    titleLabel: "Título",
    textLabel: "Texto",
    theme: "Marco",
    themes: {
      none: "Sen marco",
      simple: "Sinxelo",
      clouds: "Nubes",
      garden: "Xardín",
      stars: "Estrelas",
      vehicles: "Coches e camións",
    },
    size: "Tamaño do texto",
    sizes: ["Grande", "Moi grande", "Enorme"],
    nameDate: "Engadir nome e data",
    name: "Nome",
    date: "Data",
    lines: "Liñas para escribir",
    linesOptions: ["Ningunha", "3 liñas", "6 liñas", "10 liñas"],
    preview: "Vista previa",
    showPageSize: "Mostrar o tamaño da páxina",
    pageSizes: {
      portrait: "A4 vertical (210 × 297 mm)",
      landscape: "A4 horizontal (297 × 210 mm)",
    },
    pageN: "Páxina {n}",
    editHint:
      "Podes escribir directamente na ficha: preme no título ou no texto. A énfase aplícase cando remates.",
    editTitle: "Título da ficha",
    editText: "Texto da ficha",
    print: "Imprimir ou gardar en PDF",
    download: "Descargar a ficha",
    printHint:
      "Para gardala en PDF, escolle «Gardar como PDF» no diálogo de impresión. Imprímese con fondo branco para aforrar tinta.",
    downloadHint:
      "A descarga é unha páxina web que podes abrir e imprimir cando queiras, mesmo sen conexión.",
    fileName: "ficha",
    tabs: { text: "Texto", layout: "Deseño", emphasis: "Énfase" },
    myTexts: "Os meus textos",
    save: "Gardar nos meus textos",
    saved: "«{title}» está gardado nos teus textos.",
    remove: "Quitar dos meus textos",
    removed: "«{title}» quitouse dos teus textos.",
    exportTexts: "Exportar os meus textos",
    importTexts: "Importar textos",
    imported: "Textos importados: {n}.",
    importEmpty:
      "Ese ficheiro non ten textos. Usa un ficheiro .md con títulos «## » ou un ficheiro .txt.",
    libraryNote:
      "Os teus textos gárdanse só neste navegador. Expórtaos para ter unha copia, compartilos ou levalos a outro ordenador.",
    exportHeading: "Os meus textos para fichas",
    levelKey: "Nivel",
    textsFileName: "os-meus-textos-fichas",
    orientation: "Orientación",
    orientations: { portrait: "Vertical", landscape: "Horizontal" },
    overflow:
      "A ficha ocupa unha segunda páxina. Para que caiba nunha, acurta o texto, escolle un tamaño de letra menor ou quita liñas.",
  },
  settings: {
    title: "Axustes de lectura",
    open: "Abrir os axustes de lectura",
    close: "Pechar",
    note: "Aplícanse á demostración, ás fichas e ao conversor, e gárdanse só neste navegador.",
    presets: "Os meus axustes gardados",
    empty:
      "Aínda non gardaches ningún axuste. Ponlles nome aos actuais para volver a eles cun só clic.",
    name: "Nome",
    placeholder: "Por exemplo: Lectura na aula",
    save: "Gardar",
    apply: "Usar os axustes «{name}»",
    remove: "Eliminar «{name}»",
    saved: "Axustes «{name}» gardados.",
    removed: "Eliminouse «{name}».",
    applied: "Agora usas «{name}».",
    reset: "Volver aos axustes predeterminados",
    restored: "Restauráronse os axustes predeterminados.",
  },
  convert: {
    title: "Converter un libro",
    intro:
      "Escolle un libro ou un documento e descarga unha copia con énfase. O ficheiro nunca sae do teu dispositivo: todo pasa neste navegador, sen límite de tamaño.",
    pick: "Escoller un ficheiro",
    drop: "ou arrástrao aquí",
    formats: "EPUB, TXT, Markdown ou HTML",
    selected: "Ficheiro escollido:",
    output: "Formato de saída",
    outputs: { epub: "EPUB (libro electrónico)", html: "HTML (páxina web)", md: "Markdown" },
    options: "Como destacar",
    start: "Converter",
    progress: "Convertendo: {n} %",
    cancel: "Cancelar",
    cancelled: "Conversión cancelada. Non se gardou nada.",
    done: "Feito. O teu ficheiro está listo.",
    download: "Descargar {name}",
    errors: {
      unsupported:
        "Este formato non se pode converter. Escolle un ficheiro EPUB, TXT, Markdown ou HTML.",
      drm: "Este libro ten DRM (protección contra copia), polo que non se pode converter. Se o compraches, pregunta na tenda se che poden dar unha copia sen DRM.",
      invalid:
        "Non se puido ler este ficheiro. Comproba que se abre no teu lector ou proba con outro.",
      failed: "A conversión fallou ({detail}). Se volve pasar, avísanos en GitHub, por favor.",
    },
    labels: { part: "Parte", contents: "Índice" },
    steps: {
      choose: "Escolle o teu libro",
      adjust: "Axusta como se ve",
      convert: "Converte e descarga",
    },
    previewTitle: "Así comezará o teu libro",
    previewEmpty: "Escolle un ficheiro e aquí aparecerá a súa primeira páxina, con énfase.",
    previewLoading: "Preparando a vista previa…",
    previewNote:
      "Vista aproximada: cada lector mostra o libro co seu propio tipo e tamaño de letra.",
    previewNone: "Non se atopou texto ao comezo do ficheiro, pero podes convertelo igualmente.",
    change: "Escoller outro ficheiro",
    devices: {
      heading: "Como pasalo ao teu lector",
      items: [
        {
          name: "Kindle",
          text: "Usa Send to Kindle de Amazon (web, aplicación ou correo electrónico) e escolle o ficheiro EPUB. Amazon adáptao para o teu Kindle.",
        },
        {
          name: "Kobo",
          text: "Conecta o teu Kobo ao ordenador co cable USB e copia nel o EPUB. Expúlsao e o libro aparecerá na túa biblioteca.",
        },
        {
          name: "PocketBook",
          text: "Cópiao por USB, como cun Kobo, ou envíao por correo electrónico co servizo Send-to-PocketBook.",
        },
      ],
      calibre:
        "Se usas Calibre, engade o ficheiro á túa biblioteca e envíao ao lector coma calquera outro libro.",
    },
  },
  pages: {
    privacy: {
      title: "Privacidade",
      body: [
        "Non recollemos ningún dato. Ningún.",
        "A extensión, esta web e o conversor funcionan enteiramente no teu dispositivo. O que les e os ficheiros que convertes nunca se envían a ningures: non temos servidores.",
        "Non usamos analítica, cookies, telemetría nin tipos de letra ou scripts doutros sitios.",
        "A extensión garda os teus axustes (intensidade, estilo, sitios onde a queres sempre activa) no almacenamento do teu propio navegador. Se tes a sincronización do navegador activada, o navegador pode copialos entre os teus dispositivos; nós nunca os vemos.",
        "A extensión só pide os permisos que necesita. O acceso a un sitio concreto, ou a todos os sitios, só se pide cando escolles «Sempre neste sitio» ou «En todos os sitios», e podes retiralo cando queiras.",
      ],
    },
    accessibility: {
      title: "Accesibilidade",
      body: [
        "A énfase nunca cambia o que le un lector de pantalla: o texto é exactamente o mesmo, carácter por carácter. Comprobámolo con probas automáticas, e con NVDA e VoiceOver antes de cada versión.",
        "Todo funciona só co teclado. A extensión actívase e desactívase con Alt+B, e podes cambiar o atallo nos axustes do teu navegador.",
        "As cores da énfase sácanse da propia cor do texto, polo que o contraste se mantén no modo claro, no modo escuro e co tema de cada sitio.",
        "Esta web usa o tipo de letra Atkinson Hyperlegible, deseñado para distinguir ben as letras, e respecta as preferencias do teu sistema de modo escuro e de movemento reducido.",
        "Se atopas unha barreira, abre unha incidencia en GitHub, por favor: é un erro e tratarémolo como tal.",
      ],
    },
  },
};
