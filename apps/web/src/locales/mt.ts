import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Malti";

export const slugs: Record<PageKey, string> = {
  uses: "ghal-min",
  worksheets: "skedi",
  convert: "ikkonverti",
  privacy: "privatezza",
  accessibility: "accessibbilta",
};

export const strings: Strings = {
  meta: {
    description:
      "Għajnuna għall-qari, b’xejn u open source, għal persuni b’ADHD u dislessija: tenfasizza l-bidu ta’ kull kelma fuq il-web u fil-kotba elettroniċi tiegħek. Kollox jibqa’ fuq l-apparat tiegħek.",
  },
  nav: {
    skip: "Aqbeż għall-kontenut",
    home: "Paġna ewlenija",
    convert: "Ikkonverti ktieb",
    privacy: "Privatezza",
    accessibility: "Aċċessibbiltà",
    github: "Kodiċi sors",
    language: "Lingwa",
    theme: {
      label: "Tema",
      light: "ċara",
      dark: "skura",
    },
  },
  hero: {
    headline: "Aqra kif tixtieq int",
    lede: "Tenfasizza bil-mod il-bidu ta’ kull kelma biex għajnejk ikollhom fejn jistrieħu. Għal persuni b’ADHD, b’dislessija, jew għal kull min isibha aktar komda. B’xejn, mingħajr kontijiet, u xejn ma joħroġ mill-apparat tiegħek.",
  },
  install: {
    chrome: "Żid ma’ Chrome jew Edge",
    firefox: "Żid ma’ Firefox",
    preview:
      "Għadha mhix fil-ħwienet. Sadanittant, tista’ tinstalla l-verżjoni ta’ prova minn GitHub.",
  },
  demo: {
    heading: "Ipprovaha bit-test tiegħek",
    intro:
      "Waħħal kwalunkwe test. Ir-riżultat jinbidel mill-ewwel, u m’hemm l-ebda limitu fit-tul.",
    input: "It-test tiegħek",
    output: "Kif jinqara",
    sample:
      "Il-qari għandu jkun komdu. Xi nies jitilfu fejn waslu, jaqbżu kliem jew jgħajew qabel jispiċċa l-paragrafu. Meta timmarka l-bidu ta’ kull kelma, għajnejk isibu punt ta’ ankraġġ: ipprova intensitajiet u stili differenti sakemm issib dak li jaqbel għalik.",
    strength: "Intensità",
    style: "Stil",
    styles: {
      "bold-fade": "Grassett u ċajpar",
      bold: "Grassett",
      color: "Kulur",
      underline: "Sottolinjar",
      fade: "Ċajpar il-bqija",
    },
    more: "Aktar għażliet",
    every: "Enfasizza",
    everyOptions: ["Kull kelma", "Kelma minn kull 2", "Kelma minn kull 3"],
    lineHeight: "Spazju bejn il-linji",
    maxWidth: "Wisa’ massimu tal-linja",
    pageDefault: "Normali",
    widths: ["Dejqa (50 karattru)", "Medja (65 karattru)", "Wiesgħa (80 karattru)"],
  },
  privacy: {
    heading: "Xejn ma joħroġ mill-apparat tiegħek",
    body: [
      "L-estensjoni, din il-paġna u l-konvertitur tal-kotba jaħdmu kompletament fil-browser tiegħek. M’hemm l-ebda server biex tibagħtlu xi ħaġa.",
      "Mingħajr kontijiet, mingħajr analitika, mingħajr cookies u mingħajr limiti ta’ użu.",
    ],
    more: "Aqra l-politika tal-privatezza",
  },
  faq: {
    heading: "Mistoqsijiet",
    items: [
      {
        q: "Verament taħdem?",
        a: [
          "Jiddependi mill-persuna. L-istudji ppubblikati s’issa ma jurux li, bħala medja, in-nies jaqraw aktar malajr jew jifhmu aktar b’dan it-tip ta’ enfasi.",
          "Dak li jgħidu ħafna nies hu li l-qari jħossuh aktar komdu, li jitilfu fejn waslu inqas spiss, jew li jsibuha aktar faċli biex jibdew. Għalhekk ma nwiegħdux veloċità: noffru għajnuna li tista’ taġġustaha jew titfiha. Ipprova d-demo u żomm dak li jgħinek.",
        ],
      },
      {
        q: "Tiswa xi ħaġa?",
        a: [
          "Le, u qatt mhi se tiswa. M’hemmx verżjoni bi ħlas, l-ebda limitu ta’ kliem u l-ebda limitu fid-daqs tal-fajl. Hija softwer ħieles taħt il-liċenzja MPL-2.0.",
        ],
      },
      {
        q: "Nista’ nużaha mal-kotba elettroniċi tiegħi?",
        a: [
          "Iva. F’“Ikkonverti ktieb” tagħżel fajl EPUB, TXT, Markdown jew HTML u tniżżel kopja bl-enfasi. Il-konverżjoni ssir fil-browser tiegħek. Kotba bid-DRM ma jistgħux jiġu kkonvertiti.",
        ],
      },
      {
        q: "Taħdem fi kwalunkwe lingwa?",
        a: [
          "Taħdem f’kull lingwa li tifred il-kliem bi spazji, inkluż il-kitbiet mil-lemin għax-xellug. Iċ-Ċiniż, il-Ġappuniż, it-Tajlandiż u kitbiet oħra mingħajr spazji jitħallew kif inhuma.",
        ],
      },
      {
        q: "U jekk nuża qarrej tal-iskrin?",
        a: ["It-test jinqara eżatt bħal qabel: l-ebda karattru ma jiżdied jew jitneħħa."],
      },
      {
        q: "Taħdem fuq il-mowbajl tiegħi?",
        a: ["Iva, b’Firefox għal Android. Aktar ’il quddiem se jkun hemm app apposta."],
      },
    ],
  },
  footer: {
    license: "Softwer ħieles taħt il-liċenzja MPL-2.0.",
  },
  uses: {
    title: "Għal min hi",
    intro:
      "Kull persuna taqra b’mod differenti. Hawn għandek xi modi kif tuża l-għodda skont min int u għal xiex teħtieġha. Kollha għandhom ħaġa waħda komuni: hija għajnuna fakultattiva li tista’ taġġustaha jew titfiha, u ma tiġbor l-ebda dejta.",
    homeHeading: "Għal min hi",
    how: "Kif tużaha",
    care: "Żomm f’moħħok",
    cases: [
      {
        id: "education",
        title: "Edukazzjoni",
        summary:
          "Għall-għalliema, l-iskejjel u l-familji li jridu jadattaw il-materjal tal-qari mingħajr ma joħolqu materjal ġdid.",
        link: "Ideat għall-klassi u għad-dar",
        lede: "Għall-għalliema, it-timijiet ta’ appoġġ fit-tagħlim u l-familji li jridu li l-qari jkun ftit inqas iebes, mingħajr ma jippreparaw materjal differenti għal kull student.",
        steps: [
          "Adatta l-materjal li diġà għandek: ikkonverti testi, noti jew kotba f’EPUB, TXT, Markdown jew HTML u aqsamhom kif inhuma.",
          "Fil-klassi, ipproġetta d-demo bit-test tal-ġurnata u ippruvaw flimkien intensitajiet u stili differenti. Ħalli kull student jgħid liema hu l-aktar komdu għalih.",
          "Fuq il-kompjuters tal-iskola, l-estensjoni taħdem mingħajr kontijiet jew reġistrazzjoni u ma tiġbor l-ebda dejta tal-istudenti.",
          "Agħmel skedi tal-qari b’ittri kbar u qafas ħbiberija f’“Skedi”, imbagħad ipprintjahom jew issejvjahom bħala PDF.",
          "Id-dar, l-istess estensjoni tgħin fix-xogħol tad-dar u fil-qari fuq il-web.",
        ],
        notes: [
          "Hija għajnuna fakultattiva: tgħin lil xi studenti u lil oħrajn le. Ħalli lil kulħadd jagħżel, u jitfiha jekk irid.",
          "Ma tiħux post l-appoġġ edukattiv jew id-dijanjosi tad-diffikultajiet fit-tagħlim.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Terapisti tal-lingwa u professjonisti oħra",
        summary:
          "Għat-terapisti tal-lingwa u d-diskors, il-psikologi edukattivi u l-konsulenti li qed ifittxu għodda sempliċi biex jippruvawha fis-sessjonijiet.",
        link: "Kif tużaha fis-sessjonijiet",
        lede: "Għat-terapisti tal-lingwa u d-diskors, il-psikologi edukattivi, il-konsulenti u professjonisti oħra li jappoġġaw persuni b’diffikultajiet fil-qari.",
        steps: [
          "Waqt sessjoni, waħħal test fid-demo u ipprova diversi settings mal-persuna. Innota liema hu l-aktar komdu: intensità, stil, kliem enfasizzat, spazju bejn il-linji.",
          "Ipprepara materjal ta’ ħidma bil-konvertitur u qassmu fuq il-karta, fuq l-iskrin jew fuq qarrej tal-kotba elettroniċi.",
          "Irrakkomanda l-estensjoni biex tintuża d-dar, bis-settings li għażiltu flimkien.",
          "Kollox jaħdem fuq l-apparat: l-ebda test jew dejta tal-pazjenti ma tgħaddi minn server.",
        ],
        notes: [
          "Mhijiex trattament jew metodu ta’ intervent fil-qari. Tista’ tkun appoġġ wieħed fi ħdan ix-xogħol tiegħek.",
          "L-istudji ma jurux titjib medju fil-veloċità jew fil-komprensjoni. Ippreżentaha bħala kwistjoni ta’ kumdità u preferenza, u evalwaha każ b’każ.",
        ],
      },
      {
        id: "adults",
        title: "Adulti",
        summary:
          "Għal persuni li jixtiequ jerġgħu jibdew jaqraw iżda ma jirnexxilhomx jikkonċentraw, jitilfu fejn waslu jew jgħajew malajr.",
        link: "Kif tibda",
        lede: "Jekk tixtieq taqra aktar iżda ssibha diffiċli biex tibda, titlef fejn wasalt, taqra l-istess sentenza tliet darbiet jew tgħajja sat-tieni paġna, din tista’ tgħinek. U jekk ma tgħinekx, m’hemm xejn ħażin.",
        steps: [
          "Installa l-estensjoni u ixgħelha b’Alt+B fuq artiklu li jinteressak. Ibda b’testi qosra.",
          "Ikkonverti ktieb li verament trid taqra u poġġih fuq il-qarrej elettroniku jew fuq il-mowbajl tiegħek.",
          "Aġġusta l-intensità sakemm tħossha komda. Taħt “Aktar għażliet” tista’ żżid l-ispazju bejn il-linji u tagħmel il-linji idjaq: għal ħafna nies dan jgħin daqs l-enfasi.",
          "Jekk xi ġurnata tgħajjik, itfiha. Dan hu l-mod tiegħek kif taqra, mhux regola.",
        ],
        notes: [
          "Ma taħdimx għal kulħadd, u m’hemm xejn ħażin. Agħtiha ftit jiem qabel tiddeċiedi.",
          "Jekk taħseb li wara d-diffikultajiet tiegħek jista’ jkun hemm ADHD jew dislessija, jista’ jgħinek titkellem ma’ professjonist.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Skedi tal-qari",
    nav: "Skedi",
    intro:
      "Agħmel skedi b’ittri kbar, il-bidu ta’ kull kelma enfasizzat u qafas ħbiberija. Agħżel test ta’ eżempju jew ikteb tiegħek, imbagħad ipprintjah jew niżżlu.",
    editor: "Personalizza l-iskeda",
    example: "Agħżel test",
    titleLabel: "Titlu",
    textLabel: "Test",
    theme: "Qafas",
    themes: {
      none: "Mingħajr qafas",
      simple: "Sempliċi",
      clouds: "Sħab",
      garden: "Ġnien",
      stars: "Stilel",
      vehicles: "Karozzi u trakkijiet",
    },
    size: "Daqs tat-test",
    sizes: ["Kbir", "Kbir ħafna", "Enormi"],
    nameDate: "Żid isem u data",
    name: "Isem",
    date: "Data",
    lines: "Linji għall-kitba",
    linesOptions: ["Xejn", "3 linji", "6 linji", "10 linji"],
    preview: "Dehra minn qabel",
    showPageSize: "Uri d-daqs tal-paġna",
    pageSizes: {
      portrait: "A4 vertikali (210 × 297 mm)",
      landscape: "A4 orizzontali (297 × 210 mm)",
    },
    pageN: "Paġna {n}",
    editHint:
      "Tista’ tikteb direttament fuq l-iskeda: ikklikkja fuq it-titlu jew fuq it-test. L-enfasi tiġi applikata meta tispiċċa.",
    editTitle: "Titlu tal-iskeda",
    editText: "Test tal-iskeda",
    print: "Ipprintja jew issejvja bħala PDF",
    download: "Niżżel l-iskeda",
    printHint:
      "Biex tissejvjaha bħala PDF, agħżel “Save as PDF” fit-tieqa tal-ipprintjar. Tiġi pprintjata fuq sfond abjad biex tiffranka l-linka.",
    downloadHint:
      "Dak li tniżżel huwa paġna web li tista’ tiftaħ u tipprintja meta trid, anke offline.",
    fileName: "skeda",
    tabs: { text: "Test", layout: "Tqassim", emphasis: "Enfasi" },
    myTexts: "It-testi tiegħi",
    save: "Issejvja fit-testi tiegħi",
    saved: "“{title}” ġie ssejvjat fit-testi tiegħek.",
    remove: "Neħħi mit-testi tiegħi",
    removed: "“{title}” tneħħa mit-testi tiegħek.",
    exportTexts: "Esporta t-testi tiegħi",
    importTexts: "Importa testi",
    imported: "Testi importati: {n}.",
    importEmpty: "M’hemm l-ebda test f’dak il-fajl. Uża fajl .md b’titli “## ”, jew fajl .txt.",
    libraryNote:
      "It-testi tiegħek jinħażnu biss f’dan il-browser. Esportahom biex iżżomm kopja, taqsamhom jew teħodhom fuq kompjuter ieħor.",
    exportHeading: "It-testi tal-iskedi tiegħi",
    levelKey: "Livell",
    textsFileName: "it-testi-tal-iskedi-tieghi",
    orientation: "Orjentazzjoni",
    orientations: { portrait: "Vertikali", landscape: "Orizzontali" },
    overflow:
      "L-iskeda tibqa’ għaddejja fuq it-tieni paġna. Biex tidħol f’paġna waħda, qassar it-test, agħżel daqs iżgħar tat-test jew neħħi xi linji.",
  },
  settings: {
    title: "Settings tal-qari",
    open: "Iftaħ is-settings tal-qari",
    close: "Agħlaq",
    note: "Japplikaw għad-demo, għall-iskedi u għall-konvertitur, u jinħażnu biss f’dan il-browser.",
    presets: "Is-settings issejvjati tiegħi",
    empty:
      "Għadek ma ssejvjajt l-ebda settings. Agħti isem lil dawk attwali biex terġa’ lura għalihom bi klikk waħda.",
    name: "Isem",
    placeholder: "Pereżempju: Qari fil-klassi",
    save: "Issejvja",
    apply: "Uża s-settings “{name}”",
    remove: "Ħassar “{name}”",
    saved: "Is-settings “{name}” ġew issejvjati.",
    removed: "“{name}” tħassar.",
    applied: "Issa qed tuża “{name}”.",
    reset: "Lura għas-settings awtomatiċi",
    restored: "Is-settings awtomatiċi ġew irrestawrati.",
  },
  convert: {
    title: "Ikkonverti ktieb",
    intro:
      "Agħżel ktieb jew dokument u niżżel kopja bl-enfasi. Il-fajl qatt ma joħroġ mill-apparat tiegħek: kollox isir f’dan il-browser, mingħajr limitu fid-daqs.",
    pick: "Agħżel fajl",
    drop: "jew waqqgħu hawn",
    formats: "EPUB, TXT, Markdown jew HTML",
    selected: "Fajl magħżul:",
    output: "Format tar-riżultat",
    outputs: { epub: "EPUB (ktieb elettroniku)", html: "HTML (paġna web)", md: "Markdown" },
    options: "Kif tenfasizza",
    start: "Ikkonverti",
    progress: "Qed jiġi kkonvertit: {n} %",
    cancel: "Ikkanċella",
    cancelled: "Il-konverżjoni ġiet ikkanċellata. Ma ġie ssejvjat xejn.",
    done: "Lest. Il-fajl tiegħek huwa lest.",
    download: "Niżżel {name}",
    errors: {
      unsupported:
        "Dan il-format ma jistax jiġi kkonvertit. Agħżel fajl EPUB, TXT, Markdown jew HTML.",
      drm: "Dan il-ktieb għandu d-DRM (protezzjoni kontra l-ikkupjar), għalhekk ma jistax jiġi kkonvertit. Jekk xtrajtu, staqsi lill-ħanut jekk jistgħux jagħtuk kopja mingħajr DRM.",
      invalid:
        "Dan il-fajl ma setax jinqara. Iċċekkja li jinfetaħ fil-qarrej tiegħek, jew ipprova ieħor.",
      failed:
        "Il-konverżjoni ma rnexxietx ({detail}). Jekk jerġa’ jiġri, jekk jogħġbok għidilna fuq GitHub.",
    },
    labels: { part: "Parti", contents: "Werrej" },
    steps: {
      choose: "Agħżel il-ktieb tiegħek",
      adjust: "Aġġusta kif jidher",
      convert: "Ikkonverti u niżżel",
    },
    previewTitle: "Kif se jibda l-ktieb tiegħek",
    previewEmpty: "Agħżel fajl u l-ewwel paġna tiegħu se tidher hawn, bl-enfasi.",
    previewLoading: "Qed titħejja d-dehra minn qabel…",
    previewNote: "Dehra approssimattiva: kull qarrej juri l-ktieb bit-tipa u bid-daqs tiegħu.",
    previewNone: "Ma nstab l-ebda test fil-bidu tal-fajl, iżda xorta tista’ tikkonvertih.",
    change: "Agħżel fajl ieħor",
    devices: {
      heading: "Kif tgħaddih fuq il-qarrej tiegħek",
      items: [
        {
          name: "Kindle",
          text: "Uża Send to Kindle ta’ Amazon (sit web, app jew email) u agħżel il-fajl EPUB. Amazon tadattah għall-Kindle tiegħek.",
        },
        {
          name: "Kobo",
          text: "Qabbad il-Kobo tiegħek mal-kompjuter bil-kejbil USB u kkopja l-EPUB fuqu. Imbagħad oħroġ (eject) l-apparat u l-ktieb jidher fil-librerija tiegħek.",
        },
        {
          name: "PocketBook",
          text: "Ikkupjah bl-USB, bħal ma’ Kobo, jew ibagħtu bl-email bis-servizz Send-to-PocketBook.",
        },
      ],
      calibre:
        "Jekk tuża Calibre, żid il-fajl mal-librerija tiegħek u ibagħtu lill-qarrej bħal kwalunkwe ktieb ieħor.",
    },
  },
  pages: {
    privacy: {
      title: "Privatezza",
      body: [
        "Ma niġbru l-ebda dejta. Xejn.",
        "L-estensjoni, dan is-sit web u l-konvertitur jaħdmu kompletament fuq l-apparat tiegħek. Dak li taqra u l-fajls li tikkonverti qatt ma jintbagħtu x’imkien: m’għandna l-ebda server.",
        "Ma nużaw l-ebda analitika, cookies, telemetrija, jew tipi u scripts minn siti oħra.",
        "L-estensjoni taħżen is-settings tiegħek (intensità, stil, siti fejn tridha dejjem mixgħula) fil-ħażna tal-browser tiegħek stess. Jekk is-sinkronizzazzjoni tal-browser hija mixgħula, il-browser jista’ jikkopjahom bejn l-apparati tiegħek; aħna qatt ma narawhom.",
        "L-estensjoni titlob biss il-permessi li teħtieġ. L-aċċess għal sit partikolari, jew għas-siti kollha, jintalab biss meta tagħżel “Dejjem fuq dan is-sit” jew “Fuq is-siti kollha”, u tista’ tirtirah meta trid.",
      ],
    },
    accessibility: {
      title: "Aċċessibbiltà",
      body: [
        "L-enfasi qatt ma tbiddel dak li jaqra qarrej tal-iskrin: it-test huwa eżatt l-istess, karattru b’karattru. Niċċekkjaw dan b’testijiet awtomatiċi, u b’NVDA u VoiceOver qabel kull rilaxx.",
        "Kollox jaħdem bit-tastiera biss. L-estensjoni tinxtegħel u tintefa b’Alt+B, u tista’ tbiddel ix-shortcut fis-settings tal-browser tiegħek.",
        "Il-kuluri tal-enfasi jinħadmu mill-kulur tat-test innifsu, għalhekk il-kuntrast jibqa’ tajjeb fil-modalità ċara, fil-modalità skura u fit-tema ta’ kull sit.",
        "Dan is-sit juża t-tipa Atkinson Hyperlegible, iddisinjata biex l-ittri jingħarfu b’mod ċar minn xulxin, u jsegwi l-preferenzi tas-sistema tiegħek għall-modalità skura u għal inqas moviment.",
        "Jekk issib xi ostaklu, jekk jogħġbok iftaħ issue fuq GitHub: huwa bug, u se nittrattawh bħala tali.",
      ],
    },
  },
};
