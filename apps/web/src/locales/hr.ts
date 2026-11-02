import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Hrvatski";

export const slugs: Record<PageKey, string> = {
  uses: "za-koga",
  worksheets: "radni-listici",
  convert: "pretvori",
  privacy: "privatnost",
  accessibility: "pristupacnost",
};

export const strings: Strings = {
  meta: {
    description:
      "Besplatno pomagalo za čitanje otvorenog koda za osobe s ADHD-om i disleksijom: ističe početak svake riječi na webu i u tvojim e-knjigama. Sve ostaje na tvom uređaju.",
  },
  nav: {
    skip: "Preskoči na sadržaj",
    home: "Početna",
    convert: "Pretvori knjigu",
    privacy: "Privatnost",
    accessibility: "Pristupačnost",
    github: "Izvorni kod",
    language: "Jezik",
    theme: {
      label: "Tema",
      light: "svijetla",
      dark: "tamna",
    },
  },
  hero: {
    headline: "Čitaj na svoj način",
    lede: "Nježno ističe početak svake riječi kako bi pogled imao gdje stati. Za osobe s ADHD-om, disleksijom i za svakoga kome je tako ugodnije. Besplatno, bez računa i ništa nikad ne napušta tvoj uređaj.",
  },
  install: {
    chrome: "Dodaj u Chrome ili Edge",
    firefox: "Dodaj u Firefox",
    preview: "Još nije u trgovinama. U međuvremenu možeš instalirati probnu verziju s GitHuba.",
  },
  demo: {
    heading: "Isprobaj sa svojim tekstom",
    intro: "Zalijepi bilo koji tekst. Rezultat se mijenja odmah i nema ograničenja duljine.",
    input: "Tvoj tekst",
    output: "Kako se čita",
    sample:
      "Čitanje bi trebalo biti ugodno. Neki ljudi izgube mjesto u tekstu, preskaču riječi ili se umore prije kraja odlomka. Isticanje početka svake riječi daje pogledu sidro: isprobaj različite jačine i stilove dok ne pronađeš svoj.",
    strength: "Jačina",
    style: "Stil",
    styles: {
      "bold-fade": "Podebljano i prigušeno",
      bold: "Podebljano",
      color: "Boja",
      underline: "Podcrtano",
      fade: "Prigušen ostatak",
    },
    more: "Više opcija",
    every: "Istakni",
    everyOptions: ["Svaku riječ", "1 od svake 2 riječi", "1 od svake 3 riječi"],
    lineHeight: "Prored",
    maxWidth: "Najveća širina retka",
    pageDefault: "Uobičajeno",
    widths: ["Usko (50 znakova)", "Srednje (65 znakova)", "Široko (80 znakova)"],
  },
  privacy: {
    heading: "Ništa ne napušta tvoj uređaj",
    body: [
      "Proširenje, ova stranica i pretvarač knjiga rade u potpunosti u tvom pregledniku. Ne postoji poslužitelj kojem bi se išta slalo.",
      "Bez računa, bez analitike, bez kolačića i bez ograničenja korištenja.",
    ],
    more: "Pročitaj pravila privatnosti",
  },
  faq: {
    heading: "Pitanja",
    items: [
      {
        q: "Djeluje li to zaista?",
        a: [
          "Ovisi o osobi. Dosad objavljena istraživanja ne pokazuju da ljudi s ovakvim isticanjem u prosjeku čitaju brže ili bolje razumiju tekst.",
          "Ono što mnogi navode jest da im je čitanje ugodnije, da rjeđe izgube mjesto u tekstu ili da lakše počnu. Zato ne obećavamo brzinu: nudimo pomagalo koje možeš prilagoditi ili isključiti. Isprobaj demo i zadrži ono što ti pomaže.",
        ],
      },
      {
        q: "Košta li išta?",
        a: [
          "Ne, i nikad neće. Nema plaćene verzije, ograničenja broja riječi ni ograničenja veličine datoteke. To je slobodni softver pod licencom Apache-2.0.",
        ],
      },
      {
        q: "Mogu li ga koristiti sa svojim e-knjigama?",
        a: [
          "Da. U odjeljku „Pretvori knjigu” odabereš datoteku EPUB, TXT, Markdown ili HTML i preuzmeš kopiju s isticanjem. Pretvaranje se odvija u tvom pregledniku. Knjige s DRM-om ne mogu se pretvoriti.",
        ],
      },
      {
        q: "Radi li na svakom jeziku?",
        a: [
          "Na svim jezicima koji razdvajaju riječi razmacima, uključujući pisma koja se pišu zdesna nalijevo. Kineski, japanski, tajlandski i druga pisma bez razmaka ostaju nepromijenjeni.",
        ],
      },
      {
        q: "Što ako koristim čitač zaslona?",
        a: ["Tekst se čita točno kao prije: nijedan znak nije dodan ni uklonjen."],
      },
      {
        q: "Radi li na mobitelu?",
        a: ["Da, s Firefoxom za Android. Posebna aplikacija stići će kasnije."],
      },
    ],
  },
  footer: {
    license: "Slobodni softver pod licencom Apache-2.0.",
  },
  uses: {
    title: "Za koga je",
    intro:
      "Svatko čita na svoj način. Evo nekoliko načina korištenja, ovisno o tome tko si i za što ti treba. Svima je zajedničko jedno: to je neobavezno pomagalo koje možeš prilagoditi ili isključiti, a ne prikuplja nikakve podatke.",
    homeHeading: "Za koga je",
    how: "Kako ga koristiti",
    care: "Imaj na umu",
    cases: [
      {
        id: "education",
        title: "Obrazovanje",
        summary:
          "Za učiteljice i učitelje, škole i obitelji koji žele prilagoditi materijale za čitanje bez izrade novih.",
        link: "Ideje za razred i dom",
        lede: "Za učiteljice i učitelje, stručne suradnike i obitelji kojima je cilj da čitanje traži malo manje truda, bez pripreme drugačijeg materijala za svako dijete.",
        steps: [
          "Prilagodi materijal koji već imaš: pretvori tekstove, bilješke ili knjige u formatu EPUB, TXT, Markdown ili HTML i podijeli ih takve kakvi jesu.",
          "Na satu prikaži demo s današnjim tekstom na projektoru i zajedno isprobajte različite jačine i stilove. Neka svako dijete kaže što mu je najugodnije.",
          "Na školskim računalima proširenje radi bez računa i registracije te ne prikuplja nikakve podatke o djeci.",
          "Izradi radne listiće s velikim slovima i veselim okvirom u odjeljku „Radni listići”, pa ih ispiši ili spremi kao PDF.",
          "Kod kuće isto proširenje pomaže pri zadaći i čitanju na webu.",
        ],
        notes: [
          "To je neobavezno pomagalo: nekoj djeci pomaže, a nekoj ne. Neka svako dijete samo odabere i isključi ga ako želi.",
          "Ne zamjenjuje stručnu podršku u obrazovanju ni dijagnozu teškoća učenja.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopedija i druga stručna podrška",
        summary:
          "Jednostavan alat za isprobavanje na logopedskim, psihološkim i savjetodavnim susretima.",
        link: "Kako ga koristiti na susretima",
        lede: "Za stručnu podršku osobama s teškoćama čitanja: logopediju, edukacijsku psihologiju, savjetovanje i druga područja.",
        steps: [
          "Na susretu zalijepi tekst u demo i s osobom isprobaj nekoliko postavki. Zabilježi koja joj je najugodnija: jačina, stil, istaknute riječi, prored.",
          "Pripremi radni materijal pomoću pretvarača i podijeli ga na papiru, na zaslonu ili na e-čitaču.",
          "Preporuči proširenje za kućnu upotrebu, s postavkama koje ste zajedno odabrali.",
          "Sve se odvija na uređaju: nikakav tekst ni podaci o osobama s kojima radiš nikad ne prolaze kroz poslužitelj.",
        ],
        notes: [
          "To nije terapija ni metoda intervencije u čitanju. Može biti jedna od podrški u tvom radu.",
          "Istraživanja ne pokazuju prosječan dobitak u brzini ni razumijevanju. Predstavi ga kao pitanje udobnosti i osobnog izbora i procijeni svaki slučaj zasebno.",
        ],
      },
      {
        id: "adults",
        title: "Odrasli",
        summary:
          "Za one koji se žele vratiti čitanju, ali se ne mogu usredotočiti, gube mjesto u tekstu ili se brzo umore.",
        link: "Kako početi",
        lede: "Ako želiš više čitati, ali teško počinješ, gubiš mjesto u tekstu, istu rečenicu čitaš tri puta ili se umoriš već na drugoj stranici, ovo bi ti moglo pomoći. A ako ne pomogne, i to je u redu.",
        steps: [
          "Instaliraj proširenje i uključi ga s Alt+B na članku koji te zanima. Počni s kratkim tekstovima.",
          "Pretvori knjigu koju stvarno želiš pročitati i stavi je na e-čitač ili mobitel.",
          "Prilagođavaj jačinu dok ti ne bude ugodno. U „Više opcija” možeš povećati prored i suziti retke: mnogima to pomaže jednako kao isticanje.",
          "Ako te jednog dana umara, isključi ga. To je tvoj način čitanja, a ne pravilo.",
        ],
        notes: [
          "Ne djeluje kod svih, i to je u redu. Daj mu nekoliko dana prije nego što odlučiš.",
          "Ako misliš da iza tvojih teškoća stoji ADHD ili disleksija, razgovor sa stručnom osobom može pomoći.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Radni listići za čitanje",
    nav: "Radni listići",
    intro:
      "Izradi radne listiće s velikim slovima, istaknutim početkom svake riječi i veselim okvirom. Odaberi primjer teksta ili napiši svoj, pa ga ispiši ili preuzmi.",
    editor: "Prilagodi radni listić",
    example: "Odaberi tekst",
    titleLabel: "Naslov",
    textLabel: "Tekst",
    theme: "Okvir",
    themes: {
      none: "Bez okvira",
      simple: "Jednostavan",
      clouds: "Oblaci",
      garden: "Vrt",
      stars: "Zvijezde",
      vehicles: "Automobili i kamioni",
    },
    size: "Veličina teksta",
    sizes: ["Velika", "Vrlo velika", "Ogromna"],
    nameDate: "Dodaj ime i datum",
    name: "Ime",
    date: "Datum",
    lines: "Crte za pisanje",
    linesOptions: ["Bez crta", "3 crte", "6 crta", "10 crta"],
    preview: "Pregled",
    showPageSize: "Prikaži veličinu stranice",
    pageSizes: { portrait: "A4 uspravno (210 × 297 mm)", landscape: "A4 položeno (297 × 210 mm)" },
    pageN: "Stranica {n}",
    editHint:
      "Možeš pisati izravno na listiću: klikni naslov ili tekst. Isticanje se primjenjuje kad završiš.",
    editTitle: "Naslov radnog listića",
    editText: "Tekst radnog listića",
    print: "Ispiši ili spremi kao PDF",
    download: "Preuzmi radni listić",
    printHint:
      "Za spremanje kao PDF u dijalogu za ispis odaberi „Spremi kao PDF”. Ispisuje se na bijeloj pozadini radi uštede tinte.",
    downloadHint:
      "Preuzimaš web-stranicu koju možeš otvoriti i ispisati kad god želiš, čak i bez interneta.",
    fileName: "radni-listic",
    tabs: { text: "Tekst", layout: "Izgled", emphasis: "Isticanje" },
    myTexts: "Moji tekstovi",
    save: "Spremi u moje tekstove",
    saved: "Tekst „{title}” spremljen je u moje tekstove.",
    remove: "Ukloni iz mojih tekstova",
    removed: "Tekst „{title}” uklonjen je iz mojih tekstova.",
    exportTexts: "Izvezi moje tekstove",
    importTexts: "Uvezi tekstove",
    imported: "Uvezeni tekstovi: {n}.",
    importEmpty:
      "U toj datoteci nema tekstova. Koristi datoteku .md s naslovima „## ” ili datoteku .txt.",
    libraryNote:
      "Tvoji tekstovi spremaju se samo u ovom pregledniku. Izvezi ih da sačuvaš kopiju, podijeliš ih ili ih preneseš na drugo računalo.",
    exportHeading: "Moji tekstovi za radne listiće",
    levelKey: "Razina",
    textsFileName: "moji-tekstovi-za-listice",
    orientation: "Orijentacija",
    orientations: { portrait: "Uspravno", landscape: "Položeno" },
    overflow:
      "Radni listić prelazi na drugu stranicu. Da stane na jednu, skrati tekst, odaberi manju veličinu teksta ili ukloni crte.",
  },
  settings: {
    title: "Postavke čitanja",
    open: "Otvori postavke čitanja",
    close: "Zatvori",
    note: "Vrijede za demo, radne listiće i pretvarač, a spremaju se samo u ovom pregledniku.",
    presets: "Moje spremljene postavke",
    empty: "Još nema spremljenih postavki. Daj ime trenutačnima i vraćaj im se jednim klikom.",
    name: "Naziv",
    placeholder: "Na primjer: Čitanje na satu",
    save: "Spremi",
    apply: "Koristi postavke „{name}”",
    remove: "Izbriši „{name}”",
    saved: "Postavke „{name}” spremljene su.",
    removed: "Postavke „{name}” izbrisane su.",
    applied: "Sada se koriste postavke „{name}”.",
    reset: "Vrati zadane postavke",
    restored: "Zadane postavke vraćene su.",
  },
  convert: {
    title: "Pretvori knjigu",
    intro:
      "Odaberi knjigu ili dokument i preuzmi kopiju s isticanjem. Datoteka nikad ne napušta tvoj uređaj: sve se događa u ovom pregledniku, bez ograničenja veličine.",
    pick: "Odaberi datoteku",
    drop: "ili je ispusti ovdje",
    formats: "EPUB, TXT, Markdown ili HTML",
    selected: "Odabrana datoteka:",
    output: "Izlazni format",
    outputs: { epub: "EPUB (e-knjiga)", html: "HTML (web-stranica)", md: "Markdown" },
    options: "Kako istaknuti",
    start: "Pretvori",
    progress: "Pretvaranje: {n} %",
    cancel: "Odustani",
    cancelled: "Pretvaranje je otkazano. Ništa nije spremljeno.",
    done: "Gotovo. Tvoja datoteka je spremna.",
    download: "Preuzmi {name}",
    errors: {
      unsupported:
        "Ovaj format ne može se pretvoriti. Odaberi datoteku EPUB, TXT, Markdown ili HTML.",
      drm: "Ova knjiga ima DRM (zaštitu od kopiranja), pa se ne može pretvoriti. Ako je knjiga kupljena, pitaj trgovinu mogu li ti dati kopiju bez DRM-a.",
      invalid:
        "Ova datoteka nije se mogla pročitati. Provjeri otvara li se u tvom čitaču ili pokušaj s drugom.",
      failed: "Pretvaranje nije uspjelo ({detail}). Ako se ponovi, javi nam na GitHubu.",
    },
    labels: { part: "Dio", contents: "Sadržaj" },
    steps: {
      choose: "Odaberi knjigu",
      adjust: "Prilagodi izgled",
      convert: "Pretvori i preuzmi",
    },
    previewTitle: "Kako će počinjati tvoja knjiga",
    previewEmpty: "Odaberi datoteku i ovdje će se pojaviti njezina prva stranica s isticanjem.",
    previewLoading: "Priprema pregleda…",
    previewNote: "Približan prikaz: svaki čitač prikazuje knjigu vlastitim fontom i veličinom.",
    previewNone: "Na početku datoteke nije pronađen tekst, ali je svejedno možeš pretvoriti.",
    change: "Odaberi drugu datoteku",
    devices: {
      heading: "Kako je prebaciti na e-čitač",
      items: [
        {
          name: "Kindle",
          text: "Upotrijebi Amazonovu uslugu Send to Kindle (web-stranica, aplikacija ili e-pošta) i odaberi datoteku EPUB. Amazon će je prilagoditi za tvoj Kindle.",
        },
        {
          name: "Kobo",
          text: "Spoji Kobo s računalom USB kabelom i kopiraj EPUB na njega. Izbaci uređaj i knjiga će se pojaviti u tvojoj knjižnici.",
        },
        {
          name: "PocketBook",
          text: "Kopiraj je preko USB-a, kao i na Kobo, ili je pošalji e-poštom putem usluge Send-to-PocketBook.",
        },
      ],
      calibre:
        "Ako koristiš Calibre, dodaj datoteku u svoju knjižnicu i pošalji je na čitač kao i svaku drugu knjigu.",
    },
  },
  pages: {
    privacy: {
      title: "Privatnost",
      body: [
        "Ne prikupljamo nikakve podatke. Baš nikakve.",
        "Proširenje, ova web-stranica i pretvarač rade u potpunosti na tvom uređaju. Ono što čitaš i datoteke koje pretvaraš nikad se nikamo ne šalju: nemamo poslužitelje.",
        "Ne koristimo analitiku, kolačiće, telemetriju ni fontove i skripte s drugih web-mjesta.",
        "Proširenje sprema tvoje postavke (jačinu, stil, web-mjesta na kojima ga želiš uvijek uključeno) u spremište tvog preglednika. Ako je sinkronizacija preglednika uključena, preglednik ih može kopirati između tvojih uređaja; mi ih nikad ne vidimo.",
        "Proširenje traži samo dopuštenja koja su mu potrebna. Pristup određenom web-mjestu ili svim web-mjestima traži se tek kad odabereš „Uvijek na ovom web-mjestu” ili „Na svim web-mjestima”, a možeš ga opozvati u bilo kojem trenutku.",
      ],
    },
    accessibility: {
      title: "Pristupačnost",
      body: [
        "Isticanje nikad ne mijenja ono što čita čitač zaslona: tekst je potpuno isti, znak po znak. To provjeravamo automatiziranim testovima, a prije svakog izdanja i s NVDA-om i VoiceOverom.",
        "Sve radi samo s tipkovnicom. Proširenje se uključuje i isključuje s Alt+B, a prečac možeš promijeniti u postavkama preglednika.",
        "Boje isticanja izvode se iz boje samog teksta, pa kontrast ostaje dobar u svijetlom i tamnom načinu te u temi svakog web-mjesta.",
        "Ova web-stranica koristi font Atkinson Hyperlegible, osmišljen tako da se slova jasno razlikuju, i prati postavke tamnog načina i smanjenog kretanja tvog sustava.",
        "Ako naiđeš na prepreku, otvori prijavu (issue) na GitHubu: to je greška i tako ćemo je i tretirati.",
      ],
    },
  },
};
