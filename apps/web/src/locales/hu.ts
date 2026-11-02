import type { PageKey } from "../i18n";
import type { Strings } from "./es";

export const name = "Magyar";

export const slugs: Record<PageKey, string> = {
  uses: "kinek-szol",
  worksheets: "feladatlapok",
  convert: "atalakitas",
  privacy: "adatvedelem",
  accessibility: "akadalymentesseg",
};

export const strings: Strings = {
  meta: {
    description:
      "Ingyenes, nyílt forráskódú olvasássegítő ADHD-val és diszlexiával élőknek: kiemeli minden szó elejét a weben és az e-könyveidben. Minden a saját eszközödön marad.",
  },
  nav: {
    skip: "Ugrás a tartalomra",
    home: "Kezdőlap",
    convert: "Könyv átalakítása",
    privacy: "Adatvédelem",
    accessibility: "Akadálymentesség",
    github: "Forráskód",
    language: "Nyelv",
    theme: {
      label: "Téma",
      light: "világos",
      dark: "sötét",
    },
  },
  hero: {
    headline: "Olvass a magad módján",
    lede: "Finoman kiemeli minden szó elejét, hogy a szemednek legyen hol megpihennie. ADHD-val vagy diszlexiával élőknek, és bárkinek, akinek így kényelmesebb. Ingyenes, nem kell hozzá fiók, és semmi sem hagyja el az eszközödet.",
  },
  install: {
    chrome: "Hozzáadás a Chrome-hoz vagy az Edge-hez",
    firefox: "Hozzáadás a Firefoxhoz",
    preview:
      "Még nincs fent az áruházakban. Addig is telepítheted az előzetes verziót a GitHubról.",
  },
  demo: {
    heading: "Próbáld ki a saját szövegeddel",
    intro: "Illessz be bármilyen szöveget. Az eredmény azonnal frissül, és nincs hosszkorlát.",
    input: "A szöveged",
    output: "Így olvasható",
    sample:
      "Az olvasás legyen kényelmes. Van, aki elveszíti, hol tart, kihagy szavakat, vagy elfárad a bekezdés végére. Ha minden szó eleje ki van emelve, a szemed kapaszkodót kap: próbálj ki különböző erősségeket és stílusokat, amíg rá nem találsz a sajátodra.",
    strength: "Erősség",
    style: "Stílus",
    styles: {
      "bold-fade": "Félkövér és halvány",
      bold: "Félkövér",
      color: "Szín",
      underline: "Aláhúzás",
      fade: "A többi halványan",
    },
    more: "További beállítások",
    every: "Kiemelés",
    everyOptions: ["Minden szó", "Minden második szó", "Minden harmadik szó"],
    lineHeight: "Sorköz",
    maxWidth: "Legnagyobb sorszélesség",
    pageDefault: "Normál",
    widths: ["Keskeny (50 karakter)", "Közepes (65 karakter)", "Széles (80 karakter)"],
  },
  privacy: {
    heading: "Semmi sem hagyja el az eszközödet",
    body: [
      "A bővítmény, ez az oldal és a könyvátalakító teljes egészében a böngésződben fut. Nincs szerver, ahová bármit küldhetnénk.",
      "Nincs fiók, nincs analitika, nincsenek sütik, és nincs használati korlát.",
    ],
    more: "Olvasd el az adatvédelmi tájékoztatót",
  },
  faq: {
    heading: "Kérdések",
    items: [
      {
        q: "Tényleg működik?",
        a: [
          "Ez személyenként változik. Az eddig megjelent tanulmányok nem mutatják ki, hogy az ilyen kiemeléssel az emberek átlagosan gyorsabban olvasnának vagy jobban értenék a szöveget.",
          "Sokan viszont arról számolnak be, hogy kényelmesebb az olvasás, ritkábban vesztik el, hol tartanak, vagy könnyebb belekezdeni. Ezért nem ígérünk gyorsaságot: egy segítséget kínálunk, amelyet beállíthatsz vagy kikapcsolhatsz. Próbáld ki a bemutatót, és tartsd meg, ami segít.",
        ],
      },
      {
        q: "Kerül valamibe?",
        a: [
          "Nem, és soha nem is fog. Nincs fizetős csomag, sem szókorlát, sem fájlméret-korlát. Szabad szoftver, Apache-2.0 licenc alatt.",
        ],
      },
      {
        q: "Használhatom az e-könyveimmel?",
        a: [
          "Igen. A „Könyv átalakítása” részben kiválasztasz egy EPUB-, TXT-, Markdown- vagy HTML-fájlt, és letöltöd a kiemelt változatát. Az átalakítás a böngésződben történik. A DRM-mel védett könyvek nem alakíthatók át.",
        ],
      },
      {
        q: "Minden nyelven működik?",
        a: [
          "Minden olyan nyelven, amely szóközzel választja el a szavakat, a jobbról balra írt írásokat is beleértve. A kínai, a japán, a thai és más, szóköz nélküli írások változatlanok maradnak.",
        ],
      },
      {
        q: "Mi van, ha képernyőolvasót használok?",
        a: [
          "A szöveg pontosan ugyanúgy hangzik el, mint korábban: egyetlen karakter sem kerül hozzá, és egy sem tűnik el.",
        ],
      },
      {
        q: "Működik a telefonomon?",
        a: ["Igen, az Androidos Firefoxszal. Később önálló alkalmazás is lesz."],
      },
    ],
  },
  footer: {
    license: "Szabad szoftver, Apache-2.0 licenc alatt.",
  },
  uses: {
    title: "Kinek szól",
    intro:
      "Mindenki a maga módján olvas. Íme néhány ötlet, hogyan használhatod az eszközt attól függően, ki vagy és mire kell. Egy közös bennük: ez egy választható segítség, amelyet beállíthatsz vagy kikapcsolhatsz, és semmilyen adatot nem gyűjt.",
    homeHeading: "Kinek szól",
    how: "Hogyan használd",
    care: "Érdemes tudni",
    cases: [
      {
        id: "education",
        title: "Oktatás",
        summary:
          "Pedagógusoknak, iskoláknak és családoknak, akik új anyag készítése nélkül szeretnék hozzáigazítani az olvasnivalót.",
        link: "Ötletek az osztályterembe és otthonra",
        lede: "Pedagógusoknak, fejlesztő szakembereknek és családoknak, akik szeretnék, ha az olvasás egy kicsit kevesebb erőfeszítésbe kerülne, anélkül hogy minden gyereknek külön anyagot kellene készíteniük.",
        steps: [
          "Alakítsd át a meglévő anyagaidat: az olvasmányokat, jegyzeteket vagy könyveket EPUB, TXT, Markdown vagy HTML formátumban, és oszd meg őket úgy, ahogy vannak.",
          "Az órán vetítsd ki a bemutatót a napi szöveggel, és próbáljatok ki közösen különböző erősségeket és stílusokat. Mindenki mondja el, neki mi a legkényelmesebb.",
          "Az iskolai gépeken a bővítmény fiók és regisztráció nélkül működik, és semmilyen adatot nem gyűjt a diákokról.",
          "A „Feladatlapok” részben nagy betűs, barátságos keretes olvasási feladatlapokat készíthetsz, majd kinyomtathatod vagy PDF-be mentheted őket.",
          "Otthon ugyanez a bővítmény segít a házi feladatban és a weben való olvasásban.",
        ],
        notes: [
          "Ez választható segítség: egyes diákoknak segít, másoknak nem. Hagyd, hogy mindenki maga döntsön, és kikapcsolhassa, ha szeretné.",
          "Nem helyettesíti a fejlesztő támogatást, sem a tanulási nehézségek diagnosztizálását.",
        ],
      },
      {
        id: "speech-therapy",
        title: "Logopédusok és más szakemberek",
        summary:
          "Logopédusoknak, pszichológusoknak és tanácsadóknak, akik egyszerű eszközt keresnek a foglalkozásokra.",
        link: "Használat a foglalkozásokon",
        lede: "Logopédusoknak, gyógypedagógusoknak, iskolapszichológusoknak, tanácsadóknak és más szakembereknek, akik olvasási nehézséggel élő embereket támogatnak.",
        steps: [
          "A foglalkozáson illessz be egy szöveget a bemutatóba, és próbáljatok ki együtt több beállítást. Jegyezd fel, melyik a legkényelmesebb: erősség, stílus, kiemelt szavak, sorköz.",
          "Készíts munkaanyagot az átalakítóval, és add át papíron, képernyőn vagy e-könyv-olvasón.",
          "Javasold a bővítményt otthoni használatra, a közösen kiválasztott beállításokkal.",
          "Minden az eszközön fut: sem szöveg, sem kliensadat nem megy át soha szerveren.",
        ],
        notes: [
          "Ez nem terápia és nem olvasásfejlesztő módszer. A munkádban egy támogatási lehetőség lehet a sok közül.",
          "A tanulmányok nem mutatnak átlagos javulást sem az olvasás sebességében, sem a szövegértésben. Kényelmi kérdésként és egyéni preferenciaként mutasd be, és esetről esetre mérd fel.",
        ],
      },
      {
        id: "adults",
        title: "Felnőttek",
        summary:
          "Azoknak, akik szeretnének újra olvasni, de nem tudnak koncentrálni, elvesztik, hol tartanak, vagy hamar elfáradnak.",
        link: "Hogyan kezdj hozzá",
        lede: "Ha többet olvasnál, de nehezen fogsz bele, elveszíted, hol tartasz, háromszor olvasod el ugyanazt a mondatot, vagy a második oldalra elfáradsz, ez segíthet. És ha nem, az is rendben van.",
        steps: [
          "Telepítsd a bővítményt, és kapcsold be az Alt+B billentyűkkel egy téged érdeklő cikken. Kezdd rövid szövegekkel.",
          "Alakíts át egy könyvet, amelyet tényleg el szeretnél olvasni, és tedd fel az e-könyv-olvasódra vagy a telefonodra.",
          "Állítsd az erősséget addig, amíg kényelmes nem lesz. A „További beállítások” alatt növelheted a sorközt és keskenyebbre veheted a sorokat: sokaknak ez ugyanannyit segít, mint a kiemelés.",
          "Ha egy nap fáraszt, kapcsold ki. Ez a te olvasási módod, nem szabály.",
        ],
        notes: [
          "Nem mindenkinek válik be, és ez így rendben van. Adj neki néhány napot, mielőtt döntesz.",
          "Ha úgy gondolod, hogy ADHD vagy diszlexia állhat a nehézségeid mögött, segíthet, ha beszélsz egy szakemberrel.",
        ],
      },
    ],
  },
  worksheets: {
    title: "Olvasási feladatlapok",
    nav: "Feladatlapok",
    intro:
      "Készíts feladatlapokat nagy betűkkel, minden szó elejét kiemelve és barátságos kerettel. Válassz egy mintaszöveget, vagy írd meg a sajátodat, aztán nyomtasd ki vagy töltsd le.",
    editor: "A feladatlap testreszabása",
    example: "Válassz szöveget",
    titleLabel: "Cím",
    textLabel: "Szöveg",
    theme: "Keret",
    themes: {
      none: "Nincs keret",
      simple: "Egyszerű",
      clouds: "Felhők",
      garden: "Kert",
      stars: "Csillagok",
      vehicles: "Autók és teherautók",
    },
    size: "Betűméret",
    sizes: ["Nagy", "Nagyon nagy", "Óriási"],
    nameDate: "Név és dátum hozzáadása",
    name: "Név",
    date: "Dátum",
    lines: "Sorok az íráshoz",
    linesOptions: ["Nincs", "3 sor", "6 sor", "10 sor"],
    preview: "Előnézet",
    showPageSize: "Oldalméret mutatása",
    pageSizes: { portrait: "A4 álló (210 × 297 mm)", landscape: "A4 fekvő (297 × 210 mm)" },
    pageN: "{n}. oldal",
    editHint:
      "Közvetlenül a feladatlapra is írhatsz: kattints a címre vagy a szövegre. A kiemelés akkor kerül rá, amikor befejezted.",
    editTitle: "A feladatlap címe",
    editText: "A feladatlap szövege",
    print: "Nyomtatás vagy mentés PDF-be",
    download: "A feladatlap letöltése",
    printHint:
      "PDF-be mentéshez válaszd a nyomtatási ablakban a „Mentés PDF-ként” lehetőséget. Fehér háttérrel nyomtat, hogy kímélje a tintát.",
    downloadHint:
      "Egy weboldalt töltesz le, amelyet bármikor megnyithatsz és kinyomtathatsz, internet nélkül is.",
    fileName: "feladatlap",
    tabs: { text: "Szöveg", layout: "Elrendezés", emphasis: "Kiemelés" },
    myTexts: "Saját szövegeim",
    save: "Mentés a saját szövegeim közé",
    saved: "„{title}” elmentve a saját szövegeim közé.",
    remove: "Eltávolítás a saját szövegeim közül",
    removed: "„{title}” eltávolítva a saját szövegeim közül.",
    exportTexts: "Saját szövegeim exportálása",
    importTexts: "Szövegek importálása",
    imported: "Importált szövegek: {n}.",
    importEmpty:
      "Ebben a fájlban nincs szöveg. Használj „## ” címekkel tagolt .md fájlt vagy egy .txt fájlt.",
    libraryNote:
      "A szövegeidet csak ez a böngésző tárolja. Exportáld őket, ha másolatot szeretnél, meg akarod osztani őket, vagy át akarod vinni egy másik gépre.",
    exportHeading: "Saját feladatlap-szövegeim",
    levelKey: "Szint",
    textsFileName: "sajat-feladatlap-szovegeim",
    orientation: "Tájolás",
    orientations: { portrait: "Álló", landscape: "Fekvő" },
    overflow:
      "A feladatlap átnyúlik egy második oldalra. Hogy elférjen egyen, rövidítsd a szöveget, válassz kisebb betűméretet, vagy vegyél el sorokat.",
  },
  settings: {
    title: "Olvasási beállítások",
    open: "Olvasási beállítások megnyitása",
    close: "Bezárás",
    note: "A bemutatóra, a feladatlapokra és az átalakítóra vonatkoznak, és csak ebben a böngészőben tárolódnak.",
    presets: "Mentett beállításaim",
    empty:
      "Még nem mentettél beállítást. Adj nevet a mostaninak, hogy egy kattintással visszatérhess hozzá.",
    name: "Név",
    placeholder: "Például: Olvasás az órán",
    save: "Mentés",
    apply: "„{name}” beállítás használata",
    remove: "„{name}” törlése",
    saved: "„{name}” beállítás elmentve.",
    removed: "„{name}” törölve.",
    applied: "Most ez van használatban: „{name}”.",
    reset: "Vissza az alapbeállításokhoz",
    restored: "Alapbeállítások visszaállítva.",
  },
  convert: {
    title: "Könyv átalakítása",
    intro:
      "Válassz egy könyvet vagy dokumentumot, és töltsd le a kiemelt változatát. A fájl soha nem hagyja el az eszközödet: minden ebben a böngészőben történik, méretkorlát nélkül.",
    pick: "Fájl kiválasztása",
    drop: "vagy húzd ide",
    formats: "EPUB, TXT, Markdown vagy HTML",
    selected: "Kiválasztott fájl:",
    output: "Kimeneti formátum",
    outputs: { epub: "EPUB (e-könyv)", html: "HTML (weboldal)", md: "Markdown" },
    options: "A kiemelés módja",
    start: "Átalakítás",
    progress: "Átalakítás: {n} %",
    cancel: "Mégse",
    cancelled: "Az átalakítás megszakítva. Semmi sem lett mentve.",
    done: "Kész. A fájlod elkészült.",
    download: "{name} letöltése",
    errors: {
      unsupported:
        "Ez a formátum nem alakítható át. Válassz EPUB-, TXT-, Markdown- vagy HTML-fájlt.",
      drm: "Ez a könyv DRM-mel (másolásvédelemmel) van ellátva, ezért nem alakítható át. Ha megvásároltad, kérdezd meg az áruházat, adhatnak-e DRM-mentes példányt.",
      invalid:
        "Ezt a fájlt nem sikerült beolvasni. Ellenőrizd, hogy megnyílik-e az olvasódban, vagy próbálj meg egy másikat.",
      failed:
        "Az átalakítás nem sikerült ({detail}). Ha újra előfordul, kérjük, jelezd nekünk a GitHubon.",
    },
    labels: { part: "Rész", contents: "Tartalom" },
    steps: {
      choose: "Válaszd ki a könyvet",
      adjust: "Állítsd be a megjelenést",
      convert: "Alakítsd át és töltsd le",
    },
    previewTitle: "Így kezdődik majd a könyved",
    previewEmpty: "Válassz egy fájlt, és itt megjelenik az első oldala kiemeléssel.",
    previewLoading: "Előnézet készítése…",
    previewNote:
      "Hozzávetőleges nézet: minden olvasó a saját betűtípusával és betűméretével jeleníti meg a könyvet.",
    previewNone: "A fájl elején nem található szöveg, de így is átalakíthatod.",
    change: "Másik fájl választása",
    devices: {
      heading: "Hogyan kerül az olvasódra",
      items: [
        {
          name: "Kindle",
          text: "Használd az Amazon Send to Kindle szolgáltatását (weboldal, alkalmazás vagy e-mail), és válaszd ki az EPUB-fájlt. Az Amazon átalakítja a Kindle-öd számára.",
        },
        {
          name: "Kobo",
          text: "Csatlakoztasd a Kobót a számítógéphez USB-kábellel, és másold rá az EPUB-fájlt. Válaszd le, és a könyv megjelenik a könyvtáradban.",
        },
        {
          name: "PocketBook",
          text: "Másold át USB-n, mint a Kobo esetében, vagy küldd el e-mailben a Send-to-PocketBook szolgáltatással.",
        },
      ],
      calibre:
        "Ha Calibre-t használsz, add hozzá a fájlt a könyvtáradhoz, és küldd át az olvasódra, mint bármelyik másik könyvet.",
    },
  },
  pages: {
    privacy: {
      title: "Adatvédelem",
      body: [
        "Semmilyen adatot nem gyűjtünk. Egyáltalán semmit.",
        "A bővítmény, ez a weboldal és az átalakító teljes egészében az eszközödön fut. Amit olvasol, és a fájlok, amelyeket átalakítasz, soha nem kerülnek sehová: nincsenek szervereink.",
        "Nem használunk analitikát, sütiket, telemetriát, sem más webhelyekről származó betűtípusokat és szkripteket.",
        "A bővítmény a beállításaidat (erősség, stílus, azok a webhelyek, ahol mindig bekapcsolva szeretnéd) a saját böngésződ tárhelyén tárolja. Ha a böngésző szinkronizálása be van kapcsolva, a böngésződ átmásolhatja őket az eszközeid között; mi soha nem látjuk őket.",
        "A bővítmény csak a szükséges engedélyeket kéri. Egy adott webhelyhez vagy az összes webhelyhez csak akkor kér hozzáférést, amikor a „Mindig ezen a webhelyen” vagy „Az összes webhelyen” lehetőséget választod, és ezt bármikor visszavonhatod.",
      ],
    },
    accessibility: {
      title: "Akadálymentesség",
      body: [
        "A kiemelés soha nem változtat azon, amit a képernyőolvasó felolvas: a szöveg karakterről karakterre ugyanaz. Ezt automatikus tesztekkel, valamint minden kiadás előtt NVDA-val és VoiceOverrel is ellenőrizzük.",
        "Minden használható csak billentyűzettel is. A bővítmény az Alt+B billentyűkkel kapcsolható be és ki, a billentyűparancsot pedig a böngésző beállításaiban módosíthatod.",
        "A kiemelés színei magának a szövegnek a színéből származnak, így a kontraszt megmarad világos és sötét módban, valamint minden webhely saját témájában is.",
        "Ez a weboldal az Atkinson Hyperlegible betűtípust használja, amelyet úgy terveztek, hogy a betűk jól megkülönböztethetők legyenek, és követi a rendszered sötét módra és csökkentett mozgásra vonatkozó beállításait.",
        "Ha akadályba ütközöl, kérjük, nyiss egy hibajegyet (issue) a GitHubon: ez hiba, és annak is tekintjük.",
      ],
    },
  },
};
