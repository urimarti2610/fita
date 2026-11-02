import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Latviešu";

export const slugs: Record<PageKey, string> = {
  uses: "kam-tas-noder",
  worksheets: "darba-lapas",
  convert: "konvertet",
  privacy: "privatums",
  accessibility: "pieejamiba",
};

export const strings: Strings = {
  meta: {
    description:
      "Bezmaksas atvērtā koda lasīšanas palīgs cilvēkiem ar UDHS un disleksiju: izceļ katra vārda sākumu tīmeklī un tavās e-grāmatās. Viss paliek tavā ierīcē.",
  },
  nav: {
    skip: "Pāriet uz saturu",
    home: "Sākums",
    convert: "Konvertēt grāmatu",
    privacy: "Privātums",
    accessibility: "Pieejamība",
    github: "Pirmkods",
    language: "Valoda",
    theme: {
      label: "Motīvs",
      light: "gaišs",
      dark: "tumšs",
    },
  },
  hero: {
    headline: "Lasi savā veidā",
    lede: "Maigi izceļ katra vārda sākumu, lai acīm būtu kur atbalstīties. Cilvēkiem ar UDHS, disleksiju vai ikvienam, kam tā ir ērtāk. Bez maksas, bez kontiem, un nekas neatstāj tavu ierīci.",
  },
  install: {
    chrome: "Pievienot Chrome vai Edge",
    firefox: "Pievienot Firefox",
    preview:
      "Veikalos tas vēl nav pieejams. Pagaidām vari instalēt izmēģinājuma versiju no GitHub.",
  },
  demo: {
    heading: "Izmēģini ar savu tekstu",
    intro: "Ielīmē jebkuru tekstu. Rezultāts mainās uzreiz, un garuma ierobežojuma nav.",
    input: "Tavs teksts",
    output: "Kā tas lasās",
    sample:
      "Lasīšanai vajadzētu būt ērtai. Daži cilvēki pazaudē rindu, izlaiž vārdus vai nogurst, pirms rindkopa beigusies. Ja iezīmē katra vārda sākumu, acīm ir atbalsta punkts: izmēģini dažādu stiprumu un stilus, līdz atrodi savējo.",
    strength: "Stiprums",
    style: "Stils",
    styles: {
      "bold-fade": "Treknraksts un blāvums",
      bold: "Treknraksts",
      color: "Krāsa",
      underline: "Pasvītrojums",
      fade: "Pārējais blāvāks",
    },
    more: "Vairāk iespēju",
    every: "Izcelt",
    everyOptions: ["Katru vārdu", "1 no katriem 2 vārdiem", "1 no katriem 3 vārdiem"],
    lineHeight: "Rindstarpa",
    maxWidth: "Maksimālais rindas platums",
    pageDefault: "Parasts",
    widths: ["Šaurs (50 rakstzīmes)", "Vidējs (65 rakstzīmes)", "Plats (80 rakstzīmes)"],
  },
  privacy: {
    heading: "Nekas neatstāj tavu ierīci",
    body: [
      "Paplašinājums, šī lapa un grāmatu konvertētājs darbojas tikai tavā pārlūkā. Nav servera, uz kuru kaut ko sūtīt.",
      "Nav kontu, nav analītikas, nav sīkdatņu un nav lietošanas ierobežojumu.",
    ],
    more: "Lasīt privātuma politiku",
  },
  faq: {
    heading: "Jautājumi",
    items: [
      {
        q: "Vai tas tiešām darbojas?",
        a: [
          "Tas atkarīgs no cilvēka. Līdz šim publicētie pētījumi nerāda, ka ar šādu izcēlumu cilvēki vidēji lasītu ātrāk vai saprastu vairāk.",
          "Taču daudzi stāsta, ka lasīt kļūst ērtāk, ka viņi retāk pazaudē vietu tekstā vai ka vieglāk sākt. Tāpēc mēs nesolām ātrumu: piedāvājam palīgu, ko vari pielāgot vai izslēgt. Izmēģini demonstrāciju un paturi to, kas palīdz.",
        ],
      },
      {
        q: "Vai tas kaut ko maksā?",
        a: [
          "Nē, un nekad nemaksās. Nav maksas versijas, nav vārdu ierobežojuma, nav faila izmēra ierobežojuma. Tā ir brīvā programmatūra ar Apache-2.0 licenci.",
        ],
      },
      {
        q: "Vai to var izmantot ar manām e-grāmatām?",
        a: [
          "Jā. Sadaļā „Konvertēt grāmatu” izvēlies EPUB, TXT, Markdown vai HTML failu un lejupielādē kopiju ar izcēlumu. Konvertēšana notiek tavā pārlūkā. Grāmatas ar DRM konvertēt nevar.",
        ],
      },
      {
        q: "Vai tas darbojas jebkurā valodā?",
        a: [
          "Visās valodās, kurās vārdus atdala ar atstarpēm, arī rakstībās no labās uz kreiso. Ķīniešu, japāņu, taju un citas rakstības bez atstarpēm paliek, kā ir.",
        ],
      },
      {
        q: "Ko darīt, ja lietoju ekrāna lasītāju?",
        a: [
          "Teksts tiek nolasīts tieši tāpat kā iepriekš: neviena rakstzīme netiek pievienota vai izņemta.",
        ],
      },
      {
        q: "Vai tas darbojas manā telefonā?",
        a: ["Jā, ar Firefox Android ierīcēm. Atsevišķa lietotne būs vēlāk."],
      },
    ],
  },
  footer: {
    license: "Brīvā programmatūra ar Apache-2.0 licenci.",
  },
  uses: {
    title: "Kam tas noder",
    intro:
      "Katrs lasa savā veidā. Šeit ir daži veidi, kā rīku izmantot atkarībā no tā, kas tu esi un kam tev tas vajadzīgs. Visiem ir kas kopīgs: tas ir izvēles palīgs, ko vari pielāgot vai izslēgt, un tas nevāc nekādus datus.",
    homeHeading: "Kam tas noder",
    how: "Kā to izmantot",
    care: "Ņem vērā",
    cases: [
      {
        id: "education",
        title: "Izglītība",
        summary:
          "Skolotājiem, skolām un ģimenēm, kas vēlas pielāgot lasāmvielu, neveidojot jaunus materiālus.",
        link: "Idejas klasei un mājām",
        lede: "Skolotājiem, atbalsta personālam un ģimenēm, kas vēlas, lai lasīšana prasītu mazliet mazāk pūļu, negatavojot atšķirīgus materiālus katram skolēnam.",
        steps: [
          "Pielāgo materiālus, kas tev jau ir: konvertē lasāmos tekstus, pierakstus vai grāmatas EPUB, TXT, Markdown vai HTML formātā un dalies ar tiem, kā ir.",
          "Stundā projicē demonstrāciju ar dienas tekstu un kopā izmēģiniet dažādu stiprumu un stilus. Ļauj katram skolēnam pateikt, kas šķiet visērtākais.",
          "Skolas datoros paplašinājums darbojas bez kontiem un reģistrācijas un nevāc nekādus skolēnu datus.",
          "Sadaļā „Darba lapas” veido lasīšanas lapas ar lielu burtu izmēru un jauku rāmīti, tad izdrukā tās vai saglabā kā PDF.",
          "Mājās tas pats paplašinājums palīdz ar mājasdarbiem un lasīšanu tīmeklī.",
        ],
        notes: [
          "Tas ir izvēles palīgs: dažiem skolēniem tas palīdz, citiem ne. Ļauj katram izvēlēties un izslēgt, ja grib.",
          "Tas neaizstāj mācību atbalstu un mācīšanās grūtību diagnostiku.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopēdi un citi speciālisti",
        summary:
          "Logopēdiem, izglītības psihologiem un konsultantiem, kas meklē vienkāršu rīku, ko izmēģināt nodarbībās.",
        link: "Kā to izmantot nodarbībās",
        lede: "Logopēdiem, izglītības psihologiem, konsultantiem un citiem speciālistiem, kas atbalsta cilvēkus ar lasīšanas grūtībām.",
        steps: [
          "Nodarbībā ielīmē tekstu demonstrācijā un kopā ar cilvēku izmēģini vairākus iestatījumus. Pieraksti, kurš šķiet visērtākais: stiprums, stils, izceltie vārdi, rindstarpa.",
          "Sagatavo darba materiālus ar konvertētāju un izdali tos uz papīra, ekrānā vai e-grāmatu lasītājā.",
          "Iesaki paplašinājumu lietošanai mājās ar iestatījumiem, ko izvēlējāties kopā.",
          "Viss darbojas ierīcē: neviens teksts vai pacienta dati nekad neiet caur serveri.",
        ],
        notes: [
          "Tā nav terapija vai lasīšanas intervences metode. Tas var būt viens no atbalstiem tavā darbā.",
          "Pētījumi nerāda vidēju ātruma vai izpratnes uzlabojumu. Piedāvā to kā ērtības un izvēles jautājumu un izvērtē katru gadījumu atsevišķi.",
        ],
      },
      {
        id: "adults",
        title: "Pieaugušie",
        summary:
          "Cilvēkiem, kas vēlas atsākt lasīt, bet nespēj koncentrēties, pazaudē vietu tekstā vai ātri nogurst.",
        link: "Kā sākt",
        lede: "Ja gribi lasīt vairāk, bet grūti sākt, tu pazaudē vietu tekstā, lasi to pašu teikumu trīs reizes vai nogursti jau otrajā lappusē, tas varētu palīdzēt. Un ja nepalīdz, nekas.",
        steps: [
          "Instalē paplašinājumu un ieslēdz to ar Alt+B rakstā, kas tevi interesē. Sāc ar īsiem tekstiem.",
          "Konvertē grāmatu, ko tiešām gribi izlasīt, un ieliec to savā e-grāmatu lasītājā vai telefonā.",
          "Pielāgo stiprumu, līdz tas šķiet ērti. Sadaļā „Vairāk iespēju” vari palielināt rindstarpu un sašaurināt rindas: daudziem tas palīdz tikpat daudz kā izcēlums.",
          "Ja kādu dienu tas nogurdina, izslēdz to. Tas ir tavs lasīšanas veids, nevis noteikums.",
        ],
        notes: [
          "Tas neder visiem, un tas ir normāli. Dod tam dažas dienas, pirms izlem.",
          "Ja domā, ka tavu grūtību pamatā varētu būt UDHS vai disleksija, var palīdzēt saruna ar speciālistu.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Lasīšanas darba lapas",
    nav: "Darba lapas",
    intro:
      "Veido darba lapas ar lielu burtu izmēru, izceltu katra vārda sākumu un jauku rāmīti. Izvēlies parauga tekstu vai uzraksti savu, tad izdrukā vai lejupielādē.",
    editor: "Pielāgo darba lapu",
    example: "Izvēlies tekstu",
    titleLabel: "Virsraksts",
    textLabel: "Teksts",
    theme: "Rāmis",
    themes: {
      none: "Bez rāmja",
      simple: "Vienkāršs",
      clouds: "Mākoņi",
      garden: "Dārzs",
      stars: "Zvaigznes",
      vehicles: "Mašīnas un kravas auto",
    },
    size: "Teksta izmērs",
    sizes: ["Liels", "Ļoti liels", "Milzīgs"],
    nameDate: "Pievienot vārdu un datumu",
    name: "Vārds",
    date: "Datums",
    lines: "Rindas rakstīšanai",
    linesOptions: ["Nav", "3 rindas", "6 rindas", "10 rindas"],
    preview: "Priekšskatījums",
    showPageSize: "Rādīt lapas izmēru",
    pageSizes: {
      portrait: "A4 stateniski (210 × 297 mm)",
      landscape: "A4 guleniski (297 × 210 mm)",
    },
    pageN: "{n}. lapa",
    editHint:
      "Vari rakstīt tieši darba lapā: noklikšķini uz virsraksta vai teksta. Izcēlums tiek pielietots, kad beidz.",
    editTitle: "Darba lapas virsraksts",
    editText: "Darba lapas teksts",
    print: "Drukāt vai saglabāt kā PDF",
    download: "Lejupielādēt darba lapu",
    printHint:
      "Lai saglabātu kā PDF, drukāšanas logā izvēlies „Saglabāt kā PDF”. Lapa tiek drukāta uz balta fona, lai taupītu tinti.",
    downloadHint:
      "Lejupielāde ir tīmekļa lapa, ko vari atvērt un izdrukāt jebkurā laikā, arī bez interneta.",
    fileName: "darba-lapa",
    tabs: { text: "Teksts", layout: "Izkārtojums", emphasis: "Izcēlums" },
    myTexts: "Mani teksti",
    save: "Saglabāt manos tekstos",
    saved: "„{title}” ir saglabāts manos tekstos.",
    remove: "Izņemt no maniem tekstiem",
    removed: "„{title}” izņemts no maniem tekstiem.",
    exportTexts: "Eksportēt manus tekstus",
    importTexts: "Importēt tekstus",
    imported: "Importēti teksti: {n}.",
    importEmpty: "Šajā failā nav tekstu. Izmanto .md failu ar „## ” virsrakstiem vai .txt failu.",
    libraryNote:
      "Tavi teksti tiek glabāti tikai šajā pārlūkā. Eksportē tos, lai paturētu kopiju, dalītos ar tiem vai pārnestu uz citu datoru.",
    exportHeading: "Mani darba lapu teksti",
    levelKey: "Līmenis",
    textsFileName: "mani-darba-lapu-teksti",
    orientation: "Orientācija",
    orientations: { portrait: "Stateniski", landscape: "Guleniski" },
    overflow:
      "Darba lapa turpinās otrajā lappusē. Lai tā ietilptu vienā, saīsini tekstu, izvēlies mazāku teksta izmēru vai noņem rindas.",
  },
  settings: {
    title: "Lasīšanas iestatījumi",
    open: "Atvērt lasīšanas iestatījumus",
    close: "Aizvērt",
    note: "Tie attiecas uz demonstrāciju, darba lapām un konvertētāju un tiek glabāti tikai šajā pārlūkā.",
    presets: "Mani saglabātie iestatījumi",
    empty:
      "Tev vēl nav saglabātu iestatījumu. Dod nosaukumu pašreizējiem, lai pie tiem atgrieztos ar vienu klikšķi.",
    name: "Nosaukums",
    placeholder: "Piemēram: Lasīšana klasē",
    save: "Saglabāt",
    apply: "Izmantot iestatījumus „{name}”",
    remove: "Dzēst „{name}”",
    saved: "Iestatījumi „{name}” saglabāti.",
    removed: "„{name}” izdzēsts.",
    applied: "Tagad tiek izmantots „{name}”.",
    reset: "Atjaunot noklusējuma iestatījumus",
    restored: "Noklusējuma iestatījumi atjaunoti.",
  },
  convert: {
    title: "Konvertēt grāmatu",
    intro:
      "Izvēlies grāmatu vai dokumentu un lejupielādē kopiju ar izcēlumu. Fails nekad neatstāj tavu ierīci: viss notiek šajā pārlūkā, bez izmēra ierobežojuma.",
    pick: "Izvēlēties failu",
    drop: "vai ievelc to šeit",
    formats: "EPUB, TXT, Markdown vai HTML",
    selected: "Izvēlētais fails:",
    output: "Izvades formāts",
    outputs: { epub: "EPUB (e-grāmata)", html: "HTML (tīmekļa lapa)", md: "Markdown" },
    options: "Kā izcelt",
    start: "Konvertēt",
    progress: "Konvertē: {n} %",
    cancel: "Atcelt",
    cancelled: "Konvertēšana atcelta. Nekas netika saglabāts.",
    done: "Gatavs. Tavs fails ir sagatavots.",
    download: "Lejupielādēt {name}",
    errors: {
      unsupported: "Šo formātu nevar konvertēt. Izvēlies EPUB, TXT, Markdown vai HTML failu.",
      drm: "Šai grāmatai ir DRM (aizsardzība pret kopēšanu), tāpēc to nevar konvertēt. Ja to iegādājies, pajautā veikalam, vai viņi var dot kopiju bez DRM.",
      invalid:
        "Šo failu neizdevās nolasīt. Pārbaudi, vai tas atveras tavā lasītājā, vai izmēģini citu.",
      failed: "Konvertēšana neizdevās ({detail}). Ja tas atkārtojas, lūdzu, pastāsti mums GitHub.",
    },
    labels: { part: "Daļa", contents: "Saturs" },
    steps: {
      choose: "Izvēlies grāmatu",
      adjust: "Pielāgo izskatu",
      convert: "Konvertē un lejupielādē",
    },
    previewTitle: "Kā sāksies tava grāmata",
    previewEmpty: "Izvēlies failu, un šeit parādīsies tā pirmā lappuse ar izcēlumu.",
    previewLoading: "Gatavo priekšskatījumu…",
    previewNote: "Aptuvens skats: katrs lasītājs rāda grāmatu ar savu fontu un izmēru.",
    previewNone: "Faila sākumā teksts netika atrasts, bet to joprojām var konvertēt.",
    change: "Izvēlēties citu failu",
    devices: {
      heading: "Kā to ielikt lasītājā",
      items: [
        {
          name: "Kindle",
          text: "Izmanto Amazon Send to Kindle (tīmekļa vietni, lietotni vai e-pastu) un izvēlies EPUB failu. Amazon to pielāgos tavam Kindle.",
        },
        {
          name: "Kobo",
          text: "Pievieno Kobo datoram ar USB kabeli un iekopē tajā EPUB. Atvieno ierīci, un grāmata parādīsies tavā bibliotēkā.",
        },
        {
          name: "PocketBook",
          text: "Iekopē to caur USB, tāpat kā Kobo, vai nosūti pa e-pastu ar pakalpojumu Send-to-PocketBook.",
        },
      ],
      calibre:
        "Ja izmanto Calibre, pievieno failu savai bibliotēkai un nosūti to uz lasītāju kā jebkuru citu grāmatu.",
    },
  },
  pages: {
    privacy: {
      title: "Privātums",
      body: [
        "Mēs nevācam nekādus datus. Nekādus.",
        "Paplašinājums, šī vietne un konvertētājs darbojas tikai tavā ierīcē. Tas, ko tu lasi, un faili, ko konvertē, nekad netiek nekur sūtīti: mums nav serveru.",
        "Mēs neizmantojam analītiku, sīkdatnes, telemetriju, ne arī fontus vai skriptus no citām vietnēm.",
        "Paplašinājums glabā tavus iestatījumus (stiprumu, stilu, vietnes, kurās vēlies to vienmēr ieslēgtu) tava pārlūka krātuvē. Ja pārlūkā ir ieslēgta sinhronizācija, pārlūks var tos kopēt starp tavām ierīcēm; mēs tos nekad neredzam.",
        "Paplašinājums prasa tikai tās atļaujas, kas tam vajadzīgas. Piekļuve konkrētai vietnei vai visām vietnēm tiek prasīta tikai tad, kad izvēlies „Vienmēr šajā vietnē” vai „Visās vietnēs”, un to vari jebkurā brīdī atsaukt.",
      ],
    },
    accessibility: {
      title: "Pieejamība",
      body: [
        "Izcēlums nekad nemaina to, ko nolasa ekrāna lasītājs: teksts ir tieši tāds pats, rakstzīmi pa rakstzīmei. Mēs to pārbaudām ar automātiskiem testiem, kā arī ar NVDA un VoiceOver pirms katras versijas.",
        "Viss darbojas tikai ar tastatūru. Paplašinājumu ieslēdz un izslēdz ar Alt+B, un īsinājumtaustiņu vari mainīt pārlūka iestatījumos.",
        "Izcēluma krāsas tiek atvasinātas no paša teksta krāsas, tāpēc kontrasts saglabājas gaišajā režīmā, tumšajā režīmā un katras vietnes motīvā.",
        "Šajā vietnē izmantots burtveidols Atkinson Hyperlegible, kas radīts, lai burtus varētu skaidri atšķirt, un tā ievēro tavas sistēmas tumšā režīma un samazinātas kustības iestatījumus.",
        "Ja saskaries ar šķērsli, lūdzu, atver problēmu (issue) GitHub: tā ir kļūda, un mēs pret to tā arī izturēsimies.",
      ],
    },
  },
};
