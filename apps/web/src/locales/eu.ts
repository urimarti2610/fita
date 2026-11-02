import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Euskara";

export const slugs: Record<PageKey, string> = {
  uses: "norentzat",
  worksheets: "fitxak",
  convert: "bihurtu",
  privacy: "pribatutasuna",
  accessibility: "irisgarritasuna",
};

export const strings: Strings = {
  meta: {
    description:
      "Irakurtzeko laguntza librea eta doakoa, TDAH eta dislexia duten pertsonentzat: hitz bakoitzaren hasiera nabarmentzen du webean eta zure liburu elektronikoetan. Dena zure gailuan geratzen da.",
  },
  nav: {
    skip: "Joan edukira",
    home: "Hasiera",
    convert: "Bihurtu liburu bat",
    privacy: "Pribatutasuna",
    accessibility: "Irisgarritasuna",
    github: "Iturburu-kodea",
    language: "Hizkuntza",
    theme: {
      label: "Gaia",
      light: "argia",
      dark: "iluna",
    },
  },
  hero: {
    headline: "Irakurri zure erara",
    lede: "Hitz bakoitzaren hasiera leunki nabarmentzen du, begiek non bermatu izan dezaten. TDAH edo dislexia duten pertsonentzat, edo horrela erosoago irakurtzen duen edonorentzat. Doakoa, konturik gabe, eta ezer ez da zure gailutik ateratzen.",
  },
  install: {
    chrome: "Gehitu Chrome edo Edge-ri",
    firefox: "Gehitu Firefox-i",
    preview: "Oraindik ez dago dendetan. Bitartean, proba-bertsioa GitHub-etik instala dezakezu.",
  },
  demo: {
    heading: "Probatu zure testuarekin",
    intro: "Itsatsi edozein testu. Emaitza berehala aldatzen da, eta ez dago luzera-mugarik.",
    input: "Zure testua",
    output: "Nola irakurtzen den",
    sample:
      "Irakurtzea erosoa izan beharko litzateke. Batzuek haria galtzen dute, hitzak saltatzen dituzte edo paragrafoa amaitu aurretik nekatzen dira. Hitz bakoitzaren hasiera markatzeak begiei euskarri bat ematen die: probatu indar eta estilo desberdinak zurea aurkitu arte.",
    strength: "Indarra",
    style: "Estiloa",
    styles: {
      "bold-fade": "Lodia eta lausotua",
      bold: "Lodia",
      color: "Kolorea",
      underline: "Azpimarra",
      fade: "Lausotu gainerakoa",
    },
    more: "Aukera gehiago",
    every: "Nabarmendu",
    everyOptions: ["Hitz guztiak", "2 hitzetik 1", "3 hitzetik 1"],
    lineHeight: "Lerroartea",
    maxWidth: "Lerroaren gehieneko zabalera",
    pageDefault: "Arrunta",
    widths: ["Estua (50 karaktere)", "Ertaina (65 karaktere)", "Zabala (80 karaktere)"],
  },
  privacy: {
    heading: "Ezer ez da zure gailutik ateratzen",
    body: [
      "Luzapena, orri hau eta liburu-bihurgailua osorik zure nabigatzailean exekutatzen dira. Ez dago zerbitzaririk ezer bidaltzeko.",
      "Konturik gabe, analitikarik gabe, cookierik gabe eta erabilera-mugarik gabe.",
    ],
    more: "Irakurri pribatutasun-politika",
  },
  faq: {
    heading: "Galderak",
    items: [
      {
        q: "Benetan funtzionatzen du?",
        a: [
          "Pertsonaren araberakoa da. Orain arte argitaratutako ikerketek ez dute erakusten, batez beste, jendeak azkarrago irakurtzen duenik edo hobeto ulertzen duenik horrelako nabarmentzearekin.",
          "Jende askok esaten duena da irakurtzea erosoagoa egiten zaiola, haria gutxiagotan galtzen duela edo hastea errazagoa dela. Horregatik ez dugu abiadurarik agintzen: doitu edo desaktibatu dezakezun laguntza bat eskaintzen dugu. Probatu demoa eta gorde lagungarri zaizuna.",
        ],
      },
      {
        q: "Ordaindu behar da ezer?",
        a: [
          "Ez, eta ez da inoiz ordaindu beharko. Ez dago ordainpeko bertsiorik, ez hitz-mugarik, ez fitxategi-tamainaren mugarik. Software librea da, Apache-2.0 lizentziapean.",
        ],
      },
      {
        q: "Nire liburu elektronikoekin erabil dezaket?",
        a: [
          "Bai. «Bihurtu liburu bat» atalean EPUB, TXT, Markdown edo HTML fitxategi bat aukeratzen duzu, eta nabarmentzedun kopia bat deskargatzen duzu. Bihurketa zure nabigatzailean egiten da. DRM duten liburuak ezin dira bihurtu.",
        ],
      },
      {
        q: "Edozein hizkuntzatan funtzionatzen du?",
        a: [
          "Hitzak zuriuneekin bereizten dituzten hizkuntza guztietan, eskuinetik ezkerrera idazten direnak barne. Txinera, japoniera, thailandiera eta zuriunerik gabeko beste idazkera batzuk dauden bezala uzten dira.",
        ],
      },
      {
        q: "Eta pantaila-irakurgailua erabiltzen badut?",
        a: ["Testua lehen bezala irakurtzen da: ez da karaktererik gehitzen ez kentzen."],
      },
      {
        q: "Mugikorrean funtzionatzen du?",
        a: ["Bai, Androiderako Firefox-ekin. Geroago aplikazio propio bat etorriko da."],
      },
    ],
  },
  footer: {
    license: "Software librea, Apache-2.0 lizentziapean.",
  },
  uses: {
    title: "Norentzat",
    intro:
      "Bakoitzak bere erara irakurtzen du. Hona hemen tresna erabiltzeko modu batzuk, nor zaren eta zertarako behar duzun kontuan hartuta. Guztiek dute zerbait komunean: aukerako laguntza bat da, doitu edo desaktibatu dezakezuna, eta ez du daturik biltzen.",
    homeHeading: "Norentzat",
    how: "Nola erabili",
    care: "Kontuan hartu",
    cases: [
      {
        id: "education",
        title: "Hezkuntza",
        summary:
          "Irakurgaiak material berririk sortu gabe egokitu nahi dituzten irakasle, ikastetxe eta familientzat.",
        link: "Ideiak ikasgelarako eta etxerako",
        lede: "Irakurtzea pixka bat gutxiago kostatzea nahi duten irakasle, laguntza-talde eta familientzat, ikasle bakoitzarentzat material desberdinik prestatu gabe.",
        steps: [
          "Egokitu dagoeneko duzun materiala: bihurtu irakurgaiak, apunteak edo liburuak EPUB, TXT, Markdown edo HTML formatuan, eta partekatu dauden bezala.",
          "Ikasgelan, proiektatu demoa eguneko testuarekin eta probatu taldean indar eta estilo desberdinak. Utzi ikasle bakoitzari esaten zein zaion erosoena.",
          "Ikastetxeko ordenagailuetan, luzapenak konturik eta izen-ematerik gabe funtzionatzen du, eta ez du ikasleen daturik biltzen.",
          "Egin letra handiko eta marko atsegineko irakurketa-fitxak «Fitxak» atalean, eta inprimatu edo gorde PDF gisa.",
          "Etxean, luzapen berak etxeko lanetan eta webeko irakurketan laguntzen du.",
        ],
        notes: [
          "Aukerako laguntza bat da: ikasle batzuei laguntzen die eta beste batzuei ez. Utzi bakoitzari aukeratzen, eta desaktibatzen nahi badu.",
          "Ez ditu ordezkatzen hezkuntza-laguntza ezta ikasteko zailtasunen diagnostikoa ere.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopedia eta beste profesional batzuk",
        summary:
          "Saioetan probatzeko tresna erraz baten bila dabiltzan logopeda, psikopedagogo eta orientatzaileentzat.",
        link: "Nola erabili saioetan",
        lede: "Irakurtzeko zailtasunak dituzten pertsonak laguntzen dituzten logopeda, psikopedagogo, orientatzaile eta beste profesionalentzat.",
        steps: [
          "Saio batean, itsatsi testu bat demoan eta probatu hainbat ezarpen pertsonarekin. Idatzi zein zaion erosoena: indarra, estiloa, nabarmendutako hitzak, lerroartea.",
          "Prestatu lan-materiala bihurgailuarekin eta eman paperean, pantailan edo liburu elektronikoen irakurgailu batean.",
          "Gomendatu luzapena etxean erabiltzeko, elkarrekin aukeratutako ezarpenekin.",
          "Dena gailuan exekutatzen da: ez testurik ez pazienteen daturik ez da inoiz zerbitzari batetik igarotzen.",
        ],
        notes: [
          "Ez da tratamendu bat, ezta irakurketan esku hartzeko metodo bat ere. Zure lanaren barruko laguntza bat izan daiteke.",
          "Ikerketek ez dute abiaduran edo ulermenean batez besteko hobekuntzarik erakusten. Aurkeztu erosotasun eta lehentasun kontu gisa, eta baloratu kasuz kasu.",
        ],
      },
      {
        id: "adults",
        title: "Helduak",
        summary:
          "Berriro irakurtzen hasi nahi duten baina kontzentratu ezin diren, haria galtzen duten edo azkar nekatzen diren pertsonentzat.",
        link: "Nola hasi",
        lede: "Gehiago irakurri nahi baduzu baina hastea kostatzen bazaizu, haria galtzen baduzu, esaldi bera hiru aldiz irakurtzen baduzu edo bigarren orrialderako nekatuta bazaude, honek lagun zaitzake. Eta ez badizu laguntzen, ez da ezer gertatzen.",
        steps: [
          "Instalatu luzapena eta aktibatu Alt+B teklekin interesatzen zaizun artikulu batean. Hasi testu laburrekin.",
          "Bihurtu benetan irakurri nahi duzun liburu bat eta pasatu zure irakurgailura edo mugikorrera.",
          "Doitu indarra eroso sentitu arte. «Aukera gehiago» atalean lerroartea handitu eta lerroak estutu ditzakezu: jende askori horrek nabarmentzeak adina laguntzen dio.",
          "Egunen batean nekatzen bazaitu, desaktibatu. Zure irakurtzeko modua da, ez arau bat.",
        ],
        notes: [
          "Ez die guztiei funtzionatzen, eta ez da ezer gertatzen. Utzi egun batzuk erabaki aurretik.",
          "Zure zailtasunen atzean TDAH edo dislexia egon daitekeela uste baduzu, profesional batekin hitz egiteak lagun zaitzake.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Irakurketa-fitxak",
    nav: "Fitxak",
    intro:
      "Egin letra handiko fitxak, hitz bakoitzaren hasiera nabarmenduta eta marko atsegin batekin. Aukeratu adibide-testu bat edo idatzi zurea, eta gero inprimatu edo deskargatu.",
    editor: "Pertsonalizatu fitxa",
    example: "Aukeratu testu bat",
    titleLabel: "Izenburua",
    textLabel: "Testua",
    theme: "Markoa",
    themes: {
      none: "Markorik gabe",
      simple: "Sinplea",
      clouds: "Hodeiak",
      garden: "Lorategia",
      stars: "Izarrak",
      vehicles: "Autoak eta kamioiak",
    },
    size: "Testuaren tamaina",
    sizes: ["Handia", "Oso handia", "Erraldoia"],
    nameDate: "Gehitu izena eta data",
    name: "Izena",
    date: "Data",
    lines: "Idazteko lerroak",
    linesOptions: ["Bat ere ez", "3 lerro", "6 lerro", "10 lerro"],
    preview: "Aurrebista",
    showPageSize: "Erakutsi orriaren tamaina",
    pageSizes: {
      portrait: "A4 bertikala (210 × 297 mm)",
      landscape: "A4 horizontala (297 × 210 mm)",
    },
    pageN: "{n}. orrialdea",
    editHint:
      "Fitxan zuzenean idatz dezakezu: egin klik izenburuan edo testuan. Nabarmentzea amaitzean aplikatzen da.",
    editTitle: "Fitxaren izenburua",
    editText: "Fitxaren testua",
    print: "Inprimatu edo gorde PDF gisa",
    download: "Deskargatu fitxa",
    printHint:
      "PDF gisa gordetzeko, aukeratu «Gorde PDF gisa» inprimatzeko leihoan. Atzeko plano zuriarekin inprimatzen da, tinta aurrezteko.",
    downloadHint:
      "Deskarga web-orri bat da, nahi duzunean ireki eta inprimatu dezakezuna, baita konexiorik gabe ere.",
    fileName: "fitxa",
    tabs: { text: "Testua", layout: "Diseinua", emphasis: "Nabarmentzea" },
    myTexts: "Nire testuak",
    save: "Gorde nire testuetan",
    saved: "«{title}» zure testuetan gorde da.",
    remove: "Kendu nire testuetatik",
    removed: "«{title}» zure testuetatik kendu da.",
    exportTexts: "Esportatu nire testuak",
    importTexts: "Inportatu testuak",
    imported: "Inportatutako testuak: {n}.",
    importEmpty:
      "Fitxategi horretan ez dago testurik. Erabili «## » izenburuak dituen .md fitxategi bat, edo .txt fitxategi bat.",
    libraryNote:
      "Zure testuak nabigatzaile honetan bakarrik gordetzen dira. Esportatu itzazu kopia bat izateko, partekatzeko edo beste ordenagailu batera eramateko.",
    exportHeading: "Nire fitxetarako testuak",
    levelKey: "Maila",
    textsFileName: "nire-fitxetarako-testuak",
    orientation: "Orientazioa",
    orientations: { portrait: "Bertikala", landscape: "Horizontala" },
    overflow:
      "Fitxak bigarren orrialde bat hartzen du. Orri bakarrean sartzeko, laburtu testua, aukeratu letra-tamaina txikiagoa edo kendu lerroak.",
  },
  settings: {
    title: "Irakurketa-ezarpenak",
    open: "Ireki irakurketa-ezarpenak",
    close: "Itxi",
    note: "Demoan, fitxetan eta bihurgailuan aplikatzen dira, eta nabigatzaile honetan bakarrik gordetzen dira.",
    presets: "Gordetako nire ezarpenak",
    empty:
      "Oraindik ez duzu ezarpenik gorde. Jarri izena oraingoei, klik bakarrarekin haietara itzultzeko.",
    name: "Izena",
    placeholder: "Adibidez: Ikasgelako irakurketa",
    save: "Gorde",
    apply: "Erabili «{name}» ezarpenak",
    remove: "Ezabatu «{name}»",
    saved: "«{name}» ezarpenak gorde dira.",
    removed: "«{name}» ezabatu da.",
    applied: "Orain «{name}» erabiltzen ari zara.",
    reset: "Itzuli ezarpen lehenetsietara",
    restored: "Ezarpen lehenetsiak berrezarri dira.",
  },
  convert: {
    title: "Bihurtu liburu bat",
    intro:
      "Aukeratu liburu edo dokumentu bat eta deskargatu nabarmentzedun kopia bat. Fitxategia ez da inoiz zure gailutik ateratzen: dena nabigatzaile honetan gertatzen da, tamaina-mugarik gabe.",
    pick: "Aukeratu fitxategi bat",
    drop: "edo ekarri hona",
    formats: "EPUB, TXT, Markdown edo HTML",
    selected: "Aukeratutako fitxategia:",
    output: "Irteerako formatua",
    outputs: { epub: "EPUB (liburu elektronikoa)", html: "HTML (web-orria)", md: "Markdown" },
    options: "Nola nabarmendu",
    start: "Bihurtu",
    progress: "Bihurtzen: % {n}",
    cancel: "Utzi",
    cancelled: "Bihurketa bertan behera utzi da. Ez da ezer gorde.",
    done: "Eginda. Zure fitxategia prest dago.",
    download: "Deskargatu {name}",
    errors: {
      unsupported:
        "Formatu hau ezin da bihurtu. Aukeratu EPUB, TXT, Markdown edo HTML fitxategi bat.",
      drm: "Liburu honek DRM du (kopien aurkako babesa), eta, beraz, ezin da bihurtu. Erosi baduzu, galdetu dendari DRMrik gabeko kopia bat eman diezazuketen.",
      invalid:
        "Ezin izan da fitxategi hau irakurri. Egiaztatu zure irakurgailuan irekitzen dela, edo probatu beste batekin.",
      failed:
        "Bihurketak huts egin du ({detail}). Berriro gertatzen bada, jakinarazi iezaguzu GitHub-en, mesedez.",
    },
    labels: { part: "Zatia", contents: "Aurkibidea" },
    steps: {
      choose: "Aukeratu zure liburua",
      adjust: "Doitu nola ikusten den",
      convert: "Bihurtu eta deskargatu",
    },
    previewTitle: "Horrela hasiko da zure liburua",
    previewEmpty:
      "Aukeratu fitxategi bat, eta haren lehen orrialdea hemen agertuko da, nabarmenduta.",
    previewLoading: "Aurrebista prestatzen…",
    previewNote:
      "Gutxi gorabeherako ikuspegia: irakurgailu bakoitzak bere letra-tipo eta tamainarekin erakusten du liburua.",
    previewNone: "Ez da testurik aurkitu fitxategiaren hasieran, baina hala ere bihur dezakezu.",
    change: "Aukeratu beste fitxategi bat",
    devices: {
      heading: "Nola pasatu zure irakurgailura",
      items: [
        {
          name: "Kindle",
          text: "Erabili Amazonen Send to Kindle (webgunea, aplikazioa edo posta elektronikoa) eta aukeratu EPUB fitxategia. Amazonek zure Kindlera egokitzen du.",
        },
        {
          name: "Kobo",
          text: "Konektatu zure Kobo ordenagailura USB kablearekin eta kopiatu EPUBa bertan. Atera gailua, eta liburua zure liburutegian agertuko da.",
        },
        {
          name: "PocketBook",
          text: "Kopiatu USB bidez, Kobo batekin bezala, edo bidali posta elektronikoz Send-to-PocketBook zerbitzuarekin.",
        },
      ],
      calibre:
        "Calibre erabiltzen baduzu, gehitu fitxategia zure liburutegira eta bidali irakurgailura beste edozein liburu bezala.",
    },
  },
  pages: {
    privacy: {
      title: "Pribatutasuna",
      body: [
        "Ez dugu daturik biltzen. Bat ere ez.",
        "Luzapena, webgune hau eta bihurgailua osorik zure gailuan exekutatzen dira. Irakurtzen duzuna eta bihurtzen dituzun fitxategiak ez dira inora bidaltzen: ez dugu zerbitzaririk.",
        "Ez dugu analitikarik, cookierik, telemetriarik, ez beste guneetako letra-tipo edo scriptik erabiltzen.",
        "Luzapenak zure ezarpenak (indarra, estiloa, beti aktibatuta nahi duzun guneak) zure nabigatzailearen biltegian gordetzen ditu. Nabigatzailearen sinkronizazioa aktibatuta baduzu, nabigatzaileak zure gailuen artean kopia ditzake; guk ez ditugu inoiz ikusten.",
        "Luzapenak behar dituen baimenak bakarrik eskatzen ditu. Gune jakin baterako edo gune guztietarako sarbidea «Beti gune honetan» edo «Gune guztietan» aukeratzen duzunean bakarrik eskatzen da, eta nahi duzunean kendu dezakezu.",
      ],
    },
    accessibility: {
      title: "Irisgarritasuna",
      body: [
        "Nabarmentzeak ez du inoiz aldatzen pantaila-irakurgailu batek irakurtzen duena: testua berbera da, karakterez karaktere. Proba automatikoekin egiaztatzen dugu, eta NVDA eta VoiceOver-ekin bertsio bakoitza argitaratu aurretik.",
        "Dena teklatuarekin bakarrik erabil daiteke. Luzapena Alt+B teklekin aktibatu eta desaktibatzen da, eta lasterbidea zure nabigatzailearen ezarpenetan alda dezakezu.",
        "Nabarmentzearen koloreak testuaren beraren koloretik ateratzen dira, eta, horrela, kontrasteak bere horretan irauten du modu argian, modu ilunean eta gune bakoitzaren gaian.",
        "Webgune honek Atkinson Hyperlegible letra-tipoa erabiltzen du, letrak argi bereizteko diseinatua, eta zure sistemaren modu ilunaren eta mugimendu murriztuaren hobespenak errespetatzen ditu.",
        "Oztoporen bat aurkitzen baduzu, ireki arazo bat GitHub-en, mesedez: akats bat da, eta horrela tratatuko dugu.",
      ],
    },
  },
};
