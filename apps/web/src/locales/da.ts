import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Dansk";

export const slugs: Record<PageKey, string> = {
  uses: "hvem-er-det-til",
  worksheets: "laeseark",
  convert: "konverter",
  privacy: "privatliv",
  accessibility: "tilgaengelighed",
};

export const strings: Strings = {
  meta: {
    description:
      "Gratis læsehjælp med åben kildekode til mennesker med ADHD og ordblindhed: fremhæver starten af hvert ord på nettet og i dine e-bøger. Alt bliver på din enhed.",
  },
  nav: {
    skip: "Gå til indhold",
    home: "Forside",
    convert: "Konverter en bog",
    privacy: "Privatliv",
    accessibility: "Tilgængelighed",
    github: "Kildekode",
    language: "Sprog",
    theme: {
      label: "Tema",
      light: "lyst",
      dark: "mørkt",
    },
  },
  hero: {
    headline: "Læs på din måde",
    lede: "Fremhæver blidt starten af hvert ord, så øjnene har et sted at lande. Til mennesker med ADHD, ordblindhed eller alle, der synes, det er mere behageligt. Gratis, uden konto, og intet forlader nogensinde din enhed.",
  },
  install: {
    chrome: "Føj til Chrome eller Edge",
    firefox: "Føj til Firefox",
    preview:
      "Den er ikke i butikkerne endnu. Indtil da kan du installere testversionen fra GitHub.",
  },
  demo: {
    heading: "Prøv med din egen tekst",
    intro:
      "Indsæt en hvilken som helst tekst. Resultatet opdateres med det samme, og der er ingen længdegrænse.",
    input: "Din tekst",
    output: "Sådan læses den",
    sample:
      "Det skal være behageligt at læse. Nogle mister stedet, springer ord over eller bliver trætte, før afsnittet er slut. Når starten af hvert ord er markeret, får øjnene et ankerpunkt: prøv forskellige styrker og stilarter, indtil du finder din.",
    strength: "Styrke",
    style: "Stil",
    styles: {
      "bold-fade": "Fed og nedtonet",
      bold: "Fed",
      color: "Farve",
      underline: "Understreget",
      fade: "Nedton resten",
    },
    more: "Flere indstillinger",
    every: "Fremhæv",
    everyOptions: ["Hvert ord", "Hvert 2. ord", "Hvert 3. ord"],
    lineHeight: "Linjeafstand",
    maxWidth: "Største linjebredde",
    pageDefault: "Normal",
    widths: ["Smal (50 tegn)", "Mellem (65 tegn)", "Bred (80 tegn)"],
  },
  privacy: {
    heading: "Intet forlader din enhed",
    body: [
      "Udvidelsen, denne side og bogkonverteren kører helt i din browser. Der er ingen server at sende noget til.",
      "Ingen konti, ingen analyse, ingen cookies og ingen grænser for brug.",
    ],
    more: "Læs privatlivspolitikken",
  },
  faq: {
    heading: "Spørgsmål",
    items: [
      {
        q: "Virker det virkelig?",
        a: [
          "Det afhænger af personen. De undersøgelser, der er offentliggjort indtil nu, viser ikke, at folk i gennemsnit læser hurtigere eller forstår mere med denne slags fremhævning.",
          "Men mange fortæller, at læsningen føles mere behagelig, at de mister stedet sjældnere, eller at det er lettere at komme i gang. Derfor lover vi ikke fart: vi tilbyder en hjælp, du kan justere eller slå fra. Prøv demoen, og behold det, der hjælper.",
        ],
      },
      {
        q: "Koster det noget?",
        a: [
          "Nej, og det kommer det aldrig til. Ingen betalingsversion, ingen ordgrænse, ingen grænse for filstørrelse. Det er fri software under Apache-2.0-licensen.",
        ],
      },
      {
        q: "Kan jeg bruge det med mine e-bøger?",
        a: [
          "Ja. Under ”Konverter en bog” vælger du en EPUB-, TXT-, Markdown- eller HTML-fil og downloader en kopi med fremhævning. Konverteringen sker i din browser. Bøger med DRM kan ikke konverteres.",
        ],
      },
      {
        q: "Virker det på alle sprog?",
        a: [
          "På alle sprog, der adskiller ord med mellemrum, også skriftsystemer, der læses fra højre mod venstre. Kinesisk, japansk, thai og andre skriftsystemer uden mellemrum bliver ikke ændret.",
        ],
      },
      {
        q: "Hvad hvis jeg bruger en skærmlæser?",
        a: ["Teksten læses præcis som før: der bliver ikke tilføjet eller fjernet nogen tegn."],
      },
      {
        q: "Virker det på min telefon?",
        a: ["Ja, med Firefox til Android. En selvstændig app kommer senere."],
      },
    ],
  },
  footer: {
    license: "Fri software under Apache-2.0-licensen.",
  },
  uses: {
    title: "Hvem er det til",
    intro:
      "Alle læser på deres egen måde. Her er nogle måder at bruge værktøjet på, alt efter hvem du er, og hvad du skal bruge det til. De har én ting til fælles: det er en valgfri hjælp, som du kan justere eller slå fra, og den indsamler ingen data.",
    homeHeading: "Hvem er det til",
    how: "Sådan bruger du det",
    care: "Godt at vide",
    cases: [
      {
        id: "education",
        title: "Undervisning",
        summary:
          "Til lærere, skoler og familier, der vil tilpasse læsestof uden at lave nyt materiale.",
        link: "Idéer til klassen og hjemmet",
        lede: "Til lærere, læsevejledere, støttepersoner og familier, der gerne vil gøre læsning lidt mindre anstrengende uden at forberede særskilt materiale til hver elev.",
        steps: [
          "Tilpas det materiale, du allerede har: konverter tekster, noter eller bøger i EPUB, TXT, Markdown eller HTML, og del dem, som de er.",
          "Vis demoen i klassen med dagens tekst, og prøv forskellige styrker og stilarter sammen. Lad hver elev sige, hvad der føles mest behageligt.",
          "På skolens computere virker udvidelsen uden konti eller tilmelding og indsamler ingen data om eleverne.",
          "Lav læseark med stor skrift og en venlig ramme under ”Læseark”, og print dem eller gem dem som PDF.",
          "Derhjemme hjælper den samme udvidelse med lektier og læsning på nettet.",
        ],
        notes: [
          "Det er en valgfri hjælp: den hjælper nogle elever og ikke andre. Lad hver enkelt vælge, og slå den fra, hvis de vil.",
          "Den erstatter ikke pædagogisk støtte eller udredning af læsevanskeligheder.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Talepædagoger og andre fagfolk",
        summary:
          "Til talepædagoger, skolepsykologer og vejledere, der leder efter et enkelt værktøj at prøve i deres sessioner.",
        link: "Sådan bruger du det i sessioner",
        lede: "Til talepædagoger, skolepsykologer, vejledere og andre fagfolk, der støtter mennesker med læsevanskeligheder.",
        steps: [
          "Indsæt en tekst i demoen under en session, og prøv flere indstillinger sammen med personen. Notér, hvad der føles mest behageligt: styrke, stil, fremhævede ord, linjeafstand.",
          "Forbered arbejdsmateriale med konverteren, og del det på papir, på skærm eller på en e-bogslæser.",
          "Anbefal udvidelsen til brug derhjemme med de indstillinger, I har valgt sammen.",
          "Alt kører på enheden: ingen tekst eller data om klienter går nogensinde gennem en server.",
        ],
        notes: [
          "Det er ikke en behandling eller en læseinterventionsmetode. Det kan være én støtte i dit arbejde.",
          "Undersøgelser viser ikke en gennemsnitlig gevinst i fart eller forståelse. Præsentér det som et spørgsmål om komfort og præference, og vurder det fra person til person.",
        ],
      },
      {
        id: "adults",
        title: "Voksne",
        summary:
          "Til dem, der gerne vil i gang med at læse igen, men har svært ved at koncentrere sig, mister stedet eller hurtigt bliver trætte.",
        link: "Sådan kommer du i gang",
        lede: "Hvis du gerne vil læse mere, men har svært ved at komme i gang, mister stedet, læser den samme sætning tre gange eller er træt allerede på side to, kan det her måske hjælpe. Og hvis ikke, er det helt fint.",
        steps: [
          "Installer udvidelsen, og slå den til med Alt+B på en artikel, du interesserer dig for. Start med korte tekster.",
          "Konverter en bog, du virkelig har lyst til at læse, og læg den på din e-bogslæser eller telefon.",
          "Justér styrken, til det føles behageligt. Under ”Flere indstillinger” kan du øge linjeafstanden og gøre linjerne smallere: for mange hjælper det lige så meget som fremhævningen.",
          "Hvis det trætter dig en dag, så slå det fra. Det er din måde at læse på, ikke en regel.",
        ],
        notes: [
          "Det virker ikke for alle, og det er helt i orden. Giv det et par dage, før du beslutter dig.",
          "Hvis du tror, at ADHD eller ordblindhed kan ligge bag dine vanskeligheder, kan det hjælpe at tale med en fagperson.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Læseark",
    nav: "Læseark",
    intro:
      "Lav læseark med stor skrift, fremhævet start på hvert ord og en venlig ramme. Vælg en eksempeltekst eller skriv din egen, og print eller download arket.",
    editor: "Tilpas arket",
    example: "Vælg en tekst",
    titleLabel: "Titel",
    textLabel: "Tekst",
    theme: "Ramme",
    themes: {
      none: "Ingen ramme",
      simple: "Enkel",
      clouds: "Skyer",
      garden: "Have",
      stars: "Stjerner",
      vehicles: "Biler og lastbiler",
    },
    size: "Tekststørrelse",
    sizes: ["Stor", "Meget stor", "Kæmpestor"],
    nameDate: "Tilføj navn og dato",
    name: "Navn",
    date: "Dato",
    lines: "Skrivelinjer",
    linesOptions: ["Ingen", "3 linjer", "6 linjer", "10 linjer"],
    preview: "Forhåndsvisning",
    showPageSize: "Vis sidestørrelse",
    pageSizes: { portrait: "A4 stående (210 × 297 mm)", landscape: "A4 liggende (297 × 210 mm)" },
    pageN: "Side {n}",
    editHint:
      "Du kan skrive direkte på arket: klik på titlen eller teksten. Fremhævningen bliver lagt på, når du er færdig.",
    editTitle: "Arkets titel",
    editText: "Arkets tekst",
    print: "Print eller gem som PDF",
    download: "Download arket",
    printHint:
      "Vælg ”Gem som PDF” i printdialogen for at gemme det som PDF. Det printes på hvid baggrund for at spare blæk.",
    downloadHint:
      "Det, du downloader, er en webside, som du kan åbne og printe når som helst, også uden internet.",
    fileName: "laeseark",
    tabs: { text: "Tekst", layout: "Layout", emphasis: "Fremhævning" },
    myTexts: "Mine tekster",
    save: "Gem i mine tekster",
    saved: "”{title}” er gemt i mine tekster.",
    remove: "Fjern fra mine tekster",
    removed: "”{title}” er fjernet fra mine tekster.",
    exportTexts: "Eksportér mine tekster",
    importTexts: "Importér tekster",
    imported: "Importerede tekster: {n}.",
    importEmpty:
      "Der er ingen tekster i den fil. Brug en .md-fil med titler, der starter med ”## ”, eller en .txt-fil.",
    libraryNote:
      "Dine tekster gemmes kun i denne browser. Eksportér dem for at beholde en kopi, dele dem eller flytte dem til en anden computer.",
    exportHeading: "Mine tekster til læseark",
    levelKey: "Niveau",
    textsFileName: "mine-tekster-til-laeseark",
    orientation: "Retning",
    orientations: { portrait: "Stående", landscape: "Liggende" },
    overflow:
      "Arket fortsætter på en side mere. Hvis det skal være på én side, så forkort teksten, vælg en mindre tekststørrelse eller fjern linjer.",
  },
  settings: {
    title: "Læseindstillinger",
    open: "Åbn læseindstillinger",
    close: "Luk",
    note: "De gælder for demoen, læsearkene og konverteren og gemmes kun i denne browser.",
    presets: "Mine gemte indstillinger",
    empty:
      "Du har ikke gemt nogen indstillinger endnu. Giv de nuværende et navn, så du kan vende tilbage til dem med ét klik.",
    name: "Navn",
    placeholder: "For eksempel: Læsning i klassen",
    save: "Gem",
    apply: "Brug indstillingerne ”{name}”",
    remove: "Slet ”{name}”",
    saved: "Indstillingerne ”{name}” er gemt.",
    removed: "”{name}” er slettet.",
    applied: "Bruger nu ”{name}”.",
    reset: "Tilbage til standardindstillingerne",
    restored: "Standardindstillingerne er gendannet.",
  },
  convert: {
    title: "Konverter en bog",
    intro:
      "Vælg en bog eller et dokument, og download en kopi med fremhævning. Filen forlader aldrig din enhed: alt sker i denne browser, uden grænse for størrelsen.",
    pick: "Vælg en fil",
    drop: "eller slip den her",
    formats: "EPUB, TXT, Markdown eller HTML",
    selected: "Valgt fil:",
    output: "Outputformat",
    outputs: { epub: "EPUB (e-bog)", html: "HTML (webside)", md: "Markdown" },
    options: "Sådan fremhæves",
    start: "Konverter",
    progress: "Konverterer: {n} %",
    cancel: "Annuller",
    cancelled: "Konverteringen er annulleret. Intet blev gemt.",
    done: "Færdig. Din fil er klar.",
    download: "Download {name}",
    errors: {
      unsupported:
        "Dette format kan ikke konverteres. Vælg en EPUB-, TXT-, Markdown- eller HTML-fil.",
      drm: "Denne bog har DRM (kopibeskyttelse), så den kan ikke konverteres. Hvis du har købt den, så spørg butikken, om du kan få en kopi uden DRM.",
      invalid: "Filen kunne ikke læses. Tjek, at den kan åbnes i din læser, eller prøv en anden.",
      failed:
        "Konverteringen mislykkedes ({detail}). Hvis det sker igen, så fortæl os det gerne på GitHub.",
    },
    labels: { part: "Del", contents: "Indhold" },
    steps: {
      choose: "Vælg din bog",
      adjust: "Tilpas udseendet",
      convert: "Konverter og download",
    },
    previewTitle: "Sådan begynder din bog",
    previewEmpty: "Vælg en fil, så vises dens første side her med fremhævning.",
    previewLoading: "Forbereder forhåndsvisningen …",
    previewNote: "Omtrentlig visning: hver læser viser bogen med sin egen skrifttype og størrelse.",
    previewNone: "Der blev ikke fundet tekst i starten af filen, men du kan stadig konvertere den.",
    change: "Vælg en anden fil",
    devices: {
      heading: "Sådan får du den over på din læser",
      items: [
        {
          name: "Kindle",
          text: "Brug Amazons Send to Kindle (websted, app eller e-mail), og vælg EPUB-filen. Amazon tilpasser den til din Kindle.",
        },
        {
          name: "Kobo",
          text: "Slut din Kobo til computeren med USB-kablet, og kopiér EPUB-filen over på den. Skub den ud, så dukker bogen op i dit bibliotek.",
        },
        {
          name: "PocketBook",
          text: "Kopiér den via USB som på en Kobo, eller send den med e-mail via tjenesten Send-to-PocketBook.",
        },
      ],
      calibre:
        "Hvis du bruger Calibre, så føj filen til dit bibliotek, og send den til din læser som enhver anden bog.",
    },
  },
  pages: {
    privacy: {
      title: "Privatliv",
      body: [
        "Vi indsamler ingen data. Slet ingen.",
        "Udvidelsen, dette websted og konverteren kører helt på din enhed. Det, du læser, og de filer, du konverterer, sendes aldrig nogen steder hen: vi har ingen servere.",
        "Vi bruger ingen analyse, cookies, telemetri eller skrifttyper og scripts fra andre websteder.",
        "Udvidelsen gemmer dine indstillinger (styrke, stil, websteder hvor den altid skal være slået til) i din egen browsers lager. Hvis browsersynkronisering er slået til, kan din browser kopiere dem mellem dine enheder; vi ser dem aldrig.",
        "Udvidelsen beder kun om de tilladelser, den har brug for. Adgang til et bestemt websted eller til alle websteder bliver først bedt om, når du vælger ”Altid på dette websted” eller ”På alle websteder”, og du kan altid trække den tilbage.",
      ],
    },
    accessibility: {
      title: "Tilgængelighed",
      body: [
        "Fremhævningen ændrer aldrig, hvad en skærmlæser læser op: teksten er præcis den samme, tegn for tegn. Det tjekker vi med automatiske tests og med NVDA og VoiceOver før hver udgivelse.",
        "Alt virker med tastaturet alene. Udvidelsen slås til og fra med Alt+B, og du kan ændre genvejen i din browsers indstillinger.",
        "Fremhævningens farver udledes af tekstens egen farve, så kontrasten holder i lys tilstand, mørk tilstand og hvert websteds tema.",
        "Dette websted bruger skrifttypen Atkinson Hyperlegible, som er designet til at skelne tydeligt mellem bogstaverne, og følger dit systems indstillinger for mørk tilstand og reduceret bevægelse.",
        "Hvis du støder på en barriere, så opret et issue på GitHub: det er en fejl, og vi behandler den som en.",
      ],
    },
  },
};
