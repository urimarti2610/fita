import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Suomi";

export const slugs: Record<PageKey, string> = {
  uses: "kenelle",
  worksheets: "tyoarkit",
  convert: "muunna",
  privacy: "tietosuoja",
  accessibility: "saavutettavuus",
};

export const strings: Strings = {
  meta: {
    description:
      "Maksuton ja avoimen lähdekoodin lukemisen apuväline ihmisille, joilla on ADHD tai lukihäiriö: korostaa jokaisen sanan alkua verkossa ja e-kirjoissasi. Kaikki pysyy omalla laitteellasi.",
  },
  nav: {
    skip: "Siirry sisältöön",
    home: "Etusivu",
    convert: "Muunna kirja",
    privacy: "Tietosuoja",
    accessibility: "Saavutettavuus",
    github: "Lähdekoodi",
    language: "Kieli",
    theme: {
      label: "Teema",
      light: "vaalea",
      dark: "tumma",
    },
  },
  hero: {
    headline: "Lue omalla tavallasi",
    lede: "Korostaa hienovaraisesti jokaisen sanan alkua, jotta katseella on mihin tarttua. Ihmisille, joilla on ADHD tai lukihäiriö, ja kaikille, joista se tuntuu mukavammalta. Maksuton, ei käyttäjätilejä, eikä mikään koskaan lähde laitteeltasi.",
  },
  install: {
    chrome: "Lisää Chromeen tai Edgeen",
    firefox: "Lisää Firefoxiin",
    preview: "Ei vielä kaupoissa. Sillä välin voit asentaa esiversion GitHubista.",
  },
  demo: {
    heading: "Kokeile omalla tekstilläsi",
    intro: "Liitä mikä tahansa teksti. Tulos päivittyy heti, eikä pituudella ole rajaa.",
    input: "Tekstisi",
    output: "Miltä se näyttää",
    sample:
      "Lukemisen pitäisi tuntua mukavalta. Jotkut hukkaavat kohdan, hyppäävät sanojen yli tai väsyvät ennen kappaleen loppua. Kun jokaisen sanan alku on korostettu, katse saa ankkurin: kokeile eri voimakkuuksia ja tyylejä, kunnes löydät omasi.",
    strength: "Voimakkuus",
    style: "Tyyli",
    styles: {
      "bold-fade": "Lihavointi ja häivytys",
      bold: "Lihavointi",
      color: "Väri",
      underline: "Alleviivaus",
      fade: "Häivytä loppuosa",
    },
    more: "Lisää asetuksia",
    every: "Korosta",
    everyOptions: ["Jokainen sana", "Joka toinen sana", "Joka kolmas sana"],
    lineHeight: "Riviväli",
    maxWidth: "Rivin enimmäisleveys",
    pageDefault: "Normaali",
    widths: ["Kapea (50 merkkiä)", "Keskikokoinen (65 merkkiä)", "Leveä (80 merkkiä)"],
  },
  privacy: {
    heading: "Mikään ei lähde laitteeltasi",
    body: [
      "Laajennus, tämä sivu ja kirjamuunnin toimivat kokonaan selaimessasi. Ei ole palvelinta, jolle mitään lähetettäisiin.",
      "Ei käyttäjätilejä, ei analytiikkaa, ei evästeitä eikä käyttörajoja.",
    ],
    more: "Lue tietosuojaseloste",
  },
  faq: {
    heading: "Kysymyksiä",
    items: [
      {
        q: "Toimiiko se oikeasti?",
        a: [
          "Se riippuu ihmisestä. Tähän mennessä julkaistut tutkimukset eivät osoita, että tällainen korostus keskimäärin nopeuttaisi lukemista tai parantaisi ymmärtämistä.",
          "Monet kuitenkin kertovat, että lukeminen tuntuu mukavammalta, kohta hukkuu harvemmin tai aloittaminen on helpompaa. Siksi emme lupaa nopeutta: tarjoamme apuvälineen, jota voit säätää tai jonka voit kytkeä pois. Kokeile demoa ja pidä se, mikä auttaa.",
        ],
      },
      {
        q: "Maksaako se mitään?",
        a: [
          "Ei, eikä tule koskaan maksamaan. Ei maksullista versiota, ei sanarajaa eikä tiedostokoon rajaa. Se on vapaata ohjelmistoa Apache-2.0-lisenssillä.",
        ],
      },
      {
        q: "Voinko käyttää sitä e-kirjojeni kanssa?",
        a: [
          "Kyllä. Kohdassa ”Muunna kirja” valitset EPUB-, TXT-, Markdown- tai HTML-tiedoston ja lataat korostetun kopion. Muunnos tapahtuu selaimessasi. DRM-suojattuja kirjoja ei voi muuntaa.",
        ],
      },
      {
        q: "Toimiiko se kaikilla kielillä?",
        a: [
          "Kaikilla kielillä, joissa sanat erotetaan välilyönneillä, myös oikealta vasemmalle kirjoitettavilla. Kiinan, japanin, thain ja muiden ilman välilyöntejä kirjoitettavien kielten teksti jätetään ennalleen.",
        ],
      },
      {
        q: "Entä jos käytän ruudunlukijaa?",
        a: ["Teksti luetaan täsmälleen kuten ennenkin: yhtään merkkiä ei lisätä eikä poisteta."],
      },
      {
        q: "Toimiiko se puhelimessani?",
        a: ["Kyllä, Androidin Firefoxilla. Oma sovellus tulee myöhemmin."],
      },
    ],
  },
  footer: {
    license: "Vapaata ohjelmistoa Apache-2.0-lisenssillä.",
  },
  uses: {
    title: "Kenelle se on",
    intro:
      "Jokainen lukee omalla tavallaan. Tässä muutamia tapoja käyttää työkalua sen mukaan, kuka olet ja mihin sitä tarvitset. Kaikille on yhteistä yksi asia: se on vapaaehtoinen apuväline, jota voit säätää tai jonka voit kytkeä pois, eikä se kerää mitään tietoja.",
    homeHeading: "Kenelle se on",
    how: "Näin käytät sitä",
    care: "Hyvä tietää",
    cases: [
      {
        id: "education",
        title: "Opetus",
        summary:
          "Opettajille, kouluille ja perheille, jotka haluavat mukauttaa lukumateriaalia tekemättä uutta.",
        link: "Ideoita luokkaan ja kotiin",
        lede: "Opettajille, erityisopettajille ja perheille, jotka haluavat lukemisen vaativan vähän vähemmän vaivaa ilman, että jokaiselle oppilaalle pitää valmistella omaa materiaalia.",
        steps: [
          "Mukauta materiaalia, joka sinulla jo on: muunna lukutekstit, muistiinpanot tai kirjat EPUB-, TXT-, Markdown- tai HTML-muodossa ja jaa ne sellaisinaan.",
          "Näytä tunnilla demoa päivän tekstillä ja kokeilkaa yhdessä eri voimakkuuksia ja tyylejä. Anna jokaisen oppilaan kertoa, mikä tuntuu mukavimmalta.",
          "Koulun tietokoneilla laajennus toimii ilman käyttäjätilejä tai rekisteröitymistä eikä kerää oppilaista mitään tietoja.",
          "Tee kohdassa ”Työarkit” lukutehtäviä, joissa on iso teksti ja hauska kehys, ja tulosta ne tai tallenna PDF:nä.",
          "Kotona sama laajennus auttaa läksyissä ja verkossa lukemisessa.",
        ],
        notes: [
          "Se on vapaaehtoinen apuväline: se auttaa joitakin oppilaita, toisia ei. Anna jokaisen valita itse ja kytkeä se pois, jos haluaa.",
          "Se ei korvaa oppimisen tukea eikä oppimisvaikeuksien tunnistamista ja diagnosointia.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Puheterapeutit ja muut ammattilaiset",
        summary:
          "Puheterapeuteille, psykologeille ja ohjaajille, jotka etsivät yksinkertaista työkalua kokeiltavaksi tapaamisissa.",
        link: "Näin käytät sitä tapaamisissa",
        lede: "Puheterapeuteille, erityisopettajille, koulupsykologeille, ohjaajille ja muille ammattilaisille, jotka tukevat ihmisiä, joilla on lukemisen vaikeuksia.",
        steps: [
          "Liitä tapaamisessa teksti demoon ja kokeilkaa yhdessä useita asetuksia. Kirjaa ylös, mikä tuntuu mukavimmalta: voimakkuus, tyyli, korostetut sanat, riviväli.",
          "Valmistele työmateriaalia muuntimella ja jaa se paperilla, näytöllä tai lukulaitteella.",
          "Suosittele laajennusta kotikäyttöön yhdessä valitsemillanne asetuksilla.",
          "Kaikki tapahtuu laitteella: mikään teksti tai asiakastieto ei koskaan kulje palvelimen kautta.",
        ],
        notes: [
          "Se ei ole hoito eikä lukemisen kuntoutusmenetelmä. Se voi olla yksi tuki muun työsi ohella.",
          "Tutkimukset eivät osoita keskimääräistä hyötyä nopeudessa tai ymmärtämisessä. Esittele se mukavuuden ja mieltymysten asiana ja arvioi tapaus kerrallaan.",
        ],
      },
      {
        id: "adults",
        title: "Aikuiset",
        summary:
          "Niille, jotka haluavat palata lukemisen pariin mutta eivät pysty keskittymään, hukkaavat kohdan tai väsyvät nopeasti.",
        link: "Näin pääset alkuun",
        lede: "Jos haluaisit lukea enemmän, mutta aloittaminen on vaikeaa, hukkaat kohdan, luet saman lauseen kolmesti tai väsyt jo toisella sivulla, tästä voi olla apua. Ja jos ei ole, sekin on ihan okei.",
        steps: [
          "Asenna laajennus ja kytke se päälle Alt+B:llä artikkelissa, joka kiinnostaa sinua. Aloita lyhyistä teksteistä.",
          "Muunna kirja, jonka oikeasti haluat lukea, ja siirrä se lukulaitteeseesi tai puhelimeesi.",
          "Säädä voimakkuutta, kunnes se tuntuu mukavalta. Kohdassa ”Lisää asetuksia” voit kasvattaa riviväliä ja kaventaa rivejä: monia se auttaa yhtä paljon kuin korostus.",
          "Jos se jonain päivänä väsyttää, kytke se pois. Se on sinun tapasi lukea, ei sääntö.",
        ],
        notes: [
          "Se ei toimi kaikille, ja se on ihan okei. Anna sille muutama päivä ennen kuin päätät.",
          "Jos epäilet, että vaikeuksiesi taustalla voi olla ADHD tai lukihäiriö, ammattilaisen kanssa puhuminen voi auttaa.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Lukemisen työarkit",
    nav: "Työarkit",
    intro:
      "Tee työarkkeja, joissa on iso teksti, jokaisen sanan alku korostettuna ja hauska kehys. Valitse esimerkkiteksti tai kirjoita oma, ja tulosta tai lataa se.",
    editor: "Muokkaa työarkkia",
    example: "Valitse teksti",
    titleLabel: "Otsikko",
    textLabel: "Teksti",
    theme: "Kehys",
    themes: {
      none: "Ei kehystä",
      simple: "Yksinkertainen",
      clouds: "Pilvet",
      garden: "Puutarha",
      stars: "Tähdet",
      vehicles: "Autot ja rekat",
    },
    size: "Tekstin koko",
    sizes: ["Suuri", "Hyvin suuri", "Valtava"],
    nameDate: "Lisää nimi ja päivämäärä",
    name: "Nimi",
    date: "Päivämäärä",
    lines: "Kirjoitusrivit",
    linesOptions: ["Ei rivejä", "3 riviä", "6 riviä", "10 riviä"],
    preview: "Esikatselu",
    showPageSize: "Näytä sivun koko",
    pageSizes: { portrait: "A4 pysty (210 × 297 mm)", landscape: "A4 vaaka (297 × 210 mm)" },
    pageN: "Sivu {n}",
    editHint:
      "Voit kirjoittaa suoraan työarkkiin: napsauta otsikkoa tai tekstiä. Korostus lisätään, kun olet valmis.",
    editTitle: "Työarkin otsikko",
    editText: "Työarkin teksti",
    print: "Tulosta tai tallenna PDF:nä",
    download: "Lataa työarkki",
    printHint:
      "Jos haluat tallentaa PDF:nä, valitse tulostusikkunassa ”Tallenna PDF-tiedostona”. Arkki tulostuu valkoiselle pohjalle, jotta mustetta säästyy.",
    downloadHint:
      "Ladattava tiedosto on verkkosivu, jonka voit avata ja tulostaa milloin tahansa, myös ilman verkkoyhteyttä.",
    fileName: "tyoarkki",
    tabs: { text: "Teksti", layout: "Asettelu", emphasis: "Korostus" },
    myTexts: "Omat tekstini",
    save: "Tallenna omiin teksteihin",
    saved: "”{title}” on tallennettu omiin teksteihin.",
    remove: "Poista omista teksteistä",
    removed: "”{title}” poistettiin omista teksteistä.",
    exportTexts: "Vie omat tekstit",
    importTexts: "Tuo tekstejä",
    imported: "Tuotuja tekstejä: {n}.",
    importEmpty:
      "Tiedostossa ei ole tekstejä. Käytä .md-tiedostoa, jossa on ”## ”-otsikot, tai .txt-tiedostoa.",
    libraryNote:
      "Tekstisi tallennetaan vain tähän selaimeen. Vie ne tiedostoon, jos haluat säilyttää kopion, jakaa ne tai siirtää ne toiselle tietokoneelle.",
    exportHeading: "Omat työarkkitekstini",
    levelKey: "Taso",
    textsFileName: "omat-tyoarkkitekstit",
    orientation: "Suunta",
    orientations: { portrait: "Pysty", landscape: "Vaaka" },
    overflow:
      "Työarkki jatkuu toiselle sivulle. Jotta se mahtuisi yhdelle, lyhennä tekstiä, valitse pienempi tekstin koko tai poista rivejä.",
  },
  settings: {
    title: "Lukuasetukset",
    open: "Avaa lukuasetukset",
    close: "Sulje",
    note: "Ne koskevat demoa, työarkkeja ja muunninta, ja ne tallennetaan vain tähän selaimeen.",
    presets: "Tallennetut asetukseni",
    empty:
      "Et ole vielä tallentanut asetuksia. Anna nykyisille asetuksille nimi, niin palaat niihin yhdellä napsautuksella.",
    name: "Nimi",
    placeholder: "Esimerkiksi: Luokan lukuhetki",
    save: "Tallenna",
    apply: "Käytä asetuksia ”{name}”",
    remove: "Poista ”{name}”",
    saved: "Asetukset ”{name}” tallennettu.",
    removed: "”{name}” poistettiin.",
    applied: "Nyt käytössä: ”{name}”.",
    reset: "Palauta oletusasetukset",
    restored: "Oletusasetukset palautettu.",
  },
  convert: {
    title: "Muunna kirja",
    intro:
      "Valitse kirja tai asiakirja ja lataa korostettu kopio. Tiedosto ei koskaan lähde laitteeltasi: kaikki tapahtuu tässä selaimessa, ilman kokorajaa.",
    pick: "Valitse tiedosto",
    drop: "tai pudota se tähän",
    formats: "EPUB, TXT, Markdown tai HTML",
    selected: "Valittu tiedosto:",
    output: "Tallennusmuoto",
    outputs: { epub: "EPUB (e-kirja)", html: "HTML (verkkosivu)", md: "Markdown" },
    options: "Miten korostetaan",
    start: "Muunna",
    progress: "Muunnetaan: {n} %",
    cancel: "Peruuta",
    cancelled: "Muunnos peruutettiin. Mitään ei tallennettu.",
    done: "Valmista. Tiedostosi odottaa.",
    download: "Lataa {name}",
    errors: {
      unsupported: "Tätä muotoa ei voi muuntaa. Valitse EPUB-, TXT-, Markdown- tai HTML-tiedosto.",
      drm: "Tässä kirjassa on DRM (kopiosuojaus), joten sitä ei voi muuntaa. Jos ostit sen, kysy kaupasta, voivatko he antaa sinulle DRM-vapaan kopion.",
      invalid:
        "Tiedostoa ei voitu lukea. Tarkista, avautuuko se lukulaitteessasi tai -sovelluksessasi, tai kokeile toista.",
      failed:
        "Muunnos epäonnistui ({detail}). Jos niin käy uudelleen, kerro siitä meille GitHubissa.",
    },
    labels: { part: "Osa", contents: "Sisällys" },
    steps: {
      choose: "Valitse kirja",
      adjust: "Säädä ulkoasu",
      convert: "Muunna ja lataa",
    },
    previewTitle: "Näin kirjasi alkaa",
    previewEmpty: "Valitse tiedosto, niin sen ensimmäinen sivu näkyy tässä korostettuna.",
    previewLoading: "Valmistellaan esikatselua…",
    previewNote:
      "Suuntaa-antava näkymä: jokainen lukulaite näyttää kirjan omalla fontillaan ja koollaan.",
    previewNone: "Tiedoston alusta ei löytynyt tekstiä, mutta voit silti muuntaa sen.",
    change: "Valitse toinen tiedosto",
    devices: {
      heading: "Näin saat sen lukulaitteeseesi",
      items: [
        {
          name: "Kindle",
          text: "Käytä Amazonin Send to Kindle -palvelua (verkkosivu, sovellus tai sähköposti) ja valitse EPUB-tiedosto. Amazon muokkaa sen Kindlellesi sopivaksi.",
        },
        {
          name: "Kobo",
          text: "Liitä Kobo tietokoneeseen USB-kaapelilla ja kopioi EPUB-tiedosto siihen. Poista laite turvallisesti, niin kirja ilmestyy kirjastoosi.",
        },
        {
          name: "PocketBook",
          text: "Kopioi se USB:n kautta kuten Koboon tai lähetä se sähköpostilla Send-to-PocketBook-palvelun avulla.",
        },
      ],
      calibre:
        "Jos käytät Calibrea, lisää tiedosto kirjastoosi ja lähetä se lukulaitteeseesi kuten minkä tahansa muun kirjan.",
    },
  },
  pages: {
    privacy: {
      title: "Tietosuoja",
      body: [
        "Emme kerää mitään tietoja. Emme yhtään.",
        "Laajennus, tämä verkkosivusto ja muunnin toimivat kokonaan laitteellasi. Sitä, mitä luet, ja tiedostoja, joita muunnat, ei koskaan lähetetä minnekään: meillä ei ole palvelimia.",
        "Emme käytä analytiikkaa, evästeitä, telemetriaa emmekä muilta sivustoilta haettuja fontteja tai skriptejä.",
        "Laajennus tallentaa asetuksesi (voimakkuus, tyyli, sivustot, joilla haluat sen olevan aina päällä) oman selaimesi tallennustilaan. Jos selaimen synkronointi on käytössä, selain voi kopioida ne laitteidesi välillä; me emme näe niitä koskaan.",
        "Laajennus pyytää vain tarvitsemansa käyttöoikeudet. Pääsyä tiettyyn sivustoon tai kaikkiin sivustoihin pyydetään vasta, kun valitset ”Aina tällä sivustolla” tai ”Kaikilla sivustoilla”, ja voit perua sen milloin tahansa.",
      ],
    },
    accessibility: {
      title: "Saavutettavuus",
      body: [
        "Korostus ei koskaan muuta sitä, mitä ruudunlukija lukee: teksti on täsmälleen sama merkki merkiltä. Tarkistamme tämän automaattisilla testeillä sekä NVDA:lla ja VoiceOverilla ennen jokaista julkaisua.",
        "Kaikki toimii pelkällä näppäimistöllä. Laajennus kytketään päälle ja pois Alt+B:llä, ja pikanäppäimen voi vaihtaa selaimen asetuksista.",
        "Korostuksen värit johdetaan tekstin omasta väristä, joten kontrasti säilyy vaaleassa ja tummassa tilassa sekä jokaisen sivuston omassa teemassa.",
        "Tämä verkkosivusto käyttää Atkinson Hyperlegible -kirjasinta, joka on suunniteltu niin, että kirjaimet erottuvat selvästi toisistaan, ja noudattaa järjestelmäsi tumman tilan ja vähennetyn liikkeen asetuksia.",
        "Jos kohtaat esteen, avaa siitä issue GitHubissa: se on virhe, ja käsittelemme sitä virheenä.",
      ],
    },
  },
};
