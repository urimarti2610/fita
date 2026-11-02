import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Svenska";

export const slugs: Record<PageKey, string> = {
  uses: "for-vem",
  worksheets: "lasblad",
  convert: "konvertera",
  privacy: "integritet",
  accessibility: "tillganglighet",
};

export const strings: Strings = {
  meta: {
    description:
      "Gratis läshjälp med öppen källkod för personer med adhd och dyslexi: framhäver början av varje ord på webben och i dina e-böcker. Allt stannar på din enhet.",
  },
  nav: {
    skip: "Hoppa till innehållet",
    home: "Start",
    convert: "Konvertera en bok",
    privacy: "Integritet",
    accessibility: "Tillgänglighet",
    github: "Källkod",
    language: "Språk",
    theme: {
      label: "Tema",
      light: "ljust",
      dark: "mörkt",
    },
  },
  hero: {
    headline: "Läs på ditt sätt",
    lede: "Framhäver varsamt början av varje ord så att blicken har någonstans att landa. För personer med adhd, dyslexi eller alla som tycker att det är skönare så. Gratis, utan konto, och ingenting lämnar någonsin din enhet.",
  },
  install: {
    chrome: "Lägg till i Chrome eller Edge",
    firefox: "Lägg till i Firefox",
    preview:
      "Finns inte i butikerna än. Under tiden kan du installera förhandsversionen från GitHub.",
  },
  demo: {
    heading: "Prova med din egen text",
    intro:
      "Klistra in vilken text som helst. Resultatet uppdateras direkt, och det finns ingen längdgräns.",
    input: "Din text",
    output: "Så här läses den",
    sample:
      "Att läsa ska kännas skönt. En del tappar bort sig, hoppar över ord eller blir trötta innan stycket är slut. När början av varje ord är markerad får blicken en ankarpunkt: prova olika styrkor och stilar tills du hittar din.",
    strength: "Styrka",
    style: "Stil",
    styles: {
      "bold-fade": "Fet och tonad",
      bold: "Fet",
      color: "Färg",
      underline: "Understruken",
      fade: "Tona resten",
    },
    more: "Fler alternativ",
    every: "Framhäv",
    everyOptions: ["Varje ord", "Vartannat ord", "Vart tredje ord"],
    lineHeight: "Radavstånd",
    maxWidth: "Största radbredd",
    pageDefault: "Normal",
    widths: ["Smal (50 tecken)", "Mellan (65 tecken)", "Bred (80 tecken)"],
  },
  privacy: {
    heading: "Ingenting lämnar din enhet",
    body: [
      "Tillägget, den här sidan och bokkonverteraren körs helt i din webbläsare. Det finns ingen server att skicka något till.",
      "Inga konton, ingen analys, inga kakor och inga begränsningar för hur mycket du använder det.",
    ],
    more: "Läs integritetspolicyn",
  },
  faq: {
    heading: "Frågor",
    items: [
      {
        q: "Fungerar det på riktigt?",
        a: [
          "Det beror på personen. De studier som har publicerats hittills visar inte att människor i genomsnitt läser snabbare eller förstår mer med den här sortens framhävning.",
          "Men många berättar att läsningen känns skönare, att de tappar bort sig mer sällan eller att det är lättare att komma igång. Därför lovar vi ingen snabbhet: vi erbjuder ett stöd som du kan ställa in eller stänga av. Prova demon och behåll det som hjälper.",
        ],
      },
      {
        q: "Kostar det något?",
        a: [
          "Nej, och det kommer det aldrig att göra. Ingen betalversion, ingen ordgräns, ingen gräns för filstorlek. Det är fri programvara under licensen Apache-2.0.",
        ],
      },
      {
        q: "Kan jag använda det med mina e-böcker?",
        a: [
          "Ja. Under ”Konvertera en bok” väljer du en EPUB-, TXT-, Markdown- eller HTML-fil och laddar ner en kopia med framhävning. Konverteringen sker i din webbläsare. Böcker med DRM kan inte konverteras.",
        ],
      },
      {
        q: "Fungerar det på alla språk?",
        a: [
          "På alla språk som skiljer ord åt med mellanslag, även skriftsystem som läses från höger till vänster. Kinesiska, japanska, thailändska och andra skriftsystem utan mellanslag lämnas som de är.",
        ],
      },
      {
        q: "Och om jag använder en skärmläsare?",
        a: ["Texten läses upp precis som förut: inga tecken läggs till eller tas bort."],
      },
      {
        q: "Fungerar det i mobilen?",
        a: ["Ja, med Firefox för Android. En egen app kommer senare."],
      },
    ],
  },
  footer: {
    license: "Fri programvara under licensen Apache-2.0.",
  },
  uses: {
    title: "För vem",
    intro:
      "Alla läser på sitt eget sätt. Här är några sätt att använda verktyget beroende på vem du är och vad du behöver det till. Gemensamt för alla: det är ett frivilligt stöd som du kan ställa in eller stänga av, och det samlar inte in några uppgifter.",
    homeHeading: "För vem",
    how: "Så använder du det",
    care: "Bra att veta",
    cases: [
      {
        id: "education",
        title: "Skola och utbildning",
        summary:
          "För lärare, skolor och familjer som vill anpassa läsmaterial utan att ta fram nytt.",
        link: "Idéer för klassrummet och hemmet",
        lede: "För lärare, specialpedagoger och familjer som vill att läsningen ska kräva lite mindre ansträngning, utan att förbereda olika material för varje elev.",
        steps: [
          "Anpassa materialet du redan har: konvertera texter, anteckningar eller böcker i EPUB, TXT, Markdown eller HTML och dela dem som de är.",
          "Visa demon i klassrummet med dagens text och prova olika styrkor och stilar tillsammans. Låt varje elev säga vad som känns skönast.",
          "På skolans datorer fungerar tillägget utan konton eller registrering och samlar inte in några uppgifter om eleverna.",
          "Gör läsblad med stor text och en vänlig ram under ”Läsblad”, och skriv ut dem eller spara dem som PDF.",
          "Hemma hjälper samma tillägg till med läxor och läsning på webben.",
        ],
        notes: [
          "Det är ett frivilligt stöd: det hjälper vissa elever och andra inte. Låt var och en välja, och stänga av det om de vill.",
          "Det ersätter inte pedagogiskt stöd eller utredning av läs- och skrivsvårigheter.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopeder och andra yrkespersoner",
        summary:
          "För logopeder, skolpsykologer och kuratorer som söker ett enkelt verktyg att prova under sina sessioner.",
        link: "Så använder du det under sessioner",
        lede: "För logopeder, skolpsykologer, kuratorer och andra yrkespersoner som stöttar personer med lässvårigheter.",
        steps: [
          "Klistra in en text i demon under en session och prova flera inställningar tillsammans med personen. Anteckna vad som känns skönast: styrka, stil, framhävda ord, radavstånd.",
          "Förbered arbetsmaterial med konverteraren och dela ut det på papper, på skärm eller på en läsplatta.",
          "Rekommendera tillägget för användning hemma, med de inställningar ni har valt tillsammans.",
          "Allt körs på enheten: ingen text och inga uppgifter om patienter går någonsin via en server.",
        ],
        notes: [
          "Det är ingen behandling och ingen metod för läsintervention. Det kan vara ett stöd bland andra i ditt arbete.",
          "Studier visar ingen genomsnittlig vinst i snabbhet eller förståelse. Presentera det som en fråga om bekvämlighet och smak, och bedöm det från fall till fall.",
        ],
      },
      {
        id: "adults",
        title: "Vuxna",
        summary:
          "För dig som vill komma tillbaka till läsningen men har svårt att fokusera, tappar bort dig eller snabbt blir trött.",
        link: "Så kommer du igång",
        lede: "Om du vill läsa mer men har svårt att komma igång, tappar bort dig, läser samma mening tre gånger eller är trött redan på sidan två kan det här kanske hjälpa. Och om det inte gör det är det helt okej.",
        steps: [
          "Installera tillägget och slå på det med Alt+B på en artikel som intresserar dig. Börja med korta texter.",
          "Konvertera en bok som du verkligen vill läsa och lägg den på din läsplatta eller i mobilen.",
          "Ställ in styrkan tills det känns skönt. Under ”Fler alternativ” kan du öka radavståndet och göra raderna smalare: för många hjälper det lika mycket som framhävningen.",
          "Om det tröttar ut dig en dag, stäng av det. Det är ditt sätt att läsa, inte en regel.",
        ],
        notes: [
          "Det fungerar inte för alla, och det är okej. Ge det några dagar innan du bestämmer dig.",
          "Om du tror att adhd eller dyslexi kan ligga bakom dina svårigheter kan det hjälpa att prata med en yrkesperson.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Läsblad",
    nav: "Läsblad",
    intro:
      "Gör läsblad med stor text, framhävd början på varje ord och en vänlig ram. Välj en exempeltext eller skriv din egen, och skriv sedan ut eller ladda ner bladet.",
    editor: "Anpassa bladet",
    example: "Välj en text",
    titleLabel: "Rubrik",
    textLabel: "Text",
    theme: "Ram",
    themes: {
      none: "Ingen ram",
      simple: "Enkel",
      clouds: "Moln",
      garden: "Trädgård",
      stars: "Stjärnor",
      vehicles: "Bilar och lastbilar",
    },
    size: "Textstorlek",
    sizes: ["Stor", "Mycket stor", "Jättestor"],
    nameDate: "Lägg till namn och datum",
    name: "Namn",
    date: "Datum",
    lines: "Skrivrader",
    linesOptions: ["Inga", "3 rader", "6 rader", "10 rader"],
    preview: "Förhandsvisning",
    showPageSize: "Visa sidstorlek",
    pageSizes: { portrait: "A4 stående (210 × 297 mm)", landscape: "A4 liggande (297 × 210 mm)" },
    pageN: "Sida {n}",
    editHint:
      "Du kan skriva direkt på bladet: klicka på rubriken eller texten. Framhävningen läggs på när du är klar.",
    editTitle: "Bladets rubrik",
    editText: "Bladets text",
    print: "Skriv ut eller spara som PDF",
    download: "Ladda ner bladet",
    printHint:
      "Välj ”Spara som PDF” i utskriftsdialogen för att spara det som PDF. Det skrivs ut på vit bakgrund för att spara bläck.",
    downloadHint:
      "Det du laddar ner är en webbsida som du kan öppna och skriva ut när som helst, även utan internet.",
    fileName: "lasblad",
    tabs: { text: "Text", layout: "Layout", emphasis: "Framhävning" },
    myTexts: "Mina texter",
    save: "Spara i mina texter",
    saved: "”{title}” är sparad i mina texter.",
    remove: "Ta bort från mina texter",
    removed: "”{title}” togs bort från mina texter.",
    exportTexts: "Exportera mina texter",
    importTexts: "Importera texter",
    imported: "Importerade texter: {n}.",
    importEmpty:
      "Det finns inga texter i den filen. Använd en .md-fil med rubriker som börjar med ”## ”, eller en .txt-fil.",
    libraryNote:
      "Dina texter sparas bara i den här webbläsaren. Exportera dem för att behålla en kopia, dela dem eller flytta dem till en annan dator.",
    exportHeading: "Mina texter för läsblad",
    levelKey: "Nivå",
    textsFileName: "mina-lasbladstexter",
    orientation: "Orientering",
    orientations: { portrait: "Stående", landscape: "Liggande" },
    overflow:
      "Bladet fortsätter på en sida till. Om det ska få plats på en sida kan du korta texten, välja en mindre textstorlek eller ta bort rader.",
  },
  settings: {
    title: "Läsinställningar",
    open: "Öppna läsinställningar",
    close: "Stäng",
    note: "De gäller för demon, läsbladen och konverteraren och sparas bara i den här webbläsaren.",
    presets: "Mina sparade inställningar",
    empty:
      "Du har inte sparat några inställningar än. Ge de nuvarande ett namn så kan du återgå till dem med ett klick.",
    name: "Namn",
    placeholder: "Till exempel: Läsning i klassen",
    save: "Spara",
    apply: "Använd inställningarna ”{name}”",
    remove: "Radera ”{name}”",
    saved: "Inställningarna ”{name}” har sparats.",
    removed: "”{name}” har raderats.",
    applied: "Använder nu ”{name}”.",
    reset: "Tillbaka till standardinställningarna",
    restored: "Standardinställningarna är återställda.",
  },
  convert: {
    title: "Konvertera en bok",
    intro:
      "Välj en bok eller ett dokument och ladda ner en kopia med framhävning. Filen lämnar aldrig din enhet: allt sker i den här webbläsaren, utan storleksgräns.",
    pick: "Välj en fil",
    drop: "eller släpp den här",
    formats: "EPUB, TXT, Markdown eller HTML",
    selected: "Vald fil:",
    output: "Utdataformat",
    outputs: { epub: "EPUB (e-bok)", html: "HTML (webbsida)", md: "Markdown" },
    options: "Hur det ska framhävas",
    start: "Konvertera",
    progress: "Konverterar: {n} %",
    cancel: "Avbryt",
    cancelled: "Konverteringen avbröts. Ingenting sparades.",
    done: "Klart. Din fil är redo.",
    download: "Ladda ner {name}",
    errors: {
      unsupported:
        "Det här formatet kan inte konverteras. Välj en EPUB-, TXT-, Markdown- eller HTML-fil.",
      drm: "Den här boken har DRM (kopieringsskydd), så den kan inte konverteras. Om du har köpt den kan du fråga butiken om du kan få en kopia utan DRM.",
      invalid:
        "Filen kunde inte läsas. Kontrollera att den går att öppna i din läsare, eller prova en annan.",
      failed:
        "Konverteringen misslyckades ({detail}). Om det händer igen får du gärna berätta det för oss på GitHub.",
    },
    labels: { part: "Del", contents: "Innehåll" },
    steps: {
      choose: "Välj din bok",
      adjust: "Ställ in utseendet",
      convert: "Konvertera och ladda ner",
    },
    previewTitle: "Så här börjar din bok",
    previewEmpty: "Välj en fil så visas dess första sida här, med framhävning.",
    previewLoading: "Förbereder förhandsvisningen …",
    previewNote:
      "Ungefärlig bild: varje läsare visar boken med sitt eget typsnitt och sin egen storlek.",
    previewNone: "Ingen text hittades i början av filen, men du kan ändå konvertera den.",
    change: "Välj en annan fil",
    devices: {
      heading: "Så får du över den till din läsplatta",
      items: [
        {
          name: "Kindle",
          text: "Använd Amazons Send to Kindle (webbplats, app eller e-post) och välj EPUB-filen. Amazon anpassar den för din Kindle.",
        },
        {
          name: "Kobo",
          text: "Anslut din Kobo till datorn med USB-kabeln och kopiera över EPUB-filen. Mata ut den så dyker boken upp i ditt bibliotek.",
        },
        {
          name: "PocketBook",
          text: "Kopiera den via USB, som med en Kobo, eller mejla den med tjänsten Send-to-PocketBook.",
        },
      ],
      calibre:
        "Om du använder Calibre lägger du till filen i ditt bibliotek och skickar den till din läsare som vilken bok som helst.",
    },
  },
  pages: {
    privacy: {
      title: "Integritet",
      body: [
        "Vi samlar inte in några uppgifter. Inga alls.",
        "Tillägget, den här webbplatsen och konverteraren körs helt på din enhet. Det du läser och filerna du konverterar skickas aldrig någonstans: vi har inga servrar.",
        "Vi använder ingen analys, inga kakor, ingen telemetri och inga typsnitt eller skript från andra webbplatser.",
        "Tillägget sparar dina inställningar (styrka, stil, webbplatser där det alltid ska vara på) i din egen webbläsares lagring. Om synkronisering är påslagen i webbläsaren kan den kopiera dem mellan dina enheter; vi ser dem aldrig.",
        "Tillägget ber bara om de behörigheter det behöver. Åtkomst till en viss webbplats, eller till alla webbplatser, efterfrågas först när du väljer ”Alltid på den här webbplatsen” eller ”På alla webbplatser”, och du kan när som helst återkalla den.",
      ],
    },
    accessibility: {
      title: "Tillgänglighet",
      body: [
        "Framhävningen ändrar aldrig vad en skärmläsare läser upp: texten är exakt densamma, tecken för tecken. Det kontrollerar vi med automatiska tester, och med NVDA och VoiceOver före varje version.",
        "Allt fungerar med enbart tangentbordet. Tillägget slås på och av med Alt+B, och du kan ändra kortkommandot i webbläsarens inställningar.",
        "Framhävningens färger hämtas från textens egen färg, så kontrasten håller i ljust läge, mörkt läge och varje webbplats eget tema.",
        "Den här webbplatsen använder typsnittet Atkinson Hyperlegible, som är utformat för att bokstäverna ska vara lätta att skilja åt, och följer systemets inställningar för mörkt läge och minskad rörelse.",
        "Om du stöter på ett hinder, skapa gärna ett ärende (issue) på GitHub: det är en bugg, och vi behandlar det som en.",
      ],
    },
  },
};
