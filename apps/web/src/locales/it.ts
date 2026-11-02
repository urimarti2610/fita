import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Italiano";

export const slugs: Record<PageKey, string> = {
  uses: "per-chi",
  worksheets: "schede",
  convert: "converti",
  privacy: "privacy",
  accessibility: "accessibilita",
};

export const strings: Strings = {
  meta: {
    description:
      "Aiuto alla lettura libero e gratuito per persone con ADHD e dislessia: mette in evidenza l’inizio di ogni parola sul web e nei tuoi ebook. Tutto resta sul tuo dispositivo.",
  },
  nav: {
    skip: "Vai al contenuto",
    home: "Home",
    convert: "Converti un libro",
    privacy: "Privacy",
    accessibility: "Accessibilità",
    github: "Codice sorgente",
    language: "Lingua",
    theme: {
      label: "Tema",
      light: "chiaro",
      dark: "scuro",
    },
  },
  hero: {
    headline: "Leggi a modo tuo",
    lede: "Mette delicatamente in evidenza l’inizio di ogni parola, così gli occhi hanno un punto su cui posarsi. Per chi ha l’ADHD, la dislessia o semplicemente si trova più a proprio agio. Gratis, senza account, e niente lascia mai il tuo dispositivo.",
  },
  install: {
    chrome: "Aggiungi a Chrome o Edge",
    firefox: "Aggiungi a Firefox",
    preview:
      "Non è ancora negli store. Nel frattempo puoi installare la versione di anteprima da GitHub.",
  },
  demo: {
    heading: "Prova con un tuo testo",
    intro:
      "Incolla un testo qualsiasi. Il risultato si aggiorna subito e non c’è alcun limite di lunghezza.",
    input: "Il tuo testo",
    output: "Come si legge",
    sample:
      "Leggere dovrebbe essere piacevole. Alcune persone perdono il segno, saltano parole o si stancano prima della fine di un paragrafo. Segnare l’inizio di ogni parola dà agli occhi un punto di ancoraggio: prova intensità e stili diversi finché non trovi il tuo.",
    strength: "Intensità",
    style: "Stile",
    styles: {
      "bold-fade": "Grassetto e attenuato",
      bold: "Grassetto",
      color: "Colore",
      underline: "Sottolineato",
      fade: "Attenua il resto",
    },
    more: "Altre opzioni",
    every: "Evidenzia",
    everyOptions: ["Tutte le parole", "1 parola ogni 2", "1 parola ogni 3"],
    lineHeight: "Interlinea",
    maxWidth: "Larghezza massima della riga",
    pageDefault: "Normale",
    widths: ["Stretta (50 caratteri)", "Media (65 caratteri)", "Ampia (80 caratteri)"],
  },
  privacy: {
    heading: "Niente lascia il tuo dispositivo",
    body: [
      "L’estensione, questa pagina e il convertitore di libri funzionano interamente nel tuo browser. Non c’è nessun server a cui inviare qualcosa.",
      "Niente account, niente statistiche, niente cookie e nessun limite di utilizzo.",
    ],
    more: "Leggi l’informativa sulla privacy",
  },
  faq: {
    heading: "Domande",
    items: [
      {
        q: "Funziona davvero?",
        a: [
          "Dipende dalla persona. Gli studi pubblicati finora non mostrano che, in media, con questo tipo di evidenziazione si legga più velocemente o si capisca di più.",
          "Quello che molte persone raccontano, invece, è che leggere risulta più comodo, che perdono meno il segno o che è più facile cominciare. Per questo non promettiamo velocità: offriamo un aiuto che puoi regolare o spegnere. Prova la demo e tieni quello che ti serve.",
        ],
      },
      {
        q: "Costa qualcosa?",
        a: [
          "No, e non costerà mai nulla. Nessuna versione a pagamento, nessun limite di parole, nessun limite di dimensione dei file. È software libero con licenza MPL-2.0.",
        ],
      },
      {
        q: "Posso usarlo con i miei ebook?",
        a: [
          "Sì. In «Converti un libro» scegli un file EPUB, TXT, Markdown o HTML e scarichi una copia con l’evidenziazione. La conversione avviene nel tuo browser. I libri con DRM non si possono convertire.",
        ],
      },
      {
        q: "Funziona in tutte le lingue?",
        a: [
          "In tutte le lingue che separano le parole con spazi, comprese quelle scritte da destra a sinistra. Il cinese, il giapponese, il thailandese e le altre scritture senza spazi restano come sono.",
        ],
      },
      {
        q: "E se uso un lettore di schermo?",
        a: [
          "Il testo viene letto esattamente come prima: nessun carattere viene aggiunto o tolto.",
        ],
      },
      {
        q: "Funziona sul telefono?",
        a: ["Sì, con Firefox per Android. Più avanti arriverà un’app dedicata."],
      },
    ],
  },
  footer: {
    license: "Software libero con licenza MPL-2.0.",
  },
  uses: {
    title: "Per chi è",
    intro:
      "Ognuno legge a modo suo. Ecco alcuni modi di usare lo strumento a seconda di chi sei e di cosa ti serve. Hanno tutti una cosa in comune: è un aiuto facoltativo che puoi regolare o spegnere, e non raccoglie alcun dato.",
    homeHeading: "Per chi è",
    how: "Come usarlo",
    care: "Da tenere a mente",
    cases: [
      {
        id: "education",
        title: "Scuola",
        summary:
          "Per insegnanti, scuole e famiglie che vogliono adattare le letture senza creare nuovo materiale.",
        link: "Idee per la classe e per casa",
        lede: "Per insegnanti, docenti di sostegno e famiglie che vogliono rendere la lettura un po’ meno faticosa, senza preparare materiale diverso per ogni studente.",
        steps: [
          "Adatta il materiale che hai già: converti letture, appunti o libri in EPUB, TXT, Markdown o HTML e condividili così come sono.",
          "In classe, proietta la demo con il testo del giorno e provate insieme intensità e stili diversi. Lascia che ogni studente dica cosa trova più comodo.",
          "Sui computer della scuola, l’estensione funziona senza account né registrazioni e non raccoglie dati sugli studenti.",
          "Crea schede di lettura con caratteri grandi e una cornice simpatica in «Schede», poi stampale o salvale in PDF.",
          "A casa, la stessa estensione aiuta con i compiti e con la lettura sul web.",
        ],
        notes: [
          "È un aiuto facoltativo: ad alcuni studenti serve e ad altri no. Lascia che ognuno scelga, e che lo spenga se vuole.",
          "Non sostituisce il supporto didattico né la diagnosi dei disturbi dell’apprendimento.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopedisti e altri professionisti",
        summary:
          "Per logopedisti, psicologi dell’età evolutiva e consulenti che cercano uno strumento semplice da provare in seduta.",
        link: "Come usarlo in seduta",
        lede: "Per logopedisti, psicologi dell’età evolutiva, consulenti e altri professionisti che accompagnano persone con difficoltà di lettura.",
        steps: [
          "In seduta, incolla un testo nella demo e prova diverse impostazioni insieme alla persona. Annota quella che trova più comoda: intensità, stile, parole evidenziate, interlinea.",
          "Prepara materiale di lavoro con il convertitore e consegnalo su carta, a schermo o su un lettore di ebook.",
          "Consiglia l’estensione per l’uso a casa, con le impostazioni scelte insieme.",
          "Tutto funziona sul dispositivo: nessun testo e nessun dato dei pazienti passa mai da un server.",
        ],
        notes: [
          "Non è un trattamento né un metodo di intervento sulla lettura. Può essere un supporto all’interno del tuo lavoro.",
          "Gli studi non mostrano un miglioramento medio di velocità o comprensione. Presentalo come una questione di comodità e preferenza, e valutalo caso per caso.",
        ],
      },
      {
        id: "adults",
        title: "Adulti",
        summary:
          "Per chi vuole tornare a leggere ma non riesce a concentrarsi, perde il segno o si stanca in fretta.",
        link: "Come cominciare",
        lede: "Se vuoi leggere di più ma fai fatica a cominciare, perdi il segno, rileggi tre volte la stessa frase o a pagina due sei già senza energie, questo potrebbe aiutarti. E se non ti aiuta, va bene così.",
        steps: [
          "Installa l’estensione e attivala con Alt+B su un articolo che ti interessa. Comincia con testi brevi.",
          "Converti un libro che hai davvero voglia di leggere e mettilo sul tuo lettore di ebook o sul telefono.",
          "Regola l’intensità finché non ti trovi a tuo agio. In «Altre opzioni» puoi aumentare l’interlinea e restringere le righe: per molte persone aiuta quanto l’evidenziazione.",
          "Se un giorno ti stanca, spegnila. È il tuo modo di leggere, non una regola.",
        ],
        notes: [
          "Non funziona per tutti, e va bene così. Concediti qualche giorno prima di decidere.",
          "Se pensi che dietro le tue difficoltà possano esserci l’ADHD o la dislessia, parlarne con un professionista può aiutarti.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Schede di lettura",
    nav: "Schede",
    intro:
      "Crea schede con caratteri grandi, l’inizio di ogni parola evidenziato e una cornice simpatica. Scegli un testo di esempio o scrivi il tuo, poi stampalo o scaricalo.",
    editor: "Personalizza la scheda",
    example: "Scegli un testo",
    titleLabel: "Titolo",
    textLabel: "Testo",
    theme: "Cornice",
    themes: {
      none: "Senza cornice",
      simple: "Semplice",
      clouds: "Nuvole",
      garden: "Giardino",
      stars: "Stelle",
      vehicles: "Auto e camion",
    },
    size: "Dimensione del testo",
    sizes: ["Grande", "Molto grande", "Enorme"],
    nameDate: "Aggiungi nome e data",
    name: "Nome",
    date: "Data",
    lines: "Righe per scrivere",
    linesOptions: ["Nessuna", "3 righe", "6 righe", "10 righe"],
    preview: "Anteprima",
    showPageSize: "Mostra le dimensioni della pagina",
    pageSizes: {
      portrait: "A4 verticale (210 × 297 mm)",
      landscape: "A4 orizzontale (297 × 210 mm)",
    },
    pageN: "Pagina {n}",
    editHint:
      "Puoi scrivere direttamente sulla scheda: fai clic sul titolo o sul testo. L’evidenziazione si applica quando hai finito.",
    editTitle: "Titolo della scheda",
    editText: "Testo della scheda",
    print: "Stampa o salva in PDF",
    download: "Scarica la scheda",
    printHint:
      "Per salvarla in PDF, scegli «Salva come PDF» nella finestra di stampa. Si stampa su sfondo bianco per risparmiare inchiostro.",
    downloadHint:
      "Il file scaricato è una pagina web che puoi aprire e stampare quando vuoi, anche senza connessione.",
    fileName: "scheda",
    tabs: { text: "Testo", layout: "Impaginazione", emphasis: "Evidenziazione" },
    myTexts: "I miei testi",
    save: "Salva nei miei testi",
    saved: "«{title}» è stato salvato nei miei testi.",
    remove: "Togli dai miei testi",
    removed: "«{title}» è stato tolto dai miei testi.",
    exportTexts: "Esporta i miei testi",
    importTexts: "Importa testi",
    imported: "Testi importati: {n}.",
    importEmpty:
      "In quel file non ci sono testi. Usa un file .md con titoli «## », oppure un file .txt.",
    libraryNote:
      "I tuoi testi sono salvati solo in questo browser. Esportali per tenerne una copia, condividerli o spostarli su un altro computer.",
    exportHeading: "I miei testi per le schede",
    levelKey: "Livello",
    textsFileName: "i-miei-testi-schede",
    orientation: "Orientamento",
    orientations: { portrait: "Verticale", landscape: "Orizzontale" },
    overflow:
      "La scheda continua su una seconda pagina. Per farla stare in una sola, accorcia il testo, scegli una dimensione del testo più piccola o togli delle righe.",
  },
  settings: {
    title: "Impostazioni di lettura",
    open: "Apri le impostazioni di lettura",
    close: "Chiudi",
    note: "Valgono per la demo, le schede e il convertitore, e sono salvate solo in questo browser.",
    presets: "Le mie impostazioni salvate",
    empty:
      "Non hai ancora salvato nessuna impostazione. Dai un nome a quelle attuali per ritrovarle con un clic.",
    name: "Nome",
    placeholder: "Per esempio: Lettura in classe",
    save: "Salva",
    apply: "Usa le impostazioni «{name}»",
    remove: "Elimina «{name}»",
    saved: "Impostazioni «{name}» salvate.",
    removed: "«{name}» è stato eliminato.",
    applied: "Ora stai usando «{name}».",
    reset: "Torna alle impostazioni predefinite",
    restored: "Impostazioni predefinite ripristinate.",
  },
  convert: {
    title: "Converti un libro",
    intro:
      "Scegli un libro o un documento e scarica una copia con l’evidenziazione. Il file non lascia mai il tuo dispositivo: tutto avviene in questo browser, senza limiti di dimensione.",
    pick: "Scegli un file",
    drop: "oppure trascinalo qui",
    formats: "EPUB, TXT, Markdown o HTML",
    selected: "File scelto:",
    output: "Formato di uscita",
    outputs: { epub: "EPUB (ebook)", html: "HTML (pagina web)", md: "Markdown" },
    options: "Come evidenziare",
    start: "Converti",
    progress: "Conversione: {n} %",
    cancel: "Annulla",
    cancelled: "Conversione annullata. Non è stato salvato nulla.",
    done: "Fatto. Il tuo file è pronto.",
    download: "Scarica {name}",
    errors: {
      unsupported:
        "Questo formato non si può convertire. Scegli un file EPUB, TXT, Markdown o HTML.",
      drm: "Questo libro ha il DRM (protezione dalla copia), quindi non si può convertire. Se l’hai acquistato, chiedi al negozio se può darti una copia senza DRM.",
      invalid:
        "Non è stato possibile leggere questo file. Controlla che si apra nel tuo lettore, oppure provane un altro.",
      failed:
        "La conversione non è riuscita ({detail}). Se succede di nuovo, faccelo sapere su GitHub.",
    },
    labels: { part: "Parte", contents: "Indice" },
    steps: {
      choose: "Scegli il tuo libro",
      adjust: "Regola l’aspetto",
      convert: "Converti e scarica",
    },
    previewTitle: "Come inizierà il tuo libro",
    previewEmpty: "Scegli un file e qui comparirà la sua prima pagina, con l’evidenziazione.",
    previewLoading: "Preparazione dell’anteprima…",
    previewNote:
      "Vista indicativa: ogni lettore mostra il libro con il proprio carattere e la propria dimensione.",
    previewNone: "Non è stato trovato testo all’inizio del file, ma puoi convertirlo lo stesso.",
    change: "Scegli un altro file",
    devices: {
      heading: "Come portarlo sul tuo lettore",
      items: [
        {
          name: "Kindle",
          text: "Usa Send to Kindle di Amazon (sito web, app o email) e scegli il file EPUB. Amazon lo adatta per il tuo Kindle.",
        },
        {
          name: "Kobo",
          text: "Collega il Kobo al computer con il cavo USB e copiaci l’EPUB. Espellilo e il libro comparirà nella tua libreria.",
        },
        {
          name: "PocketBook",
          text: "Copialo via USB, come con un Kobo, oppure invialo per email con il servizio Send-to-PocketBook.",
        },
      ],
      calibre:
        "Se usi Calibre, aggiungi il file alla tua libreria e invialo al lettore come qualsiasi altro libro.",
    },
  },
  pages: {
    privacy: {
      title: "Privacy",
      body: [
        "Non raccogliamo alcun dato. Nessuno.",
        "L’estensione, questo sito e il convertitore funzionano interamente sul tuo dispositivo. Ciò che leggi e i file che converti non vengono mai inviati da nessuna parte: non abbiamo server.",
        "Non usiamo statistiche, cookie, telemetria, né caratteri o script di altri siti.",
        "L’estensione salva le tue impostazioni (intensità, stile, siti in cui la vuoi sempre attiva) nella memoria del tuo browser. Se la sincronizzazione del browser è attiva, il browser può copiarle tra i tuoi dispositivi; noi non le vediamo mai.",
        "L’estensione chiede solo i permessi di cui ha bisogno. L’accesso a un sito specifico, o a tutti i siti, viene chiesto solo quando scegli «Sempre su questo sito» o «Su tutti i siti», e puoi revocarlo in qualsiasi momento.",
      ],
    },
    accessibility: {
      title: "Accessibilità",
      body: [
        "L’evidenziazione non cambia mai ciò che legge un lettore di schermo: il testo è esattamente lo stesso, carattere per carattere. Lo verifichiamo con test automatici, e con NVDA e VoiceOver prima di ogni versione.",
        "Tutto funziona anche solo con la tastiera. L’estensione si attiva e si disattiva con Alt+B, e puoi cambiare la scorciatoia nelle impostazioni del browser.",
        "I colori dell’evidenziazione derivano dal colore stesso del testo, quindi il contrasto resta buono in modalità chiara, in modalità scura e con il tema di ogni sito.",
        "Questo sito usa il carattere Atkinson Hyperlegible, pensato per distinguere bene le lettere, e rispetta le preferenze del tuo sistema per la modalità scura e la riduzione delle animazioni.",
        "Se incontri un ostacolo, apri una segnalazione su GitHub: è un bug, e lo tratteremo come tale.",
      ],
    },
  },
};
