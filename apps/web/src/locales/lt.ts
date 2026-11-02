import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Lietuvių";

export const slugs: Record<PageKey, string> = {
  uses: "kam-skirta",
  worksheets: "uzduociu-lapai",
  convert: "konvertuoti",
  privacy: "privatumas",
  accessibility: "prieinamumas",
};

export const strings: Strings = {
  meta: {
    description:
      "Nemokama atvirojo kodo skaitymo pagalba žmonėms, turintiems ADHD ir disleksiją: paryškina kiekvieno žodžio pradžią internete ir tavo elektroninėse knygose. Viskas lieka tavo įrenginyje.",
  },
  nav: {
    skip: "Pereiti prie turinio",
    home: "Pradžia",
    convert: "Konvertuoti knygą",
    privacy: "Privatumas",
    accessibility: "Prieinamumas",
    github: "Pirminis kodas",
    language: "Kalba",
    theme: {
      label: "Tema",
      light: "šviesi",
      dark: "tamsi",
    },
  },
  hero: {
    headline: "Skaityk savaip",
    lede: "Švelniai paryškina kiekvieno žodžio pradžią, kad akys turėtų kur atsiremti. Žmonėms, turintiems ADHD, disleksiją, ar visiems, kam taip patogiau. Nemokamai, be paskyrų, ir niekas neišeina iš tavo įrenginio.",
  },
  install: {
    chrome: "Pridėti prie Chrome ar Edge",
    firefox: "Pridėti prie Firefox",
    preview: "Parduotuvėse dar nėra. Kol kas bandomąją versiją gali įdiegti iš GitHub.",
  },
  demo: {
    heading: "Išbandyk su savo tekstu",
    intro: "Įklijuok bet kokį tekstą. Rezultatas atsinaujina iškart, o ilgio apribojimo nėra.",
    input: "Tavo tekstas",
    output: "Kaip skaitosi",
    sample:
      "Skaityti turėtų būti patogu. Kai kurie žmonės pameta eilutę, praleidžia žodžius arba pavargsta dar nepasiekę pastraipos pabaigos. Pažymėta kiekvieno žodžio pradžia suteikia akims atramos tašką: išbandyk skirtingą stiprumą ir stilius, kol rasi savo.",
    strength: "Stiprumas",
    style: "Stilius",
    styles: {
      "bold-fade": "Paryškinta ir blankiau",
      bold: "Paryškinta",
      color: "Spalva",
      underline: "Pabraukta",
      fade: "Likusi dalis blankiau",
    },
    more: "Daugiau parinkčių",
    every: "Paryškinti",
    everyOptions: ["Kiekvieną žodį", "1 iš kas 2 žodžių", "1 iš kas 3 žodžių"],
    lineHeight: "Tarpai tarp eilučių",
    maxWidth: "Didžiausias eilutės plotis",
    pageDefault: "Įprastas",
    widths: ["Siauras (50 simbolių)", "Vidutinis (65 simboliai)", "Platus (80 simbolių)"],
  },
  privacy: {
    heading: "Niekas neišeina iš tavo įrenginio",
    body: [
      "Plėtinys, šis puslapis ir knygų konverteris veikia tik tavo naršyklėje. Nėra serverio, į kurį būtų galima ką nors siųsti.",
      "Jokių paskyrų, jokios analitikos, jokių slapukų ir jokių naudojimo apribojimų.",
    ],
    more: "Skaityti privatumo politiką",
  },
  faq: {
    heading: "Klausimai",
    items: [
      {
        q: "Ar tai tikrai veikia?",
        a: [
          "Priklauso nuo žmogaus. Iki šiol paskelbti tyrimai nerodo, kad su tokiu paryškinimu žmonės vidutiniškai skaitytų greičiau ar suprastų daugiau.",
          "Tačiau daug kas sako, kad skaityti patogiau, kad rečiau pameta vietą tekste arba kad lengviau pradėti. Todėl greičio nežadame: siūlome pagalbą, kurią gali pritaikyti sau arba išjungti. Išbandyk demonstraciją ir pasilik tai, kas padeda.",
        ],
      },
      {
        q: "Ar tai kainuoja?",
        a: [
          "Ne, ir niekada nekainuos. Jokios mokamos versijos, jokio žodžių ar failo dydžio apribojimo. Tai laisvoji programinė įranga pagal MPL-2.0 licenciją.",
        ],
      },
      {
        q: "Ar galiu tai naudoti su savo elektroninėmis knygomis?",
        a: [
          "Taip. Skiltyje „Konvertuoti knygą“ pasirink EPUB, TXT, Markdown ar HTML failą ir atsisiųsk kopiją su paryškinimu. Konvertuojama tavo naršyklėje. Knygų su DRM konvertuoti negalima.",
        ],
      },
      {
        q: "Ar tai veikia bet kuria kalba?",
        a: [
          "Visomis kalbomis, kuriose žodžiai atskiriami tarpais, įskaitant rašmenis iš dešinės į kairę. Kinų, japonų, tajų ir kiti rašmenys be tarpų paliekami tokie, kokie yra.",
        ],
      },
      {
        q: "O jei naudojuosi ekrano skaitytuvu?",
        a: [
          "Tekstas skaitomas lygiai taip pat kaip anksčiau: nė vienas simbolis nepridedamas ir nepašalinamas.",
        ],
      },
      {
        q: "Ar tai veikia mano telefone?",
        a: ["Taip, su Firefox, skirta Android. Atskira programėlė bus vėliau."],
      },
    ],
  },
  footer: {
    license: "Laisvoji programinė įranga pagal MPL-2.0 licenciją.",
  },
  uses: {
    title: "Kam skirta",
    intro:
      "Kiekvienas skaito savaip. Štai keli būdai naudoti šį įrankį, priklausomai nuo to, kas esi ir kam jo reikia. Visus juos sieja vienas dalykas: tai neprivaloma pagalba, kurią gali pritaikyti sau arba išjungti, ir ji nerenka jokių duomenų.",
    homeHeading: "Kam skirta",
    how: "Kaip naudoti",
    care: "Turėk omenyje",
    cases: [
      {
        id: "education",
        title: "Švietimas",
        summary:
          "Mokytojams, mokykloms ir šeimoms, norinčioms pritaikyti skaitinius nekuriant naujos medžiagos.",
        link: "Idėjos klasei ir namams",
        lede: "Mokytojams, švietimo pagalbos specialistams ir šeimoms, norinčioms, kad skaitymas reikalautų šiek tiek mažiau pastangų, neruošiant atskiros medžiagos kiekvienam mokiniui.",
        steps: [
          "Pritaikyk jau turimą medžiagą: konvertuok skaitinius, užrašus ar knygas EPUB, TXT, Markdown ar HTML formatu ir dalinkis jais tokiais, kokie yra.",
          "Per pamoką parodyk demonstraciją su dienos tekstu ir kartu išbandykite skirtingą stiprumą ir stilius. Tegul kiekvienas mokinys pasako, kuris variantas patogiausias.",
          "Mokyklos kompiuteriuose plėtinys veikia be paskyrų ir registracijos ir nerenka jokių mokinių duomenų.",
          "Skiltyje „Užduočių lapai“ sukurk skaitymo lapus su didelėmis raidėmis ir jaukiu rėmeliu, tada atsispausdink juos arba išsaugok kaip PDF.",
          "Namuose tas pats plėtinys padeda ruošti namų darbus ir skaityti internete.",
        ],
        notes: [
          "Tai neprivaloma pagalba: vieniems mokiniams padeda, kitiems ne. Leisk kiekvienam rinktis ir išjungti, jei nori.",
          "Ji nepakeičia mokymosi pagalbos ir mokymosi sunkumų diagnostikos.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopedai ir kiti specialistai",
        summary:
          "Logopedams, mokyklų psichologams ir konsultantams, ieškantiems paprasto įrankio išbandyti per užsiėmimus.",
        link: "Kaip naudoti per užsiėmimus",
        lede: "Logopedams, specialiesiems pedagogams, psichologams, konsultantams ir kitiems specialistams, padedantiems žmonėms, kuriems sunku skaityti.",
        steps: [
          "Per užsiėmimą įklijuok tekstą į demonstraciją ir kartu su žmogumi išbandyk kelis nustatymus. Užsirašyk, kuris atrodo patogiausias: stiprumas, stilius, paryškinami žodžiai, tarpai tarp eilučių.",
          "Paruošk darbo medžiagą su konverteriu ir pateik ją popieriuje, ekrane ar elektroninių knygų skaityklėje.",
          "Rekomenduok plėtinį naudoti namuose su kartu pasirinktais nustatymais.",
          "Viskas veikia įrenginyje: jokie tekstai ar paciento duomenys niekada nekeliauja per serverį.",
        ],
        notes: [
          "Tai nėra gydymas ar skaitymo intervencijos metodas. Tai gali būti viena iš pagalbos priemonių tavo darbe.",
          "Tyrimai nerodo vidutinio greičio ar supratimo pagerėjimo. Pristatyk tai kaip patogumo ir pasirinkimo dalyką ir vertink kiekvieną atvejį atskirai.",
        ],
      },
      {
        id: "adults",
        title: "Suaugusieji",
        summary:
          "Žmonėms, kurie nori vėl pradėti skaityti, bet negali susikaupti, pameta vietą tekste ar greitai pavargsta.",
        link: "Kaip pradėti",
        lede: "Jei nori skaityti daugiau, bet sunku pradėti, pameti vietą tekste, tą patį sakinį skaitai tris kartus ar pavargsti jau antrame puslapyje, tai gali padėti. O jei nepadės, nieko tokio.",
        steps: [
          "Įdiek plėtinį ir įjunk jį klavišais Alt+B straipsnyje, kuris tau įdomus. Pradėk nuo trumpų tekstų.",
          "Konvertuok knygą, kurią tikrai nori perskaityti, ir įkelk ją į savo skaityklę ar telefoną.",
          "Reguliuok stiprumą, kol bus patogu. Skiltyje „Daugiau parinkčių“ gali padidinti tarpus tarp eilučių ir susiaurinti eilutes: daugeliui tai padeda tiek pat, kiek paryškinimas.",
          "Jei kurią dieną tai vargina, išjunk. Tai tavo skaitymo būdas, o ne taisyklė.",
        ],
        notes: [
          "Tai tinka ne visiems, ir tai normalu. Duok tam kelias dienas ir tik tada spręsk.",
          "Jei manai, kad tavo sunkumų priežastis gali būti ADHD ar disleksija, gali padėti pokalbis su specialistu.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Skaitymo užduočių lapai",
    nav: "Užduočių lapai",
    intro:
      "Kurk užduočių lapus su didelėmis raidėmis, paryškinta kiekvieno žodžio pradžia ir jaukiu rėmeliu. Pasirink pavyzdinį tekstą arba parašyk savo, tada atsispausdink arba atsisiųsk.",
    editor: "Pritaikyk lapą",
    example: "Pasirink tekstą",
    titleLabel: "Pavadinimas",
    textLabel: "Tekstas",
    theme: "Rėmelis",
    themes: {
      none: "Be rėmelio",
      simple: "Paprastas",
      clouds: "Debesys",
      garden: "Sodas",
      stars: "Žvaigždės",
      vehicles: "Automobiliai ir sunkvežimiai",
    },
    size: "Teksto dydis",
    sizes: ["Didelis", "Labai didelis", "Milžiniškas"],
    nameDate: "Pridėti vardą ir datą",
    name: "Vardas",
    date: "Data",
    lines: "Eilutės rašymui",
    linesOptions: ["Nėra", "3 eilutės", "6 eilutės", "10 eilučių"],
    preview: "Peržiūra",
    showPageSize: "Rodyti puslapio dydį",
    pageSizes: {
      portrait: "A4 stačias (210 × 297 mm)",
      landscape: "A4 gulsčias (297 × 210 mm)",
    },
    pageN: "{n} puslapis",
    editHint:
      "Gali rašyti tiesiai į lapą: spustelėk pavadinimą arba tekstą. Paryškinimas pritaikomas, kai baigi.",
    editTitle: "Lapo pavadinimas",
    editText: "Lapo tekstas",
    print: "Spausdinti arba išsaugoti kaip PDF",
    download: "Atsisiųsti lapą",
    printHint:
      "Kad išsaugotum kaip PDF, spausdinimo lange pasirink „Išsaugoti kaip PDF“. Spausdinama baltame fone, kad būtų taupomas rašalas.",
    downloadHint:
      "Atsisiųstas failas yra tinklalapis, kurį gali atidaryti ir atsispausdinti bet kada, net be interneto.",
    fileName: "uzduociu-lapas",
    tabs: { text: "Tekstas", layout: "Išdėstymas", emphasis: "Paryškinimas" },
    myTexts: "Mano tekstai",
    save: "Išsaugoti mano tekstuose",
    saved: "„{title}“ išsaugotas mano tekstuose.",
    remove: "Pašalinti iš mano tekstų",
    removed: "„{title}“ pašalintas iš mano tekstų.",
    exportTexts: "Eksportuoti mano tekstus",
    importTexts: "Importuoti tekstus",
    imported: "Importuota tekstų: {n}.",
    importEmpty: "Šiame faile tekstų nėra. Naudok .md failą su „## “ pavadinimais arba .txt failą.",
    libraryNote:
      "Tavo tekstai saugomi tik šioje naršyklėje. Eksportuok juos, kad turėtum kopiją, galėtum pasidalinti ar perkelti į kitą kompiuterį.",
    exportHeading: "Mano užduočių lapų tekstai",
    levelKey: "Lygis",
    textsFileName: "mano-uzduociu-lapu-tekstai",
    orientation: "Orientacija",
    orientations: { portrait: "Stačias", landscape: "Gulsčias" },
    overflow:
      "Lapas netelpa viename puslapyje. Kad tilptų, sutrumpink tekstą, pasirink mažesnį teksto dydį arba pašalink eilutes.",
  },
  settings: {
    title: "Skaitymo nustatymai",
    open: "Atidaryti skaitymo nustatymus",
    close: "Uždaryti",
    note: "Jie taikomi demonstracijai, užduočių lapams ir konverteriui ir saugomi tik šioje naršyklėje.",
    presets: "Mano išsaugoti nustatymai",
    empty:
      "Dar neturi išsaugotų nustatymų. Pavadink dabartinius, kad prie jų grįžtum vienu spustelėjimu.",
    name: "Pavadinimas",
    placeholder: "Pavyzdžiui: Skaitymas klasėje",
    save: "Išsaugoti",
    apply: "Naudoti nustatymus „{name}“",
    remove: "Ištrinti „{name}“",
    saved: "Nustatymai „{name}“ išsaugoti.",
    removed: "„{name}“ ištrinta.",
    applied: "Dabar naudojama „{name}“.",
    reset: "Grąžinti numatytuosius nustatymus",
    restored: "Numatytieji nustatymai grąžinti.",
  },
  convert: {
    title: "Konvertuoti knygą",
    intro:
      "Pasirink knygą ar dokumentą ir atsisiųsk kopiją su paryškinimu. Failas niekada neišeina iš tavo įrenginio: viskas vyksta šioje naršyklėje, be dydžio apribojimo.",
    pick: "Pasirinkti failą",
    drop: "arba nutempk jį čia",
    formats: "EPUB, TXT, Markdown arba HTML",
    selected: "Pasirinktas failas:",
    output: "Išvesties formatas",
    outputs: { epub: "EPUB (el. knyga)", html: "HTML (tinklalapis)", md: "Markdown" },
    options: "Kaip paryškinti",
    start: "Konvertuoti",
    progress: "Konvertuojama: {n} %",
    cancel: "Atšaukti",
    cancelled: "Konvertavimas atšauktas. Niekas neišsaugota.",
    done: "Baigta. Tavo failas paruoštas.",
    download: "Atsisiųsti {name}",
    errors: {
      unsupported: "Šio formato konvertuoti negalima. Pasirink EPUB, TXT, Markdown ar HTML failą.",
      drm: "Ši knyga turi DRM (apsaugą nuo kopijavimo), todėl jos konvertuoti negalima. Jei ją pirkai, paklausk parduotuvės, ar ji gali duoti kopiją be DRM.",
      invalid:
        "Šio failo nepavyko perskaityti. Patikrink, ar jis atsidaro tavo skaityklėje, arba pabandyk kitą.",
      failed: "Konvertuoti nepavyko ({detail}). Jei tai pasikartos, parašyk mums GitHub.",
    },
    labels: { part: "Dalis", contents: "Turinys" },
    steps: {
      choose: "Pasirink knygą",
      adjust: "Pritaikyk išvaizdą",
      convert: "Konvertuok ir atsisiųsk",
    },
    previewTitle: "Kaip prasidės tavo knyga",
    previewEmpty: "Pasirink failą, ir čia atsiras jo pirmasis puslapis su paryškinimu.",
    previewLoading: "Ruošiama peržiūra…",
    previewNote: "Apytikslis vaizdas: kiekviena skaityklė rodo knygą savo šriftu ir dydžiu.",
    previewNone: "Failo pradžioje teksto nerasta, bet jį vis tiek galima konvertuoti.",
    change: "Pasirinkti kitą failą",
    devices: {
      heading: "Kaip perkelti į skaityklę",
      items: [
        {
          name: "Kindle",
          text: "Naudok Amazon Send to Kindle (svetainę, programėlę ar el. paštą) ir pasirink EPUB failą. Amazon pritaikys jį tavo Kindle.",
        },
        {
          name: "Kobo",
          text: "Prijunk Kobo prie kompiuterio USB laidu ir nukopijuok į jį EPUB. Atjunk įrenginį, ir knyga atsiras tavo bibliotekoje.",
        },
        {
          name: "PocketBook",
          text: "Nukopijuok per USB, kaip ir į Kobo, arba nusiųsk el. paštu per Send-to-PocketBook paslaugą.",
        },
      ],
      calibre:
        "Jei naudoji Calibre, pridėk failą į savo biblioteką ir nusiųsk į skaityklę kaip bet kurią kitą knygą.",
    },
  },
  pages: {
    privacy: {
      title: "Privatumas",
      body: [
        "Mes nerenkame jokių duomenų. Visiškai jokių.",
        "Plėtinys, ši svetainė ir konverteris veikia tik tavo įrenginyje. Tai, ką skaitai, ir failai, kuriuos konvertuoji, niekur nesiunčiami: mes neturime serverių.",
        "Nenaudojame analitikos, slapukų, telemetrijos, šriftų ar scenarijų iš kitų svetainių.",
        "Plėtinys saugo tavo nustatymus (stiprumą, stilių, svetaines, kuriose nori, kad jis visada veiktų) tavo naršyklės saugykloje. Jei naršyklėje įjungtas sinchronizavimas, ji gali juos kopijuoti tarp tavo įrenginių; mes jų niekada nematome.",
        "Plėtinys prašo tik tų leidimų, kurių jam reikia. Prieiga prie konkrečios svetainės ar visų svetainių prašoma tik tada, kai pasirenki „Visada šioje svetainėje“ arba „Visose svetainėse“, ir ją gali bet kada atšaukti.",
      ],
    },
    accessibility: {
      title: "Prieinamumas",
      body: [
        "Paryškinimas niekada nekeičia to, ką skaito ekrano skaitytuvas: tekstas lygiai toks pat, simbolis po simbolio. Tikriname tai automatiniais testais, o prieš kiekvieną leidimą – ir su NVDA bei VoiceOver.",
        "Viskas veikia vien klaviatūra. Plėtinys įjungiamas ir išjungiamas klavišais Alt+B, o sparčiuosius klavišus gali pakeisti naršyklės nustatymuose.",
        "Paryškinimo spalvos gaunamos iš paties teksto spalvos, todėl kontrastas išlieka šviesiame režime, tamsiame režime ir kiekvienos svetainės temoje.",
        "Ši svetainė naudoja šriftą Atkinson Hyperlegible, sukurtą tam, kad raides būtų lengva atskirti, ir paiso tavo sistemos tamsaus režimo bei sumažinto judesio nustatymų.",
        "Jei susiduri su kliūtimi, atidaryk pranešimą (issue) GitHub: tai klaida, ir taip ją ir vertinsime.",
      ],
    },
  },
};
