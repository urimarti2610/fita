import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Nederlands";

export const slugs: Record<PageKey, string> = {
  uses: "voor-wie",
  worksheets: "werkbladen",
  convert: "omzetten",
  privacy: "privacy",
  accessibility: "toegankelijkheid",
};

export const strings: Strings = {
  meta: {
    description:
      "Gratis, open-source leeshulp voor mensen met ADHD en dyslexie: laat het begin van elk woord opvallen, op het web en in je e-books. Alles blijft op je eigen apparaat.",
  },
  nav: {
    skip: "Naar de inhoud",
    home: "Home",
    convert: "Boek omzetten",
    privacy: "Privacy",
    accessibility: "Toegankelijkheid",
    github: "Broncode",
    language: "Taal",
    theme: {
      label: "Thema",
      light: "licht",
      dark: "donker",
    },
  },
  hero: {
    headline: "Lees op jouw manier",
    lede: "Laat het begin van elk woord rustig opvallen, zodat je ogen een houvast hebben. Voor mensen met ADHD, dyslexie of iedereen die het zo prettiger vindt. Gratis, zonder account, en er gaat nooit iets van je apparaat af.",
  },
  install: {
    chrome: "Toevoegen aan Chrome of Edge",
    firefox: "Toevoegen aan Firefox",
    preview:
      "Nog niet te vinden in de stores. Intussen kun je de testversie installeren vanaf GitHub.",
  },
  demo: {
    heading: "Probeer het met je eigen tekst",
    intro:
      "Plak een willekeurige tekst. Het resultaat verandert meteen, en er is geen maximale lengte.",
    input: "Jouw tekst",
    output: "Zo leest het",
    sample:
      "Lezen moet prettig voelen. Sommige mensen raken de regel kwijt, slaan woorden over of worden moe voor het einde van een alinea. Als het begin van elk woord gemarkeerd is, hebben je ogen een ankerpunt: probeer verschillende sterktes en stijlen tot je de jouwe vindt.",
    strength: "Sterkte",
    style: "Stijl",
    styles: {
      "bold-fade": "Vet en vervaagd",
      bold: "Vet",
      color: "Kleur",
      underline: "Onderstreept",
      fade: "Rest vervagen",
    },
    more: "Meer opties",
    every: "Benadrukken",
    everyOptions: ["Elk woord", "1 op de 2 woorden", "1 op de 3 woorden"],
    lineHeight: "Regelafstand",
    maxWidth: "Maximale regelbreedte",
    pageDefault: "Normaal",
    widths: ["Smal (50 tekens)", "Gemiddeld (65 tekens)", "Breed (80 tekens)"],
  },
  privacy: {
    heading: "Er gaat niets van je apparaat af",
    body: [
      "De extensie, deze pagina en de boekomzetter werken volledig in je browser. Er is geen server waar iets naartoe kan.",
      "Geen accounts, geen analytics, geen cookies en geen gebruikslimieten.",
    ],
    more: "Lees het privacybeleid",
  },
  faq: {
    heading: "Vragen",
    items: [
      {
        q: "Werkt het echt?",
        a: [
          "Dat verschilt per persoon. Uit de studies die tot nu toe zijn gepubliceerd blijkt niet dat mensen met dit soort nadruk gemiddeld sneller lezen of meer begrijpen.",
          "Wat veel mensen wel zeggen, is dat lezen prettiger voelt, dat ze de regel minder vaak kwijtraken of dat ze makkelijker op gang komen. Daarom beloven we geen snelheid: we bieden een hulpmiddel dat je kunt aanpassen of uitzetten. Probeer de demo en houd wat je helpt.",
        ],
      },
      {
        q: "Kost het iets?",
        a: [
          "Nee, en dat blijft zo. Geen betaalde versie, geen woordlimiet, geen limiet op bestandsgrootte. Het is vrije software onder de Apache-2.0-licentie.",
        ],
      },
      {
        q: "Kan ik het gebruiken met mijn e-books?",
        a: [
          "Ja. Bij “Boek omzetten” kies je een EPUB-, TXT-, Markdown- of HTML-bestand en download je een kopie met nadruk. Het omzetten gebeurt in je browser. Boeken met DRM kunnen niet worden omgezet.",
        ],
      },
      {
        q: "Werkt het in elke taal?",
        a: [
          "In elke taal die woorden scheidt met spaties, ook schriften die van rechts naar links lopen. Chinees, Japans, Thai en andere schriften zonder spaties blijven zoals ze zijn.",
        ],
      },
      {
        q: "En als ik een schermlezer gebruik?",
        a: [
          "De tekst wordt precies zo voorgelezen als eerst: er worden geen tekens toegevoegd of weggehaald.",
        ],
      },
      {
        q: "Werkt het op mijn telefoon?",
        a: ["Ja, met Firefox voor Android. Een eigen app komt later."],
      },
    ],
  },
  footer: {
    license: "Vrije software onder de Apache-2.0-licentie.",
  },
  uses: {
    title: "Voor wie",
    intro:
      "Iedereen leest op een eigen manier. Hier vind je een paar manieren om het hulpmiddel te gebruiken, afhankelijk van wie je bent en waarvoor je het nodig hebt. Ze hebben één ding gemeen: het is een hulpmiddel dat je zelf kiest, dat je kunt aanpassen of uitzetten, en het verzamelt geen gegevens.",
    homeHeading: "Voor wie",
    how: "Hoe gebruik je het",
    care: "Goed om te weten",
    cases: [
      {
        id: "education",
        title: "Onderwijs",
        summary:
          "Voor leerkrachten, scholen en gezinnen die leesmateriaal willen aanpassen zonder nieuw materiaal te maken.",
        link: "Ideeën voor de klas en thuis",
        lede: "Voor leerkrachten, intern begeleiders, remedial teachers en gezinnen die willen dat lezen wat minder moeite kost, zonder voor elke leerling apart materiaal voor te bereiden.",
        steps: [
          "Pas het materiaal aan dat je al hebt: zet leesteksten, aantekeningen of boeken in EPUB, TXT, Markdown of HTML om en deel ze zoals ze zijn.",
          "Laat in de klas de demo zien met de tekst van de dag en probeer samen verschillende sterktes en stijlen. Laat elke leerling zeggen wat het prettigst voelt.",
          "Op schoolcomputers werkt de extensie zonder accounts of aanmelden, en ze verzamelt geen gegevens van leerlingen.",
          "Maak bij “Werkbladen” leesbladen met grote letters en een vrolijke rand, en print ze of bewaar ze als pdf.",
          "Thuis helpt dezelfde extensie bij huiswerk en bij lezen op het web.",
        ],
        notes: [
          "Het is een hulpmiddel dat je zelf kiest: het helpt sommige leerlingen wel en andere niet. Laat iedereen zelf kiezen, en het uitzetten als ze dat willen.",
          "Het vervangt geen begeleiding en geen diagnose van leerproblemen.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopedisten en andere professionals",
        summary:
          "Voor logopedisten, orthopedagogen en begeleiders die een eenvoudig hulpmiddel zoeken om in sessies uit te proberen.",
        link: "Zo gebruik je het in sessies",
        lede: "Voor logopedisten, orthopedagogen, begeleiders en andere professionals die mensen met leesproblemen ondersteunen.",
        steps: [
          "Plak tijdens een sessie een tekst in de demo en probeer samen een paar instellingen. Noteer wat het prettigst voelt: sterkte, stijl, benadrukte woorden, regelafstand.",
          "Maak werkmateriaal klaar met de omzetter en geef het mee op papier, op een scherm of op een e-reader.",
          "Raad de extensie aan voor thuis, met de instellingen die jullie samen hebben gekozen.",
          "Alles draait op het apparaat: er gaat nooit tekst of cliëntgegevens via een server.",
        ],
        notes: [
          "Het is geen behandeling en geen leesinterventiemethode. Het kan één ondersteuning zijn binnen je werk.",
          "Studies laten gemiddeld geen winst in snelheid of begrip zien. Breng het als een kwestie van comfort en voorkeur, en bekijk het per persoon.",
        ],
      },
      {
        id: "adults",
        title: "Volwassenen",
        summary:
          "Voor mensen die weer willen lezen maar zich niet kunnen concentreren, de regel kwijtraken of snel moe worden.",
        link: "Zo begin je",
        lede: "Als je meer wilt lezen maar moeilijk begint, de regel kwijtraakt, dezelfde zin drie keer leest of op bladzijde twee al moe bent, kan dit helpen. En als het niet helpt, is dat ook goed.",
        steps: [
          "Installeer de extensie en zet haar aan met Alt+B bij een artikel dat je interesseert. Begin met korte teksten.",
          "Zet een boek om dat je echt wilt lezen en zet het op je e-reader of telefoon.",
          "Stel de sterkte in tot het prettig voelt. Bij “Meer opties” kun je meer regelafstand kiezen en de regels smaller maken: voor veel mensen helpt dat net zoveel als de nadruk.",
          "Word je er op een dag moe van, zet het dan uit. Het is jouw manier van lezen, geen regel.",
        ],
        notes: [
          "Het werkt niet voor iedereen, en dat is prima. Geef het een paar dagen voor je beslist.",
          "Denk je dat ADHD of dyslexie achter je moeite kan zitten, dan kan een gesprek met een professional helpen.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Leeswerkbladen",
    nav: "Werkbladen",
    intro:
      "Maak werkbladen met grote letters, het begin van elk woord benadrukt en een vrolijke rand. Kies een voorbeeldtekst of schrijf je eigen tekst, en print of download het werkblad.",
    editor: "Werkblad aanpassen",
    example: "Kies een tekst",
    titleLabel: "Titel",
    textLabel: "Tekst",
    theme: "Rand",
    themes: {
      none: "Geen rand",
      simple: "Eenvoudig",
      clouds: "Wolken",
      garden: "Tuin",
      stars: "Sterren",
      vehicles: "Auto's en vrachtwagens",
    },
    size: "Tekstgrootte",
    sizes: ["Groot", "Heel groot", "Enorm"],
    nameDate: "Naam en datum toevoegen",
    name: "Naam",
    date: "Datum",
    lines: "Schrijflijnen",
    linesOptions: ["Geen", "3 lijnen", "6 lijnen", "10 lijnen"],
    preview: "Voorbeeld",
    showPageSize: "Paginaformaat tonen",
    pageSizes: { portrait: "A4 staand (210 × 297 mm)", landscape: "A4 liggend (297 × 210 mm)" },
    pageN: "Pagina {n}",
    editHint:
      "Je kunt direct op het werkblad typen: klik op de titel of de tekst. De nadruk wordt toegepast als je klaar bent.",
    editTitle: "Titel van het werkblad",
    editText: "Tekst van het werkblad",
    print: "Printen of als pdf bewaren",
    download: "Werkblad downloaden",
    printHint:
      "Kies in het printvenster “Opslaan als PDF” om het als pdf te bewaren. Het wordt op een witte achtergrond geprint om inkt te sparen.",
    downloadHint:
      "Je downloadt een webpagina die je altijd kunt openen en printen, ook zonder internet.",
    fileName: "werkblad",
    tabs: { text: "Tekst", layout: "Opmaak", emphasis: "Nadruk" },
    myTexts: "Mijn teksten",
    save: "Bewaren in mijn teksten",
    saved: "“{title}” is bewaard in mijn teksten.",
    remove: "Verwijderen uit mijn teksten",
    removed: "“{title}” is verwijderd uit mijn teksten.",
    exportTexts: "Mijn teksten exporteren",
    importTexts: "Teksten importeren",
    imported: "Geïmporteerde teksten: {n}.",
    importEmpty:
      "Er staan geen teksten in dat bestand. Gebruik een .md-bestand met titels die beginnen met “## ”, of een .txt-bestand.",
    libraryNote:
      "Je teksten worden alleen in deze browser bewaard. Exporteer ze om een kopie te houden, ze te delen of ze naar een andere computer te verhuizen.",
    exportHeading: "Mijn teksten voor werkbladen",
    levelKey: "Niveau",
    textsFileName: "mijn-werkbladteksten",
    orientation: "Richting",
    orientations: { portrait: "Staand", landscape: "Liggend" },
    overflow:
      "Het werkblad loopt door op een tweede pagina. Wil je het op één pagina, maak de tekst dan korter, kies een kleinere tekstgrootte of haal lijnen weg.",
  },
  settings: {
    title: "Leesinstellingen",
    open: "Leesinstellingen openen",
    close: "Sluiten",
    note: "Ze gelden voor de demo, de werkbladen en de omzetter, en worden alleen in deze browser bewaard.",
    presets: "Mijn bewaarde instellingen",
    empty:
      "Je hebt nog geen instellingen bewaard. Geef de huidige een naam om er met één klik naar terug te gaan.",
    name: "Naam",
    placeholder: "Bijvoorbeeld: Lezen in de klas",
    save: "Bewaren",
    apply: "Instellingen “{name}” gebruiken",
    remove: "“{name}” verwijderen",
    saved: "Instellingen “{name}” bewaard.",
    removed: "“{name}” is verwijderd.",
    applied: "Je gebruikt nu “{name}”.",
    reset: "Terug naar de standaardinstellingen",
    restored: "Standaardinstellingen hersteld.",
  },
  convert: {
    title: "Boek omzetten",
    intro:
      "Kies een boek of document en download een kopie met nadruk. Het bestand verlaat nooit je apparaat: alles gebeurt in deze browser, zonder limiet op de grootte.",
    pick: "Kies een bestand",
    drop: "of sleep het hierheen",
    formats: "EPUB, TXT, Markdown of HTML",
    selected: "Gekozen bestand:",
    output: "Uitvoerformaat",
    outputs: { epub: "EPUB (e-book)", html: "HTML (webpagina)", md: "Markdown" },
    options: "Hoe benadrukken",
    start: "Omzetten",
    progress: "Bezig met omzetten: {n} %",
    cancel: "Annuleren",
    cancelled: "Omzetten geannuleerd. Er is niets bewaard.",
    done: "Klaar. Je bestand staat klaar.",
    download: "{name} downloaden",
    errors: {
      unsupported:
        "Dit formaat kan niet worden omgezet. Kies een EPUB-, TXT-, Markdown- of HTML-bestand.",
      drm: "Dit boek heeft DRM (kopieerbeveiliging) en kan daarom niet worden omgezet. Heb je het gekocht, vraag dan aan de winkel of je een kopie zonder DRM kunt krijgen.",
      invalid:
        "Dit bestand kon niet worden gelezen. Kijk of het opent in je e-reader, of probeer een ander bestand.",
      failed:
        "Het omzetten is mislukt ({detail}). Gebeurt het nog eens, laat het ons dan weten op GitHub.",
    },
    labels: { part: "Deel", contents: "Inhoud" },
    steps: {
      choose: "Kies je boek",
      adjust: "Pas aan hoe het eruitziet",
      convert: "Omzetten en downloaden",
    },
    previewTitle: "Zo begint je boek",
    previewEmpty: "Kies een bestand, dan verschijnt hier de eerste pagina, met nadruk.",
    previewLoading: "Voorbeeld wordt klaargemaakt…",
    previewNote: "Ongeveer zo: elke e-reader toont het boek met een eigen lettertype en grootte.",
    previewNone:
      "Aan het begin van het bestand is geen tekst gevonden, maar je kunt het toch omzetten.",
    change: "Kies een ander bestand",
    devices: {
      heading: "Zo zet je het op je e-reader",
      items: [
        {
          name: "Kindle",
          text: "Gebruik Send to Kindle van Amazon (website, app of e-mail) en kies het EPUB-bestand. Amazon past het aan voor je Kindle.",
        },
        {
          name: "Kobo",
          text: "Sluit je Kobo met de USB-kabel aan op je computer en kopieer het EPUB-bestand erop. Werp hem uit en het boek staat in je bibliotheek.",
        },
        {
          name: "PocketBook",
          text: "Kopieer het via USB, zoals bij een Kobo, of mail het met de dienst Send-to-PocketBook.",
        },
      ],
      calibre:
        "Gebruik je Calibre, voeg het bestand dan toe aan je bibliotheek en stuur het naar je e-reader zoals elk ander boek.",
    },
  },
  pages: {
    privacy: {
      title: "Privacy",
      body: [
        "We verzamelen geen gegevens. Helemaal geen.",
        "De extensie, deze website en de omzetter werken volledig op je eigen apparaat. Wat je leest en de bestanden die je omzet worden nergens naartoe gestuurd: we hebben geen servers.",
        "We gebruiken geen analytics, cookies, telemetrie, of lettertypen en scripts van andere websites.",
        "De extensie bewaart je instellingen (sterkte, stijl, websites waar je haar altijd aan wilt) in de opslag van je eigen browser. Staat browsersynchronisatie aan, dan kan je browser ze kopiëren tussen je apparaten; wij zien ze nooit.",
        "De extensie vraagt alleen de toestemmingen die ze nodig heeft. Toegang tot een bepaalde website, of tot alle websites, wordt pas gevraagd als je “Altijd op deze website” of “Op alle websites” kiest, en je kunt die op elk moment intrekken.",
      ],
    },
    accessibility: {
      title: "Toegankelijkheid",
      body: [
        "De nadruk verandert nooit wat een schermlezer voorleest: de tekst is precies hetzelfde, teken voor teken. We controleren dat met automatische tests, en voor elke release met NVDA en VoiceOver.",
        "Alles werkt met alleen het toetsenbord. De extensie zet je aan en uit met Alt+B, en je kunt de sneltoets wijzigen in de instellingen van je browser.",
        "De kleuren van de nadruk worden afgeleid van de kleur van de tekst zelf, zodat het contrast goed blijft in de lichte modus, de donkere modus en het thema van elke website.",
        "Deze website gebruikt het lettertype Atkinson Hyperlegible, ontworpen om letters duidelijk uit elkaar te houden, en volgt de instellingen van je systeem voor donkere modus en minder beweging.",
        "Loop je tegen een drempel aan, open dan een issue op GitHub: het is een bug, en we behandelen het ook zo.",
      ],
    },
  },
};
