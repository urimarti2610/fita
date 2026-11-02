import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Slovenščina";

export const slugs: Record<PageKey, string> = {
  uses: "za-koga",
  worksheets: "delovni-listi",
  convert: "pretvori",
  privacy: "zasebnost",
  accessibility: "dostopnost",
};

export const strings: Strings = {
  meta: {
    description:
      "Brezplačen pripomoček za branje z odprto kodo za ljudi z ADHD in disleksijo: poudari začetek vsake besede na spletu in v tvojih e-knjigah. Vse ostane v tvoji napravi.",
  },
  nav: {
    skip: "Preskoči na vsebino",
    home: "Domov",
    convert: "Pretvori knjigo",
    privacy: "Zasebnost",
    accessibility: "Dostopnost",
    github: "Izvorna koda",
    language: "Jezik",
    theme: {
      label: "Tema",
      light: "svetla",
      dark: "temna",
    },
  },
  hero: {
    headline: "Beri po svoje",
    lede: "Nežno poudari začetek vsake besede, da se pogled lahko nekam ujame. Za ljudi z ADHD, disleksijo in za vse, ki jim je tako udobneje. Brezplačno, brez računa in nič ne zapusti tvoje naprave.",
  },
  install: {
    chrome: "Dodaj v Chrome ali Edge",
    firefox: "Dodaj v Firefox",
    preview: "V trgovinah še ni na voljo. Do takrat lahko preizkusno različico namestiš z GitHuba.",
  },
  demo: {
    heading: "Preizkusi na svojem besedilu",
    intro: "Prilepi poljubno besedilo. Rezultat se spremeni takoj in dolžina ni omejena.",
    input: "Tvoje besedilo",
    output: "Kako se bere",
    sample:
      "Branje naj bo udobno. Nekateri izgubijo mesto v besedilu, preskakujejo besede ali se utrudijo še pred koncem odstavka. Poudarjen začetek vsake besede da pogledu oporo: preizkušaj različne jakosti in sloge, dokler ne najdeš svojega.",
    strength: "Jakost",
    style: "Slog",
    styles: {
      "bold-fade": "Krepko in zatemnjeno",
      bold: "Krepko",
      color: "Barva",
      underline: "Podčrtano",
      fade: "Zatemni preostanek",
    },
    more: "Več možnosti",
    every: "Poudari",
    everyOptions: ["Vsako besedo", "Vsako drugo besedo", "Vsako tretjo besedo"],
    lineHeight: "Razmik med vrsticami",
    maxWidth: "Največja širina vrstice",
    pageDefault: "Običajno",
    widths: ["Ozka (50 znakov)", "Srednja (65 znakov)", "Široka (80 znakov)"],
  },
  privacy: {
    heading: "Nič ne zapusti tvoje naprave",
    body: [
      "Razširitev, ta stran in pretvornik knjig delujejo v celoti v tvojem brskalniku. Ni strežnika, na katerega bi lahko karkoli poslali.",
      "Brez računov, brez analitike, brez piškotkov in brez omejitev uporabe.",
    ],
    more: "Preberi pravilnik o zasebnosti",
  },
  faq: {
    heading: "Vprašanja",
    items: [
      {
        q: "Ali res deluje?",
        a: [
          "Odvisno od osebe. Doslej objavljene študije ne kažejo, da bi ljudje s takim poudarjanjem v povprečju brali hitreje ali bolje razumeli.",
          "Veliko ljudi pa pove, da jim je branje udobnejše, da manjkrat izgubijo mesto v besedilu ali da lažje začnejo. Zato ne obljubljamo hitrosti: ponujamo pripomoček, ki ga lahko prilagodiš ali izklopiš. Preizkusi predstavitev in obdrži, kar ti pomaga.",
        ],
      },
      {
        q: "Ali kaj stane?",
        a: [
          "Ne in nikoli ne bo. Brez plačljive različice, brez omejitve besed, brez omejitve velikosti datoteke. Gre za prosto programje z licenco MPL-2.0.",
        ],
      },
      {
        q: "Ali ga lahko uporabljam s svojimi e-knjigami?",
        a: [
          "Da. V razdelku „Pretvori knjigo“ izbereš datoteko EPUB, TXT, Markdown ali HTML in preneseš kopijo s poudarki. Pretvorba poteka v tvojem brskalniku. Knjig z DRM ni mogoče pretvoriti.",
        ],
      },
      {
        q: "Ali deluje v vseh jezikih?",
        a: [
          "V vseh jezikih, ki besede ločujejo s presledki, tudi v pisavah, ki se pišejo od desne proti levi. Kitajščina, japonščina, tajščina in druge pisave brez presledkov ostanejo nespremenjene.",
        ],
      },
      {
        q: "Kaj pa, če uporabljam bralnik zaslona?",
        a: ["Besedilo se prebere natanko tako kot prej: noben znak ni dodan ali odstranjen."],
      },
      {
        q: "Ali deluje na telefonu?",
        a: ["Da, v Firefoxu za Android. Samostojna aplikacija pride pozneje."],
      },
    ],
  },
  footer: {
    license: "Prosto programje z licenco MPL-2.0.",
  },
  uses: {
    title: "Za koga je",
    intro:
      "Vsak bere na svoj način. Tukaj je nekaj zamisli, kako uporabljati orodje, odvisno od tega, kdo si in za kaj ga potrebuješ. Vse imajo nekaj skupnega: gre za neobvezen pripomoček, ki ga lahko prilagodiš ali izklopiš, in ne zbira nobenih podatkov.",
    homeHeading: "Za koga je",
    how: "Kako ga uporabljati",
    care: "Upoštevaj",
    cases: [
      {
        id: "education",
        title: "Izobraževanje",
        summary:
          "Za učitelje, šole in družine, ki želijo prilagoditi gradivo za branje, ne da bi pripravljali novega.",
        link: "Zamisli za razred in dom",
        lede: "Za učitelje, svetovalne službe in družine, ki želijo, da bi branje zahtevalo malo manj napora, ne da bi za vsakega učenca pripravljali drugačno gradivo.",
        steps: [
          "Prilagodi gradivo, ki ga že imaš: pretvori berila, zapiske ali knjige v obliki EPUB, TXT, Markdown ali HTML in jih deli takšne, kot so.",
          "Pri pouku projiciraj predstavitev z besedilom dneva in skupaj preizkusite različne jakosti in sloge. Naj vsak učenec pove, kaj mu je najbolj udobno.",
          "Na šolskih računalnikih razširitev deluje brez računov in registracije ter ne zbira nobenih podatkov o učencih.",
          "V razdelku „Delovni listi“ pripraviš liste za branje z velikimi črkami in prijaznim okvirjem ter jih natisneš ali shraniš kot PDF.",
          "Doma ista razširitev pomaga pri domačih nalogah in branju na spletu.",
        ],
        notes: [
          "Gre za neobvezen pripomoček: nekaterim učencem pomaga, drugim ne. Naj vsak izbere sam in ga izklopi, če želi.",
          "Ne nadomešča učne pomoči ali diagnostike učnih težav.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopedi in drugi strokovnjaki",
        summary:
          "Za logopede, specialne pedagoge in šolske svetovalce, ki iščejo preprosto orodje, ki ga lahko preizkusijo med srečanji.",
        link: "Kako ga uporabljati med srečanji",
        lede: "Za logopede, specialne pedagoge, šolske svetovalce in druge strokovnjake, ki podpirajo ljudi s težavami pri branju.",
        steps: [
          "Med srečanjem prilepi besedilo v predstavitev in skupaj preizkusita več nastavitev. Zapiši si, katera je najbolj udobna: jakost, slog, poudarjene besede, razmik med vrsticami.",
          "Pripravi delovno gradivo s pretvornikom in ga daj na papirju, na zaslonu ali na bralniku e-knjig.",
          "Priporoči razširitev za domačo uporabo, z nastavitvami, izbranimi skupaj.",
          "Vse deluje v napravi: nobeno besedilo ali podatki o klientih nikoli ne gredo prek strežnika.",
        ],
        notes: [
          "To ni zdravljenje ali metoda intervencije pri branju. Lahko je ena od opor pri tvojem delu.",
          "Študije ne kažejo povprečnega izboljšanja hitrosti ali razumevanja. Predstavi ga kot stvar udobja in osebne izbire ter ga presojaj od primera do primera.",
        ],
      },
      {
        id: "adults",
        title: "Odrasli",
        summary:
          "Za ljudi, ki bi radi spet brali, a se ne morejo zbrati, izgubljajo mesto v besedilu ali se hitro utrudijo.",
        link: "Kako začeti",
        lede: "Če želiš brati več, pa težko začneš, izgubljaš mesto v besedilu, isti stavek prebereš trikrat ali se utrudiš že na drugi strani, ti to morda pomaga. Če ne, je tudi v redu.",
        steps: [
          "Namesti razširitev in jo vklopi z bližnjico Alt+B na članku, ki te zanima. Začni s kratkimi besedili.",
          "Pretvori knjigo, ki jo res želiš prebrati, in jo naloži na bralnik ali telefon.",
          "Prilagajaj jakost, dokler ti ne bo udobno. Pod „Več možnosti“ lahko povečaš razmik med vrsticami in zožiš vrstice: mnogim to pomaga prav toliko kot poudarjanje.",
          "Če te kakšen dan utruja, ga izklopi. To je tvoj način branja, ne pravilo.",
        ],
        notes: [
          "Ne deluje pri vseh in to je v redu. Daj si nekaj dni, preden se odločiš.",
          "Če misliš, da so za tvojimi težavami morda ADHD ali disleksija, ti lahko pomaga pogovor s strokovnjakom.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Delovni listi za branje",
    nav: "Delovni listi",
    intro:
      "Pripravi liste z velikimi črkami, poudarjenim začetkom vsake besede in prijaznim okvirjem. Izberi vzorčno besedilo ali napiši svoje, nato ga natisni ali prenesi.",
    editor: "Prilagodi delovni list",
    example: "Izberi besedilo",
    titleLabel: "Naslov",
    textLabel: "Besedilo",
    theme: "Okvir",
    themes: {
      none: "Brez okvirja",
      simple: "Preprost",
      clouds: "Oblački",
      garden: "Vrt",
      stars: "Zvezde",
      vehicles: "Avtomobili in tovornjaki",
    },
    size: "Velikost besedila",
    sizes: ["Velika", "Zelo velika", "Ogromna"],
    nameDate: "Dodaj ime in datum",
    name: "Ime",
    date: "Datum",
    lines: "Črte za pisanje",
    linesOptions: ["Brez", "3 črte", "6 črt", "10 črt"],
    preview: "Predogled",
    showPageSize: "Pokaži velikost strani",
    pageSizes: { portrait: "A4 pokončno (210 × 297 mm)", landscape: "A4 ležeče (297 × 210 mm)" },
    pageN: "Stran {n}",
    editHint:
      "Pišeš lahko kar na list: klikni naslov ali besedilo. Poudarki se uporabijo, ko končaš.",
    editTitle: "Naslov delovnega lista",
    editText: "Besedilo delovnega lista",
    print: "Natisni ali shrani kot PDF",
    download: "Prenesi delovni list",
    printHint:
      "Če ga želiš shraniti kot PDF, v oknu za tiskanje izberi „Shrani kot PDF“. Natisne se na belem ozadju, da varčuješ s črnilom.",
    downloadHint:
      "Preneseš spletno stran, ki jo lahko kadar koli odpreš in natisneš, tudi brez povezave.",
    fileName: "delovni-list",
    tabs: { text: "Besedilo", layout: "Postavitev", emphasis: "Poudarki" },
    myTexts: "Moja besedila",
    save: "Shrani med moja besedila",
    saved: "„{title}“ je shranjeno med mojimi besedili.",
    remove: "Odstrani iz mojih besedil",
    removed: "„{title}“ je odstranjeno iz mojih besedil.",
    exportTexts: "Izvozi moja besedila",
    importTexts: "Uvozi besedila",
    imported: "Uvožena besedila: {n}.",
    importEmpty:
      "V tej datoteki ni besedil. Uporabi datoteko .md z naslovi „## “ ali datoteko .txt.",
    libraryNote:
      "Tvoja besedila so shranjena samo v tem brskalniku. Izvozi jih, če želiš imeti kopijo, jih deliti ali prenesti na drug računalnik.",
    exportHeading: "Moja besedila za delovne liste",
    levelKey: "Raven",
    textsFileName: "moja-besedila-za-liste",
    orientation: "Usmerjenost",
    orientations: { portrait: "Pokončno", landscape: "Ležeče" },
    overflow:
      "Delovni list se nadaljuje na drugi strani. Da bi šel na eno, skrajšaj besedilo, izberi manjšo velikost besedila ali odstrani črte.",
  },
  settings: {
    title: "Nastavitve branja",
    open: "Odpri nastavitve branja",
    close: "Zapri",
    note: "Veljajo za predstavitev, delovne liste in pretvornik ter so shranjene samo v tem brskalniku.",
    presets: "Moje shranjene nastavitve",
    empty: "Shranjenih nastavitev še ni. Poimenuj trenutne in se k njim vrni z enim klikom.",
    name: "Ime",
    placeholder: "Na primer: Branje v razredu",
    save: "Shrani",
    apply: "Uporabi nastavitve „{name}“",
    remove: "Izbriši „{name}“",
    saved: "Nastavitve „{name}“ so shranjene.",
    removed: "„{name}“ je izbrisano.",
    applied: "Zdaj v uporabi: „{name}“.",
    reset: "Nazaj na privzete nastavitve",
    restored: "Privzete nastavitve so obnovljene.",
  },
  convert: {
    title: "Pretvori knjigo",
    intro:
      "Izberi knjigo ali dokument in prenesi kopijo s poudarki. Datoteka nikoli ne zapusti tvoje naprave: vse se zgodi v tem brskalniku, brez omejitve velikosti.",
    pick: "Izberi datoteko",
    drop: "ali jo spusti sem",
    formats: "EPUB, TXT, Markdown ali HTML",
    selected: "Izbrana datoteka:",
    output: "Izhodna oblika",
    outputs: { epub: "EPUB (e-knjiga)", html: "HTML (spletna stran)", md: "Markdown" },
    options: "Kako poudarjati",
    start: "Pretvori",
    progress: "Pretvarjanje: {n} %",
    cancel: "Prekliči",
    cancelled: "Pretvorba je preklicana. Nič ni bilo shranjeno.",
    done: "Končano. Tvoja datoteka je pripravljena.",
    download: "Prenesi {name}",
    errors: {
      unsupported: "Te oblike ni mogoče pretvoriti. Izberi datoteko EPUB, TXT, Markdown ali HTML.",
      drm: "Ta knjiga ima DRM (zaščito pred kopiranjem), zato je ni mogoče pretvoriti. Če je kupljena, vprašaj v trgovini, ali ti lahko dajo kopijo brez DRM.",
      invalid:
        "Te datoteke ni bilo mogoče prebrati. Preveri, ali se odpre v tvojem bralniku, ali poskusi z drugo.",
      failed: "Pretvorba ni uspela ({detail}). Če se zgodi znova, nam prosim sporoči na GitHubu.",
    },
    labels: { part: "Del", contents: "Kazalo" },
    steps: {
      choose: "Izberi knjigo",
      adjust: "Prilagodi videz",
      convert: "Pretvori in prenesi",
    },
    previewTitle: "Tako se bo začela tvoja knjiga",
    previewEmpty: "Izberi datoteko in tukaj se bo prikazala njena prva stran s poudarki.",
    previewLoading: "Pripravljam predogled…",
    previewNote: "Približen prikaz: vsak bralnik pokaže knjigo s svojo pisavo in velikostjo.",
    previewNone: "Na začetku datoteke ni bilo najdenega besedila, a jo vseeno lahko pretvoriš.",
    change: "Izberi drugo datoteko",
    devices: {
      heading: "Kako jo prenesti na bralnik",
      items: [
        {
          name: "Kindle",
          text: "Uporabi Amazonovo storitev Send to Kindle (spletna stran, aplikacija ali e-pošta) in izberi datoteko EPUB. Amazon jo prilagodi za tvoj Kindle.",
        },
        {
          name: "Kobo",
          text: "Kobo poveži z računalnikom s kablom USB in nanj kopiraj datoteko EPUB. Izvrzi ga in knjiga se prikaže v knjižnici.",
        },
        {
          name: "PocketBook",
          text: "Kopiraj jo prek USB, kot pri Kobu, ali jo pošlji po e-pošti s storitvijo Send-to-PocketBook.",
        },
      ],
      calibre:
        "Če uporabljaš Calibre, dodaj datoteko v knjižnico in jo pošlji na bralnik kot vsako drugo knjigo.",
    },
  },
  pages: {
    privacy: {
      title: "Zasebnost",
      body: [
        "Ne zbiramo nobenih podatkov. Prav nobenih.",
        "Razširitev, ta spletna stran in pretvornik delujejo v celoti v tvoji napravi. Kar bereš, in datoteke, ki jih pretvarjaš, se nikamor ne pošiljajo: nimamo strežnikov.",
        "Ne uporabljamo analitike, piškotkov, telemetrije ali pisav in skript z drugih strani.",
        "Razširitev shranjuje tvoje nastavitve (jakost, slog, strani, kjer naj bo vedno vklopljena) v shrambo tvojega lastnega brskalnika. Če je sinhronizacija brskalnika vklopljena, jih brskalnik lahko kopira med tvojimi napravami; mi jih nikoli ne vidimo.",
        "Razširitev zahteva samo dovoljenja, ki jih potrebuje. Dostop do določene strani ali do vseh strani zahteva šele, ko izbereš „Vedno na tej strani“ ali „Na vseh straneh“, in ga lahko kadar koli prekličeš.",
      ],
    },
    accessibility: {
      title: "Dostopnost",
      body: [
        "Poudarjanje nikoli ne spremeni tega, kar prebere bralnik zaslona: besedilo je popolnoma enako, znak za znakom. To preverjamo s samodejnimi testi ter pred vsako izdajo še z NVDA in VoiceOverjem.",
        "Vse deluje samo s tipkovnico. Razširitev vklopiš in izklopiš z bližnjico Alt+B, bližnjico pa lahko spremeniš v nastavitvah brskalnika.",
        "Barve poudarkov izhajajo iz barve samega besedila, zato kontrast ostane ohranjen v svetlem in temnem načinu ter v temi vsake strani.",
        "Ta spletna stran uporablja pisavo Atkinson Hyperlegible, zasnovano tako, da se črke jasno razlikujejo, in upošteva sistemske nastavitve za temni način in zmanjšano gibanje.",
        "Če naletiš na oviro, prosim odpri zahtevek (issue) na GitHubu: to je napaka in tako jo bomo tudi obravnavali.",
      ],
    },
  },
};
