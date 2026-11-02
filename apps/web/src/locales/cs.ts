import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Čeština";

export const slugs: Record<PageKey, string> = {
  uses: "pro-koho",
  worksheets: "pracovni-listy",
  convert: "prevest",
  privacy: "soukromi",
  accessibility: "pristupnost",
};

export const strings: Strings = {
  meta: {
    description:
      "Bezplatná pomůcka pro čtení s otevřeným kódem pro lidi s ADHD a dyslexií: zvýrazní začátek každého slova na webu i ve tvých e-knihách. Všechno zůstává ve tvém zařízení.",
  },
  nav: {
    skip: "Přejít na obsah",
    home: "Úvod",
    convert: "Převést knihu",
    privacy: "Soukromí",
    accessibility: "Přístupnost",
    github: "Zdrojový kód",
    language: "Jazyk",
    theme: {
      label: "Motiv",
      light: "světlý",
      dark: "tmavý",
    },
  },
  hero: {
    headline: "Čti po svém",
    lede: "Jemně zvýrazní začátek každého slova, aby se oči měly čeho chytit. Pro lidi s ADHD, dyslexií a pro každého, komu to tak vyhovuje. Zdarma, bez účtu a nic neopustí tvoje zařízení.",
  },
  install: {
    chrome: "Přidat do Chrome nebo Edge",
    firefox: "Přidat do Firefoxu",
    preview: "Zatím to není v obchodech. Mezitím si můžeš nainstalovat zkušební verzi z GitHubu.",
  },
  demo: {
    heading: "Vyzkoušej to na vlastním textu",
    intro: "Vlož jakýkoli text. Výsledek se změní okamžitě a délka není nijak omezená.",
    input: "Tvůj text",
    output: "Jak se to čte",
    sample:
      "Čtení má být pohodlné. Někdo ztrácí místo v textu, přeskakuje slova nebo se unaví dřív, než dočte odstavec. Zvýrazněný začátek každého slova dává očím oporu: zkoušej různé síly a styly, dokud nenajdeš ten svůj.",
    strength: "Síla",
    style: "Styl",
    styles: {
      "bold-fade": "Tučně a ztlumit",
      bold: "Tučně",
      color: "Barva",
      underline: "Podtržení",
      fade: "Ztlumit zbytek",
    },
    more: "Další možnosti",
    every: "Zvýrazňovat",
    everyOptions: ["Každé slovo", "Každé druhé slovo", "Každé třetí slovo"],
    lineHeight: "Řádkování",
    maxWidth: "Největší šířka řádku",
    pageDefault: "Normální",
    widths: ["Úzký (50 znaků)", "Střední (65 znaků)", "Široký (80 znaků)"],
  },
  privacy: {
    heading: "Nic neopustí tvoje zařízení",
    body: [
      "Rozšíření, tahle stránka i převodník knih běží celé ve tvém prohlížeči. Neexistuje žádný server, kam by se dalo něco poslat.",
      "Žádné účty, žádná analytika, žádné cookies a žádné limity používání.",
    ],
    more: "Přečíst zásady ochrany soukromí",
  },
  faq: {
    heading: "Otázky",
    items: [
      {
        q: "Opravdu to funguje?",
        a: [
          "Záleží na člověku. Dosud zveřejněné studie neukazují, že by lidé s tímto zvýrazněním v průměru četli rychleji nebo víc rozuměli.",
          "Hodně lidí ale říká, že se jim čte pohodlněji, méně často ztrácejí místo v textu nebo se jim snáz začíná. Proto neslibujeme rychlost: nabízíme pomůcku, kterou si můžeš upravit nebo vypnout. Vyzkoušej ukázku a nech si to, co ti pomáhá.",
        ],
      },
      {
        q: "Stojí to něco?",
        a: [
          "Ne a nikdy nebude. Žádná placená verze, žádný limit slov, žádný limit velikosti souboru. Je to svobodný software pod licencí MPL-2.0.",
        ],
      },
      {
        q: "Můžu to používat se svými e-knihami?",
        a: [
          "Ano. V části „Převést knihu“ vybereš soubor EPUB, TXT, Markdown nebo HTML a stáhneš si kopii se zvýrazněním. Převod probíhá ve tvém prohlížeči. Knihy s DRM převést nejde.",
        ],
      },
      {
        q: "Funguje to v každém jazyce?",
        a: [
          "Ve všech jazycích, které oddělují slova mezerami, včetně písem psaných zprava doleva. Čínština, japonština, thajština a další písma bez mezer zůstanou beze změny.",
        ],
      },
      {
        q: "Co když používám čtečku obrazovky?",
        a: ["Text se čte přesně jako předtím: žádný znak se nepřidá ani neubere."],
      },
      {
        q: "Funguje to na mobilu?",
        a: ["Ano, ve Firefoxu pro Android. Samostatná aplikace přijde později."],
      },
    ],
  },
  footer: {
    license: "Svobodný software pod licencí MPL-2.0.",
  },
  uses: {
    title: "Pro koho to je",
    intro:
      "Každý čte po svém. Tady je pár nápadů, jak nástroj používat podle toho, kdo jsi a k čemu ho potřebuješ. Všechny mají jedno společné: je to dobrovolná pomůcka, kterou si můžeš upravit nebo vypnout, a nesbírá žádná data.",
    homeHeading: "Pro koho to je",
    how: "Jak to používat",
    care: "Mysli na to",
    cases: [
      {
        id: "education",
        title: "Vzdělávání",
        summary:
          "Pro učitele, školy a rodiny, které chtějí upravit texty ke čtení, aniž by musely tvořit nové materiály.",
        link: "Nápady do třídy i domů",
        lede: "Pro učitele, školní poradenská pracoviště a rodiny, které chtějí, aby čtení stálo o trochu méně námahy, a přitom nechystat jiné materiály pro každého žáka.",
        steps: [
          "Uprav materiály, které už máš: převeď čítanky, poznámky nebo knihy ve formátu EPUB, TXT, Markdown nebo HTML a sdílej je tak, jak jsou.",
          "Ve třídě promítni ukázku s textem na daný den a společně vyzkoušejte různé síly a styly. Ať každý žák řekne, co mu nejvíc vyhovuje.",
          "Na školních počítačích rozšíření funguje bez účtů a registrace a nesbírá žádná data o žácích.",
          "V části „Pracovní listy“ připravíš listy ke čtení s velkým písmem a přívětivým rámečkem a pak je vytiskneš nebo uložíš jako PDF.",
          "Doma pomáhá stejné rozšíření s úkoly i se čtením na webu.",
        ],
        notes: [
          "Je to dobrovolná pomůcka: některým žákům pomáhá, jiným ne. Nech každého vybrat si a vypnout ji, když bude chtít.",
          "Nenahrazuje pedagogickou podporu ani diagnostiku poruch učení.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopedie a další odborníci",
        summary:
          "Pro logopedy, speciální pedagogy a školní psychology, kteří hledají jednoduchý nástroj na vyzkoušení při sezeních.",
        link: "Jak to používat při sezeních",
        lede: "Pro logopedy, speciální pedagogy, školní psychology a další odborníky, kteří podporují lidi s obtížemi ve čtení.",
        steps: [
          "Při sezení vlož text do ukázky a vyzkoušejte spolu několik nastavení. Poznamenej si, které je nejpohodlnější: síla, styl, zvýrazňovaná slova, řádkování.",
          "Připrav pracovní materiály v převodníku a dej je na papíře, na obrazovce nebo ve čtečce e-knih.",
          "Doporuč rozšíření na doma s nastavením vybraným společně.",
          "Všechno běží v zařízení: žádný text ani data klientů neprochází přes server.",
        ],
        notes: [
          "Není to léčba ani metoda intervence ve čtení. Může být jednou z opor ve tvé práci.",
          "Studie neukazují průměrné zlepšení rychlosti ani porozumění. Představ to jako otázku pohodlí a osobní volby a posuzuj to případ od případu.",
        ],
      },
      {
        id: "adults",
        title: "Dospělí",
        summary:
          "Pro lidi, kteří se chtějí vrátit ke čtení, ale nedokážou se soustředit, ztrácejí místo v textu nebo se rychle unaví.",
        link: "Jak začít",
        lede: "Pokud chceš číst víc, ale těžko se ti začíná, ztrácíš místo v textu, čteš stejnou větu třikrát nebo se unavíš už na druhé stránce, tohle může pomoct. A když ne, nevadí.",
        steps: [
          "Nainstaluj si rozšíření a zapni ho zkratkou Alt+B na článku, který tě zajímá. Začni krátkými texty.",
          "Převeď si knihu, kterou opravdu chceš číst, a nahraj ji do čtečky nebo do mobilu.",
          "Uprav sílu, dokud ti nebude pohodlná. V „Dalších možnostech“ můžeš zvětšit řádkování a zúžit řádky: mnoha lidem to pomáhá stejně jako samotné zvýraznění.",
          "Když tě to některý den unavuje, vypni to. Je to tvůj způsob čtení, ne pravidlo.",
        ],
        notes: [
          "Nefunguje to pro každého, a to je v pořádku. Dej tomu pár dní, než se rozhodneš.",
          "Pokud máš pocit, že za tvými obtížemi může být ADHD nebo dyslexie, může pomoct promluvit si s odborníkem.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Pracovní listy ke čtení",
    nav: "Pracovní listy",
    intro:
      "Vytvoř listy s velkým písmem, zvýrazněným začátkem každého slova a přívětivým rámečkem. Vyber si ukázkový text nebo napiš vlastní a pak ho vytiskni nebo stáhni.",
    editor: "Uprav pracovní list",
    example: "Vyber text",
    titleLabel: "Nadpis",
    textLabel: "Text",
    theme: "Rámeček",
    themes: {
      none: "Bez rámečku",
      simple: "Jednoduchý",
      clouds: "Mráčky",
      garden: "Zahrada",
      stars: "Hvězdy",
      vehicles: "Auta a náklaďáky",
    },
    size: "Velikost textu",
    sizes: ["Velký", "Hodně velký", "Obrovský"],
    nameDate: "Přidat jméno a datum",
    name: "Jméno",
    date: "Datum",
    lines: "Řádky na psaní",
    linesOptions: ["Žádné", "3 řádky", "6 řádků", "10 řádků"],
    preview: "Náhled",
    showPageSize: "Zobrazit velikost stránky",
    pageSizes: { portrait: "A4 na výšku (210 × 297 mm)", landscape: "A4 na šířku (297 × 210 mm)" },
    pageN: "Strana {n}",
    editHint:
      "Můžeš psát přímo do listu: klikni na nadpis nebo na text. Zvýraznění se použije, až skončíš.",
    editTitle: "Nadpis pracovního listu",
    editText: "Text pracovního listu",
    print: "Vytisknout nebo uložit jako PDF",
    download: "Stáhnout pracovní list",
    printHint:
      "Pro uložení jako PDF vyber v dialogu tisku „Uložit jako PDF“. Tiskne se na bílém pozadí, aby se šetřil inkoust.",
    downloadHint:
      "Stáhneš si webovou stránku, kterou můžeš kdykoli otevřít a vytisknout, i bez internetu.",
    fileName: "pracovni-list",
    tabs: { text: "Text", layout: "Rozvržení", emphasis: "Zvýraznění" },
    myTexts: "Moje texty",
    save: "Uložit do mých textů",
    saved: "„{title}“ je uložen v mých textech.",
    remove: "Odebrat z mých textů",
    removed: "„{title}“ byl odebrán z mých textů.",
    exportTexts: "Exportovat moje texty",
    importTexts: "Importovat texty",
    imported: "Importované texty: {n}.",
    importEmpty:
      "V tomhle souboru nejsou žádné texty. Použij soubor .md s nadpisy „## “ nebo soubor .txt.",
    libraryNote:
      "Tvoje texty jsou uložené jen v tomhle prohlížeči. Exportuj je, pokud si chceš nechat kopii, sdílet je nebo je přenést do jiného počítače.",
    exportHeading: "Moje texty pro pracovní listy",
    levelKey: "Úroveň",
    textsFileName: "moje-texty-pro-listy",
    orientation: "Orientace",
    orientations: { portrait: "Na výšku", landscape: "Na šířku" },
    overflow:
      "Pracovní list přetéká na druhou stranu. Aby se vešel na jednu, zkrať text, vyber menší písmo nebo odeber řádky.",
  },
  settings: {
    title: "Nastavení čtení",
    open: "Otevřít nastavení čtení",
    close: "Zavřít",
    note: "Platí pro ukázku, pracovní listy i převodník a ukládají se jen v tomhle prohlížeči.",
    presets: "Moje uložená nastavení",
    empty:
      "Zatím tu nejsou žádná uložená nastavení. Pojmenuj to současné a vrátíš se k němu jedním kliknutím.",
    name: "Název",
    placeholder: "Například: Čtení ve třídě",
    save: "Uložit",
    apply: "Použít nastavení „{name}“",
    remove: "Smazat „{name}“",
    saved: "Nastavení „{name}“ je uložené.",
    removed: "„{name}“ je smazané.",
    applied: "Teď se používá „{name}“.",
    reset: "Vrátit výchozí nastavení",
    restored: "Výchozí nastavení je obnovené.",
  },
  convert: {
    title: "Převést knihu",
    intro:
      "Vyber knihu nebo dokument a stáhni si kopii se zvýrazněním. Soubor nikdy neopustí tvoje zařízení: všechno se děje v tomhle prohlížeči, bez omezení velikosti.",
    pick: "Vybrat soubor",
    drop: "nebo ho sem přetáhni",
    formats: "EPUB, TXT, Markdown nebo HTML",
    selected: "Vybraný soubor:",
    output: "Výstupní formát",
    outputs: { epub: "EPUB (e-kniha)", html: "HTML (webová stránka)", md: "Markdown" },
    options: "Jak zvýrazňovat",
    start: "Převést",
    progress: "Převádí se: {n} %",
    cancel: "Zrušit",
    cancelled: "Převod je zrušený. Nic se neuložilo.",
    done: "Hotovo. Tvůj soubor je připravený.",
    download: "Stáhnout {name}",
    errors: {
      unsupported: "Tenhle formát převést nejde. Vyber soubor EPUB, TXT, Markdown nebo HTML.",
      drm: "Tahle kniha má DRM (ochranu proti kopírování), takže ji převést nejde. Pokud je koupená, zeptej se v obchodě, jestli ti můžou dát kopii bez DRM.",
      invalid:
        "Tenhle soubor se nepodařilo přečíst. Zkontroluj, jestli se otevře ve tvé čtečce, nebo zkus jiný.",
      failed:
        "Převod se nepovedl ({detail}). Pokud se to stane znovu, dej nám prosím vědět na GitHubu.",
    },
    labels: { part: "Část", contents: "Obsah" },
    steps: {
      choose: "Vyber knihu",
      adjust: "Uprav vzhled",
      convert: "Převeď a stáhni",
    },
    previewTitle: "Takhle bude tvoje kniha začínat",
    previewEmpty: "Vyber soubor a tady se objeví jeho první stránka se zvýrazněním.",
    previewLoading: "Připravuje se náhled…",
    previewNote: "Přibližný náhled: každá čtečka zobrazuje knihu vlastním písmem a velikostí.",
    previewNone: "Na začátku souboru se nenašel žádný text, ale převést ho přesto můžeš.",
    change: "Vybrat jiný soubor",
    devices: {
      heading: "Jak knihu dostat do čtečky",
      items: [
        {
          name: "Kindle",
          text: "Použij službu Amazon Send to Kindle (web, aplikace nebo e-mail) a vyber soubor EPUB. Amazon ho pro tvůj Kindle upraví.",
        },
        {
          name: "Kobo",
          text: "Připoj Kobo k počítači kabelem USB a zkopíruj do něj soubor EPUB. Čtečku odpoj a kniha se objeví v knihovně.",
        },
        {
          name: "PocketBook",
          text: "Zkopíruj soubor přes USB, stejně jako u Koba, nebo ho pošli e-mailem přes službu Send-to-PocketBook.",
        },
      ],
      calibre:
        "Pokud používáš Calibre, přidej soubor do knihovny a pošli ho do čtečky jako kteroukoli jinou knihu.",
    },
  },
  pages: {
    privacy: {
      title: "Soukromí",
      body: [
        "Nesbíráme žádná data. Vůbec žádná.",
        "Rozšíření, tenhle web i převodník běží celé ve tvém zařízení. Co čteš a jaké soubory převádíš, se nikam neposílá: nemáme žádné servery.",
        "Nepoužíváme analytiku, cookies, telemetrii ani písma a skripty z jiných webů.",
        "Rozšíření ukládá tvoje nastavení (sílu, styl, weby, kde má být vždy zapnuté) do úložiště tvého vlastního prohlížeče. Pokud máš zapnutou synchronizaci prohlížeče, může je prohlížeč kopírovat mezi tvými zařízeními; my je nikdy nevidíme.",
        "Rozšíření žádá jen o oprávnění, která potřebuje. O přístup ke konkrétnímu webu nebo ke všem webům požádá až ve chvíli, kdy vybereš „Vždy na tomto webu“ nebo „Na všech webech“, a kdykoli ho můžeš odebrat.",
      ],
    },
    accessibility: {
      title: "Přístupnost",
      body: [
        "Zvýraznění nikdy nemění to, co čte čtečka obrazovky: text je úplně stejný, znak po znaku. Ověřujeme to automatickými testy a před každým vydáním i v NVDA a VoiceOveru.",
        "Všechno jde ovládat jen klávesnicí. Rozšíření se zapíná a vypíná zkratkou Alt+B a zkratku si můžeš změnit v nastavení prohlížeče.",
        "Barvy zvýraznění vycházejí z barvy samotného textu, takže kontrast zůstává zachovaný ve světlém i tmavém režimu i v motivu každého webu.",
        "Tenhle web používá písmo Atkinson Hyperlegible, navržené tak, aby se písmena dala snadno rozlišit, a řídí se nastavením tmavého režimu a omezeného pohybu ve tvém systému.",
        "Pokud narazíš na bariéru, založ prosím issue na GitHubu: je to chyba a tak s ní budeme zacházet.",
      ],
    },
  },
};
