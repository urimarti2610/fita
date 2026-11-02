import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Eesti";

export const slugs: Record<PageKey, string> = {
  uses: "kellele",
  worksheets: "toolehed",
  convert: "teisenda",
  privacy: "privaatsus",
  accessibility: "ligipaasetavus",
};

export const strings: Strings = {
  meta: {
    description:
      "Tasuta ja avatud lähtekoodiga lugemisabi ATH ja düsleksiaga inimestele: tõstab esile iga sõna alguse veebis ja sinu e-raamatutes. Kõik jääb sinu seadmesse.",
  },
  nav: {
    skip: "Liigu sisu juurde",
    home: "Avaleht",
    convert: "Teisenda raamat",
    privacy: "Privaatsus",
    accessibility: "Ligipääsetavus",
    github: "Lähtekood",
    language: "Keel",
    theme: {
      label: "Teema",
      light: "hele",
      dark: "tume",
    },
  },
  hero: {
    headline: "Loe omal moel",
    lede: "Tõstab õrnalt esile iga sõna alguse, et pilgul oleks kuhu toetuda. ATH või düsleksiaga inimestele ja kõigile, kellele see mugavam tundub. Tasuta, ilma kontota ja miski ei lahku kunagi sinu seadmest.",
  },
  install: {
    chrome: "Lisa Chrome'i või Edge'i",
    firefox: "Lisa Firefoxi",
    preview: "Poodides veel ei ole. Seni saad eelversiooni paigaldada GitHubist.",
  },
  demo: {
    heading: "Proovi oma tekstiga",
    intro: "Kleebi siia mis tahes tekst. Tulemus uueneb kohe ja pikkusepiirangut pole.",
    input: "Sinu tekst",
    output: "Kuidas see välja näeb",
    sample:
      "Lugemine peaks olema mugav. Mõni kaotab rea, jätab sõnu vahele või väsib enne lõigu lõppu. Kui iga sõna algus on esile tõstetud, saab pilk ankru: proovi eri tugevusi ja stiile, kuni leiad enda oma.",
    strength: "Tugevus",
    style: "Stiil",
    styles: {
      "bold-fade": "Paks ja tuhm",
      bold: "Paks kiri",
      color: "Värv",
      underline: "Allajoonimine",
      fade: "Tuhmista ülejäänu",
    },
    more: "Rohkem valikuid",
    every: "Tõsta esile",
    everyOptions: ["Iga sõna", "Iga teine sõna", "Iga kolmas sõna"],
    lineHeight: "Reavahe",
    maxWidth: "Suurim rea laius",
    pageDefault: "Tavaline",
    widths: ["Kitsas (50 märki)", "Keskmine (65 märki)", "Lai (80 märki)"],
  },
  privacy: {
    heading: "Miski ei lahku sinu seadmest",
    body: [
      "Laiendus, see leht ja raamatute teisendaja töötavad täielikult sinu brauseris. Pole serverit, kuhu midagi saata.",
      "Pole kontosid, analüütikat, küpsiseid ega kasutuspiiranguid.",
    ],
    more: "Loe privaatsuspõhimõtteid",
  },
  faq: {
    heading: "Küsimused",
    items: [
      {
        q: "Kas see päriselt töötab?",
        a: [
          "See sõltub inimesest. Seni avaldatud uuringud ei näita, et sellise esiletõstmisega loeksid inimesed keskmiselt kiiremini või saaksid paremini aru.",
          "Paljud aga ütlevad, et lugemine tundub mugavam, rida läheb harvemini kaotsi või on lihtsam alustada. Seepärast me kiirust ei luba: pakume abivahendit, mida saad kohandada või välja lülitada. Proovi demo ja jäta alles see, mis aitab.",
        ],
      },
      {
        q: "Kas see maksab midagi?",
        a: [
          "Ei, ega hakka kunagi maksma. Pole tasulist versiooni, sõnade arvu ega failisuuruse piirangut. See on vaba tarkvara Apache-2.0 litsentsi all.",
        ],
      },
      {
        q: "Kas saan seda kasutada oma e-raamatutega?",
        a: [
          "Jah. Jaotises „Teisenda raamat” valid EPUB-, TXT-, Markdown- või HTML-faili ja laadid alla esiletõstetud koopia. Teisendamine toimub sinu brauseris. DRM-kaitsega raamatuid teisendada ei saa.",
        ],
      },
      {
        q: "Kas see töötab igas keeles?",
        a: [
          "Kõigis keeltes, mis eraldavad sõnu tühikutega, ka paremalt vasakule kirjutatavates. Hiina, jaapani, tai ja muud tühikuteta kirjad jäävad muutmata.",
        ],
      },
      {
        q: "Mis siis, kui kasutan ekraanilugejat?",
        a: ["Tekst loetakse ette täpselt nagu varem: ühtegi märki ei lisata ega eemaldata."],
      },
      {
        q: "Kas see töötab mu telefonis?",
        a: ["Jah, Androidi Firefoxiga. Eraldi rakendus tuleb hiljem."],
      },
    ],
  },
  footer: {
    license: "Vaba tarkvara Apache-2.0 litsentsi all.",
  },
  uses: {
    title: "Kellele see on",
    intro:
      "Igaüks loeb omal moel. Siin on mõned viisid tööriista kasutamiseks olenevalt sellest, kes sa oled ja milleks seda vajad. Neil kõigil on üks ühine joon: see on vabatahtlik abivahend, mida saad kohandada või välja lülitada, ja see ei kogu mingeid andmeid.",
    homeHeading: "Kellele see on",
    how: "Kuidas kasutada",
    care: "Pea meeles",
    cases: [
      {
        id: "education",
        title: "Haridus",
        summary:
          "Õpetajatele, koolidele ja peredele, kes tahavad lugemismaterjali kohandada ilma uut loomata.",
        link: "Ideid klassiruumi ja koju",
        lede: "Õpetajatele, tugispetsialistidele ja peredele, kes soovivad, et lugemine nõuaks veidi vähem pingutust, ilma et peaks iga õpilase jaoks eraldi materjali ette valmistama.",
        steps: [
          "Kohanda olemasolevat materjali: teisenda lugemistekstid, konspektid või raamatud EPUB-, TXT-, Markdown- või HTML-vormingus ja jaga neid nii, nagu need on.",
          "Näita tunnis demot päeva tekstiga suurel ekraanil ja proovige koos eri tugevusi ja stiile. Las iga õpilane ütleb, mis talle kõige mugavam on.",
          "Kooliarvutites töötab laiendus ilma kontode ja registreerimiseta ega kogu õpilaste kohta mingeid andmeid.",
          "Tee jaotises „Töölehed” suure kirja ja sõbraliku raamiga lugemistöölehti, siis prindi need või salvesta PDF-ina.",
          "Kodus aitab sama laiendus kodutööde ja veebis lugemise juures.",
        ],
        notes: [
          "See on vabatahtlik abivahend: mõnda õpilast see aitab, teisi mitte. Las igaüks valib ise ja lülitab selle soovi korral välja.",
          "See ei asenda hariduslikku tuge ega õpiraskuste diagnoosimist.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopeedid ja teised spetsialistid",
        summary:
          "Logopeedidele, psühholoogidele ja nõustajatele, kes otsivad lihtsat tööriista, mida kohtumistel proovida.",
        link: "Kuidas seda kohtumistel kasutada",
        lede: "Logopeedidele, eripedagoogidele, psühholoogidele, nõustajatele ja teistele spetsialistidele, kes toetavad lugemisraskustega inimesi.",
        steps: [
          "Kleebi kohtumisel tekst demosse ja proovi koos inimesega mitut seadistust. Pane kirja, milline tundub kõige mugavam: tugevus, stiil, esiletõstetud sõnad, reavahe.",
          "Valmista teisendajaga ette töömaterjal ja jaga seda paberil, ekraanil või e-lugeris.",
          "Soovita laiendust kodus kasutamiseks koos seadistustega, mille koos valisite.",
          "Kõik toimub seadmes: ükski tekst ega kliendi andmed ei liigu kunagi läbi serveri.",
        ],
        notes: [
          "See ei ole teraapia ega lugemise sekkumismeetod. See võib olla üks tugi sinu töös.",
          "Uuringud ei näita keskmist kiiruse ega mõistmise paranemist. Tutvusta seda mugavuse ja eelistuse küsimusena ning hinda iga juhtumit eraldi.",
        ],
      },
      {
        id: "adults",
        title: "Täiskasvanud",
        summary:
          "Neile, kes tahavad uuesti lugemise juurde tagasi tulla, aga ei suuda keskenduda, kaotavad rea või väsivad kiiresti.",
        link: "Kuidas alustada",
        lede: "Kui tahaksid rohkem lugeda, aga sul on raske alustada, kaotad rea, loed sama lauset kolm korda või väsid juba teisel leheküljel, võib see aidata. Ja kui ei aita, pole ka midagi.",
        steps: [
          "Paigalda laiendus ja lülita see Alt+B-ga sisse mõne sind huvitava artikli peal. Alusta lühikestest tekstidest.",
          "Teisenda raamat, mida päriselt lugeda tahad, ja pane see oma e-lugerisse või telefoni.",
          "Sea tugevust, kuni see tundub mugav. „Rohkem valikuid” alt saad lisada reavahet ja ridu kitsamaks teha: paljusid aitab see sama palju kui esiletõstmine.",
          "Kui see mõnel päeval väsitab, lülita välja. See on sinu lugemisviis, mitte reegel.",
        ],
        notes: [
          "See ei sobi kõigile ja see on täiesti okei. Anna sellele paar päeva, enne kui otsustad.",
          "Kui arvad, et sinu raskuste taga võib olla ATH või düsleksia, võib spetsialistiga rääkimine aidata.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Lugemise töölehed",
    nav: "Töölehed",
    intro:
      "Tee töölehti suure kirja, esile tõstetud sõnaalguste ja sõbraliku raamiga. Vali näidistekst või kirjuta oma, siis prindi või laadi alla.",
    editor: "Kohanda töölehte",
    example: "Vali tekst",
    titleLabel: "Pealkiri",
    textLabel: "Tekst",
    theme: "Raam",
    themes: {
      none: "Raamita",
      simple: "Lihtne",
      clouds: "Pilved",
      garden: "Aed",
      stars: "Tähed",
      vehicles: "Autod ja veokid",
    },
    size: "Teksti suurus",
    sizes: ["Suur", "Väga suur", "Hiiglaslik"],
    nameDate: "Lisa nimi ja kuupäev",
    name: "Nimi",
    date: "Kuupäev",
    lines: "Read kirjutamiseks",
    linesOptions: ["Ilma", "3 rida", "6 rida", "10 rida"],
    preview: "Eelvaade",
    showPageSize: "Näita lehe suurust",
    pageSizes: { portrait: "A4 püstine (210 × 297 mm)", landscape: "A4 rõhtne (297 × 210 mm)" },
    pageN: "Lehekülg {n}",
    editHint:
      "Võid kirjutada otse töölehele: klõpsa pealkirjal või tekstil. Esiletõst lisatakse, kui oled lõpetanud.",
    editTitle: "Töölehe pealkiri",
    editText: "Töölehe tekst",
    print: "Prindi või salvesta PDF-ina",
    download: "Laadi tööleht alla",
    printHint:
      "PDF-ina salvestamiseks vali printimisaknas „Salvesta PDF-ina”. Tindi säästmiseks prinditakse valgele taustale.",
    downloadHint:
      "Allalaaditav fail on veebileht, mida saad avada ja printida millal tahes, ka ilma internetita.",
    fileName: "toleht",
    tabs: { text: "Tekst", layout: "Paigutus", emphasis: "Esiletõst" },
    myTexts: "Minu tekstid",
    save: "Salvesta minu tekstidesse",
    saved: "„{title}” on salvestatud minu tekstidesse.",
    remove: "Eemalda minu tekstidest",
    removed: "„{title}” eemaldati minu tekstidest.",
    exportTexts: "Ekspordi minu tekstid",
    importTexts: "Impordi tekste",
    imported: "Imporditud tekste: {n}.",
    importEmpty: "Selles failis pole tekste. Kasuta „## ” pealkirjadega .md-faili või .txt-faili.",
    libraryNote:
      "Sinu tekstid on salvestatud ainult selles brauseris. Ekspordi need, et hoida koopiat, neid jagada või teise arvutisse viia.",
    exportHeading: "Minu töölehtede tekstid",
    levelKey: "Tase",
    textsFileName: "minu-toolehtede-tekstid",
    orientation: "Suund",
    orientations: { portrait: "Püstine", landscape: "Rõhtne" },
    overflow:
      "Tööleht läheb teisele leheküljele. Et see mahuks ühele, lühenda teksti, vali väiksem teksti suurus või eemalda read.",
  },
  settings: {
    title: "Lugemisseaded",
    open: "Ava lugemisseaded",
    close: "Sulge",
    note: "Need kehtivad demo, töölehtede ja teisendaja kohta ning on salvestatud ainult selles brauseris.",
    presets: "Minu salvestatud seaded",
    empty:
      "Sa pole veel ühtegi seadet salvestanud. Anna praegustele seadetele nimi, et saaksid nende juurde ühe klõpsuga tagasi tulla.",
    name: "Nimi",
    placeholder: "Näiteks: lugemine tunnis",
    save: "Salvesta",
    apply: "Kasuta seadeid „{name}”",
    remove: "Kustuta „{name}”",
    saved: "Seaded „{name}” on salvestatud.",
    removed: "„{name}” on kustutatud.",
    applied: "Kasutusel on nüüd „{name}”.",
    reset: "Taasta vaikeseaded",
    restored: "Vaikeseaded on taastatud.",
  },
  convert: {
    title: "Teisenda raamat",
    intro:
      "Vali raamat või dokument ja laadi alla esiletõstetud koopia. Fail ei lahku kunagi sinu seadmest: kõik toimub selles brauseris ja suurusepiirangut pole.",
    pick: "Vali fail",
    drop: "või lohista see siia",
    formats: "EPUB, TXT, Markdown või HTML",
    selected: "Valitud fail:",
    output: "Väljundvorming",
    outputs: { epub: "EPUB (e-raamat)", html: "HTML (veebileht)", md: "Markdown" },
    options: "Kuidas esile tõsta",
    start: "Teisenda",
    progress: "Teisendan: {n} %",
    cancel: "Loobu",
    cancelled: "Teisendamine katkestati. Midagi ei salvestatud.",
    done: "Tehtud. Sinu fail on valmis.",
    download: "Laadi alla {name}",
    errors: {
      unsupported: "Seda vormingut ei saa teisendada. Vali EPUB-, TXT-, Markdown- või HTML-fail.",
      drm: "Sellel raamatul on DRM (kopeerimiskaitse), seega seda ei saa teisendada. Kui ostsid selle, küsi poest, kas nad saavad anda DRM-ita koopia.",
      invalid:
        "Seda faili ei õnnestunud lugeda. Kontrolli, kas see avaneb sinu e-lugeris, või proovi mõnda teist.",
      failed:
        "Teisendamine ebaõnnestus ({detail}). Kui see juhtub uuesti, anna meile palun GitHubis teada.",
    },
    labels: { part: "Osa", contents: "Sisukord" },
    steps: {
      choose: "Vali raamat",
      adjust: "Sea välimus paika",
      convert: "Teisenda ja laadi alla",
    },
    previewTitle: "Nii algab sinu raamat",
    previewEmpty: "Vali fail ja siia ilmub selle esimene lehekülg koos esiletõstuga.",
    previewLoading: "Valmistan eelvaadet…",
    previewNote: "Ligikaudne vaade: iga e-luger näitab raamatut oma fondi ja suurusega.",
    previewNone: "Faili algusest ei leitud teksti, aga saad selle siiski teisendada.",
    change: "Vali teine fail",
    devices: {
      heading: "Kuidas raamat e-lugerisse saada",
      items: [
        {
          name: "Kindle",
          text: "Kasuta Amazoni teenust Send to Kindle (veebileht, rakendus või e-post) ja vali EPUB-fail. Amazon kohandab selle sinu Kindle'i jaoks.",
        },
        {
          name: "Kobo",
          text: "Ühenda Kobo USB-kaabliga arvutiga ja kopeeri EPUB sinna. Ühenda seade turvaliselt lahti ja raamat ilmub sinu raamatukokku.",
        },
        {
          name: "PocketBook",
          text: "Kopeeri see USB kaudu nagu Kobo puhul või saada e-postiga teenuse Send-to-PocketBook abil.",
        },
      ],
      calibre:
        "Kui kasutad Calibre'it, lisa fail oma raamatukokku ja saada see e-lugerisse nagu iga teine raamat.",
    },
  },
  pages: {
    privacy: {
      title: "Privaatsus",
      body: [
        "Me ei kogu mingeid andmeid. Mitte ühtegi.",
        "Laiendus, see veebisait ja teisendaja töötavad täielikult sinu seadmes. Seda, mida loed, ja faile, mida teisendad, ei saadeta kunagi kuhugi: meil pole servereid.",
        "Me ei kasuta analüütikat, küpsiseid, telemeetriat ega teistelt saitidelt pärit fonte ja skripte.",
        "Laiendus hoiab sinu seadeid (tugevus, stiil, saidid, kus soovid seda alati sees hoida) sinu enda brauseri salvestusruumis. Kui brauseri sünkroonimine on sisse lülitatud, võib brauser need sinu seadmete vahel kopeerida; meie neid kunagi ei näe.",
        "Laiendus küsib ainult neid õigusi, mida tal vaja on. Juurdepääsu konkreetsele saidile või kõigile saitidele küsitakse alles siis, kui valid „Alati sellel saidil” või „Kõigil saitidel”, ja saad selle igal ajal tagasi võtta.",
      ],
    },
    accessibility: {
      title: "Ligipääsetavus",
      body: [
        "Esiletõst ei muuda kunagi seda, mida ekraanilugeja ette loeb: tekst on täpselt sama, märk-märgilt. Kontrollime seda automaattestidega ning enne iga väljalaset ka NVDA ja VoiceOveriga.",
        "Kõik toimib ainult klaviatuuriga. Laienduse saab sisse ja välja lülitada klahvidega Alt+B ning kiirklahvi saad muuta brauseri seadetes.",
        "Esiletõstu värvid tuletatakse teksti enda värvist, nii et kontrast püsib heledas ja tumedas režiimis ning iga saidi oma teemas.",
        "See veebisait kasutab kirjatüüpi Atkinson Hyperlegible, mis on loodud selleks, et tähti oleks lihtne eristada, ning järgib sinu süsteemi tumeda režiimi ja vähendatud liikumise eelistusi.",
        "Kui satud mõne takistuse otsa, ava palun GitHubis teade (issue): see on viga ja me käsitleme seda veana.",
      ],
    },
  },
};
