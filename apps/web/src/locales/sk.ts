import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Slovenčina";

export const slugs: Record<PageKey, string> = {
  uses: "pre-koho",
  worksheets: "pracovne-listy",
  convert: "konvertovat",
  privacy: "sukromie",
  accessibility: "pristupnost",
};

export const strings: Strings = {
  meta: {
    description:
      "Bezplatná pomôcka na čítanie s otvoreným kódom pre ľudí s ADHD a dyslexiou: zvýrazní začiatok každého slova na webe aj v tvojich e-knihách. Všetko zostáva v tvojom zariadení.",
  },
  nav: {
    skip: "Prejsť na obsah",
    home: "Úvod",
    convert: "Konvertovať knihu",
    privacy: "Súkromie",
    accessibility: "Prístupnosť",
    github: "Zdrojový kód",
    language: "Jazyk",
    theme: {
      label: "Motív",
      light: "svetlý",
      dark: "tmavý",
    },
  },
  hero: {
    headline: "Čítaj po svojom",
    lede: "Jemne zvýrazní začiatok každého slova, aby sa oči mali čoho chytiť. Pre ľudí s ADHD, dyslexiou a pre každého, komu to tak vyhovuje. Zadarmo, bez účtu a nič neopustí tvoje zariadenie.",
  },
  install: {
    chrome: "Pridať do Chrome alebo Edge",
    firefox: "Pridať do Firefoxu",
    preview:
      "Zatiaľ to nie je v obchodoch. Medzitým si môžeš nainštalovať skúšobnú verziu z GitHubu.",
  },
  demo: {
    heading: "Vyskúšaj to na vlastnom texte",
    intro: "Vlož akýkoľvek text. Výsledok sa zmení okamžite a dĺžka nie je nijako obmedzená.",
    input: "Tvoj text",
    output: "Ako sa to číta",
    sample:
      "Čítanie má byť pohodlné. Niekto stráca miesto v texte, preskakuje slová alebo sa unaví skôr, než dočíta odsek. Zvýraznený začiatok každého slova dáva očiam oporu: skúšaj rôzne sily a štýly, kým nenájdeš ten svoj.",
    strength: "Sila",
    style: "Štýl",
    styles: {
      "bold-fade": "Tučné a stlmené",
      bold: "Tučné",
      color: "Farba",
      underline: "Podčiarknutie",
      fade: "Stlmiť zvyšok",
    },
    more: "Ďalšie možnosti",
    every: "Zvýrazňovať",
    everyOptions: ["Každé slovo", "Každé druhé slovo", "Každé tretie slovo"],
    lineHeight: "Riadkovanie",
    maxWidth: "Najväčšia šírka riadka",
    pageDefault: "Normálne",
    widths: ["Úzky (50 znakov)", "Stredný (65 znakov)", "Široký (80 znakov)"],
  },
  privacy: {
    heading: "Nič neopustí tvoje zariadenie",
    body: [
      "Rozšírenie, táto stránka aj konvertor kníh bežia celé v tvojom prehliadači. Neexistuje žiadny server, kam by sa dalo niečo poslať.",
      "Žiadne účty, žiadna analytika, žiadne cookies a žiadne limity používania.",
    ],
    more: "Prečítať zásady ochrany súkromia",
  },
  faq: {
    heading: "Otázky",
    items: [
      {
        q: "Naozaj to funguje?",
        a: [
          "Závisí to od človeka. Doteraz zverejnené štúdie neukazujú, že by ľudia s takýmto zvýraznením v priemere čítali rýchlejšie alebo viac rozumeli.",
          "Veľa ľudí však hovorí, že sa im číta pohodlnejšie, menej často strácajú miesto v texte alebo sa im ľahšie začína. Preto nesľubujeme rýchlosť: ponúkame pomôcku, ktorú si môžeš upraviť alebo vypnúť. Vyskúšaj ukážku a nechaj si to, čo ti pomáha.",
        ],
      },
      {
        q: "Stojí to niečo?",
        a: [
          "Nie a nikdy nebude. Žiadna platená verzia, žiadny limit slov, žiadny limit veľkosti súboru. Je to slobodný softvér pod licenciou Apache-2.0.",
        ],
      },
      {
        q: "Môžem to používať so svojimi e-knihami?",
        a: [
          "Áno. V časti „Konvertovať knihu“ vyberieš súbor EPUB, TXT, Markdown alebo HTML a stiahneš si kópiu so zvýraznením. Konverzia prebieha v tvojom prehliadači. Knihy s DRM sa konvertovať nedajú.",
        ],
      },
      {
        q: "Funguje to v každom jazyku?",
        a: [
          "Vo všetkých jazykoch, ktoré oddeľujú slová medzerami, vrátane písiem písaných sprava doľava. Čínština, japončina, thajčina a ďalšie písma bez medzier zostanú bez zmeny.",
        ],
      },
      {
        q: "Čo ak používam čítačku obrazovky?",
        a: ["Text sa číta presne ako predtým: žiadny znak sa nepridá ani neuberie."],
      },
      {
        q: "Funguje to na mobile?",
        a: ["Áno, vo Firefoxe pre Android. Samostatná aplikácia príde neskôr."],
      },
    ],
  },
  footer: {
    license: "Slobodný softvér pod licenciou Apache-2.0.",
  },
  uses: {
    title: "Pre koho to je",
    intro:
      "Každý číta po svojom. Tu je zopár nápadov, ako nástroj používať podľa toho, kto si a na čo ho potrebuješ. Všetky majú jedno spoločné: je to dobrovoľná pomôcka, ktorú si môžeš upraviť alebo vypnúť, a nezbiera žiadne údaje.",
    homeHeading: "Pre koho to je",
    how: "Ako to používať",
    care: "Maj na pamäti",
    cases: [
      {
        id: "education",
        title: "Vzdelávanie",
        summary:
          "Pre učiteľov, školy a rodiny, ktoré chcú upraviť texty na čítanie bez toho, aby museli vytvárať nové materiály.",
        link: "Nápady do triedy aj domov",
        lede: "Pre učiteľov, školské podporné tímy a rodiny, ktoré chcú, aby čítanie stálo o trochu menej námahy, a pritom nepripravovať iné materiály pre každého žiaka.",
        steps: [
          "Uprav materiály, ktoré už máš: skonvertuj čítanky, poznámky alebo knihy vo formáte EPUB, TXT, Markdown alebo HTML a zdieľaj ich tak, ako sú.",
          "Na hodine premietni ukážku s textom na daný deň a spoločne vyskúšajte rôzne sily a štýly. Nech každý žiak povie, čo mu najviac vyhovuje.",
          "Na školských počítačoch rozšírenie funguje bez účtov a registrácie a nezbiera žiadne údaje o žiakoch.",
          "V časti „Pracovné listy“ pripravíš listy na čítanie s veľkým písmom a prívetivým rámčekom a potom ich vytlačíš alebo uložíš ako PDF.",
          "Doma pomáha to isté rozšírenie s domácimi úlohami aj s čítaním na webe.",
        ],
        notes: [
          "Je to dobrovoľná pomôcka: niektorým žiakom pomáha, iným nie. Nechaj každého vybrať si a vypnúť ju, keď bude chcieť.",
          "Nenahrádza pedagogickú podporu ani diagnostiku porúch učenia.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopédia a ďalší odborníci",
        summary:
          "Pre logopédov, špeciálnych pedagógov a školských psychológov, ktorí hľadajú jednoduchý nástroj na vyskúšanie počas sedení.",
        link: "Ako to používať na sedeniach",
        lede: "Pre logopédov, špeciálnych pedagógov, školských psychológov a ďalších odborníkov, ktorí podporujú ľudí s ťažkosťami pri čítaní.",
        steps: [
          "Počas sedenia vlož text do ukážky a vyskúšajte spolu niekoľko nastavení. Poznač si, ktoré je najpohodlnejšie: sila, štýl, zvýrazňované slová, riadkovanie.",
          "Priprav pracovné materiály v konvertore a daj ich na papieri, na obrazovke alebo v čítačke e-kníh.",
          "Odporuč rozšírenie na používanie doma s nastavením vybraným spoločne.",
          "Všetko beží v zariadení: žiadny text ani údaje klientov neprechádzajú cez server.",
        ],
        notes: [
          "Nie je to liečba ani metóda intervencie pri čítaní. Môže byť jednou z opôr v tvojej práci.",
          "Štúdie neukazujú priemerné zlepšenie rýchlosti ani porozumenia. Predstav to ako otázku pohodlia a osobnej voľby a posudzuj to prípad od prípadu.",
        ],
      },
      {
        id: "adults",
        title: "Dospelí",
        summary:
          "Pre ľudí, ktorí sa chcú vrátiť k čítaniu, ale nevedia sa sústrediť, strácajú miesto v texte alebo sa rýchlo unavia.",
        link: "Ako začať",
        lede: "Ak chceš čítať viac, ale ťažko sa ti začína, strácaš miesto v texte, čítaš tú istú vetu trikrát alebo sa unavíš už na druhej strane, toto môže pomôcť. A ak nie, nevadí.",
        steps: [
          "Nainštaluj si rozšírenie a zapni ho skratkou Alt+B na článku, ktorý ťa zaujíma. Začni krátkymi textami.",
          "Skonvertuj si knihu, ktorú naozaj chceš čítať, a nahraj ju do čítačky alebo do mobilu.",
          "Uprav silu, kým ti nebude pohodlná. V „Ďalších možnostiach“ môžeš zväčšiť riadkovanie a zúžiť riadky: mnohým ľuďom to pomáha rovnako ako samotné zvýraznenie.",
          "Ak ťa to niektorý deň unavuje, vypni to. Je to tvoj spôsob čítania, nie pravidlo.",
        ],
        notes: [
          "Nefunguje to pre každého, a to je v poriadku. Daj tomu pár dní, kým sa rozhodneš.",
          "Ak máš pocit, že za tvojimi ťažkosťami môže byť ADHD alebo dyslexia, môže pomôcť porozprávať sa s odborníkom.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Pracovné listy na čítanie",
    nav: "Pracovné listy",
    intro:
      "Vytvor listy s veľkým písmom, zvýrazneným začiatkom každého slova a prívetivým rámčekom. Vyber si ukážkový text alebo napíš vlastný a potom ho vytlač alebo stiahni.",
    editor: "Uprav pracovný list",
    example: "Vyber text",
    titleLabel: "Nadpis",
    textLabel: "Text",
    theme: "Rámček",
    themes: {
      none: "Bez rámčeka",
      simple: "Jednoduchý",
      clouds: "Obláčiky",
      garden: "Záhrada",
      stars: "Hviezdy",
      vehicles: "Autá a nákladiaky",
    },
    size: "Veľkosť textu",
    sizes: ["Veľký", "Veľmi veľký", "Obrovský"],
    nameDate: "Pridať meno a dátum",
    name: "Meno",
    date: "Dátum",
    lines: "Riadky na písanie",
    linesOptions: ["Žiadne", "3 riadky", "6 riadkov", "10 riadkov"],
    preview: "Náhľad",
    showPageSize: "Zobraziť veľkosť strany",
    pageSizes: { portrait: "A4 na výšku (210 × 297 mm)", landscape: "A4 na šírku (297 × 210 mm)" },
    pageN: "Strana {n}",
    editHint:
      "Môžeš písať priamo do listu: klikni na nadpis alebo na text. Zvýraznenie sa použije, keď skončíš.",
    editTitle: "Nadpis pracovného listu",
    editText: "Text pracovného listu",
    print: "Vytlačiť alebo uložiť ako PDF",
    download: "Stiahnuť pracovný list",
    printHint:
      "Ak ho chceš uložiť ako PDF, vyber v dialógu tlače „Uložiť ako PDF“. Tlačí sa na bielom pozadí, aby sa šetril atrament.",
    downloadHint:
      "Stiahneš si webovú stránku, ktorú môžeš kedykoľvek otvoriť a vytlačiť, aj bez internetu.",
    fileName: "pracovny-list",
    tabs: { text: "Text", layout: "Rozloženie", emphasis: "Zvýraznenie" },
    myTexts: "Moje texty",
    save: "Uložiť do mojich textov",
    saved: "„{title}“ je uložený v mojich textoch.",
    remove: "Odstrániť z mojich textov",
    removed: "„{title}“ bol odstránený z mojich textov.",
    exportTexts: "Exportovať moje texty",
    importTexts: "Importovať texty",
    imported: "Importované texty: {n}.",
    importEmpty:
      "V tomto súbore nie sú žiadne texty. Použi súbor .md s nadpismi „## “ alebo súbor .txt.",
    libraryNote:
      "Tvoje texty sú uložené len v tomto prehliadači. Exportuj ich, ak si chceš nechať kópiu, zdieľať ich alebo ich preniesť do iného počítača.",
    exportHeading: "Moje texty na pracovné listy",
    levelKey: "Úroveň",
    textsFileName: "moje-texty-na-listy",
    orientation: "Orientácia",
    orientations: { portrait: "Na výšku", landscape: "Na šírku" },
    overflow:
      "Pracovný list pokračuje na druhej strane. Aby sa zmestil na jednu, skráť text, vyber menšie písmo alebo odstráň riadky.",
  },
  settings: {
    title: "Nastavenia čítania",
    open: "Otvoriť nastavenia čítania",
    close: "Zavrieť",
    note: "Platia pre ukážku, pracovné listy aj konvertor a ukladajú sa len v tomto prehliadači.",
    presets: "Moje uložené nastavenia",
    empty:
      "Zatiaľ tu nie sú žiadne uložené nastavenia. Pomenuj súčasné a vrátiš sa k nim jedným kliknutím.",
    name: "Názov",
    placeholder: "Napríklad: Čítanie v triede",
    save: "Uložiť",
    apply: "Použiť nastavenia „{name}“",
    remove: "Vymazať „{name}“",
    saved: "Nastavenia „{name}“ sú uložené.",
    removed: "„{name}“ je vymazané.",
    applied: "Teraz sa používa „{name}“.",
    reset: "Vrátiť predvolené nastavenia",
    restored: "Predvolené nastavenia sú obnovené.",
  },
  convert: {
    title: "Konvertovať knihu",
    intro:
      "Vyber knihu alebo dokument a stiahni si kópiu so zvýraznením. Súbor nikdy neopustí tvoje zariadenie: všetko sa deje v tomto prehliadači, bez obmedzenia veľkosti.",
    pick: "Vybrať súbor",
    drop: "alebo ho sem pretiahni",
    formats: "EPUB, TXT, Markdown alebo HTML",
    selected: "Vybraný súbor:",
    output: "Výstupný formát",
    outputs: { epub: "EPUB (e-kniha)", html: "HTML (webová stránka)", md: "Markdown" },
    options: "Ako zvýrazňovať",
    start: "Konvertovať",
    progress: "Konvertuje sa: {n} %",
    cancel: "Zrušiť",
    cancelled: "Konverzia je zrušená. Nič sa neuložilo.",
    done: "Hotovo. Tvoj súbor je pripravený.",
    download: "Stiahnuť {name}",
    errors: {
      unsupported: "Tento formát sa nedá konvertovať. Vyber súbor EPUB, TXT, Markdown alebo HTML.",
      drm: "Táto kniha má DRM (ochranu proti kopírovaniu), takže sa nedá konvertovať. Ak je kúpená, opýtaj sa v obchode, či ti môžu dať kópiu bez DRM.",
      invalid:
        "Tento súbor sa nepodarilo prečítať. Skontroluj, či sa otvorí v tvojej čítačke, alebo skús iný.",
      failed:
        "Konverzia sa nepodarila ({detail}). Ak sa to stane znova, daj nám, prosím, vedieť na GitHube.",
    },
    labels: { part: "Časť", contents: "Obsah" },
    steps: {
      choose: "Vyber knihu",
      adjust: "Uprav vzhľad",
      convert: "Konvertuj a stiahni",
    },
    previewTitle: "Takto sa bude tvoja kniha začínať",
    previewEmpty: "Vyber súbor a tu sa objaví jeho prvá strana so zvýraznením.",
    previewLoading: "Pripravuje sa náhľad…",
    previewNote: "Približný náhľad: každá čítačka zobrazuje knihu vlastným písmom a veľkosťou.",
    previewNone: "Na začiatku súboru sa nenašiel žiadny text, ale aj tak ho môžeš konvertovať.",
    change: "Vybrať iný súbor",
    devices: {
      heading: "Ako dostať knihu do čítačky",
      items: [
        {
          name: "Kindle",
          text: "Použi službu Amazon Send to Kindle (web, aplikácia alebo e-mail) a vyber súbor EPUB. Amazon ho pre tvoj Kindle upraví.",
        },
        {
          name: "Kobo",
          text: "Pripoj Kobo k počítaču káblom USB a skopíruj doň súbor EPUB. Čítačku odpoj a kniha sa objaví v knižnici.",
        },
        {
          name: "PocketBook",
          text: "Skopíruj súbor cez USB, rovnako ako pri Kobo, alebo ho pošli e-mailom cez službu Send-to-PocketBook.",
        },
      ],
      calibre:
        "Ak používaš Calibre, pridaj súbor do knižnice a pošli ho do čítačky ako ktorúkoľvek inú knihu.",
    },
  },
  pages: {
    privacy: {
      title: "Súkromie",
      body: [
        "Nezbierame žiadne údaje. Vôbec žiadne.",
        "Rozšírenie, tento web aj konvertor bežia celé v tvojom zariadení. Čo čítaš a aké súbory konvertuješ, sa nikam neposiela: nemáme žiadne servery.",
        "Nepoužívame analytiku, cookies, telemetriu ani písma a skripty z iných webov.",
        "Rozšírenie ukladá tvoje nastavenia (silu, štýl, weby, kde má byť vždy zapnuté) do úložiska tvojho vlastného prehliadača. Ak máš zapnutú synchronizáciu prehliadača, prehliadač ich môže kopírovať medzi tvojimi zariadeniami; my ich nikdy nevidíme.",
        "Rozšírenie žiada len o povolenia, ktoré potrebuje. O prístup ku konkrétnemu webu alebo ku všetkým webom požiada až vtedy, keď vyberieš „Vždy na tomto webe“ alebo „Na všetkých weboch“, a kedykoľvek ho môžeš odobrať.",
      ],
    },
    accessibility: {
      title: "Prístupnosť",
      body: [
        "Zvýraznenie nikdy nemení to, čo číta čítačka obrazovky: text je úplne rovnaký, znak po znaku. Overujeme to automatickými testami a pred každým vydaním aj v NVDA a VoiceOveri.",
        "Všetko sa dá ovládať len klávesnicou. Rozšírenie sa zapína a vypína skratkou Alt+B a skratku si môžeš zmeniť v nastaveniach prehliadača.",
        "Farby zvýraznenia vychádzajú z farby samotného textu, takže kontrast zostáva zachovaný vo svetlom aj tmavom režime aj v motíve každého webu.",
        "Tento web používa písmo Atkinson Hyperlegible, navrhnuté tak, aby sa písmená dali ľahko rozlíšiť, a riadi sa nastavením tmavého režimu a obmedzeného pohybu v tvojom systéme.",
        "Ak narazíš na bariéru, nahlás ju, prosím, na GitHube: je to chyba a tak s ňou budeme zaobchádzať.",
      ],
    },
  },
};
