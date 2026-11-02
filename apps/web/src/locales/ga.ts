import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Gaeilge";

export const slugs: Record<PageKey, string> = {
  uses: "ce-do-e",
  worksheets: "bileoga-oibre",
  convert: "tiontaigh",
  privacy: "priobhaideacht",
  accessibility: "inrochtaineacht",
};

export const strings: Strings = {
  meta: {
    description:
      "Áis léitheoireachta saor in aisce agus foinse oscailte do dhaoine a bhfuil ADHD nó disléicse orthu: cuireann sí béim ar thús gach focail ar an ngréasán agus i do ríomhleabhair. Fanann gach rud ar do ghléas.",
  },
  nav: {
    skip: "Léim go dtí an t-ábhar",
    home: "Baile",
    convert: "Tiontaigh leabhar",
    privacy: "Príobháideacht",
    accessibility: "Inrochtaineacht",
    github: "Cód foinseach",
    language: "Teanga",
    theme: {
      label: "Téama",
      light: "geal",
      dark: "dorcha",
    },
  },
  hero: {
    headline: "Léigh ar do bhealach féin",
    lede: "Cuireann sé béim bhog ar thús gach focail, ionas go mbíonn áit ag do shúile le stopadh. Do dhaoine a bhfuil ADHD nó disléicse orthu, nó d’aon duine a bhfuil sé níos compordaí dóibh. Saor in aisce, gan chuntas, agus ní fhágann aon rud do ghléas riamh.",
  },
  install: {
    chrome: "Cuir le Chrome nó Edge",
    firefox: "Cuir le Firefox",
    preview:
      "Níl sé sna siopaí fós. Idir an dá linn, is féidir leat an leagan réamhamhairc a shuiteáil ó GitHub.",
  },
  demo: {
    heading: "Bain triail as le do théacs féin",
    intro: "Greamaigh aon téacs. Athraíonn an toradh láithreach, agus níl aon teorainn le fad.",
    input: "Do théacs",
    output: "Mar a léitear é",
    sample:
      "Ba cheart go mbeadh léitheoireacht compordach. Cailleann daoine áirithe an áit, léimeann siad thar fhocail nó éiríonn siad tuirseach roimh dheireadh an ailt. Nuair a mharcáiltear tús gach focail, faigheann do shúile pointe ancaire: bain triail as nirt agus stíleanna éagsúla go dtí go n-aimsíonn tú an ceann a oireann duit.",
    strength: "Neart",
    style: "Stíl",
    styles: {
      "bold-fade": "Trom agus éadrom",
      bold: "Trom",
      color: "Dath",
      underline: "Folíne",
      fade: "Maolaigh an chuid eile",
    },
    more: "Tuilleadh roghanna",
    every: "Cuir béim ar",
    everyOptions: ["Gach focal", "1 as gach 2 fhocal", "1 as gach 3 fhocal"],
    lineHeight: "Spásáil línte",
    maxWidth: "Leithead uasta na líne",
    pageDefault: "Gnáth",
    widths: ["Caol (50 carachtar)", "Meánach (65 carachtar)", "Leathan (80 carachtar)"],
  },
  privacy: {
    heading: "Ní fhágann aon rud do ghléas",
    body: [
      "Ritheann an breiseán, an leathanach seo agus an tiontaire leabhar go hiomlán i do bhrabhsálaí. Níl aon fhreastalaí ann chun aon rud a sheoladh chuige.",
      "Gan chuntais, gan anailísíocht, gan fianáin agus gan teorainneacha úsáide.",
    ],
    more: "Léigh an polasaí príobháideachta",
  },
  faq: {
    heading: "Ceisteanna",
    items: [
      {
        q: "An oibríonn sé i ndáiríre?",
        a: [
          "Braitheann sé ar an duine. Ní léiríonn na staidéir atá foilsithe go dtí seo go léann daoine níos tapúla ná go dtuigeann siad níos mó, ar an meán, leis an gcineál seo béime.",
          "An rud a deir go leor daoine ná go mbíonn an léitheoireacht níos compordaí, go gcailleann siad an áit níos lú, nó gur fusa tosú. Mar sin, ní gheallaimid luas: tairgimid áis is féidir leat a choigeartú nó a mhúchadh. Bain triail as an taispeántas agus coinnigh cibé rud a chabhraíonn leat.",
        ],
      },
      {
        q: "An gcosnaíonn sé aon rud?",
        a: [
          "Ní chosnaíonn, agus ní chosnóidh go deo. Níl leagan íoctha ann, níl teorainn le focail ná le méid comhaid. Is bogearraí saora é faoin gceadúnas MPL-2.0.",
        ],
      },
      {
        q: "An féidir liom é a úsáid le mo ríomhleabhair?",
        a: [
          "Is féidir. In “Tiontaigh leabhar”, roghnaíonn tú comhad EPUB, TXT, Markdown nó HTML agus íoslódálann tú cóip le béim. Déantar an tiontú i do bhrabhsálaí. Ní féidir leabhair a bhfuil DRM orthu a thiontú.",
        ],
      },
      {
        q: "An oibríonn sé in aon teanga?",
        a: [
          "Oibríonn, i ngach teanga a scarann focail le spásanna, scripteanna ó dheis go clé san áireamh. Fágtar an tSínis, an tSeapáinis, an Téalainnis agus scripteanna eile gan spásanna mar atá siad.",
        ],
      },
      {
        q: "Cad a tharlaíonn má úsáidim léitheoir scáileáin?",
        a: [
          "Léitear an téacs díreach mar a bhí: ní chuirtear aon charachtar leis ná ní bhaintear aon cheann de.",
        ],
      },
      {
        q: "An oibríonn sé ar m’fhón?",
        a: ["Oibríonn, le Firefox do Android. Tiocfaidh aip faoi leith níos déanaí."],
      },
    ],
  },
  footer: {
    license: "Bogearraí saora faoin gceadúnas MPL-2.0.",
  },
  uses: {
    title: "Cé dó é",
    intro:
      "Léann gach duine ar a bhealach féin. Seo roinnt bealaí chun an uirlis a úsáid, ag brath ar cé thú féin agus cad chuige a bhfuil sí uait. Tá rud amháin i gcoitinne acu ar fad: is áis roghnach í is féidir leat a choigeartú nó a mhúchadh, agus ní bhailíonn sí aon sonraí.",
    homeHeading: "Cé dó é",
    how: "Conas é a úsáid",
    care: "Cuimhnigh",
    cases: [
      {
        id: "education",
        title: "Oideachas",
        summary:
          "Do mhúinteoirí, do scoileanna agus do theaghlaigh ar mian leo ábhar léitheoireachta a oiriúnú gan ábhar nua a chruthú.",
        link: "Smaointe don seomra ranga agus don bhaile",
        lede: "Do mhúinteoirí, d’fhoirne tacaíochta foghlama agus do theaghlaigh ar mian leo go mbeadh an léitheoireacht beagán níos éasca, gan ábhar difriúil a ullmhú do gach dalta.",
        steps: [
          "Oiriúnaigh an t-ábhar atá agat cheana: tiontaigh téacsanna léitheoireachta, nótaí nó leabhair in EPUB, TXT, Markdown nó HTML agus roinn iad mar atá.",
          "Sa rang, teilg an taispeántas le téacs an lae agus bainigí triail as nirt agus stíleanna éagsúla le chéile. Lig do gach dalta a rá cén ceann is compordaí dóibh.",
          "Ar ríomhairí na scoile, oibríonn an breiseán gan chuntais ná clárú, agus ní bhailíonn sé aon sonraí faoi na daltaí.",
          "Déan bileoga léitheoireachta le cló mór agus fráma cairdiúil in “Bileoga oibre”, ansin priontáil iad nó sábháil mar PDF iad.",
          "Sa bhaile, cabhraíonn an breiseán céanna le hobair bhaile agus le léitheoireacht ar an ngréasán.",
        ],
        notes: [
          "Is áis roghnach í: cabhraíonn sí le daltaí áirithe agus ní chabhraíonn sí le daltaí eile. Lig do gach duine roghnú, agus í a mhúchadh más mian leo.",
          "Ní thagann sí in áit tacaíocht oideachais ná diagnóis ar dheacrachtaí foghlama.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Teiripeoirí urlabhra agus gairmithe eile",
        summary:
          "Do theiripeoirí urlabhra agus teanga, do shíceolaithe oideachais agus do chomhairleoirí atá ag lorg uirlis shimplí le triail a bhaint aisti i seisiúin.",
        link: "Conas í a úsáid i seisiúin",
        lede: "Do theiripeoirí urlabhra agus teanga, do shíceolaithe oideachais, do chomhairleoirí agus do ghairmithe eile a thacaíonn le daoine a bhfuil deacrachtaí léitheoireachta acu.",
        steps: [
          "I seisiún, greamaigh téacs isteach sa taispeántas agus bain triail as roinnt socruithe leis an duine. Nótáil cé acu is compordaí dóibh: neart, stíl, focail le béim, spásáil línte.",
          "Ullmhaigh ábhar oibre leis an tiontaire agus tabhair amach é ar pháipéar, ar scáileán nó ar léitheoir ríomhleabhar.",
          "Mol an breiseán le húsáid sa bhaile, leis na socruithe a roghnaigh sibh le chéile.",
          "Ritheann gach rud ar an ngléas: ní théann aon téacs ná aon sonraí othar trí fhreastalaí riamh.",
        ],
        notes: [
          "Ní cóireáil ná modh idirghabhála léitheoireachta é. Is féidir leis a bheith ina thacaíocht amháin laistigh de do chuid oibre.",
          "Ní léiríonn staidéir aon fheabhas ar an meán ar luas ná ar thuiscint. Cuir i láthair é mar cheist chompoird agus rogha, agus measúnaigh é cás ar chás.",
        ],
      },
      {
        id: "adults",
        title: "Daoine fásta",
        summary:
          "Do dhaoine ar mian leo filleadh ar an léitheoireacht ach nach bhfuil in ann díriú, a chailleann an áit nó a éiríonn tuirseach go tapa.",
        link: "Conas tosú",
        lede: "Más mian leat níos mó a léamh ach go bhfuil sé deacair tosú, go gcailleann tú an áit, go léann tú an abairt chéanna trí huaire nó go mbíonn tú tuirseach faoin dara leathanach, b’fhéidir go gcabhródh sé seo. Agus mura gcabhraíonn, níl aon dochar ann.",
        steps: [
          "Suiteáil an breiseán agus cas air é le Alt+B ar alt a bhfuil suim agat ann. Tosaigh le téacsanna gearra.",
          "Tiontaigh leabhar ar mhaith leat é a léamh i ndáiríre agus cuir ar do léitheoir ríomhleabhar nó ar d’fhón é.",
          "Coigeartaigh an neart go dtí go mbíonn sé compordach. Faoi “Tuilleadh roghanna” is féidir leat spásáil línte a chur leis agus na línte a dhéanamh níos caoile: do go leor daoine, cabhraíonn sé sin an oiread leis an mbéim.",
          "Má chuireann sé tuirse ort lá éigin, múch é. Is é seo do bhealach féin le léamh, ní riail.",
        ],
        notes: [
          "Ní oibríonn sé do gach duine, agus níl aon dochar ann. Tabhair cúpla lá dó sula ndéanann tú cinneadh.",
          "Má cheapann tú go bhféadfadh ADHD nó disléicse a bheith taobh thiar de do dheacrachtaí, d’fhéadfadh sé cabhrú labhairt le gairmí.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Bileoga léitheoireachta",
    nav: "Bileoga oibre",
    intro:
      "Déan bileoga oibre le cló mór, béim ar thús gach focail agus fráma cairdiúil. Roghnaigh téacs samplach nó scríobh do cheann féin, ansin priontáil nó íoslódáil é.",
    editor: "Saincheap an bhileog",
    example: "Roghnaigh téacs",
    titleLabel: "Teideal",
    textLabel: "Téacs",
    theme: "Fráma",
    themes: {
      none: "Gan fráma",
      simple: "Simplí",
      clouds: "Scamaill",
      garden: "Gairdín",
      stars: "Réaltaí",
      vehicles: "Carranna agus leoraithe",
    },
    size: "Méid an téacs",
    sizes: ["Mór", "An-mhór", "Ollmhór"],
    nameDate: "Cuir ainm agus dáta leis",
    name: "Ainm",
    date: "Dáta",
    lines: "Línte le scríobh orthu",
    linesOptions: ["Dada", "3 líne", "6 líne", "10 líne"],
    preview: "Réamhamharc",
    showPageSize: "Taispeáin méid an leathanaigh",
    pageSizes: {
      portrait: "A4 portráid (210 × 297 mm)",
      landscape: "A4 tírdhreach (297 × 210 mm)",
    },
    pageN: "Leathanach {n}",
    editHint:
      "Is féidir leat clóscríobh díreach ar an mbileog: cliceáil ar an teideal nó ar an téacs. Cuirtear an bhéim i bhfeidhm nuair a chríochnaíonn tú.",
    editTitle: "Teideal na bileoige",
    editText: "Téacs na bileoige",
    print: "Priontáil nó sábháil mar PDF",
    download: "Íoslódáil an bhileog",
    printHint:
      "Chun í a shábháil mar PDF, roghnaigh “Sábháil mar PDF” sa bhosca priontála. Priontáiltear ar chúlra bán í chun dúch a spáráil.",
    downloadHint:
      "Is leathanach gréasáin é an íoslódáil is féidir leat a oscailt agus a phriontáil am ar bith, fiú as líne.",
    fileName: "bileog-oibre",
    tabs: { text: "Téacs", layout: "Leagan amach", emphasis: "Béim" },
    myTexts: "Mo théacsanna",
    save: "Sábháil i mo théacsanna",
    saved: "Tá “{title}” sábháilte i do théacsanna.",
    remove: "Bain de mo théacsanna",
    removed: "Baineadh “{title}” de do théacsanna.",
    exportTexts: "Easpórtáil mo théacsanna",
    importTexts: "Iompórtáil téacsanna",
    imported: "Téacsanna iompórtáilte: {n}.",
    importEmpty:
      "Níl aon téacsanna sa chomhad sin. Úsáid comhad .md le teidil “## ”, nó comhad .txt.",
    libraryNote:
      "Ní stóráiltear do théacsanna ach sa bhrabhsálaí seo. Easpórtáil iad chun cóip a choinneáil, iad a roinnt nó iad a bhogadh chuig ríomhaire eile.",
    exportHeading: "Téacsanna do mo bhileoga oibre",
    levelKey: "Leibhéal",
    textsFileName: "mo-theacsanna-bileoga",
    orientation: "Treoshuíomh",
    orientations: { portrait: "Portráid", landscape: "Tírdhreach" },
    overflow:
      "Leanann an bhileog ar aghaidh go dtí an dara leathanach. Chun í a choinneáil ar leathanach amháin, giorraigh an téacs, roghnaigh méid téacs níos lú nó bain línte.",
  },
  settings: {
    title: "Socruithe léitheoireachta",
    open: "Oscail na socruithe léitheoireachta",
    close: "Dún",
    note: "Baineann siad leis an taispeántas, leis na bileoga oibre agus leis an tiontaire, agus ní stóráiltear iad ach sa bhrabhsálaí seo.",
    presets: "Mo shocruithe sábháilte",
    empty:
      "Níor shábháil tú aon socruithe fós. Tabhair ainm do na socruithe reatha chun filleadh orthu le cliceáil amháin.",
    name: "Ainm",
    placeholder: "Mar shampla: Léitheoireacht ranga",
    save: "Sábháil",
    apply: "Úsáid na socruithe “{name}”",
    remove: "Scrios “{name}”",
    saved: "Sábháladh na socruithe “{name}”.",
    removed: "Scriosadh “{name}”.",
    applied: "Tá “{name}” in úsáid anois.",
    reset: "Ar ais chuig na socruithe réamhshocraithe",
    restored: "Athbhunaíodh na socruithe réamhshocraithe.",
  },
  convert: {
    title: "Tiontaigh leabhar",
    intro:
      "Roghnaigh leabhar nó doiciméad agus íoslódáil cóip le béim. Ní fhágann an comhad do ghléas riamh: tarlaíonn gach rud sa bhrabhsálaí seo, gan teorainn le méid.",
    pick: "Roghnaigh comhad",
    drop: "nó scaoil anseo é",
    formats: "EPUB, TXT, Markdown nó HTML",
    selected: "Comhad roghnaithe:",
    output: "Formáid aschuir",
    outputs: { epub: "EPUB (ríomhleabhar)", html: "HTML (leathanach gréasáin)", md: "Markdown" },
    options: "Conas béim a chur",
    start: "Tiontaigh",
    progress: "Á thiontú: {n} %",
    cancel: "Cealaigh",
    cancelled: "Cealaíodh an tiontú. Níor sábháladh aon rud.",
    done: "Déanta. Tá do chomhad réidh.",
    download: "Íoslódáil {name}",
    errors: {
      unsupported:
        "Ní féidir an fhormáid seo a thiontú. Roghnaigh comhad EPUB, TXT, Markdown nó HTML.",
      drm: "Tá DRM (cosaint ar chóipeáil) ar an leabhar seo, mar sin ní féidir é a thiontú. Má cheannaigh tú é, fiafraigh den siopa an féidir leo cóip gan DRM a thabhairt duit.",
      invalid:
        "Níorbh fhéidir an comhad seo a léamh. Seiceáil go n-osclaíonn sé i do léitheoir, nó bain triail as ceann eile.",
      failed:
        "Theip ar an tiontú ({detail}). Má tharlaíonn sé arís, inis dúinn ar GitHub, le do thoil.",
    },
    labels: { part: "Cuid", contents: "Clár ábhair" },
    steps: {
      choose: "Roghnaigh do leabhar",
      adjust: "Coigeartaigh an chuma atá air",
      convert: "Tiontaigh agus íoslódáil",
    },
    previewTitle: "Mar a thosóidh do leabhar",
    previewEmpty: "Roghnaigh comhad agus beidh a chéad leathanach le feiceáil anseo, le béim.",
    previewLoading: "Réamhamharc á ullmhú…",
    previewNote:
      "Amharc garbh: taispeánann gach léitheoir an leabhar lena chló agus lena mhéid féin.",
    previewNone:
      "Níor aimsíodh aon téacs ag tús an chomhaid, ach is féidir leat é a thiontú mar sin féin.",
    change: "Roghnaigh comhad eile",
    devices: {
      heading: "É a chur ar do léitheoir",
      items: [
        {
          name: "Kindle",
          text: "Úsáid Send to Kindle ó Amazon (suíomh gréasáin, aip nó ríomhphost) agus roghnaigh an comhad EPUB. Oiriúnaíonn Amazon é do do Kindle.",
        },
        {
          name: "Kobo",
          text: "Ceangail do Kobo le do ríomhaire leis an gcábla USB agus cóipeáil an EPUB air. Díchuir é agus beidh an leabhar i do leabharlann.",
        },
        {
          name: "PocketBook",
          text: "Cóipeáil é thar USB, mar a dhéanfá le Kobo, nó seol é le ríomhphost leis an tseirbhís Send-to-PocketBook.",
        },
      ],
      calibre:
        "Má úsáideann tú Calibre, cuir an comhad le do leabharlann agus seol chuig do léitheoir é cosúil le haon leabhar eile.",
    },
  },
  pages: {
    privacy: {
      title: "Príobháideacht",
      body: [
        "Ní bhailímid aon sonraí. Dada.",
        "Ritheann an breiseán, an suíomh gréasáin seo agus an tiontaire go hiomlán ar do ghléas. Ní sheoltar an méid a léann tú ná na comhaid a thiontaíonn tú áit ar bith: níl aon fhreastalaithe againn.",
        "Ní úsáidimid anailísíocht, fianáin, teiliméadracht, ná clónna ná scripteanna ó shuíomhanna eile.",
        "Stórálann an breiseán do shocruithe (neart, stíl, na suíomhanna ar mian leat é a bheith air i gcónaí) i stóras do bhrabhsálaí féin. Má tá sioncrónú an bhrabhsálaí ar siúl, féadfaidh do bhrabhsálaí iad a chóipeáil idir do ghléasanna; ní fheicimidne riamh iad.",
        "Ní iarrann an breiseán ach na ceadanna a theastaíonn uaidh. Ní iarrtar rochtain ar shuíomh ar leith, nó ar gach suíomh, ach amháin nuair a roghnaíonn tú “Air i gcónaí ar an suíomh seo” nó “Ar gach suíomh”, agus is féidir leat í a chúlghairm am ar bith.",
      ],
    },
    accessibility: {
      title: "Inrochtaineacht",
      body: [
        "Ní athraíonn an bhéim riamh an rud a léann léitheoir scáileáin: tá an téacs díreach mar an gcéanna, carachtar ar charachtar. Seiceálaimid é seo le tástálacha uathoibríocha, agus le NVDA agus VoiceOver roimh gach eisiúint.",
        "Oibríonn gach rud leis an méarchlár amháin. Casann Alt+B an breiseán air agus as, agus is féidir leat an t-aicearra a athrú i socruithe do bhrabhsálaí.",
        "Tógtar dathanna na béime ó dhath an téacs féin, mar sin coinnítear an chodarsnacht sa mhód geal, sa mhód dorcha agus i dtéama gach suímh.",
        "Úsáideann an suíomh seo an cló Atkinson Hyperlegible, a dearadh chun litreacha a idirdhealú go soiléir, agus leanann sé roghanna do chórais maidir le mód dorcha agus gluaiseacht laghdaithe.",
        "Má bhuaileann tú le bacainn, oscail ceist ar GitHub, le do thoil: is fabht é, agus déileálfaimid leis mar fhabht.",
      ],
    },
  },
};
